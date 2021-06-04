<template>
  <div class="crm-page-loading">
    <spinner type="ios"></spinner>
  </div>
</template>

<script>
import { Spinner } from "vux";
export default {
  name: "CrmPageLoading",
  components: {
    Spinner
  }
};
</script>

<style lang="scss" scoped>
.crm-page-loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}
</style>

