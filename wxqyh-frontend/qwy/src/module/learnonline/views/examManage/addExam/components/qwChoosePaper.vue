<template>
  <div
    class="qwui-form_item qwui-form_item_hasLabel"
    :class="{
      'qwui-form_item_required' : objConfig.required,
    }"
  >
    <label class="qwui-form_item_label" v-if="!objConfig.noLabel">{{ objConfig.title }}</label>
    <div class="qwui-form_item_content">
      <div class="content_chooseBox"
       v-if="Object.keys(msg).length == 0"
       :class="{'redBorder': showValidate}"
       @click="choosePaper">
        <span class="chooseBox_icon"></span>
        选择试卷
      </div>
      <div class="content_result" v-else @click="choosePaper">
        <span class="result_detail">
          <span class="detail_score">《</span>
          <span class="detail_name ellipsis" :title="msg.testpaperName">
            {{ msg.testpaperName }}
          </span>
          <span class="detail_score">》</span>
          <span class="detail_score">（{{ msg.totalScore }}分/{{ msg.questcount }}题）</span>
        </span>
      </div>
      <div class="qwui-form_item_error_tip" v-show="showValidate">{{ validateInfo }}</div>
    </div>
    <!-- 选择试卷 -->
    <qw-select-paper
      v-bind.sync="selectPaper"
      @selectPaper="handleSelectPaper"
      @closeWindow="handleCloseWin"
    ></qw-select-paper>
  </div>
</template>

<script>
  import Base from '../../../../mixins/base';
  import Validate from '../../../../mixins/validate'
  import qwSelectPaper from './selectPaper'

  export default {
  name: 'qwChoosePaper',

  components: { qwSelectPaper },

  mixins: [ Base, Validate ],

  props: {
    //选项的配置
    objConfig: {
      type: Object,
      required: true
    },
    objVal: {
      required: true
    },
    objKey: {
      type: Array,
      required: true
    },
    EVENT_BUS: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      keyName: this.objKey,
      validateState: '',
      validateMessage: '',
      selectPaper: {
        show: false,
        nowPaper: this.msg || {},
      },
    }
  },

  computed: {},

  watch: {
    msg() {
//      this.selectPaper = Object.assign({}, {nowPaper: this.msg}, {show: false});
      this.selectPaper.nowPaper = this.msg;
    }
  },

  created() {},

  methods: {
    choosePaper() {
      this.selectPaper.show = true;
    },
    handleSelectPaper(paperObj) {
      this.$api.judgeAllowPic({"paperId": paperObj.id}, (result) => {
        let paperChoosed = Object.assign({}, result.paper, {"paperAllowPic": result.paperAllowPic});
//        this.selectPaper.nowPaper = Object.assign({}, result.paper, {"paperAllowPic": result.paperAllowPic});
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: this.objKey,
          value: paperChoosed
        });
        this.handleBlur();
      });
    },
    handleCloseWin() {
      this.handleBlur();
    },
    handleBlur() {
      return this.asyncValidate();
    }
  },

}
</script>

<style lang="scss" scoped>
 @import '../../../../style/config';
 .qwui-form_item {
   /deep/ .qwui-examination_select_paper {
     z-index: 2;
   }
 }
  .content_chooseBox {
    width: 340px;
    height: 50px;
    color: $greyColor;
    border: 1px dashed rgba(213,213,213,1);;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
    transition: border .2s ease-in-out;
    &.redBorder {
      border-color: $redColor;
    }
    .chooseBox_icon {
      position: relative;
      top: 2px;
      display: inline-block;
      width: 14px;
      height: 14px;
      background: url("~assets/images/ic_b-add.png") center/14px 14px no-repeat;
    }
  }
  .content_result {
    width: 702px;
    height: 50px;
    padding: 4px 8px;
    border: 1px dashed rgba(213,213,213,1);;
    cursor: pointer;
    .result_detail {
      display: inline-block;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      color: #C31725;
      border: 1px #f4d6aa solid;
      border-radius: 4px;
      .detail_name {
        display: inline-block;
        max-width: 410px;
      }
      .detail_score {
        vertical-align: top;
      }
    }
  }
</style>
