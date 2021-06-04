var contactData={
  // 联系人详情页面
  contact: {
    nav: [
      {id: 1, divType: 9, optionName: '联系人姓名', value:'', status: true, isWrap:''},
      {id: 2, divType: 9, optionName: '所属客户', value:'', status: true, isWrap:''},
    ],
    centerNav: [
      {id: 3, divType: 9, optionName: '手机', value: '', status: true, isWrap: ''},
      {id: 4, divType: 9, optionName: '职位', value: '', status: true, isWrap: ''},
      {id: 5, divType: 9, optionName: '邮箱', value: '', status: true, isWrap:''},
    ],
    communicationNav: [
      {id:6, divType: 9, optionName: '生日', value: '', status: true, isWrap:''},
      {id:7, divType: 9, optionName: '毕业院校',  value: '', status: true , isWrap: ''},
      {id:8, divType: 9, optionName: '兴趣爱好',  value: '', status: true, isWrap: ''},
      {id:9, divType: 9, optionName: '备注',  value: '', status: true, isWrap: true},
    ],
  },

  nav:[
      {class:"client_details", text:"详情", url:"/ContactDetails/ClientContent",path:"/ContactDetails/ClientContent", name:"", num:""},
      {class:"contact_details", text:"联系人", url:"/ContactDetails/ContactList",path:"/ContactDetails/ContactContent", name:"", num:""},
      {class:"business_details", text:"商机", url:"/ContactDetails/BusinessList",path:"/ContactDetails/BusinessContent", name:"", num:""},
      {class:"contract_details", text:"合同", url:"/ContactDetails/ContractList",path:"/ContactDetails/ContractContent", name:"", num:""},
      {class:"visit_details", text:"拜访", url:"/ContactDetails/VisitList",path:"/ContactDetails/VisitContent", name:"", num:""},
    ],


  //评论输入框
  listComment:{ //评论
    get:{  //获取
      url:"/portal/contactsAction!listComment.action",
      hasMore:false,
      pageIndex:1,//当前页面
      data:{
        id:"",
        size:10,
        commentStatus:"1",//1只看评论，2显示全部
        page:1,
      }
    },
    getMore:{ //获取更多评论
      url:"/portal/contactsAction!listMoreComment.action",
      hasMore:false,
      data:{
        lastCommentId:"",
        size:10,
        commentStatus:"1",//1显示全部，2只看评论
      },
    },
    send:{ //发送
      url:"/portal/contactsAction!commitComment.action",
      contentObject:'tbCrmCommentPO.content',//传送的内容字符串
      data:{}
    },
    delete:{ //删除
      url:"/portal/contactsAction!deleteComment.action",
      commentId:"commentId",//需要传的id字段
      data:{}
    },
    comments:[], //评论数据列表
    totalPages:""
  }
}
export default contactData;
