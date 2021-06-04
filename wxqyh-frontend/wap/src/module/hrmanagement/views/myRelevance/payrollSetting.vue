<template>
  <div class="wrap">
    <div class="item_content">
      <h3 class="item_title">动态码查看工资条</h3>
      <p class="item_desc">开启后，每次查看工资条详情都需要输入动态码</p>
      <switch-btn class="switch_btn" :value="isOpen" @input="updateBtn"></switch-btn>
    </div>
  </div>
</template>

<script>
  import switchBtn from '@/components/form/switchBtn';
  import { getDynamicCode,updateDynamicCode } from '../../api/getData';

  export default {
    name:'payrollSetting',
    data(){
      return {
        isOpen:false
      }
    },
    created(){
      this.getDynamicCodeBtn();
    },
    methods:{
      // 获取动态码查看工资条开关
      getDynamicCodeBtn(){
        getDynamicCode({},(data)=>{
          this.isOpen = data.isOpen == '1';
        })
      },
      updateBtn(val){
        updateDynamicCode({
          isOpen:val ? 1 : 0
        },()=>{
          this.isOpen = val;
        })
      }
    },
    components:{
      switchBtn
    }
  }
</script>

<style lang="scss" scoped>
  .item_content {
    position: relative;
    height: 46px;
    margin-left: 14px;
    padding: 20px 14px 20px 0;

  &:after {
     content: '';
     position: absolute;
     left:0;
     bottom: 0;
     width: 100%;
     border-bottom: 1px solid #F7F8FA;
     -webkit-transform: scaleY(0.5);
     transform: scaleY(0.5);
     -webkit-transform-origin: 0 0;
     transform-origin: 0 0;
   }

  .item_title {
    margin-bottom: 4px;
    font-size: 16px;
    color: #0A1735;
  }

  .item_desc {
    color: #B2B9C8;
  }

  .switch_btn /deep/ .qwui-onOff_choose {
    top: 22px;
  }
  }
</style>
