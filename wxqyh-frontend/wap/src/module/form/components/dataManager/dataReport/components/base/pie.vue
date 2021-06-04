<template>
  <div class="Pie">
    <div class="canvas" :id="'pie'+itemKey"></div>
  </div>
</template>
<script>
  import HighCharts from 'highcharts'
  export default{
    name:'pie',
    props:{
      data:{
        type:Array
      },
      itemKey:{
        type:String
      }
    },
    data(){
      return{
        chart: ''
      }
    },
    mounted(){
      this.renderData()
    },
    methods:{
      renderData(){
        var data = this.data
          ,dataX = []
          ,id = 'pie'+this.itemKey;
          for(let i=0;i<data.length;i++){
            let itemX = {name:'',y:null}
            itemX.y = data[i].percent;
            itemX.name = data[i].name;
            dataX.push(itemX);
          }
        var chart = HighCharts.chart(id, {
          chart: {
            spacing : [20, 0, 20, 0]
          },
          colors: ["#ffac36","#4dc0f6","#ff7466","#7186de","#f45b5b","#b574e6","#65ddd3","#a7878d","#4ba4ce","#c68e65","#e36cea","#f4d12f","#acd145","#5fd35f","#2aa6a5"],
          title: {
            floating:true,
            text: ''
          },
          tooltip: {
            enabled: true,
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
            useHTML: true,
            padding: 5,
            percentageDecimals: 1
          },
          credits: {
            enabled:false,
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false,
              },
              showInLegend: true,
            }
          },
          series: [{
            type: 'pie',
            allowPointSelect: true,
            innerSize: '70%',
            data: dataX,
            states:{
              hover:{
                enabled:false,
              }
            }
          }],
          legend:{
            align: 'center',
            layout: 'horizontal',
            itemMarginTop: 8,
            symbolHeight: 10,
            itemDistance: 10,
            symbolPadding: 3,
            navigation: {
              enabled: true,
              arrowSize: 15,
              activeColor: '#5585F0',
              style: {
                color: '#7A7D80'
              }
            },
            itemStyle: {
              color: '#7A7D80',
              fontSize: '13px',
              fontWeight: 'normal',
              fontFamily: "Microsoft YaHei"
            },
            labelFormatter: function () {
              if(this.name.length>6){
                return this.name.substring(0,6) + '...' ;
              }else{
                return this.name ;
              }
            }
          },
        }, function(c) { // 图表初始化完毕后的会掉函数
          var centerY = c.series[0].center[1];
          // 标题字体大小，返回类似 16px ，所以需要 parseInt 处理
          var titleHeight = parseInt(c.title.styles.fontSize)
          // 设置图表偏移
          c.setTitle({
            y: (centerY + titleHeight/2)-5
          });
        });
        this.chart = chart;
      }
    },
    watch:{
      data(){
        this.chart.destroy();
        this.renderData()
      }
    }
  }
</script>
<style scoped>
  .Pie{
    margin: 0 auto;
  }
  .canvas {
    width: 100%;
    min-height: 300px;
  }
</style>
