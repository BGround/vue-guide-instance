<!--  -->
<template>
  <div>
    <main-bar :titleName="titleName"></main-bar>
    <ul class="field-list">
      <li class="field-item" v-for="(item, index) in fieldList">
        <div class="field-index">{{index+1}}</div>
        <div class="field-name">
          {{item.fieldName}}
        </div>
        <div class="is-enable">
          <input type="checkbox" v-model="item.isEmploy" :disabled="item.disabled" @change="employChange(item)"> 启用
        </div>
        <div class="is-must">
          <input type="checkbox" v-model="item.isMust" :disabled="item.disabled || item.isEmploy== '0'"> 必填
        </div>
        <div class="gold-vip" v-if="item.field == 'dept'" @click="goVip"></div>
      </li>
      <li class="field-item" v-for="(item, index) in globalFields">
        <div class="field-index">{{index+fieldList.length+1}}</div>
        <div class="field-name" :class="{'relative':item.field == 'receiptAccount'}">
          {{item.fieldName}}
          <i v-if="item.field == 'receiptAccount'" class="fa-question-circle" @mouseover="isTipsBubble=true" @mouseout="isTipsBubble=false"></i>
          <div class="tipsBubble" v-if="isTipsBubble" @mouseover="isTipsBubble=true" @mouseout="isTipsBubble=false">
            <p class="tips-item tips-item-c666">· 包含“收款单位全称、银行账号、开户银行”三个字段</p>
           <!-- <p class="tips-item">· 该功能仅限金卡VIP使用。
              <a target="view_window" class="oemClass" @click="goVip">马上升级金卡</a>  &lt;!&ndash;${baseURL}/qiweipublicity/companysrv/vip/vip_gold_index.jsp'&ndash;&gt;
            </p>-->
          </div>
        </div>
        <div class="is-enable">
          <input type="checkbox" v-model="item.isEmploy" :disabled="item.disabled" @change="employChange(item)"> 启用
        </div>
        <div class="is-must">
          <input type="checkbox" v-model="item.isMust" :disabled="item.isEmploy== '0'"> 必填
        </div>
        <div class="gold-vip" v-if="item.field='receiptAccount'" @click="goVip"></div>
      </li>
    </ul>
    <cut-rules></cut-rules>
    <div class="btn-wrapper">
      <!--<input type="button" class="btn cancel-btn" value="取消">-->
      <input type="button" class="btn save-btn" value="保存"
             @click="saveFieldSetting">
    </div>
  </div>
</template>

