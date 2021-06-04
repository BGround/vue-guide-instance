<template>
	<div class="wrap h100p" v-qw-water-mark="{ agentCode: 'hrmanagement'}">
		<div class="qwui-birth-from">
			<div
				@click="selectBirth" 
				class="qwui-lean_entry_list">
				<div class="lean_entry_list_item qwui-flexbox">
					<span class="qwui-flexItem">阳历生日</span>
					<i class="qwui-icon_arrow_fr icon_gray" v-text="param.birthday"></i>
				</div>
			</div>
			<div class="qwui-lean_entry_list">
				<div class="lean_entry_list_item qwui-flexbox">
					<span class="qwui-flexItem flex_num">农历生日</span>
					<input class="icon_gray nopad birth_moon" placeholder="如农历九月十九，则填写09-19" @keyup="getBrithMoon" />
				</div>
			</div>
			<div class="qwui-lean_entry_list">
				<div class="lean_entry_list_item qwui-flexbox">
					<span class="qwui-flexItem ">生日祝福提醒</span>
					<select v-if="isShow" class="selectTypeBirth" dir="rtl" v-model="param.notifyType">
						<option value="1">按阳历</option>
						<option value="0">按农历</option>
					</select>
					<i class="qwui-icon_arrow_fr icon_gray font_color"></i>
				</div>
			</div>
			<div class="save_btn" @click="saveBirthMes">保存</div>
			<!--时间组件-->
			<time-picker v-bind="timePicker" @confirm="confirm" @cancel='cancel'></time-picker>
		</div>	
	</div>
	

</template>
<script>
import { setBirth,hasSetBirth } from '../api/getData';
import timePicker from '@/components/basicUI/qwuiPicker/time_picker.vue';
import qwWaterMark from '@/directive/qwWaterMark';
export default {
	name:'birthFrom',
	components:{
		timePicker,
	},
	data(){
		return{
			param:{
				birthdayMoon:'',
				birthday: '',
				notifyType:1,
			}, // 请求参数

			timePicker:{ // 时间组件配置
				dateOnly:true,
				show:false,
			},
			isShow:false,
		}
	},
	created(){
		this._hasSetBirth(); //获取生日信息
	},
	methods:{
		saveBirthMes(){
			if(this.param.notifyType == '0'){
				if(!this.param.birthdayMoon ||this.param.birthdayMoon ==''){
					_.alert('提示','请填写农历生日')
					return;
				}
				let reg = /^((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31|02-29)$/;
				if(!reg.test(this.param.birthdayMoon)){
					_.alert('提示',"农历生日格式不正确")
					return;
				}
			}else{
				if(this.param.birthday == '请选择'){
					_.alert("提示",'请填写阳历生日');
					return;
				}
			}
			setBirth(this.param,data => {
				this.$router.replace({name:'employees_care_list'})
			})
			
			
		},
		getBrithMoon(e){ // 获取农历生日
			this.param.birthdayMoon = e.target.value;
		},
		confirm(date){ //获取选择日期
			this.param.birthday = date;
			this.timePicker.show = false;
		},
		cancel(){
			this.timePicker.show = false;
		},
		selectBirth(){ // 显示时间组件
			this.timePicker.show = true;
		},
		_hasSetBirth(){
			let _this = this;
			hasSetBirth({},data => {
				if(data){
					_this.param.birthday = data.birthday?data.birthday:'请选择';
					_this.param.birthdayMoon = data.birthdayMoon?data.birthdayMoon:'';
					_this.param.notifyType = data.notifyType?data.notifyType:'0';
					_this.isShow = true;
				}
			})
		}
	},
	directives: { qwWaterMark },
}
</script>
<style lang="scss" scoped>
    @media screen and (min-width: 1024px){
      /deep/ #qwWaterMark{
        width: 740px!important;
        margin: 0 auto;
      }

			/deep/ .picker{
				width: 740px!important;
        margin-left: 50%;
				transform:translateX(-370px);
			}

    }
	.qwui-birth-from{
		position: relative;
		height: 100%;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		margin: 0 14px;
		background: #fff;

		/deep/ .picker{
			z-index: 10000 !important;
		}
		.icon_gray{
			padding-right: 25px;
			font-size:16px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(178,185,200,1);
		}

	}
	.font_color{
		color:#0A1736 !important;
	}
	.save_btn{
		position: absolute;
		bottom: 4px;
		width: 100%;
		height: 40px;
		z-index: 10000;
		line-height: 40px;
		font-size:16px;
		font-family:PingFangSC-Regular;
		font-weight:400;
		text-align: center;
		color:rgba(255,255,255,1);
		background:rgba(85,133,240,1);
		border-radius:4px;
	}
	.flex_num{
		flex:0.5;
	}
	.birth_moon{
		flex:1.5;
		text-align: right;
	}
	.selectTypeBirth{
		width: 30%;
		font-size: 16px;
		font-family: PingFangSC-Regular;
		font-weight: 400;
		color: rgba(10,23,54,1);
		line-height: 50px;
		border: none;
		background: #fff;
	}
</style>


