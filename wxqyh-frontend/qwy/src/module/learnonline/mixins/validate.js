import schema from 'async-validator';

export default {
  computed: {
    showValidate() {
      if(this.validateObj !== undefined) {
        return this.validateObj.validateState === 'error'
      } else {
        return this.validateState === 'error'
      }
    },
    validateInfo() {
      if(this.validateObj !== undefined) {
        return this.validateObj.validateMessage
      } else {
        return this.validateMessage
      }
    }
  },
  methods: {
    asyncValidate() {
      this.$nextTick(() => {
        this.validate();
      });
    },
    validate() {
      return  new Promise((resolve, reject) => {
        if(!this.objConfig.rules) resolve({title: this.objConfig.title, status: true});
        // 对于addinput包含本身的rule和child的rule
        let descriptor = {
          name: this.objConfig.rules.myRule || this.objConfig.rules
        };
        let validator = new schema(descriptor);
        validator.validate({name: this.msg}, (err, fields) => {
          let state = !err ? 'success' : 'error';
          let msg = err ? err[0].message : '';
          if(this.validateObj !== undefined) {
            this.$props.EVENT_BUS.$emit('on-input-validate', {
              parentName: this.parentName,
              keyArr: this.keyArr,
              validateObj: {
                validateState: state,
                validateMessage: msg
              }
            })
          }else {
            this.validateState = state;
            this.validateMessage = msg;
          }
          if(err) {
            resolve({
              title: this.objConfig.title,
              status: false
            });
          }else {
            resolve({
              title: this.objConfig.title,
              status: true
            });
          }
        })
      })
    },
    //生成promise对象
    returnPromise(result) {
      return new Promise((resolve, reject) => {
        resolve(result);
      })
    },
    //验证是否小于最小值或者大于最大值
    validateMin(result) {
      let min = this.objConfig.min;
      let max = this.objConfig.max;
      if((min !== undefined || max !== undefined) && result.status) {
        if(+this.msg < min || +this.msg > max){
          let maxValidateMessage = +this.msg > max && this.objConfig.maxValidateMessage;
          if(this.validateObj !== undefined) {
            this.$props.EVENT_BUS.$emit('on-input-validate', {
              parentName: this.parentName,
              keyArr: this.keyArr,
              validateObj: {
                validateState: 'error',
                validateMessage: maxValidateMessage || '不能输入小于'+min+'的数',
              }
            })
            return this.returnPromise({
              title: this.objConfig.title,
              status: false
            })
          }else {
            this.validateState = 'error';
            this.validateMessage = maxValidateMessage || '不能输入小于'+min+'的数';
            return this.returnPromise({
              title: this.objConfig.title,
              status: false
            })
          }
        }else {
          if(this.validateObj !== undefined) {
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
          }else {
            this.validateState = 'success';
            this.validateMessage = '';
            return this.returnPromise({
              title: this.objConfig.title,
              status: true
            })
          }
        }
      }else {
        return this.returnPromise(result);
      }
    },
  }
}
