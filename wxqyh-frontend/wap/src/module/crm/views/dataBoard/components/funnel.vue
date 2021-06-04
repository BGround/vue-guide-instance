/**
    @params id(必传)：环形图id
    @params chartData(必传)：漏斗图数据
    chartData:
    [
        ['初步交流',12],
        ['需求沟通', 35.07],
        ['商务交通', 75.38],
        ['签约交款',43],
        ['商务失败',123.56]
    ]
    @exmpale
        <parent>
            <funnel v-bind="funnelCharts"></funnel>
        </parent>
*/
<template>
    <div>
        <hight-charts
            id="funnelId"
            :option="option"
            ref="funnelCharts"
        ></hight-charts>
    </div>
</template>
<script>
import HightCharts from '../../../components/HightCharts/HightCharts';
export default {
    name: 'funnel',
    components: {
        HightCharts,
    },
    props: {
        // 漏斗数据
       chartData: {
            type: Array,
            required: true
        },
        neckWidth: {
            type: String,
            default: ''
        },
        neckHeight: {
            type: String,
            default: ''
        },
        format: {
            type: String,
            default: '<b>{point.name}</b>({point.y:,.0f})'
        },
        center:{
            type: Array,
            defalut: []
        },
    },
    data () {
        return { }
    },
    computed: {
        option() {
            return {  // 漏斗图配置
                chart: {
                    type: 'funnel',
                    marginRight: 135,
                },
                title: {
			        text: '',
		        },
                 credits: {
                     enabled:false
                 },
                tooltip: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        // minPointLength: 300,
                        dataLabels: {
                            enabled: true,
                            format: this.format,
                            // format: '<b>{point.name}</b><p>12</p>({point.y:,.0f}万)',
                            color: '#666',
                            softConnector: true,
                            crop: false,
                        },
                        	neckWidth: '40%',
				            neckHeight: '15%',
                        events: { 
                            click:(e) => {
                                this.$emit('clickFunnel',e.point) 
                            } 
                        } 
                    },
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'funnel',
                    data: this.chartData
                }]
            }
         }
    },
    create(){
    },
    watch: {
        option (newVal) {
            this.$refs.funnelCharts.inintChart();
        }
    },
    mounted () {
        this.$refs.funnelCharts.inintChart();
    },
    methods: {}
}
</script>
<style lang='scss' scoped>

</style>
