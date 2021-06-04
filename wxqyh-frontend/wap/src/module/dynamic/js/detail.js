var detail = {
  //详情页数据
  detailData:{
    diaryDetail:{
      url:"/portal/diaryAction!getDiaryDetail.action",
      data:{ //ajax入参数据
        diaryId:'',
        userId:'',
        status:'0',
        size:"10",
      },
      detail:{ //详情内容
        openPrint:true,
        creator:{
          id:"",
          callBack:null
        },
        title:"",
        personName:"",
        createTime:"",
        describes:[],//循环字段
        content:"",
        configCopy:{},//复制页面信息到新建页面
        picList:[],//上传的图片列表
        mediaList:[],//上传的附件列表
        buttonConfig:{ //操作按钮
          primaryList:[],
          defaultList:[],
          class:"active",//按钮是否置底部 active :底部、"":相对定位
        },
        //负责人、相关人
        userListConfig:{},
        isUseRate:""
      }
    }, //end
  },

  //上一篇，下一篇
  nextUrl:"/portal/diaryAction!getNextDiary.action",
  //评分
  scoreUrl:"/portal/diaryAction!updateScore.action",
  listComment:{ //评论
    comments:[], //评论数据列表
    totalPages:"",
    totalRows:"",
    hasMore: false
  }
};
export default detail;
