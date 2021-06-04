<template>
  <div>
    <div class="upload" :class="{'padding_upload':isUpload}" v-if="isUpload || imageData.length || newFilesList.length">
      <div class="upload_add" v-if="isUpload">
        <span :class="{'icon_isRequire':isMust  == '1'}" class="pic_name">图片/附件</span>
        <span class="upload_add_pic" @click="openUpload"></span>
      </div>
      <slot></slot>
      <!--图片列表-->
      <div class="qwui-setting_item" v-for="(item, index) in imageData">
        <div class="qwui-fujian">
        <span class="img">
          <img :src="item.src"
               class="previewImages"
               @click="previewImg(item.src)">
        </span>
          <div class="qwui-fujian_text">
            <p class="name">{{item.fileName}}</p>
            <p class="qwui-fujian_size">{{item.fileSizeStr}}</p>
            <p class="arrow">
              <span class="operation" @click="doDelImg(item,index)" v-if="isUpload"><i class="qwui-operate-icon qwui-operate-icon-del"></i></span>
            </p>
          </div>
        </div>
      </div>

      <!--附件列表-->
      <div class="qwui-setting_item" v-for="(item, index) in newFilesList">
        <div class="qwui-fujian">
          <span class="qwui-detail_mediaList_images_new" :class="item.fileExt"></span>
          <div class="qwui-fujian_text">
            <p class="name" @click="openPreviewFile(item)" >{{item.fileName}}</p>
            <p class="qwui-fujian_size">{{item.fileSizeStr}}</p>
            <p class="arrow">
              <!--<a class="operation"><i class="qwui-operate-icon qwui-operate-icon-preview"></i></a>-->
              <span class="operation" @click="downloadFileClick(item)"> <i class="qwui-operate-icon qwui-operate-icon-download"></i></span>
              <span class="operation" @click="deleteFile(item,index)" v-if="isUpload"><i class="qwui-operate-icon qwui-operate-icon-del"></i></span>
            </p>
          </div>
        </div>

      </div>
    </div>
    <!--底部弹出按钮-->
    <dialog-mask :dialogConfig="dialogBottomConfig">
      <!--移动端拍照上传-->
      <div slot="item" class="imageFile" v-if="isMobile">拍照
        <input @click.prevent="uploadPicCam($event,'camera')" ref="input" accept="image/jpeg,image/jpg,image/png,image/gif" type="file" class="imageFileInput"/>
      </div>
      <!--移动端相册选择上传-->
      <div slot="item" class="imageFile" v-if="isMobile">从相册选择
        <input @click.prevent="uploadPicCam($event,'album')" ref="input" accept="image/jpeg,image/jpg,image/png,image/gif" type="file" class="imageFileInput"/>
      </div>
      <!--pc端上传-->
      <div slot="item" class="imageFile" v-if="!isMobile">从相册选择
        <input @change='uploadPicPth' class="imageFileInput" ref="input" type=file accept="image/jpeg,image/jpg,image/png,image/gif"/>
      </div>
      <!--附件上传-->
      <div slot="item" class="imageFile">附件上传
        <input v-if="isMobile" @click.prevent="uploadFile($event)" ref="inputFile" type="file" class="imageFileInput"/>
        <input v-else @change='uploadFile' class="imageFileInput" ref="inputFile" type="file" accept="application/msexcel"/>
      </div>

      <dialog-mask-item
        slot="item"
        name="取消"
        @dialogBtnClick="close"
      >
      </dialog-mask-item>
    </dialog-mask>

    <!--预览图片组件-->
    <previewImages v-if="needPreView"></previewImages>
  </div>
