<template>
  <div class="wrap_new">
    <div class="qwui-wrap_box" v-show="isShowMain">
      <!--tab选项卡-->
      <menu_tab_two
        :selectdata="selectData"
        @listenTabChange="showMsgFromSelectCard"
      >
      </menu_tab_two>
      <!--选择时间-->
      <div class="qwui-time_detaildata">
        <!-- 早到榜 -->
        <div v-show="isOpenEarlySetting && selectData.index == 0">
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
            :defaultDate="defaultDateS"
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
        <!-- 勤奋榜和迟到榜 -->
        <div v-show="(isOpenEarlySetting && selectData.index !== 0) || !isOpenEarlySetting">
          <span
            class="qwui-arrow_left_icon"
            @click="preDayE"
          >
          </span>
          <div class="qwui-time_item" @click="timeSwitchShowE()">
            {{defaultDateE}}
          </div>
          <!--时间选择组件-->
          <time-picker
            :show="switchShowE"
            :defaultDate="defaultDateE"
            @confirm="confirmE"
            @cancel="cancel"
            :monthOnly=true
            :minYear="minYear"
            :maxYear="maxYear"
          >
          </time-picker>
          <span
            class="qwui-arrow_right_icon"
            @click="nextDayE"
          >
          </span>
        </div>
      </div>

      <!--选择部门和规则-->
      <div class="qwui-select_lists">
        <!--部门选择-->
        <span
          class="qwui-select_list_dept"
          :class="{'selected':tab == 0}"
          @click="selectDeptList('ccPersonList',0)"
        >
          <span
            v-show="departmentName !==''"
          >
            {{departmentName}}
          </span>
          <i :class="[tab == 0 ? 'qwui-icn_selected' : 'qwui-icn_no_selected']"></i>
        </span>

        <!--规则选择-->
        <span
          class="qwui-select_list_rules"
          :class="{'selected':tab !== 0}"
          @click="chooseRule(1)"
        >
          <span>{{checkName}}</span>
          <i :class="[tab == 0 ? 'qwui-icn_no_selected' : 'qwui-icn_selected']"></i>
        </span>
      </div>

      <!--登陆用户排行信息-->
      <div class="my_rank_info">
        <div class="qwui-my_rank_info">
          <div class="qwui-my_rank_logo">
            <img :src="loginTypeRankVo.headPic" alt="">
          </div>
          <div class="qwui-my_rank_text">
            <!-- 未上榜 -->
            <p class="qwui-my_rank_detail" v-if="!isOnList">
              <span class="qwui-my_rank_state">未上榜</span>
            </p>

            <!-- 上榜 -->
            <p class="qwui-my_rank_detail" v-if="isOnList">
              <span class="qwui-my_rank_state">第{{itemIndex}}位</span>
              <!-- 早到榜 -->
              <span
                class="qwui-my_rank_time"
                v-show="loginRankData.loginEarlyRankVo"
              >
              {{loginTypeRankVo.signTime | signTimefilter }}
            </span>

              <!-- 勤奋榜 -->
              <span
                class="qwui-my_rank_time"
                v-show="loginRankData.loginDiligenceRankVo"
              >
              {{loginTypeRankVo.countWorkHour}}小时
            </span>

              <!-- 迟到榜 -->
              <span
                class="qwui-my_rank_time"
                v-show="loginRankData.loginLateRankVo"
              >
              {{loginTypeRankVo.lateNum}}次
            </span>
            </p>

            <p
              class="qwui-my_rank_star"
              v-show="!loginRankData.loginLateRankVo"
            >
            <span
              class="qwui-my_rank_num"
            >
              {{loginTypeRankVo.praiseNum}}
            </span>
              赞
            </p>
          </div>
        </div>
      </div>

      <!--排行标题-->
      <div class="qwui-sort_by_text">
        <p>{{sortText}}</p>
      </div>

      <!--列表-->
      <ranking_list
        :listdata="rankContentList"
        :loadmore="loadMore"
      >
      </ranking_list>
      <!--加载状态-->
      <load_more
        :loadmore="loadMore"
        describeWord="i18n.defaultDes"
        ref="loadMoreFun"
        @showMsgFromLoadMore="showMsgFromLoadMore"
      >
      </load_more>

    </div>

    <!--选择部门  -->
    <user_select
      :closeAllTab="true"
      :closeGroup="true"
      :closeUser="true"
      :tabActive="'dept'"
      :hasChildRecall="true"
      :hasFirstRecall="true"
      :selectconfig="selectConfig"
      :deptListUrl="deptListUrl"
      @childRecall="chooseParentDept"
      @firstRecall="initParentDeptId"
      v-if="selectConfig.show">
    </user_select>

    <!-- 选择规则 -->
    <rule_list_detail
      :ruleData="ruleList"
      v-show="showRuleList"
      @showMainPage="comfirmRule"
    ></rule_list_detail>
  </div>
