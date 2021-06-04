<template>
  <div class="second-net-rebate-detail">

    <template v-if="isNonEmptyObject(detail)">
      <content-title :showContent="detail.updateTime || detail.updateUser"
                     :name="(detail.shopName || '')+'   建店返利'"
                     padding="18px 7px 0 18px"
      ></content-title>
      <div class="field">
        <div class="field__item">
          <div class="field__label">区县</div>
          <div class="field__value">{{detail.shopArea||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">二网代码</div>
          <div class="field__value">{{detail.shopCode||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">二网名称</div>
          <div class="field__value">{{detail.shopName ||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">公司名称</div>
          <div class="field__value">{{detail.companyName||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">店面级别</div>
          <div class="field__value">{{detail.shopLevel||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">地址</div>
          <div class="field__value">{{detail.address ||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">开始时间</div>
          <div class="field__value">{{detail.cashTime||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">运营期满时间</div>
          <div class="field__value">{{detail.dueTime||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">返利总额(万元)</div>
          <div class="field__value">{{detail.cashAmount|formatAmount}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">累计返利实际兑现额(万元)</div>
          <div class="field__value">{{detail.actualCashRebateAmount|formatAmount}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">返利余额(万元)</div>
          <div class="field__value">{{detail.balanceRebate|formatAmount}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">备注</div>
          <div class="field__value">{{detail.mark||'-'}}</div>
        </div>

      </div>
    </template>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'
  import contentTitle from '@/module/channelManagement/components/contentTitle'
  export default {
    mixins: [reloadApp],
    components: {contentTitle},
    data() {
      return {
        detail: {}
      }
    },
    computed: {
      ...mapGetters('secondNetDetail', [
        'getNetDetail'
      ]),
      hasData() {
        return this.isNonEmptyObject(this.detail);
      }
    },
    filters: {
      formatTime(value, fmt) {
        if (value) {
          let da
          if (typeof value == 'string') {
            if (value.indexOf(".") > -1) {
              // 有些日期接口返回带有.0。
              value = value.substring(0, value.indexOf("."));
            }
            value = value.replace(/-/g, '/')
          }
          da = new Date(value)
          let o = {
            'M+': da.getMonth() + 1, //月份
            'd+': da.getDate(), //日
            'h+': da.getHours(), //小时
            'm+': da.getMinutes(), //分
            's+': da.getSeconds(), //秒
            'q+': Math.floor((da.getMonth() + 3) / 3), //季度
            S: da.getMilliseconds() //毫秒
          }
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (da.getFullYear() + '').substr(4 - RegExp.$1.length))
          }
          for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
              fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            }
          }
          return fmt
        } else {
          return value || '-'
        }
      },
      formatAmount(value, fmt) {
        if(value){
          return value;
        }else{
          return typeof value === 'number'? value : '-'
        }
      },
    },
    methods: {
      isNonEmptyObject(target) {
        const isObject = Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
      },

      toFormatTime(value, fmt) {
        if (!value) return
        return this.$options.filters['formatTime'](value, fmt)
      },
    },
    mounted() {
    },
    created() {
      this.detail = this.getNetDetail
    }
  }
</script>
<style lang="scss" scoped>
  .second-net-rebate-detail {
    margin-bottom: 50px;

    .slide-container {
      height: 170px;
      background: #ffffff;
    }

    .gutter {
      height: 8px;
      background: rgba(245, 245, 245, 1);
    }

    .field {
      padding: 15px;
      background: #fff;

      .field__item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        line-height: 34px;

        .field__label {
          width: 150px;
          font-size: 15px;
          font-weight: bold;
          color: rgba(39, 129, 219, 1);
          white-space: nowrap;
          margin-right: 10px;
          padding-left: 8px;
          position: relative;

          &:before {
            position: absolute;
            top: 0;
            left: 0;
            content: "·";
            width: 8px;
          }
        }

        .field__value {
          font-size: 15px;
          font-family: PingFang SC;
          font-weight: 400;
          // line-height: 20px;
          color: rgba(51, 51, 51, 1);
          margin-left: auto;
          text-align: end;
        }
      }

      .field__item--lower {
        padding: 0 10px;

        & > .field__label,
        & > .field__value {
          color: rgba(153, 153, 153, 1);
        }
      }
    }
  }
</style>
