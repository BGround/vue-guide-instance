<template>
  <div class="image-view">
    <template v-if="option.detail.length>0">
      <div v-if="option.display==0"
           class="image-view-display0">
        <img v-for="(item,index) in option.detail"
             :key="index"
             :src="item.picPath||defaultImg"
             alt="">
      </div>
      <template v-else-if="option.display==1">
        <swiper :options="swiperOption1"
                ref="swiper1">
          <swiper-slide class="swiper-slide"
                        v-for="(item,index) in option.detail"
                        :key="index">
            <img :src="item.picPath||defaultImg">
          </swiper-slide>
          <div slot="pagination"
               class="swiper-pagination">
            <span v-for="(item,index) in option.detail"
                  :key="index">{{index}}</span>
          </div>
        </swiper>
      </template>
      <div v-else-if="option.display==2"
           class="image-view-display2">
        <img v-for="(item,index) in option.detail"
             :key="index"
             :src="item.picPath||defaultImg">
        <!-- <swiper :options="swiperOption2" ref="swiper2">
          <swiper-slide class="swiper-slide" v-for="(item,index) in option.detail" :key="index">
            <img :src="item.picPath||defaultImg">
          </swiper-slide>
        </swiper> -->
      </div>
    </template>
    <img v-else
         :src="defaultImg"
         alt="默认图片">
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'

import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'ImageView',
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      swiperOption1: {
        spaceBetween: 5,
        autoplay: true,
        pagination: {
          el: '.swiper-pagination',
          bulletClass: 'qw-bullet',
          bulletActiveClass: 'qw-bullet-active'
        },
        observer: true,
        observeParents: true
      },
      // swiperOption2: {
      //   spaceBetween: 5,
      //   observer: true,
      //   observeParents: true
      // },
      defaultImg: require('assets/images/img_default.png')
    }
  },
  props: {
    option: {
      default: {},
      type: Object
    }
  }
}
</script>
<style lang="scss" scoped>
.image-view {
  font-size: 0;
  overflow-x: auto;
  img {
    width: 320px;
    height: 200px;
    pointer-events: none;
  }
  &-display0 {
    padding: 0 14px;
    img {
      min-width: 292px;
      max-width: 292px;
      height: inherit;
    }
  }
  &-display2 {
    width: max-content;
    img {
      width: 220px;
      height: 120px;
      border-radius: 4px;
      margin: 0 6px;
    }
  }
}
/*滚动条*/
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
<style lang="scss">
.image-view {
  .swiper-container {
    padding-bottom: 10px;
    .swiper-pagination {
      display: flex;
      justify-content: center;
      bottom: 0;
      .qw-bullet {
        display: inline-block;
        width: 12px;
        height: 3px;
        background: #d3d4d9;
        border-radius: 2px;
        margin-right: 5px;
      }
      .qw-bullet-active {
        width: 24px;
        background: #535559;
      }
    }
  }
}
</style>



