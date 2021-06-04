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
    agent:"cloudOffice",
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
  home: {
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
          class:"addNewTask",
          text:"",
          type: "button",
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
          class:"myPub",
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
      title: "是否删除该草稿？", //头部标题，设置为空的话不显示
      btnConfig:[
        {title:" 删除", callBack: null, primary: true},
        {title:" 取消", callBack: null}
      ],
      maskCallBack: null
    },
  },
  isShowApp: false,
  isShowArr: {
    isShowAsk: false,
    isShowTravel: false,
    isShowOvertime: false,
    isShowDynamic: false,
    isShowMeet: false,
    isShowMove: false,
    isShowCheckWork: false,
    isShowReim: false,
    isShowCar: false,
  },
  totalDrafCount: 0,
}
export default dataBase;
