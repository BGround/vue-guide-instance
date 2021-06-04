<template lang="html">
  <p class="qwui-tweet_header_info">
    <slot name="before"></slot>

    <span class="qwui-tweet_datetime"
      v-text="datetime"
    ></span>

    <slot name="between"></slot>

    <!--来自手机和不是原作者则添加点击事件-->
    <span v-if="contentType=='来自手机'&&!isAuthor&&!isOpen"
      class="qwui-tweet_author"
      v-text="author" @click="showPersonDetail"></span>
    <span v-text="author" v-else></span>

    <slot name="after"></slot>
  </p>
</template>

<script>
/**
 * 文章基本信息 qw-tweet-header-info
 *
 * @param datetime(String, required): 发布日期
 * @param author(String, required): 作者名
 * @param contentType(String, required): 发布设备类型
 * @param isAuthor(Boolean, required): 是否为原作者
 * @param creator(String, required): 创建账号id
 * 
 * @slot before: 前缀
 * @slot between: 日期和作者名之间
 * @slot after: 后缀
 *
 */

import {
  notNullStringValidator
} from '@/utils/validator';
import EventBus from '@/utils/eventBus';

export default {
  name: 'QwTweetHeaderInfo',
  props: {
    // 发布日期
    datetime: {
      type: String,
      required: true,
    },
    // 作者名
    author: {
      type: String,
      required: true,
      validator: notNullStringValidator
    },
    // 发布设备类型 '网页'  or '来自手机'
    contentType: {
      type: String,
      required: true,
      validator: notNullStringValidator
    },
    // 是否为原作者
    isAuthor: {
      type: Boolean,
      required: true
    },
    creator: {
      type: String,
      validator: notNullStringValidator
    },
    // 是否为外部分享
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  methods:{
    showPersonDetail(){
      // 查看个人头像信息
        if(this.creator){
          let obj = {
            creator: this.creator,
            personName: this.author

          }
          EventBus.$emit("atThisPersonUtil", obj);
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_header_info {
  color: #888;
  font-size: 14px;

  span {
    display: inline-block;
    margin-right: 10px;
  }
  .qwui-tweet_author{
    color: #586c94;
  }
}
</style>
