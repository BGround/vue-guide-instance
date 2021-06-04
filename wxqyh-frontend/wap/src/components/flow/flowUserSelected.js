import axios from 'axios'

const USERCONFIG = {
  user:{id: 'userId', name: 'personName',headpic:'headPic',type:'user'},
  deptManager:{id: 'userId', name: 'personName',headpic:'headPic',type:'user',group:true,groupTitle:'departmentName'},
  dept:{id: 'id', name: 'departmentName',headpic:'headPic',type:'dept'},
}
//默认人员选择类型：可删除可编辑，复选
const UserConfig = {
  "isCanDelete":true,
  "isCanEdit": true,
  "checkedType": "checkbox",
}

//默认部门选择类型：可编辑不可删除，单选
const DeptConfig = {
  "isCanDelete":false,
  "isCanEdit": true,
  "checkedType": "radio",
}

//默认审批人的选择类型是：选人
const DefaultFlowAuditUser = {
  "show": true,
  "assignRange":false,
  "selectType": USERCONFIG.user,   // 选人类型
  "flowUserList":[],  // 选人范围
  "userSelected":[],  // 已选的人
  ...UserConfig,
}

// 重置加载上次按钮配置
const RESETLOADLASTCONFIG = (()=> {
  return {
    ccPersonList: {
      type: '1',
      show: true,
      name: 'i18n.loadLast',
      isGetVal: false,
    },
    toPersonList: {
      type: '0',
      show: true,
      name: 'i18n.loadLast',
      isGetVal: false,
    }
  }
})

//初始化重置选人数据结构
const RESETSELECTCONFIG = (()=>{
  return {
    show:false,
    signIndex:'user',
    selectList: {
      "user": {
        "title": "",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "deptSelectedShow": false,
        "callBack": {
          "confirm": null,
        }
      }
    }
  }
})


//公用数据初始化
const INITFLOWCONFIG = (()=>{
  return JSON.parse(JSON.stringify({
    'isFree': 1, //流程类型
    'refId': '',  //审批单id
    'templateRefId': '',//模板审批单id


    'isBranchFlow': false,         //分支流程，true: 是
    'isBranchNode': false,        //流转节点，true: 是
    'flowId': '',                 //流程ID
    'currentNodeId': '',         //当前节点ID
    'nextNodeId': '',           //下一节点ID
    'defaultNextNodeId': '',   //默认下一节点id
    'parallelNextNodeIds': '',   //开始并行的下一节点集合
    'flowList':[],            //固定流程列表
    'nextNodeList':[],      //节点下拉选择列表
    'appointNodeAndUserVOList': [],     //自由选择处理人列表
    'FlowAuditList': [],                //详情当前和下一步处理人接口数据
    'nodeInfo':[],                     //节点审核人列表

    "FlowAuditUserBoxShow": false,    // 显示指定的选人类型弹窗：指定人员、部门、部门负责人
    "flowApproveDialogShow": false,    // 显示选择处理人弹窗（包括自由选人和指定的选人列表）
    "FlowAuditUser":[{
      startAuditList: DefaultFlowAuditUser
    }],
    //加载上一次选人
    'loadLastConfig': RESETLOADLASTCONFIG(),
    //调用选人组件的基础配置 : 负责人\相关人
    'selectConfig': RESETSELECTCONFIG(),
    "ccPersonList":[],    // 相关人
    "toPersonList":[],    // 负责人
    "flowChioseNodeAuditUser":[],      //自由选择列表
    "flowChioseNodeAuditUserJson":[],
    'chooseNodeName': '',       //下拉选择的节点名称
    'isShowNodeBox': false,        //显示选择下一节点弹窗
    'appointUserIndex':0,      // 用户当前选择处理人的第几个节点
    'chooseFlowUserJson': '', //选择的人员id_JSON
    'flowDpIdJson': '',  //部门id_JSON
    'approveVo': null,          // 自由流程信息
    'commitTaskParams': '',     // 提交的数据
  }))
})

const state = INITFLOWCONFIG()

//更新数组数据方法
const updateArray = (data,arr) => {
  if(arr){
    data.splice(0,data.length,...arr)
  }
}

 function stringUserIds(array) {
  let ids = array.map((value) => {
    return value.userId;
  })
  return ids.join('|');
}