</template>
<script>
  import DialogMask from '@/components/base/dialog_mask_bottom'
  import DialogMaskItem from '@/components/base/dialog_mask_bottom_item'
  import {wx_chooseImage,qw_uploadImages} from '@/utils/uploadImages';
  import {deleteFile,updateFile} from '@/utils/updateFiles';
  import previewImages from "@/components/base/previewImages";
  import EventBus from '@/utils/eventBus';
  export default {
    name: 'QWUpdate',
    props: {
      isUpload: {
        type: Boolean,
        default: true
      },
      imgLimit: Number,                 //图片限制上传最大张数
                                        /*imageList:[{
                                          oldSrc: imgurl,//原始的图片url
                                          src: _.compressURL+imgurl,//加前缀的url
                                          fileSizeStr: fileSizeStr,//图片大小
                                          fileName: fileName//图片名称
                                        }]*/
      imageList: {									    //图片列表
        type: Array,
        default (){
          return [];
        }
      },
      orderId: {                        //图片水印
        type: String,
        default: ''
      },

      filesList: {									    //附件列表
        type: Array,
        default (){
          return [];
        }
      },
      needPreView: {									   //父组件是否已有预览组件，如果有就传false,否则不传
        type: Boolean,
        default: true
      },
      isMust:{
        type:Number,
        default:0,
      }
    },
    components: {
      DialogMask,
      DialogMaskItem,
      previewImages
    },
    data(){
      return {
        dataBase:dataBase,
        dialogBottomConfig:{
          show: false, //控制弹窗显示与否
        },
        isMobile: false,	                           	 //是移动端
        imageData: this.imageList,
        imgCache:"",  //图片缓存

        newFilesList: this.filesList,
      }
    },
    watch:{
      'filesList'(val){
        this.newFilesList = this.filesList;
      }
    },
    mounted (){
      this.isMobile = _.isWeChatApp();
    },
    updated(){
      this.imageData = this.imageList;
    },
    methods:{
      openUpload(){
        this.dialogBottomConfig.show = true;
      },
      uploadPicCam(event,type){   //手机拍照上传
        wx_chooseImage(this.dataBase.wxqyh_uploadfile.agent,this.wxUpdateImage,this.imgLimit,type)
        this.dialogBottomConfig.show = false;
      },
      uploadPicPth(event){ //pc上传
        this.imgCache=event;
        const files = event.target.files;
        if (!files) return;
        if (this.imgLimit && this.imageData.length + files.length > this.imgLimit) {
          return;
        }
        qw_uploadImages(event,this.dataBase.wxqyh_uploadfile.agent,this.pcUpdateImage,this.orderId)
        this.dialogBottomConfig.show = false;
      },
      wxUpdateImage (urls){
        urls.forEach((item)=>{
          this.imageData.push({
            oldSrc:item.imgurl,
            src:_.compressURL+item.imgurl,
            fileSizeStr:item.mediaInfo.fileSizeStr,
            fileName:item.mediaInfo.fileName
          });
        })
        this.updateImageList()
      },
      pcUpdateImage (urls){
        if (urls.imgurl){
          this.imageData.push({
            oldSrc:urls.imgurl,
            src:_.compressURL+urls.imgurl,
            fileSizeStr:urls.mediaInfo.fileSizeStr,
            fileName:urls.mediaInfo.fileName
          });
        }
        this.updateImageList()
      },
      updateImageList (){
        console.log(this.imageData);
        this.$emit('update:imageList',this.imageData)
      },
      //预览图片
      previewImg(previewImageURL){
        EventBus.$emit("previewImages",previewImageURL,this.imageData);
      },
      //删除图片
      doDelImg (index) {
        if (index == this.imageData.length-1 && this.imgCache) { //如果清除了刚刚上传的图片，清除缓存则可以重新上传
          this.imgCache.target.value="";
        }
        this.imageData.splice(index, 1);
        this.updateImageList();
      },
      //上传附件
      uploadFile(even){
        updateFile(even,this.dataBase.wxqyh_uploadfile.agent,this.updateListFun);
        this.dialogBottomConfig.show = false;
      },
      updateListFun(data){
        if(data.mediaInfo){
          this.newFilesList.push(data.mediaInfo);
        }
        this.updateFileList()
      },
      //预览附件
      openPreviewFile(item){
        _.wxqyh_previewFile(item.id,item.url,item.fileName,item.fileExt);
      },
      //下载附件
      downloadFileClick(item){
        _.wxqyh_downloadFile(item.id,item.url,item.fileName);
      },
      //删除附件
      deleteFile (item,index){
        this.newFilesList.splice(index, 1);
        deleteFile(item.id,this.dataBase.wxqyh_uploadfile.agent,'');
        this.dialogBottomConfig.show = false;
        if(this.$refs.inputFile){
          const fileName = this.$refs.inputFile.value;
          if (fileName.indexOf(item.fileName)!= -1) { //如果清除了刚刚上传的文件，清除缓存则可以重新上传
            this.$refs.inputFile.value="";
          }
        }
        this.updateFileList()
      },
      updateFileList (){
        console.log(this.newFilesList);
        this.$emit('update:filesList',this.newFilesList)
      },
      close(){
        this.dialogBottomConfig.show = false;
      },
    },
  }
