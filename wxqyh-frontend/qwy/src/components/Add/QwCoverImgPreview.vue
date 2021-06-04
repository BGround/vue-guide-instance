<template>
  <div class="qwui-preview_wrap">
    <h3>{{title}}</h3>
    <p class="img">
      <img :src="img" alt="" width="268" height="114">
    </p>
    <p class="qwui-preview_text">{{text}}</p>
  </div>
</template>

<script>
  export default {
    props:{
      title:{
        type:String,
        default:'标题',
      },
      img:{
        type:String,
        default:require('assets/images/icon_default_cover_img.png'),
      },
      text:{
        type:String,
        default:'摘要',
      }
    },
    data(){
      return{

      }
    },
  }
</script>

<style lang="scss" scoped>
  .qwui-preview_wrap{
    position: absolute;
    top: 70px;
    right: 10px;
    width: 270px;
    padding: 15px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    border: solid 1px #e9e9e9;
    min-height: 200px;
    h3{
      word-break: break-all;
      font-size: 16px;
      line-height: 18px;
      font-weight: 700;
    }
    .img{
      display: block;
      text-align: center;
      img{
        margin: 10px 0;
      }
    }
    .qwui-preview_text{
      word-break: break-all;
    }
  }
</style>
