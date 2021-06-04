<template>
  <div class="qwui-examination_paper_preview_wrap" v-if="show">
    <div class="head_wrap">
      <div class="head">
        <qwui-button class="button_select" type='primary' @click="select">选择</qwui-button>
        <span class="paper_info">
          <span class="paper_name ellipsis">{{info.testpaperName|filterNone}}</span>
          <span class="paper_score" v-show="info.testpaperName">({{info.totalScore|filterNone|filterInt}}分 {{info.questcount|filterNone}}题)</span>
        </span>
        <qwui-button class="button_close" @click="close">关闭</qwui-button>
      </div>
    </div>

    <div class="paper">
      <paper-preview :paper="paperData"></paper-preview>
    </div>

  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import PaperPreview from '../../../../../components/examination/PaperPreview/index'

export default {
  name: 'QwPaperPreviewWrap',
  components: {
    qwuiButton,
    PaperPreview,
  },
  filters: {
    filterNone(val) {
      return typeof val == 'undefined'? '': val
    },
    filterInt(val) { // 小数为0则取整
      return val == parseInt(val)? parseInt(val): val;
    }
  },
  props: {
    paperData: { // 试卷信息
      type: Object,
      required: true
    },
    show: { // 是否展示
      type: Boolean,
      required: true
    },

  },

  data() {
    return {
    };
  },
  computed: {
    info() {
      let paperData = this.paperData;
      return paperData.info? paperData.info: {};
    },

  },
  methods: {
    select() {
      if (this.info.parentId || this.info.id) {
        this.close();
        this.$emit('select');
      }
    },

    close() {
      this.$emit('close');
    },
  },

};
</script>

<style lang="scss" scoped>
.qwui-examination_paper_preview_wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #eee;
  overflow: auto;

  .head_wrap {
    position: fixed;
    top: 0;
    width: 100%;
    height: 51px;
    padding: 9px;
    text-align: center;
    background-color: #fff;
    border-bottom: 1px #eee solid;

    .head {
      display: inline-block;
      width: 980px;

      .button_select {
        float: left;
      }
      .paper_info {
        font-size: 18px;
        color: #333;
        line-height: 33px;

        .paper_name {
          display: inline-block;
          max-width: 60%;
          vertical-align: bottom;
        }
        .paper_score {
          font-size: 16px;
          color: #999;
        }
      }
      .button_close {
        float: right;
      }
    }
  }
}
</style>
