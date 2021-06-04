<template>
  <div class="field-content">

    <input class="text-field" type="text"
		   :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
		   :value="field.value"
           :disabled="field.disabled||field.readonly" readonly>
  </div>
</template>
<script>
	import {field_validation} from './validation.js'
  export default {
    props:['field'],
    data(){
      return{
      }
    },
    mounted(){
      let $el = $(this.$el).find('.text-field');
      let _this = this;
      $el.mobiscroll().datetime({
        dateFormat:"yy-mm-dd",
        dateOrder:"yymmd D",
        dayText:"日",
        display:"bottom",
        endYear:2050,
        mode:"scroller",
        monthText:"月份",
        headText: '',
        stepMinute:1,
        theme:"android-holo light",
        yearText:"年份",
        cancelText: "确认",
        setText: "取消",
        buttons: [//按钮配置，请勿改变顺序！
          'cancel',{
            text: '清除',
            handler: function (event,inst) {
              inst.clear();
              inst.cancel();
            }
          },'set']
      });
      $el.on('change',function(e){
        _this.setValue(e.target.value);
      })
    },
    methods:{
      setValue(value){
        var key = this.field._id;
        this.$emit('change',{key,value});
        field_validation(this.field);
      },
    }
  }
</script>
