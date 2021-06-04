<!--
    修改密码组件
 -->
<template>
  <div>
    <div class="main_wrap">
        <div>
        <div class="bounces_Box">
            <div class="box_header">
                <span class="close" @click="closeBounces">×</span>
            </div>
            <h2 class="box_title">修改账户密码</h2>
            <div>
                <div class="box_item">
                    <div class="item_name">
                        <span>当前账户名称：</span>
                    </div>
                    <div>{{dataBase.config.personName}}</div>
                </div>
                <div class="box_item">
                    <div class="item_name">
                        <span class="mustInput">*</span>
                        <span>原始密码：</span>
                    </div>
                    <div>
                        <input type="password" class="item_msg" placeholder="6~16个字符，区分大小写" v-model="oldPsw">
                    </div>
                </div>
                <div class="box_item">
                    <div class="item_name">
                        <span class="mustInput">*</span>
                        <span>新密码：</span>
                    </div>
                    <div>
                        <input type="password" class="item_msg" placeholder="6~16个字符，区分大小写" v-model="newPsw">
                    </div>
                </div>
                <div class="box_item">
                    <div class="item_name">
                        <span class="mustInput">*</span>
                        <span>确认新密码：</span>
                    </div>
                    <div>
                        <input type="password" class="item_msg" placeholder="6~16个字符，区分大小写" v-model="confirmPsw">
                    </div>
                </div>
            </div>
            <div class="btn_wrap">
                <button class="btn orangeBtn sureBtn" @click="changePsw">确认</button>
            </div>
        </div>
        </div>
    </div>
    <div class="bged">
        <qwy-footer></qwy-footer>
    </div>
  </div>
</template>
<script>
import qwFooter from '@/components/base/footer';
import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';
export default {
    data() {
        return {
            oldPsw:'',  //原始密码
            newPsw:'',  //新密码
            confirmPsw:'',  //确认密码
            dataBase
        }
    },
    components: {
        'qwy-footer':qwFooter
    },
    methods: {
      //关闭修改密码
      closeBounces(){
        this.$router.back(-1);
      },

      //检查密码是否正确
      checkPsw(){
        let { alert:_alert } = this.dataBase;

        if (!this.oldPsw.trim()) {
            _alert("提示", "原始密码为空");
            return false;
        }
        else if (!this.newPsw.trim() || !this.confirmPsw.trim()) {
            _alert("提示", "输入的新密码为空");
            return false;
        }
        else if(this.newPsw.length < 6) {
            _alert("提示", "密码不能低于6位字符");
            return false;
        }
        else if(this.newPsw.length.length > 16) {
            _alert("提示", "密码不能超过16位字符");
            return false;
        }
        else if (this.newPsw != this.confirmPsw) {
            _alert("提示", "两次输入的密码不一致");
            return false;
        }

        return true;
      },

      //确认改变密码
      changePsw(){
        let { alert:_alert } = this.dataBase;

        if(this.checkPsw()){
            axios({
                url: baseURL + '/user/user!changePasswordBySelf.action',
                method: 'POST',
                data:{
                    oldPassword: this.oldPsw,
                    newPassword: this.newPsw,
                    confirmPassword: this.confirmPsw
                },
                dataType: 'json'
            })
            .then(res => {
                if(res.code == '0'){
                    this.$router.push("/");
                }
                else{
                    _alert("提示",res.desc);
                }
            })
            .catch(err => {
                _alert("提示","网络错误");
            });
        }
      }
    },
    mounted() {
        // 动态渲染内容高度
        let windowHeight = document.documentElement.clientHeight;
        let mainHeight = windowHeight - 90 - 58;
        document.querySelector(".main_wrap").style.minHeight = `${mainHeight}px`;
    }
}
</script>
<style scoped>
    .bged{
        background: #ededed;
    }
    .main_wrap{
        padding-top: 65px;
        width: 100%;
        background: #ededed;
        box-sizing: border-box;
    }
    .bounces_Box{
        margin: 0 auto;
        width: 780px;
        border-radius: 5px;
        background: #fbfbfb;
        box-shadow: 0 5px 10px rgba(0,0,0,.1);
    }
    .box_header{
        height: 45px;
        line-break: 45px;
    }
    .box_header .close{
        float: right;
        display: block;
        padding: 12px 16px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-style: normal;
        font-size: 30px;
        color: #ccc;
        cursor: pointer;
    }
    .box_title{
        margin: 15px 0 30px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        font-size: 26px;
        color: #222;
    }
    .box_item{
        display: flex;
        margin-bottom: 25px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
    }
    .item_name{
        margin-right: 17px;
        width: 188px;
        color: #666;
        text-align: right;
    }
    .mustInput{
        color: red;
        margin-right: 5px;
    }
    .item_msg{
        padding: 0 0 0 12px;
        width: 460px;
        height: 38px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .item_msg::-webkit-input-placeholder{
        color:#ccc;
    }
    .btn_wrap{
        padding: 15px 0 45px;
        text-align: center;
    }
    .bounces_Box .sureBtn{
        width: 400px;
        height: 48px;
        font-size: 18px;
        box-sizing: border-box;
    }
</style>


