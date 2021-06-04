<template>
<div>
  <div class="businessBox adapt_iphonex" :style="this.maskShow?overFlow:''">
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
      ></time-header>
    </div>

    <!-- 内容部分 -->
    <div class="content" v-show="!showTeamSelect">
        <!-- 销售漏斗组件 -->
        <funnel-content
                        v-if="funnelShow"
                        @businessMaskShow="businessMaskShow"
                        @tabChage="tabChage"
                        @clickFunnel="clickFunnel"
                        :funnelData="funnelData"
                        :totalMoney="totalMoney"
                        :expectedMoney="expectedMoney"
                        >
        </funnel-content>
    </div>
      <transition name="slide-fade">
          <div class="businessMask" v-show="maskShow">
                <div class="expectedValueBox">
                    <p class="expectedValue">{{expectedMoney}}</p>
                    <p class="expectedText">预计成交（万元）</p>
                </div>
                <div class="stageBox">
                    <ul class="stageUl">
                        <li class="stageLi" v-for="(item, index) in stageData" :key="index">
                            <span>{{item.stageName}}</span>
                            <span>{{item.num}} x {{item.winRate}}%</span>
                            <span :class="stageValueClass">{{item.value}}</span>
                        </li>
                    </ul>
                    <span class="closeMask" @click="closeMaskShow">
                        <i></i>
                    </span>
                </div>
          </div>
      </transition>
      <!-- 底部表格组件 -->
      <div class="funnelTable">
          <crm-table :cols="headerData" :tableData="tableData" v-if="tableShow" @rowClick="rowClick"></crm-table>
      </div>
  </div>
  <team-list-select
      :listData="teamListData"
      v-show="showTeamSelect"
      @confirm="confirmTeam"
      @cancel="cancelTeam"
      ref="teamListSelect"
    ></team-list-select>
</div>
</template>
<script>
import timeHeader from '../components/CrmTimeHeader/CrmTimeHeader.vue'; // 时间切换以及高级搜索子组件
import funnelContent from '../components/funnelContent.vue'; // 时间切换以及高级搜索子组件
import CrmTable from '../../../components/CrmTable/table.vue'; // 表格组件
import teamTree from './businessTeamTree/businessTeamTree.vue'; // 时间切换以及高级搜索子组件
import TeamListSelect from '../../../components/TeamListSelect/TeamListSelect'; // 销售团队选人
import {
          getTeamList,
          searchBusinessFunnel,
          getBasicItem,
        }
