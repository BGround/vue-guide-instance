<template>
  <div>
    <div class="qwui-upload_item">
      <input type="file"
             v-show="false"
             ref="input"
             :id="uploadConfig.uploadFileId"
             @change="uploadChange"
             :multiple="uploadConfig.isMoreImg?'multiple':false"
             accept="image/jpeg,image/jpg,image/png,image/gif">
      <label v-if="!uploadConfig.isMoreImg"
        class="qwui-upload"
        @click="showCutOutWindow">上传</label>
      <label v-if="uploadConfig.isMoreImg"
             class="qwui-upload"
             :for="uploadConfig.uploadFileId">上传</label>
      <slot name="upload_tip_text"></slot>

      <!--封面图片上传-->
      <div class="qwui-upload_box"
           v-if="!uploadConfig.isMoreImg">
        <div class="qwui-upload_img"
             v-show="imgShow"
             :class="'qwui-upload_img_'+uploadConfig.showType">
          <img :src="imageURL"
               alt=""
               ref="previewSize"
               @click="previewImg"
               >
          <i class="icon iconfont public-web-ic_b-delete qwui-upload_close" @click="delImage"></i>
        </div>
        <div class="qwui-loading_img_loading"
             v-show="loadShow"
             :class="'qwui-loading_img_loading_'+uploadConfig.showType">
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="qwui-upload_fail"
             v-show="errorShow"
             :class="'qwui-upload_fail_'+uploadConfig.showType">
          <div class="qwui-upload_fail_box"
               :class="'qwui-upload_fail_box_'+uploadConfig.showType">
            <div class="qwui-upload_fail_tip">
              重新上传
            </div>
            <i class="icon iconfont public-web-ic_b-prompt qwui-icon_prompt"></i>
          </div>
          <i class="icon iconfont public-web-ic_b-delete qwui-upload_close" @click="delErrorImage"></i>
        </div>
      </div>

      <!--多图上传-->
      <div class="qwui-upload_box" v-if="uploadConfig.isMoreImg">
        <div v-for="(item,index) in moreList" :key="index">
          <div class="qwui-upload_img"
               v-show="item.imgShow"
               :class="'qwui-upload_img_'+uploadConfig.showType">
            <img :src="item.imageURLComplete"
                 alt=""
                 ref="previewSize"
                 @click="previewImg(item.imageURLComplete,item.fileName,index,item.imageURL)"
            >
            <i class="qwui-upload_close" @click="delImage(index)"></i>
          </div>
          <div class="qwui-loading_img_loading"
               v-show="item.loadShow"
               :class="'qwui-loading_img_loading_'+uploadConfig.showType">
            <span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span>
          </div>
          <div class="qwui-upload_fail"
               v-show="item.errorShow"
               :class="'qwui-upload_fail_'+uploadConfig.showType">
            <div class="qwui-upload_fail_box"
                 :class="'qwui-upload_fail_box_'+uploadConfig.showType">
              <div class="qwui-upload_fail_tip">
                重新上传
              </div>
              <i class="icon iconfont public-web-ic_b-prompt qwui-icon_prompt"></i>
            </div>
            <i class="qwui-upload_close" @click="delErrorImage(index)"></i>
          </div>
      </div>
      </div>
    </div>
    <!--封面图片上传窗口-->
    <div class="qwui-cut_out_window" v-if="isShowCutOutWindow">
      <div class="qwui-cut_out_title">
        <div>上传封面</div>
        <i class="qwui-cut_out_close" @click="hideCutOutWindow">×</i>
      </div>
      <div class="qwui-cut_out_content">
        <label class="qwui-cut_out_upload"
               :for="uploadConfig.uploadFileId"
               v-show="!isShowCutOutArea">
          <div class="qwui-cut_out_select">
            <div class="icon iconfont public-web-ic_b-edd qwui-cut_out_icon"></div>
            <div class="qwui-cut_out_name">选择图片</div>
            <slot name="tip">
              <div class="qwui-cut_out_tip">只支持jpg、jpeg、png，大小不超过2M建议尺寸940 x 400</div>
            </slot>
          </div>
        </label>
        <div class="qwui-cut_out_area" v-if="isShowCutOutArea">
          <VueCropper
            ref="cropper"
            :img="vueCropperOption.img"
            :full="vueCropperOption.full"
            :outputSize="vueCropperOption.outputSize"
            :canScale="vueCropperOption.canScale"
            :centerBox="vueCropperOption.centerBox"
            :infoTrue="vueCropperOption.infoTrue"
            :info="vueCropperOption.info"
            :autoCrop="vueCropperOption.autoCrop"
            :canMove="vueCropperOption.canMove"
            :fixed="vueCropperOption.fixed"
            :outputType="vueCropperOption.outputType"
            :autoCropWidth="vueCropperOption.autoCropWidth"
            :autoCropHeight="vueCropperOption.autoCropHeight"
            :fixedNumber="vueCropperOption.fixedNumber"></VueCropper>
        </div>
        <div class="qwui-cut_out_set" v-show="isShowCutOutArea">
          <label class="qwui-cut_out_again" :for="uploadConfig.uploadFileId">重新上传</label>
          <div class="qwui-cut_out_options">
            <span class="icon iconfont public-web-ic_b-expand qwui-cut_out_option" @click="changeScale(1)"></span>
            <span class="icon iconfont public-web-ic_b-narrow qwui-cut_out_option" @click="changeScale(-1)"></span>
            <span class="icon iconfont public-web-ic_b-rotate qwui-cut_out_option" @click="rotateRight"></span>
          </div>
        </div>
        <div class="qwui_cut_out_btn">
          <div class="qwui-cut_out_confirm" @click="cutoutImage">确定</div>
          <div class="qwui-cut_out_cancel" @click="hideCutOutWindow">取消</div>
        </div>
      </div>
    </div>
    <!--预览图片窗口-->
    <div class="qwui-preview_window"
         :style="{height:screenHeight+'px'}"
         v-show="isShowPreviewWindow">
      <div class="qwui-preview_title_bar">
        <div class="qwui-preview_img_name">{{uploadConfig.isMoreImg?previewName:fileName}}</div>
        <div class="qwui-preview_options">
          <div class="icon iconfont public-web-ic_b-rotating_l qwui-preview_option" @click.stop.prevent="rotateImage('left')"></div>
          <div class="icon iconfont public-web-ic_b-rotating_r qwui-preview_option" @click.stop.prevent="rotateImage('right')"></div>
          <div class="icon iconfont public-web-ic_b-download qwui-preview_option" @click.stop.prevent="downImage"></div>
          <div class="icon iconfont public-web-ic_b-grouping_del qwui-preview_option" @click.stop.prevent="hidePreviewImg"></div>
        </div>
      </div>
      <div class="qwui-preview_content" ref="previewContent" @click="hidePreviewImg">
        <img :src="uploadConfig.isMoreImg?previewImageURL:imageURL"
             class="qwui-preview_image"
             alt=""
             :style="{
                 maxWidth:imageObject.width+'px',
                 maxHeight:imageObject.height+'px',
                 width:imageObject.width+'px',
                 height:imageObject.height+'px',
                 left:imageObject.left+'px',
                 top:imageObject.top+'px',
                 transform:'rotate('+imageObject.rotateDeg+'deg)'}">
          <div v-if="uploadConfig.isMoreImg"
             class="icon iconfont public-web-ic_b-lift qwui-preview_row qwui-preview_left_row"
             @click.stop="viewUpDown('prev')"></div>
        <div v-if="uploadConfig.isMoreImg"
             class="icon iconfont public-web-ic_b-right qwui-preview_row qwui-preview_right_row"
             @click.stop="viewUpDown('next')"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { VueCropper }  from 'vue-cropper';

  export default {
    props:{
      uploadConfig:{
        type:Object,
        required:false,
        default:function(){
          return {
            uploadFileId:'aa',//input:file 的id
            showType:'large',//展示图片的尺寸
            agent:dataBase.agentCode,//哪个模块agent
            imageObj:{
              imageURL:'',
              fileName:'',
            },//封面图片数据对象
            isMoreImg:false,//true：多图,false：封面图片
            moreList:[{
              imageURL:'',
              fileName:'',
            }],//多图列表
          }
        }
      }
    },
    created(){
      //给予裁剪比例
      this.vueCropperOption.fixedNumber = this.sizeRatioOption[this.uploadConfig.showType];
      this.screenWidth = document.documentElement.clientWidth;
      this.screenHeight = document.documentElement.clientHeight;
    },
    watch:{
      //监听上传封面图片回显数据（用于编辑页面）
      'uploadConfig.imageObj':{
        handler:function(){
          if(Object.keys(this.uploadConfig.imageObj).length>0){
            var url = _.baseURL+"/portal/errcode/errcodeAction!loadImage.action?imgUrl=" + encodeURIComponent(_.localport + this.uploadConfig.imageObj.imageURL);
            this.vueCropperOption.img = this.imageURL = url;
            this.fileName = this.uploadConfig.imageObj.fileName;
            this.downFilePath = this.uploadConfig.imageObj.imageURL;
            this.imgShow = true;
          }
        },
        deep:true
      },
      //监听多张图片回显数据（用于编辑页面）
      'uploadConfig.moreList':{
        handler:function(){
          if(this.uploadConfig.moreList&&this.uploadConfig.moreList.length>0){
            this.uploadConfig.moreList.forEach(function(item,index){
              item['loadShow'] = false;
              item['errorShow'] = false;
              item['imgShow'] = true;
              item['imageURL'] = item.imageURL;
              item['imageURLComplete'] = _.fileDownURL + item.imageURL;
            });
            this.moreList = this.uploadConfig.moreList.slice();
          }
        },
        deep:true,
      }
    },
    data(){
      return{
        dataBase,
        sizeRatioOption:{//配置比例
          small:[2.35,1],
          middle:[2,1],
          large:[1,1],
        },
        imageUploadPathPC: "/imageupload/imageUploadAction!doUploadMgrImageBase64.action", //pc端上传图片接口
        imageURL:'',//图片的url
        imgShow:false,//图片的显示
        loadShow:false,//loading的显示
        errorShow:false,//错误的显示
        isShowCutOutWindow:false,//裁剪窗口显示
        isShowCutOutArea:false,//裁剪区域显示
        vueCropperOption:{
          img:'',//裁剪图片的地址
          outputSize:1,//裁剪生成图片的质量
          canScale:true,//图片是否允许滚轮缩放
          autoCrop:true,//是否默认生成截图框
          canMove:true,//上传图片是否可以移动
          fixed: true,//是否开启截图框宽高固定比例
          fixedNumber:[1,1],//截图框的宽高比例
          full:true,//是否输出原图比例的截图
          outputType:'jpeg',//输出格式
          centerBox:true,//截图框是否被限制在图片里面
          infoTrue:true,//	true 为展示真实输出图片宽高 false 展示看到的截图框宽高
          info:true,//	裁剪框的大小信息
          autoCropWidth:544,//	默认生成截图框宽度
          autoCropHeight:231,//	默认生成截图框高度
        },
        isShowPreviewWindow:false,//预览图片窗口显示
        imageObject:{//预览图片数据
          naturalWidth:'',
          naturalHeight:'',
          width:'',
          height:'',
          left:'',
          top:'',
        },
        screenWidth:'',//屏幕宽度
        screenHeight:'',//屏幕高度
        templateDOM:{},//DOM对象
        initialImage:{},//初始图片对象
        fileName:'',//图片名称
        downFilePath:'',//下载图片路径
        moreList:[],//多图上传数组
        previewImageURL:'',//预览图片url
        previewName:'',//预览图片名称
      }
    },
    methods:{
      //上下张
      viewUpDown(type){
        var sub;
        var self = this;
        this.moreList.forEach(function(item,index){
          if(item.imageURLComplete.includes(self.previewImageURL)){
            sub = index;
          }
        });
        if(sub > 0 && type == "prev"){
          this.moreList[sub-1] ? this.previewImg(this.moreList[sub-1].imageURLComplete,this.moreList[sub-1].fileName,sub-1,this.moreList[sub-1].imageURL) : false;
        }
        if (sub < this.moreList.length && type == "next") {
          this.moreList[sub+1] ? this.previewImg(this.moreList[sub+1].imageURLComplete,this.moreList[sub+1].fileName,sub+1,this.moreList[sub+1].imageURL) : false;
        }
      },
      //下载图片
      downImage(){
        window.location.href = _.fileDownURL + _.downFileURL +encodeURIComponent(this.downFilePath) + '&fileFileName=' + encodeURIComponent(this.fileName);
      },
      //旋转图片
      rotateImage(direction){
        var degrees = 90;
        if(direction=='left'){
          degrees = -90;
        }
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
        this.imageObject.top = ((this.templateDOM.winPreviewH - height) / 2)-60;
        this.imageObject.rotateDeg = totalDegress;
      },
      //预览图片
      previewImg(previewImageURL,fileName,index,imageDownURL){
        var img = this.$refs.previewSize;
        if(this.uploadConfig.isMoreImg){
          this.downFilePath = imageDownURL;
          this.fileName = fileName;
          this.previewImageURL = previewImageURL;
          this.previewName = fileName;
          img = img[''+index];
        }
        this.isShowPreviewWindow = true;
        var aspectRatio = img.naturalWidth / img.naturalHeight;
        var mtH = (this.screenHeight - img.naturalHeight) / 2,
          mlW = (this.screenWidth - img.naturalWidth) / 2;
        this.imageObject = {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          aspectRatio: aspectRatio,
          ratio: img.naturalWidth / img.naturalWidth,
          width: img.naturalWidth,
          height: img.naturalHeight,
          imgRatio: img.naturalWidth / img.naturalHeight,
          left: mlW,
          top: mtH - 60,
          rotateDeg: 0,
          action: false,
        };
        this.initialImage = this.imageObject;//保存原图对象
        this.templateDOM={
          winPreviewW: this.screenWidth,                 //灰色背景宽度
          winPreviewH: this.screenHeight,                //灰色背景高度
        }

        this.mouseWheel();
      },
      //滑轮滚动
      mouseWheel(){
        this.$refs.previewContent.addEventListener('mousewheel',this.mouseWheelHandler);
        this.$refs.previewContent.addEventListener('wheel',this.mouseWheelHandler);
        this.$refs.previewContent.addEventListener('DOMMouseScroll',this.mouseWheelHandler);
      },
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
        this.imageObject.top = ((this.templateDOM.winPreviewH - height) / 2)-60;
        this.imageObject.left = (this.templateDOM.winPreviewW - width) / 2;
        this.imageObject.width = width;
        this.imageObject.height = height;
        this.imageObject.ratio = ratio;
      },
      isNumber(n){
        return typeof n === 'number' && !isNaN(n);
      },
      //隐藏预览图片
      hidePreviewImg(){
        this.isShowPreviewWindow = false;
      },
      //裁剪图片
      cutoutImage(){
        this.isShowCutOutWindow = false;
        this.dataBase.mask = false;
        if(this.$refs.cropper) {
          this.loadShow = true;
          this.errorShow = false;
          this.imgShow = false;
          // 获取截图的base64 数据
          this.$refs.cropper.getCropData((data) => {
            // do something
            var self = this;
            _.ajax({
              url: _.baseURL + self.imageUploadPathPC,
              type: 'post',
              data: {
                imgFileBase: data,
                agent: self.uploadConfig.agent||dataBase.agentCode
              },
              success: function (result) {
                if (result.code === "0") {
                  self.imgShow = true;
                  self.downFilePath = result.data.imgurl;
                  self.imageURL = _.fileDownURL + result.data.imgurl;
                  self.$emit('imageObj', {
                    imageURL: result.data.imgurl,
                    fileName: self.fileName
                  });
                } else {
                  self.errorShow = true;
                }
                self.loadShow = false;
              },
              error: function () {
                self.loadShow = false;
                self.errorShow = true;
              }
            })
          })
        }
      },
      //裁剪图片旋转
      rotateRight(){
        this.$refs.cropper.rotateRight();
      },
      //裁剪图片放大缩小
      changeScale(num){
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      //删除错误提示
      delErrorImage(index){
        if(this.uploadConfig.isMoreImg){
          this.moreList.splice(index,1);
        }else {
          this.errorShow = false;
        }
      },
      //删除图片
      delImage(index){
        if(this.uploadConfig.isMoreImg){
          this.moreList.splice(index,1);
          this.$emit('moreImgUpload',this.moreList);
        }else{
          this.imgShow = false;
          this.isShowCutOutArea = false;
          this.imageURL = '';
          this.$emit('imageObj', {
            imageURL: '',
            fileName: ''
          });
        }
      },
      //展示截取图片窗口
      showCutOutWindow(){
        this.isShowCutOutWindow = true;
        this.dataBase.mask = true;
        if(this.imageURL){
          this.isShowCutOutArea = true;
        }
      },
      //隐藏截取图片窗口
      hideCutOutWindow(){
        this.isShowCutOutWindow = false;
        this.dataBase.mask = false;
      },
      //判断上传文件大小
      fileSizeJudpe(file,size){
        var baseSize = 1048576;
        if (file.size > size*baseSize){//10485760
          this.dataBase.top_alert("文件大小不能超过"+size+"M，请重新选择",false,3000);
          this.$refs.input.value = '';
          return false;
        }
        return true;
      },
      //多图上传
      moreImgUpload(even){
        var obj=even.target;
        var files = obj.files;
        var self = this;
        Object.keys(files).forEach(function(key){
          var file = files[key];
          var imageName = file.name;
          var isExt = imageName.lastIndexOf('.');
          if(isExt>-1){
            var type = imageName.substring(imageName.lastIndexOf('.') + 1, imageName.length).toLowerCase();
            if (type != undefined && type != "" && type != 'jpg' && type != 'png' && type != 'jpeg') {
              self.dataBase.top_alert('图片仅支持JPG/PNG/JPEG格式',false,3000);
              return false;
            }
          }else{
            return false;
          }
          if(!self.fileSizeJudpe(file,2)){
            return false;
          }
          self.moreList.push({
            imageURL:'',
            loadShow:true,
            errorShow:false,
            imgShow:false,
            fileName:imageName,
          });
          var URL = window.URL || window.webkitURL;
          var img = new Image();
          img.src = URL.createObjectURL(file);
          var base64 = "";
          var currIndex = self.moreList.length-1;
          img.onload = function () {
            var that = this;
            var quality = 1;
            var maxWidth = 2560;
            var w = that.width, h = that.height, scale = w / maxWidth; //生成比例
            if (w > maxWidth) { //如果图片大于最大宽度
              quality = 0.8;//压缩图片质量0-1，值越大质量越好
              w = maxWidth;
              h = h / scale;
            }
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(that, 0, 0, w, h);
            base64 = canvas.toDataURL('image/jpeg', quality);
            _.ajax({
              url: _.baseURL + self.imageUploadPathPC,
              type: 'post',
              data: {
                imgFileBase: base64,
                agent: self.uploadConfig.agent||dataBase.agentCode
              },
              success: function (result) {
                self.$refs.input.value = '';
                self.moreList[currIndex]['loadShow'] = false;
                if (result.code === "0") {
                  self.moreList[currIndex]['imageURLComplete'] = _.fileDownURL + result.data.imgurl;
                  self.moreList[currIndex]['imageURL'] = result.data.imgurl;
                  self.moreList[currIndex]['imgShow'] = true;
                  self.$emit('moreImgUpload',self.moreList);
                } else {
                  self.moreList[currIndex]['errorShow'] = true;
                }
              },
              error:function(){
                self.moreList[currIndex]['loadShow'] = false;
                self.moreList[currIndex]['errorShow'] = false;
                self.moreList[currIndex]['imgShow'] = false;
                _.alert("提示","网络错误");
                return;
              }
            });
          }
        });
      },
      //上传图片
      uploadChange(even){
        if(this.uploadConfig.isMoreImg){
          this.moreImgUpload(even);
          return;
        }
        var obj=even.target;
        if(obj){
          var imagePath = obj.value;
          var isExt = imagePath.lastIndexOf('.');
          if(isExt>-1){
            var type = imagePath.substring(imagePath.lastIndexOf('.') + 1, imagePath.length).toLowerCase();
            if (type != undefined && type != "" && type != 'jpg' && type != 'png' && type != 'jpeg') {
              this.dataBase.top_alert('图片仅支持JPG/PNG/JPEG格式',false,3000);
              return false;
            }
          }else{
            return false;
          }
          if (obj.files && obj.files[0]) {
            var file = obj.files[0];
            if(!this.fileSizeJudpe(file,2)){
              return false;
            }
            this.fileName = file.name;
            var URL = window.URL || window.webkitURL;
            var img = new Image();
            img.src = URL.createObjectURL(file);
            this.vueCropperOption.img = img.src;
            this.isShowCutOutArea = true;
            this.$refs.input.value = '';
          }
        }
      },
    },
    components: {
      VueCropper
    },
  }
