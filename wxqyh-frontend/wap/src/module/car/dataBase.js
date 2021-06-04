var dataBase={

	/*必配-start*/
	mask:false,//遮罩层控制
  isShow:true,
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"car",
  },
  /*必配-end*/
  loading:{ //加载、提交成功、删除成功
    show:false,
    text:"",
    name:"",
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
        "callBack": {
          "confirm": null
        }
      },
      "ccPersonList": {
        "title":"",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
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
  car:{
    headData:{
      show: true,
      nav:[
        {class:"ic_ask", text:"单位派车", url:"add"},
        {class:"ic_call", text:"企业叫车", url:"didiAdd"}
      ],
      searchBar:{
        show: false,//搜索框，默认显示
      },
    },
    footerList:{
      nav_on:0,
      nav:[
        {
          class:"ic_tabar1",
          text:"我的行程",
          callBack:null
        },
        {
          class:"ic_tabar2",
          text:"待我处理",
          num:"",
          callBack:null
        },
        {
          class:"ic_tabar3",
          text:"车辆状态",
          callBack:null
        },
        {
          class:"ic_tabar4",
          text:"相关申请",
          callBack:null
        }
      ]
    }
  }
};
export default dataBase
