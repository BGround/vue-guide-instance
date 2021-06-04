
<!--PC、微信APP图片预览功能组件-->
<template>
  <!--预览图片窗口-->
  <div class="qwui-preview_window"
       :style="{height:screenHeight+'px'}"
       v-show="isShowPreviewWindow">
    <div class="qwui-preview_content" ref="previewContent" @click.self="hidePreviewImg">
      <img :src="previewImageURL"
           class="qwui-preview_image"
           @mousedown.stop.prevent="moveThis($event)"
           alt=""
           :style="{
                 maxWidth:imageObject.width+'px',
                 maxHeight:imageObject.height+'px',
                 width:imageObject.width+'px',
                 height:imageObject.height+'px',
                 left:imageObject.left+'px',
                 top:imageObject.top+'px',
                 transform:'rotate('+imageObject.rotateDeg+'deg)'}">
      <div class="qwui-preview_num">{{(currentIndex+1)+'/'+previewUrls.length}}</div>
      <div class="qwui-close_window" @click="hidePreviewImg"></div>
      <!--  中间按钮，上一张、下一张  -->
      <span class="qwui-preview_row left"
            :class="classObjectPre"
            v-if="screenWidth >= 650"
            @click.stop="viewUpDown('prev')"></span>
      <span class="qwui-preview_row right"
            :class="classObjectNext"
            v-if="screenWidth >= 650"
            @click.stop="viewUpDown('next')"></span>
      <!--  底部操作，分别为上一张、放大、缩小、重置大小、旋转、下载图片、下一张  -->
      <div class="qwui-preview_bottom_bar">
        <ul class="qwui-preview_options">
          <li @click.stop.prevent="viewUpDown('prev')" v-if="screenWidth < 650" :class="classObjectPre">
            <i class="icon icon-prev"></i>
          </li>
          <li @click.stop.prevent="zoomInOut(0.1, true)">
            <i class="icon icon-enlarge"></i>
          </li>
          <li @click.stop.prevent="zoomInOut(-0.1, true)">
            <i class="icon icon-lessen"></i>
          </li>
          <li @click.stop.prevent="resetImage()">
            <i class="icon icon-resize"></i>
          </li>
          <li @click.stop.prevent="rotateImage()">
            <i class="icon icon-rotate"></i>
          </li>
          <li>
            <a :href="downFilePath" class="icon icon-download" download>
            </a>
          </li>
          <li @click.stop.prevent="viewUpDown('next')" v-if="screenWidth < 650" :class="classObjectNext">
            <i class="icon icon-next"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import EventBus from '@/utils/eventBus';
  import {previewImages} from '@/utils/uploadImages';
  export default {
    name: "previewImages",
    props:{
      //兼容微信端培训学习预览图片打不开
      useWxPreview:{
        type:Boolean,
        default: true
      }
    },
    data() {
      return{
        previewUrls:[],
        wxImagesUrls:[],
        isShowPreviewWindow:false,//预览图片窗口显示
        screenWidth:'',//屏幕宽度
        screenHeight:'',//屏幕高度
        previewImageURL:'',//预览图片url
        currentIndex:0,//预览图片当前index
        downFilePath:'',//图片下载地址
        templateDOM:{},//DOM对象
        imageObject:{//预览图片数据
          naturalWidth:'',
          naturalHeight:'',
          width:'',
          height:'',
          left:'',
          top:'',
        },
      }
    },
    computed:{
      classObjectPre:function () { //第一张图片禁止点击上一张
        return {
          'disabled':this.currentIndex == 0
        }
      },
      classObjectNext:function () { //最后一张图片禁止点击下一张
        return {
          'disabled':this.currentIndex+1 >= this.previewUrls.length
        }
      }
    },
    created(){
      this.screenHeight = document.documentElement.clientHeight;
      this.screenWidth = document.documentElement.clientWidth;
      var self = this;
      if(!_.isWeChatApp()) {
        window.addEventListener('resize', function () {
          self.screenHeight = document.documentElement.clientHeight;
          self.screenWidth = document.documentElement.clientWidth;
          if(self.isShowPreviewWindow) {
            self.previewImg(self.previewUrls[self.currentIndex].src, self.currentIndex)
          }
        })
      }
    },
    mounted(){
      //监听点击预览
      EventBus.$on("previewImages",this.previewImagesClick);
    },
    beforeDestroy () {
      EventBus.$off('previewImages',this.previewImagesClick)
    },
    methods:{
      //PC端事件，长图可拖动
      moveThis:function (e) {
        var self = this;
        e = e || window.event;
        var xMove, yMove,
          oldTop = self.imageObject.top,
          oldLeft= self.imageObject.left,
          oldClientX = e.clientX, //点击时鼠标的位置
          oldClientY = e.clientY;
        document.onmousemove =function (ev) { /*注册document的mousemove事件*/
          xMove = ev.clientX-oldClientX;
          yMove = ev.clientY-oldClientY;
          if(window.innerHeight - self.imageObject.top <= self.imageObject.height) {
            self.imageObject.top = (oldTop + yMove) > 0
              ? 0
              : (self.imageObject.height - window.innerHeight + oldTop + yMove) >= 0
                 ? oldTop + yMove
                 : window.innerHeight - self.imageObject.height;
          }
          if(window.innerWidth - self.imageObject.left <= self.imageObject.width) {
            self.imageObject.left = (oldLeft + xMove) > 0
              ? 0
              : (self.imageObject.width - window.innerWidth + oldLeft + xMove) >= 0
                 ? oldLeft + xMove
                 : window.innerWidth - self.imageObject.width;
          }
        };
        document.onmouseup = function () {/*鼠标放开清除事件*/
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      //当前点击图片（必需）、图片数组（必需）
      previewImagesClick(currentUrl,urls){
        this.dealData(urls);
        if(_.isWeChatApp() && this.useWxPreview){
          previewImages(currentUrl,this.wxImagesUrls);
        }else{
          var temp = this.previewUrls.findIndex((val)=>{
                 return val.src.indexOf(currentUrl) != -1
              });
          this.previewImg(currentUrl,temp)
        }
      },
      //处理图片
      dealData:function (val) {
        if(this.previewUrls != val) {
          this.previewUrls = val.slice(0);
          this.wxImagesUrls = [];
          this.previewUrls.forEach((item, index) => {                                  //处理图片src
            this.previewUrls[index].src = _.filterCompressURL(item.picPath ? item.picPath : item.src);
            this.wxImagesUrls.push(_.filterCompressURL(item.picPath ? item.picPath : item.src));
          });
        }
      },
      //滑轮滚动
      mouseWheel(){
        if(this.$refs.previewContent) {
          this.$refs.previewContent.addEventListener('mousewheel', this.mouseWheelHandler);
          this.$refs.previewContent.addEventListener('wheel', this.mouseWheelHandler);
          this.$refs.previewContent.addEventListener('DOMMouseScroll', this.mouseWheelHandler);
        }
      },
      //隐藏预览图片
      hidePreviewImg(){
        this.isShowPreviewWindow = false;
        this.$emit('hidePreviewImg');
      },
      //重置图片大小
      resetImage(){
        this.previewImg(this.previewUrls[this.currentIndex].src,this.currentIndex)
      },
      //预览图片
      previewImg(previewImageURL,index){
        var imgSource = new Image(), self = this, img={};
        imgSource.src = previewImageURL;
        var promise = new Promise(resolve => {
          imgSource.onload = function () {
            img={
              naturalHeight:this.height,
              naturalWidth:this.width
            };
            resolve();
          }
        });
        promise.then(function () {
          if(img.naturalHeight > window.innerHeight){ //如果是长图就限制初始化宽高
            img.naturalWidth = img.naturalWidth * (window.innerHeight / img.naturalHeight);
            img.naturalHeight = window.innerHeight;
          }
          if(img.naturalWidth > window.innerWidth){
            img.naturalHeight = img.naturalHeight * (window.innerWidth / img.naturalWidth);
            img.naturalWidth = window.innerWidth;
          }
          if(img.naturalWidth) {
            self.currentIndex = index;
            self.downFilePath = previewImageURL.replace('/compress/', '/');
            self.previewImageURL = previewImageURL;
            var aspectRatio = img.naturalWidth / img.naturalHeight;
            var mtH = (self.screenHeight - img.naturalHeight) / 2,
              mlW = (self.screenWidth - img.naturalWidth) / 2;
            self.imageObject = {
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              aspectRatio: aspectRatio,
              ratio: img.naturalWidth / img.naturalWidth,
              width: img.naturalWidth,
              height: img.naturalHeight,
              imgRatio: img.naturalWidth / img.naturalHeight,
              left: mlW,
              top: mtH,
              rotateDeg: 0,
              action: false,
            };
            self.initialImage = self.imageObject;//保存原图对象
            self.templateDOM = {
              winPreviewW: self.screenWidth,                 //灰色背景宽度
              winPreviewH: self.screenHeight,                //灰色背景高度
            }
            self.isShowPreviewWindow = true;
            self.mouseWheel();
          }
        })
      },
      //旋转图片
      rotateImage(){
        var degrees = 90;
        var previewWight = this.templateDOM.winPreviewW,
          previewHight=this.templateDOM.winPreviewH;
        var totalDegress = ((this.imageObject.rotateDeg || 0) + degrees);
        if (totalDegress % 180 != 0) {
          previewWight=[this.templateDOM.winPreviewH, previewHight = this.templateDOM.winPreviewW][0];
        }
        var width = Math.min(this.initialImage.width, previewWight),
          height = Math.min(this.initialImage.height, previewHight);
        if (width / height > this.imageObject.imgRatio) {
          width = height * this.imageObject.imgRatio;
        } else {
          height = width / this.imageObject.imgRatio;
        }
        this.imageObject.width = width;
        this.imageObject.height = height;
        this.imageObject.left = (this.templateDOM.winPreviewW - width) / 2;
        this.imageObject.top = ((this.templateDOM.winPreviewH - height) / 2);
        this.imageObject.rotateDeg = totalDegress;
      },
      //上下张
      viewUpDown(type){
        var sub;
        var self = this;
        this.previewUrls.forEach(function(item,index){
          if(item.src.includes(self.previewImageURL)){
            sub = index;
          }
        });
        if(sub > 0 && type == "prev"){
          this.previewUrls[sub-1] ? this.previewImg(this.previewUrls[sub-1].src,sub-1) : false;
        }
        if (sub < this.previewUrls.length && type == "next") {
          this.previewUrls[sub+1] ? this.previewImg(this.previewUrls[sub+1].src,sub+1) : false;
        }
      },
      //鼠标滚动
      mouseWheelHandler(event){
        var event = event || window.event;
        event.preventDefault();
        var delta = 1;
        var ratio = 0.1;

        if (event.deltaY) {
          delta = event.deltaY > 0 ? 1 : -1;
        } else if (event.wheelDelta) {
          delta = -e.wheelDelta / 120;
        } else if (event.detail) {
          delta = event.detail > 0 ? 1 : -1;
        }
        this.zoomInOut(-delta * ratio, true);
      },
      //放大放小
      zoomInOut(ratio, hasZoom){
        var width, height;
        ratio = parseFloat(ratio);
        if (this.isNumber(ratio)) {
          if (ratio < 0) {
            ratio = 1 / (1 - ratio);
          } else {
            ratio = 1 + ratio;
          }
        }
        width = this.imageObject.width * ratio;
        height = this.imageObject.height * ratio;
        var percent;
        if (hasZoom == "zoomOut") {
          percent = (this.imageObject.width / ratio / this.imageObject.naturalWidth * 100).toFixed(0);			//缩小百分比
        } else {
          percent = (width / this.imageObject.naturalWidth * 100).toFixed(0);							//放大百分比
        }
        if (percent <= 5) {
          percent = 5;
          width = this.imageObject.naturalWidth / 20;
          height = this.imageObject.naturalHeight / 20;
        } else if (percent > 90 && percent < 110) {
          percent = 100;
        } else if (percent > 1600) {
          percent = 1600;
          width = this.initialImage.naturalWidth * 16;
          height = this.initialImage.naturalHeight * 16;
        }
        this.dealPosition(height,true);
        this.dealPosition(width,false);
        this.imageObject.width = width;
        this.imageObject.height = height;
        this.imageObject.ratio = ratio;
      },
      dealPosition(length, isHeight){ //处理图片放大缩小的视觉效果
        let winPreview = isHeight ? this.templateDOM.winPreviewH : this.templateDOM.winPreviewW,
          oldLength = isHeight ? this.imageObject.height : this.imageObject.width,
          str = isHeight ? 'top' : 'left';
        if(length <= winPreview){
          this.imageObject[str] = (winPreview - length) / 2;
        } else {
          this.imageObject[str] = winPreview / 2 - (length.toFixed() / oldLength.toFixed()) * (winPreview / 2 - this.imageObject[str])
          if (this.imageObject[str] > 0) {
            this.imageObject[str] = 0
          } else if(winPreview - this.imageObject[str] > length){
            this.imageObject[str] = winPreview - length;
          }
        }
      },
      isNumber(n){
        return typeof n === 'number' && !isNaN(n);
      },
    },
  }
</script>
<style scoped>
  .qwui-preview_window {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background: rgba(0, 0, 0, .4);
  }
  .qwui-preview_bottom_bar {
    position: absolute;
    bottom: 0;
    align-content: space-between;
    width: 100%;
    height: 45px;
    background: rgba(0, 0, 0, .4);
  }
  .qwui-preview_options {
    position: relative;
    width: 100%;
    margin: 0 auto;
    padding-top: 14px;
    text-align: center;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .qwui-preview_options li{
    display: inline-block;
    position: relative;
    margin-left: 20px;
    line-height: 1;
  }
  .qwui-preview_options li:first-child{
    margin-left: 0;
  }
  .qwui-preview_num{
    display: inline-block;
    position: absolute;
    top:0;
    left:0;
    margin: 10px;
    color:#FEFEFE;
    font-size: 16px;
  }
  .qwui-close_window{
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 35px;
    height: 27px;
    background:-66px 323px url(../../assets/images/rolateimg.png);
    cursor: pointer;
  }
  .qwui-preview_options li .icon{
    display: inline-block;
    position: relative;
    width: 19px;
    height: 19px;
    background-image: url(../../assets/images/rolateimg.png);
    opacity: 1;
    cursor: pointer;
  }
  .qwui-preview_options li .icon-prev{background-position: -78px 271px;}
  .qwui-preview_options li .icon-enlarge{background-position: -78px 101px;}
  .qwui-preview_options li .icon-lessen{background-position: -78px 120px;}
  .qwui-preview_options li .icon-resize{background-position: -78px 139px;}
  .qwui-preview_options li .icon-rotate{background-position: -78px 171px;}
  .qwui-preview_options li .icon-download{background-position: -78px 191px;}
  .qwui-preview_options li .icon-next{background-position: -78px 232px;}
  .qwui-preview_content {
    position: relative;
    height: 100%;
  }
  .qwui-preview_image{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    max-height: 100%;
    max-width: 100%;
    cursor: -webkit-grab;
  }
  .qwui-preview_row{
    display: block;
    position: absolute;
    top: 50%;
    width: 45px;
    height: 45px;
    margin-top: -25px;
    background-image: url(../../assets/images/rolateimg.png);
    cursor: pointer;
    opacity: 1;
  }
  .qwui-preview_row.right{
    right: 10px;
    background-position: -5px 192px;
  }
  .qwui-preview_row.left{
    left: 10px;
    background-position: -5px 240px;
  }
  .disabled{
    opacity: 0.3;
  }
</style>
