let demoDetail = {};// 这个demoDetail是我用来获取你返回的loanPrint的
demoDetail.title = "测试借款单"; // 借款单主题
demoDetail.depart = "开发部";   // 所属部门
demoDetail.submitTime = "2015-01-01"; // 填单日期
demoDetail.loanType = "财政借款单";  // 单据类型
demoDetail.loanNo = "J201510224717"; // 借款单号
demoDetail.auditStatus = "已转账";  // 审批状态
demoDetail.loanAmount = "127.00";  //借款金额
demoDetail.repaidAmount = "100.00"; // 已还金额
demoDetail.unpaidAmount = "27.00"; // w未还金额
demoDetail.loanTime = "2015-10-12"; // 借款时间
demoDetail.repaymentTime = "2015-11-12"; // 截止还款时间
demoDetail.remark = "备注11"; // 备注
// demoDetail.totalZh = "壹佰貳拾柒"; // 这两个在前端生成
// demoDetail.totalNum = "127.00";
demoDetail.receiptFullName = "xxxxxxxxxx单位"; // 收款单位全称
demoDetail.bankAccount = "0000000000000000"; // 银行账号
demoDetail.depositBank = "xxxxxxxxxx银行"; // 开户银行
demoDetail.pic = [];//这个是图片附件，但是我也不知道这里面要放啥
let auditList = []; // 审批意见详情，里面的值是一个对象
let auditDemo1 = {};
auditDemo1.NodeSort = "1";
auditDemo1.NodeName = "节点1";
auditDemo1.NodePersons = "李四";
auditDemo1.NodeReason = "同意";
auditDemo1.NodeTime = "2015-01-01";
auditList.push(auditDemo1);
demoDetail.auditList = auditList;

let loanListDemo = [];// 还款流程详情 里面的值是一个对象
let loanDemo1 = {};
loanDemo1.loanNodeSort = "1";
loanDemo1.loanNodeName = "节点";
loanDemo1.loanNodePersons = "李四";
loanDemo1.loanNodeReason = "同意";
loanDemo1.loanNodeTime = "2015-02-02";
loanListDemo.push(loanDemo1);
demoDetail.loanList = loanListDemo;

demoDetail.ccPersons = "某某某、 某某某"; // 相关人
demoDetail.manager = "某某主管"; // 主管
demoDetail.checker = "复核人员"; // 复核
demoDetail.cashier = "出纳"; // 出纳
demoDetail.createPerson = "某某某";  // 借款人
demoDetail.recePerson = "某某某";   // 领款人

