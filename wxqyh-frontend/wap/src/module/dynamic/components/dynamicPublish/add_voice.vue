<template>
  <div>
    <div class="qwui-title_detaildata">
      <!-- 上传媒体文件（手机端页面）引入  start -->
      <div class="qwui-file_top "><span class="qwui-file_top_tit">语音音频</span>
        <span class="qwui-file_top_btn" @click="mediaFileUpdateClick($event)">
          <input ref="input" type="file"
                   class="upload_file_input" @change="mediaFileUpdate">{{$t('i18n.upload')}}</span>
      </div>
      <div class="qwui-setting_item" v-for="(item, index) in files" :key="index">
        <div class="qwui-fujian">
          <span class="qwui-detail_mediaList_images" :class="item.fileExt"></span>
          <div class="qwui-fujian_text">
            <p class="name">{{item.fileName}}</p>
            <p class="qwui-fujian_size">{{item.fileSizeStr}}</p>
            <p class="arrow">
              <span class="operation" @click="doDelFile(item,index)" ><i class="qwui-operate-icon qwui-operate-icon-del"></i></span>
            </p>
          </div>
        </div>

      </div>
      <!-- 上传媒体文件（手机端页面）引入  end -->
    </div>
  </div>
</template>
<script>
import {isVipSilver,isVipGold} from '@/assets/js/vip-portal.js' 	//判断VIP
export default {
  props: ["dataDetailMsg"],
  data(){
    return {
      sendingFileRequest:false,
      files: [],
      mediaId: [],
      dataBase:dataBase,
      showFileNum: true,
    }
  },
  watch: {
    'dataDetailMsg.mediaList': function () {
      var self = this;
      this.dataDetailMsg.mediaList.forEach(function (e) {
        self.mediaId.push(e.id);
        self.files.push(e);
      });
    },
    mediaId:function (val) {
      this.$emit("listenToChi新增ld", val)
    }
  },
  methods:{
    mediaFileUpdateClick(e){
      //判断是否为金卡会员
      if(!isVipGold(interfaceCode.INTERFACE_CODE_DYNAMIC)){
          e.preventDefault();
          _.alert("提示", "该功能仅限尊享版使用");
          return;
      }
    },
    mediaFileUpdate(even){
      // 限制只能上传一个语音
      if(this.files.length>=1){
          _.alert('提示', '只允许上传一个语音音频文件');
          return;
      }
      if(this.sendingFileRequest){
        return;
      }
        var mediaFile=even.target;
        if(mediaFile){
          var pathValue=mediaFile.value;
          var isExt=pathValue.lastIndexOf(".");
          if(isExt>=0){
            var fileExt = pathValue.substr(isExt).toLowerCase();//获得文件后缀名
            if(fileExt=="" || ".mp3.".indexOf(fileExt+".")<0){
              _.alert('i18n.notice','语音音频只支持MP3格式的文件上传');
              return;
            }
            if (mediaFile.size > 10*1024*1024){//10485760
              _.alert('i18n.notice','i18n.noMoreThanTenM');
              return;
            }
            if (mediaFile.size <= 0){//0
              _.alert('i18n.notice','i18n.fileEmptyDeny');
              return;
            }
            _.showLoading(this.$t('i18n.fileUploading'),true);

            var fileObj=mediaFile.files[0];
            var fileUpdataUrl=_.baseURL+ "/portal/imageupload/imageUploadAction!doUploadFile.action"+"?agent="+this.dataBase.wxqyh_uploadfile.agent;

            this.sendingFileRequest=true;
            var self = this;
            try{
              // FormData 对象
              var form = new FormData();
              form.append("author", "hooyes");                        // 可以增加表单数据
              form.append("file", fileObj);                           // 文件对象
              var xhr = new XMLHttpRequest();
              try{
                xhr.open("post", fileUpdataUrl, true);
              }catch(e){
                _.hideLoading();
                self.sendingFileRequest=false;
                _.alert('i18n.notice','i18n.updateDeny');
                return;
              }
              xhr.onload = function () {
                var result = eval("(" +xhr.responseText + ")");
                _.hideLoading();
                self.sendingFileRequest=false;
                if('0'==result.code){
                  self.mediaId.push(result.data.mediaInfo.id);
                  self.files.push(result.data.mediaInfo);
                }else{
                  _.alert('i18n.notice',result.desc);
                }
              };
              xhr.send(form);
            } catch (e) {
              _.hideLoading();
              self.sendingFileRequest=false;
              _.alert('i18n.notice','i18n.unableToUpload');
            }

          }else{
            _.alert('i18n.notice','i18n.noFormattingSuffix');
          }
        }else{
          _.alert('i18n.notice','i18n.fileEmptyDeny');
        }
    },
    openPreviewFile(item){  //预览附件
      _.wxqyh_previewFile(item.id,item.url,item.fileName,item.fileExt);
    },
    downloadFileClick(item){ //下载附件
      _.wxqyh_downloadFile(item.id,item.url,item.fileName);
    },
    doDelFile (item,index) {
      var self = this;
      _.ajax({
        url: _.baseURL + '/portal/imageupload/imageUploadAction!doDelFile.action',
        type: 'POST',
        data: {
          groupId: self.dataDetailMsg.moduleId?self.dataDetailMsg.moduleId:'',
          mediaId: item.id,
          agent: self.dataBase.wxqyh_uploadfile.agent
        },
        dataType: 'json',
        success: function (result) {
          if(result.code=="0"){
            self.files.splice(index, 1);
            self.mediaId.splice(index,1);
          }else{
            _.alert("提示",result.desc);
          }
        }
      });
      const fileName=this.$refs.input.value;
      if(fileName.indexOf(item.fileName)!=-1){
        this.$refs.input.value="";
      }
    }
  }
}
</script>
<style>
  .qwui-file_top {
    position: relative;
    display: table-cell;
    width: 1%;
    padding: 2px 15px 2px 0;
    vertical-align: middle;
  }
  .qwui-file_top_tit{
    display: inline-block;
    color: #333;
    font-size: 16px;
    background-size: 25px auto;
    line-height: 38px;
  }
  .qwui-file_top:before, .qwui-setting_item:before{
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
  .qwui-file_top_btn{
    position: absolute;
    top: 50%;
    right: 15px;
    height: 25px;
    line-height: 25px;
    min-width: 55px;
    margin-top: -12px;
    padding: 0 5px;
    color: #666;
    font-size: 13px;
    text-align: center;
    background-color: #fbfafc;
    border-radius: 2px;
    box-sizing: border-box;
  }
  .qwui-file_top_btn:before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .upload_file_input {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
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
    padding: 10px 15px 10px 0;
  }
  .qwui-fujian_text{
    flex: 1;
    position: relative;
    padding-right: 100px;
  }
  .qwui-fujian_size{
    color: #999;
    font-size: 13px;
  }
  .qwui-fujian .name {
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
  .qwui-fujian >p{
    height: 40px;
    margin-right: 10px;
    width: 40px;
    background: url('~assets/images/file.png') no-repeat;
    background-size: 100%;
    -webkit-background-size: 100%;
  }
</style>