from '../../../api/businessFunnel/getData'; // 获取销售团队列表请求
// 存放销售团队的配置
const teamConfig = {
  id: 'id',
  title: 'teamName',
  checkType: 'checkbox',
  headPic:'https://qy.do1.com.cn/web/jsp/wap/images/img/aa.jpg',
  subTitle:'teamMemberNum'
}
let DIYdate1 = [] // DIYdate: 二维数组, DIYdate.length: 有多少列
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
  DIYdate1 = [YEAR1, SEASON1];
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
  components: {
    timeHeader,
    teamTree,
    funnelContent,
    CrmTable,
    TeamListSelect,
  },
  data() {
    return {
        isClickBtn: false, // 判断是否点击了左右切换
        overFlow:{ // 绑定属性，让弹窗页面无法滚动
            overflow: 'hidden',
            position: 'fixed'
        },
        needClearTeam: false, // 是否需要清空团队
        teamSelectData:[], // 存放销售团队所选择的数据
        firstTeamIds: this.$route.query.teamIds, // 销售团队id
        teamListData: [], // 销售团队列表
        showTeamSelect: false, // 销售团队显示隐藏
        moneyFunnel: [],
        businessFunnel: [],
        funnelShow: false, // 销售漏斗的显示隐藏
        tableShow: false, // 表格显示隐藏
        headerData: [
            {
                name: '阶段',
                key: 'status',
                width: '106px'

            },
            {
                name: '销售金额（万元）',
                key: 'money',
                className: 'column_money',
                width: '123px'

            },
            {
                name: '占比',
                key: 'percent',
                className: 'column_percent',
                width:'117px'
            }
        ],
        // 表格数据
        tableData: [],
        // 漏斗总额
        totalMoney: 0,
        // 销售漏斗的数据
        funnelData:{
            id: 'funnel',
            title: {
                text: ''
            },
            format: '<b>{point.name}</b>({point.y:,.0f}万)',
            neckWidth: '40%',
            neckHeight: '15%',
            chartData: []
        } ,
        toUserIds: '',
        toDeptIds: '',
        stageData: [], // 存放mask弹窗的所有数据
        stageList: [], // 存放后台返回的商机阶段数据数组
        expectedMoney: 0, // 预计成交金额
        maskShow: false, // mask弹框的显示隐藏
        treeListIsShow: true, // 层级显示隐藏
        teamSelectData: [], // 层级组件选中的数据
        noData: false, // 请求销售团队有无数据
        teamIds: [], // 销售团队的id
        teamData: [], // 销售团队的所有数据
        page: 1, // 第一次请求的page
        hasmore: true, // 请求根据maxPage判断是否还有多页
        teamTreeShow: false, // 销售团队列表
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
                label: '时间',
                key: 'searchTime',
                type: 'radio',
                value: [
                    { text: '本月', value: 'month'},
                    { text: '本季度', value: 'season'},
                    { text: '今年', value: 'year'},
                    { text: '本周', value: 'week' },
                    { text: '上周', value: 'lastWeek' },
                    { text: '自定义', value: 'custom',relativeLabel: [5]}
                ]
            },
            {
                label: '',
                key: ['tbBusinessFunnelSearchVO.startTime', 'tbBusinessFunnelSearchVO.endTime'],
                type: 'date',
                dateType: 'DIY',
                show:false,
                dateValue: DIYdate1
            },
            {
                label: '',
                key: 'tbBusinessFunnelSearchVO.clientName',
                type: 'text',
                placeholder: '请输入客户名称',
                callBack: this.textChange
            },
            {
                label: '商机类别',
                key: 'tbBusinessFunnelSearchVO.businessType',
                type: 'select',
                value: [
                { text: '全部', value: ''},
                ]
            },
            {
                label: '商机进程',
                key: 'process',
                type: 'select',
                value: [
                { text: '全部', value: '0'},
                { text: '进行中', value: '1'},
                { text: '赢单', value: '2'},
                { text: '输单', value: '3'},
                ]
            },
        ],
        // cacheSearchValue: JSON.parse(sessionStorage.getItem('searchValue')) || {},//高级搜索缓存
        cacheSearchValue:{
            'tbBusinessFunnelSearchVO.owner': this.$route.query.owner,
            'tbBusinessFunnelSearchVO.teamIds': this.$route.query.teamIds || '',
            searchTime: this.$route.query.searchTimeType,
            'tbBusinessFunnelSearchVO.queryType': this.$route.query.queryType,
        }
    }
  },
  computed: {
      stageValueClass(){
      }
  },
  created(){
    this.headerShow = true;
    this.getBusinessType(); // 商机类别
    this.getBusinessData(); // 商机阶段的数据
  },
  mounted () {
  },
  methods: {
    // mask窗的显示隐藏
    businessMaskShow(){
        this.maskShow = true;
    },

    // tab切换销售金额跟商机个数
    tabChage(status){
        if(status == 'left'){
            this.$set(this.funnelData,'chartData',this.moneyFunnel)
            this.$set(this.funnelData,'format','<b>{point.name}</b>({point.y:,.0f}万)')
            this.funnelShow = true;
        }else{
            this.$set(this.funnelData,'chartData',this.businessFunnel)
            this.$set(this.funnelData,'format','<b>{point.name}</b> ({point.y:,.0f})')
            this.funnelShow = true;
        }
    },

    clickFunnel(val){
        this.rowClick(val.name);
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

    // 获取销售团队
    _getSaleTeam() {
      let data = {
        pageSize: 50
      }
      getTeamList(data).then(res => {
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

    // 点击table行的时候跳转阶段列表
    rowClick(val){
        this.stageList.forEach((item) => {
            if(item.stageName == val){
                this.$router.push({
                            name:"funnelViewList",
                            query:{
                                paramType: '0',
                                startTime: this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'],
                                endTime: this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'],
                                businessType: this.cacheSearchValue['tbBusinessFunnelSearchVO.businessType'],
                                searchTimeType: this.isClickBtn ? 'custom' : this.cacheSearchValue.searchTime,
                                teamIds: this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'],
                                toUserIds: this.toUserIds,
                                toDeptIds: this.toDeptIds,
                                page: 1,
                                owner: this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'],
                                agentCode: 'crm',
                                stage: item.stage, // 代表商机阶段，子组件识别并赋值tab
                                clientName: this.cacheSearchValue['tbBusinessFunnelSearchVO.clientName'],
                                process: this.cacheSearchValue.process
                            }
                })
            }
        })
    },

    // 销售漏斗数据请求
    getBusinessData(){
        let obj = {
          'tbBusinessFunnelSearchVO.startTime': this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'],
          'tbBusinessFunnelSearchVO.endTime': this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'],
          'tbBusinessFunnelSearchVO.owner': this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'],
          'tbBusinessFunnelSearchVO.businessType': this.cacheSearchValue['tbBusinessFunnelSearchVO.businessType'],
          'process': this.cacheSearchValue.process,
          'tbBusinessFunnelSearchVO.teamIds': this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'], // 销售团队
          'tbBusinessFunnelSearchVO.clientName': this.cacheSearchValue['tbBusinessFunnelSearchVO.clientName'],
          'tbBusinessFunnelSearchVO.toUserIds': '',
          'tbBusinessFunnelSearchVO.toDeptIds': '',
          'tbBusinessFunnelSearchVO.queryType': this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'],
        //   'tbBusinessFunnelSearchVO.queryType': 'query_by_month',
          'tbBusinessFunnelSearchVO.searchTimeType': this.cacheSearchValue.searchTime,
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
          this.toUserIds = obj['tbBusinessFunnelSearchVO.toUserIds'];
          this.toDeptIds = obj['tbBusinessFunnelSearchVO.toDeptIds'];
        }
        // 销售漏斗数据请求
        searchBusinessFunnel(obj).then(res => {
            if(res.code == '0'){
                this.stageList = res.data.index.list
                this.stageData = [];
                res.data.index.list.forEach((item) => {
                    let funnelObj = {};
                    funnelObj.stageName = item.stageName;
                    funnelObj.num = item.num;
                    funnelObj.winRate = item.winRate;
                    funnelObj.value = item.value;
                    this.stageData.push(funnelObj)
                })
                // 假如首页选择销售团队，则会把数据带过来
                if(res.data.teamList){
                    this.teamSelectData = res.data.teamList;
                    let teamNameArr = [];
                    this.teamSelectData.forEach((item) => {
                        teamNameArr.push(item.teamName)
                    })
                    this.setting[2].label = teamNameArr.join();
                }
                // 预计成交
                this.expectedMoney = res.data.index.buggetValue;
                // 漏斗总值
                this.totalMoney = res.data.index.totalValue;
                // 表格跟漏斗的赋值
                this.tableData = [];
                this.moneyFunnel = [];
                this.businessFunnel = [];
                this.stageList.forEach((item) => {
                    this.tableData.push(
                        {
                            status: item.stageName,
                            money: item.num.toString(),
                            percent: item.percent+'%',
                            id: item.stage,
                        }
                    )
                    this.moneyFunnel.push(
                        [
                            item.stageName,item.num
                        ]
                    )
                    this.businessFunnel.push(
                        [
                            item.stageName,item.businessNum
                        ]
                    )
                })
                this.funnelData.chartData = this.moneyFunnel;
                // 渲染数据后再显示
                this.tableShow = true;
                this.funnelShow = true;

            }else{
                _.alert('提示',res.desc)
            }
        })
    },

    // 高级搜索按了确定按钮触发事件
    search(cacheSearchValue){
      this.cacheSearchValue = cacheSearchValue
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
        this.getBusinessData();
    },

    // 选择高级搜索单选的时候触发
    checkedRadio(index,key,value){        
        // 清空销售团队
        if(key == this.setting[0].key && value != 4){
            this.setting[2].label = '';
            this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'] = '';
            this.needClearTeam = true;
        }

        if( value == 'week' || value == 'lastWeek' ){
            this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] = 'query_by_day';
        }else{
            this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] = 'query_by_month';
        }
    },

    searchClose(){

    },

    //重置高级搜索
    reset() {
      this.$set(this.setting[2],'label',''); // 清空销售团队
      this.needClearTeam = true;
      this.cacheSearchValue = {
          searchTime:"month",
          'tbBusinessFunnelSearchVO.teamIds': '',
          'tbBusinessFunnelSearchVO.owner':"0"
      }
    },

    preNextBtn(boardCurrentTime){
        let reg=/(\w*)年(.*)月(.*)/g;
        let weekReg =/(\w*)年(\w*)月(\w*)日(.*)/g;
        this.isClickBtn = 'ture';
        switch(this.cacheSearchValue.searchTime){
            case 'year':
                this.cacheSearchValue.searchTime = 'custom';
                this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.replace("年","-01");
                this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.replace("年","-12");
                this.getBusinessData();
                this.cacheSearchValue.searchTime = 'year';
                break;
            case 'month':            
                this.cacheSearchValue.searchTime = 'custom';
                this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.replace(reg,"$1-$2");
                this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.replace(reg,"$1-$2");
                this.getBusinessData()
                this.cacheSearchValue.searchTime = 'month';
                break;
            case 'lastMonth':
              this.cacheSearchValue.searchTime = 'custom';
              this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.replace(reg,"$1-$2");
              this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.replace(reg,"$1-$2");
              this.getBusinessData()
              this.cacheSearchValue.searchTime = 'lastMonth';
              break;
            case 'season':
                this.cacheSearchValue.searchTime = 'custom';
                this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.split('-')[0].replace(reg,"$1-$2");
                this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.split('-')[1].replace(reg,"$1-$2");
                this.getBusinessData()
                this.cacheSearchValue.searchTime = 'season';
                break;
            case 'week':                
                this.cacheSearchValue.searchTime = 'custom';
                this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.split('-')[0].replace(weekReg,"$1-$2-$3");
                this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.split('-')[1].replace(weekReg,"$1-$2-$3");
                this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] = 'query_by_day';
                this.getBusinessData()
                this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] = 'query_by_month';
                this.cacheSearchValue.searchTime = 'week';
                break;
            case 'lastWeek':
              this.cacheSearchValue.searchTime = 'custom';
              this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.split('-')[0].replace(weekReg,"$1-$2-$3");
                this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.split('-')[1].replace(weekReg,"$1-$2-$3");
                this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] = 'query_by_day';
              this.getBusinessData()
              this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'] = 'query_by_month';
              this.cacheSearchValue.searchTime = 'lastWeek';
              break;
        }
    },

    // 点击销售团队的请求
    handleClick(){
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

    // 自定义toast弹窗
    customToast(){
      if(this.cacheSearchValue.searchTime == 'custom'){
        this.preNextShow = false;
        let startTime = this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'];
        let endTime = this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'];
        if(startTime != undefined && endTime != undefined){
          if(this.MonthDifference(startTime,endTime) == 1){
            this.timeWarningShow = true
            this.$refs.getAdvancedShow.advancedShow = true
            setTimeout(() => {
                this.timeWarningShow = false;
            },1000)
          }else{
              // console.log('没超')
          }
        }
      }else{
          this.preNextShow = true;
      }
    },
  }
}
</script>
<style lang="scss">
@import './businessFunnel.scss';
</style>
