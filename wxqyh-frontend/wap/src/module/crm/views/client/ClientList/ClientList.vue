<template>
    <CrmPageLoading v-if="pageLoading"></CrmPageLoading>
    <div class="crm_list_wrap" v-else>
        <div class="crm_list_header" :style="{visibility: isShowSearch ? 'visible': 'hidden'}">
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
                <div class="operate_btn" @click="searchOpen">
                    <i class="hanber_icon"></i>
                </div>
            </div>
        </div>
        <!-- 高级搜索组件 -->
        <advanced-search v-model="showAdvancedSearch"
                            @onAdvancedSearch="search"
                            @changeOperateBtnStatus="changeOperateBtnStatus"
                            @changeSearchBtnStatus="changeSearchBtnStatus"
                            ref="advancedSearch">
        </advanced-search>

        <div class="crm_list_main">
            <crm-read-bar
                :readMsg="readMsg"
                :totalMsg="totalMsg"
                :isRead="isRead"
                :notReadCount="notReadClientNum"
                @checkReadMsg="checkReadMsg"
                @signRead="signRead"
            >
            </crm-read-bar>
            <!-- 由于顶部统计栏固定不随页面滚动，需要调整列表滚动区域，将v-scroll 跟ref 移到列表节点，记录退出列表页的滚动位置 -->
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
        <!-- <crm-fixed-nail v-if="isShowNavFooterAndBtn" path="/clientOperate"></crm-fixed-nail> -->
        <div class="crm_fixed_nail"
         @click="onClickAdd" v-if="isShowNavFooterAndBtn" ></div>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box';
import NavFooter from '@/components/part/nav_footer';
import TabOne from '@/components/part/tab_one';
import LoadMore from '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import AdvancedSearch from './../advancedSearch/index';
import userChoose from '@/components/base/user_or_dept_select'
import customerDrag from '../../../components/drag/drag'
import CrmList from '../../../components/CrmList/CrmList';
import CrmFixedNail from '../../../components/CrmFixedNail/CrmFixedNail';
import CrmReadBar from '../../../components/CrmReadBar/CrmReadBar';
import { getClientList, getNotReadNum, readAll } from '../../../api/client/getData';
import { getCurrentYearMonth, getDataYear, getDataYearQuarter} from '../../../utils/index.js'
import { mapActions } from 'vuex';

import CrmPageLoading from "crm/components/CrmPageLoading";

const PROVINCE_CODE_GD = 440000;  // 广东省码
const CITY_CODE_GZ = 440100;  // 广州市码
const TAB_TYPE = ['allClient','toPerson','ccPerson','createPerson'];  // 底部tab类型
const PERSON_TYPE = ['tbCrmClientSearchVO.toPerson','tbCrmClientSearchVO.ccPerson','tbCrmClientSearchVO.createPerson']  //高级搜索选人的类型
let fixDragData = [] //拖拽固定传的数据（创建时间）
let owner = '0'//记录高级搜索切换回所有客户前的用户模块（负责的，相关的，创建的）

