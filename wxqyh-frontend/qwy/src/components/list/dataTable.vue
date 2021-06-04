<!--
    数据列表组件
    @param headData(必传):列表头部数据
    格式：
    headData: {
        left: {   checkbox栏设置
          noShow: true,  是否不显示checkbox
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
            color: '#eee',      数据字体颜色(可选)：默认字体颜色为#333
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
          isShowOperate: false,  是否显示操作栏
          fixedOperate: false  操作栏是否固定在最后
        }
      },
    };
    @param dataList  数据列表
    dataList: [
      {
        ...pageDataItem,
        changeColor: true  是否改变数据行颜色(可选)
      }
    ]

    用法：
    <parent>
      <data-table :headData="xxx" :dataList="xxx"></data-table>
    </parent>
 -->
<template>
    <div class="table_wrap" ref="tableWrap" @scroll="handlScroll">
        <table class="dataTable">
            <thead class="table_header">
                <tr>
                    <td class="checkbox" v-if="!headData.left.noShow">
                      <input 
                        type="checkbox" 
                        v-model="checkedAll"
                        @change="allSelect(headData.left.checkFunc || '')"
                      >
                    </td>
                    <td 
                      v-for="(item,index) in headData.middle" 
                      :key="index" 
                      @click="item.sort && item.sort.sortFunc? sortClick(item.sort.sortFunc, index) : ''"
                      :style="{width:item.width+'px'}"
                    >
                      {{item.title}}
                      <span :class="[{sort_icon:true}, item.sort.sortStyle]" v-if="item.sort"></span>
                    </td>
                    <td 
                      class="table_head_operate" 
                      v-if="headData.right.isShowOperate"
                    >操作</td>
                    <td 
                      class="table_head_operate custom_operation" 
                      v-if="headData.right.isShowOperate && headData.right.fixedOperate"
                      v-show="fixedOperate"
                    >操作</td>
                </tr>
            </thead>
            <tbody class="table_list">
                <tr v-for="(listItem, listIdx) in dataList" :key="listIdx">
                    <td class="checkbox" v-if="!headData.left.noShow">
                      <input 
                        type="checkbox" 
                        v-model="checkList[listIdx].isChecked"
                        @change="singleSelect(headData.left.checkFunc || '')"
                      >
                    </td>
                    <td
                        v-for="(headItem, headIdx) in headData.middle"
                        :key="headIdx"
                        :class="{goLink:headItem.skip}"
                        :style="{'text-align': headItem.textAlign || 'left', 'color': (listItem.changeColor && headItem.color) || '#333'}"
                        :title="listItem[headItem.key]"
                        @click="headItem.skip? tdClick(headItem.skip.skipFunc, listItem.id) : ''"
                    >
                      <slot 
                        :row="listItem"
                        :col="headItem" 
                      >
                        {{listItem[headItem.key]}}
                      </slot>
                    </td>
                    <td 
                        class="table_list_operate" 
                        v-if="headData.right.isShowOperate">
                        <div v-if="!fixedOperate">
                          <slot :listItem="listItem"></slot>
                        </div>
                    </td>
                    <td 
                        class="table_list_operate custom_operation" 
                        v-if="headData.right.isShowOperate && headData.right.fixedOperate"
                        v-show="fixedOperate"
                    >
                        <div v-if="fixedOperate">
                          <slot :listItem="listItem"></slot>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <no-data v-show="showNoData"></no-data>
    </div>
</template>
<script>
import noData from "@/components/list/noData";
export default {
  data() {
    return {
      checkedAll: false,
      showNoData: false,
      checkList:[],
      fixedOperate: false
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
    }
  },
  components: {
    noData
  },
  mounted () {
    this.deelOperate();
  },
  watch: {
    dataList:function(newVal){
      let arr = [];
      this.checkedAll = false;
      newVal.map(item => {
        let obj = {
          id: item.id,
          isChecked: false
        }
        arr.push(obj);
      });
      this.checkList = arr;
    },
    headData: {
      handler (newVal) {
        this.deelOperate();
      },
      deep: true
    }
  },
  methods: {
    // 点击数据项目触发的函数
    tdClick(callback,id){
      callback(id);
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
    singleSelect(callback){
      let selectData = this.checkList.filter(item => {
            return item.isChecked == true
        });
      this.checkedAll = selectData.length == this.checkList.length? true : false;
      callback? callback(this.checkedAll,this.checkList) : '';
    },

    // 处理操作栏
    deelOperate () {
      let table_offsetWidth = this.$refs.tableWrap.offsetWidth;
      let table_scrollLeft = this.$refs.tableWrap.scrollLeft;
      let table_scrollWidth = this.$refs.tableWrap.scrollWidth;

      this.fixedOperate = table_offsetWidth + table_scrollLeft < table_scrollWidth? true : false;
    },

    // 滚动表格
    handlScroll () {
      this.deelOperate();
    }
  },
  updated() {
    this.showNoData = this.dataList.length <= 0 ? true : false;
  }
};
</script>
<style scoped>
.table_wrap{
  overflow: auto;
}
.center {
  text-align: center;
}
.dataTable {
  width: 100%;
  cursor: pointer;
  table-layout: fixed
}
.checkbox {
  width: 45px;
  text-align: center;
}
.table_header,
.table_list {
  text-align: center;
  border: 1px solid #ddd;
  background: #eee;
}
.table_list {
  text-align: left;
  border-top: 0;
  background: #fbfbfb;
}
.table_header td,
.table_list td {
  min-width: 45px;
  height: 50px;
  line-height: 45px;
  border-right: 1px solid #ddd;
}
.table_header td:last-child,
.table_list td:last-child {
  border-right: 0;
}
.table_list td{
  padding: 0 10px;
  line-height: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dataTable input[type=checkbox]{
  margin-left: 0;
}
.table_list tr{
  border-bottom: 1px solid #ddd;
}
.table_list tr:last-child{
  border-bottom: 0;
}
.table_list tr:hover{
  background: #f4f4f4;
}
.goLink{
  color: #f87b00 !important;
}
.goLink:hover{
  text-decoration: underline;
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
.table_header .table_head_operate{
  width: 67px;
}
.dataTable .table_header .custom_operation, .dataTable .table_list .custom_operation{
  position: absolute;
  right: 30px;
  width: 69px;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
}
.dataTable .table_header .custom_operation{
  padding: 2px 0;
  background: #eee;
}
.dataTable .table_list .custom_operation{
  background: #fff;
}
</style>
