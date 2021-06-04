<template>
  <div class="wrap">
    <!-- 规则列表模块 -->
    <rule_list_detail
      :ruleData="primeData.ruleList"
      v-show="showRuleList"
      @showMainPage="toShowMainPage"
    >
    </rule_list_detail>
    <!-- 备注页面模块 -->
    <remark_page
      v-if="showRemarkPage"
      :markDate="remarkItem"
      @closeMark="closeMarkPage"
    >
    </remark_page>
    <!-- 主页显示模块 -->
    <div v-show="!showRuleList && !showRemarkPage">
      <!--即时显示当前时间模块-->
      <show_nowtime
        :shownowtime="showNowTimeData"
        :newContTime="dataBase.todayCheck.showNowTimeOne.totalNum"
      ></show_nowtime>
      <!-- 非排班规则打卡模块 -->
      <div v-if="primeData.checkSignType != '2'">
        <!-- 规则选择入口 -->
        <rule_list_enter
          :ruleListenter="primeData.ruleList"
          @click.native="showRule"
        >
        </rule_list_enter>
        <!-- 固定规则签到模块 -->
        <sign_message
          :ifFixRule="ifFixRule"
          :signMessage="signAbout"
          :isShake="isShake"
          :ruleList="primeData.ruleList"
          v-show="showFixModule"
          @handerShakeRule="handerShakeRule"
          @remarkPageShow="remarkPageShow"
          ref="signMassage"
        >
        </sign_message>
        <!-- 自由规则模块 -->
        <check_item_forFree
          v-show="showFreeModule"
          :freeCheckData="primeData.freeData"
          @updataFreeContTime="updataFreeContTime"
          @remarkPageShow="remarkPageShow"
        >
        </check_item_forFree>
      </div>
      <!-- 排班规则打卡模块 -->
      <div v-if="primeData.checkSignType == '2'">
        <div v-for="(schedulingItem,index) in schedulingData" :key="index">
          <!-- 排班规则显示 -->
          <rule_list_enter :ruleListenter="schedulingItem.ruleName" :ruleType = "2"></rule_list_enter>
          <!-- 排班规则签到模块 -->
          <sign_message
            :ifFixRule="ifFixRule"
            :signMessage="schedulingItem.schedulingSignsAbout"
            :isShake="isShake"
            :ruleList="primeData.ruleList"
            @handerShakeRule="handerShakeRule"
            @remarkPageShow="remarkPageShow"
            ref="signMassage"
          >
          </sign_message>
        </div>
      </div>
      <div class="ps" v-show="showFixModule">
        <div class="flexItem">
        <!-- 提示信息 -->
        <span>{{promptMsg[promptMsgIndex]}}</span>
        <br><br>
        <!--非vip普通用户显示广告-->
        <span class="advertiseColor" v-if="!noShowAdvertise">企微云考勤机 隆重上线，多点考勤，统一管理。</span>
        </div>
      </div>
    </div>
    <!-- 底部导航 -->
    <nav-footer class="fillBackground" v-show="!showRuleList && !showRemarkPage">
      <div
        class="qwui-dialog_show"
        @click="dialogShow(index)"
        v-for="(navItem, index) in bottomMenu"
        :key="index"
      >
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
import show_nowtime from "../components/show_nowtime";
import rule_list_enter from "../components/rule_list_enter";
import sign_message from "../components/sign_message";
import rule_list_detail from "../components/rule_list_detail";
import check_item_forFree from "../components/check_item_forFree";
import remark_page from "./add/remark_add";
import navFooter from '@/components/part/nav_footer'; //底部菜单栏组件
import tabOne from '@/components/part/tab_one';
import dialogMask from '@/components/base/dialog_mask_bottom';
import {checkDepartManager} from "../api/getData";

