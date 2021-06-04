<template>
  <div class="mt25">
    <!-- 顶部搜索 -->
    <div class="top_bar">
      <!-- 顶部 左边 快捷按钮 -->
      <div class="lef_bar">
        <template v-if="!isShowTransAndDelete">
          <span v-perm="'outsideImport'">
            <qw-button @click="()=>showImport=true"
                       class="mr8">导入</qw-button>
          </span>
        </template>
        <template v-else>
          <qw-button @click="transferVisit"
                     class="mr8">转移</qw-button>
          <span v-perm="'outsideDel'">
            <qw-button @click="deleterVisit"
                       class="mr8">删除</qw-button>
          </span>
          <span v-perm="'clientEdit'">
            <qw-button @click="snycVisit"
                       class="mr8">同步负责人和相关人</qw-button>
          </span>
        </template>
        <span v-perm="'outsideImport'">
          <qw-button @click="exportVisit">导出</qw-button>
        </span>
      </div>
      <!-- 顶部 右边 快捷搜索 -->
      <div class="right_bar">
        <qw-input inputType="search"
                  :maxLength="200"
                  v-model="searchForm.clientName"
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
                拜访客户
              </h1>
              <qw-input class="search-input-width-284"
                        inputType="base"
                        v-model="searchForm.clientName"
                        inputTips="请输入"
                        @search="searchData"></qw-input>
            </li>
            <li class="qw-form-item">
              <h1>
                发起人
              </h1>
              <pick-exam class="competitorPickPerson"
                         onlyUser
                         :useTab="functionTabUser"
                         :useDepts="defaultDeptVOList_creator"
                         :useUsers="defaultUserVOList_creator"
                         @chooseDone="chooseDone_creator"
                         :maxUser=1
                         :isShowRadios="false"
                         ref="createPersonsPick">
              </pick-exam>
            </li>
            <li class="qw-form-item">
              <h1>
                标题
              </h1>
              <qw-input class="search-input-width-284"
                        inputType="base"
                        v-model="searchForm.title"
                        inputTips="请输入"
                        @search="searchData"></qw-input>
            </li>
          </ul>
          <ul class="search_items">
            <li class="qw-form-item">
              <h1>
                内容
              </h1>
              <qw-input class="search-input-width-284"
                        inputType="base"
                        v-model="searchForm.content"
                        inputTips="请输入"
                        @search="searchData"></qw-input>
            </li>
            <li class="qw-form-item">
              <h1>
                部门
              </h1>
              <pick-exam class="competitorPickPerson"
                         :useTab="functionTabDept"
                         :useDepts="defaultDeptVOList_correlation"
                         :useUsers="defaultUserVOList_correlation"
                         @chooseDone="chooseDone_correlation"
                         :maxDept=1
                         :isShowRadios="false"
                         ref="toDeptPick">
              </pick-exam>
            </li>
            <li class="qw-form-item">
              <div class="date-block">
                <h1>
                  创建时间
                </h1>
                <date-picker class="date-picker-width"
                             v-model="rangeTime"
                             rangeSeparator="至"
                             :showButtons="true"
                             @confirm="dateConfirm"
                             ref="searchDate"></date-picker>
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
    <!-- 列表 -->
    <div class="mt10">
      <data-table :headData="headData"
                  :dataList="dataList"></data-table>
      <page :pageData="pageSetting"
            @change="pageChage"></page>
    </div>
    <!-- 详情 -->
    <crm-detail type="visit"
                ref="visitDetail"
                :id="detailId"
                :permissionEdit="'outsideEdit'"
                :operateConfig="operateConfig"
                @edit="openEdit"
                @close="visitClose"
                @moreOperate="moreOperateKey"></crm-detail>
    <!-- 导入 -->
    <visit-import v-model="showImport"
                  @import-finish="getList"></visit-import>
    <!-- 导出 -->
    <crm-export v-model="showExport"
                :exportOption='exportOption'
                :exportCount="exportCount"
                @delete-option="dealDeleteOption"
                @on-confirm="onConfirm"
                @change-date="changeDate"></crm-export>
    <!-- 转移 -->
    <visit-transfer :outworkIds="transferIds"
                    modalTitle="转移拜访"
                    :modalZindex="10"
                    @refresh="refresh"
                    ref="visitTransfer"></visit-transfer>
  </div>
