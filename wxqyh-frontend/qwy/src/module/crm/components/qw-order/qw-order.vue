<template>
  <div class="order_container">
    <div v-for="(item, index) in optionList"
         :key="index"
         @click="changeOrder(index)"
         class="order_item"
         :class="item.descOrAsc">
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'qw-order',
  created() {
    this.optionList = [...this.orderOptions]
    this.optionList.forEach((itemValue, index) => {
      this.$set(itemValue, 'descOrAsc', '')
    })
    this.init()
  },
  data() {
    return {
      // 排序的选项
      optionList: []
    }
  },
  props: {
    // 需要排序的内容
    orderOptions: {
      type: Array,
      default: () => {
        ;[
          {
            name: '',
            type: ''
          }
        ]
      }
    }
  },
  methods: {
    init() {
      this.optionList.forEach((itemValue, optionIndex) => {
        if (optionIndex === 0) {
          this.$set(itemValue, 'descOrAsc', 'desc')
        }
      })
    },
    changeOrder(index) {
      this.optionList.forEach((itemValue, optionIndex) => {
        if (optionIndex === index) {
          var order;
          if(itemValue.type == 'sort'){
            order = 'desc';
          }else{
            order = itemValue['descOrAsc'] === 'desc' ? 'asc' : 'desc';
          }
           
          this.$set(itemValue, 'descOrAsc', order)
          this.$emit('changeOrder', itemValue)
        } else {
          this.$set(itemValue, 'descOrAsc', '')
        }
      })
    }
  }
}
</script>

<style src="./qw-order.scss" lang="scss" scoped></style>
