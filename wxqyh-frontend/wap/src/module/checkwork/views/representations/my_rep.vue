<template>
  <div class="wrap">
    <!--加载相关页面tab-->
    <div class="qwui-menu_tab_fixed active">
      <menu_tab
        :selectdata="selectData"
        v-on:listenTabChange="showMsgFromSelectCard"
      >
      </menu_tab>
    </div>
    <!--加载列表-->
    <rep_list :loadmore="loadMore"></rep_list>

    <!--加载状态-->
    <load_more
      :loadmore="loadMore"
      describeWord="i18n.repTotal"
      ref="loadMoreFun"
    >
    </load_more>
  </div>
</template>

<script>
  import menu_tab from '@/components/button/menu_tab_two';
  import rep_list from '../list/rep_list';
  import load_more from '@/components/base/load_more';
  export default {
    data(){
      return {
        loadMore:dataBase.home.loadMore,//加载列表组件数据
        hasRecord:{
          show:false,
          setTop:false,//是否置顶?覆盖整个页面
          icon:"qwui-icon_search",
          title:"i18n.noRepDesc",//若text无内容则title为16px #bbb
          text:"i18n.noRepText"
        },
        selectData:{
          index:0,
          nav:[ //我的申诉 tab
            {
              content: 'i18n.inApprove',
              data:{ //点击切换传递的数据
                page:1,
                pageSize:20,
                status:'3',
                type:0,
                recType:'',
              }
            },
            {
              content: 'i18n.approved',
              data:{ //点击切换传递的数据
                page:1,
                pageSize:20,
                status:'4',
                type:0,
                recType:'',
              }
            }
          ],
        }
      }
    },
    created:function (){
      //判断旧页面的类型，改变接口请求参数和tab位置
      this.getUrlType();
    },
    methods:{
      //判断旧页面的类型，改变接口请求参数和tab位置
      getUrlType(){
        var status = _.getUrlParam("status");
        var type = _.getUrlParam("type");
        this.loadMore.data=this.selectData.nav[this.selectData.index].data;
        if(type=="0" && status=="4"){//已审批
          this.selectData.index=1;
          this.loadMore.data=this.selectData.nav[this.selectData.index].data;
        }
        this.loadMore.hasRecord = this.hasRecord;
      },
      //相关页面tab切换
      showMsgFromSelectCard:function(msg,index){
        if(msg!=null && msg!==''&& msg!=undefined && msg.data){
          this.showMsgFromFooter(msg);
        }
      },
      //底部菜单切换重置请求列表、相关页面的tab菜单切换请求重置列表
      showMsgFromFooter:function (msg) {
        //hasRecord 设置无内容提示图标、标题、提示内容
        this.loadMore.data=msg.data;
        this.$refs.loadMoreFun.clearLoadFun();  //清空列表数据，重新请求
      },
    },
    components:{
      menu_tab,
      rep_list,
      load_more,
    },

  }
</script>

<style scoped>
  .wrap{
    background-color: #fff;
  }
  .wrap /deep/ .qwui-tabbar_heaght{
    background-color: #f7f7f7;
  }
</style>