</template>

<script>
import qwButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import qwInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import datePicker from "@/components/base/VueDatepickerLocal";
import PickExam from "@/components/pickPerson/pickExam";
import dataTable from "@/components/list/dataTable";
import page from "@/components/list/page";
import crmDetail from "@/module/crm/components/crm-detail/crmDetail";
import VisitImport from "./import";
import crmExport from "@/module/crm/components/crm-export"
import visitTransfer from './transfer'
import { getSearchList, deleterVisit, snycVisit, checkReport, createReportTask, } from "@/module/crm/api/visit";
import { checkExport, exportReport } from '@/module/crm/utils/export'

const MAX_EXPORT_COUNT = 100000   // 最大导出条数

export default {
  name: "visitList",
  components: {
    qwButton,
    qwInput,
    datePicker,
    PickExam,
    dataTable,
    page,
    crmDetail,
    VisitImport,
    crmExport,
    visitTransfer
  },
  data () {
    return {
      isShowTransAndDelete: false, //是否显示转移，删除，同步负责人
      showImport: false, //显示导入弹窗
      showExport: false, //显示导出弹窗
      exportCount: 0, // 勾选中的条数，导出
      exportOption: [
        {
          title: '创建时间',
          type: 'datePicker',
          value: []
        }
      ],
      exportData: {},//导出时请求参数
      delExportOption: [],//点击删除复制原来的exportOption数据
      deleteOptionKey: [],//保存导出删除的键值
      // 搜索框 表单
      searchForm: {
        clientName: "", //客户名称
        userId: "", //发起人
        personName: "", //发起人名字
        title: "", //标题
        content: "", //内容
        deptName: "", //部门
        startTimes: "", //创建开始时间
        endTime: "", //创建结束时间
      },
      rangeTime: [], // 时间选择器值
      isShowFilter: false, // 高级 按钮点击样式
      // 选人组件 标签
      functionTabUser: [
        {
          text: "标签人员"
        },
        {
          text: "特定人员"
        }
      ],
      //选部门
      functionTabDept: [
        {
          text: "部门"
        }
      ],
      //  ...Dept 选人组件 默认部门
      //  ...User 选人组件 默认用户
      defaultDeptVOList_creator: [],
      defaultUserVOList_creator: [],
      deptList_creator: [],
      userList_creator: [],
      defaultDeptVOList_correlation: [],
      defaultUserVOList_correlation: [],
      deptList_correlation: [],
      userList_correlation: [],
      //  页表数据头
      headData: {
        left: {
          checkFunc: (checkAll, checkList) => {
            let arr = [];
            let notCheckNum = 0;
            checkList.map(item => {
              item.isChecked ? arr.push(item.id) : notCheckNum++;
            });

            this.isShowTransAndDelete = !!(checkList.length - notCheckNum);
            this.ids = arr.join(",");
          }
        },
        middle: [
          {
            title: "拜访客户",
            key: "clientName",
            width: 222,
            skip: {
              skipFunc: id => {
                // 打开详情
                this.detailId = id;
                this.$refs.visitDetail.showDetail();
                this.clickDetail = true;
              }
            }
          },
          {
            title: "拜访标题",
            key: "outworkTitle",
            width: 100
          },
          {
            title: "发起人",
            key: "personName",
            width: 80
          },
          {
            title: "拜访地址",
            key: "address",
            width: 80
          },
          {
            title: "状态",
            key: "status",
            width: 80
          },
          {
            title: "创建时间",
            key: "createTime",
            width: 160
          },
          {
            title: "更新时间",
            key: "updateTime",
            width: 160
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
        maxPage: "",
        totalRows: "",
        page: "1",
        pageSize: 10
      },
      ids: "", // 勾选中的id
      detailId: "", //详情id
      //详情更多操作配置
      operateConfig: [
        {
          key: "transfer",
          name: "转移"
        },
        {
          key: "snyc",
          name: "同步"
        },
        {
          key: "delete",
          name: "删除",
          permission: "outsideDel"
        }
      ],
      clickDetail: false, //是否点击详情里的删除功能按钮
      transferIds: '',//轉移負責人的id
    };
  },
  created () {
    //初始化导出时间为最近一个月
    this.handleTime()
    this.getList();
  },
  methods: {
    // 搜索框回调函数 获取表格数据 只根据客户名称进行搜索
    searchData () {
      this.getList();
    },

    //高级搜索确定回调
    // 获取列表数据 包括 高级搜素中的关键词
    getList () {
      let obj = {
        "searchValue.clientName": this.searchForm.clientName,
        "searchValue.userId": this.searchForm.userId,
        "searchValue.title": this.searchForm.title,
        "searchValue.content": this.searchForm.content,
        "searchValue.deptName": this.searchForm.deptName,
        "searchValue.startTimes": this.searchForm.startTimes,
        "searchValue.endTime": this.searchForm.endTime,
        page: this.pageSetting.page,
        pageSize: this.pageSetting.pageSize
      };
      getSearchList(obj)
        .then(res => {
          if (res.code == "0") {
            // this.dataList = this.filterListData(res.data.pageData) || [];
            this.dataList = res.data.pageData || [];
            this.pageSetting.totalRows = res.data.totalRows;
            this.pageSetting.maxPage = res.data.maxPage;
            this.pageSetting.page = res.data.currPage;

            //重置导入，导出
            this.isShowTransAndDelete = false;

            this.setExportData()
          } else {
            dataBase.alert("提示", res.desc);
          }
        })
        .catch(err => {
          dataBase.alert("提示", "网络错误");
        });
    },

    // 页码组件回调函数
    pageChage (page, pageSize) {
      this.pageSetting.pageSize = pageSize;
      this.pageSetting.page = page;
      this.getList();
    },

    // 清空 高级搜索
    clearSearch () {
      this.$refs.toDeptPick.clearUsers();
      this.$refs.toDeptPick.clearDepts();
      this.$refs.createPersonsPick.clearUsers();
      this.$refs.createPersonsPick.clearDepts();

      this.rangeTime = [];

      this.searchForm = {
        // 搜索框 表单
        clientName: "", //客户名称
        userId: "", //发起人
        title: "", //标题
        content: "", //内容
        deptName: "", //部门
        startTimes: "", //创建开始时间
        endTime: "" //创建结束时间
      };
    },

    //切换显示高级搜索
    toggleFilter () {
      this.isShowFilter = !this.isShowFilter;
    },

    //高级搜索选人返回值
    chooseDone (dept, tag, user) {
      let userResult = [];
      let deptResult = [];
      let personName = [];
      user.map(item => {
        userResult.push(item.userId);
        personName.push(item.personName);
      });
      dept.map(item => {
        deptResult.push(item.nodeName);
      });
      return {
        userResult,
        personName,
        deptResult,
      };
    },

    // 发起人 选人组件回调
    chooseDone_creator (dept, tag, user) {
      let { userResult, personName } = this.chooseDone(dept, tag, user);

      this.searchForm.userId = userResult.join(",");
      this.searchForm.personName = personName.join(",");
    },

    // 部门 选人组件回调
    chooseDone_correlation (dept, tag, user) {
      let { userResult, deptResult } = this.chooseDone(dept, tag, user);

      this.searchForm.deptName = deptResult.join(",");
    },

    // 日期组件 确定 按钮回调函数
    dateConfirm (val) {
      this.$refs.searchDate.ok();
    },

    //重置导出组件的高级搜索和搜索导出参数数据
    setExportData () {
      const options = {
        clientName: '拜访客户',
        personName: '发起人',
        title: '标题',
        content: '内容',
        deptName: '部门',
      }

      let optionList = []
      Object.keys(options).map(item => {
        if (this.searchForm[item]) {
          let data = {
            title: options[item],
            type: 'text',
            value: this.searchForm[item],
            key: item
          }

          optionList.push(data)
        }
      })
      this.exportOption = this.exportOption.splice(0, 1).concat(optionList)
      //设置导出时请求参数
      if (this.searchForm.startTimes) {
        this.exportOption[0].value = [this.searchForm.startTimes, this.searchForm.endTime]
      }

      this.exportData = {
        "searchValue.id": '',
        "searchValue.clientName": this.searchForm.clientName,
        "searchValue.userId": this.searchForm.userId,
        "searchValue.title": this.searchForm.title,
        "searchValue.content": this.searchForm.content,
        "searchValue.deptName": this.searchForm.deptName,
        "searchValue.startTimes": this.exportOption[0].value[0],
        "searchValue.endTime": this.exportOption[0].value[1],
        "reportType": 'crm_outsidework',
      }
    },

    //导出
    exportVisit () {
      //如果没有选择某几条数据，则弹出导出弹框；否则直接调导出接口
      if (!this.ids) {
        this.showExport = !this.showExport;
      } else {
        this.onConfirm()
      }
    },

    // 设置最近一个月时间处理
    handleTime () {
      let endTime = (new Date()).Format("yyyy-M-d");
      let startTime = new Date((new Date()- 1000 * 60 * 60 * 24 * 30)).Format("yyyy-M-d");
      this.exportOption[0].value = [`${startTime} 00:00:00`, `${endTime} 23:59:59`];
    },

    //选择时间的回调
    changeDate (startTime, endTime) {
      this.exportOption[0].value = [`${startTime} 00:00:00`, `${endTime} 23:59:59`]

      this.exportData['searchValue.startTimes'] = `${startTime} 00:00:00`
      this.exportData['searchValue.endTime'] = `${endTime} 23:59:59`

    },

    // 删除导出条件
    dealDeleteOption (key) {
      this.exportOption = this.exportOption.filter(item => {
        return item.key != key
      })
      this.deleteOptionKey.push(key)
    },

    // 导出确认按钮
    onConfirm () {
      let obj = {
        "searchValue.id": this.ids
      }
      this.exportData = Object.assign({}, this.exportData, obj)

      if (this.showExport) {
        if (this.deleteOptionKey.length) {
          //删除导出后的数据置空
          for (let v in this.deleteOptionKey) {
            this.exportData[`searchValue.${this.deleteOptionKey[v]}`] = ''
          }
          this.deleteOptionKey = []
          this.delExportOption = this.exportOption
        }
        getSearchList(this.exportData)
          .then(res => {
            if (res.code == "0") {
              if (res.data.totalRows) {
                if (res.data.totalRows > MAX_EXPORT_COUNT) {
                  dataBase.alert("提示", '数据量超出限制,建议这样做 1.缩短创建时间或增加筛选条件，以减少本次导出的数据量 2.分批导出，每次控制在10w条以内');
                  return;
                } else {
                  this._checkExport()
                }
              } else {
                dataBase.alert('提示', '搜索结果为空，不支持导出')
                return
              }
            } else {
              dataBase.alert("提示", res.desc);
            }
          })
      } else {
        this._checkExport()
      }
    },

    //调用导出接口
    _checkExport () {
      checkExport(checkReport, this.exportData).then(res => {
        if (res.code == '0') {
          exportReport(createReportTask, this.exportData)
        } else {
          _.alert('提示', res.desc)
        }
      });
    },

    //打开转移拜访
    transferVisit () {
      this.transferIds = this.clickDetail ? this.detailId : this.ids;
      if (!this.transferIds) {
        dataBase.alert("提示", "请选择要转移的数据");
        return;
      }
      this.$refs.visitTransfer.openDialog();
    },

    //轉移負責人回調
    refresh () {
      this.getList();
      this.$refs.visitDetail.$refs.detailBlock.close();
    },

    //同步负责人和相关人
    snycVisit () {
      let outworkIds = this.clickDetail ? this.detailId : this.ids;
      if (!outworkIds) {
        dataBase.alert("提示", "请选择要同步的数据");
        return;
      } else {
        dataBase.alert(
          "提示",
          "将拜访的负责人、相关人同步为所属客户的负责人、相关人一致，同步后不可恢复，是否确认同步？",
          () => {
            snycVisit({
              outsideworkinfoIds: outworkIds
            })
              .then(res => {
                if (res.code == "0") {
                  dataBase.top_alert("同步成功", true, 1000);
                  this.getList();
                  this.$refs.visitDetail.$refs.detailBlock.close();
                } else {
                  dataBase.alert("提示", res.desc);
                }
              })
              .catch(err => {
                dataBase.alert("提示", "网络错误");
              });
          },
          "确定",
          true
        );
      }
    },

    //删除
    deleterVisit () {
      let outworkIds = this.clickDetail ? this.detailId : this.ids;
      if (!outworkIds) {
        dataBase.alert("提示", "请选择要删除的数据");
        return;
      } else {
        dataBase.alert(
          "提示",
          "删除数据后将无法恢复，确认要删除吗？",
          () => {
            deleterVisit({
              ids: outworkIds
            })
              .then(res => {
                if (res.code == "0") {
                  dataBase.top_alert("删除成功", true, 1000);
                  this.getList();
                  this.$refs.visitDetail.$refs.detailBlock.close();
                } else {
                  dataBase.alert("提示", res.desc);
                }
              })
              .catch(err => {
                dataBase.alert("提示", "网络错误");
              });
          },
          "确定",
          true
        );
      }
    },

    //打开编辑页面
    openEdit (id) {
      document.body.style.overflow = "visible";
      this.$router.push({
        path: "edit",
        query: {
          outworkIds: id
        }
      });
    },

    //详情里更多操作按钮回调
    moreOperateKey (key) {
      const func = {
        transfer: this.transferVisit,
        snyc: this.snycVisit,
        delete: this.deleterVisit
      };

      func[key]();
    },

    //详情关闭回调
    visitClose () {
      this.clickDetail = false;
    },

    //获取日期组件数据，开始和结束时间
    getStartEndTime (newVal, oldVal) {
      const StartDate = new Date(newVal[0]);
      const startTime = `${StartDate.getFullYear()}-${StartDate.getMonth() +
        1}-${StartDate.getDate()}`;
      const endDate = new Date(newVal[1]);
      const endTime = `${endDate.getFullYear()}-${endDate.getMonth() +
        1}-${endDate.getDate()}`;
      return {
        startTime,
        endTime
      };
    }
  },
  watch: {
    // 日期组件值变化时 将其拆分出 开始日期 和 结束日期 并赋值到高级搜索中的对应字段
    rangeTime (newVal, oldVal) {
      if (newVal.length != 0) {
        let { startTime, endTime } = this.getStartEndTime(newVal, oldVal);

        this.searchForm.startTimes = `${startTime} 00:00:00`;
        this.searchForm.endTime = `${endTime} 23:59:59`;
      }
    },
    //监听showExport变化，因为exportOption在组件内部有做删除，外部没有变化，导致组件内监听不到
    //组件内外数据一致
    showExport (newVal) {
      //导出弹框打开时
      if (newVal) {
        this.delExportOption = this.exportOption
      } else {
        this.exportOption = this.delExportOption
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.top_bar {
  display: flex;
  justify-content: space-between;
}
.lef_bar{
  /deep/ .qwui-button-default{
    color: #808080;
  }
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
.mr8 {
  margin-right: 8px;
}
</style>
