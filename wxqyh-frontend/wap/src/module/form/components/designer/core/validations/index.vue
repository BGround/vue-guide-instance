<template>
  <div class="De-form-validate">
    <h2 class="title">校验</h2>
    <div v-for="(item) in VALIDATIONS" :key="item.value">
      <div class="label" v-if="config[item.value]">
        <span class="left">{{item.label}}</span>
        <label class="switch">
          <input
            name="validations"
            class="switch-input"
            type="checkbox"
            :value="item.value"
            v-model="fieldItem.validations"
          >
          <span class="switch-core"></span>
          <div class="switch-label"></div>
        </label>
      </div>
    </div>

    <!--填写/选项限制-->
    <label
      class="label"
      v-if="config.minimum_length"
    >
      <span class="left">{{ LIMIT[config.minimum_length]['minimum_length'] }}</span>
      <input
        type="number"
        placeholder="请输入"
        min="0"
        :value="fieldItem.minimum_length"
        @input="changeNum($event,'minimum_length')"
      >
    </label>
    <label
      class="label"
      v-if="config.maximum_length"
    >
      <span class="left"> {{ LIMIT[config.maximum_length]['maximum_length'] }}</span>
      <input
        type="number"
        placeholder="请输入"
        min="0"
        @input="changeNum($event,'maximum_length')"
        :value="fieldItem.maximum_length"
      >
    </label>
    <label
      class="label"
      v-if="config.range_min"
    >
      <span class="left">最小值</span>
      <input
        type="number"
        placeholder="请输入"
        v-model.number="fieldItem.range_min"
      >
    </label>
    <label v-if="config.range_max" class="label">
      <span class="left">最大值</span>
      <input
        type="number"
        placeholder="请输入"
        v-model.number="fieldItem.range_max"
      >
    </label>
    <label
      v-if="config.accurate_num"
      @click="showPicker"
      class="label"
    >
      <span class="left">精确小数</span>
      <input
        name="accurate_num"
        class="right"
        placeholder="请选择"
        readonly
        :value="accurateValue"
      >
    </label>
    <label v-if="config.start_date" class="label">
      <span class="left">起始日期</span>
      <date-field :field="startDateField" @change="changeDate($event,'start')"></date-field>
    </label>
    <label v-if="config.end_date" class="label">
      <span class="left">结束日期</span>
      <date-field :field="endDateField" @change="changeDate($event,'end')"></date-field>
    </label>

    <label v-if="config.unique" class="label">
      <span class="left">数据唯一性</span>
      <label class="switch">
        <input
          name="validations"
          class="switch-input"
          type="checkbox"
          v-model="fieldItem.unique"
        >
        <span class="switch-core"></span>
        <div class="switch-label"></div>
      </label>
    </label>

    <!--精确小数-->
    <picker
      ref="picker"
      :data="ACCURATE"
      :selectedIndex="[selectedIndex]"
      @select="handleSelect(arguments)"
      cancelTxt="取消"
      confirmTxt="确定"
    >
    </picker>
  </div>
</template>

