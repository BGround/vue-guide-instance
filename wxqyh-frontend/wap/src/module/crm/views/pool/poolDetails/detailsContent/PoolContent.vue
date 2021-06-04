<template>
  <div class="qwui-details_poolContent details_poolContent">
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

    <!--负责人和相关人内容-->
    <user_select :userselect="userSelect"></user_select>

    <!--评论列表-->
    <list_comment
      :listcomment="listComment"
      :agent="agent"
      :isShowOnlyCommentBtn="isShowOnlyCommentBtn"
      @showThisPersonUtil="getCreatorDetail">
    </list_comment>

    <!--底部操作按钮-->
    <operate-btn :poolType="true" :poolButton="poolButton"></operate-btn>

    <!--负责人、相关人详细列表-->
    <user_show :userselect="userSelect"></user_show>

    <!--个人信息-->
    <user_info ref="loadPersonalMsg"></user_info>

    <!--预览图片组件-->
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
  import user_show from '@/components/base/user_show.vue';
  import user_select from '@/components/detail/user_select.vue';
  import user_info from '@/components/detail/user_info_card.vue';
  import list_comment from '@/components/detail/list_comment.vue';
  import previewImages from '@/components/base/previewImages.vue';
  import tencentMap from '@/components/add/tencentMap.vue';
  import detail_title from '@/components/detail/detail_title.vue';
  import operateBtn from '../../../../components/DetailsOperateBtn/DetailsOperateBtn.vue';
  import EventBus from '@/utils/eventBus';
  import {getPoolDetails} from '../../../../api/pool/getData.js';
  import data from './data.js';
  export default {
    components:{
      CrmOperateItem,
      user_select,
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
        poolData:data,
        nav: data.pool.nav,  //
        centerNav: data.pool.centerNav,  //
        communicationNav: data.pool.communicationNav,  //
        basicList:[],//固定字段
        itemList:[],//自定义字段数据
        detailsData:{},//详情数据
        itemJson:[],
        previewImageUrl:[],
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
        },
        poolButton:{
          poolEdit:"",//编辑
          distribute:"",//分配
          transferPool:"",//转公海
          frozen:"",//冻结
          discard:"",//废弃
          isMgrPrePerson:"",//是否公海负责人
          poolId:"",//公海池id
          clientId:"",//公海客户id
        }
      }
    },
    computed:{
      userSelect:function(){  //负责人、相关人
        return this.details.userListConfig;
      },
      listComment:function () { //评论数据
        return this.poolData.listComment;
      },
    },
    created(){
      this.getDetails();
    },
    methods:{
      //获取客户详情
      getDetails:function(){
        let id=this.$router.history.current.query.id;
        getPoolDetails(id,(result) =>{
          this.clientTitle=result.tbCrmPoolClientInfoPO.clientName;
          this.basicList=result.basicList;
          if(result.itemList){
            this.itemList=result.itemList;
          }
          this.detailsData=result.tbCrmPoolClientInfoPO;

          //根据权限，显示隐藏按钮
          if(result.tbCrmPoolClientInfoPO.clientStatus == 3){
            this.poolButton={
              poolEdit:true,
              distribute:false,
              transferPool:false,
              frozen:false,
              discard:false,
            }
          }else if(result.tbCrmPoolClientInfoPO.clientStatus == 4){
            this.poolButton={
              poolEdit:false,
              distribute:false,
              transferPool:false,
              frozen:false,
              discard:false,
            }
          }else{
            this.poolButton={
              poolEdit:true,
              distribute:true,
              transferPool:true,
              frozen:true,
              discard:true,
            }
          }

          if(result.isMgrPrePerson == true){ //是否是公海池负责人，控制底部按钮显示隐藏
            this.poolButton.isMgrPrePerson=true;
          }else{
            this.poolButton.isMgrPrePerson=false;
          }
          this.poolButton.poolId=result.tbCrmPoolClientInfoPO.poolId;
          this.poolButton.clientId=result.tbCrmPoolClientInfoPO.id;


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
          this.nav[1].value=this.detailsData.poolName;
          this.nav[2].value=this.detailsData.clientCode;
          this.nav[3].value=this.detailsData.clientType;
          this.centerNav[0].value=this.detailsData.provinceCode+" "+this.detailsData.cityCode+" "+this.detailsData.areaCode;
          this.centerNav[1].value=this.detailsData.address;
          this.centerNav[2].value=this.detailsData.industry;
          this.communicationNav[0].value=this.detailsData.phone;
          this.communicationNav[1].value=this.detailsData.email;
          this.communicationNav[2].value=this.detailsData.website;
          this.communicationNav[3].value=this.detailsData.remark;

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
          this.poolData.listComment.get.hasMore=result.hasMore; //更多
          this.poolData.listComment.totalPages=result.commentCount.count;
          this.poolData.listComment.get.data={
            "id": this.detailsData.id,
          }
          if(this.poolData.listComment.comments){
            this.poolData.listComment.comments=[];
            result.comments.forEach( item =>{ //给评论加上type==2字段，兼容评论组件评论内容为图片时的显示
              if(item.commentStatus == 0 && this.checkPicURL(item.content)){
                let list=Object.assign({},item,{type:2});
                this.poolData.listComment.comments.push(list);
              }else{
                let list=item;
                this.poolData.listComment.comments.push(list);
              }
            })
          }else{
            this.poolData.listComment.comments=[];
          }
        })
      },

      //判断评论是不是有图片
      checkPicURL(str){
        return str.indexOf('/upload/img/')==-1? false:true;
      },

      //获取创建人详情
      getCreatorDetail:function (creator) {
        if(creator){
          this.$refs.loadPersonalMsg.showUserMessage(creator);
        }
      },

      dataDetailMsg:function(src) {
        return _.compressURL + src;
      },
      //图片预览
      previewImg:function(src,list){
        let previewImageURL = _.compressURL + src;
        EventBus.$emit("previewImages",previewImageURL.replace('/compress',''),list);
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
      }
    }
  }
</script>

<style scoped>
  @import 'poolContent.scss';

</style>
