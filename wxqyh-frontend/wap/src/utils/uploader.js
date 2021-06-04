
//初始化上传组件的默认方法
import axios from 'axios';
import checkApi from '../../src/assets/js/check_api';
import EventBus from './eventBus';

const isOpen = window.location.href.indexOf("/open/")>=0? true : false;
const imageTypeList = ['jpg','png','gif','jpeg'];
const fileTypeList = {
  'doc': 'doc.docx',
  'music': 'mp3.wma.wav.mod.ra.cd.md.acc.mp3pro.vqf.flac.ape.mid.ogg.m4a',
  'pdf': 'pdf',
  'ppt': 'ppt.pptx',
  'rar': 'rar.zip.cab.arj.lzh.ace.7-zip.tap.gzip.uue.bz2.jar.iso',
  'txt': 'txt',
  'video': 'AVI.MOV.QT.ASF.RM.NAVI.Divx.MPEG.MPG.DAT.MP4',
  'xls': 'xls.xlsx.xlsm.xltx.xltm.xlsb.xlam',
};
const action = {
  'doUploadWxImage': `${_.baseURL}/portal/newimageupload/newimageUploadAction!newimageUpload.action`,
  'doUploadImageBase64': `${_.baseURL}/portal/imageupload/imageUploadAction!doUploadImageBase64.action`,
  'doOpenUploadImageBase64': `${_.baseURL}/portal/imageupload/imageUploadAction!doOpenUploadImageBase64.action` ,
  'doUploadFile': `${_.baseURL}/portal/imageupload/imageUploadAction!doUploadFile.action`,
  'deleteUploadFile': `${_.baseURL}/portal/imageupload/imageUploadAction!doDelFile.action`
};

