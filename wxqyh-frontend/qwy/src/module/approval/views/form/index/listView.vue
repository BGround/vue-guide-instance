<template>
  <div id="listView">
    <ul class="table title flexBox">
      <li class="checkbox"><input class="checkBox"
          type="checkbox"
          v-model="checkedAll"></li>
      <li class="name">表单名称</li>
      <li class="creator">创建人</li>
      <li class="group">所属分组</li>
      <li class="type"
        @mouseover="showTypeDropDown = true"
        @mouseout="showTypeDropDown = false">
        类型
        <div class="gray-arrow"></div>
        <div class="drop-down"
          v-show="showTypeDropDown"
          @click="typeSelect">
          <div class="item"
            :class="searchValue['searchValue.isTask'] == '' ? 'active' : ''"
            :data-value="''">全部</div>
          <div class="item"
            :class="searchValue['searchValue.isTask'] == item.value ? 'active' : ''"
            v-for="item in formType"
            :key="item.value"
            :data-value="item.value">{{item.type}}</div>
        </div>
      </li>
      <li class="version">版本</li>
      <li class="detail">明细数据</li>
      <li class="status"
        @mouseover="showStatusDropDown = true"
        @mouseout="showStatusDropDown = false">
        状态
        <div class="gray-arrow"></div>
        <div class="drop-down"
          v-show="showStatusDropDown"
          @click="statusSelect">
          <div class="item"
            :class="searchValue['searchValue.formStatus'] == '' ? 'active' : ''"
            :data-value="''">全部</div>
          <div class="item"
            :class="searchValue['searchValue.formStatus'] == item.value ? 'active' : ''"
            v-for="item in formStatus"
            :key="item.value"
            :data-value="item.value">{{item.status}}</div>
        </div>
      </li>
      <li class="time">有效时间</li>
      <li class="operation">操作</li>
    </ul>
    <div>
      <ul class="table item flexBox"
        v-for="(form, index) in listData"
        :key="form.id"
        :class="{'forbidden': form.status == -1}">
        <li class="checkbox"><input class="checkBox"
            type="checkbox"
            v-model="checkedModel[index].isChecked"></li>
        <li class="name"
          :title="form.formName">
          <div class="ellipsis">{{form.formName}}</div>
        </li>
        <li class="creator"
          :title="licensingTitle(form.isLicensing, form.hasLicensingToOther)">
          <div class="ellipsis">{{form.personName}}</div>
          <div class="authory"
            :class="{'authorizedByOthers': form.isLicensing == 1, 'authorizedToOthers': form.isLicensing == 0 && form.hasLicensingToOther == 1 }"
            v-if="!(form.isLicensing == 0 && form.hasLicensingToOther == 0)"></div>
        </li>
        <li class="group">
          <div class="ellipsis"
            :title="form.typeName">{{form.typeName}}</div>
        </li>
        <li class="type">{{form.isTask ? formType[form.isTask].type : ''}}</li>
        <li class="version">{{form.versions}}</li>
        <li class="detail"
          :class="{'count': form.status != 2, 'forbidden': !roles.formOrder}"
          @click="form.status != 2 && detail(form)">{{form.count}}</li>
        <li class="status">
          <div>{{form.statusDesc}}</div>
        </li>
        <li class="time">
          <div>{{form.stopTime}}</div>
        </li>
        <li class="operation">
          <operation :formData="form"
            @del="formDel"
            @forbid="formForbid"
            @open="formOpen"></operation>
        </li>
      </ul>
    </div>
    <noData v-show="!setting.totalRows"></noData>
    <page :pageData='pageSetting'
      @change='pageChange'></page>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import page from '@/components/list/page'
import noData from '@/components/list/noData'
import operation from './components/operation'

