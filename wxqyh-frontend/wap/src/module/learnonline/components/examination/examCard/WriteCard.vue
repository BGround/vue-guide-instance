<template>
  <div class="qwui-lean_write_card">

    <!-- 颜色进度条 -->
    <div class="progress_bar_wrap"><div class="progress_bar" :style="progressWidth"></div></div>

    <!-- 题目卡片 -->
    <div class="write_card">

      <!-- 题目 -->
      <div class="question">
        <div class="subject_wrap">
          <apply-status :applystatus="comApplyStatus"></apply-status>
          <span class="subject" v-html="subject"></span>
        </div>

        <!-- 题目图片 -->
        <div class="picture_list clearfix" v-show="nowQuestion.hasPic">
          <div
            v-for="(picItem, index) in nowQuestion.picList"
            class="picture_item"
            :key="index">
            <img
              v-picfix="picItem.picPath"
              class="picture previewImages"
              :src="completeImgUrl(picItem.picPath)"
              @click="preview(picItem.picPath)"
            >
          </div>
        </div>
      </div>

      <!-- 考生答题区 -->
      <div class="examinee_answer">
        <!-- 单选题/多选题/判断题 -->
        <div  class="question_choice"
              v-show="nowQuestion.questionType != 3
              && nowQuestion.questionType != 4"
        >

          <!-- 选项 -->
          <div
            v-for="(item,index) in nowQuestion.optionList"
            class="option_item qwui-flexbox"
            :class="selectedClass(item)"
            :key="index"
            @click="selectClick(item)"
          >
            <!-- 选项题序字母 -->
            <span class="option_letter">
              {{String.fromCharCode(65 + index)}}
            </span>

            <!-- 选项 -->
            <div class="option qwui-flexItem">
              <!-- 选项文本 -->
              <div class="option_content">{{item.content}}</div>
              <!-- 选项图片 -->
              <div class="picture_list clearfix">
                <div
                  v-for="(picItem, index) in item.picList"
                  class="picture_item"
                  :key="index">
                  <img
                    v-picfix="picItem.picPath"
                    class="picture previewImages"
                    :src="completeImgUrl(picItem.picPath)"
                    @click.stop="preview(picItem.picPath)"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 考生填空题 -->
        <div class="fill_question" v-if="nowQuestion.questionType==4">
          <div class="fill_item" v-for="(item,index) in examineeAnswer">
            <div class="fill_bable">填空项{{index+1}}</div>
            <input
              class="fill_input"
              type="text"
              v-model="examineeAnswer[index]"
              @blur="saveCache"
              @keyup="fillKeyUp(index)"
            >
          </div>
        </div>

        <!-- 考生问答题 -->
        <div class="essay_question" v-if="nowQuestion.questionType==3">
          <textarea
            class="essay_question_text"
            ref="essayQuestion"
            v-model="examineeAnswer.content"
            @blur="saveCache"
            @keyup="textareaKeyUp"
          ></textarea>
          <div class="essay_length_lable">
            {{examineeAnswer.content.length}}/{{maxLength}}
          </div>

          <!-- 上传图片组件集 -->
          <div v-if="nowQuestion.allowPic" class="upload_pictures">
            <!-- 上传图片列表配套组件  -->
            <add-img-list
              class="img_list"
              v-bind="addImg"
              @handleDeleteImage="handleDeleteImage"
            ></add-img-list>

            <!-- 上传图片组件  -->
            <add-img
              v-bind="addImg"
              ref="addImg"
              @updateImageList="showMsgFromAddImg"
            ></add-img>
          </div>
        </div>
      </div>
    </div>
    <!--图片预览组件-->
    <preview-images :useWxPreview="false"></preview-images>
  </div>
</template>

<script>
import ApplyStatus from '@/components/part/apply_status'; // 标签状态公共组件
import EventBus from '@/utils/eventBus';
import AddImg from '@/components/add/upload/add_img'; // 上传图片组件
import AddImgList from '@/components/add/upload/imgList'; // 上传图片列表配套组件
import PreviewImages from "@/components/base/previewImages"; // 图片预览组件