<script>
  import CutRules from '../cutRules.vue'
  import MainBar from '../mainBar.vue'
  import { isVipGold } from '@/assets/js/vip-manager';
  import {getLoanFieldSetting, setLoanFieldSetting} from '../../../api/reimbursement/debit'

  export default {
    data() {
      return {
        titleName:'借款字段设置',
        fieldList: [],
        globalFields: [],
        isTipsBubble:false,
        baseURL:_.baseURL,
      };
    },
    components: {
      MainBar,
      CutRules,
    },
    created() {
      // 初始化借款单字段设置
      this.getLoanFieldSetting();
    },
    methods: {
      // 保存借款单字段设置
      saveFieldSetting() {
        // 合并两个字段数组
        let fieldList = this.fieldList.concat(this.globalFields);
        for(let i = 0;i<fieldList.length;i++){
          // 初始化的变量名与传给后台的变量名不一致，等待后面后台修改
          fieldList[i].name = fieldList[i].fieldName;
          // 把checkbox的true， false 换成 1， 0
          fieldList[i].isEmploy=fieldList[i].isEmploy?1:0;
          fieldList[i].isMust=fieldList[i].isMust?1:0;
        }
        setLoanFieldSetting({loanPrintConfigStrJson:JSON.stringify({list:fieldList})}).then((res)=>{
          if(res.code == '0'){
            _.alert("提交结果",res.desc,function(){
              let type= 'loanSetting';
              window.location.href = _.baseURL+`/manager/form_flow/main.jsp?module=reimbursement&tab=${type}`;
            })
          }else {
            _.alert("提交结果",res.desc)
          }
        });
      },
      getLoanFieldSetting(){
        getLoanFieldSetting().then((result) => {
          if(result.code == '0'){
            let res = result.data;
            let self = this;
            self.fieldList = res.detailFields || [];
            self.globalFields = res.globalFields || [];

            //借款金额、借款日期、还款日期默认启用必填，且禁选
            for(let i = 0;i<self.fieldList.length;i++){
              if(self.fieldList[i].field == 'moneys' || self.fieldList[i].field == 'borrowingtime' || self.fieldList[i].field == 'repaymenttime'){
                self.fieldList[i].disabled = true;
              }
            }

            // 判断是否金卡vip，不是的话，部门和收款账户信息全部设置不启用
            /*if(!isVipGold(interfaceCode.INTERFACE_CODE_REIMBURSEMENT)){
              for(let i = 0;i<self.fieldList.length;i++){
                if(self.fieldList[i].field == 'dept'){
                  self.fieldList[i].isEmploy = 0;
                  break;
                }
              }
              for(let j = 0;j<self.globalFields.length;j++){
                if(self.globalFields[j].field == 'receiptAccount'){
                  self.globalFields[j].isEmploy = 0;
                  break;
                }
              }
            }*/
          }else {
            _.alert('提示',result.desc);
          }
        });
      },
      employChange(item){
        if(item.isEmploy == '0'){
          item.isMust = 0;
        }
      },
      goVip(){
        window.open(`${this.baseURL}/qiweipublicity/companysrv/vip/vip_gold_index.jsp`);
      }
    },
    filter:{

    }
  }
</script>

<style scoped>
  .field-item:nth-child(even) {
    background: white;
  }

  .field-item {
    display: flex;
    align-items: center;
    min-height: 50px;
    width: 100%;
    background: #f5f5f5;
    font-size: 14px;
  }

  .field-index {
    padding-left: 15px;
    margin-right: 92px;
  }

  .field-name {
    padding-right: 97px;
    width: 100px;
  }
  .gold-vip {
    padding-right: 48px;
    color: #F87B00;
    cursor: pointer;
  }

  .is-enable {
    padding-right: 46px;
  }
  .gold-vip {
    height: 21px;
    background: url(~assets/images/reim/loan/tips_vipgold.png) no-repeat center;
  }
  .is-must {
    margin-right: 50px;
  }
  .relative{
    position: relative;
  }
  .tips-item{
    font-size: 12px;
    color: #999;
    line-height: 22px;
  }
  .tips-item-c666{
    color:#666;
  }
  .oemClass{
    color: #f87b00;
  }
  .fa-question-circle{
    display: inline-block;
    position: absolute;
    left: 95px;
    top: 3px;
    width: 16px;
    height: 16px;
    background: url(~assets/images/reim/loan/tip_important.png);
    background-size: 100%;
    cursor: pointer;
  }
  .tipsBubble{
    position: absolute;
    left: 55px;
    top: 30px;
    width: 300px;
    height: auto;
    min-height: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 1px;
    background: white;
    box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
    color: #666;
    z-index: 1223;
  }
  .tipsBubble:before{
    border-color: transparent transparent #ccc transparent;
    border-style: solid;
    border-width: 8px;
    content: "";
    font-size: 20px;
    left: 29px;
    position: absolute;
    top: -16px;
  }
  .tipsBubble:after{
    position: absolute;
    top: -4px;
    left: 31px;
    width: 10px;
    height: 8px;
    background: white;
    content: "";
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .btn-wrapper {
    text-align: center;
    margin-bottom: 40px;
  }

  .cancel-btn {
    border: 1px solid rgba(145, 145, 155, 0.5);
    background: white;
  }

  .cancel-btn:hover {
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
