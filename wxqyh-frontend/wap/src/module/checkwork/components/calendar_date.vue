<template>
  <div class="wrap_new">
    <!-- 从统计页面跳转到他人考勤日历时显示的他人信息项 -->
    <div class="rankItem" v-if="userId">
      <div class="rankItemContent line-bottom">
        <img :src="headPic !=0? headPic:proHeadPicUrl" alt="未获取图片">
        <div class="rankUserName qwui-spanEllips">{{personName}}</div>
        <div class="rankMemberDept qwui-spanEllips">{{rankDepName}}</div>
      </div>
    </div>
    <!-- 日历部分 -->
    <div class="qwui-riliBox">
      <!-- 前一月后一月 -->
      <div class="qwui-rili_top">
        <div class="qwui-rili_prev" @click="riliSwitch('prev')"></div>
        <div class="qwui-rili_next" @click="riliSwitch('next')"></div>
        <div class="dateSource">{{calendarTitle}}</div>
      </div>
      <!-- 星期显示 -->
      <div class="qwui-rili_h">
        <div class="qwui-day" v-for="item in weekArr" :key="item.id">{{item.week}}</div>
      </div>
      <!-- 日历的每一天显示 -->
      <div class="qwui-rili_c">
        <div class="qwui-day"
             :class="isDangqianDay(dayItem)"
             v-for="dayItem in calendarArr"
             :key="dayItem.id"
             @click="dayChecked(dayItem)"
        >
          <div v-if="!dayItem.color[0] || dayItem.color.lenth < 2" :style="isHasColor(dayItem)">
            <span class="colorSpan">{{dayItem.day}}</span>
          </div>
          <div v-else-if="dayItem.color.lenth = 2" class="colorDayItem">
            <div :style="isHasColor(dayItem,0)" class="colorLenTwo-one"></div>
            <div :style="isHasColor(dayItem,1)" class="colorLenTwo-two"></div>
            <span class="colorSpan">{{dayItem.day}}</span>
          </div>
          <div v-else-if="dayItem.color.lenth = 3" class="colorDayItem">
            <div :style="isHasColor(dayItem,0)" class="colorLenThree-one"></div>
            <div :style="isHasColor(dayItem,1)" class="colorLenThree-two"></div>
            <div :style="isHasColor(dayItem,2)" class="colorLenThree-three"></div>
            <div :style="isHasColor(dayItem,0)" class="colorLenThree-four"></div>
            <span class="colorSpan">{{dayItem.day}}</span>
          </div>
          <div v-else-if="dayItem.color.lenth = 4" class="colorDayItem">
            <div :style="isHasColor(dayItem,0)" class="colorLenFour-one"></div>
            <div :style="isHasColor(dayItem,1)" class="colorLenFour-two"></div>
            <div :style="isHasColor(dayItem,2)" class="colorLenFour-three"></div>
            <div :style="isHasColor(dayItem,3)" class="colorLenFour-four"></div>
            <span class="colorSpan">{{dayItem.day}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 不同考勤状态天数统计 -->
    <div class="qwui-rows">
      <div class="qwui-row_title clearfix" @click="changeOpen()">
        <span class="qwui-row_title-l">考勤统计</span>
        <span class="qwui-row_title-r" :class="[isOpenTotal ? 'qwui-row_up': 'qwui-row_down']">{{openName}}</span>
      </div>
      <div class="qwui-row_pd" v-show="isOpenTotal">
        <div v-if="signStatusOkNum">
          <i class="qwui-icon_zc qwui-kaoqinPs_box-l"></i>
          <div class="qwui-kaoqinPs_item">正常: <span>{{signStatusOkNum}}</span>天</div><br>
        </div>
        <div v-if="leaveNum || noSignNum || absWorkDate || lateNum">
          <i class="qwui-icon_zt qwui-kaoqinPs_box-l"></i>
          <div class="qwui-kaoqinPs_box-r">
            <div class="qwui-kaoqinPs_item" v-if="leaveNum">早退: <span>{{leaveNum}}</span>次</div>
            <div class="qwui-kaoqinPs_item" v-if="noSignNum">漏签: <span>{{noSignNum}}</span>次</div>
            <div class="qwui-kaoqinPs_item" v-if="absWorkDate">旷工: <span>{{absWorkDate}}</span>天</div>
            <div class="qwui-kaoqinPs_item" v-if="lateNum">迟到: <span>{{lateNum}}</span>次</div><br>
          </div>
        </div>
        <div v-if="outWorkNum || askLeaveNum || noWorkDayNum">
          <i class="qwui-icon_fg qwui-kaoqinPs_box-l"></i>
          <div class="qwui-kaoqinPs_box-r">
            <div class="qwui-kaoqinPs_item" v-if="outWorkNum">外勤: <span>{{outWorkNum}}</span>次</div>
            <div class="qwui-kaoqinPs_item" v-if="askLeaveNum">请假出差</div>
            <div class="qwui-kaoqinPs_item" v-if="noWorkDayNum">非工作日考勤</div>
          </div>
        </div>
        <!-- 无记录提示 -->
        <div v-if="!signStatusOkNum && !leaveNum && !noSignNum && !absWorkDate && !lateNum && !outWorkNum && !askLeaveNum && !noWorkDayNum">暂无考勤记录</div>
      </div>
    </div>
    <!-- 普通员工排行榜入口 -->
    <div class="qwui-rows" v-show="showRankEnter && !dataBase.statistics.isManager" @click="openRank()">
      <div class="qwui-row_title clearfix">
        <span class="row_title-2">排行榜</span>
        <span class="date-list-datebtn"></span>
      </div>
    </div>
    <div v-for="(signItem,index) in signArr" :key="index">
      <div class="qwui-rowCenter">
        <div class="qwui-timeTitle">{{signItem.dateTitle}}</div>
        <div class="workHour_div" v-if="signItem.countTime">
          工作
          <span :class="timeColor(signItem.workHoursShort)">{{signItem.countTime}}</span> 小时</div>
        </div>
      <div class="qwui-dayCheck">
      <div class="qwui-ruleTitle" v-if="signArr.length>1">{{signItem.ruleName}}</div>
        <div class="qwui-dayCheckCont" v-if="signItem.isNoData">
          <div>暂无考勤记录</div>
        </div>
        <check_item_one
          v-if="!signItem.isNoData"
          :checkItemOne="signItem.signDetail"
          :infoid="signItem.infoIds"
          :checkIsAbsWork="signItem.checkIsAbsWork"
          :todaySignType="todaySignType"
        >
        </check_item_one>
      </div>
    </div>
    <check_item_forAsk :checkItemForAsk="askList"></check_item_forAsk>
    <!--异常申诉操作按钮-->
    <div class="qwui-bottom_btn" v-if="isRepSign">
      <flow_button :buttondata="buttonConfig"></flow_button>
    </div>
  </div>
</template>

<script>
import check_item_one from "./check_item_one";
import flow_button from "@/components/button/flow_button";
import check_item_forAsk from "./check_item_forAsk";
import {checkHasDaily,getWorkCalendarDetail,getOneDayCheck} from "../api/getData";
import {getNextSignDate,getBeforeSignDate,checkIsSignTimeRep,handleDetailedIds} from "../js/repCommon";

const proHeadPicUrl = require("../../../assets/images/icon_person.png");

export default {
  name: "calendar_date",
  props: {
    ismanager: {
      type: Boolean,
      default: false
    },
    getDeptData:Object,
  },
  components: {
    check_item_one,
    flow_button,
    check_item_forAsk
  },
  data() {
    return {
      dataBase: dataBase,
      errorStatusNum:{
        'qingjia':'',
        'feigongzuo':''
      },
      buttonConfig:{
        primaryList: [
          {type: "primary",name: "i18n.addCheckWork",callBack: this.turnToAdd}
        ],
        defaultList: [],
        style: { class: "" } //按钮是否置底部 active :底部、"":相对定位
      },
      infoIds: "",
      isDepartManager: 0,
      userId: "",
      personName: "",
      rankDepName: "",
      headPic: "",
      proHeadPicUrl: proHeadPicUrl,
      askList: [],
      calendarArr: [], //日历数组，用于组成日历
      calendarDataArr: [], //日历数据
      calendarTitle: "", //日历标题
      yearAndMonth: "",
      color_arr: {
        zhengchang: "#87d45d",
        kuanggong: "#ff7979",
        chidao: "#ff7979",
        zaotui: "#ff7979",
        louqian: "#ff7979",
        qingjia: "#dfb18c",
        waiqing: "#dfb18c",
        feigongzuo: "#dfb18c",
        qitayichang: "#ff7979"
      },
      week_arr: {
        "1": "星期一",
        "2": "星期二",
        "3": "星期三",
        "4": "星期四",
        "5": "星期五",
        "6": "星期六",
        "0": "星期日"
      },
      statusDesc: {
        //考勤状态描述
        "2": ["迟到", ""],
        "3": ["早退", ""],
        "4": ["迟到", "，偏离位置"],
        "5": ["早退", "，偏离位置"],
        "6": ["偏离位置", ""],
        "7": ["迟到", "，IP异常"],
        "8": ["早退", "，IP异常"],
        "9": ["IP异常", ""],
        "10": ["旷工", ""],
        "11": ["漏签", ""]
      },
      currentDay: "", //当前时间，日/月/年/星期
      currentM: "",
      currentY: "",
      currentWeek: "",
      showDay: "", //当前页面显示时间，日/月/年/星期
      showM: "",
      showY: "",
      showWeek: "",
      weekArr: [
        { id: 0, week: "日" },
        { id: 1, week: "一" },
        { id: 2, week: "二" },
        { id: 3, week: "三" },
        { id: 4, week: "四" },
        { id: 5, week: "五" },
        { id: 6, week: "六" }
      ],
      isChecked: "", //被选中的天数
      signStatusOkNum: "", //正常天数
      lateNum: "", //迟到数
      leaveNum: "", //早退数
      outWorkNum: "", //外勤数
      noSignNum: "", //漏签数
      absWorkDate: "", //旷工数
      askLeaveNum: "", //请假数
      noWorkDayNum: "", //非工作日考勤数
      isOpenTotal: false, //是否展开统计
      openName: "展开",
      hasCheckItem: true, //是否有考勤项
      signArr: [],
      isShowRule: false, //当日考勤详情中是否显示规则名
      showRankEnter: false, //是否显示排行榜入口
      autoDayItem: {
        /**自动跳转日期项 */
        searchDate: "",
        day: "",
        showM: "",
        week: ""
      },
      hasRepSign: false,//false：没有可申诉的签到/退；true：有可申诉的签到/退
      isRepSign:false,//不能申诉考勤异常
      todaySignType:0,//不是当天考勤
      isRepTodays:'',
    };
  },
  computed: {
    timeTitle: function() {
      return (
        this.showM +
        "月" +
        this.showDay +
        "日" +
        " " +
        this.week_arr[this.showWeek]
      );
    }
  },
  created() {
    /**初始化日历页面 */
    this.getCalendarInfo("");
    /**验证权限判断是否显示排行榜入口 */
    this.isShowRankEnter();
  },
  methods: {
    /**点击进入新增考勤申诉页面*/
    turnToAdd() {
      let self = this;
      let msg = {"infoIds":this.infoIds};
      if(!this.isRepSign){
        _.alert("i18n.notice","不能申诉该天考勤的异常！");
        return;
      }
      if(0 != this.todaySignType){
        /**申述的是今天的考勤异常*/
        if(!this.infoIds){
          _.alert("i18n.notice","该考勤已被删除，不能申诉！");
          return;
        }
        checkHasDaily(msg,function (result) {
          let hasDaily = result.hasDaily;
          if(hasDaily){
            self.$router.push({
              path:"/add",
              query:{
                infoIds:handleDetailedIds(self.infoIds),
                isRepToday:handleDetailedIds(self.isRepTodays),
                fromType:"2" //2：表示是日历页面进入;
              }
            });
          }else{
            _.alert("i18n.notice","正在生成日报，请稍候再试。");
          }
        })
      }else{
        this.$router.push({
          path: "/add",
          query: {
            infoIds:self.infoIds,
            fromType:2
            /**2：表示是考勤日历页面进入*/
          }
        });
      }
    },
    openRank() {
      /**普通员工排行榜入口跳转至排行榜*/
      if (this.ismanager) {
        this.isDepartManager = 1;
      }
      this.$router.push({
        path: "/ranking",
        query: {
          isDepartManager: this.isDepartManager,
          data:this.getDeptData,
        }
      });
    },
    dayChecked(dayItem) {
      /**选中日历某天，显示当天考勤详情*/
      var _this = this;
      if (dayItem.day == "") {
        return;
      }
      var searchDate = dayItem.searchDate;
      dayItem.yearAndMonth = _this.currentY + "-" + _this.currentM;
      _this.isChecked = dayItem.day;
      _this.showM = dayItem.showM;
      _this.showDay = dayItem.day;
      _this.showWeek = dayItem.week;
      /**置空当天考勤详情*/
      _this.signArr.splice(0);
       /**置空申诉按钮*/
      _this.buttonConfig = {};
      _this.upDateDayDetail(searchDate);
    },
    upDateDayDetail(searchDate) {
      let _this = this;
      let msg = {
        searchDate: searchDate,
        userId: _this.userId
      };
      getOneDayCheck(msg,function (result) {
        /**申诉按钮*/
        _this.buttonConfig = {
          primaryList: [
            {type: "primary",name: "i18n.addCheckWork",callBack: _this.turnToAdd}
          ],
          defaultList: [],
          style: { class: "" }
          /**按钮是否置底部 active :底部、"":相对定位*/
        };
        let conditionVo = result.conditionVo;
        /**处理当日考勤明细数据*/
        _this.handleSignDetailed(conditionVo, result.isRep);
        let signList = conditionVo.csdList;
        let askList = conditionVo.askList;
        _this.askList = askList;
        if (signList.length > 0) {
          if (signList.length > 1) {
            _this.isShowRule = true;
          }
          let infoIdArr = [];
          for (let i = 0; i < signList.length; i++) {
            let signItem = {
              countTime: "",
              dateTitle: "",
              ruleName: "",
              signDetail: [],
              isNoData: true,
              id: "1",
              infoIds: "",
              workHoursShort: false,
              checkIsAbsWork:''
            };
            signItem.dateTitle = _this.timeTitle;
            let signcItem = signList[i];
            let icvo = signcItem.icvo;
            _this.todaySignType = signcItem.todaySignType;
            /**处理路由跳转需要传的数据*/
            if (icvo.signStatus == "2") {
              /**总考勤异常*/
              infoIdArr.push(icvo.id);
              let choiceVal = [];
              infoIdArr.forEach(key => {
                choiceVal.push("1");
              });
              _this.isRepTodays = choiceVal.join(',')
            }

            let countTime = icvo.countTime;
            signItem.countTime = countTime;
            let infoIds = icvo.id;
            signItem.infoIds = infoIds;
            let checkIsAbsWork = icvo.checkIsAbsWork;
            signItem.checkIsAbsWork = checkIsAbsWork;
            let signDetailList = signcItem.sdList;
            signItem.ruleName = icvo.checkWorkName;
            /**遍历签到签退信息 */
            if (signDetailList.length != 0) {
              for (let j = 0; j < signDetailList.length; j++) {
                let signDetailItem = signDetailList[j];
                let errTime;
                let detailItem = {
                  signTime: "14:16",
                  signType: "签到",
                  errorCont: "迟到4小时36分钟，IP异常",
                  signAddress: "广东省广州市天河区员村一横路3号",
                  id: "1",
                  shouldTime: "16:00",
                  status: ""
                };
                let signTimeList = signDetailItem.signTime.split(" ");
                detailItem.signTime = signTimeList[1];
                detailItem.shouldTime = signDetailItem.sureSigninTime;
                detailItem.status = signDetailItem.status;
                if (signDetailItem.signType == "1") {
                  detailItem.signType = "签到";
                } else {
                  detailItem.signType = "签退";
                }
                if (
                  signDetailItem.abnormalTime > 60 &&
                  signDetailItem.abnormalTime % 60 != 0
                ) {
                  errTime =
                    parseInt(signDetailItem.abnormalTime / 60) +
                    "小时" +
                    parseInt(signDetailItem.abnormalTime % 60) +
                    "分钟";
                } else if (
                  signDetailItem.abnormalTime > 60 &&
                  signDetailItem.abnormalTime % 60 == 0
                ) {
                  errTime =
                    parseInt(signDetailItem.abnormalTime / 60) + "小时";
                } else {
                  errTime = signDetailItem.abnormalTime + "分钟";
                  if (signDetailItem.abnormalTime == 0) {
                    errTime = "";
                  }
                };
                /**考勤状态描述处理，旷工和漏签需要额外判断 */
                let errContArr = [];
                detailItem.errorCont = "";
                if (signDetailItem.signTime){
                  if(signDetailItem.status !== "10" && signDetailItem.status !== "11"){
                    errContArr = _this.statusDesc[signDetailItem.status];
                    if(errContArr){
                      detailItem.errorCont = errContArr[0] + errTime + errContArr[1];
                    }
                  }
                }else{
                  if (signcItem.todaySignType == 0) {
                    if (icvo.checkIsAbsWork == 0) {
                      signDetailItem.status = "10";
                    } else if (!icvo.askOrOutWork) {
                      signDetailItem.status = "11";
                    } else {
                      signDetailItem.status = "1";
                    }
                    errContArr = _this.statusDesc[signDetailItem.status];
                    if(errContArr){
                      detailItem.errorCont = errContArr[0] + errTime + errContArr[1];
                    }
                  };
                }
                if(icvo.checkType == "0" && signcItem.elasticRule == "1" && signcItem.signCardType == 1){
                  /**是弹性考勤 */
                  if(signDetailItem.id && signDetailItem.status == "1"){
                    /**如果每个签到签退状态都正常，但总考勤状态异常则显示弹性工作时长不足 */
                    signItem.workHoursShort = true;
                  }
                }
                detailItem.signAddress = signDetailItem.signAddress;
                detailItem.id = j;
                signItem.isNoData = false;
                signItem.signDetail.push(detailItem);
              }
            }
            signItem.id = i + "parent";
            _this.signArr.push(signItem);
          }
          _this.infoIds = infoIdArr.join();
        } else {
          let signItem = {
            countTime: "",
            dateTitle: "",
            ruleName: "",
            signDetail: [],
            isNoData: true,
            id: "1"
          };
          signItem.dateTitle = _this.timeTitle;
          _this.signArr.push(signItem);
        }
      });
    },
    /**处理考勤明细*/
    handleSignDetailed(conditionVo, isRep){
      var csdList = conditionVo.csdList;
      this.isRepSign = false;//不能申诉考勤异常
      if(csdList && csdList.length > 0){
        var cdvo; //考勤统计记录和考勤明细信息
        var icvo; //考勤统计记录
        var sdList; //考勤明细信息
        var signDate; //考勤日期
        var detailevo; //考勤明细vo
        var signStatus; //考勤总状态
        var sdLen = csdList.length; //有几个考勤
        var hasSignException; //是否有考勤异常
        var hasRepSign; //是否有能申诉的
        var hasRep; //是否能申诉
        var refreshTime; //新考勤时间
        var refreshTimeMin; //新考勤时间分钟数
        var nowDateStr = conditionVo.nowDate.time; //当前时间
        var nowDate  = new Date(nowDateStr);
        var signDateDesc; //考勤时间
        var nextSignDateDesc; //考勤时间下一天
        var todaySignType; //当日考勤
        var beforeSignDateDesc; //考勤日期前一天
        var refreshTimeType; //新考勤时间类型
        var checkType; // 规则类型
        var isShowRepBtn=false; // 如果都是自由规则，隐藏申诉按钮
        var elasticRule; //是否启用弹性工作时长考勤（0：禁用；1：启用）
        var signCardType; //打卡方式(1:上下班均打卡;2:只需上班打卡;3:自由打卡)
        var elasticWorkHour; //弹性工作时长
        var hasElastic; //是否是弹性工作考勤
        var countTime; //总工作时长
        for(var i = 0; i < sdLen; i++){
          cdvo = csdList[i]; //考勤记录
          if(cdvo){ //有考勤记记录
            icvo = cdvo.icvo; //考勤记录
            if(icvo){ //考勤记录
              checkType = icvo.checkType ? icvo.checkType : 2; //规则类型（0：固定考勤；1：排班考勤；2：自由考勤）
              sdList = cdvo.sdList;
              signDate = icvo.signDate;
              signStatus = icvo.signStatus;
              signDateDesc = null;
              refreshTimeType = icvo.refreshTimeType;
              countTime = icvo.countTime ? icvo.countTime : 0;//工作时长
              signCardType = cdvo.signCardType;//打卡方式
              if(signDate){
                signDateDesc = signDate.replace("-", "/").replace("-", "/");
              }
              if(checkType !== "2") {
                isShowRepBtn = true;
              }
              hasSignException = false;//没有考勤或考勤是正常的或有考勤但是请假
              hasRepSign = false;//false：没有课申诉的签到/退；true：有课申诉的签到/退
              refreshTime = icvo.refreshTime; //考勤起始时间
              refreshTimeMin = icvo.refreshTimeMin; //考勤起始时间分钟数
              todaySignType = cdvo.todaySignType; //1：当日考勤；其他：不是当日考勤
              nextSignDateDesc = null; //考勤日期后一天
              beforeSignDateDesc = null; //考勤日期前一天
              if(0 != todaySignType && signDateDesc){
                nextSignDateDesc = getNextSignDate(signDateDesc);
                beforeSignDateDesc = getBeforeSignDate(signDateDesc);
              }
              elasticRule = cdvo.elasticRule; //是否启用弹性工作时长考勤（0：禁用；1：启用）
              signCardType = cdvo.signCardType; //打卡方式(1:上下班均打卡;2:只需上班打卡;3:自由打卡)
              elasticWorkHour = cdvo.elasticWorkHour; //弹性工作时长
              hasElastic = false; //不是弹性工作考勤
              if("0" == checkType && 1 == signCardType && "1" == elasticRule){ //0：固定考勤;1:上下班均打卡;1：启用弹性工作时长考勤
                hasElastic = true; //是弹性工作考勤
              }
              if(sdList && sdList.length > 0){
                var signTime; //考勤时间
                var isOk = true; //所有考勤明细状态都正常
                for(var j = 0; j < sdList.length; j++){
                  detailevo = sdList[j];
                  if("1" !== detailevo.status){
                    isOk = false; //所有考勤明细状态有一个或多个有异常
                  }
                  signTime = detailevo.signTime;
                  if(signTime){
                    signTime = detailevo.signTime.substring(11,16);
                    if("1" != detailevo.status && "10" != detailevo.status && "101" != detailevo.status && "102" != detailevo.status ){
                      hasRepSign = true;//有申诉的签到/退
                      hasSignException = true;//有考勤并且考勤异常（不包括请假）
                    }
                  }else{
                    signTime = detailevo.signinTime;
                    if(0 == todaySignType){ //不是今日考勤
                      hasSignException = true;//没有考勤，但是当前时间大于规则规定的考勤时间时，也可以申诉
                    }else{ //是今日考勤
                      hasRep = checkIsSignTimeRep(signDateDesc, refreshTimeMin, signTime, nowDate, nextSignDateDesc, refreshTimeType, beforeSignDateDesc);
                      if(hasRep){
                        hasSignException = true;//没有考勤，但是当前时间大于规则规定的考勤时间时，也可以申诉
                      }
                    }
                    hasRepSign = true;//没有考勤也可以申诉
                  }
                }
                if(hasElastic){ //是弹性工作考勤
                  if("2" == signStatus && isOk){ //若总考勤状态异常并且考勤明细状态都正常，那么是弹性工作时长不够
                    if(0 == todaySignType) { //不是今日考勤时，弹性工作时长不够才能申诉
                      hasRepSign = true;//弹性工作时长不够也可以申诉
                    }
                  }
                }
              }
              if(isShowRepBtn) {
                if(isRep && 1 == isRep){ //显示申诉按钮
                  if(0 != todaySignType){ //今天的考勤
                    if(hasSignException){ //可以申诉今天的考勤异常
                      this.isRepSign = true;//能申诉考勤异常
                    }
                  }else if(hasRepSign){ //可以申诉过去的考勤异常
                    this.isRepSign = true;//能申诉考勤异常
                  }
                }
              }
            }
          }
        }
      }
    },
    riliSwitch(direction) {
      /**切换日历*/
      var _this = this;
      var dateSource = _this.yearAndMonth.split("-");
      var y = dateSource[0];
      var m = dateSource[1];
      if (direction == "next") {
        //日历年月份
        m++;
        if (m > 12) {
          m = 1;
          y++;
        }
      } else {
        m--;
        if (m < 1) {
          m = 12;
          y--;
        }
      }
      _this.calendarTitle = y + "年" + m + "月";
      var month = m + "";
      if (month.length == 1) {
        month = "0" + m;
      }
        /*如果是之前的日期，请求接口数据渲染日历*/
        _this.getCalendarInfo(y + "-" + m);
        /*如果是当月详情数据自动跳转到今天*/
        if (m == _this.currentM && y == _this.currentY) {
          var strDay = _this.currentDay + "";
          if(strDay.length == 1){
            strDay = "0"+ strDay;
          }
          _this.autoDayItem.searchDate =
            _this.currentY + "-" + month + "-" + strDay;
          _this.autoDayItem.day = Number(_this.currentDay);
          _this.autoDayItem.showM = _this.currentM;
          _this.autoDayItem.week = new Date(
            _this.autoDayItem.searchDate
          ).getDay();
        } else {
          if (m < 10) {
            _this.autoDayItem.searchDate = y + "-" + "0" + m + "-" + "01";
          } else {
            _this.autoDayItem.searchDate = y + "-" + m + "-" + "01";
          }
          _this.autoDayItem.day = 1;
          _this.autoDayItem.showM = m;
          _this.autoDayItem.week = new Date(
            _this.autoDayItem.searchDate
          ).getDay();
        }
        _this.dayChecked(_this.autoDayItem);
    },
    changeOpen() {
      /**考勤明细是否收起展开 */
      this.openName = this.isOpenTotal ? "展开" : "收起";
      this.isOpenTotal = !this.isOpenTotal;
    },
    isDangqianDay(dayItem) {
      /**是否是当前日期 */
      var _this = this;
      var dqYearAndMonth = dayItem.yearAndMonth.split("-");
      if (
        dayItem.day == _this.isChecked &&
        _this.currentY == dqYearAndMonth[0] &&
        _this.currentM == dqYearAndMonth[1]
      ) {
        return "qwui-xuanzhong";
      }
    },
    isHasColor(dayItem,index) {
      /**如果存在颜色数组，返回颜色样式 */
      if (dayItem.color[0]) {
          if (dayItem.color.length == 1) {
            return {
              background: dayItem.color[0]
            };
          }else{
            return {
              background: dayItem.color[index],
              color: "#fff"
            };
          }
      } else {
        return {};
      }
    },
    isShowRankEnter() {
      /**验证是否显示排行榜入口 */
      var _this = this;
      _.ajax({
        url: _.baseURL + dataBase.statistics.getRankTopPermissionUrl,
        type: "post",
        data: {},
        success: function(result) {
          if (result.code == "0") {
            var data = result.data;
            var isGoldVip = data.isGoldVip;
            /*是否开启勤奋 */
            var isOpenDiligenceSetting = data.isOpenDiligenceSetting;
            dataBase.statistics.isOpenDiligenceSetting = isOpenDiligenceSetting;
            /*是否开启勤奋之总工时 */
            var diligentIsDisplay = data.diligentIsDisplay;
            dataBase.statistics.diligentIsDisplay = diligentIsDisplay;
            /*是否开启早到 */
            var isOpenEarlySetting = data.isOpenEarlySetting;
            dataBase.statistics.isOpenEarlySetting = isOpenEarlySetting;
            /*是否开启迟到 */
            var isOpenLaterSetting = data.isOpenLaterSetting;
            dataBase.statistics.isOpenLaterSetting = isOpenLaterSetting;
            var hasRank;
            if (isOpenDiligenceSetting || isOpenEarlySetting) {
              hasRank = true;
            }
            if (isGoldVip && hasRank) {
              _this.showRankEnter = true;
            }
          }
        }
      });
    },
    getCalendarInfo(yearMonth) {
      /**获取日历信息 */
      let _this = this;
      let msg = {
        yearMonth: yearMonth,
        userId: _this.userId
      };
      if (this.$route.query.rankItem) {
        let rankItem = this.$route.query.rankItem;
        _this.userId = rankItem.userId;
        _this.headPic = rankItem.headPic;
        _this.personName = rankItem.personName;
        _this.rankDepName = rankItem.rankDepName;
        this.$emit("closeTab", rankItem);
      }
      getWorkCalendarDetail(msg,function (result) {
        let conditionVo = result.conditionVo;
        /*初始化当前月*/
        if (!yearMonth) {
          let nowDateStr = conditionVo.nowDateStr;
          let nowDate = new Date(nowDateStr);
          _this.currentDay = nowDate.getDate();
          _this.currentM = nowDate.getMonth() + 1; //当月
          _this.currentY = nowDate.getFullYear(); //当年
          /*初次加载时自动加载考勤详情*/
          let month = _this.currentM + "";
          if(month.length == 1){
            month = "0" + month;
          }
          let strDay = _this.currentDay + "";
          if(strDay.length == 1){
            strDay = "0" + strDay;
          }
          _this.autoDayItem.searchDate =
            _this.currentY + "-" + month + "-" + strDay;
          _this.autoDayItem.day = Number(_this.currentDay);
          _this.autoDayItem.showM = _this.currentM;
          _this.autoDayItem.week = new Date(
            _this.autoDayItem.searchDate
          ).getDay();
          _this.dayChecked(_this.autoDayItem);
        }
        _this.signStatusOkNum = conditionVo.signStatusOkNum;
        _this.absWorkDate = conditionVo.absWorkDate;
        _this.lateNum = conditionVo.lateNum;
        _this.leaveNum = conditionVo.leaveNum;
        _this.outWorkNum = conditionVo.outWorkNum;
        _this.noSignNum = conditionVo.noSignNum;
        _this.handleMonthData(conditionVo);
      });
    },
    /*处理考勤月数据*/
    handleMonthData(conditionVo) {
      let _this = this;
      Array.prototype.remove = function(index) {
        if (isNaN(index) || index > this.length) {
          return false;
        }
        for (var i = 0, n = 0; i < this.length; i++) {
          if (this[i] != this[index]) {
            this[n++] = this[i];
          }
        }
        this.length -= 1;
      };
      var pageSignStatus2 = ",2,";
      var pageSignStatus3 = ",3,";
      var pageSignStatus4 = ",4,";
      var pageSignStatus5 = ",5,";
      var pageSignStatus6 = ",6,";
      var pageSignStatus7 = ",7,";
      var pageSignStatus8 = ",8,";
      var pageSignStatus9 = ",9,";
      var pageSignStatus10 = ",10,";
      var pageSignStatus11 = ",11,";
      var pageSignStatus12 = ",12,";
      var pageSignStatus13 = ",13,";
      var pageSignStatus15 = ",15,";
      var pageSignStatus16 = ",16,";
      var signDatas = {};
      var cList = conditionVo.cList;
      var nowDateStr = conditionVo.nowDateStr;
      signDatas["date"] = conditionVo.yearMonth;
      if (cList && cList.length > 0) {
        var zhengchangArr = []; //正常
        var kuanggongArr = []; //旷工
        var chidaoArr = []; //迟到
        var zaotuiArr = []; //早退
        var louqianArr = []; //漏签
        var qingjiaArr = []; //请假
        var waiqingArr = []; //外勤
        var feigongzuoArr = []; //非工作日考勤
        var qitayichangArr = []; //其他异常
        var signDataVo; //考勤信息
        var signStatus; //考勤明细状态
        var day; //考勤日（MM）
        for (var i = 0; i < cList.length; i++) {
          signDataVo = cList[i];
          signStatus = signDataVo.signStatus;
          day = signDataVo.day;
          if (!signStatus) {
            //状态不存在继续
            continue;
          }
          if ("0" == signStatus) {
            //旷工
            kuanggongArr.remove(day);
            kuanggongArr.push(day);
          } else if ("1" == signStatus) {
            //考勤正常
            zhengchangArr.remove(day);
            zhengchangArr.push(day);
          } else if ("14" == signStatus) {
            //非工作日考勤
            feigongzuoArr.remove(day);
            feigongzuoArr.push(day);
          } else {
            if (signStatus.indexOf(pageSignStatus2) > -1) {
              //迟到
              chidaoArr.remove(day);
              chidaoArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus3) > -1) {
              //早退
              zaotuiArr.remove(day);
              zaotuiArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus4) > -1) {
              //偏移位置迟到
              qitayichangArr.remove(day);
              qitayichangArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus5) > -1) {
              //偏移位置早退
              qitayichangArr.remove(day);
              qitayichangArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus6) > -1) {
              //偏移位置
              qitayichangArr.remove(day);
              qitayichangArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus7) > -1) {
              //ip异常迟到
              qitayichangArr.remove(day);
              qitayichangArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus8) > -1) {
              //ip异常早退
              qitayichangArr.remove(day);
              qitayichangArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus9) > -1) {
              //ip异常
              qitayichangArr.remove(day);
              qitayichangArr.push(day);
            }
            if (
              signStatus.indexOf(pageSignStatus10) > -1 ||
              signStatus.indexOf(pageSignStatus11) > -1 ||
              signStatus.indexOf(pageSignStatus12) > -1
            ) {
              //请假出差
              qingjiaArr.remove(day);
              qingjiaArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus15) > -1) {
              //漏签
              louqianArr.remove(day);
              louqianArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus16) > -1) {
              //弹性工作时长不够
              qitayichangArr.remove(day);
              qitayichangArr.push(day);
            }
            if (signStatus.indexOf(pageSignStatus13) > -1) {
              //外勤
              waiqingArr.remove(day);
              waiqingArr.push(day);
            }
          }
        }
      _this.askLeaveNum = qingjiaArr.length;
      _this.noWorkDayNum = feigongzuoArr.length;
      };
      signDatas["zhengchang"] = zhengchangArr;
      signDatas["kuanggong"] = kuanggongArr;
      signDatas["chidao"] = chidaoArr;
      signDatas["zaotui"] = zaotuiArr;
      signDatas["louqian"] = louqianArr;
      signDatas["qingjia"] = qingjiaArr;
      signDatas["waiqing"] = waiqingArr;
      signDatas["feigongzuo"] = feigongzuoArr;
      signDatas["qitayichang"] = qitayichangArr;
      this.becomeCalendar(signDatas);
    },
    becomeCalendar: function(dates) {
      var _this = this;
      var y, m;
      if (dates == undefined) {
        //如日期不存在则当做今天
        y = new Date().getFullYear();
        m = new Date().getMonth() + 1;
      } else {
        if (typeof dates != "object") {
          return;
        }
        var a = 0;
        for (var i = 0; i < _this.calendarDataArr.length; i++) {
          if (_this.calendarDataArr[i]["date"] == dates["date"]) {
            a++;
          }
        }
        if (!a) {
          /**如果没有缓存数据就push数据*/
          _this.calendarDataArr.push(dates);
        }
        y = dates["date"].split("-")[0];
        m = dates["date"].split("-")[1];
      }
      var month = m + "";
      if (month.length == 1) {
        month = "0" + m;
      }
      var sm = m;
      if (sm < 10) {
        sm = parseInt(sm);
      }
      _this.calendarTitle = y + "年" + sm + "月";
      _this.yearAndMonth = y + "-" + month;
      /**清空日历数组*/
      _this.calendarArr.splice(0);
      var day = new Date(y, m - 1).getDay(); //星期几
      var countDay = new Date(y, m, 0).getDate(); //一个月有多少天
      for (var i = 1, len = day + countDay + 1; i < len; i++) {
        var dayItem = {
          day: "",
          date: "",
          week: "",
          color: [],
          status: "",
          dayIndex: "",
          id: "",
          yearAndMonth: "",
          searchDate: "",
          showM: ""
        };
        dayItem.yearAndMonth = _this.yearAndMonth;
        dayItem.id = i;
        if (i > day) {
          var newDay = i - day;
          dayItem.day = newDay;
          var searchDay = newDay + "";
          if (searchDay.length == 1) {
            searchDay = "0" + newDay;
          }
          dayItem.searchDate = y + "-" + month + "-" + searchDay;
          dayItem.week = new Date(dayItem.searchDate).getDay(); //获取星期几
          dayItem.showM = sm;
          if (
            y == _this.currentY &&
            m == _this.currentM &&
            newDay == _this.currentDay
          ) {
            _this.isChecked = newDay; //获取被选中的日期
            _this.showDay = newDay;
            _this.showM = sm;
            _this.showWeek = dayItem.week;
          }
          /**处理日历项中的异常颜色并计算请假和非工作的次数 */
          const statusArr = ['zhengchang', 'qingjia','chidao','zaotui','kuanggong','louqian','waiqing','feigongzuo','qitayichang'];
          for(let j = 0; j < statusArr.length; j++) {
            if(dates[statusArr[j]]) {
              _this.getColor(dates[statusArr[j]],statusArr[j], newDay,dayItem);
            }
          }
        } else {
          dayItem.day = "";
        }
        _this.calendarArr.push(dayItem);
        _.hideLoading();
      }
    },
    timeColor(status){
      if(!status){
        return "normalStatus";
      }else{
        return "errorStatus";
      }
    },
    getColor(value,key, day,dayItem){
      for (let i = 0; i < value.length; i++) {
        if (day == value[i]) {
          dayItem.color.push(this.color_arr[key]);
        }
      }
    }
  }
};
</script>

