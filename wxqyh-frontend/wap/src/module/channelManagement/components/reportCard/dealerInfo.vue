<template>

  <div class="dealer-info">

    <div class="basic"
      @click="handleClick">
      <div class="basic__avatar">
        <img :src="getAvatar"
          v-img-fallback
          alt="">
      </div>
      <div class="basic__info">
        <p class="basic__name">{{getName}}</p>
        <p class="basic__date">{{getDate}}</p>
        <p class="basic__address" v-if="getAddress">{{getAddress}}</p>

      </div>
      <div class="basic__status" v-if="getStatusText">
        <span :style="{backgroundColor: getStatusColor}">{{getStatusText}}</span>
      </div>
    </div>

    <div class="detail">
      <div class="detail__item" v-for="(item, index) in getExtra" :key="index">
        <p class="detail__label">{{item.label}}</p>
        <p class="detail__value">{{item.value}}</p>
      </div>
    </div>

  </div>

</template>

<script>
import defaultAvatar from '@/module/channelManagement/static/images/logo.jpg'
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    getAvatar() {
      return this.data.avatar || defaultAvatar
    },
    getName() {
      return this.data.name || ''
    },
    getDate() {
      return this.data.date || ''
    },
    getAddress(){
      return this.data.address || ''
    },
    getStatusText() {
      return this.data.statusText || ''
    },
    getStatusColor(){
      return this.data.statusColor || ''
    },
    getExtra(){
      return this.data.extra || [];
    }
  },
  methods: {
    handleClick() {}
  },
  created() {
    console.log(this.data);
  }
}
</script>

<style lang="scss" scoped>
.dealer-info {
  .basic {
    padding: 15px 15px 15px 19px;
    background: #ffffff;
    display: flex;
    align-items: center;
    .basic__avatar {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
      padding-right: 10px;
      & > img {
        width: 100%;
      }
    }
    .basic__status {
      flex-shrink: 0;
      padding-left: 10px;
      & > span {
        height: 20px;
        padding: 0 5px;
        background: #5294FF;
        border-radius: 2px;
        text-align: center;
        display: block;
        font-size: 12px;
        line-height: 20px;
        color: rgba(255, 255, 255, 1);
      }
    }
    .basic__info {
      width: calc(100% - 120px);
    }
    .basic__date,
    .basic__address {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 18px;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 18px;
      color: rgba(153, 153, 153, 1);
      // margin-top: 7px;
    }
    .basic__name {
      height: 22px;
      font-size: 16px;
      line-height: 22px;
      color: rgba(51, 51, 51, 1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-bottom: 2px;
    }
  }
  .detail {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    border-top: 1px solid rgba(219, 219, 219, 1);
    border-bottom: 1px solid rgba(219, 219, 219, 1);
    .detail__item {
      box-sizing: border-box;
      height: 60px;
      width: 33.3%;
      text-align: center;
      padding: 12px 0 0;
      border-right: 1px solid rgba(219, 219, 219, 1);
    }
    .detail__item:last-child {
      border-right: none;
    }
    .detail__label {
      text-align: center;
      height:17px;
      font-size:12px;
      font-weight:400;
      line-height:17px;
      color:rgba(153,153,153,1);

    }
    .detail__value {
      text-align: center;
      height:21px;
      font-size:15px;
      font-weight:400;
      line-height:21px;
      color:rgba(0,0,0,1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
