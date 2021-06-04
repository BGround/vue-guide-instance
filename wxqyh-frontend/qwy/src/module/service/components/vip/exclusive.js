
//套餐配置
const  INITVIPRESPECT = (()=>{
  return JSON.parse(JSON.stringify({
    check: true,
    active: false,
    configStr:{},
    dayPrice:0,
    packageNo:"",
    priceCode:"",
    productdName:"",
    promPrice: '',
    serviceContent:"",
    serviceId:"viprespect",
    servicePrice: "",
    sortNum: "",
    agents: ""
  }))
})

const BASEAGENTS = {
  viprespect_oapackage : {
    agents: 'form,reimbursement,task,diary,teamwork'
  },
  viprespect_hrpackage : {
    agents: 'learn,productinfo,hr,qydisk,culture'
  },
  viprespect_crmpackage : {
    agents: 'crm,sale,crmmini'
  }
}

//应用配置
 const applianceConfigs = {
   teamwork: {
     zh: '企微云办公',
     priceCode: "viprespect_teamwork",
     agents: 'ask,car,moveapprove,checkwork,meetingassistant'
   },
  form: {
    zh: '表单流程',
    priceCode: "viprespect_form",
    agents: 'form'
  },
   reimbursement: {
     zh: '费控报销',
     priceCode: "viprespect_reimbursement",
     agents: 'reimbursement'
   },
   task: {
     zh: '任务分派',
     priceCode: "viprespect_task",
     agents: 'task'
   },
   diary: {
     zh: '工作日志',
     priceCode: "viprespect_diary",
     agents: 'diary'
   },
   learn: {
     zh: '培训考试',
     priceCode: "viprespect_learn",
     agents: 'learn'
   },
   productinfo: {
     zh: '知识百科',
     priceCode: "viprespect_productinfo",
     agents: 'productinfo'
   },
   culture: {
     zh: '企微云文化',
     priceCode: "viprespect_culture",
     agents: 'dynamic,topic,activity,survey'
   },
   hr: {
    zh: '企微云HR',
    priceCode: "viprespect_hr",
    agents: 'hr'
  },
  qydisk: {
    zh: '企业云盘',
    priceCode: "viprespect_qydisk",
    agents: 'qydisk'
  },
   crm: {
     zh: '企微云CRM',
     priceCode: "viprespect_crm",
     agents: 'crm,outsidework'
   },
   sale: {
     zh: '云快消',
     priceCode: "viprespect_sale",
     agents: 'sale'
   },
   crmmini:{
     zh: '企微云小站',
     priceCode: "viprespect_crmmini",
     agents: 'crmmini'
   },
}
//购买年数配置
 let buyYearConfig = [
  {
    year:1,
    check: true,
    zh:'一年'
  },
  {
    year:2,
    check: false,
    zh:'两年'
  },
  {
    year:3,
    check: false,
    zh:'三年'
  }
]

/**
 *
 * @param strNumber:目标字符串
 * @param Fixed：保留位数
 * @param multiple：转换倍数：strNumber/multiple
 * @returns {string}
 */
export function formatMoneyMethod(strNumber,Fixed,multiple){
  var returnStr="";
  var tmpStr=(strNumber/multiple).toFixed(Fixed);
  var splitIndex=0;
  var beginPoint=false;
  for(var i=tmpStr.length-1;i>=0;i--){
    if(beginPoint){
      if(3==splitIndex){
        returnStr=tmpStr[i]+","+returnStr;
        splitIndex=1;
      }else{
        returnStr=tmpStr[i]+returnStr;
        splitIndex=splitIndex+1;
      }
    }else if("."==tmpStr[i]){
      beginPoint=true;
      returnStr=tmpStr[i]+returnStr;
    }else{
      returnStr=tmpStr[i]+returnStr;
    }
  }
  return returnStr;
}
 export {
   INITVIPRESPECT,
   BASEAGENTS,
   applianceConfigs,
   buyYearConfig,
 }
