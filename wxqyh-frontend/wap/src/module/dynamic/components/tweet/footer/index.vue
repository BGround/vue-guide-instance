<template lang="html">
  <div class="qwui-tweet_footer">
    <!--最后一次编辑人和时间-->
    <p class="qwui-tweet_subinfo">
      <qw-tweet-labels
        :labels="[footer.lastEditInfo]"
        :showIcon="false"
        v-if="footer.lastEditInfo !=''"
      ></qw-tweet-labels>
    </p>
    <p class="qwui-tweet_subinfo">
      <qw-tweet-labels
        :labels="[footer.label]"
        v-if="!isOpen"
      ></qw-tweet-labels>
      <qw-tweet-view
        :viewCount="footer.viewCount"
      ></qw-tweet-view>
    </p>

    <qw-file-media class="qwui-tweet_file"
      :fileList="footer.fileList"
      v-if="isShowFileList"
    ></qw-file-media>

    <qw-tweet-subscribe
      :hasSubscribe="footer.subscribe.hasSubscribe"
      :total="footer.subscribe.total"
      :subscribeList="footer.subscribe.list"
      :isShare="isShare"
      v-if="!isOpen && isShowSubscribe"
    ></qw-tweet-subscribe>

    <div v-if="tweetCheck.show">
      <qw-tweet-check
        :status="tweetCheck.status"
        :auditPerson="tweetCheck.auditPerson"
      ></qw-tweet-check>
    </div>

    <qw-tweet-page-change
      v-if="!isOpen && isShowSubscribe"
    ></qw-tweet-page-change>
    </div>
</template>

<script>
import QwTweetLabels from './labels';
import QwTweetView from './view';
import QwTweetSubscribe from './subscribe';
import QwTweetPageChange from './pageChange';
import QwTweetCheck from './check';
import QwFileMedia from '@/components/visualization/FileMediaExt';

export default {
  name: 'QwTweetFooter',
  components: {
    QwTweetLabels,
    QwTweetView,
    QwTweetSubscribe,
    QwFileMedia,
    QwTweetPageChange,
    QwTweetCheck
  },
  props: {
    footer: {
      type: Object,
      required: true,
      validator (footer) {
        return typeof footer.label === 'string' &&
          typeof footer.viewCount === 'number' &&
          typeof footer.subscribe === 'object' &&
          (footer.fileList === undefined || Array.isArray(footer.fileList)) &&
          typeof footer.lastEditInfo === 'string';
      }
    },
    tweetCheck: {
      type: Object,
      required: true,
      validator (tweetCheck) {
        return typeof tweetCheck.show === 'boolean' &&
          typeof tweetCheck.status === 'number';
      }
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isShowFileList () {
      return this.footer.fileList && this.footer.fileList.length > 0;
    },
    isShowSubscribe () {
      return !this.tweetCheck.show || this.tweetCheck.status === 0;
      return true;
    },
    isShare () {
      // 显示分享按钮:非外部分享链接，开启了外部分享，审核通过，微信终端
      return !this.isOpen && this.footer.isOpen === '1' && this.tweetCheck.status === 0 && _.isWeChatApp();
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_footer {
  font-size: 14px;

  .qwui-tweet_subinfo {
    margin-top: 15px;
  }

  .qwui-tweet_file {
    margin-top: 20px;
    margin-bottom: 10px;
  }
}
</style>
