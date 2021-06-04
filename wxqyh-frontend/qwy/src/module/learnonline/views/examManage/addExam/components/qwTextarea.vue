<template>
  <div
    class="qwui-form_item qwui-form_item_hasLabel"
    :class="{
      'qwui-form_item_required' : objConfig.required ,
      'qwui-form_item_hasBorther' : objConfig.hasBorther,
    }"
  >
    <label class="qwui-form_item_label" v-if="!objConfig.noLabel">{{ objConfig.title }}</label>
    <div class="qwui-form_item_content">
      <div class="content_wrap_textArea">
        <textarea class="content_textArea" v-model="msgText" :maxlength="objConfig.maxlength"></textarea>
        <span class="textArea_length">{{ msgText.length }}/{{ objConfig.maxlength }}</span>
      </div>
      <span class="content_uploadImgIcon" @click="handleInputChange"></span>
      <input type="file" @change="uploadPhoto($event)"  multiple="true" id="fileInput">
      <qw-upload-img
        ref="uploadImg"
        :uploadConfig="uploadConfig"
        @moreImgUpload="getImgUrl"
      ></qw-upload-img>
    </div>
  </div>
</template>

<script>
import qwUploadImg from 'components/Add/uploadImg/QwUploadImg'

export default {
  name: 'qwTextarea',

  components: { qwUploadImg },

  props: {
    //选项的配置
    objConfig: {
      type: Object,
      required: true
    },
    objVal: {
      required: true
    },
    objKeyText: {
      type: Array,
      required: true
    },
    objKeyPhoto: {
      type: Array,
      required: true
    },
    EVENT_BUS: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      keyName: this.objKey,
      validateState: '',
      validateMessage: '',
      uploadConfig:{
        uploadFileId:'aa',//input:file 的id
        showType:'small',//展示图片的尺寸
        agent:'',//哪个模块agent
        imageObj:{
          imageURL:'',
          fileName:'',
        },//封面图片数据对象
        isMoreImg:true,//true：多图,false：封面图片
        moreList:[],//多图列表
      }
    }
  },

  computed: {
    msgText: {
      get: function() {
        return this.objVal.text;
      },
      set: function(value) {
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: this.objKeyText,
          value
        });
      }
    },
    msgPhoto: {
      get: function () {
        return this.objVal.photo;
      },
      set: function (value) {
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: this.objKeyPhoto,
          value
        });
      }
    },
  },

  watch: {
    msgPhoto() {
      this.uploadConfig.moreList.splice(0);
      this.uploadConfig.moreList = [...this.msgPhoto];
    }
  },

  created() {
  },

  methods: {
    uploadPhoto(e) {
      this.$refs.uploadImg.uploadChange(e);
    },
    handleInputChange() {
      document.querySelector('#fileInput').click();
    },
    getImgUrl(imgObj) {
      this.msgPhoto.splice(0);
      this.msgPhoto.push(...imgObj);
    }
  },

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
  .qwui-form_item_content {
    .content_wrap_textArea {
      position: relative;
      display: inline-block;
      .content_textArea {
        padding: 6px 4px 18px 4px;
        width: 600px;
        height: 80px;
        border-radius: 2px;
        border: 1px solid #ccc;
        resize: none;
        box-sizing: border-box;
        -moz-appearance: none;
        appearance: none;
        font-family: 'Microsoft Yahei','simsun','arial','tahoma';
      }
      .textArea_length {
        position: absolute;
        right: 12px;
        bottom: 10px;
        color: #999;
      }
    }
    .content_uploadImgIcon {
      position: relative;
      top: -32px;
      left: 7px;
      display: inline-block;
      width: 25px;
      height: 21px;
      background: url("~assets/images/icon_img.png") no-repeat;
      &:hover {
        background-position: 0px -21px;
      }
    }
    #fileInput {
      display: none;
    }
    /deep/ div {
      line-height: 0;
      .qwui-upload_item {
        .qwui-upload {
          display: none;
        }
      }
      .qwui-preview_img_name {
        line-height: normal;
      }
      .qwui-preview_options {
        line-height: normal;
      }
    }
  }
</style>
