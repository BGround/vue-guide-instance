<template>
  <div>
      <div class="detail-content-list" v-for="(item,index) in detailList" :key="item.id">
        <!-- 详情内容 -->
        <div class="detail-list-head border-bottom-1px" @click="isShow=!isShow">
          <span class="detail-list-no">借款明细</span>
          <span class="detail-bank-arrow">
          <span v-if="!isShow" class="hide-money">￥{{item.money}}</span>
          <img :class="{'detail-arrowImg':isShow }" width="14" height="8" src="../../../../assets/images/icon_down_gray.png" alt="">
        </span>
        </div>
        <!-- 详情明细列表-->
        <div class="detail-list" v-show="isShow">
          <div class="detail-list-content border-bottom-1px" v-if="item.deptName">
            <span class="detail-list-cost">所属部门</span>
            <span class="detail-list-name">{{item.deptName}}</span>
          </div>
          <div class="detail-amount-budget  border-bottom-1px">
            <span class="detail-list-cost">借款金额</span>
            <span class="detail-list-name">{{item.money}}</span>
          </div>
          <div class="detail-list-content border-bottom-1px">
            <span class="detail-list-cost">借款日期</span>
            <span class="detail-list-name">{{item.time}}</span>
          </div>
          <div class="detail-list-content border-bottom-1px">
            <span class="detail-list-cost">还款日期</span>
            <span class="detail-list-name">{{item.endTimes}}</span>
          </div>
          <div class="detail-list-content border-bottom-1px" v-if="item.remark">
            <span class="detail-list-cost">备注</span>
            <span class="detail-list-name">{{item.remark}}</span>
          </div>
          <div class="detail-list-images" v-if="showImg(item)">
            <div class="detail-list-cost">图片</div>
          </div>
          <div class="detail-list-content border-bottom-1px" v-if="showImg(item)">
          <span class="detail-list-img" v-for="list in item.imgList" :key="list.id">
            <img width="45px" height="45px" :src="compressURL+list.picPath" alt="">
          </span>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        isShow:'',
        compressURL: "https://tqy.do1.net.cn/fileweb/compress", //图片前缀
      }
    },
    props:{
      detailList:{
        type:Array,
        default:[]
      },
      isShowDetail:{
        type: Boolean,
        default: true
      }
    },
    created() {
      this.isShow = this.isShowDetail;
    },
    methods:{
      showImg(reim) { //图片列表
        return reim.imgList.length > 0 ? true : false;
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';
  @import '~../../styles/variable.scss';
  .detail-content-list {
    background-color: $color-background;
  .detail-list-head {
    height: 50px;
    line-height: 50px;
  .detail-list-no {
    display: inline-block;
    width: 70px;
    height: 15px;
    font-size: 16px;
    color: $color-text-d;
    font-weight: Semibold;
    margin-left: 16px;
  }
  .detail-arrowImg {
    transform: rotate(180deg);
  }
  .hide-money{
    color: $color-danger;
    margin-right: 10px;
  }
  .detail-bank-arrow {
    float: right;
    margin-right: 16px;
  }
  .detail-list-arrow {
    float: right;
    width: 14px;
    height: 8px;
    margin-top: 21px;
    margin-right: 16px;
    transform: rotate(180deg);
  }
  }
  .detail-content {
    border-left: 5px solid $color-danger;
    padding: 18px 40px 18px 18px;
    clear: both;
    margin-top: 10px;
    position: relative;
  &::after {
     content: '';
     position: absolute;
     top: 50%;
     right: 16px;
     margin-top: -4px;
     width: 8px;
     height: 8px;
     border-top: 1px solid $icon-border-color;
     border-right: 1px solid $icon-border-color;
     transform: rotate(45deg);
   }
  .detail-content-no {
    display: inline-block;
    font-size: 17px;
    color: $color-danger;
  }
  .detail-content-time {
    float: right;
    color: $color-text-tip;
    font-size: 12px;
  }
  .detail-content-center {
    clear: both;
    position: relative;
    margin-top: 10px;
  .detail-content-name {
    font-size: 16px;
    color: $color-text-d;
  }
  .detail-content-price {
    float: right;
    color: $color-text-d;
    font-size: 12px;
  }
  }
  .detail-content-budget {
    font-size: 12px;
    text-align: right;
    color: $color-danger;
  }
  }
  .detail-list {
    width: 100%;
    background-color: $color-background;
    margin-top: 10px;
  .detail-list-content {
    margin-left: 16px;
    padding: 18px 16px 18px 0;
    display: flex;
    font-size: 16px;
  .detail-list-cost {
    display: inline-block;
    width: 65px;
    text-align: left;
    color: $color-text-sub;
  }
  .detail-list-name {
    flex: 1;
    padding-left: 30px;
    text-align: right;
    color: $color-text-d;
  }
  .detail-list-img {
    display: inline-block;
    margin-right: 5px;
  }
  }
  .detail-amount-budget {
    margin-left: 16px;
    padding: 18px 16px 18px 0;
    font-size: 16px;
  .detail-list-cost {
    display: inline-block;
    width: 80px;
    color: $color-text-sub;
  }
  .detail-list-name {
    display: inline-block;
    float: right;
    color: $color-text-d;
    text-align: right;
  }
  .detail-list-budget {
    text-align: right;
    font-size: 12px;
    color: $color-danger;
  }
  }
  .detail-list-images {
    height: 50px;
    line-height: 50px;
    margin-left: 16px;
  .detail-list-cost {
    width: 63px;
    height: 16px;
    color: $color-text-sub;
    font-size: 16px;
    font-family: PingFangSC-Regular;
  }
  }
  }
  }
</style>
