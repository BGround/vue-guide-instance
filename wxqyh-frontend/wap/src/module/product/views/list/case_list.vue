<template>
    <div class="wrap"
        v-qw-water-mark="{ agentCode: 'productinfo',isShow: !isOpen }">
        <!--搜索框-->
        <div class="qwui-search_box_height"></div>
        <div class="search_fixed">
            <search-box :searchinput="searchBar"
                        :placeholder="placeholder"
                        @listenToSearchBox="doSearch"
                        ref="searchBar"></search-box>
        </div>
        <!--列表-->
        <div v-if="pageConfig.pageData.length > 0">
            <user-item v-for="(item,index) in pageConfig.pageData" :key="index"
                      :itemId="item.caseId"
                      :avatar="item.caseImg"
                      :name="item.title"
                      :desc="item.summary"
                      imgType="others"
                      @clickItem="goToCaseDetail"></user-item>
        </div>

        <!--加载更多-->
        <load-more class="loadmore_wrap"    
               :loading="loading"        
               :hasMore="hasMore"
               type="commentList"
               @loadMoreClick="loadMore"
               >
            <span>没有更多案例啦</span>
        </load-more>
    </div>    
</template>

<script>
import searchBox from "@/components/base/search_box";
import loadMore from '@/components/list/load_more';
import userItem from '../../components/user_list';
import {getCaseList} from '../../api/getData.js';
import qwWaterMark from '@/directive/qwWaterMark'
export default {
    directives: { qwWaterMark },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },        
    },
    data(){
        return{
            searchBar:{  // 搜索框
                show: true,
                ridMask: true, // 隐藏搜索空白
                keyWord: '',
            },
            placeholder:'搜索',
            listParam: { //传到list页的数据
                currentPage: 1,
                pageSize: 10,
                productId: '',
                keyword: ''
            },
            pageConfig: {
                currPage: 0,
                maxPage: 0,
                totalRows: 0,
                pageData: []
            },
            loading: false,
            lock_roll:false,
        }
    },
    created(){
        window.addEventListener('scroll',this.scrollList);
        this.clearLoadFun();
    },
    beforeDestroy(){   //组件被停用(离开路由)
        window.removeEventListener('scroll',this.scrollList);
    },
    computed:{
        id(){
            return this.$route.query.productId;
        },
        hasMore(){
            return this.pageConfig.currPage < this.pageConfig.maxPage;
        }
    },
    methods:{
        doSearch(keyWord){
            // 获取列表
            this.clearLoadFun(keyWord);
        },
        // 第一次请求/重新请求
        clearLoadFun(keyword){
            var self = this;
            //初始化返回数据
            self.listParam={
                currentPage: 1,
                pageSize: 10,
                productId: self.id,
                keyword: keyword ? keyword : ''
            };
            self.pageConfig = {
                currPage: 0,
                maxPage: 0,
                totalRows: 0,
                pageData: []
            };
            // 重新获取列表
            self.getList()
        },
        // 获取列表
        getList(){
            var self = this;
            self.loading = true;
            self.lock_roll=true;
            getCaseList(self.isOpen, self.listParam,(data)=>{
                var list = data.pageData;
                if(list){
                    self.pageConfig.pageData = self.pageConfig.pageData.concat(list);
                }                
                self.pageConfig.currPage = data.currPage;
                self.pageConfig.maxPage = data.maxPage;
                self.pageConfig.totalRows = data.totalRows;
                self.lock_roll = false;
                self.loading = false;
            });
        },
        // 跳转案例详情
        goToCaseDetail(id){ 
            this.$router.push({
                path: this.isOpen ? '/open/caseDetail' : '/caseDetail',
                query:{
                    id: id,
                    userId: _.userId
                }
            })
        },
        //加载更多
        loadMore(){
            if(this.hasMore&&!this.loading){
                this.listParam.currentPage++;
                this.getList();
            }
        },
        // 滚动加载
        scrollList(e){
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
                if(!this.lock_roll && this.hasMore){
                    this.loadMore();                    
                }
            }
        },
    },
    components:{
        searchBox,
        loadMore,
        userItem
    }
    
}
</script>

<style lang="scss" scoped>
.wrap {
    .search_fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 1;
    }
    .qwui-search_box_height{
        height: 43px;
    }
}

/*加载更多*/
.loadmore_wrap {
    margin-bottom: 50px;
}

@media screen and (min-width: 1024px){
  .search_fixed{
    width: 740px !important;
    margin: 0 auto;
    left: 0;
    right: 0;
  }
}

</style>
