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
        <!--未阅读,一键阅读-->
        <div v-if="pageConfig.notReadNum>0" class="unread_wrap">
            <span v-if="!unReadPage" class="clearfix">
                <span class="to_unread"  @click="toUnReadPage">
                    <span>{{unReadNum}}个未阅知识</span>
                    <i class="to_unread_icon"></i>
                </span>
                <span class="mark_unread" @click="markUnread(3)">标记为已阅</span>
            </span>
            <span v-else @click="markUnread(2)" class="unreadpage_num">全部标记为已阅({{unReadNum}})</span>
        </div>

      <div class="approve-bar" v-if="dynamicApprovalCount">
        <span @click="handleClickApprovalBtn">{{dynamicApprovalCount}}个动态审核</span>
        <i class="arrow-icon"></i>
      </div>

        <!--主列表-->
        <list-item :list="pageConfig.pageData"
                    @clickItem="toDetail"></list-item>

        <!--加载更多-->
        <load-more v-show="!showNoData"
                class="loadmore_wrap"
               :loading="loading"
               :hasMore="pageConfig.hasMore"
               type="commentList"
               @loadMoreClick="loadMore"
               >
            <span>没有更多知识百科啦</span>
        </load-more>

        <!--底部按钮，主列表：分类，未阅读列表：返回主页-->
        <div class="bottom_wrap">
            <div v-if="unReadPage">
                <button-group :fixed="true">
                    <button-btn type="default"
                                text="返回主页"
                                @buttonClick="backToMain"></button-btn>
                </button-group>
            </div>
            <div class="qwui-publish_btn main_btn" v-else @click="gotoTypeList">
                <img class="icon_img" src="~assets/images/ic_fenlei.png"/>
                <span>分类搜索</span>
            </div>
        </div>

        <!--暂无记录-->
        <no-record v-show="showNoData"
            :setTop="true"
            :hasRecord="recordData"
        ></no-record>

        <!--提示前往后台弹窗-->
        <dialog-group title="发布百科内容请前往管理后台"
            :show="dialogShow"
            confirmText="我知道了"
            @confirm="closeDialog">
            <div class="dialog_item">
                <p>手机端仅支持查阅知识百科内容，登录企业微信管理后台
                    进入应用管理端可以支持发布百科内容、管理分类。</p>
                <p class="dialog_line"></p>
                <p>登录企业微信后台，请访问：</p>
                <p>https://work.weixin.qq.com/login</p>
            </div>
        </dialog-group>

    </div>
</template>

<script>
import searchBox from "@/components/base/search_box";
import loadMore from '@/components/list/load_more';
import noRecord from '@/components/base/noRecord';
import listItem from '../../components/list_item';
import dialogGroup from '@/components/base/dialog/dialog-group';
import {qwui_button,button_group} from '@/components/base/button';
import * as approvalApi from '../../api/approvalApi'
import {getProductList,
        getReadState,
        batchRead,
        guideDialog,
        closeGuideDialog,
        }
    from '../../api/getData.js';
