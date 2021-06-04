<template>
  <table>
    <tr>
      <th class="checkbox">
        <input
          type="checkbox"
          v-model="checkedAll"
          @change="allSelect('')">
      </th>
      <th>战区</th>
      <th>省份</th>
      <th>城市</th>
      <th>ERP号</th>
      <th>经销商简称</th>
      <th>性质</th>
      <th>运营状态</th>
      <th>年份</th>
      <th>月份</th>
      <th>查阅状态</th>
      <th>生成时间</th>
      <th>操作</th>
    </tr>
    <tr v-for="(item,index) in columns"
        :key="index">
      <td class="checkbox">
        <input
          type="checkbox"
          v-model="columns[index].isChecked"
          @change="singleSelect(index)">
      </td>
      <td>{{item.area}}</td>
      <td>{{item.province}}</td>
      <td>{{item.city}}</td>
      <td>{{item.erp}}</td>
      <td>{{item.dealerShortName}}</td>
      <td>{{item.dealerType}}</td>
      <td>{{item.dealerStatusDesc}}</td>
      <td>{{item.year}}年</td>
      <td>{{item.month}}月</td>
      <td>{{item.readStatusDesc}}</td>
      <td>{{item.createTime}}</td>
      <td><a href="javascript:;"
             @click="goDetailFun">发送</a>
        <a href="javascript:;"
           @click="goDetailFun">提醒查阅</a>
      </td>
    </tr>
    <tr v-if="columns && columns.length===0"><td colspan="12">暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data () {
          return {
              checkedAll: false,
              checkList:[],
          }
      },
      props:{
          columns:{
              type: Array
          }
      },
      created(){
          this.checkList = this.columns
      },
      methods:{
          // 查看详情
          goDetailFun() {
              this.$router.push({ name: 'schoolReportDes', query: { id: '1' } })
          },
          //判断是否全选
          isAllSelected(){
              let selectData = this.columns.filter(item => {
                  return item.isChecked == true
              });
              this.checkedAll = selectData.length == this.checkList.length? true : false;
          },
          // 点击checkbox
          singleSelect(callback,index){
              this.isAllSelected();
              callback? callback(this.checkedAll,this.checkList,index) : '';
          },
          // 点击全选checkbox
          allSelect(callback){
              this.checkList.map((item,idx) => {
                  item.isChecked = this.checkedAll;
              });

              callback? callback(this.checkedAll,this.checkList) : '';
          },
      }
  }
</script>
