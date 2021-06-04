<template>
  <table class="firstTable">
    <tr>
      <th colspan="5" class="table-head borderR">月度完成情况</th>
      <th colspan="4" class="table-head borderR">实销量排名</th>
      <th rowspan="2" class="graybg">同城经销<br>商家数</th>
    </tr>
    <tr class="graybg">
      <th class="borderR">实销目标</th>
      <th class="borderR">实销完成</th>
      <th class="borderR">完成率</th>
      <th class="borderR">同比</th>
      <th class="borderR">环比</th>
      <th class="borderR">全国排名</th>
      <th class="borderR">大区排名</th>
      <th class="borderR">全省排名</th>
      <th class="borderR">同城排名</th>
    </tr>
    <slot></slot>
  </table>
</template>
<script>
export default {
  name:"",
  components:{

  },
  props:{

  },
  vuex:{

  },
  data(){
  return{}
  },
  computed:{

  },
  watch:{

  },
  methods:{

  },
  beforeCreate(){

  },
  created(){

  },
  beforeMount(){

  },
  mounted(){

  }
}
</script>
<style lang="less">

</style>
