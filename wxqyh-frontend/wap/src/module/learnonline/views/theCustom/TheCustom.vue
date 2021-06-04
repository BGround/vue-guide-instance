<template>
	<div class="qwui-custom" v-bind:style ="{ height:winHeight }">
		<keep-alive>
			<move-menu
			v-if = 'isHas' 
			:getMenuData='getMenuData'></move-menu>	
		</keep-alive>
		
	</div>
</template>
<script>
import { getMenu } from '../../api/getData';
import moveMenu from '../../components/MoveMenu';
export default {
	name: 'QwTheCustom',
	components:{
		moveMenu,	
	},
	data(){
		return{
			// 屏幕高度
			  winHeight: window.innerHeight + 'px', // 外框架用了nav  自带了高度div 高度为47
			  getMenuData:{}, //获取已开启菜单接口数据
		}
	},
	created  (){
		this._getMenu();
		_.hideLoading();
	},
	activated() { // 适应移动微信下方的进退栏
		this.winHeight = window.innerHeight+ 'px'; // 外框架用了nav  自带了高度div 高度为47
	  },
	computed:{
		isHas(){
			return this.getMenuData.menu?true:false;
		}
	},
	methods:{
		_getMenu() {
      		//加return返回promise对象
			return new Promise((resolve, reject) => {
				getMenu({}, data => {
					//模拟
				this.getMenuData = data;
				resolve();
				});
			});
		}
	}
}
</script>

<style lang="scss" scoped>
html,body{
	width: 100%;
	height: 100%;
}
.qwui-custom{
	position: relative;
	width: 100%;
	height: 100%;
	background:rgba(247,248,250,1);
}
</style>