<template>
  <div class="column">
    <div class="canvas" :id="'column'+itemKey"></div>
  </div>
</template>
<script>
  import HighCharts from 'highcharts'
  export default {
    name: "columnar",
    props:{
      data:{
        type:Array
      },
      itemKey:{
        type:String
      }
    },
    data(){
      return {
        chart: ''
      }
    },
    mounted(){
      this.renderData();
    },
    methods:{
      renderData(){
        var data = this.data
          ,dataX = []
          ,xAxis = []
          ,id = 'column'+this.itemKey;
        for(let i=0;i<data.length;i++){
          let itemX = {name:'',y:null}
          itemX.y = data[i].percent;
          itemX.name = data[i].name;
          dataX.push(itemX);
          xAxis.push(data[i].name)
        }
        var chart = HighCharts.chart(id, {
          chart: {
            type:'column',
          },
          title:{
            text: ''
          },
          credits: {
            enabled:false
          },
          tooltip:{
            headerFormat: null,
            formatter: function(){
              var data = this.series.data;
              var total = 0;
              var percentage = 0;
              var length = this.point.name.length;
              for(var i = 0;i<data.length;i++){
                total += data[i].y;
              }
              if(total != 0){
                percentage = this.y/total*100;
              }
              if(length>30){
                return '<span>' + this.point.name.substring(0,29) + '</span><br>' +
                  this.point.name.substring(29,length-1)+'：'+
                  percentage.toFixed(2) + '%';
              }else{
                return '<span>' + this.point.name + '</span>'+'：'+percentage.toFixed(2) + '%';
              }
            },
            backgroundColor: '#5E5E5E',
            borderRadius: 4,
            borderWidth: 0,
            padding: 5,
            style: {
              color: '#fff',
              fontSize: '12px'
            },
            borderWidth: '',
            useHTML: false,
            shadow: false
          },
          colors: ['#5585F0'],
          xAxis: {
            categories: xAxis,
            tickLength: 0,
            lineWidth: 0
          },
          yAxis: {
            gridLineDashStyle: 'dash',
            gridLineColor: '#E3E4E8',
            allowDecimals: false,
            title: false,
          },
          series: [{
            showInLegend: false,
            minPointLength: 3,
            animation: {
              duration: 500
            },
            data: dataX
          }],
        })
        this.chart = chart;
      }
    },
    watch:{
      data(){
        this.chart.destroy()
        this.renderData()
      }
    }
  }
</script>
<style scoped>
  .column{
    margin: 0 auto;
    width: 100%;
  }
  .canvas {
    display: block;
    width: 100%;
    min-height:224px;
  }
</style>
