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
    <div class="qwui-details_itemLists">
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
      <detail_title :titledata="detailPic" v-if="hasPic" @on-preview="onPreviewImage"></detail_title>
    </div>

    <!--负责人和相关人内容-->
    <user_select :userselect="userSelect"></user_select>

    <!--编辑按钮-->
    <div class="qwui-visit_editBtn" v-if="showCopyBtn || showEditBtn">
      <button class="qwui-details_copy"  v-if="showCopyBtn" @click="goCopy">复制</button>
      <button class="qwui-details_edit"
              :class="{only_edit:onlyEditBtn}"
              v-if="showEditBtn"
              @click="goEdit">编辑</button>
      </div>

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
    <previewImages :urls="previewImageUrl"></previewImages>
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
  import {getVisitDetails} from '../../../../api/visit/getData.js';
  import data from'./data.js';

  import EventBus from '@/utils/eventBus';
  
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
        showCopyBtn:false,
        showEditBtn:false,
        onlyEditBtn:false,
        hasPic:false,//照片列表是否有值
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
    methods:{

      //获取联系人详情
      getDetails:function(){
        let obj={
          "id":this.$router.history.current.query.id,
          "size":10,
        }
        getVisitDetails(obj,(result) =>{
          this.clientTitle=result.outworkVO.clientName;
          this.basicList=result.basicList;
          if(result.itemList){
            this.itemList=result.itemList;
          }
          this.detailsData=result.outworkVO;
          this.$store.commit('changeHeadData',result.detailNum);

          //添加自定义字段
          if(this.itemList){
            for(let i=0;i<this.itemList.length;i++){
              this.itemJson[i] = Object.assign({}, this.itemList[i], { divType: 9 ,optionName:this.itemList[i].fieldName,status:true, value:this.itemList[i].optionVal, ext1: this.itemList[i].numberType})
            }
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
          this.communicationNav[0].optionName="图片";

          //固定字段赋值
          this.nav[0].value=this.detailsData.outworkTitle;
          this.nav[1].value=this.detailsData.outworkContent;
          this.centerNav[0].value=this.detailsData.clientName;
          this.centerNav[1].value=this.detailsData.contactName;
          this.centerNav[2].value=this.detailsData.businessName;
          this.centerNav[3].value=this.detailsData.outworkTime;
          this.centerNav[4].value=this.detailsData.outworkName;
          this.centerNav[5].value=this.detailsData.address;
          if(this.detailsData.clientAddress!=null && this.detailsData.clientAddress !=""){
            this.centerNav[6].value=this.detailsData.clientAddress;
          }else{
            this.centerNav[6].status=false;//客户地址为空时，隐藏
          }

          //照片，照片预览
          this.detailPic.picList=this.detailsData.picList;
          this.previewImageUrl=this.detailsData.picList;
          this.detailsData.picList==0? this.hasPic=false: this.hasPic=true;

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

          //是否显示编辑或复制按钮
          if(_.userId==this.detailsData.createPerson){
            this.showCopyBtn=true;
            this.showEditBtn=true;
          }else{
            for(let i=0;i<this.detailsData.toPersons.length;i++){
              if( _.userId==this.detailsData.toPersons[i].userId){
                this.onlyEditBtn=true;
                this.showEditBtn=true;
                this.showCopyBtn=false;
              }
            }
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

      //点击编辑
      goEdit:function(){
        let id=this.$router.currentRoute.query.id;
        this.$router.push({path:'/visitOperate',query:{visitId:id,}});
      },

      //点击复制
      goCopy:function(){
        let id=this.$router.currentRoute.query.id;
        this.$router.push({path:'/visitOperate',query:{visitId:id,copy:true}});
      },

      // 点击图片放大预览
      onPreviewImage(src, list) {
        EventBus.$emit("previewImages",src, list);
      }
    }
  }
</script>

<style scoped>
  @import './VisitContent.scss';

</style>


