<template>
  <div class="setting-menu">
    <div class="setting-menu-header">
      <setting-header :pages="['设置','菜单设置']"
                      @go-back="$router.go(-1)"></setting-header>
    </div>

    <Draggable v-model="list"
               class="setting-menu-body">
      <div class="menu-item"
           v-for="(item, index) in list"
           :key="index">
        <div class="menu-item-content">
          <Draggable class="menu-item-children"
                     v-model="item.list">
            <div class="menu-item-child"
                 v-for="(sItem, sIndex) in item.list"
                 :key="sIndex">
              <div class="menu-item-left">
                <span></span>
                <qw-input input-type="base"
                          input-tips="菜单名称"
                          v-model="sItem.menuName"></qw-input>
                <i class="icon icon-remove"
                   @click="removeChildMenu(item,sIndex)">-</i>
              </div>
              <div class="menu-item-right">
                <qw-input inputType="base"
                          v-model="sItem.menuUrl"
                          inputTips="输入点击菜单后跳转的链接，设置发布后24小时内生效(Tips:必须以http://或https://开头)"></qw-input>
              </div>
            </div>
          </Draggable>
          <div class="menu-item-parent">
            <div class="menu-item-left">
              <qw-input input-type="base"
                        input-tips="菜单名称"
                        v-model="item.menuName"></qw-input>
              <i class="icon icon-add"
                 @click="addChildMenu(item)">+</i>
            </div>
            <div class="menu-item-right">
              <qw-input :inputType="item.list&&item.list.length>0?'forbidden':'base'"
                        v-model="item.menuUrl"
                        inputTips="输入点击菜单后跳转的链接，设置发布后24小时内生效(Tips:必须以http://或https://开头)"></qw-input>
            </div>
          </div>
        </div>
        <i class="icon icon-add"
           v-if="index===0"
           @click="addMenu">+</i>
        <i class="icon icon-remove"
           v-else
           @click="removeMenu(index)">-</i>
      </div>
    </Draggable>
    <div class="setting-menu-fotter">
      <qw-button v-perm="'menuUpdate'"
                 @click="save">保存草稿</qw-button>
      <qw-button v-perm="'menuPublish'"
                 @click="publish"
                 type="primary">发布</qw-button>
      <qw-button v-perm="'menuReduce'"
                 @click="getDefault">加载默认</qw-button>
    </div>
  </div>
