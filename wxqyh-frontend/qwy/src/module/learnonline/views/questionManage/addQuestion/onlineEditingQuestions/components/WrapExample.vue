<template>
  <div class="onlineEditing_example" v-show="example.show">
    <div class="example_wrap">

      <!-- 头部 -->
      <div class="example_wrap_header">
        编辑示例
        <i class="example_wrap_close" @click="close">×</i>
      </div>
      

      <!-- tab导航栏 -->
      <div class="example_wrap_tab">
        <tab-group
          ref="tabGroup" 
          :selected="selected" 
          :full="true"
        >
          <tab 
            ref="tab"
            v-for="(item,index) in tabs"
            :text="item.text"
            :key="index"
            @click="tabClick"
          ></tab>
        </tab-group>
      </div>

      <!-- 内容外框 -->
      <div class="example_wrap_content">
        <component 
        class="content"
        :tabs="tabs"
        :tabIndex="nowTabindex"
        is="Example"
        @clickFormat="clickFormat"
        ></component>
      </div>


      <!-- 关闭按钮 -->
      <div class="example_wrap_closeButton">
        <qw-button 
          class="button_close" 
          color="white" 
          @click="close"
        >
          <span>关闭</span>
        </qw-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters , mapMutations } from 'vuex';
import QwButton from '../../../../../components/base/QWButton'; // learnonline的按钮
import Tab from '@/components/qwuiTab/tab.vue'; // 公共组件-tab单项组件
import TabGroup from '@/components/qwuiTab/tabGroup.vue'; // 公共组件-tab群组件

import Example from './Example'; // 预览基础组件
export default {
  name: 'WrapExample',
  components: {
    QwButton,
    Tab,
    TabGroup,
    Example
  },
  props: {
  },
  data() {
    return {
      /* 配置项 */
      tabs: [ // 公共tab栏导航数据
        {text: '基础格式'}, 
        {text: '单选题'}, 
        {text: '多选题'}, 
        {text: '判断题'}, 
        {text: '填空题'}, 
        {text: '问答题'}
      ],
      // defaultTabValue: '基础格式', // tab导航栏默认选中
      defaultTabValue: '基础格式',

      /* 数据项 */
      nowTabindex: 0, // 当前选中项
    };
  },
  computed: {
    ...mapGetters ('questionManageOnlineEditing', [
      'example'
    ]),
    // tab默认选中下标
    selected() {
      return this.tabs.findIndex(value => value.text == this.defaultTabValue);
    },

  },
  watch: {
    'example.index': function(index) {
      let tabs = this.tabs;
      let selectIndex = index < 0 || index >= tabs.length? 0: index;
      let text = tabs[selectIndex].text;

      // 仅当要选择的与目前已选的不一样时才需要触发 用于vuex内的更换index
      selectIndex != this.nowTabindex && this.tabChange(text)
    }
  },
  created() {
    // 默认tab下标初始化
    this.nowTabindex = this.tabs.findIndex(value => value.text == this.defaultTabValue);
  },  
  methods: {
    ...mapMutations('questionManageOnlineEditing', [
      'SET_EXAMPLE'
    ]),
    // 关闭窗口事件
    close() {
      this.SET_EXAMPLE({show: false});
    },

    // tab导航栏切换
    tabClick(value) {
      this.nowTabindex = this.tabs.findIndex(tab => tab.text == value);
      this.SET_EXAMPLE({index: this.nowTabindex});
    },

    // 更改导航栏选项
    tabChange(value) {
      let tabs = this.$refs.tab;
      if (!tabs) {return;}

      // 也更新当前选择中项
      this.nowTabindex = this.tabs.findIndex(tab => tab.text == value);
      tabs[1].currentIndex()
    },

    // 点击了模板字样
    clickFormat() {
      this.SET_EXAMPLE({index: 1}); // 跳转到第二选项-单选题
    }
  },
}
</script>
<style lang="scss" scoped>
.onlineEditing_example {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: rgba(0,0,0,0.5);

  .example_wrap {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 1000px;
    height: 680px;
    margin: auto;
    border-radius: 2px;
    background: #fff;

    .example_wrap_header {
      position: relative;
      padding-left: 24px;
      height: 64px;
      font-size: 18px;
      color: #333;
      line-height: 64px;
      text-align: left;
      background: #F6F6F6;

      .example_wrap_close {
        float: right;
        width: 50px;
        height: 64px;
        line-height: 64px;
        font-size: 34px;
        font-weight: lighter;
        color: #bbb;
        font-style: normal;
        text-align: center;
        cursor: pointer;
        user-select: none;
      }
    }

    .example_wrap_tab {
      margin: 0 28px;
      border-bottom: 1px solid #F5F5F5;
    }
    .example_wrap_content {
      height: 500px;
      margin: 0 28px;
      border-bottom: 1px solid #F5F5F5;
      overflow-y: auto;
    }

    .content {
      margin-top: 24px;
      height: 468px;
    }
  }

  .example_wrap_closeButton {
    height: 68px;
    text-align: center;
    

    .button_close {
      width: 60px;
      height: 28px;
      margin-top: 20px;
      padding: 0;
      color: #808080;
      border-color: #D5D5D5;
    }
  }
}
</style>
