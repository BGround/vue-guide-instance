<template>
  <div class="status">

    <div class="wrapper">

      <el-row :gutter="15">

        <el-col :span="8">
          <div class="board__card">
            <div class="board__card__header">总体规模</div>
            <div class="first section">
              <div class="header">
                <h4 class="title">一网变化</h4>
                <div class="statistics">
                  <div class="statistics__value"><span class="red">{{oneNet.monthlyNetworkSize}}</span></div>
                  <div class="statistics__label">当前现状</div>
                </div>
              </div>
              <div class="detail">
                <div class="detail_item">
                  数量：<span :class="{
                      green: oneNet.balanceNumChange>0,
                      red: oneNet.balanceNumChange<0
                  }">{{oneNet.balanceNum}}<span class="arrow">
                  {{oneNet.balanceNumChange>0? '↑': (oneNet.balanceNumChange<0? '↓': '') }}
                </span></span>
                </div>
                <div class="detail_item">
                  入网：<span :class="{
                      green: oneNet.entryChange>0,
                      red: oneNet.entryChange<0
                  }">{{oneNet.networkAccess}}<span class="arrow">
                  {{oneNet.entryChange>0? '↑': (oneNet.entryChange<0? '↓': '') }}
                </span></span>
                </div>
                <div class="detail_item">
                  退网：<span :class="{
                      green: oneNet.exitChange>0,
                      red: oneNet.exitChange<0
                  }">{{oneNet.backNets}}<span class="arrow">
                  {{oneNet.exitChange>0? '↑': (oneNet.exitChange<0? '↓': '') }}
                </span></span>
                </div>
              </div>
              <div class="detail">
                <div class="detail_item">
                  异常转正常：{{oneNet.abnormalToNormal}}
                </div>
                <div class="detail_item">
                  正常转异常：{{oneNet.normalToAbnormal}}
                </div>
              </div>
            </div>
            <div class="first section">
              <div class="header">
                <h4 class="title">二网变化</h4>
                <div class="statistics">
                  <div class="statistics__value"><span class="red">{{twoNet.completion}}</span></div>
                  <div class="statistics__label">当前现状</div>
                </div>
              </div>
              <div class="detail">
                <div class="detail_item">
                  数量：<span :class="{
                      green: twoNet.balanceNumChange>0,
                      red: twoNet.balanceNumChange<0
                  }">{{twoNet.balanceNum}}<span class="arrow">
                  {{oneNet.balanceNumChange>0? '↑':( oneNet.balanceNumChange<0? '↓': '' )}}
                </span></span>
                </div>
                <div class="detail_item">
                  入网：<span :class="{
                      green: twoNet.entryChange>0,
                      red: twoNet.entryChange<0
                  }">{{twoNet.annualNetworkAccess}}<span class="arrow">
                  {{oneNet.entryChange>0? '↑':( oneNet.entryChange<0? '↓': '') }}
                </span></span>
                </div>
                <div class="detail_item">
                  退网：<span :class="{
                      green: twoNet.exitChange>0,
                      red: twoNet.exitChange<0
                  }">{{twoNet.annualNetworkWithdrawal}}<span class="arrow">
                  {{twoNet.exitChange>0? '↑': (twoNet.exitChange<0? '↓': '') }}
                </span></span>
                </div>
              </div>

            </div>
          </div>

        </el-col>

        <el-col :span="8">
          <div class="board__card ranking">
            <div class="ranking__header">
              <h3 class="title">产品授权</h3>
              <div class="legend">
                <div class="legend__item">数量</div>
                <div class="legend__item">覆盖率</div>
              </div>
            </div>
            <div class="ranking__content">
              <div class="list">

                <div class="list__item" v-for="(item, index) in productList" :key="index">
                  <div class="list__item__arrow"
                       :class="{
                        green: parseInt(item.monthlyChange)>0,
                        red: parseInt(item.monthlyChange)<0
                     }">
                    {{item.monthlyChange>0? '↑': (item.monthlyChange<0? '↓': '-') }}
                  </div>
                  <div class="list__item__rank">{{index+1}}</div>
                  <div class="list__item__name" :title="item.productName" >{{item.productName}}</div>
                  <div class="list__item__chart"></div>
                  <div class="list__item__change">
                    <p>{{item.authorizedNumber}}</p>
                    <p>{{item.coverage}}%</p>
                  </div>
                </div>

              </div>
              <div id="ranking-chart1" class="content__chart" ></div>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="board__card ranking">
            <div class="ranking__header">
              <h3 class="title">行业竞品</h3>
              <div class="legend">
                <div class="legend__item">数量</div>
                <div class="legend__item">季度变化</div>
              </div>
            </div>
            <div class="ranking__content">
              <div class="list">

                <div class="list__item" v-for="(item, index) in industryCompetitorList" :key="index">
                  <div class="list__item__arrow"
                     :class="{
                        green: parseInt(item.monthlyChange)>0,
                        red: parseInt(item.monthlyChange)<0
                     }">
                    {{item.monthlyChange>0? '↑': (item.monthlyChange<0? '↓': '-') }}
                  </div>
                  <div class="list__item__rank">{{index+1}}</div>
                  <div class="list__item__name" :title="item.competitorName">{{item.competitorName}}</div>
                  <div class="list__item__chart"></div>
                  <div class="list__item__change">
                    <p>{{item.competitorDotNum}}</p>
                    <p :class="{'red': item.balanceNum < 0}" >{{item.balanceNum > 0 ? `+${item.balanceNum}`: item.balanceNum }}</p>
                  </div>
                </div>


              </div>
              <div id="ranking-chart2" class="content__chart" ></div>
            </div>
          </div>
        </el-col>

      </el-row>



    </div>


  </div>
