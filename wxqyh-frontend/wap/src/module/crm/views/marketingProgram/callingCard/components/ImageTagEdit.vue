<template>
  <transition name="slide-up">
  <div class="qwui-tag_wrap">
    <div class="qwui-tag_content">
      <div class="qwui-tag_item"
           v-for="(item,ind) in tagList"
           :key="ind"
           @click="delTag(ind)">{{item.labelName}}
        <img class="qwui-tag_del"
             src="~assets/images/crm/icon_tag_del.png">
      </div>
      <input v-show="countTag != 0"
             class="qwui-tag_tip"
             :style="{'margin-bottom':tagList.length>0? '4px': '12px'}"
             type="text"
             placeholder="输入形象标签"
             v-model="tagText"
             @blur="addTagInMobile"
             maxlength="12">
    </div>
    <p class="qwui-tip">你还可以添加 {{countTag}} 个</p>
    <div class="qwui-edit_btn">
      <div class="qwui-btn_cancel" @click="closeEdit">取消</div>
      <div class="qwui-btn_save" @click="saveLabel">保存</div>
    </div>
  </div>
  </transition>
</template>

<script>
import { addTagList } from '../../../../api/smallProgram/getBata.js';
export default {
  props: {
    remainderLength:{
      type:Number
    }
  },
  data() {
    return {
      tagText: '',
      tagList: [],
      isMobile:false//默认不是手机端
    };
  },
  created() {
    window.onkeydown = event => {
      let eve = event || window.event;
      if (eve.keyCode === 13) {
        if (!this.tagText) {
          return;
        }
        this.buildTag();
      }
    };
    // 判断是否手机终端
    if(_.isHefeixin()|| _.isWeChatApp()||_.isQiyeweixinApp() || _.isMobileApp()){
      this.isMobile=true;
    }
  },
  computed: {
    countTag() {
      return 20 - this.remainderLength - this.tagList.length;
    }
  },
  methods: {
    //删除标签
    delTag(index) {
      this.tagList.splice(index, 1);
    },
    //退出添加标签页面
    closeEdit(){
      this.tagList = [];
      this.tagText = '';
      this.$emit('closeEdit')
    },
    //保存新增的标签
    saveLabel(){
      if(!this.tagList.length){
        _.alert('提示','请至少生成一个标签');
        return;
      }
      addTagList({labelListJson : JSON.stringify(this.tagList)},(res) => {
        this.$emit('addTagFinish');
        this.tagList = [];
        this.tagText = '';
      });
    },
    //生成标签
    buildTag(){
      let tem = {
        labelName: this.tagText.replace(/\s+/g,"")
      }
      this.tagList.push(tem);
      this.tagText = '';
    },
    //移动端新增失去焦点生成标签功能
    addTagInMobile(){
      if(this.isMobile){
        if (!this.tagText) {
          return;
        }
        this.buildTag();
        document.querySelector('.qwui-tag_tip').focus();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.qwui-tag_wrap {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: #fff;
  box-sizing: border-box;
  padding: 21px 14px 0;
  z-index: 10;
  .qwui-tag_content {
    border-bottom: 2px solid #f6f6fa;
    display: flex;
    flex-wrap: wrap;
    .qwui-tag_item {
      position: relative;
      display: inline-block;
      padding: 6px 8px;
      background-color: #edf0fd;
      border-radius: 16px;
      margin-right: 12px;
      margin-bottom: 12px;
      color: #5585f0;
      font-size: 14px;
      line-height: 20px;
      vertical-align: middle;
      .qwui-tag_del {
        width: 14px;
        height: 14px;
        vertical-align: middle;
      }
    }
    .qwui-tag_tip {
      width: 183px;
      height: 32px;
      margin-bottom: 12px;
      border: none;
      outline: none;
      font-size: 15px;
      color: #0A1736;
      font-weight: 400;
    }
  }
  .qwui-edit_btn {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    display: flex;
    .qwui-btn_cancel {
      height: 49px;
      flex-grow: 1;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      color: #7a7d80;
      background-color: #fff;
      border-top: 1px solid #f6f6fa;
      font-weight:400;
    }
    .qwui-btn_save {
      height: 50px;
      flex-grow: 1;
      text-align: center;
      line-height: 50px;
      background-color: #5585f0;
      color: #fff;
      font-size: 16px;
      font-weight:400;
    }
  }
  .qwui-tip {
    margin-top: 16px;
    font-size: 14px;
    line-height: 20px;
    color: #9196a1;
  }
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all .4s ease;
}
.slide-up-enter {
  top: 100%;
}
.slide-up-leave-active {
  top: 100%;
}
@media screen and (min-width: 1024px){
  .qwui-tag_wrap {
      width: 740px;
  }
}
input::placeholder {
  color:#B2B9C8;
}
//苹果X样式适配
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .qwui-tag_wrap .qwui-edit_btn {
    bottom: 34px;
  }
}
</style>