<style scoped>
.qwui-riliBox {
  text-align: justify;
  background: #fff;
  height: 325px;
  border-bottom: 1px solid #e5e5e5;
}
.qwui-rili_top {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
}
.qwui-rili_prev {
  width: 50px;
  height: 50px;
  float: left;
  position: relative;
  cursor: pointer;
}
.qwui-rili_prev:active {
  background-color: #ececec;
}
.qwui-rili_prev::after {
  content: "";
  display: inline-block;
  -webkit-transform: rotate(-135deg);
  transform: rotate(-135deg);
  height: 8px;
  width: 8px;
  border-width: 2px 2px 0 0;
  border-color: #c8c8cd;
  border-style: solid;
  position: relative;
  top: -2px;
  top: -1px;
}
.qwui-rili_next {
  width: 50px;
  height: 50px;
  float: right;
  position: relative;
  cursor: pointer;
}
.qwui-rili_next::after {
  content: "";
  display: inline-block;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  height: 8px;
  width: 8px;
  border-width: 2px 2px 0 0;
  border-color: #c8c8cd;
  border-style: solid;
  position: relative;
  top: -2px;
  top: -1px;
}
.qwui-rili_next:active {
  background-color: #ececec;
}
.qwui-rili_top {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
}
.qwui-rili_h {
  display: flex;
  background: #f1f1f1;
  height: 35px;
  line-height: 35px;
}
.qwui-rili_h .qwui-day {
  flex: 1;
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
}
.qwui-rili_h,
.qwui-rili_c {
  font-size: 0;
}
.qwui-day {
  width: 14.28%;
  display: inline-block;
  text-align: center;
  height: 40px;
  color: #666;
  font-size: 15px;
  vertical-align: middle;
  position: relative;
}
.qwui-day > div {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 27px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  top: 7px;
  z-index: 1;
}
.qwui-day > div > div {
  position: absolute;
}
.qwui-xuanzhong::after {
  content: "";
  width: 5px;
  height: 5px;
  background: #87d45d;
  display: inline-block;
  border-radius: 50%;
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  margin: auto;
}
.qwui-rows {
  position: relative;
  font-size: 14px;
  margin-top: 10px;
  background: #fff;
}
.qwui-rows .qwui-row_title {
  padding: 10px 0 10px;
  margin-left: 15px;
  line-height: 16px;
}
.qwui-rows .qwui-row_title-l {
  float: left;
  padding-left: 25px;
  font-size: 16px;
  background: url("~assets/images/checkwork/ic_row_title.png") no-repeat;
  background-size: 18px 16px;
}
.qwui-rows .qwui-row_title-r {
  float: right;
  margin-right: 15px;
  font-size: 13px;
  color: #999;
}
.qwui-row_down,.qwui-row_up{
  position: relative;
  padding-right: 16px;
}
.qwui-rows .qwui-row_down::after {
  content: " ";
  position: absolute;
  top: 8px;
  right: 2px;
  display: inline-block;
  height: 6px;
  width: 6px;
  margin-top: -4px;
  border-width: 1px 1px 0 0;
  border-style: solid;
  -webkit-transform: rotate(135deg);
  transform: rotate(135deg);
}
.qwui-rows .qwui-row_up::after {
  content: " ";
  position: absolute;
  top: 11px;
  right: 2px;
  display: inline-block;
  height: 6px;
  width: 6px;
  margin-top: -4px;
  border-width: 1px 1px 0 0;
  border-style: solid;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.qwui-rows .row_title-2 {
  float: left;
  padding-left: 25px;
  font-size: 16px;
  line-height: 20px;
  background: url("~assets/images/checkwork/ic_checkwork_medal.png") no-repeat;
  background-size: 20px 20px;
}
.qwui-row_pd {
  position: relative;
  padding: 10px 15px 10px 0px;
  margin-left: 15px;
  background: #fff;
}
.qwui-row_pd::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
.qwui-kaoqinPs_item {
  display: inline-block;
  margin: 8px 20px 8px 0;
  line-height: 14px;
  white-space: nowrap;
}
.qwui-row_pd .qwui-icon_zc {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: #87d45d;
  border-radius: 50%;
  margin-right: 5px;
}
.qwui-kaoqinPs_box-l {
  float: left;
  margin-top: 9px;
}
.qwui-row_pd .qwui-icon_cd,
.qwui-row_pd .qwui-icon_lq,
.qwui-row_pd .qwui-icon_zt {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: #ff7979;
  border-radius: 50%;
  margin-right: 5px;
}
.qwui-row_pd .qwui-icon_fg {
  width: 10px;
  height: 10px;
  display: inline-block;
  background: #dfb18c;
  border-radius: 50%;
  margin-right: 5px;
}
.qwui-rowCenter {
  position: relative;
  padding: 10px 15px;
  margin-top: 10px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  background: #fff;
  border-top: 1px solid #e5e5e5;
}
.qwui-timeTitle {
  font-size: 16px;
}
.qwui-dayCheckCont {
  position: relative;
  font-size: 14px;
  margin-bottom: 10px;
  padding: 20px 15px;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  background: #fff;
}
.qwui-dayCheck {
  position: relative;
  background: #fff;
}
.qwui-dayCheck::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
.qwui-dayCheck::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.date-list-datebtn {
  float: right;
  display: inline;
  width: 20px;
  height: 20px;
  margin-right: 15px;
  background: url("~assets/images/checkwork/arrow_left.png") no-repeat left
    center;
  background-size: 10px;
  cursor: pointer;
  transform: rotate(180deg);
}
.rankItem {
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
  padding-left: 15px;
  background: #fff;
}
.rankItem img {
  float: left;
  margin: 12px 11px 12px 0;
  width: 40px;
  height: 40px;
}
.rankItemContent {
  overflow: hidden;
}
.rankUserName {
  margin: 11px 0 0 0;
  float: left;
  font-size: 15px;
  max-width: 200px;
}
.qwui-spanEllips {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.rankMemberDept {
  position: absolute;
  top: 35px;
  left: 65px;
  font-size: 12px;
  color: #999;
}
.qwui-ruleTitle {
  padding: 10px 0 5px 15px;
}
.wrap_new /deep/ .qwui-btn_box {
  z-index: 1;
}
.elasticHourShort {
  position: relative;
  padding: 15px;
  color: #e94f4f;
}
.elasticHourShort::before {
  content: " ";
  position: absolute;
  left: 15px;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #d9d9d9;
  color: #d9d9d9;
  -webkit-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  -ms-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.workHour_div {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  text-align: right;
  font-size: 16px;
  color: #999;
}
.errorStatus {
  color: #e94f4f;
}
.normalStatus {
  color: #467db9;
}
.colorLenTwo-one {
  top: 0;
  left: 0;
  width: 28px;
  height: 14px;
}
.colorLenTwo-two {
  bottom: 0;
  left: 0;
  width: 28px;
  height: 14px;
}
.colorSpan {
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
}
.colorLenThree-one {
  top: 0;
  left: 0;
  width: 14px;
  height: 28px;
}
.colorLenThree-two {
  top: 0;
  right: 0;
  width: 14px;
  height: 28px;
}
.colorLenThree-three {
  -webkit-transform: rotate(120deg);
  transform: rotate(120deg);
  left: 10px;
  top: -7px;
  width: 14px;
  height: 28px;
}
.colorLenThree-four {
  -webkit-transform: rotate(150deg);
  transform: rotate(150deg);
  left: 20px;
  top: 8px;
  width: 14px;
  height: 28px;
}
.colorLenFour-one {
  top: 0;
  left: 0;
  width: 14px;
  height: 28px;
}
.colorLenFour-two {
  top: 0;
  right: 0;
  width: 14px;
  height: 28px;
}
.colorLenFour-three {
  top: 50%;
  right: 50%;
  width: 14px;
  height: 28px;
}
.colorLenFour-four {
  top: 50%;
  right: 0;
  width: 14px;
  height: 28px;
}
.colorDayItem {
  color: #fff;
}
</style>

