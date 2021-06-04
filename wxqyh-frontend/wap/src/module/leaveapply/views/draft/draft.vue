<template>
  <div v-infinite-scroll="loadMore"
       infinite-scroll-disabled="busy"
       infinite-scroll-distance="10" class="draft" :class="{'no-record': list.length < 1}">
    <!-- 列表 -->
    <ul>
        <user-title-list 
         v-for="(item,index) in list" 
        :key="index" 
        :showRightMenu="true" 
        :styleObject="{paddingLeft:'15px'}">
          <p class="qwui-list_item_title paddingRight limit_show" slot="title">{{item.title}}</p>
          <p class="qwui-list_user_content type_name">{{item.typeName}}</p>
          <p class="qwui-list_user_content">{{item.sumAskDays}}天</p>
          <div class="clickButton" @click="goPage(item)"></div>
          <div slot="rightMenu" class="qwui-list_menu_box qwui-list_menu_more" @click.stop.prevent="clickMenu(item.askId,index)"></div>
        </user-title-list>
    </ul>
    <!-- 加载更多 -->
    <load-more
      :busy="busy"
      :loading="loading"
      :showrecord="showrecord"
      @childevent="loadMore"></load-more>
  </div>
</template>

<script>
import { getPageList, listDelete, getTemplateById} from "../../api/getData.js";
import { mixinPage } from "../../mixin.js";

export default {
  name: 'draft',
  mixins: [mixinPage],
  data() {
    return {
      currentIndex: '',
      maxPage: null,
      totalRows: null,
      id: '',
      leaveType: '0',
      postData: {
        status: 0,
        type: 1,
        keyWord: "",
        page: 1,
        pageSize: 20
      }
    };
  },
  created() {
    this.initList();
    var _this = this;
    dataBase.dialogBottomConfig.btnConfig = [
      { title: " 删除", callBack: _this.confirmDelete, primary: true},
      { title: " 取消"}
    ],
    dataBase.dialogBottomConfig.title = '是否删除该草稿?';
  },
  destroyed() {
    dataBase.dialogBottomConfig.title = '';
  },
  methods: {
    initList(isLoadMore) {
      var _this = this;
      _.showLoading(); //显示loading
      getPageList('draft', _this.postData).then(res => {
        if(_this.maxPage === null) _this.maxPage = res.data.maxPage;
        if(_this.totalRows === null) _this.totalRows = res.data.totalRows;
        _this.setList(res, isLoadMore);
      });
    },
    clickMenu(id, index) {
      dataBase.dialogBottomConfig.show = true;
      this.currentIndex = index;
      this.id = id;
    },
    confirmDelete() {
      
      let _this = this;
      listDelete('draft', _this, () => {
        dataBase.home.nav[1].num --;
        _this.list.splice(_this.currentIndex, 1);
      })
    },
    goPage(item) {
      let me = this
      getTemplateById(item.askType,(res)=>{
        me.leaveType = res.template.isTravel
        this.$router.push({path: '/add', query: {askId: item.askId, type: 'edit',leaveType: me.leaveType}})
      })
    }
  }
};
</script>
<style lang='scss' scoped>
.draft{
  height: 100%;
}
.no-record {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 50;
  right: 0;
  bottom: 50px;
  background-color: white;
}
.qwui-list_item_title.limit_show {
    display: block;
    padding: 0 80px 5px 0;
    line-height: 1;
    font-size: 16px;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
}
.qwui-list_user_content.type_name {
    margin-right: 3px;
    margin-bottom: 0px;
}
.draft /deep/ .qwui-list_menu_box.qwui-list_menu_more {
  width: 20px;
  height: 20px;
  background-size: 100% !important;
  background: url(../../asset/img/icon_more.png);
}
.draft /deep/ .qwui-list_menu_box {
  margin-right: 16px;
  margin-top: -29px;
}
.draft /deep/ .qwui-list_item_box {
  padding: 12px 0 12px 0;
}
.draft /deep/ .qwui-list_item_user {
  padding-top: 0px; 
}
.clickButton{
  position: absolute;
  width: 80%;
  height: 50px;
}
</style>