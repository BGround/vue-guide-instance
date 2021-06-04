<template>
  <div class="first-net-rebate">
    <template v-if="hasNetList">
      <content-title
        :content="titleContent"
        :showContent="true"
        name="一网建店返利"
        padding="18px 7px 5px 18px"
      ></content-title>
      <div :key="'section'+index" class="section" v-for="(section, index) in list">
        <div :class="{'is-open': section.open}" class="title">
          <p class="title__name">【{{section.status}}】</p>
          <i :class="{'is-open':section.open}"
             @click="()=>{section.open = !section.open}"
             class="title__icon">
            <img :src="iconArrowDown" alt="">
          </i>
        </div>
        <div v-for="(item,i) in section.data" v-if="section.open">
          <div class="gutter" v-if="i > 0"></div>
          <div class="field">
            <div class="field__item">
              <div class="field__label">建店级别</div>
              <div class="field__value">{{item.storeBuildingLevel ||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">奖励标准</div>
              <div class="field__value">{{item.rewardCriteria || '-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">开始时间</div>
              <div class="field__value">{{item.startTime ||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">应关闭时间</div>
              <div class="field__value">{{item.shouldEndTime ||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">实际关闭时间</div>
              <div class="field__value">{{item.actualEndTime ||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">应兑现（万）</div>
              <div class="field__value">{{item.shouldCash |formatAmount}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">已兑现（万）</div>
              <div class="field__value">{{item.actualCash|formatAmount}}</div>
            </div>

            <div class="field__item field__item--lower">
              <div class="field__label">首兑金额</div>
              <div class="field__value">{{item.firstExchangeAmount|formatAmount}}</div>
            </div>

            <div class="field__item field__item--lower">
              <div class="field__label">提车折让金额</div>
              <div class="field__value">{{item.carCollectionAllowance|formatAmount}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">余额（万）</div>
              <div class="field__value">{{item.balance|formatAmount}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">核算方式</div>
              <div class="field__value">{{item.accountWay||'-'}}</div>
            </div>

            <div class="field__item">
              <div class="field__label">备注</div>
              <div class="field__value">{{item.mark||'-'}}</div>
            </div>

          </div>
        </div>
        <div class="gutter"></div>
      </div>
    </template>

    <noData style="paddingTop: 20vh" v-if="!isLoading && !hasNetList"/>
  </div>
</template>

<script>
  import {getOneNetStoreRebateVOByCategory} from '@/module/channelManagement/api/building'
  import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'
  import noData from '@/module/channelManagement/components/noData'
  import contentTitle from '@/module/channelManagement/components/contentTitle';

  export default {
    mixins: [reloadApp],
    components: {
      noData, contentTitle
    },
    data() {
      return {
        titleContent: [
            '更新日期：暂无',
            '更新部门：暂无'
        ],
        showTitleContent: false,
        iconArrowDown,
        list: [],
        dealerId: '',
        isLoading: false,
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
    computed: {
      hasNetList() {
        return !!this.list.length;
      }
    },
    methods: {
      fetchOneNetStoreRebateVOByCategory() {
        return getOneNetStoreRebateVOByCategory({dealerId: this.dealerId}).then(data => {
          if (data) {
              if(data.lastUpdateVO){
                  this.titleContent = [
                      '更新日期：' + ( data.lastUpdateVO.updateTime?  this.toFormatTime(data.lastUpdateVO.updateTime, 'yyyy-MM-dd'): '暂无'),
                      '更新人：' + (data.lastUpdateVO.updateUser? data.lastUpdateVO.updateUser: '暂无')
                  ]
                  this.showTitleContent = true
              }
            let list = []
            let cashInList = data.oneNetStoreRebateVOByActualList
            if (cashInList && cashInList.length) {
              list.push({
                data: cashInList,
                status: cashInList[0].status,
                open: true
              })
            }
            let closedList = data.oneNetStoreRebateVOByClosedList
            if (closedList && closedList.length) {
              list.push({
                data: closedList,
                status: closedList[0].status,
                open: false
              })
            }
            this.list = list || []
          }
        })
      },

      isNonEmptyObject(target) {
        const isObject = Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
      },

      toFormatTime(value, fmt) {
        if (!value) return
        return this.$options.filters['formatTime'](value, fmt)
      },
    },
    created() {
      this.dealerId = this.$route.query.dealerId || ''
      this.isLoading = true
      this.fetchOneNetStoreRebateVOByCategory().finally(() => {
        this.isLoading = false
      })
    },
    watch: {
      $route: {
        handler() {
          this.dealerId = this.$route.query.dealerId || ''
          this.isLoading = true
          this.fetchOneNetStoreRebateVOByCategory().finally(() => {
            this.isLoading = false
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .first-net-rebate {
    margin-bottom: 50px;

    .section {
      background: #ffffff;

      .title {
        justify-content: space-between;
        display: flex;
        align-items: center;
        padding: 12px 20px;

        &.is-open {
          padding: 12px 20px 0;
        }

        .title__name {
          height: 24px;
          font-size: 17px;
          line-height: 24px;
          color: rgba(0, 0, 0, 1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .title__icon {
          width: 20px;
          height: 24px;
          line-height: 24px;
          display: block;
          text-align: center;
          transition: transform 0.4s ease;

          & > img {
            width: 11px;
            height: 7px;
            vertical-align: middle;
          }

          &.is-open {
            transform: rotateZ(180deg);
          }
        }
      }
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
        align-items: center;
        line-height: 34px;

        .field__label {
          width: 150px;
          font-size: 15px;
          font-weight: bold;
          color: rgba(39, 129, 219, 1);
          white-space: nowrap;
          margin-right: 10px;
          padding-left: 13px;
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
          line-height: 20px;
          color: rgba(51, 51, 51, 1);
          margin-left: auto;
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
