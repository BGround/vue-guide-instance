<template>
  <div class="qwui-addExam">

    <!--头部返回按钮-->
    <div class="addExam_backBar">
      <div class="backBar_wrap">
        <div class="backBar_icon" @click="goBack"></div>
        新建内部考试
      </div>
    </div>

    <!--表单内容-->
    <div class="addExam_section">
      <!--名称-->
      <qw-input
        :objConfig="formData.properties.name"
        :objVal="formData.value.name"
        :objKey="['name']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-input>
      <!--所用试卷-->
      <qw-choosae-paper
        :objConfig="formData.properties.paperId"
        :objVal="formData.value.paperId"
        :objKey="['paperId']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-choosae-paper>
      <!--允许通过手机相册上传图片-->
      <transition name="transition-drop">
        <qw-checkbox
          v-if="formData.value.paperId.paperAllowPic"
          :objConfig="formData.properties.uploadImg"
          :objVal="formData.value.uploadImg"
          :objKey="['uploadImg']"
          :EVENT_BUS="EVENT_BUS"
        >
          <span class="qwui-input_description">（不勾选则只允许拍照上传）</span>
        </qw-checkbox>
      </transition>
      <!--考试说明-->
      <qw-textarea
        :objConfig="formData.properties.examExplain"
        :objVal="formData.value.examExplain"
        :objKeyText="['examExplain', 'text']"
        :objKeyPhoto="['examExplain', 'photo']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-textarea>
      <!--分割线-->
      <div class="qwui_divideLine"></div>
      <!--考试时间-->
      <qw-checkbox
        :objConfig="formData.properties.limitDate"
        :objVal="formData.value.limitDate"
        :objKey="['limitDate']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-checkbox>
      <!--考试时间的日历组件-->
      <transition name="transition-drop">
        <qw-choose-date
          v-if="formData.value.limitDate"
          :objConfig="formData.properties.exmaDate"
          :objVal="formData.value.exmaDate"
          :objKey="['exmaDate']"
          :EVENT_BUS="EVENT_BUS"
          ></qw-choose-date>
      </transition>
      <!--考试限时-->
      <qw-input
        :objConfig="formData.properties.examTime"
        :objVal="formData.value.examTime"
        :objKey="['examTime']"
        :EVENT_BUS="EVENT_BUS"
      >
        <div class="qwui-input_tailWrap">
          <span class="qwui-input_unit">分钟</span>
          <span class="qwui-input_description">（限制考试时间多少分钟，超时后系统将自动交卷；0表示不限制）</span>
        </div>
      </qw-input>
      <!--考试次数-->
      <qw-input
        :objConfig="formData.properties.partTime"
        :objVal="formData.value.partTime"
        :objKey="['partTime']"
        :EVENT_BUS="EVENT_BUS"
      >
        <div class="qwui-input_tailWrap">
          <span class="qwui-input_unit">次</span>
          <span class="qwui-input_description">（即最多可参与考试多少次，0表示不限制）</span>
        </div>
      </qw-input>
      <!--通过分数-->
      <qw-input
        :objConfig="formData.properties.passScore"
        :objVal="formData.value.passScore"
        :objKey="['passScore']"
        :EVENT_BUS="EVENT_BUS"
      >
        <div class="qwui-input_tailWrap">
          <span class="qwui-input_unit">分</span>
          <span class="qwui-input_description">（考试分数达到多少算通过，0表示不限制）</span>
        </div>
      </qw-input>
      <!--题目乱序-->
      <qw-checkbox
        :objConfig="formData.properties.orderless"
        :objVal="formData.value.orderless"
        :objKey="['orderless']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-checkbox>
      <!--题型内乱序-->
      <transition name="transition-drop">
        <qw-checkbox
          v-if="formData.value.orderless"
          :objConfig="formData.properties.innerOrderless"
          :objVal="formData.value.innerOrderless"
          :objKey="['innerOrderless']"
          :EVENT_BUS="EVENT_BUS"
        >
          <span class="qwui-input_description">（勾选后只乱序题型内的试题）</span>
        </qw-checkbox>
      </transition>
      <!--分割线-->
      <div class="qwui_divideLine" v-if="formData.value.paperId.method == '1'"></div>
      <!--随机考试-->
      <transition name="transition-drop">
        <qw-random-exam
          v-if="formData.value.paperId.method == '1'"
          :objConfig="formData.properties.randomExam"
          :objVal="formData.value.randomExam"
          :objKey="['randomExam']"
          :EVENT_BUS="EVENT_BUS"
        ></qw-random-exam>
      </transition>
      <!--分割线-->
      <div class="qwui_divideLine"></div>
      <!--是否可以补考-->
      <qw-checkbox
        :objConfig="formData.properties.examAgain"
        :objVal="formData.value.examAgain"
        :objKey="['examAgain']"
        :EVENT_BUS="EVENT_BUS"
      >
        <span class="qwui-input_description">
          （该功能仅限尊享版使用，
          <span class="description_orangeColor cursorPointer" @click="$goBuyVip">
             马上升级>
          </span>
          ）
        </span>
      </qw-checkbox>
      <!--补考次数-->
      <transition-group name="transition-drop">
        <qw-input
          v-if="formData.value.examAgain"
          :objConfig="formData.properties.partAaginTime"
          :objVal="formData.value.partAaginTime"
          :objKey="['partAaginTime']"
          :EVENT_BUS="EVENT_BUS"
          :key="1"
        >
          <div class="qwui-input_tailWrap">
            <span class="qwui-input_unit">次</span>
            <span class="qwui-input_description">（0表示不限制）</span>
          </div>
        </qw-input>
      <!--补考时间的日历组件-->
        <qw-choose-date
          v-if="formData.value.examAgain"
          :startTime = formData.value.exmaDate[1]
          :objConfig="formData.properties.exmaAgainDate"
          :objVal="formData.value.exmaAgainDate"
          :objKey="['exmaAgainDate']"
          :EVENT_BUS="EVENT_BUS"
          :key="2"
        ></qw-choose-date>
      </transition-group>
      <!--分割线-->
      <div class="qwui_divideLine"></div>
      <!--学分-->
      <qw-checkbox
        :objConfig="formData.properties.examCredit"
        :objVal="formData.value.examCredit"
        :objKey="['examCredit']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-checkbox>
      <!--学分获取方式单选单选按钮-->
      <transition name="transition-drop">
        <qwRadio
          v-if="formData.value.examCredit"
          :objConfig="formData.properties.examCreditType"
          :objVal="formData.value.examCreditType.type"
          :objParent="formData.value.examCreditType"
          :objKey="['examCreditType', 'type']"
          :max="formData.value.paperId.totalScore"
          :EVENT_BUS="EVENT_BUS"
        ></qwRadio>
      </transition>
      <!--分割线-->
      <div class="qwui_divideLine"></div>
      <!--可见性设置-->
      <div class="qwui-form_item qwui-form_item_hasLabel">
        <label class="qwui-form_item_label">可见性设置</label>
        <div class="qwui-form_item_content content_greyColor">
          设置交卷后、考试结束后，考生是否可查看分数、答题对错、答案及解析
        </div>
      </div>
      <!--交卷后-->
      <div class="section_mutiChoose">
        <span slot="description" class="qwui-checkbox_description">
          交卷后
        </span>
        <qw-check-group
          :key="index"
          v-for="(item, index) in formData.properties.examFinish.options"
          :objConfig="item"
          :objValArry="formData.value.examFinish"
          :objVal="formData.value.examFinish[index]"
          :objKey="['examFinish', index]"
          :EVENT_BUS="EVENT_BUS"
         ></qw-check-group>
      </div>
      <!--考试结束后-->
      <div class="section_mutiChoose mutiChoose_marginTop">
        <span slot="description" class="qwui-checkbox_description">
          考试结束后
        </span>
        <qw-check-group
          :key="index"
          v-for="(item, index) in formData.properties.examEnd.options"
          :objConfig="item"
          :objValArry="formData.value.examEnd"
          :objVal="formData.value.examEnd[index]"
          :objKey="['examEnd', index]"
          :EVENT_BUS="EVENT_BUS"
        ></qw-check-group>
      </div>
      <!--分割线-->
      <div class="qwui_divideLine"></div>
      <!--考试对象-->
      <qw-choose-people
        :objConfig="formData.properties.examPeople"
        :objVal="formData.value.examPeople"
        :objKey="['examPeople']"
        :examPeopleObj="formData.value.examPeopleObj"
        :EVENT_BUS="EVENT_BUS"
      ></qw-choose-people>
      <!--分割线-->
      <div class="qwui_divideLine"></div>
      <!--设备限制
      <div class="qwui-form_item_hasLabel">
        <label class="qwui-form_item_label">
          设备限制
          <span class="label_description"
                @mouseover="showDeviceControlTip = true"
                @mouseleave="showDeviceControlTip = false"
          >?</span>
          <div class="label_tip tip_deviceControl"
               v-show="showDeviceControlTip"
               @mouseover="showDeviceControlTip = true"
               @mouseleave="showDeviceControlTip = false"
          >
            <div class="tip_content">
              [考试评测] 已整合升级为 [培训考试]，该功能只作用于[培训考试]应用<br>
              • 勾选后请确保学员在「培训考试」应用进入<br>
              • 不勾选则默认以下三个考试端都可进入答题：<br>
              <div class="ml10">
              1. PC端：指微信和企业微信的Windows端与Mac端版本，不含个人网页版<br>
              2. 应用端：指微信和企业微信的iOS版与Android版<br>
              3. 个人网页版：即企微云个人网页版，地址：https://qy.do1.com.cn/web
              </div>
            </div>
          </div>
        </label>
        <div class="qwui-form_item_content content_greyColor">
          考试设备访问限制，可防止考生通过多端登录的方式作弊、泄题
          <span class="qwui-vipIcon function" @click="$goBuyVip"></span>
        </div>
      </div>
      <qw-device-control
        :objConfig="formData.properties.deviceControl"
        :objVal="formData.value.deviceControl"
        :objKey="['deviceControl']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-device-control>
      -->
      <!--防作弊设置-->
      <div class="qwui-form_item qwui-form_item_hasLabel">
        <label class="qwui-form_item_label">
          防作弊设置
        </label>
        <div class="qwui-form_item_content content_greyColor">
          暂仅作用于个人网页版答题，可防止考生切换页面、缩小窗口、复制粘贴剪切
          <span class="qwui-vipIcon function" @click="$goBuyVip"></span>
        </div>
      </div>
      <!--切换页面超过多少次强制交卷-->
      <qw-check-input
        :objConfig="formData.properties.changePage"
        :objVal="formData.value.changePage.isOpen"
        :objDeviceControl="formData.value.deviceControl"
        :objKey="['changePage', 'isOpen']"
        :objInputVal="formData.value.changePage.time"
        :objInputKey="['changePage', 'time']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-check-input>
      <!--只允许考生页面窗口最大化-->
      <qw-check-input
        :objConfig="formData.properties.winMaxsize"
        :objVal="formData.value.winMaxsize.isOpen"
        :objDeviceControl="formData.value.deviceControl"
        :objKey="['winMaxsize', 'isOpen']"
        :objInputVal="formData.value.winMaxsize.time"
        :objInputKey="['winMaxsize', 'time']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-check-input>
      <!--禁止考生复制、粘贴、剪切-->
      <qw-checkbox
        :objConfig="formData.properties.banCopy"
        :objVal="formData.value.banCopy"
        :objKey="['banCopy']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-checkbox>
      <!--分割线-->
      <div class="qwui_divideLine"></div>
      <!--考试提醒-->
      <qw-checkbox
        :objConfig="formData.properties.examRemind"
        :objVal="formData.value.examRemind"
        :objKey="['examRemind']"
        :EVENT_BUS="EVENT_BUS"
      ></qw-checkbox>
      <!--开启考试提醒-->
      <transition name="transition-drop">
        <qw-checkbox
          v-if="formData.value.limitDate"
          :objConfig="formData.properties.openExamRemind"
          :objVal="formData.value.openExamRemind"
          :objKey="['openExamRemind']"
          :EVENT_BUS="EVENT_BUS"
        >
          <span class="qwui-input_description">
            （设置了考试时间才生效）
          </span>
        </qw-checkbox>
      </transition>
      <!--考试前提醒-->
      <transition name="transition-drop">
        <qw-input
          v-if="formData.value.openExamRemind && formData.value.limitDate"
          :objConfig="formData.properties.examStartRemind"
          :objVal="formData.value.examStartRemind"
          :objKey="['examStartRemind']"
          :EVENT_BUS="EVENT_BUS"
        >
          <div class="qwui-input_tailWrap" slot="description">
            <span class="qwui-input_head">考试开始前</span>
          </div>
          <div class="qwui-input_tailWrap">
            <span class="qwui-input_unit">分钟提醒</span>
          </div>
        </qw-input>
      </transition>
      <!--考试结束提醒-->
      <transition name="transition-drop">
        <qw-input
          v-if="formData.value.openExamRemind && formData.value.limitDate"
          :objConfig="formData.properties.examEndRemind"
          :objVal="formData.value.examEndRemind"
          :objKey="['examEndRemind']"
          :EVENT_BUS="EVENT_BUS"
        >
          <div class="qwui-input_tailWrap" slot="description">
            <span class="qwui-input_head">考试结束前</span>
          </div>
          <div class="qwui-input_tailWrap">
            <span class="qwui-input_unit">分钟提醒</span>
            <span class="qwui-input_description">（仅未参加考试的人员）</span>
          </div>
        </qw-input>
      </transition>
      <!--考试开始时提醒-->
      <transition name="transition-drop">
        <qw-checkbox
          v-if="formData.value.limitDate"
          :objConfig="formData.properties.publishNotice"
          :objVal="formData.value.publishNotice"
          :objKey="['publishNotice']"
          :EVENT_BUS="EVENT_BUS"
        ></qw-checkbox>
      </transition>
      <!--分割线-->
      <div class="qwui_divideLine" v-if="formData.value.paperId.markingPerson"></div>
      <!--当选择的试卷有阅卷人才有阅卷提醒-->
      <!--阅卷提醒-->
      <transition name="transition-drop">
        <qw-checkbox
          v-if="formData.value.paperId.markingPerson"
          :objConfig="formData.properties.readRemind"
          :objVal="formData.value.readRemind"
          :objKey="['readRemind']"
          :EVENT_BUS="EVENT_BUS"
        >
          <span slot="popTarget" class="label_description"
                @mouseover="showReadRemindTip = true"
                @mouseleave="showReadRemindTip = false"
          >?</span>
          <div slot="popDescribe" class="label_tip tip_ReadRemindMinWidth"
               v-show="showReadRemindTip"
               @mouseover="showReadRemindTip = true"
               @mouseleave="showReadRemindTip = false"
          >
            <div class="tip_content">
              <span class="tip_content_title">• 按考试场次提醒：</span><br>
              <span class="tip_content_detail">考试时间结束后，阅卷人统一收到考试的阅卷提醒（仅收到一次消息通知）</span><br>
              <span class="tip_content_title">• 按阅卷份数定时汇总提醒：</span><br>
              <span class="tip_content_detail">1. 每位考生提交试卷后，阅卷人将相隔5分钟收到汇总提醒</span><br>
              <span class="tip_content_detail">2. 只有当前新增了待阅份数才提醒，避免同时收到过多消息</span>
            </div>
          </div>
        </qw-checkbox>
      </transition>
      <!--阅卷提醒类型-->
      <transition name="transition-drop">
        <qw-muti-radio
          v-if="formData.value.paperId.markingPerson && formData.value.readRemind"
          :objConfig="formData.properties.readRemindType"
          :objVal="formData.value.readRemindType"
          :objKey="['readRemindType']"
          :EVENT_BUS="EVENT_BUS"
        ></qw-muti-radio>
      </transition>
      <div class="qwui_solidLine"></div>
      <!--保存按钮-->
      <div class="section_button">
        <qw-button class="button_orange" :color="'orange'" @click="publishExam">
          <span>发布</span>
        </qw-button>
        <qw-button class="button_white" :color="'white'" @click="saveDraft">
          <span>保存为草稿</span>
        </qw-button>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import qwFooter from '@/components/base/footer';
