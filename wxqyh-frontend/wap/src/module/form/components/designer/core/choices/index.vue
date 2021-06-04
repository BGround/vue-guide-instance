<template>
  <div class="fieldSet-choices">
    <h2 class="fieldSet-label">选项</h2>
    <ul>
      <li
        class="fieldSet-choices-item"
        v-for="(choice, index) in Choices"
        :key="choice._id"
      >
        <input
          name="choices"
          class="icon_check_sm"
          :type="TYPE[currentType]"
          :checked="choice.selected"
          @change="update(index,$event)"
        >
        <label
          class="De-form-input-sm"
        >
          <input
            type="text"
            placeholder="请输入"
            v-model="choice.value"
          >
        </label>
        <span
          v-if="Choices.length>1"
          class="delete-button"
          @click="removeChoice(index)"
        >
        </span>
      </li>
    </ul>
    <div class="choices-action clearfix">
      <a class="add-button" @click="addChoice"><span class="add-icon"></span><span>添加选项</span></a>
      <a class="edit-button" @click="editChoices">批量编辑</a>
    </div>
    <choices-edit :show.sync="choicesEditShow" :choices.sync="Choices"></choices-edit>
  </div>
</template>

<script>
  import {choices} from "../../data/DesignerItem"
  import choicesEdit from './choicesEdit'
  import DesignerMap from '../../data/DesignerMap'

  const TYPE = {
    [DesignerMap.RadioButton]: 'radio',
    [DesignerMap.CheckBox]: 'checkbox',
    [DesignerMap.DropDown]: 'radio',
  }
  export default {
    name: "choicesBox",
    components: {
      choicesEdit
    },
    props: ["CurrentChoices","currentType"],
    data() {
      return {
        TYPE,
        choicesEditShow: false, // 批量编辑弹窗
        Choices: [...this.CurrentChoices]
      }
    },
    watch:{
      Choices: {
        handler(val) {
          this.$emit('choicesChanged',val)
        },
        deep: true
      },
      // 当显示批量编辑组件时,不允许背景页面上下滑动
      choicesEditShow () {
        document.body.style.overflow = this.choicesEditShow?'hidden':'auto'
      }
    },
    methods: {
      // 添加选项
      addChoice() {
        this.Choices.push(choices())
      },
      // 删除选项
      removeChoice(index) {
        this.Choices.splice(index,1)
      },
      // 选项名额弹窗
      limitQuota() {
        this.choicesQuotaShow = !this.choicesQuotaShow
      },
      // 批量编辑弹窗
      editChoices() {
        this.choicesEditShow = !this.choicesEditShow
      },
      // 更新选项
      update(index,event) {
        let type = this.TYPE[this.currentType]
        this.Choices.map((value,i)=>{
          if(index===i) {
            if(type==='radio') {
              return value.selected = true
            }
            return value.selected = event.target.checked
          }else {
            if(type==='radio') {
              return value.selected = false
            }
          }
        })
      }
    },
    created() {
      this.Choices = [...this.CurrentChoices]
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../css/fieldSetting";
  .fieldSet-choices {
    &-item {
      display: flex;
      align-items: center;
      height: 40px;
      margin-top: 14px;
      margin-bottom: 14px;
    }
    .De-form-input-sm {
      flex: 1;
    }
    .delete-button {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-left: 10px;
      background-size: contain;
      background: url("~assets/svg/ic_a-form_del02.svg") no-repeat center center;
    }
    .choices-action {
      font-size: 15px;
      margin-top: 20px;
      margin-bottom: 32px;
      align-items: center;
      .add-button {
        float: left;
        color: #5585F0;
        cursor: pointer;
      }
      .add-icon {
        display: inline-block;
        width: 19px;
        height: 19px;
        margin-right: 10px;
        background-size: contain;
        background: url("~assets/svg/ic_a-form_add02.svg") no-repeat center center;
        vertical-align: bottom;
      }
      .edit-button {
        float: right;
        color: #7A7D80;
        cursor: pointer;
      }
    }
    input {
      font-size: 15px;
      color: #0A1736;
    }
  }

</style>