export default {
  name: 'listView',
  components: {
    operation,
    page,
    noData
  },
  data() {
    return {
      formType: [
        // 表单类型
        { type: '普通单', value: '0' },
        { type: '任务单', value: '1' },
        { type: '审批单', value: '2' },
        { type: '外部单', value: '3' }
      ],
      formStatus: [
        { status: '已发布', value: '1' },
        { status: '草稿', value: '2' },
        { status: '禁用', value: '-1' }
      ],
      showTypeDropDown: false,
      showStatusDropDown: false,
      checkedModel: [], // 选项数组
      pageSetting: {}
    }
  },
  computed: {
    ...mapGetters('form/index', [
      'listData',
      'checkedList',
      'setting',
      'viewMode',
      'searchValue'
    ]),
    ...mapGetters(['roles']),
    checkedAll: {
      // true: 全部选中 false：未全部选中
      get() {
        if (!this.listData.length) {
          return false
        }
        return (
          this.checkedCount == (this.checkedModel && this.checkedModel.length)
        )
      },
      set(val) {
        this.checkedModel &&
          this.checkedModel.forEach(item => {
            item.isChecked = val
          })
        return val
      }
    },
    checkedCount() {
      let i = 0
      this.checkedModel.forEach(item => {
        if (item.isChecked) {
          i++
        }
      })
      return i
    },
    // 提单时间
    commitTime() {
      return [this.searchValue['searchValue.closeStartTime'],this.searchValue['searchValue.closeEndTime']]
    }
  },
  created() {
    this.pageSetting = {
      page: this.setting.page,
      pageSize: this.setting.pageSize,
      maxPage: this.setting.maxPage,
      totalRows: this.setting.totalRows
    }
  },
  updated() {
    if (window.frameElement) {
      window.frameElement.height = window.document.body.scrollHeight
    }
  },
  methods: {
    ...mapActions('form/index', [
      'SetCheckedList',
      'GetFormData',
      'SetSetting',
      'SetViewMode',
      'SetNoData',
      'SetFormTips',
      'SetSearchValue'
    ]),
    checkedAll() {
      this.checked = this.checked ? false : true
      this.checkedModel.forEach(item => {
        item.isChecked = this.checked
      })
    },
    licensingTitle(isLicensing, hasLicensingToOther) {
      if (isLicensing == 1) {
        return '由其他管理员授权'
      } else if (hasLicensingToOther == 1) {
        return '已授权给其他管理员'
      }
    },
    detail(form) {
      // 表单明细数据
      let id = form.definitionVersionsId,
        controlId = form.controlId,
        isTask = form.isTask,
        count = form.count
      window.location.href =
        _.baseURL +
        '/manager/form/detail_mx_listMain.jsp?id=' +
        id +
        '&isTask=' +
        isTask +
        '&controlId=' +
        controlId +
        '&countNum=' +
        count +
        '&objvalue=1' +
        '&startTimes=' +
        (this.commitTime[0]||'') +
        '&endTime=' +
        (this.commitTime[1]||'')
    },
    pageChange(page, pageSize) {
      this.SetSetting({ page: page, pageSize: pageSize })
      this.GetFormData()
    },
    typeSelect(e) {
      this.SetSetting({ page: 1 })
      this.SetSearchValue({ 'searchValue.isTask': e.target.dataset.value })
      this.GetFormData()
    },
    statusSelect(e) {
      this.SetSetting({ page: 1 })
      this.SetSearchValue({ 'searchValue.formStatus': e.target.dataset.value })
      this.GetFormData()
    },
    formDel(res) {
      this.GetFormData()
      _top.top_alert('删除成功')
    },
    formOpen(res) {
      this.GetFormData()
      _top.top_alert('启用成功，已移动至列表前方')
    },
    formForbid(res) {
      this.GetFormData()
      _top.top_alert('禁用成功，已移动到列表末尾')
    }
  },
  watch: {
    checkedModel: {
      handler(newVal) {
        let checkedList = []
        newVal.forEach(item => {
          item.isChecked && checkedList.push(item.id)
        })
        this.SetCheckedList(checkedList)
      },
      deep: true
    },
    listData: {
      handler(val) {
        let _this = this
        this.checkedModel = []
        val.forEach(function(item, index) {
          _this.checkedModel.push({
            id: item.definitionVersionsId,
            isChecked: false
          })
        })
      },
      immediate: true,
      deep: true
    },
    setting: {
      handler(val) {
        this.pageSetting = {
          page: val.page,
          pageSize: val.pageSize,
          maxPage: val.maxPage,
          totalRows: val.totalRows
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
#listView {
  font-size: 13px;
}
.table {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  border: 1px solid #ddd;
}
.table.forbidden {
  color: #999999;
}
.table li {
  border-right: 1px solid #ddd;
  padding: 15px 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.table li:last-child {
  border: none;
}
.table li:first-child,
.table li:last-child {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.title {
  color: #666;
  background-color: #eeeeee;
}
.item {
  border-top: none;
}
.item:hover {
  background-color: #f5f5f5;
}
.item.active {
  background-color: #f5f5f5;
}
.checkbox {
  min-width: 40px;
}
.checkBox {
  cursor: pointer;
}
.name {
  flex: 1 1;
  min-width: 200px;
}
.creator {
  flex: 1 1;
  min-width: 100px;
}
.group {
  flex: 1 1;
  min-width: 120px;
}
.type {
  position: relative;
  min-width: 70px;
}
.detail {
  min-width: 80px;
}
.detail.forbidden {
  pointer-events: none;
  color: #999999;
}
.version {
  min-width: 50px;
}
.status {
  position: relative;
  min-width: 70px;
}
.time {
  min-width: 120px;
  flex: 1 1;
}
.operation {
  min-width: 60px;
}
.authory {
  display: inline-block;
  width: 18px;
  height: 18px;
  vertical-align: middle;
  padding-right: 5px;
  margin-left: 5px;
}
.count {
  color: #f87b00;
  cursor: pointer;
}
.published {
  color: #999;
}
.gray-arrow {
  position: absolute;
  top: 23px;
  right: 17px;
  width: 0;
  height: 0;
  border-width: 5px;
  border-style: solid;
  border-color: #999999 transparent transparent transparent;
}
.drop-down {
  box-sizing: border-box;
  position: absolute;
  top: 50px;
  left: 0;
  z-index: 10;
  width: 100%;
  line-height: 32px;
  background-color: #fff;
  box-shadow: rgb(204, 204, 204) 0 5px 20px;
}
.drop-down .item {
  cursor: pointer;
  padding-left: 10px;
}
.drop-down .item:hover {
  background-color: #f5f5f5;
}
.numTips {
  display: inline-block;
  vertical-align: top;
  color: #999;
  line-height: 27px;
}
.authorizedToOthers {
  background: url(../../../../../assets/images/ic_authorizedToOthers.png)
    no-repeat;
}
.authorizedByOthers {
  background: url(../../../../../assets/images/ic_authorizedByOthers.png)
    no-repeat;
}
</style>

