<template>
  <ScrollDialog :visible="visible"
                title="日历"
                @close="handleClickDialog">
    <div class="qwui-calendar_header">
      <img src="~assets/images/crm/icon_calendar_left.png"
           @click.stop.prevent="handlePrevMonth" />
      <span>{{year}}年 {{monthText}}</span>
      <img src="~assets/images/crm/icon_calendar_right.png"
           @click.stop.prevent="handleNextMonth" />
    </div>
    <div class="qwui-calendar_week">
      <div class="qwui-calendar_week_item"
           v-for="week in weeks"
           :key="week">{{week}}</div>
    </div>
    <div class="qwui-calendar_date">
      <div class="qwui-calendar_date_week"
           v-for="(week, i1) in days"
           :key="i1">
        <div :class="['qwui-calendar_date_day',day.selected ? 'selected':'',day.disable?'disable': '',today.show && today.date === day.text ? 'isToday': '', selectDay.show && selectDay.date === day.text ? 'isSelect': '']"
             v-for="(day,i2) in week"
             :key="i2"
             @click="handleSelect(day.text, day.selected)">
          <span>{{day.text}}</span>
        </div>
      </div>
    </div>
  </ScrollDialog>
</template>

<script>
import ScrollDialog from '../ScrollDialog/index'

export default {
  name: 'ScrollCalendarComponent',
  components: { ScrollDialog },
  props: {
    // 弹窗是否可见
    visible: {
      type: Boolean,
      default: false
    },
    // 点击阴影是否允许关闭弹窗
    maskClosable: {
      type: Boolean,
      default: true
    },
    // 自定义星期
    weeks: {
      type: Array,
      default: function() {
        return ['日', '一', '二', '三', '四', '五', '六']
      }
    },
    // 自定义月份
    months: {
      type: Array,
      default: function() {
        return [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月'
        ]
      }
    },
    // 可选日期
    selected: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      year: 0,
      month: 0,
      day: 0,
      monthText: '',
      days: [],
      today: {},
      selectDay: {}
    }
  },
  watch: {
    selected() {
      this.render(this.year, this.month)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      let now = new Date()
      this.year = now.getFullYear()
      this.month = now.getMonth()
      this.day = now.getDate()

      this.selectDay = {}
      this.today = {}

      this.monthText = this.months[this.month]
      this.render(this.year, this.month)
    }, // 渲染日期
    render(y, m) {
      // 返回当前年份，月份
      this.$emit('gettime', this.year, this.month + 1)

      // 该月份第一天的星期
      let firstDayOfMonth = new Date(y, m, 1).getDay()
      // 该月份最后一天的日期
      let lastDateOfMonth = new Date(y, m + 1, 0).getDate()
      // 上月份最后一天的日期
      let lastDateOfLastMonth = new Date(y, m, 0).getDate()
      // 处理可选日期，过滤出来可选日期的年/月/日

      let k
      let line = 0
      let temp = []
      let nextMonthPushDays = 1

      // 根据本月所有日期数遍历
      for (let i = 1; i <= lastDateOfMonth; i++) {
        // 得到每一天的星期
        let day = new Date(y, m, i).getDay()

        // 该月每个星期日开始生成新行
        if (day === 0) {
          temp[line] = []
        }

        // 根据该月首日日期填补上月日期部分
        if (i === 1) {
          temp[line] = []
          k = lastDateOfLastMonth - firstDayOfMonth + 1
          for (let j = 0; j < firstDayOfMonth; j++) {
            temp[line].push({ text: k, selected: false, disable: true })
            k++
          }
        }

        // 该月每日日期都渲染
        // day代表日期，selected代表是否可选，disable代表是否显示该日期，非本月日期不显示）
        let options = { text: i, selected: false, disbale: false }

        // 把当前的日期拿去过滤判断是否可选
        if (this.selected.length && this.filterSelected(i).length) {
          options.selected = true
        }

        temp[line].push(options)

        // 处理完该月每行最后一个日期（星期六）之后增加一行
        if (day === 6 && i < lastDateOfMonth) {
          line++
        }

        // 根据本月最后一天的星期计算出下个月插入的天数
        if (i === lastDateOfMonth) {
          k = 1
          for (let d = day; d < 6; d++) {
            temp[line].push({ text: k, selected: false, disable: true })
            k++
          }
          nextMonthPushDays = k
        }
      }

      // 依据上面计算的下月插入天数处理每个月末尾不属于本月的日期
      if (line <= 5 && nextMonthPushDays > 0) {
        for (let i = line + 1; i <= 5; i++) {
          temp[i] = []
          let start = nextMonthPushDays + (i - line - 1) * 7
          for (let d = start; d <= start + 6; d++) {
            temp[i].push({ text: d, selected: false, disable: true })
          }
        }
      }

      // 将生成的该月日期数组赋值显示
      this.days = temp

      // 显示今天
      const now = new Date()
      const nowYear = now.getFullYear()
      const nowMonth = now.getMonth()
      const nowDate = now.getDate()
      if (this.year === nowYear && this.month === nowMonth) {
        this.today = {
          show: true,
          date: nowDate
        }
      } else {
        this.today = {
          show: false
        }
      }

      // 显示已选择的日期
      if (
        this.year === this.selectDay.year &&
        this.month === this.selectDay.month
      ) {
        this.selectDay.show = true
      } else {
        this.selectDay.show = false
      }
    },
    // 格式化可选的日期
    filterSelected(i) {
      return this.selected.filter(item => {
        let arr = item.split('-')
        return (
          this.year === Number(arr[0]) &&
          this.month === Number(arr[1]) - 1 &&
          i === Number(arr[2])
        )
      })
    },
    // 切换显示上一个月
    handlePrevMonth() {
      if (this.month === 0) {
        this.month = 11
        this.year = parseInt(this.year) - 1
      } else {
        this.month = parseInt(this.month) - 1
      }
      this.monthText = this.months[this.month]
      this.render(this.year, this.month)
    },
    // 切换显示下一个月
    handleNextMonth() {
      if (this.month === 11) {
        this.month = 0
        this.year = parseInt(this.year) + 1
      } else {
        this.month = parseInt(this.month) + 1
      }
      this.monthText = this.months[this.month]
      this.render(this.year, this.month)
    },
    // 选择日期
    handleSelect(day, selected) {
      if (!selected) return
      this.selectDay = {
        show: true,
        year: this.year,
        month: this.month,
        date: day
      }
      this.$emit('select', this.year, this.month + 1, day)
    },
    // 关闭弹窗
    handleClickDialog() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-calendar_header {
  height: 50px;
  box-sizing: border-box;
  padding: 0 21px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 16px;
    height: 16px;
    padding: 5px;
  }
  span {
    font-size: 15px;
    color: #3f4a64;
  }
}
.qwui-calendar_week {
  width: 100%;
  height: 43px;
  display: flex;
  background-color: #fff;
  box-shadow: 0px 5px 5px -5px rgba(63, 74, 100, 0.1);
  .qwui-calendar_week_item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    color: #9196a1;
  }
}
.qwui-calendar_date {
  height: auto;
  margin-top: 12px;
  .qwui-calendar_date_week {
    width: 100%;
    height: 56px;
    display: flex;
    .qwui-calendar_date_day {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      color: #9196a1;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 33px;
        height: 33px;
      }
    }
    .selected {
      color: #3f4a64;
      font-weight: 500;
    }
    .disable {
      visibility: hidden;
    }
    .isToday {
      color: #5585f0;
    }
    .isSelect {
      color: #fff;
      font-weight: 500;
      span {
        background-color: #5585f0;
        border-radius: 50%;
      }
    }
  }
}
</style>
