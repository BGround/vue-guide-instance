<template>
  <span>
    <input class="upload_input" ref="input" type="file"
           :multiple="multiple"
           :accept="accept"
           @change="onChange">
  </span>
</template>

<script>
  import wx from 'weixin-js-sdk';
  import {httpRequest,isWeChatApp,wxChooseImage} from './uploader.js'
  export default {
    props:{
      fileType:{
        type: String,
        default: ''
      },
      fileList:{
        type: Array,
        default(){
          return [];
        }
      },
      disabled:{
        type: Boolean,
        default: false
      },
      accept:{
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: true
      },
      sourceType:{
        type: Array,
        default(){
          return ['album', 'camera'];
        }
      },
      limit: Number,
      headers: {
        type: Object,
        default() {
          return {};
        }
      },
      url:{
        type: [String,Function],
        default: ''
      },
      data: {
        type: [Object,Function],
        default(){
          return {}
        }
      },
      httpRequest:{
        type: Function,
        default: httpRequest
      },
      autoUpload: {
        type: Boolean,
        default: true
      },
      beforeReadFile: {
        type: Function,
        default() {
          return {}
        }
      },
      beforeUpload: Function,
      beforeRemove: {
        type: Function,
        default() {
          return {};
        }
      }
    },
    data(){
      return {
        uploadFiles: [],
        reqs: {},
        status:['ready','uploading','success','error'],
        tempIndex: 1
      }
    },
    watch: {
      fileList: {
        immediate: true,
        handler(fileList) {
          let self = this;
          fileList.map(item => {
            item.name = item.name;
            item.uid = item.uid || (Date.now() + this.tempIndex++);
            item.status = self.status.includes(item.status)?  item.status : 'success';
            return item;
          });
          this.uploadFiles = fileList;
        }
      }
    },
    methods:{
      onChange(event){
        let { files } = event.target;
        if(!files){
          return
        }
        if(!this.onOverLimit()){
          this.onCheckUpload(files)
        }
      },
      onOverLimit(){
        if (this.limit && this.fileList.length >= this.limit) {
          this.$emit('overLimit')
          return true;
        }
        return false;
      },
      onCheckUpload(files){
        let self = this;
        let fileList = Array.prototype.slice.call(files);
        if (!this.multiple) { fileList = fileList.slice(0, 1); }
        if (fileList.length === 0) {
          return;
        }
        fileList.forEach(targetItem => {
            Promise.resolve( this.beforeReadFile(targetItem)).then(res => {
              if(res === false){
                return;
              }
              self.startReadFile(targetItem).then(resFile=>{
                if (self.autoUpload){
                  self.onUploadFiles(resFile)
                }
              });
            })
        });
      },
      startReadFile(file){
        let self = this;
        const targetItem = {
          status: 'ready',
          name: file.name,
          size: file.size,
          percentage: 0,
          uid: Date.now() + this.tempIndex++,
          originFileObj: file
        };
        return new Promise(resolve => {

          const nextFileList = this.uploadFiles.concat()
          const fileIndex = nextFileList.findIndex(({ uid }) => uid === targetItem.uid);
          self.readFile(file).then(res=>{
            targetItem.src = res;
            if (fileIndex === -1) {
              self.uploadFiles.push(targetItem);
            } else {
              self.uploadFiles[fileIndex] = targetItem;
            }
            self.$emit('change',{
              file: targetItem,
              fileList: self.uploadFiles
            });
            resolve(targetItem);
          })
        })
      },
      onUploadFiles(file){
        this.$refs.input.value = null;
        if (!this.beforeUpload) {
          return this.ajax(file);
        }

        const before = this.beforeUpload(file)
        if(before && before.then){
          before.then(resFile => {
            const fileType = Object.prototype.toString.call(resFile);
            const hasOwnProperty = Object.prototype.hasOwnProperty;

            if (fileType === '[object File]' || fileType === '[object Blob]') {
              if (fileType === '[object Blob]') {
                resFile = new File([resFile], file.name, {
                  type: file.type
                });
              }
              for (const p in file) {
                if (file.hasOwnProperty(p)) {
                  resFile[p] = file[p];
                }
              }
              this.ajax(resFile);
            } else {
              this.ajax(file);
            }
          }, () => {
            this.onRemove(file);
          });
        }else if(before === false){
          this.onRemove(file);
        }else{
          this.ajax(file);
        }
      },
      ajax(file){
        let self = this;
        const { uid } = file;
        const params = {
          ...this.data
        };

        const url = typeof this.url === 'string'? this.url : this.url(file);

        let options = {
          url: url,
          data: {},
          headers: this.headers,
          onProgress: ev => {
            self.onProgress(ev, file);
          },
          onSuccess: res => {
            delete self.reqs[uid];
            self.onSuccess(res, file);
          },
          onError: err => {
            delete self.reqs[uid];
            self.onError(err, file);
          },
          onAbort: c => {
            if(c){
              self.reqs[uid] = {};
              self.reqs[uid].cancel = c;
            }
          }
        };

        Promise.resolve( typeof this.data === 'function'? this.data(file) : params).then(resFile => {
          const dataType = Object.prototype.toString.call(resFile)
          if(dataType === '[object Object]' || dataType === '[object FormData]'){
            options.data = resFile
            self.httpRequest(options);
          }
        })
      },
      onProgress(ev,file){
        let targetItem = this.getFileItem(file);
        // removed
        if (!targetItem) {
          return;
        }

        targetItem.percentage = ev.percent || 0;
        targetItem.status = 'uploading';

        this.$emit('change',{
          event: ev,
          file: {...targetItem},
          fileList: this.uploadFiles
        });
      },
      onSuccess(res,file){
        try {
          if (typeof res === 'string') {
            res = JSON.parse(res);
          }
        } catch (e) {
        }

        let targetItem = this.getFileItem(file);
        // removed
        if (!targetItem) {
          return;
        }
        targetItem.status = 'success';
        targetItem.response = res;
        this.$emit('change',{
          file: { ...targetItem },
          fileList: this.uploadFiles
        });

        //All upload success
        if(!this.reqs || JSON.stringify(this.reqs) === '{}'){
          this.$emit('success',{
            file: { ...targetItem },
            fileList: this.uploadFiles
          });
        }
      },
      onError(res,file){
        let targetItem = this.getFileItem(file);
        // removed
        if (!targetItem) {
          return;
        }

        targetItem.status = 'error';
        targetItem.response = res;
        this.$emit('error',{
          response: res,
          file: { ...targetItem },
          fileList: this.uploadFiles
        })
        this.$emit('change',{
          file: { ...targetItem },
          fileList: this.uploadFiles
        });
      },
      onRemove(file){
        let self = this
        Promise.resolve( typeof this.beforeRemove === 'function'? this.beforeRemove(file) : this.beforeRemove).then(resFile => {
          // Prevent removing file
          if (resFile === false) {
            return;
          }

          //Cancel http file
          const uid = file.uid;
          if (this.reqs[uid] && this.reqs[uid]) {
            this.reqs[uid].cancel();
          }

          let fileList = this.uploadFiles;
          fileList.splice(fileList.indexOf(file), 1);
          self.$emit('removeSuccess',file);
          self.$emit('change',{
            file,
            fileList: self.uploadFiles,
          });
        });
      },
      getFileItem(file) {
        const fileList = this.uploadFiles;
        return fileList.filter(item => item.uid === file.uid)[0];
      },
      readFile(file) {
        return new Promise(resolve => {
          const reader = new FileReader();

          reader.onload = event => {
            resolve(event.target.result);
          };

          if(file.type.indexOf('image') >= 0){
            reader.readAsDataURL(file);
          }else{
            reader.readAsText(file);
          }
        });
      },
      handleClick() {
        if(this.disabled){
          return;
        }
        this.$refs.input.value = null;

        if(isWeChatApp()){
          this.selectFileType();
        }else{
          this.chooseUploadFile();
        }
      },
      selectFileType(){
        if(!this.fileType){
          this.$emit('selectFileType',true);
        }else if(this.fileType.indexOf('images')>=0){
          this.chooseUploadImage();
        }else{
          this.chooseUploadFile();
        }
      },
      //原生：附件、图片
      chooseUploadFile(){
        if(!this.disabled && !this.onOverLimit()){
          this.$refs.input.click();
        }
      },
      //图片
      chooseUploadImage(type){
        if (!this.onOverLimit() && isWeChatApp()) {
          const sourceType = type || this.sourceType;
          wxChooseImage(sourceType,this.limit,(res)=>{
            if(res && res.length){
              this.$emit('wxChooseImage',res.join())
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
