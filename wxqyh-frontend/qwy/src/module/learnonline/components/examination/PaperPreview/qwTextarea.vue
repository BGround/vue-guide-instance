<template>
  <div class="qwui-paper_preview_textarea">
    <textarea 
      class="qw_textarea"
      v-model="value"
      @blur="handleBlur"
    >  
    </textarea>
  </div>
</template>

<script>
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';

export default {
  name: 'QwTextarea',
  components: {
    qwuiInput
  },
  data() {
    return {
      value: ''
    };
  },
  methods: {
    handleBlur(optionIndex) {
      this.$emit('handleBlur', {
        value: this.value
      });
    },

  },

};
</script>

<style lang="scss" scoped>
.qwui-paper_preview_textarea {
  .qw_textarea {
    width: 100%;
    height: 70px;
    padding: 5px 10px;
    font-family: inherit;
    line-height: 20px;
    border: 1px #ccc solid;
    resize: none;
    vertical-align: top;
    overflow: auto;
  }
}

</style>
