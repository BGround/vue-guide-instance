<template>
  <div class="qwui-menuSet_wrap">
    <div class="qwui-menu_header">
      <div class="qwui-header_bg">
        <img class="qwui-menu_back"
             src="~assets/images/back_icon.png"
             @click="goViewTab">
        <button class="qwui-menu_save"
                @click="save">保存</button>
      </div>
    </div>
    <div class="qwui-menu_set">
      <div class="qwui-menu_show">
        <img class="qwui-menu_bg"
             src="~assets/images/icon_menu_iPhone.png"
             alt="">
        <div class="qwui-menu_tab">
          <div class="qwui-tab_item"
               v-for="(item,index) in tabList"
               :key="index"
               :class="currentSel=== index ? 'qwui-tab_select':''"
               @click="switchTab(index)">
            <img class="qwui-tab_icon"
                 :src="currentSel=== index ? tabList[index].iconSel : tabList[index].icon"
                 alt="">
            <p class="qwui-tab_txt">{{item.title}}</p>
          </div>
        </div>
      </div>
      <div class="qwui-menu_edit">
        <p class="qwui-edit_title">编辑菜单名称</p>
        <div class="qwui-edit_content">
          <div class="qwui-edit_input"
               v-for="(item,index) in tabList"
               :key="index">
            <div class="qwui-input_content"
                 :class="{'qwui-input_tip': item.tipFlag}">
              <input type="text"
                     maxlength="4"
                     v-model="tabList[index].title"
                     @change="changeMenuText(index)"
                     @focus="switchTab(index)"
                     v-focus="currentSel === index">
              <span class="qwui-edit_wordCount">{{tabList[index].title.length}}/4</span>
            </div>
            <div class="qwui-edit_tip"
                 v-show="item.tipFlag">仅支持汉字、数字和字母</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSmallProgramTab,
  updateSmallProgramTab
} from "@/module/crm/api/assistant";
import { log } from "util";
export default {
  data() {
    return {
      currentSel: 0, //当前选中索引
      tabList: [
        {
          title: "",
          icon: require("assets/images/icon_tabbar_card_normal.png"),
          iconSel: require("assets/images/icon_tabbar_card_pressed.png"),
          tipFlag: false
        },
        {
          title: "",
          icon: require("assets/images/icon_tabbar_product_normal.png"),
          iconSel: require("assets/images/icon_tabbar_product_pressed.png"),
          tipFlag: false
        },
        {
          title: "",
          icon: require("assets/images/icon_tabbar_website_normal.png"),
          iconSel: require("assets/images/icon_tabbar_website_pressed.png"),
          tipFlag: false
        },
        {
          title: "",
          icon: require("assets/images/icon_tabbar_news_normal.png"),
          iconSel: require("assets/images/icon_tabbar_news_normal1.png"),
          tipFlag: false
        }
      ] //小程序tab栏
    };
  },
  created() {
    //获取小程序tabbar数据
    getSmallProgramTab(res => {
      res.list.map((val, index) => {
        this.tabList[index].title = val.barName;
      });
    });
  },
  methods: {
    switchTab(index) {
      this.currentSel = index;
    },
    //失去焦点触发
    changeMenuText(index) {
      if (!this.tabList[index].title.length) {
        dataBase.top_alert("不能为空", false, 3000);
        return;
      }
      if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(this.tabList[index].title)) {
        this.tabList[index].tipFlag = true;
        return;
      }
      this.tabList[index].tipFlag = false;
    },
    goViewTab() {
      this.$router.go(-1);
    },
    save() {
      if (!this.tabList.some(item => item.tipFlag)) {
        let tabNames = this.tabList.map((val, index) => {
          return val.title;
        });
        updateSmallProgramTab(
          {
            barName: tabNames.join(",")
          },
          res => {
            dataBase.top_alert("保存成功", true, 3000);
            setTimeout(() => {
              this.goViewTab();
            }, 1500);
          }
        );
      }
    }
  },
  directives: {
    focus: {
      update: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  }
};
</script>

<style src='./smallProgramMenuSet.scss' scoped lang="scss"></style>
