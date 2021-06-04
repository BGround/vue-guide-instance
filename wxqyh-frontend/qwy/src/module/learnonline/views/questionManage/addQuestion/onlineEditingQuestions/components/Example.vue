<template>
  <div class="onlineEditing_example_item">
    <example-base
      :title="nowTitle"
      :questionArr="nowQuestionArr"
      :exampleExplain="nowExampleExplain"
    >
      <div class="example_base" v-show="!tabIndex">
        <div class="example_format" @click="clickFormat">请点击具体题型查看示例格式</div>
        <div class="example_edit_img"></div>
      </div>
    </example-base>
  </div>
</template>

<script>
import ExampleBase from './ExampleBase'; // 预览基础组件
export default {
  name: 'Example',
  components: {
    ExampleBase
  },
  props: {
    tabIndex: { // tab栏当前选中
      type: Number,
      required: true
    },
    tabs: { // tab栏
      type: Array,
      required: true
    }
  },

  data() {
    return {
      // 顺序: 基础格式 单选题 多选题 判断题 填空题 问答题
      questionArr: [ // 题目转换展示数组{text:, obj:原类型}
        [],
        [{
          text:
`1. 企微云平台提供哪些版本的产品服务？[单选题]
A.企微云OA：协同办公
B.企微云CRM：智能销售
C.企微云HR：人事文化培训
D.以上三种版本都提供 
答案：D 
解析：企微云是提供OA、CRM、HR服务的一站式移动工作平台。`,
          obj: {
            otherInfo: {sequence: '1'},
            answer: 'D',
            answerRemark: '企微云是提供OA、CRM、HR服务的一站式移动工作平台。',
            content: ' 企微云平台提供哪些版本的产品服务？',
            questionType: 1,
            option: [
              {content: '企微云OA：协同办公',sort: 1,isAnswer: '0'},
              {content: '企微云CRM：智能销售',sort: 2,isAnswer: '0'},
              {content: '企微云HR：人事文化培训',sort: 3,isAnswer: '0'},
              {content: '以上三种版本都提供',sort: 4,isAnswer: '1'}
            ]
          }
        }],
        [{
          text:
`2. 为什么选择企微云平台？[多选题]
A.免费：超过30个应用基础功能免费
B.易推广：基于微信，不用装APP，推广容易
C.免维护：企微技术团队，7*12小时为你服务
D.易使用：移动互联轻应用，无需培训即可使用
E.安全保障：平台安全、流程安全、数据安全。
答案：A;B;C;E
解析：企微云帮助客户实现企业管理的快速移动化，提升效率，降低成本`,
          obj: {
            otherInfo: {'sequence': '2'},
            answer: 'A;B;C;E',
            answerRemark: '企微云帮助客户实现企业管理的快速移动化，提升效率，降低成本。',
            content: '为什么选择企微云平台？',
            questionType: 2,
            option: [
              {content: '免费：超过30个应用基础功能免费', sort: 1, isAnswer: '1'},
              {content: '易推广：基于微信，不用装APP，推广容易', sort: 2, isAnswer: '1'},
              {content: '免维护：企微技术团队，7*12小时为你服务', sort: 3, isAnswer: '1'},
              {content: '易使用：移动互联轻应用，无需培训即可使用', sort: 4, isAnswer: '0'},
              {content: '安全保障：平台安全、流程安全、数据安全。', sort: 5, isAnswer: '1'}
            ]
          }
        }],
        [{
          text:
`3. 企微云是否提供尊享版的免费试用？(是)[判断题]
解析：新用户接入后将自动开通15天的产品试用。期间没有功能、人数限制，您可以充分试用并确定需要使用的产品功能，在过程中如需任何支持，可随时联系我们的客户顾问。`,
          obj: {
            otherInfo: {sequence: '3'},
            answerRemark: '新用户接入后将自动开通15天的产品试用。期间没有功能、人数限制，您可以充分试用并确定需要使用的产品功能，在过程中如需任何支持，可随时联系我们的客户顾问。',
            content: '企微云是否提供尊享版的免费试用？',
            questionType: 0,
            answer: '是',
            option: [
              {content: '是',sort: 1,isAnswer: '1'},
              {content: '否',sort: 2,isAnswer: '0'}
            ]
          }
        }],
        [{
          text: 
`4. 新企业用户注册企微正式账号即免费获得___永久存储空间，分享案例可免费获得___存储空间。[填空题](系统评分)
答案：1G;1g|2G;2g
解析：各类活动所获赠的免费存储空间可叠加。企业用户所获得免费永久存储空间的上限是10G，超出的存储空间期限为一年。`, 
          obj: {
            otherInfo: {sequence: '4'},
            answer: '1G;1g|2G;2g',
            answerRemark: '各类活动所获赠的免费存储空间可叠加。企业用户所获得免费永久存储空间的上限是10G，超出的存储空间期限为一年。',
            content: ' 新企业用户注册企微正式账号即免费获得___永久存储空间，分享案例可免费获得___存储空间。',
            questionType: 4,
            isManual: 0
          }
        }],
        [{
          text:
`5. 企微云平台获得企业微信推荐的应用有哪些？[问答题](系统评分)
答案：企微云培训考试、企微云表单流程、企微云云任务、企微云办公、企微云CRM、企微云人事考核、企微云费控报销、企微云文化
匹配项：企培训考试;表单流程;云任务;云办公;CRM;人事考核;费控报销;云文化`,
          obj: {
            otherInfo: {
              sequence: '5',
              essayQuestionAnswer: '企微云培训考试、企微云表单流程、企微云云任务、企微云办公、企微云CRM、企微云人事考核、企微云费控报销、企微云文化'
            },
            content: '企微云平台获得企业微信推荐的应用有哪些？',
            questionType: 3,
            isManual: 0,
            allowPic: 1,
            answerRemark: '企微云培训考试、企微云表单流程、企微云云任务、企微云办公、企微云CRM、企微云人事考核、企微云费控报销、企微云文化',
            answer: '企培训考试;表单流程;云任务;云办公;CRM;人事考核;费控报销;云文化'
          }
        },
        {
          text:
`6. 企微云平台获得企业微信推荐的应用有哪些？[问答题](人工评分)`,
          obj: {
            otherInfo: {
              oriContent: '6.企微云平台获得企业微信推荐的应用有哪些？[问答题](人工评分)',
              sequence: '6'
            },
            content: '企微云平台获得企业微信推荐的应用有哪些？',
            questionType: 3,
            isManual: 1,
            allowPic: 1
          }
        }],
      ],

      exampleExplain: [ // 题型说明内容
`• 题目识别：按题型编号识别 
• 题型编号：支持1.或1、或（1）或(1)四种格式 
• 题型支持：[单选题]、[多选题]、[判断题]、[填空题](人工评分)、[填空题](系统评分)、问答题](人工评分)、[问答题](系统评分) 
• 题型标注：推荐使用“[题型]”或“【题型】”的方式在题目尾端标注，如无标注会智能识别`,
`• 选项支持A.和A、两种格式，最少支持2个选项A,B，最多支持26个选项。
• 答案：必填，须标注“答案：”，且不能为空，勿加分隔符。
• 解析需标注“解析：”，非必填。
• 题目不能超过2000字，解析不能超过2000字，每个答案选项不能超过500字。`,
`• 选项支持A.和A、两种格式，最少支持2个选项A,B，最多支持26个选项。
• 答案：必填，须标注“答案：”，且不能为空，若有多个答案选项以英文“;”隔开。
• 解析需标注“解析：”，非必填。
• 题目不能超过2000字，解析不能超过2000字，每个答案选项不能超过500字。`,
`• 答案：必填，支持()与（）格式填写。
• 答案内容：支持填写“正确”或“错误”、“是”或“否”、“同意”或“不同意”三种格式。
• 题目不能超过2000字，解析不能超过2000字。`,
`• 题型：需使用“[问答题](系统评分)”或“[问答题](人工评分)”的方式标注，不填写"()"内容，默认为人工评分。
• 答案：非必填，须标注“答案：”。
• 匹配项： 
  1. 人工评分非必填，系统评分必填。 
  2. 多个关键字用英文“;”分开，每个关键字不能超过20个字符。 
• 默认允许考生上传照片作为答案，如需修改，可在文本成功导入后>管理题库试题页编辑。 
• 题目不能超过2000字，解析不能超过2000字，匹配项每项不能超过20字。`,
`• 题型：需使用“[问答题](系统评分)”或“[问答题](人工评分)”的方式标注，不填写"()"内容，默认为人工评分。
• 答案：非必填，须标注“答案：”。
• 匹配项：
  1. 人工评分非必填，系统评分必填。
  2. 多个关键字用英文“;”分开，每个关键字不能超过20个字符。
• 默认允许考生上传照片作为答案，如需修改，可在文本成功导入后>管理题库试题页编辑。
• 题目不能超过2000字，解析不能超过2000字，匹配项每项不能超过20字。`,
],
    };
  },
  computed: {
    nowTitle() { // 当前加粗导航文本
      return !this.tabIndex? '所有题型格式说明': this.tabs[this.tabIndex].text;
    },
    nowQuestionArr() { // 当前问题数组
      return this.questionArr[this.tabIndex];
    },
    nowExampleExplain() { // 题型说明内容
      return this.exampleExplain[this.tabIndex];
    }
  },
  watch: {

  },
  created() {
  },
  methods: {
    // 点击了模板字样
    clickFormat() {
      this.$emit('clickFormat');
    }
  },
}
</script>

<style lang="scss" scoped>
.onlineEditing_example_item {

  .example_base {
    margin-top: 20px;

    .example_format {
      font-size: 14px;
      color: #F87B00;
      cursor: pointer;
    }

    .example_edit_img {
      width: 336px;
      height: 164px;
      margin: 60px auto 0;
      background: url('~assets/images/exam_question_edit.png') no-repeat;
      background-size: cover;
    }
    
  }
}
</style>
