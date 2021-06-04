<!--by zengjiaying 20180518-->
<template>
<div class="qwui-writeAssignBox">
  <div class="qwui-writeAssign">
    <div class="qwui-writeAssign_border" id="canvasDiv">
      <div class="qwui-head_writeAssign">
        <p class="signed_tit" v-if="assignVipGold">请工整书写您的签名</p>
        <p class="signed_tips" v-if="!assignVipGold">手写签名仅VIP可用，请联系管理员升级</p>
      </div>
      <div class="qwui-btn_writeAssign">
        <div class="fl">
          <span class="btn_writeAssign btn_writeAssign_default" @click="clearCanvas">清除</span>
        </div>
        <div class="fr">
          <span class="btn_writeAssign btn_writeAssign_default" v-if="assignVipGold" @click="cancelCanvas">取消</span>
          <span class="btn_writeAssign btn_writeAssign_primary" v-if="assignVipGold"
                @click="saveCanvasToURL">保存</span>
          <span class="btn_writeAssign btn_writeAssign_primary" v-if="!assignVipGold" @click="cancelCanvas">返回</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import {isVipSilver} from '@/assets/js/vip-portal'
  const PAGEX = 20
  const PAGEY = 20
  export default {
    name: "qw_assign_box",
    props: {
      imgUrl: {
        type:String,
        default:''
      },
      isFree: {
        type: String
      }
    },
    data() {
      return {
        isWriteSign: !!this.imgUrl,    // 是否有手写签名。false 没有，true 有。清除签名为false
        imageUrl: this.imgUrl,        // 绘制的图片
        myEntity: {
          width: window.innerHeight-PAGEX,
          height: window.innerWidth-PAGEY,
        },
        ongoingTouches:[],      // 当前活动的触摸点
        canvasLeft:10,
        canvasTop:10,
        // 是否是银卡标识
        assignVipGold: false,
        // 当前触点
        point: {
          notFirst: false,
        },
        // 继续绘制标识
        paint: false,
        // 触点位置
        clickX: [],
        clickY: [],
        // 是否绘制所有储存的触点标识
        clickDrag: [],
      }
    },
    created() {
      if (this.isFree == "1") {    // 自由流程判断是否银卡卡VIP
        this.assignVipGold = isVipSilver(interfaceCode.INTERFACE_CODE_FORM);
      } else {
        this.assignVipGold = true;
      }
    },
    mounted() {
      this.init();
      let evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
      let self = this;
      window.addEventListener(evt, function () {
        setTimeout(function () {
          self.changeOrientation();
        }, 500);
      });
    },
    methods: {
      init() {
        // 创建离屏canvas
        this.myEntity.offscreenCanvas = document.createElement("canvas");
        this.myEntity.offscreenCanvas.width = this.myEntity.width;
        this.myEntity.offscreenCanvas.height = this.myEntity.height;
        this.myEntity.offscreenContext = this.myEntity.offscreenCanvas.getContext("2d");
        this.myEntity.offscreenContext.rect(0,0,this.myEntity.width,this.myEntity.height);
        this.myEntity.offscreenContext.fillStyle="#ffffff";
        this.myEntity.offscreenContext.fillRect(0,0,this.myEntity.width,this.myEntity.height);
        // 路径样式
        this.myEntity.offscreenContext.strokeStyle = "#000000";
        this.myEntity.offscreenContext.lineJoin = "round";
        this.myEntity.offscreenContext.lineCap = "round"
        this.myEntity.offscreenContext.lineWidth = 5;

        this.$nextTick(function () {
          let $canvasWrap = document.getElementById('canvasDiv')
          $canvasWrap.appendChild(this.myEntity.offscreenCanvas)
          this.drawImage()
          this.startup()
          this.changeOrientation();
        })
      },
      // 有签名，则绘制出来
      drawImage() {
        let self = this
        if(!this.isWriteSign) {return}
        let img = new Image()
        img.onload = function () {
          self.myEntity.offscreenContext.drawImage(img,0,0)
        }
        img.src = this.imgUrl
      },
      // 设置事件处理器
      startup() {
        let el = document.getElementsByTagName("canvas")[0];
        el.addEventListener("touchstart", this.handleStart, false);
        el.addEventListener("touchend", this.handleEnd, false);
        el.addEventListener("touchmove", this.handleMove, false);
      },
      // 添加触点
      addClick(x, y, dragging) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
      },
      // 画图
      redraw(e) {
        e.preventDefault()
        let touch = e.changedTouches[0]
        let startX = touch.clientX - this.canvasLeft
        let startY = touch.clientY - this.canvasTop
        this.addClick(startX, startY, true)

        let context = this.myEntity.offscreenContext
        context.strokeStyle = "#000000";
        context.lineJoin = "round";
        context.lineWidth = 5;

        while (this.clickX.length > 0) {
          this.point.bx = this.point.x;
          this.point.by = this.point.y;
          this.point.x = this.clickX.pop();
          this.point.y = this.clickY.pop();
          this.point.drag = this.clickDrag.pop();
          context.beginPath();
          if (this.point.drag && this.point.notFirst) {
            context.moveTo(this.point.bx, this.point.by);
          } else {
            this.point.notFirst = true;
            context.moveTo(this.point.x - 1, this.point.y);
          }
          context.lineTo(this.point.x, this.point.y);
          context.closePath();
          context.stroke();
        }
      },
      // 跟踪触摸行为
      handleStart(e) {
        this.isWriteSign = true
        this.paint = true;
        this.point.notFirst = false;
        this.redraw(e);
      },
      // 对触摸行为的结束进行处理
      handleEnd(e) {
        this.paint = false;
      },
      // 当触摸移动时绘制
      handleMove(e) {
        e.preventDefault()
        if (this.paint) {
          this.redraw(e)
        }
      },
      // 清除画板
      clearCanvas() {
        this.myEntity.offscreenContext.clearRect(0,0,this.myEntity.width,this.myEntity.height)
        this.myEntity.offscreenContext.rect(0,0,this.myEntity.width,this.myEntity.height);
        this.myEntity.offscreenContext.fillStyle="#fff";
        this.myEntity.offscreenContext.fillRect(0,0,this.myEntity.width,this.myEntity.height);

        this.myEntity.offscreenContext.lineWidth = 5;
        this.isWriteSign = false
        this.imageUrl = ''
      },
      // 查询正在进行的触摸行为
      ongoingTouchIndexById(idToFind) {
        for (let i=0; i<this.ongoingTouches.length; i++) {
          let id = this.ongoingTouches[i].identifier;
          if (id == idToFind) {
            return i;
          }
        }
        return -1;    // not found
      },
      // 保存签名
      saveCanvasToURL() {
        this.imageUrl = this.myEntity.offscreenCanvas.toDataURL('image/png')
        if (!this.isWriteSign) {
          _.tooltips_succeed('请输入签名', true, "", 3000);
          return
        }
          if (!this.isLandscape) {
          this.getHorizontalImage(this.imageUrl,this.isWriteSign);
          } else {
          this.$emit('saveCanvasToURL', {imageUrl:this.imageUrl, isWriteSign:this.isWriteSign});
        }
      },
      getHorizontalImage(imageUrl, isWriteSign) {
        var tmpCanvas = document.createElement('canvas');
        var ctx = tmpCanvas.getContext('2d');
        // 旋转-90度
        var angle = -90 * Math.PI / 180;
        var tmpImage = new Image();
        tmpImage.src = imageUrl;

        // 使用canvas重新绘制并旋转90度
        var self = this
        tmpImage.onload = function () {
          var width = tmpImage.width;
          var height = tmpImage.height;
          tmpCanvas.width = height;
          tmpCanvas.height = width;
          ctx.rect(0, 0, height, width);
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, height, width);
          ctx.rotate(angle);
          ctx.drawImage(tmpImage, -width, 0);

          this.imageUrl = tmpCanvas.toDataURL('image/png');
          self.$emit('saveCanvasToURL', {imageUrl:this.imageUrl, isWriteSign})
        }
      },
      // 取消签名
      cancelCanvas() {
        this.$emit('cancelCanvas',{imageUrl:this.imageUrl,isWriteSign:this.isWriteSign})
      },
      changeOrientation() {
        var $canvasDiv = document.getElementById('canvasDiv');

        if ($canvasDiv == null) {
          return
        }

        // 除去容器边距 20px
        var winWidth = window.innerWidth - PAGEX;
        var winHeight = window.innerHeight - PAGEY

        this.isLandscape = winWidth > winHeight;
        var translate = (winHeight - winWidth) / 2;
        var width, height, top, left, transform, canvasTransform;

        // 判断是否横屏
        if (this.isLandscape) {
          width = winWidth + 'px';
          height = winHeight + 'px';
          top = 0;
          left = 0;
          transform = 'none';
          canvasTransform = 'none';
        } else {
          width = winHeight + 'px';
          height = winWidth + 'px';
          top = (translate - 1) + 'px';
          left = -(translate + 1) + 'px';
          transform = 'rotate(90deg)';
          canvasTransform = 'rotate(-90deg) translate(' + top + ',' + top + ')';
        }

        $canvasDiv.style.width = width;
        $canvasDiv.style.height = height;
        $canvasDiv.style.top = top;
        $canvasDiv.style.left = left;
        $canvasDiv.style['transform'] = transform;
        $canvasDiv.style['-webkit-transform'] = transform;

        this.myEntity.width = winWidth;
        this.myEntity.height = winHeight;
        this.myEntity.offscreenCanvas.width = this.myEntity.width;
        this.myEntity.offscreenCanvas.height = this.myEntity.height;
        this.myEntity.offscreenCanvas.style['transform'] = canvasTransform;
        this.myEntity.offscreenCanvas.style['-webkit-transform'] = canvasTransform;

        this.clearCanvas();
      }
    },
  }
