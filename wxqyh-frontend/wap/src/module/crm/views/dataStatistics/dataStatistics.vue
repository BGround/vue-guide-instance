<template>
    <div class="wrapAll">
        <div class="advancedSearch">
            <advanced-search
                @search="search"
                @close="searchClose"
                @checkedRadio="checkedRadio"
                @reset="reset"
                :heading="heading"
                :setting="setting"
                :cache-search-value="cacheSearchValue"
                v-show="advancedShow">
            </advanced-search>
            <user-choose :closeAllTab="selectConfig.signIndex == 'depts'"
                         :closeGroup="selectConfig.signIndex == 'depts'"
                         :closeUser="selectConfig.signIndex == 'depts'"
                         :tabActive="selectConfig.signIndex == 'depts' ? 'dept' : 'group'"
                         :selectconfig="selectConfig"
                         v-if="selectConfig.show"></user-choose>
            <team-list-select
              :listData="teamListData"
              v-show="showTeamSelect"
              @confirm="confirmTeam"
              @cancel="cancelTeam"
              ref="teamSelect"
            ></team-list-select>
        </div>
        <div class="trend">
            <div class="trend-head wrap">
                <div class="trend-head-l">
                    <i class="others_arrow-l" @click="preNextBtn('pre')" v-show='preNextShow'></i>
                    <span class="times">{{boardCurrentTime}}</span>
                    <i class="others_arrow-r" @click="preNextBtn('next')" v-show='preNextShow'></i>
                </div>
                <div class="trend-head-r" @click="searchClose">
                    <div class="funel_search_wrap"><i class="icon"></i></div>
                </div>
            </div>
            <div class="trend-main">
                <p class="totalNum">{{contractDataCountVO.contractTotalCount}}</p>
                <div class="contractSumNum">合同总数
                    <i @click="contractNumTip">?
                        <div class="contractNum-tip" v-show="contractTip">根据合同的创建时间统计合同总数，根据合同的签约时间统计签约数。
                            <em></em>
                        </div>
                    </i>
                </div>
            </div>
            <div class="trend-sign">
                <div class="sign-item">
                    <div class="sign-num">{{contractDataCountVO.signContractCount}}</div>
                    <div class="sign-tip">签约数</div>
                </div>
                <div class="sign-item">
                    <div class="sign-num c666">{{contractDataCountVO.signContractRate}}%</div>
                    <div class="sign-tip">签约率</div>
                </div>
            </div>
            <div class="contract-image">
                <div class="concract-descript">
                    <div class="concract-descript-left">
                        合同回款情况（万元）
                    </div>
                    <div class="concract-descript-right">
                       <ul>
                           <li><span class="planBlue"></span>计划回款</li>
                           <li><span class="actualGreen"></span>实际回款</li>
                           <li><span class="contractGreen"></span>合同开票</li>
                       </ul>
                    </div>
                </div>
                <x-chart :id="chart" :option="highChartsOption" :func="func" ref="hightChart" v-show="hasHighChartsOption"></x-chart>
                <div class="no-chart-content" v-show="!hasHighChartsOption">
                    <no-chart :iconClass="iconClass"></no-chart>
                </div>
            </div>
            <div class="contract-table">
                <div class="table_container">
                    <table class="table">
                        <tr>
                            <th>时间</th>
                            <th>计划回款</th>
                            <th>实际回款</th>
                            <th>合同开票</th>
                        </tr>
                        <tr v-for="(item,index) in tableData" :key="index">
                            <td>{{item.stageName}}</td>
                            <td @click="goDetail(item,{key:'0',name:'计划'},index)">{{item.planRepay}}</td>
                            <td @click="goDetail(item,{key:'1',name:'实际'},index)">{{item.actualRepay}}</td>
                            <td @click="goDetail(item,{key:'2',name:'开票'},index)">{{item.billRepay}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>




    </div>
</template>
<script type="text/ecmascript-6">
import advancedSearch from "@/components/base/AdvancedSearch/index";
import userChoose from "@/components/base/user_or_dept_select";
import XChart from "../../../goal/views/highcharts";
import NoChart from "../../components/no-chart/no-chart";
import TeamListSelect from "../../components/TeamListSelect/TeamListSelect";
import {
  getContractRepayDetail,
  getSaleTeam
} from "../../api/dataStatistics/getData";

const nowYear = 0; //今年
const preYear = 1; //去年
const nowWeek = 2; //本周
const preWeek = 3; //上周
const diyRange = 4; //自定义范围
let range = nowYear; //选择时间范围
let timeSelectType = "year"; //日期选择范围类型
let unit = ""; //日期选择季度

const queryTypeMonth = 1; //单位月份
const queryTypeQuarter = 2; //单位季
const queryTypeDate = 3; //单位日期

const userId = window._.userId; //用户id
const localStorageName = `board_storage${userId}`; //本地缓存名字
let showOrhide = false; //上下切换隐藏

let dateStatus = 0;
let DIYdate = []; // DIYdate: 二维数组, DIYdate.length: 有多少列
{
  let YEAR = [],
    SEASON = [
      { text: "一季度", value: "1" },
      { text: "二季度", value: "2" },
      { text: "三季度", value: "3" },
      { text: "四季度", value: "4" }
    ];
  for (let i = 2000; i <= 2050; i++) {
    /*
        *   数组存放对象, 对象格式一定是：
        *   {
        *       text: xxx年  展示的文字,
        *       value: xxx   对应的值
        *   }
        *
        */
    YEAR.push({ text: i + "年", value: i });
  }
  DIYdate = [YEAR, SEASON];
}

let DIYdate1 = []; // DIYdate: 二维数组, DIYdate.length: 有多少列
{
  let YEAR1 = [],
    SEASON1 = [
      { text: "一月", value: "01" },
      { text: "二月", value: "02" },
      { text: "三月", value: "03" },
      { text: "四月", value: "04" },
      { text: "五月", value: "05" },
      { text: "六月", value: "06" },
      { text: "七月", value: "07" },
      { text: "八月", value: "08" },
      { text: "九月", value: "09" },
      { text: "十月", value: "10" },
      { text: "十一月", value: "11" },
      { text: "十二月", value: "12" }
    ];
  for (let i = 2000; i <= 2050; i++) {
    YEAR1.push({ text: i + "年", value: i });
  }
  DIYdate1 = [YEAR1, SEASON1];
}
// 高级搜索选人配置
let fakeSelectConfig = {
  show: false,
  signIndex: "users",
  selectList: {
    usersOrDepts: {
      // 选部门和选人
      title: "",
      selectType: "group",
      userSelected: [],
      deptSelected: [],
      callBack: {
        confirm: null
      }
    }
  }
};

export default {
  data() {
    return {
      preNextShow: true,
      heading: "自定义查询",
      selectConfig: fakeSelectConfig,
      setting: [
        {
          label: "所有者",
          key: "searchVO.owner",
          type: "radio",
          value: [
            { text: "我负责的", value: "1", callBack:this.clearTeam },
            { text: "我相关的", value: "2", callBack:this.clearTeam },
            { text: "我创建的", value: "3", callBack:this.clearTeam },
            { text: "部门/负责人", value: "5", relativeLabel: [2], callBack:this.clearTeam },
            { text: "销售团队", value: "4", relativeLabel: [3] }
          ]
        },
        {
          label: "",
          key: "searchVO.selectDepartment",
          type: "selectUserOrDepart",
          selectConfig: fakeSelectConfig,
          selectType: "usersOrDepts",
          show: false
        },
        {
          label: "",
          key: "searchVO.teamIds",
          type: "handle",
          callBack: this.handleClick,
          show: false
        },
        {
          label: "时间单位",
          key: "searchVO.queryType",
          type: "radio",
          value: [
            { text: "按月份", value: "1" },
            { text: "按季度", value: "2" },
            { text: "按日期", value: "3" }
          ]
        },
        {
          label: "时间范围",
          key: "searchVO.time",
          type: "radio",
          value: [
            { text: "今年", value: "0" },
            { text: "去年", value: "1" },
            { text: "自定义", value: "4", relativeLabel: [6] }
          ]
        },
        {
          label: "",
          key: ["searchValue.startTime", "searchValue.endTime"],
          type: "date",
          dateType: "DIY",
          show: false,
          dateValue: DIYdate1
        }
      ],
      cacheSearchValue: JSON.parse(sessionStorage.getItem("searchValue")) || {}, //高级搜索缓存
      advancedShow: false, //高级搜索隐藏
      chart: "chart", //柱形图DOM/id
      highChartsOption: {
        chart: {
          //图表类型
          type: "column",
          panning: true,
          pinchType: "x",
          resetZoomButton: {
            position: {
              // align: 'right', // by default
              // verticalAlign: 'top', // by default
              x: 1000,
              y: -30
            }
          }
        },
        credits: {
          //版权信息
          enabled: false
        },
        title: {
          //标题
          text: ""
        },
        xAxis: {
          //x轴
          type: "category",
          categories: [
            //X轴分类
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ],
          tickLength: 0
        },
        yAxis: [
          {
            min: 0,
            title: {
              text: ""
            }
          }
        ],
        legend: {
          //图例
          shadow: false,
          enabled: false
        },
        tooltip: {
          //数据提示框
          enabled: false,
          followTouchMove: false
        },
        plotOptions: {
          //数据列配置
          series: {
            states: {
              hover: {
                enabled: false
              }
            }
          }
        },
        series: [
          //数据列
          {
            name: "计划回款",
            color: "#4E7CCC",
            type: "column",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            pointWidth: 8,
            pointPadding: 0.1,
            borderWidth: 0,
            borderRadius: 4
          },
          {
            name: "实际回款",
            color: "#36B3C3",
            type: "column",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            pointWidth: 8,
            pointPadding: 0.1,
            borderWidth: 0,
            borderRadius: 4
          },
          {
            name: "合同开票",
            color: "#4ECDA5",
            type: "column",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            pointWidth: 8,
            pointPadding: 0.1,
            borderWidth: 0,
            borderRadius: 4
          }
        ]
      },
      hasHighChartsOption: false, //图表是否有数据，默认没有数据
      iconClass: "icon-three-column", //无数据图表样式
      func: c => {
        let len = this.highChartsOption.xAxis.categories.length;
        len = len >= 6 ? 5 : len - 2;
        c.xAxis[0].setExtremes(0, len);
      },
      contractTip: false, //默认合同总数贴士隐藏
      boardSearchData: {
        //传到后台的搜索参数
        "searchVO.owner": 1,
        "searchVO.startTime": "",
        "searchVO.endTime": "",
        "searchVO.queryType": queryTypeMonth,
        "searchVO.userIds": "",
        "searchVO.deptIds": "",
        "searchVO.teamIds": ""
      },
      boardCurrentTime: "2018年",
      contractDataCountVO: {}, //柱形图数据
      tableData: [], // 表格数据
      showTeamSelect: false,
      teamListData: [],
      needClearTeam: false,
      firstTeamIds: ""//保存初始化页面时传递过来的销售团队Id
    };
  },
  created() {
    if (this.$route.query.teamOrPerson == "team") {
      this.cacheSearchValue["searchVO.owner"] = "4";
      this.firstTeamIds = this.$route.query.teamIds;
      this.boardSearchData["searchVO.owner"] = "4";
      this.boardSearchData["searchVO.teamIds"] = this.firstTeamIds;
    }
    showOrhide = false
    range = 0
    this.$set(this.setting[5], "show", false);

  },

  mounted() {
    this.initTime(nowYear);
    this.settingData(this.$route.query.queryType)
    this.getInfo();
    this.getTeamList();
  },
  methods: {
    // 根据首页传过来的queryType来改变setting的初始值
    settingData(val){
      switch(val){
          case 'query_by_month':
            // 设置发往后端的表单项的值和 高级搜索 面板的选中值
            this.$set(this.boardSearchData,'searchVO.queryType', '1')
            this.$set(this.cacheSearchValue,'searchVO.queryType', '1')
            this.$set(this.cacheSearchValue,'searchVO.time', '0')
            var searchTimeType = {
              // 当选择为【今年】时，将搜索时间设置为今年，并将 时间 上下 选择器改为年的跨度
              'year':  ()=>{ this.getDataYear();timeSelectType='year'; },
              // 当选择为【本月】时，将搜索时间设置为本月，并将 时间 上下 选择器改为月的跨度
              'month': ()=>{ this.getDataYearMonth();timeSelectType='month'; },
              'lastMonth':  ()=>{ this.getDataYearMonth(null,'pre');timeSelectType='month'; },
            }
            searchTimeType[this.$route.query.searchTimeType]();

            this.$set(this.setting,5,
            {
                label: '',
                key: ['searchVO.startTime', 'searchVO.endTime'],
                type: 'date',
                dateType: 'DIY',
                show:false,
                dateValue: DIYdate1
            })
            break;
          case 'query_by_season':
            // 设置发往后端的表单项的值和 高级搜索 面板的选中值
            this.$set(this.boardSearchData,'searchVO.queryType', '1')
            this.$set(this.cacheSearchValue,'searchVO.queryType', '1')
            this.$set(this.cacheSearchValue,'searchVO.time', '0')
            // 当选择为【本季】时，将搜索时间设置为本季
            this.getDataYearQuarter();
            // 时间 上下 选择器跨度改为季的跨度
            timeSelectType = 'quarter'
            this.$set(this.setting,5,
            {
                label: '',
                key: ['searchVO.startTime', 'searchVO.endTime'],
                type: 'date',
                dateType: 'DIY',
                show:false,
                dateValue: DIYdate
            })
            break;
          case 'query_by_day':
            var searchTimeType = this.$route.query.searchTimeType == 'lastWeek' ? '3' : '2';
            // 设置发往后端的表单项的值和 高级搜索 面板的选中值
            this.$set(this.boardSearchData,'searchVO.queryType', '3')
            this.$set(this.cacheSearchValue,'searchVO.queryType', '3')
            this.$set(this.cacheSearchValue,'searchVO.time', searchTimeType)
            // 根据路由query属性对应的值判断上周或本周
            this.getDataWeek( searchTimeType == 3 ? 'pre' : '' );
            timeSelectType = 'date'
            this.$set(this.setting[4],'value',
            [
                { text: '本周', value: '2'},
                { text: '上周', value: '3'},
                { text: '自定义', value: '4',relativeLabel: [6]}
            ])
            this.$set(this.setting,5,
            {
                label: '',
                key: ['searchVO.startTime', 'searchVO.endTime'],
                type: 'date',
                format: 'YYYY-MM-DD', //用来控制日期展示的格式以及返回的数据格式
                show:false,
            })
            break;
      }
    },

    // 初始化页面传参的参数，获取缓存等
    init() {
      //获取本地缓存
      let board_storage = JSON.parse(localStorage.getItem(localStorageName));
      if (board_storage) {
        this.boardSearchData = {
          "searchVO.owner": board_storage["searchVO.owner"],
          "searchVO.startTime": board_storage["searchVO.startTime"],
          "searchVO.endTime": board_storage["searchVO.endTime"],
          "searchVO.queryType": board_storage["searchVO.queryType"],
          "searchVO.userIds": board_storage["searchVO.userIds"],
          "searchVO.deptIds": board_storage["searchVO.deptIds"],
          "searchVO.teamIds": board_storage["searchVO.teamIds"]
        };
        this.boardCurrentTime = board_storage[boardCurrentTime];
      } else {
        //添加缓存
        localStorage.setItem(
          localStorageName,
          JSON.stringify(this.boardSearchData)
        );
        localStorage.setItem(
          localStorageName[boardCurrentTime],
          this.boardCurrentTime
        );
      }
    },
    //初始化头部时间和高级搜索时间
    initTime(timeType) {
      // if(timeType==nowMonth){//本月
      //     timeSelectType='month'
      //     this.getDataYearMonth()
      // }else if(timeType==preMonth){//上个月
      //     timeSelectType='month'
      //     this.getDataYearMonth(this.$route.query.startTime,'pre')
      // }else if(timeType==nowQuarter){//本季
      //     timeSelectType='quarter'
      //     this.getDataYearQuarter()
      // }else if(timeType==nowYear){//今年
      timeSelectType = "year";
      this.getDataYear();
      // }
    },
    //切换所有者时，初始化销售团队信息
    clearTeam(){
      this.firstTeamIds = "";
      this.boardSearchData["searchVO.teamIds"] = "";
      this.$set(this.setting[2], "label", "");
      this.$refs.teamSelect.clearSelected();
    },
    // 单选按钮回调事件
    checkedRadio(index, key, value) {
      this.boardSearchData["searchVO.startTime"]=''
      this.boardSearchData["searchVO.endTime"]=''
      // 选择时间单位
      if (key == this.setting[3].key) {
        let settingValue = [];
        let dateData = {};
        if (index == "2") {
          //按日期,显示本周
          settingValue = [
            { text: "本周", value: "2" },
            { text: "上周", value: "3" },
            { text: "自定义", value: "4", relativeLabel: [6] }
          ];
          if (range == nowYear) {
            range = nowWeek;
          } else if (range == preYear) {
            range = preWeek;
          }
        } else {
          settingValue = [
            { text: "今年", value: "0" },
            { text: "去年", value: "1" },
            { text: "自定义", value: "4", relativeLabel: [6] }
          ];
          if (range == nowWeek || range == nowYear) {
            range = nowYear;
          } else if (range == preWeek || range == preYear) {
            range = preYear;
          }
        }

        if (index == "1") {
          //按季度，显示季度时间控件
          dateData = {
            label: "",
            key: ["searchValue.startTime", "searchValue.endTime"],
            type: "date",
            dateType: "DIY",
            show: showOrhide,
            dateValue: DIYdate
          };
          timeSelectType = "year";
          unit = "quarterUnit";
        } else if (index == "2") {
          //按日期
          dateData = {
            label: "",
            key: ["searchValue.startTime", "searchValue.endTime"],
            type: "date",
            show: showOrhide,
            format: "YYYY-MM-DD" //用来控制日期展示的格式以及返回的数据格式
          };
          timeSelectType = "date";
          unit = "dateUnit";
        } else {
          dateData = {
            //按月份
            label: "",
            key: ["searchValue.startTime", "searchValue.endTime"],
            type: "date",
            dateType: "DIY",
            show: showOrhide,
            dateValue: DIYdate1
          };
          timeSelectType = "year";
          unit = "monthUnit";
        }
        this.$set(this.setting[4], "value", settingValue);
        this.$set(this.setting, 5, dateData);
        this.cacheSearchValue["searchValue.startTime"]=''
        this.cacheSearchValue["searchValue.endTime"]=''
      }
      // 选择时间范围
      if (key == this.setting[4].key) {

        if (value == "4") {
          //点击自定义
          showOrhide = true;
          this.preNextShow = false;
        } else {
          showOrhide = false;
          this.preNextShow = true;
          this.$set(this.cacheSearchValue, "searchValue.startTime", '');
          this.$set(this.cacheSearchValue, "searchValue.endTime", '');
        }
        this.$set(this.setting[5], "show", showOrhide);
        switch (value) {
          case "0": //今年
            range = nowYear;
            break;
          case "1": //去年
            range = preYear;
            break;
          case "2": //本周
            range = nowWeek;
            break;
          case "3": //上周
            range = preWeek;
            break;
          case "4": //自定义
            range = diyRange;
        }
      }
    },
    // 关闭高级搜索
    searchClose() {
      this.advancedShow = !this.advancedShow;
    },
    //重置高级搜索
    reset() {
      let settingValue = [
        { text: "今年", value: "0" },
        { text: "去年", value: "1" },
        { text: "自定义", value: "4", relativeLabel: [6] }
      ];
      showOrhide = false
      let dateData = {
        //按月份
        label: "",
        key: ["searchValue.startTime", "searchValue.endTime"],
        type: "date",
        dateType: "DIY",
        show: showOrhide,
        dateValue: DIYdate1
      };
      timeSelectType = "year";
      range = nowYear;
      this.$set(this.setting[4], "value", settingValue);
      this.$set(this.setting, 5, dateData);
      this.$set(this.setting[2], "label", "");
      this.initTime(nowYear);
      this.$refs.teamSelect.clearSelected();
      this.boardSearchData["searchVO.teamIds"] = "";
      this.firstTeamIds = "";
    },
    // 点击高级搜索确定按钮
    search(searchValue) {
      // 调整开始时间和结束时间
      switch (range) {
        case nowYear: //今年
          this.getDataYear();
          break;
        case preYear: //去年
          this.getDataYear("", "pre");
          break;
        case nowWeek: //本周
          this.getDataWeek();
          break;
        case preWeek: //上周
          this.getDataWeek();
          this.getDataWeek("pre");
          break;
      }

      let startGetTime = new Date(
        searchValue["searchValue.startTime"]
      ).getTime();
      let endGetTime = new Date(searchValue["searchValue.endTime"]).getTime();
      if (range == diyRange && !startGetTime) {
        _.alert("提示", "请填写开始时间");
        this.advancedShow=true
        return;
      }
      if (range == diyRange && !endGetTime) {
        _.alert("提示", "请填写结束时间");
        this.advancedShow=true
        return;
      }
      if (startGetTime > endGetTime) {
        _.alert("提示", "开始时间大于结束时间");
        this.advancedShow=true
        return;
      }

      // 截取选人和选部门数据
      let userIdsStr = "";
      let deptIdsStr = "";
      if (searchValue["searchVO.selectDepartment"]) {
        searchValue["searchVO.selectDepartment"].users.forEach(function(item) {
          userIdsStr += item.userId + ",";
        });
        searchValue["searchVO.selectDepartment"].depts.forEach(function(item) {
          deptIdsStr += item.id + ",";
        });
      }
      this.boardSearchData["searchVO.owner"] =
        searchValue["searchVO.owner"] || 1;
      this.boardSearchData["searchVO.startTime"] =
        searchValue["searchValue.startTime"] ||
        this.boardSearchData["searchVO.startTime"];
      this.boardSearchData["searchVO.endTime"] =
        searchValue["searchValue.endTime"] ||
        this.boardSearchData["searchVO.endTime"];
      this.boardSearchData["searchVO.queryType"] =
        searchValue["searchVO.queryType"] || queryTypeMonth;
      this.boardSearchData["searchVO.userIds"] = userIdsStr;
      this.boardSearchData["searchVO.deptIds"] = deptIdsStr;

      let startText = this.boardSearchData["searchVO.startTime"].split("-");
      let endText = this.boardSearchData["searchVO.endTime"].split("-");
      if (range == diyRange) {
        //自定义
        if (startText[2] && endText[2]) {
          //日期
          this.boardCurrentTime = `${startText[0]}年${startText[1]}月${
            startText[2]
          }日-${endText[0]}年${endText[1]}月${startText[2]}日`;
        } else if (unit == "quarterUnit") {
          this.boardCurrentTime = `${startText[0]}年${startText[1]}季度-${
            endText[0]
          }年${endText[1]}季度`;
        } else {
          this.boardCurrentTime = `${startText[0]}年${startText[1]}月-${
            endText[0]
          }年${endText[1]}月`;
        }
      }
      if(searchValue["searchVO.owner"] == '5'){
        if(this.boardSearchData["searchVO.userIds"] == '' && this.boardSearchData["searchVO.deptIds"] == ''){
          _.alert("提示", "部门/负责人不能为空");
          this.advancedShow=true
          return;
        }
      }
      if(searchValue["searchVO.owner"] == '4' && this.boardSearchData["searchVO.teamIds"] == ''){
        _.alert("提示", "销售团队不能为空");
        this.advancedShow=true
        return;
      }
      this.getInfo();
    },
    //切换合同总数贴士
    contractNumTip() {
      this.contractTip = !this.contractTip;
    },
    //上下一年/季度/月
    preNextBtn(type) {
      if (range == diyRange) {
        //自定义
        switch (timeSelectType) {
          case "year":
            this.getDataDiyMonth(type);
            break;
          case "quarter":
            this.getDataDiyQuarter(type);
            break;
          case "date":
            this.getDataDiyDate(type);
            break;
        }
      } else {
        switch (timeSelectType) {
          case "month":
            this.getDataYearMonth(
              this.boardSearchData["searchVO.startTime"],
              type
            );
            break;
          case "quarter":
            let startEndTime = this.boardSearchData["searchVO.startTime"];
            if (type == "next") {
              startEndTime = this.boardSearchData["searchVO.endTime"];
            }
            this.getDataYearQuarter(startEndTime, type);
            break;
          case "year":
            this.getDataYear(this.boardSearchData["searchVO.startTime"], type);
            break;
          case "date":
            this.getDataWeek(type);
            break;
        }
      }
      this.getInfo();
    },
    // 渲染合同回款详情
    getInfo() {
      // if (unit == "quarterUnit" && range !== diyRange) {
      //   this.boardSearchData["searchVO.startTime"] = this.getQuarterDate(
      //     this.boardSearchData["searchVO.startTime"]
      //   );
      //   this.boardSearchData["searchVO.endTime"] = this.getQuarterDate(
      //     this.boardSearchData["searchVO.endTime"]
      //   );
      //   this.boardSearchData["searchVO.queryType"] = "2";
      // }
      this.hasHighChartsOption = false;
      // 请求数据
      getContractRepayDetail(this.boardSearchData, result => {
        this.contractDataCountVO = Object.assign(
          {},
          this.contractDataCountVO,
          result.receiveDetailVO
        );

        if (this.contractDataCountVO.signContractRate > 100) {
          this.$set(this.contractDataCountVO, "signContractRate", "--");
        }
        this.tableData = this.contractDataCountVO.stageVOs;

        //遍历图表数据，赋值
        // 判断只要有一个数据大于0，则有数据；否则显示无数据图片
        this.contractDataCountVO.series.forEach((item, index) => {
          this.highChartsOption.series[index].data = item.data;
          item.data.forEach(i => {
            if (i && i > 0) {
              this.hasHighChartsOption = true;
            }
          });
        });

        this.$set(
          this.highChartsOption.xAxis,
          "categories",
          result.receiveDetailVO.categories
        );
        this.$refs.hightChart.inintChart();
      });
    },
    //获取销售团队
    getTeamList() {
      let data = { pageSize: 50 };
      getSaleTeam(data).then(res => {
        if (res.code === "0") {
          if (res.data.totalRows != "0") {
            let teamData = res.data.pageData;
            teamData.map(item => {
              let obj = {
                id: item.id,
                firstTitle: item.teamName,
                secondTitle: item.teamMemberNum,
                isSelect: item.id === this.firstTeamIds ? true : false
              };
              if (this.needClearTeam) {
                obj["isSelect"] = false;
              }
              if (this.firstTeamIds && item.id === this.firstTeamIds) {
                this.setting[2].label = item.teamName;
              }
              this.teamListData.push(obj);
            });
          }
          this.needClearTeam = false;
        } else {
          _.alert("提示", res.desc);
        }
      });
    },
    //选择销售团队
    handleClick() {
      this.showTeamSelect = true;
    },
    // 高级搜索——销售团队点击确定
    confirmTeam(ids, selectData) {
      let selectDataName = "";
      let selectDataId = "";
      let arr_name = [];
      let arr_id = [];
      selectData.forEach((item, index) => {
        arr_name.push(item.firstTitle);
        arr_id.push(item.id);
      });
      this.teamSelectData = selectData;
      selectDataName = arr_name.join(",");
      this.boardSearchData["searchVO.teamIds"] = arr_id.join(",");
      // 赋值给团队选择input框
      this.setting[2].label = selectDataName;
      this.showTeamSelect = false;
    },
    cancelTeam() {
      this.showTeamSelect = false;
    },
    //事件后正确的年月
    getCurrentYearMonth(date, status) {
      let current = {
        currentYear: 2018,
        currentMonth: 6
      };
      let currentTime = "";
      date ? (currentTime = new Date(date)) : (currentTime = new Date());
      current.currentMonth = currentTime.getMonth() + 1;
      current.currentYear = currentTime.getFullYear();

      if (status == "pre") {
        //上个月
        current.currentMonth--;
        if (current.currentMonth < 1) {
          current.currentYear--;
          current.currentMonth = 12;
        }
      } else if (status == "next") {
        //下个月
        current.currentMonth++;
        if (current.currentMonth > 12) {
          current.currentYear++;
          current.currentMonth = 1;
        }
      }
      return current;
    },
    //获取年月
    getDataYearMonth(date, status) {
      let current = this.getCurrentYearMonth(date, status);
      current.currentMonth = current.currentMonth < 10 ? '0' + current.currentMonth : current.currentMonth;
      let resultTime = `${current.currentYear}-${current.currentMonth}`;
      this.boardSearchData["searchVO.startTime"] = resultTime;
      this.boardSearchData["searchVO.endTime"] = resultTime;
      this.boardCurrentTime = `${current.currentYear}年${
        current.currentMonth
      }月`;
      // this.setLocalStorage()
    },

    //获取年季
    getDataYearQuarter(date, status) {
      let current = this.getCurrentYearMonth(date, status);
      let quarter = this.getQuarterStartEndMonth(current.currentMonth);
      this.boardSearchData["searchVO.startTime"] = `${current.currentYear}-${
        quarter.quarterStartMonth
      }`;
      this.boardSearchData["searchVO.endTime"] = `${current.currentYear}-${
        quarter.quarterEndMonth
      }`;
      this.boardCurrentTime = `${current.currentYear}年${
        quarter.quarterStartMonth
      }月-${current.currentYear}年${quarter.quarterEndMonth}月`;
      // this.setLocalStorage()
    },

    //获取季度开始和结束的月份
    getQuarterStartEndMonth(nowMonth) {
      let quarter = {
        quarterStartMonth: '01',
        quarterEndMonth: '03'
      };
      if (3 < nowMonth && nowMonth < 7) {
        //第二季度4-6
        quarter.quarterStartMonth = '04';
        quarter.quarterEndMonth = '06';
      } else if (6 < nowMonth && nowMonth < 10) {
        //第三季度7-9
        quarter.quarterStartMonth = '07';
        quarter.quarterEndMonth = '09';
      } else if (9 < nowMonth && nowMonth < 13) {
        //第四季度10-12
        quarter.quarterStartMonth = '10';
        quarter.quarterEndMonth = '12';
      }
      return quarter;
    },

    //获取季度开始和结束的时间转换
    getQuarterDate(dateStr) {
      let dateStrArray = dateStr.split("-");
      let quarterStr = null;
      if (0 < dateStrArray[1] && dateStrArray[1] < 4) {
        quarterStr = 1;
      } else if (3 < dateStrArray[1] && dateStrArray[1] < 7) {
        //第二季度4-6
        quarterStr = 2;
      } else if (6 < dateStrArray[1] && dateStrArray[1] < 10) {
        //第三季度7-9
        quarterStr = 3;
      } else if (9 < dateStrArray[1] && dateStrArray[1] < 13) {
        //第四季度10-12
        quarterStr = 4;
      }
      let result = dateStrArray[0] + "-" + quarterStr;
      return result;
    },

    //获取年份
    getDataYear(date, status) {
      let currentTime = "";
      date ? (currentTime = new Date(date)) : (currentTime = new Date());
      let currentYear = currentTime.getFullYear();

      if (status == "pre") {
        //上年
        currentYear--;
      } else if (status == "next") {
        //下年
        currentYear++;
      }

      this.boardSearchData["searchVO.startTime"] = `${currentYear}-01`;
      this.boardSearchData["searchVO.endTime"] = `${currentYear}-12`;
      this.boardCurrentTime = `${currentYear}年`;
      // this.setLocalStorage()
    },
    //获取上下diy月份
    getDataDiyMonth(type) {
      let rangeTime = "";
      let year = "";
      let month = "";
      let startTime = new Date(
        `${this.boardSearchData["searchVO.startTime"]}-15`
      ).getTime();
      let endTime = new Date(
        `${this.boardSearchData["searchVO.endTime"]}-15`
      ).getTime();
      let startYear = new Date(startTime).getFullYear();
      let startMonth = new Date(startTime).getMonth() + 1;
      let endYear = new Date(endTime).getFullYear();
      let endMonth = new Date(endTime).getMonth() + 1;
      if (type == "pre") {
        rangeTime = endTime - startTime;
        year = new Date(startTime - rangeTime).getFullYear();
        month = new Date(startTime - rangeTime).getMonth() + 1;
        this.boardSearchData["searchVO.startTime"] = `${year}-${month}`;
        this.boardSearchData["searchVO.endTime"] = `${startYear}-${startMonth}`;
        this.boardCurrentTime = `${year}年${month}月-${startYear}年${startMonth}月`;
      } else {
        rangeTime = endTime - startTime;
        year = new Date(endTime + rangeTime).getFullYear();
        month = new Date(endTime + rangeTime).getMonth() + 1;
        this.boardSearchData["searchVO.startTime"] = `${endYear}-${endMonth}`;
        this.boardSearchData["searchVO.endTime"] = `${year}-${month}`;
        this.boardCurrentTime = `${endYear}年${endMonth}月-${year}年${month}月`;
      }
    },

    getDataDiyQuarter(type) {
      let rangeYear = 0;
      let rangequ = 0;
      let startTime = this.boardSearchData["searchVO.startTime"].split("-");
      let endTime = this.boardSearchData["searchVO.endTime"].split("-");

      if (type == "pre") {
        rangequ = endTime[1] - Math.abs(endTime[1] - startTime[1]);
        if (endTime[0] - startTime[0] > 0) {
          rangeYear = endTime[0] - startTime[0];
        }
        if (rangequ < 0) {
          rangeYear--;
          rangequ += 4;
        }
        this.boardSearchData["searchVO.startTime"] = `${startTime[0] -
          rangeYear}-${rangequ}`;
        this.boardSearchData["searchVO.endTime"] = `${startTime[0]}-${
          startTime[1]
        }`;
        this.boardCurrentTime = `${startTime[0] - rangeYear}年${rangequ}季度-${
          startTime[0]
        }年${startTime[1]}季度`;
      } else {
        rangequ =
          Number(endTime[1]) + Number(Math.abs(endTime[1] - startTime[1]));
        rangeYear = endTime[0] - startTime[0];
        if (rangeYear && rangequ > 4) {
          rangeYear--;
        }
        if (rangequ > 4) {
          rangeYear++;
          rangequ = rangequ - 4;
          rangequ ? rangequ : (rangequ = 4);
        }
        this.boardSearchData["searchVO.startTime"] = `${endTime[0]}-${
          endTime[1]
        }`;
        this.boardSearchData["searchVO.endTime"] = `${Number(endTime[0]) +
          Number(rangeYear)}-${rangequ}`;
        this.boardCurrentTime = `${endTime[0]}年${endTime[1]}季度-${Number(
          endTime[0]
        ) + Number(rangeYear)}年${rangequ}季度`;
      }
    },
    // 计算周日期 type: start获取周一的日期 end获取周日的日期 dates: -1上周 0本周 1下周
    getWeek(type, dates) {
      var now = new Date();
      var nowTime = now.getTime();
      var day = now.getDay();
      var longTime = 24 * 60 * 60 * 1000;
      var n = longTime * 7 * (dates || 0);
      if (type == "start") {
        var dd = nowTime - (day - 1) * longTime + n;
      }
      if (type == "end") {
        var dd = nowTime + (7 - day) * longTime + n;
      }
      dd = new Date(dd);
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;
      var d = dd.getDate();
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      var day = y + "-" + m + "-" + d;
      return day;
    },

    // 获取周
    getDataWeek(status) {
      let startDate = "",
        endDate = "";
      if (status == "pre") {
        dateStatus--;
        startDate = this.getWeek("start", dateStatus);
        endDate = this.getWeek("end", dateStatus);
      } else if (status == "next") {
        dateStatus++;
        startDate = this.getWeek("start", dateStatus);
        endDate = this.getWeek("end", dateStatus);
      } else {
        dateStatus = 0;
        startDate = this.getWeek("start", dateStatus);
        endDate = this.getWeek("end", dateStatus);
      }

      this.boardSearchData["searchVO.startTime"] = startDate;
      this.boardSearchData["searchVO.endTime"] = endDate;
      this.boardCurrentTime =
        startDate.split("-")[0] +
        "年" +
        startDate.split("-")[1] +
        "月" +
        startDate.split("-")[2] +
        "日-" +
        endDate.split("-")[0] +
        "年" +
        endDate.split("-")[1] +
        "月" +
        endDate.split("-")[2] +
        "日";
    },
    //设置缓存
    setLocalStorage() {
      localStorage.setItem(
        localStorageName["searchVO.startTime"],
        this.boardSearchData["searchVO.startTime"]
      );
      localStorage.setItem(
        localStorageName["searchVO.endTime"],
        this.boardSearchData["searchVO.endTime"]
      );
      localStorage.setItem(
        localStorageName["boardCurrentTime"],
        this.boardCurrentTime
      );
    },
    getTimeFormat(data, index) {
      let startYear = this.boardSearchData["searchVO.startTime"].split("-")[0];
      let endYear = this.boardSearchData["searchVO.endTime"].split("-")[0];
      let year;
      let month;
      let startTime;
      let endTime;
      switch (this.boardSearchData["searchVO.queryType"]) {
        //按月份搜索
        case 1:
          if (index + 1 > 12) {
            year =
              (index + 1) % 12 == 0
                ? startYear - 0 + Math.floor((index + 1) / 12) - 1
                : startYear - 0 + Math.floor((index + 1) / 12);
            month = (index + 1) % 12 == 0 ? 12 : (index + 1) % 12;
            month = month - 10 >= 0 ? month : "0" + month;
          } else {
            year = startYear;
            month = index + 1 - 10 >= 0 ? index + 1 : "0" + (1 + index);
          }
          startTime = year + "-" + month;
          endTime = year + "-" + month;
          break;
        //按季度搜索
        case "2":
          if (index > 4) {
            year =
              (index + 1) % 4 == 0
                ? startYear - 0 + Math.floor((index + 1) / 4) - 1
                : startYear - 0 + Math.floor((index + 1) / 4);
          } else {
            year = startYear;
          }
          if ((index + 1) % 4 == 1) {
            startTime = year + "-" + "01";
            endTime = year + "-" + "03";
          } else if ((index + 1) % 4 == 2) {
            startTime = year + "-" + "04";
            endTime = year + "-" + "06";
          } else if ((index + 1) % 4 == 3) {
            startTime = year + "-" + "07";
            endTime = year + "-" + "09";
          } else if ((index + 1) % 4 == 0) {
            startTime = year + "-" + "10";
            endTime = year + "-" + "12";
          }
          break;
        //按日期搜索
        case "3":
          let startMonth = this.boardSearchData["searchVO.startTime"].split(
            "-"
          )[1];
          month = data.stageName.split("月")[0];
          if (month - 0 < startMonth - 0 && index + 1 < 365) {
            year = startYear - 0 + 1;
          } else if (index + 1 > 365) {
            year =
              (index + 1) % 365 == 0
                ? startYear - 0 + Math.floor((index + 1) / 365) - 1
                : startYear - 0 + Math.floor((index + 1) / 365);
          } else {
            year = startYear;
          }
          let date = data.stageName.split("月")[1].split("日")[0];
          startTime = year + "-" + month + "-" + date;
          endTime = year + "-" + month + "-" + date;
      }
      this.boardSearchData["searchVO.startTime"] = startTime;
      this.boardSearchData["searchVO.endTime"] = endTime;
    },
    //跳转合同明细
    goDetail(data, type, index) {
      this.getTimeFormat(data, index);
      this.boardSearchData["searchVO.stepType"] = type.key;
      data.type = type;
      localStorage.setItem(
        "receiveRouter",
        JSON.stringify({ monyDetial: data, searchValue: this.boardSearchData })
      );
      showOrhide = false
      range = 0
      this.$set(this.setting[5], "show", false);
      this.$router.push({
        path: "/dataStatisticsDetails",
        query: {}
      });
    }
  },

  components: {
    XChart,
    advancedSearch,
    userChoose,
    NoChart,
    TeamListSelect
  }
};
</script>
<style lang="scss" scoped>
@import "../../crmBase.scss";

.trend-head {
  position: fixed;
  top: 0;
  // width: 100%;
  height: rem(44);
  line-height: rem(44);
  background: #fff;
  z-index: 2;
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    border-bottom: rem(1) solid #e6e6e6;
    transform: scaleY(0.5);
    transform-origin: 0 0;
  }
  .trend-head-l {
    float: left;
    margin-left: rem(5);
    text-align: center;
    font-size: 0;
    .others_arrow-l,
    .others_arrow-r {
      display: inline-block;
      position: relative;
      width: rem(28);
      height: rem(44);
      line-height: rem(44);
      vertical-align: top;
      &::before {
        content: "";
        position: absolute;
        top: rem(15);
        display: inline-block;
        width: rem(8);
        height: rem(14);
        background: url("../../../../assets/images/qwui-others_arrow.png")
          center no-repeat;
        background-size: 100%;
        z-index: 10;
      }
    }
    .others_arrow-l {
      transform: rotate(180deg);
    }

    .times {
      display: inline-block;
      height: rem(44);
      line-height: rem(44);
      margin: 0 rem(10);
      font-size: rem(14);
      color: #333;
    }
  }
  .trend-head-r {
    float: right;
    width: rem(30);
    height: rem(44);
    padding-right: rem(15);
    .funel_search_wrap {
      position: relative;
      top: rem(15);
      height: rem(13);
      &:before {
        content: "";
        position: absolute;
        height: 100%;
        left: 0;
        bottom: 0;
        border-left: rem(1) solid #e6e6e6;
        transform: scaleX(0.5);
        transform-origin: 0 0;
      }
      .icon {
        position: absolute;
        right: 0;
        width: rem(16);
        height: rem(13);
        background: url("../../../../assets/images/qwui-content.png") no-repeat;
        background-size: 100%;
        background-position: 0 rem(-16);
      }
    }
  }
}
.trend-main {
  position: relative;
  z-index: 1;
  padding: rem(25) 0 rem(14) rem(20);
  margin-top: rem(44);
  background: #fff;
  .totalNum {
    height: rem(27);
    line-height: rem(27);
    font-size: rem(36);
    color: #f76160;
  }
  .contractSumNum {
    margin-top: rem(10);
    height: rem(16);
    line-height: rem(16);
    font-size: rem(13);
    color: #999;
    i {
      position: relative;
      display: inline-block;
      width: rem(16);
      height: rem(16);
      text-align: center;
      background: rgba(204, 204, 204, 1);
      font-size: rem(16);
      color: #fff;
      border-radius: 50%;
      .contractNum-tip {
        position: absolute;
        top: rem(23);
        left: rem(-6);
        width: rem(276);
        padding: rem(10) rem(7);
        background: rgba(0, 0, 0, 0.8);
        font-size: rem(12);
        text-align: left;
        border-radius: rem(2);
        box-shadow: 0 0 rem(10) #999;
      }
      em {
        position: absolute;
        top: rem(-5);
        left: rem(6);
        width: 0;
        height: 0;
        border-right: rem(7) solid transparent;
        border-bottom: rem(6) solid #333;
        border-left: rem(7) solid transparent;
      }
    }
  }
}
.trend-sign {
  position: relative;
  display: flex;
  background: #fff;
  .sign-item {
    flex: 1;
    padding: rem(18) 0 rem(18) rem(20);
    .sign-num {
      height: rem(18);
      line-height: rem(18);
      font-size: rem(24);
      color: #f76160;
      &.c666 {
        color: #666;
      }
    }
    .sign-tip {
      height: rem(13);
      line-height: rem(13);
      margin-top: rem(9);
      font-size: rem(13);
      color: #999;
    }
  }
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    // margin-left: rem(20);
    border-bottom: rem(1) solid #e6e6e6;
    transform: scaleY(0.5);
    transform-origin: 0 0;
  }
}
.contract-image {
  margin-bottom: rem(10);
  background: #fff;
  .concract-descript {
    display: flex;
    height: rem(100);
    color: #333;
    background: #fff;
    .concract-descript-left {
      flex: 1.3;
      height: rem(15);
      line-height: rem(15);
      padding: rem(32) 0 0 rem(20);
      font-size: rem(16);
    }
    .concract-descript-right {
      flex: 1;
      padding: rem(22) 0 0 rem(40);
      li {
        height: rem(12);
        line-height: rem(12);
        margin-bottom: rem(10);
        font-size: rem(13);
        span {
          display: inline-block;
          width: rem(12);
          height: rem(12);
          margin-right: rem(8);
          border-radius: 50%;
          vertical-align: middle;
          &.planBlue {
            background: #4e7ccc;
          }
          &.actualGreen {
            background: #36b3c3;
          }
          &.contractGreen {
            background: #4ecda5;
          }
        }
      }
    }
  }
  .no-chart-content {
    padding: 10px 0 40px 0;
  }
}
.contract-table {
  padding: rem(32) rem(15) rem(42) rem(15);
  background: #fff;
  .table_container {
    .table {
      width: 100%;
      border-collapse: collapse;
      tr {
        th {
          background-color: #edf1f6;
          color: #666;
          font-size: rem(14);
          font-weight: 400;
          line-height: rem(34);
          border: rem(1) solid #e5e5e5;
        }
        td {
          line-height: rem(34);
          font-size: rem(14);
          color: #468ceb;
          text-align: center;
          border: rem(1) solid #e5e5e5;
          &:first-child {
            color: #333;
          }
        }
      }
    }
  }
}
.wrap {
  width: 100%;
}
@media screen and (min-width: 1024px) {
  .wrap {
    width: 740px;
    margin: 0 auto;
  }
}
</style>


