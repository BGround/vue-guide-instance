<template>
  <div class="crm-competitor-detail-log">
    <div class="log-item"
         v-for="(item,index) in modifyLog"
         :key="index">
      <div class="log-item-left">
        <CrmAvator :avator-src="item.headPic"></CrmAvator>
      </div>
      <div class="log-item-right">
        <div class="log-item-right-header">
          <span>{{item.personName}}</span>
          <span>{{item.logTime | dateFormat("YYYY-MM-DD HH:mm")}}</span>
        </div>
        <div class="log-item-right-body">{{item.logContent}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import CrmAvator from "crm/components/CrmAvator";
import { dateFormat } from "vux";

export default {
  name: "crmCompetitorDetailLog",
  components: {
    CrmAvator
  },
  filters: { dateFormat },
  props: ["modifyLog"],
  created() {}
};
</script>

<style lang="scss" scoped>
.crm-competitor-detail-log {
  height: 100%;
  overflow-y: auto;
  padding-top: 12px;
  .log-item {
    display: flex;
    margin: 16px 15px 0 13px;
    padding-bottom: 16px;
    // padding: 13px 15px 19px;
    border-bottom: 1px solid #f7f7f7;
    // align-items: center;
    // &:first-child {
    //   margin-top: 12px;
    // }
    &-left {
      margin-right: 12px;
      margin-top: 2px;
    }
    &-right {
      flex: 1;
      &-header {
        display: flex;
        justify-content: space-between;
        span {
          font-size: 14px;
          color: #7a7c80;
          &:last-child {
            font-size: 12px;
            color: #b2b9c8;
          }
        }
      }
      &-body {
        color: #0a1735;
        font-size: 15px;
        margin-top: 4px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 1;
        word-break: break-all;
      }
    }
  }
}
</style>