</script>

<style scoped>
  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .qwui-head_writeAssign{
    position: absolute;
    z-index: 21;
    top: 10px;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
    line-height: 30px;
    -webkit-transform: translateZ(10px);
    transform: translateZ(10px);
  }

  .signed_tit {
    font-size: 14px;
    color: #999;
  }

  .signed_tips {
    text-align: center;
    font-size: 14px;
    color: #D17437;
    background-color: #FDF9DB;
  }

  .qwui-writeAssignBox {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 21;
    padding: 5px;
    box-sizing: border-box;
    background-color: #7a7a7a;
  }

  .qwui-writeAssign {
    width: 100%;
    height: 100%;
    padding: 5px;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: #fff;
  }

  .qwui-writeAssign_border {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px #bbb dashed;
    border-radius: 5px;
    overflow: hidden;
  }

  .qwui-btn_writeAssign {
    position: absolute;
    z-index: 21;
    bottom: 10px;
    padding: 0 15px;
    width: 100%;
    box-sizing: border-box;
    -webkit-transform: translateZ(10px);
    transform: translateZ(10px);
  }

  .btn_writeAssign {
    display: inline-block;
    position: relative;
    padding: 0 20px;
    line-height: 30px;
    font-size: 16px;
    border-radius: 5px;
  }

  .btn_writeAssign:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .btn_writeAssign_default {
    color: #333;
    background-color: #FBFAFC;
  }

  .btn_writeAssign_default:after {
    border: 1px solid #D6D5D6;
  }

  .btn_writeAssign_primary {
    color: #fff;
    background-color: #2F7DCD;
  }

  .btn_writeAssign_primary:after {
    border: 1px solid #0D68C6;
  }
</style>
