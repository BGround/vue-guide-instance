<template>
  <div class="wrap qwui-chat_container">
    <div ref="chatContent" class="qwui-chat_content" :class="{'iosScrollFixed':iosScrollFixed}" id="qwui-chat_content" @touchstart="blur" @mousedown="blur">
    <chat-scroll ref="chatScroll" :topMethod="topMethod" :topMethodFlag="topMethodFlag" :topDistance="30">
      <div class="qwui-chat_section"
           v-if="messages.length"
           v-for="(item,index) in messages"
           :key="item.id"
           :id="'messItem'+index">
        <template v-if="item.sendType === '1'">
          <receive-post-message v-if="item.type === '4'"
                                :message="item"></receive-post-message>
          <receive-message v-if="item.type === '1'"
                           :message="item"></receive-message>
          <receive-img-message v-if="item.type === '2'"
                               :message="item"
                               @openPreivew="openPreivew"></receive-img-message>
          <receive-phone-number v-if="item.type === '7'"
                                :message="item"></receive-phone-number>
        </template>
        <template v-if="item.sendType === '0'">
          <send-message v-if="item.type === '1'"
                        :message="item"></send-message>
          <send-img-message v-if="item.type === '2'"
                            :message="item"
                            @openPreivew="openPreivew"></send-img-message>
        </template>
        <system-message v-if="item.type === '5'"
                        :message="item"></system-message>
      </div>
    </chat-scroll>
    </div>
    <div class="qwui-chat_message">
      <input-textarea class="qwui-chat_textarea"
                      v-model="message"
                      :autosize="{ minRows:1, maxRows:10 }"
                      :rows="1"
                      ref="input"
                      :maxLength="maxLength"
                      @click.native="handleInputFix"
                      @blur="blurInput"
                      @keydown.native="inputWay"
                      @keyup.native="posCursor">
      </input-textarea>
      <div class="qwui-chat_control">
        <img src="~assets/images/crm/icon_dialog_emoji.png"
             @click="handleShowEmoji"
             alt="" />
        <x-button v-if="message"
                  class="qwui-chat_send"
                  @click.native="sendMessage(1)"
                  type="primary">发送</x-button>
        <template v-else>
          <img src="~assets/images/crm/icon_dialog_more.png"
               :class="[moreActive ? 'active' : '']"
               @click="handleShowMore"
               alt="" />
        </template>
      </div>
    </div>
    <div v-if="emojiconActive"
         class="qwui-emoji_set">
      <swiper :options="swiperOption"
              style="height:150px">
        <swiper-slide v-for="(item,ind) in emojiList"
                      :key="ind">
          <div class="qwui-emoji_wrap">
            <span class="qwui-emoji_item"
                  v-for="(_item,_ind) in item"
                  @click="handleClickEmoji(_item.value)"
                  :key="_ind">{{_item.value}}</span>
          </div>
        </swiper-slide>
        <div class="swiper-pagination qwui-dots"
             slot="pagination"></div>
      </swiper>
    </div>
    <div v-if="moreActive"
         class="qwui-photo_set">
      <div v-if="isMobile"
           class="qwui-chat_photo"
           @click="handleMobileChooseImg(['album'])">
        <img class="qwui-photo"
             src="~assets/images/crm/icon_dialog_images.png"
             alt="">
        <p class="qwui-photo_text">照片</p>
      </div>
      <label v-else
             class="qwui-chat_photo qwui-chat_pc_photo">
        <img class="qwui-photo"
             src="~assets/images/crm/icon_dialog_images.png"
             alt="">
        <p class="qwui-photo_text">照片</p>
        <input @change="handleWebChooseImg"
               type="file"
               accept="image/jpeg,image/jpg,image/png,image/gif" />
      </label>
      <div class="qwui-chat_photo"
           @click="handleMobileChooseImg(['camera'])">
        <img class="qwui-photo"
             src="~assets/images/crm/icon_dialog_camera.png"
             alt="">
        <p class="qwui-photo_text">拍摄</p>
      </div>
      <div class="qwui-chat_photo"
           @click="handleShowDialog">
        <img class="qwui-photo"
             src="~assets/images/crm/icon_dialog_recent.png"
             alt="">
        <p class="qwui-photo_text">常用语</p>
      </div>
    </div>
    <!--预览图片组件-->
    <preview-images></preview-images>
    <!-- 弹窗组件 -->
    <scroll-dialog title="常用语"
                   :visible="scrollDialogVisible"
                   @close="handleScrollDialogClose">
      <scroll ref="tipscroll"
              :data="tips"
              class="qwui-tip_scroll"
              :pullUpLoad="wordConfig.pullUpLoad"
              @pullingUp="onPullingUp">
        <div class="qwui-tip_section"
             v-if="tips.length">
          <div class="qwui-tip_item"
               v-for="(item,index) in tips"
               :key="index"
               @click="sendWord(item.context)">{{item.context}}</div>
        </div>
        <div class="qwui-tip_default"
             v-else>
          <img src="~assets/images/crm/Rectangle.png"
               alt="">
          <span class="qwui-tip_default_tip1">管理自己的常用话术</span>
          <span class="qwui-tip_default_tip2">跟客户一对一沟通时，减少重复输入</span>
          <x-button class="qwui-tip_default_button" @click.native="goWordsAdd">添加常用话术</x-button>
        </div>
      </scroll>
    </scroll-dialog>
    <div class="chatLoad-mask" v-show="handleFlag"></div>
  </div>
