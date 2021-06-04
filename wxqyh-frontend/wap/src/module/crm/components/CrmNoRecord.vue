<template>
  <div class="crm-no-record">
    <div class="crm-no-record-img"
         :type="type"></div>
    <div class="crm-no-record-tips">{{text}}</div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "crmNoRecord",
  props: {
    tips: {
      type: String
    },
    type: {
      default: "noData", //noData,noSearch,noPromise
      type: String
    }
  },
  computed: {
    text() {
      let _text;
      if (this.tips) {
        _text = this.tips;
      } else {
        switch (this.type) {
          case "noData":
            _text = "暂无数据";
            break;
          case "noSearch":
            _text = "没有搜索结果";
            break;
          case "noPromise":
            _text = "没有权限";
            break;
        }
      }
      return _text;
    }
  }
};
</script>

<style lang="scss" scoped>
.crm-no-record {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-img {
    margin-top: 87px;
    width: 160px;
    height: 160px;
    background: url("~assets/images/crm/crm_nocomment.png") no-repeat;
    background-size: contain;
    &[type="noSearch"] {
      background: url("~assets/images/crm/crm_nosearch.png") no-repeat;
      background-size: contain;
    }
    &[type="noPromise"] {
      background: url("~assets/images/crm/noPromise.png") no-repeat;
      background-size: contain;
    }
  }
  &-tips {
    margin-top: 8px;
    color: #b2b9c8;
    font-size: 14px;
  }
}
</style>


