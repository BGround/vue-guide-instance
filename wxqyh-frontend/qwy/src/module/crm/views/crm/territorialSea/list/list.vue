<template>
  <div class="mt25 poolSea">
    <template v-if="isUsingCrmPool">
      <div class="top_bar">
        <!-- 顶部 左边 快捷按钮 -->
        <div class="lef_bar">
          <template v-if="!isChooseClient">
            <qw-button type="primary"
                       @click="addTerritorialSea"
                       class="top-tool--add">新建</qw-button>
            <span v-perm="'poolClientImport'">
              <qw-button @click="showImport=true">导入</qw-button>
            </span>
            <div class="recycleBin"
                 @click="recycleBin"><i></i>回收站</div>
          </template>
          <template v-else>
            <span v-perm="'poolClientAssign'">
              <qw-button @click="assignTerritorialSea"
                         v-if="isShowAssignButton"
                         class="mr8">分配</qw-button>
            </span>
            <qw-button @click="recoveryTerritorialSea"
                       v-if="!isShowAssignButton"
                       class="mr8">回收</qw-button>
            <span v-perm="'poolChange'">
              <qw-button @click="changeTerritorialSea">变更公海</qw-button>
            </span>
            <div class="tipBtn"
                 @mouseover="isTips('freeze')"
                 @mouseout="isTips('freeze')"
                 v-perm="'poolClientFreeze'">
              <qw-button @click="frozenTerritorialSea"
                         v-if="isShowAssignButton"
                         class="ml8">冻结</qw-button>
              <div class="tipsItem"
                   v-show="isFreezeTips">
                <div class="tipsContent">
                  冻结适用于一段时间内没有新增商机的客户。
                </div>
              </div>
            </div>
            <div class="tipBtn"
                 @mouseover="isTips('scrap')"
                 @mouseout="isTips('scrap')"
                 v-perm="'poolClientScrap'">
              <qw-button @click="scrapTerritorialSea"
                         v-if="isShowAssignButton"
                         class="ml8 mr8">废弃</qw-button>
              <div class="tipsItem"
                   v-show="isScrapTips">
                <div class="tipsContent">
                  废弃适用于不再具有可挖掘商机的客户。
                </div>
              </div>
            </div>
            <span v-perm="'poolClientDel'">
              <qw-button @click="deleteTerritorialSea">删除</qw-button>
            </span>
          </template>
        </div>
        <!-- 顶部 右边 快捷搜索 -->
        <div class="right_bar">
          <qwui-select class="mr15"
                       @selectItem="selectItem"
                       :dataList="optionData"
                       placeholder="全部公海"
                       ref="selectPool"></qwui-select>
          <qw-input inputType="search"
                    :maxLength="200"
                    v-model="searchForm.title"
                    inputTips="客户名称"
                    @search="searchData"></qw-input>
          <a href="javascript:void(0)"
             class="qw-table-tool-filter-btn"
             :class="{ active: isShowFilter }"
             @click="toggleFilter">高级</a>
        </div>
      </div>
      <!-- 高级搜索 -->
      <div class="top-search-tool">
        <transition name="slide-fade">
          <div class="qw-table-filter-wrap"
               v-show="isShowFilter">
            <ul class="search_items">
              <li class="qw-form-item">
                <h1>
                  客户名称
                </h1>
                <qw-input class="search-input-width-284"
                          inputType="base"
                          v-model="searchForm.title"
                          inputTips="请输入"></qw-input>
              </li>
              <li class="qw-form-item">
                <h1>
                  客户编码
                </h1>
                <qw-input class="search-input-width-284"
                          inputType="base"
                          v-model="searchForm.clientCode"
                          inputTips="请输入"></qw-input>
              </li>
              <li class="qw-form-item">
                <h1>
                  行业
                </h1>
                <qw-input class="search-input-width-284"
                          inputType="base"
                          v-model="searchForm.industry"
                          inputTips="请输入"></qw-input>
              </li>

            </ul>
            <ul class="search_items">
              <li class="qw-form-item">
                <h1>
                  负责人
                </h1>
                <pick-exam class="competitorPickPerson"
                           :useTab="functionTab"
                           :useDepts="defaultDeptVOList_charge"
                           :useUsers="defaultUserVOList_charge"
                           @chooseDone="chooseDone_charge"
                           onlyUser
                           :isShowRadios="false"
                           ref="chargePersonsPick">
                </pick-exam>
              </li>
              <li class="qw-form-item">
                <h1>
                  相关人
                </h1>
                <pick-exam class="competitorPickPerson"
                           :useTab="functionTab"
                           :useDepts="defaultDeptVOList_correlation"
                           :useUsers="defaultUserVOList_correlation"
                           @chooseDone="chooseDone_correlation"
                           onlyUser
                           :isShowRadios="false"
                           ref="relativePerson">
                </pick-exam>
              </li>
              <li class="qw-form-item">
                <h1>
                  创建人
                </h1>
                <pick-exam class="competitorPickPerson"
                           :useTab="functionTab"
                           :useDepts="defaultDeptVOList_creator"
                           :useUsers="defaultUserVOList_creator"
                           @chooseDone="chooseDone_creator"
                           onlyUser
                           :isShowRadios="false"
                           ref="createPersonsPick">
                </pick-exam>
              </li>

            </ul>
            <ul class="search_items">
              <li class="qw-form-item">
                <h1>
                  地址
                </h1>
                <qw-input class="search-input-width-284"
                          inputType="base"
                          v-model="searchForm.address"
                          inputTips="请输入"></qw-input>
              </li>
              <li class="qw-form-item">
                <div class="date-block">
                  <h1>
                    创建时间
                  </h1>
                  <date-picker class="date-picker-width"
                               v-model="createTime"
                               rangeSeparator="至"
                               :showButtons="true"
                               @confirm="createDateConfirm"
                               ref="searchCreateDate"></date-picker>
                </div>
              </li>
              <li class="qw-form-item">
                <div class="date-block">
                  <h1>
                    更新时间
                  </h1>
                  <date-picker class="date-picker-width"
                               v-model="updateTime"
                               rangeSeparator="至"
                               :showButtons="true"
                               @confirm="updateDateConfirm"
                               ref="searchUpdateDate"></date-picker>
                </div>
              </li>
            </ul>
            <div class="bottom-tool">
              <qw-button @click="clearSearch"
                         size="small">清空</qw-button>
              <qw-button type="primary"
                         @click="getList"
                         size="small">查询</qw-button>
            </div>
          </div>
        </transition>
      </div>
      <!-- 分配状态 -->
      <div class="topStatusFilter">
        状态：
        <span :class="{active:!isAssignStatus}"
              @click="selectAssign('1')">待分配</span>
        <span :class="{active:isAssignStatus}"
              @click="selectAssign('2')">已分配</span>
      </div>
      <!-- 列表 -->
      <div class="mt10">
        <data-table :headData="headData"
                    :dataList="dataList"></data-table>
        <page :pageData="pageSetting"
              @change="pageChage"></page>
      </div>

      <!-- 选择所属公海 -->
      <qwSelectSea :show="showPoolSelect"
                   @closePool="closePool"
                   @on-confirm="confirmPool"
                   :poolList="poolArr"></qwSelectSea>
      <!-- 公海池选人 -->
      <qw-sea-person-modal v-model="showSeaPersonModal"
                           :poolData="poolArr"
                           :seaId="seaId"
                           :seaName="seaName"
                           @onConfirm="dealConfirm"
                           @onHide="dealHide"></qw-sea-person-modal>
      <!--选人组件-->
      <!-- <pick-person :show="isPickPerson" :defaultUsers="principalUsers" :defaultTags="principalTags" :functionTab="principalFunctionTab"
        @chooseDone="choosePrincipal" @closeThis="closeThis(true)"></pick-person> -->
      <!-- 导入 -->
      <territorialSea-import v-model="showImport"
                             @import-finish="getList"></territorialSea-import>
      <!-- 详情 -->
      <crm-detail type="pool"
                  ref="territorialSeaDetail"
                  :id="detailId"
                  :permissionEdit="'poolClientEdit'"
                  :operateConfig="operateConfig"
                  @edit="openEdit"
                  @moreOperate="moreOperateKey"></crm-detail>
    </template>
    <!-- 未启用所属公海字段 -->
    <template v-else>
      <div class="tcenter">
        <img src="@/assets/images/noDateTerritorialSea.png"
             alt="" />
        <div><a class="btn-open"
             @click="setOpenSetting">启用公海池</a></div>
      </div>
    </template>
  </div>
