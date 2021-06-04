<template>
	<div class="field-content">
		<div v-if="field.disabled?true:users.length!=0" class="relative-field" >
			<div class="relative-list" v-for="item in users" @click="showCrmInfo(item)">
				<span class="relative-list-itemicon"></span>
        <span v-html="item.clientName"></span>
			</div>
		</div>
		<div v-if="!field.disabled"  class="childForm-item-add" @click="addCrm">点击添加</div>
	</div>
</template>
<script>
  import {field_validation} from './validation.js'
  import EventBus from 'vpModule/utils/eventBus'

	export default {
		props: [ 'field' ],
		created () {
			var person = this.field.value||[];
			var users = [];
			person.forEach(item =>{
				var arr = item.split('_');
				var clientName = arr.pop();
				var id = arr.join('_');
				users.push({
					id:id,
					clientName:clientName
				})
			});
			this.users = users;
		},
		data () {
			return {
				users: [],
        isShow: false
			}
		},
		methods: {
			setValue () {
				var field = this.field;
				var key = field._id;
				var value = field.value;
				field_validation(this.field);
				this.$emit ('change', {key, value});
			},
			addCrm () {
				//将当前的人员给到选人控件
				var _this = this;
				dataBase.selectCrm.show = true;
				dataBase.selectCrm.confirm = function (data) {
					_this.users = data.selectedList;
					var arry = [];
					for (var i = 0; i < _this.users.length; i++) {
            if(_this.users[i].clientName.indexOf('_') != -1) {
              _this.users[ i ].clientName = _this.users[ i ].clientName.replace(/_/g,'&#95;')
            }
						arry.push (_this.users[ i ].id + '_' + _this.users[ i ].clientName);
					}
					_this.field.value = arry;
					_this.setValue ();
				}
				dataBase.selectCrm.selectList = this.users;
				dataBase.selectCrm.data.crmUserId = dataBase.config.userId;
				dataBase.selectCrm.data.crmTypes = this.field.crm_types.join (',')
				//回调选中的人员
			},
      showCrmInfo(item) {
        EventBus.$emit("showCrmUtil",item,true);
      }
		}
	}
</script>
