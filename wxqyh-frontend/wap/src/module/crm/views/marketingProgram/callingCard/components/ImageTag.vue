<template>
  <div class="qwui-tag">
    <div class="qwui-tag_title">
      <p class="qwui-tag_text">我的形象</p>
      <div v-show="dataList.length > 0">
        <div class="qwui-tag_edit" v-if="!editTagFlag" @click="openEditTag">
          <span class="qwui-edit_text" :style="isMobile? 'margin-top:1px':'margin-top:0'">编辑</span>
        </div>
        <div class="qwui-tag_edit qwui-edit_save" v-else @click="openEditTag">
          <span class="qwui-edit_text" :style="isMobile? 'margin-top:1px':'margin-top:0'">完成</span>
        </div>
      </div>
    </div>
    <div class="qwui-no_tag" v-if="!dataList.length">
      <p class="qwui-tag_tip">完善自己的形象标签，帮助别人更好的了解你</p>
      <div class="qwui-newtag" @click="editTagSwitch">
        <div class="qwui-newtag_icon"></div>
        <span class="qwui-newtag_text">新标签</span>
      </div>
    </div>
    <div class="qwui-tag_show" v-else>
      <div class="qwui-addtag">
        <div class="qwui-newtag" @click="editTagSwitch">
          <div class="qwui-newtag_icon"></div>
          <span class="qwui-newtag_text">新标签</span>
        </div>
      </div>
      <div class="qwui-show_item" 
           :class="editTagFlag? 'qwui-show_item_reset':''"
           v-for="(item,index) in dataList" :key="index"
           @click="handleTag(item.id,index,item.approvalNum)">
        <span class="qwui-item_text">{{item.labelName}}
          <span 
            class="qwui-approval_tip"
            :class="editTagFlag? 'qwui-approval_color':''"
            v-show="item.approvalNum != 0">{{item.approvalNum}}</span>
        </span>
        <img class="qwui-tag_del"
             src="~assets/images/crm/icon_tag_del.png"
             v-show="editTagFlag">
      </div>
    </div>
    <!-- 形象标签添加组件 -->
    <image-tag-edit v-show="addTagFlag"
                    @closeEdit="editTagSwitch"
                    @addTagFinish="addTagFinish"
                    :remainderLength="dataList.length"></image-tag-edit>
    <!-- 查看形象标签认可人员组件 -->
    <image-tag-show :isOpen="showTagFlag"
                    :labelId="tagId"
                    v-if="showTagFlag"
                    @openShow="openTagShow"
                    @closeShow="closeTagShow"></image-tag-show>
  </div>
</template>

