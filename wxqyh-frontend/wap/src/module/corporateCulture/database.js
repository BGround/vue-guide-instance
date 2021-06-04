var dataBase={

  /*必配-start*/
  mask:false,//遮罩层控制
  isShow:false,
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"activity",
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
        "title":"相关人",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "deptSelected":[],
        "tagSelected":[],
        "deptSelectedShow": true,
        "callBack": {
          "confirm": null,
        }
      },
      "FlowAuditUser":{
        "list":[],
        "callBack": {
          "confirm": null,
        }
      }
    }
  },
  advancedSetting: {//高级设置
    switchControl: [ // 内容
      {content: '匿名发布', onOff: false},
      {content: '允许匿名评论', onOff: false},
      {content: '允许分享外部', onOff: false},
      {content: '外部分享显示评论', onOff: false},
      {content: '开启评论', onOff: true},
      {content: '发布时发送通知消息', onOff: true}
    ],
    levelData: {
      show:false,
      data:[]
    },
    option:[]
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
    class:""//按钮是否置底部 active :底部、"":相对定位
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
  userData:{},
  deptData:{},
  keyWordData:{},
  tagData:{},
  childData:{},
};
export default dataBase;
