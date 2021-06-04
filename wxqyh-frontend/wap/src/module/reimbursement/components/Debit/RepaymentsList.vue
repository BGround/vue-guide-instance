<template>
  <div>
    <!--未确认列表-->
    <div v-if="unConfirmedList && unConfirmedList.length>0">
      <div class="list-head">未确认还款共{{unConfirmedList.length}}笔，出纳确认收款后计入账单</div>
      <ul class="list list-content">
        <li v-for="(item,index) in unConfirmedList"
            :key="index"
            v-if="index<2 || openMore"
            class="list-content-item"
            @click="itemClick(item)">
          <div class="list-content-left">
            <p class="list-content-status"><i class="icon icon_wait"></i>{{item.statusDesc}}</p>
            <p class="list-content-date">{{item.date.substring(0, item.date.indexOf(' '))}}</p>
          </div>
          <div class="list-content-right">
            <strong  class="list-content-right-do">¥ {{item.money}}</strong>
            <p class="list-content-tips"><span v-if="item.statusDesc.indexOf('已核销')<0">{{item.tips}}</span></p>
          </div>
        </li>
        <!--<div class="open-more-shade" v-if="!openMore"></div>-->
      </ul>
      <div v-if="previewMore">
        <div class="open-more" @click="handleOpenMore">
          <i class="click_icon" :class="openMore ? 'click_icon_close': 'click_icon_open'"></i>
          <span>{{controlHiddenText}}</span>
        </div>
      </div>
    </div>

    <!--已确认列表-->
    <div v-if="confirmedList && confirmedList.length>0">
      <div class="list-head">确认还款共{{confirmRepayNum}}笔，共{{confirmedSum}}元</div>
      <ul class="list list-content">
        <li v-for="(item,index) in confirmedList"
            :key="index"
            class="list-content-item"
            v-if="index<2 || confirmedOpenMore"
            @click="itemClick(item)">
          <div class="list-content-left">
            <p class="list-content-status"><i class="icon" :class="item.statusDesc.indexOf('驳回')>-1 ? 'icon_wrong': item.statusDesc.indexOf('已核销')>-1 ? 'icon_audit':'icon_ok'"></i>{{item.statusDesc}}</p>
            <p class="list-content-date">{{item.date.substring(0, item.date.indexOf(' '))}}</p>
          </div>
          <div class="list-content-right">
            <strong  :class="item.statusDesc.indexOf('驳回')>-1 ? 'list-content-right-undo': 'list-content-right-do'">¥ {{item.money}}</strong>
            <p :class="item.statusDesc.indexOf('驳回')>-1 ? 'list-content-tips-undo': 'list-content-tips'"><span v-if="item.statusDesc.indexOf('已核销')==-1">{{item.tips}}</span></p>
          </div>
        </li>
      </ul>
      <div v-if="confirmedPreviewMore">
        <div class="open-more" @click="handleConfirmedOpenMore">
          <i class="click_icon" :class="confirmedOpenMore ? 'click_icon_close': 'click_icon_open'"></i>
          <span>{{confirmedHiddenText}}</span>
        </div>
      </div>
    </div>

    <!--已到账-->
    <div class="comfirm-content" v-if="count && count.status">
      <ul class="list-content">
        <li class="comfirm-item" @click="itemClick(count)">
          <div class="list-content-left">
            <p class="list-content-status"><i class="icon icon_ok"></i>{{count.statusDesc}}</p>
            <p class="list-content-date">{{count.date}}</p>
          </div>
          <div class="list-content-right">
            <strong class="list-content-right-do">¥ {{count.money}}</strong>
            <p class="list-content-tips">{{count.tips}}</p>
          </div>
        </li>
      </ul>
    </div>
    <status_dialog :dialogShow="statusShow" @close="closeStatus" :content="statusContent"></status_dialog>
  </div>
