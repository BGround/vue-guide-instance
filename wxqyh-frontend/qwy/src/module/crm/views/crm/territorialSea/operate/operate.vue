<template>
    <div class="poolWrap">
        <!--头部-->
        <div class="operate_top">
          <span class="qwui-operate_back" @click="backList"></span>
          <div class="operate_title">公海池 <span>{{title}}</span></div>
        </div>

        <!--固定字段-->
        <div class="operate_form">
          <operate-item v-for="(item,index) in topData"
                        :itemData="item"
                        :key="index"
                        :poolArray="poolArray"
                        :industryArray="industryArray"
                        @poolData="pool"
                        @removePool="removePool"
                        @industryData="industry"
                        @openMap="openMap"
                        @getArea="getArea"
                        @isRepeat="isRepeat"
          ></operate-item>
        </div>

        <!--自定义字段-->
        <div class="operate_form">
          <operate-item v-for="(item,index) in listData"  :itemData="item" :key="index" @getSelectData="(val)=>{getSelectData(val,index)}"></operate-item>
          <div class="moreTip">可在设置中启用更多自定义字段</div>
        </div>

        <!--备注，图片，附件-->
        <div class="operate_form">
          <operate-item v-for="(item,index) in bottomData" :itemData="item" :key="index"></operate-item>
          <div class="upload">
            <div class="itemName">
              <h1>图片</h1>
            </div>
            <upload-img class="uploadBtn" :uploadConfig="picOption" @moreImgUpload="moreImgUpload"></upload-img>
            <span class="fileTip">支持jpg、jpeg、png</span>
          </div>
          <div class="upload">
            <div class="itemName">
              <h1>附件</h1>
            </div>
            <qwUploadWrap
              class="uploadBtn"
              :fileList="fileList"
              :limit="100"
              :beforeUpload="beforeUploadFile"
              :onSuccess="handleSuccessFile"
              :onRemove="handleRemoveFile">
              <qwuiButton class="mb5">上传</qwuiButton>
            </qwUploadWrap>
            <span class="fileTip">仅支持.txt .xml .pdf .doc .ppt .xls .docx .pptx .xlsx .mp3 .wma .amr .mp4 .rar .zip</span>
          </div>
        </div>

        <!--相关人-->
        <div class="operate_form">
          <div class="person">
            <h1>相关人</h1>
          </div>
          <div class="ccPerson">
            <pickExam :useTab="defaultTags"
                      :useUsers="defaultUserVOList_creator"
                      :isShowRadios="false"
                      :isReset="isReset"
                      onlyUser
                      @closePerson="closePerson"
                      @chooseDone="chooseDone_creator"></pickExam>
          </div>
          <div class="numTip" v-if="defaultUserVOList_creator.length!=0">
            已选<span class="num">{{defaultUserVOList_creator.length}}</span>成员
            <span class="resetBtn" @click="reset">修改</span>
          </div>
        </div>

        <!--保存-->
        <qwui-button type="primary" @click="save">保存</qwui-button>

        <!--行业-->
        <div class="industryMask" v-if="showIndustry" @click="closeIndustry"></div>

        <!--地图-->
        <qwMap v-model="isOpenMap" @on-confirm="confirmMap"></qwMap>


    </div>
</template>
<script>
  import operateItem from './operateItem/operateItem'
  import uploadImg from '@/components/Add/uploadImg/QwUploadImg'
  import pickExam from '@/components/pickPerson/pickExam'
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
  import qwUploadWrap from '@/components/Add/Upload/QwUploadWrap'
  import qwMap from '../../../../components/qwMap'
  import {getClientItem,addClient,validPhoneOrClient,updateClient,getPoolDetail} from '@/module/crm/api/territorialSea';
  import clientData from './data.js';
