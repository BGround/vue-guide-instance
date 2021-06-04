<template>
  <div>
    <!--<div @click="showPicker" class="qwui-time_picker">{{defaultDate}}</div>-->
    <vue-picker
      :data="pickData"
      :initDate="transferDate"
      ref="picker"
      @select="handleSelect"
      @cancel="handleCancel"
      :cancelTxt="$t('i18n.cancel')" :confirmTxt="$t('i18n.confirm')">
      ></vue-picker>
  </div>
</template>

<script>
  import vuePicker from './date_picker.vue'
  // 月
  const MONTH = [
    {text: '01'},
    {text: '02'},
    {text: '03'},
    {text: '04'},
    {text: '05'},
    {text: '06'},
    {text: '07'},
    {text: '08'},
    {text: '09'},
    {text: '10'},
    {text: '11'},
    {text: '12'},
  ]
  // 日
  const DAY = [
    {text: '01'},
    {text: '02'},
    {text: '03'},
    {text: '04'},
    {text: '05'},
    {text: '06'},
    {text: '07'},
    {text: '08'},
    {text: '09'},
    {text: '10'},
    {text: '11'},
    {text: '12'},
    {text: '13'},
    {text: '14'},
    {text: '15'},
    {text: '16'},
    {text: '17'},
    {text: '18'},
    {text: '19'},
    {text: '20'},
    {text: '21'},
    {text: '22'},
    {text: '23'},
    {text: '24'},
    {text: '25'},
    {text: '26'},
    {text: '27'},
    {text: '28'},
    {text: '29'},
    {text: '30'},
    {text: '31'}
  ]
  // 时
  const HOUR = [
    {text: '00'},
    {text: '01'},
    {text: '02'},
    {text: '03'},
    {text: '04'},
    {text: '05'},
    {text: '06'},
    {text: '07'},
    {text: '08'},
    {text: '09'},
    {text: '10'},
    {text: '11'},
    {text: '12'},
    {text: '13'},
    {text: '14'},
    {text: '15'},
    {text: '16'},
    {text: '17'},
    {text: '18'},
    {text: '19'},
    {text: '20'},
    {text: '21'},
    {text: '22'},
    {text: '23'},
  ]

  export default {
    props:{
      defaultDate:{
        type:String,
        default:''
      },
      show:{
        type:Boolean,
        default:false
      },
      dateOnly:{
        type:Boolean,
        default:false
      },
      monthOnly:{
        type:Boolean,
        default:false
      },
      minYear:{
        type:Number,
        default:1900
      },
      maxYear:{
        type:Number,
        default:2030
      },
      year:{
        type:Array,
        default:()=>[]
      },
      //分钟间隔多少显示
      minuteInterval:{
        type:[Number,String],
        default:1
      }
    },
    watch:{
      show(val){
        if(val) {
          this.showPicker();
        }
      },
      defaultDate(val){
        this.transferDate = val
        this.dealDate();
      }
    },
    data(){
      return{
        pickData:[],
        minute:[],
        transferDate:this.defaultDate
      }
    },
    created(){
      for (let year =this.minYear; year <= this.maxYear; year++) {
        this.year.push({text:year});
      }
      for (let minute = 0; minute <= 59; minute += parseInt(this.minuteInterval)) {
        this.minute.push({text:minute >= 10 ? minute : '0' + minute});
      }
      this.dealDate();
      this.pickData = this.dateOnly
        ? [this.year, MONTH, DAY]
        : this.monthOnly
          ? [this.year, MONTH]
          : [this.year, MONTH, DAY, HOUR, this.minute]
    },
    methods:{
      //根据配置的时间间隔处理时间
      dealDate(){
        if(this.minuteInterval == 1){
          return
        }
        if(this.transferDate.length == 16){
          let tempM = this.transferDate.slice(14,16)
          if(tempM%this.minuteInterval != 0){
            tempM -= tempM%this.minuteInterval;
            tempM < 10 ? tempM = '0' + tempM : '';
            this.transferDate = this.transferDate.slice(0, 14) + tempM
          }
        }
      },
      showPicker:function () {
        this.$refs['picker'].show();
      },
      handleSelect:function (select) {
        let temp = select[0] + '-' + select[1] + '-' + (select[2] ? select[2].substring(0,2) : '') + (select[3] ? (' ' + select[3] + ':' + select[4]) : '')
        this.$emit('update:show',false)
        this.$emit('confirm',temp,select)
      },
      handleCancel:function () {
        this.$emit('update:show',false)
        this.$emit('cancel')
      }
    },
    components:{
      vuePicker
    }
  }
</script>

<style scoped>
  .qwui-time_picker{
    position: relative;
    width: auto;
    height: 40px;
    margin: 0 10px;
    font-size: 16px;
    line-height: 40px;
    cursor: pointer;
  }
</style>
