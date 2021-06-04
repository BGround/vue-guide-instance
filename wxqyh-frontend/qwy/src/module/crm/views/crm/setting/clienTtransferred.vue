<template>
  <div class="setting-clent-transferred">
    <div class="clent-transferred-header">
      <setting-header :pages="['设置','客户负责人转派']"
                      @go-back="$router.go(-1)"></setting-header>
    </div>

    <div class="clent-transferred-body">
      <section class="person">
        <div class="person-left">
          原负责人：
          <qw-button @click="showPickPersionFrom=true">添加</qw-button>
          <div class="person-count">
            <div class="person-count-tag"
                 v-for="(item,index) in fromUsers"
                 :key="item.userId">
              <div class="tag-icon">
                <img :src="item.headPic"
                     alt="">
              </div>
              <div class="tag-name">{{item.personName}}</div>
              <div class="tag-close"
                   @click="onDeletePerson('from',index)">×</div>
            </div>
          </div>
          <pick-person :show="showPickPersionFrom"
                       :defaultUsers="fromUsers"
                       :functionTab="pickPersonTab"
                       :maxUser="1"
                       @chooseDone="(...arg)=>{chooseDone('from',...arg)}"
                       @closeThis="showPickPersionFrom=false">
          </pick-person>
        </div>
        <div class="person-right">
          转派给：
          <qw-button @click="showPickPersionTo=true">添加</qw-button>
          <div class="person-count">
            <div class="person-count-tag"
                 v-for="(item,index) in toUsers"
                 :key="item.userId">
              <div class="tag-icon">
                <img :src="item.headPic"
                     alt="">
              </div>
              <div class="tag-name">{{item.personName}}</div>
              <div class="tag-close"
                   @click="onDeletePerson('to',index)">×</div>
            </div>
          </div>
          <pick-person :show="showPickPersionTo"
                       :defaultUsers="toUsers"
                       :functionTab="pickPersonTab"
                       :maxUser="1"
                       @chooseDone="(...arg)=>{chooseDone('to',...arg)}"
                       @closeThis="showPickPersionTo=false">
          </pick-person>
        </div>
      </section>
      <section class="result">
        <div class="result-tips">
          <p>已选择客户({{clientChecked.length}}) </p>
          <template v-if="loadStatus!=='nomore'">
            <span v-if="loadStatus==='nodata'"
                  type="error">该负责人没有关联的客户信息</span>
            <span v-else>请选择“原负责人”查询客户信息</span>
          </template>
        </div>
        <template v-if="resultList&&resultList.length>0">
          <div class="result-list">
            <table>
              <thead>
                <tr>
                  <th>
                    <span>
                      <qw-checkbox v-model="checkAll"></qw-checkbox>
                    </span>
                  </th>
                  <th>客户名称</th>
                  <th>客户类别</th>
                  <th>地址</th>
                  <th>更新时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in resultList"
                    :key="index">
                  <td>
                    <qw-checkbox v-model="item.checked"
                                 @change="(val)=>{onCheck(item,val)}"></qw-checkbox>
                  </td>
                  <td>{{item.clientName}}</td>
                  <td>{{item.typeNames}}</td>
                  <td>{{item.address}}</td>
                  <td>{{item.updateTime}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="result-page">
            <page :pageData="pageSetting"
                  @change="pageChage"></page>
          </div>
        </template>
      </section>
      <section class="addition">
        <div class="addition-label">同时转派：</div>
        <div class="addition-checkbox">
          <qw-checkbox v-model="addition.switch1">该客户的联系人负责人</qw-checkbox>
          <qw-checkbox v-model="addition.switch2">该客户的商机负责人</qw-checkbox>
          <qw-checkbox v-model="addition.switch3">该客户的拜访单负责人</qw-checkbox>
        </div>
      </section>
    </div>

    <div class="clent-transferred-fotter">
      <qw-button type="primary"
                 @click="save">确认转派</qw-button>
    </div>
  </div>
</template>
<script>
import SettingHeader from "./components/settingHeader";
import qwButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import pickPerson from "@/components/pickPerson/pickPerson";
import QwCheckbox from "@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
import Page from "@/components/list/page";
import { seachClient, updateClientUser } from "crm/api/setting";
export default {
  name: "settingClentTransferred",
  components: {
    SettingHeader,
    qwButton,
    pickPerson,
    QwCheckbox,
    Page
  },
  data() {
    return {
      resultList: [],
      showPickPersionFrom: false,
      showPickPersionTo: false,
      fromUsers: [],
      toUsers: [],
      pickPersonTab: [
        { text: "标签人员" },
        { text: "特定人员" },
        { text: "高级筛选" }
      ],
      loadStatus: "",
      pageSetting: {
        // 分页器相关配置
        maxPage: 1,
        totalRows: "",
        page: 1,
        pageSize: 10
      },
      addition: {
        switch1: 0,
        switch2: 0,
        switch3: 0
      },
      clientChecked: []
    };
  },
  computed: {
    checkAll: {
      get() {
        return this.resultList.every(item => {
          return item.checked;
        });
      },
      set(val) {
        this.resultList.forEach(item => {
          if (item.checked !== val) {
            this.$set(item, "checked", val);
            this.onCheck(item, val);
          }
        });
        return val;
      }
    }
  },
  watch: {
    fromUsers(val) {
      if (val.length === 0) {
        this.resultList = [];
        this.loadStatus = "";
        this.pageSetting = {
          // 分页器相关配置
          maxPage: 1,
          totalRows: "",
          page: 1,
          pageSize: 10
        };
      } else {
        this.pageSetting.originalUserId = val[0].userId;
        this.getClient();
      }
    }
  },
  created() {},
  methods: {
    chooseDone(key, dept, tagList, users, position) {
      this.showPickPersionFrom = false;
      this.showPickPersionTo = false;
      this[key + "Users"] = JSON.parse(JSON.stringify(users)) || [];
    },
    onDeletePerson(key, index) {
      this.$delete(this[key + "Users"], index);
    },
    pageChage() {
      this.getClient();
    },
    getClient() {
      dataBase.loading = true;
      this.loadStatus = "loading";
      seachClient(this.pageSetting)
        .then(res => {
          if (res.code == "0") {
            this.pageSetting.maxPage = res.data.maxPage;
            this.pageSetting.totalRows = res.data.totalRows;

            this.resultList =
              (res.data.pageData &&
                res.data.pageData.map(item => {
                  item.checked = this.clientChecked.some(per => {
                    return per.id === item.id;
                  });
                  return item;
                })) ||
              [];

            if (this.resultList.length === 0 && res.data.currPage === 1) {
              this.loadStatus = "nodata";
            } else if (res.data.currPage >= res.data.maxPage) {
              this.loadStatus = "nomore";
            } else {
              this.loadStatus = "";
            }
          } else {
            dataBase.alert("提示信息", res.desc);
          }
        })
        .catch(err => {
          dataBase.alert("提示信息", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    },
    onCheck(item, boolean) {
      if (boolean) {
        this.clientChecked.push(item);
      } else {
        this.clientChecked = this.clientChecked.filter(per => {
          return per.id != item.id;
        });
      }
    },
    isChecked() {
      if (this.fromUsers.length === 0) {
        dataBase.top_alert("请选择原负责人", false, 2000);
        return false;
      }
      if (this.clientChecked.length === 0) {
        dataBase.top_alert("请选择要转派的客户", false, 2000);
        return false;
      }
      if (this.toUsers.length === 0) {
        dataBase.top_alert("请选择转派人", false, 2000);
        return false;
      }
      if (this.fromUsers[0].userId === this.toUsers[0].userId) {
        dataBase.top_alert("转派人不能是原负责人", false, 2000);
        return false;
      }
      return true;
    },
    save() {
      if (this.isChecked()) {
        let _data = {
          originalUserId: this.fromUsers[0].userId,
          givenUserIds: this.toUsers[0].userId,
          clientIds: (() => {
            let ids = "";
            this.clientChecked.forEach(item => {
              if (!ids) {
                ids = item.id;
              } else {
                ids += "|" + item.id;
              }
            });
            return ids;
          })()
        };
        Object.keys(this.addition).forEach(key => {
          _data[key] = Number(this.addition[key]);
        });
        dataBase.loading = true;
        updateClientUser(_data)
          .then(res => {
            if (res.code == "0") {
              dataBase.top_alert("转移成功", true, 2000);
              this.init();
            } else {
              dataBase.alert("提示信息", res.desc);
            }
          })
          .catch(err => {
            dataBase.alert("提示信息", "网络错误");
          })
          .finally(() => {
            dataBase.loading = false;
          });
      }
    },
    init() {
      this.resultList = [];
      this.fromUsers = [];
      this.toUsers = [];
      this.clientChecked = [];
      this.addition = {
        switch1: 0,
        switch2: 0,
        switch3: 0
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-clent-transferred {
  .clent-transferred-header {
    margin-bottom: 10px;
  }
  .clent-transferred-body {
    padding: 20px 0;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    .person {
      display: flex;
      margin-bottom: 30px;
      .person-left,
      .person-right {
        flex: 1;
        display: flex;
        align-items: center;
        button {
          margin: 0 10px;
        }
      }
      .person-count {
        &-tag {
          background-color: #eee;
          border: 1px solid #ccc;
          height: 24px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          // margin: 0 5px 5px;
          .tag-icon {
            height: 24px;
            width: 24px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .tag-name {
            margin-left: 5px;
            max-width: 8em;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .tag-close {
            color: #afafaf;
            font-size: 19px;
            font-weight: 600;
            cursor: pointer;
            margin: 0 5px;
          }
        }
      }
    }
    .result {
      padding: 20px 0 15px;
      border-top: 1px dashed #ccc;
      border-bottom: 1px solid #ccc;
      &-tips {
        display: flex;
        span {
          color: #999;
          margin-left: 10px;
          &[type="success"] {
            display: none;
          }
          &[type="error"] {
            color: red;
          }
        }
      }
      &-list {
        table {
          color: #666666;
          width: 100%;
          margin: 10px;
          thead {
            background: #f8f8f8;
          }
          th {
            font-weight: bold;
          }
          th,
          td {
            padding-left: 10px;
            border-color: #dbdbdd;
            word-wrap: break-word;
            text-align: left;
            vertical-align: middle;
            border-bottom: 1px solid #cccccc;
            &:first-child {
              padding-top: 10px;
              width: 15px;
            }
          }
          tbody {
            tr {
              cursor: default;
              &:hover {
                background-color: #f8f8f8;
              }
            }
          }
        }
      }
    }
    .addition {
      margin-top: 30px;
      display: flex;
      &-checkbox {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        .qwui-checkbox {
          margin-bottom: 5px;
        }
      }
    }
  }
  .clent-transferred-fotter {
    text-align: center;
    margin: 20px;
  }
}
</style>


