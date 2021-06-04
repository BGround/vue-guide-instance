<template>
	<div id="app"  class="adapt_iphonex">
		<router-view></router-view>

		 <!--页面必须引入-加载过渡效果以及弹窗 start-->
		<loading v-if="dataBase.config"
				:show="dataBase.loading.show"
				:icon="dataBase.loading.icon"
				:text="dataBase.loading.text">
		</loading>
		<dialog_mask v-if="dataBase.config"></dialog_mask>
		<!--页面必须引入-加载过渡效果以及弹窗 end-->
	</div>
</template>
<script>
import dialog_mask from '@/components/base/dialog_mask';//弹窗组件
import loading from '@/components/base/loading';//加载中、操作成功提示组件（删除成功、提交成功）
export default {
	name: 'app',
	components:{
		dialog_mask,
		loading,
	},
    data() {
      return {
		  dataBase:dataBase,
      }
    },
}
</script>
<style lang='scss'>
  @import '../../assets/fonts/iconfont.css';
  @import './static/css/hrmanagement.scss';
  @import '../../assets/css/style.css';
	#app{

		/deep/ .z-index_top{
			z-index: 10000 !important;
		}
	}
</style>


