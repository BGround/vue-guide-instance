<!--  直营店信息 -->
<template>
  <div>
    <div class="online-sales-platform"
      v-if="list.length">
      <div class="header">网销平台</div>
      <div class="store">
        <div class="store__item"
          v-for="(item, index) in list"
          :key="index">
          <div class="store__info">
            <h4 class="store__name">{{item.platformName}}</h4>
            <!-- <p class="store__address">年份: {{formatDate(item.platformOpenTime)||'-'}}</p> -->
          </div>
          <div class="store__arrow"
            @click="handleClickStore(item)">
            <img :src="iconArrowRight"
              alt="">
          </div>
          <div class="store__status"
            v-if="isNormal(item)">
            <img :src="IconNormalOperation"
              alt="">
          </div>
        </div>
      </div>
    </div>

    <noData style="paddingTop: 20vh"
      :visible="!isLoading && !list.length" />

  </div>

</template>

<script>
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import IconNormalOperation from '@/module/channelManagement/static/images/icon_normalOperation.png'
import { getSelPlatFromList } from '@/module/channelManagement/api/basic'
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
      list: [],
      isLoading: false
    }
  },

  methods: {
    ...mapMutations('storeInfoDetail', ['setStoreDetail']),
    isNormal(item) {
      return !!item.status
    },

    handleClickStore(item) {
      this.$router.push({
        name: 'onlineSalesPlatformDetail',
        query: this.$route.query,
        params: item
      })
    },
    formatDate(itme) {
      if (itme) {
        return itme.substring(0,10)
      }
      return ''
    }
  },
  created() {
    const dealerId = this.$route.query.dealerId || ''
    this.isLoading = true
    getSelPlatFromList({ id: dealerId })
      .then(data => {
        if (data && Array.isArray(data.platFromVO)) {
          this.list = data.platFromVO
        }
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss" scoped>
.online-sales-platform {
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
    left: 120px;
    top: 15px;
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




















