/**
 * Created by lishanggang 2018/07/24
 * 新建:searchFlowListFun==> findBranchFlowNextNodeInfoFun ==>getFlowAuditUserFun
 * 详情: getDetailFlowAuditFun ==> findBranchFlowNextNodeInfoFun ==>getFlowAuditUserFun
 */

//引入接口
import {
  searchFlowList,
  findBranchFlowNextNodeInfo,
  getFlowAuditUser,
  getDetailFlowAudit,
  getDepartmentInfo,
  findFlowNodeList,
  getParallelFlowSerial
} from '@/components/flow/api/getApi'

// 选人类型
const USERCONFIG = {
  user:{id: 'userId', name: 'personName',headpic:'headPic',type:'user'},
  deptManager:{id: 'userId', name: 'personName',headpic:'headPic',type:'user',group:true,groupTitle:'departmentName'},
  dept:{id: 'id', name: 'departmentName',headpic:'headPic',type:'dept',checkedType:'radio'},
};

//审批单id数据
let INITDATACONFIG = {}

//流程回调数据
let AUDITFLOWCONFIG = {}

/**
 * 初始化默认的回调数据
 */
 export function resetAuditFlowData (){
    INITDATACONFIG = {
      definitionId: '',  //超表详情ID
      id: '',
      refId: '',
      templateRefId: ''
    }

    AUDITFLOWCONFIG = {
      isBranchFlow: false,         //分支流程，true: 是
      isBranchNode: false,        //流转节点，true: 是
      flowId: '',                 //流程ID
      currentNodeId: '',         //当前节点ID
      nextNodeId: '',           //下一节点ID
      defaultNextNodeId: '',   //默认下一节点id
      parallelNextNodeIds: '',   //开始并行的下一节点集合
      flowList:[],            //固定流程列表
      nextNodeList:[],      //节点下拉选择列表
      appointNodeAndUserVOList: [],     //自由选择处理人列表
      nodeInfo:[],                     //节点审核人列表
    }
}

/**
 * 获取审核用户节点信息入参
 */
export function initCheckParams () {
  return {
    definitionId: INITDATACONFIG.definitionId,
    id: INITDATACONFIG.refId,
    flowId: AUDITFLOWCONFIG.flowId,
    currentNodeId: AUDITFLOWCONFIG.currentNodeId,
    nextNodeId: AUDITFLOWCONFIG.nextNodeId,
    parallelNextNodeIds: AUDITFLOWCONFIG.parallelNextNodeIds,
    isBranchFlow: AUDITFLOWCONFIG.isBranchFlow,
  }
}

// 更新数组
const updateArray = (type,arr) => {
  if(arr){
    AUDITFLOWCONFIG[type].length = 0
    AUDITFLOWCONFIG[type].push(...arr)
  }
}

/**
 * 获取第一个节点的信息和流程列表
 * 入参{ id:"模板id",agentCode：" ",isBranchFlow:"是否分支，true|false }"
 */
export function searchFlowListFun(params,callBack){
  let isFree = params.isFree
  let agentCode = params.agentCode
  // 请假出差、企业用车、费控报销、审批请示，固定流程没找到可用的流程，自动转成自由流程
  let agentList = ['car','moveapprove','ask','reimbursement']

  //初始化默认的回调数据
  resetAuditFlowData();

  searchFlowList(params).then(result => {
    _.hideLoading();
    if(result.code == '0'){
      if(( isFree==0 && agentList.indexOf(agentCode)>-1 )
        || (result.data.list && result.data.list.length>0)
      ){
        branchFlowListCheck(result.data,callBack)
      }else{
        _.alert('提示',"没找到可用的流程，请联系管理员");
      }
    } else{
      _.alert('提示',result.desc);
    }
  })
}

