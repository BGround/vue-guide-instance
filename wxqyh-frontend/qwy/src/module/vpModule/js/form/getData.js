import axios from 'axios'
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
function getFrom(type, id) {
  if (type === 'open') return axios.post(_.baseURL + '/open/openForm/getFrom.do', {id});    //外部单
  if (type === 'preview')  return axios.post(_.baseURL + '/form/form/getFrom.do', {id})   //预览
  type = type || "add";
  var api = {
    add: "getFrom",             //填单
    edit: "editGetFroms",       //草稿、提单人编辑加载
    copy: "copyGetFroms",       //复制表单入口
    toEdit: "getFormToedit",    //负责人编辑
  }
  return axios.post(_.baseURL + '/portal/portalForm/' + api[type] + '.do', {id})
}

export function commentListMore(data, cb) {                                      //加载更多评论
	axios.post(_.baseURL + "/portal/portalForm/listComment.do", {
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

// 获取处理人信息
export function getMember(ids, cb) {
	var memberUrl = _.baseURL + "/portal/portalFormAction!getUserRedundancyListByUserId.action";
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
				cb(userInfo)
			} else {
				_.alert("提示",data.desc,"确定");
			}
		})
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

function render_field(store, data, defaultData,orbitItemKeyList) {
    console.log(defaultData)
    const formData = defaultData || {};
    const equationList = equation(data);
    const equationMatch = [];
    equationList.forEach(function (item) {
        for (var i in item.matchs) {
            equationMatch.push(item.matchs[i]);
        }
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
        item.value = formData[item._id];
		item.validations = item.validations || []
		item.readonly = item.validations.indexOf('uniqueness')!=-1?true:false;
		item.history = false;
		item.disabled = false;
		item.fieldEdit = false;
		item.fieldRead = true;
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
				if(item.relate_show_ids&&item.relate_show_ids.length){
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
			if(item._type === 'ChildField'|| item._type === 'FORMREFCustomerField' ){
				item.views && item.views.forEach(item => {
					item.fields.forEach(item => {
						item.disabled = b;
					})
				});
        item.children && item.children.forEach(item =>{
          item.disabled = b;
        })
			}
		}
		return item;
	});
}
//设置所有字段可编辑 不可编辑
function setEditAll(store,b) {
	var schema = store.state.formBase.schema;
	if(b == undefined)b = true;
	schema.map(item => {
			item.disabled = b;
			if(item._type === 'ChildField'|| item._type === 'FORMREFCustomerField' ){
				item.views && item.views.forEach(item => {
					item.fields.forEach(item => {
						item.disabled = b;
					})
				});
        item.children && item.children.forEach(item =>{
          item.disabled = b;
        })
			}
		return item;
	});
}
//审批再次编辑
function setEditAgain (store) {
	let flag = false;
	store.state.formBase.schema.forEach(field => {
		if(field.show && field.validations&&field.validations.indexOf('presence')!=-1 && (!field.value||_.isNull(field.value))&& field.fieldEdit ){
			setReadonlyEdit(store,false);
			flag = true;
			return false;
		}
	})
	return flag;
}

function setEditAgainFree(store) {
  let flag = false;
  store.state.formBase.schema.forEach(field => {
    if(field.show && field.validations&&field.validations.indexOf('presence')!=-1 && (!field.value||_.isNull(field.value))){
      setReadonlyEdit(store,false);
      flag = true;
      return false;
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
  var isArray = (obj) => toString.call(obj) === '[object Array]';
  var isString = (obj) => toString.call(obj) === '[object String]';
  if (obj == null) return true;
  if ( isArray(obj) || isString(obj) ) return obj.length === 0;
  if (typeof obj == 'object'){
    if(JSON.stringify(obj) == "{}"){
      return true;
    }
  }
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
  setEditAll,
  isEmpty
}
