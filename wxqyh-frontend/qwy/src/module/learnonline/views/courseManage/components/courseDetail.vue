  <template>
  <div class="learn-detail">
    <!--查看课程-->
    <div class="detail_head">
      查看课程&nbsp;
      <span class="qrCode" @mouseover="showQrcode=true;" @mouseout="showQrcode=false;"></span>
      <!--预览课件的二维码-->
      <div class="qrCode_detail" v-show="showQrcode" @mouseover="showQrcode=true;" @mouseout="showQrcode=false;">
        <p class="title">通过微信/企业微信<br>扫描二维码学习/预览课程</p>
        <qrcode :value="previewUrl" :size="160"></qrcode>
        <p class="url">
          <span ref="copyEle">{{ previewUrl }}</span>
          <span class="copy" @click="doCopy">复制</span>
        </p>
      </div>
      <span class="head_close" @click="close"></span>
      <span class="head_btn white">下架</span>
      <span class="head_btn orange">编辑</span>
    </div>
    <!--课程封面-->
    <div class="detail_info clearfix">
      <!--<img src="" alt="">-->
      <span class="info_img defaultImg"></span>
      <div class="info_right">
        <p class="right_title" :title="course.subjectName">
          {{ course.subjectName }}
        </p>

        <div class="right_category">
          运营学习>运营设计&nbsp;&nbsp;&nbsp;&nbsp;{{ course.enclosureCount }}课时
        </div>
        <div class="right_rate">
          <div class="rate_wrap">
            <span class="rate">{{ course.finishNum }}人完成学习</span>
            <span class="rate rate_nofinish">{{ course.joinNum - course.finishNum }}人未完成</span>
            <span class="fr">{{ course.finishNum/course.personCount | finishRate }}%</span>
          </div>
          <div class="rate_bar">
            <div class="bar_real" style="width: 50%;"></div>
          </div>
        </div>
      </div>
    </div>
    <!--tab栏-->
    <div class="detail_tab" :class="{ 'two_tab' : tabList.length == 2 }">
      <qw-tab :tabList="tabList" :index="index" @selectIndex="selectIndex"></qw-tab>
    </div>
    <keep-alive>
      <component :is="currentComponent" :componentData="componentData" :isMust="isMust"
                 :courseId="courseId" :subjectName="course.subjectName" :examId="courseDetailData.exam && courseDetailData.exam.examId"></component>
    </keep-alive>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import qrcode from 'qrcode.vue';
import qwTab from '@/components/Tab/QwTab';
import courseIntroduce from './courseIntroduce';
import courseDirectory from './courseDirectory';
import learnProgress from './learnProgress';
import examResult from './examResult';

export default {
  name: 'courseDetail',

  components: { qrcode, qwTab, courseIntroduce, courseDirectory, learnProgress, examResult },

  props: {
    show: { //是否显示详情页
      type: Boolean,
      required: true
    },
    courseId: { //课程详情的数据
      type: String,
      required: true
    },
  },

  data() {
    return {
      //是否展示二维码
      showQrcode: false,
      //预览课件的url
      previewUrl: "http://d.do1.com.cn/J3GQ",
      //激活的tab
      index: 0,
      //tab配置
      tabList: [
        {
          text:'课程介绍',
        },
        {
          text:'课程目录',
        },
        {
          text:'学习进度',
        },
        {
          text:'考试结果',
        },
      ],
      //tab对应的组件
      components: [ courseIntroduce, courseDirectory, learnProgress, examResult ],
      //课程详情数据
      courseDetailData: {},
    }
  },

  computed: {
    //激活的component
    currentComponent() {
      return this.components[this.index];
    },
    //tab组件的数据
    componentData() {
      if(this.index == 0) {
        return this.course;
      }else if(this.index == 1) {
        return Object.assign({chapterVOList: this.courseDetailData.chapterVOList}, {exam: this.courseDetailData.exam});
      }
    },
    //courseDetailData.course数据对象
    course() {
      //假数据
      if(this.courseDetailData.course) {
        this.courseDetailData.course.personCount = 100;
      }
      return this.courseDetailData.course || {};
    },
    //是选学课还是必学课
    isMust() {
      return this.course.isMust;
    },
  },

  filters: {
    //完成进度
    finishRate(value) {
      return Math.round(value * 10000)/100.00;
    },
  },

  watch: {},

  created() {
    //获取课程详情
    this.getCourseDetail(this.courseId);
    //加载课程预览二维码
    this.getCourseLink(this.courseId);
  },

  methods: {
    ...mapMutations('app', ['SET_HIDDENSCROLL']),
    //获取课程详情
    getCourseDetail(id) {
      this.$api.getCourseDetail({id}, data => {
        let chapterVOList = data.chapterVOList;
        chapterVOList.forEach(item => {
          item.enclosureViewVOList.forEach(i => {
            i["isHover"] = false;
          })
        });
        this.courseDetailData = Object.assign(data);
        //未上线的课程隐藏学习进度和考试结果
        this.course.state == 1 && this.tabList.splice(2, 2);
      });
    },
    //获取课程预览链接
    getCourseLink(id) {
      this.$api.getCourseLink({id}, data => {
        this.previewUrl = data.url;
      });
    },
    //复制链接
    doCopy() {
      const range = document.createRange();
      range.selectNode(this.$refs.copyEle);
      const selection = window.getSelection();
      if(selection.rangeCount > 0) selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
    },
    //关闭侧滑栏
    close() {
      //页面可以恢复滚动
      this.SET_HIDDENSCROLL(false);
      this.$emit('update:show', false);
      //重置tab到第一栏
      this.index = 0;
    },
    //tab栏点击
    selectIndex(index) {
      this.index = index;
    },
  },

}
</script>

