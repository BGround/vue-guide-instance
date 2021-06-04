<template>
  <div class="wrap" v-windowscroll="scrollList">
    <div class="qwui-check_detail_box">
      <!--考勤详情头部-->
      <div class="qwui-check_head_box">
        <div class="qwui-check_time">{{detailData.newTime}}</div>
        <div class="qwui-check_username">{{detailData.userName}}</div>
        <div class="qwui-check_type" v-if="detailData.checkType == '2'">
          <span class="">打卡次数</span>
          <span class="">{{listData.length}} 次</span>
        </div>
        <div class="qwui-check_count_time">
          <span class="">工作时长</span>
          <span class="qwui-count_time" :class="{'qwui-red_color' : countWork }">{{doCountTime}}</span>
          <span class="qwui-time_title" :class="{'qwui-red_color' : countWork }">小时</span>
          <span v-if="countWork" class="qwui-red_color">( 时长不足 )</span>
          <a :href="openAddCheckwork()" v-if="showBtnCW">继续考勤</a>
        </div>
      </div>
      <!--规则详情-->
      <div class="qwui-check_rule_detail" @click="clickToDetail">
        <span class="">{{detailData.checkWorkName}}</span>
        <p class="rule_detail_enter">详情</p>
      </div>
      <!--考勤打卡信息-->
      <div class="qwui-check_info_box">
        <ul v-for=" (item,index) in listData" :key="index">
          <li class="qwui-sign_address_li">
            <div class="qwui-sign_address_box">
              <!--左侧栏-->
              <div class="qwui-info_box_left">
                <p class="qwui-info_left_signtype">
                  <span>
                  {{item.signType ==1 ? "签到" : "签退"}}
                  </span>
                </p>
                <p class="qwui-info_left_time">
                  {{item.signinTime}}
                </p>
              </div>
              <!--中间栏-->
              <div class="qwui-info_box_center">
                <p>
                  <i v-if="item.signAddress"></i>
                  <span class="qwui-sign_address" @click="showMap(item,index)">
                  {{item.signAddress}}
                  </span>
                </p>
                <p class="qwui-sign_type_box">
                  <span class="qwui-sign_type">{{checkStatusObj[item.status]}}</span>
                  <span class="qwui-sign_type_remark" v-if="item.content || item.picList.length > 0" @click="toggle(index)">备注</span>
                </p>
                  <!--备注内容-->
                <div class="qwui-check_remark" v-show="index == num">
                  <div>{{item.content}}</div>
                  <!--图片附件-->
                  <div class="qwui-tupian_box" v-if="item.picList.length > 0">
                    <div v-for="list in item.picList">
                      <img :src="dealImagesUrl(list.picPath)" @click="preview(list.picPath,item.picList)">
                    </div>
                  </div>
                </div>
              </div>
              <!--右侧栏-->
              <div class="qwui-info_box_right">
                <div
                  class="qwui-sign_time"
                  v-if="item.signTime"
                  :class="{'qwui-red_color' : item.status != 1 }"
                >
                  {{item.signTime | filtersSignTime}}
                </div>
                <div class="qwui-no_sign_time" v-if="!item.signTime">暂无考勤数据</div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!--异常申诉操作按钮-->
      <div class="qwui-bottom_btn" v-if="isRepSign">
        <flow_button :buttondata="buttonConfig"></flow_button>
      </div>
      <!--已通知一下人员查看-->
      <user-select :userselect="userSelect"></user-select>
      <!--评论列表-->
      <comment_list
        :commentList="commentList"
        :hiddenSwitch=true
        :totalRow="listTotalRows"
        @atThisPersonUtil="atThisPersonUtil"
        @delete="deleteThisComment"
        :dealListDelete="dealListDelete"
        :dealListIcon = "dealListIcon"
      >
      </comment_list>
      <!--加载更多-->
      <Load_more :loading="loading"
                 :type="'commentList'"
                 :hasMore="hasMore"
                 @loadMoreClick="loadMoreList">
        <span class="qwui-pinglun_no_text" v-if="!listTotalRows">还没有任何评论</span>
      </Load_more>
      <div class="qwui-footer_height"></div>
    </div>
    <!--底部评论框-->
    <div class="qwui-comment_input_box"  @click="showChatClick">
      <div class="comment_btn_add">
        <input class="comment-chat_input" type="text" placeholder="评论一句吧">
      </div>
    </div>
    <!--评论输入框组件-->
    <chatInput
      :show.sync="showChatTool"
      :autofocus.sync="autofocus"
      :dataBase="dataBase"
      :agent="agent"
      @updateContent="updateContent"
      @closeChat="closeChatMask">
    </chatInput>
    <!--@人相关人组件-->
    <user_select_box :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select_box>
    <!--地图组件-->
    <tencent-map v-if="locationInfo.showMap"
                 :pos="locationInfo"
                 :type="type"
                 @closeMap="closeMap"
    >
    </tencent-map>
    <!--负责人、相关人详细列表-->
    <user-show :userselect="userSelect"></user-show>
    <!--预览图片组件-->
    <previewImages></previewImages>
  </div>
