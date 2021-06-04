<template>
  <div
    class="qwui-form_item qwui-form_item_hasLabel">
    <label class="qwui-form_item_label label_relative" v-if="!objConfig.noLabel">
      {{ objConfig.title }}
      <span class="label_description"
        @mouseover="showTip = true"
        @mouseleave="showTip = false"
      >?</span>
      <div class="label_tip"
           v-show="showTip"
           @mouseover="showTip = true"
           @mouseleave="showTip = false"
      >
        <div class="tip_content">
          • 试卷相同：随机生成一份试卷，每位考生的试卷相同。<br>
          • 每份试卷不同：随机生成多份试卷，每位考生的试卷不同。<br>
          "每份试卷不同"功能仅限尊享版使用。
        </div>
      </div>
    </label>
    <div class="qwui-form_item_content">
      <qwui-radio
        :key="index"
        v-for="(item, index) in objConfig.options"
        :label="item.label"
        :disabled="item.disabled"
        v-model="msg"
      >{{ item.label }}</qwui-radio>
      <span class="content_goldTag" @click="$goBuyVip"></span>
      <div class="qwui-form_item_error_tip" v-if="showValidate">{{ validateInfo }}</div>
    </div>
  </div>
</template>

<script>
import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio'
import Base from '../../../../mixins/base';
import Validate from '../../../../mixins/validate'

export default {
  name: 'qwRandomExam',

  components: { qwuiRadio },

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
      showTip: false,
    }
  },

  computed: {},

  watch: {},

  created() {
  },

  methods: {},

}
</script>

<style lang="scss" scoped>
.label_relative{
  position: relative;
}
.content_goldTag {
  position: relative;
  top: 5px;
  left: 2px;
  display: inline-block;
  width: 48px;
  height: 20px;
  cursor: pointer;
  background: url("~assets/images/vip_icon.png") no-repeat;
  /*&:hover {*/
    /*-webkit-transform:translate3d(0,0,0);*/
    /*-moz-transform:translate3d(0,0,0);*/
    /*transform:translate3d(0,0,0);*/
    /*!* 设置动画，animation:动画名称 动画播放时长单位秒或微秒 动画播放的速度曲线linear为匀速 动画播放次数infinite为循环播放; *!*/
    /*-webkit-animation:play 3s linear;*/
    /*-moz-animation:play 3s linear;*/
    /*animation:play 3s linear;*/
  /*}*/
}
/*@-webkit-keyframes play{*/
  /*0%  {*/
    /*!**/
    /*水平翻转*/
    /**!*/
    /*-webkit-transform:rotateY(0deg);*/
    /*!**/
    /*垂直翻转*/
    /*-webkit-transform:rotateX(0deg);*/
    /*顺时针旋转*/
    /*-webkit-transform:rotate(0deg);*/
    /*逆时针旋转*/
    /*-webkit-transform:rotate(0deg);*/
    /**!*/
  /*}*/
  /*100% {*/
    /*!* 水平翻转 *!*/
    /*-webkit-transform:rotateY(360deg);*/
    /*!* 垂直翻转*/
    /*-webkit-transform:rotateX(360deg);*/
    /*顺时针旋转*/
    /*-webkit-transform:rotate(360deg);*/
    /*逆时针旋转*/
    /*-webkit-transform:rotate(-360deg);*/
    /**!*/
  /*}*/
/*}*/
/*@-moz-keyframes play{*/
  /*0%  {*/
    /*-moz-transform:rotateY(0deg);*/
    /*!**/
    /*-moz-transform:rotateX(0deg);*/
    /*-moz-transform:rotate(0deg);*/
    /*-moz-transform:rotate(0deg);*/
    /**!*/
  /*}*/
  /*100% {*/
    /*-moz-transform:rotateY(360deg);*/
    /*!**/
    /*-moz-transform:rotateX(360deg);*/
    /*-moz-transform:rotate(360deg);*/
    /*-moz-transform:rotate(-360deg);*/
    /**!*/
  /*}*/
/*}*/
/*@keyframes play{*/
  /*0%  {*/
    /*transform:rotateY(0deg);*/
    /*!**/
    /*transform:rotateX(0deg);*/
    /*transform:rotate(0deg);*/
    /*transform:rotate(0deg);*/
    /**!*/
  /*}*/
  /*100% {*/
    /*transform:rotateY(360deg);*/
    /*!**/
    /*transform:rotateX(360deg);*/
    /*transform:rotate(360deg);*/
    /*transform:rotate(-360deg);*/
    /**!*/
  /*}*/
/*}*/
</style>
