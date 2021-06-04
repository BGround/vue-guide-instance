<template>
	<div class="field-content">
		<div class="field-bcolor clearfix choice-field" :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}">
			<div class="choice-field-item checkbox-field-item"
					 v-for="choice in field.choices" @click="ontouch(choice._id,choice.quota)"
					 :class="{row1:1==field.line_row,row2:2==field.line_row,row3:3==field.line_row,
					 'choice-field-click':!(field.disabled||field.readonly),
					 colorGray:selectQuota[choice._id]&&selectQuota[choice._id].selectedNum>=choice.quota}"

			>
				<i :class="{active:fieldVal.indexOf(choice._id)!=-1,noClick:selectQuota[choice._id]&&selectQuota[choice._id].selectedNum>=choice.quota||field.disabled}"></i>{{choice.value}}
				<span v-if="selectQuota[choice._id]&&selectQuota[choice._id].selectedNum>=choice.quota">(选项名额已空)</span>
			</div>
		</div>
	</div>
</template>
<script>
	import {field_validation} from './validation.js'
	import {setFieldShowHide} from 'vpModule/js/form/getData'
	export default {
		props: ['field'],
		data() {
			return {}
		},
		created() {
			this.field.value = this.field.value || []
			this.field.choices.forEach(choice =>{
				if(this.selectQuota[choice._id]&&this.selectQuota[choice._id].selectedNum>=choice.quota){
					if(this.field.value.indexOf(choice._id) != -1){
						this.field.value.splice( this.field.value.indexOf(choice._id), 1 );
					}
				}
			})
		},
    mounted(){
      if(this.field.show){
        this.setRelate(this.field.value);
      }
    },
		computed:{
			selectQuota(){
				return this.$store.state.formBase.selectQuota||{};
			},
      fieldVal(){
			  return this.field.value||[];
      }
		},
		methods: {
			setValue(value) {
				var key = this.field._id;
				this.$emit('change', {key, value})
				this.setRelate(value);
				field_validation(this.field);
			},
			ontouch(val,num) {
				this.field.help = '';
				if (this.field.disabled||this.field.readonly) {
					return;
				}
				var quota = this.selectQuota;
				if(quota){
					var info = quota[val];
					if(info&&info.selectedNum >= Number(num)){
						this.field.help = '选项名额已空';
						return;
					}
				}
				var arry = this.field.value;
				if (arry.indexOf(val) == -1) {
					arry.push(val)
				} else {
					arry.remove(val);
				}
				this.setValue(arry);

			},
			setRelate(val) {
				//判断是否是显示逻辑字段,如果是显示逻辑设置的字段
				var relateMatch = this.$store.state.formBase.relateMatch;
 				var relateMap = this.$store.state.formBase.relateMap;
				var relateAllMap = this.$store.state.formBase.relateAllMap;
        var formData = this.$store.state.formBase.data;
        var schema = this.$store.state.formBase.schema;
				if (relateMatch.indexOf(this.field._id) != -1) {
					//显示和隐藏字段,通过choices获取显示字段
					var showArry = [];
					var hideArry = [];
					this.field.choices.forEach(function (item) {
						var relateIds = item.relate_show_ids || [];
						if (val.indexOf(item._id) == -1) {
							relateIds.forEach(function (i) {
								hideArry.push(i);
                                relateMap[i] && hideArry.push(relateMap[i])
							})
						}
					});

          //所有可显示的字段
          schema.forEach( field => {
            //字段在hideArry 或 不显示字段 或 不是逻辑字段
            if ( hideArry.includes(field._id) || !field.show || !relateMatch.includes(field._id) ) return;
             //多选是数组
            if ( Array.isArray(field.value) ) {
              field.value.forEach( item => {
                relateAllMap[item] && showArry.push( ...relateAllMap[item] )
              })
              //单选/下拉 是String
            } else {
              relateAllMap[ field.value ] && showArry.push( ...relateAllMap[ field.value ]);
            }
          })
					var obj = {};

					function showRecursion(arry) {
            if(!arry) return;
						var newArry = [];
						arry.forEach(function (item) {
							newArry.push(item);
						});
						for (var key in relateMap) {
							if (arry.indexOf(key) != -1) {
								//显示的值有数据
								var selectValue = formData[key];
								if (selectValue && typeof selectValue == 'string') {
									newArry = newArry.concat(showRecursion(relateAllMap[selectValue]))
								} else if (selectValue instanceof Array && selectValue.length) {
									selectValue.forEach(function (i) {
										newArry = newArry.concat(showRecursion(relateAllMap[i]))
									})
								}

							}
						}
						return newArry;
					}
          function hideRecursion(arry) {
            if(!arry) return;
            var newArry = [];
            arry.forEach(function (item) {
              newArry.push(item);
            });
            for (var key in relateMap) {
              if (arry.indexOf(key) != -1) {
                newArry = newArry.concat(hideRecursion(relateMap[key]))
              }
            }
            return newArry;
          }
          //隐藏字段
          var newHideArry = hideRecursion(hideArry);
          newHideArry.forEach(function (i) {
            obj[i] = false;
          });
          //显示字段
					var newShowArry = showRecursion(showArry);
					newShowArry.forEach(function (i) {
						obj[i] = true;
					});
					setFieldShowHide(this.$store, obj);
				}
			}
		}
	}
</script>
