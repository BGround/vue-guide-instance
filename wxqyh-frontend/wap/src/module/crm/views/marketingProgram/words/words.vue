<template>
  <div class="wrap qwui-wrap">
    <!-- 话术列表为空提示 -->
    <div class="qwui-noWords"
         v-show="ListFlag && !wordsList.length">
      <img class="qwui-talkImg"
           src="~assets/images/crm/Rectangle.png"
           alt="">
      <p class="qwui-title">管理自己的常用话术</p>
      <p class="qwui-content">跟客户一对一沟通时，减少重复输入</p>
      <button class="qwui-add"
              @click="openAdd">添加常用话术</button>
    </div>
    <!-- 话术列表 -->
    <scroll ref="scroll"
            :data="wordsList"
            :pullUpLoad="pullUpLoad"
            @pullingUp="onPullingUp">
      <div class="qwui-words" @mousedown="pcMoveStart" @mousemove="pcMoveIng" @mouseup="pcMoveEnd">
        <!-- <ul class="qwui-words_list">
          <li class="qwui-words_item" v-for="(item,index) in wordsList" :key="index">{{item.context}}</li>
        </ul> -->
        <swipeout class="qwui-words_list">
          <swipeout-item 
                @on-close="handleEvents('on-close')" 
                @on-open="handleEvents('on-open')" 
                transition-mode="follow"
                v-for="(item,index) in wordsList" :key="index"
                :disabled="slideFlag">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick(item.id,index)" type="warn">
                <span style="margin-right:8px">删除</span>
              </swipeout-button>
            </div>
            <div slot="content" class="qwui-words_item">{{item.context}}</div>
          </swipeout-item>
        </swipeout>
      </div>
    </scroll>
    <!-- 添加话术按钮 -->
    <div v-show="wordsList.length > 0" class="qwui-add_word" @click="openAdd"></div>
    <!-- 编辑话术区域 -->
    <div class="qwui-words_edit"
         :class="editFlag? 'qwui-words_top': ''">
      <div class="qwui-edit_content">
        <textarea class="qwui-edit_text"
                  placeholder="输入话术内容"
                  v-model="wordText"
                  :maxlength="limitLength"></textarea>
        <span class="qwui-edit_tip" 
              :class="wordText.length === limitLength? 'qwui-tip_warn':''">{{wordText.length}}/{{limitLength}}</span>
      </div>
      <div class="qwui-edit_btn">
        <div class="qwui-btn_cancel"
             @click="closeAdd">取消</div>
        <div class="qwui-btn_save" @click="addWords">保存</div>
      </div>
    </div>
  </div>
</template>

<script>
import Scroll from '../../../components/Scroll/index';
import { getWordsList,addWordsList,delWordsList } from '../../../api/smallProgram/getBata.js';
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux';
export default {
  data() {
    return {
      wordsList: [],//话术列表
      editFlag: false,//编辑区开关
      pullUpLoad: true, //开启scroll组件的上拉加载
      pageCurrent: 1, //当前页码
      pageMax: 0, //最大页码
      pageSize: 20, //一次请求几条数据
      wordText: '',//编辑区的文本
      limitLength: 200,//编辑区最大字数限定
      ListFlag: false,//话术列表开关
      slideFlag: false//是否开启滑动删除
    };
  },
  components: {
    Scroll,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  },
  created() {
    //如果从聊天的话术那里进入,则自动打开添加
    if (this.$route.params.openAddFlag) {
      this.openAdd();
    }
    this.getWords({
      page: this.pageCurrent,
      pageSize: this.pageSize
    });
    this.pcMoveConfig = {
      flag: true
    };
  },
  methods: {
    //获取动态列表数据
    getWords(requestParam){
      getWordsList(requestParam,(res) => {
        if(!res.pager.pageData.length){
          this.ListFlag = true;
          return;
        }
        this.wordsList = this.wordsList.concat(res.pager.pageData);
        this.pageMax = res.pager.totalPages;
      });
    },
    openAdd() {
      this.editFlag = true;
    },
    closeAdd() {
      this.editFlag = false;
    },
    onPullingUp() {
      if(this.pageCurrent >= this.pageMax){
        this.pullUpLoad = false;
        return;
      }
      this.pageCurrent++;
      this.getWords({
        page: this.pageCurrent,
        pageSize: this.pageSize,
      });
    },
    addWords(){
      addWordsList({context:this.wordText},(res) => {
        this.wordsList = [];
        this.wordText = '';
        this.closeAdd();
        this.pageCurrent = 1;
        this.pageMax = 0;
        this.getWords({
          page: this.pageCurrent,
          pageSize: this.pageSize
        });
      });
    },
    handleEvents(res){
      if(res === 'on-open'){
        // console.log('完成打开')
      }
      if(res === 'on-close'){
        // console.log('关闭')
      }
    },
    onButtonClick(target,index){
      delWordsList({id:target},() => {
        this.wordsList.splice(index,1);
        if(!this.wordsList.length){
        this.ListFlag = true;
      }
      });
    },
    pcMoveStart(event){
      this.pcMoveConfig.sx = event.clientX;
      this.pcMoveConfig.sy = event.clientY;
      this.pcMoveConfig.flag = true;
    },
    pcMoveIng(event){
      
      if(!this.pcMoveConfig.flag){
        return;
      }
      this.slideFlag = false;
      this.pcMoveConfig.dx = event.clientX - this.pcMoveConfig.sx;
      this.pcMoveConfig.dy = event.clientY - this.pcMoveConfig.sy;
      if(Math.abs(this.pcMoveConfig.dy) > Math.abs(this.pcMoveConfig.dx)){
        this.slideFlag = true;
      }
    },
    pcMoveEnd(){
      this.pcMoveConfig.flag = false;
    }
  }
};
</script>

