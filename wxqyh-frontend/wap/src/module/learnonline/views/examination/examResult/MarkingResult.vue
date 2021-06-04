<template>
  <div class="wrap qwui-lean_marking_result">
    <div class="marking_result">
      <i class="icon"></i>
      <div class="title">已完成考试，阅卷中...</div>
      <p class="lable">阅卷后将以消息通知的方式告知得分</p>
      <p class="lable">也可进入"考试记录" 考试下查看阅卷动态</p>
      <div class="button" @click="enterIndex">返回首页</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QwMarkingResult',
  data() {
    return {
    };
  },
  methods:{
    // 返回主页
    enterIndex() {
       this.$router.push({name: 'examination', params: {index: -1}});
    },

  },
};

</script>

<style lang="scss" scoped>

.qwui-lean_marking_result {
  min-height: 100vh;
  background: #fff;
  
  .marking_result {
    margin: 145px 25px 0 25px;
    text-align: center;

    .icon {
      display: inline-block;
      width: 80px;
      height: 80px;
      background: url(~assets/images/icon_scoring.png) no-repeat center;
      background-size: 80px 68px;
    }
    .title {
      margin-top: 18px;
      font-size: 20px;
      line-height: 20px;
      color: #666;
    }
    .lable {
      font-size: 14px;
      line-height: 20px;
      color: #AAA;

      &:first-of-type {
        margin-top: 18px;
      }
    }
    .button {
      display: inline-block;
      margin-top: 30px;
      padding: 0 96px;
      height: 42px;
      line-height: 44px;
      font-size: 16px;
      color: #666;
      border: 1px solid #ddd;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}

</style>
