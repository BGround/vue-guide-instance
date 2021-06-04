<template>
  <div class="qwui-relation" @click="$emit('chooseRelation')" v-if="relationData">
    <div class="qwui-relation_name">{{relationData.title}}</div>
    <div class="qwui-relation_content">
      <div class="qwui-relation_content_name">{{relationData.name}}</div>
      <span class="qwui-relation_content_price">{{relationData.price}}</span>
      <span class="qwui-relation_content_date">{{relationData.time}}</span>
    </div>
    <span class="qwui-relation_delete" v-if="isShowOperate" @click.stop="$emit('deleteRelation')"></span>
  </div>
</template>

<script>
  export default {
    name: 'QwrelationCard',
    props: {
      relationData: Object,
      isShowOperate: {
        type: Boolean,
        default: false,
      },
    },
  };

</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';
  @import '~../../styles/variable.scss';
  .qwui-relation {
    flex: 1;
    background-color: #FAFAFA;
    border: 1px solid #D1D4DA;
    box-sizing: border-box;
    border-radius: 2px;
    display: flex;
    position: relative;
    .qwui-relation_name {
      width: 10px;
      padding:0 4px;
      text-align: center;
      color: $color-text;
      font-size: $font-size-small-s;
      background-color: #8F9399;
      display: flex;
      align-items:center;
      word-break: break-all;
    }
    .qwui-relation_content {
      flex: 1;
      padding: 15px;
      clear: both;
      overflow: hidden;
      .qwui-relation_content_name {
        width: 88%;
        color: $color-text-d;
        font-size: $font-size-medium;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin-bottom:10px;
      }
      .qwui-relation_content_price {
        display: inline-block;
        color: $color-text-sub;
        font-size: $font-size-small;
        margin-right: 10px;
      }
      .qwui-relation_content_date {
        color: $color-text-sub;
        font-size: $font-size-small;
      }
    }
    .qwui-relation_delete {
      position: absolute;
      width: 19px;
      height: 19px;
      top: 50%;
      right: 14px;
      margin-top: -9px;
      background: url('~assets/images/ic_del02.png') no-repeat center center;
    }
  }

</style>
