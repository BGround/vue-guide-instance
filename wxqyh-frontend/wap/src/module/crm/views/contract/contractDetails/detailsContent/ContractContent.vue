<template>
  <div class="wrap contractBox"  v-windowscroll="scrollList">

    <!--头部信息-->
    <div class="qwui-contrDetails_head">
      <p class="qwui-contrDetails_title">
        {{detailsData.title}}
        <span class="contract-status" :class="[status.class]">{{status.name}}</span>
      </p>

      <div class="qwui-details_info">
        <div class="qwui-contrDetails_creator">创建人<p>{{detailsData.personName}}</p></div>
        <div class="qwui-contrDetails_createTime">创建时间<p>{{detailsData.createTime}}</p></div>
        <div class="qwui-contrDetails_updateTime">更新时间<p>{{detailsData.updateTime}}</p></div>
        <div class="qwui-contrDetails_contrAmount" v-if="true">
          {{contractAmount[0].optionName}}
          <p v-html="formatMoney(detailsData.contractAmount)"></p>
        </div>
      </div>

      <div class="qwui-details_operaInfo">
        <div class="qwui-details_operaInfo_list"
             v-for ="(item,index) in center"
             @click="go(item)"
             :key="index"
             v-if="item.status">
          <span>{{item.optionName}}</span>
          <p>{{item.value}}</p>
          <span v-if="item.value!='无'" class="qwui-details_operaInfo_list_arrow"></span>
        </div>
      </div>
    </div>


    <!--主体-->
    <div class="qwui-contrDetails_content" v-windowscroll="getScrollTop">
      <nav_tabs
        :defaultActiveKey="isContract? 'isContract':'noContract'"
        :activeIndex="indexControl"
        :tabs="tabs"
        :position="position"
        @listenNavTabs="listenNavTabsBack">
        <!--合同详情-->
        <div slot="isContract">
          <div class="qwui-contrDetail_detail">
            <div class="qwui-contrDetail_basicList">
              <div class="qwui-contrDetails_list"
                   v-for="(item,index) in middle"
                   v-if="item.status"
                   :key="index">
                <span>{{item.optionName}}</span>
                <div v-if="item.isWrap!=true">{{item.value}}</div>
                <div>
                  <pre v-if="item.isWrap==true" v-html="checkURL(item.value)"></pre>
                </div>
              </div>
            </div>
            <div class="qwui-contrDetail_itemList" :class="{'top-line':hasItemList}" v-if="hasItemList">
              <!--自定义字段 ，同意替换成组件-->
              <div class="qwui-details_customList">
                <crm-operate-item
                  v-for="(item,index) in itemJson"
                  :item="item"
                  :key="index">
                </crm-operate-item>
              </div>
              <!-- <div class="qwui-contrDetails_list"
                   v-for="(item,index) in itemJson"
                   :key="index">
                <span>{{item.optionName}}</span>
                <div>{{item.value}}</div>
                <span v-if="item.ext1 === '3'">%</span>
              </div> -->
            </div>
          </div>
          <!--图片附件-->
          <div class="qwui-details_itemPic">
            <div class="qwui-details_itemPicTitle">照片</div>
            <detail_title :titledata="detailPic"  v-if="hasPic" @on-preview="onPreviewImage"></detail_title>
          </div>


          <div class="relative">
            <!--流程明细-->
            <span class="qwui-serial_entrance" v-if="isShowSerial" @click="getFlowSerial">
              <i class="qwui-icon_serial"></i>
              流转明细
            </span>

            <!--负责人-->
            <user_selected_group
              v-if="toPersonList.length"
              title="负责人" :isEdit="false">
              <user_selected_item
                title="负责人"
                :List="toPersonList"
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


          </div>
        </div>



        <!--回款明细-->
        <div class="qwui-contrDetail_returnMoney" slot="noContract">
          <div class="qwui-contrDetail_returnDetail">
            <div class="qwui-contrDetail_returnNum">
              <p class="qwui-contrDetail_returned" v-html="moneyFilter(contractOutline.paymentAmount)"></p>
              <p>已回款(元)</p>
            </div>
            <div class="qwui-contrDetail_returnNum">
              <p class="qwui-contrDetail_noReturn" v-html="moneyFilter(contractOutline.nonPaymentAmount)"></p>
              <p>未回款(元)</p>
            </div>
            <div class="qwui-contrDetail_returnNum">
              <p class="qwui-contrDetail_noReturn" v-html="moneyFilter(contractOutline.nonPaymentInvoiceAmount)"></p>
              <p>开票未回款(元)</p>
            </div>
          </div>

          <!--回款明细-->
          <reimbursement
            v-for="(item,index) in returnMoneyArr"
            :moneyData="item"
            @delStep="delStep(index)"
            :key="index"></reimbursement>

          <button class="qwui-contrDetail_addReturneriod" @click="add" v-if="editable">添加回款期次</button>

        </div>
      </nav_tabs>
    </div>

    <!--合同执行状态列表-->
    <transition name="fade">
      <div class="qwui-contrStatus" v-if="showStatusList"></div>
    </transition>
    <transition name="slide">
      <div class="qwui-contrStatus_list" v-if="showStatusList">
        <div class="qwui-contrStatus_head">
          <span class="qwui-contrStatus_cancel" @click="cancelList">取消</span>
          <span class="qwui-contrStatus_title">更新合同状态</span>
          <span class="qwui-contrStatus_comfirm" @click="comfirmStatus">确定</span>
        </div>
        <ul class="qwui-contrStatus_statusList">
          <li v-for="(item,index) in statusList"
              @click="selectStatus(item,index)"
              :key="index"
              :class="{statusActive:stautsIndex==index}">{{item.name}}</li>
        </ul>
      </div>
    </transition>


    <!--评论列表-->
    <comment_list
      :commentList="commentList"
      :totalRow="listTotalRows"
      :hiddenSwitch="isShowOnlyCommentBtn"
      @atThisPersonUtil="atThisPersonUtil"
      @commentListImagesURL="commentListImagesURL"
      @delete="deleteThisComment">
    </comment_list>
    <!--加载更多-->
    <load_more :loading="loading"
               :type="'commentList'"
               :hasMore="hasMore"
               :currPage="currentPage"
               :maxPage="maxPage">
      <span v-if="listTotalRows>0">共 {{listTotalRows}} 条评论</span>
      <span v-if="!listTotalRows">还没有任何评论</span>
    </load_more>
    <div v-if="!hasMore && listTotalRows" class="height-margin"></div>
    <div class="height-bottom"></div>

    <!--个人信息-->
    <user_info @showChatTool="showChatToolFun"></user_info>

    <!--评论输入框组件-->
    <chatInput
      :show.sync="showChatTool"
      :autofocus.sync="autofocus"
      :dataBase="dataBase"
      :agent="agent"
      @updateContent="updateContent"
      @dealccPerson="backUserSelect">
    </chatInput>

    <!--选择节点-->
    <qw_select_node @selectNodeClick="selectNodeClick"></qw_select_node>

    <!--审批请示按钮-->
    <flow_approve_button
      :FlowAudit="FlowAuditList[0]"
      :detail="flowApproveDetail"
      :bottomApproveButton="bottomButton"
      :moreApproveButton="moreButton"
      :approveVo="approveVo"
      @showChatTool="showChatToolFun"
      @actionButtonClick="actionButtonClick"
      @approveAction="approveAction">

      <!--自定义折叠的按钮-->
      <template slot="moreApproveButton">
        <p @click="editContract" v-if="showEditBtn">编辑</p>
        <p @click="delContract"  v-if="showDelBtn">删除</p>
      </template>
    </flow_approve_button>

    <!--流程明细-->
    <flow_serial v-if="flowSerial.isShowFlowSerial"
                 :flowSerialData="flowSerialData"
                 :isover="flowSerial.isover" >
    </flow_serial>

    <!--选择节点处理人 弹窗-->
    <flow_approve_dialog
      :agent="agent"
      v-if="flowApproveDialogShow"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
      :detail="flowApproveDetail"
      :action="approveActionStatus">
    </flow_approve_dialog>

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
    <user_choose :selectconfig="dataBase.selectConfig"
                 v-if="dataBase.selectConfig.show"
                 :tabActive="dataBase.selectConfig.signIndex =='depts'?'dept':'group'"
                 :closeUser="dataBase.selectConfig.signIndex =='depts'"
                 :closeGroup="dataBase.selectConfig.signIndex =='depts'"
                 :closeDeptTab="true"
                 :closeAllTab="dataBase.selectConfig.signIndex =='depts'">
    </user_choose>

    <!--公共选人组件-->
    <user_selected_Box
      v-if="selectConfig.show"
      :selectconfig="selectConfig">
    </user_selected_Box>

    <!--人员列表组件-->
    <user_show :title="userselectTitle"
               :userSelect="userSelectList"
               :limitPreview="limitPreview"
               :show.sync="showPerson"></user_show>

    <!--预览图片组件-->
    <previewImages :urls="previewImageUrl"></previewImages>

  </div>


