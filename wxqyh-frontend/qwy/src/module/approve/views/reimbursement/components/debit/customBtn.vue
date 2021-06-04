<template>
  <div class="customBtn">
    <div class="_alert_opt">
      <span class="custom_btn normal_btn" :class="item.customBtnClass" v-for="item in customBtnList" @click="customFun(item.callBack)">{{item.label}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'customBtn',
    props:{
      customBtnList:{
       /*[{label:''//按钮名称,
           customBtnClass:'orangeBtn'//按钮样式'orangeBtn(橙色)'，不传默认为白色,
           callBack:()=>{}//操作}]*/
        type:Array,
        default:[]
      },
    },
    data(){
      return {

      }
    },
    methods:{
      customFun:function(callBack){
        if(callBack){
          callBack();
        }
      },
    }
  }
</script>
<style scoped>
  ._alert_opt{
    padding:20px 0 30px;
    text-align: center;
  }
  .custom_btn+span{
    margin-left: 10px;
  }
</style>
