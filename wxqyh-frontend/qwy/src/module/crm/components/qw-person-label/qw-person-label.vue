<!--
  用于详情页中的人标签

  参数：
  @param src: 头像地址
  @param name: 人名
  @param deleteIcon: 是否需要展示删除按钮 默认false
  @event delete: 删除事件回调函数

  用法：
    <person-label :src="headPic" :name="personName" deleteIcon="true" @delete="deleteCallback" ></person-label>
-->
<template>
    <div class="person-label">
        <i class="default-head-pic"
           v-if="src == 0"></i>
        <img v-else
             :src="src"
             alt=""> {{name}}
        <i class="delete-btn"
           @click.stop="deleteItem"
           v-if="deleteIcon"></i>
    </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    deleteIcon: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    }
  },
  methods: {
    deleteItem() {
      this.$emit("delete", this.value);
    }
  }
};
</script>

<style lang='scss' src='./qw-person-label.scss' scoped ></style>
