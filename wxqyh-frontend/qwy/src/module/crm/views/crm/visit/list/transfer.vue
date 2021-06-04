<template>
  <div class="transferBox"
       v-if="isShowTransferDialog">
    <!-- 转移客户对话框 -->
    <qw-Modal :show.sync="isShowTransferDialog"
              :showCancelButton="true"
              :title="modalTitle"
              :zIndex="modalZindex"
              @on-confirm="transferVisit"
              @on-cancel="closeDialog">
      <div class="modalContent">
        <div class="flex">
          <span class="lineH mr20">新负责人：</span>
          <ul class="trans_pickPerson"
              @click="addPerson">
            <span v-show="defaultUsers.length == 0"><i>+</i>点击选择</span>
            <li v-for="(item,index) in defaultUsers"
                :key="index">
              <div class="trans-user_selected">
                <img v-if="item.headPic && item.headPic!='0'"
                     class="trans-dept_selected_icon"
                     :src="item.headPic">
                <div v-else
                     class="qwui-user_default_img"></div>
                {{item.personName}}
              </div>
            </li>
          </ul>
        </div>
        <div class="transfer_personCount">
          <span>已选{{defaultUsers.length}}成员</span>
          <span @click="addPerson">修改</span>
        </div>
      </div>
    </qw-Modal>

    <pick-person :show="pickPersonShow"
                 :defaultUsers="defaultUsers"
                 :functionTab="functionTab"
                 @chooseDone="newPersonChooseDone"
                 onlyUser
                 :maxUser=1
                 @closeThis="closeTransfer">
    </pick-person>
  </div>
</template>

<script>
import qwModal from "crm/components/qwModal";
import pickPerson from '@/components/pickPerson/pickPerson'
import { transfeVisit } from "@/module/crm/api/visit";

export default {
  props: {
    // 拜访ID 唯一
    outworkIds: {
      type: String,
      default: ""
    },
    modalTitle: {
      type: String,
      defalut: ''
    },
    modalZindex: {
      type: Number,
      defalut: -1
    }
  },
  components: {
    qwModal,
    pickPerson,
  },
  data () {
    return {
      dataBase,
      defaultUsers: [],//选人结果
      // 选人组件 标签
      functionTab: [
        { text: "标签人员" },
        { text: '特定人员' },
      ],
      // 转移 表单
      transferForm: {
        outworkIds: "",
        inCharges: ""
      },
      isShowTransferDialog: false,// 是否打开 转移 弹出框
      pickPersonShow: false,//选人组件是否开启
    }
  },
  methods: {
    //打开弹窗
    openDialog () {
      this.isShowTransferDialog = true;
    },

    //关闭弹窗
    closeDialog () {
      this.isShowTransferDialog = false;
    },

    //切换弹窗
    toggleDialog () {
      this.isShowTransferDialog = !this.isShowTransferDialog;
    },

    // 添加人员
    addPerson (status) {
      this.pickPersonShow = true;
    },

    // 选人回调
    newPersonChooseDone (deptSelected, tagList, specialUsers) {
      if (specialUsers.length > 10) {
        dataBase.top_alert('人员选择超出上限(10)', false, 3000);
        return
      } else {
        this.defaultUsers = specialUsers;
        this.chooseDone_transfer(deptSelected, tagList, specialUsers)
        this.pickPersonShow = false;
      }
    },

    // 选人关闭按钮回调
    closeTransfer () {
      this.pickPersonShow = false;
    },
    chooseDone_transfer (dept, tag, user) {
      let result = []
      user.map(item => {
        result.push(item.userId)
      })
      this.transferForm.inCharges = result.join(",");
    },

    //确定转移
    transferVisit () {
      let { alert: _alert, top_alert } = this.dataBase;
      this.transferForm.outworkIds = this.outworkIds;
      if (this.transferForm.inCharges.length === 0) {
        _alert('提示', '负责人不得为空');
        return false;
      }
      transfeVisit(this.transferForm)
        .then(res => {
          if (res.code == '0') {
            top_alert('转移成功', true, 2000);
            this.closeDialog();
            this.$emit('refresh');
          }
          else {
            _alert('提示', res.desc);
          }
        })
        .catch(err => {
          console.log(err)
          _alert('提示', '网络错误');
        });
    },
  },
  watch: {
    isShowTransferDialog (curVal, oldVal) {
      // 关闭时
      if (!curVal) {
        this.defaultUsers = []
        this.transferForm.inCharges = "";
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .transferBox{
        position: fixed;
        z-index: 100;
    }
    .qw-modal{
    .modal-body{
      .modalContent {
        min-width: 300px;
        margin: 20px 0 34px 0;
        padding: 0 76px;
      }
    }
  }
  .trans_pickPerson{
    width:340px;
    height:48px;
    border:1px dashed #D5D5D5;
    padding:4px 8px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    span{
      display: inline-block;
      width:100%;
      height:100%;
      font-size: 14px;
      color:#BABABA;
      line-height: 38px;
      text-align: center;
      cursor: pointer;
    }
    li{
      .trans-user_selected{
        border: 1px solid #ddd;
        list-style:none;
        width:auto;
        height:24px;
        padding-right:10px;
        line-height: 24px;
        vertical-align: top;
        border-radius:3px;
        display: flex;
        vertical-align: top;
        .trans-dept_selected_icon{
          display: inline-block;
          width: 26px;
          height: 24px;
          margin-right: 5px;
          list-style: none;
          vertical-align: top;
        }
      }
    }
  }
  .lineH {
    line-height: 40px;
  }
  .transfer_personCount{
    width:100%;
    text-align: left;
    margin-top:5px;
    padding-left:88px;
    box-sizing: border-box;
    font-size: 12px;
    span:first-of-type{
      color:#B6B6B6;
    }
    span:last-of-type{
      color:#74ACFF;
      cursor: pointer;
    }
    
  }
</style>
