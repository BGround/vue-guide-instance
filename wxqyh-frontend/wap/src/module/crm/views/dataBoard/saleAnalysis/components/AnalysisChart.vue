<template>
  <div class="analysis-chart"
       style=" height: 200px"></div>
</template>

<script>
import Highcharts from "highcharts/highstock";
// import HighchartsMore from 'highcharts/highcharts-more';
// import HighchartsDrilldown from 'highcharts/modules/drilldown';
// import Highcharts3D from 'highcharts/highcharts-3d';
// HighchartsMore(Highcharts)
// HighchartsDrilldown(Highcharts);
// Highcharts3D(Highcharts);

export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  name: "analysisChart",
  data() {
    return {
      chart: null,
      options: {
        chart: {
          type: "column", //指定图表的类型，默认是折线图（line）
          // spacing: [25, 15, 10, 15],
          panning: true,
          pinchType: "x",
          resetZoomButton: {
            position: {
              y: -1000
            }
          }
        },
        title: {
          text: null // 标题
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        tooltip: {
          followTouchMove: false,
          shape: "callout",
          formatter: function() {
            return this.y;
          }
        },
        plotOptions: {
          series: {
            color: "#468CEB",
            borderRadius: "5px"
          },
          column: {
            pointWidth: "8"
          }
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          title: { text: null },
          maxPadding: 0.3
        },
        series: [
          {
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      let X = this.list.map(o => {
        return o.x;
      });

      let Y = this.list.map(o => {
        return o.y;
      });

      this.options.xAxis.categories = X;
      this.options.series[0].data = Y;
      // this.options.yAxis.max = Math.ceil(Math.max.apply(Math, Y));
      // let min = Math.floor(Math.min.apply(Math, Y) - 1);
      // this.options.yAxis.min = min > 0 ? min : 0;
      this.chart = new Highcharts.Chart(this.$el, this.options);
      // this.chart = new Highcharts.Chart(this.$el, this.options, c => {
      //   let max = this.showGrace(this.list.length) - 1;
      //   c.xAxis[0].setExtremes(0, max);
      // });
    }
    // showGrace(grace) {
    //   let graceForLevel = [12, 7, 3];
    //   let levelText = [grace, 12, 7, 3];
    //   for (let i = 0; i < graceForLevel.length; i++) {
    //     if (grace > graceForLevel[i]) {
    //       return levelText[i];
    //     }
    //   }
    //   //如果不存在，那么就是分数很低，返回最后一个
    //   return levelText[levelText.length - 1];
    // }
  },
  watch: {
    list() {
      this.initChart();
    }
  }
};
</script>

<style lang="scss">
.highcharts-container {
  width: 100%;
  height: 200px;
  position: initial !important;
}
</style>