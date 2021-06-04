import axios from 'axios'
const updateArray = (data,arr) => {
  data.length=0
  data.push(...arr)
}
const defaultData = {
  detailTitleData:null,   // 头部信息
  detailData: null,       // 详情数据
  mediaList:[],           // 附件信息
}

const state = {
  ...defaultData
}

const getters = {
  //判断报销详情的审批状态
  isMoveapproveStatus(state){
    return  state.detailData && (state.detailData.isover == -1 || state.detailData.status == 2 || state.detailData.isover === '0');
  },
  //判断借款详情的审批状态
  isDebitMoveapproveStatus(state){
    return  state.detailData && (state.detailData.isover == -1 || state.detailData.isover == 1 || state.detailData.isover === '0');
  }
}
const mutations = {
  // 更新详情信息
  updateDetailData(state,payload) {
    state.detailData = Object.assign({},payload)
  },
  // 更新相关人
  addCCPersonList(state,payload) {
    let ids = state.detailData.ccPersonList.map(value=>{
      return value.userId
    })
    ids=ids.join('|')
    payload.forEach(value=>{
      if(ids.indexOf(value.userId)>-1){return}
      state.detailData.ccPersonList.splice(0,0,value)
    })
  },
}

const actions = {
  // 按钮操作
  updataAuditStatus({commit,state},{...data}) {
    let {callback,...commitData}=data
    _.showLoading('')
    axios.post(_.baseURL+'/portal/reimPortalCtl/updateAuditStatus.do',{
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
  //借支按钮操作
  updataDebitAuditStatus({commit,state},{...data}) {
    let {callback,...commitData}=data
    _.showLoading('')
    axios.post(_.baseURL+'/portal/loan/loanPortalCtl/updateAuditStatus.do',{
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
    axios.post(_.baseURL+'/portal/reimPortalCtl/addCountersignType.do',{
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
