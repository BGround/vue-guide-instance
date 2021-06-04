<template>
  <div class="qwui-no_record_box" v-if="show" :class="{'active':hasrecord.setTop}" :style="{'margin-top': hasrecord.icon ? '36px' : '66px'}">
    <i class="qwui-no_record_icon" :class="hasrecord.icon"></i>
    <p class="qwui-no_record_title" v-if="hasrecord.title" :class="{'actived':hasrecord.text==''}">{{hasrecord.title}}</p>
    <p class="qwui-no_record_text" v-if="hasrecord.text">{{hasrecord.text}}</p>
  </div>
</template>
<script>
  export default {
    name: 'hasRecord',
    props: ['hasrecord','show'],
    data() {
      return {
      }
    },
  }
</script>
<style>
  .qwui-no_record_box {
    position: relative;
    top: 50%;
    left: 0;
    right: 0;
    margin-top: 66px;
    text-align: center;
  }
  /* .qwui-no_record_box.active{
    position: fixed;
    margin-top: -79px;
  } */
  .qwui-no_record_icon{
    display: inline-block;
    width: 160px;
    height: 160px;
    background-image: url(../../assets/images/img_commom_emptypage@2x.png);
    background-size: 160px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .qwui-no_record_icon.other {
    width: 196px;
    height: 124px;
    background-image: url(../../assets/images/img_a-home_empty2@2x.png);
    background-size: cover;
  }
  .qwui-no_record_title{
    font-size: 15px;
    color: #0A1735;
  }
  .qwui-no_record_title.actived{
    font-size: 15px;
    color: #B2B9C8;
  }
  .qwui-no_record_text{
    margin: 4px 48px 0 48px;
    font-size: 12px;
    color: #B2B9C8;
  }
</style>
