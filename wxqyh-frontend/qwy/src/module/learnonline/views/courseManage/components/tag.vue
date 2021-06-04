<template>
  <div class="learn-tags">
    <div class="tags_wrap clearfix"
         v-for="(item, index) in tags" :key="index"
    >
      <div class="tags_left">{{ item.title }}</div>
      <div class="tags_right">
        <span class="tag"
              :class="{ active : `${activeTag[item.id]}` === tagItem.id ,
                        mb0 : index === (tags.length-1)
                      }"
              v-for="(tagItem, tagIndex) in item.tag" :key="tagIndex"
              :title="tagItem.category"
              @click="handleClick(item.id, tagItem.id, tagItem.category)"
        >{{ tagItem.category }}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'tag',

  props: {
    tags: {
      type: Array,
      required: true
    },
    activeTag: {
      type: Object,
      required: true
    },
  },

  data() {
    return {}
  },

  methods: {
    handleClick(tagsId, tagId, tagName) {
      this.$emit('click', tagsId, tagId, tagName)
    },
  },

}
</script>

<style lang="scss" scoped>
 @import 'learn/style/config.scss';
  .learn-tags {
    line-height: 24px;
    .tags_wrap {
      .tags_left {
        float: left;
        max-width: 11%;
        color: #A6A6A6;
        @include ellipsis;
      }
      .tags_right {
        float: right;
        width: 89%;
        line-height: 0;
        font-size: 0;
        .tag {
          display: inline-block;
          max-width: 222px;
          height: 24px;
          line-height: 24px;
          padding: 0 6px;
          margin: 0 20px 16px 0;
          color: #808080;
          font-size: 14px;
          cursor: pointer;
          @include ellipsis;
          @include transition;
          &.active {
            color: #fff;
            background-color: #C31725;
            border-radius:2px;
          }
        }
      }
    }
  }
</style>
