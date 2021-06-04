<template>
  <div class="onlineEditing_leadInto">
    <qwui-button
      class="button_leadInto"
      :type="isBan?'':'primary'"
      :disabled="isBan"
      @click="clickLeadInto"
    >导入</qwui-button>
  </div>
</template>

<script>
import QwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import { mapGetters , mapActions } from 'vuex';

export default {
  name: 'WrapLeadInto',
  components: {
    QwuiButton
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('questionManageOnlineEditing', [
      'errorInfoArr',
      'questionsLength',
      'isOverMaxLine',
      'Bus'
    ]),
    isBan() {
      // 有错误、无题都禁止提交
      return this.errorInfoArr.length > 0 || !this.questionsLength || this.isOverMaxLine;
    }
  },

  methods: {
    clickLeadInto(){
      // 禁止则拦截掉
      if (this.isBan) {return;}

      this.Bus.$emit('leadInto');
    }
  },
}
</script>
<style lang="scss" scoped>
.onlineEditing_leadInto {
  text-align: center;
  margin: 32px 0 48px;
  
  .button_leadInto {
    width: 74px;
  }
}
</style>
