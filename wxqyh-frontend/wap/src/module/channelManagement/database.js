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
      agent:"qiruiqd",
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

    operatingStateMap:{
      1: '正常',
      4: '冻结',
      5: '僵尸',
      6: '退网',
      7: '无',
      10: '待开通',
      11: '待清算'
    },

    operatingStateClassMap:{
      1: 'normal',
      4: 'warning',
      5: 'danger',
      6: 'danger',
      7: 'nostatus',
      10: 'nostatus',
      11: 'danger'
    },

    qqMapKey: 'GDYBZ-6QPEF-ZY5JM-NLGQH-ZVLZE-YDBFB'
  };

  export default dataBase;