<style lang="scss" scoped>
 @import 'learn/style/config.scss';
  .learn-detail {
    position: fixed;
    top: 0;
    right: 0;
    width: 1000px;
    height: 100vh;
    background-color: #F7F7F7;
    overflow: scroll;
    z-index: 2;
    .detail_head {
      position: relative;
      height: 72px;
      line-height: 32px;
      font-size: 18px;
      color: #333;
      padding: 20px 32px;
      .qrCode {
        position: relative;
        top: 3px;
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(~assets/images/icon_qrcode.png) no-repeat;
        cursor: pointer;
      }
      .qrCode_detail {
        position: absolute;
        top: 57px;
        left: 92px;
        width: 214px;
        padding: 16px 0;
        background:rgba(255,255,255,1);
        box-shadow:0px 1px 4px 0px rgba(0,0,0,0.25);
        z-index: 1;
        &::before {
          transform: rotate(90deg);
          top: -15px;
          left: 25px;
          content: "";
          font-size: 20px;
          position: absolute;
          border-color: transparent #ccc transparent transparent;
          border-style: solid;
          border-width: 8px;
          z-index: -1;
        }
        &::after {
           content: "";
           position: absolute;
           top: -4px;
           left: 27px;
           height: 8px;
           background: #fff;
           -webkit-transform: rotate(-45deg);
           transform: rotate(-45deg);
           width: 10px;
           z-index: -1;
        }
        .title {
          text-align: center;
          line-height: 20px;
          font-size: 14px;
          color: #383838;
        }
        /deep/ {
          div {
            margin-top: 14px;
            text-align: center;
            canvas {
              vertical-align: middle;
            }
          }
        }
        .url {
          position: relative;
          line-height: 19px;
          padding: 16px 32px 0 8px;
          font-size: 12px;
          color: #808080;
          word-break: break-all;
          .copy {
            position: absolute;
            bottom: 0;
            right: 4px;
            color: #409EFF;
            cursor: pointer;
          }
        }
      }
      .head_close {
        float: right;
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-top: 8px;
        background: url(~assets/images/btn_close.png) no-repeat center/auto;
        cursor: pointer;
        transition: transform 0.2s;
        -webkit-transition: -webkit-transform 0.2s;
        -moz-transition: -moz-transform 0.2s;
        -o-transition: -o-transform 0.2s;
        &:hover {
           transform: rotate(-90deg);
           -webkit-transition: rotate(-90deg);
           -moz-transition: rotate(-90deg);
           -o-transition: rotate(-90deg);
        }
      }
      .head_btn {
        float: right;
        height: 32px;
        width: 72px;
        font-size: 14px;
        border-radius:2px;
        text-align: center;
        cursor: pointer;
        &.white {
          color: #808080;
          margin-right: 24px;
          border:1px solid #D5D5D5;
          background-color: $whiteBackground;
          &:hover {
             background-color: $greyBackground;
          }
        }
        &.orange {
          color: #fff;
          margin-right: 20px;
          background-color: $orangeBtn;
          &:hover {
             background-color: $orangeBtnHover;
          }
        }
      }
    }
    .detail_info {
      padding: 32px 32px 24px;
      background-color: $whiteBackground;
      .info_img {
        float: left;
        display: inline-block;
        vertical-align: middle;
        width: 320px;
        height: 178px;
        border-radius:8px;
      }
      .info_right {
        position: relative;
        float: left;
        width: 584px;
        min-height: 178px;
        margin-left: 24px;
        padding-bottom: 74px;
        .right_title {
          line-height: 36px;
          font-size: 22px;
          color: #383838;
        }
        .right_category {
          margin-top: 12px;
          line-height: 20px;
          color: #A6A6A6;
        }
        .right_rate {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 460px;
          height: 56px;
          padding: 12px;
          background-color: #FAFAFA;
          .rate_wrap {
            line-height: 20px;
            .rate {
              position: relative;
              padding-left: 11px;
              color: rgb(56,56,56);
              &::before {
                content: '';
                display: inline-block;
                position: absolute;
                top: 7px;
                left: 0;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: rgb(64,158,255);
              }
              &.rate_nofinish {
                margin-left: 20px;
                &::before {
                  background-color: rgb(245,98,98);
                }
              }
            }
          }
          .rate_bar {
            position: relative;
            height: 4px;
            margin-top: 8px;
            border-radius:4px;
            background-color: rgba(64,158,255,0.2);
            .bar_real {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              border-radius:4px;
              background-color: rgb(64,158,255);
            }
          }
        }
      }
    }
    .detail_tab {
      padding-left: 32px;
      background-color: $whiteBackground;
      /deep/ .qwui-tabs {
        max-width: 392px;
        min-width: auto;
        height: 59px;
        line-height: 59px;
        font-size: 14px;
        border: none;
        .qwui-tab_group {
          .qwui-tab {
            height: 59px;
            line-height: 59px;
            color: #383838;
            &.active {
              color: #F87B00;
            }
          }
        }
      }
      &.two_tab {
        /deep/ .qwui-tabs {
          max-width: 196px;
        }
      }
    }
  }
</style>
