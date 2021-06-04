<template>
  <div class="header-nav">
    <div class="header-base">
      <div class="header-btn">
        <router-link to="collection" class="collection-route show-icon">
          常用表单
        </router-link>
        <router-link to="draft" class="draft-route">
          {{headData[1].num}} 草稿
        </router-link>
        <router-link :to="{name: 'search', query: {range: 'all', tips: '搜索表单、应用'}}" class="header-serach"></router-link>
      </div>
    </div>
    <div class="head-list-wrap">
      <header-collection :collectionList="collectionList" :isLoading="isLoading"></header-collection>
    </div>
  </div>
</template>

<script>
import { getHeaderCollection, getRecentlyForm } from "../../../api/list";
import HeaderCollection from './HeaderCollection';
export default {
  data () {
    return {
      headData: dataBase.home.newHeadData.nav,
      collectionList: [],
      isLoading: false, //展示空白页
    };
  },
  components: {HeaderCollection},
  created() {
    /**取消收藏 */
    Events.$off('delHeaderCollection');
    Events.$on('delHeaderCollection', (index) => {
      this.collectionList.splice(index, 1);
      getHeaderCollection().then(res => {
        if(res.code != 0) return;
        this.collectionList = res.data.formData;
      })
    })
    /**更新头部导航 */
    Events.$off('updateHeaderCollection');
    Events.$on('updateHeaderCollection', this.initData);
    this.initData();
  },
  methods: {
    initData() {
      this.isLoading = true;
      let _this = this;
      getHeaderCollection().then(res => {
        this.isLoading = false;
        if(res.code != 0) {
          return _.alert("提示", res.desc);
        }else {
          this.collectionList = res.data.formData;
        }
        this.$emit('collectionComplete', this.isLoading);
        Events.$emit('appendHTML', {'collectionList': this.collectionList, 'isLoading': this.isLoading});
      })
    }
  }
}

</script>
<style lang='scss' scoped>
$baseURL: '../../../assets/images/';
.header-nav {
  position: relative;
  width: 100%;
  .header-base {
    height: 116px;
    padding-top: 1px;
    background: #4F77AA;
    .header-btn {
      width: 100%;
      height: 24px;
      line-height: 24px;
      margin-top: 13px;
      position: relative;
      .collection-route {
        display: inline-block;
        position: absolute;
        top: 2px;
        left: 14px;
        height: 20px;
        line-height: 20px;
        margin-right: 14px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        padding-right: 17px;
        background-repeat: no-repeat;
        background-size: 16px;
        background-position: right;
        &.show-icon {
          background-image: url($baseURL + 'icon_a-public_arrow-right@2x.png');
        }
      }
      .draft-route {
        display: inline-block;
        width: 59px;
        height: 24px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        position: absolute;
        top: 0;
        right: 60px;
        background:rgba(255,255,255,.1);
        border-radius:13px;
      }
      .header-serach {
        width: 40px;
        height: 24px;
        position: absolute;
        top: 0;
        right: 0;
        border-top-left-radius: 13px;
        border-bottom-left-radius: 13px;
        background-color:rgba(255,255,255,.1);
        background-image: url($baseURL + 'Group@2x.png');
        background-repeat: no-repeat;
        background-size: 14px;
        background-position: 10px 5px;
      }
    }
  }
  .head-list-wrap {
    margin-top: -64px;
    margin-bottom: 12px;
  }
}
</style>
