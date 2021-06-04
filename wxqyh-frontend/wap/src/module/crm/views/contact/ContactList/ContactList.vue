<template>
    <CrmPageLoading v-if="pageLoading"></CrmPageLoading>
    <div class="crm_list_wrap" v-else>
        <div class="crm_list_header">
            <div class="flex_box">
                <div class="search_bar_wrap">
                    <search-box
                        :searchIndex="searchIndex"
                        :searchinput="searchBar"
                        @listenToSearchBox="showMsgFromSearchBox"
                        ref="searchBox"
                    >
                    </search-box>
                </div>
                <div class="operate_btn" @click="letterToggle">
                    <i class="letter_icon"></i>
                </div>
            </div>
            <ul class="letter_box" v-show="showLetter">
                <li
                    class="letter_item"
                    v-for="(item,idx) in letterArry"
                    :key="idx"
                    @click="letterSearch(item)"
                >{{item}}</li>
            </ul>
        </div>
        <div class="crm_list_main">
            <crm-read-bar
                :readMsg="readMsg"
                :totalMsg="totalMsg"
                :isRead="isRead"
                :notReadCount="notReadCount"
                @checkReadMsg="checkReadMsg"
                @signRead="signRead"
            >
            </crm-read-bar>
            <div class="crm-list-content" v-scroll="loadMore" ref="wrapMain">
                <crm-list
                    :listData="listData"
                    @click="goDetail"
                >
                </crm-list>
                <load-more
                    :loading="loadingMore"
                    :currPage="page"
                    :maxPage="maxPage"
                >
                </load-more>
                <no-record
                    :stepTop="true"
                    :hasRecord="noRecord"
                    v-show="showRecord">
                </no-record>
            </div>
        </div>
        <div class="crm_list_footer" v-if="isShowNavFooterAndBtn">
            <nav-footer>
                <tab-one
                    v-for="(navItem,idx) in footerNav"
                    :key="idx"
                    v-bind="navItem"
                    :activeIndex="activeIdx"
                    @tabOneClick="tabOneClick(idx)"
                >
                </tab-one>
            </nav-footer>
        </div>
        <!-- <crm-fixed-nail path="/contactOperate"  v-if="isShowNavFooterAndBtn"></crm-fixed-nail> -->
        <div class="crm_fixed_nail"
         @click="onClickAdd" v-if="isShowNavFooterAndBtn"></div>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box';
import NavFooter from '@/components/part/nav_footer';
import TabOne from '@/components/part/tab_one';
import LoadMore from '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import CrmList from '../../../components/CrmList/CrmList';
import CrmFixedNail from '../../../components/CrmFixedNail/CrmFixedNail';
import CrmReadBar from '../../../components/CrmReadBar/CrmReadBar';
import { getContactList, readAll } from '../../../api/contact/getData';
import { mapActions } from 'vuex';

import CrmPageLoading from "crm/components/CrmPageLoading";

let TAB_TYPE = ['allContact','toPerson','ccPerson','createPerson'];  // 底部tab类型