<style scoped lang="scss">
.qwui-wrap {
  height: 100%;
  background-color: #fff;
}
.qwui-noWords {
  text-align: center;
  .qwui-talkImg {
    width: 186px;
    margin-top: 49px;
  }
  .qwui-title {
    font-size: 17px;
    color: #3f4a64;
    font-weight: 500;
    line-height: 26px;
    margin-top: 33px;
  }
  .qwui-content {
    font-size: 14px;
    line-height: 26px;
    color: #959AA7;
  }
  .qwui-add {
    width: 132px;
    height: 40px;
    line-height: 40px;
    border: none;
    text-align: center;
    background-color: #5585f0;
    color: #fff;
    border-radius: 4px;
    font-size: 16px;
    margin-top: 32px;
    font-weight:400;
  }
}
.qwui-words {
  .qwui-words_list {
    padding: 0 14px;
    .qwui-words_item {
      font-size: 15px;
      color: #3f4a64;
      padding: 14px 0;
      font-weight:400;
      word-break: break-all;
      word-wrap: break-word;
      margin-right: 28px;
      border-bottom: 1px solid #f6f6fa;
      white-space:pre-wrap;
    }
  }
}
.qwui-add_word {
  position: absolute;
  bottom: 74px;
  right: 16px;
  width: 54px;
  height: 54px;
  background-color: #5585f0;
  border-radius: 50%;
  box-shadow: 0px 8px 14px 0px rgba(85, 133, 240, 0.3);
  background-image: url('~assets/images/crm/btn_add_word.png');
  background-repeat: no-repeat;
  background-size: 16px 16px;
  background-position: center center;
  z-index: 9;
}
.qwui-words_edit {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f6f6fa;
  z-index: 10;
  visibility: hidden;
  transition: all .5s ease 0s;
  .qwui-edit_content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 332px;
    box-sizing: border-box;
    padding: 20px 14px 36px;
    background-color: #fff;
    .qwui-edit_text {
      resize: none;
      width: 100%;
      border: none;
      height: 100%;
      word-break: break-all;
      word-wrap: break-word;
      font-size: 15px;
      font-weight:400;
      color: #0A1736;
      line-height: 25px;
    }
    .qwui-edit_tip {
      color: #b2b9c8;
      font-size: 12px;
      float: right;
      font-weight:400;
    }
    .qwui-tip_warn {
      color: #F76161;
    }
  }
  .qwui-edit_btn {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    display: flex;
    .qwui-btn_cancel {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      flex-grow: 1;
      font-size: 16px;
      color: #7a7d80;
      background-color: #fff;
      font-weight: 400;
    }
    .qwui-btn_save {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      flex-grow: 1;
      background-color: #5585f0;
      color: #fff;
      font-size: 16px;
      font-weight: 400;
    }
  }
}
.qwui-words_top{
  visibility: visible;
  top: 0;
}
textarea::placeholder {
  color: #B2B9C8;
}
</style>
