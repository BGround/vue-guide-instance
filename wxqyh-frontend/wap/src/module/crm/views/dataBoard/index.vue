<template>
    <div class="data_board_index">
        <div class="filter_wrap">
            <crm-filter-bar
                :filterConfig="filterConfig"
                @choose="chooseItem"
            >
                <div class="crm_filter_help" @click="clickHelp">
                    <i class="help_icon">?</i>
                </div>
            </crm-filter-bar>
        </div>
        <div class="filter_main">
            <crm-scroll ref="scroll">
                <div>
                    <card-swiper :cardData="cardData" @goClient="dealGoClient" @goUrl="goUrl"></card-swiper>
                </div>
                <div ref="contractReceived">
                    <contract-received :contractData="contractData" @click="goContract"></contract-received>
                </div>
                <div ref="saleAnalysis">
                    <sales-analysis :saleBehaviorData="saleBehaviorData" @click="goAnalysis"></sales-analysis>
                </div>                
                <div v-if=" searchTimeType != 'week' && searchTimeType != 'lastWeek' ">                    
                    <achievement-goal :goalData="goalData" @click="goGoal"></achievement-goal>
                </div>
                <div class="border_msg main_item" ref="businessDistribution" @click="goBusiness">
                    <distribution-list :distributionData="distributionData"></distribution-list>
                </div>
                <div class="border_msg main_item" ref="saleFunnel" @click="goFunnel">
                    <h1 class="title">销售漏斗</h1>
                    <funnel-content v-bind="saleFunnelData" @tabChage="tabChage"></funnel-content>
                </div>
                <!--<div class="border_msg main_item client_remind">-->
                    <!--<h1 class="title">客户回收提醒</h1>-->
                    <!--<div class="recycle_client_wrap" v-show="!showRemindTips">-->
                        <!--<div class="recycle_msg">-->
                            <!--<span>即将被回收的客户</span>-->
                            <!--<span class="recycle_num">{{recycleNum}}</span>-->
                        <!--</div>-->
                        <!--<crm-list-->
                            <!--:listData="listData"-->
                            <!--@click="goDetail"-->
                            <!--:isEllipsis="true"-->
                        <!--&gt;</crm-list>-->
                        <!--<div class="view_all" @click="viewRecycle">查看全部</div>-->
                    <!--</div>-->
                    <!--<div class="no_remind" v-show="showRemindTips">-->
                        <!--没有即将回收的客户-->
                    <!--</div>-->
                <!--</div>-->

                <!-- 底部tab -->
                <div class="height50"></div>
            </crm-scroll>
        </div>
        <div class="help_mask wrap" v-show="showHelp">
            <div class="step_item step_item1" v-show="helpStep === 1">
                <div>
                    <div class="frame">快捷筛选</div>
                    <div class="step_arrow_wrap">
                        <div class="step_up_arrow"></div>
                    </div>
                    <div class="step_msg">
                        <p class="mb5">这里可以进行</p>
                        <p>整个页面数据的快捷筛选</p>
                    </div>
                </div>
                <div class="next_step_btn" @click="nextStep(1)"></div>
            </div>
            <div class="step_item step_item2" v-show="helpStep === 2">
                <div>
                    <div class="frame"></div>
                    <div class="step_arrow_wrap">
                        <div class="step_up_arrow"></div>
                    </div>
                    <div class="step_msg">
                        <p class="first_msg">实时更新成交数据,销售业绩随时查看</p>
                        <p class="mb25">这里是商机处于赢单阶段的金额、数量、关联的客户（按结单日期统计）</p>
                        <p>向左滑动可以切换为合同面板，查看合同的签约金额，数量、关联的客户（按签约日期统计）</p>
                    </div>
                </div>
                <div class="next_step_btn" @click="nextStep(2)"></div>
            </div>
            <div class="step_item step_item3" v-show="helpStep === 3">
                <div>
                    <div class="frame"></div>
                    <div class="step_arrow_wrap">
                        <div class="step_up_arrow"></div>
                    </div>
                    <div class="step_msg">
                        <p class="first_msg">跟踪回款有节奏，资金回笼有保证</p>
                        <p>可查看计划、实际回款金额和合同开票的金额，点击可以查看回款统计图表</p>
                    </div>
                </div>
                <div class="next_step_btn" @click="nextStep(3)"></div>
            </div>
            <div class="step_item step_item4" v-show="helpStep === 4">
                <div>
                    <div class="frame"></div>
                    <div class="step_arrow_wrap">
                        <div class="step_up_arrow"></div>
                    </div>
                    <div class="step_msg">
                        <p class="first_msg">随时了解业务执行情况，实现过程全记录</p>
                        <p>统计业务员负责的各项业绩指标，了解每天的销售情况，点击详情查看趋势统计</p>
                    </div>
                </div>
                <div class="next_step_btn" @click="nextStep(4)"></div>
            </div>
            <div class="step_item step_item5" v-show="helpStep === 5">
                <div>
                    <div class="frame"></div>
                    <div class="step_arrow_wrap">
                        <div class="step_up_arrow"></div>
                    </div>
                    <div class="step_msg">
                        <p class="first_msg">商机分布直观展示，销售环节牢牢把控</p>
                        <p>展示各个阶段下商机数量及占比，点击可查看商机统计详情</p>
                    </div>
                </div>
                <div class="next_step_btn" @click="nextStep(5)"></div>
            </div>
            <div class="step_item step_item6" v-show="helpStep === 6">
                <div class="end_btn" @click="endStep"></div>
                <div>
                    <div class="step_msg">
                        <p class="first_msg">销售漏斗科学预测，业绩运筹帷幄</p>
                        <p class="mb5">按结单日期统计各个阶段的商机</p>
                        <p>按赢率科学预测商机成交金额</p>
                    </div>
                    <div class="step_arrow_wrap">
                        <div class="step_down_arrow"></div>
                    </div>
                    <div class="frame"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import CrmFilterBar from '../../components/CrmFilterBar/CrmFilterBar';
