<template>
    <div id="managerLogin">
        <div class="qwui-loginpage" :style="{ 'margin-top': marginTop + 'px' }" ref="qwjsloginpage">
            <!--头部（包括菜单栏）-->
            <div class="qwui-header">
                <div class="qwui-inner_header clearfix">
                    <a href="http://wbg.do1.com.cn" target="_blank" class="qwui-logo fl">
                        <img src="@/assets/images/logo_login.png" class="vm">
                    </a>
                    <login-header-link class="fr"></login-header-link>
                </div>
            </div>
            <!--中间登录框部分-->
            <div class="qwui-content">
                <div class="qwui-inner_content overflow">
                    <div class="qwui-loginbox clearfix overflow">
                        <!--管理账号登录-->
                        <div class="qwui-loginboxleft fl">
                            <div class="qwui-loginbox_title clearfix">
                                <span class="qwui-title_admin">管理帐号登录</span>
                                <a :href="personUrl" target="_blank" class="qwui-title_personal fr">[个人网页版]</a>
                            </div>
                            <form :action="actionUrl" method="post" autocomplete="off" id="id_form_login">
                                <div class="qwui-login_form_input" :class="{ 'qwui_input_focus' : userFocus }">
                                    <i class="qwui-login_form_ico qwui_form_ico_mail"></i>
                                    <input type="hidden" name="preCode" v-model="preCode">
                                    <input type="hidden" name="dqdp_csrf_token" v-model="token"/>
                                    <input class="qwui-form_ipt" title="请输入帐号" placeholder="请输入帐号"
                                        @focus="focusUserInput" @blur="blurUserInput" @input="userInput" v-model="userName" @keyup.enter="doLogin"
                                        name="j_username" type="text" maxlength="50" tabindex="1" autocomplete>
                                    <span class="qwui-form_close" v-show="userClose" @click="clearUserName"></span>
                                </div>
                                <div class="qwui-login_form_input" :class="{ 'qwui_input_focus' : psdFocus }">
                                    <i class="qwui-login_form_ico qwui_form_ico_psd"></i>
                                    <input class="qwui-form_ipt" title="请输入密码" placeholder="请输入密码"
                                        @focus="focusPsdInput" @blur="blurPsdInput" @input="psdInput" v-model="passWord" @keyup.enter="doLogin"
                                        name="j_password" type="password" tabindex="2">
                                    <span class="qwui-form_close" v-show="psdClose" @click="clearPassWord"></span>
                                </div>
                                <button class="qwui-login_btn" type="button" id="btn_login">登录</button>
                                <div class="qwui-login_footer f12">
                                    <p class="c999">建议使用 Chrome 谷歌浏览器</p>
                                    <div class="qwui-login_footer_link c666">
                                        <a :href="forgetUrl">找回密码</a>
                                        <span class="c999"> | </span>
                                        <a href="http://wbg.do1.com.cn/Experience" target="_blank">注册企微账户</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <!--微信登录-->
                        <a class="qwui-loginboxright fr"
                            href="https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=wx1a55799d492290c4&redirect_uri=https%3A%2F%2Fqy.do1.com.cn%2Fqwy%2Fportal%2Fweixin%2FweixinclientAction%21loginWeixin.action&state=&usertype=admin">
                            <span class="qwui-login_text">微信扫码登录</span>
                        </a>
                    </div>
                </div>
            </div>
            <!--底部-->
            <login-footer></login-footer>
        </div>
    </div>
</template>

