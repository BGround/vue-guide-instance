<template>
	<div class="field-content">
		<div v-if="field.line_row==2">
			<div @click="addFieldData(field)">添加数据</div>
			<!--横板布局-->
			<div class="form-databox">
				<div class="form-databox-table">
					<table>
						<tbody>
						<tr>
							<th v-for="child in field.children" :key="child.id">
								<span class="widget-title"> {{child.label}}</span>
							</th>
						</tr>
						<tr v-for="(item, index) in children" :key="item.id" @click="showItem(item,index)">
							<td v-for="items in item.fields" :key="items.id">{{showValue(items)}}</td>
							<td @click.stop="deleteItem(index)">删除</td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!--竖版布局  line_row为2横1竖-->
		<div v-if="field.line_row!=2">
			<div v-for="(item, index) in children" :key="index" class="childForm-item">
				<div class="cf-tit-box clearfix" @click="toggle(item)">
					<div class="fl"><span class="childForm-item-icon" :class="{ 'icon-open':!item.isMax,'icon-shrink':item.isMax }">
					</span> <span>    {{index+1+'.'+field.label}}</span></div>
					<div v-if="!field.disabled" class="fr">
						<span @click.stop="copyItem(index)" class="childForm-item-icon icon-copy">
						</span>
						<span  @click.stop="deleteItem(index) " class="childForm-item-icon icon-delete">
						</span></div>
					</div>
				<child-item ref="mychild" :childItem="item.fields" :index="index" v-show="item.isMax" @change="itemChange"></child-item>
			</div>
			<div v-if="!field.disabled" class="cf-cz childForm-item-add" @click="addFieldData_bottom(field)">添加数据</div>
		</div>
		<div v-if="isEmpty" class="readOnly geo-field">未填写</div>
	</div>
</template>