</template>

<script>

  import twoNet from "../oneNetworkSize/twoNet";

    const chartOptions1 = {
        color: ['#5B8FF9','#73DEB3'],
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            top: '0%',
        },
        xAxis: [
            {
                show: false,
                type: 'value',
            },
            {
                show: false,
                type: 'value',
            }
        ],
        yAxis: [
            {
                show: false,
                nameTextStyle:{
                    width:0,
                    fontSize: 14,
                    color: '#666666',
                    align: 'left',
                },
                nameGap: 17,
                type: 'category',
                data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            }
        ],
        series: [
            {
                barGap: 0,
                barCategoryGap : '5%',
                name: '2011年',
                type: 'bar',
                barWidth: 8,
                data: [],
                xAxisIndex: 0,
            },
            {
                barGap: 0,
                barCategoryGap : '5%',
                name: '2012年',
                barWidth: 8,
                type: 'bar',
                data: [],
                xAxisIndex: 1,
            },
        ],
    };
    const chartOptions2 = {
        color: ['#5B8FF9','#73DEB3'],
        grid: {
            left: '0%',
            right: '0%',
            bottom: '0%',
            top: '0%',
        },
        xAxis: [
            {
                show: false,
                type: 'value',
            },
            {
                show: false,
                type: 'value',
            }
        ],
        yAxis: [
            {
                show: false,
                nameTextStyle:{
                    width:0,
                    fontSize: 14,
                    color: '#666666',
                    align: 'left',
                },
                nameGap: 17,
                type: 'category',
                data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            }
        ],
        series: [
            {
                barGap: 0,
                barCategoryGap : '5%',
                name: '2011年',
                type: 'bar',
                barWidth: 8,
                data: [],
                xAxisIndex: 0,
            },
            {
                barGap: 0,
                barCategoryGap : '5%',
                name: '2012年',
                barWidth: 8,
                type: 'bar',
                data: [],
                xAxisIndex: 0,
            },
        ],
    };

    import echarts from 'echarts'
    import getData from "../../api/getData";

    export default {
        data() {
            return {
                chartId1: 'ranking-chart1',
                chartId2: 'ranking-chart2',
                chart1: null,
                chart2: null,
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },

                oneNet:{
                    monthlyNetworkSize: 0, //	当前现状
                    networkAccess: 0, //	入网数
                    backNets: 0, //	退网数
                    abnormalToNormal: 0, //	异常转正常
                    normalToAbnormal: 0, //	正常转异常
                    balanceNum: 0, //	数量
                    balanceNumChange: 0, //	差额变化 -1 负 0 无 1 正
                    entryChange: 0, //	入网变化 -1 负 0 无 1 正
                    exitChange: 0, //	退网变化 -1 负 0 无 1 正
                },

                twoNet:{
                    completion: 0, //	当前现状
                    balanceNum: 0, //	数量
                    annualNetworkAccess: 0, //	入网数
                    annualNetworkWithdrawal: 0, //	退网数
                    balanceNumChange: 0, //	差额变化 -1 负 0 无 1 正
                    entryChange: 0, //	入网变化 -1 负 0 无 1 正
                    exitChange: 0, //	退网变化 -1 负 0 无 1 正
                },

                industryCompetitorList: [], // 行业竞品
                productList: [], //产品授权


                // compare:{
                //     maxNum: 0,
                //     competitorName: 0,
                //     competitorDotNum: 0,
                //     monthlyChange: 0,
                //     balanceNum: 0,
                // },

                // authorization:{
                //     maxNum: 0,	最大值
                //     productName: 0,	产品名称
                //     authorizedNumber: 0,	授权网点数量
                //     coverage: 0,	覆盖率
                //     monthlyChange: 0,	月度变化 -1 负 0 无 1 正
                // }



            };
        },
        created(){
            this.getScaleManagement()
            this.getScaleManagementList()
            this.getIndustryCompetitorList()
            this.getProductAuthorizationList()
        },
        props:{
            date:{
                type: Object,
                required: true,
            }
        },
        watch:{
            date:{
                deep: true,
                handler: function (date) {
                    console.log(date)
                    this.form.month = date.month
                    this.form.year = date.year
                    this.getScaleManagement()
                    this.getScaleManagementList()
                    this.getIndustryCompetitorList()
                    this.getProductAuthorizationList()
                }
            }
        },
        methods: {

            /**
             * 一网
             */
            
            getScaleManagement(){
                getData.getOneScaleManagement(this.form).then((data)=>{
                    this.oneNet.monthlyNetworkSize = data && data.monthlyNetworkSize ? data.monthlyNetworkSize : 0;	//	当前现状
                    this.oneNet.networkAccess = data && data.networkAccess ? data.networkAccess : 0;	//	入网数
                    this.oneNet.backNets = data && data.backNets ? data.backNets : 0;	//	退网数
                    this.oneNet.abnormalToNormal = data && data.abnormalToNormal ? data.abnormalToNormal : 0;	//	异常转正常
                    this.oneNet.normalToAbnormal = data && data.normalToAbnormal ? data.normalToAbnormal : 0;	//	正常转异常
                    this.oneNet.balanceNum = data && data.balanceNum ? data.balanceNum : 0;	//	数量
                    this.oneNet.balanceNumChange = data && data.balanceNumChange ? parseInt(data.balanceNumChange) : 0;	//	差额变化 -1 负 0 无 1 正
                    this.oneNet.entryChange = data && data.entryChange ? parseInt(data.entryChange) : 0;	//	入网变化 -1 负 0 无 1 正
                    this.oneNet.exitChange = data && data.exitChange ? parseInt(data.exitChange) : 0;	//	退网变化 -1 负 0 无 1 正
                })
            },

            /**
             * 二网
             */
            getScaleManagementList(){
                getData.getScaleManagementList(this.form).then((data)=>{
                    this.twoNet.completion = data && data.completion? data.completion : 0;//	当前现状
                    this.twoNet.balanceNum = data && data.balanceNum? data.balanceNum : 0;//	数量
                    this.twoNet.annualNetworkAccess = data && data.annualNetworkAccess? data.annualNetworkAccess : 0;//	入网数
                    this.twoNet.annualNetworkWithdrawal = data && data.annualNetworkWithdrawal? data.annualNetworkWithdrawal : 0;//	退网数
                    this.twoNet.balanceNumChange = data && data.balanceNumChange? parseInt(data.balanceNumChange) : 0;//	差额变化 -1 负 0 无 1 正
                    this.twoNet.entryChange = data && data.entryChange? parseInt(data.entryChange) : 0;//	入网变化 -1 负 0 无 1 正
                    this.twoNet.exitChange = data && data.exitChange? parseInt(data.exitChange) : 0;//	退网变化 -1 负 0 无 1 正
                })
            },

            /**
             * 行业竞品
             */
            getIndustryCompetitorList(){
                getData.getIndustryCompetitorList(this.form).then((data)=>{
                  if(data && data.industryCompetitorList){
                      this.industryCompetitorList = data.industryCompetitorList
                  }else{
                      this.industryCompetitorList = []
                  }
                  this.setOptionOfComparingChart(this.industryCompetitorList);
                })
            },

            /**
             * 产品授权
             */
            getProductAuthorizationList(){
                getData.getProductAuthorizationList(this.form).then((data)=>{
                    if(data && data.productList){
                        this.productList = data.productList
                    }else{
                        this.productList = []
                    }
                    this.setOptionOfAuthChart(this.productList);
                })

            },

            setOptionOfComparingChart(list){

                const comparingTemp = [0,0,0,0,0,0,0,0,0,0];
                const balanceTem = [0,0,0,0,0,0,0,0,0,0];

                const competitorDotNum = comparingTemp.map((item,index)=>{
                    return  list[index] && list[index].competitorDotNum? parseInt(list[index].competitorDotNum): item;
                }).reverse();

                const balanceNum = balanceTem.map((item,index)=>{
                    if(list[index] && list[index].balanceNum){
                        return {
                            value: Math.abs(parseInt(list[index].balanceNum)) || 0,
                            itemStyle:{
                                color: parseInt(list[index].balanceNum) > 0? '#73DEB3': '#EB7F65'
                            }
                        }
                    }else{
                      return {
                          value: 0,
                          itemStyle:{
                              color: '#73DEB3'
                          }
                      }
                    }
                    // return  ? parseInt(list[index].balanceNum): item;
                }).reverse();

                chartOptions2.series[0].data = competitorDotNum;
                chartOptions2.series[1].data = balanceNum;
                this.$nextTick(()=>{
                    this.chart2.setOption(chartOptions2);
                })
            },

            setOptionOfAuthChart(list){

                const template = [0,0,0,0,0,0,0,0,0,0];

                const authorizedNumber = template.map((item,index)=>{
                    return  list[index] && list[index].authorizedNumber? parseInt(list[index].authorizedNumber): item;
                }).reverse();

                const coverage = template.map((item,index)=>{
                    return  list[index] && list[index].coverage? parseInt(list[index].coverage): item;
                }).reverse();

                chartOptions1.series[0].data = authorizedNumber;
                chartOptions1.series[1].data = coverage;


                this.$nextTick(()=>{
                    this.chart1.setOption(chartOptions1);
                })
            }

        },
        components: {

        },
        mounted() {
            this.chart1 = echarts.init(document.getElementById(this.chartId1));
            this.chart2 = echarts.init(document.getElementById(this.chartId2));
            this.chart1.setOption(chartOptions1);
            this.chart2.setOption(chartOptions2);
            window.addEventListener('resize', this.resetChartSize)
        },
    }
