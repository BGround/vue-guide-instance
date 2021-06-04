<!-- 服务运营 -->
<template>
  <div class="service-operation">
    <div class="service">
      <div class="service__item"
       @click="handleClickservice(item)"
        v-for="(item, index) in services"
        :key="index">
        <div class="service__info" >
          <h4 class="service__name">{{item.year}}年第{{item.quarter}}季度</h4>
          <p class="service__date">{{item.valuation_date}}</p>
        </div>
        <div class="service__arrow">
          <img :src="iconArrowRight"
            alt="">
        </div>
      </div>

      <noData style="paddingTop: 20vh" :visible="!isLoading && !services.length"></noData>
    </div>
  </div>
</template>

<script>
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import reloadApp from '@/module/channelManagement/mixins/reloadApp';
import {getServiceOperateInfoList} from '@/module/channelManagement/api/operation'
import {mapMutations} from 'vuex';
import noData from '@/module/channelManagement/components/noData'

export default {
  mixins: [reloadApp],
  components:{noData},
  data() {
    return {
      iconArrowRight,
      services: [

      ],
      isLoading: false,
    }
  },
  methods: {

    ...mapMutations('serviceOperationDetail', ['setServiceOperationDetail']),

    handleClickservice(item) {
      this.setServiceOperationDetail(item)
      this.$router.push({name: 'serviceOperationDetail', query: this.$route.query});
    }
  },
  created() {
    const dealerId = this.$route.query.dealerId;
    if(!dealerId){ 
      this.reloadApp();  
      return
    }
    this.isLoading = true;
    getServiceOperateInfoList({dealerId}).then((data)=>{
      if(data){
        this.services = data.voList
      }
    }).finally(()=>{
      this.isLoading = false;
    })
  },
}
</script>

<style lang="scss" scoped>
.service-operation {
  padding-bottom: 50px;

  .service__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    margin: 10px;
    background: rgba(255, 255, 255, 1);
    padding: 15px 16px 15px 18px;
  }
  .service__name {
    font-size: 17px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: rgba(68, 68, 68, 1);
  }
  .service__date {
    margin-top: 5px;
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
  }
  .service__arrow {
    width: 7px;
    height: 11px;
    flex-shrink: 0;
    margin-left: 5px;
    & > img {
      width: 100%;
    }
  }
}
</style>