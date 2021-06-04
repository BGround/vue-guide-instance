<template>
  <div class="visitWrap">
    <!--头部标题-->
    <div class="title">
      <p><span class="backIcon" @click="backList"></span>拜访<span> / 编辑拜访</span></p>
    </div>

    <!--表单内容 固定字段-->
    <div class="form">
      <div class="operate-form" v-for="(item,index) in basicList" :key="index">
        <div class="form-item" v-if="item.optionName == '标题' && item.status == 1">
          <h1 :class="{isMust:item.isMust == 1}">拜访标题</h1>
          <div class="basicItem">
            <qwui-input inputType="textarea" :maxLength="2000" v-model="item.value"></qwui-input>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>

        <div class="form-item" v-if="item.optionName == '内容' && item.status == 1">
          <h1 :class="{isMust:item.isMust == 1}">拜访内容</h1>
          <div class="basicItem">
            <qwui-input inputType="textarea" :maxLength="2000" v-model="item.value"></qwui-input>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>

        <div class="form-item" v-if="item.optionName == '拜访时间' && item.status == 1">
          <h1 :class="{isMust:item.isMust == 1}">拜访时间</h1>
          <div class="basicItem">
            <qwui-input inputType="readonly" v-model="item.value"></qwui-input>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>

        <div class="form-item" v-if="item.optionName == '所属外勤单' && item.status == 1">
          <h1 :class="{isMust:item.isMust == 1}">所属外勤单</h1>
          <div class="basicItem">
            <div class="clickBox" @click="openModal('outWork')">
              <person-label class="personLabel"
                            v-for="(item,index) in outWorkVal"
                            :key="index"
                            v-if="item.name != ''"
                            :src="item.headPic"
                            :name="item.name"
                            :deleteIcon="true"
                            @delete="del('outWork',index)">
              </person-label>

              <span v-if="outWorkVal.length == 0 || outWorkVal[0].name == ''">点击选择</span>
            </div>
             <div class="numTip" v-if="outWorkVal.length!=0 && outWorkVal[0].name!=''">
              已选<span class="num">{{outWorkVal.length}}</span>外勤单
              <span class="resetBtn" @click="modifyVisit(4)">修改</span>
            </div>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>

        <div class="form-item" v-if="item.optionName == '拜访客户' && item.status == 1">
          <h1 :class="{isMust:item.isMust == 1}">拜访客户</h1>
          <div class="basicItem">
            <div class="clickBox" @click="openModal('client')">
              <person-label class="personLabel"
                            v-for="(item,index) in clientList"
                            :key="index"
                            v-if="clientList[0].clientName!=''"
                            :src="item.headPic"
                            :name="item.clientName || item.label"
                            :deleteIcon="true"
                            @delete="del('client',index)"
                            :defaultCheckedList="basicList[4].value">
              </person-label>
              <span v-if="clientList.length == 0 || clientList[0].clientName==''">点击选择</span>
            </div>
            <div class="numTip" v-if="clientList.length!=0 && clientList[0].clientName!=''">
              已选<span class="num">{{clientList.length}}</span>成员
              <span class="resetBtn" @click="modifyVisit(1)">修改</span>
            </div>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>

        <div class="form-item" v-if="item.optionName == '拜访联系人' && item.status == 1 && clientList.length>0">
          <h1 :class="{isMust:item.isMust == 1}">拜访联系人</h1>
          <div class="basicItem">
            <div class="clickBox" @click="openModal('contact')">
              <person-label class="personLabel"
                            v-for="(item,index) in contactList"
                            :key="index"
                            v-if="contactList[0].contactsName!=''"
                            :src="item.headPic"
                            :name="item.contactsName || item.label"
                            :deleteIcon="true"
                            @delete="del('contact',index)">
              </person-label>
              <span v-if="contactList.length == 0 || contactList[0].contactsName==''">点击选择</span>
            </div>
            <div class="numTip" v-if="contactList.length!=0 && contactList[0].contactsName!=''">
              已选<span class="num">{{contactList.length}}</span>成员
              <span class="resetBtn" @click="modifyVisit(2)">修改</span>
            </div>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>

        <div class="form-item" v-if="item.optionName == '拜访商机' && item.status == 1 && clientList.length>0">
          <h1 :class="{isMust:item.isMust == 1}">拜访商机</h1>
          <div class="basicItem">
            <div class="clickBox" @click="openModal('business')">
              <person-label class="personLabel"
                            v-for="(item,index) in businessList"
                            :key="index"
                            v-if="businessList[0].title!=''"
                            :src="item.headPic"
                            :name="item.title || item.label"
                            :deleteIcon="true"
                            @delete="del('business',index)">
              </person-label>
              <span v-if="businessList.length == 0 || businessList[0].title==''">点击选择</span>
            </div>
            <div class="numTip" v-if="businessList.length!=0 && businessList[0].title!=''">
              已选<span class="num">{{businessList.length}}</span>成员
              <span class="resetBtn" @click="modifyVisit(3)">修改</span>
            </div>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>

        <div class="form-item" v-if="item.optionName == '客户地址' && item.status == 1 && showClienAddr">
          <h1 :class="{isMust:item.isMust == 1}">客户地址</h1>
          <div class="basicItem">
            <qwui-input inputType="readonly" v-model="item.value"></qwui-input>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>

        <div class="form-item" v-if="item.optionName == '拜访地址' && item.status == 1">
          <h1 :class="{isMust:item.isMust == 1}">拜访地址</h1>
          <div class="basicItem">
            <qwui-input inputType="text" v-model="item.value"></qwui-input>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>
      </div>
    </div>


    <!--自定义字段-->
    <div class="form" v-if="showItemList">
      <div class="operate-form">
        <div class="form-item" v-for="(item,index) in listData" :key="index" v-if="item.status == 1">
          <h1 :class="{isMust:item.isMust == 1}">{{item.optionName}}</h1>
          <div class="basicItem">
            <!--单行-->
            <qwui-input inputType="text"
                        :maxLength="200"
                        :inputTips="item.placeholderName"
                        v-if="item.type == 1"
                        v-model="item.value">
            </qwui-input>
            <!--多行-->
            <qwui-input inputType="textarea"
                        :maxLength="2000"
                        :inputTips="item.placeholderName"
                        v-if="item.type == 2"
                        v-model="item.value">
            </qwui-input>
            <!--数值,联系方式-->
            <qwui-input inputType="text"
                        :inputTips="item.placeholderName"
                        v-if="item.type == 5 || item.type == 3"
                        v-model="item.value">
            </qwui-input>
            <span class="percent" v-if="item.status == 1 && item.type == 5 && item.ext1 == 3">%</span>
            <!--下拉-->
            <div class="address-county" v-if="item.type == 0">
              <qw-select @selectItem="(val,idx)=>{selectItem(val,idx,index)}"
                           ref="select"
                           v-model="item.value"
                           :dataList="item.data">
              </qw-select>
            </div>
            <!--日期-->
            <date-picker class="date-picker-width"
                         v-if="item.type == 4"
                         v-model="item.value"
                         format="YYYY-MM-DD HH:mm"
                         :showButtons ="true"
                         :placeholder="item.placeholderName"
                         @confirm="dateConfirm" >
            </date-picker>
          </div>
          <p class="errTip" v-if="item.isWarning">{{item.warningTips}}</p>
        </div>
      </div>
    </div>


    <!--图片-->
    <div class="form">
      <div class="form-item">
        <h1 :class="{isMust:basicList[9].isMust == 1}">图片</h1>
        <div class="basicItem">
          <upload-img class="uploadBtn" :uploadConfig="picOption" @moreImgUpload="moreImgUpload"></upload-img>
          <span class="fileTip">支持jpg、jpeg、png</span>
        </div>
         <p class="errTip" v-if="basicList[9].isWarning">{{basicList[9].warningTips}}</p>
      </div>
    </div>



    <div class="selectPerson">
      <!--负责人-->
      <div class="form-item">
        <h1 :class="{isMust:basicList[10].isMust == 1}">负责人</h1>
        <div class="basicItem">
          <div class="ccPerson">
            <pickExam :useTab="defaultTags"
                      :useUsers="toPerson"
                      :isShowRadios="false"
                      :isReset="isResetToPerson"
                      onlyUser
                      @closePerson="closePerson"
                      @chooseDone="chooseDone_toPerson">
            </pickExam>
          </div>
          <div class="numTip" v-if="toPerson.length!=0">
            已选<span class="num">{{toPerson.length}}</span>成员
            <span class="resetBtn" @click="modifyPerson(1)">修改</span>
          </div>
        </div>
        <p class="errTip" v-if="basicList[10].isWarning">{{basicList[10].warningTips}}</p>
      </div>

      <!--相关人-->
      <div class="form-item">
        <h1>相关人</h1>
        <div class="basicItem">
          <div class="ccPerson">
            <pickExam :useTab="defaultTags"
                      :useUsers="ccPerson"
                      :isShowRadios="false"
                      :isReset="isResetCCPerson"
                      onlyUser
                      @closePerson="closePerson"
                      @chooseDone="chooseDone_ccPerson">
            </pickExam>
          </div>
          <div class="numTip" v-if="ccPerson.length!=0">
            已选<span class="num">{{ccPerson.length}}</span>成员
            <span class="resetBtn" @click="modifyPerson(2)">修改</span>
          </div>
        </div>
      </div>
    </div>

    <!--保存-->
    <qwui-button type="primary" class="updateBtn" @click="update">保存</qwui-button>

    <!-- 所属外勤单 -->
    <select-out-work :show="showOutWorkModal"
                     :isDel='isDel'
                     @on-confirm='onConfirm'
                     @on-close='onClose'>
    </select-out-work>

    <!--选择拜访客户-->
    <select-client-modal v-model="showClientModal"
                         @on-confirm="onConfirmClient"
                         :defaultCheckedList="basicList[4].value">
    </select-client-modal>

    <!--选择拜访联系人-->
    <select-contact-modal v-model="showContactModal"
                          @on-confirm="onConfirmContact"
                          :selectClientId="selectClientId"
                          :defaultCheckedList="basicList[5].value">
    </select-contact-modal>

    <!--选择拜访商机-->
    <select-business-modal v-model="showBusinessModal"
                          @on-confirm="onConfirmBusiness"
                          :selectClientId="selectClientId"
                          :defaultCheckedList="basicList[6].value">
    </select-business-modal>

  </div>
