<template>
  <div class="selectBox">
    <div class="selectSearchBox"  v-if="isShowSearch">
      <div class="searchInputWrapper">
        <div v-show="!overFlow" class="inputContent">
          <i class="icon_search" @click="enterSearch"></i>
          <i class="qwui-icon_del" v-show="hasInputValue" @click="clearSearchValue"></i>
          <input type="text" v-focus="needFocus" class="searchInput" @keyup.enter="enterSearch" v-model="searchValue" placeholder="搜索名称"/>
        </div>
      </div>
      <label class="selectedLabel" @click="closeThis" v-if="overFlow"><i class="icon_search"></i> <span>搜索</span></label>
    </div>
    <label class="selectAllBar" v-if="defaultAllSelect">
      <input v-model="checkedAll" type="checkbox" class="icon_check">全选
    </label>
    {{title}}
    <div :class="['qwui-selectMain_item',defaultAllSelect?'top':'',isShowSearch?'':'noSearch']">
      <div
          :class="['qwui-user_item',options.length>1?'pb10':'']"
          v-if="searchOptions"
          v-for="(searchOption,index) in searchOptions"
          :key="index"
        >
        <p class="qwui-select_letter_bar"></p>
        <label
          class="qwui-user_item_inner"
          v-for="(item,itemIndex) in searchOption"
          :key="handleItemId(item)"
          >
          <input
            class="icon_check"
            :type="checkedType"
            :value="handleItemId(item)"
            :checked="checkedData.indexOf(handleItemId(item))!==-1"
            @click="checkData(index,$event)"
            >
          <div class="qwui-border_bottom selectItem">
            <div class="avator">
              <img :src="defaultHeadpic(item[config.headpic])" alt="">
            </div>
            <div class="title flexItem">
              <p class="title_main" :class="{'middle':item.departmentName}">{{item[config.name]}}</p>
              <p class="title_sub" v-if="item.departmentName">{{item.departmentName}} {{item.position}}</p>
            </div>
          </div>
        </label>
      </div>
      <div class="bar"></div>
    </div>
  <!--确定按钮-->
    <button_group :fixed="true">
      <qwui_button type="primary" text="确定" @buttonClick="FlowAuditUserResult"></qwui_button>
    </button_group>
  </div>
</template>

<script>
  const DEFAULTPIC= {
    'user':require('../../../assets/images/touxiang02.png'),
    'deptManager':require('../../../assets/images/touxiang02.png'),
    'dept':require('../../../assets/images/icon_dept.png')
  }
  import {qwui_button, button_group} from '@/components/base/button'
  export default {
    name: "user_selected_ranglist",
    components: {
      button_group,
      qwui_button
    },
    props: {
      show: Boolean,
      options:null,
      checked:null,     // 已选
      title:'',         // 标题
      checkedType: {    // 单选 radio,多选 checkbox
        type: String,
      default: 'checkbox',
      },
    defaultAllSelect:{     // false 不显示全选选项
      type:Boolean,
      default: false,
      },
    selectType: {   // 选人类型 部门:'Dep',人:'User'
        type: String,
        default:''
      },
    config:{    // 数据配置 参考../mock/userSelected
        type: Object,
        default() {
          return {
          id: 'id',
          headpic: 'headpic',
          name: 'name',
          class:'',     // 类名
          group: false,     // 是否分组
        };
          }
        }
      },
    data() {
      return {
      checkedIndex:'',
      checkedData:this.checked,
      searchOptions: Object.assign([],this.options),
      searchValue: '',
      overFlow: true,  // 是否开启遮罩层
      needFocus: false, //是否聚焦
      isShowSearch: this.selectType==='dept'?false:true,
    };

    },
    computed: {
      checkedAllData() {
      let self = this
      let result = []
      let len = 0
      this.searchOptions.forEach((value)=>{
        value.forEach((item)=>{
          len++
          result.push(item[self.config.id])
        })
      })
      return {len,result}
      },
      checkedAll: {
        get() {
        if(!!this.checkedData){
          return this.checkedData.length === this.checkedAllData.len
          }
        },
        set(val) {
        this.checkedData = val ? this.checkedAllData.result : []
        }
    },
    hasInputValue() {
      return this.searchValue == "" ? false: true
      }
    },
    mounted() {
      // 如果已有选择的数据
    if(this.checked){
      this.checkedData=this.checked
      }
    this.checkIndex()
    },
  methods:{
      defaultHeadpic(val) {
      if(!val || val==0){
        return DEFAULTPIC[this.selectType]
        }
      return val
      },
      FlowAuditUserResult() {
      let self = this
        // 单选或多选 id值不一样
      let idstr = (this.checkedType === 'radio') ? this.checkedData : this.checkedData.join('|')
      let ids = []
      let result=[]
      this.searchOptions.forEach((value,index)=>{
        if(index!=this.checkedIndex) {return}
        let item = value.filter( item => {
          if(idstr.indexOf(item[self.config.id]) > -1) {
            ids.push( item[self.config.id])
            return item
            }
        })
        if(item.length){
          result.push(...item)
          }
      })
      ids = ids.join('|')
      this.$emit("FlowAuditUserResult",{
        selectType:this.selectType,
          ids,
          result
      })
      },

      // 切换分组选项
    checkData(index,event){
      if(this.config.group) {
        if( this.checkedIndex !== index) {
          this.checkedData.length=0
          this.checkedIndex = index
          }
        }
      let id = event.target.value
      let itemIndex = this.checkedData.indexOf(id)
      if(event.target.checked) {
        if(this.checkedType==='radio') {
          this.checkedData=id
        }else {
          this.checkedData.push(id)
          }
      }else {
        if(this.checkedType==='radio') {
          this.checkedData=''
        }else {
          this.checkedData.splice(itemIndex,1)
          }
        }
      },

      // 求出当前选择的分组是第几个
      checkIndex() {
      let self = this
      if(!this.config.group){return}
      if (this.checked && !this.checked.length) {return;}
      let ids = this.checked.join('|')
      this.searchOptions.forEach((value,index)=>{
        value.forEach((item,key)=>{
          let id = this.handleItemId(item)
          if(ids.indexOf(id) > -1){
            self.checkedIndex = index
            return index
            }
        })
      })
      },

      // 分组的标题
      groupTitle(val) {
      if(this.config.group) {
        return val[this.config.groupTitle]
        }
      },
      // 如果是部门负责人分组,部门负责人可能多个部门
      handleItemId(value) {
      if(this.config.group) {
        return value.deptId+value[this.config.id]
      }
      return value[this.config.id]
    },
    enterSearch(){
      let arr = []
      for(let i = 0;i<this.options.length;i++){
        arr[i] = []
        for(let j = 0;j<this.options[i].length;j++){
          if(this.options[i][j].personName.indexOf(this.searchValue)>=0){
            arr[i].push(this.options[i][j])
          }
        }
      }
      // 数组去重
     this.searchOptions = [...new Set(arr)]
    //  将空数组删除
    let count = 0
    for(let q = 0;q < this.searchOptions.length;q++){
       if(this.searchOptions[q].length===0){
         this.searchOptions.splice(q,1)
         q--
        }
      }
    // 若搜索结果为空,显示全部
    this.searchOptions = this.searchOptions.length===0?this.options: this.searchOptions
    },
    // 关闭遮罩层
    closeThis() {
      this.overFlow = false
      this.needFocus = true
    },
    // 清除搜索关键字
    clearSearchValue(){
      this.searchValue = ""
    }
  }
};
</script>
<style scoped>
  @media screen and (min-width: 1024px) {
    .selectBox {
      width: 740px;
      margin: auto;
    }
  }
