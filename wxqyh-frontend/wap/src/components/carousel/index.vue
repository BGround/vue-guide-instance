<template lang="html">
  <div class="qwui-carousel">
    <v-touch class="qwui-carousel-box" ref="items"
      :class="{'qwui-carousel-animation': isEnd}"
      :style="{ left: left + 'px' }"
      @panstart="start"
      @panmove="move"
      @panend="end"
    >
      <qw-carousel-item class="qwui-carousel-item"
        :id="lastOne.id"
        :cover="lastOne.cover"
        :title="lastOne.title"
      ></qw-carousel-item>
      <slot></slot>
      <qw-carousel-item class="qwui-carousel-item"
        :id="firstOne.id"
        :cover="firstOne.cover"
        :title="firstOne.title"
      ></qw-carousel-item>
    </v-touch>
  </div>
</template>

<script>
import Vue from 'vue';
import VueTouch from 'vue-touch';

import QwCarouselItem from './item';

Vue.use(VueTouch);

export default {
  name: 'QwCarousel',
  components: {
    QwCarouselItem
  },
  props: {
    // 轮播时间间隔
    interval: {
      type: Number,
      default: 5000
    }
  },
  data () {
    return {
      // 第一张图
      firstOne: {
        id: '',
        cover: '',
        title: ''
      },
      // 最后一张图
      lastOne: {
        id: '',
        cover: '',
        title: ''
      },
      // 是否已经初始化
      isInit: false,
      // 当前页面
      index: 0,
      // 图片数量
      length: 0,
      // 偏移值
      left: 0,
      // 与上次对比的偏移量
      last: 0,
      // 组件宽度
      width: 0,
      // 是否停止操作
      isEnd: false,
      // 开始时间
      startTime: 0,
      timer: undefined
    }
  },
  methods: {
    // 开始触发
    start (e) {
      this.isEnd = false;
      this.last = e.center.x;
      this.startTime = e.timeStamp;
    },
    // 移动
    move (e) {
      let last = e.center.x;
      this.left += last - this.last;
      this.last = last;
    },
    //  结束
    end (e) {
      this.move(e);

      this.isEnd = true;

      if (e.timeStamp - this.startTime <= 250) {
        // 移动时间小于250毫秒直接移动
        if (e.deltaX < 0) {
          this.index++;
        } else {
          this.index--;
        }
      } else {
        // 移动时间大于250毫秒返回最近的点
        this.index = - Math.round(this.left / this.width);
      }

      this.fixed();
    },
    // 修正位置
    fixed () {
      this.back();

      let flag = false

      if (this.index > this.length) {
        this.index = 1;
        flag = true;
      } else if (this.index < 1) {
        this.index = this.length;
        flag = true;
      }

      this.$emit('update-index', this.index);

      if (flag) {
        setTimeout(() => {
          this.isEnd = false;
          this.back();
        }, 250);
      }
    },
    // 返回整点位置
    back () {
      this.left = - this.index * this.width;
      this.setCarousel()
    },
    // 开始计时任务
    setCarousel () {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.index++
        this.isEnd = true;
        this.fixed();
      }, this.interval);
    },
    // 重置
    resize () {
      console.log(123);
    }
  },
  updated () {
    let slot = this.$slots.default;
    if (!this.isInit && slot && slot.length > 0) {
      // 初始化第一张和最后一张，用于循环播放
      this.firstOne = slot[0].componentOptions.propsData;
      this.lastOne = slot[slot.length - 1].componentOptions.propsData;

      // 初始化图片位置
      let children = this.$refs.items.$el.children
      Array.prototype.map.call(children, (el, index) => {
        Object.assign(el.style, {
          position: 'absolute',
          top: '0',
          left: (index * 100) + '%'
        });
      });
      this.length = slot.length;
      this.width = this.$el.offsetWidth;

      // 跳到第一张
      this.isEnd = false;
      this.index = 1;
      this.back();

      // 只触发一次
      this.isInit = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-carousel-box {
  position: absolute;
  width: 100%;
  height: 100%;
  left: -100%;

  &.qwui-carousel-animation {
    transition: .2s;
  }
}
</style>
