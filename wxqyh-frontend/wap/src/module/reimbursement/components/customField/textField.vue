<template>
  <div class="qwui-reim_field_text">
    <div class="qwui-reim_field_item">
      <div class="qwui-reim_field_name">
        <pre class="qwui-reim_field_label" :class="{'is-require': field.isMust == '1'}">{{field.name || field.customName}}</pre>
      </div>
      <input
        class="qwui-field_input"
        :placeholder="field.remark || $t('i18n.pleaseEnter')"
        :value="field.value"
        :maxlength="maxLength"
        @input="setValue($event,field)"
        :readonly="field.readonly"
        @blur="validate">
    </div>
    <p v-if="inputValue && isOverSize" class="qwui-tip qwui-warn_tip ">{{$t('i18n.reim.wordsExceed')}}</p>
  </div>
</template>
<script>
  import {field_validation} from './validation.js'
  export default {
    name: 'QwCustomTextField',
    props: {
      field:{
        type:Object,
        default(){
          return {}
        }
      },
    },
    data() {
      return {
        inputValue: this.field.value,
        data: this.field,
        maxLength: 20
      }
    },
    watch:{
      'field.value':{
        handler(value) {
          this.inputValue = value;
        },
        deep: true,
      }
    },
    computed: {
      isOverSize() {
        return this.inputValue.length >= this.maxLength;
      },
    },
    methods: {
      setValue({target},field){
        var key = field.id;
        this.inputValue = target.value;
        this.inputValue = this.inputValue.trim();
        this.$emit('change',this.inputValue,key)
      },
      validate(){
//        field_validation(this.data,this.inputValue);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../styles/common.scss';
.qwui-reim_field_text{
  padding: $box-padding;
  padding-left: 0;
  .qwui-tip{
    text-align: right;
    padding-top: 5px;
  }
}
  .qwui-reim_field_item {
    display: flex;
    .qwui-reim_field_name {
      white-space: nowrap;
      font-size: $font-size-medium-x;
      line-height: 20px;
      text-align: left;

      .qwui-reim_field_label{
        font-family: 'PingFang SC','Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
        margin: 0;
        width: 110px;
        &.is-require {
        &::after {
           content: ' *';
           color: $color-text-warn;
         }
        }
      }
    }
    .qwui-field_input {
      flex: 1;
      width: 130px;
      font-size: $font-size-medium-x;
      line-height: 19px;
      text-align: right;
      padding-left: 30px;
      color: #333;
    }
  }
</style>
