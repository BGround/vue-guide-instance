<template>
  <div v-if="visible" class="default">
    <div class="picture">
      <img :src="noData" />
    </div>
    <p class="tips" v-if="message">{{message}}</p>
  </div>
</template>

<script>
import noData from "@/assets/images/noData.png";
export default {
  props:{
    visible:{
      type: Boolean,
      default(){
        return true;
      }
    },
      message:{
          type: String,
          default(){
              return '暂无数据';
          }
      },
  },
  data () {
    return {
      noData
    }
  },
}
</script>

<style lang="less" scoped>
  .default{
    padding-top: 40px;
    .picture{
      width: 160px;
      height: 120px;
      padding: 20px 0;
      text-align: center;
      margin: auto;
      & >img{
        width:100%;
      }
    }
    .tips{
      margin-top:5px;
      font-size:14px;
      text-align: center;
      color:#B5B8C2;
    }
  }
</style>