export default {
  methods: {
    //兼容初始化文件
    setMatchFileList(fileList){
      fileList.map(item=>{
        item.name = item.name || item.fileName || item.picPath;
        item.size = item.size || item.fileSize || item.fileSizeStr;
        let fileSrc = item.url || item.picPath;
        if(!item.mediaId && item.type !== 'file' && fileSrc){
          item.type = 'image';
          item.src =  _.filterCompressURL(fileSrc)
        }
      });
      return fileList
    },
    //Preview current file(limit == true : limit file preview)
    previewFileList({file,fileList},limit){
      let current = '';
      let mediaInfo = null;
      if(file.originFileObj && file.status === 'success' && file.response){
        const fileType = file.originFileObj.type;
        const result = file.response.data;
        mediaInfo = result.data.mediaInfo;
        if(fileType.indexOf('image')>=0){
          current = mediaInfo.url;
        }
      }else if(file.mediaId){
        mediaInfo = file;
      }else{
        current = file.src || file.picPath;
      }
      if(!current && !limit){
        _.wxqyh_previewFile(mediaInfo.id,mediaInfo.url,mediaInfo.fileName,mediaInfo.fileExt);
        return;
      }
      if(current){
        const { response } = this.getFileListId(fileList);
        EventBus.$emit("previewImages", _.filterCompressURL(current),response.imageUrls.payload);
      }

    },
    //图片格式、字节大小校验公用方法
    beforeReadImage(file){
      const fileName = this.getFileLastName(file.name);
      if (!imageTypeList.includes(fileName)) {
        _.tooltips_succeed('i18n.imgErrorMsg',true,"",3000);
        return false;
      }
      return true;
    },
    //附件格式校验、字节大小公用方法
    beforeReadFile(file,maxSize){
      let isFile = this.getFileFormat(this.getFileLastName(file.name));

      if(!isFile){
        _.alert('i18n.notice','i18n.compressFile');
        return isFile;
      }
      return this.checkFileByte(file,maxSize);
    },
    //获取文件名称的最后名字
    getFileLastName(fileName){
      let name = '';
      if(fileName.lastIndexOf('.')>-1){
        name = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
      }
      return name;
    },
    //校验附件的字节方法
    checkFileByte(file,maxSize = 10*1024*1024){
      if (file.size <= 0){
        _.tooltips_succeed('i18n.fileEmptyDeny',true,"",3000);
        return false;
      }

      if (file.size > maxSize){       //文件上传限制大小
        _.alert('i18n.notice','i18n.noMoreThanTenM');
        return false;
      }
      return true;
    },
    //校验附件的格式方法
    getFileFormat(fileName,fileType = fileTypeList){
      let isFile = false;
      Object.keys(fileType).forEach((item) => {
        let fileList = fileType[item].toLowerCase().split('.');
        if(fileList.includes(fileName)){
          isFile = true;
        }
      });
      return isFile;
    },
    //Down this File
    handleDownFile(file){
      if(file.id && file.url && file.name){
        _.wxqyh_downloadFile(file.id,file.url,file.name);
        return;
      }

      if(_.isWeChatApp()){
        _.tooltips_succeed('请长按图片进行保存',true,"",3000);
      }else{
        this.canvasImage(file.src||file.url).then(res=>{
          let aLink = document.createElement("a");
          let fileName = file.name.substring(file.name.lastIndexOf('/') + 1, file.name.length).toLowerCase();
          var event = new MouseEvent("click"); // 创建一个单击事件
          aLink.download = fileName || file.src;
          aLink.href = res;
          aLink.dispatchEvent(event); // 触发a的单击事件
        })
      }
    },
    // 解决跨域 Canvas 污染问题，返回图片的base64编码数据
    canvasImage(src){
      return  new Promise(resolve => {
        let image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
          let canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          let url = canvas.toDataURL("image/jpeg");
          resolve(url);
        };
        image.src = src
      })
    },
    //获取图片id字段
    getFileListId(fileList){
      let response = {mediaIds:{idStr:'',payload: [],url:''}, imageUrls:{idStr:'',payload: [],url:''}};
      const compressURL = _.compressURL.split("/compress").join("")
      fileList.map(item=>{
        //未成功上传的文件直接返回
        if(item.status !== 'success'){
          return;
        }
        let fileKey = 'mediaIds';
        let fileSrc = item.url;
        let payload = item;
        let mediaInfo = null;
        if(item.originFileObj && item.response){
          const fileType = item.originFileObj.type;
          const result =item.response.data;
          mediaInfo = result.data.mediaInfo;
          payload = mediaInfo;
          fileSrc = payload.url;
          if(fileType.indexOf('image')>=0){
            fileKey = 'imageUrls';
          }
        }else if(!item.mediaId && item.type && item.type !== 'file'){
          fileKey = 'imageUrls';
          fileSrc = item.src;
        }
        response[fileKey].idStr+= payload.id + ',';
        response[fileKey].url+= fileSrc.replace(compressURL,'') + ',';
        response[fileKey].payload.push(payload);
      });
      response.mediaIds.idStr = this.deleteLastSign(response.mediaIds.idStr);
      response.mediaIds.url = this.deleteLastSign(response.mediaIds.url);
      response.imageUrls.idStr = this.deleteLastSign(response.imageUrls.idStr);
      response.imageUrls.url = this.deleteLastSign(response.imageUrls.url);
      return {
        mediaIds: response.mediaIds.idStr,
        imageUrls: response.imageUrls.url,
        response: response
      };
    },
    //截掉最后的符号方法
    deleteLastSign(idStr,type = ','){
      return idStr.substring(0, idStr.lastIndexOf(type));
    },
    //上传的默认接口（图片、附件）
    setUploadAction(file){
      if(!file){
        return ''
      }
      let url = action['doUploadFile'];
      if(file && file.originFileObj && file.originFileObj.type.indexOf('image') >= 0){
        url = isOpen? action['doOpenUploadImageBase64'] : action['doUploadImageBase64'];
      }
      return url
    },
    //设置接口请求参数
    setRequestParams(file,agent,orderId = ''){
      const fileType = file.originFileObj && file.originFileObj.type? file.originFileObj.type : '';
      let fileName = file.name;
      fileName = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();

      if(fileType && fileType.indexOf("image") >= 0  || imageTypeList.includes(fileName)){
        return {
          agent: agent,
          isOpen: isOpen,
          imgFileBase: file.src,
          imageName: file.name,
          orderId:orderId
        }
      }
      let form = new FormData();
      form.append("author", "hooyes");                        // 可以增加表单数据
      form.append("file", file.originFileObj);								// 文件对象
      form.append("agent", agent);
      if(window.location.href.indexOf("/open/")>=0){
        form.append("isOpen", true);
      }
      return form
    },
    //Upload wx images params
    wxChooseImageParams(serverIds,agent,orderId = '') {
      return {
        serverIds: serverIds,
        isOpen: isOpen,
        isUsePublic: checkApi.wxqyh_isUsePublic,
        drawString: "",
        orderId: orderId,
        agent: agent
      }
    },
    //Upload wx images to http
    saveWxChooseImage(params,callBack) {
      this.httpRequestFile(action['doUploadWxImage'],params,(result)=> {
        let mediaList = result.data.mediaList;
        let fileList = mediaList.map(item => {
          item.name = item.fileName;
          item.size = item.fileSize;
          item.status = 'success';
          item.src = _.filterCompressURL(item.url);
          return item;
        });
        if (fileList.length > 0 && callBack) {
          callBack(fileList);
        }
      });
    },
    //Remove current file
    removeFileSuccess(file,agent = '',callBack){
      let mediaInfo = null,groupId = '',mediaId = '';
      if(file.response){
        const result =file.response.data;
        mediaInfo = result.data.mediaInfo;
        groupId = mediaInfo.groupId;
        mediaId = mediaInfo.id;
      }
      if(file.status === 'success'){
        this.httpRequestFile(action['deleteUploadFile'],{
          groupId: groupId || file.groupId || '',
          mediaId: mediaId || file.id || '',
          isOpen: isOpen,
          agent: agent
        },(result)=> {
          if(callBack){
            callBack(result);
          }
        })
      }
    },
    //Common http
    httpRequestFile(url,params,callBack){
      axios.post(url,params).then(function (result) {
        _.hideLoading();
        if (result.code=="0"){
          if(callBack){
            callBack(result);
          }
        } else{
          _.alert("提示",result.desc);
        }
      }).catch(function (error) {
        _.hideLoading();
        console.error(error);
      });
    }
  }
};

