<template>
  <div v-if="show" class="choice-edit qwui-btn_box" @touchmove="stopTouchMove" @touchstart="startTouchMove">
    <div class="choice-edit-type">
      <ul class="choice-type-list">
        <li class="list-li" v-for="(item,index) of choiceType" @click="selectType(index)">
          <div class="choice-edit-item" :class="[{moreWidth: item.title==='省/市/区/直辖市'}, {active:index===currentIndex}]">
            <span class="spa">{{item.title}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="choice-edit-tips">
      <span class="spa">点击编辑选项，一行填写一个</span>
    </div>
    <div class="choice-edit-textarea">
      <textarea class="tear" v-model="choicesText"></textarea>
    </div>
    <button_group :fixed="true">
      <qwui_button type="default" text="取消" @buttonClick="cancelChoices"></qwui_button>
      <qwui_button type="primary" text="确定" @buttonClick="confirmChoices"></qwui_button>
    </button_group>
  </div>
</template>

<script>
import { choices, DesignOptions } from "../../data/DesignerItem";
import { qwui_button, button_group } from "@/components/base/button";
export default {
  name: "choicesEdit",
  props: {
    choices: Array,
    show: Boolean
  },
  components: {
    qwui_button,
    button_group
  },
  data() {
    return {
      choiceType: DesignOptions(),
      choicesData: JSON.parse(JSON.stringify(this.choices)),
      currentIndex: "",
      touchStart: '',
      touchEnd: ''
    };
  },
  computed: {
    choicesText: {
      get() {
        let text = this.choicesData.map(val => {
          return val.value;
        });
        return text.join("\n");
      },
      set(val) {
        let temp = this.choicesData;
        let text = val.split("\n");
        text.forEach((t, i) => {
          if (!temp[i]) {
            temp.push(choices());
          }
          temp[i].value = t;
        });
      }
    }
  },
  watch: {
    choices: {
      handler() {
        this.choicesData = JSON.parse(JSON.stringify(this.choices));
      },
      deep: true
    },
    show() {
      this.choicesData = JSON.parse(JSON.stringify(this.choices));
      this.currentIndex = "";
    }
  },
  methods: {
    startTouchMove(el) {
      this.touchStart = el.changedTouches[0].pageY;
    },
    stopTouchMove(el) {
      if(el.target.nodeName != "TEXTAREA"||el.target.offsetHeight-el.target.scrollHeight==0){
        el.preventDefault();
      }
      this.touchEnd = el.changedTouches[0].pageY;
      let scrollTop = $('.tear').scrollTop()
      let offsetHeight = document.querySelector('.tear').offsetHeight
      let scrollHeight = document.querySelector('.tear').scrollHeight
      let touchMoveDirection =  this.touchStart-this.touchEnd>0?'up':'down'
      if((touchMoveDirection==='down'&&scrollTop==0)||touchMoveDirection==='up'&&offsetHeight+scrollTop==scrollHeight){
       el.preventDefault();
      }
    },
    selectType(index) {
      let time = 0;
      if(document.querySelector('.tear').scrollHeight > document.querySelector('.tear').clientHeight&&_.isIOS()){
        time = 800;
      }
      let me = this
      setTimeout(function(){ 
        me.choicesData = JSON.parse(
        JSON.stringify(me.choiceType[index].content)
      );
      me.currentIndex = index;
      }, time)
     
    },
    cancelChoices() {
      this.$emit("update:show", false);
    },
    confirmChoices() {
      let newChoices = [];
      newChoices = JSON.parse(JSON.stringify(this.choicesData));
      this.$emit("update:choices", newChoices);
      this.$emit("update:show", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.choice-edit {
  position: fixed;
  z-index: 10;
  top: 0;
  bottom: 0;
  background-color: #f5f5f5;
  overflow: hidden;
  margin-left: -15px;
  display: flex;
  flex-direction: column;

  .choice-edit-type {
    min-height: 137px;
    background: #ffffff;

    .choice-type-list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 29px 15px 8px 15px;

      .list-li {
        flex: 0 1 25%;
        margin-bottom: 20px;
        text-align: center;
        cursor: pointer;

        .choice-edit-item {
          width: 86%;
          height: 30px;
          background: rgba(178, 185, 200, 0.2);
          border-radius: 15px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(122, 125, 128, 1);
          line-height: 30px;
          display: inline-block;
          text-align: center;

          .spa {
            display: inline-block;
          }
        }
        .active {
          color: rgba(255, 255, 255, 1);
          background: rgba(85, 133, 240, 1);
        }
      }
    }
  }
  .choice-edit-tips {
    background: rgba(247, 248, 250, 1);
    overflow: hidden;

    .spa {
      width: 229px;
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(178, 185, 200, 1);
      line-height: 20px;
      padding: 12px 131px 8px 15px;
      display: inline-block;
    }
  }
  .choice-edit-textarea {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    padding-bottom: 60px;
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px){
      padding-bottom: 94px;
    }
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 896px) and (device-width: 414px){
      padding-bottom: 94px;
    }
    flex:1;
    display: flex;
    .tear {
      width: 100%;
      border: none;
      padding: 20px 20px 0 20px;
      overflow-y: scroll!important;
      color: RGBA(10, 23, 54, 1);
      font-size: 15px;
      line-height: 28px;
      box-sizing: border-box;
      resize: none;
      flex: 1;
    }
  }
  
}
.moreWidth {
  width: 144px !important;
}
</style>
