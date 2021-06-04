<template>
			<div class="submitSucceed" :class="{sumitedByPc : isPC}">
				<div class="submitSucceed_main">
                <div v-show="false" class="form-qrcode-container" id="qrcode">
                  <qrcode :value="succeedData.url" type="img" :size="115"></qrcode>
                </div>
					<div class="submitSucceed_icon"></div>
					<div class="submitSucceed_msg">提交成功，感谢您的参与</div>
          <div class="operationBtn">
            <div class="addAgain btn"
              :class="succeedData.isSearchForm ? '' :'normal' "
              @click="$emit('editAgain')">再次填写</div>
					  <div class="submitResult btn" v-if="succeedData.isSearchForm"  @click="showResult">查看填单结果</div>
          </div>
					<div class="post-email"  v-if="succeedData.isSearchForm"><span @click="dialogShow = true">将结果发送至邮箱</span></div>
				</div>
				<dialog-group :class="{'qwui-dialog-email': isPC}"
                      :title="'发送结果页面到邮箱'"
											:show="dialogShow"
											@cancel="cancelDialog"
											@confirm="confirmDialog"
											cancelText="取消"
											confirmText="确定">
					<div class="dialogItem">
						<input type="text" placeholder="请输入正确的邮箱" v-model="email">
						<p class="colorRed">{{help}}</p>
					</div>
				</dialog-group>
          <!--外部单底部logo-->
        <div class="openFooterContent" v-show="isShowFooter">
          <a href="http://wbg.do1.com.cn/" target="_blank">
            <img src="../../../../assets/images/newsmallLogo.svg" alt="">
            道一云|企微，让工作更简单
          </a>
        </div>
			</div>

</template>
<script>
	import dialogGroup from '@/components/base/dialog/dialog-group';
	import {sendEmail} from '@/module/form/api/list';
    import { Qrcode } from 'vux'

  export default {
    props: {
      succeedData: {
        type: Object,
      },
      isPC: {
        type: Boolean,
        default: false,
      },
      isShowFooter: {
        type: Boolean,
        default: false
      }
    },
    components: {
      dialogGroup,
      Qrcode
    },
    data() {
      return {
        dialogShow: false,
        help: "",
        email: '',
      }
    },
    created() {
    },
    methods: {
      showResult() {
        this.$router.push({name: 'openDetail', query: {id: this.succeedData.openDetailId || ''}})
      },
      //取消发送
      cancelDialog() {
        this.dialogShow = false;
      },
      //确认发送
      confirmDialog() {
        if (!this.checkEmail(this.email)) {
          this.help = '邮箱格式不正确';
          return;
        }
        var imgSrc = document.getElementById('qrcode').querySelector('img').src;
        this.help = '';
        var data = {
          id: this.succeedData.openDetailId,
          emailAddress: this.email,
          src: imgSrc,
        }
        _.showLoading()
        sendEmail(data).then((res) => {
          _.hideLoading()
          if (res.code == "0") {
            this.dialogShow = false;
            _.alert('提示', '发送成功，请查看邮箱');
          } else {
            _.alert('提示', res.desc);
          }
        })
      },
      //邮箱验证
      checkEmail(value) {
        var reg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
        if (reg.test(value) === false) {
          this.help = '输入的格式不正确或者输入了换行符'
          return false;
        } else {
          return true
        }
      },
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
  .qwui-dialog-email >>> .qwui-dialog{
    position: absolute;
  }
	.submitSucceed_main {
		position: absolute;
		top: 45%;
		width: 100%;
		text-align: center;
		transform: translateY(-50%);
	}
	.submitSucceed_main span{
		cursor: pointer;
	}
	.submitSucceed_icon {
    width: 166px;
    height: 136px;
    margin: 0 auto;
		background: url(~assets/images/submitSuccess.png) no-repeat;
    background-size: contain;
	}
	.submitSucceed_msg {
		font-size: 18px;
		color: #7A7D80;
	}
  .operationBtn {
    display: flex;
    margin-top: 50px;
    justify-content: center;
  }
  .operationBtn .btn{
    width: 150px;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    text-align: center;
    border-radius:4px;
    cursor: pointer;
  }
  .addAgain {
    color: #A2A4A7;
    background-color: #F4F6F8;
  }
  .addAgain.normal {
    width: 230px;
    height: 44px;
    color: #FFF;
    background-color: #5585F0;
  }
  .submitResult {
    margin-left: 15px;
    color: #FFF;
    background-color: #5585F0;
  }
	.post-email {
    margin-top: 32px;
    font-size: 15px;
		color: #5585F0;
	}
	.dialogItem{
		position: relative;
		display: block;
		margin-bottom:20px;
		font-size: 14px;
		color: #333;
	}
	.dialogItem input {
		width: 100%;
		height: 40px;
		padding:0 5px;
		line-height: 40px;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
		box-sizing: border-box;
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
  .mt10{
    margin-top: 10px;
  }
  .mt20{
    margin-top: 20px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .form-qrcode-container {
    background: #fff;
    padding: 10px 10px 6px;
    margin-bottom: 12px;
    border-radius: 2px;
  }
</style>
