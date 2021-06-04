<template>
  <div class="wrap">

    <transition name="slide-left">
      <wait-index ref="waitIndex" v-show="homeFooterList.nav_on == 0"></wait-index>
    </transition>

    <transition name="slide-right">
      <my-index v-show="homeFooterList.nav_on == 2"></my-index>
    </transition>
    <transition name="bounce-pop">
      <add-module v-on:closeAdd="closeAdd" v-show="addModuleShow"></add-module>
    </transition>
    <footer-nav :footernavdata="homeFooterList" :waitingTaskNum="waitingTaskNum" v-on:listenFooter="showMsgFromFooterNav"></footer-nav>
  </div>
</template>

<script>
  import loadMore from '@/components/list/load_more';
  import footer_nav from './components/footer_nav';
  import wait_index from './components/waitIndex';
  import my_index from './components/myIndex';
  import add_module from './components/add_mask.vue';

  export default {
    name: 'cloud_index',
    data() {
      return {
        dialogBottomConfig: dataBase.home.dialogBottomConfig, //列表操作弹窗
        homeFooterList: dataBase.home.homeFooterList, // 底部菜单
        waitingTaskNum: 0,
        addModuleShow: false,
      }
    },
    created() {
      this.isMeetingNew()
      this.getDocumentTitle()
    },
    methods: {
      // 点击下方两侧按钮
      showMsgFromFooterNav(val, isFromInex) {
        var self = this
        if (val === 'addNewTask') {
          this.closeAdd(1)
        }
      },
      //判断用户是否需要跳转至会议助手或者考勤页面
      isMeetingNew() {
        dataBase.isShowApp = false;
        var self = this
        _.ajax({
          url: _.baseURL + "/portal/qyservicePortalCtl/getSingleModeAgentCode.do",
          type: 'post',
          data: {
            parentAgentCode: 'meetingassistant'
          },
          success: function (result) {
            if (result.code == 0) {
              switch(result.data.singleModeAgentCode) {
                case '': // 没有单开的情况
                  self.$refs.waitIndex.requestData()
                  break;
                case 'meetingassistant': // 单开会议
                  window.location.replace(_.baseURL + "/jsp/wap/meeting/meeting_index.jsp?agentCode=meetingassistant&type=2&status=1");
                  break;
                case 'checkwork': // 单开考勤
                  window.location.replace(_.baseURL + "/jsp/wap/checkwork/add.jsp?agentCode=checkwork&abc=1");
                  break;
              }
            } else {
              _alert("提示", result.desc, "确定");
            }
          },
          error: function () {
            _alert("错误提示", "系统繁忙！");
          }
        });
      },
      // 获取title
      getDocumentTitle() {
        //  var agentCodes = 'dynamic,activity,form,productinfo,crm,contract,topic,ask,diary,outsidework,task,survey,meetingassistant,' +
        //     'moveapprove,addressBook,chat,checkwork,express,reimbursement,hrmanagement,examination,qydisk,sale,learnonline,car';
        var agentCodes = 'meetingassistant'
        _.ajax({
            url: _.baseURL + "/portal/application/application!ajaxIsTrustAgentListForPortal.action?agentCodes=" + agentCodes,
            type: 'POST',
            success: function(result) {
              document.title = result.data.list[0].agentName
            }
        });
      },
      closeAdd(isShow) {
        if (isShow) {
          this.closeSlide(1)
          this.addModuleShow = true
        } else {
          this.closeSlide(0)
          this.addModuleShow = false
        }
      },
      // 弹窗出来，isPin=1背景不滚动,isPin=0背景正常滚动
      closeSlide(isPin){
        if(isPin){
          document.body.style.height = '100vh'
          document.body.style['overflow-y'] = 'hidden'
        }
        else{
          document.body.style.height = 'unset'
          document.body.style['overflow-y'] = 'auto'
        }
      },
    },
    components: {
      'footer-nav': footer_nav,
      'wait-index': wait_index,
      'my-index': my_index,
      'add-module': add_module
    }
  }

</script>

<style lang="scss" scoped>
  .wrap {
    background: #fff;
    /*width: 100%;*/
    /*height: 100%;*/
    /*position: absolute;*/
  }
  @media screen and (min-width: 1024px) {
    .wrap {
        width: 740px !important;
    }
}
  .bounce-pop-enter,
  .bounce-pop-leave-to {
    transform: translateY(100%);
  }

  .bounce-pop-enter-active,
  .bounce-pop-leave-active {
    transition: all .3s;
  }
</style>
