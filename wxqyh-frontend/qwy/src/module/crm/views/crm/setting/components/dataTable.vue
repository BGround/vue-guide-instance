
<template>
  <div class="tableListWrap">
    <div class="tableTitle">
      <span>
        <qwui-checkbox class="qwui-check_custom_box" v-model="isCheckAll" @change="checkAll"></qwui-checkbox>
      </span>
      <span class="tableName">{{titleName}}</span>
    </div>
    <div class="tableList">
      <div class="tableTitle" v-for="(item,idx) in listData" :key="idx">
        <span>
          <qwui-checkbox class="qwui-check_custom_box" v-model="item.isCheck" @change="(val)=>{checkItem(item,val)}"></qwui-checkbox>
        </span>
        <span class="tableName">{{item.name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'

export default {
  data() {
    return {
      isCheckAll: false,
    }
  },
  props: {
    listData:{
      type: Array,
      default: []
    },
    titleName:{
      type: String,
      default: ''
    },
  },
  components: {
    qwuiCheckbox
  },
  computed:{
  },
  watch:{
    listData: {
      handler(newVal, oldVal) {
        let arr = [];
        this.listData.forEach((item) => {
          if(item.isCheck == true){
            arr.push(item)
          }
        })
        this.isCheckAll = arr.length == this.listData.length && this.listData.length != 0 ? true : false
      },
      deep: true
    }
  },
  methods: {
    checkAll(val){
      this.$emit('checkAllBtn',val)
    },
    checkItem(item,boolean){
      this.$emit('checkItemBtn',item,boolean)
    }
  },
};
</script>
<style scoped lang="scss">
.tableListWrap{
  width: 100%;
  cursor: pointer;
  border: 1px solid #ccc;
  .tableTitle{
    height: 35px;
    line-height: 35px;
    background: #eee;
    .qwui-check_custom_box /deep/ {
      padding: 10px;
      .qwui-checkbox-input,.qwui-checkbox-label {
        vertical-align: baseline !important;
      }
    }
    .tableName{
      display: inline-block;
      padding-left: 20px;
      border-left: 1px solid #ddd;
    }
  }
  .tableList{
    background: #fff;
    .tableTitle{
      background: #fff;
      border-bottom: 1px solid #eee;
      &:hover{
        background: #f5f5f5;
      }
      &:last-child{
        border-bottom: 0;
      }
    }
  }
}
 
</style>


