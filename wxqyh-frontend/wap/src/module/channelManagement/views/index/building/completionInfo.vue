<template>
  <div class="completion-info">
    <qw-tab-bar @change="handleChangeTab"
      v-model="selectedTapIndex"
      :data="tabs">
    </qw-tab-bar>

    <div class="section--before"
      v-if="getImageList.length">
      <div class="slide-container"
        style="background: #ffffff; height:'400px'">
        <qw-slide :data="addImageHost(getImageList)">
        </qw-slide>
      </div>
    </div>

    <template v-if="isNonEmptyObject(info)">
      <div class="field">
        <div class="field__item">
          <div class="field__label">建设类型</div>
          <div class="field__value">{{info.buildType||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">开工时间</div>
          <div class="field__value">{{info.startTime||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">完工时间</div>
          <div class="field__value">{{info.completeTime||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">转正时间</div>
          <div class="field__value">{{info.returnTime||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">建设级别</div>
          <div class="field__value">{{info.buildLevel||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">店面级别</div>
          <div class="field__value">{{info.shopLevel||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">店面性质</div>
          <div class="field__value">{{info.shopNature||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">是否店厂分离</div>
          <div class="field__value">{{info.isSeparation ||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">启动协议完工时间</div>
          <div class="field__value">{{info.startProtocolCompleteTime ||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">延期次数</div>
          <div class="field__value">{{info.postponeCount}}次</div>
        </div>

        <div class="field__item">
          <div class="field__label">最终协议完工时间</div>
          <div class="field__value">{{info.endProtocolCompleteTime||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">建设过程节点</div>
          <div class="field__value"></div>
          <div class="field__icono"
          @click="handleClickNodes"><img :src="iconArrowRight"
            alt=""></div>
        </div>

        <div class="field__item">
          <div class="field__label">验收日期</div>
          <div class="field__value">{{info.acceptanceTime||'-'}}</div>
        </div>
        <div class="field__item">
          <div class="field__label">店面变更次数</div>
          <div class="field__value">{{info.shopChangeCount}}次</div>
          <!-- <div class="field__icono"
          @click="handleClickStore"><img :src="iconArrowRight"
            alt=""></div> -->
        </div>

        <div class="field__item">
          <div class="field__label">建设阶段明细</div>
          <div class="field__value">{{info.buildDetail||'-'}}</div>
        </div>

      </div>
    <div class="gutter"></div>
    </template>

    <noData style="paddingTop: 20vh" v-if="!isLoading && !hasData" />

    <qw-popup v-model="isVisibleNodeModal"
      position="center">
      <div class="node-list">
        <h3>建设过程节点</h3>
        <p>2000年3月1日启动建设</p>
        <p>2000年3月20日完成墙面粉刷</p>
        <p>2000年4月20日完成地板铺设</p>
      </div>
    </qw-popup>

    <qw-popup v-model="isVisibleStoreModal"
      position="center">
      <div class="node-list">
        <h3>建设过程节点</h3>
        <p class="panel__text"
          v-if="processData.startTime1 && processData.mark1">
          {{processData.startTime1 | formatTime}}{{processData.mark1}}；
        </p>
        <p class="panel__text"
          v-if="processData.startTime2 && processData.mark2">
          {{processData.startTime2 | formatTime}}{{processData.mark2}}；
        </p>
        <p class="panel__text"
          v-if="processData.startTime3 && processData.mark3">
          {{processData.startTime3 | formatTime}}{{processData.mark3}}；
        </p>
        <p class="panel__text"
          v-if="processData.startTime4 && processData.mark4">
          {{processData.startTime4 | formatTime}}{{processData.mark4}}；
        </p>
        <p class="panel__text"
          v-if="processData.startTime5 && processData.mark5">
          {{processData.startTime5 | formatTime}}{{processData.mark5}}；
        </p>
        <p class="panel__text"
          v-if="processData.startTime6 && processData.mark6">
          {{processData.startTime6 | formatTime}}{{processData.mark6}}；
        </p>
      </div>
    </qw-popup>
  </div>
</template>

<script>
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import { getsaleImg, getConstructionProcess } from '@/module/channelManagement/api/building/index'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'

import {
  getImageDisplay,
  getShopInfoByErpNo
} from '@/module/channelManagement/api/building'
import noData from '@/module/channelManagement/components/noData';
export default {
  mixins: [reloadApp],
  components: {noData},
  data() {
    return {
      isVisibleNodeModal: false,
      isVisibleStoreModal: false,
      iconArrowRight,
      selectedTapIndex: 'before',
      tabs: [
        {
          value: 'before',
          label: '售前建设信息'
        },
        {
          value: 'after',
          label: '售后建设信息'
        }
      ],
      list: [],
      imageListBeforeSale: [],
      imageListAfterSale: [],
      info: {},
      processData: {},
      isLoading: false,
    }
  },
  filters: {
    formatTime(time) {
      if (typeof time === 'object' && time !== null) {
        return `${time.year}年${time.month}月${time.day}日`
      }
      return ''
    }
  },
  computed: {
    getImageList() {
      if (this.selectedTapIndex === 'before') {
        return this.imageListBeforeSale || []
      } else {
        return this.imageListAfterSale || []
      }
    },
    hasData(){
      return this.getImageList.length > 0 || this.isNonEmptyObject(this.info);
    }
  },
  methods: {
    addImageHost(imageList) {
      // debugger
      // return imageList
      return imageList.map(item => _.fileDownURL + item)
    },

    handleClickNodes() {
      this.isVisibleStoreModal = true
    },
    handleClickStore() {
      this.isVisibleStoreModal = true
    },

    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },
    /**
     *
     */
    handleChangeTab(value) {
      console.log(value)
    }
  },
  mounted() {
    const dealerId = this.$route.query.dealerId || ''
    getsaleImg({ dealerId }).then(data => {
      if (data) {
        this.list = data.saleImgPOS || []
      }
    })
  },
  created() {
    const erpCarNo = this.$route.query.erpCarNo || ''
    const dealerInfoId = this.$route.query.dealerId || ''

    /**
     *
     */
    const p1 = getShopInfoByErpNo({ dealerId: dealerInfoId }).then(data => {
      if (data) {
        this.info = data
      }
    })

    const p2 = getImageDisplay({ dealerInfoId }).then(data => {
      if (data) {
        if (data.hallFrontImg) {
          this.imageListBeforeSale.push(data.hallFrontImg)
        }
        if (data.hall45Img) {
          this.imageListBeforeSale.push(data.hall45Img)
        }
        if (data.hallInsideFrontImg) {
          this.imageListBeforeSale.push(data.hallInsideFrontImg)
        }
        if (data.saleReceptionDeskImg) {
          this.imageListBeforeSale.push(data.saleReceptionDeskImg)
        }

        if (data.serviceStationFrontImg) {
          this.imageListAfterSale.push(data.serviceStationFrontImg)
        }
        if (data.antechamberImg) {
          this.imageListAfterSale.push(data.antechamberImg)
        }
        if (data.lounge) {
          this.imageListAfterSale.push(data.lounge)
        }
        if (data.plant) {
          this.imageListAfterSale.push(data.plant)
        }
      }
    })

    const p3 = getConstructionProcess({ dealerId:dealerInfoId }).then(data => {
      if (data && data.constructionProcessPos) {
        this.processData = data.constructionProcessPos
      }
    })

    this.isLoading = true;
    Promise.all([p1, p2, p3]).finally(()=>{
      this.isLoading = false;
    })
  }
}
</script>
<style lang="scss" scoped>
.completion-info {
 
  margin-bottom: 50px;

  .slide-container {
    height: 170px;
  }

  .node-list {
    background: #ffffff;
    height: 210px;
    width: 325px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(112, 112, 112, 1);
    border-radius: 4px;
    padding: 13px 15px;
    & > h3 {
      height: 24px;
      font-size: 17px;
      font-weight: 600;
      line-height: 24px;
      color: rgba(0, 0, 0, 1);
      padding-bottom: 27px;
    }
    & > p {
      font-size: 15px;
      font-weight: 400;
      line-height: 34px;
      color: rgba(51, 51, 51, 1);
    }
  }

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .field {
    padding: 15px;
    background: #fff;
  }

  .field__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .field__label {
    font-size: 15px;
    font-weight: 400;
    line-height: 34px;
    color: rgba(153, 153, 153, 1);
    white-space: nowrap;
    margin-right: 10px;
  }
  .field__value {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 34px;
    color: rgba(51, 51, 51, 1);
    margin-left: auto;
  }

  .field__item--lang {
    white-space: normal;
    & > .field__value {
      line-height: 24px;
    }
  }

  .field__icono {
    width: 7px;
    height: 11px;
    margin-left: 5px;
    & > img {
      width: 100%;
      vertical-align: top;
    }
  }
}
</style>