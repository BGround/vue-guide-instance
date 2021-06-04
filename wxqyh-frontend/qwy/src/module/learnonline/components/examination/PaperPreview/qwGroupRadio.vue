<template>
  <div class="qwui-paper_preview_group_radio">
    <qwui-radio 
      class="paper_preview_radio flex" 
      v-for="(option, optionIndex) in optionList"
      v-model="optionVal"
      :label="option.id"
      :key="optionIndex"
      @change="change(optionIndex)"
    >
      <div class="option_radio_content_wrap">
        <div class="option_radio_content">
          {{String.fromCharCode(65+optionIndex)}}. {{option.content}}
        </div>
        <div class="option_radio_img_wrap">
          <img 
            class="option_radio_img"
            v-for="(picItem, index) in option.picList"
            :src="$completeImgUrl(picItem.picPath)"
            :key="index"
          >
        </div>
      </div>
    </qwui-radio>
  </div>
</template>

<script>
import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio'; // 单选框-公共
export default {
  name: 'QwGroupRadio',
  components: {
    qwuiRadio
  },

  props: {
    optionList: { // 选项数组
      type: Array,
      required: true
    },
  },

  data() {
    return {
      optionVal: ''
    };
  },
  computed: {
  },
  methods: {
    change(optionIndex) {
      this.$emit('change', {
        option: this.optionList[optionIndex],
        optionVal: this.optionVal
      });
    },

  },

};
</script>

<style lang="scss" scoped>
.qwui-paper_preview_group_radio {
  margin-bottom: 8px;

  .paper_preview_radio {

    /* 覆盖掉公共组件内样式 */
    &+.qwui-radio{
      margin-left: 0;
    }

    & /deep/ .qwui-radio-input {
      margin-top: 3px;
    }

    .option_radio_content_wrap {
      display: inline-block;
      margin-left: 10px;
      line-height: 24px;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;

      .option_radio_img_wrap {
        margin-top: 5px;

        .option_radio_img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
      }
    }
  }
  
}

</style>
