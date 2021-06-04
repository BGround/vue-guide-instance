<template>
  <div class="guide-page" @click="nextStep">
    <div class="guide-step first" v-show="count === 0">
      <div class="guide-add">
        <div class="guide-line-box">
          <div class="guide-line">
            <p class="guide-msg">点击快速发起表单</p>
          </div>
        </div>
      </div>
      <div class="nav-item">
        <div class="guide-line-box">
          <div class="guide-line">
            <p class="guide-msg">我提交的、我相关的在这里</p>
          </div>
        </div>
        <div class="nav-item-icon">
          <span class="item-icon"></span>
          <p class="guide-tabber-text">我的</p>
        </div>
      </div>
    </div>
    <div class="guide-step second" v-show="count === 1">
      <header-collection 
        :interaction="false"
        :collectionList="collectionList"
        :isLoading="isLoading"
      >
      </header-collection>
      <div class="guide-line-box">
        <div class="guide-line"></div>
      </div>
      <p class="guide-msg">将表单收藏为常用，可以在首页显示</p>
      <div class="guide-btn"></div>
    </div>
  </div>
</template>

<script>
import HeaderCollection from './HeaderCollection'

export default {
  data () {
    return {
      count: 0,
      collectionList: [],
      isLoading: false,
    };
  },
  components: {HeaderCollection},
  mounted() {
    document.body.style.overflow = 'hidden';
    Events.$off('appendHTML');
    Events.$on('appendHTML', (collectionData) => {
      this.collectionList = collectionData.collectionList;
      this.isLoading = collectionData.isLoading;
    })
  },
  methods: {
    nextStep() {
      if(this.count >= 1) {
        this.$emit('closeGuide');
        return;
      }
      this.count ++;
    }
  },
  destroyed() {
    document.body.style.overflow = 'auto';
  }
}

</script>
<style lang='scss'>
  $baseURL: '../../../assets/images/';
  .guide-page {
    width: 100%;
    @media screen and (min-width: 1024px) {
      width: 740px;
    }
    background: rgba(0,0,0,0.7);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 100;
    .guide-step {
      position: absolute;
      &.first {
        bottom: 0;
      }
      left: 0;
      right: 0;
      width: 100%;
      @media screen and (min-width: 1024px) {
        width: 740px;
      }
      margin: auto;
      &.second {
        top: 117px;
        .guide-line-box {
          position: relative;
          top: -12px;
          .guide-line {
            height: 60px;
            background-image: url($baseURL + 'img_a-guide_text3@2x.png');
          }
        }
        .guide-msg {
          height:22px;
          font-size:16px;
          font-weight:500;
          font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
          color:rgba(255,255,255,1);
          line-height:22px;
          text-align: center;
        }
        .guide-btn {
          width: 146px;
          height: 42px;
          margin: 40% auto 0;
          background: url($baseURL + 'btn_a-guide_start@2x.png') no-repeat;
          background-size: contain;
          cursor: pointer;
        }
      }
      .guide-line-box {
        position: absolute;
        left: 0;
        right: 0;
        .guide-line {
          width: 14px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          margin: auto;
          position: relative;
          .guide-msg {
            position: absolute;
            right: 24px;
            top: 0;
            height: 22px;
            line-height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: #fff;
            white-space: nowrap;
          }
        }
      }
      .guide-add {
        width: 36px;
        height: 36px;
        position: absolute;
        bottom: 6px;
        left: 0;
        right: 0;
        margin: 0 auto;
        background-color: rgba(85,133,240,1);
        background-image: url($baseURL + 'btn_a-homepage_add@2x.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 16px;
        border-radius: 50%;
        border: 4px solid #fff;
        .guide-line-box {
          bottom: 40px;
          .guide-line {
            height: 61px;
            background-image: url($baseURL + 'img_a-guide_text1@2x.png');
          }
        }
      }
      .nav-item {
        width: 20%;
        position: absolute;
        bottom: 3px;
        left: 60%;
        .guide-line-box {
          bottom: 42px;
          .guide-line {
            height: 140px;
            background-image: url($baseURL + 'img_a-guide_text2@2x.png');
          }
        }
        .nav-item-icon {
          height: 42px;
          width: 64px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #fff;
          border-radius: 4px;
          margin: auto;
        }
        .item-icon {
          display: block;
          width: 22px;
          height: 22px;
          position: relative;
          background-size: 22px;
          background-repeat: no-repeat;
          background-position: center;
          background-image: url($baseURL + 'icon_a-tabbars_mine_pes@2x.png');
        }
        .guide-tabber-text {
          text-align: center;
          height: 10px;
          line-height: 10px;
          color: #B2B9C8;
          font-size: 10px;
          margin-top: 4px;
        }
      }
      .header-tab {
        width: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        margin-top: -64px;
        margin-bottom: 12px;
        z-index: 5;
        .inner-tab {
          display: flex;
          flex-flow: row wrap;
          align-items: center;
          height: auto;
          border-radius: 6px;
          background: #fff;
          padding: 10px 0;
          box-shadow:0px 2px 12px 0px rgba(178,185,200,0.45);
          &.no-data {
            height: 136px;
            background: #fff;
          }
          .collection-item {
            height: 54px;
            max-width: 50%;
            min-width: 50%;
            flex: 1;
            padding: 8px 16px 0 56px;
            position: relative;
            box-sizing: border-box;
            &:nth-of-type(odd)::after {
              content: '';
              display: block;
              width: 1px;
              height: 32px;
              background: #F7F8FA;
              position: absolute;
              right: 0;
              top: 15px;
            }
            &:nth-child(1) {
              margin-bottom: 8px;
            }
            &:nth-child(2) {
              margin-bottom: 8px;
            }
            .head-ellipisis-text {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .item-title {
              height: 46px;
              line-height: 46px;
              font-size: 14px;
              font-weight: 400;
              color: #0A1735;
            }
            .item-icon {
              display: block;
              width: 24px;
              height: 24px;
              position: absolute;
              left: 19px;
              top: 19px;
              background-repeat: no-repeat;
              background-size: 24px;
              background-position: center;
              &.bd-putongdan {
                background-image: url($baseURL + 'ic_a-grouping_common@2x.png');
              }
              &.bd-renwudan {
                background-image: url($baseURL + 'ic_a-grouping_task@2x.png');
              }
              &.bd-shenpidan {
                background-image: url($baseURL + 'ic_a-grouping_approv@2x.png');
              }
              &.bd-waibudan {
                background-image: url($baseURL + 'ic_a-grouping_cities@2x.png');
              }
            }
          }
          .collection-card {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: auto;
            padding: 20px 28px;
            .msg {
              margin-left: 11px;
              .collection-h {
                height:21px;
                font-size:15px;
                font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
                font-weight:400;
                color:rgba(10,23,53,1);
                line-height:21px;
                margin-bottom: 4px;
              }
              .collection-desc {
                height:17px;
                font-size:12px;
                font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
                font-weight:400;
                color:rgba(178,185,200,1);
                line-height:17px;
              }
            }
          }
        }  
      }
    }
  }
</style>