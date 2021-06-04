<!--  -->
<template>
  <div class="setting-area">
    <main-bar></main-bar>
    <div style="display:flex;align-items: center">
      <div>应用端分享有效：</div>
      <div class="form-field">
        <input type="number" min="0" max="9999" maxlength="4" class="debit-set-input wxPrintShareDay" v-model="loanPrintConfig.wxPrintShareDay">天
        <input type="number" min="0" max="23" maxlength="2" class="debit-set-input wxPrintShareHour" v-model="loanPrintConfig.wxPrintShareHour">小时
        <input type="number" min="0" max="59" maxlength="2" class="debit-set-input wxPrintShareMinute" v-model="loanPrintConfig.wxPrintShareMinute">分
      </div>
    </div>
    <div class="wxPrintShareTip">超过有效时长后，分享出来的打印页面无法显示具体内容</div>
    <cut-rules></cut-rules>
    <input type="checkbox" v-model="loanPrintConfig.showTableTitle">
    <span>【借款单】表头</span>
    <input type="text" class="debit-set-input debit-mana-input" v-model="loanPrintConfig.tableTitle">
    <div class="form-label"><input type="checkbox" v-model="checked.baseTable" @click="checkedALL('baseTable')"> 基础表格
    </div>
    <div class="box-bg">
      <table style="width:100%">
        <tr>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.title"/>【借款主题】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.depart"/>【所属部门】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.submitTime"/>【填单日期】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.loanType"/>【借款单类型】</td>
        </tr>
        <tr>
          <td><input type="checkbox" v-model="loanPrintConfig.loanNo"/>借款单号</td>
          <td><input type="checkbox" v-model="loanPrintConfig.auditStatus"/>审批状态</td>
          <td><input type="checkbox" v-model="loanPrintConfig.loanAmount"/>【借款金额】</td>
          <td><input type="checkbox" v-model="loanPrintConfig.repaidAmount"/>【已还金额】</td>
        </tr>
        <tr>
          <td><input type="checkbox" v-model="loanPrintConfig.unpaidAmount"/>【未还金额】</td>
          <td><input type="checkbox" v-model="loanPrintConfig.loanTime"/>【借款日期】</td>
          <td><input type="checkbox" v-model="loanPrintConfig.repaymentTime"/>【截止还款日期】</td>
          <td><input type="checkbox" v-model="loanPrintConfig.remark"/>【备注】</td>
        </tr>
        <tr>
          <td><input type="checkbox" v-model="loanPrintConfig.totalZh"/>【合计金额大写】</td>
          <td><input type="checkbox" v-model="loanPrintConfig.totalNum"/>【合计金额】数字</td>
          <td><input type="checkbox" v-model="loanPrintConfig.receiptAccount"/>【银行汇款信息】</td>
          <td><input type="checkbox" v-model="loanPrintConfig.pic"/>【图片/附件】</td>
        </tr>
      </table>
    </div>
    <div class="form-label"><input type="checkbox" v-model="checked.fixedNode" @click="checkedALL('fixedNode')">
      固定流程审批详情
    </div>
    <div class="box-bg">
      <table style="width:100%">
        <tr>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.fixedNodeSort"/>【节点】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.fixedNodeName"/>【节点名称】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.fixedNodePersons"/>【审批人】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.fixedNodeReason"/>【意见】</td>
        </tr>
        <tr>
          <td><input type="checkbox" v-model="loanPrintConfig.fixedNodeTime"/>【时间】</td>
          <td><input type="checkbox" v-model="loanPrintConfig.fixedCc"/>【相关人】</td>
        </tr>
      </table>
    </div>
    <div class="form-label"><input type="checkbox" v-model="checked.free" @click="checkedALL('free')"> 自由流程审批详情</div>
    <div class="box-bg">
      <table style="width:100%">
        <tr>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.freeTo"/>【审批人】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.freeReason"/>【意见】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.freeTime"/>【时间】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.freeCc"/>【相关人】</td>
        </tr>
      </table>
    </div>
    <div class="form-label"><input type="checkbox" v-model="checked.loanNode" @click="checkedALL('loanNode')"> 还款流程审批详情
    </div>
    <div class="box-bg">
      <table style="width:100%">
        <tr>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.loanNodeSort"/>【节点】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.loanNodeName"/>【节点名称】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.loanNodePersons"/>【操作人】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.loanNodeReason"/>【审批意见】</td>
        </tr>
        <tr>
          <td><input type="checkbox" v-model="loanPrintConfig.loanNodeTime"/>【时间】</td>
        </tr>
      </table>
    </div>
    <div class="form-label"><input type="checkbox" v-model="checked.billBottom" @click="checkedALL('billBottom')"> 借款单底部
    </div>
    <div class="box-bg">
      <table style="width:100%">
        <tr>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.manager"/>【会计主管】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.checker"/>【复核】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.cashier"/>【出纳】</td>
          <td class="quarter-width"><input type="checkbox" v-model="loanPrintConfig.createPerson"/>【借款人】</td>
        </tr>
        <tr>
          <td><input type="checkbox" v-model="loanPrintConfig.recePerson"/>【领款人】</td>
        </tr>
      </table>
    </div>
    <div class="btn-wrapper">
      <input type="button" class="btn print-btn" value="预览模板" @click="preview">
      <input type="button" class="btn save-btn" value="保存" style="margin-left:20px"
             @click=" savePrintSetting">
    </div>
  </div>
