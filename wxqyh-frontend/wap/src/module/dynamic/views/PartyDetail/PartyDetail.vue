<template lang="html">
<div class="wrap" v-qw-water-mark="{ agentCode: agentCode, isShow: isOpenWaterMark}">
  <div class="qwui-detail qwjs-detail" v-if="detail" ref="contentDetail">
    <qw-tweet class="qwui-tweet" :header="header" :content="content" :footer="footer" :tweetCheck="tweetCheck" :detail="detailContent" :isOpen="isOpen" ref="tweet"></qw-tweet>

    <div class="relate-wrapper" v-if="isShowDealer">
      <div class="relate">
        <div class="relate__title">涉及岗位(共{{userCount}}人)</div>
        <p class="relate__text" ref="relate-position" :class="{'hidden': isHideOverflowTextPost}">
          {{positionList.join('，')}}
        <div class="more" v-if="hasTextEllipsisPost">... <span class="blue" @click="handleClickMorePost">查看全部</span></div>
        </p>
      </div>

      <div class="relate">
        <div class="relate__title">涉及经销商(共{{dealerCount}}家)</div>
        <p class="relate__text" ref="relate-dealer" :class="{'hidden': isHideOverflowTextDealer}">
          {{dealerInfoList.join('，')}}
        <div class="more" v-if="hasTextEllipsisDealer">... <span class="blue" @click="handleClickMoreDealer">查看全部</span></div>
        </p>
      </div>
    </div>

    <!-- 回复评论 -->
    <list-comment :commentList="listComment" :hiddenSwitch="true" :totalRow="listTotalRows" :dealListDelete="dealListDelete" :dealListPass="dealListPass" @atThisPersonUtil="getCreatorDetail" @delete="deleteThisComment" @pass="passThisComment" v-if="showComment && isShowCommentBox"></list-comment>
    <!--评论加载更多-->
    <load-more v-if="showComment && isShowCommentBox" class="loadmore_wrap" :loading="loading" :hasMore="tempData.hasMore" type="commentList" @loadMoreClick="loadMore">
      <span>{{listTotalRows == 0 ? '暂无回复':'没有更多评论了'}}</span>
    </load-more>

    <!--外部单底部logo-->
    <div class="openfootercontent" v-if="isOpen&&detail.isShowFooter">
      <a class="openfooterlink" href="http://wbg.do1.com.cn/" target="_blank">
        <img src="~assets/images/newsmallLogo.svg" alt="">
        &nbsp;道一云|企微，让工作更简单
      </a>
    </div>

    <div class="qwui-tweet_comment qwui-chat-bottom" v-if="isShowCommentBox">
      <!--评论输入框-->
      <div class="qwui-input_div">
        <div class="qwui-input">
          <input type="text" readonly="readonly" placeholder="说点什么吧" @focus="showCommnetInput">
        </div>
      </div>
    </div>

    <!--评论弹窗-->
    <chat-comment :show.sync="showChatTool" :autofocus.sync="autofocus" :maxLength="300" :agent="agent" :dataBase="dataBase" @updateContent="sendComment"></chat-comment>

    <!--选择人组件-->
    <user-select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user-select>

    <!--个人信息-->
    <user-info ref="loadPersonalMsg"></user-info>

    <qw-share class="qwui-share" :period="5" v-if="isShowShare"></qw-share>

    <qw-third-part class="qwui-third_part" :link="info.thirdPartUrl" :text="info.thirdPartTips" v-if="info.msgType === 1"></qw-third-part>

    <div class="qwui-secret" ref="secret" v-if="info.isWatermark == '1' || info.isSecret == '1'"></div>
    <!--预览图片组件-->
    <previewImages></previewImages>
  </div>
  <div v-else class="qwui-norecord">
    <no-record :stepTop="true" :hasRecord="noRecord" v-show="isShowNoRecord">
      <!--操作按钮-->
      <button_group :fixed="true" slot="tip">
        <button_item type="default" text="返回" @buttonClick="goBack"></button_item>
      </button_group>
    </no-record>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import commentDetail from '../../js/detail'
