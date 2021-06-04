<template>
  <div class="section-wrap" :class="fixed? 'wrap-fixed':''">
    <div class="section-item" @click="emitChangeEvent(1)">
      <div :class="['item-text',currentTab === 1? 'item-select' : '']">互动</div>
    </div>
    <div class="section-item" @click="emitChangeEvent(2)">
      <div :class="['item-text',currentTab === 2 ? 'item-select' : '']">智能分析</div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    currentTab: {
      type: Number,
      default: 1
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    // 派发Tabs切换事件
    emitChangeEvent(currentId) {
      this.$emit('changeTab', currentId);
    }
  }
};
</script>

<style scoped lang="scss">
.section-wrap {
  display: flex;
  height: 49px;
  background: #fff;
  border-bottom: 1px solid #f7f8fa;
  position: relative;
}

.section-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.item-text {
  font-size: 15px;
  position: relative;
}

.item-select {
  color: #5585F0;
}

.item-select::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 3px;
  background: #5585F0;
  bottom: -13px;
  left: 0;
}

.wrap-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 10;
  max-width: 740px;
  margin: auto;
}
</style>
