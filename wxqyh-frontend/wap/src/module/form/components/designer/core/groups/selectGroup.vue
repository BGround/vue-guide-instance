<template>
  <div class="form-group qwui-btn_box" v-if="show"  @touchmove="stopTouchMove" @touchstart="startTouchMove">
    <div class="form-group-middle">
      <ul>
        <li class="form-group-item" v-for="(item,index) of groupList">
          <div class="group-item-wrapper group-options" @click="launchWrapper(index)">
            <div class="father-group-item">
              <div class="select-button" @click.stop="selectGroup(item.typeName,item.id,'outsideGroup')">
                <input type="radio" class="group-radio-box" :class="[(tbFormControlPO.typeId===item.id)?'checked':'']">
              </div>
              <div class="icon-wrapper">
                <i class="homeicon iconfont-my" :style="[item.picPath ? {color: item.picPath.color} : {color: '#5f9ff3'}]" :class="[item.picPath ? 'bd-b-' + item.picPath.icon : 'bd-b-chucha']">
                </i>
              </div>
              <div class="group-name">{{item.typeName}}</div>
              <div v-if="item.formTypeCount===1" class="form-group-arrow" :class="[showInsideGroup&&currentIndex==index?'transform':'']"></div>
            </div>
          </div>
          <div v-show="showInsideGroup&&index===currentIndex" class="inside-group">
            <ul>
              <li v-for="(secondItem,secondIndex) of secondGroupList" class="second-group-item">
                <div class="second-group-item-wrapper">
                  <div class="second-group-name">
                    {{secondItem.typeName}}
                  </div>
                  <div class="select-button" @click.stop="selectGroup(secondItem.typeName,secondItem.id)">
                    <input type="radio" class="group-radio-box son" :class="[(tbFormControlPO.typeId===secondItem.id)?'checked':'']">
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <button_group :fixed="true">
      <qwui_button type="default" text="取消" @buttonClick="closeIt"></qwui_button>
    </button_group>
  </div>
</template>

<script>
import { qwui_button, button_group } from "@/components/base/button";
import { mapState, mapMutations } from "vuex";
 import {findSubFormTypes} from '../../../../api/list'
