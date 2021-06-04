<template lang="html">
  <div class="qwui-tweet_content_box">
    <!-- 音乐播放器 -->
    <qw-tweet-content-music
      class="qwui-tweet_music"
      :src="music.src"
      :filename="music.filename"
      v-if="music"
    ></qw-tweet-content-music>

    <!--其他红包-->
    <qw-tweet-content-redpack v-if="detail.sendType!='1'&& detail.sendType!='2'&&detail.RedpackParamsVO&&detail.RedpackParamsVO.openRedpackPermission!=''"
      :redpackParamsVO="detail.RedpackParamsVO"
      :sendType="detail.sendType">
    </qw-tweet-content-redpack>

    <!-- 封面 -->
    <qw-tweet-content-picture
      class="qwui-tweet_cover"
      :cover="cover"
      :isSecret="detail.isSecret"
      v-if="cover"
    ></qw-tweet-content-picture>

    <!-- 主体内容 -->
    <qw-tweet-content-html
      class="qwui-tweet_content"
      :html="content.content"
      :detail="detail"
      ref="contentWrap"
    ></qw-tweet-content-html>
    
    <!--图片列表-->
    <qw-tweet-content-picture
      :images="images"
      :isSecret="detail.isSecret"
      v-if="images"
    ></qw-tweet-content-picture>
   
    <!--被祝福者内容-->
    <qw-tweet-content-bless
      :userList="blessInfoPO.blessAndEntryUserInfoPOList"
      :sendType="blessInfoPO.sendType"
      v-if="blessInfoPO"
    ></qw-tweet-content-bless>

    <!--新闻公告和周年祝福红包-->
    <qw-tweet-content-redpack v-if="(detail.sendType=='1'|| detail.sendType=='2')&&detail.RedpackParamsVO&&detail.RedpackParamsVO.openRedpackPermission!=''"
      :redpackParamsVO="detail.RedpackParamsVO"
      :sendType="detail.sendType">
    </qw-tweet-content-redpack>
  </div>
</template>

<script>
import QwTweetContentPicture from './picture';
import QwTweetContentMusic from './music';
import QwTweetContentHtml from './html';
import QwTweetContentBless from './bless';
import QwTweetContentRedpack from './redpackbox';
import EventBus from '@/utils/eventBus';

export default {
  name: 'QwTweetContent',
  components: {
    QwTweetContentPicture,
    QwTweetContentMusic,
    QwTweetContentHtml,
    QwTweetContentBless,
    QwTweetContentRedpack
  },
  props: {
    content: {
      type: Object,
      required: true,
      validator (content) {
        return typeof content.content === 'string' &&
          (content.cover === undefined || typeof content.cover === 'object') &&
          (content.music === undefined || typeof content.music === 'object') &&
          (content.images === undefined || typeof content.images == 'object') &&
          (content.blessInfoPO === undefined || typeof content.blessInfoPO == 'object');
      }
    },
    detail: {
      type: Object,
      required: true
    },
  },
  data(){
    return{
      previewImageUrl: [],
    }
  },
  mounted(){
      let list = [];
      // 手机上传的图片
      if(this.images){
        list = [...this.images];
        list.forEach((item)=>{
          item.picPath = item.path;
        })
      }
      // 封面图片
      if(this.cover&&this.cover.src!=''){
        list.unshift(this.cover);
      }
      // 富文本图片
      if(this.contentImgs){
        list = list.concat(this.contentImgs);
      }
      this.previewImageUrl= list;
      // 封面图片和手机上传的图片预览
      EventBus.$on('tweet-preview', (src) => {
        EventBus.$emit("previewImages",src,this.previewImageUrl);
      });
  },
  computed: {
    cover () {
      return this.content.cover;
    },
    images () {
      return this.content.images;
    },
    music () {
      return this.content.music;
    },
    blessInfoPO () {
      return this.content.blessInfoPO;
    },
    contentImgs () {
      var imgs = this.$refs.contentWrap.$refs.contentText.getElementsByTagName('img');
      var contentImg = [];
      for(let i=0;i<imgs.length; i++){
        // 父节点为a标签不做任何处理
        let nodeName = imgs[i].parentNode.nodeName.toLowerCase();
        if(nodeName != 'a') {
          // 消息为保密时不许添加点击事件并不许长按保存
          if(this.detail.isSecret == '1'){
            imgs[i].style.pointerEvents = 'none';
          } else {
            imgs[i].classList.add("previewImages");
            var cureentpath = imgs[i].src;
            var imgsrc = imgs[i].src.toLowerCase();
            if(imgsrc.includes(".jpg")||imgsrc.includes(".png")||imgsrc.includes(".jpeg")){
                contentImg.push({picPath:cureentpath.replace(/compress\//,'')});
                imgs[i].addEventListener('click',(event)=>{
                  EventBus.$emit("previewImages",event.target.currentSrc.replace(/compress\//,''), this.previewImageUrl);
                })
            }
          }
        }
      }
      return contentImg;
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_content_box {
  font-size: 16px;
  .qwui-tweet_content{
    /deep/ .qwui-tweet_content_html{
      img {
        margin: 5px 0;
        max-width: 100%;
        vertical-align: middle;
      }
      section{
        max-width: 100%;
      }
      /*表格样式*/
      table{
        max-width:100%!important;
        width: 100%!important;
        border-collapse: collapse;
      }
      /*表格边宽*/
      td{
        border:1px solid #ddd;
      }
      ul, ol {
        margin-top: 16px;
        margin-bottom: 16px;
        padding-left: 40px;
      }
      ul li {
        list-style-type: disc;
      }
    }
  }
}
</style>
