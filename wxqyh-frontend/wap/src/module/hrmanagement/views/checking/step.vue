<template>
  <div class="step">
    <swiper :options="swiperOption" ref="mySwiper">
      <!-- slides -->
      <swiper-slide>
        <li class="step-start">
          <div class="ui-step-line"></div>
          <div class="ui-step-cont">
            <span class="ui-step-cont-number"></span>
            <span class="ui-step-cont-text">发起</span>
          </div>
        </li>
      </swiper-slide>
      <swiper-slide v-for="(item, i) in flowList" :key="i">
        <li
          :class="{'step-active':item.flowOrder <= currentNodes,'line-active':item.flowOrder >= currentNodes,'complete-icon':item.flowOrder <= currentNodes && item.endTime !== null}"
        >
          <div class="ui-step-line" v-show="i !== flowList.length-1"></div>
          <div class="ui-step-cont">
            <span class="ui-step-cont-number"></span>
            <span class="ui-step-cont-text" v-if="item.type == 1">考核对象本人
              <br><i v-if="item.hasToComment">(需评)</i>
            </span>
            <span class="ui-step-cont-text" v-else>指定评分人
              <br><i v-if="item.hasToComment">(需评)</i>
            </span>
          </div>
        </li>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    swiper,
    swiperSlide
  },
  props: {
    currentNodes: {
      type: Number,
      default:1
    },
    flowList: {
      type: Array
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 4,
        freeMode: true
      },
    };
  }
};
</script>
<style lang="scss" scoped>
.step {
  border-bottom: 8px solid #f7f8fa;
  height: 80px;
  padding-left: 15px;
  ol {
    list-style: none outside none;
    margin: 0;
    padding: 0;
  }
  /deep/ .swiper-container {
    padding-left: 15px;
  }
  /deep/ .swiper-wrapper {
    height: 80px;
  }
  .ui-step {
    color: #b7b7b7;
    padding: 0 45px;
    margin-bottom: 35px;
    position: relative;
  }
  .ui-step:after {
    display: block;
    content: "";
    height: 0;
    font-size: 0;
    clear: both;
    overflow: hidden;
    visibility: hidden;
  }
  .ui-step li {
    float: left;
    position: relative;
  }

  .ui-step-line {
    height: 2px;
    background-color: #e0e0e0;
    margin-top: 7px;
  }
  .step-end .ui-step-line {
    display: none;
  }
  .ui-step-cont {
    width: 120px;
    position: absolute;
    top: 0;
    text-align: center;
  }
  .ui-step-cont-number {
    display: inline-block;
    *zoom: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: #fff;
    background: url(~assets/images/ic_liucheng_gray@2x.png) center;
    border-radius: 50%;
    box-sizing: border-box;
    background-size: 100%;
  }
  .ui-step-cont-text {
    display: inline-block;
    position: relative;
    top: 22px;
    left: -50px;
    font-size: 12px;
    color: #b2b9c8;
  }
  .step-start .ui-step-cont-number {
    background: url(~assets/images/ic_liucheng_complete@2x.png) center;
    background-size: 100%;
  }
  .step-start .ui-step-line {
    background-color: #5684f0;
  }
  .step-start .ui-step-cont-text {
    color: #0a1735;
  }
  .step-active .ui-step-cont-number {
    background: url(~assets/images/ic_liucheng_active@2x.png) center;
    background-size: 100%;
  }
  .complete-icon .ui-step-cont-number {
    background: url(~assets/images/ic_liucheng_complete@2x.png) center;
    background-size: 100%;
  }
  .step-active .ui-step-cont-text {
    color: #0a1735;
  }
  .step-active .ui-step-line {
    background-color: #5684f0;
  }
  .line-active .ui-step-line {
    background-color: #e0e0e0;
  }
  /** 步骤数定义 **/
  .ui-step-1 li {
    width: 25%;
  }
  .ui-step-3 li {
    width: 50%;
  }
  .ui-step-4 li {
    width: 30%;
  }
  .ui-step-5 li {
    width: 25%;
  }
  .ui-step-6 li {
    width: 20%;
  }
  /** The default style (默认风格) **/
  /* Done */
  .ui-step-blue .step-done .ui-step-cont-text {
    color: #69f;
  }
  .ui-step-blue .step-done .ui-step-line {
    background-color: #4c99e6;
  }
}
</style>