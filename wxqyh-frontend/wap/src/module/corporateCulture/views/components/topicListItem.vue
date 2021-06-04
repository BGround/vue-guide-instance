<template>
  <div class="qwui-list_item">
    <div class="noContent" v-if="topicObj.noContentTips">
      <img src='~assets/images/img_a-homepage_blank1.png'>
      <div>
        <span>{{topicObj.noContentText}}</span>
      </div>
    </div>
    <div class="top_topic" :key="item.topicId"  v-for="(item,index) in topicObj.topTopic" @click="gotoDetail(item,index,'top')">
      <div class="top_topic_item">
        <div class="setTop">置顶</div>
        <span class="overflowEllipsis">{{item.title}}</span>
      </div>
    </div>
    <div class="separate" v-if="topicObj.topTopic.length"></div>
    <div class="normal" :key="index" v-for="(item,index) in topicObj.normalTopic" @click="gotoDetail(item,index,'normal')">
      <div class="checkbox" v-if="ableSelect">
         <!-- 多选框 -->
        <input type="checkbox"
                 :key="item.topicId"
                 :value="item.topicId"
                 :id="item.topicId"
                 class="icon_check"
                 @click.stop="checkboxClick(item.topicId)">
      </div>
      <!-- 普通话题 -->
      <div class="normal-content">
        <div class="content clearfix">
          <span class="normal_title overflowEllipsis2">{{item.title}}</span>
          <img :src="item.coverImage" alt="">
        </div>
        <div class="item_fotter">
          <div>{{item.personName}}</div>
          <div class="thumbs" v-if="item.praise">{{item.praise}}赞</div>
          <div class="typeAndMore">
            <span v-if="item.publisher!=userId&&!isDraft">{{item.typeName}}</span>
            <span class="more" v-if="item.publisher==userId||isDraft&&!ableSelect" @click.stop="moreOperation(item,index)"><img src="~assets/images/icon_a-common_more.png" alt=""></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    topicObj:{
      type:Object,
    },
    isDraft:{
      type:Boolean,
      default:false,
    },
    ableSelect:{
      type:Boolean,
      default:false
    },
  },
  created(){
    this.userId=_.userId;
    this.baseURL=_.baseURL;
  },
  data(){
    return{
      userId:'',
      baseURL:'',
      noContentTips:false,
      selectList:[],//选中的项
    }
  },
  methods:{
    moreOperation(item,index){
      this.$emit('moreOperation',{item,index});
    },
    gotoDetail(item,index,type){
      let topicIndex=0;
      topicIndex=type=='top'?index:index+this.topicObj.topTopic.length;
      this.$emit('gotoDetail',{item,topicIndex,type});
    },
    checkboxClick(id){
      let hasSelect=-1;
      this.$nextTick(function(){
        for(let i=0;i<this.selectList.length;i++){
          if(this.selectList[i]==id){
            hasSelect=i;
            break;
          }
        }
      hasSelect!=-1?this.selectList.splice(hasSelect,1):this.selectList.push(id);
      this.$emit('checkboxClick',this.selectList)
      });

    }
  },
}
</script>
<style lang="scss" scoped>
  .qwui-list_item{
    .noContent{
      margin-top:41px;
      text-align: center;
      span{
        cloor:#B2B9C8;
        font-size: 14px;
      }
    }
    .top_topic{
      .top_topic_item{
        position: relative;
        height: 48px;
        line-height: 48px;
        background:#fff;
        border-top: solid 1px #F7F8FA ;
        padding:0 14px;
        cursor: pointer;
        img{
          position: absolute;
          top:14px;
          left:14px;
        }
        .setTop{
          float: left;
          height: 17px;
          color: #FF586D;
          line-height: 17px;
          font-size: 12px;
          margin-top: 14px;
          padding: 2px 4px;
          border-radius: 3px;
          background: #FFF1F3;
        }
        span{
          color:#0A1735;
          font-size: 15px;
          font-weight: 600;
          padding-left: 8px;
        }
      }
    }
    .normal{
      display: flex;
      height :92px;
      background: #fff;
      border-top: solid 1px #F7F8FA;
      padding: 14px;
      cursor: pointer;
      .checkbox{
        flex: 1;
        margin-top: 1px;
      }
      .normal-content{
        flex: 22;
        .content{
          height: 66px;
          display: flex;
          .normal_title{
            flex: 1;
            height:44px;
            color:#0A1735;
            font-size: 16px;
            font-weight: 600;
          }
          img{
            float:right;
            width: 117px;
            height: 66px;
            border-radius: 4px;
            margin-left: 16px;
            object-fit: cover;
          }
        }
        .item_fotter{
          padding-top:8px;
          position: relative;
          div{
            display: inline-block;
            color: #B3BAC9;
            font-size: 12px;
          }
          .thumbs{
            padding-left: 12px;
          }
          .typeAndMore{
            position: absolute;
            right: 1px;
            .more{
              cursor: pointer;
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
    height: 8px;
  }
</style>


