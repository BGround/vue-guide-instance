<template>
  <div class="wrap qwui-tagshow_wrap">
    <div class="qwui-tagshow_title">
      <img class="qwui-good_img"
           src="~assets/images/crm/icon_approval.png"
           :style="isMobile? 'margin-bottom:1px':'margin-bottom:0'">
      <span class="qwui-people">{{approvalNum}}人认可了你的印象标签</span>
    </div>
    <scroll ref="scroll"
            :data="userList"
            :pullUpLoad="pullUpLoad"
            @pullingUp="onPullingUp"
            class="qwui-tagshow_content">
      <ul class="qwui-list">
        <li class="qwui-list_item" v-for="(item,index) in userList" :key="index">
          <img class="qwui-item_avatar"
               :src="item.customerAvatar"
               alt="">
          <div class="qwui-item_desc">
            <span class="qwui-user_name">{{item.customerNickName}}</span>
            <span class="qwui-show_time">{{item.createTime}}</span>
          </div>
        </li>
      </ul>
    </scroll>
    <div class="qwui-tagshow_btn" @click="closeShow">返回</div>
  </div>
</template>

<script>
import Scroll from '../../../../components/Scroll/index';
import { approvalTagList } from '../../../../api/smallProgram/getBata.js';
export default {
  props: {
    isOpen:{
      type:Boolean,
      default: false
    },
    labelId:{
      type:String
    }
  },
  data() {
    return {
      pullUpLoad: true,
      pageCurrent: 1, //当前页码
      pageMax: 0, //最大页码
      pageSize: 20, //一次请求几条数据
      userList:[],
      approvalNum:0,
      isMobile:false,//默认不是手机端
    };
  },
  components: {
    Scroll
  },
  created() {
    if(this.isOpen){
      this.getApprovalTagUsers(this.labelId);
    }
    // 判断是否手机终端
    if(_.isHefeixin()|| _.isWeChatApp()||_.isQiyeweixinApp() || _.isMobileApp()){
      this.isMobile=true;
    }
  },
  methods: {
    //获取标签认同用户列表
    getApprovalTagUsers(id){
      approvalTagList({
        labelId: id,
        page: this.pageCurrent,
        pageSize: this.pageSize,
      },(res) => {
        this.userList = this.userList.concat(res.approvalUsers);
        this.approvalNum = res.totalRows;
        this.pageMax = res.maxPage;
        this.$emit('openShow');
      });
    },
    onPullingUp(){
      if(this.pageCurrent >= this.pageMax){
        this.pullUpLoad = false;
        return;
      }
      this.pageCurrent++;
      this.getApprovalTagUsers(this.labelId);
    },
    closeShow(){
      this.$emit('closeShow');
    }
  }
};
</script>

<style scoped lang="scss">
.qwui-tagshow_wrap {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right:0;
  margin: 0 auto;
  background-color: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  .qwui-tagshow_title {
    display: flex;
    height: 32px;
    align-items: flex-end;
    padding: 0 14px;
    .qwui-good_img {
      width: 16px;
      height: 16px;
      position: relative;
      bottom: 1px;
    }
    .qwui-people {
      margin-left: 4px;
      font-size: 12px;
      line-height: 17px;
      font-weight:400;
      color: #989eaa;
    }
  }
  .qwui-tagshow_content {
    flex-grow: 1;
    .qwui-list {
      .qwui-list_item {
        display: flex;
        border-bottom: 1px solid #f9fafb;
        height: 76px;
        padding-left: 15px;
        align-items: center;
      }
      .qwui-item_avatar {
        width: 40px;
        height: 40px;
        border-radius: 4px;
      }
      .qwui-item_desc {
        margin-left: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .qwui-user_name {
        font-size: 16px;
        line-height: 22px;
        color: #0a1735;
        font-weight:400;
      }
      .qwui-show_time {
        margin-top: 6px;
        font-size: 13px;
        line-height: 18px;
        color: #b2b9c8;
        font-weight:400;
      }
    }
  }
  .qwui-tagshow_btn {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color: #5585f0;
    border-top: 1px solid #f5f5f5;
    font-weight:400;
  }
}
@media screen and (min-width: 1024px){
  .qwui-tagshow_wrap {
      width: 740px;
  }
}
//苹果X样式适配
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .qwui-tagshow_wrap .qwui-tagshow_btn{
    margin-bottom: 34px;
  }
}
</style>
