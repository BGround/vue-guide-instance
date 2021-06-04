  <template>
<div class="qwui-addMark" ref="addMarkForm">
    <header class="addMark_head">
        <back-bar @goBack="goBack" :editText="editText"></back-bar>
    </header>
    <section class="addMark_content">
        <qw-input :EVENT_BUS="EVENT_BUS"
                  :objVal="formValue['markPO.name']"
                  :keyName="'markPO.name'"
                  :title="'考核名称'"
        ></qw-input>
        <qw-date-picker :EVENT_BUS="EVENT_BUS" :objVal="formValue.date"></qw-date-picker>
        <qw-radio :EVENT_BUS="EVENT_BUS" :objVal="+formValue['markPO.markType']" :radioObj="radioObj.markType"></qw-radio>
        <qw-choose-person
            :EVENT_BUS="EVENT_BUS"
            :objVal="formValue['personObj']"
            :keyName="'personObj'"
            :markType="+formValue['markPO.markType']">
            <span class="content_person_limit_tip">
                <span class="tip_novip">【团队版】最多可选25名评分对象。</span>
                <span class="tip_vip" @click="openVipView">【尊享版】可选5000名评分对象</span>
            </span>
            <label class="showAvatar">
                <input type="checkbox" v-model="formValue.viewAvatar">
                <span class="showAvatar_desc">使用"员工花名册"中的头像信息<i class="desc_tip">（勾选后应用端显示的考核头像为花名册员工头像）</i></span>
            </label>
            <label class="allow_check">
                <input type="checkbox" v-model="formValue.viewConfig">
                <span class="showAvatar_desc">允许考核对象查看考核结果<i class="desc_tip">（考核结束后考核对象可在应用端查看）</i></span>
            </label>
        </qw-choose-person>
        <qw-select :EVENT_BUS="EVENT_BUS"
                   :objVal="formValue['markSetting[0].templateId']"
                   :selectTemplate = "selectTemplate"
                   :keyName = "'markSetting[0].templateId'"
                   :title = "'考核模板'"
        ></qw-select>
        <qw-radio :EVENT_BUS="EVENT_BUS" :objVal="+formValue.markGroup" :radioObj="radioObj.markGroup"></qw-radio>
        <mark-person-list
            v-if="formValue.markGroup == 0"
            :EVENT_BUS="EVENT_BUS"
            :keyName="'defaultMarkGroup'"
            :objVal="copyDefaultMarkGroup"
            :leaveWeight="formValue.leaveWeight"
            :orderStatus="formValue['markPO.isOrder']"
            :disableSelfSel="selectTypeList"
        ></mark-person-list>
        <mark-group
            :EVENT_BUS="EVENT_BUS"
            v-else
            v-for="(item,index) in markGroupTemplate"
            :key="item.groupId"
            :markTemplate="item"
            :keyName="'markGroupList'"
            :keyIndex="index"
        ></mark-group>
        <!-- 考核结果查看对象 -->
        <div class="addMark_checkResult">
            <div class="title_box">
                <span class="title">查看对象</span>
                <p class="title_desc">考核结束后查看对象可在应用端查看考核结果</p>
            </div>
            <div class="allowCheck_checkBox">
                <div class="allow_grade mt10">
                    <input type="checkbox" v-model="formValue.isMarkPersonView">
                    <span class="allowCheck_desc">允许评分人查看考核结果</span>
                </div>
                <div class="allow_defined mt10">
                    <input type="checkbox" v-model="formValue.isPersonView" @change="showAuto">
                    <span class="allowCheck_desc">自定义查看对象</span>
                </div>
            </div>
            <!-- 自定义选人 -->
            <div class="choose_auto" v-if="showAutoChoose">
                <auto-choose
                :EVENT_BUS="EVENT_BUS"
                :objVal="formValue['definedPersonObj']"
                :keyName="'definedPersonObj'">
            </auto-choose>
            </div>
        </div>
      <qw-remind
       :title="'考核提醒'"
       :EVENT_BUS="EVENT_BUS"
       :objVal="formValue['remind']"
       :keyName="'remind'"
      ></qw-remind>
        <qw-textarea :EVENT_BUS="EVENT_BUS" :objVal="formValue['markPO.description']" :keyName="'markPO.description'"></qw-textarea>
    </section>
    <footer class="addMark_foot">
        <qwButton :color="'orange'" @click="handleSubmit">
            <span>保存</span>
        </qwButton>
    </footer>