//记录分支流程和固定流程的节点id
export function branchFlowListCheck(data,callBack) {

  if(data.branchNodeInfo){
    AUDITFLOWCONFIG.isBranchFlow = true
    //更新流程模板id
    AUDITFLOWCONFIG.flowId = data.list[0].id
    //更新当前节点id
    AUDITFLOWCONFIG.currentNodeId = data.branchNodeInfo.nodeId

    if(data.branchNodeInfo.havaBranch!='1'){
      //更新下一节点id
      AUDITFLOWCONFIG.nextNodeId = data.branchNodeInfo.defaultNextNodeId
      //获取审核人节点信息
      getFlowAuditUserFun(initCheckParams(),callBack);
    }else{
      //更新分支流转状态
      AUDITFLOWCONFIG.isBranchNode = true
      if(data.branchNodeInfo.defaultNextNodeId){
        //更新默认下一节点id
        AUDITFLOWCONFIG.defaultNextNodeId = data.branchNodeInfo.defaultNextNodeId
      }
      _.hideLoading();
      callBack(AUDITFLOWCONFIG);
    }
  }else{
    //更新固定流程列表
    updateArray('flowList',data.list)
    if(data.list.length==1){
      //更新流程id
      AUDITFLOWCONFIG.flowId = data.list[0].id
      //获取审核人节点信息
      getFlowAuditUserFun(initCheckParams(),callBack);
    }else{
      _.hideLoading();
      callBack(AUDITFLOWCONFIG);
    }
  }
}

/**
 * 获取下一节点信息
 * 入参{ initRefId:"审批单的Id,新建为空"，templateRefId："模板id",currentNodeId："当前节点""
 */
export function findBranchFlowNextNodeInfoFun (params,callBack) {
  findBranchFlowNextNodeInfo(params).then(result => {
    if (result.code == '0'){
      let nextNodeList = result.data.nextNodeList;
      if (nextNodeList && nextNodeList.length){
        //更新入参数据
        INITDATACONFIG.templateRefId = params.templateRefId? params.templateRefId : ''
        //详情definitionId为空
        INITDATACONFIG.definitionId = params.initRefId && params.templateRefId? '': INITDATACONFIG.templateRefId

        //更新下一节点列表
        updateArray('nextNodeList',nextNodeList)

        //当只有一个节点且这个节点为结束节点时,不需要查询审批人（结束节点）
        if (nextNodeList.length==1 && nextNodeList[0].nodeStatus=="2") {
          if(AUDITFLOWCONFIG.isBranchNode && AUDITFLOWCONFIG.defaultNextNodeId){
            AUDITFLOWCONFIG.parallelNextNodeIds = nextNodeList[0].id
          } else{
            AUDITFLOWCONFIG.nextNodeId = nextNodeList[0].id
          }
          callBack(AUDITFLOWCONFIG);
          return;
        } else {
          AUDITFLOWCONFIG.nextNodeId = nextNodeList[0].id
          //新建提单人单分支时，下一节点是并行开始、详情页面下一节点是并行开始或并行结束（非分支流转）
          if (AUDITFLOWCONFIG.isBranchNode && AUDITFLOWCONFIG.defaultNextNodeId) {
            AUDITFLOWCONFIG.parallelNextNodeIds = mapParallelNextNodeIds(nextNodeList)
            updateArray('nextNodeList',[])
            AUDITFLOWCONFIG.nextNodeId =  AUDITFLOWCONFIG.defaultNextNodeId
          }

          //新建提单人多分支时，下一节点是并行开始、详情有流转，且默认的下一节点是并行结束
          if(AUDITFLOWCONFIG.isBranchNode && nextNodeList[0].nextNodeList.length){
            AUDITFLOWCONFIG.parallelNextNodeIds = mapParallelNextNodeIds(nextNodeList[0].nextNodeList)
            //并行合并的下一节点是结束节点
            if(nextNodeList[0].nextNodeList[0].nodeStatus == '2'){
              callBack(AUDITFLOWCONFIG);
              return;
            }
          }
          getFlowAuditUserFun(initCheckParams(),callBack);
        }
      }else {
        _.hideLoading();
        _.alert('提示',"没有找到相应的节点信息,请联系管理员");
      }
    } else{
      _.hideLoading();
      _.alert('提示',result.desc);
    }
  })
}

