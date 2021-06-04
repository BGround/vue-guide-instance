<template lang="html">
  <div>
   <!--封面-->
    <p class="qwui-tweet_content_picture" v-if="isCover">
      <img :src="cover.src"
        :alt="cover.alt"
        :title="description"
        @click="preview(cover.src)"
        :style="{pointerEvents: isSecret=='1'?'none':''}"
      >
      <span v-text="description"
        v-if="description"
      ></span>
    </p>
    <!--图片列表-->
    <div class="qwui-detail_instruct_images" v-if="isPicList">
      <img :src="dealImagesUrl(item.path)"
            @click="preview(item.path)"
            v-for="(item,index) in images" :key="index"
            :style="{pointerEvents: isSecret=='1'?'none':''}">
    </div>
  </div>
</template>

<script>
import EventBus from '@/utils/eventBus';

export default {
  name: "QwTweetContentPicture",
  props: {
    cover: {
      type: Object,
      defalut: {}
    },
    description: {
      type: String,
      default: ''
    },
    images: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    isSecret:{
      type: [String, Number]
    }
  },
  computed:{
    isCover(){
      if(this.cover){
        return this.cover.src!='';
      }
      return false;
    },
    isPicList(){
      if(this.images){
        return this.images.length>0? true:false;
      }
      return false;
    }
  },
  methods: {
    dealImagesUrl(url){ //图片路径
      if(url.indexOf("http")!=-1){
        return url;
      }
      return (_.compressURL+url).replace('/compress/','/');
    },
    //预览图片
    preview (src) {
      let url = '';
      if(src.indexOf("http")!=-1){
          url = src;
      }else {
        url = (_.compressURL+src).replace('/compress/','/');
      }
      EventBus.$emit('tweet-preview', url);
    },
  }
}
</script>

<style lang="scss">
.qwui-tweet_content_picture {
  margin-bottom: 10px;
  text-align: center;

  img {
    width: 100%;
  }

  span {
    display: inline-block;
    padding: 0 10px;
    line-height: 2em;
    border-bottom: 1px solid #ddd;
  }
}
.qwui-detail_instruct_images img{
    width: 100%;
    margin: 5px 0;
    object-fit: cover;
  }
</style>
