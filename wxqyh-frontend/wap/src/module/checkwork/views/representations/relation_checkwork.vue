<template>
  <div class="wrap">
    <!--头部菜单栏以及搜索栏,getSearchRequest:监听搜索事件-->
    <home_head_nav
      :headrdata="headData"
      v-on:getSearchRequest="getSearchRequest"
      :placeholder="placeholder"
    >
    </home_head_nav>
    <!-- 列表 -->
    <checkwork_list :loadmore="loadMore"></checkwork_list>
    <!--加载状态-->
    <load_more
      :loadmore="loadMore"
      describeWord="i18n.checkWorkTotal"
      ref="loadMoreFun"
    >
    </load_more>
  </div>
</template>

<script>
  import home_head_nav from '@/components/home/home_head_nav';
  import load_more from '@/components/base/load_more';
  import checkwork_list from '../list/checkwork_list';

  export default {
    data(){
      return {
        doSearch:false,//判断搜索状态，true:不判断显示隐藏搜索框，false:判断隐藏或显示
        placeholder:"搜索发起人",
        loadMore:{
          url:"/portal/checkWorkSignInCtrl/checkWorkList.do",     //请求路径
          pageIndexName:"page",
          data:{ //ajax入参数据
            keyWord: '',
            page: 1,
            type:1
          },
          padeConfig:{
            currPage:"",
            maxPage:"",
            pageData:[],  //返回的列表数据
            totalRows:"",//数据总条数s
          },
          hasRecord:{
            show:false,
            setTop:false,//是否置顶?覆盖整个页面
            icon:"qwui-icon_search",
            title:"i18n.noCheckWorkDec",//若text无内容则title为16px #bbb
            text:"i18n.noCheckWorkText",
          },
        },
        headData:{
          show:false,
          nav:[],
          searchBar:{
            show:true,//搜索框，默认显示
          },
        },
      }
    },
    created(){

    },
    methods:{
      // 搜索关键字后重新请求
      getSearchRequest:function(val){
        this.loadMore.data.keyWord=val;
        this.doSearch=true;//正在进行搜索
        this.$refs.loadMoreFun.clearLoadFun(); //清空列表数据，重新请求
      },
    },
    components:{
      checkwork_list,
      load_more,
      home_head_nav,
    }
  }

</script>

<style scoped>
  .wrap{
    background-color: #f5f5f5;
  }
  .wrap /deep/ .qwui-search_bar{
    background-color: #f0f0f0;
  }
  .wrap /deep/ .qwui-search_text{
    background-color: #fff;
  }
  .wrap /deep/ .qwui-search_inner .qwui-search_input{
    background-color: #fff;
  }
</style>

