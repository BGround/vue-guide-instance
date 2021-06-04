<template>
  <div class="region">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card">
          <div class="board__card__header">
            整体情况
          </div>
          <div class="situation">
            <div class="situation__item">
              <div class="situation__item__data">
                <div class="situation__item__data__value"><span class="yellow">{{liftNumber}}</span>/{{targetLift}}</div>
                <div class="situation__item__data__label">提车总计/提车目标</div>
              </div>
              <div class="situation__item__dashboard">
                <circularChart label="提车完成率" :ratio="carCompletionRate"></circularChart>
              </div>
            </div>
            <div class="situation__item">
              <div class="situation__item__data">
                <div class="situation__item__data__value"><span class="yellow">{{actualSalesNumber}}</span>/{{targetSales}}</div>
                <div class="situation__item__data__label">实销总计/实销目标</div>
              </div>
              <div class="situation__item__dashboard">
                <circularChart color="RGBA(231, 56, 86, 1)" auxiliaryColor="RGBA(251, 235, 238, 1)" label="实销完成率" :ratio="salesCompletionRate"></circularChart>
              </div>
            </div>
          </div>
        </div>

        <div class="board__card mt16 ">
          <div class="board__card__header">
            大区排名
          </div>
          <div class="ranking">
            <div class="ranking__item">
              <div class="ranking__item__label">提车</div>
              <div class="ranking__item__chart">
                <div class="ranking__item__chart__highest">
                  <div class="ranking__item__chart__highest__label">最高：{{carCompletionRateHighest.largeArea || ''}}</div>
                  <div class="ranking__item__chart__highest__bar">
                    <el-progress :format="formatProgressValue" stroke-linecap="square" :stroke-width="8" :color="'#FD9707'" :percentage="carCompletionRateHighest.liftNumber || 0"></el-progress>
                  </div>
                  <div class="ranking__item__chart__highest__value"></div>
                </div>
                <div class="ranking__item__chart__lowest">
                  <div class="ranking__item__chart__lowest__label">最低：{{carCompletionRateMinimum.largeArea || ''}}</div>
                  <div class="ranking__item__chart__lowest__bar">
                    <el-progress :format="formatProgressValue" stroke-linecap="square" :stroke-width="8" :color="'#FD9707'" :percentage="carCompletionRateMinimum.liftNumber || 0"></el-progress>
                  </div>
                  <div class="ranking__item__chart__lowest__value"></div>
                </div>
              </div>

            </div>
            <div class="ranking__item">
              <div class="ranking__item__label">实销</div>
              <div class="ranking__item__chart">
                <div class="ranking__item__chart__highest">
                  <div class="ranking__item__chart__highest__label">最高：{{salesCompletionRateHighest.largeArea}}</div>
                  <div class="ranking__item__chart__highest__bar">
                    <el-progress :format="formatProgressValue" stroke-linecap="square" :stroke-width="8" :color="'#E63752'" :percentage="salesCompletionRateHighest.actualSalesNumber || 0"></el-progress>
                  </div>
                  <div class="ranking__item__chart__highest__value"></div>
                </div>
                <div class="ranking__item__chart__lowest">
                  <div class="ranking__item__chart__lowest__label">最低：{{salesCompletionRateMinimum.largeArea}}</div>
                  <div class="ranking__item__chart__lowest__bar">
                    <el-progress :format="formatProgressValue" stroke-linecap="square" :stroke-width="8" :color="'#E63752'" :percentage="salesCompletionRateMinimum.actualSalesNumber || 0"></el-progress>
                  </div>
                  <div class="ranking__item__chart__lowest__value"></div>
                </div>
              </div>

            </div>
            <div class="ranking__item">
              <div class="ranking__item__label">存销比</div>
              <div class="ranking__item__chart">
                <div class="ranking__item__chart__highest">
                  <div class="ranking__item__chart__highest__label">最高：{{inventoryRatioHighest.largeArea}}</div>
                  <div class="ranking__item__chart__highest__bar">
                    <el-progress :format="formatProgressRatioValue" stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="inventoryRatioHighest.stockRate || 0"></el-progress>
                  </div>
                  <div class="ranking__item__chart__highest__value"></div>
                </div>
                <div class="ranking__item__chart__lowest">
                  <div class="ranking__item__chart__lowest__label">最低：{{inventoryRatioMinimum.largeArea}}</div>
                  <div class="ranking__item__chart__lowest__bar">
                    <el-progress :format="formatProgressRatioValue" stroke-linecap="square" :stroke-width="8" :color="'#5B8FF9'" :percentage="inventoryRatioMinimum.stockRate || 0"></el-progress>
                  </div>
                  <div class="ranking__item__chart__lowest__value"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="board__content__right">
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="networkSaleRegionChart1"></div>
          <div class="chart-title">年度提车</div>
        </div>
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="networkSaleRegionChart2"></div>
          <div class="chart-title">当月提车</div>
        </div>
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="networkSaleRegionChart3"></div>
          <div class="chart-title">年度实销</div>
        </div>
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="networkSaleRegionChart4"></div>
          <div class="chart-title">当月实销</div>
        </div>




      </div>

    </div>
  </div>