</template>

<script>
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import datePicker from '@/components/base/VueDatepickerLocal';
  import uploadImg from '@/components/Add/uploadImg/QwUploadImg';
  import pickExam from '@/components/pickPerson/pickExam';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
  import qwSelect from '@/components/qwuiBase/qwuiSelect/QwSelect'
  import personLabel from "crm/components/qw-person-label/qw-person-label";
  import selectOutWork from './selectModal/selectOutWork';
  import selectClientModal from './selectModal/selectClientModal';
  import selectContactModal from './selectModal/selectContactModal';
  import selectBusinessModal from './selectModal/selectBusinessModal';

  import {getOptionItem,getVisitHistoryInfo,updateOutside,getClientAddress} from '@/module/crm/api/visit'
    export default {
      name: "visitEdit",
      components:{
        qwuiInput,
        datePicker,
        uploadImg,
        pickExam,
        qwuiButton,
        qwSelect,
        personLabel,
        selectOutWork,
        selectClientModal,
        selectContactModal,
        selectBusinessModal
      },
      data(){
        return{
          title:'123',
          id:'',//客户id
          basicList:[//固定字段
            {optionName:'标题',isMust:'1',status:'1',value:'',isWarning:false,warningTips:''},
            {optionName:'内容',isMust:'1',status:'1',value:'',isWarning:false,warningTips:''},
            {optionName:'拜访时间',isMust:'1',status:'1',value:'',isWarning:false,warningTips:''},
            {optionName:'所属外勤单',isMust:'',status:'',value:[],isWarning:false,warningTips:''},
            {optionName:'拜访客户',isMust:'1',status:'1',value:[],isWarning:false,warningTips:''},
            {optionName:'拜访联系人',isMust:'',status:'1',value:[],isWarning:false,warningTips:''},
            {optionName:'拜访商机',isMust:'',status:'',value:[],isWarning:false,warningTips:''},
            {optionName:'客户地址',isMust:'',status:'',value:'',isWarning:false,warningTips:''},
            {optionName:'拜访地址',isMust:'',status:'',value:'',isWarning:false,warningTips:''},
            {optionName:'图片',isMust:'',status:'1',value:'',isWarning:false,warningTips:''},
            {optionName:'负责人',isMust:'1',status:'1',value:'',isWarning:false,warningTips:''}
          ],
          listData:[],//自定义字段
          itemList:[],//自定义字段值
          detail:{},//详情
          showClienAddr:false,//是否显示客户地址字段
          showItemList:false,//是否显示自定义字段模块
          clientId:'',//拜访客户id
          contactId:'',//拜访联系人id
          businessId:'',//拜访商机id
          picOption: { //上传图片配置
            agent: 'crm',
            uploadFileId: 'coverImg',
            showType: 'large',
            isMoreImg:true,//true：多图,false：封面图片
            moreList:[],//多图列表
          },
          defaultTags:[//选人配置
            {text:'标签人员'},
            {text:'特定人员'},
            {text:'批量导入'},
            {text:'高级筛选'},
          ],
          toPerson:[],//负责人
          ccPerson:[],//相关人
          isResetToPerson:false,//修改负责人
          isResetCCPerson:false,//修改相关人
          param:{ //传给后台参数
            ['submitType']:0,
            ['tbOutsideWorkInfoPO.id']: '',
            'itemJson':'',
            ['tbOutsideWorkInfoPO.outworkTitle']: '',
            ['tbOutsideWorkInfoPO.outworkContent']: '',
            ['tbOutsideWorkInfoPO.outworkId']:'',
            ['tbOutsideWorkInfoPO.oswgdTitle']:'',
            ['tbOutsideWorkInfoPO.clientId']: '',
            ['tbOutsideWorkInfoPO.clientName']: '',
            ['tbOutsideWorkInfoPO.contactId']:'',
            ['tbOutsideWorkInfoPO.contactName']:'',
            ['tbOutsideWorkInfoPO.businessId']:'',
            ['tbOutsideWorkInfoPO.businessName']:'',
            ['tbOutsideWorkInfoPO.clientAddress']:'',
            ['tbOutsideWorkInfoPO.address']: '',
            'imgFile':'',
            'imgurl': '',
            'userIds': '',
            'givenUserIds': '',
          },
          listObj:{
            list:[]
          },
          fieldObj:{
            fieldId:'',
            fieldValue:'',
            fieldName:'',
            id:''
          },
          allData:[],//全部字段,
          showOutWorkModal:false, //是否显示所属外勤单弹窗
          showClientModal:false,//是否显示拜访客户弹窗
          showContactModal:false,//是否显示拜访联系人弹窗
          showBusinessModal:false,//是否显示拜访商机弹窗
          isDel:false,
          outWorkVal:[],//外勤单
          clientList:[], //拜访客戶列表
          contactList:[], //拜访联系人列表
          businessList:[], //拜访商机列表
          selectClientId:'', //拜访联系人，商机参数
          optionData:[], //下拉项
          selectData:0,//下拉列表值
          clientAddress:'',//客户地址
        }
      },
      watch:{
        //监听拜访客户id变化，改变拜访联系人，商机数据
        selectClientId:function(val,oldVal){
          if(oldVal!='' && val!=oldVal){
            this.contactList.splice(0, 1);
            this.businessList.splice(0, 1);
            this.basicList[5].value=[];
            this.basicList[6].value=[];
            this.getClientAddr(val)
          }
          if(val==undefined){
            this.selectClientId=oldVal;
          }
        }
      },
      created(){
        this.init();
        this.id = this.$route.query.outworkIds;
      },
      mounted () {
        this.$refs.select&&this.$refs.select.setValue(11);
      },
      methods:{

      //  初始化
        init(){
          this.getItem();
        },

      //  获取字段
        getItem(){
          getOptionItem()
            .then(res=>{
              if(res.code==0){
                this.listData = res.data.list;

                //固定字段 显示 必填
                res.data.basicList.forEach(item=>{
                  this.basicList.forEach(opt=>{
                    if(item.optionName == opt.optionName){
                      opt.isMust=item.isMust;
                      opt.status=item.status;
                    }
                  })
                })

              //  自定义字段
                let listObj={
                  placeholderName:'',
                }
                let listArr=[],arr=[];
                this.listData.forEach(item=>{
                  if(item.status == 1){ //只要有一个自定义字段开启，则显示自定义字段模块
                    arr.push(item.status)
                  }
                  this.showItemList = arr.length >0? true:false;
                  let newListData = Object.assign(item,listObj);
                  newListData.placeholderName=item.list.length>0?item.list[0].name:item.optionName;
                  listArr.push(newListData)

                  //下拉列表项数据格式化
                  if(item.type == 0){
                    let arr = [{
                      optionName:'请选择',
                      val:'',
                    }]
                    item.list.map(per=>{
                      let optionObj = {
                        optionName:per.name,
                        val:per.id,
                      }
                      arr.push(optionObj);
                    })
                    item.data = arr;
                    this.optionData = arr;
                  }
                  if(item.status == 1){
                      this.fieldObj={
                        fieldId:item.id,
                        fieldName:item.optionName,
                        fieldValue:item.value,
                        id:'',
                    }
                    this.listObj.list.push(this.fieldObj);
                  }
                })
                this.listData=listArr;

                //获取详情
                this.getDetial();
              }
            })
            .catch(err=>{
              _.alert('提示','网络错误')
            })
        },

        //  获取详情
        getDetial(){
          let obj={
            'id':this.id,
          }
          getVisitHistoryInfo(obj)
            .then(res=>{
              if(res.code==0){
                this.itemList = res.data.itemList;
                this.detail = res.data.tbOutsideWorkInfoPO;

                //固定字段赋值
                this.basicList[0].value = this.detail.outworkTitle;
                this.basicList[1].value = this.detail.outworkContent;
                this.basicList[2].value = this.detail.createTime;

                this.basicList[7].value = this.detail.clientAddress;
                this.basicList[8].value = this.detail.address;

                this.selectClientId = this.detail.clientId;

                //所属外勤单，拜访客户,联系人,商机数据格式化
                this.outWorkVal.push({
                  name:this.detail.oswgdTitle,
                  headPic:'0',
                  id:this.detail.outworkId,
                })
                this.basicList[3].value= this.detail.oswgdTitle !=''?this.outWorkVal:[];
                this.clientList.push({
                  clientName:this.detail.clientName,
                  headPic:'0',
                  id:this.detail.clientId,
                })
                this.contactList.push({
                  contactsName:this.detail.contactName,
                  headPic:'0',
                  id:this.detail.contactId,
                })
                this.businessList.push({
                  title:this.detail.businessName,
                  headPic:'0',
                  id:this.detail.businessId,
                })


                //拜访客户，联系人，商机上一次选中项
                this.detail.clientName !=''? this.basicList[4].value.push({
                  label:this.clientList[0].clientName,
                  value:this.clientList[0].id,
                  headPic:this.clientList[0].headPic
                }):[];
                this.detail.contactName != ''?this.basicList[5].value.push({
                  label:this.contactList[0].contactsName,
                  value:this.contactList[0].id,
                  headPic:this.contactList[0].headPic
                }):[];
                this.detail.businessName !=''? this.basicList[6].value.push({
                  label:this.businessList[0].title,
                  value:this.businessList[0].id,
                  headPic:this.businessList[0].headPic
                }):[];


                //图片
                let imgArr =[];
                this.detail.picList.forEach(item=>{
                  imgArr.push({imageURL:item.picPath});
                })
                this.picOption.moreList=imgArr;

                //客户地址是否显示
                this.clientAddress = this.detail.clientAddress;
                this.showClienAddr = this.clientAddress!=''?true:false;

                // 自定义字段赋值
                this.itemList.forEach(item=>{
                  this.listData.forEach(opt=>{
                    if(item.fieldName == opt.optionName){
                      if(opt.type == 4){
                        let optionVal = item.optionVal? new Date(item.optionVal):'';
                        this.$set(opt,'value',optionVal)
                      }else if(opt.type == 0){
                        this.$set(opt,'value',item.fieldValue)
                      } else{
                        this.$set(opt,'value',item.optionVal)
                      }
                    }
                  })
                })
                this.listObj.list.map(item=>{
                  this.itemList.map(per=>{
                    if(item.fieldName == per.fieldName){
                      item.id = per.id;
                    }
                  })
                })


              //  负责人  相关人
                this.toPerson = this.detail.toPersons;
                this.ccPerson = this.detail.ccPersons;

              }
            })
            .catch(err=>{
              _.alert('提示','网络错误')
            })
        },


        // 修改拜访客户，获取新的客户地址
        getClientAddr(id){
          let obj={
            'clientId':id,
          }
          getClientAddress(obj).then(res=>{
              if(res.code == 0){
                this.clientAddress = res.data.clientAddress;
                this.showClienAddr = this.clientAddress!=''?true:false;
                this.basicList[7].value = res.data.clientAddress;
              }else{
                _.alert('提示',res.desc)
              }
            }).
            catch(err=>{
              _.alert('提示','网络错误')
            })
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
          this.basicList[9].value = data;
        },

        //  选择日期
        dateConfirm(val){
          this.listData.map(item=>{
            if(item.type == 4){
              let StartDate = new Date(val);
              let date = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes();
              item.value = date;
            }
          })
        },

        // 负责人 选人组件回调
        chooseDone_toPerson(dept,tag,user){
          let userResult = []
          user.map(item => {
            userResult.push(item.userId)
          })
          this.param['userIds']=userResult.join('|')
          this.toPerson=user;
          this.isResetToPerson = false;
        },

        // 相关人 选人组件回调
        chooseDone_ccPerson(dept,tag,user){
          let userResult = []
          user.map(item => {
            userResult.push(item.userId)
          })
          this.param['givenUserIds']=userResult.join('|')
          this.ccPerson=user;
          this.isResetCCPerson = false;
        },

        //关闭选人
        closePerson:function(){
          this.isResetToPerson=false;
          this.isResetCCPerson = false;
        },

        //修改选人
        modifyPerson:function(index){
          if(index==1){
            this.isResetToPerson = true;
            this.isResetCCPerson = false;
          }else{
            this.isResetCCPerson = true;
            this.isResetToPerson = false;
          }
        },

      // 打开外勤单弹窗
      onConfirm(val){
        val.headPic = '0';
        this.outWorkVal=[];
        this.outWorkVal.push(val);
        this.showOutWorkModal=false;
        this.isDel = false;

        this.param['tbOutsideWorkInfoPO.outworkId'] = val.id;
        this.param['tbOutsideWorkInfoPO.oswgdTitle'] = val.name;
        this.basicList[3].value=this.outWorkVal;
      },
      // 关闭外勤单
      onClose(){
        this.showOutWorkModal=false;
      },

      //  打开弹窗
        openModal(type){
          if(type == 'client'){
            this.showClientModal = true;
          }else if(type == 'contact'){
            this.showContactModal = true;
          }else if(type == 'business'){
            this.showBusinessModal = true;
          }else{
            this.showOutWorkModal = true;
          }
        },

        //  客户弹窗
        onConfirmClient(val){
          // val[0].headPic = '0';
          if(val.length !=0){
            this.clientList = val;
            this.selectClientId = val[0].id;
            this.param['tbOutsideWorkInfoPO.clientId'] = val[0].id;
            this.param['tbOutsideWorkInfoPO.clientName'] = val[0].clientName;
            this.basicList[4].value=[];
            this.basicList[4].value.push({label: val[0].clientName || val[0].label, value: val[0].id || val[0].value});
          }else{
            this.clientList = '';
            this.selectClientId = '';
            this.param['tbOutsideWorkInfoPO.clientId'] = '';
            this.param['tbOutsideWorkInfoPO.clientName'] = '';
            this.basicList[4].value=[];
          }
        },

        //  联系人弹窗
        onConfirmContact(val){
          // val[0].headPic = '0';
          if(val.length != 0){
            this.contactList = val;
            this.param['tbOutsideWorkInfoPO.contactId'] = val[0].id;
            this.param['tbOutsideWorkInfoPO.contactName'] = val[0].contactsName;
            this.basicList[5].value=[];
            this.basicList[5].value.push({label: val[0].contactsName || val[0].label, value: val[0].id || val[0].value})
          }else{
            this.contactList = '';
            this.param['tbOutsideWorkInfoPO.contactId'] = '';
            this.param['tbOutsideWorkInfoPO.contactName'] = '';
            this.basicList[5].value=[];
          }
        },

        //  商机弹窗
        onConfirmBusiness(val){
          // val[0].headPic = '0';
          if(val.length != 0){
            this.businessList = val;
            this.param['tbOutsideWorkInfoPO.businessId'] = val[0].id;
            this.param['tbOutsideWorkInfoPO.businessName'] = val[0].title;
            this.basicList[6].value=[];
            this.basicList[6].value.push({label: val[0].title || val[0].label, value: val[0].id || val[0].value})
          }else{
            this.businessList = '';
            this.param['tbOutsideWorkInfoPO.businessId'] = '';
            this.param['tbOutsideWorkInfoPO.businessName'] = '';
            this.basicList[6].value=[];
          }

        },

      //  删除客户
        del(type,index){
          if(type == 'client'){
            this.clientList.splice(index, 1);
            this.basicList[4].value=[];
          }else if(type == 'contact'){
            this.contactList.splice(index, 1);
            this.basicList[5].value=[];
          }else if(type == 'business'){
            this.businessList.splice(index, 1);
            this.basicList[6].value=[];
          }else{
            this.outWorkVal.splice(index, 1);
            this.basicList[3].value=[];
            this.isDel=true;
          }
        },

      //  修改部分客户，联系人，商机
        modifyVisit(index){
          if(index == 1){
            this.showClientModal = true;
          }else if(index == 2){
            this.showContactModal = true;
          }else if(index == 3){
            this.showBusinessModal = true;
          }else{
            this.showOutWorkModal = true;
          }
        },


        //下拉列表选项值
        selectItem:function (opt,val,index) {
          this.selectData=val;
          this.listData[index].value = val;
        },


      //  固定字段编辑赋值
        basicListData(){
          this.param['tbOutsideWorkInfoPO.id'] = this.id;
          this.param['tbOutsideWorkInfoPO.outworkTitle'] = this.basicList[0].value;
          this.param['tbOutsideWorkInfoPO.outworkContent'] = this.basicList[1].value;

          //外勤单
          this.param['tbOutsideWorkInfoPO.outworkId'] = this.outWorkVal.length == 0? '':this.outWorkVal[0].id;
          this.param['tbOutsideWorkInfoPO.oswgdTitle'] = this.outWorkVal.length == 0? '':this.outWorkVal[0].name;
          //客户
          this.param['tbOutsideWorkInfoPO.clientId'] = this.clientList.length == 0? '':this.clientList[0].id || this.clientList[0].value;
          this.param['tbOutsideWorkInfoPO.clientName'] = this.clientList.length == 0? '':this.clientList[0].clientName || this.clientList[0].label;
          //联系人
          this.param['tbOutsideWorkInfoPO.contactId'] = this.contactList.length == 0? '':this.contactList[0].id || this.contactList[0].value;
          this.param['tbOutsideWorkInfoPO.contactName'] = this.contactList.length == 0? '':this.contactList[0].contactsName || this.contactList[0].label;
          //商机
          this.param['tbOutsideWorkInfoPO.businessId'] = this.businessList.length == 0? '':this.businessList[0].id || this.businessList[0].value;
          this.param['tbOutsideWorkInfoPO.businessName'] = this.businessList.length == 0? '':this.businessList[0].title || this.businessList[0].label;
          //客户地址
          this.param['tbOutsideWorkInfoPO.clientAddress'] = this.basicList[7].value;
          //联系地址
          this.param['tbOutsideWorkInfoPO.address'] = this.basicList[8].value;

          //图片
          this.moreImgUpload(this.detail.picList);
          this.basicList[9].value = this.detail.picList;

          // 负责人 相关人
          let toPersonArr=[],ccPersonArr=[];
          this.toPerson.forEach(item=>{
            toPersonArr.push(item.userId);
          })
          this.ccPerson.forEach(item=>{
            ccPersonArr.push(item.userId);
          })
          this.param['userIds'] = toPersonArr.join('|');
          this.param['givenUserIds'] = ccPersonArr.join('|')

          //自定义字段
          let arr=[];
          this.listData.map(item=>{
            if(item.status == 1){
              if(item.type == 5 && item.ext1 == 3 && item.value !=''){
                arr.push(item.value + '%')
              }else if(item.type == 4){
                if(item.value !=''){
                  let StartDate = new Date(item.value);
                  let date = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate() + ' ' + StartDate.getHours() + ':' + StartDate.getMinutes();
                  arr.push(date)
                }else {
                  arr.push(item.value)
                }
              } else{
                arr.push(item.value)
              }
            }
          })
          for(let i=0;i<this.listObj.list.length;i++){
            this.listObj.list[i].fieldValue=arr[i];
          }
          this.param.itemJson=JSON.stringify(this.listObj);

        },


        //校验是否必填
        valid(item){
          if(item.isMust == 1 && item.status == 1){
            if(item.optionName == '负责人' && this.toPerson.length == 0){
              return item.optionName + '不能为空';
            }
            if(item.optionName != '负责人'){
              if(item.value == '' && item.optionName != '客户地址'){
                return item.optionName + '不能为空';
              }else{
                if(item.type == 5){ //校验数值类型
                  return this.numHasError(item)
                }
                if(item.type == 3){ //校验联系方式类型
                  return this.phoneHasError(item)
                }
              }
            }
          }else{
            if(item.type == 5){ //校验数值类型
              return this.numHasError(item)
            }
            if(item.type == 3){ //校验联系方式类型
              return this.phoneHasError(item)
            }
            return ''
          }
        },

        // 校验数字
        numHasError(item) {
          if (item.value) {
            let arr = [
              {
                key: '1',
                reg: /^(\-)?[0-9]+$/,
                label: item.optionName + '需要输入整数'
              },{
                key: '2',
                reg: /^(\-)?\d+(\.\d{1,2})?$/,
                label: item.optionName + '需要输入小数, 小数须精确到小数点后两位'
              },{
                key: '3',
                reg: /^(\-)?\d+(\.\d{1,2})?$/,
                label: item.optionName +  '需要输入小数或整数, 小数须精确到小数点后两位'
              },
            ];
            let text = '';
            for(let i = 0; i < arr.length ; i++) {
              if (item.ext1 == arr[i].key) {
                if(!arr[i].reg.test(item.value)) {
                  text = arr[i].label;
                  break;
                }
              }
            }
            return text;
          } else {
            return '';
          }
        },

        // 校验联系方式
        phoneHasError(item){
          if(item.value){
            let phone = /^((\d{5,15})|(\d{4}|\d{3})-(\d{7,8})(-\d{3,6})?)$/g;
            let tel=phone.test(item.value);
            if(!tel){
              return '请输入正确的' + item.optionName;
            }else{
              return '';
            }
          }
        },


        //校验数据
        validateData(){
          let hasError = false;

          //固定字段校验必填
          for(let i=0;i<this.basicList.length;i++){
            let msg=this.valid(this.basicList[i]);
            if(msg!='' && msg!=undefined){
              hasError = true;
              this.basicList[i].isWarning = true;
            }else{
              this.basicList[i].isWarning = false;
            }
            this.basicList[i].warningTips = msg;
          }

          //自定义字段校验必填
          for(let i=0;i<this.listData.length;i++){
            let msg=this.valid(this.listData[i]);
            if(msg!='' && msg!=undefined){
              hasError = true;
              this.$set(this.listData[i],'isWarning',true)
            }else{
              this.$set(this.listData[i],'isWarning',false)
            }
            this.$set(this.listData[i],'warningTips',msg)
          }

          if (hasError) {
            this.$nextTick(()=>{
              document.querySelector('.errTip') && document.querySelector('.errTip').scrollIntoViewIfNeeded();
            })
            return false;
          }

          return true;
        },



      // 保存编辑
        update(){

          this.basicListData();
          //校验
          if(!this.validateData()){
            return false
          }

          updateOutside(this.param)
            .then(res=>{
              if(res.code==0){
                this.$router.replace({path:'list'})
              }
            })
            .catch(err=>{
              dataBase.alert('提示','网络错误')
            })
        },

        // 返回列表
        backList(){
          this.$router.replace({path:'list'})
        }

      }
    }
</script>

<style scoped lang="scss">
@import "edit";
</style>
