<template>
  <div class="video-controller">
    <div class="video-controller-content">
      <div class="title">视频来源
        <span class="qwui-title_warn"
              v-show="this.option.detail[0].content.upLoading">本地视频正在上传时,不能切换线上视频</span>
      </div>
      <div class="qwui-content">
        <div class="qwui-video_from">
          <input type="radio"
                 id="localVideo"
                 name="videoFrom"
                 value="1"
                 @click="videoWay('1')"
                 :disabled="this.option.detail[0].content.upLoading"
                 checked>
          <label for="localVideo">本地视频</label>
        </div>
        <div class="qwui-video_from">
          <input type="radio"
                 id="webVideo"
                 name="videoFrom"
                 value="2"
                 :disabled="this.option.detail[0].content.upLoading"
                 @click="videoWay('2')">
          <label for="webVideo">线上视频</label>
        </div>
      </div>
      <div class="qwui-video_type"
           v-show="videoType == 1">
        <div class="title qwui-title_tip"> 请选择 mp4 格式（注：wmv、avi 、rmvb 、mpg、flv格式视频，请先通过 "格式工厂" 等多媒体格式转换软件，转成 mp4格式再上传），文件大小不能超过100M</div>
        <p class="qwui-user_warn"
           v-show="this.option.detail[0].title">本地上传的视频会把线上视频路径覆盖,请悉知</p>
        <div class="content qwui-local_video">
          <label for="videoFile"
                 :style="{'color':isVip?'#F87B00':'#a6a6a6'}">+选择文件
            <input type="file"
                   id="videoFile"
                   @change="fileSelect"
                   ref="videoFile">
          </label>
          <!-- 本地已上传的视频列表 -->
          <div class="qwui-video_list"
               v-if="option.detail[0].content&&option.detail[0].content.fileName">
            <img src="~assets/images/icon_b-pro_video.png"
                 alt="">
            <div class="qwui-video_show">
              <span class="qwui-video_show_name">{{option.detail[0].content.fileName}}</span>
              <span class="qwui-video_show_size">{{option.detail[0].content.fileSize}}</span>
            </div>
            <img class="qwui-video_del"
                 src="~assets/images/icon_b-pro_delete.svg"
                 @click="delVideo"
                 v-if="!option.detail[0].content.upLoading"/>
            <div class="qwui-loading_tip"
                 v-if="option.detail[0].content.upLoading">上传中...</div>
            <div class="qwui-del_tip" v-show="videoDelFlag">
              <div class="qwui-del_text">确认删除吗?</div>
              <div class="qwui-del_option">
                <span class="qwui-del_sure"
                      @click.stop="confirmDel('1')">确定</span>
                <span class="qwui-del_cancel"
                      @click.stop="confirmDel('0')">取消</span>
              </div>
            </div>
          </div>
          <!-- 本地已上传的视频列表 -->
          <p class="qwui-vip_tip"
             v-show="!isVip">该功能仅限尊享版用户使用,<span class="qwui-buy_link" @click="buyVIP">马上升级尊享版 ></span>
          </p>
        </div>
      </div>

      <div class="qwui-video_type"
           v-show="videoType == 2">
        <div class="title"> 视频地址
          <span>*</span>
        </div>
        <div class="content">
          <span class="qwui-user_warn"
                v-show="option.detail[0].content.fileName">注意,请删除本地视频,再使用线上视频链接</span>
          <input type="text"
                 v-model="option.detail[0].title"
                 :disabled="option.detail[0].content.fileName">
        </div>
      </div>

    </div>
    <div class="video-controller-content">
      <div class="title">视频封面</div>
      <div class="content">
        <div class="content-add"
             @click="onSelectImg()"
             v-if="option.detail.length===0||!option.detail[0].picPath">
          <p>+添加视频封面</p>
          <p>尺寸600 x 400，JPG、 JPEG、PNG格式，文件大小不能超过2M</p>
        </div>
        <div class="content-imgs"
             v-else>
          <div class="content-imgs-item"
               v-for="(item,index) in option.detail"
               :key="index">
            <span class="icon-colse"
                  @click="remove(index)"></span>
            <img :src="item.picPath"
                 :alt="item.name">
          </div>
        </div>
      </div>
    </div>
    <QwUploadImg ref="QwUploadImg"
                 @imageObj="uploadSuccsee"
                 :upload-config="uploadconfig"></QwUploadImg>
  </div>
