<template>
  <div class="client-advanced-search">
    <div v-if="mainShow">
      <!-- 高级搜索弹窗 -->
      <advanced-search @search="onAdvancedSearch"
                      :setting="advancedSearch.setting"
                      v-show="visible"
                      @close="closeSearch"
                      @checkedRadio="checkedRadio"
                      :cache-search-value="advancedSearch.data"
                      @reset="reset">
        <div slot="footer" class="customer">
          <div class="customer-link" @click="openDraggable">设置筛选条件</div>
        </div>
      </advanced-search>
      <user-choose :selectconfig="userChooseConfig"
                  v-if="userChooseConfig.show"
                  :tabActive="userChooseConfig.signIndex =='depts'?'dept':'group'"
                  :closeUser="userChooseConfig.signIndex =='depts'"
                  :closeGroup="userChooseConfig.signIndex =='depts'"
                  :closeAllTab="userChooseConfig.signIndex =='depts'">
      </user-choose>
    </div>
        <!-- 客户类别 -->
    <transition name="slide">
      <client-type-tree v-show="showClientTypePopup"
        @currentSelected="currentSelected"
        @treeListShow='treeListShow'
        :typeDatas="typeDatas"
        :noData.sync="noData"
        :treeListIsShow.sync="treeListIsShow"
        :searchBoxShow.sync="searchBoxShow"
        :check-confirm="checkConfirm"
        :hasmore="hasmore"
        ref="qwtree">
      </client-type-tree>
    </transition>

    <customer-drag v-show="showDraggable"
      :optionSetting="optionSetting"
      @openDraggable="openDraggable"
      @submitDragData="submitDragData"></customer-drag>

  </div>
</template>
<script>
import userChoose from "@/components/base/user_or_dept_select";
import AdvancedSearch from "@/components/base/AdvancedSearch";
import { customerOption, getOptionSetting, submitDragData, getTypeList } from '../../../api/client/getData';
import customerDrag from '../../../components/drag/drag';

import ClientTypeTree from '../../base/ClientTypeTree';
import {mapMutations,mapActions} from 'vuex'

let fixDragData = [] //拖拽固定传的数据（创建时间）

  // 存放客户类别的配置
  const clientConfig = {
    id: 'id',
    title: 'typeName',
    hasChildren: 'hasChildren',
    checkType: 'checkbox',
    headPic:'',
    parentId:'parentId',
  }

const userChooseConfig = {
  show: false,
  signIndex: "users",
  selectList: {
    users: {
      // 单独选人
      title: "",
      selectType: "group",
      userSelected: [],
      callBack: {
        confirm: null
      }
    },
    depts: {
      // 选部门
      title: "",
      selectType: "dept",
      deptSelected: [],
      callBack: {
        confirm: null
      }
    }
  }
};


