<template>
  <div class="wrap" v-windowscroll="scrollList">
    <div class="qwui-rep_detail_box">
      <!--详情头部申诉状态-->
      <div class="qwui-rep_detail_top">
        <span
          :class="{'qwui-rep-no_pass':repDetail.detail.status==2}"
        >
          {{detailData.statusDec[repDetail.detail.status]}}
        </span>
        <div class="qwui-detail_top_logo">
          <img :src="repDetail.detail.headPic" alt="">
        </div>
        <div class="qwui-detail_top_item">
          <p>{{repDetail.detail.personName}}</p>
          <span>{{repDetail.detail.createTime}}</span>
        </div>
      </div>
      <!--异常日期-->
      <p class="qwui-detail_sign_date">{{repDetail.detail.signDate | signDatefilter}}</p>
      <!--考勤异常信息-->
      <div class="qwui-yichang_box">
        <ul v-for="(item,index) in detailDataList.repList" :key="index">
          <li>
            <div class="qwui-checkwork_name">
              {{item.checkWorkName}}
            </div>
            <div class="qwui-yichang_list" v-if="detailDataList.startList.length != 0">
              <ul v-for="(item1,index1) in item.rdList" :key="index1">
                <li class="qwui-yichang_li" v-if="item1.signTime">
                  <p class="qwui-yichang_item">
                    <span
                      class="qwui-yichang_time"
                      :class="{'qwui-yichang_color':item1.signAddress !=='无考勤记录信息'}"
                    >
                      {{item1.signTime}}
                    </span>
                    <i>|</i>
                    <span class="qwui-yichang_type">{{item1.signType}}</span>
                    <span
                      class="qwui-margin_left"
                      :class="{'qwui-yichang_color':item1.signAddress !=='无考勤记录信息'}"
                    >
                      {{item1.signStatusDesc}}
                    </span>
                  </p>
                  <p class="qwui-yichang_sign_address" v-if="item1.signAddress !== ''">
                    <i v-if="item1.signAddress !=='无考勤记录信息'"></i>
                    <span>{{item1.signAddress}}</span>
                  </p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <!--申诉理由-->
      <div class="qwui-detail_rep_reason">
        <p class="qwui-rep_reason">{{$t('i18n.repReason')}}</p>
        <p class="qwui-rep_reason_text">{{repDetail.detail.content}}</p>
      </div>
      <!--图片附件-->
      <div class="qwui-clear_float" v-if="detailDataList.picList && detailDataList.picList.length > 0">
        <div class="qwui-tupian_box" v-for="list in detailDataList.picList">
          <img :src="dealImagesUrl(list.picPath)" @click="preview(list.picPath,detailDataList.picList)">
        </div>
      </div>
      <!--负责人和相关人内容-->
      <user-select :userselect="userSelect" @atThisPersonUtil="atThisPersonUtil"></user-select>
      <!--申诉中-->
      <div class="qwui-rep_button" v-show="repDetail.detail.status==3">
        <flow-button :buttondata="repDetail.buttonConfig"></flow-button>
        <flow-button :buttondata="repDetail.detail.buttonConfig"></flow-button>
        <p
          class="qwui-approve_text"
          v-show="approvedStatus"
        >
          {{$t('i18n.inAudit')}} : {{repDetail.detail.createTime}}
        </p>
      </div>
      <!--不通过-->
      <div class="qwui-no_passthrough_btn" v-show="repDetail.detail.status==2">
        <flow-button :buttondata="detailData.buttonConfig"></flow-button>
        <p
          class="qwui-approve_text"
          v-show="noApprovedStatus"
        >
          {{$t('i18n.noAudit')}} : {{repDetail.detail.auditTime}}
        </p>
      </div>
      <!--通过-->
      <div class="qwui-passthrough_time" v-show="repDetail.detail.status==4">
        <p class="qwui-approve_text">
          {{$t('i18n.isAudit')}} : {{repDetail.detail.auditTime}}
        </p>
      </div>
      <!--评论列表-->
      <comment_list
        :commentList="commentList"
        :hiddenSwitch=true
        :totalRow="listTotalRows"
        @atThisPersonUtil="atThisPersonUtil"
        @delete="deleteThisComment"
        :dealListDelete="dealListDelete"
      >
      </comment_list>
      <!--加载更多-->
      <Load_more :loading="loading"
                 :type="'commentList'"
                 :hasMore="hasMore"
                 @loadMoreClick="loadMoreList">
        <span class="qwui-pinglun_no_text" v-if="!listTotalRows">还没有任何评论</span>
      </Load_more>
      <div class="qwui-footer_height"></div>
    </div>
    <!--底部评论框-->
    <div class="qwui-comment_input_box"  @click="showChatClick">
      <div class="comment_btn_add">
        <input class="comment-chat_input" type="text" placeholder="评论一句吧">
      </div>
    </div>
    <!--评论输入框组件-->
    <chatInput
      :show.sync="showChatTool"
      :autofocus.sync="autofocus"
      :dataBase="dataBase"
      :agent="agent"
      @updateContent="updateContent"
      @closeChat="closeChatMask">
    </chatInput>
    <!--@人相关人组件-->
    <user_select_box :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select_box>
    <!--负责人、相关人详细列表-->
    <user-show :userselect="userSelect"></user-show>
    <!--个人信息-->
    <user_info ref="loadPersonalMsg"></user_info>
    <!--预览图片组件-->
    <previewImages></previewImages>
  </div>
