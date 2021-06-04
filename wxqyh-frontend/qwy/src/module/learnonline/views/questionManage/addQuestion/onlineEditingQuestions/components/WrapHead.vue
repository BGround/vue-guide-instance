<template>
  <div class="onlineEditing_header">
    <div class="backBar_icon" @click="goBack"></div>
    文本批量导入
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'WrapHead',
  data() {
    return {
    };
  },
  computed: {
     ...mapGetters ('questionManageOnlineEditing', [
      'Bus'
    ]),
  },

  methods: {
    goBack() {
      this.Bus.$emit('goBack');
    }
  },
}
</script>
<style lang="scss" scoped>
.onlineEditing_header {
  position: relative;
  height: 60px;
  font-size: 20px;
  line-height: 60px;
  text-align: center;
  color: #383838;
  border-bottom: 1px solid #E5E5E5;

  .backBar_icon {
    position: absolute;
    width: 28px;
    height: 28px;
    top: 16px;
    background: url(~assets/images/ic_back.png) no-repeat center/28px 28px;
    cursor: pointer;
  }
}
</style>