</template>

<script>
import Scroll from '../../../components/Scroll/index'
import ScrollDialog from '../../../components/ScrollDialog/index'
import { XButton } from 'vux'
import ReceiveMessage from './components/ReceiveMessage'
import ReceiveImgMessage from './components/ReceiveImgMessage'
import ReceivePostMessage from './components/ReceivePostMessage'
import SendMessage from './components/SendMessage'
import SendImgMessage from './components/SendImgMessage'
import SystemMessage from './components/SystemMessage'
import ReceivePhoneNumber from './components/ReceivePhoneNumber'
import { formatTime } from '../../../utils'
import { searchChatList, getChatId, getWordsList } from '../../../api/smallProgram/getBata.js'
import { qw_uploadImages, wx_chooseImage } from '@/utils/uploadImages.js'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import InputTextarea from '@/components/input/inputTextarea'
import previewImages from '@/components/base/previewImages'
import EventBus from '@/utils/eventBus';
import chatScroll from './components/chatScroll';
import {emoji} from '../toolJS/emoji.js';
var isIE = !(!document.all);

export default {
  components: {
    XButton,
    ReceiveMessage,
    ReceiveImgMessage,
    ReceivePostMessage,
    SendMessage,
    SendImgMessage,
    SystemMessage,
    ReceivePhoneNumber,
    Scroll,
    ScrollDialog,
    swiper,
    swiperSlide,
    InputTextarea,
    previewImages,
    chatScroll
  },
  data() {
    return {
      searchQuery: {
        pageSize: 20,
        sort: '',
        id: ''
      },
      pullDownRefresh: true,
      websocket: null,
      messages: [],
      message: '',
      emojiconActive: false,
      moreActive: false,
      agent: 'crmmini',
      emojiList: emoji(),
      isMobile: false, //默认不是手机端
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        }
      },
      maxLength: Number.POSITIVE_INFINITY,
      scrollDialogVisible: false,
      tips: [],
      wordConfig:{ //话术加载相关定义
        pullUpLoad: true,
        pageCurrent: 1, //当前页码
        pageMax: 0, //最大页码
        pageSize: 20 //一次请求几条数据
      },
      inputHeight:0,
      topMethodFlag:true,
      firstGetMessageFlag:true,
      recordTop: 0,
      iosScrollFixed:false,
      handleFlag: false
    }
  },
  computed: {
    query() {
      return {
        chatId: this.searchQuery.id,
        userId: _.userId
      }
    }
  },
  destroyed() {
    this.websocket.close()
    window.onkeydown = null
    clearInterval(this.scrollint)
  },
  created() {
    this.cursorObj = {};
    // 判断是否手机终端
    if(_.isHefeixin()|| _.isWeChatApp()||_.isQiyeweixinApp() || _.isMobileApp()){
      this.isMobile=true;
    }
    this.initChatId().then(() => {
      this.initChatList()
      this.createWebsocket()
      this.getWords({
        page: this.wordConfig.pageCurrent,
        pageSize: this.wordConfig.pageSize
      })
    });

    //手机端的输入法弹出处理
    if(this.isMobile){
      window.onresize = () => {
        this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
      }
    }

    // 处理打开标签输入表情之后,焦点会消失,按enter键无法发送
    this.enterflag = true;
    if(!this.isMobile){
      window.onkeydown = (event) => {
        
        if(event.keyCode === 17){
          this.enterflag = false;
        }
        if(event.keyCode == 13) {
          if(this.emojiconActive){
            if(this.enterflag){
              event.preventDefault();
              this.sendMessage(1);
            }
          } 
        }
      }
    }
  },
  methods: {
  // 计算光标位置
    posCursor(){  
      let start=0,end=0;   
      let oTextarea = document.querySelector('.qwui-chat_textarea').children[0]; 
      if(isIE){  
        //或从控件选中区中创建 controlRange 集合。  
        let sTextRange= document.selection.createRange();  

        //判断选中的是不是textarea对象  
        if(sTextRange.parentElement()== oTextarea){  
          //创建一个TextRange对象  
          let oTextRange = document.body.createTextRange();  
          //移动文本范围以便范围的开始和结束位置能够完全包含给定元素的文本。  
          oTextRange.moveToElementText(oTextarea);  

          //这里我们比较oTextRange和sTextRange的开头，的到选中区域的开头位置  
          for (start=0; oTextRange.compareEndPoints("StartToStart", sTextRange) < 0; start++){   
            oTextRange.moveStart('character', 1);   
          }  
          //需要计算一下\n的数目(按字符移动的方式不计\n,所以这里加上)   
          for (let i = 0; i <= start; i ++){  
            if (oTextarea.value.charAt(i) == '\n'){   
              start++;   
            }  
          }   
          //再计算一次结束的位置  
          oTextRange.moveToElementText(oTextarea);   
          for (end = 0; oTextRange.compareEndPoints('StartToEnd', sTextRange) < 0; end ++){  
            oTextRange.moveStart('character', 1);  
          }  
          for (let i = 0; i <= end; i ++){  
            if (oTextarea.value.charAt(i) == '\n'){   
              end++;   
            }  
          }  
        }  
      }else{  
        start = oTextarea.selectionStart;  
        end = oTextarea.selectionEnd;  
      }
      this.cursorObj.start = start;
      this.cursorObj.end = end;
      return this.cursorObj; 
    },
    // 光标定位  
    moveCursor(position){ 
        var oTextarea = document.querySelector('.qwui-chat_textarea').children[0];   
        var start = position + 1;
        var end = position + 1;
        if(isIE){  
          var oTextRange = oTextarea.createTextRange();  
          var LStart = start;  
          var LEnd = end;  
          var start = 0;  
          var end = 0;  
          var value = oTextarea.value;  
          for(var i=0; i<value.length && i<LStart; i++){  
            var c = value.charAt(i);  
            if(c!='\n'){  
              start++;  
            }  
          }  
          for(var i=value.length-1; i>=LEnd && i>=0; i--){  
            var c = value.charAt(i);  
            if(c!='\n'){  
              end++;  
            }  
          }  
          oTextRange.moveStart('character', start);  
          oTextRange.moveEnd('character', -end);  
          oTextRange.select();  
          oTextarea.focus();  
        }else{  
          oTextarea.select();  
          oTextarea.selectionStart=start;  
          oTextarea.selectionEnd=end;  
        }  
    },
    setStr(str,indexs,target){
      let temStr=str;
      let p = temStr.substr(0,indexs);
      p = p + target;
      let s = temStr.substr(indexs,temStr.length);
      return (p + s);
      
    },
    setStrEmoji(str,indexs,target){
      let temStr=str;
      this.cursorObj.start++;
      let p = temStr.substr(0,this.cursorObj.start);
      p = p + target;
      let s = temStr.substr(this.cursorObj.start,temStr.length);
    },
    inputWay(event){
      if(this.isMobile){
        return;
      }
      this.posCursor();
     
      if(event.ctrlKey && event.keyCode == 13){
        
        this.message = this.setStr(this.message,this.cursorObj.start,'\n');
        let temStart = this.cursorObj.start;
        setTimeout(() => {
          this.moveCursor(temStart);
        },100)
        
      }else if(event.keyCode == 13){
        event.preventDefault();
        this.sendMessage(1);
      }
    },
    // 初始查询ChatId
    initChatId() {
      return new Promise(resolve => {
        const query = this.$route.query
        if (query.chatId) {
          this.searchQuery.id = query.chatId
          resolve()
        } else if (query.openId) {
          getChatId({ openId: query.openId }, res => {
            this.searchQuery.id = res.chatId
            resolve()
          })
        } else {
          _.alert('提示', '页面查询参数错误！')
          resolve()
        }
      })
    },
    // 初始化查询
    initChatList() {
      this.searchChatList().then(() => {
        // this.toScroll()
      })
    },
    // 查询历史消息
    searchChatList() {
      return new Promise(resolve => {
        searchChatList(this.searchQuery, res => {
          // 记录加载前的遮罩
          this.handleFlag = false;

          let temNum = res.pageData.length;
          if(!temNum){
            this.topMethodFlag = false;
          }

          document.title = res.name
          let data = res.pageData.reverse()
          if (this.messages.length) {
            data.push(...this.messages)
          }
          this.messages = data;

          this.$refs.chatScroll.onTopLoaded();
          
          this.$nextTick(() => {
            //scrollIntoView定位
            let el = document.getElementById('messItem'+(temNum-1))
            el&&el.scrollIntoView(true);
          })

          this.messages[0] && (this.searchQuery.sort = this.messages[0].sort)
          res.currPage === res.maxPage && (this.pullDownRefresh = false)
          resolve()
        })
      })
    },
    //获取常用话术
    getWords(requestParam){
      getWordsList(requestParam,(res) => {
        if(!res.pager.pageData.length){
          return;
        }
        this.tips = this.tips.concat(res.pager.pageData);
        this.wordConfig.pageMax = res.pager.totalPages;
      });
    },
    // 建立websocket通信
    createWebsocket() {
      const URL = `${_.websocketPort}/chat-Refresh-websocket/web/${
        this.query.chatId
      }/${this.query.userId}`

      this.websocket = new WebSocket(URL)

      this.websocket.onopen = () => {
        this.onWebsocketMessage()
      }

      // this.toScroll()
    },
    // 接受websocket通知消息
    onWebsocketMessage() {
      this.websocket.onmessage = res => {
        let result = JSON.parse(res.data)
        if (result.code === '200' && result.data) {
          this.emojiconActive = false
          this.moreActive = false
          const data = JSON.parse(res.data)
          this.messages.push(data.data)

          //定位到列表底部
          setTimeout(() => {
            this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
          },20);

        } else {
          _.alert('提示', '发送失败')
        }
      }
    },
    // 发送消息
    sendMessage(type, imgPath) {
      // 禁止发送空消息 禁止重复发消息
      if (type === 1 && !this.message.trim()) return
      let message
      if (type === 1) {
        message = this.message
      } else if (type === 2) {
        message = imgPath
      } else {
        return
      }
      const data = { type, message }
      this.websocket.send(JSON.stringify(data))
      this.message = '';
    },
    // 滚动
    toScroll() {
    
      document.getElementById('messItem'+(this.messages.length-1)).scrollIntoView(); 
    },
    // 解决输入法遮挡输入框的问题
    handleInputFix() {
      this.posCursor();

      // 手机端避免输入法和表情同时出现
      if(this.isMobile){
        this.emojiconActive = false
        this.moreActive = false
      }
      

      //苹果手机部分输入法会挡住那个input聊天框
      this.scrollint = null
      if (_.isIOS()) {
        this.scrollint = setInterval(() => {
          document.body.scrollTop = document.body.scrollHeight
        }, 500)
      }

      //PC端输入框聚焦将聊天列表滑动到最底部
      if(!this.isMobile){
        this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
      }

      this.toScroll();
    },
    // 失去焦点之后
    blurInput() {
      clearInterval(this.scrollint)
    },
    // 展示Emoji表情
    handleShowEmoji() {
      this.emojiconActive = !this.emojiconActive
      this.moreActive = false;

      //定位到列表底部
      setTimeout(() => {
        this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
      },300);
    },
    // 展示更多操作面板
    handleShowMore() {
      this.moreActive = !this.moreActive
      this.emojiconActive = false;
      
       //定位到列表底部
      setTimeout(() => {
        this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
      },300);
    },
    // 移动端选择图片上传图片
    handleMobileChooseImg(type) {
      wx_chooseImage(
        this.agent,
        res => {
          this.sendMessage(2, res[0])
        },
        1,
        type
      )
    },
    // PC端上传图片
    handleWebChooseImg(event) {
      qw_uploadImages(event, this.agent, res => {
        this.sendMessage(2, res.imgurl)
      })
    },
    handleClickEmoji(emoji) {
     
      // this.message = this.setStr(this.message,this.cursorObj.start,emoji);
      this.message = this.message + emoji;
      this.enterflag = true;
    },
    //点击聊天区域,触发input框失焦点
    blur() {
      this.$refs.input.blur()
      this.emojiconActive = false
      this.moreActive = false
    },
    openPreivew(res) {
      EventBus.$emit('previewImages', res, [{ src: res }])
    },
    // 打开常用话术弹窗
    handleShowDialog() {
      this.scrollDialogVisible = true
    },
    // 关闭常用话术弹窗
    handleScrollDialogClose() {
      this.scrollDialogVisible = false
    },
    //跳转话术添加页面
    goWordsAdd(){
      this.$router.push({name: 'words',params:{openAddFlag:true}});
    },
    //发送话术
    sendWord(mess){
      this.message = mess;
      this.sendMessage(1);
      this.handleScrollDialogClose();
    },
    onPullingUp(){
      if(this.wordConfig.pageCurrent >= this.wordConfig.pageMax){
        this.wordConfig.pullUpLoad = false;
        return;
      }
      this.wordConfig.pageCurrent++;
      this.getWords({
        page: this.wordConfig.pageCurrent,
        pageSize: this.wordConfig.pageSize,
      });
    },
    topMethod(){
      this.iosScrollFixed = false;
      this.handleFlag = true;
      this.searchChatList()
    }
  },
  mounted(){
    this.inputHeight = document.querySelector('.qwui-chat_message').clientHeight;
    this.recordHeight;
    //苹果系统判断是否滚动到顶部
    this.targetBox = this.$refs.chatContent;
    this.targetBox.addEventListener('scroll',() => {
      if(this.iosScrollFixed){
        if(this.targetBox.scrollTop > this.recordHeight){
          this.iosScrollFixed = false;
        }
        return;
      }
      if(this.targetBox.scrollTop < 20){
        this.recordHeight = this.targetBox.scrollTop;
        this.iosScrollFixed = true;
      }
    });
  },
  watch:{
    //处理聊天框变高时,聊天列表要滑到最底部
    message(newVal,oldVal){
      this.inputHeight = document.querySelector('.qwui-chat_message').clientHeight;
    },
    //处理聊天框变高时,聊天列表要滑到最底部
    inputHeight(newVal,oldVal){
      if(newVal > 50 ){
        this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
      }
    }
  },
  destroyed(){
    window.onresize = null;
  }
}
</script>

