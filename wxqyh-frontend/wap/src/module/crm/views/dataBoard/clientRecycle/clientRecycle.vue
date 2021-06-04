<template>
    <div class="crm_list_wrap client_recycle">
        <div class="crm_list_header">
            <div class="flex_box">
                <div class="search_bar_wrap">
                    <search-box :searchinput ="searchOption"
                                @listenToSearchBox = "dealInputSearch"
                                @listenToClearInput = "clearInputSearch"
                                ref="searchBox">
                    </search-box>
                </div>
            </div>
        </div>
        <div class="list_container">
            <crm-scroll @loadMore="loadMore">
                <div class="recycle_msg" v-show="showRecycleMsg">
                    <span>即将被回收的客户</span>
                    <span class="recycle_num">{{recycleNum}}</span>
                </div>
                <crm-list
                    :listData="listData"
                    @click="goDetail"
                    :isEllipsis="true"
                ></crm-list>
                <load-more  
                    :loading="loadingMore"
                    :currPage="page"
                    :maxPage="maxPage"
                >
                    <div class="member_tips">共{{totalRows}}个客户</div>
                </load-more>
                <div class="no-data" v-show="listData.length <= 0 && !loadingMore">
                    <div class="noData_img"></div>
                    <div class="noData_text">没有记录</div>
                </div>
            </crm-scroll>
        </div>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box';
import LoadMore from '@/components/list/load_more';
import CrmList from '../../../components/CrmList/CrmList';
import CrmScroll from '../../../components/CrmScroll/CrmScroll';
import { getClientRecycle } from '../../../api/dataBoard/getData.js';

export default {
    name: 'clientRecycle',
    components: {
        SearchBox,
        CrmList,
        CrmScroll,
        LoadMore
    },
    data () {
        return {
            listData: [],  // 列表数据
            page: 1,  // 当前页数
            keyWord: '',  // 搜索关键字
            searchOption: {  // 搜索框配置
                show: true,
                keyWord: '',
                moreFunction: {
                    show: false,
                    option: [
                    {
                        name:'标题',
                        placeholder:'请输入客户名称搜索'
                    }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            },
            recycleNum: 0,  // 回收客户数量
            showRecycleMsg: true,  // 是否显示即将回收信息
            loadingMore: false,  // 是否正在加载
            hasMore: true,  // 是否有更多数据
            totalRows: 0,  // 数据条数
            maxPage: 1  // 最大页数
        }
    },
    created () {
        this.init();  
    },
    methods: {
            // 初始化
            init () {
                this.getClientRecycle();
            },

            // 获取客户回收信息
            getClientRecycle () {
                let config = {
                    keyWord: this.keyWord,
                    page: this.page
                }
                this.loadingMore = true;

                getClientRecycle(config).then(res => {
                    if(res.code == '0'){
                        let { pageData, totalRows, maxPage } = res.data;
                        this.loadingMore = false;
                        this.maxPage = maxPage;
                        this.totalRows = totalRows;
                        this.hasMore = this.page >= this.maxPage? false : true;

                        if(pageData){
                            if(totalRows > 0){
                                let list = pageData;
                                this.recycleNum = totalRows;

                                list.map(item => {
                                    let tabName = '', tabClass = '';
                                    if(item.remindType == 0){
                                        tabName = '待跟进';
                                        tabClass = 'status_orange';
                                    }
                                    else if(item.remindType == 1){
                                        tabName = '待成交';
                                        tabClass = 'status_blue';
                                    }

                                    let obj = {
                                        id: item.id,
                                        top: item.clientName,
                                        showTab: item.remindType === 10? false : true,
                                        tabClass,
                                        tabName,
                                        mid: [],
                                        bottom: {
                                            isShowAvator: false,
                                            msg: { },
                                            data: [
                                                {
                                                    title: '',
                                                    value: `${item.recycleDays}天后回收`,
                                                    fontSize: '13px',
                                                    valueColor: '#999'
                                                }
                                            ]
                                        }
                                    }

                                    this.listData.push(obj);
                                })
                            }
                        }
                    }
                    else{
                        _.alert('提示', res.desc);
                    }
                })
            },

            // 跳转回收客户详情
            goDetail (id) {
                this.$router.push({path:"/ClientDetails/ClientContent",query:{id:id,isClient:0}});
            },

            // 获取搜索框内容
            dealInputSearch (data) {
                this.listData = [];
                this.page = 1
                this.keyWord= data;
                this.showRecycleMsg = false;
                this.getClientRecycle();
            },

            // 清除搜索内容
            clearInputSearch () {
                this.dealInputSearch('');
            },

            // 加载更多
            loadMore () {
                if(this.hasMore && !this.loadingMore){
                    this.page++;
                    this.getClientRecycle();
                }
            }
    }
}
</script>
<style lang='scss' scoped>
@import './clientRecycle.scss';
</style>