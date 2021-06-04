<template>
  <div class="qwui-upload" @click="handleClick" @keydown="handleKeydown" tabindex="0">
    <slot></slot>
    <input class="qwui-upload_input" ref="input" type="file" @change="handleChange" :multiple="multiple">
  </div>
</template>
<script>
  import {noop} from '@/assets/js/utils/util.js';

  export default {
    inject:['uploader'],
    props:{
      multiple: {
        type:Boolean,
        default:true,
      },
      onSuccess:{
        type:Function,
        default:noop,
      },
      autoUpload: {
        type:Boolean,
        default:true,
      },
      beforeUpload:{
        type:Function,
      },
      limit:{
        type:Number,
      },
      fileList:{
        type:Array
      },
      onExceed: {
        type:Function,
      },
    },
    methods:{
      handleClick(){
        this.$refs.input.value = null;
        this.$refs.input.click();
      },
      handleKeydown(e){
        if(e.target !== e.currentTarget){
          return;
        }
        if(e.keyCode === 13 || e.keyCode === 32){
          this.handleClick();
        }
      },
      handleChange(e){
        let files = e.target.files;
        if(!files){
          return;
        }
        this.uploadFiles(files);
      },
      uploadFiles(files){
        if(this.limit && this.fileList.length + files.length > this.limit){
          this.onExceed && this.onExceed(files,this.fileList);
          return;
        }

        let postFiles = Array.prototype.slice.call(files);
        let self = this;
        if (!this.multiple) {
          postFiles = postFiles.slice(0, 1);
        }
        if (postFiles.length === 0) {
          return;
        }
        Promise.all(postFiles.map(function(rawFile){
          dataBase.loading = true;
          return new Promise(function(resolve,reject){
            if(self.autoUpload){
              self.upload(rawFile,resolve,reject);
            }
          });
        })).then(function(data){
          self.onSuccess(data);
          dataBase.loading = false;
          dataBase.top_alert('上传成功',true,3000);
        }).catch(e => {
          dataBase.loading = false;
        });
      },
      upload(rawFile,resolve,reject){
        this.$refs.input.value = null;
        if(!this.beforeUpload){
          this.post(rawFile,resolve,reject);
        }

        let before = this.beforeUpload(rawFile);
        if(before){
          this.post(rawFile,resolve,reject);
        }else{
          reject();
        }
      },
      post(rawFile,resolve,reject){
        let self = this;
        let fileUpdataUrl = _.baseURL+'/fileupload/fileUploadMgrAction!doUploadFile.action';
        try {
          // FormData 对象
          let form = new FormData();
          form.append("author", "hooyes");          // 可以增加表单数据
          form.append("file", rawFile);              // 文件对象
          form.append("agent", dataBase.agentCode);
          let xhr = new XMLHttpRequest();
          try{
            xhr.open("post", fileUpdataUrl, true);
          }catch(e){
            dataBase.top_alert('上传失败',false,3000);
            reject();
            return;
          }
          xhr.onload = function () {
            let result = eval("(" +xhr.responseText + ")");
            if('0'==result.code){
              resolve(result.data.mediaInfo);
            }else{
              dataBase.top_alert('上传失败',false,3000);
              reject();
            }
          }
          xhr.send(form);
        }catch(e){
          dataBase.top_alert('上传失败',false,3000);
          reject();
          return;
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .qwui-upload{
    .qwui-upload_input{
      display: none;
    }
  }
</style>