export default {
  name: "selectGroup",
  components: {
    qwui_button,
    button_group
  },
  props: {
    groupList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showInsideGroup: false,
      currentIndex: null,
      secondGroupList: [],
      needAskSubTypes: true, // 限制 如果是展开状态就不需要再次请求接口
      touchStart: '',
      touchEnd: '',
      touchMoveDirection: '',
      scrollTop: 0,
      isStart: false
    };
  },
  created() {},
  computed: {
    ...mapState({
      tbFormControlPO: state =>
        state.formDesign.FormAjaxData.tbFormControlPO
    })
  },
  methods: {
    ...mapMutations(["changeFormAjaxData"]),

    launchWrapper(index) {
      // 每次点击将子列表数据清空
      this.secondGroupList = [];
      // 点击本选项
      if (index === this.currentIndex) {
        this.showInsideGroup = !this.showInsideGroup;
        this.needAskSubTypes = this.showInsideGroup ? true: false;
      } else {
        // 点击其他选项
        this.showInsideGroup = true;
        this.needAskSubTypes = true;
      }
      this.currentIndex = index;
      let data = {
        id: this.groupList[index].id
      };
      // 如果本分组为展开状态就不需要再次请求
      if(this.needAskSubTypes){
        findSubFormTypes(data).then(result => {
          this.secondGroupList = [...result.data.formTypeList];
        });
      }
    },
    selectGroup(name, id, type) {
      this.changeFormAjaxData({
        key: "tbFormControlPO.typeId",
        value: id
      })
      this.changeFormAjaxData({
        key: "tbFormControlPO.typeName",
        value: name
      })
      if(type === 'outsideGroup'){
        this.showInsideGroup = false
      }
      this.closeIt();
    },
    closeIt() {
      document.body.style.overflowY = 'auto'
      this.$emit("update:show", false);
    },
    // 开始移动
    startTouchMove(el) {
      console.log(el)
      this.touchStart = el.changedTouches[0].pageY;
    },
    // touchMove
    stopTouchMove(el) {
      if(el.target.className==='qwui-btn qwui-btn_default'||el.target.className==="qwui-btn_tab"){
        el.preventDefault();
      }
      this.touchEnd = el.changedTouches[0].pageY;
      this.touchMoveDirection = this.touchStart-this.touchEnd>0?'up':'down'
      this.scrollTop = $('.form-group-middle').scrollTop()
      let offsetHeight = document.querySelector('.form-group-middle').offsetHeight
      let scrollHeight = document.querySelector('.form-group-middle').scrollHeight
      if((this.touchMoveDirection==='down'&&this.scrollTop==0) || 
      (this.touchMoveDirection==='up'&&offsetHeight+this.scrollTop==scrollHeight)){
        el.preventDefault();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../../assets/fonts/iconfont.css";
.form-group {
  position: fixed;
  z-index: 10;
  top: 0;
  bottom: 0;
 
  overflow-y: scroll;
  background-color: rgba(255, 255, 255, 1);
  .form-group-item {
    .group-item-wrapper {
      .father-group-item {
        padding: 14px 0 14px 0;

        .form-group-arrow {
          cursor: pointer;
          display: inline-block;
          background: url("../../../../../../assets/images/qwui-others_arrow.png")
            no-repeat;
          width: 9px;
          height: 14px;
          background-size: 9px;
          transform: rotate(90deg);
          transition: transform 0.3s ease;
          margin-right: 35px;
          margin-top: 8px;
          float: right;
        }
        .form-group-arrow.transform {
          cursor: pointer;
          display: inline-block;
          background: url("../../../../../../assets/images/qwui-others_arrow.png")
            no-repeat;
          background-size: 9px;
          transform: rotate(-90deg);
          transition: transform 0.3s ease;
          margin-left: 29px;
        }
        .icon-wrapper {
          display: inline-block;
          width: 33px;
          height: 33px;
          line-height: 33px;
          background: rgba(247, 248, 250, 1);
          text-align: center;
          border-radius: 4px;
          .iconfont-my {
            font-size: 27px;
          }
        }

        .group-name {
          display: inline-block;
          width: 140px;
          height: 21px;
          overflow: hidden;
          font-size: 15px;
          color: rgba(10, 23, 54, 1);
          margin-left: 12px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .select-button {
          display: inline-block;
          float: left;
          width: 47px;
          height: 60px;
          line-height: 60px;
          margin-top: -15px;
          text-align: left;
          cursor: pointer;
        }
      }
    }

    .inside-group {
      .select-button {
        display: inline-block;
        float: left;
        width: 47px;
        height: 60px;
        text-align: left;
        cursor: pointer;
      }
    }
  }
}
.form-group >>> .qwui-btn.qwui-btn_default {
  background: rgba(244, 246, 248, 1);
}

.group-options {
  height: 60px;
  box-shadow: 0px -1px 0px 0px rgba(247, 248, 250, 1);
}
.group-radio-box {
  -webkit-appearance: none;
  background: #fff url("../../../../../../assets/images/ic_form_noradio.png")
    no-repeat;
  background-size: 16px;
  height: 16px;
  width: 16px;
  vertical-align: middle;
  margin-left: 15px;
}
.group-radio-box.son {
  margin-top: 22px;
}
.group-radio-box.checked {
  background: #fff url("../../../../../../assets/images/ic_form_radio.png")
    no-repeat;
  background-size: 16px;
  height: 16px;
  width: 16px;
  margin-left: 15px;
}
.second-group-item {
  border-top: 1px #f7f8fa solid;
  height: 60px;
  .second-group-item-wrapper {

    .second-group-name {
      margin-left: 20px;
      width: 60%;
      height: 60px;
      font-size: 15px;
      color: rgba(10, 23, 54, 1);
      line-height: 60px;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
.form-group-middle{
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 60px;
  overflow-y: scroll;
  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
    bottom: 84px;
  }
  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 896px) and (device-width: 414px) {
    bottom: 84px;
  }
  @media screen and (min-width: 1024px) {
    width: 740px !important;
  }
}
</style>