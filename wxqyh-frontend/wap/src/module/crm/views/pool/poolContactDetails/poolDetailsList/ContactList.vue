<template>
  <div>
    <div class="qwui-details_content">
      <!--列表-->
      <div v-windowscroll="loadMore">
        <crm_list
          :listData="listData"
          v-show="!noRecord.show"
          @click="getListId">
        </crm_list>
      </div>

      <!--暂无记录-->
      <no-record :hasrecord="noRecord"></no-record>

      <!--加载组件-->
      <loadMore :loading="loadingMore" :currPage="currPage" :maxPage="maxPage">
        <div class="member_tips">共{{totalRows}}个联系人</div>
      </loadMore>
    </div>



  </div>

</template>

<script>
  import crm_list from '../../../../components/CrmList/CrmList.vue';
  import noRecord from '@/components/base/no_record';
  import loadMore from '@/components/list/load_more.vue';
  import {getPoolContactDetailsList} from '../../../../api/pool/getData.js';
  export default {
    components:{
      crm_list,
      loadMore,
      noRecord,
    },
    data(){
      return {
        detailsData:dataBase.details.headData,
        listData:[],  //列表项数据配置
        currPage: 1,  // 当前页数
        maxPage: 0,  // 最大页数
        loadingMore: false,  // 是否正在加载
        totalRows: 0,  // 总客户数
        hasMore: true,  // 是否还有数据
        noRecord:{  // 无记录配置
          show:false,
          icon:"qwui-no_record_crmDetails",
          text:"",
        },
        url:"",   //当前路径
        detailsData:{},   //接口返回数据
        addType:"新增客户联系人",    //底部按钮文字
        lock_roll:false,//判断当前是否为详情列表页
      }
    },
    created(){
      this.getList();
    },
    methods:{
      //渲染列表
      getList:function(){
        let id=this.$router.currentRoute.query.id;
        let opt={
          id:id,
          page:this.currPage,
        }
        this.loadingMore = true;
        getPoolContactDetailsList(opt,(result) => {
          this.detailsData=result;
          this.loadingMore = false;
          if(result.totalRows > 0){
            for(let i=0;i<result.pageData.length;i++) {
              let obj = {
                id: result.pageData[i].id,  // 列表id
                top: result.pageData[i].contactsName +" "+ result.pageData[i].mobile ,  // 头部栏标题
                mid: [  // 中间栏配置
                  {
                    title: '所属客户：',  // 中间栏项名称
                    value: result.pageData[i].clientName  // 中间栏项值
                  }
                ],
                bottom: {
                  isShowAvator: true,  // 是否显示头像和创建人信息
                  msg: {
                    avatorUrl: result.pageData[i].headPic,  // 头像路径
                    avatorName: result.pageData[i].personName  // 创建人名称
                  },
                  data: [
                    {
                      title: '更新时间：',  // 底部栏项名称
                      value: result.pageData[i].updateTime  // 底部栏项值
                    }
                  ]
                }
              }
              this.listData.push(obj);
            }
          }else{
            this.getType()
          }

          this.totalRows = result.totalRows;
          this.maxPage  = result.maxPage;
          this.currPage = result.currPage;
          this.hasMore = result.currPage >= result.maxPage? false : true;
          if(this.totalRows > 0){
            this.noRecord.show = false;
          }
          else{
            this.noRecord.show = true;
          }
        })
      },

      // 加载更多列表
      loadMore:function(el){
        let scrollTop=0;
        if(document.documentElement&&document.documentElement.scrollTop){
          scrollTop=document.documentElement.scrollTop - 122;
        }
        else if(document.body){
          scrollTop=document.body.scrollTop - 122;
        }
        let offsetHeight = screen.height;
        let scrollHeight = el.scrollHeight;
        this.lock_roll = this.$route.name == 'poolContactList'? true: false;
        if(scrollTop + offsetHeight >= scrollHeight){
          if(this.hasMore && !this.loadingMore && this.lock_roll){
            this.currPage++;
            this.getList();
          }
        }
      },

      //获取列表项id
      getListId:function(id){
        this.$router.push({path:'/PoolDetails/poolContactContent',query:{id:id}});
      },


      getType:function(){
        this.url=this.$router.history.current.name;
        if(this.url=="poolContactList"){
          this.noRecord.text="该客户暂无联系人";
        }
      }
    }
  }
</script>

<style scoped>
  @import 'ContactList.scss';


</style>
