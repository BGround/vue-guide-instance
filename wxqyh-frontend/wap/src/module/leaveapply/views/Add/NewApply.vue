<template>
  <div class="out-wrapper" :class="[isShowSelect?'':'mt15',revoking?'mt15':'']">
    <div class="leave-type-wrapper" v-if="isShowSelect&&!revoking">
      <div class="apply-title">申请</div>
      <div class="leave-type-list">
        <span class="leave-type-item" v-show="typeNumArr[0][1]" :class="[leaveType==0?'selected':'']" @click="selectApplyType(0)">请假</span>
        <span class="leave-type-item" v-show="typeNumArr[1][1]" :class="[leaveType==1?'selected':'']" @click="selectApplyType(1)">出差</span>
        <span class="leave-type-item" v-show="typeNumArr[2][1]" :class="[leaveType==2?'selected':'']" @click="selectApplyType(2)">加班</span>
      </div>
    </div>
    <div class="leave-apply-overWork" v-if="leaveType=='2'">
      <over-work :dataDetailMsg="add_nav" @setApplyTime="getOverTime" @change="showMsgFromDataDetail" 
      @overWorkContent="setData" @setDate="setData" :typeErrorTip="typeErrorTip" :titleErrorTip="titleErrorTip" 
      :contentErrorTip="contentErrorTip" :resourceDate="resourceDate">
      </over-work>
       <img-detail :dataDetailMsg="dataBase.draft.imgUpload" @listenToChild="showMsgFromImgDetail">
      </img-detail>
    </div>
    <div class="leave-apply-new-wrap" v-if="leaveType!='2'">
      <!--类型 标题 内容-->
      <div class="title-wrapper">
        <data-detail :dataDetailMsg="add_nav" :selectTypeTitle='selectTypeTitle' :autoCaching="autoCaching" :agent="agentCode" 
        :typeErrorTip="typeErrorTip" :titleErrorTip="titleErrorTip" :contentErrorTip="contentErrorTip" :isRequired='true' @listenToChild="showMsgFromDataDetail">
        </data-detail>
      </div>
      <!-- 添加图片 -->
      <img-detail :dataDetailMsg="dataBase.draft.imgUpload" @listenToChild="showMsgFromImgDetail">
      </img-detail>
      <!-- 选择时间 申请时长 -->
      <Leave-days @getDate="setData" @askDays="setData" @applyHours="setData" @sumAskDays="setData" @sumAskHours="setData" :autoCaching="autoCaching"
      :revoking='revoking' :isBranchFlow='isBranchFlow' :askTemplateId='add_nav.templateTypeId' :templateTitle='templateTitle' @errTip='dealWrongMsg'>
      </Leave-days>
      <!-- 出差行程 -->
      <Trip :stayArea="date" :originTripInfo="originTripInfo" @getTripData="setData" v-if="leaveType=='1'">
      </Trip>
    </div>
      <!-- 可用流程 -->
      <flow-list v-if="isFree==0" :flowList="myFlowList" :flowId="myFlowId">
      </flow-list>
      <!--处理人-->
      <div v-if="FlowAuditUser.length">
        <user-selected-group v-if="item && item.startAuditList.show" v-for="(item,index) in FlowAuditUser" :mustChoose="true" :key="index" :title="startAuditTitle(item.nodeName)" :loadLast="loadLastConfig.toPersonList" @confirmPick="confirmPick">
          <user-selected-item slot="user_selected_item" @showPersonList="showPersonList" :title="startAuditTitle(item.nodeName)" :isEdit="item.startAuditList.isCanEdit?item.startAuditList.isCanEdit:false" :List="item.startAuditList.userSelected" @showUserSelectedBox="FlowAuditUserShowBox(index)" @removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})" :isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
          </user-selected-item>
        </user-selected-group>
      </div>
      <!-- 相关人 -->
    <user-selected-group title="相关人" :loadLast="loadLastConfig.ccPersonList" @confirmPick="confirmPick">
      <user-selected-item :isEdit="Boolean(Number(choiceRelative))" :userTotal="ccPersonList.length" @showPersonList="showPersonList" :List="ccPersonList" title="相关人" @showUserSelectedBox="ccPersonListShowBox" slot="user_selected_item" @removeSelected="removeCCPerson">
      </user-selected-item>
    </user-selected-group>
    <!--处理人范围选人-->
    <user-selected-ranglist :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList" :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type" :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType" :config="FlowAuditUser[appointUserIndex].startAuditList.selectType" :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect" :checked="FlowAuditUserIds(appointUserIndex)" @FlowAuditUserResult="FlowAuditUserResult" v-if="FlowAuditUserBoxShow">
    </user-selected-ranglist>
    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog v-if="flowApproveDialogShow" :agent='agentCode' @showPersonList="showPersonList" @saveNodeAuditUserJson="commitTask">
    </flow-approve-dialog>
    <!--公共选人组件-->
    <user-selected-box v-if="selectConfig.show" :selectconfig="selectConfig">
    </user-selected-box>
    <!--人员列表预览组件-->
    <user-show :show.sync="showPerson" :title="userselectTitle" :limitPreview="limitPreview" :userSelect="userSelectList">
    </user-show>
    <!-- 显示人员信息 -->
    <user-info></user-info>
    <!--底部操作按钮-->
    <button-group v-if="!flowApproveDialogShow&&!showPerson">
      <qwui-button type="default" text="保存为草稿" @buttonClick="checkDraft" v-if="!revoking">
      </qwui-button>
      <qwui-button type="primary" text="立即提交" @buttonClick="checkCommit">
      </qwui-button>
    </button-group>
  </div>
