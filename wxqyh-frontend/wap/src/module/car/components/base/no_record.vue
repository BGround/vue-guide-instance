<template>
  <div class="qwui-no_record_box" v-if="show" :class="{'active':hasrecord.setTop}">
    <i class="qwui-no_record_icon" :class="hasrecord.icon"></i>
    <p class="qwui-no_record_title" v-if="hasrecord.title" :class="{'actived':hasrecord.text==''}">{{hasrecord.title}}</p>
    <p class="qwui-no_record_text" v-if="hasrecord.text">{{hasrecord.text}}</p>
  </div>
</template>
<script>
  export default {
    name: 'hasRecord',
    props: ['hasrecord','show']
  }
</script>
<style>
  .qwui-no_record_box {
    position: relative;
    top: 50%;
    left: 0;
    right: 0;
    margin-top: 160px;
    text-align: center;
  }
  .qwui-no_record_box.active{
    margin-top: 150px;
  }
  @media screen and (min-width: 1024px) {
    .qwui-no_record_box , .qwui-no_record_box.active,.qwui-no-record,.qwui-no_relative_record{
      width: 740px;
    }
  }
  .qwui-no_record_icon{
    display: inline-block;
    width: 160px;
    height: 160px;
    background: url(~assets/images/car/icon_car_noContent.png) center no-repeat;
    background-size: 129px 97px;
  }
  /*空盒子*/
  .qwui-icon_box{
    background-position: 0 0;
  }
  /*私人邮箱*/
  .qwui-icon_mail{
    background-position: -390px 0;
  }
  /*无权限*/
  .qwui-icon_permission{
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url(~assets/images/car/icon_noContent.png) center no-repeat;
    background-size: cover;
    background-position: -520px 0;
  }
   /*没记录*/
  .qwui-icon_noRecord{
    display: inline-block;
    width: 160px;
    height: 160px;
    background: url(~assets/images/car/icon_noRecord.png) center no-repeat;
    background-size: 150px 98px;
  }
  /*没找到车辆*/
  .qwui-icon_noCar{
    display: inline-block;
    width: 166px;
    height: 188px;
    background: url(~assets/images/car/icon_noCar.png) center no-repeat;
  }
  .qwui-no_record_title{
    font-size: 18px;
    color: #666;
  }
  .qwui-no_record_title.actived{
    font-size: 14px;
    color: #B2B9C8;
  }
  .qwui-no_record_text{
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#B2B9C8;
    line-height:20px;
  }
  .qwui-no_record_title{
    height:20px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:#B2B9C8;
    line-height:20px;
  }
  /* 没有相关记录 */
  .qwui-no_relative_record,.qwui-no_page_record,.qwui-no_treat_record,.qwui-no_status_record,.qwui-no_status_record{
    display: inline-block;
    width: 161px;
    height: 160px;
  }

  /* 没有行程 */
  .qwui-no_page_record{
    background: url(~assets/images/car/travel_no_record.png) center no-repeat;
    background-size: 130px 105px;
  }
  /* 没有待我处理 */
  .qwui-no_treat_record{
    background: url(~assets/images/car/relative_no_record.png) center no-repeat;
    background-size: 130px 105px;
  }
  /* 没有车辆状态 */
  .qwui-no_status_record{
    background: url(~assets/images/car/no_car.png) center no-repeat;
    background-size: 130px 105px;
  }
</style>
