<template>
  <div class="assembly-date-picker">
    <div class="assembly-date">
      <div class="select-bar" @click="handleClickDatePicker">
        <div class="select-bar__item">
          <div class="select-bar__value">
            {{currentYear}}
            <i class="section__icon"></i>
          </div>
        </div>
        <div class="select-bar__item" v-if="type === 'quarter'">
          <div class="select-bar__value">
            {{currentQuarter}}
            <i class="section__icon"></i>
          </div>
        </div>
        <div class="select-bar__item" v-if="type === 'month'">
          <div class="select-bar__value">
            {{currentMonth}}
            <i class="section__icon"></i>
          </div>
        </div>
      </div>
    </div>
    <qw-cascade-picker
      :data="dateOptions"
      :selected-index="selectedIndex"
      @select="handleSelectDate"
      v-model="isVisibleDatePicker"
    ></qw-cascade-picker>
  </div>
</template>
<script>
function assemblyMonthOptions(quarter) {
  if (quarter) {
    const monthMap = {
      '1': [{value: 1, text: '1月'}, {value: 2, text: '2月'}, {value: 3, text: '3月'}],
      '2': [{value: 4, text: '4月'}, {value: 5, text: '5月'}, {value: 6, text: '6月'}],
      '3': [{value: 7, text: '7月'}, {value: 8, text: '8月'}, {value: 9, text: '9月'}],
      '4': [{value: 10, text: '10月'}, {value: 11, text: '11月'}, {value: 12, text: '12月'}],
    }
    return monthMap[quarter]
  } else {
    const allMonthMap = [
      {value: 1, text: '1月'}, {value: 2, text: '2月'}, {value: 3, text: '3月'},
      {value: 4, text: '4月'}, {value: 5, text: '5月'}, {value: 6, text: '6月'},
      {value: 7, text: '7月'}, {value: 8, text: '8月'}, {value: 9, text: '9月'},
      {value: 10, text: '10月'}, {value: 11, text: '11月'}, {value: 12, text: '12月'}
    ]
    return allMonthMap
  }
}

function assemblyQuarterOptions() {
  const quarterMap = {'1': '一季度', '2': '二季度', '3': '三季度', '4': '四季度'}
  return [1, 2, 3, 4].map(item => {
    return {
      value: item,
      text: quarterMap[item],
      children: assemblyMonthOptions(item)
    }
  })
}

function assemblyDateOptions(defaultDate, showQuarter) {
  const now = defaultDate;
  const endYear = now.getFullYear();
  const beginYear = now.getFullYear() - 9;
  const options = [];
  for (let year = beginYear; year <= endYear; year++) {
    const yearItem = {
      value: year,
      text: `${year}年`,
      children: showQuarter ? assemblyQuarterOptions() : assemblyMonthOptions()
    }
    options.push(yearItem)
  }
  return options
}

function calculateYearIndex(defaultDate, dateOptions) {
  const now = defaultDate;
  const currentYearItem = dateOptions.find(item => item.value === now.getFullYear())
  return currentYearItem ? dateOptions.indexOf(currentYearItem) : 0;
}

function calculateQuarterIndex(defaultDate) {
  const month = defaultDate.getMonth();
  return parseInt(month / 3) || 0;
}

function calculateMonthIndex(defaultDate, showQuarter) {
  const month = defaultDate.getMonth();
  if(showQuarter) return parseInt(month % 3) || 0;
  return parseInt(month) || 0;
}

/**
 * 计算索引值
 */
function calculateIndex(defaultDate, dateOptions, showQuarter) {
  if(showQuarter) return [calculateYearIndex(defaultDate, dateOptions), calculateQuarterIndex(defaultDate), calculateMonthIndex(defaultDate, showQuarter)]
  return [calculateYearIndex(defaultDate, dateOptions), calculateMonthIndex(defaultDate)]
}

function currentQuarterName(defaultDate) {
  const month = defaultDate.getMonth();
  const quarterNameMap = ['一季度', '二季度', '三季度', '四季度']
  const quarter = parseInt(month / 3);
  return quarterNameMap[quarter]
}

export default {
  name:"assemblyDatePicker",
  props:{
    showYear: {
      type: Boolean,
      default() {
        return true
      }
    },
    showQuarter: {
      type: Boolean,
      default() {
        return true
      }
    },
    showMonth: {
      type: Boolean,
      default() {
        return true
      }
    },
    type: { // quarter
        type: String,
        default() {
            return 'month'
        }
    },
    defaultDate:{
      type: Date,
      default() {
          return new Date();
      }
    }
  },
  data(){
    const date = this.defaultDate;
    return {
      isVisibleDatePicker: false,
      dateOptions: null,
      selectedIndex: -1,
      current: date,
      currentYear: `${date.getFullYear()}年`,
      currentQuarter: null,
      currentMonth: `${date.getMonth() + 1}月`,
      currentYearValue: date.getFullYear(),
      currentQuarterValue: null,
      currentMonthValue: date.getMonth() + 1,
    }
  },
  computed:{

  },
  watch:{

  },
  methods:{
    handleClickDatePicker() {
      this.isVisibleDatePicker = true
    },

    handleSelectDate([val_1, val_2, val_3], _, [name_1, name_2, name_3]) {
      this.currentYear = name_1
      this.currentQuarter = this.showQuarter ? name_2 : ''
      this.currentMonth = this.showQuarter ? name_3 : name_2
      this.currentYearValue = val_1
      this.currentQuarterValue = this.showQuarter ? val_2 : ''
      this.currentMonthValue = this.showQuarter ? val_3 : val_2
      // this.currentMonthValue = currentMonthValue >= 10 ? `${currentMonthValue}` : `0${currentMonthValue}`
      this.$emit('setDate',this.currentYear, this.currentQuarter, this.currentMonth, this.currentYearValue, this.currentQuarterValue, this.currentMonthValue)
    },
  },
  beforeCreate(){

  },
  created(){
    this.dateOptions = assemblyDateOptions(this.defaultDate, this.showQuarter)
    this.selectedIndex = calculateIndex(this.defaultDate, this.dateOptions, this.showQuarter)
    // console.log(this.selectedIndex)
    this.currentQuarter = currentQuarterName(this.defaultDate)
    this.currentQuarterValue = this.showQuarter ? parseInt(this.current.getMonth() / 3) + 1 : ''
  },
  beforeMount(){

  },
  mounted(){

  }
}
</script>
<style lang="scss" scoped>
  .assembly-date-picker {
    .assembly-date {
      .select-bar {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 15px;
        justify-content: center;
        background: #ffffff;

        .select-bar__item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          margin-left: 20px;

          .select-bar__value {
            height: 21px;
            font-size: 15px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 22px;
            color: rgba(0, 0, 0, 1);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .section__icon {
            display: inline-block;
            vertical-align: middle;
            width: 9px;
            height: 6px;
            background-image: url('~@/module/channelManagement/static/images/icon_select_arrow.png');
            background-repeat: no-repeat;
            background-size: 100%;
            margin-left: 6px;
          }

        }
      }
    }
  }
</style>
