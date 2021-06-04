

<template>
  <div class="qwui-dataReport">
    <div class="qwui-dataReport-title">
      {{index + 1}}. 
      <span v-html="childTitle + field.itemName"></span>
     </div>
      <table border = 1 class="qwui-dataReport-table">
         <tr>
           <td>选项</td>
           <td>值</td>
         </tr>
        <tr>
          <td>求和</td>
          <td>{{field.itemValueSum}}</td>
        </tr>
        <tr>
          <td>平均值</td>
          <td>{{field.itemValueAverage}}</td>
        </tr>
        <tr>
          <td>最大值</td>
          <td>{{field.itemValueMax}}</td>
        </tr>
        <tr>
          <td>最小值</td>
          <td>{{field.itemValueMin}}</td>
        </tr>
      </table>
  </div>
</template>
<script>

  export default {
    name:'numbersField',
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
        childTitle:''
      };
    },
    created(){
      this.childTitle = this.field.parentName ? this.field.parentName + ' > ': '';
    }
  }

</script>
<style scoped lang="scss">
  @import './style.scss';
  .qwui-dataReport-table {
    font-size: 13px;
    color: #7A7D80;
    border: none;
    width: 100%;
    border-spacing: 0;
    border: 1px solid rgba(234,236,239,0.5);
    border-radius: 4px;
    * {
      border: none;
      line-height: 35px;
    }
    tr {
      td {
        padding-left: 25px;
        border-top: 1px solid #f2f3f5;
        word-break: break-all;
      }
      td:first-child {
        border-right: 1px solid #f2f3f5;
        min-width: 95px;
      }
    }
    tr:first-child {
      background: #fafbfc;
      td {
        border-top: none;
      }
    }
  }
</style>
