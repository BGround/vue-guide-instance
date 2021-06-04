<template>
  <div class="qwui-addExam">
    <!--头部返回按钮-->
    <div class="addExam_backBar">
      <div class="backBar_wrap">
        <span class="backBar_icon" @click="goBack"></span>
        <span class="backBar_span1">设置</span>
        <span class="backbar_span2">/考试统计可见设置</span>
      </div>
    </div>
    <div class="addExam_section">
      <!--考试对象-->
      <qw-choose-setter
        :objConfig="formData.properties.examPeople"
        :objVal="formData.value.examPeople"
        :objKey="['examPeople']"
        :examPeopleObj="formData.value.examPeopleObj"
        :EVENT_BUS="EVENT_BUS"
      ></qw-choose-setter>
      <!--分割线-->
      <div class="footer-btn">
        <button class="footer-btn_save" @click="saveAvail">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import qwChooseSetter from './qwChooseSetter'
  import qwButton from '../../../components/base/QWButton'
  import { createEventBus } from '../../../utils/index'
  import { getAvailSet , saveAvailSet} from '../../../api/index'

  export default {
    name: 'availSetting',

    components: {
      qwChooseSetter,
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
            //考试对象
            "examPeople": {
              "required": true,
              "title": "授权人",
              //选项
              "options": [
              ],
            },
          },
          "value": {
            "name": "",
            "paperId": "",
            "uploadImg": false,
            "examPeople": "特定对象",
            "examPeopleObj": {
              "defaultDepts": [],
              "defaultTags": [],
              "defaultUsers": [],
              "defaultPosition": [],
            }
          },
        },
        "EVENT_BUS": createEventBus(),
        "fields": [],
        //编辑页面需要用到
        "oldId": {
          "oldUserIds": '',
          "oldDeptIds": ''
        }
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
      this.init()
    },

    methods: {
      goBack() {
        this.$router.go(-1)
      },
      setFormData(payload) {
        const {key, value} = payload;
        key.reduce((pre, cur, curIndex, arr) => {
          // 如果是最后一项，就是我们要改变的字段
          if (curIndex === arr.length - 1) {
            // Vue 不能检测直接用索引设置数组某一项的值
            if (typeof(cur) === 'number') {
              return pre.splice(cur, 1, value);
            } else {
              return pre[cur] = value;
            }
          }
          return pre[cur] = pre[cur] || {}
        }, this.formData.value);
      },
      // 获取初始化数据
      init () {
        this.$api.getAvailSet({},(res)=>{
          // console.log(res.users)
          if(!res.users) res.users = [];
          this.formData.value.examPeopleObj.defaultUsers = res.users;
        })
      },
      saveAvail () {
        // 获取userId的值
        let saveList = ''
        this.formData.value.examPeopleObj.defaultUsers.forEach((item)=>{
          saveList+='|' + item.userId
        })
        let userIds = saveList.substr(1);
        this.$api.saveAvailSet({userIds: userIds},(res)=>{
          dataBase.top_alert('保存成功',true,3000);
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../style/config.scss";
  .qwui-addExam {

    .addExam_backBar {
      position: relative;
      height: 50px;
      font-size: 14px;
      line-height: 28px;
      padding: 28px;
      background-color: $whiteBackground;
      .backBar_wrap {
        margin: 0 auto;
        .backBar_icon {
          position: absolute;
          width: 28px;
          height: 28px;
          top: 28px;
          background: url(~assets/images/ic_back.png) no-repeat center/28px 28px;
          cursor: pointer;
        }
        .backBar_span1{
          color: #999;
          margin-left: 40px;
        }
        .backBar_span2{
          color: #333
        }
      }
    }
    .addExam_section {
      padding: 28px 135px 60px 20px;
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
  .footer-btn{
    margin: 312px 27px 0;
    border-top: 1px solid #D6D7D9;
    overflow: hidden;
    text-align: center;
  }
  .footer-btn_save{
    background: #C31725;
    color: #fff;
    border: 1px solid #f87b00;
    width: 70px;
    height: 32px;
    line-height: 32px;
    padding: 0;
    margin: 20px auto 0;
    box-sizing: border-box;
    border-radius: 4px;
    &:hover{
      background: #ffa500;
      color: #fff;
      border: 1px solid #f87b00;
    }
  }
</style>
