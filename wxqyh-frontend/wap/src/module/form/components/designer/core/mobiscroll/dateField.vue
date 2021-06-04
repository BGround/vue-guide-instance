<template>
  <div>

    <input
      class="De-form-designer-text-field"
      type="text"
      readonly
      placeholder="请选择"
      :value="value"
      :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
      :disabled="field.disabled||field.readonly"
    >
  </div>
</template>
<script>
  export default {
    props:['field'],
    data(){
      return{
      }
    },
    computed:{
      value(){
        return this.field.value ? (this.field.value == 'linkage'?'':this.field.value) :'';
      }
    },
    mounted(){
      let $el = $(this.$el).find('.De-form-designer-text-field');
      let _this = this;
      $el.mobiscroll().date({
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
          text: '',
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
      },
    }
  }
</script>
<style lang="scss" scoped>
  .De-form-designer-text-field{
    font-size: 15px;
    display: inline-block;
    width: 100%;
    background-color: transparent;

  }
</style>

