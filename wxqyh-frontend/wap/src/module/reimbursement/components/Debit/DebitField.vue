<!--  -->
<template>
  <div class="debit-field">
    <div class="form-item border-bottom-1px" @click="isShow = !isShow">
      <p class="pic_name">借款明细</p>
      <span class="expand-money" v-show="!isShow">￥{{(fieldValue.loanMoney || 0.00) | formatMoney }}</span>
      <i :class="{'icon-down':!isShow,'icon-up':isShow}"></i>
    </div>
    <div v-if="!readOnly && isShow">
      <div class="form-item border-bottom-1px" @click="selectDept"
           v-if="fieldSetting.dept && fieldSetting.dept.isEmploy == '1'">
        <div class="debit-field-name" :class="{'icon_isRequire':fieldSetting.dept.isMust == '1'}">所属部门</div>
        <input type="text"
               readonly
               v-model="fieldValue.deptName"
               class="debit-field-content"
               placeholder="请选择">
        <i class="arrow"></i>
        <div class="help-block" :id="'msg'+fieldSetting.dept.id" v-if="fieldHelp.dept">{{fieldHelp.dept}}</div>
      </div>
      <div class="form-item border-bottom-1px" v-if="fieldSetting.moneys && fieldSetting.moneys.isEmploy == '1'">
        <div class="debit-field-name" :class="{'icon_isRequire':fieldSetting.moneys.isMust  == '1'}">
          借款金额
        </div>
        <input type="text"
               v-model="fieldValue.loanMoney"
               @input="limitMoney"
               class="debit-field-content" placeholder="0.00"
               @blur="checkFiled('loanMoney')">
        <div class="help-block" :id="'msg'+fieldSetting.moneys.id" v-if="fieldHelp.loanMoney">{{fieldHelp.loanMoney}}</div>
      </div>
      <div class="form-item border-bottom-1px" v-if="fieldSetting.borrowingtime && fieldSetting.borrowingtime.isEmploy == '1'">
        <div class="debit-field-name" :class="{'icon_isRequire':fieldSetting.borrowingtime.isMust  == '1'}">
          借款日期
        </div>
        <div class="debit-field-content">
          <time-picker v-bind="timePickerLoan" @confirm="changeLoan" @cancel='timePickerLoan.show = false'></time-picker>
          <input class="time-input"
                 type="text"
                 placeholder="请选择"
                 readonly
                 @click="timePickerLoan.show = true;"
                 v-model="fieldValue.loanDate"
                 @blur="checkFiled('loanDate')">
        </div>
        <div class="help-block" v-if="fieldHelp.loanDate" :id="'msg'+fieldSetting.borrowingtime.id">{{fieldHelp.loanDate}}</div>
      </div>
      <div class="form-item border-bottom-1px" v-if="fieldSetting.repaymenttime && fieldSetting.repaymenttime.isEmploy == '1'">
        <div class="debit-field-name" :class="{'icon_isRequire':fieldSetting.repaymenttime.isMust  == '1'}">
          还款日期
        </div>
        <div class="debit-field-content">
          <time-picker v-bind="timePickerRepay" @confirm="changeRepay" @cancel='timePickerRepay.show = false'></time-picker>
          <input class="time-input"
                 type="text"
                 placeholder="请选择"
                 readonly
                 @click="timePickerRepay.show = true;"
                 v-model="fieldValue.repayDate"
                 @blur="checkFiled('repayDate')">
        </div>
        <div class="help-block" :id="'msg'+fieldSetting.repaymenttime.id" v-if="fieldHelp.repayDate">{{fieldHelp.repayDate}}</div>
      </div>
      <div class="form-item border-bottom-1px" style="display: inherit"
           v-if="fieldSetting.remarks && fieldSetting.remarks.isEmploy == '1'">
        <div class="debit-field-name" :class="{'icon_isRequire':fieldSetting.remarks.isMust == '1'}">
          备注
        </div>
        <remarks-textarea class="debit-field-content"
                          style="padding-top: 15px"
                          v-model="fieldValue.remark"
                          :initRows="6"
                          :maxLength="300"
                          @input="checkFiled('remark')">
        </remarks-textarea>
        <div class="help-block" :id="'msg'+fieldSetting.remarks.id" v-if="fieldHelp.remark">{{fieldHelp.remark}}</div>
      </div>
    </div>

    <!--不可编辑的情况-->
    <div class="detail-list" v-if="readOnly && isShow">
      <div class="form-item border-bottom-1px" v-if="fieldValue.deptName">
        <span class="debit-field-name">所属部门</span>
        <span class="debit-field-content">{{fieldValue.deptName}}</span>
      </div>
      <div class="form-item border-bottom-1px" v-if="fieldValue.loanMoney">
        <span class="debit-field-name">借款金额</span>
        <span class="debit-field-content">{{fieldValue.loanMoney | formatMoney}}</span>
      </div>
      <div class="form-item border-bottom-1px" v-if="fieldValue.loanDate">
        <span class="debit-field-name">借款日期</span>
        <span class="debit-field-content">{{fieldValue.loanDate}}</span>
      </div>
      <div class="form-item border-bottom-1px" v-if="fieldValue.repayDate">
        <span class="debit-field-name">还款日期</span>
        <span class="debit-field-content">{{fieldValue.repayDate}}</span>
      </div>
      <div class="debit-textarea border-bottom-1px" v-if="fieldValue.remark">
        <div>备注</div>
        <div class="content">{{fieldValue.remark}}</div>
      </div>
    </div>
    <!--部门选人组件-->
    <user-select v-bind="{ closeAllTab: true, closeGroup: true, closeUser: true, tabActive: 'dept'}"
                 :selectconfig="deptSelectConfig"
                 v-if="deptSelectConfig.show">
    </user-select>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';
  import DateTime from 'vux/src/components/datetime';
  import RemarksTextarea from '../base/RemarksTextarea.vue'
  import UserSelect from '@/components/base/user_or_dept_select';
  import timePicker from '@/components/basicUI/qwuiPicker/time_picker.vue';

  export default {
    props: {
      //新建借款传入的数据
      fieldSetting: {
        type: Object,
      },
      //借款详情传入的数据
      fieldValue: {
        type: Object,
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      isExpand: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isShow: this.isExpand,
        timePickerLoan:{ // 借款时间组件配置
          dateOnly:true,
          show:false,
          defaultDate: this.fieldValue.loanDate,
        },
        timePickerRepay:{// 还款时间组件配置
          dateOnly:true,
          show:false,
          defaultDate: this.fieldValue.repayDate,
        }
      };
    },

    components: {
      RemarksTextarea,
      DateTime,
      UserSelect,
      timePicker
    },
    computed: {
      ...mapGetters([
        'deptSelectConfig',//部门配置
        'fieldHelp'// 提示字段
      ]),
    },
    created() {
      // 初始化借还款日期
      !this.fieldValue.repayDate && this.initDate();
    },
    filters: {
      formatMoney(money) {
        return _.formatMoney(money, 2);
      },
    },
    methods: {
      // 初始化日期
      initDate() {
        let bTime = new Date();
        let rTime = new Date(bTime.getFullYear(), bTime.getMonth() + 1, bTime.getDate());
        this.fieldValue.loanDate = _.getFormatDate(bTime, 'yyyy-MM-dd');
        this.fieldValue.repayDate = _.getFormatDate(rTime, 'yyyy-MM-dd');
        // 判断还款时间是否正常
        if (!(bTime.getDate() === rTime.getDate())) {
          // 当借款日期为下个月没有的时候，还款日期会变成下下月的第一天，在这里设置它为下个月的最后一天
          this.fieldValue.repayDate = _.getFormatDate(new Date(rTime.getTime() - 1), 'yyyy-MM-dd');
        }
      },
      changeLoan(val,type){
        this.timePickerLoan.show = false;
        this.fieldValue.loanDate = val;
      },
      changeRepay(val){
        this.timePickerRepay.show = false;
        this.fieldValue.repayDate = val;
      },
      // 部门选择
      selectDept() {
        this.$emit('scrollLock', true);
        let { deptId, deptName } = this.fieldValue;
        let data = this.fieldValue.deptId ? { id: deptId, departmentName: deptName } : '';
        this.updateDeptSelectConfirm({
          data,
          index: this.index,
          callBack: {
            confirm: (data) => {
              this.$emit('scrollLock', false);
              if (!data.dept.data.length) { return; }
              const {id, departmentName} = data.dept.data[0];
              this.SET_SCROLL_LOCK(false);  // body禁止滚动
              this.fieldValue.deptId = id;
              this.fieldValue.deptName = departmentName;
              this.checkFiled('deptName');
            },
            close: () => {
              this.SET_SCROLL_LOCK(false);  // body禁止滚动
            }
          }
        })
      },
      //失去焦点校验必填
      checkFiled(name){
        //金额失焦
       /* if(name == 'loanMoney' && this.fieldValue.loanMoney){
          this.fieldValue.loanMoney = _.formatMoney(this.fieldValue.loanMoney, 2);
        }*/
        this.$emit('checkFiledBlur',name);
      },
      // 限制最长十位数,最多两位小数
      limitMoney(e) {
        /*let match = e.target.value.match(/^\d{1,8}\.\d{0,2}|\d{1,8}/);
        if (match != null) {
          e.target.value = match[0];
          this.fieldValue.loanMoney = match[0];
        }*/
        let match = e.target.value.match(/^\d{1,8}\.\d{0,2}|\d{1,8}/);
        e.target.value = match ? match[0] : '';
        this.fieldValue.loanMoney= match ? match[0] : '';
      },
      ...mapMutations([
        'SET_SCROLL_LOCK',
        'updateDeptSelectConfirm'
      ]),

    }
  }
