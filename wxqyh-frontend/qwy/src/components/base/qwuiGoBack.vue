<template>
  <div class="qwui-goto_back" :class="{ active:goBackConfig.hasLine }">
    <a class="qwui-return_setting_btn" @click="goBack"></a>
    <span class="qwui-last_path">{{ goBackConfig.lastPath }} /</span>
    <span class="qwui-curr_path">{{ goBackConfig.currPath }}</span>
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';

  export default {
    props:{
      goBackConfig:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data(){
      return {

      }
    },
    methods:{
      goBack(){
        // 有添加返回箭头自定义事件
        if (this.goBackConfig.isCustomEvent){
          this.$emit('listenToChild')
        }else {
          window.history.length > 1
            ? this.$router.go(-1)
            : this.$router.push('/');
        }
      },
    },
    components:{
      qwuiButton
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-goto_back{
    padding: 20px 0;

  .qwui-return_setting_btn{
    width: 21px;
    height: 19px;
    margin-right: 10px;
    display: inline-block;
    vertical-align: text-bottom;
    background: url(~assets/images/back_icon.png) no-repeat center;
    background-size: cover;
    cursor: pointer;
  }
  }
  .qwui-goto_back.active {
    padding-bottom: 10px;
    border-bottom: 1px solid #dbdbdd;
  }
  .qwui-last_path {
    color: #999;
  }
  .qwui-curr_path {
    color: #666;
  }
</style>
