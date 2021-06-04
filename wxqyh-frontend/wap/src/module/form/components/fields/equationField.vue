<template>
  <div class="field-content">
    <input class="text-field" type="number"
           :class="{'readOnly':field.readonly || field.disabled}"
		   :readonly="field.readonly"
		   :value="field.value"
		   :disabled="field.disabled||field.readonly"
		   @blur="setValue($event,field)">
	  <div class="help-block" v-show="field.validations&&field.validations.indexOf('iscapital')!=-1">{{'大写金额￥：'+ smalltoBIG(field.value)}}</div>
    <div class="show-tips" v-show="showTips">计算公式中包含有隐藏的字段，对应值将默认为0</div>
  </div>
</template>
<script>
	import {convertCurrency} from '../../js/getData'
  export default {
    props:['field'],
    data(){
      return{
        showTips: false,
      }
    },
    created() {
      this.checkHideFields()
    },
		computed:{
      schema() {
        return this.$store.state.formBase.schema
      },
		},
    watch: {
      schema: {
        handler() {
          this.checkHideFields()
        },
        deep: true
      }
    },
    methods:{
      setValue({target},field){
        var key = field._id;
        var value = target.value
				var accurate_num = this.field.accurate_num;
				if (accurate_num != 0) {
					if (accurate_num < 0) {
						accurate_num = 0;
					}
					value = Number(value).toFixed(accurate_num);
				}
				target && (target.value = value);
        this.$emit('change',{key,value})
      },
      smalltoBIG(n){
        if(!n)return '';
        if(this.field.validations&&this.field.validations.indexOf('iscapital')!=-1){
          return convertCurrency(n);
        }
      },
      checkHideFields() { //是否含有隐藏字段
        let calculator = this.field.calculator
        if(calculator) {
          for(let i = 0;i < this.schema.length;i++) {
            this.showTips = calculator.includes(this.schema[i]._id) && !this.schema[i].show
            if(this.showTips) break
          }
        }
      }
    }
  }
</script>
<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0;
  }
  input[type="number"]{
    -moz-appearance:textfield;
  }
  .show-tips {
    padding-top: 6px;
    color: #479de6;
  }
</style>
