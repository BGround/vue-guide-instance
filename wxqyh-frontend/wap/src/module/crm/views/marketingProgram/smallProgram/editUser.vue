<template>
  <div class="wrap qwui-wrap">
    <div class="editUser_content">
      <div class="editUser_section">
        <div class="editUser_input">
          <span class="editUser_input_label">备注名</span>
          <input type="text"
                 placeholder="输入备注名"
                 maxlength="12"
                 v-model="userInfo.name" />
        </div>
        <div class="editUser_input">
          <div class="editUser_input_label">手机</div>
          <input type="text"
                 placeholder="输入手机号"
                 maxlength="15"
                 v-model="userInfo.tel" />
        </div>
      </div>
      <div class="editUser_footer">
        <div class="editUser_footer_btn editUser_default_btn"
             @click="back">取消</div>
        <div class="editUser_footer_btn editUser_primary_btn"
             @click="save">保存</div>
      </div>
    </div>
  </div>
</template>


<script>
import { saveCustomerInfo } from '../../../api/smallProgram/getBata.js'
const phoneCheck = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
export default {
  data() {
    return {
      userInfo: {
        customerId: '',
        name: '',
        tel: ''
      }
    }
  },
  created() {
    this.userInfo.customerId = this.$route.query.userInfo.customerId
    this.userInfo.name = this.$route.query.userInfo.userName
    this.userInfo.tel = this.$route.query.userInfo.userNum
  },
  methods: {
    back() {
      this.$router.replace({
        path: '/userInfo',
        query: { customerId: this.userInfo.customerId }
      })
    },
    save() {
      this.userInfo.name = this.userInfo.name.trim();

      if (!this.userInfo.name) {
        _.alert('提示', '备注名不能为空')
        return
      }

      if (this.isEmojiCharacter(this.userInfo.name)) {
        _.alert('提示', '备注名不能包含特殊表情')
        return
      }

      if (!phoneCheck.test(this.userInfo.tel) && this.userInfo.tel) {
        _.alert('提示', '请输入正确的手机号码')
        return
      }
      const data = {
        customerId: this.userInfo.customerId,
        'wxappUserInfoPO.memoName': this.userInfo.name,
        'wxappUserInfoPO.phoneNum': this.userInfo.tel
      }
      saveCustomerInfo(data, res => {
        setTimeout(() => {
          this.$router.replace({
            path: '/userInfo',
            query: { customerId: this.userInfo.customerId }
          })
        }, 1500)
      })
    },
    // 判断文本中是否有emoji表情
    isEmojiCharacter(substring) {
      let hs, ls, uc
      for (var i = 0; i < substring.length; i++) {
        hs = substring.charCodeAt(i)
        if (hs >= 0xd800 && hs <= 0xdbff) {
          if (substring.length > 1) {
            ls = substring.charCodeAt(i + 1)
            uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000
            if (uc >= 0x1d000 && uc <= 0x1f77f) {
              return true
            }
          }
        } else if (substring.length > 1) {
          ls = substring.charCodeAt(i + 1)
          if (ls === 0x20e3) {
            return true
          }
        } else {
          if (hs >= 0x2100 && hs <= 0x27ff) {
            return true
          } else if (hs >= 0x2b05 && hs <= 0x2b07) {
            return true
          } else if (hs >= 0x2934 && hs <= 0x2935) {
            return true
          } else if (hs >= 0x3297 && hs <= 0x3299) {
            return true
          } else if (
            hs === 0xa9 ||
            hs === 0xae ||
            hs === 0x303d ||
            hs === 0x3030 ||
            hs === 0x2b55 ||
            hs === 0x2b1c ||
            hs === 0x2b1b ||
            hs === 0x2b50
          ) {
            return true
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.qwui-wrap {
  width: 100%;
  height: 100%;
}
.editUser_content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .editUser_section {
    flex: 1;
    padding-top: 8px;
    background-color: #f7f8fa;

    .editUser_input {
      padding: 0 15px;
      height: 50px;
      display: flex;
      align-items: center;
      background-color: #fff;

      .editUser_input_label {
        margin-right: 11px;
        width: 63px;
        font-size: 15px;
        color: #7a7c80;
      }

      input {
        flex: 1;
        font-size: 15px;
        color: #3f4a64;
      }
    }

    .editUser_input:first-child {
      border-bottom: 1px solid #f7f8fa;
    }
  }
}
.editUser_footer {
  display: flex;
  width: 100%;
  height: 50px;
  .editUser_default_btn,
  .editUser_primary_btn {
    flex: 1;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .editUser_default_btn {
    background: #fff;
    color: #7a7c80;
    font-size: 16px;
  }

  .editUser_primary_btn {
    background: #5585f0;
    color: #fff;
    font-size: 16px;
  }
}
</style>
