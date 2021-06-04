<template>
  <div class="qwui-rep_list_box">
    <ul>
      <li class="qwui-rep_list" v-for="(item,index) in pageData" :key="index">
        <router-link :to="{name: 'repDetail', params: { checkworkId: item.id}, query: { checkworkId: item.id}}">
          <span class="qwui-rep_list_time">{{item.createTime | formatDate}}</span>
          <div class="qwui-rep_list_logo">
            <img :src="item.headPic" alt="">
          </div>
          <div class="qwui-rep_list_item">
            <p class="qwui-rep_list_username">{{item.personName}}</p>
            <apply-status :applystatus="statusFormat(item)" v-show="item.status!=3"></apply-status>
            <span class="qwui-rep_list_item1" v-for="(item1,index1) in item.repInfo.split('|')" :key="index1">
              <p class="qwui-rep_info">申诉：{{item1}}</p>
            </span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import applyStatus from '@/components/part/apply_status';
  export default {
    props:['listdata',"loadmore", 'footernav'],
    data(){
      return {

      }
    },
    computed: {
      pageData(){
        if(this.loadmore.padeConfig.pageData){
          return this.loadmore.padeConfig.pageData;
        }
      },
    },
    filters: {
      formatDate(time) {
        return _.getFormatTimeCW(time);
      },
    },
    methods: {
      statusFormat: function (value) {
        if (value.status == '4') {
          return {name: "i18n.passThrough", class: "status_green", active: false};
        } else if (value.status == '2') {
          return {name: "i18n.noPassThrough", class: "status_red", active: false};
        }
      },
    },
    components: {
      applyStatus
    }
  }
</script>

<style scoped>
  .qwui-rep_list_box {
    display: block;
    padding-top: 44px;
    background-color: #fff;
  }
  .qwui-rep_list_box ul li {
    position: relative;
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    *zoom: 1;
  }
  .qwui-rep_list_time{
    position: absolute;
    top:10px;
    right: 15px;
    color: #999;
    font-size: 12px;
  }
  .qwui-rep_list_logo{
    position: absolute;
    top:10px;
    left: 15px;
  }
  .qwui-rep_list_logo img {
    width: 38px;
    height: 38px;
  }
  .qwui-rep_list_item{
    margin-left: 48px;
  }
  .qwui-rep_list_username {
    color: #333;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
    padding-right: 100px;
    line-height: 1.2
  }
  .qwui-rep_info{
    display: inline-block;
    font-size: 13px;
    color: #999;
    vertical-align: middle;
  }
</style>


