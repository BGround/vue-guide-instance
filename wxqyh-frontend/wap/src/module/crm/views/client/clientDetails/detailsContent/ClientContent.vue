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
      <div class="qwui-createInfo_time">
        <span>成交状态</span><span class="dealStatus" :class="statusColor">{{conditionStatus}}</span>
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
        v-if="item.status"
        @openMap="openMap">
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

    <!--图片附件-->
    <div class="qwui-details_itemPic">
      <div class="qwui-details_itemPicTitle">照片</div>
      <detail_title :titledata="detailPic"  v-if="hasPic" @on-preview="onPreviewImage"></detail_title>
    </div>

    <!--负责人和相关人内容-->
    <user_select :userselect="userSelect"></user_select>

    <!--自动提醒-->
    <div class="qwui-remind" v-if="showRemind">
      <div v-for="(item,index) in remind" :key="index" v-if="item.show">
        <span class="qwui-remind_title">{{item.title}}</span>
        <span>{{item.time}}</span>
        <span v-if="item.remindCycle">|</span>
        <span>{{item.type[item.remindCycle]}}</span>
      </div>
    </div>

    <!--评论列表-->
    <list_comment
      :listcomment="listComment"
      :agent="agent"
      :isShowOnlyCommentBtn="isShowOnlyCommentBtn"
      @showThisPersonUtil="getCreatorDetail">
    </list_comment>

    <!--评论输入框组件-->
    <chat_comment
      :listcomment="listComment"
      :agent="agent"
      :showCrmChatCommentBox="showCrmChatCommentBox"
      @closeCrmChatCommentBox="closeCrmChatCommentBox"
      @dealccPerson="backUserSelect">
    </chat_comment>

    <!--底部操作按钮-->
    <operate-btn
      :clientType="clientType"
      :clientButton="clientButton"
      @showChatTool="showChatToolFun">
    </operate-btn>

    <!--选择人组件-->
    <user_choose :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_choose>

    <!--负责人、相关人详细列表-->
    <user_show :userselect="userSelect"></user_show>

    <!--个人信息-->
    <user_info ref="loadPersonalMsg"></user_info>

    <!--预览图片组件-->
    <!-- <previewImages :urls="previewImageUrl"></previewImages> -->
    <previewImages></previewImages>

    <!--地图组件-->
    <tencentMap
      :type="type"
      :pos="pos"
      v-if="showMap"
      @closeMap="closeMap">
    </tencentMap>
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
  import tencentMap from '@/components/add/tencentMap.vue';
  import detail_title from '@/components/detail/detail_title.vue';
  import operateBtn from '../../../../components/DetailsOperateBtn/DetailsOperateBtn.vue';
  import {getClientDetails} from '../../../../api/client/getData.js';

  import EventBus from '@/utils/eventBus';

  import data from './data.js';
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
      tencentMap,
      detail_title,
      operateBtn
    },
    data(){
      return {
        dataBase:dataBase,
        details:dataBase.details,
        clientData:data,
        nav: data.clients.nav,  //
        centerNav: data.clients.centerNav,  //
        communicationNav: data.clients.communicationNav,  //
        basicList:[],//固定字段
        itemList:[],//自定义字段数据
        detailsData:{},//详情数据
        itemJson:[],
        previewImageUrl:[], //图片预览
        isShowOnlyCommentBtn:false,//是否显示只看评论开关
        agent:'crm',//crm系统消息
        type:'showPosition',  //地图组件参数
        pos:{           //地图组件参数
          latitude:"",
          longitude:"",
          value:""
        },
        showMap:false,//控制地图组件显示隐藏
        add_nav:{ //数据详情头部信息
          title:"",
          content:"",
        },
        hasPic:false,//照片附件列表是否有值
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
        remind:[  //自动提醒
          {title:'提醒时间:',time:"",remindCycle:"",type:['不重复','每天','每周','每月'],show:false},
          {title:'下次提醒:',time:"",type:"",show:false},
          {title:'结束提醒:',time:"",type:"",show:false},
        ],
        showRemind:false, //是否显示自动提醒内容
        clientButton:{
          edit:"",
          transfer:"",
          remind:"",
          changePool:"",
          returnPool:"",
          recovery:"",
          del:"",
          clientId:"",//客户id
        },
        clientType:true,
        showCrmChatCommentBox:false,
        statusColor:'',
        conditionStatus:'',
      }
    },
    computed:{
      userSelect:function(){  //负责人、相关人
        return this.details.userListConfig;
      },
      listComment:function () { //评论数据
        return this.clientData.listComment;
      },
    },
    watch:{
      'detailsData.conditionStatus'(newVal){
        if(newVal){
          this.statusColor = 'green'
          this.conditionStatus = '已成交'
        }else{
          this.statusColor = 'red'
          this.conditionStatus = '未成交'
        }
      }
    },
    created(){
      this.getDetails();
    },
    methods:{

      showChatToolFun:function(){
        this.showCrmChatCommentBox=true; //显示评论框
        this.clientType=false; //隐藏评论底部按钮或输入框
        let height=document.documentElement.scrollHeight || document.body.scrollHeight;
        window.scrollTo({"behavior": "smooth", "top": height})//滚动到评论区
      },

      closeCrmChatCommentBox:function(){
        this.showCrmChatCommentBox=false;
        this.clientType=true;
      },

      //获取客户详情
      getDetails:function(){
        let obj={
          "id":this.$route.query.id,
          "isManager":this.$route.query.isManager,
        }
        getClientDetails(obj,(result) =>{
          this.clientTitle=result.tbCrmClientInfoPO.clientName;
          this.basicList=result.basicList;
          if(result.itemList){
            this.itemList=result.itemList;
          }
          this.detailsData=result.tbCrmClientInfoPO;

          this.clientButton={
            edit:result.isEdit,//编辑
            transfer:result.isChargePerson,//转移到其他公海
            changePool:result.isChangePool,//变更公海
            returnPool:result.isCanRecover,//回收公海
            recovery:result.isPoolPerson,//退回公海
            del:result.isChargePerson,//删除公海
            clientId:result.detailNum.clientId,
            poolId:result.tbCrmClientInfoPO.poolId,//客户所属公海池id
          }
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
          this.nav[0].value=this.detailsData.clientName;
          this.nav[1].value=this.detailsData.typeNames;
          this.nav[2].value=this.detailsData.poolName;
          this.nav[3].value=this.detailsData.clientCode;
          this.centerNav[0].value=this.detailsData.provinceCode+" "+this.detailsData.cityCode+" "+this.detailsData.areaCode;
          this.centerNav[1].value=this.detailsData.address;
          this.centerNav[2].value=this.detailsData.industry;
          this.communicationNav[0].value=this.detailsData.phone;
          this.communicationNav[1].value=this.detailsData.email;
          this.communicationNav[2].value=this.detailsData.website;
          this.communicationNav[3].value=this.detailsData.remark;

          // 根据是否启用智能分级显示
          if (parseInt(this.detailsData.enabledClientGrade) === 1) {
            const obj = {id: 5, divType: 9, optionName: '客户级别', value: this.detailsData.gradeDes, status: true, isWrap:''};
            this.nav[4] = obj;
          }

          //照片,附件,照片预览
          this.detailPic.picList=this.detailsData.picList;
          this.detailPic.mediaList=result.mediaList;
          this.previewImageUrl=this.detailsData.picList;
          this.detailsData.picList.length==0 && this.detailPic.mediaList.length==0? this.hasPic=false: this.hasPic=true;

          //负责人和相关人预览
          this.details.userListConfig.toPersonList.userSelected=this.detailsData.toPersons;
          this.details.userListConfig.ccPersonList.userSelected=this.detailsData.ccPersons;
          this.details.userListConfig.toPersonList.num= this.detailsData.toPersons.length;
          this.details.userListConfig.ccPersonList.num= this.detailsData.ccPersons.length;

          //获取评论数据
          this.clientData.listComment.get.hasMore=result.hasMore; //更多
          this.clientData.listComment.totalPages=result.commentCount.count;
          this.clientData.listComment.send.contentObject="tbCrmCommentPO.content";
          this.clientData.listComment.send.data={
            "tbCrmCommentPO.content": "",
            "userIds":"",
            "userId":_.userId,
            "tbCrmCommentPO.foreignId": this.detailsData.id ,
            "id": this.detailsData.id,
          }
          if(this.clientData.listComment.comments){
            this.clientData.listComment.comments=[];
            result.comments.forEach( item =>{  //给评论加上type==2字段，兼容评论组件评论内容为图片时的显示
              if(item.commentStatus == 0 && this.checkPicURL(item.content)){
                let list=Object.assign({},item,{type:2});
                this.clientData.listComment.comments.push(list);
              }else{
                let list=item;
                this.clientData.listComment.comments.push(list);
              }
            })
          }else{
            this.clientData.listComment.comments=[];
          }

          // 自动提醒
          if(result.remindVO){
            this.showRemind=true;
            this.remind[0].time=result.remindVO.remindTime;
            this.remind[0].remindCycle=result.remindVO.remindCycle;
            this.remind[1].time=result.remindVO.nextSendTime;
            this.remind[2].time=result.remindVO.endTime;
            this.remind[0].show=this.remind[0].time != ""? true:false;
            this.remind[1].show=this.remind[2].time != ""? true:false;
            this.remind[2].show=this.remind[2].time != ""? true:false;
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

      //查看地图
      openMap:function(){
        if(!this.detailsData.latitude && !this.detailsData.longitude){
          _.alert("提示","经纬度不存在")
        }else{
          this.pos.latitude=Number(this.detailsData.latitude);
          this.pos.longitude=Number(this.detailsData.longitude);
          this.pos.value=this.detailsData.address;
          this.showMap=true;
        }
      },

      // 关闭地图
      closeMap:function(){
        this.showMap=false;
      },

      // 点击图片放大预览
      onPreviewImage(src, list) {
        EventBus.$emit("previewImages",src, list);
      }
    }
  }
</script>

<style scoped>
  @import 'ClientContent.scss';

</style>
