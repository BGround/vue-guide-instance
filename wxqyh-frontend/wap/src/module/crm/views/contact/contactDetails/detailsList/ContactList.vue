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

    <!--新增按钮-->
      <addBtn
        :addType="addType"
        v-if="detailsData.isChargePerson"
        @add="addContact">
      </addBtn>


  </div>

</template>

<script>
  import crm_list from '../../../../components/CrmList/CrmList.vue';
  import noRecord from '@/components/base/no_record';
  import loadMore from '@/components/list/load_more.vue';
  import addBtn from '../../../../components/CrmFootBtn/CrmFootBtn.vue';
  import {getDetailContactList} from '../../../../api/contact/getData.js';
  export default {
    components:{
      crm_list,
      loadMore,
      noRecord,
      addBtn
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
        clientId:"",//客户id
        scroll:"",
      }
    },
    created(){
      this.getList();
    },
    // beforeRouteEnter (to, from, next) {
    //   next(vm => {
    //     vm.$nextTick(() => {
    //       console.log(to.meta);
    //     });
    //   });
    // },
    // beforeRouteLeave (to, from, next) {
    //   // 记录滚动位置
    //   console.log(from)
    //   from.meta.scrollY = this.scroll;
    //   next();
    // },
    methods:{
      //渲染列表
      getList:function(){
        let opt={
          id:this.$router.history.current.query.id,
          page:this.currPage,
        }
        this.loadingMore = true;
        getDetailContactList(opt,(result) => {
          this.clientId=result.detailNum.clientId;
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
        this.lock_roll = this.$route.name == 'contactList' && this.$route.path != '/contactList'? true: false;
        if(scrollTop + offsetHeight >= scrollHeight){
          if(this.hasMore && !this.loadingMore && this.lock_roll){
            this.currPage++;
            this.getList();
          }
        }
      },

      //获取列表项id
      getListId:function(id){
        let path=this.$router.history.current.matched[0].path;
        this.$router.push({path:path+'/ContactContent',query:{id:id}});
      },


      getType:function(){
        this.url=this.$router.history.current.name;
        if(this.url=="contactList"){
          this.noRecord.text="该客户暂无联系人";
        }
      },

      //  新增联系人
      addContact:function(){
        this.$router.push({path:'/contactOperate',query:{clientId:this.clientId,from:"detail"}});
      }
    }
  }
</script>

<style scoped>
  @import 'ContactList.scss';


</style>
