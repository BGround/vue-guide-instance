<template lang="html">
  <div class="qwui-reim_list">
    <qw-reim-list-item
      class="qwui-list_item"
      v-for="(item, index) in reimList"
      :reim-data="item"
      :is-show-user="isShowUser"
      :is-show-menu="isShowMenu"
      :key="item.reimId"
      @showOperate="showOperate(item.reimId, index)"
      @select="selectItem"
    ></qw-reim-list-item>
  </div>
</template>

<script>
  import QwReimListItem from './ReimListItem';

  export default {
    name: 'QwReimList',
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
  .qwui-reim_list {
    .qwui-list_item {
      margin-top: 10px;
    }
  }
</style>