</div>
 </template>

 <script>
import backBar from "../../../components/BackBar";
import qwInput from "../../../components/QWInput";
import qwRadio from "../../../components/QWRadio";
import { createEventBus } from "../../../utils";
import qwButton from "../../../components/QWButton";
import qwDatePicker from "../../../components/QWDatePicker";
import qwSelect from "../../../components/QWSelect";
import qwChoosePerson from "../../../components/QWChoosePerson";
import qwTextarea from "../../../components/QWTextarea";
import markPersonList from "./components/markPersonList";
import markGroup from "./components/markGroup";
import qwRemind from "../../../components/QWRemind";
import qwFunctionBox from "@/components/base/QwFunctionBox";
import autoChoose from "./components/autoChoosePerson";
export default {
  name: "addMark",
  components: {
    backBar,
    qwInput,
    qwRadio,
    qwButton,
    qwDatePicker,
    qwSelect,
    qwChoosePerson,
    qwTextarea,
    markPersonList,
    markGroup,
    qwRemind,
    qwFunctionBox,
    autoChoose
  },
  data() {
    return {
      dataBase,
      baseURL: _.baseURL,
      EVENT_BUS: createEventBus(),
      editText: "新建考核",
      //表单数据
      formValue: {
        //   自定义查看对象数据结构
        definedPersonObj: {
          "markSetting[0].viewUserIds": [],
          "markSetting[0].viewDeptIds": [],
          "markSetting[0].postId": {}
        },
        //考核的名字
        "markPO.name": "",
        //考核的日期，保存考核的起止日期
        date: [],
        //考核对象，0表示按职位评分，1表示按对象评分
        "markPO.markType": 1,
        //考核对象的数据结构
        personObj: {
          "markSetting[0].deptIds": [],
          "markSetting[0].targetIds": [],
          "markSetting[0].postId": {}
        },
        "markSetting[0].range": 3,
        //考核模板的id
        "markSetting[0].templateId": "",
        // 考核方式
        markGroup: 0,
        //默认的考核方式考核人列表
        defaultMarkGroup: [],
        //按指标组评分的考核人列表
        markGroupList: [],
        "markPO.description": "",
        //初始权重
        leaveWeight: 0,
        //考核提醒
        remind: {
          sendWhenStart: 1,
          sendBeforeEnd: 1,
          sendEndTime: 60
        },
        viewAvatar: false,
        viewConfig: true,
        isMarkPersonView: true,
        isPersonView: false,
        //考核模板的id
        "markPO.isOrder": 1,
      },
      //每一个组件的数组
      fields: [],
      //单选按钮的配置
      radioObj: {
        //考核对象单选按钮的json数据
        markType: {
          title: "考核对象",
          keyName: "markPO.markType",
          options: [
            {
              label: "按职位评分",
              value: 0
            },
            {
              label: "按对象评分",
              value: 1
            }
          ]
        },
        //考核方式单选按钮的json数据
        markGroup: {
          title: "考核方式",
          keyName: "markGroup",
          options: [
            {
              label: "默认",
              value: 0
            },
            {
              label: "按指标组评分",
              value: 1
            }
          ]
        }
      },
      //显示提示
      showTip: false,
      //按对象评分的考核模板
      objTemplate: [],
      //按职位评分的考核模板缓存
      postMapTemplate: new Map(),
      //考核模板数组
      selectTemplate: [],
      //按指标组评分的考核模板缓存
      markGroupMapTemplate: new Map(),
      //按指标组评分的考核模板
      markGroupTemplate: [],
      //复制新建考核模板时从返回报文中获取的考核方式为默认下的评分人列表
      copyDefaultMarkGroup: [],
      //整理过的表单数据，提交给后台的接口数据格式
      formData: {},
      //是否显示自定义选人
      showAutoChoose: false,
      // 限制自评-评分人考核方式类型
      selectTypeList: []
    };
  },
  created() {
    //保存每一个组件示例
    this.EVENT_BUS.$on("on-form-item-add", field => {
      if (field) this.fields.push(field);
      return false;
    });
    //监听组件的销毁事件
    this.EVENT_BUS.$on("on-form-item-remove", field => {
      if (field) this.fields.splice(this.fields.indexOf(field), 1);
      return false;
    });
    //修改表单数据
    this.EVENT_BUS.$on("on-set-form-data", payload => {
      // 判断是否操作 选择评分类型  考核对象本人/指定评分人 ，更新禁用状态
      if(payload.key.indexOf("flowInfoType") >= 0){
        let i = payload.key.split('.')[1] //获取当前行数
        this.formValue['defaultMarkGroup'][i].flowInfo.type = payload.value
        if(payload.value == '1'){
          this.selectTypeList.forEach((item,index)=>{
            this.selectTypeList.splice(index,1,true)
            this.selectTypeList.splice(i,1,false)
          })
        }else{
          this.selectTypeList.forEach((item,index)=>{
            this.selectTypeList.splice(index,1,false)
          })
        }
        let newPayload = {
          key: 'flowInfoType',
          value: { index: i, value: payload.value }
        }
        this.setFormData(newPayload);
      }else{
        this.setFormData(payload);
      }
    });
    // 修改无序评分
    this.EVENT_BUS.$on("on-change-order-status", status => {
      this.formValue["markPO.isOrder"] = status ? 1 : 0;
    });
    // 修改评分类型
    this.EVENT_BUS.$on("on-set-select-data", typeList => {
      this.selectTypeList = typeList.value
    });
    // 增加下一评分人
    this.EVENT_BUS.$on("on-add-person", value => {
      // 添加评分人
      if(value.length > this.copyDefaultMarkGroup.length){
        this.copyDefaultMarkGroup.push(value[value.length-1])
      }
    });
    // 权重更新
    this.EVENT_BUS.$on("on-set-input-data", value => {
      value.forEach((item,index)=>{
        this.copyDefaultMarkGroup[index].flowInfo.weight = item.flowInfo.weight
        item.personList.forEach((pItem,pIndex) => {
          this.copyDefaultMarkGroup[index].personList[pIndex].weight = pItem.weight
        })
      })
    });
    //监听单选按钮的切换事件
    this.EVENT_BUS.$on("on-radio-change", (keyName, value) => {
      //清空复制过来的数据
      this.copyDefaultMarkGroup = [];
      this.markGroupTemplate = [];
      if (keyName == "markPO.markType") {
        this.handlePostTemplate(value);
        // 重置考核对象
        this.formValue.personObj = {
          "markSetting[0].deptIds": [],
          "markSetting[0].targetIds": [],
          "markSetting[0].postId": {}
        };
        //为考核模板初始化默认值
        if (this.selectTemplate.length == 0) {
          this.formValue["markSetting[0].templateId"] = "";
        }
        //重置考核方式和考核人
        this.formValue["markGroup"] = 0;
        this.formValue.markGroupList = [];
        this.formValue.leaveWeight = 0;
        this.formValue.defaultMarkGroup = [];
      } else if (keyName == "markGroup") {
        if (this.formValue["markSetting[0].templateId"] == "") {
          var { top_alert } = this.dataBase;
          //提示
          top_alert("请先选择模板", false, 1000);
        }
        //切换考核方式，重置
        this.formValue.markGroupList = [];
        this.formValue.leaveWeight = 0;
        this.formValue.defaultMarkGroup = [];
        this.handleMarkGroupTemplate(value);
      }
    });
    //保存剩余的权重
    this.EVENT_BUS.$on("on-set-leave-weight", value => {
      this.formValue["leaveWeight"] = +value;
    });
    //选择职位时触发该事件，获取该职位所对应的考核模板
    this.EVENT_BUS.$on("on-choose-post", postId => {
      this.getPostTemplate(postId);
    });
    //默认加载对象模板，获取已建的对象考核模板列表
    this.getObjectTemplate();
    //复制评分考核，当路由的查询参数id不为空是执行获取已经考核的详细信息
    let markId = this.$route.query.id;
    if (markId != undefined) {
      this.copyMarkDetail(markId);
    }
    //改变侧边栏状态
    this.$store.commit('leftSide/active', '评分考核');
  },
  mounted(){
    // 默认 显示一条数据
    let markId = this.$route.query.id;
    if (markId == undefined) {
      this.copyDefaultMarkGroup.push({groupId:"",flowInfo:{type:"1",flowOrder: "",weight:""},personList:[]})
    }
  },
  methods: {
    setFormData(payload) {
      const { key, value } = payload;
      //更换考核模板，并且此时按指标组评分，重置考核方式为默认,重置剩余的权重和考核人列表
      if (
        key == "markSetting[0].templateId" &&
        this.formValue["markGroup"] == 1
      ) {
        this.formValue["markGroup"] = 0;
        this.formValue.markGroupList = [];
        this.formValue.leaveWeight = 0;
        this.formValue.defaultMarkGroup = [];
        //清空复制过来的数据
        this.copyDefaultMarkGroup = [];
        this.markGroupTemplate = [];
      }
      if (key == "markGroupList") {
        const keyIndex = payload.keyIndex;
        if (!this.formValue.markGroupList[keyIndex]) {
          this.formValue.markGroupList.push({});
        }
        this.formValue.markGroupList.splice(keyIndex, 1, value);
      } else{
        // 如果是指定评分人切换成考核对象本人，清空指定人员信息
        if (key == "flowInfoType") {
          let personLength = this.formValue['defaultMarkGroup'][value.index].personList.length
          if (value.value == 1) {
            this.formValue['defaultMarkGroup'][value.index].personList = []
            this.copyDefaultMarkGroup[value.index].personList = []
          }
          this.formValue['defaultMarkGroup'][value.index].flowInfo.type = value.value
          this.copyDefaultMarkGroup[value.index].flowInfo.type = value.value
          
        } else if(key == 'defaultMarkGroupadd'){
          this.formValue['defaultMarkGroup'] = value;
          value.forEach((item, index) => {
              this.copyDefaultMarkGroup[index].flowInfo.weight = value[index].flowInfo.weight
          })
        } else{
          this.formValue[key] = value;
        }
      }
      
    },
    //保存按钮的事件，处理每个控件的校验，但全部校验成功之后才提交表单
    handleSubmit() {
      //计算考核时间段
      if (this.formValue["remind"].sendBeforeEnd == 1) {
        if(this.formValue.date == '') return
        let time = Math.round(
          (this.formValue["date"][1].getTime() -
            this.formValue["date"][0].getTime()) /
            1000 /
            60
        );
        if (time <= this.formValue["remind"]["sendEndTime"]) {
          return dataBase.top_alert(
            "考核结束前的提醒时长不能大于考核时长",
            false,
            3000
          );
        }
      }
      let validatePass = true;
      this.fields.forEach((field, index) => {
        if (index == 1) {
          field.confirm().then(obj => {
            if (!obj.status) {
              validatePass = false;
            }
          });
        } else {
          field.validate().then(obj => {
            if (!obj.status) {
              validatePass = false;
            }
            //需要校验的通过之后提交表单
            if (index == this.fields.length - 1 && validatePass) {
              let { top_alert } = this.dataBase;
              dataBase.mask = true;
              dataBase.loading = true;
              //请求之前整理参数
              this.handleFormValue();
              let isEdit = this.$route.query.isEdit;
              let markId = this.$route.query.id;
              //编辑的保存接口
              if (isEdit) {
                //新增模板id参数
                this.$set(this.formData, "markPO.id", markId);
                this.$api.editMarkAjax(this.formData, result => {
                  dataBase.mask = false;
                  dataBase.loading = false;
                  if (result.code == "0") {
                    if (this.$route.query.id != "") {
                      top_alert("保存成功", true, 1000);
                    } else {
                      top_alert("新建成功", true, 1000);
                    }
                    window.location.href = `${
                      this.baseURL
                    }/manager/hrmanagement/hrmanagement_main.jsp?hrmark_wrap=0`;
                  } else if (result.code == "1022") {
                    top_alert(
                      "该职位没有员工，无法创建考核。请先到通讯录维护员工的职位字段",
                      false,
                      3000
                    );
                  } else {
                    top_alert(result.desc, false, 2000);
                  }
                });
              } else {
                //新增的保存接口
                this.$api.addMarkAjax(this.formData, result => {
                  dataBase.mask = false;
                  dataBase.loading = false;
                  if (result.code == "0") {
                    if (this.$route.query.id != "") {
                      top_alert("保存成功", true, 1000);
                    } else {
                      top_alert("新建成功", true, 1000);
                    }
                    window.location.href = `${
                      this.baseURL
                    }/manager/hrmanagement/hrmanagement_main.jsp?hrmark_wrap=0`;
                  } else if (result.code == "1022") {
                    top_alert(
                      "该职位没有员工，无法创建考核。请先到通讯录维护员工的职位字段",
                      false,
                      3000
                    );
                  } else {
                    top_alert(result.desc, false, 2000);
                  }
                });
              }
            }
          });
        }
      });
    },
    //处理表单数据
    handleFormValue() {
      this.formData["markSetting[0].range"] = 3;
      this.formData["markPO.name"] = this.formValue["markPO.name"];
      this.formData["markPO.startTime"] = this.formValue["date"][0].Format(
        "yyyy-MM-dd hh:mm:ss.S"
      );
      this.formData["markPO.endTime"] = this.formValue["date"][1].Format(
        "yyyy-MM-dd hh:mm:ss.S"
      );
      this.formData["markPO.markType"] = this.formValue["markPO.markType"];
      //复制时的部门id
      let deptId = this.handlePeopleId(
        this.formValue["personObj"]["markSetting[0].deptIds"],
        "deptId"
      );
      if (this.formValue["personObj"]["markSetting[0].deptIds"][0] && this.formValue["personObj"]["markSetting[0].deptIds"][0].deptId == undefined) {
        //新建时的部门id
        deptId = this.handlePeopleId(
          this.formValue["personObj"]["markSetting[0].deptIds"],
          "nodeId"
        );
      }
      this.formData["markSetting[0].deptIds"] = deptId;
      let userId = this.handlePeopleId(
        this.formValue["personObj"]["markSetting[0].targetIds"],
        "userId"
      );
      this.formData["markSetting[0].targetIds"] = userId;
      let postId = this.formValue["personObj"]["markSetting[0].postId"]["id"];
      this.formData["markSetting[0].postId"] = postId;
      this.formData["markSetting[0].templateId"] = this.formValue[
        "markSetting[0].templateId"
      ];

      //   自定义查看选人
      let viewUserId = this.handlePeopleId(
        this.formValue["definedPersonObj"]["markSetting[0].viewUserIds"],
        "userId"
      );
      let viewDeptId = this.handlePeopleId(
        this.formValue["definedPersonObj"]["markSetting[0].viewDeptIds"],
        "deptId"
      );
      if (this.formValue["definedPersonObj"]["markSetting[0].viewDeptIds"][0] && this.formValue["definedPersonObj"]["markSetting[0].viewDeptIds"][0].deptId == undefined) {
        //新建时的部门id
        viewDeptId = this.handlePeopleId(
          this.formValue["definedPersonObj"]["markSetting[0].viewDeptIds"],
          "nodeId"
        );
      }
      this.formData["markSetting[0].viewUserIds"] = viewUserId;
      this.formData["markSetting[0].viewDeptIds"] = viewDeptId;
      this.formData["markSetting[0].isMarkGroup"] = this.formValue["markGroup"];
      //按指标组评分的考核人列表
      if (this.formValue["markGroup"] == 1) {
        this.formValue["markGroupList"].forEach((item, index) => {
          this.formData[`markSetting[0].groupMarkList[${index}].flowInfo.flowOrder`] = index + 1;
          this.formData[`markSetting[0].groupMarkList[${index}].personList[0].groupId`] =
            item.markTemplateId;
          this.formData[`markSetting[0].groupMarkList[${index}].personList[0].userId`] =
            item.userId;
        });
      } else {
        this.formValue["defaultMarkGroup"].forEach((item, index) => {
          this.formData[`markSetting[0].groupMarkList[${index}].flowInfo.flowOrder`] =
            item.flowInfo.flowOrder;
          this.formData[`markSetting[0].groupMarkList[${index}].flowInfo.type`] =
            item.flowInfo.type;
          this.formData[`markSetting[0].groupMarkList[${index}].flowInfo.weight`] =
            item.flowInfo.weight;
          item.personList.forEach((pItem, pIndex) => {
            this.formData[`markSetting[0].groupMarkList[${index}].personList[${pIndex}].groupId`] =
              pItem.groupId;
            this.formData[`markSetting[0].groupMarkList[${index}].personList[${pIndex}].userId`] =
              pItem.userId;
            this.formData[`markSetting[0].groupMarkList[${index}].personList[${pIndex}].weight`] =
              pItem.weight;
          })
        });
        // this.formData["markPO.leaveWeight"] = this.formValue["leaveWeight"];

        // 无序评分
        this.formData["markPO.isOrder"] = this.formValue["markPO.isOrder"];
      }
      
      this.formData["markPO.description"] = this.formValue[
        "markPO.description"
      ];
      //应用端是否显示员工花名册 1是 2否
      this.formData["markPO.switchPic"] = this.formValue["viewAvatar"] ? 1 : 2;
      this.formData["markPO.viewConfig"] = this.formValue["viewConfig"] ? 1 : 2;
      this.formData["markPO.isMarkPersonView"] = this.formValue["isMarkPersonView"] ? 1 : 0;
      this.formData["markPO.isPersonView"] = this.formValue["isPersonView"] ? 1 : 0;
      // 考核提醒
      this.formData["markPO.sendWhenStart"] = this.formValue["remind"][
        "sendWhenStart"
      ];
      this.formData["markPO.sendBeforeEnd"] = this.formValue["remind"][
        "sendBeforeEnd"
      ];
      this.formData["markPO.sendEndTime"] = this.formValue["remind"][
        "sendEndTime"
      ];
    },
    //将选人id变为字符串
    handlePeopleId(array, id) {
      let idArray = [];
      array.forEach(item => {
        idArray.push(item[id]);
      });
      return idArray.join("|");
    },
    //获取对象模板
    getObjectTemplate() {
      this.$api.getObjectTemplate({}, data => {
        if (data.templateList && data.templateList.length > 0) {
          this.objTemplate.push(...data.templateList);
          this.selectTemplate.push(...data.templateList);
          this.formValue[
            "markSetting[0].templateId"
          ] = this.selectTemplate[0].id;
        } else {
          this.dataBase.top_alert(data, false, 1000);
        }
      });
    },
    //获取职位的考核模板
    getPostTemplate(postId) {
      this.selectTemplate = [];
      if (this.postMapTemplate.has(postId)) {
        if (this.postMapTemplate.get(postId).length > 0) {
          this.selectTemplate.push(...this.postMapTemplate.get(postId));
          this.formValue[
            "markSetting[0].templateId"
          ] = this.selectTemplate[0].id;
          //假如此时选择的考核方式为按指标组评分，获取该模板的指标组
          if (this.formValue["markGroup"] == 1) {
            this.handleMarkGroupTemplate(1);
          }
        } else {
          this.dataBase.top_alert(
            "当前职位没有模板,请先前往【考核模板】添加",
            false,
            3000
          );
        }
      } else {
        this.$api.getPostTemplate({ postIds: postId }, data => {
          if (data.template && data.template.length > 0) {
            this.selectTemplate.push(...data.template);
            if (this.formValue["markSetting[0].templateId"] === "") {
              this.formValue[
                "markSetting[0].templateId"
              ] = this.selectTemplate[0].id;
              this.postMapTemplate.set(postId, data.template);
            }
            //假如此时选择的考核方式为按指标组评分，获取该模板的指标组
            if (this.formValue["markGroup"] == 1) {
              this.markGroupTemplate.length === 0 &&
                this.handleMarkGroupTemplate(1);
            }
          } else {
            this.postMapTemplate.set(postId, []);
            this.dataBase.top_alert(
              "当前职位没有模板,请先前往【考核模板】添加",
              false,
              3000
            );
          }
        });
      }
    },
    //切换考核对象按钮，考核名称模板列表的处理
    handlePostTemplate(value) {
      this.selectTemplate = [];
      if (+value) {
        this.selectTemplate.push(...this.objTemplate);
        if (this.selectTemplate.length > 0)
          this.formValue[
            "markSetting[0].templateId"
          ] = this.selectTemplate[0].id;
      } else if (
        this.formValue["personObj"] &&
        this.formValue["personObj"]["markSetting[0].postId"] &&
        this.formValue["personObj"]["markSetting[0].postId"]["id"]
      ) {
        let postId = this.formValue["personObj"]["markSetting[0].postId"]["id"];
        if (this.postMapTemplate.get(postId).length > 0) {
          this.selectTemplate.push(...this.postMapTemplate.get(postId));
        } else {
          this.dataBase.top_alert(
            "当前职位没有模板,请先前往【考核模板】添加",
            false,
            3000
          );
        }
      }
    },
    //考核方式按指标组评分时的指标组模板的处理
    handleMarkGroupTemplate(value) {
      this.markGroupTemplate = [];
      if (+value && this.formValue["markSetting[0].templateId"]) {
        let markTemId = this.formValue["markSetting[0].templateId"];
        if (this.markGroupMapTemplate.has(markTemId)) {
          this.markGroupTemplate.push(
            ...this.markGroupMapTemplate.get(markTemId)
          );
        } else {
          this.$api.getMarkGroup({ templateId: markTemId }, data => {
            if (data.groupList && data.groupList.length > 0) {
              this.markGroupTemplate.push(...data.groupList);
              this.markGroupMapTemplate.set(markTemId, data.groupList);
            } else {
              this.dataBase.top_alert(data, false, 2000);
            }
          });
        }
      }
    },
    //打开vip页面
    openVipView() {
      window.open(
        _.baseURL + "/qiweipublicity/companysrv/vip/vip_gold_index.jsp",
        "newwindow"
      );
    },
    //复制考核模板
    copyMarkDetail(id) {
      this.copyDefaultMarkGroup = []
      this.$api.getMarkDetail({ id }, data => {
        let isEdit = this.$route.query.isEdit;
        if (isEdit) {
          this.editText = "编辑考核";
        }
        let { markVO, settingList } = data.addMarkVO;
        settingList = settingList[0];
        this.formValue["markPO.name"] = markVO.name;
        this.formValue["markPO.isOrder"] = markVO.isOrder;
        this.formValue["date"].push(new Date(markVO.startTime));
        this.formValue["date"].push(new Date(markVO.endTime));
        this.formValue["markPO.markType"] = markVO.markType;
        //评分对象为按对象评分
        if (markVO.markType == 1) {
          this.formValue.personObj["markSetting[0].deptIds"].push(
            ...settingList.deptList
          );
          this.formValue.personObj["markSetting[0].targetIds"].push(
            ...settingList.userList
          );
        } else {
          this.formValue.personObj["markSetting[0].postId"] = Object.assign(
            {},
            { id: settingList.postId, name: settingList.postName }
          );
          //同是获取该职位下的模板列表
          this.getPostTemplate(settingList.postId);
        }
        // 自定义查看对象
        this.formValue.definedPersonObj["markSetting[0].viewDeptIds"].push(
          ...settingList.viewDeptIdList
        );
        this.formValue.definedPersonObj["markSetting[0].viewUserIds"].push(
          ...settingList.viewUserIdList
        );
        this.formValue["markSetting[0].templateId"] = settingList.templateId;
        this.formValue["markGroup"] = settingList.isMarkGroup;
        //评分方式为按指标组评分
        if (settingList.isMarkGroup == 1) {
          this.markGroupTemplate.push(...settingList.groupMarkList);
        } else {
          this.formValue["leaveWeight"] = 100 - markVO.leaveWeight;
          this.copyDefaultMarkGroup.push(...settingList.groupMarkList);
        }
        this.formValue["markPO.description"] = markVO.description;
        this.formValue["viewAvatar"] = markVO.switchPic == 1 ? true : false;
        this.formValue["viewConfig"] = markVO.viewConfig == 1;
        this.formValue["isMarkPersonView"] = markVO.isMarkPersonView == 1 ? true : false;
        this.formValue["isPersonView"] = markVO.isPersonView == 1 ? true : false;
        if (this.formValue["isPersonView"]) {
          this.showAutoChoose = true;
        } else {
          this.showAutoChoose = false;
        }
        // 考核提醒
        this.formValue["remind"]["sendWhenStart"] = markVO.sendWhenStart;
        this.formValue["remind"]["sendBeforeEnd"] = markVO.sendBeforeEnd;
        this.formValue["remind"]["sendEndTime"] =
          markVO.sendEndTime == 0 ? 60 : markVO.sendEndTime;
      });
    },
    //返回按钮
    goBack() {
      window.location.href = `${
        this.baseURL
      }/manager/hrmanagement/hrmanagement_main.jsp?hrmark_wrap=0`;
    },
    showTipWrap() {
      this.showTip = true;
    },
    hideTipWrap() {
      this.showTip = false;
    },
    // 是否显示自定义选人
    showAuto() {
      if (this.formValue.isPersonView) {
        this.showAutoChoose = true;
      } else {
        this.showAutoChoose = false;
      }
    }
  }
};
</script>

 <style lang="scss" scope>
