<template lang="html">
  <p class="copyright">
    <a href="http://wbg.do1.com.cn/More/About/About_us/" target="_blank">关于我们</a>
    <a href="http://wbg.do1.com.cn/zhdj/?utm_campaign=wbg&utm_medium=qw&utm_source=gw&utm_content=gwym&utm_term=jjfazhdj" target="_blank">典型案例</a>
    <a href="http://wbg.do1.com.cn/xueyuan/" target="_blank">企微学院</a>
    <span>咨询电话：400-111-2626</span>
    <span>Copyright©2004-2018 DO1.com.cn All Rights Reserved 粤B2-20062018号</span>
  </p>
</template>

<script>
export default {
  name: 'QwCopyright'
}
</script>

<style lang="scss" scoped>
.copyright {
  width: 100%;
  text-align: center;

  a, span {
    &::after {
      content: " | ";
    }

    &:last-child::after {
      content: "";
    }
  }
}
</style>
