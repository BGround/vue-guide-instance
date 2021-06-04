<template>
	<div class="qwui-menu_tab_two form-menutab">
		<!--menu垫高-->
		<div class="qwui-menu_tab_two_height" v-if="styleData.fixed" :style="{height:styleData.height+'px'}"></div>

		<tab 
      :custom-bar-width="styleData.barWidth" 
      :bar-active-color="styleData.barColor"
      :default-color="styleData.fontColor"
      :animate="styleData.animate"
      :line-width="styleData.lineWidth"
      :active-color="styleData.fontActiveColor"
      :class="{'qwui-menu_tab_two_fixed':styleData.fixed}" 
      :style="{top:styleData.top+'px'}"
    >
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
    'userStyle': {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components:{
    Tab, TabItem
  },
  data(){
    return {
      defaultStyle: {
        "top": 0,
        "height": 52,
        "fixed": false,
        "barWidth": '19%',
        "barColor": '#5585f0',
        "fontColor": '#a1aac0',
        "fontActiveColor": '#0a1735',
        "animate": true,
        "lineWidth": 3
      }
    }
  },
  computed: {
    styleData() {
      return {...this.defaultStyle, ...this.userStyle};
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
<style lang="scss">
  .vux-tab-item{
    cursor: pointer;
  }
  .qwui-menu_tab_two .qwui-menu_tab_two_fixed {
    border-top: 1px solid #f7f8fa;
    border-bottom: 1px solid #f7f8fa;
	  position: fixed;
	  z-index: 8;
	  width: 100%;
  }
  .form-menutab /deep/ .vux-tab .vux-tab-item {
  background: #fff !important;
  border: none !important;
}
</style>
