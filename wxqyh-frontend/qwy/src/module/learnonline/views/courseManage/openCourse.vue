<template>
  <div class="learn_openCourse">
    <back-bar @click="goBack">
      {{ title }}
    </back-bar>
    <div class="openCourse-mainWrap">
      <!--课程内容-->
      <div class="main-content">
        <div class="content-title">课程内容</div>
        <div class="content-line"></div>
        <div class="content-info">
          <!--<img class="info_img" src="">-->
          <span class="info_img img_none"></span>
          <p class="info_text" :title="content">
            {{ content }}
          </p>
          <div class="info_btn">
            <qw-button type="primary">更换课程</qw-button>
          </div>
        </div>
      </div>
      <!--课程设置-->
      <div class="main-setting">
        <div class="content-title">设置</div>
        <div class="content-line"></div>
        <!--选人组件-->
        <qw-choose-people
          :objConfig="formData.properties.examPeople"
          :objVal="formData.value.examPeople"
          :objKey="['examPeople']"
          :examPeopleObj="formData.value.examPeopleObj"
          :EVENT_BUS="EVENT_BUS"
        >
          <span slot="generalUser">【团队版】可选25名学员。</span>
          <span slot="vipUser">【尊享版】可选1万名学员</span>
        </qw-choose-people>
        <qw-vertical-radio
          :objConfig="formData.properties.getScoreType"
          :objVal="formData.value.getScoreType"
          :objKey="['getScoreType']"
          :EVENT_BUS="EVENT_BUS"
        ></qw-vertical-radio>
        <!--分割线-->
        <div class="qwui_divideLine"></div>
        <!--学时防作弊-->
        <qw-checkbox
          :objConfig="formData.properties.cheatOpen"
          :objVal="formData.value.cheatOpen"
          :objKey="['cheatOpen']"
          :EVENT_BUS="EVENT_BUS"
        >
          <span class="qwui-input_description ml10">
           开启后，可防止学员通过挂机的方式进行学时作弊
          <span class="qwui-vipIcon function" @click="$goBuyVip"></span>
        </span>
        </qw-checkbox>
        <!--防作弊时间-->
        <transition name="transition-drop">
          <qw-input
            v-if="formData.value.cheatOpen"
            :objConfig="formData.properties.cheatTime"
            :objVal="formData.value.cheatTime"
            :objKey="['cheatTime']"
            :EVENT_BUS="EVENT_BUS"
          >
            <div class="qwui-input_tailWrap" slot="description">
              <span class="qwui-input_head">学员在</span>
            </div>
            <div class="qwui-input_tailWrap">
              <span class="qwui-input_unit">分钟内对手机屏幕无任何操作，将暂停计算学时，并进行提示</span>
              <span class="qwui-input_unit unit_orange" @click="showCase">查看示例</span>
            </div>
          </qw-input>
        </transition>
        <!--分割线-->
        <div class="qwui_divideLine"></div>
        <!--学习提醒-->
        <qw-checkbox
          :objConfig="formData.properties.remindLearnStart"
          :objVal="formData.value.remindLearnStart"
          :objKey="['remindLearnStart']"
          :EVENT_BUS="EVENT_BUS"
        ></qw-checkbox>
        <!--学习截至提醒-->
        <qw-checkbox
          :objConfig="formData.properties.remindLearnEnd"
          :objVal="formData.value.remindLearnEnd"
          :objKey="['remindLearnEnd']"
          :EVENT_BUS="EVENT_BUS"
        ></qw-checkbox>
        <!--课程截至前几天-->
        <transition name="transition-drop">
          <qw-input
            v-if="formData.value.remindLearnEnd"
            :objConfig="formData.properties.beforeLearnEnd"
            :objVal="formData.value.beforeLearnEnd"
            :objKey="['beforeLearnEnd']"
            :EVENT_BUS="EVENT_BUS"
          >
            <div class="qwui-input_tailWrap" slot="description">
              <span class="qwui-input_head">课程截止前</span>
            </div>
            <div class="qwui-input_tailWrap">
              <span class="qwui-input_unit">天</span>
            </div>
          </qw-input>
        </transition>
      </div>
    </div>
    <!--底部操作按钮-->
    <div class="openCourse-submitBtn">
      <qw-button type="primary">保存并上线</qw-button>
      <qw-button plain>保存</qw-button>
    </div>
    <!--查看示例-->
    <cheat-case
      v-bind:show.sync="showCheatCase"
    ></cheat-case>
  </div>
</template>

<script>
import { createEventBus } from 'learn/utils/index'
import backBar from 'learn/components/base/backBar'
import qwButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import qwChoosePeople from 'learn/components/learn/qwChoosePeople'
import qwVerticalRadio from 'learn/components/learn/qwVerticalRadio'
import qwCheckbox from 'learn/components/learn/qwCheckbox'
import qwInput from 'learn/components/learn/qwInput'
import cheatCase from 'learn/components/learn/cheatCase'
import { mapMutations } from 'vuex'

