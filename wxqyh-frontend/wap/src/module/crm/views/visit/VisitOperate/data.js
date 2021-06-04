var contactOperateData = {

   // 客户新增、编辑页面
   contact: {
    contactDetail: {
      buttonConfig:{ //操作按钮
        defaultList:[{type:"default",name:'保存为草稿', callBack:null}],
        primaryList:[{type:"primary",name:'保存',callBack:null}],
        style:{class:""}//按钮是否置底部 active :底部、"":相对定位
      },
      // 图片数据
      imgUpload: {
        picList: [],
      },
      //文件数据
      fileUpload: {
        mediaList: [],
        url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
      },
      nav: [
        // 拜访单标题
        {
          type: 'textarea',
          optionName: '拜访标题',
          placeholder: '请输入',
          isMust: 1,
          maxLength: '200',
          value:'',
          status: true,
          key:'tbOutsideWorkInfoPO.outworkTitle',
          editName: 'outworkTitle'
        },
        // 拜访单内容
        {
          type: 'textarea',
          optionName: '拜访内容',
          placeholder: '请输入',
          isMust: 1,
          maxLength: '2000',
          value:'',
          status: true,
          key:'tbOutsideWorkInfoPO.outworkContent',
          editName: 'outworkContent'
        },

        // 所属外勤单
        {
          type: 'input',
          optionName: '所属外勤单',
          placeholder: '请选择',
          isMust: 1,
          maxLength: '',
          value:'',
          status: true,
          key:'tbOutsideWorkInfoPO.oswgdTitle',
          editName: 'oswgdTitle',
          showMask: true,
          showArrow: true,
        },
      ],
      communicationNav: [
        // 拜访客户
        {
          type: 'input',
          optionName: '拜访客户',
          placeholder: '请选择',
          isMust: 1,
          maxLength: '',
          value:'',
          status: true,
          key:'tbOutsideWorkInfoPO.clientName',
          editName: 'clientName',
          showMask: true,
          showArrow: true,
        },
        // 拜访联系人
        {
          type: 'input',
          optionName: '拜访联系人',
          placeholder: '请选择',
          isMust: 1,
          maxLength: '',
          value:'',
          status: true,
          key:'tbOutsideWorkInfoPO.contactName',
          editName: 'contactName',
          showMask: true,
          showArrow: true,
        },
        // 拜访商机
        {
          type: 'input',
          optionName: '拜访商机',
          placeholder: '请选择',
          isMust: 0,
          maxLength: '',
          value:'',
          status: true,
          key:'tbOutsideWorkInfoPO.businessName',
          editName: 'businessName',
          showMask: true,
          showArrow: true,
        },
        // 拜访时间
        {
          type: 'dateTime',
          optionName: '拜访时间',
          placeholder: '请输入',
          isMust: 0,
          maxLength: '200',
          value:'',
          status: true,
          key: 'tbOutsideWorkInfoPO.outworkTime',
          editName: 'outworkTime',
          minTime: '',
        },

        // 拜访地址
        {
          type: 'input',
          optionName: '拜访地址',
          placeholder: '请输入',
          isMust: 0,
          value:'',
          status: true,
          key: 'tbOutsideWorkInfoPO.address',
          editName: 'address',
        },

        // 客户地址
        {
          type: 'input',
          optionName: '客户地址',
          placeholder: '请输入',
          isMust: 0,
          value:'',
          status: true,
          key: 'tbOutsideWorkInfoPO.clientAddress',
          editName: 'clientaddress'
        },

      ],

    },
   }
  };
  export default contactOperateData;
