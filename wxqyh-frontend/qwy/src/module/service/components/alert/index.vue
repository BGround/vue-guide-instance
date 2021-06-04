<template>
  <div v-if="show">
    <div class="_mask"></div>
    <div class="_alert_mask">
      <div class="_alert_box">
        <slot name="title">
          <div class="_alert_header">
            <h3>{{title}}</h3>
            <span class="_alert_del" @click='close'>×</span>
          </div>
        </slot>
        <div class="_alert_body">
          <slot></slot>
        </div>
        <div class="_alert_opt">
          <slot name="btn">
            <span class="btn defaultBtn" v-if="defaultBtn" @click="defaultConfirm">{{defaultBtn}}</span>
            <span class="btn primaryBtn" v-if="primaryBtn" @click="primaryConfirm">{{primaryBtn}}</span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: "alert-dialog",
    props:{
      show:{
        type:Boolean,
        default:false,
      },
      title: {
        type: String,
        default:'提示'
      },
      primaryBtn: {
        type: String,
        default:''
      },
      defaultBtn: {
        type: String,
        default:''
      },
    },
    data(){
      return {
      }
    },
    methods:{
      close(){
        this.$emit("update:show",false);
      },
      primaryConfirm() {
        this.$emit('primaryConfirm')
      },
      defaultConfirm() {
        this.$emit('defaultConfirm')
      },
    }
  }

</script>
