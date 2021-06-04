<template>
  <!-- 本地上传视频 -->
  <div class="qwui-upLoad_content">
    <div class="qwui-upLoad_mess">
      <div class="qwui-file_img"></div>
      <p class="qwui-file_name">{{videoItem.showName}}</p>
      <span class="qwui-file_size">{{videoItem.size}}</span>
      <span class="qwui-file_speed"
            v-if="!videoItem.finishFlag">{{videoItem.per}}%({{videoItem.speed}}KB/s)</span>
      <span class="qwui-file_speed qwui-error_tip"
            v-if="videoItem.errorFlag">上传失败,请重新删除上传</span>
      <div class="qwui-checkUpload"
           v-if="videoItem.finishFlag && !videoItem.errorFlag">
        <span class="qwui-file_speed">正在转码</span>
        <img src="~assets/images/loading.gif">
      </div>
    </div>
    <div class="qwui-upLoad_progress"
         :style="'width:'+videoItem.per+'%'"></div>
    <div class="qwui-upLoad_option">
      <img class="qwui-option_del"
           src="~assets/images/btn_close.png"
           @click="delVideo">
      <div class="qwui-del_tip"
           v-show="videoItem.delFlag">
        <div class="qwui-del_text">确认删除吗?</div>
        <div class="qwui-del_option">
          <span class="qwui-del_sure"
                @click="confirmDel(videoItem,videoIndex,true)">确定</span>
          <span class="qwui-del_cancel"
                @click="confirmDel(videoItem,videoIndex,false)">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  videoUpLoad,
  getTencentSign,
  checkMediaState
} from '@/module/crm/api/assistant/index.js'
import { mapMutations } from 'vuex'

