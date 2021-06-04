var dataBase = {
  mask:false,//遮罩层控制
  isShow:false,
  loading:{
    show:false,
    text:"",
    name:""
  },//加载、提交成功、删除成功
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"task",
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
  buttonConfig:{ //操作按钮
    primaryList:[
      {
        type:"primary",
        name:'立即提交',
        callBack:null
      },
    ],
    defaultList:[
      {type:"default",name:'保存草稿', callBack:null}
    ],
    class:"active"//按钮是否置底部 active :底部、"":相对定位
  },
  selectConfig3:{ //负责人
    show:false,
    signIndex:'',
    selectList:{
      "toPersonList": {
        "title":"",
        "selectType": "user",
        "userName": "incharges",
        "userSelected": [],
        "deptSelected":[],
        "deptSelectedShow": false,
        "callBack": {
          "confirm": null,
        },
      },
      type:'toPersonList',
      showContent:'负责人',
      showBtn:false,
    },
  },
  selectConfig2:{ //相关人
    show:false,
    signIndex:'',
    selectList:{
      "ccPersonList": {
        "title":"",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "deptSelectedShow": false,
        "callBack": {
          "confirm": null,
        }
      },
      type:'ccPersonList',
      showContent:'相关人',
    }
  },
  selectConfig:{ //相关人
    show:false,
    signIndex:'ccPersonList',
    selectList:{
      "ccPersonList": {
        "title":"",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "deptSelectedShow": false,
        "callBack": {
          "confirm": null,
        }
      },
      type:'ccPersonList',
      showContent:'相关人',
    }
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
  //首页
  home:{
    headData:{
      show:true,
      nav:[
        {class:"ic_add", text:"i18n.addHomework", url:"add"},
        {class:"ic_draft", text:"i18n.draft", url:"draft", num:""}
        ],
      searchBar:{
        show:true,//搜索框，默认显示
        rightSpan: {//右侧筛选框
          show: true,
          callback: null
        },
      }
    },
    searchFilterBar:{
      showSearchOrder: false,
      showSearchState: false,
      dataType: 'searchOrder',
      searchOrder: {
        activeIndex: 0,
        data: [
          {name: '发起时间降序', sortBy: 'createTimeDesc'},
          {name: '发起时间升序', sortBy: 'createTimeAsc'},
          {name: '优先级升序', sortBy: 'priorityAsc'},
          {name: '优先级降序', sortBy: 'priorityDesc'},
        ],
      },
      searchState: {
        activeIndex: 0,
        data: [
          {name: '全部', sortBy: 'all'},
          {name: '进行中', sortBy: '1'},
          {name: '已结束', sortBy: '2'},
          // {name: '逾期', sortBy: '5'},
        ],
      }
    },
    //加载更多组件
    loadMore:{
      url:"/portal/taskPortalCtl/searchTask.do",     //请求路径
      pageIndexName:"page",//不同应用不同分页参数
      data:{ //ajax入参数据
        sortBy: 'createTimeDesc',
        schType: 'myWait',
        'searchValue.status': 'all',
        'searchValue.keyWord': '',
        taskCloseType: 1,
        score: 10,
        taskStop: '',
        page: 1,
        dqdp_csrf_token: '1fd6472998fa81a0',
        // 'searchValue.creatorTime': '',
        // 'searchValue.filterLastIds': [],
      },
      padeConfig:{},
      hasRecord:{
        show: false,
        setTop: false,//是否置顶?覆盖整个页面
        icon: "qwui-icon_text",
        // title: "没有待处理任务啦，安心工作吧~",//若text无内容则title为16px #bbb，有则为18px #666
        text: "",//标题下面的提示
        operation: {
          // text: "暂无任务，马上",
          text: "暂无任务",
          callBack: null
        },
      },
      isToDraft: false, // 路由跳转进入草稿页，返回时候根据此数据判断是否将loadMore.data.schType变为myWait
    },

    // 相关页面菜单切换 未阅 type=2, status=3; 逾期 type=2, status=5; 已关闭 type=2, status=2
    selectData: {
      index:0,
      nav:[
        // {
        //   content: '我发起的',
        //   data:{ //点击切换传递的数据
        //     schType: 'myPub',
        //     // status:3,
        //     // typeId:'',
        //     // type:2,
        //     // keyWord:'',
        //     // page:1,
        //     // historyYear:'',
        //     // pageSize:20
        //   },
        // },
        {
          content: '我负责的',
          data:{ //点击切换传递的数据
            schType: 'myRes',
            // status:3,
            // typeId:'',
            // type:2,
            // keyWord:'',
            // page:1,
            // historyYear:'',
            // pageSize:20
          },
        },
        {
          content: '我相关的',
          data:{ //点击切换传递的数据
            schType: 'myRel',
            // status:4,
            // typeId:'',
            // type:2,
            // keyWord:'',
            // page:1,
            // historyYear:'',
            // pageSize:20
          },
        }
      ]
    },
    homeContentList: {
      dialogListConfig: { // 点状弹窗列表操作
        show: false,
        title: '',//头部标题
        btnConfig: []
      },
      delete:{ // 删除列表
        url:"/portal/homeworkAction!ajaxBatchDelete.action",
        checkUrl: "/portal/homeworkAction!ajaxBatchCheck.action",
        data:{}
      },
      updateHomeworkStop: { // 更新截止时间
        url: "/portal/homeworkAction!updateHomeworkStop.action?homeworkId=",
        data: {}
      },
      restartOrEndHomework:{ // 重启或结束作业
        url: "/portal/homeworkAction!updateHomeworkStatus.action",
        data:{}
      },
      indexCount:{ // 首页草稿、待办的数量
        url: "/portal/homeworkAction!findCount.action",
        data:{}
      }
    },
    homeFooterList: {
      nav_on:0,
      nav:[
        {
          class:"myWait",
          text:"待处理",
          type: "normal",
          data:{// 首页列表 type=1;status=1
            page:1,
            pageSize:10,
            keyWord:'',
            status:3,
            type:1
          },
          callBack:null
        },
        {
          class:"",
          text:"",
          type: "normal",
          data:{// 首页列表 type=1;status=1
            page:1,
            pageSize:10,
            keyWord:'',
            status:3,
            type:1
          },
          callBack:null
        },
        {
          class:"myRes",
          text:"我的",
          type: "normal",
          data:{ // 待我处理 type=2;status=0
            page:1,
            pageSize:10,
            keyWord:'',
            status:0,
            type:2
          },
          callBack:null
        },
      ]
    },
    dialogBottomConfig: {
      show: false, //控制弹窗显示与否
      title: "", //头部标题，设置为空的话不显示
      btnConfig:[],
      maskCallBack: null
    },
    popWindowConfig: {
      showWindow: false, // window显示与否
      curOperate: '', // 当前操作类型
      taskId: '', // 当前任务的id
      subtaskId: '', // 当前子任务的id
      subtaskList : [], // 子任务的list(当前为主任务)
      subtask: { // 子任务(当前为子任务(用于评分))
        score: 10,
        subTaskId: '',
        title: '',
        showSubTask: false,
      },
      reasonText: '',
      taskTitle: '', // 任务标题
      roleArr: [], // 角色
      isScore: 0, // 是否可以评分，0可以，1不可以
      endType: {
        showType: false,
        btnArray: ['完成', '终止', '取消', '拒绝'], // 结束类型按钮组
        btnActiveNum: 1,
      },
      score: {
        showScore: false,
        scoreNum: 10, // 评分分数
      },
      changeTime: {
        showTime: false,
        endTime: '',
        mainTaskTime: [],
        subTaskTimeEnd: [],
        subTaskTimeStart: [],
      },
      updateTask: {
        showUpadate: false,
        resetAll: false,
      },
    }
  },
  // 进度反馈详情数据
  rateDetailConfig:{
    isRateDetail:false,
    currentPersonName:'',
    currentRecipient:'',
    recipientId:'',
    currentUserId:'',
    currentIsOver:false,
    rateDetail:[],
    rateHandleShow:false,
    // allRateShow:false,
    firstLoading:true,
    lock_roll:false,
    hasMore:false,
    currentPage:1,
  },
  allRateShow:false,// 所有人进度列表显示
  firstLoading:true,
  hasMoreRate:true,// 加载更多
  subHasMoreRate:true,// 子任务进度加载更多
  rateCurrentPage:1,// 当前进度页数
  subRateCurrentPage:1,// 当前子任务进度页数
  rateLoading:false,// 加载中
  isMainIncharge:false,// 是否主任务的负责人
  oldRelative:[],// 旧相关人
  latestSubStopTime:'',// 最晚的子任务截止时间
  hasMore:false,// 主任务更多评论
  hasMoreOperation:false,// 主任务更多操作记录
  subCurrentPage:0,

  // lockLoading:false,
}
export default dataBase;
