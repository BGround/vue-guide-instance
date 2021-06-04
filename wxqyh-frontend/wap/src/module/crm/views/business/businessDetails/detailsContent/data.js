var businessData={
  // 商机详情页面
  business: {
    nav: [
      {id: 1, divType: 9, optionName: '商机标题', value:'', status: true, isWrap:true},
      {id: 2, divType: 9, optionName: '商机内容', value:'', status: true, isWrap:true},
    ],
    middleNav:[

      {id: 3, divType: 9, optionName: '所属客户', value:'', status: true,  isWrap:''},
    ],
    centerNav: [
      {id: 4, divType: 9, optionName: '客户联系人', value:'', status: true, isWrap:''},
      {id: 5, divType: 9, optionName: '商机合作伙伴', value: '', status: true, isWrap: ''},
      {id: 6, divType: 9, optionName: '竞争对手', value: '', status: true, isWrap: ''},
    ],
    stageNav:[
      {id: 7, divType: 9, optionName: '目前所在商机阶段', value: '', status: true, isWrap:''},
    ],
    communicationNav: [
      {id: 8, divType: 9, optionName: '商机类别',  value: '', status: true , isWrap: ''},
      {id: 9, divType: 9, optionName: '销售额(元)',  value: '', status: true, isWrap: ''},
      {id: 10, divType: 9, optionName: '结单日期',  value: '', status: true, isWrap: ''},
    ],
  },

  //头部导航
  nav:[
    {class:"client_details", text:"详情", url:"/BusinessDetails/ClientContent",path:"/BusinessDetails/ClientContent", name:"", num:""},
    {class:"contact_details", text:"联系人", url:"/BusinessDetails/ContactList",path:"/BusinessDetails/ContactContent", name:"", num:""},
    {class:"business_details", text:"商机", url:"/BusinessDetails/BusinessList",path:"/BusinessDetails/BusinessContent", name:"", num:""},
    {class:"contract_details", text:"合同", url:"/BusinessDetails/ContractList",path:"/BusinessDetails/ContractContent", name:"", num:""},
    {class:"visit_details", text:"拜访", url:"/BusinessDetails/VisitList",path:"/BusinessDetails/VisitContent", name:"", num:""},
  ],

  //评论输入框
  listComment:{ //评论
    get:{  //获取
      url:"/portal/businessAction!listComment.action",
      pageIndexName:"page",//当前页面
      hasMore:false,
      data:{
        id:"",
        size:10,
        commentStatus:"1",//1只看评论，2显示全部
        page:1
      }
    },
    getMore:{ //获取更多评论
      url:"/portal/businessAction!listMoreComment.action",
      hasMore:false,
      data:{
        lastCommentId:"",
        size:10,
        commentStatus:"1",//1显示全部，2只看评论
      },
    },
    send:{ //发送
      url:"/portal/businessAction!addComment.action",
      contentObject:'tbCrmCommentPO.content',//传送的内容字符串
      data:{}
    },
    delete:{ //删除
      url:"/portal/businessAction!deleteComment.action",
      commentId:"commentId",//需要传的id字段
      data:{}
    },
    comments:[], //评论数据列表
    totalPages:""
  }
}
export default businessData;
