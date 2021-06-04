<!-- 经营权限  培训信息-->
<template >
  <div class="operation-authority">
    <!-- <div class="table" v-if="dealers.length">
      <div class="table__header">
        <div class="table__row" >
          <span class="table__col">车型</span>
          <span class="table__col">责任区域</span>
        </div>
      </div>
      <div class="table__body" >
        <div class="table__row" v-for="(item, index) in dealers" :key="index">
          <span class="table__col">{{item.salesCarType}}</span>
          <span class="table__col">
            {{item.salesRegionArea||'暂无'}}
          </span>
        </div>
      </div> -->

      <div class="panel">
        <div class="panel__title">销售车型</div>
        <div class="panel__select">
          <input @click="handleClickCarTypeInput" class="panel__select__input" placeholder="请输入" type="text" readonly v-model="salesCarType" />
            <i class="panel__select__icon"></i>
        </div>
        <div class="panel__title">销售区域</div>
        <div class="pannel__conent">
          <p>
            {{salesRegionArea}}
          </p>
        </div>
      </div>

      <div class="gutter"></div>

      <div class="panel">
        <div class="panel__title">服务车系</div>
        <div class="panel__select">
          <input class="panel__select__input" 
          placeholder="请输入" 
          @click="handleClickcarSeriesInput"
          type="text" 
          readonly 
          v-model="salesCarSeries" />
            <i class="panel__select__icon"></i>
        </div>
        <div class="panel__title">服务区域</div>
        <div class="pannel__conent">
          <p>
            {{serviceArea}}
          </p>
        </div>
      </div>

      
      <qw-picker
        v-model="isVisibleCarTypeOptions"
        :data="carTypeOptions"
        :selected-index="[1]"
        @select="handleSelectTypeOptions"
      >
      </qw-picker>

      <qw-picker
        v-model="isVisibleCarSeriesOptions"
        :data="carSeriesOptions"
        :selected-index="[1]"
        @select="handleSelectSeriesOptions"
      >
      </qw-picker>
      

    
  </div>
</template>

<script>

import scrollingTable from '@/module/channelManagement/components/scrollingTable'
import {
  searchDealerAuthority, 
  searchDmsAfterCarTypeByKey, 
  searchDmsAfterSaleAreaByKey, 
  searchDealerSaleAfterByDealerId,
  getAreaByDealerIdAndCarType,
  getCarTypeListByDealerId
} from '@/module/channelManagement/api/basic'
import noData from '@/module/channelManagement/components/noData'

export default {
  components: {
    scrollingTable,
    noData
  },
  data() {
    return {
      dealers: [],
      salesCarType: '',
      salesRegionArea: '',
      salesCarSeries: '',
      carTypeOptions: [],
      isVisibleCarTypeOptions: false,
      isVisibleCarSeriesOptions: false,
      carSeriesOptions: [],
      serviceArea:'',
      dealerId: ''
    }
  },
  methods: {
    handleClickCarTypeInput(){
      this.isVisibleCarTypeOptions = true;
    },

    handleClickcarSeriesInput(){
      this.isVisibleCarSeriesOptions = true;
    },

    handleSelectTypeOptions([value], index, [label]){
      this.salesCarType = value;
      this.fetchAreaByDealerIdAndCarType(value)
    },

    fetchAreaByDealerIdAndCarType(carType){
      this.salesRegionArea = '';
      const params = {
        dealerId: this.dealerId,
        carType: carType
      }
      getAreaByDealerIdAndCarType(params).then((data)=>{
        if(data && data.area){
          this.salesRegionArea = data.area;
        }
      })
    },

    handleSelectSeriesOptions([value], index, [label]){
      this.salesCarSeries = label;
      this.serviceArea = '';
      this.fetchDmsAfterSaleAreaByKey(value)
    },

    fetchDmsAfterSaleAreaByKey(categoryName){
      const params = {
        dealerId: this.dealerId,
        categoryName: categoryName
      }
      searchDmsAfterSaleAreaByKey(params).then((data)=>{
        if(data && Array.isArray(data.saleAreaList)){
          this.serviceArea = data.saleAreaList.join(',')
        }
      })
    }
    
     
  },
  created() {
      const dealerId = this.$route.query.dealerId || '';
      this.dealerId = dealerId;
      getCarTypeListByDealerId({dealerId}).then((data)=>{
        if(data && Array.isArray(data.carTypeList)){
           const list = data.carTypeList.map((item)=>{
            return { text: item, value: item }
          });
          this.carTypeOptions = [list];
        }
      })

      searchDmsAfterCarTypeByKey({dealerId}).then((data)=>{
        if(data && Array.isArray(data.carTypeList)){
           const list = data.carTypeList.map((item)=>{
            return { text: item, value: item }
          });
          this.carSeriesOptions = [list];
        }
      })
  }
}
</script>

<style lang="scss" scoped>
.operation-authority {
  min-height: calc(100vh - 40px - 60px);
  padding-bottom: 60px;

  .panel{
    padding: 20px;
    background: #ffffff;

  }

  .panel__title{
    font-size: 20px;
    font-size:15px;
    font-weight:400;
    line-height:34px;
    color:rgba(51,51,51,1);
  }

  .panel__select{
    border:1px solid rgba(230,230,230,1);
    height: 36px;
    position: relative;
  }

  .pannel__conent{
    border:1px solid rgba(230,230,230,1);
    min-height: 150px;
    padding: 10px;
  }

  .panel__select__input{
    position: absolute;
    width: 100%;
    height: 100%;
    text-indent: 10px;
  }

  .panel__select__icon{
    background-image: url('~@/module/channelManagement/static/images/icon_arrow_down.png');
    width: 16px;
    height: 9px;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translate(0,-50%);
    background-size: 100%;
    background-repeat: no-repeat;
  }

  .gutter{
    height:8px;
    background:rgba(245,245,245,1);
    opacity:1;
  }

}
</style>