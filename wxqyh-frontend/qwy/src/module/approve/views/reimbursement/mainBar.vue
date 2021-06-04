<!--  -->
<template>
  <div class="topMainBar">
    <div class="flMainBar">
      <a class="btn" @click="goViewTab('loanSetting')">返回</a>
      <p class="routerTip"><a class="colorBack" @click="goViewTab('reimbursementSet')">设置</a><span>/</span><a class="colorBack" @click="goViewTab('loanSetting')">借款单设置</a><span>/</span><span class="active">{{titleName}}</span></p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      //当前设置页名称
      titleName: {
        type: String,
        default:''
      },
    },
    data() {
      return {};
    },
    methods: {
      locateTo(url) {
        window.location.href = _.baseURL + url;
      },
      // 点击tab跳转
      goViewTab(type) {
        window.location.href = _.baseURL+`/manager/form_flow/main.jsp?module=reimbursement&tab=${type}`;
      }
    }
  }
</script>

<style scoped>
  a{
    cursor: pointer;
  }
  .colorBack{
    color:#999;
  }
  .colorBack:hover{
    color: #f87b00;
  }
  .flMainBar {
    display: flex;
    align-items: center;
  }

  .topMainBar {
    margin: 20px 0;
  }

  .btn {
    margin-right: 20px;
    font-size: 14px;
    line-height: 30px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    width: auto;
    height: auto;
    color: #333333;
    background-color: #fff;
    border: 1px solid #cccccc;
    cursor: pointer;
  }
</style>
