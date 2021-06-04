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
        v-for="(item,index) in centerNav"
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

    <!--照片-->
    <div class="qwui-details_itemPic">
      <div class="qwui-details_itemPicTitle"
           v-for="(item,index) in communicationNav"
           :key="index"
           v-if="item.status">{{item.optionName}}</div>
      <div class="qwui-details_img" v-if="hasPic" :class="{noImg:!hasPic,hasImg:hasPic}">
        <span class="imgList" v-for="(item,index) in previewImageUrl" :key="index" >
          <img :src="dataDetailMsg(item.picPath)" alt="" @click="previewImg(item.picPath,previewImageUrl)">
        </span>
      </div>
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
  import EventBus from '@/utils/eventBus';
  import {getPoolVisitDetails} from '../../../../api/pool/getData.js';
  import data from '../../../visit/visitDetails/detailsContent/data.js'
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
      detail_title
    },
    data(){
      return {
        dataBase:dataBase,
        details:dataBase.details,
        visitData:data,
        nav: data.visit.nav,  //
        centerNav: data.visit.centerNav,  //
        communicationNav:data.visit.communicationNav,
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
        return this.visitData.listComment;
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
        let id=this.$router.currentRoute.query.id;
        let obj={
          "id":id,
          "size":10,
        };
        getPoolVisitDetails(obj,(result) =>{
          this.clientTitle=result.outworkVO.clientName;
          this.basicList=result.basicList;
          this.itemList=result.itemList;
          this.detailsData=result.outworkVO;

          //添加自定义字段
          for(let i=0;i<this.itemList.length;i++){
            this.itemJson[i] = Object.assign({}, this.itemList[i], { divType: 9 ,optionName:this.itemList[i].fieldName,status:true, value:this.itemList[i].optionVal})
          }

          //判断字段开启状态
          let beforeClientData = this.nav.concat(this.centerNav,this.communicationNav); //渲染自定义字段前的字段
          for(let i=0;i<this.basicList.length;i++){
            for(let j=0;j<beforeClientData.length;j++){
              if(this.basicList[i].optionName===beforeClientData[j].optionName){
                this.basicList[i].status == 1? beforeClientData[j].status = true:beforeClientData[j].status = false;
              }
            }
          }
          this.communicationNav[0].optionName="照片";

          //固定字段赋值
          this.nav[0].value=this.detailsData.outworkTitle;
          this.nav[1].value=this.detailsData.outworkContent;
          this.centerNav[0].value=this.detailsData.clientName;
          this.centerNav[1].value=this.detailsData.contactName;
          this.centerNav[2].value=this.detailsData.outworkName;
          this.centerNav[3].value=this.detailsData.outworkTime;
          this.centerNav[4].value=this.detailsData.address;
          if(this.detailsData.clientAddress!=null && this.detailsData.clientAddress !=""){
            this.centerNav[5].value=this.detailsData.clientAddress;
          }else{
            this.centerNav[5].status=false;//客户地址为空时，隐藏
          }

          //照片
          this.previewImageUrl=this.detailsData.picList;
          this.hasPic=this.detailsData.picList.length==0?false:true;

          //负责人和相关人预览
          this.details.userListConfig.toPersonList.userSelected=this.detailsData.toPersons;
          this.details.userListConfig.ccPersonList.userSelected=this.detailsData.ccPersons;
          this.details.userListConfig.toPersonList.num= this.detailsData.toPersons.length;
          this.details.userListConfig.ccPersonList.num= this.detailsData.ccPersons.length;

          //获取评论数据
          this.visitData.listComment.get.hasMore=result.hasMore; //更多
          this.visitData.listComment.totalPages=result.totalRows;
          this.visitData.listComment.send.contentObject="tbOutworkCommentPO.content";
          this.visitData.listComment.get.data={
            "id": this.detailsData.id,
          }
          this.visitData.listComment.send.data={
            "tbOutworkCommentPO.content": "",
            "userIds" :"",
            "userId":_.userId,
            "submitStatus":0,
            "tbOutworkCommentPO.type":1,
            "page":1,
            "id": this.detailsData.id,
          }
          if(this.visitData.listComment.comments){
            this.visitData.listComment.comments=[];
            result.comments.forEach( item =>{  //给评论加上type==2字段，兼容评论组件评论内容为图片时的显示
              if(item.commentStatus == 0 && this.checkPicURL(item.content)){
                let list=Object.assign({},item,{time:item.createTime,type:2}); //评论组件中使用的时间字段名称为time
                this.visitData.listComment.comments.push(list);
              }else{
                let list=Object.assign({},item,{time:item.createTime});;
                this.visitData.listComment.comments.push(list);
              }
            })
          }else{
            this.visitData.listComment.comments=[];
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

      // 图片路径处理
      dataDetailMsg:function(src) {
        return _.compressURL + src;
      },
      //图片预览
      previewImg:function(src,list){
        let previewImageURL = _.compressURL + src;
        EventBus.$emit("previewImages",previewImageURL.replace('/compress',''),list);
      },

      //获取创建人详情
      getCreatorDetail:function (creator) {
        if(creator){
          this.$refs.loadPersonalMsg.showUserMessage(creator);
        }
      },
    }
  }
</script>

<style scoped>
  @import 'VisitContent.scss';

</style>
