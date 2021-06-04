<!-- 预警陈述 -->
<template>
  <div class="warning-desc">
    <div class="desc"  v-if="allEarlyWarnings.length">
      <div class="desc__item"
        :class="mapClassName(item)"
        v-for="(item, index) in allEarlyWarnings"
        @click="handleClickdesc(item)"
        :style="item.warningType == '1' ? 'border-left: 3px solid #C6001F;' : 'border-left: 3px solid #FFBC00;'"
        :key="index">
        <div class="desc__info">
          <h4 class="desc__name">{{item.warningTime}}预警陈述</h4>
          <p class="desc__reason">异常原因：{{item.exceptionCause}}</p>
        </div>
        <i class="desc__status"></i>
      </div>
    </div>
    <!-- 如果不处于加载中状态 && 请求数据为空则显示无数据图片 -->
    <noData style="paddingTop: 20vh" :visible="!isLoading && !allEarlyWarnings.length"></noData>
  </div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import { getEarlyWarningList } from '@/module/channelManagement/api/warning'
import noData from '@/module/channelManagement/components/noData';
import contentTitle from '@/module/channelManagement/components/contentTitle';

export default {
  mixins: [reloadApp],
  name: 'DevelopmentInfor',
  components: {
    noData,
      contentTitle
  },
  data() {
    return {
      allEarlyWarnings: [],
      isLoading: false,
        updateUser: '',
        updateTime: '',
    }
  },
  methods: {

      toFormatTime(value, fmt) {
          if(!value) return
          return this.$options.filters['formatTime'](value, fmt)
      },

    handleClickdesc(item) {
      this.$router.push({ name: 'warningDetail', params: item, query: this.$route.query})
    },
    mapClassName(item) {
      const map = {
        '3': 'extension',
        '1': 'complete',
        '2': 'processing',
        '0': 'cancel',
        '4': 'abnormal'
      }
      return map[item.finishState]
    }
  },
  created() {
    const erpId = this.$route.query.dealerId
    getEarlyWarningList(erpId).then(res => {
      let data = res.earlyWarningList || {}
      if (data && Array.isArray(data)){
        this.allEarlyWarnings = data
          // this.updateUser = '';
          // this.updateTime = '';
      }
    })
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

  .desc__item.extension {
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_extension.png');
    }
  }

  .desc__item.complete {
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_complete.png');
    }
  }

  .desc__item.processing {
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_processing.png');
    }
  }

  .desc__item.cancel {
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_cancel.png');
    }
  }

  .desc__item.abnormal {
    .desc__status {
      background-image: url('~@/module/channelManagement/static/images/icon_abnormal.png');
    }
  }
}
</style>
