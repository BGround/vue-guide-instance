<template>
	<div class="unfinished">
		<div class="qwui-lean_entry_list h40">
            <div
              class="lean_entry_list_item qwui-flexbox h40">
                <span class="qwui-flexItem h40">人事待办</span>
            </div>
        </div>
			<div class="qwui-lean_entry_list">
				<div
					v-for="(item, index) in list"
					:key='item.class'
					class="lean_entry_list_item qwui-flexbox"
					@click="goToDetail(item.path,item.days,index)">
					<span class="qwui-flexItem qwui-font_light">
						<i :class="['relavent_icon', list[index].class]"></i>
						<span :class="item.class"></span>{{ item.text }}</span>
						<i :class="['qwui-icon_arrow_fr icon_gray pr25 icon_gray_new',{zero:item.num == '0'}]">{{ item.num }}</i>
					</div>
			</div>
	</div>
</template>
<script>
import { listMyHrTip } from '../../api/getData';
export default {
	name:'unfinished',
	data(){
		return{
			// list:dataBase.entryList,
		}
	},
	created(){
		this._listMyHrTip();  //获取待办事项数量
	},
	computed:{
		list(){
			return dataBase.entryList; //待办事项
		}
	},
	methods:{
		_listMyHrTip(){
			let _this = this;
			listMyHrTip({},data=>{
				let numArr = [],
					days = [];
				numArr[0] = data.tips.regularNum?data.tips.regularNum:0; //待转正
				numArr[2] = data.tips.certNum?data.tips.certNum:0; //证书到期
				numArr[1] = data.tips.contractNum?data.tips.contractNum:0; // 合同到期
				days[0] = data.tips.regularDays?data.tips.regularDays:'0'
				days[2] = data.tips.certDays?data.tips.certDays:'0'
				days[1] = data.tips.contractDays?data.tips.contractDays:'0'
				dataBase.entryList.forEach(function(ele,index){
					ele.num = numArr[index]
					ele.days = days[index]
				});
			})
		},
		//跳转至列表页
		goToDetail(path,days,index){
			this.$router.push({path:path,query:{
				days:days,
				index:index,
			}})
		}
	}
}
</script>
<style lang="scss" scoped>
		.ic_a-positive {
          background-image: url(~assets/images/ic_a-positive.png);
        }
        .ic_a-contract {
          background-image: url(~../../../../assets/images/ic_a-contract.png);
        }
        .ic_a-certificate {
          background-image: url(~assets/images/ic_a-certificate.png);
		}
		.icon_gray_new{
			font-size: 15px ;
			font-family:PingFangSC-Regular;
			font-weight: 500 ;
			color: rgba(122,124,128,1) ;
		}
		.zero{
			color:#D2D5DB !important;
			// &:after{
			// 	display: none;
			// }
		}
		.qwui-lean_entry_list .relavent_icon{
			background-size:100% 100%; 
		}
		.qwui-font_light{
			font-family: PingFangSC-Regular;
			font-weight: 400;
		}
</style>


