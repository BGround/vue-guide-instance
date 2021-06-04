<template>
  <div
    class="qwui-form_item qwui-form_item_hasLabel"
    :class="{
      'qwui-form_item_required' : objConfig.required ,
    }"
  >
    <label class="qwui-form_item_label" v-if="!objConfig.noLabel">
      {{ objConfig.title }}
    </label>
    <div class="qwui-form_item_content">
      <qwui-radio
        :key="index"
        v-for="(item,index) in objConfig.options"
        :label="item.label"
        v-model="msg"
      >{{ item.label }}</qwui-radio>

      <!--选人呈现位置-->
      <div class="content_button"
           @click="showPick"
           v-if="!defaultDepts.length && !defaultTags.length && !defaultUsers.length && !defaultPosition.length && msg === '特定对象'"
      >点击选择</div>
      <ul class="qwui-click_choose"
          @click="showPick"
          v-if="defaultDepts.length || defaultTags.length || defaultUsers.length || defaultPosition.length"
      >
        <span class="qwui-click_choose_word" v-show="!selectShow">点击选择</span>
        <!--  部门已选择  -->
        <li class="qwui-dept_selected ellipsis"
            v-for="(item,index) in defaultDepts"
            :title="item.nodeName?item.nodeName:item.deptName"
        >
          <div class="qwui-dept_selected_icon"></div>
          {{item.nodeName?item.nodeName:item.deptName}}
          <span class="qwui-selected_close" @click.stop.prevent="deleteDept(index)">×</span>
        </li>
        <!--  标签选择  -->
        <li class="qwui-inline">
          <div class="qwui-dept_selected" v-for="(item,index) in defaultTags">
            <div class="qwui-tag_selected_icon"></div>
            {{item.tagName}}
            <span class="qwui-selected_close" @click.stop.prevent="deleteTag(index)">×</span>
          </div>
        </li>
        <!--  职位的选择  -->
        <li class="qwui-inline"
            v-for="(item, index) in defaultPosition"
            :title="item.name"
        >
          <div class="qwui-dept_selected pr10 ellipsis">
            <div class="qwui-tag_selected_icon"></div>
            {{item.name}}
            <span class="qwui-selected_close" @click.stop.prevent="deletePost(index)">×</span>
          </div>
        </li>
        <!--  人员选择  -->
        <li class="qwui-inline">
          <div class="qwui-dept_selected ellipsis"
               v-for="(item,index) in defaultUsers"
               :title="item.personName"
          >
            <img v-if="item.headPic && item.headPic!='0'" class="qwui-dept_selected_icon" :src="item.headPic">
            <div v-else class="qwui-user_default_img"></div>
            {{item.personName}}
            <span class="qwui-selected_close" @click.stop.prevent="deleteUser(index)">×</span>
          </div>
        </li>
      </ul>
      <!--选人统计-->
      <div class="content_count"
           v-show="(defaultDepts.length || defaultTags.length || defaultUsers.length || defaultPosition.length) && msg === '特定对象'"
      >
        <span>已选</span>
        <span v-show="defaultDepts.length">{{ defaultDepts.length }}部门，</span>
        <span v-show="defaultTags.length">{{ defaultTags.length }}标签，</span>
        <span v-show="defaultPosition.length">{{ defaultPosition.length }}职位，</span>
        <span v-show="defaultUsers.length">{{ defaultUsers.length }}成员，</span>
        <span class="count_showPick" @click="showPick">修改</span>
      </div>
      <!--选人呈现位置end-->
      <pick-person
        :show="show"
        :defaultDepts="defaultDepts"
        :defaultTags="defaultTags"
        :defaultUsers="defaultUsers"
        :defaultPosition="defaultPosition"
        :functionTab="functionTab"
        :maxUser="maxUser"
        @chooseDone="chooseDone"
        @closeThis="closeThis"
      ></pick-person>
    </div>
  </div>
</template>

