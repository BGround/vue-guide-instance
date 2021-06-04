<template>
    <div style="padding:20px;">
      <form action="${baseURL}/reimConfig/reimConfigCtl/reimTypeList.do" class="table-nav">
        <div class="topMainBar clearfix">
          <div class="fl flMainBar">
            <a class="btn" href="javascript:history.back();">返回</a>
            <p class="routerTip">设置<span>/</span>借款单设置<span>/</span><span class="active">设置单据类型</span></p>
          </div>
        </div>
        <div class="mt30 clearfix">
          <div class="fl flMainBar">
            <a v-perm="" id="add_btn" href="javascript:void(0);" class="btn orangeBtn">新增</a>
            <span class="borderline"></span>
            <a v-perm="" id="c326c94de10f4c839a8dde5b7559a23f" href="javascript:void(0);" class="btn" onclick="_doDel('cc94a9ec68ff4d93a7fd5934c581b647', refreshEvent,'','new');">删除</a>
          </div>
        </div>
      </form>
      <!--列表-->
      <data-table :headData="headData"
                  :dataList="dataList">
      </data-table>
      <page :pageData="pageSetting" @change="pageChage"></page>

    </div>
</template>
<script>
  import dataTable from "@/components/list/dataTable";
  import page from '@/components/list/page';
  export default {
    data() {
      return {
          pageSetting: { // 页码设置
          page: 1,// 页码,
          pageSize: 15,// 数据条数
          maxPage: 1,
          totalRows: 100
        },
        headData:{
          left: {   //checkbox栏设置
            checkFunc:() => {  //点击checkbox回调函数
               console.log(123)
              }
           },
          middle: [  //头部栏设置
            {
              title: "单据类型名称",   //标题名称(必传)
              key: "goalName",   // 数据字段名称(必传)
              width: 100,         //标题栏宽度(必传)
              textAlign: '', //数据文字方向(可选)：不传默认为left  值：left center right
             /* skip: {            // 该项是否能跳转(可选)：默认不跳转
                skipFunc:() => {  //点击跳转的回调函数
                  console.log(123)
                }
              },*/
                /*sort: {            // 该项是否具有排序功能(可选)  默认不具有排序功能
                  sortFunc: "",     //排序回调函数
                  sortStyle: 'sort_down'  //箭头样式：'sort_down'箭头向下  'sort_down_on'点击后的箭头向下  'sort_up'箭头向上  'sort_up_on'点击后的箭头向上
                }*/
             },
            {
              title: "可用对象",
              key: "teamName",
              width: 100
            },
            {
              title: "排序号",
              key: "num",
              width: 100
            },
           ],
          right: {   //操作栏设置
            isShowOperate: true  //是否显示操作栏
          }
     },
      dataList:[
          {'goalName':'单据1','teamName':'所有人','num':'1'},
          {'goalName':'单据2','teamName':'企微云部门','num':'2'},
          {'goalName':'单据3','teamName':'事业二部','num':'2'}
        ]
      }
    },
    components:{
      dataTable,
      page,
    },
    methods: {
      pageChage(val){
        console.log('改变分页'+val)      }
    }
  }
</script>
<style scoped>
  .btn{
    border: 1px solid #cccccc;
  }
  .table-nav{
    margin-bottom: 20px;
  }
  .routerTip {
    display: inline-block;
    margin-left: 10px;
    color: #999;
  }
  .routerTip span {
    padding: 0 5px;
  }
  .routerTip .active{
    color: #666;
  }
  .table_mingxi .tableBox{ overflow-x:auto;border-radius: 0 0 5px 5px}
  .tableBox_head {border: 1px solid #ddd;padding: 10px;margin-bottom: 10px;}
  .table_mingxi table,.table_mingxi .table{ border: 1px solid #ddd; width:100%;}
  .table_mingxi td,.table_mingxi .td{height: 50px; padding:0 10px; box-sizing: border-box; border-right: 1px solid #ddd;border-top: 1px solid #ddd;font-size:13px; word-break: break-all;}
  .table_mingxi tr,.table_mingxi .table_tr{background:#fff;cursor: pointer;}
  .table_mingxi tr:hover,.table_mingxi tr.active,.table_mingxi .table_tr:hover{background:#f5f5f5}
  .table_mingxi th.disabled{color:#ddd}
  .table_mingxi th,.table_mingxi .th{font-size:13px;  text-align: center; width: 80px; box-sizing: border-box; border-right:1px solid #ddd; text-align: center;font-weight:400;border-top: none; white-space: nowrap;}
  .table_mingxi .th,.table_mingxi .td{display:inline-block;line-height:45px;vertical-align: middle;}
  .table_mingxi td[permission="formOrder"] a:hover{ text-decoration: underline }
  .table_mingxi .cz{ width: 80px;min-width: 80px;text-align: center;position:relative }
  .table_mingxi .cz a { display: inline-block;color: #fff; }
  .table_mingxi .cz a+a{margin-left:5px;}
  .table_mingxi .cz .czIcon {height: 38px;line-height: 38px;position: absolute;top: 50%;margin-top: -19px;left: 50%; margin-left: -15px;}
  .table_mingxi .cz .czIcon span{width:5px;height:5px;display:inline-block;border-radius:50%;background:#ccc;margin-right:5px;margin-top:16.5px;}
  .table_mingxi .cz .czItem { text-align: left;position: fixed; display: flex;-webkit-display: flex; top: 10px; background: #000; color: #fff; padding: 8px 10px; right: 60px; border-radius: 5px; display:none;line-height: 20px;}
  .table_mingxi .head{ background: #efefef; height: 50px; line-height: 50px; padding: 0 10px; color: #666; overflow: hidden; position: relative; border: 1px solid #ddd; box-sizing: border-box;border-radius:5px 5px 0 0;border-bottom: none; }
  .table_mingxi .head .state{ font-weight: 700; border: 1px solid #ccc; height: 30px; line-height: 30px; padding: 0 10px 0 30px;
    background: url('') no-repeat 10px 8px #fff; cursor: pointer; border-radius: 5px; position: absolute; top: 10px; right: 10px; } /*../images/mingxi_yanjing.png*/

</style>
