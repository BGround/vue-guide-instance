<!--
    数据列表组件
    @param headData(必传):列表头部数据
    格式：
    headData: {
        left: {   checkbox栏设置
          checkFunc:() => {  点击checkbox回调函数
            console.log(123)
          }
        },
        middle: [  头部栏设置
          {
            title: "目标名称",   标题名称(必传)
            key: "goalName",    数据字段名称(必传)
            width: 100,         标题栏宽度(必传)
            textAlign: 'right', 数据文字方向(可选)：不传默认为left  值：left center right
            skip: {             该项是否能跳转(可选)：默认不跳转
              skipFunc:() => {  点击跳转的回调函数
                console.log(123)
              }
            },
            sort: {             该项是否具有排序功能(可选)  默认不具有排序功能
              sortFunc: "",     排序回调函数
              sortStyle: 'sort_down'  箭头样式：'sort_down'箭头向下  'sort_down_on'点击后的箭头向下  'sort_up'箭头向上  'sort_up_on'点击后的箭头向上
            }
          },
          {
            title: "销售团队",
            key: "teamName",
            width: 100
          },
          ...
        ],
        right: {   操作栏设置
          isShowOperate: false  是否显示操作栏
        }
      },
    };
    @param dataList  数据列表（必需）

    用法：
    <parent>
      <data-table :headData="xxx" :dataList="xxx"></data-table>
    </parent>
 -->
<template>
  <div class="relative">
    <div class="table_wrap"  :style="{'min-width':width+'px'}" ref="table_wrap">
      <table class="dataTable">
        <thead class="table_header">
        <tr>
          <td
            v-if="headData.left"
            class="checkbox">
            <input
              v-show="!headData.left.hideSelectedAll"
              type="checkbox"
              v-model="checkedAll"
              @change="allSelect(headData.left.checkFunc || '')">
          </td>
          <td
            v-for="(item,index) in headData.middle"
            :key="index"
            @click="item.sort && item.sort.sortFunc? sortClick(item.sort.sortFunc, index) : ''"
            :style="showAllContent(item)">
            {{item.title}}
            <span
              :class="[{sort_icon:true}, item.sort.sortStyle]"
              v-if="item.sort"></span>
            <slot :name="item.key"></slot>
          </td>
          <td
            v-show="headData.right.isShowOperate"
            :style="{'min-width':(headData.right.width-5)+'px','width':(headData.right.width-5)+'px'}"></td>
          <td
            v-show="headData.right.isShowOperate"
            :style="{width:headData.right.width+'px'}">操作</td>
        </tr>
        </thead>
        <tbody class="table_list">
        <tr
          v-for="(listItem, listIdx) in dataList"
          :key="listIdx">
          <td
            v-if="headData.left"
            class="checkbox">
            <input
              type="checkbox"
              v-model="checkList[listIdx].isChecked"
              @change="singleSelect(headData.left.checkFunc || '',listIdx)">
          </td>
          <td
            v-for="(headItem, headIdx) in headData.middle"
            :key="headIdx"
            :class="{goLink:headItem.skip}"
            :style="showStyle(headItem,listItem)"
            :title="listItem[headItem.key]"
            @click="headItem.skip? tdClick(headItem.skip.skipFunc, listItem) : ''">
            <slot :name="headItem.key+listIdx">
              <div class="qwui-content">
                {{listItem[headItem.key]}}
              </div>
            </slot>
          </td>
          <td
            v-show="headData.right.isShowOperate"
            :style="{'min-width':(headData.right.width-5)+'px','width':(headData.right.width-5)+'px'}"></td>
          <td
            v-show="headData.right.isShowOperate"
            :style="{width:headData.right.width+'px'}">
            <slot :name="'o'+listIdx">
              <tableOperation :operationList="listItem.operationList"></tableOperation>
            </slot>
          </td>
        </tr>
        </tbody>
      </table>
      <no-data v-show="showNoData"></no-data>
    </div>
  </div>
