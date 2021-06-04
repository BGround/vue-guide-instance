import axios from 'axios';
const SUCCESS_CODE = '0';


function getData(url,flag,method='post',loading = true){
	return async(data,callback) => {
		loading?_.showLoading(''):'';
		if(method === "post"){
			axios.post(_.baseURL+url,data).then(result => {
				_.hideLoading();
				result&&result.code == SUCCESS_CODE?callback&&callback(result.data):flag?_.alert('提示',result.desc):'';
			}).catch(err=>{
				_.hideLoading();
			});
		}else{
			axios.get(_.baseURL+url,{params:data}).then(result =>{
				_.hideLoading();
				result&&result.code == SUCCESS_CODE?callback&&callback(result.data):flag?_.alert('提示',result.desc):'';
			}).catch(err=>{
				_.hideLoading();
			});
		}
	}
};



// 今日生日，入职周年人数
const getCareCount = getData('/portal/dynamicinfoPortalCtl/getCareCount.do');

// 生日信息是否完善
const hasSetBirth = getData('/portal/empinfPortalCtl/hasSetBirth.do');

// 人事待办
const listMyHrTip = getData('/portal/empinfPortalCtl/listMyHrTip.do');

// 工資條
const getDetailList = getData('/portal/groupsendAction!getDetailList.action');

// 花名册
const getMyOrgEmpStatic = getData('/portal/empinfPotalAction!getMyOrgEmpStatic.action',false)

// 待转正列表
const listWaitRegular = getData('/portal/empinfPortalCtl/listWaitRegular.do');

// 合同到期列表
const listWillExpContract = getData('/portal/empinfPortalCtl/listWillExpContract.do');

// 证书到期列表
const listWillExpCert = getData('/portal/empinfPortalCtl/listWillExpCert.do');

// 设置生日信息
const setBirth = getData('/portal/empinfPortalCtl/setBirth.do');

// 待我考核列表
const findMarkList = getData('/portal/portalHrMarkAction!findMarkList.action');

//评分人员列表
const pageFindMarkTarget = getData('/portal/portalHrMarkAction!pageFindMarkTarget.action');

// 完成评分人员列表
const getTargetPersonList = getData('/portal/portalHrMarkAction!getTargetPersonList.action');
// 成员属性设置
const viewSetting = getData("/portal/empinfPotalAction!viewSetting.action");

// 获取员工绩效档案列表
const findResultMarkList = getData('/portal/portalHrMarkAction!findResultMarkList.action?');

// 获取员工考核结果
const getResultList = getData('/portal/portalHrMarkAction!getTargetList.action');

// 获取人事档案统计权限
const isPowerSearch = getData('/portal/empinfPotalAction!isPowerSearch.action');

// 获取“我的”信息
const viewMyInfo = getData("/portal/empinfPotalAction!viewMyInfo.action");

// 查询人事列表查看权限
const listEmployeeUnderDept = getData("/portal/empinfPotalAction!listEmployeeUnderDept.action")

// 查询人事列表数据
const getDeptList = getData("/portal/empinfPotalAction!getDeptList.action")

// 查询用户部分信息和昨日考勤信息
const getYesterdayWorkStatus=getData("/portal/checkWorkCountCtrl/getYesterdayWorkStatus.do")

// 首页员工关怀列表展示
const getNewestCareList=getData("/portal/dynamicinfoPortalCtl/getEmpCareCommentList.do",false,'get')

// 功能指引查询
const functionGuide = getData("/portal/functionGuidePortalCtl/getFunctionGuide.do",false,"get")

// 功能指引关闭
const closeFunctionGuide = getData("/portal/functionGuidePortalCtl/updateFunctionGuide.do",false,"post")
// 查询全部员工关怀列表信息
const findAllCareList=getData("/portal/dynamicinfomanage/dynamicinfomanageAction!ajaxTemplateNews.action",false,'post',false)

// 点赞
const changePraise=getData("/portal/dynamicinfo/dynamicinfoAction!setPraise.action",false,'post',false);
// 获取考核列表数据
const getCheckList = getData("/portal/portalHrMarkCtl/viewPersonScoreList.do",false,'post',false)

// 关注个税抵扣
const attentionTax = getData("/portal/portalTaxController/attentionTax.do",false,'get',false)
// 判断是否关注个税抵扣
const isAttentionTax = getData("/portal/portalTaxController/isAttentionTax.do",false,'get',false)
// 获取个税抵扣二维码
const getImgFileURL = getData("/portal/portalTaxController/getImgFileURL.do",false,'get',false)
// 个税专项扣除开关
const getMenuListSetting = getData('/portal/portalHrCtl/hrMenuSetting/getMenuListSetting.do');

//反馈来源
const managesetting = getData("/portal/managesetting!ajaxIsManager.action",false,'get',false)
// 获取是否安装了云办公服务
const getIsHasOffice=getData("/portal/application/application!ajaxIsTrustAgentListForPortal.action",false,'get',false);

// 查看个人资料
const viewPersonalInfo = getData("/portal/empinfPotalAction!viewInfoById.action");

//未评分
const loadForMark = getData("/portal/portalHrMarkAction!loadForMark.action",true);

//已评分
const findMarkDetail = getData("/portal/portalHrMarkAction!findMarkDetail.action");
//是否已完成评分
const checkIsMark = getData("/portal/portalHrMarkAction!checkIsMark.action");
//提交评分
const doMark = getData("/portal/portalHrMarkAction!doMark.action",true);

// 获取动态码查看工资条开关
const getDynamicCode = getData('/portal/portalGroupsendCtl/queryOpen.do');

// 更新动态码查看工资条开关
const updateDynamicCode = getData('/portal/portalGroupsendCtl/updateOpen.do');

//查看流程
const findFlowByMarkId = getData('/portal/portalHrMarkCtl/findFlowByMarkId.do');
//反馈历史
const feedbackList = getData('/portal/portalForm/getOpenFormForDo1FeedBack.do');

export{
	getCareCount,
	hasSetBirth,
	listMyHrTip,
	getDetailList,
	getMyOrgEmpStatic,
	listWaitRegular,
	listWillExpContract,
	listWillExpCert,
	setBirth,
	findMarkList,
	findResultMarkList,
	isPowerSearch,
	viewMyInfo,
	viewSetting,
	listEmployeeUnderDept,
	getDeptList,
	getYesterdayWorkStatus,
	getNewestCareList,
	findAllCareList,
	changePraise,
	getCheckList,
	managesetting,
	functionGuide,
	closeFunctionGuide,
	attentionTax,
	isAttentionTax,
	getImgFileURL,
	getMenuListSetting,
	getIsHasOffice,
  getDynamicCode,
  updateDynamicCode,
  pageFindMarkTarget,
  getResultList,
  getTargetPersonList,
  viewPersonalInfo,
  loadForMark,
  checkIsMark,
  findMarkDetail,
  doMark,
  findFlowByMarkId,
  feedbackList,
}

