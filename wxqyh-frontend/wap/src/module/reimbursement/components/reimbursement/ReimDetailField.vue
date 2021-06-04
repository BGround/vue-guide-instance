<template>
  <div class="qwui-reim_field_container" ref="reimField">
    <div class="qwui-reim_field_desc"
      :class="{'is-over': isExcess}"
      v-show="!isExpand"
      @click="isExpand=true">
      <div class="qwui-reim_desc_head">
        <span class="qwui-reim_desc_index">{{index + 1|pad}}</span>
        <div class="qwui-reim_desc_date">{{fieldValue.time + $t('i18n.reim.editor.to') + fieldValue.endTimes}}</div>
      </div>
      <div class="qwui-reim_desc_info">
        <span class="qwui-reim_desc_name">{{fieldValue.subjName}}</span>
        <div class="qwui-reim_desc_money">{{fieldValue.money | fixedNum}}</div>
      </div>
      <div class="qwui-reim_desc_tips" v-if="isExcess">
        <p class="qwui-tip qwui-warn_tip" v-if="warn.limitMoney">{{warn.limitMoney}}</p>
        <p class="qwui-tip qwui-warn_tip" v-if="warn.limitBudget">{{warn.limitBudget}}</p>
        <p class="qwui-tip qwui-warn_tip" v-if="fieldValue.costCenterMessage">{{fieldValue.costCenterMessage}}</p>
      </div>
    </div>

    <div class="qwui-reim_field_detail" v-show="isExpand">
      <div class="qwui-reim_field_head border-bottom-1px" :class="{'is-over': isExcess}" >
        <div class="qwui-reim_field_index">{{index + 1|pad}}</div>
        <span class="qwui-reim_field_delete" @click="deleteDetail">{{$t('i18n.reim.editor.delete')}}</span>
        <span class="qwui-reim_field_add" @click="copyDetail">{{$t('i18n.reim.editor.copy')}}</span>
        <span class="qwui-reim_field_expand" @click="isExpand=false"></span>
      </div>

      <div class="qwui-reim_field_list" v-if="MustFieldList.length">
        <template v-for="field in MustFieldList">
          <component
            :is="getReimComponent(field.field)"
            :field="field"
            :fieldValue.sync="fieldValue"
            :key="field.id"
          ></component>
        </template>
        <!--自定义字段-->
        <div class="qwui-custom_feild_line" v-if="customFeildList.length">
          <div class="custom_feild_border-bottom qwui-custom_feild border-bottom-1px" v-for="(field,index) in customFeildList" :key="index" v-if="field.isEmploy == 1">
            <component :is="getFieldComponent(field)" :field="field" @change="setValue"></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QwReimProjectField from '../reimDetailField/ReimProjectField';
  import QwDeptField from '../reimDetailField/DeptField';
  import QwSubjectField from '../reimDetailField/SubjectField';
  import QwTimeField from '../reimDetailField/TimeField';
  import QwMoneysField from '../reimDetailField/MoneysField';
  import QwInvoiceField from '../reimDetailField/InvoiceField';
  import QwRemarksField from '../reimDetailField/RemarksField';
  import QwImageField from '../reimDetailField/ImageField';
  import QwVehField from '../reimDetailField/VehField';
  import QwAskField from '../reimDetailField/AskField';
  import QwVatSpecialInvoiceField from '../reimDetailField/VatSpecialInvoiceField';
  import QwReceiptField from '../reimDetailField/ReceiptField';
  //自定义字段
  import TextField from '../customField/textField.vue';
  import TextAreaField from '../customField/textAreaField.vue';
  import OPTION from '../customField/selectedField.vue';
  import DATE from '../customField/dateField.vue';
  import {isVipGold} from '@/assets/js/vip-portal';

