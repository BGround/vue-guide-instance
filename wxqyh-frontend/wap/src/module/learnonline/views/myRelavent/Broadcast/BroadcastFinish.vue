<template>
  <div class="qwui-lean_broadcast_finish">
    <div class="finish_icon"></div>
    <div class="tip">{{$t('i18n.congratulations')}}</div>
    <div class="title">{{$t('i18n.finishTitleBefore') + title + $t('i18n.finishTitleAfter')}}</div>
    <div class="button" @click="back">{{$t('i18n.returnBack')}}</div>
  </div>
</template>

<script>

export default {
  name: 'QwBroadcastFinish',
  components: {
  },
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data(){
    return {
    };
  },
  computed: {
  },
  methods:{
    back() {
      this.$emit('back');
    }
  },
  created() {
  }
};

</script>

<style lang="scss" scoped>

.qwui-lean_broadcast_finish {
  height: 100vh;
  padding-top: 96px;
  background: #fff;
  text-align: center;

  .finish_icon {
    width: 160px;
    height: 102px;
    margin: 0 auto;
    background: url('~assets/images/learnonline/img_learn_finish.png') no-repeat center;
    background-size: cover;
  }
  .tip {
    margin-top: 24px;
    font-size: 23px;
    color: #0A1735;
  }
  .title {
    margin-top: 4px;
    font-size: 13px;
    color: #7A7C80;
  }
  .button {
    margin: 22px auto 0 auto;
    width: 132px;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    color: #fff;
    background: #5585F0;
    border-radius: 4px;
  }
}
</style>
