<template>
  <table>
    <tr>
      <th>指标</th>
      <th>权重</th>
      <th>目标</th>
      <th>{{columns.length>0 ? getPreQuarter(columns[0].year, columns[0].quarter) : ''}}</th>
      <th>{{columns.length>0?columns[0].year:''}}年{{columns.length>0?columns[0].quarter:''}}季度</th>
      <th>区域平均</th>
      <th>全国平均</th>
      <th>本站指标得分</th>
      <th>区域排名</th>
      <th>全国排名</th>
      <th>评价</th>
      <th>业务联系人</th>
    </tr>
    <tr v-for="(item,index) in columns" :class="{'has-bg': item.quotaType === 'KPI'}"
      :key="index">
      <td>{{item.indicatorName}}</td>
      <td>{{item.weight | weightFilter}}</td>
      <td>{{item.goal}}</td>
      <td>{{item.preQuarterScore === ''? '/': item.preQuarterScore}}</td>
      <td>{{item.score === ''? '/':item.score }}</td>
      <td>{{item.regionAverage}}</td>
      <td>{{item.nationwideAverage}}</td>
      <td>{{item.regionScore}}</td>
      <td>{{item.regionSort}}</td>
      <td>{{item.nationwideSort}}</td>
      <td>{{item.evaluate}}</td>
      <td>{{item.servicePerson}}</td>
    </tr>
    <tr v-if="columns && columns.length===0">
      <td colspan="12">暂无数据</td>
    </tr>
  </table>
</template>

<script>
export default {
  filters:{
      weightFilter(data){
          if(data){
              return data;
          }else{
              return '-'
          }
      },
      toPercentage(value) {
          const parsedValue = parseFloat(value)
          if (Number.isNaN(parsedValue)) {
              return '-'
          } else {
              return `${Number(parsedValue * 100).toFixed(1)}%`
          }
      }
  },
  data() {
    return {}
  },
  props: {
    columns: {
      type: Array
    }
  },
  computed: {
    // getPreMonth(year, month) {
    //     var days = new Date(year, parseInt(month)-1 , 0);
    //     var t2 = days.getFullYear() + '年' + (days.getMonth()+1) + '月';
    //     return t2;
    // }
  },
  methods: {
    getPreQuarter(year, quarter) {
      if (quarter === 1) {
        return `${year - 1}年4季度`
      } else {
        return `${year}年${quarter - 1}季度`
      }
    }
  },
}
</script>
