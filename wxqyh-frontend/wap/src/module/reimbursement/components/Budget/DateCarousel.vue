<template>
  <div class="qwui-date_carousel">
    <span class="qwui-carousel_prev_btn" :class="{'disabled': prevDisable}" @click="prev"></span>
    <div class="qwui-carousel_content">
      <slot></slot>
    </div>
    <span class="qwui-carousel_next_btn" :class="{'disabled': nextDisable}" @click="next"></span>
  </div>
</template>

<script>
export default {
  name: 'QwDateCarousel',
  props: {
    prevDisable: Boolean,
    nextDisable: Boolean,
  },
  methods: {
    prev() {
      if (!this.prevDisable) {
        this.$emit('prev');
      }
    },
    next() {
      if (!this.nextDisable) {
        this.$emit('next');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';

  .qwui-date_carousel {
    display: flex;
    align-items: center;
    color: $color-text;
    overflow: hidden;

    .qwui-carousel_content {
      flex: 1;
      
    }

    .qwui-carousel_prev_btn, .qwui-carousel_next_btn {
      &.disabled {
        color: #fff;
        opacity: 0.3;
      }
    }

    .qwui-carousel_next_btn {
      padding: 0 5px;
      &::before {
        @include allow($width: 12px, $color: $icon-border-color);
      }
    }

    .qwui-carousel_prev_btn {
      padding: 0 5px;
      &::before {
        @include allow($rotate: -135deg, $width: 12px, $color: $icon-border-color);
      }
    }
  }
</style>

