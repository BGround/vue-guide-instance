import axios from 'axios'
import {form_validation} from './validation'
import { correctCalc } from './correctCalc'
export function commitComment(data, cb) {                                      //新增评论
	return axios.post(_.baseURL + "/portal/portalForm/commitComment.do", {
		...data
	}).then(function (result) {
		_.hideLoading();
		if (result.code === '0') {
			_.tooltips_succeed("评论成功");
			cb(result.data)
		} else {
			_.alert('提示', result.desc)
		}
	})
}
//加载上一次的人员
function getOldGivenList(param){
	return axios.post(_.baseURL + '/portal/portalForm/getOldGivenList.do', param)
}
//获取子表单的默认数据
function getChildDefault(param) {
	if(window.location.href.indexOf('/open/') != -1){
		return axios.post(_.baseURL + '/open/openForm/getChildDefault.do', param)
	}else{
		return axios.post(_.baseURL + '/portal/portalForm/getChildDefault.do', param)
	}
}

//查询表单数据
function getFrom(type,id, corpId, isSurvey) {
  if (type === 'open') {
    if(isSurvey) {  //如果是满意度调查
      return axios.post(_.baseURL + '/open/openForm/getFrom.do', {
        id: id,
        corpId: corpId,
        defAttr: 1
      })
    }
    return axios.post(_.baseURL + '/open/openForm/getFrom.do', {id});    //外部单
  }
  type = type || "add";
  var api = {
    add: "getFrom",             //填单
    edit: "editGetFroms",       //草稿、提单人编辑加载
    copy: "copyGetFroms",       //复制表单入口
    toEdit: "getFormToedit",    //负责人编辑
  }
  return axios.post(_.baseURL + '/portal/portalForm/' + api[type] + '.do', {id})
}

