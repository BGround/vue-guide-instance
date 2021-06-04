<template>
  <p class="backTip">
    <span v-if="allShow">
       <span class="left">{{$t('i18n.all')}}</span>
       <span class="arrow_icon">&gt</span>
    </span>
    <span @click="returnBack">{{$t('i18n.goBack')}}</span>
  </p>
</template>

<script>
  export default {
    name: "tree-return-back",
    props: {
      // 是否显示全部按钮
      allShow: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      // 点击操作
      returnBack() {
        this.$emit('returnBack')
      }
    }
  }
</script>

<style scoped>
  .backTip {
    font-size: 14px;
    padding: 13px 15px;
    color: #999;
    cursor: pointer;
  }
  .backTip .left {
    color: #586C94;
  }
  .backTip .arrow_icon {
    padding: 5px;
  }
</style>
