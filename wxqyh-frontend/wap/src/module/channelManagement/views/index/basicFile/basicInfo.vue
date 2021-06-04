<!-- 股东股本 -->
<template>
  <div class="basic-info">
    <template v-if="isNonEmptyObject(baseinfo)">
      <div class="header">
        <div class="header__title">
          {{baseinfo.salesStoreName}}
        </div>
      </div>
      <div class="panel">
        <div class="panel__content">
          <div class="field">


            <div class="field__item">
              <div class="field__label">销售店名称</div>
              <div class="field__value">{{baseinfo.salesStoreName||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">销售店地址</div>
              <div class="field__value">{{baseinfo.salesStoreAddress||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">服务站名称</div>
              <div class="field__value">{{baseinfo.serviceStationName||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">服务站地址</div>
              <div class="field__value">{{baseinfo.serviceStationAddress||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">店厂分离情况</div>
              <div class="field__value">{{baseinfo.factorySeparationDesc||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">店厂分离距离</div>
              <div class="field__value">{{baseinfo.factorySeparationDistance||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">销售服务合作模式</div>
              <div class="field__value">{{baseinfo.salesServiceType || '-'}}</div>
            </div>

             <div class="field__item">
              <div class="field__label">销售热线</div>
              <div class="field__value">{{baseinfo.salesPhone || '-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">销售传真</div>
              <div class="field__value">{{baseinfo.salesInvoiceInfoTax||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">所属集团</div>
              <div class="field__value">{{baseinfo.belongGroup||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">服务热线</div>
              <div class="field__value">{{baseinfo.serviceStationPhone || '-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">邮政编码</div>
              <div class="field__value">{{baseinfo.postalCode||'-'}}</div>
            </div>

          </div>
        </div>
      </div>
      <div class="gutter"></div>
    </template>

    <template v-if="isNonEmptyObject(authorityInfo)">
      <div class="panel">
        <div class="panel__title">经营权限</div>
        <div class="panel__content">
          <p class="panel__text">
            销售车型:{{authorityInfo.salesCarType||'暂无'}};
            销售区域:{{authorityInfo.salesRegionArea||'暂无'}};
            销售渠道:{{mapChannelTypeName(authorityInfo.selasChannel)}}。
          </p>
        </div>
      </div>
      <div class="gutter"></div>
    </template>

    <template v-if="isNonEmptyObject(billInfo)">
      <div class="panel">
        <div class="panel__title">开票信息（售前）</div>
        <div class="panel__content">
          <div class="field">
            <div class="field__item">
              <div class="field__label">开票名称</div>
              <div class="field__value">{{billInfo.salesInvoiceInfoName||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">税号</div>
              <div class="field__value">{{billInfo.salesInvoiceInfoTax||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">开票地址</div>
              <div class="field__value">{{billInfo.salesInvoiceInfoAddress||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">开票电话</div>
              <div class="field__value">{{billInfo.salesInvoiceInfoTel||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">开户行</div>
              <div class="field__value">{{billInfo.salesOpenBank ||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">银行账号</div>
              <div class="field__value">{{billInfo.salesInvoiceInfoAccount||'-'}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="gutter"></div>
    </template>

    <template v-if="isNonEmptyObject(billInfo)">
      <div class="panel">
        <div class="panel__title">开票信息（售后）</div>
        <div class="panel__content">
          <div class="field">
            <div class="field__item">
              <div class="field__label">开票名称</div>
              <div class="field__value">{{billInfo.afterSalesInvoiceInfoName||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">税号</div>
              <div class="field__value">{{billInfo.afterSalesInvoiceInfoTax||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">开票地址</div>
              <div class="field__value">{{billInfo.afterSalesInvoiceInfoAddress||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">开票电话</div>
              <div class="field__value">{{billInfo.afterSalesInvoiceInfoTel||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">开户行</div>
              <div class="field__value">{{billInfo.afterSalesOpenBank ||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">银行账号</div>
              <div class="field__value">{{billInfo.afterSalesInvoiceInfoAccount||'-'}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="gutter"></div>
    </template>

    <noData style="paddingTop: 20vh"
      :visible="!isLoading && !hasData" />

  </div>
</template>

<script>
import {
  getBasisInfo,
  getNoteInfo,
  getAuthorityInfo
} from '@/module/channelManagement/api/basic/index'

import reloadApp from '@/module/channelManagement/mixins/reloadApp.js'
import noData from '@/module/channelManagement/components/noData'

export default {
  mixins: [reloadApp],
  components: { noData },
  data() {
    return {
      baseinfo: {},
      billInfo: {},
      authorityInfo: {},
      isLoading: false,
    }
  },
  computed: {
    hasData() {
      return (
        this.isNonEmptyObject(this.baseinfo) ||
        this.isNonEmptyObject(this.authorityInfo) ||
        this.isNonEmptyObject(this.billInfo) ||
        this.isNonEmptyObject(this.companyInfo)
      )
    }
  },
  methods: {
    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },

    mapChannelTypeName(type) {
      const m = {
        '1': 'A岗',
        '2': 'B岗'
      }
      return m[type] || '暂无'
    },

    init() {
      const getBasisInfoPromise = getBasisInfo({ id: this.dealerId }).then(data => {
        if (data) {
          this.baseinfo = data.qrbasisVO || {}
        }
      })

      const getNoteInfoPromise = getNoteInfo({ id: this.dealerId }).then(data => {
        if (data) {
          this.billInfo = data.qrbasisVO || {}
        }
      })

      const getAuthorityInfoPromise = getAuthorityInfo({ id: this.dealerId }).then(data => {
        if (data) {
          this.authorityInfo = data.authorityPO || {}
        }
      })

      this.isLoading = true;
      Promise.all([getBasisInfoPromise, getNoteInfoPromise, getAuthorityInfoPromise]).finally(() => {
        this.isLoading = false;
      })
      
    }
  },
  created() {
    this.dealerId = this.$route.query.dealerId
    if (this.dealerId) {
      this.init()
    } else {
      this.reloadApp()
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-info {
  padding-bottom: 50px;
  .header {
    padding: 22px 15px 15px;
    border-bottom: 3px solid rgba(38, 34, 34, 1);
    background: #ffffff;
  }

  .header__title {
    height: 28px;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 24px;
    color: rgba(38, 34, 34, 1);
    background: #ffffff;
  }

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .panel {
    padding: 15px;
    background: #ffffff;
  }
  .panel__title {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding-bottom: 15px;
  }

  .panel__text {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }

  .field__item {
    display: flex;
    justify-content: space-between;
  }

  .field__label {
    font-size: 15px;
    font-weight: 400;
    line-height: 34px;
    color: rgba(153, 153, 153, 1);
    white-space: nowrap;
    margin-right: 10px;
    width: 80px;
    flex-shrink: 0;
  }
  .field__value {
    font-size: 15px;
    font-weight: 400;
    line-height: 22px;
    padding: 6px 0;
    color: rgba(51, 51, 51, 1);
  }

  .field__item--lang {
    white-space: normal;
    & > .field__value {
      line-height: 24px;
    }
  }
}
</style>

