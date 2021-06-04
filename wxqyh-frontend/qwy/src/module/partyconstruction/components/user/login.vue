<template lang="html">
  <div class="user-login">
    <div class="login-show">
      <img src="../../static/img/slogan.png">
    </div>
    <div class="login-box">
      <h1>欢迎登陆<span>智慧党建平台</span></h1>
      <form class="login-form" method="post" ref="login" :action="loginLink" @submit="login">
        <p>
          <i class="icon icon-user"></i>
          <input type="text" name="j_username" v-model="username" placeholder="请输入账号">
        </p>
        <p>
          <i class="icon icon-pass"></i>
          <input type="password" name="j_password" v-model="password" placeholder="请输入密码">
          <span class="warning" v-if="isShowWarning" v-text="warning"></span>
        </p>
        <p>
          <input class="submit" :class="{'could-submit': couldSubmit}" type="submit" value="登   录">
        </p>
      </form>
      <p class="login-tips">
        <a :href="findBackLink">找回密码</a>
        <span>建议使用 Chrome 谷歌浏览器</span>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config.js';

export default {
  name: 'QwUserLogin',
  data () {
    return {
      username: '',
      password: '',
      isShowWarning: false,
      warning: '',
      isCheckout: false // 是否已经检查帐号密码
    }
  },
  computed: {
    couldSubmit () {
      return this.username && this.password;
    },
    // 找回密码
    findBackLink () {
      return `${baseURL}/qiweipublicity/experience2/mail_Retrieve1.jsp`;
    },
    // 登录链接
    loginLink () {
      return `${baseURL}/j_spring_security_check`;
    }
  },
  methods: {
    // 登录预处理
    login (e) {
      if (this.username === '') {
        this.warning = '帐号不能为空';
        this.isShowWarning = true;
      } else if (this.password === '') {
        this.warning = '密码不能为空';
        this.isShowWarning = true;
      } else if (this.isCheckout) {
        this.isShowWarning = false;
        this.isCheckout = false;
        return;
      } else {
        this.preLogin();
      }
      e.preventDefault();
    },
    // 预登录
    async preLogin () {
      let res = (await axios({
          url: `${baseURL}/portal/cooperationOpen/cooperationOpenAction!checkUserByTips.action`,
          method: 'post',
          data: {
            uid: 'eeeb898d-a683-4ad1-9685-d92fca25c0d4',
            j_username: this.username,
            j_password: this.password,
            tips: 'user'
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
        })).data;

      if (res.code === '100') {
        this.isCheckout = true;
        this.$refs.login.submit();
      } else {
        this.warning = res.desc;
        this.isShowWarning = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-login {
  text-align: center;

  & > div {
    display: inline-block;
    text-align: left;
  }

  .login-show {
    position: relative;
    top: 30px;
    margin-top: -7px;
    font-size: 0px;
  }

  .login-box {
    padding: 50px 26px;
    margin: 0 50px;
    width: 312px;
    background-color: white;
    border-radius:4px;
    box-shadow:0px 11px 16px 0px rgba(128,52,5,0.42);

    h1 {
      margin-bottom: 32px;
      color: #666666;
      font-size: 22px;
      font-weight: normal;

      span {
        margin-left: 4px;
        color: #E94528;
        letter-spacing: 1px;
      }
    }

    p {
      position: relative;
    }

    input {
      padding: 0px 12px 0 36px;
      margin-bottom: 20px;
      width: 262px;
      height: 42px;
      color: #7A7C80;
      font-size: 12px;
      line-height: 42px;
      border-radius: 4px;
      border: 1px solid rgba(240,240,240,1);
      outline: none;

      &::-webkit-input-placeholder { /* WebKit browsers */
        color: #CCCCCC;
      }

      &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #CCCCCC;
      }

      &::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #CCCCCC;
      }

      &:-ms-input-placeholder { /* Internet Explorer 10+ */
        color: #CCCCCC;
      }

      &[type="submit"] {
        padding: 0;
        margin-top: 22px;
        width: 312px;
        height: 44px;
        color: white;
        font-size: 14px;
        cursor: pointer;
      }

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 400px white inset !important;
        color: #7A7C80 !important;
      }

      &.submit {
        background-color: #CCCCCC;
      }

      &.could-submit {
        background-color: #E94528;
      }
    }

    .icon {
      position: absolute;
      top: 13px;
      left: 12px;
      width: 18px;
      height: 18px;
      background: {
        size: auto 100%;
        position: center center;
        repeat: no-repeat;
      }

      &.icon-user {
        background-image: url(../../static/img/user.png);
      }

      &.icon-pass {
        background-image: url(../../static/img/pass.png);
      }
    }

    .warning {
      position: absolute;
      color: #E94528;
      font-size: 12px;
      top: 50px;

      &::before {
        content: "";
        display: inline-block;
        position: relative;
        top: 2px;
        margin-right: 3px;
        width: 13px;
        height: 13px;
        background: {
          image: url(../../static/img/warning.png);
          size: contain;
          position: center center;
        }
      }
    }

    .login-tips {
      margin-top: -3px;
      color: #999999;
      font-size: 12px;

      a {
        float: right;
      }
    }
  }
}
</style>
