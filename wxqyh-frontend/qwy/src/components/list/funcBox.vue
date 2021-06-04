<!--
    消息盒子居中显示组件
    @param boxWidth:box宽度(默认600)
    @param firstBtn:第一个按钮名称
    @param secondBtn:第二个按钮名称
    @param closeBox(必传):关闭盒子的回调函数
    @param firstFunc(必传):第一个按钮回调函数
    @param secondFunc(必传):第二个按钮回调函数
    @param footerSpaceBetween(选填)：默认为false —— 底部按钮居中；true —— 底部主要按钮与次要按钮居右，扩展功能居左

    用法：
    <parent>
      <func-box @closeBox="xxx" firstBtn="xxx" secondBtn="xxx" :boxTitle="xxx" @firstFunc="xxx" @secondFunc="xxx">
          <child ref="xxx"></child>
      </func-box>
    </parent>
 -->
<template>
    <div class="funcBox_wrap">
        <div class="funcBox_mask">
            <div class="funcBox" :style="{width:boxWidth+'px'}">
                <div class="funcBox_header">
                    <span class="box_title">{{boxTitle}}</span>
                    <span class="close" @click="close">×</span>
                </div>
                <div class="funcBox_main">
                    <slot></slot>
                </div>
                <div class="funcBox_footer" :class="{ 'space-between': footerSpaceBetween }">
                    <div>
                      <slot name="footer"></slot>
                    </div>
                    <div>
                      <div v-if="firstBtn!=''" class="btn orangeBtn mr10" @click="ok">{{firstBtn}}</div>
                      <div v-if="secondBtn!=''" class="btn" @click="cancel">{{secondBtn}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const DISTANCE = 195;  // 距离窗口上下的高度
export default {
  data() {
    return {
      kk: false
    };
  },
  props: {
      boxWidth: {
        default: 600
      },
      firstBtn: {
          default: '确定'
      },
      secondBtn: {
          default: '取消'
      },
      boxTitle:{
          default: ''
      },
      // 现UI规范组件底部按钮有两种布局方式，1>主要按钮和次要按钮居中 2>主要按钮与次要按钮居右，扩展功能居左
      footerSpaceBetween:{
        type: Boolean,
        default: false
      }
  },
  methods: {
    // 关闭盒子
    close() {
        this.$emit('closeBox');
    },

    // 第一个按钮功能
    ok(){
        this.$emit('firstFunc');
    },

    // 第二个按钮功能
    cancel(){
        this.$emit('secondFunc');
    }
  },
  mounted() {
    this.$nextTick(() => {
      let windowHeight = document.documentElement.clientHeight;
      document.querySelector(".funcBox_main").style.maxHeight = `${windowHeight - DISTANCE}px`;
    })
  }
};
</script>
<style scoped>
.mr10 {
  margin-right: 10px;
}
.funcBox_wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 11;
}
.funcBox_mask {
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.funcBox {
  position: relative;
  background-color: #f7f7f7;
}
.box_title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  width: 90%;
  font-size: 18px;
  color: #333;
}
.funcBox_header {
  position: relative;
  padding-left: 20px;
  height: 45px;
  line-height: 45px;
  border: 1px solid #ddd;
  background: #ececec;
  box-sizing: border-box;
}
.funcBox_header .close {
  position:absolute;
  top: 0;
  right: 0;
  display: block;
  padding: 12px 16px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-style: normal;
  font-size: 30px;
  color: #ccc;
  cursor: pointer;
}
.funcBox_main {
  overflow: auto;
}
.funcBox_footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background: #ffffff;
}
.space-between{
  justify-content: space-between;
  padding: 0 28px;
}
.funcBox_footer .btn {
  padding: 0 20px;
  height: 30px;
  border: 1px solid #ccc;
  background: #fff;
  box-sizing: border-box;
}
.funcBox_footer .orangeBtn {
  border: 1px solid #f87b00;
  background: #C31725;
}
.funcBox_footer .btn:hover {
  background: #f7f7f7;
}
.funcBox_footer .orangeBtn:hover {
  background: #f87b00;
}
</style>


