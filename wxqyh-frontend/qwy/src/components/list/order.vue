<template>
   <div>
     <div class="type-search">
      <span class="orderby" :class="{iconArrowDown:order==6,iconArrowUp:order==5}" @click="changeOrder('timeAsc')">
            <span class="">发布时间</span>
        </span>
        <span class="borderLine"></span>
        <span class="orderby" :class="{iconArrowDown:order==2,iconArrowUp:order==1}" @click="changeOrder('studentAsc')">
            <span class="">学习人数</span>
        </span>
        <span class="borderLine"></span>
        <span class="orderby" :class="{iconArrowDown:order==4,iconArrowUp:order==3}" @click="changeOrder('priceAsc')">
            <span class="">价格</span>
        </span>
        <span class="borderLine"></span>

        <input type="checkbox" name="" class="mr5" @click="focusOnFree()">只看免费
    </div>
   </div>
</template>

<script>
import axios from 'axios'
export default {
  props:['pagedata'],
  methods:{
    changeOrder(paramStr){
      if(paramStr == 'studentAsc'){
        this.order = this.order==1?2:1;
      }else if(paramStr == 'priceAsc'){
        this.order = this.order==3?4:3;
      }else{
        this.order = this.order==5?6:5;
      }
      this.pagedata.param.orderWay = this.order;
      this.orderOperator();
    },
    focusOnFree(){
      this.isFree = !this.isFree;
      this.pagedata.param.freeYON = this.isFree?'isFree':'';
      this.orderOperator();
    },
    orderOperator(){
       if(this.pagedata.pageDataInit){
          this.pagedata.pageDataInit(1);
        }
    }
  },
  data(){
    return {
      order:6,
      isFree:false
    }
  }
}
</script>

<style>
.ml50 {
  margin-left: 50px;
}
.borderLine {
     display: inline-block;
    height:10px;
    margin: 0 10px;
    border-left: 1px solid #e6e6e6;
}
.colorff6666 {
  color: #ff6666;
}

.type-search {
  margin-top: 10px;
    background: #f7f7f7;
    padding: 10px 20px;
    color: #666;
    text-align: left;
}
.searchItemRow {
  margin-top: 10px;
}
.searchItem {
  display: inline-block;
  cursor: pointer;
}
.searchItem:hover {
  color: #fff;
  background-color: #a1a1a1;
}
.iconArrowDown:hover{
  padding-right: 15px;
  background: url("../../assets/images/arrow_on.png") no-repeat 100% center;
}

.iconArrowDown{
  padding-right: 15px;
  background: url("../../assets/images/arrow_normal.png") no-repeat 100% center;
}

.iconArrowUp:hover{
  padding-right: 15px;
  background: url("../../assets/images/arrow_on_up.png") no-repeat 100% center;
}

.iconArrowUp{
  padding-right: 15px;
  background: url("../../assets/images/arrow_normal_up.png") no-repeat 100% center;
}
.orderby {
  cursor: pointer;
}

</style>
