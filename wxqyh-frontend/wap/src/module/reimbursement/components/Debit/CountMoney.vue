<template>
  <div class="pay-Block">
    <div class="pay-above">
      <div class="pay-content" v-if="money">
        <p class="pay-content-title">剩余应还款</p>
        <p class="pay-content-count">{{money}}</p>
        <p class="pay-content-date"><span class="pay-content-date-head">最后还款日</span>{{dedLineTime | formatDate}}</p>
      </div>
      <div class="pay-content" v-if="!money">
        <img class="pay-clear-img" src="~/assets/images/reim/loan/ic_payOff.svg">
        <p class="pay-content-date">赞～已经还清借款了</p>
      </div>
      <i class="tips" @click="openTips"></i>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'QwCountMoney',
    props: {
      money:{
        type: Number,
        default:''
      },
      dedLineTime:{
        type: String,
        default:''
      },
      /*payOff:{
        type: Object,
        default:{}
      }*/
    },
    data() {
      return {

      }
    },
    filters: {
      //如果创建时间是当年则不显示年份,不是则不显示时间
      formatDate(time) {
        var date =  _.getFormatTime(time);
        var dateArr = [];
        var timeStr = '';
        if(date.indexOf('-')>-1){
          dateArr = date.split('-');
          if(dateArr.length>2){
            timeStr = dateArr[0] + '年' + dateArr[1] + '月' + dateArr[2]+'日';
          }else {
            timeStr = dateArr[0] + '月' + dateArr[1]+'日';
          }
        }else if(date.indexOf(':')>-1){
          let today = time.split('-');
          timeStr = today[1] + '月' + today[2]+'日';
//          dateArr = date.split(':');
//          timeStr = dateArr[0] + '时' + dateArr[1]+'分';
        }
        return timeStr;
      }
    },
    methods:{
      openTips(){
        var content = "<div style='text-align:left'>" +
          "1、已到账：出纳已经成功转账到您的个人账户；"+"<br />" +
          "2、还款中：您提交还款，等待出纳确认还款的状态；"+"<br />" +
          "3、核销中：您提交报销单并关联该借款单，等待出纳确认核销的状态；"+"<br />" +
          "4、驳回还款：您提交的还款被出纳驳回的状态； "+"<br />" +
          "5、驳回核销：您提交的报销单被出纳驳回的状态；"+"<br />" +
          "6、已还款：出纳已经收到您的还款，并确认您的还款申请的状态；"+"<br />" +
          "7、已核销：出纳已经核销您的报销单，并确认核销该借款单的状态。"+"<br />"+
          "</div>";
        var btnConfig = {
          primaryBtn: {name: "确定", callBack: null},
          defaultBtn: {name: "", callBack: null},
        }
        _.alert('待还款的状态说明：', content, btnConfig)
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../styles/common.scss';
  .pay-Block{
    background-color: #fff;
    padding: 15px;
  }
  .pay-above{
    position: relative;
    /*margin: 15px;*/
    height: 145px;
    border-radius: 10px;
    background-color: #6691F1;
    text-align: center;
    box-shadow: rgba(69,139,233,0.34) 0 3px 14px 0;
  }
  .pay-content{
    padding-top: 25px;
  }
  .pay-content-title{
    font-size: 14px;
    color: #AAC2F7;
  }
  .pay-content-count{
    font-size:34px;
    color: #FFF;
    font-weight: 600;
  }
  .pay-content-date{
    font-size:14px;
    color:#FFF;
  }
  .pay-content-date-head{
    margin-right: 10px;
  }
  .tips{
    position: absolute;
    top: 10px;
    right: 10px;
    height: 17px;
    width: 17px;
    background: url(~assets/images/reim/loan/ic_debit_explain.png) no-repeat;
  }
  .pay-clear-img{
    height: 51px;
    width: 51px;
    margin-bottom: 15px;
  }
</style>