</script>

<style scoped>
  .pic_name{
    color:#0A1736;
  }
  .debit-field {
    background: white;
  }

  .form-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 17px 0 17px 0;
    margin: 0 16px 0 15px;
    font-size: 16px;
    line-height: 20px;
    background: white;
  }

  .debit-field-name {
    margin-right: auto;
    color:#3B455D;
  }

  .icon_isRequire::after {
    margin-left: 5px;
    content: '*';
    color: #E64E4E;
  }

  .debit-field-content {
    margin-left: auto;
    text-align: right;
    font-size: 16px;
    color: #3B455D;
  }
  /deep/ .debit-field-content.qwui-remark_textarea textarea{
    color:#3B455D;
  }
  .debit-field-content input {
    text-align: right;
    font-size: 16px;
    background-color: white;
    color: #3B455D;
  }

  .help-block {
    width: 100%;
    text-align: right;
    font-size: 12px;
    color: #FF574D;
  }

  .icon-down {
    margin-left: 14px;
    width: 16px;
    height: 16px;
    background: url("~assets/images/icon_down_gray.png") no-repeat center;
    background-size: 14px 8px;
  }

  .expand-money {
    margin-left: auto;
    color: #458BE9;
    font-size: 17px;
  }

  .icon-up {
    margin-left: auto;
    width: 16px;
    height: 16px;
    background: url("~assets/images/icon_down_gray.png") no-repeat center;
    background-size: 14px 8px;
    transform: rotate(180deg);
  }

  .arrow {
    width: 16px;
    height: 16px;
    margin-left: 12px;
    background: url("~assets/images/icon_down_gray.png") no-repeat center;
    background-size: 14px 8px;
    transform: rotate(-90deg);
  }

  .debit-textarea {
    padding: 15px;
    font-size: 16px;
    /*display: flex;*/
    background: white;
  }

  .debit-textarea .content {
    margin-top: 10px;
    word-break:break-all;
  }
</style>
