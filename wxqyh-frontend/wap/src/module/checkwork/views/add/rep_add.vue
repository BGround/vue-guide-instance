<template>
  <div class="wrap">
    <!--异常日期-->
    <p class="qwui-add_rep_time">{{abnormalData.signDate | filtersSignDate}}</p>
    <!--不存在可申诉的考勤异常-->
    <div class="qwui-has_nocontent_box" v-if="!isHasContent">
      <p v-if="abnormalData.signDate">{{$t('i18n.noRepContentText')}}</p>
      <!--底部操作按钮-->
      <flow_button :buttondata="buttonConfig"></flow_button>
    </div>
    <!--存在可申诉的考勤异常-->
    <div class="qwui-has_content_box" v-show="isHasContent">
      <!--考勤异常信息-->
      <!--新增申诉-->
      <div class="qwui-yichang_box" v-if="queryType !== 'edit'">
        <ul v-for="(item,index) in abnormalData.csdList" :key="index">
          <li>
            <!-- 规则名 -->
            <div class="qwui-checkwork_name" v-if="item.isHasList || item.repHtml">
              {{item.icvo.checkWorkName}}
            </div>
            <div class="qwui-yichang_list">
              <ul v-for="(item1,index1) in item.sdList" :key="index1">
                <li class="qwui-yichang_li" v-if="item1.status !== '1' && item1.isRep && item1.hasRep">
                  <!-- 复选框 -->
                  <label  class="qwui-check_box">
                    <div class="qwui-list_check_box">
                      <input type="checkbox" @change="getParams($event,item,item.icvo.id,item1)">
                      <span></span>
                    </div>
                    <!-- 异常信息主体 -->
                    <div class="qwui-yichang_body">
                      <p class="qwui-yichang_item">
                        <span
                          class="qwui-yichang_time"
                          :class="{'qwui-yichang_color' : item1.signTime}"
                          v-if="item1.signTime"
                        >
                          {{item1.signTime | filtersTime}}
                        </span>
                        <span
                          class="qwui-yichang_time"
                          :class="{'qwui-yichang_color' : item1.signTime}"
                          v-if="!item1.signTime"
                        >
                        {{item1.signinTime}}
                        </span>
                        <i>|</i>
                        <span class="qwui-yichang_type">{{item1.signType == 1 ? "签到" : "签退"}}</span>
                        <span class="qwui-yichang_color qwui-margin_left"
                              v-if="item1.signTime"
                        >
                          {{item1.signStatusDesc}}
                        </span>
                      </p>
                      <p class="qwui-yichang_sign_address">
                        <i v-if="item1.signAddress"></i>
                        <span>{{item1.signTime ? item1.signAddress : "无考勤记录信息"}}</span>
                      </p>
                    </div>
                  </label>
                </li>
              </ul>
              <!--工作时长不足-->
              <div class="qwui-yichang_li" v-if="item.repHtml">
                <!-- 复选框 -->
                <label class="qwui-check_box">
                  <div class="qwui-list_check_box">
                    <input type="checkbox" :checked="item.checkedE1a" :disabled="item.selectHtml" @change="getParamsE1a($event,item.icvo.id,item)">
                    <span></span>
                  </div>
                  <!-- 异常信息主体 -->
                  <div class="qwui-yichang_body">
                    <p class="qwui-yichang_item">
                      <span class="qwui-yichang_time qwui-yichang_color">
                        {{item.icvo.countTime ? item.icvo.countTime + "小时" : "0小时"}}
                      </span>
                      <i>|</i>
                      <span class="qwui-yichang_type"></span>
                      <span class="qwui-yichang_color qwui-margin_left">
                        工作时长不足
                      </span>
                    </p>
                    <p class="qwui-yichang_sign_address">
                      <span>如有漏签时，请先选择漏签记录</span>
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--修改申诉-->
      <div class="qwui-yichang_box" v-if="queryType == 'edit'">
        <ul v-for="(item,index) in abnormalData.repList" :key="index">
          <li>
            <div class="qwui-checkwork_name">
              {{item.checkWorkName}}
            </div>
            <div class="qwui-yichang_list" v-if="abnormalData.startList.length != 0">
              <ul v-for="(item1,index1) in item.rdList" :key="index1">
                <li class="qwui-yichang_li">
                  <p class="qwui-yichang_item">
                    <span
                      class="qwui-yichang_time"
                      :class="{'qwui-yichang_color':item1.detailedSignTime}"
                    >
                      {{item1.signTime}}
                    </span>
                    <i>|</i>
                    <span class="qwui-yichang_type">{{item1.signType}}</span>
                    <span class="qwui-yichang_color qwui-margin_left">
                    {{item1.signStatusDesc}}
                    </span>
                  </p>
                  <p class="qwui-yichang_sign_address" v-if="item1.signAddress !== ''">
                    <i v-if="item1.detailedSignTime"></i>
                    <span>{{item1.signAddress}}</span>
                  </p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <!--申诉理由-->
      <div class="qwui-add_reason_box">
        <p>申诉理由</p>
        <div class="qwui-textarea_box">
        <textarea
          placeholder="请输入申诉理由"
          class="qwui-add_reason_text"
          v-model="commitDraft.draftFormData.content"
        >
        </textarea>
        </div>
        <div class="qwui-add_image_file">
          <!--上传图片-->
          <add-img-list
            v-if="imgUploadPicList && imgUploadPicList.length"
            :imageList="imgUploadPicList"
            @handleDeleteImage="handleDeleteImage"
            :disabled="false">
          </add-img-list>
          <add-img agent="checkwork" :orderId="orderId" :onlyPhotograph="onlyPhotograph"
                   :imageList="imgUploadPicList"
                   :camera="camera"
                   :deleteImage="deleteImage"
                   @updateImageList="setImgUploadValue"
          >
          </add-img>
        </div>
      </div>
      <!--选择审批人-->
      <div class="qwui-user_select_charge">
        <user_selected_group :title="'审批人('+ userSelected.length +')'">
          <user_selected_item
            slot="user_selected_item"
            :title="'审批人'"
            :isEdit="isEdit"
            :List="userSelected"
            @showUserSelectedBox="showUserSelectedBox"
            @removeSelected="removeSelected"
            :isRemove="isRemove">
          </user_selected_item>
        </user_selected_group>
      </div>
      <!--相关人员选择-->
      <user_add
        :userselect="dataBase.selectConfig"
        @selectPerson="selectPerson"
      >
      </user_add>
      <!--底部操作按钮-->
      <flow_button :buttondata="draftDetail.buttonConfig"></flow_button>
    </div>
    <!--审批人范围选人-->
    <user-select-rang
      v-if="chargeShow"
      :options="userList"
      :selectType="'user'"
      :checked="checkedList"
      :checkedType="'checkbox'"
      :config="deptManager"
      @FlowAuditUserResult="FlowAuditUserResult"
    >
    </user-select-rang>
    <!--相关人选择人员-->
    <user_select
      :selectconfig="dataBase.selectConfig"
      v-if="dataBase.selectConfig.show"
      :closeDept="true"
      :closeTag="true"
    >
    </user_select>
    <!--预览图片组件-->
    <previewImages :urls="previewImageUrl"></previewImages>
  </div>
