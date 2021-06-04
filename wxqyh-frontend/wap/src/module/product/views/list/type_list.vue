<template>
    <div class="wrap"
        v-qw-water-mark="{ agentCode: 'productinfo' }">
         <!--搜索框-->
        <div class="qwui-search_box_height"></div>
        <div class="search_fixed">
            <search-box :searchinput="searchBar"
                        :placeholder="placeholder"
                        @listenToSearchBox="doSearch"
                        ref="searchBar"></search-box>
        </div>
        <!--返回上一级-->
        <div class="back_wrap" v-show="pid!='0'">
            <i class="back_icon"></i>
            <return-back class="back_btn"
                    @returnBack="returnBack"></return-back>
        </div>
        <!--类别列表-->
        <tree-item v-show="pageConfig.typeList.length > 0"
                   :options="pageConfig.typeList"
                   :config="typeConfig"
                   @clickTreeItem="clickTypeItem"
                   class="tree_wrap" 
                   :class="{'nobottom': pageConfig.pageData.length > 0}"
                   ></tree-item>
        <!--知识百科列表-->
        <tree-item v-show="pageConfig.pageData.length > 0"
                   :options="pageConfig.pageData"
                   :config="detailConfig"
                   @clickTreeItem="toDetail"
                   class="tree_wrap"
                   ></tree-item>

        <!--加载更多-->
        <load-more 
               class="loadmore_wrap"    
               :loading="loading"        
               :hasMore="pageConfig.hasMore"
               type="commentList"
               @loadMoreClick="loadMore"
               >
            <span>没有更多了</span>
        </load-more>
    </div>    
</template>

<script>
import searchBox from "@/components/base/search_box";
import treeItem from '@/components/tree/treeItem';
import returnBack from '@/components/tree/treeReturnBack';
import loadMore from '@/components/list/load_more';
import {getProTypeList,
        getProNextList} 
    from '../../api/getData.js';
import qwWaterMark from '@/directive/qwWaterMark';
const typeConfig = {
    id: 'id',
    title: 'name',
    arrow: false,
    headPic: require('assets/images/knowledge_type.jpg')
}
const detailConfig ={
    id: 'productId',
    title: 'title',
    subTitle: 'summary',
    arrow: false,
}
export default {
    directives: { qwWaterMark },
    data(){
        return{
            loading: false, 
            searchBar:{  // 搜索框
                show: true,
                ridMask: true, // 隐藏搜索空白
                keyWord: '',
            },
            listParam: { //传到list页的数据
                currPage: 1,
                pageSize: 20,
                keyword: '',
                pid: 0,
                status: 1
            },
            pageConfig: {
                pageData: [],
                typeList: [],
                hasMore: false
            },
            nextListParam: { // 知识百科列表翻页
                status: '1',
                typeId: '',
                currentPage: 1,
                pageSize: 20,
                keyword: ''
            },
            typeConfig: typeConfig,      // 类别配置
            detailConfig: detailConfig,  // 详情配置
        }
    },
    computed:{
        placeholder(){
            return this.$route.query.pid ? '搜索标题/类别名称' : '搜索类别名称';
        },
        pid(){
            return this.$route.query.pid || '0';
        }
    },
    created(){
        window.addEventListener('scroll',this.scrollList);
        this.clearLoadFun();
    },
    beforeDestroy(){
        window.removeEventListener('scroll',this.scrollList);
    },
    watch:{
        '$route'(to, from){
            if(to.name == from.name) {
                this.$refs.searchBar.clearInput(); // 清除搜索关键字
                this.clearLoadFun();
            }
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
                currPage: 1,
                pageSize: 20,
                pid: self.pid,
                status: 1,
                keyword: keyword ? keyword : ''
            };
            self.pageConfig = {
                pageData: [],
                typeList: [],
                hasMore: false
            };
            // 重新获取列表
            self.getTypeList()
        },
        // 获取类别列表
        getTypeList(){
            var self = this;
            self.loading = true;
            var type = self.$route.query.type || 3;
            getProTypeList(self.listParam,(data)=>{
                self.pageConfig.typeList = data.typeList;
                var productList = data.productPager.pageData;
                if(productList){
                    self.pageConfig.pageData = self.pageConfig.pageData.concat(productList);
                    self.pageConfig.hasMore = data.productPager.totalPages > data.productPager.currentPage;
                } 
                self.loading = false;
                self.nextListParam = { // 初始化知识百科列表翻页参数
                    status: '1',
                    typeId: self.pid,
                    currentPage: 1,
                    pageSize: 20,
                    keyword: ''
                };
            })
        },
        // 获取知识百科列表
        getProList(){
            var self = this;
            self.loading = true;
            self.lock_roll = true;
            getProNextList(self.nextListParam,(data)=>{
                self.pageConfig.pageData = self.pageConfig.pageData.concat(data.comments);
                self.pageConfig.hasMore = data.hasMore;
                self.lock_roll = false;
                self.loading = false;
            })
        },
        // 点击类别
        clickTypeItem(payload){
            this.$router.push({
                name: 'typeList',
                query: {
                    pid:  payload.id
                }
            })
        },
        // 跳转至详情
        toDetail(payload,index){
            this.$router.push({
                name: 'productDetail',
                query: {
                  id: payload.productId,
                  userId: _.userId,
                  page: index+1,
                  pid: this.pid,
                  keyword: this.listParam.keyword,
                }
            });
        },
        // 加载更多
        loadMore(){
            if(this.pageConfig.hasMore&&!this.loading){
                this.nextListParam.currentPage++;
                this.getProList();
            }
        },
        // 滚动加载
        scrollList(e){
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
                if(!this.lock_roll && this.pageConfig.hasMore){
                    this.loadMore();                    
                }
            }
        },
        // 返回上一级
        returnBack(){
            this.$router.go(-1);
        }
    },
    components:{
        searchBox,
        treeItem,
        returnBack,
        loadMore
    }
}
</script>

<style lang="scss" scoped>
%icon-right{
  display: inline-block;
  width: 10px;
  height: 15px;
  margin-left: 12px;
  background:0 0 url("~assets/images/CSSSprites.png") no-repeat;
  background-size: 101px 101px;
  vertical-align: middle;
  transform: rotate(180deg)
}
%border-line {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  transform-origin: 0 0;
  transform: scaleY(0.5);
  z-index: 2;
}
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
    // 回退上一级按钮
    .back_wrap {
        position: relative;
        display: flex;
        background: #fff;
        overflow: hidden;
        &::before{
            @extend %border-line;
            bottom: 0;
            border-bottom: 1px solid #ddd;
        }
        .back_icon {
            @extend %icon-right;
            margin-top: 18px;
        }
        .back_btn {
            font-size: 16px;
            color: #333;
            background: #fff;
            width: 100%;
        }
    }
    .tree_wrap {
        &.nobottom {
            padding-bottom: 0;
            /deep/ .treeItem{
                &:last-child::after{
                    @extend %border-line;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
        /deep/ .treeItem{
            margin: 0;
            padding-left: 15px;
        }
    }
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
