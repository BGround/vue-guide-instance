import SearchBar from './components/SearchBox.vue'
import LoadMore from './components/LoadMore.vue'
import UserTitleList from "@/components/list/user_title_list"

export var mixinPage = {
  data() {
    return {
      ZIndex: dataBase.ZIndex,
      busy: true,
      loading: false,
      lock_roll: false,
      setTimeId: 0,
      list: [],
      statusClassList: {
        '已关闭': 'gray',
        '退审': 'red',
        '已审批': 'green',
        '审批中': 'blue',
        '未关闭': 'blue',
        '已销假': 'green'
      }
    }
  },
  components: {
    SearchBar,
    LoadMore,
    UserTitleList
  },
  computed: {
    showrecord() {
      this.list = this.list || [];
      return this.list.length == 0 ? true : false;
    }
  },
  methods: {
    loadMore() {  // 加载更多
      this.postData.page++;
      this.loading = true;
      this.busy = true;
      this.initList(true);
    },
    setList(res, isLoadMore) {
      // 设置列表数据
      this.loading = false;
      _.hideLoading();
      if (res.code != "0") {
        return _.alert("提示", res.desc);
      }
      this.busy = res.data.maxPage == 0 ? true : (this.postData.page == res.data.maxPage);
      this.list =
        isLoadMore && this.list.length > 0
          ? this.list.concat(res.data.pageData)
          : (res.data.pageData ? res.data.pageData : []);
    },
    setStatusClass(status) {
      return this.statusClassList[status]
    }
  }
}