</template>

<script>
  import tencentMap from '@/components/add/tencentMap.vue';
  import flow_button from '@/components/button/flow_button';
  import userSelect from '@/components/detail/user_select';
  import userShow from '@/components/base/user_show';
  import user_select_box from '@/components/base/user_or_dept_select';
  import comment_list from '@/components/list/comment_list';
  import Load_more from '@/components/list/load_more';
  import chatInput from '@/components/detail/chatInput';
  import {commentListMore,deleteCommentList,checkHasDaily,checkDetailAddCommentList,getCheckDetail} from "../../api/getData";
  import {getNextSignDate,getBeforeSignDate,checkIsSignTimeRep} from "../../js/repCommon";
  import EventBus from '@/utils/eventBus';
  import previewImages from "@/components/base/previewImages";
export default {
  name: "check_detail",
  components: {
    tencentMap,
    flow_button,
    userSelect,
    userShow,
    user_select_box,
    comment_list,
    Load_more,
    chatInput,
    previewImages,
  },
  data() {
    return {
      dataBase:dataBase,
      buttonConfig:{},
      hasElastic:false,//不是弹性工作考勤
      countWorkIs:false,
      countTimeShow:0,
      detailData:{},
      listData:[],
      checkStatusObj:{
        "1": "",    // 正常
        "2": "迟到",
        "3": "早退",
        "4": "迟到 偏移位置",
        "5": "早退 偏移位置",
        "6": "偏移位置",
        "7": "迟到 ip异常",
        "8": "早退 ip异常",
        "9": "ip异常",
        "10": "请假",
        "11": "出差",
        "12": "请假出差"
      },
      type:"showPosition",
      userListConfig:{},

      loading:false,
      hasMore:false,
      lock_roll:false,
      currentPage:1,
      commentStatus:"1",
      listTotalRows:0,
      agent:'checkwork',
      commentList:[],         //评论列表
      commentValue: '',      //评论输入框的值
      showChatTool:false,  //显示评论输入框
      autofocus:false,
      deleteListIndex:"",//需要删除的index
      dealListDelete:function(item){//评论删除按钮的显示
        const status=(item.status||item.commentStatus);
        const time=item.time;
        const creator=item.creator || item.userId || item.createPerson;
        if(creator == _.userId &&
          (time =="刚刚"|| (time.indexOf("分钟前")!=-1 && parseInt(time.split("分钟前")[0])<30))){
          return  status=="9"||status == 0 ||status == "6";
        }else{
          return false;
        }
      },//评论删除按钮显示控制
      dealListIcon:function (item) {
        let status = item.status||item.commentStatus;
        let icon = {
          '2': "qwui-meeting_icon icon_icon6",
          '3': "qwui-meeting_icon icon_icon7"
        }
        return icon[status]? icon[status] : ''
      },//已阅or已修改显示控制
      locationInfo: {  // 地图信息
        showMap: false,
        latitude: '',
        longitude: '',
        value: ''
      },
      hasPic:false,
      num:9999,
      hasRepSign: false,//false：没有可申诉的签到/退；true：有可申诉的签到/退
      isRepSign:false,//不能申诉考勤异常
      isRepToday:false,//申诉的不是今天的考勤异常
    };
  },
  created() {
    this.getDetailData();
  },
  filters: {
    filtersSignTime: function (val) {
      if (!val) return '';
      return val.replace(/(\d{4})\-(\d{2})\-(\d{2})/,"");
    },
  },
  computed:{
    userSelect:function(){  //负责人、相关人
      return this.userListConfig;
    },
    countWork:function () {
      if(this.hasElastic){
        if("2" === this.detailData.signStatus && this.elasticWorkHour && parseFloat(this.detailData.countTime) < parseFloat(this.detailData.elasticWorkHour)){//2:总考勤状态异常，并且总考勤时长比弹性工作时长小
          this.countWorkIs = true;
        }
      }
      return this.countWorkIs;
    },
    doCountTime:function () {
      if(this.detailData.countTime && this.detailData.countTime !== '0.0'){
        this.countTimeShow = this.detailData.countTime;
      }
      return this.countTimeShow
    },
    showBtnCW(){
      //显示继续考勤按钮
      if(this.detailData.creator == _.userId && "1" == this.detailData.isGin){
        if(_.isWeChatApp()){
          return true
        }
      }
      return false
    }
  },
  methods: {
    //继续考勤
    openAddCheckwork(){
      return _.baseURL + "/jsp/wap/checkwork/add.jsp?id=" + this.detailData.roleId;
    },
    //显示备注
    toggle(index) {
      this.num = index;
    },
    showChatClick(){
      this.showChatTool = true;
      this.autofocus = true
    },
    //打开地图
    showMap(item,index){
      if(!item.pageId && !item.machineId && item.longitude && item.latitude){
        this.locationInfo.showMap = true;
        this.locationInfo.latitude = Number(this.listData[index].latitude).toFixed(6);//保留六位小数
        this.locationInfo.longitude = Number(this.listData[index].longitude).toFixed(6);//保留六位小数
        this.locationInfo.value = this.listData[index].signAddress;
      }
    },
    //关闭地图
    closeMap() {
      this.locationInfo.showMap = false
    },
    // 点击进入规则详情页面
    clickToDetail(){
      this.$router.push({
        path:"ruleDetail",
        query:{id:this.detailData.roleId}
      });
    },
    //获取地址栏参数 获取问号后的参数的值?client=123
    getParam(name) {
      return location.href.match(new RegExp('[?#&]' + name + '=([^?#&]+)', 'i')) ? RegExp.$1 : '';
    },
    //点击进入新增考勤申诉页面
    turnToAdd(){
      let infoId = this.getParam("id");
      let msg = {"infoIds" : this.getParam("id")};
      let self = this;
      if(!this.isRepSign){
        _.alert("i18n.notice","不能申诉该天考勤的异常！");
        return;
      }
      if(this.isRepToday){//申述的是今天的考勤异常
        if(!infoId){
          _.alert("i18n.notice","该考勤已被删除，不能申诉！");
          return;
        }
        checkHasDaily(msg,function (result) {
          let hasDaily = result.hasDaily;
          if(hasDaily){
            self.$router.push({
              path:"/add",
              query:{
                infoIds:self.getParam("id"),
                isRepToday:"1",
                fromType:"1" //1：表示是考勤详情页面进入
              }
            });
          }else{
            _.alert("i18n.notice","正在生成日报，请稍候再试。");
          }
        })
      }else{
        this.$router.push({
          path: "/add",
          query: {
            infoIds:self.getParam("id"),
            fromType:1
          }//1：表示是考勤详情页面进入
        });
      }
    },
    dealImagesUrl(url){ //图片路径
      if(url.indexOf("http")!=-1){
        return url;
      }
      return (_.compressURL+url).replace('/compress/','/');
    },
    //预览图片
    preview (src,list) {
      EventBus.$emit("previewImages",(_.compressURL+src).replace('/compress/','/'),list);
    },
    //获取初始考勤详情数据
    getDetailData() {
      let self = this;
      let msg = {
        page: 1,
        id: self.getParam("id"),
        size: 10
      };
      getCheckDetail(msg,function (result) {
        let data = result;
        self.detailData = data;
        self.listData = data.list;
        let signStatus = data.signStatus;
        let checkType = data.checkType;  // 考勤规则类型（0：固定考勤；1：排班考勤；2：自由考勤）
        let signCardType = data.signCardType; //打卡方式(1:上下班均打卡;2:只需上班打卡;3:自由打卡)
        let isElastic = data.isElastic; //是否启用弹性工作时长考勤（0：禁用；1：启用）
        if("0" == checkType && 1 == signCardType && "1" == isElastic){ //0：固定考勤;1:上下班均打卡;1：启用
          self.hasElastic = true; //是弹性工作考勤
        }
        let hasTodayCheckwork = false;//不是今天的考勤
        if(data.creator == _.userId && "1" == data.isGin){
          hasTodayCheckwork = true;//是今天的考勤
        }
        let listArr = data.list;
        let hasSignException = false;//没有考勤或考勤是正常的或有考勤但是请假
        let refreshTimeMin = data.refreshTimeMin;
        let nowDateYMDHMS = data.nowDateYMDHMS;
        let nowDate  = new Date(nowDateYMDHMS);
        let signDateDesc = data.createTime.replace("-", "/").replace("-", "/").substring(0, 10);
        let nextSignDateDesc;
        let beforeSignDateDesc;
        if(hasTodayCheckwork && signDateDesc){
          nextSignDateDesc = getNextSignDate(signDateDesc);
          beforeSignDateDesc = getBeforeSignDate(signDateDesc);
        }
        let hasRep;
        let refreshTimeType = data.refreshTimeType;
        if(listArr && listArr.length>0){
          let isOk = true; //所有考勤明细状态都正常
          for (let i = 0; i < listArr.length; i++) {
            let vo = listArr[i];
            let status = vo.status;	// 考勤状态
            if ("1" != status) { //1：考勤状态正常
              isOk = false; //所有考勤明细状态有一个或多个有异常
            }
            if (vo.signTime != "") {
              if ("1" != status && "10" != status && "11" != status && "12" != status) {
                self.hasRepSign = true;//有申诉的签到/退
                hasSignException = true;//有考勤并且考勤异常（不包括请假）
              }
            } else {
              if (hasTodayCheckwork) { //当天考勤才判断当前时间大于规则规定的考勤时间才可以申诉
                hasRep = checkIsSignTimeRep(signDateDesc, refreshTimeMin, vo.signinTime, nowDate, nextSignDateDesc, refreshTimeType, beforeSignDateDesc);
                if (hasRep) {
                  hasSignException = true;//没有考勤，但是当前时间大于规则规定的考勤时间时，也可以申诉
                }
              } else {
                hasSignException = true;//没有考勤，但是当前时间大于规则规定的考勤时间时，也可以申诉
              }
              self.hasRepSign = true;//没有考勤也可以申诉
            }
            if (self.hasElastic) { //是弹性工作考勤
              if ("2" == signStatus && isOk) { //若总考勤状态异常并且考勤明细状态都正常，那么是弹性工作时长不够
                if (!hasTodayCheckwork) { //不是今日考勤时，弹性工作时长不够才能申诉
                  self.hasRepSign = true;//弹性工作时长不够也可以申诉
                  hasSignException = true;//有考勤并且弹性工作时长不足
                }
              }
            }
          }
        }
        if(data.isRep && 1 == data.isRep){//显示申诉按钮
          if(hasTodayCheckwork){//今天的考勤
            if(hasSignException){//可以申诉今天的考勤异常
              self.isRepToday = true;//申诉的是今天的考勤异常
              self.isRepSign = true;//能申诉考勤异常
            }
          }else if(self.hasRepSign){//过去的考勤
            if(self.hasRepSign) {//可以申诉过去的考勤异常
              self.isRepSign = true;//能申诉考勤异常
            }
          }
        }
        self.userListConfig = {
          toPersonList:{
            title:"已通知以下人员查看",
            show:false,
            userSelected:data.toPersons,
          },
          ccPersonList:{
            title:"",
            show:false,
            userSelected:[],
          }
        };
        for (let i=0;i<self.listData.length;i++) {
          self.listData[i]["title"] = "";//兼容组件，避免indexOf报错;
        };
        //评论列表
        if(data.comments){
          self.hasMore = data.hasMore;
          self.showCommentList(data.comments.pageData, data.hasMore ,data.comments.totalRows);
        };
        if(data.creator == _.userId){//判断创建人ID 是否和当前登录人的ID相等，如果相等当前登录人就是创建人,则显示相关按钮；
          self.buttonConfig = { //操作按钮
            primaryList:[{type:"primary",name:'i18n.addCheckWork',callBack:self.turnToAdd}],
            defaultList:[],
            style:{class:""}//按钮是否置底部 active :底部、"":相对定位
          }
        }
      });
    },
    /*评论列表相关操作 start */
    atThisPersonUtil(user){                                            // 查看个人头像信息
      if(user){
        EventBus.$emit("atThisPersonUtil",user);
      }
    },
    scrollList(){                                                // 滚动更多列表
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
        if(!this.lock_roll && this.hasMore){
          this.lock_roll=true;
          this.currentPage++;
          this.loadMoreList(status);
        }
      }
    },
    loadMoreList(){                                               // 加载更多列表
      let data={
        size: 10,
        id: this.getParam("id"),
      };
      this.loading=true;
      data.page=this.currentPage;
      commentListMore(data,this.dealCommentList);
    },
    dealCommentList(data){
      let isHasMore = false;
      if(data.comments.currentPage < data.comments.totalPages){
        isHasMore = true;
      }
      this.loading=false;
      this.showCommentList(data.comments.pageData, isHasMore ,data.comments.totalRows)
    },
    showCommentList(data,hasMore,commentCount){                                    // 处理返回的评论
      this.hasMore=hasMore;
      this.lock_roll=false;
      if(data && data.length>0){
        this.commentList.push(...data);
        this.listTotalRows=commentCount? commentCount : Number(this.commentList.length);
      }else{
        this.commentList.length=0;
        this.listTotalRows=0;
      }
    },
    closeChatMask(val){
      this.commentValue = val
    },
    updateContent(data){                                              // 发送评论
      if(data){
        let msg={
          "sendComment": data.content,
          "userIds":'',
          "commentStatus": 6,
          "id": this.getParam("id"),
        };
        data.userIds? msg.userIds=data.userIds:"";
        let self = this;
        checkDetailAddCommentList(msg,function (result) {
          _.tooltips_succeed("评论成功");
          if(result.commentId){
            self.commentList.splice(0,0,{
              id:result.commentId,
              headPic:_.headPic,
              personName:_.personName,
              createPerson:_.userId,
              content:data.content,
              time:"刚刚",
              commentStatus:6,
            });
            self.listTotalRows++;
          }
        });
      }
    },
    deleteThisComment(data,index){                                 // 删除评论
      if(data){
        this.deleteListIndex=index;
        let self = this;
        deleteCommentList({id:data.id},function (result) {  // 删除成功
          self.commentList.splice(self.deleteListIndex,1);
          self.listTotalRows--;
        });
      }
    },
    /*评论列表相关操作 end */
  }
};
</script>

