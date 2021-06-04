<template>
  <div class="qwui-checkwork_list_box">
    <ul>
      <li class="qwui-checkwork_list" v-for="(item,index) in pageData" :key="index" @click="opentdetail(item.id)">
        <div class="qwui-checkwork_list_item">
            <div class="qwui-checkwork_list_date">
              <span class="qwui-checkwork_list_time">{{item.createTime | signDatefilter}}</span>
              <span class="qwui-checkwork_list_week">{{item.createTime | signDatefilter2}}</span>
            </div>
            <div class="qwui-checkwork_list_rule">
              考勤规则:
              <span>{{item.checkWorkName}}</span>
            </div>
            <div class="qwui-checkwork_list_status">
              考勤状态:
              <span
                :class="{'qwui-checkwork_status_color':item.signStatus==2}"
              >
                {{item.allSignStatusDesc}}
              </span>
            </div>
            <div class="qwui-checkwork_list_username">
              <img :src="item.headPic" alt="">
              <span>{{item.personName}}</span>
            </div>
          </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props:["loadmore"],
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
      signDatefilter: function (val) {
        if (!val) return '';
        return val.replace(/(\d{2})\:(\d{2})\:(\d{2})/,"");
      },
      signDatefilter2:function(val){
        if (!val) return '';
        return ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][new Date(val).getDay()];
      }
    },
    methods:{
      //进入考勤详情
      opentdetail(id){
        this.$router.push({
          path:"/checkDetail",
          query:{
            id:id
          }
        });
      }
    }
  }

</script>

<style scoped>
  .qwui-checkwork_list_item{
    position: relative;
    margin: 8px 5px 0 5px;
    border-radius: 3px;
    border: 1px solid #e4e4e4;
    background-color: #fff;
    padding: 15px;
  }
  .qwui-checkwork_list_date{
    padding: 0px 10px;
    margin-top: 10px;
    line-height: 18px;
    overflow: hidden;
    position: relative;
    max-height: 37px;
    font-size: 15px;
    color:#333
  }
  .qwui-checkwork_list_time{
    margin-right: 10px;
  }
  .qwui-checkwork_list_rule{
    display: flex;
    font-size: 12px;
    color: #666;
    padding: 5px 10px 0;
  }
  .qwui-checkwork_list_rule span{
    flex:1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
  .qwui-checkwork_list_status{
    font-size: 12px;
    color: #666;
    padding: 4px 10px 0;
    margin-bottom: 10px;
  }
  .qwui-checkwork_status_color{
    color:#ff3366
  }
  .qwui-checkwork_list_username{
    height: 20px;
    line-height: 2;
    margin-bottom: 5px;
    padding: 0 10px 0;
    font-size: 11px;
    color: #999;
  }
  .qwui-checkwork_list_username img{
    width: 15px;
    height: 15px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .qwui-checkwork_list_username span{
    margin-left: 5px;
    margin-right: 10px;
  }
</style>
