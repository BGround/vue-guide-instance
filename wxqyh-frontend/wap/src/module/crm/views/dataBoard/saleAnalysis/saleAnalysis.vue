<template>
    <div class="wrap saleAnalysis" @click="closeTip">
        <header-selector  v-if="hasGetTeamList"
                          :selectOptions="selectOptions"
                          :option="teamOption"
                          :chooseType = "chooseType"
                          @selectChange="handlefilter"
        ></header-selector>
        <div class="content">
            <div class="dashboard_container">
                <div class="dashboard_data">
                    <div class="data_header">
                        <span>{{boardTimeName}}新增{{crmTypeName}}</span>
                        <i class="iconfont cr-icon_tips" @click.stop="showTip"></i>
                    </div>
                    <span class="data_number">{{saleBehaviorDetail.totalAddCount}}</span>
                </div>
                <div class="dashboard_sequential">
                    <div class="sequential" v-if="firstCompareRate">
                        <i class="iconfont" :class="firstRateClass"></i>
                        <div class="sequential_text">
                          <span class="title">{{firstCompareRate.name || ''}}</span>
                          <span>{{firstCompareRate.rate || ''}}</span>
                        </div>

                    </div>
                    <div class="sequential" v-if="secondCompareRate">
                        <i class="iconfont" :class="secondRateClass"></i>
                        <div class="sequential_text">
                          <span class="title">{{secondCompareRate.name || ''}}</span>
                          <span>{{secondCompareRate.rate || ''}}</span>
                        </div>

                    </div>
                </div>
                <div class="tip_container" v-show="isTipShow">
                    <p>销售行为分析统计一定时间范围内的新增业务对象数量</p>
                    <p>环比：与上一阶段对比</p>
                </div>
            </div>
            <div class="data_board">
                <div class="marketing-analysis-body">
                    <div class="marketing-analysis-body-chart">
                        <analysis-chart :list="list" ref="chart" v-show="list.length && hasHighChartsOption"></analysis-chart>
                        <div class="no-chart-content" v-show="!hasHighChartsOption">
                            <no-chart :iconClass="iconClass"></no-chart>
                        </div>
                    </div>
                </div>
                <div class="marketing-analysis-body-table">
                    <table>
                        <thead>
                            <tr>
                                <th>时间</th>
                                <th>新增{{crmTypeName}}数</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in saleBehaviorDetail.stageVOs" :key="index">
                                <td>{{item.stageName}}</td>
                                <td class="val">{{item.lastAddCount}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import HeaderSelector from './components/HeaderSelector'
import AnalysisChart from "./components/AnalysisChart"
import NoChart from '../../../components/no-chart/no-chart'
import {getTeamList, getSaleBehavior} from '../../../api/dataBoard/getData'

const typeName = {
  'client': '客户',
  'contact': '联系人',
  'business': '商机',
  'contract': '合同',
  'visit': '拜访单',
};
const timeName = {
  'week': '本周',
  'month': '本月',
  'season': '本季',
  'year': '今年',
  'lastWeek': '上周',
  'lastMonth': '上月',
  'lastSeason': '上季'
};
export default {
  components: {
    HeaderSelector,
    AnalysisChart,
    NoChart
  },
  data() {
    return {
      // 默认选中
      selectOptions: {
        time: this.$route.query.time,
        type: this.$route.query.type,
        team: this.$route.query.team
      },
      teamOption: [],
      isTipShow: false,
      selectTime: this.$route.query.time,
      selectType: this.$route.query.type,
      selectTeam: this.$route.query.team,
      selectQuery: this.$route.query.crmtype,
      list: [],
      saleBehaviorDetail: {},
      firstCompareRate: {},
      secondCompareRate: {},
      hasGetTeamList: false,
      hasHighChartsOption:false,//图表是否有数据，默认没有数据
      iconClass:'icon-one-column',//无数据图表样式
    }
  },
  computed: {
    crmTypeName() {
      let name = '';
      if(this.selectQuery){
        name = typeName[this.selectQuery]
      }
      return name;
    },
    boardTimeName() {
        let name = '';
        if(this.selectTime){
            name = timeName [this.selectTime]
        }
        return name
    },
    firstRateClass() {
      if(this.firstCompareRate){
        let upOrLow = this.firstCompareRate.upOrLow || '-2'
        return {
          'cr-icon_rise': upOrLow === '1',
          'cr-icon_decline': upOrLow === '-1',
          'same': upOrLow === '0'
        }
      }


    },
    secondRateClass() {
      if(this.secondCompareRate){
        let upOrLow = this.secondCompareRate.upOrLow || '-2'
        return {
          'cr-icon_rise': upOrLow === '1',
          'cr-icon_decline': upOrLow === '-1',
          'same': upOrLow === '0'
        }
      }
    },
    chooseType() {
      if(this.teamOption.length === 0){
        return false;
      }
      return true;
    }
  },
  created() {
    this._getSaleBehavior()
    this._getTeamList()
  },
  methods: {
    handlefilter(data) {
      this.selectTime = data.time;
      this.selectType = data.type;
      this.selectTeam = data.team;
      this._getSaleBehavior();
    },
    init(){
      // 若进入是为个人

      // 若进入为团队， 团队ID
    },
    showTip() {
      this.isTipShow = true;
    },
    closeTip() {
      this.isTipShow = false;
    },
    _getTeamList() {
      let data = {
        pageSize: 20
      }  
      getTeamList(data).then(res => {
        if(res.code === '0'){
          this.hasGetTeamList = true;
          this.teamOption = res.data.teamList.pageData;
        } else {
          _.alert('提示',res.desc);
        }
      })
    },
    _getSaleBehavior() {
      let data = {
        teamOrPerson: this.selectType === 'personal' ? 'person' : this.selectType,
        timeType: this.selectTime,
        queryType: this.selectQuery
      }

      if (this.selectTeam) {
        data.teamId = this.selectTeam
      }
      this.hasHighChartsOption = false

      getSaleBehavior(data).then(res => {
        if(res.code === '0'){
          this.saleBehaviorDetail = res.data.saleBehaviorDetailVO
          this.firstCompareRate = res.data.saleBehaviorDetailVO.firstCompareRate;
          this.secondCompareRate = this.saleBehaviorDetail.secondCompareRate;

          this.list = JSON.parse(JSON.stringify(this.saleBehaviorDetail.stageVOs).replace(/stageName/g, 'x').replace(/lastAddCount/g, 'y'))

        //遍历图表数据
        // 判断只要有一个数据大于0，则有数据；否则显示无数据图片
        this.list.forEach((item,index) => {
            if(item.y && item.y > 0){
                this.hasHighChartsOption = true
            }
        });
          // this.$refs.chart.initChart()
        } else {
          _.alert('提示',res.desc);
        }
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.saleAnalysis{
    .selector_container{
      .arrow{
        &::after{
          content: normal
        }
      }
    }
    .content{
        overflow: auto;
        height: -webkit-fill-available;
        height: fill-available;
        .dashboard_container {
            position: relative;
            margin: 55px 0 10px;
            background-color: #fff;
            height: 93px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            & > div {
                flex: 1;
            }
            .dashboard_data {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                .data_header {
                    font-size: 13px;
                    line-height: 20px;
                    font-family: PingFangSC-Regular;
                    color: rgba(166, 166, 166, 1);
                    .cr-icon_tips{
                        font-size: 14px;
                    }
                }
                .data_number {
                    font-size: 32px;
                    line-height: 40px;
                    font-family: PingFangSC-Regular;
                    color: rgba(51, 51, 51, 1);
                }
            }
            .dashboard_sequential> .sequential {
                padding-left: 10px;
                .sequential_text{
                  display:inline-block;
                  color: #333;
                  .title{
                    color: #999;
                    margin-right: 5px;
                  }
                }
                .same + .sequential_text{
                  margin-left: 22px;
                }
                .cr-icon_rise, .cr-icon_decline{
                    font-size: 14px;
                    margin-right: 5px;
                }
                .cr-icon_rise{
                    color: #f7605f
                }
                .cr-icon_decline{
                    color: #2cc72d
                }
            }
            .tip_container{
                position: absolute;
                top: 40px;
                left: 110px;
                padding: 10px;
                background: #fff;
                width: 200px;
                box-shadow: rgba(0,0,0,0.15) 0px 2px 10px;
                p{
                    color: #333;
                    font-size: 12px;
                    &:first-child{
                        margin-bottom: 10px
                    }
                }

            }
        }
        .data_board{
            padding: 20px 15px;
            background-color: #fff;
            .marketing-analysis {
                &-body {
                    &-chart{
                        .no-chart-content{
                            padding:15px 0 40px 0;
                        }
                    }
                    &-table {
                        table {
                            width: 100%;
                            font-size: 14px;
                            border: 1px solid #f5f5f5;
                            border-collapse: collapse;
                            thead {
                                background-color: #edf1f6;
                            }
                            tr {
                                height: 34px;
                                border-bottom: 1px solid #f5f5f5;
                                th{
                                    font-weight: 400;
                                }
                                td {
                                    width: 50%;
                                    text-align: center;
                                    &.val {
                                        color: #468ceb;
                                        border-left: 1px solid #f5f5f5;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}
</style>
