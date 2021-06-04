<template>
  <div>
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <div class="qwui-main_wrap">

      <!--主任务信息-->
      <qwForm :model="ruleForm" :rules="rules" label-width="140" width="440" ref="ruleForm">
        <qwFormItem prop="taskType" label="任务类型" style="margin-top: 14px;" key="taskType">
          <qwui-select v-model="ruleForm.taskType" @selectItem="selectItemType" :dataList="templateData"
                       :selectVal="selectValType"></qwui-select>
        </qwFormItem>
        <qwFormItem prop="dealerId" label="服务ERP号" key="dealerId">
          <qwui-person-count v-model="ruleForm.dealerId" class="qwui-principal_count"
                             :personCountShow="serErpCountShow"
                             :defaultUsers="serErpNos"
                             :showType="showType"
                             @listenAddPerson="addDealer" @deleteAll="postDealerAll"></qwui-person-count>
        </qwFormItem>
        <div v-show="showSubTask" key="postNamess">
          <qwFormItem prop="postName" label="责任岗位" key="postName">
            <qwui-person-count v-model="ruleForm.postName" class="qwui-principal_count" key="postNames"
                               :personCountShow="postCountShow"
                               :defaultUsers="postList"
                               :showType="showType"
                               @listenAddPerson="addPost" @deleteAll="postDeleteAll"
                               @selectUserList="selectPostUserList"></qwui-person-count>
          </qwFormItem>
          <!--<qwFormItem prop="title" label="任务标题">-->
          <!--<qwuiInput v-model="ruleForm.title"></qwuiInput>-->
          <!--</qwFormItem>-->
        </div>

        <qwFormItem label="责任岗位" v-if="showProject" key="postNames">
          <qwuiInput v-model="ruleForm.postName" disabled></qwuiInput>
        </qwFormItem>

        <qwFormItem  prop="taskNo" label="编号(任务单)" v-if="showProject" key="taskNo">
          <qwuiInput v-model="ruleForm.taskNo"></qwuiInput>
        </qwFormItem>

        <!--<qwFormItem prop="taskStop" label="任务截止时间" key="taskStop">-->
          <!--<VueDatepickerLocal-->
            <!--class="date-picker-width"-->
            <!--v-model="ruleForm.taskStop"-->
            <!--show-buttons-->
            <!--placeholder="选择时间"-->
            <!--format="YYYY-MM-DD HH:mm:ss"-->
            <!--:clearable="true"-->
            <!--@confirm="handleTaskConfirmDate($event)">-->
          <!--</VueDatepickerLocal>-->
          <!--&lt;!&ndash;  &ndash;&gt;-->
        <!--</qwFormItem>-->

        <div v-if="showSubTask">
          <qwFormItem label="任务描述">
            <textarea class="qwui-principal_count" v-model="ruleForm.content" rows="3" cols="46"></textarea>
          </qwFormItem>

        </div>
      </qwForm>

      <!--子任务-->
      <div v-if="showSubTask">
        <qwForm label-width="140">
          <qwFormItem label="子任务">
            <qwuiButton @click="addSubTask">添加</qwuiButton>
            <qwuiButton @click="removeSubTask">删除</qwuiButton>
          </qwFormItem>
        </qwForm>


        <div class="qwui-moudle_item" style="margin-left: 85px;padding-bottom:0px;"></div>

        <span v-for="(item,index) in subTaskList" :key="index">

        <br>
          <!--子任务-->
       <qwForm :model="item" :rules="subTaskRules" label-width="140" width="440" :ref="'ruleSubTaskForm'+index">
        <qwFormItem prop="title" label="子任务标题">
          <qwuiInput v-model="item.title"></qwuiInput>
        </qwFormItem>
         <qwFormItem label="子任务描述">
          <textarea class="qwui-principal_count" v-model="item.content" rows="3" cols="46"></textarea>
         </qwFormItem>
          <qwFormItem label="子任务附件">
           <!--<qwUploadImg @imageObj="coverImg($event,item)" :uploadConfig="uploadConfig">-->
            <!--&lt;!&ndash;<div class="c999" slot="upload_tip_text">建议尺寸940px*400px;支持jpg\jpeg\png;文件大小不能超过2M</div>&ndash;&gt;-->
            <!--</qwUploadImg>-->
            <QwUploadWrap
              :fileList="item.fileList"
              :limit="10"
              :beforeUpload="beforeUploadFile"
              :onSuccess="handleSuccessFile"
              :onRemove="handleRemoveFile">
            <qwuiButton class="mb5">上传</qwuiButton>
          </QwUploadWrap>
        </qwFormItem>
          <qwFormItem prop="stopTime" label="子任务截止时间">
            <VueDatepickerLocal
              class="date-picker-width"
              v-model="item.stopTime"
              show-buttons
              placeholder="选择时间"
              format="YYYY-MM-DD"
              :clearable="true"
              @confirm="handleConfirmDate($event,item)">
           </VueDatepickerLocal>
            <!--  -->
        </qwFormItem>
           </qwForm>
        <div class="qwui-moudle_item" style="margin-left: 85px;padding-bottom:0px;"></div>
       </span>
      </div>

      <!--整改项目-->
      <div v-if="showProject">
        <qwForm label-width="140">
          <qwFormItem label="整改项目">
            <qwuiButton @click="addProject">添加</qwuiButton>
            <qwuiButton @click="removeProject">删除</qwuiButton>
          </qwFormItem>
        </qwForm>

        <div class="qwui-moudle_item" style="margin-left: 85px;padding-bottom:0px;"></div>
        <!--整改项目-->
        <span v-for="(item,index) in projectList" :key="index">

        <br>
          <!--整改项目-->
          <qwForm :model="item" :rules="projectRules" label-width="140" width="440" :ref="'ruleProjectForm'+index">
        <qwFormItem prop="number" label="项目编号">
          <qwuiInput v-model="item.number"></qwuiInput>
        </qwFormItem>
         <qwFormItem prop="projectType" label="明检类型">
          <qwui-select v-model="item.projectType" @selectItem="selectOpenType" :dataList="openData"
                       :selectVal="item.selectValOpenType"></qwui-select>
         </qwFormItem>
           <qwFormItem prop="point" label="检查点位">
         <qwuiInput v-model="item.point"></qwuiInput>
         </qwFormItem>
           <qwFormItem prop="content" label="检查内容">
          <textarea class="qwui-principal_count" v-model="item.content" rows="3" cols="46"></textarea>
         </qwFormItem>
           <qwFormItem prop="score" label="标准分值">
         <qwuiInput v-model="item.score" inputType="sort" defaultVal="0"></qwuiInput>
         </qwFormItem>
           <qwFormItem prop="deduct" label="扣分">
          <qwuiInput v-model="item.deduct" inputType="sort" defaultVal="0" class="form-input"></qwuiInput>
         </qwFormItem>
           <qwFormItem prop="reason" label="不合格原因">
         <qwuiInput v-model="item.reason"></qwuiInput>
         </qwFormItem>
           <qwFormItem prop="requirement" label="改善要求">
         <qwuiInput v-model="item.requirement"></qwuiInput>
         </qwFormItem>
           <qwFormItem prop="requirementTime" label="要求改善时间">
            <VueDatepickerLocal
              class="date-picker-width"
              v-model="item.requirementTime"
              show-buttons
              placeholder="选择时间"
              format="YYYY-MM-DD"
              :clearable="true"
              @confirm="handleProjectConfirmDate($event,item)">
           </VueDatepickerLocal>
             <!--  -->
        </qwFormItem>
          </qwForm>
        <div class="qwui-moudle_item" style="margin-left: 85px;padding-bottom:0px;"></div>
       </span>
      </div>


      <div class="qwui-line"></div>
      <br>
      <div class="tcenter pb20">
        <qwuiButton v-if="taskPublish" @click="submitForm('ruleForm','save')" class="mr10">&nbsp;保存草稿&nbsp;</qwuiButton>
        <qwuiButton v-if="taskPublish" type="primary" @click="submitForm('ruleForm','saveTime')" class="mr10">&nbsp;发布&nbsp;</qwuiButton>
        <qwuiButton @click="cancelTime()" class="mr10">&nbsp;取消&nbsp;</qwuiButton>
      </div>


      <!--选经销商-->
      <pick-dealer :show="dealerPickShow"
                   :defaultUsers="serErpNos"
                   :functionTab="functionTab"
                   @chooseDone="chooseDealer"
                   @closeThis="closeThis"></pick-dealer>

      <!--选岗位-->
      <pick-post :show="postPickShow"
                 :defaultUsers="postList"
                 :functionTab="functionTab"
                 @chooseDone="choosePost"
                 @closeThis="closeThis"></pick-post>

    </div>


  </div>

