<!-- 預警陳述 -->
<template>
  <div class="warning-desc">

    <div class="desc" v-if="allEarlyWarnings.length">
      <div class="desc__item"
        @click="handleClickdesc(item)"
        :class="mapClassName(item)"
        v-for="(item, index) in allEarlyWarnings"
        :key="index">
        <div class="desc__info">
          <h4 class="desc__name">{{item.exchangeTime}}{{item.background}}</h4>
          <p class="desc__reason">{{item.abnormalReason}}</p>
        </div>
        <i class="desc__status"></i>
      </div>
    </div>

    <noData style="paddingTop: 20vh" :visible="!isLoading && !allEarlyWarnings.length"></noData>
  </div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import { getEarlyWarning } from '@/module/channelManagement/api/warning'
import noData from '@/module/channelManagement/components/noData';

export default {
  mixins: [reloadApp],
  name: 'DevelopmentInfor',
  components: {
    noData
  },
  data() {
    return {
      allEarlyWarnings: [
      ],
      isLoading:false
    }
  },
  methods: {
    handleClickdesc(item) {
      this.$router.push({ name: 'warningDescDetail', params: item, query: this.$route.query})
    },
    mapClassName(item) {
      const map = {
        '1': 'extension',
        '2': 'complete',
        '3': 'processing',
        '4': 'cancel',
        '5': 'abnormal'
      }
      return map[item.status]
    }
  },
  created() {
    const { dealerId = '' } = this.$route.query
    this.isLoading = true
    getEarlyWarning({ dealerInfoId: dealerId }).then(data => {
      if (data && Array.isArray(data.allEarlyWarnings)) {
        this.allEarlyWarnings = data.allEarlyWarnings
      }
    }).finally(()=>{
      this.isLoading = false
    })

    // http://localhost:8080/wxqyh/portal/earlyPortalAction/getEarlyWarning.do?dealerInfoId=1
    // http://localhost:8080/wxqyh/portal/earlyPortalAction/getEarlyRectification.do?dealerInfoId=1&time=2019-11-01
  }
}
</script>

<style lang="scss" scoped>
.warning-desc {
  padding-bottom: 50px;
  .desc {
    margin-top: 13px;
  }
  .desc__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    margin: 10px;
    background: rgba(255, 255, 255, 1);
    padding: 15px 0 15px 15px;
    position: relative;
  }
  .desc__name {
    font-size: 17px;
    font-weight: 400;
    line-height: 24px;
    // height: 24px;
    color: rgba(68, 68, 68, 1);
  }
  .desc__reason {
    margin-top: 5px;
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 19px;
    color: rgba(153, 153, 153, 1);
  }
  .desc__status {
    position: absolute;
    width: 55px;
    height: 20px;
    background-size: 100%;
    right: 0;
    top: 17px;
  }

  .desc__item {
    border-left: 3px solid #5294FF;
  }
  .desc__item.extension {
    border-left: 3px solid #f5d023;
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_extension.png');
    }
  }

  .desc__item.complete {
    border-left: 3px solid #2dcc82;
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_complete.png');
    }
  }

  .desc__item.processing {
    border-left: 3px solid #5294ff;
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_processing.png');
    }
  }

  .desc__item.cancel {
    border-left: 3px solid #999999;
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_cancel.png');
    }
  }

  .desc__item.abnormal {
    border-left: 3px solid #ff5d83;
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_abnormal.png');
    }
  }
}
</style>