</script>

<style lang="scss" scoped>
  $height_small: 51px;
  $height_middle: 73px;
  $height_large: 120px;
  $width_inner: 120px;
  $width_outer: 128px;

  @mixin closeBtn{
    .qwui-upload_close{
      position:absolute;
      right: 0;
      top: 0;
      width: 16px;
      height: 16px;
      text-align: center;
      border-radius: 50%;
      cursor:pointer;
      background: url(../../../assets/images/ic_b-delet.png) no-repeat;
      background-size:16px 16px;
      &:hover{
        background: url(../../../assets/images/ic_b-delet_hover.png) no-repeat;
      }
    }
  }

  @mixin cutoutBtn{
    position: absolute;
    bottom: 25%;
    width: 70px;
    height: 32px;
    line-height: 30px;
    color:#fff;
    background:rgba(255,150,0,1);
    border-radius:2px;
    border:1px solid #F87B00;
    box-sizing: border-box;
    text-align: center;
    cursor:pointer;
  }

  @-webkit-keyframes fade{
    from{opacity:1;}
    to{opacity:0.1;}
  }
  .qwui-upload_item{
    display: inline-block;
    vertical-align: top;
    .qwui-upload{
      display: inline-block;
      width: 60px;
      height: 32px;
      line-height: 30px;
      text-align: center;
      background: #fff;
      color:#333;
      border-radius:4px;
      border: 1px solid #CBCBCB;
      box-sizing: border-box;
      cursor: pointer;
    }
    .qwui-upload_box{
      display: flex;
      width: 450px;
      flex-wrap: wrap;
      .qwui-loading_img_loading{
        position: relative;
        flex:0 1 $width_inner;
        background: #f5f5f5;
        border-radius: 2px;
        margin-top: 8px;
        width: $width_inner;
        margin-right: 16px;
        &.qwui-loading_img_loading_small{
          height: $height_small;
        }
        &.qwui-loading_img_loading_middle{
          height: $height_middle;
        }
        &.qwui-loading_img_loading_large{
          height: $height_large;
        }
        span{
          position: absolute;
          top: 45%;
          left: 50%;
          width: 3px;
          height: 7px;
          animation: fade 1s linear infinite;
          background: #666;
          opacity: 0;
          border-radius: 50%;
          @for $i from 1 through 8{
            &:nth-child(#{$i}){
              transform:rotate(($i - 1)*45deg) translate(0,-142%);
              @if $i == 1{
                animation-delay:0s;
              }@else{
                animation-delay:(9 - $i)*(-0.125)+s;
              }
            }
          }
        }
      }
      .qwui-upload_fail{
        position: relative;
        flex:0 1 $width_outer;
        padding-top: 8px;
        width: $width_outer;
        overflow: hidden;
        margin-right: 16px;
        &.qwui-upload_fail_small{
          height: $height_small;
        }
        &.qwui-upload_fail_middle{
          height: $height_middle;
        }
        &.qwui-upload_fail_large{
          height: $height_large;
        }
        .qwui-upload_fail_box{
          position:relative;
          width:130px;
          text-align: center;
          height: 100%;
          background: #f7f7f7;
          &:hover{
            .qwui-upload_fail_tip{
              bottom:0;
            }
          }
          &.qwui-upload_fail_box_small{
            line-height: $height_small;
          }
          &.qwui-upload_fail_box_middle{
            line-height: $height_middle;
          }
          &.qwui-upload_fail_box_large{
            line-height: $height_large;
          }
          .qwui-upload_fail_tip{
            position:absolute;
            left: 0;
            bottom: -24px;
            width: 100%;
            height: 24px;
            line-height: 24px;
            font-size: 13px;
            color:#fff;
            background: #F56262;
            transition:all .5s;
          }
          .qwui-icon_prompt{
            font-size: 24px;
            color:#f56162;
          }
        }
        @include closeBtn;
      }
      .qwui-upload_img{
        position: relative;
        flex:0 1 $width_outer;
        padding-top: 8px;
        width: $width_outer;
        margin-right: 8px;
        &.qwui-upload_img_small{
          height: $height_small;
          img{
            width: $width_inner;
            height: $height_small;
            object-fit: contain;
            cursor: pointer;
          }
        }
        &.qwui-upload_img_middle{
          height: $height_middle;
          img{
            width: $width_inner;
            height: $height_middle;
            object-fit: contain;
            cursor: pointer;
          }
        }
        &.qwui-upload_img_large{
          height: $height_large;
          img{
            width: $width_inner;
            height: $height_large;
            object-fit: contain;
            cursor: pointer;
          }
        }
        @include closeBtn;
      }
    }
  }

  .qwui-cut_out_window{
    position:fixed;
    top: 50%;
    left: 50%;
    z-index:101;
    width: 600px;
    transform: translate(-50%,-50%);
    background: #fff;
    border-radius: 4px;
    box-shadow:5px 0px 10px rgba(0,0,0,0.2);
    .qwui-cut_out_title{
      position:relative;
      width: 100%;
      height: 60px;
      line-height: 60px;
      color:#333;
      background: rgb(247,247,247);
      font-size: 18px;
      padding-left: 20px;
      box-sizing: border-box;
      border-radius: 4px;
      .qwui-cut_out_close{
        position: absolute;
        right: 20px;
        top: 17px;
        width: 29px;
        height: 23px;
        float: right;
        font-size: 40px;
        font-weight: 100;
        line-height: 17px;
        color: #ccc;
        cursor: pointer;
        transition: transform 0.2s;
        &:hover{
          transform: rotate(-90deg);
        }
      }
    }
    .qwui-cut_out_content{
      position: relative;
      padding:30px 28px 10px 28px;
      box-sizing: border-box;
      .qwui-cut_out_upload{
        position:relative;
        display: block;
        height:330px;
        background:rgba(242,242,242,1);
        cursor: pointer;
        .qwui-cut_out_select{
          position:absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 30%;
          width: 254px;
          text-align: center;
          .qwui-cut_out_icon{
            height: 48px;
            line-height: 48px;
            border-radius: 50%;
            color: #C31725;
            text-align: center;
            font-size: 56px;
            margin: 0 auto;
          }
          .qwui-cut_out_name{
            margin-top: 20px;
            color:#333;
            font-size: 16px;
          }
          .qwui-cut_out_tip{
            margin-top: 12px;
            color:#999;
          }
        }
      }
      .qwui-cut_out_area{
        height:330px;
      }
      .qwui-cut_out_set{
        display: flex;
        justify-content:space-between;
        margin-top: 17px;
        .qwui-cut_out_again{
          color:#F87B00;
          cursor: pointer;
          padding-top: 5px;
        }
        .qwui-cut_out_options{
          .qwui-cut_out_option{
            margin-left: 14px;
            color: #999;
            font-size: 22px;
            cursor: pointer;
          }
        }
      }
      .qwui_cut_out_btn{
        position: relative;
        margin-top: 30px;
        height: 72px;
        .qwui-cut_out_confirm{
          @include cutoutBtn;
          left: 35%;
        }
        .qwui-cut_out_cancel{
          @include cutoutBtn;
          background:rgba(255,255,255,1);
          border:1px solid #CBCBCB;
          color:#333;
          right: 35%;
        }
      }
    }
  }

  .qwui-preview_window{
    position:fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background:rgba(0,0,0,.9);
    .qwui-preview_title_bar{
      display: flex;
      align-content: space-between;
      width: 100%;
      height: 60px;
      line-height: 60px;
      color:#fff;
      font-size: 16px;
      .qwui-preview_img_name{
        flex:1;
        padding-left: 31px;
      }
      .qwui-preview_options{
        flex:1;
        padding-right: 21px;
        text-align: right;
        user-select:none;
        .qwui-preview_option{
          display: inline-block;
          width: 20px;
          font-size: 20px;
          color:#ccc;
          margin-left: 36px;
          cursor: pointer;
        }
      }
    }
    .qwui-preview_content{
      position:relative;
      height: 100%;
      .qwui-preview_image{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        max-height: 100%;
        max-width: 100%;
      }
      .qwui-preview_row,.qwui-preview_row{
        position: absolute;
        top: 45%;
        left: 16px;
        transform: translateY(-50%);
        color:#ccc;
        font-size: 20px;
        cursor: pointer;
        &.qwui-preview_right_row{
          left:auto;
          right: 16px;
        }
      }
    }
  }
</style>