export default {
    name: 'territorialSeaOperate',
    components:{
      operateItem,
      uploadImg,
      qwUploadWrap,
      pickExam,
      qwuiButton,
      qwMap,
    },
    data () {
        return {
          clientId:"",//客户id
          title:"新增公海客户",
          topData:clientData.topData,//固定字段
          bottomData:clientData.bottomData,// 备注字段
          allData:[],
          listData:[],//自定义字段
          detail:{},//客户详情数据
          param:{  //传给后台参数
            'clientPO.id':'',
            'itemJson':'',
            'clientPO.clientName': '',
            'clientPO.poolId': '',
            'clientPO.poolName': '',
            'clientPO.clientCode': '',
            'clientPO.provinceCode':'',
            'clientPO.cityCode':'',
            'clientPO.areaCode':'',
            'provinceCode':'',
            'cityCode':'',
            'areaCode':'',
            'clientPO.address':'',
            'clientPO.latitude':'',
            'clientPO.longitude':'',
            'industrys':'',
            'clientPO.industry':'',
            'clientPO.phone':'',
            'clientPO.email':'',
            'clientPO.website':'',
            'isMust12': '',
            'isMust13': '',
            'isMust14': '',
            'isMust20': '',
            'isMust21': '',
            'isMust34': '',
            'clientPO.remark':'',
            'imgurl':'',
            'imgFile':'',
            'mediaIds':'',
            'file':'',
            'givenUserIds':'',
          },
          fieldObj:{},
          fieldArr:[],
          showIndustry:false,// 是否显示行业选择
          titles:'',//行业名称
          isOpenMap:false,//是否显示图片
          defaultTags:[//选人配置
            {text:'标签人员'},
            {text:'特定人员'},
            {text:'批量导入'},
            {text:'高级筛选'},
          ],
          picOption: { //上传图片配置
            agent: 'crm',
            uploadFileId: 'coverImg',
            showType: 'large',
            isMoreImg:true,//true：多图,false：封面图片
            moreList:[],//多图列表
          },
          fileList:[],//上传的文件列表
          fileIds:'',//附件id拼接成的字符串
          fileArr:[],//
          limit:100,//限制上传的附件个数
          isWarnShow:false,//显示错误提示
          industryArray:[],//已有的行业数组
          poolArray:[],//公海池数组
          defaultUserVOList_creator:[],//创建人 默认 数组
          areaObj:[],//区域数组
          isFromRecycle:'',//是否从回收站进入编辑
          isExist:false,//是否已经存在
          ccPerson:[],//选人
          isReset:false,
        }
    },
    created(){
      this.init()
    },
    methods: {

      //初始化
      init:function(){
        this.clientId=this.$route.query.clientId;
        this.isFromRecycle=this.$route.query.isFromRecycle;
        this.title=this.clientId!=undefined?'编辑公海客户':'新增公海客户';

        this.getItem();
        if(this.clientId!=undefined){
          this.getDetail();
        }else{
          this.retData();
        }
      },

      //新增保存||编辑保存
      save:function(){
        if(this.clientId==undefined){
          this.addClients()
        }else{
          this.editClient();
        }
      },

      //新增时先清空数据
      retData:function(){
        this.topData.forEach(item=>{
          item.value=''
        })
        this.bottomData[0].value='';
      },

      //获取客户字段
      getItem:function(){
        getClientItem().then(res =>{

          //处理固定字段
          let basicList=res.data.basicList;
          this.topData[2].value=this.getClientCode();
          //控制固定字段显示 必填
          for(let i=0;i<basicList.length;i++){
            for(let j=0;j<this.topData.length;j++){
              if(this.topData[j].optionName == basicList[i].optionName){
                this.topData[j].status= basicList[i].status;
                this.topData[j].isMust= basicList[i].isMust;
              }
            }
            for(let j=0;j<this.bottomData.length;j++){
              if(this.bottomData[j].optionName == basicList[i].optionName){
                this.bottomData[j].status= basicList[i].status;
                this.bottomData[j].isMust= basicList[i].isMust;
              }
            }
          }

          //处理自定义字段
          let list=res.data.list;
          this.listData=[];
          list.forEach((item)=>{
            item.placeholderName= item.list.length>0 && item.list[0].name!=''?item.list[0].name:'输入' + item.optionName;
            item.value='';
            item.isWarning=false;
            if(item.type == 0){
              item.itemType = 'select'
            }else if(item.type == 1 || item.type == 3){
              item.itemType = 'input'
            }else if(item.type == 2){
              item.itemType = 'textarea'
            }else if(item.type == 4){
              item.itemType = 'date'
            }else{
              item.itemType = 'input'
            }

            this.fieldObj={
              fieldId:item.id,
              fieldName:item.optionName,
              fieldValue:item.value,
              id:"",
            }
            this.fieldArr.push( this.fieldObj)

          })
          this.listData=list;

        })
      },

      //获取下拉列表值
      getSelectData:function(val,index){
        this.listData[index].value = val;
      },

      //新增 固定字段赋值
      basicListData:function(){
        clientData.topData.forEach(item=>{
          if(item.optionName!='区域'){
            this.param[item.key]=item.value;
          }else{
            item.value&&this.getArea(item.value);
          }
        })
        clientData.bottomData.forEach(item=>{
          this.param[item.key]=item.value;
        })
      },

      //新增  自定义字段赋值,拼接itemJson对象
      listItemData:function(){
        let arr=[],obj={};
        this.listData.forEach(item=>{
          if(item.itemType == 'date'){
            if(item.value!=""){
              let StartDate = new Date(item.value);
              let date = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes();
              arr.push(date);
            }else{
              arr.push(item.value);
            }
          }else if(item.ext1 == 3 && item.type ==5 && item.value!=''){
            arr.push(item.value + '%');
          }else{
            arr.push(item.value);
          }
        })
        for(let i=0;i<this.fieldArr.length;i++){
          this.fieldArr[i].fieldValue=arr[i];
        }
        obj.list=this.fieldArr;
        this.param.itemJson=JSON.stringify(obj);
      },


      //验证客户名称，联系电话是否已存在
      isRepeat:function(val){
        let isEdit="";
        let obj={};
        if(val == 'clientName'){
          obj.clientName=this.topData[0].value;
          isEdit = this.clientId==undefined ? true:this.topData[0].value == this.detail.clientName?false:true; //是否是编辑客户名称
        }else{
          obj.phone=this.topData[6].value;
          isEdit = this.clientId==undefined ? true:this.topData[6].value == this.detail.phone?false:true; //是否是编辑联系电话
        }
        validPhoneOrClient(obj).then(res=>{
          if(res.code == '201004' && isEdit){ //客户名称重复
            this.topData[0].isWarning=true;
            this.topData[0].errTip=res.desc;
            this.isExist=true;
          }else{
            this.topData[0].isWarning=false;
            this.isExist=false;
          }
          if(res.code == '201005' && isEdit){ //联系电话重复
            this.topData[6].isWarning=true;
            this.topData[6].errTip=res.desc;
            this.isExist=true;
          }else{
            this.topData[6].isWarning=false;
            this.isExist=false;
          }
        })
      },

      //校验数据
      validateData:function(){

        this.allData=[];
        this.allData = this.allData.concat(this.topData,this.bottomData,this.listData);
        //校验客户名称，联系电话是否重复
        if(this.isExist){ //是否已存在
          return false;
        }
        //校验必填字段是否填写
        for(let i=0;i<this.allData.length;i++){
          if(this.allData[i].isMust=='1' && this.allData[i].status=='1'){
            if(this.allData[i].optionName!='区域' && this.allData[i].value==''){
              this.allData[i].isWarning=true;
              this.allData[i].errTip=this.allData[i].optionName + '不能为空';
              return false;
            }else{
              this.allData[i].isWarning=false;
            }
            if(this.allData[i].optionName=='区域') {
              if (this.param['clientPO.provinceCode'] == '' || this.param['clientPO.cityCode'] == '' || this.param['clientPO.areaCode'] == '') {
                this.allData[i].isWarning = true;
                this.allData[i].errTip=this.allData[i].optionName + '不能为空';
                return false;
              } else {
                this.allData[i].isWarning = false;
              }
            }
          }
        }
        //联系电话&邮箱&网址校验
        for(let i=0;i<this.allData.length;i++){
          if(this.allData[i].value!=''){
            if(this.allData[i].optionName=='联系电话' || this.allData[i].type == 3){
              let phone = /^((\d{5,15})|(\d{4}|\d{3})-(\d{7,8})(-\d{3,6})?)$/g;
              let tel=phone.test(this.allData[i].value);
              if(tel){
                this.allData[i].isWarning=false;
              }else{
                this.allData[i].isWarning=true;
                this.allData[i].errTip='请输入正确的' + this.allData[i].optionName;
                return false
              }
            }
            if(this.allData[i].optionName=='邮箱'){
              let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
              let mail=myreg.test(this.allData[i].value)
              if(mail){
                this.allData[i].isWarning=false;
              }else{
                  this.allData[i].isWarning=true;
                  this.allData[i].errTip='请输入正确的' + this.allData[i].optionName;
                  return false
              }
            }
          }
        }
        //校验数字
        for(let i=0;i<this.listData.length;i++){
          let reg=/^(\-)?[0-9]+.?[0-9]*$/;
          let isNum="";
          if(this.listData[i].value !=''){
            let val=this.listData[i].value.toString();
            if(this.listData[i].ext1 == 1 && this.listData[i].type == 5){//验证整数
              isNum=reg.test(this.listData[i].value);
              if(!isNum || val.indexOf('.')!=-1){
                this.listData[i].isWarning=true;
                this.listData[i].errTip=this.listData[i].optionName + '需要输入整数';
                return false
              }else{
                this.listData[i].isWarning=false;
              }
            }else if(this.listData[i].ext1 == 2 && this.listData[i].type == 5){//验证小数
              isNum=reg.test(this.listData[i].value);
              if(!isNum){
                this.listData[i].isWarning=true;
                this.listData[i].errTip= this.listData[i].optionName + '需要输入小数' + '，' + this.listData[i].optionName + '须精确到小数点后两位'; ;
                return false
              }else if(val.indexOf('.')!=-1){
                let num_arr = val.split('.');
                if (num_arr[1].length > 2) {
                  this.listData[i].isWarning=true;
                  this.listData[i].errTip= this.listData[i].optionName + '需要输入小数' + '，' + this.listData[i].optionName + '须精确到小数点后两位';
                  return false
                }
              }else{
                this.listData[i].isWarning=false;
              }
            }else if(this.listData[i].ext1 == 3 && this.listData[i].type == 5){//验证百分比
              isNum=reg.test(this.listData[i].value);
              if(!isNum){
                this.listData[i].isWarning=true;
                this.listData[i].errTip= this.listData[i].optionName + '需要输入小数或整数, 小数须精确到小数点后两位';
                return false
              }
              if(val.indexOf('.')!=-1){
                let num_arr = val.split('.');
                if (num_arr[1].length > 2) {
                  this.listData[i].isWarning=true;
                  this.listData[i].errTip= this.listData[i].optionName + '需要输入小数或整数, 小数须精确到小数点后两位';
                  return false
                }else{
                  this.listData[i].isWarning=false;
                }
              }
            }else{
              this.listData[i].isWarning=false;
            }
          }
        }
        return true
      },

      //选择所属公海的数据
      pool:function(opt){
        this.param['clientPO.poolId'] = opt.val;
        this.topData[1].value = opt.optionName;

        //修改公海后，将新的公海名称和id传给组件
        this.poolArray=[];
        this.poolArray.push({'optionName': opt.optionName,'val':opt.val});
      },

      //删除所属公海
      removePool:function(){
        this.param['clientPO.poolId'] = '';
        this.topData[1].value = '';
      },


      //选择行业的数据
      industry:function(keys,titles){
        this.param['industrys'] = keys;
        this.topData[5].value=titles;
      },

      //保存
      addClients:function(){

        this.basicListData();
        this.listItemData();

        let isPass=this.validateData();
        if(!isPass){ //数据校验不通过时，页面滚动到指定错误位置
          this.$nextTick(()=>{
            document.querySelector('.errTip') && document.querySelector('.errTip').scrollIntoViewIfNeeded();
          })
          return;
        }
        addClient(this.param).then(res=>{
          if(res.code == 0){
            this.topData[5].isWarning=false;
            dataBase.top_alert('保存成功',true,1500);
            this.$router.push({path:'/crm/territorialSea/list'})
          }else if(res.code == 100002005){
            this.topData[5].isWarning=true;
            this.topData[5].errTip='行业超出最大长度限制';
            this.$nextTick(()=>{
              document.querySelector('.errTip') && document.querySelector('.errTip').scrollIntoViewIfNeeded();
            })
          }else{
            dataBase.top_alert(res.desc,false,1500);
          }
        })
      },

      //获取区域
      getArea:function(val){
        if(val.province !=""){
          this.param['clientPO.provinceCode'] = val.province.value;
          this.param['provinceCode'] = val.province.id;
        }
        if(val.city !=null){
          this.param['clientPO.cityCode'] = val.city.value;
          this.param['cityCode'] = val.city.id;
        }
        if(val.county !=null){
          this.param['clientPO.areaCode'] = val.county.value;
          this.param['areaCode'] = val.county.id;
        }
      },

      //获取客户编码
      getClientCode:function(){
        let date=new Date();
        let year=date.getFullYear().toString();
        let month=(date.getMonth()+1).toString()<10 ? '0' + (date.getMonth()+1).toString():(date.getMonth()+1).toString() ;
        let day=date.getDate().toString()<10 ? '0' + date.getDate().toString():date.getDate().toString();
        let hour=date.getHours().toString()<10 ? '0' + date.getHours().toString():date.getHours().toString();
        let minute=date.getMinutes().toString()<10 ? '0' + date.getMinutes().toString():date.getMinutes().toString();
        let second=date.getSeconds().toString()<10 ? '0' + date.getSeconds().toString():date.getSeconds().toString();
        let clientCode=year + month + day + hour + minute + second;
        return clientCode;
      },

      //上传附件
      getFileIds(){
        let ids = [];
        this.fileList.forEach((file)=>{
          ids.push(file.id);
        });
        this.fileIds = ids.join(',');
        this.param['mediaIds']=this.fileIds;
      },
      //处理上传附件删除
      handleRemoveFile(file,fileList){
        this.getFileIds();
      },
      //处理上传附件成功
      handleSuccessFile(file){
        this.fileArr.push.apply(this.fileArr,file);
        this.getFileIds(this.fileArr);
      },
      //上传附件前处理
      beforeUploadFile(file){
        let size = file.size;
        let fileName = file.name;
        let isExt = fileName.lastIndexOf(".");
        let fileExt = fileName.substr(isExt).toLowerCase();//获得文件后缀名
        if(!(".txt.xml.pdf.doc.ppt.xls.docx.pptx.xlsx.mp3.wma.amr.mp4.rar.zip".includes(fileExt))){
          dataBase.top_alert('只能上传txt,xml,pdf,doc,ppt,xls,docx,pptx,xlsx,mp3,wma,amr,mp4,rar,zip；如需上传其它格式文件请先将其压缩后再上传',false,3000);
          return false;
        }
        if(_.is_vip&&size>50*1024000){
          dataBase.top_alert('文件大小不超过50M',false,3000);
          return false;
        }else if(size>10*1024000){
          dataBase.top_alert('文件大小不超过10M',false,3000);
          return false;
        }
        return true;
      },


      //上传图片返回的数据
        moreImgUpload(data) {
          let imgArr=[],imageURL='';
          data.map(item=>{
            imageURL = item.imageURL || item.picPath;
            imgArr.push(imageURL);
          })
          this.param['imgurl']=imgArr.join(',');
          this.detail.picList = data;
        },

      // 创建人 选人组件回调
      chooseDone_creator(dept,tag,user){
        let userResult = []
        user.map(item => {
          userResult.push(item.userId)
        })
        this.param['givenUserIds']=userResult.join('|')
        this.defaultUserVOList_creator=user;
        this.isReset = false;
      },

      //关闭选人
      closePerson:function(){
        this.isReset=false;
      },

      //修改选人
      reset:function(){
        this.isReset=true;
      },

      //打开地图,选择地址
      openMap:function(){
        this.isOpenMap=true;
      },
      confirmMap:function(val){
        this.param['clientPO.latitude']=val.lat;
        this.param['clientPO.longitude']=val.lng;
        this.topData[4].value=val.address;
      },

      //返回公海池列表
      backList:function(){
        if(this.isFromRecycle != 1){
          this.$router.push({path:'/crm/territorialSea/list'})
        }else{
          this.$router.push({path:'/crm/territorialSea/recycleList'})
        }
      },


      // 编辑 获取客户详情给字段赋值
      getDetail:function(){
        let obj={
          'clientId':this.clientId,
        }
        getPoolDetail(obj).then(res=>{
          if(res.code == 0){
            // 固定字段赋值
            this.detail=res.data.tbCrmClientInfoPO
            this.topData[0].value=this.detail.clientName;
            this.topData[1].value=this.detail.poolName;
            this.topData[2].value=this.detail.clientCode;
            this.topData[4].value=this.detail.address;
            this.topData[6].value=this.detail.phone;
            this.topData[7].value=this.detail.email;
            this.topData[8].value=this.detail.website;
            this.bottomData[0].value=this.detail.remark;
            this.param['clientPO.latitude']=this.detail.latitude;
            this.param['clientPO.longitude']=this.detail.longitude;

            // 区域赋值
            this.areaObj={
              city:{
                name:this.detail.cityCode,
              },
              county:{
                name:this.detail.areaCode,
              },
              province:{
                name:this.detail.provinceCode,
              }
            }
            this.topData[3].value=this.areaObj;

            // 公海id
            this.param['clientPO.poolId']=this.detail.poolId;
            this.poolArray.push({'optionName':this.detail.poolName,'val':this.detail.poolId});

            // 行业赋值
            let keyArr=[],titleArr=[];
            this.detail.industryList.forEach(item=>{
              let industryObj={
                checked: true,
                key: item.industryId,
                title: item.industryName,
              }
              this.industryArray.push(industryObj);
              keyArr.push(item.industryId)
              titleArr.push(item.industryName)
            })
            this.param['industrys'] = keyArr.join(',');
            this.topData[5].value = titleArr.join('|');

            // 自定义字段赋值
            res.data.itemList.forEach(item=>{
              this.listData.forEach(per=>{
                if(item.fieldName===per.optionName){
                  if(per.itemType == 'select'){
                    per.value =item.fieldValue;
                  }else if(per.itemType == 'date'){
                    per.value = item.optionVal?new Date(item.optionVal):'';
                  }else{
                    per.value =item.optionVal;
                  }
                }
              })
            })
            for(let i=0;i<this.fieldArr.length;i++){
              for(let j=0;j<res.data.itemList.length;j++){
                if(this.fieldArr[i].fieldName==res.data.itemList[j].fieldName){
                  this.fieldArr[i].id=res.data.itemList[j].id;
                }
              }
            }

            //图片
            let imgArr =[];
            this.detail.picList.forEach(item=>{
               imgArr.push({imageURL:item.picPath});
            })
            this.picOption.moreList=imgArr;

            // 附件
            this.fileList=res.data.mediaList;

            // 相关人
            this.defaultUserVOList_creator=this.detail.ccPersons;
          }

        })
      },


      //编辑保存
      editClient:function(){
        this.param['clientPO.id']=this.clientId;
        this.getFileIds(); //附件

        //图片
        this.moreImgUpload(this.detail.picList);


        let ccPersonArr=[];
        this.defaultUserVOList_creator.forEach(item=>{ //选人
          ccPersonArr.push(item.userId)
          this.param['givenUserIds']=ccPersonArr.join('|')
        })


        this.basicListData(); //固定字段
        this.listItemData(); //自定义字段

        let isPass=this.validateData();
        if(!isPass){ //数据校验不通过时，页面滚动到指定错误位置
          this.$nextTick(()=>{
            document.querySelector('.errTip') && document.querySelector('.errTip').scrollIntoViewIfNeeded();
          })
          return;
        }
        updateClient(this.param).then(res=>{
          if(res.code == 0){
            this.topData[5].isWarning=false;
            dataBase.top_alert('保存成功',true,1500);
            if(this.isFromRecycle != 1){
              this.$router.push({path:'/crm/territorialSea/list'})
            }else{
              this.$router.push({path:'/crm/territorialSea/recycleList'})
            }
          }else if(res.code == 100002005){
            this.topData[5].isWarning=true;
            this.topData[5].errTip='行业超出最大长度限制';
            this.$nextTick(()=>{
              document.querySelector('.errTip') && document.querySelector('.errTip').scrollIntoViewIfNeeded();
            })
          }else{
            dataBase.top_alert(res.desc,false,1500);
          }
        })
      }
    }


}
</script>
<style lang='scss' scoped>
  @import "./operate.scss";
</style>
