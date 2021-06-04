import dayjs from "dayjs";

const defaultDate = dayjs(new Date()).subtract(3, 'month').toDate();
function assemblyMonthOptions(quarter) {
  if (quarter) {
    const monthMap = {
      '1': [{value: 1, text: '一月'}, {value: 2, text: '二月'}, {value: 3, text: '三月'}],
      '2': [{value: 4, text: '四月'}, {value: 5, text: '五月'}, {value: 6, text: '六月'}],
      '3': [{value: 7, text: '七月'}, {value: 8, text: '八月'}, {value: 9, text: '九月'}],
      '4': [{value: 10, text: '十月'}, {value: 11, text: '十一月'}, {value: 12, text: '十二月'}],
    }
    return monthMap[quarter]
  } else {
    const allMonthMap = [
      {value: 1, text: '一月'}, {value: 2, text: '二月'}, {value: 3, text: '三月'},
      {value: 4, text: '四月'}, {value: 5, text: '五月'}, {value: 6, text: '六月'},
      {value: 7, text: '七月'}, {value: 8, text: '八月'}, {value: 9, text: '九月'},
      {value: 10, text: '十月'}, {value: 11, text: '十一月'}, {value: 12, text: '十二月'}
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
      // children: assemblyMonthOptions(item)
    }
  })
}

function assemblyDateOptions(showQuarter) {
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

function calculateYearIndex(dateOptions) {
  const now = defaultDate;
  const currentYearItem = dateOptions.find(item => item.value === now.getFullYear())
  return currentYearItem ? dateOptions.indexOf(currentYearItem) : 0;
}

function calculateQuarterIndex() {
  const month = defaultDate.getMonth();
  return parseInt(month / 3) || 0;
}

function calculateMonthIndex(showQuarter) {
  const month = defaultDate.getMonth();
  if(showQuarter) return parseInt(month % 3) || 0;
  return parseInt(month) || 0;
}

/**
 * 计算索引值
 */
function calculateIndex(dateOptions, showQuarter) {
  if(showQuarter) return [calculateYearIndex(dateOptions), calculateQuarterIndex()]
  return [calculateYearIndex(dateOptions), calculateMonthIndex()]
}

function currentQuarterName() {
  const month = defaultDate.getMonth();
  const quarterNameMap = ['一季度', '二季度', '三季度', '四季度']
  const quarter = parseInt(month / 3);
  return quarterNameMap[quarter]
}

export default {
  data() {
    const date = defaultDate
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
  created() {
    this.dateOptions = assemblyDateOptions(this.showQuarter)
    this.selectedIndex = calculateIndex(this.dateOptions, this.showQuarter)
    this.currentQuarter = currentQuarterName()
    this.currentQuarterValue = this.showQuarter ? parseInt(this.current.getMonth() / 3) + 1 : ''
  },
  methods: {
    handleClickDatePicker() {
      this.isVisibleDatePicker = true
    },

    handleSelectDate([val_1, val_2, val_3], _, [name_1, name_2, name_3]) {
      this.currentYear = name_1
      this.currentQuarter = this.showQuarter ? name_2 : ''
      this.currentMonth = this.showQuarter ? name_3 : name_2
      this.currentYearValue = val_1
      this.currentQuarterValue = this.showQuarter ? val_2 : ''
      let currentMonthValue = this.showQuarter ? val_3 : val_2
      this.currentMonthValue = currentMonthValue >= 10 ? `${currentMonthValue}` : `0${currentMonthValue}`
      this.initData()
    },
  }
}

