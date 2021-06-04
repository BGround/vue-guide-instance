<template>
  <div class="apply" :class="{'no-record': list.length < 1, 'mt-43': haSearch}">
    <div v-show="haSearch">
      <div
        class="qwui-nav_box_fixed"
        ref="apply_search"
        :class="{'rise': ZIndex.apply, 'qwui-search_mask': setTopMask}"
        @click="changeZIndex">
        <search-bar
          :searchinput="searchBar"
          @listenToSearchBox="getSearchMessage"
          @listenToClearInput="clearInput"
          @setDialog="setDialog"
        ></search-bar>
      </div>
    </div>
    <ul v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10">
      <user-title-list v-for="(item,index) in list" :key="index" :showRightMenu="true" :toParams="{name:'detail', query: { askId: item.askId}}" :styleObject="{paddingLeft:'15px'}">
        <p class="qwui-list_item_title paddingRight limit_show" slot="title">{{item.title}}</p>
        <span
          class="applyStatus"
          :class="setStatusClass(getStatus(item))"
        >{{getStatus(item)}}</span>
        <p class="qwui-list_user_content type_name limit_p">
          <span class="mr-8">{{item.startTime.slice(5, 10)}}</span>
          <span class="descriptSpan">
            {{item.typeName + item.sumAskDays+'天'}}
          </span>
        </p>
        <div slot="rightMenu" class="qwui-list_menu_box qwui-list_menu_more"  @click.stop.prevent="initBtnOption(item,index)">
        </div>
      </user-title-list>
    </ul>
    <load-more
      :busy="busy"
      :loading="loading"
      :showrecord="showrecord"
      @childevent="loadMore">
    </load-more>
    <dialog-group
      :show="dialogConfig.show"
      :cancelText="dialogConfig.cancelText"
      :confirmText="dialogConfig.confirmText"
      @cancel="closeDialog"
      @confirm="closeApply">
      <div class="msg-box">
				<textarea
					cols="30"
					rows="2"
					class="input-style"
					:maxlength="dialogConfig.size"
					v-model="dialogConfig.reason"
					@keyup="dialogConfig.showLimit = true"></textarea>
				<p class="limit" v-show="dialogConfig.showLimit">{{resonLen + '/' + dialogConfig.size}}</p>
				<p class="error-tip" v-show="dialogConfig.reason === ''">结束理由不能为空</p>
			</div>
    </dialog-group>
  </div>
</template>

<script>
import DialogGroup from "@/components/base/dialog/dialog-group";
import {
  listDelete,
  getPageList,
  delApprove,
  updateTaskStatus,
  checkHasRevoked,
  initHead,
  getTemplateById
} from "../../api/getData.js";
import {isVipSilver, isVipGold} from '@/assets/js/vip-portal.js' 	// 判断VIP
import { mixinPage } from "../../mixin.js";
import { clearTimeout, setTimeout } from "timers";
import * as timeUtil from "@/assets/js/time-util";

