/** 下拉刷新，触底加载 组件   

 */
<template>
  <div class="qwui-list">
    <div class="qwui-list-content"
         :class="{ 'is-dropped': topDropped }"
         :style="{ 'transform': transform }">
      <slot name="top">
        <div class="qwui-list-top"
             v-if="topMethod">
          <spinner v-if="topStatus === 'loading'"></spinner>
          <span class="qwui-list-text">{{ topText }}</span>
        </div>
      </slot>
      <slot></slot>
      <slot name="bottom">
        <div class="qwui-list-bottom" v-if="bottomMethod">
          <load-more v-if="!!bottomHint"
                     :show-loading="bottomHint.loading"
                     :tip="bottomHint.text"></load-more>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Spinner, LoadMore } from 'vux';

export default {
  name: 'qwui-list',
  components: {
    Spinner,
    LoadMore
  },
  props: {
    maxDistance: {
      type: Number,
      default: 0
    },
    autoFill: {
      type: Boolean,
      default: true
    },
    distanceIndex: {
      type: Number,
      default: 2
    },
    topPullText: {
      type: String,
      default: '下拉刷新'
    },
    topDropText: {
      type: String,
      default: '释放更新'
    },
    topLoadingText: {
      type: String,
      default: '正在加载'
    },
    topDistance: {
      type: Number,
      default: 70
    },
    topMethod: {
      type: Function
    },
    topMethodFlag:{
      type:Boolean,
      default:false
    },
    bottomNomoreText: {
      type: String,
      default: '我可是有底线的'
    },
    bottomNodataText: {
      type: String,
      default: '暂无数据'
    },
    bottomLoadfailText: {
      type: String,
      default: '加载失败'
    },
    bottomLoadingText: {
      type: String,
      default: '正在加载'
    },
    bottomDistance: {
      type: Number,
      default: 200
    },
    bottomMethod: {
      type: Function
    },
    bottomStatus: {
      validator(value) {
        const a = ['loading', 'loadfail', 'nodata', 'nomore'];
        return !value || a.indexOf(value) >= 0;
      }
    }
  },
  data() {
    return {
      translate: 0,
      scrollEventTarget: null,
      containerFilled: false,
      topText: '',
      topDropped: false,
      direction: '',
      startY: 0,
      startScrollTop: 0,
      currentY: 0,
      topStatus: ''
    };
  },
  computed: {
    transform() {
      return this.translate === 0
        ? null
        : `translate3d(0, ${this.translate}px, 0)`;
    },
    bottomHint() {
      let _bottomHint;
      switch (this.bottomStatus) {
        case 'loading':
          _bottomHint = {
            loading: true,
            text: this.bottomLoadingText
          };
          break;
        case 'loadfail':
          _bottomHint = {
            loading: false,
            text: this.bottomLoadfailText
          };
          break;
        case 'nomore':
          _bottomHint = {
            loading: false,
            text: this.bottomNomoreText
          };
          break;
        case 'nodata':
          _bottomHint = {
            loading: false,
            text: this.bottomNodataText
          };
          break;
        default:
      }
      return _bottomHint;
    },
    stopLoadMore() {
      return !!this.bottomStatus;
    }
  },
  watch: {
    topStatus(val) {
      this.$emit('top-status-change', val);
      switch (val) {
        case 'pull':
          this.topText = this.topPullText;
          break;
        case 'drop':
          this.topText = this.topDropText;
          break;
        case 'loading':
          this.topText = this.topLoadingText;
          break;
        default:
      }
    }
  },
  methods: {
    onTopLoaded() {
      this.translate = 0;
      setTimeout(() => {
        this.topStatus = 'pull';
      }, 200);
    },
    getScrollEventTarget(element) {
      let currentNode = element;
      while (
        currentNode &&
        currentNode.tagName !== 'HTML' &&
        currentNode.tagName !== 'BODY' &&
        currentNode.nodeType === 1
      ) {
        const overflowY = document.defaultView.getComputedStyle(currentNode)
          .overflowY;
        if (overflowY === 'scroll' || overflowY === 'auto') {
          return currentNode;
        }
        currentNode = currentNode.parentNode;
      }
      return window;
    },
    getScrollTop(element) {
      element = element || this.scrollEventTarget;
      if (element === window) {
        return Math.max(
          window.pageYOffset || 0,
          document.documentElement.scrollTop
        );
      }
      return element.scrollTop;
    },
    setScrollTop(value) {
      this.scrollEventTarget.scrollTop = value;
    },
    getVisibleHeight(element) {
      if (element === window) {
        return document.documentElement.clientHeight;
      }
      return element.clientHeight;
    },
    bindTouchEvents() {
      if(this.deviceType == 'mobile'){
        this.$el.addEventListener('touchstart', this.handleTouchStart);
        this.$el.addEventListener('touchmove', this.handleTouchMove);
        this.$el.addEventListener('touchend', this.handleTouchEnd);
        this.scrollListener = this.throttle(this.doCheckScroll, 200);
        this.scrollEventTarget.addEventListener('scroll', this.scrollListener);

      }else if(this.deviceType == 'pc'){
        this.$el.addEventListener('mousedown', this.handleTouchStart);
        this.$el.addEventListener('mousemove', this.handleTouchMove);
        this.$el.addEventListener('mouseup', this.handleTouchEnd);
        this.scrollListener = this.throttle(this.doCheckScroll, 200);
        this.scrollEventTarget.addEventListener('scroll', this.scrollListener);
      }
    },
    init() {
      this.topStatus = 'pull';
      this.topText = this.topPullText;
      this.scrollEventTarget = this.getScrollEventTarget(this.$el);
      this.fillContainer();
      this.bindTouchEvents();
    },
    fillContainer() {
      if (this.autoFill) {
        this.$nextTick(() => {
          if (this.scrollEventTarget === window) {
            this.containerFilled =
              this.$el.getBoundingClientRect().bottom >=
              document.documentElement.getBoundingClientRect().bottom;
          } else {
            this.containerFilled =
              this.$el.getBoundingClientRect().bottom >=
              this.scrollEventTarget.getBoundingClientRect().bottom;
          }
          if (!this.containerFilled&&this.bottomMethod) {
            this.bottomMethod();
          }
        });
      }
    },
    handleTouchStart(event) {
      if(this.deviceType == 'mobile'){
        this.startY = event.touches[0].clientY;
        this.startScrollTop = this.getScrollTop(this.scrollEventTarget);
        if (this.topStatus !== 'loading') {
          this.topStatus = 'pull';
          this.topDropped = false;
        }
      }else if(this.deviceType == 'pc'){
        this.pcmove.flag = true;
        this.startY = event.clientY;
        this.startScrollTop = this.getScrollTop(this.scrollEventTarget);
        if (this.topStatus !== 'loading') {
          this.topStatus = 'pull';
          this.topDropped = false;
        }
      }
    },
    handleTouchMove(event) {
      if(this.deviceType == 'mobile'){
        if (
        this.startY < this.$el.getBoundingClientRect().top &&
        this.startY > this.$el.getBoundingClientRect().bottom
      ) {
        return;
      }
      this.currentY = event.touches[0].clientY;
      const distance = (this.currentY - this.startY) / this.distanceIndex;
      this.direction = distance > 0 ? 'down' : 'up';
      if (
        typeof this.topMethod === 'function' &&
        this.direction === 'down' &&
        this.getScrollTop(this.scrollEventTarget) === 0 &&
        this.topStatus !== 'loading'
      ) {
        if(!this.topMethodFlag){
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (this.maxDistance > 0) {
          this.translate =
            distance <= this.maxDistance
              ? distance - this.startScrollTop
              : this.translate;
        } else {
          this.translate = distance - this.startScrollTop;
        }
        if (this.translate < 0) {
          this.translate = 0;
        }
        this.topStatus = this.translate >= this.topDistance ? 'drop' : 'pull';
      }
      this.$emit('translate-change', this.translate);

      }else if(this.deviceType == 'pc'){
        if(!this.pcmove.flag){
          return;
        }
        if (
        this.startY < this.$el.getBoundingClientRect().top &&
        this.startY > this.$el.getBoundingClientRect().bottom
      ) {
        return;
      }
      this.currentY = event.clientY;
      const distance = (this.currentY - this.startY) / this.distanceIndex;
      this.direction = distance > 0 ? 'down' : 'up';
      if (
        typeof this.topMethod === 'function' &&
        this.direction === 'down' &&
        this.getScrollTop(this.scrollEventTarget) === 0 &&
        this.topStatus !== 'loading'
      ) {
        if(!this.topMethodFlag){
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (this.maxDistance > 0) {
          this.translate =
            distance <= this.maxDistance
              ? distance - this.startScrollTop
              : this.translate;
        } else {
          this.translate = distance - this.startScrollTop;
        }
        if (this.translate < 0) {
          this.translate = 0;
        }
        this.topStatus = this.translate >= this.topDistance ? 'drop' : 'pull';
      }
      this.$emit('translate-change', this.translate);
      } 
    },
    handleTouchEnd() {
      if(this.deviceType == 'pc'){
        this.pcmove.flag = false;
      }
      
      if (
        this.direction === 'down' &&
        this.getScrollTop(this.scrollEventTarget) === 0 &&
        this.translate > 0
      ) {
        this.topDropped = true;
        if (this.topStatus === 'drop') {
          this.translate = '50';
          this.topStatus = 'loading';
          this.topMethod();
        } else {
          this.translate = '0';
          this.topStatus = 'pull';
        }
      }
      this.$emit('translate-change', this.translate);
      this.direction = '';
    },
    doCheckScroll() {
      if (this.stopLoadMore) return;
      const viewportScrollTop = this.getScrollTop(this.scrollEventTarget);
      const viewportBottom =
        viewportScrollTop + this.getVisibleHeight(this.scrollEventTarget);
      let shouldTrigger = false;
      shouldTrigger =
        this.scrollEventTarget.scrollHeight - viewportBottom <=
        this.bottomDistance;
      if (shouldTrigger&&this.bottomMethod) {
        this.bottomMethod();
      }
    },
    throttle(fn, delay) {
      var now, lastExec, timer, context, args; //eslint-disable-line

      const execute = function() {
        fn.apply(context, args);
        lastExec = now;
      };

      return function() {
        context = this;
        args = arguments;

        now = Date.now();

        if (timer) {
          clearTimeout(timer);
          timer = null;
        }

        if (lastExec) {
          const diff = delay - (now - lastExec);
          if (diff < 0) {
            execute();
          } else {
            timer = setTimeout(() => {
              execute();
            }, diff);
          }
        } else {
          execute();
        }
      };
    },
    pcOrmobile(){
      if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        this.deviceType = 'mobile';
      }
      else {
        this.deviceType = 'pc';
      }
    }
  },
  mounted() {
    this.deviceType = '';
    this.pcmove = {};
    this.pcOrmobile();
    this.init();
    // document.body.ontouchmove = function(event){
    //   event.preventDefault();
    // }
    // var startX = 0, startY = 0;
    // //touchstart事件
    // function touchSatrtFunc(evt) {
    //     try
    //     {
    //         //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
    //         var touch = evt.touches[0]; //获取第一个触点
    //         var x = Number(touch.pageX); //页面触点X坐标
    //         var y = Number(touch.pageY); //页面触点Y坐标
    //         //记录触点初始位置
    //         startX = x;
    //         startY = y;

    //     } catch (e) {
    //         alert('touchSatrtFunc：' + e.message);
    //     }
    // }
    // document.addEventListener('touchstart', touchSatrtFunc, false);
    // 然后对允许滚动的条件进行判断，这里讲滚动的元素指向body
  // var _ss = document.querySelector('.qwui-list');
  //   _ss.ontouchmove = function (ev) {
  //       var _point = ev.touches[0],
  //               _top = _ss.scrollTop;
  //       // 什么时候到底部
  //       var _bottomFaVal = _ss.scrollHeight - _ss.offsetHeight;
  //       // 到达顶端
  //       if (_top === 0) {
  //           // 阻止向下滑动
  //           if (_point.clientY > startY) {
  //               ev.preventDefault();
  //           } else {
  //               // 阻止冒泡
  //               // 正常执行
  //               ev.stopPropagation();
  //           }
  //       } else if (_top === _bottomFaVal) {
  //           // 到达底部 如果想禁止页面滚动和上拉加载，讲这段注释放开，也就是在滚动到页面底部的制售阻止默认事件
  //           // 阻止向上滑动
  //           // if (_point.clientY < startY) {
  //           //     ev.preventDefault();
  //           // } else {
  //           //     // 阻止冒泡
  //           //     // 正常执行
  //           //     ev.stopPropagation();
  //           // }
  //       } else if (_top > 0 && _top < _bottomFaVal) {
  //           ev.stopPropagation();
  //       } else {
  //           ev.preventDefault();
  //       }
  //   };
  }
};
</script>
<style lang="scss" scoped>
.qwui-list {
  overflow: hidden;
  min-height: 100%;
  .qwui-list-content {
    is-dropped {
      transition: 0.2s;
    }
  }
  .qwui-list-top,
  .qwui-list-bottom {
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .qwui-list-top {
    margin-top: -50px;
  }
  .qwui-list-bottom {
    // margin-bottom: -50px;
  }
  .qwui-list-spinner {
    display: inline-block;
    margin-right: 5px;
    vertical-align: middle;
  }
  .qwui-list-text {
    vertical-align: middle;
  }
}
</style>