</template>

<script>
  import flowButton from '@/components/button/flow_button';
  import userSelect from '@/components/detail/user_select';
  import userShow from '@/components/base/user_show';
  import comment_list from '@/components/list/comment_list';
  import Load_more from '@/components/list/load_more';
  import chatInput from '@/components/detail/chatInput';
  import user_select_box from '@/components/base/user_or_dept_select';
  import user_info from '@/components/detail/user_info_card';//个人信息
  import previewImages from "@/components/base/previewImages";
  import detail from '../../js/detail';
  import {commentListMore,addCommentList,deleteCommentList,isOrNotCharge,repApproval,repDetailShow} from "../../api/getData";
  import {handleRepDetailed} from "../../js/repCommon";
  import EventBus from '@/utils/eventBus';

  export default {
    components:{
      flowButton,
      userSelect,
      userShow,
      comment_list,
      Load_more,
      chatInput,
      user_select_box,
      user_info,
      previewImages
    },
    data(){
      return {
        dataBase:dataBase,
        detailData:detail.detailData,
        repDetail:detail.detailData.repDetail,
        agent:'checkwork',
        isAuditPerson: false,     //当前登录人是否是审批人（false:否）
        approvedStatus:false,     //是否显示“审核中”
        noApprovedStatus:false,  //是否显示“已退审”
        isHas:false,             //判断审批人是否是部门负责人
        passStatus:false,        //点击审核按钮，是否确认审核
        abnormalTime:'',         //迟到早退时间
        detailDataList:{},       //后台获取的数据
        loading:false,          //是否加载中
        hasMore:false,          //是否有更多
        lock_roll:false,
        currentPage:1,
        commentStatus:"1",
        listTotalRows:0,       //评论条数
        commentList:[],        //评论列表
        commentValue: '',     //评论输入框的值
        showChatTool:false,  //显示评论输入框
        autofocus:false,
        checkworkId:"",      //申诉id
        deleteListIndex:"", //需要删除的index
        dealListDelete:function(item){ //评论删除按钮的显示
          const status=(item.status||item.commentStatus);
          const time=item.time;
          const creator=item.creator || item.userId || item.createPerson;
          if(creator == _.userId &&
            (time =="刚刚"|| (time.indexOf("分钟前")!=-1 && parseInt(time.split("分钟前")[0])<30))){
            return  status=="9"||status == 0 ||status == "6";
          }else{
            return false;
          }
        },
      }
    },
    created:function(){
      this.repDetail.data.repId=this.$route.query.checkworkId;
      this.checkworkId=this.$route.query.checkworkId;
      this.detailShow();
    },
    computed:{
      buttonConfig:function(){ //详情操作按钮
        return this.repDetail.detail.scoreButtonConfig;
      },
      userSelect:function(){  //负责人、相关人
        return this.repDetail.detail.userListConfig;
      },
    },
    filters: {
      signDatefilter: function (val) {
        if (!val) return '';
        return val.replace(/(\d{4})\-(\d{2})\-(\d{2})/,"$1年$2月$3日");
      }
    },
    methods:{
      //详情加载
      detailShow:function(){
        let self = this;
        repDetailShow(self.repDetail.data,function (result) {
          self.detailDataList = result;
          self.repDetail.detail = {
            personName:result.rrpo.personName,
            creater:result.rrpo.creater,
            createTime:result.createTime,
            headPic:result.rrpo.headPic,
            signDate:result.signDate,
            auditTime:result.auditTime,
            content:result.rrpo.content,
            status:result.rrpo.status,
            picList:result.picList,//上传的图片列表
            userListConfig:{
              toPersonList:{
                title:"i18n.repApprover",
                show:false,
                num:result.toPersons.length,
                userSelected:result.toPersons,
              },
              ccPersonList:{
                title:"i18n.cc",
                show:false,
                num:result.ccPersons.length,
                userSelected:result.ccPersons,
              }
            },
          };
          //显示申诉的考勤明细
          handleRepDetailed(self.detailDataList);
          //操作按钮显示控制
          var curUserIdIsChargePerson = false;
          var toPersons = result.toPersons;
          var ccPersons = result.ccPersons;
          if(toPersons && toPersons.length>0) {
            self.detailData.buttonConfig={};
            self.repDetail.buttonConfig={};
            self.repDetail.detail.buttonConfig={};
            self.approvedStatus=false;
            self.noApprovedStatus=false;
            for (var i = 0; i < toPersons.length; i++) {
              if (toPersons[i].userId == _.userId){//判断审批人ID 是否和当前登录人的ID相等，如果相等当前登录人就是审批人,则显示审批按钮（通过和不通过按钮）；
                curUserIdIsChargePerson = true;
                self.repDetail.buttonConfig={
                  primaryList:[
                    {type:"primary",name:'i18n.passThrough',callBack:self.passThrough},
                  ],
                  defaultList:[
                    {type:"default",name:'i18n.noPassThrough', callBack:self.noPassThrough}
                  ],
                  style:{class:""}//按钮是否置底部 active :底部、"":相对定位
                };
                if(toPersons[i].createPerson == toPersons[i].userId && self.passStatus == false){//当申诉的审批人里面有申诉的创建人时，判断该审批人必须是部门负责人才能审批
                  var msg = {
                    'toUserId':toPersons[i].userId,
                    'repId':self.$route.query.checkworkId
                  };
                  isOrNotCharge(msg,function (result) {
                    self.isHas = result.isHas;
                    if(self.isHas == false){
                      self.repDetail.buttonConfig={
                        primaryList:[],
                        defaultList:[],
                        style:{class:""}//按钮是否置底部 active :底部、"":相对定位
                      };
                    }
                  });
                }
              };

              if(toPersons[i].createPerson == _.userId){//判断创建人ID 是否和当前登录人的ID相等，如果相等当前登录人就是创建人,则显示相关按钮；
                curUserIdIsChargePerson = true;
                self.repDetail.detail.buttonConfig={ //修改申诉 操作按钮
                  primaryList:[],
                  defaultList:[
                    {type:"default",name:'i18n.repRevise', callBack:self.editRep}
                  ],
                  style:{class:""}//按钮是否置底部 active :底部、"":相对定位
                };
                self.detailData.buttonConfig={ //申诉不通过，重新申诉 操作按钮
                  primaryList:[],
                  defaultList:[
                    {type:"default",name:'i18n.noPassBtnDec', callBack:self.editRep}
                  ],
                  style:{class:""}//按钮是否置底部 active :底部、"":相对定位
                }
              }else{//本身为相关人并且不是创建人时，显示已退审
                self.noApprovedStatus = true
              };
            }
          };
          if(ccPersons && ccPersons.length>0) {
            self.approvedStatus=false;
            for (var i = 0; i < ccPersons.length; i++) {
              if(ccPersons[i].userId ==_.userId && curUserIdIsChargePerson==false){//本身为相关人并且不是审批人和创建人时，显示审核中
                self.approvedStatus = true
              };
            }
          };
          if(result.comments){
            self.hasMore = result.hasMore;
            self.showCommentList(result.comments.pageData, result.hasMore ,result.comments.totalRows);
          };
        });
      },
      //图片路径
      dealImagesUrl(url){
        if(url.indexOf("http")!=-1){
          return url;
        }
        return (_.compressURL+url).replace('/compress/','/');
      },
      //预览图片
      preview (src,list) {
        EventBus.$emit("previewImages",(_.compressURL+src).replace('/compress/','/'),list);
      },
      //获取创建人详情
      getCreatorDetail:function (creator) {
        if(creator){
          this.$refs.loadPersonalMsg.showUserMessage(creator);
        }
      },
      //通过按钮
      passThrough(){
        this.repButton("同意",this.doPass)
      },
      //不通过按钮
      noPassThrough(){
        this.repButton("不同意",this.doNoPass)
      },
      //申诉审批按钮
      repButton(value,callBack){
        var content = [
          {type:"comment", comment:{maxLength:2000, placeholder:"", value:value}},
        ];
        var buttonConfig = {
          primaryBtn:{name:"确定", callBack:callBack},
          defaultBtn:{name:"取消", callBack:null},
        };
        _.showMsg("", content, buttonConfig);
      },
      //审批通过
      doPass(msg){
        this.repApprovalAction(msg,"4")
      },
      //审批不通过
      doNoPass(msg){
        this.repApprovalAction(msg,"2")
      },
      //申诉审批
      repApprovalAction(msg,status){
        let self = this;
        let data = {
          repId: this.$route.query.checkworkId,
          content: msg[0].value,
          status: status
        };
        if(!msg[0].value){
          _.alertError("内容不能为空",0);
          return;
        }
        repApproval(data,function () {
          _.tooltips_succeed("i18n.operationSuccess");
          self.commentList = [];
          self.passStatus = true; //防止不通过确认后多请求接口
          setTimeout(()=>{
            self.$router.push({
              path:'/repApprove',
              query:{
                index:3
              }
            });
          },1000);
        });
      },
      //修改申诉
      editRep(){
        this.$router.push({
          path:'/add',
          query: {checkworkId: this.$route.query.checkworkId,type:'edit'}
        });
      },
      /**评论列表相关操作 start */
      //显示评论框
      showChatClick(){
        this.showChatTool = true;
        this.autofocus = true
      },
      // 查看个人头像信息
      atThisPersonUtil(user){
        if(user){
          EventBus.$emit("atThisPersonUtil",user);
        }
      },
      // 滚动更多列表
      scrollList(){
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if(!this.lock_roll && this.hasMore){
            this.lock_roll=true;
            this.currentPage++;
            this.loadMoreList(status);
          }
        }
      },
      // 加载更多列表
      loadMoreList(){
        var data={
          size: 10,
          id: this.checkworkId
        };
        this.loading=true;
        data.page=this.currentPage;
        commentListMore(data,this.dealCommentList);
      },
      //处理加载更多
      dealCommentList(data){
        var isHasMore = false;
        if(data.comments.currentPage < data.comments.totalPages){
          isHasMore = true;
        }
        this.loading=false;
        this.showCommentList(data.comments.pageData, isHasMore ,data.comments.totalRows)
      },
      // 处理返回的评论
      showCommentList(data,hasMore,commentCount){
        this.hasMore=hasMore;
        this.lock_roll=false;
        if(data && data.length>0){
          this.commentList.push(...data);
          this.listTotalRows=commentCount? commentCount : Number(this.commentList.length);
        }else{
          this.commentList.length=0;
          this.listTotalRows=0;
        }
      },
      //关闭评论框
      closeChatMask(val){
        this.commentValue = val
      },
      // 发送评论
      updateContent(data){
        if(data){
          let msg={
            "sendComment": data.content,
            "userIds":'',
            "commentStatus": 6,
            "id": this.checkworkId,
          };
          data.userIds? msg.userIds=data.userIds:"";
          var self=this;
          addCommentList(msg,function (result) {
            _.tooltips_succeed("评论成功");
            if(result.commentId){
              self.commentList.splice(0,0,{
                id:result.commentId,
                headPic:_.headPic,
                personName:_.personName,
                createPerson:_.userId,
                content:data.content,
                time:"刚刚",
                commentStatus:6,
              });
              self.listTotalRows++;
            }
          });
        }
      },
      // 删除评论
      deleteThisComment(data,index){
        if(data){
          this.deleteListIndex=index;
          var self=this;
          deleteCommentList({id:data.id},function (result) {  // 删除成功
            _.tooltips_succeed("删除成功");
            self.commentList.splice(self.deleteListIndex,1);
            self.listTotalRows--;
          });
        }
      },
      /**评论列表相关操作 end */
    },
  }
