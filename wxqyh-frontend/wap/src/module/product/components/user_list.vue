<template>
  <div class="qwui-person" @click="clickItem">
    <span class="date" v-if="date">{{date}}</span>
    <img :src="dealImg(avatar)">
    <span class="name" v-text="name"></span>
    <span class="desc" v-if="desc">{{desc}}111</span>
  </div>
</template>
<script>
import defaultAvator from '@/assets/images/touxiang02.png';

export default {
  name: 'QwViewListPerson',
  props: {
    avatar: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    date: {
      type: String,
    },
    desc:{
      type:String
    },
    imgType: {
      type: String,
      default: 'headPic'
    },
    itemId:{
        type: String,
    }
  },
  methods: {
    dealImg(src) {
      if(this.imgType != 'headPic'){
        return _.filterCompressURL(src);
      } else {
        return src === '0' ? defaultAvator : src;
      }
    },
    clickItem(){
        if(this.itemId){
            this.$emit('clickItem', this.itemId);
        }
    }
  }
}
</script>
<style lang="scss" scoped>
.qwui-person {
  position: relative;
  background-color: white;
  font-size: 16px;
  padding: 10px 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  &::before{
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 1px;
      border-bottom: 1px solid #dfdfdd;
      transform-origin: 0 100%;
      transform: scaleY(0.5);
      z-index: 2;
  }

  img {
    position: relative;
    float: left;
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 5px;
    overflow: hidden;
  }
  .desc {
      display: block;
      font-size: 13px;
      color: #999;
      overflow: hidden;
      white-space: nowrap;
      word-wrap: normal;
      text-overflow: ellipsis;
  }
  .date {
    float: right;
    color: #999;
    font-size: 12px;
  }
}
</style>
