<template>
  <a href="javascript:;" class="qwui-btn"
     :class="['qwui-btn_'+type]"
     @click="buttonClick">
    {{text}}
  </a>
</template>
<script>
  export default{
    name: "qwui_button",
    props:{
      type: {
        /*
        * default
        * primary
        * primaryDisabled
        * */
        default:'default'
      },
      text: String
    },
    data(){
      return {
      }
    },
    methods:{
      buttonClick() {
        this.$emit('buttonClick')
      }
    }
  }

</script>
<style>
  .qwui-btn{
    position: relative;
    display: block;
    flex: 1;
    box-sizing: border-box;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    color: #fff;
    line-height: 44px;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
  }
  .qwui-btn.qwui-btn_primary{
    color:rgba(255,255,255,1);
    background:#5585F0;
  }
  .qwui-btn.qwui-btn_primaryDisabled{
    color:rgba(255,255,255,1);
    background:rgba(47,125,205,0.6);
  }
  .qwui-btn.qwui-btn_default{
    margin-right: 15px;
    color:#7A7D80;
    background:#F4F6F8;
  }
  .qwui-btn.qwui-btn_default:last-child{
    margin-right: 0;
  }
  .qwui-btn.qwui-btn_default.active{
    margin-right: 0;
  }
  .qwui-btn.qwui-btn_default.unoperation{
    color:#bbb;
  }
  .qwui-btn:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid transparent;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 10px;
  }
</style>
