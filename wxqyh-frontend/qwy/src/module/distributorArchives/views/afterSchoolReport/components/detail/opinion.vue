<template>
  <table>
    <tr>
      <th>大区意见</th>
      <th>是否整改</th>
      <th>要求完成时间</th>
    </tr>

    <tr v-if="!columns.remediationAction && !columns.isNeed && !columns.requireFinishTime">
      <td colspan="7">暂无数据</td>
    </tr>
    <tr v-else>
      <td>{{columns.remediationAction || '-'}}</td>
      <td>{{String(columns.isNeed)==='0'? '否': (String(columns.isNeed)==='1'? '是': '-') }}</td>
      <td>{{columns.requireFinishTime | formatDate}}</td>
    </tr>
  </table>
</template>

<script>
  export default {
      data () {
          return {}
      },
      props:{
          columns:{
              type: Object
          }
      },
      filters:{
        formatDate(value){
          if(value){
            return value.substring(0,10);
          }else{
            return '-'
          }
        }
      },
      created() {
          console.log(this.columns.isNeed,'2')
      }
  }
</script>
