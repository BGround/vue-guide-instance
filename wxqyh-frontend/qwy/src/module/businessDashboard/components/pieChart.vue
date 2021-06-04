<template>
    <div class="polar-chart">
        <div class="section">
            <div class="polar-chart__left">
              <div class="polar-chart__title">{{getTitle}}</div>
              <div class="legend">
                <el-row class="row" v-for="(item, index) in listOfLegend" :key="index">
                  <el-col :span="12" class="col">
                    <a @click="handleClick(item)" href="JavaScript:;">
                      <i class="legend-dot" :style="{background: item.active? item.color: '#eeeeee' }"></i>
                      <span>{{item.name}}</span></a>
                  </el-col>
                  <el-col :span="10" class="col">{{item.value}}</el-col>
                </el-row>
              </div>
            </div>
            <div class="polar-chart__right">
              <div ref="chart" class="polar-chart__chart">

              </div>
            </div>
        </div>
    </div>
</template>

<script>

    import echarts from "echarts";


    const chartOption = {
        color: ['#5B8FF9', '#F5D023', '#3CD083', '#7585A2', '#C31725'],
        tooltip: {
            show: false,
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            show: false,
            orient: 'vertical',
            left: 10,
            data: []
        },
        series: [
            {
                silent: true,          //饼图不响应鼠标事件
                name: '访问来源',
                type: 'pie',
                radius: ['78%', '100%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },

                labelLine: {
                    show: false
                },
                data: [
                ]
            }
        ]
    };
    export default {
        name: "polarChart",
        components: {},
        data() {
            return {
                chart: null,
                isActiveTarget: true,
                isActiveMeeting: true,
                isActiveApprove: true,
                isActivePaid: true,
                isActiveUnpaid: true,
                listOfLegend: [],
                hasData: false,
            }
        },
        props: {
            color: {
                type: Array,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            options: {
                type: Array,
                default(){
                    return []
                }
            }
        },
        computed:{
            getTitle(){
                return this.title;
            }
        },
        methods: {

            handleClick(item){
                this.chart.dispatchAction({
                    type: 'legendToggleSelect',
                    name: item.name                    // 图例名称
                })
                item.active = !item.active
            },

            setOptions(options){
                if(this.hasData){
                    chartOption.color = options.map(item=>item.color);
                    chartOption.legend.data = options.map(item=>item.name);
                    chartOption.series[0].data = options.map(item=>({
                        value: item.value,
                        name: item.name
                    }))
                }else{
                    chartOption.color = ['#ebeef5']
                    chartOption.series[0].data = [{
                        value: 0,
                        name: ''
                    }]
                }
                this.listOfLegend = options.map(item=>({
                    value: item.value,
                    name: item.name,
                    active: true,
                    color: item.color,
                }))
                this.chart.setOption(chartOption);
            },

            checkOptions(options){
                return !!options.find(option=>!!option.value);
            }

        },

        watch:{
            options:{
                deep: true,
                handler(o){
                    this.hasData = this.checkOptions(o);
                    this.setOptions(o);
                }
            }
        },
        created() {

        },
        mounted() {
            this.chart = echarts.init(this.$refs['chart']);
            this.hasData = this.checkOptions(this.options);
            this.setOptions(this.options);
        }
    }
</script>

<style scoped lang="scss">
  .polar-chart{
    .section{
      box-sizing: border-box;
      width:374px;
      height:188px;
      background:rgba(247,247,247,1);
      border:1px solid rgba(230,230,230,1);
      border-radius:4px;
      display: flex;
      padding: 24px;
    }

    .polar-chart__left{
      flex-grow: 1;
    }
    .polar-chart__right{
      margin-top: 7px;
      flex-shrink: 0;
      flex-basis: 142px;
      .polar-chart__chart{
        width: 142px;
        height: 142px;
      }
    }
    .legend-dot{
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #eee;
      line-height: 19px;
      margin-right: 2px;
      vertical-align: top;
      margin-top: 6px;
      background: #eee;
    }
    .polar-chart__title{
      height:26px;
      font-size:20px;
      font-weight:400;
      line-height:26px;
      color:rgba(51,51,51,1);
    }
    .legend{
      width: 100%;
      height:19px;
      font-size:14px;
      font-weight:400;
      line-height:19px;
      color:rgba(153,153,153,1);
      .active{
        .blue{
          background: #5B8FF9;
        }
        .yellow{
          background: #F5D023;
        }
        .green{
          background: #3CD083;
        }
        .gray{
          background: #7585A2;
        }
        .red{
          background: #C31725;
        }
      }


      .row{
        margin: 9px 0;
      }

    }
  }
</style>
