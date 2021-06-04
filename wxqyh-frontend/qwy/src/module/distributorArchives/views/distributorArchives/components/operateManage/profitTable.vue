<template>
  <table>
    <tr>
      <th>年份</th>
      <th>整车毛利(元)</th>
      <th>整车毛利率 </th><!--      <img :src="icon.iconNormal">-->
      <th>整车收入</th>
      <th>售后毛利(元)</th>
      <th>售后毛利率</th><!--      <img :src="icon.iconNormal">-->
      <th>售后收入</th>
      <th>增值毛利(元)</th>
      <th>增值毛利率</th>
      <th>增值收入</th>
      <th>毛利合计(元)</th>
      <th>租赁费</th>
      <th>人工费</th>
      <th>其他费用</th>
      <th>费用合计(元)</th>
      <th>所得税税前利润总额</th>
    </tr>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td>{{item.year}}年</td>
      <td>{{item.carGrossMargin}}</td>
      <td>{{item.carGrossProfitRate}}% <i class="up" v-if="item.carGrossProfitRateIncreaseI===1">&#8593;</i><i v-else-if="item.carGrossProfitRateIncreaseI===-1" class="down">&#8595;</i><i v-else class="up">-</i></td>
      <td>{{item.carIncome}}</td>
      <td>{{item.afterSaleGrossMargin}}</td>
      <td>{{item.afterSaleGrossProfitRate}}% <i class="up" v-if="item.afterSaleGrossProfitRateIncreaseI===1">&#8593;</i><i v-else-if="item.afterSaleGrossProfitRateIncreaseI===-1" class="down">&#8595;</i><i v-else class="up">-</i></td>
      <td>{{item.afterSaleIncome}}</td>
      <td>{{item.addValueGrossMargin}}</td>
      <td>{{item.addValueGrossProfitRate}}% <i class="up" v-if="item.addValueGrossProfitRateIncreaseI===1">&#8593;</i><i v-else-if="item.addValueGrossProfitRateIncreaseI===-1" class="down">&#8595;</i><i v-else class="up">-</i></td>
      <td>{{item.appreciationIncome}}</td>
      <td>{{item.totalGrossMargin}}</td>
      <td>{{item.rentalExpense}}</td>
      <td>{{item.expensesLabour}}</td>
      <td>{{item.otherExpense}}</td>
      <td>{{item.totalExpense}}</td>
      <td>{{item.preTaxTotalGrossMargin}}</td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="16">暂无数据</td></tr>
  </table>
</template>

<script>
    import iconDown from '../../images/icon_down.png'
    import iconUp from '../../images/icon_up.png'
    import iconNormal from '../../images/icon_normal.png'
  export default {
      data(){
          return {
              icon: {
                  iconDown: iconDown,
                  iconUp: iconUp,
                  iconNormal: iconNormal,
              },
          }
      },
      props:{
          columns:{
              type: Array
          }
      }
  }
</script>
