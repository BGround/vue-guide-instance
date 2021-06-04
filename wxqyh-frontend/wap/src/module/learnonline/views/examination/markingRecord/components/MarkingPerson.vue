<template>
  <div class="exam_marking_person flex_box" @click="clickItem">
    <div class="person_info flex_item">
      <div class="ellipsis person_name">{{personName}}</div>
      <div class="finish_time">
        {{finishTimeStr}}
      </div>
    </div>
    <div class="marking_score">
      {{score|parseFloat}}{{$t('i18n.score')}}
    </div>
  </div>
</template>


<script>

export default {
  name: 'MarkingPerson',
  props: {
    personName: {
      type: String,
      required: true
    },
    finishTime: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    score: {
      type: String,
      required: true
    }
  },
  filters: {
    parseFloat(val) {
      return parseFloat(val);
    }
  },
  data(){
    return {

    };
  },
  computed: {
    // 交卷时间
    finishTimeStr() {
      return this.$t('i18n.handInTime') + this.finishTime;
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
      });
    }
  }
};

</script>

<style lang="scss" scoped>
.exam_marking_person {
  padding: 10px 15px;
  color: #333;
  background-color: #fff;
  
  .person_info {

    .person_name {
      font-size: 16px;
    }
    .finish_time {
      font-size: 12px;
      color: #999;
    }
  }
  .marking_score {
    width: 45px;
    text-align: right;
    font-size: 18px;
    line-height: 42px;
    color: #f56262;
  }
}

</style>
