<template>
  <div class="wrap" v-if="value">
    <qr-code-vue :value="value" :size="200" class="qr_code"></qr-code-vue>
    <p class="code_tip">扫描二维码</p>
    <p class="code_tip">免费创建你的企业微信</p>
    <p class="code_tip code_url">复制链接{{ value }}在电脑端注册更方便</p>
  </div>
</template>

<script>
  import qrCodeVue from 'qrcode.vue';
  import { getQrCode } from '../api/getData'

  export default {
    data(){
      return {
        value:''
      }
    },
    components:{
      qrCodeVue,
    },
    created(){
      getQrCode((data)=>{
        this.value = data.url;
      })
    },
  }

</script>

<style lang="scss" scoped>
  .qr_code {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    margin-bottom: 50px;
  }

  .code_tip {
    font-size: 20px;
    text-align: center;
  }

  .code_url {
    margin-top: 20px;
    font-size: 16px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
