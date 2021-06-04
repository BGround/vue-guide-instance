<template>
  <table class="specialTable">
    <tr>
      <th rowspan="2" class="borderR">类型</th>
      <th colspan="2" class="borderR">当年目标</th>
      <th colspan="4" class="borderR">当年累计</th>
      <th colspan="8">当月完成</th>
    </tr>
    <tr>
      <th>提车</th>
      <th class="borderR">实销</th>
      <th>提车</th>
      <th>提车同比</th>
      <th>实销</th>
      <th class="borderR">实销同比</th>
      <th>提车</th>
      <th>提车环比</th>
      <th>提车同比</th>
      <th>实销</th>
      <th>实销环比</th>
      <th>实销同比</th>
      <th>库存</th>
      <th>存销比</th>
    </tr>
    <tr v-if="columnsTarget && columnsTarget.bendian && columnsYearCount.benDianDangNianLeiJi && columnsStore.getCar">
      <td>本店</td>
      <td>{{columnsTarget.bendian.getCar}}</td>
      <td>{{columnsTarget.bendian.saleCar}}</td>
      <td>{{columnsYearCount.benDianDangNianLeiJi.getCar}}</td>
      <td>{{columnsYearCount.benDianDangNianLeiJi.tiCheTongBi}}%</td>
      <td>{{columnsYearCount.benDianDangNianLeiJi.saleCar}}</td>
      <td>{{columnsYearCount.benDianDangNianLeiJi.shiXiaoTongBi}}%</td>
      <td>{{columnsStore.getCar}}</td>
      <td>{{columnsStore.tiCheHeuanBi}}%</td>
      <td>{{columnsStore.tiCheTongBi}}%</td>
      <td>{{columnsStore.saleCar}}</td>
      <td>{{columnsStore.shiXiaoHuanBi}}%</td>
      <td>{{columnsStore.shiXiaoTongBi}}</td>
      <td>{{columnsStore.inventory}}</td>
      <td>{{columnsStore.cunXiaoBi || '-'}}</td>
    </tr>
    <tr v-if="columnsTarget && columnsTarget.sheng && columnsYearCount.shengDangNianLeiJi && columnsProvice.getCar">
      <td>省</td>
      <td>{{columnsTarget.sheng.getCar}}</td>
      <td>{{columnsTarget.sheng.saleCar}}</td>
      <td>{{columnsYearCount.shengDangNianLeiJi.getCar}}</td>
      <td>{{columnsYearCount.shengDangNianLeiJi.tiCheTongBi}}%</td>
      <td>{{columnsYearCount.shengDangNianLeiJi.saleCar}}</td>
      <td>{{columnsYearCount.shengDangNianLeiJi.shiXiaoTongBi}}%</td>
      <td>{{columnsProvice.getCar}}</td>
      <td>{{columnsProvice.tiCheHeuanBi}}%</td>
      <td>{{columnsProvice.tiCheTongBi}}%</td>
      <td>{{columnsProvice.saleCar}}</td>
      <td>{{columnsProvice.shiXiaoHuanBi}}%</td>
      <td>{{columnsProvice.shiXiaoTongBi}}</td>
      <td>{{columnsProvice.inventory}}</td>
      <td>{{columnsProvice.cunXiaoBi || '-'}}</td>
    </tr>
    <tr v-if="columnsTarget && columnsTarget.zhanqu && columnsYearCount.zhanQuDangNianLeiJi && columnsWarzone.getCar">
      <td>战区</td>
      <td>{{columnsTarget.zhanqu.getCar}}</td>
      <td>{{columnsTarget.zhanqu.saleCar}}</td>
      <td>{{columnsYearCount.zhanQuDangNianLeiJi.getCar}}</td>
      <td>{{columnsYearCount.zhanQuDangNianLeiJi.tiCheTongBi}}%</td>
      <td>{{columnsYearCount.zhanQuDangNianLeiJi.saleCar}}</td>
      <td>{{columnsYearCount.zhanQuDangNianLeiJi.shiXiaoTongBi}}%</td>
      <td>{{columnsWarzone.getCar}}</td>
      <td>{{columnsWarzone.tiCheHeuanBi}}%</td>
      <td>{{columnsWarzone.tiCheTongBi}}%</td>
      <td>{{columnsWarzone.saleCar}}</td>
      <td>{{columnsWarzone.shiXiaoHuanBi}}%</td>
      <td>{{columnsWarzone.shiXiaoTongBi}}</td>
      <td>{{columnsWarzone.inventory}}</td>
      <td>{{columnsWarzone.cunXiaoBi || '-'}}</td>
    </tr>
    <tr v-if="columnsTarget && columnsTarget.quanguo && columnsYearCount.quanGuoDangNianLeiJi && columnsCountry.getCar">
      <td>全国</td>
      <td>{{columnsTarget.quanguo.getCar}}</td>
      <td>{{columnsTarget.quanguo.saleCar}}</td>
      <td>{{columnsYearCount.quanGuoDangNianLeiJi.getCar}}</td>
      <td>{{columnsYearCount.quanGuoDangNianLeiJi.tiCheTongBi}}%</td>
      <td>{{columnsYearCount.quanGuoDangNianLeiJi.saleCar}}</td>
      <td>{{columnsYearCount.quanGuoDangNianLeiJi.shiXiaoTongBi}}%</td>
      <td>{{columnsCountry.getCar}}</td>
      <td>{{columnsCountry.tiCheHeuanBi}}%</td>
      <td>{{columnsCountry.tiCheTongBi}}%</td>
      <td>{{columnsCountry.saleCar}}</td>
      <td>{{columnsCountry.shiXiaoHuanBi}}%</td>
      <td>{{columnsCountry.shiXiaoTongBi}}</td>
      <td>{{columnsCountry.inventory}}</td>
      <td>{{columnsCountry.cunXiaoBi || '-'}}</td>
    </tr>
    <tr v-else><td colspan="15">暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data () {
          return {}
      },
      props:{
        columnsStore:{ // 本店
            type: Object
        },
        columnsProvice:{ // 省
            type: Object
        },
        columnsWarzone:{ // 战区
            type: Object
        },
        columnsCountry:{ // 全国
            type: Object
        },
        columnsTarget:{ //当年目标
            type: Object
        },
        columnsYearCount:{ // 当年累计
            type: Object
        }
      }
  }
</script>
