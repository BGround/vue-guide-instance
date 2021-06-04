<template>
			<div class="submitSucceed" :class="{sumitedByPc : isPC}">
				<div class="result-icon"></div>
        <h3 class="result-title">感谢您的参与</h3>
        <p class="result-tip">您所在的单位已提交过表单</p>
        <!--外部单底部logo-->
        <div class="openFooterContent">
          <a href="http://wbg.do1.com.cn/" target="_blank">
            <img src="../../../../assets/images/newsmallLogo.svg" alt="">
            道一云|企微，让工作更简单
          </a>
        </div>
			</div>

</template>
<script>
  export default {
    props: {
      isPC: {
        type: Boolean,
        default: false,
      }
    }
  };
</script>

<style scoped>
	.submitSucceed {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: #fff;
		z-index:8;
	}
  .sumitedByPc {
    width: 400px;
    margin: 28px auto;
    border-radius: 4px;
    box-shadow: 0px 14px 32px 0px rgba(201,205,214,0.8);
  }
  .result-icon {
    width: 161px;
    height: 136px;
    margin: 120px auto 14px;
    background: url(~@/assets/images/img_a-external_success@2x.png) no-repeat;
    background-size: contain;
  }
  .result-title {
    font-size:16px;
    text-align: center;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(10,23,54,1);
    line-height:24px;
  }
  .result-tip {
    font-size:14px;
    text-align: center;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(178,185,200,1);
    line-height:20px;
    margin-top: 8px;
  }
  .openFooterContent {
    position: absolute;
    bottom: 0;
		width: 100%;
		height: 16px;
		line-height: 16px;
		padding: 17px 0;
		text-align: center;
		font-size: 0;
	}
	.openFooterContent a {
    position: relative;
    padding-left: 20px;
		font-size: 12px;
		color: #999;
	}
	.openFooterContent img {
    position: absolute;
    top: 50%;
    left: 0;
		margin-right: 5px;
		width: 15px;
		height: 15px;
    transform: translateY(-50%);
  }
</style>
