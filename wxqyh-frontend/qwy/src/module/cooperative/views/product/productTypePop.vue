<template>
  <div v-show="typePopShow">
    <pop-base class="type_pop"
      :popData="popData"
      @listenClose="listenClose"
      @listenBtnFunc="listenBtnFunc">
      <tree :showCheckBox="true"
        :radio="true"
        :treeData="treeData"
        @select="handleSelect"
        :operateRender="operateRender"></tree>
    </pop-base>
  </div>
</template>

<script>
import popBase from '@/components/Add/popUps/PopBase'
import tree from './tree'

import { getProductType } from '../../api/product/getData'

export default {
  props: {
    selectedType: {
      type: Array,
      default() {
        return []
      }
    },
    typePopShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popData: {
        popShow: true,
        popTitle: '选择类别',
        width: 700,
        buttonConfig: {
          confirm: {
            text: '确定',
            type: 'primary'
          }
        }
      },
      icon: '',
      treeData: []
    }
  },
  watch: {
    typePopShow() {
      if (this.typePopShow) {
        let selectKey = []
        let self = this
        this.selectedType.forEach(item => {
          selectKey.push(item.id)
        })
        this.treeData.forEach(item => {
          self.$set(item, 'checked', false)
          if (selectKey.includes(item.key)) {
            self.$set(item, 'checked', true)
          }
          if (item.children) {
            item.children = this.handleChecked(item, selectKey)
          }
        })
      }
    }
  },
  created() {
    getProductType(
      {
        status: 1
      },
      data => {
        data.ProductTypeList.forEach(item => {
          item.key = item.id
          item.title = item.name
          if (item.productTypeList && item.productTypeList.length > 0) {
            item.children = this.addChildren(item)
          }
        })
        this.treeData = data.ProductTypeList
      }
    )
  },
  methods: {
    addChildren(data) {
      data.productTypeList.forEach(item => {
        item.key = item.id
        item.title = item.name
        if (item.productTypeList && item.productTypeList.length > 0) {
          item.children = this.addChildren(item)
        }
      })
      return data.productTypeList
    },
    handleChecked(data, selectKey) {
      let self = this
      data.children.forEach(item => {
        self.$set(item, 'checked', false)
        if (selectKey.includes(item.key)) {
          self.$set(item, 'checked', true)
        }
        if (item.children) {
          item.children = this.handleChecked(item, selectKey)
        }
      })
      return data.children
    },
    // 父亲render函数
    operateRender(h, { data }) {
      let self = this
      return h('div', {
        style: {
          padding: '3px 0',
          'box-shadow': '0px 2px 10px 0px rgba(0, 0, 0, 0.1)',
          'border-radius': '2px',
          'line-height': '30px',
          background: '#fff',
          border: '1px solid #EDEDED',
          'text-align': 'center'
        }
      })
    },
    listenClose() {
      this.$emit('listenClose')
    },
    listenBtnFunc() {
      this.$emit('listenBtnFunc', this.treeData)
    },
    handleSelect(nodeData) {
      console.log(nodeData)
    }
  },
  components: {
    popBase,
    tree
  }
}
</script>

<style lang="scss" scoped>
.type_pop /deep/ .qwui-mask_layer {
  z-index: 12;
}
</style>
