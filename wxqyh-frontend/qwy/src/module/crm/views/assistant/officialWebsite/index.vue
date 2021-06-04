<template>
  <div class="official-website">
    <div class="official-website-header">
      <div class="official-website-header-center container">
        <div class="left">
          <qwui-button @click="goBack()">返回</qwui-button>
        </div>
        <div class="center">
          编辑官网
        </div>
        <div class="right">
          <qwui-button @click="showPreview=true">预览</qwui-button>
          <qwui-button type='primary'
                       @click="save()">保存</qwui-button>
        </div>
      </div>
    </div>
    <div class="official-website-body container">
      <div class="left">
        <div class="left-header">
          组件
        </div>
        <Draggable class="left-body"
                   :list="componentList"
                   :options="{group:{name:'website',pull:'clone',put:'false',revertClone:true},sort:false}"
                   :clone="updateList">
          <div class="left-body-button"
               v-for="(item,index) in buttons"
               :key="index"
               @click="onClickComponent(item)">
            <img :src="item.icon"
                 :alt="item.label">
            <span>{{item.label}}</span>
          </div>
        </Draggable>
      </div>
      <div class="center">
        <div class="center-header">
        </div>
        <Draggable class="center-body"
                   :list="list"
                   :options="{group: 'website',sort:true}">
          <div class="center-module"
               v-for="(item,index) in list"
               :key="index+''+list.length"
               :active="active===index"
               @click="handleClickModule(index)">

            <qw-popover ref="beforeAddPopover"
                        v-if="active===index&&active!==0"
                        placement="top"
                        :gutter="-28"
                        :show-arrow="false">
              <div slot="content"
                   class="add-popover">
                <span :data-title="button.label"
                      v-for="(button,vIndex) in buttons"
                      :key="vIndex"
                      @click.stop="handleBeforeAdd(button,index)">
                  <img :src="button.icon"
                       :alt="button.label">
                </span>
              </div>
              <span class="center-module-beforeAdd"></span>
            </qw-popover>

            <qw-popover ref="rmPopover"
                        v-if="active===index"
                        placement="left">
              <div slot="content"
                   class="remove-popover"
                   :class="index===0?'first-remove-popover':''">
                <div class="tips">确认要删除？</div>
                <div class="btns">
                  <qwui-button @click="handleRemove(index,list[index])"
                               type='primary'>删除</qwui-button>
                  <qwui-button @click="$refs.rmPopover[0].toggle(false)">取消</qwui-button>
                </div>
              </div>
              <span class="center-module-remove"></span>
            </qw-popover>

            <div class="center-module-content">

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

            <qw-popover ref="afterAddPopover"
                        v-if="active===index"
                        placement="bottom"
                        :gutter="-28"
                        :show-arrow="false">
              <div slot="content"
                   class="add-popover afterAdd-popover">
                <span :data-title="button.label"
                      v-for="(button,vIndex) in buttons"
                      :key="vIndex"
                      @click.stop="handleAfterAdd(button,index)">
                  <img :src="button.icon"
                       :alt="button.label">
                </span>
              </div>
              <span class="center-module-afterAdd"></span>
            </qw-popover>

          </div>
        </Draggable>
      </div>
      <div class="right">
        <div class="right-header">
          {{currentComponent}}
        </div>
        <div class="right-body">
          <template v-if="list[active]">
            <address-controller v-if="list[active].type==='address'"
                                :option="list[active]"
                                :key="active"></address-controller>

            <email-controller v-else-if="list[active].type==='email'"
                              :option="list[active]"
                              :key="active"></email-controller>

            <image-controller v-else-if="list[active].type==='image'"
                              :option="list[active]"
                              :key="active"></image-controller>

            <info-controller v-else-if="list[active].type==='info'"
                             :option="list[active]"
                             :key="active"></info-controller>

            <phone-controller v-else-if="list[active].type==='phone'"
                              :option="list[active]"
                              :key="active"></phone-controller>

            <textarea-controller v-else-if="list[active].type==='textarea'"
                                 :option="list[active]"
                                 :key="active">
            </textarea-controller>

            <title-controller v-else-if="list[active].type==='title'"
                              :option="list[active]"
                              :key="active"></title-controller>

            <video-controller v-else-if="list[active].type==='video'"
                              :option="list[active]"
                              :key="active"
                              ref="videoDom"
                              @startVideoUpload="startVideoUpload"
                              @removeVideo="removeVideo"></video-controller>

          </template>
        </div>
      </div>
      <!-- 腾讯云上传视频 -->
      <div class="qwui-upLoad_show">
        <transition-group name="slide-left">
          <div class="qwui-upLoad_item"
               v-for="(item,index) in tencentUpload.upList"
               :key="item.id">
            <videoUpload :videoItem="item"
                         :videoIndex="index"
                         ref="uploadVideo"
                         @closeOtherDel="closeOtherDel"
                         @delVideo="delVideo"
                         @clearFileSelect="clearFileSelect"></videoUpload>
          </div>
        </transition-group>
      </div>
      <!-- 腾讯云上传视频 -->
    </div>
    <Preview v-model="showPreview"
             :list="list"
             @on-click-save="save"></Preview>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import Preview from './components/preview'