//拼接并行的中间节点id
function mapParallelNextNodeIds(data) {
  return data.map(value => {
    return value.id
  }).join(',');
}

//设置选人的标题
export function settingAuditTitle (nodeName,isFree) {
  if(isFree === '0' || isFree === '3'){
    return nodeName ? nodeName+'处理人' : '处理人'
  }else{
    return nodeName ? nodeName+'审批人' : '审批人'
  }
}
/**
 * 获取审核人节点信息: 入参{ definitionId:"超级表单关联id", id:"审批单id",flowId:"流程id",
 * currentNodeId："当前节点",nextNodeId:"下一节点",isBranchFlow:"是否分支流程，true|false"}"
 */
export function getFlowAuditUserFun (params,callBack) {
  getFlowAuditUser(params).then(result => {
    _.hideLoading();
    if(result.code == '0'){
      //更新AUDITFLOWCONFIG的值
      AUDITFLOWCONFIG.flowId = params.flowId
      AUDITFLOWCONFIG.nextNodeId = params.nextNodeId
      AUDITFLOWCONFIG.parallelNextNodeIds = params.parallelNextNodeIds

      //新建页面更新自由选择列表
      if(!INITDATACONFIG.refId){
        updateArray('appointNodeAndUserVOList',[])
        if(result.data.appointNodeAndUserVOList && result.data.appointNodeAndUserVOList.length>0){
          updateArray('appointNodeAndUserVOList',result.data.appointNodeAndUserVOList)
        }
      }
      //处理 节点信息数据结构
      updateArray('nodeInfo',[])
      if(result.data.nodeInfo && result.data.nodeInfo.length){
        branchFlowAuditUserConfig(result.data.nodeInfo,'startAuditList',callBack)
      } else{
        _.hideLoading();
        callBack(AUDITFLOWCONFIG);
      }

    } else{
      _.alert('提示',result.desc);
    }
  })
}

//配置审批人是选择部门时的数据列表：接口查询
export function branchFlowAuditUserConfig (nodeInfo,type,callBack) {
  //处理人数据结构列表
  let nodeInfoList = settingNodeInfoList(nodeInfo,type)

  //需要请求部门次数
  let needRequestTime = 0;
  //已经请求部门次数
  let hasRequestTime = 0;
  //存在部门查询
  let hasDepartment = false;

  nodeInfoList.forEach(function(item,index){
    if(item.isChoise=="1" && item.audtiFlag=="2"){
      needRequestTime++;
      hasDepartment = true
      let params = {
        nextNodeId: item.nodeId,
        isBranchFlow: AUDITFLOWCONFIG.isBranchFlow,
        flowId: AUDITFLOWCONFIG.flowId,
        id: INITDATACONFIG.refId
      };
      //详情审批查询部门列表（isAudit区分是审批操作）
      params.isAudit = type === 'nextAuditList'?  1 : 0;
      getDepartmentInfo(params).then(function (result) {
        hasRequestTime++;
        if (result.code === '0') {
          if(result.data.departmentList){
            item.startAuditList.flowUserList.length = 0;
            item.startAuditList.flowUserList.push(result.data.departmentList);
          }else{
            _.alert('提示', '部门数据为空');
          }
          if(needRequestTime == hasRequestTime){
            _.hideLoading();
            updateArray('nodeInfo',nodeInfoList)
            callBack(AUDITFLOWCONFIG);
          }
        } else {
          _.alert('提示', result.desc);
        }
      })
    }
  });
//不存在部门查询直接回调
  if(!hasDepartment){
    _.hideLoading();
    updateArray('nodeInfo',nodeInfoList)
    callBack(AUDITFLOWCONFIG);
  }
}

