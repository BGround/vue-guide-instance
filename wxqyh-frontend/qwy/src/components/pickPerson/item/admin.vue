<template>
  <div class="clearfix"
    style="{'position':relative}">
    <div class="qwui-loading_content"
      v-if="!loadFinished">
      <div class="_loading_logo"></div><i></i>
    </div>
    <div class="qwui-admin_title">
      <div v-if="!batchShow">
        <span>子账户名称</span>
        <span class="batch"
          @click="batchShow = true">批量导入</span>
        <span class="user">绑定的成员</span>
      </div>
      <div v-else
        @click="batchShow = false">
        <span class="back"></span>
        <span class="word">按账户名称选择</span>
      </div>
    </div>

    <!--  批量导入管理员  -->
    <batch-admin v-show="batchShow"
      :defaultAdmin="defaultAdmin"
      :defaultUser="defaultUser"
      :maxUser="maxUser"
      @batchSuccess="batchSuccess"></batch-admin>

    <!--  选择管理员  -->
    <div class="qwui-super_admin"
      v-show="!batchShow">
      <span class="super_name">
        {{superAdmin.personName}}
      </span>
      <span class="super_icon">超管</span>
      <span class="person_name"
        v-if="superAdmin.tbQyUserInfoVO">
        <img class="qwui-list_item_headpic"
          v-if="superAdmin.tbQyUserInfoVO.headPic && superAdmin.tbQyUserInfoVO.headPic != '0'"
          :src="superAdmin.tbQyUserInfoVO.headPic">
        <div v-else
          class="qwui-list_item_headpic default_img"></div>
        {{superAdmin.tbQyUserInfoVO.personName}}
      </span>
      <span v-else
        class="person_name">-</span>
      <label :for="superAdmin.userName"
        class="qwui-tag_checkbox"
        @click.stop>
        <input type="checkbox"
          :value="superAdmin"
          v-model="checkList"
          :id="superAdmin.userName"
          :disabled="isDisabled()">
        <span></span>
      </label>
    </div>
    <div class="qwui-admin_list"
      v-show="!batchShow">
      <ul class="qwui-dept_list">
        <admin-list :itemData="item"
          :totalData="allAdmin"
          :isOverAdmin="isOverAdmin"
          :defaultAdmin="defaultAdmin"
          :deleteSpecialAdmin="deleteSpecialAdmin"
          @adminChecked="adminChecked"
          v-for="(item,index) in admins"
          :key="index"></admin-list>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAdminList } from '../api/getData'
import adminList from '../checkList/adminList.vue'
import batchAdmin from '../checkList/batchAdmin.vue'
export default {
  props: {
    deleteSpecialAdmin: {
      type: Object,
      default: function() {
        return {}
      }
    },
    defaultAdmin: {
      type: Array,
      default: function() {
        return []
      }
    },
    defaultUser: {
      type: Array,
      default: function() {
        return []
      }
    },
    //选择的管理员是否超过限制
    isOverAdmin: {
      type: Boolean,
      default: false
    },
    //人数最大限制，管理员+成员
    maxUser: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      batchShow: false, //批量导入界面 显示隐藏 控制
      superAdmin: {}, //超管
      admins: [], //一级管理员
      allAdmin: [], //全部管理员
      checkList: [], //选中超管，存入该数组
      loadFinished: false //控制加载
    }
  },
  created() {
    this.loadData()
  },
  watch: {
    checkList: function(val) {
      this.$emit('adminChecked', this.superAdmin, val.length)
    },
    deleteSpecialAdmin: function(val) {
      if (val && val.userName == this.superAdmin.userName) {
        this.checkList = []
      }
    }
  },
  methods: {
    // *初始化管理员数据
    loadData() {
      let self = this
      getAdminList()
        .then(res => {
          if (res.code == '0') {
            self.loadFinished = true
            self.superAdmin = res.data.superDqdpUserVO
            self.allAdmin = res.data.pageData
            res.data.pageData.forEach(e => {
              if (
                e.parentId === '' ||
                e.parentId === self.superAdmin.userName
              ) {
                self.admins.push(e)
              }
              if (
                self.defaultAdmin.filter(function(item) {
                  return item.userName == self.superAdmin.userName
                }).length > 0 &&
                self.checkList.length == 0
              ) {
                self.checkList.splice(0, 0, self.superAdmin)
              }
            })
          }
        })
        .catch(err => {
          console.log('错误', err)
        })
    },
    //点击管理员复选框之后，返回 选择的管理员属性+是否选中
    adminChecked: function(val, isChecked) {
      this.$emit('adminChecked', val, isChecked)
    },
    //批量导入成功列表，获取导入账号的userName，并传给pickperson
    batchSuccess(list) {
      let self = this,
        findResult = {}
      list.forEach(e => {
        if (e == self.superAdmin.userName) {
          self.$emit('adminChecked', self.superAdmin, 1)
          self.checkList.length == 0
            ? self.checkList.splice(0, 0, self.superAdmin)
            : ''
          return
        }
        findResult = self.allAdmin.find(item => {
          return item.userName == e
        })
        if (findResult) {
          self.$emit('adminChecked', findResult, 1)
        }
      })
    },
    //控制超管是否可以选中
    isDisabled: function() {
      return this.isOverAdmin && this.checkList.length == 0
    }
  },
  components: {
    adminList,
    batchAdmin
  }
}
</script>

