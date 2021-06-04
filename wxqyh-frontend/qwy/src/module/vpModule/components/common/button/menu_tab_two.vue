<template>
	<div class="qwui-menu_tab_two" >
		<!--menu垫高-->
		<div class="qwui-menu_tab_two_height" v-if="fixed" :style="{height:height+'px'}"></div>

		<tab custom-bar-width="68px" :class="{'qwui-menu_tab_two_fixed':fixed}" :style="{top:top+'px'}">
			<tab-item v-for="(item, index) in selectdata.nav" :selected="selectdata.index == index" @on-item-click="onItemClick(item,index)" :key="index">
				{{$t(item.content)}}{{item.num?item.num:''}}
			</tab-item>
		</tab>
	</div>

</template>
<!--默认 变量selectdata.index==0 -->
<script>
import { Tab, TabItem} from 'vux/src/components/tab';

export default {
  props:{
	  'selectdata':{
		  type:Object,
		  required:true
	  },
	  'top': {
		  type:Number,
		  default:0
	  },
	  'height': {
		  type: Number,
		  default:44
	  },
	  'fixed':{
		  type: Boolean,
		  default:false
	  }
  },
  components:{
    Tab, TabItem
  },
  data(){
    return {
    }
  },
  methods: {
    onItemClick (item,index) {
      if(this.selectdata.index!=index){
        this.selectdata.index=index;
        this.$emit("listenTabChange", item,index);
      }
    },
  }
}
</script>
<style>
  .vux-tab-item{
    cursor: pointer;
  }
  .qwui-menu_tab_two .vux-tab.qwui-menu_tab_two_fixed{
    height: 43px;
  }
  .qwui-menu_tab_two .qwui-menu_tab_two_fixed {
	  /*position: fixed;*/
	  z-index: 9;
	  width: 100%;
  }
  .vux-tab-ink-bar .vux-tab-bar-inner {
    background-color: #C31725 ;
  }
  .qwui-menu_tab_two .vux-tab .vux-tab-item.vux-tab-selected{
    color: #333;
    line-height: 43px;
  }
  .qwui-menu_tab_two .vux-tab .vux-tab-item{
    color: #aaa;
    line-height: 43px;
    background: transparent;
  }
</style>
