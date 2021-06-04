<template>
  <div class="setting-main">
    <div class="setting-item" style="padding-bottom: 60px;">
       <p class="setting-item-title">
         <span class="icon"><img src="../../../../assets/images/ic_from_template.png" alt=""></span>
         单据设置
       </p>
      <div>
        <div class="setting-content" @click="locateTo('/manager/include/setting.jsp?agentCode=reimbursement')">
          <p class="setting-tip-title">报销单设置</p>
          <p class="setting-tip-content">设置报销权限、主题、字段、审核流程及打印格式等</p>
        </div>
        <div class="setting-content" @click="goUrl('debitSetting')">
          <p class="setting-tip-title">借款单设置</p>
          <p class="setting-tip-content">设置借款权限、主题、字段、审核流程及打印格式等</p>
        </div>
      </div>

    </div>

    <div class="setting-item border-3px-top">
      <p class="setting-item-title">
        <span class="icon"><img src="../../../../assets/images/ic_from_template.png" alt=""></span>
        基础设置
      </p>
      <div class="setting-content" @click="goUrl('reimSetting')">
        <p class="setting-tip-title">转账功能</p>
        <p class="setting-tip-content">开启报销转账功能后，可以直接通过后台对接微信支付，直接进行报销转账</p>
      </div>
      <div class="setting-content" @click="locateTo('/manager/reimbursement/cityControl.jsp?agentCode=reimbursement')">
        <p class="setting-tip-title">城市级别管理</p>
        <p class="setting-tip-content">可将城市分至不同的类别，给每个类别不同的城市配置费用标准</p>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        detailShow:false,
      }
    },
    components:{

    },
    watch: {
      show: {
        handler: function(newVal, oldVal) {
          this.show = newVal
        },
        deep: true
      }
    },
    methods: {
      locateTo(url) {
        window.location.href = _.baseURL + url;
      },
      goUrl(url){
        this.$router.replace(url);
      },
    }
  }
</script>
<style scoped>
  .setting-main{
    padding: 15px;
  }
 .setting-item{
   padding: 15px 0;
 }
  .icon{
    vertical-align: middle;
    margin-left: 10px;
  }
  .setting-item-title{
    font-size: 18px;
    margin: 10px 0;
  }
  .setting-content:hover .setting-tip-title{
    color:#F87B00;
  }
  .setting-content:hover{
    background-color: #F5F5F5;
  }
  .setting-content{
    display: inline-block;
    width: 280px;
    margin-right: 46px;
    padding: 10px;
    cursor: pointer;
  }
  .setting-tip-title{
    font-size: 16px;
  }
  .setting-tip-content{
    font-size: 14px;
    color: #999;
  }
  .border-3px-top{
    border-top: 3px dashed #ddd;
  }
</style>