</template>

<script>
import dataDetail from "@/components/add/add_title";
import baseURL from '@/assets/js/baseURL_config.js';
import { getFlowAuditUserFun } from "@/components/flow/getAuditFlow";
import imgDetail from "@/components/add/add_img";
import LeaveDays from "../../components/leaveDays";
import Trip from "../../components/trip";
import overWork from "../../components/OverWork";
import flowList from "@/components/flow/flowList";
import userSelectedGroup from "@/components/base/userOrDeptSelect/user_selected_group";
import userSelectedItem from "@/components/base/userOrDeptSelect/user_selected";
import userSelectedRanglist from "@/components/base/userOrDeptSelect/user_selected_ranglist";
import userSelectedBox from "@/components/base/user_or_dept_select";
import FlowApproveDialog from "@/components/flow/flowApproveDialog";
import userShow from "@/components/detail/user_show";
import userInfo from "@/components/detail/user_info_card";
import { qwui_button, button_group } from "@/components/base/button";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import * as timeUtil from "@/assets/js/time-util";
import {
  searchFlowListFun,
  findBranchFlowNextNodeInfoFun,
  settingAuditTitle,
  stringUserIds,
  isCheckFlowUserConfirm
} from "@/components/flow/getAuditFlow";
import {
  getTemplateList,
  getFormHistory,
  getccPersonList,
  getOldccOrTolist,
  getConfig,
  getRevokeFlowList,
  getTemplateTypeCount
} from "../../api/getData";

