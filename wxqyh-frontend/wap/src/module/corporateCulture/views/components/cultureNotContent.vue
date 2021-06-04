<template>
  <div class="qwui-not_wrap" @click="gotoCultureAdd(cultureNotObj.agentCode)">
    <div class="qwui-not-left">
      <img v-if="cultureNotObj.agentCode=='topic'" src="../../../../assets/svg/img_a-homepage_blank1.svg" alt="">
      <img v-else-if="cultureNotObj.agentCode=='activity'" src="../../../../assets/svg/img_a-homepage_blank2.svg" alt="">
      <img v-else="cultureNotObj.agentCode=='survey'" src="../../../../assets/svg/img_a-homepage_blank3.svg" alt="">
    </div>
    <div class="qwui-not_right">
      <div class="qwui-not_right_title">{{cultureNotObj.titleName}}</div>
      <div class="qwui-not_right_content">{{cultureNotObj.content}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      cultureNotObj:{
        type:Object
      }
    },
    data(){
      return{

      }
    },
    methods:{
      gotoCultureAdd(agentCode){
        if(agentCode == 'topic'){
          this.$router.push({
          path:'/topicEditAndCopy',
          query:{
            agentCode:'activity'
          }
        })
        }else if(agentCode == 'activity'){
          document.location.href = _.baseURL+'/jsp/wap/activity/add.jsp?agentCode='+agentCode;
        }else{
          document.location.href = _.baseURL+'/jsp/wap/question/add.jsp?agentCode='+agentCode+'&type=1';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-not_wrap{
    display: flex;
    background:rgba(255,255,255,1);
    box-shadow:0px 2px 12px 0px rgba(0,0,0,0.07);
    border-radius: 8px;
    .qwui-not_right{
      position: relative;
      width: 100%;
      &::before{
        content: ' ';
        position: absolute;
        background: url(~assets/svg/icon_a-public_arrow-right.svg) no-repeat right center;
        width: 16px;
        height: 16px;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
      .qwui-not_right_title{
        margin-top: 31px;
        font-size: 18px;
        font-weight: 600;
      }
      .qwui-not_right_content{
        margin-top: 3px;
        color:#7A7C80;
        font-size: 13px;
      }
    }
    .qwui-not-left{
      img{
        width: 110px;
        height: 110px;
      }
    }
  }
</style>
