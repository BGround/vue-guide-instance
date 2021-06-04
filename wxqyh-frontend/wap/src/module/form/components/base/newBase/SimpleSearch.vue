<template>
  <div class="search-mask">
    <div class="dark">
      <i class="s-tosearch"></i>
      <p>搜索</p>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.search-mask {
  margin: auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  z-index: 10;
  height: 52px;
  background: #fff;
  .dark {
    height: 100%;
    width: 100%;
    border-radius: 4px;
    background: #f4f6f8;
    display: flex;
    align-items: center;
    justify-content: center;
    > p {
      font-size: 14px;
      font-family: "Microsoft YaHei", "宋体", Tahoma, Arial, sans-serif;
      color: #cccccc;
      line-height: 36px;
    }
    .s-tosearch {
      width: 16px;
      height: 16px;
      display: block;
      background: url(~assets/images/ic_search.png) no-repeat;
      background-size: 14px;
      background-position: center;
      margin-right: 4px;
    }
  }
}
</style>