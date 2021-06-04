<template>
<div class="lean_examing_tip" @click="clickExaming">
  <div class="qwui-flexbox examing_tip">
    <span class="qwui-flexItem">
      {{$t('i18n.examingTips')}}
    </span>
    <i class="qwui-icon_arrow_fr"></i>
  </div>
</div>
</template>

<script>
export default {
  name: 'ExamingTip',
  components: {
  },
  props: {
  },
  data(){
    return {
    };
  },
  methods:{
    clickExaming() {
      this.$emit('clickExaming');
    }
  },

};

</script>

<style lang="scss" scoped>

.lean_examing_tip {

  .examing_tip {
    height: 40px;
    padding: 0 15px;
    font-size: 15px;
    color: #fff;
    line-height: 40px;
    background: #E94F4F;
    cursor: pointer;
  }
}
</style>
