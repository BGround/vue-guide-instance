var dataBase={
	
	/*必配-start*/
	mask:false,//遮罩层控制
	loading:false,//loading控制
	isOverDue: false, //登录态弹窗
  	config:'',//公共配置信息
  	/*必配-end*/

  	//列表数据
	listdata : {
	  	param:{
	  	  	page:1,
	  	  	pageSize:15,
	  	  	subjectName:'',
	  	  	grandId:'',
	  	  	parentId:'',
	  	  	id:'',
	  	  	orderWay:'',
	  	  	freeYON:'',
	  	},
	  	isHideCategory:false,
	  	maxPage:1,
	  	totalRows:'',
	  	pageData:[],
	  	indexs:[],
	  	url:'/learnonline/subject/subjectAction!ajaxSubjectPager.action'
	},

	//详情页数据
	detailData:{
		param:{
			id:''
		},
	  	url:'/learnonline/subject/subjectAction!ajaxViewShopSubject.action',
	  	subject:{},
	  	selectedType:{
	  		id:'',
	  		name:'',
	  		isShow:false,
	  	},
	},
	
	//课程分类数据
	categoryData:{
  		data:{},
  		url:'/learnonline/subject/subjectAction!ajaxCategory.action'
	}
};
export default dataBase;