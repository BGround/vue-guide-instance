<template lang="html">
  <!--sendType==2为周年祝福，需要背景图片-->
  <div ref="contentHtml"
      :class="detail.sendType=='2'&&detail.mergePeopleCount=='1'?'qwui-tweet_content_templets':''">
    <div class="qwui-tweet_content_html" v-html="html" ref="contentText"></div>
  </div>
</template>

<script>
import {
  notNullStringValidator
} from '@/utils/validator';

export default {
  name: 'QwTweetContentHtml',
  props: {
    html: {
      type: String,
      required: true,
      validator: notNullStringValidator
    },
    detail: {
      type: Object,
      required: true
    },
  },
  mounted(){
    // 处理背景图片和文字样式
    if(this.detail.sendType=='2'&&this.detail.mergePeopleCount=='1'){
      this.setBgAndText(this.detail.contentImage);
    }
    // 视频播放兼容http
    this.videoPlayback();
  },
  methods:{
    videoPlayback(){
      var self = this;
      var video_obj = self.$refs.contentText.querySelectorAll("iframe,embed");
      if(video_obj!=0){
        [].forEach.call(video_obj,(item,index) => {
          var video_src = item.src;
          var video_width = item.width;
          if(video_src!=""&&video_src!=null&&video_src!=undefined){
            if(video_src.indexOf(_.wxqyh_scheme)==-1){ // 视频地址为http格式
              item.src = '';
              var div = document.createElement('div');
              var attr = document.createAttribute('class');
              attr.value = 'video_div';
              div.setAttributeNode(attr);
              self.insertAfter(div,item);
              div.appendChild(item);
              var divPlay = document.createElement('div');
              var attrPlay = document.createAttribute('class');
              attrPlay.value = 'video_div_c';
              divPlay.setAttributeNode(attrPlay);
              div.appendChild(divPlay);
              item.width = '100%';
              if(self.$refs.contentText.clientWidth > 608){
                item.width = divPlay.style.width = '608px';
                item.height = divPlay.style.height = '88px';
              }else {
                item.height = divPlay.style.height = ((window.innerWidth-20)*88/608) + 'px';
              }
              divPlay.onclick = function(){
                window.top.location.href = _.baseHttpURL + '/open/ueditor/play.jsp?link=' + video_src;
              }
            }
          }
        });
      }
    },
    insertAfter( newElement, targetElement ){ // newElement是要追加的元素 targetElement 是指定元素的位置
      var parent = targetElement.parentNode; // 找到指定元素的父节点
      if( parent.lastChild == targetElement ){ // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
        parent.appendChild( newElement, targetElement );
      }else{
        parent.insertBefore( newElement, targetElement.nextSibling );
      };
    },
    setBgAndText(img){
      var self = this;
      var contentImage = this.getImgURLHead(img) + img;
      var imgBg = new Image();
      imgBg.src = contentImage;
      imgBg.onload = () =>{
        this.$refs.contentHtml.style.backgroundImage = `url(${imgBg.src})`;
        this.$refs.contentHtml.style.height = (document.querySelector('.qwjs-detail').offsetWidth - 20)*imgBg.height/imgBg.width + 'px';
      }
    },
    //微信端后台页面获取地址头:后台用，非外部
     getImgURLHead(URL){
      if(URL.indexOf("manager/images/")>=0 || URL.indexOf("themes/default/images/")>=0 || URL.indexOf("/upload/img/birthday/")>=0 || URL.indexOf("/upload/img/zhounian/")>=0){
        return _.baseURL;
      }else{
        return _.compressURL;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_content_html{
  width: 100%;
  overflow: auto;
  img {
    margin: 5px 0;
    max-width: 100%;
    vertical-align: middle;
  }
}
// 周年祝福背景
.qwui-tweet_content_templets{
  position: relative;
  padding: 0 12%;
  height: 400px;
  background-size: 100% auto;
  background-repeat: no-repeat;
  .qwui-tweet_content_html {
    padding-top: 60%;
    line-height: 150%;
    color: #fff;
    font-size: 15px;
  }
}
</style>
