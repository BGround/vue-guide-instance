var dataBase={
  /*必配-start*/
  mask:false,//遮罩层控制
  isShow:false,
  loading:{
    show: false,
    text: "",
    icon: "",
  },//加载、提交成功、删除成功
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"checkwork",
  },
  /*必配-end*/
  dialogConfig:{    //弹窗对话框
    show:false,
    title:"",//标题
    type:"",
    content:[],//中间自定义内容
    canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig:{
      primaryBtn:{name:"", callBack:null}, //主操作按钮
      defaultBtn:{name:"", callBack:null}, //次操作按钮
    }
  },
  selectConfig:{ //负责人、相关人
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
        }
      },
      "ccPersonList": {
        "title":"",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "deptSelected":[],
        "deptSelectedShow": false,
        "callBack": {
          "confirm": null,
        }
      },
    }
  },
  //首页
  home:{
    //加载更多组件
    loadMore:{
      url:"/portal/checkWorkFormCtrl/representationsList.do",     //请求路径
      pageIndexName:"page",
      data:{ //ajax入参数据

      },
      padeConfig:{
        currPage:"",
        maxPage:"",
        pageData:[],  //返回的列表数据
        totalRows:""//数据总条数s
      },
      hasRecord:{
        show:false,
        setTop:false,//是否置顶?覆盖整个页面
        icon:'',
        title:'',//若text无内容则title为16px #bbb
        text:''
      },
    },
  },
  //底部菜单栏
  bottomMenu:[
    {
      icon: "ic_tabbar_today_on",
      tab: "今日考勤",
      routerName: "",
      index:0,
    },
    {
      icon: "icon_tabbar_tongji_off",
      tab: "统计",
      routerName: "",
      index:1,
    },
    {
      icon: "ic_tabbar_shensu_off",
      tab: "我的申诉",
      routerName: "",
      index:2,
    },
    {
      icon: "ic_tabbar_xiangguan_off",
      tab: "相关",
      routerName: "",
      index:3,
    }
  ],
  todayCheck:{
    markItem:{},
    submitItem:{},//待提交的考勤参数
    nowRule:{
      id:"",
      item:{

      }
    },
    showNowTimeOne:{
      totalNum:""
    },
    getCheckRuleListUrl:"/portal/checkWorkSignInCtrl/getRoleList.do",//获取今日考勤考勤规则
    submitSignUrl:"/portal/checkWorkSignInCtrl/addsignin.do",//提交打卡信息
    getRuleDetail:"/portal/checkWorkSignInCtrl/getRoleDetails.do",//获取规则详情
    getMoreFreeDetail:"/portal/checkWorkSignInCtrl/getFreeOtherDetailInfo.do",//获取更多自由考勤记录
    getFreeMarkDetail:"/portal/checkWorkSignInCtrl/getRemark.do",//获取自由考勤备注详细信息
    addFreeSignUrl:"/portal/checkworkAction!addFreeSignin.action",//提交自由考勤签到信息
    shakeSignUrl:"/portal/checkworkAction!shakeAddSign.action"//提交摇一摇考勤接口
  },
  statistics:{
    totalDataUrl:"/portal/checkWorkCountCtrl/findManagerCountInfo.do",//统计主页整体数据接口
    memberListUrl:"/portal/checkWorkCountCtrl/findManagerCheckUserList.do",//统计各种类型人员列表数据接口
    getRankTopPermissionUrl:"/portal/checkWorkCountCtrl/findOrgRankSetting.do",//获取统计页面排行榜权限及开启状态
    getRuleList:"/portal/checkWorkCountCtrl/findCountRuleList.do",//获取考勤规则列表
    getDepartmentUrl:"/portal/selectUserAction!getUserManageDept.action",//获取部门负责人所管理部门
    getDeptForSearch:"/portal/selectUserAction!getUserManageDept.action",
    getDeptAndMember:"/portal/departmentAction!getChildDeptAndPerson.action",
    getSearchData:"/portal/selectUserAction!searchUserByNameAndManDept.action",//获取统计搜索数据
    getSearchKeyUrl:"/portal/selectUserAction!searchUserByNameAndManDept.action",
    isGoldVip:false,
    isManager:false,
    isOpenDiligenceSetting:false,
    diligentIsDisplay:false,
    isOpenEarlySetting:false,
    isOpenLaterSetting:false
  },
};

export default dataBase;
