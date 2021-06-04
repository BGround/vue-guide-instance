<template>
<div>
  <div class="businessBox adapt_iphonex">
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
        <div class="businessNumBox">
            <p class="totalNum">{{totalBusinessNum}}</p>
            <div class="businessSumNum">商机总数
                <i @click="businessNumTip">?
                    <div class="businessNum-tip" v-show="businessTip">
                                根据商机创建时间查看时间范围内商机的推进情况；可选择查看个人以及销售团队成员负责客户的商机推进情况。
                        <em></em>
                    </div>
                </i>
            </div>
        </div>

        <!-- 饼状图 -->
        <div class="businessListImage">
            <div class="list-left" @click="redirectList('win')">
                <div class="leftRing">
                    <ring-diagram v-bind="leftRingCharts" v-if="ringShow"></ring-diagram>
                    <div class="winSum">
                        <p class="winSumNumber">{{finishBusinessMoney | dealmoney}}</p>
                        <p class="winSumText">赢单金额{{businessWinMoney}}</p>
                    </div>
                    <div class="ringNum">
                        <p class="singleNum">{{finishBusinessNum}}单</p>
                        <p class="singlePercent">{{finishRate}}%</p>
                    </div>
                </div>
            </div>
            <div class="list-center">
                <div class="separationLine"></div>
            </div>
            <div class="list-right" @click="redirectList('fail')">
              <div class="rightRing">
                <ring-diagram v-bind="rightRingCharts" v-if="ringShow"></ring-diagram>
                    <div class="loseSum">
                        <p class="loseSumNumber">{{failBusinessMoney | dealmoney}}</p>
                        <p class="loseSumText">输单金额{{businessFailMoney}}</p>
                    </div>
                    <div class="ringNum">
                        <p class="singleNum">{{failBusinessNum}}单</p>
                        <p class="singlePercent">{{failRate}}%</p>
                    </div>
              </div>
            </div>
        </div>

        <!-- 商机分布组件 -->
        <distribution-list
                            @click="listClick"
                            :distributionData="distributionData"
        ></distribution-list>
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
import teamTree from './businessTeamTree/businessTeamTree.vue'; // 时间切换以及高级搜索子组件
import distributionList from '../components/distributionList/distributionList.vue'; // 商机分布子组件
import RingDiagram from '../../../components/RingDiagram/RingDiagram'; // 圆环组件
import TeamListSelect from '../../../components/TeamListSelect/TeamListSelect'; // 销售团队选人
import {
          getTeamList,
          searchBusinessGraphic,
          getBasicItem,
        } from '../../../api/businessGraphic/getData'; // 获取销售团队列表请求
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
    distributionList,
    RingDiagram,
    TeamListSelect,
  },
  data() {
    return {
      isClickBtn: false, // 判断是否点击了左右切换
      needClearTeam: false, // 是否需要清空团队
      status: 1, // 赢单1 输单2
      teamSelectData:[], // 存放销售团队所选择的数据
      firstTeamIds: this.$route.query.teamIds, // 销售团队id
      teamListData: [], // 销售团队列表
      showTeamSelect: false, // 销售团队显示隐藏
      ringShow: true,
      toUsersIds: '',
      toDeptIds: '',
      failRate: 15, // 输单百分比
      failBusinessNum: 0, // 输单单数
      failBusinessMoney: 0, // 输单金额
      finishRate: 12.56, // 赢单百分比
      finishBusinessNum: 0, // 赢单单数
      finishBusinessMoney: 0, // 赢单金额
      totalBusinessNum: 564, // 商机总数
      distributionData:[], // 传给子组件distributionList的数据,商机分布，格式：{id:1,name:123,percentSum:123,percent:0}
      businessTip: false, // 问号显示隐藏
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
              { text: '本周', value: 'week'},
              { text: '上周', value: 'lastWeek'},
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
            label: '商机类别',
            key: 'tbBusinessFunnelSearchVO.select',
            type: 'select',
            value: [
              { text: '全部', value: ''},
            ]
        },
      ],
      cacheSearchValue:{
            searchTime: this.$route.query.searchTimeType,
            'tbBusinessFunnelSearchVO.owner': this.$route.query.owner,
            'tbBusinessFunnelSearchVO.teamIds': this.$route.query.teamIds || '',
            'tbBusinessFunnelSearchVO.queryType':  'query_by_month',
        }
    }
  },
  computed: {
    // 环形图配置
    leftRingCharts(){
        return {
        id: 'leftRingChart',
        innerSize: '85%',
        chartMaxWidth: 150,
        chartSize: '170%',
        chartHeight: 100,
        chartData: [
            {
                name:'finish',
                y: this.finishRate,
                color: '#F76160'
            },
            {
                name: 'unfinish',
                y: 100-this.finishRate == 0 ? '' : 100-this.finishRate,
                color: '#EFEFEF'
            }
        ]
        }
    },
    // 右圆环
    rightRingCharts(){
        return {
            id: 'rightRingCharts',
            innerSize: '85%',
            chartMaxWidth: 150,
            chartSize: '170%',
            chartHeight: 100,
            chartData: [
                {
                    name:'finish',
                    y: this.failRate,
                    color: '#09BB07'
                },
                {
                    name: 'unfinish',
                    y: 100-this.failRate == 0 ? '' : 100-this.failRate,
                    color: '#EFEFEF'
                }
            ]
        }
    },
    // 商机赢单金额单位
    businessWinMoney () {
        return this.finishBusinessMoney > 999999.99? '（万元）' : '（元）';
    },
    
    // 商机输单金额单位
    businessFailMoney () {
        return this.failBusinessMoney > 999999.99? '（万元）' : '（元）';
    }
  },
  created(){
    this.headerShow = true;
    this.getBusinessType(); // 商机类别
    this.getBusinessList(); // 商机分布
  },
  mounted () {
  },
  methods: {
    getBusinessList(){
      // 每次请求清空商机分布的数据
      this.distributionData = [];
        let obj = {
          // 所有者 owner：全部：0， 我负责的：1，  我相关的：2，  我创建的：3
          'tbBusinessFunnelSearchVO.timeType': '',
          'tbBusinessFunnelSearchVO.startTime': this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'],
          'tbBusinessFunnelSearchVO.endTime': this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'],
          'tbBusinessFunnelSearchVO.queryType': this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'],
          'tbBusinessFunnelSearchVO.searchTimeType': this.cacheSearchValue.searchTime,
          'tbBusinessFunnelSearchVO.owner': this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'],
          'tbBusinessFunnelSearchVO.businessType': this.cacheSearchValue['tbBusinessFunnelSearchVO.select'],
          'tbBusinessFunnelSearchVO.teamIds': this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'], // 销售团队
          'tbBusinessFunnelSearchVO.toUserIds': '',
          'tbBusinessFunnelSearchVO.toDeptIds': '',
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
          this.toUserIds = usersId.join();
          this.toDeptIds = deptsId.join();
        }
        // 商机跟进统计页面数据的请求 百分比及相关数据
        searchBusinessGraphic(obj).then(res => {
            if(res.code == '0'){
              let { failBusinessNum,failRate,failBusinessMoney,finishBusinessMoney,finishBusinessNum,finishRate,totalBusinessNum } = res.data.index;
              this.totalBusinessNum = totalBusinessNum;
              this.failBusinessNum = failBusinessNum;
              this.failRate = failRate;
              this.failBusinessMoney = failBusinessMoney;
              this.finishBusinessNum = finishBusinessNum;
              this.finishRate = finishRate;
              this.finishBusinessMoney = finishBusinessMoney;
            //   this.leftRingCharts.chartData[0].y = 0;
            //   this.leftRingCharts.chartData[1].y = 0;
            //   this.$set(this.leftRingCharts.chartData[0],'y',this.finishRate);
            //   this.$set(this.leftRingCharts.chartData[1],'y',100-this.finishRate);
            //   this.rightRingCharts.chartData[0].y = 0;
            //   this.rightRingCharts.chartData[1].y = 0;
            //   this.$set(this.rightRingCharts.chartData[0],'y',this.failRate);
            //   this.$set(this.rightRingCharts.chartData[1],'y',100-this.failRate);
              this.ringShow = true;
              // 假如首页选择销售团队，则会把数据带过来
              if(res.data.teamList){
                  this.teamSelectData = res.data.teamList;
                  let teamNameArr = [];
                  this.teamSelectData.forEach((item) => {
                      teamNameArr.push(item.teamName)
                  })
                  this.setting[2].label = teamNameArr.join();
              }
                // 商机分布
                res.data.index.list.forEach((item,index) => {
                    // 动画效果必须初始化percent的值
                    this.distributionData.push(
                      {
                        id:item.stage,
                        name: item.stageName,
                        percentSum: item.businessNum,
                        percent: 0
                      })
                      // 动画效果，动态添加percent
                      setTimeout(()=> {
                          this.distributionData[index].percent = item.numPercent
                      },500)
                })
            }else{
                _.alert('提示',res.desc)
            }
        })
    },
    getBusinessType(){
        // 高级搜索的商机类别请求
        getBasicItem().then(res => {
            if(res.code == '0'){
                res.data.list.forEach((item) => {
                    if(item.type == '3' && item.optionName == '商机类别'){
                          item.list.map((litem) => {
                              if(litem.isShow == '1'){
                                  this.setting[5].value.push({ text: litem.name, value: litem.stageCode })
                              }
                          })
                    }
                })
            }else{
                _.alert('提示',res.desc)
            }
        })
    },

    // 赢单输单跳转列表
    redirectList(status){
        this.status = status == 'win' ? 1 : 2
        if(status == 'win'){
            if(this.finishBusinessNum == 0){
                return
            }else{
                this.businessViewPush();
            }
        }
        if(status == 'fail'){
            if(this.failBusinessNum == 0){
                return
            }else{
                this.businessViewPush();
            }
        }
    },

    // 跳转商机路由
    businessViewPush(){
        this.$router.push({ name:"businessViewList",
                            query:{
                                startTime: this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'],
                                endTime: this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'],
                                businessType: this.cacheSearchValue['tbBusinessFunnelSearchVO.select'],
                                searchTimeType: this.isClickBtn ? 'custom' : this.cacheSearchValue.searchTime,
                                teamIds: this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'],
                                toUserIds: this.toUserIds,
                                toDeptIds: this.toDeptIds,
                                page: 1,
                                owner: this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'],
                                agentCode: 'crm',
                                status: this.status
                            }
                        });
    },

    // 点击商机分布
    listClick(val){
        this.$router.push({
                            name:"funnelViewList",
                            query:{
                                stage: val.id,
                                paramType: 3,
                                startTime: this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'],
                                endTime: this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'],
                                businessType: this.cacheSearchValue['tbBusinessFunnelSearchVO.select'],
                                searchTimeType: this.isClickBtn ? 'custom' : this.cacheSearchValue.searchTime,
                                teamIds: this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'],
                                toUserIds: this.toUserIds,
                                toDeptIds: this.toDeptIds,
                                owner: this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'],
                                agentCode: 'crm',
                                status: this.status
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

    // 高级搜索按了确定按钮触发事件
    search(cacheSearchValue){
      this.cacheSearchValue = cacheSearchValue;
      this.preNextShow = true;
      // 自定义时间的判断，不能超12个月
      this.customToast();
      this.valiNull();
    },

    // 验证销售团队是否空值，是的话按确定有弹窗提示
    valiNull(){
        if(this.cacheSearchValue['tbBusinessFunnelSearchVO.owner'] == '4'){
          if(this.teamSelectData.length == 0){
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
        this.getBusinessList();
    },

    // 关闭高级搜索
    searchClose(){
    },

    // 选择高级搜索单选的时候触发
    checkedRadio(index,key,value){
        if(key == this.setting[0].key && index != 4){
            this.setting[2].label = '';
            this.cacheSearchValue['tbBusinessFunnelSearchVO.teamIds'] = '';
            this.needClearTeam = true;
        }
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

    //重置高级搜索
    reset() {
      this.$set(this.setting[2],'label',''); // 清空销售团队
      this.needClearTeam = true;
      this.cacheSearchValue = {
          searchTime:"month",
          'tbBusinessFunnelSearchVO.teamIds': '',
      }
    },

    preNextBtn(boardCurrentTime){
        let reg=/(\w*)年(.*)月(.*)/g;
        this.isClickBtn = 'ture';
        switch(this.cacheSearchValue.searchTime){
            case 'year':
              this.cacheSearchValue.searchTime = 'custom';
              this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.replace("年","-01");
              this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.replace("年","-12");
              this.getBusinessList();
              this.cacheSearchValue.searchTime = 'year';
              break;
            case 'month':
              this.cacheSearchValue.searchTime = 'custom';
              this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.replace(reg,"$1-$2");
              this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.replace(reg,"$1-$2");
              this.getBusinessList()
              this.cacheSearchValue.searchTime = 'month';
              break;
            case 'lastMonth':
              this.cacheSearchValue.searchTime = 'custom';
              this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.replace(reg,"$1-$2");
              this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.replace(reg,"$1-$2");
              this.getBusinessList()
              this.cacheSearchValue.searchTime = 'lastMonth';
              break;
            case 'season':
              this.cacheSearchValue.searchTime = 'custom';
              this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'] = boardCurrentTime.split('-')[0].replace(reg,"$1-$2");
              this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'] = boardCurrentTime.split('-')[1].replace(reg,"$1-$2");
              this.getBusinessList()
              this.cacheSearchValue.searchTime = 'season';
              break;
        }
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
          }
        }
      }else{
          this.preNextShow = true;
      }
    },
    businessNumTip(){
      this.businessTip=!this.businessTip;
    }
  }
}
</script>
<style lang="scss" scoped>
@import './businessGraphic.scss';
</style>