import CrmList from '../../components/CrmList/CrmList';
import CrmScroll from '../../components/CrmScroll/CrmScroll';
import cardSwiper from './components/cardSwiper';
import contractReceived from './components/contractReceived';
import salesAnalysis from './components/salesAnalysis';
import achievementGoal from './components/achievementGoal';
import distributionList from './components/distributionList/distributionList';
import funnelContent from './components/funnelContent.vue';
import { getDataBoard, isTeamCharge, getGoalPanel, getSaleTeam, validTeamMgr, getClientRecycle } from '../../api/dataBoard/getData.js';
import { mapActions} from 'vuex';

export default {
    name: 'dataBoardIndex',
    components: {
        CrmFilterBar,
        CrmScroll,
        cardSwiper,
        contractReceived,
        salesAnalysis,
        achievementGoal,
        distributionList,
        funnelContent,
        CrmList
    },
    data () {
        return {
            filterConfig: {  // 筛选项配置
                itemData: [
                        {
                            key: 'time',
                            show: true,
                            type: 'radioSelect',
                            data: [
                                {
                                    name: '本周',
                                    key: 'week'
                                },
                                {
                                    name: '上周',
                                    key: 'lastWeek'
                                },
                                {
                                    name: '本月',
                                    key: 'month'
                                },
                                {
                                    name: '上月',
                                    key: 'lastMonth'
                                },
                                {
                                    name: '本季',
                                    key: 'season'
                                },
                                {
                                    name: '今年',
                                    key: 'year'
                                }
                            ]
                        },
                        {
                            key: 'teamOrPerson',
                            show: true,
                            type: 'radioSelect',
                            data: [
                                {
                                    name: '个人',
                                    key: 'person'
                                }
                            ]
                        },
                        {
                            key: 'team',
                            show: false,
                            type: 'radioSelect',
                            data: []
                        }
                    ]
            },
            teamCharge: false,  // 是否为团队负责人
            contractData: {  // 合同回款数据
                actualRepayAmount: 0,
                planRepayAmount: 0,
                billRepayAmount: 0
            },
            cardData: {  // 滑动卡数据
                finishValue: 0,  // 商机赢单金额
                successBusinessNum: 0,  // 赢单商机
                successBusinessCount: 0,  // 赢单客户
                signContractAmount: 0,  // 合同签约金额
                count: 0,  // 签约合同
                successContractCount: 0  // 签约客户
            },
            saleBehaviorData: {  // 销售行为分析
                lastAddBusinessCount: 0,
                lastAddClientCount: 0,
                lastAddContactsCount: 0,
                lastAddContractCount: 0,
                lastAddVisitCount: 0
            },
            goalData: {  // 目标数据
                completionRate: '0%',
                goalAmount: 0,
                finishedAmount: 0,
                name: '商机赢单金额'
            },
            distributionData: [],  // 商机分布数据
            saleFunnelData: {  // 销售漏斗数据
                funnelData: {
                    id: 'funnel',
                    title: {
                        text: ''
                    },
                    format: '<b>{point.name}</b>({point.y:,.0f}万)',
                    neckWidth: '40%',
                    neckHeight: '15%',
                    chartData: []
                },
                totalMoney: 0,
                expectedMoney: 0
            },
            moneyFunnel: [],  // 销售金额
            businessFunnel: [],  // 商机个数
            teamOrPerson: 'person',  // 团队或个人
            searchTimeType: 'month',  // 搜索时间
            teamId: '',  // 销售团队
            page: 1,  // 销售团队列表页数
            showHelp: false, // 是否显示帮助
            helpStep: 1,  // 帮助步骤数
            showRemindTips: false,  // 是否显示没有回收客户
            recycleNum: 0,  // 即将回收客户数
            listData: []  // 回收客户列表
        }
    },
    computed: {
        owner () {  // owner值
            switch(this.teamOrPerson){
                case 'person':
                    return 1;
                    break;
                case 'team':
                    return 4;
                    break;
            }
        },
        queryType () {  // queryType值
            let result;
            switch(this.searchTimeType){
                case 'season':
                    result = 'query_by_season';
                    break;
                case 'year':    
                case 'month':
                case 'lastMonth':
                    result = 'query_by_month';
                    break;
                case 'week':
                case 'lastWeek':
                    result = 'query_by_day';
                    break;
            }     
            return result; 
            // return this.searchTimeType == 'season' ? 'query_by_season' : 'query_by_month'
        }
    },
    created () {
          this.init();
          this.delCacheArray('salesTurnoverTrend')
    },
    methods: {
        // 进入成交客户
        dealGoClient(type){
            let ownerList = {
                'team': 4,
                'person': 1
            }
            let owner = ownerList[this.teamOrPerson]
            this.$router.push({path: '/successClient', query: {owner: owner, successTime: this.searchTimeType, type: type, teamIds: this.teamId || ''}});
        },

        // 初始化数据
        init () {
            this.isTeamCharge().then(res => {
                let storeData = localStorage.getItem('dataBoard');

                // 若存在缓存则读取缓存，否则请求数据
                if(storeData && storeData != ''){
                    this.getBarStore();
                }
                else{
                    this.getData();
                }
            });

            // 获取客户回收信息
            this.getClientRecycle();
        },

        // 获取客户回收信息
        getClientRecycle () {
            getClientRecycle().then(res => {
                if(res.code == '0'){
                    let { pageData, totalRows } = res.data;
                    if(pageData){
                        if(totalRows > 0){
                            let list = pageData.slice(0,3);
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
                        else{
                            this.showRemindTips = true;
                        }
                    }
                    else{
                        this.showRemindTips = true;
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            })
        },

        // 选择每一项回调函数
        chooseItem (item, key) {            
            if(key === 'time'){  // 时间选择
                this.searchTimeType = item.key;
            }
            else if(key === 'teamOrPerson'){  // 个人或销售团队选择
                this.teamOrPerson = item.key;

                // 点击销售团队才加载数据
                if(item.key === 'team'){
                    this.getSaleTeam().then(res => {
                        this.storeBarData();
                        this.getData();
                    });
                    return;
                }
                else{
                    this.filterConfig.itemData[2].show = false;
                    this.teamId = '';
                }
            }
            else if(key === 'team'){  // 选择团队
                this.teamId = item.key;
            }

            // 缓存筛选条数据
            this.storeBarData();
            this.getData();
        },

        // 缓存筛选条功能
        storeBarData () {
            let obj = {
                time: this.searchTimeType,
                teamOrPerson: this.teamOrPerson,
                teamId: this.teamId
            }
            localStorage.setItem('dataBoard', JSON.stringify(obj));
        },

        // 获取筛选条缓存
        getBarStore () {
            let storeData = localStorage.getItem('dataBoard');
            let obj = JSON.parse(storeData);

            this.filterConfig.itemData[0].defaultVal = this.searchTimeType = obj.time;
            this.filterConfig.itemData[1].defaultVal = this.teamOrPerson = obj.teamOrPerson;

            // 如果前一次选择了团队才进行
            if(obj.teamId){
                this.validTeamMgr(obj.teamId).then(res => {
                    this.getSaleTeam().then(data => {
                        // 是团队负责人，则默认选中该公海
                        if(res){
                            this.filterConfig.itemData[2].defaultVal = this.teamId = obj.teamId;
                        }
                        this.getData();
                    })
                });
            }
            else{
                this.getData();
            }

        },

        // 获取数据看板数据
        getDataBoard () {
            let obj = {
                'tbBusinessFunnelSearchVO.owner': this.owner,
                'tbBusinessFunnelSearchVO.searchTimeType': this.searchTimeType,
                'tbBusinessFunnelSearchVO.teamIds': this.teamId
            }

            // _.showLoading();
            getDataBoard(obj).then(res => {
                if(res.code == '0'){
                    let {
                            contractDataCountVO,
                            funnelVO,
                            graphicVO,
                            successBusinessCount,
                            successContractCount,
                            saleBehaviorCountVO
                        } = res.data;

                    // 合同回款赋值
                    this.contractData = {
                        actualRepayAmount: contractDataCountVO.actualRepayAmount,
                        planRepayAmount: contractDataCountVO.planRepayAmount,
                        billRepayAmount: contractDataCountVO.billRepayAmount
                    }

                    // 滑动卡赋值
                    this.cardData = {
                        finishValue: funnelVO.finishMoney,
                        successBusinessNum: funnelVO.successBusinessNum,
                        successBusinessCount,
                        signContractAmount: contractDataCountVO.signContractAmount,
                        count: contractDataCountVO.count,
                        successContractCount
                    }

                    // 销售行为赋值
                    this.saleBehaviorData = saleBehaviorCountVO;

                    // 商机分布赋值
                    if(graphicVO.list){
                        this.distributionData = [];
                        graphicVO.list.map(item => {
                            let obj = {
                                id:item.stage,
                                name: item.stageName,
                                percentSum: item.businessNum,
                                percent: item.numPercent
                            }
                            this.distributionData.push(obj);
                        })
                    }

                    // 销售漏斗赋值
                    this.saleFunnelData.totalMoney = funnelVO.totalValue;
                    this.saleFunnelData.expectedMoney = funnelVO.buggetValue;

                    if(funnelVO.list){
                        // 重置数据
                        this.moneyFunnel = [];
                        this.businessFunnel = [];

                        funnelVO.list.map(item => {
                            this.moneyFunnel.push([item.stageName, item.num])
                            this.businessFunnel.push([item.stageName, item.businessNum])
                        });
                        this.saleFunnelData.funnelData.chartData = this.moneyFunnel;
                    }

                }
                else{
                    _.alert('提示', res.desc);
                }
                // _.hideLoading();
            })
        },

        // 获取是否为团队负责人
        isTeamCharge () {
            return new Promise((resolve, reject) => {
                isTeamCharge().then(res => {
                    if(res.code == '0'){
                        let { isTeamInCharge } = res.data;
                        this.teamCharge = isTeamInCharge;

                        // 如果是团队负责人，则显示销售团队选项
                        if(isTeamInCharge){
                            this.filterConfig.itemData[1].data.push({name: '销售团队', key: 'team'});
                        }
                        resolve('1');
                    }
                    else{
                        _.alert('提示', res.desc);
                    }
                })
            })
        },

        // 获取目标数据
        getGoalPanel () {
            let obj = {
                teamId: this.teamId,
                searchTimeType: this.searchTimeType,
                teamOrPerson: this.teamOrPerson
            }
            getGoalPanel(obj).then(res => {
                if(res.code == '0'){
                    let { goalPanel } = res.data;
                    this.goalData = {
                        completionRate: (goalPanel && goalPanel.completionRate) || '0%',
                        goalAmount: (goalPanel && goalPanel.goalAmount) || 0,
                        finishedAmount: (goalPanel && goalPanel.finishedAmount) || 0,
                        name: (goalPanel && goalPanel.goalTypeName) || '商机赢单金额'
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 获取销售团队
        getSaleTeam () {
            return new Promise((resolve, reject) => {
                let obj = {
                    page: this.page,
                    pageSize: 20
                }
                this.filterConfig.itemData[2].data = [];

                getSaleTeam(obj).then(res => {
                    if(res.code == '0'){
                        let { pageData } = res.data;

                        if(pageData && pageData.length > 0){
                            pageData.map((item,idx) => {
                                let teamObj = {
                                    name: item.teamName,
                                    key: item.id
                                }

                                if(idx === 0){
                                    this.teamId = item.id;
                                }
                                this.filterConfig.itemData[2].data.push(teamObj);
                            });
                        }
                        this.filterConfig.itemData[2].show = true;
                        resolve('1');
                    }
                    else{
                        _.alert('提示', res.desc);
                    }
                });
            })
        },

        // 获取数据
        getData () {
            this.getDataBoard();
            this.getGoalPanel();
        },

        // 进入合同回款
        goContract () {
            this.$router.push({
                path:'/dataStatistics',
                query:  {
                    teamOrPerson:this.teamOrPerson,
                    teamIds:this.teamId,
                    searchTimeType: this.searchTimeType,
                    queryType: this.queryType
                }
            });
        },

        // 进入销售行为分析
        goAnalysis (crmType) {
            let obj = {
                person: 'personal',
                team: 'team'
            }

            this.$router.push({
                name: 'saleAnalysis',
                query: {
                    crmtype: crmType,
                    time: this.searchTimeType,
                    type: obj[this.teamOrPerson],
                    team: this.teamId
                }
            })
        },

        // 跳转目标
        goGoal () {
            this.$router.push('/goalDetail');
        },

        // 跳转商机更进
        goBusiness () {
            this.$router.push('/businessGraphic');
            let obj = {
                person: 'personal',
                team: 'team'
            }
            this.$router.push({
                name: 'businessGraphic',
                query:{
                    searchTimeType: this.searchTimeType,
                    type: obj[this.teamOrPerson],
                    teamIds: this.teamId,
                    owner: this.owner,
                    queryType: this.queryType
                }
            })
        },

        // 跳转销售漏斗
        goFunnel () {
            let obj = {
                person: 'personal',
                team: 'team'
            }
            this.$router.push({
                name: 'businessFunnel',
                query:{
                    searchTimeType: this.searchTimeType,
                    type: obj[this.teamOrPerson],
                    teamIds: this.teamId,
                    owner: this.owner,
                    queryType: this.queryType
                }
            })
        },

        // 获取当前用户是否为某团队负责人
        validTeamMgr (teamId) {
            return new Promise((resolve, reject) => {
                let obj = {
                    teamId
                }

                validTeamMgr(obj).then(res => {
                    if(res.code == '0'){
                        let { mgr } = res.data;
                        resolve(mgr);
                    }
                    else{
                        _.alert('提示', res.desc);
                    }
                });
            })
        },

        // 转换销售漏斗tab
        tabChage (status) {
            if(status === 'left'){
               this.saleFunnelData.funnelData.chartData = this.moneyFunnel;
               this.saleFunnelData.funnelData.format = '<b>{point.name}</b>{y}(万)';
            }
            else{
                this.saleFunnelData.funnelData.chartData = this.businessFunnel;
                this.saleFunnelData.funnelData.format = '<b>{point.name}</b>({y})';
            }
        },

        // 点击引导
        clickHelp () {
            let dom = this.$refs.scroll;
            this.showHelp = true;
            this.helpStep = 1;
            dom.$refs.crmScroll.scrollTop = 0;
            dom.$refs.crmScroll.style['overflow-y'] = 'hidden';
        },

        // 改变滚动条位置
        changeScroll (dom) {
            let scroll = this.$refs.scroll;
            scroll.$refs.crmScroll.scrollTop = dom['offsetTop'];
        },

        // 进入下个步骤
        nextStep (step) {
            let { saleAnalysis, businessDistribution, saleFunnel, scroll, contractReceived } = this.$refs;
            this.helpStep++;

            // 修改滚动条位置(45为筛选bar高度)
            if(step === 2){
                this.changeScroll(contractReceived);
            }
            else if(step === 3){
                this.changeScroll(saleAnalysis);
            }
            else if(step === 4){
                this.changeScroll(businessDistribution);
            }
            else if(step === 5){
                this.changeScroll(saleFunnel);
            }
        },

        // 结束帮助
        endStep () {
            let dom = this.$refs.scroll;
            this.showHelp = false;
            this.helpStep = 1;
            dom.$refs.crmScroll.style['overflow-y'] = 'auto';
        },

        goTrend(type){
            let obj = {
                person: 'personal',
                team: 'team'
            }
            this.$router.push(
                {
                    name: 'salesTurnoverTrend',
                    query:{
                        searchTimeType: this.searchTimeType,
                        type: obj[this.teamOrPerson],
                        teamIds: this.teamId,
                        owner: this.owner,
                        queryType: this.queryType,
                        calSource: String(type)
                    }
                })
        },

        // 卡片跳转链接
        goUrl (type) {
            let obj = {
                person: 'personal',
                team: 'team'
            }
            switch(type){
                case 'trend':
                    this.goTrend(0)
                    break;
                case 'trendContract':
                    this.goTrend(1)
                    break;
                case 'contractReceived':
                    this.goContract();
                    break;
                case 'business':
                    this.$router.push({name: 'businessFunnel',query:{
                        searchTimeType: this.searchTimeType,
                        type: obj[this.teamOrPerson],
                        teamIds: this.teamId,
                        owner: this.owner,
                        queryType: this.queryType
                    }})
                    break;
            }
        },

        // 跳转回收客户详情
        goDetail (id) {
            this.$router.push({path:"/ClientDetails/ClientContent",query:{id:id,isClient:0}});
        },

        // 查看全部回收客户
        viewRecycle () {
            this.$router.push({name:"clientRecycle"});
        },
        ...mapActions('list',[
            'delCacheArray'
        ])
    }
}
</script>
<style lang='scss'>
@import '../../crmBase.scss';

.height50{
  height: rem(50);
}
.mb5{
    margin-bottom: rem(5);
}
.mb25{
    margin-bottom: rem(25);
}
.data_board_index{
    display: flex;
    height: 100%;
    flex-direction: column;
    .filter_wrap{
        position: relative;
        height: rem(45);
    }
    .filter_main{
        position: relative;
        flex: 1;
        overflow-y: auto;
    }
    .crm_filter_help{
        width: rem(32);
        height: rem(45);
        line-height: rem(45);
        background: #fff;
        .help_icon{
            display: inline-block;
            margin-left: rem(3);
            width: rem(17);
            height: rem(17);
            line-height: rem(17);
            text-align: center;
            border-radius: 50%;
            background: #D8D8D8;
            color: #fff;
        }
    }
    .iconfont{
        font-size: rem(30);
        line-height: rem(50);
        margin-right: rem(10);
    }
    .border_msg{
        padding: 0 0 rem(10) rem(15) ;
        background: #fff;
        .title{
            height: rem(57);
            line-height: rem(57);
            font-size: rem(16);
            font-weight: normal;
        }
        .received_data{
            display: flex;
            .received_item{
                display: flex;
                flex: 1;
                cursor: pointer;
                .item_data{
                    max-width: rem(110);
                    margin-bottom: rem(5);
                    font-size: rem(17);
                    color: #333;
                    @include ellipsis;
                }
                .item_name{
                    font-size: rem(12);
                    color: #999;
                }
                .icon_blue{
                    color: #559AFB;
                }
            }
        }
    }
    .main_item{
        background: #fff;
        padding: 0 rem(15);
        margin-top: rem(10);
        .funnelMoney{
            padding-top: 0;
        }
    }
    .help_mask{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 16;
        margin: 0 auto;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        .step_item{
            position: absolute;
            text-align: center;
            width: 100%;
            .next_step_btn{
                display: inline-block;
                margin-top: rem(73);
                width: rem(103);
                height: rem(42);
                background: url('~assets/images/crm/next_step.png') no-repeat center;
                background-size: 100%;
            }
            .end_btn{
                display: inline-block;
                margin-bottom: rem(46);
                width: rem(103);
                height: rem(42);
                background: url('~assets/images/crm/end_step.png') no-repeat center;
                background-size: 100%;
            }
            .frame{
                display: inline-block;
                width: 95%;
                font-size: rem(17);
                color: #fff;
                border: 2px dashed #fff;
                border-radius: 6px;
            }
            .step_arrow_wrap{
                position: relative;
                height: rem(130);
                .step_up_arrow,
                .step_down_arrow{
                    position: absolute;
                    width: 100%;
                    height: rem(130);
                }
                .step_up_arrow{
                    background: url('~assets/images/crm/step_up_arrow.png') no-repeat center;
                    background-size: rem(16);
                }
                .step_down_arrow{
                    background: url('~assets/images/crm/step_down_arrow.png') no-repeat center;
                    background-size: rem(16);
                }
            }
            .step_msg{
                display: inline-block;
                font-size: rem(17);
                color: #fff;
                p{
                    letter-spacing: 1px;
                }
                .first_msg{
                    margin-bottom: rem(25);
                    color: #FFFA72;
                }
            }
        }
        .step_item1{
            .step_msg{
                width: rem(200);
            }
            .frame{
                height: rem(43);
                line-height: rem(43);
            }
        }
        .step_item2{
            top: rem(63);
            .step_msg{
                width: rem(295);
                p{
                    line-height: 25px;
                }
            }
            .frame{
                height: rem(170);
            }
            .next_step_btn{
                position: absolute;
                top: rem(40);
                right: rem(50);
                margin-top: 0;
            }
            .step_arrow_wrap{
                height: rem(50);
                .step_up_arrow{
                    top: rem(-70);
                    left: rem(-55);
                }
            }
        }
        .step_item3{
            top: rem(45);
            .step_msg{
                width: rem(310);
            }
            .frame{
                height: rem(115);
            }
            .step_arrow_wrap{
                height: rem(40);
                .step_up_arrow{
                    top: rem(-80);
                    left: rem(60);
                }
            }
            .next_step_btn{
                margin-top: rem(66);
            }
        }
        .step_item4{
            top: rem(95);
            .step_msg{
                width: rem(325);
            }
            .frame{
                height: rem(200);
            }
            .step_arrow_wrap{
                height: rem(40);
                .step_up_arrow{
                    top: rem(-80);
                    left: rem(60);
                }
            }
            .next_step_btn{
                margin-top: rem(62);
            }
        }
        .step_item5{
            top: rem(100);
            .step_msg{
                width: rem(310);
            }
            .frame{
                height: rem(270);
            }
            .step_arrow_wrap{
                height: rem(45);
                .step_up_arrow{
                    top: rem(-80);
                    left: rem(-50);
                }
            }
            .next_step_btn{
                position: absolute;
                top: rem(150);
                right: rem(50);
                margin-top: 0;
            }
        }
        .step_item6{
            top: rem(65);
            .step_msg{
                width: rem(270);
            }
            .frame{
                height: rem(245);
            }
            .step_arrow_wrap{
                height: rem(45);
                .step_down_arrow{
                    top: rem(-15);
                    left: rem(-15);
                }
            }
            .end_btn{
                margin-bottom: rem(35);
            }
        }
    }
    .client_remind{
        padding: 0;
        .title{
            padding-left: rem(15);
        }
        .no_remind{
            height: rem(90);
            color: #bbb;
            line-height: rem(90);
            text-align: center;
            font-size: rem(18);
        }
        .recycle_client_wrap{
            .recycle_msg{
                position: relative;
                margin-left: rem(15);
                height: rem(30);
                line-height: rem(20);
                color: #333;
                font-size: rem(15);
                &:after{
                    @include underLine;
                }
                .recycle_num{
                    margin-right: rem(15);
                    float: right;
                    color: #467DB9;
                    font-size: rem(18);
                }
            }
            .view_all{
                position: relative;
                height: rem(40);
                line-height: rem(40);
                text-align: center;
                font-size: rem(12);
                color: #999;
            }
            .crm_list:before{
                content: normal;
            }
        }
    }
}

</style>