import QwTweet from '../../components/tweet'
import listComment from '@/components/list/comment_list'
import chatComment from '@/components/detail/chatInput'
import userSelect from '@/components/base/user_or_dept_select'
import QwShare from '../../components/PartyDetail/share'
import QwThirdPart from '../../components/PartyDetail/thirdPart'
import eventBus from '@/utils/eventBus'
import userInfo from '@/components/detail/user_info_card' //个人信息
import NoRecord from '@/components/base/noRecord'
import button_group from '@/components/base/button/button_group'
import button_item from '@/components/base/button/button'
import previewImages from '@/components/base/previewImages'
import qwWaterMark from '@/directive/qwWaterMark'
import loadMore from '@/components/list/load_more'
import {
  addComment,
  auditComment,
  deleteComment,
  getMoreComment,
} from '../../api/getData.js'

// 全局变量引入
const _ = window._
const dataBase = window.dataBase

// 请求地址
const url = {
  dynamicinfoDetail: _.baseURL +
    '/portal/dynamicinfo/dynamicinfoAction!dynamicinfoDetail.action',
  updateEnable: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!updateEnable.action',
  setPraise: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!setPraise.action',
  getNextDynamic: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!getNextDynamic.action',
  auditDynamic: _.baseURL + '/portal/dynamicinfo/dynamicinfoAction!auditDynamic.action',
}

const openURL = {
  dynamicinfoDetail: _.baseURL + '/open/dynamicinfo/dynamicinfoAction!dynamicinfoDetail.action',
}

// 配置项
const SIZE = 10 // 每页评论数量
const TIMEOUT = 200 // 请求等待时间（超过显示loading）

// 错误码提示
var ERRORCODE = {
  11018: '本文章已关闭查阅',
  11011: '本文章已删除',
  11007: '您无权限查看本文章',
  11019: '本文章正在审核',
  11020: '本文章未通过审核',
  11002: '本文章为保密消息，只能在手机端打开',
  11021: '本文章为内部消息',
}

// 封装Ajax
Vue.use({
  install(vue, options) {
    let ajax = async (description, settings, errorCallback) => {
      let timer = setTimeout(() => {
        _.showLoading('正在' + description)
      }, TIMEOUT)

      let res = await axios(settings)

      clearTimeout(timer)

      _.hideLoading()
      if (res.code === '0') {
        return Promise.resolve(res)
      } else {
        if (errorCallback) {
          errorCallback(res)
        } else {
          _.alert('提示', res.desc)
          console.error(res.desc)
        }
        return res
      }
    }

    ajax.get = async (description, url, settings) => {
      return await ajax(description, {
        url,
        method: 'get',
        ...settings,
      })
    }

    ajax.post = async (description, url, data, settings, errorCallback) => {
      return await ajax(
        description, {
          url,
          data,
          method: 'post',
          ...settings,
        },
        errorCallback
      )
    }

    vue.prototype.$ajax = ajax
  },
})

