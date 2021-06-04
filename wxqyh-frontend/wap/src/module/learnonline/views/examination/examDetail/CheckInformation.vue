<template>
  <div class="wrap qwui-lean_checkInformation" :style="{ minHeight: winHeight }">
    <!-- 信息展示  -->
    <div class="info">
      <div class="exam_name">{{examName}}</div>
      <div class="info_tips">{{info_tips}}</div>
    </div>

    <!-- 用户输入项 -->
    <div class="user_information">
      <div v-for="item in openInfoList" class="information_item">
        <div><span class="isMust" v-if="item.isMust">*</span><span>{{item.content}}</span></div>
        <input
          class="information_input"
          type="text"
          :name="item.name"
          :placeholder="item.placeholder"
          v-focus="item.focus"
          v-model="item.userInformation"
          @input="inputInformation(item)"
          @focus="inputInformation(item)"
        >
      </div>
    </div>

    <!-- 按钮 -->
    <div class="qwui-tips button_fixed qwui-nav_footer_fix">
      <div class="qwui-flexbox button_box">
        <!-- 取消按钮 -->
        <div class="qwui-flexItem cancel_button moreButton"
          @click="cancel"
        >{{$t('i18n.cancel')}}</div>

        <!-- 确定按钮 -->
        <div class="qwui-flexItem confirm_button"
          @click="confirm"
        >{{$t('i18n.confirm')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getExternalCheckInformation, saveExternalInfo, getAnswerInfo } from "../../../api/getData"; // 请求接口
import wx from 'weixin-js-sdk'; // 微信操作

export default {
  name: 'QwCheckInformation',
  data(){
    return {
      examId: '', // 当前考试的id
      status: 0, // 1为进入考试 0为查询结果
      examName: sessionStorage.getItem('learn_examName'), // 试卷名称
      isAgain: 0, // 是否再次考试
      openInfoList: [// 填空数据项 userInformation用来存用户输入内容
        { content: this.$t('i18n.lastName'), isMust: 1, userInformation: '', placeholder: this.$t('i18n.inputName'), name:'answerItemDesVO.personName', focus: false},
        { content: this.$t('i18n.mobile'), isMust: 1, userInformation: '', placeholder: this.$t('i18n.inputMobile'), name: 'answerItemDesVO.mobile', focus: false}
      ],
    };
  },
  computed: {
    // 屏幕高度
    winHeight() {
      return window.innerHeight + 'px';
    },
    // 信息提示
    info_tips() {
      return this.status? this.$t('i18n.openExamTips'): this.$t('i18n.openResultTips');
    },
    // 手机号
    mobile: {
      get() {
        return this.openInfoList[1].userInformation;
      },
      set(value) {
        this.openInfoList[1].userInformation = value;
      }
    }
  },
  methods:{
    // 确定按钮
    confirm() {
      if (this.cherkInfo()) { // 验证成功
        // 1为进入考试 0 为查看结果
        this.status? this._saveExternalInfo(): this._getAnswerInfo();
      }
    },

    // 取消按钮
    cancel() {
      this.$router.back();
    },

    // 进入考试页面
    enterExam(answerId) {
      this.$router.push({name: 'open_exam_write', params: {
        id: this.examId,
        answerId: answerId
      }});
    },

    // 进入查询结果页面
    enterResult(answerId) {
      this.$router.push({name: 'open_exam_result', params: {
        id: this.examId, 
        answerId: answerId
      }});
    },

    // 检验表单合格、完整
    cherkInfo() {
      let self = this;
      let missArr = this.openInfoList.filter((item, index) => {
        return item.isMust && !item.userInformation? true: false; // 必填 但没数据,抽取出来
      });

      // 验证是否有未填项目
      if (missArr.length) {
        let firstMiss = missArr[0];

        _.alert(this.$t('i18n.notice'), this.$t('i18n.pleaseEnter') + firstMiss.content, {
          primaryBtn:{
            name: this.$t('i18n.confirm'),
            callBack() {
              firstMiss.focus = true; // 确定完自动聚焦
            }
          }, // 确认按钮
          defaultBtn:{name:'', callBack: null}//主操作按钮
        });
        return false;
      }

      // 验证手机是否正确
      if(!(/^[1][3,4,5,7,8][0-9]{9}$/).test(this.mobile)){
        _.alert(this.$t('i18n.notice'), this.$t('i18n.callError'), {
          primaryBtn:{
            name: this.$t('i18n.confirm'),
            callBack() {
              self.openInfoList[1].focus = true; // 确定完自动聚焦
            }
          }, // 确认按钮
          defaultBtn:{name:'', callBack: null}//主操作按钮
        });
        return false;
      }
      return true;
    },

    // 用户填写或聚焦输入框
    inputInformation(item) {
      item.focus = false;
    },

    // 返回处理完表单数据,用于发送
    processingData() {
      let postData = {examId: this.examId, isAgain: this.isAgain};
      let openInfoList = this.openInfoList;
      let arrLength = openInfoList.length;
      for (let i = 0; i < arrLength; i++) {
        let nowData = openInfoList[i];
        postData[nowData.name] = nowData.userInformation;
      }
      return postData;
    },

    // 获取外部考试检验填写项数据
    _getExternalCheckInformation() {
      return new Promise((resolve, reject) => {
        getExternalCheckInformation({examId: this.examId}, data => {
          let dataOpenInfoList = data.openInfoList;
          let arrLength = dataOpenInfoList.length;
          for (let i = 0; i < arrLength; i++) {
            // 初始化数据
            let nowData = dataOpenInfoList[i];
            nowData.placeholder = ''; // 默认显示文字
            nowData.userInformation = ''; // 用户填写内容
            nowData.focus = false; // 自动聚焦，在input事件关闭
            nowData.name = 'answerItemDesVO.item' + (i + 1);
          }
          this.openInfoList.push.apply(this.openInfoList, dataOpenInfoList);
          resolve();
        });
      });
    },

    // 提交外部考试用户信息
    _saveExternalInfo() {
      return new Promise((resolve, reject) => {
        let postData = this.processingData();
        // 开始提交
        saveExternalInfo(postData, data => {
          let isExit = data.isExit;
          let self = this;
          if (isExit=='1' && !this.isAgain) { // 如果考过,需要询问是否再考一次
            _.alert(this.$t('i18n.notice'), this.$t('i18n.papersSubmitted'), {
              primaryBtn:{ // 查看结果按钮
                name: this.$t('i18n.watchResult'),
                callBack() { // 进入查看结果页面;
                  self.enterResult(data.histroyAnswerId)
                }
              },
              defaultBtn:{// 再考一次按钮
                name: this.$t('i18n.examAgain'),
                callBack() {
                  self.isAgain = 1;
                  self._saveExternalInfo().then(() => {resolve();}); // 重新请求
                  return;
                }
              }
            });

          } else { // 没考过, 进入考试
            this.enterExam(data.answerId);
          }
          resolve();

        }, err => {// 取消默认的错误提示, 因为350013需要更换按钮 进行对应操作
          let self = this;
          if(err.code == '350013'){
            _.alert(this.$t('i18n.notice'), this.$t('i18n.papersSubmitted'), {
              primaryBtn:{ // 查看结果
                name: this.$t('i18n.watchResult'),
                callBack() {
                  self.enterResult(data.histroyAnswerId);
                }
              },
              defaultBtn:{
                name: this.$t('i18n.cancel'),
                callBack: null
              }
            });
          } else { // 其他错误
            _.alert(this.$t('i18n.notice'), err.desc, {
              primaryBtn:{// 确认按钮
                name: this.$t('i18n.confirm'),
                callBack: null
              },
              defaultBtn:{
                name: '',
                callBack: null
              }
            });
          }
        }, false);
      });
    },

    // 核对用户身份以查询结果
    _getAnswerInfo() {
      return new Promise((resolve, reject) => {
        let postData = this.processingData();
        getAnswerInfo(postData, data => {
          this.enterResult(data.answerId)
          resolve();
        }, reject, false);
      }).catch(err => {
        let self = this;
        if (err.code == '350206') {
          _.alert(this.$t('i18n.notice'), this.$t('i18n.firstExamTip'), {
            primaryBtn:{
              name: this.$t('i18n.confirm'),
              callBack() { // 确认按钮
                // 进入考试页面, 传手机号过去
                self.$router.replace({name: 'check_information', params: {id: self.examId, status: 1}, query: {mobile: self.mobile}});
                location.reload(); // 同个路由强制刷新(兼容ios微信)
              }
            },
            defaultBtn:{ // 取消按钮
              name: this.$t('i18n.cancel'),
              callBack() {
                self.cancel();
              }
            }
          });

        } else {
          _.alert(this.$t('i18n.notice'), err.desc, {
            primaryBtn:{
              name: this.$t('i18n.confirm'),
              callBack: null
            },
            defaultBtn:{ // 取消按钮
              name: '',
              callBack: null
            }
          });
        }
      });
    }
  },
  created() {
    this.examId = this.$route.params.id;
    this.status = parseInt(this.$route.params.status);
    this.mobile = this.$route.query.mobile? this.$route.query.mobile: '';

    if (this.status) {// 1为进入考试 0为查询结果
      this._getExternalCheckInformation();
    } else {
      this.openInfoList[0].name = 'personName'; // 查询结果的name不同, 开始初始化
      this.openInfoList[1].name = 'mobile';

      dataBase.isShow = true;
    }
  },
};

</script>

<style lang="scss" scoped>
@import '../../../static/css/mixin.scss';

.qwui-lean_checkInformation {
  padding-bottom: 60px;
  background: #fff;
  overflow-y: scroll;

  .info {
    padding: 25px 10px;
    text-align: center;
    line-height: 24px;

    .exam_name {
      color: #333;
      font-size: 20px;
    }
    .info_tips {
      color: #999;
      font-size: 14px;
    }
  }

  .user_information {
    padding: 0 15px;
    overflow: hidden;

    .information_item {
      margin-bottom: 10px;
      color: #333;
      font-size: 15px;
      line-height: 26px;

      .isMust {
        margin-right: 5px;
        color: #fa3232;
        font-size: 11px;
      }
      .information_input {
        padding: 15px 10px;
        width: 100%;
        height: 45px;
        border: 1px solid #ccc;
        color: #666;
        font-size: 15px;
        outline: none;
        box-sizing: border-box;
      }

    }
  }

  .button_fixed {
    position: fixed;
    display: block;
    padding-top: 0;
    bottom: 0;
    width: 100%;
    background-color: transparent;

    .button_box {
      padding: 8px 15px;
      height: 44px;
      line-height: 44px;
      font-size: 17px;
      text-align: center;
      background: #fff;
      cursor: pointer;
      user-select: none;
      @include border-t-1px(#DDD);

      .confirm_button {
        color: #fff;
        background: #45A8F5;
        border-radius: 5px;
        cursor: pointer;
      }
      .goon_button {
        background: #f56262;
      }
      .resit_button {
        color: #666;
        line-height: 42px;
        background: #fff;
        border: 1px #878787 solid;
      }
      .ban_button {
        background: #ccc;
      }

      .cancel_button {
        color: #45a8f5;
        border: 1px #45a8f5 solid;
        border-radius: 5px;
        cursor: pointer;
      }
      .moreButton {
        margin-right: 14px;
      }
    }
  }
}

</style>
