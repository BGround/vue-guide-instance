<template>
  
<qw-popup v-model="isVisible" position="bottom">
  
  <div class="picker__header">
    <a href="javascript: void(0)" @click="handleCancel">取消</a>
    <a href="javascript: void(0)" @click="handleSubmit">确认</a>
  </div>
  <div class="picker__body">
    <div class="region__header">
      <span :class="{active: isActive}">{{regionName}}</span>
      <span v-if="provinceName" :class="{active: isActive}">{{provinceName}}</span>
      <span v-if="cityName" :class="{active: isActive}">{{cityName}}</span>
    </div>
    <div class="region__body">
      <ul class="region__list" v-show="!currentScope">
        <li @click="handleClcikRegion(region)" v-for="(region, index) in regions" :key="index">
          <span>{{region.name}}</span>
        </li>
      </ul>
      <ul class="region__list" v-show="currentScope==='region'">
        <li @click="handleClcikProvidence(province)" v-for="(province, index) in provinces" :key="index">
          <span>{{province.name}}</span>
        </li>
      </ul>

       <ul class="region__list" v-show="currentScope==='province'">
        <li @click="handleClcikcity(city)" v-for="(city, index) in citys" :key="index">
          <span>{{city.name}}</span>
        </li>
      </ul>
    </div>
  </div>

</qw-popup>

</template>

<script>
import {searchDepatmentList} from '@/module/channelManagement/api/getData';

export default {
  data(){
    return {
      isVisible: true,
      isActive: true,
      regions: [],
      provinces: [],
      citys: [],
      regionName: '全国',
      cityName: '',
      provinceName: '',
      currentId: '',
      currentScope: '',
    }
  },

  methods:{
    fetchRegionData(){
      searchDepatmentList({id:''}).then((data)=>{
        const defaultRegion = {"id":"","name":"全国"};
        const regions = data.departmentList || [];
        this.regions = [defaultRegion, ...regions];
      });
    },

    /**
     * 选择地区
     */
    handleClcikRegion({id, name}){
      this.regionName = name;
      this.currentId = id;
      this.currentScope = 'region';
      this.provinceName="省";
      console.log(id);
      searchDepatmentList({id}).then((data)=>{
        this.provinces = data.departmentList;
      })
      this.cityName = '';
      this.provinceName = '';
    },

    handleClcikProvidence({id, name}){
      this.provinceName = name;
      this.currentId = id;
      this.cityName = '市';
      this.currentScope = 'province';
      searchDepatmentList({id}).then((data)=>{
        this.citys = data.departmentList;
      });
      this.cityName = '';
    },

    handleClcikcity({id, name}){
      this.cityName = name;
      this.currentId = id;
    },

    handleSubmit(){
      this.$emit('confirm', {id:this,currentId })
    },

    handleCancel(){
      this.$emit('cancel');
    }

  },
  created() {
    this.fetchRegionData();
  }
}
</script>

<style lang="scss" scoped>
.picker__header{
  height: 52px;
  background: #fff;
  display: flex;
}
.picker__body{
  background:#fff;
  height: 220px;
}

.region__list li{
  padding: 8px 10px;
  border-top: 1px solid #f6f6f6;
}

</style>