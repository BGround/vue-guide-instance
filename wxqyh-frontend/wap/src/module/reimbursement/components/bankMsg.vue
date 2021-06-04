<!--  -->
<template>
  <div class="bank-received-msg">
    <div class="content border-bottom-1px">
      <div class="form-item border-bottom-1px" :id="'msg'+bankMsg.id" @click="changeShowBank">
        <div class="debit-field-name">银行收款信息</div>
        <div>
          <div class="bank-load" v-show="bankSwitch"> <!-- v-show="bankState == 0"-->
            <span style="margin-right: 25px;">加载上次</span>
            <switch-btn v-model="isBankSwitch" class="btn" style="margin-top: 4px;"></switch-btn>
          </div>
          <div class="drop-down" v-show="isShowHide" :class="{'detail-arrowImg':this.showBank }">
            <img width="14" height="8" src="../../../assets/images/icon_down_gray.png" alt="">
          </div>
        </div>
      </div>
      <div v-if="isEdit">
        <div v-show="showBank|| bankSwitch">
          <div class="form-item border-bottom-1px">
            <div class="bank_label" :class="{'icon_isRequire':bankMsg.isMust == 1}">收款单位全称</div>
            <input type="text" class="debit-field-content bank_num" v-model="bankMsg.receiptFullName" placeholder="请输入" @blur="checkFiled('receiptFullName')">
            <div class="help-block" v-if="fieldHelp.receiptFullName">{{fieldHelp.receiptFullName}}</div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="bank_label" :class="{'icon_isRequire':bankMsg.isMust == 1}">银行账号</div>
            <input type="tel" class="debit-field-content bank_num"
                   @input="bankAccountInput"
                   v-model="bankMsg.bankAccount"
                   @blur="getBankName"
                   placeholder="请输入" maxlength="30">
            <div class="help-block" v-if="fieldHelp.bankAccount">{{fieldHelp.bankAccount}}</div>
          </div>
          <div class="form-item border-bottom-1px">
            <div class="bank_label" :class="{'icon_isRequire':bankMsg.isMust == 1}">开户银行</div>
            <input type="text" class="debit-field-content bank_num" v-model="bankMsg.depositBank"  placeholder="请输入" @blur="checkFiled('depositBank')">
            <div class="help-block" v-if="fieldHelp.depositBank">{{fieldHelp.depositBank}}</div>
          </div>
        </div>
      </div>

      <!--不可编辑-->
      <div v-if="!isEdit">
        <div v-show="showBank || bankSwitch">
          <div class="form-item border-bottom-1px" v-if="bankMsg.receiptFullName">
            <div class="bank_label">收款单位全称</div>
            <input type="text" class="debit-field-content bank_num" v-model="bankMsg.receiptFullName" disabled>
          </div>
          <div class="form-item border-bottom-1px" v-if="bankMsg.bankAccount">
            <div class="bank_label">银行账号</div>
            <input type="text" class="debit-field-content bank_num" v-model="bankMsg.bankAccount" disabled>
          </div>
          <div class="form-item border-bottom-1px" v-if="bankMsg.depositBank">
            <div class="bank_label">开户银行</div>
            <input type="text" class="debit-field-content bank_num" v-model="bankMsg.depositBank" disabled>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SwitchBtn from '@/components/form/switchBtn';
  //  import {getBankName} from '../api/editor';
  import {getBankName} from '../api/editor';
  import {mapGetters} from 'vuex'

  export default {
    props: {
      bankMsg: {
        type: Object,
      },
      bankSwitch: {//是否展示加载上一次按钮
        type: Boolean,
        default: false,
      },
      isShowHide:{//是否支持展开收起功能
        type: Boolean,
        default: false,
      },
      showDown: {//展开或收起
        type: Boolean,
        default: true,
      },
      isEdit: {//是否可编辑
        type: Boolean,
        default: false,
      }
    },
    created() {
    },
    data() {
      return {
        showBank: this.showDown,
        isBankSwitch: false,
      };
    },
    watch: {
      isBankSwitch(val) {
        this.$emit('BankSwitch', val);
      },
      showDown(val) {
        this.showBank=this.showDown;
      },
    },
    components: {
      SwitchBtn,
    },

    computed: {
      ...mapGetters([
        'fieldHelp',
      ]),
      bankInfo() {
        return this.bankMsg;
      }
    },
    mounted() {
    },

    methods: {
      changeShowBank() {
        this.showBank = !this.showBank;
      },
      // 银行账号保留整数
      bankAccountInput(e) {
        let reg = /[^\d]/g;
        let bankAccount = e.target.value.replace(reg, '');
        this.bankMsg.bankAccount = bankAccount;
        e.target.value = bankAccount;
      },
      // 根据银行卡获取开户银行
      getBankName(e) {
        this.checkFiled('bankAccount');
        let cardId = e.target.value;
        if (cardId === '') {
           return;
        }
        getBankName({cardId:cardId}).then((res) => {
          this.$set(this.bankMsg, 'depositBank', res.data.bankName);
          /*if(res.data.bankName == ''){
            this.checkFiled('depositBank');
          };*/
        }).catch((err) => {
          _.alert('提示', '网络错误！');
        })
      },
//      getBankVal() {
//        this.bankMsg.depositBank = this.bankName;
//        this.bankMsg.receiptFullName = this.receiptFullName;
//        this.bankMsg.bankAccount = this.bankAccount;
//      }
      //失去焦点校验必填
      checkFiled(name){
        this.$emit('checkFiledBlur',name);
      },
    }
  }
</script>

<style scoped>
  .form-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 17px 0 17px 0;
    margin: 0 16px 0 15px;
    font-size: 16px;
    line-height: 20px;
    color:#3B455D;
    background: white;
  }

  .icon_isRequire::after {
    margin-left: 5px;
    content: '*';
    color: #E64E4E;
  }

  .debit-field-name {
    margin-right: auto;
    color:#0A1736;
  }

  .bank_label{
    margin-left: 0;
  }
  .debit-field-content {
    margin-left: auto;
    text-align: right;
    font-size: 16px;
    color: #3B455D;
  }
  .debit-field-content:disabled{
    color: #3B455D;
    /*字体颜色安卓与IOS适配*/
    -webkit-text-fill-color:#3B455D;
    opacity: 1;
  }
  .debit-field-content input {
    text-align: right;
    font-size: 16px;
    background-color: white;
  }
  .bank_num{
    flex: 1;
  }

  .help-block {
    width: 100%;
    text-align: right;
    font-size: 12px;
    color: #FF574D;
  }

  .bank-received-msg {
    color: #555;
    background: white;
  }

  .content {
    background: white;
  }

  .debit-field-content {
    color:#3B455D;
    background-color: #fff;
  }

  .bank-load {
    margin:-4px 0 0 auto;
    padding-right: 25px;
    font-size: 13px;
    color: #888;
  }

  .detail-arrowImg {
    transform: rotate(180deg);
  }
  /deep/ .btn .qwui-onOff_choose{
    right: 0;
  }
  /deep/ .btn .qwui-onOff{
    /*background-color: #FDFDFD;*/
  }
</style>
