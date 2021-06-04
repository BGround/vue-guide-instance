<template>
  <div id="salesVolumeTrend"></div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        data() {
            return {}
        },
        props:{
            columnsSx:{
                type: Array
            },
            columnsTc:{
                type: Array
            },
            columnsCxb:{
                type: Array
            },
            columnsMonth:{
                type: Array
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init() {
                let dom = document.getElementById('salesVolumeTrend')
                let myChart = echarts.init(dom)
                let option = {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter(params){
                            const html = params.map((item)=>{
                                const span = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`
                                if(item.seriesName.indexOf('率') !== -1){
                                    return `${span} ${item.name} ${item.seriesName} ${item.value}%`
                                }else{
                                    return `${span} ${item.name} ${item.seriesName} ${item.value}`
                                }
                            } ).join('<br>')
                            return html
                        }
                    },
                    legend: {
                        data:['实销完成率','提车完成率','存销比'],
                        x:'center',
                        y:'bottom'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        top:'30%',
                        bottom: '12%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.columnsMonth
                    },
                    yAxis: [{
                        type: 'value'
                    },{
                         type: 'value',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }],
                    series: [
                        {
                            name:'实销完成率',
                            type:'line',
                            yAxisIndex:1,
                            label: {
                                // show: true,
                                position: 'top',
                                formatter(params) {
                                    return `${params.value}%`;
                                }
                            },
                            data:this.columnsSx
                        },
                        {
                            name:'提车完成率',
                            type:'line',
                            yAxisIndex:1,
                            label: {
                                // show: true,
                                position: 'top',
                                formatter(params) {
                                    return `${params.value}%`;
                                }
                            },
                            data:this.columnsTc
                        },
                        {
                            name:'存销比',
                            type:'line',
                            data:this.columnsCxb
                        }
                    ]
                };
                myChart.setOption(option)
            }
        }
    }
</script>
