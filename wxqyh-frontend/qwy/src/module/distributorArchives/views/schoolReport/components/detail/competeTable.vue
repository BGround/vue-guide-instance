<template>
  <div class="tableWrap competeTableWrap">
    <div class="table-head">
      <table>
        <colgroup>
          <col v-for="(item,index) in 3"
            :key="index"
            style="width: 33%;" />
        </colgroup>
        <thead>
          <tr>
            <th>品牌</th>
            <th>排名</th>
            <th>市占率</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="table-body">
      <table>
        <colgroup>
          <col v-for="(item,index) in 3"
            :key="index"
            style="width: 33%;" />
        </colgroup>
        <tbody>
          <tr v-for="(item,index) in getList"
            :key="index">
            <td>{{item.brand}}</td>
            <td>{{item.sort}}</td>
            <td>{{item.percent}}%</td>
          </tr>
          <tr v-if="getList && getList.length===0">
            <td colspan="3">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    getList() {
      return this.columns.reverse()
    }
  }
}
</script>