export default {
  name: "crm-client-advanced-search",
  components: {
    AdvancedSearch,
    userChoose,
    customerDrag,
    ClientTypeTree
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDraggable: false, // 是否显示设置筛选条件列表
      optionSetting: {}, //后台对应的自定义设置字段
      visible: false,
      userChooseConfig: userChooseConfig, //选人组件配置
      advancedSearch: {
        //高级搜索组件配置
        base_setting: [  // 固定高级搜索字段配置列表
            {
                label: '所有者',
                key: 'tbCrmClientSearchVO.owner',
                type: 'radio',
                show: false,
                value: [
                    { text: '全部', value: '0'},
                    { text: '我负责的', value: '1'},
                    { text: '我相关的', value: '2'},
                    { text: '我创建的', value: '3'},
                ],
            },
            {
                label: '创建时间',
                key: ['tbCrmClientSearchVO.startTime', 'tbCrmClientSearchVO.endTime'],
                type: 'date',
                format: 'YYYY-MM-DD',
                callBack: {
                    start: this.startTimeChange,
                    end: this.endTimeChange
                }

            },
            {
                label: '',
                key: 'stageType',
                type: 'radio',
                value: [
                    { text: '本月', value: '2'},
                    { text: '本季', value: '3'},
                    { text: '今年', value: '1'}
                ],
                noDefault: true
            },
            {
                label: '成交状态',
                key: 'tbCrmClientSearchVO.isWin',
                type: 'radio',
                value: [{ text: '全部', value: ''},{ text: '已成交', value: '1'}, { text: '未成交', value: '0'}],
            },
        ],

        setting: [],

        data: {
          // "tbCrmClientSearchVO.clientType": ""
        },
      },
      showClientTypePopup: false, //竞争客户列表弹窗
      params: {
        //请求客户列表参数
        page: 1,
        pageSize: 15
      },

      typeDatas: [], // 客户类别列表
      clientTypeId: [], // 传入树状组件的客户类别id
      clientTypeSelectData: [], // 存放客户类别已选择数据
      noData: false, // 请求列表无数据
      treeListIsShow: true,
      searchBoxShow:true,
      checkConfirm: '',
      hasmore: true, // 是否有更多数据，传向子组件接收
      mainShow: true, //切换高级搜索或客户类别
    };
  },
  created() {
    this.customerOption();
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    ...mapMutations([
        'updateSelectValue',
        'handleGetData',
        'resetTreeConfigData',
        'changeConfig',
        'updateCurrentSelected'
    ]),

    //高级搜索组件单选回调
    checkedRadio(index, key, value) {
      //年 季 月 被点击 清空时间选择
      if (key === "tbCrmClientSearchVO.stageType") {
        if (this.advancedSearch.data["tbCrmClientSearchVO.startCreateTime"]) {
          this.$set(
            this.advancedSearch.data,
            "tbCrmClientSearchVO.startCreateTime",
            ""
          );
        }
        if (this.advancedSearch.data["tbCrmClientSearchVO.endCreateTime"]) {
          this.$set(this.advancedSearch.data, "tbCrmClientSearchVO.endCreateTime", "");
        }
      }
    },
    // 点击高级搜索确定按钮
    onAdvancedSearch(data) {
      let res = JSON.parse(JSON.stringify(data));
      if (data["tbCrmClientSearchVO.toPerson"]) {
        data["tbCrmClientSearchVO.toPerson"].users.forEach((item, index) => {
          if (index === 0) {
            res["tbCrmClientSearchVO.toPerson"] = item.userId;
          } else {
            res["tbCrmClientSearchVO.toPerson"] += `,${item.userId}`;
          }
        });
      }
      if (data["tbCrmClientSearchVO.ccPerson"]) {
        data["tbCrmClientSearchVO.ccPerson"].users.forEach((item, index) => {
          if (index === 0) {
            res["tbCrmClientSearchVO.ccPerson"] = item.userId;
          } else {
            res["tbCrmClientSearchVO.ccPerson"] += `,${item.userId}`;
          }
        });
      }
      if (data["tbCrmClientSearchVO.createPerson"]) {
        data["tbCrmClientSearchVO.createPerson"].users.forEach((item, index) => {
          if (index === 0) {
            res["tbCrmClientSearchVO.createPerson"] = item.userId;
          } else {
            res["tbCrmClientSearchVO.createPerson"] += `,${item.userId}`;
          }
        });
      }
      const copy_data = JSON.parse(JSON.stringify(this.advancedSearch.setting));
      const copy_res = {};
      copy_res.fieldList = [];
      copy_data.forEach(item => {
        Object.keys(res).forEach(key => {
          if (key.includes(item.optionId)) {
            if (key.includes('custom-')) {
              let value = res[key];
              let obj = {};
              this.$set(obj, 'fieldId', key);
              this.$set(obj, 'fieldValue', value);
              this.$set(obj, 'type', item.customOptionType);
              copy_res.fieldList.push(obj);
            }
          }
        })
      })
      this.$emit("onAdvancedSearch", res, copy_res);
      if (this.$route.path.includes('isread')) {
        this.$emit('changeOperateBtnStatus', true);
      }
      this.$emit('changeSearchBtnStatus', true);
    },

    // 高级搜索重置回调
    reset() {
      this.advancedSearch.setting.forEach(item => {
        if (item.optionId === 'clientType') {
          // 显示 请选择
          this.$set(item, 'isShowPlaceholder', false);
        }
      })

      // 清空搜索条件
      this.$set(this.advancedSearch, 'data', {});

      this.$nextTick(() => {
        // 清空树状节点选中的值，清空选中需要回显的数据
        this.$set(this, 'clientTypeSelectData', []);
        this.$set(this, 'clientTypeId', []);
      })

    },

     //获取高级搜索自定义字段
    customerOption(){
        customerOption().then(res => {
            if(res.code === '0'){
                let searchPageList = res.data.searchPageList

                // 寻找选人setting
                searchPageList.map(item=>{
                    if(item.type==='selectUserOrDepart'){
                        item.selectConfig = userChooseConfig
                    }if (item.optionId === 'clientType') {
                      // optionName为 客户类别 的时候 点击请选择设置回调函数
                      item.type = 'handle'
                      item.isShowPlaceholder = false;
                      item.callBack = this.selectClientType;
                    }
                })

                this.$set(this.advancedSearch, 'setting', []);
                let setting = this.advancedSearch.setting.concat(this.advancedSearch.base_setting);
                setting = setting.concat(searchPageList);
                this.$set(this.advancedSearch, 'setting', setting);
            }
            else{
                _.alert('提示',res.desc);
            }
        })
    },
    openDraggable() {
      this.showDraggable = !this.showDraggable
      this.showDraggable && this.getOptionSetting()//showDraggable为真执行函数
    },
     //获取启用和不启用数据列表
    getOptionSetting(){
        _.showLoading('')
        getOptionSetting().then(res => {
            if(res.code === '0'){
                let optionSetting = res.data
                optionSetting.enabledList.map((item,index) => {
                    if(item.sort === -1){
                        fixDragData = optionSetting.enabledList.splice(index,1)
                    }
                })
                this.optionSetting = optionSetting
            }
            else{
                _.alert('提示',res.desc);
            }
            _.hideLoading('');
        })
    },

    //提交自定义字段拖拽后数据
    submitDragData(enabledList){
        let enabledListData = {
                'enabledList': JSON.stringify(enabledList.concat(fixDragData))
            }
        _.showLoading('')
        submitDragData(enabledListData).then(res => {
            if(res.code === '0'){
                this.openDraggable()
                this.customerOption()
            }
            else{
                _.alert('提示',res.desc);
            }
            _.hideLoading('');
        })
    },

    // 处理树状组件返回的数据
    currentSelected(currentValue,selectedId){
      this.clientTypeSelectData = currentValue
      this.clientTypeId = selectedId;
      this.clientTypeHandle();
    },

    // 按确认键
    treeListShow(val){
      this.mainShow = !val;
    },

    // 选择客户类别
    selectClientType () {
      // 隐藏新建按钮跟底部导航，因为点击 客户类别 请选择 的时候采用的不是z-index 去覆盖，所以改变首页按钮状态
      this.$emit('changeOperateBtnStatus' ,false);
      this.$emit('changeSearchBtnStatus', false);
      this.$refs.qwtree.lock_roll = true;
      this.checkConfirm = 'clientTypeList'
      this.showClientTypePopup = true; // 显示tree
      this.treeListIsShow = true;
      this.mainShow = false;
      // 重置数据 【必要的】
      this.resetTreeConfigData()
      // 修改配置
      this.changeConfig(clientConfig)
      let obj = {
        page: 1,
        pageSize: 15
      }
      getTypeList(obj,(data) => {
        this.handleGetData(data.pageData);
        this.typeDatas = data.pageData;
        this.updateSelectValue(this.clientTypeId);
        this.updateCurrentSelected(this.clientTypeSelectData);
        this.treeListIsShow=true;
        this.searchBoxShow=true;
        this.$refs.qwtree.lock_roll = false;
        this.hasmore = this.params.page >= data.maxPage;
      })
    },

    // 处理客户类别选中后的value ,  还处理选择客户类别后编码的赋值
    clientTypeHandle(){
      // 回显在 客户类别 选择栏的选项。
      let nameStr = '';
      let idStr = '';
      let clientTypeArr = [];
      this.clientTypeSelectData.map(item => {
        clientTypeArr.push(item.typeName);
      })
      this.clientTypeSelectData.forEach(item => {
        nameStr += `${item.typeName},`;
        idStr += `${item.id},`;
      })
      // 回显的客户类别名称处理
      nameStr = nameStr.substring(0, nameStr.length - 1);
      // 高级搜索的clientType 对应的id处理
      idStr = idStr.substring(0, idStr.length - 1);
      this.advancedSearch.setting.forEach(item => {
        if (item.optionId === 'clientType') {
          // 数据回显
          this.$set(item, 'selectValue', nameStr);
          // 显示回显的值，隐藏 请选择
          this.$set(item, 'isShowPlaceholder', true);
          // 将需要搜索的 客户类别 ID赋给搜索条件对象
          this.$set(this.advancedSearch.data, "tbCrmClientSearchVO.clientType", idStr);
        }
        // 未做勾选
        if (nameStr === '') {
          this.$set(item, 'isShowPlaceholder', false);
        }
      })

    },

    // 点击 高级搜索 的取消按钮，关闭高级搜索，恢复新建按钮跟底部导航
    closeSearch() {
      this.visible = false;
      if (this.$route.path.includes('isread')) {
        this.$emit('changeOperateBtnStatus', true);
      }
      // 开启顶部搜索栏
      this.$emit('changeSearchBtnStatus', true);
    }
  },
  mounted() {
    this.visible = this.value;
    userChooseConfig.show = false;
  }
};
</script>

<style lang="scss">
.client-advanced-search {
  .treeListWrap {
    margin-top: 0 !important;
  }
}
</style>
