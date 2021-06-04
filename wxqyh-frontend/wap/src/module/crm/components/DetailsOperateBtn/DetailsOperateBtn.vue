<template>
  <div>
    <!--详情操作按钮-->
    <div class="qwui-bottomOperateBtn" v-if="clientType">
      <div class="bottomButton commentBtn" v-if="clientButton.edit || clientButton.transfer" @click="comment">
        <p>评论</p>
      </div>
      <div class="bottomButton inputBox" v-if="!clientButton.edit && !clientButton.transfer">
        <div class="input" @click="clickInput">评论一句吧</div>
      </div>
      <div class="bottomButton editBtn" v-if="clientButton.edit" @click="edit">
        <p>编辑</p>
      </div>
      <div class="bottomButton transferBtn" v-if="clientButton.transfer" @click="transfer">
        <p>转移</p>
      </div>
      <div class="bottomButton moreBtn" :class="{noBottomBtn:!clientButton.edit && !clientButton.transfer}" v-if="hasMore" @click="more">
        <p>更多</p>
      </div>
    </div>

    <!--公海详情操作按钮-->
    <div class="qwui-bottomOperateBtn" v-if="poolType">
      <div class="bottomButton editBtn"  v-if="poolButton.isMgrPrePerson && poolButton.poolEdit" @click="poolEdit">
        <p>编辑</p>
      </div>
      <div class="bottomButton distributeBtn"  v-if="poolButton.isMgrPrePerson && poolButton.distribute" @click="distribute">
        <p>分配</p>
      </div>
      <div class="bottomButton transferPoolBtn"  v-if="poolButton.isMgrPrePerson && poolButton.transferPool" @click="transferPool">
        <p>转公海</p>
      </div>
      <div class="bottomButton receiveBtn"  v-if="!poolButton.isMgrPrePerson" @click="receive">
        <p>领取该客户</p>
      </div>
      <div class="bottomButton delPoolBtn" v-if="delPoolBtn()" @click="del">
        <p>删除</p>
      </div>
      <div class="bottomButton moreBtn"  v-if="poolMoreBtn()" @click="poolMore">
        <p>更多</p>
      </div>
    </div>

    <!--更多操作按钮-->
    <transition name="fade" v-if="isShowMore" >
      <div class="qwui-detail-mask"  @click="closeMore"></div>
    </transition>
    <transition name="slide-fade">
      <div class="qwui-moreBtn" v-if="isShowMore">
        <div class="des_moreButton remindBtn" v-if="clientType && remind" @click="remind"><!--客户按钮-->
          <p>自动提醒设置</p>
        </div>
        <div class="des_moreButton changePoolBtn" v-if="clientType && clientButton.changePool" @click="changePool"><!--客户按钮-->
          <p>变更公海</p>
        </div>
        <div class="des_moreButton returnBtn" v-if="clientType && clientButton.returnPool" @click="returnPool"><!--客户按钮-->
          <p>退回客户到公海</p>
        </div>
        <div class="des_moreButton recoveryBtn" v-if="clientType && clientButton.recovery" @click="recovery"><!--客户按钮-->
          <p>回收到公海</p>
        </div>
        <div class="des_moreButton frozenBtn" v-if="poolType && poolButton.frozen" @click="frozen"><!--公海按钮-->
          <p>冻结</p>
        </div>
        <div class="des_moreButton discardBtn" v-if="poolType && poolButton.discard" @click="discard"><!--公海按钮-->
          <p>废弃</p>
        </div>
        <div class="des_moreButton delBtn" v-if="poolType || clientButton.del"  @click="del">
          <p>删除</p>
        </div>
        <div class="des_moreButton cancelBtn" v-if="clientType || poolType" @click="closeMore">
          <p>取消</p>
        </div>
      </div>
    </transition>


    <!--选人组件-->
    <user_select
      :selectconfig="dataBase.selectConfig"
      :closeAllTab="true"
      :closeGroup="true"
      :closeDept="true"
      :tabActive="'user'"
      :userListUrl="userListUrl"
      :keyWordSearchUrl="keyWordSearchUrl"
      :letterSearchUrl="letterSearchUrl"
      :userSelectType="'onlyUser'"
      v-if="showSignatory"
    ></user_select>
  </div>

