<!-- 
  参数：
  @param label(默认'')：Radio 的 value
  @param disabled(默认false)：是否禁用
  @param border(默认false)：是否显示边框
  方法：
  @param change：选中radio的回调方法

  用法：页面必须设置v-model（默认选中），label（value值）
  1.基本单选
  <qwui-radio v-model="radioValue" label="上海">上海</qwui-radio>
  <qwui-radio v-model="radioValue" label="广州">广州</qwui-radio>
  2.禁用状态
  <qwui-radio v-model="radioValue1" label="苹果" disabled>苹果</qwui-radio>
  <qwui-radio v-model="radioValue1" label="香蕉" disabled>香蕉</qwui-radio>
  3.带边框
  <qwui-radio v-model="radioValue2" label="电视机" border>电视机</qwui-radio>
  <qwui-radio v-model="radioValue2" label="电脑" border>电脑</qwui-radio>
-->
<template>
  <label class="qwui-checkbox" :class="{
      'is-checked':checked,
      'is-disabled':disabled,
    }">
    <span class="qwui-checkbox-input">
      <span class="qwui-checkbox-inner"></span>
      <input type="checkbox" class="qwui-checkbox-original"
       :class="[{
        'is-checked':checked,
        'is-disabled':disabled
        }]"
        :value="label"
        :disabled="disabled"
        v-model="model"
        @change="handleChange">
    </span>
    <span class="qwui-checkbox-label">
      <slot></slot>
      <template v-if='!$slots.default'>{{label}}</template>
    </span>
  </label>
</template>

<script type="text/ecmascript-6">
  export default {
    name: "qwuiCheckbox",
    data() {
      return {

      }
    },
    props: {
      value: {
        type: [String, Number, Boolean],
        default: ''
      },
      // checkbox 的 value值
      label: {
        type: [String, Number, Boolean],
        default: ''
      },
      disabled:{
        type:Boolean,
        default:false
      },
      checked:{
        type:Boolean,
        default:false
      }
    },
    computed: {
      model: {
        get() {//获取选中的value
          // return this.isGroup?this.checkboxGroup.value:this.value
          return this.value
        },
        set(val) {//设置父组件选中的value
          this.$emit('input', val)
        }
      },
      //是否多选框组
      // isGroup(){
      //   let parent=this.$parent
      //   while(parent){
      //     if(parent.$options.name=='qwuiCheckboxGroup'){
      //       this.checkboxGroup=parent
      //       return true
      //     }
      //   }
      //   return false
      // }
    },
    methods: {
      handleChange() {
        this.$nextTick(() => {
          this.$emit('change', this.model);
        });
      }
    }
  }

</script>

<style scoped lang="scss">
  @import './qwuiCheckbox.scss';
</style>
