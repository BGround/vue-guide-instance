<template>
  <div class="seaPerson_modal">
    <qw-modal v-model="visible"
              :title="title"
              @on-confirm="onConfirm"
              @on-hide="onHide"
              :width="modalWidth"
              :zIndex="2">
      <div class="modal-container">
        <div class="header">
          <span class="header-text" v-if="poolData.length < 2">所在公海：{{seaName}}</span>
          <span class="header-text" v-else>所在公海：
            <qwui-select class="pool-select" @selectItem="selectItem" :dataList="poolData" placeholder="" ref="selectPool"></qwui-select>
          </span>

          <qw-single-select class="header-input"
                            @search="dealSearch"
                            ref="singleSelect"></qw-single-select>
        </div>
        <div class="content">
          <qw-table class="table"
                    :cols="tableHeader"
                    :tableData="tableData"
                    v-model="selectIndex">
            <template slot-scope="{row, col}"
                      v-if="col.key === 'personNameGroup' ">

              <label class="table-cell">
                <i class="default-head-pic"
                   v-if="row.personNameGroup.personImage == 0"></i>
                <img v-else
                     :src="row.personNameGroup.personImage"
                     width="20px"
                     height="20px">
                <span class="personName">{{row.personNameGroup.personName}}</span>
              </label>
            </template>

          </qw-table>
          <qw-page :pageData="pageInfo"
                   @change="dealPagerChange"></qw-page>
        </div>

      </div>
    </qw-modal>
  </div>
</template>

<script>
  import QwModal from "@/module/crm/components/qwModal";
  import QwInput from "components/qwuiBase/qwuiInput/qwuiInput";
  import QwSingleSelect from "@/module/crm/components/qwui-selectSinglePerson";
  import QwTable from "@/module/crm/components/qw-table/qw-table";
  import QwPage from "@/components/list/page.vue";
  import {
    getPoolMember
  } from "@/module/crm/api/territorialSea";
  import qwuiSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect'

  const CLOSE_MODAL_EVENT = "close";
  const MODAL_WIDTH = 800;
  const SUCCESS_CODE = "0";
  const EVENT_CONFIRM = "onConfirm";
  const EVENT_HIDE = 'onHide'
  export default {
    components: {
      QwModal,
      QwTable,
      QwPage,
      QwSingleSelect,
      qwuiSelect
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      seaName: {
        type: String
      },
      seaId: {
        type: String,
        default: ""
      },
      poolData: {
        type: Array,
        default: () => {}
      }
    },
    created() {},
    data() {
      return {
        title: "选择公海成员",
        modalWidth: MODAL_WIDTH,
        searchValue: "",
        tableHeader: [{
            type: "radio",
            width: "56px"
          },
          {
            name: "名称",
            key: "personNameGroup",
            width: "345px"
          },
          {
            name: "客户数",
            key: "clientNum",
            width: "345px"
          }
        ],
        tableData: [],
        pageSize: 10,
        page: 1,
        pageInfo: {},
        selectIndex: null, // 表格单选选中的下标值
        pageData: [],
        userId: "",
        currentSeaId: this.seaId //选择select后的公海id
      };
    },
    computed: {
      visible: {
        get() {
          if (this.poolData.length > 1 && this.value) {
            this.$refs.selectPool&&this.$refs.selectPool.setValue(this.seaId)
          }
          return this.value;
        },
        set(newV) {
          this.$emit("input", newV);
        }
      }
    },
    methods: {
      //公海池select列表回调
      selectItem(optionName, val) {
        this.currentSeaId = val

        this.selectIndex = null;
        this._getPoolMember(val);
      },
      initData() {
        this.page = 1;
        this.pageSize = 10;
        this.userId = "";
        this.$refs.singleSelect.init();
        this.selectIndex = null;
      },
      onConfirm() {
        if (this.selectIndex === null) {
          _.alert("提示", "请选择一个公海成员");
        } else {
          this.$emit(EVENT_CONFIRM, this.pageData[this.selectIndex], this.currentSeaId || this.seaId);
          // 关闭弹窗
          this.visible = false;
          this.initData();
          this._getPoolMember();
        }
      },
      onHide() {
        this.initData();
        this._getPoolMember();
        this.$emit(EVENT_HIDE)
      },
      _getPoolMember(seaId) {
        let data = {
          page: this.page,
          pageSize: this.pageSize,
          poolId: seaId ? seaId : this.seaId,
          userId: this.userId
        };
        getPoolMember(data).then(res => {
          if (res.code === SUCCESS_CODE) {
            // 表格赋值
            let pageData = res.data.pageData;
            this.pageData = res.data.pageData;
            let data = res.data;
            let tableData = [];
            if (pageData) {
              pageData.forEach(item => {
                let personNameGroup = {
                  personName: item.personName,
                  personImage: item.headPic
                };
                let data = {
                  personNameGroup: personNameGroup,
                  clientNum: item.clientNum
                };
                tableData.push(data);
              });
              this.tableData = tableData;
            } else {
              this.tableData = [];
            }

            // 分页器属性赋值
            let pageInfo = {
              page: data.currPage,
              pageSize: this.pageSize,
              maxPage: data.maxPage,
              totalRows: data.totalRows
            };
            this.pageInfo = pageInfo;
          } else {
            _.alert("提示", res.desc);
          }
        });
      },
      dealPagerChange(page, pageSize) {
        // 当换页时置空当前选中下标
        if (this.page != page) {
          this.selectIndex = null;
        }
        this.page = page;
        this.pageSize = pageSize;

        this._getPoolMember();
      },
      dealSearch(searchId) {
        this.userId = searchId;
        this.selectIndex = null;
        this._getPoolMember();
      }
    },
    watch: {
      seaId(newValue) {
        this.selectIndex = null;
        this._getPoolMember();
      }
    }
  };

</script>
<style lang='scss' scoped>
  .modal-container {
    background: #fff;
    min-height: 350px;
    padding: 26px 28px;

    .header {
      text-align: left;
      position: relative;
      height: 32px;
      line-height: 32px;

      .header-text {
        font-size: 14px;
        color: #383838;
      }

      .header-input {
        position: absolute;
        right: 0;
      }

      .pool-select {
        margin-top: 0;
        vertical-align: top;
      }
    }

    .content {
      .table {
        margin-top: 20px;

        .table-cell {
          display: inline-block;
          height: 20px;
          line-height: 20px;
          vertical-align: middle;

          .default-head-pic {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 5px;
            background: url("~assets/images/touxiang02.png") no-repeat;
            background-size: 100%;
          }

          .personName {
            vertical-align: top;
          }
        }
      }
    }
  }

</style>
