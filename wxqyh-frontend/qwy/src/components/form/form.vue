<template>
  <form class="qwui-form" :style="{width:width+'px'}">
    <slot></slot>
  </form>
</template>

<script>
  import objectAssign from '@/assets/js/utils/merge';

  export default {
    name:'QwForm',
    componentName:'QwForm',
    props:{
      model: Object,
      rules:Object,
      width:String,
      labelWidth: String,
    },
    provide(){
      return {
        qwForm:this,
      }
    },
    data() {
      return {
        fields: []
      };
    },
    created(){
      this.$on('qw.form.addField',(field)=>{
        if(field){
          this.fields.push(field);
        }
      });
    },
    methods:{
      validate(callback){
        if (!this.model) {
          return;
        }

        let promise;
        // if no callback, return promise
        if (typeof callback !== 'function' && window.Promise) {
          promise = new window.Promise((resolve, reject) => {
            callback = function(valid) {
              valid ? resolve(valid) : reject(valid);
            };
          });
        }

        let valid = true;
        let count = 0;
        // 如果需要验证的fields为空，调用验证时立刻返回callback
        if (this.fields.length === 0 && callback) {
          callback(true);
        }

        let invalidFields = {};
        this.fields.forEach(field => {
          field.validate('', (message, field) => {
            if (message) {
              valid = false;
            }
            invalidFields = objectAssign({}, invalidFields, field);
            if (typeof callback === 'function' && ++count === this.fields.length) {
              callback(valid, invalidFields);
            }
          });
        });
        if (promise) {
          return promise;
        }
      },
    },
  }
</script>

<style scoped lang="scss">

</style>
