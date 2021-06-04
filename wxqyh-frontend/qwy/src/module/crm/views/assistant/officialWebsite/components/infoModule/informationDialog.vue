<template>
  <div class="qwui-info_mask"
       v-show="isShow">
    <div class="qwui-info_dialog">
      <div class="qwui-info_header">
        <h2 class="qwui-text">{{titleType}}</h2>
        <img class="qwui-pic"
             :src="imgUrl"
             alt=""
             @click="closeDialog">
      </div>
      <div class="qwui-info_body"
           ref="scrollContent">
        <div class="qwui-edit_item">
          <p class="qwui-edit_text">资讯封面
            <span class="qwui-text_need">*</span>
          </p>
          <div class="qwui-content">
            <div class="content">
              <label class="content-add"
                     v-if="!fileImgUrl">
                <p>+添加资讯封面</p>
                <p>建议上传尺寸为240*260的图片</p>
                <input type="file"
                       ref="inputFile"
                       @change="fileChange"
                       accept="image/jpeg,image/jpg,image/png,image/gif">
              </label>
              <div class="content-img_wrap"
                   v-else>
                <img class="content-pic"
                     :src="fileImgUrl"
                     alt="">
                <img class="content-close"
                     src="~assets/images/icon_btn_close.png"
                     alt=""
                     @click="delImg">
              </div>
            </div>
          </div>
        </div>
        <div class="qwui-edit_item">
          <p class="qwui-edit_text">资讯标题
            <span class="qwui-text_need">*</span>
          </p>
          <div class="qwui-content">
            <input class="qwui-content_edit"
                   type="text"
                   placeholder="请输入标题内容"
                   maxlength="30"
                   v-model="tem">
            <span class="qwui-content_tip"
                  :class="tem.length === 30? 'qwui-tip_warn': ''">{{tem.length}}/30</span>
          </div>
        </div>
        <div class="qwui-edit_item">
          <p class="qwui-edit_text">发布时间
            <span class="qwui-text_need">*</span>
          </p>
          <div class="qwui-content">
            <vue-datepicker-local v-model="currentDate"
                                  :disabledDate="disabledDate"
                                  ref="datePicker"></vue-datepicker-local>
          </div>
        </div>
        <div class="qwui-edit_item">
          <p class="qwui-edit_text">资讯内容
            <span class="qwui-text_need">*</span>
          </p>
          <div class="qwui-content">
            <editor :config="editorOption"
                    agentCode="crmmini"
                    ref="editor"></editor>
          </div>
        </div>
      </div>
      <button class="qwui-info_save"
              @click="saveInfo">保存</button>
    </div>
  </div>
</template>

<script>
import Editor from 'components/base/editor'
import VueDatepickerLocal from 'vue-datepicker-local'

