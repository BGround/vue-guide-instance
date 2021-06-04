<template>
  <table class="saleTable">
    <col width="10%" />
    <col width="18%" />
    <col width="18%" />
    <col width="18%" />
    <col width="18%" />
    <col width="18%" />
   <thead>
     <tr>
       <th>类型</th>
       <th>线索量</th>
       <th>跟进率</th>
       <th>到店率</th>
       <th>试驾率</th>
       <th>成交率 </th>
     </tr>
   </thead>

    <tbody>
      <tr v-if="isShow(bdxsyyList)">
        <td>本店</td>
        <td>{{bdxsyyList.xsl || '-'}}</td>
        <td>{{bdxsyyList.gjl? `${bdxsyyList.gjl}%`: '-'}}</td>
        <td>{{bdxsyyList.ddl? `${bdxsyyList.ddl}%`: '-'}}</td>
        <td>{{bdxsyyList.sjl? `${bdxsyyList.sjl}%`: '-'}}</td>
        <td>{{bdxsyyList.cjl? `${bdxsyyList.cjl}%`: '-'}}</td>
      </tr>
      <tr v-else>
        <td>本店</td>
        <td colspan="5">暂无数据</td>
      </tr>

      <tr v-if="isShow(sxsyyList)">
        <td>省</td>
        <td>{{sxsyyList.xsl || '-'}}</td>
        <td>{{sxsyyList.gjl? `${sxsyyList.gjl}%`: '-'}}</td>
        <td>{{sxsyyList.ddl? `${sxsyyList.ddl}%`: '-'}}</td>
        <td>{{sxsyyList.sjl? `${sxsyyList.sjl}%`: '-'}}</td>
        <td>{{sxsyyList.cjl? `${sxsyyList.cjl}%`: '-'}}</td>
      </tr>
      <tr v-else>
        <td>省</td>
        <td colspan="5">暂无数据</td>
      </tr>


      <tr v-if="isShow(qyxsyyList)">
        <td>战区</td>
        <td>{{qyxsyyList.xsl || '-'}}</td>
        <td>{{qyxsyyList.gjl? `${qyxsyyList.gjl}%`: '-'}}</td>
        <td>{{qyxsyyList.ddl? `${qyxsyyList.ddl}%`: '-'}}</td>
        <td>{{qyxsyyList.sjl? `${qyxsyyList.sjl}%`: '-'}}</td>
        <td>{{qyxsyyList.cjl? `${qyxsyyList.cjl}%`: '-'}}</td>
      </tr>
      <tr v-else>
        <td>战区</td>
        <td colspan="5">暂无数据</td>
      </tr>


      <tr v-if="isShow(qgxsyyList)">
        <td>全国</td>
        <td>{{qgxsyyList.xsl || '-'}}</td>
        <td>{{qgxsyyList.gjl? `${qgxsyyList.gjl}%`: '-'}}</td>
        <td>{{qgxsyyList.ddl? `${qgxsyyList.ddl}%`: '-'}}</td>
        <td>{{qgxsyyList.sjl? `${qgxsyyList.sjl}%`: '-'}}</td>
        <td>{{qgxsyyList.cjl? `${qgxsyyList.cjl}%`: '-'}}</td>
      </tr>
      <tr v-else>
        <td>全国</td>
        <td colspan="5">暂无数据</td>
      </tr>
    </tbody>

  </table>
</template>

<script>
  export default {
      data () {
          return {}
      },
      methods:{
          isShow(o){
              return o.xsl || o.gjl || o.ddl || o.sjl || o.cjl
          }
      },
      props:{
          bdxsyyList:{
              type: Object,
              default(){
                  return
                  {}
              }
          },
          sxsyyList:{
              type: Object,
              default(){
                  return
                  {}
              }
          },
          qyxsyyList:{
              type: Object,
              default(){
                  return
                  {}
              }
          },
          qgxsyyList:{
              type: Object,
              default(){
                  return
                  {}
              }
          }
      }
  }
</script>
<style lang="less" scoped>
  table.saleTable{
     tbody {
       tr:nth-child(even){
         background: #f7f7f7;
       }
      tr:nth-child(odd){
        background: #ffffff;
      }
     }
  }
</style>
