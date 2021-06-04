<template>
  <div class="qwui-wrap">
    <div class="wrap" ref="wrapDom">
      <div class="qwui-head_wrap">
        <div class="qwui-head_nav" v-show="!justOne">
          <div class="qwui-nav_item" @click="gotoCulture('topic')" v-show="openObj.topicShow">
            <img src="../../../assets/svg/icon_a-homepage_btn1.svg" alt="">
            <div class="qwui-nav_name">{{titleNameObj.topicTitleName}}</div>
            <!-- 新话题红点提示 -->
            <span v-show="topicUnread" class="qwui-unread_red"></span>
          </div>
          <div class="qwui-nav_item" @click="gotoCulture('activity')" v-show="openObj.activityShow">
            <img src="../../../assets/svg/A1_btn_3.svg" alt="">
            <div class="qwui-nav_name">企业活动</div>
            <!-- 活动红点提示 -->
            <span v-show="activityUnread" class="qwui-unread_red"></span>
          </div>
          <div class="qwui-nav_item" @click="gotoCulture('survey')" v-show="openObj.surveyShow">
            <img src="../../../assets/svg/A1_btn_2.svg" alt="">
            <div class="qwui-nav_name">{{titleNameObj.surveyTitleName}}</div>
            <!-- 投票红点提示 -->
            <span v-show="surveyUnread" class="qwui-unread_red"></span>
          </div>
          <div class="qwui-app_managment" @click="goToManagement" v-show="isShowAppManagement">
            <img src="../../../assets/images/icon_a-homepage_app.png" alt="">
          </div>
        </div>
        <div class="qwui-one_nav" v-show="justOne">
          <div class="qwui-nav_item" @click="gotoCulture(oneObj.agentCode)">
            <img :src="oneObj.imgSrc" alt="">
            <div class="qwui-nav_name">{{oneObj.agentName}}</div>
          </div>
          <div class="qwui-app_managment" @click="goToManagement" v-show="isShowAppManagement">
            <img src="../../../assets/images/icon_a-homepage_app.png" alt="">
            <!-- 投票红点提示 -->
            <span v-show="oneObj.unRead" class="qwui-unread_red"></span>
          </div>
        </div>
      </div>
      <div class="qwui-main_wrap">
        <div class="qwui-community">
          <culture-title v-show="!isShowNotTopic&&openObj.topicShow" :cultureTitleObj="communityTitleObj"></culture-title>
          <culture-content v-show="!isShowNotTopic&&openObj.topicShow" :cultureContentObj="communityContentObj"></culture-content>
          <cultureNotContent v-show="isShowNotTopic&&openObj.topicShow" :cultureNotObj="communityNotObj" class="qwui-topic_margin"></cultureNotContent>
          <culture-title v-show="!isShowNotActivity&&openObj.activityShow" :cultureTitleObj="activityTitleObj"></culture-title>
          <culture-content v-show="!isShowNotActivity&&openObj.activityShow" :cultureContentObj="activityContentObj"></culture-content>
          <cultureNotContent v-show="isShowNotActivity&&openObj.activityShow" :cultureNotObj="activityNotObj" class="qwui-activity_margin"></cultureNotContent>
          <culture-title v-show="!isShowNotSurvey&&openObj.surveyShow" :cultureTitleObj="surveyTitleObj"></culture-title>
          <culture-content v-show="!isShowNotSurvey&&openObj.surveyShow" :cultureContentObj="surveyContentObj"></culture-content>
          <cultureNotContent v-show="isShowNotSurvey&&openObj.surveyShow" :cultureNotObj="surveyNotObj" class="qwui-survey_margin"></cultureNotContent>
        </div>
      </div>
      <div class="qwui-culture_entry" @click="showAddPopup"></div>
    </div>
    <cultureAddPopup :popupList='popupList' :jumpURL="jumpURL"  ref="addPopup"></cultureAddPopup>
  </div>
</template>


