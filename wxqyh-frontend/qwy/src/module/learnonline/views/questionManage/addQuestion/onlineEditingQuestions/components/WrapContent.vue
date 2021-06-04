<template>
  <div class="onlineEditing_content flex">
    <!-- 编辑框 -->
    <codemirror
      class="onlineEditing_codemirror"
      ref="cm"
      v-model="content"
      :options="cmOptions"
      @changes="cmChanges"
      @click.native="cmClick"
    ></codemirror>

    <!-- 预览框 -->
    <preview
      class="flexItem onlineEditing_preview"
      :questions="questions"
      @clickQuestion="cmFocusQuestion"
    ></preview>
  </div>
</template>

<script>
import Preview from './Preview'; // 预览区组件
import { codemirror } from 'vue-codemirror'; // codemirror代码编辑器
import { mapGetters , mapMutations } from 'vuex';
require("codemirror/addon/search/searchcursor.js"); // 引入搜索支持
require("codemirror/addon/display/placeholder.js"); // 引入默认文本

export default {
  name: 'WrapContent',
  components: {
    Preview,
    codemirror,
  },
  props: {
    poolId: { // 题库id
      type: String,
      required: true
    }
  },
  data() {
    return {
      /* 配置项 */
      cmOptions: { // codemirror配置
        placeholder: '请将文本试题复制粘贴在此区域', // 默认显示文本
        lineNumbers: true, // 开启行号
        lineWrapping: true, // 开启换行
      },
      questionTypeArr: { // 0判断；1单选；2多选；3问答；4填空
        '判断题': 0,
        '单选题': 1,
        '多选题': 2,
        '问答题': 3,
        '填空题': 4,
      },
      fillAnswer: [ // 填空题答案合集
        '是|否',
        '正确|错误',
        '同意|不同意'
      ],
      provingMax: { // 一些默认属性的校验最大值配置
        answer: 1000,// 答案
        answerRemark: 2000, // 解析
        content: 2000, // 题目
        optionContent: 500, // 选项内容
        fillItem: 200, // 填空单个答案
        essayItem: 20 // 问答单个答案
      },

      reg: { // 正则表达式统一管理，部分可重用
        // 分割题目
        splitQuestions: /\n\s*(?:(?=\d+[\.、])|(?=[\(（]\s*\d+\s*[\)）]))/,
        // 分割内容
        splitContent: /\n\s*(?=(?:答案|解析|匹配项)[:：])/,
        // 分割题目内选项
        splitOptions: /\n+(\s*[A-Z][\.、][\w\W]*)/,
        // 分割题目内判断题答案
        splitTrueORFalse : /[\(（]\s*(是|否|正确|错误|同意|不同意)\s*[\)）]\s*$/,
        // 分割题目内题序和题目
        splitSequenceAndContent: /^\s*(?:(\d+)[\.、])|(?:[\(（](\d+)[\)）])/,
        // 分割选项内选项编号和选项内容
        splitOptionsSequence: /(?<=^\s*([A-Z])[\.、])/,
        // 判断题序存在
        hasQuestionSequence: /\s*(?=\d+[\.、])|(?=[\(（]\s*\d+\s*[\)）])/,
        // 提取项
        extractItemKey: /(?<=^\s*)答案|解析|匹配项(?=.*)/,
        // 提取内容
        extractItem: /(?<=^\s*(?:答案|解析|匹配项)[:：])[\w\W]*/,
        // 提取填空题填空项
        extractFill: /_+/g,
        // 提取答案中选项序编号
      },
      showAllError: true, // 验证所有错误-有错误也继续验证
      cmMaxLineCount: 3000, // 输入最大行数
      delayTime: 0, // 延迟赋值时间



      /* 数据项 */
      codemirror: null, // codemirror操作对象，部分方法需要在此调用
      content: '', // codemirror绑定数据
      timeHandle: 0, // 延迟赋值句柄
      questions: [], // 题目数组
      lockLeadInto: false, // 导入锁，避免同时触发
    };
  },
  computed: {
    ...mapGetters ('questionManageOnlineEditing', [
      'questionsLength',
      'isOverMaxLine',
      'Bus'
    ]),
  },
  watch: {
    'content': function(val) {
      // 更新到Vuex数据内，用于清除文本判断
      this.SET_HASCONTENT(!!val);
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取codemirror对象
      this.codemirror = this.$refs.cm && this.$refs.cm.codemirror;
    });

    // 清除文本监听
    this.Bus.$on('clearContent', () => {
      // 有文本才弹框提示操作
      if(this.content.length) {
        _.alert('提示', '确认清空文本框内容吗？',() => {
          this.clearContent();
        }, '确定', true);
      }
    });

    // 监听导入事件
    this.Bus.$on('leadInto', () => {
      this.leadInto();
    });

    // 监听后退事件
    this.Bus.$on('goBack', () => {
      // 如果有文本 则提示操作，如果没文本，直接返回
      if(this.content.trim().length) {
        _.alert('提示', '返回管理题库试题页会导致输入区中的文本信息丢失，您确定要返回吗？',() => {
          this.$router.back();
        }, '确定', true);
      } else {
        this.$router.back();
      }
    });

  },
  methods: {
    ...mapMutations('questionManageOnlineEditing', [
      'SET_HASCONTENT',
      'SET_FIRSTERRINDEX',
      'SET_QUESTIONSLENGTH',
      'SET_ISOVERMAXLINE',
      'UPDATE_ERRORINFOARR',
    ]),

    // codemirror数据更改
    cmChanges(val, instance) {
      // 如果是空文本，
      // 无需赋值（为了实现清空文本，预览区内容依然显示。产品要求）
      if (!this.content) {
        this.SET_QUESTIONSLENGTH(0); // 设置题目数量，空文本也默认没有题禁止提交
        return;
      }

      // 输入超行数，提示并不进行处理
      let cmLineCount = this.codemirror.lineCount()
      if (cmLineCount > this.cmMaxLineCount) {
        // 更新Vux 行数超出标志 尽量避免太多vux事件触发， 只在false时设置
        this.isOverMaxLine || this.SET_ISOVERMAXLINE(true);
        dataBase.top_alert(`文本行数不能超过${this.cmMaxLineCount}行，请分批导入`, '', 3000);

        // 开始聚焦超出行数文本
        this.cmFocusQuestion({
          up: this.cmMaxLineCount,
          down: cmLineCount
        }, true);
        return;
      }
      // 更新Vux 行数超出标志, 尽量避免太多vux事件触发， 只在true时设置
      this.isOverMaxLine && this.SET_ISOVERMAXLINE(false);

      clearTimeout(this.timeHandle); // 清除上一次的延迟事件
      this.timeHandle = setTimeout(() => { // 如果是这需要用action
        /*
        逻辑思路：
        【分割题】->
        【题型匹配（题型标志匹配、智能匹配）】->
        【补全对象（封装成提交数据类型）】
         */
        let questionsArr = this.splitQuestions(this.content); // 分割题
        questionsArr = this.splitContent(questionsArr); // 分割内容
        questionsArr = this.matchQuestions(questionsArr); // 题型匹配
        questionsArr = this.complete(questionsArr); // 补全对象
        questionsArr = this.proving(questionsArr); // 验证题型内容
        this.updateErrorInfoArr(questionsArr); // 更新错误信息数组
        this.SET_QUESTIONSLENGTH(questionsArr.length); // 设置题目数量

        let questions = this.questions;
        while(questions.length) {
          questions.pop();
        };
        questionsArr.length && questions.push.apply(questions, questionsArr);
      }, this.delayTime);
    },

    // codemirror光标事件
    cmClick() {
      let pos = this.codemirror.getCursor();
      let questionIndex = this.questions.findIndex(question => {
        let row = question.otherInfo.row;
        let line = pos.line;
        let isSameLine = row.up == row.down; // 整道题只有单行，则up可以相等
        return isSameLine? row.up <= line && row.down >= line:
                           row.up <= line && row.down > line;
      });

      // 能找到对应题则开始聚焦触发
      questionIndex != -1 && this.Bus.$emit('focusQuestion', questionIndex)
    },

    // 分割题
    splitQuestions(content) {
      // 无源文本返空数组 或 一开始输入时无题序内容
      if (!content || content.search(this.reg.hasQuestionSequence) == -1) {return [];}
      let lineCount = this.codemirror.lineCount(); // 总行数

      // 题目分割
      let contentArr = content.split(this.reg.splitQuestions);

      // 题目分割行号获取
      let rowArr = [];
      let search = this.codemirror.getSearchCursor(this.reg.splitQuestions);
      while(search.findNext()) {
        let nowPos = search.pos;
        // ch是横坐标，横坐标为0的才是换行位置的对象
        let line = !nowPos.from.ch? nowPos.from.line: nowPos.to.line;
        rowArr.push(line)
      }

      // 如果第一题为空文本则弹出数组（出现在第一题前有换行）
      if(contentArr.length && !contentArr[0].trim()) {
        contentArr.shift();
        rowArr.shift();
      }

      // 利用文本数组contentArr 和 行号数组rowArr 组成新的对象数组返回
      let maxIndex = contentArr.length - 1;
      return contentArr.map((content, i) => {
        // 第一题的范围上限肯定为0，非第一题只要拿这一题的row即可
        let up = !i? 0: rowArr[i-1];

        // 最后一题直接拿总行号, 得到最后行号（这里不做-1，因为ch位置取0，偏差一行刚好可选中）； 非最后一题，只要拿下一题对应row即可
        let down = i == maxIndex? lineCount: rowArr[i];

        // 这里是封装在otherInfo里，后续用处理完的数据去提交方便delete掉
        return {
          otherInfo: {
            row: {
              up: up,
              down: down
            },
            oriContent: content
          }
        };
      });
    },

    // 分割内容 (分割出各部分内容)
    splitContent(questionsArr) {
      return questionsArr.map((question, i) => {
        let oriContent = question.otherInfo.oriContent;
        let keyObject = { // 用来映射key
          '答案': 'answer',
          '解析': 'answerRemark',
          '匹配项': 'otherInfo.essayQuestionMatch'
        };
        // 开始分割
        let arr = oriContent.split(this.reg.splitContent);
        arr.forEach((contentItem, i) => {
          if (!i) {return;} // 第一项为题目 无需赋值
          // 取对应的key名，用于提交数据属性
          let nowkey = contentItem.match(this.reg.extractItemKey);

          // 对应key中赋值过滤提取出内容
          let extractItem = contentItem.match(this.reg.extractItem);
          if (extractItem) { // 匹配不到为null
            // 有多级的，需要特殊处理  例如otherInfo.essayQuestionMatch
            // nowkey => 中文 例如'匹配项'
            question = this.setObjectVal(question, keyObject[nowkey], extractItem[0])
          }
        });
        // 分割出：【题目】（有选项时包含【选项】）、【答案】、【解析】、【匹配项】

        let optionsArr = arr[0].split(this.reg.splitOptions);
        if (optionsArr.length >= 2) {
          question.otherInfo.oriOption = optionsArr[1]; // 选项赋值
        }
        question.content = optionsArr[0]; // 题目赋值
        // 此时已有【题目(有题序)】、【选项】、【答案】、【解析】、【匹配项】

        return question;
        /*
        此时每道题对象为
        item: {
          content: 题目(有题序)
          answer: 答案
          answerRemark: 解析
          otherInfo: {
            row: { 题范围
              up: 上限
              down 下限
            },
            oriContent: 题目源文本，包含选项 // 如果后续无利用价值，这里要delete
            oriOption: 选项源文本
            essayQuestionMatch: 问答题匹配项
          }
        }
         */
      });
    },

    // 题型匹配 - 调用matchQuestionsSign和matchQuestionsAuto
    matchQuestions(questionsArr) {
      return questionsArr.map((item, i) => {
        // 进行题型标志匹配
        item = this.matchQuestionsSign(item);

        // 如果没有题型标志, 即没有questionType，进行智能匹配
        if (typeof item.questionType != 'number') {
          item = this.matchQuestionsAuto(item);
        }
        return item;
      });
    },
    // 题型匹配-题型标志匹配题型
    matchQuestionsSign(question) {
        // 先抽取题型标志和评分模式
        let content = question.content; // 题目
        let contentArr = content.split(/(?:[\[【]\s*((?:单选|多选|判断|填空|问答)题)\s*[\]】])?\s*(?:[\(（]\s*((?:人工|系统)评分)\s*[\)）])?\s*$/);
          // /[\[【]\s*((?:单选|多选|判断|填空|问答)题)\s*[\]】]\s*(?:[\(（]\s*((?:人工|系统)评分)\s*[\)）])?\s*$/
        let keyArr = ['content', 'questionType', 'isManual'];
        let questionTypeArr = this.questionTypeArr;
        // 分割后的数组 0 题目；1 题型标志；2评分模式
        let contentArrLength = contentArr.length;
        for (let i = 0; i < contentArrLength; i++) {
          if (i > 2) {break;} // 只要拿前三位

          let keyName = keyArr[i]; // 拿到属性名
          let value = contentArr[i];

          value = !i? value: // 题目直接赋值
                  i == 1? questionTypeArr[value]: // 题型标志汉字转数字赋值
                  !value? '': // 无评分模式则空字符串，后续不会添加该属性
                    value == '人工评分'? 1: 0; // 评分模式 1 需要人工阅卷

          if (value || value === 0) { // 有值才需要赋值
            question[keyName] = value; // 为question赋值
          }
        }
        return question;
        /*
        此时每道题对象为
        item: {
          questionType: 题目类型0判断；1单选；2多选；3问答；4填空
          isManual: 是否人工阅卷
          content: 题目(含题序)
          answer: 答案
          answerRemark: 解析
          otherInfo: {
            row: { 题范围
              up: 上限
              down 下限
            },
            oriContent: 题目源文本，包含选项 // 如果后续无利用价值，这里要delete
            oriOption: 选项源文本
            essayQuestionMatch: 问答题匹配项
          }
        }
         */
    },
    // 题型匹配-智能匹配题型
    matchQuestionsAuto(question) {
      // 经过题型标志匹配，属性已大部分完整
      // 判断是否有选项源文本oriOption，先处理选择题
      let questionTypeArr = this.questionTypeArr;
      let oriOption = question.otherInfo.oriOption;
      let content = question.content;
      let answer = question.answer;
      let fillArr = content.match(this.reg.extractFill); // 填空题填空项数组，用于计算填空数

      question.questionType = oriOption? // 选择题(单选、多选)
                            answer && answer.includes(';')? questionTypeArr['多选题']: questionTypeArr['单选题']:
                          this.reg.splitTrueORFalse.test(content)? // 判断题
                            questionTypeArr['判断题']:
                          fillArr && answer && fillArr.length == answer.split('|').length? // 填空题_和答案数一致
                            questionTypeArr['填空题']:
                            questionTypeArr['问答题'];
      return question;
    },

    // 补全对象
    complete(questionsArr) {
      return questionsArr.map((question, i) => {
        // 分割题序和题目内容
        let content = question.content;
        let arr = content.split(this.reg.splitSequenceAndContent);
        if (arr.length >= 4) {
          // 切割完 ["    ", undefined, "5", "企微云平台获得企业微信推荐的应用有哪些"]
          question.otherInfo.sequence = arr[1] || arr[2]; // 字符串无需担心0
          question.content = arr[3];
        }

        // 以文字作为判断标准，跟前面代码统一，不写死questionType
        let keyName = this.getQuestionKeyName(question);

        // 题型出来了，开始补全对象
        if (keyName == '单选题' || keyName == '多选题') {
          question = this.completeChoice(question);
        } else if (keyName == '判断题') {
          question = this.completeTrueOrFalse(question);
        } else if (keyName == '填空题') {
          question.isDisorder = 0; // 填空题填空项与答案是否允许顺序不一致 1不一致，0一致（默认传0）
          // 如果评分模式未赋值，默认为系统阅卷
          question.isManual = typeof question.isManual == 'undefined'? 0: question.isManual;
          question.answer = question.answer.split('|').join('|||'); // 替换成三杠用于提交
        } else { // 问答题
          question = this.completeEssayQuestion(question);
        }

        return question;
                /*
        此时每道题对象为
        item: {
          questionType: 题目类型0判断；1单选；2多选；3问答；4填空
          content: 题目
          answer: 答案
          answerRemark: 解析
          option: {  选项
            content: 选项文本
            sort: 排序
            isAnswer: 是否为答案
          }
          isDisorder: 填空题顺序一致
          allowPic: 问答题允许上传照片作为答案
          isManual: 评分模式
          otherInfo: { 自定义星系
            row: { 题范围
              up: 上限
              down 下限
            },
            oriContent: 题目源文本，包含选项 // 如果后续无利用价值，这里要delete
            oriOption: 选项源文本
            essayQuestionMatch: 问答题匹配项
            sequence: 题序
          }
        }
         */
      });
    },
    // 补全对象-选择题
    completeChoice(question) {
      if (!question.otherInfo.oriOption) {return question;} // 没选项直接返回

      question.option = []; // 初始化
      let optionsArr = question.otherInfo.oriOption.split(/\n+/);
      let answer = question.answer? question.answer.split(';'): []; // 有答案的话，答案用;分割

      optionsArr.forEach((option, i) => {
        let arr = option.split(this.reg.splitOptionsSequence);
        // ["  A.", "A", "企微云OA：协同办公"]  [0]:源文本; [1]:分割出选项A-Z; [2]: 选项文本
        // 此处只用到[2]。选项用i和String.fromCharCode(65 + i), 不与用户提供的选项验证，避免用户错误输入选项号
        let isAnswer = answer.some(item => {return item.trim() == String.fromCharCode(65 + i);}); // 如果答案有匹配的
        question.option.push({
          content: arr[2],
          sort: i + 1,
          isAnswer: isAnswer? '1': '0'
         });
      });
      return question;
    },
    // 补全对象-判断题
    completeTrueOrFalse(question) {
      let content = question.content;
      let arr = content.split(this.reg.splitTrueORFalse);
      // ["企微云是否提供尊享版的免费试用？", "是", ""]
      if (arr.length < 2) {return question;} // 切割不出答案则返回（出现在用户使用错题型标签）
      let answerOptionContent = arr[1]; // 答案选中的判断项目
      question.answer = answerOptionContent; // 答案赋值
      question.content = arr[0];// 题目赋值
      question.option = []; // 初始化

      // 找出对应判断项  例如'正确|错误' 变成数组 ['正确', '错误']
      let nowAnswerArr = this.fillAnswer.filter(item => {
        return item.includes(answerOptionContent);
      })[0].split('|');

      // 推入选项
      nowAnswerArr.forEach((item, i) => {
        question.option.push({
          content: item,
          sort: i + 1,
          isAnswer: item == answerOptionContent? '1': '0'
        });
      })

      return question;
    },
    // 补全对象-问答题
    completeEssayQuestion(question) {
      question.allowPic = 1; // 允许考生上传照片作为答案 1允许（ 默认传1）
      // 如果评分模式未赋值，默认为人工阅卷
      question.isManual = typeof question.isManual == 'undefined'? 1: question.isManual;

      // 问答题的【答案】 => 答案解析   【匹配项】 => 答案
      // 所以如果有值的话，需要赋值到对应地方
      if (question.answer) {
        question.answerRemark = question.answer;

        // 存在otherInfo内做判断标准
        question = this.setObjectVal(question, 'otherInfo.essayQuestionAnswer', question.answer)
        delete question.answer // 先清除， 避免后续的验证内容验证多余的。 如果真的有答案再赋值
      }

      // 有匹配项则赋值
      question.answer = question.otherInfo.essayQuestionMatch? question.otherInfo.essayQuestionMatch: '';


      return question;
    },


    // 验证题型内容
    proving(questionsArr) {
      return questionsArr.map((question, i) => {
        // 以文字作为判断标准，跟前面代码统一，不写死questionType
        let keyName = this.getQuestionKeyName(question);

        let proving = {
          '单选题': this.provingChose,
          '多选题': this.provingChose,
          '判断题': this.provingTrueOrFalse,
          '填空题': this.provingFill,
          '问答题': this.provingEssayQuestion
        }
        // 题型出来了，开始验证题型内容
        let multiple = keyName == '多选题';
        question = proving[keyName](question, multiple); // 多选题需要传进去

        return question;
        /*
        有错误:
        otherInfo.warn:[
          {
            tip: '',
            grade: 0 严重警告, 1 提示警告
          }
        ]
         */
      });
    },
    // 验证题型内容-选择题
    provingChose(question, multiple) {
      // 拥有：【题目】、【选项】、【答案】、【解析】（非必填）
      // 不支持：【匹配项】

      // 公共验证有错误直接返回 无需浪费性能
      let provingMax = this.provingMax;
      question.otherInfo.errArr = []; // 初始化
      let errArr = question.otherInfo.errArr;
      let errCommon = this.provingCommon(question, ['content', 'option', 'answer']);
      if (errCommon.length) {errArr.push.apply(errArr, errCommon); return question;}
      // 如果公共验证没错误，进行下一步验证


      // 最少支持2个选项A,B，最多支持26个选项。选项根据换行符切割后需要满足2<=length && length <= 26，否则错误反馈
      // 选项长度必须大于0且不能超过500，否则错误反馈
      // 单选题答案只能有1个字母，多选题答案数不得大过于选项数，不能重复，否则错误反馈
      // 且在最大项范围内，由于跟最大项挂钩，利用new RegExp（）生成正则，内部的文本正则不匹配，错误反馈
      // 解析长度不能超过2000，否则错误反馈
      let option = question.option;
      let optionLength = option.length;
      if (optionLength < 2 || optionLength > 26) {// 最少支持2个选项A,B，最多支持26个选项。
        errArr.push({tip: 'option', grade: 0, max: 26, min: 2});
      }

      // 选项长度必须大于0且不能超过500
      if (!errArr.length || this.showAllError) {// 没错误才开始进一步验证 （如果要求全部错误展示，可以取消此if
        option.forEach((option, i) => {
          let contentLength = typeof option.content == 'string'? option.content.length: 0;
          if (contentLength == 0 || contentLength > provingMax.optionContent) { // 和设置的最大值对比
            errArr.push({tip: 'optionContent', grade: 0, max: provingMax.optionContent, min: 1});
          }
        });
      }

      // 答案在范围内
      if (!errArr.length || this.showAllError) {// 没错误才开始进一步验证 （如果要求全部错误展示，可以取消此if
        let answerArr = question.answer.split(';');

        // 验证答案数量 无答案已经在公共中验证了
        if (multiple) {
          // 答案超过选择项
          answerArr.length > optionLength && errArr.push({tip: 'answer', grade: 0, max: optionLength})

          // 答案重复
          let isRepeat = answerArr.some((nowAnswer, i, arr) => {
            return i != arr.findIndex(value => { // 相同内容坐标不等于本身，即重复了
              return value == nowAnswer;
            });
          });

          isRepeat && errArr.push({tip: 'answer', grade: 0, type: 'repeat'})
        } else {
          // 答案只能有1个
          answerArr.length > 1 && errArr.push({tip: 'answer', grade: 0, max: 1})
        }

        // 超额时需要重置为Z，避免创建正则报错
        let maxLetter = optionLength <= 26? String.fromCharCode(64 + optionLength): 'Z';
        let optionLetterReg = '^[A-'+ maxLetter + ']$'; // 正则最大匹配
        answerArr.forEach(nowAnswer => {
          if (nowAnswer.search(optionLetterReg) == -1) { // 匹配不到, 单选题答案包含了其他内容
            errArr.push({tip: 'answer', grade: 0, type: 'mixed'});
          }
        });
      }

      // 解析长度不能超过2000，否则错误反馈
      if (!errArr.length || this.showAllError) {// 没错误才开始进一步验证 （如果要求全部错误展示，可以取消此if
        let answerRemark = question.answerRemark;
        if (answerRemark && answerRemark.length > provingMax.answerRemark) {
          errArr.push({tip: 'answerRemark', grade: 0, max: provingMax.answerRemark});
        }
      }

      return question;
    },

    // 验证题型内容-判断题
    provingTrueOrFalse(question) {
      // 拥有：【题目】、【答案】、【解析】（非必填）
      // 不支持：【选项】、【匹配项】

      // 不支持是不支持选项源文本输入的，这里比较特殊，因为答案会推入option，
      // 所以如果是要做多余内容提示，应该去判断选项源文本。
      // 公共验证有错误直接返回 无需浪费性能
      let provingMax = this.provingMax;
      question.otherInfo.errArr = []; // 初始化
      let errArr = question.otherInfo.errArr;
      let errCommon = this.provingCommon(question, ['content', 'answer']);
      if (errCommon.length) {errArr.push.apply(errArr, errCommon); return question;}
      // 如果公共验证没错误，进行下一步验证

      // 不用验证答案了，判断题答案在公共验证

      // 解析长度不能超过2000，否则错误反馈
      if (!errArr.length || this.showAllError) {// 没错误才开始进一步验证 （如果要求全部错误展示，可以取消此if
        let answerRemark = question.answerRemark;
        if (answerRemark && answerRemark.length > provingMax.answerRemark) {
          errArr.push({tip: 'answerRemark', grade: 0, max: provingMax.answerRemark});
        }
      }

      return question;
    },
    // 验证题型内容-填空题
    provingFill(question) {
      // 拥有：【题目】、【答案】、【解析】（非必填）
      // 不支持：【选项】、【匹配项】

      // 公共验证有错误直接返回 无需浪费性能
      let provingMax = this.provingMax;
      question.otherInfo.errArr = []; // 初始化
      let errArr = question.otherInfo.errArr;
      let errCommon = this.provingCommon(question, ['content', 'answer']);
      if (errCommon.length) {errArr.push.apply(errArr, errCommon); return question;}
      // 如果公共验证没错误，进行下一步验证


      // 题目至少要包含一个_空，否则错误反馈 /_+/
      // 答案数利用标志|分割，答案数要和空数量一致，否则错误反馈
      // 每项答案不能超过200，总答案不能超过1000，否则错误反馈
      // 解析长度不能超过2000，否则错误反馈
      let fillArr = question.content.match(this.reg.extractFill); // 填空题填空项数组，用于计算填空数
      let answerArr = question.answer.split('|||');
      if (fillArr) {
        // 填空题_和答案数一致
        fillArr.length != answerArr.length && errArr.push({tip: 'content', grade: 0, type: 'different'})
      } else {
        errArr.push({tip: 'answer', grade: 0, type: 'lack'})
      }


      // 每项答案不能超过200
      if (!errArr.length || this.showAllError) {// 没错误才开始进一步验证 （如果要求全部错误展示，可以取消此if
        answerArr.forEach(answer => {
          answer.length > provingMax.fillItem && errArr.push({tip: 'fillItem', grade: 0, max: provingMax.fillItem})
        });
      }

      // 解析长度不能超过2000，否则错误反馈
      if (!errArr.length || this.showAllError) {// 没错误才开始进一步验证 （如果要求全部错误展示，可以取消此if
        let answerRemark = question.answerRemark;
        if (answerRemark && answerRemark.length > provingMax.answerRemark) {
          errArr.push({tip: 'answerRemark', grade: 0, max: provingMax.answerRemark});
        }
      }
      return question;
    },
    // 验证题型内容-问答题
    provingEssayQuestion(question) {
      // 拥有：【题目】、【匹配项】（系统评分时必填）(这里指answer 答案)、【答案】（非必填）(这里指answerRemark 解析)
      // 不支持：【选项】、【解析】
      // 【】内指标识 例如答案:

      // 公共验证有错误直接返回 无需浪费性能
      let provingMax = this.provingMax;
      let mustArr = ['content'];
      // 系统阅卷需要
      !question.isManual && mustArr.push.apply(mustArr, ['otherInfo.essayQuestionMatch', 'answer'])
      question.otherInfo.errArr = []; // 初始化
      let errArr = question.otherInfo.errArr;
      let errCommon = this.provingCommon(question, mustArr);
      if (errCommon.length) {errArr.push.apply(errArr, errCommon); return question;}
      // 如果公共验证没错误，进行下一步验证


      // 答案放在answerRemark上，不能超过2000，否则错误反馈
      // 匹配项总长度不能超过1000，否则错误反馈
      // 匹配项在系统评分时必填，关键字用‘;’隔开，每个关键字长度大于0且不能超过20，且不可换行（检查\n），否则错误反馈
      let answerArr = question.answer? question.answer.split(';'): [];
      answerArr.forEach(answer => {
        answer.length > provingMax.essayItem && errArr.push({tip: 'essayItem', grade: 0, max: provingMax.essayItem})
      });


      // 有匹配项时（答案）。匹配项是否有换行
      if (!errArr.length || this.showAllError) {// 没错误才开始进一步验证 （如果要求全部错误展示，可以取消此if
        !question.isManual && question.answer.includes('\n') && errArr.push({tip: 'otherInfo.essayQuestionMatch', grade: 0, type: '\\n'})
      }


      // 解析长度不能超过2000，否则错误反馈
      if (!errArr.length || this.showAllError) {// 没错误才开始进一步验证 （如果要求全部错误展示，可以取消此if
        let answerRemark = question.answerRemark;
        if (answerRemark && answerRemark.length > provingMax.answerRemark) {
          // 答案放在answerRemark上，为了方便统一提示，写成answer 不写answerRemark
          errArr.push({tip: 'answer', grade: 0, max: provingMax.answerRemark});
        }
      }
      return question;
    },
    // 验证题型内容-验证部分公共, 必填，禁项, 长度最大值
    provingCommon(question, mustArr = [], banArr = []) {
      /*
        必填项必须要有，一缺失就报错，无需继续核对了
        必填项必须验证，避免用户错误使用题型标志，部分内容缺失
        禁项可提示或不提示
      */

      // 开始验证必须项有无
      let warn = [];
      mustArr.forEach(keyName => {
        let val = this.gettObjectVal(question, keyName);
        let type = typeof val;

        // 文本为空 数组为空 未定义都是缺失
        if (type == 'undefined'
          || (type == 'string' && !val.trim().length)
          || (Array.isArray(val) && !val.length)) {
          warn.push({tip: keyName, grade: 0});
        }
      });
      // 必填项必须要有，一报错，无需继续核对了,
      // 这里是全部判断完才返回，这样缺失项都可以全部列出来给用户，如果以后有这需求的话
      // 缺失就返回，不浪费下面执行时间了
      if (warn.length) {return warn;}


      // 开始题目和答案（如果在必需项内的话）的长度
      let commonKeyName = ['content', 'answer']
      let provingMax = this.provingMax;
      commonKeyName.forEach(keyName => {
        if (!mustArr.includes(keyName)) {return;}

        let proving = provingMax[keyName];
        if(question[keyName].length > proving) {
          warn.push({tip: keyName, grade: 0, max: proving});
        }
      });
      return warn;
    },


    // 获得题型中文，可识别度高
    getQuestionKeyName(question) {
      // 以文字作为判断标准，跟前面代码统一，不写死questionType
      // 开始从item.questionType 查找对应文本
      let questionTypeArr = this.questionTypeArr;
      let questionsNameArr = Object.keys(questionTypeArr);
      let keyName = questionsNameArr.filter(key => {
        // 取得配置项中取得设置的questionType
        let questionType = questionTypeArr[key];
        if (questionType == question.questionType) { // 与question的questionType对比，相等取key值
          return true;
        }
      })[0];
      return keyName;
    },

    // 多级key设置属性 例如key: otherInfo.essayQuestionMatch
    setObjectVal(oriObjcet, key, value) {
      // 有多级的，需要特殊处理  例如key: otherInfo.essayQuestionMatch
      // nowkey => 中文 例如'匹配项'
      let nowObject = oriObjcet;
      let keyNameArr = key.split('.');
      let keyNameArrLength = keyNameArr.length;
      keyNameArr.forEach((keyName, i) => {
        if (i == keyNameArrLength - 1) {
          // 最后一级，直接赋值
          if (typeof nowObject[keyName] == 'undefined') { // 未定义才可以赋值
            nowObject[keyName] = value.trim(); // 过滤空白，避免提交时影响
          }
        } else {
          // 非最后一级，一直递进
          nowObject = nowObject[keyName]
        }
      });
      return oriObjcet;
    },

    // 多级key获取属性 例如key: otherInfo.essayQuestionMatch
    gettObjectVal(oriObjcet, key) {
      let nowObject = oriObjcet;
      let keyNameArr = key.split('.');
      keyNameArr.forEach((keyName, i) => {
        nowObject = nowObject[keyName]
      });
      return nowObject;
    },

    // 更新错误信息
    updateErrorInfoArr(questionsArr) {
      let arr = [];
      let firstErrIndex = -1;
      questionsArr.forEach((question, index)=> {
        let errArr = question.otherInfo.errArr;
        if (errArr && errArr.length) {
          if (firstErrIndex == -1) { // 只要第一个错误下标
            firstErrIndex = index;
          }
          arr.push.apply(arr, errArr);
        }
      });
      // 仓库错误首位下标设置
      this.SET_FIRSTERRINDEX(firstErrIndex);
      // 仓库错误数组数据更新
      this.UPDATE_ERRORINFOARR(arr);
    },

    // 监听子组件问题点击
    cmFocusQuestion(row, replace = false) { // 行对象， 是否替换最后换行
      this.codemirror.setCursor({line: row.up, ch:0}); // 移动光标 可以准确滚动。 可以拟补选中区域滚动不到位

      // 如果同一行 获取当行全部内容
      let upCh = 0;
      let upRow = row.up;
      if (replace) { // 要替换最后换行, 行号需要倒退一行。用于超出文本选中
        upRow = row.up - 1;
        upCh = this.codemirror.getLine(upRow).length;
      }

      // 一道题同行需要获取全部内容
      let downCh = row.up == row.down? this.codemirror.getLine(row.down).length: 0;
      this.codemirror.setSelection(
        {line: upRow, ch: upCh},
        {line: row.down, ch: downCh}
      ); // 选中题目区域
    },


    // 处理导入数据, 删除掉多余属性
    dealPostData() {
      // 复制一个  不影响旧的
      let questions = JSON.parse(JSON.stringify(this.questions));
      let questionTypeArr = this.questionTypeArr;
      questions.forEach(question=> {
        // 先去除otherInfo
        delete question.otherInfo

        let questionType = question.questionType;
        // 0判断；1单选；2多选；3问答；4填空
        if(questionType == 3 || questionType == 4) {
          delete question.option
        } else {
          // 除了填空题和问答题，其他无需answer
          delete question.answer
          delete question.isManual
        }

      })
      return questions
    },

    // 导入试题事件
    leadInto() {
      if (this.lockLeadInto) {return;} // 导入请求锁，避免同时触发多个
      this.lockLeadInto = true;

      let questions = this.dealPostData();
      if (!questions.length) {this.lockLeadInto = false;return;} // 无题目无需提交

      this._publishQuestions(questions);


    },

    // 请求-提交题库数据
    _publishQuestions(questions) {
      dataBase.loading = true;
      return new Promise((resolve, reject) => {
        this.$api.publishQuestions({
          poolId: this.poolId,
          questions: JSON.stringify(questions)
        }, (data) => {
          dataBase.loading = false;
          this.lockLeadInto = false; // 导入请求取消锁定

          if (JSON.stringify(data) == '{}') {
            dataBase.alert('导入结果', `成功导入${this.questionsLength}道试题`,
              () => {
              this.$router.back();
              resolve(data);
            }, '查看试题', true,
              () => {
                this.clearContent();
                resolve(data);
              }, '继续导入')
          } else {
            dataBase.alert('提示', data);
          }

        });
      });
    },

    // 清除输入区文本
    clearContent() {
      this.content = ''; // 清空输入文本
    },
  },
}
</script>
<style lang="scss" scoped>
.onlineEditing_content {
  height: 600px;

  .onlineEditing_codemirror {
    border: 1px solid #E5E5E5;
    z-index: 0;
    & /deep/ {
      .CodeMirror-wrap {
        width: 568px;
        height: 598px;
      }
      pre {
        padding: 0 6px 0 16px;
        font-family: 'Microsoft Yahei','simsun','arial','tahoma';
      }
      .CodeMirror-placeholder {
        color: #D5D5D5;
      }
      .CodeMirror-scroll, .CodeMirror-gutters {
        background-color: #FAFAFA;
      }
      .CodeMirror-selected {
        background: #ddd;
      }
    }
  }

  .onlineEditing_preview {
    border: 1px solid #E5E5E5;
    border-left: none;
  }
}
</style>
