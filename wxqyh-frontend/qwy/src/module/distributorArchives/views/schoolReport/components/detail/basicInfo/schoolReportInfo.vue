<template>
  <div class="sInfo">
    <ul>
      <li class="firstItem">
        <div class="aItem">
          <span class="aLabel">经销商：</span>
          <span class="aValue">{{columns.dealerShortName || '-'}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">所在省份：</span>
          <span class="aValue">{{columns.province || '-'}}</span>
        </div>
      </li>
      <li class="secondItem">
        <div class="aItem">
          <span class="aLabel">成绩单日期：</span>
          <span class="aValue">{{columns.year || '-'}}年{{columns.month || '-'}}月</span>
        </div>
        <div class="aItem">
          <span class="aLabel">所在城市：</span>
          <span class="aValue">{{columns.city || '-'}}</span>
        </div>
      </li>
      <li class="firstItem">
        <div class="aItem">
          <span class="aLabel">ERP号：</span>
          <span class="aValue">{{columns.erp || '-'}}</span>
        </div>
        <div class="aItem">
          <span class="aLabel">所属集团：</span>
          <span class="aValue">{{columns.dealerGroup || '-'}}</span>
        </div>
      </li>
      <li class="firstItem">
        <div class="aItem">
          <span class="aLabel">开通时间：</span>
          <span class="aValue">{{columns.dealerTime || '-'}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
      props:{
          columns:{
              type: Object,
              default: {}
          }
      }
  }
</script>
<style lang="less" scoped>
  .sInfo{
    margin: 10px 0;
  }
</style>
