const projSelectConfig = {
  id: 'id',
  title: 'name',
  hasChildren: 'hasChildren',
  checkType: 'radio',
  headPic: '',
  parentId: 'parentId',
};

const subjSelectConfig = {
  id: 'subjId',
  title: 'subjName',
  subTitle: 'subjExplain',
  hasChildren: 'hasChildren',
  checkType: 'radio',
  onlyChildCheck: true,
  headPic: '',
  parentId: 'subjectParentsId',
};

const state = {
  // 是否是认证号
  isVerified: false,
  // 工商注册全称
  corpNameInfo: '',
  // 新建页面滚动
  isViewScrollLock: false,
  // 是否显示请假单详情
  isShowAskDetail: false,
  // 是否显示用车单详情
  isShowVehDetail: false,
  // 是否显示借款详情
  isShowLoanDetail: false,
  // 是否显示发票信息
  isShowWxCardDetail: false,
  // 请假单详情数据
  askDetailData: null,
  // 用车单详情数据
  vehDetailData: null,
  // 借款详情
  loanDetailData: null,
  // 列表选中的借款单
  selectLoanData: null,
  // 发票详情数据
  wxCardDetailData: {
    gmfMc: '',
    xsfMc: '',
    jshj: '',
    kprq: '',
    fpDm: '',
    fpHm: '',
    kpxmc: '',
    cardId: '',
    cardCode: ''
  },
  wxCardInfoList: [],
  // 选择城市中的城市数据
  addressList: [],
  relationSelectConfig: {
    isShow: false,
    // veh, ask
    type: '',
    totalText: '',
    reimCreator: '',
    selected: '',
    "callBack": {
      "confirm": null,
      "close": null
    },
  },
  // 选择部门配置
  deptSelectConfig: {
    show: false,
    signIndex:'dept',
    selectList: {
      "dept": {
        "title": "",
        "selectType": "user",
        "userName": "incharges",
        "deptSelected": [],
        "deptSelectedShow": true,
        "deptRestriction": 1,
        "callBack": {
          "confirm": null,
          "close": null
        }
      }
    }
  },
  treeSelectConfig: {
    isShow: false,
    treeType: '',
    selected: {},
    config: {},
    "callBack": {
      "confirm": null,
      "close": null
    }
  }
};

const getters = {
  isVerified: state => state.isVerified,
  corpNameInfo: state => state.corpNameInfo,
  isViewScrollLock: state => state.isViewScrollLock,
  isShowAskDetail: state => state.isShowAskDetail,
  isShowVehDetail: state => state.isShowVehDetail,
  isShowLoanDetail: state => state.isShowLoanDetail,
  isShowWxCardDetail: state => state.isShowWxCardDetail,
  askDetailData: state => state.askDetailData,
  vehDetailData: state => state.vehDetailData,
  loanDetailData: state => state.loanDetailData,
  selectLoanData: state => state.selectLoanData,
  wxCardDetailData: state => state.wxCardDetailData,
  wxCardInfoList: state => state.fapiaoInfoList,
  addressList: state => state.addressList,
  deptSelectConfig: state => state.deptSelectConfig,
  treeSelectConfig: state => state.treeSelectConfig,
  relationSelectConfig: state => state.relationSelectConfig,
};

const mutations = {
  updateWxCardInfoList(state, list) {
    state.wxCardInfoList = list;
  },
  setLoanData(state, data) {
    state.selectLoanData = data;
  },
  updateVerifiedState(state, isVerified) {
    state.isVerified = isVerified
  },
  updateCorpNameInfo(state, info) {
    state.corpNameInfo = info;
  },
  updateViewScrollLock(state, isLock) {
    state.isViewScrollLock = isLock;
  },
  updateAskDetail(state, payload = { isShow: false, data: {}}) {
    state.isShowAskDetail = payload.isShow;
    state.askDetailData = payload.data;
  },
  updateVehDetail(state, payload = { isShow: false, data: {}}) {
    state.isShowVehDetail = payload.isShow;
    state.vehDetailData = payload.data;
  },
  updateLoanDetail(state, payload = { isShow: false, data: {}}) {
    state.isShowLoanDetail = payload.isShow;
    state.loanDetailData = payload.data;
  },
  updateWxCardDetail(state, payload = { isShow: false, data: {}}) {
    state.isShowWxCardDetail = payload.isShow;
    state.wxCardDetailData = payload.data;
  },
  setAddressList(state, list) {
    state.addressList = list;
  },
  updateRelationConfig(state, payload = { isShow: false, type: ''}) {
    let relation = state.relationSelectConfig;

    relation.isShow = payload.isShow;
    relation.type = payload.type;
    relation.selected = payload.data;

    relation.callBack.confirm = function(data) {
      if (payload.callBack.confirm) {
        payload.callBack.confirm(data);
      }
      relation.isShow = false;
      relation.type = '';
    }

    relation.callBack.close = function() {
      if (payload.callBack.close) {
        payload.callBack.close();
      }
      relation.isShow = false;
      relation.type = '';
    }
  },
  hideDeptSelect() {
    state.deptSelectConfig.show = false;
  },
  updateDeptSelectConfirm(state, payload){
    //初始化选人数据
    let deptList = state.deptSelectConfig.selectList.dept;
    if (payload.data) {
      deptList.deptSelected = [payload.data];
    } else {
      deptList.deptSelected = [];
    }

    state.deptSelectConfig.show = true;
    //选人确定回调
    deptList.callBack.confirm = function (el, obj) {
      if(payload.callBack.confirm){
        payload.callBack.confirm(obj)
      }
    }
    deptList.callBack.close = function(el) {
      if (payload.callBack.close) {
        payload.callBack.close();
      }
    }
  },
  updateTreeSelectConfig(state, payload = { isShow: false, treeType: '' }) {
    const tree = state.treeSelectConfig;
    tree.isShow = payload.isShow;
    tree.treeType = payload.treeType;
    tree.selected = payload.data;

    if (payload.treeType == 'showProjectData') {
      tree.config = projSelectConfig;
    } else if (payload.treeType == 'showSubjectData') {
      tree.config = subjSelectConfig;
    }

    tree.callBack.confirm = function(data) {
      if (payload.callBack.confirm) {
        payload.callBack.confirm(data);
      }
      tree.isShow = false;
      tree.treeType = '';
    }

    tree.callBack.close = function() {
      if (payload.callBack.close) {
        payload.callBack.close();
      }
      tree.isShow = false;
      tree.treeType = '';
    }
  },
};

export default {
  state,
  getters,
  mutations,
};
