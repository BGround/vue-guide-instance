<template>
<div class="driver-list">
  <ul>
    <li class="driver" v-for="(item, index) in driver" :key="index" @click="isSelected(item)">
      <input type="radio" name="driver" :id="item.id" class="icon_check" :ref="item.id">
      <img :src="driverImg(item.headPic)" :alt="item.personName">
      <div class="desc-info">
        <div class="driver-name ellipsis">{{ item.personName }}</div>
        <div class="driver-status">
          <span calss="default-msg">{{ timeIn }}</span>
          <span class="driver-status-leisure" v-if="!item.hasUsed" @getCarTime="emit('getCarTime')">空闲</span>
          <span class="driver-status-assign" v-else @click.stop="goDetail(item)">已分派 &gt;</span>
        </div>
      </div>
      <a class="tel" :href="'tel:'+item.mobile">
        <div class="icon-wrap">
          <i></i>
        </div>
      </a>
    </li>
  </ul>
</div>
</template>
<script>
import { getUserInfo } from '../../api/getData.js'
import defaultHeadPic from '@/assets/images/car/touxiang02.png'
export default {
  name: 'driverList',
  props: {
    driver: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      timeIn:"未来三天"
    }
  },
  methods:{
    //没有图片时使用默认图片
    driverImg(img){
      return img == 0 ? defaultHeadPic : img
    },
    isSelected(item){
      $('#'+item.id).attr("checked",true)
      this.$emit('getRadioValue', item)
    },
    goDetail(item){
      this.$emit('showDriverDetail', {driverId: item.userId, show: true})
    }
  }
}
</script>
<style scoped>
  .driver{
    position: fixed;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    display: flex;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    position: relative;
    height: 42px;
    padding: 10px;
    cursor: pointer;
    z-index: 2;
  }
  [type=radio].icon_check{
    width: 18px;
    height: 18px;
    margin-top: 11px;
    cursor: pointer;
  }
  img{
    vertical-align: top;
    width: 42px;
    height: 42px;
  }
  .desc-info{
    vertical-align: top;
    display: inline-block;
    margin-left: 8px;
  }
  .driver-name{
    width: 200px;
    height: 22px;
    font-size: 16px;
    color: #1B233A;
    line-height: 22px;
  }
  .driver-status{
    font-size: 13px;
    color: #B2B9C8;
    height: 18px;
    line-height: 18px;
  }
  .default-msg{
    color: #B2B9C8;
    margin-right: 4px;
  }
  .driver-status-leisure{
    color: #739FFF;
  }
  .driver-status-assign{
    color: #FFB032;
  }
  .tel{
    display: block;
    position: absolute;
    top: 11px;
    right: 0;
  }
  .icon-wrap{
    text-align: center;
    margin-top: 10px;
    width: 43px;
    height: 24px;
    border-left: 1px solid #F7F7F7;
  }
  .icon-wrap i{
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 44px;
    background: url(~assets/images/car/icon_tel.png) no-repeat center;
    background-size: cover;
  }
</style>



