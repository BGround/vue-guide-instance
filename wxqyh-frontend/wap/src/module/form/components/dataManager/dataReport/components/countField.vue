
<template>
  <div class="qwui-dataReport">
    <div class="qwui-dataReport-title">
      {{index + 1}}. 
      <span v-html="childTitle + field.itemName"></span>
    </div>
    <div class="qwui-dataReport-number">填写次数：<span>{{ field.resultCount }}</span></div>
  </div>
</template>
<script>

  export default {
    name:'numbersField',
    props:{
      'field':{
        type: Object,
      },
      'index':{
        type: Number
      }
    },
    data(){
      return {
        childTitle:''
      };
    },
    created(){
      this.childTitle = this.field.parentName ? this.field.parentName + ' > ': '';
    }
  }

</script>
<style scoped lang="scss">
  @import './style.scss';
  .qwui-dataReport-number {
    height: 50px;
    padding-left: 24px;
    line-height: 50px;
    color: #7A7D80;
    font-size: 15px;
    border: 1px solid rgba(227,228,232,0.3592);
    border-radius: 4px;
  }
</style>