</script>
<style scoped>
  .pic_name{
    color:#0A1736;
  }
  .upload{
    background-color: #fff;
  }
  .padding_upload{
    padding:0 15px;
  }
  .upload_add{
    display: flex;
    justify-content: space-between;
    font-size:16px;
    padding: 15px 0;
  }
  .upload_add_pic{
    background: url(~assets/images/reim/loan/btn_a-commom_add.png);
    width: 24px;
    height: 24px;
    display: block;
  }
  .imageFile{
    position: relative;
    background: #fff;
    border-bottom: 1px solid #f6f6f6;
  }
  .imageFileInput {
    position: absolute;
    width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    opacity: 0;
  }
  .qwui-setting_item:before{
    content: '';
    position: absolute;
    left:0;
    top: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .qwui-setting_item {
    position: relative;
    overflow: hidden;
    line-height: 2.2;
    clear: both;
    font-size: 16px;
    background-color: white;
  }
  .qwui-fujian {
    display: flex;
    line-height: 1.4;
    padding: 10px 0px 10px 0px;
  }
  .qwui-fujian_text{
    flex: 1;
    position: relative;
    padding-right: 100px;
    padding: 4px 0 0 10px;
  }
  .qwui-fujian_size{
    color: #999;
    font-size: 13px;
  }
  .qwui-fujian .name {
    padding-right: 75px;
    display: -webkit-box;
    font-size: 15px;
    color: #333;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow:ellipsis;
  }
  .qwui-fujian .arrow{
    display: flex;
    flex: 1;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
    font-family: 宋体;
    line-height: 40px;
    color: #ccc;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  }
  .qwui-fujian .arrow .operation {
    display: inline-block;
    width: 36px;
    text-align: center;
  }
  .previewImages{
    width: 36px;
    height: 36px;
    border-radius: 4px;
    margin-top: 4px;
  }
  .icon_isRequire::after {
    margin-left: 5px;
    content: '*';
    color: #E64E4E;
  }
  /* 文件的图标*/
  .qwui-detail_mediaList_images_new{
    display: inline-block;
    width: 34px;
    height: 34px;
    margin-top: 4px;
    border-radius: 4px;
    background: url(~assets/images/icon_file_type_new.png) center no-repeat;
    background-size: cover;
  }
  .qwui-detail_mediaList_images_new.XML,.qwui-detail_mediaList_images_new.FILE{
    background-position: 0 0;
  }
  .qwui-detail_mediaList_images_new.XLS,.qwui-detail_mediaList_images_new.XLSX{
    background-position: -34px 0;
  }
  .qwui-detail_mediaList_images_new.TXT{
    background-position: -68px 0;
  }
  .qwui-detail_mediaList_images_new.DOCX,.qwui-detail_mediaList_images_new.DOC{
    background-position: -102px 0;
  }
  .qwui-detail_mediaList_images_new.PPT,.qwui-detail_mediaList_images_new.PPTX{
    background-position: -136px 0;
  }
  .qwui-detail_mediaList_images_new.PDF{
    background-position: -170px 0;
  }
  .qwui-detail_mediaList_images_new.MP3,.qwui-detail_mediaList_images_new.WMA,.qwui-detail_mediaList_images_new.AMR{
    background-position: -204px 0;
  }
  .qwui-detail_mediaList_images_new.MP4{
    background-position: -238px 0;
  }
  .qwui-detail_mediaList_images_new.RAR,.qwui-detail_mediaList_images_new.ZIP{
    background-position: -272px 0;
  }
</style>
