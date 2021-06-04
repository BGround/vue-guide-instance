<template>
  <div class="scroll-table"
    v-on="{ load: setTableShadow, resize: setTableShadow }">
    <div class="main"
      ref="tableScroll"
      v-on:scroll="handleBodyScroll">
      <table cellspacing="0"
        cellpadding="0"
        border="0"
        :style="{width: tableWidth + 'px', minWidth: minWidth+'px'}"
        ref="scrollHead">
        <colgroup>
          <col v-for="(column, index) in columns"
            :width="column.width"
            :key="index">
        </colgroup>
        <thead>
          <tr>
            <th v-for="(column, index) in columns"
              :key="index">
              {{ column.title || '' }}
            </th>
          </tr>
        </thead>
      </table>
      <div class=""
        ref="tableContent"
        v-on:scroll="handleBodyScrollTop">
        <table cellspacing="0"
          cellpadding="0"
          :style="{width: tableWidth + 'px', minWidth: minWidth+'px'}"
          border="0">
          <colgroup>
            <col v-for="(column, index) in columns"
              :width="column.width"
              :key="index">
          </colgroup>
          <tbody class="ivu-table-tbody">
            <tr v-for="(entry, index) in data"
              :key="index">
              <td v-for="(column, cIndex) in columns"
                :class="getColumnClass(column.fixed)"
                :key="cIndex">
                <span>{{entry[column.key]}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div :class="{'table-fixed-left-scroll': hasLeft}"
      :style="{width: firstColumnWidth+ 'px'}"
      class="table-fixed-left">
      <table cellspacing="0"
        cellpadding="0"
        border="0"
        :style="{width: tableWidth + 'px', minWidth: minWidth+'px'}">
        <colgroup>
          <col v-for="(column, index) in columns"
            :key="index"
            :width="column.width">
        </colgroup>
        <thead>
          <tr>
            <th v-for="(column, index) in columns"
              :key="index">
              {{ column.title || '' }}
            </th>
          </tr>
        </thead>
      </table>
      <div ref="fixedBody">
        <table cellspacing="0"
          cellpadding="0"
          border="0"
          :style="{width: tableWidth + 'px', minWidth: minWidth+'px'}">
          <colgroup>
            <col v-for="(column, index) in columns"
              :key="index"
              :width="column.width"
              :class="{'tdHidden': column.fixed!='left'}">
          </colgroup>
          <tbody class="ivu-table-tbody">
            <tr v-for="(entry, index) in data"
              :key="index">
              <td v-for="(column, cIndex) in columns"
                :class="getColumnClass(column.fixed)"
                :key="cIndex">
                <span>{{entry[column.key]}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true,
      validator: function (value) {   
        let result = true;
         for (let index = 0; index < value.length; index++) {
           console.log(value[index].width)
           if(value[index] && Object.prototype.toString.call(value[index].width) !== '[object Number]'){
             result = false;
             break;
           }
         }
         return true;
      }
    },
    data: {
      type: Array,
      required: true
    },

  },
  data() {
    return {
      hasLeft: false,
      hasRight: false,
      scrollValue: 0,
      minWidth: '100vw',
    }
  },
  computed: {
    tableWidth() {
      return this.columns.map(col => col.width || 0).reduce((a, b) => a + b, 0)
    },
    firstColumnWidth(){
      return this.columns[0] && this.columns[0].width || 0;
    }
  },
  filters: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    getColumnClass(fixed){
      const m = {
        'left': 'left',
        'right': 'right',
        'center': 'center',
      }
      return m[fixed] || '';
    },

    handleBodyScroll() {
      this.scrollValue = this.$refs.tableScroll.scrollLeft
      this.hasRight = this.scrollValue - this.leftScroll < 0
      this.hasLeft = this.scrollValue > 0
    },
    handleBodyScrollTop(event) {
      this.$refs.fixedBody.scrollTop = event.target.scrollTop
      this.$refs.fixedRightBody.scrollTop = event.target.scrollTop
    },
    setTableShadow() {
      this.leftScroll =
        this.$refs.tableContent.clientWidth - this.$refs.tableScroll.clientWidth
      this.handleBodyScroll()
    },
    calculateTableMinWidth(){
      const {width} = this.$el.getBoundingClientRect();
      return width;
    }
  },
  mounted() {
    window.addEventListener('resize', this.setTableShadow, false)
    window.addEventListener('load', this.setTableShadow, false);
    this.minWidth = this.calculateTableMinWidth();
    console.log(this.minWidth)
  },
  destroyed() {
    window.removeEventListener('resize', this.setTableShadow)
    window.removeEventListener('load', this.setTableShadow)
  }
}
</script>

<style lang="scss" scoped>
.scroll-table {
  width: 100%;
  overflow: hidden;
  // border: 1px solid #ccc;
  position: relative;

  .main {
    height: 100%;
    overflow-x: auto;
    position: relative;
    // overflow-y: hidden;
  }

  table {
    table-layout: fixed;
    min-width: 100vw;
  }

  table thead {
    height: 40px;
  }
  table thead tr th {
    background: #666666;
    color: #ffffff;
    font-size: 15px;
    font-weight: 400;
    line-height: 40px;
  }
  table tbody tr {
    color: #333333;
  }
  table tbody tr:nth-child(2n+1){
    background: #fafafa;
  }

  table tbody tr td span {
    display: inline-block;
    padding: 10px 0;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    // white-space: nowrap;
  }

  table tbody tr td.left {
    text-align: left;
  }

  table tbody tr td.center {
    text-align: center;
  }

  table tbody tr td.right {
    text-align: right;
  }
}

$background: #fff;





.tdHidden {
  visibility: hidden;
}
.table-fixed-left {
  border-right: 0;
  box-shadow: none;
  transition: box-shadow 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  overflow-x: hidden;
  background: #fff;
}
.table-fixed-right {
  border-left: 0;
  box-shadow: none;
  transition: box-shadow 0.3s ease;
}
.table-fixed-left-scroll {
  box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.2);
}
.table-fixed-right-scroll {
  box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.2);
}
</style>