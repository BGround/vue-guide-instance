<template>
  <!--<img class="qwui-sign_pic" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595255093320&di=73df5c3a748c20aa6b7bad09ddeadf80&imgtype=0&src=http%3A%2F%2Fcms-bucket.nosdn.127.net%2Fcatchpic%2Fa%2Fa9%2Fa96b4ddfb823d21be2e6589b4f75a747.jpg%3FimageView%26thumbnail%3D550x0"/>-->
  <div class="qwui-enclosure_pic_box" v-if="imgList.length > 0 || newList.length > 0">
    <div v-show="ifshow" >
      <div class="qwui-sign_pic" v-if="imgList.length > 0" v-for="(item,index) in imgList" :key="index">
        <img @click="preview(item)" :src="item.url"/>
      </div>
      <div class="qwui-enclosure_pic_item" v-if="newList.length > 0">
        <i class="qwui-enclosure_pic_left"></i>
        <div class="qwui-flexItem qwui-enclosure_pic">附件({{newList.length}})</div>
        <!-- v-if="isMobile && hasPermission" -->
        <!--<i class="qwui-enclosure_pic_right" v-if="showDealer&&status=='0'" ref="enclosure_pic" @click='mediaFileUpdateHandler'></i>-->
        <input ref="input_enclosure_pic" v-show="false" type="file" class="qwui-w_zero" @click.prevent="addEnclosurePic">
        <label v-show="false" ref="input_two" class="qwui-enclosure_pic_right">
          <input ref="input" type="file" class="qwui-w_zero" @change="mediaFileUpdate">
        </label>
        <label class="qwui-enclosure_pic_right" ref="enclosure_pic" v-if="!isMobile && hasPermission">
          <input ref="input" v-show="false" type="file" class="qwui-w_zero" @change="addEnclosurePic2">
        </label>
      </div>

      <div>
        <ul>
          <!--呈现图片数据-->
          <li class="qwui-enclosure_pic_li" v-if="newList.length > 0" v-for="(item,index) in newList" :key="index">
            <div v-if="item.src" class="qwui-enclosure_pic_show qwui-flex">
              <div class="qwui-enclosure_pic_iblock qwui-enclosure_pic_icon">
                <img :src="item.src" @click="preview(item)" alt="">
              </div>
              <div class="qwui-enclosure_pic_iblock qwui-flexItem">
                <div class="qwui-enclosure_pic_name" :style="{ 'width':fileNameWidth + 'px' }">图片</div>
                <div class="qwui-enclosure_pic_size">{{item.fileSize}}</div>
              </div>
              <!-- v-if="hasPermission" -->
              <!--<i class="qwui-enclosure_pic_item_right" v-if="showDealer" :class="enclosurePicDelClass" @click="doDelLi(item,index,$event.target,'delImg');"></i>-->
            </div>
            <div v-else class="qwui-enclosure_pic_show qwui-flex">
              <div class="qwui-enclosure_pic_iblock qwui-enclosure_pic_icon" @click="openPreviewFile(item,index)">
                <span class="qwui-detail_mediaList_imgs" :class="item.fileExt"></span>
              </div>
              <div class="qwui-enclosure_pic_iblock qwui-flexItem" @click="openPreviewFile(item,index)">
                <div class="qwui-enclosure_pic_name" :style="{ 'width':fileNameWidth + 'px'}">{{item.fileName}}</div>
                <div class="qwui-enclosure_pic_size">{{item.fileSizeStr}}</div>
              </div>
              <i v-if="isDetailPage" class="qwui-enclosure_pic_item_right qwui-download" @click="downloadFileClick(item,index);"></i>
              <!-- v-if="hasPermission" -->
              <!--<i class="qwui-enclosure_pic_item_right" v-if="showDealer&&status=='0'" @click="doDelLi(item,index);"></i>-->
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="show-all" @click="ifshow=!ifshow">{{ ifshow ? '收起' : '展开' }}</div>
    <dialog_mask_bottom class="qwui-pic_pop" :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>
  </div>
</template>

