<template>
  <div class="director-feedback">
    <div class="header">经销商反馈</div>

    <div class="lebel">培训照片</div>
    <div class="upload__wrapper">
      <add-img-list v-if="imgUploadPicList.length"
        agent="reportcard"
        :imageList="imgUploadPicList"
        @handleDeleteImage="handleDeleteImage"
        :disabled="isDisabled">
      </add-img-list>
      <add-img agent="reportcard"
        v-if="!isDisabled"
        :imageList="imgUploadPicList"
        :camera="camera"
        :deleteImage="deleteImage"
        @updateImageList="setImgUploadValue">
      </add-img>
    </div>

    <div class="lebel">整改附件</div>
    <div class="upload__wrapper">
      <addFileList agent="reportcard"
        v-if="fileUpload.mediaList.length"
        :filesList="fileUpload.mediaList"
        :deleteFile="!isDisabled"
        :downLoad="true"
        :groupId="getId"
        @deleteFileItem="deleteFileItem">
      </addFileList>
      <addFile :agent="'reportcard'"
        v-if="!isDisabled"
        :filesList="fileUpload.mediaList"
        :orderId="getId"
        @updateFileList="showMsgFromFileDetail">
      </addFile>
    </div>

    <button :disabled="isDisabled" @click="handleSubmit"
      class="submit">整改结果反馈</button>
  </div>
</template>

<script>
import addFile from '@/components/add/upload/add_file'
import addFileList from '@/components/add/upload/addFileList'
import addImg from '@/components/add/upload/add_img'
import addImgList from '@/components/add/upload/imgList'

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    imgs: {
      type: Array,
      default() {
        return []
      }
    },
    files: {
      type: Array,
      default() {
        return []
      }
    },
    reportCardId: {
      type: String,
      default() {
        return ''
      }
    }
  },
  components: {
    addFile,
    addFileList,
    addImgList,
    addImg
  },
  data() {
    return {
      trainingFiles: [],
      deleteImage: {},
      content: '',
      fileUpload: {
        mediaList: [], // 编辑/复制等存在的原数据
        url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
      },
      imgUploadPicList: [],
      camera: ['album', 'camera']
    }
  },
  created(){

    this.content = this.feedback || '';
    this.fileUpload.mediaList = this.files;
    this.imgUploadPicList = this.imgs.map(item => {
        return Object.assign({}, item, { src: item.url })
      })
  },
  computed: {
    getId() {
      return this.reportCardId || ''
    },
    isDisabled(){ // 1 有投资意见 0 无投资意见
      if(typeof this.info.chiefCheckStatus === 'undefined'){
        return true;
      }else{
        return this.info.chiefCheckStatus === 1;
      }
    }
  },
  watch: {
    feedback(value) {
      this.content = value
    },
    files(value) {
      this.fileUpload.mediaList = value
    },
    imgs(val) {
      this.imgUploadPicList = val.map(item => {
        return Object.assign({}, item, { src: item.url })
      })
    }
  },
  methods: {
    showMsgFromFileDetail() {},
    deleteFileItem() {},
    setImgUploadValue() {},

    // 图片删除
    handleDeleteImage(item) {
      this.deleteImage = item
    },

    handleSubmit() {
      const files = this.fileUpload.mediaList.map(item => item.url)
      const fileNames = this.fileUpload.mediaList.map(item => item.fileName)
      const imgs = this.imgUploadPicList.map(item => item.src)
      this.$emit('submit', {
        fileNames: fileNames,
        files: files,
        imgs: imgs
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.director-feedback {
  .upload__wrapper {
    padding: 0 27px;
    margin-bottom: 10px;
  }
  /deep/ {
    .qw-upload-list {
      display: flex;
      padding: 0 27px;
    }
    .qw-upload-list__item {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      margin-bottom: 10px;
      flex-wrap: wrap;
      justify-content: flex-start;
      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      position: relative;
    }
    .qw-upload-list__item-name {
      display: none;
    }

    .qw-upload-list__item-actions {
      display: none;
    }
    .qw-upload-list__item-del {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
  }

  background: #ffffff;
  padding-bottom: 22px;
  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(20, 30, 40, 1);
    padding-bottom: 11px;
    padding-left: 26px;
    padding-top: 16px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      display: block;
      height: 16px;
      border-radius: 2px;
      width: 4px;
      top: 50%;
      background-color: #c6001f;
      top: 21px;
      left: 18px;
    }
  }
  .lebel {
    height: 19px;
    font-size: 17px;
    padding-left: 26px;
    font-weight: 400;
    line-height: 23px;
    color: rgba(102, 102, 102, 1);
    padding-bottom: 10px;
  }
  .upload-btn {
    margin-left: 26px;
    margin-bottom: 16px;
    width: 25px;
    height: 25px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(208, 208, 208, 1);
    opacity: 1;
    border-radius: 3px;
    background-size: 20px 20px;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url('~@/module/channelManagement/static/images/icon_paper_clip.png');
  }

  .text {
    margin: 10px 26px 20px;
    background: rgba(255, 255, 255, 1);
    position: relative;
    & > textarea {
      width: calc(100% - 16px);
      padding: 8px;
      min-height: 78px;
      border: 1px solid rgba(208, 208, 208, 1);
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(208, 208, 208, 1);
    }
  }
  .submit {
    display: block;
    width: 113px;
    height: 28px;
    background: rgba(39, 129, 219, 1);
    opacity: 1;
    border-radius: 4px;
    color: #fff;
    border: 1px solid rgba(39, 129, 219, 1);
    text-align: center;
    margin: 0 auto;
    line-height: normal;
  }
  button.submit[disabled]{
    background: #eee;
    border: #aaa;
    color: #999;
  }
}
</style>