<style scoped>
  .wrap,
  .wrap /deep/ .qwui-user_cell_title{
    background-color: #F7F7F7;
  }
  .wrap /deep/ .qwui-showMoreList{
    background-color:#fff;
  }
  .qwui-check_detail_box{
    position: relative;
    word-wrap: break-word;
    word-break: break-all;
    margin-bottom: 50px;
  }
  .qwui-check_head_box{
    position: relative;
    padding: 0 15px;
    background-color: #fff;
    border-bottom: none !important;
  }
  .qwui-check_time{
    padding: 25px 0 7px 0;
    color: #333;
    font-size: 20px
  }
  .qwui-check_username{
    color: #888;
    font-size: 14px;
    margin-top: 5px;
  }
  .qwui-check_type{
    font-size: 15px;
    margin-top: 30px;
  }
  .qwui-check_count_time{
    font-size: 15px;
    margin-top: 30px;
    padding-bottom: 30px
  }
  .qwui-check_count_time a{
    padding-left: 15px;
    font-size: 15px;
  }
  .qwui-count_time{
    padding-left: 15px;
  }
  .qwui-check_rule_detail{
    position: relative;
    background: #fff;
    margin-bottom: 15px;
    padding: 16px 15px 10px 15px;
    color: #999;
    font-size: 14px;
    line-height: 14px;
    border-top: 1px solid #dfdfdd;
    border-bottom: 1px solid #dfdfdd;
  }
  .qwui-check_rule_detail>span{
    float: left;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 0;
    text-overflow: ellipsis;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .qwui-check_rule_detail>p{
    position: relative;
    color: #999;
    text-align: right;
  }
  .rule_detail_enter{
    position: absolute;
    right: 20px;
    top: 0;
    font-size: 14px;
    color: #999;
  }
  .rule_detail_enter::after{
    position: absolute;
    display: inline-block;
    content: "";
    right: -17px;
    top: 0;
    width: 8px;
    height: 14px;
    font-family: FontAwesome;
    background: url('~assets/images/checkwork/ic_arrow.png') no-repeat;
    background-size: 8px 14px;
  }
  .qwui-check_info_box{
    background-color: #fff;
    padding: 0 15px;
  }
  .qwui-bottom_btn /deep/ .qwui-btn_tab{
    margin-top: 10px;
  }
  .qwui-sign_address_box::before{
    content: "";
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    border-bottom: 1px solid #ddd;
    color: #ddd;
  }
  .qwui-sign_address_box{
    padding: 15px 0;
    position: relative;
  }
  .qwui-info_box_left{
    float: left;
    margin-right: 10px;
    display: block;
  }
  .qwui-info_left_signtype{
    font-size: 16px;
  }
  .qwui-info_left_time{
    color: #999;
    font-size: 12px;
    margin-top: 5px
  }
  .qwui-info_box_center{
    width: 70%;
    margin-left: 42px;
    margin-right: 89px;
  }
  .qwui-info_box_center i{
    float: left;
    display: inline-block;
    width: 13px;
    height: 22px;
    line-height: 22px;
    background: url("~assets/images/checkwork/mapMarker.png") no-repeat left 4px;
    background-size: 13px auto;
  }
  .qwui-sign_address{
    width: 80%;
    padding-left: 3px;
    font-size: 13px;
    color: #999;
    line-height: 1.8;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-sign_type_box{
    vertical-align: center;
    font-size: 13px;
    padding-left: 17px
  }
  .qwui-sign_type{
    max-width: 60%;
    color: #e94f4f;
    margin-right: 10px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }
  .qwui-sign_type_remark{
    display: inline-block;
    color: #576b95;
  }
  .qwui-check_remark{
    width: 80%;
    border: 1px solid #ccc;
    font-size: 12px;
    padding: 10px 25px 10px 8px;
    margin-top: 5px;
    background: #f5f5f5;
    color: #999;
    overflow:hidden
  }
  .qwui-tupian_box img{
    float: left;
    height: 45px;
    width: 45px;
    margin: 5px 5px 5px 0;
  }
  .qwui-info_box_right{
    position: absolute;
    top: 21px;
    right: 0;
    margin-left: 10px;
  }
  .qwui-sign_time{
    width: 64px;
    height: 35px;
    box-sizing: border-box;
    text-align: center;
    line-height: 35px;
    font-weight: 300;
    background: #fbfafc;
    border-radius: 5px;
    border: 1px solid #d6d5d6;
    font-size: 20px;
    color: #467DB9;
  }
  .qwui-red_color{
    color: #e94f4f;
  }
  .qwui-no_sign_time{
    color: #999;
    font-size: 14px;
  }
  @media screen and (min-width: 1024px) {
    .qwui-comment_input_box {
      width: 740px !important;
      margin: 0 auto;
    }
  }
  .qwui-comment_input_box{
    position: fixed;
    z-index: 3;
    bottom: 0;
    width: 100%;
    display: flex;
    line-height: 50px;
    height: 50px;
    vertical-align: middle;
    background-color: #fff;
    box-shadow: 0 -1px 10px 0 rgba(227,228,232,1)
  }
  .comment_btn_add{
    display: flex;
    justify-content: left;
    align-items: center;
    flex: 1;
    margin: 6px 15px;
    padding-left: 10px;
    border-radius: 5px;
    font-size: 15px;
    color: #999;
    text-align: left;
    background: #F5F5F5;
    cursor: pointer;
  }
  .comment-chat_input{
    font-size: 15px;
    background: none;
    width: 100%;
    color: #999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .qwui-check_detail_box /deep/ .qwui-content_word {
    white-space: normal;
  }
  .qwui-footer_height{
    height: 50px;
    background-color: #fff;
  }
  .wrap /deep/ .qwui-commentList_list:last-child  .qwui-commentList_title:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
</style>

