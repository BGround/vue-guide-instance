<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  import '../../../static/UE/ueditor.config.js'
  import '../../../static/UE/ueditor.all.min.js'
  import '../../../static/UE/lang/zh-cn/zh-cn.js'
  import '../../../static/UE/ueditor.parse.min.js'
  import './video'
  import emitter from '@/assets/js/mixins/emitter.js';
  import axios from 'axios';

  export default {
    name: 'UE',
    mixins: [emitter],
    data () {
      return {
        editor: null,
        isOver: false,
      }
    },
    props: {
      validateEvent: {
        type: Boolean,
        default: true
      },
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      agentCode:{
        type:String,
        default:''
      }
    },
    mounted() {
      var _this = this;
      this.editor = UE.getEditor('editor', this.config); // 初始化UE
      this.editor.addListener("ready", function () {
        _this.editor.execCommand('serverparam', {
          "editorApp": "3",
          "agentCode": _this.agentCode
        });
        if (_this.defaultMsg) {// 确保UE加载完成后，放入默认内容。
          _this.editor.setContent(_this.defaultMsg);
        }
      });
      this.editor.addListener('wordcountoverflow',function(){
        _this.isOver = true
      });
      this.editor.addListener('contentChange',function(){
        _this.isOver = false
      });
      this.editor.addListener('blur',function(){
        _this.$emit('blur',_this.getUEContent());
        if (_this.validateEvent) {
          _this.dispatch('QwFormItem', 'qw.form.blur', [_this.getUEContent()]);
        }
      });
    },
    methods: {
      getUEContent() {// 获取内容方法
        return this.editor.getContent()
      },
      /**
       * 获取html代码中图片地址
       * @param htmlstr
       * @returns {String}
       */
      getImgSrc(htmlstr) {
        let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/ig;
        let arr = htmlstr.match(srcReg);
        let dataArr = [];
        if(arr){
          arr.forEach((item)=>{
            dataArr.push(item.replace(/^src=\"|\"$/g,''));
          });
        }
        return dataArr;
      },
      getUEContentTxt() { // 获取纯文本内容方法
        return this.editor.getContentTxt()
      },
      setUEContent(val) { // 设置内容方法
        this.editor.ready(()=>{
          this.editor.setContent(val);
        });
      },
      getUEContentIsOver() { // 获取字数是否超限
        return this.isOver
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
<style>
  .edui-default .edui-editor, .edui-default .edui-editor-iframeholder{
    width:100%!important;
  }
  .edui-default .edui-editor-wordcount{
    position:relative;
    padding-right:20px;
  }
</style>
