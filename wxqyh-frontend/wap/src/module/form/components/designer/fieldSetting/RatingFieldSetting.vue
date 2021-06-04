<template>
  <div>
    <slot name="currentType"></slot>
    <div class="fieldSet-content">
      <h2 class="fieldSet-label">标题
        <span class="mustTip">*</span>
      </h2>
      <input
        type="text"
        class="De-form-input-lg"
        :class="addRedBorder?'red-border':''"
        @blur="confirmTitleEmpty"
        placeholder="请输入"
        v-model="fieldItem.label"
        maxlength= 30
      >
      <h2 class="fieldSet-label">满分</h2>
      <div
        class="De-form-group"
        @click="showPicker"
      >
        <input
          readonly
          type="text"
          class="De-form-input-lg"
          placeholder="请选择"
          :value="fieldItem.choices.length"
          maxlength= 30
        >
        <span class="De-form-icon-arrow"></span>
      </div>
      <h2 class="fieldSet-label">外观</h2>
      <div class="ratingType">
        <div
          class="ratingItem"
          :class="{'active': fieldItem.rating_type === 'star'}"
          @click="changeRatingType('star')"
        >
          <span class="ic_a-form_star"></span>
        </div>
        <div
          class="ratingItem"
          :class="{'active': fieldItem.rating_type === 'heart'}"
          @click="changeRatingType('heart')"
        >
          <span class="ic_a-form_heart"></span>
        </div>
      </div>
    </div>
    <slot name="validations"></slot>
    <button_group :fixed="true">
      <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
      <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
    </button_group>

    <picker
      ref="picker"
      :data="RATE"
      @select="changeRate(arguments)"
      cancelTxt="取消"
      confirmTxt="确定"
    >
    </picker>
  </div>
</template>

<script>
  import picker from '@/components/picker'
  import { qwui_button, button_group } from '@/components/base/button'
  import {choices} from "../data/DesignerItem";
  const RATE = [
    {text: 3, value: 3},
    {text: 5, value: 5},
    {text: 10, value: 10},
  ]
  export default {
    name: "RatingFieldSetting",
    components: {
      qwui_button,
      button_group,
      picker
    },
    props: {
      currentData: {
        type: Object
      }
    },
    data() {
      return {
        fieldItem: null,
        RATE: [RATE],
        addRedBorder: false
      }
    },
    methods: {
      changeRate(args) {
        let value  = RATE[args[1][0]].value
        this.fieldItem.choices.length=value
        for(let i = 0;i<value;i++) {
          this.$set(this.fieldItem.choices,i,choices())
        }
      },
      cancelSelected() {
        this.$emit('cancelSelected')
      },
      confirmSelected() {
        this.$emit('confirmSelected',this.fieldItem)
      },
      changeRatingType(type) {
        this.$nextTick(()=>{
          this.fieldItem.rating_type= type
        })
      },
      showPicker() {
        this.$refs.picker.show()
      },
      confirmTitleEmpty() {
        this.addRedBorder = this.fieldItem.label ==='' ? true : false
      },
    },
    created() {
      this.fieldItem = Object.assign({},this.currentData)
    }
  }
</script>

<style lang="scss" scoped>
  .ratingItem {
    display: inline-block;
    width:60px;
    height:36px;
    line-height: 36px;
    text-align: center;
    border-radius:2px;
    border:1px solid rgba(242,242,242,1);
    cursor: pointer;
  }

  .ratingItem.active {
    border: 1px solid #FFA902;

  }
  .ratingItem.active .ic_a-form_star {
    background: url("~assets/svg/ic_a-form_star_on.svg") no-repeat center center;
  }
  .ratingItem.active .ic_a-form_heart {
    background: url("~assets/svg/ic_a-form_heart_on.svg") no-repeat center center;
  }
  .ratingType {
    margin-top: 8px;
    margin-bottom: 32px;
  }
  @import "../css/fieldSetting";
</style>
