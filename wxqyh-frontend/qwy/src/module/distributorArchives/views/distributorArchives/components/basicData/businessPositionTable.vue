<template>
  <table>
    <tr>
      <th width="20%">岗位</th>
      <th width="20%">应配备人数</th>
      <th width="20%">实际人数</th>
      <th width="20%">配备率</th>
      <th width="20%">认证人数</th>
    </tr>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td>{{item.name}}</td>
      <td>{{item.allocation}}</td>
      <td>{{item.realPeople}}</td>
      <td>{{item.rate | filterNum}}%</td>
      <td>{{item.approPeople}}</td>
    </tr>
    <tr v-if="columns && columns.length===0">
      <td colspan="5">暂无数据</td>
    </tr>
  </table>
</template>

<script>
    export default {
        data(){
            return {}
        },
        props:{
            columns:{
                type: Array
            }
        },
        filters:{
            filterNum(val){
                let txt = 0
                if(val){
                    txt = val.toFixed(2)
                }
                return txt
            }
        }
    }
</script>