<script>
  import previewer from 'vux/src/components/previewer';
  import transferDom from 'vux/src/directives/transfer-dom';
  import wx from 'weixin-js-sdk';
  import checkApi from '../../../../assets/js/check_api';
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue'
  import EventBus from '@/utils/eventBus';
  import { updateTaskPic,deleteTaskPic } from '../../api/getData';
  export default {
    props: {
      "dataDetailMsg":{
        type:Array,
        default(){
          return [];
        }
      },
      'fileList':{
        type:Array,
        default(){
          return [];
        }
      },
      'imgList':{
        type:Array,
        default(){
          return [];
        }
      },
      'enclosurePicDelClass':{
        type:String,
      },
      previewImageUrl:{
        type:Array,
        default(){
          return []
        }
      },
      showDealer: {
        type:Boolean,
        default: false
      },
      status: {
        type: String,
        default: '0'
      }
    },
    directives: {
      transferDom
    },
    components: {
      previewer,
      dialog_mask_bottom,
    },
    data(){
      return{
        ifshow: true, //是否展开
        dataBase:dataBase,
        isMobile:false,
        list: [], //图片列表
        imgurl: [], //返回父组件的数据，
        imageUploadPathPC: "/portal/imageupload/imageUploadAction!doUploadImageBase64.action", //pc端上传图片接口
        imageUploadPathPhone:"/portal/newimageupload/newimageUploadAction!newimageUpload.action", //手机端上传图片接口
        sendingFileRequest:false,
        mediaIds: this.dataDetailMsg,
        previewList: [],
        wxPreviewList: [],
        dialogBottomConfig:{
          show: false, //控制弹窗显示与否
          title: "", //头部标题，设置为空的话不显示
          btnConfig:[ //自定义弹框操作,可以设置回调函数
            {title:" 拍照", callBack: null},
            {title:" 本地相册", callBack: null},
            {title:" 附件", callBack: null},//primary为true显示为红色，默认为灰色
            {title:" 取消", callBack: null}
          ],
          maskCallBack:null,
        },
        selectType:'',
      }
    },
    computed:{
      newList(){
        if (this.mediaIds && this.mediaIds.length == 0){
          this.list = [];
          return [];
        }
        if (this.fileList && this.fileList.length != 0){
          this.list = this.fileList;
        }
        return this.list;
      },
      hasPermission(){
        this.$store.commit('hasPermissionUpdate');
        return this.$store.getters.hasPermission;
      },
      isDetailPage(){
        return this.$store.getters.isDetailPage;
      },
      fileNameWidth(){
        let w = document.documentElement.clientWidth;
        w = w>1024 ? 740-165 : w-165;
        return w;
      }
    },
    watch:{
      previewImageUrl(){
        this.pushPreviewData();
      }
    },
    created(){
      console.log('g',_.fileDownURL)
      if(_.isHefeixin()||_.isWeChatApp()||_.isQiyeweixinApp()){
        this.isMobile = true;
      }
      this.dialogBottomConfig.btnConfig[0].callBack = this.photograph;
      this.dialogBottomConfig.btnConfig[1].callBack = this.album;
      this.dialogBottomConfig.btnConfig[2].callBack = this.mediaFileUpdateHandler;
      this.dialogBottomConfig.btnConfig[3].callBack = this.controlDialogBottom;
      this.dialogBottomConfig.maskCallBack = this.controlDialogBottom;

      if (this.previewImageUrl.length > 0){
        this.pushPreviewData();
      }
    },
    methods:{
      pushPreviewData(){
        this.previewList = this.previewImageUrl;
        this.wxPreviewList = [];
        for (let i = 0; i < this.previewList.length; i++) {
          let item = this.previewList[i];
          this.wxPreviewList.push(item.src);
        }
      },
      controlDialogBottom(){
        var addModuleType = window.sessionStorage.getItem('addModuleType');
        if(addModuleType&&addModuleType=='mainAddModule'){
          this.$store.commit('enclosurePicDisplayUpdateHide');
        }else if(addModuleType&&addModuleType=='subAddModule'){
          this.$store.commit('subEnclosurePicDisplayUpdateHide');
        }
        this.dialogBottomConfig.show = false;
      },
      mediaFileUpdateHandler(){
        this.$refs.input_two.click();
      },
      enclosure_pic_click(){
        this.$refs.enclosure_pic.click();
      },
      addEnclosurePicModule(){
        var addModuleType = window.sessionStorage.getItem('addModuleType');
        if(addModuleType&&addModuleType=='mainAddModule'){
          this.$store.commit('mainAddContentModuleHideUpdate');
          this.$store.commit('mainEnclosurePicAddContentDisplayUpdateHide');
          this.$store.commit('enclosurePicDisplayUpdate');
          window.sessionStorage.removeItem('addModuleType');
        }else if(addModuleType&&addModuleType=='subAddModule'){
          this.$store.commit('subAddContentModuleHideUpdate');
          this.$store.commit('subEnclosurePicAddContentDisplayUpdate',false);
          this.$store.commit('subEnclosurePicDisplayUpdate');
          window.sessionStorage.removeItem('addModuleType');
        }
      },
      //pc端图片上传
      addEnclosurePic2(event){
        var obj=event.target;
        if(obj){
          var filePath = obj.value;
          var getExt=filePath.lastIndexOf(".");
          if(getExt>=0) {
            var fileExt = filePath.substr(getExt).toLowerCase();//获得文件后缀名
            if(fileExt=='.jpg'||fileExt=='.jpeg'||fileExt=='.png'){
              if (obj.files && obj.files[0]) {
                var file = obj.files[0];
                var fileSize = (file.size / 1024).toFixed(2) + ' KB';
                var fileName = file.name;
                var URL = window.URL || window.webkitURL;
                if(_.isHefeixin()||_.isWeChatApp()||_.isQiyeweixinApp()){
                  this.controlDialogBottom();
                }
                this.addEnclosurePicModule();
                _.showLoading(this.$t('i18n.imgUploading'), true);
                var img = new Image();
                img.src = URL.createObjectURL(file);
                var self = this;
                var base64 = "";
                img.onload = function () {
                  var that = this;
                  var quality = 1;
                  var maxWidth = 2560;
                  var w = that.width;
                  var h = that.height;
                  var scale = w / maxWidth;//生成比例
                  if (w > maxWidth) {//如果图片大于最大宽度
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
                      imageName:fileName,
                      imgFileBase: base64,
                      agent: self.dataBase.wxqyh_uploadfile.agent
                    },
                    success: function (result) {
                      _.hideLoading();
                      if (result.code === "0") {
                        self.mediaIds.push(result.data.mediaInfo.id);
                        self.$emit('listenToFile',self.mediaIds);
                        self.previewList.push({src: _.filterCompressURL(result.data.imgurl)});
                        self.wxPreviewList.push(_.filterCompressURL(result.data.imgurl));
                        // 加入预览
//                        self.$emit('listenToImageUrl',[{picPath: img.src}]);
                        // 新增图片
                        self.addPicFile(self.mediaIds,fileName,'addImg');
                        // 加入附件图片列表
                        self.list.push({
                          src: _.filterCompressURL(result.data.imgurl),
                          fileSize: fileSize,
                          fileName: fileName,
                          id:result.data.mediaInfo.id,
                        });
                        self.$emit('listenToFileList',self.list);

                        /* self.imgurl.push(result.data.imgurl);
                         self.$emit('listenToImg',self.imgurl)*/
                        self.$refs.input.value="";
                      } else {
                        _.alert('i18n.notice', result.desc);
                      }
                    }
                  });
                }
              }
            }else{
              this.mediaFileUpdate(event);
            }
          }else{
            _.alert('i18n.notice','i18n.noFormattingSuffix');
          }
        }else{
          _.alert('i18n.notice','i18n.fileEmptyDeny');
        }
      },
      //手机端弹窗显示
      showSelect(){
        this.dialogBottomConfig.show = true;
      },
      //手机端弹窗隐藏
      hideSelect(){
        this.dialogBottomConfig.show = false;
      },
      //手机端图片上传
      addEnclosurePic() {
        if(checkApi.checkJsApi_image && _.isWeChatApp()){
          var localId= [];
          var serverId= [];
          var self=this;
          wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: [this.selectType], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              //选择图片成功后
              localId = res.localIds;
              if (localId.length == 0) {
                _.alert("",'i18n.plzChoosePic');
                return;
              }
              self.hideSelect();
              self.addEnclosurePicModule();
              _.showLoading(self.$t('i18n.readyToUpload')+localId.length+self.$t('i18n.pictureMounts'),true);
              var i = 0;
              var length = localId.length;
              setTimeout(uploadFormult,500);

              function uploadFormult() {
                wx.uploadImage({
                  localId: localId[i],
                  isShowProgressTips:0,
                  success: function (res) {
                    _.showLoading(self.$t('i18n.uploadingPic')+(i+1)+self.$t('i18n.pictureMounts'),true);
                    i++;
                    serverId.push(res.serverId);
                    if (i < length) {
                      setTimeout(uploadFormult,500);
                    }
                    if(serverId.length==localId.length){
                      self.newimageupload(serverId);
                    }
                  },
                  fail: function (res) {
                    _.hideLoading();
                    _.alert("",this.$t("i18n.uploadFail")+res.errMsg+"，"+this.$t("i18n.reupload"));
                  }
                });
              }
            }
          });
        }
      },
      //手机端拍照
      photograph(){
        this.selectType = 'camera';
        this.$refs.input_enclosure_pic.click();
      },
      //手机相册
      album(){
        this.selectType = 'album';
        this.$refs.input_enclosure_pic.click();
      },
      newimageupload(serverId){
        var serverIds="";
        for(var i=0;i<serverId.length;i++){
          serverIds+=serverId[i]+",";
        }
        var self=this;
        _.ajax({
          url:_.baseURL+self.imageUploadPathPhone,
          type:"POST",
          data: {
            serverIds: serverIds,
            isOpen: false,
            isUsePublic: checkApi.wxqyh_isUsePublic,
            drawString: "",
            agent:self.dataBase.wxqyh_uploadfile.agent
          },
          dataType:"json",
          success:function(result){
            _.hideLoading();
            if(result.code=="0"){
              var mediaList = result.data.mediaList;
              if(mediaList.length>0){
                let newMediaId = [];
                let fileNameArr = [];
                for(var i=0;i<mediaList.length;i++){
                  self.list.push({
                    src: _.compressURL+mediaList[i].url,
                    fileSize:mediaList[i].fileSizeStr,
                    fileName:mediaList[i].fileName,
                    id:mediaList[i].id
                  });
                  self.$emit('listenToFileList',self.list);
                  self.mediaIds.push(mediaList[i].id);
                  self.$emit('listenToFile',self.mediaIds);
                  self.previewList.push({src: _.compressURL+mediaList[i].url});
                  self.wxPreviewList.push(_.compressURL+mediaList[i].url);
                  // 加入预览
//                  self.$emit('listenToImageUrl',[{picPath: _.compressURL+mediaList[i].url}]);
                  // 上传图片
                  fileNameArr.push(mediaList[i].fileName)
                }
                self.addPicFile(self.mediaIds,fileNameArr.join(','),'addImg');
              }
            }else{
              _.alert('i18n.notice', result.desc);
            }
          }
        });
      },
      doDelEnclosure(item,index,target,type){
        var self = this;
        // 主任务groupId为主任务id，子任务groupId为子任务id
        let groupId = '';
        if (this.$store.getters.isDetailPage){
          if (this.$store.getters.subTaskPage){
            if(!this.$store.getters.addSubTaskPage){
              groupId = this.$store.getters.subtaskId;
            }
          }else {
            groupId = this.$store.getters.taskId;
          }
        }
        _.ajax({
          url: _.baseURL + '/portal/imageupload/imageUploadAction!doDelFile.action',
          type: 'POST',
          data: {
            groupId: groupId,
            mediaId: item.id,
            agent: ''
          },
          dataType: 'json',
          success: function (result) {
            if(result.code=="0"){
              self.list.splice(index, 1);
              self.mediaIds.splice(index,1);
              self.$emit('listenToFile',self.mediaIds);
              // 删除图片附件
              let isImg = type == 'delImg';
              self.delPicFile(item.id,item.fileName,isImg);
            }else{
              _.alert("提示",result.desc);
            }
          }
        });
      },
      //预览图片
      preview (item) {
        EventBus.$emit("previewImages",item.src,this.previewList);
      },
      openPreviewFile(item){  //预览附件
        if (!this.isDetailPage){return;}
        _.wxqyh_previewFile(item.id,item.url,item.fileName,item.fileExt);
      },
      downloadFileClick(item){ //下载附件
        _.wxqyh_downloadFile(item.id,item.url,item.fileName);
      },
      doDelLi(item,index,target,type){
        let self = this;
        let btn={
          primaryBtn: {
            name: '删除',
            callBack: function(){
              if(item.src){
                var deletePic = document.querySelectorAll('.'+self.enclosurePicDelClass);
                var position = 0;
                for (var i = 0; i < deletePic.length; i++) {
                  if (deletePic[i] == target){
                    position = i;
                    break;
                  }
                }
                self.previewList.splice(position,1);
                self.wxPreviewList.splice(position,1);
              }
              self.doDelEnclosure(item,index,target,type);
              const fileName=self.$refs.input.value;
              if(fileName.indexOf(item.fileName)!=-1){
                self.$refs.input.value="";
              }
            }
          },
          defaultBtn:{
            name:"取消",
            callBack:null
          },
        };
        _.alert('','是否删除',btn);
      },
      //上传附件
      mediaFileUpdate(even){
        if(this.sendingFileRequest){
          return;
        }
        var mediaFile=even.target;
        if(mediaFile){
          var pathValue=mediaFile.value;
          var isExt=pathValue.lastIndexOf(".");
          if(isExt>=0){
            var fileExt = pathValue.substr(isExt).toLowerCase();//获得文件后缀名
            if(fileExt=='.jpg'||fileExt=='.jpeg'||fileExt=='.png'){
              this.addEnclosurePic2(event);
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
            this.hideSelect();
            if(_.isHefeixin()||_.isWeChatApp()||_.isQiyeweixinApp()){
              this.controlDialogBottom();
            }
            this.addEnclosurePicModule();
            _.showLoading(this.$t('i18n.fileUploading'),true);

            var fileObj=mediaFile.files[0];
            var fileUpdataUrl=_.baseURL+ "/portal/imageupload/imageUploadAction!doUploadFile.action"+"?agent="+this.dataBase.wxqyh_uploadfile.agent;

            this.sendingFileRequest=true;
            var self = this;
            try {
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
                  console.log(result);
                  self.mediaIds.push(result.data.mediaInfo.id);
                  self.$emit('listenToFile',self.mediaIds);
                  self.list.push(result.data.mediaInfo);
                  self.$emit('listenToFileList',self.list);
                  self.$refs.input.value="";
                  self.addPicFile(self.mediaIds,result.data.mediaInfo.fileName)
                }else{
                  _.alert('i18n.notice',result.desc);
                }
              };
              xhr.send(form);
            }catch(e){
              _.hideLoading();
              self.sendingFileRequest=false;
              _.alert('i18n.notice','i18n.updateDeny');
              return;
            }
          }else{
            _.alert('i18n.notice','i18n.noFormattingSuffix');
          }
        }else{
          _.alert('i18n.notice','i18n.updateDeny');
        }
      },

      // 详情页面新增附件图片
      addPicFile(mediaIds,fileName,type){
        let self = this;
        if (this.$store.getters.isDetailPage){

          let contentType = type == 'addImg' ? '图片' : '附件';
          let contents = '添加了' + contentType + '['+fileName+']';

          if (this.$store.getters.subTaskPage){
            if(this.$store.getters.addSubTaskPage){
              return;
            }

            // 新增子任务附件图片
            updateTaskPic({
              taskId:this.$store.getters.taskId,
              subtaskId:this.$store.getters.subtaskId,
//              'tbQyTaskPO.orgId':this.$store.getters.orgId,
              mediaIds:mediaIds.join(','),
              oldTaskStatus:'1',
              editFlag:5,
              fileName:fileName,
              contents:contents,
              title:this.$store.getters.subtaskTitle
            },(result)=>{
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
            })
          }else {
            // 主任务附件图片
            updateTaskPic({
              'taskId':this.$store.getters.taskId,
//              'tbQyTaskPO.orgId':this.$store.getters.orgId,
              'mediaIds':mediaIds.join(','),
              'fileName':fileName,
              'contents':contents
            },function (result) {
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              console.log(result);
            })
          }
        }
      },
      // 详情页面删除附件图片
      delPicFile(mediaIds,fileName,isImg){
        let self = this;
        if (this.$store.getters.isDetailPage){
          if (this.$store.getters.subTaskPage){
            if(this.$store.getters.addSubTaskPage){
              return;
            }
            let params = {};
            isImg ? params['imageId'] = mediaIds : params['mediaId'] = mediaIds;
            params['subtaskId'] = this.$store.getters.subtaskId;
            params['fileName'] = fileName;
            params['tbQyTaskPO.taskId'] = this.$store.getters.taskId;
            params['title'] = this.$store.getters.subtaskTitle;
            // 删除子任务附件图片
            deleteTaskPic(params,(result)=>{
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              // 图片预览列表移除此图片
              if (isImg){

              }
              console.log(result);
            })
          }else {
            // 删除主任务附件图片
            let params = {};
            isImg ? params['imageId'] = mediaIds : params['mediaId'] = mediaIds;
            params['tbQyTaskPO.taskId'] = this.$store.getters.taskId;
            params['fileName'] = fileName;
            deleteTaskPic(params,function (result) {
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              console.log(result);
            })
          }
        }
      }
    },
  }