export default {
  components: {
    show_nowtime,
    rule_list_enter,
    sign_message,
    rule_list_detail,
    check_item_forFree,
    remark_page,
    tabOne,
    navFooter,
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
      ifFixRule:true,//是否固定规则
      isShake: false,//是否符合摇一摇
      isShakeSign: false,//是否摇一摇签到
      dataBase: dataBase,
      showRuleList: false,//是否显示规则列表
      showRemarkPage:false,//是否显示备注页面
      showFixModule: true, //控制固定规则模块的显示
      showFreeModule: false, //控制自由考勤模块的显示
      remarkItem:{},//备注页信息
      field: {
        value: ""
      },
      setValue: "",
      address: "",
      promptMsg: {
        //提示信息
        "1":
          "签到/签退成功后，点击时间可更新考勤信息；备注只能在考勤当天内修改。",
        "2":
          "使用“摇一摇”的考勤规则，需要开启手机蓝牙，并通过：微信首页 > 发现 > 摇一摇 > 周边 进行签到/签退。更新签到/签退时间也需要以上方式，备注只能在当天于这个页面修改。"
      },
      showAdvertise: false, //是否显示广告，是否金卡
      promptMsgIndex: "", //提示信息索引
      schedulingData: [], //排班考勤数据
      showNowTimeData: {
        newTime: "2018-10-08 星期一",
        totalNum: "",
        isNormal: true,
        isShowWorkHour: true
      },
      primeData: {
        checkSignType: "", //考勤签到类型，2为排班考勤
        ruleVO: "", //规则的规则类型、状态、是否使用考勤机考勤状态、是否禁用手机考勤状态
        elasticWorkHour: "", //考勤规则弹性工作时长
        countTime: "", //考勤总时长
        signStatus: "", //考勤总状态
        id: "",
        signDate: "",
        ruleList: {
          ruleList: [],
          nowRule: {
            id: "",
            item: ""
          }
        },
        freeData: {
          //自由考勤相关数据
          isCalculationWorkHour: "", //自由考勤是否统计工作时长
          workHourForFree: "", //自由考勤工作时长
          infoId: "", // 考勤统计id，若没有该值，证明自由规则没有考勤
          totalNum: "", //考勤记录总条数
          freeSignList: [],
          ruleVO: {}
        }
      },
      ruleVO: {},
      signAbout: {
        signList: []
      },
      signItem: {
        signinItem: {
          id: "", //签到id
          status: "", //状态
          signAddress: "", //签到地址
          signTime: "", //应签到时间
          signinTime: "" //签到时间
        },
        signoutItem: {
          id: "", //签到id
          status: "", //状态
          signAddress: "", //签到地址
          signTime: "", //应签到时间
          signoutTime: "" //签退时间
        }
      },
      freeCheckStatusObj: {
        //自由考勤状态
        "1": "", // 正常
        "2": "迟到",
        "3": "早退",
        "4": "迟到 偏移位置",
        "5": "早退 偏移位置",
        "6": "偏移位置",
        "7": "迟到 ip异常",
        "8": "早退 ip异常",
        "9": "ip异常",
        "10": "请假",
        "11": "出差",
        "12": "请假出差"
      }
    };
  },
  created() {
    this.getDefaultData();
    this._getInit();
  },
  computed() {
    promptMsgIndex: ""; //提示信息索引
  },
  methods: {
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
      if(index == this.activeIndex && index != 3){ return }
      this.changeIcon(index);
      switch(index) {
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
    remarkPageShow(item){
      /**打开备注页面 */
      this.remarkItem = item;
      this.showRemarkPage = true;
    },
    closeMarkPage(item){
      /**关闭备注页面 */
      this.showRemarkPage = false;
      item.isHasRemark = false;
    },
    handerShakeRule(list) {
      /**处理摇一摇考勤规则 */
      let _this = this;
      if (_this.isShake) {
        _this.primeData.ruleList = list;
        _this.showRuleList = true;
        _this.isShakeSign = true;
      }
    },
    showRule: function() {
      this.showRuleList = true;
    },
    toShowMainPage: function(chooseItem) {
      this.showRuleList = false;
      let ruleList = this.primeData.ruleList;
      let nowRuleId = chooseItem.id;
      for (let i = 0; i < ruleList.ruleList.length; i++) {
        if (nowRuleId == ruleList.ruleList[i].id) {
          ruleList.nowRule.item = ruleList.ruleList[i];
        }
      }
      this.primeData.id = nowRuleId;
      this.signAbout.signList.splice(0);
      this.primeData.freeData.freeSignList.splice(0);
      this.schedulingData = {};
      if (this.isShake && this.isShakeSign) {
        let ticket = _.getUrlParam("ticket");
        let checkWorkId = chooseItem.id;
        let signId = chooseItem.signId;
        let shakeId = this.$refs.signMassage.shakeId;
        this.isShakeSign = false;
        this.$refs.signMassage.shakeSign(
          ticket,
          checkWorkId,
          signId,
          "1",
          "1",
          shakeId
        );
      }
      this.getDefaultData();
    },
    updataFreeContTime(countTimeData) {
      let _this = this;
      if (countTimeData.isCalculationWorkHour && countTimeData.isCalculationWorkHour == "1"){
        _this.showNowTimeData.isShowWorkHour = true;
      }else{
        _this.showNowTimeData.isShowWorkHour = false;
      }
      if (countTimeData.countTime) {
        _this.showNowTimeData.totalNum = countTimeData.countTime;
        _this.showNowTimeData.isNormal = dataBase.todayCheck.isNormal;
      }
    },
    getDefaultData: function() {
      let _this = this;
      _.ajax({
        url: _.baseURL + dataBase.todayCheck.getCheckRuleListUrl,
        type: "post",
        data: {
          id: _this.primeData.id,
          signDate: _this.primeData.signDate
        },
        success: function(result) {
          if (result.code == "0") {
            let signinList = [];
            let signoutList = [];
            _this.showNowTimeData.isNormal = true;//初始化考勤工作时长为正常颜色
            _this.primeData.checkSignType = result.data.checkSignType; //获取考勤签到类型，2为排班考勤
            _this.primeData.ruleVO = result.data.ruleVO; //规则的规则类型、状态、是否使用考勤机考勤状态、是否禁用手机考勤状态
            _this.primeData.freeData.isCalculationWorkHour =
              result.data.isCalculationWorkHour; //自由考勤是否统计工作时长
            _this.primeData.freeData.workHourForFree = result.data.countTime; //自由考勤工作时长
            _this.promptMsgIndex = "1";
            if (result.data.checkSignType != "2") {
              //不是排班考勤时
              _this.ifFixRule = true;
              _this.primeData.ruleList.ruleList = result.data.list;
              _this.primeData.ruleList.nowRule.id = result.data.roleid;
              _this.dataBase.todayCheck.nowRule.id = result.data.roleid;
              /**如果不存在默认的考勤规则，打开规则选择列表 */
              if (!result.data.roleid) {
                _this.showRule();
                return;
              }
              if (result.data.checkType == "2") {
                //自由规则考勤
                _this.showFixModule = false;
                _this.showFreeModule = true;
                _this.primeData.freeData.infoId = result.data.infoId;
                _this.primeData.freeData.totalNum = result.data.totalNum;
                _this.showNowTimeData.newTime = result.data.newTime; //更新考勤日时间
                _this.showNowTimeData.totalNum = result.data.countTime
                  ? result.data.countTime
                  : "0";
                if (_this.primeData.freeData.isCalculationWorkHour != "1") {
                  _this.showNowTimeData.isShowWorkHour = false;
                }else{
                  _this.showNowTimeData.isShowWorkHour = true;
                }
                let freeSignList = result.data.startList;
                if (freeSignList) {
                  for (let i = 0; i < freeSignList.length; i++) {
                    let freeSignItem = {
                      signTime: "",
                      signAddress: "",
                      signStatus: "",
                      signStatusCont: "",
                      isHasRemark: "",
                      remarkContent: "",
                      remarkImg: "",
                      remarkPerson: "",
                      latitude: "",
                      longitude: "",
                      id: ""
                    };
                    freeSignItem.signTime = freeSignList[i].signTime.substring(
                      11,
                      16
                    );
                    freeSignItem.signAddress = freeSignList[i].signAddress;
                    freeSignItem.signStatus = freeSignList[i].status;
                    freeSignItem.latitude = freeSignList[i].latitude;
                    freeSignItem.longitude = freeSignList[i].longitude;
                    freeSignItem.id = freeSignList[i].id;
                    freeSignItem.isHasRemark = false;
                    freeSignItem.remarkContent = freeSignList[i].content;
                    freeSignItem.signStatusCont =
                      _this.freeCheckStatusObj[freeSignList[i].status];
                    _this.primeData.freeData.freeSignList.push(freeSignItem);
                  }
                }
                for (let i = 0; i < result.data.list.length; i++) {
                  if (result.data.roleid == result.data.list[i].id) {
                    _this.primeData.ruleList.nowRule.item = result.data.list[i];
                    _this.dataBase.todayCheck.nowRule.item =
                      result.data.list[i];
                    _this.primeData.freeData.ruleVO = result.data.list[i];
                  }
                }
              } else {
                //固定规则
                _this.showFixModule = true;
                _this.showFreeModule = false;
                /**显示工作时长 */
                _this.showNowTimeData.isShowWorkHour = true;
                _this.primeData.elasticWorkHour = result.data.elasticWorkHour; //考勤规则弹性工作时长
                _this.primeData.countTime = result.data.countTime; //考勤总时长
                _this.primeData.signStatus = result.data.signStatus; //考勤总状态
                if (result.data.isElastic && result.data.isElastic == "1") {
                  //1:弹性时长考勤
                  if (
                    result.data.elasticWorkHour &&
                    parseFloat(result.data.countTime) <
                      parseFloat(result.data.elasticWorkHour) &&
                    result.data.signStatus == "2"
                  ) {
                    //2:总考勤状态异常
                    _this.dataBase.todayCheck.isNormal = false;
                  }
                }
                _this.showNowTimeData.isNormal = _this.dataBase.todayCheck.isNormal;
                if (result.data.isShake == 0) {
                  //摇一摇页面样式初始化特殊处理
                  _this.promptMsgIndex = "2";
                  _this.isShake = true;
                } else {
                  _this.isShake = false;
                }
                _this.showNowTimeData.newTime = result.data.newTime; //更新考勤日时间
                _this.showNowTimeData.totalNum = result.data.countTime
                  ? result.data.countTime
                  : "0"; //考勤工作时长
                if (result.data.list) {
                  for (let i = 0; i < result.data.list.length; i++) {
                    if (result.data.roleid == result.data.list[i].id) {
                      _this.primeData.ruleList.nowRule.item =
                        result.data.list[i];
                      _this.dataBase.todayCheck.nowRule.item =
                        result.data.list[i];
                    }
                  }
                }
                if (result.data.startList) {
                  for (let i = 0; i < result.data.startList.length; i++) {
                    let signVo = result.data.startList[i];
                    if (signVo.signType == "1") {
                      signinList.push(signVo);
                    } else if (signVo.signType == "2") {
                      signoutList.push(signVo);
                    }
                  }
                  for (let i = 0; i < signinList.length; i++) {
                    let signItem = {
                      signinItem: {},
                      signoutItem: {}
                    };
                    signItem.signinItem = signinList[i];
                    signItem.signinItem["isHasRemark"] = false;
                    if (signoutList[i]) {
                      signItem.signoutItem = signoutList[i];
                      signItem.signoutItem["isHasRemark"] = false;
                    }
                    _this.signAbout.signList.push(signItem);
                  }
                }
              }
            } else {
              //排班考勤时
              _this.ifFixRule = false;
              let schedulingList = result.data.schedulingRules;
              let totalNum;
              _this.showNowTimeData.newTime =
                schedulingList[0].workDate + " " + schedulingList[0].weekDesc;
              let schedulingData = [];
              for (let i = 0; i < schedulingList.length; i++) {
                let schedulingItem = {
                  ruleName: {
                    nowRule: {
                      //当前规则
                      id: "",
                      item: {
                        //当前规则项
                        checkName: "当前规则",
                        noShowTab: true
                      }
                    }
                  },
                  date: "",
                  schedulingRule: {
                    signList: []
                  },
                  schedulingSignsAbout: {
                    signList: []
                  }
                };
                schedulingList[i].ruleVo["signDate"] =
                  schedulingList[i].workDate;
                schedulingItem.schedulingSignsAbout["ruleVo"] =
                  schedulingList[i].ruleVo;
                let schedulingVo = result.data.schedulingRules[i];
                let signVo = schedulingVo.signDetaileds;
                let statusDesc; //启用禁用状态
                if (schedulingVo.status == "2") {
                  statusDesc = "已启用";
                } else {
                  statusDesc = "已禁用";
                }
                let checkName =
                  schedulingVo.shortName +
                  "-" +
                  schedulingVo.checkName +
                  "(" +
                  statusDesc +
                  ")" +
                  "(" +
                  schedulingVo.workDate +
                  ")";
                schedulingItem.ruleName.nowRule.item.checkName = checkName;
                totalNum += schedulingVo.elasticWorkHour;
                for (let j = 0; j < signVo.length; j++) {
                  let signItem = {
                    signinItem: {},
                    signoutItem: {}
                  };
                  if (signVo[j].signType == "1") {
                    signItem.signinItem = signVo[j];
                    signItem.signinItem["isHasRemark"] = false;
                  } else if (signVo[j].signType == "2") {
                    signItem.signoutItem = signVo[j];
                    signItem.signoutItem["isHasRemark"] = false;
                  }
                  schedulingItem.schedulingSignsAbout.signList.push(signItem);
                }
                schedulingData.push(schedulingItem);
              }
              dataBase.todayCheck.schedulingData = schedulingData;
              _this.schedulingData = schedulingData;
              dataBase.todayCheck.showNowTimeOne.totalNum = totalNum
                ? totalNum
                : "0";
            }
          } else {
            _.alert("提示", result.desc);
          }
        }
      });
    }
  },
  computed: {}
};
</script>

<style scoped>
.wrap {
  background-color: #f7f7f7;
}
.wrap /deep/ .qwui-dialog_bottom_footer {
  font-size: 18px;
}
.ps {
  padding: 20px 0;
  color: #999;
  font-size: 12px;
  line-height: 1.4;
}
.flexItem {
  padding: 0 15px;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.advertiseColor {
  color: #ff9600;
}
/*ios按公共组件上的48px会露底*/
.fillBackground /deep/ .qwui-nav_footer_height {
  height: 47px;
  background-color: #fff;
}
.fillBackground /deep/ .qwui-tab_text {
  line-height: 1;
}
.fillBackground /deep/ .qwui-nav_footer_fix {
  padding-bottom: 3px;
}
.qwui-dialog_show {
  flex: 1;
}
</style>


