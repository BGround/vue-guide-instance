<template>
  <div class="custom-fields">
    <div class="fields-group" v-for="(field) in list" :key="field.id">
      <component v-bind:is="getFieldComponent(field)"
                 :field="field"
                 :value="field.value"
                 :readonly="readonly || field.readonly"
                 :placeholder="field.placeholder"
                 :maxLength="field.maxLength"
                 @change="setValue">
      </component>
    </div>
  </div>
</template>

<script>
  import TextField from '../fields/textField'
  import TextAreaField from '../fields/textAreaField'
  import DropDownField from '../fields/dropDownField'
  import NumberField from '../fields/numberField'
  export default {
    name: 'customFields',
    props: {
      list: {
        type: Array,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      TextField,
      TextAreaField,
      DropDownField,
      NumberField
    },
    methods: {
      //自定义字段
      getFieldComponent(field) {
        let component
        switch(field.type) {
          case '0':
            component = 'dropDownField'
            break
          case '1':
            component = 'textField'
            break
          case '2':
            component = 'textAreaField'
            break
          case '3':
            component = 'numberField'
            break
        }
        return component
      },
      setValue(val) {
        this.$emit('change',val)
      }
    }
  }
</script>

<style>
</style>
