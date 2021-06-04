<template>
  <div class="video-view">
    <video class="video-content"
           controls
           :src="option.detail[0].title"
           :poster="option.detail[0].picPath"></video>
  </div>
</template>

<script>
export default {
  name: 'videoView',
  props: {
    option: Object
  },
  created() {
    if (this.option.detail.length === 0) {
      this.option.detail = [{}]
    }
  }
}
</script>
<style lang="scss" scoped>
.video-view {
  display: flex;
  justify-content: center;
  padding: 10px;
  .video-content {
    border-radius: 4px;
    width: 300px;
    height: 170px;
  }
}
</style>

