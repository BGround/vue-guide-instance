<template>
    <CrmPageLoading v-if="pageLoading"></CrmPageLoading>
    <div class="crm_list_wrap" v-else>
        <div class="crm_list_header">
            <div class="flex_box">
                <div class="search_bar_wrap">
                    <search-box
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
        <advanced-search
            @search="search"
            @close="searchClose"
            @checkedRadio="checkedRadio"
            :setting="setting"
            v-show="advancedShow"
            :cache-search-value="cacheSearchValue">
            <div slot="footer" class="customer">
                <!-- 自定义事件拖拽 -->
                <div class="customer-link"
                    @click="openDraggable">设置筛选条件</div>
            </div>
        </advanced-search>
        <user-choose :closeAllTab="selectConfig.signIndex == 'depts'"
                         :closeGroup="selectConfig.signIndex == 'depts'"
                         :closeUser="selectConfig.signIndex == 'depts'"
                         :tabActive="selectConfig.signIndex == 'depts' ? 'dept' : 'group'"
                         :selectconfig="selectConfig"
                         v-if="selectConfig.show"></user-choose>
        <customer-drag v-show="showDraggable"
                    :optionSetting="optionSetting"
                    @openDraggable="openDraggable"
                    @submitDragData="submitDragData"></customer-drag>
        <div class="crm_list_main" v-scroll="loadMore" ref="wrapMain">
            <crm-read-bar
                :readMsg="readMsg"
                :totalMsg="totalMsg"
                :isRead="isRead"
                :notReadCount="notReadCount"
                @checkReadMsg="checkReadMsg"
                @signRead="signRead"
            >
            </crm-read-bar>
            <!-- 由于顶部统计栏固定不随页面滚动，需要调整列表滚动区域，将v-scroll 跟ref 移到列表节点，记录退出列表页的滚动位置 -->
            <div class="crm-list-content" v-scroll="loadMore" ref="wrapMain">
                <crm-list
                    :listData="listData"
                    @click="goDetail"
                    @delEvent="delItem"
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
        <!-- <crm-fixed-nail path="/visitOperate" v-if="isShowNavFooterAndBtn"></crm-fixed-nail> -->
        <div class="crm_fixed_nail"
         @click="onClickAdd"  v-if="isShowNavFooterAndBtn"></div>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box';
import NavFooter from '@/components/part/nav_footer';
import TabOne from '@/components/part/tab_one';
import LoadMore from '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import AdvancedSearch from '@/components/base/AdvancedSearch/index';
import userChoose from '@/components/base/user_or_dept_select'
import customerDrag from '../../../components/drag/drag'
import CrmList from '../../../components/CrmList/CrmList';
import CrmFixedNail from '../../../components/CrmFixedNail/CrmFixedNail';
import CrmReadBar from '../../../components/CrmReadBar/CrmReadBar';
import { getVisitList, getNotReadNum, readAll, delVisit , customerOption , getOptionSetting, submitDragData} from '../../../api/visit/getData';
import { getCurrentYearMonth, getDataYear, getDataYearQuarter} from '../../../utils/index.js'
import { mapActions } from 'vuex';

import CrmPageLoading from "crm/components/CrmPageLoading";

const TAB_TYPE = ['allVisit','toPerson','ccPerson','createPerson'];  // 底部tab类型
const PERSON_TYPE = ['tbCrmOutsideSearchVO.toPerson','tbCrmOutsideSearchVO.ccPerson','tbCrmOutsideSearchVO.createPerson']  //高级搜索选人的类型
let fixDragData = [] //拖拽固定传的数据（创建时间）
let owner = '0'//记录高级搜索切换回所有客户前的用户模块（负责的，相关的，创建的）

// 高级搜索选人配置
let fakeSelectConfig = {
    show: false,
    signIndex: 'users',
    selectList: {
        "users": { // 单独选人
            "title":"",
            "selectType": "group",
            "userSelected": [],
            "callBack": {
                "confirm": null
            }
        },
        "depts": { // 选部门
            "title":"",
            "selectType": "dept",
            "deptSelected": [],
            "callBack": {
                "confirm": null
            }
        }
    }
}