<script>
import baseURL from '@/assets/js/baseURL_config';
import loginHeaderLink from '@/components/login/headerLink';
import loginFooter from '@/components/login/footer';
import { getWxqyhConfig } from "@/module/login/api/login";
export default {
    name: 'managerLogin',
    components: {
        "login-header-link": loginHeaderLink,
        "login-footer": loginFooter
    },
    data() {
        return {
            marginTop: 0,
            userFocus: false,
            psdFocus: false,
            userClose: false,
            psdClose:  false,
            personUrl: '',
            forgetUrl: '',
            actionUrl: `${baseURL}/j_spring_security_check`,
            userName: '',
            passWord: '',
            preCode: '',
            token: '',
            codeExpriseTime: 60*1000,
            isOutTime: false, // 是否超时
        }
    },
    created() {
        // 如果合作商登陆的session超时，查看cookie中是否有合作商的信息，再跳转到主页
        if(this.getCookie("do1qw@loginType")&& this.getCookie("do1qw@loginType")=="cooperation"&&
            this.getCookie("do1qw@managerLoginurl") && this.getCookie("do1qw@managerLoginurl")!=""&&
            this.getCookie("do1qw@coopType")=="1"){
            //只有合作商-渠道商才跳转
            //如果跳转的地址包含//module/login.html(即我们的主页)，则不跳，避免重复跳转
            //包含主页域名也不跳转qy.do1.com.cn
            var tmpUrl = this.getCookie("do1qw@managerLoginurl");
            var tmpIndex = tmpUrl.indexOf("/module/login.html");
            var tmpIndex1 = tmpUrl.indexOf("qy.do1.com.cn");
            var tmpIndex2 = tmpUrl.indexOf("tqy.do1.net.cn");
            var oemIndex_qy = tmpUrl.indexOf("qy.do1.com.cn/qwy/oem");
            var oemIndex_tqy = tmpUrl.indexOf("tqy.do1.net.cn/qwy/oem");
            if(oemIndex_qy>=0 || oemIndex_tqy >=0 || (tmpIndex<0 && tmpIndex1<0 && tmpIndex2<0)) {
                window.top.location.href = tmpUrl;
            }
        }
        var lastError = sessionStorage.getItem('SPRING_SECURITY_LAST_EXCEPTION');
        if(lastError) {
            _.alert("提示信息", lastError);
        }
    },
    mounted() {//初始化加密
        var that = this;
        this.getConfig();
        $('#id_form_login').jCryption({
            submitElement: $('#btn_login'),
            getKeysURL: baseURL + "/jCryption?getPublicKey=true",
            handshakeURL: baseURL + "/jCryption?handshake=true",
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
            }
        });

        var url = decodeURIComponent(window.location.href);
        this.preCode = _.getUrlParam(url, 'preCode');

        // 动态设置qwjsloginpage上边距
        this.adaptiveHeight();
        // 监听window的resize事件，在浏览器窗口变化时再设置qwjsloginpage上边距
        window.onresize = () => {
            this.adaptiveHeight();
        }
    },
    methods: {
        // input框获取焦点
        focusUserInput() {
            this.userFocus = true;
            this.psdClose = false;
            if(this.userName) this.userClose = true;
        },
        focusPsdInput() {
            this.psdFocus = true;
            this.userClose = false;
            if(this.passWord) this.psdClose = true;
        },
        // input框失去焦点
        blurUserInput() {
            this.userFocus = false;
        },
        blurPsdInput() {
            this.psdFocus = false;
        },
        // input输入事件
        userInput() {
            if(this.userName) this.userClose = true;
        },
        psdInput() {
            if(this.passWord) this.psdClose = true;
        },
        // 清空input内容
        clearUserName() {
            this.userName = '';
            this.userClose = false;
        },
        clearPassWord() {
            this.passWord = '';
            this.psdClose = false;
        },
        // 进行登录的操作
        doLogin() {
            $("#btn_login").trigger("click")
        },
        // 高度自适应
        adaptiveHeight() {
            let mttop = (window.innerHeight - this.$refs.qwjsloginpage.offsetHeight - 20) / 2;
            if( mttop < 0) mttop = 0;
            this.marginTop = mttop;
        },
        // 获取cookie
        getCookie(name) {
            var arr, reg = new RegExp("(^| )"+ name +"=([^;]*)(;|$)");
            return (arr = document.cookie.match(reg))?unescape(arr[2]) : null;
        },
        getConfig(){
            var that = this;
            getWxqyhConfig()
            .then((res) => {
                if(res.code == '0') {
                   that.token = res.data.dqdp_csrf_token;
                   that.forgetUrl = res.data.qiwei_web_local_port+'/qiweipublicity/experience2/Retrieve1.jsp';

                   //个人网页版跳转判断是否渠道商
                   var urlStr = window.location.href;
                   if(urlStr.indexOf("oem")==-1){
                        that.personUrl = res.data.web_page_port;
                   }else{
                        that.personUrl = `${res.data.qiwei_web_local_port}/manager/loginweb.jsp`;
                   }

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
        },
        initLoginUrl(){
            var that = this;
            setTimeout(()=>{
                that.isOutTime = true;
                var url = decodeURIComponent(window.location.href);
                var redirect_uri = _.getUrlParam(url, 'redirect_uri');
                if(localStorage.getItem('hasDesc')!== 'true'){
                    window.document.location.href = redirect_uri;
                }
            }, that.codeExpriseTime);
        }
    }
}
</script>

<style scoped>
.qwui-loginpage {
    width: 100%;
    min-width: 940px;
    height: auto;
    min-height: 100%;
}
.qwui-header {
    border-bottom: 1px solid #eee;
}
.qwui-header .qwui-inner_header{
    width: 1000px;
    height: 68px;
    margin: 0 auto;
}
.qwui-inner_header .qwui-logo {
    display: block;
    height: 68px;
    line-height: 68px;
}
.qwui-inner_header .qwui-logo img {
    height: 30px;
}
.qwui-header_right >>> .qwui-nav li {
    width: 130px;
    height: 68px;
    line-height: 68px;
    margin: 0;
    font-size: 16px;
}
.qwui-header_right >>> .qwui-nav .qwui-nav_linkMore::before {
    top: 31px;
    right: 35px;
}
.qwui-header_right >>> .qwui-nav .qwui-nav-more a {
    font-size: 14px;
}
.qwui-content {
    background: #fcfcfc;
}
.qwui-content .qwui-inner_content {
    position: relative;
    width: 1000px;
    height: 500px;
    margin: 0 auto;
}
.qwui-inner_content .qwui-loginbox {
    position: relative;
    width: 680px;
    height: 350px;
    margin: 80px auto 0;
    border: 1px solid #ddd;
    background-color: white;
}
.qwui-inner_content .qwui-loginboxleft {
    width: 345px;
    height: inherit;
    padding: 35px 0 0;
    text-align: left;
    border-right: 1px solid #ddd;
}
.qwui-loginboxleft .qwui-title_admin {
    padding-left: 45px;
    color: #666;
    font-size: 20px;
}
.qwui-loginboxleft .qwui-title_personal {
    padding: 8px 45px 0 0;
    color: #999;
    text-align: right;
}
.qwui-loginboxleft .qwui-title_personal:hover {
    color: #ff9600;
}
.qwui-loginboxleft .qwui-login_form_input {
    position: relative;
    width: 245px;
    height: 40px;
    line-height: 40px;
    margin: 20px auto 0;
    padding-right: 5px;
    clear: both;
    background-color: #fff;
    background-position: 0 -352px;
    box-shadow: inset 0 2px 1px rgba(0,0,0,0);
    border: 1px solid #ccc;
    border-radius: 0px;
    transition: border-color .15s ease-in-out 0s, box-shadow .15s ease-in-out 0s
}
.qwui-loginboxleft .qwui-login_form_input.qwui_input_focus {
    border-color: #ff9600;
    box-shadow: 0 1px 1px rgba(0,0,0,.075) inset, 0 0 8px rgba(215,155,0,.6);
    outline: 0 none;
}
.qwui-loginboxleft .qwui-login_form_ico {
    position: absolute;
    left: 9px;
    top: 13px;
    z-index: 1;
    cursor: pointer;
    width: 22px;
    height: 22px;
}
.qwui-login_form_input .qwui_form_ico_mail {
    background: url(~assets/images/form_icon_mail.png) no-repeat 0 0;
}
.qwui-login_form_input .qwui_form_ico_psd {
    background: url(~assets/images/form_icon_psd.png) no-repeat 0 0;
}
.qwui-login_form_input .qwui-form_ipt {
    position: absolute;
    top: 1px;
    width: 180px;
    line-height: 36px;
    margin-left: 35px;
    padding-right: 30px;
    border: 0px;
    outline: none;
}
.qwui-login_form_input .qwui-form_close {
    position: absolute;
    top: 0;
    right: 5px;
    width: 16px;
    height: 100%;
    background: url(~assets/images/form_icon_close.png) no-repeat scroll center center;
    background-size: 16px 16px;
    cursor: pointer;
}
.qwui-loginboxleft .qwui-login_btn {
    display: block;
    width: 255px;
    margin: 20px auto 15px;
    line-height: 42px;
    font-size: 18px;
    color: #fff;
    text-align: center;
    border: none;
    background-color: #ff9600;
}
.qwui-loginboxleft .qwui-login_btn:hover {
    background-color: #FFA500;
}
.qwui-loginboxleft .qwui-login_footer {
    width: 255px;
    margin: 10px auto 15px;
}
.qwui-loginboxleft .qwui-login_footer_link {
    height: 20px;
    margin-top: 20px;
    overflow: hidden;
}
.qwui-loginboxright {
    display: block;
    width: 333px;
    height: 350px;
    background: url(~assets/images/weixin_login.png) no-repeat scroll center;
    background-position-y: 110px;
    opacity: .8;
}
.qwui-loginboxright:hover {
    opacity: 1;
}
.qwui-loginboxright .qwui-login_text {
    display: block;
    text-align: center;
    font-size: 20px;
    margin-top: 200px;
}
</style>