import { setTimeout } from 'timers';
import qwWaterMark from '@/directive/qwWaterMark';
export default {
    directives: { qwWaterMark },
    data(){
        return{
            searchBar:{  // 搜索框
                show: true,
                ridMask: true, // 隐藏搜索空白
                keyWord: '',
            },
            placeholder:'搜索标题',
            listParam: { //传到list页的数据
                currentPage: 1,
                pageCount: 20,
                keyword: ''
            },
            pageConfig: {
                hasMore: false,
                notReadNum: 0,
                pageData: [],
            },
            loading: false,
            lock_roll:false,
            showNoData:  false,
            recordData:{   // 无数据时
              icon: "qwui-icon_book",
              title: '没有内容',
              text: '可通过管理后台发布内容',
            },
            isFirst: true, // 是否第一次请求数据
            dialogShow: false, // 显示前往后台提示
            dynamicApprovalCount: 0,
        }
    },
    created(){
        let keyWord = this.$route.query.keyWord ? decodeURI(this.$route.query.keyWord) : '';
        this.clearLoadFun(keyWord);
        this.shareLink('知识百科', '','企业知识库，保存信息及知识资产，加速内部信息及知识的流通');
    },
    activated(){
        this.getDynamicApprovalCount()
        window.addEventListener('scroll',this.scrollList);
    },
    deactivated(){   //组件被停用(离开路由)
        window.removeEventListener('scroll',this.scrollList);
    },
    computed:{
        unReadNum(){
            return this.pageConfig.notReadNum > 99 ? '99+' : this.pageConfig.notReadNum;
        },
        unReadPage(){ //true表示进入到未阅页
            return this.$route.query.type == 2;
        }
    },
    watch:{
        '$route'(to, from){
            if(to.name == from.name) {
                this.showNoData = false;
                this.$refs.searchBar.clearInput(); // 清除搜索关键字
                this.clearLoadFun();
            }
        }
    },
    methods:{

        getDynamicApprovalCount(){
            approvalApi.todoNum().then((data)=>{
                this.dynamicApprovalCount = data &&data.todoNum ? data.todoNum: 0;
            })
        },

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
                pageCount: 20,
                keyword: keyword ? keyword : ''
            };
            self.pageConfig = {
                hasMore: false,
                notReadNum: 0,
                pageData: [],
            };
            // 根据不同参数 无数据时显示不同
            var type = self.$route.query.type || 3;
            if(type == 2) {
                this.recordData = {
                    icon: "qwui-icon_text",
                    title: '',
                    text: '无记录',
                }
            }else if(type == 3) {
                this.recordData = {
                    icon: "qwui-icon_book",
                    title: '没有内容',
                    text: '可通过管理后台发布内容',
                }
            }
            // 重新获取列表
            self.getList()
        },
        // 获取列表
        getList(){
            var self = this;
            self.loading = true;
            self.lock_roll=true;
            var type = self.$route.query.type || 3;
            getProductList(type, self.listParam,(data)=>{
                var notReadNum = data.notReadNum;
                var list = data.comments;
                self.pageConfig.pageData = self.pageConfig.pageData.concat(list);
                self.pageConfig.hasMore = data.hasMore;
                self.pageConfig.notReadNum = notReadNum;
                self.lock_roll = false;
                self.loading = false;
                self.showNoData = list.length <= 0;
                // 判断是否为第一次请求
                if(self.isFirst){
                    self.isFirst = false;
                    self.showGuideDialog(list.length);
                }
            });
        },
        //加载更多
        loadMore(){
            if(this.pageConfig.hasMore&&!this.loading){
                this.listParam.currentPage++;
                this.getList();
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
        // 跳转至未阅列表
        toUnReadPage(){
            this.$refs.searchBar.clearInput();
            this.$router.push({
                path: '/',
                query: { type: '2'}
            })
        },
        // 判断是否开启一键已阅
        markUnread(type){
            var self = this;
            getReadState({},(data)=>{
                if(data.isBatchRead == '0') {
                    _.alert('提示','后台没有开启一键已阅功能<br/>请联系管理员开启');
                }else {
                     var btn={
                        primaryBtn:{name:'确定', callBack:this.doMarkUnread},
                        defaultBtn:{name:"取消", callBack:null},
                    };
                    _.alert('标记为已阅','确定将所有未阅标记为已阅', btn);
                }
            })
        },
        // 执行一键阅读
        doMarkUnread() {
            var self = this;
            batchRead({},()=>{
                _.tooltips_succeed('标记成功');
                setTimeout(()=>{
                    if(self.unReadPage) { // 在未阅读列表
                        self.$router.push({
                            path: '/'
                        })
                    } else {
                        // 重新获取列表
                        self.clearLoadFun()
                    }
                },1000);
            })
        },
        //判断是否显示前往后台弹窗
        showGuideDialog(listLen){
            var self = this;
            guideDialog({
                'agentCode': dataBase.wxqyh_uploadfile.agent
            },(data)=>{
                if(data.isRemind) {
                    if(listLen < 5) {
                        self.dialogShow = true;
                    }
                } else {
                    self.closeDialog();
                }
            })
        },
        // 关闭提示弹窗
        closeDialog(){
            var self = this;
            closeGuideDialog({
                'agentCode': dataBase.wxqyh_uploadfile.agent
            },()=>{
                self.dialogShow = false;
            })
        },
        // 跳转至详情页面
        toDetail(item,index){
            this.$router.push({
                name: 'productDetail',
                query: {
                  id: item.productId,
                  userId: _.userId,
                  page: index+1,
                  type: this.$route.query.type || 3,
                  keyword: this.listParam.keyword,
                }
            });
        },
        //返回主页
        backToMain(){
            this.$router.push({
                path: '/'
            })
        },
        //分类搜索
        gotoTypeList(){
            this.$router.push({
                path: '/typeList'
            })
        },
        // 分享信息
        shareLink(title, img, summary){
            _.checkApi.setDataForWeixinValue(
                title,
                img,
                summary,
                window.location.href
            );
        },

        handleClickApprovalBtn(){
            this.$router.push({
                name: 'approvalList'
            })
        }
    },
    components:{
        searchBox,
        loadMore,
        noRecord,
        listItem,
        'buttonBtn':qwui_button,
        'buttonGroup':button_group,
        dialogGroup
    }

}
</script>

<style lang="scss" src="../../scss/product_list.scss" scoped>
</style>