<script>
	import childItem from '../childItem.vue'
	import {field_validation} from './validation.js'
	import {getChildDefault, cloneDeep} from '../../js/getData'
	//  import { cloneDeep} from 'lodash'
	export default {
		components: {
			childItem,
		},
		props: ['field'],
		data() {
			return {
				children: [],
				defaultValue: null,
			}
		},
		computed: {
			childView() {
				return this.$store.state.formBase.childView;
			},
			childSchema() {
				return this.$store.state.formBase.childSchema;
			},
      isEmpty(){
			  return (this.field.disabled && (this.field.value.length == 0)) ? true : false;
      }
		},
		created() {

			this.field.children.forEach(item =>{
				item.validations = item.validations || []
				item.readonly = item.validations.indexOf('uniqueness')!=-1?true:false;
				item.history = false;
				item.disabled = false;
				item.show = true;//是否显示的监听绑定
				if(item.notes == '请选择'||item.notes == '请输入'){
					item.notes = '';
				}
				item.help = '';
				//两级下拉框添加数据childChoices
				if (item._type == 'CascadeDropDown') {
					item.childChoices = [{value: '请选择'}];
				}
				//当子表单多行文本的字数无限制时，限制为2000
				if(item.maximum_length === 0){
					item.maximum_length = 2000;
				}
			});
			//重新渲染子表单(显示的视图)
			if(this.field.disabled){
				this.field.children.forEach(item =>{
					item.disabled = true;
				})
			}
			if(!this.field.disabled){
				this.initChildForm();//如果没有数据，添加一条数据(1.this.field.value加[{}],2.state.data添加数据,两个数据相同的)
			}
			this.resetChildView();//(只做渲染，不改数据，赋值children数据)
			this.$root.EventBus.$on('changeChildView', this.resetChildView);

		},

		methods: {
      itemChange(val){
        this.$emit('change', val, true);
      },
			//子表单初始化一条数据
			initChildForm() {
				var value = this.field.value = this.field.value || [];
				//子表单默认添加一条数据
				if (value.length == 0) {
					//设置子表单的默认值
					var param = {
						id: this.$store.state.formBase.formDetail.definitionId,
						fieldId: this.field._id,
						userId: dataBase.config.userId,
					}
					var _this = this;
					var hasDefault = false;
					try{
            this.field.children.forEach(function(item){
              try{
                if(['RadioButton','CheckBox','DropDown'].indexOf(item._type)!=-1){
                  item.choices.forEach(function(citem){
                    if(citem.selected){
                      hasDefault = true;
                      throw "true"
                    }
                  })
                }
              }catch (e){
              }

              if(item.predefined_value){
                hasDefault = true;
                throw "true"
              }
            });
          }catch (e){

          }
					//初始化默认值
          if(hasDefault){
            getChildDefault(param).then(function (result) {
              if (result.code == "0") {
                var defaultValue = result.data.default || {};
                _this.defaultValue = defaultValue;
                var str = JSON.stringify(defaultValue);
                var newObj = JSON.parse(str);
                //设置父的value
                _this.field.value = [newObj]
                var id = _this.field._id;
                _this.$emit('change', {key: id, value: [newObj]}, true);
                _this.$store.commit('setValue', {key: id, value: [newObj]});
                _this.resetChildView();
              }
            });
          }else{
            var defaultValue =  {};
            _this.defaultValue = defaultValue;
            var str = JSON.stringify(defaultValue);
            var newObj = JSON.parse(str);
            //设置父的value
            _this.field.value = [newObj]
            var id = _this.field._id;
            _this.$emit('change', {key: id, value: [newObj]}, true);
            _this.$store.commit('setValue', {key: id, value: [newObj]});
            _this.resetChildView();
          }

				}
			},
			//重新改变this.children的数据，相当于重新渲染(只做渲染，不改数据),初始化的时候执行和，横版的时候执行
			resetChildView() {
				var value = this.field.value = this.field.value || [];
				var isMaxs =[];
				//根据value和children赋值this.children
				if(this.children.length != 0){
					for(let i = 0 ; i < this.children.length ; i++){
						isMaxs.push(this.children[i].isMax);
					}
				}
				this.children.splice(0, this.children.length)
				for (var i = 0; i < value.length; i++) {
					var children = this.field.children;
					var str = JSON.stringify(children);
					var fields = JSON.parse(str);
					var map = value[i];
					for (var j = 0; j < fields.length; j++) {
						//初始化默认值
						fields[j].value = map[fields[j]._id];
					}
					var isMax = (isMaxs.length != 0 && typeof(isMaxs[i]) != 'undefined' ) ? isMaxs[i] : true;
					this.children.push({isMax: isMax, fields: fields})
				}
				this.field.views = this.children;
			},
			toggle(item) {
				item.isMax = !item.isMax;
			},
			//值的转义
			showValue(items) {

				//单项选则
				if (items._type == 'RadioButton' || items._type == 'DropDown') {
					var value = '';
					items.choices.forEach(item => {
						if (item._id == items.value) {
							value = item.value;
						}
					})
					return value;
				}
				//多项选择
				if (items._type == 'CheckBox') {
					var value = '';
					items.choices.forEach(item => {
						if (items.value.indexOf(item._id) != -1) {
							value = value + item.value + ',';
						}
					})
					return value;
				}
				//两级下拉框
				if (items._type == 'CascadeDropDown') {
					var value = '';
					if (items.value) {
						var id = items.value.split('_')[0];
						value = items.value.replace(id + '_', '');
					}
					return value;
				}
				return items.value;
			},

			//横版添加数据1.修改childView渲染的state的schema
			addFieldData(field) {
				var _this = this;

				var formData = cloneDeep(this.defaultValue || {});
				var str = JSON.stringify(field.children);
				var schema = JSON.parse(str);
				const schemaData = schema.map(item => {
					item.value = formData[item._id];
					item.help = '';
					//两级下拉框添加数据childChoices
					if (item._type == 'CascadeDropDown') {
						item.childChoices = [{value: '请选择'}];
					}
//          if(equationMatch.indexOf(item._id)!=-1){
//            item.equa = true;
//          }
					return item;
				});
				var obj = {
					show: true,
					parentId: field._id,
					index: null
				}
				this.setChildSchema(schemaData);
				this.setChildView(obj);
				//设置子表单的默认值
				var param = {
					id: this.$store.state.formBase.formDetail.definitionId,
					fieldId: field._id,
					userId: dataBase.config.userId,
				}
				if (!this.defaultValue) {
					this.$store.dispatch('setChildSchema', {param: param, obj: this});
				}
				field_validation(field);
				this.scroll_height();
			},
			//竖版添加数据1.添加this.children的数据，2.添加state的data的数据，3.
			addFieldData_bottom(field) {
				var id = this.field._id;
				var old = this.$store.state.formBase.data[id] || [];
				//深拷贝defaultvalue
				this.defaultValue = this.defaultValue || {};
				var str = JSON.stringify(this.defaultValue);
				var newObj = JSON.parse(str);
				old.push(newObj)
        this.$emit('change', {key: id, value: old}, true);
				this.$store.commit('setValue', {key: id, value: old});
				this.resetChildView();
				field_validation(field);
				this.scroll_height();
			},
			//显示子表的数据，编辑表单
			showItem(schema, index) {
				if (this.field.disabled) return;
				var obj = {
					show: true,
					parentId: this.field._id,
					index: index
				}
				this.setChildView(obj);
				this.setChildSchema(schema.fields);
			},
			deleteItem(index) {
				var _this = this;
				_.alert('提示','确定删除此子表单？',{
					primaryBtn:{name:"i18n.confirm", callBack:function(){
						_this.field.value.splice(index, 1);
						_this.children.splice(index, 1);
						//重新设置子表单数据
            _this.$emit('change', {key: _this.field._id, value: _this.field.value}, true);
						_this.$store.commit('setValue', {key: _this.field._id, value: _this.field.value});
						//1.删除对应的children，2.删除state的data，3.删除this.field的value
						//执行统计的方法
						_this.$refs.mychild[0].statistic();
            field_validation(_this.field);
          }},
					defaultBtn:{name:"取消", callBack:null},
				});

			},
			copyItem(index) {
				var obj = cloneDeep(this.field.value[index]);
				this.field.value.push(obj);
				var child = cloneDeep(this.children[index]);//插入数据
				this.children.push(child);
        //重新设置子表单数据
        this.$emit('change', {key: this.field._id, value: this.field.value}, true);
				this.$store.commit('setValue', {key: this.field._id, value: this.field.value});
				this.resetChildView();
				this.$refs.mychild[0].statistic();
				this.scroll_height();
				for(let i=0 ; i<this.children.length ; i++){ //设置各个子表的展开状态
          this.children[i].isMax = i === this.children.length - 1 ? true : false;
        }
				field_validation(this.field);
			},
			scroll_height(){
				var _this = this;
				setTimeout(()=>{
					var itemList = _this.$el.querySelectorAll('.childForm-item');
					var top = itemList[itemList.length -1].offsetTop - 60;
          document.body.scrollTop = top;
          if(document.body.scrollTop == top)return;
          document.documentElement.scrollTop = top;
          if(document.documentElement.scrollTop == top)return;
          window.pageYOffset = top;
				},30)

			},
			setChildView(obj) {
				this.$store.commit('setChildView', obj)
			},
			setChildSchema(obj) {
				this.$store.commit('setChildSchema', obj)
			}
		}
	}
</script>