//配置处理人的选择类型列表
function settingNodeInfoList(nodeInfo,type) {
  let nodeInfoList = []
  if(nodeInfo && nodeInfo.length){
    for(let i=0;i<nodeInfo.length;i++) {
      let startAuditList = checkFlowAuditUser(nodeInfo[i],type);
      if(startAuditList){
        nodeInfo[i].startAuditList=Object.assign({},startAuditList);
        nodeInfoList.push(nodeInfo[i]);
      }
    }
  }
  return nodeInfoList
}

//配置处理人的选择类型结构：{是选人、部门、部门负责人，可编辑、不可编辑}
export function checkFlowAuditUser (data,type){
  let startAuditList = null;
  if(data.nodeHandleType!="5" || type=="nextAuditList"){
    startAuditList = {
      "show":true,
      "selectType": USERCONFIG.user,  //默认选的是人员
      "userSelected": [],
      "flowUserList": [],
      "assignRange": true,
      "isCanEdit":true,
      "isCanDelete":true
    };
    if(data.audtiFlag!="3"){
      switch (data.isChoise){
        case "0":
          // "0":"1 单部门":"人员，默认全选"
          data.alreadyChoiseList && data.alreadyChoiseList.length>0?
            startAuditList.userSelected.push(...data.alreadyChoiseList):
            startAuditList.userSelected.push(...data[type]);
          startAuditList.flowUserList.push(data[type]);
          startAuditList.defaultAllSelect = true; //默认全选
          break;
        case "2":
          // "2":"1 单部门":"人员，默认不全选"
          // "2","2 多部门":部门负责人
          data.alreadyChoiseList && data.alreadyChoiseList.length>0?
            startAuditList.userSelected.push(...data.alreadyChoiseList):"";
          if(data.audtiFlag == "1"){
            startAuditList.flowUserList.push(data[type]);
            startAuditList.defaultAllSelect = true; //默认全选
          } else if (data.audtiFlag == "2") {
            startAuditList.selectType = USERCONFIG.deptManager;
            let departmentName="",arr=[];
            for(let i=0;i<data[type].length;i++){
              if(i==0){
                departmentName=data[type][i].departmentName;
              }else if(departmentName!=data[type][i].departmentName){
                startAuditList.flowUserList.push(arr);
                departmentName=data[type][i].departmentName;
                arr=[];
              }
              arr.push(data[type][i]);
            }
            startAuditList.flowUserList.push(arr);
          }
          break;
        case "1":
          // 不可选，"1":"1 单部门":人员
          // "1":"2 多部门":部门
          if (data.audtiFlag == "1") {
            if(data[type].length==0 && data.nodeName){
              const noAuditUser={
                "startAuditList":"节点【" + data.nodeName + "】处理人为空",
              };
              _.alert("提示", noAuditUser[type]);
            }
            startAuditList.userSelected.push(...data[type]);
            startAuditList.isCanDelete = false;
            startAuditList.isCanEdit =false;
          } else if (data.audtiFlag == "2") { //选择部门
            startAuditList.selectType = USERCONFIG.dept;
            startAuditList.isCanDelete = false;
          }
          break;
      }
    }else{
      _.alert("提示", "你所在的部门暂无设置直接负责人,请联系后台管理员");
    }
  }
  return startAuditList;
}

/**
 * 详情页面获取当前处理人、下一节点处理人、节点信息
 * 入参{ definitionId:"",refId:"审批单的id",nodeId："当前节点",isBranch:"是否分支，true|false"}"
 */
