<template>
  <div class="second-net-rebate">

    <template v-if="hasData">
      <content-title :content="titleContent"
                     :showContent="showTitleContent"
                     name="二网返利信息"
                     padding="18px 7px 7px 18px"
      ></content-title>
      <div class="list">
        <div :key="'list'+index"
             @click="handleClick(item)"
             class="list__item"
             v-for="(item, index) in list">
          <div class="list_img" v-if="item.showroomFrontImage">
            <img :src="addImageHost(item.showroomFrontImage)" alt=""/>
          </div>
          <div class="list__info">
            <div class="list_header">
              <div class="list__name text-ellipsis">{{ item.shopName }}</div>
              <span class="list_id text-blue">{{item.shopCode||'-'}}</span>
            </div>
            <div class="list__data justify-between text-blue">
              <span class="icon_address text-ellipsis">{{item.shopArea||'-'}}</span>
              <span class="icon_tag text-ellipsis">{{item.shopLevel||'-'}}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <noData style="paddingTop: 20vh" v-if="!isLoading && !hasData"/>
  </div>
</template>

<script>
  import {getSecondNetShopByDealerId} from '@/module/channelManagement/api/building'
  import {mapMutations} from 'vuex'
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'
  import noData from '@/module/channelManagement/components/noData'
  import contentTitle from '@/module/channelManagement/components/contentTitle'

  export default {
    mixins: [reloadApp],
    components: {noData, contentTitle},
    data() {
      return {
        titleContent: [],
        showTitleContent: false,
        list: [],
        dealerId: '',
        isLoading: false,
      }
    },
    computed: {
      hasData() {
        return this.list.length > 0
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
    },
    methods: {
      ...mapMutations('secondNetDetail', {
        setNetDetail: 'setNetDetail',
      }),

      addImageHost(image) {
        return image ? (_.fileDownURL + image) : image
      },

      isNonEmptyObject(target) {
        const isObject = Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
      },

      toFormatTime(value, fmt) {
        if (!value) return
        return this.$options.filters['formatTime'](value, fmt)
      },

      handleClick(detail) {
        this.setNetDetail(detail)
        this.$router.push({
          name: 'secondNetRebateDetail',
          query: this.$route.query
        })
      },

      fetchSecondNetShopByDealerId() {
        return getSecondNetShopByDealerId({
          dealerId: this.dealerId
        }).then(data => {
          if (data && data.length) {
            data.forEach((item, index) => {
              if (index === 0) {
                this.titleContent = [
                  '更新日期：' + this.toFormatTime(item.updateTime, 'yyyy-MM-dd'),
                  '更新人：' + item.updateUser
                ]
                this.showTitleContent = item.updateTime || item.updateUser
              }
            })
            this.list = data || []
          } else {
            this.list = []
          }
        })
      },

      initData() {
        let _this = this
        this.dealerId = this.$route.query.dealerId || ''
        const p1 = this.fetchSecondNetShopByDealerId()
        this.isLoading = true;
        Promise.all([p1]).finally(() => {
          _this.isLoading = false;
        })
      }
    },
    created() {
      this.initData()
    },
    watch: {
      $route: {
        handler() {
          this.initData()
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .second-net-rebate {
    padding-bottom: 50px;
    .list {
      .list__item {
        display: flex;
        align-items: start;
        min-height: 48px;
        margin: 10px 10px 6px 10px;
        padding: 8px 10px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .1);
      }

      .list_img {
        flex: none;
        margin-right: 15px;

        & > img {
          width: 90px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
          vertical-align: middle;
        }
      }

      .list__info {
        flex: 1;

        .text-blue {
          font-size: 15px;
          font-weight: bold;
          line-height: 20px;
          color: rgba(39, 129, 219, 1);
        }

        .text-ellipsis {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }

        .list_header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;

          .list__name {
            flex: 1;
            font-size: 15px;
            font-weight: bold;
            line-height: 24px;
            color: rgba(68, 68, 68, 1);
          }

          .list_id {
            flex: none;
            padding-left: 10px;
          }
        }

        .list__data {
          display: flex;
          align-items: center;
          margin-top: 15px;

          &.justify-between {
            justify-content: space-between;
          }

          &.justify-start {
            justify-content: flex-start;
          }

          & > span {
            position: relative;
            padding-left: 20px;

            &:before {
              position: absolute;
              content: "";
              width: 15px;
              height: 15px;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              background-repeat: no-repeat;
              background-size: 100%;
            }

            &.icon_address {
              &::before {
                background-image: url("~@/module/channelManagement/static/images/icon_building_address_blue.png");
              }
            }

            &.icon_tag {
              &::before {
                background-image: url("~@/module/channelManagement/static/images/icon_building_tag_blue.png");
              }
            }
          }

          & > span + span {
            margin-left: 5px;
          }
        }
      }
    }
  }
</style>
