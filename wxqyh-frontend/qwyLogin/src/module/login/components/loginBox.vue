<template>
    <div id="QwLoginBox">
        <!--登录框-->
        <div class="qwui-loginbox" :class="{'qwui-loginbox_sec': tabsParam[1] == '个人网页版'|| tabsParam.length == 1}">
            <ul class="qwui-login_tabs clearfix">
                <li v-for="(item, index) in tabsParam" :key="index" @click="toggleTabs(index)"
                    :class="{active: index == tabIndex}">{{ item }}</li>
            </ul>
            <div class="qwui-login_tab_content ">
                <!--管理平台-->
                <form :action="managerLoginUrl" method="post" v-show="tabIndex===0" id="id_form_manager">
                    <input type="hidden" name="preCode" v-model="preCode"/>
                    <input type="hidden" name="dqdp_csrf_token" v-model="token"/>
                    <input type="text" placeholder="请输入账号" class="qwui-form_ipt qwui-form_user" v-model="userName" name="j_username">
                    <input type="password" placeholder="请输入密码" class="qwui-form_ipt qwui-form_psd" v-model="passWord" name="j_password">
                    <!--根据tab值显示不同排版-->
                    <div v-show="tabsParam[1] == '个人网页'">
                        <a :href="forgetUrl" class="qwui-form_forget_psd">忘记密码？</a>
                    </div>
                    <button type="button" class="qwui-form_btn" id="btn_manager">登录</button>
                    <div v-show="tabsParam[1] == '个人网页版' || tabsParam.length == 1">
                        <p class="qwui-form_advice">建议使用 Chrome 谷歌浏览器</p>
                        <a :href="forgetUrl" class="qwui-form_forget_psd">找回密码</a>
                    </div>
                </form>
                <!--个人网页-->
                <form :action="personLoginUrl" method="post" v-show="tabIndex===1" id="id_form_person">
                    <input type="text" placeholder="请输入账号" class="qwui-form_ipt qwui-form_user" v-model="userNamePc" name="j_username">
                    <input type="password" placeholder="请输入密码" class="qwui-form_ipt qwui-form_psd" v-model="passWordPc" name="j_password">
                    <button type="button" class="qwui-form_btn" id="btn_person" @click="toPersonLogin">登录</button>
                    <p class="qwui-form_advice" v-show="tabsParam[1] == '个人网页版'">建议使用 Chrome 谷歌浏览器</p>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { toLogin, getWxqyhConfig } from "@/module/login/api/login";