//更新固定流程列表、处理人、自由选择、下拉列表数据
const updateArrayFun = (payload)=> {
  //更新固定流程列表
  updateArray(state.flowList,payload.flowList)
  //更新审批人列表
  updateArray(state.FlowAuditUser,payload.nodeInfo)
  //更新nodeInfo接口数据
  updateArray(state.nodeInfo,payload.nodeInfo)
  //更新自由选择列表
  updateArray(state.appointNodeAndUserVOList,payload.appointNodeAndUserVOList)
  state.flowChioseNodeAuditUser.length = payload.appointNodeAndUserVOList.length
  //更新下拉选择列表
  updateArray(state.nextNodeList,payload.nextNodeList)
}


const mutations = {
  //重置流程数据
  resetFlowData(state){
    let refId = state.refId
    let templateRefId= state.templateRefId
    Object.assign(state,INITFLOWCONFIG())
    state.refId = refId
    state.templateRefId = templateRefId
  },
  //重置加载上一次数据
  resetLoadLastConfig(state,payload){
    Object.assign(state.loadLastConfig,payload? payload:RESETLOADLASTCONFIG())
  },
  //重置选人配置数据
  resetSelectConfig(state,payload){
    Object.assign(state.selectConfig,payload? payload:RESETSELECTCONFIG())
  },
  // 更新自由流程获取转审人员
  updateApproveVo(state,payload) {
    state.approveVo = Object.assign({},payload)
  },
  // 更新state 非引用类型的值
  updateUserSelectedState(state,payload) {
    state[payload.type] = payload.data
  },
  // 更新详情的节点数据
  updateFlowAuditList(state,payload){
    updateArray(state.FlowAuditList,payload)
  },
  // 更新第index 的数据
  updateChoseNodeAuditUser(state,payload){
    state.flowChioseNodeAuditUser.splice(payload.index,1,payload.data)
  },
  //更新下拉选择的节点名称
  updateChooseNodeName(state){
    if(state.nextNodeList.length){
      let chooseNodeTitle = '';
      let nodeItem = state.nextNodeList[0];
      if (nodeItem.nodeStatus == 3 && nodeItem.ext1 != 2) {
        chooseNodeTitle += nodeItem.nodeName + '：';
        chooseNodeTitle += nodeItem.nextNodeList.map(value=>{
          return value.nodeName;
        }).join('+');
      } else {
        chooseNodeTitle += nodeItem.nodeName;
      }
      state.chooseNodeName = chooseNodeTitle;
    }
  },
  // 更新已选人
  updateUserSelected(state,payload) {
    if(state.FlowAuditUser[state.appointUserIndex]){
      updateArray(state.FlowAuditUser[state.appointUserIndex].startAuditList.userSelected,payload)
    }
  },
  // 删除处理人
  removeFlowAuditUser(state,payload) {
    // index
    state.FlowAuditUser[payload.index].startAuditList.userSelected.splice(payload.delUserIndex,1)
  },
  // 更新相关人
  updateCCPerson(state,payload) {
    updateArray(state.ccPersonList,payload)
    Object.assign(state.ccPersonList,payload)
  },
  // 删除相关人
  removeCCPerson(state,payload) {
    state.ccPersonList.splice(payload.index,1)
  },
  // 删除已选处理人
  removeChooseNodeUser(state,payload){
    state.flowChioseNodeAuditUser[payload.parentIndex].splice(payload.index,1)
  },
  // 更新负责人
  updateTOPerson(state,payload) {
    updateArray(state.toPersonList,payload)
    Object.assign(state.toPersonList,payload)
  },
  updateUserSelectConfirm(state,payload){
    //重置选人配置
    Object.assign(state.selectConfig,RESETSELECTCONFIG())
    //初始化选人数据
    let personList = state.selectConfig.selectList.user
    personList.userSelected.push(...payload.data)
    state.selectConfig.show = true
    //选人确定回调
    personList.callBack.confirm = function (el, obj) {
      if(payload.callBack){
        payload.callBack(obj)
      }
    }
  },
  // 由上一个节点已选择的处理人
  updateFlowChioseNodeAuditUser(state,payload) {
    state.appointNodeAndUserVOList.forEach((value,index) => {
      if(value.nodeAudtiUserList) {
        state.flowChioseNodeAuditUser.splice(index,1, value.nodeAudtiUserList)
      }
    })
  },
  //检查选人的类型，是部门的话则请求部门负责人
  checkFlowAuditUserType(state,payload){
    if(payload.selectType==='dept' && !payload.ids){
      _.tooltips_succeed('请选择部门',true,"",2500);
      return
    }
    //关闭选人类型弹窗
    state.FlowAuditUserBoxShow = false
  },
  // 保存节点的选人信息
  saveNodeAuditUserJson(state) {
    let json = []
    state.appointNodeAndUserVOList.forEach((value,index)=>{
      let obj = {}
      let users = state.flowChioseNodeAuditUser[index]
      if(!users) return;
      obj.nodeId = value.nodeId
      let ids = users.map((value)=>{
        return value.userId
      })
      obj.auditUserIds = ids.join('|')
      json.push(obj)
    })
    updateArray(state.flowChioseNodeAuditUserJson,json)
    state.flowApproveDialogShow = false
  },
  //第一接口返回的数据进行统一更新
  updateSearchFlowListData(state,payload){

    //更新固定流程列表、处理人、自由选择、下拉列表数据
    updateArrayFun(payload)

    state.isBranchFlow = payload.isBranchFlow
    state.isBranchNode = payload.isBranchNode
    state.flowId = payload.flowId
    state.currentNodeId = payload.currentNodeId
    state.nextNodeId = payload.nextNodeId
    state.defaultNextNodeId =  payload.defaultNextNodeId
  },
  //最后接口返回的数据进行统一更新
  updateFlowAuditUserData(state,payload){
    //更新固定流程列表、处理人、自由选择、下拉列表数据
    updateArrayFun(payload)
    state.flowId = payload.flowId
    state.nextNodeId = payload.nextNodeId
    state.parallelNextNodeIds = payload.parallelNextNodeIds
  },
//保存处理人的json数据
  saveChooseFlowUserJson(state){
    let chooseFlowUserJson = {}
    let flowDpIdJson = {}
    state.FlowAuditUser.forEach(function(value){
      let users = value.startAuditList.userSelected
      if(!users.length) return;
      // 允许上个节点指定处理人
      if (value.isChoise == "0" || value.isChoise == "2") {
        let ids = users.map((value)=>{
          return value.userId
        })
        if (value.isBranchNode!=undefined && !value.isBranchNode) {
          chooseFlowUserJson[value.vo.defaultNextNodeId] = ids.join('|')
        } else {
          chooseFlowUserJson[value.nodeId] = ids.join('|')
        }
      }
      // 多部门
      if (value.audtiFlag == "2") {
        if (value.isBranchNode!=undefined && !value.isBranchNode) {
          flowDpIdJson[value.vo.defaultNextNodeId] = value.startAuditList.userSelected[0].deptId
        } else {
          flowDpIdJson[value.nodeId] = value.startAuditList.userSelected[0].deptId
        }
      }
    })
    if (JSON.stringify(chooseFlowUserJson) != "{}") {
      state.chooseFlowUserJson = JSON.stringify(chooseFlowUserJson)
    }
    if (JSON.stringify(flowDpIdJson) != "{}") {
      state.flowDpIdJson = JSON.stringify(flowDpIdJson)
    }
  },
  saveFlowCommitTaskParams(state){
    let params = {}
    if(state.isFree == '0' || state.isFree == '3'){
      params['flowId'] = state.flowId
      params['currentNodeId'] = state.currentNodeId;
      if (state.appointNodeAndUserVOList.length) {
        params['flowChioseNodeAuditUserJson'] = JSON.stringify(state.flowChioseNodeAuditUserJson);
      }
      if(state.isFree == '0' && state.FlowAuditUser.length){
        let userSelected = state.FlowAuditUser[0].startAuditList.userSelected;
        // 有选处理人时
        if(userSelected.length) {
          if (state.FlowAuditUser[0].isChoise == "0" || state.FlowAuditUser[0].isChoise == "2") {
            params['chooseFlowUser'] = stringUserIds(userSelected);
          }
          if (state.FlowAuditUser[0].audtiFlag == "2") {
            params['flowDpId'] = userSelected[0].deptId;
          }
        }
      }
      if (state.isFree == '3'){
        params['nextNodeId'] = state.nextNodeId;
        if (state.isBranchNode) {
          params['templateRefId'] = state.templateRefId;
          params['parallelNextNodeIds'] = state.parallelNextNodeIds;
        }
        if (state.FlowAuditUser.length) {
          params['chooseFlowUser'] = state.chooseFlowUserJson;
          params['flowDpId'] = state.flowDpIdJson;
        }
      }
    }else{
      //自由流程的负责人
      params['incharges'] = stringUserIds(state.FlowAuditUser[0].startAuditList.userSelected)   // 新增时选择的处理人
    }
    state.commitTaskParams = params
  }
}