</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
  import qwuiPersonCount from './qwuiPersonCount';
  import pickPerson from '@/components/pickPerson/pickPerson';
  import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import advancedSetPop from '@/components/Add/popUps/AdvancedSetPop';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox';
  import qwForm from '@/components/form/form';
  import qwFormItem from '@/components/form/formItem';
  import qwuiSelect from '@/components/qwuiBase/qwuiSelect/QwSelect';
  import pickDealer from '@/components/pickPerson/pickDealer';
  import pickPost from '@/components/pickPerson/pickPost';
  import qwFunctionBox from '@/components/base/QwFunctionBox';
  import VueDatepickerLocal from '@/components/base/VueDatepickerLocal';
  import qwUploadImg from '@/components/Add/uploadImg/QwUploadImg';
  import QwUploadWrap from '@/components/Add/Upload/QwUploadWrap';

  import {getTaskTemplate, addOrUpdTask, getTaskInfo} from '../../api/taskAssignment/getData';

  export default {
    data() {
      return {
        fileList: [],
        fileIds: [],
        taskPublish: true,
        taskId: '',
        openData: [{optionName: '常规明检', val: '常规明检'}, {optionName: '硬件明检', val: '硬件明检'}],
        showProject: false,
        showSubTask: false,
        uploadConfig: {
          uploadFileId: dataBase.agentCode + 'CoverImg',
          showType: 'small',
          isMoreImg: false,
          imageObj: {
            imageURL: '',
            fileName: '',
          },
        },
        previewImg: '',
        subTaskList: [{title: '', content: '', stopTime: '', fileList: []}],
        projectList: [{
          number: '',
          projectType: '',
          point: '',
          content: '',
          score: '',
          deduct: '',
          reason: '',
          requirement: '',
          requirementTime: ''
        }],
        postList: [],
        postCountShow: true,
        postPickShow: false,
        dealerPickShow: false,
        serErpCountShow: true,
        serErpNos: [],
        templateData: [],
        typeData: [],
        ruleForm: {
          title: '',
          type: '',
          taskType: '',
          dealerId: '',
          postName: '',
          content: '',
          taskStop: '',
          taskNo: '', //
        },
        isWarning: true,
        rules: {
          // title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
          // taskStop: [{required: true, message: '任务截止时间不能为空', trigger: 'blur'}],
          taskType: [{required: true, message: '任务类型不能为空', trigger: 'blur'}],
          dealerId: [{required: true, message: '服务ERP号不能为空', trigger: 'blur'}],
          postName: [{required: true, message: '责任岗位不能为空', trigger: 'blur'}],
          taskNo: [{required: true, message: '编号(任务单)不能为空', trigger: 'blur'}],
        },
        subTaskRules: {
          title: [{required: true, message: '子任务标题不能为空', trigger: 'blur'}],
          content: [{required: true, message: '子任务描述不能为空', trigger: 'blur'}],
          stopTime: [{required: true, message: '截止时间不能为空', trigger: 'blur'}],
        },

        projectRules: {
          number: [{required: true, message: '项目编号不能为空', trigger: 'blur'}],
          projectType: [{required: true, message: '明检类型不能为空', trigger: 'blur'}],
          point: [{required: true, message: '检查点位不能为空', trigger: 'blur'}],
          content: [{required: true, message: '检查内容不能为空', trigger: 'blur'}],
          score: [{required: true, message: '标准分值不能为空', trigger: 'blur'}],
          reason: [{required: true, message: '不合格原因不能为空', trigger: 'blur'}],
          requirement: [{required: true, message: '改善要求不能为空', trigger: 'blur'}],
          requirementTime: [{required: true, message: '要求改善时间不能为空', trigger: 'blur'}],
        },
        selectValType: {
          name: '',
          idx: 0
        },
        selectValOpenType: {
          name: '',
          idx: 0
        },
        // 基础设置输入框配置数据
        baseInputData: {
          name: {
            title: '任务类型',
            inputType: 'text',
            isWarning: false,
            warningTips: '任务类型不能为空',
            value: ''
          },
          name1: {
            title: '服务ERP号',
            inputType: 'text',
            isWarning: false,
            warningTips: '服务ERP号不能为空',
            value: ''
          },
          name2: {
            title: '责任岗位',
            inputType: 'text',
            isWarning: false,
            warningTips: '责任岗位不能为空',
            value: ''
          },
          name3: {
            title: '任务标题',
            inputType: 'text',
            isWarning: false,
            warningTips: '任务标题不能为空',
            value: ''
          },
          name4: {
            title: '任务描述',
            inputType: 'text',
            isWarning: false,
            warningTips: '任务描述不能为空',
            value: ''
          }
        },
        // 模板设置输入框配置数据
        templateInputData: {
          mainTitle: {
            title: '主任务标题模板：',
            inputType: 'custom',
            value: '',
            setPopData: {
              popShow: false,
              popTitle: '任务标题高级设置',
              titleName: '任务标题',
              titleHtml: '',
              labelData: [
                {
                  labelTitle: '可选任务字段',
                  labelList: [],
                  flex: 2
                },
                {
                  labelTitle: '日期时间',
                  labelList: [],
                  flex: 1
                }
              ],
            },
          },
          mainContent: {
            title: '主任务内容模板：',
            inputType: 'textarea',
            value: '',
            maxLength: 1024
          },
          subNum: {
            title: '子任务编号模板：',
            inputType: 'custom',
            value: '',
            setPopData: {
              popShow: false,
              popTitle: '子任务编号高级设置',
              titleName: '子任务编号',
              inputDesc: '例：“年月日”可生成“20180101”',
              titleHtml: '',
              labelData: [
                {
                  labelTitle: '日期时间',
                  labelList: [],
                  flex: 1
                }
              ],
            },
          },
          subTitle: {
            title: '子任务标题模板：',
            inputType: 'custom',
            value: '',
            setPopData: {
              popShow: false,
              popTitle: '子任务标题高级设置',
              titleName: '子任务标题',
              titleHtml: '',
              labelData: [
                {
                  labelTitle: '可选子任务字段',
                  labelList: [],
                  flex: 2
                },
                {
                  labelTitle: '日期时间',
                  labelList: [],
                  flex: 1
                }
              ],
            },
          },
          subContent: {
            title: '子任务内容模板：',
            inputType: 'textarea',
            value: '',
            maxLength: 1024
          }
        },
        // 是否子任务默认加载主任务标题
        isLoad: false,
        tempFormat: {},
        principalCountShow: true,
        principalUsers: [],
        principalPickShow: false,
        relativeCountShow: true,
        relativeUsers: [],
        relativePickShow: false,
        functionTab: [
          {text: '管理员'},
          {text: '批量导入'},
        ],
        showType: {
          person: false,
        },
        settingBtnData: {
          'sendInfo': {
            text: '任务结束时推送关闭通知到主任务负责人、子任务负责人、相关人',
            onOff: true
          },
          'disEnable': {
            text: '启用本任务',
            onOff: true
          }
        },
        goBackConfig: {
          hasLine: true,
          lastPath: '任务',
          currPath: '新增任务'
        },
      }
    },
    created() {
      this.getTaskTypeList();
      this.init();
    },

    methods: {
      postDeleteAll() {
        this.ruleForm.postName = '';
      },
      postDealerAll() {
        this.ruleForm.dealerId = '';
      },
      selectPostUserList(val) {
        var arr = [];
        if (val && val.length > 0) {
          val.forEach(item => {
            arr.push(item.personName);
          })
        }
        var postName = arr.join(",");
        this.ruleForm.postName = postName;
      },
      init() {
        this.taskId = this.$route.query.id;
        if (this.taskId) {
          getTaskInfo({taskId: this.taskId}, (res) => {
            //console.log(res) // "喷漆技师,钣金技师,质量管理员"
            let taskInfo = res.taskInfo;
            if (taskInfo.taskStatus != '0') {
              this.taskPublish = false;
            } else {
              this.taskPublish = true;
            }
            this.ruleForm = taskInfo;
            this.serErpNos = [{id: taskInfo.dealerId, personName: taskInfo.dealerName}]
            if (taskInfo.postName) {
              let postList = [];
              taskInfo.postName.split(",").forEach(item => {
                postList.push({personName: item});
              })
              this.postList = postList;
            }

            if (taskInfo.type === '0') {
              this.showSubTask = true;
              this.subTaskList = taskInfo.subTaskList;
            }
            if (taskInfo.type === '1') {
              this.ruleForm.postName = "服务总监,信息管理员";
              this.showProject = true;
              this.projectList = taskInfo.projectList;
            }
            //console.log(this.ruleForm.postName)
          })
        } else {

        }
      },
      // 获取任务类型管理列表数据
      getTaskTypeList() {
        let self = this;
        getTaskTemplate((res => {
          let list = [];
          res.template.forEach(item => {
            list.push({optionName: item.name, val: item.name});
          })
          //console.log(list)
          self.templateData = list;
        }));
      },
      // 点击添加 服务ERP号(经销商)
      addDealer() {
        this.dealerPickShow = true;
      },
      // 点击确认 服务ERP号(经销商)
      chooseDealer(val) {
        this.serErpNos = [];
        if (val.id) {
          this.dealerPickShow = false;
          this.serErpNos.push({show: true, id: val.id, personName: val.dealerFullName})
        } else {
          this.$notify.error({
            title: '系统提示',
            message: '请选择一个经销商！'
          });
          return;
        }
        this.ruleForm.dealerId = val.id;
        this.ruleForm.dealerName = val.dealerFullName;
      },
      // 点击关闭
      closeThis() {
        this.dealerPickShow = false;
        this.postPickShow = false;
      },
      // 点击添加 岗位
      addPost() {
        this.postPickShow = true;
      },
      // 点击确认岗位
      choosePost(val) {
        //console.log(val)
        let list = [];
        if (val && val.length > 0) {
          val.forEach(item => {
            list.push({show: true, personName: item});
          })
          this.postList = list;
          this.ruleForm.postName = val.join(",");
        }
        this.postPickShow = false;
      },
      // 点击添加子任务
      addSubTask() {
        this.subTaskList.push({name: '', fileList: []});
      },
      // 点击删除最后一个子任务
      removeSubTask() {
        let length = this.subTaskList.length;
        if (length > 1) this.subTaskList.splice(length - 1, 1);
      },
      // 点击添加整改项目
      addProject() {
        this.projectList.push({name: ''});
      },
      // 点击删除最后一个整改项目
      removeProject() {
        let length = this.projectList.length;
        if (length > 1) this.projectList.splice(length - 1, 1);
      },
      // 确认主任务截止时间
      handleTaskConfirmDate(val) {
        let date = new Date(val).Format('yyyy-MM-dd hh:mm:ss');
        this.$set(this.ruleForm, 'taskStop', date);
        console.log(this.ruleForm)
      },
      // 确认子任务截止时间
      handleConfirmDate(val, item) {
        this.$set(item, 'stopTime', val);
      },
      // 确认整改项目要求时间
      handleProjectConfirmDate(val, item) {
        this.$set(item, 'requirementTime', val);
      },
      // 上传子任务附件图片
      coverImg(obj, item) {
        this.uploadImgObj = obj;
        this.previewImg = this.uploadImgObj.imageURL
          ? _.compressURL + this.uploadImgObj.imageURL
          : require('assets/images/icon_default_cover_img.png');
        console.log(this.previewImg)
        this.$set(item, 'subTaskImg', this.uploadImgObj.imageURL);
      },
      titleInput() {
      },
      // 选中任务类型
      selectItemType(optionName, val) {
        this.ruleForm.taskType = val;
        this.selectValType.name = optionName;
        this.selectValType.idx = val;
        if ('明检任务' === optionName) {
          this.subTaskList = [{title: '', content: '', stopTime: ''}];
          this.ruleForm.type = '1';
          this.showProject = true;
          this.showSubTask = false;
          this.ruleForm.personName = "明检任务";
          this.ruleForm.title = "明检任务";
          this.ruleForm.postName = "服务总监,信息管理员";
          this.postList = [];
          this.serErpNos = [];
          this.ruleForm.dealerId = '';
          this.ruleForm.content = '';
        } else {
          this.projectList = [{
            number: '',
            projectType: '',
            point: '',
            content: '',
            score: '',
            deduct: '',
            reason: '',
            requirement: '',
            requirementTime: ''
          }];
          this.ruleForm.type = '0';
          this.showSubTask = true;
          this.showProject = false;
          this.ruleForm.personName = "";
          this.ruleForm.title = "";
          this.ruleForm.postName = '';
          this.postList = [];
          this.serErpNos = [];
          this.ruleForm.dealerId = '';
          this.ruleForm.content = '';
        }
      },
      selectOpenType(optionName, val) {
        this.selectValOpenType.name = optionName;
        this.selectValOpenType.idx = val;
      },

      cancelTime() {
        this.$router.go(-1);
      },

      //提交验证(包括保存草稿和发布)
      submitForm(formName, type) {
          debugger
        let self = this;
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // var taskStop = new Date(this.ruleForm.taskStop.replace(/-/g, "/"));
            var stopFalg = false; // 任务截止时间 一定要大于子任务截止时间
            var falg = true;
            var requirementFalg=false;

            // 其他任务
            if (this.ruleForm.type === '0') {
              self.subTaskList.forEach((item, index) => {
                var refsName = 'ruleSubTaskForm' + index;
                self.$refs[refsName][0].validate((valid) => {
                  if (!valid) {
                    falg = valid
                  }
                })
                if(item.stopTime.getTime() < today.getTime()){
                    stopFalg = true;
                }
              })
            }
            // 明检任务
            if (this.ruleForm.type === '1') {
              self.projectList.forEach((item, index) => {
                var refsName = 'ruleProjectForm' + index;
                self.$refs[refsName][0].validate((valid) => {
                  if (!valid) {
                    falg = valid
                  }
                })
                if(item.requirementTime.getTime() < today.getTime()){
                    requirementFalg = true;
                }
              })
            }
            if(stopFalg){
              dataBase.top_alert('截止时间不可小于当前时间', false, 3000);
              return;
            }
            if(requirementFalg){
              dataBase.top_alert('要求改善时间不可小于当前时间', false, 3000);
              return;
            }
            if (falg) {
              if (this.ruleForm.type === '0') {
                self.subTaskList.forEach((item, index) => {
                  item.stopTime = item.stopTime.Format('yyyy-MM-dd')
                })
              }
              if (this.ruleForm.type === '1') { // 明检任务
                self.projectList.forEach((item, index) => {
                  item.requirementTime = item.requirementTime.Format('yyyy-MM-dd')
                })
              }
              this.doAddOrUpdTask(type);
            }
          }

        });
      },

      doAddOrUpdTask(type) {
        let params = {
          // 'task.title':this.ruleForm.title,
          'task.type': this.ruleForm.type,
          'task.taskType': this.ruleForm.taskType,
          'task.dealerId': this.ruleForm.dealerId,
          'task.dealerName': this.ruleForm.dealerName,
          'task.postName': this.ruleForm.postName,
          'task.content': this.ruleForm.content,
          // 'task.taskStop': this.ruleForm.taskStop,
        };// JSON.stringify(json);
        if(this.ruleForm.type === '1'){ // 明检任务
            params['task.taskNo'] = this.ruleForm.taskNo;
        }
        params['task.taskStatus'] = '0';
        let msg = '新增成功';
        if (this.taskId) {
          msg = '编辑成功';
          params['task.taskId'] = this.taskId;
        }
        if (type === 'saveTime') {
          msg = '发布成功';
          params['task.taskStatus'] = '1';
        }
        if (this.ruleForm.type == '0' && this.subTaskList && this.subTaskList.length > 0) {
          this.subTaskList.forEach(value => {
            let ids = [];
            if (value.fileList && value.fileList.length > 0) {
              value.fileList.forEach((file) => {
                ids.push(file.id);
              });
            }
            value.imgList = ids;
          })
        }
        params.subTasks = JSON.stringify(this.subTaskList);
        params.projects = JSON.stringify(this.projectList);
        addOrUpdTask(params, () => {
          dataBase.top_alert(msg, true, 3000);
          this.$router.go(-1);
        });
      },
      getFileIds() {
        let ids = [];
        this.fileList.forEach((file) => {
          ids.push(file.id);
        });
        this.fileIds = ids;
      },
      //处理上传附件删除
      handleRemoveFile(file, fileList) {
        this.getFileIds();
      },
      //处理上传附件成功
      handleSuccessFile(file) {
        this.getFileIds();
      },
      //上传附件前处理
      beforeUploadFile(file) {
        let size = file.size;
        let fileName = file.name;
        let isExt = fileName.lastIndexOf(".");
        let fileExt = fileName.substr(isExt).toLowerCase();//获得文件后缀名
        if (!(".doc.docx.xls.xlsx.ppt.pptx.pdf.zip.jpg.png.jpeg".includes(fileExt))) {
          dataBase.top_alert('.doc.docx.xls.xlsx.ppt.pptx.pdf.zip.jpg.png.jpeg；如需上传其它格式文件请先将其压缩后再上传', false, 3000);
          return false;
        }
        if (size > 10 * 1024000) {
          dataBase.top_alert('附件大小不能超过10M', false, 3000);
          return false;
        }
        return true;
      },
      isDateCompare(beginDate, endDate) {
        var beginArrayDate = beginDate.split('-');
        var endArrayDate = endDate.split('-')
        if (parseInt(endArrayDate[0], 10) > parseInt(beginArrayDate[0], 10)) return true;
        if (parseInt(endArrayDate[0], 10) == parseInt(beginArrayDate[0], 10)) {
          if (parseInt(endArrayDate[1], 10) > parseInt(beginArrayDate[1], 10)) return true;
          else {

            if (parseInt(endArrayDate[1], 10) == parseInt(beginArrayDate[1], 10)) {
              if (parseInt(endArrayDate[2], 10) >= parseInt(beginArrayDate[2], 10)) return true;
            }
          }
        }
        return false;
  },
    },
    components: {
      qwuiGoBack,
      qwuiInput,
      qwuiPersonCount,
      pickPerson,
      qwuiSwitch,
      qwuiButton,
      advancedSetPop,
      qwuiCheckbox,
      qwForm,
      qwFormItem,
      qwuiSelect,
      pickDealer,
      pickPost,
      qwFunctionBox,
      VueDatepickerLocal,
      qwUploadImg,
      QwUploadWrap,
    }
  }