export default {
    name: 'ClientList',
    components: {
        SearchBox,
        CrmList,
        NavFooter,
        TabOne,
        LoadMore,
        CrmFixedNail,
        CrmReadBar,
        NoRecord,
        AdvancedSearch,
        userChoose,
        customerDrag,
        CrmPageLoading
    },
    data () {
        return {
            showAdvancedSearch: false,
            searchBar: {  // 搜索框配置
                show: true,  //搜索框，默认显示
                keyWord: '',
                moreFunction:{
                    show: true,
                    option: [
                        {
                            name:'名称',
                            placeholder:'按客户名称搜索'
                        },
                        {
                            name:'类别',
                            placeholder:'按客户类别搜索',
                            value: 'clientType'
                        }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            },
            footerNav: [  // 底部标签配置
                {
                    icon: 'crm-icon_base crm-icon_allClient_blue',
                    nav: '',
                    tab: '所有客户',
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
            listParams: {}, //请求列表后台参数
            listParamsData: {  // 请求列表后台参数默认数据
                'tbCrmClientSearchVO.clientName': '',
                'tbCrmClientSearchVO.clientCode': '',
                'tbCrmClientSearchVO.clientType': '',
                'tbCrmClientSearchVO.telPhone': '',
                'tbCrmClientSearchVO.industry': '',
                'contact_province_code': PROVINCE_CODE_GD,
                'contact_city_code': CITY_CODE_GZ,
                'fullAddress': '',
                'tbCrmClientSearchVO.province': '',
                'tbCrmClientSearchVO.city': '',
                'tbCrmClientSearchVO.area': '',
                'tbCrmClientSearchVO.country': '',
                'tbCrmClientSearchVO.address': '',
                'tbCrmClientSearchVO.readStatus': 0,
                'tbCrmClientSearchVO.isWin': '',
                'tbCrmClientSearchVO.outsideStartTime': '',
                'tbCrmClientSearchVO.outsideEndTime': '',
                'tbCrmClientSearchVO.startNum': '',
                'tbCrmClientSearchVO.endNum': '',
                'tbCrmClientSearchVO.businessStatus': '',
                'tbCrmClientSearchVO.contractStatus': '',
                'tbCrmClientSearchVO.businessStartNum': '',
                'tbCrmClientSearchVO.businessEndNum': '',
                'tbCrmClientSearchVO.contractStartNum': '',
                'tbCrmClientSearchVO.contractEndNum': '',
                'tbCrmClientSearchVO.toPerson': '',
                'tbCrmClientSearchVO.ccPerson': '',
                'tbCrmClientSearchVO.createPerson': '',
                'tbCrmClientSearchVO.deptName': '',
                'tbCrmClientSearchVO.startTime': '',
                'tbCrmClientSearchVO.endTime': '',
                'tbCrmClientSearchVO.editStartTime': '',
                'tbCrmClientSearchVO.editEndTime': '',
                // 'tbCrmClientSearchVO.queryType': '',
                'stageType': '0'
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
            totalMsg: '',  //总成员数描述
            hasMore: true,  // 是否有更多数据
            readMsg: '',  // 未阅客户的数量信息描述
            notReadClientNum: 0, //未阅数量
            showRecord: false,  // 是否显示没有记录提示
            isSearch: false,  // 是否是搜索的结果
            activeIdx: 0,  // 底部tab当前idx
            setting: [], //总的高级搜索字段配置列表
            settingData: [  // 固定高级搜索字段配置列表
                {
                    label: '所有者',
                    key: 'tbCrmClientSearchVO.owner',
                    type: 'radio',
                    show: false,
                    value: [
                        { text: '全部', value: '0'},
                        { text: '我负责的', value: '1'},
                        { text: '我相关的', value: '2'},
                        { text: '我创建的', value: '3'},
                    ],
                },
                {
                    label: '创建时间',
                    key: ['tbCrmClientSearchVO.startTime', 'tbCrmClientSearchVO.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD',
                    callBack: {
                        start: this.startTimeChange,
                        end: this.endTimeChange
                    }

                },
                {
                    label: '',
                    key: 'stageType',
                    type: 'radio',
                    value: [
                        { text: '本月', value: '2'},
                        { text: '本季', value: '3'},
                        { text: '今年', value: '1'}
                    ],
                    noDefault: true
                },
                {
                    label: '成交状态',
                    key: 'tbCrmClientSearchVO.isWin',
                    type: 'radio',
                    value: [{ text: '全部', value: ''},{ text: '已成交', value: '1'}, { text: '未成交', value: '0'}],
                },
            ],
            cacheSearchValue: {},  // 高级搜索缓存
            searchIndex: 0,  // 搜索标签索引
            isShowNavFooterAndBtn: false, //是否显示底部导航栏跟新建按钮，未阅列表不需要显示
            isShowSearch: true,
            isRead: true, // 是否处在已阅列表,

            pageLoading: true //页面loading
        }
    },
    created () {
        this.setting = this.setting.concat(this.settingData)
        this.listParams = Object.assign({},this.listParams,this.listParamsData)
        // 初始化
        this.init();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 如果是首页或者客户类型页进入，强制刷新页面
            let obj = {
                isClear: false,
                name: 'ClientList'
            }
            vm.setCacheArray(obj);
            vm.delCacheArray('ClientTypeList');
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
            'setCacheArray',
            'delCacheArray'
        ]),

        // 搜索框回调函数
        showMsgFromSearchBox (keyWord, val) {
            if(val === 'clientType'){
                this.searchIndex = 1;
                this.$router.push('/clientTypeList');
                return;
            }
            this.listParams['tbCrmClientSearchVO.clientName'] = keyWord;
            this.$set(this.cacheSearchValue, 'tbCrmClientSearchVO.clientName', keyWord);
            this.restData();
            this.getListData(true);
        },

        // 请求客户列表数据(isSearch: 是否为搜索)
        getListData (isSearch) {
            let  customFieldJson = this.listParams['tbCrmClientSearchVO.customFieldJson']
            typeof customFieldJson !== 'string' && (this.listParams['tbCrmClientSearchVO.customFieldJson'] = JSON.stringify(customFieldJson))

            
            this.$set(this.listParams, 'tbCrmClientSearchVO.readStatus', this.$route.path.includes('isread') ? 0 : 2);

            //切割选人数据
            PERSON_TYPE.forEach((item,index) => {
                if(this.listParams[PERSON_TYPE[index]]){
                    if(typeof this.listParams[PERSON_TYPE[index]] == 'object'){
                        let userIdsStr = ''
                        this.listParams[PERSON_TYPE[index]]['users'].forEach(item =>{
                            userIdsStr+=item.userId+','
                        })
                        userIdsStr = userIdsStr.substring(0,userIdsStr.length-1)
                        this.listParams[PERSON_TYPE[index]] = userIdsStr
                    }
                }
            })

            //根据底部tab类型改变选人搜索条件
            let idx = this.cacheSearchValue['tbCrmClientSearchVO.owner']

            if(idx && idx != '0'){//tab切换，负责的，相关的等
                this.$set(this.listParams, `tbCrmClientSearchVO.${TAB_TYPE[idx]}`, _.userId);
            }else if(owner == '1'){//在相关的，负责的等页面，筛选高级搜索回到所有客户
                if(this.listParams[`tbCrmClientSearchVO.toPerson`]
                && !this.listParams[`tbCrmClientSearchVO.toPerson`].includes(_.userId)){
                    this.$set(this.listParams, `tbCrmClientSearchVO.toPerson`, this.listParams[`tbCrmClientSearchVO.toPerson`]+','+_.userId)
                }
            }

            //切割选部门数据
            if(this.listParams['tbCrmClientSearchVO.deptName']){
                let deptNameStr = ''
                this.listParams['tbCrmClientSearchVO.deptName']['depts'].forEach(item =>{
                    deptNameStr+=item.departmentName+','
                })
                deptNameStr = deptNameStr.substring(0,deptNameStr.length-1)
                this.listParams['tbCrmClientSearchVO.deptName'] = deptNameStr
            }

            let obj = {
                ...this.listParams,
                page: this.page
            }
            this.loadingMore = true;
            this.isSearch = isSearch;
            this.showRecord = false;
            getClientList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let { maxPage, totalRows } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    // 添加左上角统计说明
                    this.totalMsg = `共 ${totalRows} 个客户`;
                    this.hasMore = this.page < this.maxPage;
                    this.loadingMore = false;

                    this.isShowNavFooterAndBtn = this.$route.path.includes('isread');
                    this.$set(this, 'isRead', this.$route.path.includes('isread'));
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
                                top: item.clientName,
                                mid: [
                                    {
                                        title: '客户类别：',
                                        value: item.typeNames || '无'
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

        // 加载更多客户列表
        loadMore (el) {
            let scrollTop = el.scrollTop;
            let offsetHeight = el.offsetHeight;
            let scrollHeight = el.scrollHeight;
            // 由于顶部栏固定，需要去掉之前10px 的下边距
            if(scrollTop + offsetHeight >= scrollHeight){
                if(this.hasMore && !this.loadingMore){
                    this.page++;
                    this.getListData();
                }
            }
        },

        // 跳转客户详情
        goDetail (id) {
          this.$router.push({path:"/ClientDetails/ClientContent",query:{id:id}});
        },
        //点击+
        onClickAdd(){
          this.$router.push({path:"/clientOperate",query:{
            from:"list"
          }})
        },
        // 查看客户未阅信息，触发路由改变，将获取未阅数据放在watch 钩子执行
        checkReadMsg () {
            this.$router.push('/clientList/unread');
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
                                // 跳转到客户列表
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
            // 处理参数
            this.dealUrlParams();
            // 获取未阅客户信息数量
            this.getNotReadNum();
            // 请求客户列表数据
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
                if(key === 'contact_province_code'){
                    this.listParams[key] = PROVINCE_CODE_GD;
                }
                else if(key === 'contact_city_code'){
                    this.listParams[key] = CITY_CODE_GZ;
                }
                else if(key === 'tbCrmClientSearchVO.readStatus' || key === 'stageType'){
                    this.listParams[key] = 0;
                }
                else if(key === 'tbCrmClientSearchVO.customFieldJson'){
                    //什么都不做
                }
                else{
                    this.listParams[key] = '';
                }
            }
            this.cacheSearchValue = {};

            // 清除搜索框内容
            this.$refs.searchBox.clearInput();
        },

        // 点击底部tab
        tabOneClick (idx,flag) {
            // tab类型数组
            this.activeIdx = idx;
            if(!flag){
                this.restData();
                this.resetSearchData();
            }
            this.getNotReadNum();
            this.$set(this.cacheSearchValue, 'tbCrmClientSearchVO.owner',idx.toString());

            // 变换tab图标
            this.footerNav.map((item,index) => {
                item.icon = `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`;
            });
            this.$set(this.footerNav[idx],'icon',`crm-icon_base crm-icon_${TAB_TYPE[idx]}_blue`);
            if(!flag){
                this.getListData();
            }
        },

        // 获取未阅客户信息数量
        getNotReadNum () {
            getNotReadNum().then(res => {
                if(res.code == '0'){
                    let { notReadClientNum } = res.data;
                    // 显示顶部统计栏信息
                    this.readMsg = this.$route.path.includes('isread') ? `未阅 (${notReadClientNum})`: '标记为已阅';
                    this.notReadClientNum = notReadClientNum;
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 比较时间大小
        compareDate (startVal, endVal, tips) {
            let startTime = startVal || '';
            let endTime = endVal || '';

            // 开始时间不能大于结束时间
            if(Date.parse(startTime) > Date.parse(endTime)){
                _.alert('提示',tips);
                return false;
            }
            return true;
        },

        // 单选按钮回调事件,setting的值
        checkedRadio(index,key,value){
            if(key === 'stageType'){//自定义创建时间按钮
                this.$set(this.cacheSearchValue, 'tbCrmClientSearchVO.startTime','');
                this.$set(this.cacheSearchValue, 'tbCrmClientSearchVO.endTime','');
            }
        },
        //开始日期组件回调
        startTimeChange(){
            this.$set(this.cacheSearchValue, 'stageType','');
        },
        //结束日期组件回调
        endTimeChange(){
            this.$set(this.cacheSearchValue, 'stageType','');
        },

        // 高级搜索
        search (searchValue ,copy_res = {}) {
            let keyList = Object.keys(searchValue);
            // 没有返回数据，则重置数据
            if(keyList.length > 0){
                if (JSON.stringify !== '{}') {
                    this.listParams['tbCrmClientSearchVO.customFieldJson'] = copy_res;
                }

                //选择创建时间段
                let stageType = searchValue['stageType']
                if(searchValue['stageType']){
                    switch (stageType){
                        case '2':
                            searchValue['tbCrmClientSearchVO.startTime'] = getCurrentYearMonth()[0]
                            searchValue['tbCrmClientSearchVO.endTime'] = searchValue['tbCrmClientSearchVO.startTime']
                            break;
                        case '3':
                            searchValue['tbCrmClientSearchVO.startTime'] = getDataYearQuarter()[0]
                            searchValue['tbCrmClientSearchVO.endTime'] = getDataYearQuarter()[1]
                            break;
                        case '1':
                            searchValue['tbCrmClientSearchVO.startTime'] = getDataYear()[0]
                            searchValue['tbCrmClientSearchVO.endTime'] = getDataYear()[1]
                            break;
                    }
                }
                let outsideStartTime = searchValue['tbCrmClientSearchVO.outsideStartTime'];
                let outsideEndTime = searchValue['tbCrmClientSearchVO.outsideEndTime'];
                let createStartTime = searchValue['tbCrmClientSearchVO.startTime'];
                let createEndTime = searchValue['tbCrmClientSearchVO.endTime'];
                let updateStartTime = searchValue['tbCrmClientSearchVO.editStartTime'];
                let updateEndTime = searchValue['tbCrmClientSearchVO.editEndTime'];

                // 判断开始时间是否大于结束时间
                if(!this.compareDate(outsideStartTime, outsideEndTime, '拜访开始时间不能大于结束时间')) return;
                if(!this.compareDate(createStartTime, createEndTime, '创建开始时间不能大于结束时间')) return;
                if(!this.compareDate(updateStartTime, updateEndTime, '更新开始时间不能大于结束时间')) return;

                // 判断区域是否存在
                if(searchValue['tbCrmClientSearchVO.area']){
                    let address = searchValue['tbCrmClientSearchVO.area'].text.split(' ');
                    this.listParams['fullAddress'] = searchValue['tbCrmClientSearchVO.area'].text;
                    this.listParams['tbCrmClientSearchVO.province'] = address[0];
                    this.listParams['tbCrmClientSearchVO.city'] = address[1];
                    this.listParams['tbCrmClientSearchVO.area'] = address[2];
//                    cacheObject['tbCrmClientSearchVO.area'] = searchValue['tbCrmClientSearchVO.area'];
                    delete searchValue['tbCrmClientSearchVO.area'];
                }

                this.listParams = Object.assign({},this.listParams,searchValue);
//                this.cacheSearchValue = Object.assign({},this.cacheSearchValue,searchValue,cacheObject)
                Object.keys(this.listParams).forEach(key => {
                    if (key.includes('custom-')) {
                        delete this.listParams[key];
                    }
                })
            }
            else{
                this.resetFooterTab();
                this.resetSearchData();
            }
            //点击高级搜索所有者跳页面
            owner = searchValue['tbCrmClientSearchVO.owner']
            this.tabOneClick ('0', true)
            this.restData();
            this.getListData(true);
        },

        // 打开高级搜索
        searchOpen () {
            this.showAdvancedSearch = true;
        },


        // 重置底部图标
        resetFooterTab () {
            this.activeIdx = 0;
            this.footerNav.map((item,index) => {
                item.icon = index === 0? 'crm-icon_base crm-icon_allClient_blue' : `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`
            });
        },

        // 处理url参数
        dealUrlParams () {
            let { keyWord } = this.$route.query;
                
            if(keyWord){
                this.listParams['tbCrmClientSearchVO.clientName'] = keyWord;
                this.$set(this.cacheSearchValue, 'tbCrmClientSearchVO.clientName', keyWord);
            }
        },

        changeOperateBtnStatus(val) {
            this.isShowNavFooterAndBtn = val;
        },

        changeSearchBtnStatus(val) {
            this.isShowSearch = val;
        }
    },
    watch: {
        // 路由监控
        '$route' (to, from) {
            // 点击未阅的时候监听路由变化 ，防止点击前进按钮出现页面没反应的情况
            if (to.params.status === 'unread' && !from.path.includes('ClientDetails')) {
                this.restData();
                this.resetSearchData();
                this.getListData();
                this.getNotReadNum();
            }

            // 从详情回到列表时不重新请求数据
            if (to.params.status === 'isread' && !from.path.includes('ClientDetails')) {  // 从未阅跳转到已阅
                let idx;      
                this.footerNav.forEach((item, index) => {
                    // 判断当前所处的tab
                    if (item.icon.includes('blue')) {
                        idx = item.index;
                    }   
                });
                // 根据当前所处的tab 重新请求对应tab 的数据
                this.$set(this.listParams, `tbCrmClientSearchVO.${TAB_TYPE[idx]}`, _.userId);
                // 请求数据之前清空数据
                this.restData();
                // 获取未阅客户信息数量
                this.getNotReadNum();
                // 请求客户列表数据
                this.getListData();
            }
        }
    }
}
</script>
<style lang="scss">
@import './ClientList.scss';
@import "crm/components/CrmFixedNail/CrmFixedNail.scss";
</style>


