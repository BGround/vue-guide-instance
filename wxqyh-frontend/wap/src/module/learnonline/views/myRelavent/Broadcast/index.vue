<template>
<div class="wrap qwui-lean_broadcast" ref="broadcast">
  <!-- 展示页 -->
  <div class="broadcast"
    v-show="nowIndex<nowData.length"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
    @mousedown="mousedown"
    @mousemove="mousemove"
    @mouseup="mouseup"
    @mouseleave="mouseleave"
  >
    <!-- 轮播内容 -->
    <broadcast-content
      class="content"
      :dataList="nowData"
      :nowIndex="nowIndex"
      :title="nowTitle"
      :parentWidth="clientWidth"
      :relativeDisplacement="relativeDisplacement"
    ></broadcast-content>

    <!-- 点页码 -->
    <dot-page
      class="dot_page"
      :dataList="nowData"
      :nowIndex.sync="nowIndex"
    ></dot-page>
  </div>


  <!-- 完成页 -->
  <broadcast-finish
    v-show="nowIndex>=nowData.length"
    :title="nowTitle"
    @back="back"
  ></broadcast-finish>

</div>
</template>

<script>
import BroadcastContent from './BroadcastContent'; // 轮播展示内容组件
import DotPage from './DotPage'; // 点页码组件
import BroadcastFinish from './BroadcastFinish'; // 完成页