import QwPopover from 'module/crm/components/qwPopover'
import QwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'

import AddressView from './components/addressModule/view'
import AddressController from './components/addressModule/controller'
import EmailView from './components/emailModule/view'
import EmailController from './components/emailModule/controller'
import ImageController from './components/imageModule/controller'
import ImageView from './components/imageModule/view'
import InfoController from './components/infoModule/controller'
import InfoView from './components/infoModule/view'
import PhoneView from './components/phoneModule/view'
import PhoneController from './components/phoneModule/controller'
import SublineView from './components/sublineModule/view'
import TextareaController from './components/textareaModule/controller'
import TextareaView from './components/textareaModule/view'
import TitleView from './components/titleModule/view'
import TitleController from './components/titleModule/controller'
import VideoController from './components/videoModule/controller'
import VideoView from './components/videoModule/view'
import check from './mixins/check'

import videoUpload from './components/videoUpload/videoUpload'
import {
  saveHomeTemplate,
  getHomeBuildDetail
} from '@/module/crm/api/assistant/index.js'

import $ from 'jquery'
import { loadJS } from '../uploadVideo/tencentUpLoad.js'
import { isVipGold } from '@/assets/js/vip-manager'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    Draggable,
    QwPopover,
    QwuiButton,
    Preview,

    AddressView,
    AddressController,
    EmailView,
    EmailController,
    ImageController,
    ImageView,
    InfoController,
    InfoView,
    PhoneController,
    PhoneView,
    SublineView,
    TextareaController,
    TextareaView,
    TitleView,
    TitleController,
    VideoView,
    VideoController,
    videoUpload
  },
  mixins: [check],
  data() {
    return {
      buttons: [
        {
          icon: require('assets/images/icon_component_image.png'),
          label: '图片',
          type: 'image'
        },
        {
          icon: require('assets/images/icon_component_title.png'),
          label: '标题',
          type: 'title'
        },
        {
          icon: require('assets/images/icon_component_font.png'),
          label: '富文本',
          type: 'textarea'
        },
        {
          icon: require('assets/images/icon_component_video.png'),
          label: '视频',
          type: 'video'
        },
        {
          icon: require('assets/images/icon_component_info.png'),
          label: '资讯',
          type: 'info'
        },
        {
          icon: require('assets/images/icon_component_phone.png'),
          label: '电话',
          type: 'phone'
        },
        {
          icon: require('assets/images/icon_component_email.png'),
          label: '邮箱',
          type: 'email'
        },
        {
          icon: require('assets/images/icon_component_address.png'),
          label: '地址',
          type: 'address'
        },
        {
          icon: require('assets/images/icon_component_line.png'),
          label: '辅助线',
          type: 'subline'
        }
      ],
      list: [],
      active: 0,
      showPreview: false,
      tencentUpload: {
        upList: []
      }
    }
  },
  computed: {
    ...mapGetters('assistant', ['isVip', 'uploadCos', 'uploadTaskId']),

    currentComponent() {
      if (this.list.length === 0) {
        return ''
      }
      let _currentComponent =
        this.buttons.filter(item => {
          if (this.list[this.active]) {
            return item.type === this.list[this.active].type
          }
          return false
        })[0] || {}
      return _currentComponent.label || '--'
    },
    componentList() {
      return this.buttons.map(item => {
        return {
          type: item.type,
          detail: [],
          display: 0
        }
      })
    }
  },
  watch: {
    active(val) {
      try {
        this.$nextTick(() => {
          let el = document.querySelectorAll('.center-module')[val]
          el && el.scrollIntoViewIfNeeded && el.scrollIntoViewIfNeeded()
        })
      } catch (error) {
        console.error(error)
      }
    }
  },
  created() {
    window.$ = $

    //判断是否为金卡,开启本地视频上传功能
    this.setVipFlag(isVipGold(interfaceCode.INTERFACE_CODE_CRMMINI))

    //获取模板数据
    getHomeBuildDetail().then(res => {
      if (res.code === '0') {
        this.list = res.data.templateJson
      } else {
        dataBase.top_alert(res.desc, false, 3000)
      }
    })

    //加载腾讯
    loadJS('//imgcache.qq.com/open/qcloud/js/vod/sdk/ugcUploader.js')
  },
  methods: {
    ...mapMutations('assistant', ['setVipFlag']),

    handleClickModule(index) {
      this.active = index

      //点击编辑区的删除按钮时,关闭上传进度的操作窗口
      this.tencentUpload.upList.forEach((val, index) => {
        val.delFlag = false
      })
    },
    handleBeforeAdd(button, index) {
      this.list.splice(index, 0, {
        type: button.type,
        detail: [],
        display: 0
      })
      this.active = index
      this.$refs.beforeAddPopover[0].toggle(false)
    },
    handleAfterAdd(button, index) {
      this.list.splice(index + 1, 0, {
        type: button.type,
        detail: [],
        display: 0
      })
      this.active = index + 1
      this.$refs.afterAddPopover[0].toggle(false)
    },
    handleRemove(index, target) {
      if (this.active > 0) {
        this.active--
      }
      this.list.splice(index, 1)
      this.$refs.rmPopover[0].toggle(false)

      //删除展示区的视频模块
      if (target.type == 'video') {
        let name = target.detail[0].content.idName
        if (!name) {
          return
        }

        //删除已经上传完成的视频模块时,防止删除正在上传的列表
        let delIndex = this.findUploadIndex(name)
        if (typeof delIndex != 'undefined') {
          this.$refs.uploadVideo[0].stopUpload(name)
          this.tencentUpload.upList.splice(delIndex, 1)
        }
      }
    },
    onClickComponent(item) {
      this.list.splice(this.active + 1, 0, {
        type: item.type,
        detail: [],
        display: 0
      })
      this.active++

      //点击编辑区的删除按钮时,关闭上传进度的操作窗口
      this.tencentUpload.upList.forEach((val, index) => {
        val.delFlag = false
      })
    },
    goBack() {
      //退出时清空所有的上传操作
      this.tencentUpload.upList.forEach((val, index) => {
        let that = this
        qcVideo.ugcUploader.cancel({
          cos: that.uploadCos[val.idName],
          taskId: that.uploadTaskId[val.idName]
        })
        this.$refs.uploadVideo[0] &&
          this.$refs.uploadVideo[0].clearTimer(val.idName)
      })

      this.$router.go(-1)
    },
    save() {
      //正在上传的本地视频不允许保存
      let upFlag = this.tencentUpload.upList.some((val, index) => {
        return val.successFlag == false
      })
      if (upFlag) {
        _.alert('提示', '请先等待视频上传结束或者取消上传再进行保存')
        return
      }

      Promise.all(
        this.list.map((item, index) => {
          return this.check(item, index)
        })
      )
        .then(res => {
          return saveHomeTemplate({ templateJson: JSON.stringify(this.list) })
        })
        .then(res => {
          if (res.code == '0') {
            if (this.showPreview) this.showPreview = false
            dataBase.top_alert('保存成功', true, 3000)
          } else {
            dataBase.top_alert(res.desc, false, 3000)
          }
        })
        .catch(err => {
          if (this.active === err.index) {
            try {
              let el = document.querySelectorAll('.center-module')[this.active]
              el && el.scrollIntoViewIfNeeded && el.scrollIntoViewIfNeeded()
            } catch (error) {}
          }
          this.active = err.index
          dataBase.top_alert(err.desc, false, 3000)
        })
    },
    //拖拽深拷贝数据
    updateList(value) {
      return JSON.parse(JSON.stringify(value))
    },
    //解决选择同一文件不生效问题
    clearFileSelect() {
      this.$refs.videoDom.clearFileSelect()
    },
    //找出哪个上传条需要删除的索引
    findUploadIndex(name) {
      let indexNumber
      this.tencentUpload.upList.some((val, index) => {
        if (val.idName == name) {
          indexNumber = index
          return true
        }
      })
      return indexNumber
    },
    //删除已上传的本地视频
    removeVideo(name) {
      let that = this
      qcVideo.ugcUploader.cancel({
        cos: that.uploadCos[name],
        taskId: that.uploadTaskId[name]
      })
    },
    //删除正在上传视频的进度条
    delVideo(index) {
      this.tencentUpload.upList.splice(index, 1)
    },
    closeOtherDel(index) {
      this.tencentUpload.upList.forEach((val, index) => {
        val.delFlag = false
      })
      this.tencentUpload.upList[index].delFlag = true
    },
    startVideoUpload(target) {
      let temObj = {
        //视频标识符
        id: target.id,
        //文件对象
        cur: target.cur,
        //文件名字,带时间戳作为特殊名字
        idName: target.idName,
        //当前操作的对象
        op: target.op,
        //文件名字,不带时间戳
        showName: target.showName,
        //文件大小
        size: target.size,
        //进度百分比
        per: '0',
        //速度
        speed: '',
        upDataSize: 0,
        //地址
        url: '',
        //封面
        pic: '',
        //上传失败
        errorFlag: false,
        //上传结束
        finishFlag: false,
        //上传成功
        successFlag: false,
        //删除按钮开关
        delFlag: false
      }
      this.tencentUpload.upList.unshift(temObj)
      // this.tencentUpload.upList.push(temObj);

      // 腾讯云视频上传
      this.$nextTick(() => {
        this.$refs.uploadVideo[this.tencentUpload.upList.length - 1].start(
          temObj,
          0
        )
        // this.$refs.uploadVideo[0].start(temObj,0);
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.official-website {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
  font-size: 14px;
  color: #333;
  font-family: MicrosoftYaHei;
  &-header {
    height: 50px;
    width: 100%;
    background-color: #fff;
    &-center {
      font-size: 16px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .center {
        margin-right: 30px;
      }
      .right {
        button:first-child {
          margin-right: 16px;
        }
      }
    }
  }
  &-body {
    font-size: 14px;
    color: #333;
    display: flex;
    flex: 1;
    margin-top: 22px;
    background-color: #fff;
    align-items: flex-start;
    justify-content: flex-end;
    overflow: hidden;
    .left {
      width: 176px;
      box-shadow: 0 0 10px 0 rgba(62, 70, 84, 0.15);
      border-radius: 4px;
      margin: 70px 70px 0 0;
      &-header {
        height: 40px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-body {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 16px 16px 8px;
        &-button {
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 32px;
            height: 32px;
          }
          span {
            color: #666666;
            font-size: 12px;
          }
          &:hover {
            background: #f6f6f8;
            border-radius: 4px;
          }
        }
      }
    }
    .center {
      width: 330px;
      height: 570px;
      // border: 1px solid #ddd;
      margin: 12px 90px 0 0;
      border-radius: 4px;
      box-shadow: 0 0 10px 0 rgba(62, 70, 84, 0.15);
      display: flex;
      flex-direction: column;
      &-header {
        width: 100%;
        height: 64px;
        background: url('~assets/images/img_xw_toolbar.png') no-repeat;
        background-size: contain;
      }
      &-body {
        padding-top: 5px;
        overflow-y: auto;
        overflow-x: hidden;
        flex: 1;
      }
      &-module {
        position: relative;
        width: 320px;
        margin: 0 auto;
        padding: 5px 0;
        min-height: 16px;
        border: 1px solid transparent;
        &:hover {
          border-radius: 4px;
          border: 1px dashed rgba(56, 179, 237, 1);
        }
        &[active='true'] {
          border-radius: 2px;
          box-shadow: 0 0 0 2px #26a1dc;
          border: 1px solid transparent;
        }
        &-afterAdd,
        &-beforeAdd {
          position: absolute;
          display: inline-block;
          width: 48px;
          height: 32px;
          left: 135px;
          z-index: 2;
        }
        &-beforeAdd {
          top: -16px;
          background: url('~assets/images/icon_btn_add.png') no-repeat;
          background-size: contain;
        }
        &-afterAdd {
          bottom: -19px;
          background: url('~assets/images/icon_btn_add.png') no-repeat;
          background-size: contain;
        }
        &-remove {
          position: absolute;
          display: inline-block;
          width: 24px;
          height: 24px;
          background-size: cover;
          z-index: 9;
          right: 0;
          top: 0;
          background: url('~assets/images/icon_btn_close.png') no-repeat;
        }
        .remove-popover {
          font-size: 12px;
          padding: 10px;
          background-color: #fff;
          box-shadow: 0 0 10px 0 rgba(62, 70, 84, 0.3);
          border-radius: 4px;
          .btns {
            margin-top: 10px;
            display: flex;
            button {
              font-size: 12px;
              &:first-child {
                margin-right: 10px;
              }
            }
          }
          &.first-remove-popover {
            margin-top: 55px;
          }
        }
        .add-popover {
          width: 300px;
          height: 32px;
          box-shadow: 0px 2px 6px 0px rgba(62, 70, 84, 0.3);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          background-color: #fff;
          span {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 20px;
              padding: 5px;
            }
            &:hover {
              background-color: #f0f0f0;
              &::after {
                content: attr(data-title); //取到data-title属性的值
                display: inline-block;
                padding: 2px 5px;
                border: 1px solid #ddd;
                background-color: #fff;
                border-radius: 4px;
                position: absolute;
                width: max-content;
                top: 35px;
                left: -6px;
                font-size: 10px;
              }
            }
          }
          &.afterAdd-popover {
            span:hover::after {
              top: -30px;
            }
          }
        }
      }
    }
    .right {
      width: 400px;
      height: 100%;
      box-shadow: 0 0 10px 0 rgba(62, 70, 84, 0.15);
      display: flex;
      flex-direction: column;
      &-header {
        height: 40px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-body {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
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
      transform: translateX(0);
    }
  }
  .slide-left-enter-active {
    transition: all 0.5s ease;
  }
  .slide-left-leave-active {
    transition: all 0.5s ease;
  }
  .slide-left-enter {
    transform: translateX(647px) !important;
  }
  .slide-left-leave-active {
    transform: translateX(647px) !important;
  }
}

/*滚动条*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  border: 0;
  box-shadow: 0;
  border-radius: 10px;
  background: #fff;
}

::-webkit-scrollbar-thumb {
  border: 0;
  border-radius: 10px;
  background: #d7d7d7;
}

::-webkit-scrollbar-thumb:hover {
  background: #d7d7d7;
}
</style>
