<template>
  <div class="wrap">
    <rule_list_detail :ruleData="ruleList" v-show="showRuleList" @showMainPage="comfirmRule"></rule_list_detail>
    <div class="wrap" v-show="isShowMain">
      <!--头部Tab-->
      <Nav_tabs :defaultActiveKey="tab.activeKey"
        :activeIndex="tab.indexActive"
        v-on:listenNavTabs="goToCalendar"
        position="top"
        :tabs="Tabs"
      >
      </Nav_tabs>
      <!--选择时间-->
      <div class="qwui-time_detaildata">
        <div>
          <span
            class="qwui-arrow_left_icon"
            @click="preDayS"
          >
          </span>
          <div class="qwui-time_item" @click="timeSwitchShowS()">
            {{defaultDateS}}
          </div>
          <!--时间选择组件-->
          <time-picker
            :show="switchShowS"
            :defaultDate="checkDate"
            @confirm="confirmS"
            @cancel="cancel"
            :dateOnly=true
            :minYear="minYear"
            :maxYear="maxYear"
          >
          </time-picker>
          <span
            class="qwui-arrow_right_icon"
            @click="nextDayS"
          >
          </span>
        </div>
      </div>
      <div class="dateTab_btn_list line-bottom">
        <span class="qwui-changeCkPart" :class="isClickDept ?'click_color':'noclick_color'" @click="chooseDept">
          <span class="qwui-spanEllips">{{departName}}</span>
          <i class="arrow_pos" :class="isClickDept ?'ic_arrow_normal':'ic_arrow_innormal'"></i>
        </span>
        <span :class="isClickDept ?'noclick_color':'click_color'" @click="chooseRule">
          <span class="qwui-spanEllips">{{ruleName}}</span>
          <i class="arrow_pos" :class="isClickDept ?'ic_arrow_innormal':'ic_arrow_normal'"></i>
        </span>
        <span class="searchForPerson line-left" @click="goToStatisticSearch">
          <em class="ic_search_icon"></em>
        </span>
      </div>
      <total_statistic :totalStatistic="totalNum" v-on:chooseTypeForList="chooseTypeForList"></total_statistic>
      <rank_top :rankTop="rankTop" :getDeptData="getDeptData"></rank_top>
    </div>
    <!--不同状态人员列表 -->
    <statistic_member_list
      v-if="isShowMenberList"
      :listConfig="listConfig"
      @closeMemberList="closeMemberList"
      @updateTotal="updateTotal"
    >
    </statistic_member_list>
     <!--选择部门  -->
    <user_select
      :closeAllTab="true"
      :closeGroup="true"
      :closeUser="true"
      :hasChildRecall="true"
      :hasFirstRecall="true"
      :tabActive="'dept'"
      :selectconfig="selectConfig"
      :deptListUrl="departmentUrl"
      @childRecall="chooseParentDept"
      @firstRecall="initParentDeptId"
      v-if="selectConfig.show">
    </user_select>
    <!-- 底部导航 -->
    <nav-footer class="fillBackground" v-show="!isShowMenberList">
      <div class="qwui-dialog_show" @click="dialogShow(index)" v-for="(navItem, index) in bottomMenu" :key="index">
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
import total_statistic from "../components/total_statistic";
import rank_top from "../components/rank_top";
import statistic_member_list from "../components/statistic_member_list";
import Nav_tabs from "@/components/base/nav_tabs";
import timePicker from "@/components/basicUI/qwuiPicker/time_picker.vue";
import * as timeUtil from "@/assets/js/time-util";
import user_select from "@/components/base/user_or_dept_select";
import ranking from "../js/ranking";
import rule_list_detail from "../components/rule_list_detail";
import navFooter from '@/components/part/nav_footer'; //底部菜单栏组件
import tabOne from '@/components/part/tab_one';
import dialogMask from '@/components/base/dialog_mask_bottom';
import {checkDepartManager,isHasPermission} from "../api/getData";

