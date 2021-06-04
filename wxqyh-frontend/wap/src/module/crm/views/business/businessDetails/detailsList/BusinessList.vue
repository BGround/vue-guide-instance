<template>
  <div>
    <div class="qwui-details_content">
      <!--列表-->
      <div v-windowscroll="loadMore">
          <crm_list :listData="listData" v-show="!noRecord.show" @click="getListId"></crm_list>
      </div>

      <!--暂无记录-->
      <no-record :hasrecord="noRecord"></no-record>

      <!--加载组件-->
      <loadMore :loading="loadingMore" :currPage="currPage" :maxPage="maxPage">
        <div class="member_tips">共{{totalRows}}个商机 金额总计 {{totalMoney}}万元</div>
      </loadMore>
    </div>

    <!--新增按钮-->
    <addBtn
      :addType="addType"
      v-if="detailsData.isChargePerson"
      @add="addBusiness">
    </addBtn>

  </div>

</template>

<script>
  import crm_list from '../../../../components/CrmList/CrmList.vue';
  import noRecord from '@/components/base/no_record';
  import loadMore from '@/components/list/load_more.vue';
  import addBtn from '../../../../components/CrmFootBtn/CrmFootBtn.vue';
  import {getDetailBusinessList} from '../../../../api/business/getData.js';
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
        addType:"新增商机",    //底部按钮文字
        isPartner:"",//是否是合作伙伴
        index:"",//列表项索引
        lock_roll:false,//判断当前是否为详情列表页
        flag:false,//判断客户id和每一列表项id是否相等
        clientId:"",//客户id
        totalMoney: 0,  // 商机总金额
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
        getDetailBusinessList(opt,(result) => {
          let { totalSale } = result;
          this.clientId=result.detailNum.clientId;
          this.detailsData=result;
          this.loadingMore = false;
          this.totalMoney = Math.round(totalSale/10000 * 100)/100;
          if(result.totalRows > 0){
            for(let i=0;i<result.pageData.length;i++) {
              let showTab=result.pageData[i].clientId==id? false: true;
              let obj = {
                id: result.pageData[i].id,  // 列表id
                top: result.pageData[i].title,  // 头部栏标题
                showTab: showTab,  // 是否显示状态标签
                tabClass: 'status_blue',  // 状态标签的类名 status_gray、status_blue、status_green、status_red、status_orange
                tabName: '合作商机',  // 状态标签名称
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
        this.lock_roll = this.$route.name == 'businessList' && this.$route.path != '/businessList'? true: false;
        if(scrollTop + offsetHeight >= scrollHeight){
          if(this.hasMore && !this.loadingMore && this.lock_roll){
            this.currPage++;
            this.getList();
          }
        }
      },

      //获取列表id
      getListId:function(id){
        let path=this.$router.history.current.matched[0].path;
        //获取选择商机的clientId
        for(let i=0;i<this.detailsData.pageData.length;i++){
          if(this.detailsData.pageData[i].id==id){
            this.index=i;
            //判断当前clientId与当前id是否相同，获取isPartent
            this.flag=this.detailsData.pageData[this.index].clientId==this.$router.history.current.query.id
            this.isPartner=this.flag?2:1;
          }
        }
        this.$router.push({path:path+'/BusinessContent',query:{id:id,isPartner:this.isPartner}});
      },


      getType:function(){
        this.url=this.$router.history.current.name;
        if(this.url=="businessList"){
          this.noRecord.text="该客户暂无商机";
        }
      },

    //  新增商机
      addBusiness:function(){
        this.$router.push({path:'/businessOperate',query:{clientId:this.clientId,from:"detail"}});
      }
    }
  }
</script>

<style scoped>
  @import './BusinessList.scss';


</style>
