<template>
  <div class="permission-dialog-wrapper absolute" v-if="showVipDialog">
    <div class="permission-dialog-mask"></div>
    <div class="permission-dialog">
      <div class="permission-dialog-left"></div>
      <div class="permission-dialog-content">
        <div class="title">应用使用人数超限<span class="active">{{person}}</span></div>
        <div class="content">
          <p class="start-text">尊敬的管理员：</p>
          <div class="explanation">您所在单位购买的
            <span class="active">{{vipApplication.vipName}}</span>会员权益为
            <span class="active">{{vipApplication.personMax}}</span>人，当前该应用的可见范围已超出
            <span class="active">{{person}}</span>
            人，为了不影响平台正常使用，请尽快扩容。
          </div>
        </div>
        <div class="permission-btn-box">
          <button class="permission-btn" style="margin-right: 18px"
                  v-if="person<=50"
                  @click="show=false"
          >稍后扩容</button>
          <button class="permission-btn permission-btn-primary" primary="true"
                  @click="primaryClick"
            >前往扩容</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import baseURL from '@/assets/js/baseURL_config';
  export default {
    name:'vipPersonOverDialog',
    data() {
      return {
        dataBase: dataBase,
        vipApplication: null,
        show: true
      }
    },
    computed:{
        showVipDialog(){
          return this.vipApplication && this.show && this.person
        },
        person(){
          if(this.vipApplication){
            if(parseInt(this.vipApplication.personMax) < parseInt(this.vipApplication.agentUserCount)){
              return Math.abs(parseInt(this.vipApplication.personMax) - parseInt(this.vipApplication.agentUserCount))
            }
          }
          return 0
        }
    },
    watch:{
      'dataBase.agentCode':function (val) {
        if(val){
          this.judeOverVipPerson(val)
        }
      }
    },
    methods:{
      //查询人数超限提示
      judeOverVipPerson(val){
        let self  = this
        axios.post(`${baseURL}/vip/vipMgrCtl/judeOverVipPerson.do`, {agentCode:val})
          .then(function (result) {
            if(result.code=='0'){
              self.vipApplication = result.data.vipNotifyVO
            }
          });
      },
      //扩容购买页面
      primaryClick(){
        window.open(`${baseURL}/vm/module/service.html#/expansion`)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .permission-dialog-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    z-index: 23;
  &.absolute{
     position: absolute;
     align-items: unset;
     .permission-dialog{
       top: 129px;
     }
   }
  .permission-dialog{
    display: flex;
    width: 780px;
    height: 392px;
    position: relative;
    margin: 0 auto;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    box-sizing: border-box;
  .permission-dialog-left{
    flex: 1;
    width: 278px;
    min-width: 278px;
    background: url(~assets/images/icon-vip-permission.png) no-repeat;
    background-size: 100% 100%;
  }
  .permission-dialog-content{
      position: relative;
      padding: 0 40px 44px;
      .title{
        padding:  72px 0 36px;
        font-size: 24px;
        color: #333;
        text-align: center;
      }
      .content{
        font-size: 16px;
        color: #666;
      .start-text{
        padding-bottom: 5px;
      }
      .explanation{
        .active{
          padding: 0 3px;
          color: #f87b00;
        &.bracket{
           padding: 0;
         }
        }
      }
      }
      .permission-btn-box{
        position: absolute;
        bottom: 44px;
        left: 117px;
      .permission-btn{
        display: inline-block;
        line-height: 1;
        font-size: 14px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        background: #fff;
        color: #666;
        padding: 10px 0;
        width: 122px;
        cursor: pointer;
      &.permission-btn-primary{
         border-color: #F87B00;
         color: #fff;
         background: #C31725;
       }
      }
      }
    }
  }
    .permission-dialog-mask{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: .9;
      background-color: rgba(255, 255, 255, 0.95);
      transition: 0.3s;
    }
  }
</style>
