<template>
  <div class="qwui-list_item">
    <div class="separate" v-if="surveyObj.survey.length"></div>
    <div class="noContent" v-if="surveyObj.noContentTips">
      <img src='~assets/images/img_a-homepage_blank3.png'>
      <div>
        <span>知民情，懂民意，发布问卷了解一下 ？</span>
      </div>
    </div>
    <!-- 问卷列表-->
    <div class="normal" :key="index" v-for="(item,index) in surveyObj.survey" @click="gotoDetail(item,index)">
      <div class="normal_content">
        <div class="survey_header">
          <img :src="item.headPic" alt="">
          <span>{{item.personName}}</span>
            <span class="more" v-if="item.createPerson==userId && item.status !== '2'"  @click.stop="moreOperation(item,index)"><img src="~assets/images/icon_a-common_more.svg" alt=""></span>
        </div>
        <div class="content">
           <span class="normal-title overflowEllipsis2">{{item.title}}</span>
        </div>

        <div class="item_footer">
          <div class="survey-status" :class="statusClass(item)">{{statusText(item)}}</div>
          <div class="thumbs">{{item.lastEditTime}}</div>
          <div class="typeAndMore">
            <span class="survey-number">{{item.joinNum}}</span>
            <span>份答卷</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    surveyObj:{
      type:Object,
    }
  },
  created(){
    this.userId=_.userId;
  },
  data(){
    return{
      userId:'',
      noContentTips:false,
    }
  },
  methods:{
    moreOperation(item,index){
      this.$emit('moreOperation',{item,index});
    },
    statusClass(item){
        if(item.status === '1'&&!item.isEndTimeOut) {
        return 'going'
      } else if(item.status === '1'&&item.isEndTimeOut) {
        return 'ending'
      } else if(item.status === '0'||item.status === '2') {
        return 'close'
      }
    },
    statusText(item){
      if(item.status === '1'&&!item.isEndTimeOut&&item.join === true) {
        return '进行中'
      } else if(item.status === '1'&&!item.isEndTimeOut&&item.join === false) {
        return '待参与'
      } else if(item.status === '1'&&item.isEndTimeOut) {
        return '已结束'
      } else if(item.status === '0') {
        return '草稿'
      } else if(item.status === '2') {
        return '已关闭'
      }
    },
    gotoDetail(item,index){
      let surveyIndex=0;
      surveyIndex=index;
      this.$emit('gotoDetail',{item,surveyIndex});
    },
  },
}
</script>
<style lang="scss" scoped>
  .qwui-list_item{
    background: #fff;
    .noContent{
      margin-top:103px;
      text-align: center;
      background: #F7F8FA;
      span{
        color:#B2B9C8;
        font-size: 14px;
      }
    }
    .normal{
      display: flex;
      background: #fff;
      border-top: solid 1px #F7F8FA;
      padding: 14px;
      margin: 0 14px 12px;
      box-shadow:0px 2px 12px 0px rgba(178,185,200,0.3);
      border-radius: 8px;
      .normal_content{
        flex: 22;
        .content{
          padding-top: 8px;
          .normal-title{
            font-size:16px;
            font-family:PingFangSC-Medium;
            font-weight:600;
            color:#0A1735;
            line-height:22px;
          }
        }
        .survey_header {
          height: 31px;
          img {
              float: left;
              width: 20px;
              height: 20px;
              display: flex;
              border-radius: 50%;
              align-items: center;
              justify-content: center;
              overflow: hidden;
          }
          span {
            padding-left: 8px;
            font-size:15px;
            font-family:PingFangSC-Regular;
            color:#85868F;
          }
          .more{
              float: right;
              cursor: pointer;
              img {
                width: 16px;
                height: 16px;
              }
            }
        }
        .item_footer{
          padding-top:19px;
          position: relative;
          div{
            display: inline-block;
            color: #B3BAC9;
            font-size: 12px;
          }
          .survey-status {
            font-size:13px;
            font-family:PingFangSC-Regular;
            color:#5585F0;
          }
          .going {
            color: #5585F0;
          }
          .ending {
            color: #FF586D;
          }
          .close {
            color: #B2B9C8;
          }
          .thumbs{
            padding-left: 12px;
            font-size:13px;
          }
          .typeAndMore{
            position: absolute;
            right: 1px;
            bottom: -3px;
            font-size:13px;
            .survey-number{
              font-size:20px;
              color:#5585F0;
            }
          }
        }
      }
    }
  }
  .overflowEllipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
    word-break: break-all;
  }
  .overflowEllipsis2{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
    word-break: break-all;
  }
  .separate{
    height: 96px;
  }
</style>


