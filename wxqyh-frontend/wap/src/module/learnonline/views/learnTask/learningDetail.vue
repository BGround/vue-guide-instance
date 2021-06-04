<template>
  <div class="qwui-lean_detail"
       :class=" enclousre.fileType === 4 ? '' : 'wrap'"
       v-qw-water-mark="{ agentCode: 'learnonline', isShow: !iframeFlag}"
  >
    <div class="wrap_inner" :style="{height: docViewHeight + 'px'}">
      <iframe name="topFrame" class="inner_iframe"
              :src="iframeSrc"
              ref = "iframe"
              v-if = "iframeFlag"
      ></iframe>
      <div class="img_doc qwjs-img_doc"
           ref="imgDoc"
           v-html="enclousre.content"
           v-else
      ></div>
    </div>

     <!-- 防作弊弹框组件 -->
     <cheat-tip :showTip="preventCheat.pauseTime"
                :showTipAndroid="preventCheat.android"
                :cheatTime="cheatTime"
                :isDocument="enclousre.fileType == 4"
                @restoreTimer="restoreTimer"></cheat-tip>
  </div>
</template>

<script>
import { getLeanDetail, sendLearnTime } from "../../api/getData"
import cheatTip from "../../components/CheatTip"
import qwWaterMark from '@/directive/qwWaterMark'

