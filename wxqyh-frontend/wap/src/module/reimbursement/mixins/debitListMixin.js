import LoadMore from  '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import advancedSearch from '@/components/base/AdvancedSearch';
import userChoose from '@/components/base/user_or_dept_select'
import QwDebitList from '../components/list/list';
import QwAdvanceSearchBox from '@/components/base/search_box';
import { MY_REIM_URL, SEARCH_ADVANCED_URL, getSearchProjects, getSearchSubjects, deleteMyReim} from '../api/reimbursement';
import { searchLoanAndReimPage,ajaxLoanDelete,getConfigInfo as getLoanConfigInfo } from '../api/debit';
import {getConfigInfo as getReimConfigInfo} from '../api/editor'
import { mapMutations } from 'vuex';

export const debitListMixin = {
  components: {
    LoadMore,
    NoRecord,
    QwDebitList,
    userChoose
  },
  data() {
    return  {
      reimList: [],
      _isScrollLock: false,
      selectShow:false,
      statusText:'我发起的',
      queryType: '0',
      listType: '',
      pageSize: 20,
      title:'',
      params: {
        page: 1,
        // title: '',
      },
      loadMore: {
        loading: false,  // 是否正在加载
        currPage: '',
        maxPage: '',
        totalRows: '',
      },
      recordData:{
        icon: 'qwui-icon_text',
        title: this.$t('i18n.reim.info.noRecord'),
        text: '',
      },
      searchSetting: {
        show:true,
        keyWord:"",
        ridMask: false,
        setTopMask: true,
        closeLabel: true,
        rightSpan: {
          show: true,
          callback: this.showAdvancedSearch,
        },
      },
    };
  },
  computed: {
    isShowRecord() {
      return this.loadMore.totalRows !== '' && this.reimList.length == 0;
    },
    hasMore() {
      return this.loadMore.totalRows !== '' ? this.loadMore.currPage < this.loadMore.maxPage : true;
    },

    scrollViewHeight() {
      //43  搜索框的高度
      //40  请选择的我发起我相关,50 待办经办的高度
      //7  列表数据与顶部的margin
      //44  底部共xxx条单据的高度
      //82  下拉选择我相关的我发起的高度
      //报销、借款：43 + 40 + 7 + 44 + 82=216;43 + 40 + 7 + 44 = 134;待我处理：43 + 50 + 7 + 44 = 144
      let height = this.selectShow? 216 : 134;
      if(this.$route.name == 'newRelated'){
        height = 144;
      }
      return `${window.innerHeight - height}px`;
    }
  },
  created() {
    this.initRequestParams();
    if(this.$route.name=='newDraft' || !this.getStore(this.$route.name)){
      this.getReimList();
    }
  },
  beforeDestroy () {
    this._isScrollLock = true;
  },
  watch:{
    queryType(val){
      // 我相关的页面多了“我经办的”审批状态 (报销：status传 5  借款传100)
      if(this.advancedSetting){
        //有高级搜索条件的才会增加我经办的，否则不需要进行处理
        let approval = this.advancedSetting.find(v => v.key == 'queryVO.status' );
        if (val == 1) {
          let value = this.$route.name == 'debitList' ? 100 : 5;
          if (approval.value[approval.value.length - 1].text != '我经办的') {
            approval.value.push({text: '我经办的', value: value});
          }
        }else {
          if (approval && approval.value[approval.value.length - 1].text == '我经办的') {
            if(this.params['queryVO.status'] == 5 || this.params['queryVO.status'] == 100){
              //如果高级搜索有选中我经办的，则切换我提交的、我相关的时要清空已选择的status
              this.cacheSearchValue['queryVO.status'] = '';
              this.params['queryVO.status'] = '';
            }
            approval.value.pop();
          }
        }
      }
      this.loadData();
    }
  },
  methods: {
    // 初始化各路由的请求数据
    initRequestParams() {
      const { listType } = this.$route.meta;
      if(this.$route.meta.queryType){
        this.queryType = this.$route.meta.queryType;
      }
      this.listType = listType;
    },
    // 报销列表查询
    getReimList(title) {
      this.params={title,page: 1};
      if(this.cacheSearchValue){
        if(title){
          this.searchSetting.keyWord = title;
          this.$set(this.cacheSearchValue,'queryVO.title',title);
        }else {
          this.searchSetting.keyWord = '';
          this.$set(this.cacheSearchValue,'queryVO.title','');
        }
      }
      this.params = Object.assign(this.params,this.cacheSearchValue);
      this.loadData();
    },
    // 加载更多
    loadMoreData() {
      this.params.page ++;
      this.loadData();
    },
    //我相关的、我发起的
    selectStatus(text,val){
      this.statusText = text;
      this.queryType = val;
      this.selectShow = false;
      this.params.page = 1;
    },
    // 请求列表
    loadData() {
      _.showLoading();
      let params = Object.assign({},{ pageSize:this.pageSize,
                                      'queryVO.queryType':this.queryType,
                                      'queryVO.listType':this.listType },
                                      this.params);
      searchLoanAndReimPage(params).then((res) => {
        const { maxPage, totalRows, pageData, currPage } = res.data;

        if (!this.reimList.length || this.params.page == 1) {
          this.reimList = pageData || [];
        } else {
          this.reimList.push(...pageData);
        }

        this.loadMore.maxPage = maxPage;
        this.loadMore.currPage = currPage;
        this.loadMore.totalRows = totalRows;
        this._isScrollLock = false;
        _.hideLoading();
      }).catch((err) => {
        _.hideLoading();
        this._isScrollLock = false;
        console.log(err);
        _.alert('i18n.notice',err.desc);
      });
    },

    // 跳转到详情
    gotoDetail(reimData) {
      switch (this.$route.name) {
        case 'newReimbursement':
          this.$router.push({name: 'detail', query: {id: reimData.id}});
          break;
        case 'debitList':
          this.$router.push({name: 'debitDetail', query: {id: reimData.id}});
          break;
        case 'newRelated':
          let detail = reimData.type?'debitDetail':'detail';  //type 0为报销单 1为借款单
          this.$router.push({name: detail, query: {id: reimData.id}});
          break;
      }
    },
    // 下滑加载更多
    loadMoreScrollFun(el) {
      const scrollTop = el.scrollTop;
      const offsetHeight = el.offsetHeight;
      const scrollHeight = el.scrollHeight;

      if (scrollTop + offsetHeight == scrollHeight) {
        if (!this._isScrollLock && this.loadMore.currPage < this.loadMore.maxPage) {
          this._isScrollLock = true;
          this.loadMoreData();
        }
      }
    },
    /*// 下滑加载更多
    loadMoreScrollFun() {
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if(scrollTop + window.innerHeight >= document.body.scrollHeight ) {
        if (!this._isScrollLock && this.loadMore.currPage < this.loadMore.maxPage) {
          this._isScrollLock = true;
          this.loadMoreData();
        }
      }
    },*/
  },
};

