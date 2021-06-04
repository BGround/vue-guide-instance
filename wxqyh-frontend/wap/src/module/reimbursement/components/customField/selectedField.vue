<template>
  <div class="qwui-reim_field_item">
    <div class="qwui-reim_field_name" :class="{'is-require': field.isMust == '1'}">
      <span class="qwui-reim_field_label">{{field.name || field.customName}}</span>
    </div>
    <!--<div v-if="field.readonly" class="qwui-field_input">{{field.value}}</div>-->
    <div class="qwui-select_control">
      <select
        class="qwui-field_select"
        :class="{'placeholder':!selectValue }"
        v-model="selectValue"
        @change="setValue($event,field)"
        v-if="!field.readonly">
          <option value="">{{$t('i18n.pleaseSelect')}}</option>
          <option
            :value="option.value"
            v-for="(option,index) in field.options"
            :key="index">{{option.value}}
          </option>
      </select>
    </div>
  </div>
</template>
<script>
  import {field_validation} from './validation.js'
  export default {
    name: 'QwCustomSelectedField',
    props: {
      field:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data() {
      return {
        selectValue: this.field.value || ''
      }
    },
    updated(){
        this.selectValue = this.field.value || ''
    },
    watch:{
      'field.value':{
        handler(value) {
          this.selectValue = value;
        },
        deep: true,
      }
    },
    methods: {
      setValue({target},field){
        var key = field.id;
        this.selectValue = target.value;
        this.selectValue = this.selectValue.trim();
        this.$emit('change',this.selectValue,key)
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../styles/common.scss';

  .qwui-reim_field_item {
    display: flex;
    padding: $box-padding;
    padding-left: 0;
     .qwui-reim_field_name {
        white-space: nowrap;
        font-size: $font-size-medium-x;
        line-height: 20px;
        text-align: left;
        width: 110px;
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
    .qwui-select_control{
      position: relative;
      display: flex;
      flex: 1;
      direction: rtl;
      text-align: right;

      &::after{
         position: absolute;
         top: 5px;
         right: 0;
         @extend .arrow_right;
       }
      .qwui-field_select{
        width: 100%;
        padding-right: 25px;
        font-size: $font-size-medium-x;
        line-height: 20px;
        -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        outline: none;
        border: none;
        background: $color-background;
        padding-left: 30px;
        color: #333;
        &.placeholder {
           color: #bbb;
         }
        option{
          direction: rtl;
        }
      }
    }
  }
</style>
