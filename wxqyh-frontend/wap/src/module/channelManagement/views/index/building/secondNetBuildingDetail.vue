<template>
  <div class="second-net-building-detail">

    <template v-if="getImageList.length">
      <div class="slide-container">
        <qw-slide :data="addImageHost(getImageList)"></qw-slide>
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
          <div class="field__label">返利时间</div>
          <div class="field__value">{{detail.rebateTime||'-'}}</div>
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
    </template>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'

  export default {
    mixins: [reloadApp],
    components: {},
    data() {
      return {
        detail: {}
      }
    },
    computed: {
      ...mapGetters('secondNetDetail', [
        'getNetDetail'
      ]),
      getImageList() {
        return this.detail && this.detail.imageList || []
      },
      hasData() {
        return this.getImageList.length > 0 || this.isNonEmptyObject(this.detail);
      }
    },
    methods: {
      addImageHost(imageList) {
        return imageList.map(item => _.fileDownURL + item)
      },

      isNonEmptyObject(target) {
        const isObject = Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
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
  .second-net-building-detail {
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

    /deep/ .qw-slide-item{
      img{
        width: 100%;
        height: 170px;
        object-fit: cover;
      }
    }
  }
</style>
