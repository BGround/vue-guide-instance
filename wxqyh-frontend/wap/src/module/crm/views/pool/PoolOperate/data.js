var clientOperateData = {

   // 客户新增、编辑页面
   client: {
    clientDetail: {
      buttonConfig:{ //操作按钮
        defaultList:[],
        primaryList:[{type:"",name:'保存并关闭',callBack:null}],
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
        // 有字数限制的输入框 type: 7
        {
          id: 1, 
          type: 'textarea', 
          optionName: '客户名称', 
          placeholder: '请输入', 
          isMust: 1, 
          maxLength: '100', 
          value:'', 
          status: true, 
          key:'clientPO.clientName', 
          editName: 'clientName',
          // showNumTip: true,
          isSlot: true
        },

        // 箭头跳转 type: 5
        {
          id: 3, 
          type: 'input', 
          optionName: '所属公海', 
          placeholder: '请选择', 
          isMust: 1, 
          maxLength: '', 
          value:'', 
          status: true, 
          key:'clientPO.poolName', 
          editName: 'poolName',
          showMask: true,
          showArrow: true
        },

        {
          id: 4, 
          type: 'input', 
          optionName: '客户编码', 
          placeholder: '请输入', 
          isMust: 1, 
          value:'', 
          status: true, 
          key:'clientPO.clientCode', 
          editName: 'clientCode'
        },
      ],
      centerNav: [
        // 地址 没有字数限制 type: 8
        {
          id: 5, 
          type: 'input',
          optionName: '地址', 
          placeholder:'请输入或从地图上选择', 
          isMust: 0, 
          maxLength: '140', 
          value: '', 
          status: true, 
          key: 'clientPO.address', 
          editName: 'address',
          showIcon: true
        },

        // 箭头跳转 type: 5
        {
          id: 6, 
          type: 'input', 
          optionName: '行业', 
          placeholder: '请选择行业', 
          isMust: 0, 
          maxLength: '', 
          value: '', 
          status: true, 
          key:'clientPO.industry', 
          editName: 'industry',
          showMask: true,
          showArrow: true
        },
      ],
      communicationNav: [
        // 没有字数限制的输入框 type: 1
        {
          type: 'input', 
          optionName: '联系电话', 
          placeholder: '请输入', 
          isMust: 1, 
          maxLength: '20', 
          value:'', 
          name: 'tel',
          status: true, 
          key:'clientPO.phone', 
          errorMsg: '联系电话已存在',
          editName: 'phone'
        },

        // 没有字数限制的输入框 type: 1
        {
          type: 'input', 
          optionName: '邮箱', 
          placeholder: '请输入', 
          isMust: 0, 
          maxLength: '50', 
          value:'', 
          name: 'mail', 
          status: true , 
          key: 'clientPO.email', 
          editName: 'email'
        },

        // 没有字数限制的输入框 type: 1
        {
          type: 'input', 
          optionName: '网址', 
          placeholder: '请输入', 
          isMust: 0, 
          maxLength: '200', 
          value:'', 
          status: true, 
          key: 'clientPO.website', 
          editName: 'website'
        },

        // textarea多行显示,有字数限制 type:4
        {
          type: 'textarea', 
          optionName: '备注', 
          isMust: 0, 
          maxLength: '2000', 
          placeholder: '请输入', 
          value:'', 
          status: true, 
          key: 'clientPO.remark', 
          editName: 'remark'
        },        
      ],

    },
   }
  };
  export default clientOperateData;
  