var businessOperateData = {

   // 商机 新增 编辑 页面
   business: {
    businessDetail: {
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
        // 商机标题
        {
          type: 'textarea', 
          optionName: '商机标题', 
          placeholder: '请输入', 
          isMust: 1, 
          maxLength: '200', 
          value:'', 
          status: true, 
          key:'tbCrmBusinessInfoPO.title', 
          editName: 'title'
        },
        // 商机内容
        {
          type: 'textarea', 
          optionName: '商机内容', 
          placeholder: '请输入', 
          isMust: 1, 
          maxLength: '2000', 
          value:'', 
          status: true, 
          key:'tbCrmBusinessInfoPO.content', 
          editName: 'content'
        }
      ],
      belongClientNav:[
        {
          type: 'input', 
          optionName: '所属客户', 
          placeholder: '请选择', 
          isMust: 1, 
          maxLength: '', 
          value:'', 
          status: true, 
          key:'tbCrmBusinessInfoPO.clientName', 
          editName: 'clientName',
          showMask: true,
          showArrow: true,
        },
      ],
      clientContactNav:[
        {
          type: 'add', 
          optionName: '客户联系人', 
          placeholder: '请选择', 
          isMust: 0, 
          maxLength: '', 
          value:'', 
          status: true, 
          editName: 'contactList',
        },
      ],
      businessPartnerNav:[
        {
          type: 'add', 
          optionName: '商机合作伙伴', 
          placeholder: '请选择', 
          isMust: 0, 
          maxLength: '', 
          value:'', 
          status: true, 
          editName: 'partnerList',
        },
      ],
      competitorNav:[
        {
          type: 'add', 
          optionName: '竞争对手', 
          placeholder: '请选择', 
          isMust: 1, 
          maxLength: '', 
          value:'', 
          status: true, 
          editName: 'competitorList',
        },
      ],
      businessStageNav:[
        {
          type: 'select', 
          optionName: '目前所在赢单阶段', 
          placeholder: '请选择', 
          isMust: 1, 
          maxLength: '', 
          value:'', 
          status: true, 
          key:'tbCrmBusinessInfoPO.stage', 
          editName: 'stage',
          winRate: '',
        },
      ],
      communicationNav: [
        // 商机类别
        {
          type: 'select', 
          optionName: '商机类别', 
          placeholder: '请选择', 
          isMust: 1, 
          maxLength: '', 
          value:'', 
          status: true, 
          key:'tbCrmBusinessInfoPO.businessType', 
          editName: 'businessType',
        },
        // 销售额(元)
        {
          type: 'input', 
          optionName: '销售额(元)', 
          placeholder: '请选择', 
          isMust: 1, 
          value:'', 
          status: true, 
          key:'tbCrmBusinessInfoPO.estimatedSale', 
          maxLength: '13', 
          editName: 'estimatedSale',
          changeCallBack: null 
        },

        // 结单日期
        {
          type: 'dateTime', 
          optionName: '结单日期', 
          placeholder: '请输入', 
          isMust: 0, 
          maxLength: '200', 
          value:'', 
          status: true, 
          key: 'tbCrmBusinessInfoPO.estimatedDate', 
          editName: 'estimatedDate',
          format: 'YYYY-MM-DD',
        },    
      ],

    },
   }
  };
  export default businessOperateData;
  