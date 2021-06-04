<template>
  <div class="qwui-details_content">
    <!--创建人-->
    <div class="qwui-createInfo">
      <div class="qwui-creator">
        <p>创建人</p><p class="qwui-creatorName">{{detailsData.personName}}</p>
      </div>
      <div class="qwui-createInfo_time">
        <p>创建时间</p><p class="qwui-createTime">{{detailsData.createTime}}</p>
      </div>
      <div class="qwui-createInfo_time">
        <p>更新时间</p><p class="qwui-updetaTime">{{detailsData.updateTime}}</p>
      </div>
    </div>

    <!--客户基础资料-->
    <div class="qwui-details_list">
      <crm-operate-item
        :dataDetailMsg="add_nav"
        v-for="(item,index) in nav"
        :item="item"
        :key="index"
        v-if="item.status">
      </crm-operate-item>
    </div>
    <div class="qwui-details_itemList">
      <crm-operate-item
        :dataDetailMsg="add_nav"
        v-for="(item,index) in middleNav"
        :item="item"
        :key="index"
        v-if="item.status">
      </crm-operate-item>
    </div>

    <!--客户联系人，商机合作伙伴，竞争对手-->
    <div class="qwui-details_businessList">
      <div class="qwui-details_businessItem" v-for="(item ,index) in centerNav" :key="index">
        <div class="qwui-details_itemTitle" v-if="item.status">{{item.optionName}}</div>
        <div class="qwui-details_item"
             v-if="item.status"
             v-for="(itemList,idx) in item.value"
             :key="idx"
             @click="goDetails(itemList.id,item.optionName)">
          {{itemList.name}}
          <span class="qwui-details_arrowRight" v-if="item.optionName=='商机合作伙伴' || item.optionName=='竞争对手'"></span>
        </div>
      </div>
    </div>
    <!--商机阶段-->
    <div class="qwui-details_itemList">
      <crm-operate-item
        :dataDetailMsg="add_nav"
        v-for="(item,index) in stageNav"
        :item="item"
        :key="index"
        v-if="item.status">
      </crm-operate-item>
    </div>

    <!--商机类别，销售金额，结算日期-->
    <div class="qwui-details_itemLists">
      <crm-operate-item
        :dataDetailMsg="add_nav"
        v-for="(item,index) in communicationNav"
        :item="item"
        :key="index"
        v-if="item.status">
      </crm-operate-item>
    </div>

    <!--自定义字段-->
    <div class="qwui-details_customList">
      <crm-operate-item
        :dataDetailMsg="add_nav"
        v-for="(item,index) in itemJson"
        :item="item"
        :key="index">
      </crm-operate-item>
    </div>

    <!--照片附件-->
    <div class="qwui-details_itemPic">
      <div class="qwui-details_itemPicTitle">照片</div>
      <div class="qwui-details_img" v-if="hasPic" :class="{noImg:!hasPic,hasImg:hasPic}">
        <span class="imgList" v-for="(item,index) in previewImageUrl" :key="index" >
          <img :src="dataDetailMsg(item.picPath)" alt="" @click="previewImg(item.picPath,previewImageUrl)">
        </span>
      </div>
      <detail_title :titledata="detailPic" v-if="hasMedia"></detail_title>
    </div>

    <!--上一个，下一个-->
    <div class="qwui-pageNumber">
      <div class="qwui-prev" @click="nextBusiness('pre')">上一个商机</div>
      <div class="qwui-next" @click="nextBusiness('next')">下一个商机</div>
    </div>

    <!--负责人和相关人内容-->
    <user_select :userselect="userSelect"></user_select>

    <!--评论列表-->
    <list_comment
      :listcomment="listComment"
      :agent="agent"
      :isShowOnlyCommentBtn="isShowOnlyCommentBtn"
      @showThisPersonUtil="getCreatorDetail">
    </list_comment>

    <!--评论输入框组件-->
    <chat_comment :listcomment="listComment"  @dealccPerson="backUserSelect"></chat_comment>

    <!--选择人组件-->
    <user_choose :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_choose>

    <!--负责人、相关人详细列表-->
    <user_show :userselect="userSelect"></user_show>

    <!--个人信息-->
    <user_info ref="loadPersonalMsg"></user_info>

    <!--预览图片组件-->
    <previewImages></previewImages>

  </div>
</template>

