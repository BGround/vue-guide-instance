<template>
  <qw-modal v-model="visible"
            class="pool-pick-person"
            :title="`添加公海负责人(${checkedList.length})`"
            @on-confirm="onConfirm"
            :zIndex=99>
    <div class="pick-person-container">
      <template v-if="list.length>0">
        <div class="pick-person-header">
          <div>账户名称</div>
          <div>绑定用户</div>
        </div>
        <div class="user-list"
             v-scroll="loadMore">
          <div class="item"
               v-for="(item, index) in list"
               :key="index">
            <div class="item-left">
              <p>{{item.accountName}}</p>
              <span v-if="item.isAdmin=='0'">超管</span>
            </div>
            <div class="item-right">
              <p>{{item.personName}}</p>
              <qw-checkbox v-model="item.checked"
                           @change="(val)=>{onChange(item,val)}"></qw-checkbox>
            </div>
          </div>
        </div>
      </template>
      <qw-nodata v-else-if="loadStatus=='nodata'"
                 tips="还没有子账户，请在子账户管理中添加"></qw-nodata>
    </div>
  </qw-modal>
</template>
<script>
import QwModal from "crm/components/qwModal";
import QwCheckbox from "@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
import QwNodata from "crm/components/qwNodata";
import scroll from "crm/directives/scroll";
import { getUserListForCrmPool } from "crm/api/setting";
export default {
  name: "poolPickPerson",
  directives: {
    scroll
  },
  components: {
    QwModal,
    QwCheckbox,
    QwNodata
  },
  props: {
    value: {
      default: false
    },
    defaultChecked: {
      type: Array,
      default: () => []
    },
    poolId: String
  },
  data() {
    return {
      visible: false,
      params: {
        page: 1,
        size: 10
      },
      loadStatus: "",
      list: [],
      checkedList: []
    };
  },
  watch: {
    visible(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.visible = val;
      if (val && this.defaultChecked && this.defaultChecked.length >= 0) {
        this.checkedList = JSON.parse(JSON.stringify(this.defaultChecked));
        this.checkedList.forEach(item=>{
          let accountName =item.personName;
          item.personName = item.accountName;
          item.accountName =accountName;
        })
        this.list.forEach(item => {
          this.$set(
            item,
            "checked",
            this.checkedList.some(per => {
              return per.accountId === item.accountId;
            })
          );
        });
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    loadMore(el) {
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if (scrollTop + offsetHeight >= scrollHeight - 80) {
        if (!this.loadStatus) {
          this.params.page += 1;
          this.getUserList();
        }
      }
    },
    getUserList() {
      this.loadStatus = "loading";
      getUserListForCrmPool(this.params).then(res => {
        if (res.code == "0") {
          // console.log(res);
          this.params.page = res.data.currPage;
          // // 加载的结果 初始化选中
          let arr = res.data.pageData
            ? res.data.pageData.map(item => {
                let data = {
                  headPic: item.headPic,
                  id: item.id,
                  accountName: item.personName,
                  accountId: item.personId,
                  poolAccount: item.userName,
                  userId: item.qyUserId,
                  personName: item.qyUserName,
                  wxUserId: item.wxUserId,
                  isAdmin: item.age
                };
                if (
                  this.checkedList.some(per => {
                    return per.accountId === data.accountId;
                  })
                ) {
                  data.checked = true;
                }
                return data;
              })
            : [];
          if (res.data.currPage == 1) {
            this.list = arr || [];
          } else {
            this.list = this.list.concat(arr);
          }
          if (this.list.length === 0) {
            this.loadStatus = "nodata";
          } else if (res.data.currPage >= res.data.maxPage) {
            this.loadStatus = "nomore";
          } else {
            this.loadStatus = "";
          }
        } else {
          this.loadStatus = "loadfail";
          dataBase.alert("提示信息", res.desc);
        }
      });
    },
    onChange(item, checked) {
      // console.log("onChange", item, checked);
      if (checked) {
        this.checkedList.push(item);
      } else {
        this.checkedList = this.checkedList.filter(per => {
          return per.userId != item.userId;
        });
      }
    },
    init() {
      this.params.page = 1;
      this.params.poolId = this.poolId;
      this.loadStatus = "";
      this.list = [];
      this.checkedList = [];
      this.getUserList();
    },
    onConfirm() {
      this.$emit("on-confirm", JSON.parse(JSON.stringify(this.checkedList)));
    }
  }
};
</script>
<style lang="scss" scoped>
.pool-pick-person {
  .pick-person-container {
    width: 600px;
    height: 400px;
    display: flex;
    flex-direction: column;
    .pick-person-header,
    .user-list .item {
      display: flex;
      > div {
        flex: 1;
        padding: 8px 15px;
        text-align: left;
      }
    }
    .pick-person-header {
      color: #666;
    }
    .user-list {
      flex: 1;
      overflow-y: auto;
      .item {
        &-left {
          display: flex;
          span {
            display: inline-block;
            width: 34px;
            height: 20px;
            line-height: 20px;
            margin-left: 12px;
            text-align: center;
            color: #fff;
            background: #9fd457;
          }
        }
        &-right {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
