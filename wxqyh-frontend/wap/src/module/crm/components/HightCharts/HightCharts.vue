<!--
    数据列表组件
    @param id(必传):列表头部数据
    @param option(必传):列表头部数据

    注意：要等option拼接完才能触发inintChart()

    用法：
    <parent>
      <chart id="xxx" :option="xxx" ref="xxx"></chart>
    </parent>
 -->
<template>
  <div class="x-bar">
        <div
            :id="id"
            :option="option"
            :style="{'max-width': chartMaxWidth? `${chartMaxWidth}px`: 'auto', height: `${chartHeight}px`}"
        ></div>
  </div>
</template>
<script>
import HighCharts from 'highcharts/highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import HighchartsFunnel from 'highcharts/modules/funnel';
import Highcharts3D from 'highcharts/highcharts-3d';
HighchartsMore(HighCharts)
HighchartsDrilldown(HighCharts);
HighchartsFunnel(HighCharts);
Highcharts3D(HighCharts);
export default{
    props: {
        id: {
            type: String
        },
        option: {
            type: Object
        },
        func: {
            type: Function
        },
        chartHeight: {
            type: Number,
            default: 250
        },
        chartMaxWidth: {
            type: Number
        }
    },
    watch: {
        // option: function(newVal, oldVal){
        //     HighCharts.chart(this.id, newVal, this.func);
        // }
        option:{
            handler:function(newVal){
                HighCharts.chart(this.id, newVal, this.func);
            },
        }
    },
    methods: {
         //  初始化hightCharts
        inintChart(){
             HighCharts.chart(this.id,this.option,this.func);
        }
    }
}
</script>
<style scoped>
    /* .x-bar {
        overflow: auto;
        border: 1px solid；
    } */
</style>

