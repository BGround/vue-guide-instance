<template>
      <div class="upload-box">
        <upload-list v-if="listType == 'picture-grid' || listType == 'picture-gallery'"
                     :listType="listType"
                     :fileList="fileList"
                     :before-preview="beforePreview"
                     :showUploadList="showUploadList"
                     :showUploadListFun="showUploadListFun"
                     @remove="onRemove"
                     @preview="onPreview"
                     @onThumbnail="onThumbnail"
        >
        </upload-list>

        <div :class="[cls('',listType)]">
          <slot name="prepend"></slot>
          <div :class="cls('title')">{{title}}</div>
          <slot name="append">
            <span :class="cls('upload_icon')" @click="onClick" v-if="showUpload && showTagUpload"></span>
          </slot>
        </div>
        <uploader ref="upload" v-bind="uploadData"
                  @overLimit="onOverLimit"
                  @change="onChange"
                  @removeSuccess="removeSuccess"
                  @success="onSuccess"
                  @selectFileType="selectFileType"
                  @wxChooseImage="onChooseImage"
        ></uploader>
        <upload-list v-if="listType == 'picture-list' || listType == 'picture-card'"
                     :listType="listType"
                     :fileList="fileList"
                     :before-preview="beforePreview"
                     :showUploadList="showUploadList"
                     :showUploadListFun="showUploadListFun"
                     @remove="onRemove"
                     @download="handleDown"
                     @onThumbnail="onThumbnail"
                     @preview="onPreview"
        >
        </upload-list>

        <div v-if="showUpload && !showTagUpload" class="image_addIcon" :class="{active: listType == 'picture-list' && fileList.length }"
             @click="onClick" ></div>

        <dialog-mask-bottom v-if="dialogBottomConfig.show" :dialogConfig="dialogBottomConfig"
        >
        </dialog-mask-bottom>
        <slot></slot>
      </div>
</template>

<script>
import {httpRequest} from './uploader.js'

import UploadList from './upload-list';
import Uploader from './upload';
import dialogMaskBottom from '@/components/base/dialog_mask_bottom.vue'
import Mods from '../mixins/mods';
export default {
  name:'upload',
  mixins:[Mods],
  components:{
    UploadList,
    Uploader,
    dialogMaskBottom
  },
  props:{
    title:{
      type: String,
      default: ''
    },
    fileType:{
      type: String,
      default: ''
    },
    listType:{
      type: String,
      default: 'picture-card'
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
    drag:{
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
    limitUpload:{
      type: Boolean,
      default: false
    },
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
    },
    beforePreview: Function,
    showUploadList: {
      type: [Boolean,Object],
      default(){
        return {
          showRemoveIcon: true,
          showDownIcon: false
        }
      }
    },
    showUpload: {
      type: Boolean,
      default: true
    },
    showTagUpload: {
      type: Boolean,
      default: true
    },
    showUploadListFun: {
      type: Function,
      default(file){
        return true;
      }
    }
  },
  data(){
      return{
        dialogBottomConfig: {}
      }
  },
  mounted(){
    let self = this;
    this.dialogBottomConfig = {
      show: false,
      title: "",
      btnConfig:[
        {title:" 拍照", callBack: (()=>{
          self.chooseImageType(['camera'])
        })},
        {title:" 本地相册", callBack: (()=>{
          self.chooseImageType(['album'])
        })},
        {title:" 附件", callBack: (()=>{
          self.selectFileType(false);
          self.$refs.upload.chooseUploadFile();
        })},
        {title:" 取消", callBack: null}
      ]
    }
  },
  computed:{
    uploadData(){
      return {
        fileType: this.fileType,
        sourceType: this.sourceType,
        fileList: this.fileList,
        disabled: this.disabled,
        accept: this.accept,
        multiple: this.multiple,
        autoUpload: this.autoUpload,
        limit: this.limit,
        headers: this.headers,
        url: this.url,
        data: this.data,
        httpRequest: this.httpRequest,
        beforeReadFile: this.beforeReadFile,
        beforeUpload: this.beforeUpload,
        beforeRemove: this.beforeRemove,
      }
    }
  },
  methods: {
    onClick(event){
        this.$emit('click',{event});
        this.handleClick();
    },
    onChange(obj){
      this.$emit('change',obj);
    },
    readyUpload(targetItem){
      const nextFileList = this.fileList.concat()
      const fileName = targetItem.name;
      const fileExt = fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase();
      //图片
      if(this.fileType && (Array.isArray(this.fileType) && !this.fileType.includes(fileExt) ||
          typeof this.fileType === 'string' && this.fileType.indexOf(fileExt) < 0)){
        return false;
      }
    },
    onPreview(file){
      Promise.resolve( typeof this.beforePreview === 'function'? this.beforePreview(file) : this.beforePreview).
      then(res => {
        // Limit preview file
        if (res === false) {
          return;
        }
        this.$emit('preview',{file: file,fileList: this.fileList});
      })
    },
    onThumbnail(file){
      if(file.status === 'error'){
        this.$refs.upload.ajax(file);
      }
    },
    onRemove(file){
      this.$refs.upload.onRemove(file);
    },
    removeSuccess(file){
      this.$emit('removeSuccess',file);
    },
    onSuccess(res){
      this.$emit('success',res);
    },
    handleDown(file){
      this.$emit('download',file);
    },
    selectFileType(res){
      this.dialogBottomConfig.show = res;
    },
    chooseImageType(type){
      this.selectFileType(false);
      this.$refs.upload.chooseUploadImage(type);
    },
    onChooseImage(serverIds){
      this.$emit('wxChooseImage',serverIds)
    },
    handleClick(){
      if(!this.disabled){
        this.$refs.upload.handleClick();
      }
    },
    onOverLimit(){
      this.$emit('overLimit')
    },
    submit(){
      this.fileList.filter(file => file.status === 'ready')
        .forEach(file => {
          this.$refs.upload.onUploadFiles(file);
        });
    }
  },
}
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