</script>

<style type="text/css">
  .qwui-flex{
    display: flex;
  }
  .qwui-enclosure_pic_box {
    background: #fff;
  }
  .qwui-enclosure_pic_item{
    display: flex;
    line-height: 46px;
    color:#0A1735;
    font-size: 15px;
  }
  .qwui-enclosure_pic{
    padding-left: 8px;
  }
  .qwui-enclosure_pic_left{
    width: 26px;
    padding-left: 15px;
    background: url("../../../../assets/svg/icon_a-newtask-list_enclosure.svg") no-repeat scroll right;
  }
  .qwui-enclosure_pic_right{
    width: 24px;
    padding-right: 15px;
    background: url("../../../../assets/svg/icon-a-public_arrow-lower.svg") no-repeat scroll left;
  }
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-w_zero{
    width: 0;
  }
  .qwui-enclosure_pic_li{
    padding: 10px 0;
  }
  .qwui-enclosure_pic_show{
    padding-left:48px;
  }
  .qwui-enclosure_pic_icon img{
    width: 34px;
    height: 34px;
    border-radius:4px;
  }
  .qwui-enclosure_pic_iblock{
    display: inline-block;
    vertical-align: middle;
  }
  .qwui-enclosure_pic_icon{
    margin-right: 10px;
  }
  .qwui-enclosure_pic_name{
    font-size: 14px;
    color:#0A1735;
    word-wrap: break-word;
  }
  .qwui-enclosure_pic_size{
    font-size: 13px;
    color:#B2B9C8;
  }
  .qwui-enclosure_pic_item_right{
    width: 20px;
    padding-right: 15px;
    background: url("../../../../assets/svg/icon_a-enclosure-list_delete.svg") no-repeat scroll left;
  }
  .qwui-download{
    background: url("../../../../assets/svg/icon_a-enclosure-list_download.svg") no-repeat scroll left;
  }

  /* 文件的图标*/
  .qwui-detail_mediaList_imgs{
    display: inline-block;
    width: 34px;
    height: 34px;
    margin-right: 0;
    border-radius: 4px;
    background: url("../../../../assets/images/icon_file_type_mini.png") center no-repeat;
    background-size: cover;
  }
  .qwui-detail_mediaList_imgs.XML,.qwui-detail_mediaList_imgs.FILE{
    background-position: 0 0;
  }
  .qwui-detail_mediaList_imgs.XLS,.qwui-detail_mediaList_imgs.XLSX{
    background-position: -34px 0;
  }
  .qwui-detail_mediaList_imgs.TXT{
    background-position: -68px 0;
  }
  .qwui-detail_mediaList_imgs.DOCX,.qwui-detail_mediaList_imgs.DOC{
    background-position: -102px 0;
  }
  .qwui-detail_mediaList_imgs.PPT,.qwui-detail_mediaList_imgs.PPTX{
    background-position: -136px 0;
  }
  .qwui-detail_mediaList_imgs.PDF{
    background-position: -170px 0;
  }
  .qwui-detail_mediaList_imgs.MP3,.qwui-detail_mediaList_imgs.WMA,.qwui-detail_mediaList_imgs.WAV,.qwui-detail_mediaList_imgs.AMR{
    background-position: -204px 0;
  }
  .qwui-detail_mediaList_imgs.MP4{
    background-position: -238px 0;
  }
  .qwui-detail_mediaList_imgs.RAR,.qwui-detail_mediaList_imgs.ZIP{
    background-position: -272px 0;
  }
  .qwui-pic_pop .qwui-dialog_bottom_footer {
    font-size: 15px !important;
  }

  .qwui-pic_pop .qwui-dialog_bottom_btn:after {
    border-bottom: 1px solid #fff !important;
  }
  .qwui-sign_pic{
    margin:auto 15px;
  }
  .qwui-sign_pic img{
    height: 130px;
  }
  .show-all{
    text-align: center;
    cursor: pointer;
    border-bottom: 1px solid rgb(241,241,241);
    padding-bottom: 10px;
  }
</style>
