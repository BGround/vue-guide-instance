<template>
  <div class="managerBox">
    <p class="tip" v-show="tipShow">{{tip}}</p>
    <div class="main" v-show="contentShow">
      <div class="account">
        <span class="label">绑定的企微云管理账号</span>
        <div class="user" @click="showManagerList">
          {{bindUser.personName || '未绑定'}}
          <span class="icon-arrow" v-show="managerUsers.length>1"></span>
        </div>
      </div>
      <div class="note">
        <span class="dot"></span>
        <p class="note-tip">登陆企微云管理后台，可使用子表单、表单关联、分支流程等高级功能</p>
      </div>
      <div class="url-content">
        <p class="url-title">企微云管理后台，请访问：</p>
        <span class="url" id="url" title="https://qy.do1.com.cn/qwy/manager/login.jsp">https://qy.do1.com.cn/qwy/manager/login.jsp</span><span>?…</span>
        <a class="url-copy" data-clipboard-target="#url">复制</a>
      </div>
    </div>

    <div class="managerList" v-show="managerListShow">
      <label v-for="item in managerUsers">
        <input
          type="radio"
          name="manageList"
          class="icon_check_sm"
          @click="selectManager(item,$event)"
          :checked="bindUser.userName===item.userName"
        >{{item.personName}}
      </label>
      <button_group :fixed="true">
        <qwui_button text="取消" @buttonClick="cancel"></qwui_button>
      </button_group>
    </div>
  </div>

</template>

<script>
  import ClipboardJS from 'clipboard'
  import { qwui_button, button_group } from '@/components/base/button'
  import axios from 'axios'
  import baseURL from '@/assets/js/baseURL_config.js'
  const findForceManagerList = (data) =>{
    return axios.post(baseURL+'/portal/wxPortalToMgr/findForceManagerList.do',{
      ...data
    })
  }
  const updateForceManagerUser = (data) =>{
    return axios.post(baseURL+'/portal/wxPortalToMgr/updateForceManagerUser.do',{
      ...data
    })
  }
  // 保持心跳
  const continueSession = () =>{
    let continueSessionCounts =  0
    let myContinueSession = setInterval(function(){
      if(continueSessionCounts>60){
        clearInterval(myContinueSession);
      }else{
        axios({
          method: 'post',
          url: baseURL+'/cooperation/cooperationAction!continueSession.action',
        })
          .then(function (response) {
            if (response.code == 0) {
              continueSessionCounts = continueSessionCounts + 1
            }
          })
      }
    },300000)
  }

  var clipboard = new ClipboardJS('.url-copy');
  clipboard.on('success', function(e) {
    _.tooltips_succeed('复制成功',true,'');
    e.clearSelection();
  });

  export default {
    name: "QwFindManager",
    components: {
      qwui_button,
      button_group
    },
    props: {
      agentCode: {
        type: String,
        default: '',
        require: true
      },
      tip: {
        type: String,
        default: '无法发布表单，请先登录企微云后台绑定管理',
      },
      // 内容显示
      contentShow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        baseURL,
        managerUsers: [],
        bindUser: {},
        tipShow: false,   // 提示
        managerListShow: false
      }
    },
    methods: {
      cancel() {
        this.managerListShow = false
      },
      showManagerList() {
        if(this.managerUsers.length<2) {
          return
        }
        this.managerListShow = true
      },
      selectManager(item) {
        updateForceManagerUser({userName: item.userName,agentCode:this.agentCode}).then((result)=>{
          if(result.code==0){
            this.managerListShow = false
            this.bindUser = Object.assign({},item)
            this.$emit('updateForceManagerUser',this.bindUser,true)
          }else {
            _.alert('提示',result.desc)
          }
        })
      }
    },
    created() {
      findForceManagerList({
        requestSource:2,
        agentCode: this.agentCode
      }).then(result=>{
        if(result.code==0){
          let bindUser = result.data.managerUsers.find(value => {
            return value.isBind
          })
          this.managerUsers = [...result.data.managerUsers]

          // 如果有管理员，但未绑定，默认选中第一个
          if(this.managerUsers.length) {
            if(!bindUser) {
              bindUser = this.managerUsers[0]
            }
            this.bindUser = Object.assign({},bindUser)
            this.selectManager(bindUser)
            continueSession()
          }else {
            this.tipShow=true
          }

          this.$emit('managerUsersUpdate',this.managerUsers)
        }else {
          _.alert('提示',result.desc)
        }
      })
    },
  }
</script>

<style lang="scss" scoped>
  .managerBox {
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
    .note {
      position: relative;
      font-size: 14px;
      color: #7A7D80;
      margin: 30px 15px 18px 10px;
      text-align: justify;
    }
    .note-tip {
      margin-left: 15px;
    }
    .dot {
      position: absolute;
      width: 3px;
      height: 3px;
      left: 4px;
      top: 10px;
      background-color: #FFC364;
    }
    .account {
      display: flex;
      padding-left: 15px;
      padding-right: 15px;
      font-size: 15px;
      color:#0A1736;
    }
    .user {
      flex: 1;
      text-align: right;
      cursor: pointer;
    }
    .url-title {
      font-size: 13px;
      color: #7A7D80;
      margin-bottom: 4px;
    }
    .url-content {
      margin-left: 26px;
      font-size: 12px;
      color: #B2B9C8;
    }
    .url-copy {
      color: #5585F0;
      cursor: pointer;
    }
    .icon-arrow {
      display: inline-block;
      width: 24px;
      height: 24px;
      background-size: contain;
      background: url("~assets/svg/icon_a-public_arrow-right.svg") no-repeat center center;
      vertical-align: middle;
    }
    .managerList {
      position: absolute;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: #fff;
      padding-top: 16px;
      box-sizing: border-box;
      label {
        display: block;
        font-size: 15px;
        line-height: 50px;
        height: 50px;
        padding-left: 15px;
        color: #0A1735;
        cursor: pointer;
        &:hover {
          background-color: #F7F8FA;
        }
      }
    }
  }
</style>
