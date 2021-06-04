/**
  * @param borderType(默认:round)：圆角round 直角rightAngle
  * @param dataList(默认[])：选择框内容
  * @param selectItem： 选择内容后的回调函数
  * @exmple
  *     <parent>
  *         <qwui-select @selectItem="selectItem" :dataList="optionData"></qwui-select>
  *     </parent>
  */
<template>
  <div class="box_wrap inline_box"
    v-clickOut="hideSelect">
    <div class="qwui-select_wrap"
      :class="[
                borderType
            ]"
      @click="handleSelect">
      <input class="text_wrap"
        :title="selectVal.name"
        :value="selectVal.name"
        :placeholder="placeholder"
        readonly />
      <ul class="select_list"
        v-show="showList">
        <li class="select_item"
          :class="{active: idx === selectVal.idx}"
          v-for="(item,idx) in dataList"
          :key="idx"
          @click.stop="selectItem(item.optionName, item.val, idx)"
          :title="item.optionName">{{item.optionName}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'qwui-select',
  data() {
    return {
      // 是否显示选择列表
      showList: false,

      // 当前选中的option
      selectVal: {
        name: new Date().getFullYear(),
        idx: 0
      }
    }
  },
  props: {
    // 边框类型: round圆角
    borderType: {
      type: String,
      default: 'round'
    },

    // 选择内容数据列表
    dataList: {
      type: Array,
      default() {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  methods: {
    // 显示或隐藏选择列表
    handleSelect() {
      this.showList = !this.showList
    },

    // 选择当前内容
    selectItem(optionName, val, idx) {
      this.selectVal.name = optionName
      this.selectVal.idx = idx
      this.hideSelect()
      this.$emit('selectItem', optionName, val)
    },

    // 隐藏选项列表
    hideSelect() {
      this.showList = false
    },

    // 设置select的值
    setValue(key) {
      this.selectVal.name = this.findOptionNameByKey(key)
      this.selectVal.idx = this.findIdxByKey(key)
    },

    findIdxByKey(key) {
      let result = {}
      this.dataList.map((item, index) => {
        result[item.val] = index
      })
      return result[key]
    },

    findOptionNameByKey(key) {
      let result = {}
      this.dataList.map((item, index) => {
        result[item.val] = item.optionName
      })
      return result[key]
    }
  },
  directives: {
    //  点击空白地方隐藏选项列表
    clickOut: {
      bind(el, binding) {
        el.handler = function(e) {
          // 如果是点击当前节点，则不触发选择列表消失
          if (el.contains(e.target)) return false
          if (binding.expression) {
            binding.value()
          }
        }
        document.addEventListener('click', el.handler)
      },
      unbind: function(el) {
        document.removeEventListener('click', el.handler)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './qwuiSelect.scss';
</style>


