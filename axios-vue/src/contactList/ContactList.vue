<template>
	<div class="contactlist">
		<!-- 联系人列表 -->
		<van-contact-list
			:list="list"
			@add="onAdd"
			@edit="onEdit"
			@select="onSelect"
		/>
		
		<!--联系人编辑 -->
		<van-popup v-model="showEdit" position="bottom">
			<van-contact-edit
				:contact-info="editingContact"
				:is-edit="isEdit"
				@save="onSave"
				@delete="onDelete"
			/>
		</van-popup>
	</div>
</template>

<script>
import { ContactList, ContactEdit, Toast, Popup} from 'vant';
import axios from 'axios'

export default{
	name:'contactlist',
	components:{
		[ContactList.name]: ContactList,
		[ContactEdit.name]: ContactEdit,
		[Popup.name]: Popup
	},
	data(){
		return {
			// {
			// 	id:'',
			// 	name:'',
			// 	tel:''
			// }
			list: [],
			chosenContactId: null,
			instance: null ,//axios实例
			showEdit:false, //新增编辑弹窗显隐
			editingContact:{}, //正在编辑的联系人的信息
			isEdit: false, //新建或者编辑
		}
	},
	created() {
		this.instance = axios.create({
			baseURL: 'http://localhost:9000/api'
		})
		// this.instance.get('/contactList')
		// .then(res=>{
		// 	this.list = res.data.data
		// }).catch(()=>{
		// 	Toast('请求失败，请稍后再试')
		// })
		this.getList()
	},
	
	methods:{
		// 获取联系人列表
		async getList() {
			let res = await this.$Http.getContactList()
			this.list = res.data
		},
		// onSelect() {
		// 	this.showList = false;
		// },
		// 添加联系人
		onAdd(){
			this.showEdit = true
			this.isEdit = false
			console.log(this.showEdit)
		},
		//编辑联系人
		onEdit(info){
			this.showEdit = true;
			this.isEdit = true
			this.editingContact = info
		},
		//保存联系人
		onSave(info){
			this.showEdit = false;
			if (this.isEdit) {
				this.instance.put('/contact/edit',info).then(res=>{
					if(res.code === 200) {
						Toast('编辑成功')
						this.showEdit = false
					}
				}).catch(() => {
					Toast('编辑失败')
				})
				this.getList()
			} else {
				this.instance.post('/contact/new/json',info).then(res=>{
					if(res.code === 200){
						Toast('新建成功')
						this.showEdit = false
					}
				}).catch(()=>{
					Toast('保存失败')
				})
				this.getList()
			}
		},
		//删除联系人
		onDelete(info){
			this.showEdit = false;
			this.instance.delete('/contact',{
				params:{
					id: info.id
				}
			}).then(res => {
				if(res.code === 200){
					Toast('删除成功')
					this.showEdit = false
				}
			}).catch(() => {
				Toast('删除失败')
			})
			this.getList()
		}
	}
}
</script>

<style scoped>
	.van-contact-list__add{
		z-index: 0;
	}
	.van-popup{
		height: 100%;
	}
</style>
