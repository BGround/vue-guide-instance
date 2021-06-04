<template>
  <div class="learn-directory">
    <!--章节-->
    <div class="chapter" v-for="(item, index) in componentData.chapterVOList">
      <div class="title">{{ index>8 ? index+1 : '0'+(index+1) }}章 ·&nbsp;&nbsp;概述</div>
      <div class="detail clearfix"
           v-for="(value, j) in item.enclosureViewVOList"
           @mouseover="value.isHover = true;"
           @mouseleave="value.isHover = false;"
           @click="previewFile(value)"
      >
        <div class="detail_lesson">课时{{ j+1 }}</div>
        <img class="detail_icon" :src="getImageUrl(value.fileType, value.url)" alt="">
        <div class="detail_name">{{ value.enclosureName }}</div>
        <div class="detail_time">{{ value.isHover ? '查看详情' : getStudyTime(value.studyTime) }}</div>
      </div>
    </div>
    <!--考试-->
    <div class="chapter" v-if="componentData.exam">
      <div class="title">考试</div>
      <div class="detail examName">
        {{ componentData.exam && componentData.exam.examName }}
      </div>
    </div>
  </div>
</template>

<script>
// import base from '../mixins/base'

export default {
  name: 'courseDirectory',

  components: {},

  props: {
    componentData: {
      type: Object,
      required: true
    },
  },

  data() {
    return {}
  },

  computed: {},

  filters: {},

  watch: {},

  created() {
  },

  methods: {
    //预览课件
    previewFile(obj) {
      let url;
      if(obj.fileType == 4) {
        url = _.yongzhong_url + _.fileDownURL + _.downFileURL + obj.url + '&fileFileName=' + obj.enclosureName;
      }else if(obj.fileType == 6) {
        url = obj.url;
        url.includes('mck.baidu') ? url("mck","chuanke") : '';
      }else {
        url = _.baseURL + '/manager/learnonline/filePreview.jsp?fileId=' + obj.enclosureId + '&fileType=' + obj.fileType +
              '&outURL=' + obj.url + '&fileSize=' + obj.fileSize + '&fileName=' + obj.enclosureName;
      }
      this.$utils.windowRedirect(url, true);
    },
    //获取图片的背景图
    getImageUrl(fileType, url) {
      if(fileType == 4) {
        return this.getDocumentType(url);
      }else {
        return require('assets/images/icon_fileType'+fileType+'.png');
      }
    },
    //区分为哪一种文档
    getDocumentType(url) {
      let fileArray = ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'txt', 'ppt', 'pptx'];
      let flag = false;
      let resultUrl;
      fileArray.forEach(item => {
        if(!flag && url.toLocaleLowerCase().includes(item)){
          flag = true;
          resultUrl = require('assets/images/icon_fileType_'+item.substr(0,3)+'.png');
        }
      });
      return resultUrl;
    },
    //时间转换
    getStudyTime(time) {
      let hour = Math.floor(time/60);
      hour = hour>9?hour:"0"+hour;
      let Minute = time%60;
      Minute = Minute>9?Minute:"0"+Minute;
      return hour+':'+Minute
    },
  },

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
  .learn-directory {
    padding: 16px 32px 14px;
    .chapter {
      line-height: 20px;
      background-color: #fff;
      .title {
        height: 48px;
        padding: 14px 16px;
        font-size: 12px;
        color: #808080;
        box-shadow:0px 1px 0px 0px rgba(250,250,250,1);
      }
      .detail {
        height: 48px;
        padding: 14px 16px;
        box-shadow:0px 1px 0px 0px rgba(250,250,250,1);
        cursor: pointer;
        .detail_lesson {
          float: left;
          width: 72px;
          color: #808080;
        }
        .detail_icon {
          float: left;
          width: 14px;
          height: 16px;
          margin: 2px 12px 0 0;
        }
        .detail_name {
          float: left;
          color: #383838;
        }
        .detail_time {
          float: right;
          color: #A6A6A6;
        }
        &:hover {
           background-color:rgb(250,250,250);
        }
        &.examName {
          color: #383838;
          cursor: text;
          &:hover {
             background-color: #fff;
          }
        }
      }
    }
  }
</style>
