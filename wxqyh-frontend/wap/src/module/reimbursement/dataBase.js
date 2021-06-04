let dataBase = {

  /*必配-start*/
  mask: false, //遮罩层控制
  isShow: false,
  config: '', //公共配置信息
  wxqyh_uploadfile: { //当前应用名称
    agent: "reimbursement",
  },
  /*必配-end*/
  loading: { //加载、提交成功、删除成功
    show: false,
    text: "",
    icon: "",
  },
  dialogConfig: {    //弹窗对话框
    show: false,
    title: "",//标题
    type: "",
    content: [],//中间自定义内容
    canClose: true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig: {
      primaryBtn: {name: "", callBack: null}, //主操作按钮
      defaultBtn: {name: "", callBack: null}, //次操作按钮
    }
  },
  selectConfig:{ //负责人、相关人
    show:false,
    signIndex:'ccPersonList',
    selectList:{
      "ccPersonList": {
        "title":"相关人",
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "deptSelected":[],
        "deptSelectedShow": true,
        "callBack": {
          "confirm": null,
        }
      },
      /*"depts": { // 选部门
        "title":"",
        "selectType": "dept",
        "deptSelected": [],
        "callBack": {
          "confirm": null
        }
      },*/
    }
  },
  dialogBottomConfig: {
    show: false,
    title: '',
    btnConfig: [],
  },
  /*selectDeptConfig:{
    show:false,
    signIndex:'depts',
    selectList: {
      "depts": { // 选部门
        "title":"",
        "selectType": "dept",
        "deptSelected": [],
        "callBack": {
          "confirm": null
        }
      },
    }
  },*/
  editor: {
    //图片数据
    imgUpload: {
      picList: [],
      url: '/portal/imageupload/imageUploadAction!doUploadImageBase64.action'
    },
    //文件数据
    fileUpload: {
      mediaList: [],
      url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
    },
    buttonConfig: { //操作按钮
      primaryList: [{
        type: "primary",
        name: '提交',
        callBack: null
      }],
      defaultList: [{
        type: "default",
        name: '保存草稿',
        callBack: null
      }],
      style: {
        class: ""
      } //按钮是否置底部 active :底部、"":相对定位
    },
  },
};
export default dataBase;
