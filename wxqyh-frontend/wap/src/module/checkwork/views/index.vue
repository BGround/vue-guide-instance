<template lang="html">
	<div class="wrap qwui-page">
		<!--页面内容-->
		<div class="content">
      <router-view></router-view>
		</div>
		<!-- 底部导航 -->
    <nav-footer class="fillBackground">
      <div class="qwui-dialog_show" @click="dialogShow(index)" v-for="(navItem, index) in bottomMenu">
        <tab-one
          v-bind="navItem"
          :activeIndex="activeIndex"
          :key="navItem.icon"
          :defaultColor="'icon-skyBlue'"
        >
        </tab-one>
      </div>
    </nav-footer>
    <!--底部弹框-->
		<dialog-mask :dialogConfig="homeContentList.dialogListConfig"></dialog-mask>
	</div>

</template>
<script>
import navFooter from '@/components/part/nav_footer'; //底部菜单栏组件
import tabOne from '@/components/part/tab_one';
import dialogMask from '@/components/base/dialog_mask_bottom';
import {checkDepartManager,isHasPermission} from "../api/getData";

export default {
	name:'index',
	components: {
      tabOne,
      navFooter,
      dialogMask
    },
	data(){
		return{
			bottomMenu:dataBase.bottomMenu,
			winHeight: (window.innerHeight - 47) +'px', // 外框架用了nav  自带了高度div 高度为47
			activeIndex:0, //当前所在tab
      homeContentList:{
        dialogListConfig: { // 点状弹窗列表操作
          show: false, //控制弹窗显示与否
          title: "", //头部标题，设置为空的话不显示
          index:'',
          btnConfig:[ //自定义弹框操作,可以设置回调函数
            {title:"i18n.relateCheckWork", callBack: this.showCheckworkList},
            {title:"i18n.repRelation", callBack: this.showRelationRep},
            {title:"i18n.repApprove", callBack: this.showApproveRep},
            {title:"i18n.cancel", callBack: null}
          ]
        }
      },
		}
	},
	created () {
		this._getInit();
	},
	methods:{
		_getInit(){
      this.checkPermission();
		  this.changeIcon(this.getParam("index"));
		},
    //获取地址栏参数 获取问号后的参数的值?client=123
    getParam(name) {
      return location.href.match(new RegExp('[?#&]' + name + '=([^?#&]+)', 'i')) ? RegExp.$1 : '';
    },
    //变换图标
    changeIcon(index){
      if(!index){
        index = 0
      }
      this.activeIndex = index;
      this.bottomMenu.forEach((item, i) => {
        item.icon = item.icon.replace(/on$/, 'off');
      });
      let iconActiveClass = this.bottomMenu[index].icon.replace(/off$/, 'on');
      this.bottomMenu[index].icon = iconActiveClass;
    },
    dialogShow(index){
      var self = this;
      if(index == this.activeIndex && index != 3){
        return
      }
      this.changeIcon(index);
      switch(index) {
        case 0:
          window.location.href = _.baseURL+ "/jsp/wap/checkwork/add.jsp?corp_id=" + (_.getUrlParam("corp_id")?_.getUrlParam("corp_id"):'') + "&agentCode=checkwork&abc=1";
          break;
        case 1:
          self.getIsManager();
          break;
        case 2:
          self.$router.push({path:"/myRep", query:{index:2}});
          break;
        case 3:
          self.homeContentList.dialogListConfig.show = true;
          break;
      }
    },
    checkPermission(){
      let self = this;
      isHasPermission({},function (result) {
        if(result.hidePermisStatus){
          self.$router.push({path:"/noPermission"});
        }
      });
    },
    //判断是否是部门负责人，不是的话初始页面为考勤日历页面
    getIsManager() {
      var self = this;
      checkDepartManager({},function (result) {
        dataBase.statistics.isManager = result.isManager;
        if(!result.isManager){//不是部门负责人，跳到日历页
          self.$router.push({path:"/checkCalendar", query:{index:1}});
        }else{//是部门负责人，跳到"统计"
          self.$router.push({path:"/statistics", query:{index:1}});
        }
      });
    },
    //相关考勤
    showCheckworkList(){
      this.dialogBtnCallBack(0,"/relateCheckWork")
    },
    //相关申诉
    showRelationRep(){
      this.dialogBtnCallBack(1,"/repRelation")
    },
    //审批申诉
    showApproveRep(){
      this.dialogBtnCallBack(2,"/repApprove")
    },
    //点击进入相关列表页
    dialogBtnCallBack(index,path){
      let config = this.homeContentList.dialogListConfig;
      config.index = index;
      config.show = false;
      this.$router.push({path:path, query:{index:3}});
    },
	},

}
</script>
<style lang="scss" scoped>
.qwui-page{
	.content{
		position: relative;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		overflow-x: hidden;
	}
  /deep/ .qwui-dialog_bottom_footer{
    font-size: 18px;
  }
}
.fillBackground /deep/ .qwui-nav_footer_height {
  height: 47px; //ios按公共组件上的48px会露底
  background-color: #FFF;
}
.fillBackground {
	/deep/ .qwui-tab_text{
	  line-height: 1;
	}
  /deep/ .qwui-nav_footer_fix{
    padding-bottom: 3px;
  }
}
.qwui-dialog_show{
  flex:1
}
</style>