</template>

<script>
import menu_tab_two from "@/components/button/menu_tab_two";
import ranking_list from "../list/ranking_list";
import load_more from "@/components/base/load_more";
import ranking from "../../js/ranking";
import timePicker from "@/components/basicUI/qwuiPicker/time_picker.vue";
import * as timeUtil from "@/assets/js/time-util";
import user_select from "@/components/base/user_or_dept_select";
import rule_list_detail from "../../components/rule_list_detail";
import {loadLaterDpt,loadRuleList} from  "../../api/getData"

export default {
  components: {
    menu_tab_two,
    ranking_list,
    load_more,
    timePicker,
    user_select,
    rule_list_detail
  },
  data() {
    return {
      ruleList: {
        ruleList: [],//规则列表数据
        nowRule: {id: "", item: ""},//id为当前选择的规则id
      },
      isShowMain: true,
      showRuleList: false, //是否显示规则列表
      defaultDateS: "",
      defaultDateE: "",
      switchShowS: false,
      switchShowE: false,
      minYear: "", //最小年份
      maxYear: "", //最大年份
      deptListUrl: "", //部门列表Url
      parentDeptIndex:0,
      dataBase: dataBase,
      isOpenEarlySetting: dataBase.statistics.isOpenEarlySetting,
      isOpenDiligenceSetting: dataBase.statistics.isOpenDiligenceSetting,
      isOpenLaterSetting: dataBase.statistics.isOpenLaterSetting,
      diligentIsDisplay: dataBase.statistics.diligentIsDisplay,
      loginRankData: ranking.rankingData.loginRankData,
      rankContentList: ranking.rankingData.rankContentList,
      loadMore: ranking.rankingData.loadMore,
      selectConfig: ranking.rankingData.selectConfig,
      commitDraft: ranking.rankingData.commitDraft,
      sortText: "", //按xx类型排序
      loginTypeRankVo: {},
      itemIndex: 0,
      isOnList: false, //是否上榜
      checkName: "", //规则名称
      tab: 1, //部门tab为0，规则tab为1
      departmentName: "", //部门名称
      signDay: "", //早到榜时间传值
      signMonth: "", //勤奋榜/迟到榜时间传值
      early: {
        content: "i18n.earlyOnList",
        data: {
          //点击切换传递的数据
          checkWorkId: "",
          signDate: "",
          departId: "",
          isDepartManager: this.$route.query.isDepartManager,
          parentDepartId: ""
        },
        sortText: "按签到时间排序",
        url: "/portal/checkWorkCountCtrl/earlyList.do",
        deptListUrl: "/portal/departmentAction!getChildDept.action",
        type:"early",
      },
      diligence: {
        content: "i18n.countOnList",
        data: {
          //点击切换传递的数据
          checkWorkId: "",
          signDate: "",
          departId: "",
          isDepartManager: this.$route.query.isDepartManager,
          parentDepartId: ""
        },
        sortText: "按总工作时长排序",
        url: "/portal/checkWorkCountCtrl/diligenceList.do",
        deptListUrl: "/portal/departmentAction!getChildDept.action",
        type:"diligence",
      },
      later: {
        content: "i18n.laterOnList",
        data: {
          //点击切换传递的数据
          checkWorkId: "",
          signDate: "",
          departId: "",
          isDepartManager: this.$route.query.isDepartManager,
          parentDepartId: ""
        },
        sortText: "按迟到次数排序",
        url: "/portal/checkWorkCountCtrl/laterList.do",
        deptListUrl: "/portal/selectUserAction!getUserManageDept.action",
        type:"later",
      },
      selectData: {
        index: 0,
        scroll: false, //是否开启滚动置顶功能
        bottomLength: "90px", //底部横线的宽度
        nav: []
      },
      checkMonth: "",
      checkDate: ""
    };
  },
  filters: {
    signTimefilter: function(val) {
      if (!val) return "";
      return val.replace(/(\d{4})\-(\d{2})\-(\d{2})/, "");
    }
  },
  created: function() {
    this.getPermissionData(); //获取排行榜权限
    this.rankingTypeOpen(); //初始跳转的排行榜类型
    this.deptAndRuleData(); //跳转排行榜初始部门和规则
    this.initSignTime(); //初始赋值的时间
    this.initFooterStatus(); //重置页面tab状态和列表
    this.selectConfig.selectList["ccPersonList"].callBack.confirm = this.confirmSelect;
  },
  methods: {
    comfirmRule(chooseItem) {
      this.isShowMain = true;
      this.showRuleList = false;
      this.ruleList.nowRule.id = chooseItem.id;
      this.selectData.nav[this.selectData.index].data.checkWorkId = this.ruleList.nowRule.id;
      if(chooseItem.checkName){
        this.checkName = chooseItem.checkName;
      }
      this.$refs.loadMoreFun.clearLoadFun(); //清空列表数据，重新请求
    },
    //点击，控制时间组件显示
    timeSwitchShowS(){
      this.switchShowS = !this.switchShowS
    },
    timeSwitchShowE(){
      this.switchShowE = !this.switchShowE
    },
    cancel: function() {
      this.switchShowS = false;
      this.switchShowE = false;
    },
    //早到榜时间组件确认
    confirmS: function(val, valItem) {
      this.switchShowS = false;
      var data =
        valItem[0] +
        "-" +
        valItem[1] +
        "-" +
        (valItem[2] ? valItem[2].substring(0, 2) : "");
      this.defaultDateS =
        valItem[0] +
        "年" +
        valItem[1] +
        "月" +
        (valItem[2] ? valItem[2].substring(0, 2) + "日" : "");
      this.selectData.nav[this.selectData.index].data.signDate = data;
      this.$refs.loadMoreFun.clearLoadFun(); //清空列表数据，重新请求
    },
    //勤奋榜/迟到榜时间组件确认
    confirmE: function(val, valItem) {
      this.switchShowE = false;
      var data = valItem[0] + "" + valItem[1];
      this.defaultDateE = valItem[0] + "年" + valItem[1] + "月";
      for (var i = 0; i < this.selectData.nav.length; i++) {
        this.selectData.nav[i].data.signDate = data;
      }
      this.$refs.loadMoreFun.clearLoadFun(); //清空列表数据，重新请求
    },
    //排行榜权限控制
    getPermissionData() {
      if (this.$route.query.isDepartManager == 1) {
        //是部门负责人
        this.selectData.nav = [this.early, this.diligence, this.later];
        if (
          this.isOpenEarlySetting &&
          this.isOpenDiligenceSetting &&
          !this.isOpenLaterSetting
        ) {
          //开启早到榜和勤奋榜
          this.selectData.nav = [this.early, this.diligence];
        } else if (
          this.isOpenEarlySetting &&
          !this.isOpenDiligenceSetting &&
          this.isOpenLaterSetting
        ) {
          //开启早到榜和迟到榜
          this.selectData.nav = [this.early, this.later];
        } else if (
          !this.isOpenEarlySetting &&
          this.isOpenDiligenceSetting &&
          this.isOpenLaterSetting
        ) {
          //开启勤奋榜和迟到榜
          this.selectData.nav = [this.diligence, this.later];
        } else if (
          this.isOpenEarlySetting &&
          !this.isOpenDiligenceSetting &&
          !this.isOpenLaterSetting
        ) {
          //开启早到榜
          this.selectData.nav = [this.early];
        } else if (
          !this.isOpenEarlySetting &&
          this.isOpenDiligenceSetting &&
          !this.isOpenLaterSetting
        ) {
          //开启勤奋榜
          this.selectData.nav = [this.diligence];
        } else if (
          !this.isOpenEarlySetting &&
          !this.isOpenDiligenceSetting &&
          this.isOpenLaterSetting
        ) {
          //开启迟到榜
          this.selectData.nav = [this.later];
        }
      } else {
        //不是部门负责人
        this.selectData.nav = [this.early, this.diligence];
        if (this.isOpenEarlySetting && !this.isOpenDiligenceSetting) {
          //开启早到榜
          this.selectData.nav = [this.early];
        } else if (!this.isOpenEarlySetting && this.isOpenDiligenceSetting) {
          //开启勤奋榜
          this.selectData.nav = [this.diligence];
        }
      }
    },
    //默认跳转的排行榜类型
    rankingTypeOpen() {
      if (this.$route.query.type === "early") {
        this.selectData.index = 0;
      } else if (this.$route.query.type === "diligence") {
        this.selectData.index = 0;
        if (this.isOpenEarlySetting) {
          this.selectData.index = 1;
        }
      } else if (this.$route.query.type === "later") {
        this.selectData.index = 0;
        if (this.isOpenEarlySetting && this.isOpenDiligenceSetting) {
          this.selectData.index = 2;
        } else if (
          (this.isOpenEarlySetting && !this.isOpenDiligenceSetting) ||
          (!this.isOpenEarlySetting && this.isOpenDiligenceSetting)
        ) {
          this.selectData.index = 1;
        }
      }
    },
    //初始赋值的时间
    initSignTime() {
      let now = new Date();
      let year = now.getFullYear();
      let cmonth = now.getMonth() + 1;
      let day = now.getDate();
      let signDay = this.$route.query.data.checkDate;
      let defaultDate = this.$route.query.data.defaultDateS;
      if (cmonth < 10) cmonth = "0" + cmonth;
      if (day < 10) day = "0" + day;
      this.signDay = signDay ? signDay : (year + "-" + cmonth + "-" + day);
      this.signMonth = signDay ? signDay.replace(/(\d{4})\-(\d{2})\-(\d{2})/, "$1$2") : (year + "" + cmonth);
      this.checkDate = year + "-" + cmonth + "-" + day;
      this.checkMonth = year + "-" + cmonth;
      this.minYear = year - 1;
      this.maxYear = year;
      for (var i = 0; i < this.selectData.nav.length; i++) {
        this.selectData.nav[i].data.signDate = this.signMonth;
        if (this.isOpenEarlySetting) {
          this.selectData.nav[0].data.signDate = this.signDay;
        }
      }
      //初始排行榜时间显示
      this.defaultDateS = defaultDate
        ? defaultDate
        : timeUtil.changeFormat(new Date(), 'yyyy年MM月dd日');
      this.defaultDateE = signDay
        ? signDay.replace(/(\d{4})\-(\d{2})\-(\d{2})/, "$1年$2月")
        : timeUtil.changeFormat(new Date(), "yyyy年MM月");
    },
    //跳转排行榜初始部门和规则
    deptAndRuleData() {
      for (var i = 0; i < this.selectData.nav.length; i++) {
        this.selectData.nav[i].data.departId = this.$route.query.data.departId;
        this.selectData.nav[i].data.parentDepartId = this.$route.query.data.departId;
        this.selectData.nav[i].data.checkWorkId = this.$route.query.data.ruleId;
      }
      this.departmentName = this.$route.query.data.departName;
      this.checkName = this.$route.query.data.ruleName;
    },
    //重置页面tab状态和列表
    initFooterStatus() {
      if (this.selectData.index == null) {
        this.selectData.index = 0;
      }
      this.loadMore.url = this.selectData.nav[this.selectData.index].url;
      this.loadMore.data = this.selectData.nav[this.selectData.index].data;
      this.sortText = this.selectData.nav[this.selectData.index].sortText;
      this.deptListUrl = this.selectData.nav[this.selectData.index].deptListUrl;
    },
    //相关页面tab切换
    showMsgFromSelectCard: function(msg, index) {
      //排行榜时间显示
      let signDay = this.$route.query.data.checkDate;
      let defaultDate = this.$route.query.data.defaultDateS;
      this.defaultDateS = defaultDate
        ? defaultDate
        : timeUtil.changeFormat(new Date(), 'yyyy年MM月dd日');
      this.defaultDateE = signDay
        ? signDay.replace(/(\d{4})\-(\d{2})\-(\d{2})/, "$1年$2月")
        : timeUtil.changeFormat(new Date(), "yyyy年MM月");
      this.selectData.nav[index].data.signDate = this.transTime(
        this.defaultDateE
      );
      if (this.isOpenEarlySetting) {
        this.selectData.nav[0].data.signDate = this.transTime(
          this.defaultDateS
        );
      }
      //切换时，若榜单类型在勤奋榜和早到榜之间切换，则默认数据维持原先
      //若勤奋榜或早到榜切换到迟到榜，将parentDepartId遍历吃到榜部门列表。
      //若存在，则默认部门不变，否则取列表中的第一个部门为默认部门进行初始化.
      if(msg.type == "later"){
        this.loadLaterDptList(index);
      }else{
        //选择部门之后切换榜单，传递的部门参数与前一榜单一致
        if (this.commitDraft.draftFormData["ccDeptIds"][0]) {
          this.selectData.nav[
            index
            ].data.departId = this.commitDraft.draftFormData["ccDeptIds"][0];
          this.selectData.nav[
            index
            ].data.parentDepartId = this.commitDraft.draftFormData["ccDeptIds"][0];
        }
        this.deptSelected(
          "ccPersonList",
          this.selectConfig.selectList["ccPersonList"].deptSelected
        );
      }
      //选择规则之后切换榜单，传递的规则参数与前一榜单一致
      if (this.ruleList.nowRule.id) {
        this.selectData.nav[index].data.checkWorkId = this.ruleList.nowRule.id;
      }
      if (msg != null && msg !== "" && msg != undefined && msg.data) {
        this.showMsgFromFooter(msg);
      }
    },
    //获取迟到榜第一级部门列表数据进行遍历。
    loadLaterDptList(index){
      var self = this;
      loadLaterDpt({},function (result) {
        var laterDeptList = result.dept;
        if(laterDeptList && laterDeptList.length>0){
          var nowDeptInList = false;
          for(var i=0;i<laterDeptList.length;i++){
            var parentDepartId = self.commitDraft.draftFormData["ccDeptIds"][0];
            if(parentDepartId == laterDeptList[i].id){
              nowDeptInList = true;
            }
          }
          if(!nowDeptInList){
            self.selectData.nav[index].data.departId = laterDeptList[0].id;
            self.selectData.nav[index].data.parentDepartId = "";
            self.departmentName = laterDeptList[0].departmentName;
          }
        }
      })
    },
    showMsgFromFooter: function(msg) {
      //hasRecord 设置无内容提示图标、标题、提示内容
      this.loadMore.url = msg.url;
      this.loadMore.data = msg.data;
      this.sortText = msg.sortText;
      this.deptListUrl = msg.deptListUrl;
      this.$refs.loadMoreFun.clearLoadFun(); //清空列表数据，重新请求
    },
    showMsgFromLoadMore(data) {
      this.loginRankData = data;
      if (this.loginRankData.loginEarlyRankVo) {
        this.loginTypeRankVo = this.loginRankData.loginEarlyRankVo;
      } else if (this.loginRankData.loginDiligenceRankVo) {
        this.loginTypeRankVo = this.loginRankData.loginDiligenceRankVo;
      } else {
        this.loginTypeRankVo = this.loginRankData.loginLateRankVo;
      }
      var _userId = this.loginTypeRankVo.userId;

      this.isOnList = false; //未上榜
      this.itemIndex = 0;
      if (this.loginRankData.pageData) {
        //判断是否上榜
        // this.isOnList = false;//未上榜(此行代码放在此处产生bug，注意！)
        for (var i = 0; i < this.loginRankData.pageData.length; i++) {
          this.itemIndex++;
          if (_userId == this.loginRankData.pageData[i].userId) {
            this.isOnList = true;
            return this.itemIndex;
          }
        }
      }
    },
    confirmSelect(el, obj) {
      this.commitDraft.draftFormData["ccDeptIds"] = obj.dept.idStr.split("|");
      if (this.parentDeptIndex == 0) {
        this.selectData.nav[
          this.selectData.index
        ].data.parentDepartId = this.commitDraft.draftFormData["ccDeptIds"][0];
      }
      if (this.commitDraft.draftFormData["ccDeptIds"][0]) {
        this.selectData.nav[
          this.selectData.index
        ].data.departId = this.commitDraft.draftFormData["ccDeptIds"][0];
      }
      this.deptSelected(
        "ccPersonList",
        this.selectConfig.selectList["ccPersonList"].deptSelected
      );
      /**更新规则 */
      this.updateRule();
    },
    /**请求接口更新规则 */
    updateRule(){
      var self = this;
      var data = self.selectData.nav[self.selectData.index].data;
      var msg = {
        departId: data.departId,
        checkDate: this.checkDate,
        parentDepartId:data.parentDepartId,
      };
      loadRuleList(msg,function (result) {
        var newRuleList = result.checkWorkRuleVOS;
        //切换部门后，如果默认规则存在于这个规则列表中，则使用该默认规则。否则使用规则列表中的第一个规则
        self.ruleList.ruleList = newRuleList;
        if(newRuleList && newRuleList.length>0){
          var nowRuleInList = false;
          for(var i=0;i<newRuleList.length;i++){
            if(data.checkWorkId == newRuleList[i].id){
              nowRuleInList = true;
            }
          }
          if(!nowRuleInList){
            self.selectData.nav[self.selectData.index].data.checkWorkId = newRuleList[0].id;
            self.checkName = newRuleList[0].checkName;
          }
        }
        self.ruleList.nowRule.id = self.selectData.nav[self.selectData.index].data.checkWorkId;
        self.$refs.loadMoreFun.clearLoadFun(); //清空列表数据，重新请求
      });
    },
    getSignMonth: function(data) {
      this.selectData.nav[this.selectData.index].data.signDate = this.transTime(
        data
      );
      this.$refs.loadMoreFun.clearLoadFun(); //清空列表数据，重新请求
    },
    transTime: function(date, type) {
      var timeArr = date.split("");
      var newSignTime;
      if (timeArr.length > 8) {
        newSignTime = this.transDay(date, type);
        newSignTime = newSignTime
          .replace(" ", ":")
          .replace(/\:/g, "-")
          .split("-");
        return (this.signDay =
          newSignTime[0] + "-" + newSignTime[1] + "-" + newSignTime[2]);
      } else {
        newSignTime = this.transMonth(date, type);
        newSignTime = newSignTime
          .replace(" ", ":")
          .replace(/\:/g, "-")
          .split("-");
        return (this.signMonth = newSignTime[0] + "" + newSignTime[1]);
      }
    },
    //时间格式转换
    transDay: function(date, type) {
      //转化日期格式，type=1，字符转汉字
      var reg;
      var timeText;
      if (type == "1") {
        reg = /(\d{4})\-(\d{2})\-(\d{2})/;
        timeText = date.replace(reg, "$1年$2月$3日");
      } else {
        reg = /(\d{4})\年(\d{2})\月(\d{2})\日/;
        timeText = date.replace(reg, "$1-$2-$3");
      }
      return timeText;
    },
    transMonth: function(date, type) {
      //转化日期格式，type=1，字符转汉字
      var reg;
      var timeText;
      if (type == "1") {
        reg = /(\d{4})\-(\d{2})/;
        timeText = date.replace(reg, "$1年$2月");
      } else {
        reg = /(\d{4})\年(\d{2})\月/;
        timeText = date.replace(reg, "$1-$2");
      }
      return timeText;
    },
    //早到榜时间
    //前一天
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
      this.getSignMonth(this.defaultDateS);
    },
    //后一天
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
      this.getSignMonth(this.defaultDateS);
    },
    //勤奋榜/迟到榜时间
    //上个月
    preDayE() {
      var nowDateE = this.defaultDateE.replace(
        /(\d{4}).(\d{1,2}).+/gm,
        "$1-$2"
      );
      var monthArr = nowDateE.split("-");
      var monthY = monthArr[0];
      var monthM = monthArr[1];
      if (monthM > 1) {
        monthM = +monthM - 1;
      } else if (monthM <= 1) {
        monthM = 12;
        monthY = +monthY - 1;
      }
      if (+monthM < 10) {
        monthM = "0" + +monthM;
      }
      this.defaultDateE = monthY + "年" + monthM + "月";
      this.getSignMonth(this.defaultDateE);
    },
    //下个月
    nextDayE() {
      var nowDateE = this.defaultDateE.replace(
        /(\d{4}).(\d{1,2}).+/gm,
        "$1-$2"
      );
      var monthArr = nowDateE.split("-");
      var monthY = monthArr[0];
      var monthM = monthArr[1];
      if (monthM < 12) {
        monthM = +monthM + 1;
      } else if (monthM >= 12) {
        monthM = 1;
        monthY = +monthY + 1;
      }
      if (+monthM < 10) {
        monthM = "0" + +monthM;
      }
      if (this.isOverNow(nowDateE)) {
        return;
      }
      this.defaultDateE = monthY + "年" + monthM + "月";
      this.getSignMonth(this.defaultDateE);
    },
    isOverNow: function(monthDate) {
      var monthArr = monthDate.split("-");
      var monthY = monthArr[0];
      var monthM = monthArr[1];
      var date = new Date();
      var compY = date.getFullYear();
      var compM = date.getMonth();
      if (+monthY < compY) {
        return false;
      } else if (+monthM <= compM) {
        return false;
      } else {
        return true;
      }
    },
    //默认选中部门
    selectDeptList(type, index) {
      var _this = this;
      this.selectConfig.selectList["ccPersonList"].deptSelected.splice(0);
      this.selectConfig.selectList["ccPersonList"].deptSelected.push({
        departmentName: _this.departmentName,
        id: _this.selectData.nav[
          _this.selectData.index
        ].data.departId,
        parentDepartId: _this.selectData.nav[
          _this.selectData.index
        ].data.parentDepartId
      });
      this.parentDeptIndex = 0;
      this.selectConfig.show = true;
      this.selectConfig.signIndex = type;
      this.tab = index;
    },
    //已选择部门名称
    deptSelected(type, dept) {
      var departmentName;
      departmentName = this.$route.query.data.departName;
      if (dept && dept.length > 0) {
        for (var i = 0; i < dept.length; i++) {
          if (dept[i].departmentName !== "") {
            departmentName = dept[i].departmentName;
          }
        }
      }
      type == "ccPersonList" ? (this.departmentName = departmentName) : false;
    },
    chooseRule(index) {
      /**选择规则点击事件 */
      if (this.ruleList.ruleList.length <= 0) {
        this.updateRule();
      }
      this.showRuleList = true;
      this.isShowMain = false;
      this.tab = index;
    },
    /**选择子部门回调函数，确定当前parentId */
    chooseParentDept(obj) {
      if (this.parentDeptIndex == 0) {
        this.selectData.nav[
          this.selectData.index
        ].data.parentDepartId = obj.deptId;
      }
      this.parentDeptIndex++;
    },
    /**第一次选择部门回调，初始化parentId的index */
    initParentDeptId() {
      this.parentDeptIndex = 0;
    },
  }
};
</script>

