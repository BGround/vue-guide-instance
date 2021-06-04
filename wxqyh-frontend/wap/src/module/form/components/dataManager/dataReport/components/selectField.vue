<template>
    <div :class="{'qwui-dataReport':index != -1}" >
      <div class="qwui-dataReport-subTitle" v-if="index == -1">
         <span v-html="field.itemName"></span>
      </div>
      <div v-else class="qwui-dataReport-title">
        {{index + 1}}.
        <span v-html="childTitle + field.itemName"></span>
      </div>
      <div class="qwui-dataReport-nav">
        <div class="qwui-dataReport-nav-table"  :class="{ active : type == 1}" @click="changeNav(1)"><i></i><span>表格</span></div>
        <div class="qwui-dataReport-nav-column" :class="{ active : type == 2}" @click="changeNav(2)"><i></i>柱状图</div>
        <div class="qwui-dataReport-nav-pie" :class="{active : type == 3}" @click="changeNav(3)"><i></i>环形图</div>
        <div class="qwui-dataReport-nav-accord" :class="{active : hideZeroData}" @click="changeNav(4)"><i></i>{{ hideZeroData ? '隐藏零数据' :  '显示零数据'}}</div>
      </div>
      <Table v-if="type == 1" :data="renderData" @sort="sortData"></Table>
      <Column v-if="type == 2" :data="renderData" :itemKey="field.itemKey"></Column>
      <Pie v-if="type == 3" :data="renderData" :itemKey="field.itemKey"></Pie>
      <div class="qwui-dataReport-sortbtn" v-show=" type != 1">
        <div :class="{active : sortType.type == 'option'}" @click="sortData('option')">{{ sortType.option ? '选项正序' : '选项反序'}}<i :class="{active : sortType.option}"></i></div>
        <div :class="{active : sortType.type == 'count'}" @click="sortData('count')">{{ sortType.count ? '数量升序' : '数量降序'}}<i :class="{active : sortType.count}"></i></div>
      </div>
    </div>
</template>
<script>
import Table from './base/table'
import Column from './base/columnar'
import Pie from './base/pie'
import WebColumn from './base/webColumn'
  export default {
    name:'selectField',
    components:{
      Table,
      Column,
      Pie,
      WebColumn,
    },
    props:{
      'field':{
        type: Object,
      },
      'index':{
        type: Number
      }
    },
    data(){
      return {
        type: 1,  //1 表格 2柱状图 3 环形图
        hideZeroData: false,
        sortType: {
          type: 'option',   //排序类型
          option: true,     //选项正序 选项反序
          count: true,        //数量正序 数量反序
        },
        renderData:[],
        childTitle:'',
        isMobileApp:''
      };
    },
    computed:{
      options(){
        return this.filterData(this.field,this.hideZeroData)
      },
      count(){
        var temp = JSON.parse(JSON.stringify(this.options))
        return this.bubbleSort(temp);
      }
    },
    created(){
      this.isMobileApp = _.isMobileApp();
      this.childTitle = this.field.parentName ? this.field.parentName + ' > ': '';
      this.renderData = JSON.parse(JSON.stringify(this.options));
    },
    methods:{
      changeNav(type){
        switch (type){
          case 1: this.type = 1; break;
          case 2: this.type = 2; break;
          case 3: this.type = 3; break;
          case 4:
            this.hideZeroData = !this.hideZeroData;
            this.sortData(this.sortType.type,true);
            break;
        }
      },
      sortData(type,zero){
        if(!zero) {
          this.sortType.type == type ? this.sortType[type] = !this.sortType[type] : this.sortType.type = type;
        }
        if(type == 'option') {
          this.renderData = JSON.parse(JSON.stringify(this.options))
          if(!this.sortType.option){
            this.renderData.reverse();
          }
        } else {
          this.renderData = JSON.parse(JSON.stringify(this.count))
          if(!this.sortType.count){
            this.renderData.reverse();
          }
        }
      },
      filterData(data,hideZero){
        var zeroData = [],nonZeroData = [];
        data.options.forEach( item => {
          var percent = item.percent
          zeroData.push({
            "value" : item.count,
            "percent" : parseFloat(percent),
            "name" : item.value,
            "a": '1'
          });
          item.count && nonZeroData.push({
            "value" : item.count,
            "percent" : parseFloat(percent),
            "name" : item.value,
            "a": '1'
          })
        })
        return hideZero ? nonZeroData : zeroData;
      },
      bubbleSort(arr) {
        var i = arr.length, j;
        var tempExchangVal;
        while (i > 0) {
          for (j = 0; j < i - 1; j++) {
            if (arr[j].value > arr[j + 1].value) {
              tempExchangVal = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = tempExchangVal;
            }
          }
          i--;
        }
        return arr;
      }
    }
  }

</script>
<style scoped lang="scss">
 @import './style.scss';
 .qwui-dataReport-subTitle{
   color: #7A7D80;
   font-size: 14px;
   padding: 24px 0 12px;
 }
</style>

