var dataBase={

	/*必配-start*/
	mask:false,//遮罩层控制
  isShow:true,
  config:'',//公共配置信息在执行登录验证时被赋值
  wxqyh_uploadfile:{ //当前应用名称
    agent:"ask",
  },
  /*必配-end*/
  ZIndex: {
    apply: false,
    review: false,
    related: false,
    curr: 'apply'
  },
  /**mobiscroll配置 */
  timePluginConf: function() {
    return {
      dateFormat:"yy-mm-dd",
      dateOrder:"yymmd D",
      dayText:"日",
      display:"bottom",
      endYear:2050,
      mode:"scroller",
      monthText:"月份",
      showNow: true,
      nowText: '今天',
      headText: '',
      stepMinute:5,
      theme:"android-holo light",
      yearText:"年份",
      cancelText: "确认",
      setText: "取消",
      showOnTap: false,
      showOnFocus: false,
      buttons: [//按钮配置，请勿改变顺序！
        'cancel','set']
    }
  },
  loading:{ //加载、提交成功、删除成功
    show:false,
    text:"",
    name:"",
  },
  dialogBottomConfig:{
    show: false, //控制弹窗显示与否
    title: "", //头部标题，设置为空的话不显示
    btnConfig:[] //自定义弹框操作,可以设置回调函数
  },
  selectConfig:{ //负责人、相关人
    show:false,
    signIndex:'',
    selectList: {
      "toPersonList": {
        "title": "负责人",
        "selectType": "user",
        "userName": "incharges",
        "userSelected": [],
        "deptSelectedShow": false,
        "callBack": {
          "confirm": null,
        }
      },
      "ccPersonList": {
        "title": "相关人",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "deptSelectedShow": false,
        "callBack": {
          "confirm": null,
        }
      },
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
    nav:[
      {class:"ic_add_apply", text:"新建请假", url:"add?leaveType=0"},
      {class:"ic_add_trip", text:"新建出差", url:"add?leaveType=1"},
      {class:"ic_add_work", text:"新建加班", url:"add?leaveType=2"},
      {class:"ic_draft", text:"草稿", url:"draft", num:""}
    ],
    homeFooterList:{
      nav_on:0,
      nav:[
        {
          class:"icon_tabar1",
          text:"我的申请",
          to: "apply",
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
          class:"icon_tabar2",
          text:"待我审批",
          to: "review",
          data:{ // 待我处理 type=2;status=0
            page:1,
            pageSize:10,
            keyWord:'',
            status:0,
            type:2
          },
          num:"",
          callBack:null
        },
        {
          class:"icon_tabar3",
          text:"我相关的",
          to: "related",
          data:{ // 我相关的 type=2;status=3
            page:1,
            pageSize:10,
            keyWord:'',
            status:3,
            type:2
          },
          callBack:null
        }
      ]
    },
  },
  // 新增、编辑页面
  draft: {
    //图片数据
    imgUpload: {
      picList: [],
      url: '/portal/imageupload/imageUploadAction!doUploadImageBase64.action'
    }
  },
  locationInfo: {
    showMap: false,
    start: {
      latitude: '',
      longitude: '',
      value: ''
    },
    end: {
      latitude: '',
      longitude: '',
      value: ''
    },
    curr: {
      latitude: '',
      longitude: '',
      value: ''
    }
  },
  openMap(flag) {
    this.locationInfo.showMap = true;
    if(flag == 0) { //start
      this.locationInfo.curr = this.locationInfo.start;
    }else if(flag == 1) {//end
      this.locationInfo.curr = this.locationInfo.end;      
    }
  }
};
export default dataBase;
