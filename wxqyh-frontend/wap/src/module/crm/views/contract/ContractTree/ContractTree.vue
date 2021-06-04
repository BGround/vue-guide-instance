<template>
    <div class="treeListWrap wrap">
        <search-box 
            :searchinput="searchConfig"
            @listenToSearchBox="showMsgFromSearchBox">
        </search-box>
    <div class="treeListAll" v-scroll="loadMore">
        <qw-tree-item
            v-model="selectValue"
            :options="options"
            :config="config"
        ></qw-tree-item>
        <div class="member_tips"></div>
        <!-- <div class="search-result" v-show="showNoTips">
            <div class="ss">
                <i class="search-image"></i>
            </div>
            <span class="search-text">没有记录</span>
        </div> -->
    <crm-no-record v-if="showNoTips" 
    type="noSearch" tips="没有数据，马上创建一个吧"></crm-no-record>
    </div>
    <div class="treeBtn_wrap">
        <qw-tree-button class="tree-btn"
            @cancelSelected="cancelSelected"
            @confirmSelected="confirmSelected"
            @showSelectedItem="showSelectedItem"
            :subTitle="selectName"
        ></qw-tree-button> 
    </div>    
   <div class="crm_fixed_nail"
      v-show="showAdd"
        @click="onClickAdd"></div>
  </div>
</template>


<script>
import QwTreeItem from "@/components/tree/treeItem";
import QwTreeButton from "@/components/tree/treeButton";
import QwTreeList from "@/components/tree/treeList";
import LoadMore from '@/components/list/load_more';
import SearchBox from "@/components/base/search_box";
import treeListVue from '../../../../demo/tree/treeList.vue';
import CrmNoRecord from 'crm/components/CrmNoRecord';
import{ mapActions} from "vuex";
export default {
  name: "ContractTree",
  components: {
    QwTreeItem,
    LoadMore,
    QwTreeButton,
    SearchBox,
    CrmNoRecord
  },
  props: {
    checkConfirm: {
      type:[Array, String],
      default: ''
    },

    // 树列表数据
    options: {
        type: Array,
        required: true,
        default: () => {
            return [];
        }
    },

    // 树列表配置
    config: {
        type: Object,
        required: true,
        default: () => {
            return {};
        }
    },

    // 已选择数据
    treeSelectVal: {
        type: [String, Array],
        default: ''
    },

    // 搜索框配置
    searchConfig: {
        type: Object,
        default: () => {
            return {
                show: true,
                ridMask: true
            }
        }
    },

    // 是否显示无记录提示
    showNoTips: {  
        type: Boolean,
        default: false
    } 
  },
  data() {
        return {
            loadingMore: false,  // 是否正在加载
            totalRows: 0,  // 总成员数
            page: 1,  // 当前页数  
            maxPage: 0,  // 最大页数
            hasMore: true,  // 是否有更多数据
            showTreeList: false,  // 是否显示列表
            selectValue: this.treeSelectVal,  // 已选择数据 
            cacheSelectConfig:""
        }
    },
    computed:{
      // 当前获取的数据个数
      selectName() {
        if(this.config.checkType==='radio' && this.selectValue.length>0) {
          return '1 个'
        }
        return this.selectValue.length + '个'
      },
      showAdd(){
        //客户 商机 客户签约人
         return ["belongClient",'belongBusiness','clientSignatory'].includes(this.checkConfirm)
      }
    },
    created () {
        this.init();
    },
    mounted () {
        // // 计算列表高度
        // this.$nextTick(() => {
        //     let windowHeight = document.documentElement.clientHeight;
        //     document.querySelector(".treeListWrap").style.height = `${windowHeight}px`;
        // });  
    },
  activated() {
    this.cacheSelectConfig&&this.$set(dataBase,"selectConfig",JSON.parse(this.cacheSelectConfig))
    this.delCacheArray("ContractOperate");
  },
    methods: {
       ...mapActions("list", ["setCacheArray", "delCacheArray"]),
        // 搜索框搜索
        showMsgFromSearchBox (keyWord, val) {
            this.$emit('handleSearch', keyWord, val);
        },

        //点击+
        onClickAdd(){
          this.setCacheArray({ name: "ContractOperate" });
          this.cacheSelectConfig = JSON.stringify(dataBase.selectConfig)
          let path = {
            belongClient:"/clientOperate",
            belongBusiness:"/businessOperate",
            clientSignatory:"/contactOperate",
          }[this.checkConfirm]
          setTimeout(()=>{
            this.$router.push({path,query:{
              from:"select"
            }})
          })
        },
        // 滚动加载更多
        loadMore (el) {
            let scrollTop = el.scrollTop;
            let offsetHeight = el.offsetHeight;
            let scrollHeight = el.scrollHeight;

            if(scrollTop + offsetHeight >= scrollHeight - 10){
                this.$emit('treeLoadMore');
            }
        },

        // 按确认键
        confirmSelected () {
            let arr = [], items = [];
            this.config.checkType === 'radio'? arr.push(this.selectValue) : arr = [...this.selectValue];

            // 获取当前选中的数据项
            arr.map((arrItem, idx) => {
                this.options.map((optionItem, idx) => {
                    if(arrItem === optionItem.id){
                        items.push(optionItem);
                    }
                })
            });
            this.$emit('selectTree', items, this.selectValue);
            this.$emit("closeTree");
        },

        // 取消键
        cancelSelected (val) {
            this.$emit("closeTree");
        },

        showSelectedItem(selectedItems) {

        },

        // 初始化
        init () {
            this.$emit('loadTreeData');
        }
    }
};
</script>

<style lang="scss" scoped>
@import './ContractTree.scss';
@import "crm/components/CrmFixedNail/CrmFixedNail.scss";
</style>
