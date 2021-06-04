<template>
  <div class="tree-node">
    <ul class="tree-node-list">
      <li
        onselectstart="return false"
        class="node-list-item"
        @click="handleClick"
        :class="{select: treeItem.selected}"
      >
        <div class="checkbox-wrap" v-if="showCheckBox" @click.stop>
          <check-box
            v-if="!radio"
            v-model="treeItem.checked"
            :disabled="treeItem.disabled"
            @change="handleCheck"
          ></check-box>
          <input
            v-else
            type="radio"
            class="tree-radio"
            :checked="treeItem.checked"
            name="radioNode"
            @change="radioInput"
          />
        </div>
        <div
          class="fold"
          v-if="!treeItem.children"
        ></div>
        <div
          class="fold-arrow"
          :class="{open: treeItem.expand}"
          v-if="treeItem.children && treeItem.children.length > 0"
        ></div>
        <render v-if="treeItem.render" :render="treeItem.render" :data="treeItem"></render>
        <render v-else-if="parentRender" :render="parentRender" :data="treeItem"></render>
        <div
          v-else
          class="node-msg"
        >
          <i
            v-if="icon"
            class="node-icon"
            :style="{'background': `url(${icon}) no-repeat center`}"
          ></i>
          <span class="node-name">{{treeItem.title}}</span>
        </div>
        <div class="operate" v-if="operateRender">
          <div>
            <render :render="operateRender" :data="treeItem"></render>
          </div>
        </div>
      </li>
      <tree-node
        v-if="treeItem.expand"
        v-for="(item,idx) in treeItem.children"
        :key="idx"
        :treeItem="item"
        :radio="radio"
        :showCheckBox="showCheckBox"
        :parentRender="parentRender"
        :operateRender="operateRender"
        :icon="icon"
      ></tree-node>
    </ul>
  </div>
</template>
<script>
  import CheckBox from 'components/qwuiBase/qwuiCheckbox/qwuiCheckbox';
  import Render from './render';

  export default {
    name: 'treeNode',
    components: {
      CheckBox,
      Render,
    },
    props: {
      // 树节点数据
      treeItem: {
        type: Object,
        default () {
          return {};
        }
      },

      // 是否显示checkbox
      showCheckBox: {
        type: Boolean,
        default: false
      },

      // 父亲render函数
      parentRender: {
        type: Function,
        default: null
      },

      // 操作栏render函数
      operateRender: {
        type: Function,
        default: null
      },

      // 节点图标
      icon: {
        type: String
      },

      // 是否单选
      radio: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    methods: {
      radioInput(e) {
        this.handleCheck();
        this.$set(this.treeItem, 'checked', e.target.checked);
      },

      // 点击节点
      handleClick() {
        const status = !this.treeItem.expand;
        this.$set(this.treeItem, 'expand', status);

        // 选择节点
        this.dispatch('Tree', 'handleSelect', [this.treeItem.key, this.treeItem]);
        this.$set(this.treeItem, 'selected', true);
      },

      // 点击选择框
      handleCheck() {
        this.dispatch('Tree', 'handleCheck', [this.treeItem.key]);
      },

      // 分发事件
      dispatch(componentName, eventName, params) {
        let parent = this.$parent || this.$root;
        let name = parent.$options.name;

        while (parent && (!name || name !== componentName)) {
          parent = parent.$parent;

          if (parent) {
            name = parent.$options.name;
          }
        }
        if (parent) {
          parent.$emit.apply(parent, [eventName].concat(params));
        }
      }
    }
  }
</script>
<style lang='scss' scoped>
  .select{
    background: #F5F5F5;
  }
  .tree-node{
  /deep/ .qwui-checkbox-input{
    vertical-align: baseline !important;
  }
  .tree-node-list{
    padding-left: 18px;
    cursor: pointer;
  .fold{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 20px;
    vertical-align: middle;
  }
  .fold-arrow{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 20px;
    vertical-align: middle;
  &:after{
     content: '';
     position: relative;
     display: block;
     border-color: transparent transparent #B3B3B3;
     border-style: solid;
     border-width: 5px;
     transform: rotate(90deg);
   }
  &.open{
  &:after{
     top: 3px;
     transform: rotate(180deg);
   }
  }
  }
  .node-list-item{
    position: relative;
    padding: 4px 0;
    color: #808080;
  &:hover{
     background: #F5F5F5;
   }
  &.select{
     background: #F5F5F5;
   }
  .checkbox-wrap{
    display: inline-block;
  .tree-radio{
    margin: 3px;
    width: 16px;
    height: 10px;
  }
  }
  .node-msg{
    display: inline-block;
    padding: 2px 5px;
    max-width: 83%;
    border-radius: 3px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
    box-sizing: border-box;
  .node-icon{
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
  }
  .operate{
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    display: none;
    align-items: center;
  }
  &:hover{
  .operate{
    display: flex;
  }
  }
  }
  }
  }
</style>
