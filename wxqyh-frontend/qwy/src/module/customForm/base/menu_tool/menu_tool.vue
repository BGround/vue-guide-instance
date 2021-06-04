<template>
  <div class="menu-tool">
    <div class="menu-group-wrapper" v-for="(item, key) in iconData" :key="key">
      <div class="menu-item"
           v-for="(data,index) in item"
           :key="data.name"
           :class="{'selected':data.selected, 'fontSize-set':data.hasIcon,'fontFamily-set':data.fontFamily}"
           @click.stop="changeStyle(data, index, item, key)"
           @mouseover="showTips(index, key,data.name,$event)"
           @mouseout="hideTips(index, key,data.name)">
        <div class="iconstyle"
             :class=" {[data.name]:true}" :style="{'border-color':fontColor}">{{showIconText(data.name)}}</div>
        <div class="tips" :class="data.name+'-tips'" :ref="'tips' + key" hidden>{{data.text}}</div>
        <div class="font-family-set" v-if="data.name=='font-family' && showPop[data.name]">
          <li v-for="(item, i) in fontFamilyList"  @click.stop="setFontFamily(item,index,key)" :value="item.value" :key="i">{{item.value}}</li>
        </div>
        <div class="font-size-set" v-if="data.name=='font-size' && showPop[data.name]" @click.stop>
          <li v-for="(value, i) in fontSizeList"  @click="setFontSize(value,index,key)" :value="value" :key="i">{{value}}</li>
        </div>
        <div class="font-color-set" v-if="data.name=='icon-text-color' && showPop[data.name]" @click.stop>
            <div class="color-item" v-for="(item,i) in textColorList">
              <div class="item" :style="{'background':item.value}" @click="setTextColor(item,index,key)"></div>
            </div>
        </div>
        <div class="border-width" v-if="data.name=='icon-border-width' && showPop[data.name]" @click.stop>
          <div class="combo-item" v-for="(item,i) in borderWidth" @click="setBorderWidth(item,index,key)">
            {{item.text}}
            <div class="item-line-wrapper" v-if="item.text == ''">
              <div class="item-line" :style="{'border-bottom-width':item.border+'px'}"></div>
            </div>
          </div>
        </div>
        <div class="paper-background-set" v-if="data.name=='icon-Bg' && showPop[data.name]" @click.stop>
          <div class="background-set-item">
            <span class="background-set-title">设置背景图</span>
            <span class="background-set-tips" @mouseenter="showBgTips" @mouseleave="hideBgTips">
              <i class="help">?</i>
              <div class="background-tips-text" v-show="bgTips"><div>· 为保证打印效果请上传与纸张大小一致的背景图。</div><div>· 开启打印背景后，打印时将一并打印背景图。</div></div>
            </span>
          </div>
          <div class="background-set-item" @click="setBackground(data.name,index,key)" v-if="paperBackground.name == ''"><span class="background-set-pic">背景图</span><span class="background-set-upload">上传</span></div>
          <div class="background-set-item" v-if="paperBackground.name != ''">
            <div class="background-set-pic">背景图</div>
            <div class="background-set-name"><span class="background-icon"></span><span class="name">{{paperBackground.name}}</span><span class="delBackground" @click="deleteBg">⨯</span></div>
          </div>
          <div class="background-set-item">
            <span>打印背景</span>
            <div class="qwui-user_cell_switch">
            <input type="checkbox" class="qwui-user_cell_input" v-model="paperBackground.isPrintBg">
            </div>
          </div>
        </div>
        <div class="page-set" v-if="data.name=='icon-page' && showPop[data.name]" @click.stop>
          <h3 class="title">{{data.text}}</h3>
          <div class="page-size">
            <h3>纸张大小</h3>
            <qwui-select @selectItem="changePage" :dataList="pageData.size" :selectVal="pageData.sizeVal"></qwui-select>
          </div>
          <div class="page-position">
            <h3>纸张方向</h3>
            <qwui-select @selectItem="changeLayout" :dataList="pageData.position" :selectVal="pageData.positionVal"></qwui-select>
          </div>
        </div>
        <div class="approvalStatus-set" v-if="data.name=='icon-set' && showPop[data.name]" @click.stop>
          <div class="approvalStatus-title">审批状态水印设置</div>
          <div class="approvalStatus-setBtn">
            <label><input type="checkbox" v-model="isApprove.on"/>&nbsp;&nbsp;打印显示审批状态</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import utils from "../../js/utils"
  import QwuiSelect from '@/components/qwuiBase/qwuiSelect/QwSelect'
  export default {
    name: 'menu_tool',
    props: {
      styleData:{
        type:Object,
      },
      paperBackground: {
        type: Object,
      },
      isApprove: {
        type: Object
      }
    },
    components: {
      QwuiSelect
    },
    data() {
      return {
        fontSizeList: [9,10,11,12,14,18,24,30,36],
        fontFamilyList: [{value:'宋体',key:'SimSun'},{value:'黑体',key:'SimHei'},{value:'楷体',key:'KaiTi'},{value:'微软雅黑',key:'MicrosoftYahei'}],
        fontFamilyJson: {"SimSun":"宋体","SimHei":"黑体","KaiTi":"楷体","MicrosoftYahei":"微软雅黑"},
        borderWidth:[
          {
            text:'无边框',
            border:0
          },
          {
            text:'',
            border:1
          },
          {
            text:'',
            border:2
          },
          {
            text:'',
            border:3
          },
          {
            text:'',
            border:4
          },
        ],
        textColorList: dataBase.printTemplate.textColorList,
        fontSize: 9,
        fontColor:"#000000",
        fontFamily: '微软雅黑',
        showPop: {}, //弹窗控制
        bgTips: false,
        pageData: dataBase.printTemplate.pageData,
        /*必配-end*/
        iconData: dataBase.printTemplate.iconData
      }
    },
    created() {
      for(var key in this.iconData) {
        this.iconData[key].forEach(item => {
          if(item.name == 'font-size' || item.name == 'icon-page' ||
            item.name == 'font-family' || item.name == 'icon-Bg' ||
            item.name == 'icon-set' || item.name == 'icon-border-width' || item.name == 'icon-text-color') {
            this.$set(this.showPop, item.name, false) //this.$set触发视图更新
          }
        })
      }
      window.addEventListener('click', this.hideAllPop)
    },
    methods: {
      setMerge(flag){
        this.iconData.merge[0].name = flag ? "icon-unmerge":"icon-merge";
        this.iconData.merge[0].text = flag ? "取消合并":"合并";
      },
      renderMemu(){
        var _this = this;
        utils.forEach(this.styleData, function(e, n) {
          if (n)
            switch (e) {
              case "vertical-align":
                _this.iconData.textAlignVertical[0].selected = (n == 'top');
                _this.iconData.textAlignVertical[1].selected = (n == 'middle');
                _this.iconData.textAlignVertical[2].selected = (n == 'bottom');
                break;
              case "text-align":
                _this.iconData.textAlignHorizontal[0].selected = (n == 'left');
                _this.iconData.textAlignHorizontal[1].selected = (n == 'center');
                _this.iconData.textAlignHorizontal[2].selected = (n == 'right');
                break;
              case "font-weight":
                _this.iconData.fontStyle[1].selected = (n == 'bold');
                break;
              case "font-style":
                _this.iconData.fontStyle[2].selected = (n == 'italic');
                break;
              case "text-decoration":
                _this.iconData.fontStyle[3].selected = (n[0] == 'underline');
                break;
              case "font-size":
                _this.fontSize = n;
                break;
              case "font-family":
                _this.fontFamily = _this.fontFamilyJson[n];
                break;
              case "font-color":
                _this.fontColor = n;
                break;
              case "page":
                _this.pageData.sizeVal = {
                  name: n.size,
                  idx: n.size == 'A4' ? 0 : 1
                }
                _this.pageData.positionVal = {
                  name: n.layout == 'landscape' ? '横向':'纵向',
                  idx: n.layout == 'landscape' ? 1 : 0
                }
                break;

            }
        });
      },
      changeStyle(data, index, item, key) {   // 改变字体的样式
        let showFlag = this.showPop[data.name]
        this.hideTips(index,key,data.name)
        this.hideAllPop() //隐藏所有弹窗
        if(data.name == 'font-size' || data.name == 'icon-page' || data.name == 'font-family' ||
          data.name == 'icon-Bg' || data.name == 'icon-set' || data.name == 'icon-border-width' ||
        data.name == 'icon-text-color') {
          this.showPop[data.name] = !showFlag;
          return
        }
        if( typeof  data.selected == 'boolean'){
          data.selected = !data.selected;
          if(data.type == 'align'){
            data.selected = true;
            for(var i = 0; i<item.length;i++){
              if(i != index){
                item[i].selected = false;
              }
            }
          }

        }
        var obj = {};
        if(data.type == 'fontStyle'){
          obj = {"type":"fontStyle","action": data.className};
        }else if (data.type == 'align'){
          obj = {"type":"align","action": data.className};
        }else if(data.type == 'border'){
          obj = {"type":"border","action":"borderLine","value":data.className}
        }else if(data.type == 'undoRedo'){
          obj = {"type":"undoRedo","action":data.action}
        }else if(data.type == 'merge'){
          obj = {"type":"merge","action":'merge'}
        }else if(data.type == 'insertImg'){
          obj = {"type":'insertImg',"action":'insertImg'}
        }
        this.$emit("setStyle",obj);
      },
      changePage(name, value){
        var obj = {"type": "page" ,"value" : value}
        this.$emit("setStyle",obj);
      },
      changeLayout(name, value){
        var obj = {"type": "layout" ,"value" : value}
        this.$emit("setStyle",obj);
      },
      /**
       * 方法说明
       * @method showTips 鼠标移入显示提示
       * @param {index,key} 索引值，key值
       */
      showTips(index, key,name,e){
        if(this.showPop[name]){return}
        e.stopImmediatePropagation();
        this.$refs['tips' + key][index].style.display = 'block';
      },
      showBgTips(){
        this.bgTips = true;
      },
      hideBgTips(){
        this.bgTips = false;
      },
      deleteBg(){
        this.$emit("deleteBg")
      },
      /**
      * 方法说明
      * @method hideTips 鼠标移出关闭提示
      * @param {index,key}
      */
      hideTips(index, key,name){
        if(this.showPop[name]){return}
        this.$refs['tips' + key][index].style.display = 'none';
      },
      setFontSize(value, index, key){
        var obj = {"type": "fontStyle","action": "fontSize","value": value};
        this.showPop['font-size'] = false;
        this.fontSize = value;
        this.hideTips(index, key);
        this.$emit("setStyle",obj);
      },
      setFontFamily(item, index, key){
        var obj = {"type": "fontStyle","action": "fontFamily","value": item};
        this.showPop['font-family'] = false;
        this.fontFamily = item.value;
        this.hideTips(index, key);
        this.$emit("setStyle",obj);
      },
      setTextColor(item,index,key){
        var obj = {"type": "fontStyle","action": "fontColor","value": item};
        this.showPop['icon-text-color'] = false;
        this.fontColor = item.value;
        this.hideTips(index, key);
        this.$emit("setStyle",obj);
      },
      setBorderWidth(item, index, key){
        var obj = {"type": "border","action": "borderWeight","value": item.border};
        this.showPop['icon-border-width'] = false;
        this.hideTips(index, key);
        this.$emit("setStyle",obj);
      },
      setBackground(name,index,key){
        var obj = {"type": "insertBg","action": "insertBg","value": name};
        this.hideTips(index, key);
        this.$emit("setStyle",obj);
      },
      showIconText(name) {
        if(name == 'font-size') {
          return this.fontSize
        }else if(name == 'font-family'){
          return this.fontFamily
        }
      },
      hideAllPop() {
        let _this = this
        utils.forEach(this.showPop, (key,value) => {
          _this.showPop[key] = false
        })
      }
    },
    beforeDestroy() {
      window.removeEventListener('click', this.hideAllPop)
    }
  }
