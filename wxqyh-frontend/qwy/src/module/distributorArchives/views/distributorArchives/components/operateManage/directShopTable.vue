<template>
  <table>
    <tr>
      <th width="12%">直营店名称</th>
      <th width="6%">店面级别</th>
      <th v-for="(item,yindex) in yearTit" :key="yindex">
        <span v-if="item<10">{{item}}月</span>
        <span v-if="item>=10 && item<=12">{{item}}月</span>
        <span v-if="item>13">{{item}}年</span>
      </th>
    </tr>
    <tr v-for="(item,index) in columnsYear" :key="'dealer'+index">
      <td>{{item.qr_name}}</td>
      <td>{{item.qr_type}}</td>
      <td v-for="(ditem,dindex) in titData" :key="dindex">
        <p v-for="(titem,tindex) in item.timeList" :key="'t'+tindex">
          <span v-if="ditem===titem.time">{{titem.data || 0}}</span>
        </p>
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
      data () {
          return {
              monthTit:['01','02','03','04','05','06','07','08','09','10','11','12'],
              storeLevel:'',
              monthData:[],
              yearData:[],
          }
      },
      computed:{
          titData(){
              let temp = []
              this.yearTit.map(item =>{
                    if(item<10) {
                        temp.push('0'+item)
                    } else {
                        temp.push(item+'')
                    }
              })
              return temp
          }
      },
      methods:{
          sortFun(a,b){
              if(a>b){
                  return 1
              }else if(a===b){
                  return 0
              }else if(a<b){
                  return -1
              }
          }
      },
      props:{
          columnsYear:{
              type: Array
          },
          yearTit:{
              type: Array
          }
      }
  }
</script>