</script>

<style scoped>
  .wrap,
  .wrap /deep/ .qwui-user_cell_title{
    background-color: #F7F7F7;
  }
  .wrap /deep/ .qwui-showMoreList{
    background-color:#fff;
  }
  .wrap /deep/ .qwui-btn.qwui-btn_default{
    background: rgba(251,250,252,1);
  }
  .wrap /deep/ .qwui-btn:after{
    border: 1px solid #e5e5e5;
  }
  .qwui-rep_detail_box{
    position: relative;
    margin-bottom: 50px;
  }
  .qwui-rep_detail_box /deep/ .qwui-content_word{
    white-space:normal;
  }
  .qwui-rep_detail_top{
    height: 64px;
    background: #fff;
    padding: 12px 15px;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
  }
  .qwui-rep_detail_top>span{
    position: absolute;
    right:15px;
    top:20px;
    color: #2F7DCD;
    font-size: 16px;
  }
  .qwui-rep_detail_top>span.qwui-rep-no_pass{
    color: red
  }
  .qwui-detail_top_logo{
    float: left;
  }
  .qwui-detail_top_logo img{
    width: 40px;
    height: 40px;
    border-radius: 5px;
  }
  .qwui-detail_top_item{
    margin-left: 50px;
  }
  .qwui-detail_top_item p{
    margin-bottom: 5px;
    color: #333;
    font-size: 16px;
    line-height: 1.2;
  }
  .qwui-detail_top_item span{
    color: #666;
    font-size: 12px;
  }
  .qwui-detail_sign_date{
    height: 35px;
    text-align: center;
    color:#666;
    font-size: 15px;
    line-height: 34px;
  }

  /*异常信息 start*/
  .qwui-yichang_box{
    border-bottom: 1px #ddd solid;
    background-color: #fff;
  }
  .qwui-checkwork_name{
    padding: 0 15px;
    color: #666;
    font-size: 14px;
    line-height: 39px;
    border-top: 1px #ddd solid;
    border-bottom: 1px #ddd solid;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-yichang_list{
    padding-left: 15px;
  }
  .qwui-yichang_li{
    padding: 8px 15px 8px 0;
  }
  .qwui-yichang_item{
    height: 22px;
    line-height: 22px;
  }
  .qwui-yichang_item i,span{
    display: inline-block;
    height: 22px;
    line-height: 22px;
    vertical-align: top;
  }
  .qwui-yichang_item i{
    font-size: 14px;
    margin-left: 10px;
    color: #999;
  }
  .qwui-yichang_type{
    font-size: 14px;
    margin-left: 10px;
    color: #666;
  }
  .qwui-yichang_time{
    font-size: 20px;
    font-weight: normal;
  }
  .qwui-yichang_sign_address span{
    color: #999;
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-yichang_sign_address i{
    display: inline-block;
    width: 13px;
    height: 22px;
    line-height: 22px;
    background: url("~assets/images/checkwork/mapMarker.png") no-repeat left 4px;
    background-size: 13px auto;
  }
  .qwui-margin_left{
    margin-left: 10px;
    font-size: 14px;
  }
  .qwui-yichang_color{
    color: #d64949;
  }
  /*异常信息 end*/

  .qwui-detail_rep_reason{
    margin-top: 10px;
    padding: 10px 15px 8px 15px;
    border-top: 1px #ddd solid;
    background-color: #fff;
  }
  .qwui-rep_reason{
    font-size: 14px;
    color:#666
  }
  .qwui-rep_reason_text{
    margin: 5px 0 0 0;
    color: #333;
    font-size: 15px;
    line-height: 18px;
    word-wrap: break-word;
    word-break: break-all;
  }
  .qwui-rep_button,
  .qwui-no_passthrough_btn{
    padding: 12px 0;
  }
  .qwui-rep_button>p,
  .qwui-no_passthrough_btn>p{
    margin: 10px 15px;
  }
  .qwui-passthrough_time{
    margin-top: 10px;
    padding: 20px 15px;
  }
  .qwui-approve_text{
    background: #b4b4b4;
    line-height: 35px;
    text-align: center;
    color: #ffffff;
    font-size: 14px
  }
  .qwui-pinglun_no_text{
    line-height: 44px;
  }
  @media screen and (min-width: 1024px) {
    .qwui-comment_input_box {
      width: 740px !important;
      margin: 0 auto;
    }
  }
  .qwui-comment_input_box{
    position: fixed;
    z-index: 3;
    bottom: 0;
    width: 100%;
    display: flex;
    line-height: 50px;
    height: 50px;
    vertical-align: middle;
    background-color: #fff;
    box-shadow: 0 -1px 10px 0 rgba(227,228,232,1)
  }
  .comment_btn_add{
    display: flex;
    justify-content: left;
    align-items: center;
    flex: 1;
    margin: 6px 15px;
    padding-left: 10px;
    border-radius: 5px;
    font-size: 15px;
    color: #999;
    text-align: left;
    background: #F5F5F5;
    cursor: pointer;
  }
  .comment-chat_input{
    font-size: 15px;
    background: none;
    width: 100%;
    color: #999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .qwui-clear_float{
    background-color: #fff;
    padding: 0 15px;
    border-bottom: 1px #ddd solid;
  }
  .qwui-tupian_box{
    height: 116px;
    width: 116px;
    display: inline-block;
    margin: 0 10px 10px 0;
  }
  .qwui-tupian_box img{
    height: 116px;
    width: 116px;
  }
  .qwui-footer_height{
    height: 50px;
    background-color: #fff;
  }
  .wrap /deep/ .qwui-commentList_list:last-child  .qwui-commentList_title:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
</style>


