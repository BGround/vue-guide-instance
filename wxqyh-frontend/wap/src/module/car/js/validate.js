function validation(basicField, basicValue, customField, customValue) {
	let scroll = true
	if(basicField.length > 0) {
		//标题为空时
		if(basicField[0] && basicField[0].status !=0 && basicField[0].isMust !=0 && (basicValue.title == undefined || basicValue.title == '')) {
			setErrorTips(basicField[0].id, basicField[0].optionName)
			if(scroll) {
				scroll = false
				scrollTo(basicField[0].id)
			}
		}
		//出发地点为空时
		if(basicField[4] && basicField[4].status !=0 && basicField[4].isMust !=0 && (basicValue.beginLocation == undefined || basicValue.beginLocation == '')) {
			setErrorTips(basicField[4].id, basicField[4].optionName)
			if(scroll) {
				scroll = false
				scrollTo(basicField[4].id)
			}
		}
		//目的地点为空时
		if(basicField[5] && basicField[5].status !=0 && basicField[5].isMust !=0 && (basicValue.destinationLocation == undefined || basicValue.destinationLocation == '')) {
			setErrorTips(basicField[5].id, basicField[5].optionName)
			if(scroll) {
				scroll = false
				scrollTo(basicField[5].id)
			}
		}
		//用车事由为空时
		if(basicField[3] && basicField[3].status !=0 && basicField[3].isMust !=0 && (basicValue.subject == undefined || basicValue.subject == '')) {
			setErrorTips(basicField[3].id, basicField[3].optionName)
			if(scroll) {
				scroll = false
				scrollTo(basicField[3].id)
			}
		}
		//管理员组为空时
		if(basicField[6] && basicField[6].status !=0 && basicField[6].isMust !=0 && (basicValue.managerGroupId == undefined || basicValue.managerGroupId == '')) {
			setErrorTips(basicField[6].id, basicField[6].optionName)
			if(scroll) {
				scroll = false
				scrollTo(basicField[6].id)
			}
		}
		//乘车人为空时
		if(basicField[7] && basicField[7].status !=0 && basicField[7].isMust !=0 && (basicValue.innerPassenger == undefined || basicValue.innerPassenger.length == 0) &&
			basicField[7] && basicField[7].status !=0 && basicField[7].isMust !=0 && (basicValue.outerPassenger == undefined || basicValue.outerPassenger.length == 0)) {
			setErrorTips(basicField[7].id, basicField[7].optionName)
			if(scroll) {
				scroll = false
				scrollTo(basicField[7].id)
			}
		}
	}
	if(customField.length > 0) {
		customField.forEach(item => {
			if(item.status !=0 && item.isMust != 0 && (customValue[item.itemId] == undefined || customValue[item.itemId] == '')) {
				setErrorTips(item.id, item.optionName)
				if(scroll) {
					scroll = false
					scrollTo(item.id)
				}
			}
		})
	}
	return {
		showFieldTips: !scroll,
		showTimeTips: timeValidation(basicValue.takeTime, basicValue.backTime)
	}
}

function timeValidation(takeTime, backTime) {
	if(takeTime && backTime) {
		let now = Number(new Date().getTime())
		let startTime = Number(new Date(takeTime.replace(/-/g,'/')).getTime())
		let endTime = Number(new Date(backTime.replace(/-/g,'/')).getTime())
		if(startTime < now) {
			return '用车开始时间不能早于当前时间'
		} else if(endTime <= startTime) {
			return '用车结束时间应晚于开始时间'
		} else return false
	} else return false
}

function scrollTo(id) {
	let offset = $('#field-' + id).offset()
	if(offset) {
		let top = offset.top - 80
		$("html,body").animate({scrollTop: top}, 100, 'linear')
	}
}

function setErrorTips(id, optionName) {
	let errText = ''
	optionName ? errText = '请输入' + optionName : errText = '此项为必填项'
	$(document).find("#field-" + id).attr("placeholder", errText)
  $(document).find("#field-" + id).addClass("error-tip")
}

export {validation, setErrorTips, scrollTo}