</template>

<script>
  import {getLoanPrintSetting, setLoanPrintSetting} from '../../../api/reimbursement/debit'
  import CutRules from '../cutRules.vue'
  import MainBar from '../mainBar.vue'

  const RESULT_OK = 0;
  export default {
    data() {
      return {
        loanPrintConfig: {},
        checkedMap: {
          baseTable: ['title', 'depart', 'submitTime', 'loanType', 'loanNo', 'auditStatus', 'loanAmount', 'repaidAmount', 'unpaidAmount', 'loanTime', 'repaymentTime', 'remark', 'totalZh', 'totalNum', 'receiptAccount', 'pic'],
          fixedNode: ['fixedNodeSort', 'fixedNodeName', 'fixedNodeReason', 'fixedNodePersons', 'fixedNodeTime', 'fixedCc'],
          free: ['freeTo', 'freeReason', 'freeTime', 'freeCc'],
          loanNode: ['loanNodeSort', 'loanNodeName', 'loanNodePersons', 'loanNodeReason', 'loanNodeTime'],
          billBottom: ['manager', 'checker', 'cashier', 'createPerson', 'recePerson'],
        },
        checked: {
          baseTable: 0,
          fixedNode: 0,
          free: 0,
          loanNode: 0,
          billBottom: 0,
        },
      };
    },

    components: {
      MainBar,
      CutRules
    },

    computed: {},

    created() {
      getLoanPrintSetting().then((res) => {
        if (res.code == RESULT_OK) {
          this.loanPrintConfig = res.data.loanPrintConfig;
          for(let item in this.checkedMap){
            let map = this.checkedMap[item];
            for(let i = 0; i < map.length; i++){
              this.loanPrintConfig[map[i]] = this.loanPrintConfig[map[i]] == '0' ? false : true;
            }
          }
        } else {

        }
        console.log(this.loanPrintConfig);
      })
    },

    mounted() {
    },

    methods: {
      savePrintSetting() {
        console.log(this.loanPrintConfig)
        this.checkedFilter();
        delete this.loanPrintConfig.id;
        delete this.loanPrintConfig.creator;
        delete this.loanPrintConfig.createTime;
        delete this.loanPrintConfig.orgId;
        let params = this.loanPrintConfig;
        setLoanPrintSetting({loanPrintConfig:params}).then((res)=>{
          if(res.code == '0'){
            _.alert("提交结果",res.desc)
          }
        });
      },
      checkedFilter() {
        for(let item in this.checkedMap){
          let map = this.checkedMap[item];
          for(let i = 0; i < map.length; i++){
            this.loanPrintConfig[map[i]] = this.loanPrintConfig[map[i]] ? 1 : 0;
          }
        }
      },
      checkedALL(map) {
        for (let i = 0; i < this.checkedMap[map].length; i++) {
          this.loanPrintConfig[this.checkedMap[map][i]] = !this.checked[map];
        }
        console.log(this.checkedMap[map]);
      },
      preview(){
        let top = (window.screen.height - 600) / 2;
        let left = (window.screen.width - 700) / 2;
        let data = JSON.stringify(this.loanPrintConfig);
        window.localStorage.setItem('printConfig',data);
        let formData = "loanPrintConfig.wxPrintShareDay=1&loanPrintConfig.wxPrintShareHour=0&loanPrintConfig.wxPrintShareMinute=0&printconfig.tableTitle=&printconfig.title=1&printconfig.depart=1&printconfig.submitTime=1&printconfig.itemNo=1&printconfig.project=1&printconfig.subject=1&printconfig.createTime=1&printconfig.pic=1&printconfig.remark=1&printconfig.amount=1&printconfig.totalZh=1&printconfig.totalNum=1&printconfig.reimNo=1&printconfig.reimType=1&printconfig.auditStatus=1&printconfig.receiptAccount=1&printconfig.attachment=1&printconfig.fixedNodeSort=1&printconfig.fixedNodeName=1&printconfig.fixedNodePersons=1&printconfig.fixedNodeReason=1&printconfig.fixedNodeTime=1&printconfig.fixedCc=1&printconfig.freeTo=1&printconfig.freeReason=1&printconfig.freeTime=1&printconfig.freeCc=1&printconfig.manager=1&printconfig.checker=1&printconfig.cashier=1&printconfig.createPerson=1&printconfig.recePerson=1&printconfig.id=fb630c11f6904c1384aed66c025e5f73"
        let url=_.baseURL+"/manager/reimbursement/print_debit.jsp?loanId=preview";
        window.open(url, 'newwindow','top'+top+',left='+left+',height=600, width=700,toolbar=no, menubar=no, resizable=yes,location=no, status=no,scrollbars=no,directories=no,menubar=no');
      }
    }
  }
