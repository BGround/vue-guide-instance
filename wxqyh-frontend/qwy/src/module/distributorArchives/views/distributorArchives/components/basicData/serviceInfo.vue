<template>
    <ul>
<!--      <li>销售渠道-->
<!--        <el-select v-model="channelVal" clearable placeholder="选择渠道">-->
<!--          <el-option-->
<!--            v-for="item in channelOptions"-->
<!--            :key="item.value"-->
<!--            :label="item.label"-->
<!--            :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--      </li>-->
      <li>销售车型&nbsp;&nbsp;&nbsp;
        <el-select v-model="carVal" clearable placeholder="选择销售车型" @change="carChangeFun">
          <el-option
            v-for="(item,index) in carOptions"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </li>
      <li class="flex"><span>销售区域</span>
        <el-input
          type="textarea"
          :rows="2"
          readonly
          placeholder="销售区域"
          v-model="saleArea">
        </el-input>
      </li>
    </ul>
</template>

<script>
    import {
        ajaxGetCarTypeListByDealerId,
        ajaxGetAreaByDealerIdAndCarType,
    } from '../../../../api/getData'
  export default {
      data(){
          return {
              dealerId:'',
              channelVal:'',
              carVal:'',
              channelOptions:[
                  {value:'',label:'选择渠道'},
                  {value:'A',label:'A网'},
                  {value:'B',label:'B网'}],
              // carOptions:[{value:'',label:'选择车型'},{value:'ruihu7',label:'瑞虎7',saleVal:'弋江区；鸠江区；三山区；芜湖县；繁昌县；南陵县；'},{value:'ruihu8',label:'瑞虎8',
              //     saleVal:'镜湖区；弋江区；鸠江区；三山区；南陵县；'},{value:'airuize5',label:'艾瑞泽5',saleVal:'镜湖区；弋江区；三山区；繁昌县；南陵县;无为县'}],
              carOptions:[],
              saleArea:'',
              tempVal:'',
              tempId:''
          }
      },
      created(){
          this.dealerId = this.$route.query.dealerId
          this.getCarTypeListByDealerId()
      },
      methods:{
          getCarTypeListByDealerId(){
              let params = {
                  dealerId: this.dealerId
              }
              ajaxGetCarTypeListByDealerId(params,data => {
                  if(data && data.carTypeList) {
                    this.carOptions = data.carTypeList
                  }
              })
          },
          getAreaByDealerIdAndCarType(){
              let params = {
                  dealerId: this.dealerId,
                  carType: this.carVal
              }
              ajaxGetAreaByDealerIdAndCarType(params,data => {
                  if (data && data.area) {
                      let temp = data.area
                      this.saleArea = temp.replaceAll(',','，')
                  }
              })
          },
          carChangeFun(val){
              if(val) {
                  this.getAreaByDealerIdAndCarType()
              } else {
                  this.saleArea = ''
              }
          },
      }
  }
</script>
