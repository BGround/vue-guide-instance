<template>
  <div class="field-content" v-if="field.status != '0'">
    <p class="title ellipsis">{{field.optionName}}
      <span v-if="field.isMust && (field.isMust == '1' || field.isMust == '3') && !readonly" class="qwui-required_mark">*</span>
    </p>
    <div class="textarea-field" v-if="!readonly">
      <textarea class="multi-line" :ref="'field-'+field.id"
        :id="'field-'+field.id"
        :maxlength="maxLength"
        :value="newValue"
        @input="setValue"
        :placeholder="newPlaceholder">
      </textarea>
      <p class="font-count" v-show="newValue.length>0">{{newValue.length}}/{{maxLength}}</p>
    </div>
    <div class="textarea-field" v-if="readonly">{{newValue}}</div>
  </div>
</template>
<script>
  export default {
    name: 'textAreaField',
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
        default: 200
      }
    },
    data () {
      return {
        newPlaceholder: '',
        newValue: ''
      }
    },
    mounted() {
      this.newValue = this.value || ''
      if(this.placeholder) {
        this.newPlaceholder = this.placeholder
      } else {
        this.newPlaceholder = this.field.list && this.field.list.length ? this.field.list[0].name : '请输入' + this.field.optionName
      }
    },
    methods: {
      setValue(e) {
        let el = e.target
        el.style.height = 'auto'
        el.style.height = el.scrollHeight + "px"
        this.newValue = el.value
        let key = this.field.itemId
        this.$emit ('change', {key, value: this.newValue.trim()})
      }
    },
    updated() {
      if(this.$refs['field-'+this.field.id]) this.$refs['field-'+this.field.id].style.height = this.$refs['field-'+this.field.id].scrollHeight + "px"
    },
    watch: {
      value(val) {
        this.newValue = val
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
  .field-content textarea {
    font-size: 15px;
    color: #0A1735;
  }
  .field-content .title {
    height: 21px;
    line-height: 21px;
    font-size:15px;
    color: #7A7C80;
    margin-right: 20px;
    max-width: 120px;
  }
  .field-content .textarea-field {
    width: 100%;
    font-size:15px;
    background:#fff;
    padding-top: 12px;
    color: #0A1735;
  }
  .field-content .textarea-field .textarea_div_edit {
    outline:none;
    min-height: 75px;
    word-break: break-all;
  }
  .field-content .textarea-field .multi-line {
    display: block;
    width: 100%;
    min-height: 21px;
    border: none;
    resize: none;
    overflow: auto;
    margin-bottom: 25px;
    word-break: break-all;
  }
  .font-count {
    font-size: 12px;
    text-align: right;
    color: #a6a6a6;
    height: 17px;
    line-height: 17px;
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
