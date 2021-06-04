<template>
	<div class="field-content">
		<div v-if="field.disabled?true:users.length!=0"  class="relative-field">
			<div class="relative-list"
                v-for="item in users"
                :key="item.id"
                @click="showPersonDetail(item)">
				<span class="relative-list-itemicon" >
        </span> <span v-html="item.personName"></span>
			</div>
		</div>
		<div v-if="!field.disabled && !field.readonly" class="childForm-item-add"  @click="addPerson">点击添加</div>
	</div>
</template>
<script>
	import EventBus from '@/utils/eventBus';
    import {field_validation} from './validation.js'
	import {getMember} from '../../js/getData'
	export default {
		props: [ 'field' ],
		created () {
			var person = this.field.value||[];
			var users = [];
			person.forEach(item =>{
				var arr = item.split('_');
				var name = arr.pop();
				var id = arr.join('_');
				users.push({
					userId:id,
					personName:name
				})
			});
      		this.users = users;
		},
		data () {
			return {
				users: []
			}
		},
    computed: {
      combineList() {
        return this.$store.state.formBase.schema
      },
      FlowAuditUser(){
        return this.$store.state.userSelected.FlowAuditUser; // 处理人信息
      }
    },
		methods: {
			setValue () {
				var field = this.field;
				var key = field._id;
				var value = field.value;
				field_validation(this.field);
				this.$emit ('change', {key, value});
        // 清空多个关联的必填项提示
        if (this.FlowAuditUser.length != 0) {
          this.FlowAuditUser.forEach(value => {
            if (value.flowNodeItemKeys && value.flowNodeItemKeys.indexOf(key) != -1) {
              var ids = value.flowNodeItemKeys.split('|');
              this.combineList.forEach(item => {
                ids.forEach(id => {
                  // 如果处理人中的id等于关联人员控件里面的id，且不是必填项
                  if (item._id == id && !item.validations.includes('presence')) {
                    item.help = '';
                  }
                })
              })
            }
          })
        }
			},
			addPerson () {
				//将当前的人员给到选人控件
				var _this = this;
				dataBase.selectConfig.show = true;
				dataBase.selectConfig.signIndex = 'users';
				dataBase.selectConfig.selectList.users.callBack.confirm = function (id, data) {
				 	const user = data.user && data.user &&data.user.data?  data.user.data[0] : null;
          _this.$emit('selectUser', user);
					_this.users = data.user.data;
					var arry = [];
					for (var i = 0; i < _this.users.length; i++) {
	          if(_this.users[i].personName.indexOf('_') != -1) {
              _this.users[ i ].personName = _this.users[ i ].personName.replace(/_/g,'&#95;')
	          }
						arry.push (_this.users[ i ].userId + '_' + _this.users[ i ].personName);
					}
					_this.field.value = arry;
					_this.setValue ();
					//更新人员控件的下一步处理人
          _this.FlowAuditUser.forEach((value, index) => {
            if(value.flowNodeItemKeys && value.flowNodeItemKeys.indexOf(_this.field._id) > -1) {
              var ItemKeys = [];
              ItemKeys = value.flowNodeItemKeys.split('|');
              if (value.flowNodeItemKeys) {
                let users = [];
                let userItem = [];
                for (let i = 0; i < ItemKeys.length; i++) {
                  var person = _this.$store.state.formBase.data[ItemKeys[i]] || [];
                  userItem.push(...person);
                  if (userItem) {
                    userItem.forEach(item => {
                      let arry = item.split('_');
                      arry.pop();
                      users.push(arry.join('_'));
                    });
                  }
                }
                let ids = users.unique().join(',');
                getMember(ids, (res) => {
                  _this.$store.commit('updateItemKeysSelected', {index: index, data: res});
                });
              }
            }
          })
				}
				dataBase.selectConfig.selectList.users.userSelected = this.users;
				//回调选中的人员
			},
			showPersonDetail:function (item){
				if(item.userId){
					EventBus.$emit("atThisPersonUtil",item);
				}
			},
		}
	}
</script>
