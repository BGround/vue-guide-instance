<template>
  <div class="qwui-lean_practice" @click="enterDetal">
    <div class="clearfix">
      <p class="practice_name">{{practiceName}}</p>
      <p class="practice_time">
        {{startTime|filterTime}}&nbsp;&nbsp;&nbsp;{{$t('i18n.to') }}&nbsp;&nbsp;&nbsp;{{endTimeStr|filterTime}}
      </p>
      <p class="practice_explain">{{practiceExplain}}</p>
      <div class="practice_img_list clearfix">
        <div v-for="imgItem in picList"><img :src="imgItem|filterImg"></div>
      </div>

      <div
        class="practice_button"
        :class="{practice_button_wait: practiceState == 1}"
        @click.stop="enterExam"
      >{{getButtonText()}}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'QwPractice',
  filters: {
    filterImg(url) {
      return _.fileDownURL + url;
    },
    filterTime(time) {
      return time.length > 3? time.slice(5): time;
    },
  },
  props: {
    id: {
      type: String,
    },
    practiceName: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTimeStr: {
      type: String,
    },
    practiceExplain: {
      type: String,
    },
    picList: {
      type: Array,
    },
    practiceState: {
      type: String,
    },
    answerState: {
      type: String,
    }
  },
  data(){
    return {
    };
  },
  methods:{

    // 判断得到按钮的文字
    getButtonText() {
      let text =  this.practiceState == 1? this.$t('i18n.practiceNotStarted'):
                  this.answerState == 0? this.$t('i18n.continuePractice'):
                  this.answerState == 2? this.$t('i18n.startPractice'):
                  this.answerState == 1? this.$t('i18n.againPractice'): '';
      return text;
    },

    // 进入练习详情页
    enterDetal() {
      this.$router.push({name: 'practice_detail', params: {id: this.id}});
    },

    // 进入练习页
    enterExam () {
      if (this.getButtonText() == this.$t('i18n.practiceNotStarted')) return;
      window.location.href = window.parseURL(_.baseURL+"/jsp/wap/examination/practice/practice_answer.jsp?id=" + this.id);
    },
  },
};

</script>

<style lang="scss" scoped>
.qwui-lean_practice {
  margin-top: 10px;
  padding: 10px 15px 14px;
  background: #fff;

  .practice_name {
    color: #333;
    font-size: 16px;
    line-height: 20px;
  }
  .practice_time {
    margin: 5px 0;
    color: #999;
  }
  .practice_explain {
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .practice_img_list {
    margin: 10px 0 5px;
  }
  .practice_button {
    float: right;
    display: inline-block;
    height: 25px;
    padding: 0 12px;
    font-size: 13px;
    color: #45a8f5;
    line-height: 25px;
    border: 1px #45a8f5 solid;
    border-radius: 4px
  }
  .practice_button_wait {
    color:#ccc;
    border:1px #ccc solid;
  }
}
</style>
