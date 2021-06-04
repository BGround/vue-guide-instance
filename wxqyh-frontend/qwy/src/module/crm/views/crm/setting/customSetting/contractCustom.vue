<template>
  <div>
    <custom 
    :pageName = "pageName"
    :basicList = "basicList" 
    :strList = "strList" 
    :mustWriteField = "mustWriteField" 
    :mustUsedField= "mustUsedField"
    :xialaField = "xialaField"
    @save = "save"
    ></custom>  
  </div>
</template>
<script>
import custom from "../components/custom"
import {
  getContractCustom,
  saveContractCustom
} from "crm/api/setting/index.js"
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
      xialaField:[],
      pageName:['设置','合同自定义字段设置']
    }
  },
  mounted() {
    dataBase.loading = true
    getContractCustom().then(res => {
      dataBase.loading = false
      if (res.code == "0") {
        this.basicList = res.data.basicList
        this.strList = res.data.list
        this.basicList.forEach(ele => {
          ele.status = ele.status == "1" ? true : false
          ele.isMust = ele.isMust == "1" ? true : false
          ele.list.forEach( li => {
            li.isShow = li.isShow == '1' ? true: false
          })
        })
        this.strList.forEach(item => {
          item.status = item.status == "1" ? true : false
          item.isMust = item.isMust == "1" ? true : false
          item.list.forEach( li => {
            li.isShow = li.isShow == '1' ? true: false
          })
        })
        this.mustWriteField = ["合同金额","合同类型"]
        this.mustUsedField = ["合同标题", "合同金额","合同类型"]
        this.xialaField = ["合同状态"]
      } else {
        dataBase.alert("提示", res.desc)
      }
    });
  },
  methods: {
    save(basicList, strList) {
      let flag = true;
      let newBasicList = basicList.map(item => {
        let obj= {
          id:item.id,
          itemId:item.itemId,
          optionName:item.optionName,
          status:item.status ? "1" : "0",
          isMust:item.isMust ? "1" : "0",
        }
        item.list.forEach( li => {
          li.isShow = li.isShow ? '1':'0'
        })
        if(item.list.length > 0){
          obj.list = item.list
        }
        return obj
      })
      let newStrList = strList.map(item => {
        item.list.forEach( li => {
          li.isShow = li.isShow ? '1':'0'
        })
        if (item.type == '0' && (item.list.length == 0 || item.list[0].name == '')) {
          flag = false;
          dataBase.alert("提示信息", `${item.optionName}字段的设置不能为空`);
        }
        return {
          id:item.id,
          itemId:item.itemId,
          optionName:item.optionName,
          status:item.status ? "1" : "0",
          isMust:item.isMust ? "1" : "0",
          type:item.type,
          ext1:item.ext1,
          list:item.list
        }
      })
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
        customJson: JSON.stringify(strJsonList)
      };
      if(flag){
        saveContractCustom(obj).then( res => {
          if( res.code == '0'){
            dataBase.top_alert("保存成功", true, 1000);
            setTimeout(() => {
              this.$router.go(-1);
            }, 500)
          
          }else{
            dataBase.alert("提示信息", res.desc);
          }
        }).catch( () => {
          dataBase.alert("提示信息", res.desc);
        })
      }

    }
  }
};
</script>
<style lang = "scss">
  @import './custom.scss';
</style>