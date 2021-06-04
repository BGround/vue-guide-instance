var ranking = {
  rankingData:{
    loginRankData:{

    },
    loadMore:{
      url:"", //请求路径
      pageIndexName:"page",
      data:{ //ajax入参数据

      },
      padeConfig:{
        currPage:"",
        maxPage:"",
        pageData:[],  //返回的列表数据
        totalRows:"",//数据总条数s
      },
      hasRecord:{
        show:false,
        setTop:false,//是否置顶?覆盖整个页面
        icon:"qwui-icon_text",
        title:"i18n.noOnListDec",//若text无内容则title为16px #bbb
        text:"i18n.noOnListText",
      },
    },
    rankContentList:{
      dialogListConfig: { // 点状弹窗列表操作
        show: false, //控制弹窗显示与否
        title: "", //头部标题，设置为空的话不显示
        btnConfig:[]//自定义弹框操作,可以设置回调函数
      }
    },
    selectConfig:{
      show:false,
      signIndex:'',
      selectList:{
        "ccPersonList": {
          "title":"",
          "userSelected": [],
          "deptSelected":[],
          "deptSelectedShow": false,
          "callBack": {
            "confirm": null,
          },
          deptRestriction:1
        },
      }
    },
    commitDraft: { // 更新 方法
      draftFormData: { // 更新 数据格式
        'ccSelectId':0,
        //以下是更新用到参数
        'tbQyCheckworkPO.checkworkId':'',
        'ccDeptIds': [],
      }
    }
  }
};
export default ranking;
