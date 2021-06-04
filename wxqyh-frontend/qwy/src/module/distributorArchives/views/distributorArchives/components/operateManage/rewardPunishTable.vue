<template>
  <table>
    <tr>
      <th width="8%">年份</th>
      <th width="6%">月份</th>
      <th width="10%">奖惩类别</th>
      <th width="10%">奖惩金额（元）</th>
      <th width="12%">考核依据</th>
      <th width="12%">考核事由</th>
      <th width="12%">报告/通报名称</th>
      <th width="10%">生效时间</th>
      <th width="10%">执行时间</th>
      <th width="10%">奖罚部门</th>
    </tr>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td>{{item.year || '-'}}年</td>
      <td>{{item.month || '-'}}月</td>
      <td>{{item.rewardsType || '-'}}</td>
      <td>{{item.rewardsAmount || '-'}}</td>
      <td>{{item.checkGist || '-'}}</td>
      <td>{{item.checkThing || '-'}}</td>
      <td>{{item.report || '-'}}</td>
      <td>{{item.effectTime || '-'}}</td>
      <td>{{item.executeTime || '-'}}</td>
      <td>{{item.rewardsDept || '-'}}</td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="10">暂无数据</td></tr>
  </table>
</template>

<script>
    export default {
        data(){
            return{}
        },
        props:{
            columns:{
                type: Array
            }
        }
    }
</script>
