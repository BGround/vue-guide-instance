<template>
  <div>
    <div class="qwui-party_cons_list" v-for="(item,index) in list" @click="toDetail(item,index)" :key="index">
      <div class="qwui-party_cons_top">
        <div class="content">
          <h3 class="title">
            <span class="topic_top" v-if="item.isTop != '0'">顶</span>
            {{item.title}}
          </h3>
          <div class="time">{{ showCreateTime ? item.createTime:item.publishTime}}</div>
        </div>
        <div class="img_right" v-if="item.coverImage">
          <img :src="dealImg(item.coverImage,item.isSecret)"/>
        </div>
      </div>
      <div class="qwui-party_cons_bottom">
        <span class="name">{{item.personName}}</span>
        <span class="delete" v-if="useDelete" @click.prevent.stop="clickDelete(item.dynamicInfoId, index)">删除</span>
        <div class="msg_icon">
          <span><i class="read"></i>{{item.viewCount}}</span>
          <span><i class="comment"></i>{{item.commentCount}}</span>
          <span><i class="like"></i>{{item.praise}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      list:{
        type:Array,
      },
      useDelete:{ //是否可以删除
        type:Boolean,
        default:false
      },
      isDraft:{ //是否是草稿
        type:String|Number,
        default:1
      },
      listParam:{
        type:Object,
        default() {
          return {
            dynamicType:'',
            schType:'',
            keyWord:'',
            isPassReview:false
          }
        }
      },
      showCreateTime: {
        type:Boolean,
        default: false
      }
    },
    data(){
      return{
        defaultSecretImg:require('assets/images/ic_secret.png'),
      }
    },
    methods:{
      dealImg:function(path,isSecret){
        if ( (/^http:\/\/.*$/.test(path)) || (/^https:\/\/.*$/.test(path)) ) {
        } else {
          path = isSecret=='1'?this.defaultSecretImg:(this.getImgURLHead(path) + path)
        }
        return path;
      },
      clickDelete:function (id, index) {
        this.$emit('delete', id, index)
      },
      //微信端后台页面获取地址头:后台用，非外部
      getImgURLHead(URL){
        if(URL.indexOf("manager/images/")>=0 || URL.indexOf("themes/default/images/")>=0 || URL.indexOf("/upload/img/birthday/")>=0 || URL.indexOf("/upload/img/zhounian/")>=0){
          return _.baseURL;
        }else{
          return _.compressURL;
        }
      },
      //跳到详情
      toDetail:function (item,index) {
        if(this.isDraft == '4'){
          // 草稿跳到该编辑
          this.$router.push({
            path: '/publish',
            query: {
              id: item.dynamicInfoId
            }
          })
        }else {
          this.$router.push({
            path: '/partyDetail',
            query: {
              id: item.dynamicInfoId,
              typeId: this.listParam.dynamicType,
              schType: this.listParam.schType,
              title: this.listParam.keyWord,
              page: index + 1,
              isPassReview: this.listParam.isPassReview ? item.isPassReview : ''
            }
          })
        }
      }
    }
  }
</script>
<style src="../../scss/indexList.scss" lang="scss">
</style>
