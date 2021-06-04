<template>
  <div class="qwui-popup"
       ref="qwuiPopup"
       @click.prevent=""
       @click.stop=""
       :style="{width: width}"
  >
    <div class="list-search" v-if="showSearch">
      <div class="search-box">
        <i class="search-icon"></i>
        <input type="text" placeholder="搜索" @input="doSearch($event)" @keyup.enter="search($event.target.value)">
      </div>
    </div>
    <div class="popup-list">
      <div class="popup-list-item check-icon"
           v-for="item in list" :key="item._id"
           @click="changeIndex(item)"
           :class="{colorGray:notChoice(item)}"
      >
        <i :class="{active:value.includes(item._id),noClick:notChoice(item)}"></i>
        <span class="item-value">{{item.value}}<span v-if="notChoice(item)">(选项名额已空)</span></span>
      </div>
    </div>
    <div v-if="!isRadio && list.length"
         class="popup-list-item check-icon checkAll"
         @click="selectAll()">
      <i :class="{active: checkSelectedAll}"></i>
      <span class="item-value">全选</span>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      field: {
        type: Object,
        default: () => {
          return {
            choices: [],
            _type: "",         //CheckBox复选，DropDown单选
            value: "",
          }
        }
      },
      selectQuota: {
        type: Object,
        default: {}
      },
      width: {
        type: String,
        default: "auto"
      },
      showSearch: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        list: [],
        value: '',
        timer: null,
      }
    },
    computed: {
      isRadio() {
        return this.field._type == "DropDown";
      },
      checkSelectedAll() {
        return this.list.every((item) => this.value.includes(item._id));
      }
    },
    created() {
      var _this = this;
      if (this.isRadio) {
        this.value = this.field.value || '';
      } else {
        this.value = this.field.value || [];
      }
      this.list = this.field.choices;

      //添加点击关闭事件
      // document.body.addEventListener('click', this.close, false)
    },
    methods: {//选项名额已空
      notChoice(item) {
        return this.selectQuota[item._id] && this.selectQuota[item._id].selectedNum >= item.quota
      },
      close() {
        this.$emit('listenShow', false)
      },
      changeIndex(item) {
        if (this.notChoice(item)) return
        if (this.isRadio) {
          this.value = this.value == item._id ? "" : item._id;
          this.$emit('getItem', this.value);
          this.close()
        } else {
          this.value.includes(item._id) ? this.value.remove(item._id) : this.value.push(item._id)
          this.$emit('getItem', this.value);
        }
      },
      selectAll() {
        var checkAll = this.checkSelectedAll;
        if (this.field.choices.length == this.list.length && checkAll) {
          this.value = [];
        } else {
          if (checkAll) {
            this.list.forEach(item => {
              this.value.includes(item._id) && this.value.remove(item._id)
            });
          } else {
            this.list.forEach(item => {
              !this.value.includes(item._id) && this.value.push(item._id)
            });
          }
        }
        this.$emit('getItem', this.value);
      },
      doSearch({target}) {
        var _this = this;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          _this.search(target.value)
        }, 1000);
      },
      //按enter搜索
      search(key) {
        if (!key) {
          this.list = this.field.choices;
        } else {
          this.list = [];
          this.field.choices.forEach(item => {
            if (item.value.includes(key)) {
              this.list.push(item)
            }
          })
        }
      }
    },
    beforeDestroy() {
      document.body.removeEventListener('click', this.close, false)
    }
  }
</script>
<style scoped lang="scss">
  .qwui-popup {
    position: absolute;
    margin-top: 4px;
    background: #fff;
    z-index: 13;
    box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.08);
  }

  .list-search {
    width: 100%;
    height: 56px;
    padding: 12px;

  .search-box {
    display: flex;
    flex-direction: row;
    height: 32px;
    border: 1px solid #d5d5d5;

  .search-icon {
    width: 16px;
    height: 16px;
    margin: 8px 12px;
    background: url(../../../assets/images/ic_search.png) no-repeat;
    background-size: contain;
  }

  input {
    width: 100%;
    line-height: 32px;
    background: transparent;
  }

  }
  }

  .popup-list {
    background: #fff;
    max-height: 200px;
    overflow-y: scroll;
  }

  .check-icon i {
    position: absolute;
    left: 12px;
    top: 8px;
    display: inline-block;
    width: 16px;
    height: 18px;
    background: url(../../../assets/images/icon_form_check-unselected.png) no-repeat;
    background-size: 100%;
    margin-right: 10px;
    vertical-align: text-bottom;
  }

  .check-icon i.noClick {
    background: url(../../../assets/images/icon_form_single-dis.png) no-repeat;
    background-size: 100%;
  }

  .check-icon i.active {
    background: url(../../../assets/images/icon_form_check-checked-pc.png) no-repeat;
    background-size: 100%;
  }

  .popup-list-item {
    position: relative;
    width: 100%;
    padding: 0;
    font-size: 15px;
    line-height: 20px;
    word-break: break-all;
  }

  .popup-list-item:hover {
    background: #f7f8fa;
  }

  .checkAll {
    background: #f7f8fa;
  }

  .popup-list-item .item-value {
    display: inline-block;
    padding: 6px 10px;
    margin-left: 32px;
  }

  /*滚动条*/
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background: #fff;
  }
  ::-webkit-scrollbar-track {/*滚动条里面轨道*/
    background: #fff000;
  }

</style>