.qwui-addMark {
  font-size: 14px;
  .addMark_head {
    padding: 15px 0 9px 0;
    box-shadow: 0px 1px 0px 0px rgba(230, 230, 230, 1);
  }
  .addMark_content {
    padding: 32px 0 48px 0;
    box-shadow: 0px 1px 0px 0px rgba(230, 230, 230, 1);
    .content_person_limit_tip {
      display: block;
      line-height: 1;
      margin-top: 12px;
      .tip_novip {
        color: #999;
      }
      .tip_vip {
        color: #f78b00;
        cursor: pointer;
      }
    }
    .showAvatar,.allow_check {
      display: block;
      line-height: 1;
      margin-top: 20px;
      cursor: pointer;
      input {
        cursor: pointer;
        vertical-align: top;
      }
      .showAvatar_desc {
        margin-left: 8px;
      }
      .desc_tip {
        color: #a6a6a6;
      }
    }
    /deep/ .light-text{
      color: #a6a6a6;
    }
  }
  .allowCheck_checkBox {
    .allowCheck_desc {
      margin-left: 8px;
    }
  }
  .choose_auto {
    margin-top: 79px;
  }
  .addMark_foot {
    width: 74px;
    margin: 32px auto;
  }
  .addMark_checkResult {
    position: relative;
    margin-top: 20px;
    min-height: 100px;
    .title {
      float: left;
      display: inline-block;
      width: 122px;
      text-align: right;
      padding: 6px 20px 6px 0;
    }
    .title_desc {
      margin-left: 122px;
      line-height: 33px;
      color: #a6a6a6;
    }
  }
  .allowCheck_checkBox {
    position: absolute;
    top: 29px;
    left: 123px;
  }
  .qwui-function_wrap {
    display: flex;
    width: 100%;
    background: #fff;
    padding-left: 5px;
    line-height: 30px;
    justify-content: space-between;
    align-items: center;
    .qwui-function_flex {
      display: flex;
      align-items: center;
      position: relative;
      left: -35px;
      .qwui-function_tip {
        position: relative;
        display: inline-block;
        margin-left: 5px;
        width: 16px;
        height: 16px;
        background: url(~assets/images/icon_tip.png) no-repeat top left;
        cursor: pointer;
        .qwui-tip_wrap {
          background: white;
          border: 1px solid #ccc;
          border-radius: 5px;
          height: auto;
          left: 23px;
          padding: 10px;
          position: absolute;
          top: -10px;
          max-width: 278px;
          min-width: 305px;
          min-height: 20px;
          box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
          color: #666;
          z-index: 1223;
          text-align: left;
          cursor: text;
          &::before {
            border-color: transparent #ccc transparent transparent;
            border-style: solid;
            border-width: 8px;
            content: "";
            font-size: 20px;
            left: -16px;
            position: absolute;
            top: 9px;
          }
          &::after {
            background: white;
            content: "";
            height: 8px;
            left: -5px;
            position: absolute;
            top: 13px;
            transform: rotate(-45deg);
            width: 10px;
          }
        }
      }
    }
  }
}
</style>
