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
            @reset="resetAdSearch"
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
            <!-- 由于顶部统计栏固定不随页面滚动，需要调整列表滚动区域，将v-scroll 跟ref 移到列表节点，记录退出列表页的滚动位置 -->
            <div class="crm-list-content" v-scroll="loadMore" ref="wrapMain">
                <crm-list
                    :listData="listData"
                    @click="goDetail"
                    @delEvent="delItem"
                    :isEllipsis="true"
                    :rightDel="true"
                >
                </crm-list>
                <load-more
                    :loading="loadingMore"
                    :currPage="page"
                    :maxPage="maxPage"
                >
                    <div class="member_tips">金额总计 {{totalMoney}}万元</div>
                </load-more>
                <no-record
                    :stepTop="true"
                    :hasRecord="noRecord"
                    v-show="showRecord">
                </no-record>
            </div>
        </div>
        <crm-fixed-nail path="/contractOperate" :routerParams="{agentCode: $route.query.agentCode || 'crm'}" v-if="isShowNavFooterAndBtn"></crm-fixed-nail>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box';
import LoadMore from '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import AdvancedSearch from '@/components/base/AdvancedSearch/index';
import userChoose from '@/components/base/user_or_dept_select'
import customerDrag from '../../../components/drag/drag'
import CrmList from '../../../components/CrmList/CrmList';
import CrmFixedNail from '../../../components/CrmFixedNail/CrmFixedNail';
import CrmReadBar from '../../../components/CrmReadBar/CrmReadBar';
import { getContractList, readAll, delContract , customerOption, getOptionSetting, submitDragData} from '../../../api/contract/getData';
import { getCurrentYearMonth, getDataYear, getDataYearQuarter} from '../../../utils/index.js'
import { mapActions } from 'vuex';

import CrmPageLoading from "crm/components/CrmPageLoading";

