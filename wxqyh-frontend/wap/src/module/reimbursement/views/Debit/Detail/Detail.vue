<template>
  <div class="loanbursement-detail" v-windowscroll="scrollList">
    <!-- 详情标题 -->
    <div class="detail border-bottom-1px">
      <div class="detail-title">
        <span class="detail-title-name">{{title}} <apply-status class="apply_status" :applystatus="filterStatus"></apply-status></span>
      </div>
      <div class="detail-date">
        <span class="detail-date-time">{{createTime | formatDate}}</span>
        <span class="detail-date-name" @click.stop="atThisPersonUtil(detailData)">{{personName}}</span>
      </div>
      <span class="detail-loan-No">{{loanType}} | 借款单编号：{{loanNo}}</span>
    </div>
    <menu_tab v-if="showTab" class="tab-text" :menudata="tabData"></menu_tab>
    <count_money v-if="showRepayment"
                 :money="countRePayMoney"
                 :dedLineTime="dedLineTime">
    </count_money>
    <repay_list v-if="showRepayment"
                :unConfirmedList="unConfirmedList"
                :confirmedList="confirmedList"
                :confirmedSum="readyRePayMoney"
                :confirmRepayNum="confirmRepayNum"
                :count="count">
    </repay_list>
    <!--还款弹窗-->
    <pay_dialog
                :dialogShow="showRepay"
                :countRePayMoney="countRePayMoney"
                @closeDialog="closeDialog"
                @payBack="payBack">
    </pay_dialog>
    <!-- 借款明细 -->
    <field-list class="detail-item"
                v-if="showDetail"
                :isExpand="isShowDebitis"
                :fieldValue="debitList"
                :readOnly="true">
    </field-list>
    <!-- 图片/附件 -->
    <div class="media_con" v-if="filesList.length>0">
      <p class="title">图片/附件
        <img class="drop-down"
             :class="{'detail-arrowImg':this.showMediaDown }"
             width="14"
             height="8"
             src="~assets/images/icon_down_gray.png"
             alt="图片"
             @click="showMediaDown=!showMediaDown">
      </p>
      <qw-uploader class="detail-header"
                   v-if="filesList.length"
                   v-show="showMediaDown"
                   :showUpload="false"
                   list-type="picture-list"
                   :fileList="filesList"
                   :showUploadList="{ showDownIcon: true}"
                   :showUploadListFun="showUploadListFun"
                   @preview="previewFileList"
                   @download="handleDownFile"
      ></qw-uploader>
    </div>
    <!--银行信息组件-->
    <bank-msg  class="detail-item"
      v-if="showDetail && showBank"
      :bankMsg="bankMsg"
      :isEdit="false"
      :bankSwitch="false"
      :isShowHide="isShowHide"
      :showDown="isShowBankContent">
    </bank-msg>
    <div class="relative" :class="{'circulationDetails':!(FlowAuditList.length || freeAuditList.length)}" v-if="showDetail">
      <!--流程明细-->
      <span class="qwui-serial_entrance" v-if="isFree!=1" @click="getFlowSerial">
        <i class="qwui-icon_serial"></i>
        流转明细
      </span>
      <!--当前处理人-->
      <div v-if="FlowAuditList.length">
        <user_selected_group
          v-for="(item,index) in FlowAuditList"
          :key="index"
          :title="startAuditTitle(item)"
          :isEdit="false">
          <user_selected_item
            :title="startAuditTitle(item)"
            :List="item.auditUserList"
            :isEdit="false"
            @showPersonList="showPersonList"
            @atThisPersonUtil="atThisPersonUtil"
            slot="user_selected_item">
          </user_selected_item>
        </user_selected_group>
      </div>

      <!--自由流程审批人-->
      <user_selected_group
        v-if="freeAuditList.length"
        title="审批人"
        :isEdit="false">
        <user_selected_item
          title="审批人"
          :List="freeAuditList"
          :isEdit="false"
          @showPersonList="showPersonList"
          @atThisPersonUtil="atThisPersonUtil"
          slot="user_selected_item"></user_selected_item>
      </user_selected_group>

      <!--下一步处理人-->
      <user_selected_group
        v-if="FlowAuditListShow"
        title="下一步处理人" :isEdit="false">
        <user_selected_item
          title="下一步处理人"
          :List="FlowAuditList[0].nextAuditList"
          :isEdit="false"
          @showPersonList="showPersonList"
          @atThisPersonUtil="atThisPersonUtil"
          slot="user_selected_item">
        </user_selected_item>
      </user_selected_group>

      <!--相关人-->
      <user_selected_group
        v-if="ccPersonList.length"
        title="相关人" :isEdit="false">
        <user_selected_item
          title="相关人"
          :List="ccPersonList"
          :isEdit="false"
          @showPersonList="showPersonList"
          @atThisPersonUtil="atThisPersonUtil"
          slot="user_selected_item">
        </user_selected_item>
      </user_selected_group>
    </div>

    <!--个人信息-->
    <user_info @showChatTool="showChatToolFun"></user_info>

    <!--评论列表-->
    <comment_list
      :commentList="commentList"
      :totalRow="listTotalRows"
      :dealListContent="dealListContent"
      :dealListIcon="dealListIcon"
      :dealListDelete="dealListDelete"
      @onlyComment="onlySeeComment"
      @atThisPersonUtil="atThisPersonUtil"
      @delete="deleteThisComment">
    </comment_list>

    <!--加载更多-->
    <Load_more :loading="loading"
               :type="'commentList'"
               :hasMore="hasMore"
               @loadMoreClick="loadMoreList('click')">
      <span v-if="!listTotalRows">还没有任何评论</span>
    </Load_more>

    <div v-if="!hasMore && listTotalRows" class="height-margin"></div>
    <div class="height-bottom"></div>

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
    <!--预览图片组件-->
    <previewImages></previewImages>

    <!--选择节点-->
    <qw_select_node @selectNodeClick="selectNodeClick"></qw_select_node>

    <!--审批请示按钮-->
    <flow-approve-button
      :FlowAudit="FlowAuditList[0]"
      :detail="flowApproveDetail"
      :approveVo="approveVo"
      :bottomApproveButton="bottomButton"
      :moreApproveButton="moreButton"
      @showChatTool="showChatToolFun"
      @actionButtonClick="actionButtonClick"
      @approveAction="approveAction">
      <!-- 自定义底部按钮-->
       <template slot="bottomApproveButton" >
         <flow-action-button
           v-if="repayment"
           customClass="baoxiaoBtn"
           icon="repay_icon"
           text="还款"
           @actionButtonClick="actionButtonClick('goRepayment')">
         </flow-action-button>
         <!-- <div class="approve-button" v-if="copyLoan" @click="goCopyLoan">
            <span class="iconfont icon-shenpiqingshi-guanbi"></span>
            <span class="text detail-btn" >复制</span>
          </div>
          <div class="approve-button" v-if="!printIn" @click="printDetail">
            <span class="iconfont icon-shenpiqingshi-guanbi"></span>
            <span class="text detail-btn" >打印预览</span>
          </div>-->
       </template>

      <template slot="moreApproveButton">
        <p class="qwui-dialog_bottom_btn qwui-dialog_bottom_btn_default" v-if="copyLoan" @click="actionButtonClick('goCopyLoan')">复制</p>
        <!--<a class="qwui-dialog_bottom_btn qwui-dialog_bottom_btn_default"  v-if="print" @click="actionButtonClick('printDetail')">打印预览</a>-->
      </template>
    </flow-approve-button>

    <!--流程明细-->
    <flow_serial v-if="flowSerial.isShowFlowSerial"
                 :flowSerialData="flowSerialData"
                 :isover="flowSerial.isover" >
    </flow_serial>

    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog
      :agent="agent"
      v-if="flowApproveDialogShow"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
      :action="approveActionStatus"
      :config="dialogConfig">
    </flow-approve-dialog>

    <!--处理人范围选人-->
    <user_selected_ranglist
      :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
      :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
      :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
      :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
      :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
      :checked="FlowAuditUserIds(appointUserIndex)"
      @FlowAuditUserResult="FlowAuditUserResult"
      v-if="FlowAuditUserBoxShow">
    </user_selected_ranglist>

    <!--公共选人组件-->
    <user_selected_Box
      v-if="selectConfig.show"
      :selectconfig="selectConfig">
    </user_selected_Box>
    <user_selected_Box
      v-if="dataBase.selectConfig.show"
      :selectconfig="dataBase.selectConfig"
    >
    </user_selected_Box>

    <!--人员列表组件-->
    <user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user_show>
  </div>
