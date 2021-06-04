<template>
  <div class="qwui-dialog_overlay">
    <div class="qwui-mask z-index_top"></div>
    <!--弹窗类型1-->
    <div class="qwui-dialog z-index_top">
      <!--普通弹窗标题-->
      <div class="qwui-dialog_header">
        <strong class="qwui-dialog_title">流程干预&emsp;</strong> <img class="qwui-dialog_vipmark" src="../../../assets/images/tag_vipgold_large.png">
        <img src="../../../assets/images/btn_close.png" alt="" class="qwui-dialog_title_close" @click="close">
      </div>
      <div class="qwui-dialog_content" >
          <div class="qwui-dialog_content-title">对于流转中的表单，管理员可以修改负责人或将节点流转到指定节点</div>
          <div class="qwui-dialog_content-title">适用场景举例
            <p class="qwui-dialog_content-content"> 员工离职后，管理员要将他负责的表单流程转交给其他员工跟进，避免中断流程</p>
          </div>
        <img class="qwui-liuchengganyu" src="../../../assets/images/img_popupcontent.png" alt="">
      </div>
      <div class="qwui-dialog_footer">
        <a href="https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_index.jsp" target="_blank" class="qwui-dialog_btn qwui-dialog_btn_primary">
          升级为尊享版</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: "vipDialogMask",
    data(){
      return {
      }
    },
    methods:{
      close(){
        this.$emit('close');
      }
    }
  }
</script>
<style scoped>
  .qwui-dialog_overlay.active{
    opacity: 1;
  }
  .qwui-mask{
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
  }
  .qwui-dialog {
    position: fixed;
    z-index: 11;
    top: 50%;
    left: 50%;
    width: 80%;
    max-width: 640px;
    max-height: 450px;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.2);
    overflow: hidden;
  }

  .qwui-dialog_header{
    padding: 21px 28px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: bottom;
    background-color: #F7F7F7;
  }
  .qwui-dialog_vipmark{
    display: inline-block;
    margin-bottom: -4px;
    width: 48px;
}
  .qwui-dialog_title {
    font-size: 18px;
    color: #333;
    font-weight: 400;
    line-height: 28px;
  }
  .qwui-dialog_title_close {
    float: right;
    margin: 6px;
  }
  .qwui-dialog_content {
    min-height: 40px;
    padding: 28px;
    font-size: 14px;
    color: #333;
    word-wrap: break-word;
    word-break: break-all;
  }
  .qwui-dialog_content .qwui-dialog_content-title{
    margin-bottom: 24px;
    /*font-weight: bold;*/
    color: #333;
  }
  .qwui-dialog_content-content {
    color: #666;
  }
  .qwui-dialog_footer{
    text-align: center;
    padding: 20px;
  }
  .qwui-dialog_btn_primary {
    display: inline-block;
    height: 32px;
    padding: 0 20px;
    font-size: 14px;
    background: #C31725;
    border-radius: 2px;
    line-height: 32px;
    color: #fff;
  }
  .qwui-liuchengganyu{
    display: block;
    width: 100%;
  }
</style>