<style scoped>
.qwui-loading_content {
  position: absolute;
  right: 0;
  width: 600px;
  height: 407px;
}
@-webkit-keyframes loading {
  0% {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg); /* IE 9 */
    -moz-transform: rotate(0deg); /* Firefox */
    -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
    -o-transform: rotate(0deg); /* Opera */
  }
  100% {
    transform: rotate(360deg);
    -ms-transform: rotate(360deg); /* IE 9 */
    -moz-transform: rotate(360deg); /* Firefox */
    -webkit-transform: rotate(360deg); /* Safari 和 Chrome */
    -o-transform: rotate(360deg); /* Opera */
  }
}
._loading_logo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 75px;
  height: 75px;
  background: url('~assets/images/loading.png') no-repeat;
  animation: loading 1.5s infinite linear;
  -ms-animation: loading 1.5s infinite linear;
  -moz-animation: loading 1.5s infinite linear;
  -webkit-animation: loading 1.5s infinite linear;
}
.qwui-admin_title {
  margin-left: 20px;
  padding: 15px 0 10px;
  color: #808080;
}
.qwui-admin_title .batch {
  padding-left: 14px;
  color: #f87b00;
  cursor: pointer;
}
.qwui-admin_title .user {
  padding-right: 150px;
  float: right;
}
.qwui-admin_title .back {
  display: inline-block;
  position: relative;
  top: -1px;
  width: 7px;
  height: 7px;
  border: 1px solid #f87b00;
  border-bottom: none;
  border-right: none;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  cursor: pointer;
}
.qwui-admin_title .word {
  cursor: pointer;
}
.qwui-super_admin {
  height: 30px;
  width: 100%;
  line-height: 30px;
}
.super_name {
  margin-left: 35px;
}
.super_icon {
  margin-left: 8px;
  padding: 2px;
  font-size: 13px;
  background: #ebf5ff;
  color: #55a9ff;
}
.person_name {
  position: absolute;
  left: 380px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}
.qwui-list_item_headpic {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 10px;
  border-radius: 3px;
  vertical-align: middle;
}
.default_img {
  background: url('~assets/images/user_icon.png') no-repeat center;
  background-size: 24px 24px;
}
.qwui-tag_checkbox {
  float: right;
  cursor: pointer;
}
.qwui-tag_checkbox input {
  visibility: hidden;
}
.qwui-tag_checkbox span {
  display: inline-block;
  float: right;
  width: 18px;
  height: 18px;
  margin: 8px 15px 0 0;
  background: url(../../../assets/images/checkbox_off.png) no-repeat center;
}
.qwui-tag_checkbox input:checked + span {
  background: url(../../../assets/images/checkbox_on.png) no-repeat center;
}
.qwui-tag_checkbox input:disabled + span {
  width: 16px;
  height: 16px;
  border: 1px solid #cbcbcb;
  background: #ededed;
}
.qwui-admin_list {
  height: 331px;
  overflow-x: hidden;
}
.qwui-admin_list::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
.qwui-dept_list {
  display: inline-block;
  position: relative;
  height: auto;
  width: 100%;
  min-width: 242px;
  overflow: auto;
  list-style: none outside none;
}
</style>
