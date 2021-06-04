<template>
  <div class="wrapAll">
        <!-- toast弹窗，可配 -->
        <header class="qwui-fixed" v-if="timeWarningShow">
            <div class="qwui-warning">
                <span class="waring-text">{{warnMsg}}</span>
            </div>
        </header>
    <!-- 高级搜索 -->
    <div class="advancedSearch">
        <advanced-search
                        @search="search($event)"
                        @close="searchClose($event)"
                        @checkedRadio="checkedRadio"
                        @reset="reset($event)"
                        :setting="setting"
                        :cache-search-value="cacheSearchValue"
                        v-show="advancedShow">
        </advanced-search>

        <user-choose
                    :closeAllTab="selectSetting.selectConfig.signIndex == 'depts'"
                    :closeGroup="selectSetting.selectConfig.signIndex == 'depts'"
                    :closeUser="selectSetting.selectConfig.signIndex == 'depts'"
                    :tabActive="selectSetting.selectConfig.signIndex == 'depts' ? 'dept' : 'group'"
                    :selectconfig="selectSetting.selectConfig"
                    v-if="selectSetting.selectConfig.show">
        </user-choose>
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
    </div>
  </div>
</template>

<script>
import advancedSearch from '@/components/base/AdvancedSearch/index'
import userChoose from '@/components/base/user_or_dept_select'
// 变量，计算日期
let dateStatus = 0;
// 高级搜索选人配置
let fakeSelectConfig = {
    show: false,
    signIndex: 'users',
    selectList: {
        "usersOrDepts": { // 选部门和选人
            "title":"",
            "selectType": "group",
            "userSelected": [],
            "deptSelected": [],
            "callBack": {
                "confirm": null
            }
        }
    }
}

