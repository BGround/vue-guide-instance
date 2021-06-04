var dataBase = {

  /*必配-start*/
  mask: false, //遮罩层控制
  isShow: false,
  config: '', //公共配置信息
  wxqyh_uploadfile: { //当前应用名称
    agent: "moveapprove",
  },
  /*必配-end*/
  loading: { //加载、提交成功、删除成功
    show: false,
    text: "",
    icon: "",
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
  dialogConfig: {    //弹窗对话框
    show: false,
    title: "",//标题
    type: "",
    content: [],//中间自定义内容
    canClose: true,//是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
    btnConfig: {
      primaryBtn: { name: "", callBack: null }, //主操作按钮
      defaultBtn: { name: "", callBack: null }, //次操作按钮
    }
  },

  // 新增、编辑页面
  draft: {
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
  }
};
export default dataBase;
