<template>
  <div class="qwui-form_item  qwui-form_item_hasLabel">
    <label class="qwui-form_item_label">{{title}}</label>
    <div class="qwui-form_item_content">
      <div class="qwui-input_wrapper">
        <div class="qwui_input_box">
            <div>
              <qwui-radio v-model="sendWhenStart" label="1" @change="startRemind">考核开始时提醒</qwui-radio>
            </div>
            <qwui-radio v-model="sendBeforeEnd" label="1"  @change="endRemind">
              <template>
                <span>考核结束前</span>
                <input type="number" class="qwui_input" v-model="sendEndTime" @change="checkTime">
                <span>分钟提醒</span>
                <span class="light-text">（仅提醒未开始考核的人员）</span>
              </template>
            </qwui-radio>
        </div>
      </div>
      <div class="qwui-form_item_error_tip" v-if="showValidate">{{validateMessage}}</div>
    </div>
  </div>
</template>

<script>
  import qwuiRadio from './QWCheckbox'
  export default {
    name: 'qwInput',
    props: {
      EVENT_BUS: {
        type: Object,
        required: true
      },
      objVal: {
        type: Object,
        required: true
      },
      keyName: {
        type: String,
        required: false
      },
      title: {
        type: String,
        required: false
      }
    },
    data() {
      return {
        validateState: '',
        validateMessage: '考核提醒不能为空，且不能输入小于1的数字',
        isFocus:false,
      }
    },
    mounted() {
      this.EVENT_BUS.$emit('on-form-item-add', this);
    },
    beforeDestroy () {
      this.EVENT_BUS.$emit('on-form-item-remove', this);
    },
    computed:{
      showValidate() {
        return this.validateState === 'error';
      },
      sendEndTime :{
        get(){
          return this.objVal.sendEndTime;
        },
        set: function(value) {
          this.EVENT_BUS.$emit('on-set-form-data', {
              key: this.keyName,
              value:{
                 sendWhenStart:this.sendWhenStart?1:0,
                 sendBeforeEnd:this.sendBeforeEnd?1:0,
                 sendEndTime:value,
              }
          });
        }
      },
      sendWhenStart:{
        get(){
          return this.objVal.sendWhenStart ==1?true:false;
        },
        set: function(value) {
          this.EVENT_BUS.$emit('on-set-form-data', {
              key: this.keyName,
              value:{
                 sendWhenStart:value?1:0,
                  sendBeforeEnd:this.sendBeforeEnd?1:0,
                  sendEndTime:this.sendEndTime,
              }
          });
        }
      },
      sendBeforeEnd:{
        get(){
          return this.objVal.sendBeforeEnd==1?true:false;
        },
        set: function(value) {
          this.validate();
          this.EVENT_BUS.$emit('on-set-form-data', {
              key: this.keyName,
              value:{
                  sendWhenStart:this.sendWhenStart?1:0,
                  sendBeforeEnd:value?1:0,
                  sendEndTime:this.sendEndTime,
              }
          });
        }
      }
    },
    methods: {
      checkTime(){
        this.validate();
      },
      validate(){
        return new Promise((resolve, reject) => {
          if((this.sendBeforeEnd && this.sendEndTime <= 0) ||(this.sendBeforeEnd && isNaN(this.sendEndTime)) || (this.sendBeforeEnd && this.sendEndTime === '')){
            this.validateState = 'error';
            resolve({
                title: this.keyName,
                status: false
            });
          }else{
            this.validateState = '';
            resolve({
                title: this.keyName,
                status: true
            });
          }
        });
      },
      startRemind(val){
      },
      endRemind(val){
      }
    },
    components:{
      qwuiRadio
    }
  }
</script>

<style lang="scss" scoped>
  .qwui_input {
  display: inline-block;
  height: 32px;
  width: 100px;
  line-height: 1.5;
  padding: 7px 10px 6px 12px;
  font-size: 12px;
  border: 1px solid #D5D5D5;
  border-radius: 2px;
  color: #333;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out;
  &:focus {
    outline: 0;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 155, 0, 0.6);
    border-color: #C31725;
  }
}
.light-text{
  color:#666;
}

</style>