<script>
  import cultureTitle from './components/cultureTitle';
  import cultureContent from './components/cultureContent';
  import cultureAddPopup from './components/cultureAddPopup';
  import cultureNotContent from './components/cultureNotContent';
  import {loadTeamWorkDetail,countViewMessage,checkManagement,getAgentName} from '../api/getData';

  export default {
    name:'cultureIndex',
    data(){
      return{
        communityTitleObj:{
          agentCode:'topic',
          isShowLine:false,
          titleName:'最新话题',
        },
        activityTitleObj:{
          agentCode:'activity',
          isShowLine:true,
          titleName:'最新活动',
        },
        surveyTitleObj:{
          agentCode:'survey',
          isShowLine:true,
          titleName:'最新投票',
        },
        communityContentObj:{},
        activityContentObj:{},
        surveyContentObj:{},
        communityNotObj:{
          agentCode:'topic',
          titleName:'同事社区',
          content:'社区话题招募楼主，快来抢沙发',
          btnStr:'发表',
        },
        activityNotObj:{
          agentCode:'activity',
          titleName:'进行中的活动',
          content:'活动筹备中，邀请同事一起参加吧',
          btnStr:'创建',
        },
        surveyNotObj:{
          agentCode:'survey',
          titleName:'进行中的问卷',
          content:'知民情，懂民意，发布问卷了解一下',
          btnStr:'发布',
        },
        isShowNotTopic:false,
        isShowNotActivity:false,
        isShowNotSurvey:false,
        isShowAddPopup:false,
        isShowAppManagement:false,
        oneObj:{
          agentCode:'topic',
          imgSrc:'',
          agentName:'同事社区',
          unRead:false
        },
        justOne:false,//是否只开启一个入口
        openObj:{//开启的应用
          topicShow:false,
          activityShow:false,
          surveyShow:false,
        },
        popupList:[
          {
            name:'发表话题',
            url:_.baseURL+'/vp/module/culture.html#/topicEditAndCopy',
            type:'topic',
            isShow:true,
          },
          {
            name:'新建活动',
            url:_.baseURL+'/jsp/wap/activity/add.jsp?agentCode=activity',
            type:'activity',
            isShow:true,
          },
          {
            name:'新建问卷',
            url:_.baseURL+'/jsp/wap/question/add.jsp?agentCode=survey&type=1',
            type:'survey',
            isShow:true,
          },
        ],
        jumpURL:'',
        isShowNotTopic:false,
        isShowNotActivity:false,
        isShowNotSurvey:false,
        isShowAddPopup:false,
        topicUnread:false,
        activityUnread:false,
        surveyUnread:false,
        titleNameObj: {
          topicTitleName: '',
          surveyTitleName: '',
        }
      }
    },
    created(){
      let push = _.getUrlParam('push');
      this.openObj.topicShow=false;
      this.openObj.activityShow=false;
      this.openObj.surveyShow=false;
      this.justOne=false;
      if(push){
        countViewMessage({
          params:{
            push:push
          }
        });
      }
      var self = this;
      loadTeamWorkDetail((data)=>{
        self.popupList = [];
        if(data.printVOList.length===1){
          self.justOne=true;
          self.$nextTick(function () {
            self.$refs.wrapDom.style.background='#fff';
          })
          switch(data.printVOList[0].agentCode){
            case 'topic':
              self.oneObj.agentCode='topic';
              self.oneObj.imgSrc=require('../../../assets/svg/icon_a-homepage_btn1.svg');
              self.oneObj.agentName='同事社区';
            break;
            case 'activity':
              self.oneObj.agentCode='activity';
              self.oneObj.imgSrc=require('../../../assets/svg/A1_btn_3.svg');
              self.oneObj.agentName='企业活动';
            break;
            case 'survey':
              self.oneObj.agentCode='survey';
              self.oneObj.imgSrc=require('../../../assets/svg/A1_btn_2.svg');
              self.oneObj.agentName='问卷投票';
            break;
          }
          self.oneObj.unRead=data.printVOList[0].waitCount!=0?true:false;
        }
        data.printVOList.forEach(function(item,index){
          if(item.agentCode == 'topic'){
            self.openObj.topicShow=true;
            let url='';
            let corpId=_.getUrlParam('corp_id');//获取corpId
            if(corpId){
              url=_.baseURL+'/vp/module/culture.html?corp_id='+corpId+'&agentCode=activity#/topicEditAndCopy';
            }else{
              url=_.baseURL+'/vp/module/culture.html?agentCode=activity#/topicEditAndCopy';
            }
            self.popupList.splice(2,0,{
              name:'发表话题',
              url:url,
              type:'topic',
              isShow:true,
            })
            self.communityContentObj = item;
            self.topicUnread = item.waitCount != '0' ? true : false;
            if(item.waitList.length==0){
              self.isShowNotTopic = true;
            }
          }else if(item.agentCode == 'activity'){
            self.openObj.activityShow=true;
            self.popupList.splice(1,0,{
              name:'新建活动',
              url:_.baseURL+'/jsp/wap/activity/add.jsp?agentCode=activity',
              type:'activity',
              isShow:true,
            })
            self.activityContentObj = item;
            self.activityUnread = item.waitCount != '0' ? true : false;
            if(item.waitList.length==0){
              self.isShowNotActivity = true;
            }
          }else if(item.agentCode == 'survey'){
            self.openObj.surveyShow=true;
            self.popupList.splice(0,0,{
              name:'新建问卷',
              url:_.baseURL+'/jsp/wap/question/add.jsp?agentCode=survey&type=1',
              type:'survey',
              isShow:true,
            })
            self.surveyContentObj = item;
            self.surveyUnread = item.waitCount != '0' ? true : false;
            if(item.waitList.length==0){
              self.isShowNotSurvey = true;
            }
          }
        });
        for(var i = 0; i < 3; i++){
          if(self.popupList.length==3){
           break;
          }
          self.popupList.push({isShow:false});
        }
        self.popupList.reverse();
      });
      checkManagement((data)=>{
        if(data.canEditAgent){
          this.isShowAppManagement=true;
        }else{
          this.isShowAppManagement=false;
        }
      });
      getAgentName('topic,survey',(result) => {
        let titleNameArr = result.data.list;
        this.titleNameObj.topicTitleName = titleNameArr[0].agentName;
        this.titleNameObj.surveyTitleName = titleNameArr[1].agentName;
      })
    },
    methods:{
      showAddPopup(){
        this.$refs.addPopup.show = true;
      },
      gotoCulture(agentCode){
        if(agentCode == 'topic'){
          this.$router.push({
            path:'/topicList',
            query:{
              agentCode:'activity'
            }
          })
        }else if(agentCode == 'activity'){
          this.$router.push({
            path:'/activityList',
            query:{
              agentCode:'activity'
            }
          })
        }else if(agentCode == 'survey'){
          this.$router.push({
            path:'/surveyList',
            query:{
              agentCode:'survey'
            }
          })
        }
      },
      goToManagement(){
        let {topicTitleName,surveyTitleName} = this.titleNameObj
        this.$router.push({
          path: '/appManagement',
          query: {
            topicTitleName,
            surveyTitleName
          }
        });
      }
    },
    components:{
      cultureTitle,
      cultureContent,
      cultureAddPopup,
      cultureNotContent,
    }
  }
</script>
<style lang="scss" scoped>
  @import './cultureIndex.scss';
</style>

