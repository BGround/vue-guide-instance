<!--  直营店信息 -->
<template>
  <div>
    <div class="store_info"  v-if="stores.length">
      <div class="header">直营店基本信息</div>
      <div class="store">
        <div class="store__item"
          v-for="(item, index) in stores"
          :key="index">
          <div class="store__info">
            <h4 class="store__name">{{item.shopName}}</h4>
            <p class="store__address">{{item.shopCode||'-'}}</p>
          </div>
          <div class="store__arrow"
            @click="handleClickStore(item)">
            <img :src="iconArrowRight"
              alt="">
          </div>
          <div class="store__status"
            v-if="isAbnormal(item)">
            <img :src="iconException"
              alt="">
          </div>
          <div class="store__status--abnormal"
            v-else>
            <img :src="IconNormalOperation"
              alt="">
          </div>
        </div>
      </div>
    </div>

    <noData style="paddingTop: 20vh" :visible="!isLoading && !stores.length" />
    
  </div>


</template>

<script>
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import IconNormalOperation from '@/module/channelManagement/static/images/icon_normalOperation.png'
import iconException from '@/module/channelManagement/static/images/icon_exception.png'
import { getSelMaketList } from '@/module/channelManagement/api/basic'
import { mapMutations } from 'vuex'
  import noData from '@/module/channelManagement/components/noData'

export default {
  components: {
    noData
  },
  data() {
    return {
      iconArrowRight,
      IconNormalOperation,
      iconException,
      stores: [],
      isLoading: false,
    }
  },

  methods: {
    ...mapMutations('storeInfoDetail', ['setStoreDetail']),
    isAbnormal(item) {
      return item.shopStatus === '异常'
    },

    handleClickStore(item) {
      this.setStoreDetail(item)
      this.$router.push({ name: 'storeInfoDetails', query: this.$route.query })
    },
    fetchStores(dealerId) {
      this.isLoading = true;
      getSelMaketList({ id: dealerId }).then(data => {
        if (data) {
          this.stores = data.pageData || []
        }
      }).finally(()=>{
        this.isLoading = false;
      })
    }
  },
  created() {
    const dealerId = this.$route.query.dealerId ||'';
    this.fetchStores(dealerId)
  }
}
</script>

<style lang="scss" scoped>
.store_info {
  padding-bottom: 50px;
  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding: 15px;
    background: #ffffff;
  }

  .store {
    // margin-top:
  }

  .store__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    margin: 15px 0;
    background: rgba(255, 255, 255, 1);
    padding: 13px 25px 8px 15px;
    position: relative;
  }

  .store__status {
    position: absolute;
    width: 76px;
    height: 44px;
    left: 200px;
    top: 0px;
    & > img {
      width: 100%;
    }
  }

  .store__status--abnormal{
    position: absolute;
    width: 76px;
    height: 44px;
    left: 200px;
    top: 18px;
    & > img {
      width: 100%;
    }
  }

  .store__name {
    font-size: 17px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(68, 68, 68, 1);
  }
  .store__address {
    margin-top: 5px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
  }
  .store__arrow {
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