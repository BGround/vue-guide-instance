<template>
  <table>
    <colgroup>
      <col style="width: 50px;" />
      <col style="width: 80px;" />
      <col style="width: 80px;" />
      <col style="width: 80px;" />
      <col style="width: 100px;" />
      <col style="width: 80px;" />
      <col style="width: 80px;" />
    </colgroup>
    <tbody>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td>{{item.planProvinces}}</td>
      <td>{{item.planCity}}</td>
      <td>{{item.administrativeRegion}}</td>
      <td>{{item.administrativeArea}}</td>
      <td>{{item.administrativePopulation}}<i v-if="item.administrativeStatus===1"
                                              class="up">&#8593;</i><i v-else-if="item.administrativeStatus===2"
                                                                       class="down">&#8595;</i></td>
      <td>{{item.administrativeGdp}}</td>
      <td>{{item.administrativeCentre}}</td>
    </tr>
    <tr v-if="columns && columns.length===0">
      <td colspan="7">暂无数据</td>
    </tr>
    </tbody>
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