export default {
  name: 'timeHeader',
  components:{
    advancedSearch,
    userChoose
  },

  props: ['field', 'setting','timeWarningShow','warnMsg','cacheSearchValue','preNextShow'],
  data(){
    return {
      currentTime: {}, // 记录当前年月日时分秒的对象
      boardCurrentTime: '2018年',
      advancedShow: false,//高级搜索隐藏
      startMonth: '', // 本季度的初始月份
      endMonth: '', // 本季度的结束月份
    }
  },
  computed:{
    //   获取父组件的选人配置
    selectSetting: function(){
        for(let i = 0;i<this.setting.length;i++){
            if(this.setting[i].type == 'selectUserOrDepart'){
                return this.setting[i]
            }
        }
    },
  },
  created(){
    this.currentSelectTime(this.cacheSearchValue.searchTime)
    this.init();
  },
  mounted() {
  },
  methods:{
    // 关闭高级搜索
    searchClose(event) {
      this.$emit('searchClose',event)
      this.advancedShow = !this.advancedShow;
    },

    // 点击确认
    search(cacheSearchValue){
        this.$emit('search',this.cacheSearchValue);
        this.currentSelectTime(this.cacheSearchValue.searchTime);
    },

    checkedRadio(index,key,value){
      this.$emit('checkedRadio',index,key,value)
    },

    //重置高级搜索
    reset(event) {
      this.$emit('reset',event);
    //   this.cacheSearchValue = {
    //       searchTime:"month"
    //   }
    },

    // 左右切换时间
    preNextBtn(type){
        // 假如选择的是month的处理
        switch(this.cacheSearchValue.searchTime){
            case 'month':
              this.selectMonth(type)
              break;
            case 'season':
              this.selectSeason(type)
              break;
            case 'year':
              this.selectYear(type)
              break;
            case 'lastYear':
              this.selectLastYear(type)
              break;
            case 'week':
              this.selectWeek(type)
              break;
            case 'lastWeek':
              this.selectLastWeek(type)
              break;
            case 'lastMonth':
              this.selectLastMonth(type)
              break;
        }
        this.$emit('preNextBtn',this.boardCurrentTime,type)
    },

    // 初始化
    init(){
    },

    // 选择本月 status表示左右时间切换 pre:上 next:下
    selectMonth(status){
        if(status){ // 点击上个月
            if(status == 'pre'){
                this.currentTime.month--;
                if(this.currentTime.month < 1){
                    this.currentTime.year--;
                    this.$set(this.currentTime,'month',12)
                }
            }else if(status == 'next'){ // 点击下个月
                this.currentTime.month++;
                if(this.currentTime.month > 12){
                    this.currentTime.year++;
                    this.$set(this.currentTime,'month',1)
                }

            }
            // 月份小于10做处理
            this.currentTime.month = this.currentTime.month < 10 ?
                                    "0" + this.currentTime.month
                                    : this.currentTime.month;
        }

        // 拼接时间title
        this.boardCurrentTime = `${this.currentTime.year}年${this.currentTime.month}月`
    },

    // 选择本月 status表示左右时间切换 pre:上 next:下
    selectLastMonth(status){
        if(status){ // 点击上个月
            if(status == 'pre'){
                this.currentTime.month--;
                if(this.currentTime.month < 1){
                    this.currentTime.year--;
                    this.$set(this.currentTime,'month',12)
                }
            }else if(status == 'next'){ // 点击下个月
                this.currentTime.month++;
                if(this.currentTime.month > 12){
                    this.currentTime.year++;
                    this.$set(this.currentTime,'month',1)
                }

            }
            // 月份小于10做处理
            this.currentTime.month = this.currentTime.month < 10 ?
                                    "0" + this.currentTime.month
                                    : this.currentTime.month;
        }

        // 拼接时间title
        this.boardCurrentTime = `${this.currentTime.year}年${this.currentTime.month-1}月`
    },

    // 选择本季度 status表示左右时间切换 pre:上 next:下
    selectSeason(status){
        if(status){
            if(status == 'pre'){
                this.startMonth = parseInt(this.startMonth)-3;
                this.endMonth = parseInt(this.endMonth)-3;
                if(this.startMonth < 1){
                    this.currentTime.year--;
                    this.startMonth = 10;
                }
                if(this.endMonth < 3){
                    this.endMonth = 12;
                }
            }else if(status == 'next'){
                this.startMonth = parseInt(this.startMonth)+3;
                this.endMonth = parseInt(this.endMonth)+3;
                if(this.startMonth > 10){
                    this.currentTime.year++;
                    this.startMonth = 1;
                }
                if(this.endMonth > 12){
                    this.endMonth = 3
                }
            }
        }
        // 小于10的月份添 0
        let seasonStartMonth = this.startMonth < 10 ? '0'+this.startMonth : this.startMonth;
        let seasonEndMonth = this.endMonth < 10 ? '0'+this.endMonth : this.endMonth;
        // 拼接时间title
        this.boardCurrentTime = `${this.currentTime.year}年${seasonStartMonth}月-${this.currentTime.year}年${seasonEndMonth}月`
    },

    // 选择本年 status表示左右时间切换 pre:上 next:下
    selectYear(status){
        if(status){
            if(status == 'pre'){
                this.currentTime.year--;
            }else{
                this.currentTime.year++;
            }
        }
        // 拼接时间title
        this.boardCurrentTime = `${this.currentTime.year}年`
    },

    // 选择自定义字段，自定义字段不能左右切换时间
    selectCustom(queryType){
        // 自定义开始时间 格式  年-月
        let customStartTime = this.cacheSearchValue['tbBusinessFunnelSearchVO.startTime'];
        // 自定义结束时间 格式  年-月
        let customEndTime = this.cacheSearchValue['tbBusinessFunnelSearchVO.endTime'];
        // 起始时间判空
        if(customStartTime == undefined || customStartTime == ''){
            this.advancedShow = true
            _.alert('提示','请选择起始时间');
            return;
        }else if(customEndTime == undefined || customStartTime == ''){
            this.advancedShow = true
            _.alert('提示','请选择结束时间');
            return;
        }
        switch(queryType){
            case 'query_by_month':
            // 拼接时间title
            this.boardCurrentTime = `
                                    ${customStartTime.split('-')[0]}年${customStartTime.split('-')[1]}月
                                    -
                                    ${customEndTime.split('-')[0]}年${customEndTime.split('-')[1]}月
                                    `
            break;
            case 'query_by_season':
            this.boardCurrentTime = `
                                    ${customStartTime.split('-')[0]}年${this.getMonthStartQuarter(customStartTime.split('-')[1])}月
                                    -
                                    ${customEndTime.split('-')[0]}年${this.getMonthEndQuarter(customEndTime.split('-')[1])}月
                                    `
            break;
            case 'query_by_day':
            this.boardCurrentTime = `
                                    ${customStartTime.split('-')[0]}年${customStartTime.split('-')[1]}月${customStartTime.split('-')[2]}日
                                    -
                                    ${customEndTime.split('-')[0]}年${customEndTime.split('-')[1]}月${customEndTime.split('-')[2]}日
                                    `
            break;
        }
    },

    // 选择去年，可以切换时间
    selectLastYear(status){
        if(status){
            if(status == 'pre'){
                this.currentTime.year--;
            }else{
                this.currentTime.year++;
            }
        }
        // 拼接时间title
        this.boardCurrentTime = `${this.currentTime.year-1}年`
    },

    // 选择本周，可以切换时间，按星期切换
     selectWeek(status){
        if(status){
            if(status == 'pre'){
                dateStatus--
            }else{
                dateStatus++
            }
        }else{
            dateStatus = 0
        }
        let weekStartArr = this.getWeek('start',dateStatus).split('-');
        let weekEndArr = this.getWeek('end',dateStatus).split('-');
        this.boardCurrentTime = `${weekStartArr[0]}年${weekStartArr[1]}月${weekStartArr[2]}日-${weekEndArr[0]}年${weekEndArr[1]}月${weekEndArr[2]}日`
    },

    // 选择上周， 可以切换时间
    selectLastWeek(status){
        if(status){
            if(status == 'pre'){
                dateStatus--
            }else{
                dateStatus++
            }
        }else{
            dateStatus = 0
        }
        let weekStartArr = this.getWeek('start',dateStatus-1).split('-');
        let weekEndArr = this.getWeek('end',dateStatus-1).split('-');
        this.boardCurrentTime = `${weekStartArr[0]}年${weekStartArr[1]}月${weekStartArr[2]}日-${weekEndArr[0]}年${weekEndArr[1]}月${weekEndArr[2]}日`
    },

    // 选择的时间类型
    currentSelectTime(timeType){
        this.getCurrentDate();
        // 初始化年份
        this.currentTime.year = _.getCurrentDate().year
        switch(timeType){
            case 'month':
            this.selectMonth()
            break
            case 'season':
            this.selectSeason()
            break
            case 'year':
            this.selectYear()
            break;
            case 'custom':
            this.selectCustom(this.cacheSearchValue['tbBusinessFunnelSearchVO.queryType'])
            break;
            case　'lastYear':
            this.selectLastYear();
            break;
            case 'week':
            this.selectWeek();
            break;
            case 'lastWeek':
            this.selectLastWeek();
            break;
            case 'lastMonth':
            this.selectLastMonth();
            break;
        }
    },

    /**
     * 获取当前年、月、日、时、分、秒、周期的对象（以对象形式返回）
     */
    getCurrentDate() {
        let date = new Date();
        let currentTime={};
        currentTime.year = date.getFullYear();
        currentTime.month = date.getMonth() + 1;
        currentTime.date = date.getDate();
        currentTime.day = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()];
        currentTime.weekDay = ["7", "1", "2", "3", "4", "5", "6"][date.getDay()];
        currentTime.month = currentTime.month < 10 ? "0" + currentTime.month : currentTime.month;
        currentTime.date = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        currentTime.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        currentTime.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        currentTime.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        currentTime.weekStartDate = currentTime.date - currentTime.weekDay +1 < 10 ?
                                    "0" + currentTime.date - currentTime.weekDay+1
                                    :currentTime.date - currentTime.weekDay+1;
        currentTime.weekEndDate = currentTime.date + Number(currentTime.weekDay)-1 < 10 ?
                                    "0" + currentTime.date + Number(currentTime.weekDay)-1
                                    : currentTime.date + Number(currentTime.weekDay)-1;
        this.currentTime = currentTime;
        // 获取初始月份
        this.startMonth = this.getQuarterStartMonth(this.currentTime.month);
        // 获取结束月份
        this.endMonth = this.getQuarterEndMonth(this.currentTime.month);

        return currentTime;
    },

    /**
     * 获取季度开始月份
     */
    getQuarterStartMonth(nowMonth){
      var quarterStartMonth = 0;
      if(nowMonth<=3){
          quarterStartMonth = 1;
      }else if(3<nowMonth && nowMonth<=6){
          quarterStartMonth = 4;
      }else if(6<nowMonth && nowMonth<=9){
          quarterStartMonth = 7;
      }else{
          quarterStartMonth = 10;
      }
      return quarterStartMonth;
    },

    /**
     * 获取季度结束月份
     */
    getQuarterEndMonth(nowMonth){
      var quarterEndMonth = 0;
      if(nowMonth<=3){
          quarterEndMonth = 3;
      }else if(3<nowMonth && nowMonth<=6){
          quarterEndMonth = 6;
      }else if(6<nowMonth && nowMonth<=9){
          quarterEndMonth = 9;
      }else{
          quarterEndMonth = 12;
      }
      return quarterEndMonth;
    },

    /**
     * 季度转换月份
     */
    getMonthStartQuarter(nowQuery){
      var monthStartQuarter = 0;
      if(nowQuery == 1){
          monthStartQuarter = '01';
      }else if(nowQuery == 2){
          monthStartQuarter = '04';
      }else if(nowQuery == 3){
          monthStartQuarter = '06';
      }else{
          monthStartQuarter = '09';
      }
      return monthStartQuarter;
    },
    // 结束季度
    getMonthEndQuarter(nowQuery){
      var monthEndQuarter = 0;
      if(nowQuery == 1){
          monthEndQuarter = '03';
      }else if(nowQuery == 2){
          monthEndQuarter = '06';
      }else if(nowQuery == 3){
          monthEndQuarter = '09';
      }else{
          monthEndQuarter = '12';
      }
      return monthEndQuarter;
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
        };
        if (type == "end") {
            var dd = nowTime + (7 - day) * longTime + n;
        };
        dd = new Date(dd);
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        var d = dd.getDate();
        m = m < 10 ? "0" + m: m;
        d = d < 10 ? "0" + d: d;
        var day = y + "-" + m + "-" + d;
        return day;
    },

  }
}

</script>

<style lang="scss" scoped>
@import './CrmTimeHeader.scss';
</style>
