<template>
  <div class="wrap">
    <header v-if="isShowHeader">
      <div class="qwui-search_box_height"></div>
      <!--搜索框-->
      <div class="qwui-nav_box_fixed">
        <search_box ref="searchBox" :searchinput="headData.searchBar" v-on:listenToSearchBox="listenToSearchBox" v-on:listenToClearInput="listenToClearInput"
                    v-if="headData.searchBar.show" :class="{'qwui-morePadding': homeFooterList.nav_on === 2}">
          <div slot="rightSpan" class="searchFilter searchOrder" @click="chooseFilter('searchOrder')" :class="{'active': searchFilterBar.showSearchOrder}"></div>
          <div slot="rightSpan" class="searchFilter searchState" @click="chooseFilter('searchState')" :class="{'active': searchFilterBar.showSearchState || loadMore.data['searchValue.status'] !== 'all'}" v-if="homeFooterList.nav_on === 2"></div>
        </search_box>
      </div>
    </header>

    <!--筛选框-->
    <search-filter :filterInfo="searchFilterBar" v-on:listenToSearchOrder="getSearchFilter" v-on:toggleBody="toggleBody"></search-filter>

    <!--中部弹窗-->
    <transition name="slide">
      <!-- <div v-show="popWindowConfig.showWindow"> -->
      <!-- <div style="width: 100px;height: 100px;background: blue;position: fixed;top:300px;z-index:100;"></div> -->
      <pop-window ref="popWindow" :popWindowConfig="popWindowConfig" v-on:refreshListData="refreshListData" v-on:showPopWindow="showPopWindow"></pop-window>
      <!-- </div> -->
    </transition>
    <!--顶部页面tab菜单栏-->
    <nav v-if="homeFooterList.nav_on == 2">
      <menu_tab_two :selectdata="menuChangeData" v-on:listenTabChange="showMsgFromMenuTab"></menu_tab_two>
    </nav>

    <!--主体列表-->
    <section class="main">
      <div class="draft_area" v-show="isShowDraft && draftNum && homeFooterList.nav_on == 0" @click="enterDraft">
        <a href="javascript:;" class="enterDraft">
          <span class="draft_icon"></span>
          <span class="draft_text">
            你有{{draftNum}}个草稿
          </span>
        </a>
        <a href="javascript:;" class="closeDraft"></a>
      </div>
      <div class="draft_area myPub" v-show="myBuiltIngTask && homeFooterList.nav_on == 0" @click="showMsgFromFooterNav('myPub', true)">
        <a href="javascript:;" class="enterDraft">
          <span class="draft_icon draft_icon_pub"></span>
          <span class="draft_text myPub_text">
            你有{{myBuiltIngTask}}个发布的任务未完成，点击查看
          </span>
        </a>
        <a href="javascript:;" class="closeDraft myPub_close"></a>
      </div>
      <task-list :loadmore="loadMore" :currentSchType="currentSchType" :ingTask="ingTask" :overTask="overTask" v-on:listenDoMore="showDialog"></task-list>
      <!--加载状态-->
      <!-- <load-more class="qwui-no_content" :class="{'qwui-none':isHideLoadFoot}" :loadmore="loadMore" ref="loadMoreFun" @showMsgFromLoadMore="showMsgFromLoadMore"></load-more> -->

      <load-more class="qwui-no_content" ref="loadMoreFun"
                 @loadMoreClick="loadMoreClick" :loading="loading" :hasMore="hasMore" :type="'commentList'" v-windowscroll="scrollLoadMore">
        <div>
          <div v-if="isHideLoadFoot">
            <div class="qwui-load_more_foot" v-if="loadMore.data.schType == 'myWait'">共 {{loadMore.padeConfig.pageData.length}} 任务<span class="qwui-segment_line"></span>其中 {{unReadNum}} 未阅</div>
            <div class="qwui-load_more_foot" v-else >共 {{loadMore.padeConfig.pageData.length}} 任务</div>
          </div>
          <div v-else class="qwui-noContent_wrapper">
            <i class="qwui-no_record_icon"></i>
            <div class="qwui-font_text_wrapper">
              <span class="qwui-font_text">{{loadMore.hasRecord.operation.text}}</span>
              <!--<span class="qwui-font_text qwui-red" v-show="currentSchType === 'myWait' || currentSchType === 'myPub'" @click="$router.push({name:'add'})">新建任务</span>-->
            </div>
          </div>
        </div>
      </load-more>


    </section>

    <!--下部列表操作弹窗-->
    <dialog_mask_bottom :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>

    <!--底部菜单-->
    <footer v-if="isShowFooter">
      <footer-nav :footernavdata="homeFooterList" :waitingTaskNum="waitingTaskNum" v-on:listenFooter="showMsgFromFooterNav"></footer-nav>
    </footer>

    <!-- 初次弹出的提示 -->
    <transition name="fade">
      <div class="ft_wrapper" v-if="isFirstTimeLogin">
        <div class="ft_content">
          <div class="top_img"></div>
          <div class="bottom_wrappr">
            <ul>
              <li class="ft_subTitle">· 任务实时协作，操作记录有迹可寻</li>
              <li class="ft_subTitle">· 界面全新改版，交互体验全面提升</li>
              <li class="ft_subTitle">· 更多功能，持续来袭</li>
            </ul>
            <a href="javascript:;" class="ft_closeBtn" @click="closeFT()">立即体验</a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import search_box from '@/components/base/search_box';
  import menu_tab_two from '@/components/button/menu_tab_two';
  // import loadMore from '@/components/base/load_more';
  import loadMore from '@/components/list/load_more';
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue'
  import search_filter from './components/search_filter';
  import footer_nav from './components/footer_nav';
  import task_list from './components/task_list';
  import pop_window from './components/pop_window';
  import {countViewMessage} from '../api/getData';

  export default {
    name: 'index',
    data() {
      return {
        headData: dataBase.home.headData, //头部和搜索框
        homeFooterList: dataBase.home.homeFooterList, //底部菜单
        menuChangeData: dataBase.home.selectData, //相关页面tab菜单切换数据结构
        dialogBottomConfig: dataBase.home.dialogBottomConfig, //列表操作弹窗
        popWindowConfig: dataBase.home.popWindowConfig, //弹窗
        searchFilterBar: dataBase.home.searchFilterBar, // 筛选框
        loadMore: dataBase.home.loadMore,//加载列表组件数据
        isShowDraft: true, // 是否显示草稿
        isShowHeader: true, // 是否显示头部
        isShowFooter: true, // 是否显示尾部
        // isToDraft: false, // 路由跳转进入草稿页，返回时候根据此数据判断是否将loadMore.data.schType变为myWait
        isFirstTimeLogin: false, // 用户第一次登陆进入新版本任务分派，需要引导图
        draftNum: 0,
        myBuiltIngTask: 0,
        waitingTaskNum: 0,
        ingTask: 0,
        overTask: 0,
        operateConfig: {
          taskId: '',
          subtaskId: '',
          roleArr: [],
        },
        updateReason: '',
        currentPage: 1,
        currentSchType: 'myWait',
        isHideLoadFoot:false,
        deleteTaskPath: '',
        deleteTaskData: '',
        needAddRefresh: false,
        loading: false, // 是否正在加载中
        hasMore: true,
        lock_roll: false,
      }
    },
    created: function () {
      let push = _.getUrlParam('push');
      if(push){
        countViewMessage({
          params:{
            push:push
          }
        });
      }
      // 请求判断是否是第一次进入
      var self = this
      _.ajax({
        url: _.baseURL + '/portal/taskPortalCtl/isNeedGuide.do',
        type: 'POST',
        success: function (result) {
          if (result.data.isNeedGuide) {
            self.showFT()
          }
        }
      })
      this.isShowHeader = true;
      this.isShowFooter = true;
      if (this.$route.params.needRefresh) {
        this.refreshListData()
      }
      if (this.loadMore.isToDraft) {
        this.loadMore.data.schType = 'myWait';
        this.loadMore.isToDraft = false;
      }
      this.loadMore.data.schType = this.currentSchType;
      this.dialogBottomConfig.maskCallBack = this.closeBottomMsg; // 初始化点击背景关闭时间
      this.deleteLastIds(); // 若从‘我负责’的详情返回,将‘我负责’的参数中的LastIds清空
      this.$store.commit('isDetailPageUpdate',false); // 日升的操作（初始化下拉数据
      // 第一次加载数据
      this.clearLoadFun();
    },
    mounted() {
      var self = this
      window.onhashchange = function() {
        if (self.$route.name != 'detail'){
          self.$router.push({
            name: 'home'
          })
        }
      }
    },
    methods: {
      chooseFilter(type) {
        let order = this.searchFilterBar.showSearchOrder;
        let state = this.searchFilterBar.showSearchState;
        let typeIn = this.searchFilterBar.dataType;
        if ((order || state ) && (typeIn === type)) {
          this.closeFilterBar();
          return;
        }
        this.closeFilterBar();
        if (type === 'searchOrder') {
          this.searchFilterBar.showSearchOrder = true;
        } else {
          this.searchFilterBar.showSearchState = true;
        }
        this.searchFilterBar.dataType = type;
        this.toggleBody(1); // 使背景不随之滚动
      },
      closeFilterBar() {
        this.searchFilterBar.showSearchOrder = false;
        this.searchFilterBar.showSearchState = false;
      },
      // 搜索关键字后重新请求
      listenToSearchBox(val) {
        this.loadMore.data['searchValue.keyWord'] = val;
        this.refreshListData();
      },
      // 删除关键字之后，删除loadMore里的数据
      listenToClearInput() {
        this.loadMore.data['searchValue.keyWord'] = '';
      },
      getSearchFilter(index, val, type) {
        this.toggleBody(0); // 使背景正常滚动
        // 此处的Val为搜索的排序值，如priorityDesc 等待调用接口
        if (type === 'searchOrder') {
          this.searchFilterBar.searchOrder.activeIndex = index;
          this.loadMore.data.sortBy = val;
        } else {
          this.searchFilterBar.searchState.activeIndex = index;
          this.loadMore.data['searchValue.status'] = val;
        }
        this.closeFilterBar();
        this.refreshListData();
      },
      // 点击下方两侧按钮
      showMsgFromFooterNav(val, isFromInex) {
        var self = this
        if (val === 'addNewTask') {
          this.$router.push({
            name: 'add',
            params: {
              needAddRefresh: self.needAddRefresh
            }
          })
        } else {
          if (isFromInex) {
            // 点击'待处理'页的红色弹框进行跳转
            this.homeFooterList.nav_on = 2;
            // this.loadMore.data['searchValue.status'] = '1';
            // this.searchFilterBar.searchState.activeIndex = 1;
          } else {
            // '待处理''我的'两个页面切换，筛选数据初始化
            this.loadMore.data['searchValue.status'] = 'all';
            this.searchFilterBar.searchState.activeIndex = 0;
          }
          // 跳回‘我的’页面，使之处于‘我发起的’
          this.deleteLastIds() // 从‘我负责’点击回‘待处理’，将参数中的LastIds清空
          this.menuChangeData.index = 0;
          this.loadMore.data.schType = val;
          this.currentSchType = val;
          this.refreshListData();
        }
      },
      showDialog(item, itemIndex) {
        // 初始化popwindow的数据,并渲染新数据
        this.initPopWinConfig();
        // popwindow需传过去的子任务id及子任务list
        this.popWindowConfig.taskId = item.taskId;
        this.popWindowConfig.subtaskId = item.subtaskId;
        this.popWindowConfig.taskTitle = item.title;
        // 保存要传的item的id
        this.operateConfig.taskId = item.taskId;
        this.operateConfig.subtaskId = item.subtaskId;
        // 点击过，就已缓存，不再进行请求
        let isRequset = item.hasOwnProperty('roleArr');
        if (!isRequset) {
          this.requestTaskInfo(item, itemIndex);
        } else {
          this.operateConfig.roleArr = item.roleArr;
          this.filterStatus(item);
          // this.dialogBottomConfig.show = true;
          this.showBottomMsg();
          this.popWindowConfig.subtaskList = item.subtaskList;
          this.popWindowConfig.subtask = item.subtask;
        }
      },
      // 判断是【待处理，我发起，我负责，我相关】的哪一项
      filterSchType() {
        let arr = ['myWait', 'myPub', 'myRes', 'myRel', 'myDraf']; // 待处理，我发起，我负责，我相关
        let type = this.loadMore.data.schType;
        return arr.indexOf(type);
      },
      // 判断状态，已结束，进行中
      filterStatus(item) {
        var self = this;
        let type = this.filterSchType(); // 判断是【待处理，我发起，我负责，我相关】的哪一项
        this.dialogBottomConfig.btnConfig = [];
        if (item.taskStatus == 2) {
          // 已结束(没有待处理)
          switch(type) {
            case 0: // 待处理
              this.filterWait(item);
              break;
            case 1: // 我发起的
              this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0, 3]);
              break;
            case 2: // 我负责的
              let isMain = item.subtaskId ? false : true;
              if (isMain) { // 主任务
                this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0, 3]);
              }
              else { // 子任务(判断角色)
                self.filterSubTaskPerson(item, 'end');
              }
              break;
            case 3: // 我相关的
              self.filterTaskPerson(item, 'end');
              break;
          }
        }
        else {
          // 进行中,逾期
          switch(type) {
            case 0: // 待处理
              let isMainWait = item.subtaskId ? false : true;
              if (isMainWait) { // 主任务
                if (item.roleArr.includes('5')) { // 发起人
                  this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0, 1, 2, 4]);
                  return;
                }
                else if (item.roleArr.includes('0')) { // 负责人
                  if (item.closeSwitch === '1') { // 允许负责人关闭
                    this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0, 2]);
                  } else if (item.closeSwitch === '0') { // 不允许负责人关闭
                    this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0]);
                  }
                  return;
                }
                // 若为：相关人，子执行人，子负责人，只有复制功能
                else {
                  this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0]);
                  return;
                }
              }
              else { // 子任务
                self.filterSubTaskPerson(item, 'inProgress');
              }
              break;
            case 1: // 我发起的
              this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0, 1, 2, 4]);
              break;
            case 2: // 我负责的
              let isMain = item.subtaskId ? false : true;
              if (isMain) { // 主任务
                if (item.roleArr.includes('5')) { // 判断发起人
                  this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0, 1, 2, 4]);
                } else if (item.roleArr.includes('0')) {
                  if (item.closeSwitch === '1') { // 允许负责人关闭
                    this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0, 2]);
                  } else if (item.closeSwitch === '0') { // 不允许负责人关闭
                    this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0]);
                  }
                }
                // 若为：子执行人，子负责人，只有复制功能(此处不可能仅有相关人)
                else {
                  this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0]);
                  return;
                }
              }
              else { // 子任务(判断角色)
                self.filterSubTaskPerson(item, 'inProgress');
              }
              break;
            case 3: // 我相关的
              self.filterTaskPerson(item, 'inProgress');
              break;
            case 4: // 草稿页
              this.dialogBottomConfig.btnConfig = this.pushBtnConfig([4]);
              break;
          }
        }
      },
      // 判断是否是发起人
      filterRoleCreator(creator) {
        let uesrId = dataBase.config.userId;
        return creator == uesrId ? true : false;
      },
      // 区分主任务角色
      filterTaskPerson(item, state) {
        // 发起人
        var roleArr = item.roleArr
        if (roleArr.includes('5')) {
          let arr = [];
          arr = state === 'end' ? [0, 3] : [0, 1, 2, 4];
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig(arr);
          return;
        }
        // 主任务负责人
        else if (roleArr.includes('0')) {
          let arr = [];
          arr = state === 'end' ? [0, 3] : [0, 2];
          if (item.closeSwitch === '0') { // 不允许负责人关闭
            arr.pop()
          }
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig(arr);
          return;
        }
        // 相关人
        else {
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0]);
        }
      },
      // 区分子任务角色
      filterSubTaskPerson(item, state) {
        let roleArr = item.roleArr
        // 发起人
        if (roleArr.includes('5')) {
          let arr = [];
          arr = state === 'end' ? [7] : [5, 6, 8];
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig(arr);
          return;
        }
        // 子任务负责人
        else if (roleArr.includes('3')) {
          let arr = [];
          arr = state === 'end' ? [7] : [0, 5, 6];
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig(arr);
          return;
        }
        // 子任务执行人
        else if (roleArr.includes('4')) {
          let arr = [];
          arr = state === 'end' ? [7] : [0, 6];
          if (item.closeSwitch === '0') { // 不允许负责人关闭
            arr.pop()
          }
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig(arr);
          return;
        }
      },
      // 待处理，已结束，判断身份，确定是否有重启复制功能
      filterWait(item) {
        let roleArr = item.roleArr
        // 发起人
        if (roleArr.includes('5')) {
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0, 3]);
        } else if (roleArr.includes('0')) {
          let arr = [0, 3]
          if (item.closeSwitch === '0') { // 不允许负责人关闭/重启
            arr.pop()
          }
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig(arr);
        } else if (roleArr.includes('3')) {
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig([3]);
        } else if (roleArr.includes('4')) {
          let arr = [3]
          if (item.closeSwitch === '0') { // 不允许子负责人关闭/重启
            arr.pop()
          }
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig(arr);
        } else if (roleArr.includes('1')) {
          this.dialogBottomConfig.btnConfig = this.pushBtnConfig([0]);
        }
      },
      // 初始化下方按钮
      pushBtnConfig(arr) {
        let demo_arr = [
          {title:" 复制任务",    callBack: this.copyTask}, // 0
          {title:" 修改截止时间", callBack: this.changeTime}, // 1
          {title:" 结束任务",    callBack: this.endTask}, // 2
          {title:" 重启任务",    callBack: this.updateTask}, // 3
          {title:" 删除",        callBack: this.delTask, primary: true}, // 4
          {title:" 修改子任务截止时间", callBack: this.changeTime}, // 5
          {title:" 结束子任务",  callBack: this.endSubTask}, // 6
          {title:" 重启子任务",  callBack: this.updateTask}, // 7
          {title:" 删除子任务",  callBack: this.delTask}, // 8
        ];
        let info_arr = [];
        if (arr) {
          arr.forEach(index => {
            info_arr.push(demo_arr[index])
          })
        }
        info_arr.push({title:" 取消", callBack: this.closeBottomMsg})
        return info_arr
      },
      // 单条任务请求数据
      requestTaskInfo(item, itemIndex) {
        var self = this;
        _.ajax({
          url: _.baseURL + '/portal/taskPortalCtl/getMyTaskInfo.do',
          type: 'POST',
          data: {
            taskId: item.taskId
          },
          success: function (result) {
            // 渲染popWindow数据
            self.applyPopWinConfig(result, item);
            // 赋予子任务的list
            if (result.data.subtaskList) {
              item['subtaskList'] = result.data.subtaskList;
              item.subtaskList.forEach(sitem => {
                sitem.score = 10
              })
            } else {
              item['subtaskList'] = [];
            }
            // （若当前为子任务）赋予子任务数据
            if(item.subtaskId && result.data.subtask) {
              result.data.subtask.forEach(sitem => {
                if (sitem.subTaskId == item.subtaskId) {
                  item['subtask'] = {
                    'title': sitem.title,
                    'subTaskId': sitem.subTaskId,
                    'score': 10,
                    'showSubTask': false,
                  };
                }
              })
            } else {
              item['subtask'] = {};
            }

            let isCreator = self.filterRoleCreator(result.data.taskPO.creator);
            if (isCreator) {
              // 若为发起人，直接为5
              item['roleArr'] = ['5'];
            } else {
              // 0-负责人 1相关人; 2抄送人; 3子任务负责人; 4子任务执行人
              item['roleArr'] = Object.keys(result.data.recipientTypeMap);
            }
            self.operateConfig.roleArr = item.roleArr;
            self.filterStatus(item);
            // self.dialogBottomConfig.show = true;
            self.showBottomMsg();
          }
        });
      },
      // 判断是否切换了请求页面，来决定搜索框的显示隐藏 00000
      showMsgFromLoadMore(data) {
        // let newArr = []
        // let newArryIng = []
        console.log('ingTask',data.ingTask)
        console.log('overTask',data.overTask)
        if(data.currPage == data.maxPage){
          this.isHideLoadFoot = true;
        }
        this.draftNum = data.draftNum
        this.myBuiltIngTask = data.myBuiltIngTask
        this.waitingTaskNum = data.waitingTaskNum
        if (data.ingTask >= 0 || data.overTask >= 0) {
          this.ingTask = data.ingTask
          this.overTask = data.overTask
        }
        // '我负责'接口多加参数creatorTime,filterLastIds
        if (this.loadMore.data.schType === 'myRes' && data.pageData && data.pageData.length) {
          let len = data.pageData.length;
          // ‘我负责’处的注释的两行参数
          // this.loadMore.data['searchValue.creatorTime'] = data.pageData[len -1].creatorTime;
          // this.filterLastIds(data.pageData);
        }
        // data.pageData.map(item => {
        //   if(item.taskStatus == '2' || item.taskStatus == '3'){
        //     newArr.push(item)
        //   }else if(item.taskStatus == '1'){
        //     newArryIng.push(item)
        //   }
        // })
        // newArryIng.push(...newArr)
        // console.log('重新排序：',newArryIng)
      },
      // ‘我负责’多传一个filterLastIds的参数
      filterLastIds(arr) {
        let len = arr.length;
        var time = arr[len - 1].creatorTime;
        var postArr = [];
        for (let i = 0; i < len - 1; i++) {
          let item = arr[len -1 -i]
          if (item.creatorTime === time) {
            if (item.subtaskId) {
              postArr.push(item.subtaskId)
            } else {
              postArr.push(item.taskId)
            }
          } else {
            break;
          }
        }
        this.loadMore.data['searchValue.filterLastIds'] = postArr.join(',')
      },
      // 清空‘我负责’的参数中的LastIds
      deleteLastIds() {
        // ‘我负责’处的注释的两行参数
        // delete this.loadMore.data['searchValue.filterLastIds']
        // delete this.loadMore.data['searchValue.creatorTime']
      },
      // 相关页面tab切换
      showMsgFromMenuTab(item,index) {
        if (index != 1) {
          this.deleteLastIds() // 若为点击‘我发起’‘我相关’，则将‘我负责’的参数中的LastIds清空
        }
        this.loadMore.data.schType = item.data.schType;
        this.currentSchType = item.data.schType;
        this.refreshListData(); // 清空列表数据，重新请求
      },
      // 显示底部弹窗列表
      showBottomMsg() {
        this.toggleBody(1)
        this.dialogBottomConfig.show = true;
      },
      // 关闭底部弹窗列表
      closeBottomMsg() {
        this.toggleBody(0)
        this.dialogBottomConfig.show = false;
      },
      // 修改截止时间
      changeTime() {
        // this.dialogBottomConfig.show = false;
        this.closeBottomMsg();
        // this.popWindowConfig.taskId = this.operateConfig.taskId;
        // this.popWindowConfig.subtaskId = this.operateConfig.subtaskId;
        this.popWindowConfig.curOperate = 'changeTime';
        this.popWindowConfig.changeTime.showTime = true;
        this.showPopWindow(true);
      },
      // 删除任务
      delTask() {
        var self = this;
        var id,
          path,
          deleteData;
        if (this.operateConfig.subtaskId) {
          id = this.operateConfig.subtaskId
          path = '/portal/taskPortalCtl/deleteSubTask.do'
          deleteData = {
            subtaskId: id
          }
        } else {
          id = this.operateConfig.taskId
          path = '/portal/taskinfoAction!ajaxBatchDelete.action'
          deleteData = {
            ids: id
          }
        }
        _.ajax({
          url: _.baseURL + '/portal/taskinfoAction!ajaxBatchCheck.action',
          type: "POST",
          data: {
            ids: id
          },
          success: function (result) {
            if(result.code=="0"){
              if(result.data.haveComment){
                _.alert('提示', '标题为【'+result.data.comments[0]+'】已被评论，不可以删除');
              } else {
                self.deleteTaskPath = path
                self.deleteTaskData = deleteData
                _.alert('', '是否确定删除', {
                  primaryBtn:{name:"i18n.confirm", callBack: self.requestDelTask},
                  defaultBtn:{name:"取消", callBack:null}, //主操作按钮
                })
              }
            }
          }
        });
        this.closeBottomMsg();
      },
      // 删除任务请求
      requestDelTask() {
        var self = this
        _.ajax({
          url: _.baseURL + this.deleteTaskPath,
          type: "POST",
          data: this.deleteTaskData,
          success: function (result) {
            if (result.code == "0") {
              _.tooltips_succeed('删除成功', true);
              self.refreshListData(); // 刷新数据
            }else{
              _.alert('提示',result.desc);
            }
          }
        })
      },
      // 重启任务
      updateTask() {
        this.popWindowConfig.updateTask.showUpadate = true;
        this.popWindowConfig.curOperate = 'updateTask';
        // this.dialogBottomConfig.show = false;
        this.closeBottomMsg();
        this.showPopWindow(true);
      },
      // 复制任务
      copyTask() {
        var self = this
        self.toggleBody(0);
        this.$router.push({
          name: 'add',
          query: {
            isDraft: false,
            taskId: self.operateConfig.taskId
          },
        })
      },
      // 结束主任务
      endTask() {
        this.popWindowConfig.endType.showType = true;
        this.popWindowConfig.curOperate = 'endTask';
        let roleArr = this.operateConfig.roleArr;
        if (roleArr.includes('5')) {
          this.popWindowConfig.score.showScore = true;
        } else if (roleArr.includes('0')) {

        }
        // this.dialogBottomConfig.show = false;
        this.closeBottomMsg();
        this.showPopWindow(true);
      },
      // 结束子任务
      endSubTask() {
        this.popWindowConfig.endType.showType = true;
        this.popWindowConfig.curOperate = 'endSubTask';
        let roleArr = this.operateConfig.roleArr;
        if (roleArr.includes('3') || roleArr.includes('5')) {
          this.popWindowConfig.subtask.showSubTask = true;
        } else if (roleArr.includes('4')) {
          this.popWindowConfig.subtask.showSubTask = false;
        }
        // this.dialogBottomConfig.show = false;
        this.closeBottomMsg();
        this.showPopWindow(true);
      },
      // 渲染草稿页面
      enterDraft() {
        // this.isShowHeader = false;
        // this.isShowFooter = false;
        // this.isShowDraft = false;
        // this.refreshListData();
        // this.loadMore.data.schType = 'myDraf';
        var self = this
        this.loadMore.data['searchValue.status'] = 'all';
        this.loadMore.isToDraft = true;
        this.$router.push({
          path: '/draft',
          params: {
            isDraft: true,
            loadMore: self.loadMore,
            taskId: self.operateConfig.taskId,
          }
        })
      },
      // 刷新数据
      refreshListData() {
        this.isHideLoadFoot = false;
        // this.$refs.loadMoreFun.clearLoadFun();
        this.clearLoadFun();
      },
      // 打开popWindow
      showPopWindow(a) {
        if (a) {
          this.toggleBody(1)
          this.popWindowConfig.showWindow = true; // 打开
        } else {
          this.toggleBody(0)
          this.popWindowConfig.showWindow = false; // 关闭
        }
      },
      // 请求后，渲染popWInindow
      applyPopWinConfig(result, item) {

        // 赋予主任务的截止时间,开始时间
        // 还要判断后台接口返回的数据，是PO格式，还是VO格式
        if (result.data.taskPO.taskStart.time) {
          this.popWindowConfig.changeTime.mainTaskTime.splice(0, 0,result.data.taskPO.taskStart.time, result.data.taskPO.taskStop.time);
        } else {
          this.popWindowConfig.changeTime.mainTaskTime.splice(0, 0,result.data.taskPO.taskStart, result.data.taskPO.taskStop);
        }

        // 赋予子任务的截止时间,开始时间
        if (result.data.subtask) {
          result.data.subtask.forEach(sitem => {
            this.popWindowConfig.changeTime.subTaskTimeEnd.push(sitem.stopSubtaskTime.time)
            this.popWindowConfig.changeTime.subTaskTimeStart.push(sitem.startSubtaskTime.time)
          })
        }
        // 赋予子任务列表
        // this.popWindowConfig.subtaskList = item.subtaskList;
        this.popWindowConfig.subtaskList = result.data.subtaskList;
        // （若当前为子任务，赋予子任务信息）
        // this.popWindowConfig.subtask = item.subtask;
        this.popWindowConfig.subtask = result.data.subtask;
        // 赋予是否可以评价
        this.popWindowConfig.isScore = result.data.tbQyTaskScoresettingVO.isScore;

        // 初始化pop-window的datatime的starttime,endtime数据
        // this.$refs.popWindow.initTime()
      },
      // 初始化popwindow的数据
      initPopWinConfig() {
        this.popWindowConfig = {
          showWindow: false, // window显示与否
          curOperate: '', // 当前操作类型
          taskId: '', // 当前任务的id
          subtaskId: '', // 当前子任务的id
          subtaskList: [], // 子任务的list
          subtask: { // 子任务(当前为子任务(用于评分))
            score: 10,
            subTaskId: '',
            title: '',
            showSubTask: false,
          },
          reasonText: '',
          taskTitle: '', // 任务标题
          roleArr: [], // 角色
          isScore: 0, // 是否可以评分，0可以，1不可以
          endType: {
            showType: false,
            btnArray: ['完成', '终止', '取消', '拒绝'], // 结束类型按钮组
            btnActiveNum: 1,
          },
          score: {
            showScore: false,
            scoreNum: 10, // 评分分数
          },
          changeTime: {
            showTime: false,
            endTime: '',
            mainTaskTime: [],
            subTaskTimeEnd: [],
            subTaskTimeStart: [],
          },
          updateTask: {
            showUpadate: false,
            resetAll: false,
          },
        }
      },
      // 弹窗出来，isPin=1背景不滚动,isPin=0背景正常滚动
      toggleBody(isPin){
        if(isPin){
          document.body.style.height = '100vh'
          document.body.style['overflow-y'] = 'hidden'
        }
        else{
          document.body.style.height = 'unset'
          document.body.style['overflow-y'] = 'auto'
        }
      },
      showFT() {
        this.isFirstTimeLogin = true;
      },
      closeFT() {
        this.isFirstTimeLogin = false;
      },
      //清空数据，第一次或重新请求数据
      clearLoadFun(){
        //初始化第一页
        if(this.loadMore.pageIndexName){
          this.loadMore.data[this.loadMore.pageIndexName]=1;
        }else{
          this.loadMore.data.page=1;
        }
        //初始化返回数据
        this.loadMore.padeConfig={
          currPage:"",
          maxPage:"",
          pageData:[],  //返回的列表数据
          totalRows:"",//数据总条数
        };
        //开始第一次请求
        this.requestData();
      },
      //下拉加载
      scrollLoadMore:function (e) {
        // 非列表页滚动不加载
        if (this.$route.path != '/' && this.$route.path != '/draft'){
          return;
        }
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if(!this.lock_roll && this.hasMore){
            this.lock_roll=true;
            this.loadMoreClick();
          }
        }
      },
      // 点击加载
      loadMoreClick() {
        this.lock_roll = true;
        if (this.loadMore.padeConfig.currPage < this.loadMore.padeConfig.maxPage) {
          this.tips = this.$t('i18n.loading');
          this.loadMore.data[this.loadMore.pageIndexName] += 1;
          this.requestData(); //加载请求
        }
      },
      // 请求接口数据
      requestData() {
        if (JSON.stringify(this.loadMore) == '{}') {
          _.alert('i18n.notice', 'i18n.loadRequestFail');
          return;
        } else if (this.loadMore.padeConfig.totalRows == "" || this.loadMore.padeConfig.pageData.length == 0) {
          this.tips = "";
        }
        this.loadMore.hasRecord.show = false; //隐藏图标
        this.loading = true;
        var self = this;
        _.ajax({
          url: _.baseURL + self.loadMore.url,
          type: 'POST',
          data: self.loadMore.data,
          success: function (result) {
            self.lock_roll = false;
            self.loading = false;
            if (result.code == "0") {
              var temp = {};
              if (result.data.pageDate) {
                temp = result.data.pageDate;
                self.loadMore.padeConfig.maxPage = temp.totalPages ? temp.totalPages : '';
                self.loadMore.padeConfig.currPage = temp.currentPage ? temp.currentPage : '';
              } else {
                temp = result.data;
                self.loadMore.padeConfig.maxPage = temp.maxPage ? temp.maxPage : '';
                self.loadMore.padeConfig.currPage = temp.currPage ? temp.currPage : '';
              }
              self.loadMore.padeConfig.totalRows = temp.totalRows ? temp.totalRows : '';
              if (temp.pageData) {
                if ((self.loadMore.padeConfig.pageData && self.loadMore.padeConfig.pageData.length == 0) || !self
                  .loadMore.padeConfig.pageData || self.loadMore.padeConfig.currPage == 1) {
                  self.loadMore.padeConfig.pageData = temp.pageData;
                } else {
                  self.loadMore.padeConfig.pageData = self.loadMore.padeConfig.pageData.concat(temp.pageData);
                }
              } else {
                self.loadMore.padeConfig.pageData = [];
              }
              self.loadRequestDes();
              self.showMsgFromLoadMore(temp)
            } else {
              _.alert('i18n.notice', result.desc);
            }
            self.loadFinished = true;
          }
        });
      },
      //判断列表状态
      loadRequestDes(){
        this.hasMore=false;
        this.loadMore.hasRecord.show=false;//隐藏图标
        if(this.loadMore.padeConfig.totalRows>0 && this.loadMore.padeConfig.currPage<this.loadMore.padeConfig.maxPage){
          this.hasMore=true;
          return this.tips=this.$t('i18n.loadMore');
        }else if(this.loadMore.padeConfig.totalRows==0 ||(this.loadMore.padeConfig.pageData && this.loadMore.padeConfig.pageData.length==0)){
          if(!this.loadMore.hasRecord.icon){
            return this.tips=this.$t('i18n.noRecord');
          }else{
            this.loadMore.hasRecord.show=true;//显示无记录图标
            return this.tips="";
          }
        }else if(this.loadMore.padeConfig.totalRows>0 && (this.loadMore.padeConfig.currPage==this.loadMore.padeConfig.maxPage)&& this.loadMore.padeConfig.currPage!="" && this.loadMore.padeConfig.maxPage!=""){
          return this.tips=this.$t('i18n.total')+this.loadMore.padeConfig.totalRows+this.$t((this.describeWord?this.describeWord:this.defaultDescribe));
        }else{
          return this.tips="";
        }
      },
    },
    computed: {
      unReadNum() {
        let num = 0;
        if (this.loadMore.padeConfig.pageData) {
          this.loadMore.padeConfig.pageData.forEach(item => {
            if (!item.read) {
              num++;
            }
          })
        }
        return num;
      },
    },
    watch: {
      $route(val) {
        this.dialogBottomConfig.show = false; // 路由变化，关闭底部选择栏
      },
      currentSchType(val) {
        // 无数据内容的时候。对文案进行改变
        if (val === 'myWait' || val === 'myPub') {
          // this.loadMore.hasRecord.operation.text = '暂无任务，马上'
          this.loadMore.hasRecord.operation.text = '暂无任务'
        } else {
          this.loadMore.hasRecord.operation.text = '暂无任务'
        }
      }
    },
    //路由跳转后，限制滚动
    beforeDestroy: function () {
      this.headData.show = true;
      this.lock_roll = true;
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (from.params.isRresh) {
          vm.needAddRefresh = true
          vm.refreshListData()
        }
      })
    },
    components: {
      "footer-nav": footer_nav,
      "task-list": task_list,
      "search-filter": search_filter,
      "pop-window": pop_window,
      search_box,
      menu_tab_two,
      loadMore,
      dialog_mask_bottom,
    }
  }

