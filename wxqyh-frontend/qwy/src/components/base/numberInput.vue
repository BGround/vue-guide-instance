<!--
config:{
	data:0,//数据
	multiple:5,//倍数
	showBtn:true//是否显示加减按钮
}
-->
<template>
	<span class="numberIpt fl">
        <input type="button" class="numberIpt_l p_btn" value="-" @click="numberIpt_reduce" v-if="config.showBtn">
        <input type="text" class="numberIpt_t" @keyup="numberIpt_t_keyup" @focus="numberIpt_t_focus" @blur="numberIpt_t_blur"  v-model="config.data">
        <input type="button" class="numberIpt_r p_btn" value="+" @click="numberIpt_plus" v-if="config.showBtn">
    </span>
</template>

<script>
	export default {
		name:"numberInput",
		props:["config"],
		methods:{
			"numberIpt_t_keyup":function(){
				if(this.config.data.length==1){
					this.config.data=this.config.data.replace(/[^1-9]/g,'');
				}else{
					this.config.data=this.config.data.replace(/\D/g,'');
				}
				if(this.config.callback){
					this.config.callback(this.config.data);
				}
			},
			"numberIpt_t_focus":function(){
				if(this.config.data==0){
					this.config.data='';
				}
			},
			"numberIpt_t_blur":function(){
				this.config.data = this.config.data.toString();
				if(this.config.data.length==1){
					var val = this.config.data.replace(/[^1-9]/g,'');
					if(val<this.config.multiple){val = this.config.multiple};
					if(val%this.config.multiple!=0){
						val = (parseInt(val/this.config.multiple)+1)*this.config.multiple;
					}
				}else{
					var val = this.config.data.replace(/\D/g,'');
					if(val<this.config.multiple){val = this.config.multiple};
					if(val%this.config.multiple!=0){
						val = (parseInt(val/this.config.multiple)+1)*this.config.multiple;
					}
				}
				this.config.data=val;
				if(this.config.callback){
					this.config.callback(this.config.data);
				}
			},
			"numberIpt_reduce":function(){
				var num = parseInt(this.config.data||0);
				if(num - this.config.multiple<=0){
					this.config.data=1
				}else{
					this.config.data=num - this.config.multiple
				}
				if(this.config.callback){
					this.config.callback(this.config.data);
				}
			},
			"numberIpt_plus":function(){
				var num = parseInt(this.config.data||0);
					this.config.data=num + this.config.multiple
				if(this.config.callback){
					this.config.callback(this.config.data);
				}
			}
		}
	}
</script>

<style>
.numberIpt{
  font-size: 0;
  height: 40px;
  display: inline-block;
  line-height: 26px;
}
.numberIpt .p_btn{
  width: 40px;
  height: 100%;
  border:1px solid #e4e4e4;
  font-size: 24px;
  text-align: center;
  color: #999;
  display: inline-block;
  box-sizing: border-box;
  cursor:pointer;
  vertical-align: middle;
  background: #fff;
  line-height: 26px;
  padding: 0;
}
.numberIpt .p_btn:hover{
  color:#C31725;
}
.numberIpt .p_btn:active{
  background: #f5f5f5;
}
.numberIpt .numberIpt_t{
  font-size: 14px;
  color: #333;
  padding: 0 5px;
  vertical-align: middle;
  border:none;
  border:1px solid #e4e4e4;
  width: 68px;
  height: 100%;
  display: inline-block;
  box-sizing: border-box;
  text-align:center;
}
.numberIpt .numberIpt_l{
	border-right: none;
}
.numberIpt .numberIpt_r{
	border-left: none;
}
</style>
