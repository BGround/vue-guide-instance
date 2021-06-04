<template>
  <div>
    <div class="table-head">
      <table>
        <colgroup>
          <col v-for="(item,index) in 5" :key="index" style="width: 80px;" />
        </colgroup>
        <thead>
          <tr>
            <th>品牌</th>
            <th>容量</th>
            <th>上险数</th>
            <th>市占率</th>
            <th>排名</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="table-body">
      <table>
        <colgroup>
          <col v-for="(item,index) in 5" :key="index" style="width: 80px;" />
        </colgroup>
        <tbody>
          <tr v-for="(item,index) in autoList"
              :key="index">
            <td>{{item.name}}</td>
            <td>{{item.totalNumTemp}}</td>
            <td>{{item.insuranceNumTemp}}</td>
            <td>{{item.insurancePercent | filterNum}}%</td>
            <td>{{item.sort}}</td>
          </tr>
          <tr v-if="columns && columns.length===0">
            <td colspan="5">暂无数据</td>
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
          }
      },
      props:{
          columns:{
              type:Array
          }
      },
      computed:{
        autoList(){
          if(this.columns.length>20) {
            let top20List = this.columns.slice(0,20)
            let hasQirui = false
            top20List.map(item => {
              if(item.name === '奇瑞') {
                hasQirui = true
              }
            })
            if(hasQirui){
              return top20List
            } else {
              this.columns.map(item => {
                if(item.name === '奇瑞') {
                  top20List.push(item)
                }
              })
              return top20List
            }
          } else {
            return this.columns
          }
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