</template>
<script>
  import qwButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
  import qwuiSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect'
  import qwInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
  import PickExam from '@/components/pickPerson/pickExam'
  import datePicker from '@/components/base/VueDatepickerLocal'
  import dataTable from '@/components/list/dataTable'
  import page from '@/components/list/page'
  import TerritorialSeaImport from './import'
  import qwSelectSea from 'crm/components/qw-selectSea/qw-selectSea'
  // import pickPerson from '@/components/pickPerson/pickPerson';
  import QwSeaPersonModal from "@/module/crm/components/qw-seaPersonModal/qw-seaPersonModal";
  import crmDetail from "@/module/crm/components/crm-detail/crmDetail";
  import {
    getUsingCrmPool,
    setOpenSetting,
    getPoolList,
    getSearchList,
    frozenTerritorialSea,
    scrapTerritorialSea,
    deleteTerritorialSea,
    recoveryTerritorialSea,
    changeTerritorialSea,
    saveAssignSea,
  } from '@/module/crm/api/territorialSea'

  export default {
    name: 'territorialSeaList',
    components: {
      qwButton,
      qwuiSelect,
      qwInput,
      PickExam,
      datePicker,
      dataTable,
      page,
      TerritorialSeaImport,
      qwSelectSea,
      // pickPerson,
      QwSeaPersonModal,
      crmDetail
    },
    data() {
      return {
        // baseURL: _.baseURL,
        dataBase,
        isUsingCrmPool: true, //默认启用公海池
        isChooseClient: false, //是否选择了客户
        isShowAssignButton: true, //默认开启冻结，废弃,分配（还需满足不选择全部公海）
        isAssignStatus: false, //是否分配状态
        // isTotalTerritorialSea: true, //是否选择全部公海
        isFreezeTips: false, //是否显示冻结提示
        isScrapTips: false, //是否显示废弃提示
        detailId: '', //详情id
        clickDetail: false, //是否点击详情里的分配，变更等功能按钮
        operateConfig: [],
        operateConfig1: [ //详情更多操作配置
          {
            key: 'assign',
            name: '分配',
            permission: 'poolClientAssign'
          },
          {
            key: 'change',
            name: '变更公海',
            permission: 'poolChange'
          },
          {
            key: 'frozen',
            name: '冻结',
            permission: 'poolClientFreeze'
          },
          {
            key: 'scrap',
            name: '废弃',
            permission: 'poolClientScrap'
          },
          {
            key: 'delete',
            name: '删除',
            permission: 'poolClientDel'
          }
        ],
        operateConfig2: [ //详情更多操作配置
          {
            key: 'recovery',
            name: '回收',
          },
          {
            key: 'change',
            name: '变更公海',
            permission: 'poolChange'
          },
          {
            key: 'delete',
            name: '删除',
            permission: 'poolClientDel'
          }
        ],
        // isPickPerson: false, //默认-默认公海池分配选人隐藏
        // principalTags: [], // 标签
        // principalUsers: [], // 成员
        // 选人tab
        // principalFunctionTab: [{
        //     text: '标签人员'
        //   },
        //   {
        //     text: '特定人员'
        //   },
        // ],
        showSeaPersonModal: false, //默认公海池分配选人隐藏
        seaId: '', //公海池id
        seaName: '', //公海名称
        optionData: [], //公海池客户列表select列表数据
        poolArr: [], //公海池select列表传入组件数据
        isShowFilter: false, // 高级 按钮点击样式
        //高级搜索配置
        createTime: [], // 创建时间选择器值
        updateTime: [], // 更新时间选择器值
        searchForm: { // 搜索框 表单
          givenUserIds: '', // 分配人员
          poolId: '', // 公海池select列表id
          poolName: '', // 公海池select列表id
          title: '', // 客户名称
          clientCode: '', // 编码
          industry: '', // 地址
          chargePerson: '', // 负责人
          relativePerson: '', // 相关人
          closeUserId: '', // 创建人
          address: '', // 地址
          startTime: '', // 创建开始时间
          endTime: '', // 创建结束时间
          startUpdateTime: '', // 更新结束时间
          endUpdateTime: '', // 更新结束时间
          clientStatus: '1' // 客户分配状态
        },
        // 选人组件 标签
        functionTab: [{
            text: '标签人员'
          },
          {
            text: '特定人员'
          }
        ],
        //  ...Dept 选人组件 默认部门
        //  ...User 选人组件 默认用户
        defaultDeptVOList_charge: [],
        defaultUserVOList_charge: [],
        deptList_charge: [],
        userList_charge: [],
        defaultDeptVOList_correlation: [],
        defaultUserVOList_correlation: [],
        deptList_correlation: [],
        userList_correlation: [],
        defaultDeptVOList_creator: [],
        defaultUserVOList_creator: [],
        deptList_creator: [],
        userList_creator: [],
        headData: {
          //  页表数据头
          left: {
            checkFunc: (checkAll, checkList) => {
              let arr = []
              let notCheckNum = 0
              checkList.map(item => {
                item.isChecked ? arr.push(item.id) : notCheckNum++
              })

              this.isChooseClient = (checkList.length - notCheckNum) ? true : false
              this.ids = arr.join(',')
            }
          },
          middle: [{
              title: '客户名称',
              key: 'clientName',
              width: 242,
              skip: {
                skipFunc: id => {
                  // 打开详情
                  this.detailId = id
                  // 待分配状态和分配状态
                  // let operateConfigObj = this.isTotalTerritorialSea ? this.operateConfig1 : operateConfigAssign.concat(
                  //   this.operateConfig1)
                  this.operateConfig = this.isAssignStatus ? this.operateConfig2 : this.operateConfig1
                  this.$refs.territorialSeaDetail.showDetail()
                }
              }
            },
            {
              title: '所属公海',
              key: 'poolName',
              width: 100
            },
            {
              title: '状态',
              key: 'clientStatus',
              width: 80
            },
            {
              title: '创建人',
              key: 'personName',
              width: 80
            },
            {
              title: '退回次数',
              key: 'backTimes',
              width: 80
            },
            {
              title: '创建时间',
              key: 'createTime',
              width: 150
            },
            {
              title: '更新时间',
              key: 'updateTime',
              width: 150
            }
          ],
          right: {
            isShowOperate: false
          }
        },
        // 表格数据
        dataList: [],
        // 分页器相关配置,页码设置
        pageSetting: {
          maxPage: '',
          totalRows: '',
          page: '1',
          pageSize: 10
        },
        ids: "", // 勾选中的id
        showImport: false, //显示导入弹窗
        showPoolSelect: false, //显示公海池选择

      }
    },
    created() {
      this.init()
    },
    methods: {
      isTips(val) {
        if (val == 'freeze') {
          this.isFreezeTips = !this.isFreezeTips
        } else {
          this.isScrapTips = !this.isScrapTips
        }
      },
      init() {
        this.getUsingCrmPool()
      },

      //获取是否启用公海池
      getUsingCrmPool() {
        let {
          alert: _alert,
          top_alert
        } = this.dataBase;
        getUsingCrmPool()
          .then(res => {
            if (res.code == '0') {
              this.isUsingCrmPool = res.data.isUsing
              // this.isUsingCrmPool = false
              if (!this.isUsingCrmPool) return

              this.getClientPoolList()
              this.getList()
            } else {
              _alert('提示', res.desc)
            }
          })
          .catch(err => {
            _alert('提示', '网络错误')
          })
      },

      //启用公海池
      setOpenSetting() {
        let {
          alert: _alert,
          top_alert
        } = this.dataBase;
        setOpenSetting()
          .then(res => {
            if (res.code == '0') {
              //跳转公海池设置页面
              this.$router.push({
                path: "/crm/setting/poolSetting"
              })
            } else {
              _alert('提示', res.desc)
            }
          })
          .catch(err => {
            _alert('提示', '网络错误')
          })
      },

      //获取公海池select列表
      getClientPoolList() {
        let {
          alert: _alert
        } = this.dataBase
        const obj = {
          checkDefault: 1
        }
        getPoolList(obj)
          .then(res => {
            if (res.code == '0') {
              const {
                CrmClientPoolConfigList
              } = res.data
              let optionData = [{
                'optionName': '全部公海',
                'val': ''
              }]

              CrmClientPoolConfigList.map((item, index) => {
                let obj = {
                  'optionName': item.poolName,
                  'val': item.id
                }
                this.poolArr.push(obj)
              })
              this.optionData = optionData.concat(this.poolArr)
              this.$nextTick(() => {
                this.$refs.selectPool && this.$refs.selectPool.setValue('')
              })
            } else {
              _alert('提示', res.desc)
            }
          })
          .catch(err => {
            _alert('提示', '网络错误')
          })
      },

      //公海池select列表回调
      selectItem(optionName, val) {
        // 全部公海则，待分配状态没有分配按钮
        // this.isTotalTerritorialSea = val == '' ? true : false

        this.searchForm.poolId = val
        this.searchForm.poolName = optionName
        this.pageChage('1', '10')
        // this.getList()
      },

      // 搜索框回调函数 获取表格数据 只根据客户名称进行搜索
      searchData() {
        this.getList()
      },

      //高级搜索确定回调
      // 获取列表数据 包括 高级搜素中的关键词
      getList() {
        let {
          alert: _alert
        } = this.dataBase
        let obj = {
          givenUserIds: this.searchForm.givenUserIds,
          'searchValue.poolId': this.searchForm.poolId,
          'searchValue.title': this.searchForm.title,
          'searchValue.clientCode': this.searchForm.clientCode,
          'searchValue.industry': this.searchForm.industry,
          'searchValue.chargePerson': this.searchForm.chargePerson,
          'searchValue.relativePerson': this.searchForm.relativePerson,
          'searchValue.closeUserId': this.searchForm.closeUserId,
          'searchValue.address': this.searchForm.address,
          'searchValue.startTime': this.searchForm.startTime,
          'searchValue.endTime': this.searchForm.endTime,
          'searchValue.startUpdateTime': this.searchForm.startUpdateTime,
          'searchValue.endUpdateTime': this.searchForm.endUpdateTime,
          'searchValue.clientStatus': this.searchForm.clientStatus,
          "page": this.pageSetting.page,
          "pageSize": this.pageSetting.pageSize
        }
        getSearchList(obj)
          .then(res => {
            if (res.code == '0') {

              this.dataList = this.filterListData(res.data.pageData) || []
              this.pageSetting.totalRows = res.data.totalRows
              this.pageSetting.maxPage = res.data.maxPage
              this.pageSetting.page = res.data.currPage

              //设置为没有选择客户，只显示新建，导入按钮
              this.isChooseClient = false
            } else {
              _alert('提示', res.desc)
            }
          })
          .catch(err => {
            _alert('提示', '网络错误')
          })
      },

      //过滤列表数据返回加工后数据
      filterListData(dataList) {
        if (!dataList) return
        dataList.reduce((preVal, currentVal) => {
          currentVal.clientStatus = currentVal.clientStatus == '1' ? '待分配' : '已分配'
          currentVal.backTimes = `${currentVal.backTimes}次`
        }, {})
        return dataList
      },

      // 页码组件回调函数
      pageChage(page, pageSize) {
        this.pageSetting.pageSize = pageSize
        this.pageSetting.page = page
        this.getList()
      },

      // 清空 高级搜索
      clearSearch() {
        this.$refs.chargePersonsPick.clearUsers()
        this.$refs.relativePerson.clearUsers()
        this.$refs.createPersonsPick.clearUsers()

        this.createTime = [];
        this.updateTime = [];

        this.searchForm = { // 搜索框 表单
          givenUserIds: '', // 分配人员
          poolId: '', // 公海池select列表id
          title: '', // 客户名称
          clientCode: '', // 编码
          industry: '', // 地址
          chargePerson: '', // 负责人
          relativePerson: '', // 相关人
          closeUserId: '', // 创建人
          address: '', // 地址
          startTime: '', // 创建开始时间
          endTime: '', // 创建结束时间
          startUpdateTime: '', // 更新结束时间
          endUpdateTime: '', // 更新结束时间
          clientStatus: '1' // 客户分配状态
        }
      },

      // //重置分页
      // resetPage(){
      //   this.pageSetting = {// 分页器相关配置
      //     maxPage: '',
      //     totalRows: '',
      //     page: '1',
      //     pageSize: 10
      //   }
      // },

      //高级搜索选人返回值
      chooseDone(dept, tag, user) {
        let userResult = []
        let deptResult = []
        user.map(item => {
          userResult.push(item.userId)
        })
        dept.map(item => {
          deptResult.push(item.nodeId)
        })
        return {
          userResult,
          deptResult
        }
      },

      // 负责人 选人组件回调
      chooseDone_charge(dept, tag, user) {
        let {
          userResult,
          deptResult
        } = this.chooseDone(dept, tag, user)

        this.searchForm.chargePerson = userResult.join(',')
        this.searchForm.chargeDept = deptResult.join(",")
      },

      // 相关人 选人组件回调
      chooseDone_correlation(dept, tag, user) {
        let {
          userResult,
          deptResult
        } = this.chooseDone(dept, tag, user)

        this.searchForm.relativePerson = userResult.join(',')
        this.searchForm.relativeDept = deptResult.join(",")
      },

      // 创建人 选人组件回调
      chooseDone_creator(dept, tag, user) {
        let {
          userResult,
          deptResult
        } = this.chooseDone(dept, tag, user)

        this.searchForm.closeUserId = userResult.join(',')
        this.searchForm.closeDept = deptResult.join(",")
      },

      // 日期组件 确定 按钮回调函数
      createDateConfirm(val) {
        this.$refs.searchCreateDate.ok()
      },
      // 日期组件 确定 按钮回调函数
      updateDateConfirm(val) {
        this.$refs.searchUpdateDate.ok()
      },

      //切换显示高级搜索
      toggleFilter() {
        this.isShowFilter = !this.isShowFilter
      },

      //点击回收站
      recycleBin() {
        this.$router.push({
          path: 'recycleList'
        })
      },

      //新建公海按钮
      addTerritorialSea() {
        this.$router.push({
          path: 'operate'
        })
      },

      //点击分配公海按钮
      assignTerritorialSea() {
        // 默认公海 分配时 打开通讯录
        // if (this.searchForm.poolId == '0') {
        //   // this.isPickPerson = true
        // } else { // 非默认公海 分配时 打开对应的公海池
        this.showSeaPersonModal = true
        this.seaId = this.searchForm.poolId
        this.seaName = this.searchForm.poolName
        // 如果是全部公海默认选择第一个公海池
        if (this.seaId == '') {
          this.seaId = this.poolArr[0].val
          this.seaName = this.poolArr[0].optionName
        }
        // }
      },

      // 分配默认客户选人回调
      // choosePrincipal(deptSelected, tagList, specialUsers) {
      //   let {
      //     userResult,
      //     deptResult
      //   } = this.chooseDone(deptSelected, tagList, specialUsers)
      //   this.searchForm.givenUserIds = userResult.join(',')

      //   let obj = {
      //     clientIds: this.clickDetail ? this.detailId : this.ids,
      //     poolId: this.searchForm.poolId,
      //     userId: this.searchForm.givenUserIds
      //   }

      //   this.saveAssignSea(obj)
      //   this.closeThis()
      // },

      // 选人关闭按钮
      // closeThis() {
      //   // this.isPickPerson = false;
      //   this.clickDetail = false;
      // },

      //分配客户给公海成员回调
      dealConfirm(selectData, poolId) {
        let obj = {
          clientIds: this.clickDetail ? this.detailId : this.ids,
          poolId: poolId,
          userId: selectData.userId
        }

        this.saveAssignSea(obj)
      },

      //分配公海成员关闭回调
      dealHide() {
        this.clickDetail = false;
      },

      //保存分配公海人员
      saveAssignSea(obj) {
        let {
          alert: _alert,
          top_alert
        } = this.dataBase;
        saveAssignSea(obj)
          .then(res => {
            if (res.code == '0') {
              top_alert('分配成功', true, 1000);
              this.getList()
              this.$refs.territorialSeaDetail.$refs.detailBlock.close()
            } else {
              top_alert(res.desc, false, 1000);
            }
            this.clickDetail = false
          })
          .catch(err => {
            _alert('提示', '网络错误')
          })
      },

      //点击变更公海按钮
      changeTerritorialSea() {
        this.showPoolSelect = true
      },

      //选择公海选择
      confirmPool(val) {
        let {
          alert: _alert,
          top_alert
        } = this.dataBase;
        let obj = {
          "clientId": this.clickDetail ? this.detailId : this.ids,
          "poolId": val.val
        }

        changeTerritorialSea(obj)
          .then(res => {
            if (res.code == '0') {
              top_alert('变更成功', true, 1000);
              this.closePool()
              this.getList()
              this.$refs.territorialSeaDetail.$refs.detailBlock.close()
            } else {
              top_alert(res.desc, false, 1000);
            }
            this.clickDetail = false
          })
          .catch(err => {
            _alert('提示', '网络错误')
          })
      },

      //关闭变更公海池
      closePool() {
        this.showPoolSelect = false;
        this.clickDetail = false
      },

      //点击回收公海按钮
      recoveryTerritorialSea() {
        let {
          alert: _alert,
          top_alert
        } = this.dataBase;

        let clientIds = this.clickDetail ? this.detailId : this.ids
        if (!clientIds) {
          _alert('提示', '请选择要回收的客户');
          return;
        }

        _alert('提示', '回收客户将会把客户移动到公海池，确定回收吗？',
          () => {
            recoveryTerritorialSea({
                clientId: clientIds,
              })
              .then(res => {
                if (res.code == '0') {
                  top_alert('回收成功', true, 1000);
                  this.getList();
                  this.$refs.territorialSeaDetail.$refs.detailBlock.close()
                } else {
                  top_alert(res.desc, false, 1000);
                }
                this.clickDetail = false
              })
              .catch(err => {
                _alert('提示', '网络错误');
              });
          }, '确定', true
        );
      },

      //点击冻结公海按钮
      frozenTerritorialSea() {
        let {
          alert: _alert,
          top_alert
        } = this.dataBase;

        let clientIds = this.clickDetail ? this.detailId : this.ids
        if (!clientIds) {
          _alert('提示', '请选择要冻结的数据');
          return;
        }

        _alert('提示', '冻结后将不能领取和分配客户，确认冻结吗？',
          () => {
            frozenTerritorialSea({
                clientIds: clientIds,
              })
              .then(res => {
                if (res.code == '0') {
                  top_alert('冻结成功', true, 1000);
                  this.getList();
                  this.$refs.territorialSeaDetail.$refs.detailBlock.close()
                } else {
                  top_alert(res.desc, false, 1000);
                }
                this.clickDetail = false
              })
              .catch(err => {
                _alert('提示', '网络错误');
              });
          }, '确定', true
        );
      },

      //点击废弃公海按钮
      scrapTerritorialSea() {
        let {
          alert: _alert,
          top_alert
        } = this.dataBase;

        let clientIds = this.clickDetail ? this.detailId : this.ids
        if (!clientIds) {
          _alert('提示', '请选择要废弃的数据');
          return;
        }

        _alert('提示', '废弃后客户详情不可被查看，确认废弃吗？',
          () => {
            scrapTerritorialSea({
                clientIds: clientIds,
              })
              .then(res => {
                if (res.code == '0') {
                  top_alert('废弃成功', true, 1000);
                  this.getList();
                  this.$refs.territorialSeaDetail.$refs.detailBlock.close()
                } else {
                  top_alert(res.desc, false, 1000);
                }
                this.clickDetail = false
              })
              .catch(err => {
                _alert('提示', '网络错误');
              });
          }, '确定', true
        );
      },

      //删除公海按钮
      deleteTerritorialSea() {
        let {
          alert: _alert,
          top_alert
        } = this.dataBase;

        let clientIds = this.clickDetail ? this.detailId : this.ids
        if (!clientIds) {
          _alert('提示', '请选择要删除的数据');
          return;
        }

        _alert('提示', '删除公海客户将同时删除该客户关联的商机和合同，清空联系人和拜访记录，操作不可恢复。确认删除吗？',
          () => {
            deleteTerritorialSea({
                ids: clientIds,
                isAssignStatus: this.isAssignStatus //是否分配状态，false待分配
              })
              .then(res => {
                if (res.code == '0') {
                  top_alert('删除成功', true, 1000);
                  this.getList();
                  this.$refs.territorialSeaDetail.$refs.detailBlock.close()
                } else {
                  top_alert(res.desc, false, 1000);
                }
                this.clickDetail = false
              })
              .catch(err => {
                _alert('提示', '网络错误');
              });
          }, '确定', true
        );
      },

      //点击待分配或已分配
      selectAssign(val) {
        if (val == '1') {
          this.isAssignStatus = false
          this.isShowAssignButton = true
        } else {
          this.isAssignStatus = true
          this.isShowAssignButton = false
        }

        this.searchForm.clientStatus = val

        this.pageChage('1', '10')
        // this.resetPage()
        // this.getList()
      },

      //获取日期组件数据，开始和结束时间
      getStartEndTime(newVal, oldVal) {
        const StartDate = new Date(newVal[0])
        const startTime = `${StartDate.getFullYear()}-${StartDate.getMonth() +
          1}-${StartDate.getDate()}`
        const endDate = new Date(newVal[1])
        const endTime = `${endDate.getFullYear()}-${endDate.getMonth() +
          1}-${endDate.getDate()}`
        return {
          startTime,
          endTime
        }
      },

      //详情里更多操作按钮回调
      moreOperateKey(key) {
        this.clickDetail = true
        // this.$refs.territorialSeaDetail.close()

        const func = {
          assign: this.assignTerritorialSea,
          change: this.changeTerritorialSea,
          frozen: this.frozenTerritorialSea,
          scrap: this.scrapTerritorialSea,
          delete: this.deleteTerritorialSea,
          recovery: this.recoveryTerritorialSea,
        }

        func[key]()
      },

      //打开编辑页面
      openEdit(id) {
        document.body.style.overflow = 'visible';
        this.$router.push({
          path: 'operate',
          query: {
            clientId: id
          }
        })
      }
    },
    watch: {
      // 日期组件值变化时 将其拆分出 开始日期 和 结束日期 并赋值到高级搜索中的对应字段
      createTime(newVal, oldVal) {
        if (newVal.length != 0) {
          let {
            startTime,
            endTime
          } = this.getStartEndTime(newVal, oldVal)

          this.searchForm.startTime = `${startTime} 00:00:00`
          this.searchForm.endTime = `${endTime} 23:59:59`
        }
      },
      updateTime(newVal, oldVal) {
        if (newVal.length != 0) {
          let {
            startTime,
            endTime
          } = this.getStartEndTime(newVal, oldVal)

          this.searchForm.startUpdateTime = `${startTime} 00:00:00`
          this.searchForm.endUpdateTime = `${endTime} 23:59:59`
        }

      }
    }
  }