</template>
<script>
  import noData from "@/components/list/noData";
  import tableOperation from './tableOperation.vue';
  export default {
    data() {
      return {
        checkedAll: false,
        showNoData: false,
        checkList:[],
        operateWidth:'',
      }
    },
    props: {
      headData: {
        type: Object,
        required: true
      },
      dataList: {
        type: Array,
        required: true
      },
      width:{
        type: String,
        required: false
      },
    },
    components: {
      noData,
      tableOperation,
    },
    watch: {
      dataList:function(newVal){
        let self = this;
        let arr = [];
        newVal.map(item => {
          let obj = {
            id: self.headData.left ? item[self.headData.left.id] : item.id,
            isChecked: item.isChecked || false,
          }
          arr.push(obj);
        });
        this.checkList = arr;
        newVal.length===0 || this.isAllSelected();
      }
    },
    methods: {
      // 点击数据项目触发的函数
      tdClick(callback,item){
        callback(item);
      },

      // 排序回调函数
      sortClick(callback,idx){
        callback(idx);
      },

      // 点击全选checkbox
      allSelect(callback){
        this.checkList.map((item,idx) => {
          item.isChecked = this.checkedAll;
        });

        callback? callback(this.checkedAll,this.checkList) : '';
      },

      // 点击checkbox
      singleSelect(callback,index){
        this.isAllSelected();
        callback? callback(this.checkedAll,this.checkList,index) : '';
      },

      //判断是否全选
      isAllSelected(){
        let selectData = this.checkList.filter(item => {
          return item.isChecked == true
        });
        this.checkedAll = selectData.length == this.checkList.length? true : false;
      },

      showStyle(headItem,listItem){
        if(headItem.key == listItem.key){
          return listItem.style;
        }else if(headItem.style){
          return headItem.style;
        }

        if(!headItem.style){
          let obj = Object.assign({
            'text-align': headItem.textAlign || 'left',
          },this.showAllContent(headItem));
          return obj;
        }
      },
      showAllContent(item){
        if(this.headData.showAllContent){
          return{
            'min-width':item.width+'px',
          }
        }else{
          return{
            'max-width':item.width+'px',
            'min-width':item.width+'px',
          }
        }
      }
    },
    updated() {
      this.showNoData = this.dataList.length===0;
    },
  };
</script>
<style scoped lang="scss">

  @mixin table-header-list{
    text-align: center;
    border: 1px solid #ddd;
    background: #eee;
  }

  @mixin table-header-list-td{
    position: relative;
    min-width: 45px;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    border-right: 1px solid #ddd;
  }

  @mixin table-header-list-td-last{
    position:absolute;
    overflow: visible;
    min-width: 50px;
    right: 0;
    background: #fbfbfb;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 0;
  }

  .table_wrap{
    overflow: auto;
    min-width: 960px;
    .center {
      text-align: center;
    }
    .checkbox {
      width: 45px;
      text-align: center;
    }
    .dataTable {
      width: 100%;
      cursor: pointer;
      .table_header{
        position:relative;
        @include table-header-list;
        td{
          @include table-header-list-td;
          &:last-child{
            @include table-header-list-td-last;
            background: #eee;
            border-bottom:none;
          }
          .sort_icon{
            position: relative;
            display: inline-block;
            margin-top: -2px;
            width: 12px;
            height: 12px;
            vertical-align: middle;
          }
          .sort_down{
            background: url(../../assets/images/arrow_normal.png) no-repeat;
          }
          .sort_up{
            background: url(../../assets/images/arrow_normal_up.png) no-repeat;
          }
          .sort_down_on{
            background: url(../../assets/images/arrow_on.png) no-repeat;
          }
          .sort_up_on{
            background: url(../../assets/images/arrow_on_up.png) no-repeat;
          }
        }
      }
      .table_list {
        @include table-header-list;
        text-align: left;
        border-top: 0;
        background: #fbfbfb;
        tr{
          position:relative;
          border-bottom: 1px solid #ddd;
          &:last-child{
            border-bottom: 0;
          }
          &:hover{
            background: #f4f4f4;
          }
          td{
            @include table-header-list-td;
            padding: 0 10px;
            line-height: normal;
            .qwui-content{
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            &:last-child{
              @include table-header-list-td-last;
            }
            &.goLink{
              color: #C31725;
              &:hover{
                text-decoration: underline;
              }
            }
          }
        }
      }
      input[type=checkbox]{
        margin-left: 0;
      }
    }
  }
</style>


