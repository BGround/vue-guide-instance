<template lang="html">
  <div class="reim-list">
    <qw-reim-list-item
      class="list-item"
      v-for="(item, index) in reimList"
      :reimData="item"
      :isShowUser="isShowUser"
      :isShowMenu="isShowMenu"
      :key="item.id"
      @showOperate="showOperate(item.id, item.type, index)"
      @select="selectItem"
    ></qw-reim-list-item>
  </div>
</template>

<script>
  import QwReimListItem from './listItem';

  export default {
    name: 'QwList',
    components: {
      QwReimListItem,
    },
    props: {
      // 报销列表
      reimList: Array,
      // 是否显示用户名及头像
      isShowUser: Boolean,
      // 是否显示操作栏
      isShowMenu: Boolean,
    },
    data() {
      return {
      };
    },
    methods: {
      showOperate(id, index) {
        this.$emit('showOperate', id, index);
      },
      selectItem(reimData) {
        this.$emit('selectItem', reimData);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .reim-list {
    .list-item{
      margin: 7px;
    }
  }
</style>
