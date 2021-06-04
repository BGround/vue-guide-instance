var visitData={
  // 拜访详情页面
  visit: {
    nav: [
      {id: 1, divType: 9, optionName: '拜访标题', value:'', status: true, isWrap:true},
      {id: 2, divType: 9, optionName: '拜访内容', value:'', status: true, isWrap:true},
    ],
    centerNav: [
      {id: 3, divType: 9, optionName: '拜访客户', value: '', status: true, isWrap:""},
      {id: 4, divType: 9, optionName: '拜访联系人', value: '', status: true, isWrap:""},
      {id: 5, divType: 9, optionName: '拜访商机', value: '', status: true, isWrap:""},
      {id: 6, divType: 9, optionName: '拜访日期', value: '', status: true, isWrap:""},
      {id: 7, divType: 9, optionName: '所属外勤单', value: '', status: false, isWrap:""},
      {id: 8, divType: 9, optionName: '拜访地址', value: '', status: false, isWrap:""},
      {id: 9, divType: 9, optionName: '客户地址', value: '', status: false, isWrap:""},

    ],
    communicationNav:[
      {id: 10, divType: 9, optionName: '图片', value: '', status: true, isWrap:""},
    ]
  },

  nav:[
      {class:"client_details", text:"详情", url:"/VisitDetails/ClientContent",path:"/VisitDetails/ClientContent", name:"", num:""},
      {class:"contact_details", text:"联系人", url:"/VisitDetails/ContactList",path:"/VisitDetails/ContactContent", name:"", num:""},
      {class:"business_details", text:"商机", url:"/VisitDetails/BusinessList",path:"/VisitDetails/BusinessContent", name:"", num:""},
      {class:"contract_details", text:"合同", url:"/VisitDetails/ContractList",path:"/VisitDetails/ContractContent", name:"", num:""},
      {class:"visit_details", text:"拜访", url:"/VisitDetails/VisitList",path:"/VisitDetails/VisitContent", name:"", num:""},
    ],


  //评论输入框
  listComment:{ //评论
    get:{  //获取
      url:"/portal/outsideworkinfoAction!listComment.action",
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
      url:"/portal/outsideworkinfoAction!listMoreComment.action",
      hasMore:false,
      data:{
        lastCommentId:"",
        size:10,
        commentStatus:"1",//1显示全部，2只看评论
      },
    },
    send:{ //发送
      url:"/portal/outsideworkinfoAction!addOutsideworkcomment.action",
      contentObject:'tbOutworkCommentPO.content',//传送的内容字符串
      data:{}
    },
    delete:{ //删除
      url:"/portal/outsideworkinfoAction!deleteComment.action",
      commentId:"commentId",//需要传的id字段
      data:{}
    },
    comments:[], //评论数据列表
    totalPages:""
  }
}
export default visitData;
