<template>
  <div class="wrap qwui-lean_quick_experience">
    <div
      v-for="(item, index) in list"
      class="lean_entry_list_item qwui-flexbox"
      :key="index"
      @click="routerOrJump(item)"
    >
        <span class="qwui-flexItem">
          <i :class="['relavent_icon', list[index].class]"></i>
          <span :class="item.class"></span>
          {{item.text}}
        </span>
        <i class="qwui-icon_arrow_fr icon_gray"></i>
    </div>
  </div>
</template>

<script>

export default {
  name: 'QwQuickExperience',
  components: {
  },
  data(){
    return {
      list: [
        {class: 'learningTasks', key: 'learningTasks', text: this.$t('i18n.learningTasks'), routerName: 'broadcast',},
        {class: 'examEvaluation', key: 'examEvaluation', text: this.$t('i18n.examEvaluation'), routerName: 'broadcast',},
        {class: 'pretestPractice', key: 'pretestPractice', text: this.$t('i18n.pretestPractice'), routerName: 'broadcast',},
      ]
    };
  },
  computed: {
  },
  methods:{
    routerOrJump(item) {
      this.$router.push({name: item.routerName, params: {
        key: item.key
      }});
    }
  }
};

</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';

.qwui-lean_quick_experience {
  height: 100vh;
  color: #333;
  background: #fff;

  .lean_entry_list_item {
    margin-left: 17px; /*在这里不都用margin，是因为有*/
    padding-right: 15px; /*下划线border-bottom的存在。所以right用padding*/
    height: 50px;
    font-size: 16px;
    line-height: 50px;
    @include border-b-1px(#E6E6E6);
    /*最后一行margin-left改padding-left，下横线长度有变化*/
    &:last-of-type {
        margin-left: 0;
        padding-left: 17px;
    }
  }

  .relavent_icon {
    position: relative;
    top: 5px;
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-right: 9px;
    background-size: cover;
  }
  .pretestPractice {
    background-image: url('~@/assets/images/ic_pretestPractice.png');
  }
  .examEvaluation {
    background-image: url('~@/assets/images/ic_examEvaluation.png');
  }
  .learningTasks {
    background-image: url('~@/assets/images/ic_learningTasks.png');
  }
}
</style>