<script>
  import CrmOperateItem from '../../../base/CrmOperateItem';
  import chat_comment from '@/components/detail/chat_comment.vue';
  import user_show from '@/components/base/user_show.vue';
  import user_select from '@/components/detail/user_select.vue';
  import user_choose from '@/components/base/user_or_dept_select.vue';
  import user_info from '@/components/detail/user_info_card.vue';
  import list_comment from '@/components/detail/list_comment.vue';
  import previewImages from '@/components/base/previewImages.vue';
  import detail_title from '@/components/detail/detail_title.vue';
  import {getPoolBusinessDetails} from '../../../../api/pool/getData.js';
  import {nextBusiness} from '../../../../api/business/getData.js';
  import EventBus from '@/utils/eventBus';
  import data from '../../../business/businessDetails/detailsContent/data.js'
  export default {
    components:{
      CrmOperateItem,
      chat_comment,
      user_select,
      user_choose,
      user_show,
      user_info,
      list_comment,
      previewImages,
      detail_title,
    },
    data(){
      return {
        dataBase:dataBase,
        details:dataBase.details,
        businessData:data,
        nav: data.business.nav,  //
        middleNav: data.business.middleNav,  //
        centerNav: data.business.centerNav,  //
        stageNav: data.business.stageNav,  //
        communicationNav: data.business.communicationNav,  //
        basicList:[],//固定字段
        itemList:[],//自定义字段数据
        detailsData:{},//详情数据
        itemJson:[],
        previewImageUrl:[],
        isShowOnlyCommentBtn:false,//是否显示只看评论开关
        agent:'crm',//crm系统消息
        add_nav:{ //数据详情头部信息
          title:"",
          content:"",
        },
        hasPic:false,//照片列表是否有值
        hasMedia:false,//是否有附件
        detailPic:{ //图片，附件
          openPrint:true,
          creator:"",
          personName:"",
          createTime:"",
          describes:[],
          content:"",
          configCopy:{},//复制页面信息到新建页面
          picList:[],//上传的图片列表
          mediaList:[],//上传的附件列表
          isUseRate:"",
          priority:"",
          status:{active:'',class:'', name:''},
          title:''
        }
      }
    },
    computed:{
      userSelect:function(){  //负责人、相关人
        return this.details.userListConfig;
      },
      listComment:function () { //评论数据
        return this.businessData.listComment;
      },
    },
    created(){
      this.getDetails();
    },
    mounted(){

    },
    methods:{

      //获取客户详情
      getDetails:function(){
        let id=this.$router.history.current.query.id;
        let isPartner=this.$router.currentRoute.query.isPartner;
        let obj={
          "id":id,
          "size":10,
          "isPartner":isPartner
        };
        getPoolBusinessDetails(obj,(result) =>{
          this.clientTitle=result.tbCrmBusinessInfoPO.clientName;
          this.basicList=result.basicList;
          // this.itemList=result.itemList;
          if(result.itemList){
            this.itemList=result.itemList;
          }
          this.detailsData=result.tbCrmBusinessInfoPO;

          //添加自定义字段
          if(this.itemList){
            for(let i=0;i<this.itemList.length;i++){
              this.itemJson[i] = Object.assign({}, this.itemList[i], { divType: 9 ,optionName:this.itemList[i].fieldName,status:true, value:this.itemList[i].optionVal})
            }
          }

          //判断字段开启状态
          let beforeClientData = this.nav.concat(this.middleNav,this.centerNav,this.stageNav,this.communicationNav,); //渲染自定义字段前的字段
          for(let i=0;i<this.basicList.length;i++){
            for(let j=0;j<beforeClientData.length;j++){
              if(this.basicList[i].optionName===beforeClientData[j].optionName){
                this.basicList[i].status == 1? beforeClientData[j].status = true:beforeClientData[j].status = false;
              }
            }
          }

          //固定字段赋值
          this.nav[0].value=this.detailsData.title;
          this.nav[1].value=this.detailsData.content;
          this.middleNav[0].value=this.detailsData.clientName;

          let contractArr=[],businessArr=[],competitorArr=[];
          for(let i=0;i<this.detailsData.contactList.length;i++){//客户联系人
            let obj={
              "name":this.detailsData.contactList[i].contactName,
              "id":"",
            }
            contractArr.push(obj);
          }
          for(let i=0;i<this.detailsData.partnerList.length;i++){//商机合作伙伴
            let obj={
              "name":this.detailsData.partnerList[i].clientName,
              "id":this.detailsData.partnerList[i].clientId,
            }
            businessArr.push(obj);
          }
          for(let i=0;i<this.detailsData.competitorList.length;i++){//竞争对手
            let obj={
              "name":this.detailsData.competitorList[i].competitorName,
              "id":this.detailsData.competitorList[i].id,
            }
            competitorArr.push(obj);
          }
          this.centerNav[0].value=contractArr;
          this.centerNav[1].value=businessArr;
          this.centerNav[2].value=competitorArr;

          this.stageNav[0].value=this.detailsData.stageName+'('+this.detailsData.winRate+'%)';
          this.communicationNav[0].value=this.detailsData.businessTypeName;
          this.communicationNav[1].value=this.detailsData.estimatedSale;
          this.communicationNav[2].value=this.detailsData.estimatedDate;

          //照片,附件
          this.detailPic.mediaList=result.mediaList;
          this.previewImageUrl=this.detailsData.picList;
          this.hasPic=this.detailsData.picList.length==0?false:true;
          this.hasMedia=this.detailPic.mediaList.length==0?false:true;


          //负责人和相关人预览
          this.details.userListConfig.toPersonList.userSelected=this.detailsData.toPersons;
          this.details.userListConfig.ccPersonList.userSelected=this.detailsData.ccPersons;
          this.details.userListConfig.toPersonList.num= this.detailsData.toPersons.length;
          this.details.userListConfig.ccPersonList.num= this.detailsData.ccPersons.length;

          //获取评论数据
          this.businessData.listComment.get.hasMore=result.hasMore; //更多
          this.businessData.listComment.totalPages=result.commentCount.count;
          this.businessData.listComment.send.contentObject="tbCrmCommentPO.content";
          this.businessData.listComment.get.data={
            "id": this.detailsData.id,
          }
          this.businessData.listComment.send.data={
            "tbCrmCommentPO.content": "",
            "userIds" :"",
            "userId":_.userId,
            "tbCrmCommentPO.foreignId": this.detailsData.id ,
            "id": this.detailsData.id,
          }
          if(this.businessData.listComment.comments){
            this.businessData.listComment.comments=[];
            result.comments.forEach( item =>{ //给评论加上type==2字段，兼容评论组件评论内容为图片时的显示
              if(item.commentStatus == 0 && this.checkPicURL(item.content)){
                let list=Object.assign({},item,{type:2});
                this.businessData.listComment.comments.push(list);
              }else{
                let list=item;
                this.businessData.listComment.comments.push(list);
              }
            })
          }else{
            this.businessData.listComment.comments=[];
          }
        })
      },

      //判断评论是不是有图片
      checkPicURL(str){
        return str.indexOf('/upload/img/')==-1? false:true;
      },

      //@人后把人添加为相关人
      backUserSelect(obj){
        if(this.details.userListConfig.ccPersonList.userSelected){
          var newRelativePerson=_.appendRelativePerson(this.details.userListConfig.ccPersonList,obj);
          this.details.userListConfig.ccPersonList.num=newRelativePerson.length;
          this.details.userListConfig.ccPersonList.userSelected=newRelativePerson;
        }
      },

      //获取创建人详情
      getCreatorDetail:function (creator) {
        if(creator){
          this.$refs.loadPersonalMsg.showUserMessage(creator);
        }
      },

      // 图片路径处理
      dataDetailMsg:function(src) {
        return _.compressURL + src;
      },
      //图片预览
      previewImg:function(src,list){
        let previewImageURL = _.compressURL + src;
        EventBus.$emit("previewImages",previewImageURL.replace('/compress',''),list);
      },

      //点击商机合作伙伴/竞争对手
      goDetails:function(id, type){
        if(id!=""){
          if(type =='竞争对手'){
            this.$router.push(`/competitor/detail/${id}`); //跳转到竞争对手
          }else{
            this.$router.push({path:'/ClientDetails/ClientContent',query:{id:id,isClient:0,size:10}});
          }
        }
      },


      //上一个/下一个商机
      nextBusiness:function(type){
        let obj={
          "id":this.$router.history.current.query.id,
          "type":type,
          "typeId":"undefined",
          "keyWord":"undefined",
        }
        nextBusiness(obj,(result) => {
          let path=this.$router.history.current.matched[0].path;
          this.$router.push({path:path+'/poolBusinessContent',query:{id:result.businessId,size:10,isPartner:""}});
          this.getDetails();
        })
      },
    }
  }
</script>

<style scoped>
  @import 'BusinessContent.scss';

</style>