<script>
  import DateField from "@/module/form/components/designer/core/mobiscroll/dateField";
  import picker from '@/components/picker'

  const VALIDATIONS = [
    {value: "presence", label: "必须填",},
    {value: "uniqueness", label: "只读项",},
    {value: "isCard", label: "填写身份证",},
    {value: "iscapital", label: "金额大写",},
  ]
  const LIMIT = {
    size: {
      minimum_length: '最少填写个数',
      maximum_length: '最多填写个数'
    },
    chars: {
      minimum_length: '最少填写字符数',
      maximum_length: '最多填写字符数',
    },
    choices: {
      minimum_length: '最少选择项数',
      maximum_length: '最多选择项数',
    }
  }
  // 精确小数
  const ACCURATE = (() => {
    let arrs = [
      {text: '不精确', value: 0},
      {text: '整数', value: -1}
    ]
    for(let i=1; i < 19; i++) {
      arrs.push({text: i+'位', value: i})
    }
    return arrs
  })()
  const ACCURATE_TEXT = (() => {
    let obj = {
      '0': '不精确',
      '-1': '整数'
    }
    for(let i=1; i < 19; i++) {
      obj[i] = i+'位'
    }
    return obj
  })()
  export default {
    name: "Validations",
    components: {
      DateField,
      picker,
    },
    props: {
      // 配置校验选项
      config: {
        type: Object,
        require: true,
        default() {
          return {
            "presence": false,            // 必须填
            "uniqueness": false,          // 只读项
            "isCard": false,              // 填写身份证
            "iscapital": false,           // 金额大写
            /*
            * maximum_length，
            * 没有勾选时为null
            * "chars": “单行、多行”最多填几个字符；
            * "choices": “多项选择、表单关联”最多选几个选项；
            * "size": 子表单”最多填写个数
            * */
            "maximum_length": false,
            /*
            * minimum_length，
            * 没有勾选时为null
            * "chars": “单行、多行”最少填几个字符；
            * "choices": “多项选择、表单关联”最少选几个选项；
            * "size": “子表单”最少填写个数
            * */
            "minimum_length": false,
            "unique": false,              // 没有勾选时为 false，数据唯一性
            "range_max": false,           // 最大值
            "range_min": false,           // 最小值
            "accurate_num": false,        // 精确小数
            "end_date": false,            // 结束日期
            "start_date": false,          // 起始日期
          }
        }
      },
      currentData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        VALIDATIONS,
        LIMIT,
        ACCURATE: [ACCURATE],   // 精确小数
        fieldItem: {
          validations: [],      // VALIDATIONS
          maximum_length: null,
          minimum_length: null,
          unique: false,        // 数据唯一性
          range_max: '',        // 最大值
          range_min: '',        // 最小值
          accurate_num: '',     // 精确值
          start_date: '',       // 开始日期
          end_date: '',         // 结束日期
        },
        startDateField: {
          validations: [],
          value: ''
        },
        endDateField: {
          validations: [],
          value: ''
        }
      }
    },
    computed: {
      // 精确值
      accurateValue() {
        let num = this.fieldItem.accurate_num
        return ACCURATE_TEXT[num]
      },
      // 已选择的精确小数
      selectedIndex() {
        let i
        ACCURATE.forEach((item,index) => {
          if(this.fieldItem.accurate_num==item.value) {
            i = index
          }
        })
        return i
      }
    },
    watch: {
      fieldItem: {
        handler(val) {
          this.$emit('validationChanged',val)
        },
        deep: true
      }
    },
    methods: {
      // 获取数据
      getData() {
        for (let key of Object.keys(this.fieldItem)) {
          this.fieldItem[key] = this.currentData[key]
        }
      },
      // 改变选择的日期
      changeDate(obj,type){
        if(type === 'start'){
          this.startDateField.value = obj.value
          this.fieldItem.start_date = obj.value
        }else if(type === 'end'){
          this.endDateField.value = obj.value
          this.fieldItem.end_date= obj.value
        }
      },
      // 选择精确小数
      handleSelect(args) {
        this.fieldItem.accurate_num = ACCURATE[args[1][0]].value
      },
      // 选择精确小数弹窗
      showPicker() {
        this.$refs.picker.show()
      },
      changeNum($event,target) {
        let val = $event.target.value
        $event.target.value=val.replace(/[^\d]/g,'')
        this.fieldItem[target] = val
      }
    },
    created() {
      this.getData()
      // 获取上一次提交时间范围的数据
      this.startDateField.value = this.fieldItem.start_date
      this.endDateField.value = this.fieldItem.end_date
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../css/formDesigner";
  @import "../../css/fieldSetting";
  .De-form-validate {
    input,.field-content .text-field {
      text-align: right;
      font-size: 15px;
    }
    .switch {
      display: flex;
      align-items: center;
      position: relative;
      &-label {
        margin-left: 10px;
        display: inline-block;

        &:empty {
          margin-left: 0;
        }
      }
      input {
        display: none;
      }
      &-core {
        display: inline-block;
        position: relative;
        width: 42px;
        height: 22px;
        border: 1px solid #E3E3E7;
        border-radius: 16px;
        box-sizing: border-box;
        background: #E3E3E7;

        &::after, &::before {
          content: " ";
          position: absolute;
          transition:transform .3s;
          border-radius: 15px;
        }

        &::after {
          width: 20px;
          height: 20px;
          background: #fff;
          box-shadow:0 1px 3px 0 rgba(0, 0, 0, .4)
        }

        &::before {
          width: 40px;
          height: 20px;
          background:#fdfdfd;
        }
      }
      &-input {
        &:checked {
          + .switch-core {
            border-color: #5585F0;
            background-color: #5585F0;

            &::before {
              transform: scale(0);
            }

            &::after {
              transform: translateX(20px);
            }
          }
        }
      }
    }
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      padding-left: 15px;
      background-color: #F7F8FA;
      color: #B2B9C8;
    }
    .label {
      padding: 15px 15px 15px 0;
      margin-left: 15px;
      display: flex;
      box-shadow:0px -1px 0px 0px rgba(247,248,250,1);
      .left, .right {
        flex: 1;
        font-size: 15px;
        color: #0A1736;
      }
      /deep/ .De-form-designer-text-field {
        text-align: right;
      }
    }
    input {
      font-size: 15px;
      color: #0A1736;
    }
    input:disabled {
      background-color: transparent;
    }
  }
</style>
