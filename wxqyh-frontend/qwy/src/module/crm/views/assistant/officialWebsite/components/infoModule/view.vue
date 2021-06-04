<template>
  <div class="information_view">
    <div class="infoItem"
         v-for="(item, index) in option.detail"
         v-show="item.display == 1"
         :key="index">
      <div class="text_item">
        <h1>{{item.title}}</h1>
        <p>{{item.releaseTime}}</p>
      </div>
      <div class="img_item">
        <img :src="item.picPath || defaultImg"
             alt="item.picTitle">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      defaultImg: require('assets/images/img_default.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.information_view {
  padding: 5px;
  min-height: 25px;
  .infoItem {
    display: flex;
    justify-content: center;
    border-bottom: 1px #f0f0f0 solid;
    padding: 10px 5px 10px;
  }
  .text_item {
    color: #333;
    font-size: 14px;
    margin-right: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h1 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      font-size: 14px;
      line-height: 22px;
      color: #343434;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;
      margin-right: 5px;
      margin-bottom: 5px;
      word-break: break-all;
    }
    p {
      color: #b2b9c8;
      font-size: 12px;
    }
  }
  .img_item {
    border-radius: 4px;
    font-size: 0;
    overflow: hidden;
    img {
      width: 100px;
      height: 70px;
    }
  }
}
</style>


