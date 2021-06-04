export function formatNumber(n) {
  const str = n.toString()
  return str[1]
    ? str
    : `0${str}`
}

// 时间格式化
export function formatTime(date) {
  const hour = date.getHours()
  const minute = date.getMinutes()

  const time = [hour, minute].map(formatNumber).join(':')

  return time
}

//获取年份(前后年),return ['2018-01','2018-12']
export function getDataYear(status,date){
  let currentTime = "";
  let current = []
  date? currentTime = new Date(date) : currentTime = new Date();
  let currentYear = currentTime.getFullYear();

  if(status=='pre'){  //上年
    currentYear--
  }else if(status=='next'){//下年
    currentYear++
  }
  current.push(`${currentYear}-01`,`${currentYear}-12`)
  return current
}

//获取年月，或上一个年月
//getCurrentYearMonth(),getCurrentYearMonth('pre'),getCurrentYearMonth('next')
//return ['2018-01',{'currentYear':'2018','currentMonth':'6'}
export function getCurrentYearMonth(status,date){
  let yearMonth = []
  let current={
    currentYear:2018,
    currentMonth:6
  }
  let currentTime = ""
  date? currentTime = new Date(date) : currentTime = new Date()
  current.currentMonth = currentTime.getMonth() + 1
  current.currentYear = currentTime.getFullYear()

  if(status=='pre'){  //上个月
      current.currentMonth--
      if(current.currentMonth<1){
        current.currentYear--
        current.currentMonth=12
      }
  }else if(status=='next'){//下个月
      current.currentMonth++
      if(current.currentMonth>12){
        current.currentYear++
        current.currentMonth=1
      }
  }
  yearMonth.push(`${current['currentYear']}-${formatNumber(current['currentMonth'])}`,current)
  return yearMonth
}

//获取年季
//return YearQuarter:['2018-04','2018-06']
export function getDataYearQuarter(status,date){
  let YearQuarter = []
  let current=getCurrentYearMonth(status,date)[1]
  let quarter=getQuarterStartEndMonth(current.currentMonth)
  YearQuarter.push(`${current.currentYear}-${quarter.quarterStartMonth}`,`${current.currentYear}-${quarter.quarterEndMonth}`)
  return YearQuarter
}

//获取季度开始和结束的月份
// argument:'5',return quarter:{'quarterStartMonth':'04',quarterEndMonth:'06'}
export function getQuarterStartEndMonth(nowMonth){
  let quarter={
      quarterStartMonth:'01',
      quarterEndMonth:'03'
  }
  if(3 < nowMonth && nowMonth<7){//第二季度4-6
      quarter.quarterStartMonth = '04'
      quarter.quarterEndMonth = '06'
  }else if(6 < nowMonth && nowMonth<10){//第三季度7-9
      quarter.quarterStartMonth = '07'
      quarter.quarterEndMonth = '09'
  }else if(9 < nowMonth && nowMonth<13){//第四季度10-12
      quarter.quarterStartMonth = 10
      quarter.quarterEndMonth = 12
  }
  return quarter
}

//获取季度开始和结束的时间转换
// argument:'2018-01',return '2018-1'
export function  getQuarterDate(dateStr){
  let dateStrArray = dateStr.split("-");
  let quarterStr = null;
  if (0 < dateStrArray[1] && dateStrArray[1]<4) {
      quarterStr = 1;
  } else if(3 < dateStrArray[1] && dateStrArray[1]<7){//第二季度4-6
      quarterStr = 2;
  }else if(6 < dateStrArray[1] && dateStrArray[1]<10){//第三季度7-9
      quarterStr = 3;
  }else if(9 < dateStrArray[1] && dateStrArray[1]<13){//第四季度10-12
      quarterStr = 4;
  }
  let result = dateStrArray[0] + "-" + quarterStr;
  return result;
}

// 转为金钱格式
export function  formatMoney(money){
  // 返回处理后的值
  var v, j, sj, rv = "";
  money = money.toString();
  v = money.replace(/,/g, "").split(".");
  j = v[0].length % 3;
  sj = v[0].substr(j).toString();
  for (var i = 0; i < sj.length; i++) {
    rv = (i % 3 == 0) ? rv + "," + sj.substr(i, 1) : rv + sj.substr(i, 1);
  }
  var rvalue = (v[1] == undefined) ? v[0].substr(0, j) + rv : v[0].substr(0, j) + rv + "." + v[1];
  if (rvalue.charCodeAt(0) == 44) {
    rvalue = rvalue.substr(1);
  }
  return rvalue;
}

// 将百分比的数值类型处理成 数字+% 的形式
export function formatPercentage(value) {
  if (value) {
    let fieldValue, point_num;
    let arr = value.toString().split(".");
    if (arr[1]) {
      point_num = arr[1].length;
    }
    if (!point_num) {
      fieldValue = parseInt(value) + '%';  
    } else if(value.toString().charAt(0) ===  '.'){
			fieldValue = value.toString() + '%';
		} else {
      fieldValue = value + '%';
    }
    return fieldValue;
  } else if(value === '0'){
    fieldValue = value + '%';
    return fieldValue;
  } else {
    return '';
  }
}