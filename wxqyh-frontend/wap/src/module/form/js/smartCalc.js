//加法
Number.prototype.add = function(arg){
  var r1,r2,m;
  try{ r1 = this.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try{ r2 = arg.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m=Math.pow(10, Math.max(r1, r2))
  return (this * m + arg * m) / m
}
//减法
Number.prototype.sub = function (arg) {
  return this.add(-arg);
}
//乘法
Number.prototype.mul = function (arg)
{
  var m=0,s1=this.toString(),s2=arg.toString();
  try{m += s1.split(".")[1].length } catch (e) {}
  try{m += s2.split(".")[1].length} catch (e) {}
  return Number(s1.replace(".","")) * Number(s2.replace(".","")) / Math.pow(10, m)
}

var CalcEval = function() {};
//复杂的计算方法（包含括号）
CalcEval.prototype.complexEval = function(str) {
  if (str == null) {
    return "";
  }
  if (typeof str != "string") {//转化成字符串
    str = str + ""
  }
  var strArr = str.split(''),
    resultArr = [],
    tempArr = [];
  strArr.forEach(item => {
    if (item != ')') {
      resultArr.push(item);
    } else {
      var stopMark = '';
      while(stopMark != '(') {
        stopMark = resultArr.pop();
        if(stopMark != '(') {
          tempArr.unshift(stopMark);
        } else{
          var tempValue = this.simpleEval( tempArr.join('') );
          resultArr.push(tempValue);
          tempArr = [];
        }
      }
    }
  })
  return this.simpleEval( resultArr.join('') );
};
//简单的计算方法，只有加减乘除
CalcEval.prototype.simpleEval = function(str) {
  if (str == null) {
    return "";
  }
  if (typeof str != "string") {//转化成字符串
    str = str + ""
  }

  var valueArray = new Array();//值的数组
  var markArray = new Array();//符号的数组
  var tempValue = "";
  var ch = str.replaceAll('--','+').split("");
  var isOper = false;
  for(var i=0; i< ch.length; i++){
    if( ch[i] == "+" || ch[i] == "-" || ch[i] == "*" || ch[i] == "/") {//符号
      var dv = tempValue*1;
      if(isOper){
        var value = valueArray.pop();
        var mark = markArray.pop();
        dv = this.simpleTwoEval(mark, value, dv);
      }
      valueArray.push(dv);
      markArray.push(ch[i]);
      tempValue = "";
      isOper = false;
      if( ch[i] == "*" || ch[i] == "/" )
        isOper = true;
    }else{
      tempValue += ch[i] + "";
      if(i == ch.length -1){//最后一位
        var dv = tempValue*1;
        if(isOper){
          var dv1 = valueArray.pop();
          var mark = markArray.pop();
          var result = this.simpleTwoEval(mark, dv1, tempValue);
          dv = result;
        }
        valueArray.push(dv);
      }
    }
  }

  valueArray = this.reverseArray(valueArray);
  markArray =  this.reverseArray(markArray);
  while(valueArray.length > 1){
    var v1 = valueArray.pop();
    var v2 = valueArray.pop();
    var mark = markArray.pop();
    valueArray.push(this.simpleTwoEval(mark, v1, v2));
  }
  return valueArray[0];

};
//两个数的加减乘除
CalcEval.prototype.simpleTwoEval = function(mark,value1,value2){
  if(mark == "+"){
    return value1.add(value2);
  }else if(mark == "-"){
    return value1.sub(value2);
  }else if(mark == "*"){
    return value1.mul(value2);
  }else if(mark == "/"){
    return value1 / value2;
  }
  return 0;
};
//反转数组
CalcEval.prototype.reverseArray = function(oldArray){
  var newArray = new Array();
  var size = oldArray.length;
  for(var i=0; i< size; i++){
    newArray.push(oldArray.pop());
  }
  return newArray;

};

export function smartCalc(str) {
  if ( str.indexOf('(') != -1 ){
    return CalcEval.prototype.complexEval(str);
  } else {
    return CalcEval.prototype.simpleEval(str);
  }
}
