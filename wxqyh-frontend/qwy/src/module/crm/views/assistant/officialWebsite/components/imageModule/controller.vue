<template>
  <div class="image-controller">
    <div class="image-controller-content">
      <div class="title">
        选择模板
      </div>
      <div class="model">
        <div class="model-item"
             v-for="(item,index) in models"
             :key="index"
             @click="onClickItme(index)"
             :active="option.display==index">
          <img :src="item.icon"
               :alt="item.label">
          <span>{{item.label}}</span>
        </div>
      </div>
    </div>
    <div class="image-controller-content">
      <div class="title">
        图片内容
      </div>
      <div class="image-content">
        <div class="image-content-add">
          <label>
            <p>+添加图片</p>
            <p>建议宽度750像素，JPG /PNG /JPEG格式，大小不超过2M</p>
            <input type="file"
                   ref="inputFile"
                   @change="fileChange"
                   multiple="multiple"
                   accept="image/jpeg,image/jpg,image/png,image/gif">
          </label>
        </div>
        <div class="image-content-imgs">
          <div class="image-content-imgs-item"
               v-for="(item,index) in option.detail"
               :key="index">
            <span class="icon-colse"
                  @click="remove(index)"></span>
            <div class="image-content-imgs-item-loading"
                 v-if="item.loadStatus==='loading'">
              <i></i>
            </div>
            <label class="image-content-imgs-item-loadfail"
                   v-else-if="item.loadStatus==='loadfail'">
              <p>上传失败</p>
              <p>点击重新上传</p>
              <input type="file"
                     :ref="'reuploadFile'+index"
                     @change="reupload(index)"
                     accept="image/jpeg,image/jpg,image/png,image/gif">
            </label>
            <img :src="item.picPath"
                 alt="item.name"
                 v-else>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageController',
  props: {
    option: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      models: [
        {
          icon: require('assets/images/icon_imgModel0.png'),
          label: '单行'
        },
        {
          icon: require('assets/images/icon_imgModel1.png'),
          label: '轮播图'
        },
        {
          icon: require('assets/images/icon_imgModel2.png'),
          label: '横向滑动'
        }
      ],
      imageUploadPathPC:
        '/imageupload/imageUploadAction!doUploadMgrImageBase64.action' //pc端上传图片接口
    }
  },
  methods: {
    onClickItme(index) {
      this.$set(this.option, 'display', index)
    },
    //上传图片
    uploadImage(base64, name, index) {
      _.ajax({
        url: _.baseURL + this.imageUploadPathPC,
        type: 'post',
        data: {
          imgFileBase: base64,
          agent: 'crmmini'
        },
        success: result => {
          console.log(index)
          if (result.code === '0') {
            this.$set(this.option.detail, index, {
              picTitle: name,
              picPath: _.compressURL + result.data.imgurl
            })
          } else {
            this.$set(this.option.detail[index], 'loadStatus', 'loadfail')
            dataBase.top_alert(res.desc, false, 2000)
          }
        },
        error: function() {
          this.$set(this.option.detail[index], 'loadStatus', 'loadfail')
          _.alert('提示', '网络错误')
        }
      })
    },
    fileChange() {
      let files = this.$refs.inputFile.files
      if (
        !Object.values(files).every(file => {
          return this.fileSizeJudpe(file)
        })
      ) {
        dataBase.top_alert(
          '文件大小不能超过' + 2 + 'M，请重新选择',
          false,
          3000
        )
        return
      }
      Object.values(files).forEach((file, index) => {
        this.option.detail.push({ loadStatus: 'loading' })
        const _index = this.option.detail.length - 1
        let reader = new FileReader()
        reader.onload = e => {
          this.uploadImage(e.target.result, file.name, _index)
        }
        reader.readAsDataURL(file)
      })
    },
    //图片大小是否合格
    fileSizeJudpe(file) {
      var baseSize = 1048576
      let size = 2
      if (file.size > size * baseSize) {
        return false
      }
      return true
    },
    remove(index) {
      this.option.detail.splice(index, 1)
    },
    //重新上传
    reupload(index) {
      let file = this.$refs['reuploadFile' + index][0].files[0]
      if (!this.fileSizeJudpe) {
        dataBase.top_alert(
          '文件大小不能超过' + 2 + 'M，请重新选择',
          false,
          3000
        )
      } else {
        let reader = new FileReader()
        reader.onload = e => {
          this.uploadImage(e.target.result, file.name, index)
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.image-controller {
  width: 100%;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333;
  &-content {
    padding: 24px;
    overflow-x: hidden;
    &:first-child {
      border-bottom: 1px solid #f0f0f0;
    }
    .title {
      margin-bottom: 16px;
    }
    .model {
      display: flex;
      &-item {
        width: 64px;
        height: 56px;
        display: flex;
        padding: 8px;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        img {
          width: 64px;
          height: 32px;
        }
        span {
          font-size: 12px;
        }
        &[active='true'] {
          border-radius: 4px;
          background: #f6f6f8;
        }
      }
    }
    .image-content {
      &-add {
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
        input {
          position: absolute;
          opacity: 0;
        }
      }
      &-imgs {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
          margin: 6px 0;
          width: 167px;
          min-height: 94px;
          position: relative;
          img {
            max-width: 167px;
            min-width: 167px;
          }
          span {
            display: inline-block;
            background: url('~assets/images/icon_btn_close.png') no-repeat;
            position: absolute;
            width: 24px;
            height: 24px;
            top: -6px;
            right: -6px;
          }
          &-loading {
            background: #f0f0f0;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
              display: inline-block;
              width: 24px;
              height: 24px;
              background: url('~assets/images/loading.png') no-repeat;
              background-size: contain;
              animation: rotate 1s infinite;
            }
            @keyframes rotate {
              from {
                transform: rotate(0);
              }
              to {
                transform: rotate(360deg);
              }
            }
          }
          &-loadfail {
            background: #f0f0f0;
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-size: 12px;
            color: #333;
            input {
              position: absolute;
              opacity: 0;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.image-controller {
  .image-content-imgs {
    .qwui-upload_item {
      .qwui-upload {
        display: none;
        // position: absolute;
        // opacity: 0;
        // pointer-events: none;
      }
    }
  }
}
</style>