export function getDetailFlowAuditFun(params,callBack) {
  getDetailFlowAudit(params).then(result => {
    _.hideLoading();
    if (result.code == '0'){
      let nodeInfo = result.data.data
      if(!nodeInfo){return}

      resetAuditFlowData()
      if (nodeInfo.length === 1){
        AUDITFLOWCONFIG.isBranchFlow = params.isBranch
        AUDITFLOWCONFIG.isBranchNode = nodeInfo[0].isBranchNode
        AUDITFLOWCONFIG.currentNodeId = params.nodeId
        INITDATACONFIG.definitionId = params.definitionId
        INITDATACONFIG.refId = params.refId

        //更新自由选择
        updateArray('appointNodeAndUserVOList',nodeInfo[0].appointNodeAndUserVOList)

        //判断并行
        if(nodeInfo[0].vo){
          AUDITFLOWCONFIG.nextNodeId = nodeInfo[0].vo.defaultNextNodeId
          if (AUDITFLOWCONFIG.isBranchNode){
            AUDITFLOWCONFIG.defaultNextNodeId = nodeInfo[0].vo.defaultNextNodeId
          }
          AUDITFLOWCONFIG.flowId = nodeInfo[0].vo.flowId
          //设置nodeId兼容
          nodeInfo[0].nodeId = nodeInfo[0].vo.defaultNextNodeId
        }
      }else{
        for(let i=0;i<nodeInfo.length;i++){
          //设置nodeId兼容
          nodeInfo[i].nodeId =nodeInfo[i].vo? nodeInfo[i].vo.defaultNextNodeId : ''
        }
      }
      //配置选人数据结构、部门查询回调,兼容详情nextAuditList
      branchFlowAuditUserConfig(nodeInfo,'nextAuditList',callBack)
    } else{
      _.alert('提示',result.desc);
    }
  })
}

//固定流程和分支流程的审批状态判断
export function statusCheck(creatorId,status,isOver){
  var statusObj={
    "-1":"已结束",
    "0":"已审批",
  };
  var isOverObj={
    "-1":"已关闭",
    "0":"退审",
    "1":"已审批"
  };
  if(statusObj[status]){
    return statusObj[status];
  }
  if(creatorId!=_.userId) {
    if (isOverObj[isOver]) {
      return isOverObj[isOver];
    }
    if (status == "2") {
      return "已结束";
    }
    if (status != "2" && isOver != "0") {
      return "审批中";
    }
  }
  return "";
}

/**
 * 流转明细, 入参:{ refId: '审批单id',isBranch: }
 */
