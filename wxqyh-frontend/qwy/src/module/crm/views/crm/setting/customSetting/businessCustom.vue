<template>
  <div>
    <custom 
    :pageName = "pageName"
    :basicList = "basicList" 
    :strList = "strList" 
    :xialaField= "xialaField"
    :mustUsedField = "mustUsedField"
    :mustWriteField = "mustWriteField"
    @save = "save"
    >
      <template slot = "settingTitle" slot-scope="slotProps1" v-if = "basicList[slotProps1.curIndex].optionName == '目前阶段'">
        <span class = "pop_col41">进程</span>
        <span class = "pop_col51">盈率(%)</span>
      </template>
      <template slot = "settingContent" slot-scope="slotProps" v-if = "basicList[slotProps.curIndex].optionName == '目前阶段'">
        <span class = "pop_col41"  style = "vertical-align:bottom"> 
          <qwui-select 
          :dataList = "businessProcess" 
          @selectItem = "selectBusinessProcess(slotProps.setting)" 
          v-model = "slotProps.setting.process"
          borderType = "rightAngle"
          ></qwui-select>
        </span>
        <span class = "pop_col51 "> 
          <input type="number" v-model = "slotProps.setting.winRate" :disabled = "slotProps.setting.process != '1'" @input = "changeInput(slotProps)">&nbsp;&nbsp;%
        </span>
      </template>
    </custom>  
  </div>
</template>
<script>
import custom from "../components/custom"
import {
  getBusinessCustom,
  saveBusinessCustom
} from "crm/api/setting/index.js";
import qwuiSelect from "@/components/qwuiBase/qwuiSelect/QwSelect";
export default {
  components: {
    custom,
    qwuiSelect
  },
  data() {
    return {
      basicList: [],
      strList: [],
      xialaField: [],
      mustWriteField: [],
      mustUsedField: [],
      pageName: ["设置", "商机自定义字段设置"],
      businessProcess: [
        {
          optionName: "进行中",
          val: 1
        },
        {
          optionName: "赢单",
          val: 2
        },
        {
          optionName: "输单",
          val: 3
        }
      ],
      list: [
        {
          isShow: "1",
          id: "",
          sort: 0,
          name: "初步交流",
          hasSelect: "",
          process: 1,
          winRate: "10.0"
        },
        {
          isShow: "1",
          id: "",
          sort: 1,
          name: "需求沟通",
          hasSelect: "",
          process: 1,
          winRate: "30.0"
        },
        {
          isShow: "1",
          id: "",
          sort: 2,
          name: "商务沟通",
          hasSelect: "",
          process: 1,
          winRate: "50.0"
        },
        {
          isShow: "1",
          id: "",
          sort: 3,
          name: "签约交款",
          hasSelect: "",
          process: 2,
          winRate: "100.0"
        },
        {
          isShow: "1",
          id: "",
          sort: 4,
          name: "签约失败",
          hasSelect: "",
          process: 3,
          winRate: "0.0"
        }
      ]
    };
  },
  mounted() {
    dataBase.loading = true
    getBusinessCustom().then(res => {
      dataBase.loading = false
      if (res.code == "0") {
        this.basicList = res.data.basicList;
        this.strList = res.data.list;
        this.basicList.forEach(ele => {
          ele.status = ele.status == "1" ? true : false
          ele.isMust = ele.isMust == "1" ? true : false
          //当接口没有目前阶段的配置数据为空时，给默认值
          if(ele.optionName == '目前阶段' && ele.list.length == 0){
            ele.list = this.list
          }
          ele.list.forEach( li => {
            li.isShow = li.isShow == '1' ? true : false
          })
        })

        this.strList.forEach(item => {
          item.status = item.status == "1" ? true : false;
          item.isMust = item.isMust == "1" ? true : false;
          item.list.forEach( li => {
            li.isShow = li.isShow == '1' ? true: false
          })
        });
        this.xialaField = ["目前阶段", "商机类别"];
        this.mustUsedField = ["标题", "所属客户", "目前阶段", "结单日期"];
        this.mustWriteField = ["标题", "所属客户", "目前阶段", "结单日期"];
      } else {
        dataBase.alert("提示", res.desc)
      }
    });
  },
  methods: {
    //保存商机自定义字段
    save(basicList, strList) {
      let flag = true;
      let newBasicList = basicList.map(item => {
        item.list.forEach( li => {
          li.isShow = li.isShow ? '1' : '0'
        })
        return {
          id: item.id,
          itemId: item.itemId,
          optionName: item.optionName,
          status: item.status ? "1" : "0",
          isMust: item.isMust ? "1" : "0",
          list:item.list
        }
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
      if(flag){
        saveBusinessCustom(obj)
        .then(res => {
          if (res.code == "0") {
            dataBase.top_alert("保存成功", true, 1000);
            setTimeout(() => {
              this.$router.go(-1);
            }, 500)
          } else {
            dataBase.alert("提示信息", res.desc);
          }
        })
        .catch(() => {
          dataBase.alert("提示信息", res.desc);
        })
      }
      
    },
    //选择商机进程
    selectBusinessProcess(obj) {
      obj.winRate = obj.process == 1 ? "" : obj.process == 2 ? "100.0" : "0.0";
    },
    //限制赢率的数值
    changeInput(obj){
      if(!(/^100$|^(\d|[1-9]\d)(\.\d+)*$/).test(obj.setting.winRate)){
        obj.setting.winRate = ''
      }
    }
  }
};
</script>
<style lang="scss">
@import './custom.scss';
.pop_col41 {
  display: inline-block;
  width: 120px;
  margin-left:5px;
  input {
    width: 100px;
    height: 28px;
    border: 1px solid #c6c6c6;
    padding-left: 10px;
  }
}
.pop_col51 {
  display: inline-block;
  width:80px;
  margin-left:18px;
  input {
    width: 40px;
    height: 28px;
    border: 1px solid #c6c6c6;
    padding-left: 10px;
  }
}



// .addIcon{
//   margin-left:10px !important;
// }
</style>