</script>

<style src="../../scss/task/task.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
  .qwui-setting_title {
    height: 47px;
    line-height: 47px;
    margin-top: 15px;
    margin-bottom: 20px;
    padding-left: 20px;
    font-weight: 700;
    font-size: 16px;
    background-color: #F5F5F5;
    border-left: 4px solid #F87B00;
    color: #666666;
  }

  .qwui-moudle_item {
    padding-bottom: 30px;
    border-bottom: 1px solid #E5E5E5;
  }

  .qwui_moudle_itle {
    margin: 30px 0;
    font-size: 16px;
    font-weight: bold;
    color: #383838;
  }

  .qwui-input_item {
    margin-bottom: 10px;
    .functionDesc {
      margin-top: 5px;
      color: #999;
    }
    .itemTitle {
      margin-bottom: 5px;
      padding-top: 5px;
      width: 130px;
      display: inline-block;
      text-align: right;
    }
    .star {
      margin-right: 5px;
      color: red;
    }
  }

  .qwui-add_person {
    margin-top: 5px;
    margin-bottom: 10px;

    .personTitle {
      display: inline-block;
      width: 130px;
      text-align: right;
    }

    .qwui-principal_count {
      display: inline-block;
      margin-top: -5px;
      width: 600px;
      vertical-align: text-top;
    }
  }

  .qwui-setting_item {
    position: relative;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    margin: 0 250px 10px 130px;
    overflow: hidden;
    padding-left: 5px;
  }

  .qwui-switch_btn {
    position: absolute;
    right: 0;
    top: 7px;
  }

  .qwui-save_btn {
    padding-top: 20px;
    padding-bottom: 30px;
    text-align: center;
  }

  .customInput {
    display: inline-block;
    vertical-align: top;

    .titleInput {
      height: auto;
      min-height: 19px;
      padding: 6px;
      width: 325px;
      margin-bottom: 8px;
      border-radius: 2px;
      border: 1px solid #ccc;
      background: #fff;
      outline: none;
      overflow: auto;
    }

    p {
      line-height: 28px;
      color: #f87b00;
      cursor: pointer;
    }
  }

  .qwui-input_style {
    vertical-align: top;

    & /deep/ {
      .textarea_wrap .qw_textarea, .input_wrap .qw_sortInput {
        width: 340px;
      }
    }
  }

  .qwui-title_type {
    margin: 30px 0 0 132px;

    .funcTitle {
      margin-bottom: 5px;
    }

    .funcDesc {
      vertical-align: bottom;
      color: #808080;
    }
  }

  .class_deduct {
    .input_wrap input {
      width: 340px;

    }
  }
</style>
