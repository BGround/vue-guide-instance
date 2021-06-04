/**
 * Created by linyue on 2017/10/20.
 */
import baseURL from './baseURL_config'
import trusteeship from './trusteeship.js'
var config = {}
//axios兼容ie以及低版本的安卓或ios
import promise from 'es6-promise'
import { readyWxqyhConfigRun, wxqyhConfigReadyFunction } from './init-vip'
promise.polyfill()
import axios from 'axios'
//axios兼容参数转字符
import Qs from 'qs'
// 请求前的参数处理
axios.defaults.transformRequest = [
  function(data) {
    if(data instanceof FormData){
      return data;
    }
    data = Qs.stringify(data)
    if (
      window.document.location.href.indexOf('vpModule.html') != '-1' &&
      data.indexOf('requestSource') == '-1'
    ) {
      data += data ? '&requestSource=1' : 'requestSource=1'
    }
    return data
  }
]
// 响应拦截
axios.interceptors.response.use(
  function(response) {
    // 处理响应数据
    try {
      if (typeof JSON.parse(response.request.response) != 'object') {
        window.location.href = baseURL + '/manager/login.jsp'
      }
      if (response.data.code === '-10101') {
        //跳转到指定错误界面
        window.location.href = baseURL + response.data.data
      }
      return response.data
    } catch (e) {
      window.location.href = baseURL + '/manager/login.jsp'
    }
  },
  function(response) {
    if (response.request.status == 0) {
      window.location.href = baseURL + '/manager/login.jsp'
    } else {
      var _qwy_ = new qwy()
      _qwy_.alert('提示', '网络错误')
    }
  }
)
//axios兼容参数转formData
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
}

// 执行登陆验证
window.getLoginMessagePromise = function() {
  var p = new Promise(function(resolve, reject) {
    getLoginMessage(resolve)
  })
  return p
}

/**
 * 保持session心跳
 * @param linkTime 单位：毫秒，重新请求间隔，默认300000（5分钟）
 * @param maxSessionCounts 最大请求次数，默认60次
 */
function continueSession(linkTime, maxSessionCounts) {
  if (!linkTime) {
    linkTime = 300000 //默认5分钟请求一次
  }
  if (!maxSessionCounts) {
    maxSessionCounts = 60
  }
  var continueSessionCounts = 0,
    myContinueSession
  myContinueSession = setInterval(function() {
    if (continueSessionCounts > maxSessionCounts) {
      clearInterval(myContinueSession)
    } else {
      axios({
        method: 'post',
        url: baseURL + '/cooperation/cooperationAction!continueSession.action'
      })
        .then(response => {
          continueSessionCounts = continueSessionCounts + 1
          if (response.code == '800000003') {
            // 避免嵌套jsp出现两个弹窗 判断vue是不是最顶层
            if (self == window.top) {
              dataBase.isOverDue = true
            }
          }
        })
        .catch(() => {
          continueSessionCounts = continueSessionCounts + 1
        })
    }
  }, linkTime) //每5分钟执行一次
}

//判断登录成功还是未登录
function getLoginMessage(resolve) {
  let pathObj = {
    'cooperative.html': 'content'
  }
  for (let key in pathObj) {
    window.location.href.includes(key) ? trusteeship(pathObj[key]) : ''
  }
  // 过滤登陆页面
  var locationStr = window.document.location.href
  if (locationStr.indexOf('/manager/login.jsp') == '-1') {
    //外部页面，不需要登录
    if (window.location.href.indexOf('/open') != -1) {
      resolve()
    } else if (locationStr.indexOf('vpModule.html') != '-1') {
      axios({
        method: 'post',
        url: baseURL + '/portal/wxqyhLoginCtrl/getPortalUserInfoForMgr.do'
      }).then(function(response) {
        if (response) {
          config = response.data
          config.logo = {
            copyright: '' + new Date().getFullYear()
          }
          for (var v in config) {
            qwy.prototype[v] = config[v]
          }
          var _qwy = new qwy()
          window._qwy = _qwy
          window._ = _qwy
          dataBase.loading = false
        }
      })
    } else {
      initWxqyhConfig(resolve)
    }
  } else {
    for (var v in config) {
      qwy.prototype[v] = config[v]
    }
    var _qwy = new qwy()
    window._qwy = _qwy
    window._ = _qwy
    dataBase.loading = false
  }
}

//===============默认信息=============================
var title_model = '奇瑞经销商全生命周期渠道管理平台'
var title_qw_manager_coop = title_model //企业微信应用管理平台
var title_qw_qwweb = title_model //企业微信应用个人网页版
var title_qw_qwweb_coop = title_model //企业微信应用个人网页版

var logoUrl = '/manager/images/logo.png'
var copyright = '版权所有 奇瑞汽车股份有限公司 皖ICP备05009427号-10 ' //+new Date().getFullYear();
var welcomeImgurl = '/manager/images/welcome_img.png'
//var managerLoginurl= _.qwyURL;

