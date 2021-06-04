<template lang="html">
  <header>
    <div class="header-content">
      <qw-logo></qw-logo>
      <qw-doc-link class="doc-link"></qw-doc-link>
    </div>
  </header>
</template>

<script>
import QwLogo from './logo';
import QwDocLink from './docLink';

export default {
  name: 'QwHeader',
  components: {
    QwLogo,
    QwDocLink
  }
}
</script>

<style lang="scss" scoped>
header {
  background-color: white;

  .header-content {
    position: relative;
    height: 50px;
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 100px;
    line-height: 50px;
  }

  .doc-link {
    position: absolute;
    top: 0;
    right: 100px;
    color: #666666;
    font-size: 14px;
  }
}
</style>
