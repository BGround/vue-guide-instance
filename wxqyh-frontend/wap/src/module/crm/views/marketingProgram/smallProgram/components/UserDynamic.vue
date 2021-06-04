<template>
  <div class="qwui-dynamic_detail">
    <img class="qwui-user_avatar"
         :src="formatImgUrl">
    <div class="qwui-user_dynamic">
      <p class="qwui-user_dynamic_name">{{userName}}</p>
      <p class="qwui-user_dynamic_text">{{userDo}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "QwUserDynamic",
  props: {
    //用户头像
    userAvatar: {
      type: String
    },
    //用户名字
    userName: {
      type: String
    },
    //用户行为
    userDo: {
      type: String
    },
    //访问时间
    visitTime: {
      type: String
    }
  },
  computed: {
    formatImgUrl() {
      return _.filterCompressURL(this.userAvatar);
    }
  }
};
</script>

<style scoped lang="scss">
.qwui-dynamic_detail {
  position: relative;
  width: 100%;
  height: 74px;
  padding: 0 14px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  align-items: center;
  margin-bottom: 1px;
  font-size: 0;
  .qwui-user_avatar {
    min-width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.qwui-user_dynamic {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 40px;
  margin-left: 12px;
}
.qwui-user_dynamic_name {
  line-height: 1.2em;
  font-size: 15px;
  color: #343434;
}
.qwui-user_dynamic_text {
  line-height: 1.3em;
  width: 300px;
  font-size: 12px;
  color: #85868f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
