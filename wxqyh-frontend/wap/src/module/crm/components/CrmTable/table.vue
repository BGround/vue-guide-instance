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
  <table cellspacing="0" cellpadding="0">
    <colgroup>
      <col v-for="(col, colIndex) in cols" :key="colIndex" :width="setColWidth(col)">
    </colgroup>
    <thead>
      <tr>
        <th v-for="col in cols" :key="col.key">{{col.name}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index" :class="dealRowClass(row, index)" @click="dealRowClick(row)">
        <td v-for="col in cols" :key="col.type" :class="alignCls(col, row)">
          {{row[col.key]}}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
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
      default () {
        return ''
      }
    }
  },
  data () {
    return {
    }
  },
  computed:{
    data(){
      return JSON.parse(JSON.stringify(this.tableData))
    }
  },
  methods: {
    // 修改具体某个格子的类名
    alignCls(col, row = {}) {
      // console.log(col.key)
      let cellClassName = ''
      if (row.cellClassName && col.key && row.cellClassName[col.key]) {
        cellClassName = row.cellClassName[col.key]
      }
      return [
        {
          [`${cellClassName}`]: cellClassName,
          [`${col.className}`]: col.className

        }
      ]
    },
    // 修改某一行数据的类名
    dealRowClass(_row, _index) {
      return this.rowClass(_row, _index)
    },
    dealRowClick (row) {
      this.$emit('rowClick', row.status,row)
    },
    setColWidth(col) {
      let width = ''
      if (col.width) {
        width = col.width
      }
      return width
    },
    handleClick(val){
        this.$emit('tabClick', val)
    }
  },
  watch: {
    data(list) {
      list.forEach((value, index) => {
        this.$set(value, '_index', index)
      })
    }
  }
}

</script>
<style lang='scss'>
table{
  width: 100%;
  font-size: 14px;
  text-align: center;
  border: 1px solid #f5f5f5;
  border-collapse: collapse;
  margin-bottom: 100px;
  thead{
    background-color: #edf1f6;
    tr{
      line-height: 34px;
      th{
        font-weight: 400
      }
    }
  }
  tbody{
    tr{
      line-height: 36px;
      td{
        border-left: 1px solid #f5f5f5
      }
    }
  }
  tr{
    border-bottom: 1px solid #f5f5f5;
  }
}
</style>
