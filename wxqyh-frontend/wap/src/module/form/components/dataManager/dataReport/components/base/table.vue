<template>
  <div class="table">
    <table class="qwui-dataReport-table">
      <tr class="head">
        <td class="selectItem" :class="{active : item.type == 'option'}" @click="sort('option')">选项<i :class="{active : item.option}"></i></td>
        <td class="count" :class="{active : item.type == 'count'}" @click="sort('count')">数量<i :class="{active : item.count}"></i></td>
        <td class="percent" :class="{active : item.type == 'percent'}" @click="sort('percent')">占比<i :class="{active : item.percent}"></i></td>
      </tr>
      <tr v-for="item in data">
        <td :title="item.name">{{item.name}}</td>
        <td>{{item.value}}</td>
        <td>{{item.percent}}%</td>
      </tr>
    </table>
  </div>
</template>
<script>
  export default{
    name:'Table',
    props:{
      data:{
        type:Array
      }
    },
    data(){
      return{
        item:{
          type: 'option',
          option: true,
          count: true,
          percent: true
        }
      }
    },
    methods:{
      sort(type){
        var _type = type == "percent" ? 'count':type
        this.$emit('sort',_type)
        this.item.type == type ? this.item[type] = !this.item[type] : this.item.type = type;
      },
    }
  }
</script>
<style scoped>
  .qwui-dataReport-table {
    font-size: 13px;
    color: #7A7D80;
    width: 100%;
    line-height: 35px;
    border: 1px solid rgba(234, 236, 239, 0.5);
    border-spacing: 0;
    border-radius: 4px;
  }
  .qwui-dataReport-table tr:first-child td{
    background: #fafbfc;
    border-top: none;
  }
  .qwui-dataReport-table tr td {
    padding-left: 25px;
    border-top: 1px solid #f2f3f5;
    border-right: 1px solid #f2f3f5;
    word-break: break-all;
  }
  .qwui-dataReport-table tr td:last-child{
    border-right: none;
  }
  .qwui-dataReport-table tr td:first-child {
    min-width: 95px;
    max-width: 184px;
  }
  .selectItem,.count,.percent{
    min-height: 35px;
    padding-left: 21px;
    font-size: 13px;
    color: #7A7D80;
    cursor: pointer;
  }
  i {
    display: inline-block;
    width: 6px;
    height: 10px;
    vertical-align: initial;
    margin-left: 5px;
    background: url("../../../../../../../assets/images/form-sort-default.png") no-repeat;
    background-size: contain;
  }
  .active i{
    display: inline-block;
    width: 6px;
    height: 10px;
    vertical-align: initial;
    margin-left: 5px;
    background: url("../../../../../../../assets/images/form-sort-down.png");
    background-size: contain;
  }
  i.active {
    transform: rotate(180deg);
  }
</style>
