<template>
  <div class="exam_marking_item" @click="clickItem">
    <div class="ellipsis exam_name">{{examName}}</div>
    <div class="exam_time">
      {{examTime}}
    </div>
    <div class="marking_count">
      {{markingCount}}
    </div>
  </div>
</template>


<script>

export default {
  name: 'MarkingItem',
  props: {
    examName: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    lastStartTime: {
      type: String,
      required: true
    },
    manualCount: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  data(){
    return {

    };
  },
  computed: {
    // 考试时间
    examTime() {
      return `${this.startTime} ${this.$t('i18n.to')} ${this.lastStartTime||'--'}`;
    },
    // 阅卷份数
    markingCount() {
      return this.manualCount + this.$t('i18n.markingTitle');
    }
  },
  methods: {
    // 点击触发事件
    clickItem() {
      this.$emit('clickItem', {
        id: this.id,
        manualCount: this.manualCount
      });
    }
  }
};

</script>

<style lang="scss" scoped>
.exam_marking_item {
  padding: 10px 15px;
  color: #333;
  background-color: #fff;

  .exam_name {
    font-size: 16px;
  }
  .exam_time {
    font-size: 12px;
    color: #999;
  }
  .marking_count {
    margin-top: 10px;
    font-size: 14px;
  }
}

</style>
