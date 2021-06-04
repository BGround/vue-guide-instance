<template>
	<div
		v-if="isShow" 
		class="quwi-employess-roster">
		<div class="qwui-work_gutter"></div>
		<div class="qwui-lean_entry_list h40 pad15">
            <div
              class="lean_entry_list_item qwui-flexbox h40">
                <span class="qwui-flexItem h40">员工花名册</span>
            </div>
        </div>
		<div class="flex pad15">
			<div
				v-for="item in roster"
				:key="item.icon"  
				:class="[item.icon,'flex-item']">
				<span class="Num">{{ item.num }}</span>
				<span class="text">{{ item.text }}</span>
			</div>
		</div>
	</div>
</template>
<script>
import { getMyOrgEmpStatic } from '../../api/getData';
export default {
	name:'employessRoster',
	data(){
		return{
			isShow:false, //是否显示花名册
		}
	},
	computed:{
		roster(){
			return dataBase.roster;
		}
	},
	created(){
		this._getMyOrgEmpStatic(); //获取花名册人数
	},
	methods:{
		_getMyOrgEmpStatic(){
			let _this = this;
			getMyOrgEmpStatic({},data => {
				if(data.hrStatic){
					dataBase.roster[0].num = data.hrStatic.empNum; //在职
					dataBase.roster[1].num = data.hrStatic.joinNum; //入职
					dataBase.roster[2].num = data.hrStatic.leaveNum; //入职
				}
				_this.isShow = data.hrStatic;
			})
		}
	}
}
</script>
<style lang="scss" scoped>
	.flex-item{
		width: 32%;
		height: 80px;
		background:rgba(247,248,250,1);
		border-radius:4px;
		span{
				display:block;
				margin-left: 13px;
		}
		.Num{
			height:29px;
			margin-top: 16px;
			font-size:24px;
			font-family:PingFangSC-Medium;
			font-weight:500;
			color:#7A7C80;
			line-height:29px;
		}
		.text{
			height:20px;
			margin-top: 6px;
			font-size:14px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:#B2B9C8;
			line-height:20px;
		}
	}
	.ic_a-onjob{
		background:url("../../../../assets/images/ic_a-onjob.png") no-repeat 95% 27px,#F7F8FA;
		background-size: 45px 45px;
	}
	.ic_a-departure{
		background:url("../../../../assets/images/ic_a-departure.png") no-repeat 95% 27px,#F7F8FA;
		background-size: 45px 45px;
	}
	.ic_a-departure1{
		background:url("../../../../assets/images/ic_a-departure1.png") no-repeat 95% 27px,#F7F8FA;
		background-size: 45px 45px;
	}
</style>

