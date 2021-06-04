var dataBase={

  	/*必配-start*/
	mask:false,//遮罩层控制
  agent:'crm',
  loading:false,//loading控制
	isOverDue: false, //登录态弹窗
  	config:'',//公共配置信息
    /*必配-end*/

  // 表格头部数据
  middle:[
    {
      title:'编号',
      key:'siteOrginalId',
      width:100,
    },
    {
      title: '一级部门',
      key: 'parentDepartName',
      width:100,
    },
    {
      title:'二级部门',
      key:'departName',
      width:100,
    },
    {
      width:100,
      title:'招聘进度',
      key:'recruitStatus',
    },
    {
      title:'姓名',
      key:'personName',
      width:100,
    },
    {
      title:'年龄',
      key:'age',
      width:100,
    },
    {
      title:'工作年限',
      key:'workYear',
      width:100,
    },
    {
      title:'居住地',
      key:'addressNow',
      width:100,
    },
    {
      title:'学历',
      key:'topEdu',
      width:100,
    },
    {
      title:'手机',
      key:'mobile',
      width:120,
    },
    {
      title:'来源',
      key:'recruitSource',
      width:100,
    },
  ], 
  scheduleList:['未推送','已推送','待邀约','已邀约','初试通过','复试通过','已出OFFER','已入职','落选'],
  topEduBgList:['初中及以下','中专','高中','大专','本科','硕士','博士','其他']
};
export default dataBase;
