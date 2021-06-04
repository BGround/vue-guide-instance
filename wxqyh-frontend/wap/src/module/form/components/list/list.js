
import SearchBar from '../base/newBase/SearchBox.vue'
import LoadMore from '../base/load_more.vue'

export const mixinList = { // 展示列表中公用的部分
  data() {
    return {
      statusClassList: {
        '已关闭': 'gray',
        '退审': 'red',
        '已审批': 'green',
        '审批中': 'blue',
        '未关闭': 'blue',
        '待执行': 'yellow',
        '执行中': 'blue',
        '已暂停': 'red',
        '已结束': 'gray',
        '已失效': 'gray',
        '已处理': 'gray',
        '未处理': 'blue',
      }
    }
  },
  methods: {
    setPagerNum(index) {
      //点击项的页码
      this.$store.state.formBase.pageData.paramPagerNum = index + 1;
      sessionStorage.setItem('pageData', JSON.stringify(this.$store.state.formBase.pageData));
    },
    noFind(e) {
      e.onerror = null;
      e.srcElement.src = require('@/assets/images/icon_person.png');
    },
    statusClass(task, is_close, is_over) {
      let status = this.showStatus(task, is_close, is_over);
      if (status == '') {
        return 'none'
      }
      return this.statusClassList[status];
    },
    isTask(task) { // 表单类型  0：普通弹， 1：任务单， 2：审批单， 3：外部单
      var text = ['普通单', '任务单', '审批单', '外部单'];
      return text[task];
    },
    showStatus(task, is_close, is_over) { // 表单显示状态
      if (task == 2 || task == 3) {
        if (is_over == "-1") {
          return '已关闭';
        } else if (is_over == "0") {
          return '退审';
        }
        if (is_close == "1") {
          return '已审批';
        } else {
          return '审批中';
        }
      } else if (task == 1) {
        if (is_over == "-1") {
          return '已关闭';
        } else {
          return '未关闭';
        }
      } else {
        return ''
      }
    },
    timeStr(createTime) { // 以月-日的形式获取时间，例如：.05-09
      if (createTime != null && createTime != 'null' && createTime != '') {
        try {
          createTime = new Date(createTime.substr(0, 10)).Format("MM-dd");
          let now = new Date().getFullYear();
          if(createTime.getFullYear() != now) {
            createTime = createTime.Format("yyyy-MM-dd");
          }else {
            createTime = createTime.Format("MM-dd");
          }
        } catch (e) {

        }
      }
      return createTime;
    },
    currentNodestr(currentNode) { // 当前节点
      if (currentNode) {
        return '当前节点：' + currentNode;
      }
      return '';
    },
    showRuleStatus(ruleStatus) { // 委托规则状态
      if (ruleStatus == 0) {
        return '已暂停'
      } else if (ruleStatus == 1){
        return '执行中'
      } else if (ruleStatus == 2){
        return '待执行'
      } else if (ruleStatus == 3){
        return '已结束'
      } else {
        return ''
      }
    },
    statusRuleStatusClass(ruleStatus) {
      let status = this.showRuleStatus(ruleStatus);
      if(status == '') {
        return 'none'
      }
      return this.statusClassList[status];
    },
    showRecordStatus(recordStatus){ // 委托记录状态
      if(recordStatus == -1) {
        return '已失效'
      }  else if (recordStatus == 0){
        return '未处理'
      } else if (recordStatus == 1){
        return '已处理'
      } else {
        return ''
      }
    },
    statusRecordStatusClass(recordStatus){
      let status = this.showRecordStatus(recordStatus);
      if(status == ''){
        return 'none'
      }
      return this.statusClassList[status];
    },
  }
}

