<template>
  <div class="qwui-examination_classification_list">
    <div class="classification_list">

      <div class="list_item_wrap" v-if="!dataArr.length">
        <span 
          class="list_item ellipsis"
          :class="{select: select.includes(-2)}"
          @click="selectClassification(-2)"
        >{{noneString}}</span>
      </div>
      <div class="list_item_wrap" v-else>
        <span
          v-if="allStringShow"
          class="list_item ellipsis"
          :class="{select: select.includes(-1)}"
          @click="selectClassification(-1)" 
        >{{allString}}</span>
      </div>

      <!-- 载入列表数据 -->
      <div 
        class="list_item_wrap" 
        v-for="(item, index) in dataArr"
        @click="selectClassification(index, item)"
      >
        <span 
          class="list_item ellipsis"
          :class="{select: select.includes(index)}"
        >{{item[keyName]}}</span>
      </div>
      
    </div>

  </div>
</template>

<script>

export default {
  name: 'QwClassificationList',
  components: {
  },

  props: {
    dataArr: { // 数据数组
      type: Array,
      required: true
    },
    keyName: { // 用以显示的属性值
      type: String,
      required: true
    },
    isMultiSelect: { // 可多选
      type: Boolean,
      default: false
    },
    autoSelect: { // 自动选择第一个
      type: Boolean,
      default: false
    },
    defaultSelect: { // 默认选择，优先级高于自动
      type: Number,
      default: -3
    },
    noneString: {
      type: String,
      default: '没有试卷类型'
    },
    allString: {
      type: String,
      default: '全部'
    },
    allStringShow: { // allString是否可见
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      select: []
    };
  },
  computed: {

  },
  watch: {
    allStringShow: function(val) {
      if (this.autoSelect) {
        this.autoSelectMethod();
      }
     
    }
  },
  methods: {
    // 选择
    selectClassification(index, item) {
      this.selectDeal(index);

      let obj = {
        status: index, // -2:没有;-1:全部;-1<:正常
        data: item
      };
      this.$emit('selectClassification', obj);
    },


    // 自动选第一项
    autoSelectMethod() {
      let index = -3;
      if (this.autoSelect) {
        index = this.allStringShow? -1: 0;
      }
      index = this.defaultSelect != -3? this.defaultSelect: index;

      if (index != -3) {
        this.selectDeal(index);
      }
    },

    // 选择数据处理
    selectDeal(index) {
      let select = this.select;
      if (!select.includes(index)) {
        while(!this.isMultiSelect && select.length) { // 单选清除其他选项
          select.pop();
        }
        select.push(index);
      }
    },
  },

};
</script>

<style lang="scss" scoped>
.qwui-examination_classification_list {
  padding: 20px;

  .list_item_wrap {
    margin: 3px 0;

    .list_item {
      display: inline-block;
      max-width: 100%;
      height: 22px;
      padding: 4px 5px;
      border-radius: 4px;
      font-size: 12px;
      color: #333;
      line-height: 15px;
      vertical-align: top;
      cursor: pointer;

      &:hover {
        color: #fff;
        background: #949494;
      }
    }

    .select {
      color: #fff;
      background: #949494;
    }
  }
}
</style>
