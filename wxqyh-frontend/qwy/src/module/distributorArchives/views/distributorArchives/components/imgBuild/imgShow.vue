<template>
  <div>
    <!--    售前-->
    <div class="imgShowWrap" v-show="btype==='1'">
      <img :src="columns.hallFrontImg?columns.hallFrontImg:defaultUrl1"><!--  展厅正面    -->
      <img :src="columns.hall45Img?columns.hall45Img:defaultUrl2"><!--  展厅45°    -->
      <img :src="columns.hallInsideFrontImg?columns.hallInsideFrontImg:defaultUrl3"><!--  展厅内部正面    -->
      <img :src="columns.saleReceptionDeskImg?columns.saleReceptionDeskImg:defaultUrl4"><!--  销售接待台    -->
    </div>
    <!--    售后 -->
    <div class="imgShowWrap" v-show="btype==='2'">
      <img :src="columns.serviceStationFrontImg?columns.serviceStationFrontImg:defaultUrl1"><!--  服务站正面    -->
      <img :src="columns.antechamberImg?columns.antechamberImg:defaultUrl2"><!--  接待室    -->
      <img :src="columns.lounge?columns.lounge:defaultUrl3"><!--  休息室    -->
      <img :src="columns.plant?columns.plant:defaultUrl4"><!--  车间    -->
    </div>
  </div>
</template>

<script>
  export default {
      data () {
          return {
            defaultUrl:require('@/assets/images/default/default.png'),
            defaultUrl1:require('@/assets/images/default/01.png'),
            defaultUrl2:require('@/assets/images/default/02.png'),
            defaultUrl3:require('@/assets/images/default/03.png'),
            defaultUrl4:require('@/assets/images/default/04.png'),

          }
      },
      props:{
          btype:{
              type: String
          },
          columns:{
              type: Object
          }
      }
  }
</script>
