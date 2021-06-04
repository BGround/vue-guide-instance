<template>
  <div class="qwui-title_wrap">
    <slot name="content">
      <div class="qwui-title">{{titleContent}}</div>
    </slot>
  </div>
</template>

<script>
  export default {
    props:{
      titleContent:{
        type:String,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .qwui-title_wrap{
    background-color: #F5F5F5;
    border-left: 4px solid #F87B00;
    height: 47px;
    line-height: 47px;
    .qwui-title{
      font-weight: 700;
      margin-left: 20px;
      color: #666;
      font-size:16px;
    }
  }
</style>