<style scoped>
.qwui-wrap_box /deep/ .vux-tab-bar-inner {
  width: 92% !important;
}
.qwui-wrap_box /deep/ .qwui-no_record_box{
  margin-top: 43px;
}
@media screen and (min-width: 1024px) {
  .wrap_new {
    width: 740px !important;
    margin: 0 auto;
  }
}
.qwui-time_detaildata {
  position: relative;
  height: 30px;
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
  background: url("~assets/images/checkwork/ic_arrow_left.png") no-repeat left
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
  background: url("~assets/images/checkwork/ic_arrow.png") no-repeat right
    center;
  background-size: 10px;
  cursor: pointer;
}
/*选择部门和规则 start*/
.qwui-select_lists {
  display: flex;
  text-align: center;
  background: #fff;
  justify-content: space-around;
  padding: 10px;
}
.qwui-select_list_dept span,
.qwui-select_list_rules span {
  max-width: 100px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  font-size: 14px;
}
.selected {
  color: #467db9;
}
.qwui-icn_no_selected {
  display: inline-block;
  width: 6px;
  height: 4px;
  margin: 0 0 4px 4px;
  background: url("~assets/images/checkwork/ic_arrow_innormal.png") no-repeat;
  background-size: 6px 4px;
}
.qwui-icn_selected {
  display: inline-block;
  width: 6px;
  height: 4px;
  margin: 0 0 4px 4px;
  background: url("~assets/images/checkwork/ic_arrow_normal.png") no-repeat;
  background-size: 6px 4px;
}
/*选择部门和规则 end*/
.my_rank_info{
  background-color: #F7F7F7;
  padding: 15px;
}
.qwui-my_rank_info {
  position: relative;
  background: #fff;
  overflow: hidden;
}
.qwui-my_rank_logo img {
  float: left;
  margin: 10px;
  width: 50px;
  height: 50px;
}
.qwui-my_rank_text {
  margin-left: 70px;
}
.qwui-my_rank_state {
  float: left;
  margin: 10px 0 0 0;
  font-size: 17px;
  font-family: "黑体";
  font-weight: bold;
}
.qwui-my_rank_time {
  float: right;
  margin: 8px 10px 0 0;
  font-size: 16px;
  color: #999;
}
.qwui-my_rank_star {
  position: absolute;
  bottom: 12px;
  left: 72px;
  color: #999;
  font-size: 12px;
}
.qwui-sort_by_text {
  position: relative;
  padding-left: 15px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background: #fff;
  overflow: hidden;
}
.qwui-sort_by_text::after {
  content: "";
  position: absolute;
  left: 15px;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
}
.qwui-wrap_box /deep/ .qwui-showMoreList{
  display: none;
}
</style>

