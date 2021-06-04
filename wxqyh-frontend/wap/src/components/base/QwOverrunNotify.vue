<template>
  <div v-show="isShow">
    <div class="qwui-overrun_box">
      <div class="relative">
        <img src="../../assets/images/icon_overrun_notify.png" alt="">
        <div class="qwui-overrun_close" @click="close"></div>
        </div>
      <div class="qwui-overrun_body">
        <div class="qwui-overrun_title">使用人数超出限制</div>
        <div class="qwui-overrun_content">{{text}}</div>
        <div class="qwui-overrun_btn" v-show="isShowBtn" @click="jump">限时钜惠马上申请</div>
        </div>
    </div>
    <div class="qwui-overrun_mask"></div>
  </div>
</template>

<script>
  export default {
    mounted(){
      var that = this;
      wxqyhConfig.ready(function(){
        if(wxqyhConfig.is_in_vip_black_list&&wxqyhConfig.is_match_no_vip_notify){
          that.isShow = true;
        }
        //wxqyhConfig.portal_tip_type  0、不提醒，1、提醒管理员，2、提醒所有员工
        if(!wxqyhConfig.is_manager&&wxqyhConfig.portal_tip_type == '2'){
          that.isShowBtn = false;
          that.text = '企微云免费版仅限25人以内使用，贵单位人数已经超限，请联系管理员升级为VIP会员，尊享平台各项高级特权和每周更新功能';
        }
      });
    },
    data(){
      return{
        isShow:false,
        isShowBtn:true,
        text:'企微云免费版仅限25人以内使用，你所在的企业已超出人数限制。请及时升级为VIP会员，尊享平台各项高级特权和每周更新功能',
      }
    },
    methods:{
      jump(){
        window.location.href = _.openURL + '/open/form/add.jsp?id=8a28f38e-44cf-43a0-87d8-5a299ab47c3b&agentCode=form&corp_id=1';
      },
      close(){
        this.isShow = false;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-overrun_box{
    position:fixed;
    top: 50%;
    left: 50%;
    width:310px;
    min-height: 320px;
    background: linear-gradient(#FFF9F0, #fff);
    margin-left: -155px;
    margin-top: -190px;
    z-index: 1101;
    border-radius:6px;
    img{
      width: 100%;
      max-width:310px;
    }
    .qwui-overrun_close{
      position: absolute;
      top: 17px;
      right: 17px;
      width: 12px;
      height: 12px;
      background: url('../../assets/images/icon_overrun_close.png') no-repeat;
      background-size:12px 12px;
      cursor: pointer;
    }
    .qwui-overrun_body{
      padding: 18px 28px 33px;
      .qwui-overrun_title{
        font-size: 19px;
        color:#2662C9;
        text-align: center;
        padding-bottom: 23px;
      }
      .qwui-overrun_content{
        color:#999;
        font-size: 14px;
        .qwui-overrun_red{
          color:#ff253a;
        }
      }
      .qwui-overrun_btn{
        max-width: 217px;
        height: 43px;
        line-height: 43px;
        margin: 17px 20px 0;
        color:#fff;
        font-size: 17px;
        text-align: center;
        background:rgba(69,152,234,1);
        border-radius:43px;
        cursor: pointer;
        box-shadow:0px 5px 16px rgba(69,152,234,.35);
      }
    }
  }
  .qwui-overrun_mask{
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
  }
</style>
