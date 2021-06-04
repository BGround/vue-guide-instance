<template>
<div>
  <div class="saleBox adapt_iphonex">
    <!-- 头部为时间切换以及高级搜索组件 -->
    <div class="header">
      <time-header
                  v-if="headerShow"
                  @search="search"
                  @searchClose="searchClose"
                  @checkedRadio="checkedRadio"
                  @reset="reset"
                  @preNextBtn="preNextBtn"
                  :setting="setting"
                  :cache-search-value="cacheSearchValue"
                  :timeWarningShow="timeWarningShow"
                  :warnMsg="warnMsg"
                  :preNextShow="preNextShow"
                  ref="getAdvancedShow"
      >
    </time-header>
    </div>

    <!-- 内容部分 -->
    <div class="saleContent" v-show="!showTeamSelect">
        <div class="moneyTab">
            <div class="tabText" @click.stop="tabChange('left')" :class="{active:tabActive}">
                商机赢单
                <div class="tabBar" v-show="tabActive"></div>
            </div>
            <div class="tabText" @click.stop="tabChange('right')" :class="{active:!tabActive}">
                合同签约
                <div class="tabBar" v-show="!tabActive"></div>
            </div>
        </div>
        <div class="trend-money">
            <p class="totalValue">
                {{totalMoney}}<span class="moneyUnit">万元</span>
            </p>
            <span class="moneyText">成交总金额</span>
        </div>
        <div class="lineTopBox">
            <div class="legendText">
                <span class="legendColor"></span>
                成交金额（万元）
            </div>
            <hight-charts
                id="linelTopId"
                :option="topOption"
                ref="lineTopCharts"
                v-show="hasHighChartsOption[0]"
            ></hight-charts>
            <div class="no-chart-content" v-show="!hasHighChartsOption[0]">
                <no-chart :iconClass="iconClass" class="no-trends"></no-chart>
            </div>
        </div>
        <div class="lineBottomBox">
            <div class="legendText">
                <span class="legendColor"></span>
                {{legendText}}
            </div>
            <hight-charts
                id="linelBottomId"
                :option="bottomOption"
                ref="lineBottomCharts"
                v-show="hasHighChartsOption[1]"
            ></hight-charts>
            <div class="no-chart-content" v-show="!hasHighChartsOption[1]">
                <no-chart :iconClass="iconClassNum" class="no-trends"></no-chart>
            </div>
        </div>
    </div>
    <!-- <div class="qwui-separate_bar"></div> -->
      <!-- 底部表格组件 -->
      <div class="saleTable">
          <crm-table :cols="headerData" :tableData="tableData" v-if="tableShow" @rowClick="rowClick"></crm-table>
      </div>
  </div>

    <team-list-select
                    :listData="teamListData"
                    v-show="showTeamSelect"
                    @confirm="confirmTeam"
                    @cancel="cancelTeam"
    ></team-list-select>
</div>
</template>
<script>
import HightCharts from '../../../components/HightCharts/HightCharts'; // highchart组件
import timeHeader from '../components/CrmTimeHeader/CrmTimeHeader.vue'; // 时间切换以及高级搜索子组件
import CrmTable from '../../../components/CrmTable/table.vue'; // 表格组件
import teamTree from './trendTeamTree/trendTeamTree.vue'; // 时间切换以及高级搜索子组件
import TeamListSelect from '../../../components/TeamListSelect/TeamListSelect'; // 销售团队选人
import CrmRadioSelect from '../../../components/CrmRadioSelect/CrmRadioSelect';
import NoChart from '../../../components/no-chart/no-chart'
import { mapActions } from 'vuex'

import {
          getSaleTeam,
          getBasicItem,
          searchBusinesCharts
        }