</template>

<script>
  import AddImgList from '@/components/add/upload/imgList';
  import AddImg from '@/components/add/upload/add_img';
  import previewImages from "@/components/base/previewImages";
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected';
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group';
  import user_add from '@/components/add/user_select_build';
  import flow_button from '@/components/button/flow_button';
  import UserSelectRang from '@/components/base/userOrDeptSelect/user_selected_ranglist';
  import user_select from '@/components/base/user_or_dept_select';
  import addUpdate from '../../js/add';
  import {photoSetting} from '../../api/getData';
  import {HashMap,handleRepDetailed,handleStatusDesc,getRepCheckWorkSignInfoMap,setRepSignInfo,checkIsSignTimeRep,getNextSignDate,getBeforeSignDate,checkAllNoneSignIds,handleDetailedIds} from "../../js/repCommon";
  export default {
    components: {
      AddImgList,
      AddImg,
      user_selected_item,
      user_selected_group,
      user_add,
      UserSelectRang,
      flow_button,
      user_select,
      previewImages,
    },
    data(){
      return {
        dataBase:dataBase,
        draftDetail:addUpdate.draftDetail,
        commitDraft:addUpdate.draftDetail.commitDraft,
        jsonData:{},//选中的要提交的申诉数据
        selectInfoIds:'',//选中的要提交的申诉父ids
        isHasContent:false,//是否有可以申诉的异常
        submitURL: '',//提交申诉的URL
        orderId: '',//图片水印参数
        onlyPhotograph: false, // 判断能否拍照上传，true：只能拍照，false，支持拍照跟图片库
        imgUploadPicList:[],//图片列表数据
        deleteImage:{},  //删除图片附件
        camera: ['album', 'camera'],//‘album’选择图片上传，‘camera’拍照上传
        previewImageUrl:[], //需要预览的图片列表
        abnormalData:{},//申诉的整体数据
        queryType:'',//判断是否是编辑申诉
        buttonConfig:{ //返回操作按钮
          primaryList:[],
          defaultList:[{type:"default",name:'i18n.returnBack', callBack:this.backToList}],
          style:{class:""}//按钮是否置底部 active :底部、"":相对定位
        },
        /*审批人范围选人配置*/
        isEdit:false,
        isRemove:false,
        userSelected:[],//选中人员列表
        deptManager:{
          id: 'userId',
          name: 'personName',
          headpic:'headPic',
          type:'user'
        },//人员配置
        userList:[],//所有人员列表
        checkedList:[],//默认选中人员
        chargeShow:false,//审批人组件是否显示
        noneSignInfoMap: new HashMap(),
      }
    },
    created(){
      _.showLoading("加载中",false);
      this.initRep();
      this.draftDetail.buttonConfig.primaryList[0].callBack=this.checkCommit;
      this.draftDetail.buttonConfig.defaultList[0].callBack=this.backToList;
      this.dataBase.selectConfig.selectList["ccPersonList"].title="相关人";
      //初始化选人
      this.dataBase.selectConfig.selectList["ccPersonList"].userSelected=[];
    },
    filters: {
      filtersSignDate:function (val) {
        if (!val) return '';
        return val.replace(/(\d{4})\-(\d{2})\-(\d{2})/,"$1年$2月$3日");
      },
      filtersTime: function (val) {
        if (!val) return '';
        return val.replace(/(\d{4})\-(\d{2})\-(\d{2})/,"");
      },
    },
    methods: {
      //初始化
      initRep(){
        // 图片上传方式 可否支持拍照上传
        this.getPhotoType();
        this.queryType = this.$route.query.type;
        //判断是新建还是编辑
        if(this.queryType === 'edit'){
          this.isHasContent = true;
          this.loadDraftData();
          this.submitURL = _.baseURL + '/portal/checkWorkFormCtrl/editRepresentations.do';
          document.title = '修改申诉'
        }else{
          this.abnormalShow(); //点击新建才会调用这个方法 获取异常信息
          this.submitURL = _.baseURL + '/portal/checkWorkFormCtrl/addRepresentations.do';
          document.title = '新增申诉'
        }
      },
      //打开审批人选人组件
      showUserSelectedBox(val){
        this.chargeShow = val;
        /*打开选人（审批人）组件默认选中*/
        //拿到ids字符串
        var idStr = this.dealBackPersonMsg(this.userSelected);
        //删除最后一个逗号
        var handleIdStr = handleDetailedIds(idStr);
        //先清空
        this.checkedList.splice(0);
        //再赋值
        this.checkedList = handleIdStr.split(",");
      },
      //审批人选择确认
      FlowAuditUserResult(obj){
        if(obj.result.length>0){
          this.userSelected = obj.result;
        }
        this.chargeShow = false
      },
      // 删除掉已选的审批人
      removeSelected(obj) {
        this.userSelected.splice(obj.index,1);
      },
      //判空
      isEmptyObject(obj){
        for(var key in obj){
          return false
        };
        return true
      },
      //是否勾选时长不足
      getParamsE1a(e,pId,item){
        //选中时
        if(e.target.checked){
          item.checkedE1a=true;
          //拼接repInfoDataJson
          if(this.isEmptyObject(this.jsonData)){
            this.jsonData[pId] = [{detailedIds:'',signIds:'',elasticIds:pId}];
          }else{
            if(this.equary(pId)){
              this.jsonData[pId][0].elasticIds = pId;
            }else{
              this.jsonData[pId] = [{detailedIds:'',signIds:'',elasticIds:pId}];
            }
          }
        }else{
          item.checkedE1a=false;
          this.jsonData[pId][0].elasticIds = '';
          if(this.jsonData[pId][0].detailedIds == ''&& this.jsonData[pId][0].signIds == ''&&this.jsonData[pId][0].elasticIds == ''){
            delete this.jsonData[pId];
          }
        }
        //拼接selectInfoIds
        this.selectInfoIds = '';
        for(var key in this.jsonData){
          this.selectInfoIds += key + ',';
        }
        //新建申诉传给后台的数据
        this.commitDraft.draftFormData = {
          "content": '',
          "status": '3',
          "imageUrls": '',
          "incharges": '',
          "relatives": '',
        };
        this.commitDraft.draftFormData["selectInfoIds"] = this.selectInfoIds;
        this.commitDraft.draftFormData["repInfoDataJson"] = this.jsonData;
      },
      //是否勾选异常申诉
      getParams(e,item,pId,item1){
        //选中时
        if(e.target.checked){
          //拼接repInfoDataJson
          item.checkedE1a=false;
          var initDetailedIds = item1.signTime ? item1.id + "," : '';
          var initSignIds = item1.signTime ? '' : item1.signPosintionId + ",";
          var signIdsVal;
          if(this.isEmptyObject(this.jsonData)){
            this.jsonData[pId] = [{detailedIds:initDetailedIds,signIds:initSignIds,elasticIds:''}];
            signIdsVal = initSignIds;
          }else{
            if(this.equary(pId)){
              var detailedIds = this.jsonData[pId][0].detailedIds ? this.jsonData[pId][0].detailedIds: '';
              var signIds = this.jsonData[pId][0].signIds ? this.jsonData[pId][0].signIds : '';
              //同一规则名下
              this.jsonData[pId] = [{detailedIds:detailedIds + initDetailedIds,signIds:signIds + initSignIds,elasticIds:''}]
              signIdsVal = signIds + initSignIds;
            }else{
              //不同一规则名下
              this.jsonData[pId] = [{detailedIds:initDetailedIds,signIds:initSignIds,elasticIds:''}]
              signIdsVal = initSignIds;
            }
          }
          if(checkAllNoneSignIds(this.noneSignInfoMap,pId, signIdsVal)){
            item.selectHtml = false;
          }
        }else{
          item.checkedE1a=false;
          this.delforkey(item,pId,item1.id,item1.signPosintionId)
        }
        //拼接selectInfoIds
        this.selectInfoIds = '';
        for(var key in this.jsonData){
          this.selectInfoIds += key + ',';
        }
        //新建申诉传给后台的数据
        this.commitDraft.draftFormData = {
          "content": '',
          "status": '3',
          "imageUrls": '',
          "incharges": '',
          "relatives": '',
        };
        this.commitDraft.draftFormData["selectInfoIds"] = this.selectInfoIds;
        this.commitDraft.draftFormData["repInfoDataJson"] = this.jsonData;
      },
      //是否选中多个异常申诉
      hasMoreChild(keyWord){
        var reg=/\,/g;
        var signIdArr=this.jsonData[keyWord][0].signIds.match(reg);
        var detailedIdArr=this.jsonData[keyWord][0].detailedIds.match(reg);
        if((this.jsonData[keyWord].detailedIds && this.jsonData[keyWord].signIds) || (signIdArr && signIdArr.length>=1) || (detailedIdArr && detailedIdArr.length>=1)){
          return true
        }
      },
      //取消选中处理数据
      delforkey(item,pId,cId,sinId){
        var signIdsVal;
        if(this.hasMoreChild(pId)){
          this.jsonData[pId][0].detailedIds=this.jsonData[pId][0].detailedIds.replace(cId+',','');
          this.jsonData[pId][0].signIds=this.jsonData[pId][0].signIds.replace(sinId+',','');
          signIdsVal = this.jsonData[pId][0].signIds;
        }else{
          this.jsonData[pId][0].detailedIds='';
          this.jsonData[pId][0].signIds='';
          signIdsVal = ''
        }
        if(this.jsonData[pId][0].detailedIds == ''&& this.jsonData[pId][0].signIds == ''){
          delete this.jsonData[pId];
        }
        if(!checkAllNoneSignIds(this.noneSignInfoMap,pId, signIdsVal)){
          item.selectHtml = true;
          if(this.jsonData[pId]){
            this.jsonData[pId][0].elasticIds = '';
          }
        }
      },
      //是否同一规则名下
      equary(key){
        if(this.jsonData.hasOwnProperty(key)){
            return true;
        }
        return false
      },
      // 获取图片上传方式
      getPhotoType(){
        let obj = {
          agentCode: 'checkwork'
        };
        // is_photograph:0 允许选择图片 is_photograph:1  只能拍照上传
        photoSetting(obj)
          .then(res => {
            if(res.code == '0'){
              this.onlyPhotograph = res.data.is_photograph == '1' ? true : false;
              if(res.data.is_photograph == '1'){
                this.onlyPhotograph = true;
                this.camera = ['camera'];
              }else{
                this.onlyPhotograph = false;
                this.camera = ['album', 'camera'];
              }
            }
            else{
              _.alert('提示',res.desc);
            }
          })
      },
      // 图片上传
      setImgUploadValue(val){
        this.imgUploadPicList = val;
        let arr = [];
        this.imgUploadPicList.forEach((item) => {
          arr.push(item.src?item.src:item.picPath)
        });
        this.commitDraft.draftFormData['imageUrls'] = arr.join();
      },
      // 图片删除
      handleDeleteImage(item){
        this.deleteImage = item;
      },
      //查询历史选择的人员
      getUsers(type,person){
        if(person && person.length>0){
          if(type=="toPersonList"){
            this.commitDraft.draftFormData['incharges'] = this.dealBackPersonMsg(person);
            this.userSelected = person;
          }else{
            this.commitDraft.draftFormData['relatives'] = this.dealBackPersonMsg(person);
            this.dataBase.selectConfig.selectList[type].userSelected = person;
          }
        }
      },
      dealBackPersonMsg(data){
        var idStr="";
        if(data && data.length>0){
          for(var i=0;i<data.length;i++){
            idStr+=data[i].userId+',';
          }
        }
        return idStr;
      },
      //新建申诉-新增接口请求
      abnormalShow(){
        var self=this;
        _.ajax({
          url: _.baseURL +"/portal/checkWorkFormCtrl/getRepCheckWorkInfo.do",
          type: 'POST',
          data:{
            "infoIds": self.$route.query.infoIds
          },
          success: function (result) {
            if(result.code=="0"){
              self.abnormalData = result.data;
              self.userList.push(result.data.toList);
              var signDateDesc = result.data.signDate;
              var vo;
              var rdMap = getRepCheckWorkSignInfoMap(self.abnormalData);//已经申诉的签到签退map
              var nowDateYMDHMS = result.data.nowDateYMDHMS;
              var nowDate  = new Date(nowDateYMDHMS);
              var refreshTimeMin;
              var nextSignDateDesc;
              var beforeSignDateDesc;
              var rb = false; //不是今天的考勤
              var isRepTodayMap = new HashMap();//是否是当日考勤信息
              if(self.$route.query.isRepToday && self.$route.query.infoIds) {//申诉的是今天的考勤时
                var infoIdsArr = self.$route.query.infoIds.split(",");
                var isTodayArr = self.$route.query.isRepToday.split(",");
                for(var i = 0; i < infoIdsArr.length; i++){
                  isRepTodayMap.put(infoIdsArr[i],isTodayArr[i]);
                }
              }
              var csdList = self.abnormalData.csdList;
              if(csdList && csdList.length > 0){
                var cdvo; //考勤统计记录和考勤明细信息
                var icvo; //考勤统计记录
                var sdList; //考勤明细信息
                var refreshTimeType; //新考勤时间类型
                var elasticRule; //是否启用弹性工作时长考勤（0：禁用；1：启用）
                var checkType; //规则类型（0：固定考勤；1：排班考勤；2：自由考勤）
                var signCardType; //打卡方式(1:上下班均打卡;2:只需上班打卡;3:自由打卡)
                var elasticWorkHour; //弹性工作时长
                var isOk = true; //所有考勤明细状态都正常
                var hasRepElastic; //是否需要判断能不能申诉弹性工作时长不够
                var noneSignNum; //漏签（未考勤也是漏签）的数量
                var rdvo; //已申诉的明细
                var repNoneSignNum; //申诉中的漏签（未考勤也是漏签）的数量
                var dvoArr; //多个漏签的申诉
                var countTime; //总考勤时长
                var signStatus; //总考勤状态
                var isToday;
                if(signDateDesc){
                  signDateDesc = signDateDesc.replace("-", "/").replace("-", "/");
                  nextSignDateDesc = getNextSignDate(signDateDesc);
                  beforeSignDateDesc = getBeforeSignDate(signDateDesc);
                }
                var hasRep;
                var sdLen = csdList.length;
                var sdStatus; //考勤明细状态
                self.isHasContent = false;//申诉的异常考勤时，当规则名称全部被隐藏时，隐藏申诉理由，审批人，相关人和操作按钮以及评论列表
                for(var i = 0; i < sdLen; i++){
                  cdvo = csdList[i];
                  cdvo["isHasList"] = false;//隐藏全部规则名
                  if(cdvo){
                    icvo = cdvo.icvo;
                    elasticRule = cdvo.elasticRule; //是否启用弹性工作时长考勤（0：禁用；1：启用）
                    checkType = cdvo.checkType; //规则类型（0：固定考勤；1：排班考勤；2：自由考勤）
                    signCardType = cdvo.signCardType; //打卡方式(1:上下班均打卡;2:只需上班打卡;3:自由打卡)
                    elasticWorkHour = cdvo.elasticWorkHour; //弹性工作时长
                    hasRepElastic = false; //不需要判断能不能申诉弹性工作时长不够
                    if("0" == checkType && 1 == signCardType && "1" == elasticRule){ //0：固定考勤;1:上下班均打卡;1：启用
                      hasRepElastic = true; //需要判断能不能申诉弹性工作时长不够
                    }
                    if(icvo){
                      isToday = isRepTodayMap.get(icvo.id);
                      refreshTimeType = icvo.refreshTimeType;
                      countTime = icvo.countTime; //总考勤时长
                      signStatus = icvo.signStatus; //总考勤状态
                      if("1" == isToday){ //1:当日考勤
                        rb = true;
                        //当日考勤的不能申诉弹性工作时长不足
                        hasRepElastic = false; //不需要判断能不能申诉弹性工作时长不够
                      }else{
                        rb = false;
                      }
                      sdList = cdvo.sdList;
                      if(sdList && sdList.length > 0){
                        refreshTimeMin = icvo.refreshTimeMin;
                        sdList["isDoRep"] = false;//当规则名称下可申诉的异常考勤不存在时，隐藏对应的规则名
                        isOk = true; //所有考勤明细状态都正常
                        noneSignNum = 0;
                        repNoneSignNum = 0;
                        for(var j = 0; j < sdList.length; j++){
                          vo = sdList[j];
                          sdStatus = vo.status;
                          if(hasRepElastic){ //需要判断能不能申诉弹性工作时长不够
                            //判断是否所有考勤明细状态都正常
                            if("1" != sdStatus){ //没有考勤或考勤状态异常
                              isOk = false; //不是所有考勤明细状态都正常
                            }
                            //判断是否有漏签
                            if(!vo.signTime){ //漏签时
                              noneSignNum += 1; //记录漏签的数量，因为有漏签的必须全选漏签后才能选申诉弹性工作时长不够
                              self.noneSignInfoMap.put(vo.signPosintionId, "0"); //记录漏签signId，0：代表漏签标识
                              dvoArr = rdMap.get(vo.signPosintionId);
                              if(dvoArr && dvoArr.length > 0){
                                for(var idr = 0; idr < dvoArr.length; idr++){
                                  rdvo = dvoArr[idr];
                                  if(3 == rdvo.status){ //3：审核中
                                    repNoneSignNum += 1; //记录申诉中的漏签数量，避免所有漏签已经在申诉中不能申诉时长不足的问题(申诉通过后漏签就变成了已签了)
                                    break;
                                  }
                                }
                              }
                            }
                          };
                          if("1" == sdStatus || "10" == sdStatus || "11" == sdStatus || "12" == sdStatus){//1：正常；10：请假；
                            continue;
                          }
                          vo["hasRep"] = true;
                          if(rb && !vo.signTime){//申诉的是今天的考勤时
                            hasRep = checkIsSignTimeRep(signDateDesc, refreshTimeMin, vo.signinTime, nowDate, nextSignDateDesc, refreshTimeType, beforeSignDateDesc);
                            vo["hasRep"] = hasRep;//当天未签到的考勤，没有到考勤结束的时间时，不能申诉
                            if(!hasRep){
                              continue;
                            }
                          }
                          vo["isRep"] = false;
                          if(vo.status !== "1"){//1:正常考勤，不能申诉
                            vo["isRep"] = true;//能申诉
                            setRepSignInfo(vo, rdMap, vo.signTime);
                          }
                          vo["signStatusDesc"] = handleStatusDesc(sdStatus,vo.abnormalTime);
                          if(vo["isRep"]){//规则名下只要有可以申诉的考勤，就显示对应的规则名称
                            sdList["isDoRep"] = true;
                          }
                        }
                        cdvo["repHtml"] = false;
                        rdvo = rdMap.get(icvo.id + "_" + 3);
                        if(hasRepElastic && (!rdvo || (3 != rdvo.status && 4 != rdvo.status))) { //需要判断能不能申诉弹性工作时长不够，并且没有弹性工作时长不足申诉中或通过的
                          cdvo["repHtml"] = true;//有弹性工作不足可申诉（新建申诉中可见，申诉中或者已通过不可见）
                          if(noneSignNum > 0){ //有漏签就可以申诉弹性工作时长不足
                            if(repNoneSignNum == noneSignNum){ //申诉中或已申诉通过的漏签数量等于所有漏签数量时，时长不足的申诉可以直接选中
                              cdvo["selectHtml"] = false;
                            }else{ //申诉中或已申诉通过的漏签数量不等于所有漏签数量时，时长不足的申诉必须先选择漏签
                              cdvo["selectHtml"] = true;
                              self.noneSignInfoMap.put(icvo.id, noneSignNum - repNoneSignNum); //记录漏签数量(总漏签数量减申诉中的漏签数量)，因为申诉弹性工作时长不足必须先选择所有漏签
                            }
                          }else{ //没有漏签
                            if(isOk){ //所有考勤明细状态都正常
                              if("2" == signStatus){ //2：总考勤状态异常，说明是弹性工作时长不够
                                cdvo["selectHtml"] = false;
                              }
                            }else{ //考勤明细的状态有异常的
                              //总考勤时长比弹性工作时长小，可以申诉弹性工作时长不足
                              if ("2" == signStatus && elasticWorkHour && parseFloat(countTime) < parseFloat(elasticWorkHour)) { //2:总考勤状态异常
                                cdvo["selectHtml"] = false;
                              }
                            }
                          }
                        }
                        if(sdList["isDoRep"]){
                          cdvo["isHasList"] = true;
                        }
                      }
                      if(cdvo["isHasList"] || cdvo["repHtml"]){
                        self.isHasContent = true;
                      }
                    }
                  }
                }
              };
              if(!self.commitDraft.draftFormData.selectInfoIds){
                self.commitDraft.draftFormData = {
                  'selectInfoIds':'',
                  'content': '',
                  'status': '3',
                  'repInfoDataJson':{},
                  'imageUrls': '',
                  'incharges': '',
                  'relatives': '',
                };
              };
              //处理审批人是否能新增修改
              var svo = result.data.svo;
              var allToList = result.data.toList;
              self.getUsers("toPersonList",allToList);
              if(svo && 1 == svo.isUse){//配置存在并且是（1：审批人能新增修改）
                self.isEdit = true;
                self.isRemove = true;
              }
              _.hideLoading();
            }else{
              _.hideLoading();
              _.alert("i18n.notice",result.desc);
            }
          }
        });
      },
      //修改申诉-编辑接口请求
      loadDraftData:function(){
        var self = this;
        _.ajax({
          url:_.baseURL+self.draftDetail.url,
          type: 'POST',
          data:{
            "repId":this.$route.query.checkworkId,
            "type":'edit'
          },
          success:function(result){
            if(result.code==0){
              // 将接口返回数据打包
              var obj = result.data;
              self.userList.push(obj.allToList);
              self.abnormalData = obj;
              //显示申诉的考勤明细
              handleRepDetailed(self.abnormalData);
              self.commitDraft.draftFormData = {
                'repId':self.$route.query.checkworkId,
                'content': '',
                'status': '3',
                'imageUrls': '',
                'incharges': '',
                'relatives': '',
              };
              self.commitDraft.draftFormData['content'] = obj.rrpo.content;
              self.imgUploadPicList = obj.picList;
              self.imgUploadPicList.forEach((item) => {
                item.src = item.picPath
              });
              self.getUsers("toPersonList",obj.toPersons);
              self.getUsers("ccPersonList",obj.ccPersons);
              _.hideLoading();
            }else{
              _.hideLoading();
              _.alert('i18n.notice',result.desc);
            }
          }
        })
      },
      //确定选择的人员返回的数据
      selectPerson(el,obj){
        if(el=="ccPersonList"){
          this.commitDraft.draftFormData['relatives'] = obj.user.idStr.replace(/\|/g,",");
        }
      },
      //提交验证
      checkCommit:function () {
        this.commitDraft.draftFormData['incharges'] = this.dealBackPersonMsg(this.userSelected);
        this.isCheck();
      },
      //取消申诉，返回上一个页面
      backToList:function () {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/');
      },
      // 点击提交检验数据
      isCheck: function () {
        var obj = this.commitDraft.draftFormData;
        if(obj["selectInfoIds"] === ""){
          return _.alert('i18n.notice','i18n.pleaseSelectAbnormal');
        }else if(obj["content"] === ""){
          return _.alert('i18n.notice','i18n.reasonCannotEmpty');
        }else if(obj["content"].length > 2000){
          return _.alert('i18n.notice','i18n.pleaseEnterAgain');
        }else if(obj['incharges'] === ""){
          return _.alert('i18n.notice','i18n.pleaseSettingPerson');
        }
        this.update();
      },
      //新增或修改申诉 提交
      update:function () {
        var self = this;
        this.commitDraft.draftFormData["repInfoDataJson"] = JSON.stringify(this.jsonData);
        _.showLoading('i18n.submitting');
        _.ajax({
          url: self.submitURL,
          type: 'POST',
          data: self.commitDraft.draftFormData,
          success: function (result) {
            if(result.code=="0"){
              _.tooltips_succeed("i18n.operationSuccess");
              setTimeout(()=>{
                self.$router.push({
                  path:'/myRep',
                  query:{
                    index:2
                  }
                })
              },1000)
            }else{
              _.hideLoading();
              _.alert("提示",result.desc);
            }
          }
        })
      },
    },
  }
