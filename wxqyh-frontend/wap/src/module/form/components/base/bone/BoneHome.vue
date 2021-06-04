<template>
  <div class="main-bone">
    <p class="top-line"><span></span><span></span><span></span></p>
    <div class="hearder-box">
      <div class="inner"></div>
    </div>
    <div class="text"></div>
    <div class="form-app-list">
      <div class="form-app-container" v-for="n in 30" :key="n">
        <div class="form-app-item"></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
     return {}
   },
   components: {}
}
</script>

<style lang="scss" scopedSlots>
$baseColor: #f7f8fa;
.main-bone {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 5;
  overflow: hidden;
  @media screen and (min-width: 1024px){
    width: 740px;
    margin: auto;
  }
  .top-line {
    margin-top: 16px;
    overflow: hidden;
    > span {
      height: 20px;
      display: inline-block;
      background: $baseColor;
      &:first-child {
        width: 72px;
        float: left;
        margin-left: 14px;
        border-radius: 5px;
      }
      &:nth-child(3) {
        width: 59px;
        float: right;
        margin-right: 20px;
        border-radius: 13px;
      }
      &:nth-child(2) {
        width: 40px;
        float: right;
        border-radius: 13px 0 0 13px;
      }
    }
  }
  .hearder-box {
    padding: 0 14px;
    margin-top: 16px;
    .inner {
      height: 136px;
      background: $baseColor;
      border-radius: 6px;
    }
  }
  .text {
    width: 56px;
    height: 20px;
    margin: 24px 0 0 14px;
    background: $baseColor;
    border-radius: 5px;
  }
  .form-app-list {
    display: flex;
    padding: 4px 14px 0;
    flex-flow: row wrap;
    position: relative;
    margin-top: 12px;
    .form-app-container {
      height: 64px;
      flex: 50%;
      max-width: 50%;
      min-width: 50%;
      margin-bottom: 16px;
      background: #fff;
      box-sizing: border-box;
      @media screen and (max-width: 740px) {
        padding: 0 11px 0 0;
        &:nth-of-type(2n) {
          padding: 0 0 0 11px;
        }
      }
      @media screen and (min-width: 740px) {
        flex: 33.3%;
        max-width: 33.3%;
        min-width: 33.3%;
        &:nth-of-type(3n-2) {
          padding: 0 11px 0 0;
        }
        &:nth-of-type(3n-1) {
          padding: 0 11px;
        }
        &:nth-of-type(3n) {
          padding: 0 0 0 11px;
        } 
      }
      .form-app-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        background: $baseColor;
        padding: 0 12px 0 61px;
        border-radius:8px;
      }
    }
  }
}
</style>