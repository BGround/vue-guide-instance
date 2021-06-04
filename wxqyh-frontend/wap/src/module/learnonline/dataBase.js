var dataBase = {

  /*必配-start*/
  mask:false,//遮罩层控制
  isShow:false,
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"learnonline",
  },
  /*必配-end*/
  loading:{ //加载、提交成功、删除成功
    show:false,
    text:"",
    name:"",
  },
  selectConfig:{ //负责人、相关人
    show:false,
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

  // 需要公用的数据
  home:{
    // 首页底部菜单
    footerListData:{
      nav:[
        {
          icon: "icon-peixunxuexi_xuexirenwuon",
          tab: "学习任务",
          routerName: "learning_tasks",
		  index: 0,
		  isOpen:true,
        },
        {
          icon: "icon-peixunxuexi_kaoshioff",
          tab: "考试",
          routerName: "examination",
		  index: 1,
		  isOpen:true,
        },
        {
          icon: "icon-peixunxuexi_zhibooff",
          tab: "直播",
          routerName: "liveplay_list",
		  index: 2,
		  isOpen:true,
        },
        {
          icon: "icon-peixunxuexi_faxianoff",
          tab: "发现",
          routerName: "mall_list",
		  index: 3,
		  isOpen:true,
        },
        {
          icon: "icon-peixunxuexi_wodeoff",
          tab: "我的",
          routerName: "my_relavent",
		  index: 4,
		  isOpen:true,
        }
      ]
    },
  },
  /*课程商城页面*/
  mallList: {
    /*无数据设置*/
    hasRecord: {
      show: false,
      icon: 'qwui-icon_text',
      setTop: true, //居中显示
      title: '暂无课程',
      // text: '在管理平台 培训学习->开课管理 进行开课'
    }
  },
  /*学习任务页面*/
  learningTasks: {
    /*无数据设置*/
    hasRecord: {
      show: false,
      setTop: true,
      icon: 'qwui-icon_text',
      // setTop: true, //是否置顶?覆盖整个页面
      title: '暂无课程',
      text: '在管理平台 培训学习->开课管理 进行开课'
    }
  },

  /*我的 页面*/
  myRelavent: {
    /*功能列表入口设置*/
    entryList: [// @class：添加文字图标, 绑定类  @router用路由跳转, 默认直接跳转 @path跳转路径
      {class: 'recentStudy', text: '最近学习', path: 'myStudy', router: true, routerName: 'learning_tasks',},
      {class: 'testRecord', text: '考试记录', path: 'examRecord', router: true, routerName: 'exam_record',},
      {class: 'readRecord', text: '阅卷记录', path: 'markingRecord', router: true, routerName: 'marking_record'},
      {class: 'quickExperience', text: '快速体验', path: 'quickExperience', router: true, routerName: 'quick_experience'},
      {class: 'problemFeedback', text: '问题反馈', path: 'http://xiongyajun.nat300.top/wxqyh/vp/module/form.html?agentCode=form&corp_id=wwa13c466934d601d9#/open/add?id=formd03cc6beb2d74b25a5a30eab941ceed3&agentCode=form&corp_id=wwa13c466934d601d9', otherModule: true}, // otherModule跳转其他模块/页面
	],
	diyMenu:[
		{
			routerName: "learning_tasks",
			icon:'img_a-profile_task',
			text:'学习任务',
			isOpen:true,
		},
		{
			routerName: "mall_list",
			icon:'img_a-profile_found',
			text:'发现',
			isOpen:true,
		},
		{
			routerName: "examination",
			icon:'img_a-profile_exam',
			text:'考试',
			isOpen:true,
		},
		{
			routerName: "liveplay_list",
			icon:'img_a-profile_live',
			text:'直播',
			isOpen:true,
		},
		{
			routerName: "my_relavent",
			icon:'img_a-profile_mine',
			text:'我的',
			isOpen:true,

		},

	]
  },

  /*我的学习 页面*/
  myStudy: {
    /*tab选项卡设置*/
    selectData: {
      index: 0,
      scroll: true,//是否开启滚动置顶功能
      nav: [  //@data：点击切换传递的数据
        {content: '学习中', data: {state: 1}},
        {content: '已完成', data: {state: 5}}
      ]
    },
    hasRecord: {
      show: false,
      setTop: true,//是否置顶?覆盖整个页面
      icon: 'qwui-icon_text',
      title:'暂无学习记录',//若text无内容则title为16px #bbb
      text: '快去首页选课学习吧'
    }
  },

  /*搜索 页面*/
  search: {
    /*搜索框设置*/
    searchBar: {
      show: true,//默认显示
      keyWord: '',
      moreFunction: {
        show: true,
        option: [
          {name: '课程', callback: null, placeholder: '搜索课程', value: 0},
          {name: '直播', callback: null, placeholder: '搜索直播', value: 1},
          {name: '考试/练习', callback: null, placeholder: '搜索考试/练习', value: 2}
        ]
      },
      rightSpan: {
        show: true
      }
    },

    /*课程tab选项卡设置*/
    coursesTabData: {
      index: 0,
      scroll: true,//是否开启滚动置顶功能
      nav: [
        {content: '课程'},
        {content: '学习任务'}
      ]
    },
    /*考试tab选项卡设置*/
    practiceTabData: {
      index: 0,
      scroll: true,//是否开启滚动置顶功能
      nav: [
        {content: '待考试'},
        {content: '已考试'},
        {content: '练习'}
      ]
    },

    /*无数据设置*/
    hasRecord: {
      /*搜索课程无数据设置*/
      courses: {
        show: false,
        icon: 'qwui-icon_search',
        title: '无搜索内容',
        text: '',
        setTop: true,
      },
      /*搜索直播无数据设置*/
      live: {
        show: false,
        icon: 'qwui-icon_search',
        title: '无搜索内容',
        text: '',
        setTop: true,
      },
      /*搜索考试/练习无数据设置*/
      practice: {
        show: false,
        icon: 'icon_search_noCourse',
        title: '暂无考试',
        text: '在管理平台 考试评测->考试管理 创建考试',
        setTop: true,
      }
    }
  }
};

// 修改底部导航栏
(function () {
  if (window.AGENT_CODE === 'partyconstruction') {
    let _dataBase = dataBase.home.footerListData,
      nav = _dataBase.nav;

    _dataBase.nav = [nav[0], nav[1], nav[4]];
  }
})();

export default dataBase;