export default {
  components: {
    total_statistic,
    rank_top,
    Nav_tabs,
    statistic_member_list,
    timePicker,
    user_select,
    rule_list_detail,
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
      parentDeptIndex: 0,
      selectConfig: ranking.rankingData.selectConfig,
      commitDraft: ranking.rankingData.commitDraft,
      defaultDateS: timeUtil.changeFormat(new Date(), "yyyy年MM月dd日"),
      switchShowS: false,
      minYear: new Date().getFullYear() - 1, //最小年份
      maxYear: new Date().getFullYear(), //最大年份
      /**时间，规则id与部门id三个主要参数决定整体数据 */
      checkDate: "", //当前时间
      ruleId: "", //当前考勤规则 id
      ruleName: "考勤规则", //当前规则名称
      ruleList: {
        ruleList: [],
        nowRule: {
          id: "",
          item: ""
        }
      }, //规则列表数据
      departId: "", //当前部门id
      departName: "考勤部门", //当前部门名称
      parentDepartId: "", //当前父部门id，没有则为部门自身
      getDeptData: {},
      checkUserType: "", //选择列表规则类型
      totalNum: {
        //整体数据
        checkNum: 0, //打卡人数
        needCheck: 0, //应到人数
        absNum: 0, //旷工人数
        lateNum: 0, //迟到人数
        askNum: 0, //请假人数
        busNum: 0, //出差人数
        outNum: 0, //外勤人数
        leaveNum: 0 //早退人数
      },
      rankTop: {
        //排行榜榜首
        earlyTop: {
          name: "-",
          headPicUrl: "",
          isOpen: false //是否开启
        },
        diligenceTop: {
          name: "-",
          headPicUrl: "",
          isOpen: false //是否开启
        },
        laterTop: {
          name: "-",
          headPicUrl: "",
          isOpen: false //是否开启
        }
      },
      chooseType: "", //选择人员列表类型
      isShowMenberList: false,
      isShowMain: true,
      tab: {
        indexActive: 0, //默认tab
        activeKey: "myStatics" //记录我的 当前的tab
      },
      Tabs: [{ text: "部门" }, { text: "我的" }],
      //我提交的
      myStatics: {
        index: 0,
        firstLoading: true, //第一次加载
        lock_roll: false,
        List: [], //列表
        keyWord: "",
        currPage: "",
        maxPage: "",
        totalRows: ""
      },
      isClickDept: true, //是否点击选择部门
      showRuleList: false, //是否显示规则列表
      departmentUrl: dataBase.statistics.getDepartmentUrl //获取部门负责人所管理部门
    };
  },
  computed: {
    myIndexActive() {
      if (this.$route.name != "home") {
        return this[this.$route.name].index;
      }
    },
    listConfig() {
      var listConfigItem = {
        ruleId: String,
        checkDate: String,
        departId: String,
        parentDepartId: String,
        checkUserType: String
      };
      listConfigItem.ruleId = this.ruleId;
      listConfigItem.checkDate = this.checkDate;
      listConfigItem.departId = this.departId;
      listConfigItem.checkUserType = this.checkUserType;
      return listConfigItem;
    }
  },
  created() {
    this.checkPermission();
    this.getIsManager();
    this.getTotalData();
    this.getRankTopPermission();
    this._getInit();
    this.getDeptData.defaultDateS = this.defaultDateS;
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
    getIsManager() {
      checkDepartManager({},function (result) {
        let isManager = result.isManager;
        dataBase.statistics.isManager = isManager;
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
    //点击，控制时间组件显示
    timeSwitchShowS(){
      this.switchShowS = !this.switchShowS
    },
    initParentDeptId() {
      this.parentDeptIndex = 0;
    },
    chooseParentDept(obj) {
      if (this.parentDeptIndex == 0) {
        this.parentDepartId = obj.deptId;
      }
      this.parentDeptIndex++;
    },
    comfirmRule(chooseItem) {
      this.showRuleList = false;
      this.isShowMain = true;
      this.ruleId = chooseItem.id;
      this.ruleName = chooseItem.checkName;
      this.getTotalData();
      //传默认规则到排行榜
      this.getDeptData.ruleId = this.ruleId;
      this.getDeptData.ruleName = this.ruleName;
    },
    chooseDept() {
      /**选择部门点击事件 */
      var _this = this;
      this.selectConfig.selectList["ccPersonList"].deptSelected.splice(0);
      this.selectConfig.selectList["ccPersonList"].deptSelected.push({
        departmentName: _this.departName,
        id: _this.departId,
        parentDepartId: _this.parentDepartId
      });
      this.parentDeptIndex = 0;
      this.isClickDept = true;
      this.selectConfig.selectList[
        "ccPersonList"
      ].callBack.confirm = this.confirmSelectDept;
      this.selectDeptList("ccPersonList");
    },
    chooseRule() {
      /**选择规则点击事件 */
      var _this = this;
      if (_this.ruleList.ruleList.length <= 0) {
        _this.updateRule();
      }
      this.isClickDept = false;
      this.showRuleList = true;
      this.isShowMain = false;
    },
    updateRule(){
      /**请求接口更新规则 */
      var _this = this;
      _.ajax({
          url: _.baseURL + dataBase.statistics.getRuleList,
          type: "post",
          data: {
            departId: _this.departId,
            checkDate: _this.checkDate,
            parentDepartId: _this.parentDepartId
          },
          success: function(result) {
            if (result.code == "0") {
              var newRuleList = result.data.checkWorkRuleVOS;
              var nowRuleInList = false;
              _this.ruleList.ruleList = newRuleList;
              for(var i=0;i<newRuleList.length;i++){
                if(_this.ruleId == newRuleList[i].id){
                  nowRuleInList = true;
                }
              }
              if(!nowRuleInList){
                _this.ruleId = newRuleList[0].id;
                _this.ruleName = newRuleList[0].checkName;
              }
               _this.ruleList.nowRule.id = _this.ruleId;
            }
          }
        });
    },
    selectDeptList(type) {
      this.selectConfig.show = true;
      this.selectConfig.signIndex = type;
    },
    getRankTopPermission() {
      _.ajax({
        url: _.baseURL + dataBase.statistics.getRankTopPermissionUrl,
        type: "get",
        data: {},
        success: function(result) {
          if (result.code == "0") {
            var data = result.data;
            /*是否是金卡 */
            dataBase.statistics.isGoldVip = data.isGoldVip;
            /*是否开启勤奋 */
            dataBase.statistics.isOpenDiligenceSetting = data.isOpenDiligenceSetting;
            /*是否开启勤奋之总工时 */
            dataBase.statistics.diligentIsDisplay = data.diligentIsDisplay;
            /*是否开启早到 */
            dataBase.statistics.isOpenEarlySetting = data.isOpenEarlySetting;
            /*是否开启迟到 */
            dataBase.statistics.isOpenLaterSetting = data.isOpenLaterSetting;
          }
        }
      });
    },
    cancel: function() {
      this.switchShowS = false;
    },
    //时间组件确认
    confirmS: function(val, valItem) {
      this.switchShowS = false;
      var data =
        valItem[0] +
        "-" +
        valItem[1] +
        "-" +
        (valItem[2] ? valItem[2].substring(0, 2) : "");
      this.checkDate = data;
      this.defaultDateS =
        valItem[0] +
        "年" +
        valItem[1] +
        "月" +
        (valItem[2] ? valItem[2].substring(0, 2) + "日" : "");
      //统计部门页面选择时间后跳转排行榜，保持一致
      this.getDeptData.checkDate = data;
      this.getDeptData.defaultDateS = this.defaultDateS;
      this.getTotalData();
    },
    //时间前一天后一天
    preDayS() {
      var nowDateS = new Date(
        Date.parse(
          this.defaultDateS.replace(
            /(\d{4}).(\d{1,2}).(\d{1,2}).+/gm,
            "$1/$2/$3"
          )
        )
      ).getTime();
      nowDateS = nowDateS - 24 * 60 * 60 * 1000;
      this.defaultDateS = timeUtil.changeFormat(
        new Date(nowDateS),
        "yyyy年MM月dd日"
      );
      this.checkDate = timeUtil.changeFormat(new Date(nowDateS), "yyyy-MM-dd");
      this.getTotalData();
    },
    nextDayS() {
      var date = new Date();
      var nowDateS = new Date(
        Date.parse(
          this.defaultDateS.replace(
            /(\d{4}).(\d{1,2}).(\d{1,2}).+/gm,
            "$1/$2/$3"
          )
        )
      ).getTime();
      nowDateS = nowDateS + 24 * 60 * 60 * 1000;
      var compareDate = nowDateS - 24 * 60 * 60 * 1000;
      if (compareDate > date) {
        return;
      }
      this.defaultDateS = timeUtil.changeFormat(
        new Date(nowDateS),
        "yyyy年MM月dd日"
      );
      this.checkDate = timeUtil.changeFormat(new Date(nowDateS), "yyyy-MM-dd");
      this.getTotalData();
    },
    getTotalData() {
      var _this = this;
      _.showLoading();
      _.ajax({
        url: _.baseURL + dataBase.statistics.totalDataUrl,
        type: "post",
        data: {
          ruleId: _this.ruleId,
          checkDate: _this.checkDate,
          departId: _this.departId,
          parentDepartId: _this.parentDepartId
        },
        success: function(result) {
          _.hideLoading();
          if (result.code == "0") {
            if (
              !_this.getTotalSession(
                _this.departId,
                _this.checkDate,
                _this.ruleId
              )
            ) {
              _this.pushTotalSession(
                _this.departId,
                _this.checkDate,
                _this.ruleId,
                result
              );
            }
            _this.handleTotalData(result);
          } else {
            _.alert(result.desc);
          }
        }
      });
    },
    pushTotalSession(deptId, date, ruleId, totalData) {
      /*根据部门，日期，规则缓存整体数据*/
      var todayDate = new Date();
      if (date == todayDate) {
        /*当天不缓存*/
        return;
      }
      var cacheTotalNum = JSON.parse(
        sessionStorage.getItem("cacheTotalNumData")
      );
      if (!cacheTotalNum) {
        cacheTotalNum = {};
      }
      if (!cacheTotalNum[deptId]) {
        cacheTotalNum[deptId] = {};
      }
      if (!cacheTotalNum[deptId][date]) {
        cacheTotalNum[deptId][date] = {};
      }
      cacheTotalNum[deptId][date][ruleId] = totalData;
      sessionStorage.setItem(
        "cacheTotalNumData",
        JSON.stringify(cacheTotalNum)
      );
    },
    getTotalSession(deptId, date, ruleId) {
      /*获取整体考勤数据缓存*/
      var cacheTotalNum = JSON.parse(
        sessionStorage.getItem("cacheTotalNumData")
      );
      if (
        cacheTotalNum &&
        cacheTotalNum[deptId] &&
        cacheTotalNum[deptId][date] &&
        cacheTotalNum[deptId][date][ruleId]
      ) {
        var theTotalData = cacheTotalNum[deptId][date][ruleId];
      }
      if (!theTotalData) {
        return false;
      } else {
        return theTotalData;
      }
    },
    handleTotalData(result) {
      var _this = this;
      var data = result.data;
      if (data.departmentInfoVO.id && data.departmentInfoVO.departmentName) {
        _this.departId = data.departmentInfoVO.id;
        _this.departName = data.departmentInfoVO.departmentName;
        /*传默认部门到排行榜*/
        _this.getDeptData.departId = _this.departId;
        _this.getDeptData.departName = _this.departName;
      }
      if (data.rule.id && data.rule.checkName) {
        _this.ruleId = data.rule.id;
        _this.ruleName = data.rule.checkName;
        /*传默认规则到排行榜*/
        _this.getDeptData.ruleId = _this.ruleId;
        _this.getDeptData.ruleName = _this.ruleName;
      }
      if (!_this.checkDate) {
        _this.checkDate = timeUtil.changeFormat(new Date(), "yyyy-MM-dd");
      }
      _this.totalNum.checkNum = data.checkNum;
      _this.totalNum.needCheck = data.needCheck;
      _this.totalNum.absNum = data.absNum;
      _this.totalNum.askNum = data.absNum;
      _this.totalNum.busNum = data.busNum;
      _this.totalNum.lateNum = data.lateNum;
      _this.totalNum.outNum = data.outNum;
      _this.totalNum.leaveNum = data.leaveNum;
      if (!_this.parentDepartId) {
        _this.parentDepartId = _this.departId;
      }
      if (data.tbQyCheckWorkEarlyRankVO) {
        /*早到榜首*/
        _this.rankTop.earlyTop.name = data.tbQyCheckWorkEarlyRankVO.personName;
        _this.rankTop.earlyTop.headPicUrl =
          data.tbQyCheckWorkEarlyRankVO.headPic;
      } else {
        _this.rankTop.earlyTop.name = "";
        _this.rankTop.earlyTop.headPicUrl = "";
      }
      if (data.tbQyCheckWorkDiligenceRankVO) {
        /*勤奋榜首*/
        _this.rankTop.diligenceTop.name =
          data.tbQyCheckWorkDiligenceRankVO.personName;
        _this.rankTop.diligenceTop.headPicUrl =
          data.tbQyCheckWorkDiligenceRankVO.headPic;
      } else {
        _this.rankTop.diligenceTop.name = "";
        _this.rankTop.diligenceTop.headPicUrl = "";
      }
      if (data.tbQyCheckWorkLateRankVO) {
        /*迟到榜首*/
        _this.rankTop.laterTop.name = data.tbQyCheckWorkLateRankVO.personName;
        _this.rankTop.laterTop.headPicUrl =
          data.tbQyCheckWorkLateRankVO.headPic;
      } else {
        _this.rankTop.laterTop.name = "";
        _this.rankTop.laterTop.headPicUrl = "";
      }
    },
    chooseTypeForList(chooseType) {
      this.checkUserType = chooseType;
      this.isShowMenberList = true;
      this.isShowMain = false;
    },
    goToCalendar(i) {
      var _this = this;
      if (i == "1") {
        _this.$router.push({
          path: "/checkCalendar",
          query:{
            index:1
          }
        });
      }
    },
    goToStatisticSearch(){
      this.$router.push({
        path:"/statistics/search",
        query:{
          index:1
        }
      });
    },
    closeMemberList(checkDate) {
      if (checkDate != this.checkDate) {
        this.checkDate = checkDate;
        this.defaultDateS = checkDate.replace(
          /(\d{4}).(\d{1,2}).(\d{1,2})+/gm,
          "$1年$2月$3日"
        );
        this.getTotalData();
      }
      this.isShowMenberList = false;
      this.isShowMain = true;
    },
    updateTotal(checkDate) {
      this.checkDate = checkDate;
      this.getTotalData();
    },
    confirmSelectDept(el, obj) {
      /**确定选择部门时进行判断，若为第一层级则将parentDepartId置空 */
      if (this.parentDeptIndex == 0) {
        this.parentDepartId = "";
      }
      this.deptSelected(
        "ccPersonList",
        this.selectConfig.selectList["ccPersonList"].deptSelected
      );
      this.commitDraft.draftFormData["ccDeptIds"] = obj.dept.idStr.split("|");
      this.departId = this.commitDraft.draftFormData["ccDeptIds"][0];
      if (!this.parentDepartId) {
        this.parentDepartId = this.commitDraft.draftFormData["ccDeptIds"][0];
      }
      /**更新规则 */
      this.updateRule();
      this.getTotalData();
      /*传默认部门到排行榜*/
      this.getDeptData.departId = this.departId;
    },
    /*已选择部门名称*/
    deptSelected(type, dept) {
      var departmentName = "";
      if (dept && dept.length > 0) {
        for (var i = 0; i < dept.length; i++) {
          if (dept[i].departmentName !== "") {
            departmentName = dept[i].departmentName;
          }
        }
      }
      type == "ccPersonList" ? (this.departName = departmentName) : false;
      /*传默认部门到排行榜*/
      this.getDeptData.departName = this.departName;
    }
  }
};
</script>

<style scoped>
.wrap {
  background-color: #f7f7f7;
}
.wrap /deep/ .qwui-dialog_bottom_footer{
  font-size: 18px;
}
.qwui-time_detaildata {
  position: relative;
  height: 30px;
  margin-top: 65px;
  padding: 10px;
  line-height: 30px;
  font-size: 16px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  border-radius: 5px;
  color: #333;
  cursor: pointer;
}
.qwui-time_item {
  margin: 0 auto;
  width: 150px;
  font-size: 14px;
  text-align: center;
  line-height: 30px;
  background: #fff;
}
.qwui-arrow_left_icon {
  position: absolute;
  top: 15px;
  left: 10px;
  width: 20px;
  height: 20px;
  background: url(~assets/images/checkwork/ic_arrow_left.png) no-repeat left
    center;
  background-size: 10px;
  cursor: pointer;
}
.qwui-arrow_right_icon {
  position: absolute;
  top: 15px;
  right: 10px;
  width: 20px;
  height: 20px;
  background: url(~assets/images/checkwork/ic_arrow.png) no-repeat right center;
  background-size: 10px;
  cursor: pointer;
}
.dateTab_btn_list {
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  background: #fff;
}
.dateTab_btn_list > span {
  padding: 10px 0;
  cursor: pointer;
}
/*边框定位*/
.line-bottom,
.line-left{
  position: relative;
}
/*下边框*/
.line-bottom::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
/*左边框*/
.line-left::after {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  bottom: 0;
  border-right: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleX(0.5);
  transform: scaleX(0.5);
}
/*下拉箭头*/
.ic_arrow_normal {
  display: inline-block;
  width: 6px;
  height: 4px;
  background: url(~assets/images/checkwork/ic_arrow_normal.png) no-repeat;
  background-size: 6px 4px;
}
.ic_arrow_innormal {
  display: inline-block;
  width: 6px;
  height: 4px;
  background: url(~assets/images/checkwork/ic_arrow_innormal.png) no-repeat;
  background-size: 6px 4px;
}
.ic_search_icon {
  display: inline-block;
  margin: 0 0 -2px 3px;
  width: 13px;
  height: 13px;
  background: url(~assets/images/checkwork/ic_search.png) no-repeat;
  background-size: 13px;
}
.arrow_pos {
  margin: 0 0 4px 4px;
}
.qwui-changeCkPart {
  margin-left: 40px;
}
.searchForPerson {
  position: relative;
  width: 80px;
  color: #bbb;
  text-align: center;
}
/*行内元素超出省略*/
.qwui-spanEllips {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  max-width: 100px;
}
.click_color {
  color: #467db9;
}
.noclick_color {
  color: #666;
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