export default {
    name: 'ContactList',
    components: {
        SearchBox,
        CrmList,
        NavFooter,
        TabOne,
        LoadMore,
        CrmFixedNail,
        CrmReadBar,
        NoRecord,
        CrmPageLoading
    },
    data () {
        return {
            searchBar: {  // 搜索框配置
                show: true,  //搜索框，默认显示
                keyWord: '',
                moreFunction:{
                    show: true,
                    option: [
                        {
                            name:'按联系人',
                            placeholder:'按联系人搜索',
                            value: 0
                        },
                        {
                            name:'客户名称',
                            placeholder:'按客户名称搜索',
                            value: 1
                        }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            },
            footerNav: [  // 底部标签配置,修改 index 适应接口请求
                {
                    icon: 'crm-icon_base crm-icon_allContact_blue',
                    nav: '',
                    tab: '所有联系人',
                    index: 0
                },
                {
                    icon: 'crm-icon_base crm-icon_toPerson_gray',
                    nav: '',
                    tab: '我负责的',
                    index: 1
                },
                {
                    icon: 'crm-icon_base crm-icon_ccPerson_gray',
                    nav: '',
                    tab: '我相关的',
                    index: 2
                },
                {
                    icon: 'crm-icon_base crm-icon_createPerson_gray',
                    nav: '',
                    tab: '我创建的',
                    index: 3
                }

            ],
            listData: [],  // 列表配置
            listParams: {  // 请求联系人列表后台参数
                targetUser: '',
                queryType: '',
                typeId: '',
                keyWord: '',
                ownerType: '',
                readStatus: ''
            },
            noRecord:{  // 无记录配置
                icon: "qwui-icon_no_Data",
                title: "",
                text: "暂无数据"
            },
            loadingMore: false,  // 是否正在加载
            page: 1,  // 当前页数
            maxPage: 0,  // 最大页数
            totalRows: 0,  // 总成员数
            totalMsg: '', //总成员数描述
            hasMore: true,  // 是否有更多数据
            readMsg: '',  // 未阅客户的数量信息描述
            notReadCount: 0, //未阅数量
            showRecord: false,  // 是否显示没有记录提示
            isSearch: false,  // 是否是搜索的结果
            activeIdx: 0,  // 底部tab当前idx
            oldVal: 0,  // 记录上一次旧的typeId
            showLetter: false,  // 是否显示字母表
            letterArry: ['A','B','C','D','E','F','G','H','I','J','K','L',  // 字母表
                        'M','N','O','P','Q','R','S','T','U','V','W','X',
                        'Y','Z','*'],
            searchIndex: 0,  // 搜索标签索引
            baseURL: _.baseURL,
            isShowNavFooterAndBtn: false, //是否显示底部导航栏跟新建按钮，未阅列表不需要显示
            isRead: true, // 是否处在已阅列表
            pageLoading: true //页面loading
        }
    },
    created () {
        // 初始化
        this.init();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 如果是首页进入，强制刷新页面
            let obj = {
                isClear: false,
                name: 'ContactList'
            }
            vm.setCacheArray(obj);
            vm.$nextTick(() => {
                if (vm.$refs && vm.$refs.wrapMain) {
                    vm.$refs.wrapMain.scrollTop = to.meta.scrollY || 0;
                }
            });
        });
    },
    beforeRouteLeave (to, from, next) {
        // 记录滚动位置
        from.meta.scrollY = this.$refs.wrapMain.scrollTop;
        next();
    },
    methods: {
        ...mapActions('list',[
            'setCacheArray'
        ]),

        // 搜索框回调函数
        showMsgFromSearchBox (keyWord, val) {
            // 如果val为真，则赋值给typeId
            if(this.oldVal != val){
                this.resetSearchData();
                this.listParams['typeId'] = val;
                this.searchIndex = val;

                // 重置底部图标为所有客户
                this.footerNav.map((item,index) => {
                    if(index === 0){
                        item.icon = `crm-icon_base crm-icon_${TAB_TYPE[index]}_blue`;
                    }
                    else{
                        item.icon = `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`;
                    }
                });
                this.activeIdx = 0;
            }

            this.listParams['keyWord'] = keyWord;
            this.restData();
            this.getListData(true);
            this.oldVal = val;
        },

        // 请求列表数据(isSearch: 是否为搜索)
        getListData (isSearch) {
            // 根据路由参数判断已阅未阅状态
            this.$set(this.listParams, 'readStatus', this.$route.path.includes('isread') ? '' : 0);
            let obj = {
                ...this.listParams,
                page: this.page
            }
            this.loadingMore = true;
            this.isSearch = isSearch;
            this.showRecord = false;
            getContactList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let { maxPage, totalRows, notReadCount  } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    // 添加左上角统计说明
                    this.totalMsg = `共 ${totalRows} 个联系人`;
                    this.hasMore = this.page < this.maxPage;
                    this.loadingMore = false;

                    
                    // 显示顶部统计栏信息,根据路由做区分
                    this.readMsg = this.$route.path.includes('isread') ? `未阅 (${notReadCount})` : '标记为已阅';
                    this.isShowNavFooterAndBtn = this.$route.path.includes('isread');
                    this.$set(this, 'isRead', this.$route.path.includes('isread'));
                    this.notReadCount = notReadCount;

                    // 如果总条数为0，则显示无记录
                    if(this.totalRows > 0){
                        this.showRecord = false;
                    }
                    else{
                        // 如果是搜索，则改变没有数据的提示图标和语句
                        if(isSearch){
                            this.noRecord.icon = 'qwui-icon_no_Search';
                            this.noRecord.title = '';
                            this.noRecord.text = '没有搜索结果';
                        }else{
                            this.noRecord.icon = 'qwui-icon_no_Data';
                            this.noRecord.title = '';
                            this.noRecord.text = '暂无数据';
                        }
                        this.showRecord = true;
                    }

                    // 有列表数据才渲染
                    if(list && list.length > 0){
                        list.map((item,idx) => {
                            let obj = {
                                id: item.id,
                                top: item.contactsName,
                                mid: [
                                    {
                                        title: '所属客户：',
                                        value: item.clientName
                                    }
                                ],
                                bottom: {
                                    isShowAvator: true,
                                    msg: {
                                        avatorUrl: item.headPic,
                                        avatorName: item.personName
                                    },
                                    data: [
                                        {
                                            title: '更新时间：',
                                            value: item.updateTime.slice(0,-3)
                                        }
                                    ]
                                }
                            };
                            this.listData.push(obj);
                        });
                    }
                }
                else{
                    _.alert('提示',res.desc);
                }
                this.pageLoading = false;
            })
        },

        // 加载更多联系人列表
        loadMore (el) {
            let scrollTop = el.scrollTop;
            let offsetHeight = el.offsetHeight;
            let scrollHeight = el.scrollHeight;

            if(scrollTop + offsetHeight >= scrollHeight){
                if(this.hasMore && !this.loadingMore){
                    this.page++;
                    this.getListData();
                }
            }
        },

        // 跳转详情
        goDetail (id) {
            this.$router.push({path:"/ContactDetails/ContactContent",query:{id:id,isContact:0}});
        },
        //点击+
        onClickAdd(){
          this.$router.push({path:"/contactOperate",query:{
            from:"list"
          }})
        },

        // 查看未阅信息，触发路由改变，将获取未阅数据放在watch 钩子执行
        checkReadMsg () {
            this.$router.push({path: '/contactList/unread'});
        },

        // 标记为已阅
        signRead () {
            _.alert("提示","确认将所有未阅标记成已阅",{
                primaryBtn:{
                    name: "i18n.confirm",
                    callBack: () => {
                        readAll().then(res => {
                            if(res.code == '0'){
                                _.tooltips_succeed('操作成功');
                                // 跳转到联系人列表
                                this.$router.go(-1);
                            }
                            else{
                                _.alert('提示',res.desc);
                            }
                        });
                    }
                },
                defaultBtn:{
                    name: "i18n.cancel",
                    callBack: null
                },
            });
        },

        // 初始化数据
        init () {
            // 请求列表数据
            this.getListData();
        },

        // 重置列表数据
        restData () {
            this.page = 1;
            this.listData = [];
        },

        // 重置搜索条件
        resetSearchData () {
            for(let key in this.listParams){
                if(key != 'typeId'){
                    this.listParams[key] = '';
                }
            }

            // 清除搜索框内容
            this.$refs.searchBox.clearInput();
        },

        // 点击底部tab
        tabOneClick (idx) {
            this.activeIdx = idx;
            this.restData();
            this.resetSearchData();

            // 变换tab图标
            this.footerNav.map((item,index) => {
                item.icon = `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`
            });
            this.$set(this.footerNav[idx],'icon',`crm-icon_base crm-icon_${TAB_TYPE[idx]}_blue`);

            // 更加底部tab类型改变搜索条件
            if(idx != 0){
                if(idx === 3){
                    this.listParams[`ownerType`] = 0;
                }
                else{
                    this.listParams[`ownerType`] = idx;
                }
            }
            this.getListData();
        },

        // 按字母搜索
        letterSearch (letter) {
            this.listParams['keyWord'] = letter === '*'? '' : letter;
            this.restData();
            this.getListData(true);
            this.showLetter = false;
        },

        // 切换字母表
        letterToggle () {
            this.showLetter = !this.showLetter;
        }
    },
    watch: {
        // 路由监控
        '$route' (to, from) {
            // 点击未阅的时候监听路由变化 ，防止点击前进按钮出现页面没反应的情况
            if (to.params.status === 'unread' && !from.path.includes('ContactDetails')) {
                this.restData();
                this.resetSearchData();
                this.getListData();
            }

            // 从详情回到列表时不重新请求数据
            if (to.params.status === 'isread' && !from.path.includes('ContactDetails')) {  // 从未阅跳转到已阅
                let idx;
                this.footerNav.forEach((item, index) => {
                    // 判断当前所处的tab
                    if (item.icon.includes('blue')) {
                        idx = item.index;
                    }   
                });
                // 设置ownerType 参数对应不同的底部导航
                if (idx === 3) {
                    idx = 0;
                } else if (idx === 0) {
                    idx = '';
                }
                // 根据当前所处的tab 重新请求对应tab 的数据
                this.$set(this.listParams, 'ownerType' , idx);
                // 请求数据之前清空数据
                this.restData();
                // 请求联系人列表数据
                this.getListData();
            }
        }
    }
}
</script>
<style lang="scss">
@import './ContactList.scss';
@import "crm/components/CrmFixedNail/CrmFixedNail.scss";

</style>





