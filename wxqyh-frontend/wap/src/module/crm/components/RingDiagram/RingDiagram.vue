/** 
    @params id(必传)：环形图id
    @params innerSize(默认:85%)：环形图内部区域大小
    @params chartData(必传)：环形图数据
    chartData: [
        {
            name:'finish',   
            y: 45.0,
            color: '#528BDB'
        },
        {
            name: 'unfinish',
            y: 55.0,
            color: '#EFEFEF'
        }
    ]
    @params chartSize(默认:120%)：环形图大小
    @params chartHeight(默认:170)：图标高度
    @exmpale
        <parent>
            <ring-diagram v-bind="ringCharts"></ring-diagram>
        </parent>
*/
<template>
    <div>
        <hight-charts 
            :id="id" 
            :option="option" 
            :chartHeight="chartHeight"
            :chartMaxWidth="chartMaxWidth"
            ref="ringCharts"
        ></hight-charts>
    </div>
</template>
<script>
import HightCharts from '../HightCharts/HightCharts';

export default {
    name: 'RingDiagram',
    components: {
        HightCharts
    },
    props: {
        // 环形图id
        id: {
            type: String,
            required: true
        },

        // 环形图内部区域大小
        innerSize: {
            type: String,
            default: '85%'
        },

        // 环形图数据
        chartData: {
            type: Array,
            required: true
        },

        // 环形图大小
        chartSize: {
            type: String,
            default: '120%'
        },

        // 图表高度
        chartHeight: {
            type: Number,
            default: 170
        },

        // 图表最大宽度
        chartMaxWidth: {
            type: Number
        }

    },
    data () {
        return { }
    },
    computed: {
        option () {  // 环形图配置
            return {
                credits: {
                    enabled:false
                },
                title: {
                    text: ''	
                },
                tooltip: {
                    enabled: false	
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: false
                        },
                        size: this.chartSize
                    }
                },
                series: [{
                    type: 'pie',
                    innerSize: this.innerSize,
                    data: this.chartData
                }]
            }
        }      
    },
    watch: {
        option (newVal) {
            this.$refs.ringCharts.inintChart();
        }
    },
    mounted () {
        this.$refs.ringCharts.inintChart();
    },
    methods: {}
}
</script>
<style lang='scss' scoped>

</style>