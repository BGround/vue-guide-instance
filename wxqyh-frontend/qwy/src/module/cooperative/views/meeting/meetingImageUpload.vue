<template>
  <div class="qwui-upload_content">
    <input type="file"
           v-show="false"
           ref="input"
           :id="uploadConfig.uploadFileId"
           @change="uploadChange"
           :multiple="false"
           accept="image/jpeg,image/jpg,image/png,image/gif">
    <label :for="uploadConfig.uploadFileId" class="qwui-upload">上传</label>
    <slot name="upload_tip_text"></slot>
    <div class="qwui-upload_box">
      <div class="qwui-upload_img"
           v-show="imgShow"
           :class="'qwui-upload_img_'+uploadConfig.showType">
        <img :src="imageURL">
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
  </div>
</template>

<script>
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import { getCropData } from 'vue-cropper';

  export default {
    props:{
      uploadConfig:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data(){
      return {
        imgShow:false,
        loadShow:false,
        errorShow:false,
        imageURL:''
      }
    },
    watch:{
      //监听上传封面图片回显数据（用于编辑页面）
      'uploadConfig.imageObj':{
        handler:function(){
          if(Object.keys(this.uploadConfig.imageObj).length>0){
            this.fileName = this.uploadConfig.imageObj.fileName;
            this.downFilePath = this.uploadConfig.imageObj.imageURL;
            this.imageURL = _.compressURL + this.uploadConfig.imageObj.imageURL;
            this.imgShow = true;
          }
        },
        deep:true
      },
    },
    methods:{
      //上传图片
      uploadChange(even){
        var obj=even.target;
        var self = this;
        if(obj) {
          var imagePath = obj.value;
          var isExt = imagePath.lastIndexOf('.');
          if (isExt > -1) {
            var type = imagePath.substring(imagePath.lastIndexOf('.') + 1, imagePath.length).toLowerCase();
            if (type != undefined && type != "" && type != 'jpg' && type != 'png' && type != 'jpeg') {
              dataBase.top_alert('图片仅支持JPG/PNG/JPEG格式', false, 3000);
              return false;
            }
          } else {
            return false;
          }
          if (obj.files && obj.files[0]) {
            var file = obj.files[0];
            if (!this.fileSizeJudpe(file, 10)) {
              return false;
            }
            var URL = window.URL || window.webkitURL;
            var img = new Image();
            img.src = URL.createObjectURL(file);
            var base64 = "";
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
              self.imgShow = false;
              self.loadShow = true;
              _.ajax({
                url: _.baseURL + '/imageupload/imageUploadAction!doUploadMgrImageBase64.action',
                type: 'post',
                data: {
                  imgFileBase: base64,
                  agent: self.uploadConfig.agent || dataBase.agentCode
                },
                success: function (result) {
                  if (result.code === "0") {
                    self.imgShow = true;
                    self.downFilePath = result.data.imgurl;
                    self.imageURL = _.compressURL + result.data.imgurl;
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

              /* this.fileName = file.name;
            var URL = window.URL || window.webkitURL;
            var img = new Image();
            img.src = URL.createObjectURL(file);
            this.vueCropperOption.img = img.src;
            this.isShowCutOutArea = true;
            this.$refs.input.value = '';*/
            }
          }
        }
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
    },
    components:{
      qwuiButton
    }
  }
</script>

<style lang="scss" scoped>
  $height_small: 65px;
  $height_middle: 73px;
  $height_large: 130px;
  $width_inner: 130px;
  $width_outer: 138px;

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
      background: url(~assets/images/ic_b-delet.png) no-repeat;
      background-size:16px 16px;
  &:hover{
     background: url(~assets/images/ic_b-delet_hover.png) no-repeat;
   }
  }
  }

  @-webkit-keyframes fade{
    from{opacity:1;}
    to{opacity:0.1;}
  }

  .qwui-upload_content{
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
</style>