export default {
    name: 'VisitList',
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
            selectConfig: fakeSelectConfig,
            searchBar: {  // 搜索框配置
                show: true,  //搜索框，默认显示
                keyWord: '',
                moreFunction:{
                    show: false,
                    option: [
                        {
                            name:'标题',
                            placeholder:'搜索标题'
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
                    icon: 'crm-icon_base crm-icon_allVisit_blue',
                    nav: '',
                    tab: '所有拜访',
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
                'tbCrmOutsideSearchVO.clientName': '',
                'tbCrmOutsideSearchVO.title': '',
                'tbCrmOutsideSearchVO.content': '',
                'tbCrmOutsideSearchVO.toPerson': '',
                'tbCrmOutsideSearchVO.ccPerson': '',
                'tbCrmOutsideSearchVO.createPerson': '',
                'tbCrmOutsideSearchVO.deptName': '',
                'tbCrmOutsideSearchVO.address': '',
                'tbCrmOutsideSearchVO.startDate': '',
                'tbCrmOutsideSearchVO.endDate': '',
                'tbCrmOutsideSearchVO.startTime': '',
                'tbCrmOutsideSearchVO.endTime': '',
                'tbCrmOutsideSearchVO.status': 1,
                'tbCrmOutsideSearchVO.readStatus': 0,
                'tbCrmOutsideSearchVO.outworkId': '',
                'tbCrmOutsideSearchVO.last': '',
                'searchType': 1,
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
            totalMsg: '', //总成员数描述
            hasMore: true,  // 是否有更多数据
            readMsg: '',  // 未阅信息的数量
            notReadCount: 0, //未阅数量
            showRecord: false,  // 是否显示没有记录提示
            isSearch: false,  // 是否是搜索的结果
            activeIdx: 0,  // 底部tab当前idx
            setting: [], //总的高级搜索字段配置列表
            settingData: [  // 固定高级搜索字段配置列表
                {
                    label: '所有者',
                    key: 'tbCrmOutsideSearchVO.owner',
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
                    key: ['tbCrmOutsideSearchVO.startTime', 'tbCrmOutsideSearchVO.endTime'],
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
                    label: '发布状态',
                    key: 'tbCrmOutsideSearchVO.status',
                    type: 'radio',
                    value: [{ text: '已提交', value: '1'}, { text: '草稿', value: '0'}],
                    // noDefault: true
                },
            ],
            advancedShow: false,  // 是否显示高级搜索
            cacheSearchValue: {},  // 高级搜索缓存
            showDraggable: false, // 是否显示设置筛选条件列表
            optionSetting: {}, //后台对应的自定义设置字段
            baseURL: _.baseURL,
            isShowNavFooterAndBtn: false, //是否显示底部导航栏跟新建按钮，未阅列表不需要显示
            isRead: true, // 是否处在已阅列表
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
            // 如果是首页进入，强制刷新页面
            let obj = {
                isClear: false,
                name: 'VisitList'
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
            this.listParams['tbCrmOutsideSearchVO.title'] = keyWord;
            this.$set(this.cacheSearchValue, 'tbCrmOutsideSearchVO.title', keyWord);
            this.restData();
            this.getListData(true);
        },

        // 请求拜访列表数据(isSearch: 是否为搜索)
        getListData (isSearch) {
            let  customFieldJson = this.listParams['tbCrmOutsideSearchVO.customFieldJson']
            typeof customFieldJson !== 'string' && (this.listParams['tbCrmOutsideSearchVO.customFieldJson'] = JSON.stringify(customFieldJson))

            
            this.$set(this.listParams, 'tbCrmOutsideSearchVO.readStatus', this.$route.path.includes('isread') ? 0 : 2);


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
            let idx = this.cacheSearchValue['tbCrmOutsideSearchVO.owner']

            if(idx && idx != '0'){//tab切换，负责的，相关的等
                this.$set(this.listParams, `tbCrmOutsideSearchVO.${TAB_TYPE[idx]}`, _.userId);
            }else if(owner == '1'){//在相关的，负责的等页面，筛选高级搜索回到所有客户
                if(this.listParams[`tbCrmOutsideSearchVO.toPerson`]
                && !this.listParams[`tbCrmOutsideSearchVO.toPerson`].includes(_.userId)){
                    this.$set(this.listParams, `tbCrmOutsideSearchVO.toPerson`, this.listParams[`tbCrmOutsideSearchVO.toPerson`]+','+_.userId)
                }
            }

            //切割选部门数据
            if(this.listParams['tbCrmOutsideSearchVO.deptName']){
                let deptNameStr = ''
                this.listParams['tbCrmOutsideSearchVO.deptName']['depts'].forEach(item =>{
                    deptNameStr+=item.departmentName+','
                })
                deptNameStr = deptNameStr.substring(0,deptNameStr.length-1)
                this.listParams['tbCrmOutsideSearchVO.deptName'] = deptNameStr
            }

            let obj = {
                ...this.listParams,
                page: this.page,
                status: this.listParams['tbCrmOutsideSearchVO.status']
            }
            this.loadingMore = true;
            this.isSearch = isSearch;
            this.showRecord = false;

            getVisitList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let { maxPage, totalRows } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    // 添加左上角统计说明
                    this.totalMsg = `共 ${totalRows} 个拜访`;
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
                                top: item.outworkTitle,
                                showDel: item.status == 0? true : false,
                                mid: [
                                    {
                                        title: '拜访客户：',
                                        value: item.clientName || '未填写'
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
                                },
                                callBackVal: {status: item.status, clientId: item.clientId}
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

        // 加载更多拜访列表
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

        // 跳转拜访详情
        goDetail (id, callBackVal) {
            let { status, clientId } = callBackVal;
            if(status != 0){
                if(clientId){
                  this.$router.push({path:"/VisitDetails/VisitContent",query:{id:id}})
                }else{
                  location.href=`${_.baseURL}/jsp/wap/outsideworkinfo/outsideworkinfo_detail.jsp?id=${id}`;
                }
            }
            else{
                this.$router.replace({name: 'visitOperate', query: {visitId: id, status: status, source: 'list', appId: '1'}});
            }
        },
        
          //点击+
        onClickAdd(){
          this.$router.push({path:"/visitOperate",query:{
            from:"list"
          }})
        },

        // 查看拜访未阅信息，触发路由改变，将获取未阅数据放在watch 钩子执行
        checkReadMsg () {
            this.$router.push({path: '/visitList/unread'});
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
                                // 返回到已阅列表
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
            // 处理url参数
            this.deelUrlParams();

            // 获取未阅信息数量
            this.getNotReadNum();

            // 请求拜访列表数据
            this.getListData();

            //请求高级搜索字段数据
            this.customerOption()
        },

        // 重置列表数据
        restData () {
            this.page = 1;
            this.listData = [];
        },

        // 重置搜索条件
        resetSearchData () {
            for(let key in this.listParams){
                if(key === 'tbCrmOutsideSearchVO.status'){
                    this.listParams[key] = 1;
                }
                else if(key === 'tbCrmOutsideSearchVO.readStatus' || key === 'stageType'){
                    this.listParams[key] = 0;
                }
                else if(key === 'searchType'){
                    this.listParams[key] = 1;
                }
                else if(key === 'tbCrmOutsideSearchVO.customFieldJson'){
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
            this.activeIdx = idx;
            if(!flag){
                this.restData();
                this.resetSearchData();
            }
            this.getNotReadNum();
            this.$set(this.cacheSearchValue, 'tbCrmOutsideSearchVO.owner',idx.toString());

            // 变换tab图标
            this.footerNav.map((item,index) => {
                item.icon = `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`;
            });
            this.$set(this.footerNav[idx],'icon',`crm-icon_base crm-icon_${TAB_TYPE[idx]}_blue`);

            if(!flag){
                this.getListData();
            }
            this.clickNoRead = false;
        },

        // 获取未阅信息数量
        getNotReadNum () {
            getNotReadNum().then(res => {
                if(res.code == '0'){
                    let { notvisitNum } = res.data;

                    // 显示顶部统计栏信息
                    this.readMsg = this.$route.path.includes('isread') ? `未阅 (${notvisitNum})` : '标记为已阅';
                    this.notReadCount = notvisitNum;
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
                this.advancedShow = true;
                return false;
            }
            return true;
        },

        // 单选按钮回调事件,setting的值
        checkedRadio(index,key,value){
            if(key === 'stageType'){//自定义创建时间按钮
                this.$set(this.cacheSearchValue, 'tbCrmOutsideSearchVO.startTime','');
                this.$set(this.cacheSearchValue, 'tbCrmOutsideSearchVO.endTime','');
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
        search (searchValue) {
            let keyList = Object.keys(searchValue);

            // 没有返回数据，则重置数据
            if(keyList.length > 0){
                keyList.map((val,index) => { //遍历高级搜索组件返回的每个参数值
                    if(val.includes('custom-')){
                        let  customFieldJson = this.listParams['tbCrmOutsideSearchVO.customFieldJson']
                        typeof customFieldJson == "string" && (this.listParams['tbCrmOutsideSearchVO.customFieldJson'] = JSON.parse(customFieldJson))
                        this.listParams['tbCrmOutsideSearchVO.customFieldJson']['fieldList'].map((item,index) => {
                            if(item['fieldId'] === val){
                                item['fieldValue'] = searchValue[val]
                                delete searchValue[val]
                            }
                        })
                    }
                })

                //选择创建时间段
                let stageType = searchValue['stageType']
                if(searchValue['stageType']){
                    switch (stageType){
                        case '2':
                            searchValue['tbCrmOutsideSearchVO.startTime'] = getCurrentYearMonth()[0]
                            searchValue['tbCrmOutsideSearchVO.endTime'] = searchValue['tbCrmOutsideSearchVO.startTime']
                            break;
                        case '3':
                            searchValue['tbCrmOutsideSearchVO.startTime'] = getDataYearQuarter()[0]
                            searchValue['tbCrmOutsideSearchVO.endTime'] = getDataYearQuarter()[1]
                            break;
                        case '1':
                            searchValue['tbCrmOutsideSearchVO.startTime'] = getDataYear()[0]
                            searchValue['tbCrmOutsideSearchVO.endTime'] = getDataYear()[1]
                            break;
                    }
                }
                let outsideStartTime = searchValue['tbCrmOutsideSearchVO.startDate'];
                let outsideEndTime = searchValue['tbCrmOutsideSearchVO.endDate'];
                let createStartTime = searchValue['tbCrmOutsideSearchVO.startTime'];
                let createEndTime = searchValue['tbCrmOutsideSearchVO.endTime'];

                // 判断开始时间是否大于结束时间
                if(!this.compareDate(outsideStartTime, outsideEndTime, '拜访开始时间不能大于结束时间')) return;
                if(!this.compareDate(createStartTime, createEndTime, '创建开始时间不能大于结束时间')) return;

                this.listParams = Object.assign({},this.listParams,searchValue);

                // 如果是草稿状态，则重置未阅状态
                if(this.listParams['tbCrmOutsideSearchVO.status'] == 0){
                    this.listParams['tbCrmOutsideSearchVO.readStatus'] = 0;
                }
            }
            else{
                this.resetFooterTab();
                this.resetSearchData();
            }
            //点击高级搜索所有者跳页面
            owner = searchValue['tbCrmOutsideSearchVO.owner']
            this.tabOneClick ('0', true)
            this.restData();
            this.getListData(true);
            this.clickNoRead = false;
        },

        // 关闭高级搜索
        searchClose () {
            this.advancedShow = false;
        },

        // 打开高级搜索
        searchOpen () {
            this.advancedShow = true;
        },

        //打开和关闭设置筛选条件
        openDraggable(){
            this.showDraggable = !this.showDraggable
            this.showDraggable && this.getOptionSetting()//showDraggable为真执行函数
        },

        //获取高级搜索自定义字段
        customerOption(){
            customerOption().then(res => {
                if(res.code === '0'){
                    let searchPageList = res.data.searchPageList

                    // 寻找选人setting
                    searchPageList.map(item=>{
                        if(item.type==='selectUserOrDepart'){
                            item.selectConfig = fakeSelectConfig
                        }
                    })

                    this.setting = this.settingData.concat(searchPageList)

                    // 循环每个setting字段的key值
                    if(searchPageList && searchPageList.length > 0){
                        let keys = {}//总字段的key值
                        let flag = true //只执行一次的flag
                        searchPageList.map((item,index) => {//遍历每个字段
                            item['key'].forEach((val,index) => {//遍历每个字段的key数组
                                let key = {} //保存每个字段的key值
                                if(item['customOption']){//如果是用户自定义的字段，组一个json传参
                                    if(flag){
                                        this.listParams['tbCrmOutsideSearchVO.customFieldJson'] = {}
                                        this.listParams['tbCrmOutsideSearchVO.customFieldJson']['fieldList'] = []
                                        flag = false
                                    }
                                    let fieldObj = {}
                                    fieldObj['fieldId'] = val
                                    fieldObj['fieldValue'] = ''
                                    fieldObj['type'] = item['customOptionType']
                                    this.listParams['tbCrmOutsideSearchVO.customFieldJson']['fieldList'].push(fieldObj)
                                }
                                else{
                                    key[val] = ''
                                    keys = Object.assign({},keys,key)
                                }
                            })
                        })
                        this.listParams = Object.assign({},this.listParams,keys)
                    }
                }
                else{
                    _.alert('提示',res.desc);
                }
            })
        },

        //获取启用和不启用数据列表
        getOptionSetting(){
            _.showLoading('')
            getOptionSetting().then(res => {
                if(res.code === '0'){
                    let optionSetting = res.data
                    optionSetting.enabledList.map((item,index) => {
                        if(item.sort === -1){
                            fixDragData = optionSetting.enabledList.splice(index,1)
                        }
                    })
                    this.optionSetting = optionSetting
                }
                else{
                    _.alert('提示',res.desc);
                }
                _.hideLoading('');
            })
        },

        //提交自定义字段拖拽后数据
        submitDragData(enabledList){
            let enabledListData = {
                    'enabledList': JSON.stringify(enabledList.concat(fixDragData))
                }
            _.showLoading('')
            submitDragData(enabledListData).then(res => {
                if(res.code === '0'){
                    this.openDraggable()
                    this.customerOption()
                }
                else{
                    _.alert('提示',res.desc);
                }
                _.hideLoading('');
            })
        },

        // 删除列表项
        delItem (id) {
            _.alert("提示","确定删除拜访单？",{
                primaryBtn:{
                    name: "i18n.confirm",
                    callBack: () => {
                        let obj = {
                            ids: id
                        }

                        delVisit(obj).then(res => {
                            if(res.code == '0'){
                                this.restData();
                                this.getListData();
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

        // 重置底部图标
        resetFooterTab () {
            this.activeIdx = 0;
            this.footerNav.map((item,index) => {
                item.icon = index === 0? 'crm-icon_base crm-icon_allVisit_blue' : `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`
            });
        },

        // 处理url参数
        deelUrlParams () {
            let { status } = this.$route.query;

            // 判断是否草稿状态
            if(status){
                this.cacheSearchValue['tbCrmOutsideSearchVO.status'] = this.listParams['tbCrmOutsideSearchVO.status'] = status;
            }
        }
    },
    watch: {
        // 路由监控
        '$route' (to, from) {
            // 点击未阅的时候监听路由变化 ，防止点击前进按钮出现页面没反应的情况
            if (to.params.status === 'unread' && !from.path.includes('VisitDetails')) {
                this.restData();
                this.resetSearchData();
                this.getListData();
                // 获取未阅客户信息数量
                this.getNotReadNum();
            }

            // 从详情回到列表时不重新请求数据
            if (to.params.status === 'isread' && !from.path.includes('VisitDetails')) {  // 从未阅跳转到已阅
                let idx;
                this.footerNav.forEach((item, index) => {
                    // 判断当前所处的tab
                    if (item.icon.includes('blue')) {
                        idx = item.index;
                    }   
                });
                // 根据当前所处的tab 重新请求对应tab 的数据
                this.$set(this.listParams, `tbCrmOutsideSearchVO.${TAB_TYPE[idx]}`, _.userId);
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
@import './VisitList.scss';
@import "crm/components/CrmFixedNail/CrmFixedNail.scss";
</style>


