<template>
  <span>
    <input
      class="qwui_input"
      type="number"
      min="min"
      :class="{ errorBorder: showValidate }"
      :placeholder="placeholder"
      v-model="msg"
      @blur="handleBlur">
  </span>
</template>

<script>
import Base from '../../../../mixins/base';
import Validate from '../../../../mixins/validate'

export default {
  name: 'creditInput',

  components: {},

  mixins: [ Base, Validate ],

  props: {
    placeholder: {
      type: String,
      required: false
    },
    objVal: {
      required: true
    },
    objKey: {
      type: Array,
      required: true
    },
    keyArr: {
      type: Array,
      required: true
    },
    parentName: {
      type: String,
      required: true
    },
    validateObj: {
      type: Object,
      required: true
    },
    min: {
      type: String,
      required: true,
    },
    max: {
      type: Number,
      required: false
    },
    creditTypeTwoArray: {
      type: Array,
      required: false
    },
    EVENT_BUS: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      objConfig: {
        "type": "number",
        "min": +this.min,
        "max": this.max,
        "maxValidateMessage": "超出考试最大分值",
        "rules": {
          "required": true,
          "message": "不能为空"
        },
      },
      keyName: this.objKey,
      validateState: '',
      validateMessage: '',
    }
  },

  computed: {
    //该值所在区间的index
    targetIndex() {
      return this.objKey[2];
    },
//      需要比较的值，[[值，所在区间index, 在该区间中的index]]
    targetArray() {
      let arr = [];
      this.creditTypeTwoArray.forEach((item, index) => {
        let newArr = [];
        item[0] && newArr.push(+item[0], index, 0) && arr.push(newArr);
        newArr = [];
        item[1] && newArr.push(+item[1], index, 1) && arr.push(newArr);
      });
      return arr;
    },
//      可以进行比较的区间,[[第一个分数，第二个分数，所在区间的index]]
    targetScopeArray() {
      let arr = [];
      this.creditTypeTwoArray.forEach((item, index) => {
        let itemFirst = +item[0];
        let itemSecond = +item[1];
        itemFirst && itemSecond && arr.push([itemFirst, itemSecond, index]);
      });
      return arr;
    }
  },

  watch: {
    max() {
      this.objConfig.max = this.max;
    },
  },

  created() {
  },

  methods: {
    handleBlur() {
      return this.validate().then((result) => {
        return this.validateMin(result).then((result) => {
          //当为分数区间时继续校验规则
          if(this.creditTypeTwoArray !== undefined){
            return this.validateScope(result).then((result) => {
               return this.validateOverlap(result);
            });
          }else {
            return this.returnPromise(result);
          }
        })
      });
    },
    //校验第一个数是否小于等于第二个数
    validateScope(result) {
      //现在处于第几个区间
      let zoneIndex = this.objKey[2];
      //同一个区间下的第一个考试分数
      let firstScore = +this.creditTypeTwoArray[zoneIndex][0];
      let secondScore = +this.creditTypeTwoArray[zoneIndex][1];
      if(this.creditTypeTwoArray && result.status && this.creditTypeTwoArray[zoneIndex][0] !== '' && this.creditTypeTwoArray[zoneIndex][1] !== '' ){
        if(firstScore > secondScore){
          this.$props.EVENT_BUS.$emit('on-input-validate', {
            parentName: this.parentName,
            keyArr: this.keyArr,
            validateObj: {
              validateState: 'error',
              validateMessage: '得分区间范围输入有误',
            }
          })
          return this.returnPromise({
            title: this.objConfig.title,
            status: false
          })
        }else {
          this.$props.EVENT_BUS.$emit('on-input-validate', {
            parentName: this.parentName,
            keyArr: this.keyArr,
            validateObj: {
              validateState: 'success',
              validateMessage: '',
            }
          })
          return this.returnPromise({
            title: this.objConfig.title,
            status: true
          })
        }
      }else {
        return this.returnPromise(result);
      }
    },
    //校验区间是否重叠的resolve方法
    validateOverlap(result) {
      if(result.status){
        this.targetArray.forEach((item, index) => {
          let targetScopeArrayLength = this.targetScopeArray.length;
          let isOverlap;
          this.targetScopeArray.forEach((val, i) => {
            if(+item[1] !== +val[2]){
              let flag = this.scopeOverlap(item[0], val)
              if(flag) {
                isOverlap = flag;
              }
              if(i === (targetScopeArrayLength-1)){
                let keyParam = [...this.keyArr];
                keyParam[2] = item[1];
                keyParam[3] = item[2];
                if(isOverlap){
                  this.$props.EVENT_BUS.$emit('on-input-validate', {
                    parentName: this.parentName,
                    keyArr: keyParam,
                    validateObj: {
                      validateState: 'error',
                      validateMessage: '分值区间重叠',
                    }
                  })
                  return this.returnPromise({
                    title: this.objConfig.title,
                    status: false
                  })
                }else {
                  this.$props.EVENT_BUS.$emit('on-input-validate', {
                    parentName: this.parentName,
                    keyArr: keyParam,
                    validateObj: {
                      validateState: 'success',
                      validateMessage: '',
                    }
                  })
                  return this.returnPromise({
                    title: this.objConfig.title,
                    status: false
                  })
                }
              }
            }
          });
        });
      }else {
        return this.returnPromise(result);
      }
    },
    //获取可以比较的区间的方法
    getTargetScopeArray(creditTypeTwoArray) {
      this.targetArray.splice(0);
      creditTypeTwoArray.forEach((item, index) => {
        let newArr = [];
        item[0] && newArr.push(item[0], index) && this.targetArray.push(newArr);
        newArr = [];
        item[1] && newArr.push(item[1], index) && this.targetArray.push(newArr);
      });
      this.targetScopeArray.splice(0);
      creditTypeTwoArray.forEach((item, index) => {
        let itemFirst = item[0];
        let itemSecond = item[1];
        index != this.targetIndex && itemFirst && itemSecond && this.targetScopeArray.push([itemFirst, itemSecond]);
      });
    },
    //校验区间是否重叠的方法
    scopeOverlap(target, targetScope) {
      if(+target >= +targetScope[0] && +target <= +targetScope[1]){
        return true;
      }else {
        return false;
      }
    }
  },

}
</script>

<style lang="scss" scoped>
 @import '../../../../style/base';
.qwui_input {
  display: inline-block;
  height: 32px;
  width: 100px;
  line-height: 1.5;
  padding: 7px 10px 6px 12px;
  font-size: 12px;
  border: 1px solid #D5D5D5;
  border-radius: 2px;
  color: #333;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
  &:focus {
    outline: 0;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 155, 0, 0.6);
    border-color: #C31725;
  }
  &.errorBorder {
    border-color: $redColor;
  }
}
</style>