export function commentListMore(data, cb, isOpen) {                                      //加载更多评论
  let url = '/portal/portalForm/listComment.do';
  isOpen && (url = '/open/openForm/listComment.do');
  axios.post(_.baseURL + url, {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

export function addCommentList(data, cb) {                                      //新增评论
	axios.post(_.baseURL + "/portal/portalForm/commitComment.do", {
		...data
	}).then(function (result) {
		_.hideLoading();
		if (result.code === '0') {
			_.tooltips_succeed("评论成功");
			cb(result.data)
		} else {
			_.alert('提示', result.desc)
		}
	})
}

export function addOpenCommentList(data, cb) {                                      //新增外部单评论
	axios.post(_.baseURL + "/open/openForm/commitComment.do", {
		...data
	}).then(function (result) {
		_.hideLoading();
		if (result.code === '0') {
			_.tooltips_succeed("评论成功");
			cb(result.data)
		} else {
			_.alert('提示', result.desc)
		}
	})
}


export function deleteCommentList(data, cb) {                                  //删除评论
	_.showLoading("删除中...");
	axios.post(_.baseURL + "/portal/portalForm/deleteComment.do", {
		...data
	}).then(function (result) {
		_.hideLoading();
		if (result.code === '0') {
			_.tooltips_succeed("删除成功");
			cb(result)
		} else {
			_.alert('提示', result.desc)
		}
	})
}

export function deleteOpenCommentList(data, cb) {                                  //删除外部单评论
	_.showLoading("删除中...");
	axios.post(_.baseURL + "/open/openForm/deleteComment.do", {
		...data
	}).then(function (result) {
		_.hideLoading();
		if (result.code === '0') {
			_.tooltips_succeed("删除成功");
			cb(result)
		} else {
			_.alert('提示', result.desc)
		}
	})
}

// 获取处理人信息
export function getMember(ids, cb) {
	var memberUrl = _.baseURL + "/portal/portalForm/getUserRedundancyListByUserId.do";
	var userInfo = [];
	return axios.post( memberUrl ,{
			'id': ids
		}).then(function (result) {
			if(result.code === '0') {
				var info = result.data;
				for(var i in info) {
					userInfo.push({
						userId:info[i].userId,
						personName:info[i].personName,
						headPic:info[i].headPic
					});
				}
				cb(userInfo);
			} else {
        cb('');
			}
		})
}

// 获取委托人数据
export async function getEntrustInfo(ruleId, callback) {
  _.showLoading();
  var entrustRuleUrl = _.baseURL + '/portal/flow/flowEntrust/getEntrustRuleDetail.do';
  await axios.post( entrustRuleUrl, {
    'tbQyFlowEntrustRulePO.id':ruleId
  }).then(function (result){
    _.hideLoading();
    if(result.code == '0') {
      callback(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

export function getIsShowDetailTip(callback) {
  axios.get(_.baseURL + '/portal/portalForm/getIsShowDetailTip.do').then(function (result) {
    if (result.code === '0') {
      callback(result.data.value);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

export function setIsShowDetailTip() {
  axios.post(_.baseURL + '/portal/portalForm/setIsShowDetailTip.do',{value:'0'}).then(function (result) {
    if (result.code === '0') {
    } else {
      _.alert('提示', result.desc);
    }
  })
}

//新增/编辑委托规则
export async function updateEntrust(data,saveURL) {
  _.showLoading("i18n.submitting");
  const res = await axios({
    url: saveURL,
    method: 'POST',
    data: data
  });
  _.hideLoading();
  if(res.code == "0") {
    return res.data
  } else {
    _.alert('提示', res.desc);
    throw Error;
  }
}

//获取表单详情数据
function copyGetFroms(id) {
	return axios.post(_.baseURL + '/portal/portalForm/copyGetFroms.do', {id});
}

//获取表单详情数据
function detailGetFroms(id) {
    return axios.post(_.baseURL + '/portal/portalForm/detailGetFroms.do', {id});
}
//获取外部单详情数据
function openDetailGetFroms(id) {
    return axios.post(_.baseURL + '/open/openForm/detailGetFroms.do', {id});
}

//编辑查询表单数据
function editGetFroms(id) {
    return axios.post(_.baseURL + '/portal/portalForm/editGetFroms.do', {id});
}

//获取审批信息
function getApprove(id) {
    return new Promise(function (resolve, reject) {
        _.ajax({
            url: _.baseURL + "/portal/workflowAction!getApprove.action",
            type: "POST",
            data: {
                'id': id,
            },
            dataType: "json",
            success: function (result) {
                resolve(result);
            },
        });
    })
}

function saveFormData(data){
	var key = location.href + dataBase.config.userId;
	window.localStorage.setItem(key,data);
}
function removeFormData(){
	var key = location.href + dataBase.config.userId;
	window.localStorage.removeItem(key);
}
function getFormData() {
	var key = location.href + dataBase.config.userId;
	return window.localStorage.getItem(key);
}
//表单渲染函数
function equation(data) {
    var result = [];
    var ids = data.map(function (field) {
        return field._id;
    });

    data.forEach(function (field) {
        var equationPO = {};
        if ('EquationField' == field._type) {
            var calculator = field.calculator;
            if (calculator) {
                var matchs = ids.filter(function (id) {
                    return calculator.indexOf(id) != -1
                })
                equationPO.calculator = calculator;
                equationPO.matchs = matchs;
                equationPO.id = field._id;
                result.push(equationPO);
            }
        }
    })
    return result;
}
function setLinkage(schema, store){
  //数据联动逻辑处理
  var linkageMap = [],
    linkageIds = [],
    linkageIdGroups = [];
  schema.forEach(function(field){
    if(field.predefinedType === 3 && !isEmpty(field.linkage)){
      let curShowKey = field._id,
        linkage = field.linkage,
        linkageMapData = {},
        idGroups = [],
        arr =[],
        isSame = false;
      for(let x=0,l=linkage.condition.length; x<l ; x++){
        let linkageMapData = {};
        let curItemKey = linkage.condition[x].curItemKey;

        linkageMapData.curShowKey = curShowKey;
        linkageMapData.curItemKey =  curItemKey;
        linkageMapData.refFormId = linkage.refFormId;
        linkageMapData.refShowKey = linkage.refShowKey;
        linkageMapData.refItemKey =  linkage.condition[x].refItemKey;

        linkageIds.indexOf(curItemKey) == -1 && linkageIds.push(curItemKey);
        idGroups.push(curItemKey);
        linkageMap.push(linkageMapData);
      }
      arr.push(idGroups);
      !isEmpty(linkageIdGroups) && linkageIdGroups.forEach(item =>{
        isEquals(item, arr) && (isSame = true);
      });
      !isSame && linkageIdGroups.push([idGroups]);
    }
  });
  !isEmpty(linkageMap) && store.commit('setLinkageMap',linkageMap);                        //存储数据联动条件信息
  !isEmpty(linkageIds) && store.commit('setLinkageIds',linkageIds);                        //存储作为数据联动驱动字段的id
  !isEmpty(linkageIdGroups) && store.commit('setLinkageIdGroups',linkageIdGroups);         //存储作为数据联动驱动字段的id组合
}
// 高级函数
function advmthd(data) {
  var result = [];
  var ids = data.map(field =>{
    return field._id;
  });

  data.forEach(field =>{
    var advmthdPO = {};
    if (field.predefinedType == 2 && !isEmpty(field.calculator)) {
      var calculator = field.calculator;
      var matchs = ids.filter(id => {
        return calculator.indexOf(id) != -1
      })
      advmthdPO.calculator = calculator;
      advmthdPO.matchs = matchs;
      advmthdPO.id = field._id;
      result.push(advmthdPO);
    }
  })
  return result;
}
function setAdvmthd(store, data) {
  const advmthdList = advmthd(data);
  const advmthdMatch = [];
  advmthdList.forEach(item => {
    for (var i=0, l=item.matchs.length; i<l ; i++) {
      advmthdMatch.indexOf(item.matchs[i]) == -1 && advmthdMatch.push(item.matchs[i]);
    }
  })
  store.commit('setAdvmthd', advmthdList);              //高级函数处理
  store.commit('setAdvmthdMatch', advmthdMatch);
}
//判断是否是单纯的显示字段
function isPure(store, key){
  var isPureField = true;
  let advmthd = store.state.formBase.advmthd;
  let ids = store.state.formBase.linkageIds;
  let equationMatch = store.state.formBase.equationMatch;
  advmthd.forEach(item=> {
    if (item.matchs.indexOf(key) != -1) {
      isPureField = false;
    }
  })
  if (ids.indexOf(key) != -1){
    isPureField = false;
  }
  if (equationMatch.indexOf(key) != -1) {
    isPureField = false;
  }
  return isPureField;
}
//对函数返回值进行格式处理
function fieldDataValidate(val, item){
  var value = val;
  // 这里需要做时间格式截断
  var dateFormatRegList = {
    allFormat:/\d{4}(-)([0][1-9]|[1][0-2])(-)([0][1-9]|[1][0-9]|[2][0-9]|[3][0-1])(\s)([0-1][0-9]|[2][0-3])((:)([0-4][0-9]|[5][0-9])){2}/,
    DateField:/\d{4}(-)([0][1-9]|[1][0-2])(-)([0][1-9]|[1][0-9]|[2][0-9]|[3][0-1])/,
    TimeField:/([0-1][0-9]|[2][0-3])(:)([0-4][0-9]|[5][0-9])/,
    DateTimeField:/\d{4}(-)([0][1-9]|[1][0-2])(-)([0][1-9]|[1][0-9]|[2][0-9]|[3][0-1])(\s)([0-1][0-9]|[2][0-3])(:)([0-4][0-9]|[5][0-9])/,
  };
  //数字值转换，避免数值不精确，以及文字内容无法正常显示并传给后台
  if(['NumberField','StatisticsField','EquationField'].indexOf(item._type) > -1){
    if(['string','number'].indexOf(typeof value) == -1) value = '';
    else if(isNaN(Number(value)) || value.length > 2000 || value === Infinity ) value = '';
  }
  //对象值转换
  if(['TextField','TextArea','EmailField','TelephoneField','MobileField'].indexOf(item._type) > -1){
    if(['object'].indexOf( typeof(value)) > -1){
      if(Array.isArray(value)) value = value.toString();
      else value = JSON.stringify(value);
    }
    else value = String(value);
  }
  // 时间类字段值限制，不符合规则即转为空值
  if(['DateField','TimeField','DateTimeField'].indexOf(item._type) > -1) {
    if(['string'].indexOf(typeof value) > -1){
      if(dateFormatRegList['allFormat'].test(value) || dateFormatRegList[item._type].test(value)){
        value = value.match(dateFormatRegList[item._type])[0];
      }else{
        value = '';
      }
    }else{
      value = '';
    }
  }
  return value;
}
function render_field(store, data, defaultData,orbitItemKeyList, _this, canGo) {
    const formData = defaultData || {};
    const equationList = equation(data);
    const equationMatch = [];
    equationList.forEach(function (item) {
        item.matchs.forEach(matchItem => {
          equationMatch.push(matchItem);
        });
    })
    const statisticMap = {};
	const relateIds = [];//①获取需要隐藏的字段
	const relateMatch = [];
	const relateMap = {};
	const relateAllMap = {};
	const typeMap = {};
	const choiceMap = {};
    const schemaData = data.map(item => {
        //初始化数据value
		typeMap[item._id] = item._type;
		!isEmpty(formData[item._id]) && (formData[item._id] = fieldDataValidate(formData[item._id],item));
        item.value = formData[item._id] || item.value;
		item.validations = item.validations || [];
		item.readonly = item.validations.indexOf('uniqueness')!=-1?true:false;
		item.history = false;
		item.disabled = false;
		item.fieldEdit = false;
		item.fieldRead = true;
		// 新增页面触发数据联动
		if(!isEmpty(item.value) && canGo){
      //  数据联动
      let ids = store.state.formBase.linkageIds;
      if(ids.indexOf(item._id) != -1){
        setStoreValue({key:item._id,value:item.value}, store, data, true);
        getLinkage({key:item._id,value:item.value}, _this, store, data, false);
      }
    }
  orbitItemKeyList = orbitItemKeyList||[];
		if(orbitItemKeyList.indexOf(item._id)!=-1){
			item.history = true;
		}
		item.show = true;//是否显示的监听绑定
        if(relateIds.indexOf(item._id) != -1){
			item.show = false;
		}
		if(item.notes == '请选择'||item.notes == '请输入'){
        	item.notes = '';
		}
        item.help = '';
        //两级下拉框添加数据childChoices
        if (item._type == 'CascadeDropDown') {
            item.childChoices = [{value: '请选择'}];
        }
        //统计字段的数据map
        if (item._type == 'StatisticsField') {
            if (item.calculator) {
                var staKey = item.calculator.split('|')[0];
                if(!statisticMap[staKey]) {
                  statisticMap[ staKey ] = [];
                }
                statisticMap[staKey].push(item)
            }
        }
        var arry = [];
        //显示逻辑的数据分析，①获取需要隐藏的字段②获取需要显示的字段
		if (item._type == 'RadioButton' || item._type == 'CheckBox' || item._type == 'DropDown'){
        	var id = item._id;
			item.choices.forEach(function(item){
				choiceMap[item._id] = item.value;
				if(item.relate_show_ids && item.relate_show_ids.length){
					relateMatch.push(id);
					var allArry = [];
					item.relate_show_ids.forEach(function(i){
						relateIds.push(i);
						arry.push(i);
						allArry.push(i);
					})
					relateAllMap[item._id] = item.relate_show_ids;
				}
			})
			relateMap[id] = arry;
		}
        return item;
    });
    //计算式的分析逻辑处理
	store.commit('setTypeMap',typeMap);
	store.commit('setChoiceMap',choiceMap);
    store.commit('setEquation', equationList);
    store.commit('setEquationMatch', equationMatch);
    store.commit('setData', formData);
	store.commit('setStatisticMap', statisticMap);
    store.commit('setSchema', schemaData);
    //保存显示逻辑数据
    store.commit('setRelateIds', relateIds);
	store.commit('setRelateMatch', relateMatch);
	store.commit('setRelateMap', relateMap);
	store.commit('setRelateAllMap', relateAllMap);
	//高级函数计算请求
  if(canGo && store.state.formBase.advmthdMatch.length != 0){
    //避免重复计算某个公式值
    let advmthdResultIds = [];
    //已经填写的数据
    let fillData = store.state.formBase.data;
    //高级函数match
    let advmthd = store.state.formBase.advmthd;
    let advmthdMatch = store.state.formBase.advmthdMatch;
    advmthdMatch.forEach(advmItem => {
      //当触发字段有值时
      if(!isEmpty(fillData[advmItem])){
        let resultIdList = [];
        advmthd.forEach(item => {
          if(item.matchs.indexOf(advmItem) != -1){
            resultIdList.push(item.id);
          }
        });
        resultIdList.forEach(resultId => {
          if(advmthdResultIds.indexOf(resultId) == -1){
            advmthdResultIds.push(resultId);
            setStoreValue({key:advmItem,value:fillData[advmItem]}, store, null, true);
            getAdvmthd({key:advmItem,value:fillData[advmItem]}, _this, store, null, false);
          }
        });
      }
    })
  }
}

//控制字段显示隐藏
function setFieldShowHide(store, map) {
//        map = {'fo1c408787f0aa4db3a5ed339bb1f86694':false,'fo36e8c8fafdb0451d8b47ec7f65ec8d5c':false}
	if(!map)map = {};
    var schema = store.state.formBase.schema;
    schema.map(item => {
        if (map && map[item._id] != undefined) {
            item.show = item.fieldRead && map[item._id];
        }
        return item;
    });
}
function setFieldShowRead(store, map){
  if(!map)map = {};
  var schema = store.state.formBase.schema;
  schema.map(item => {
    if (map && map[item._id] != undefined) {
      item.fieldRead = map[item._id];
      if(!item.fieldRead){
        item.show = false;
      }
    }
    return item;
  });
}
//控制字段显示是否可编辑
function setFieldRead(store, map) {
//        map = {'fo1c408787f0aa4db3a5ed339bb1f86694':true,'fo36e8c8fafdb0451d8b47ec7f65ec8d5c':true}
    var schema = store.state.formBase.schema;
    schema.map(item => {
        if (map && map[item._id] != undefined) {
            item.disabled = map[item._id];
        }
        return item;
    });
}
//控制字段显示是否可编辑
function setFieldEdit(store, map) {
//        map = {'fo1c408787f0aa4db3a5ed339bb1f86694':true,'fo36e8c8fafdb0451d8b47ec7f65ec8d5c':true}
	var schema = store.state.formBase.schema;
	schema.map(item => {
		if (map && map[item._id] != undefined) {
			item.fieldEdit = map[item._id];
		}
		return item;
	});
}

//设置单的字段不可编辑
function setReadonly(store,b) {
    var schema = store.state.formBase.schema;
    if(b == undefined)b = true;
    schema.map(item => {
        item.disabled = b;
        item.help = '';
				if(item._type === 'ChildField'|| item._type === 'FORMREFCustomerField' ){
					item.views && item.views.forEach(item => {
						item.fields.forEach(item => {
							item.disabled = b;
              item.help = '';
						})
					});
					item.children && item.children.forEach(item =>{
            item.disabled = b;
            item.help = '';
          })
				}
        return item;
    });
}
//设置单的字段不可编辑
function setReadonlyEdit(store,b) {
	var schema = store.state.formBase.schema;
	if(b == undefined)b = true;
	schema.map(item => {
		if(item.fieldEdit){
			item.disabled = b;
      item.help = '';
			if(item._type === 'ChildField'|| item._type === 'FORMREFCustomerField' ){
				item.views && item.views.forEach(item => {
					item.fields.forEach(item => {
						item.disabled = b;
            item.help = '';
					})
				});
        item.children && item.children.forEach(item =>{
          item.disabled = b;
          item.help = '';
        })
			}
		}
		return item;
	});
}
//审批再次编辑
function setEditAgain (store) {
	store.state.detail.isEditForm = true;
	let flag = false;
	store.state.formBase.schema.forEach(field => {
    if(field.show && field.validations&&field.validations.indexOf('presence')!=-1 && isEmpty(field.value)&& field.fieldEdit ){
      setReadonlyEdit(store,false);
      flag = true;
      return false;
    }
    if(field._type === 'ChildField'|| field._type === 'FORMREFCustomerField' ){
      field.views && field.views.forEach(function(item){
        if(!flag){
          flag = !form_validation(item.fields);
          return false;
        }
      });
    }
  })
	return flag;
}

function setEditAgainFree(store) {
  let flag = false;
  store.state.formBase.schema.forEach(field => {
    if(field.show && field.validations&&field.validations.indexOf('presence')!=-1 && isEmpty(field.value)){
      setReadonlyEdit(store,false);
      flag = true;
      return false;
    }
    if(field._type === 'ChildField'|| field._type === 'FORMREFCustomerField' ){
      field.views && field.views.forEach(function(item){
          if(!flag){
            flag = !form_validation(item.fields);
            return false;
          }
      });
    }
  })
  return flag;
}

function cloneDeep(obj) {
    var o;
    switch (typeof obj) {
        case 'undefined':
            break;
        case 'string'   :
            o = obj + '';
            break;
        case 'number'   :
            o = obj - 0;
            break;
        case 'boolean'  :
            o = obj;
            break;
        case 'object'   :
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(cloneDeep(obj[i]));
                    }
                } else {
                    o = {};
                    for (var k in obj) {
                        o[k] = cloneDeep(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj;
            break;
    }
    return o;
}

/**
 * 计算式计算
 * @param variables
 * @param expression
 * @returns
 */
function calculator(variables, expression) {
    var exp = expression;
    for (var k in variables) {
      while(exp.indexOf(k) != -1){
        exp = exp.replace(k, variables[k] );
      }
    }
    try {
        return correctCalc(exp);
    } catch (e) {
        return "";
    }
}
function convertCurrency(money) {
	money = String(money)
	var isNegative=false;
	if(money.indexOf("-")==0){//存在负数
		isNegative=true;
		money= money.replace("-","");
	}
	var cnNums = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖"); //汉字的数字
	var cnIntRadice = new Array("","拾","佰","仟"); //基本单位
	var cnIntUnits = new Array("","万","亿","兆"); //对应整数部分扩展单位
	var cnDecUnits = new Array("角","分","厘"); //对应小数部分单位
	var cnInteger = "整"; //整数金额时后面跟的字符
	var cnIntLast = "元"; //整型完以后的单位
	var maxNum = 999999999999999.9999; //最大处理的数字

	var IntegerNum; //金额整数部分
	var DecimalNum; //金额小数部分
	var ChineseStr=""; //输出的中文金额字符串
	var parts; //分离金额后用的数组，预定义

	if( money == "" ){
		return "";
	}

	money = parseFloat(money);
//alert(money);
	if( money >= maxNum ){
		//$.alert('超出最大处理数字');
		return "";
	}
	if( money == 0 ){
		ChineseStr = cnNums[0]+cnIntLast+cnInteger;
//document.getElementById("show").value=ChineseStr;
		return ChineseStr;
	}
	money = money.toString(); //转换为字符串
	if( money.indexOf(".") == -1 ){
		IntegerNum = money;
		DecimalNum = '';
	}else{
		parts = money.split(".");
		IntegerNum = parts[0];
		DecimalNum = parts[1].substr(0,3);
	}
	if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换
		var zeroCount = 0;
		var IntLen = IntegerNum.length;
		for( var i=0;i<IntLen;i++ ){
			var n = IntegerNum.substr(i,1);
			var p = IntLen - i - 1;
			var q = p / 4;
			var m = p % 4;
			if( n == "0" ){
				zeroCount++;
			}else{
				if( zeroCount > 0 ){
					ChineseStr += cnNums[0];
				}
				zeroCount = 0; //归零
				ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
			}
			if( m==0 && zeroCount<4 ){
				ChineseStr += cnIntUnits[q];
			}
		}
		ChineseStr += cnIntLast;
//整型部分处理完毕
	}
	if( DecimalNum!= '' ){//小数部分
		var decLen = DecimalNum.length;
		for(var i=0; i<decLen; i++ ){
			n = DecimalNum.substr(i,1);
			if( n != '0' ){
				ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
			}
      if(i == 0 && n == '0'){
        ChineseStr += '零'
      }else if (i == 1 && n == '0' && DecimalNum.substr(0,1) != 0){
        ChineseStr += '零'
      }
		}
	}
	if( ChineseStr == '' ){
		ChineseStr += cnNums[0]+cnIntLast+cnInteger;
	}
	else if( DecimalNum == '' ){
		ChineseStr += cnInteger;
	}
	if(isNegative){
		ChineseStr="负"+ChineseStr;
	}
	return ChineseStr;
}
//加载省市区的数据
function loadScript(url){
	return new Promise ((resolve, reject) => {
		if(!url) return resolve('no url');
		var address = document.getElementById('distpicker_data_vue');
		if(!address){
			var head = document.getElementsByTagName('head')[0];
			address = document.createElement('script');
			address.type = 'text/javascript';
			address.src = url;
			head.appendChild(address);
			address.setAttribute("id", "distpicker_data_vue");
			address.onload=function(){
				if(JSON.stringify(ChinaAddressV4Data[0]) == '{}' ){
					//后台传递的数据第一个数据{}
					ChinaAddressV4Data.shift();
				}
				resolve('update addressData')
			};
		}else{
			if(JSON.stringify(ChinaAddressV4Data[0]) == '{}' ){
				//后台传递的数据第一个数据{}
				ChinaAddressV4Data.shift();
			}
			resolve('update addressData')
		}
	})
}
function isEmpty(obj){
  var toString = Object.prototype.toString;
  var isArray = function(obj) {
    return toString.call(obj) === '[object Array]';
  };
  var isString = function(obj) {
    return toString.call(obj) === '[object String]';
  };
  if (obj == null) return true;
  if ((isArray(obj) || isString(obj))) return obj.length === 0;
  if (typeof obj == 'object'){
    if(JSON.stringify(obj) == "{}"){
      return true;
    }
  }
}
function isEquals(arr, array) {           //比较数组内容
  if ((!!arr&&!array)||(!arr&&!!array))
  return false;
  if (arr.length !== array.length)
    return false;
  for (var i = 0, l = arr.length; i < l; i++) {
    if (arr[i] instanceof Array && array[i] instanceof Array) {
      if (!isEquals(arr[i], array[i]))
        return false;
    }else if (arr[i] !== array[i]) {
      return false;
    }
  }
  return true;
}

//获取联动显示数据
function getLinkageData(data, linkageURL){
  return axios.post(_.baseURL + linkageURL, data);
}

//获取高级函数计算结果
function getAdvmthdData(data){
  return axios.post(_.baseURL + '/open/openForm/calculator.do', data);
}
//存储每次触发更新的值
function setStoreValue(val, store, schema, isDefault){
  schema = isEmpty(schema) ? store.state.formBase.schema : schema;
  if(!isPure(store, val.key)){
    let editFieldList = store.state.formBase.editFieldList || [];
    editFieldList.indexOf(val.key) == -1 && editFieldList.push(val.key);
    store.commit('setEditFieldList',editFieldList);
  }
  if(isDefault){
    let defaultField = schema.find(x => {return x._id == val.key});
    defaultField.value = val.value;
  }else{
    store.commit('setValue', val);
  }
}
// 数据联动代码
function getLinkage(val, _this, store, schema, isDefault){
  schema = isEmpty(schema) ? store.state.formBase.schema : schema;
  var linkageMap = store.state.formBase.linkageMap;
  //是否存在循环
  //避免循环刷新值
  for(let i=0,l=linkageMap.length; i<l; i++){
    if(linkageMap[i].curItemKey == val.key){
      if(store.state.formBase.editFieldList.indexOf(linkageMap[i].curShowKey) != -1){
        return;
      }
    }
  }
  if(isEmpty(val.value)){
    linkageMap.forEach(item=>{
      if(item.curItemKey == val.key){
        let map = {};
        map['key'] = item.curShowKey;
        map['value'] = '';
        //避免循环请求刷新字段值
        if(store.state.formBase.editFieldList.indexOf(map.key) != -1)return;
        //当清空的结果字段id也为驱动字段id时，清空该字段id对应的联动字段id内容
        let ids = store.state.formBase.linkageIds;
        if(ids.indexOf(item.curItemKey) != -1){
          getLinkage(map, _this, store, schema, isDefault);
        }
        let ifItem = schema.find(x=>{return x._id == map.key});
        if(['TextArea'].indexOf(ifItem._type) > -1){
          $('#field' + map.key).find('.textarea_div_edit').text(map.value);
        }
        setStoreValue(map, store, schema, isDefault);
        !isEmpty(_this.fieldChange) && _this.fieldChange(map);
      }
    });
    return;
  }
//        作关于单项选择与下拉框取值兼容的问题
  let fieldItem = schema.find(x=>{return x._id == val.key});
  if(!isEmpty(val.value) && ['RadioButton','DropDown'].indexOf(fieldItem._type) > -1){
    val.value = fieldItem.choices.find(x=>{return x._id == val.value}).value;
  }
  let _data = [];//传递的参数
  let data = {
    conditions:[],
    curDefinitionId:store.state.detail.detailData.controlPO.definitionId
  };
  linkageMap.forEach(item=>{
    if(item.curItemKey == val.key){
      let condition = JSON.parse(JSON.stringify(item));
      switch(typeof val.value){
        case 'string' :
        case 'number' :                     //兼容评分字段
          condition.keyWord = [];
          condition.keyWord.push(val.value);
          break;
        case 'object' :
          condition.keyWord = val.value;
          break;

      }
      delete condition.curItemKey;
      _data.push(condition);
    }
  });
  data.conditions = _data
  data = JSON.stringify(data);
//			  区分外部单接口
  let linkageURL = _this.isOpen ? '/open/openForm/showRefDataForCondition.do' : '/portal/portalForm/showRefDataForCondition.do';
  getLinkageData({conditions:data}, linkageURL).then((result) => {
    if(result.code == 0){
      var linkageDataList = JSON.parse(JSON.stringify(result.data.resultValues));
      var linkageIds = store.state.formBase.linkageIds;
      var advmthdMatch = store.state.formBase.advmthdMatch;
      for(let i=0,l=linkageDataList.length; i<l ;i++){
        let map = {};
        map['key'] = linkageDataList[i].itemKey;
        map['value'] = isEmpty(linkageDataList[i].value) ? '' : JSON.parse(JSON.stringify(linkageDataList[i].value))[0];
        let fieldItem = schema.find(x=>{return x._id == map.key});
        //当返回结果字段id也为驱动字段id时，再次触发数据联动
        if (linkageIds.indexOf(map.key) != -1) {
          getLinkage(map, _this, store, schema, isDefault);
        }
        //返回字段值也为高级函数触发字段时，触发高级函数计算
        if (advmthdMatch.indexOf(map.key) != -1) {
          getAdvmthd(map, _this, store, schema, isDefault);
        }
        //作关于单项选择与下拉框取值兼容的问题
        if(['RadioButton','DropDown'].indexOf(fieldItem._type) > -1){
          map.value = fieldItem.choices.find(x=>{return x.value == map.value})._id;
        }
        //解決多行文本字段无法实时更新的问题
        if(['TextArea'].indexOf(fieldItem._type) > -1){
          $('#field' + map.key).find('.textarea_div_edit').text(map.value);
        }
        setStoreValue(map, store, schema, isDefault);
        !isEmpty(_this.fieldChange) && _this.fieldChange(map);
      }
    }else{
      console.log(result.desc);
    }
  });
}
// 高级函数
function getAdvmthd(val, _this, store, schema, isDefault){
  schema = isEmpty(schema) ? store.state.formBase.schema : schema;
  var advmthd = store.state.formBase.advmthd;
  //判断是否存在环形请求
  for(let i=0,l=advmthd.length; i<l; i++){
    if(advmthd[i].matchs.indexOf(val.key) != -1){
      if(store.state.formBase.editFieldList.indexOf(advmthd[i].id) != -1){
        return;
      }
    }
  }
  function transform(val, schema){
    // 作关于单项选择与下拉框取值兼容的问题
    var fieldItem = schema.find(x=>{return x._id == val.key});
    if(!isEmpty(val.value) && ['RadioButton','DropDown'].indexOf(fieldItem._type) > -1){
      let transField = fieldItem.choices.find(x=>{return x._id == val.value}) || '';
      !isEmpty(transField) && (val.value = transField.value);
    }
    //两级下拉框数据兼容
    if(!isEmpty(val.value) && ['CascadeDropDown'].indexOf(fieldItem._type) > -1){
      let cas_value = '' + val.value;
      !isEmpty(fieldItem.choices) && fieldItem.choices.forEach(choice => {
        cas_value = cas_value.replace(choice._id,'');
      })
      !isEmpty(fieldItem.childChoices) && fieldItem.childChoices.forEach(cchoice => {
        cas_value = cas_value.replace(cchoice._id,'');
      })
      val.value = cas_value.replace('_','');
    }
    //数字值类型转换
    if(['EquationField','NumberField','StatisticsField'].indexOf(fieldItem._type) > -1){
      val.value = Number(val.value);
    }
    //多项选择处理
    if(['CheckBox'].indexOf(fieldItem._type) > -1){
      let val_value = [];
      if(isEmpty(val.value)){
        val.value = [];
        return;
      }
      for(var n=0,len=val.value.length; n<len ; n++){
        let transItem = fieldItem.choices.find(x=>{return x._id == val.value[n]}) || '';
        let transValue = '';
        !isEmpty(transItem) && (transValue = transItem.value);
         val_value.push(transValue);
      }
      val.value = JSON.parse(JSON.stringify(val_value));
    }
    if(['ChildField'].indexOf(fieldItem._type) > -1){
      let valueList = [];
      if(!isEmpty(val.value)){
        let val_value = JSON.parse(JSON.stringify(val.value));
        val_value.forEach(eachVal => {
          for(let vKey in eachVal){
            valueList.push({key:vKey,value:eachVal[vKey]});
          }
          valueList.forEach(valC => {
            transform(valC, fieldItem.children);
            eachVal[valC.key] = valC.value;
          });
        });
        val.value = JSON.parse(JSON.stringify(val_value));
      }
    }
  }
  //值处理
  transform(val, schema);
  let data = {
    calculator:[],                                          //计算式公式以及字段限制，如：SUM(XXX字段)
    param:{},                                               //计算因子的json，如：{"XXX字段":120}
    paramType:{},                                           //param的字段类型
    creator:'',                                             //提单人userId（内部单或者外部转内部单需要，外部单不需要）
    refId:'',                                               //当前表单的definition_versions_id(form开头)
  };
  data.creator = !_this.isOpen ? dataBase.config.userId : '';
  data.refId = store.state.detail.detailData.detailsPO.definitionVersionsId;
  advmthd.forEach(item=>{
    if(item.matchs.indexOf(val.key) != -1){
      //显示字段的field内容
      let advmthdationField = schema.find(x => {return x._id == item.id});
      data.calculator.push({'calculator':item.calculator,'fieldId':item.id});
      item.matchs.forEach(id => {
        //当即时填单时store的值并未准备好
        if(id == val.key){
          data.param[id] = val.value;
        }else{
          if(isEmpty(data.param[id])){
            let valListValue = schema.find(x => {return x._id == id}).value;
            let valList = {key:id,value:valListValue};
            !isEmpty(valList.value) && transform(valList, schema);
            data.param[id] = valList.value;
          }
        }
        let paramItem = schema.find(x => {return x._id == id});
        data.paramType[id] = paramItem._type;
      });
      data.calculator[data.calculator.length - 1]['fieldType'] = advmthdationField._type;
      switch(true){
        case ['DateField','TimeField','DateTimeField'].indexOf(advmthdationField._type) != -1 :
          data.calculator[data.calculator.length - 1]['dateFormat'] = advmthdationField.dateFormat;
          break;
        case ['CRMCustomerField','MEMBERCustomerField','DEPTCustomerField','FORMREFCustomerField','DataSource'].indexOf(advmthdationField._type) != -1 :
          data.calculator[data.calculator.length - 1]['fieldType'] = 1;
          break;
        case ['EquationField','NumberField','StatisticsField'].indexOf(advmthdationField._type) != -1 :
          data.calculator[data.calculator.length - 1]['accurateNum'] = Number(advmthdationField.accurate_num);
          break;
        default :
          // data.calculator[data.calculator.length - 1]['fieldType'] = 0;
          break;
      }
    }
  });
  data.param = JSON.stringify(data.param);
  data.paramType = JSON.stringify(data.paramType);
  data.calculator = JSON.stringify(data.calculator);
  //请求高级函数计算结果
  getAdvmthdData(data).then(result => {
    if(result.code == '0'){
      var resultList = result.data.results;
      var linkageIds = store.state.formBase.linkageIds;
      var advmthdMatch = store.state.formBase.advmthdMatch;
      resultList.forEach(resultItem => {
        // let advmthdIds = [];
        let advmthdation = store.state.formBase.advmthd;
        //根据返回报文计算式匹配显示字段id
        advmthdation.forEach(i => {
          if(i.calculator == resultItem.calculator){
            // advmthdIds.push(i.id);
            var map = {};
            map['key'] = i.id;
            map['value'] = resultItem.success ? resultItem.result : '';
            let advmthdItem = schema.find(x=>{return x._id == map.key});
            // 返回值为布尔类型时转换为字符串
            if(['boolean'].indexOf(typeof map.value) != -1){
              map.value = String(map.value);
            }
            //不可见字段不触发计算
            // if(!advmthdItem.show)continue;
            //当返回结果字段id也为驱动字段id时，再次触发数据联动
            if(linkageIds.indexOf(map.key) != -1){
              getLinkage(map, _this, store, schema, isDefault);
            }
            //返回字段值也为高级函数触发字段时，触发高级函数计算
            if (advmthdMatch.indexOf(map.key) != -1) {
              getAdvmthd(map, _this, store, schema, isDefault);
            }
            !isEmpty(map.value) && (map.value = fieldDataValidate(map.value, advmthdItem));
            //解決多行文本字段无法实时更新的问题
            if(['TextArea'].indexOf(advmthdItem._type) > -1){
              //结果为null时值兼容（只有多行文本需要）
              isEmpty(map.value) && (map.value = '');
              $('#field' + map.key).find('.textarea_div_edit').text(map.value);
            }
            setStoreValue(map, store, schema, isDefault);
            !isEmpty(_this.fieldChange) && _this.fieldChange(map);
          }
        });
      });
    }else{
      console.log(result.desc);
    }
  });
}
export {
	cloneDeep,
	editGetFroms,
	detailGetFroms,
	openDetailGetFroms,
	copyGetFroms,
	getFrom,
	render_field,
	setReadonly,
	setFieldRead,
	setFieldShowHide,
	getChildDefault,
	calculator,
	equation,
	getOldGivenList,
	saveFormData,
	getFormData,
	removeFormData,
	convertCurrency,
	setFieldEdit,
	loadScript,
	setReadonlyEdit,
  setEditAgainFree,
	setEditAgain,
  setFieldShowRead,
  setStoreValue,
  isEmpty,
  isEquals,
  isPure,
  setLinkage,
  setAdvmthd,
  getLinkage,
  getAdvmthd,
}