export default {
  name: 'QwBroadcast',
  components: {
    BroadcastContent,
    DotPage,
    BroadcastFinish
  },
  data(){
    return {
      key: '', // 属性值
      clientWidth: this.$refs.broadcast && this.$refs.broadcast.clientWidth,
      data: {
        learningTasks: {
          arr: [
            {src: require('assets/images/learnonline/task_phone_1.png'), relativeDisplacement: 20},
            {src: require('assets/images/learnonline/task_phone_2.png')},
            {src: require('assets/images/learnonline/task_phone_3.png')},
            {src: require('assets/images/learnonline/task_phone_4.png')},
            {src: require('assets/images/learnonline/task_phone_5.png')},
            {src: require('assets/images/learnonline/task_phone_6.png')},
            {src: require('assets/images/learnonline/task_phone_7.png')},
          ],
          title: this.$t('i18n.learningTasks')
        },
        examEvaluation: {
          arr: [
            {src: require('assets/images/learnonline/test_phone_1.png')},
            {src: require('assets/images/learnonline/test_phone_2.png')},
            {src: require('assets/images/learnonline/test_phone_3.png')},
            {src: require('assets/images/learnonline/test_phone_4.png')},
            {src: require('assets/images/learnonline/test_phone_5.png'), relativeDisplacement: 12},
            {src: require('assets/images/learnonline/test_phone_6.png')},
            {src: require('assets/images/learnonline/test_phone_7.png')},
            {src: require('assets/images/learnonline/test_phone_8.png'), relativeDisplacement: 6},
            {src: require('assets/images/learnonline/test_phone_9.png')},
            {src: require('assets/images/learnonline/test_phone_10.png')},
          ],
          title: this.$t('i18n.examEvaluation')
        },
        pretestPractice: {
          arr: [
            {src: require('assets/images/learnonline/practice_phone_1.png')},
            {src: require('assets/images/learnonline/practice_phone_2.png')},
            {src: require('assets/images/learnonline/practice_phone_3.png'), relativeDisplacement: -7},
            {src: require('assets/images/learnonline/practice_phone_4.png'), relativeDisplacement: -2},
            {src: require('assets/images/learnonline/practice_phone_5.png')},
            {src: require('assets/images/learnonline/practice_phone_6.png')},
            {src: require('assets/images/learnonline/practice_phone_7.png'), relativeDisplacement: -4},
          ],
          title: this.$t('i18n.pretestPractice')
        }
      },
      nowIndex: 0, // 当前选项
      mouseCoordinate: { // 鼠标坐标
        touchstart: {x: 0, y: 0},
        touchmove: {x: 0, y: 0},
        touchend: {x: 0, y: 0},
        pcDown: false, // Pc端鼠标按下
      },
    };
  },
  computed: {
    // 当前页面数据
    nowData() {
      return this.data[this.key]? this.data[this.key].arr: [];
    },
    nowTitle() {
      return this.data[this.key]? this.data[this.key].title: '';
    },
    // 相对位移
    relativeDisplacement() {
      let mouseCoordinate = this.mouseCoordinate;
      return mouseCoordinate.touchmove.x -  mouseCoordinate.touchstart.x
    }
  },
  methods:{
    // 监控窗口大小更改更新
    resize() {
      if (this.$refs && this.$refs.broadcast) {
        this.clientWidth = this.$refs.broadcast.clientWidth;
      }
    },
    // 移动端事件
    touchstart(event) {
      let e = event || window.event;
      let x = e.changedTouches[0].pageX;
      let y = e.changedTouches[0].pageY;
      this.mouseCoordinate.touchstart = {x: x, y: y};

      // 也把移动值初始化
      this.mouseCoordinate.touchmove = {x: x, y: y};
    },
    touchmove(event) {
      let e = event || window.event;
      let x = e.changedTouches[0].pageX;
      let y = e.changedTouches[0].pageY;
      this.mouseCoordinate.touchmove = {x: x, y: y};
    },
    touchend(event) {
      let e = event || window.event;
      let x = e.changedTouches[0].pageX;
      let y = e.changedTouches[0].pageY;
      this.mouseCoordinate.touchend = {x: x, y: y};
      this.tryToChangePage()

      // 也把移动值初始化
      this.mouseCoordinate.touchstart = {x: x, y: y};
      this.mouseCoordinate.touchmove = {x: x, y: y};
    },

    // 鼠标事件
    mousedown(event) {
      let e = event || window.event;
      this.mouseCoordinate.pcDown = true;
      let x = e.clientX;
      let y = e.clientY;
      this.mouseCoordinate.touchstart = {x: x, y: y};

      // 也把移动值初始化
      this.mouseCoordinate.touchmove = {x: x, y: y};
    },
    mousemove(event) {
      let e = event || window.event;
      if (this.mouseCoordinate.pcDown) {
        let x = e.clientX;
        let y = e.clientY;
        this.mouseCoordinate.touchmove = {x: x, y: y};
      }
    },
    mouseup(event) {
      let e = event || window.event;
      this.mouseCoordinate.pcDown = false;
      let x = e.clientX;
      let y = e.clientY;
      this.mouseCoordinate.touchend = {x: x, y: y};
      this.tryToChangePage();

      // 也把移动值初始化
      this.mouseCoordinate.touchstart = {x: x, y: y};
      this.mouseCoordinate.touchmove = {x: x, y: y};
    },
    mouseleave() { // 鼠标离开文档不会触发up，在leave触发
      let stringify = JSON.stringify(this.mouseCoordinate.touchmove);
      this.mouseCoordinate.pcDown = false;
      this.mouseCoordinate.touchend = JSON.parse(stringify);
      this.tryToChangePage();

      this.mouseCoordinate.touchstart = JSON.parse(stringify);
    },

    // 判断是否进入换页
    tryToChangePage() {
      let standard = this.clientWidth * 0.3; // 换页的标准距离
      let moveWidth = this.mouseCoordinate.touchend.x - this.mouseCoordinate.touchstart.x; // 手指弹起和按下的移动距离
      // 判断是否达到换页标准
      if (Math.abs(moveWidth) >= standard) {
        let dataLength = this.nowData.length;
        moveWidth < 0? ++this.nowIndex:
                       this.nowIndex > 0 && --this.nowIndex;
      }
    },

    // 后退
    back() {
      this.$router.back();
    }
  },
  created() {
    this.key = this.$route.params.key;
  },
  mounted() {
    this.$nextTick(() => {
      this.clientWidth = this.$refs.broadcast.clientWidth;
      window.addEventListener('resize', this.resize);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  }
};

</script>

<style lang="scss" scoped>

.qwui-lean_broadcast {
  min-height: 100vh;
  background: url('~assets/images/learnonline/img_learnonline_broadcast_bg.png') no-repeat;
  background-size: 100% 100%;
  user-select: none;

  .content {
    //  height: 530px;
  }
  .dot_page {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
