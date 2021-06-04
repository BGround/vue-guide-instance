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
    <div :id="id"
    :option="option"></div>
  </div>
</template>
<script>
import HighCharts from 'highcharts'
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    option: {
      type: Object,
      required: true
    }
  },
  watch: {
    option: function(newVal,oldVal){
      HighCharts.chart(this.id,newVal);
    }
  },
  methods: {
      //  初始化hightCharts
      inintChart(){
          HighCharts.chart(this.id,this.option);
      }
  }
}
</script>