<template>
	<div class="field-content">
		<div class="textarea-field"
			 :class="{'text-field-help':field.help, 'text-field-focus':focus,readOnly: unEditable}">
			<div v-if="!unEditable" class="textarea_div_edit" @focus="focus=true" contenteditable="true"
				 	@blur="validate()" @input="countLength($event),setValue($event)"
					 v-html="filterTextContent(tempFieldValue)"
			>
			</div>
			<div v-else class="textarea_div_edit asdasd"
					 v-html="filterTextContent(field.value)"
					 contenteditable="false"
			>
			</div>
			<p class="font-count" v-if="field.disabled||field.readonly?false:fieldVal" :class="{colorRed:fieldVal == field.maximum_length}">{{fieldVal}}/{{ field.maximum_length }}</p>
		</div>
	</div>
</template>
<script>
	import {field_validation} from './validation.js'
	export default {
		props: [ 'field' ],
		data () {
			return {
				focus: false,
				fieldVal: 0,
        tempFieldValue: '',
			}
		},
		created () {
			this.fieldVal = this.field.value ? this.field.value.length : 0;
			this.tempFieldValue = this.field.value;
		},
		computed:{
      unEditable() {
        return this.field.disabled || this.field.readonly;
      }
		},
		methods: {
			setValue ({target}) {
				var key = this.field._id;
				var value = target.innerText
				value = value.trim ();
        this.$emit ('change', {key, value})
        if(value.length == this.field.maximum_length) {
          this.field.help = '最大长度为 ' + this.field.maximum_length + ' 字';
          target.focus();
          this.$nextTick(()=>{
            // 重新聚焦后，定位到尾部
            var range = this.getSelectedText(); //创建range
            range.selectAllChildren(target); //range 选择obj下所有子内容
            range.collapseToEnd(); //光标移至最后
          })
        }

			},
			countLength ({target}) {
        if (navigator.userAgent.indexOf('Firefox') >= 0) {
          this.fieldVal = target.textContent.length;
        } else {
          this.fieldVal = target.innerText.length;
        }
				if (target.innerText.length > this.field.maximum_length) {
					this.fieldVal = this.field.maximum_length;
					target.innerText = target.innerText.slice (0, this.field.maximum_length)
					target.blur();
				}
			},
			filterTextContent(str){
				if(!str) return str;
				else {
					str = str.replace(/\n\r|\n|\r/g,"<br>")
					return str.indexOf('http')!=-1&&this.field.disabled? _.checkURL(str,false):str   //处理文本内容，剔除URL
				}
			},
			validate(){
				field_validation(this.field);
				this.tempFieldValue = this.field.value;
        this.focus = false;
			},
      // 兼容性处理，获取所选的对象,用于鼠标聚焦到文本框尾部
      getSelectedText() {
        var txt = '';
        if (window.getSelection) {
          txt = window.getSelection();
        } else if (window.document.getSelection) {
          txt = window.document.getSelection();
        } else if (window.document.selection) {
          txt = window.document.selection.createRange().text;
        }
        return txt;
      }
		},
    watch: {
      unEditable: {
        handler: function(val) {
          if (val) {
            this.tempFieldValue = this.field.value;
          }
        }
      }
    }
	}
</script>
<style scoped>

	.text-field-focus {
		border: 1px solid #479de6;
	}
</style>
