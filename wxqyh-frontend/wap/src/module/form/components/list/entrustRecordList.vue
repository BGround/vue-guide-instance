<template>
  <div class="qwui-cardList">
    <div
      class="qwui-cardList_item flexbox"
      v-for="(item,index) in list"
      :key="item.id">
      <div class="qwui-cardList_img">
        <img
          :src="item.headPic"
          @error="noFind">
      </div>
      <router-link
        class="flexItem pr20"
        :to="{name: 'detail', query: { id: item.refId}}"
        tag="div">
        <div class="entrust-list-title">
          <h3>{{item.title}}</h3>
          <span
            class="applyStatus"
            :class="statusRecordStatusClass(item.handleStatus)">{{showRecordStatus(item.handleStatus)}}</span>
        </div>
        <div class="entrust-list-time">
          <p>委托生成：{{item.createTime}}</p>
        </div>
        <p class="entrust-user">被委托人：{{item.consigneeUserName}}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
  import { mixinList } from './list'

  export default {
    mixins: [mixinList],
    props: ['list'],
    methods: {
    }
  }
</script>

<style scoped>
  .pr20{
    padding-right: 20px;
  }
  .entrust-list-title{
    display: flex;
  }
  .entrust-list-time{
    margin-top: 2px;
    display: flex;
    align-items: center;
  }
  .entrust-list-time p{
     color: #b2b9c8;
  }
  .entrust-list-title span.applyStatus.red{
    margin-left: 10px;
    margin-top: 1px;
    padding: 2px 8px;
    line-height: 1.3;
    white-space: nowrap;
    background-color: rgba(233, 79, 79, 0.05);;
  }
  .entrust-list-title span.applyStatus.gray{
    margin-left: 10px;
    margin-top: 1px;
    padding: 2px 8px;
    line-height: 1.3;
    white-space: nowrap;
    background-color: rgba(153, 153, 153, 0.05);
  }
  .entrust-list-title span.applyStatus.blue{
    margin-left: 10px;
    margin-top: 1px;
    padding: 2px 8px;
    line-height: 1.3;
    white-space: nowrap;
    background-color: rgba(69, 139, 233, 0.05);;
  }
  .qwui-cardList_item .flexItem .entrust-list-title h3{
    -webkit-line-clamp: 1;
  }
  .flexbox {
    display: flex;
  }
  .qwui-cardList_img {
    margin-right: 10px;
    width: 40px;
    height: 40px;
  }
  .entrust-user{
    margin-top: 4px;
    color: #7A7C80;
  }
</style>
