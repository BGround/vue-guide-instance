<template>
  <div>
    <div class="qwui-culture_line" v-show="cultureTitleObj.isShowLine"></div>
    <div class="qwui-culture_title">
      <div>
        <span v-if="cultureTitleObj.agentCode=='topic'" class="qwui-title_circle qwui-title_circle_topic"></span>
        <span v-else-if="cultureTitleObj.agentCode=='activity'" class="qwui-title_circle qwui-title_circle_activity"></span>
        <span v-else="cultureTitleObj.agentCode=='survey'" class="qwui-title_circle qwui-title_circle_survey"></span>
        <span class="qwui-title_name">{{cultureTitleObj.titleName}}</span>
      </div>
      <div class="qwui-title_more" @click="gotoCultureList(cultureTitleObj.agentCode)">更多</div>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      cultureTitleObj:{
        type:Object,
      },
    },
    data(){
      return{

      }
    },
    methods:{
      gotoCultureList(agentCode){
        if(agentCode == 'topic'){
          this.$router.push('/topicList');
        }else if(agentCode == 'activity'){
          this.$router.push('/activityList');
        }else if(agentCode == 'survey'){
          this.$router.push('/surveyList');
          // document.location.href = _.baseURL+'/jsp/wap/question/list_notjoin.jsp?agentCode='+agentCode+'&type=1';
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-culture_line{
    height:8px;
    background:rgba(247,248,250,1);
    margin: 0 -14px;
  }
  .qwui-culture_title{
    display: flex;
    height: 20px;
    justify-content: space-between;
    margin-top: 16px;
    .qwui-title_circle{
      display: inline-block;
      width: 14px;
      height: 14px;
      line-height: 14px;
      border-radius: 50%;
      vertical-align: middle;
      &.qwui-title_circle_topic{
        background: url(~assets/images/icon_a-list_title1.png) no-repeat left center;
        background-size:14px 14px;
      }
      &.qwui-title_circle_activity{
        background: url(~assets/images/icon_a-list_title2.png) no-repeat left center;
        background-size:14px 14px;
      }
      &.qwui-title_circle_survey{
        background: url(~assets/images/icon_a-list_title3.png) no-repeat left center;
        background-size:14px 14px;
      }
    }
    .qwui-title_name{
      display: inline-block;
      vertical-align: middle;
      line-height: 14px;
      font-size: 14px;
      font-weight: 600;
    }
    .qwui-title_more{
      color:#7A7C80;
      background: url(../../../../assets/svg/icon_a-public_arrow-right.svg) no-repeat right center;
      padding-right: 16px;
      font-size: 13px;
    }
  }
</style>
