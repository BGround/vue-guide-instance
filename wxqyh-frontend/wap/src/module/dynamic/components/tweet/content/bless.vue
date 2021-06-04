<template>
    <!--被祝福者头像-->
    <div class="qwui-bless_wrap">
      <div class="qwui-bless_content">
        <!--周年祝福和生日祝福图片样式不一样-->
        <div class="qwui-bless_top" :class="sendType=='1'?'qwui-top_bd':'qwui-top_zn'"></div>
        <div class="qwui-bless_box" :class="userHeadPic.length==2?'qwui-flexbox':'clearfix'">
          <div v-for="(item, index) in userHeadPic" :key="index" class="qwui-bless_item"
              :class="userHeadPic.length==1||userHeadPic.length==2?'qwui-flexItem':'qwui-bless_item_width'">
            <img :src="item.headPic"/>
            <p>{{item.personName}}</p>
          </div>
        </div>
        <div class="qwui-bless_bottom"></div>
      </div>
    </div>
</template>
<script>
export default {
  name: 'QwTweetContentBless',
  props: {
    sendType: {
      type: Number||String,
      required: true
    },
    userList: {
      type: Array,
      required: true
    }
  },
  data(){
    return{
      userHeadPic:[]
    }
  },
  mounted(){
    // 设置被祝福者的头像
    var blessAndEntryPOList = this.userList;
    if(blessAndEntryPOList.length>0){
      this.setHeadPic(blessAndEntryPOList);
    }
  },
  methods:{
    setHeadPic(userList){
      userList.forEach((item)=>{
        if(item.headPic == null || item.headPic == "" || item.headPic == '0'){
          // 无头像设置默认头像
          item.headPic = require('assets/images/icon_person.png');
        } else {
          if(item.headPic.indexOf('http', 0) == -1){
            // 人资头像
            item.headPic = _.compressURL + item.headPic;
          }
        }
      });
      this.userHeadPic = userList;
    }
  }
}
</script>
<style scoped lang="scss">
.qwui-bless_wrap {
  padding: 15px 0 0;
  background-color: #fff;
  .qwui-bless_content {
    padding: 10px;
    border: 1px #eee solid;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
    .qwui-bless_box{
      padding: 30px 0 5px;
      .qwui-bless_item{
        margin-bottom: 15px;
        text-align: center;
        img {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border:2px #f0f0f0 solid;
        }
      }
      .qwui-bless_item_width {
        float: left;
        min-width: 33%;
      }
    }
  }
  .qwui-bless_top{
    margin: 0 auto;
    width: 270px;
    height: 72px;
  }
  .qwui-bless_bottom {
    width: 100%;
    height: 45px;
    background: url(~assets/images/bg_zhufuFt.jpg) repeat;
    background-size: 298px 45px;
  }
  .qwui-top_bd{
    background: url(~assets/images/birthdayzhufu.png);
    background-size: 270px;
  }
  .qwui-top_zn{
    background: url(~assets/images/zhounianzhufu.png);
    background-size: 270px;
  }
}
</style>