</template>

<script>
    const chartOption1 = {
        color: ['#5B8FF9', '#73DEB3', '#FD9707'],
        legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            data: [{
                name: '1-12月提车目标',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '1-12月提车',
                icon: 'rect'
            } ,{
                name: '累计提车完成率',
                // itemHeight: 13,
                itemWidth: 26,
                // icon: 'circle'
            }],

        },
        tooltip: {
            backgroundColor: '#ffffff',
            textStyle: {
                color: '#2781DB'
            },
            trigger: 'item',
            extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
            formatter: function (params) {
                if(params.seriesType === 'line'){
                    return `${params.seriesName} <br/>${params.name}: ${params.value}%`
                }else{
                    return `${params.seriesName} <br/>${params.name}: ${params.value}`
                }

            }
        },
        grid: {
            top: 70,
            left: 18,
            right: 18,
            bottom: 40,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
                // 刻度值
                interval: function(index, value) {
                    // 如果跳过则返回 false。
                    return true
                },
                textStyle: {
                    color: function(value, index) {
                        return '#999999'
                    }
                },
                showMaxLabel: true // 显示最后一个
            },
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                }
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            }
        },
        yAxis: [
            {
                axisTick: {
                    // 刻度
                    show: false
                },
                axisLine: {
                    // 轴线
                    lineStyle: {
                        color: '#DBDBDB'
                    },
                    show: false
                },
                splitLine: {
                    // 分割线
                    lineStyle: {
                        color: '#E6E6E6',
                        type: 'dashed'
                    }
                }
            },
            {
                axisTick: {
                    // 刻度
                    show: false
                },
                axisLine: {
                    // 轴线
                    lineStyle: {
                        color: '#DBDBDB'
                    },
                    show: false
                },
                splitLine: {
                    // 分割线
                    lineStyle: {
                        color: '#E6E6E6',
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    formatter: '{value}%'
                }
            },
        ],
        series: [
            {
                name: '新网提车',
                type: 'bar',
                barWidth: 13,
                data: [],
                label: {
                    show: true,
                    position: 'left',
                    fontsize:10,
                },
            },
            {
                name: '新网实销',
                type: 'bar',
                barWidth: 13,
                data: [],
                label: {
                    show: true,
                    position: 'right',
                    fontsize:10,
                },
            },
            {
                name: '提车完成率',
                type: 'line',
                // barWidth: 13,
                label: {
                    show: true,
                    // position: 'top',
                    formatter(params) {
                        return `${params.value}%`
                    }
                },
                smooth: true,
                yAxisIndex:1,
                data: []
            },
        ]
    }
    const chartOption2 = {
        color: ['#5B8FF9', '#73DEB3',  '#FD9707'],
        legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            data: [{
                name: '12月提车目标',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '12月提车',
                icon: 'rect'
            } ,{
                name: '累计提车完成率',
                // itemHeight: 13,
                itemWidth: 26,
                // icon: 'circle'
            }],

        },
        tooltip: {
            backgroundColor: '#ffffff',
            textStyle: {
                color: '#2781DB'
            },
            trigger: 'item',
            extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
            formatter: function (params) {
                if(params.seriesType === 'line'){
                    return `${params.seriesName} <br/>${params.name}: ${params.value}%`
                }else{
                    return `${params.seriesName} <br/>${params.name}: ${params.value}`
                }

            }
        },
        grid: {
            top: 70,
            left: 18,
            right: 18,
            bottom: 40,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
                // 刻度值
                interval: function(index, value) {
                    // 如果跳过则返回 false。
                    return true
                },
                textStyle: {
                    color: function(value, index) {
                        return '#999999'
                    }
                },
                showMaxLabel: true // 显示最后一个
            },
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                }
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            }
        },
        yAxis: [{
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                },
                show: false
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            }
        },{
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                },
                show: false
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            },
            axisLabel: {
                formatter: '{value}%'
            }
        }],
        series: [
            {
                name: '12月提车目标',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'left',
                    fontsize:10,
                },
                data: []
            },
            {
                name: '12月提车',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'right',
                    fontsize:10,
                },
                data: []
            },
            {
                name: '12月提车完成率',
                type: 'line',
                smooth: true,
                yAxisIndex: 1,
                label: {
                    show: true,
                    position: 'top',
                    formatter(params) {
                        return `${params.value}%`
                    }
                },
                // barWidth: 13,
                data: []
            }
        ]
    }
    const chartOption3 = {
        color: ['#5B8FF9', '#73DEB3', '#FD9707'],
        legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            data: [{
                name: '1-12月提车目标',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '1-12月提车',
                icon: 'rect'
            } ,{
                name: '累计提车完成率',
                // itemHeight: 13,
                itemWidth: 26,
                // icon: 'circle'
            }],

        },
        tooltip: {
            backgroundColor: '#ffffff',
            textStyle: {
                color: '#2781DB'
            },
            trigger: 'item',
            extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
            formatter: function (params) {
                if(params.seriesType === 'line'){
                    return `${params.seriesName} <br/>${params.name}: ${params.value}%`
                }else{
                    return `${params.seriesName} <br/>${params.name}: ${params.value}`
                }

            }
        },
        grid: {
            top: 70,
            left: 18,
            right: 18,
            bottom: 40,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
                // 刻度值
                interval: function(index, value) {
                    // 如果跳过则返回 false。
                    return true
                },
                textStyle: {
                    color: function(value, index) {
                        return '#999999'
                    }
                },
                showMaxLabel: true // 显示最后一个
            },
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                }
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            }
        },
        yAxis: [{
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                },
                show: false
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            }
        },{
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                },
                show: false
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            },
            axisLabel: {
                formatter: '{value}%'
            }
        }],
        series: [
            {
                name: '1-12月提车目标',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'left',
                    fontsize:10,
                },
                data: []
            },
            {
                name: '1-12月提车',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'right',
                    fontsize:10,
                },
                data: []
            },
            {
                name: '累计提车完成率',
                type: 'line',
                // barWidth: 13,
                label: {
                    show: true,
                    position: 'top',
                    formatter(params) {
                        return `${params.value}%`
                    }
                },
                yAxisIndex: 1,
                smooth: true,
                data: []
            }
        ]
    }
    const chartOption4 = {
        color: ['#5B8FF9', '#73DEB3', '#FD9707', '#E63752'],
        legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            data: [{
                name: '12月实销目标',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '12月实销',
                icon: 'rect'
            } ,{
                name: '12月实销完成率',
                // itemHeight: 13,
                itemWidth: 26,
                // icon: 'circle'
            }],

        },
        tooltip: {
            backgroundColor: '#ffffff',
            textStyle: {
                color: '#2781DB'
            },
            trigger: 'item',
            extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
            formatter: function (params) {
                if(params.seriesType === 'line'){
                    return `${params.seriesName} <br/>${params.name}: ${params.value}%`
                }else{
                    return `${params.seriesName} <br/>${params.name}: ${params.value}`
                }

            }
        },
        grid: {
            top: 70,
            left: 18,
            right: 18,
            bottom: 40,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
                // 刻度值
                interval: function(index, value) {
                    // 如果跳过则返回 false。
                    return true
                },
                textStyle: {
                    color: function(value, index) {
                        return '#999999'
                    }
                },
                showMaxLabel: true // 显示最后一个
            },
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                }
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            }
        },
        yAxis: [{
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                },
                show: false
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            }
        },{
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                },
                show: false
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            },
            axisLabel: {
                formatter: '{value}%'
            }
        }],
        series: [
            {
                name: '12月实销目标',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'left',
                    fontsize:10,
                },
                data: []
            },
            {
                name: '12月实销',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'right',
                    fontsize:10,
                },
                data: []
            },
            {
                name: '12月实销完成率',
                type: 'line',
                yAxisIndex:1,
                label: {
                    show: true,
                    position: 'top',
                    formatter(params) {
                        return `${params.value}%`
                    }
                },
                // barWidth: 13,
                smooth: true,
                data: []
            }
        ]
    }
    import echarts from 'echarts'
    import circularChart from "@/module/businessDashboard/components/circularChart";
    import networkSaleApi from '../../api/networkSaleApi'

    export default {
        data() {
            return {
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },
                chartId1: 'networkSaleRegionChart1',
                chartId2: 'networkSaleRegionChart2',
                chartId3: 'networkSaleRegionChart3',
                chartId4: 'networkSaleRegionChart4',

                 rank: '',        //排名号
                 rankDesc: '',        //排名升序号
                 year: '',                 //年
                 month: '',                //月
                 monthlyDate: '',                //分月日期
                 erpNumber: '', //ERP
                 dealerId: '',           //经销商id
                 dealerName: '',            //经销商名称
                 provinceName: '',                 //省份名称
                 cityName: '',                 //城市名称
                 largeArea: '',                 //大区
                 targetSales: 0,                 //目标实销
                 actualSalesNumber: 0,                 //实销数
                 carCompletionRate: 0,                 //提车完成率
                 salesCompletionRate: 0,                 //实销完成率
                 targetLift: 0,                 //目标提车
                 liftNumber: 0,                 //提车数
                 inventoryRatio: '',                 //库存
                 stockRate: '',                 //存销比

                //获取提车排名
                carCompletionRateHighest: {},  // 第一名
                carCompletionRateMinimum: {}, // 最后一名
                //获取实销排名
                salesCompletionRateHighest: {},  // 第一名
                salesCompletionRateMinimum: {}, // 最后一名
                //获取存销比排名  库存/实销数
                inventoryRatioHighest: {}, //   第一名
                inventoryRatioMinimum: {}, // 最后一名
            };
        },
        props:{
            date: {
                type: Object,
                required: true,
            },

        },
        watch:{
            date:{
                deep: true,
                handler(date){
                    console.log(date)
                    this.form.month = date.month
                    this.form.year = date.year
                    this.getLargeAreaStatistics()
                    this.getCarList()
                }
            },

        },
        created(){
            this.getLargeAreaStatistics()
            this.getCarList()
        },
        methods: {

            formatProgressValue(percentage){
                return Number(percentage).toFixed(0)
            },
            formatProgressRatioValue(percentage){
                return Number(percentage).toFixed(1)
            },

            resetChartSize() {
                this.chart.resize()
            },

            getLargeAreaStatistics(){
                networkSaleApi.getLargeAreaStatistics(this.form).then((data)=>{
                    if(data){
                        this.nk = data.vo.nk || ''
                        this.rankDesc = data.vo.rankDesc || ''
                        this.id = data.vo.id || ''
                        this.year = data.vo.year || ''
                        this.month = data.vo.month || ''
                        this.monthlyDate = data.vo.monthlyDate || ''
                        this.erpNumber = data.vo.erpNumber || ''
                        this.dealerId = data.vo.dealerId || ''
                        this.dealerName = data.vo.dealerName || ''
                        this.provinceName = data.vo.provinceName || ''
                        this.cityName = data.vo.cityName || ''
                        this.largeArea = data.vo.largeArea || ''
                        this.targetSales = data.vo.targetSales || 0
                        this.actualSalesNumber = data.vo.actualSalesNumber || 0
                        this.carCompletionRate = data.vo.carCompletionRate? data.vo.carCompletionRate/100: 0
                        this.salesCompletionRate = data.vo.salesCompletionRate ? data.vo.salesCompletionRate/100 : 0
                        this.targetLift = data.vo.targetLift || 0
                        this.liftNumber = data.vo.liftNumber || 0
                        this.inventoryRatio = data.vo.inventoryRatio || ''
                        this.stockRate = data.vo.stockRate || ''

                        //获取提车排名
                        this.carCompletionRateHighest = data.carCompletionRateHighest || {}  // 第一名
                        this.carCompletionRateMinimum = data.carCompletionRateMinimum || {} // 最后一名
                        //获取实销排名
                        this.salesCompletionRateHighest = data.salesCompletionRateHighest || {}  // 第一名
                        this.salesCompletionRateMinimum = data.salesCompletionRateMinimum || {} // 最后一名
                        //获取存销比排名  库存/实销数
                        this.inventoryRatioHighest = data.inventoryRatioHighest || {}  // 第一名
                        this.inventoryRatioMinimum = data.inventoryRatioMinimum || {} // 最后一名

                        this.$emit('change',{
                            updateUser: data.vo.updateUser || '',
                            updateTime: data.vo.updateTime || '',
                        })
                    }else{
                        this.$emit('change',{
                            updateUser:'',
                            updateTime: ''
                        })
                    }

                    if(data && data.list){

                    }
                })
            },

            getCarList(){
              networkSaleApi.getCarList(this.form).then((data)=>{
                  if(data){
                      this.setChartOptions(data)
                  }else{
                      this.setChartOptions([])
                  }
              })

            },

            setChartOptions(data){
                const yearXAxis = []
                const monthXAxis = []
                const pickCarTargetListOfMonth = []
                const pickCarNUmberListOfMonth = []
                const pickCarRatioListOfMonth = []

                const actualSalesTargetListOfMonth = []
                const actualSalesNUmberListOfMonth = []
                const actualSalesRatioListOfMonth = []

                const pickCarTargetListOfYear = []
                const pickCarNUmberListOfYear = []
                const pickCarRatioListOfYear = []

                const actualSalesTargetListOfYear = []
                const actualSalesNUmberListOfYear= []
                const actualSalesRatioListOfYear = []

                data.yearRanking.forEach(item=>{
                    yearXAxis.push(item.largeArea)
                    pickCarTargetListOfYear.push(item.targetLift)
                    pickCarNUmberListOfYear.push(item.liftNumber)
                    pickCarRatioListOfYear.push(item.carCompletionRate)
                    actualSalesTargetListOfYear.push(item.targetSales)
                    actualSalesNUmberListOfYear.push(item.actualSalesNumber)
                    actualSalesRatioListOfYear.push(item.salesCompletionRate)
                })
                data.monthRanking.forEach(item=>{
                    monthXAxis.push(item.largeArea)
                    pickCarTargetListOfMonth.push(item.targetLift)
                    pickCarNUmberListOfMonth.push(item.liftNumber)
                    pickCarRatioListOfMonth.push(item.carCompletionRate)
                    actualSalesTargetListOfMonth.push(item.targetSales)
                    actualSalesNUmberListOfMonth.push(item.actualSalesNumber)
                    actualSalesRatioListOfMonth.push(item.salesCompletionRate)
                })


                chartOption1.xAxis.data = yearXAxis
                chartOption1.series[0].data = pickCarTargetListOfYear
                chartOption1.series[1].data = pickCarNUmberListOfYear
                chartOption1.series[2].data = pickCarRatioListOfYear

                chartOption2.xAxis.data = monthXAxis
                chartOption2.series[0].data = pickCarTargetListOfMonth
                chartOption2.series[1].data = pickCarNUmberListOfMonth
                chartOption2.series[2].data = pickCarRatioListOfMonth

                chartOption3.xAxis.data = yearXAxis
                chartOption3.series[0].data = actualSalesTargetListOfYear
                chartOption3.series[1].data = actualSalesNUmberListOfYear
                chartOption3.series[2].data = actualSalesRatioListOfYear

                chartOption4.xAxis.data = monthXAxis
                chartOption4.series[0].data = actualSalesTargetListOfMonth
                chartOption4.series[1].data = actualSalesNUmberListOfMonth
                chartOption4.series[2].data = actualSalesRatioListOfMonth


                chartOption1.legend.data[0].name = `1-${this.form.month!==1?this.form.month:''}月提车目标`
                chartOption1.legend.data[1].name = `1-${this.form.month!==1?this.form.month:''}月提车`
                chartOption1.legend.data[2].name = `1-${this.form.month!==1?this.form.month:''}月提车完成率`

                chartOption1.series[0].name = `1-${this.form.month!==1?this.form.month:''}月提车目标`
                chartOption1.series[1].name = `1-${this.form.month!==1?this.form.month:''}月提车`
                chartOption1.series[2].name = `1-${this.form.month!==1?this.form.month:''}月提车完成率`

                chartOption2.legend.data[0].name = `${this.form.month}月提车目标`
                chartOption2.legend.data[1].name = `${this.form.month}月提车`
                chartOption2.legend.data[2].name = `${this.form.month}月提车完成率`

                chartOption2.series[0].name = `${this.form.month}月提车目标`
                chartOption2.series[1].name = `${this.form.month}月提车`
                chartOption2.series[2].name = `${this.form.month}月提车完成率`


                chartOption3.legend.data[0].name = `1-${this.form.month!==1?this.form.month:''}月实销目标`
                chartOption3.legend.data[1].name = `1-${this.form.month!==1?this.form.month:''}月实销`
                chartOption3.legend.data[2].name = `1-${this.form.month!==1?this.form.month:''}月实销完成率`

                chartOption3.series[0].name = `1-${this.form.month!==1?this.form.month:''}月实销目标`
                chartOption3.series[1].name = `1-${this.form.month!==1?this.form.month:''}月实销`
                chartOption3.series[2].name = `1-${this.form.month!==1?this.form.month:''}月实销完成率`

                chartOption4.legend.data[0].name = `${this.form.month}月实销目标`
                chartOption4.legend.data[1].name = `${this.form.month}月实销`
                chartOption4.legend.data[2].name = `${this.form.month}月实销完成率`

                chartOption4.series[0].name = `${this.form.month}月实销目标`
                chartOption4.series[1].name = `${this.form.month}月实销`
                chartOption4.series[2].name = `${this.form.month}月实销完成率`

                this.chart1.setOption(chartOption1)
                this.chart2.setOption(chartOption2)
                this.chart3.setOption(chartOption3)
                this.chart4.setOption(chartOption4)
                console.log(chartOption1)
            },

            resetChartSize() {
                this.chart1.resize()
                this.chart2.resize()
                this.chart3.resize()
                this.chart4.resize()
            },


        },
        components: {
            circularChart
        },
        mounted() {
            this.chart1 = echarts.init(document.getElementById(this.chartId1));
            this.chart1.setOption(chartOption1)

            this.chart2 = echarts.init(document.getElementById(this.chartId2));
            this.chart2.setOption(chartOption2)

            this.chart3 = echarts.init(document.getElementById(this.chartId3));
            this.chart3.setOption(chartOption3)

            this.chart4 = echarts.init(document.getElementById(this.chartId4));
            this.chart4.setOption(chartOption4)
            window.addEventListener('resize', this.resetChartSize)
        },
    }
