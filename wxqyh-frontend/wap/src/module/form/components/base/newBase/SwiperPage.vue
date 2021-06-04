<template>
  <div class="swiper-page">
    <div class="tab-nav" id="tabNav" :style="{top: top + 'px'}">
      <div class="nav-item" 
        v-for="(text, index) in navs" 
        :key="index" 
        :class="{active: currentTab == index}" 
        @click="changeTab(index)"
      >
        {{text}}
      </div>
      <div class="tab-active-bar" id="tabActiveBar"></div>
    </div>
    <div class="swiper-container"
      :class="{'no-record': showrecord}"
      :style="styleObj"
      ref="swiper-el"
    >
      <!-- 内容 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwiperPage',
  props: {
    navs: {
      type: Array,
      default() {
        return []
      }
    },
    currentTab: {
      type: Number,
      default: 0
    },
    showrecord: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number
    },
    resistanceRatio: {  //回弹效果
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      $activeBar: null,
      mySwiper: null,
      styleObj: {},
      once: true
    };
  },
  created() {
    this.styleObj.top = this.top + 46 + 'px';
    if(typeof this.bottom === "number") this.styleObj.bottom = this.bottom + 'px';
  },
  mounted() {
    let _this = this;
    this.$activeBar = $('#tabActiveBar');
    this.mySwiper = new Swiper(this.$refs["swiper-el"], {
      observer: true,
      resistanceRatio: _this.resistanceRatio,
      initialSlide: _this.currentTab,
      on: {
        setTranslate: function(translate) {
          _this.$activeBar.css('transform', 'translate3d(' + -0.5 * translate + 'px, 0, 0)');
        },
        setTransition: function() {
          if(_this.currentTab != 0 && _this.once) {
            _this.$activeBar.css('transition-duration', '0ms');
            _this.once = false;
          }else {
            _this.$activeBar.css('transition-duration', '300ms');
          }
        },
        slideChange: function() {
          _this.$emit('slideChange', this.activeIndex);
        },
        slideChangeTransitionEnd: function(){ //切换结束后，将前一个slide滚动条重置
          _this.$activeBar.css('transition-duration', '0s')
          this.slides[this.previousIndex].scrollTop = 0;
        },
      }
    });
  },
  methods: {
    changeTab(index) {
      if(index == this.currentTab) return;
      this.mySwiper.slideTo(index);
    },
  }
}

</script>
<style lang='scss' scoped>
.swiper-page {
  .tab-nav {
    display: flex;
    position: relative;
    height: 44px;
    background-color: #fff;
    border-top: 1px solid #f7f8fa;
    border-bottom: 1px solid #f7f8fa;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    @media screen and (min-width: 1024px){
      margin: 0 auto;
      width: 740px;
    }
    .nav-item {
      display: block;
      flex: 1;
      color: rgb(161, 170, 192);
      font-size: 14px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: rgb(10, 23, 53);
      }
    }
    .tab-active-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 12.5%;
      margin-left: 18.75%;
      background-color: rgb(85, 133, 240);
      border-radius: 3px;
      transition-property: all;
    }
  }
  .swiper-container {
    width: 100%;
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 49px;
    @media screen and (min-width: 1024px){
      margin: 0 auto;
      width: 740px;
    }
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
      bottom: 83px;
    }
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 896px) and (device-width: 414px) {
      bottom: 83px;
    }
    &.no-record {
      background: #fff;
    }
    .swiper-slide {
      overflow-y: auto;
    }
  }
}


</style>