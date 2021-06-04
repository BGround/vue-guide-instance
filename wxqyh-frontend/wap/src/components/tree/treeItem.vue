<template>
  <div
    class="treeList"
  >
    <div
      v-for="(option,index) in options"
      :key="option[config.id]"
      class="treeItem"
    >
      <input
        v-if="checkTypeShow(option)"
        :type="config.checkType"
        :value="option[config.id]"
        :class="[align]"
        :id="option[config.id]"
        :checked="handleChecked(option[config.id])"
        @click="updateCheckedItem(option,$event)"
        class="icon_check"
      >
      <label :for="option[config.id]" class="treeLabel" @click.stop="clickTreeItem(option,index)">

        <!-- 自定义内容 -->
        <slot :name="'leftContent'+option[config.id]" :option="option"></slot>

        <img
          :src="getPic(option)"
          class="headPic"
          width="40"
          height="40"
          v-show="config.headPic"
        >
        <div class="treeContent">
          <p
            class="treeTitle ellipsis"
            :class="{'top':option[config.subTitle]}"
          >
            {{option[config.title]}}
          </p>
          <p class="subTitle ellipsis">{{option[config.subTitle]}}</p>
        </div>
      </label>
      <span v-show="option[config.hasChildren] || config.arrow"
         @click="showNextItem(option)"
        class="qwui-icon_arrow_fr icon_gray"
      >
      </span>
    </div>
  </div>
</template>

<script>
  const defaultHeadPic = {
    'user':require('@/assets/images/touxiang02.png'),
    'deptManager':require('@/assets/images/touxiang02.png'),
    'dept':require('@/assets/images/icon_dept.png')
  }
  export default {
    name: "QwTreeItem",
    props: {
      // 选项：[{id:'',parentId:'',title:'',subTitle:'',hasChildren:Boolean,disabled:Boolean}]
      options: {
        type: Array,
        required: true
      },
      // key 值配置,没有则不配
      config: {
        type: Object,
        default() {
          return {
            id: '',
            parentId: '',
            title: '',
            subTitle: '',
            hasChildren: '',    // 是否有下一级
            headPic: '',            // 列表的头像，可以是接口的头像key值；也可以配列表统一的头像url，不显示则不配
            defaultHeadPic: '',     // 要显示头像，没有头像。不显示则不配
            checkType:'',           // 选框类型
            arrow: false,              // 箭头显示
            onlyChildCheck: false,       // 有子级时，不显示选框，父级不可选
            onlyParentCheck: false,      // 有子级时，才显示选框，父级可选
          }
        }
      },
      // 已选择的id
      value: {
        type: [Array,String],
      },
      // 图标位置：默认左边, @right 右边
      align: {
        type: String,
      },
      // 用户选中的数据
      items: {
        type: Array,
        default() {
          return []
        },
      },
    },
    data() {
      return {
        defaultHeadPic,       // 默认头像选项
        currentValue: this.value,
      }
    },
    watch: {
      // 当前选择的数据
      value(val) {
        this.currentValue = val
      },
      // 当前选择的数据
      currentValue(val) {
        this.$emit('input', val)
      }
    },
    methods: {
      // 点击某一列
      clickTreeItem(option,index) {
        this.$emit('clickTreeItem',option,index)
      },
      // 显示下一级
      showNextItem(option) {
        this.$emit('showNextItem',option)
      },
      // 选中
      updateCheckedItem(option,event) {
        let checkedItems=[...this.items]     // 选中的所有数据
        if(this.config.checkType==='radio') {
          checkedItems.splice(0, 1,option)
          this.currentValue = event.target.value
        }else {
          if(event.target.checked) {
            checkedItems.push(option)
            this.currentValue.push( event.target.value)
          }else {
            let id = option[this.config.id]
            checkedItems.forEach( (value, index) => {
              if(value[this.config.id] === id) {
                checkedItems.splice(index, 1)
                this.currentValue.splice(index,1)
              }
            })
          }
        }

        this.$emit('update:items',checkedItems)
      },
      // 是否选中
      handleChecked(id) {
        let flag = false
        if(this.config.checkType==='radio') {
          if(this.currentValue === id) {
            flag = true
          }
        }else {
          this.currentValue.forEach( (value)=>{
            if(value === id) {
              flag = true
            }
          })
        }
        return flag
      },
      // 获取头像
      getPic(option) {
        return option[this.config.headPic]     // 接口返回的头像
          || this.defaultHeadPic[this.config.defaultHeadPic]    //  要显示头像，但是接口没有返回，从组件中选择默认头像：人员'user',部门'dept'
          || this.config.defaultHeadPic        // 要显示头像，但是接口没有返回。自己配置默认头像
          || this.config.headPic               // 列表统一显示的头像
      },
      // 是否显示选框
      checkTypeShow(option) {
        // 有子级时，不显示选框，父级不可选
        if(this.config.onlyChildCheck) {
          return !option[this.config.hasChildren]
        }
        //  有子级时，才显示选框，父级可选
        if(this.config.onlyParentCheck) {
          return option[this.config.hasChildren]
        }
        return this.config.checkType
      }
    },
  }
</script>

<style scoped>
  .ellipsis {
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  [type=checkbox].icon_check{
    display: block;
    margin-top: 23px
  }
  [type=radio].icon_check{
    display: block;
    margin-top: 24px;
  }

  .qwui-icon_arrow_fr {
    width: 48px;
    cursor: pointer;
  }
  .qwui-icon_arrow_fr:after {
    position: absolute;
    right: 15px;
  }

  .treeList {
    background-color: #fff;
    overflow-y: scroll;
    cursor: pointer;
  }
  .treeList::-webkit-scrollbar {
    width: 0;
    height: 6px;
  }
  .treeItem {
    position: relative;
    display: flex;
    height: 65px;
    line-height: 65px;
    margin-left: 15px;
    background-color: #fff;
    cursor: pointer;
  }
  .treeItem .headPic {
    margin-top: 12px;
    margin-right: 10px;
    border-radius: 2px;
  }
  .treeItem:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .treeItem:last-child:after{
    border-bottom: 0
  }
  .treeLabel {
    display: flex;
    width: 50%;
    flex: 1;
    cursor: pointer;
  }
  .treeItem .treeContent {
    width: 85%;
    flex: 1;
    margin-right: 15px;
  }
  .treeItem .treeTitle {
    font-size: 16px;
    margin: 0;
    color: #333;
  }
  .treeItem .treeTitle.top {
    line-height: 1.3;
    padding-top: 13px;
  }
  .treeItem .subTitle {
    line-height: 1.3;
    font-size: 13px;
    color: #999;
    margin-top: 8px;
  }

</style>
