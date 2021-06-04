<template>
  <qw-tip-input :optionList="userList"
                type="search"
                placeholder="成员名称"
                @input="dealInput"
                @search="dealSearch"
                :maxCount="maxCount"
                ref="tipInput"></qw-tip-input>
</template>

<script>
import QwTipInput from "@/module/crm/components/qwui-tipInput";
import { getPerson } from "@/module/crm/api/territorialSea";
const PAGE_SIZE = 10;
const SUCCESS_CODE = "0";
const EVENT_SEARCH = "search";
export default {
  components: { QwTipInput },
  data() {
    return {
      userList: [],
      keyWord: "",
      pageSize: PAGE_SIZE,
      searchId: "",
      maxCount: 1
    };
  },
  computed: {},
  methods: {
    _getPerson() {
      let data = {
        keyWord: this.keyWord,
        pageSize: this.pageSize
      };
      getPerson(data).then(res => {
        if (res.code === SUCCESS_CODE) {
          let data = res.data;
          let userList = data.userList;
          let list = [];
          if (userList) {
            userList.forEach((value, index) => {
              let data = {
                label: value.personName,
                value: value.userId,
                icon: value.headPic
              };
              list.push(data);
            });
            this.userList = list;
          } else {
            this.userList = [];
          }
        } else {
          _.alert("提示", res.desc);
        }
      });
    },
    dealInput(newV) {
      this.keyWord = newV;
      this._getPerson();
    },
    dealSearch(searchList) {
      this.searchId = "";
      if (searchList.length > 0) {
        this.searchId = searchList[0].value;
      }
      this.$emit(EVENT_SEARCH, this.searchId);
    },
    init() {
      this.$refs.tipInput.init();
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
