<template lang="html">
  <v-touch class="qwui-carousel-item"
    :style="{'background-image': 'url(' + cover + ')'}"
    @tap="itemClick"
  >
    <img class="qwui-carousel-cover"
      :src="cover"
      :alt="title"
      :title="title"
    >
    <div class="qwui-carousel-title" v-if="title">
      <div v-text="title"></div>
    </div>
  </v-touch>
</template>

<script>
import Vue from 'vue';
import VueTouch from 'vue-touch';

export default {
  name: 'QwCarouselItem',
  props: {
    cover: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    itemClick () {
      this.$emit('item-click');
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-carousel-item {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 0;
  overflow: hidden;
  background: {
    size: cover;
    position: center center;
  }

  .qwui-carousel-cover {
    display: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .qwui-carousel-title {
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 15px;

    div {
      padding: 0 20px;
      color: white;
      line-height: 40px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
    }
  }
}
</style>