export default {
  name: 'openCourse',

  components: {
    backBar,
    qwButton,
    qwChoosePeople,
    qwVerticalRadio,
    qwCheckbox,
    qwInput,
    cheatCase,
  },

  data() {
    return {
      "title": '开设必学课',
      "content": '演讲中的语言魅力演讲中的语言魅力演讲中的语言魅力演讲中的语言魅力演讲中的语言魅语言魅力演讲中的语言魅力演讲中的语言魅',
      "EVENT_BUS": createEventBus(),
      "formData": {
        "properties": {
          //考试对象
          "examPeople": {
            "required": true,
            "title": "学习对象",
            "maxUser": this.$isLearnVipGold ? 10000 : this.$isLearnVipSilver ? 500 : 25,
            //选项
            "options": [
              {
                "label": "所有人"
              },
              {
                "label": "特定对象"
              },
            ],
          },
          //学分获得选项
          "getScoreType": {
            "title": "学分获得选项",
            //选项
            "options": [
              {
                "label": "学习完成课程的所有章节即获得总学分"
              },
              {
                "label": "所有考试通过后才获得总学分"
              },
              {
                "label": "不启用学分"
              },
            ],
          },
          //学时防作弊
          "cheatOpen": {
            //是否显示小红点
            "required": false,
            "title": "学时防作弊",
            //选项
            "options": [
              {
                "disabled": !this.$isLearnVipGold,
                "label": "开启"
              },
            ],
          },
          //防作弊时间
          "cheatTime": {
            //是否显示小红点
            "required": false,
            "title": "防作弊时间",
            "dependProperty": false,
            "hasBorther": false,
            //类型
            "type": "number",
            //长度
            "width": "100",
            //最小值
            "min": 1,
            //失焦校验规则
            "rules": {
              "required": true,
              "message": "防作弊时间不能为空"
            },
          },
          //学习提醒
          "remindLearnStart": {
            //是否显示小红点
            "required": false,
            "title": "学习提醒",
            //选项
            "options": [
              {
                "label": "上线时发送通知消息"
              },
            ],
          },
          //学习提醒
          "remindLearnEnd": {
            //是否显示小红点
            "required": false,
            "dependProperty": true,
            "hasBorther": true,
            //选项
            "options": [
              {
                "label": "开启学习截止提醒"
              },
            ],
          },
          //课程截止前几天
          "beforeLearnEnd": {
            //是否显示小红点
            "required": false,
            "dependProperty": true,
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
              "message": "课程截止前提醒时间不能为空"
            },
          },
        },
        "value": {
          "examPeople": "所有人",
          "examPeopleObj": {
            "defaultDepts": [],
            "defaultTags": [],
            "defaultUsers": [],
            "defaultPosition": [],
          },
          "getScoreType": "学习完成课程的所有章节即获得总学分",
          "cheatOpen": false,
          "cheatTime": 5,
          "remindLearnStart": false,
          "remindLearnEnd": false,
          "beforeLearnEnd": 0,
        },
      },
      "fields": [],
      "showCheatCase": false
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
  },

  methods: {
    ...mapMutations('app', ['SET_HIDDENSCROLL']),
    goBack() {
      console.log(1111111111)
    },
    setFormData(payload) {
      const { key, value } = payload;
      //重置学时防作弊时间为5
      if(key == 'cheatOpen') {
        this.formData.value.cheatTime = 5;
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
    showCase() {
      this.SET_HIDDENSCROLL(true);
      this.showCheatCase = true;
    }
  },

}
</script>

<style lang="scss" scoped>
  @import "learn/style/config.scss";
  .learn_openCourse {
    background-color: $greyBackground;
    .openCourse-mainWrap {
      width: 1200px;
      margin: 20px auto 40px;
      .content-title {
        height: 20px;
        line-height: 20px;
        padding-left: 10px;
        margin-top: 30px;
        font-size: 18px;
        color: $blackColor;
        border-left: 4px solid $orangeColor;
      }
      .content-line {
        margin-top: 15px;
        border-bottom: 1px solid #E7E7E7;
      }
      .main-content {
        height: 386px;
        padding: 0 130px;
        background-color: $whiteBackground;
        overflow: hidden;
        .content-info {
          margin-top: 30px;
          .info_img {
            display: inline-block;
            float: left;
            width: 450px;
            height: 250px;
            vertical-align: middle;
            &.img_none {
              background: #e5e5e5 url(~assets/images/ic_courseimg.png) center no-repeat;
            }
          }
          .info_text {
            float: right;
            width: 440px;
            line-height: 32px;
            margin-right: 25px;
            font-size: 22px;
            @include tworows_ellipsis;
          }
          .info_btn {
            float: left;
            margin-top: 156px;
            margin-left: 25px;
          }
        }
      }
      .main-setting {
        padding: 0 130px;
        margin-top: 20px;
        background-color: $whiteBackground;
        overflow: hidden;
        .qwui_divideLine {
          margin: 20px 0;
        }
        .ml10 {
          margin-left: 10px;
        }
        .qwui-vipIcon {
          position: static;
          display: block;
          float: left;
          margin-left: 385px;
          margin-top: -20px;
        }
      }
    }
    .openCourse-submitBtn {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 72px;
      padding-top: 20px;
      font-size: 0;
      text-align: center;
      background-color: $whiteBackground;
      /deep/ .qwui-button {
        padding: 8px 40px;
        margin-right: 10px;
        &.is-plain {
          border: 1px solid #cccccc;
          color: #333;
          &:hover {
             background-color: #f7f7f7;
          }
        }
      }
    }
  }
</style>
