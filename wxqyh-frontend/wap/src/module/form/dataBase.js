var dataBase={

	/*必配-start*/
	mask:false,//遮罩层控制
  isShow:true,
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"form",
  },
  /*必配-end*/
  loading:{ //加载、提交成功、删除成功
    show:false,
    text:"",
    name:"",
  },
  dialogBottomConfig:{
    show: false, //控制弹窗显示与否
    title: "确认删除该表单？", //头部标题，设置为空的话不显示
    btnConfig:[ //自定义弹框操作,可以设置回调函数
      {title:" 删除", callBack: null, primary:true},//primary为true显示为红色，默认为灰色
      {title:" 取消", callBack: null}
    ]
  },
  showrecord: false,
  selectCrm:{
    show:false,
    selectList:[],
    data:{
      crmUserId:'',
      crmTypes:''
    },
    confirm:null,
  },
  selectForm:{
    show:false,
    selectList:[],
    data:{
      refItemKey:'',
    },
    ref_cfg:null,
    confirm:null,
  },
  selectConfig:{ //负责人、相关人
    show:false,
    signIndex:'',
    selectList:{
      "toPersonList": {
        "show": false,
        "title":"负责人",
        "selectType": "user",
        "userName": "incharges",
        "userSelected": [],
        "deptSelected":[],
        "deptSelectedShow": true,
        "callBack": {
          "confirm": null,
        }
      },
      "ccPersonList": {
        "show": false,
        "title":"相关人",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "deptSelected":[],
        "tagSelected":[],
        "deptSelectedShow": true,
        "callBack": {
          "confirm": null
        }
      },
      "users": { // 单独选人
        "title":"",
        "selectType": "group",
        "userSelected": [],
        "callBack": {
            "confirm": null
        }
      },
      "depts": { // 选部门
          "title":"",
          "selectType": "dept",
          "deptSelected": [],
          "callBack": {
              "confirm": null
          }
      },
      "usersOrDepts": { // 选部门和选人
          "title":"",
          "selectType": "group",
          "userSelected": [],
          "deptSelected": [],
          "callBack": {
              "confirm": null
          }
      }
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
    newHeadData:{
      show:true,
      nav:[
        {class:"ic_add", text:"发起", url:"formtype"},
        {class:"ic_draft", text:"草稿", url:"draft", num:""},
        {class:"ic_favourite", text:"收藏", url:"collection", num:""}
      ],
      searchBar:{
        show:false,//搜索框，默认显示
      },
    },
    newHomeFooterList:{
      nav_on:0,
      nav:[
        {
          type: "normal",
          class: "ic_tabar1",
          text: "首页",
          path: "main",
          data: {
            // 首页列表
            page: 1,
            pageSize: 10,
            keyWord: "",
            status: 3,
            type: 1
          }
        },
        {
          type: "normal",
          class: "ic_tabar2",
          text: "待办",
          path: "audit",
          data: {
            // 待我处理 type=2;status=0
            page: 1,
            pageSize: 10,
            keyWord: "",
            status: 0,
            type: 2
          },
          num: ""
        },
        {
          type: "quickStart",
          path: "formtype"
        },
        {
          type: "normal",
          class: "ic_tabar3",
          text: "我的",
          path: "mine",
          data: {
            // 我相关的 type=2;status=3
            page: 1,
            pageSize: 10,
            keyWord: "",
            status: 3,
            type: 2
          }
        },
        {
          type: 'normal',
          class:"ic_tabar4",
          text:"更多",
          path: "more",
          hasTip: false,
          data:{
            page:1,
            pageSize:10,
            keyWord:'',
            status:3,
            type:2
          }
        }
      ]
    }
  },
  formtype:{
    searchBar:{ //头部搜索框
      show:true,
      keyWord:'',
      rightSpan:{
        show:false,
        callback:null
      },
      moreFunction:{
        show:true,
        option:[
          {name:'分组', callback:null, placeholder:'搜索', value:0},
          {name:'名称', callback:null, placeholder:'搜索', value:1}
        ]
      }
    },
  }
};
export default dataBase;
