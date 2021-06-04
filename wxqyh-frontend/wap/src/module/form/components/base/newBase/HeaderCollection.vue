<template>
  <div ref="header-tab" class="header-tab">
    <div class="inner-tab" :class="{'no-data': isLoading}" :style="[(collectionList.length <= 2 && collectionList.length > 0) ? {padding: '15px 0'} : '']">
      <div 
        class="collection-item" 
        v-for="(item, index) in collectionList" 
        :key="index"
        @click="showInfo(item, index)"
      >
        <h3 class="item-title">{{item.formName}}</h3>
        <!-- <p class="item-desc head-ellipisis-text">{{item.formName || item.typeName}}</p> -->
        <div class="item-icon" :class="iconType[item.isTask]"></div>
      </div>
      <div class="collection-card" v-if="collectionList.length == 0 && !isLoading">
        <img src="../../../assets/images/img_a-home_empty@2x.png" width="93" height="76">
        <div class="msg">
          <h3 class="collection-h">没有常用表单</h3>
          <p class="collection-desc">将表单收藏为常用，可以在首页置顶</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    collectionList: {
      type: Array,
      default: []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    interaction: {  //是否可交互
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      iconType: {
        '0': 'bd-putongdan',
        '1': 'bd-renwudan',
        '2': 'bd-shenpidan',
        '3': 'bd-waibudan'
      }
    }
  },
  methods: {
    showInfo(item, index) {
      if(!this.interaction) return;
      Events.$emit('showInfo', {
        id: item.definitionVersionsId, 
        formName: item.formName, 
        formType: item.typeName || '其他',
        index: index
      });
    }
  }
}

</script>
<style lang='scss' scoped>
  $baseURL: '../../../assets/images/';

  .header-tab {
    width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
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
        height: 116px;
        background: #fff;
      }
      .collection-item {
        height: 54px;
        max-width: 50%;
        min-width: 50%;
        flex: 1;
        display: flex;
        align-items: center;
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
        .item-title {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          color: #333;
          font-size: 14px;
          font-weight: normal;
          font-family: 'Microsoft YaHei','\5B8B\4F53', Tahoma, Arial, sans-serif;
          line-height: 1.4;
          word-break: break-all;
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
</style>