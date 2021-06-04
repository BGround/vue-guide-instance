import axios from 'axios';

const updateArray = (data,arr) => {
  data.length=0
  data.push(...arr)
}
const defaultData = {
  detailTitleData:null,   // 头部信息
  detail: null,       // 详情数据
  FlowAudit:null,         // 当前节点的详细信息
  approveVo:null,         // 自由流程获取转审人员
  approveDialogShow: false,     // 审批弹窗
}

const state = {
  ...defaultData
}

const getters = {
  //判断详情的审批状态
  isMoveapproveStatus(state){
    return  state.detail && (state.detail.isover == -1 || state.detail.auditStatus == 2 || state.detail.isover === '0')
  }
}
const mutations = {
  // 更新详情信息
  updateDetailData(state,payload) {
    state.detail = Object.assign({},payload)
  },
  // 更新头部
  updateTitleData(state,payload) {
    if(!payload.detail) {return}
    let detail = payload.detail
    let data =  {
      openPrint: true,
      status:{},
      mediaList: payload.mediaList, //上传的附件列表
      creator:{
        userId:detail.creator,
        personName:detail.personName,
        headPic:detail.headPic,
        createPerson:detail.creator,
      } ,
      tips: detail.typeName,
      title: detail.title,
      auditStatus: detail.auditStatus,
      createTime: detail.createTime,
      personName: detail.personName,
      content: detail.content,
      picList: detail.picList, //上传的图片列表
      orgId: detail.orgId
    }
    state.detailTitleData = Object.assign({},data)
  },
  //更新审批状态
  updateTitleStatus(state,payload) {
    Object.assign(state.detailTitleData.status,payload)
  },
  // 更新当前节点的详细信息
  updateFlowAudit(state,payload) {
    state.FlowAudit = Object.assign({},payload)
  },
  // 更新自由流程获取转审人员
  updateApproveVo(state,payload) {
    state.approveVo = Object.assign({},payload)
  },
  updateDialogShow(state,payload) {
    state.approveDialogShow = payload
  },
  // 重置详情数据
  resetDetailData(state,payload) {
    Object.assign(state,defaultData)
  }
}

const actions = {
  // 获取节点信息
  getDetail({commit},{id,callback=function () {}}){
    axios.post(_.baseURL+'/portal/contractAction!getContractDetail.action',{
      id,
    }).then((result)=>{
      _.hideLoading();
      if(result.code==="0"){
        this.commit('updateTitleData',result)
        this.commit('updateDetailData',result.data)
        callback()
      }else {
        _.alert("i18n.notice",result.desc);
      }
    })
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

  // 按钮操作
  updataAuditStatus({commit,state},{...data}) {
    let {callback,...commitData}=data
    _.showLoading('')
    axios.post(_.baseURL+'/portal/moveapprove/updataAuditStatus.do',{
      ...commitData
    }).then((result)=>{
      _.hideLoading();
      if(result.code==="0"){
        callback(result)
      }else {
        _.alert("i18n.notice",result.desc);
      }
    })
  },
  // 加签 @params:type/1前签/2加签类型，addCountersignPersons/处理人，reason/理由
  addCountersignType({commit,state},{isFree,type,addCounterSignPersonStr,reason,id,currentNodeId}) {
    _.showLoading('正在加签...')
    axios.post(_.baseURL+'/portal/moveapprove/addCountersignType.do',{
      isFree,type,addCounterSignPersonStr,reason,id,currentNodeId,
    }).then((result)=>{
      _.hideLoading();
      if(result.code==="0"){
        if(type=="1"){_.tooltips_succeed("加会签成功，您可以继续处理表单")}
        if(type=="2"){_.tooltips_succeed("加前签成功，需等待前签人员处理")}
        if(type=="3"){_.tooltips_succeed("加后签成功，当前节点处理后自动流转")}
        setTimeout(()=>{
          window.location.reload()
        },2000)
      }else {
        _.alert("i18n.notice",result.desc);
      }
    })
  },
  // 获取可退审节点  @refId @isBranch
  getFlowReturnAudit({commit,state},data) {
    let {callback,...commitData} = data
    axios.post(_.baseURL+'/portal/flow/flowParallel/getFlowReturnAudit.do',{
      ...commitData
    }).then((result)=>{
      if(result.code==="0"){
        callback(result.data)
      }else {
        _.alert("i18n.notice",result.desc);
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
