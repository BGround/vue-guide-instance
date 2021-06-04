<template>
  <div>
    <time-picker :show.sync="switchShow" :defaultDate="defaultDate" @confirm="confirm" @cancel="cancel" minuteInterval="10"></time-picker>
    <button @click="switchShow=!switchShow">点击就送</button>{{defaultDate}}
    <time-picker :show.sync="switchShow2" :defaultDate="defaultDate2" @confirm="confirm2" @cancel="cancel" minuteInterval="10"></time-picker>
    <button @click="switchShow2=!switchShow2">点击就送22</button>{{defaultDate2}}
  </div>
</template>

<script>
  import timePicker from '@/components/basicUI/qwuiPicker/time_picker.vue'
  export default {
    components:{
      timePicker
    },
    data(){
      return{
        defaultDate: '2018-11-13 10:09',
        defaultDate2: '2018-12-04 10:09',
        switchShow:false,
        switchShow2:false
      }
    },
    methods:{
      cancel:function () {
        console.log('cancel')
      },
      confirm:function (val) {
        /*console.log('confirmxxx',val);
        if(val > '2018-08-24') {
          this.defaultDate = '1996-01-13 00:09'
        } else {
          this.defaultDate = val
        }*/
        this.defaultDate = val
      },
      confirm2(val){
        this.defaultDate2 = val
      }
    }
  }
</script>

