<template>
  <div>
    <div class="qwui-stat_warp" v-show="pageShow">
      <left-side-bar  v-show="hasRuleData" :renderConfig="renderConfig" @listenToChild="changeRuleId" @listenAddPop="addRule"></left-side-bar>
      <rule-pop class="qwui-rule_pop_content" :popData="popData" @listenClose="closeRulePop" @listenBtnFunc="updateRule">
        <div class="qwui-input_item">
          <span class="itemTitle"><span class="star">*</span>规则名称</span>
          <qwui-input
            v-model="ruleTitle"
            class="qwui-input_style"
            :inputType="'text'"
            :isWarning="isWarning"
            :maxLength="10"
            :warningTips="'规则名称不能为空'"
            @input="changeInput"></qwui-input>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">日志类型</span>
          <select v-model="diaryTypeId" :disabled="popRuleId != ''">
            <option v-for="(item,key) in diaryType" :key="key" :value="item.id">{{ item.name }}</option>
          </select>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">统计周期</span>
          <select v-model="countValue" :disabled="popRuleId != ''">
            <option v-for="(item,key) in countCycle" :key="key" :value="item.val">{{ item.optionName }}</option>
          </select>
        </div>
        <div class="qwui-input_item lableStyle">
        <span v-if="countValue == 0">
                  <qwui-checkbox class="weekLable" v-for="(item,key,index) in countDayArr" :key="index" v-model="item.isCheck">周{{ item.text }}</qwui-checkbox>
        </span>
          <qwui-checkbox class="festivalCheck" v-model="isFestival">排除节假日</qwui-checkbox>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle submitEnd">提交截止</span>
          <span>次{{ ['日','周','月'][countValue] }}</span>
          <select v-if="countValue == 1" v-model="countDay">
            <option v-for="(item,key) in countDayArr" :value="item.val">周{{ item.text }}</option>
          </select>
          <select v-if="countValue == 2" v-model="countDay">
            <option v-for="(item,key) in 28" :key="key" :value="item">{{ item }}号</option>
          </select>
          <select v-model="ruleEndTime">
            <option v-for="(item,key) in endTimeArr" :value="item">{{ item }}</option>
          </select>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">统计对象</span>
          <div class="qwui-radio_item">
            <qwui-radio v-model="range" label="1" border>所有人</qwui-radio>
            <qwui-radio v-model="range" label="3" border>特定对象</qwui-radio>
          </div>
          <person-count class="pickPerson"
                        :personCountShow="principalCountShow"
                        :defaultUsers="principalUsers"
                        :defaultDepts="principalDepts"
                        :defaultTags="principalTags"
                        :showType="principalShowType"
                        @listenAddPerson="addPerson(true)"></person-count>
        </div>
        <p class="qwui-rule_tip">规则创建后不支持修改日志类型和统计周期</p>
      </rule-pop>
      <!--选人组件-->
      <pick-person :show="principalPickShow"
                   :defaultUsers="principalUsers"
                   :defaultDepts="principalDepts"
                   :defaultTags="principalTags"
                   :functionTab="principalFunctionTab"
                   @chooseDone="choosePrincipal"
                   @closeThis="closeThis(true)"></pick-person>
      <div v-show="hasRuleData">
        <div v-if="!showSubmitDetail" class="qwui-data_content">
          <h2 class="mainTitle">
            <span class="ruleNameStyle">{{ ruleName }}</span>
            <a class="editRuleStyle" @click="editRule(ruleId)">编辑规则</a>
          </h2>
          <qwui-button class="qwui-search_btn"
                       v-for="(item,key) in buttonArr[rate]"
                       :key="key"
                       :plain="key == timeType"
                       @click="searchTimeType(key)">{{ item }}</qwui-button>
          <vue-datepicker-local
            v-model="selectTime"
            inputClass="qwui-datetime"
            popupClass="qwui-popup"
            :local="timeLocal"
            :showButtons=true
            @confirm="chooseTime"
          ></vue-datepicker-local>
          <qwui-button class="qwui-search_btn customTime" :plain="timeType == 3" @click="selectCustomTime">{{ customTime }}</qwui-button>
          <qwui-button class="qwui-search_btn fr" @click="exportReportForm()" v-perm="'countDiary'">导出</qwui-button>
          <div class="qwui-table_wrap">
            <data-table :headData="headData" :dataList="dataList">
              <div v-if="rate == 1" v-for="(item,key) in dataList" :key="key" :slot="'startTimeStr'+key">
                <p>第{{ item.timeSort }}周</p>
                <p class="qwui-start_time">({{ item.startTimeStr }})</p>
              </div>
              <div :slot="'submitNum'+key" v-for="(item,key) in dataList" :key="key" v-if="item.submitNum == '0'">
                <p class="qwui-zero_num">{{ item.submitNum }}</p>
              </div>
              <div :slot="'unSubNum'+key" v-for="(item,key) in dataList" :key="key" v-if="item.unSubNum == '0'">
                <p class="qwui-zero_num">{{ item.unSubNum }}</p>
              </div>
              <div :slot="'leaveNum'+key" v-for="(item,key) in dataList" :key="key" v-if="item.leaveNum == '0'">
                <p class="qwui-zero_num">{{ item.leaveNum }}</p>
              </div>
            </data-table>
            <page :pageData="pageData" @change="change"></page>
          </div>
        </div>
        <submit-detail v-else :submitDetailData="submitDetailData" :showSubmitDetail.sync="showSubmitDetail" @listenExport="exportReportForm"></submit-detail>
      </div>
      <div v-if="!hasRuleData" class="qwui-no_data">
        <img src="~assets/images/img_b-log_nodata.svg">
        <p>暂无数据，请先创建统计规则</p>
        <span @click="addRule">立即创建</span>
      </div>
      <div v-if="vipTipData.popShow">
        <div class="qwui-mask_layer"></div>
        <div class="qwui-pop_box">
          <div class="titleItem">
            <span>{{ vipTipData.popTitle }}</span>
            <img src="~assets/svg/vip_gold.svg">
            <i @click="closeVipPop">×</i>
          </div>
          <div class="contentItem">
            <h2>开启日志统计功能，支持自定义统计规则针对日志数据的统计、查询、导出等强大统计能力</h2>
            <h2>场景示意：</h2>
            <p>A领导管理a、b、c部门，定期需要统计和查看各部门员工的日报、周报、月报等日志提交情况，使用日志统计功能，可以按部门/人员，自定义时间段统计筛选出应提交、已提交、未提交、请假人员等日志数据并支持导出，大大加强公司日志提交情况的监管能力。</p>
            <img src="~assets/images/img_b-log_statistical.svg">
          </div>
          <div class="buttonItem">
            <qwui-button class="btnStyle"
                         type="primary"
                         @click="upgradeVip">升级为尊享版</qwui-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import leftSideBar from '@/components/list/LeftSideBar'
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page.vue';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
  import personCount from '@/components/pickPerson/qwuiPersonCount';
  import pickPerson from '@/components/pickPerson/pickPerson';
  import rulePop from '@/components/Add/popUps/PopBase';
  import submitDetail from './diarySubmitDetail';
  import VueDatepickerLocal from "vue-datepicker-local";
  import * as timeUtil from '@/assets/js/time-util';
  import exportReportForm from '@/assets/js/export/export.js';
  import { isVipGold } from '@/assets/js/vip-manager';
  import { getRulesList,searchRuleRecord,searchRuleDiaryType,viewRuleData,addOrEditRule,updateRuleStatus,deleteRule } from '../../api/diary/getData';

  const DiaryIcon = ['day','week','month'];

  export default {
    mixins:[exportReportForm],
    data(){
      return {
        pageShow:false,
        ruleId:'',
        ruleName:'',
        rate:0, // 日报0、周报1、月报2
        rateArr:[],// 规则类型数组
        titleArr:[],// 规则名称数组
        timeLocal:{
          dow:0,// 第一天为周日
          yearSuffix: '年', // format of head
          monthsHead: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'), // months of head
          months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(''), // months of panel
          weeks: '日_一_二_三_四_五_六'.split('_'), // weeks
          submitTip: '确定' // default text for submit button
        },
        timeType:1, // 时间范围
        customTime:'自定义时间',// 自定义显示的时间
        exportTime:'',// 导出时间
        renderConfig:{
          addOperateName:'新建规则',
          renderList:[],// 规则列表
          currentIndex:0
        },
        hasRuleData:false,
        popData:{
          popShow:false,
          popTitle:'新建规则',
          buttonConfig: {
            cancel:{
              text: '取消',
              type: ''
            },
            confirm:{
              text: '确定',
              type: 'primary'
            }
          }
        },
        popRuleId:'',
        ruleTitle:'',// 规则名称
        isWarning:false,// 是否必需
        diaryTypeId:'',// 日志类型id
        diaryType:[],
        countValue:0,// 统计周期
        countCycle:[
          {
            val: 0,
            optionName: '每天提交'
          },
          {
            val: 1,
            optionName: '每周提交'
          },
          {
            val: 2,
            optionName: '每月提交'
          }
        ],
        // 星期
        countDayArr: [
          {
            val: 0,
            text: '日',
            isCheck: false
          }, {
            val: 1,
            text: '一',
            isCheck: true
          }, {
            val: 2,
            text: '二',
            isCheck: true
          }, {
            val: 3,
            text: '三',
            isCheck: true
          }, {
            val: 4,
            text: '四',
            isCheck: true
          }, {
            val: 5,
            text: '五',
            isCheck: true
          }, {
            val: 6,
            text: '六',
            isCheck: false
          }
        ],
        countDay: 1, // 提交日期
        // 提交时间点
        endTimeArr:['06:00','07:00','08:00','09:00','10:00','11:00','12:00'],
        ruleEndTime:'10:00',// 截止时间
        isFestival:true,// 排除节假日
        range:'1',
        principalCountShow:false,
        principalPickShow:false,
        principalDepts:[],// 部门
        principalTags:[],// 标签
        principalUsers:[],// 成员
        // 选人tab
        principalFunctionTab:[
          {text:'部门'},
          {text:'标签'},
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
          {text:'高级筛选'},
        ],
        // 选人选框显示
        principalShowType:{
          person:true,
          dept:true,
          tag:true
        },
        // 时间段选择
        buttonArr:[
          ['全部', '最近7天', '最近30天'],
          ['全部', '最近4周', '最近12周'],
          ['全部', '最近3月', '最近6月']
        ],
        // 日志记录列表
        headDataMiddle:{
          time: {
            title: '时间',
            key: 'startTimeStr',
            width:109,
          },
          target: {
            title: '统计对象',
            key: 'targetName',
            width:171
          },
          total: {
            title: '应提交',
            key: 'totalNum',
            width:65
          },
          submit: {
            title: '已提交',
            key: 'submitNum',
            width:65,
            skip: {
              skipFunc: (item) => {
                this.gotoSubmitDetail(item,0)
              }
            }
          },
          unSub: {
            title: '未提交',
            key: 'unSubNum',
            width:65,
            skip: {
              skipFunc: (item) => {
                this.gotoSubmitDetail(item,1)
              }
            }
          },
          leave: {
            title: '请假',
            key: 'leaveNum',
            width:65,
            skip: {
              skipFunc: (item) => {
                this.gotoSubmitDetail(item,2)
              }
            }
          },
          subScale: {
            title: '提交比例',
            key: 'subScale',
            width:72
          },
          operation: {
            title: '操作',
            key: 'operation',
            width:60,
            skip: {
              skipFunc: (item) => {
                this.exportReportForm(item)
              }
            }
          }
        },
        middleNoLeave:{},
        headData:{
          middle: this.headDataMiddle,
          right:{
            isShowOperate:false
          }
        },
        // 日志记录数据
        dataList:[],
        pageData:{},
        page:1,
        pageSize:10,
        // 时间选择插件选择的时间
        selectTime:[],
        startTime:'',
        endTime:'',
        // 提交详情页
        showSubmitDetail:false,
        submitDetailData:{},
        vipTipData: {
          popShow: false,
          popTitle: '日志统计功能',
        }
      }
    },
    created(){
      this.middleNoLeave = {...this.headDataMiddle};
      delete this.middleNoLeave.leave;
      this.searchRuleList();
    },
    methods:{
      searchRuleList(){
        // 获取规则列表数据
        getRulesList((data)=>{
          // 无数据，显示无数据页面
          if (data.sruleList.length == 0){
            this.hasRuleData = false;
            this.pageShow = true;
            return;
          }
          this.hasRuleData = true;
          this.pageShow = true;
          // 数据初始化
          this.rateArr = [];
          this.titleArr = [];
          this.renderConfig.renderList = [];
          data.sruleList.forEach((item)=>{
            this.rateArr.push(item.rate);
            this.titleArr.push(item.sruleName);
            this.renderConfig.renderList.push({
              itemName:item.sruleName,
              itemIcon:require('../../../../assets/images/ic_b-log_'+DiaryIcon[item.rate]+ (item.state == 0 ? '_disable' : '') + '.svg'),
              id:item.sruleId,
              status:item.state,
              operateList:[
                {
                  operateName:'编辑',
                  operateFunc:()=> {
                    this.editRule(item.sruleId)
                  }
                },
                {
                  operateName:item.state == 1 ? '禁用' : '启用',
                  operateFunc:()=> {
                    this.disEnRule(item.sruleId)
                  }
                },
                {
                  operateName:'删除',
                  operateFunc:()=> {
                    this.delRule(item.sruleId)
                  }
                }
              ]
            })
          });
          if (data.sruleList && data.sruleList.length > 0){
            this.renderConfig.currentIndex = 0;
            this.ruleId = data.sruleList[0].sruleId;
            this.ruleName = data.sruleList[0].sruleName;
            this.rate = this.rateArr[0];
            this.searchTimeType(1);
          }
        })
      },
      // 查找日志记录
      searchDiaryData(){
        searchRuleRecord({
          page:this.page,
          pageSize:this.pageSize,
          sruleId:this.ruleId,
          startTime:this.startTime,
          endTime:this.endTime,
        },(data)=>{
          this.pageData = {
            page: data.currPage,
            pageSize: this.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          };
          this.totalRows = data.totalRows;
          if (!data.pageData){
            this.dataList = [];
            return;
          }
          // 周报、月报没有请假项
          if (this.rate != 0){
            this.headData.middle = this.middleNoLeave;
          }else {
            this.headData.middle = this.headDataMiddle;
          }
          data.pageData.forEach((item)=>{
            // 根据周期类不同统计对象宽度不同，统计对象需截取字段保证一行显示
            let str = '等'+ item.totalNum + '人';
            let target = item.targetName;
            if(target.indexOf(str) >= 0){
              let name = this.rate == 1 ? target.substr(0, 4) : target.substr(0, 5);
              let lastWord = name.substr(name.length-1,1);
              let tarName = lastWord == '、' ?  name.substring(0, name.length-1) : name;
              item.targetName = tarName + str;
            } else {
              item.targetName = target;
            }
            // 周期为周时，判断timesort字段范围是否为1~9是则前面补0
            if(this.rate == 1) {
              item.timeSortStr = item.timeSort.length == 1 ? '0'+ item.timeSort : item.timeSort;
            }

            item.unSubNum = item.totalNum - item.submitNum - item.leaveNum;
            if (item.totalNum == 0){
              item.subScale = '0%'
            }else {
              let percent = Math.round((item.submitNum/item.totalNum)*100);
              item.subScale = percent > 100 ? '100%' : percent + '%';
            }
            item.operation = '导出';
          });
          this.dataList = data.pageData;
          this.showSubmitDetail = false;
        })
      },
      // 初始化新增编辑规则弹窗
      ruleDataInit(){
        this.popRuleId = '';
        this.ruleTitle = '';
        this.diaryTypeId = '';
        this.countValue = 0;
        this.countDayArr.forEach((item,key)=>{
          key == 0 || key == 6 ? item.isCheck = false : item.isCheck = true;
        });
        this.countDay = 1;
        this.ruleEndTime = '10:00';
        this.isFestival = true;
        this.range = '1';
        this.principalDepts = [];
        this.principalTags = [];
        this.principalUsers = [];
      },
      // 新增规则
      addRule(){
        if (!isVipGold(interfaceCode.INTERFACE_CODE_DIARY)){
          this.vipTipData.popShow = true;
          return;
        }
        this.ruleDataInit();
        this.popData.popTitle = '新建规则';
        searchRuleDiaryType((data)=>{
          this.diaryTypeId = data.diaryTypeList[0].id;
          this.diaryType = data.diaryTypeList;
        });
        this.popData.popShow = true;
      },
      // 编辑规则
      editRule(id){
        if (!isVipGold(interfaceCode.INTERFACE_CODE_DIARY)){
          this.vipTipData.popShow = true;
          return;
        }
        this.ruleDataInit();
        this.popRuleId = id;
        this.popData.popTitle = '编辑规则';
        searchRuleDiaryType((data)=>{
          this.diaryTypeId = data.diaryTypeList[0].id;
          this.diaryType = data.diaryTypeList;
          viewRuleData({
            sruleId:id
          },(data)=>{
            let vo = data.tbQyDiaryStatisticsRuleVO;
            this.ruleTitle = vo.sruleName;
            this.diaryTypeId = vo.diaryTypeId;
            this.countValue = vo.rate;
            this.countDay = vo.countDay;
            this.isFestival = vo.isFestival;
            this.countDayArr.forEach((item)=>{
              item.isCheck = vo.countDay.indexOf(item.val) != -1;
            });
            this.ruleEndTime = vo.endTime.substr(0,5);
            this.range = vo.ranges + '';
            this.principalDepts = data.personVO.deptVOList;
            this.principalTags = data.personVO.tagVOList;
            this.principalUsers = data.personVO.userVOList;
          });
        });
        this.popData.popShow = true;
      },
      changeInput(){
        this.isWarning = this.ruleTitle == '';
      },
      addPerson(){
        this.principalPickShow = true;
      },
      // 选人回调
      choosePrincipal(deptSelected,tagList,specialUsers){
        this.principalDepts = deptSelected;
        this.principalTags = tagList;
        this.principalUsers = specialUsers;
        this.principalPickShow = false;
      },
      // 选人关闭按钮
      closeThis(){
        this.principalPickShow = false;
      },
      // 新增或编辑规则
      updateRule(key){
        if (key == 'confirm'){
          if (this.ruleTitle == ''){
            this.isWarning = true;
            return;
          }
          let deptIds = [],tagIds = [],userIds = [],countDays = [];
          this.principalDepts.forEach((item)=>{
            deptIds.push(item.nodeId || item.deptId)
          });
          this.principalTags.forEach((item)=>{
            tagIds.push(item.id || item.tagId)
          });
          this.principalUsers.forEach((item)=>{
            userIds.push(item.userId || item.id)
          });
          if (this.countValue == 0){
            this.countDayArr.forEach((item)=>{
              if (item.isCheck){
                countDays.push(item.val);
              }
            });
            this.countDay = countDays.join(',');
          }

          let params = {
            'tbQyDiaryStatisticsRulePO.sruleId':this.popRuleId,
            'tbQyDiaryStatisticsRulePO.sruleName':this.ruleTitle,
            'tbQyDiaryStatisticsRulePO.diaryTypeId':this.diaryTypeId,
            'tbQyDiaryStatisticsRulePO.rate':this.countValue,
            'tbQyDiaryStatisticsRulePO.countDay':this.countDay,
            'tbQyDiaryStatisticsRulePO.isFestival':this.isFestival ? 1 : 0,
            'tbQyDiaryStatisticsRulePO.endTime':this.ruleEndTime + ':00',
            'tbQyDiaryStatisticsRulePO.ranges':this.range,
            deptIds:deptIds.join('|'),
            tagIds:tagIds.join('|'),
            userIds:userIds.join('|')
          };

          addOrEditRule(params,()=>{
            let text = this.popRuleId == '' ? '新增成功' : '编辑成功';
            dataBase.top_alert(text,true,3000);
            this.searchRuleList();
            this.popData.popShow = false;
          })
        }else {
          this.popData.popShow = false;
        }
      },
      // 关闭规则弹窗
      closeRulePop(){
        this.popData.popShow = false;
      },
      // 启用、禁用规则
      disEnRule(ruleId){
        let status = 0;
        this.renderConfig.renderList.forEach((item)=>{
          if (item.id == ruleId){
            status = item.status == 0 ? 1 : 0;
          }
        });
        if (status == 0){
          let self = this;
          _.alert('提示','规则禁用后将不再统计新的日志数据，是否禁用？',function () {
            self.changeRuleStatus(ruleId,status);
          },'确定',true);
          return;
        }else {
          this.changeRuleStatus(ruleId,status)
        }
      },
      // 启用、禁用规则请求
      changeRuleStatus(ruleId,status){
        updateRuleStatus({
          sruleId:ruleId,
          state:status,
        },()=>{
          let text = status == 0 ? '禁用成功' : '启用成功';
          dataBase.top_alert(text,true,3000);
          this.searchRuleList();
        })
      },
      // 删除规则
      delRule(ruleId){
        let self = this;
        _.alert('提示','规则删除后将清除该规则下的统计数据（不会删除日志的原始数据），是否删除？',function () {
          deleteRule({
            sruleId:ruleId
          },()=>{
            self.renderConfig.currentIndex = 0;
            dataBase.top_alert('删除成功',true,3000);
            self.searchRuleList();
          })
        },'确定',true);
      },
      change(page,pageSize){
        this.pageSize = pageSize;
        this.page = page;
        this.searchDiaryData();
      },
      // 点击规则列表
      changeRuleId(id,key){
        id ? this.ruleId = id : '';
        this.renderConfig.currentIndex = key;
        // 当前日志类型
        this.rate = this.rateArr[key];
        this.ruleName = this.titleArr[key];
        this.customTime = '自定义时间';
        this.searchTimeType(1);
      },
      // 点击自定义时间按钮
      selectCustomTime(){
        document.querySelector('.datepicker-range').click();
      },
      // 时间插件确定按钮的回调
      chooseTime(time){
        this.selectTime = time;

        // 获取开始时间数据
        let sTime = timeUtil.changeFormat(new Date(time[0]),'yyyy-MM-dd');
        let sYear = new Date(time[0]).getFullYear();
        let sMonth = new Date(time[0]).getMonth() + 1;
        let sDay = new Date(time[0]).getDate();
        let sWeekDay = new Date(time[0]).getDay();
        let sCurrWeekDay = timeUtil.changeFormat(new Date(new Date(time[0]).getTime() - 1000*3600*24*sWeekDay),'yyyy.MM.dd');

        // 获取结束时间数据
        let eTime = timeUtil.changeFormat(new Date(time[1]),'yyyy-MM-dd');
        let eYear = new Date(time[1]).getFullYear();
        let eMonth = new Date(time[1]).getMonth() + 1;
        let eDay = new Date(time[1]).getDate();
        let eWeekDay = new Date(time[1]).getDay();
        let eCurrWeekDay = timeUtil.changeFormat(new Date(new Date(time[1]).getTime() + 1000*3600*24*(6-eWeekDay)),'yyyy.MM.dd');

        // 获取当前时间
        let currYear = new Date().getFullYear();
        let showYear = sYear != currYear || eYear != currYear;

        if (this.rate == 1){// 周报
          showYear = sCurrWeekDay.substr(0,4) != currYear || eCurrWeekDay.substr(0,4) != currYear;
        }
        let startWeekDay = sCurrWeekDay;
        let endWeekDay = eCurrWeekDay;
        if (!showYear){
          startWeekDay = sCurrWeekDay.replace(currYear+'.','');
          endWeekDay = eCurrWeekDay.replace(currYear+'.','');
        }

        // 判断开始时间与结束时间是否相等
        let sameYear = sYear == eYear;
        let sameMonth = sMonth == eMonth;
        let sameDay = sDay == eDay;
        let sameWeek = this.isSameWeek(time[0],time[1]);


        if (this.rate == 0){// 日报
          this.startTime = sTime;
          this.endTime = eTime;
          // 同一天
          if (sameYear && sameMonth && sameDay){
            this.customTime = (sYear == currYear ? '' : sYear + '.') + sMonth + '.' + sDay;
            this.exportTime =  sYear + '.' + sMonth + '.' + sDay;
          }else {
            this.customTime = (showYear ? sYear + '.' : '') + sMonth + '.' + sDay + '~' + (showYear ? eYear + '.' : '') + eMonth + '.' + eDay;
            this.exportTime = sYear + '.'  + sMonth + '.' + sDay + '~' +  eYear + '.' + eMonth + '.' + eDay;
          }
        }else if (this.rate == 1){// 周报
          let sWeek = this.getWeekNumber(sYear,sMonth,sDay);
          let eWeek = this.getWeekNumber(eYear,eMonth,eDay);
          this.startTime = sYear + '|' + sWeek;
          this.endTime = eYear + '|' + eWeek;
          if (sameWeek){
            this.customTime = '第' + eWeek + '周（' + startWeekDay + '~' + endWeekDay + '）';
            this.exportTime = '第' + eWeek + '周（' + sCurrWeekDay + '~' + eCurrWeekDay + '）';
          }else {
            this.customTime = '第'+ sWeek + '周-第' + eWeek + '周（' + startWeekDay + '~' + endWeekDay + '）';
            this.exportTime = '第'+ sWeek + '周-第' + eWeek + '周（' + sCurrWeekDay + '~' + eCurrWeekDay + '）';
          }
        }else {// 月报
          this.startTime = sYear + '|' + sMonth;
          this.endTime = eYear + '|' + eMonth;
          this.customTime = sYear + '.' + sMonth + '~' + eYear + '.' + eMonth;
          if (sameYear && sameMonth){
            this.customTime = sYear + '.' + sMonth;
          }
          this.exportTime = this.customTime;
        }
        this.timeType = 3;
        this.searchDiaryData();
      },
      // 切换时间段类型，key默认为1
      searchTimeType(key){
        this.timeType = key;
        let timeArr = [[7,30], [4,12], [3,6]];
        let oneDay = 3600*1000*24;
        if (key == 0){
          this.startTime = '';
          this.endTime = '';
        }else {
          if (this.rate == 0){
            // 日报，获取开始时间结束时间与导出时间
            this.startTime = timeUtil.changeFormat(new Date(new Date().getTime()-timeArr[this.rate][key-1]*oneDay),'yyyy-MM-dd');
            this.endTime = timeUtil.changeFormat(new Date(new Date().getTime()-oneDay),'yyyy-MM-dd');
            this.exportTime = (this.startTime + '~' + this.endTime).replace(/-/g,'.');
          }else if (this.rate == 1){
            // 周报，获取开始时间结束时间与导出时间
            let sTime = timeUtil.changeFormat(new Date(new Date().getTime()-timeArr[this.rate][key-1]*7*oneDay),'yyyy-MM-dd');

            // 获取第几周
            let sWeek = this.getWeekNumber(sTime.substr(0,4),sTime.substr(5,2),sTime.substr(8,2));
            let eTime = timeUtil.changeFormat(new Date(new Date().getTime()-7*oneDay),'yyyy-MM-dd');
            let eWeek = this.getWeekNumber(eTime.substr(0,4),eTime.substr(5,2),eTime.substr(8,2));

            this.startTime = sTime.substr(0,4) + '|' + sWeek;
            this.endTime = this.currYear + '|' + eWeek;

            // 获取周报导出时间
            let startWeekTime = timeUtil.changeFormat(new Date(new Date(sTime).getTime()-new Date(sTime).getDay()*oneDay),'yyyy.MM.dd');
            let endWeekTime = timeUtil.changeFormat(new Date(new Date(eTime).getTime()+(6-new Date(sTime).getDay())*oneDay),'yyyy.MM.dd');
            this.exportTime = '第'+sWeek+'周-第'+eWeek+'周('+startWeekTime+'~'+endWeekTime+')';
          }else {
            // 月报，获取开始时间结束时间与导出时间
            let sMonth = this.currMonth - timeArr[this.rate][key-1];
            let sYear = this.currYear;
            if (sMonth < 0){
              sMonth = 12 - sMonth;
              sYear -= 1;
            }
            let eMonth = this.currMonth - 1;
            let eYear = this.currYear;
            if (eMonth < 0){
              eMonth = 12 - eMonth;
              eYear -= 1;
            }
            this.startTime = sYear + '|' + sMonth;
            this.endTime = eYear + '|' + eMonth;
            this.exportTime = (this.startTime + '~' + this.endTime).replace(/\|/g,'.')
          }

        }
        this.searchDiaryData();
      },
      // 判断是否是闰年
      isLeapYear(year) {
        return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
      },
      // 获取某年某月的天数
      getMonthDays(year, month) {
        return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
      },
      // 获取某年某月某天是第几周,第一天为周日
      getWeekNumber(y, m, d) {
        var targetDay = new Date(y, m - 1, d);
        var year = targetDay.getFullYear();
        var days = targetDay.getDate();
        //那一天是那一年中的第多少天
        for (var i = 1; i < m; i++) {
          days += this.getMonthDays(year, i);
        }
        //那一年第一天是星期几
        var yearFirstDay = new Date(year, 0, 1).getDay();
        //计算是第几周
        days += yearFirstDay;
        var week = Math.ceil(days / 7);
        return week;
      },
      // 是否同一周
      isSameWeek(old, now) {
        var oneDayTime = 1000 * 60 * 60 * 24;
        var old_count = parseInt(old.getTime() / oneDayTime);
        var now_other = parseInt(now.getTime() / oneDayTime);
        return parseInt((old_count + 4) / 7) == parseInt((now_other + 4) / 7);
      },
      // 跳转提交详情页面
      gotoSubmitDetail(item,type){
        let currPath = '';
        let typeArr = ['submitNum','unSubNum','leaveNum'];
        if (item[typeArr[type]] == 0) {
          return;
        }
        if (this.rate == 0){
          let timer = item.recordYear + '.' + item.startTimeStr;
          let weekDay = new Date(timer).getDay();
          currPath = item.startTimeStr + ' 周' + ['日','一','二','三','四','五','六'][weekDay];
        }else if(this.rate == 1){
          currPath = '第' + item.timeSort + '周(' + item.startTimeStr + ')'
        }else {
          currPath = item.startTimeStr;
        }
        this.submitDetailData = {
          lastPath:this.ruleName,
          currPath:currPath,
          id:item.id,
          submitNum:item.submitNum || 0,
          unSubNum:item.unSubNum || 0,
          showLeave:this.rate == 0,
          leaveNum:item.leaveNum || 0,
          type:type,
          timeSort:item.timeSort,
          recordYear:item.recordYear,
          startTimeStr:item.startTimeStr
        };
        this.showSubmitDetail = true;
      },
      // 导出
      exportReportForm(item,type,keyword) {
        let startTime = this.startTime;
        let endTime = this.endTime;
        let exportTime = this.exportTime;
        if (item){
          if (this.rate == 1){
            exportTime = '第'+ item.timeSort + '周(' + item.recordYear + '.' + item.startTimeStr + ')'
          }else if (this.rate == 2){
            exportTime = item.startTimeStr;
          }else {
            exportTime = item.recordYear + '.' + item.startTimeStr;
          }
        }
        if((startTime==""||endTime=="") && !item){
          dataBase.top_alert('请在【时间选择框】设置导出数据的时间段',false,3000);
        }else{
          if(this.exportDaysLimitByMonthCounts(startTime,endTime)){
            if(this.totalRows>0){
              _.alert('提示','将导出【'+exportTime+'】的'+'【'+this.ruleName+'】统计数据，是否导出？',()=>{
                let searchParams = {
                  'reportType':type ? 'diaryStatisticsRecordDetail' : 'diaryStatisticsRecord',
                  'personalFileName':this.ruleName + (type ? '_明细数据_' : '_汇总_') + exportTime
                };
                if(type) {  // 明细数据
                  searchParams['searchValue.name'] = keyword;
                } else { // 汇总
                  searchParams['searchValue.sruleId'] = this.ruleId;

                  if (!item){ // 整体导出需要时间，单条不需要
                    searchParams['searchValue.startTime'] = this.startTime;
                    searchParams['searchValue.endTime'] = this.endTime;
                  }
                }
                item ? searchParams['searchValue.recordId'] = item.id : '';

                this._createReport(searchParams);
              },'确定',true)
            } else{
              dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
            }
          }
        }
      },
      closeVipPop(){
        this.vipTipData.popShow = false;
      },
      upgradeVip(){
        window.open("https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav")
      }
    },
    computed:{
      currYear(){
        return new Date().getFullYear();
      },
      currMonth(){
        return new Date().getMonth() + 1;
      },
      currDay(){
        return new Date().getDate();
      }
    },
    watch:{
      range(){
        this.principalCountShow = this.range == '3';
      }
    },
    components:{
      leftSideBar,
      dataTable,
      page,
      qwuiButton,
      VueDatepickerLocal,
      rulePop,
      qwuiInput,
      qwuiRadio,
      qwuiCheckbox,
      personCount,
      pickPerson,
      submitDetail
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-data_content {
    margin-left: 230px;

    & .mainTitle {
        margin-bottom: 20px;
        line-height: 40px;

        .ruleNameStyle {
          font-size: 18px;
        }

        .editRuleStyle {
          margin-left: 12px;
          color: #999;
          cursor: pointer;

          &:hover {
              color: #F78B00;
           }
        }
      }
    .qwui-search_btn {
      height: 34px;
      margin-right: 10px;
      border-radius: 2px;

      &.is-plain:hover {
         color: #F78B00;
         border-color: #F87B00;
         background: #fff;
       }

      &.customTime {
         position: absolute;
         margin-left: -182px;
         min-width: 182px;
         color: #ccc;

         &.is-plain {
            color: #F78B00;
          }
       }

      &:hover {
         color: #F78B00;
         border-color: #F87B00;
         background: #fff;
       }
    }
  }
  .qwui-input_style /deep/ .qw_textInput {
     padding: 4px;
     width: 360px !important;
     height: 30px;
     border-radius: 4px;
     border: 1px solid #ccc;
  }
  .qwui-stat_warp {
    position: relative;
    padding-top: 20px;
  }
  .qwui-stat_warp /deep/ .datepicker-range {
    min-width: 135px;
    &:before{
      background: none;
     }

    .qwui-datetime {
      padding: 5px;
      text-align: center;
      background: inherit;
      border: 1px solid #d5d5d5;
      border-radius: 2px;
    }
    &.active .qwui-datetime {
       color: #F78B00;
       border-color: #F87B00;
     }

     .qwui-popup {
       margin-left: -50%;

       & .datepicker__buttons {
            text-align: center;
            .datepicker__button-cancel {
              display: none;
            }
            .datepicker__button-select {
              border-radius: 4px;
              background: #C31725;
            }
         }
     }
  }
  .qwui-table_wrap{
    padding-top: 15px;
    & /deep/ .table_wrap {
        min-width: 0;

        .goLink {

          &:hover {
            text-decoration: none !important;
           }
        }
      }
  }
  .fr {
    float: right;
  }
  .qwui-input_item {
    margin-bottom: 20px;

  .itemTitle {
    margin-bottom: 5px;
    margin-right: 10px;
    width: 100px;
    display: inline-block;
    text-align: right;
    vertical-align: top;

    &.submitEnd {
        vertical-align: bottom;
     }
  }
  select {
    padding: 4px;
    max-width: 360px;
    text-transform: none;
    font-family: inherit;
    margin: 0;
    vertical-align: baseline;
    border: 1px solid #cccccc;
    border-radius: 4px;

    &[disabled] {
       cursor: not-allowed;
       background: #eee;
     }
  }
  .itemOption {
    display: inline-block;
    vertical-align: text-top;
  }
  .star {
    margin-right: 5px;
    color: red;
  }
  }
  .qwui-radio_item {
    display: inline-block;
  }
  .weekLable {
    margin-right: 5px;
  }
  .lableStyle {
    padding-left: 110px;
    padding-right: 50px;
    margin-top: -10px;

    .festivalCheck {
      margin-left: -4px;
    }
  }
  .pickPerson {
    padding-left: 115px;
  }
  .qwui-rule_tip {
    margin-left: 75px;
    padding-left: 20px;
    background: url("~assets/images/gantan.png") no-repeat left;
  }
  .qwui-no_data {
    text-align:center;

    img {
      margin-top: 40px;
      width: 240px;
      height: 175px;
    }

    p {
      color: #999;
    }

    span {
      display: inline-block;
      width: 160px;
      height: 40px;
      margin-top: 30px;
      line-height: 40px;
      border-radius:20px;
      color: #C31725;
      border: 1px solid;
      cursor: pointer;
    }
  }
  .qwui-mask_layer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9;
  }
  .qwui-pop_box {
    position: absolute;
    width: 700px;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    overflow: auto;
    background: #f7f7f7;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);

  .titleItem {
    background: #ececec;
    color: #333;
    font-size: 18px;
    height: 45px;
    line-height: 45px;
    padding-left: 20px;
    position: relative;
    text-align: left;
    border-bottom: 1px solid #dddddd;

  img {
    vertical-align: sub;
  }

  i {
    cursor: pointer;
    font-style: normal;
    position: absolute;
    right: 0;
    width: 50px;
    text-align: center;
    color: #bbb;
    font-size: 28px
  }
  }

  .contentItem {
    padding: 30px 24px;
    box-sizing: border-box;
    overflow-y: auto;

    h2 {
      color: #333;
      &:first-child {
         margin-bottom: 30px;
       }
    }
    p {
      margin-bottom: 30px;
      color: #666;
    }
  }

  .buttonItem {
    margin-top: 30px;
    text-align: center;
    background: #ececec;
    padding: 10px;

  .btnStyle {
    margin-right: 10px;
  }
  }
  }
  .qwui-start_time {
    color: #999;
    font-size: 12px;
    white-space: nowrap;
  }
  .qwui-zero_num {
    color: #333;
    &:hover {
       text-decoration:none;
     }
  }
  .qwui-rule_pop_content /deep/ .qwui-pop_box{
    width: 600px;
  }
</style>
