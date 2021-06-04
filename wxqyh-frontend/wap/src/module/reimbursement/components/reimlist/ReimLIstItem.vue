<template lang="html">
  <div class="qwui-reim_item">
    <div class="border-bottom-1px">
      <div class="qwui-reim_inner" @click="$emit('select', reimData)">
        <div class="qwui-reim_title" v-text="reimData.title"></div>

        <div class="qwui-reim_content">
          <div class="qwui-reim_desc_item qwui-reim_no" v-text="reimData.reimNo"></div>
          <div class="qwui-reim_desc_item qwui-reim_date">{{ reimData.createTime | formatDate}}</div>
        </div>
      </div>
    </div>

    <div class="qwui-reim_status">
      <qw-reim-status
        :statusObj="reimState"
      ></qw-reim-status>

      <span class="qwui-reim_node retina-border" v-if="reimData.curNodeName">{{reimData.curNodeName}}</span>

      <div class="qwui-reim_money">￥<span>{{ reimData.totalMoney | formatMoney}}</span></div>
    </div>

    <span class="qwui-item_menu_icon"
      v-if="isShowMenu"
      @click="$emit('showOperate')"
    ></span>
  </div>
</template>

<script>
  import QwReimStatus from './ReimStatus';
  import { getApproveStatus } from '../../js/common';

  export default {
    name: 'QwReimListItem',
    components: {
      QwReimStatus,
    },
    props: {
      // 报销数据
      reimData: {
        type: Object,
        default() {
          return {};
        },
      },
      // 是否显示操作栏
      isShowMenu: {
        type: Boolean,
        default: false,
      },
    },
    filters: {
      // 如果创建时间是当前年份则省略年份
      formatDate(time) {
        return _.getFormatTime(time);
      },
      formatMoney(money) {
        return _.formatMoney(money, 2);
      },
    },
    data() {
      return {
      };
    },
    computed: {
      // 返回报销状态的设置项
      reimState() {
        return getApproveStatus(this.reimData.statusDesc);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';
  .qwui-reim_item {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    padding: 15px 15px 12px 15px;
    background: $color-background;

    .qwui-reim_inner{
      margin-right: 30px;
      .qwui-reim_title {
        margin-bottom: $box-padding;
        font-size: $font-size-medium-x;
        line-height: 17px;
        color: #4F575F;
        @include no-wrap();
      }

      .qwui-reim_content {
        overflow: hidden;
      }

      .qwui-reim_desc_item {
        margin-bottom: 12px;
        font-size: $font-size-medium;
        line-height: 1;
        color: #848a90;
      }
    }

    .qwui-item_menu_icon {
      position: absolute;
      top: 0;
      right: 0;
      width: 17px;
      height: 17px;
      padding: $box-padding;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAgCAYAAAAxOQljAAAAc0lEQVQ4T2NctWoV27t377oYGBjiGCBgkZCQUBnjjBkzJjAyMuZDBcHU////JzLOnDnzPQMDgwCyBAMDwwesEv///38PkpjIwMCQh6ZjEiPI8g8fPnT9//8/Hma5oKBgKSOaSjh3kEqMBiJ6hJERUYMyEAEgDG+loPeWRAAAAABJRU5ErkJggg==) center no-repeat;
      background-size: 3px;
      z-index: 2;
      cursor: pointer;
    }

    .qwui-reim_no, .qwui-reim_date {
      &::before {
        content: '';
        display: inline-block;
        margin-right: 10px;
        width: 13px;
        height: 13px;
        background-size: 13px 13px;
        vertical-align: top;
      }
    }

    .qwui-reim_no::before {
      background-image: url('~assets/images/ic_document.png');
    }

    .qwui-reim_date::before {
      background-image: url('~assets/images/ic_clock.png');
    }

    .qwui-reim_status {
      display: flex;
      align-items: center;
      margin-top: $box-padding;

      .qwui-reim_node {
        margin-left: 20px;
        padding: 1px 0 1px 10px;
        font-size: $font-size-medium-s;
        line-height: 1;
        color: #AAB0B6;

        &.retina-border {
          @include retain-border-1px($position: 'left', $color: #eee);
          &:before {
            height: auto;
            top: -2px;
            bottom: -2px;
          }
        }
      }

      .qwui-reim_money {
        margin-left: auto;
        font-size: $font-size-medium;
        line-height: 15px;
        font-weight: bold;
        color: #467db9;

        span {
          margin-left: 5px;
          font-size: $font-size-large-s;
        }
      }
    }
  }
</style>
