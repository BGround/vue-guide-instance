<template>
  <div class="wrap">
    <Nav_tabs v-show="showTab"
      :defaultActiveKey="tab.activeKey"
      :activeIndex="tab.indexActive"
      position="top"
      v-on:listenNavTabs="goToStatistics"
      :tabs="Tabs"
    >
    </Nav_tabs>
    <calendar_date
      :class="[showTab ? 'header_margin_top': '']"
      :ismanager="showTab"
      :getDeptData="getDeptData"
    ></calendar_date>
    <!-- 底部导航 -->
    <nav-footer class="fillBackground">
      <div class="qwui-dialog_show" @click="dialogShow(index)" v-for="(navItem,index) in bottomMenu">
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
import calendar_date from "../components/calendar_date";
import Nav_tabs from "@/components/base/nav_tabs";
import navFooter from '@/components/part/nav_footer'; //底部菜单栏组件
import tabOne from '@/components/part/tab_one';
import dialogMask from '@/components/base/dialog_mask_bottom';
import {checkDepartManager,getDeptAndRule,isHasPermission} from "../api/getData";

export default {
  components: {
    calendar_date,
    Nav_tabs,
    navFooter,
    tabOne,
    dialogMask
  },
  data() {
    return {
      bottomMenu:dataBase.bottomMenu,
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
      showTab: "",
      showRankEnter: false,
      tab: {
        indexActive: 1, //默认tab
        activeKey: "myStatics" //记录我的 当前的tab
      },
      Tabs: [{ text: "部门" }, { text: "我的" }],
      getDeptData:{}
    };
  },
  created() {
    //解决切换部门和我的闪一下（负责人）
    //解决切换统计和其他tab闪一下（非负责人）
    if(dataBase.statistics.isManager){
      this.showTab = true;
    }else{
      this.showTab = false;
    }
    this.checkPermission();
    this.getDeptAndRuleData();
    this.getIsManager();
    this._getInit();
  },
  methods: {
    checkPermission(){
      let self = this;
      isHasPermission({},function (result) {
        if(result.hidePermisStatus){
          self.$router.push({path:"/noPermission"});
        }
      });
    },
    _getInit(){
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
        case 2:
          self.$router.push({path:"/myRep", query:{index:2}});
          break;
        case 3:
          self.homeContentList.dialogListConfig.show = true;
          break;
      }
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
    //排行榜初始部门和规则
    getDeptAndRuleData:function(){ //详情加载
      let now = new Date();
      let year = now.getFullYear();
      let cmonth = now.getMonth() + 1;
      let day = now.getDate();
      if (cmonth < 10) cmonth = '0' + cmonth;
      if (day < 10) day = '0' + day;
      let checkDate = year + '-' + cmonth + '-' + day;
      let self = this;
      getDeptAndRule({checkDate: checkDate},function (result) {
        /*传默认部门到排行榜*/
        if(result.departList && result.departList.length>0){
          self.getDeptData.departId = result.departList[0].id;
          self.getDeptData.departName = result.departList[0].departmentName;
        }
        /*传默认规则到排行榜*/
        if(result.signRuleList && result.signRuleList.length>0){
          self.getDeptData.ruleId = result.signRuleList[0].id;
          self.getDeptData.ruleName = result.signRuleList[0].checkName;
        }
      });
    },
    goToStatistics(i) {
      var _this = this;
      if (i == "0") {
        _this.$router.push({
          path: "/statistics",
          query:{
            index:1
          }
        });
      }
    },
    getIsManager() {
      let self = this;
      checkDepartManager({},function (result) {
        let isManager = result.isManager;
        dataBase.statistics.isManager = isManager;
        self.showTab = isManager;
      });
    }
  },
};
</script>

<style scoped>
.wrap{
  background-color: #F7F7F7;
}
.wrap /deep/ .qwui-dialog_bottom_footer{
  font-size: 18px;
}
.header_margin_top {
  margin-top: 65px;
}
/*ios按公共组件上的48px会露底*/
.fillBackground /deep/ .qwui-nav_footer_height {
  height: 47px;
  background-color: #FFF;
}
.fillBackground /deep/ .qwui-tab_text{
  line-height: 1;
}
.fillBackground /deep/ .qwui-nav_footer_fix{
  padding-bottom: 3px;
}
.qwui-dialog_show{
  flex:1
}
</style>


