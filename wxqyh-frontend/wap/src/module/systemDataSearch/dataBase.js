var dataBase={

  /*必配-start*/
  mask:false,//遮罩层控制
  isShow:true,
  config:'',//公共配置信息
  wxqyh_uploadfile:{ //当前应用名称
    agent:"",
  },
  /*必配-end*/
  loading:{ //加载、提交成功、删除成功
    show: false,
    text: "",
    icon: "",
  },
  dialogConfig:{    //弹窗对话框
    show:false,
    title:"",//标题
    type:"",
    content:[],
    canClose:true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig:{
      primaryBtn:{name:"", callBack:null}, //主操作按钮
      defaultBtn:{name:"知道啦", callBack:null}, //次操作按钮
    }
  },
  // 数据库配置
  dataSourceConfig:{
    main:{
      dataSource:'MAIN_READONLY',
      optionName:'主库(只读)'
    },
    crm:{
      dataSource:'CRM_READONLY',
      optionName:'CRM库(只读)'
    },
    form:{
      dataSource:'FORM_READONLY',
      optionName:'表单库(只读)'
    },
    checkWork:{
      dataSource:'CHECKWORK_READONLY',
      optionName:'考勤库(只读)'
    },
    diary:{
      dataSource:'DIARY_READONLY',
      optionName:'工作日志库(只读)'
    },
    dynamic:{
      dataSource:'DYNAMIC_READONLY',
      optionName:'新闻公告库(只读)'
    },
  }

};
export default dataBase;
