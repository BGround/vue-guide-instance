<template>
  <table class="historyTable">
    <tr>
      <th></th>
      <th colspan="4">提车</th>
      <th colspan="4">实销</th>
    </tr>
    <tr v-if="dataList && dataList.length">
      <th>车型</th>
      <th>{{monthName}}</th>
      <th>{{currentYear}}年</th>
      <th>{{lastYear}}年</th>
      <th>{{beforeLastYear}}年</th>
      <th>{{monthName}}</th>
      <th>{{currentYear}}年</th>
      <th>{{lastYear}}年</th>
      <th>{{beforeLastYear}}年</th>
    </tr>
    <tr v-for="(item,index) in dataList" :key="index">
      <td>{{item.carName}}</td>
      <td>{{item.currentYearGetCar}}</td>
      <td>{{item.lastYearGetCar}}</td>
      <td>{{item.beforeYearGetCar}}</td>
      <td>{{item.endYearGetCar}}</td>
      <td>{{item.currentYearSaleCar}}</td>
      <td>{{item.lastYearSaleCar}}</td>
      <td>{{item.beforeYearSaleCar}}</td>
      <td>{{item.endYearSaleCar}}</td>
    </tr>
    <tr v-if="dataList && dataList.length">
      <td>小计</td>
      <td v-for="(item,index) in totalList" :key="index">{{item}}</td>
    </tr>
    <tr v-else><td colspan="9">暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data () {
          return {
              monthName:'',
              currentYear:'-',
              lastYear:'-',
              beforeLastYear:'-',
              endYear:'-',
          }
      },
      computed: {
          // 计算属性的 getter
          dataList() {
              if(this.columnsMonth && this.columnsMonth.length>0){
                  let monthName = this.columnsMonth[0].timeString
                  let newName = monthName.substr(0,4)+'年'+monthName.substr(4)+'月'
                  this.monthName = newName
                  let currentYear =  parseInt(monthName.substr(0,4))
                  this.currentYear = currentYear
                  this.lastYear = currentYear-1
                  this.beforeLastYear = currentYear-2
                  this.endYear = currentYear-3

                  let self = this
                  let temp = []
                  this.columnsMonth.map(item => {
                      let [lastYearGetCar,lastYearSaleCar,beforeYearGetCar,beforeYearSaleCar,endYearGetCar,endYearSaleCar] = ['-','-','-','-','-','-']
                      this.columnsYear.map(yitem => {
                          if(item.txtsh === yitem.txtsh){
                              if(parseInt(yitem.timeString) === self.currentYear){
                                  lastYearGetCar = yitem.getCar
                                  lastYearSaleCar = yitem.saleCar
                              }
                              if(parseInt(yitem.timeString) === self.lastYear){
                                  beforeYearGetCar = yitem.getCar
                                  beforeYearSaleCar = yitem.saleCar
                              }
                              if(parseInt(yitem.timeString) === self.beforeLastYear){
                                  endYearGetCar = yitem.getCar
                                  endYearSaleCar = yitem.saleCar
                              }
                          }
                      })
                      temp.push({
                          carName:item.txtsh,currentYearGetCar:item.getCar,lastYearGetCar:lastYearGetCar,beforeYearGetCar:beforeYearGetCar,endYearGetCar:endYearGetCar,currentYearSaleCar:item.saleCar,lastYearSaleCar:lastYearSaleCar,
                          beforeYearSaleCar:beforeYearSaleCar,endYearSaleCar:endYearSaleCar
                      })
                  })
                  debugger
                  return temp
              }else{
                  return []
              }
          },
          // 获取合计数据
          totalList() {
              if(this.columnsYearTotal.length>0 && this.columnsMonthTotal && this.columnsMonthTotal.totalGetCar){
                let temp = []
                let self = this
                let [currentMonthGetCar,currentMonthSaleCar,currentYearGetCar,currentYearSaleCar,lastYearGetCar,lastYearSaleCar,beforeYearGetCar,beforeYearSaleCar] = ['-','-','-','-','-','-','-','-']
                currentMonthGetCar = this.columnsMonthTotal.totalGetCar
                currentMonthSaleCar = this.columnsMonthTotal.totalSaleCar
                this.columnsYearTotal.map(item => {
                    if(parseInt(item.timeString) === self.currentYear){
                        currentYearGetCar = item.totalGetCar
                        currentYearSaleCar = item.totalSaleCar
                    }
                    if(parseInt(item.timeString) === self.lastYear){
                        lastYearGetCar = item.totalGetCar
                        lastYearSaleCar = item.totalSaleCar
                    }
                    if(parseInt(item.timeString) === self.beforeLastYear){
                        beforeYearGetCar = item.totalGetCar
                        beforeYearSaleCar = item.totalSaleCar
                    }
                })
                temp.push(currentMonthGetCar,currentYearGetCar,lastYearGetCar,beforeYearGetCar,currentMonthSaleCar,currentYearSaleCar,lastYearSaleCar,beforeYearSaleCar)
                return temp
              }else{
                  return []
              }
          }
      },
      props:{
          columnsMonth:{
              type: Array
          },
          columnsYear:{
              type: Array
          },
          columnsYearTotal:{
              type: Array
          },
          columnsMonthTotal:{
              type: Object
          },
      }
  }
</script>
