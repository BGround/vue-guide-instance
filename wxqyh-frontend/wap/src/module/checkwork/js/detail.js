var detail = {
  //申诉详情数据
  detailData:{
    buttonConfig:{},  //操作按钮
    //状态描述转化
    statusDec:{
      2:'不通过',
      3:'申诉中',
      4:'通过'
    },
    repDetail:{
      data:{ //ajax入参数据
        page: '1',
        repId: '',
        size: '10',
        type: 'detailed',
      },
      buttonConfig:{},//操作按钮
      detail:{ //详情内容
        personName:"",
        signDate:"",
        headPic:"",
        auditTime:"",
        createTime:"",
        content:"",
        picList:[],//上传的图片列表
        status:"",
        buttonConfig:{},//操作按钮
        //负责人、相关人
        userListConfig:{},
        startList:[],
        repList:[],
      },
    }, //end
  }
};
export default detail;