const getters = {
// 已选择的处理人id
  FlowAuditUserIds:(state)=>(index)=>{
    let ids=[]
    let checked = state.FlowAuditUser[index].startAuditList.userSelected
    // 如果用户有选择
    if(checked && checked.length) {
      // 如果是选择部门负责人
      if(state.FlowAuditUser[index].startAuditList.selectType.type==='dept'){
        ids=checked[0].deptId
      }
      // 如果是选择分组负责人
      if(state.FlowAuditUser[index].startAuditList.selectType.group && state.FlowAuditUser[index].startAuditList.selectType.type==='user'){
        ids=checked.map(item=>checked[0].deptId + item[state.FlowAuditUser[index].startAuditList.selectType.id])
      }
      if(!state.FlowAuditUser[index].startAuditList.selectType.group && state.FlowAuditUser[index].startAuditList.selectType.type==='user'){
        ids=checked.map(item=>item[state.FlowAuditUser[index].startAuditList.selectType.id])
      }
    }
    return ids
  },
  // 有下一步处理人，且不可选时，在详情上显示下一步处理人
  FlowAuditListShow(state){
    return state.FlowAuditList.length == 1 && state.FlowAuditList[0].nextAuditList.length && state.FlowAuditList[0].isChoise==='1'
  },
  //提交检验入参
  getIsCheckFlowUserConfirmParams(state){
    if(window.wxqyhConfig){
      return {
        creator :  window.wxqyhConfig.userId,
        isFree :  state.isFree,
        isBranchNode: state.isBranchNode,
        flowId: state.flowId,
        flowList : state.flowList,
        FlowAuditUser : state.FlowAuditUser,
        appointNodeAndUserVOList :state.appointNodeAndUserVOList
      }
    }
  },
  //查询下一节点入参
  findBranchFlowNextNodeInfoParams(state){
    return {
      initRefId: state.refId? state.refId:'',
      templateRefId: state.templateRefId,
      currentNodeId: (state.isBranchNode && state.defaultNextNodeId)? state.defaultNextNodeId:state.currentNodeId,
    }
  },
}

const actions = {
  // 获取部门负责人
  updateFlowUserSelected({commit},payload){
    if(payload.selectType==='dept'){
      axios.post(_.baseURL+'/portal/flow/flowAction!getFlowUserReceive.action',{
        dpId:payload.ids
      }).then((result)=>{
        if(result.code==="0"){
          commit('updateUserSelected',result.data.userList)
        }else {
          _.alert('', result.desc)
        }
      })
    }else {
      commit('updateUserSelected', payload.result)
    }
  },
  // 自由流程获取转审人员
  getApprove({commit, state}, id) {
    axios.post(_.baseURL+'/portal/workflowAction!getApprove.action',{
      id
    }).then((result)=>{
      _.hideLoading();
      if(result.code==="0"){
        this.commit('updateApproveVo',result.data)
      }else {
        _.alert("i18n.notice",result.desc);
      }
    })
  },
  updateFlowCommitTaskParams({commit},payload){
    if(payload.isFree === '3' && payload.FlowAuditUser.length){
      commit('saveChooseFlowUserJson')
    }
    commit('saveFlowCommitTaskParams')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
