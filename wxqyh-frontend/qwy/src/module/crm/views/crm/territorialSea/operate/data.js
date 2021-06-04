let clientData={
  //固定字段
  topData:[
    { id:1, optionName:'客户名称', itemType:'input', value:'',placeholderName:'客户名称', isWarning:false, errTip:'', status:'1',isMust:'1', key:'clientPO.clientName'},
    { id:2, optionName:'所属公海', itemType:'clickSelect', value:'', placeholderName:'所属公海',isWarning:false, errTip:'', status:'', isMust:'1', key:'clientPO.poolName'},
    { id:3, optionName:'客户编码', itemType:'input', value:'', placeholderName:'客户编码',isWarning:false, errTip:'', status:'1', isMust:'1', key:'clientPO.clientCode'},
    { id:4, optionName:'区域', itemType:'area', value:'', placeholderName:'区域',isWarning:false, errTip:'', status:'', isMust:'', key:''},
    { id:5, optionName:'地址', itemType:'input', value:'', placeholderName:'选择地址',isWarning:false, errTip:'', status:'', isMust:'', key:'clientPO.address'},
    { id:6, optionName:'行业', itemType:'clickSelect', value:'', placeholderName:'',isWarning:false, errTip:'', status:'', isMust:'', key:'clientPO.industry'},
    { id:7, optionName:'联系电话', itemType:'input', value:'', placeholderName:'联系电话',isWarning:false, errTip:'', status:'', isMust:'', key:'clientPO.phone'},
    { id:8, optionName:'邮箱', itemType:'input', value:'', placeholderName:'邮箱',isWarning:false, errTip:'', status:'', isMust:'', key:'clientPO.email'},
    { id:9, optionName:'网址', itemType:'input', value:'', placeholderName:'网址',isWarning:false, errTip:'', status:'', isMust:'', key:'clientPO.website'},
  ],
  bottomData:[
    { id:1, optionName:'备注', itemType:'textarea', value:'',placeholderName:'输入多行文本',isWarning:false, errTip:'', status:'', isMust:'0', key:'clientPO.remark'},
  ]
};

export default clientData;
