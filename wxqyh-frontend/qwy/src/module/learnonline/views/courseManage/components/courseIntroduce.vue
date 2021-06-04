<template>
  <div class="learn-courseIntroduce">
    <div class="intro_courseWrap clearfix">
      <!--课程介绍-->
      <div class="fl">
      <div class="courseIntro">
        <div class="intro_titleWrap">
          <div class="title">课程介绍</div>
        </div>
        <div class="courseIntro_detail" v-html="componentData.content" v-if="componentData.content"></div>
      </div>
      <!--适用人群-->
      <div class="peopleWrap">
        <div class="intro_titleWrap">
          <div class="title">适用人群</div>
        </div>
        <div class="content" v-if="componentData.suit">{{ componentData.suit }}</div>
      </div>
      </div>
      <!--讲师介绍-->
      <div class="teachIntro">
        <div class="intro_titleWrap">
          <div class="title">讲师介绍</div>
        </div>
        <div class="teachIntro_detail" v-if="!teacherVOList.length">
          <div class="detail_head noHead"></div>
          <p class="detail_name name noName">暂无信息</p>
        </div>
        <div class="teachIntro_detail" v-for="item in teacherVOList">
          <img class="detail_head img" :src="item.headPic" alt="" v-if="item.headPic">
          <div class="detail_head noHead" v-else></div>
          <p class="detail_name name">{{ item.userName }}</p>
          <p class="detail_name job" v-if="item.position">{{ item.position }}</p>
          <p class="detail_content" v-if="item.content">{{ item.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import base from '../mixins/base'

export default {
  name: 'courseIntroduce',

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

  computed: {
    //讲师信息
    teacherVOList() {
      return this.componentData.teacherVOList || [];
    },
  },

  watch: {},

  created() {
  },

  methods: {},

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
  .learn-courseIntroduce {
    padding: 16px 32px 12px;
    .intro_titleWrap {
      height: 50px;
      padding-left: 16px;
      box-shadow:0px 1px 0px 0px rgba(250,250,250,1);
      .title {
        position: relative;
        display: inline-block;
        height: 20px;
        padding-left: 12px;
        margin-top: 14px;
        color: #383838;
        line-height: 20px;
        &::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 0;
          display: inline-block;
          width: 4px;
          height: 16px;
          border-radius:4px;
          background-color: #C31725;
        }
      }
    }
    .intro_courseWrap {
      .courseIntro {
        width: 652px;
        background-color: #fff;
        .courseIntro_detail {
          padding: 16px 18px 24px;
          color: #383838;
        }
      }
      .teachIntro {
        float: right;
        width: 268px;
        background-color: #fff;
        .teachIntro_detail {
          padding-bottom: 24px;
          .detail_head {
            width: 64px;
            height: 64px;
            margin: 16px auto 0;
            border-radius: 50%;
            &.img {
              display: block;
            }
            &.noHead {
              background: url(~assets/images/user.png) no-repeat center/contain;
            }
          }
          .detail_name {
            line-height: 20px;
            text-align: center;
            &.name {
              margin-top: 16px;
              color: #383838;
              font-size: 16px;
              &.noName {
                color: #808080;
              }
            }
            &.job {
              margin-top: 8px;
              color: #A6A6A6;
              font-size: 12px;
            }
          }
          .detail_content {
            padding: 16px 16px 0;
            line-height: 20px;
            color: #383838;
          }
        }
      }
    }
    .peopleWrap {
      width: 652px;
      margin-top: 16px;
      background-color: #fff;
      .content {
        line-height: 20px;
        padding: 16px 16px 24px;
      }
    }
  }
</style>
