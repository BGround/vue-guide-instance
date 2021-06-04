<template>
  <div>
    <div class="qwui-chat-bottom" v-if="chatBottomBtn && showBottomBtn &&!show && inputValue">
      <div class="qwui-chat-bottom__back" v-show="sendBackBtn" @click="showBottomBtn = false"></div>
      <div class="qwui-chat-bottom__box">
        <div class="qwui-chat-bottom__input" @click="focusClick">
          <input class="input" readonly="readonly" :value="inputValue" type="text">
        </div>
        <div class="qwui-chat-bottom__send" @click="buttonClick">发表</div>
      </div>
    </div>
  <Mask_fix :show="show"
            :position="position"
            :modal="true"
            :modalColor="'rgba'"
            @modelClick="closeChat"
            @maskTouchstart="chatTouchStart"
            @maskTouchmove="chatTouchMove"
            @maskTouchend="chatTouchEnd"
  >
    <div class="qwui-chat_box">
      <div class="chat-header_height"></div>
      <div class="qwui-chat_input_header">
        <p class="qwui-chat_title">评论</p>
        <img class="qwui-chat_close" src="../../assets/images/ic_chat_close.png" @click="closeChat">
      </div>
      <!--输入框-->
      <div class="qwui-chat_content_box contentScroll">
        <div class="qwui-chat_input_content" @click="focusClick">
          <div class="qwui-chat_input_textarea">
            <qwui_textarea v-model="inputValue"
                           ref="textareaModel"
                           :value="value"
                           :autofocus="autofocus"
                           :rows="rows"
                           :autosize="autosize"
                           :placeholder="placeholder"
                           :maxLength="maxLength"
                           @input="handleInput"
                           @rowChange="rowChange"
                           @focus="handleFocus"
                           @keyup="keyUp"
                           @blur="handleBlur"
                           @change="handleChange">

            </qwui_textarea>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isMobile" :style="footerHeight"></div>
    <!--底部导航-->
    <div class="qwui-chat_input_footer" :class="{bottom:!isMobile}">
      <div class="qwui-chat_footer_flex">
        <div class="qwui-chat_tools">
          <!--@-->
          <span class="chat-tools_child" :class="{'active':'at'==currentActive}"
                @click="toolsClick('at')" v-if="showAt">
            <i class="iconfont icon-shenpiqingshi-at"></i>
          </span>
          <!--表情-->
          <span class="chat-tools_child" :class="{'active':'biaoqing'==currentActive && isShowEmoji}"
                @click="toolsClick('biaoqing')"  v-if="showBiaoQing">
            <i class="iconfont icon-shenpiqingshi-biaoqing"></i>
          </span>
          <!--图片-->
          <span class="chat-tools_child" :class="{'active':'tupian'==currentActive}"
                @click="toolsClick('tupian')" v-if="showTuPian">
            <i class="iconfont icon-shenpiqingshi-tupian">
               <input type="file" class="input isMobile"
                      v-if="isMobile"
                      @click.prevent="selectImagesClick"
                      accept="image/jpeg,image/jpg,image/png,image/gif"/>
              <input v-else class="input" type=file
                     :multiple="multiple"
                     @change='updateImage'
                     accept="image/jpeg,image/jpg,image/png,image/gif" />
            </i>
          </span>
          <!--定位-->
          <span class="chat-tools_child" :class="{'active':'dingwei'==currentActive}"
                @click="toolsClick('dingwei')" v-if="showDingWei">
            <i class="iconfont icon-shenpiqingshi-dingwei"></i>
          </span>
          <!--匿名-->
          <span class="chat-tools_child" :class="{'active':isAnony}"
                @click="toolsClick('anony')" v-if="showAnony">
            <i class="iconfont icon-shenpiqingshi_shenpiqingshi-niming"></i>
          </span>
        </div>
        <div class="qwui-chat_number">
          <p>{{currentLength}}/{{maxLength}}</p>
        </div>
        <div class="qwui-chat_button_box" @click="buttonClick">
          <span  class="qwui-chat_button">发表</span>
        </div>
      </div>
      <div class="qwui-swiper_container emoji_list_viewport" v-show="isShowEmoji">
        <div class="qwui-swiper_wrapper flipsnap">
          <div class="qwui-swiper_slide"  v-for="item in smile_array">
            <ul>
              <li  v-for="strData in item" >
                <a href="javascript:" :title="strData" @click.stop.prevent="selectEmoji">
                  <img v-if="onceEmojiClick" align="absmiddle" class="emoji" :src="'../static/images/emoji/'+strData.split(':').join('')+'.png'" :title="strData" :alt="strData" >
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="qwui-swiper_pagination">
          <span class="qwui-swiper_pagination_bullet" v-for="(item,index) in smile_array" :class="{'active':index==currentPoint}" :key="index"></span>
        </div>
      </div>
    </div>
  </Mask_fix>
  </div>
