<template>
  <div class="wrap">
    <div class="qwui-position-no-permission">
      <i class="qwui-warp-no-permission"></i>
      <p class="qwui-no-data-title">没有权限</p>
      <p class="qwui-no-data-sm_text">没有该页面的权限<br>可联系管理员进行添加</p>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.qwui-warp-no-permission {
    display: block;
    width: 160px;
    height: 160px;
    background: url(~assets/images/checkwork/no_permission_icon.png) no-repeat center;
    background-size: 160px 160px;
}
.qwui-position-no-permission {
    margin: 136px auto;
    width: 160px;
    text-align: center;
}
.qwui-no-data-text,.qwui-no-data-sm_text{
    margin-top: 10px;
    line-height: 1;
    font-size: 16px;
    color: #bbb;
}
.qwui-no-data-sm_text {font-size: 14px;}
.qwui-no-data-title {font-size: 20px;color: #666}

</style>

