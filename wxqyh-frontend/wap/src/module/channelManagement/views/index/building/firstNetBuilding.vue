<template>
  <div class="first-net-building">
    <template v-if="isNonEmptyObject(detail)">
      <content-title :content="[
                      '更新日期：'+ toFormatTime(detail.updateTime, 'yyyy-MM-dd'),
                      '更新人：'+ detail.updateUser
                     ]"
                     :showContent="detail.updateTime || detail.updateUser"
                     name="一网建设信息"
      ></content-title>
    </template>

    <qw-tab-bar :data="tabs"
                @change="handleChangeTab"
                v-model="selectedTapIndex">
    </qw-tab-bar>

    <template v-if="getBanners.length">
      <div class="slide-container">
        <qw-slide :data="getBanners"></qw-slide>
      </div>
    </template>

    <template v-if="isNonEmptyObject(detail)">
      <div class="field">
        <div class="field__item">
          <div class="field__label">类别</div>
          <div class="field__value">{{detail.category||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">建设性质</div>
          <div class="field__value">{{detail.buildNature||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">启动建设时间</div>
          <div class="field__value">{{detail.startBuildTime ||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">转正时间</div>
          <div class="field__value">{{detail.employTime||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">店面级别</div>
          <div class="field__value">{{detail.shopLevel||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">是否店厂分离</div>
          <div class="field__value">{{detail.storeSeparation ||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">开工时间</div>
          <div class="field__value">{{detail.startWorkTime||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">完工时间</div>
          <div class="field__value">{{detail.endWorkTime||'-'}}</div>
        </div>
      </div>
      <div class="gutter"></div>
    </template>

    <noData style="paddingTop: 20vh" v-if="!isLoading && !hasData"/>
  </div>
</template>

<script>
  import {getOneNetBuildManageVOByCategory} from '@/module/channelManagement/api/building/index'
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'
  import noData from '@/module/channelManagement/components/noData';
  import contentTitle from '@/module/channelManagement/components/contentTitle';

  export default {
    mixins: [reloadApp],
    components: {noData, contentTitle},
    data() {
      return {
        dealerId: '',
        selectedTapIndex: 'before',
        tabs: [
          {
            value: 'before',
            label: '售前'
          },
          {
            value: 'after',
            label: '售后'
          }
        ],
        detail: {},
        isLoading: false,
          beforeSaleImages: [],
          afterSaleImages: []
      }
    },
    computed: {
      // getImageList() {
      //   return this.detail && this.detail.imageList && this.detail.imageList[this.selectedTapIndex] || []
      // },
        getBanners(){
            // console.log(this.selectedTapIndex, 'xxx')
            if(this.selectedTapIndex === 'before'){
                return this.beforeSaleImages.map(item => _.fileDownURL + item);
            }
            return this.afterSaleImages.map(item => _.fileDownURL + item);
        },
      hasData() {
        return this.getBanners.length > 0 || this.isNonEmptyObject(this.detail);
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
      addImageHost(imageList) {
        return imageList.map(item => _.fileDownURL + item)
      },

      isNonEmptyObject(target) {
        const isObject = Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
      },

      toFormatTime(value, fmt) {
        if (!value) return
        return this.$options.filters['formatTime'](value, fmt)
      },

      handleChangeTab(val) {
        this.selectedTapIndex = val;
        // this.detail = {};
        // this.initData()
          // console.log(val,'2')
      },

      fetchOneNetBuildManageVOByCategory() {
        const params = {
          dealerId: this.dealerId,
          // category: this.selectedTapIndex, // 类别（3S：售前，4S：售后）
        }
        return getOneNetBuildManageVOByCategory(params).then(data => {
          if (data) {
              const beforeSaleImages = [];
              const afterSaleImages = []

              if(data.category === '3S'){
                  //售后展示服务站正面照片、接待室照片、休息室照片、车间照片这四张

                  if (data.serviceStationImage) { // 服务站正面照片
                      afterSaleImages.push(data.serviceStationImage)
                  }
                  if (data.receptRoomImage) { // 接待室照片
                      afterSaleImages.push(data.receptRoomImage)
                  }
                  if (data.loungeImage) { // 休息室照片
                      afterSaleImages.push(data.loungeImage)
                  }
                  if (data.workshopImage) { // 车间照片
                      afterSaleImages.push(data.workshopImage)
                  }
              }

              if(data.category === '4S'){
                  //售前就展示展厅正面照片、展厅45°照片、展厅内部照片、销售接待台照片这四张图片，
                  if (data.showroomFrontImage) { // 展厅正面照片
                      beforeSaleImages.push(data.showroomFrontImage)
                  }
                  if (data.showroomFiveImage) { // 展厅45°照片
                      beforeSaleImages.push(data.showroomFiveImage)
                  }
                  if (data.showroomInsideImage) { // 展厅内部照片
                      beforeSaleImages.push(data.showroomInsideImage)
                  }
                  if (data.salesReceptionImage) { // 销售接待台照片
                      beforeSaleImages.push(data.salesReceptionImage)
                  }

                  //售后展示服务站正面照片、接待室照片、休息室照片、车间照片这四张

                  if (data.serviceStationImage) { // 服务站正面照片
                      afterSaleImages.push(data.serviceStationImage)
                  }
                  if (data.receptRoomImage) { // 接待室照片
                      afterSaleImages.push(data.receptRoomImage)
                  }
                  if (data.loungeImage) { // 休息室照片
                      afterSaleImages.push(data.loungeImage)
                  }
                  if (data.workshopImage) { // 车间照片
                      afterSaleImages.push(data.workshopImage)
                  }
              }

              this.beforeSaleImages = beforeSaleImages;
              this.afterSaleImages = afterSaleImages;

            this.detail = data
          }
        })
      },

      initData() {
        let _this = this
        this.dealerId = this.$route.query.dealerId || ''
        const p1 = this.fetchOneNetBuildManageVOByCategory()
        this.isLoading = true;
        Promise.all([p1]).finally(() => {
          _this.isLoading = false;
        })
      }
    },
    watch: {
      '$route.query':function(){
        this.initData()
      }
    },
    created() {
      this.initData()
    }
  }
</script>
<style lang="scss" scoped>
  .first-net-building {
    margin-bottom: 50px;

    .slide-container {
      height: 170px;
      background: #ffffff;
      touch-action: none;
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

    /deep/ .qw-slide-item{
      img{
        width: 100%;
        height: 170px;
        object-fit: cover;
      }
    }
  }
</style>