</template>
<script>
  import Mask_fix from '@/components/part/mask_fix';
  import qwui_textarea from '@/components/input/inputTextarea';
  import '../../assets/js/flipsnap.js'
  import {uploadImages,wx_chooseImage,qw_uploadImages} from '@/utils/uploadImages';
  import {smile_array,defaultRow,codeToWord,imgToCode} from '@/utils/emoji';
  import EventBus from '@/utils/eventBus';
  export default {
    name: 'chatInput',
    props: {
      dataBase:Object,
      //开启底部评论框，默认开启
      chatBottomBtn:{
        type: Boolean,
        default: true
      },
      //显示关闭发表底部评论框图标 < ，默认显示
      sendBackBtn:{
        type: Boolean,
        default: true
      },
      show:{                                                           //显示评论框弹窗
        type:Boolean,
        required:true,
        default:false,
      },
      value:{                                                          //输入内容值
        type:String,
        required:false,
        default:"",
      },
      agent:{
        type:String,
        required:true,
      },
      placeholder:{
        type:String,
        required:false,
        default:"请输入内容...",
      },
      multiple:{                                                         //允许上传多张
        type:Boolean,
        default:false,
      },
      animated:{                                                        //开启动画效果
        type:Boolean,
        required:false,
        default:true,
      },
      autofocus:{                                                       //自动聚焦
        type:Boolean,
        default:false,
      },
      rows:{                                                            //默认当前行数
        type:Number,
        default:10,
      },
      minRows:{
        type:Number,
        default:10,
      },
      maxRows:{                                                         //最大行数
        type:Number,
        default:20,
      },
      maxLength:{
        type:Number,
        default:500,
      },
      showAt:{
        type:Boolean,
        default:true,
      },
      showBiaoQing:{
        type:Boolean,
        default:true,
      },
      showTuPian:{
        type:Boolean,
        default:true,
      },
      showDingWei:{
        type:Boolean,
        default:false,
      },
      showAnony:{
        type:Boolean,
        default:false,
      }
    },
    data() {
      return {
        isMobile:false,                                           //移动端
        currentEvent:null,
        currentActive:"",                                         //当前点击的位置
        position:"bottom",                                        //定位置底
        isShowEmoji:false,                                      //显示表情
        inputValue:this.value              ,                   //输入内容值
        smile_array:smile_array,
        currentPoint:0,                                        //当前表情页
        onceEmojiClick:false,
        user:null,//选人的id
        startPos:null,
        endPos:null,
        isIOS:false,
        currentHeight: false,
        scrollTop: null,
        //显示底部输入框,
        showBottomBtn: true,
        touch:{
          min: 52 + 'px',
          max: 234 + 'px',
          selectorScrollable: 'qwui-textarea',
          posY: 0,
          maxscroll: 0
        },
        isAnony:false                                           //匿名功能
      }
    },
    created(){
      this.isIOS = _.isIOS()
      if(_.isWeChatApp()){
        this.position="''";
        this.isMobile = true;
      }
    },
    watch:{
      value:function (val) {
        this.inputValue = val
        if(!val){
          this.user = null
        }
      },
      show:function (val) {
        this.settingBodyScroll(val);
      }
    },
    computed:{
      footerHeight(){
        let height = this.isShowEmoji? this.touch.max : this.touch.min
        return  {'height': height ,"minHeight":height}
      },
      currentLength(){
        return this.inputValue.length>= this.maxLength? this.maxLength:this.inputValue.length
      },
      autosize(){
        return this.isMobile? {minRows: 6,maxRows:6} : false
      }
    },
    mounted() {
      this.$nextTick(function () {
        EventBus.$on("chatSendUtil",this.getAtChatData);   //监听个人信息组件@人
        var self=this;
        var windowH=document.documentElement.clientWidth<1024? document.documentElement.clientWidth:740;
        var emoji_list_flipsnap = Flipsnap('.emoji_list_viewport .flipsnap', {
          distance: windowH
        });
        emoji_list_flipsnap.element.addEventListener('fspointmove', function() {
          self.currentPoint=emoji_list_flipsnap.currentPoint;
        }, false);
      });
    },
    //清空body限制滚动样式
    beforeDestroy(){
      this.settingBodyScroll(false);
      clearInterval(this.scrollint);
      this.scrollTop = null
      EventBus.$off("chatSendUtil",this.getAtChatData);   //清除@人
    },
    methods:{
      settingBodyScroll(type){
        if(type){
          document.getElementsByTagName("body")[0].style.cssText = "overflow-y: hidden;";
          document.body.style.cssText = "overflow-y: hidden;";
          this.focusClick()
        }else{
          document.getElementsByTagName("body")[0].style.cssText = "";
          document.body.style.cssText = "";
        }
      },
      //设置内容滚动到底部
      settingContentHeight(){
        this.$nextTick(() => {
          let contentTarget=document.querySelector(".contentScroll");
          contentTarget.scrollTop=contentTarget.scrollHeight;
        })
      },
      //关闭弹窗时把当前输入框的内容返回父组件，让父组件的评论输入框显示评论内容
      closeChat(){
        this.currentActive="";
        this.isShowEmoji=false;
        this.$emit("update:show",false);
        this.$emit('update:autofocus',false)
        //如果开启了底部评论框，则判断有输入值就显示
        this.showBottomBtn = true
        this.$emit("closeChat",this.inputValue);
        clearInterval(this.scrollint);
        if(this.scrollTop){
          document.body.scrollTop = this.scrollTop -1
          document.documentElement.scrollTop = this.scrollTop -1
        }
      },
      //聚焦点击
      focusClick(){
        let self = this
        this.$emit("update:show",true);
        this.$emit('update:autofocus',true)

        if(this.currentEvent){
          this.currentEvent.focus();
          this.settingSelection(this.currentEvent);
        }

        if(this.isIOS && this.isMobile){
          this.scrollint = null
          this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
          this.scrollint = setInterval(() => {
            if(self.show){
              document.body.scrollTop = 0
            }
          }, 500)
        }
      },
      //点击工具
      toolsClick(type){
        this.currentActive=type;
        switch (type){
          case "at":
            this.isShowEmoji=false;
            this.$emit('update:autofocus',false)
            this.dataBase.selectConfig.selectList["ccPersonList"].callBack={
            "confirm": this.chatConfirmSelect
          };
            this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.length = 0;
            this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
            if(this.user && this.user.data){
              this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(...this.user.data);
            }

            setTimeout(function () {
              _.openSelectUser("ccPersonList");//显示选人界面
            },500)
            break;
          case "biaoqing":
            this.isShowEmoji=!this.isShowEmoji;
            this.onceEmojiClick=true;
            break;
          default:
            this.isShowEmoji=false;
            break;
					case 'dingwei':
						this.$emit('sendAddress');
						break;
          case 'anony':
            this.isAnony=!this.isAnony;
						this.$emit('setAnony',this.isAnony);
						break;
        }
      },
      //微信上传图片
      selectImagesClick(event){
        wx_chooseImage(this.agent,this.wxCallBackUrl,1);
      },
      //PC上传图片
      updateImage(event){
       qw_uploadImages(event,this.agent,this.callBackUrl);
      },
      //微信发送图片返回的URL
      wxCallBackUrl(data){
        if(data){
          this.sendUpdateImage(data[0]);
        }
      },
      //PC端发送图片返回的URL
      callBackUrl(data){
        if(data.imgurl){
          this.sendUpdateImage(data.imgurl);
        }
      },
      //发送图片
      sendUpdateImage(url){
        let result={
          type:2,
          status:9,
          content:url
        };
        this.$emit("updateContent",result);
        this.closeChat()
      },
      //点击选择表情,定位光标再插入值
      selectEmoji(event){

        if(this.chechLength()){
          return
        }

        this.$emit('update:aotufocus',false)
        let str='['+codeToWord(event.target.getAttribute("title"))+']';
        if (this.isMobile && typeof this.startPos === 'number' && typeof this.endPos === 'number'){
          this.inputValue = this.inputValue.substring(0, this.startPos) + str
            + this.inputValue.substring(this.endPos, this.inputValue.length);
        }else{
          this.inputValue+='['+codeToWord(event.target.getAttribute("title"))+']';
        }
        this.$nextTick(function () {
          this.settingSelection(this.currentEvent);
          this.startPos = null
          this.endPos = null
        });
      },
      //判断是否重复@人,没重复再加入输入框内容
      getAtChatData(msg){
        if(this.chechLength()){
          return
        }
        const userId=msg.userId||msg.creator;
        if(this.user){
          if(this.user.userIds.indexOf(userId)==-1){
            this.inputValue+="@"+msg.personName+" ";
            this.user.userIds+=userId+'|';
            this.user.data.push(msg);
          }
        }else{
          this.inputValue+="@"+msg.personName+" ";
          this.user={
            data:[],
            userIds:userId+'|'
          };
          this.user.data.push(msg);
        }
//开启底部评论框，则显示，否则显示评论弹窗
        if(this.chatBottomBtn){
          this.showBottomBtn = true
        } else {
          this.$emit("update:show",true);
          this.$emit('update:autofocus',true)
        }
      },
      //@相关人
      chatConfirmSelect(el,obj){
        if(this.chechLength()){
          return
        }
        if(el=="ccPersonList" && obj){
          let newMessageValue="";

          if(this.user && this.user.data.length>0){
            this.user.data.forEach((val)=>{
              this.inputValue=this.inputValue.replace("@"+val.personName+" ","");
            });
          }
          this.user={                                                            //清空记录人员id
            data:[],
            userIds:""
          };
          for(let i=0;i<obj.user.data.length;i++){
            if(this.user.userIds.indexOf(obj.user.data[i].userId)<0){
              newMessageValue+="@"+obj.user.data[i].personName+" ";
              this.user.data.push(obj.user.data[i]);
              this.user.userIds+=obj.user.data[i].userId+'|';
            }
          }
          this.inputValue=this.inputValue+newMessageValue;                   //记录选人后的输入值
        }
      },
      chechLength(){
        return this.inputValue.length>= this.maxLength? true : false
      },
      //点击发表评论，发送数据，清空输入框数据，清空选人
      buttonClick(){
        if(!this.inputValue){
          return;
        }
        let result={
          type:1,      //发布评论的类型，1：文本，2：图片
          status:9,      //发布评论的状态,9:普通，6：转审
          content:imgToCode(this.inputValue),
        };
        if(this.user){
          result.userIds=this.user.userIds;
          this.$emit("dealccPerson",this.user);
        }
        this.inputValue="";
        this.user=null;
        if(this.showAnony){
          result.isAnony=this.isAnony
        }
        this.$emit("updateContent",result);
        this.dataBase.selectConfig.selectList["ccPersonList"].userSelected=[];
        this.closeChat()
      },
      handleInput(value){
        if(value.length==0){
          this.user=null;
        }
        this.$emit('input',value)
      },
      keyUp(){
        this.settingContentHeight();
      },
      //记录光标位置
      settingSelection(event){
        if(event){
          this.startPos = event.selectionStart;
          this.endPos  = event.selectionEnd;
        }
      },
      //聚焦时，是移动端关闭表情、清空蓝色状态
      handleFocus(event){
        if(this.isMobile){
          this.isShowEmoji=false;
          this.currentActive="";
        }
        this.$nextTick(function () {
          this.currentEvent=event.target;
          this.settingSelection(this.currentEvent);
        });
        this.$emit('update:aotufocus',true)
        this.settingContentHeight();
      },
      handleBlur(event){
        clearInterval(this.scrollint);
        this.$nextTick(function () {
          this.currentEvent=event.target;
          this.settingSelection(this.currentEvent);
          this.$emit('update:aotufocus',false)
        });
      },
      handleChange(value){
        this.$emit('change',value);
      },
      //内容变化
      rowChange(obj){
      this.currentHeight = obj.currentHeight>parseInt(obj.height)? true : false
      },
      //触摸开始
      chatTouchStart(event){

        //非 IOS,未出现滚动条不兼容
        if(!this.isIOS && this.isMobile && !this.currentHeight){
          return
        }

        var events = event.touches[0] || event;

        // 先求得是不是滚动元素或者滚动元素的子元素
        if(event.target.className !== this.touch.selectorScrollable){
          return
        }
        // 垂直位置标记
        this.touch.posY = events.pageY;
        // 是否可以滚动
        this.touch.maxscroll = event.target.scrollHeight - event.target.clientHeight;
      },
      //触摸移动
      chatTouchMove(event){
        //非 IOS,未出现滚动条不兼容
        if(!this.isIOS && this.isMobile && !this.currentHeight){
          return
        }
        var eve = event || window.event;
        // 如果不足于滚动，则禁止触发整个窗体元素的滚动
        if (this.touch.maxscroll <= 0 ) {
          // 禁止滚动
          eve.preventDefault();
        }

        // 当前滚动元素的滚动高度
        let scrollTop = event.target.scrollTop;

        // 现在移动的垂直位置，用来判断是往上移动还是往下
        let events = event.touches[0] || event;
        // 移动距离
        let distanceY = events.pageY - this.touch.posY;

        // 上下边缘检测
        if (distanceY > 0 && scrollTop == 0) {
          // 往上滑，并且到头,禁止滚动的默认行为
          eve.preventDefault();
          return;
        }

        // 下边缘检测
        if (distanceY < 0 && (scrollTop + 1 >= this.touch.maxscroll)) {
          // 往下滑，并且到头,禁止滚动的默认行为
          eve.preventDefault();
          return;
        }
      },
      //触摸结束
      chatTouchEnd(event){
        this.touch.maxscroll = 0;
      },
    },
    components:{
      Mask_fix,
      qwui_textarea
    }
  }