export default {
  name: 'apply',
  mixins: [mixinPage],
  data() {
    return {
      id: "",
      askType: "",   //当前单的模板ID
      currentIndex: '',
      maxPage: null,
      totalRows: null,
      homeFooterList: dataBase.home.homeFooterList,
      lastScrollTop: 0,
      setTopMask: false,
      haSearch: false,
      searchBar: {
        //头部搜索框
        show: true,
        keyWord: "",
        moreFunction: {
          show: true,
          option: [
            {
              name: "标题",
              placeholder: "搜索标题",
              value: ""
            },
            {
              name: "审批时间",
              placeholder: "按审批时间搜索",
              value: "lastAuditTime"
            }
          ]
        }
      },
      postData: {
        status: "all",
        type: 1,
        typeName: "",
        typeVal: "",
        keyWord: "",
        page: 1,
        pageSize: 20
      },
      dialogConfig: {
        show: false,
        cancelText: "取消",
        confirmText: "确定",
        showLimit: false,
        reason: "已完成",
        size: 200,
        callback: null
      },
      dialog: [
        { title: "复制", callBack: null, isShow: false },
        { title: "重新编辑", callBack: null, isShow: false },
        { title: "关闭", callBack: null, isShow: false },
        { title: "销假", callBack: null, isShow: false },
        { title: " 删除", callBack: null, primary: true, isShow: false }, //primary为true显示为红色，默认为灰色
        { title: " 取消", callBack: null, isShow: false }
      ],
      element: null,
      leaveType: 0    //请假单类型  0请假 1出差 2加班
    };
  },
  created() {
    this.initList(); //初始化列表
    this.searchBar.moreFunction.option[1].callback = this.showTimeInput;
  },
  mounted(){
    this.element = $(this.$refs.apply_search).find('.qwui-search_input');
    let _this = this;
    let config = dataBase.timePluginConf();
    this.element.mobiscroll().date(config);
    this.element.on('change',function(e){
      if(_this.searchBar.keyWord == e.target.value) {
        _this.setDialog(false);
      } else {
        _this.searchBar.keyWord = e.target.value;
      }
    //  _this.$nextTick(function() {
    //    $('.icon_search').click();
    //  })

    })
  },
  destroyed() {
    this.element = null;
  },
  components: {
    DialogGroup
  },
  computed: {
    resonLen() {
      return this.dialogConfig.reason.length;
    },
  },
  watch: {
    dialog: {
      handler: function(val, oldVal) {
        dataBase.dialogBottomConfig.btnConfig = val.filter(item => item.isShow);
      },
      deep: true
    }
  },
  methods: {
    initBtnOption(item, index) {  //初始化按钮列表
      //初始化按钮
      this.resetBtnConfig(); //重置按钮
      this.id = item.askId;
      this.askType = item.askType;
      this.currentIndex = index;
      this.dialog[0].callBack = this.copy;
      this.dialog[1].callBack = this.reEdit;
      this.dialog[2].callBack = this.close;
      this.dialog[4].callBack = this.delete(index);

      dataBase.dialogBottomConfig.show = true;
      // 通过获取模板信息获取当前单的类型
      getTemplateById(this.askType,(res)=>{
        this.leaveType = res.template.isTravel
      })
      if (item.isRevoked != 1) {
        //未销假
        this.dialog[0].isShow = true;
      }

      if (item.isover == "-1") {
        //已关闭
        return;
      } else if (item.isover == "0") {
        //退审
        this.dialog[1].isShow = true;
        this.dialog[2].isShow = true;
      } else if (item.askStatus == "2" && item.isTravel != 2) {   // 加班单无销假
        //已审核
        if (item.alreadyRevoked == "0" && item.isRevoked != "1") {
          //未销假
          this.dialog[3].isShow = true;
          if (item.isFree != 1) {
            //非自由流程
            this.dialog[3].callBack = this.revoke(0, item);
          } else {
            //自由流程
            this.dialog[3].callBack = this.revoke(1, item);
          }
        }
      }
    },
    resetBtnConfig() {  //重置按钮列表
      dataBase.dialogBottomConfig.title = '';
      this.dialog = [
        { title: "复制", callBack: null, isShow: false },
        { title: "重新编辑", callBack: null, isShow: false },
        { title: "关闭", callBack: null, isShow: false },
        { title: "销假", callBack: null, isShow: false },
        { title: " 删除", callBack: null, primary: true, isShow: true },
        { title: " 取消", callBack: null, isShow: true }
      ];
    },
    delete(index) { //删除申请
      var _this = this;
      return function() {
        listDelete('apply', _this, () => {
          _this.list.splice(index, 1);
          initHead();
        })
      };
    },
    copy() {  //复制
      this.$router.push({
        path: "add",
        query: { askId: this.id, type: "copy" ,leaveType: this.leaveType}
      });
      dataBase.dialogBottomConfig.show = false;
    },
    reEdit() {  //重新编辑
      this.$router.push({
        path: "add",
        query: { askId: this.id, type: "edit" ,leaveType: this.leaveType}
      });
      dataBase.dialogBottomConfig.show = false;
    },
    close() { //弹出关闭弹窗
      this.dialogConfig.show = true;
      dataBase.dialogBottomConfig.show = false;
    },
    revoke(isFree, detail) {  //销假
      var _this = this;
      return function() {
        var sumAskDays = detail.sumAskDays;

        dataBase.dialogBottomConfig.show = false;

        if (isFree) return _.alert("提示", "自由流程的请假单无法销假");
        if (!isVipSilver(interfaceCode.INTERFACE_CODE_ASK)) return _.alert("提示", "销假功能仅限VIP用户使用");
        if (sumAskDays) {
          checkHasRevoked(detail.askId).then(result => {  //查询是否存在销假单
            if (result.code == "0") {
              let hasRevoked = result.data.revokedCount;
              hasRevoked != 0 ? _.alert("提示", "当前请假单已存在一个审批中的销假单，请前往已提交列表查询") :
                                _this.$router.push({
                                  name: "add",
                                  query: { askId: detail.askId, type: "revoke",leaveType: _this.leaveType }
                                });
            } else {
              _.alert("提示", "查询请假单所关联的销假单出错");
            }
          });

        } else {
          _.alert("提示", "2017年之前的请假单无法销假");
        }
      };
    },
    initList(isLoadMore, isSearch) {
      var _this = this;
      _.showLoading(); //显示loading
      getPageList('apply', _this.postData).then(res => {
        if(_this.maxPage === null || isSearch) _this.maxPage = res.data.maxPage;
        if(_this.totalRows === null || isSearch) _this.totalRows = res.data.totalRows;
        this.haSearch = !(!res.data.pageData && this.postData.keyWord == ''); // 是否显示搜素框
        _this.setList(res, isLoadMore);
      });
    },
    getSearchMessage(keyWord, type) { //获取搜索结果
      unLockScroll();
      this.postData.keyWord = keyWord;
      this.postData.page = 1;
      this.postData.typeName = type;

      this.initList(false, true);
    },
    closeApply() {  //关闭请求
      var _this = this;
      delApprove(_this.id); //删除转审信息
      _.showLoading();
      var data = {
        reason: _this.dialogConfig.reason,
        isOver: "-1",
        signImg: ""
      };
      updateTaskStatus(_this.id, 2, data).then(result => {
        _.hideLoading();
        _this.dialogConfig.show = false;
        if (result.code == "0") {
          _this.list[_this.currentIndex].auditStatus = '已关闭';
          _this.list[_this.currentIndex].isover = '-1';
          initHead();
        }else {
          return _.alert('提示:', result.desc);
        }
      });
    },
    showTimeInput: function() { //搜索框的输入特殊功能，弹出时间插件
      lockScroll();
      $(this.$refs.apply_search).find('.qwui-search_input').mobiscroll('show');
    },
    closeDialog() {
      this.dialogConfig.show = false;
    },
    getStatus(item) { //获取审批状态
      let status = '';
      if(item.alreadyRevoked !== 0 && item.isRevoked === '0') status = '已销假';
      else status = item.auditStatus;

      return status;
    },
    changeZIndex() {
      this.ZIndex.apply = true;
      this.ZIndex.curr = 'apply';
    },
    clearInput() {
      this.searchBar.keyWord = '';
    },
    setDialog(val) {
      this.setTopMask = val;
    }
  }
};
</script>
<style lang='scss' scoped>
.mt-43 {
  margin-top: 43px;
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

.qwui-nav_box_fixed {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  transition: top 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.qwui-nav_box_fixed.rise {
  z-index: 11;
}
.msg-box {
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  .input-style {
    text-align: left;
    border: none;
    font-size: 14px;
    -webkit-appearance: none;
    outline: none;
    color: #666666;
    width: 100%;
    resize: none;
  }
  .limit {
    color: #999;
    text-align: right;
  }
  .error-tip {
    color: red;
  }
}

.apply /deep/ .qwui-list_menu_box.qwui-list_menu_more {
  background-size: 100% !important;
  width: 20px;
  height: 20px;
  background: url(../../asset/img/icon_more.png) center no-repeat;
}
.apply /deep/ .qwui-list_menu_box {
  margin-right: 16px;
  margin-top: -29px;
}
.apply /deep/ .qwui-list_item_box {
  padding: 12px 0 12px 0;
}
.apply /deep/ .qwui-list_item_user {
  padding-top: 0px;
}
.limit_p {
  padding-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  word-wrap: normal;
  text-overflow: ellipsis;
  flex: 1;
}
.mr-8 {
  margin-right: 8px;
}
</style>