</template>

<script>
  import CrmOperateItem from '../../../base/CrmOperateItem';

  import nav_tabs from '@/components/base/nav_tabs.vue';
  import detail_title from '@/components/detail/detail_title.vue';
  import previewImages from '@/components/base/previewImages.vue';
  import user_select from '@/components/detail/user_select.vue';
  import {
    findBranchFlowNextNodeInfoFun,
    getDetailFlowAuditFun,
    getParallelFlowSerialFun
  } from '@/components/flow/getAuditFlow'
  import qw_select_node from '@/components/flow/selectNode';
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import flow_approve_button from '@/components/flow/flowApproveButton'
  import flow_approve_dialog from '@/components/flow/flowApproveDialog'
  import flow_serial from '@/components/flow/flow_serial'; // 流转明细
  import chatInput from '@/components/detail/chatInput';
  import user_choose from '@/components/base/user_or_dept_select.vue' //js导入
  import user_selected_Box from '@/components/base/user_or_dept_select'
  import user_info from '@/components/detail/user_info_card.vue';
  import user_show from '@/components/detail/user_show'
  import EventBus from '@/utils/eventBus';
  import {mapState,mapGetters, mapMutations,mapActions} from 'vuex';

  import comment_list from '@/components/list/comment_list';
  import load_more from '@/components/list/load_more';
  import reimbursement from '../../../../components/Reimbursement/Reimbursement';
  import {
    getContractDetails,
    getContractStatusList,
    commentListMore,
    addCommentList,
    deleteCommentList,
    removeContract,
    updateContractStatus,
    addSign,
    returnMoney,
    delStep,
    updateAuditStatus,
  } from '../../../../api/contract/getData.js';
  import { bottomApproveButton,moreApproveButton } from '@/components/flow/config';
  import data from './data.js';

  let step=0;
    export default {
      components:{
        nav_tabs,
        detail_title,
        previewImages,
        user_select,

        qw_select_node,
        user_selected_item,
        user_selected_group,
        user_selected_ranglist,
        flow_approve_button,
        flow_approve_dialog,
        flow_serial,
        chatInput,
        user_choose,
        user_info,
        user_show,

        comment_list,
        load_more,
        reimbursement,
        user_selected_Box,

        CrmOperateItem
      },
      data(){
        return{
          dataBase:dataBase,
          details:dataBase.details,
          contractData:data,
          contractAmount:data.contract.contractAmount,
          center:data.contract.center,
          middle:data.contract.middle,
          detailsData:{},//接口详情数据
          basicList:[], //固定字段
          itemList:[], //自定义字段
          itemJson:[],
          previewImageUrl:[], //预览图片
          tabs:[{text:"合同详情",key:"contract"},{text:"回款明细",key:"returnMoney"}],
          agent:'crm',//crm系统消息
          showEditBtn:false,//是否显示编辑合同按钮
          showDelBtn:false,//是否显示删除合同按钮
          isCharge:false,//是否当前负责人
          isShowOnlyCommentBtn:true,//是否显示只看评论开关
          hasItemList:false,  //是否有自定义字段
          isContract:true, //是否显示合同详情
          indexControl:0, //tab索引
          position:"",  //导航位置
          hasPic:false,//照片附件列表是否有值
          detailPic:{ //图片，附件
            openPrint:true,
            creator:"",
            personName:"",
            createTime:"",
            describes:[],
            content:"",
            configCopy:{},//复制页面信息到新建页面
            picList:[],//上传的图片列表
            mediaList:[],//上传的附件列表
            isUseRate:"",
            priority:"",
            status:{},//详情状态
            title:''//详情标题
          },
          currentStatus:"",//当前合同执行状态
          statusList:[],//合同执行状态列表
          stautsIndex:"",//合同执行状态列表项索引
          statusCode:"",//执行状态码
          statusName:"", //执行状态名称
          showStatusList:false,//是否显示合同执行状态列表
          lock:false,
          contractOutline:{},//回款明细
          stepList:[],//回款明细
          returnMoneyData:{//回款明细数据配置
            step:"",//第几期次
            contractId:"",//合同id
            id:"",//期次id
            editable:"",//是否可编辑回款明细
            title:'',//期次标题
            returnMoney:[
              {name:'计划',value:'0'},
              {name:'实际',value:'0'},
              {name:'开票',value:'0'},
            ],
            delBtn:'删除',
            content:{
              plan:{
                label:'计划',
                add:'+',
                list:[]
              },
              receive:{
                label:'实际',
                add:'+',
                list:[]
              },
              invoice:{
                label:'开票',
                add:'+',
                list:[]
              }
            }
          },
          returnMoneyArr:[],//回款明细数据
          itemIndex:"",//记录被删除期次的索引
          editable:"",//是否显示添加期次按钮
          btnConfig:{ //提示框
            primaryBtn:{name:"确定", callBack:null},
            defaultBtn:{name:"取消", callBack:null},
          },

          contractId: '', //合同id
          flowApproveDetail: {},  // 审批按钮需要用到的节点详情数据
          approveActionStatus: '', // 当前点击的按钮
          freeAuditList: [], //自由审批人列表
          isShowSerial:true,
          flowSerial:{  //流程明细
            isFirstRequest: true,
            isShowFlowSerial: false,
            list: [],
            isFreeFlow: '',
            isover:'',
            currentTime: '',// 当前时间
          },
          auditListIndex:"",//审批人索引
          showChatTool: false, //评论组件
          autofocus: false,
          commentList:[],  //评论列表
          loading:false, //加载中
          hasMore:false,//评论列表是否加载更多
          maxPage:0,//最大页数
          currentPage:1,//当前页
          listTotalRows:0,//评论列表总条数
          deleteListIndex:"", //需要删除的index
          status:{},//合同审批状态标签
          statusString:"",//合同审批状态标签文字
          bottomButton: { //底部按钮配置
            moreApprove: { //更多
              ...bottomApproveButton.moreApprove,
              show: true
            },
            agreeReApprove: { //转审
              ...bottomApproveButton.agreeReApprove,
              show: false
            },
          },
          moreButton: {
            agreeReApprove: { //转审
              ...moreApproveButton.agreeReApprove,
              show: true
            },
            flowSerial: { //流转明细
              ...moreApproveButton.flowSerial,
              show: 1
            }
          },
          showPerson:false,  //是否展开所有选中人员列表
          userselectTitle:'',
          userSelectList:[],
          limitPreview:false, //限制弹个人信息弹窗
          newCCPersonList:[],
          isAuditUser:"", //审批中且有编辑权限，带到编辑页面
          isPermit:"",//合同删除权限控制
          isFromContractList:1,//是否从合同列表进入详情页
          isFromWaitDealList:0,//是否从待办审批列表进入详情页
        }

      },
      computed:{
        userSelect:function(){  //负责人、相关人
          return this.details.userListConfig;
        },
        listComment:function () { //评论数据
          return this.contractData.listComment;
        },
        ...mapGetters([
          "FlowAuditUserIds",   // 已选择的处理人id
          "FlowAuditListShow",    // 下一步处理人是否显示
          'isMoveapproveStatus', //判断审批状态
        ]),
        ...mapState({
          detail: state => state.flowDetail.detail,     // 详情内容数据
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
          nodeInfo: state => state.flowUserSelected.nodeInfo,

          FlowAuditUser: state => state.flowUserSelected.FlowAuditUser, // 处理人信息
          FlowAuditList: state => state.flowUserSelected.FlowAuditList, // 详情节点当前和下一步处理人信息
          selectConfig: state => state.flowUserSelected.selectConfig, // 选人基础配置
          ccPersonList: state => state.flowUserSelected.ccPersonList, // 相关人信息
          toPersonList: state => state.flowUserSelected.toPersonList, // 负责人信息

          flowList: state => state.flowUserSelected.flowList, // 流程列表

          FlowAuditUserBoxShow: state => state.flowUserSelected.FlowAuditUserBoxShow, //流程勾选类型弹窗：指定人员、部门、部门负责人
          flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
          appointUserIndex:state => state.flowUserSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
          appointNodeAndUserVOList: state => state.flowUserSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息
          approveVo: state => state.flowUserSelected.approveVo,  // 自由流程信息

          commitTaskParams: state => state.flowUserSelected.commitTaskParams, //提交返回的流程字段
        }),
        //流程明细
        flowSerialData: function () {
          return this.flowSerial;
        },
      },
      created(){
        this.isPC = _.isWeChat() && !_.isWeChatApp()
        this.isUEditor = 0 //非富文本
        let agentCode = this.$route.query.agentCode;
        window.dataBase.wxqyh_uploadfile.agent = agentCode === 'contract'? 'contract' : 'crm';  // 设置合同agentcode

        this.contractId = this.$route.query.id;
        this.isFromContractList = this.$route.query.isFromContractList;
        this.isFromWaitDealList = this.$route.query.isFromWaitDealList;
        this.getDetails();
        this.showComment();
        //重置按钮数据
        this.$store.commit('resetFlowData');
      },
      beforeRouteEnter (to, from, next) {
        next(vm => {
          // 如果是计划回款进入，显示回款明细
          if(from.name === 'ReimbursePlan' || from.name === 'ReimburseReceive' || from.name === 'ReimburseInvoice' || from.name === 'dataStatisticsDetails'){
            vm.isContract=false;
            vm.indexControl=1;
          }
        });
      },
      beforeDestroy () {
        window.dataBase.wxqyh_uploadfile.agent = 'crm';
      },
      methods:{
        //转换html
        checkURL(obj){
          return _.checkURL(obj, false,false);
        },
        ...mapActions([
          "getApprove",   // 自由流程获取转审人员
          "updateFlowUserSelected",     // 更新已选处理人
          "getNodeListInfo" ,//获取节点选择信息
        ]),
        ...mapMutations([
          "updateUserSelectConfirm",
          'updateCCPerson',//更新相关人
          'updateTOPerson',//更新负责人
          'updateUserSelectedState',
        ]),
        ...mapActions('list',[ //审批完进入合同列表时清除列表缓存
          'delCacheArray'
        ]),
        //获取合同详情
        getDetails:function(){
          let id=this.$router.history.current.query.id;
          getContractDetails(id,(result) => {
            this.basicList = result.basicList;
            if( result.itemList.length !=0){
              this.itemList = result.itemList;
              this.hasItemList = true;
            }else{
              this.hasItemList = false;
            }
            this.detailsData = result.detail;
            this.isUEditor = this.detailsData.isUEditor
            if (this.lock == false) {
              this.getReceive();
            }


            //固定字段赋值
            let signatoryPerson = "";
            this.center[0].value = this.detailsData.clientName == "" ? "无" : this.detailsData.clientName;
            this.center[1].value = this.detailsData.businessName == "" ? "无" : this.detailsData.businessName;
            this.center[2].value = this.detailsData.statusName!=""?this.detailsData.statusName:"请选择";
            this.middle[0].value = this.detailsData.startTime;
            this.middle[1].value = this.detailsData.endTime;
            this.middle[2].value = this.detailsData.typeName;
            this.middle[3].value = this.detailsData.contractCode;
            this.middle[4].value = this.detailsData.payWay;
            this.middle[5].value = this.detailsData.deelDate;
            for (let i = 0; i < this.detailsData.signatoryList.length; i++) {
              signatoryPerson += this.detailsData.signatoryList.length > 1 ? this.detailsData.signatoryList[i].personName + ','
                : this.detailsData.signatoryList[i].personName;
            }
            this.middle[6].value = signatoryPerson;
            this.middle[7].value = this.detailsData.signatory;
            this.middle[8].value = this.detailsData.content;
            this.middle[9].value = this.detailsData.remark;

            this.currentStatus = this.detailsData.statusName;


            //添加自定义字段
            if (this.itemList) {
              for (let i = 0; i < this.itemList.length; i++) {
                this.itemJson[i] = Object.assign({}, this.itemList[i], {
                  // type: 9,
                  divType: 9,
                  optionName: this.itemList[i].fieldName,
                  status: true,
                  value: this.itemList[i].optionVal,
                  ext1: this.itemList[i].numberType
                })
              }
            }

            //判断基础字段开启状态
            for (let i = 0; i < this.basicList.length; i++) {
              for (let j = 0; j < this.middle.length; j++) {
                if (this.basicList[i].optionName === this.middle[j].optionName) {
                  this.basicList[i].status == 1 ? this.middle[j].status = true : this.middle[j].status = false;
                }
              }
              for (let j = 0; j < this.center.length; j++) {
                if (this.basicList[i].optionName === this.center[j].optionName) {
                  this.basicList[i].status == 1 ? this.center[j].status = true : this.center[j].status = false;
                }
              }
            }
            this.middle[6].optionName = '我方签字';
            this.middle[7].optionName = '客户签字';

            //照片,附件,照片预览
            this.detailPic.picList = this.detailsData.contractPicList;
            this.detailPic.mediaList = this.detailsData.mediaList;
            this.previewImageUrl = this.detailsData.contractPicList;
            this.detailsData.contractPicList.length==0 && this.detailPic.mediaList.length==0? this.hasPic = false : this.hasPic = true;


            //更新负责人
            this.updateTOPerson(this.detailsData.toPersonList)

            //  合同审批流程
            let isFree = String(this.detailsData.isFree);
            //更新流程类型
            this.updateUserSelectedState({type: "isFree", data: isFree});
            this.updateUserSelectedState({type: "refId", data: this.contractId});
            this.flowApproveDetail = Object.assign({}, this.flowApproveDetail, {
              isover: this.detailsData.isover,
              status: this.detailsData.auditStatus,
              creator: this.detailsData.creator,
              isFree: this.detailsData.isFree,
              approve: this.detailsData.submitStatus,
            })
            //判断是否是并行，是就查询并行接口获取节点列表（合同暂无并行流程）
            if (this.detailsData && this.detailsData.currentNodeId.indexOf(',') != -1) {
              console.log("并行流程")
              // this.$store.commit('updateListName', result)
              // this.getDetailNodeList(result);
            } else {
              //非并行流程
              this.updateUserSelectedState({
                type: "currentNodeId",
                data: this.detailsData ? this.detailsData.currentNodeId : ''
              })
              this.showDetailPage(result);
            }

            //标题审批状态标签,编辑和自由流程转审按钮的显示隐藏
            for(var i=0;i<this.detailsData.toPersonList.length;i++){
              if(_.userId == this.detailsData.toPersonList[i].userId){// 检查当前用户是否负责人
                this.isCharge = true;
              }
            }
            let chargeOrCreator= _.userId == this.detailsData.creator || this.isCharge; //当前用户是负责人或创建人
            this.isPermit=result.isPermit;
            if (this.detailsData.isFree != 4) {
              if (this.detailsData.isover == '-1' && _.userId != this.detailsData.creator) {//已结束
                this.statusString = "已结束";
                if(this.isCharge){
                  this.showDelBtn=true;
                }
              } else if ( this.detailsData.isover == '-1' && _.userId == this.detailsData.creator) {//已关闭
                this.statusString = "已关闭";
                if(this.detailsData.isFree !== 1 && this.isPermit === 1 && this.isCharge){ //如果是非自由流程
                  this.showDelBtn=true;
                }
                if(this.detailsData.isFree === 1 && this.isCharge){ //如果是自由流程
                  this.showDelBtn=true;
                }
              }else if(this.detailsData.isover == '0') {//退审
                this.statusString = "退审";
                if(chargeOrCreator){
                  this.showDelBtn=true;
                }
              } else if (this.detailsData.isover == '1') {//已审批
                this.statusString = "已审批";
                if(this.detailsData.isFree !== 1 && this.isPermit === 1 && this.isCharge){ //如果是非自由流程
                  this.showDelBtn=true;
                }
                if(this.detailsData.isFree === 1 && chargeOrCreator){ //如果是自由流程
                  this.showDelBtn=true;
                }
              }else {//审批中
                  this.statusString = "审批中";
                  for(let i=0;i<this.detailsData.auditList.length;i++){//显示编辑按钮
                    if(this.detailsData.isFree == '1'){ //如果是自由流程
                      if(_.userId == this.detailsData.auditList[i].userId && this.detailsData.auditList[i].isAudit == 1){//未审批时
                        this.showEditBtn=true;
                        this.bottomButton.agreeReApprove.show=false;
                        this.bottomButton.moreApprove.show=true;
                        this.isAuditUser=1;
                      }
                      if(_.userId == this.detailsData.auditList[i].userId && this.detailsData.auditList[i].isAudit == 2){//已审批过
                        this.bottomButton.moreApprove.show=false;
                      }
                    }else{ //如果是非自由流程
                      if(_.userId == this.detailsData.auditList[i].userId && this.detailsData.auditList[i].isAudit == 1){
                        this.showEditBtn=true;
                        this.isAuditUser=1;
                      }
                    }
                  }
                }
            }else{//无需审批
              this.isShowSerial=false;
              if(chargeOrCreator){
                this.showEditBtn=true;
                this.showDelBtn=true;
                this.moreButton.flowSerial.show=0;
              }else{
                this.bottomButton.moreApprove.show=false;
              }
            }
            if (this.statusString) {//审批状态标签
              let status = _.append_status(this.statusString, true);
              this.status = status;
            }

          })
        },

        // 查询并行的节点选择接口,(合同暂无并行流程)
        // getDetailNodeList (data) {
        //   let self = this
        //   this.getNodeListInfo({'refId': self.contractId,'callback': function (result){
        //       if (result.length>0){
        //         self.updateUserSelectedState({type: "currentNodeId", data: result[0].nodeId})
        //       } else {
        //         self.updateUserSelectedState({type: "currentNodeId", data: data.detail? data.detail.currentNodeId :''})
        //       }
        //       self.showDetailPage(data)
        //     }})
        // },

        // 处理人标题
        startAuditTitle(item) {
          if(this.FlowAuditList.length==1) {
            return  '当前处理人'
          }
          return item.vo ? item.vo.nodeName+' 处理人' : item.nodeName+' 处理人'
        },
        //预览个人信息
        showPersonList(title,list,type){
          this.userselectTitle = title;
          this.userSelectList = list;
          this.showPerson = true;
          if(type){
            this.limitPreview = true
          }else{
            this.limitPreview = false
          }
        },
        selectNodeClick (item,data){
          //更新当前节点
          this.updateUserSelectedState({type: "currentNodeId", data: item.nodeId})
          this.showDetailPage(data)
        },

        showDetailPage(data){
          //更新头部组件的数据
          this.$store.commit('updateTitleData',data)
          //更新详情内容的数据
          this.$store.commit('updateDetailData',data.detail)
          //更新审批状态

          if (this.isFree != "1" && this.isFree != "4") { //固定流程或分支流程
            this.getFlowAuditNodeData()
          }
          if(this.isFree == "1"){ //自由流程
            this.getApprove(this.refId);   // 自由流程获取转审人员
            this.moreButton.flowSerial.show=true; //显示“更多”里面的流转明细按钮
          }
          //更新明细数据
          this.flowSerial.isover = data.detail.isover;
          this.flowSerial.isFreeFlow = this.isFree;
          //更新自由审批人
          if(this.isMoveapproveStatus || this.isFree =='1'){
            this.freeAuditList.length = 0
            this.freeAuditList.push(...data.detail.auditList)
          }
          //更新相关人
          this.newCCPersonList=this.ccPersonList.length == 0 ? data.detail.ccPersonList : this.ccPersonList;
          this.updateCCPerson(this.newCCPersonList)
        },

        getFlowAuditNodeData (){
          let self = this
          // 已关闭、已审批、被退审,不需要请求
          if(this.isMoveapproveStatus) {
            return
          }
          let Param = {
            refId: this.contractId,
            definitionId: 'contract' + this.detail.orgId, //合同管理模块
            isBranch: this.detail.isFree== '3'? true:false,
            nodeId: this.currentNodeId,
            status: this.detail.auditStatus
          };
          getDetailFlowAuditFun(Param ,(result) => {
            self.$store.commit('updateSearchFlowListData', result);
            self.$store.commit('updateFlowAuditList', result.nodeInfo);
          })
        },

        //点击查看流程明细
        getFlowSerial: function () {
          let Param = {
            refId: this.contractId,
            isFree: this.isFree == '0'?2:this.isFree //固定流程转为2
          }
          getParallelFlowSerialFun(Param, (result) => {
            if(result.auditSerial.length){
              this.flowSerial.list = result.auditSerial;
              this.flowSerial.currentTime = result.currentTime;
              this.flowSerial.isShowFlowSerial = true;
              this.flowSerial.isFirstRequest = false;
            }
          })
        },

        actionButtonClick:function(payload) {
          //折叠按钮，流转明细
          if(payload === "getFlowSerial"){
            this.getFlowSerial();
          }
          // 底部按钮，编辑
          if(payload==='editApprove') {
            if(Number(this.isUEditor) && !this.isPC){
              _.alert('提示','内容由富文本编辑器生成，请在PC端修改')
              return
            }
            this.$router.push({
              path:"/contractOperate",
              query:{
                contractId:this.contractId,
                isAuditUser:this.isAuditUser,
                agentCode:this.$route.query.agentCode || 'crm',
                isFromWaitDealList:this.isFromWaitDealList
              }});
          }
        },
        // 点击各个审批按钮
        approveAction(payload) {
          this.approveActionStatus = payload;
          // 如果是“审批”
          if(payload==='approve') {
            if (this.isFree == 3 && this.isBranchNode) {
              this.requestNextBranchNode()
            }
          }
          this.updateUserSelectedState({type: "flowApproveDialogShow", data: true});
        },
        requestNextBranchNode(){
          let params = {
            initRefId: this.contractId? this.contractId:'',
            ['searchValue.field_contractType']: this.detailsData.typeName ,
            ['searchValue.field_contractAmount']: this.detailsData.contractAmount ,
            currentNodeId: (this.isBranchNode && this.defaultNextNodeId)? this.defaultNextNodeId:this.currentNodeId,
          }
          //最后接口数据回调
          findBranchFlowNextNodeInfoFun(params,(result) => {
            this.$store.commit('updateFlowAuditUserData', result);
            this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
            //更新下拉选择节点名称
            this.$store.commit('updateChooseNodeName')
          })
        },

        //选择处理人后点击确定回调
        FlowAuditUserResult(payload){
          this.$store.commit('checkFlowAuditUserType',payload)
          // 如果是多部门，则请求部门负责人
          this.updateFlowUserSelected(payload)
        },

        // 查看个人头像信息
        atThisPersonUtil(user){
          if(user){
            EventBus.$emit("atThisPersonUtil",user);
          }
        },

        //评论列表
        showComment:function(){
          let obj={
            'id':this.contractId,
            'page':this.currentPage,
          }
          commentListMore(obj, (result) => {
            this.loading=false;
            for(let i=0;i<result.pageData.length;i++){
              let list=Object.assign({},result.pageData[i],{time:result.pageData[i].createTime});//给评论加上time字段，兼容评论组件
              this.commentList.push(list);
            }
            this.listTotalRows=result.totalRows;
            this.hasMore=result.currPage >= result.maxPage? false : true;
            this.maxPage= result.maxPage;
          })

        },

        // 滚动更多列表
        scrollList(){
          var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
          if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
            if(!this.loading && this.hasMore){
              this.loading=true;
              this.currentPage++;
              this.showComment();
            }
          }
        },
        // 处理详情的全部图片src
        commentListImagesURL(urls){
          this.previewImageUrl=[];
          this.previewImageUrl=[...this.previewImageUrl];
          this.previewImageUrl.push(...urls);
        },
        //插入评论
        updateContent(data){
          let param={
            "content":data.content ,
            "userId":_.userId,
            "contractId": this.contractId,
            "id": this.contractId,
            "flowDpId":"",
            "signImg":"",
            "contractType":this.detailsData.typeName ,
            "contractAmount":this.detailsData.contractAmount ,
            "nextNodeId":"",
            "currentNodeId":"",
          }
          data.userIds? param.userIds=data.userIds:"";
          addCommentList(param,(result) => {
            if(result.commentId){
              this.commentList.splice(0,0,{
                commentId:result.commentId,
                headPic:_.headPic,
                personName:_.personName,
                creator:_.userId,
                type:data.type,
                content:data.content,
                time:"刚刚",
                commentStatus:data.status,
              });
              this.listTotalRows++;
            }
            if(data.status=="6"){
              window.location.reload();
            }
          })
        },
        // 删除评论
        deleteThisComment(data,index){
          if(data){
            this.deleteListIndex=index;
            deleteCommentList(data.commentId,() => {  // 删除成功
              this.commentList.splice(this.deleteListIndex,1);
              this.listTotalRows--;
            });
          }
        },

        //插入相关人
        backUserSelect: function (obj) { //@人后把人添加为相关人,当@的人是审批人的话，不加到相关人
          let toPerson = this.flowSerial.isFreeFlow == '1'? this.freeAuditList:this.detail.auditList;
          let toPersonIdStr = '';
          toPerson.forEach(function(item){
            toPersonIdStr+=item.userId
          });
          for(let i=obj.data.length-1;i>=0;i--){
            if(toPersonIdStr.indexOf(obj.data[i].userId)>-1){
              obj.data.splice(i,1);
            }else{
              if(this.detailsData.ccPersonList.length>0){
                this.detailsData.ccPersonList.forEach(function (item) {
                  if(item.userId == obj.data[i].userId){ //如果重复@了同一个人，则不重复添加到相关人
                    obj.data.splice(i,1);
                  }
                })
              }
            }
          }
          obj.data.forEach((item) => { //把@的人插入到原来相关人数组中
            this.detailsData.ccPersonList.push(item);
          })
          this.$store.commit('updateCCPerson',this.detailsData.ccPersonList);
        },

        //关闭评论弹窗，返回输入值
        // closeChatMask(val){
        //   console.log(val)
        // },

        //显示评论弹窗
        showChatToolFun(){
          this.showChatTool = true
          this.autofocus = true
        },

        // 保存提交数据
        commitTask(data) {
          console.log(data);
          if(data.addCounterSignPersonStr){//分支流程,固定流程 加签
            let addSignParam={
              "contractId":data.id,
              "currentNodeId":data.currentNodeId,
              "isFree":data.isFree,
              "reason":data.reason,
              "addCounterSignPersonStr":data.addCounterSignPersonStr,
              "type":data.type,
            }
            addSign(addSignParam, () => {
              if(this.isFromContractList!=undefined && this.isFromContractList == 1){//从合同列表进入详情
                this.$router.push({path:"/contractList/isread",query: {isAudit: 'ok',agentCode:this.$route.query.agentCode || 'crm'}});
              }else if(this.isFromWaitDealList!=undefined && this.isFromWaitDealList==1){//从待办审批列表进入详情
                this.delCacheArray('crmIndex'); //清除待办审批列表缓存
                this.$router.push({path:"/index/waitDeal",query:{fromTab:1}});
              }else{//从消息提醒进入详情
                this.delCacheArray('ContractList'); //清除客户列表缓存
                this.$router.push({path:"/contractList/isread",query: {contractOwner: '3',agentCode:this.$route.query.agentCode || 'crm'}});
              }
            })
          }else{//审批，退审，转审，结束
            let param={
              "flowChioseNodeAuditUserJson":data.flowChioseNodeAuditUserJson,
              "nextNodeId":data.nextNodeId,
              "flowDpId":data.flowDpId,
              "contractId":this.contractId,
              "status":data.status,
              "reason":data.reason,
              "parallelNextNodeIds":this.parallelNextNodeIds,
              "signImg":data.signImg,
              "currentNodeId":this.currentNodeId,
              "chooseFlowUser":data.chooseFlowUser,
            }

            updateAuditStatus(param, () => {
              _.tooltips_succeed('操作成功');
              if(this.isFromContractList!=undefined && this.isFromContractList == 1){//从合同列表进入详情
                this.$router.push({path:"/contractList/isread",query: {isAudit: 'ok',agentCode:this.$route.query.agentCode || 'crm'}});
              }else if(this.isFromWaitDealList!=undefined && this.isFromWaitDealList==1){//从待办审批列表进入详情
                this.delCacheArray('crmIndex'); //清除待办审批列表缓存
                this.$router.push({path:"/index/waitDeal",query:{fromTab:1}});
              }else{//从消息提醒进入详情
                this.delCacheArray('ContractList'); //清除客户列表缓存
                this.$router.push({path:"/contractList/isread",query: {contractOwner: '3',agentCode:this.$route.query.agentCode || 'crm'}});
              }
            })
          }
        },


        //折叠按钮，编辑
        editContract:function(){
          if(Number(this.isUEditor) && !this.isPC){
            _.alert('提示','内容由富文本编辑器生成，请在PC端修改')
            return
          }
          this.$router.replace({
            path:"/contractOperate",
            query:{
              contractId:this.contractId,
              isAuditUser:this.isAuditUser,
              agentCode:this.$route.query.agentCode || 'crm',
              isFromWaitDealList:this.isFromWaitDealList
            }});
        },
        //折叠按钮，删除
        delContract:function(){
          this.btnConfig.primaryBtn.callBack=this.removeContract;
          _.alert('提示','删除合同数据将无法恢复，请确定是否要删除？',this.btnConfig);
        },
        removeContract:function(){
          removeContract(this.contractId,() => {
            this.delCacheArray('ContractList'); //清除合同列表缓存
            this.$router.push({path:"/contractList/isread"});
          })
        },


        //合同执行状态列表
        getStatus:function(){
          getContractStatusList((result) => {
            this.statusList=result.list;
            this.statusList.unshift({ name: "请选择"});
            for(let i=0;i<this.statusList.length;i++){
              if(this.statusName!="请选择" && this.statusList[i].name==this.currentStatus){
                this.stautsIndex=i;
              }else if(this.statusName=="请选择"){
                this.stautsIndex=0;
              }
            }
          })
        },
        //渲染合同执行状态列表
        updateStatus:function(){
          let obj={
            "id":this.$router.history.current.query.id,
            "contractStatus":this.statusCode,
          }
          updateContractStatus(obj)
        },
        //选择合同执行状态
        selectStatus:function(item,index){
          this.stautsIndex=index;
          this.statusCode= item.statusCode!=null?item.statusCode:"";
          this.statusName=item.name;
        },
        //确认合同执行状态
        comfirmStatus:function(){
          this.lock=true;
          if(this.statusName!='请选择'){
            this.updateStatus();
           // this.getDetails();
            this.center[2].value=this.statusName;
          }else{
            this.center[2].value=this.statusName;
          }
          this.showStatusList=false;
          _.alert('提示','修改合同状态成功');
        },
        //取消合同执行状态列表
        cancelList:function(){
          this.showStatusList=false;
        },

        //回款明细
        getReceive:function(){
          let id=this.detailsData.id;
          returnMoney(id,(result) => {
            this.contractOutline=result.contractOutlineVO;
            this.stepList=result.stepList;
            this.editable=result.editable;
            this.temp(this.stepList);
          })
        },
        //期次列表渲染模板
        temp:function(stepList){
          for(let i=0;i<stepList.length;i++){
            this.step=stepList.length>0?stepList[stepList.length-1].step:1;
            let obj={
              step:stepList[i].step,//数组长度
              contractId:this.detailsData.id,//合同id
              id:stepList[i].id,
              editable:this.editable,
              title:'第'+stepList[i].step+'期回款',
              returnMoney:[
                {name:'计划',value:stepList[i].receivePlanMoney},
                {name:'实际',value:stepList[i].receiveMoney},
                {name:'开票',value:stepList[i].invoiceMoney},
              ],
              delBtn:'删除',
              content:{
                plan:{
                  label:'计划',
                  add:'+',
                  list:[]
                },
                receive:{
                  label:'实际',
                  add:'+',
                  list:[]
                },
                invoice:{
                  label:'开票',
                  add:'+',
                  list:[]
                }
              }
            }
            for(let j=0;j<stepList[i].receiveList.length;j++){
              let listObj={
                id:stepList[i].receiveList[j].id,
                value:stepList[i].receiveList[j].money,
                date:stepList[i].receiveList[j].receiveDate,
                stepType:stepList[i].receiveList[j].stepType,
              }
              if(listObj.stepType==0){
                obj.content.plan.list.push(listObj);
              }
              else if(listObj.stepType==1){
                obj.content.receive.list.push(listObj);
              }
              else if(listObj.stepType==2){
                obj.content.invoice.list.push(listObj);
              }
            }
            this.returnMoneyArr.push(obj);
          }
        },

        //格式化金额，每三位逗号分隔
        moneyFilter:function(num){
          return  _.toThousands(Number(num));
        },
        //金额保留两位小数
        formatMoney:function(num){
          return  _.formatMoney(num,2);
        },

        go:function(item){
          if(item.event == 'goClient' && this.detailsData.clientName!=""){
            this.goClient();
          }
          if(item.event == 'goBusiness' && this.detailsData.businessName!=""){
            this.goBusiness();
          }
          if(item.event == 'goStatus'){
            this.goStatus();
          }
        },

      //  所属客户
        goClient:function(){
          let id=this.detailsData.clientId;
          this.$router.push({path:'ClientDetails/ClientContent',query:{id:id}});
        },
      //  所属商机
        goBusiness:function(){
          sessionStorage.clear('id');
          this.$router.push({path:'ClientDetails/BusinessContent',query:{id:this.detailsData.businessId,size:10,isPartner:""}});
        },
      //  合同状态
        goStatus:function(){
          this.getStatus();
          this.showStatusList=true;
        },
        //点击选项卡
        listenNavTabsBack:function(){
          this.isContract=!this.isContract;
        },


        //滚动页面，导航吸顶
        getScrollTop:function ()
        {
          var scrollTop=0;
          if(document.documentElement&&document.documentElement.scrollTop){
            scrollTop=document.documentElement.scrollTop;
          }
          else if(document.body){
            scrollTop=document.body.scrollTop;
          }
          scrollTop>340?this.position="fixedTop":this.position="";
        },

      //  添加期次
        add:function(){
          let index=this.returnMoneyArr.length;
          if(this.returnMoneyArr.length>0){
            this.step++;
          }else{
            this.step=1;
          }
          if(index>0 && this.returnMoneyArr[index-1].id == ""){
            _.alert("温馨提示", "前一个回款期次为空时，不允许增加新的期次", "确定");
          }else{
            this.returnMoneyData.title='第'+ this.step+'期回款';
            this.returnMoneyData.contractId=this.detailsData.id;
            this.returnMoneyData.step= this.step;
            this.returnMoneyData.editable=true;
            this.returnMoneyArr.push(this.returnMoneyData);
          }
        },

      //  删除期次
        delStep:function(index){
          if(index>=0 && this.returnMoneyArr[index].id == ""){
            this.btnConfig.primaryBtn.callBack=this.doDelArr;
            _.alert('提示','删除回款明细将无法恢复，请确定是否要删除？',this.btnConfig);
          }else{
            this.btnConfig.primaryBtn.callBack=this.doDel;
            _.alert('提示','删除回款明细将无法恢复，请确定是否要删除？',this.btnConfig);
          }
          this.itemIndex=index;
        },
        doDel:function(){//删除数据不为空的期次
          let id=this.detailsData.id;//合同id
          let stepId=this.stepList[this.itemIndex].id;//被删除期次的id
          delStep(stepId,() =>{
            this.returnMoneyArr=[];//数组置空
            returnMoney(id,(result) => {//重新获取数据并渲染期次列表
              this.contractOutline=result.contractOutlineVO;
              this.stepList=result.stepList;
              this.temp(this.stepList);
            })
          });
        },
        doDelArr:function(){//删除新添加但数据为空的期次
          this.returnMoneyArr.splice(this.itemIndex,1);
          if(this.returnMoneyArr.length>0){
            this.step--;
          }else{
            this.step=0;
          }
        },

        // 点击图片放大预览
        onPreviewImage(src, list) {
          EventBus.$emit("previewImages",src, list);
        }
      },


    }
</script>

<style>
  @import './ContractContent.scss';
</style>
