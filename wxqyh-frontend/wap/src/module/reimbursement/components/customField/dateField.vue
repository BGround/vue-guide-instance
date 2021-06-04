<template>
  <div class="qwui-reim_field_item" :class="{'qwui-select_field': !field.readonly }">
    <div class="qwui-reim_field_name" :class="{'is-require': field.isMust == '1'}"><span class="qwui-reim_field_label">{{field.name || field.customName}}</span></div>
    <div class="qwui-field_input qwui-date_container">
      <div class="qwui-time_input" :class="{'qwui-time_input_text': !field.value}" @click="selectTime">{{time}}</div>
    </div>

    <!--时间组件-->
    <time-picker v-bind="timePicker" @confirm="change" @cancel='cancel'></time-picker>
  </div>
</template>
<script>
  import {field_validation} from './validation.js'
  import timePicker from '@/components/basicUI/qwuiPicker/time_picker.vue';

  export default {
    name: 'QwCustomDateField',
    props: {
      field:{
        type:Object,
        default() {
          return {}
        }
      }
    },
    components: {
      timePicker,
    },
    data() {
      return {
        time:this.field.value || this.field.remark || this.$t('i18n.pleaseSelect'),
        timePicker:{ // 时间组件配置
          dateOnly:true,
          show:false,
          defaultDate: this.field.value
        },
      }
    },
    updated(){
      this.time = this.field.value || this.field.remark || this.$t('i18n.pleaseSelect');
      this.timePicker.defaultDate = this.field.value;
    },
    methods: {
      change(val){
        this.timePicker.show = false;
        var key = this.field.id;
        this.time = val;
        this.$emit('change',val,key)
      },
      selectTime(){
        this.timePicker.show = true;
      },
      cancel(){
        this.timePicker.show = false;
      }

    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../styles/common.scss';

  .qwui-reim_field_item {
    display: flex;
    padding: $box-padding;
    padding-left: 0;
    &.qwui-select_field::after {
     @extend .arrow_right;
       margin-left: $box-padding;
       align-self: center;
     }
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
    .qwui-field_input {
      flex: 1;
      font-size: $font-size-medium-x;
      line-height: 15px;
      text-align: right;
    }

    .qwui-date_container {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .qwui-time_input {
        cursor: pointer;
        padding-left: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: pre-wrap;
        font-size: $font-size-medium-x;
        color: $color-text-d;
        text-align: right;
        line-height: 19px;
        background: $color-background;
      }
      .qwui-time_input_text{
        color: #bbb;
      }
     }

  }
</style>
