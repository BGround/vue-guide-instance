import LoadMore from  '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import SearchBox from '@/components/base/search_box';
import QwReimList from '../components/reimlist/ReimList';
import QwAdvancedSearch from '@/components/base/AdvancedSearch';
import {
  MY_REIM_URL,
  SEARCH_ADVANCED_URL,
  getReimList,
  getSearchProjects,
  getSearchSubjects,
  getSearchTypes,
  deleteMyReim
} from '../api/reimbursement';

export const reimListMixin = {
  components: {
    LoadMore,
    NoRecord,
    QwReimList,
    SearchBox,
  },
  data() {
    return  {
      reimList: [],
      _isScrollLock: false,
      url: '',
      status: '',
      type: '',
      pageSize: 10,
      params: {
        page: 1,
        keyWord: '',
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
        ridMask: false,
        setTopMask: true,
        closeLabel: true,
        rightSpan: {
          show: true,
          callback: this.showAdvancedSearch,
        }
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
  },
  created() {
    this.initRequestParams();
    this.getReimList();
  },
  beforeDestroy () {
    this._isScrollLock = true;
  },
  methods: {
    // 初始化各路由的请求数据
    initRequestParams() {
      const { status, type } = this.$route.meta;

      this.status = status;
      this.type = type;
    },
    // 报销列表查询
    getReimList() {
      this.url = MY_REIM_URL;

      this.params.page = 1;
      this.loadData();
    },
    // 加载更多
    loadMoreData() {
      this.params.page ++;
      this.loadData();
    },
    // 请求列表
    loadData() {
      _.showLoading();
      const { url, pageSize, status, type } = this;
      let params = Object.assign({},{ pageSize, status, type }, this.params);
      getReimList(url, params).then((res) => {
        const { maxPage, totalRows, pageData, currPage } = res.data;

        if (this.params.page == 1 || !this.reimList.length) {
          this.reimList = pageData || [];
        } else {
          this.reimList.push(...pageData);
        }

        // 我的单据列表少于10则隐藏搜索栏
        if (this.isFirstLoad) {
          if (totalRows > 10) {
            this.isSearchShow = true;
          }
        }
        this.isFirstLoad = false;

        this.loadMore.maxPage = maxPage;
        this.loadMore.currPage = currPage;
        this.loadMore.totalRows = totalRows;

        this._isScrollLock = false;
        _.hideLoading();
      }).catch((err) => {
        _.hideLoading();
        this._isScrollLock = false;
        _.alert('i18n.notice',err.desc);
      });
    },
    getSearchRequest(keyWord) {
      this.recordData.title = this.$t('i18n.reim.info.noReimList');
      this.params.keyWord = keyWord;
      this.getReimList();
    },
    searchChange(keyWord) {
      this.params.keyWord = keyWord;
    },
    // 跳转到详情
    gotoDetail(reimData) {
      // window.location.href = `${_.baseURL}/jsp/wap/reimbursement/detail.jsp?reimId=${reimData.reimId}`;
      this.$router.push({ name: 'detail' , query: { id: reimData.reimId }});
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
  },
};

export const advancedSearchMixin = {
  components: {
    QwAdvancedSearch,
  },
  data() {
    return {
      isShowAdvanced: false,
      //  高级搜索设置
      advancedSetting: [
        {
          label: this.$t('i18n.reim.approveState'),
          key: 'tbQyReimbursementVO.approvalStatus',
          type: 'radio',
          value: [
            { text: this.$t('i18n.all'), value: '' },
            { text: this.$t('i18n.reim.status.approving'), value: '1' },
            { text: this.$t('i18n.reim.status.approved'), value: '2' },
            { text: this.$t('i18n.reim.status.transferred'), value: '6' },
            { text: this.$t('i18n.reim.status.retreat'), value: '3' },
            { text: this.$t('i18n.reim.status.cancel'), value: '4' },
          ],
        },
        {
          label: this.$t('i18n.reim.reimNo'),
          key: 'tbQyReimbursementVO.reimNo',
          type: 'text',
          placeholder: this.$t('i18n.pleaseEnter')
        },
        {
          label: this.$t('i18n.reim.reimTitle'),
          key: 'tbQyReimbursementVO.title',
          type: 'text',
          placeholder: this.$t('i18n.pleaseEnter')
        },
        {
          label: this.$t('i18n.reim.dept'),
          key: 'tbQyReimbursementVO.departmentName',
          type: 'text',
          placeholder: this.$t('i18n.pleaseEnter')
        },
        {
          label: this.$t('i18n.reim.editor.reimType'),
          key: 'tbQyReimbursementVO.typeId',
          type: 'select',
          value: [{ text: this.$t('i18n.pleaseSelect'), value: '' }]
        },
        {
          label: this.$t('i18n.reim.reimProject'),
          key: 'tbQyReimbursementVO.projectIds',
          type: 'select',
          value: [{ text: this.$t('i18n.pleaseSelect'), value: '' }]
        },
        {
          label: this.$t('i18n.reim.belongSubject'),
          key: 'tbQyReimbursementVO.subjectIds',
          type: 'select',
          value: [{ text: this.$t('i18n.pleaseSelect'), value: '' }]
        },

        {
          label: this.$t('i18n.reim.createTime'),
          key: ['tbQyReimbursementVO.startTime', 'tbQyReimbursementVO.endTime'],
          type: 'date',
          format: 'YYYY-MM-DD', //用来控制日期展示的格式以及返回的数据格式
          placeholder: this.$t('i18n.pleaseSelect')
        },
      ],
      cacheSearchValue: {
        'tbQyReimbursementVO.approvalStatus': '',
        'tbQyReimbursementVO.typeId': '',
        'tbQyReimbursementVO.reimNo': '',
        'tbQyReimbursementVO.title': '',
        'tbQyReimbursementVO.projectIds': '',
        'tbQyReimbursementVO.subjectIds': '',
        'tbQyReimbursementVO.startTime': '',
      },
    };
  },
  created() {
    // 初始化页面数据
    this.initData();
  },
  methods: {
    initData() {
      // 我的单据，类型文案要区分
      if (this.$route.name == 'reimbursement') {
        let type = this.advancedSetting.find(v => v.key == 'tbQyReimbursementVO.typeId');
        type.label = this.$t('i18n.reim.type');
      }

      // 待我审批页面不需要要审批状态选项
      if (this.$route.name == 'approved') {
        let approvalIndex = this.advancedSetting.findIndex(v => v.key == 'tbQyReimbursementVO.approvalStatus');
        this.advancedSetting.splice(approvalIndex, 1);
      }

      // 我相关的页面多了“我经办的”审批状态
      if (this.$route.name == 'related') {
        let approval = this.advancedSetting.find(v => v.key == 'tbQyReimbursementVO.approvalStatus' );
        approval.value.push({ text: this.$t('i18n.reim.status.handle'), value: '5' });
      }

      // 根据后台请求科目和成本中心选择项
      this.getAdvanceOption();
    },
    // 高级搜索查询
    advancedSearch(searchObj) {
      this.params = Object.assign({}, searchObj, {
        keyWord: '',
        page: 1,
      });

      this.url = SEARCH_ADVANCED_URL;
      this.$refs.searchBox.closeDialog();
      this.loadData();
    },
    // 向后台请求选择项
    getAdvanceOption() {
      Promise.all([getSearchProjects(), getSearchSubjects(), getSearchTypes()]).then((resArr) => {
        let projectSetting = this.findSearchItem('tbQyReimbursementVO.projectIds');
        let subListSetting = this.findSearchItem('tbQyReimbursementVO.subjectIds');
        let typeListSetting = this.findSearchItem('tbQyReimbursementVO.typeId');

        this.setAdvanceOption(resArr[0].data.projList, projectSetting, 'projName', 'projId');
        this.setAdvanceOption(resArr[1].data.subjList, subListSetting, 'subjName', 'subjId');
        this.setAdvanceOption(resArr[2].data.typeList, typeListSetting, 'typeName', 'typeId');
      }).catch((err) => {});
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
    // 显示高级搜索页面
    showAdvancedSearch() {
      this.isShowAdvanced = true;
    },
    // 隐藏高级搜索页面
    hideAdvancedSearch() {
      this.isShowAdvanced = false;
    },
    findSearchItem(val) {
      return this.advancedSetting.find(item => item.key == val);
    },
  },
};

export const deleteReimMixin = {
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
    showOperate(reimId, index) {
      dataBase.dialogBottomConfig.show = true;
      dataBase.dialogBottomConfig.btnConfig[0].callBack = () => {
        this.confirmDelete(reimId, index);
        dataBase.dialogBottomConfig.show = false;
      }
    },
    confirmDelete(reimId, index) {
      _.alert('', 'i18n.reim.info.confirmDelete', {
        primaryBtn: { name: 'i18n.confirm', callBack: () => { this.deleteReim(reimId, index) }},
        defaultBtn: { name: 'i18n.cancel', callBack: null }
      });
    },
    //  删除对应报销单,删除成功后重载列表
    deleteReim(id) {
      _.showLoading();
      deleteMyReim({id}).then(() => {
        _.hideLoading();
        _.tooltips_succeed('i18n.deleteSuccess');
        setTimeout(() => {
          this.params.page = 1;
          this.loadData();
        }, 500);
      }).catch(res => {
        _.hideLoading();
        _.alert('i18n.reim.info.deleteFail', res.desc, {
          primaryBtn: { name: 'i18n.confirm', callBack: null },
          defaultBtn: { name: '', callBack: null }
        });
      });
    },
  },
};