export default {
  props: {
    videoItem: {
      type: Object,
      default: function() {
        return {}
      }
    },
    videoIndex: {
      type: Number
    }
  },
  data() {
    return {}
  },
  components: {},
  created() {
    //腾讯上传视频需要的变量,主要用来服务getSignature
    this.videoId = []
    this.upLoadFileName = ''

    //用于实现取消上传的两个对象,主要用来服务删除上传的时候
    this.uploadCos = {} //需要在 progress 回调中赋值
    this.uploadTaskId = {} //需要在 progress 回调中赋值

    this.checkMediaStateTimers = [] //是否转码完成的轮询定时器
  },
  methods: {
    ...mapMutations('assistant', ['setUploadCos', 'setUploadTaskId']),

    clearTimer(name) {
      clearInterval(this.checkMediaStateTimers[name])
    },
    //正在上传的视频删除确认框
    delVideo(index) {
      this.videoItem.delFlag = true;
      this.$emit('closeOtherDel',this.videoIndex);
    },
    //是否确认删除上传视频
    confirmDel(item, index, flag) {
      this.videoItem.delFlag = false;
      if (!flag) {
        return
      }

      this.$emit('delVideo', index)

      //删除对应视频模块的信息
      this.$delete(this.videoItem.op.detail[0].content, 'fileName')
      this.$set(this.videoItem.op.detail[0].content, 'fileSize', '')
      this.$set(this.videoItem.op.detail[0].content, 'upLoading', false)

      this.stopUpload(this.videoItem.idName)
    },
    stopUpload(name) {

      let that = this
      qcVideo.ugcUploader.cancel({
        cos: that.uploadCos[name],
        taskId: that.uploadTaskId[name]
      })
      clearInterval(this.checkMediaStateTimers[name])
    },
    //创建腾讯云视频上传记录
    start(temObj, needEncrypt) {
      let startDate = new Date()
      let fileSize = temObj.cur[2]

      this.videoId[temObj.idName] = temObj.id
      this.upLoadFileName = temObj.idName

      //创建视频记录
      let vobj = {
        userData: temObj.id,
        fileName: temObj.idName,
        fileSize: temObj.cur[2],
        agentCode: 'crm',
        needEncrypt: needEncrypt
      }

      videoUpLoad(vobj)
        .then(result => {
          if (result.code == '0') {
            this.qStartUpload(temObj.cur, startDate, temObj.idName)
            this.$emit('clearFileSelect')
          }
        })
        .catch(() => {})
    },

    //腾讯云视频上传逻辑
    qStartUpload(file, startDate, fileName) {
      let that = this
      let videoFile = file[0][0]

      qcVideo.ugcUploader.start({
        videoFile: videoFile,
        getSignature: that.getSignature,
        allowAudio: 1,
        success: function(result) {},
        error: function(result) {
          that.videoItem.finishFlag = true
          that.videoItem.errorFlag = true
        },
        progress: function(result) {

          that.uploadCos[fileName] = result.cos
          that.uploadTaskId[fileName] = result.taskId

          //需要共享的视频数据
          that.setUploadCos({ name: fileName, res: result.cos })
          that.setUploadTaskId({ name: fileName, res: result.taskId })

          that.videoItem.per = Math.floor(result.curr * 100)
          that.videoItem.upDataSize = file[2] * result.curr

          if (that.videoItem.per == 100) {
            that.videoItem.finishFlag = true
          } else {
            let endDate = new Date()
            let speed = (
              that.videoItem.upDataSize /
              (endDate.getTime() - startDate.getTime())
            ).toFixed(2)

            that.videoItem.speed = speed
          }
        },
        finish: function() {

          // that.videoItem.url = result.videoUrl

          that.checkMediaStateTimers[fileName] = setInterval(() => {
            let obj = { userData: that.videoId[fileName] }

            checkMediaState(obj)
              .then(res => {

                if (res.code == '0') {
                  var mediaState = res.data.mediaState

                  if (mediaState == 1) {


                    clearInterval(that.checkMediaStateTimers[fileName])

                    //控制上传中不能切换到线上视频区域
                    that.$set(
                      that.videoItem.op.detail[0].content,
                      'upLoading',
                      false
                    )
                    // that.$set(
                    //   that.videoItem.op.detail[0],
                    //   'title',
                    //   that.videoItem.url
                    // )

                    that.$set(that.videoItem.op.detail[0],'title',res.data.url);

                    that.$set(
                      that.videoItem.op.detail[0].content,
                      'mediaId',
                      that.videoItem.id
                    )
                    that.$set(
                      that.videoItem.op.detail[0].content,
                      'fileName',
                      that.videoItem.showName
                    )

                    //进度结束,关闭打开的删除确认框
                    that.$set(
                      that.videoItem,
                      'delFlag',
                      false
                    )

                    that.$set(that.videoItem.op.detail[0], 'display', '1')


                    //已经上传成功,删除上传进度条
                    that.$emit('delVideo',that.videoIndex);
                  } else if (mediaState == -1) {
                    clearInterval(that.checkMediaStateTimers[fileName])
                  }
                } else {
                  _.alert('提示', res.desc)
                }
              })
              .catch(() => {})
          }, 5000)
        }
      })
    },

    getSignature(callback) {
      let signobj = { busInf: this.videoId[this.upLoadFileName] }
      getTencentSign(signobj).then(res => {
        if (res.data && res.data.key) {
          callback(res.data.key)
        } else {
          this.videoItem.finishFlag = true
          this.videoItem.errorFlag = true
          return '获取签名失败'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.qwui-upLoad_show {
  position: absolute;
  right: 0;
  bottom: 21px;
  .qwui-upLoad_item {
    width: 643px;
    height: 53px;
    box-shadow: 0 0 10px #bbbbbb;
    position: relative;
    margin-bottom: 20px;
    background-color: #fff;
    .qwui-upLoad_content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: #333333;
      display: flex;
      align-items: center;
      .qwui-upLoad_mess {
        display: flex;
        align-items: center;
        z-index: 2;
        .qwui-checkUpload {
          display: flex;
          align-items: center;
          position: absolute;
          right: 60px;
          img {
            width: 20px;
            margin-left: 5px;
          }
        }
      }
      .qwui-file_img {
        width: 25px;
        height: 30px;
        background-image: url('~assets/images/file_type.png');
        background-repeat: no-repeat;
        background-position: 3px -157px;
        margin-left: 18px;
      }
      .qwui-file_name {
        margin-left: 10px;
      }
      .qwui-file_size {
        margin-left: 46px;
      }
      .qwui-file_speed {
        margin-left: 21px;
      }
      .qwui-error_tip {
        color: #ee5037;
      }
      .qwui-upLoad_progress {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: #e1ecff;
        z-index: 1;
      }
    }
    .qwui-upLoad_option {
      position: absolute;
      right: 19px;
      font-size: 0;
      top: 18px;
      z-index: 2;
      .qwui-option_del {
        width: 15px;
        height: 15px;
        cursor: pointer;
        margin-left: 17px;
      }
      .qwui-del_tip {
        font-size: 12px;
        background: #fff;
        color: #666;
        position: absolute;
        right: -12px;
        top: -117px;
        width: 196px;
        text-align: center;
        border-radius: 10px;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.15);
        padding: 24px 0 10px;
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
          border-top-color: #fff;
          border-bottom: none;
          bottom: -9px;
          right: 10px;
        }
      }
    }
  }
}
</style>