</script>

<style lang="scss" scoped>
  @import '../../scss/common/board.scss';
  .status{
    .arrow{
      margin-left: 10px;
    }
    .red{
      color: #C31725;
    }
    .green{
      color: #00B563;
    }
    .wrapper{
      padding: 24px 0;
    }
    .section{
      padding: 24px 24px 24px;
    }

    .header{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #E6E6E6;
      padding-bottom: 17px;
      margin-bottom: 16px;

      .title{
        height:42px;
        font-size:20px;
        font-weight:bold;
        line-height:42px;
        color:rgba(20,30,40,1);
      }
      .statistics{
        .statistics__value{
          font-size:32px;
          font-weight:bold;
          line-height:42px;
          color:rgba(51,51,51,1);
          color: #333333;
          padding-bottom: 4px;
          .red{
            color: #C31725;
          }
        }
        .statistics__label{
          text-align: right;
        }
      }


    }
    .detail{
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      height:19px;
      font-size:14px;
      font-weight:400;
      line-height:19px;
      color:rgba(102,102,102,1);
    }

    .ranking{
      padding: 18px 24px;
      .ranking__header{
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        flex-basis: 50%;
        .title{
          height:26px;
          font-size:20px;
          font-weight:bold;
          line-height:25px;
          color:rgba(51,51,51,1);
        }

        .legend{
          height:16px;
          font-size:12px;
          font-weight:400;
          line-height:56px;
          color:rgba(153,153,153,1);
          margin-left: auto;
          flex-basis: 50%;
          display: flex;
          .legend__item{
            flex: 1;
            text-align: right;
            line-height: 1;
            &:before{
              content: '';
              display: inline-block;
              height: 8px;
              width: 8px;
              margin-right: 4px;
            }
            &:first-child:before{
              background: #5B8FF9;
            }
            &:last-child:before{
              background: #73DEB3;
            }

          }
        }
      }
      .ranking__content{
        position: relative;
        .content__chart{
          position: absolute;
          height: 360px;
          width: 110px;
          top:-3px;
          left: 168px;
        }
        .list{
          height: 350px;
        }
        .list__item{
          display: flex;
          align-items: center;
          flex-shrink: 0;
          margin-bottom: 8px;
        }
        .list__item__arrow{
          flex-basis: 20px;
          padding-right: 10px;
          flex-shrink: 0;
          text-align: center;
          line-height: 24px;
          height: 24px;
          font-weight: bolder;
          color: #666666;
          font-size: 20px;
          &.green{
            color: #39DA76;
          }
          &.red{
            color: #ED3E3E;
          }
        }
        .list__item__arrow{
          flex-basis: 20px;
          padding-right: 10px;
          flex-shrink: 0;
        }
        .list__item__rank{
          flex-basis: 24px;
          height: 24px;
          flex-shrink: 0;
          font-size:14px;
          font-weight:400;
          line-height:24px;
          text-align: center;
          color:#666666;
        }
        .list__item:nth-child(1) .list__item__rank{
          color: #ffffff;
          background: #F1405C;
          border-radius: 50%;
        }
        .list__item:nth-child(2) .list__item__rank{
          background: #FF8547;
          color: #ffffff;
          border-radius: 50%;
        }
        .list__item:nth-child(3) .list__item__rank{
          color: #ffffff;
          background: #FFBC00;
          border-radius: 50%;
        }
        .list__item__name{
          flex-basis: 102px;
          padding: 0 18px 0 10px;
          flex-shrink: 0;
          white-space: nowrap;
          overflow: hidden;
          font-size: 14px;
          text-overflow: ellipsis;
        }
        .list__item__chart{
          flex-grow: 1;
        }
        .list__item__change{
          width:40px;
          height:28px;
          font-size:10px;
          font-weight:400;
          line-height:14px;
          text-align: right;
          p:first-child{
            color:#5B8FF9;
          }
          p:last-child{
            color:rgba(60,208,131,1);
          }
          p.red:first-child{
            color: #D1031C;
          }
          p.red:last-child{
            color: #D1031C;
          }
        }
      }
    }
  }
</style>

