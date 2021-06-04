<template>
  <div class="wrap"
    v-qw-water-mark="{ agentCode: agentCode}">
    <div class="qwui-search_box_height"></div>
    <div class="qwui-menu_tab_fixed active">
      <search-bar :searchinput="searchBar" :searchIndex="searchIndex"
        @listenToSearchBox="search" ref="searchBar"></search-bar>
    </div>
    <!--  头部标题栏start  -->
    <div v-if="unReadNum>0" class="qwui-unread" :class="{active:!unReadPage}">
      <span class="to_unread" v-if="!unReadPage" @click="toUnReadPage">
        <span>{{unReadNum}}个未阅动态</span>
        <i class="to_unread_icon"></i>
      </span>
      <span class="mark_unread" v-if="!unReadPage" @click="markUnread">标记为已阅</span>
      <span v-else @click="markUnread">全部标记为已阅({{unReadNum}})</span>
    </div>
    <div v-if="dynamicNum>0" class="qwui-unread" @click="toDynamicAudit(1)">
      <span>
        {{dynamicNum}}个动态审核<i class="to_unread_icon"></i>
      </span>
    </div>
    <div v-if="commentNum>0" class="qwui-unread"  @click="toDynamicAudit(2)">
      <span>
        {{commentNum}}个评论审核<i class="to_unread_icon"></i>
      </span>
    </div>
    <!--  头部标题栏end  -->

    <!--  主列表  -->
    <index-list :list="contentList" :listParam="listParam"></index-list>
    <load-more :loadmore="loadMore" :noshowTotal="true" describeWord=" 新闻" ref="loadMoreFun"
               @showMsgFromLoadMore="showMsgFromLoadMore" :class="{'qwui-loadmore':isShowPublish}"></load-more>

    <!--发布入口-->
    <div v-show="isShowPublish" @click="toPublish" class="qwui-publish_btn">
      <i class="qwui-publish_btn_icon"></i>发布动态
    </div>

    <action-sheet :dialogConfig="actionSheet"></action-sheet>
    <moveNotice v-show="isShowMoveNotice"></moveNotice>
    <no-record class="qwui-noType_wrap" v-show="isShowNoType" :hasrecord='hasrecord'></no-record>
  </div>
</template>
<script>
  import moveNotice from '../components/moveNotice/moveNotice.vue';
  import searchBar from '../../../components/base/search_box.vue';
  import indexList from './list/indexList.vue'
  import loadMore from './login/loadMore.vue';
  import actionSheet from '../../../components/base/dialog_mask_bottom';
  import homePage from '../js/homePage';
  import dynamicAudit from '../js/dynamicAudit';
  import commentAudit from '../js/commentAudit';
  import noRecord from '@/components/base/no_record';
  import {getPermission, getDynamicType, getTitle, getDynamicNum, getCommentNum, markUnreadPower, markUnread} from '../api/getData'
  import qwWaterMark from '@/directive/qwWaterMark';
