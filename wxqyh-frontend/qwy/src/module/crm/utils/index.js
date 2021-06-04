/**
 * @param {string} value 将数值转换成 小数 的形式
 */
function formatDecamal(value) {
  if (value) {
    var fieldValue, point_num;
    var arr = value.toString().split(".");
    if (arr[1]) {
      point_num = arr[1].length;
    }
    if (!point_num) {
      fieldValue = parseInt(value) + '.00';
    } else {
      fieldValue = value;
    }
    return fieldValue;
  } else if (value == '0') {
    fieldValue = value + '.00';
    return fieldValue;
  } else {
    return '';
  }
}
/**
 * @param {string} value 将数值转换成 数字+% 的形式
 */
function formatPercentage(value) {
  if (value) {
    var fieldValue, point_num;
    var arr = value.toString().split(".");
    if (arr[1]) {
      point_num = arr[1].length;
    }
    if (!point_num) {
      fieldValue = parseInt(value) + '%';
    } else if (value < 1) { // 防止出现   . + 数字 + % 的情况
      fieldValue = (value * 10 / 10) + '%';
    } else {
      fieldValue = value + '%';
    }
    return fieldValue;
  } else if (value == '0') {
    fieldValue = value + '%';
    return fieldValue;
  } else {
    return '';
  }
}
export {
  formatDecamal,
  formatPercentage
}