.selectSearchBox {
  display: flex;
  padding: 7px 6px;
  font-size: 16px;
  color: #333;
}
.selectSearchBox .searchInputWrapper {
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  height: 31px;
  background: white;
  line-height: 29px;
}
.selectSearchBox .searchInputWrapper .inputContent .searchInput{
  line-height: 23px;
  margin-left: 27px;
  width: 90%;
}
.searchInputWrapper .inputContent .icon_search{
    position: absolute;
    top: 18px;
    right: 8px;
    left: 7px;
    width: 14px;
    height: 14px;
    padding-left: 8px;
    background: url('../../../assets/images/ic_search.png') right no-repeat;
    background-size: 14px;
    cursor: pointer;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
}
.searchInputWrapper .inputContent .qwui-icon_del {
    position: absolute;
    top: 16px;
    bottom: 0;
    right: 13px;
    width: 14px;
    height: 14px;
    padding: 0;
    border: none;
    background: url('../../../assets/images/ic_del.png') no-repeat;
    background-size: 14px;
}
.selectedLabel {
    position: absolute;
    z-index: 6;
    top: 1px;
    right: 1px;
    bottom: 1px;
    left: 1px;
    margin: 5px;
    text-align: center;
    height: 30px;
    line-height: 34px;
    color: #9b9b9b;
    border-radius: 4px;
    font-size: 12px;
}
.selectedLabel .icon_search {
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: text-bottom;
    background: url('../../../assets/images/ic_search.png') no-repeat;
    background-size: 14px;
}
  .selectBox {
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #f5f5f5;
  }

  .qwui-selectMain_item {
    position: absolute;
    top: 46px;
    bottom: 60px;
    width: 100%;
    background-color: #fff;
    overflow-y: scroll;
  }
  .qwui-selectMain_item.noSearch{
    top: 0
  }
  .qwui-selectMain_item::-webkit-scrollbar {
    width: 0;
  }

  .selectAllBar {
    display: flex;
    padding: 12px 15px;
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
    line-height: 20px;
    background-color: #fff;
  }

  .qwui-user_item {
    font-size: 16px;
    background-color: #f5f5f5;
  }

.qwui-user_item:not(:first-child).pb10 {
    padding-top: 10px;
  }

.qwui-selectMain_item.top {
  top: 96px;
  }

  .qwui-user_item .qwui-user_item_inner {
    display: flex;
    align-items: center;
    padding-left: 15px;
    background-color: #fff;
  }

  .selectItem {
    display: flex;
    flex: 1;
    align-items: center;
    padding: 12px 0;
  }

.qwui-user_item_inner:last-child .qwui-border_bottom:after {
    border-bottom: none;
  }

  .qwui-user_item .avator {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    min-width: 40px;
  }

  .qwui-user_item .avator img {
    width: 100%;
    height: 100%;
    border-radius: 2px;
  }

  .qwui-user_item .title {
    flex: 1;
    line-height: 1;
  }

  .title_sub {
    margin-top: 10px;
    line-height: 1;
    font-size: 13px;
    color: #999;
  }
</style>
