<!-- 股东股本 -->
<template>
  <div class="building-rebate">
    <qw-tab-bar
      v-model="selectedType"
      :data="tabs"
      @change="handleChangeTabs"
      scrollable
    ></qw-tab-bar>

    <template v-if="hasNetList">
      

      <div class="list" v-if="selectedType === 'anet'">
        <div
          class="list__item"
          v-for="(item, index) in storeOfAnet"
          :key="index"
        >
          <div class="list__info">
             <h4 class="list__name">建设级别:{{item.storeBuildingLevel}}</h4>
              <p class="list__data">
                <span>应兑现(万元)：{{item.shouldCash||'-'}}</span>
                <span>开始时间：{{item.startTime||'-'}}</span>
              </p>
          </div>
          <div class="list__arrow" @click="handleClick('aNet', item)">
            <img :src="iconArrowRight" alt="" />
          </div>
        </div>
      </div>

      <div class="list" v-if="selectedType === 'sale'">
        <div
          class="list__item"
          v-for="(item, index) in storeOfSales"
          :key="index"
        >
          <div class="list__info">
            <h4 class="list__name">直营店名称:{{ item.shopName }}</h4>
            <!-- <p class="list__data">
              <span>年度：{{ item.annual || '-' }}</span>
              <span>返利额/年(万元)：{{ item.rebateAmount || '-' }}</span>
            </p> -->
          </div>
          <div class="list__arrow" @click="handleClick('bNet', item)">
            <img :src="iconArrowRight" alt="" />
          </div>
        </div>
      </div>

      <div class="list" v-if="selectedType === 'service'">
        <div
          class="list__item"
          v-for="(item, index) in storeOfServices"
          :key="index"
        >
          <div class="list__info">
            <h4 class="list__name">直营店名称:{{ item.shopName }}</h4>
            <!-- <p class="list__data">
              <span>年度：{{ item.annual || '-' }}</span>
              <span>返利额/年(万元)：{{ item.rebateAmount || '-' }}</span>
            </p> -->
          </div>
          <div class="list__arrow" @click="handleClick('bNet', item)">
            <img :src="iconArrowRight" alt="" />
          </div>
        </div>
      </div>

      <div class="list" v-if="selectedType === 'serviceBNet'">
        <div
          class="list__item"
          v-for="(item, index) in storeOfServicesBNet"
          :key="index"
        >
          <div class="list__info">
            <h4 class="list__name">直营店名称:{{ item.shopName }}</h4>
            <!-- <p class="list__data">
              <span>年度：{{ item.annual || '-' }}</span>
              <span>返利额/年(万元)：{{ item.rebateAmount || '-' }}</span>
            </p> -->
          </div>
          <div class="list__arrow" @click="handleClick('bNet', item)">
            <img :src="iconArrowRight" alt="" />
          </div>
        </div>
      </div>
    </template>

    <noData style="paddingTop: 20vh" v-if="!isLoading && !hasNetList" />
  </div>
</template>

<script>
import {
  getSecondNetShopByErpNo,
  getOneNetShopByErpNo
} from '@/module/channelManagement/api/building'
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import { mapMutations } from 'vuex'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import noData from '@/module/channelManagement/components/noData'


const TYPE_MAP = {
  ANET:{
    LABEL: '一网返利',
    VALUE: 'anet'
  },
  SLAE: {
    LABEL: '销售直营店',
    VALUE: 'sale'
  },
  SERVICE: {
    LABEL:'服务直营店',
    VALUE: 'service'
  },
  SERVICE_B_NET:{
    LABEL:'服务二网',
    VALUE: 'serviceBNet'
  },
}

