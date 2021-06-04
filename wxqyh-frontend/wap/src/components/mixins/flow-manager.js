
/**
 * 统一管理流程的组件定义和计算属性,接口API
 */

import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex';

import {
  searchFlowListFun,
  settingAuditTitle,
  isCheckFlowUserConfirm,
  findBranchFlowNextNodeInfoFun,
  getDetailFlowAuditFun,
  getParallelFlowSerialFun
} from '../flow/getAuditFlow'

import UserPreview from '../detail/user_show' //人员列表
//并行选择弹窗
import SelectNode from '../flow/selectNode';
//审批人展示组件
import UserSelectedItem from '../base/userOrDeptSelect/user_selected'
import UserSelectedGroup from '../base/userOrDeptSelect/user_selected_group'
//选择审批人、部门、部门负责人弹窗
import UserSelectedRang from '../base/userOrDeptSelect/user_selected_ranglist'
//底部审批按钮
import FlowApproveButton from '../flow/flowApproveButton'
//审批操作弹窗
import FlowApproveDialog from '../flow/flowApproveDialog'
// 流转明细
import FlowSerial from '../flow/flow_serial';
//固定流程列表
import FlowList from "@/components/flow/flowList";

export default {
  data() {
    return {
      // 审批按钮
      approveActionStatus: '' ,
      //预览审批人
      userPreviewConfig:{
        // 选择人队列
        userSelect: [],
        //标题
        title: '',
        //限制弹个人信息弹窗
        limitPreview: false
      },
      //显示预览审批人
      showPerson: false,
      //流程明细
      flowSerial:{
        isFirstRequest: true,
        isShowFlowSerial: false,
        list: [],
        isFreeFlow: '',
        isover:'',
        currentTime: '',// 当前时间
      },
    };
  },
  components:{
    UserPreview,
    SelectNode,
    UserSelectedItem,
    UserSelectedGroup,
    UserSelectedRang,
    FlowApproveButton,
    FlowApproveDialog,
    FlowSerial,
    FlowList
  },
  computed: {
    ...mapGetters([
      'FlowAuditUserIds',    // 已选择的处理人id
      'FlowAuditListShow',   // 下一步处理人是否显示
      'findBranchFlowNextNodeInfoParams',    // 查找下一节点信息的入参
      'getIsCheckFlowUserConfirmParams',//检验流程字段
    ]),
    ...mapState({
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
      loadLastConfig: state => state.flowUserSelected.loadLastConfig, // 加载上一次默认配置
      flowList: state => state.flowUserSelected.flowList, // 流程列表
      FlowAuditUserBoxShow: state => state.flowUserSelected.FlowAuditUserBoxShow, //流程勾选类型弹窗：指定人员、部门、部门负责人
      flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
      appointUserIndex:state => state.flowUserSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
      appointNodeAndUserVOList: state => state.flowUserSelected.appointNodeAndUserVOList,  // 当前节点指定处理人的节点信息
      approveVo: state => state.flowUserSelected.approveVo,  // 自由流程信息
      commitTaskParams: state => state.flowUserSelected.commitTaskParams, ////提交返回的流程字段
    }),
  },
  created(){
    //重置流程数据
    this.resetFlowData()
    //重置选人数据
    this.resetSelectConfig()
  },
  destroyed() {
    this.updateUserSelectedState({type: "refId", data: ''})
    this.updateUserSelectedState({type: "templateRefId", data: ''})
  },
  methods: {
    ...mapActions([
      "getApprove",   // 自由流程获取转审人员
      "updateFlowUserSelected",     // 更新已选处理人
      "getNodeListInfo", //获取节点选择信息
      "updateFlowCommitTaskParams" // 更新提交数据json
    ]),
    ...mapMutations([
      //新建页面配置
      "removeFlowAuditUser",        // 删除处理人
      'saveChooseFlowUserJson',     // 自由选择确定保存处理人信息
      "updateUserSelectedState",    //更新vuex状态数据
      'resetSelectConfig',
      // 重置选人配置
      "updateUserSelectConfirm",
      //详情页面配置
      'updateCCPerson',//更新相关人
      'resetFlowData',  // 重置流程信息
      'updateUserSelectedState',
    ]),
    //详情审批成员标题
    detailAuditTitle(item) {
      if(this.FlowAuditList.length==1) {
        return  '当前处理人'
      }
      return item.vo ? item.vo.nodeName+' 处理人' : item.nodeName+' 处理人'
    },
    //预览成员
    showPersonList(title,list,type){
      this.userPreviewConfig.title = title;
      this.userPreviewConfig.userSelect = list;
      this.showPerson = true;
      this.userPreviewConfig.limitPreview = type ? true : false
    },
    // 查询并行的节点选择接口
    getDetailNodeList (data,callBack) {
      let self = this
      this.getNodeListInfo({'refId': self.refId,'callback': function (result){
        if (result.length>0){
          self.updateUserSelectedState({type: "currentNodeId", data: result[0].nodeId})
        } else {
          self.updateUserSelectedState({type: "currentNodeId", data: data.detail? data.detail.currentNodeId :''})
        }
        if(callBack){
          callBack(data)
        }
      }})
    },
    // 查看流转明细
    getFlowSerial() {
      let params = {
        refId: this.refId,
        isFree: this.isFree == '0'? 2 : this.isFree, //固定流程转为2,
      }
      getParallelFlowSerialFun(params, (res) => {
        this.flowSerial.list = res.auditSerial
        this.flowSerial.currentTime = res.currentTime
        this.flowSerial.isShowFlowSerial = true
        this.flowSerial.isFirstRequest = false
      })
    },
    //查询流程审批节点信息
    getFlowAuditNodeData (params,callBack){
      getDetailFlowAuditFun(params ,(result) => {
        this.$store.commit('updateSearchFlowListData', result);
        this.$store.commit('updateFlowAuditList', result.nodeInfo);
        this.$store.commit('updateFlowChioseNodeAuditUser')      // 更新由上一个节点已选择的处理人
        if(callBack){
          callBack(result)
        }
      })
    },
    //查询分支流程的下一节点
    requestNextBranchNode(params){
      findBranchFlowNextNodeInfoFun(params,(result) => {
        this.$store.commit('updateFlowAuditUserData', result);
        this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
        //更新下拉选择节点名称
        this.$store.commit('updateChooseNodeName')
      })
    },
    // 选择处理人后点击确定回调
    FlowAuditUserResult(payload) {
      this.$store.commit('checkFlowAuditUserType', payload)
      // 如果是多部门，则请求部门负责人
      this.updateFlowUserSelected(payload)
    },
    //新建设置标题
    startAuditTitle(nodeName){
      return settingAuditTitle(nodeName,this.isFree)
    },
    //新建 更新流程类型，第一个接口审批列表数据
    getAuditFlowListFun (isFree,params,callBack){
      this.updateUserSelectedState({type: "isFree", data: isFree})
      searchFlowListFun(params, (result) => {
        //流程接口数据回调
        this.$store.commit('updateSearchFlowListData', result);
        if(callBack){
          callBack(result)
        }
      })
    },
    // 新建显示选择处理人弹窗
    FlowAuditUserShowBox(index) {
      this.updateUserSelectedState({type:'appointUserIndex',data:index})
      //显示指定范围选人弹窗
      if(this.FlowAuditUser[index].startAuditList.assignRange){
        this.updateUserSelectedState({type:"FlowAuditUserBoxShow", data: true})
        return
      }
      //显示自由选处理人时的选人组件界面
      this.updateUserSelectConfirm( { data: this.FlowAuditUser[index].startAuditList.userSelected,
        callBack: (result) => {
          this.$store.commit('updateUserSelected',result.user.data)
        }
      });
    },
    //新建提交，检验流程字段是否填写，是否存在分支流转
    checkFlowUserConfirmFun(callBack){
      isCheckFlowUserConfirm(this.getIsCheckFlowUserConfirmParams,(type) => {
        //处理人没选,显示选人弹窗
        if(type === 'flowApproveDialogShow'){
          this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
          return
        }
        if(type === 'findBranchFlowNextNode'){
          //查找下一节点信息
          findBranchFlowNextNodeInfoFun(this.findBranchFlowNextNodeInfoParams,(result) => {

            this.$store.commit('updateFlowAuditUserData', result);
            this.updateUserSelectedState({type: "flowApproveDialogShow", data: true})
            //更新下拉选择节点名称
            this.$store.commit('updateChooseNodeName')
          })
          return
        }

        //校验成功回调
        if(callBack){
          callBack()
        }
      })
    },
    // 添加相关人
    ccPersonListShowBox(){
      //初始化选人数据
      this.updateUserSelectConfirm( { data: this.ccPersonList,
        callBack: (result) => {
          this.$store.commit('updateCCPerson',result.user.data)
        }
      });
    },
    // 删除相关人
    removeCCPerson(payload) {
      this.$store.commit('removeCCPerson',payload)
    },
  }
};
