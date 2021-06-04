<template>
  <div class="date-picker">
    <div class="date-picker__input">
      <input type="text" readonly @click="handleClickInput" v-model="currentValue" :placeholder="placeholder">
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
        name: "datePicker",
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
  .date-picker{
    width: 100%;
    input{
      width: 100%;
      text-indent: 8px;
      height: 32px;
      border: 1px solid #d0d0d0;
    }
  }
</style>
