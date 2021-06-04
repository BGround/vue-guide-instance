<template>
  <div class="permission">
    <div class="header">
      <div class="normal_btn qw-return_btn"
           @click="goBack"></div>
      <span class="c999">首页/</span>权限设置
    </div>
    <div class="content">
      <div class="form-item">
        <label class="title">
          <span class="mustInput">*</span>
          授权人
        </label>
        <div class="form-field">
          <pick-exam :useTab="functionTab"
                     :useDepts="defaultDeptVOList"
                     :useTags="defaultTagVOList"
                     :useUsers="defaultUserVOList"
                     :useRadio='defaultUserRadio'
                     @chooseDone="chooseDone"
                     @changeRadio='changeRadio'></pick-exam>
        </div>
      </div>
    </div>
    <div class="btnContainer">
      <qwui-button type="primary"
                   @click="submit"
                   v-perm="'wxAppAuthorityAdd'">保存</qwui-button>
    </div>
  </div>

</template>

<script>
import PickExam from 'components/pickPerson/pickExam'
import QwuiButton from 'components/qwuiBase/qwuiButton/qwuiButton'
import {
  getAuthorizer,
  updateAuthorizer
} from '@/module/crm/api/assistant/index.js'

export default {
  components: {
    QwuiButton,
    PickExam
  },
  created() {
    this.getAuthorizer()
  },
  data() {
    return {
      dataBase,
      defaultDeptVOList: [],
      defaultTagVOList: [],
      defaultUserVOList: [],
      defaultUserRadio: '所有人',
      functionTab: [
        { text: '部门' },
        { text: '标签人员' },
        { text: '特定人员' },
        { text: '批量导入' }
      ],
      isPickerShow: false,
      deptList: [],
      tagList: [],
      userList: []
    }
  },
  methods: {
    getAuthorizer() {
      let { alert: _alert, top_alert } = this.dataBase
      getAuthorizer().then(res => {
        if (res.code === '0') {
          if (Object.keys(res.data).length) {
            // 如果是特定对象
            this.defaultUserRadio = '特定对象'
            this.defaultDeptVOList = res.data.selectDeptVOList
            this.defaultTagVOList = res.data.selectTagVOList
            this.defaultUserVOList = res.data.selectUserVOList

            this.deptList = this.defaultDeptVOList
            this.tagList = this.defaultTagVOList
            this.userList = this.defaultUserVOList
          }
        } else {
          top_alert(res.desc, false, 2000)
        }
      })
    },

    chooseDone: function(dept, tag, user) {
      this.deptList = dept
      this.tagList = tag
      this.userList = user
    },
    // 返回
    goBack() {
      this.$router.back(-1)
    },
    submit() {
      // 格式化部门,人员，标签的id
      let { alert: _alert, top_alert } = this.dataBase
      let data = {}
      if (this.defaultUserRadio === '特定对象') {
        let deptIds = this.formateData(this.deptList, 'nodeId', 'deptId')
        let userIds = this.formateData(this.userList, 'userId', 'userId')
        let tagIds = this.formateData(this.tagList, 'id', 'tagId')
        if (!deptIds && !userIds && !tagIds) {
          top_alert('请输入授权人', false, 2000)
          return
        }
        data = {
          range: '3',
          deptIds,
          userIds,
          tagIds
        }
      } else if (this.defaultUserRadio === '所有人') {
        data = {
          range: '1'
        }
      }
      this.updateAuthorizer(data)
    },
    formateData(list, idType, defaultIdType) {
      if (list && list.length > 0) {
        let array = []
        list.forEach((value, index) => {
          if (value[idType]) {
            array.push(value[idType])
          } else {
            array.push(value[defaultIdType])
          }
        })
        return array.join('|')
      }
      return ''
    },
    updateAuthorizer(data) {
      let { alert: _alert, top_alert } = this.dataBase
      updateAuthorizer(data).then(res => {
        if (res.code === '0') {
          top_alert(res.desc, true, 2000)
          this.goBack()
        } else {
          top_alert(res.desc, false, 2000)
        }
      })
    },
    changeRadio(val) {
      this.defaultUserRadio = val
    }
  }
}
</script>

<style src='./permission.scss' lang="scss"></style>