</script>

<style lang="scss" scoped>
  @import '~@/module/businessDashboard/scss/common/board.scss';
  .region{



    .situation{
      padding-top: 24px;
    }
      .situation__item{
        height: 66px;
        display: flex;
        padding-left: 24px;
        padding-right: 37px;
        margin-bottom: 33px;
        align-items: flex-end;
        justify-content: space-between;
        .situation__item__data__value{
          margin-right: auto;
          height:31px;
          font-size:24px;
          font-weight:bold;
          line-height: 30px;
          color:rgba(51,51,51,1);
          .yellow{
            color: #FD9707;
          }
          .red{
            color: #E63752;
          }
        }
        .situation__item__data__label{
          height:19px;
          font-size:14px;
          font-weight:400;
          line-height:19px;
          color:rgba(102,102,102,1);
          margin-top: 6px;
        }
        .situation__item__dashboard{
          width:120px;
          height:66px;
        }
      }

    .ranking{
      padding: 0 24px;
      .ranking__item{
        padding: 16px 0;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E6E6E6;
      }
      .ranking__item__label{
        flex-basis: 56px;
      }
      .ranking__item__chart{
        flex-grow: 1;
        & /deep/{
          .el-progress-bar__outer, .el-progress-bar__inner{
            border-radius: 0;
          }
        }
        & /deep/{
          .el-progress.el-progress--line{
            white-space: nowrap;
          }
        }
      }
      .ranking__item__chart__highest, .ranking__item__chart__lowest{
        display: flex;
        align-items: center;
        .ranking__item__chart__lowest__label, .ranking__item__chart__highest__label{
          flex-basis: 108px;
          font-size:14px;
          font-weight:400;
          line-height:24px;
        }
        .ranking__item__chart__highest__bar, .ranking__item__chart__lowest__bar{
          flex-grow: 1;
        }
      }

    }
  }
  .networkSaleRegionChart{
    height: 520px;
    margin-bottom: 20px;
  }
  .chart-wrapper{
    background: rgba(247, 247, 247, 1);
    position: relative;
  }
  .chart-title{
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%,0);
    z-index: 10;
    height:31px;
    font-size:24px;
    font-weight:400;
    line-height:21px;
    color:rgba(51,51,51,1);
  }
</style>

