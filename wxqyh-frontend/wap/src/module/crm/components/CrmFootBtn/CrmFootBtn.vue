<template>
  <div class="qwui-footbtn">
    <button class="qwui-foot_addBtn" @click="add">{{addType}}</button>
  </div>
</template>

<script>
    export default {
      props:{
        addType:"",
      },
      methods:{
        add:function(){
          this.$emit('add')
        }
      }
    }
</script>

<style >
.qwui-footbtn{
    position: fixed;
    bottom: 0;
    z-index: 20;
    padding: 10px 20px;
    box-sizing: border-box;
    width: 100%;
    min-height: 50px;
    background: #f7f7f7;
 }
.qwui-footbtn:before{
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  border-top: 1px solid #E6E6E6;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.qwui-foot_addBtn{
  width: 100%;
  height: 44px;
  border: none;
  border-radius:5px;
  font-size: 16px;
  background: #2F7DCD;
  color: #fff;
}
</style>