</script>
<style scoped>
  /*评论底部按钮*/
  .qwui-chat-bottom{
    position: fixed;
    z-index: 4;
    bottom: 0;
    width: 100%;
    height: 50px;
    display: flex;
    flex: 1 1 0%;
    align-items: center;
    background: #fff;
    box-shadow: 0 -4px 15px 0 rgba(227,228,232,.8);
  }
  .qwui-chat-bottom__back{
    display: flex;
    padding: 0 12px 0 0;
    margin: 0 0 0 16px;
    width: 18px;
    height: 18px;
    background: url('~assets/images/icon_a-common_arrow-back.png') no-repeat;
    background-size: contain;
  }
  .qwui-chat-bottom__box{
    display: flex;
    align-items: center;
    width: 100%;
  }
  .qwui-chat-bottom__input{
    display: flex;
    align-items: center;
    flex: 1;
    padding: 7px 10px;
    border-radius: 5px;
    font-size: 15px;
    color: #b2b9c8;
    text-align: left;
    background: #f6f6fa;
    cursor: pointer;
  }
  .qwui-chat-bottom__input .input{
    width: 100%;
    font: normal 14px -apple-system-font,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;
    color: #3f4a64;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    background: none;
  }
  .qwui-chat-bottom__send{
    display: flex;
    padding: 0 15px;
    font-size: 15px;
    color: #5585f0;
  }
  /*end*/
  .qwui-chat_content_box::-webkit-scrollbar ,.qwui-chat_input_textarea::-webkit-scrollbar{
    width: 0;
    height: 6px;
  }
  .chat-header_height{
    height: 52px;
  }
  .qwui-chat_input_header{
    display: flex;
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    right: 0;
    padding: 5px 0 0 15px;
    font-size: 18px;
    color: #666;
    background: #fff;
  }
  .qwui-chat_title{
    flex: 1;
    padding: 10px 0;
  }
  .qwui-chat_close{
    width: 15px;
    height: 15px;
    padding: 15px;
  }
  .qwui-chat_input_header .iconfont{
    display: inline-block;
    margin: auto;
    font-size: 26px;
    color: #B3B3B3;
    cursor: pointer;
  }
  .qwui-chat_content_box{
    position: relative;
    width: 100%;
    height: auto;
    overflow: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .qwui-chat_content_box.active{
    flex: none;
  }
  .qwui-chat_input_content{
    flex: 1;
    padding:10px 15px 15px;
  }
  .qwui-chat_input_textarea{
    display: flex;
    border-radius:4px;
    outline:none;
  }
  /deep/ .qwui-chat_input_content .qwui-textarea{
    flex: 1;
    font-size: 16px;
    border: none;
    background-color: #fff;
    -webkit-appearance: none;
    outline: 0;
    word-wrap: break-word;
    resize: none;
  }
  /*底部样式*/
  .qwui-chat_input_footer{
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    min-height:  52px;
    background: #fff;
  }
  .qwui-chat_input_footer.bottom{
    position: absolute;
    bottom:0;
  }
  .qwui-chat_footer_flex{
    display: flex;
    flex: 1;
    flex-wrap: nowrap;
    padding: 0 15px;
    height: 52px;
    justify-content: space-between;
  }
  .qwui-chat_footer_flex .qwui-chat_tools{
    display: flex;
    align-items: center;
    flex: 1;
  }
  .qwui-chat_tools .chat-tools_child{
    display: inline-block;
    position: relative;
    padding-right: 20px;
    cursor: pointer;
  }
  .chat-tools_child input{
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    width: 28px;
    opacity: 0;
  }
  .qwui-chat_tools .active .iconfont{
    color:#2F7DCD;
  }
  .qwui-chat_tools .iconfont{
    font-size: 28px;
    color:#7F8393;
  }
  .qwui-chat_number{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
    font-size: 12px;
    color: #ccc;
  }
  .qwui-chat_button_box{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .qwui-chat_button{
    display: inline-block;
    width: 60px;
    height: 30px;
    font-size: 15px;
    color:rgba(255,255,255,1);
    line-height: 30px;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    border-radius: 4px;
    box-sizing: border-box;
    background:rgba(47,125,205,1);
  }

  qwui-chat_button:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #e5e5e5;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 10px;
  }
  /*表情*/
  .qwui-swiper_container {
    position: relative;
    z-index: 1;
    flex: 1;
    width: 100%;
    height: 100%;
    padding:10px 0;
    list-style: none;
    overflow: hidden;
  }
  .qwui-swiper_container:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .qwui-swiper_wrapper {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition-property: transform,-webkit-transform;
    box-sizing: content-box;
  }
  .qwui-swiper_slide{
    display: flex;
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 18px;
    background: #fff;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .qwui-swiper_slide ul{
    width: 100%;
    padding: 0 5px;
  }
  .qwui-swiper_slide li{
    position: relative;
    float: left;
    width: 14.2857%;
    padding: 5px 0;
    text-align: center;
    box-sizing: border-box;
  }

  .qwui-swiper_slide li a{
    display: inline-block;
    width: 28px;
    height: 28px;
  }
  @media screen and (min-width: 740px) {
    .qwui-swiper_slide li a{
      display: inline-block;
      width: 2em;
      height: 2em;
    }
  }
  .qwui-swiper_slide li .emoji{
    display: inline-block;
    width: 100%;
    height: 100%;
    vertical-align: top;
  }
  .qwui-swiper_pagination{
    width: 100%;
    position: relative;
    padding-top: 6px;
    text-align: center;
    transition: .3s opacity;
    transform: translate3d(0,0,0);
    z-index: 10;
  }
  .qwui-swiper_pagination_bullet {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 4px;
    border-radius: 100%;
    background: #000;
    opacity: .2;
    cursor: pointer;
  }
  .qwui-swiper_pagination_bullet.active {
    opacity: 1;
    background: rgba(47,125,205,1);
  }
</style>
