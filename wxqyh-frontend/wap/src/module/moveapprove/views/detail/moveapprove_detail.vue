<template>
  <div class="wrap"  v-windowscroll="scrollList" :class="{'qwui-flow_top':flowTip}">
    <!--无法流转提示-->
    <div class="qwui-flow_tip" v-show="flowTip">
      <p class="qwui-flow_word">{{flowTip}}</p>
    </div>
    <div v-if="detailTitleData">
      <!--详情标题头部-->
      <detail-title
        v-if="detailTitleData"
        :titledata="detailTitleData"
        @showThisPersonUtil="atThisPersonUtil"
      >
        <qw-uploader class="detail-header"
          v-if="fileList.length"
          title="附件"
          :showUpload="false"
          list-type="picture-list"
          :fileList="fileList"
                     :showUploadList="{ showDownIcon: true}"
                     @preview="previewFileList"
                     @download="handleDownFile"
        ></qw-uploader>
      </detail-title>
      <div class="relative">
        <span class="qwui-serial_entrance" @click="getFlowSerial">
          <i class="qwui-icon_serial"></i>流转明细
        </span>

        <!--当前处理人-->
        <div v-if="FlowAuditList.length">
          <user-selected-group
            v-for="(item,index) in FlowAuditList"
            :key="index"
            :title="detailAuditTitle(item)"
            :isEdit="false">
            <user-selected-item
              :title="detailAuditTitle(item)"
              :List="item.auditUserList"
              :isEdit="false"
              @showPersonList="showPersonList"
              @atThisPersonUtil="atThisPersonUtil"
              slot="user_selected_item">
            </user-selected-item>
          </user-selected-group>
        </div>

        <!--自由流程审批人-->
        <user-selected-group
          v-if="freeAuditList.length"
          title="审批人"
          :isEdit="false">
          <user-selected-item
            title="审批人"
            :List="freeAuditList"
            :isEdit="false"
            @showPersonList="showPersonList"
            @atThisPersonUtil="atThisPersonUtil"
            slot="user_selected_item"></user-selected-item>
        </user-selected-group>

        <!--下一步处理人-->
        <user-selected-group
          v-if="FlowAuditListShow"
          title="下一步处理人" :isEdit="false">
          <user-selected-item
            title="下一步处理人"
            :List="FlowAuditList[0].nextAuditList"
            :isEdit="false"
            @showPersonList="showPersonList"
            @atThisPersonUtil="atThisPersonUtil"
            slot="user_selected_item">
          </user-selected-item>
        </user-selected-group>


        <!--相关人-->
        <user-selected-group
          v-if="ccPersonList.length"
          title="相关人" :isEdit="false">
          <user-selected-item
            title="相关人"
            :List="ccPersonList"
            :isEdit="false"
            @showPersonList="showPersonList"
            @atThisPersonUtil="atThisPersonUtil"
            slot="user_selected_item">
          </user-selected-item>
        </user-selected-group>

        <user-selected-group
          v-if="carbonList && carbonList.length"
          title="抄送人" :isEdit="false">
          <user-selected-item
            title="抄送人"
            :List="carbonList"
            :isEdit="false"
            @atThisPersonUtil="atThisPersonUtil"
            @showPersonList="showPersonList"
            slot="user_selected_item">
          </user-selected-item>
        </user-selected-group>
      </div>
      <!--评论列表-->
      <comment_list
        :commentList="commentList"
        :totalRow="listTotalRows"
        @onlyComment="onlySeeComment"
        @atThisPersonUtil="atThisPersonUtil"
        @delete="deleteThisComment">
      </comment_list>

      <!--加载更多-->
      <Load_more :loading="loading"
                 :type="'commentList'"
                 :hasMore="hasMore"
                 @loadMoreClick="loadMoreList">
        <span v-if="!listTotalRows">还没有任何评论</span>
      </Load_more>

      <div v-if="!hasMore && listTotalRows" class="height-margin"></div>
      <div class="height-bottom"></div>

    </div>

    <!--个人信息-->
    <user_info @showChatTool="chetButtonClick"></user_info>

    <!--评论输入框组件-->
    <chatInput
      :show.sync="showChatTool"
      :autofocus.sync="autofocus"
      :dataBase="dataBase"
      :agent="agent"
      @updateContent="updateContent"
      @dealccPerson="backUserSelect"
      @closeChat="closeChatMask">
    </chatInput>

    <!--选择节点-->
    <select-node @selectNodeClick="selectNodeClick"></select-node>

    <!--预览图片组件-->
    <previewImages></previewImages>

    <!--人员列表组件-->
    <user-preview
      v-bind="userPreviewConfig"
      :show.sync="showPerson"
    >
    </user-preview>


    <!--审批请示按钮-->
    <flow-approve-button
      :FlowAudit="FlowAuditList[0]"
      :detail="flowApproveDetail"
      :approveVo="approveVo"
      :moreApproveButton="moreButton"
      @showChatTool="showChatToolFun"
      @actionButtonClick="actionButtonClick"
      @approveAction="approveAction">
    </flow-approve-button>

    <!--流程明细-->
    <flow-serial
      v-if="flowSerial.isShowFlowSerial"
      :flowSerialData="flowSerial"
      :isover="flowSerial.isover"
    >
    </flow-serial>

    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog
      v-if="flowApproveDialogShow"
      :agent="agent"
      :action="approveActionStatus"
      :detail="flowApproveDetail"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
    >
    </flow-approve-dialog>

    <!--处理人范围选人-->
    <user-selected-rang
      :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
      :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
      :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
      :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
      :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
      :checked="FlowAuditUserIds(appointUserIndex)"
      @FlowAuditUserResult="FlowAuditUserResult"
      v-if="FlowAuditUserBoxShow">
    </user-selected-rang>

    <!--公共选人组件-->
    <user_selected_Box
      v-if="selectConfig.show"
      :selectconfig="selectConfig">
    </user_selected_Box>

    <!--选人-->
    <user_selected_Box
      :selectconfig="dataBase.selectConfig"
      v-if="dataBase.selectConfig.show">
    </user_selected_Box>

  </div>