export const mixinTab = { // 表单的各个Tab中公用的方法
  components: {
    SearchBar,
    LoadMore
  },
  data() {
    return {
      hasAdvance: false,
      searchBar: { //头部搜索框
        show: true,
        keyWord: '',
        rightSpan: {
          show: true,
          callback: null
        }
      },
      setting: {
        page: 1,
        keyWord: '',
        pageSize: 20
      },
      busy: true,
      loading: false,
      advancedSearchShow: false,
      isSearch: false,
      searchValue: {},
      cacheSearchValue: {},
      recordText: '',
      recordTitle: ''
    }
  },
  computed: {
    showrecord() {
      this.list = this.list || [];
      return this.list.length == 0 ? true : false;
    }
  },
  methods: {
    cache(key, cacheKey) { // 保存高级搜索条件到sessionStorage，实现条件缓存
      var _this = this;
      if (this.getStore(key) && this.getStore(cacheKey)) { //  根据缓存获取到高级搜索的搜索条件
        this.isSearch = true;
        this.searchValue = this.getStore(key);
        this.cacheSearchValue = this.getStore(cacheKey);
        this.setting.keyWord = this.searchValue['workOrderSearchVO.formTitle'] || '';
        this.$set(this.searchBar, 'keyWord', this.searchValue['workOrderSearchVO.formTitle'] || '');
      } else {
        this.searchValue = {};
        this.cacheSearchValue = {};
      }
    },
    loadMore() {  // 加载更多
      this.setting.page++;
      this.loading = true;
      this.busy = true;
      this.initList(true);
    },
    setList(res, isLoadMore) { // 设置列表数据
      this.loading = false;
      _.hideLoading();
      if (res.code != "0") {
        return _.alert('提示', res.desc);
      }
      this.busy = res.data.maxPage == 0 || this.setting.page == res.data.maxPage;
      this.list = isLoadMore && this.list.length > 0 ? this.list.concat(res.data.pageData) : res.data.pageData;
    },
    showMsgFromSearchBar(keyWord) {
      if (keyWord == this.setting.keyWord) {
        return
      }
      this.busy = true;
      this.list = [];
      this.setting.page = 1;
      this.setting.keyWord = keyWord;
      this.isSearch = this.isSearch;
      this.$set(this.searchValue, 'workOrderSearchVO.formTitle', keyWord);
      this.$set(this.cacheSearchValue, 'workOrderSearchVO.formTitle', keyWord);
      this.initList();
    },
    useAdvance() {  //是否有高级函数设置
      let values = Object.values(this.cacheSearchValue);
      this.hasAdvance = values.some(val => val != '');
    },
    advancedSearchClose() {
      this.advancedSearchShow = false;
    },
    //设置翻页的请求数据
    setPageData(searchValue, paramPageCount) {
      this.$store.commit('resetPageData');
      var pageData = this.$store.state.formBase.pageData;
      pageData.paramPageCount = paramPageCount;
      pageData.paramIsTask = searchValue['workOrderSearchVO.isTask'];
      pageData.paramTitle = searchValue['workOrderSearchVO.formTitle'] || searchValue.keyWord;
      pageData.paramSeniorSearch = this.hasAdvance ? 1 : 0;
      pageData.paramCreateaEndTime = searchValue['workOrderSearchVO.createaEndTime'];
      pageData.paramCreateaStartTime = searchValue['workOrderSearchVO.createaStartTime'];
      pageData.paramAuditStatus = searchValue['workOrderSearchVO.auditStatus'];
      pageData.paramAuditStartTime = searchValue['workOrderSearchVO.auditStartTime'];
      pageData.paramAuditEndTime = searchValue['workOrderSearchVO.auditEndTime'];
      pageData.paramDepartId = searchValue['workOrderSearchVO.departId'];
      pageData.paramCreatorId = searchValue['workOrderSearchVO.creatorId'] || searchValue['tbQyFlowEntrustRecordVO.consigneeUserId'] || '';
      pageData.paramCommentStatus = searchValue['workOrderSearchVO.commentStatus'];
      sessionStorage.setItem('pageData', JSON.stringify(pageData));
    },

    advancedSearch(searchValue) {
      let newSearchValue = JSON.parse(JSON.stringify(searchValue)),
        deptStr = '',
        userStr = '';
      if (newSearchValue['workOrderSearchVO.departId']) {
        let depts = newSearchValue['workOrderSearchVO.departId'].depts;
        depts && depts.forEach(function (item, index) {
          if (index == depts.length - 1) {
            deptStr += item.id;
          } else {
            deptStr += item.id + ',';
          }
        })
        newSearchValue['workOrderSearchVO.departId'] = deptStr;
      }
      if (newSearchValue['workOrderSearchVO.creatorId']) {
        let users = newSearchValue['workOrderSearchVO.creatorId'].users;
        users && users.forEach(function (item, index) {
          if (index == users.length - 1) {
            userStr += item.userId;
          } else {
            userStr += item.userId + ',';
          }
        })
        newSearchValue['workOrderSearchVO.creatorId'] = userStr;
      }
      // 被委托人
      if(newSearchValue['tbQyFlowEntrustRecordVO.consigneeUserId']){
        let users = newSearchValue['tbQyFlowEntrustRecordVO.consigneeUserId'].users;
        users && users.forEach(function(item, index){
          if(index == users.length - 1) {
            userStr += item.userId;
          } else {
            userStr += item.userId + '|';
          }
        })
        newSearchValue['tbQyFlowEntrustRecordVO.consigneeUserId'] = userStr;
      }
      this.setting.page = 1;
      this.setting.keyWord = searchValue['workOrderSearchVO.formTitle'] || '';
      this.$set(this.searchBar, 'keyWord', searchValue['workOrderSearchVO.formTitle'] || '');
      this.searchValue = newSearchValue;
      this.cacheSearchValue = searchValue;
      this.isSearch = true;
      this.busy = true;
      this.initList()
    },
    setStore(key, value) {
      value = JSON.stringify(value);
      sessionStorage.setItem(key, value);
    },
    getStore(key) {
      return JSON.parse(sessionStorage.getItem(key));
    }
  },
  watch: {
    'setting.keyWord': {
      handler(val) {
        this.recordTitle = '找不到相关记录';
        this.recordText = '';
        if (val == '') {
          this.recordText = '';
          this.recordTitle = '';
        }
      },
      deep: true
    },
    advancedSearchShow(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }
}
