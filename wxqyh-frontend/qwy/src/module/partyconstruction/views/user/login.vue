<template lang="html">
  <div class="login">
    <qw-header class="qwui-header"></qw-header>
    <qw-login class="qwui-login-box"></qw-login>
    <qw-copyright class="qwui-copyright"></qw-copyright>
  </div>
</template>

<script>
import QwHeader from '../../components/common/header';
import QwLogin from '../../components/user/login';
import QwCopyright from '../../components/common/copyright';

export default {
  name: 'login',
  components: {
    QwHeader,
    QwLogin,
    QwCopyright
  }
}
</script>

<style lang="scss">
body {
  background: {
    image: url(../../static/img/bg.png);
    size: cover;
    position: center center;
  }
}

.qwui-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
}

.qwui-login-box {
  position: absolute;
  top: 50%;
  margin-top: -194px;
  width: 100%;
  min-width: 980px;
}

.qwui-copyright {
  position: absolute;
  bottom: 20px;
  color: white;
  font-size: 14px;
}
</style>