export default {
  components: {
    dataDetail,
    overWork,
    imgDetail,
    LeaveDays,
    Trip,
    flowList,
    userSelectedGroup,
    userSelectedItem,
    userSelectedRanglist,
    userSelectedBox,
    FlowApproveDialog,
    userShow,
    userInfo,
    qwuiButton: qwui_button,
    buttonGroup: button_group
  },
  data() {
    return {
      dataBase: dataBase,
      agentCode: "ask",
      isGetting: false,
      myFlowId: "",
      myFlowList: [],
      revoking: false, //是否销假
      leaveType: 0, //请假类型(请假leave 出差trip 加班overWork)
      add_nav: {
        //头部数据
        nav: "类型",
        title: "",
        content: "",
        titlePlaceholder: "请输入请假标题",
        contentPlaceholder: "输入请假内容",
        templateTypeId: "",
        templateType: [],
        isDisabled: false // 头部类型是否固定(销假时固定)
      },
      ziyouToList: [],
      templateTitle: "",
      choiceRelative: 1, // 是否可选择相关人
      selectTypeTitle: "请选择类型", // 右侧select框提示文字
      typeErrorTip: "", // 未选择模板
      titleErrorTip: "", // 未写标题
      contentErrorTip: "", // 未写内容
      componentErr: {}, // 组件传出错误信息
      autoCaching: false, // 自动缓存
      deleteCaching: false,
      hasError: false,
      draft: {
        // 草稿数据
        askId: "", // 请假单id
        creator: "", // 创建人
        mediaIds: "", // 附件
        imageUrls: "", // 图片
        addOrUpdateUrl: "", // 提交或保存草稿的接口
        commitStatus: "" // 0代表保存草稿，1代表提交
      },
      commitDraft: {}, // 提交参数
      date: {
        startDate:
          timeUtil.changeFormat(new Date(), "yyyy-MM-dd") + " 16:00:00",
        endDate: timeUtil.changeFormat(new Date(), "yyyy-MM-dd") + " 18:00:00"
      }, // 默认date时间为今日16:00和18:00
      // 如1.55天
      askDay: "1", // 请假天数   '1'
      ext1: "0", // 请假小时数 '0.55'
      sumAskDays: "0", // 请假总天数 '1.55'
      sumAskHours: "0", // 请假总小时 '1.55*每日工作时长'
      originTripInfo: {
        "tbQyAskPO.beginLocation": "", //出发地
        "tbQyAskPO.beginLongitude": "", //出发地经度
        "tbQyAskPO.beginLatitude": "", //出发地纬度
        "tbQyAskPO.destinationLocation": "", //目的地
        "tbQyAskPO.destinationLongitude": "", //目的地经度
        "tbQyAskPO.destinationLatitude": "", //目的地纬度
        "tbQyAskPO.transportation": "0", //交通工具
        "tbQyAskPO.together": "", //同行人员
        "tbQyAskPO.stay": "0", //是否住宿
        "tbQyAskPO.checkInTime": "", //开始住宿时间
        "tbQyAskPO.checkOutTime": "", //结束住宿时间
        "tbQyAskPO.stayDays": '', //入住天数
        "tbQyAskPO.stayRooms": '' //住房数量
      }, // 原单出差数据
      tripInfo: {}, // 出差数据
      isTrip: 0, // 是否出差
      userselectTitle: "", // 显示user-show组件时的默认title
      userSelectList: [], // user-show人员列表
      showPerson: false, // 是否显示详细人员列表
      limitPreview: false,// 是否显示人员个人信息
      compensateType: '', //加班补偿方式
      targetTemplateId: '',  //加班关联调休id
      resourceDate: new Array(2),
      isShowSelect: false,   //是否展示选择类型框
      typeNumArr: new Array(2)  //[['leave',1],['travel',2]]
    };
  },
  created() {
    getTemplateTypeCount().then(res=>{
      // {leave:xx,travel:xx,overwork:xx}
      this.typeNumArr = Object.entries(res.data)  
      var zeroNum = 0, onlyType
      // item:['leave',1]
      this.typeNumArr.forEach((item,index)=>{
        zeroNum += item[1] === 0 ? 1 : 0
        if(item[1]!==0){
          onlyType = item[0]
        }
      })
      this.isShowSelect = zeroNum<=1
      if(!this.isShowSelect){
        switch(onlyType){
          case 'leave': 
            this.leaveType = 0
            break
          case 'travel': 
            this.leaveType = 1
            break
          case 'overtime': 
            this.leaveType = 2
            break  
        }
      }
    })
    // 重置数据
    this.$store.commit("resetFlowData");
    this.$store.commit("resetSelectConfig");
    this.leaveType = this.$route.query.leaveType? this.$route.query.leaveType:0
    // 有askId 编辑(type=edit)/销假(type=revoke)/复制(type=copy)
    if (this.$route.query.askId) {
      this.draft.askId = this.$route.query.askId;
      this.leaveType = this.$route.query.leaveType;
      // 重新编辑
      if (this.$route.query.type === "edit") {
        // 提交时调用更新接口
        this.draft.addOrUpdateUrl = "/portal/ask/ajaxUpdate.do";
      } else {
        // 销假与复制时都调用新增接口
        this.draft.addOrUpdateUrl = "/portal/ask/ajaxAdd.do";
      }
      // 销假
      if (
        this.$route.query.type === "revoke" ||
        this.$route.query.isRevoked == 1
      ) {
        this.revoking = true;
        this.add_nav.titlePlaceholder = "请输入销假标题(必填)";
        this.add_nav.contentPlaceholder = "请输入销假内容(必填)";
        // 销假时头部不可选择类型
        this.add_nav.isDisabled = true;
      }
    } else {
      // 若是新增
      // 用户ID即创建者
      this.draft.creator = this.dataBase.config.userId;
      // 点击提交 调用新增接口
      this.draft.addOrUpdateUrl = "/portal/ask/ajaxAdd.do";
      //开启自动缓存
      this.autoCaching = true;
      let addNavDataCache= `ask_add_${_.userId}`;
      let lastLeaveTypeCache =`ask_add_${_.userId}_leaveType`
      let addNavData = JSON.parse(localStorage.getItem(addNavDataCache));
      let lastLeaveType = JSON.parse(localStorage.getItem(lastLeaveTypeCache))
      if (addNavData&&lastLeaveType&&this.leaveType == lastLeaveType.leaveType) {
        this.add_nav = Object.assign(this.add_nav,addNavData);
        if (addNavData.templateTypeId && addNavData.templateType.length > 0) {
          for (let i = 0; i < addNavData.templateType.length; i++) {
            if (addNavData.templateTypeId == addNavData.templateType[i].id) {
              this.showMsgFromDataDetail(addNavData.templateType[i]);
              break;
            }
          }
        }
      }else{
        this.add_nav.content = addNavData?addNavData.content||'':'' ;
        localStorage.removeItem(`ask_add_${_.userId}`)
      }
    }
    // 新增申请-获取模板
    getTemplateList(Number(this.leaveType), res => {
      this.add_nav.templateType = res;
      // 只有一个模板时 自动选择
      if(res.length === 1){
        this.showMsgFromDataDetail(res[0])
      }
      // 加载历史数据  需要将this.add_nav.templateType赋值后再进行操作
      if (this.$route.query.askId) {
        this.loadDraftData();
      }
    });
    // 获取orgID，记录 templateRefId
    getConfig(orgID => {
      //更新templateRefId(加载下一节点时的参数)
      this.updateUserSelectedState({
        type: "templateRefId",
        data: this.agentCode + orgID
      });
    });
  },
  computed: {
    ...mapState({
      isFree: state => state.flowUserSelected.isFree, // 流程类型,默认是自由流程'1'（固定为0，分支为3，全部应用需要统一）
      templateRefId: state => state.flowUserSelected.templateRefId, // 模板审批单id
      isBranchFlow: state => state.flowUserSelected.isBranchFlow, // 接口返回的流程数据
      isBranchNode: state => state.flowUserSelected.isBranchNode, // 接口返回的流程数据
      flowId: state => state.flowUserSelected.flowId, // 已选的流程id
      currentNodeId: state => state.flowUserSelected.currentNodeId, // 当前节点id
      nextNodeId: state => state.flowUserSelected.nextNodeId, // 下一节点id
      defaultNextNodeId: state => state.flowUserSelected.defaultNextNodeId, // 下一节点id
      parallelNextNodeIds: state => state.flowUserSelected.parallelNextNodeIds, // 并行子节点id，逗号隔开
      FlowAuditUser: state => state.flowUserSelected.FlowAuditUser, // 处理人信息
      selectConfig: state => state.flowUserSelected.selectConfig, // 选人基础配置
      loadLastConfig: state => state.flowUserSelected.loadLastConfig, // 加载上一次默认配置
      ccPersonList: state => state.flowUserSelected.ccPersonList, // 相关人信息
      flowList: state => state.flowUserSelected.flowList, // 流程列表
      FlowAuditUserBoxShow: state =>
        state.flowUserSelected.FlowAuditUserBoxShow, // 流程勾选类型弹窗：指定人员、部门、部门负责人
      flowApproveDialogShow: state =>
        state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
      appointUserIndex: state => state.flowUserSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
      appointNodeAndUserVOList: state =>
        state.flowUserSelected.appointNodeAndUserVOList, // 当前节点指定处理人的节点信息
      commitTaskParams: state => state.flowUserSelected.commitTaskParams // 提交返回的流程字段
    }),
    ...mapGetters([
      "FlowAuditUserIds", // 已选择的处理人id
      "getIsCheckFlowUserConfirmParams", // 检验流程字段
      "findBranchFlowNextNodeInfoParams" // 查找下一节点信息的入参
    ])
  },
  // 记录上次返回时是哪一个类型
  beforeDestroy() {
    let name = `ask_add_${_.userId}_leaveType`
    localStorage.setItem(name,JSON.stringify({
      leaveType: this.leaveType
    }))
  },
  // 销毁时清空localstorage缓存
  destroyed() {
    if (this.deleteCaching) {
      // 头部缓存
      let name = this.agentCode + "_add_" + _.userId;
      // 申请时长请假时间缓存
      let leave_cache = "ask" + "_add_" + _.userId + "_leave_days";
      let last_leave_type = "ask_add_"+_.userId + "_leaveType"
      localStorage.removeItem(name);
      localStorage.removeItem(leave_cache);
      localStorage.removeItem(last_leave_type);
    }
  },
  watch: {
    flowList() {
      if (this.revoking && this.flowList.length > 1) {
        getRevokeFlowList(
          {
            id: this.$route.query.askId,
            askTypeId: this.add_nav.templateTypeId,
            isFree: this.isFree
          },
          res => {
            this.myFlowList = res;
            this.myFlowId = res[0].id
            let self = this;
            if (this.myFlowId == this.flowId || this.isGetting) return;
            this.isGetting = true;
            this.$store.commit("updateUserSelectedState", {
              type: "flowId",
              data: this.myFlowId
            });
            let param = {
              definitionId: "",
              id: "",
              flowId: this.myFlowId,
              currentNodeId: "",
              nextNodeId: "",
              parallelNextNodeIds: "",
              isBranchFlow: false
            };
            getFlowAuditUserFun(param, function(data) {
              self.isGetting = false;
              self.$store.commit("updateFlowAuditUserData", data);
            });
          }
        );
      } else {
        this.myFlowList = this.flowList;
        this.myFlowId = this.flowId;
      }
    },
  },
  methods: {
    ...mapMutations([
      "removeFlowAuditUser", // 删除处理人
      "saveChooseFlowUserJson", // 自由选择确定保存处理人信息
      "updateUserSelectedState", // 更新vuex状态数据
      "updateUserSelectConfirm" // 更新选人配置
    ]),
    ...mapActions([
      "updateFlowUserSelected", // 更新已选处理人
      "updateFlowCommitTaskParams", // 更新提交数据json
      "getNodeListInfo" // 获取节点选择信息
    ]),

    // 根据ID查找编辑页面 加载初始数据
    loadDraftData(str) {
      let isRevokeAdd = this.$route.query.type == "revoke" ? true : false;
      // isTravel字段在getFormHistory无法获取,需要先找对应模板,再通过模板中isTravel字段获取
      getFormHistory(this.draft.askId, data => {
        if(data.currentTemplateStatus==='1'&&!str){
          _.alert('提示','原请假类型已被禁用,请切换类型或联系管理员!')
        }
        if (data.vo) {
          if (data.vo.askType) {
            for (var i = 0; i < this.add_nav.templateType.length; i++) {
              if (this.add_nav.templateType[i].id === data.vo.askType) {
                this.isTrip = this.revoking
                  ? 0
                  : this.add_nav.templateType[i].isTravel;
                this.choiceRelative = this.revoking
                  ? 1
                  : this.add_nav.templateType[i].choiceRelative;
                break;
              }
            }
          }
          this.lastTemplateTypeId = data.vo.templateTypeId
          this.compensateType = data.vo.compensateType||''
          if(!str){
            this.add_nav.templateTypeId = data.currentTemplateStatus==='1'?'':data.vo.askType
          }
          this.targetTemplateId = data.vo.targetTemplateId||''
          this.add_nav.templateName = data.currentTemplateStatus==='1'?'':data.vo.typeName;
          this.draft.creator = data.vo.creator;
          this.add_nav.title = isRevokeAdd
            ? `销假单_${data.vo.title}`
            : data.vo.title;
          this.dataBase.draft.imgUpload.picList = this.revoking
            ? []
            : data.vo.picList;
          if(this.leaveType==2){
            this.add_nav.content = {
              text: data.vo.content
            }
            if(data.minUtil == 2){
              this.resourceDate = [data.vo.startTime.slice(0,10),data.vo.endTime.slice(0,10)]
            }
            else{
              this.resourceDate = [data.vo.startTime,data.vo.endTime]
            }
          }else{
             this.add_nav.content = isRevokeAdd ? "" : data.vo.content;
          }
          // 原单出差数据
          if (!this.revoking) {
            this.originTripInfo = {
              "tbQyAskPO.beginLocation": data.vo.beginLocation,
              "tbQyAskPO.beginLongitude": data.vo.beginLongitude,
              "tbQyAskPO.beginLatitude": data.vo.beginLatitude,
              "tbQyAskPO.destinationLocation": data.vo.destinationLocation,
              "tbQyAskPO.destinationLongitude": data.vo.destinationLongitude,
              "tbQyAskPO.destinationLatitude": data.vo.destinationLatitude,
              "tbQyAskPO.transportation": data.vo.transportation,
              "tbQyAskPO.together": data.vo.together,
              "tbQyAskPO.stay": data.vo.stay,
              "tbQyAskPO.checkInTime": data.vo.checkInTime.slice(0, 10),
              "tbQyAskPO.checkOutTime": data.vo.checkOutTime.slice(0, 10),
              "tbQyAskPO.stayDays": data.vo.stayDays,
              "tbQyAskPO.stayRooms": data.vo.stayRooms
            };
          }
          // 更新相关人 处理人
          this.$store.commit("updateCCPerson", data.vo.ccPersons);
          this.$store.commit("updateUserSelected", data.vo.toPersons);
          this.dealTemplateFlow(data.vo);
        }
      });
    },
    // val-切换模板时当前模板的数据
    showMsgFromDataDetail(val) {
      this.hasError = false
      this.isTrip = false;
      // 切换模板后将提交数据清空
      this.commitDraft = {};
      this.tripInfo = {};
      // 清空流程数据
      this.$store.commit("resetFlowData");
      if (val) {
        this.add_nav.templateName = val.name
        this.compensateType = val.compensateType || ''
        this.targetTemplateId = val.targetTemplateId || ''
        let time = _.getCurrentTime()
          .substring(0, 10)
          .replace(/-/g, "");
        this.add_nav.title = val.title + "_" + _.personName + "_" + time;
        this.add_nav.templateTypeId = val.id;
        this.isTrip = val.isTravel;
        // 重置加载上次按钮默认配置
        this.$store.commit("resetLoadLastConfig");
        // 是否可选相关人
        this.choiceRelative = val.choiceRelative;
        // 请求相关人
        getccPersonList(val.id, data => {
          this.$store.commit("updateCCPerson", data.ccList);
          this.ziyouToList = data.toList
          // 自由流程请求处理人
          if (data.toList && val.isFree === "1") {
            this.$store.commit("updateUserSelected", data.toList);
          }
        });
        this.dealTemplateFlow(val);
      }else{
        this.add_nav.templateTypeId = ''
      }
    },
    // 根据模板数据处理流程
    dealTemplateFlow(data) {
      this.templateTitle = data.name;
      // 先判断是固定，分支，否则就是自由，自由类型可能是null
      if (data.isFree == "0" || data.isFree == "3") {
        this.updateUserSelectedState({
          type: "isFree",
          data: data.isFree
        });
        this.loadLastConfig.toPersonList.show = false;
        this.getAuditFlowListFun(data);
      } else {
        this.updateUserSelectedState({ type: "isFree", data: "1" });
        this.loadLastConfig.toPersonList.show = true;
      }
      // 不可选相关人时不显示加载上次按钮
      this.loadLastConfig.ccPersonList.show =
        this.choiceRelative == "1" ? true : false;
    },
    // 图片自组件传来数据
    showMsgFromImgDetail(imgurl) {
      this.draft.imageUrls = "";
      this.draft.imageUrls = imgurl.join(",");
    },
    // 显示人员预览弹窗
    showPersonList(title, list, type) {
      this.userselectTitle = title;
      this.userSelectList = list;
      this.showPerson = true;
      this.limitPreview = type ? true : false;
    },
    // 添加相关人
    ccPersonListShowBox() {
      // 初始化选人数据
      this.updateUserSelectConfirm({
        data: this.ccPersonList,
        callBack: result => {
          this.$store.commit("updateCCPerson", result.user.data);
        }
      });
    },
    // 删除相关人
    removeCCPerson(payload) {
      this.$store.commit("removeCCPerson", payload);
    },
    // 加载上一次审批人/相关人点击回调
    confirmPick(type, isGet) {
      let updateType = type === "1" ? "updateCCPerson" : "updateUserSelected";
      if (!isGet) {
        this.$store.commit(updateType, []);
      } else {
        getOldccOrTolist(type, ccOrTolist => {
          this.$store.commit(updateType, ccOrTolist);
        });
      }
    },
    // 显示选择处理人弹窗
    FlowAuditUserShowBox(index) {
      this.updateUserSelectedState({
        type: "appointUserIndex",
        data: index
      });
      // 显示指定范围选人弹窗
      if (this.FlowAuditUser[index].startAuditList.assignRange) {
        this.updateUserSelectedState({
          type: "FlowAuditUserBoxShow",
          data: true
        });
      } else {
        // 显示自由选处理人时的选人组件界面
        this.updateUserSelectConfirm({
          data: this.FlowAuditUser[index].startAuditList.userSelected,
          callBack: result => {
            this.$store.commit("updateUserSelected", result.user.data);
          }
        });
      }
    },
    // 选择处理人后点击确定回调
    FlowAuditUserResult(payload) {
      this.$store.commit("checkFlowAuditUserType", payload);
      // 如果是多部门，则请求部门负责人
      this.updateFlowUserSelected(payload);
    },
    // 第一个接口审批列表数据
    getAuditFlowListFun(data) {
      let params = {
        id: data.askType ? data.askType : this.add_nav.templateTypeId,
        agentCode: this.agentCode,
        isBranchFlow: this.isFree == "3" ? true : false,
        isFree: this.isFree
      };
      searchFlowListFun(params, result => {
        if(this.isFree==0&&!result.flowList.length){
          this.$store.commit("updateUserSelected", this.ziyouToList);
          this.updateUserSelectedState({type: 'isFree', data: '1'})
          return
        }
        // 流程接口数据回调
        this.$store.commit("updateSearchFlowListData", result);
      });
    },
    // 提交按钮点击，存在流转条件查下一个节点
    saveNodeAuditUser() {
      // 检验各个字段是否填写
      this.isCheckMust();
      // 检验流程字段是否填写
      this.confirmFlowWritten();
    },
    confirmFlowWritten() {
       if (!this.hasError) {
        isCheckFlowUserConfirm(this.getIsCheckFlowUserConfirmParams, type => {
          // 处理人没选,显示选人弹窗
          if (type === "flowApproveDialogShow") {
            this.updateUserSelectedState({
              type: "flowApproveDialogShow",
              data: true
            });
          } else if (type === "findBranchFlowNextNode") {
            // 查找下一节点信息
            findBranchFlowNextNodeInfoFun(
              this.addNextNodeSearchValue(),
              result => {
                this.$store.commit("updateFlowAuditUserData", result);
                this.updateUserSelectedState({
                  type: "flowApproveDialogShow",
                  data: true
                });
                // 更新下拉选择节点名称
                this.$store.commit("updateChooseNodeName");
              }
            );
          } else {
            // 验证成功
            this.commitTask();
          }
        });
      }
    },
    // 分支流程获取下一个节点参数
    addNextNodeSearchValue() {
      let nextNodeParams = Object.assign({},this.findBranchFlowNextNodeInfoParams)
      if(!this.$route.query.askId){
        nextNodeParams.initRefId = ""
      }else{
        nextNodeParams.initRefId = this.$route.query.askId
        if(this.$route.query.type==='edit'&&this.lastTemplateTypeId!=this.add_nav.templateTypeId){
          nextNodeParams.initRefId = ""
        }
      }
      return Object.assign({}, nextNodeParams, {
        "searchValue.field_askTemplate": this.add_nav.templateName,
        "searchValue.field_askDays": this.sumAskDays
      });
    },
    // 从子组件获取值赋给父组件的data中
    // secondval: 改变某一个对象的某属性名  
    setData(key, value, secondkey) {
      if(secondkey){
        this[key][secondkey] = value
      }else{
        this[key] = value;
      }
    },
    // 根据选择申请类型切换模板
    selectApplyType(type){
      if(type!==this.leaveType){
        this.leaveType = type
        this.add_nav.templateTypeId = ''
        // 新增申请-获取模板
        getTemplateList(Number(this.leaveType), res => {
          this.add_nav.templateType = res;
          if(res.length === 1){
            this.showMsgFromDataDetail(res[0])
          }
          // 加载历史数据  需要将this.add_nav.templateType赋值后再进行操作
          if (this.$route.query.askId) {
            this.loadDraftData('changetype');
          }
        });
      }
    },
    // 加班时间相关数据
    getOverTime(obj) {
      if(this.leaveType==2){
        this.askDay = isNaN(obj.askDay)?0:obj.askDay
        this.ext1 = isNaN(obj.ext1)?0:obj.ext1
        this.sumAskDays = isNaN(obj.sumAskDays)?0:obj.sumAskDays
        this.sumAskHours = isNaN(obj.sumAskHours)?0:obj.sumAskHours
      }
    },
    // 处理组件中错误信息
    dealWrongMsg(type, obj) {
      this.componentErr[type] = obj;
    },
    // 分割userId
    stringUserIds(array) {
      let ids = array.map(value => {
        return value.userId;
      });
      return ids.join(",");
    },
    // 相关人组件title
    startAuditTitle: function(nodeName) {
      return settingAuditTitle(nodeName, this.isFree);
    },
    checkCommit() {
      // 提交
      this.draft.commitStatus = 1;
      this.saveNodeAuditUser();
    },
    checkDraft() {
      // 保存为草稿
      this.draft.commitStatus = 0;
       if (this.add_nav.templateTypeId == "") {
        _.alert('提示',"请选择模板后保存草稿") 
      }else if(this.date.startDate.length==0||this.date.endDate.length==0){
        _.alert('提示',"请选择加班起始时间后保存草稿") 
      }
      else{
        this.commitTask();
      }
    },
    isCheckMust() {
      // 验证必填
      this.typeErrorTip = "";
      this.titleErrorTip = "";
      this.contentErrorTip = "";
      this.hasError = false;
      if (this.add_nav.content == "") {
        this.contentErrorTip = "申请内容不能为空";
        this.hasError = true;
      }
      if (this.add_nav.title == "") {
        this.titleErrorTip = "申请标题不能为空";
        this.hasError = true;
      }
      if (this.add_nav.templateTypeId == "") {
        this.typeErrorTip = "申请类型不能为空";
        this.hasError = true;
      }
      if (this.sumAskDays == 0) {
        _.alert("提示", "申请时长不能为0");
        this.hasError = true;
      }
      if (this.sumAskDays < 0) {
        _.alert("提示", "申请时长不能为负数");
        this.hasError = true;
      }
      // 验证错误提示
      if (!this.hasError) {
        Object.values(this.componentErr).some(item => {
          if (!item.canCommit && item.isNeed && !item.needConfirm) {
            this.hasError = true;
            _.alert("提示", item.errMsg);
            return true;
          }
        });
      }
      // 要住宿，则校验住宿时间
      if (this.tripInfo["tbQyAskPO.stay"] == 1) {
        let start = new Date(this.tripInfo["tbQyAskPO.checkInTime"]).getTime();
        let end = new Date(this.tripInfo["tbQyAskPO.checkOutTime"]).getTime();
        if (start > end) {
          this.hasError = true;
          _.alert("提示", "住宿时间为空或住宿开始时间大于住宿结束时间！");
        }
      }
      // 验证是否小于实际时间15天
      if (!this.hasError&&this.leaveType!=2) {
        if (
          this.componentErr.lessInput &&
          !this.componentErr.lessInput.canCommit
        ) {
          this.hasError = true;
          _.alert("提示", this.componentErr.lessInput.errMsg, {
            primaryBtn: {
              name: "i18n.confirm",
              callBack: ()=> {
                this.hasError = false,
                this.confirmFlowWritten()
              }
            },
            defaultBtn: { name: "取消", callBack: null }
          });
        }
      }
     
      if (this.hasError) {
        // Firefox / chrome
        if ("scrollTop" in document.body) {
          document.body.scrollTop = 0;
        }
        if ("scrollTop" in document.documentElement) {
          document.documentElement.scrollTop = 0;
        } else {
          // Safari
          window.pageYOffset = 0;
        }
        return;
      }
    },
    // 限制小时数以及请假天数
    limitTime(i,val) {
      if(val.indexOf('.')== -1 ){
        var result = val.substring(val.length-i)
      }else{
        result = val.substring(val.indexOf('.')-i,val.indexOf('.')+3)
      }
      return result
    },
    // 限制请假起始时间
    confirmDate(date){
      // 如果获取默认工作时间 有时小时数只返回一个字段 如 2018-11-11 09:23 返回 2018-11-11 9:23 导致时间错位
      if(date.indexOf(':')==12){
        date = date.split('')
        date.splice(11,0,'0')
        return date.join('').slice(0,16)
      }
      // 如果加班类型计算时间按照天数 则此时date 不会返回小时以及秒数  如2018-11-11
      else if(date.length == 10){
        date = `${date} 00:00`
        return date
      }else if(date.length==0){
        _.alert('提示','开始和结束时间不能为空')
      }
      else{
        return date.slice(0,16)
      }
      // 如果
    },
    initCommitDraft() {
      this.commitDraft = {
        // 提交参数
        "tbQyAskPO.isFree": this.isFree,
        "tbQyAskPO.askType": this.add_nav.templateTypeId,
        "tbQyAskPO.title": this.add_nav.title,
        "tbQyAskPO.content": this.add_nav.content,
        "tbQyAskPO.startTime": `${this.confirmDate(this.date.startDate)}:00`.slice(0, 19),
        "tbQyAskPO.endTime": `${this.confirmDate(this.date.endDate)}:00`.slice(0, 19),
        "tbQyAskPO.askDay": this.askDay,
        "tbQyAskPO.ext1": this.limitTime(3,String(this.ext1)),
        "tbQyAskPO.sumAskDays": this.limitTime(3,String(this.sumAskDays)),
        "tbQyAskPO.sumAskHours": this.limitTime(4,String(this.sumAskHours)),
        "tbQyAskPO.askStatus": this.draft.commitStatus,
        "tbQyAskPO.isRevoked": this.revoking ? "1" : "0",
        "tbQyAskPO.compensateType": this.compensateType,
        "tbQyAskPO.targetTemplateId": this.targetTemplateId,
        radio_choose: this.flowId,
        imageUrls: this.draft.imageUrls,
        relatives: this.stringUserIds(this.ccPersonList)
      };
      Object.assign(this.commitDraft, this.tripInfo);
      if (this.$route.query.askId) {
        if (this.revoking && this.$route.query.type === "revoke") {
          this.commitDraft["tbQyAskPO.sourceAskId"] = this.draft.askId;
        } else {
          this.commitDraft["tbQyAskPO.askId"] = this.draft.askId;
        }
        this.commitDraft["tbQyAskPO.creator"] = this.draft.creator;
      }
    },
    commitTask() {
      this.updateFlowCommitTaskParams({
        isFree: this.isFree,
        FlowAuditUser: this.FlowAuditUser ? this.FlowAuditUser : []
      });
      this.initCommitDraft();
      Object.assign(this.commitDraft, this.commitTaskParams);
      var self = this;
      _.showLoading("i18n.submitting");
      _.ajax({
        url: _.baseURL + self.draft.addOrUpdateUrl,
        type: "POST",
        data: self.commitDraft,
        dataType: "json",
        success: function(result) {
          _.hideLoading();
          if (result.code == "0") {
            _.tooltips_succeed("i18n.operationSuccess");
            // 提交后清空缓存
            self.deleteCaching = true;
            // 当将处理人清空
            if (self.FlowAuditUser.length > 0) {
              self.$store.commit("updateUserSelected", []);
            }
            if (self.draft.commitStatus) {
              self.$router.push({
                path: "/apply"
              });
            } else {
              self.$router.push({
                path: "/draft"
              });
            }
          } else {
            _.alert("提示", result.desc);
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.out-wrapper {
  margin-bottom: 60px;
  .leave-type-wrapper{
    background: #fff;
    height: 89px;
    margin-bottom: -7px;
    .apply-title{
      padding: 12px 0 0 15px;
      color:#1B233A;
      font-size: 16px;
      font-family: 'PingFangSC-Regular';
    }
    .leave-type-list{
      color: #7E818B;
      padding: 8px 12px 0 12px;
      .leave-type-item{
        display: inline-block;
        width: 76px;
        max-width: 150px;
        text-align: center;
        height: 32px;
        line-height: 32px;
        font-size:13px;
        border-radius:16px;
        margin: 0 5px 0 5px;
        background: rgba(247,248,250,1);
      }
      .leave-type-item.selected{
        color: #5585F0;
        background: #E6EDFD;
        font-weight: 500;
      }
    }
  }
}
.leave-apply-new-wrap >>> .qwui-title_detaildata {
  margin-top: 0px;
}
.leave-apply-new-wrap .title-wrapper >>> .qwui-title_item_title {
  font-size: 14px;
  color: rgba(122, 124, 128, 1);
}
.leave-apply-new-wrap >>> .qwui-title_inner_f_item .item_title {
  font-size: 16px;
}
.leave-apply-new-wrap >>> .qwui-tape_box .item_content {
  font-size: 15px;
}
.leave-apply-new-wrap >>> .qwui-flow_list-title {
  font-size: 15px;
}
.leave-apply-new-wrap >>> .flow_list .flow_list_item {
  font-size: 15px;
}
.out-wrapper >>> .qwui-btn_box {
  position: fixed;
  background-color: #fff;
}
.mt15{
  margin-top: -15px;
}
@media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
  .qwui-btn_box {
    border-bottom: 34px solid #fff;
  }
  .out-wrapper {
    border-bottom: 94px;
  }
}
</style>
