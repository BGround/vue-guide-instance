var dataBase={
	
	/*必配-start*/
	mask:false,//遮罩层控制
	loading:false,//loading控制
	isOverDue: false, //登录态弹窗 该页面是与jsp嵌套，暂时隐藏vue的弹窗
  	config:'',//公共配置信息
  	/*必配-end*/
	
	FORMTYPE: [ // 表单类型常量
		{ text: '普通单', value: '0' },
		{ text: '任务单', value: '1' },
		{ text: '审批单', value: '2' },
		{ text: '外部单', value: '3' }
	],
	FORMSTATUS: [ // 表单状态常量
		{ text: '已发布', value: '1' },
		{ text: '草稿', value: '2' },
		{ text: '禁用', value: '-1' }
	],
	FORMBELONG: [ // 表单归属常量
		{ text: '我创建的', value: '1' },
		{ text: '我授权的', value: '2' },
		{ text: '授权给我的', value: '3' }
	],
	GROUPBELONG: [ // 分组归属常量
		{ text: '我创建的', value: '1' },
		{ text: '共享给我的', value: '3' }
	]
};
export default dataBase;