</template>

<script>
  import QwUploader from "@/components/upload";                    //图片附件
  import FieldList from '../../../components/Debit/DebitField.vue' //借款明细
  import count_money from '../../../components/Debit/CountMoney'   //还款详情
  import repay_list from '../../../components/Debit/RepaymentsList'//还款详情列表
  import pay_dialog from '../../../components/Debit/payDialog'     //还款弹窗
  import menu_tab from '@/components/button/menu_tab.vue'          //tab
  import BankMsg from '../../../components/bankMsg';               //银行信息
  import applyStatus from '@/components/part/apply_status';        //审批状态
  import comment_list from '@/components/list/comment_list';       //评论
  import previewImages from "@/components/base/previewImages";
  import Load_more from '@/components/list/load_more';
  import {isVipSilver} from '@/assets/js/vip-portal.js';         	//判断VIP
  import {bottomApproveButton,moreApproveButton} from '@/components/flow/config';
  import chatInput from '@/components/detail/chatInput';
  import user_info from '@/components/detail/user_info_card';
  import user_selected_Box from '@/components/base/user_or_dept_select';
  import qw_select_node from '@/components/flow/selectNode';
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected';
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group';
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist';
  import  FlowApproveButton from '@/components/flow/flowApproveButton'; //流程底部按钮
  import {flow_action_btn} from '@/components/base/button';
  /* 审批弹窗*/
  import FlowApproveDialog from '@/components/flow/flowApproveDialog';
  import { approveDialogConfig } from '@/components/flow/config';

  import flow_serial from '@/components/flow/flow_serial';   // 流转明细
  import user_show from '@/components/detail/user_show';     //人员显示列表
  import {mapState,mapGetters, mapMutations,mapActions} from 'vuex';
  import EventBus from '@/utils/eventBus';
  //引入详情的请求方法
  import {
    getLoanDetail,//获取借款单明细
    commentListMore,//加载更多评论
    commitComment,//提交评论
    deleteCommentList,//删除评论
    addCounterSignType,
    commitRepayRequest, //还款
  } from '../../../api/debit';
  import { format } from '../../../js/common' //时间戳转时间
  //流程
  import {
    findBranchFlowNextNodeInfoFun,
    getDetailFlowAuditFun,
    getParallelFlowSerialFun
  } from '@/components/flow/getAuditFlow';
  //文件上传mixins
  import uploader from '../../../../../utils/uploader.js'

  export default {
    name: 'QwDebitDetail',
    mixins: [uploader],
    components: {
      FieldList,
      previewImages,
      menu_tab,
      count_money,
      repay_list,
      pay_dialog,
      BankMsg,
      applyStatus,
      user_show,
      comment_list,
      Load_more,
      user_selected_item,
      user_selected_group,
      qw_select_node,
      flow_serial,
      FlowApproveButton,
      FlowApproveDialog,
      user_selected_Box,
      user_selected_ranglist,
      user_info,
      chatInput,
      QwUploader,
      FlowActionButton: flow_action_btn
    },
    data() {
      return {
        loanId: '',       //详情id
        status:'',
        title: '',       //借款单标题
        loanVersion: '',  //借款单版本号
        commitData:{},   //提交数据
        loanNo: '',      //借款单编号
        createTime: '',  //创建时间
        loanType: '',    //单据类型名称
        loanState: '',   //借款单状态
        personName: '',  //创建人名称
        creator: '',     //创建人
        isover:'',       //审批单具体状态（审批中：""，退审：0，关闭：-1，完成：1）
        debitList: {     //借款明细
          deptName:'',   //部门
          deptId:'',      //部门id
          loanMoney: '', //借款单金额
          loanDate:'',   //借款日期
          repayDate:'',  //还款日期
          remark:''      //备注
        },
        bankMsg:{
          receiptFullName:'',//收款单位全称
          bankAccount:'',    //银行账号
          depositBank:''     //开户银行
        },
        filesList:[],             //附件列表
        showBank:false,          //是否使用银行组件
        isShowHide:true,      //是否支持展开/收起
        isShowBankContent: true, //银行列表是否展开
//        isShowAttachment: true,  //附件信息是否展开
        isShowDebitis:true,      //借款详情是否展开
        showMediaDown:true,      //图片/附件是否展开
        showRepayment:false,     //还款提示是否显示
        showTab:false,           //tab是否显示
        showDetail:true,         //借款详情是否显示
        unConfirmedList:[],       //未确认的还款详情列表
        confirmedList:[],        //确认的还款详情列表
        count:{},                //已到账相关信息
        editStatus: '',           //是否允许审批人编辑0不允许1允许
        isHandleAccount:false,   //是否为当前处理人
        copyLoan:false,           //复制按钮
        print:true,              //打印预览按钮
        repayment:false,         //还款按钮
//        cancelDebit:false,       //取消借款按钮
        showRepay:false,         //是否显示还款弹窗
        dedLineTime:'',           //还款日期
        countRePayMoney:0,       //需还款金额
        readyRePayMoney:0,       //已还款
        confirmRepayNum:0,      //已确认还款笔数
        bottomButton: {
//          ...bottomApproveButton,
          moreApprove:{
            ...bottomApproveButton.moreApprove,
            show:1,
          },
          chatInputShow: {
            show: 1,
          }
        },
        //修改弹窗配置的关闭（改为取消对应
        dialogConfig: {
          ...approveDialogConfig,
          closeApprove: {
            ...approveDialogConfig.closeApprove,
            title: '关闭借款单',
            reason:'关闭借款单',
//            approveTip: '请输入关闭原因',
          },
        },
        //修改折叠按钮的关闭
        moreButton: {
         /* closeApprove: {
            ...moreApproveButton.closeApprove,
            text :'取消',
          }*/
          editApprove: {
            ...moreApproveButton.editApprove,
            show: false,
          },
        },
        dataBase: dataBase,
        agent: 'reimbursement',
        flowApproveDetail: {},     // 审批按钮需要用到的节点详情数据
        approveActionStatus: '',   // 当前点击的按钮
        freeAuditList: [],         //自由审批人列表
        flowSerial: {              //流程明细
          isFirstRequest: true,
          isShowFlowSerial: false,
          list: [],
          isFreeFlow: '',
          currentTime: '',// 当前时间
          isover: ''
        },
        autofocus: false,        //显示评论弹窗
        loading:false,
        hasMore:false,
        lock_roll:false,
        currentPage:1,
        listTotalRows:0,
        /*approveText: '',       // 审批时输入的文字*/
        commentList:[],          //评论列表
        commentValue: '',        //评论输入框的值
        showChatTool:false,     //显示评论输入框
        commentStatus:"",        //评论状态（操作还是评论）
        deleteListIndex:"",      //需要删除评论的index
        dealListIcon: function (item) {
          return item.type == 3 ? "qwui-meeting_icon icon_icon7" : ''
        },
        dealListContent: function (item) {
          return item.type != "2" && item.type != "3" ? true : false;
        },
        dealListDelete: function(item) {    //评论删除按钮的显示
          const time=item.time;
          if(item.creator == _.userId && item.type != 3 &&
            (time=="刚刚"|| (time.indexOf("分钟前")!=-1 && parseInt(time.split("分钟前")[0])<30))){
            return  true;
          }else{
            return false;
          }
        },
        showPerson:false,       //是否展开所有选中人员列表
        userselectTitle:'',
        userSelectList:[],
        limitPreview:false,    //限制弹个人信息弹窗
        tabData:{
          show:true,           //控制显示与否
          navNum:0,            //当前点击的是哪个
          navBar:[
            {
              name:"还款",     //标题
              num:"",          //标题后带的数字
              data:{type:"0"}, //执行回调要用的数据
              callBack: res => {
                this.showDetail = false;
                this.showRepayment = true;
//                this.isShowBankContent=true;
              }
            },
            {
              name: "借款",
              num: "",
              data: {type:"1"},
              callBack: res => {
                this.showDetail = true;
//                this.isShowBankContent=false;
//                this.isShowDebitis=false;
                this.showRepayment = false;
                this.showMediaDown = false;
              }
            },
          ],
        },
      }
    },
    created(){
      //获取详情的id
      this.loanId = this.$route.query.id;
      // 请求详情
      this.showLoanDetail();
      //重置按钮数据
      this.$store.commit('resetFlowData');
    },
    computed: {
      ...mapGetters([
        "FlowAuditUserIds",   // 已选择的处理人id
        "FlowAuditListShow",    // 下一步处理人是否显示
        'isDebitMoveapproveStatus', //判断审批状态
      ]),
      ...mapState({
        detailData: state => state.detail.detailData,     // 详情内容数据
        isFree: state => state.flowUserSelected.isFree,          //流程类型,默认是自由流程'1'（固定为0，分支为3，全部应用需要统一）
        templateRefId: state => state.flowUserSelected.templateRefId,          //模板审批单id
        refId: state => state.flowUserSelected.refId,          // 审批单id

        isBranchFlow: state => state.flowUserSelected.isBranchFlow,          //接口返回的流程数据
        isBranchNode: state => state.flowUserSelected.isBranchNode,          //接口返回的流程数据
        flowId: state => state.flowUserSelected.flowId, // 已选的流程id
        currentNodeId: state => state.flowUserSelected.currentNodeId, // 当前节点id
        nextNodeId: state => state.flowUserSelected.nextNodeId, // 下一节点id
        defaultNextNodeId: state => state.flowUserSelected.defaultNextNodeId, // 下一节点id
        parallelNextNodeIds: state => state.flowUserSelected.parallelNextNodeIds,  // 并行子节点id，逗号隔开

        FlowAuditUser: state => state.flowUserSelected.FlowAuditUser, // 处理人信息
        FlowAuditList: state => state.flowUserSelected.FlowAuditList, // 详情节点当前和下一步处理人信息
        selectConfig: state => state.flowUserSelected.selectConfig, // 选人基础配置
        ccPersonList: state => state.flowUserSelected.ccPersonList, // 相关人信息

        flowList: state => state.flowUserSelected.flowList, // 流程列表

        FlowAuditUserBoxShow: state => state.flowUserSelected.FlowAuditUserBoxShow, //流程勾选类型弹窗：指定人员、部门、部门负责人
        flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
        appointUserIndex:state => state.flowUserSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
        appointNodeAndUserVOList: state => state.flowUserSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息
        approveVo: state => state.flowUserSelected.approveVo,  // 自由流程信息

        commitTaskParams: state => state.flowUserSelected.commitTaskParams, //提交返回的流程字段

        ccPersonListPage: state => state.detail.detailData.ccPersonList, //详情相关人列表
      }),
      //流程明细
      flowSerialData: function () {
        return this.flowSerial;
      },
      /*listComment: function () { //评论数据
        return this.detailData.listComment;
      },*/
//      0草稿 1审批中 2取消 3退审 4待转账(已审批) 5待还款 6已还款 7转账失败 (isover:'', // 审批单具体状态（审批中：""，退审：0，关闭：-1，完成：1）)
      filterStatus() { //审批状态
        let classN = '';
        switch (this.status) {
          case 1:  //审批中
            classN = "status_blue";
            this.showTab=false;
            this.showDetail=true;
            break;
          case 2:  //已取消
            classN = "status_gray";
            this.showTab=false;
            this.showDetail=true;
            break;
          case 3:  //退审
          classN = "status_red";
          this.showTab=false;
            this.showDetail=true;
          break;
          case 4:  //已审批
            classN = "status_green";
            this.showTab=false;
            this.showDetail=true;
            break;
          case 5:  //待还款
            classN = "status_red";
            this.showTab=true;
            this.showRepayment=true;
            this.showDetail=false;
            break;
          case 6:  //已还款
            classN = "status_red";
            this.showTab=true;
            this.showRepayment=true;
            this.showDetail=false;
            break;
          default:  //（转账失败）
            classN = "status_gray";
        }
        return {
          name: this.loanState ? this.loanState : '',
          class: classN,
          active: true
        }
      },
    },
    methods: {
      ...mapActions([
        "getApprove",   // 自由流程获取转审人员
        "updateFlowUserSelected",     // 更新已选处理人
        "getNodeListInfo", //获取节点选择信息
        'updateFlowCommitTaskParams', //更新提交数据json
        "updataDebitAuditStatus" // 更新状态(关闭/退审)
      ]),
      ...mapMutations([
        "updateUserSelectConfirm",
        'updateCCPerson',//更新相关人
        'updateUserSelectedState',
      ]),
      //图片不显示下载图标
      showUploadListFun(val){
        if(val.type == 'image'){
        return false;
        }else {
          return true;
        }
      },
      // 获取详情
      showLoanDetail(repayDetail) {
        _.showLoading('加载中...');
        var repayDetail=repayDetail;
        var self = this;
        getLoanDetail({
          loanId: self.loanId,
          size: "10"
        }).then((res) => {
          _.hideLoading();
          if (res.code == "0") {
            _.hideLoading('加载中...');
            let detail = res.data.data;
            let repayment = res.data.repayment;
            if(repayDetail){//还款之后只更新借还款详情和评论列表
              //借还款详情
              self.readyRePayMoney=repayment?repayment.amount:0;
              self.countRePayMoney = detail.surplusMoney||0;
              self.dedLineTime=detail.repayDate;
              self.unConfirmedList=repayment?repayment.unConfirmedList:[];      //未确认的还款详情列表
              self.confirmedList=repayment?repayment.confirmedList:[];        //确认的还款详情列表
              self.count=repayment&&repayment.account?repayment.account:{};
              self.confirmRepayNum=repayment?repayment.confirmRepayNum:0;
              if(self.countRePayMoney == 0){
                //如果还清隐藏评论按钮
                self.bottomButton.chatInputShow.show = 1;
                self.repayment=false;
              }
              //评论
              //评论列表处理
              self.showCommentList(res.data.comments, res.data.hasMore ,detail.commentCount,true)
            }else {
              let isFree = detail.isFree == "0" || detail.isFree == "3" ? detail.isFree : '1';
//            0草稿 1审批中 2取消 3退审 4待转账(已审批) 5待还款 6已还款 7转账失败 (isover:'', // 审批单具体状态（审批中：""，退审：0，关闭：-1，完成：1）)
//              this.isover = detail.status == '1'?'':detail.status == '2'?'-1':detail.status == '3'?'0':'1';
              this.isover = detail.isover;
//            this.share(res.shareVO);//分享
              self.status=detail.status;
              self.title = detail.title;
              self.loanNo = detail.loanNo;
              //借款单版本号
              self.loanVersion = detail.loanVersion;
              self.createTime = detail.createTime;
              self.loanType = detail.typeName;
              self.loanState = detail.loanState;
              self.personName = detail.createPersonName;
              self.creator = detail.createPerson;

              //借款信息
              self.debitList.deptName = detail.deptName;
              self.debitList.deptId =  detail.deptId || '';
              self.debitList.loanMoney = detail.loanMoney;
              self.debitList.loanDate = detail.loanDate;
              self.debitList.repayDate = detail.repayDate;
              self.debitList.remark = detail.remark;
              self.countRePayMoney = detail.surplusMoney||0;
              //借还款详情
              self.readyRePayMoney=repayment?repayment.amount:0;
              self.confirmRepayNum=repayment?repayment.confirmRepayNum:0;
              self.dedLineTime=detail.repayDate;
              self.unConfirmedList=repayment?repayment.unConfirmedList:[];      //未确认的还款详情列表
              self.confirmedList=repayment?repayment.confirmedList:[];        //确认的还款详情列表
              self.count=repayment&&repayment.account?repayment.account:{};
              //银行信息,其中一个不为空，就有启用银行字段
              if( detail.receiptFullName || detail.bankAccount ||detail.depositBank){
                self.showBank = true;
                self.bankMsg.receiptFullName = detail.receiptFullName;
                self.bankMsg.bankAccount = detail.bankAccount;
                self.bankMsg.depositBank = detail.depositBank;
              }
              self.editStatus =detail.editStatus;
              //附件列表
              let fileList = [];
              fileList.push(...res.data.mediaList);
              fileList.push(...res.data.picList);
              self.filesList.push(...this.setMatchFileList(fileList));
              // 更新流程类型
              self.updateUserSelectedState({type: "isFree", data: isFree});
              self.updateUserSelectedState({type: "refId", data: self.loanId});
              self.flowApproveDetail = Object.assign({}, self.flowApproveDetail, {
                isover: self.isover,//
                status: detail.status,
                creator: detail.createPerson,
                isFree: detail.isFree,
                approve: res.data.approve
              });
              //判断是否是并行，是就查询并行接口获取节点列表
              if (detail && detail.currentNodeIds.indexOf(',')!=-1){
                self.$store.commit('updateListName',res.data)
                self.getDetailNodeList(res.data)
              } else {
                //非并行流程
                self.updateUserSelectedState({
                  type: "currentNodeId",
                  data: detail? detail.currentNodeIds : ''
                })
                self.showDetailPage(res.data)
              }
              //是否是用户ID 是则显示复制按钮(更多也显示),否则不显示
              if(detail.createPerson === _.userId){
                self.copyLoan = true;
                self.bottomButton.moreApprove.show = true;
              }
              //编辑按钮的显示条件（可编辑）
              if (self.editStatus == "1") {
                self.moreButton.editApprove.show = true;
              }
              //还款按钮 是提单人 并待还款金额为0和当前为代还款状态
              if(detail.createPerson === _.userId && self.countRePayMoney != 0 && self.status == 5){
                //隐藏评论按钮
                self.bottomButton.chatInputShow.show = 0;
                self.repayment=true;
              }
            }
          }else {
            _.hideLoading('加载中...');
            _.alert("i18n.notice", res.desc);
          }
        }).catch((error) => {
          _.hideLoading('加载中...');
          let btnConfig={
            primaryBtn:{name:"i18n.confirm", callBack:function () {
              self.$router.go(-1)
            }},
            defaultBtn:{name:"", callBack:null},
          };
          _.alert("i18n.notice", error.desc,btnConfig);

        });
      },
      // 查询并行的节点选择接口
      getDetailNodeList(data) {
        let self = this;
        this.getNodeListInfo({
          'refId': self.loanId,
          'callback': function (result) {
            if (result.length > 0) {
              self.updateUserSelectedState({
                type: "currentNodeId",
                data: result[0].nodeId
              })
            } else {
              self.updateUserSelectedState({
                type: "currentNodeId",
                data: data.detail ? data.detail.currentNodeId : ''
              })
            }
            self.showDetailPage(data)
          }
        })
      },
      // 处理人标题
      startAuditTitle(item) {
        if (this.FlowAuditList.length === 1) {
          return '当前处理人'
        }
        return item.vo ? item.vo.nodeName + ' 处理人' : item.nodeName + ' 处理人'
      },

      //点击查看更多相关人/处理人/审批人
      showPersonList(title, list, type) {
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
        if(type){
          this.limitPreview = true
        }else{
          this.limitPreview = false
        }
      },
      selectNodeClick(item, data) {
        //更新当前节点
        this.updateUserSelectedState({
          type: "currentNodeId",
          data: item.nodeId
        })
        this.showDetailPage(data)
      },
      //详情数据处理
      showDetailPage(data) {
        //更新详情内容的数据
        data.data.creator = data.data.createPerson;
        this.$store.commit('updateDetailData', data.data);
        //评论列表处理
        this.hasMore = data.hasMore;
        this.showCommentList(data.comments, data.hasMore ,data.data.commentCount);

        //不是自由流程
        if (this.isFree != "1") {
          this.getFlowAuditNodeData()
        } else {
          this.getApprove(this.refId);   // 自由流程获取转审人员
        }
        //更新明细数据
        this.flowSerial.isover = this.isover;  //data.data.isover
        this.flowSerial.isFreeFlow = this.isFree;
        //更新自由审批人
        if (this.isDebitMoveapproveStatus || this.isFree === '1') {
          this.freeAuditList.length = 0;
          this.freeAuditList.push(...data.data.toPersonList)
        }
        //初始化更新相关人
        this.updateCCPerson(data.data.ccPersonList)
      },
      //查询流程审批节点信息
      getFlowAuditNodeData() {
        let self = this;
        // 已关闭、已审批、被退审,不需要请求
        if (this.isDebitMoveapproveStatus) {
          return
        }
        let Param = {
          refId: this.loanId,
          definitionId: 'loan' + this.detailData.orgId.replace(/-/g,''),
          isBranch: this.isFree == '3' ? true : false,
          nodeId: this.currentNodeId,
          status: this.detailData.status
        };
        // 详情页面获取当前处理人、下一节点处理人、节点信息
        getDetailFlowAuditFun(Param, (res) => {
          self.$store.commit('updateSearchFlowListData',res);
          self.$store.commit('updateFlowAuditList', res.nodeInfo);
          self.$store.commit('updateFlowChioseNodeAuditUser');    // 更新由上一个节点已选择的处理人
          // 加签不能是空的currentNodeId
          /*if(res.nodeInfo && res.nodeInfo[0].vo) {
            res.currentNodeId = res.currentNodeId == '' ? res.nodeInfo[0].vo.nodeId : res.currentNodeId
          }
          this.updateUserSelectedState({type: 'isBranchNode', data: res.isBranchNode});

          this.$store.commit('updateSearchFlowListData', res);    // 第一接口返回的数据进行统一更新
          this.$store.commit('updateFlowChioseNodeAuditUser');    // 更新由上一个节点已选择的处理人*/
//          this.$store.commit('updateFlowAuditList', res.nodeInfo); //更新当前处理人
        })
      },
      // 底部“更多按钮”的点击事件
      actionButtonClick(payload) {
        // 底部按钮点击查看流程明细
        if(payload==='getFlowSerial') {
          this.getFlowSerial('getFlowSerial')
        }
        //编辑
        if(payload ==='editApprove'){
          if (this.creator != _.userId || this.editStatus == "1") {  //
            // 审批人编辑
            this.$router.push({path: '/debitApproveredit', query: {type:'approveredit',id: this.loanId}});
          } else {
            // 提单人编辑
            this.$router.push({path: '/debitEdit', query: {type:'edit',id: this.loanId}});
          }
        }
        //还款
        if(payload ==='goRepayment'){
          this.showRepay = true;
        }
        // 如果是“复制”
        if (payload === 'goCopyLoan') {
          this.$router.push({path: '/debitCopy', query: {type:'copy',id:this.loanId }});
        }
        // 如果是“打印预览”
        if (payload === 'printDetail') {
          if(isVipSilver(interfaceCode.INTERFACE_CODE_FORM)){
            let loanId = this.loanId;
            window.location.href = _.baseURL + '/jsp/wap/reimbursement/portalPrintDebit.jsp?loanId='+loanId;
          }else{
            _.alert("提示","打印功能仅限VIP用户使用","确定",function(){
              restoreSubmit();
            });
          }
        }
      },
      //点击查看流程明细
      getFlowSerial: function () {
        let Param = {
          refId: this.loanId,
          isFree: this.isFree == '0' ? 2 : this.isFree //固定流程转为2
        }
        getParallelFlowSerialFun(Param, (result) => {
          if (result.auditSerial.length) {
            this.flowSerial.list = result.auditSerial;
            this.flowSerial.currentTime = result.currentTime;
            this.flowSerial.isShowFlowSerial = true;
            this.flowSerial.isFirstRequest = false;
          }
        })
      },
      // 点击各个审批按钮
      approveAction(payload) {
        this.approveActionStatus = payload;
        // 如果是“审批”
        if (payload === 'approve') {
          if (this.isFree == 3 && this.isBranchNode) {
            this.requestNextBranchNode()
          }
        }
        this.updateUserSelectedState({
          type: "flowApproveDialogShow",
          data: true
        })
      },
      requestNextBranchNode() {
        let params = {
          'searchValue.field_sumMoneys':this.debitList.loanMoney, //借款金额
          'searchValue.field_department':this.debitList.deptId,//所属部门
          initRefId: this.loanId ? this.loanId : '',
          templateRefId: this.templateRefId ? this.templateRefId : '',
          currentNodeId: (this.isBranchNode && this.defaultNextNodeId) ? this.defaultNextNodeId : this.currentNodeId,
        };
        //最后接口数据回调
        findBranchFlowNextNodeInfoFun(params, (result) => {
          console.log(result)
          this.$store.commit('updateFlowAuditUserData', result);
          this.updateUserSelectedState({
            type: "flowApproveDialogShow",
            data: true
          });
          //更新下拉选择节点名称
          this.$store.commit('updateChooseNodeName')
        })
      },
      //选择处理人后点击确定回调
      FlowAuditUserResult(payload) {
        this.$store.commit('checkFlowAuditUserType', payload)
        // 如果是多部门，则请求部门负责人
        this.updateFlowUserSelected(payload)
      },
      // 查看个人头像信息
      atThisPersonUtil(user) {
        if (user) {
          EventBus.$emit("atThisPersonUtil", user);
        }
      },
      //插入相关人
      backUserSelect(obj) {
        let userId = ''
        if(this.isFree == '1' ){
          //自由流程审批人
          this.freeAuditList.forEach(function(item){
            userId +=item.userId
          });
        } else {
          //当前审批人列表userId
          if(this.FlowAuditList.length){
            this.FlowAuditList.forEach(function(value){
              if(value.auditUserList){
                let ids = value.auditUserList.map((item)=>{
                  return item.userId
                })
                userId+=ids.join('|')
              }
            })
          }
        }
        for(let i=obj.data.length-1;i>=0;i--){
          if(userId.indexOf(obj.data[i].userId)>-1){
            obj.data.splice(i,1);
          }
        }
        if(obj.data){
          this.$store.commit('addCCPersonList',obj.data);
          this.updateCCPerson(this.ccPersonListPage)
        }
      },
      //关闭评论弹窗，返回输入值
      closeChatMask(val) {
        console.log(val);
        this.commentValue = val;
      },
      //显示评论弹窗
      showChatToolFun() {
        this.showChatTool = true
        this.autofocus = true
      },
      // 保存提交数据
      commitTask(data) {
        if(this.approveActionStatus === 'assignApprove'){  //加签
          this.requestAddCounterSignType(data)
        } else{
          this.debitAuditStatus(data)
        }
      },
      //加签提交
      requestAddCounterSignType(data){
        _.showLoading('提交中...');
        let params = {
          isFree:this.isFree,
          id: this.refId,
          currentNodeId: this.currentNodeId,
          type: data.type,
          addCounterSignPersonsStr: data.addCounterSignPersonStr,
          reason: data.reason,
        };
        addCounterSignType(params).then((res)=>{
          if(res.code == '0'){
            _.hideLoading();
            let obj = {
                '1': '加会签成功，您可以继续处理表单',
                '2': '加前签成功，需等待前签人员处理',
                '3': '加后签成功，当前节点处理后自动流转'
            };
            _.tooltips_succeed(obj[data.type]);
            setTimeout(()=>{
              window.location.reload()
            },2000)
          } else {
            _.hideLoading();
            _.alert("i18n.notice",res.desc);
          }
        }).catch(err=>{
          _.hideLoading();
          _.alert("i18n.notice",err.desc);
        })
      },
      //其他审批提交
      debitAuditStatus(data){
        let self = this;
        self.updataDebitAuditStatus({//更新状态
          'loanId': this.loanId,
          'reason': data.reason,
          'status': data.status,
          'nextNodeId': data.nextNodeId,
          'loanVersion': this.loanVersion,
          'parallelNextNodeIds': this.parallelNextNodeIds,
          'currentNodeId': this.currentNodeId, //当前节点ID
          'chooseFlowUser':data.chooseFlowUser,
          'flowDpId':data.flowDpId,
          'flowChioseNodeAuditUserJson':data.flowChioseNodeAuditUserJson,
          'signImg':data.signImg,
          'callback': function () {
            _.tooltips_succeed('操作成功');
            setTimeout(()=>{
              data.status == -1?self.$router.push('/debitList'):self.$router.push('/newRelated');
            },1000)
          }
        })
      },
      // 滚动更多列表
      scrollList() {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if (!this.lock_roll && this.hasMore) {
            this.lock_roll = true;
            this.currentPage++;
            this.loadMoreList();
          }
        }
      },
      onlySeeComment(type){
        this.currentPage=1;
        this.commentList.length=0;
//        this.commentStatus=type? "2":"1";
        this.commentStatus=this.commentStatus==2?'':2;
        if(!this.loading){
          this.loadMoreList();
        }
      },
      loadMoreList(type){
        // 加载更多列表
        var data={
          loanId:this.loanId,
          size: 10,
          onlyRead:this.commentStatus,
          /*status: this.commentStatus,*/
        };
        this.loading=true;
        if(type == 'click'){
          //如果不支持滑动，点击加载更多时
          this.currentPage++;
        }
        data.page=this.currentPage;
        commentListMore(data,this.dealCommentList);
      },
      dealCommentList(data){
        this.loading=false;
        let commentCount = data.commentCount? data.commentCount : null;
        this.showCommentList(data.comments,data.hasMore,commentCount);
      },
      showCommentList(data,hasMore,commentCount,isAll){                                    // 处理返回的评论
        this.hasMore=hasMore;
        this.lock_roll=false;
        if(data && data.length>0){
          if(isAll){
            //还款之后刷新整个评论列表
            this.commentList = data;
          }else{
            this.commentList.push(...data);
          }
          this.listTotalRows=commentCount? commentCount : Number(this.commentList.length);
        }else{
          this.commentList.length=0;
          this.listTotalRows=0;
        }
      },
      updateContent(data){                                              // 发送评论
        if(data){
          let msg={
            "content":data.content,
            "loanId":this.loanId,
            'signImg':data.signImg,
            "type":data.type,
            /* "status":data.status,*/
          };
          data.userIds? msg.userIds=data.userIds:"";

          var self=this;
          commitComment(msg,function (result) {
            if(result.commentId){
            //如果当页数据有10条，截取前9条
              if(self.commentList.length == 10){
                self.commentList = self.commentList.slice(0,9);
              }
              self.commentList.splice(0,0,{
                commentId:result.commentId,
                headPic:_.headPic,
                personName:_.personName,
                creator:_.userId,
                type:data.type,
                content:data.content,
                time:"刚刚",
              });
              self.listTotalRows++;
            }
           /* if(data.status=="6"){
              window.location.reload();
            }*/
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
     /* showDetailBankContent() { //银行信息
        this.isShowBankContent = !this.isShowBankContent;
      },*/
      closeDialog(){
        this.showRepay = false;
      },
//      还款操作
      payBack(val){
       let params = {
         loanId:this.loanId,
         money:val,
         type:'2', //1,转账，2，还款，3，核销，4，微信还款
        };
       var self=this;
        commitRepayRequest(params).then((res)=>{
          if(res.code == 0){
            self.showRepay = false;
            _.alert('i18n.notice','还款申请提交成功，等待出纳确认',{
              primaryBtn: {name: 'i18n.confirm', callBack: () => {
                let repay = true;
                self.showLoanDetail(repay);
              }
                },
              defaultBtn: {name: '', callBack: null}
            });
          } else {
            _.alert("i18n.notice",res.desc);
          }
        }).catch(err=>{
          _.alert("i18n.notice",err.desc);
        })
      }
    },
    // 分享配置
    share(shareVO) {
      let link = shareVO.shareUrl.split('#')[0] + '#' + shareVO.shareUrl.split('#')[1]
      wx.onMenuShareTimeline( {
        title: shareVO.shareTitle,  // 标题
        link: link,                 // 链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: shareVO.shareImg,   // 图标
        success: () => {}           // 用户点击了分享后执行的回调函数
      });
      wx.onMenuShareAppMessage({
        title: shareVO.shareTitle,
        desc: shareVO.shareContent.replace(/<[^>]+>/g, ''), // 描述
        link: link,
        imgUrl: shareVO.shareImg,  // 分享图标
        type: '',                  // 分享类型,music、video或link，不填默认为link
        dataUrl: '',               // 如果type: music、video，则要提供数据链接，默认为空
        success: () => {}
      });
      wx.onMenuShareQQ({
        title: shareVO.shareTitle,
        desc: shareVO.shareContent.replace(/<[^>]+>/g, ''),
        link: link,
        imgUrl: shareVO.shareImg,
        success: () => {},
        cancel: () => {}
      })
    },
    filters: {
      //如果创建时间是当年则不显示年份,不是则不显示时间
      formatDate(time) {
          return _.getFormatTime(time);
      },
      getIndex(num) { //序号
        return num < 10 ? '0' + num : num;
      }
    },
  }

</script>
<style lang="scss" scoped>
  @import '~../../../styles/mixin.scss';
  @import '~../../../styles/variable.scss';
  .baoxiaoBtn /deep/ .repay_icon {
    background-image: url("~assets/images/reim/loan/rapay_icon.png");
  }
  .loanbursement-detail {
  .detail-item{margin-top: 10px;}
  .tab-text{
    color:$color-text-d;
    z-index:3;
  }
  .media_con{
    padding: 15px 15px 5px 15px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fff;
  }
  .media_con .title{
    padding-bottom: 10px;
  }
  .media_con .drop-down{
    float: right;
    margin-top: 7px;
  }
  .relative{position: relative}
  .circulationDetails{
    min-height: 45px;
    background-color: #fff;
    margin: 10px 0;
  }
  .height-margin{height: 15px;}
  .height-bottom{height: 50px}
  .detail-arrowImg {
    transform: rotate(180deg);
  }
  .detail {
    padding: 16px;
    background-color: $color-background;
  .detail-title-name {
    display: inline-block;
    font-family: PingFangSC-Medium;
    color: #3F4A64;
    font-size: 17px;
    font-weight: 500;
    margin-bottom: 12px;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .apply_status{
    margin-top: -3px;
  }
  .detail-title-status {
    color: #1AAD19;
    border: 1px solid #1AAD19;
    font-size: 12px;
  }
  .detail-date-time {
    display: inline-block;
    color: #7A7C80;
    font-size: 14px;
    margin-right: 10px;
  }
  .detail-date-name {
    color: #7A7C80;
    font-size: 14px;
  }
  .detail-loan-No {
    display: inline-block;
    color: #7A7C80;
    font-size: 14px;
    margin-top: 7px;
  }
  }
  .detail-attachment {
    width: 100%;
    background-color: $color-background;
    margin-top: 10px;
  .detail-attachment-info {
    height: 50px;
    line-height: 50px;
  .detail-attachment-name {
    width: 90px;
    height: 16px;
    font-size: 16px;
    color: $color-text-d;
    margin-left: 15px;
  }
  .detail-attachment-arrow {
    float: right;
    margin-right: 16px;
  }
  }
  .detail-fujian {
    display: flex;
    line-height: 1.4;
    padding: 10px 15px 10px 15px;
  .detail-fujian-images {
    border-radius: 4px;
  }
  .detail-fujian-text {
    flex: 1;
    position: relative;
    padding-right: 100px;
  .detail-fujian-name {
    display: -webkit-box;
    font-size: 15px;
    color: #333;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .detail-fujian-size {
    color: #999;
    font-size: 13px;
  }
  }
  .detail-fujian-down {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 50%;
    right: 0px;
    margin-top: -12px;
  }
  }
  }
  .approve-button{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    color: #333;
    font-size: 16px;
    cursor: pointer;
  }
  .detail-btn {
    font-size: 16px;
    color:#333;
    background-color: #fff;
  }
  .iconfont{
    font-size: 18px;
    color: rgba(166, 166, 166, 1);
  }
  .detail-header{
    padding: 0;
  }
  }

</style>
