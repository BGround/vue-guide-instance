<template>
  <div class="drag">
    <div class="flex-item">
      <div class="content">
        <div class="title qwui-border_bottom">启用</div>
        <draggable element="ul"
            v-model="optionSetting.enabledList"
            :options="options"
            :move="getdata"
            @update="datadragEnd">
            <li class="drag-item"
                v-for="(item,index) in optionSetting.enabledList"
                :key="index">
                <span class="icon icon-reduce"
                    @click="reduceDragData(index, item.type)">
                </span>
                <span class="optionName">{{item.optionName}}</span>
                <span v-show="item.type === 3">（客户）</span>
                <span class="iconR icon-move"></span>
            </li>
        </draggable>
      </div>
      <div class="content">
          <div class="title qwui-border_bottom">未启用</div>
          <draggable element="ul"
              v-model="optionSetting.disabledList"
              :options="diffOptions">
              <li class="drag-item"
                  v-for="(item,index) in optionSetting.disabledList"
                  :key="index">
                  <span class="icon icon-add"
                      @click="addDragData(index)"
                  ></span>
                  <span class="optionName">{{item.optionName}}</span>
              </li>
          </draggable>
      </div>
      <div class="content" v-if="optionSetting.disabledClientList && optionSetting.disabledClientList.length > 0">
        <div class="more" @click="openMoreOption">
          <span>更多条件</span>
          <i class="iconfont" :class="{'cr-xiala1': showMore, 'cr-xiala': !showMore}"></i>
        </div>
        <draggable  v-show="showMore"
                    element="ul"
                    v-model="optionSetting.disabledClientList"
                    :options="diffOptions"
        >
          <li class="drag-item"
              v-for="(item, index) in optionSetting.disabledClientList"
              :key="index"
          >
            <span class="icon icon-add" @click="addClientSearchOption(index)"></span>
            <span class="optionName">{{item.optionName}}</span>
          </li>
        </draggable>
      </div>
    </div>

    <button_group>
        <qwui_button type="default" text="取消" @buttonClick="openDraggable"></qwui_button>
        <qwui_button type="primary" text="确定" @buttonClick="submitDragData"></qwui_button>
    </button_group>
  </div>
</template>

<script type="text/ecmascript-6">
import draggable from 'vuedraggable'
import {qwui_button , button_group} from '@/components/base/button'
import { get } from 'http';
const TYPE_CLIENT = 3;  // 客户自定义字段类型 （交叉搜索）
  export default {
    name: 'customerDrag',
    data() {
      return {
        options:{
          ghostClass:'.ghostClass',//给影子元素进行编辑样式
          chosenClass: '.chosenClass',//目标被选中时添加样式
          handle:'.iconR'//使列表单元中符合选择器的元素成为拖动的手柄
        },
        diffOptions:{
          ...this.options,
          disabled: true,//设置不能拖拽
        },
        showMore: false,
      }
    },
    components: {
      draggable,
      qwui_button,
      button_group,
    },
    props: {
      optionSetting:{
        type: Object,
        defult: null
      }
    },
    methods: {
      //拖拽项时调用的函数
      getdata(evt){
        // console.log('拖动前 :' + evt)
      },
      //更新事件
      datadragEnd(evt){
        // console.log('拖动后 :' + evt)
      },
      //点击取消按钮
      openDraggable(){
        this.$emit('openDraggable')
      },
      //点击确定提交拖拽，变换位置后的数据
      submitDragData(){
        this.$emit('submitDragData',this.optionSetting.enabledList,this.optionSetting.disabledList)
      },
      //点击未启用字段前的加号
      addDragData(idx){
        this.optionSetting.enabledList.push(this.optionSetting.disabledList.splice(idx,1)[0])
      },
      //点击启用字段前的减号
      reduceDragData(idx, type){
        if(type === TYPE_CLIENT){
          if(this.optionSetting.disabledClientList){
            this.optionSetting.disabledClientList.push(this.optionSetting.enabledList.splice(idx,1)[0])
          }

        } else{
          this.optionSetting.disabledList.push(this.optionSetting.enabledList.splice(idx,1)[0])
        }
      },

      // 打开‘更多条件’
      openMoreOption(){
        this.showMore = !this.showMore;
      },

      // 添加客户自定义字段筛选
      addClientSearchOption(index){
        this.optionSetting.enabledList.push(this.optionSetting.disabledClientList.splice(index, 1)[0])
      }

    }
  }
</script>


<style scoped lang="scss">
@import '../../crmBase.scss';
  .drag{
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    z-index: 12;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .content{
      .title{
        position: relative;
        @include content-item(44,52,#666,14);
        padding-left: 15px;
      }
      .more{
        margin-top: 25px;
        text-align: center;
        font-size: 14px;
        color: #666;
        line-height: 2;
        .iconfont{
          color: #ccc;
          font-size: 12px;
          margin-left: 5px;
        }
      }
      ul{
        .drag-item{
          @include content-item(45,45,#333,15);
          padding: 0 15px;
          cursor: move;
          .optionName{
            max-width: 66%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            vertical-align: middle;
          }
          .icon{
            display: inline-block;
            width: 21px;
            height: 21px;
            margin-right: 10px;
            background: url('../../../../assets/images/crm/icon_add_reduce.png') no-repeat;
            background-size: 200%;
            vertical-align: middle;
            &.icon-add{
              background-position: -21px 0;
            }
          }
          .iconR{
            float: right;
            width: 16px;
            height: 13px;
            margin-top: 15px;
            padding-bottom: 15px;
            background: url('../../../../assets/images/icon_crmmb_more.png') no-repeat;
            background-size: 100%;
          }
          &.ghostClass{
            background: #fff;
            opacity: 1;
          }
        }
      }
    }
  }
  .flex-item{
    flex: 1;
    overflow-y: auto;
  }
</style>
