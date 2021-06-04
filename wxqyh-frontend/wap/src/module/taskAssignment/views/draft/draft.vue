<template>
  <div class="qwui-wrap">
    <task-list :loadmore="loadmore" v-on:listenDoMore="showDialog"></task-list>
    <load-more class="qwui-no_content" ref="loadMoreFun"
      @loadMoreClick="loadMoreClick" :loading="loading" :hasMore="hasMore" :type="'commentList'" v-windowscroll="scrollLoadMore">
        <div>
            <div v-if="isHideLoadFoot">
                <div class="qwui-load_more_foot">共 {{loadmore.padeConfig.totalRows}} 草稿</div>
            </div>
            <div v-else class="qwui-noContent_wrapper">
                <i class="qwui-no_record_icon"></i>
                <span class="qwui-font_text">暂无草稿</span>
            </div>
        </div>
    </load-more>
    <!--下部列表操作弹窗-->
    <dialog_mask_bottom :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>
  </div>
</template>

<script>
  import task_list from '../components/task_list';
  import loadMore from '@/components/list/load_more';
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue'
  export default {
    name: 'draft',
    data() {
      return {
        loadMore: dataBase.home.loadMore, // 加载列表组件数据
        loadmore: {}, // 加载列表组件数据
        isHideLoadFoot: false,
        dialogBottomConfig: dataBase.home.dialogBottomConfig, //列表操作弹窗
        operateId: '',
        loading: false, // 是否正在加载中
        hasMore: true,
        lock_roll: false,
      }
    },
    created() {
      // 深拷贝数据
      this.loadmore = JSON.parse(JSON.stringify(this.loadMore))
      this.loadmore.data.schType = 'myDraf';
      this.loadmore.hasRecord.operation.text = '暂无草稿'
      this.loadmore.data['searchValue.status'] = '0';
      delete this.loadmore.data.sortBy
      delete this.loadmore.data['searchValue.keyWord']
      delete this.loadmore.data.taskCloseType
      delete this.loadmore.data.score
      delete this.loadmore.data.taskStop
      // 第一次加载数据
      this.clearLoadFun();
    },
    mounted() {
      var self = this
      window.onhashchange = function () {
        self.$router.push({
          name: 'home',
          params: {
            needRefresh: true
          }
        })
      }
    },
    methods: {
      showDialog(item, itemIndex) {
        this.operateId = item.taskId;
        var options = [{
          title: " 删除",
          callBack: this.delTask,
          primary: true
        }, {
          title: " 取消",
          callBack: this.closeBottomMsg
        }];
        this.dialogBottomConfig.btnConfig = options;
        this.showBottomMsg();
      },
      showMsgFromLoadMore(data) {
        if (data.currPage == data.maxPage) {
          this.isHideLoadFoot = true;
        }
      },
      // 关闭底部弹窗列表
      closeBottomMsg() {
        this.toggleBody(0)
        this.dialogBottomConfig.show = false;
      },
      // 显示底部弹窗列表
      showBottomMsg() {
        this.toggleBody(1)
        this.dialogBottomConfig.show = true;
      },
      // 删除任务
      delTask() {
        var self = this;
        var id = this.operateId;
        _.ajax({
          url: _.baseURL + '/portal/taskinfoAction!ajaxBatchCheck.action',
          type: "POST",
          data: {
            ids: id
          },
          success: function (result) {
            if (result.code == "0") {
              if (result.data.haveComment) {
                _.alert('提示', '标题为【' + result.data.comments[0] + '】已被评论，不可以删除');
              } else {
                _.ajax({
                  url: _.baseURL + '/portal/taskinfoAction!ajaxBatchDelete.action',
                  type: "POST",
                  data: {
                    ids: id
                  },
                  success: function (result) {
                    if (result.code == "0") {
                      _.tooltips_succeed('删除成功', true);
                      self.refreshListData(); // 刷新数据
                    } else {
                      _.alert('提示', result.desc);
                    }
                    self.refreshListData() // 删除成功，重新请求数据
                  }
                })
              }
            }
          }
        });
        this.closeBottomMsg();
      },
      // 弹窗出来，isPin=1背景不滚动,isPin=0背景正常滚动
      toggleBody(isPin) {
        if (isPin) {
          document.body.style.height = '100vh'
          document.body.style['overflow-y'] = 'hidden'
        } else {
          document.body.style.height = 'unset'
          document.body.style['overflow-y'] = 'auto'
        }
      },
      // 刷新数据
      refreshListData() {
        this.isHideLoadFoot = false;
        this.clearLoadFun();
      },
      //清空数据，第一次或重新请求数据
      clearLoadFun(){
        //初始化第一页
        if(this.loadmore.pageIndexName){
          this.loadmore.data[this.loadmore.pageIndexName]=1;
        }else{
          this.loadmore.data.page=1;
        }
        //初始化返回数据
        this.loadmore.padeConfig={
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
        if (this.loadmore.padeConfig.currPage < this.loadmore.padeConfig.maxPage) {
          this.tips = this.$t('i18n.loading');
          this.loadmore.data[this.loadmore.pageIndexName] += 1;
          this.requestData(); //加载请求
        }
      },
      // 请求接口数据
      requestData() {
        if (JSON.stringify(this.loadmore) == '{}') {
          _.alert('i18n.notice', 'i18n.loadRequestFail');
          return;
        } else if (this.loadmore.padeConfig.totalRows == "" || this.loadmore.padeConfig.pageData.length == 0) {
          this.tips = "";
        }
        this.loadmore.hasRecord.show = false; //隐藏图标
        this.loading = true;
        var self = this;
        _.ajax({
          url: _.baseURL + self.loadmore.url,
          type: 'POST',
          data: self.loadmore.data,
          success: function (result) {
            self.lock_roll = false;
            self.loading = false;
            if (result.code == "0") {
              var temp = {};
              if (result.data.pageDate) {
                temp = result.data.pageDate;
                self.loadmore.padeConfig.maxPage = temp.totalPages ? temp.totalPages : '';
                self.loadmore.padeConfig.currPage = temp.currentPage ? temp.currentPage : '';
              } else {
                temp = result.data;
                self.loadmore.padeConfig.maxPage = temp.maxPage ? temp.maxPage : '';
                self.loadmore.padeConfig.currPage = temp.currPage ? temp.currPage : '';
              }
              self.loadmore.padeConfig.totalRows = temp.totalRows ? temp.totalRows : '';
              if (temp.pageData) {
                if ((self.loadmore.padeConfig.pageData && self.loadmore.padeConfig.pageData.length == 0) || !self
                  .loadmore.padeConfig.pageData || self.loadmore.padeConfig.currPage == 1) {
                  self.loadmore.padeConfig.pageData = temp.pageData;
                } else {
                  self.loadmore.padeConfig.pageData = self.loadmore.padeConfig.pageData.concat(temp.pageData);
                }
              } else {
                self.loadmore.padeConfig.pageData = [];
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
        this.loadmore.hasRecord.show=false;//隐藏图标
        if(this.loadmore.padeConfig.totalRows>0 && this.loadmore.padeConfig.currPage<this.loadmore.padeConfig.maxPage){
          this.hasMore=true;
          return this.tips=this.$t('i18n.loadMore');
        }else if(this.loadmore.padeConfig.totalRows==0 ||(this.loadmore.padeConfig.pageData && this.loadmore.padeConfig.pageData.length==0)){
          if(!this.loadmore.hasRecord.icon){
            return this.tips=this.$t('i18n.noRecord');
          }else{
            this.loadmore.hasRecord.show=true;//显示无记录图标
            return this.tips="";
          }
        }else if(this.loadmore.padeConfig.totalRows>0 && (this.loadmore.padeConfig.currPage==this.loadmore.padeConfig.maxPage)&& this.loadmore.padeConfig.currPage!="" && this.loadmore.padeConfig.maxPage!=""){
          return this.tips=this.$t('i18n.total')+this.loadmore.padeConfig.totalRows+this.$t((this.describeWord?this.describeWord:this.defaultDescribe));
        }else{
          return this.tips="";
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      from.params.isRresh = true;
      next();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.params.isRresh) {
          vm.refreshListData()
        }
      })
    },
    components: {
      "task-list": task_list,
      loadMore,
      dialog_mask_bottom,
    }
  }

</script>

<style lang="scss" scoped>
  .qwui-load_more_foot {
    text-align: center;
    color: #999;
    line-height: 44px;
    font-size: 12px;
    .qwui-segment_line {
      margin: 0 10px;
      &::before {
        content: ' ';
        display: inline-block;
        width: 1px;
        height: 10px;
        background: #e5e5e5;
      }
    }
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
    background: url(../../../../assets/svg/img_commom_emptypage.svg) center no-repeat;
    background-size: 160px 160px;
    }
    .qwui-font_text {
        color:#B2B9C8;
        font-size: 14px;
    }
  }
</style>
