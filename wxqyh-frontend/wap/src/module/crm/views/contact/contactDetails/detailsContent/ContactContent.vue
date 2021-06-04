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
        v-if="item.status"
        :showWaiBuContactBtn="showWaiBuContactBtn"
        @createQyWxChat="createQyWxChat">
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

    <!--照片-->
    <div class="qwui-details_itemPic">
      <div class="qwui-details_itemPicTitle">照片</div>
      <detail_title :titledata="detailPic"  v-if="hasPic" @on-preview="onPreviewImage"></detail_title>
    </div>

    <!--负责人和相关人内容-->
    <user_select :userselect="userSelect"></user_select>

    <!--编辑按钮-->
    <div class="qwui-contact_editBtn" @click="goEdit" v-if="showEditBtn">
      <button>编辑</button>
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
  import {getContactDetails} from '../../../../api/contact/getData.js';
  import wx from 'weixin-js-sdk';
  import data from './data.js';

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
      detail_title,
    },
    data(){
      return {
        dataBase:dataBase,
        details:dataBase.details,
        contactData:data,
        nav: data.contact.nav,  //
        centerNav: data.contact.centerNav,  //
        communicationNav: data.contact.communicationNav,  //
        basicList:[],//固定字段
        itemList:[],//自定义字段数据
        detailsData:{},//详情数据
        itemJson:[],
        previewImageUrl:[],
        isShowOnlyCommentBtn:false,//是否显示只看评论开关
        agent:'crm',//crm系统消息
        showEditBtn:false, //是否显示编辑按钮
        add_nav:{ //数据详情头部信息
          title:"",
          content:"",
        },
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
        },
        showWaiBuContactBtn:false, //是否显示外部联系人按钮
        qwExternalUserIds:"",
      }
    },
    computed:{
      userSelect:function(){  //负责人、相关人
        return this.details.userListConfig;
      },
      listComment:function () { //评论数据
        return this.contactData.listComment;
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
        getContactDetails(obj,(result) =>{
          this.clientTitle=result.tbCrmContactsInfoPO.clientName;
          this.basicList=result.basicList;
          if(result.itemList){
            this.itemList=result.itemList;
          }
          this.detailsData=result.tbCrmContactsInfoPO;
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

          //固定字段赋值
          this.nav[0].value=this.detailsData.contactsName;
          this.nav[1].value=this.detailsData.clientName;
          this.centerNav[0].value=this.detailsData.mobile;
          this.centerNav[1].value=this.detailsData.position;
          this.centerNav[2].value=this.detailsData.email;
          this.communicationNav[0].value=this.detailsData.birthday;
          this.communicationNav[1].value=this.detailsData.schoolName;
          this.communicationNav[2].value=this.detailsData.hobby;
          this.communicationNav[3].value=this.detailsData.remark;

          //照片,照片预览
          this.detailPic.picList=this.detailsData.picList;
          this.previewImageUrl=this.detailsData.picList;
          this.detailsData.picList==0? this.hasPic=false: this.hasPic=true;

          //负责人和相关人预览
          this.details.userListConfig.toPersonList.userSelected=this.detailsData.toPersons;
          this.details.userListConfig.ccPersonList.userSelected=this.detailsData.ccPersons;
          this.details.userListConfig.toPersonList.num= this.detailsData.toPersons.length;
          this.details.userListConfig.ccPersonList.num= this.detailsData.ccPersons.length;

          //获取评论数据
          this.contactData.listComment.get.hasMore=result.hasMore; //更多
          this.contactData.listComment.totalPages=result.commentCount.count;
          this.contactData.listComment.send.contentObject="tbCrmCommentPO.content";
          this.contactData.listComment.send.data={
            "tbCrmCommentPO.content": "",
            "userIds":"",
            "userId":_.userId,
            "tbCrmCommentPO.foreignId": this.detailsData.id ,
            "id": this.detailsData.id,
          }
          if(this.contactData.listComment.comments){
            this.contactData.listComment.comments=[];
            result.comments.forEach( item =>{ //给评论加上type==2字段，兼容评论组件评论内容为图片时的显示
              if(item.commentStatus == 0 && this.checkPicURL(item.content)){
                let list=Object.assign({},item,{type:2});
                this.contactData.listComment.comments.push(list);
              }else{
                let list=item;
                this.contactData.listComment.comments.push(list);
              }
            })
          }else{
            this.contactData.listComment.comments=[];
          }

          //是否显示编辑按钮
          let isCharge=""; //是否负责人
          this.detailsData.toPersons.forEach(function(item){
            isCharge = _.userId==item.userId ? true:false;
          })
          if( _.userId==this.detailsData.creator || isCharge){
            this.showEditBtn=true
          }else{
            this.showEditBtn=false;
          }

          //显示外部联系人按钮
          this.qwExternalUserIds = this.detailsData.openId;
          if(this.qwExternalUserIds!='' && this.qwExternalUserIds!='0'){
            this.showWaiBuContactBtn = true;
          }
        })
      },

      //判断评论是不是有图片
      checkPicURL(str){
        return str.indexOf('/upload/img/')==-1? false:true;
      },

      //点击编辑
      goEdit:function(){
        let id=this.$router.currentRoute.query.id;
        this.$router.push({path:'/contactOperate',query:{contactId:id}});
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


      //外部联系人
      createQyWxChat:function(){
        if(!_.isQiyeweixinApp() && !_.isQiyeweixin()){
          _.alert("提示","请在企业微信客户端中使用会话功能","确定");
        } else {
          wx.openEnterpriseChat({
            //userIds: qwUserIds,    //参与会话的企业成员列表
            externalUserIds: this.qwExternalUserIds, // 参与会话的外部联系人列表
            groupName: '',
            success: function(res) {

            },
            fail: function(res) {
              if(res.errMsg.indexOf('function not exist') > -1){
                alert('版本过低请升级')
              }
            }
          });
        }
      },

      // 点击图片放大预览
      onPreviewImage(src, list) {
        EventBus.$emit("previewImages",src, list);
      }
    }
  }
</script>

<style scoped>
  @import 'ContactContent.scss';

</style>