</script>

<style lang="scss" scoped>
  .wrap {
    background: #f7f7f7;
  }
  .ft_wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: rgba(0,0,0,0.6);
    border-radius: 3px;
    .ft_content {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      width: 335px;
      height: 400px;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      .top_img {
        flex: 1;
        border-radius: 3px 3px 0 0;
        background: url(../../../assets/svg/bg_yhyd.svg) no-repeat center center;
        background-size: cover;
        z-index: 101;
      }
      .bottom_wrappr {
        flex: 1;
        padding: 14px 14px 21px 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .ft_mainTitle {
          color: #444;
          font-size: 22px;
          margin-bottom: 5px;
        }
        ul {
          display: flex;
          flex-direction: column;
          align-items: center;
          .ft_subTitle {
            color: #999;
            font-size: 16px;
            margin-top: 7px;
          }
        }
        .ft_closeBtn {
          width: 100%;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: #5585F0;
          color: #fff;
          font-size: 17px;
          border-radius: 3px;
          margin-top: 23px;
        }
      }
    }
  }
  .searchFilter {
    width: 18px;
    height: 13px;
    padding: 9px 0 9px 17px;
    margin-left: 5px;
    &.searchOrder {
      background: url(../../../assets/svg/icon_search_sort.svg) no-repeat center center;
      &.active {
        background: url(../../../assets/svg/icon_search_sort-pressed.svg) no-repeat center center;
      }
    }
    &.searchState {
      background: url(../../../assets/svg/icon_search_sort_screen.svg) no-repeat center center;
      &.active {
        background: url(../../../assets/svg/icon_search_sort_screen-pressed.svg) no-repeat center center;
      }
    }
  }
  .draft_area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    background: #E8EFFF;
    margin-bottom: 4px;
    &.myPub {
      background: #FFE5E5;
      margin-bottom: 0;
    }
    .enterDraft {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      span {
        display: inline-block;
        vertical-align: middle;
      }
      .draft_icon {
        width: 18px;
        height: 18px;
        background: url(../../../assets/svg/icon_a-draft_draft.svg) no-repeat center center;
        background-size: 18px;
        &.draft_icon_pub {
          background: url(../../../assets/svg/icon_a-draft_draft_pub.svg) no-repeat center center;
          background-size: 18px;
        }
      }
      .draft_text {
        margin-left: 4px;
        color: #5585F0;
        font-size: 14px;
        &.myPub_text {
          color: #FE5354;
        }
      }
    }
    .closeDraft {
      width: 18px;
      height: 18px;
      background: url(../../../assets/svg/icon-a-list_arrow-blue.svg) no-repeat center center;
      background-size: 18px;
      &.myPub_close {
        background: url(../../../assets/svg/icon-a-list_arrow-red.svg) no-repeat center center;
        background-size: 18px;
      }
    }
  }
  .qwui-nav_box_fixed {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }
  .qwui-search_box_height {
    height: 45px;
  }
  .qwui-noContent_wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    .qwui-no_record_icon {
      width: 160px;
      height: 160px;
      background: url(../../../assets/svg/img_commom_emptypage.svg) center no-repeat;
      background-size: 160px 160px;
    }
    .qwui-font_text_wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      .qwui-font_text {
        color:#B2B9C8;
        font-size: 14px;
      }
      .qwui-red {
        font-size: 14px;
        color: #4D7CFE;
      }
    }
  }
  .qwui-no_content /deep/ .qwui-font_operation {
    color: #B2B9C8;
    font-size: 14px;
  }
  .qwui-load_more_foot{
    text-align: center;
    color:#999;
    line-height: 44px;
    font-size: 12px;
    .qwui-segment_line{
      margin: 0 10px;
      &::before{
        content: ' ';
        display: inline-block;
        width: 1px;
        height: 10px;
        background: #e5e5e5;
      }
    }
  }
  .qwui-morePadding /deep/ .with_right_span {
    margin-right: 75px;
  }
  .qwui-overlay /deep/ .qwui-dialog_bottom_footer{
    font-size: 16px; // 字体变大
    .qwui-dialog_bottom_btn {
      &:after {
        border-bottom: 1px solid #fff; // 隐藏1px的线
      }
    }
  }
  .qwui-menu_tab_two /deep/ .vux-tab{
    .vux-tab-item {
      color: #A2A4A7;
      &.vux-tab-selected {
        color: #0A1735;
      }
    }
    .vux-tab-ink-bar {
      .vux-tab-bar-inner {
        background-color: #5585F0;
      }
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  // .slide-enter-active, .slide-leave-active {
  //   transition: all 0.5s linear;
  //   transform: translate3d(0, 0, 0);
  //   // z-index: 100;
  // }
  // .slide-enter, .slide-leave-to {
  //   transform: translate3d(100%, 0, 0);
  // }


</style>
