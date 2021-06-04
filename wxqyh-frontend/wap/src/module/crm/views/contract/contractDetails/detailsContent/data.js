var contractData={
  // 合同详情页面
  contract: {
    title: [
      {id: 1, type: 9, optionName: "合同标题", value:'', status: true, isWrap:""},
    ],
    contractAmount:[
      {id: 2, type: 9, optionName: "合同金额", value:'', status: true, isWrap:""},
    ],
    center:[
      {id: 3, type: 9, optionName: '所属客户', value: '', status: true, isWrap:"", event:'goClient'},
      {id: 4, type: 9, optionName: '所属商机', value: '', status: true, isWrap:"", event:'goBusiness'},
      {id: 5, type: 9, optionName: '合同状态', value: '', status: true, isWrap:"", event:'goStatus'},
    ],
    middle:[
      {id: 6, type: 9, optionName: '开始日期', value: '', status: true, isWrap:""},
      {id: 7, type: 9, optionName: '结束日期', value: '', status: true, isWrap:""},
      {id: 8, type: 9, optionName: '合同类型', value: '', status: true, isWrap:""},
      {id: 9, type: 9, optionName: '合同编码', value: '', status: true, isWrap:""},
      {id: 10, type: 9, optionName: '付款方式',  value: '', status: true, isWrap:""},
      {id: 11, type: 9, optionName: '签约日期',  value: '', status: true, isWrap:""},
      {id: 12, type: 9, optionName: '我方签约人',  value: '', status: true, isWrap:""},
      {id: 13, type: 9, optionName: '客户签约人',  value: '', status: true, isWrap:""},
      {id: 14, type: 9, optionName: '合同正文',  value: '', status: true,isWrap:true},
      {id: 15, type: 9, optionName: '备注',  value: '', status: true , isWrap:true},
    ],
    media: [
      {id: 16, type: 9, optionName: '附件',  value: '', status: true, isWrap:""},
    ],
  },



}
export default contractData;