</template>

<script>
  import user_select from '@/components/base/user_or_dept_select';
  import {
    deleteClient,
    returnClient,
    recoveryClient,
    transferClient} from '../../api/client/getData.js';
  import {
    distributeClient,
    frozenClient,
    discardCleint,
    poolDelClient,
    poolReceiveClient} from '../../api/pool/getData.js';
  import { mapActions } from 'vuex';
    export default {
      components:{
        user_select,
      },
      data() {
        return {
          dataBase:dataBase,
          isShowMore:false,//是否显示更多按钮
          hasMore:true,//客户详情更多按钮
          hasPoolMore:true,//公海详情更多按钮
          buttonConfig:{
            primaryBtn:{name:"确定",callBack:null},
            defaultBtn:{name:"取消", callBack:null}
          },
          showSignatory:false,
          param:{},//选人调接口参数
          userListUrl:"",
          keyWordSearchUrl:"",
          letterSearchUrl:"",
        }
      },
      props:{
        clientType:{ //客户详情
          type: Boolean,
          default: false,
        },
        poolType:{ //公海详情
          type: Boolean,
          default: false,
        },
        clientButton:{//客户按钮
          edit:{ //编辑
            type: Boolean,
            default: false,
          },
          transfer:{ //转移给他人
            type: Boolean,
            default: false,
          },
          remind:{ //自动提醒
            type: Boolean,
            default: true,
          },
          changePool:{ //变更公海
            type: Boolean,
            default: false,
          },
          returnPool:{ //退回
            type: Boolean,
            default: false,
          },
          recovery:{ //回收
            type: Boolean,
            default: false,
          },
          clientId:{//客户id
            type: String,
            default: "",
          },
          poolId:{//公海池id
            type: String,
            default: "",
          }
        },
        poolButton:{//公海按钮
          poolEdit:{ //编辑
            type: Boolean,
            default: true,
          },
          distribute:{ //分配
            type: Boolean,
            default: true,
          },
          transferPool:{ //转移到其他公海
            type: Boolean,
            default: true,
          },
          frozen:{ //冻结
            type: Boolean,
            default: true,
          },
          discard:{ //废弃
            type: Boolean,
            default: true,
          },
          isMgrPrePerson:{ //是否公海负责人
            type: Boolean,
            default: true,
          },
          poolId:{//公海池id
            type: String,
            default: "",
          },
          clientId:{//公海客户id
            type: String,
            default: "",
          },
        }

      },
      created(){
        this.dataBase.selectConfig.selectList.signatory = {
          "title":"",
          "selectType": "user",
          "userName": "relatives",
          "userSelected": [],
          "deptSelected":[],
          "deptSelectedShow": false,
          "userRestriction": 1, // 单选
          "callBack": {
            "confirm": null,
          }
        }
        this.dataBase.selectConfig.selectList["signatory"].callBack.confirm = this.confirmUser;
        this.dataBase.selectConfig.selectList["signatory"].callBack.close = this.cancelUser;
      },
      methods:{
        ...mapActions('list',[
          'delCacheArray'
        ]),

        //显示公海池删除按钮
        delPoolBtn:function(){
          return (this.poolButton.isMgrPrePerson && !(this.poolButton.poolEdit || this.poolButton.distribute || this.poolButton.transferPool));
        },

        //显示公海池扩展按钮
        poolMoreBtn:function(){
          if(this.poolButton.poolEdit || this.poolButton.distribute || this.poolButton.transferPool){
            this.hasPoolMore=true;
          }else{
            this.hasPoolMore=false;
          }
          return this.poolButton.isMgrPrePerson && this.hasPoolMore;
        },

        //客户底部按钮
        comment:function(){ //评论
          this.$emit("showChatTool");
        },
        edit:function(){//编辑
          this.$router.push({path:'/clientOperate',query:{clientId:this.clientButton.clientId}});
          this.closeMore();
        },
        transfer:function(){//转移客户
          this.openSelectUser();
          this.closeMore();
        },
        clickInput:function () { //评论输入框
          this.$emit("showChatTool");
        },
        more:function(){//客户更多
          this.isShowMore=true;
        },

        //公海底部按钮
        poolEdit:function(){//公海编辑
          this.$router.push({path:'/poolOperate',query:{poolId:this.poolButton.clientId}});
          this.closeMore();
        },
        distribute:function(){//分配
          this.openSelectUser();
          this.closeMore();
        },
        transferPool:function(){//转移到其他公海
          this.$router.push({path:'/PoolTransferList',query:{id:this.poolButton.clientId,type:'transferPool'}});
          this.closeMore();
        },
        poolMore:function(){//公海更多
          this.isShowMore=true;
        },
        receive:function(){//领取
          this.doReceive();
          this.closeMore();
        },

       //  更多按钮
        remind:function(){//自动提醒设置
          this.$router.push({path:'/clientRemind',query:{clientId:this.clientButton.clientId}});
          this.closeMore();
        },

        changePool:function(){//变更公海
          this.$router.push({path:'/PoolTransferList',query:{id:this.clientButton.clientId,type:'changePool'}});
          this.closeMore();
        },

        returnPool:function(){//退回
          _.alert('提示', '退回公海后将同时退回其商机，确定退回公海吗',this.buttonConfig);
          this.buttonConfig.primaryBtn.callBack=this.doReturn;
          this.closeMore();
        },

        recovery:function(){//回收
          _.alert('提示', '回收客户将把客户以及客户未签约商机回收到公海，确定回收吗？',this.buttonConfig);
          this.buttonConfig.primaryBtn.callBack=this.doRecovery;
          this.closeMore();
        },

        frozen:function(){//冻结
          _.alert('提示', '冻结适用于一段时间内没有新增商机的客户，冻结公海客户后将不能领取和分配客户，点击恢复可将客户还原，确定冻结该客户？',this.buttonConfig);
          this.buttonConfig.primaryBtn.callBack=this.doFrozen;
          this.closeMore();
        },

        discard:function(){//废弃
          _.alert('提示', '废弃适用于不再具有可挖掘商机的客户，废弃公海客户将把客户移到回收站，客户记录不会被删除，点击恢复可将客户还原，确定废弃该客户吗？',this.buttonConfig);
          this.buttonConfig.primaryBtn.callBack=this.doDiscard;
          this.closeMore();
        },

        del:function(){//删除
          if(this.$route.matched[0].path=='/ClientDetails'){
            _.alert('提示', '只能删除没有商机、拜访和联系人记录的客户，确定删除吗？',this.buttonConfig);
            this.buttonConfig.primaryBtn.callBack=this.doDel;
          }else{
            _.alert('提示', '删除公海客户将同时删除该客户关联的商机和合同，清空联系人和拜访记录，操作不可恢复，确定删除吗？',this.buttonConfig);
            this.buttonConfig.primaryBtn.callBack=this.doPoolDel;
          }
          this.closeMore();
        },

        closeMore:function(){//取消
          this.isShowMore=false;
        },

        //转移客户
        doTransfer:function(){
          transferClient(this.param, () => {
            this.showSignatory = false;
            this.$router.go(0);//转移后刷新页面
          })
        },

        // 退回客户到公海
        doReturn:function(){
          returnClient(this.clientButton.clientId,() =>{
            this.$router.go(0);//转移后刷新页面
          })
        },

        // 回收客户
        doRecovery:function(){
          recoveryClient(this.clientButton.clientId,() =>{
            this.$router.go(0);//转移后刷新页面
          });
        },

        // 删除客户
        doDel:function(){
          deleteClient(this.clientButton.clientId,() =>{
            this.$router.replace({path:"/clientList/isread"})
            this.delCacheArray('ClientList'); //清除客户列表缓存
          });
        },

        // 分配
        doDistribute:function(){
          distributeClient(this.param, () => {
            this.showSignatory = false;
            this.$router.replace({path:"/PoolList"})
            this.delCacheArray('PoolList'); //清除公海池客户列表缓存
          })
        },

        // 冻结
        doFrozen:function(){
          let obj={
            "id":this.poolButton.clientId,
            "poolId":this.poolButton.poolId,
          }
          frozenClient(obj, ()=>{
            this.$router.go(0);//转移后刷新页面
            this.delCacheArray('PoolList'); //清除公海池客户列表缓存
          })
        },

        // 废弃
        doDiscard:function(){
          let obj={
            "id":this.poolButton.clientId,
            "poolId":this.poolButton.poolId,
          }
          discardCleint(obj, ()=>{
            this.$router.go(0);//转移后刷新页面
            this.delCacheArray('PoolList'); //清除公海池客户列表缓存
          })
        },

        // 公海删除客户
        doPoolDel:function(){
          let obj={
            "id":this.poolButton.clientId,
            "poolId":this.poolButton.poolId,
          }
          poolDelClient(obj, ()=>{
            this.$router.replace({path:"/PoolList"})
            this.delCacheArray('PoolList'); //清除公海池客户列表缓存
          });
        },

        //领取
        doReceive:function(){
          let obj={
            "id":this.poolButton.clientId,
            "poolId":this.poolButton.poolId,
          }
          poolReceiveClient(obj,() => {
            this.$router.replace({path:"/PoolList"})
            this.delCacheArray('PoolList'); //清除公海池客户列表缓存
          })
        },



        // 打开选人页面
        openSelectUser:function(){
          let self=this;
          //如果是默认公海，公海池分配和客户详情转移的选人数据同步通讯录
          if((this.poolButton!=undefined && this.poolButton.poolId == 0) || (this.clientButton!=undefined && this.clientButton.poolId == 0)){
            this.userListUrl="/portal/selectUserAction!ajaxGetUserListByOrgID.action";//字母排序人员接口
            this.keyWordSearchUrl="/portal/selectUserAction!searchByNameOrPhone.action";//关键词查询接口
            this.letterSearchUrl="/portal/selectUserAction!searchFirstLetter.action";//字母开头选择查询接口
          }else{ //如果是具体公海，选人数据为公海池成员
            if(this.$route.matched[0].name === 'poolDetails'){ //公海池分配
              this.userListUrl="/portal/clientPoolAction!getPoolMember.action?poolId="+self.poolButton.poolId;
              this.keyWordSearchUrl="/portal/clientPoolAction!getPoolMember.action?poolId="+self.poolButton.poolId;
              this.letterSearchUrl="/portal/clientPoolAction!getPoolMember.action?poolId="+self.poolButton.poolId;
            }else{ //客户详情转移
              this.userListUrl="/portal/clientPoolAction!getPoolMember.action?poolId="+self.clientButton.poolId;
              this.keyWordSearchUrl="/portal/clientPoolAction!getPoolMember.action?poolId="+self.clientButton.poolId;
              this.letterSearchUrl="/portal/clientPoolAction!getPoolMember.action?poolId="+self.clientButton.poolId;
            }
          }
          this.dataBase.selectConfig.signIndex = 'signatory';
          this.showSignatory=true;
        },

        //  确定选人
        confirmUser:function(el, obj){
          let {data} = obj.user;
          if(this.$route.matched[0].name === 'poolDetails'){ //公海池详情分配客户
            this.param={
              'userId':data[0].userId,
              'clientIds':this.poolButton.clientId,
            }
            if(this.poolButton.poolId == 0){ //如果是默认公海
              this.param.poolId=this.poolButton.poolId;//默认公海id
            }else{
              this.param.poolId=data[0].poolId;
            }
            this.doDistribute();
          }else{  //普通详情客户转移
            this.param={
              'userId':data[0].userId,
              'clientId':this.clientButton.clientId,
            }
            _.alert('提示', '客户转移后将无法恢复，请确定是否转移给'+data[0].personName,this.buttonConfig);
            this.buttonConfig.primaryBtn.callBack=this.doTransfer;
          }
        },

        //  取消选人
        cancelUser:function(){
          this.showSignatory = false;
        }

      }
    }
</script>

<style scoped>
  @import "./DetailsOperateBtn.scss";
</style>
