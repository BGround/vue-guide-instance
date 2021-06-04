<template>
  <div>
    <div class="tab_flow">
      <div class="tab_group"
           :class="{'flex_item':length < 5}"
           :style="{transform: 'translateX(' + moveDistance + 'px)'}"
           ref="tabs"
           onselectstart="return false;"
           @mousedown="moveThis($event)"
           @touchstart="start($event)"
           @touchmove="move($event)"
           @touchend="end($event)">
        <slot></slot>
        <div class="bottom_bar"
             :style="{
                  left: barLeft + 'px',
                  width: barWidth + 'px'
                }">
          <span class="bottom_bar_span"
                :class="{
                    'full':full
                  }"></span>
        </div>
      </div>
      <div class="tab_option" @click="showOption" v-if="length > 4">
      </div>
    </div>
    <transition name="fade">
      <div class="option" v-if="isShow" @click.stop="isShow = false">
        <div class="option_title">
          <div class="left">切换内容</div>
          <div class="right" @click="isShow = false">×</div>
        </div>
        <div class="scroll_this">
          <div class="option_content clearfix" v-for="title in classify">
            <div class="item_title">{{title}}</div>
            <div class="item" v-for="(item,i) in tabs" v-if="item.classification == title">
              <div class="item_content"
                   :class="{'current_index': i == index}"
                   @click="clickThis(item)">
                <div class="item_text">{{item.text}}</div>
              </div>
            </div>
            <div class="item" v-for="(item,i) in tabs" v-if="!item.classification && title == '其他分类'">
              <div class="item_content"
                   :class="{'current_index': i == index}"
                   @click="clickThis(item)">
                <div class="item_text">{{item.text}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  export default {
    name: 'qwui-group-tab',
    props:{
      //默认选中第几个
      selected:{
        type:[String,Number],
        default:0
      },
      //底部线是否100%填充
      full:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        index: 0, //当前点击
        length: 0, //总共的tab数
        moveDistance:0, //tab移动距离（translateX）
        oldClientX:0, //触碰时手指的位置
        oldLeft:0, //触碰时旧的translateX
        tabWidth:0, //tab_group宽度
        barLeft:0, //bar左部距离
        barWidth:0,
        isShow:false, //option显示控制
        tabs:[], //tabs数组
        classify:[], //tab分类数组
        isFirst:true, //第一次进入需分类
      }
    },
    watch:{
      selected:function (val) {
        var temp = {
          text: Object.values(this.$children)[val].text,
          value: Object.values(this.$children)[val].value
        }
        this.clickThis(temp)
      }
    },
    methods:{
      handleChange(val) {
        var self = this, flag = false;
        self.length = Object.values(this.$children).length
        self.barLeft = 0;
        self.tabs = [];
        Object.values(this.$children).forEach(function (e,index) {
          self.tabs.push({
            text:e.text,
            value:e.value,
            classification:e.classification
          });
          if(e.text == val){ //改变底部样式
            self.barWidth = e.$el.clientWidth;
            self.index = index;
            flag = true
          } else if(!flag){
            self.barLeft += e.$el.clientWidth
          }
        })
      },
      //点击显示option
      showOption(){
        this.isShow = true;
        if(this.isFirst) {
          let self = this, flag = false;
          self.tabs.forEach(function (e) {
            if (e.classification) {
              self.classify.find(item => {
                return item == e.classification
              }) ? ''
                : self.classify.push(e.classification)
            } else {
              flag = true;
            }
          })
          flag?self.classify.push('其他分类'):''
          self.isFirst = false
        }
      },
      //点击某个option
      clickThis(item){
        this.handleChange(item.text);
        this.isShow = false;
        let newPosition = document.documentElement.clientWidth/2 - this.barLeft - this.barWidth/2;
        this.tabWidth = this.$refs.tabs.scrollWidth;
        if(newPosition >= 0){ //不能移出左边
          this.moveDistance = 0
        } else if(document.documentElement.clientWidth - newPosition > this.tabWidth + 58){ //不能移出右边
          this.moveDistance = document.documentElement.clientWidth - this.tabWidth - 58
          this.moveDistance >= 0 ? this.moveDistance = 0 : ''
        } else {
          this.moveDistance = newPosition
        }
        Object.values(this.$children).forEach(function (e) {
          e.model = item.text
        })
        this.$emit("click", item.value, item.text, this.index)
      },
      //移动端事件
      start:function (e) {
        if(this.length > 4 && e.currentTarget.clientWidth > document.documentElement.clientWidth - 58) {
          e = e || window.event;
          document.documentElement.style.overflow='hidden'
          this.oldClientX = e.targetTouches[0].clientX; //触碰时手指的位置
          this.oldLeft = this.moveDistance //触碰时旧的translateX
          this.tabWidth = e.currentTarget.clientWidth
        }
      },
      move:function (ev) {
        if(this.length > 4 && this.tabWidth > document.documentElement.clientWidth - 58) {
          let distance = ev.changedTouches[0].clientX - this.oldClientX; //手指移动的距离
          distance *= 2;
          let newLeft = this.oldLeft + distance; //新的translateX
          if(newLeft >= 0){ //不能移出左边
            this.moveDistance = 0
          } else if(document.documentElement.clientWidth - newLeft > this.tabWidth + 58){ //不能移出右边
            this.moveDistance = document.documentElement.clientWidth - this.tabWidth - 58
          } else {
            this.moveDistance = newLeft
          }
        }
      },
      end(ev){
        document.documentElement.style.overflow=''
      },
      //PC端事件
      moveThis:function (e) {
        if(this.length > 4 && e.currentTarget.clientWidth > document.documentElement.clientWidth - 58) {
          e = e || window.event;
          this.oldClientX = e.clientX; //触碰时手指的位置
          this.oldLeft = this.moveDistance; //触碰时旧的translateX
          this.tabWidth = e.currentTarget.clientWidth
          var self = this;
          document.onmousemove = function (ev) { /*注册document的mousemove事件*/
            let distance = ev.clientX - self.oldClientX; //手指移动的距离
            distance *= 2;
            let newLeft = self.oldLeft + distance; //新的translateX
            if(newLeft >= 0){ //不能移出左边
              self.moveDistance = 0
            } else if(document.documentElement.clientWidth - newLeft > self.tabWidth + 58){ //不能移出右边
              self.moveDistance = document.documentElement.clientWidth - self.tabWidth - 58
            } else {
              self.moveDistance = newLeft
            }
          };
          document.onmouseup = function () {/*鼠标放开清除事件*/
            document.onmousemove = null;
            document.onmouseup = null;
          };
        }
      }
    }
  }
</script>
<style src="./tab.scss" lang="scss">
</style>
