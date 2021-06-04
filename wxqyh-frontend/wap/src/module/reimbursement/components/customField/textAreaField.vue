<template>
  <div class="qwui-reim_field_item">
    <div class="qwui-reim_field_name" :class="{'is-require': field.isMust == '1'}"><span class="qwui-reim_field_label">{{field.name || field.customName}}</span></div>
    <qw-textarea
      class="qwui-reim_field_content qwui-remarks_content"
      @input="setValue($event,field)"
      :placeholder="field.remark || $t('i18n.pleaseEnter')"
      :readonly="field.readonly"
      v-model="field.value"
      :initRows="3"
      :maxLength="255"
    ></qw-textarea>
  </div>
</template>
<script>
  import QwTextarea from './textarea';
  import {field_validation} from './validation.js'
  export default {
    name: 'QwCustomTextAreaField',
    props: {
      field:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    components: {
      QwTextarea
    },
    data() {
      return {
        inputValue:this.field.value
      }
    },
    methods: {
      setValue(target,field){
        var key = field.id;
        this.inputValue = target;
        var value = target;
        value = value.trim();
        this.$emit('change',this.inputValue,key)
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../styles/common.scss';

  .qwui-reim_field_item {
    display: flex;
    flex-direction: column;
    padding: $box-padding;
    padding-left: 0;
    .qwui-reim_field_name {
       white-space: nowrap;
       font-size: $font-size-medium-x;
       line-height: 20px;
       text-align: left;
      &.is-require {
      &::after {
         content: ' *';
         color: $color-text-warn;
       }
      }
      .qwui-reim_field_label{
        white-space: pre-wrap;
      }
    }
    .qwui-reim_field_content {
      flex: 1;
      text-align: right;
    }
    .qwui-remarks_content {
      margin-top: 15px;
      width: 100%;
    }
  }
</style>
