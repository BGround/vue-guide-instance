<template>
  <div class="date-time-input">
    <div class="form__item">
      <div class="form__item__label">{{label}}</div>
      <div class="form__item__input">
        <input type="text" readonly @click="handleClickInput" v-model="currentValue" :placeholder="placeholder">
      </div>
    </div>

    <qw-date-picker
            v-model="isVisibleDatePicker"
            :current="current"
            :column-count="3"
            @select="handleSelect"
            @cancel="handleCancel"
    >
    </qw-date-picker>

  </div>
</template>

<script>

    import dayjs from 'dayjs';

    export default {
        name: "dateTimeInput",
        components: {},
        data() {
            return {
                isVisibleDatePicker: false,
                current: new Date(),
                currentValue: this.value,
            };
        },

        methods: {
            handleClickInput() {
                if(this.readonly){
                    return;
                }
                this.isVisibleDatePicker = true;
            },

            initCurrentDate(dateStr){
                if(dateStr){
                    this.current =  new Date(dateStr.replace(/-/g, "/"));
                    this.currentValue = dayjs(this.current).format("YYYY-MM-DD");
                }else{
                    this.current = new Date();
                }
            },

            handleCancel(){
                this.isVisibleDatePicker = false;
            },

            handleSelect(date){
                this.isVisibleDatePicker = false;
                this.currentValue = dayjs(date).format("YYYY-MM-DD");
                this.$emit('select', this.currentValue);
            }
        },
        model:{
            prop: 'value',
            event: 'select',
        },
        props: {
            label: {
              type: String,
              required: true,
            },
            placeholder: {
                type: String,
                default(){
                    return '请选择时间'
                }
            },
            value: {
                type: String,
                default(){
                    return ''
                }
            },
            readonly:{
                type: Boolean,
                required: false,
            }
        },
        watch:{
            value(date){
                this.initCurrentDate(date)
            }

        },
        created() {
          this.initCurrentDate(this.value)
        }
    }
</script>

<style scoped lang="scss">
  .form__item{
    padding-bottom: 14px;
  }
  .form__item__label{
    padding-left: 4px;
    padding-bottom: 6px;
  }
  .form__item__input{
    height:29px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(207,207,207,1);
    opacity:1;
    border-radius:1px;
  &>input{
     text-indent: 4px;
     width: 100%;
     height: 100%;
   }
  }
</style>