export const debitSearchMixin = {
  components: {
    advancedSearch,
    QwAdvanceSearchBox,
  },
  data() {
    return {
      database:dataBase,
      isShowAdvanced: false,
      //  借款高级搜索设置
      advancedSetting: [
        {
          label: '审批状态',
          key: 'queryVO.status',
          type: 'radio',
          value: [  //0草稿 1审批中 2取消 3退审 4待转账 5待还款 6已还款 100我经办的
            { text: '全部', value: '' },
            { text: '审批中', value: '1' },
            { text: '已审批', value: '4' },
            // { text: '已转账', value: '2' },
            { text: '待还款', value: '5' },
            { text: '已还款', value: '6' },
            { text: '已取消', value: '2' },
            { text: '已退审', value: '3' },
          ],
        },
        {
          label: '单据类型',
          key: 'queryVO.typeId',
          type: 'select',
          value: [{ text: '请选择', value: '' }]
        },
        {
          label: '单据编号',
          key: 'queryVO.loanNo',
          type: 'text',
          placeholder: '请输入'
        },
        {
          label: '单据标题',
          key: 'queryVO.title',
          type: 'text',
          placeholder: '请输入'
        },
        {
          label: '所属部门',
          key: 'queryVO.deptId',
          type: 'selectUserOrDepart',
          selectConfig: dataBase.selectConfig,
          selectType: 'depts',
          deptRestriction: 1
        },
        {
          label: '创建时间',
          key: ['queryVO.startTime', 'queryVO.endTime'],
          type: 'date',
          format: 'YYYY-MM-DD' //用来控制日期展示的格式以及返回的数据格式
        },
      ],
      cacheSearchValue: {
        'queryVO.status': '',
        'queryVO.typeId': '',
        'queryVO.loanNo': '',
        'queryVO.title': '',
        'queryVO.deptId': '',
        'queryVO.startTime': '',
        'queryVO.endTime': '',
        'queryVO.projId': '',
        'queryVO.subjId' : '',
      },
      // 报销中不一样的高级搜索设置
      //报销的审批状态
      reimStatus:{
        label: '审批状态',
        key: 'queryVO.status',
        type: 'radio',
        value: [  //6已转账；5我经办的；4已取消；3已退审；2已审批；1审批中；为空时则表示全部
          { text: '全部', value: '' },
          { text: '审批中', value: '1' },
          { text: '已审批', value: '2' },
          { text: '已退审', value: '3' },
          { text: '已取消', value: '4' },
        ],
      },
      // 报销的成本中心项
      reimProjectIds:{
        label: '所属成本中心',
        key: 'queryVO.projId',
        type: 'select',
        value: [{ text: '请选择', value: '' }]
      },
      // 报销的科目筛选项
      reimSubjectIds:{
        label: '所属科目',
        key: 'queryVO.subjId',
        type: 'select',
        value: [{ text: '请选择', value: '' }]
      },
      // 待我处理页的单据类型换成单选按钮的形式
      relatedType:{
        label: '单据类型',
        key: 'queryVO.listType',
        type: 'radio',
        value:[
          {text:'全部',value:'2'},
          {text:'报销',value:'0'},
          {text:'借款',value:'1'},
          ]
      },
    };
  },
  created() {
    // 初始化页面数据
    this.initData();
  },
  methods: {
    initData() {
      switch (this.$route.name) {
        case 'newReimbursement':
          // 使用报销的高级搜索替换审批状态,去掉所属部门,添加成本中心，报销科目
          this.advancedSetting.splice(0,1,this.reimStatus);
          // this.advancedSetting.splice(4,1);
          this.advancedSetting.splice(5,0,this.reimProjectIds,this.reimSubjectIds);
          break;
        case 'debitList':
          break;
        case 'newRelated':
          // 添加成本中心，报销科目，修改单据类型
          this.advancedSetting.splice(4,0,this.reimProjectIds,this.reimSubjectIds);
          this.advancedSetting.splice(1,1,this.relatedType);
          this.advancedSetting.splice(0, 1);
          break;
      }
      // 根据后台请求科目和成本中心选择项
      this.getAdvanceOption();
    },
    // 高级搜索查询
    advancedSearch(searchObj) {
      let depts = searchObj['queryVO.deptId'];
      if(searchObj['queryVO.deptId']&&searchObj['queryVO.deptId'].depts){
        searchObj['queryVO.deptId'] = searchObj['queryVO.deptId'].depts.map(item=>item.id).join(',');
      }
      this.params = Object.assign({}, searchObj, {
        // title: '',
        page: 1,

      });
      if(this.$refs.searchBox){
        this.$refs.searchBox.getKeyWord = searchObj['queryVO.title'];
      }
      this.$set(this.searchSetting,'keyWord',searchObj['queryVO.title']);
      searchObj['queryVO.deptId'] = depts;
      this.cacheSearchValue = searchObj;
      this.loadData();
    },

    setStore(key, value) {
      value = JSON.stringify(value);
      sessionStorage.setItem(key, value);
    },
    getStore(key) {
      return JSON.parse(sessionStorage.getItem(key));
    },

    // 向后台请求选择项
    getAdvanceOption() {
      let loanTypes = [];
      let typeSetting = this.findSearchItem('queryVO.typeId');
      switch (this.$route.name) {
        case 'newReimbursement':
          // 请求设置报销单类型,报销科目，成本中心
          this.setReimTypeList();
          this.setSubjectsAndProjects();
          break;
        case 'debitList':
          // 请求设置借款单类型
          this.setLoanTypeList();
          break;
        case 'newRelated':
          // 请求设置报销科目，成本中心
          this.setSubjectsAndProjects();
          break;
      }
    },
    /*// 请求报销单单据类型
    setReimConfig(){
      getReimConfigInfo().then((res) => {
        if (res.code === '0') {  // 单据类型
          let typeSetting = this.findSearchItem('queryVO.typeId');
          this.setAdvanceOption(res.data.typeList, typeSetting, 'typeName', 'typeId');
        }
      });
      getSearchProjects().then((res)=>{
        if (res.code == '0') {  // 成本中心
          let projectsSetting = this.findSearchItem('queryVO.projId');
          this.setAdvanceOption(res.data.projList, projectsSetting, 'projName', 'projId');
        }
      });
      getSearchSubjects().then((res)=>{
        if (res.code == '0') {  // 报销科目
          let subjectsSetting = this.findSearchItem('queryVO.subjId');
          this.setAdvanceOption(res.data.subjList, subjectsSetting, 'subjFullName', 'subjId');
        }
      });
    },*/
    // 请求设置报销单成本中心及科目
    setSubjectsAndProjects(){
      getSearchProjects().then((res)=>{
        if (res.code == '0') {  // 成本中心
          let projectsSetting = this.findSearchItem('queryVO.projId');
          this.setAdvanceOption(res.data.projList, projectsSetting, 'projName', 'projId');
        }
      });
      getSearchSubjects().then((res)=>{
        if (res.code == '0') {  // 报销科目
          let subjectsSetting = this.findSearchItem('queryVO.subjId');
          this.setAdvanceOption(res.data.subjList, subjectsSetting, 'subjFullName', 'subjId');
        }
      });
    },
    //请求设置报销单单据类型
    setReimTypeList(){
      getReimConfigInfo().then((res) => {
        if (res.code === '0') {  // 单据类型
          let typeSetting = this.findSearchItem('queryVO.typeId');
          this.setAdvanceOption(res.data.typeList, typeSetting, 'typeName', 'typeId');
        }
      });
    },
    // 请求借款单单据类型
    setLoanTypeList(){
      getLoanConfigInfo().then((res) => {
        if (res.code === '0') {  // 单据类型
          let typeSetting = this.findSearchItem('queryVO.typeId');
          this.setAdvanceOption(res.data.loanTypes, typeSetting, 'typeName', 'typeId');
        }
      });
    },

    // 设置高级搜素选择项
    setAdvanceOption(list, setting, nameKey, valKey) {
      list.forEach((item) => {
        setting.value.push({
          text: item[nameKey],
          value: item[valKey],
        });
      });
    },
    // 显示高级搜索页面, 并禁止底层页面滚动
    showAdvancedSearch() {
      this.$set(this.cacheSearchValue, 'queryVO.title',this.searchSetting.keyWord);
      this.isShowAdvanced = true;
      this.setScrollLock(true);
    },
    // 隐藏高级搜索页面
    hideAdvancedSearch() {
      this.isShowAdvanced = false;
      this.setScrollLock(false);
    },
    findSearchItem(val) {
      return this.advancedSetting.find((item) => {
        return item.key == val;
      });
    },
    ...mapMutations({
      'setScrollLock': 'SET_SCROLL_LOCK',
    }),
  },
};


