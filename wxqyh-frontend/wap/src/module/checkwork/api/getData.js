import axios from 'axios';

// 获取查询参数
let search = (key, link = location.href) => {
  let reg = new RegExp('^[^\\?#]*\\?[^#]*?(|&)' + key + '=([^&#]*)'),
    match = link.match(reg);

  return match && match[2];
};

// 添加agentCode
let _parseURL = agentCode => {
  return link => {
    // agentCode不存在时不做任何修改
    if (!agentCode)
      return link;

    let temp = document.createElement('a');

    temp.href = link;
    if (temp.search) {
      temp.search = temp.search.replace(
        /(\?|&)agentCode=\w+|$/,
        '&agentCode=' + agentCode
      );
    } else {
      temp.search = '?agentCode=' + agentCode;
    }

    return link.split(/[\?#]/)[0] + temp.search + temp.hash;
  }
};

// 全局AGENT_CODE
window.AGENT_CODE = '';

// 封装接口方法
// params url: 接口url
// params isLoad：是否需要loading过程
// params agentCode：默认AgentCode
let getData = (() => {
  let agentCode = search('agentCode');

  // 目前仅限于党建应用会识别出agentCode参数
  if (agentCode !== 'partyconstruction') {
    agentCode = null;
  }

  window.AGENT_CODE = agentCode;
  window.parseURL = _parseURL(agentCode);

  return (url, isLoad = true, _agentCode) => {
    _agentCode = agentCode || _agentCode;

    const SUCCESS_CODE = '0';

    return (data, cb, errCb = null, showErrAlert = true, privateIsLoad = true) => {
      if (isLoad && privateIsLoad)
        _.showLoading('');

      if (_agentCode)
        data.belongAgent = _agentCode;

      axios.post(_.baseURL + url, { ...data })
        .then(result => {
          isLoad && privateIsLoad && _.hideLoading('');
          // 公共axios拦截错误在报错404时, 此函数依然会跑到result.code报错
          // 如果result为undefined 直接返回
          if (!result)
            return;

          if (result.code === SUCCESS_CODE) {
            cb && cb(result.data);
          } else {
            // 默认错误信息需要弹窗, 可设置无需弹窗
            if (showErrAlert) {
              _.alert('提示', result.desc, {
                primaryBtn: {
                  name: 'i18n.confirm',
                  callBack () {
                    if (errCb)
                      errCb(result);
                  }
                }, // 确认按钮
                defaultBtn: {
                  name: '',
                  callBack: null
                }//主操作按钮
              });
            } else {
              if (errCb)
                errCb(result);
            }
          }
        })
    }
  }
})();
// 判断图片上传方式
export function photoSetting(params){
  return axios.post(`${_.baseURL}/portal/intercalateAction!getPhotoSetting.action`,params);
}
/* 可以公用的 */
//加载迟到榜部门列表
let loadLaterDpt = getData('/portal/selectUserAction!getUserManageDept.action' ,false, 'checkwork');
//切换部门更新规则列表
let loadRuleList = getData("/portal/checkWorkCountCtrl/findCountRuleList.do" ,false, 'checkwork');
//检验是否生成日报
let checkHasDaily = getData("/portal/checkWorkDateCtrl/checkHasDaily.do" ,false, 'checkwork');
//申诉详情新增评论
let addCommentList = getData("/portal/checkWorkFormCtrl/commitCommonComment.do" ,false, 'checkwork');
//考勤详情新增评论
let checkDetailAddCommentList = getData("/portal/checkWorkFormCtrl/commitComment.do" ,false, 'checkwork');
//加载更多评论
let commentListMore = getData("/portal/checkWorkFormCtrl/listMoreComment.do" ,false, 'checkwork');
//删除评论
let deleteCommentList = getData("/portal/checkWorkFormCtrl/deleteComment.do" ,false, 'checkwork');
//加载上次负责人
let loadLastCharge = getData("/portal/checkworkAction!getDetailedToPerson.action" ,false, 'checkwork');
//判断审批人是否是部门负责人
let isOrNotCharge = getData("/portal/checkWorkFormCtrl/hasDepartToUser.do" ,false, 'checkwork');
//申诉审批
let repApproval = getData("/portal/checkWorkFormCtrl/auditRepresentations.do" ,false, 'checkwork');
//申诉详情加载
let repDetailShow = getData("/portal/checkWorkFormCtrl/viewRepCheckWorkInfo.do" ,true, 'checkwork');
//备注提交
let commitRemark = getData("/portal/checkworkAction!commremark.action" ,false, 'checkwork');
//规则详情加载
let ruleDetailShow = getData("/portal/checkWorkSignInCtrl/getRoleDetails.do" ,true, 'checkwork');
//排行榜点赞
let spotPraise = getData("/portal/checkWorkCountCtrl/spotPraise.do" ,true, 'checkwork');
//判断是否是部门负责人
let checkDepartManager = getData("/portal/checkWorkCountCtrl/checkDepartManager.do" ,false, 'checkwork');
//获取普通用户跳转排行榜初始的部门和规则数据
let getDeptAndRule = getData("/portal/checkWorkCountCtrl/obtainRankRuleList.do" ,false, 'checkwork');
//获取考勤日历接口
let getWorkCalendarDetail = getData("/portal/checkWorkDateCtrl/getWorkCalendarDetail.do" ,true, 'checkwork');
//获取某一天的考勤详情接口
let getOneDayCheck = getData("/portal/checkWorkDateCtrl/getOneDateCalendarInfo.do" ,false, 'checkwork');
//获取考勤详情数据
let getCheckDetail = getData("/portal/checkWorkDateCtrl/getDetail.do" ,true, 'checkwork');
//判断是否有权限进页面
let isHasPermission = getData("/portal/checkWorkCountCtrl/getHidePermisSetting.do" ,false, 'checkwork');

export{
  loadLaterDpt,
  loadRuleList,
  checkHasDaily,
  addCommentList,
  checkDetailAddCommentList,
  commentListMore,
  deleteCommentList,
  loadLastCharge,
  isOrNotCharge,
  repApproval,
  repDetailShow,
  commitRemark,
  ruleDetailShow,
  spotPraise,
  checkDepartManager,
  getDeptAndRule,
  getWorkCalendarDetail,
  getOneDayCheck,
  getCheckDetail,
  isHasPermission
}




