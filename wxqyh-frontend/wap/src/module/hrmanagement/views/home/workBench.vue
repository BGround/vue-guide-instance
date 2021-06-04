<template>
	<div class="work-bench pb28">
		<!--员工近况-->
		<recent-developments></recent-developments>
		<!-- 个税抵扣 -->
		<tax v-if="showTax"></tax>

		<div class="qwui-work_gutter" v-if="showTax"></div>
		<!-- 功能指引 -->
		<function-guide></function-guide>
		
		<!--工资条-->
		<wage class="mt5 pad15"></wage>

		<div class="qwui-work_gutter"></div>
		
		<!--员工关怀-->
		<employees-care></employees-care>

		<div class="qwui-work_gutter"></div>
		<!--人事待办-->
		<unfinished class="pad15"></unfinished>

		<!--花名册 仅有权限的部门负责人可见-->
		<employess-roster></employess-roster>
	</div>
</template>
<script>
import employeesCare from './employeesCare';
import wage from './wage';
import tax from './tax';
import unfinished from './unfinished';
import employessRoster from './employessRoster';
import recentDevelopments from './recentDevelopments';
import functionGuide from './functionGuide'
import { getMenuListSetting } from '../../api/getData';
export default {
	name:'workBench',
	components:{
		employeesCare,
		wage,
		unfinished,
		employessRoster,
		recentDevelopments,
		tax,
		functionGuide
	},
	data(){
		return{
			isSess:true,
			showTax: true
		}
	},
	mounted(){
		this.getTaxStatus()
	},
	methods: {
		getTaxStatus(){
			getMenuListSetting({},data => {
				if(data.menuList){
					for (let i = 0; i < data.menuList.length; i++) {
						if(data.menuList[i].menuName && data.menuList[i].menuName == 'salaryTax' && data.menuList[i].isOpen == '0'){
							this.showTax = false
						}else{
							this.showTax = true
						}
					}
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
	.mt5{
		margin-top: 5px;
	}
</style>


