<template>
  <div class="official-website-preview"
       v-show="visible">
    <div class="preview-content">
      <div class="preview-content-body">
        <div class="preview-content-body-top">

        </div>
        <div class="preview-content-body-main">
          <div class="preview-content-body-module"
               v-for="(item,index) in previewList"
               :key="index">
            <address-view v-if="item.type==='address'"
                          :option="item"></address-view>
            <email-view v-else-if="item.type==='email'"
                        :option="item"></email-view>
            <image-view v-else-if="item.type==='image'"
                        :option="item"></image-view>
            <info-view v-else-if="item.type==='info'"
                       :option="item"></info-view>
            <phone-view v-else-if="item.type==='phone'"
                        :option="item"></phone-view>
            <subline-view v-else-if="item.type==='subline'"
                          :option="item"></subline-view>
            <textarea-view v-else-if="item.type==='textarea'"
                           :option="item"></textarea-view>
            <title-view v-else-if="item.type==='title'"
                        :option="item"></title-view>
            <video-view v-else-if="item.type==='video'"
                        :option="item"></video-view>
          </div>
        </div>
      </div>
      <div class="preview-content-btns">
        <template v-if="!example">
          <qwui-button type="primary"
                       @click="save">保存</qwui-button>
          <qwui-button @click="visible= false">编辑</qwui-button>
        </template>
        <template v-else>
          <qwui-button type="primary"
                       @click="edit">{{existOficiaWebsite?'编辑':'创建'}}</qwui-button>
        </template>
        <qwui-button @click="visible= false">关闭</qwui-button>
      </div>
    </div>
  </div>
</template>

<script>
import AddressView from './addressModule/view'
import EmailView from './emailModule/view'
import ImageView from './imageModule/view'
import InfoView from './infoModule/view'
import PhoneView from './phoneModule/view'
import SublineView from './sublineModule/view'
import TextareaView from './textareaModule/view'
import TitleView from './titleModule/view'
import VideoView from './videoModule/view'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import { getHomeBuildDetail } from '@/module/crm/api/assistant/index.js'

export default {
  name: 'officialWebsitePreview',
  components: {
    AddressView,
    EmailView,
    ImageView,
    InfoView,
    PhoneView,
    SublineView,
    TextareaView,
    TitleView,
    VideoView,
    qwuiButton
  },
  data() {
    return {
      visible: this.value,
      previewList: []
    }
  },
  props: {
    value: Boolean,
    list: Array,
    existOficiaWebsite: Boolean,
    example: {
      default: false,
      type: Boolean
    } // 示例
  },
  computed: {},
  watch: {
    value(val) {
      this.visible = val
      if (val) {
        this.init()
      }
    },
    visible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    init() {
      if (this.example) {
        getHomeBuildDetail().then(res => {
          if (res.code === '0') {
            this.previewList = res.data.templateJson
          } else {
            dataBase.top_alert(res.desc, false, 3000)
          }
        })
      } else {
        this.previewList = this.list
      }
    },
    save() {
      this.$emit('on-click-save')
    },
    edit() {
      this.$emit('on-click-edit')
    }
  }
}
</script>

<style lang="scss" scoped>
.official-website-preview {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  .preview-content {
    width: 356px;
    height: 725px;
    background: url('~assets/images/img_phone.png') no-repeat;
    position: relative;
    &-body {
      // background-color: #ddd;
      border: 1px solid #f0f0f0;
      width: 320px;
      height: 570px;
      margin: 0 auto;
      margin-top: 72px;
      display: flex;
      flex-direction: column;
      &-top {
        width: 100%;
        height: 64px;
        background: url('~assets/images/img_xw_toolbar.png') no-repeat;
        background-size: contain;
      }
      &-main {
        overflow-y: auto;
        flex: 1;
        padding-top: 5px;
      }
    }
    &-btns {
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      flex-direction: column;
      height: max-content;
      right: -90px;
      button {
        margin-bottom: 24px;
        font-size: 12px;
      }
    }
  }
}
/*滚动条*/
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>