import qwInput from './components/qwInput'
import qwChoosaePaper from './components/qwChoosePaper'
import qwTextarea from './components/qwTextarea'
import qwCheckbox from './components/qwCheckbox.vue'
import qwChooseDate from './components/qwChooseDate.vue'
import qwCheckGroup from './components/qwCheckGroup.vue'
import qwRandomExam from './components/qwRandomExam'
import qwRadio from './components/qwRadio'
import qwChoosePeople from './components/qwChoosePeople'
import qwDeviceControl from './components/qwDeviceControl'
import qwCheckInput from  './components/qwCheckInput'
import qwMutiRadio from './components/qwMutiRadio'
import qwButton from '../../../components/base/QWButton'
import { createEventBus } from '../../../utils/index'

export default {
  name: 'addExam',

  components: {
    qwFooter,
    qwInput,
    qwChoosaePaper,
    qwTextarea,
    qwCheckbox,
    qwChooseDate,
    qwCheckGroup,
    qwRandomExam,
    qwRadio,
    qwChoosePeople,
    qwDeviceControl,
    qwCheckInput,
    qwMutiRadio,
    qwButton,
  },

  props: {},

  data() {
    return {
      dataBase,
      //防止按钮不断被点击
      ajaxFlag: true,
      "formData": {
        "properties": {
          "name": {
            //是否显示小红点
            "required": true,
            //名称
            "title": "名称",
            //类型
            "type": "text",
            //长度
            "width": "700",
            //是否有字数限制
            "maxlength": 100,
            //placeholder
            "placeholder": "请输入考试名称",
            //失焦校验规则
            "rules": {
              "required": true,
              "message": "考试名称不能为空"
            },
          },
          //所用试卷
          "paperId": {
            //是否显示小红点
            "required": true,
            //名称
            "title": "所用试卷",
            //失焦校验规则
            "rules": {
              "type": "object",
              "required": true,
              "message": "请选择试卷"
            },
          },
          //允许通过手机相册上传图片
          "uploadImg": {
            //是否显示小红点
            "required": false,
            //选项
            "options": [
              {
                "value": 0,
                "label": "允许通过手机相册上传图片"
              },
            ],
          },
          //考试说明
          "examExplain": {
            //是否显示小红点
            "required": false,
            "type": "textarea",
            "placeholder": "备注仅后台可见",
            "title": "考试说明",
            "maxlength": 500,
          },
          //是否开启考试时间限制
          "limitDate": {
            //是否显示小红点
            "required": false,
            //名称
            "title": "考试时间",
            //选项
            "options": [
              {
                "value": 0,
                "label": "控制考试开始截止时间"
              },
            ],
          },
          //考试时间的日历控件
          "exmaDate": {
            //关联属性
            "dependProperty": "limiDate",
            "rules": {
              "myRule": {
                "type":  "array",
                "required": true,
                "message": "The 教育信息 cannot be empty"
              },
              "childRule": {
                "required": true,
                "message": "不能为空"
              }
            }
          },
          //考试限时
          "examTime": {
            //是否显示小红点
            "required": true,
            //名称
            "title": "考试限时",
            //类型
            "type": "number",
            //长度
            "width": "100",
            //最小值
            "min": 0,
            //失焦校验规则
            "rules": {
              "required": true,
              "message": "考试限时不能为空",
            },
          },
          //考试次数
          "partTime": {
            //是否显示小红点
            "required": false,
            //名称
            "title": "考试次数",
            //类型
            "type": "number",
            //长度
            "width": "100",
            //最小值
            "min": 0,
          },
          //通过分数
          "passScore": {
            //是否显示小红点
            "required": true,
            //名称
            "title": "通过分数",
            //类型
            "type": "number",
            //长度
            "width": "100",
            //最小值
            "min": 0,
            //失焦校验规则
            "rules": {
              "required": true,
              "message": "通过的分数不能为空",
            },
          },
          //是否开启题目乱序
          "orderless": {
            //是否显示小红点
            "required": false,
            //名称
            "title": "题目乱序",
            //选项
            "options": [
              {
                "value": 0,
                "label": "开启"
              },
            ],
          },
          //题型内乱序
          "innerOrderless": {
            //是否显示小红点
            "required": false,
            //关联属性
            "dependProperty": "orderless",
            //选项
            "options": [
              {
                "value": 0,
                "label": "题型内乱序"
              },
            ],
          },
          //随机考试
          "randomExam": {
            "title": "随机考试",
            //选项
            "options": [
              {
                "value": 0,
                "disabled": false,
                "label": "试卷相同"
              },
              {
                "value": 1,
                "disabled": !this.$isVipGold,
                "label": "每份试卷不同"
              },
            ],
          },
            //是否可补考
          "examAgain": {
            //是否显示小红点
            "required": false,
            "title": "是否可以补考",
            //选项
            "options": [
              {
                "disabled": !this.$isVipGold,
                "value": 0,
                "label": "开启"
              },
            ],
          },
          //补考次数
          "partAaginTime": {
            //是否显示小红点
            "required": false,
            //关联属性
            "dependProperty": "examAgain",
            //名称
            "title": "补考次数",
            //类型
            "type": "number",
            //长度
            "width": "100",
            //最小值
            "min": 0,
          },
          //补考时间的日历控件
          "exmaAgainDate": {
            "needPaddingTop": true,
            "title": "补考时间",
            //关联属性
            "dependProperty": "examAgain",
            "rules": {
              "myRule": {
                "type":  "array",
                "required": true,
                "message": ""
              },
              "childRule": {
                "required": true,
                "message": "不能为空"
              }
            }
          },
          //是否开启学分
          "examCredit": {
            //是否显示小红点
            "required": false,
            "title": "学分",
            //选项
            "options": [
              {
                "value": 0,
                "label": "开启"
              },
            ],
          },
          //分配学分的方式
          "examCreditType": {
            //选项
            "options": [
              {
                "value": 0,
                "label": "按考试是否通过分配学分"
              },
              {
                "value": 1,
                "label": "按考试分数分配学分"
              },
            ],
            //通过后获得多少学分的配置
            "creditTypeOne": {
              "noLabel": true,
              //类型
              "type": "number",
              //长度
              "width": "100",
              //最小值
              "min": 1,
              //失焦校验规则
              "rules": {
                "required": true,
                "message": "学分不能为空",
              },
              "numType": "整数",
            }
          },
          //交卷后
          "examFinish": {
            //选项
            "options": [
              {
                "value": 0,
                "label": "分数可见"
              },
              {
                "value": 1,
                "label": "对错可见"
              },
              {
                "value": 2,
                "label": "答案可见"
              },
            ],
          },
          //考试结束后
          "examEnd": {
            //选项
            "options": [
              {
                "value": 0,
                "label": "分数可见"
              },
              {
                "value": 1,
                "label": "对错可见"
              },
              {
                "value": 2,
                "label": "答案可见"
              },
            ],
          },
          //考试对象
          "examPeople": {
            "required": true,
            "title": "考试对象",
            //选项
            "options": [
              {
                "value": 0,
                "label": "所有人"
              },
              {
                "value": 1,
                "label": "特定对象"
              },
            ],
          },
          //设备限制单选按钮配置
          "deviceControl": {
            //选项
            "options": [
              {
                "value": 0,
                "disabled": !this.$isVipGold,
                "label": "只允许在PC端答题"
              },
              {
                "value": 1,
                "disabled": !this.$isVipGold,
                "label": "只允许在应用端答题"
              },
              {
                "value": 2,
                "disabled": !this.$isVipGold,
                "label": "只允许在个人网页版答题"
              },
            ],
          },
          //切换页面超过多少次强制交卷
          "changePage": {
            //选项
            "options": [
              {
                "value": 0,
                "label": "",
                "disabled": true,
              },
            ],
            //内部input框的配置
            "inputConfig": {
              "noLabel": true,
              //类型
              "type": "number",
              //长度
              "width": "100",
              //最小值
              "min": 0,
              "disabled": true,
              "inputHead": "切换页面超过",
              "inputUnit": "次强制交卷",
              //失焦校验规则
              "rules": {
                "required": true,
                "message": "设置页面切换的次数不能为空"
              },
            },
          },
          //只允许考生页面窗口最大化
          "winMaxsize": {
            //选项
            "options": [
              {
                "value": 0,
                "label": "",
                "disabled": true,
              },
            ],
            //内部input框的配置
            "inputConfig": {
              "noLabel": true,
              //类型
              "type": "number",
              //长度
              "width": "100",
              //最小值
              "min": 0,
              "disabled": true,
              "inputHead": "页面窗口最大化后才允许进入考试，且缩小窗口超过",
              "inputUnit": "次强制交卷",
              //失焦校验规则
              "rules": {
                "required": true,
                "message": "设置窗口切换的次数不能为空"
              },
            },
          },
          //禁止考生复制、粘贴、剪切
          "banCopy": {
            //是否显示小红点
            "required": false,
            "dependBorther": true,
            //选项
            "options": [
              {
                "value": 0,
                "label": "禁止考生复制、粘贴、剪切",
                "disabled": true,
              },
            ],
          },
          //考试提醒
          "examRemind": {
            //是否显示小红点
            "required": false,
            //名称
            "title": "考试提醒",
            //选项
            "options": [
              {
                "value": 0,
                "label": "发布时发送通知消息"
              },
            ],
          },
          //考试提醒
          "openExamRemind": {
            //是否显示小红点
            "required": false,
            "dependProperty": "examRemind",
            "hasBorther": true,
            //选项
            "options": [
              {
                "value": 0,
                "label": "开启考试提醒"
              },
            ],
          },
          //考试开始前提醒
          "examStartRemind": {
            //是否显示小红点
            "required": false,
            "dependProperty": "openExamRemind",
            "hasBorther": true,
            //类型
            "type": "number",
            //长度
            "width": "100",
            //最小值
            "min": 0,
            //失焦校验规则
            "rules": {
              "required": true,
              "message": "考试开始前提醒时间不能为空"
            },
          },
          //考试结束前提醒
          "examEndRemind": {
            //是否显示小红点
            "required": false,
            "dependProperty": "openExamRemind",
            "hasBorther": true,
            //类型
            "type": "number",
            //长度
            "width": "100",
            //最小值
            "min": 0,
            //失焦校验规则
            "rules": {
              "required": true,
              "message": "考试结束前提醒时间不能为空"
            },
          },
          //考试开始时提醒
          "publishNotice": {
            //是否显示小红点
            "required": false,
            "dependProperty": true,
            //选项
            "options": [
              {
                "value": 0,
                "label": "考试开始时提醒"
              },
            ],
          },
          //阅卷提醒
          "readRemind": {
            //是否显示小红点
            "required": false,
            //名称
            "title": "阅卷提醒",
            "hasBorther": true,
            //选项
            "options": [
              {
                "value": 0,
                "label": "开启"
              },
            ],
          },
          //阅卷提醒选项
          "readRemindType": {
            "required": false,
            "dependProperty": 'readRemind',
            "hasBorther": true,
            //选项
            "options": [
              {
                "value": 0,
                "label": "按考试场次提醒"
              },
              {
                "value": 1,
                "label": "按阅卷份数定时汇总提醒"
              },
            ],
          },
        },
        "value": {
          "name": "",
          "paperId": "",
          "uploadImg": false,
          "examExplain": {
            "text": '',
            "photo": []
          },
          "limitDate": true,
          "exmaDate": ["", ""],
          "examTime": 0,
          "partTime": 0,
          "passScore": 0,
          "orderless": false,
          "innerOrderless": false,
          "randomExam": "试卷相同",
          "examAgain": false,
          "partAaginTime": 0,
          "exmaAgainDate": ['',''],
          "examCredit": false,
          "examCreditType": {
            "type": "按考试是否通过分配学分",
            "creditTypeOne": "",
            "creditTypeTwo": [['', '', '']],
          },
          "examFinish": [false, false, false],
          "examEnd": [false, false, false],
          "examPeople": "所有人",
          "examPeopleObj": {
            "defaultDepts": [],
            "defaultTags": [],
            "defaultUsers": [],
            "defaultPosition": [],
          },
          "deviceControl": "",
          "changePage": {
            "isOpen": false,
            "time": '',
          },
          "winMaxsize": {
            "isOpen": false,
            "time": '',
          },
          "banCopy": false,
          "examRemind": false,
          "openExamRemind": true,
          "examStartRemind": 60,
          "examEndRemind": 60,
          "publishNotice": true,
          "readRemind": true,
          "readRemindType": '按考试场次提醒',
        },
      },
      "EVENT_BUS": createEventBus(),
      "fields": [],
      //编辑页面需要用到
      "oldId": {
        "oldUserIds": '',
        "oldDeptIds": ''
      },
      //设备限制得提示框
      "showDeviceControlTip": false,
      //阅卷提醒的hover效果
      "showReadRemindTip": false,
    }
  },

  computed: {},

  watch: {},

  created() {
    this.EVENT_BUS.$on('on-form-item-add', field => {
      if(field) this.fields.push(field);
      return false;
    });
    this.EVENT_BUS.$on('on-form-item-remove', (field) => {
      let index = this.fields.indexOf(field);
      if (field && index >= 0) this.fields.splice(index, 1);
    });
    this.EVENT_BUS.$on('on-set-form-data', payload => {
      this.setFormData(payload);
    });
    //在qwRadio组件中定义的事件
    this.EVENT_BUS.$on('on-credit-rule-change', result => {
      const {type, index} = result;
      if(type === 'add'){
        this.formData.value.examCreditType.creditTypeTwo.push([]);
        let lastIndex = this.formData.value.examCreditType.creditTypeTwo.length - 1;
        this.formData.value.examCreditType.creditTypeTwo[lastIndex].push(...['','','']);
      }else if(type === 'delete'){
        this.formData.value.examCreditType.creditTypeTwo.splice(index,1);
      }
    });
    this.$route.query.id && this.showExamInfo();
  },

  methods: {
    goBack() {
      this.$utils.windowRedirect('/manager/examination/main.jsp?classClick=1');
    },
    setFormData(payload) {
      const { key, value } = payload;
      //当上一份试卷没阅卷人，而此时选择的试卷出现阅卷人，重置阅卷提醒的默认值
      if(!this.formData.value.paperId.markingPerson && key[0] == "paperId") {
        this.formData.value.readRemind = true;
        this.formData.value.readRemindType = "按考试场次提醒";
      }
      //考试时间和补考功能按钮的切换重置日历组件的时间
      if(key[0] == "examAgain") {
        this.formData.value.partAaginTime = 0;
        this.formData.value.exmaAgainDate.splice(0, 2, '','');
      }
      //开启考试时间，默认开启考试提醒和开启考试开始时提醒
      //不开启，是否可以补考禁止选中
      if(key[0] == "limitDate"){
        this.formData.value.exmaDate.splice(0, 2, '','');
        this.formData.value.examAgain = false;
        this.formData.value.partAaginTime = 0;
        this.formData.value.exmaAgainDate.splice(0, 2, '', '');
        if(value){
          this.formData.value.openExamRemind = true;
          this.formData.value.examStartRemind = 60;
          this.formData.value.examEndRemind = 60;
          this.formData.value.publishNotice = true;
          this.formData.properties.examAgain.options[0].disabled = !this.$isVipGold;
        }else {
          this.formData.properties.examAgain.options[0].disabled = true;
        }
      }
      //可见性的级联关系
      if((key[0] == 'examFinish' || key[0] == 'examEnd')){
        let parentKey = key[0];
        let childKey = key[1];
        this.formData.value[parentKey].forEach((item, index) => {
          if(index < childKey){
            this.formData.value[parentKey][index] = true;
          }
        });
      }
      //学分功能的开启关闭的切换，重置获取方式为“按考试是否通过分配学分”
      if(key[0] == 'examCredit') {
        this.formData.value.examCreditType.type = "按考试是否通过分配学分";
      }
      //学分类型切换重置数据
      if(key[1] && key[1] == 'type'){
        this.formData.value.examCreditType.creditTypeOne = '';
        this.formData.value.examCreditType.creditTypeTwo.splice(0);
        this.formData.value.examCreditType.creditTypeTwo.push([]);
        this.formData.value.examCreditType.creditTypeTwo[0].push(...['','','']);
      }
      //设备限制类型切换之后，防作弊设置默认值重置以及disabled状态
      if(this.$isVipGold && key[0] == 'deviceControl' && value === '只允许在个人网页版答题') {
        //重置配置的disabled状态
        this.formData.properties.changePage.options[0].disabled = false;
        this.formData.properties.winMaxsize.options[0].disabled = false;
        this.formData.properties.banCopy.options[0].disabled = false;
      }else if(this.$isVipGold && key[0] == 'deviceControl' && value !== '只允许在个人网页版答题') {
        this.formData.properties.changePage.options[0].disabled = true;
        this.formData.properties.changePage.inputConfig.disabled = true;
        this.formData.properties.winMaxsize.options[0].disabled = true;
        this.formData.properties.winMaxsize.inputConfig.disabled = true;
        this.formData.properties.banCopy.options[0].disabled = true;
        //重置默认值
        this.formData.value.changePage.isOpen = false;
        this.formData.value.changePage.time = '';
        this.formData.value.winMaxsize.isOpen = false;
        this.formData.value.winMaxsize.time = '';
        this.formData.value.banCopy = false;
      }
      //切换页面超过多少次功能切换之后，input框重置默认值以及disabled状态
      if(this.$isVipGold && key[1] && key[1] == 'isOpen' && value) {
        //重置disabled状态
        this.formData.properties[key[0]].inputConfig.disabled = false;
        //赋予初始值
        this.formData.value[key[0]].time = 3;
      }else if(this.$isVipGold && key[1] && key[1] == 'isOpen' && !value) {
        this.formData.properties[key[0]].inputConfig.disabled = true;
        //重置input默认值
        this.formData.value[key[0]].time = '';
      }
      key.reduce((pre, cur, curIndex, arr) => {
        // 如果是最后一项，就是我们要改变的字段
        if(curIndex === arr.length - 1) {
          // Vue 不能检测直接用索引设置数组某一项的值
          if(typeof(cur) === 'number') {
            return pre.splice(cur, 1, value);
          } else {
            return pre[cur] = value;
          }
        }
        return pre[cur] = pre[cur] || {}
      }, this.formData.value);
    },
    //处理可见性数据
    handleSetView(examFinish, examEnd) {
      return examFinish && examEnd ? 3 :
              !examFinish && examEnd ? 2 :
                examFinish && !examEnd ? 1 : 0;
    },
    //responeCallBack
    responeCallBack(code, result, resc) {
      let {top_alert, alert} = this.dataBase;
      if(result.code == code) {
        top_alert(resc, true, 2000);
        setTimeout(() => {
          this.$utils.windowRedirect('/manager/examination/main.jsp?classClick=1');
        }, 1800);
      }else if("350016"==result.code || "350017"==result.code) {
        //是否为渠道
        if(_.orgConfigInfo && _.orgConfigInfo.isCooperation && _.orgConfigInfo.type == "1") {
          alert('提交结果', result.desc);
        }else {
          alert('提交结果', result.desc +
            '。<a href="'+ _.baseURL +'/qiweipublicity/companysrv/vip/vip_gold_index.jsp" target="_blank" ' +
            'style="display: inline;float: initial;font-size: 12px;text-decoration: underline;">' +
            '【金卡用户】可选择一万名考试对象></a>');
        }
      }else {
        alert('提交结果', result.desc);
      }
    },
    //全局校验
    globalCheck(examStatus) {
      let formValue = this.formData.value;
      // 加多一个补考时间的校验
      if(formValue.exmaDate[0] && formValue.exmaDate[1] && formValue.exmaAgainDate[0] && formValue.exmaAgainDate[1]) {
        let examEndDate = formValue.exmaDate[1];
        let examAgainStartDate = formValue.exmaAgainDate[0];
        if((new Date(examEndDate).getTime() + 600000) >= new Date(examAgainStartDate).getTime()){
          this.dataBase.alert('提交结果', '补考时间需设置在考试结束10分钟后，请先修改补考开始时间');
          this.ajaxFlag = true;
          return;
        }
      }
      let flag = true;
      let promiseArray = [];
      this.fields.forEach((item, index) => {
        let promiseObj =  item.handleBlur && item.handleBlur();
        promiseObj && promiseObj.then(obj => {
          if(!obj.status) flag = obj.status;
        });
        promiseArray.push(promiseObj);
      })
      let promiseArrayObj = Promise.all(promiseArray);
       promiseArrayObj.then(() => {
         let {top_alert, alert} = this.dataBase;
         this.dataBase.mask = true;
         this.dataBase.loading = true;
         if(flag) {
           let formObj = this.handleSubmit(examStatus);
           let isEdit = this.$route.query.isEdit;
           if(isEdit){
             formObj["tbQyExaminationExamPO.id"] = this.$route.query.id;
             formObj["oldUserIds"] = this.oldId.oldUserIds;
             formObj["oldDeptIds"] = this.oldId.oldDeptIds;
           }
           if(isEdit !== "true"){
             if(examStatus){
               this.$api.publishExam(formObj, (code, result) => {
                  this.ajaxFlag = true;
                  this.dataBase.mask = false;
                  this.dataBase.loading = false;
                  this.responeCallBack(code, result, "考试发布成功");
               });
             }else {
               this.$api.saveExamDraft(formObj, (code, result) => {
                 this.ajaxFlag = true;
                 this.dataBase.mask = false;
                 this.dataBase.loading = false;
                 this.responeCallBack(code, result, "保存草稿成功");
               });
             }
           }else {
             if(examStatus){
               this.$api.editPublishExam(formObj, (code, result) => {
                 this.ajaxFlag = true;
                 this.dataBase.mask = false;
                 this.dataBase.loading = false;
                 this.responeCallBack(code, result, "考试发布成功");
               });
             }else {
               this.$api.editSaveExamDraft(formObj, (code, result) => {
                 this.ajaxFlag = true;
                 this.dataBase.mask = false;
                 this.dataBase.loading = false;
                 this.responeCallBack(code, result, "保存草稿成功");
               });
             }
           }
         }else {
           setTimeout(() => {
             this.dataBase.mask = false;
             this.dataBase.loading = false;
             this.ajaxFlag = true;
           }, 1000);
           window.scrollTo(0, 0);
           top_alert("发布失败，请检查内容设置是否正确", false, 2000);
         }
      })
    },
    //整理表单数据
    handleSubmit(examStatus) {
      let form = this.formData.value;
      let webForms = {};
      //考试名称
      webForms["tbQyExaminationExamPO.examName"] = form.name;
      //所选试卷id
      webForms["tbQyExaminationExamPO.testpaperId"] = form.paperId.id;
      //所选试卷总分
      webForms["tbQyExaminationExamPO.totalScore"] = form.paperId.totalScore;
      //试卷有无上传图片功能
      webForms["paperAllowPic"]= form.paperId.paperAllowPic;
      //是否允许通过相册上传图片
      webForms["tbQyExaminationExamPO.photoSet"] = form.paperId.paperAllowPic && form.uploadImg ? 1 : 0;
      //考试说明
      webForms["tbQyExaminationExamPO.examExplain"] = form.examExplain.text;
      //上传的图片
      if(form.examExplain.photo.length > 0){
        webForms["imgurl"] = this.$utils.handlerId(form.examExplain.photo,"imageURL");
      }
      //是否控制考试时间
      webForms["tbQyExaminationExamPO.controlTime"] = form.limitDate ? 1 : 0;
      if(form.limitDate) {
        //考试开始时间
        webForms["tbQyExaminationExamPO.startTime"] = (new Date(form.exmaDate[0])).Format("yyyy-MM-dd hh:mm:ss");
        //考试截止时间
        webForms["tbQyExaminationExamPO.lastStartTime"] = (new Date(form.exmaDate[1])).Format("yyyy-MM-dd hh:mm:ss");
        //开启考试提醒
        webForms["tbQyExaminationExamPO.isRemind"] = form.openExamRemind ? 1 : 0;
        //考试开始前几分钟提醒
        webForms["tbQyExaminationExamPO.remindTime"] = form.examStartRemind;
        //考试结束前几分钟提醒
        webForms["tbQyExaminationExamPO.overRemindTime"] = form.examEndRemind;
        //考试开始时提醒
        webForms["tbQyExaminationExamPO.startRemind"] = form.publishNotice ? 1 : 0;
      }
      //考试限时
      webForms["tbQyExaminationExamPO.duration"] = form.examTime;
      //考试次数
      webForms["tbQyExaminationExamPO.maxTimes"] = form.partTime;
      //通过分数
      webForms["tbQyExaminationExamPO.passGrade"] = form.passScore;
      //题目乱序
      webForms["tbQyExaminationExamPO.isReorder"] = form.orderless ? 1 : 0;
      //题型乱序
      webForms["examPO.disOrder"] = form.orderless && form.innerOrderless ? 1 : 0;
      //随机考试
      webForms["examPO.randomType"]= form.paperId.method == '1' && form.randomExam == "每份试卷不同" ? 4 : 0;
      //是否可以补考
      webForms["examPO.ifResit"] = form.examAgain ? 1 : 0;
      if(form.examAgain) {
        //补考次数
        webForms["examPO.resitTimes"] = form.partAaginTime;
        //补考开始时间
        webForms["examPO.startTime"] = (new Date(form.exmaAgainDate[0])).Format("yyyy-MM-dd hh:mm:ss");
        //补考结束时间
        webForms["examPO.endTime"] = (new Date(form.exmaAgainDate[1])).Format("yyyy-MM-dd hh:mm:ss");
      }
      //学分整理
      if(form.examCredit){
        webForms["examPO.creditRule"] = form.examCreditType.type == '按考试是否通过分配学分' ? 1 : 2;
        if(form.examCreditType.type == '按考试是否通过分配学分'){
          webForms["creditRules[0].credit"] = form.examCreditType.creditTypeOne;
        }else {
          form.examCreditType.creditTypeTwo.forEach((item, index) => {
            webForms["creditRules["+ index +"].minScore"] = item[0];
            webForms["creditRules["+ index +"].maxScore"] = item[1];
            webForms["creditRules["+ index +"].credit"] = item[2];
          })
        }
      }
      //可见性
      webForms["tbQyExaminationExamPO.isViewScore"] = this.handleSetView(form.examFinish[0], form.examEnd[0]);
      webForms["tbQyExaminationExamPO.isViewRight"] = this.handleSetView(form.examFinish[1], form.examEnd[1]);
      webForms["tbQyExaminationExamPO.isViewResult"] = this.handleSetView(form.examFinish[2], form.examEnd[2]);
      //选人的类型
      webForms["range"] = form.examPeople == "所有人" ? 1 : 3;
      if(form.examPeople == "特定对象"){
        //"deptIds"
        webForms["deptIds"] = this.$utils.handlerId(form.examPeopleObj.defaultDepts);
        //"tagIds"
        webForms["tagIds"] = this.$utils.handlerId(form.examPeopleObj.defaultTags);
        //"userIds"
        webForms["userIds"] = this.$utils.handlerId(form.examPeopleObj.defaultUsers);
        //"postIds"
        webForms["postIds"] = this.$utils.handlerId(form.examPeopleObj.defaultPosition);
      }else {
        //"deptIds"
        webForms["deptIds"] = '';
        //"tagIds"
        webForms["tagIds"] = '';
        //"userIds"
        webForms["userIds"] = '';
        //"postIds"
        webForms["postIds"] = '';
      }
      // 设备的限制
      webForms["examPO.examDevice"] = form.deviceControl == "只允许在PC端答题" ? 1 :
                                                      form.deviceControl == "只允许在应用端答题" ? 2 :
                                                        form.deviceControl == "只允许在个人网页版答题" ? 3 : 0;
      //切换页面最大次数
      if(form.changePage.isOpen){
        webForms["examPO.switchTimes"] = form.changePage.time;
      } else {
        webForms["examPO.switchTimes"] = null;
      }
      //缩小窗口最大次数
      if(form.winMaxsize.isOpen) {
        webForms["examPO.maxModel"] = form.winMaxsize.time;
      }else {
        webForms["examPO.maxModel"] = null;
      }
      //是否禁止考生复制
      webForms["examPO.allowCopy"] = form.banCopy ? 1 : 0;
      //发布时发送通知
      webForms["tbQyExaminationExamPO.isPublishSend"] = form.examRemind ? 1 : 0;
      //阅卷提醒,不开是0吧，按考试传1d，按人员传2
      if(form.paperId.markingPerson) webForms["examPO.remindType"] = !form.readRemind ? 0 : form.readRemindType ==  "按考试场次提醒" ? 1 : 2;
      //答题模式1.整卷 2.逐题,目前没有整卷的功能，所以一直传2
      webForms["tbQyExaminationExamPO.examMode"] = 2;
      //是否为外部考试
      webForms["tbQyExaminationExamPO.isOpen"] = 0;
      //试卷的状态 0草稿，1发布,2已结束
      webForms["tbQyExaminationExamPO.examStatus"] = examStatus;
      //是否删除随机试卷历史数据
      webForms["randomIsDel"] = 0;
      webForms["tbQyExaminationExamPO.isLearn"] = 0;
      webForms["randomData"] = '';
      webForms["a1"] = "on";
      return webForms;
    },
    //发布考试
    publishExam() {
      if(this.ajaxFlag) {
        this.ajaxFlag = false;
        this.globalCheck(1);
      }
    },
    //保存为草稿
    saveDraft() {
      if(this.ajaxFlag) {
        this.ajaxFlag = false;
        this.globalCheck(0);
      }
    },
    //复制编辑考试页面的数据请求
    showExamInfo() {
      this.dataBase.mask = true;
      this.dataBase.loading = true;
      this.$api.getExamInfo({id: this.$route.query.id},data => {
        this.dataBase.mask = false;
        this.dataBase.loading = false;
        let { tagList, persons, departIdList, departNameList, paperVO, picList, paperAllowPic} = data;
        let deptList = [];
        departIdList && departIdList.length && departIdList.forEach(item => {
          let obj = {id: item, deptId: item};
          deptList.push(obj);
        });
        departNameList && departNameList.length && departNameList.forEach((item, index) => {
          deptList[index]["deptName"] = item;
        });
        data["deptList"] = deptList;
        tagList && tagList.length && tagList.forEach(item => {
          item["tagId"] = item["id"];
          item["tagName"] = item["name"];
        });
        persons && persons.length && persons.forEach(item => {
          item["id"] = item.userId;
        })
        picList && picList.forEach(item => {
          item["imageURL"] = item["picPath"];
        });
        paperVO["paperAllowPic"] = paperAllowPic;
        if(this.$route.query.isEdit){
          if(deptList && deptList.length) this.oldId.oldDeptIds = this.$utils.handlerId(deptList);
          if(persons && persons.length) this.oldId.oldUserIds = this.$utils.handlerId(persons);
        }
        this.handleResponeData(data);
      });
    },
    //数据的初始化
    handleResponeData(data) {
      let { tbQyExaminationExamPO, examPO, creditRules, paperVO,
        postList, tagList, persons, deptList, picList } = data;
      let form = this.formData.value;
      let formProperty = this.formData.properties;
      form.name = tbQyExaminationExamPO.examName;
      form.paperId = paperVO;
      form.examExplain.text = tbQyExaminationExamPO.examExplain
      if(picList !== undefined) form.examExplain.photo = [...picList];
      form.uploadImg = form.paperId.paperAllowPic && +tbQyExaminationExamPO.photoSet ? true : false;
      form.limitDate = +tbQyExaminationExamPO.controlTime ? true : false;
      if(this.$isVipGold){
        this.formData.properties.examAgain.options[0].disabled = !form.limitDate;
      }else {
        this.formData.properties.examAgain.options[0].disabled = true;
      }
      form.exmaDate.splice(0,2,tbQyExaminationExamPO.startTime,tbQyExaminationExamPO.lastStartTime);
      form.openExamRemind = +tbQyExaminationExamPO.isRemind ? true : false;
      form.examStartRemind = tbQyExaminationExamPO.remindTime || '';
      form.examEndRemind = tbQyExaminationExamPO.overRemindTime || '';
      form.publishNotice = +tbQyExaminationExamPO.startRemind ? true : false;
      form.examTime = tbQyExaminationExamPO.duration;
      form.partTime = tbQyExaminationExamPO.maxTimes;
      form.passScore = tbQyExaminationExamPO.passGrade;
      form.orderless = +tbQyExaminationExamPO.isReorder ? true : false;
      form.innerOrderless = +examPO.disOrder ? true : false;
      form.randomExam = examPO.randomType == 4 ? "每份试卷不同" : "试卷相同";
      form.examAgain = +examPO.ifResit ? true : false;
      form.partAaginTime = examPO.resitTimes;
      form.exmaAgainDate.splice(0,2,examPO.startTime,examPO.endTime);
      form.examCredit = examPO.creditRule > 0;
      form.examCreditType.type = examPO.creditRule ==2 ? '按考试分数分配学分' : '按考试是否通过分配学分';
      form.examCreditType.creditTypeOne = (creditRules && creditRules.length && examPO.creditRule == 1 && creditRules[0].credit) || '';
      examPO.creditRule == 2 && creditRules.forEach((item, index) => {
        !index && form.examCreditType.creditTypeTwo.splice(0,1);
        let arr = [item.minScore, item.maxScore, item.credit];
        form.examCreditType.creditTypeTwo.push(arr);
      });
      [tbQyExaminationExamPO.isViewScore, tbQyExaminationExamPO.isViewRight, tbQyExaminationExamPO.isViewResult].forEach((item, index) => {
        switch (item) {
          case "0":
            form.examFinish.splice(index, 1, false);
            form.examEnd.splice(index, 1, false);
            break;
          case "1":
            form.examFinish.splice(index, 1, true);
            form.examEnd.splice(index, 1, false);
            break;
          case "2":
            form.examFinish.splice(index, 1, false);
            form.examEnd.splice(index, 1, true);
            break;
          default:
            form.examFinish.splice(index, 1, true);
            form.examEnd.splice(index, 1, true);
        }
      });
      if(tbQyExaminationExamPO.ranges == 1){
        form.examPeople = "所有人"
      }else {
        form.examPeople = "特定对象"
        form.examPeopleObj.defaultDepts = [...deptList];
        form.examPeopleObj.defaultPosition = [...postList];
        form.examPeopleObj.defaultTags = [...tagList];
        form.examPeopleObj.defaultUsers = [...persons];
      }
      form.deviceControl = examPO.examDevice == "3" ? "只允许在个人网页版答题" :
                            examPO.examDevice == "2" ? "只允许在应用端答题" :
                              examPO.examDevice == "1" ? "只允许在PC端答题" : "";
      if(examPO.examDevice == "3") {
        formProperty.changePage.options[0].disabled = false;
        formProperty.winMaxsize.options[0].disabled = false;
        formProperty.banCopy.options[0].disabled = false;
      }
      if(examPO.switchTimes) {
        form.changePage.isOpen = true;
        form.changePage.time = examPO.switchTimes;
        formProperty.changePage.inputConfig.disabled = false;
      }
      if(examPO.maxModel) {
        form.winMaxsize.isOpen = true;
        form.winMaxsize.time = examPO.maxModel;
        formProperty.winMaxsize.inputConfig.disabled = false;
      }
      form.banCopy = +examPO.allowCopy;
      form.examRemind = +tbQyExaminationExamPO.isPublishSend ? true : false;
      form.readRemind = +examPO.remindType ? true : false;
      form.readRemindType = examPO.remindType == "2" ? "按阅卷份数定时汇总提醒" : "按考试场次提醒";
    }
  },

}
</script>

