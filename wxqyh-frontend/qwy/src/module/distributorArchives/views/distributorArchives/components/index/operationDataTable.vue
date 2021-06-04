<template>
    <table>
      <tr>
<!--        <img :src="icon.iconNormal">-->
        <th width="10%">ERP号</th>
        <th width="22%">经销商简称</th>
        <th width="12%">{{lastYear}}销量</th>
        <th width="12%">城市占比</th>
        <th width="12%">{{currentYear}}销量</th>
        <th width="12%">城市占比</th>
        <th width="20%">目前星级</th>
      </tr>
      <tr v-for="(item, index) in columns"
        :key="index">
        <td>{{item.erpCarNo}}</td>
        <td><p class="ellipsis">{{item.dealerShortName || '-'}}</p></td>
        <td>{{item.lastSales | filterEmpty}}</td>
        <td>{{item.lastPercentage}}</td>
        <td>{{item.curSales | filterEmpty}}<i class="up" v-if="parseInt(item.curSales)>parseInt(item.lastSales)">&#8593;</i><i class="down" v-if="parseInt(item.curSales)<parseInt(item.lastSales)">&#8595;</i><i class="up" v-if="parseInt(item.curSales)===parseInt(item.lastSales)">-</i></td>
        <td>{{item.curPercentage}}<i class="up" v-if="parseInt(item.curPercentage)>parseInt(item.lastPercentage)">&#8593;</i><i class="down" v-if="parseInt(item.curPercentage)<parseInt(item.lastPercentage)">&#8595;</i><i class="up" v-if="parseInt(item.curPercentage)===parseInt(item.lastPercentage)">-</i></td>
        <td><p v-if="item.curStarRating"><img v-for="(imgItem,imgIndex) in item.curStarRating" :key="imgIndex" src="../../images/icon_star.png" width="12px"></p><span v-else>-</span></td>
      </tr>
      <tr v-if="columns && columns.length===0"><td colspan="7">暂无数据</td></tr>
    </table>
</template>

<script>
    import iconDown from '../../images/icon_down.png'
    import iconUp from '../../images/icon_up.png'
    import iconNormal from '../../images/icon_normal.png'
export default {
  props:{
    columns: {
        type: Array
    }
  },
  data() {
    return {
        currentYear: '',
        lastYear: '',
        icon: {
            iconDown: iconDown,
            iconUp: iconUp,
            iconNormal: iconNormal
        },
    }
  },
  created(){
      this.init()
  },
  methods:{
    init() {
        let dateVal = new Date()
        let currentYear = dateVal.getFullYear()
        this.currentYear = currentYear
        this.lastYear = currentYear-1
    }
  },
  filters:{
      filterEmpty(val){
          let txt = '-'
          if(val) {
              txt = val
          }
          return txt
      }
  }
}
</script>

<style lang="scss" scoped>
.operation-data-table {
}
</style>
