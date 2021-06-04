<template>
  <div class="qw-nodata">
    <div class="qw-nodata-content">
      <div class="ico-nodata"></div>
      <p>{{tips}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "QwNodata",
  props: {
    tips: {
      type: String,
      default: "暂无数据"
    }
  }
};
</script>

<style lang="scss" scoped>
.qw-nodata {
  width: 100%;
  height: 100%;
  position: relative;
  &-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 15%;
    margin: auto;
    .ico-nodata {
      display: block;
      margin: auto;
      width: 80px;
      height: 80px;
      background: url(~assets/images/noData.png) no-repeat;
      background-size: contain;
    }
    p {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>