</template>
<script>
  import detailTitle from '@/components/detail/detail_title';
  import comment_list from '@/components/list/comment_list';
  import Load_more from '@/components/list/load_more';
  import chatInput from '@/components/detail/chatInput';
  import user_info from '@/components/detail/user_info_card';
  import user_selected_Box from '@/components/base/user_or_dept_select';
  import audit_flow_api from '@/components/flow/api/getData.js';
  import previewImages from "@/components/base/previewImages";
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
  import {commentListMore,addCommentList,deleteCommentList,getMoveDetail} from "../../../moveapprove/api/getData";
  import EventBus from '@/utils/eventBus';
  import {
    findBranchFlowNextNodeInfoFun,
  } from '@/components/flow/getAuditFlow';
  import flowManager from '@/components/mixins/flow-manager';
  import QwUploader from "@/components/upload";
  //文件上传mixins
  import uploader from '../../../../utils/uploader.js'
  import { bottomApproveButton, moreApproveButton } from '@/components/flow/config'

  export default {
    name: 'detail',
    mixins: [flowManager,uploader],
    components: {
      detailTitle,
      comment_list,
      Load_more,
      user_info,
      user_selected_Box,
      chatInput,
      previewImages,
      QwUploader
    },
    data() {
      return {
        // 如果要修改折叠按钮的某一项，请参考下面的方式更改
        moreButton: {
          ...moreApproveButton,
          flowSerial: {
            ...moreApproveButton.flowSerial,
            show: true,
          }
        },
        dataBase: dataBase,
        //自由审批人列表
        freeAuditList: [],
        toPersonList:  [],    // 所有处理人
        flowApproveDetail: {},                                       // 审批按钮需要用到的节点详情数据
        carbonList:null,//抄送人
        returnNode: {
          list: [],
          isFirstRequest: true,
        },
        loading:false,
        hasMore:false,
        lock_roll:false,
        currentPage:1,
        commentStatus:"1",
        listTotalRows:0,
        agent:'moveapprove',
        commentList:[],                                                        //评论列表
        commentValue: '',                                                        //评论输入框的值
        showChatTool:false,                                                      //显示评论输入框
        autofocus:false,
        moveapproveId:"",                                                       //审批单id
        deleteListIndex:"",                                                     //需要删除的index
        showPerson:false,                                                   //是否展开所有选中人员列表
        //附件列表
        fileList: [],
      }
    },
    created() {
      this.updateUserSelectedState({type: "refId", data: this.$route.query.moveId})
      this.showMoveDetail();
    },
    computed: {
      ...mapState({
        detailDataConfig: state => state.detail.detailData.detail,     // 详情信息
        detailTitleData: state => state.detail.detailTitleData,   // 附件信息
        detailDataTitle: state => state.detail.detailDataTitle,
        detailData: state => state.detail.detailData, // 详情信息
      }),
      listComment: function () { //评论数据
        return this.detailData.listComment;
      },
      // 无法流转的提示语
      flowTip(){
        if(this.FlowAuditList[0] && this.FlowAuditList[0].auditLeave){
          return '下一节点处理人不在通讯录中，流程无法流转';
        }
        if(this.FlowAuditList[0] && this.FlowAuditList[0].audtiFlag == '3'){
          return '下一节点未找到部门负责人，流程无法流转';
        }
        return false;
      }
    },
    methods: {
      ...mapActions([
        "updataAuditStatus",     // 更新状态
        "addCountersignType",    // 加签
      ]),
      //并行流程选择节点后进行处理
      selectNodeClick (item,data){
        //更新当前节点
        this.updateUserSelectedState({type: "currentNodeId", data: item.nodeId})
        this.showDetailPage(data)
      },
      // 详情加载
      showMoveDetail: function () {
        var self = this;
        getMoveDetail({
          moveId: self.refId,
          size: "10",
        }).then(function (result) {
          _.hideLoading();
          if (result.code == "0") {
            let detail = result.data.detail
            let isFree = detail.isFree == "0" || detail.isFree == "3" ?detail.isFree:'1'
            //更新流程类型
            self.updateUserSelectedState({type: "isFree", data: isFree})
            self.updateUserSelectedState({type: "refId", data: self.refId})
            self.flowApproveDetail = Object.assign({},self.flowApproveDetail,{
              isover: detail.isover,
              status:  detail.moveapproveStatus,
              creator: detail.creator,
              isFree: detail.isFree,
              approve: result.data.approve,
            })
            //判断是否是并行，是就查询并行接口获取节点列表
            if (result.data.detail && result.data.detail.currentNodeId.indexOf(',')!=-1){
              self.$store.commit('updateListName',result.data)
              self.getDetailNodeList(result.data,(res)=>{
                self.showDetailPage(res)
              })
            } else {
              //非并行流程
              self.updateUserSelectedState({type: "currentNodeId", data: result.data.detail? result.data.detail.currentNodeId : ''})
              self.showDetailPage(result.data)
            }
          }else if(result.code == "24003"){
            let btnConfig={
              primaryBtn:{name:"i18n.confirm", callBack:function () {
                self.$router.replace('/')
              }},
              defaultBtn:{name:"", callBack:null},
            };
            _.alert("该申请已被删除无法查看", result.desc,btnConfig);
          } else {
            _.alert("i18n.notice", result.desc);
          }
        })
      },
      showDetailPage (data){
        this.$store.commit('updateTitleData',data)
        this.$store.commit('updateDetailData',data)

        this.fileList.push(...this.setMatchFileList(data.mediaList))
        this.moveapproveId=data.detail.moveapproveId;

        //评论列表处理
        this.hasMore = data.hasMore;
        this.showCommentList(data.comments, data.hasMore ,data.detail.commentCount);

      //标题设置
        data.detail.title? document.title = data.detail.title: '';

        //审批状态判断
        let statusString = audit_flow_api.statusCheckFree(data.detail.creatorId,data.detail.moveapproveStatus,data.detail.isover,true);
        let status = _.append_status(statusString,true);
        this.detailTitleData.status=status;
        //不是自由流程， 已关闭、已审批、被退审,不需要请求
        if (this.isFree != "1") {
          // 已关闭、已审批、被退审,不需要请求/portal/flow/flowParallel/ajaxGetFlowAudit.do
          if(!(this.detailDataConfig.isover == -1 || this.detailDataConfig.moveapproveStatus == 2
              || this.detailDataConfig.isover === '0')) {
            let Params = {
              refId: this.refId,
              definitionId: 'moveapprove' + this.detailDataConfig.orgId,
              isBranch: this.isFree== '3'?true:false,
              nodeId: this.currentNodeId,
              status: this.detailDataConfig.moveapproveStatus
            };
            //不需要查询返回的数据则不需要callBack
            this.getFlowAuditNodeData(Params,(result)=>{
              this.carbonList = result.nodeInfo[0].carbonList;
            })
          }
        }else {
          // 自由流程获取转审人员
          this.getApprove(this.moveapproveId);
        }
        //更新明细数据
        this.flowSerial.isover = data.detail.isover;
        this.flowSerial.isFreeFlow = this.isFree;
        this.toPersonList = [...data.detail.toPersons]
        // 已关闭、已审批、被退审、自由流程：显示所有审批人
        if(this.detailDataConfig.isover == -1 || this.detailDataConfig.moveapproveStatus == 2
          || this.detailDataConfig.isover === '0' || this.isFree ==='1'){
          this.freeAuditList.length = 0
          this.freeAuditList.push(...data.detail.toPersons)
        }
        //更新相关人
        this.updateCCPerson(data.detail.ccPersons)

      },
      // 底部“更多按钮”的点击事件
      actionButtonClick(payload) {
        // 底部按钮点击查看流程明细
        if(payload==='getFlowSerial') {
          this.getFlowSerial('getFlowSerial')
        }
        // 如果是编辑
        if(payload==='editApprove') {
          this.$router.replace({path: '/add',query:{moveId:this.moveapproveId}})
        }
      },
      // 点击各个审批按钮
      approveAction(payload) {
        this.approveActionStatus = payload
        // 如果是“审批”
        if(payload==='approve') {
          if (this.isFree == 3 && this.isBranchNode) {
            let params = {
              initRefId: this.refId? this.refId:'',
              templateRefId: this.templateRefId,
              currentNodeId: (this.isBranchNode && this.defaultNextNodeId)? this.defaultNextNodeId:this.currentNodeId,
            }
            this.requestNextBranchNode(params)
          }
        }
        this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
      },
      chetButtonClick(data){
        this.showChatTool = true;
        this.autofocus = true
      },
      backUserSelect: function (obj) { //@人后把人添加为相关人,当@的人是审批人的话，不加到相关人
        let toPerson = this.toPersonList
        let toPersonIdStr = ''
        toPerson.forEach(function(item){
          toPersonIdStr+=item.userId
        });
        for(let i=obj.data.length-1;i>=0;i--){
          if(toPersonIdStr.indexOf(obj.data[i].userId)>-1){
            obj.data.splice(i,1);
          }
        }
        this.$store.commit('updateCCPerson',obj.data);
      },
      atThisPersonUtil(user){                                            // 查看个人头像信息
        if(user){
          EventBus.$emit("atThisPersonUtil",user);
        }
      },
      scrollList(){                                                // 滚动更多列表
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if(!this.lock_roll && this.hasMore){
            this.lock_roll=true;
            this.currentPage++;
            this.loadMoreList(status);
          }
        }
      },
      onlySeeComment(type){
        this.currentPage=1;
        this.commentList.length=0;
        this.commentStatus=type? "2":"1";
        if(!this.loading){
          this.loadMoreList();
        }
      },
      loadMoreList(){                                               // 加载更多列表
        var data={
          id:this.moveapproveId ,
          size: 10,
          commentStatus: this.commentStatus,
        };
        this.loading=true;
        data.page=this.currentPage;
        commentListMore(data,this.dealCommentList);
      },
      dealCommentList(data){
        this.loading=false;
        let commentCount = data.tbTaskinfo? data.tbTaskinfo.commentCount : null
        this.showCommentList(data.comments,data.hasMore,commentCount);
      },
      showCommentList(data,hasMore,commentCount){                                    // 处理返回的评论
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
      closeChatMask(val){
        this.commentValue = val
      },
      //显示评论弹窗
      showChatToolFun(){
        this.showChatTool = true
        this.autofocus = true
      },
      updateContent(data){                                              // 发送评论
        if(data){
          let msg={
          "content":data.content,
          "refId":this.moveapproveId,
          "type":data.type,
          "status":data.status,
          "userId":_.userId
          };
          data.userIds? msg.userIds=data.userIds:"";

          var self=this;
          addCommentList(msg,function (result) {
            if(result.commentId){
              self.commentList.splice(0,0,{
                commentId:result.commentId,
                headPic:_.headPic,
                personName:_.personName,
                creator:_.userId,
                type:data.type,
                content:data.content,
                time:"刚刚",
                commentStatus:data.status,
              });
              self.listTotalRows++;
            }
          });
        }
      },
      deleteThisComment(data,index){                                 // 删除评论
        if(data){
          this.deleteListIndex=index;
          var self=this;
          deleteCommentList({commentId:data.commentId},function (result) {  // 删除成功
            self.commentList.splice(self.deleteListIndex,1);
            self.listTotalRows--;
          });
        }
      },

      // 提交数据
      commitTask(payload) {
        let self = this
        // 如果是加签
        if(this.approveActionStatus==='assignApprove') {
          this.addCountersignType(payload)
          return
        }
        let commitData = {
          ...payload,
          'moveId': this.refId,
          'callback': function () {
            _.tooltips_succeed('操作成功');
            if(self.approveActionStatus=="agreeReApprove"){
              window.location.reload();
            }else{
              setTimeout(()=>{
                self.$router.replace('/')
              },1000)
            }
          }
        }
        // 如果是详情，非退审的分支流程，传下个节点id
        if (this.approveActionStatus!=='' && this.approveActionStatus !=='returnApprove' && this.isFree == 3) {
          if(this.defaultNextNodeId){
            commitData.nextNodeId = this.defaultNextNodeId
          }
        }
        this.updataAuditStatus(commitData)

      }
    }
  }

</script>
<style scoped>
  .relative{position: relative}
  .height-margin{height: 15px;}
  .height-bottom{height: 50px}
  .flowApproveButton >>> .qwui-action-button{
    z-index: 2;
  }
  /deep/ .upload-box.detail-header{
    padding: 0 0 4px
  }
</style>