export default {
  name: 'partDetail',
  components: {
    QwTweet,
    listComment,
    chatComment,
    userSelect,
    QwShare,
    QwThirdPart,
    userInfo,
    NoRecord,
    button_group,
    button_item,
    previewImages,
    loadMore,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    belongAgent: {
      type: String,
      default: 'dynamic',
    },
  },
  directives: {
    qwWaterMark,
  },
  data() {
    return {
      detail: undefined, // 详情数据,
      dataBase,
      page: 1, // 评论页数
      test: Math.random(),
      tempData: commentDetail.listComment,
      isShowShare: false,
      previewImageUrl: [],
      noRecord: {
        // 无详情页面显示的提示页面
        icon: 'qwui-icon_permission',
        title: '',
        text: '',
      },
      isShowNoRecord: false,
      agentCode: _.getUrlParam('agentCode') || 'dynamic',
      isOpenWaterMark: false, // 是否显示全局水印
      showChatTool: false, // 评论输入框组件是否显示
      autofocus: false, // 评论是否自动聚焦
      agent: _.getUrlParam('agentCode') || 'dynamic',
      commentObj: {
        // 保存选中的评论信息（作审核评论使用）
        obj: {},
        idx: '',
      },
      loading: false, // 评论loading
      lock_roll: false, // 评论列表滚动

      hasTextEllipsisPost: false,
      hasTextEllipsisDealer: false,
      isHideOverflowTextDealer: true,
      isHideOverflowTextPost: true,
      positionList: [],
      dealerInfoList: [],
      isShowFooter: false,
      isShowDealer: false,
    }
  },

  computed: {
    params() {
      return this.$route.query
    },
    info() {
      return this.detail.tbXyhDynamicinfoPO
    },
    // 水印 文本
    markText() {
      let text =
        this.isOpen && this.detail && this.detail.orgName ?
        this.detail.orgName :
        _.personName
      return text
    },
    // 推文ID
    id() {
      return this.info.dynamicInfoId
    },
    // 发布日期
    datetime() {
      let datetime = this.info.publishTime ?
        this.info.publishTime :
        this.info.createTime
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(datetime)) {
        return _.getFormatDate(
          new Date(datetime.replace(/-/g, '/')),
          'yyyy-MM-dd hh:mm'
        )
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(datetime)) {
        return datetime
      } else {
        throw Error(datetime)
      }
    },
    // 最后一次编辑人信息提示
    lastEditInfo() {
      let name = this.info.lastEditorPersonName
      let time = this.info.lastEditTime
      if (!name || name == '') {
        return ''
      } else {
        return `本内容最后由 ${name} 于 ${time} 编辑`
      }
    },
    // 数据整理
    // 头部信息
    header() {
      let header = {
        title: this.info.title,
        datetime: this.datetime,
        author: this.info.publisher,
        review: this.info.isEnable === 1,
        isAuthor: this.info.creator === wxqyhConfig.userId,
        contentType: this.info.contentType,
        creator: this.info.creator,
      }

      return header
    },

    // 主体内容
    content() {
      let localport = _.localport
      // 解决手机发布的动态替换行
      let contentHtml =
        this.info.contentType == '来自手机' ?
        _.checkURL(this.info.content, true, true) :
        _.checkURL(this.info.content, false, true)
      // 过滤百度编辑器中的script标签及其里面的内容
      if (this.info.msgType == 0) contentHtml = _.clearScript(contentHtml)
      let content = {
        content: contentHtml
          .replace(/http:\/\/qy\.do1\.com\.cn\:6090\/fileweb/g, localport)
          .replace(/@fileweb@/g, localport),
      }

      // 封面信息
      if (this.info.coverImage && this.info.isDisplayCoverImage == '0') {
        content.cover = {
          src: _.compressURL + this.info.coverImage,
          alt: this.info.title,
        }
      }
      // 图片列表
      if (this.detail.images && this.detail.images.length > 0) {
        content.images = this.detail.images
      }

      //被祝福者列表
      if (
        this.detail.blessAndEntryUserInfoPOList &&
        this.detail.blessAndEntryUserInfoPOList.length > 0
      ) {
        content.blessInfoPO = {
          sendType: this.info.sendType,
          blessAndEntryUserInfoPOList: this.detail.blessAndEntryUserInfoPOList,
        }
      }

      // 音频信息
      if (this.detail.videoPO) {
        content.music = {
          src: _.localport + this.detail.videoPO.url,
          filename: this.detail.videoPO.fileName,
        }
      }

      return content
    },

    //　主体内容
    detailContent() {
      let detailContent = {
        sendType: this.info.sendType,
        ext2: this.info.ext2,
        msgType: this.info.msgType,
        mergePeopleCount: this.info.mergePeopleCount,
        contentType: this.info.contentType,
        contentImage: this.info.contentImage,
        isDisplayCoverImage: this.info.isDisplayCoverImage,
        coverImage: this.info.coverImage,
        RedpackParamsVO: this.detail.RedpackParamsVO, // 红包
        isSecret: this.info.isSecret,
      }
      return detailContent
    },

    // 底部内容
    footer() {
      let footer = {
        label: this.info.dynamicType,
        viewCount: this.isOpen ?
          this.detail.openViewCounts : this.info.viewCount,
        subscribe: {},
        isOpen: this.info.isOpen,
        lastEditInfo: this.lastEditInfo,
      }

      let praisePager = this.detail.praisePager

      if (praisePager) {
        footer.subscribe = {
          hasSubscribe: this.detail.hasPraise || false,
          total: praisePager.totalRows,
          list: praisePager.pageData.map((value) => {
            return value.personName
          }),
        }
      }
      if (this.detail.mediaList) {
        footer.fileList = this.detail.mediaList.map((file) => {
          let src =
            url.downloadBaseUrl + file.url + '&fileFileName=' + file.fileName
          return {
            filename: file.fileName,
            preview: url.previewBaseUrl + src,
            size: file.fileSizeStr,
            ext: file.fileExt,
            src,
            id: file.id,
            url: file.url,
            erpNos: file.erpNos,
            isPointToPoint: file.isPointToPoint,
          }
        })
      }
      return footer
    },

    // 评论
    comment() {
      let comment = {
        commentCheck: {
          show: this.detail.isCommentReviewer === 1,
        },
        hasMore: this.detail.hasMore,
      }

      comment.comments = this.detail.comments.map((_comment) => {
        let checkStatus = 0

        // 审核状态
        if (comment.commentCheck.show) {
          if (_comment.isPassReview) {
            checkStatus = parseInt(_comment.isPassReview)
          }
        }

        return {
          avator: _comment.headPic,
          author: _comment.personName,
          created: _comment.time,
          content: _comment.content,
          isAuthor: _comment.userId === _.userId,
          checkStatus,
        }
      })

      return comment
    },

    // 动态审核
    tweetCheck() {
      if (this.isOpen) {
        return {
          show: false,
          status: 0,
          auditPerson: '',
        }
      }

      let tweetCheck = {
        show: this.detail.isDynamicReviewer === 1,
        status: this.info.isPassReview ? parseInt(this.info.isPassReview) : 0,
        auditPerson: this.info.auditPerson || '',
      }

      return tweetCheck
    },
    // 评论数
    listTotalRows() {
      return this.tempData.totalRows
    },
    // 评论数据
    listComment() {
      return this.tempData.comments
    },
    // 显示评论列表(非外部详情，开启外部显示评论)
    showComment() {
      return !this.isOpen || this.info.shareComment === '1'
    },
    // 显示底部评论框 （非外部详情，开启了评论，且该新闻已审核通过）
    isShowCommentBox() {
      return (
        !this.isOpen &&
        this.info.isComment === '0' &&
        this.info.isPassReview == '0'
      )
    },
  },
  methods: {
    //删除评论
    deleteThisComment(data, index) {
      let self = this
      // 是否评论审核人
      let isCommentCheck =
        this.comment.commentCheck.show && data.isPassReview == 1
      if (isCommentCheck) {
        self.auditComment(2, data.commentId, index, '删除成功')
      } else {
        deleteComment(
          self.belongAgent, {
            commentId: data.commentId,
          },
          (data) => {
            self.tempData.comments.splice(index, 1)
            self.tempData.totalRows--
          }
        )
      }
    },
    //是否通过评论
    passThisComment(data, index) {
      let self = this
      // 保存选中的评论
      self.commentObj = {
        obj: Object.assign({}, data),
        idx: index,
      }
      let btnConfig = {
        primaryBtn: {
          name: '确定',
          callBack: self.surePassComment,
        },
        defaultBtn: {
          name: '取消',
          callBack: null,
        }, //主操作按钮
      }
      _.alert('确定通过审批？', '审批通过后，用户将会看到该内容', btnConfig)
    },
    // 通过评论
    surePassComment() {
      let self = this
      this.auditComment(
        0,
        this.commentObj.obj.commentId,
        this.commentObj.idx,
        '已通过'
      )
    },
    // 审核评论 0-审核通过 2-审核删除
    auditComment(type, commentId, index, tips) {
      let self = this
      auditComment(
        self.belongAgent, {
          isPassReview: type,
          ids: commentId,
        },
        (data) => {
          if (type == 0) {
            self.tempData.totalRows++
            self.tempData.comments[index].isPassReview = 0
          } else {
            self.tempData.comments.splice(index, 1)
          }
          _.tooltips_succeed(tips)
        }
      )
    },
    //处理删除按钮显示方法
    dealListDelete(item) {
      // 评论审核人
      let isCommentCheck =
        this.comment.commentCheck.show && item.isPassReview == 1
      // 是否评论创建人
      let isCreator = item.userId == _.userId
      // 创建时间是否在30分钟内
      let isTime =
        item.time == '刚刚' ||
        (item.time.indexOf('分钟前') != -1 &&
          parseInt(item.time.split('分钟前')[0]) < 30)
      // 评论状态 1历史是已删除，2管理员删除
      let status = item.commentStatus != '2' || item.commentStatus != '1'
      if (!this.isOpen && (isCommentCheck || (isCreator && isTime && status))) {
        return true
      }
      return false
    },
    //　处理评论审批按钮显示
    dealListPass(item) {
      if (!this.isOpen && this.comment.commentCheck.show) {
        return item.isPassReview == 1
      }
      return false
    },
    // 发送评论
    sendComment(comment) {
      let self = this
      addComment({
          'comment.content': comment.content,
          'comment.dynamicinfoId': self.params.id,
          userIds: comment.userIds || '',
          userId: self.params.userId || _.userId,
          type: comment.type,
        },
        (data) => {
          let commentInfo = {
            userId: _.userId,
            commentId: data.id,
            headPic: _.headPic,
            personName: _.personName,
            creator: _.userId,
            type: comment.type,
            time: '刚刚',
            commentStatus: '0',
            isPassReview: data.isPassReview,
            content: comment.content,
          }
          self.tempData.totalRows++
          self.tempData.comments.splice(0, 0, commentInfo)
        }
      )
    },
    // 显示输入框组件
    showCommnetInput() {
      this.showChatTool = true
      this.autofocus = true
    },
    //加载更多
    loadMore() {
      if (this.tempData.hasMore && !this.loading) {
        this.getCommentList()
      }
    },

    // 滚动加载
    scrollList(e) {
      // 不显示评论列表，不允许加载
      if (!this.showComment) return
      var scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop
      if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
        if (!this.lock_roll && this.tempData.hasMore) {
          this.loadMore()
        }
      }
    },

    // 更多评论
    getCommentList() {
      let self = this
      self.loading = true
      self.lock_roll = true
      let params = {}
      // 处理内部和外部传参不同的
      if (self.isOpen) {
        params = {
          id: self.id,
          size: SIZE,
          page: ++self.page,
        }
      } else {
        params = {
          dynamicId: self.id,
          pageSize: SIZE,
          page: ++self.page,
          isCommentReviewer: self.detail.isCommentReviewer,
        }
      }
      getMoreComment(self.isOpen, self.belongAgent, params, (data) => {
        self.tempData.comments = self.tempData.comments.concat(data.comments)
        self.tempData.hasMore = data.hasMore
        self.loading = false
        self.lock_roll = false
      })
    },

    // 返回
    goBack() {
      var length = window.history.length
      //判断当前打开的页面的个数
      if (length < 2) {
        WeixinJSBridge.invoke('closeWindow', {})
      } else {
        this.$router.go(-1)
      }
    },
    // 添加水印
    addMark() {
      let self = this
      let canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d')

      canvas.width = 160
      canvas.height = 100

      ctx.fillStyle = 'rgba(204, 204, 204, 0.5)'
      ctx.font = '12px Microsoft YaHei lighter'
      ctx.rotate((-15 * Math.PI) / 180)
      ctx.fillText(this.markText, 20, 40)

      let img = canvas.toDataURL()
      this.$nextTick(() => {
        if (self.$refs.secret) {
          self.$refs.secret.style.backgroundImage = `url(${img})`
        }
      })
    },

    //分享链接，配文字图片
    shareLink: function () {
      _.checkApi.setDataForWeixinValue(
        this.header.title,
        this.info.coverImage == '' ?
        this.detail.logo :
        _.compressURL + this.info.coverImage,
        this.info.summary,
        window.location.href
      )
    },

    //获取创建人详情
    getCreatorDetail: function (creator) {
      if (creator) {
        this.$refs.loadPersonalMsg.showUserMessage(creator)
      }
    },

    _addComment({
      value,
      type,
      id
    }) {
      // this.$router.go(0);
    },

    /**
     *
     * 页面跳转
     * 1. 复制详情
     * 2. 编辑详情
     * 3. 预览文件
     * 4. 下载文件
     *
     **/

    // 1. 复制详情
    copyLink() {
      this.$router.push({
        path: '/publish',
        query: {
          isCopy: true,
          id: this.$route.query.id,
        },
      })
    },

    // 2. 编辑详情
    editeLink() {
      this.$router.push({
        path: '/publish',
        query: {
          id: this.$route.query.id,
        },
      })
    },

    // 3. 预览文件
    previewLink(file) {
      _.alert('提示', '预览功能尚未开发')
    },

    // 4. 下载文件
    downloadLink(file) {
      _.alert('提示', '下载功能尚未开发')
    },

    /**
     *
     * 异步请求
     * 1. 请求详情
     * 2. 修改查阅状态
     * 3. 修改点赞状态
     * 4. 获取邻近文章的ID
     * 10. 提交审核结果
     *
     **/

    // 1. 请求详情
    // load (id: String)
    // @param id: 详情ID
    async load(id) {
      let res = await this.$ajax.post(
        '加载详情',
        (this.isOpen ? openURL : url).dynamicinfoDetail, {
          id: id || this.params.id,
          size: SIZE,
          belongAgent: this.belongAgent,
        },
        '',
        (res) => {
          if (ERRORCODE[res.code]) {
            this.noRecord.title = ERRORCODE[res.code]
            this.noRecord.icon = 'qwui-icon_permission'
          } else {
            this.noRecord.title = '本文章已关闭查阅'
            this.noRecord.icon = 'qwui-icon_permission'
          }
          this.isShowNoRecord = true
          console.log(1111, res)
        }
      )
      this.detail = Object.assign({}, res.data)
      this.setRelatedData(res.data)
      return this.detail
    },

    // 2. 修改查阅状态
    // toggleCheckoutStatus (status: Number)
    // @param status: 查阅状态，0 关闭， 1 开启
    async toggleCheckoutStatus(status) {
      let res = await this.$ajax.post('修改查阅状态', url.updateEnable, {
        dynamicId: this.id,
        isEnable: status,
        belongAgent: this.belongAgent,
      })
      _.tooltips_succeed('操作成功')

      return (this.info.isEnable = status)
    },

    // 3. 修改点赞状态
    // toggleSubscribeStatus
    async toggleSubscribeStatus() {
      let res = await this.$ajax.post('修改点赞状态', url.setPraise, {
        id: this.id,
        belongAgent: this.belongAgent,
      })

      this.detail.praisePager = res.data.praisePager
      return (this.detail.hasPraise = res.data.hasPraise)
    },

    // 4. 获取邻近文章的ID
    // pageChange (type: String)
    // @param type: 类型，pre 上一篇， next 下一篇
    async pageChange(type) {
      let page = parseInt(this.params.page || 1),
        schType = this.params.schType,
        typeId = this.params.typeId,
        title = this.params.title,
        isPassReview = this.params.isPassReview,
        word

      if (schType === '' && typeId === '') {
        schType = '8'
        page = 1
      }

      if (type === 'pre') {
        word = '上'
        if (--page <= 0) {
          _.alert('提示', '已经是第一篇了')
          return
        }
      } else if (type === 'next') {
        word = '下'
        if (schType === 'other') {
          if (++page > 5) {
            _.alert('提示', '已经是最后一篇了')
            return
          }
        } else if (schType !== '8') {
          page++
        }
      }

      let res = await this.$ajax.post('加载中', url.getNextDynamic, {
        id: this.id,
        schType,
        typeId,
        page,
        type,
        title,
        isPassReview,
        belongAgent: this.belongAgent,
      })

      this.$router.push({
        path: '/partyDetail',
        query: {
          id: res.data.dynamicInfoId,
          schType,
          typeId,
          page,
          title,
          isPassReview,
        },
      })
      location.reload() //重新加载
      return this.id
    },

    // 10. 提交审核结果
    async checkResult(status) {
      let res = await this.$ajax.post(
        '提交审核结果',
        url.auditDynamic, {
          isPassReview: status,
          ids: this.info.dynamicInfoId,
          belongAgent: this.belongAgent,
        }, {},
        function (xx) {
          console.log(xx, '--')
        }
      )
      if (res && String(res.code) === '999') {
        _.alert('提示', '审核操作正在执行中，请稍后再试')
        return
      }
      // 缓存审批状态，审批通过跳转到已通过列表，审批不通过跳转到不通过列表
      sessionStorage.setItem('dynamicAudit', status == '0')
      this.$router.push({
        path: '/actionList',
        query: {
          data: 1,
        },
      })
    },

    setRelatedData(data = {}) {
      this.isShowDealer = data.isDynamicReviewer == 1
      this.positionList = data && data.position ? data.position : []
      this.dealerInfoList = data && data.group ? data.group : []
      // this.userCount = this.positionList.length;
      this.userCount = data.publishCount || 0
      this.dealerCount = data.groupCount || 0
      this.$nextTick(this.setTextEllipsis)
    },

    setTextEllipsis() {
      const relatePosition = this.$refs['relate-position']
      const relateDealer = this.$refs['relate-dealer']
      this.hasTextEllipsisPost =
        relatePosition.scrollHeight > relatePosition.clientHeight
      this.hasTextEllipsisDealer =
        relateDealer.scrollHeight > relateDealer.clientHeight
    },

    handleClickMorePost() {
      this.isHideOverflowTextPost = false
      this.hasTextEllipsisPost = false
    },

    handleClickMoreDealer() {
      this.isHideOverflowTextDealer = false
      this.hasTextEllipsisDealer = false
    },
  },
  async created() {
    eventBus.$off()

    // 绑定事件
    eventBus.$on('tweet-copy', () => {
      this.copyLink()
    })

    eventBus.$on('tweet-edite', () => {
      this.editeLink()
    })

    eventBus.$on('tweet-review', () => {
      let status = 0

      if (this.info.isEnable !== 1) {
        status = 1
      }

      this.toggleCheckoutStatus(status)
    })

    eventBus.$on('tweet-view-list', () => {
      if (!this.isOpen) {
        this.$router.push({
          path: '/viewList',
          name: 'view-list',
          query: {
            id: this.id,
          },
        })
        if (_.getUrlParam('agentCode') == 'partyconstruction') {
          this.$router.go(0)
        }
      }
    })

    eventBus.$on('tweet-subscribe', () => {
      this.toggleSubscribeStatus()
    })

    eventBus.$on('tweet-previous', () => {
      this.pageChange('pre')
    })

    eventBus.$on('tweet-next', () => {
      this.pageChange('next')
    })

    eventBus.$on('tweet-check-pass', () => {
      _.alert('确定通过审批？', '审批通过后，用户将会看到该内容', {
        defaultBtn: {
          name: '取消',
          callBack: null,
        },
        primaryBtn: {
          name: '确定',
          callBack: () => {
            this.checkResult(0)
          },
        },
      })
    })

    eventBus.$on('tweet-check-not-pass', () => {
      _.alert('确定不通过审批？', '审批不通过后，用户将无法看到该内容', {
        defaultBtn: {
          name: '取消',
          callBack: null,
        },
        primaryBtn: {
          name: '确定',
          callBack: () => {
            this.checkResult(2)
          },
        },
      })
    })

    eventBus.$on('tweet-share', () => {
      this.isShowShare = true
    })

    // 获取点赞人员列表
    eventBus.$on('tweet-praise', () => {
      this.$router.push({
        path: '/praiseList',
        query: {
          id: this.$route.query.id,
        },
      })
    })
    window.addEventListener('scroll', this.scrollList)
    // 加载数据
    await this.load()

    //如果是人资员工关怀跳转，且参数携带scrolltop为1，则滚动至评论处
    if (this.$route.query.scrolltop == 1) {
      this.$nextTick(function () {
        setTimeout(function () {
          let top = document.getElementsByClassName('qwui-commentList_box')[0]
            .offsetTop
          window.scrollTo(0, top)
        }, 1000)
      })
    }
    // 评论数据(监听到评论数据的变化)
    let comments = commentDetail.listComment;
    (comments.hasMore = this.detail.hasMore),
    (comments.totalRows = this.info.commentCount)
    comments.comments = this.detail.comments || []

    document.title = this.info.title

    this.addMark()

    // 手机端的分享链接
    if (_.isAndroid() || _.isIOS()) {
      this.shareLink()
    }

    // 判断显示全局水印,详情没开启水印，不是保密信息，不是外部分享
    this.isOpenWaterMark =
      this.info.isSecret != '1' && this.info.isWatermark != '1' && !this.isOpen
  },
  beforeDestroy() {
    //组件被停用(离开路由)
    window.removeEventListener('scroll', this.scrollList)
  },
  watch: {
    $route(to, from) {
      // 跳转至外部分享
      document.title = this.info.title
      if (
        to.path == '/open/detail' ||
        from.path == '/open/detail' ||
        to.name === from.name
      ) {
        location.reload()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.qwui-detail {
  position: relative;
  overflow: hidden;

  .qwui-secret {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    pointer-events: none;
  }

  .qwui-tweet {
    /deep/ .qwui-tweet_content_html {
      max-width: 100%;

      img {
        margin: 5px 0;
        max-width: 100%;
        vertical-align: middle;
      }

      .video_div {
        position: relative;
        margin-top: 5px;
      }

      .video_div_c {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3;
        background: url(~assets/images/audio_default.png) #fff no-repeat center;
        background-size: 100%;
      }
    }
  }

  .qwui-tweet_comment {
    /deep/ {
      .qwui-chat_comment_box {
        background: #fff;
      }
    }
  }

  .openfootercontent {
    width: 100%;
    padding: 0 0 10px;
    text-align: center;

    .openfooterlink {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999;

      img {
        width: 15px;
        height: 15px;
      }
    }
  }

  .loadmore_wrap {
    margin-bottom: 50px;
  }

  // 输入框样式
  .qwui-tweet_comment {
    display: flex;
    position: fixed;
    line-height: 50px;
    width: 100%;
    height: 50px;
    justify-content: space-between;
    bottom: 0;
    background: #fff;
    box-shadow: 0 -1px 10px 0 #e3e4e8;
    z-index: 4;

    .qwui-input_div {
      flex: 1;

      .qwui-input {
        display: flex;
        height: 38px;
        align-items: center;
        flex: 1;
        margin: 6px 15px;
        padding-left: 10px;
        border-radius: 5px;
        font-size: 15px;
        color: #b2b9c8;
        text-align: left;
        background: #f6f6fa;
        cursor: pointer;

        input {
          font-size: 14px;
          background: none;
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }

    .qwui-publish_btn {
      color: rgb(178, 185, 200);
      font-size: 16px;
      text-align: left;
      margin-right: 10px;
      margin-left: -5px;
      cursor: pointer;
    }
  }

  .relate-wrapper {
    background: #ffffff;
    padding-bottom: 15px;
  }

  .relate {
    margin: 0 15px 15px;
    position: relative;

    .more {
      background: #fff;
      position: absolute;
      box-shadow: -4px 0 4px 0 #fff;
      bottom: 0;
      right: 0;

      .blue {
        color: #5585f0;
      }
    }

    .relate__title {
      font-size: 15px;
      margin-bottom: 6px;
    }
  }

  .relate__text {
    text-align: justify;
    line-height: 18px;

    &.hidden {
      height: 36px;
      overflow: hidden;
    }
  }
}

@media screen and (min-width: 1024px) {
  .qwui-no_record_box.active {
    width: 740px;
    margin: -79px auto 0;
    left: 0;
    right: 0;
  }

  .qwui-secret {
    width: 740px;
    margin: 0 auto;
  }
}
</style>