export default {
  props:{
    originId:{
      type:String,
      default:''
    },
    originName:{
      type:String,
      default:''
    },
    belongAgent: {
      type: String,
      default: 'dynamic'
    }
  },
  directives: { qwWaterMark },
  data(){
    return {
      dataBase: dataBase,
      searchBar: homePage.searchBar,
      actionSheet: homePage.actionSheet,
      homeFooter: homePage.homeFooter,
      loadMore: homePage.loadMore,
      searchIndex: homePage.searchIndex,
      unReadPage: false, //true表示进入到未阅页
      dynamicNum: 0, //动态审核未阅数量
      commentNum: 0, //评论审核未阅数量
      unReadNum: 0, //未阅动态数量
      listParam: { //传到list页的数据
        dynamicType: 1, //记录当前选择的类型
        schType: this.$route.query.schType || '',
        keyWord: '',
        isPassReview: false
      },
      isShowPublish: false, // 是否显示发布入口
      isShowMoveNotice: false, // 是否显示员工祝福提示
      userType: '', // 0老用户，1新用户托管人资，2新用户未托管人资
      dynamicTypeId: '', // 存放指定新闻类型id
      isShowNoType: false, //显示无该类型提示
      hasrecord:{        // 指定类型不存在时存入无数据
        show: true,
        title: '',
        text: '该新闻类型已被删除，请联系管理员',
        icon: 'qwui-no_record_crmDetails'
      },
      agentCode: _.getUrlParam('agentCode') || 'dynamic'
    }
  },
  created:function () {
    var self = this;
    if (this.originId) {
      this.listParam.dynamicType = this.originId;
      this.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = this.originId;
    }
    if (this.originName) {
      document.title = this.originName;
      this.searchBar.moreFunction.defaultChoose = this.originName;
    }
    if(this.$route.query.schType == '8'){
        this.unReadPage = true;
        this.loadMore.data['schType'] = '8';
        this.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = '4';
        this.searchBar.moreFunction.show = false;
    }
    // 指定新闻公告类型id,默认显示该类型的新闻
    if(this.$route.query.id && this.$route.query.id !== '') {
      this.dynamicTypeId = this.$route.query.id;
      this.listParam.dynamicType = this.dynamicTypeId;
      this.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = this.dynamicTypeId;
    }
    this.initFunc();
  },
  computed:{
    contentList:function(){
      return this.loadMore.pageConfig.pageData
    }
  },
  deactivated:function(){   //组件被停用(离开路由)时调用
    this.actionSheet.show = false;
  },
  watch:{
    '$route' (to, from){
      // 从员工祝福页面返回主列表 ,发布页返回 ,未阅读详情返回未阅读列表, 审核列表返回 重新请求
      if((to.path == '/index' &&from.path == '/blessList') || from.path == '/publish' ||
        (to.path == '/index' && from.path=='/actionList') || to.name == from.name　||
        (to.path == '/index' && to.query.schType == '8' && from.path == '/partyDetail')) {
        this.loadMore.data['tbXyhDynamicinfoPO.title'] = '';
        this.listParam.keyWord = '';
        this.$refs.searchBar.clearInput();
        if(to.query.schType == '8'){
            this.unReadPage = true;
            this.loadMore.data['schType'] = '8';
            this.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = '4';
            this.listParam.schType = '8';
            this.searchBar.moreFunction.show = false;
        } else if(to.query.id != undefined) { // 指定某个类型
          this.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = to.query.id;
          this.loadMore.data['schType'] = '';
          this.listParam.dynamicType = to.query.id;
          this.searchBar.moreFunction.show = true;
          this.unReadPage = false;
        } else {
          this.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = 1;
          this.loadMore.data['schType'] = '';
          this.listParam.dynamicType = 1;
          this.searchBar.moreFunction.show = true;
          this.unReadPage = false;
          this.searchBar.moreFunction.defaultChoose = '';
          this.dynamicTypeId = ''; //清除存放的类型
        }
        this.initFunc();
        this.resetRequestListData();
      }
    }
  },
  methods:{
    initFunc(){
      var self = this;
      this.loadTitleIcon();
      //如果不是新闻公告，就要删除后面两个选项
      let agentCode = _.getUrlParam('agentCode');
      if (agentCode && agentCode.indexOf('dynamic') >= 0) {
        // 判断是否显示发布入口
        getPermission('', (result)=>{
          if(result.code == '0'){
            if(!result.data.hasPermission){
              self.isShowPublish = false;
            }else {
              // 未阅读列表 不显示
              let schType = self.$route.query.schType;
              if(schType =='6'||schType=='8'){
                self.isShowPublish = false;
              } else {
                self.isShowPublish = true;
              }
            }
          }
        })
      } else {
        this.searchBar.moreFunction.option = [];
      }
      if(this.$route.query.schType == '8'){
        document.title = '未阅列表';
      } else {
        this.loadTitle();
      }
      this.actionSheet.show = false;
      this.searchBar.rightSpan.callback = this.setActionSheet;
    },
    //标记为已阅
    markUnread:function () {
      markUnreadPower( (result) =>{
        if(result.isBatchRead == '0'){
          _.alert('提示','后台没有开启一键已阅功能,请联系管理员开启')
        } else {
          var buttonConfig = {
            primaryBtn:{name:"确定", callBack:this.doMarkUnread},
            defaultBtn:{name:"取消", callBack:null},
          };
          _.alert("标记为已阅","确定将所有未阅标记为已阅？",buttonConfig)
        }
      })
    },
    doMarkUnread:function () {
      markUnread( (result) =>{
        this.unReadNum = 0;
        // 重新获取列表
        this.resetRequestListData();
      })
    },
    //未阅界面
    toUnReadPage:function () {
      this.$router.push({
        path: '/index',
        query: { schType: '8'}
      })
    },
    //搜索，keyword关键字，val左部选项的查询条件（id）
    search: function (keyWord, val) {
      var self = this
      // 区别员工祝福和私人邮箱
      if(val === 0) {
        // this.searchBar.moreFunction.defaultChoose = '';
        if (self.userType == 0) {
          // 老用户直接跳原本的祝福列表
          window.location.href= _.baseURL + '/jsp/wap/dynamicinfoManage/dynamicinfo_blessing.jsp?agentCode=dynamic&abc=1&t=1&status=1';
        } else {
          // 新用户跳新ui
          this.toBless();
        }
      } else if (val === 1) {
        this.toPrivate();
      } else {
        this.isShowMoveNotice = false;
        this.loadMore.data['tbXyhDynamicinfoPO.title'] = keyWord || '';
        this.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = val || this.originId || '';
        this.listParam.dynamicType = val;
        this.listParam.keyWord = keyWord;
        this.resetRequestListData();
      }
    },
    //重新请求列表数据
    resetRequestListData:function(){
      this.$refs.loadMoreFun.clearLoadFun();//重新请求
    },
    //获取页面标题
    loadTitle:function () {
      getTitle( (result) =>{
        if(result.isTrust){
          document.title = result.agentName
        }
      })
    },
    //获取搜索框的切换选项
    loadTitleIcon:function () {
      var self = this;
      getDynamicType( (result) =>{
        var flag = false;
        self.searchBar.moreFunction.option = [];
        result.list.unshift({typeName:'全部', id:''}); // 给新闻类型列表加上一个全部选项
        result.list.forEach(function(e,index){
          self.searchBar.moreFunction.option.push({name:e.typeName, callback:null, placeholder:'搜索', value:e.id});
          // 如果没有设置参数，默认为第一项, 有则指定新闻类型
          if((index===0 && !self.originId && !self.originName && !self.dynamicTypeId)
            || (self.dynamicTypeId && self.dynamicTypeId === e.id)) {
            flag = true;
            self.searchIndex = index === 0 ? 1 : index - 1; // 监听数据变化，避免进入员工祝福列表后返回，searchBar还是员工祝福的参数
            self.listParam.dynamicType = e.id;
            self.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = e.id;
            self.searchBar.moreFunction.defaultChoose = e.typeName;
            setTimeout(()=>{
              self.searchIndex = index;
            },0)
          }
        })
        //若指定的新闻类型不存在则显示提示
        self.isShowNoType = !flag && self.dynamicTypeId;

        //如果不是新闻公告，就要删除后面两个选项
        self.userType = result.userType
        let agentCode = _.getUrlParam('agentCode');
        if (agentCode && agentCode.indexOf('dynamic') >= 0) {
          var isBlessShow = result.isBlessShow
          var isGroupsendShow = result.isGroupsendShow
          if (isBlessShow && isGroupsendShow) {
            self.searchBar.moreFunction.option.push(
              {
                name: '员工祝福',
                callback: null,
                placeholder: '搜索',
                value: 0
              }, {
                name: '私人信箱',
                callback: null,
                placeholder: '搜索',
                value: 1
              }
            )
          } else if (isBlessShow && !isGroupsendShow) {
            self.searchBar.moreFunction.option.push(
              {
                name: '员工祝福',
                callback: null,
                placeholder: '搜索',
                value: 0
              }
            )
          } else if (!isBlessShow && isGroupsendShow) {
            self.searchBar.moreFunction.option.push(
              {
                name: '私人信箱',
                callback: null,
                placeholder: '搜索',
                value: 1
              }
            )
          }
        }
      })
    },
    showMsgFromLoadMore:function (val) {
      if (this.belongAgent === 'dynamic') {
        if(this.isShowPublish){   // 有权限发布显示发布入口
          this.actionSheet.btnConfig = [
            {title: "我发布的", data:3, callBack: null},
            {title: "草稿", data:4, callBack: null},
            {title: "取消", callBack: null}
          ];
        } else {
          this.actionSheet.btnConfig = [
            {title: "取消", callBack: null}
          ];
        }
        this.searchBar.rightSpan.show = this.isShowPublish;
      } else if (this.belongAgent === 'partyconstruction') {
        this.actionSheet.btnConfig = [
          {title: "取消", callBack: null}
        ];
        this.searchBar.rightSpan.show = false;
      }

      this.unReadNum = val.totalRows;

      //权限判断 获取 动态审核数量 和 评论审核数量
      if(val.isCommentReviewer === 1){
        getCommentNum(result => {
          this.commentNum = result.waitReview;
        });
        this.actionSheet.btnConfig.unshift({
          title: "评论审核",
          data: 2,
          callBack: null
        });
        this.searchBar.rightSpan.show = true;
      }

      if(val.isDynamicReviewer === 1){
        getDynamicNum(result => {
          this.dynamicNum = result.waitReview;
        });
        this.actionSheet.btnConfig.unshift({
          title: "新闻审核",
          data: 1,
          callBack: null
        });
        this.searchBar.rightSpan.show = true;
      }
    },
    setActionSheet:function () { //设置actionsheet回调函数
      var self = this;
      self.actionSheet.btnConfig.forEach(function (e,index) {
        if(index < self.actionSheet.btnConfig.length-1){
          e.callBack = self.toDynamicAudit
        }
      })
      self.actionSheet.show = true;
    },
    //跳到actionList
    toDynamicAudit(data) {
      //设置在“待审核”tab
      dynamicAudit.nav.index = 0;
      commentAudit.nav.index = 0;
      dynamicAudit.buttonConfig.primaryList = [{type:"primary",name:'通过', value:0, callBack:null}],
      dynamicAudit.buttonConfig.defaultList = [{type:"default",name:'返回', callBack:null},{type:"default",name:'不通过', value:2, callBack:null}],
      commentAudit.buttonConfig.primaryList = [{type:"primary",name:'通过', value:0, callBack:null}],
      commentAudit.buttonConfig.defaultList = [{type:"default",name:'返回', callBack:null},{type:"default",name:'删除', value:2, callBack:null}],
      this.$router.push({
          path:'/actionList',
          query: {data:data}
        });
    },
    // 跳转至发布页面
    toPublish(){
      this.$router.push({
        path: '/publish'
      })
    },
    // 调到员工祝福
    toBless() {
      // this.$router.push({
      //   path: '/blessList'
      // })
      this.isShowMoveNotice = true;
    },
    toPrivate() {
      window.location.href= _.baseURL + '/jsp/wap/dynamicinfoManage/private_list.jsp?agentCode=dynamic&abc=1';
    }
  },
  components:{searchBar, indexList, loadMore, actionSheet, moveNotice, noRecord},
}
</script>
<style src="../scss/index.scss" lang="scss" scoped>
</style>
