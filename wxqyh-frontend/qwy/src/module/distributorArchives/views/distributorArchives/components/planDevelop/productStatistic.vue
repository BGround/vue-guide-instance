<template>
  <table>
    <tr>
      <th></th>
      <th v-for="(item,index) in tabTit" :key="index">{{item}}</th>
    </tr>
    <tr v-if="columns.countryList && columns.countryList.length>0">
      <td>{{columns.cityName}}</td>
      <!-- <td v-for="(item,index) in columns.countryList.length"
          :key="index"> -->
        <td v-for="(item,index) in cityTabList"
          :key="index">
        <span v-if="index===0 || index===1">{{cityTabList[index].num}}</span>
        <span v-else>{{cityTabList[index].percent | filterNum}}%</span>
      </td>
    </tr>
    <tr v-if="columns.countryList && columns.countryList.length>0">
      <td>{{columns.provinceName}}</td>
      <!-- <td v-for="(item,index) in columns.provinceList.length"
          :key="index"> -->
        <td v-for="(item,index) in provinceTabList"
          :key="index">
        <span v-if="index===0 || index===1">{{provinceTabList[index].num}}</span>
        <span v-else>{{provinceTabList[index].percent | filterNum}}%</span>
      </td>
    </tr>
    <tr v-if="columns.countryList && columns.countryList.length>0">
      <td>全囯</td>
      <!-- <td v-for="(item,index) in columns.countryList.length"
          :key="index"> -->
        <td v-for="(item,index) in countryTabList"
          :key="index">
        <span v-if="index===0 || index===1">{{countryTabList[index].num}}</span>
        <span v-else>{{countryTabList[index].percent | filterNum}}%</span>
      </td>
    </tr>
    <tr v-if="columns.countryList && columns.countryList.length===0"><td>暂无数据</td></tr>
  </table>
</template>

<script>
  export default {
      data(){
          return {
              cityTabList:[],
              provinceTabList:[],
              countryTabList:[],
              carType:['奇瑞','容量','市占率','瑞虎3','瑞虎3x','瑞虎5x','瑞虎7','艾瑞泽5','全新艾瑞泽5','瑞虎8','艾瑞泽GX'] 
          }
      },
      computed: {
        tabTit() {
          let [tabList,cityTabList,provinceTabList,courturyTabList] = [[],[],[],[]]

          if(this.columns && this.columns.cityList && this.columns.cityList.length>0) {
              let cityList = this.columns.cityList
              let countryList = this.columns.countryList
              let provinceList = this.columns.provinceList

              // cityTabList.push(cityList[0].num,cityList[1].num,cityList[2].percent)
              // provinceTabList.push(provinceList[0].num,provinceList[1].num,provinceList[2].percent)
              // courturyTabList.push(countryList[0].num,countryList[1].num,countryList[2].percent)
              // 城市
              this.columns.cityList.map(item => {
                  if(this.carType.includes(item.title)) {
                    tabList.push(item.title)
                    cityTabList.push(item)
                  }
              })

              // 省份
              this.columns.provinceList.map(item => {
                  if(this.carType.includes(item.title)) {
                    provinceTabList.push(item)
                  }
              })

              // 国家
              this.columns.countryList.map(item => {
                  if(this.carType.includes(item.title)) {
                    courturyTabList.push(item)
                  }
              })

              this.cityTabList = cityTabList
              this.provinceTabList = provinceTabList
              this.countryTabList = courturyTabList
          }
          return tabList
        }
      },
      props:{
          columns:{
              type:Object
          }
      },
      filters:{
          filterNum(val){
              if(val){
                  return val.toFixed(2)
              } else {
                  return 0
              }
          }
      }
  }
</script>
