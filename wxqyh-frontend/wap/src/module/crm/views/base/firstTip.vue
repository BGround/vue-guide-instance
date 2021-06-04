<template>
  <div class="qwui-mask" @click="closeTip">
	  <div class="qwui-mask_content" @click.stop="noClose">
			<div class="qwui-mask_text">
				<p class="qwui-text">裂变式营销推广</p>
				<p class="qwui-text">智能数据分析实时了解客户行为及喜好</p>
				<p class="qwui-text">不加好友即可聊天跟进，高效获客</p>
			</div>
	  	<div class="qwui-go" @click.stop="goTip" v-show="imgShowFlag">
	  		<span class="qwui-tip">详&nbsp细&nbsp了&nbsp解</span>
	  	</div>
	  </div>
  </div>
</template>

<script>
const goLearnUrl = 'https://mp.weixin.qq.com/s?__biz=MzA3ODk1MDcwMw==&mid=504426227&idx=1&sn=359d0a855d33920831ffb030824a0302&chksm=045eb6b333293fa58b98cc5a6b455443d26def0d527f6f982b64874c706b15fd36116c8de6bf#rd';
export default {
	name: '',
	data(){
		return {
			imgShowFlag: true
		}
	},
  methods:{
    closeTip(){
			this.$emit('closeTip');
		},
		goTip(){
			this.$emit('closeTip');
			window.open(goLearnUrl,'_target')
		},
		noClose(){}
	}
}
</script>

<style lang="scss" scoped>
.qwui-mask {
	position: fixed;
	width: 100%;
	height: 100%;
	top:0;
	left: 0;
	right: 0;
	margin: 0 auto;
	background-color: rgba(0,0,0,.4);
  z-index: 100;
}
.qwui-mask_content {
	position: absolute;
	width: 321px;
	height: 268px;
	top: 100px;
	left: 50%;
  overflow: hidden;
	transform: translate(-50%,0);
	background-image: url('../../../../assets/images/crm/index_popup.png');
	background-repeat: no-repeat;
	background-size: contain;
	.qwui-mask_text {
		margin-top: 113px;
		.qwui-text {
			position: relative;
			font-size: 15px;
    	color: #0A1735;
    	padding-left: 32px;
    	margin-bottom: 8px;
			&::after {
				content: "";
				position: absolute;
				width: 5px;
				height: 5px;
				background-color: #A0C3FF;
				top: 50%;
				left: 21px;
				border-radius: 50%;
				transform: translateY(-50%);
			}
		}
	}
}
.qwui-tip_img {
	width: 321px;
}
@media screen and (max-width: 320px) {
  .qwui-tip_img {
    width: 273px;
  }
}
.qwui-go {
	position: absolute;
  width: 217px;
	height: 36px;
	bottom: 24px;
	left: 50%;
	transform: translate(-50%,0);
	background-color: rgba(85,133,240,1);
	box-shadow:0px 8px 14px 0px rgba(85,133,240,0.3);
	border-radius:26px;
	text-align: center;
	line-height: 36px;
}
.qwui-tip {
	color: #fff;
	font-size: 15px;
	font-family:PingFangSC-Medium;
}
.qwui-close {
	position: absolute;
	top: 0px;
	right: 0px;
  padding: 5px;
  font-size: 0;
  .qwui-close_icon {
    width: 16px;
	  height: 16px;
  }
}
 
</style>


