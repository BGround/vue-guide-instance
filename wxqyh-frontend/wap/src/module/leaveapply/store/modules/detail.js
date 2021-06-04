import axios from 'axios'
const updateArray = (data,arr) => {
  data.length=0
  data.push(...arr)
}
const defaultData = {
  detailData: {},       // 详情数据
  mediaList:[],           // 附件信息
  detailTitleData:null,   // 头部信息
  FlowAudit:null,         // 当前节点的详细信息
  approveVo:null,         // 自由流程获取转审人员
  approveDialogShow: false, // 审批弹窗
}

const state = {
  ...defaultData
}
const mutations = {
  // 更新详情信息
  updateDetailData(state, payload) {
    state.detailData = Object.assign({},payload)
  },
  // 更新附件信息
  updateMediaList(state, payload) {
    updateArray(state.mediaList,payload)
  },
 
  // 更新头部
  updateTitleData(state, payload) {
    if(!payload.detail) {return}
    let detail = payload.detail
    let data =  {
      openPrint: true,
      status: detail.titleStatus,
      mediaList: payload.mediaList, //上传的附件列表
      creator:{
        userId:detail.creator,
        personName:detail.personName,
        headPic:detail.headPic,
        createPerson:detail.creator,
      } ,
      title: detail.title,
      auditStatus: detail.auditStatus,
      createTime: detail.createTime,
      personName: detail.personName,
      content: detail.content,
      picList: detail.picList, //上传的图片列表
      orgId: detail.orgId,
      configCopy:  detail.configCopy, // 复制
      configEdit:  detail.configEdit, //  编辑
      describes: detail.describes    
    }
    state.detailTitleData = Object.assign({},data)
  },

  // 重置详情数据
  resetDetailData(state, payload) {
    Object.assign(state, defaultData)
  }
}

const actions = {
  // 固定、分支点击操作
  updateAuditStatus({commit,state}, {...data}) {
    let {callback, ...commitData} = data
    _.showLoading('')
    axios.post(_.baseURL + '/portal/ask/updateAuditStatus.do', {
      ...commitData
    }).then((res) => {
      _.hideLoading()
      if(res.code === "0"){
        _.tooltips_succeed('操作成功')
        callback(res)
      }else {
        _.alert("i18n.notice", res.desc || '操作失败')
      }
    })
  },

  // 自由转审点击操作
  addApprove({commit,state}, {...data}) {
    let {callback, ...commitData} = data
    _.showLoading('')
    axios.post(_.baseURL + '/portal/workflowAction!addApprove.action', {
      ...commitData
    }).then((res) => {
      _.hideLoading()
      if(res.code === "0"){
        callback(res)
      }else {
        _.alert("i18n.notice", res.desc || '操作失败')
      }
    })
  },

  // 自由非转审点击操作
  updateFreeAuditStatus({commit,state}, {...data}) {
    let {callback, ...commitData} = data
    _.showLoading('')
    axios.post(_.baseURL + '/portal/ask/updateFreeAuditStatus.do', {
      ...commitData
    }).then((res) => {
      _.hideLoading()
      if(res.code === "0"){
        _.tooltips_succeed('操作成功')
        callback(res)
      }else {
        _.alert("i18n.notice", res.desc || '操作失败')
      }
    })
  },

  // 加签
  assignAudit({commit,state}, {...data}) {
    let {callback, ...commitData} = data
    _.showLoading('正在加签')
    axios.post(_.baseURL + '/portal/ask/addParallelCountersignType.do', {
      ...commitData
    }).then((res) => {
      let msg = commitData.type == 1 ? '加会签成功，您可以继续处理表单' : commitData.type == 2 ? '加前签成功，需等待前签人员处理' : commitData.type == 3 ? '加后签成功，当前节点处理后自动流转' : '操作成功'
      _.hideLoading()
      if(res.code === "0"){
        _.tooltips_succeed(msg)
        callback(res)
      }else {
        _.alert("i18n.notice", res.desc || '操作失败')
      }
    })
  },
}

const getters = {
}

export default {
  state,
  mutations,
  actions,
  getters
}
