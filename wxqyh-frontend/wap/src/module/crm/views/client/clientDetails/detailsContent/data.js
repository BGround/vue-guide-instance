var clientData={
  // 客户详情页面
  clients: {
    nav: [
      {id: 1, divType: 9, optionName: '客户名称', value:'', status: true, isWrap:true},
      {id: 2, divType: 9, optionName: '客户类别', value:'', status: true, isWrap:''},
      {id: 3, divType: 9, optionName: '所属公海', value:'', status: true, isWrap:''},
      {id: 4, divType: 9, optionName: '客户编码', value:'', status: true, isWrap:''},
    ],
    centerNav: [
      {id: 5, divType: 9, optionName: '区域',  value: '', status: true, isWrap: ''},
      {id: 6, divType: 9, optionName: '地址',  value: '', status: true, isWrap: ''},
      {id: 7, divType: 9, optionName: '行业', value: '', status: true,  isWrap:''},
    ],
    communicationNav: [
      {id:8, divType: 9, optionName: '联系电话', value:'', status: true, isWrap:''},
      {id:9, divType: 9, optionName: '邮箱', value:'', status: true , isWrap: ''},
      {id:10, divType: 9, optionName: '网址', value:'', status: true, isWrap: ''},
      {id:11, divType: 9, optionName: '备注', value:'', status: true, isWrap: true},
    ],
  },

  // 头部导航
  nav:[
    {class:"client_details", text:"详情", url:"/ClientDetails/ClientContent",path:"/ClientDetails/ClientContent", name:"", num:""},
    {class:"contact_details", text:"联系人", url:"/ClientDetails/ContactList",path:"/ClientDetails/ContactContent", name:"", num:""},
    {class:"business_details", text:"商机", url:"/ClientDetails/BusinessList",path:"/ClientDetails/BusinessContent", name:"", num:""},
    {class:"contract_details", text:"合同", url:"/ClientDetails/ContractList",path:"/ClientDetails/ContractContent", name:"", num:""},
    {class:"visit_details", text:"拜访", url:"/ClientDetails/VisitList",path:"/ClientDetails/VisitContent", name:"", num:""},
  ],

  //评论输入框
  listComment:{ //评论
    get:{  //获取
      url:"/portal/clientAction!listComment.action",
      pageIndexName:"page",//当前页面
      hasMore:false,
      data:{
        id:"",
        size:10,
      }
    },
    getMore:{ //获取更多评论
      url:"/portal/clientAction!listMoreComment.action",
      hasMore:false,
      data:{
        lastCommentId:"",
        size:10,
      },
    },
    send:{ //发送
      url:"/portal/clientAction!commitComment.action",
      contentObject:'tbCrmCommentPO.content',//传送的内容字符串
      data:{}
    },
    delete:{ //删除
      url:"/portal/clientAction!deleteComment.action",
      commentId:"commentId",//需要传的id字段
      data:{}
    },
    comments:[], //评论数据列表
    totalPages:""
  }
}
export default clientData
