<template lang="html">
	<div class="wrap qwui-page">
		<!--页面内容-->
		<div class="content">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</div>

		<!-- 底部导航 -->
		<nav-footer class="fillBackground">
			<tab-one
				v-for="(navItem, index) in bottomMenu"
				v-bind="navItem"
				:activeIndex="activeIndex"
				:key="navItem.icon"
				:defaultColor="'icon-skyBlue'"
				@tabOneClick="tabOneClickMy(index)"
			>
		</tab-one>
		</nav-footer>
	</div>

</template>
<script>
import navFooter from '@/components/part/nav_footer'; //底部菜单栏组件
import tabOne from '@/components/part/tab_one';
export default {
	name:'index',
	components: {
      tabOne,
      navFooter
    },
	data(){
		return{
			bottomMenu:dataBase.bottomMenu,
			winHeight: (window.innerHeight - 47) +'px', // 外框架用了nav  自带了高度div 高度为47
			activeIndex:0, //当前所在tab
		}

	},
	created () {
		this._getInit();
	},
	methods:{
		tabOneClickMy(index,created){
			if(index == this.activeIndex){
				return
			}

			// 变换active图标
			this.activeIndex = index;
			this.bottomMenu.forEach((item, i) => {
			item.icon = item.icon.replace(/on$/, 'off');
			});
			let iconActiveClass = this.bottomMenu[index].icon.replace(/off$/, 'on');
			this.bottomMenu[index].icon = iconActiveClass;
			//跳转路由
			created || this.$router.replace({name:this.bottomMenu[index].routerName}) // 初始化需要跳转路由
		},
		_getInit(){
			for(let i=0;i<this.bottomMenu.length;i++){
				if(this.bottomMenu[i].routerName == this.$route.name){
					this.tabOneClickMy(i,true);
					return
				}
			}

		}
	},
}
</script>
<style lang="scss" scoped>
.qwui-page{
	// position: absolute;
	// width: 100%;
	// height: 100%;
	background: #fff;
	.content{
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		overflow-x: hidden;
	}



}
.fillBackground /deep/ .qwui-nav_footer_height {
    height: 47px; //ios按公共组件上的48px会露底
  }
.fillBackground {
	/deep/ .qwui-iconfont{
		width:22px;
		height: 22px;
	}
	/deep/ .qwui-footer_tab_item{
		.qwui-footer_tab_box{
			margin-bottom: 3px;
		}
	}
}
</style>


