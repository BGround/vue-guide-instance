<template>
  <div class="detail">

    <div id="wrap_main" class="wrap">
      <div id="main" class="wrap_inner" >
        <div class="article_detail">
          <div class="article-detail no-line">
            <div class="detail-title" id="detailTitle">
              {{title}}
<!--              <span class="applyStatus status_gray"  style="">已结束</span>-->
            </div>
            <div class="detail-small-title">
              <span id="createtimetxt">{{lastEditTime}}</span>
              <span id="personNametxt">{{personName}}</span>
<!--              <a id="copyQuestionnair_div" href="javascript:;" style="display: none;">复制</a>-->
            </div>
            <div class="shuxing-box shuxing-box-size4">
              <div class="shuxing-item flexbox">
                <div class="shuxing-title">问卷类型</div>
                <div class="shuxing-value flexItem"><span>{{typeDesc}}</span></div>
              </div>
              <div class="shuxing-item flexbox">
                <div class="shuxing-title">查看权限</div>
                <div class="shuxing-value flexItem" id="permission">{{permissionDesc}}</div>
              </div>
              <div class="shuxing-item flexbox">
                <div class="shuxing-title">截止时间</div>
                <div class="shuxing-value flexItem">
                  <span class="detailStop">{{endTime}}</span>
                  <a class="icon_detail_edit ml5" id="showStopBtn" href="javascript:;" style="display: none;"></a>
                </div>
              </div>
              <div class="shuxing-item flexbox">
                <div class="shuxing-title">题目数量</div>
                <div class="shuxing-value flexItem">
                  <span class="detailStop" id="questioncount">{{questionNum}}题</span>
                </div>
              </div>
              <div class="shuxing-item flexbox" id="departmentDiv">
                <div class="shuxing-title">调查对象</div>
                <div class="shuxing-value flexItem">{{ext1}}</div>
              </div>
            </div>
            <div class="detail-content article_content">
              <div id="detailContent" class="article_content_text" style="word-break: break-all;text-align: justify;">请参与答卷！</div>
              <div id="topImage" style="display:none"></div>
            </div>


            <div class="relate">
              <div class="relate__title">涉及岗位(共{{userCount}}人)</div>
              <div class="relate__text" ref="relate-position" :class="{'hidden': isHideOverflowTextPost}">
                {{positionList.join('，')}}
              <div class="more" v-if="hasTextEllipsisPost">... <span class="blue" @click="handleClickMorePost">查看全部</span></div>
              </div>
            </div>

            <div class="relate">
              <div class="relate__title">涉及经销商(共{{dealerCount}}家)</div>
              <div class="relate__text" ref="relate-dealer" :class="{'hidden': isHideOverflowTextDealer}">
                {{dealerInfoList.join('，')}}
              <div class="more" v-if="hasTextEllipsisDealer">... <span class="blue" @click="handleClickMoreDealer">查看全部</span></div>
              </div>
            </div>

            <div class="white-bar mt15" id="joinCount">目前参与人数：{{joinNum}}/{{ext2}}</div>
          </div>

         <div class="btn-group">
           <flow_button :buttondata="detailButtonConfig"></flow_button>
         </div>

          <div class="fixed-btn-group" v-show="isShowFooter">
            <flow_button :buttondata="buttonConfig"></flow_button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

  import * as approvalApi from "../../api/approvalApi";
  import flow_button from '@/components/button/flow_button';
  import wx from "weixin-js-sdk";

    export default {
        name: "detail",
        components: {
            flow_button
        },
        data() {
            return {
                title: '',
                lastEditTime: '',
                personName: '',
                typeDesc: '',
                permissionDesc: '',
                endTime: '',
                questionNum: '',
                joinNum: '0',
                userCount: '0',
                dealerCount: '0',
                ext1: '0',
                ext2: '0',
                positionList:[],
                dealerInfoList:[],
                isShowFooter: false,

                buttonConfig:{
                    primaryList:[
                        {type:"primary",name:'通过',callBack: this.approval.bind(this, '0')},
                    ],
                    defaultList:[
                        {type:"default",name:'不通过', callBack: this.approval.bind(this, '2')},
                    ],
                    style:{class:""}//按钮是否置底部 active :底部、"":相对定位
                },

                detailButtonConfig:{
                    primaryList:[
                        {type:"primary",name:'查看详情',callBack: this.handleClickDetailBtn},
                    ],
                },
                hasTextEllipsisPost: false,
                hasTextEllipsisDealer: false,
                isHideOverflowTextDealer: true,
                isHideOverflowTextPost: true,

            }
        },
        props: {},
        methods: {
            setTextEllipsis(){
                const relatePosition = this.$refs['relate-position']
                const relateDealer = this.$refs['relate-dealer']
                this.hasTextEllipsisPost = relatePosition.scrollHeight > relatePosition.clientHeight;
                this.hasTextEllipsisDealer = relateDealer.scrollHeight > relateDealer.clientHeight

            },
            handleClickMorePost(){
                this.isHideOverflowTextPost = false;
                this.hasTextEllipsisPost = false;
            },

            handleClickMoreDealer(){
                this.isHideOverflowTextDealer = false;
                this.hasTextEllipsisDealer = false;
            },

            handleClickDetailBtn(){
                window.location.href = _.baseURL + '/jsp/wap/question/more_answer.jsp?id='+ this.id;
            },

            approval(type){

                const params = {
                    "ids":this.id,   //调查问卷ID
                    "isPassReview":type,   //审核状态（0-通过,2-不通过'）
                    // "belongAgent":'survey',
                }
                approvalApi.auditQuestionnaire(params).then((data)=>{
                  if(data){
                      _.alert('提示', '审核成功',{
                          primaryBtn:{name:"确定",callBack:()=>{this.$router.back()}},
                          defaultBtn:{name:"取消", callBack:null}
                      })
                  }
                })
            }


        },
        created() {
            this.id = this.$route.query.id;
            if(!this.id){
                this.$router.back()
            }
            approvalApi.getQuestionnaireDetail({id: this.id}).then((data)=>{
                if(data){
                    const questionnairePO = data.questionnairePO;
                    this.title = questionnairePO && questionnairePO.title ? questionnairePO.title : '';
                    this.lastEditTime = questionnairePO && questionnairePO.lastEditTime? questionnairePO.lastEditTime: '';
                    this.personName = questionnairePO && questionnairePO.personName? questionnairePO.personName: '';
                    this.typeDesc = questionnairePO && String(questionnairePO.type) === '1'? '匿名调查': '非匿名调查';
                    this.permissionDesc = questionnairePO && String(questionnairePO.type) === '1'? '参与人可查看结果': '参与人不可查看结果'; //查看权限,：0否，1是
                    this.endTime = questionnairePO && questionnairePO.endTime ? questionnairePO.endTime: ''; //结束时间
                    this.questionNum = questionnairePO && questionnairePO.questionNum ? questionnairePO.questionNum: ''; //题目数量
                    this.joinNum = questionnairePO && questionnairePO.joinNum ? questionnairePO.joinNum: '0'; //题目数量
                    this.userCount = data.userCount ? data.userCount: '0';
                    this.ext1 = questionnairePO && String(questionnairePO.ext1) === '1' ? '所有人': '特定对象'; //
                    this.ext2 = questionnairePO && questionnairePO.ext2 ? questionnairePO.ext2: ''; //题目数量
                    this.positionList = data && data.positionList ? data.positionList: [];
                    this.dealerInfoList = data && data.dealerInfoList ? data.dealerInfoList: [];
                    this.dealerCount = data.dealerCount ? data.dealerCount: '0';
                    this.id =  questionnairePO && questionnairePO.id ? questionnairePO.id: ''; //id
                    this.isShowFooter = questionnairePO && String(questionnairePO.isPassReview) === '1'
                    console.log(questionnairePO.isPassReview,'x')
                    this.$nextTick(this.setTextEllipsis)
                    console.log(data,'xx')
                }

            })
        }
    }
