var poolData={
  // 公海详情页面
  pool: {
    nav: [
      {id: 1, divType: 9, optionName: '客户名称', value:'', status: true, isWrap:true},
      {id: 2, divType: 9, optionName: '所属公海', value:'', status: true, isWrap:''},
      {id: 3, divType: 9, optionName: '客户编码', value:'', status: true, isWrap:''},
      {id: 4, divType: 9, optionName: '客户类别', value:'', status: true, isWrap:''},
    ],
    centerNav: [
      {id: 4, divType: 9, optionName: '区域',  value: '', status: true, isWrap: ''},
      {id: 5, divType: 9, optionName: '地址',  value: '', status: true, isWrap: ''},
      {id: 6, divType: 9, optionName: '行业', value: '', status: true, isWrap:''},
    ],
    communicationNav: [
      {id:7, divType: 9, optionName: '联系电话', value:'', status: true, isWrap:''},
      {id:8, divType: 9, optionName: '邮箱', value:'', status: true , isWrap: ''},
      {id:9, divType: 9, optionName: '网址', value:'', status: true, isWrap: ''},
      {id:10, divType: 9, optionName: '备注', value:'', status: true, isWrap: true},
    ],
  },


  //评论输入框
  listComment:{ //评论
    get:{  //获取
      url:"/portal/clientAction!listComment.action",
      pageIndex:1,//当前页面
      data:{
        id:"",
        size:10,
        commentStatus:"1",//1只看评论，2显示全部
        page:1
      }
    },
    getMore:{ //获取更多评论
      url:"/portal/clientAction!listMoreComment.action",
      hasMore:false,
      data:{
        lastCommentId:"",
        size:10,
        commentStatus:"1",//1显示全部，2只看评论
      },
    },
    comments:[], //评论数据列表
    totalPages:""
  }
}
export default poolData;
