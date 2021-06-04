<template>
  <div>
    <qw-modal
      :show="show"
      :showClose="true"
      :hideOnBlur="false"
      :width="800"
      :height="546"
      :title="title"
      @change="close"
      @on-confirm="confirm"
    >
      <div class="sea-container">
        <div class="header">
          <qwui-input
            class="search"
            inputType="search"
            @search="searchData"
            v-model="keyWord"
            :inputTips="placeholder"
          ></qwui-input>
        </div>
        <div class="content">
          <!-- 表格 -->
          <qw-table :cols="headerData" :tableData="tableData" v-model="selectIndex"></qw-table>
          <!--分页-->
          <qwPage :pageData="pageData" @change="pageChage"></qwPage>
        </div>
      </div>
    </qw-modal>
  </div>
</template>

<script>
import qwuiInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import qwPage from "@/components/list/page";
import qwModal from "crm/components/qwModal";
import qwTable from "crm/components/qw-table/qw-table";
import noData from "@/components/list/noData";
import { visitOutworkList } from "@/module/crm/api/visit";

export default {
  components: {
    qwuiInput,
    qwPage,
    qwModal,
    qwTable,
    noData
  },
  props: {
    show: { //是否显示弹窗
      type: Boolean,
      default: false
    },
    isDel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: "选择所属外勤单",
      placeholder: "搜索外勤工单",
      selectIndex: null,//索引
      headerData: [//表格头数据配置
        {
          type: "radio",
          width: "56px"
        },
        {
          name: "外勤标题",
          key: "title",
          className: "column_money",
          width: "246px"
        },
        {
          name: "外勤地址",
          key: "address",
          className: "column_percent",
          width: "246px"
        }
      ],
      tableData: [],//表格数据
      listData: [],//获取的列表数据
      pageData: {
        //分页组件参数
        page: 1,
        pageSize: 10,
        maxPage: 1,
        totalRows: ""
      },
      keyWord: "",//搜索关键字
    };
  },
  created() {
    this.getList();
  },
  watch: {
    isDel(val, oldVal) { //监听父组件是否删除标签来重置索引
      if (val) {
        this.selectIndex = null;
      }
    },
  },
  methods: {
    // 获取列表
    getList() {
      let obj = {
        page: this.pageData.page,
        keyWord: this.keyWord
      };
      visitOutworkList(obj)
        .then(res => {
          if (res.code == 0) {
            if (res.data.pageData) {
              this.listData = res.data.pageData;
              this.tableData = [];
              this.listData.map(item => {
                let obj = {
                  title: item.outworkTitle,
                  address: item.address
                };
                this.tableData.push(obj);
              });
            } else {
              this.tableData = [];
            }
            this.pageData.maxPage = res.data.maxPage;
            this.pageData.totalRows = res.data.totalRows;
          }
        })
        .catch(err => {
          dataBase.alert("提示", "网络错误");
        });
    },

    // 搜索
    searchData() {
      this.getList();
    },

    //分页
    pageChage: function(page, pageSize) {
      this.pageData.page = page;
      this.pageData.pageSize = pageSize;
      this.selectIndex = null;//清空索引
      this.getList();
    },

    //关闭
    close() {
      this.$emit("on-close");
    },

    //确定
    confirm() {
      if (this.selectIndex != null) {
        let obj = {
          id: this.listData[this.selectIndex].id,
          name: this.listData[this.selectIndex].outworkTitle,
          index: this.selectIndex
        };
        this.$emit("on-confirm", obj);
      } else {
        dataBase.alert("提示", "请选择所属外勤单");
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.sea-container{
  .header {
    margin: 20px 0;
    width: 100%;
    overflow: hidden;
    .search {
      float: right;
      margin-right: 28px;
    }
  }
  .content {
    margin: 0 28px;
  }
  /deep/ .qw-modal {
    .qw-dialog-box {
      z-index: 99 !important;
    }
    .qw-mask {
      z-index: 98 !important;
    }
  }
}

</style>