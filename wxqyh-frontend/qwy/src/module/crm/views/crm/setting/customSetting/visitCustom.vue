<template>
  <div>
    <custom
      :pageName="pageName"
      :basicList="basicList"
      :strList="strList"
      :mustWriteField="mustWriteField"
      :mustUsedField="mustUsedField"
      :hasTipField="hasTipField"
      @save="save"
    ></custom>
  </div>
</template>
<script>
import custom from "../components/custom";
import { getVisitCustom, saveVisitCustom } from "crm/api/setting/index.js";
export default {
  components: {
    custom
  },
  data() {
    return {
      basicList: [],
      strList: [],
      mustWriteField: [],
      mustUsedField: [],
      hasTipField: [],
      pageName: ["设置", "拜访自定义字段设置"]
    };
  },
  mounted() {
    dataBase.loading = true
    getVisitCustom().then(res => {
      dataBase.loading = false
      if (res.code == "0") {
        this.basicList = res.data.basicList;
        this.strList = res.data.list;
        this.basicList.forEach(ele => {
          ele.status = ele.status == "1" ? true : false;
          ele.isMust = ele.isMust == "1" ? true : false;
          ele.list.forEach(li => {
            li.isShow = li.isShow == "1" ? true : false;
          });
        });
        this.strList.forEach(item => {
          item.status = item.status == "1" ? true : false;
          item.isMust = item.isMust == "1" ? true : false;
          item.list.forEach(li => {
            li.isShow = li.isShow == "1" ? true : false;
          });
        });
        this.mustWriteField = [
          "拜访客户",
          "拜访时间",
          "标题",
          "内容"
        ];
        this.mustUsedField = [
          "拜访客户",
          "拜访联系人",
          "拜访时间",
          "标题",
          "内容",
          "图片"
        ];
        this.hasTipField = [
          {
            name: "拜访商机",
            msg: "此字段关联【拜访客户】，选择了拜访客户后，该字段才可编辑",
            isShow: false
          },
          {
            name: "客户地址",
            msg: "此字段关联【拜访客户】，选择了拜访客户后，该字段才可编辑",
            isShow: false
          }
        ];
      } else {
        dataBase.alert("提示", res.desc);
      }
    });
  },
  methods: {
    save(basicList, strList) {
      let flag = true;
      let newBasicList = basicList.map(item => {
        item.list.forEach(li => {
          li.isShow = li.isShow ? "1" : "0";
        });
        return {
          id: item.id,
          optionName: item.optionName,
          status: item.status ? "1" : "0",
          isMust: item.isMust ? "1" : "0",
          list: item.list
        };
      });
      let newStrList = strList.map(item => {
        item.list.forEach(li => {
          li.isShow = li.isShow ? "1" : "0";
        });
        if (item.type == '0' && (item.list.length == 0 || item.list[0].name == '')) {
          flag = false;
          dataBase.alert("提示信息", `${item.optionName}字段的设置不能为空`);
        }
        return {
          id: item.id,
          itemId: item.itemId,
          optionName: item.optionName,
          status: item.status ? "1" : "0",
          isMust: item.isMust ? "1" : "0",
          type: item.type,
          ext1: item.ext1,
          list: item.list
        };
      });
      let basicJsonList = {
        list: {
          list: newBasicList
        }
      };
      let strJsonList = {
        list: {
          list: newStrList
        }
      };
      let obj = {
        basicJson: JSON.stringify(basicJsonList),
        strJson: JSON.stringify(strJsonList)
      };
      if (flag) {
        saveVisitCustom(obj)
          .then(res => {
            if (res.code == "0") {
              dataBase.top_alert("保存成功", true, 1000);
              setTimeout(() => {
                this.$router.go(-1);
              }, 500);
            } else {
              dataBase.alert("提示信息", res.desc);
            }
          })
          .catch(() => {
            dataBase.alert("提示信息", res.desc);
          });
      }
    }
  }
};
</script>
<style lang = "scss">
@import "./custom.scss";
</style>