export default {
  name: 'QwReimDetailField',
  components: {
    // 报销明细字段
    QwReimProjectField,
    QwDeptField,
    QwSubjectField,
    QwTimeField,
    QwMoneysField,
    QwInvoiceField,
    QwRemarksField,
    QwImageField,
    QwVehField,
    QwAskField,
    QwVatSpecialInvoiceField,
    QwReceiptField,
    //自定义字段
    TextField,
    TextAreaField,
    OPTION,
    DATE
  },
  props: {
    index: Number,
    // 设置字段
    fieldList: {
      type: Array,
      default() {
        return {};
      }
    },
    // 是否有设置成本中心
    projStatus: String,
    // 报销明细
    fieldValue: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  filters: {
    pad(n) {
      return n < 10 ? `0${n}` : n;
    },
    fixedNum(val) {
      return val ?  Number(val).toFixed(2) : '0.00';
    }
  },
  data() {
    return {
      warn: {
        limitBudget: '',
        limitMoney: '',
      },
      isExpand: true,
      // 是否超额
      imgUpload: {
        // 编辑/复制等存在的原数据
        picList: [],
        //  用来提交完成后清空图片显示列表
        clearCache: false,
        url: '/portal/imageupload/imageUploadAction!doUploadImageBase64.action'
      },
    };
  },
  computed: {
    isExcess() {
      return this.fieldValue.state == '1' || this.fieldValue.budgetState == '1' || !this.fieldValue.costCenterState;
    },
    // 获取必填字段数组, 没有设置成本中心则隐藏
    MustFieldList() {
      let fieldList = this.fieldList.filter(field => {
        if (field.field == 'reimProject' && this.projStatus !== "1") {
          return false;
        }

        return field.isEmploy === '1' && field.type === 1;
      });

      return fieldList || [];
    },
    //自定义字段
    customFeildList(){
      return this.fieldValue.reimCustomFieldDataList;
    },
  },
  watch: {
    // 当复制明细时，需监听当前索引的改变
    index: {
      immediate: true,
      handler(i) {
        this.fieldValue.ext1 = i + 1;
      }
    },
    fieldValue: {
      handler(value) {
        this.$emit('update:fieldValue', value);
      },
      deep: true,
    },
  },
  mounted () {
    this.$nextTick(() => {
      const imgList = this.fieldValue.imgList;
      const top = this.$refs.reimField.offsetTop;

      // 复制时滚动到指定位置
      this.$emit('scrollTo', this.index, top);

      // 复制报销、重新编辑报销、复制报销明细时设置原有图片数据
      if (imgList.length > 0) {
        if (typeof imgList == 'string') {
          this.imgUpload.picList = imgList.split(',').map(item => ({ picPath: item }));
        } else {
          this.imgUpload.picList = imgList.map(item => ({ picPath: item.picPath }));
        }
      }
    });
  },
  updated() {
    // 删除报销明细时，更新明细索引，更新图片数据
    let index = this.index + 1;
    let imgList = this.fieldValue.imgList;
    if (this.fieldValue.ext1 != index) {
      this.fieldValue.ext1 = index;
      this.imgUpload.clearCache = true;

      this.$nextTick(() => {
        this.imgUpload.picList = imgList.length ? imgList.split(',').map(item => ({ picPath: item })) : [];
        this.imgUpload.clearCache = false;
      });
    }
  },
  methods: {
    //获取匹配自定义字段
    getFieldComponent(field) {
      var component = '';
      if(field.type == 'TEXT'){
        component = 'TextField'
      }
      else if(field.type == 'DESC'){
        component = 'TextAreaField'
      }
      else {
        component = field.type
      }
      return component;
    },
    getReimComponent(fieldName) {
      return `Qw-${fieldName.substr(0,1).toUpperCase()}${fieldName.substr(1)}Field`
    },
    setValue(val,key){
      this.fieldValue.reimCustomFieldDataList.forEach(item=>{
        if(item.id == key){
          item.value = val;
        }
      })
    },
    // 请求验证金额接口时先检查必填项
    checkMoney() {
      if (isVipGold(interfaceCode.INTERFACE_CODE_REIMBURSEMENT)) {
        // 成本中心配置
        let projectConfig = this.fieldList.find(item => item.field == 'reimProject');
        // 成本中心id
        const { subjId, control, cityId, projId, time, endTimes, subjectParentsId, money } = this.fieldValue;

        // 选择科目则验证超额情况
        if (subjId) {
          // 成本中心是必填且有值则验证超额情况
          if (projectConfig.isMust == '1') {
            if (!projId) {
              return;
            }
          }

        // 有城市控制且有值则验证超额情况
        if (control == '2') {
          if (!cityId) {
            return;
          }
        }

          this.$emit('judgeSubjectMoney');
        }
      }
    },
    // 验证成本中心预算时间
    checkCostCenter() {
      if (isVipGold(interfaceCode.INTERFACE_CODE_REIMBURSEMENT)) {
        const { projId, time, endTimes, subjectParentsId } = this.fieldValue;

        !(!projId || !time || !endTimes || !subjectParentsId) && this.$emit('checkCostCenter');
      }
    },
    // 删除报销
    deleteDetail() {
      this.$emit('deleteDetail', this.index);
    },
    // 复制报销
    copyDetail() {
      this.$emit('copyDetail', this.fieldValue);
    },
    judgeBudgetMoney(){
      const { budgetState, time, endTimes, budgetExcess, budgetEnabled } = this.fieldValue;
      const dateArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

      if (budgetState == '1') {
        let startMonth = new Date(time).getMonth() + 1;
        let endMonth = new Date(endTimes).getMonth() + 1;
        let temp = '';

        if (startMonth == endMonth) {
          temp = this.$t('i18n.reim.editor.budgetExceed').replace('[xx]', budgetExcess);

          if (window.navigator.language.indexOf('en') > -1) {
            temp = temp.replace('[start]', dateArr[startMonth - 1]);
          } else {
            temp = temp.replace('[start]', startMonth);
          }
        } else {
          temp = this.$t('i18n.reim.editor.budgetExceedAcross').replace('[xx]', budgetExcess);

          if (window.navigator.language.indexOf('en') > -1) {
            temp = temp.replace('[start]', dateArr[startMonth - 1]).replace('[end]', dateArr[endMonth - 1]);
          } else {
            temp = temp.replace('[start]', startMonth).replace('[end]', endMonth);
          }
        }

        if(budgetEnabled == '1'){
          temp += `，${this.$t('i18n.reim.exceedUnCommit')}`;
        }
        this.warn.limitBudget = temp;
      } else {
        this.warn.limitBudget = '';
      }
    },
    judgeLimitMoney() {
      const { state, limitCycle, limitMoney, surplusMoney, enabled } = this.fieldValue;
       // 1为标准超额
      if (state == '1') {
        let cycle = '';
        let temp = '';

        switch (limitCycle) {
          case 1:
            cycle = this.$t('i18n.reim.daily');
            break;

          case 2:
            cycle = this.$t('i18n.reim.weekly');
            break;

          default:
            cycle = this.$t('i18n.reim.monthly');
            break;
        }

        temp = this.$t('i18n.reim.editor.LimitExceed')
          .replace('[cycle]', cycle)
          .replace('[limit]', limitMoney)
          .replace('[aboveQuota]', surplusMoney);

        //标准超额不可提交
        if(enabled == '1'){
          temp += `, ${this.$t('i18n.reim.exceedUnCommit')}`;
        }
        this.warn.limitMoney = temp;
      } else {
        this.warn.limitMoney = '';
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@import '~../../styles/common.scss';

  $margin-top: 10px;
 .qwui-reim_field_container{
    position: relative;

    .qwui-reim_field_desc {
      padding: 0 40px 18px 13px;
      padding-right: 40px;
      margin-top: 10px;
      background-color: $color-background;
      border-left: 5px solid $money-status-normal;
      overflow: hidden;

      &::after {
        position: absolute;
        top: 50%;
        right: $box-padding;
        transform: rotate(135deg) translateY(50%);
        @extend .arrow_down;
      }

      &.is-over {
        border-color: $money-status-warn;

        .qwui-reim_desc_head {
          .qwui-reim_desc_index {
            color: $money-status-warn;
          }
        }

        .qwui-reim_desc_tip {
          color: $money-status-warn;
        }
      }

      .qwui-reim_desc_head {
        margin-top: 18px;
        line-height: 13px;

        .qwui-reim_desc_index {
          font-size: 17px;
          font-weight: 500;
        }

        .qwui-reim_desc_date {
          float: right;
          font-size: $font-size-small;
          color: $color-text-tip;
        }

      }

      .qwui-reim_desc_info {
        margin-top: 18px;
        overflow: hidden;
        line-height: 16px;

        .qwui-reim_desc_name {
          font-size: $font-size-medium-x;
          color: $color-text-d;
        }

        .qwui-reim_desc_money {
          float: right;
          font-size: $font-size-medium-x;
          font-weight: bold;
          color: $color-text-d;
          @extend .dollar;
        }
      }

      .qwui-reim_desc_tips {
        margin-top: 15px;
      }
    }

    .qwui-reim_field_detail {
      background: $color-background;
      margin-top:10px;
      .qwui-reim_field_head {
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
        padding-right: 15px;
        border-left: 5px solid $money-status-normal;
        color: $money-status-normal;

        .qwui-reim_field_index {
          flex: 1;
          margin-left: 13px;
          font-size: $font-size-large-s;
          font-weight: 500;
        }

        .qwui-reim_field_delete, .qwui-reim_field_add{
          display: flex;
          align-items: center;
          font-size: $font-size-medium;
          line-height: 1;

          &::before {
            content: '';
            display: inline-block;
            margin-right: 7px;
            width: 16px;
            height: 16px;
          }
        }

        .qwui-reim_field_delete {
          margin-right: 38px;

          &::before {
            background: url('~assets/images/reim/minus_icon.png') no-repeat center center;
            background-size: cover;
          }
        }

        .qwui-reim_field_add::before {
          background: url('~assets/images/reim/plus_icon.png') no-repeat center center;
          background-size: cover;
        }

        .qwui-reim_field_expand {
          padding-left: 30px;
          &::after {
            @extend .arrow_up;
          }
        }

        &.is-over {
          border-color: $money-status-warn;

          .qwui-reim_field_index{
            color: $money-status-warn;
          }
        }
      }

      .qwui-reim_field_list{
        margin-left: $box-padding;
      }
      .qwui-custom_feild_line{
        background-color: #f7f7f7;
        .qwui-custom_feild{
          background-color: #fff;
        }
        .custom_feild_border-bottom:last-child {
          &::before {
             border-top: 0;
          }
        }
      }

    }
  }
</style>

