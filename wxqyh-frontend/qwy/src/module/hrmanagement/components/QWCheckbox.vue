
<template>
  <div class="qwui-checkbox" :class="{
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
  </div>
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
  @import '../style/qwuiCheckbox.scss';
</style>
