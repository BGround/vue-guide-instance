<template>
    <div class="qw-tabs">
        <div class="qw-tabs-wrap" ref="wrap">
            <div class="qw-tabs-nav" ref="nav">
                <slot></slot>
            </div>
        </div>
        <div class="qw-tabs-content" ref="content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<script>

  export default {
    name:'QwTabs',
    data() {
      return {}
    }
  }
</script>
<style lang="scss" scoped>
  @import './tabs.scss';
</style>