<style lang="scss" scoped>
@import "../../../style/config.scss";
.qwui-addExam {

  .addExam_backBar {
    position: relative;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    text-align: center;
    background-color: $whiteBackground;
    .backBar_wrap {
      width: 1200px;
      margin: 0 auto;
      .backBar_icon {
        position: absolute;
        width: 28px;
        height: 28px;
        top: 11px;
        background: url(~assets/images/ic_back.png) no-repeat center/28px 28px;
        cursor: pointer;
      }
    }
  }
  .addExam_section {
    width: 1200px;
    margin: 16px auto;
    padding: 65px 128px 60px 112px;
    background-color: $whiteBackground;
    .qwui-checkbox_description {
      margin-right: 23px;
      text-align: right;
      display: inline-block;
      width: 70px;
      vertical-align: super;
    }
    .section_mutiChoose {
      height: 21px;
      line-height: 21px;
      margin-left: 140px;
      &.mutiChoose_marginTop {
        margin-top: 12px;
      }
      /deep/ .qwui-checkbox .qwui-checkbox-label {
        margin-right: 40px;
      }
    }
    .section_button {
      padding-top: 32px;
      .button_white {
        margin-left: 20px;
      }
      .button_orange {
        margin-left: 371px;
      }
    }
  }
}
</style>