<script>
import ImageTagEdit from './ImageTagEdit';
import ImageTagShow from './ImageTagShow';
import { delTagList } from '../../../../api/smallProgram/getBata.js';
export default {
  props: {
    //接受的形象标签数组
    dataList:{
      type:Array,
      default:function(){
        return [];
      }
    }
  },
  data() {
    return {
      addTagFlag: false,//添加标签开关
      editTagFlag: false,//进行编辑开关
      showTagFlag: false,//查看标签认同人员开关
      tagId:'',
      isMobile:false,//默认不是手机端
    };
  },
  components: {
    ImageTagEdit,
    ImageTagShow
  },
  created() {
    // 判断是否手机终端
    if(_.isHefeixin()|| _.isWeChatApp()||_.isQiyeweixinApp() || _.isMobileApp()){
      this.isMobile=true;
    }
  },
  methods: {
    //打开形象标签添加模块
    editTagSwitch() {
      if(this.dataList.length >= 20){
        _.alert('提示','标签数量已达最大值20个');
        return;
      }
      this.addTagFlag = !this.addTagFlag;
      //通知外层组件固定窗口
      this.$emit('editSwitch', this.addTagFlag);
    },
    //打开形象标签编辑模块
    openEditTag(){
      this.editTagFlag = !this.editTagFlag;
    },
    //形象标签添加完成保存
    addTagFinish(){
      this.editTagSwitch();
      //刷新当前我的名片页面
      this.$emit('reLoadTag');
    },
    handleTag(id,index,approvalNum){
      if(approvalNum == 0 && !this.editTagFlag){
        return;
      }
      //打开形象标签认同人员窗口
      if(!this.editTagFlag){
       
        this.showTagFlag = true;
        this.tagId = id;
      }else{
        this.delTag({
          labelId:id
        },index);
      }
    },
    //关闭形象标签认同人员窗口
    closeTagShow(){
      this.showTagFlag = false;
      this.$emit('editSwitch', this.showTagFlag);
    },
    openTagShow(){
      this.showTagFlag = true;
      this.$emit('editSwitch', this.showTagFlag);
    },
    //删除标签
    delTag(requestParam,index){
      delTagList(requestParam,(res) => {
        this.$emit('handleTag',index)
      })
    }
  },
  watch:{
    dataList(newVal,oldVal){
      if(!newVal.length){
        this.editTagFlag = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.qwui-tag {
  background-color: #fff;
  margin: 16px 14px;
  border-radius: 4px;
  box-shadow: 0px 2px 6px 0px rgba(220, 221, 224, 0.5);
  .qwui-tag_btn {
    width: 99px;
    height: 32px;
    margin-top: 16px;
  }
  .qwui-newtag {
    position: relative;
    margin: 0 auto;
    margin-top: 16px;
    width: 99px;
    height: 32px;
    border: 1px dashed #D5DEFB;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0;
    box-sizing: border-box;
    .qwui-newtag_icon {
      width: 14px;
      height: 14px;
      background-color: #5979F1;
      border-radius: 10px;
      position: relative;
      &::before {
        content: "";
        width: 2px;
        height: 8px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -1px;
        margin-top: -4px;
      }
      &::after {
        content: "";
        width: 8px;
        height: 2px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -4px;
        margin-top: -1px;
      }
    }
    .qwui-newtag_text {
      font-size: 14px;
      line-height: 20px;
      margin-left: 4px;
      color: #5585F0;
      font-weight: 400;
    }
  }
  .qwui-tag_title {
    display: flex;
    justify-content: space-between;
    padding: 12px 14px;
    box-shadow: 0px 1px 0px 0px rgba(246, 246, 250, 1);
    .qwui-tag_text {
      font-size: 16px;
      font-weight: bold;
      color: #0a1735;
    }
    .qwui-tag_edit {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 47px;
      height: 22px;
      color: #b2b9c8;
      border: 1px solid #dadde4;
      border-radius: 12px;
      .qwui-edit_text {
        font-size: 12px;
        line-height: 17px;
        font-weight: 400;
      }
    }
    .qwui-edit_save{
      width: 49px;
      height: 24px;
      background-color: #5585F0;
      border: none;
      color: #fff;
    } 
  }
  .qwui-no_tag {
    text-align: center;
    padding: 16px 14px;
    .qwui-tag_tip {
      font-size: 13px;
      color: #b2b9c8;
      line-height: 18px;
    }
  }
  .qwui-tag_show {
    padding: 18px 0 11px 14px;
    font-size: 0;
    .qwui-tag_btn {
      margin: 0 12px 10px 0;
      vertical-align: middle;
    }
    .qwui-addtag {
      display: inline-block;
    }
    .qwui-newtag {
      margin: 0 12px 10px 0;
    }
    .qwui-show_item {
      position: relative;
      display: inline-block;
      margin: 0 12px 10px 0;
      padding: 6px 20px;
      background-color: #f6f6fa;
      border-radius: 16px;
      font-size: 0;
      color: #0a1736;
      vertical-align: top;
      .qwui-item_text {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        line-height: 20px;
      }
      .qwui-approval_tip {
        margin-left: 8px;
        color: #5585F0;
      }
      .qwui-approval_color {
        color: #0a1736;
      }
      .qwui-tag_del {
        width: 14px;
        height: 14px;
        vertical-align: middle;
        margin-left: 4px;
      }
    }
    .qwui-show_item_reset {
      padding: 6px 9px 6px 13px;
    }
  }
}
</style>