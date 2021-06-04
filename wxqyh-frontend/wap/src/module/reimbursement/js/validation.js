import Vue from 'vue';
let vem = new Vue({});
// 用于提交表单时候的校验
let fieldHelp = {};
export function validation(loanFiledSettings, lastRepayment,loanPO,fileList,name) {
  // scroll用于标志页面能不能滚动，由于有一个错误之后，页面就不会滚动到下一个报错位置，所以scroll为false就是通不过校验，isError为true
  let scroll = true;
  // 校验可提交时间
  let isError = true;
  //传入name代表是单条数据失去焦点时的单条校验
  if(name){
    switch(name){
      case 'typeId':
        if (!loanPO.typeId) {
          fieldHelp.typeId = errorMap.typeId;
          scroll = false;
        }else{
          fieldHelp.typeId = '';
        }
        break;
      case 'title':
        if(!loanPO.title){
          fieldHelp.title = '请填写借款单主题';
          scroll = false;
        }else{
          fieldHelp.title = '';
        }
        break;
      case 'deptName':
        if (loanFiledSettings.dept.isEmploy == '1' &&loanFiledSettings.dept.isMust == '1' && !loanPO.deptName) {
          fieldHelp.dept = '请选择部门';
          scroll = false;
        }else{
          fieldHelp.dept = '';
        }
        break;
      case 'loanMoney':
        if (loanFiledSettings.moneys.isEmploy == '1' &&loanFiledSettings.moneys.isMust == '1' && (!loanPO.loanMoney || loanPO.loanMoney<=0)) {
          fieldHelp.loanMoney = '请输入借款金额';
          scroll = false;
        }else{
          fieldHelp.loanMoney = '';
        }
        break;
      case 'loanDate':
        if (loanFiledSettings.borrowingtime.isEmploy == '1' && loanFiledSettings.borrowingtime.isMust == '1' && !loanPO.loanDate) {
          fieldHelp.loanDate = '请选择借款日期';
          scroll = false;
        }else{
          fieldHelp.loanDate = '';
        }
        break;
      case 'repayDate':
        if (loanFiledSettings.repaymenttime.isEmploy == '1' && loanFiledSettings.repaymenttime.isMust == '1' && !loanPO.repayDate) {
          fieldHelp.repayDate = '请选择还款日期';
          scroll = false;
        }else{
          fieldHelp.repayDate = '';
        }
        break;
      case 'remark':
        if (loanFiledSettings.remarks.isEmploy == '1' &&loanFiledSettings.remarks.isMust == '1' && !loanPO.remark) {
          fieldHelp.remark = '请输入备注信息';
          scroll = false;
        }else{
          fieldHelp.remark = '';
        }
        break;
      case 'filesList':
        if (loanFiledSettings.image.isEmploy=='1'&&loanFiledSettings.image.isMust == '1' && fileList.length === 0) {
          fieldHelp.image = '请上传图片/附件材料';
          scroll = false;
        }else{
          fieldHelp.image = '';
        }
        break;
      case 'receiptFullName':
        if(loanFiledSettings.receiptAccount.isEmploy=='1' && loanFiledSettings.receiptAccount.isMust == '1'){
          if(!loanPO.receiptFullName){
            vem.$set(fieldHelp,'receiptFullName',errorMap.receiptFullName);
            // fieldHelp.receiptFullName = errorMap.receiptFullName;
            scroll = false;
          }else{
            fieldHelp.receiptFullName = '';
          }
        }
        break;
      case 'bankAccount':
        if(loanFiledSettings.receiptAccount.isEmploy=='1' && loanFiledSettings.receiptAccount.isMust == '1'){
          if(!loanPO.bankAccount){
            vem.$set(fieldHelp,'bankAccount',errorMap.bankAccount);
            // fieldHelp.bankAccount = errorMap.bankAccount;
            scroll = false;
          }else{
            fieldHelp.bankAccount = '';
          }
        }
        break;
      case 'depositBank':
        if(loanFiledSettings.receiptAccount.isEmploy=='1' && loanFiledSettings.receiptAccount.isMust == '1'){
          if(!loanPO.depositBank){
            vem.$set(fieldHelp,'depositBank',errorMap.depositBank);
            // fieldHelp.depositBank = errorMap.depositBank;
            scroll = false;
          }else{
            fieldHelp.depositBank = '';
          }
        }
        break;
    }
  }else{
    fieldHelp = {};
    // 校验单据类型
    if (!loanPO.typeId) {
      fieldHelp.typeId = errorMap.typeId;
      if (scroll) {
        scroll_height('-type');
        scroll = false;
      }
    }
    // 校验借款单主题
    if(!loanPO.title){
      fieldHelp.title = '请填写借款单主题';
      if (scroll) {
        scroll_height('-title');
        scroll = false;
      }
    }
    // 校验部门
    if (loanFiledSettings.dept.isEmploy == '1' &&loanFiledSettings.dept.isMust == '1' && !loanPO.deptName) {
      fieldHelp.dept = '请选择部门';
      if (scroll) {
        scroll_height(loanFiledSettings.dept.id);
        scroll = false;
      }
    }
    // 校验金额
    if (loanFiledSettings.moneys.isEmploy == '1' &&loanFiledSettings.moneys.isMust == '1' && (!loanPO.loanMoney || loanPO.loanMoney<=0)) {
      fieldHelp.loanMoney = '请输入借款金额';
      if (scroll) {
        scroll_height(loanFiledSettings.moneys.id);
        scroll = false;
      }
    }
    // 校验借还款时间
    if (loanFiledSettings.borrowingtime.isEmploy == '1' && loanFiledSettings.borrowingtime.isMust == '1' && !loanPO.loanDate) {
      fieldHelp.loanDate = '请选择借款时间';
      if (scroll) {
        scroll_height(loanFiledSettings.borrowingtime.id);
        scroll = false;
      }
    }
    if (loanFiledSettings.repaymenttime.isEmploy == '1' && loanFiledSettings.repaymenttime.isMust == '1' && !loanPO.repayDate) {
      fieldHelp.repayDate = '请选择还款时间';
      if (scroll) {
        scroll_height(loanFiledSettings.repaymenttime.id);
        scroll = false;
      }
    }
    if (loanPO.repayDate < loanPO.loanDate) {
      fieldHelp.repayDate = '还款日期不能早于借款日期';
      if (scroll) {
        scroll_height(loanFiledSettings.repaymenttime.id);
        scroll = false;
      }
    }
    if (loanPO.loanDate < _.getFormatDate(new Date(), 'yyyy-MM-dd')) {
      fieldHelp.loanDate = '借款日期不能早于当天';
      if (scroll) {
        scroll_height(loanFiledSettings.borrowingtime.id);
        scroll = false;
      }
    }
    //最晚还款时间
    let bTime = new Date(loanPO.loanDate);
    let rTime = new Date(bTime.getFullYear(), bTime.getMonth() + lastRepayment, bTime.getDate());
    // bTime = _.getFormatDate(bTime, 'yyyy-MM-dd');
    //
    // 判断还款时间是否正常
    if (!(bTime.getDate() === rTime.getDate())) {
      // 当借款日期为下下月没有的时候，还款日期会变成下下下月的第一天，在这里设置它为下下月的最后一天
      rTime = _.getFormatDate(new Date(rTime.getTime() - 1), 'yyyy-MM-dd');
    }
    rTime = _.getFormatDate(rTime, 'yyyy-MM-dd');
    if(loanPO.repayDate > rTime ){
      fieldHelp.repayDate = `只允许从提交日起${lastRepayment}个月内还款`;
      if (scroll) {
        scroll_height(loanFiledSettings.repaymenttime.id);
        scroll = false;
      }
    }

    // 校验备注信息
    if (loanFiledSettings.remarks.isEmploy == '1' &&loanFiledSettings.remarks.isMust == '1' && !loanPO.remark) {
      fieldHelp.remark = '请输入备注信息';
      if (scroll) {
        scroll_height(loanFiledSettings.remarks.id);
        scroll = false;
      }
    }
    // 校验图片附件
    if (loanFiledSettings.image.isEmploy=='1'&&loanFiledSettings.image.isMust == '1' && fileList.length === 0) {
      fieldHelp.image = '请上传图片/附件材料';
      if (scroll) {
        scroll_height(loanFiledSettings.image.id);
        scroll = false;
      }
    }
    // 校验银行
    let bankMsg = loanFiledSettings.receiptAccount;
    let bankIsMust = bankMsg.isMust;
    let isEmploy = bankMsg.isEmploy;
    if(isEmploy=='1' && bankIsMust == '1'){
      let error = false;
      if(!loanPO.receiptFullName){
        fieldHelp.receiptFullName = errorMap.receiptFullName;
        error = true;
      }
      if(!loanPO.bankAccount){
        fieldHelp.bankAccount = errorMap.bankAccount;
        error = true;
      }
      if(!loanPO.depositBank){
        fieldHelp.depositBank = errorMap.depositBank;
        error = true;
      }
      if (scroll && error) {
        scroll_height(bankMsg.id);
        scroll = false;
      }
    }
    if(loanPO.bankAccount){
      let error = false;
      //校验银行卡号是否正确
      /*var pattern = /^([1-9]{1})(\d{14}|\d{18})$/;*/
      if (loanPO.bankAccount.length<8) {
        fieldHelp.bankAccount = errorMap.errorAccount;
        error = true;
      }
      if (scroll && error) {
        scroll_height(bankMsg.id);
        scroll = false;
      }
    }
  }
  return {fieldHelp:fieldHelp, isError:!scroll}
}
function scroll_height(id) {
  setTimeout(function () {
    let el = document.getElementById('msg' + id);
    let top = getElementTop(el) - 80;
    document.documentElement.scrollTop = top;
    document.body.scrollTop = top;
    window.pageYOffset = top;
  }, 50);
}

function getElementTop(element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;

  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }

  return actualTop;
}

let errorMap = {
  typeId: '请选择单据类型',
  dept: '请选择所属部门',
  loanMoney: '请填写借款金额',
  loanDate: '请选择借款日期',
  repayDate: '请选择还款日期',
  remark: '请填写备注',
  receiptFullName: '请填写全称',
  bankAccount: '请填写银行账号',
  depositBank: '请填写开户银行',
  errorAccount:'请输入大于等于8位数字的银行卡号',
};