export default {
  name: 'QwWriteCard',
  components:{
    ApplyStatus,
    PreviewImages,
    AddImg,
    AddImgList,
  },
  props: {
    progress: { // 进度
      type: Number,
      required: true
    },
    questionList: { // 题目列表
      type: Array,
      required: true
    },
    nowIndex: { // 当前题目下标
      type: Number,
      required: true
    }

  },
  data(){
    return {
      /* 公共组件配置项 */
      applyStatus: {
        common: {
          class: 'status_blue', // 标签颜色
          active: true // false为默认，true加了"padding:3px"会大一些
        },
        name: [this.$t('i18n.trueFalse'), this.$t('i18n.singleChoice'), this.$t('i18n.multipleChoice'), this.$t('i18n.essayQuestion'), this.$t('i18n.completion')], // 标签内容 0-判断题，1-单选题，2-多选题，3-问答题 4-填空题
      },

      addImgCommon: { // 上传图片
        limit: 6,
        disabled: false,
        listType: 'picture-card', // 图片行内 不换行
        agent: 'examination',
        deleteImage: {orderId: ''},
      },

      /* 数据 */
      maxLength: 1000, // 问答题考生回答最大长度
    };
  },
  computed: {
    // 公共组件标签配置
    comApplyStatus() {
      let applyStatus = this.applyStatus;
      return Object.assign({}, applyStatus.common, {name: applyStatus.name[this.nowQuestion.questionType]});
    },
    // 当前题目
    nowQuestion() {
      let questionList = this.questionList;
      let nowIndex = this.nowIndex;
      let nowQuestion = questionList.length > nowIndex? questionList[nowIndex]: {};
      return nowQuestion; // {}此时还在请求数据）
    },
    // 考生答案
    examineeAnswer() {
      return this.nowQuestion.examineeAnswer;
    },
    // 问答题考生上传的图片
    examineePicList() {
      // 让公共组件渲染当前列表
      return this.examineeAnswer.imgList;
    },
    // 公共组件上次图片配置
    addImg() {
      let camera = this.nowQuestion.photoSet? ['album', 'camera']: ['camera']; // 是否允许上传相册照片
      return Object.assign({
        imageList: this.examineePicList, // 编辑/复制等存在的原数据
        camera: camera
      }, this.addImgCommon);
    },
    // 图片预览数组
    imgArr() {
      let nowQuestion = this.nowQuestion;
      let picList = [];
      let optionList = nowQuestion.optionList? nowQuestion.optionList: [];
      let optionListLength = optionList.length;

      // 推入问题的图片
      nowQuestion.picList && picList.push.apply(picList, nowQuestion.picList)

      // 推入选项图片
      for (let i = 0; i < optionListLength; i++) {
        let nowOption = optionList[i];

        let nowOptionPic =  nowOption.picList? nowOption.picList: [];
        picList.push.apply(picList, nowOptionPic);
      }

      return picList;
    },
    // 题目
    subject() { // 有填空题需要代入答案
      let content = this.nowQuestion.content;
      content = content && this.processingHtml(content); // 换行
      return content? content + this.$t('i18n.leftParenthesis') + parseFloat(this.nowQuestion.setScore) + this.$t('i18n.score') + this.$t('i18n.rightParenthesis'): '';
    },
    // 进度条宽度
    progressWidth() {
      let progress = this.progress < 0 || this.progress > 1? 0: this.progress;
      return { width: progress * 100 + '%'  };
    },
  },
  watch: {
    // 考生是否已答题，在此响应更改状态.hasAnswer
    examineeAnswer: {
      handler(value, oldValue) {
        let examineeAnswer = value;
        if (!examineeAnswer) { return ;}

        let questionType = this.nowQuestion.questionType;
        // 填空题数组是有长度，需要判断是否有内容
        let fillHasAnswer = false;
        if (questionType == 4) {
          let length = examineeAnswer.length;
          for (let j = 0; j < length; j++) {
            if (examineeAnswer[j] != '') {
              fillHasAnswer = true;
            }
          }
        }
        let hasAnswer = Array.isArray(examineeAnswer)? // 数组要有长度 非对象要有内容
                          questionType == 4? fillHasAnswer:
                          examineeAnswer.length? true: false:
                        examineeAnswer.content ||
                        examineeAnswer.imgList.length? true: false;
        this.nowQuestion.hasAnswer = hasAnswer;
      },
      deep: true // 监听到属性
    },
  },
  methods:{
    // 该选项是否被选中样式
    selectedClass(option) {
      let isSelected = this.examineeAnswer.includes(option.id);
      return { option_select: isSelected };
    },

    // 选择题点击事件
    selectClick(option) {
      let isMutipleSelect = this.nowQuestion.questionType == 2? true: false;
      let examineeAnswer = this.examineeAnswer;
      if (isMutipleSelect) { // 多选题 有则移除，无则添加
        let index = examineeAnswer.indexOf(option.id);
        if (index > -1) {
          examineeAnswer.splice(index, 1);
        } else {
          examineeAnswer.push(option.id);
        }

      } else { // 判断题 单选题
        examineeAnswer.length && examineeAnswer.pop()
        examineeAnswer.push(option.id);
      }

      // 存缓存
      this.saveCache()
    },

    // 过滤emoji表情
    filterEmoji(str) {
      let regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;

      return regStr.test(str)? str.replace(regStr, ''): str;
    },

    // 问答题输入验证
    textareaKeyUp() {
      let examineeAnswer = this.examineeAnswer;
      // 过滤emoji表情
      examineeAnswer.content = this.filterEmoji(examineeAnswer.content);

      // 验证长度是否超过
      if (examineeAnswer.content.length > this.maxLength) {
        let overLength = examineeAnswer.content.length;
        // 超过长度切除
        examineeAnswer.content = examineeAnswer.content.slice(0, this.maxLength);
        // 触发失去焦点事件
        this.$refs.essayQuestion.blur();

        _.alert(this.$t('i18n.notice'), `长度过长:${overLength}/${this.maxLength}`, {
          primaryBtn:{ name: this.$t('i18n.confirm'), callBack: null}, // 确认按钮
          defaultBtn:{name:'', callBack: null}//主操作按钮
        });
      }
    },

    // 填空题输入验证
    fillKeyUp(index) {
      let examineeAnswer = this.examineeAnswer;
      examineeAnswer[index] = this.filterEmoji(examineeAnswer[index]);


       if (examineeAnswer[index].length > this.maxLength) {
        // 数组内不能通过直接赋值，否则视图不更新。
        examineeAnswer.splice(index, 1, examineeAnswer[index].slice(0, this.maxLength));

        _.alert(this.$t('i18n.notice'), `填空项总长度过长`, {
          primaryBtn:{ name: this.$t('i18n.confirm'), callBack: null}, // 确认按钮
          defaultBtn:{name:'', callBack: null}//主操作按钮
        });
       }
    },

    // 考生操作存缓存
    saveCache() {
      this.$emit('saveCache');
    },

    // 文本处理HTML(用于v-html)
    processingHtml(str) {
      let eleDiv = document.createElement('div');
      eleDiv.appendChild(document.createTextNode(
        str.replace(/&nbsp;/g,'').replace(/<br>/g,'')
      )); // jsp页面说是兼容老代码，此处保留，避免此处是修bug后的代码，删除后出现bug
      let dealStr = eleDiv.innerHTML;

      return dealStr? dealStr.replace(/\n+/g, '<br/>').replace(/\u3000/g,'  ').replace(/\u0020/g,' '): dealStr;
    },

    // 图片链接处理
    completeImgUrl(url) {
      return _.filterCompressURL(url)
    },

    //预览图片课件
    preview(picPath) {
      EventBus.$emit('previewImages', _.filterCompressURL(picPath), this.imgArr);
    },

    // 删除上传图片事件
    handleDeleteImage(item) {
      this.addImgCommon.deleteImage = item;
    },

    // 上传/删除图片事件
    showMsgFromAddImg(arr) {
      if (!_.isWeChatApp()) { // 仅网页版需要上传完清除input，
        // 目的是实现pc也要可上传同张图，产品说pc也要可上传同张图，但公共又不允许
        let input = this.$refs.addImg && this.$refs.addImg.$refs.input;
        if (input) {
          input.value = '';
        }

      } else {
        // 微信端  公共组件只可设置一次最大上传数量，超过数量应推掉
        let examineePicList = this.examineePicList;
        while(examineePicList.length > 6) {
          examineePicList.pop();
        }
      }
    },
  },
  created() {
  }
};

