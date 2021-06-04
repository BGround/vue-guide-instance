<template>
  <div class="qwui-message_container">
    <img class="qwui-avatar_pic"
         :src="message.headPic"
         width="42"
         height="42"
         alt="">
    <div class="qwui-mess_img"
         @click="previewImage"
         :style="{width: width + 'px',height: height + 'px','background-image':'url('+ url +')'}"></div>
  </div>
</template>

<script>
import { previewImages } from '@/utils/uploadImages.js'

export default {
  name: 'SendMessageComponent',
  props: {
    message: {
      type: Object
    }
  },
  data() {
    return {
      width: 150,
      height: 150,
      isMobile: false
    }
  },
  computed: {
    url(){
      return _.compressURL + this.message.content
    }
  },
  created(){
    // 判断是否手机终端
    if(_.isHefeixin()|| _.isWeChatApp()||_.isQiyeweixinApp() || _.isMobileApp()){
      this.isMobile=true;
    }
  },
  methods:{
    previewImage(){
      if(!this.isMobile){
        this.$emit('openPreivew',this.url);
        return;
      }
      previewImages(this.url,[this.url])
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-message_container {
  width: 100%;
  display: flex;
  margin: 20px -14px;
  flex-direction: row-reverse;
  .qwui-avatar_pic {
    border-radius: 50%;
  }
  .qwui-mess_img {
    margin-right: 12px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }
}
</style>
