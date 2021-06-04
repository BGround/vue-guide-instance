// const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
// /^((\d{5,15})|(\d{4}|\d{3})-(\d{7,8})(-\d{3,6})?)$/g
const phoneReg = /^[0-9][0-9-]*[^-]$/;
const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/;
// (/^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/

//百度地图key
const baiduMapAK = "BD9b7cb09c4fdaf693b8df3289776cc9"

/**
 * script标签引入
 * @param {String} url 
 * @param {Function} success 成功回调
 */
function loadJS(url, success) {
  let domScript = document.createElement('script');
  domScript.src = url;
  success = success || function () {};
  domScript.onload = domScript.onreadystatechange = function () {
    if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
      success();
      this.onload = this.onreadystatechange = null;
    }
  }
  document.getElementsByTagName('head')[0].appendChild(domScript);
}

//自定义字段 类型
const customTypeList = [{
    name: "单行文本框",
    key: 'text',
    value: 1,
  },
  {
    name: "多行文本框",
    key: 'textarea',
    value: 2
  },
  {
    name: "下拉菜单",
    key: 'select',
    value: 0
  },
  {
    name: "联系方式",
    key: 'phone',
    value: 3
  },
  {
    name: "日期类型",
    key: "date",
    value: 4
  },
  {
    name: "数值类型",
    key: "number",
    value: 5,
  }
]

//自定义字段 数值类型
const customNumber = [{
    value: "1",
    reg: /^(\-)?[0-9]+$/,
    tips: "请输入整数",
    key: "integer",
    name: "整数",
  },
  {
    value: "2",
    reg: /^(\-)?\d+(\.\d{1,2})?$/,
    tips: "请输入小数, 小数须精确到小数点后两位",
    name: "小数",
    key: "decimals",
  },
  {
    value: "3",
    reg: /^(\-)?\d+(\.\d{1,2})?$/,
    tips: "请输入小数或整数, 小数须精确到小数点后两位",
    name: "百分比",
    key: "percent",
  }
];
//付款方式
const paymentType = [{
  label: "支票",
  value: '0'
}, {
  label: "现金",
  value: '1'
}, {
  label: "邮政汇款",
  value: '2'
}, {
  label: "电汇",
  value: '3'
}, {
  label: "网上转账",
  value: '4'
}, {
  label: "支付宝",
  value: '5'
}, {
  label: "微信支付",
  value: '6'
}, {
  label: "刷卡",
  value: '7'
}, {
  label: "其他",
  value: '8'
}, ]
export {
  phoneReg,
  emailReg,
  customTypeList,
  customNumber,
  baiduMapAK,
  loadJS,
  paymentType
}