</script>

<style lang="scss" scoped>

.qwui-lean_write_card {
  overflow: hidden;

  .progress_bar_wrap{
    height: 3px;
    background: linear-gradient(to bottom, #E1E3E6 0, #E1E3E6 2px, transparent 2px);

    .progress_bar {
      height: 100%;
      background: #45A8F5;
    }
  }

  .write_card {
    padding-top: 12px;

    /* 通用图片样式 */
    .picture_list {
      .picture_item {
        position: relative;
        float: left;
        margin: 5px 0;
        width: 70px;
        height: 70px;
        overflow: hidden;
        &:not(:last-of-type) {
          margin-right: 12px;
        }

        .picture {
          width: 100%;
          height: 100%;
        }
      }
    }

    .question {
      padding: 0 15px;

      .picture_list {
        margin-bottom: 20px;
      }

      .subject_wrap {
        margin-bottom: 12px;

        .subject {
          font-size: 16px;
          color: #333;
          vertical-align: middle;
          word-break: break-word;

          /* 填空答案下划线 */
          & /deep/ .fill_up {
            text-decoration: underline;
          }
        }

        /* 更换下标签状态公共组件的蓝色 */
        & /deep/ .qwui-apply_status.status_blue {
          border: 1px solid #45A8F5;
          color: #45A8F5;
        }
        /* 更换下标签状态公共组件激活不要margin */
        & /deep/ .qwui-apply_status.active {
          margin:0 8px 0 0;
        }
      }
    }

    /* 考生答题/答案区 */
    .examinee_answer {
      /* 单选题 */
      .question_choice {

        .option_item {
          padding: 8px 15px;
          cursor: pointer;

          .option_letter {
            display: inline-block;
            width: 22px;
            height: 22px;
            font-size: 14px;
            font-family: arial,sans-serif;
            color: #999;
            line-height: 20px;
            text-align: center;
            border: 1px #999 solid;
            border-radius: 50%;
            box-sizing: border-box;
            overflow: hidden;
          }
          .option {
            margin-left: 12px;
            font-size: 14px;
            color: #333;
            .option_content {
              word-break: break-word;
            }
          }
        }

        .option_select {
          background-color: #f5f5f5;

          .option_letter {
            color: #fff;
            border-color: #45A8F5;
            background: #45A8F5;
          }
        }
      }

      /* 填空题 */
      .fill_question {
        padding: 0 15px;

        .fill_item {
          margin-bottom: 5px;

          .fill_bable {
              color: #333;
              font-size: 15px;
              line-height: 26px;
          }
          .fill_input {
            padding: 15px 10px;
            width: 100%;
            height: 45px;
            border: 1px solid #ccc;
            color: #666;
            font-size: 15px;
            outline: none;
            box-sizing: border-box;
            -webkit-appearance: none;
          }
        }
      }

      /* 问答题 */
      .essay_question {
         margin-bottom: 12px;
         padding: 0 15px;

        .essay_question_text {
          padding: 10px;
          width: 100%;
          min-height: 145px;
          color: #333;
          font-size: 14px;
          line-height: 20px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 4px;
          box-sizing: border-box;
          outline: none;
        }
        .essay_length_lable {
          color: #999;
          text-align: right;
        }
        .upload_pictures {

          .img_list {
            vertical-align: top;
          }
        }
      }
    }
  }
}

</style>