<style lang="scss">
.qwui-chat_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
  .qwui-chat_content {
    background-color: #f7f8fa;
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    .qwui-chat_time {
      width: 100%;
      height: 24px;
      text-align: center;
      font-size: 12px;
      line-height: 24px;
      color: #a2a4a7;
      margin: 10px 0;
    }
    .qwui-chat_section {
      width: 100%;
      height: auto;
    }
  }
  .iosScrollFixed {
    -webkit-overflow-scrolling: auto;
  }
  .qwui-chat_message {
    width: 100%;
    min-height: 50px;
    background-color: #fff;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f7f8fa;
    .qwui-chat_input {
      width: 80%;
      height: 35px;
      font-size: 14px;
      margin: 8px 15px;
      padding: 0;
      background-color: #f7f8fa;
      border-radius: 5px;
    }
    .qwui-chat_textarea {
      width: 80%;
      font-size: 14px;
      margin: 8px 15px;
      padding: 2px;
      background-color: #f7f8fa;
      border-radius: 5px;
    }
    .qwui-chat_control {
      margin-left: 2px;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      justify-content: flex-end;
      align-items: center;
      padding: 0 11px 0 0;
      .qwui-chat_send {
        width: 42px;
        height: 26px;
        line-height: 26px;
        font-size: 12px;
        margin: 0;
        padding: 0;
        background-color: #5585f0;
        color: #fff;
      }
      img {
        width: 28px;
        height: 28px;
        transform: rotate(0);
        transition: all 0.3s ease-in-out;
        &:nth-child(1) {
          margin-right: 7px;
        }
        &:nth-child(2) {
          padding: 0 6px;
          margin-left: 3px;
        }
      }
      .active {
        transform: rotate(45deg);
      }
    }
  }
  .qwui-emoji_set {
    height: 160px;
    box-sizing: border-box;
    background-color: #fff;
    .qwui-emoji_wrap {
      text-align: center;
      .qwui-emoji_item {
        font-size: 27px;
        display: inline-block;
        width: 12%;
        text-align: center;
      }
    }
  }
  .qwui-photo_set {
    height: 122px;
    display: flex;
    box-sizing: border-box;
    padding: 16px 17px;
    background-color: #fff;
    .qwui-chat_photo {
      text-align: center;
      margin-right: 32px;
      .qwui-photo {
        width: 60px;
        height: 60px;
      }
      .qwui-photo_text {
        margin-top: 4px;
        font-size: 13px;
        color: #7a7c80;
        line-height: 18px;
      }
    }
    .qwui-chat_pc_photo {
      display: block;
      position: relative;
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
}

.qwui-chat_container .qwui-chat_textarea textarea {
  width: 100%;
  resize: none;
  box-sizing: border-box;
  padding: 5px;
  border-radius: 5px;
  background-color: #f7f8fa;
  border: none;
  overflow: hidden;
  -webkit-appearance: none;
  outline: 0;
}

.qwui-tip_scroll {
  width: 100%;
  height: 100%;
  .qwui-tip_default {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 186px;
      height: 186px;
      margin-top: 22px;
    }
    .qwui-tip_default_tip1 {
      font-size: 17px;
      color: #3f4a64;
      font-weight: 500;
      margin-top: 33px;
    }
    .qwui-tip_default_tip2 {
      font-size: 14px;
      color: #959AA7;
      margin-top: 10px;
    }
    .qwui-tip_default_button {
      width: 132px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      margin: 0;
      padding: 0;
      background-color: #5585f0;
      color: #fff;
      margin-top: 32px;
    }
  }
  .qwui-tip_section {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 14px;
    .qwui-tip_item {
      box-sizing: border-box;
      width: 100%;
      min-height: 50px;
      display: flex;
      align-items: center;
      padding: 14px 0;
      box-shadow: 0px 1px 0px 0px rgba(246, 246, 250, 1);
      font-size: 15px;
      color: #3f4a64;
      font-weight: 400;
      word-break: break-all;
      white-space:pre-wrap;
    }
  }
}
.chatLoad-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  opacity: 0;
  z-index: 10;
}
</style>

