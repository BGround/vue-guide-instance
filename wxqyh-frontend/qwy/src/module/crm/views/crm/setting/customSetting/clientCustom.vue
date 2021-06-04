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
import { getClientCustom, saveClientCustom } from "crm/api/setting/index.js";
import custom from "../components/custom";
export default {
  data() {
    return {
      basicList: [],
      strList: [],
      mustWriteField: [],
      mustUsedField: [],
      hasTipField: [],
      pageName: ["设置", "客户自定义字段设置"]
    };
  },
  components: {
    custom
  },
  mounted() {
    dataBase.loading = true
    getClientCustom().then(res => {
      dataBase.loading = false
      if (res.code == "0") {
        this.basicList = res.data.basicList;
        this.strList = res.data.list;
        this.basicList.forEach(ele => {
          ele.status = ele.status == "1" ? true : false;
          ele.isMust = ele.isMust == "1" ? true : false;
        });
        this.strList.forEach(item => {
          item.status = item.status == "1" ? true : false;
          item.isMust = item.isMust == "1" ? true : false;
          item.list.forEach(li => {
            li.isShow = li.isShow == "1" ? true : false;
          });
        });
        this.mustWriteField = ["客户名称", "客户编码", "所属公海"];
        this.mustUsedField = ["客户名称", "客户编码", "客户类别"];
        this.hasTipField = [
          {
            name: "所属公海",
            msg: "若不使用公海功能可不启用该字段",
            isShow: false
          }
        ];
      } else {
        dataBase.alert("提示", res.desc);
      }
    });
  },
  methods: {
    //保存自定义字段
    save(basicList, strList) {
      let flag = true;
      let newBasicList = basicList.map(item => {
        let obj = Object.assign({}, item);
        obj.status = obj.status ? "1" : "0";
        obj.isMust = obj.isMust ? "1" : "0";
        return obj;
      });
      let newStrList = strList.map(item => {
        item.list.forEach(li => {
          li.isShow = li.isShow ? "1" : "0";
        });
        if (item.type == '0' && (item.list.length == 0 || item.list[0].name == '')) {
            flag = false;
            dataBase.alert("提示信息", `${item.optionName}字段的设置不能为空`)
        }
        return {
          id: item.id,
          itemId: item.itemId,
          optionName: item.optionName,
          status: item.status ? "1" : "0",
          isMust: item.isMust ? "1" : "0",
          type: item.type,
          ext1: item.ext1,
          ext2: item.ext2,
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
        saveClientCustom(obj)
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

