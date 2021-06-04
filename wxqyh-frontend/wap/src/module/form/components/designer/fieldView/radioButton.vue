<template>
  <div class="fieldView">
    <p class="fieldView-title">
      {{FieldItem.label}}
      <span v-show="titleTip" class="titleTip">{{titleTip}}</span>
      <span v-show="FieldItem.validations.indexOf('presence')>-1" class="mustTip">*</span>
    </p>
    <div class="fieldView-radioItem">
      <label
        class="fieldView-radio"
        :class="rows"
        v-for="item in FieldItem.choices"
      >
        <input
          disabled="disabled"
          class="icon_check_sm"
          :type="TYPE[FieldItem._type]"
          :checked="item.selected"
          :value="item._id"
        >
        <span class="text">{{item.value}}</span>
      </label>
    </div>
  </div>
</template>

<script>
  import DesignerMap from '../data/DesignerMap'
  const TYPE = {
    [DesignerMap.RadioButton]: 'radio',
    [DesignerMap.DropDown]: 'radio',
    [DesignerMap.CheckBox]: 'checkbox',
  }
  export default {
    name: "RadioButton",
    props: {
      FieldItem: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    data() {
      return {
        TYPE,
      }
    },
    computed: {
      rows() {
        return 'rows'+this.FieldItem.line_row
      },
      titleTip() {
        let max = this.FieldItem.maximum_length
        let min = this.FieldItem.minimum_length
        if( min && max ) {
          return '（请选择' + min + '-' + max + '个选项）'
        }
        if(!min && max) {
          return '（请选择最多' + max + '个选项）'
        }
        if(min && !max) {
          return '（请选择最少' + min + '个选项）'
        }
        return ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fieldView-radioItem {
    display: flex;
    flex-flow: wrap;
  }
  .fieldView-radio {
    display: flex;
    align-items: start;
    flex: 1;
    font-size: 15px;
    padding-right: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    box-sizing: border-box;
    color: #7A7D80;
    &.rows1 {min-width: 100%;}
    &.rows2 {min-width: 50%;}
    &.rows3 {min-width: 33.3%;}
    .text {
      flex: 1;
    }
  }
  [type=checkbox].icon_check_sm {
    margin-top: 4px;
  }

</style>