</script>
<style lang="scss" scoped>
  .poolSea .wrap {
    z-index: 1;
  }

  .top_bar {
    display: flex;
    justify-content: space-between;
  }
  .lef_bar{
    /deep/ .qwui-button-default{
      color: #808080;
    }
  }

  .top-tool--add {
    margin-right: 6px;
  }

  .right_bar {
    display: flex;
  }

  .search_items:first-child {
    margin-bottom: 14px;
  }

  .search-input-width-284 {
    width: 284px;
  }

  .box_wrap.inline_box {
    margin-top: 0;
  }

  .date-block {
    width: 284px;
  }

  .date-picker-width {
    min-width: 284px;
  }

  .date-range {
    display: inline-block;
    margin: 0 2px;
  }
  .date-picker-width{
    /deep/ input {
      border: 1px solid #ccc;
      height: 32px;
    }
  }
  .competitorPickPerson{
    /deep/ .qwui-click_choose {
      box-sizing: border-box;
      max-width: 720px;
      max-height: 88px;
      min-width: 284px;
      min-height: 32px;
      width: auto;
      height: auto;
      padding-top: 2px;
      padding-bottom: 0;
    }
    /deep/ .qwui-click_choose_word {
      line-height: 28px;
    }
    /deep/ .qwui-dept_selected {
      margin: 0px 5px 2px 0;
    }
  }
  .topStatusFilter {
    margin-top: 10px;
    color: #808080;
  }

  .topStatusFilter .active {
    color: #f87b00;
  }

  .topStatusFilter span {
    margin-right: 24px;
    cursor: pointer;
  }

  .tipBtn {
    position: relative;
    display: inline-block;
  }

  .tipBtn .tipsItem {
    position: absolute;
    top: 40px;
    left: -35px;
    width: 240px;
    min-height: 20px;
    padding: 10px;
    text-align: left;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.7);
    box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
  }

  .tipBtn .tipsItem:before {
    content: "";
    position: absolute;
    left: 60px;
    top: -16px;
    border-style: solid;
    border-width: 8px;
    border-color: transparent transparent rgba(0, 0, 0, 0.7) transparent;
    font-size: 20px;
  }

  .tipBtn .tipsContent {
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    max-height: 350px;
    overflow-y: auto;
    color: #fff;
  }

  .btn-open {
    display: inline-block;
    width: 122px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #C31725;
    font-size: 16px;
    border: 1px #C31725 solid;
    border-radius: 23px;
    cursor: pointer;
  }

  .recycleBin {
    display: inline-block;
    margin-left: 10px;
    color: #F87B00;
    cursor: pointer;
  }

  .recycleBin i {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 3px;
    background: url('~assets/images/recycle@2x.png') no-repeat;
    background-size: 100%;
    vertical-align: middle;
  }

  .mr8 {
    margin-right: 8px;
  }

  .ml8 {
    margin-left: 8px;
  }

</style>
<style>
  .poolSea .seaPerson_modal .qw-mask {
    z-index: 2 !important;
  }

</style>
