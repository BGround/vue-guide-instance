<template>
  <div class="region">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card">
          <div class="situation">
            <div class="situation__item">
              <div class="situation__item__data">

                <div class="situation__item__value">{{monthlyNetworkSize}}</div>
                <div class="situation__item__label">当前规模</div>
                <div class="situation__item__title">年度目标: <b>{{yearTarget}}</b></div>

              </div>
              <div class="situation__item__dashboard">
                <el-progress color="#5B8FF9" :show-text="false" :width="140" :stroke-width="16" stroke-linecap="square" type="circle" :percentage="normalizePercent(calculation)"></el-progress>
                <div class="progress-text">
                  <p class="progress-text__label">完成率</p>
                  <p class="progress-text__value">{{calculation}}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="board__card mt16">
          <div class="situation">
            <div class="situation__item">
              <div class="situation__item__data">

                <div class="situation__item__value green">{{developComplete}}</div>
                <div class="situation__item__label">当年开发完成</div>
                <div class="situation__item__title">年度目标: <b>{{developObj}}</b></div>

              </div>
              <div class="situation__item__dashboard">
                <el-progress color="#73DEB3" :show-text="false" :width="140" :stroke-width="16" stroke-linecap="square" type="circle" :percentage="normalizePercent(developmentRate)"></el-progress>
                <div class="progress-text">
                  <p class="progress-text__label">年度完成率</p>
                  <p class="progress-text__value">{{developmentRate}}%</p>
                </div>
              </div>
            </div>




            <div class="situation__item mt16">
              <div class="situation__item__data">

                <div class="situation__item__value green">{{thisMonthDevelopComplete}}</div>
                <div class="situation__item__label">当月开发完成</div>
                <div class="situation__item__title">月度目标: <b>{{thisMonthDevelopObj}}</b></div>

              </div>
              <div class="situation__item__dashboard">
                <el-progress color="#73DEB3" :show-text="false" :width="140" :stroke-width="16" stroke-linecap="square" type="circle" :percentage="normalizePercent(thisMonthDevelopRate)"></el-progress>
                <div class="progress-text">
                  <p class="progress-text__label">月度完成率</p>
                  <p class="progress-text__value">{{thisMonthDevelopRate}}%</p>
                </div>
              </div>
            </div>

           
          </div>
        </div>

        <div class="board__card mt16">
          <div class="situation">

            <div class="situation__item">
              <div class="situation__item__data">

                <div class="situation__item__value green">{{buildComplete}}</div>
                <div class="situation__item__label">当年建设完成</div>
                <div class="situation__item__title">年度目标: <b>{{buildObj}}</b></div>

              </div>
              <div class="situation__item__dashboard">
                <el-progress color="#73DEB3" :show-text="false" :width="140" :stroke-width="16" stroke-linecap="square" type="circle" :percentage="normalizePercent(buildRate)"></el-progress>
                <div class="progress-text">
                  <p class="progress-text__label">年度完成率</p>
                  <p class="progress-text__value">{{buildRate}}%</p>
                </div>
              </div>
            </div>


            <div class="situation__item mt16">
              <div class="situation__item__data">

                <div class="situation__item__value green">{{thisMonthBuildComplete}}</div>
                <div class="situation__item__label">当月建设完成</div>
                <div class="situation__item__title">月度目标: <b>{{thisMonthBuildObj}}</b></div>

              </div>
              <div class="situation__item__dashboard">
                <el-progress color="#73DEB3" :show-text="false" :width="140" :stroke-width="16" stroke-linecap="square" type="circle" :percentage="normalizePercent(thisMonthBuildRate)"></el-progress>
                <div class="progress-text">
                  <p class="progress-text__label">月度完成率</p>
                  <p class="progress-text__value">{{thisMonthBuildRate}}%</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="board__card mt16">
          <div class="situation">
            <div class="situation__title">异常退出</div>
            <div class="situation__value">{{annualNetworkWithdrawal}}</div>
            <div class="situation__label">数量</div>
          </div>
        </div>


      </div>

      <div class="board__content__right">
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="networkSaleRegionChart1"></div>
          <div class="chart-title">当前规模</div>
        </div>
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="networkSaleRegionChart2"></div>
          <div class="chart-title">开发完成</div>
        </div>
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="networkSaleRegionChart3"></div>
          <div class="chart-title">建设完成</div>
        </div>
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="networkSaleRegionChart4"></div>
          <div class="chart-title">分月退网</div>
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
                name: '目标',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '完成',
                icon: 'rect'
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
                name: '目标',
                type: 'bar',
                barWidth: 13,
                data: [],
                label: {
                    show: true,
                    position: 'top',
                    fontsize:10,
                },
            },
            {
                name: '完成',
                type: 'bar',
                barWidth: 13,
                data: [],
                label: {
                    show: true,
                    position: 'top',
                    fontsize:10,
                },
            }
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
                name: '目标',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '完成',
                icon: 'rect'
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
                name: '目标',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'top',
                    fontsize:10,
                },
                data: []
            },
            {
                name: '完成',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'top',
                    fontsize:10,
                },
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
                name: '目标',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '完成',
                icon: 'rect'
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
                name: '目标',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'top',
                    fontsize:10,
                },
                data: []
            },
            {
                name: '完成',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'top',
                    fontsize:10,
                },
                data: []
            }

        ]
    }
    const chartOption4 = {
        color: ['#C31725', '#5B8FF9', '#73DEB3', '#FD9707', '#E63752'],
        legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            data: [{
                name: '退网',
                backgroundColor: '#ffffff',
                icon: 'rect'
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
                name: '退网',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'top',
                    fontsize:10,
                },
                data: []
            }
        ]
    }
    import echarts from 'echarts'
    import circularChart from "@/module/businessDashboard/components/circularChart";
    import getData from '../../api/getData'

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

                yearTarget: 0, //	当前规模-年度目标
                monthlyNetworkSize: 0, //	当前规模-完成情况
                calculation: 0, //	当前规模-完成率
                developComplete: 0, //	开发完成-当年开发完成
                developObj: 0, //	开发完成-年度目标
                developmentRate: 0, //	开发完成-年度完成率
                thisMonthDevelopComplete: 0, //	开发完成-当月开发完成
                thisMonthDevelopObj: 0, //	开发完成-月度目标
                thisMonthDevelopRate: 0, //	开发完成-月度完成率

                buildComplete: 0, //	建设完成-当年建设完成
                buildObj: 0, //	建设完成-年度目标
                buildRate: 0, //	建设完成-完成率
                thisMonthBuildComplete: 0, //	建设完成-当月建设完成
                thisMonthBuildObj: 0, //	建设完成-月度目标
                thisMonthBuildRate: 0, //	建设完成-月度完成率
                annualNetworkWithdrawal: 0, //	异常退出
                yearCountList	: [], //	图表
                yearScaleCountList: [],
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
                    this.getTwoProgressNetworkPlanning();
                }
            },

        },
        created(){
            this.getTwoProgressNetworkPlanning();

        },
        methods: {

            normalizePercent(value){
                return  value > 100? 100: value;
            },

            formatProgressValue(percentage){
                return Number(percentage).toFixed(0)
            },
            formatProgressRatioValue(percentage){
                return Number(percentage).toFixed(1)
            },

            resetChartSize() {
                this.chart.resize()
            },


            getTwoProgressNetworkPlanning(){
                getData.getTwoProgressNetworkPlanning(this.form).then((data)=>{
                    this.yearTarget = data && data.yearTarget? data.yearTarget : 0; //	当前规模-年度目标
                    this.monthlyNetworkSize = data && data.monthlyNetworkSize? data.monthlyNetworkSize : 0; //	当前规模-完成情况
                    this.calculation = data && data.calculation? data.calculation : 0; //	当前规模-完成率
                    this.developComplete = data && data.developComplete? data.developComplete : 0; //	开发完成-当年开发完成
                    this.developObj = data && data.developObj? data.developObj : 0; //	开发完成-年度目标
                    this.developmentRate = data && data.developmentRate? data.developmentRate : 0; //	开发完成-年度完成率
                    this.thisMonthDevelopComplete = data && data.thisMonthDevelopComplete? data.thisMonthDevelopComplete : 0; //	开发完成-当月开发完成
                    this.thisMonthDevelopObj = data && data.thisMonthDevelopObj? data.thisMonthDevelopObj : 0; //	开发完成-月度目标
                    this.thisMonthDevelopRate = data && data.thisMonthDevelopRate? data.thisMonthDevelopRate : 0; //	开发完成-月度完成率

                    this.buildComplete = data && data.buildComplete? data.buildComplete : 0; //	建设完成-当年建设完成
                    this.buildObj = data && data.buildObj? data.buildObj : 0; //	建设完成-年度目标
                    this.buildRate = data && data.buildRate? data.buildRate : 0; //	建设完成-年度完成率
                    this.thisMonthBuildComplete = data && data.thisMonthBuildComplete? data.thisMonthBuildComplete : 0; //	建设完成-当月建设完成
                    this.thisMonthBuildObj = data && data.thisMonthBuildObj? data.thisMonthBuildObj : 0; //	建设完成-月度目标
                    this.thisMonthBuildRate = data && data.thisMonthBuildRate? data.thisMonthBuildRate : 0; //	建设完成-月度完成率

                    this.annualNetworkWithdrawal = data && data.annualNetworkWithdrawal? data.annualNetworkWithdrawal : 0; //	异常退出
                    this.yearCountList = data && data.yearCountList? data.yearCountList : []; //	图表
                    this.yearScaleCountList = data && data.yearScaleCountList? data.yearScaleCountList: [];
                    this.setChartOptions(this.yearCountList, this.yearScaleCountList)
                })
            },

            setChartOptions(yearCountList, yearScaleCountList){
                const monthList = [1,2,3,4,5,6,7,8,9,10,11,12];

                const xAxisData = [];

                const targetDataOfNetworkSize = [];
                const completeDataOfNetworkSize = [];
                const targetDataOfDev = [];
                const completeDataOfDev = [];
                const targetDataOfBuilding = [];
                const completeDataOfBuilding =[];
                const exitNetwork = [];



                monthList.forEach((month)=>{
                    xAxisData.push(`${month}月`);
                    const item = yearCountList.find(item=>parseInt(item.month) === month);
                    if(item){
                        targetDataOfDev.push(item.developObj);
                        completeDataOfDev.push(item.developComplete);
                        targetDataOfBuilding.push(item.buildObj);
                        completeDataOfBuilding.push(item.buildComplete);
                        exitNetwork.push(item.exitNetworkNum);
                    }else{
                        targetDataOfDev.push('');
                        completeDataOfDev.push('');
                        targetDataOfBuilding.push('');
                        completeDataOfBuilding.push('');
                        exitNetwork.push('');
                    }
                })

                monthList.forEach((month)=>{
                    const item = yearScaleCountList.find(item=> parseInt(item.month) === month);
                    if(item){
                        console.log(item.target)
                        console.log(item.completion)
                        targetDataOfNetworkSize.push(item.target);
                        completeDataOfNetworkSize.push(item.completion);
                    }else{
                        targetDataOfNetworkSize.push('');
                        completeDataOfNetworkSize.push('');
                    }
                })


                chartOption1.xAxis.data = xAxisData;
                chartOption2.xAxis.data = xAxisData;
                chartOption3.xAxis.data = xAxisData;
                chartOption4.xAxis.data = xAxisData;

                chartOption1.series[0].data = targetDataOfNetworkSize;
                chartOption1.series[1].data = completeDataOfNetworkSize;
                chartOption2.series[0].data = targetDataOfDev;
                chartOption2.series[1].data = completeDataOfDev;
                chartOption3.series[0].data = targetDataOfBuilding;
                chartOption3.series[1].data = completeDataOfBuilding;
                chartOption4.series[0].data = exitNetwork;

                this.chart1.setOption(chartOption1)
                this.chart2.setOption(chartOption2)
                this.chart3.setOption(chartOption3)
                this.chart4.setOption(chartOption4)

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
  @import '../../scss/common/board.scss';
  .region{



    .situation{
      padding-top: 24px;
      margin-bottom: 24px;
    }

    .situation__title{
      text-align: center;
      height:26px;
      font-size:20px;
      font-weight:400;
      line-height:26px;
      color:rgba(51,51,51,1);
      margin-top: 3px;
    }
    .situation__value{
      text-align: center;
      height:42px;
      font-size:32px;
      font-weight:bold;
      line-height:42px;
      width: 130px;
      margin: 23px auto 0;
      color:rgba(195,23,37,1);
      border-bottom: 1px solid #E6E6E6;
    }
    .situation__label{
      text-align: center;
      height:19px;
      font-size:14px;
      margin-top: 5px;
      font-weight:400;
      line-height:19px;
      color:rgba(102,102,102,1);
      padding-bottom: 22px;
    }
      .situation__item{
        display: flex;
        height: 144px;
        padding-left: 24px;
        padding-right: 37px;
        align-items: center;
        justify-content: space-between;


        .situation__item__data{
          text-align: center;
          width: 130px;
          .situation__item__value{
            height:42px;
            font-size:32px;
            font-weight:bold;
            line-height:42px;
            color:rgba(91,143,249,1);
            margin-bottom: 4px;
            text-align: center;
            &.green{
              color: #73DEB3;
            }
          }
          .situation__item__title{
            height:20px;
            font-size:14px;
            font-weight:400;
            line-height:20px;
            color:rgba(102,102,102,1);
            padding-top: 16px;
            border-top: 1px solid #E6E6E6;
          }
          .situation__item__label{
            height:19px;
            font-size:14px;
            font-weight:400;
            line-height:19px;
            color:rgba(102,102,102,1);
            padding-bottom: 17px;
          }
        }

        .situation__item__dashboard{
          width:144px;
          height:144px;
          flex-basis: 144px;
          position: relative;
        }
        .progress-text{
          position: absolute;
          left: 50%;
          top:50%;
          transform: translate(-50%, -50%);
          .progress-text__label{
            text-align: center;
            height:19px;
            font-size:14px;
            font-weight:400;
            line-height:19px;
            color:rgba(102,102,102,1);
            margin-bottom: 2px;
          }
          .progress-text__value{
            text-align: center;
            height:26px;
            font-size:20px;
            font-weight:bold;
            line-height:26px;
            color:rgba(51,51,51,1);
          }
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

