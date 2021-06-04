<template>
  <table class="historyTable">
    <tr>
      <th rowspan="2" class="borderR">类型</th>
<!--      <th colspan="2" class="borderR">当年目标销量</th>-->
      <th colspan="2" class="borderR" v-for="(item,index) in columns.bdxlList" :key="index">{{item.year}}年</th>
<!--      <th colspan="2">2016年</th>-->
    </tr>
    <tr>
      <th>提车</th>
      <th>实销</th>
      <th>提车</th>
      <th>实销</th>
      <th>提车</th>
      <th>实销</th>
    </tr>
    <tr v-if="columns.bdxlList && columns.bdxlList.length>0">
      <th>本店</th>
<!--      <div v-for="(item,index) in columns.bdxlList" :key="index">-->
<!--        <td>{{item.getCar}}</td>-->
<!--        <td>{{item.saleCar}}</td>-->
<!--      </div>-->
      <td>{{columns.bdxlList[0].getCar}}</td>
      <td>{{columns.bdxlList[0].saleCar}}</td>
      <td>{{columns.bdxlList[1].getCar}}</td>
      <td>{{columns.bdxlList[1].saleCar}}</td>
      <td>{{columns.bdxlList[2].getCar}}</td>
      <td>{{columns.bdxlList[2].saleCar}}</td>
    </tr>
    <tr v-if="columns.sxlList && columns.sxlList.length>0">
      <th>省</th>
<!--      <div v-for="(item,index) in columns.sxlList" :key="index">-->
<!--        <td>{{item.getCar}}</td>-->
<!--        <td>{{item.saleCar}}</td>-->
<!--      </div>-->
      <td>{{columns.sxlList[0].getCar}}</td>
      <td>{{columns.sxlList[0].saleCar}}</td>
      <td>{{columns.sxlList[1].getCar}}</td>
      <td>{{columns.sxlList[1].saleCar}}</td>
      <td>{{columns.sxlList[2].getCar}}</td>
      <td>{{columns.sxlList[2].saleCar}}</td>
    </tr>
    <tr v-if="columns.zqxlList && columns.zqxlList.length>0">
      <th>战区</th>
<!--      <div v-for="(item,index) in columns.zqxlList" :key="index">-->
<!--        <td>{{item.getCar}}</td>-->
<!--        <td>{{item.saleCar}}</td>-->
<!--      </div>-->
      <td>{{columns.zqxlList[0].getCar}}</td>
      <td>{{columns.zqxlList[0].saleCar}}</td>
      <td>{{columns.zqxlList[1].getCar}}</td>
      <td>{{columns.zqxlList[1].saleCar}}</td>
      <td>{{columns.zqxlList[2].getCar}}</td>
      <td>{{columns.zqxlList[2].saleCar}}</td>
    </tr>
    <tr v-if="columns.qgxlList && columns.qgxlList.length>0">
      <th>全国</th>
<!--      <div v-for="(item,index) in columns.qgxlList" :key="index">-->
<!--        <td>{{item.getCar}}</td>-->
<!--        <td>{{item.saleCar}}</td>-->
<!--      </div>-->
      <td>{{columns.qgxlList[0].getCar}}</td>
      <td>{{columns.qgxlList[0].saleCar}}</td>
      <td>{{columns.qgxlList[1].getCar}}</td>
      <td>{{columns.qgxlList[1].saleCar}}</td>
      <td>{{columns.qgxlList[2].getCar}}</td>
      <td>{{columns.qgxlList[2].saleCar}}</td>
    </tr>
    <tr v-else><td colspan="7">暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data () {
          return {}
      },
      props:{
          columns:{
              type: Object
          }
      }
  }
</script>
