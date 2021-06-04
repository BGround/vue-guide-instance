<template>
  <div class="wrap">
    <div class="relative">
      <!--流程明细-->
      <span class="qwui-serial_entrance" @click="getFlowSerial">
        <i class="qwui-icon_serial"></i>
        流转明细
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
    </div>

    <!--个人信息-->
    <user_info @showChatTool="showChatToolFun"></user_info>

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

    <!--审批请示按钮-->
    <flow-approve-button
      :FlowAudit="FlowAuditList[0]"
      :detail="flowApproveDetail"
      :approveVo="approveVo"
      @showChatTool="showChatToolFun"
      @actionButtonClick="actionButtonClick"
      @approveAction="approveAction">
    </flow-approve-button>

    <!--流程明细-->
    <flow-serial v-if="flowSerial.isShowFlowSerial"
                 :flowSerialData="flowSerial"
                 :isover="flowSerial.isover" >
    </flow-serial>

    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog
      :agent="agent"
      v-if="flowApproveDialogShow"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
      :action="approveActionStatus"
      :detail="flowApproveDetail"
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

    <!--人员列表组件-->
    <user-preview
      v-bind="userPreviewConfig"
      :show.sync="showPerson"
    ></user-preview>

    <!--公共选人组件-->
    <user_selected_Box
      v-if="selectConfig.show"
      :selectconfig="selectConfig">
    </user_selected_Box>
  </div>
</template>
<script>
  import {getMoveDetail} from "../../moveapprove/api/getData";

  import chatInput from '@/components/detail/chatInput';
  import user_info from '@/components/detail/user_info_card';
  import user_selected_Box from '@/components/base/user_or_dept_select'
  import EventBus from '@/utils/eventBus';

  import {
    findBranchFlowNextNodeInfoFun,
  } from '@/components/flow/getAuditFlow';
  import flowManager from '@/components/mixins/flow-manager';
  import {mapState,mapGetters, mapMutations,mapActions} from 'vuex';
  export default {
    name: 'detail',
    mixins: [flowManager],
    components: {
      user_selected_Box,
      user_info,
      chatInput
    },
    data() {
      return {
        dataBase,
        agent:'moveapprove',
        moveId: '',
        freeAuditList: [],    // 自由流程审批人
        flowApproveDetail: {},                                       // 审批按钮需要用到的节点详情数据
        showChatTool: false, //评论组件
        autofocus: false
      }
    },
    created(){
      this.moveId = this.$route.query.moveId;
      this.showMoveDetail()
    },
    computed:{
      ...mapGetters([
        'isMoveapproveStatus', //判断审批状态
      ]),
      ...mapState({
        detailData: state => state.detail.detailData,     // 详情内容数据
      }),
    },
    methods:{
      showMoveDetail (){
        var self = this;
        getMoveDetail({
          moveId: self.moveId,
          size: "10",
        }).then(function (result) {
          _.hideLoading()
          if (result.code == "0") {
            let detail = result.data.detail
            let isFree = detail.isFree == "0" || detail.isFree == "3" ?detail.isFree:'1'
            //更新流程类型
            self.updateUserSelectedState({type: "isFree", data: isFree})
            self.updateUserSelectedState({type: "refId", data: self.moveId})
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
          } else {
            _.alert("i18n.notice", result.desc);
          }
        })
      },
      //选择并行的某一节点进行审批
      selectNodeClick (item,data){
        //更新当前节点
        this.updateUserSelectedState({type: "currentNodeId", data: item.nodeId})
        this.showDetailPage(data)
      },
      //详情数据处理
      showDetailPage(data){
        //更新头部组件的数据
        this.$store.commit('updateTitleData',data)
        //更新详情内容的数据
        this.$store.commit('updateDetailData',data.detail)
        //更新附件列表数据
        this.$store.commit('updateMediaList',data.mediaList)
        //更新审批状态
        //不是自由流程
        if (this.isFree != "1") {
          // 已关闭、已审批、被退审,不需要请求
          if(!this.isMoveapproveStatus) {
            let Params = {
              refId: this.moveId,
              definitionId: 'moveapprove' + this.detailData.orgId,
              isBranch: this.isFree== '3'?true:false,
              nodeId: this.currentNodeId,
              status: this.detailData.moveapproveStatus
            };
            //不需要查询返回的数据则不需要callBack
            this.getFlowAuditNodeData(Params)
          }
        } else {
          this.getApprove(this.refId);   // 自由流程获取转审人员
        }
        //更新明细数据
        this.flowSerial.isover = data.detail.isover;
        this.flowSerial.isFreeFlow = this.isFree;
        //更新自由审批人
        if(this.isMoveapproveStatus || this.isFree ==='1'){
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
      },
      // 点击各个审批按钮
      approveAction(payload) {
        console.log(payload)
        this.approveActionStatus = payload
        // 如果是“审批”
        if(payload==='approve') {
          if (this.isFree == 3 && this.isBranchNode) {
            let params = {
              initRefId: this.moveId? this.moveId:'',
              templateRefId: 'moveapproveb17efb43292e4cc9ac5d0b46bce059c4',
              currentNodeId: (this.isBranchNode && this.defaultNextNodeId)? this.defaultNextNodeId:this.currentNodeId,
            }
            this.requestNextBranchNode(params)
          }
        }
        // 如果是“退审”
        if(payload==='returnApprove') {

        }
        this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
      },

      // 查看个人头像信息
      atThisPersonUtil(user){
        if(user){
          EventBus.$emit("atThisPersonUtil",user);
        }
      },
      //插入评论
      updateContent(data){
        console.log(data)
      },
      //插入相关人
      backUserSelect(data){
        console.log(data)
      },
      //关闭评论弹窗，返回输入值
      closeChatMask(val){
        console.log(val)
      },
      //显示评论弹窗
      showChatToolFun(){
        this.showChatTool = true
        this.autofocus = true
      },
      // 保存提交数据
      commitTask(data) {
        console.log("提交接口请求")
        console.log(data)
      }
    }
  }
</script>
