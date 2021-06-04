var dataBase={

    /*必配-start*/
    mask:false,//遮罩层控制
    isShow:false,
    config:'',//公共配置信息
    wxqyh_uploadfile:{ //当前应用名称
      agent:"crm",
    },
    /*必配-end*/
    loading:{ //加载、提交成功、删除成功
      show: false,
      text: "",
      icon: "",
    },
    selectConfig:{ //负责人、相关人
      show:false,
      signIndex:'',
      selectList:{
        "toPersonList": {
          "title":"负责人(可查看/修改)",
          "selectType": "user",
          "userName": "incharges",
          "userSelected": [],
          "deptSelected":[],
          "deptSelectedShow": false,
          "callBack": {
            "confirm": null,
          },
        },
        "ccPersonList": {
          "title":"相关人(可查看)",
          "selectType": "user",
          "userName": "relatives",
          "userSelected": [],
          "deptSelected":[],
          "deptSelectedShow": false,
          "userRestriction":"",
          "callBack": {
            "confirm": null,
          },
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
    crm:{
      headData:{
        show:true,
        nav:[
          {class:"ic_sea", text:"公海池", url:"poolList", name:"", value:""},
          {class:"ic_customer", text:"客户", url:"clientList", name:"notReadClientNum", value:"", params: 'isread'},
          {class:"ic_contact", text:"联系人", url:"contactList", name:"notReadContactsNum", value:"", params: 'isread'},
          {class:"ic_visit", text:"拜访", url:"visitList", name:"notReadVisitNum", value:"", params: 'isread'},
          {class:"ic_bussiness", text:"商机", url:"businessList", name:"notReadBusinessNum", value:"", params: 'isread'},
          {class:"ic_agreenment", text:"合同", url:"contractList", name:"notReadContractNum", value:"", params: 'isread'},
          {class:"ic_competitor", text:"竞争对手", url:"competitorList", name:"notReadCompetitorNum", value:""},
          // {class:"ic_data", text:"数据看板", url:"dataBoard", name:"", value:""},
          {class:"ic_check", text:"客户查重", url:"checkList", name:"", value:""}
        ],
        addnav:[
          {class:"ic_customer_grey_bg", text:"客户", url:"clientOperate", num:""},
          {class:"ic_contact_grey_bg", text:"联系人", url:"contactOperate", num:""},
          {class:"ic_visit_grey_bg", text:"拜访", url:"visitOperate", num:""},
          {class:"ic_bussiness_grey_bg", text:"商机", url:"businessOperate", num:""},
          {class:"ic_agreenment_grey_bg", text:"合同", url:"contractOperate", num:""},
          {class:"ic_competitor_grey_bg", text:"竞争对手", url:"competitorAdd", num:""},
        ],
        moreNav: [
          { class:"ic_external_contact", text:"外部联系人", name:"wxList" }
        ]
      }
    },
   // 客户新增、编辑页面
   client: {
    clientDetail: {
      buttonConfig:{ //操作按钮
        defaultList:[{type:"default",name:'保存并关闭', callBack:null}],
        primaryList:[{type:"primary",name:'保存并创建联系人',callBack:null}],
        style:{class:""}//按钮是否置底部 active :底部、"":相对定位
      },
    },
   },

  //详情
  details:{
    //负责人、相关人
    userListConfig: {
      toPersonList: {
        show: false,
        title: "负责人",
        num: "",
        userSelected: [], //这里是详情传过来的人，这里不显示出来
        callBack: null
      },
      ccPersonList: {
        show: false,
        title: "相关人",
        num:"" ,
        userSelected: [], //这里是详情传过来的人，这里不显示出来
        callBack: null
      }
    },
  },

  //加载更多组件
  loadMore:{
    url:"/portal/contactsAction!searchClientContact.action",     //请求路径
    pageIndexName:"page",
    data:{ //ajax入参数据
      page:1,
      id:'',
    },
    padeConfig:{
      currPage:"",
      maxPage:"",
      pageData:[],  //返回的列表数据
      totalRows:"",//数据总条数
    },
    hasRecord:{
      show:false,
      setTop:true,//是否置顶?覆盖整个页面
      icon:"qwui-icon_text",
      title:"i18n.noRecord",//若text无内容则title为16px #bbb
      text:"",
    }
  },
  };
  export default dataBase;