</script>

<style scoped>
  .menu-tool {
    display: inline-block;
    width: 100%;
    height: 44px;
    background: #fff;
  }
  .menu-tool .menu-group-wrapper {
    display: inline-block;
    position: relative;
    height: 100%;
    padding: 0 12px;
  }
  .menu-tool .menu-group-wrapper li {
    list-style: none;
  }
  .menu-tool .menu-group-wrapper li:hover {
    background-color: #f5f5f5;
  }
  .menu-tool .menu-group-wrapper::after {
    content: "";
    position: absolute;
    top: 14px;
    right: 1px;
    width: 1px;
    height: 18px;
    background: #E5E5E5;
  }
  .help {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: #fff;
    font-size: 12px;
    margin-left: 8px;
    border-radius: 50%;
    background: #CCCCCC;
    text-align: center;
    user-select: none;
  }
  .menu-tool .menu-group-wrapper .menu-item {
    position: relative;
    margin: 10px 0;
    width: 30px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 2px;
    box-sizing: border-box;
  }
  .menu-tool .menu-group-wrapper:last-child::after {
    width: 0;
  }
  .menu-tool .menu-group-wrapper .font-size-set,
  .menu-tool .menu-group-wrapper .font-color-set,
  .menu-tool .menu-group-wrapper .border-width,
  .menu-tool .menu-group-wrapper .font-family-set,
  .menu-tool .menu-group-wrapper .paper-background-set,
  .menu-tool .menu-group-wrapper .approvalStatus-set,
  .menu-tool .menu-group-wrapper .page-set {
    position: absolute;
    top: 29px;
    z-index: 111;
    line-height: 24px;
    text-align: center;
    padding: 5px 0;
    box-shadow: 1px 2px 5px 2px rgba(51,51,51,.15);
    background: #fff;
  }
  .menu-tool .menu-group-wrapper .paper-background-set{
    zoom: 1;
    min-width: 276px;
    padding-bottom: 16px;
    line-height: normal;
  }
  .menu-tool .menu-group-wrapper .approvalStatus-set {
    zoom: 1;
    min-width: 188px;
    padding-bottom: 16px;
    line-height: normal;
  }
  .menu-tool .menu-group-wrapper .font-size-set {
    /*left: -14px;*/
    width: 74px;
  }
  .menu-tool .menu-group-wrapper .font-color-set {
    width: 260px;
    height: 181px;
    padding: 12px;
  }
  .menu-tool .menu-group-wrapper .font-family-set {
    /*left: -4px;*/
    width: 85px;
  }
  .menu-tool .menu-group-wrapper .border-width {
    /*left: -22px;*/
    width: 90px;
  }
  .menu-tool .menu-group-wrapper .page-set {
    width: 320px;
    font-size: 12px;
    text-align: left;
    padding: 16px;
    /*left: -128px;*/
  }
  /*.menu-group-wrapper .font-size-set::after,*/
  /*.menu-group-wrapper .font-family-set::after,*/
  /*.menu-group-wrapper .paper-background-set::after,*/
  /*.menu-group-wrapper .approvalStatus-set::after,*/
  /*.menu-group-wrapper .border-width::after,*/
  /*.menu-group-wrapper .page-set::after {*/
    /*position: absolute;*/
    /*top: -10px;*/
    /*content: "";*/
    /*opacity: 0.9;*/
    /*border-top: 5px solid transparent;*/
    /*border-right: 5px solid transparent;*/
    /*border-bottom: 5px solid #fff;*/
    /*border-left: 5px solid transparent;*/
  /*}*/
  /*.menu-group-wrapper .font-size-set::after,*/
  /*.menu-group-wrapper .font-family-set::after,*/
  /*.menu-group-wrapper .page-set::after {*/
    /*left: 41%;*/
  /*}*/
  /*.menu-group-wrapper .paper-background-set::after {*/
    /*left: 30%;*/
  /*}*/
  /*.menu-group-wrapper .border-width::after {*/
    /*left: 43%;*/
  /*}*/
  /*.menu-group-wrapper .approvalStatus-set::after {*/
    /*left: 90px;*/
  /*}*/
  .menu-group-wrapper .border-width .combo-item{
    line-height: normal;
    text-align: center;
    padding: 6.5px;
    cursor: pointer;
    font-size: 12px;
  }
  .menu-group-wrapper .border-width .combo-item:hover{
    background: #f5f5f5;
  }
  .border-width .combo-item .item-line-wrapper {
    height: 16px;
  }
  .combo-item .item-line-wrapper .item-line {
    padding-top: 7px;
    border-bottom: solid #000;
  }
  .font-color-set .color-item {
    float: left;
    margin: 2px;
    width: 22px;
    height: 22px;
  }
  .font-color-set .color-item .item {
    height: 16px;
    width: 16px;
    margin: 3px;
  }
  .color-item .item:hover {
    transform: scale(1.1);
    -webkit-box-shadow: 0 0 4px rgba(0,0,0,.25);
    -moz-box-shadow: 0 0 4px rgba(0,0,0,.25);
    box-shadow: 0 0 4px rgba(0,0,0,.25)
  }
  .approvalStatus-set .approvalStatus-title {
    margin: 13px 0 0 16px;
    text-align: left;
    color: #A6A6A6;
  }
  .approvalStatus-set .approvalStatus-setBtn {
    margin: 13px 0 0 16px;
    text-align: left;
  }
  /*打印背景图*/
  /*打印设置按钮开始*/
  .qwui-user_cell_switch {
     position: absolute;
     top: 0px;
     left: 211px;
  }
  .qwui-user_cell_input{
    position: absolute;
    width: 28px;
    height: 14px;
    border: 1px solid #dfdfdf;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #dfdfdf;
    cursor: pointer;
    appearance: none;
    transition: background-color 0.1s, border 0.1s;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .qwui-user_cell_input:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    border-radius: 15px;
    background-color: #FDFDFD;
    transition: -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  .qwui-user_cell_input:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }
  .qwui-user_cell_input:checked{
    border-color: #F87B00;
    background-color: #F87B00;
  }
  .qwui-user_cell_input:checked:before{
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  .qwui-user_cell_input:checked:after{
    -webkit-transform: translateX(14px);
    transform: translateX(14px);
  }
  /*打印设置按钮结束*/
  .background-set-item {
    position: relative;
    margin : 16px 16px 0 16px;
    text-align: left;
    font-size: 12px;
  }
  .background-set-title {
    color: #A6A6A6;
  }
  .background-set-upload {
    margin-left: 184px;
    color: #F87B00;
  }
  .background-set-print {
    margin-left: 168px;
    width: 28px;
    height: 16px;
  }
  .background-set-tips{
    position: relative;
  }
  .background-tips-text{
    position: absolute;
    top: 17px;
    z-index: 1;
    width: 319px;
    padding: 12px;
    background: #FFFFFF;
    box-shadow: 1px 2px 5px 2px rgba(51,51,51,.15);
  }
  .background-tips-text::after{
    position: absolute;
    top: -10px;
    left: 22%;
    content: "";
    opacity: 0.9;
    border-top: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #fff;
    border-left: 5px solid transparent;
  }
  .background-set-name {
    margin-top: 12px;
    width:242px;
    height:48px;
    background:rgba(252,252,252,1);
    border-radius:2px;
    border:1px solid #D5D5D5;
  }
  .background-set-name .delBackground {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 12px;
    color: #fff;
    font-size: 16px;
    margin-left: 10px;
    border-radius: 50%;
    background: #CCCCCC;
    text-align: center;
    user-select: none;
  }
  .background-set-name .name {
    display: inline-block;
    margin-bottom: -2px;
    max-width:173px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .background-icon{
    display: inline-block;
    width: 13px;
    height: 16px;
    margin: 16px 8px -3px 12px;
    background: url(~assets/images/icon_b-uploud_pic.png) no-repeat center;
    background-size: 100%;
  }
  .page-set .title {
    color: #A6A6A6;
  }
  .page-set h3 {
    height: 16px;
    line-height: 16px;
  }
  .page-set .page-size h3, .page-set .page-position h3 {
    margin: 16px 0 12px 0;
  }
  .menu-tool .menu-group-wrapper .iconstyle {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 18px;
    height: 18px;
    line-height: 18px;
    transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    background: url(~assets/images/icon_b-toolbar_group.png) no-repeat;
    background-size: 269px 36px;
  }
  .menu-tool .menu-group-wrapper .iconstyle.font-size {
    transform: translate(-90%,-50%);
    background-size: 0 0;
    user-select: none;
  }
  .menu-tool .menu-group-wrapper .iconstyle.font-family {
    width: 70px;
    transform: translate(-60%,-50%);
    background-size: 0 0;
    user-select: none;
  }
  .menu-tool .menu-group-wrapper .iconstyle.icon-Bg{
    left: 16px;
  }
  .menu-tool .menu-group-wrapper .iconstyle.icon-set{
      left: 16px;
  }
  .menu-tool .menu-group-wrapper .fontSize-set {
    width: 50px;
  }
  .menu-tool .menu-group-wrapper .fontFamily-set {
    width: 80px;
  }
  .font-size-tips.tips {
    transform: translate3d(-4%, 0, 0);
  }
  .icon-page-tips.tips {
    transform: translate3d(-18%, 0, 0);
  }
  .font-family-tips.tips {
    transform: translate3d(26%, 0, 0);
  }
  .icon-merge-tips.tips {
    transform: translate3d(-23%, 0, 0);
  }
  .icon-set-tips.tips {
    transform: translate3d(-19%, 0, 0);
  }
  .icon-border-width-tips.tips {
    transform: translate3d(-17%, 0, 0);
  }
  .menu-tool .menu-group-wrapper .fontSize-set::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 30px;
    width: 18px;
    height: 18px;
    background: url(~assets/images/icon_b-toolbar_group.png) no-repeat;
    background-position: -36px 0;
    background-size: 252px 36px;
  }
  .menu-tool .menu-group-wrapper .fontFamily-set::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 60px;
    width: 18px;
    height: 18px;
    background: url(~assets/images/icon_b-toolbar_group.png) no-repeat;
    background-position: -36px 0;
    background-size: 252px 36px;
  }
  .menu-tool .menu-group-wrapper .menu-item:hover,
  .menu-tool .menu-group-wrapper .menu-item.selected {
    border-color: #E5E5E5;
  }
  .tips{
    position: absolute;
    top: 30px;
    border-radius: 2px;
    word-break: keep-all;
    padding: 0 10px;
    text-align: center;
    z-index: 112;
    background: #444444;
    opacity: 0.9;
    color: #fff;
    transform: translate3d(-28%, 0, 0);
  }
  .tips::after{
    position: absolute;
    top: -10px;
    left: 41%;
    content: "";
    opacity: 0.9;
    border-top: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #444444;
    border-left: 5px solid transparent;
  }
  .menu-tool .menu-group-wrapper .icon-undo {
    background-position: 0 0;
  }
  .menu-tool .menu-group-wrapper .icon-redo {
    background-position: -18px 0;
  }
  .menu-tool .menu-group-wrapper .icon-bold {
    background-position: -54px 0;
  }
  .menu-tool .menu-group-wrapper .icon-italic {
    background-position: -72px 0;
  }
  .menu-tool .menu-group-wrapper .icon-underline {
    background-position: -90px 0;
  }
  .menu-tool .menu-group-wrapper .icon-text-color {
    left: 40%;
    height: 16px;
    border-bottom: 2px solid;
    background-position: -251px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-left {
    background-position: -162px 0;
  }
  .menu-tool .menu-group-wrapper .icon-center {
    background-position: -180px 0;
  }
  .menu-tool .menu-group-wrapper .icon-right {
    background-position: -198px 0;
  }
  .menu-tool .menu-group-wrapper .icon-top {
    background-position: -108px 0;
  }
  .menu-tool .menu-group-wrapper .icon-middle {
    background-position: -126px 0;
  }
  .menu-tool .menu-group-wrapper .icon-bottom {
    background-position: -144px 0;
  }
  .menu-tool .menu-group-wrapper .icon-border-bottom {
    background-position: -108px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-border-top {
    background-position: -126px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-border-left {
    background-position: -90px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-border-right {
    background-position: -144px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-border {
    background-position: -198px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-border-none {
    background-position: -162px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-border-width {
    left: 33%;
    background-position: -214px 0px;
  }
  .menu-tool .menu-group-wrapper .icon-border-1 {
    background-position: -180px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-merge {
    background-position: 0 -18px;
  }
  .menu-tool .menu-group-wrapper .icon-unmerge {
    background-position: -216px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-img {
    background-position: -18px -18px;
  }
  .menu-tool .menu-group-wrapper .icon-Bg {
     background-position: -233px -18px;
   }
  .menu-tool .menu-group-wrapper .icon-set {
    background-position: -252px 0;
  }
  .menu-tool .menu-group-wrapper .icon-page {
    background-position: -36px -18px;
    transform: translate(-90%,-50%);
  }
</style>