export default {
  mixins: [reloadApp],
  components: {
    noData
  },
  data() {
    return {
      iconArrowRight,
      storeOfAnet: [],
      firstNetList: [],
      storeOfSales: [],
      storeOfServices: [],
      storeOfServicesBNet: [],
      isLoading: false,
      selectedType: TYPE_MAP.ANET.VALUE,
      tabs: [
        {
          value: TYPE_MAP.ANET.VALUE,
          label: TYPE_MAP.ANET.LABEL
        },
        {
          value: TYPE_MAP.SLAE.VALUE,
          label: TYPE_MAP.SLAE.LABEL
        },
        {
          value: TYPE_MAP.SERVICE.VALUE,
          label:  TYPE_MAP.SERVICE.LABEL
        },
        {
          value: TYPE_MAP.SERVICE_B_NET.VALUE,
          label: TYPE_MAP.SERVICE_B_NET.LABEL
        },

      ],
      dealerId: '',
      isLoading: false,
      typeName: TYPE_MAP.SLAE.LABEL,
    }
  },
  computed: {
    hasNetList() {
      let hadData = false;
      switch(this.selectedType){
        case TYPE_MAP.SLAE.VALUE:
            hadData = !!this.storeOfSales.length
          break;
        case TYPE_MAP.SERVICE.VALUE:
            hadData = !!this.storeOfServices.length
          break;
        case TYPE_MAP.SERVICE_B_NET.VALUE:
            hadData = !!this.storeOfServicesBNet.length;
          break;
        default:
          hadData = !!this.storeOfAnet.length;
          break;
      }
      return hadData;
    }
  },
  methods: {
    ...mapMutations('buildingRebateDetail', {
      setRebateDetail: 'setRebateDetail',
      setRebateDetailType: 'setRebateDetailType'
    }),

    handleClick(type, detail) {
      this.setRebateDetailType(type)
      this.setRebateDetail(detail)
      this.$router.push({
        name: 'buildingRebateDetail',
        query: this.$route.query
      })
    },

    fetchOneNetShopByErpNo() {
      return getOneNetShopByErpNo({ dealerId: this.dealerId }).then(data => {
        if (data) {
          this.storeOfAnet = data
        }
        return
      })
    },

    //销售运营店是1，
    fetchSecondNetShopOfSalesByErpNo() {
      return getSecondNetShopByErpNo({
        dealerId: this.dealerId,
        type: TYPE_MAP.SLAE.LABEL
      }).then(data => {
        if (data) {
          this.storeOfSales = data
        }
        return
      })
    },

    //服务运营点是2
    fetchSecondNetShopOfServiceByErpNo() {
      getSecondNetShopByErpNo({
        dealerId: this.dealerId,
        type: TYPE_MAP.SERVICE.LABEL
      }).then(data => {
        if (data) {
          this.storeOfServices = data
        }
        return
      })
    },

    fetchSecondNetShopOSserviceBNetByErpNo(){
      getSecondNetShopByErpNo({
        dealerId: this.dealerId,
        type: TYPE_MAP.SERVICE_B_NET.LABEL
      }).then(data => {
        if (data) {
          this.storeOfServicesBNet = data
        }
        return
      })
    },

    handleChangeTabs(tabValue) {
      switch (tabValue) {
        case TYPE_MAP.SLAE.VALUE:
          this.typeName = TYPE_MAP.SLAE.LABEL
          this.fetchSecondNetShopOfSalesByErpNo()
          break
        case TYPE_MAP.SERVICE.VALUE:
          this.typeName = TYPE_MAP.SERVICE.LABEL
          this.fetchSecondNetShopOfServiceByErpNo()
          break
        case TYPE_MAP.SERVICE_B_NET.VALUE:
          this.typeName = TYPE_MAP.SERVICE_B_NET.LABEL
          this.fetchSecondNetShopOSserviceBNetByErpNo()
          break
        default:
          this.typeName = TYPE_MAP.ANET.LABEL
          this.fetchOneNetShopByErpNo();
          break
      }
    }
  },
  created() {
    this.dealerId = this.$route.query.dealerId || ''
    this.isLoading = true
    this.fetchOneNetShopByErpNo().finally(()=>{
      this.isLoading = false
    })
  }
}
</script>

<style lang="scss" scoped>
.building-rebate {
  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding: 15px;
    background: #ffffff;
  }

  .list__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    margin: 10px;
    background: rgba(255, 255, 255, 1);
    padding: 15px 16px 15px 18px;
  }
  .list__name {
    font-size: 17px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(68, 68, 68, 1);
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .list__data {
    margin-top: 5px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
    & > span {
      width: 86px;
      margin-right: 15px;
    }
  }
  .list__arrow {
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
