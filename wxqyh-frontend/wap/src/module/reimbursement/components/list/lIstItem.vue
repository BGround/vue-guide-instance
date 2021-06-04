<template lang="html">
  <div class="reim-item">
    <div class="border-bottom-1px">
      <div class="reim-inner" @click="$emit('select', reimData)">
        <div class="reim-title" v-text="reimData.title"></div>

        <div class="reim-content">
          <div class="reim-desc-item reim-no" v-text="reimData.seqNo"></div>
          <div class="reim-desc-item reim-date">{{ reimData.createTime | formatDate}}</div>
        </div>
      </div>
    </div>

    <div class="reim-status">
      <qw-reim-status
        :statusObj="reimState"
      ></qw-reim-status>

      <span class="reim-node retina-border" v-if="reimData.nodeName">{{reimData.nodeName}}</span>

      <div class="reim-money">￥<span>{{ reimData.money | formatMoney}}</span></div>
    </div>

    <span class="item-menu-icon"
      v-if="isShowMenu"
      @click="$emit('showOperate')"
    ></span>
  </div>
</template>

<script>
  import QwReimStatus from './status';
  import { getDebitItemStatus, getApproveStatus,getNewApproveStatus } from '../../js/common';

  export default {
    name: 'QwListItem',
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
      // 是否显示用户名及头像
      isShowUser: {
        type: Boolean,
        default: false,
      },
      // 是否显示操作栏
      isShowMenu: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
      };
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
    computed: {
      // 返回报销状态的设置项
      reimState() {
        if(this.reimData.type=='0'){
            return getNewApproveStatus(this.reimData.status);
        }else{
          return getDebitItemStatus(this.reimData.status);
        }
      },
      curNodeState() {
        return ({
          class: 'status-green-solid',
          statusText: this.reimData.curNodeName,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';
.reim-item {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  padding: 15px 14px 10px 15px;
  background: $color-background;

  .reim-inner {
    margin-right: 14px;
    .reim-title {
      margin-bottom: $box-padding;
      font-size: $font-size-medium-x;
      color: $color-text-d;
      white-space: pre;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .reim-content {
      overflow: hidden;
    }

    .reim-desc-item {
      margin-bottom: 15px;
      font-size: $font-size-medium;
      line-height: 1;
      color: #848a90;
    }
  }
  /deep/ .border-bottom-1px::before{
    border-top: 1px solid #F7F8FA;
  }

  .item-menu-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 35px;
    height: 50px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAgCAYAAAAxOQljAAAAc0lEQVQ4T2NctWoV27t377oYGBjiGCBgkZCQUBnjjBkzJjAyMuZDBcHU////JzLOnDnzPQMDgwCyBAMDwwesEv///38PkpjIwMCQh6ZjEiPI8g8fPnT9//8/Hma5oKBgKSOaSjh3kEqMBiJ6hJERUYMyEAEgDG+loPeWRAAAAABJRU5ErkJggg==) center no-repeat;
    background-size: 3px;
    z-index: 2;
    cursor: pointer;
  }

  .reim-no, .reim-date {
    &::before {
      content: '';
      display: inline-block;
      margin-right: 10px;
      width: 13px;
      height: 13px;
      background-size: 13px 13px;
      vertical-align: bottom;
    }
  }

  .reim-no::before {
    background-image: url(~assets/images/ic_document.png);
  }

  .reim-date::before {
    background-image: url(~assets/images/ic_clock.png);
  }

  .reim-status {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .reim-node {
      margin-left: 20px;
      padding: 0 10px;
      height: 15px;
      line-height: 15px;
      font-size: $font-size-small;
      color: #B2B9C8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.retina-border {
        @include retain-border-1px($position: 'left');
      }
    }

    .reim-money {
      margin-left: auto;
      font-size: $font-size-medium-x;
      color: #5585F0;
      line-height: 1;

      span {
        margin-left: 5px;
        font-size: $font-size-large;
      }
    }
  }
}
</style>
