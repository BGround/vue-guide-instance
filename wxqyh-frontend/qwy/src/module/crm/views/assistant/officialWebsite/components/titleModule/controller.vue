<template>
  <div class="qwui-edit_title">
    <div class="qwui-edit_item qwui-item_line">
      <p class="qwui-edit_text">对齐方式</p>
      <div class="qwui-align">
        <div class="qwui-align_item"
             v-for="(item,ind) in alignList"
             :key="ind"
             :class="ind == option.display? 'qwui-align_current':''"
             @click="alignStyle(ind)">
          <img class="qwui-align_img"
               :src="item.imgSrc"
               alt="">
          <span class="qwui-align_text">{{item.title}}</span>
        </div>
      </div>
    </div>
    <div class="qwui-edit_item">
      <p class="qwui-edit_text">标题内容
        <span class="qwui-text_need">*</span>
      </p>
      <div class="qwui-content">
        <input class="qwui-content_edit"
               type="text"
               placeholder="请输入标题内容"
               maxlength="30"
               v-model="option.detail[0].title">
        <span class="qwui-content_tip"
              :class="option.detail[0].title.length === 30? 'qwui-tip_warn': ''">{{option.detail[0].title.length}}/30</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alignList: [
        {
          title: '左对齐',
          imgSrc: require('assets/images/icon_textmode1.png')
        },
        {
          title: '中对齐',
          imgSrc: require('assets/images/icon_textmode2.png')
        },
        {
          title: '右对齐',
          imgSrc: require('assets/images/icon_textmode3.png')
        }
      ]
    }
  },
  props: {
    option: {
      default: {},
      type: Object
    }
  },
  created() {
    if (!this.option.detail || this.option.detail.length === 0) {
      this.option.detail = [{ title: '' }]
    }
  },
  methods: {
    alignStyle(target) {
      this.$set(this.option, 'display', target)
    }
  }
}
</script>

<style lang="scss">
.qwui-edit_title {
  width: 100%;
  .qwui-item_line {
    border-bottom: 1px solid #f0f0f0;
  }
  .qwui-edit_item {
    padding: 24px;
    .qwui-edit_text {
      position: relative;
      font-size: 14px;
      line-height: 19px;
      color: #333;
      width: 63px;
      margin-bottom: 16px;
      .qwui-text_need {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        color: #ee5037;
      }
    }
    .qwui-align {
      font-size: 0;
      .qwui-align_item {
        display: inline-block;
        margin-right: 11px;
        width: 80px;
        height: 72px;
        text-align: center;
        &:last-child {
          margin-right: 0;
        }
        .qwui-align_img {
          width: 24px;
          height: 24px;
          margin: 8px 0;
        }
        .qwui-align_text {
          display: block;
          font-size: 12px;
          line-height: 16px;
          color: #333;
        }
      }
      .qwui-align_current {
        background-color: #f6f6f8;
        border-radius: 4px;
      }
    }
    .qwui-content {
      position: relative;
      .qwui-content_edit {
        width: 100%;
        height: 32px;
        box-sizing: border-box;
        padding-left: 8px;
        padding-right: 45px;
        border: 1px solid #d5d5d5;
        font-size: 12px;
        border-radius: 2px;
      }
      .qwui-content_tip {
        height: 16px;
        line-height: 16px;
        position: absolute;
        color: #ccc;
        top: 50%;
        margin-top: -8px;
        right: 8px;
        font-size: 12px;
      }
      .qwui-tip_warn {
        color: #ee5037;
      }
    }
  }
}
</style>


