<template>
  <div>
    <div class="qwui-culture_list" v-for="(item,index) in waitListNew" :key="index">
      <div class="qwui-cover_wrap" v-if="index==0&&!item.notShowImage" @click="gotoCultureDetail(item.agentCode,item,(index+1))">
        <img :src="item.coverImage" :style="imageHeight" alt="" class="qwui-cover_img">
        <div v-if="item.agentCode == 'topic'" class="qwui-culture_thumbs">
          {{item.praise}}<img src="../../../../assets/images/icon_a-list_like.png" alt="">
        </div>
        <div v-else-if="item.agentCode == 'activity'" class="qwui-culture_registry_count">
          {{item.registryCount}}/{{item.regis_sum}}<img src="../../../../assets/images/icon_a-list_eople.png" alt="">
        </div>
        <div class="qwui-culture_name overflowEllipsis">{{item.title}}</div>
      </div>
      <div class="qwui-culture_item" @click="gotoCultureDetail(item.agentCode,item,(index+1))" v-else>
        <div class="qwui-culture_left" :style="item.agentCode=='survey'?{'justify-content': 'space-around'}:''">
          <div class="qwui-culture_left_name overflowEllipsis">{{item.title}}</div>
          <div class="qwui-culture_info">
            <div v-if="item.agentCode == 'topic'" class="qwui-culture_info_name">{{item.personName}}</div>
            <div v-else-if="item.agentCode == 'activity'" class="qwui-culture_info_name">{{item.registryStop}}</div>
            <div v-else="item.agentCode == 'survey'" class="qwui-culture_info_name"><span class="qwui-culture_info_state">进行中</span> {{item.endTime.substr(5)}}</div>
            <div v-if="item.agentCode == 'topic'" class="qwui-culture_info_thumbs">{{item.praise}} 赞</div>
            <div v-else-if="item.agentCode == 'activity'" class="qwui-culture_info_thumbs">{{item.registryCount}}/{{item.regis_sum}}</div>
            <div v-else="item.agentCode == 'survey'">{{item.personName}}</div>
          </div>
        </div>
        <div class="qwui-culture_right" v-if="!(item.agentCode=='survey')">
          <img :src="item.coverImage" alt="">
        </div>
      </div>
      <div v-show="index!=(waitListNew.length-1)" class="qwui-culture_item_line relative"></div>
    </div>
  </div>
</template>

<script>
  import * as timeUtil from '@/assets/js/time-util';

  export default {
    props:{
      cultureContentObj:{
        type:Object,
      }
    },
    data(){
      return{
        imageHeight:{
          height:0
        },
      }
    },
    computed:{
      waitListNew(){
        var self = this;
        if(this.cultureContentObj.waitList){
          this.cultureContentObj.waitList.forEach(function(item,index){
            item.agentCode = self.cultureContentObj.agentCode;
            if(item.agentCode=='activity'&&item.regis_sum==0){
              item.regis_sum = '不限';
            }
            if(index==0&&item.coverImage==''){
              item.coverImage = require('../../../../assets/svg/img_a-list_default.svg');
              item.notShowImage = true;
            }else{
              item.coverImage = item.coverImage ? _.compressURL + item.coverImage : require('../../../../assets/svg/img_a-list_default.svg');
            }
            if(item.agentCode=='activity'){
              item.registryStop = '截止时间 '+timeUtil.changeFormat(new Date(item.registryStop.time),'MM-dd hh:mm');
            }else if(item.agentCode=='survey'){
              item.notShowImage = true;
            }
          });
          return this.cultureContentObj.waitList;
        }
      },
    },
    created(){
      let imageWidth = document.documentElement.clientWidth - 28;
      this.imageHeight = {
        height:(imageWidth * 9/16)+"px"
      };
      if(imageWidth > 1024){
        this.imageHeight = {
          height:"416.25px"
        };
      }
    },
    methods:{
      gotoCultureDetail(agentCode,item,page){
        if(agentCode == 'topic'){
          this.$router.push({
            path:'/topicDetail',
            query:{
              id:item.topicId,
              typeId:'',
              status:'7',
              page:page,
              keyword:''
            }
          })
        }else if(agentCode == 'activity'){
          document.location.href = _.baseURL+'/jsp/wap/activity/activity_detail.jsp?id='+item.activityId+'&agentCode='+agentCode;
        }else{
          document.location.href = _.baseURL+'/jsp/wap/question/detail.jsp?id='+item.id+'&agentCode='+agentCode;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @mixin upperRightCommon{
    position:absolute;
    top: 0;
    right: 0;
    height: 21px;
    line-height: 21px;
    font-size: 12px;
    border-radius:0px 4px 0px 12px;
    color:#fff;
    text-align: right;
    background-color: rgba(0,0,0,.4);
    padding-right: 6px;
    padding-left: 8px;
    box-sizing: border-box;
    img{
      width: 10px;
      height: 10px;
      margin-left: 4px;
    }
  }

  .overflowEllipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
   -webkit-box-orient: vertical;
    word-break: break-all;
  }
  .qwui-culture_list{
    .qwui-cover_wrap{
      position: relative;
      margin: 16px 0 12px;
      .qwui-cover_img{
        width: 100%;
        border-radius:4px;
        object-fit: cover;
      }
      .qwui-culture_thumbs{
        @include upperRightCommon;
      }
      .qwui-culture_registry_count{
        @include upperRightCommon;
      }
      .qwui-culture_name{
        position:absolute;
        bottom: 5px;
        left: 0;
        width: 100%;
        font-size: 16px;
        padding: 18px 8px 6px 8px ;
        background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.6));
        box-sizing: border-box;
        color:#fff;
        border-radius:0px 0px 4px 4px;
      }
    }
    .qwui-culture_item{
      display: flex;
      padding: 14px 0;
      .qwui-culture_left{
        display: flex;
        flex:1;
        height: 67px;
        flex-direction:column;
        justify-content: space-between;
        .qwui-culture_left_name{
          font-size: 16px;
        }
        .qwui-culture_info{
          display: flex;
          justify-content: space-between;
          color:#B2B9C8;
          .qwui-culture_info_state{
            color:#5585F0;
          }
        }
      }
      .qwui-culture_right{
        flex:0 1 117px;
        margin-left: 16px;
        img{
          width: 117px;
          height: 65px;
          border-radius: 4px;
          object-fit: cover;
        }
      }
    }
    .qwui-culture_item_line{
      &::before{
        content: " ";
        position: absolute;
        left: 0;
        right: 0;
        border-bottom: 1px solid #F7F8FA;
        transform: scaleY(.5);
      }
    }
  }
</style>
