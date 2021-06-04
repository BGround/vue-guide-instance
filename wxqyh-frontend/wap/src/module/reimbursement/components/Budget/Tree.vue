<template>
  <div class="qwui-tree" :class="treeStateClass" v-show="model">
    <div class="qwui-tree_main retain-border-1px">
      <div class="qwui-tree_icon" :class="iconClass" @click="toggle"></div>
      <div class="qwui-tree_content retain-border-1px">
        <div class="qwui-tree_name" @click="toggle">
          <span>{{model.name | ellipsis}}</span>
          <span class="qwui-tree_node_index">{{model.level + $t('i18n.reim.level')}}</span>
        </div>
        <div class="qwui-tree_desc">
          <span class="qwui-tree_desc_item">{{$t('i18n.reim.used')}}：{{model.generalUsed | formatMoney}}</span>
          <span
            class="qwui-tree_desc_item"
            :class="{'is-excess': checkIsExcess(model.balance)}"
          >{{$t('i18n.reim.balance')}}：{{model.balance | formatMoney}}</span>
        </div>
      </div>
      <div class="qwui-more_btn" @click.stop="more"></div>
    </div>
    <transition name="expand">
      <div class="qwui-tree_group" v-show="isOpen">
        <qw-tree
          v-for="(model, index) in model.children"
          :model="model"
          :expandAll="expandAll"
          :key="model.id"
          :index="index"
          :nodeLen="childLength"
        >
        </qw-tree>
      </div>
    </transition>
  </div>
</template>

<script>
import { budgetMixin } from '../../mixins/budgetMixin';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'QwTree',
  mixins: [budgetMixin],
  props: {
    model: Object,
    expandAll: Boolean,
    index: Number,
    nodeLen: Number,
  },
  filters: {
    ellipsis(text, maxLen = 16) {
      if (text.length > maxLen) {
        return text.substr(0, maxLen) + '...';
      } else {
        return text;
      }
    }
  },
  data() {
    return {
      activeId: '',
      isOpen: false,
    };
  },
  computed: {
    isFolder() {
      return this.model.children.length > 0;
    },
    childLength() {
      return this.model.children ? this.model.children.length : 0;
    },
    iconClass() {
      const { isOpen, isFolder } = this;
      return {
        'expanded': isOpen,
        'is-leaf': !isFolder,
      };
    },
    treeStateClass() {
      const { isOpen, curSelectTree, model } = this;
      return {
        expand: isOpen && model.level != 1,
        active: curSelectTree == model.id,
      }
    },
    ...mapGetters([
      'curSelectTree',
      'isReduceAllTree',
    ]),
  },
  watch: {
    isReduceAllTree(flag) {
      if (flag) {
        this.isOpen = false;
      }
    }
  },
  created() {
    if (this.expandAll && this.isFolder) {
      this.isOpen = true;
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.updateCurSelectTree(this.model.id);
        this.updateReduceAllTree(false);
      } else {
        if (this.model.level == 1) {
          this.updateReduceAllTree(true);
        }
        this.updateCurSelectTree(this.model.parentId);
      }
    },
    more() {
      this.updateCenterCostData({id: this.model.centerCostId, name: this.model.name});
    },
    ...mapMutations([
      'updateCurSelectTree',
      'updateCenterCostData',
      'updateReduceAllTree',
    ]),
  },
};
</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';

  .qwui-tree {
    width: 100%;
    overflow: hidden;
    .qwui-tree_main {
      display: flex;
      align-items: center;
      padding: 15px;
      @include retain-border-1px($position: 'bottom');

      .qwui-tree_icon {
        display: block;
        width: 14px;
        height: 14px;
        margin-right: 15px;
        border-radius: 50%;
        background: url('~assets/images/reim/ic_arrow_gray_r.png') center center;
        background-size: 14px 14px;

        &.selected-icon {
          background-image: url('~assets/images/reim/ic_arrow_selected_r.png');
        }

        &.expanded {
          transform: rotate(90deg);
        }

        &.is-leaf {
          visibility: hidden;
        }
      }

      .qwui-tree_content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .qwui-tree_name {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          font-size: 16px;
          color: #333;

          .qwui-tree_node_index {
            display: inline-block;
            margin-left: 8px;
            width: 33px;
            height: 18px;
            line-height: 18px;
            font-size: 11px;
            text-align: center;
            color: $icon-border-color;
            background: #F6F6F6;
            border-radius: 5px;
          }
        }
        .qwui-tree_desc {
          color: #999;
          font-size: 13px;

          .qwui-tree_desc_item {
            margin-right: 25px;
          }
        }
      }

      .qwui-more_btn {
        padding: 15px 0 15px 15px;
        &::after {
          @include allow($width: 10px, $color: #ccc);
          margin-right: 1px;
        }
      }
    }

    &.expand .qwui-tree_main {
      &::before{
        left: 44px;
      }
    }

    &.active {
      .qwui-tree_main {
        .qwui-tree_icon {
          background-image: url('~assets/images/reim/ic_arrow_selected_r.png');
        }
      }
      > .qwui-tree_main {
        .qwui-tree_icon {
          background-image: url('~assets/images/reim/ic_arrow_gray_r.png');
        }
      }
      .qwui-tree_main .end-leaf {
        visibility: visible;
        background-image: url('~assets/images/reim/ic_arrow_empty_selected.png');
      }
    }
  }

  .is-excess {
    color: $color-text-warn;
  }
</style>