</script>

<style scoped>
  .wrap{
    background-color: #f7f7f7;
  }
  .qwui-add_rep_time{
    color: #666;
    font-size: 15px;
    text-align: center;
    line-height: 34px;
    background-color: #f5f5f5;
  }
  .qwui-has_nocontent_box{
    background: #efefef;
  }
  .qwui-has_nocontent_box p{
    text-align: center;
    padding: 10px 15px 0 15px;
    font-size: 14px;
    border-top: 1px #ddd solid;
  }
  .qwui-has_nocontent_box /deep/ .qwui-btn_tab{
    padding: 20px 15px;
  }
  .qwui-add_reason_box{
    margin-top: 10px;
    padding: 10px 0;
    border-top: 1px #ddd solid;
    border-bottom: 1px #ddd solid;
    background-color: #fff;
  }
  .qwui-add_reason_box p{
    color: #666;
    font-size: 14px;
    margin-left: 15px
  }
  .qwui-has_content_box /deep/ .qwui-btn_tab{
    padding: 20px 15px;
  }
  .qwui-textarea_box{
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    box-sizing: border-box;
  }
  .qwui-add_reason_text{
    width: 100%;
    min-height: 60px;
    font-size: 14px;
    color: #333;
    padding: 5px 0;
    border: none;
    resize: none;
  }
  /*照片附件*/
  .qwui-add_image_file{
    padding: 0 15px;
  }

  /*异常信息 start*/
  .qwui-yichang_box{
    border-bottom: 1px #ddd solid;
    background-color: #fff;
  }
  .qwui-checkwork_name{
    padding: 0 15px;
    color: #666;
    font-size: 14px;
    line-height: 39px;
    border-top: 1px #ddd solid;
    border-bottom: 1px #ddd solid;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-yichang_list{
    padding-left: 15px;
  }
  .qwui-yichang_li{
    padding: 8px 15px 8px 0;
  }
  .qwui-yichang_item{
    height: 22px;
    line-height: 22px;
  }
  .qwui-yichang_item i,span{
    display: inline-block;
    height: 22px;
    line-height: 22px;
    vertical-align: top;
  }
  .qwui-yichang_item i{
    font-size: 14px;
    margin-left: 10px;
    color: #999;
  }
  .qwui-yichang_type{
    font-size: 14px;
    margin-left: 10px;
    color: #666;
  }
  .qwui-yichang_time{
    font-size: 20px;
    font-weight: normal;
  }
  .qwui-yichang_sign_address span{
    color: #999;
    font-size: 13px;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-yichang_sign_address i{
    display: inline-block;
    width: 13px;
    height: 22px;
    line-height: 22px;
    background: url("~assets/images/checkwork/mapMarker.png") no-repeat left 4px;
    background-size: 13px auto;
  }
  .qwui-margin_left{
    margin-left: 10px;
    font-size: 14px;
  }
  .qwui-yichang_color{
    color: #d64949;
  }
  .qwui-check_box{
    cursor: pointer;
  }
  .qwui-list_check_box{
    position: relative;
    float: left;
    width: 30px;
    height: 44px;
  }
  .qwui-list_check_box input{
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    visibility: hidden;
  }
  .qwui-list_check_box span{
    position: absolute;
    width: 15px;
    height: 15px;
    top: 0;
    bottom: 0;
    border: 1px solid #cacaca;
    border-radius: 4px;
    background: #fff;
    margin: auto;
  }
  .qwui-yichang_body{
    margin-left: 30px;
  }
  .qwui-list_check_box input:checked + span{
    background-color: #2f7dcd;
    border:1px solid #2f7dcd;
  }
  .qwui-list_check_box input:checked + span::after{
    content: '';
    width: 10px;
    height: 4px;
    position: absolute;
    top: 3px;
    left: 2px;
    border: 2px solid white;
    border-top: none;
    border-right: none;
    border-radius: 1px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  .qwui-list_check_box input:disabled + span{
    background-color: #ccc;
    border:1px solid #ccc;
  }
  .qwui-list_check_box input:disabled + span::after{
    display: none;
  }
  /*异常信息 end*/

  /*选择审批人组件*/
  .qwui-user_select_charge /deep/ .qwui-user_select_top{
    position: relative;
    padding: 13px 15px 6px 15px;
    text-align: left;
    background: #f5f5f5;
  }
  .qwui-user_select_charge /deep/ .qwui-user_select_charge_view{
    margin-top: 0;
  }
  .qwui-user_select_charge /deep/ .qwui-user_select_add{
    margin:10px 15px 10px 0;
  }
  .qwui-user_select_charge /deep/ .qwui-user_select_wap{
    padding:7px 0 7px 15px;
  }
  .qwui-user_select_charge /deep/ .qwui-user_cell_view{
    padding-right: 0;
    font-size: 14px;
    color: #999;
    line-height: 20px;
  }
</style>