<script>
  import Base from 'learn/mixins/base';
  import Validate from 'learn/mixins/validate'
  import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio'
  import pickPerson from '@/components/pickPerson/pickPerson'

  export default {
    name: 'qwChoosePeople',

    components: { qwuiRadio, pickPerson },

    mixins: [ Base, Validate ],

    props: {
      //选项的配置
      objConfig: {
        type: Object,
        required: true
      },
      objVal: {
        required: true
      },
      objKey: {
        type: Array,
        required: true
      },
      examPeopleObj: {
        type: Object,
        required: true
      },
      EVENT_BUS: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        // 按钮部分
        keyName: this.objKey,
        validateState: '',
        validateMessage: '',
        //通讯录的选人部分
        maxUser: this.$isVipGold ? 10000 : this.$isVipSilver ? 500 : 25,
        show:false,
        defaultDepts: this.examPeopleObj.defaultDepts,
        defaultTags: this.examPeopleObj.defaultTags,
        defaultUsers: this.examPeopleObj.defaultUsers,
        defaultPosition: this.examPeopleObj.defaultPosition,
        //通讯录选人的配置
        functionTab: [
          {text:'标签人员'},
          {text:'成员'},
          {text:'批量导入'},
          {text:'高级筛选'}
        ],
      }
    },

    computed: {
      selectShow:function () {
        return this.defaultDepts.length>0 || this.defaultTags.length>0 || this.defaultUsers.length>0 || this.defaultPosition.length>0
      }
    },

    watch: {
      objVal() {
        this.defaultDepts.splice(0);
        this.defaultTags.splice(0);
        this.defaultUsers.splice(0);
        this.defaultPosition.splice(0);
        this.validateState = 'success';
      },
      examPeopleObj: {
        handler(val, oldVal) {
          this.defaultDepts = [...val.defaultDepts];
          this.defaultTags = [...val.defaultTags];
          this.defaultUsers = [...val.defaultUsers];
          this.defaultPosition = [...val.defaultPosition];
        },
        deep: true
      },
    },

    created() {},

    methods: {
      //删除职位
      deletePost(index) {
        this.defaultPosition.splice(index,1);
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: ['examPeopleObj', 'defaultPosition'],
          value: this.defaultPosition
        });
        this.handleBlur();
      },
      //删除部门
      deleteDept(index) {
        this.defaultDepts.splice(index,1)
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: ['examPeopleObj', 'defaultDepts'],
          value: this.defaultDepts
        });
        this.handleBlur();
      },
      //删除标签
      deleteTag(index) {
        this.defaultTags.splice(index, 1);
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: ['examPeopleObj', 'defaultTags'],
          value: this.defaultTags
        });
        this.handleBlur();
      },
      //删除人员
      deleteUser(index) {
        this.defaultUsers.splice(index,1)
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: ['examPeopleObj', 'defaultUsers'],
          value: this.defaultUsers
        });
        this.handleBlur();
      },
      chooseDone(dept, tag, user, post) {
        dept.forEach(item => {
          item["id"] = item.nodeId;
        });
        user.forEach(item => {
          item["id"] = item.userId;
        })
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: ['examPeopleObj', 'defaultDepts'],
          value: dept
        });
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: ['examPeopleObj', 'defaultTags'],
          value: tag
        });
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: ['examPeopleObj', 'defaultUsers'],
          value: user
        });
        this.$props.EVENT_BUS.$emit('on-set-form-data', {
          key: ['examPeopleObj', 'defaultPosition'],
          value: post
        });
        this.show = false;
        this.$nextTick(() => {
          this.handleBlur();
        });
      },
      closeThis:function () {
        this.show = false;
        this.$nextTick(() => {
          this.handleBlur();
        });
      },
      showPick:function () {
        this.show = !this.show
      },
      handleBlur() {
        if(this.msg === '特定对象' && !this.defaultDepts.length && !this.defaultTags.length && !this.defaultUsers.length && !this.defaultPosition.length){
          this.validateState = 'error';
          return this.returnPromise({
            status: false
          })
        }else {
          this.validateState = 'success';
          this.validateMessage = '';
          return this.returnPromise({
            status: true
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'learn/style/base.scss';
  .qwui-form_item_content {
    .content_button {
      width: 340px;
      margin: 10px 0;
      line-height: 48px;
      text-align: center;
      border-radius:2px;
      border:1px dashed rgba(203,203,203,1);
      color: $greyColor;
      cursor: pointer;
      &.redBorder {
        border-color: $redColor;
      }
    }
    .content_count {
      color: #A6A6A6;
      line-height: initial;
      .count_showPick {
        color: #409EFF;
        cursor: pointer;
      }
    }
    .content_tip {
      .greyColor {
        color: $greyColor;
      }
      .orangeColor {
        color: $orangeColor;
        cursor: pointer;
      }
    }
    /*通讯录样式*/
    .qwui-click_choose{
      overflow: auto;
      width: 702px;
      height: 78px;
      margin: 10px 0;
      padding: 4px 8px;
      border: 1px dashed #cccccc;
      background: #fff;
      border-radius: 2px;
      cursor: pointer;
    }
    .qwui-click_choose_word{
      display: inline-block;
      width: 100%;
      height: 100%;
      text-align: center;
      font-size: 14px;
      line-height: 78px;
      color: #999;
    }
    .qwui-dept_selected{
      position: relative;
      display: inline-block;
      max-width: 275px;
      padding-right: 18px;
      height: 24px;
      margin: 5px 5px 0 0;
      line-height: 24px;
      list-style: none;
      background-color: #eee;
      border: 1px solid #ddd;
      border-left:none;
      border-radius: 3px;
      vertical-align: top;
    }
    .qwui-dept_selected_icon{
      display: inline-block;
      width: 26px;
      height: 24px;
      margin-right: 5px;
      list-style: none;
      vertical-align: top;
      background: url(~assets/images/dept_icon.png) no-repeat center;
    }
    .qwui-selected_close{
      position: absolute;
      right: -5px;
      top: 0;
      display: inline-block;
      width: 18px;
      height: 18px;
      margin: 3px 5px 0 10px;
      line-height: 17px;
      text-align: center;
      color: #afafaf;
      font-size: 19px;
      font-weight: 600;
      cursor: pointer;
      vertical-align: text-bottom;
      border-radius: 100%;
      opacity: 1;
    }
    .qwui-inline{
      display: inline;
      vertical-align: middle;
    }
    .qwui-user_default_img{
      display: inline-block;
      width: 26px;
      height: 24px;
      margin-right: 5px;
      list-style: none;
      vertical-align: top;
      background: url(~assets/images/touxiang02.png) no-repeat center;
      background-size: 26px 24px;
    }
    .qwui-tag_selected_icon{
      display: inline-block;
      width: 26px;
      height: 24px;
      margin-right: 5px;
      list-style: none;
      vertical-align: top;
      background: url(~assets/images/tag_icon02.png) no-repeat center;
    }
    /*通讯录样式end*/
    .addDeptUser{
      display: inline-block;
      margin-right: 10px;
      padding: 0 20px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #cbcbcb;
      border-radius: 4px;
      background-color: #fff;
      cursor: pointer;
    }
    .clearSelected{
      float: right;
      color: #999;
      line-height: 28px;
      cursor: pointer
    }
    .clearSelected:hover{
      color: red
    }
  }
</style>
