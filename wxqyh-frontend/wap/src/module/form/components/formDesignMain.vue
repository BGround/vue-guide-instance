<template>
  <div class="wrap">
    <div v-if="!showNotVip">
      <div class="formDesignMain" v-if="show==='designMainShow'">
        <p class="tip" v-show="!formAddPermission">没有创建表单权限，请先联系管理员</p>
        <div
          class="typeBox"
          :class="{pt40: !formAddPermission || !managerUsers.length}"
        >
          <div
            class="item"
            v-for="(item,index) in TYPE"
            :key="item.type"
            @click="changeType(item.type)"
          >
            <p
              class="icon"
              :class="item.icon"
            >
            </p>
            <p class="title">{{item.title}}</p>
            <p class="text">{{item.text}}</p>
          </div>
        </div>
        <qw-find-manager
          agentCode="form"
          @managerUsersUpdate="updateManagerUsers"
          @updateForceManagerUser="wxqyhConfigNew"
        >
        </qw-find-manager>
      </div>
      <router-view></router-view>
    </div>
    <noRecord
      v-if="showNotVip"
      :hasRecord="vipConfig"
    >
    </noRecord>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions} from 'vuex'
  import QwFindManager from '@/components/findForceManagerList'
  import {wxqyhConfigNew} from '@/module/form/api/list'
  import {isVipGold} from '@/assets/js/vip-portal.js'
  import noRecord from '@/components/base/noRecord'
  const TYPE = [
    {
      type: 0,
      title: '普通单',
      icon: 'ic_a-form_ordinary',
    },
    {
      type: 2,
      title: '审批单',
      text: '自由流程',
      icon: 'ic_a-form_approval'
    },
  ]

  export default {
    name: "formDesignMain",
    components: {
      QwFindManager,
      noRecord,
    },
    data() {
      return {
        TYPE,
        show: '',
        // 非尊享版提示语
        vipConfig: {
          icon: 'qwui-icon_no_goldVip',
          title: '该功能仅限尊享版使用',
          text: '升级为尊享版，尊享平台各项高级特权',
        },
        showNotVip: false,   // 非尊享版提示
      }
    },
    computed: {
      ...mapState({
        FormAjaxData: state=>state.formDesign.FormAjaxData,
        formAddPermission: state=>state.formDesign.formAddPermission,
        managerUsers: state=>state.formDesign.managerUsers,
      }),
    },
    watch: {
      '$route': {
        handler(router) {
          switch(router.name) {
            case 'formDesign': this.show = 'designMainShow'; break;
            default: this.show= ''
          }
        },
        immediate: true
      }
    },
    methods: {
      ...mapMutations([
        "changeFormAjaxData",
        "updateManagerUsers",
        "updateformAddPermission",
      ]),
      ...mapActions([
        "isUseCache",
      ]),
      // 切换类型
      changeType(type) {
        this.changeFormAjaxData({key:'tbFormControlPO.isTask',value:type,setStorage:false})
        this.$router.push('/formdesign/add')
      },
      // 创建表单权限
      wxqyhConfigNew() {
        wxqyhConfigNew('formAdd').then((result)=>{
          if(result.code==0) {
            this.updateformAddPermission(result.data.permissions.formAdd)
          }else {
            _.alert('提示',result.desc)
          }
        }).catch(function () {
          _.alert('提示','抱歉，您没有权限创建表单，请联系管理员')
        })
      },
      // 判断尊享版
      isVipGoldHandle() {
        wxqyhConfig.ready(()=>{
          if(isVipGold(interfaceCode.INTERFACE_CODE_FORM)) {
            // 是否加载上一次内容
            this.isUseCache()
          }else {
            this.showNotVip = true
            document.querySelector('body').setAttribute('style','background:#fff')
          }
        })
      }
    },
    created() {
      this.isVipGoldHandle()
    }
  }
</script>

<style lang="scss" scoped>
  .tip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #FF666E;
    background-color: #FFE8E8;
  }
  .formDesignMain {
    position: fixed;
    top: 0;
    bottom: 0;
    background-color: #fff;
    width: 100%;
  }
  .formDesignMain {
    .typeBox {
      padding: 20px 5px 56px;
      box-sizing: border-box;
      display: flex;
      &.pt40 {
        padding-top: 56px;
      }
      .item {
        flex: 1;
        height: 14em;
        margin: 0 20px 0;
        text-align: center;
        box-shadow:0 7px 13px 0 rgba(179,181,186,0.2);
        border-radius: 4px;
        cursor: pointer;
      }
      .icon {
        display: inline-block;
        width: 72px;
        height: 72px;
        margin-top: 22px;
        margin-bottom: 10px;
      }
      .title {
        font-size: 16px;
      }
      .text {
        font-size: 13px;
        color:#B2B9C8;
      }
    }
  }
  @each $icon in ic_a-form_approval, ic_a-form_ordinary {
    .#{$icon} {
      background-size: contain;
      background: url('~assets/svg/#{$icon}.svg') no-repeat center center;
    }
  }
  @media screen and (min-width: 1024px) {
    .formDesignMain {
      width: 740px;
      margin: 0 auto;
    }
  }
</style>
