var dataBase = {
	 /*必配-start*/
	 mask:false,//遮罩层控制
	 isShow:false,
	 config:'',//公共配置信息
	 wxqyh_uploadfile:{ //当前应用名称
	   agent:"hrmanagement",
	 },
	 /*必配-end*/
	 loading:{ //加载、提交成功、删除成功
	   show: false,
	   text: "",
	   icon: "",
	 },
	 dialogConfig:{    //弹窗对话框
		show:false,
		title:"",//标题
		type:"",
		content:[//中间自定义内容
		],
		canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
		btnConfig:{
		  primaryBtn:{name:"", callBack:null}, //主操作按钮
		  defaultBtn:{name:"", callBack:null}, //次操作按钮
		}
	  },
	//底部菜单栏
	bottomMenu:[
			{
			  icon: "icon_tabbar_work_on",
			  tab: "工作台",
			  routerName: "work_bench",
			  index:0,
			},
			{
			  icon: "ic_tabbar_assess_off",
			  tab: "绩效考核",
			  routerName: "performance_appraisal",
			  index:1,
			},
			{
			  icon: "ic_tabbar_record_off",
			  tab: "人事档案",
			  routerName: "archives",
			  index:2,
			},
			{
			  icon: "ic_tabbar_mine_off",
			  tab: "我的",
			  routerName: "myRelavent",
			  index:3,
			}
	],
	//员工关怀
	remind:[
		{
			num:24,
			text:'今日生日',
			icon:'pic_a-Shape'
		},
		{
			num:17,
			text:'入职周年',
			icon:'ic_a-gift'
		},
	],
	//人事待办
	entryList: [// @class：添加文字图标, 绑定类  @router用路由跳转,
		{class: 'ic_a-positive', text: '待转正', num:0,path:'/unfinished_matter'},
		{class: 'ic_a-contract', text: '合同到期',num:0,path:'/unfinished_matter'},
		{class: 'ic_a-certificate', text: '证书到期',num:0,path:'/unfinished_matter'}, 
	  ],
	//花名册
	roster:[
		{
			num:0,
			text:'在职员工',
			icon:'ic_a-onjob'
		},
		{
			num:0,
			text:'本月入职',
			icon:'ic_a-departure'
		},
		{
			num:0,
			text:'本月离职',
			icon:'ic_a-departure1'
		},
	],
	//考核结果列表默认配置
	params:{
		"page":1,
		"searchValue.name":'',
		"pageSize":3
	}
};

export default dataBase;