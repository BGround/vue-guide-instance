<template>
  <transition name="slide">
    <div class="qwui-popup" @click.prevent>
        <search-box
          v-if="showSearch"
          :searchinput="searchBar"
          :keyWord="searchBar.keyWord"
          placeholder="搜索名称"
          @listenToSearchBox="search"></search-box>
      <div class="popup-list">
        <!--<div v-if="false"-->
             <!--class="popup-list-item choice-field-item"-->
             <!--@click="selectAll()">-->
          <!--<i :class="{active:value.length == list.length}"></i>-->
          <!--<span class="item-value">全选</span>-->
        <!--</div>-->
        <div class="popup-list-item choice-field-item"
             v-for="item in list" :key="item.id"
             @click="changeIndex(item)"
             :class="{colorGray:notChoice(item)}"
        >
          <i :class="{active:value.includes(item._id),noClick:notChoice(item)}"></i>
          <span class="item-value">{{item.value}}<span v-if="notChoice(item)">(选项名额已空)</span></span>

        </div>
        <div class="help-block popup-list-item colorRed" v-if="help">{{ help }}</div>
      </div>
      <!--底部操作按钮-->
      <flow_button :buttondata="buttonConfig"></flow_button>
    </div>
  </transition>
</template>
<script>
  import searchBox from '@/components/base/search_box.vue';
  import flow_button from '@/components/button/flow_button';
  import EventBus from '@/utils/eventBus';

  export default {
    props: {
      field: {
        type: Object,
        default: () => {
          return {
            choice: [],
            _type: "",         //CheckBox复选，DropDown单选
            value: ""
          }
        }
      },
      selectQuota: {
        type: Object,
        default: {}
      },
      showSearch: {
        type: Boolean,
        default: false
      }
    },
    components: {
      flow_button,
      searchBox
    },
    data() {
      return {
        list: [],
        help: '',
        value: '',
        buttonConfig: { //操作按钮
          primaryList: [{type: "primary", name: '确定', callBack: null}],
          defaultList: [{type: "default", name: '取消', callBack: null}],
          style: {class: "active"}//按钮是否置底部 active :底部、"":相对定位
        },
        searchBar:{ //头部搜索框
          show:true,
          keyWord:'',
        },
      }
    },
    computed: {
      isRadio() {
        return this.field._type == "DropDown";
      }
    },
    created() {
      var _this = this;
      if (this.isRadio) {
        this.value = this.field.value || '';
      } else {
        this.value = this.field.value ? JSON.parse(JSON.stringify(this.field.value)) : [];
      }
      this.list = this.field.choices;
      this.buttonConfig.primaryList[0].callBack = function () {
        _this.setValue();
      };
      this.buttonConfig.defaultList[0].callBack = function () {
        _this.close();
      }
      window.hasAlert = true;
      EventBus.$on('closeAlert', () => {
        this.close();
      });
    },
    mounted() {
      !this.showSearch && (document.getElementsByClassName("popup-list")[0].style.marginTop = 0);
    },
    methods: {//选项名额已空
      notChoice(item) {
        return this.selectQuota[item._id] && this.selectQuota[item._id].selectedNum >= item.quota
      },
      close() {
        this.$emit('listenShow', false)
        window.hasAlert = false;
      },
      changeIndex(item) {
        if (this.notChoice(item)) return
        if (this.isRadio) {
          this.value = this.value == item._id ? "" : item._id;
        } else {
          this.value.includes(item._id) ? this.value.remove(item._id) : this.value.push(item._id)
        }
      },
      setValue() {
        this.$emit('getItem', this.value);
        this.close();
      },
      search(key) {
        if (!key) {
          this.list = this.field.choices;
          return;
        }
        this.list = [];
        this.field.choices.forEach(item => {
          item.value.includes(key) && this.list.push(item)
        })
      }
    },
  }
</script>
<style scoped>
  .qwui-popup {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f7f8fa;
    z-index: 13;
  }

  .popup-list {
    display: flex;
    flex-direction: column;
    flex: auto;
    background: #fff;
    overflow-x: scroll;
  }

  .popup-list-item {
    width: 100%;
    padding: 0;
    font-size: 15px;
    line-height: 23px;
    border-bottom: 1px solid #F7F8FA;
    word-break: break-all;
  }

  .popup-list-item .item-value {
    display: inline-block;
    padding: 13px 10px;
    margin-left: 32px;
  }

  .choice-field-item i {
    top: 18px;
  }

  .slide-enter-active, .slide-leave-active {
    transition: all .2s ease;
  }

  .slide-enter, .slide-leave-to {
    transform: translateX(100%)
  }

  /*滚动条*/
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

</style>