export const deleteDebitMixin = {
  created() {
    // 底部弹窗配置项
    dataBase.dialogBottomConfig = {
      show: false,
      title: '',
      btnConfig: [
        { title: 'i18n.deleteOne', callBack: null, primary: true },
        { title: 'i18n.cancel', callBack: null }
      ],
    };
  },
  methods: {
    // 显示弹窗,点击确定删除对应报销单
    showOperate(id, type, index) {
      // 我的报销页调用删除报销单接口，我的接口页调用删除借款单接口,type 0为报销1为借款
      // let deleteBill = type ? this.deleteRebit:this.deleteReim;
      dataBase.dialogBottomConfig.show = true;
      dataBase.dialogBottomConfig.btnConfig[0].callBack = () => {
        this.confirmDelete(id,type, index);
        dataBase.dialogBottomConfig.show = false;
      }
    },
    confirmDelete(id, type, index) {
      _.alert('', 'i18n.reim.info.confirmDelete', {
        primaryBtn: { name: 'i18n.confirm', callBack: () => { this.deleteBill(id, type, index) }},
        defaultBtn: { name: 'i18n.cancel', callBack: null }
      });
    },
    deleteBill(id, type, index){
      let deleteFn = type ? ajaxLoanDelete:deleteMyReim;
      _.showLoading();
      deleteFn({id}).then(() => {
        _.hideLoading();
        _.tooltips_succeed('i18n.deleteSuccess');
        setTimeout(() => {
          this.params.page = 1;
          this.loadData();
        }, 500);
      }).catch((res) => {
        _.hideLoading();
        _.alert('i18n.notice', res.desc, {
          primaryBtn: { name: 'i18n.confirm', callBack: null },
          defaultBtn: { name: '', callBack: null }
        });
      });
    }
  }
}