export function getParallelFlowSerialFun(params,callBack) {
  getParallelFlowSerial(params).then(result =>{
    if (result.code == '0') {
      callBack(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

/**
 * 查看流程节点, 入参:{ flowId: '流程id' }
 */
export function findFlowNodeListFun(params,callBack) {
  findFlowNodeList(params).then(result =>{
    if (result.code == '0') {
      callBack(result.data.nodeList)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

//拼接userId
export function stringUserIds(array) {
  let ids = array.map((value) => {
    return value.userId;
  })
  return ids.join('|');
}

//验证新建审批人是否已经选择
export function isCheckFlowUserConfirm(data,callBack) {
  switch (data.isFree){
    case '0':
      if (data.flowId == "") {
        if (!data.flowList.length) {
          _.alert("提示", "没找到可用的固定流程，请联系管理员");
          return
        } else {
          _.tooltips_succeed("请选择审批流程", true,'', 3000);
          return
        }
      } else{
        checkAuditUserList(data, callBack)
      }
      break;
    case '3':
      if (data.isBranchNode) {
        if (callBack) callBack('findBranchFlowNextNode')
      } else {
        checkAuditUserList(data, callBack)
      }
      break;
    default:
      let incharges = data.FlowAuditUser[0].startAuditList.userSelected;
      let userIds = stringUserIds(incharges);
      if (!incharges.length) {
        _.tooltips_succeed("处理人不能为空", true, "", 2500);
        return
      }
      if (userIds.indexOf(data.creator) > "-1") {
        _.tooltips_succeed("处理人不能选择自己", true, "", 2500);
        return
      }
      if (callBack) callBack()
      break;
  }
}

function checkAuditUserList(data,callBack) {
  if (isCheckAuditUser(data,callBack)) {
    isCheckAppointNode(data, callBack);
  }
}

// 有在当前节点选择处理人的节点信息，显示选人弹窗
function isCheckAppointNode(data, callBack) {
  if (data.appointNodeAndUserVOList.length) {
    if (callBack) callBack('flowApproveDialogShow')
    return
  }
  if (callBack) callBack()
}

export  function isCheckAuditUser(data,callBack) {
  let FlowAuditUser = data.FlowAuditUser;
  if (FlowAuditUser.length) {
    for (let i = 0; i < FlowAuditUser.length; i++) {
      let userSelectedLength = FlowAuditUser[i].startAuditList.userSelected.length;
      let audtiFlag = FlowAuditUser[i].audtiFlag;
      let isChoise = FlowAuditUser[i].isChoise;
      if (!userSelectedLength) {
        if (audtiFlag != "1") {
          // 无部门负责人
          if (audtiFlag == "3") {
            _.alert("提示", "你所在的部门暂无设置直接负责人,请联系后台管理员");
            return false
          }
          // 多部门
          if (isChoise == "0" || isChoise == "2") { // 允许上个节点指定处理人
            _.tooltips_succeed("选择下一步处理人", true, "", 2500);
          } else { // 不允许指定处理人
            _.tooltips_succeed("选择下一步处理人所在的部门", true, "", 2500);
          }
          if(callBack) callBack('flowApproveDialogShow')
          return false
        } else {
          // 单部门/固定处理人 允许上个节点指定处理人
          if (isChoise == "0" || isChoise == "2") {
            _.tooltips_succeed('选择下一步处理人', true, "", 2500);
            if(callBack) callBack('flowApproveDialogShow')
            return false
          } else if (isChoise == "1") {
            _.alert("提示", "找不到下一步处理人，请联系后台管理员");
            return false
          }

        }
      }
    }
  }
  return true
}

// 选人弹窗点击确定后：判断自由选人是否为空
export function isCheckAppointNodeAndUser(data) {
  if (!data.flowChioseNodeAuditUser.length) {
    _.tooltips_succeed("处理人不能为空", true, "", 2500);
    return false
  } else {
    for (let i = 0; i < data.flowChioseNodeAuditUser.length; i++) {
      if (data.flowChioseNodeAuditUser[i] == undefined || !data.flowChioseNodeAuditUser[i].length) {
        _.tooltips_succeed("处理人不能为空", true, "", 2500);
        return false
      }
    }
  }
  return true
}
// 加签校验 请选择加签处理人/加签说明不能为空/不能加签提单人/不能加签自己/不能加签当前负责人
export const isCheckAssign= ({counterSignPerson,FlowAuditList,approveText,assignType}={}) => {
  // 被加签的id
  let ids = counterSignPerson.map( item =>{
    return item.userId
  })
  // 请选择加签类型
  if(!assignType){
    _.tooltips_succeed("请选择加签类型", true, "", 2500)
    return false
  }
  // 请选择加签处理人
  if(!counterSignPerson.length) {
    _.tooltips_succeed("请选择加签处理人", true, "", 2500)
    return false
  }
  // 当前选择的处理人是否在当前负责人
  let addCounterSignFlag = FlowAuditList[0].auditUserList.filter(value=>{
    return ids.indexOf(value.userId)>-1
  })
  // 不能加签当前负责人
  if(addCounterSignFlag.length>0){
    _.tooltips_succeed("不能加签当前负责人", true, "", 2500)
    return false
  }
  //不能加签自己
  if(ids.indexOf(_.userId)>-1){
    _.tooltips_succeed("不能加签自己", true, "", 2500)
    return false;
  }
  // 不能加签下一步处理人
  if(FlowAuditList[0].nextAuditList && FlowAuditList[0].nextAuditList.length) {
    let nextAuditFlag = FlowAuditList[0].nextAuditList.filter(value=>{
      return ids.indexOf(value.userId)>-1
    })
    if(nextAuditFlag.length>0){
      _.tooltips_succeed("不能加签下一步处理人", true, "", 2500)
      return false
    }
  }
  // 如果用户没有输入理由
  if (!approveText) {
    _.tooltips_succeed("加签说明不能为空", true, "", 2500)
    return false
  }
  return true
}