import baseURL from '@/assets/js/baseURL_config';
export default {
    name: 'QwLoginBox',
    props: {
        tabsParam: {
            type: Array,
            default: () => ['管理平台', '个人网页']
        }
    },
    data() {
        return {
            tabIndex: 0,
            forgetUrl: '',
            userName: '',
            passWord: '',
            userNamePc: '',
            passWordPc: '',
            managerLoginUrl: `${baseURL}/j_spring_security_check`,
            personLoginUrl: '',
            loginKey: `${baseURL}/jCryption?getPublicKey=true`,
            loginHandshake: `${baseURL}/jCryption?handshake=true`,
            preCode: '',
            token: '',
            codeExpriseTime: 60*1000,
            isOutTime: false, // 是否超时
        }
    },
    mounted() {
        this.getConfig();
        // 后台初始化加密
        this.encrypt();
        var url = decodeURIComponent(window.location.href);
        this.preCode = _.getUrlParam(url, 'preCode');
    },
    methods: {
        // tab切换 0-管理后台 1-个人网页
        toggleTabs(index) {
            // 判断当前的tab，若相同则不执行tab切换的代码
            if(this.tabIndex == index) return;
            this.tabIndex = index;
        },
        /*
         * 初始化后台登录表单加密
         */
        encrypt() {
            var that = this;
            var el = $('#id_form_manager');
            var submitEle = $('#btn_manager');
            el.jCryption({
                submitElement: submitEle,
                getKeysURL: that.loginKey,
                handshakeURL: that.loginHandshake,
                beforeEncryption: () => {
                    if(!that.userName) {
                        _.alert("提示信息", "请输入账号");
                        return false;
                    }
                    if(!that.passWord) {
                        _.alert("提示信息", "请输入密码");
                        return false;
                    }
                    return true;
                },
                finishEncryption: ($formElement, encrypted) => {
                    that.checkLogin($formElement, 'user');
                }
            });
        },
        toPersonLogin(){
            var that = this;
            if(!that.userNamePc) {
                _.alert("提示信息", "请输入账号");
                return;
            }
            if(!that.passWordPc) {
                _.alert("提示信息", "请输入密码");
                return;
            }
            that.checkLogin($('#id_form_person'),'person')
        },
        // 处理登录
        // 验证账号和密码
        checkLogin($formElement, type) {
            var vm = this;
            let loginObj = {
                'uid': 'eeeb898d-a683-4ad1-9685-d92fca25c0d4',//这里的uid是我们分配你们的唯一uid
                'j_username': type == 'user' ? vm.userName : vm.userNamePc,
                'j_password': type == 'user' ? vm.passWord : vm.passWordPc,
                'tips': type
            }
            toLogin(loginObj)
            .then((res) => {
                if(res.code == '0') {
                    // 验证通过后，必须以 .submit() 这样的表单方式提交到对应企微的地址中
                    // 表单提交后会自动跳转到相应的登录成功页面
                    $formElement.submit();
                } else {
                    _.alert('提示信息', res.desc);
                }
            })
            .catch((err) => {
                _.alert('提示信息', '系统繁忙');
            });
        },
        getConfig(){
            var that = this;
            getWxqyhConfig()
            .then((res) => {
                if(res.code == '0') {
                   that.token = res.data.dqdp_csrf_token;
                   that.personLoginUrl = `${res.data.qiwei_web_local_port}/portal/userLoginAction!weixinWebLogin.action`;
                   that.forgetUrl = res.data.qiwei_web_local_port+'/qiweipublicity/experience2/Retrieve1.jsp';
                   if(res.data.codeExpriseTime&&res.data.codeExpriseTime!=""){
                       that.codeExpriseTime = res.data.codeExpriseTime;
                   }else {
                       that.codeExpriseTime = 60*1000;
                   }
                   that.initLoginUrl();
                } else {
                    _.alert('提示信息', res.desc);
                }
            })
            .catch((err) => {
                _.alert('提示信息', '系统繁忙');
            });
        },
        initLoginUrl(){
            var that = this;
            setTimeout(()=>{
                that.isOutTime = true;
                var url = decodeURIComponent(window.location.href);
                var redirect_uri = _.getUrlParam(url, 'redirect_uri');
                var oem = _.getUrlParam(url, 'oem');
                if(localStorage.getItem('hasDesc')!== 'true'){
                  if(oem){
                    window.document.location.href = redirect_uri + '&oem='+oem;
                    return;
                  }
                  window.document.location.href = redirect_uri;
                }
            }, that.codeExpriseTime);
        }
    }
}
</script>

<style scoped>
.qwui-loginbox {
    width: 340px;
    margin: 90px auto 130px;
    padding: 10px 0;
    background: rgba(255,255,255,.6);
    border-radius: 5px;
}
.qwui-login_tabs li {
    float: left;
    width: 50%;
    padding: 10px 0;
    text-align: center;
    color: #808080;
    font-size: 24px;
    border-bottom: 3px solid transparent;
    cursor: pointer;
}
.qwui-login_tabs li.active{
    color: #333;
    border-bottom-color: #ffa300;
}
.qwui-login_tab_content {
    margin-top: 20px;
    padding: 10px 30px 25px;
    overflow: hidden;
}
.qwui-login_tab_content .qwui-form_ipt{
    width: 240px;
    height: 40px;
    margin-bottom: 20px;
    padding-left: 40px;
    font-size: 14px;
    border: none;
}
.qwui-login_tab_content .qwui-form_user{
    background: url(~assets/images/oem_icon_user.png) no-repeat 10px;
    background-color: #fff;
}
.qwui-login_tab_content .qwui-form_psd{
    background: url(~assets/images/oem_icon_psd.png) no-repeat 10px;
    background-color: #fff;
}
.qwui-login_tab_content .qwui-form_forget_psd {
    display: block;
    float: right;
    margin: -10px 0 20px;
    color: #808080;
}
.qwui-login_tab_content .qwui-form_btn {
    width: 280px;
    height: 40px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    background-color: #ffa300;
    border: none;
}
/*
 * 当登录框tab文字显示为个人网页版时样式改变
 */
.qwui-loginbox_sec {
    margin-top: 60px;
    border-radius: 0;
}
.qwui-loginbox_sec .qwui-login_tabs {
    margin: 0 30px;
}
.qwui-loginbox_sec .qwui-login_tabs li {
    font-size: 20px;
}
.qwui-loginbox_sec .qwui-login_tabs li.active{
    color: #ff9600;
}
.qwui-loginbox_sec .qwui-login_tab_content {
    padding-bottom: 10px;
}
.qwui-loginbox_sec .qwui-form_advice {
    margin:5px 0 20px;
    color: #999;
    font-size: 12px;
}
.qwui-loginbox_sec .qwui-form_forget_psd {
    float: left;
    margin: 0;
    color: #999;
    font-size: 12px;
}
</style>

