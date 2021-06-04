<template>
  <div class="learn_onlineEditingQuestion">

    <!--头部返回按钮-->
    <wrap-head></wrap-head>
    
    <!-- 互动按钮/lable -->
    <wrap-interaction></wrap-interaction>
    
    <!-- 主功能/编辑和预览 -->
    <wrap-content :poolId="poolId"></wrap-content>
    
    <!-- 导入按钮 -->
    <wrap-lead-into></wrap-lead-into>

    <!-- 示例 -->
    <wrap-example></wrap-example>
  </div>
</template>

<script>
import WrapHead from './components/WrapHead'; // 头部组件
import WrapInteraction from './components/WrapInteraction'; // 互动按钮/lable组件
import WrapContent from './components/WrapContent'; // 主功能/编辑和预览组件
import WrapLeadInto from './components/WrapLeadInto'; // 导入按钮组件
import WrapExample from './components/WrapExample'; // 示例组件
export default {
  name: 'QwOnlineEditingQuestions',
  components: {
    WrapHead,
    WrapInteraction,
    WrapContent,
    WrapLeadInto,
    WrapExample
  },

  data() {
    return {
      poolId: '', // 题库id 
    };
  },

  computed: {
  },

  watch: {},

  created() {
    this.poolId = this.$route.params.id;
  },
  mounted() {
  },

  methods: {
  },
}
</script>

<style lang="scss" scoped>
@import "../../../../style/config.scss";

.learn_onlineEditingQuestion {
  width: 1200px;
  margin: 25px auto 0;
  padding: 0 32px;
  background-color: $whiteBackground;
  
}
</style>
