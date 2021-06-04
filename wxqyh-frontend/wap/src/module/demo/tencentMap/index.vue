<template>
  <div class="tencentMap">
    <input type="button" value="不展示地图获取位置"@click="operateMap('getAddress')">
    <input type="button" value="展示地图获取位置" @click="operateMap('getPosition')">
    <div class="address"  @click="operateMap('showPosition')">{{address}}</div>
    <tencent-map v-if="showMap"
                 :pos="pos"
                 :type="type"
                 @positionData="positionData"
                 @closeMap="showMap =false"
    >
    </tencent-map>
  </div>
</template>
<script>
  import tencentMap from '@/components/add/tencentMap.vue'
  export default {
    props: ['field'],
    components:{
      tencentMap,
    },
    data(){
      return {
        address:'',
        showMap:false,
        type:'',
        pos:{},
        address:'只展示地图',
      }
    },
    created(){

    },

    methods: {
      positionData(data){
        this.pos = data;
        this.address = data.value;
      },
      operateMap(type){
        this.type = type;
        this.showMap = true;
      }
    },
  }
</script>
<style scoped>
  .tencentMap .address{
    color:red;
  }
  .tencentMap .address,
  .tencentMap input{
    width: 90%;
    height:40px;
    margin:10px;
    line-height: 40px;
    text-align: center;
    border:1px solid #9e9e9e;
    background: none;
  }
</style>
