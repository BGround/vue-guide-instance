export const getApproveStatus = (status) => {
  let statusObj = {};

  if (status) {
    const statusFormat = [
      { status:'审批中', class:'status-blue-hollow', statusText: 'i18n.reim.status.approving' },
      { status:'已审批', class:'status-blue-solid', statusText: 'i18n.reim.status.approved' },
      { status:'待转账', class:'status-green-hollow', statusText: 'i18n.reim.status.transfer' },
      { status:'已转账', class:'status-green-solid', statusText: 'i18n.reim.status.transferred' },
      { status:'已取消', class:'status-gray-solid', statusText: 'i18n.reim.status.cancel' },
      { status:'已退审', class:'status-red-solid', statusText: 'i18n.reim.status.retreat' },
      { status: '转账失败', class: 'status-red-hollow', statusText: 'i18n.reim.status.transferFail'},
      { status: '待还款', class: 'status-yellow-hollow', statusText: 'i18n.reim.status.repayment'},
      { status: '已还款', class: 'status-yellow-solid', statusText: 'i18n.reim.status.repaid' },
      { status: '核销中', class: 'status-violet-hollow', statusText: 'i18n.reim.status.repaid' },
      { status: '已核销', class: 'status-violet-solid', statusText: 'i18n.reim.status.repaid' },
    ];

    statusObj =  statusFormat.find(item => item.status == status);
  }
  return statusObj;
}
//借款
export const getDebitItemStatus = (status) => {
  let statusObj = {};
//0草稿 1审批中 2取消 3退审 4待转账/已审批 5待还款 6已还款 7转账失败
  if (status) {
    const statusFormat = [
      { status:'1', class:'status-yellow-solid', statusText: 'i18n.reim.status.approving' },
      { status:'2', class:'status-gray-solid', statusText: 'i18n.reim.status.cancel' },
      { status:'3', class:'status-red-solid', statusText: 'i18n.reim.status.retreat' },
      { status:'4', class:'status-green-solid', statusText: 'i18n.reim.status.approved' },
      { status:'5', class:'status-yellow-solid', statusText: 'i18n.reim.status.repayment' },
      { status:'6', class: 'status-green-solid', statusText: 'i18n.reim.status.repaid'},
      { status:'7', class: 'status-red-solid', statusText: 'i18n.reim.status.transferFail'},
    ];

    statusObj =  statusFormat.find(item => item.status == status);
  }else {
    statusObj = { status:'0', statusText: 'i18n.reim.status.draft',type:'借款单' }
  }
  return statusObj;
};
//新的审批列表报销状态
export const getNewApproveStatus = (status) => {
  let statusObj = {};
//0草稿 1审批中 2取消 3退审 4待转账/已审批 5已转账 6转账失败
  if (status) {
    const statusFormat = [
      { status:'1', class:'status-yellow-solid', statusText: 'i18n.reim.status.approving' },
      { status:'4', class:'status-green-solid', statusText: 'i18n.reim.status.approved' },
      { status:'5', class:'status-green-solid', statusText: 'i18n.reim.status.transferred' },
      { status:'2', class:'status-gray-solid', statusText: 'i18n.reim.status.cancel' },
      { status:'3', class:'status-red-solid', statusText: 'i18n.reim.status.retreat' },
      { status:'6', class: 'status-red-solid', statusText: 'i18n.reim.status.transferFail'},
      // { status: '核销中', class: 'status-violet-hollow', statusText: 'i18n.reim.status.repaid' },
      // { status: '已核销', class: 'status-violet-solid', statusText: 'i18n.reim.status.repaid' },
    ];

    statusObj =  statusFormat.find(item => item.status == status);
  }else{
      statusObj = { status:'0', statusText: 'i18n.reim.status.draft',type:'报销单' }
  }
  return statusObj;
};

export function add0(m){return m<10?'0'+m:m }
export const format =(time,value)=>{
  //time(时间戳)是整数，否则要parseInt转换，value（想要得到返回的时间格式day:天 second:具体到秒）
  var time = new Date(time);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  if(value=='day'){
    return y+'-'+add0(m)+'-'+add0(d)
  }else if(value=='second'){
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
  }
}

let debounceTimer;
export function debounce(func, delay) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    func.apply(this);
  }, delay);
}

export function formatMoney(money) {
  let absValue = Math.abs(money);
  if (absValue < 1000) {
    return Number(money).toFixed(2);
  } else if (absValue > 10000) {
    return money > 0 ? _.toTenThousands(money) + '万' : `-${_.toTenThousands(absValue)}万`;
  } else {
    return  _.formatMoney(money, 2);
  }
}

export function addNum(num1, num2) {
  let num1Digits = (num1.toString().split('.')[1] || '').length;
  let num2Digits = (num2.toString().split('.')[1] || '').length;
  let baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));

  return (num1 * baseNum + num2 * baseNum) / baseNum;
}
