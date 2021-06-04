<template>
<div class="qwui-lean_exam" v-if="item.list.length">

  <div class="data_bar">{{item.data}} {{item.week}}</div>
  
  <!-- 考试项 -->
  <div v-if="isRecord">
    <exam-item-record
      class="exam_item"
      v-for="(exam, index) in item.list"
      :exam="exam"
      :key="index"
      @inHand="inHand(index)"
    ></exam-item-record>
  </div>

  <!-- 考试项|历史记录 -->
  <div v-else>
    <exam-item
      class="exam_item"
      v-for="(exam, index) in item.list"
      :exam="exam"
      :nowTimeStamp="$attrs.nowTimeStamp"
      :key="index"
      @inHand="inHand(index)"
    ></exam-item>
  </div>

</div>
</template>

<script>
import ExamItem from './ExamItem'; // 考试项组件(以试卷为单位)
import ExamItemRecord from './ExamItemRecord'; // 考试记录项组件(以试卷为单位)
export default {
  name: 'QwExam',
  components: {
    ExamItem,
    ExamItemRecord
  },
  inheritAttrs: false, // 非props不作为html Attr绑定在根元素上
  props: {
    item: { // 数据对象
      type: Object,
      required: true
    },
    isRecord: {
      type: Boolean,
      default: false
    }

  },
  data(){
    return {
    };
  },
  methods:{
    // 已交卷，
    inHand(index) {
      this.$emit('inHand');
    }
  },

};

</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';
.qwui-lean_exam {
  margin-bottom: 10px;
  padding: 25px 0 0 15px;
  background: #fff;

  .data_bar {
    height: 19px;
    color: #888;
    font-size: 20px;
    line-height: 19px;
  }

  .exam_item {
    &:not(:last-of-type) {
      @include border-b-1px(#E6E6E6);
    }
  }

}
</style>
