<template>
  <qw-select-modal class="select-client-modal"
                   title="选择商机"
                   v-model="visible"
                   :checkedList.sync="checkedList"
                   :searchList="searchList"
                   :list="list"
                   @on-search="onSearch"
                   @load-more="getList"
                   @search-load-more="getSearchList"
                   :max="1"
                   @on-confirm="onConfirm" 
                   :load-status="loadStatus"
                   :search-load-status="searchLoadStatus"></qw-select-modal>
</template>

<script>
  import QwSelectModal from "crm/components/qwSelectModal";
  import { visitBusinessList } from "crm/api/visit";

  export default {
    name: "selectBusinessModal",
    components: {
      QwSelectModal
    },
    props: {
      value: {
        default: false
      },
      defaultCheckedList: {
        type: Array,
        default: () => []
      },
      selectClientId:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        visible: false,
        list: [],
        checkedList: [],
        searchList: [],
        params: {
          page: 1,
          pageSize: 15,
          selectClientId:'',
        },
        searchParams: {
          page: 1,
          keyWord: "",
          selectClientId:'',
        },
        loadStatus: "",
        searchLoadStatus: ""
      };
    },
    watch: {
      value(val) {
        this.visible = val;
        if (val) {
          this.init();
        }
      },
      visible(val) {
        this.$emit("input", val);
      }
    },
    methods: {
      init() {
        if ( JSON.stringify(this.defaultCheckedList) !== JSON.stringify(this.checkedList)){
          this.checkedList = this.defaultCheckedList;
        }
        this.params = {
          page: 1,
          pageSize: 15,
          selectClientId:'',
        };
        this.searchParams = {
          page: 1,
          keyWord: "",
          selectClientId:'',
        };
        this.loadStatus='';
        this.list=[];
        this.searchList=[];
        this.getList();
      },

      getList() {
        if (this.loadStatus) {
          return;
        }
        this.loadStatus = "loading";
        this.params.selectClientId = this.selectClientId;
        visitBusinessList(this.params).then(res => {
          if (res.code == "0") {
            this.params.page = res.data.currPage + 1;
            // // 加载的结果 初始化选中
            let arr = res.data.pageData
              ? res.data.pageData.map(item => {
                item.label = item.title;
                item.value = item.id;
                item.icon = item.headPic || '';
                if (
                  this.checkedList.some(per => {
                    return per.id === item.id;
                  })
                ) {
                  item.checked = true;
                }
                return item;
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
          console.log("1",this.loadStatus)
        });
      },

      onSearch(val) {
        this.searchParams.page = 1;
        this.searchList = [];
        if (val) {
          this.searchParams.keyWord = val;
          this.searchParams.selectClientId = this.selectClientId;
          this.searchLoadStatus="";
          this.getSearchList();
        }
      },

      getSearchList() {
        if (this.searchLoadStatus) {
          return;
        }
        this.searchLoadStatus = "loading";
        visitBusinessList(this.searchParams).then(res => {
          if (res.code == "0") {
            this.searchParams.page = res.data.currPage + 1;
            let _arr = [];

            //格式化
            res.data.pageData &&
            res.data.pageData.forEach(item => {
              item.label = item.title;
              item.value = item.id;
              item.icon = item.headPic || '';
              if (
                this.checkedList.every(per => {
                  return item.id != per.id;
                })
              ) {
                //剔除已经选定项
                _arr.push(item);
              }
            });

            if (res.data.currPage == 1) {
              this.searchList = _arr;
            } else {
              this.searchList = this.searchList.concat(_arr);
            }

            if (this.searchList.length === 0) {
              this.searchLoadStatus = "nodata";
            } else if (res.data.currPage >= res.data.maxPage) {
              this.searchLoadStatus = "nomore";
            } else {
              this.searchLoadStatus = "";
            }
          } else {
            this.searchLoadStatus = "loadfail";
            this.dataBase.alert("提示信息", res.desc);
          }
        });
      },

      onConfirm() {
        this.visible = false;
        this.$emit("on-confirm", JSON.parse(JSON.stringify(this.checkedList)));
      }
    }
  };
</script>
<style lang="scss" scoped>
  /*.select-client-modal {}*/
</style>

