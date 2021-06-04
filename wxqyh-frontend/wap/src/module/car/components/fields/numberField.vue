<template>
  <div class="field-content flex" v-if="field.status != '0'">
    <span class="title ellipsis">{{field.optionName}}
      <span v-if="field.isMust && (field.isMust == '1' || field.isMust == '3') && !readonly" class="qwui-required_mark">*</span>
    </span>
    <input type="number" class="text-field" v-if="!readonly"
           @input="regOut($event)"
           @blur="setValue($event, field)"
           :id="'field-'+field.id"
           :placeholder="newPlaceholder"
           v-model="newValue">
    <div class="text-field" v-if="readonly">{{value}}</div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'numberField',
    props: {
      field: {
        type: Object,
        required: true
      },
      value: {
        type: String
      },
      readonly: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String
      },
      maxLength:{
        type: Number,
        default: 11
      }
    },
    data() {
      return {
        newPlaceholder: '',
        newValue: ''
      }
    },
    mounted() {
      this.newValue = this.value
      if(this.placeholder) {
        this.newPlaceholder = this.placeholder
      } else {
        this.newPlaceholder = this.field.list && this.field.list.length ? this.field.list[0].name : '请输入' + this.field.optionName
      }
    },
    methods: {
      setValue({target}, field){
        let key = field.itemId
        let value = target.value.trim()
        this.$emit('change',{key, value})
      },
      regOut(e) {
        this.newValue = e.target.value.slice(0, this.maxLength)
      },
    },
    watch: {
      value(newValue) {
        this.newValue = newValue
      }
    }
  }
</script>

<style scoped>
  .field-content {
    width: 100%;
    padding: 12px 0;
  }
  .flex {
    display: flex;
  }

  .field-content .text-field {
    flex: 1;
    width: 100%;
    height: 21px;
    line-height: 21px;
    font-size:15px;
    color: #0A1735;
    background: #fff;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .field-content .title {
    height: 21px;
    line-height: 21px;
    font-size:15px;
    color: #7A7C80;
    margin-right: 20px;
    max-width: 120px;
  }
  /*input.placeholder颜色*/
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #D2D5DB;
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #D2D5DB;
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #D2D5DB;
  }
  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #D2D5DB;
  }
  /*修改placeholder颜色*/
  .error-tip::-webkit-input-placeholder{
    color: #FF586D;
  }
  .error-tip::-moz-placeholder{
    color: #FF586D;
  }
  .error-tip:-moz-placeholder{
    color: #FF586D;
  }
  .error-tip:-ms-input-placeholder{
    color: #FF586D;
  }
</style>
