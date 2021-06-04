<template>
  <div class="qwui-paper_preview_group_checkbox">
    <qwui-checkbox 
      class="paper_preview_checkbox flex" 
      v-for="(option, optionIndex) in optionList"
      v-model="optionVal[optionIndex]"
      :label="option.id"
      :key="optionIndex"
      @change="change(optionIndex)"
    >
      <div class="option_checkbox_content_wrap">
        <div class="option_checkbox_content">
          {{String.fromCharCode(65+optionIndex)}}. {{option.content}}
        </div>
        <div class="option_checkbox_img_wrap">
          <img 
            class="option_checkbox_img"
            v-for="(picItem, index) in option.picList"
            :src="$completeImgUrl(picItem.picPath)"
            :key="index"
          >
        </div>
      </div>
    </qwui-checkbox>
  </div>
</template>

<script>
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'; // 多选框-公共
export default {
  name: 'QwGroupCheckbox',
  components: {
    qwuiCheckbox
  },

  props: {
    optionList: { // 选项数组
      type: Array,
      required: true
    },
  },

  data() {
    return {
      optionVal: new Array(this.optionList.length).map(() => '')
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
.qwui-paper_preview_group_checkbox {
  margin-bottom: 8px;

  .paper_preview_checkbox {

    /* 覆盖掉公共组件内样式 */
    &+.qwui-checkbox{
      margin-left: 0;
    }

    & /deep/ .qwui-checkbox-input {
      margin-top: 3px;
    }

    .option_checkbox_content_wrap {
      display: inline-block;
      margin-left: 10px;
      line-height: 24px;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;

      .option_checkbox_img_wrap {
        margin-top: 5px;

        .option_checkbox_img {
          width: 40px;
          height: 40px;
          margin-right: 10px;
        }
      }
    }
  }
  
}

</style>
