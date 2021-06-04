<template lang="html">
  <div class="qwui-tweet_subscribe">
    <a href="javascript: void(0)"
      class="qwui-tweet_subscribe_btn"
      :class="{'qwui-tweet_subscribed': hasSubscribe}"
      @click="toggleSubscribe"
    >
      <i class="qwui-tweet_icon_subscribe"
        :class="{'qwui-show_animate': isShowAnimate}"
      ></i>
    </a>
    <a href="javascript: void(0)"
      class="qwui-tweet_share"
      @click="share"
      v-if="isShare"
    >
      <i class="qwui-tweet_icon_share"></i>
    </a>
    <div class="qwui-tweet_subscribeList"
      v-if="isShowSubscribeList"
    >
      <p>
        <i class="qwui-tweet_icon_subscribe"></i>
        <span v-text="total"></span>赞
      </p>
      <!--区分党建和新闻公告，党建无获取点赞列表-->
      <p class="qwui-tweet_subscribe_name" v-if="agentCode=='partyconstruction'">
        <span v-for="item in subscribeList"
          v-text="item"
          class="qwui-tweet_subscribe_text"
        ></span>
      </p>
      <p class="qwui-tweet_subscribe_name" v-else>
        <!--新闻公告最多显示50条-->
        <span v-for="item in subscribeList.slice(0,50)"
          v-text="item"
          class="qwui-tweet_subscribe_text"
        ></span>
        <label v-show="total > 50">... <span @click="toPraiseList" class="qwui-tweet_subscribe_btn">查看全部</span></label>
      </p>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus';

export default {
  name: 'QwTweetSubscribe',
  props: {
    hasSubscribe: {
      type: Boolean,
      required: true
    },
    total: {
      type: Number,
      required: true,
    },
    subscribeList: {
      type: Array,
      required: true
    },
    isShare: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowAnimate: false,
      agentCode: _.getUrlParam('agentCode')
    }
  },
  computed: {
    subscribeText () {
      return this.subscribeList.join(', ');
    },
    isShowSubscribeList () {
      return this.total !== 0;
    }
  },
  watch: {
    hasSubscribe (value) {
      this.isShowAnimate = value;
    }
  },
  methods: {
    toggleSubscribe () {
      eventBus.$emit('tweet-subscribe');
    },
    share () {
      eventBus.$emit('tweet-share');
    },
    // 跳转至点赞列表
    toPraiseList() {
      eventBus.$emit('tweet-praise');
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes bigger {
  from {
    top: 15px;
    left: 17px;
    width: 20px;
    height: 20px;
    background: {
      size: 77px 20px;
      position: -19px 0;
    }
  }

  50% {
    top: 10px;
    left: 12px;
    width: 30px;
    height: 30px;
    background: {
      size: 116px 30px;
      position: -29px 0;
    }
  }

  to {
    top: 15px;
    left: 17px;
    width: 20px;
    height: 20px;
    background: {
      size: 77px 20px;
      position: -19px 0;
    }
  }
}


.qwui-tweet_subscribe {
  margin: 30px 0;
  text-align: center;

  a {
    display: inline-block;
    position: relative;
    width: 54px;
    height: 54px;
    text-align: center;
    font-size: 0px;
    border: 1px solid #ddd;
    border-radius: 50%;
  }

  .qwui-show_animate {
    animation-duration: .5s;
    animation-name: bigger;
  }

  .qwui-tweet_icon_subscribe,
  .qwui-tweet_icon_share {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: {
      image: url(../img/dz.png);
      repeat: no-repeat;
      position: 0;
      size: 77px 20px;
    }
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  .qwui-tweet_subscribe_btn,
  .qwui-tweet_share {
    i {
      position: absolute;
      top: 15px;
      left: 17px;
    }
  }

  .qwui-tweet_share {
    margin-left: 30px;
  }

  .qwui-tweet_icon_share {
    background-position: -38px 0;
  }

  .qwui-tweet_subscribed {
    border-color: #ffe5c0;
    background-color: #fff6ea;

    .qwui-tweet_icon_subscribe {
      background-position: -19px 0;
    }
  }

  .qwui-tweet_subscribeList {
    margin-top: 10px;
    padding: 10px 7px;
    color: #666;
    text-align: left;
    background-color: #f6f6f6;

    .qwui-tweet_icon_subscribe {
      position: relative;
      top: 1px;
      margin: 0;
      width: 15px;
      height: 15px;
      background: {
        image: url(../img/ic_dz.png);
        size: 100% 100%;
        position: center center;
      }
    }

    .qwui-tweet_subscribe_name {
      margin-top: 5px;
      font-size: 14px;

      .qwui-tweet_subscribe_text{
        margin-right: 5px;
        color: #999;

        &::after {
          content: ', ';
        }

        &:last-of-type {
          margin: 0;
          &::after {
            content: '';
          }
        }
      }
      label {
        color: #999;
      }
      .qwui-tweet_subscribe_btn {
        cursor: pointer;
        color:#73859c;
      }
    }
  }
}
</style>
