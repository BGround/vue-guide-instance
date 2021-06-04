<template>
  <div>
    <QwUpload
      :fileList="fileList"
      :multiple="multiple"
      :onSuccess="handleSuccess"
      :beforeUpload="beforeUpload"
      :limit="limit"
      :onExceed="onExceed"
      >
      <slot></slot>
    </QwUpload>
    <slot name="tip"></slot>
    <QwUploadList
      :files="fileList"
      @remove="handleRemove"
    >
    </QwUploadList>
  </div>
</template>

<script>
  import QwUploadList from './QwUploadList';
  import QwUpload from './QwUpload';
  import {noop} from '@/assets/js/utils/util.js';

  export default {
    name:'QwUploadWrap',
    components:{
      QwUpload,
      QwUploadList,
    },
    props:{
      fileList:{
        type:Array,
        default() {
          return [];
        }
      },
      multiple: {
        type:Boolean,
        default:true,
      },
      onSuccess:{
        type:Function,
        default: noop
      },
      beforeUpload:{
        type:Function,
      },
      onRemove: {
        type: Function,
        default: noop
      },
      limit:{
        type:Number,
        default:1,
      },
      onExceed: {
        type: Function,
        default: noop
      }
    },
    provide(){
      return{
        uploader:this,
      };
    },
    methods:{
      handleRemove(file){
        this.fileList.splice(this.fileList.indexOf(file),1);
        this.onRemove(file,this.fileList);
      },
      handleSuccess(fileList){
        this.fileList.push.apply(this.fileList,fileList);
        this.onSuccess(fileList);
      },
    },
  }
</script>
