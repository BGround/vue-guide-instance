
//字段验证

function field_validation(item,value){
	item.help = '';
	//必填验证
	if (item.isMust == 1 && (!value || (value.length == 0))) {
		item.help = '请填写' + item.name;
	}
}
export {
	field_validation
}
