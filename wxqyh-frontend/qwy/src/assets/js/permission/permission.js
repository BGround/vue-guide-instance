import baseURL from '@/assets/js/baseURL_config'

// 对比结果
function computeResult(result) {
  let resObj = {}
  result.data.list.map((item, idx) => {
    resObj[item.agentCode] = item
  })

  return resObj
}

// 获取托管状态
function getTrustApp(store, agentCode) {
  return new Promise((resolve, reject) => {
    let obj = {}
    let isTrue = agentCode.indexOf(',') === -1 // 单个应用为true,多个应用为false
    let url = isTrue
      ? `${baseURL}/application/application!ajaxIsTrustAgent.action`
      : `${baseURL}/application/application!ajaxIsTrustAgentList.action`
    let postData = isTrue ? { agentCode: agentCode } : { agentCodes: agentCode }

    obj.url = url
    obj.isTrue = isTrue
    obj.postData = postData
    obj.computeFunc = computeResult

    store
      .dispatch('header/setTrustApp', obj)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 处理路由
function dealRouter(obj) {
  let { to, next, from, store } = obj
  let { trustApp } = store.state.header
  if (to.meta.role) {
    // 已经托管的路由才进入，没有的就返回
    if (trustApp[to.meta.role]) {
      next()
    } else {
      next(from.path)
    }
  } else {
    // 沒有设置权限直接进入
    next()
  }
}

// 获取权限
function getPermission(obj) {
  let { to, next, from, store } = obj
  let trustAppData = Object.keys(store.state.header.trustApp)

  // 若vuex里面不存在权限数据，则请求权限数据
  if (trustAppData.length > 0) {
    dealRouter(obj)
  } else {
    window.getPerm = function() {
      return store.dispatch('header/setPermission').then(res => {
        getTrustApp(
          store,
          'activity,ask,addressBook,car,checkwork,crm,contract,' +
            'diary,dynamic,qydisk,express,examination,form,hrmanagement,learnonline,' +
            'moveapprove,meetingassistant,reimbursement,outsidework,productinfo,' +
            'sale,survey,task,topic,todo,' +
            'archives,archivesList,archivesBag,archivesMap'
        )
          .then(res => {
            dealRouter(obj)
          })
          .catch(err => {
            console.log(err)
          })
      })
    }
  }
}

export default getPermission
