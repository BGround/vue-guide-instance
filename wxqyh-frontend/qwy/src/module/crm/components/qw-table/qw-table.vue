<!--
    此表格组件只作为内部表格使用，有单选功能，与列表表格不同。
-->
<!--
    @param cols：列数组信息 array
    @param tableData：数据 array
    @param rowClass（可选择是否传入）：回调函数 暴露了每一行的index和每一行的数据 父组件可以通过此回调选择哪一行拥有特殊样式

    用法：

    1、普通用法
    <crm-table :cols="headerData" :tableData="tableData"></crm-table>

    data() {
      return {
        headerData: [
                {
                    name: '阶段',     // 列名
                    key: 'status',    // 列的key值
                    width: '106px'    // 列的宽度

                },
                {
                    name: '销售金额（万元）',
                    key: 'money',
                    className: 'column_money',
                    width: '123px'

                },
                {
                    name: '占比',
                    key: 'percent',
                    className: 'column_percent',
                    width:'117px'
                }
            ],
            tableData: [
                {
                    status: '初步交流',  //key值必须与cols中key的vualue一致
                    money: '10.12',
                    percent: '15.00%',

                },
                {
                    status: '需求沟通',
                    money: '6.85',
                    percent: '15.00%'
                },
                {
                    status: '商务沟通',
                    money: '20',
                    percent: '15.00%',
                },
                {
                    status: '签约交款',
                    money: '13',
                    percent: '15.00%',
                },
                {
                    status: '商务失败',
                    money: '2.69',
                    percent: '15.00%'
                }
            ]
      }
    }

    2、修改一整列数据的样式
    data() {
      return {
        headerData: [
          {
            name: '销售金额（万元）',
            key: 'money',
            className: 'column_money',  // class值
            width: '123px'
          },
        ]
      }
    }
    通过传入这一列的类名，修改此列的样式


    3、修改一行数据的样式
    <crm-table :cols="headerData" :tableData="tableData" :rowClass="dealRowClass" @rowClick="dealRow">

    methods: {
      dealRowClass(row, index) {
        if (index === 3) {
          return 'row_error'
        }
      }
    }

    4、修改某一个具体的格子的样式
    <crm-table :cols="headerData" :tableData="tableData"></crm-table>

     tableData: [
        // 每一行的数据
        {
          status: '初步交流',
          money: '10.12',
          percent: '15.00%',
          cellClassName: {
            money: 'money_over'   // key值为money那一列的类名
          }
        },
      ]

      5、点击每行表格
      <crm-table :cols="headerData" :tableData="tableData" @rowClick="dealRowClick"></crm-table>

      methods: {
        dealRowClick(index) {
          console.log(index)  // 获取每行的下标
          
        }
      }

-->