</script>

<style scoped>
  .wxPrintShareTip {
    margin: 10px auto 0 115px;
    color: #999;
  }

  .debit-mana-input {
    width: 290px;
  }

  .debit-set-input {
    margin: 0 3px 0 6px;
    border: 1px solid #cccccc;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    padding: 6px 4px;
    -webkit-transition: border linear 0.2s, box-shadow linear 0.2s;
    -moz-transition: border linear 0.2s, box-shadow linear 0.2s;
    -o-transition: border linear 0.2s, box-shadow linear 0.2s;
    transition: border linear 0.2s, box-shadow linear 0.2s;
    -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .debit-mana-input:focus {
    border-color: rgba(82, 168, 236, 0.8);
    -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
  }

  .setting-area {
    padding-left: 30px;
  }

  .form-label {
    line-height: 20px;
    font-size: 14px;
    padding: 20px 0 9px 0;
  }

  .box-bg {
    top: 5px;
    padding: 15px;
    background-color: #fff;
    border: solid 1px #e9e9e9;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
  }

  .box-bg td {
    padding: 5px;
  }

  .quarter-width {
    width: 25%;
  }

  .btn-wrapper {
    margin-top: 9px;
    margin-bottom: 30px;
    text-align: center;
  }
  .print-btn {
    border: 1px solid rgba(145, 145, 155, 0.5);
    background: white;
  }

  .print-btn:hover {
    background: rgb(244, 244, 244);
  }

  .save-btn {
    color: white;
    background: #C31725;
    border: 1px solid #C31725;
  }

  .save-btn:hover {
    background: rgb(255, 61, 12);
    border-color: rgb(255, 61, 12);
  }
</style>
