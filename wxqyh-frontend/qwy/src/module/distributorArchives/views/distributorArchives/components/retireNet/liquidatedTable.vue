<template>
  <table class="mb10">
    <tr>
      <!--      <th class="warning">财务部<el-tooltip content="到期未清算" placement="bottom" effect="light">-->
      <!--        <i class="el-icon-warning-outline"></i>-->
      <!--      </el-tooltip>-->
      <!--      </th>-->
      <!--      <th>网络部</th>-->
      <!--      <th>售后部</th>-->
      <th v-for="(item,index) in columns" :key="'t'+index">清算部门</th>
      <!--      <th>清算部门</th>-->
      <!--      <th>清算部门</th>-->
      <!--      <th>清算部门</th>-->
      <!--      <th>清算部门</th>-->
    </tr>
    <tr>
      <td v-for="(item,index) in columns" :key="'d'+index">{{item.deptName}}</td>
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
                type: Array
            }
        }
    }
</script>