<template>
  <div class="tableContent">
    <table :style="tableStyle"
           cellspacing="0"
           cellpadding="0">
      <colgroup>
        <col v-for="(col, colIndex) in cols"
             :key="colIndex"
             :width="setColWidth(col)">
      </colgroup>
      <thead>
        <tr>
          <th v-for="col in cols"
              :key="col.key">
            <qw-checkbox v-if="col.type === 'checkbox'"
                         class="header_checkbox"
                         v-model="selectAll"></qw-checkbox>
            {{col.name}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data"
            :key="index"
            :class="dealRowClass(row, index)"
            @click="dealRowClick(row)">
          <td v-for="col in cols"
              :key="col.type"
              :class="alignCls(col, row)">
            <slot :row="row"
                  :col="col">

              <crm-radio v-if="col.type === 'radio'"
                         class="user_radio"
                         v-model="selectIndex"
                         :option="row._index"
                         :hasLabel="hasLabel"></crm-radio>
              <qw-checkbox v-if="col.type === 'checkbox'"
                           class="user_checkbox"
                           v-model="row.checked"
                           :label="row._index"
                           @change="dealChangeCheckbox"></qw-checkbox>

              <label>{{row[col.key]}}</label>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="nodata"
         v-show="data.length === 0">
      <slot name="nodata">
        <i class="icon_nodata"></i>
        <p>暂无数据</p>
      </slot>
    </div>
  </div>
</template>

<script>
import CrmRadio from "@/module/crm/components/crm-radio/crmRadio";
import QwCheckbox from "components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
const EVENT_CHANGE = "onChange";
export default {
  components: {
    CrmRadio,
    QwCheckbox
  },
  model: {
    prop: "defaultIndex",
    event: EVENT_CHANGE
  },
  props: {
    cols: {
      type: Array,
      default: null
    },
    tableData: {
      type: Array,
      default: null
    },
    rowClass: {
      type: Function,
      default() {
        return "";
      }
    },
    position: {
      type: String,
      default: "left"
    },
    defaultIndex: {
      type: [Number, Array]
    },
    type: {
      type: String
    }
  },
  mounted() {
    console.log("mouted", this.tableData);
    this.data = JSON.parse(JSON.stringify(this.tableData));
    // this.selectOption();
  },
  data() {
    return {
      selectIndex: this.defaultIndex,
      hasLabel: false,
      selectAll: false,
      data: []
    };
  },
  computed: {
    // data() {
    //   return JSON.parse(JSON.stringify(this.tableData));
    // },
    tableStyle() {
      let tableStyle = {
        "text-align": this.position
      };
      return tableStyle;
    }
  },
  methods: {
    // 修改具体某个格子的类名
    alignCls(col, row = {}) {
      let cellClassName = "";
      if (row.cellClassName && col.key && row.cellClassName[col.key]) {
        cellClassName = row.cellClassName[col.key];
      }
      return [
        {
          [`${cellClassName}`]: cellClassName,
          [`${col.className}`]: col.className
        }
      ];
    },
    // 修改某一行数据的类名
    dealRowClass(_row, _index) {
      return this.rowClass(_row, _index);
    },
    dealRowClick(row) {
      this.$emit("rowClick", row.status, row);
    },
    setColWidth(col) {
      let width = "";
      if (col.width) {
        width = col.width;
      }
      return width;
    },
    handleClick(val) {
      this.$emit("tabClick", val);
    },
    selectAllCheckbox(isSelectAll) {
      this.selectAll = isSelectAll;
    },
    dealChangeCheckbox(oo, xx) {}
    // 选中默认值
    // selectOption() {
    //   if (this.selectIndex && this.type === "checkbox") {
    //     this.selectIndex.forEach((item, index) => {
    //       let data = this.data[item];
    //       data["checked"] = true;
    //     });
    //   }
    // }
  },
  watch: {
    data(list) {
      this.data.forEach((value, index) => {
        this.$set(value, "_index", index);
        if (!value.checked || value.checked == undefined) {
          this.$set(value, "checked", false);
        }
      });
    },
    selectIndex(newV) {
      this.$emit(EVENT_CHANGE, newV);
    },
    defaultIndex(newV) {
      this.selectIndex = newV;
    },
    selectAll(newV) {
      let data = this.data;
      data.forEach((item, index) => {
        item["checked"] = newV;
      });
    },
    tableData(newV) {
      console.log(111);
      this.data = JSON.parse(JSON.stringify(newV));
    }
  }
};
</script>
<style lang='scss' scoped>
table {
  width: 100%;
  font-size: 14px;
  text-align: center;
  border: 1px solid #f0f0f0;
  border-collapse: collapse;
  thead {
    background-color: #f7f7fa;
    tr {
      line-height: 50px;
      th {
        padding: 0 12px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  tbody {
    tr {
      line-height: 50px;
      td {
        padding: 0 12px;
        border-left: 1px solid #f5f5f5;
        position: relative;
        label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .user_radio {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user_checkbox {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
  tr {
    border-bottom: 1px solid #f5f5f5;
  }
}
.tableContent .nodata {
  text-align: center;
  min-height: 200px;
  padding-top: 70px;
  .icon_nodata {
    display: block;
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: url("~assets/images/form_noData.png") no-repeat;
  }
  p {
    color: #999;
    font-size: 16px;
  }
}
</style>
