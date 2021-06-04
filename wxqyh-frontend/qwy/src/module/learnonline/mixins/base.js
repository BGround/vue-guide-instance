
export default {
  computed: {
    msg: {
      get: function() {
        return this.objVal;
      },
      set: function(value) {
        if(this.objConfig.type === 'number'){
          let val = value;
          let objKey = this.objKey;
          // 【通过分数】和【按考试分数分配学分】需要核对小数，【按考试分数分配学分】只要核对前两项
          let isFloat = objKey.length && (objKey[0] == 'passScore' ||
                (objKey.length == 4 && objKey[0] == 'examCreditType'
                && objKey[1] == 'creditTypeTwo' && objKey[3] < 2));
          if (isFloat) {
            // 核对小数
            val = val.replace(/[^\d|\.]/g, ''); // 仅保留小数点和数字
            val = val.includes('.')? parseFloat(val).toFixed(1): val; // 用户输入小数则保留一位
          } else {
            // 核对整数
            val = val.replace(/[^\.\d]/g,'').replace('.','').replace('-','');
          }
          this.$props.EVENT_BUS.$emit('on-set-form-data', {
            key: this.objKey,
            value: val
          });
        }else {
          this.$props.EVENT_BUS.$emit('on-set-form-data', {
            key: this.objKey,
            value
          });
        }
      }
    }
  },
  mounted() {
    this.handleBlur && this.$props.EVENT_BUS.$emit('on-form-item-add', this);
  },
  beforeDestroy () {
    this.$props.EVENT_BUS.$emit('on-form-item-remove', this);
  }
}