from '../../../api/dataBoard/getData'; // 获取销售团队列表请求
// 存放销售团队的配置
const teamConfig = {
  id: 'id',
  title: 'teamName',
  checkType: 'checkbox',
  headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/aa.jpg',
  subTitle:'teamMemberNum'
}
let DIYdateMonth = [] // 按月份 DIYdate: 二维数组, DIYdate.length: 有多少列
{
  let YEAR1 = [],
      SEASON1 = [
          { text: '一月', value: '01'},
          { text: '二月', value: '02'},
          { text: '三月', value: '03'},
          { text: '四月', value: '04'},
          { text: '五月', value: '05'},
          { text: '六月', value: '06'},
          { text: '七月', value: '07'},
          { text: '八月', value: '08'},
          { text: '九月', value: '09'},
          { text: '十月', value: '10'},
          { text: '十一月', value: '11'},
          { text: '十二月', value: '12'},
          ]
  for(let i = 2014; i <= 2050; i++) {
      YEAR1.push( { text: i + '年', value: i } )
  }
  DIYdateMonth = [YEAR1, SEASON1];
}
let DIYdateSeason = [] // 按季度 DIYdate: 二维数组, DIYdate.length: 有多少列

{
    let YEAR = [],
        SEASON = [{ text: '一季度', value: '1'}, { text: '二季度', value: '2'}, { text: '三季度', value: '3'}, { text: '四季度', value: '4'}]
    for(let i = 2014; i <= 2050; i++) {
        /*
        *   数组存放对象, 对象格式一定是：
        *   {
        *       text: xxx年  展示的文字,
        *       value: xxx   对应的值
        *   }
        *
        */
        YEAR.push( { text: i + '年', value: i } )
    }
    DIYdateSeason = [YEAR, SEASON];
}
let showOrhide=false;//上下切换隐藏
// 高级搜索选人配置
let fakeSelectConfig = {
    show: false,
    signIndex: 'users',
    selectList: {
        "usersOrDepts": { // 选部门和选人
            "title":"",
            "selectType": "group",
            "userSelected": [],
            "deptSelected": [],
            "callBack": {
                "confirm": null
            }
        }
    }
}
export default {
  name: 'salesTurnoverTrend',
  components: {
    timeHeader,
    teamTree,
    CrmTable,
    HightCharts,
    TeamListSelect,
    CrmRadioSelect,
    NoChart
  },
  data() {
    return {
        isClickBtn: false, // 判断是否点击了左右切换
        needClearTeam: false, // 是否需要清空团队
        teamSelectData:[], // 存放销售团队所选择的数据
        firstTeamIds: this.$route.query.teamIds, // 销售团队id
        teamListData: [], // 销售团队列表
        showTeamSelect: false, // 销售团队显示隐藏
        bottomAmount: [], // 存放line曲线的y轴百分比
        topAmount: [], // 存放line曲线的y轴成交金额
        timeList: [], // 存放line曲线的时间轴数据
        totalMoney: 0, // 成交总金额
        tabActive :true,//商机是否选中
        legendText: "商机数（个）",//表格头部文字
        calSource:this.$route.query.calSource, //初始化数据来源
        iconClass:'icon-trends',//无数据图表金额样式
        iconClassNum:'icon-trends-num',//无数据图表个数样式
        hasHighChartsOption:[false,false],//图表是否有数据，默认没有数据
        tableShow: false, // 表格显示隐藏
        headerData: [
            {
                name: '时间',
                key: 'status',
                width: '106px'

            },
            {
                name: '成交金额（万元）',
                key: 'money',
                className: 'column-color1',
                width: '123px'

            },
            {
                name: '商机数（个）',
                key: 'amount',
                className: 'column-color1',
                width:'117px'
            }
        ],
        // 表格数据
        tableData: [
            {
                status: 1,
                money: '123',
                amount: '0',
                id: 1,
            },
            {
                status: 1,
                money: '123',
                amount: '0',
                id: 1,
            },
            {
                status: 1,
                money: '123',
                amount: '0',
                id: 1,
            },
            {
                status: 1,
                money: '123',
                amount: '0',
                id: 1,
            }
        ],
        // 漏斗总额
        usersId: '',
        toDeptIds: '',
        stageList: [], // 存放后台返回的商机阶段数据数组
        treeListIsShow: true, // 层级显示隐藏
        teamData: [], // 销售团队的所有数据
        page: 1, // 第一次请求的page
        preNextShow: true, // 时间左右切换的按钮显示或者隐藏，传给子组件
        headerShow: true, // 头部的显示隐藏
        timeWarningShow: false, // toast弹窗的显示隐藏
        warnMsg: '不能超过12个月', // toast弹窗的提示语
        // 高级搜索数据，传给子组件
        setting: [
            {
            label: '客户所有者',
            key: 'tbBusinessFunnelSearchVO.owner',
            type: 'radio',
            value: [
                { text: '全部', value: '0'},
                { text: '我负责的', value: '1'},
                { text: '我相关的', value: '2'},
                { text: '我创建的', value: '3'},
                { text: '销售团队', value: '4',relativeLabel: [3]},
                { text: '部门/负责人', value: '5',relativeLabel: [2]}
            ]
            },
            {
                label: '',
                key: 'tbBusinessFunnelSearchVO.selectDepartment',
                type: 'selectUserOrDepart',
                selectConfig: fakeSelectConfig,
                selectType: 'usersOrDepts',
                show:false,
            },
            {
                label: '',
                key: '213',
                type: 'handle',
                callBack: this.handleClick,
                show:false,
            },
            {
            label: '时间单位',
            key: 'tbBusinessFunnelSearchVO.queryType',
            type: 'radio',
            value: [
                { text: '按月份', value: 'query_by_month'},
                { text: '按季度', value: 'query_by_season'},
                { text: '按日期', value: 'query_by_day'},
            ]
            },
            {
            label: '时间范围',
            key: 'searchTime',
            type: 'radio',
            value: [
                { text: '今年', value: 'year'},
                { text: '去年', value: 'lastYear'},
                { text: '自定义', value: 'custom',relativeLabel: [6]}
            ]
            },
            {
                label: '',
                key: ['tbBusinessFunnelSearchVO.startTime', 'tbBusinessFunnelSearchVO.endTime'],
                type: 'date',
                dateType: 'DIY',
                show:false,
                dateValue: DIYdateMonth
            },
            {
                label: '商机类别',
                key: 'tbBusinessFunnelSearchVO.businessType',
                type: 'select',
                value: [
                { text: '全部', value: ''},
                ]
            },
        ],
        cacheSearchValue:{
            // searchTime: this.$route.query.searchTimeType,
            searchTime: this.$route.query.searchTimeType || 'year',
            'tbBusinessFunnelSearchVO.owner': this.$route.query.owner,
            'tbBusinessFunnelSearchVO.teamIds': this.$route.query.teamIds || '',
            'tbBusinessFunnelSearchVO.queryType':  this.$route.query.queryType,                        
        }
    }
  },
  computed: {
      topOption() {
          return {
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: this.timeList,
                    gridLineColor: "#ddd",
                    gridLineWidth: 1,
                    tickLength: 0,
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    gridLineColor: "#ddd",
                    gridLineWidth: 1
                },
                legend: {//图例
                    enabled: false
                },
                credits: {
                    enabled:false
                },
                tooltip: {
                    backgroundColor:'#fff',
                    borderColor: '#7AABF5',
                    shadow: false,
                    followTouchMove: false,
                    formatter: function() {
                        return this.y;
                    }
                },
                plotOptions: {
                    series: {
                        color: "#7AABF5",
                        lineWidth: 1,
                    }
                },
                series: [{
                    name: '成交金额',
                    data: this.topAmount
                },]
          }

        },
        bottomOption() {
          return {
                chart: {
                    type: 'line'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: this.timeList,
                    gridLineColor: "#ddd",
                    gridLineWidth: 1,
                    tickLength: 0,
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    gridLineColor: "#ddd",
                    gridLineWidth: 1
                },
                legend: {//图例
                    enabled: false
                },
                credits: {
                    enabled:false
                },
                tooltip: {
                    backgroundColor:'#fff',
                    borderColor: '#7AABF5',
                    shadow: false,
                    followTouchMove: false,
                    formatter: function() {
                        return this.y;
                    }
                },
                plotOptions: {
                    series: {
                        color: "#7AABF5",
                        lineWidth: 1,
                    }
                },
                series: [{
                    name: '增长率',
                    data: this.bottomAmount
                },]
          }

        },
  },
  created(){
    this.headerShow = true;
    this.switchCalSource(this.calSource)

    this.getBusinessType(); // 商机类别
    this.getSaleData(); // 成交趋势的数据

    this.settingData(this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType']);
    this.setCacheArray({name:'salesTurnoverTrend'})
  },
  watch: {
        topOption (newVal) {
            this.$refs.lineTopCharts.inintChart();
        },
        bottomOption (newVal) {
            this.$refs.lineBottomCharts.inintChart();
        },
        // 监听商机还是合同的变化
        calSource (newVal) {
          this.switchCalSource(newVal)
        }
    },
  mounted () {
      this.$refs.lineTopCharts.inintChart();
      this.$refs.lineBottomCharts.inintChart();
  },
  methods: {
    // 根据首页传过来的queryType来改变setting的初始值
    settingData(val){
        switch(val){
            case 'query_by_month':
            this.$set(this.setting,5,
            {
                label: '',
                key: ['tbBusinessFunnelSearchVO.startTime', 'tbBusinessFunnelSearchVO.endTime'],
                type: 'date',
                dateType: 'DIY',
                show:false,
                dateValue: DIYdateMonth
            })
            break;
            case 'query_by_season':
            this.$set(this.setting,5,
            {
                label: '',
                key: ['tbBusinessFunnelSearchVO.startTime', 'tbBusinessFunnelSearchVO.endTime'],
                type: 'date',
                dateType: 'DIY',
                show:false,
                dateValue: DIYdateSeason
            })
            break;
            case 'query_by_day':
            this.$set(this.cacheSearchValue,'searchTime', this.$route.query.searchTimeType || 'week')
            this.$set(this.setting[4],'value',
            [
                { text: '本周', value: 'week'},
                { text: '上周', value: 'lastWeek'},
                { text: '自定义', value: 'custom',relativeLabel: [6]}
            ])
            this.$set(this.setting,5,
            {
                label: '',
                key: ['tbBusinessFunnelSearchVO.startTime', 'tbBusinessFunnelSearchVO.endTime'],
                type: 'date',
                format: 'YYYY-MM-DD', //用来控制日期展示的格式以及返回的数据格式
                show:false,
            })
            break;
        }

    },

    //选择商机合同切换
    tabChange(direction){
        if(direction === 'left'){
            this.calSource = '0'
        }else{
            this.calSource = '1'
        }

        const searchTimeTab = this.cacheSearchValue.searchTime
        if(this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime']){
            this.cacheSearchValue.searchTime = 'custom';
        }
        this.getSaleData()
        this.cacheSearchValue.searchTime = searchTimeTab;
    },
    //商机合同切换改变文字
    switchCalSource(calSource){
      this.tabActive = Number(calSource) ? false : true
      this.legendText = Number(calSource) ? '合同数（个）': '商机数（个）'
      this.headerData[2].name = this.legendText
    },

    // 数据请求
    getBusinessType(){
        // 高级搜索的商机类别请求
        getBasicItem().then(res => {
            if(res.code == '0'){
                res.data.list.forEach((item) => {
                    if(item.type == '3' && item.optionName == '商机类别'){
                          item.list.map((litem) => {
                              if(litem.isShow == '1'){
                                  this.setting[6].value.push({ text: litem.name, value: litem.stageCode })
                              }
                          })
                    }
                })
            }else{
                _.alert('提示',res.desc)
            }
        })
    },

    closeMaskShow(){
        this.maskShow = false;
    },

    // 成交趋势请求
    getSaleData(){
        let url = `${_.baseURL}/portal/business/searchBusinessCharts.do`//商机图表
        if(Number(this.calSource)) url = `${_.baseURL}/portal/contract/searchContractCharts.do`//合同图表
        let obj = {
            'tbBusinessFunnelSearchVO.startTime': this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'],
            'tbBusinessFunnelSearchVO.endTime': this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'],
            'tbBusinessFunnelSearchVO.owner': this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'],
            'tbBusinessFunnelSearchVO.businessType': this.cacheSearchValue['tbBusinessFunnelSearchVO.businessType'],
            'tbBusinessFunnelSearchVO.teamIds': this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'], // 销售团队
            'tbBusinessFunnelSearchVO.toUserIds': '',
            'tbBusinessFunnelSearchVO.toDeptIds': '',
            'tbBusinessFunnelSearchVO.queryType': this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'],
            'tbBusinessFunnelSearchVO.searchTimeType': this.cacheSearchValue.searchTime,
            'tbBusinessFunnelSearchVO.calSource': this.calSource,
        }
        // 选择高级搜索的选人传参
        if(this.cacheSearchValue['tbBusinessFunnelSearchVO.selectDepartment']){
          let usersId = [], deptsId=[];
          if(this.cacheSearchValue['tbBusinessFunnelSearchVO.selectDepartment'].users.length > 0){
              this.cacheSearchValue['tbBusinessFunnelSearchVO.selectDepartment'].users.forEach((item) => {
                  usersId.push(item.id)
              })
          }
          if(this.cacheSearchValue['tbBusinessFunnelSearchVO.selectDepartment'].depts.length > 0){
              this.cacheSearchValue['tbBusinessFunnelSearchVO.selectDepartment'].depts.forEach((item) => {
                  deptsId.push(item.id)
              })
          }
          obj['tbBusinessFunnelSearchVO.toUserIds'] = usersId.join();
          obj['tbBusinessFunnelSearchVO.toDeptIds'] = deptsId.join();
          this.usersId = obj['tbBusinessFunnelSearchVO.toUserIds'];
          this.toDeptIds = obj['tbBusinessFunnelSearchVO.toDeptIds'];
        }
        // 成交数据请求 包括表格，line曲线
        searchBusinesCharts(url,obj).then(res => {
            if(res.code == '0'){
                this.hasHighChartsOption = [false,false]
                this.saleList = res.data.index.chartsList;
                this.totalMoney = res.data.index.finishValue;
                // 假如首页选择销售团队，则会把数据带过来
                if(res.data.teamList){
                    this.teamSelectData = res.data.teamList;
                    let teamNameArr = [];
                    this.teamSelectData.forEach((item) => {
                        teamNameArr.push(item.teamName)
                    })
                    this.setting[2].label = teamNameArr.join();
                }
                // 表格跟line的初始化跟赋值
                this.tableData = [];
                this.timeList = [];
                this.topAmount = [];
                this.bottomAmount = [];
                // 表格赋值
                this.saleList.forEach((item) => {
                    let cellClass
                    if(item.value || item.amount) cellClass = 'column-color'

                    this.tableData.push(
                        {
                            status: item.name,
                            money: item.value.toString(),
                            amount: item.amount,
                            id: item.sort,
                            cellClassName: {
                                money: cellClass,
                                amount: cellClass
                            }
                        }
                    )
                    this.timeList.push(item.name);
                    this.topAmount.push(item.value);
                    this.bottomAmount.push(item.amount);
                })

                // 判断只要有一个数据大于0，则有数据；否则显示无数据图片
                let arr = [this.topAmount,this.bottomAmount]
                for(let i=0;i<arr.length;i++){
                    for(let j of arr[i]){
                        if(j && j > 0){
                            this.$set(this.hasHighChartsOption,i,true)
                            break
                        }else{
                            this.$set(this.hasHighChartsOption,i,false)
                        }
                    }
                }
                // 渲染数据后再显示
                this.tableShow = true;

            }else{
                _.alert('提示',res.desc)
            }
        })
    },

    // 高级搜索按了确定按钮触发事件
    search(cacheSearchValue){
        this.cacheSearchValue = cacheSearchValue
        switch (this.cacheSearchValue.searchTime) {
          case 'lastMonth':
          case 'month':
          case 'season': this.cacheSearchValue.searchTime = 'year'
        }
        this.preNextShow = true;
        // 自定义时间的判断，不能超12个月
        this.customToast();
        this.valiNull();
    },

    // 验证销售团队是否空值，是的话按确定有弹窗提示
    valiNull(){
        if(this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'] == '4'){
          if(this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'] == ''){
              this.$refs.getAdvancedShow.advancedShow = true
              _.alert('提示','销售团队不能为空');
              return;
          }
        }else if(this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'] == '5'){
            if(!this.cacheSearchValue['tbBusinessFunnelSearchVO.selectDepartment'] || (this.cacheSearchValue['tbBusinessFunnelSearchVO.selectDepartment'].depts.length == 0 && this.cacheSearchValue['tbBusinessFunnelSearchVO.selectDepartment'].users.length == 0)){
                this.$refs.getAdvancedShow.advancedShow = true
                _.alert('提示','部门/负责人不能为空');
                return;
            }
        }

        if(this.cacheSearchValue.searchTime === 'custom' && (!this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] || !this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'])){
            return
        }

        this.getSaleData();
    },

    // 关闭高级搜索
    searchClose(){
    },

    // 选择高级搜索单选的时候触发
    checkedRadio(index,key,value){
        // 清空销售团队
        if(key == this.setting[0].key && value != 4){
            this.setting[2].label = '';
            this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'] = '';
            this.needClearTeam = true;
        }
        // 选择时间单位，改变时间范围
        if(key == this.setting[3].key){
            switch(value){
                case 'query_by_month':
                this.initDate();
                this.$set(this.setting,5,
                {
                    label: '',
                    key: ['tbBusinessFunnelSearchVO.startTime', 'tbBusinessFunnelSearchVO.endTime'],
                    type: 'date',
                    dateType: 'DIY',
                    show:false,
                    dateValue: DIYdateMonth
                })
                break;
                case 'query_by_season':
                this.initDate();
                this.$set(this.setting,5,
                {
                    label: '',
                    key: ['tbBusinessFunnelSearchVO.startTime', 'tbBusinessFunnelSearchVO.endTime'],
                    type: 'date',
                    dateType: 'DIY',
                    show:false,
                    dateValue: DIYdateSeason
                })
                break;
                case 'query_by_day':
                this.$set(this.cacheSearchValue,'searchTime','week')
                this.$set(this.setting[4],'value',
                [
                    { text: '本周', value: 'week'},
                    { text: '上周', value: 'lastWeek'},
                    { text: '自定义', value: 'custom',relativeLabel: [6]}
                ])
                this.$set(this.setting,5,
                {
                    label: '',
                    key: ['tbBusinessFunnelSearchVO.startTime', 'tbBusinessFunnelSearchVO.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD', //用来控制日期展示的格式以及返回的数据格式
                    show:false,
                })
                break;
            }
            if(this.cacheSearchValue.searchTime == 'custom'){
                delete this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'];
                delete this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'];
            }
        };

        // 当选择的是自定义的时候切换其他radio，自定义还是正常显示
        if(this.cacheSearchValue.searchTime == 'custom'){
            this.$set(this.setting[5],'show',true);
        }
    },

    //重置高级搜索
    reset() {
      this.$set(this.setting[2],'label',''); // 清空销售团队
      this.initDate()
      this.needClearTeam = true;
      this.cacheSearchValue = {
          searchTime:"month",
          'tbBusinessFunnelSearchVO.teamIds': '',
          'tbBusinessFunnelSearchVO.owner': '0',
          'tbBusinessFunnelSearchVO.queryType':"query_by_month",
      }
    },

    preNextBtn(boardCurrentTime){
        let reg=/(\w*)年(.*)月(.*)/g;
        let regWeek=/(\w*)年(.*)月(.*)日(.*)/g;
        this.isClickBtn = 'ture';
        switch(this.cacheSearchValue.searchTime){
            case 'year' :
            case 'lastYear':
                this.cacheSearchValue.searchTime = 'custom';
                if(this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] == 'query_by_season'){
                    this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.replace("年","-1");
                    this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.replace("年","-4");
                }else{
                    this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.replace("年","-01");
                    this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.replace("年","-12");
                }
                this.getSaleData();
                this.cacheSearchValue.searchTime = 'year';
                break;
            case 'month':
            case 'lastMonth':
              this.cacheSearchValue.searchTime = 'custom';
              this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.replace(reg,"$1-$2");
              this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.replace(reg,"$1-$2");
              this.getSaleData()
              this.cacheSearchValue.searchTime = 'month';
              break;
            case 'season':
              this.cacheSearchValue.searchTime = 'custom';
              this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.split('-')[0].replace(reg,"$1-$2");
              this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.split('-')[1].replace(reg,"$1-$2");
              this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] = 'query_by_month'
              this.getSaleData()
              this.cacheSearchValue.searchTime = 'season';
              break;
            case 'week':
            case 'lastWeek':
              this.cacheSearchValue.searchTime = 'custom';
              this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.split('-')[0].replace(regWeek,"$1-$2-$3");
              this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.split('-')[1].replace(regWeek,"$1-$2-$3");
              this.getSaleData()
              this.cacheSearchValue.searchTime = 'week';
              break;
        }
    },

    // 高级搜索——销售团队点击确定
    confirmTeam(ids, selectData){
        let selectDataName = '';
        let selectDataId = '';
        let arr_name = [];
        let arr_id = [];
        selectData.forEach((item, index) => {
            arr_name.push(item.firstTitle)
            arr_id.push(item.id)
        })
        this.teamSelectData = selectData;
        selectDataName = arr_name.join(',')
        this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'] = arr_id.join();
        // 赋值给团队选择input框
        this.setting[2].label = selectDataName;
        this.showTeamSelect = false;
    },

    // 高级搜索——销售团队点击取消
    cancelTeam(){
      this.showTeamSelect = false;
    },

    // 点击一整行表格，跳转商机
    rowClick(val,row){
        let seasonStart = '';
        let seasonEnd = '';
        // 选择的是季度的话，处理传过去的时间
        if(this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] == 'query_by_season'){
            switch(val.split('')[4]){
                case '一':
                        seasonStart = val.slice(0,4)+'-01';
                        seasonEnd = val.slice(0,4)+'-03';
                        break;
                case '二':
                        seasonStart = val.slice(0,4)+'-04';
                        seasonEnd = val.slice(0,4)+'-06';
                        break;
                case '三':
                        seasonStart = val.slice(0,4)+'-07';
                        seasonEnd = val.slice(0,4)+'-09';
                        break;
                case '四':
                        seasonStart = val.slice(0,4)+'-10';
                        seasonEnd = val.slice(0,4)+'-12';
                        break;
            }
        }
        if(row.amount!='0'){
            this.businessViewPush(seasonStart,seasonEnd,val,this.calSource);
        }
    },

    // 跳转商机路由
    businessViewPush(start,end,val,calSource){
        let trendList = Number(calSource) ? 'searchContractTrendList' : 'searchBusinessTrendList'
        this.$router.push({ name:"businessViewList",
                            query:{
                                startTime: this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] == 'query_by_season' ?
                                            start : val,
                                endTime: this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] == 'query_by_season' ?
                                            end : val,
                                businessType: this.cacheSearchValue['tbBusinessFunnelSearchVO.select'],
                                // searchTimeType: this.isClickBtn ? 'custom' : this.cacheSearchValue.searchTime,
                                searchTimeType:  'custom',
                                queryType:  this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'],
                                teamIds: this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'],
                                toUserIds: this.toUserIds,
                                toDeptIds: this.toDeptIds,
                                page: 1,
                                owner: this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'],
                                agentCode: 'crm',
                                trend: trendList,
                                paramType: '',
                                businessType: this.cacheSearchValue['tbBusinessFunnelSearchVO.businessType']
                            }
                        });
    },

    // 初始化时间
    initDate(){
        this.$set(this.setting[4],'value',
            [
                { text: '今年', value: 'year'},
                { text: '去年', value: 'lastYear'},
                { text: '自定义', value: 'custom',relativeLabel: [6]}
            ])
        this.$set(this.cacheSearchValue,'searchTime','year')
    },

    // 获取销售团队
    _getSaleTeam() {
      let data = {
        pageSize: 50
      }
      getSaleTeam(data).then(res => {
        if (res.code === '0') {
          this.teamData = res.data.pageData;
          this.teamData.map(item => {
            let obj = {
              id: item.id,
              firstTitle: item.teamName,
              secondTitle: item.teamMemberNum,
              isSelect: item.id === this.firstTeamIds? true : false
            }
            if(this.needClearTeam){

              obj['isSelect'] = false;

            }
            this.teamListData.push(obj);
          })
          this.needClearTeam = false;
        } else {
          _.alert('提示',res.desc);
        }
      })
    },

    // 高级搜索——点击选择销售团队
    handleClick() {
      this.showTeamSelect = true
      // 之前加载过销售团队
      if(this.teamListData.length > 0){
        if(this.needClearTeam){
          this.$refs.teamListSelect.clearSelected()
          this.needClearTeam = false;
        }

      } else{
        this._getSaleTeam()
      }

    },

     // 计算相差月份
    MonthDifference(date1,date2){
        let time1 = date1.split("-");
        let time2 = date2.split("-");
        let totalMonth1 = parseInt(time1[0]) * 12 + parseInt(time1[1]);
        let totalMonth2 = parseInt(time2[0]) * 12 + parseInt(time2[1]);
        let result = totalMonth2 - totalMonth1;
        if(result >= 12){
            return 1;
        }
        else{
            return 0;
        }
    },

    // 检查是否超过8个季度
    quarterDifference(date1,date2){
        let quarter1 = date1.split("-");
        let quarter2 = date2.split("-");
        let totalQuarter1 = parseInt(quarter1[0]) * 4 + parseInt(quarter1[1]);
        let totalQuarter2 = parseInt(quarter2[0]) * 4 + parseInt(quarter2[1]);
        let result = totalQuarter2 - totalQuarter1;

        if(result >= 8){
            return 1;
        }
        else{
            return 0;
        }
    },


    // 检查是否超过31天
    checkDate(date1,date2){
        var dateSpan, result;
        date1 = Date.parse(date1);
        date2 = Date.parse(date2);
        dateSpan = date2 - date1;
        dateSpan = Math.abs(dateSpan);
        result = Math.floor(dateSpan / (24 * 3600 * 1000));
        if(result >= 31){
            return 1;
        }
        else{
            return 0;
        }
    },

    // 自定义toast弹窗
    customToast(){
      if(this.cacheSearchValue.searchTime == 'custom'){
        this.preNextShow = false;
        let startTime = this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'];
        let endTime = this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'];
        if(startTime != undefined && endTime != undefined){
            if(this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] == 'query_by_season'){
                if(this.quarterDifference(startTime,endTime) == 1){
                    this.timeWarningShow = true;
                    this.warnMsg = '不能超过8个季度';
                    this.$refs.getAdvancedShow.advancedShow = true
                    setTimeout(() => {
                        this.timeWarningShow = false;
                    },1000)
                }else{
                }
            }else if(this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] == 'query_by_month'){
                if(this.MonthDifference(startTime,endTime) == 1){
                    this.timeWarningShow = true
                    this.warnMsg = '不能超过12个月';
                    this.$refs.getAdvancedShow.advancedShow = true
                    setTimeout(() => {
                        this.timeWarningShow = false;
                    },1000)
                }else{
                }
            }else if(this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] == 'query_by_day'){
                if(this.checkDate(startTime,endTime) == 1){
                    this.timeWarningShow = true
                    this.warnMsg = '不能超过31天';
                    this.$refs.getAdvancedShow.advancedShow = true
                    setTimeout(() => {
                        this.timeWarningShow = false;
                    },1000)
                }else{
                }
            }
        }
      }else{
          this.preNextShow = true;
      }
    },
    startTimeChange() {
        this.$set(this.cacheSearchValue, 'searchValue.radio1', 'useless')
    },
    endTimeChange() {
    },
    ...mapActions('list',[
      'setCacheArray'
    ])
  }
}
</script>
<style lang="scss">
@import './salesTurnoverTrend.scss';
</style>
