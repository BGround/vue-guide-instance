<template>
  <div class="wrap">
    <div class="qwui-search_box_height"></div>
    <!--搜索-->
    <div class="qwui-menu_tab_fixed active">
      <search-bar :searchinput="searchBar" @listenToSearchBox="search"></search-bar>
    </div>

    <!-- 列表  -->
    <index-list :list="contentList" :listParam="listParam"></index-list>

    <!--加载更多-->
    <load-more :loading="loading"
                    :hasMore="hasMore"
                    :type="'commentList'"
                    @loadMoreClick="loadMoreList">
            <span v-if="contentList.length === 0">
                <no-record :hasrecord="hasRecord"></no-record>
            </span>
            <span v-else>已经到底了</span>
    </load-more>

  </div>
</template>
<script>
  import searchBar from '@/components/base/search_box.vue';
  import indexList from './indexList.vue';
  import loadMore from '@/components/list/load_more';
  import noRecord from '@/components/base/no_record';
  import {getBlessList} from '../../api/getData';
export default {
  data(){
    return {
        searchBar:{ //头部搜索框
            show:true,
            keyWord:'',
            ridMask: true, // 搜索时隐藏空白页
        },
        listParam: { //传到list页的数据
            dynamicType: '', //记录当前选择的类型
            schType: '10',
            keyWord: '',
            isPassReview: false
        },
        page: 1,
        pageSize: 10,
        maxPage: 1,
        keyWord: '',
        contentList: [],
        loading: false,
        lock_roll: false, // 锁住滚动
        hasRecord:{ // 无记录提示
            show:true,
            setTop:false,//是否置顶?覆盖整个页面
            icon:"qwui-icon_text",
            title:"没有内容",//若text无内容则title为16px #bbb，有则为18px #666
            text:"可通过管理后台发布内容",//标题下面的提示
        }
    }
  },
  created:function () {
    this.getList(0);
    window.addEventListener('scroll', this.scrollList);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollList);
  },
  computed:{
        hasMore() {
            return this.page < this.maxPage;
        }
  },
  methods:{
      // 搜索
      search(name){
          var self = this;
          self.keyWord = name;
          self.page = 1;
          self.getList(0);
      },
      // 获取列表 0 - 第一次/第一页  1 - 翻页
      getList(type){
          var self = this;
          if(self.loading){
              return;
          } else {
              self.loading = true;
          }
          var dataPost={
              'belongAgent': dataBase.wxqyh_uploadfile.agent,
              'page': self.page,
              'pageSize': self.pageSize,
              'searchValue.title': self.keyWord,
              'searchValue.sendType': ''
          };
          getBlessList(dataPost, (result)=>{
              // 解决数据返回pageData
              if(type==0) {
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
               }
              self.contentList = type == 0 ? result.data.pageData || [] :self.contentList.concat(result.data.pageData);
              self.page = result.data.currPage;
              self.maxPage = result.data.maxPage;
              self.loading = false;
              self.lock_roll=false;
          })
      },
      // 滚动事件
      scrollList() {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
            if(!this.lock_roll && this.hasMore){
                this.lock_roll=true;
                this.loadMoreList();
            }
        }
      },
      // 加载更多： 翻页
      loadMoreList() {
            this.page++;
            this.getList(1);
      }
  },
  components:{searchBar, indexList, loadMore, noRecord},
}
</script>
<style lang="scss" scoped>
.qwui-search_box_height{
  height: 43px;
}
.qwui-showMoreList{
    font-size: 14px;
    color: #999;
    line-height: 44px;
    text-align: center;
  }

</style>