export default {
  name: 'leanDetail',
  components: {
    cheatTip//防作弊弹框组件
  },
  data() {
    return {
      //文件信息
      enclousre: {
        content: '',//文件类型为图文时的文档内容
        fileName: '',//文件名字
        fileType: '',//文件类型
        fileUrl: '',
        studyTime: 0,//需要学习的时间
      },
      //文件的学习详细情况
      leanDetail : {
        expend: 0,//该课程已学习的时长
        lastRate: 0,//该课件上次学习的进度
        state: 0//判断是否完成该课件,0未完成
      },
      //当文件类型为图文时，不需要iframe标签
      iframeFlag: true,
      //iframe的src属性值
      iframeSrc: '',
      //学习时长的定时器
      timer: undefined,
      //防作弊定时器对象
      preventCheat: {
        timer: null,//防作弊定时器
        time: 0,//防作弊定时器已记录的时长
        pauseTime: false,//暂停图片学习的计时
        android: true,//为了安卓全屏状态下始终不现实弹框
      },
    }
  },
  directives: { qwWaterMark },
  computed: {
    docViewHeight () {
      return window.innerHeight;
    },

    //课程id
    courseId () {
      return this.$route.params.id;
    },
    //文件id
    enclosureId () {
      return this.$route.params.enclosureId;
    },
    //课程的防作弊时长
    cheatTime () {
      return +this.$route.params.cheatTime;
    }
  },
  mounted () {
    var self = this;
    document.addEventListener('click',function(){
      self.preventCheat.time = 0;
    })
    document.addEventListener('touchstart',function(){
      self.preventCheat.time = 0;
    })
    document.addEventListener('touchmove',function(){
      self.preventCheat.time = 0;
    })
    document.addEventListener('mousemove',function(){
      self.preventCheat.time = 0;
    })
    document.addEventListener('mousewheel',function(){
      self.preventCheat.time = 0;
    })
    document.addEventListener('scroll',function(){
      self.preventCheat.time = 0;
    })
    this._getLeanDetail();
  },
  methods: {
    _getLeanDetail () {
      return getLeanDetail({
        courseId: this.courseId,
        enclosureId: this.enclosureId
      }, data => {
        this.enclousre.content = data.enclousre.content;
        this.enclousre.fileName = data.enclousre.fileName;
        this.enclousre.fileType = data.enclousre.fileType;
        this.enclousre.fileUrl = data.enclousre.url;
        this.enclousre.studyTime = data.enclousre.studyTime;
        this.leanDetail.expend = data.CourseDetail.expend;
        this.leanDetail.lastRate = data.CourseDetail.lastRate;
        this.leanDetail.state = data.CourseDetail.state;
        document.title = this.$t('i18n.learning') + '：' + this.enclousre.fileName;
        this.handleSrc();
        this.recordTime();
        //防作弊
        if(this.cheatTime>0){
          clearInterval(this.preventCheat.timer);
          this.preventCheat.timer = setInterval(() => {
            !this.preventCheat.pauseTime && this.preventCheat.time++;
            if(this.preventCheat.time > this.cheatTime && !this.preventCheat.pauseTime){
              this.pauseTimer();
            }
          },1000);
        }
      });
    },
    //处理iframe的src
    handleSrc () {
      let method = [];
      let self = this;
      //文档类型
      method[4] = () => {
        document.querySelector('body').style.width = '100%';
        //pdf类型
        if(this.enclousre.fileUrl.toLowerCase().includes('.pdf')){
          this.iframeSrc = _.baseURL+'/jsp/wap/learnonline/generic/web/viewer.html?url='+
                           encodeURIComponent(_.fileDownURL+_.downFileURL+encodeURIComponent(this.enclousre.fileUrl)+
                           '&fileFileName='+encodeURIComponent(this.enclousre.fileName));
        }else {
          this.iframeSrc = _.yongzhong_url+_.fileDownURL+_.downFileURL+encodeURIComponent(this.enclousre.fileUrl)+
                           '&fileFileName='+encodeURIComponent(this.enclousre.fileName);
        }
      };
      //外部链接
      method[6] = () => {
        if(this.enclousre.fileUrl.includes('mck.baidu.com') && _.isIOS()){
          let iframeDom = this.$refs.iframe;
          iframeDom.style.width = top.innerWidth + 'px';
          iframeDom.scrolling = "no";
        }
        this.iframeSrc = this.handleVideoUrl(this.enclousre.fileUrl).replace('http:','').replace('https:','');
      };
      //图文类型
      method[5] = () => {
        //iframe隐藏
        this.iframeFlag = false;
        this.$nextTick(() => {
          //所有iframe视频src
          let iframeDom = document.querySelectorAll('.qwjs-img_doc p iframe');
          iframeDom.forEach(function (value) {
            let eachUrl = value.src;
            //处理优酷的视频链接
            if(eachUrl.includes('player.youku.com/')){
              eachUrl = eachUrl.replace('http://', 'https://');
              value.src = eachUrl;
            }else {//处理腾讯的视频链接
              value.src = self.handleVideoUrl(eachUrl);
            }
          });
          //特定腾讯PC视频
          let embedSrcAll = document.querySelectorAll('.qwjs-img_doc embed.edui-faked-video');
          embedSrcAll.forEach(function (value) {
            let eachUrl = value.src;
            let iframeDom = document.createElement('iframe');
            iframeDom.src = self.handleVideoUrl(eachUrl);
            iframeDom.width = '100%';
            iframeDom.frameBorder = '0';
            value.parentNode.appendChild(iframeDom);
            if(value.parentNode.tagName === 'P'){
              value.parentNode.removeChild(value.parentNode.firstElementChild);
            }
          });
        });
      };
      return method[this.enclousre.fileType]();
    },
    //处理腾讯视频的链接
    handleVideoUrl (url) {
      let flag = url.includes('https://v.qq.com') || url.includes('https://m.v.qq.com');
      let vidFlag = url.includes('vid=');
      let playUrl = 'https://v.qq.com/iframe/player.html?tiny=0&auto=0&vid=';
      if(flag && vidFlag && !url.includes('iframe')){
        let num = url.indexOf("vid=");
        let nextNum = url.indexOf("&");
        if(nextNum === -1){
          let videoId = url.substr(num + 4);
          url = playUrl + videoId;
        }else {
          let videoId = url.substring(num + 4, nextNum);
          url = playUrl + videoId;
        }
      }else if(flag && !vidFlag){
        let videoId = url.substr(0, url.lastIndexOf('.'));
        let newVideoId = videoId.substr(videoId.lastIndexOf('/') + 1, videoId.length);
        url = playUrl + newVideoId;
      }
      return url;
    },
    //记录学习时长
    recordTime () {
      let tenForme = 0;//满一分钟重置为0
      this.timer = setInterval(() => {
        !this.preventCheat.pauseTime && tenForme++;
        if(tenForme >= 60){
          this.leanDetail.expend++;
          tenForme=0;
          if(this.leanDetail.expend >= this.enclousre.studyTime){
            this.leanDetail.state = 5;
          }
          //满1分钟上传一次参数
          sendLearnTime({
            courseId: this.courseId,
            enclosureId: this.enclosureId,
            expend: 1,
            lastRate: 0,
            finish: this.leanDetail.state
          }, ()=>{});
        }
      },1000)
    },
    //暂停学时时长的增加
    pauseTimer () {
      this.preventCheat.pauseTime = true;
    },
    // 防作弊恢复学时时长记录
    restoreTimer () {
      //点击在之后防作弊时长重置
      this.preventCheat.time = 0;
      this.preventCheat.pauseTime = false;
    },
  },
  //页面离开时清除定时器
  beforeRouteLeave (to, from, next) {
    // 组件离开前清除定时器
    clearInterval(this.timer);
    clearInterval(this.preventCheat.timer);
    next();
  }
}
</script>

<style lang="scss" scoped>
  .qwui-lean_detail {
    .wrap_inner {
      overflow-x: auto;
      .inner_iframe {
        width: 100%;
        height: 100%;
        border: 0;
        overflow: auto;
        z-index:9
      }
      .img_doc {
        width: 100%;
        height: 100%;
        background: #fff;
        overflow: auto;
        p {
          padding: 10px;
          color:#333;
        }
        img {
          display: block;
          width: 100%;
        }
        iframe {
          display: block;
          width: 100%;
          height: 210px;
        }
      }
    }
  }
</style>