</script>

<style scoped lang="scss">
  /*详情页面属性*/
  .shuxing-box{
    padding-top: 25px;
  }
  .shuxing-item{
    padding: 5px 0;
    font-size: 15px;
    line-height: 16px;
  }
  .shuxing-icon{
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
  .shuxing-title{
    color: #666;
    text-align: left;
  }
  .shuxing-value{
    color: #333;
  }
  .shuxing-value a{
    color: #586c94;
  }
  .shuxing-box-size4 .shuxing-title{
    width: 75px;
  }
  .shuxing-box-size5 .shuxing-title{
    width: 95px;
  }
  .icon-shuxing, .ic-loc{
    width: 16px;
    height: 16px;
    /*background: url("../images/icon-shuxing.png?v1.0");*/
    background-size: 16px;
    display: inline-block;
  }
  .ic-loc {
    /*background: url("../images/ic_loc.png");*/
    background-size: 16px;
    cursor: pointer;
  }
  .icon-shuxing-place{
    background-position: 0 0;
  }
  .icon-shuxing-time{
    background-position: 0 -16px;
  }
  .icon-shuxing-edit{
    background-position: 0 -32px;
  }
  .icon-shuxing-cycle{
    background-position: 0 -48px;
  }
  /*详情状态块*/
  .checkStatus{
    display: inline-block;
    box-sizing: border-box;
    width: 45px;
    height: 20px;
    line-height: 18px;
    font-size: 12px;
    text-align: center;
    margin-left: 10px;
    border-radius: 3px;
    vertical-align: top;
  }
  .statusimg{
    border: 1px solid #1aad19;
    color:#1aad19;
  }
  .noPassStatus{
    border: 1px solid #d64949;
    color:#e94f4f;
  }
  .statused{
    border: 1px solid #666;
    color:#333;
  }
  .topWarn {
    padding: 10px 0;
    color: #fff;
    font-size: 13px;
    line-height: 1.5em;
    background: #85868d;
  }
  .topWarn-text {
    margin-left: 15px;
  }
  .topWarn a{
    color: #fff;
  }
  .share_btn{
    position:relative;
    z-index:3;
    width:55px;
    height:55px;
    line-height:55px;
    border:1px solid #ddd;
    border-radius:50%;
    display:inline-block;
  }
  .share_btn span{
    position:absolute;
    margin:auto;
    top:0px;
    bottom:0;
    left:0px;
    right:0;
    width:19px;
    height:19px;

    background-size:77px 20px;
  }
  .share_btn:active{
    background:#fff6ea;
    border:1px solid #ffe5c0;
    -webkit-tap-highlight-color:rgba(0,0,0,0)
  }
  .share_btn:active span{
    background-position:-57px 0;
  }
  .zanNum{
    display: inline-block;
  }
  .item-separate{
    margin: 0 15px;
    border-left: 1px #ddd solid;
  }

  .detail-title {
    padding: 25px 0 7px;
    color: #333;
    font-size: 20px;
    line-height: 1.5em;
  }

  .detail-small-title span,.detail-small-title a{
    margin-right: 5px;
  }

  .article-detail {
    position: relative;
    padding: 0 15px;
    background-color: #fff;
    border-bottom: none !important;
  }

  .flexbox {
    display: flex;
  }

  .detail-content {
    padding: 25px 0 15px;
    color: #333;
    font-size: 16px;
    line-height: 1.5em;
  }

  .white-bar {
    padding: 10px 0;
    color: #333;
    font-size: 15px;
    text-align: center;
    cursor: pointer;
    border: 1px #ddd solid;
  }

  .article_detail{
    background: #fff;
    min-height: 100vh;
  }

  .relate{
    margin-bottom: 16px;
    position: relative;
    .more{
      background: #fff;
      position: absolute;
      box-shadow: -4px 0 4px 0 #fff;
      bottom: 0;
      right: 0;
      .blue{
        color: #5585F0;
      }
    }
  }
  .relate__text{
    text-align: justify;
    line-height: 18px;
    &.hidden{
      height: 36px;
      overflow: hidden;
    }

  }

  .btn-group{
    margin: 20px 0 60px;
  }

  .relate__title{
    font-size: 14px;
  }

  .fixed-btn-group{
    position: fixed;
    width: 100%;
    bottom: 0;
  }

  .detail{
    background: #ffffff;
  }
</style>