const PERSON_TYPE = ['tbCrmContractSearchVO.chargePerson','tbCrmContractSearchVO.relater','tbCrmContractSearchVO.createPerson']  //高级搜索选人的类型
let fixDragData = [] //拖拽固定传的数据（创建时间）

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
    name: 'ContractList',
    components: {
        SearchBox,
        CrmList,
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
            listData: [],  // 列表配置
            listParams: {}, //请求列表后台参数
            listParamsData: {  // 请求列表后台参数默认数据
                'tbCrmContractSearchVO.readStatus': '',
                'tbCrmContractSearchVO.submitStatus': 1,
                'tbCrmContractSearchVO.contractStatus': '',
                'tbCrmContractSearchVO.contractOwner': '',
                'tbCrmContractSearchVO.contractType': '',
                'tbCrmContractSearchVO.startSearchTime': '',
                'tbCrmContractSearchVO.endSearchTime': '',
                'tbCrmContractSearchVO.startQueryTime': '',
                'tbCrmContractSearchVO.endQueryTime': '',
                'tbCrmContractSearchVO.startContractAmount': '',
                'tbCrmContractSearchVO.endContractAmount': '',
                'tbCrmContractSearchVO.startPaymentAmount': '',
                'tbCrmContractSearchVO.endPaymentAmount': '',
                'tbCrmContractSearchVO.startNonPaymentAmount': '',
                'tbCrmContractSearchVO.endNonPaymentAmount': '',
                'tbCrmContractSearchVO.startDeelTime': '',
                'tbCrmContractSearchVO.endDeelTime': '',
                'tbCrmContractSearchVO.startCreateTime': '',
                'tbCrmContractSearchVO.endCreateTime': '',
                'tbCrmContractSearchVO.startEditTime': '',
                'tbCrmContractSearchVO.endEditTime': '',
                'tbCrmContractSearchVO.contractName': '',
                'tbCrmContractSearchVO.clientName': '',
                'tbCrmContractSearchVO.chargePerson': '',
                'tbCrmContractSearchVO.relater': '',
                'tbCrmContractSearchVO.createPerson': '',
                'tbCrmContractSearchVO.keyWord': '',
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
                    label: '',
                    key: 'tbCrmContractSearchVO.contractOwner',
                    type: 'radio',
                    value: [
                        { text: '全部', value: ''},
                        { text: '我负责的', value: '0'},
                        { text: '我相关的', value: '2'},
                        { text: '我创建的', value: '1'},
                        { text: '待处理的', value: '3'},
                        { text: '已处理的', value: '4'},
                        { text: '即将到期的', value: '7'},
                        { text: '未回款', value: '8'},
                    ]
                },
                {
                    label: '发布状态',
                    key: 'tbCrmContractSearchVO.submitStatus',
                    type: 'radio',
                    value: [{ text: '已提交', value: '1'}, { text: '草稿', value: '0'}]
                },
            ],
            advancedShow: false,  // 是否显示高级搜索
            cacheSearchValue: {},  // 高级搜索缓存
            showDraggable: false, // 是否显示设置筛选条件列表
            optionSetting: {}, //后台对应的自定义设置字段
            totalMoney: 0,  // 商机总金额
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
                name: 'ContractList'
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
    activated () {
        let isAudit = this.$route.query.isAudit;

        if(isAudit && isAudit == 'ok'){
            this.restData();
            this.getListData();
        }
    },
    methods: {
        ...mapActions('list',[
            'setCacheArray'
        ]),

        // 搜索框回调函数
        showMsgFromSearchBox (keyWord, val) {
            this.listParams['tbCrmContractSearchVO.keyWord'] = keyWord;
            this.restData();
            this.getListData(true);
        },

        // 请求列表数据(isSearch: 是否为搜索)
        getListData (isSearch) {
            let  customFieldJson = this.listParams['tbCrmContractSearchVO.customFieldJson']
            typeof customFieldJson !== 'string' && (this.listParams['tbCrmContractSearchVO.customFieldJson'] = JSON.stringify(customFieldJson))
            // 根据路由参数判断已阅未阅状态
            this.$set(this.listParams, 'tbCrmContractSearchVO.readStatus', this.$route.path.includes('isread') ? '' : 0)

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
            //切割选部门数据
            if(this.listParams['tbCrmContractSearchVO.deptName']){
                let deptNameStr = ''
                this.listParams['tbCrmContractSearchVO.deptName']['depts'].forEach(item =>{
                    deptNameStr+=item.departmentName+','
                })
                deptNameStr = deptNameStr.substring(0,deptNameStr.length-1)
                this.listParams['tbCrmContractSearchVO.deptName'] = deptNameStr
            }

            let obj = {
                ...this.listParams,
                page: this.page
            }
            this.loadingMore = true;
            this.isSearch = isSearch;

            getContractList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let { maxPage, totalRows, contractNum, allCount } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    // 判断是否显示更多
                    this.hasMore = this.page < this.maxPage;
                    this.loadingMore = false;
                    this.totalMoney = Math.round(allCount/10000 * 100)/100;
                    // 添加左上角统计说明
                    this.totalMsg = `共 ${totalRows} 个合同`;

                    // 显示顶部统计栏信息
                    this.readMsg = this.$route.path.includes('isread') ? `未阅 (${contractNum})`: '标记为已阅';
                    this.isShowNavFooterAndBtn = this.$route.path.includes('isread');
                    this.$set(this, 'isRead', this.$route.path.includes('isread'));
                    
                    this.notReadCount = contractNum;

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
                            // 设置状态标签的文字和样式
                            let approveClass = '', approveStatus = '';
                            approveStatus = item.approveStatus == '已退审'? '退审' : item.approveStatus;
                            if(item.approveStatus == '审批中'){
                                approveClass = 'status_blue';
                            }
                            else if(item.approveStatus == '已审批'){
                                approveClass = 'status_green';
                            }
                            else if(item.approveStatus == '草稿'){
                                approveClass = 'status_draft';
                            }
                            else{
                                approveClass = item.approveClass;
                            }
                            let obj = {
                                id: item.id,
                                top: item.title,
                                showDel: item.submitStatus == 0? true : false,
                                showTab: item.isFree == 4 && item.approveStatus != '草稿' ? false : true,  // 如果isFress等于4(无需审批)并且不是“草稿”类型，则不显示状态标签
                                tabClass: approveClass,
                                tabName: approveStatus,
                                mid: [
                                    {
                                        title: '',
                                        value: item.startTime && item.endTime ? `${item.startTime} 至 ${item.endTime}` : ( item.startTime ? `开始日期  ${item.startTime}`: "" || item.endTime ? `结束日期  ${item.endTime}`: "" ) ,
                                        valueColor: '#999'
                                    },
                                    {
                                        title: '合同金额(元) ',
                                        value: ` ${_.formatMoney(item.contractAmount,2)}`,
                                        titleColor: '#999',
                                        valueColor: '#F56262'
                                    },
                                    {
                                        title: '回款金额(元) ',
                                        value: `${_.formatMoney(item.paymentAmount,2)}`,
                                        titleColor: '#999',
                                        valueColor: '#F56262'
                                    }
                                ],
                                bottom: {
                                    isShowAvator: false,
                                    msg: { },
                                    data: [
                                        {
                                            title: '',
                                            value: item.clientName || '未填写',
                                            fontSize: '14px',
                                            valueColor: '#666'
                                        }
                                    ]
                                },
                                callBackVal: {status: item.submitStatus,isUEditor:item.isUEditor}
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

        // 加载更多列表
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
        goDetail (id, callBackVal) {
            let { status, isUEditor } = callBackVal;

            if(status == 0){
                if(Number(isUEditor) && !(_.isWeChat() && !_.isWeChatApp())){
                    _.alert('提示','内容由富文本编辑器生成，请在PC端修改')
                    return
                }
                this.$router.replace({name: 'contractOperate', query: {contractId: id, agentCode: this.$route.query.agentCode || 'crm'}});
            }
            else{
                this.$router.push({path:"/ContractContent",query:{id:id,isFromContractList:1, agentCode: this.$route.query.agentCode || 'crm'}});
            }
        },

        // 查看未阅信息，触发路由改变，将获取未阅数据放在watch 钩子执行
        checkReadMsg () {
            this.$router.push({path: '/contractList/unread'});
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
            // 处理url参数
            this.deelUrlParams();

            // 请求列表数据
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
                if(key === 'tbCrmContractSearchVO.submitStatus'){
                    this.listParams[key] = 1;
                }
                else if(key === 'tbCrmContractSearchVO.customFieldJson'){
                    if(this.listParams['tbCrmContractSearchVO.customFieldJson']){
                        let customFieldJson = this.listParams['tbCrmContractSearchVO.customFieldJson'];
                        typeof customFieldJson == "string" && (this.listParams['tbCrmContractSearchVO.customFieldJson'] = JSON.parse(customFieldJson));
                        this.listParams['tbCrmContractSearchVO.customFieldJson']['fieldList'] = this.customArray;
                    }
                }
                else if(key === 'stageType'){
                    this.listParams[key] = 0;
                }
                else{
                    this.listParams[key] = '';
                }
            }

            // 清除搜索框内容
            this.$refs.searchBox.clearInput();
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
                this.$set(this.cacheSearchValue, 'tbCrmContractSearchVO.startCreateTime','');
                this.$set(this.cacheSearchValue, 'tbCrmContractSearchVO.endCreateTime','');
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

        // 重置高级搜索
        resetAdSearch () {
            // 清空缓存
            this.cacheSearchValue = {}
            this.searchValue = {}
            this.resetSearchData();
        },

        // 高级搜索
        search (searchValue) {
            let keyList = Object.keys(searchValue);

            // 没有返回数据，则重置数据
            if(keyList.length > 0){
                //选择创建时间段
                let stageType = searchValue['stageType']
                if(searchValue['stageType']){
                    switch (stageType){
                        case '2':
                            searchValue['tbCrmContractSearchVO.startCreateTime'] = getCurrentYearMonth()[0]
                            searchValue['tbCrmContractSearchVO.endCreateTime'] = searchValue['tbCrmContractSearchVO.startTime']
                            break;
                        case '3':
                            searchValue['tbCrmContractSearchVO.startCreateTime'] = getDataYearQuarter()[0]
                            searchValue['tbCrmContractSearchVO.endCreateTime'] = getDataYearQuarter()[1]
                            break;
                        case '1':
                            searchValue['tbCrmContractSearchVO.startCreateTime'] = getDataYear()[0]
                            searchValue['tbCrmContractSearchVO.endCreateTime'] = getDataYear()[1]
                            break;
                    }
                }
                let startSearchTime = searchValue['tbCrmContractSearchVO.startSearchTime'];
                let endSearchTime = searchValue['tbCrmContractSearchVO.endSearchTime'];
                let startQueryTime = searchValue['tbCrmContractSearchVO.startQueryTime'];
                let endQueryTime = searchValue['tbCrmContractSearchVO.endQueryTime'];
                let createStartTime = searchValue['tbCrmContractSearchVO.startCreateTime'];
                let createEndTime = searchValue['tbCrmContractSearchVO.endCreateTime'];
                let startDeelTime = searchValue['tbCrmContractSearchVO.startDeelTime'];
                let endDeelTime = searchValue['tbCrmContractSearchVO.endDeelTime'];

                // 判断开始时间是否大于结束时间
                if(!this.compareDate(startSearchTime, endSearchTime, '结束时间不能早于开始时间')) return;
                if(!this.compareDate(startQueryTime, endQueryTime, '结束时间不能早于开始时间')) return;
                if(!this.compareDate(createStartTime, createEndTime, '创建开始时间不能大于结束时间')) return;
                if(!this.compareDate(startDeelTime, endDeelTime, '结束时间不能早于开始时间')) return;

                // 组装自定义字段
                let customFieldJson = this.listParams['tbCrmContractSearchVO.customFieldJson'];
                let normalParams = {
                  ['tbCrmContractSearchVO.customFieldJson']:customFieldJson
                };
    
                typeof customFieldJson == "string" && (normalParams['tbCrmContractSearchVO.customFieldJson'] = JSON.parse(customFieldJson));

                keyList.map((val,index) => {
                    if(val.includes('custom-') || val.includes('client-')){
                        normalParams['tbCrmContractSearchVO.customFieldJson']['fieldList'].map((item,index) => {
                            if(item['fieldId'] === val){
                                item['fieldValue'] = searchValue[val]
                            }
                        });
                    }
                    else{
                        normalParams[val] = searchValue[val]
                    }
                })

                this.listParams = Object.assign({},this.listParamsData,normalParams);

                // 如果是草稿状态，则重置合同归属
                if(this.listParams['tbCrmContractSearchVO.submitStatus'] == 0){
                    this.listParams['tbCrmContractSearchVO.contractOwner'] = '';
                }
            }else{
                this.listParams = this.listParamsData
            }

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
                    let createdTimeIndex = null;
                    let createdTimeObj = null;
                     // 寻找选人setting
                    searchPageList.map((item,index)=>{
                        if(item.type==='selectUserOrDepart'){
                            item.selectConfig = fakeSelectConfig
                        }
                        // 如果有 创建时间 这一项。那么在日期选择框下添加一组radio ： 【本月】【本季】【本年】
                        if( item.optionId === 'createdTime' ){
                            item['callBack'] = {
                                start: this.startTimeChange,
                                end: this.endTimeChange
                            }
                            let obj = {
                                customOption: false,
                                customOptionType: "",
                                deptRestriction: "",
                                format: "",
                                key: 'stageType',
                                label: "",
                                noDefault: true,
                                optionId: "stageType",
                                placeholder: [],
                                selectType: "",
                                type: 'radio',
                                userRestriction: '',
                                value: [{ text: '本月', value: '2'},{ text: '本季', value: '3'},{ text: '今年', value: '1'}]
                            }
                            createdTimeIndex = index;
                            createdTimeObj = obj; 
                        }
                    })
                    if( createdTimeObj ){
                        searchPageList.splice(parseInt(createdTimeIndex)+1,0,createdTimeObj)    
                    }
                    this.setting = this.settingData.concat(res.data.searchPageList)

                    // 循环每个setting字段的key值
                    if(searchPageList && searchPageList.length > 0){
                        let keys = {}//总字段的key值
                        let flag = true //只执行一次的flag
                        this.customArray = [];
                        searchPageList.map((item,index) => {//遍历每个字段
                            if( item['optionId'] !== 'stageType' ){ // 不对创建时间 的 本月 本季 今年 选项进行遍历
                                item['key'].forEach((val,index) => {//遍历每个字段的key数组
                                    let key = {} //保存每个字段的key值
                                    if(item['customOption']){//如果是用户自定义的字段，组一个json传参
                                        if(flag){
                                            this.listParams['tbCrmContractSearchVO.customFieldJson'] = {}
                                            this.listParams['tbCrmContractSearchVO.customFieldJson']['fieldList'] = []
                                            flag = false
                                        }
                                        let fieldObj = {}
                                        fieldObj['fieldId'] = val
                                        fieldObj['fieldValue'] = ''
                                        fieldObj['type'] = item['customOptionType']
                                        this.customArray.push(JSON.parse(JSON.stringify(fieldObj)));
                                        this.listParams['tbCrmContractSearchVO.customFieldJson']['fieldList'].push(fieldObj)
                                    }
                                    else{
                                        key[val] = ''
                                        keys = Object.assign({},keys,key)
                                    }
                                })
                            }
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
            _.alert("提示","删除合同数据将无法恢复，请确定是否要删除？",{
                primaryBtn:{
                    name: "i18n.confirm",
                    callBack: () => {
                        let obj = {
                            id:id
                        }

                        delContract(obj).then(res => {
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

        // 处理url参数
        deelUrlParams () {
            let paramsKeys = Object.keys(this.$route.query);

            // 根据参数初始化高级搜索状态
            paramsKeys.map(item => {
                if(item != 'isAudit'){
                    this.cacheSearchValue[`tbCrmContractSearchVO.${item}`] = this.listParams[`tbCrmContractSearchVO.${item}`] = this.$route.query[item];
                }
            });
        }
    },
    watch: {
        // 路由监控
        '$route' (to, from) {
            // 点击未阅的时候监听路由变化 ，防止点击前进按钮出现页面没反应的情况
            if (to.params.status === 'unread' && !from.path.includes('ContractContent')) {
                this.restData();
                this.resetSearchData();
                this.getListData();
            }

            // 从详情回到列表时不重新请求数据
            if (to.params.status === 'isread' && !from.path.includes('ContractContent')) {  // 从未阅跳转到已阅
                this.showRecord = false;
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
@import './ContractList.scss'
</style>