var personwebLogourl = '/qwweb/images/left_logo.png'
var personwebWelcomeurl = '/qwweb/welcom.jsp'

//var personwebLoginurl = _.qwwebURL;
var personwebHelpintroductionurl =
  'http://mp.weixin.qq.com/s?__biz=MzA3ODk1MDcwMw==&mid=200979651&idx=1&sn=cb07c72aefba5acaba19bd8e84b5eb9d'

//=========
var spaceBuyURL = baseURL + '/qiweipublicity/companysrv/space/space_index.jsp'
var spactTixingCount = 0 //统计提醒的次数
var isCoop = false //是不是合作商
var coopType = 0 //0-企微用户；1-渠道商；2-金卡
var isShowQw = true
function getLogoAndCopyright(config) {
  axios
    .post(
      _.baseURL + '/cooperation/cooperationAction!getLogoAndCopyright.action'
    )
    .then(function(response) {
      qwy.prototype.logo = setLogoValue(response.data.logo)
      config.logo = setLogoValue(response.data.logo)
      dataBase.config = config
      //显示title名字
      if (isCoop && _.logo.cooperationSettingVO.cooperName) {
        window.document.title =
          _.logo.cooperationSettingVO.cooperName + '—' + title_qw_qwweb_coop
      } else {
        window.document.title = '' + title_qw_qwweb
      }
    })
    .catch(function(error) {})
}
function setLogoValue(logo) {
  var cooperationSettingVO = logo.cooperationSettingVO
  if (cooperationSettingVO && cooperationSettingVO.status == '1') {
    isCoop = true
    if (cooperationSettingVO.type == '1') {
      coopType = 1
    } else if (cooperationSettingVO.type == '2') {
      coopType = 2
    }
    if ('1' != cooperationSettingVO.isShowQw) {
      isShowQw = false
    }
  }

  //使用自定义显示，如果没有设置，用默认的
  if (!isCoop || cooperationSettingVO.logoUrl == '') {
    logo.logoUrl = logoUrl
  } else {
    logo.logoUrl = cooperationSettingVO.logoUrl
  }

  if (!isCoop || cooperationSettingVO.copyright == '') {
    logo.copyright = copyright
  } else {
    logo.copyright = cooperationSettingVO.copyright
  }

  if (!isCoop || cooperationSettingVO.welcomeImgurl == '') {
    logo.welcomeImgurl = welcomeImgurl
  } else {
    logo.welcomeImgurl = cooperationSettingVO.welcomeImgurl
  }

  if (!isCoop || cooperationSettingVO.personwebLogourl == '') {
    logo.personwebLogourl = personwebLogourl
  } else {
    logo.personwebLogourl = cooperationSettingVO.personwebLogourl
  }

  if (
    !isCoop ||
    cooperationSettingVO.personwebWelcomeurl == '' ||
    cooperationSettingVO.type == '2'
  ) {
    logo.personwebWelcomeurl = personwebWelcomeurl
  } else {
    logo.personwebWelcomeurl = cooperationSettingVO.personwebWelcomeurl
  }

  if (!isCoop || cooperationSettingVO.personwebLoginurl == '') {
    logo.personwebLoginurl = _.qwwebURL
  } else {
    logo.personwebLoginurl = cooperationSettingVO.personwebLoginurl
  }

  if (!isCoop || cooperationSettingVO.managerLoginurl == '') {
    logo.managerLoginurl = _.qwyURL
  } else {
    logo.managerLoginurl = cooperationSettingVO.managerLoginurl
  }

  if (!isCoop || cooperationSettingVO.personwebHelpintroductionurl == '') {
    logo.personwebHelpintroductionurl = personwebHelpintroductionurl
  } else {
    logo.personwebHelpintroductionurl =
      cooperationSettingVO.personwebHelpintroductionurl
  }
  return logo
}

//初始化配置信息，isRefresh 是否强制刷新
function initWxqyhConfig(resolve) {
  return axios
    .post(baseURL + '/vip/vipAction!wxqyhConfig.action')
    .then(function(result) {
      if (result.code == '0') {
        window.wxqyhConfig = result.data
        window.wxqyhConfig.config_state = 5 //表示已经初始化完成
        window.wxqyhConfig.ready = wxqyhConfigReadyFunction
        readyWxqyhConfigRun()
        config = result.data
        config.logo = {
          copyright: '' + new Date().getFullYear()
        }
        for (var v in config) {
          qwy.prototype[v] = config[v]
        }
        var _qwy = new qwy()
        window._qwy = _qwy
        window._ = _qwy
        getLogoAndCopyright(config)
        continueSession() // 执行心跳
        dataBase.loading = false
        resolve()
      } else if (result.code == '-1') {
        _.alert('提示', '系统出现异常，请重试')
        wxqyhConfig.config_state = -1
      }
    })
}