</template>
<script>
import Draggable from "vuedraggable";
import SettingHeader from "./components/settingHeader";
import QwInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import qwButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import {
  getCustomMenus,
  getDefaultCustomMenus,
  saveCustomMenu,
  publishCustomMenu
} from "crm/api/setting";
export default {
  name: "settingMenu",
  data() {
    return {
      list: [{}]
    };
  },
  components: {
    Draggable,
    SettingHeader,
    QwInput,
    qwButton
  },
  created() {
    this.init();
  },
  methods: {
    addMenu() {
      if (this.list.length < 3) {
        this.list.push({});
      }
    },
    removeMenu(index) {
      this.$delete(this.list, index);
    },
    removeChildMenu(item, sIndex) {
      this.$delete(item.list, sIndex);
    },
    addChildMenu(item) {
      if (!item.list) {
        this.$set(item, "list", []);
      }
      if (item.list.length < 5) {
        item.list.push({});
      }
    },
    save() {
      if (this.isChecked()) {
        dataBase.loading = true;
        saveCustomMenu(this.list)
          .then(res => {
            if (res.code == "0") {
              dataBase.alert(
                "提示信息",
                "保存成功，如需启用新菜单，请点击发布按钮！"
              );
            } else {
              dataBase.alert("提示信息", res.desc);
            }
          })
          .catch(err => {
            dataBase.alert("提示", "网络错误");
          })
          .finally(() => {
            dataBase.loading = false;
          });
      }
    },
    publish() {
      // 发布
      if (this.isChecked()) {
        dataBase.alert(
          "提示信息",
          "发布后将覆盖应用现有菜单，确定发布？",
          () => {
            dataBase.loading = true;
            publishCustomMenu(this.list)
              .then(res => {
                if (res.code == "0") {
                  dataBase.top_alert(
                    "发布成功，应用新菜单将在24小时内生效！",
                    true,
                    1000
                  );
                } else {
                  dataBase.alert("提示信息", res.desc);
                }
              })
              .catch(err => {
                dataBase.alert("提示", "网络错误");
              })
              .finally(() => {
                dataBase.loading = false;
              });
          }
        );
      }
    },
    getDefault() {
      //获取默认菜单
      dataBase.loading = true;
      getDefaultCustomMenus()
        .then(res => {
          if (res.code == "0") {
            this.list = res.data.list || [{}];
          } else {
            dataBase.alert("提示", res.desc);
          }
        })
        .catch(err => {
          dataBase.alert("提示", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    },
    isChecked() {
      // 一级菜单url不为空 ||子菜单不为空
      if (
        this.list.some(item => {
          return (!item.list || item.list.length === 0) && !item.menuUrl;
        })
      ) {
        dataBase.alert("消息提示", "请填写一级菜单的链接");
        return false;
      }
      // 子菜单url不为空
      if (
        this.list.some(item => {
          return (
            item.list &&
            item.list.some(sItem => {
              return !sItem.menuUrl;
            })
          );
        })
      ) {
        dataBase.alert("消息提示", "请填写二级菜单的链接");
        return false;
      }
      // 菜单名不能为空
      if (
        this.list.some(item => {
          return (
            !item.menuName ||
            (item.list &&
              item.list.some(sItem => {
                return !sItem.menuName;
              }))
          );
        })
      ) {
        dataBase.alert("消息提示", "菜单名字不能为空");
        return false;
      }
      this.list.forEach((item, index) => {
        item.menuIndex = index;
        item.menuType = this.getMenuType(item.menuUrl, 1);
        item.type = "";
        item.list &&
          item.list.forEach((sItem, sIndex) => {
            sItem.type = "";
            sItem.menuIndex = sIndex;
            sItem.menuType = this.getMenuType(sItem.menuUrl, 2);
          });
      });
      return true;
    },
    getMenuType(strUrl, level) {
      //0:一级菜单,1:key类型,2:http://https://类型
      var type = "0";
      var tmpUrl = $.trim(strUrl);
      tmpUrl = tmpUrl.toLowerCase();
      if (tmpUrl == "") {
        if (level == "1") {
          type = "0";
        } else {
          type = "1"; //子菜单默认为key
        }
      } else {
        var index1 = tmpUrl.indexOf("http://");
        var index2 = tmpUrl.indexOf("https://");
        if (index1 == 0 || index2 == 0) {
          type = "2";
        } else {
          //判断是否带有corp_id=@corp_id@，有则为我们的链接
          var urlArray = ["@pre_url@"];
          var isUrl = false;
          for (var i = 0; i < urlArray.length; i++) {
            if (tmpUrl.indexOf(urlArray[i]) == 0) {
              isUrl = true;
              break;
            }
          }
          if (isUrl) {
            type = "2";
          } else {
            type = "1";
          }
        }
      }
      return type;
    },
    init() {
      dataBase.loading = true;
      getCustomMenus()
        .then(res => {
          if (res.code == "0") {
            this.list = res.data.list || [{}];
          } else {
            dataBase.alert("提示", res.desc);
          }
        })
        .catch(err => {
          dataBase.alert("提示", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-menu {
  &-header {
    margin-bottom: 10px;
  }
  &-body {
    // padding: 20px 0;
    border-top: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    .menu-item {
      display: flex;
      align-items: center;
      &-content {
        border: 1px solid #ccc;
        padding: 20px;
        background: #f6f5f4;
        flex: 1;
        margin: 20px;
      }
      &-parent,
      .menu-item-child {
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
        padding: 5px;
        cursor: move;
        &:hover {
          background-color: #e5e5e5;
        }
      }
      &-child {
        span {
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 1px solid #eee;
          border-style: inset;
          margin: 5px;
        }
      }
      &-left {
        display: flex;
        align-items: center;
        margin-right: 20px;
        .icon {
          margin: 0 10px;
        }
      }
      &-right {
        width: 75%;
      }
      .icon {
        color: white;
        font-size: 18px;
        font-style: normal;
        font-weight: bold;
        border-radius: 50%;
        height: 19px;
        width: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 1px;
        cursor: pointer;
        &.icon-add {
          background-color: #80c056;
        }
        &.icon-remove {
          height: 15px;
          padding-bottom: 5px;
          font-size: 28px;
          background-color: #df4949;
        }
      }
    }
  }
  &-fotter {
    text-align: center;
    margin: 20px;
    .qwui-button {
      margin: 0 5px;
    }
  }
}
</style>

<style lang="scss">
.setting-menu {
  &-body {
    .menu-item {
      .input_wrap .qw_input {
        padding: 5px 10px;
        border: 1px solid #cccccc;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
      &-left {
        .input_wrap .qw_input {
          width: 8em;
          text-align: center;
        }
      }
      &-right {
        .inlineBlock {
          width: 100%;
        }
        .input_wrap .qw_input {
          width: 100%;
        }
      }
    }
  }
}
</style>