</template>
<script>
import QwUploadImg from '@/components/Add/uploadImg/QwUploadImg'
import {
  getFileType,
  convert_fileSize,
  getFileNameNotExt,
  uuid
} from '../../../uploadVideo/tencentUpLoad.js'
import { mapGetters } from 'vuex'

export default {
  name: 'videoController',
  props: {
    option: Object
  },
  components: {
    QwUploadImg
  },
  data() {
    return {
      uploadconfig: {
        uploadFileId: 'videoControllerInput', //input:file 的id
        showType: 'small', //展示图片的尺寸
        agent: 'crmmini', //哪个模块agent
        imageObj: {
          imageURL: '',
          fileName: ''
        }, //封面图片数据对象
        isMoreImg: false, //true：多图,false：封面图片
        moreList: [
          {
            imageURL: '',
            fileName: ''
          }
        ] //多图列表
      },
      //控制视频上传的方式
      videoType: '1',
      //删除已上传的本地视频操作框开关
      videoDelFlag:false
    }
  },
  computed: {
    ...mapGetters('assistant', ['isVip'])
  },
  created() {

    //新建的视频模块初始化
    if (!this.option.detail || this.option.detail.length === 0) {
      this.option.detail = [{}]
    }
    !this.option.detail[0].content ? this.$set(this.option.detail[0], 'content', {}) : undefined
  },
  mounted() {
    //非vip,不允许使用本地视频的选择文件按钮
    if (!this.isVip) {
      this.$refs.videoFile.setAttribute('disabled', true)
    }
  },
  methods: {
    buyVIP(){
      window.open(_.baseURL + "/vm/module/service.html#/open/home?type=viprespect_crmpackage");
    },
    videoWay(target) {
      if (this.videoType == target) {
        return
      }

      this.videoType = target
    },

    clearFileSelect() {
      this.$refs.videoFile.value = ''
    },
    onSelectImg() {
      this.$refs.QwUploadImg.showCutOutWindow()
    },
    uploadSuccsee(res) {
      this.$set(this.option.detail[0], 'picPath', _.compressURL + res.imageURL)
      this.$set(this.option.detail[0], 'picTitle', res.fileName)
    },
    remove() {
      this.$set(this.option.detail[0], 'picPath', '')
    },
    //本地视频选择
    fileSelect() {
      let files = this.$refs.videoFile.files

      //没有选择文件
      if (files.length < 1) {
        this.clearFileSelect()
        return
      }

      let fileName = files[0].name //文件名
      let size = files[0].size //文件大小
      let fileExt = getFileType(fileName) //文件后缀

      //格式判断
      if (fileExt == 'mp4') {
        //视频大小不能超过100M
        if (size > 104857600) {
          _.alert('提示', '视频大小不能超过100M,请重新选择')
          this.clearFileSelect()
          return
        }

        //视频正在上传的时候不允许再上传
        if (this.option.detail[0].content.upLoading) {
          _.alert('提示', '同一时间只能上传一个视频')
          this.clearFileSelect()
          return
        }
        //视频只能上传一个
        if (this.option.detail[0].content.fileName) {
          _.alert('提示', '只能上传一个视频,请删除后重新上传')
          this.clearFileSelect()
          return
        }

        let itemArr = [
          files,
          fileName + new Date().getTime(),
          size,
          fileExt,
          'video'
        ]
        this.uploadFn(itemArr)
      } else {
        _.alert('提示', '请选择MP4格式的视频文件')
        this.clearFileSelect()
      }
    },
    uploadFn(obj) {
      let formData = new FormData()
      let file = obj[0][0]
      formData.append('file', file)

      let size = obj[2]
      let sizeStr = convert_fileSize(size)
      let filename = file.name
      let uid = uuid()

      //上传中就赋值,用来显示正在上传哪些文件
      //控制上传中不能切换到线上视频区域
      this.$set(this.option.detail[0].content, 'upLoading', true)
      this.$set(this.option.detail[0].content, 'idName', obj[1])
      this.$set(this.option.detail[0].content, 'fileName', filename)
      this.$set(this.option.detail[0].content, 'fileSize', sizeStr)

      this.$emit('startVideoUpload', {
        idName: obj[1],
        showName: filename,
        id: uid,
        cur: obj,
        size: sizeStr,
        op: this.option
      })
    },
    delVideo() {
      this.videoDelFlag = true;
    },
    confirmDel(res){
      this.videoDelFlag = false;
      if(res === '0'){
        return;
      }

      this.$delete(this.option.detail[0].content, 'fileName')
      this.$set(this.option.detail[0].content, 'fileSize', '')
      this.$set(this.option.detail[0].content, 'upLoading', false)
      this.$set(this.option.detail[0], 'title', '')

      this.$set(this.option.detail[0], 'display', '0')
      this.$emit('removeVideo', this.option.detail[0].content.idName)

    }
  }
}
</script>
<style lang="scss" scoped>
.video-controller {
  width: 100%;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333;
  &-content {
    padding: 24px;
    &:first-child {
      border-bottom: 1px solid #f0f0f0;
    }
    .title {
      margin-bottom: 16px;
      span {
        color: #ee5037;
      }
      .qwui-title_warn {
        margin-left: 30px;
      }
    }
    .qwui-title_tip {
      color: #a6a6a6;
      font-size: 12px;
      line-height: 20px;
    }
    .content {
      display: flex;
      flex-direction: column;
      input {
        flex: 1;
        border: 1px solid #d5d5d5;
        padding: 8px;
        font-size: 12px;
        border-radius: 2px;
      }
      &-add {
        flex: 1;
        margin: 16px 0;
        padding: 16px 0;
        border: 1px dashed #d5d5d5;
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
      &-imgs {
        display: flex;

        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
          padding: 6px 6px 0 0;
          overflow: hidden;
          width: 167px;
          height: 94px;
          position: relative;
          img {
            max-width: 167px;
          }
          span {
            display: inline-block;
            background: url('~assets/images/icon_btn_close.png') no-repeat;
            position: absolute;
            width: 24px;
            height: 24px;
            top: 0;
            right: 0;
          }
        }
      }
    }
    .qwui-content {
      display: flex;
      margin-bottom: 12px;
      .qwui-video_from:first-child {
        margin-right: 52px;
      }
      input[type='radio'] {
        margin: 0;
        margin-right: 8px;
      }
      label {
        vertical-align: text-bottom;
      }
      input[type='radio']::before {
        margin-left: -1px;
        margin-top: -1px;
      }
    }
    .qwui-local_video {
      label {
        border: 1px dashed #d5d5d5;
        position: relative;
        padding: 15px 0;
        text-align: center;
        font-size: 14px;
        color: #a6a6a6;
        overflow: hidden;
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          opacity: 0;
        }
      }
      .qwui-vip_tip {
        font-size: 12px;
        color: #a6a6a6;
        margin-top: 4px;
        span {
          color: #f87b00;
          margin-left: 6px;
        }
        .qwui-buy_link {
          cursor: pointer;
        }
      }
    }
  }
  .qwui-video_list {
    height: 68px;
    background: #fcfcfc;
    border: 1px solid #e1e1e1;
    margin-top: 12px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    position: relative;
    border-radius: 2px;
    img {
      width: 38px;
      height: 44px;
      display: inline-block;
    }
    .qwui-video_show {
      margin-left: 13px;
      display: flex;
      flex-direction: column;
      font-size: 14px;
      .qwui-video_show_name {
        color: #383838;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 225px;
      }
      .qwui-video_show_size {
        color: #808080;
      }
    }
    .qwui-video_del {
      position: absolute;
      right: 13px;
      width: 17px;
      height: 17px;
      cursor: pointer;
    }
    .qwui-loading_tip {
      position: absolute;
      right: 10px;
      font-size: 12px;
    }
  }
  .qwui-user_warn {
    color: #ee5037;
    margin-bottom: 5px;
    font-size: 12px;
  }
  .qwui-del_tip {
    font-size: 12px;
    background: #fff;
    color: #666;
    position: absolute;
    top: 56px;
    right: 0;
    width: 196px;
    text-align: center;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.15);
    z-index: 2;
    border-radius: 4px;
    padding: 24px 0 20px;
    .qwui-del_text {
      text-align: left;
      padding-left: 24px;
    }
    .qwui-del_option {
      margin-top: 17px;
      .qwui-del_sure {
        margin: 0 5px;
        background: #f08d00;
        display: inline-block;
        cursor: pointer;
        width: 60px;
        height: 32px;
        line-height: 32px;
        vertical-align: middle;
        color: #fff;
        border-radius: 5px;
      }
      .qwui-del_cancel {
        margin: 0 5px;
        background: #fff;
        cursor: pointer;
        display: inline-block;
        width: 58px;
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
    }
    &::after {
      content: '';
      position: absolute;
      border: 9px solid #fff;
      border-color: transparent;
      border-bottom-color: #fff;
      border-top: none;
      right: 13px;
      top: -9px;
    }
  }
}
</style>
<style lang="scss">
.video-controller {
  .qwui-upload_item {
    position: absolute;
    opacity: 0;
  }
}
</style>


