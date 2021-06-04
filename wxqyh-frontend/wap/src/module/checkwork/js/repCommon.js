export function HashMap() {

  /** Map 大小 **/
  var size = 0;
  /** 对象 **/
  var entry = {};

  /** 存 **/
  this.put = function (key, value) {
    if (!this.containsKey(key)) {
      size++;
    }
    entry[key] = value;
  };

  /** 取 **/
  this.get = function (key) {
    return this.containsKey(key) ? entry[key] : null;
  };

  /** 删除 **/
  this.remove = function (key) {
    if (this.containsKey(key) && ( delete entry[key] )) {
      size--;
    }
  };

  /** 是否包含 Key **/
  this.containsKey = function (key) {
    return (key in entry);
  };

  /** 是否包含 Value **/
  this.containsValue = function (value) {
    for (var prop in entry) {
      if (entry[prop] == value) {
        return true;
      }
    }
    return false;
  };

  /** 所有 Value **/
  this.values = function () {
    var values = [];
    for (var prop in entry) {
      values.push(entry[prop]);
    }
    return values;
  };

  /** 所有 Key **/
  this.keys = function () {
    var keys = [];
    for (var prop in entry) {
      keys.push(prop);
    }
    return keys;
  };

  /** Map Size **/
  this.size = function () {
    return size;
  };

  /* 清空 */
  this.clear = function () {
    size = 0;
    entry = {};
  };
}
//处理查看申诉明细
export function handleRepDetailed(data){
  var repList = data.repList;
  if(repList && repList.length > 0){
    var repVo;
    var rdList;
    var startMap = getCheckWorkDetailedMap(data);//已经申诉的签到签退map
    for(var i = 0; i < repList.length; i++){
      repVo = repList[i];
      if(!repVo){
        continue;
      }
      rdList = repVo.rdList;
      if(rdList && rdList.length > 0){
        //初始化申诉签到签退
        getSignTimeHtml(rdList, startMap);
      }
    }
  }
};
//获取考勤明细map
export function getCheckWorkDetailedMap(resultData){
  //初始化默认签到时间
  var startList = resultData.startList;//所有签到签退
  var startMap = new HashMap();//已经申诉的签到签退map
  if(startList && startList.length > 0){
    var rdvo;
    var keyId;
    for(var i = 0; i < startList.length; i++){
      rdvo = startList[i];
      keyId = rdvo.id;
      if("3" == rdvo.detailedSignType || !keyId){//考勤明细id不存在，拿规则设置的签到签退的id
        keyId = rdvo.signPosintionId;
      }
      startMap.put(keyId,rdvo);
    }
  }
  return startMap;
};
//获取显示html
export function getSignTimeHtml(rdList, startMap){
  var vo;
  var svo;
  var repType;
  var detailedSignTime;
  for(var i = 0; i < rdList.length; i++){
    vo = rdList[i];
    repType = vo.repType;
    svo = null; //申诉的是弹性工作时长不足时，svo没有
    if(1 == repType){//申诉的是已考勤的
      svo = startMap.get(vo.detailedId);
    }else if(2 == repType){//申诉的是未考勤的
      svo = startMap.get(vo.ext1);
    }else if(3 == repType){ //显示需要申诉的弹性工作时长
      vo["signTime"] = vo.ext1 ? vo.ext1 + "小时" : "0小时";
      vo["signType"] = "";
      vo["signStatusDesc"] = "工作时长不足";
      vo["signAddress"] = "";
    }
    if(svo){
      svo.status = vo.signStatus;//显示原来申诉前的考勤状态
      detailedSignTime = vo.detailedSignTime;
      if(detailedSignTime){
        svo.signinTime = detailedSignTime;
      }
      //显示的需要申诉的签到/退（只显示不能选中）
      vo["signTime"] = svo.signinTime;
      if(svo.signType=='1'){
        vo["signType"] = "签到";
      }else{
        vo["signType"] = "签退";
      }
      if(svo.status){
        vo["signStatusDesc"] = handleStatusDesc(svo.status,svo.abnormalTime);
      }else{
        vo["signStatusDesc"] = "";
      }
      if(svo.signAddress){
        vo["signAddress"] = svo.signAddress;
      }else{
        vo["signAddress"] = "无考勤记录信息";
      }
    }
  }

};
//考勤状态描述
export function handleStatusDesc(status,abnormalTime){
  abnormalTime=abnormalTime>60?parseInt(abnormalTime/60)+"时"+(abnormalTime%60)+"分":abnormalTime+"分";
  var desc = "";
  if("2"==status){//迟到
    desc += "迟到" + abnormalTime;
  }else if("3"==status){//早退
    desc += "早退" + abnormalTime;
  }else if("4"==status){//偏离迟到
    desc += "迟到" + abnormalTime + ", 偏离位置";
  }else if("5"==status){//偏离早退
    desc += "早退" + abnormalTime + ", 偏离位置";
  }else if("6"==status){//偏离位置(考勤时间正常)
    desc += "偏离位置";
  }else if("7"==status){//IP异常迟到
    desc += "迟到" + abnormalTime + ", IP异常";
  }else if("8"==status){//IP异常早退
    desc += "早退" + abnormalTime + ", IP异常";
  }else if("9"==status){//IP异常(考勤时间正常)
    desc += "IP异常";
  }
  return desc;
};
//校验当天考勤的哪些未考勤可以申诉
export function checkIsSignTimeRep(signDateDesc, refreshTimeMin, signinTimeStr, nowDate, nextSignDateDesc, refreshTimeType, beforeSignDateDesc){
  let hasRep = true;//能申诉
  if(signDateDesc && refreshTimeMin){
    if(signinTimeStr){
      let signinTimeMin = parseFloat(signinTimeStr.substring(0, 2)) * 60 + parseFloat(signinTimeStr.substring(3, 5));
      let signinDate;
      if(2 == refreshTimeType){ //2:考勤是从考勤日的昨天到考勤日的当天
        if(signinTimeMin < refreshTimeMin){ //考勤日当天的考勤时间
          signinDate = new Date(signDateDesc + " " + signinTimeStr + ":00");
        }else{ //考勤日昨天的考勤时间
          signinDate = new Date(beforeSignDateDesc + " " + signinTimeStr + ":00");
        }
      }else{ //考勤是从考勤日的当天到考勤日的明天
        if(signinTimeMin < refreshTimeMin){ //考勤日第二天的考勤时间
          signinDate = new Date(nextSignDateDesc + " " + signinTimeStr + ":00");
        }else{ //考勤日当天的考勤时间
          signinDate = new Date(signDateDesc + " " + signinTimeStr + ":00");
        }
      }
      if(nowDate.getTime() <= signinDate.getTime()){//未考勤的时间大于等于当前时间，不可以申诉
        hasRep = false;//不能申诉
      }
    }else{ //不能申诉未考勤的
      hasRep = false;//不能申诉
    }
  }else{ //不能申诉未考勤的
    hasRep = false;//不能申诉
  }
  return hasRep;
};
//获取日期的第二天的日期
export function getNextSignDate(signDate){
  var signDate = new Date(signDate + " 00:00:00");
  var nextSignDate = new Date(signDate.setDate(signDate.getDate() + 1));
  return nextSignDate.getFullYear() + "/" + (nextSignDate.getMonth()+1) + "/" + nextSignDate.getDate();
}
//获取日期的昨天的日期
export function getBeforeSignDate(signDate){
  var signDate = new Date(signDate + " 00:00:00");
  var brforeSignDate = new Date(signDate.setDate(signDate.getDate() - 1));
  return brforeSignDate.getFullYear() + "/" + (brforeSignDate.getMonth()+1) + "/" + brforeSignDate.getDate();
}
//获取已经申诉的签到签退map
export function getRepCheckWorkSignInfoMap(resultData){
  //初始化默认签到时间
  var rdList = resultData.rdList;//已经申诉的签到签退
  var rdMap = new HashMap();//已经申诉的签到签退map
  if(rdList && rdList.length > 0){
    var rdvo;
    var dvoArr;
    var repType;
    var keyId;
    for(var i = 0; i < rdList.length; i++){
      rdvo = rdList[i];
      repType = rdvo.repType;
      if(1 == repType){//1：申诉的是已考勤的
        keyId = rdvo.detailedId;//考勤明细的id
      }else if(2 == repType){//申诉的是未考勤的
        keyId = rdvo.ext1;//规则设置的签到/退的id
      }else if(3 == repType){ //申诉的是弹性工作时长不足
        keyId = rdvo.infoId; //考勤统计记录id
      }
      if(3 == repType){ //申诉的是弹性工作时长不足
        rdMap.put(keyId + "_" + repType, rdvo); //因为弹性工作时长不足只允许申诉一次
      }else{
        dvoArr = rdMap.get(keyId);
        if(!dvoArr){
          dvoArr = new Array();
          rdMap.put(keyId,dvoArr);
        }
        dvoArr.push(rdvo);
      }
    }
  }
  return rdMap;
};
//显示的需要申诉的签到/退
export function setRepSignInfo(vo, rdMap, signTime){
  var keyId;
  if(signTime){//考勤时间存在，说明要申诉的是已考勤的
    keyId = vo.id;
  }else{//申诉的是未考勤时
    keyId = vo.signPosintionId;
  }
  var dvoArr = rdMap.get(keyId);
  if(dvoArr && dvoArr.length > 0){
    var rdvo;
    for(var i = 0; i < dvoArr.length; i++){
      rdvo = dvoArr[i];
      if(3 == rdvo.status || 4 == rdvo.status){//3：审核中；4：审核通过。不能再重新申诉
        vo["isRep"] = false;
      }
    }
  }
};
//判断有漏签时，必须先选择所有漏签后才能选弹性工作时长不足
//传送考勤统计记录id（infoId）、申诉的考勤统计记录下面所有需要申诉的考勤明细id、处理方式（1：直接控制多选框能否选中；2：返回能否申诉的true（能申诉）或false（不能申诉））
//若有漏签为选中时，弹性工作时长申诉的多选框不能选中；否则可以
export function checkAllNoneSignIds(noneSignInfoMap,infoId, repSignIds){
  var noneSignNum = noneSignInfoMap.get(infoId);
  if(!noneSignNum){ //没有漏签不需要判断，即是没有弹性工作时长不足需要申诉
    return true;
  }
  if(!repSignIds){ //没有选择漏签申诉明细不能申诉弹性工作时长不足
    //需要把弹性工作时长不足变成不可选，并已经选中的也变成不选中
    return false;
  }
  var repSignNum = 0; //申诉的明细数量
  var repSignIdArr = repSignIds.substring(0, repSignIds.length - 1).split(","); //去掉最后一个逗号并获取所有申诉明细数组
  for(var i = 0; i < repSignIdArr.length; i++){
    if("0" == noneSignInfoMap.get(repSignIdArr[i])){ //0:该申诉的明细id是漏签
      repSignNum += 1;
    }
  }
  if(noneSignNum == repSignNum){ //可以申诉弹性工作时长不足
    return true;
  }else{ //不可以申诉弹性工作时长不足
    return false;
  }
};
//去掉申诉的所有签到签退的id的最后一个逗号
export function handleDetailedIds(detailedIds){
  if(detailedIds){
    detailedIds = detailedIds.replace(/(^\s*)|(\s*$)/g, "");
    var lastStr = detailedIds.charAt(detailedIds.length-1);
    if(","==lastStr){
      detailedIds = detailedIds.substring(0,detailedIds.length-1);
    }
  }
  return detailedIds;
};
