<template>
  <table class="sale-clue-table">
    <tr>
      <th>类型</th>
      <th>线索量</th>
      <th>跟进率</th>
      <th>到店率</th>
      <th>试驾率 </th>
      <th>成交率</th>
    </tr>

    <!--
    <tr v-for="(item,index) in bdxsyyList" :key="index">
      <td>本店</td>
      <td>{{item.xsl || '-'}}</td>
      <td>{{item.gjl || '-'}}%</td>
      <td>{{item.ddl || '-'}}%</td>
      <td>{{item.sjl || '-'}}%</td>
      <td>{{item.cjl || '-'}}%</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr v-if="bdxsyyList && bdxsyyList.length===0">
      <td>本店</td>
      <td colspan="8">暂无数据</td>
    </tr>
    <tr v-for="(item,index) in sxsyyList" :key="'s'+index">
      <td>省</td>
      <td>{{item.xsl || '-'}}</td>
      <td>{{item.gjl || '-'}}%</td>
      <td>{{item.ddl || '-'}}%</td>
      <td>{{item.sjl || '-'}}%</td>
      <td>{{item.cjl || '-'}}%</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr v-if="sxsyyList && sxsyyList.length===0">
      <td>省</td>
      <td colspan="8">暂无数据</td>
    </tr>
    <tr v-for="(item,index) in qyxsyyList" :key="'zq'+index">
      <td>战区</td>
      <td>{{item.xsl || '-'}}</td>
      <td>{{item.gjl || '-'}}%</td>
      <td>{{item.ddl || '-'}}%</td>
      <td>{{item.sjl || '-'}}%</td>
      <td>{{item.cjl || '-'}}%</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr v-if="qyxsyyList && qyxsyyList.length===0">
      <td>战区</td>
      <td colspan="8">暂无数据</td>
    </tr>
    <tr v-for="(item,index) in qgxsyyList" :key="'qg'+index">
      <td>全国</td>
      <td>{{item.xsl || '-'}}</td>
      <td>{{item.gjl || '-'}}%</td>
      <td>{{item.ddl || '-'}}%</td>
      <td>{{item.sjl || '-'}}%</td>
      <td>{{item.cjl || '-'}}%</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr v-if="qgxsyyList && qgxsyyList.length===0">
      <td>全国</td>
      <td colspan="8">暂无数据</td>
    </tr>

    -->
  </table>
</template>

<script>
    export default {
        name: "saleClueTable",
        components: {},
        data() {
            return {}
        },
        props: {},
        methods: {},
        created() {

        }
    }
</script>

<style scoped>

</style>