</template>
<script>
  import status_dialog from './statusDialog';
  export default {
    name: 'QwRepaymentsList',
    components:{
      status_dialog
    },
    props: {
      unConfirmedList: {   // 未确认列表数据
        type: Array,
        default:[]
      },
      confirmedList: {   // 已确认列表数据
        type: Array,
        default:[]
      },
      confirmedSum:{   //已确认列表共还款金额
        type: Number,
        default:0
      },
      count:{   //出纳已确认还款数据
        type: Object,
        default() {
          return {};
        },
      },
      confirmRepayNum:{
        type: Number,
        default:0
      }
    },
    data() {
      return {
        openMore:false,
        confirmedOpenMore:true,
        statusShow:false,
        statusContent:{}
      }
    },
    computed:{
      previewMore(){
        this.openMore = this.unConfirmedList.length>2?false:true;
        return this.unConfirmedList.length>2?true:false;
      },
      confirmedPreviewMore(){
        this.confirmedOpenMore = this.confirmedList.length>2?true:false;
        return this.confirmedList.length>2?true:false;
      },
      //显示展开收起
      controlHiddenText() {
        return this.openMore ? '收起':'查看更多'
      },
      confirmedHiddenText(){
        return this.confirmedOpenMore ? '收起':'查看更多'
      }
    },
    methods:{
      handleOpenMore(){
        this.openMore = !this.openMore;
      },
      handleConfirmedOpenMore(){
        this.confirmedOpenMore = !this.confirmedOpenMore;
      },
      itemClick(item){
        this.statusContent = item;
        this.statusShow = true;
      },
      closeStatus(){
        this.statusShow = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../styles/common.scss';
  .list{
    background-color: #fff;
    padding: 0 15px;
  }
  .list-head{
    height: 37px;
    background-color: #F7F8FA;
    text-align: center;
    font-size: 13px;
    line-height: 37px;
    color: #B2B9C8;
  }
  .list-content-item{
    position: relative;
    padding: 10px 0;
    height: 44px;
    border-bottom: 1px solid #f5f5f5;
  }
  /*.list-content-item + li{

  }*/
  .list-content-left{
    display: inline-block;
  }
  .list-content-status{
    font-size: 15px;
    color: #3F4A64;
  }
  .list-content-status-undo{
    font-size: 15px;
    color: #3F4A64;
  }
  .list-content-date{
    padding-left: 25px;
    margin-top: 2px;
    font-size: 12px;
    color: #B2B9C8;
  }
  .list-content-right{
    display: inline-block;
    position: absolute;
    right: 0;
    height: 44px;
    text-align: right;
  }
  .list-content-right-undo{
    font-size: 17px;
    color: #F75454;
  }
  .list-content-right-do{
    font-size: 17px;
    color: #3F4A64;
  }
  .click_icon{
    display: inline-block;
    position: relative;
    margin-right: 5px;
    top: 3px;
    width: 15px;
    height: 15px;
    background: 0 0 url(~assets/images/reim/loan/ic_debit_arrow.png) no-repeat;
    /*background-size: 100px 100px;*/
  }
  .icon{
    display: inline-block;
    position: relative;
    margin-right: 10px;
    top: 2px;
    width: 16px;
    height: 16px;
  }
  .icon_wait{
    background: 0 0 url(~assets/images/reim/loan/ic_debit_wait.png) no-repeat;
  }
  .icon_wrong{
    background: 0 0 url(~assets/images/reim/loan/ic_debit_wrong.png) no-repeat;
  }
  .icon_ok{
    background: 0 0 url(~assets/images/reim/loan/ic_debit_ok.png) no-repeat;
  }
  .icon_audit{
    background: 0 0 url(~assets/images/reim/loan/ic_debit_audit.png) no-repeat;
  }
  .click_icon_open{
    transform: rotate(0deg);
  }
  .click_icon_close{
    transform: rotate(180deg);
  }
  .open-more{
    height: 50px;
    background-color: #fff;
    text-align: center;
    line-height: 50px;
    font-size: 13px;
    color: #458be9;
  }
  .count-footer{
    margin-top: 10px;
  }
  .open-more-shade{
    position: absolute;
    width: 100%;
    height: 69px;
    background: linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,1));
    transform: translateY(-69px);
  }
  .comfirm-content{
    background-color: #fff;
    padding: 10px 15px;
    margin-top: 10px;
  }
  .comfirm-item{
    position: relative;
    padding: 10px 0;
    height: 44px;
  }
  .list-content-tips{
    font-size:12px;
    color:#B2B9C8
  }
  .list-content-tips-undo{
    font-size:12px;
    color:#FF574D
  }
</style>
