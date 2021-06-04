<template>
  <div>
        <div class="table-head">
          <table class="brandAllTable">
            <colgroup>
              <col v-for="(item,index) in 11" :key="index" style="width: 80px;" />
            </colgroup>
            <thead>
              <tr class="tableTit">
                <th></th>
                <th></th>
                <th>容量</th>
                <th></th>
                <th></th>
                <th>上险数</th>
                <th></th>
                <th></th>
                <th>市占率</th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <th>品牌</th>
                <th>排名</th>
                <th>{{currentYear}}年1-{{lastMonth}}月</th>
                <th>{{currentYear}}年{{currentMonth}}月</th>
                <th>上月环比</th>
                <th>{{currentYear}}年1-{{lastMonth}}月</th>
                <th>{{currentYear}}年{{currentMonth}}月</th>
                <th>上月环比</th>
                <th>{{currentYear}}年1-{{lastMonth}}月</th>
                <th>{{currentYear}}年{{currentMonth}}月</th>
                <th>上月环比</th>
              </tr>
            </thead>
          </table>
        </div>
    <div class="table-body">
  <table class="brandAllTable">
    <colgroup>
      <col v-for="(item,index) in 11" :key="index" style="width: 80px;" />
    </colgroup>
    <tbody>
    <tr v-for="(item,index) in brandList"
        :key="index">
      <td>{{item.name}}</td>
      <td>{{item.sort}}</td>
      <td>{{item.totalNumStart}}</td>
      <td>{{item.totalNumEnd}}</td>
      <td>{{item.totalPercent | filterNum}}%</td>

      <td>{{item.insuranceNumStart}}</td>
      <td>{{item.insuranceNumEnd}}</td>
      <td>{{item.insurancePercent | filterNum}}%</td>

      <td>{{item.percentStart | filterNum}}%</td>
      <td>{{item.percentEnd | filterNum}}%</td>
      <td>{{item.percent | filterNum}}%</td>
    </tr>
    <tr v-if="columns && columns.length===0">
      <td colspan="11">暂无数据</td>
    </tr>
    </tbody>
  </table>
    </div>
  </div>
</template>

<script>
  export default {
      data(){
          return {
              currentYear:'',
              currentMonth:'',
              lastMonth:''
          }
      },
      created() {
          this.init()
      },
      computed:{
        brandList(){
          if(this.columns.length>30) {
            let top30List = this.columns.slice(0,30)
            let hasQirui = false
            top30List.map(item => {
              if(item.name === '奇瑞') {
                hasQirui = true
              }
            })
            if(hasQirui) {
              return top30List
            } else {
              this.columns.map(item => {
                if(item.name === '奇瑞') {
                  top30List.push(item)
                }
              })
              return top30List
            }
          } else {
            return this.columns
          }
        }
      },
      methods:{
          init() {
              let dateVal = new Date()
              let currentYear = dateVal.getFullYear()
              let currentMonth = dateVal.getMonth()+1
              this.currentYear = currentYear
              this.currentMonth = currentMonth
              this.getLastMonth()
          },
          getLastMonth(){
              let dateVal = new Date()
              let currentMonth = dateVal.getMonth()
              dateVal.setMonth(currentMonth-1)
              let lastMonth = dateVal.getMonth()
              if(currentMonth+1===1) {
                  this.lastMonth = 1
              } else {
                  this.lastMonth = lastMonth+1
              }
          }
      },
      props:{
          columns:{
              type:Array
          }
      },
      filters:{
          filterNum(val){
              if(val){
                  return val.toFixed(2)
              } else {
                  return 0
              }
          }
      }
  }
</script>
