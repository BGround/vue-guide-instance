<template>
  <div class="qwui-picker_absolute">
    <div class="qwui-picker_panel time-select qwui-popper bottom" :style="{ width: width + 'px' }" v-show="visible">
      <div class="qwui-picker_panel_content qwui-scrollbar_wrap">
        <div
          class="time-select-item"
          v-for="item in items"
          :class="{ selected: value === item.value, disabled: item.disabled, default: item.value === defaultValue }"
          :disabled="item.disabled"
          @click="handleClick(item)">{{item.value}}</div>
      </div>
    </div>
  </div>
</template>

<script>

  const parseTime = function(time) {
    const values = (time || '').split(':');
    if(values.length>=2){
      const hours = parseInt(values[0],10);
      const minutes = parseInt(values[1],10);

      return{
        hours,
        minutes
      };
    }
    return null;
  }

  const compareTime = function(time1,time2){
    const value1 = parseTime(time1);
    const value2 = parseTime(time2);

    const minutes1 = value1.minutes + value1.hours * 60;
    const minutes2 = value2.minutes + value2.hours * 60;

    if (minutes1 === minutes2) {
      return 0;
    }

    return minutes1 > minutes2 ? 1 : -1;
  }

  const formatTime = function(time) {
    return (time.hours < 10 ? '0'+time.hours : time.hours) + ':' + (time.minutes < 10 ? '0' +time.minutes : time.minutes);
  }

  const nextTime = function(time, step) {
    const timeValue = parseTime(time);
    const stepValue = parseTime(step);

    const next = {
      hours: timeValue.hours,
      minutes: timeValue.minutes
    };

    next.minutes += stepValue.minutes;
    next.hours += stepValue.hours;

    next.hours += Math.floor(next.minutes / 60);
    next.minutes = next.minutes % 60;

    return formatTime(next);
  }

  export default {
    props:{
      type:{
        type:String,
        default:'time-select',
      },
    },
    data(){
      return{
        start:'08:00',
        end:'18:00',
        step:'00:10',
        value: '',
        visible: false,
        defaultValue: '',
        minTime: '',
        maxTime: '',
        width: 0
      }
    },
    methods:{
      handleClick(item){
        if(!item.disabled){
          this.$emit('pick',item.value);
        }
      },
      handleClear() {
        this.$emit('pick', null);
      },
    },
    computed:{
      items(){
        const start = this.start;
        const end = this.end;
        const step = this.step;

        const result = [];

        if(start&&end&&step){
          let current = start;
          while(compareTime(current,end)<=0){
            result.push({
              value:current,
              disabled:compareTime(current,this.minTime||'-1:-1')<=0||compareTime(current,this.maxTime||'100:100')>=0
            });
            current = nextTime(current,step);
          }
        }

        return result;
      },
    },
  }
</script>

<style scoped lang="scss" src="../scss/time-select.scss"></style>