const EDITOR_OPTION = {
  initialFrameHeight: 350,
  zIndex: 10,
  enableAutoSave: false,
  saveInterval: 1000,
  maximumWords: 60000,
  wordCountMsg: '{#count}/60000',
  wordOverFlowMsg:
    "<span style='color:red;'>您输入的字符已超出6W限制，将无法提交资讯！</span>",
  autoHeightEnabled: false, //禁止自动改变高度
  toolbars: [
    [
      'fullscreen',
      'source',
      '|',
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'underline',
      'forecolor',
      '|',
      'insertorderedlist',
      'insertunorderedlist',
      'fontsize',
      'justifyleft',
      'justifycenter',
      'justifyright',
      'justifyjustify',
      'insertimage'
    ]
  ]
}
export default {
  props: {
    which: Object,
    value: Boolean
  },
  data() {
    return {
      titleType: '添加资讯',
      isShow: false,
      imgUrl: require('assets/images/btn_close.png'),
      tem: '',
      editorOption: EDITOR_OPTION,
      fileImgUrl: '',
      imageUploadPathPC:
        '/imageupload/imageUploadAction!doUploadMgrImageBase64.action', //pc端上传图片接口,
      copyData: null,
      currentDate: new Date()
    }
  },
  mounted() {
    this.isShow = this.value
  },
  components: {
    Editor,
    VueDatepickerLocal
  },
  watch: {
    value(val) {
      this.titleType = '编辑资讯'

      this.$refs.scrollContent &&
        this.$refs.scrollContent.scrollTo &&
        this.$refs.scrollContent.scrollTo(0, 0)

      this.isShow = val

      if (!this.which) {
        this.titleType = '添加资讯'
        this.clearContent()
        return
      }

      //拷贝一份,编辑退出时还原数据
      this.copyData = this.deepClone(this.which)

      this.tem = this.which.title
      this.fileImgUrl = this.which.picPath
      this.$refs.editor.setUEContent(this.which.content)

      let tem = this.which.releaseTime.slice(0)
      this.currentDate = new Date(this.restoreTime(tem))
    },
    isShow(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    closeDialog() {
      this.isShow = false
      if (!this.which) {
        this.clearContent()
        return
      }
      //编辑状态退出时,数据还原
      this.tem = this.copyData.title
      this.fileImgUrl = this.copyData.picPath
      this.$refs.editor.setUEContent(this.copyData.content)

      let tem = this.copyData.releaseTime.slice(0)
      this.currentDate = new Date(this.restoreTime(tem))
    },
    delImg() {
      this.fileImgUrl = ''
    },
    saveInfo() {
      let obj = {
        picPath: this.fileImgUrl,
        title: this.tem,
        content: this.$refs.editor.getUEContent(),
        releaseTime: this.getNowTime(this.currentDate),
        display: 1
      }
      if (!obj.picPath || !obj.title || !obj.content) {
        _.alert('提示', '所有内容不能为空')
        return
      }
      this.$emit('newInfo', obj)
    },
    uploadImage(base64, name) {
      _.ajax({
        url: _.baseURL + this.imageUploadPathPC,
        type: 'post',
        data: {
          imgFileBase: base64,
          agent: 'crmmini'
        },
        success: result => {
          if (result.code === '0') {
            this.fileImgUrl = _.compressURL + result.data.imgurl
          }
        },
        error: function() {
          _.alert('提示', '网络错误')
          return
        }
      })
    },
    fileChange() {
      let files = this.$refs.inputFile.files
      Object.values(files).forEach(file => {
        let reader = new FileReader()
        reader.onload = e => {
          this.uploadImage(e.target.result, file.name)
        }
        reader.readAsDataURL(file)
      })
    },
    //重置所有内容
    clearContent() {
      this.tem = ''
      this.fileImgUrl = ''
      this.$refs.editor.setUEContent('')
      this.currentDate = new Date()
    },
    getNowTime(selectTime) {
      return selectTime.Format('yyyy年M月d日')
    },
    //深拷贝
    deepClone(target) {
      let tem = JSON.stringify(target)
      return JSON.parse(tem)
    },
    //限制时间选择控件的选择范围
    disabledDate(time, format) {
      let now = new Date()
      return now < time
    },
    //格式化时间
    restoreTime(target) {
      target = target.replace('年', '-')
      target = target.replace('月', '-')
      target = target.replace('日', '')
      return target
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-info_mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.6);
  .qwui-info_dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 720px;
    height: 614px;
    margin-top: -307px;
    margin-left: -360px;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    .qwui-info_header {
      display: flex;
      height: 60px;
      padding: 0 32px;
      justify-content: space-between;
      align-items: center;
      background-color: #f7f7f7;
      .qwui-text {
        font-size: 18px;
        color: #333;
      }
      .qwui-pic {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
    .qwui-info_body {
      height: 426px;
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 28px 32px;
    }
  }
  .qwui-edit_item {
    margin-bottom: 24px;
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
    .qwui-content {
      position: relative;
      .qwui-content_edit {
        width: 100%;
        height: 32px;
        box-sizing: border-box;
        padding-left: 8px;
        padding-right: 45px;
        border-radius: 2px;
        border: 1px solid #d5d5d5;
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
  .content {
    display: flex;
    flex-direction: column;
    &-add {
      position: relative;
      display: block;
      width: 352px;
      flex: 1;
      padding: 16px 0;
      border: 1px dashed #d5d5d5;
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      p {
        text-align: center;
        font-family: MicrosoftYaHei;
        font-size: 10px;
        color: #999;
        line-height: 1.5em;
        &:first-child {
          color: #f87b00;
          font-size: 14px;
        }
      }
    }
    .content-img_wrap {
      width: 100px;
      height: 72px;
      position: relative;
      .content-pic {
        width: 100%;
        height: 100%;
      }
      .content-close {
        width: 20px;
        height: 20px;
        position: absolute;
        top: -6px;
        right: -6px;
      }
    }
  }
  .qwui-info_save {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    border: 0;
    width: 97px;
    height: 32px;
    color: #fff;
    background-color: #C31725;
    border-radius: 2px;
  }
}
</style>


