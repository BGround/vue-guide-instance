<template>
    <div v-qw-water-mark="{ agentCode: agentCode}">
        <search-bar :searchinput="searchBar" @listenToSearchBox="search_test"></search-bar>
        <ul class="qwui-people">
            <qw-view-list-person
                class="qwui-person"
                v-for="(person,index) in loadParam.people"
                :key="index"
                :avator="person.headPic"
                :name="person.personName"
                :date="person.createTime"
            ></qw-view-list-person>
        </ul>
        <!--加载更多-->
        <load-more  :loading="loading" 
                    :type="'commentList'"
				    :hasMore="hasMore"
                    @loadMoreClick="loadMoreList">
            <span v-if="total==0">暂未查到数据</span>
            <span v-else>共{{total}}人点赞</span>
        </load-more>
    </div>    
</template>

<script>
import QwViewListPerson from '../viewList/person';
import searchBar from '@/components/base/search_box.vue';
import loadMore from '@/components/list/load_more';
import {getPraiseList} from '../../api/getData';
import qwWaterMark from '@/directive/qwWaterMark';
export default {
    directives: { qwWaterMark },
    data(){
        return{            
            searchBar: { //头部搜索框
                show: true,
                keyWord: '',
                rightSpan: {
                    show: false,
                    callback: null
                },
            },
            id: this.$route.query.id,   // 新闻id
            loadParam:{
                firistLoading: true, //第一次加载
                lock_roll:false,
                people: [],         // 列表
                page: 1,
                pageSize: 15,
                maxPage: 1,
                total: null
            },            
            name: '',
            loading: false,  // 正在加载更多  
            agentCode: _.getUrlParam('agentCode') || 'dynamic',                         
        }
    },
    computed: {
        hasMore() {
            return this.loadParam.page < this.loadParam.maxPage;
        },
        // 当前页
        page() {
            return this.loadParam.page;
        },
        // 最大页数
        maxPage() {
             return this.loadParam.maxPage;
        },
        total() {
            return this.loadParam.total;
        },
        pageSize() {
            return this.loadParam.pageSize;
        }
    },
    created(){
        window.addEventListener('scroll', this.scrollList);
        // 获取点赞列表
        this.getList();        
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrollList);
    },
    methods:{
        // 列表
        getList(){
            var self = this;
            if(self.loading){
                return;
            } else {
                self.loading = true;
            }
            var dataPost = {
                'page': self.page,
                'searchValue.keyWord': self.name,
                'id': self.id,
                'pageSize': self.pageSize
            }
            getPraiseList(dataPost, (result)=>{
                if(result.data.pageData){
                    self.loadParam.people = self.page == 1 ? result.data.pageData :
                        self.loadParam.people.concat(...result.data.pageData);
                    self.loadParam.page = result.data.currPage;
                    self.loadParam.maxPage = result.data.maxPage;
                    self.loadParam.total = result.data.totalRows;
                    self.loading = false;
                    self.loadParam.lock_roll=false;
                }
            });
        },
        // 搜索框
        search_test(name) {
            this.loadParam.page = 1;
            this.name = name;
            this.getList();
        },
        // 滚动事件
        scrollList() {
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
                if(!this.loadParam.lock_roll && this.hasMore){
                    this.loadParam.lock_roll=true;
                    this.loadMoreList();
                }
            }
        },
        // 加载更多：翻页
        loadMoreList(){         
            this.loadParam.page++;
            this.getList(); 
        },
    },
    components: {
        QwViewListPerson,
        searchBar,
        loadMore
    },
    
}
</script>

<style lang="scss" scoped>
.qwui-search_wrap {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
}

.qwui-people {
   margin-top: 43px;
  .qwui-person {
    border-top: 1px solid #dfdfdd;

    &:last-child {
      border-bottom: 1px solid #dfdfdd;
    }
  }
}
@media screen and (min-width: 1024px){
  .qwui-search_wrap {
    width: 740px;
    margin: 0 auto;
    left: 0;
    right: 0;
  }
}
</style>
