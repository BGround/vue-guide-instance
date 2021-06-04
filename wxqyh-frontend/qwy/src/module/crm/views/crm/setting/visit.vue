<template>
  <div class="setting-visit">
    <div class="setting-visit-header">
      <setting-header :pages="['设置','客户拜访设置']"
                      @go-back="$router.go(-1)"></setting-header>
    </div>
    <div class="setting-visit-body">
      <ul>
        <li v-perm="'visitAddress'">
          <div class="item-left">
            <h6>允许修改拜访地址</h6>
            <p>开启后允许修改应用端的拜访地址</p>
          </div>
          <div class="item-right">
            <qwui-switch :defaultStatus="!!status.address"
                         @change="onChange('address')"></qwui-switch>
          </div>
        </li>
        <li v-perm="'visitPhoto'">
          <div class="item-left">
            <h6>允许选择图片</h6>
            <p>打开时可以选择图片或者拍照上传，关闭后只允许拍照上传</p>
          </div>
          <div class="item-right">
            <qwui-switch :defaultStatus="!!status.photo"
                         @change="onChange('photo')"></qwui-switch>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SettingHeader from "./components/settingHeader";
import QwuiSwitch from "@/components/qwuiBase/qwuiSwitch/qwuiSwitch";
import {
  getVisitAddres,
  getPhotoSetting,
  updatePhotoSetting,
  updateVisitAddres
} from "crm/api/setting";
export default {
  name: "settingVisit", //提醒设置
  components: {
    SettingHeader,
    QwuiSwitch
  },
  data() {
    return {
      status: {
        address: 0,
        photo: 0
      }
    };
  },
  methods: {
    onChange(key) {
      dataBase.loading = true;
      this.$set(this.status, key, this.status[key] ? 0 : 1);
      (() => {
        if (key == "address") {
          return updateVisitAddres(this.status[key]);
        } else {
          //0 是开启，1 是关闭
          return updatePhotoSetting(this.status[key] == 1 ? "0" : "1");
        }
      })()
        .then(res => {
          if (res.code == "0") {
            // dataBase.top_alert("更新成功", true, 1000);
          } else {
            this.$set(this.status, key, this.status[key] ? 0 : 1);
            dataBase.alert("提示", res.desc);
          }
        })
        .catch(err => {
          this.$set(this.status, key, this.status[key] ? 0 : 1);
          dataBase.alert("提示", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    },
    init() {
      dataBase.loading = true;
      Promise.all([getVisitAddres(), getPhotoSetting()])
        .then(res => {
          if (
            res.some(item => {
              return item.code != "0";
            })
          ) {
            dataBase.alert("提示", res.desc);
            return;
          }

          this.$set(
            this.status,
            "address",
            res[0].data.settingPO && res[0].data.settingPO.isDisable == "1"
              ? 1
              : 0
          );
          //0 是开启，1 是关闭
          this.$set(
            this.status,
            "photo",
            res[1].data.is_photograph == "0" ? 1 : 0
          );
        })
        .catch(err => {
          dataBase.alert("提示", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
.setting-visit {
  &-header {
    padding-bottom: 10px;
    border-bottom: 1px solid #dbdbdb;
    margin-bottom: 24px;
  }
  &-body {
    ul {
      li {
        justify-content: space-between;
        display: flex;
        padding: 14px 0 18px;
        border-bottom: 1px solid #dbdbdd;
        h6 {
          font-size: 16px;
        }
        p {
          margin-top: 5px;
          color: #999;
        }
      }
    }
  }
}
</style>
