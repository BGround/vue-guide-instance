<template>
  <div>
  <div class="qwui-menu">
    <div class="qwui-menu-head">
      <p>
        <span>启动</span>
        <span class="default-font">(按住滑动排序)</span>
        <span class="default-font right btn_color"
            @click="restore">系统默认</span>
      </p>
    </div>
    <div class="flex">
      <div
        v-for="(element, index) in openMenu" v-dragging="{ item: element, list: openMenu, group: 'element' }"
        :key="element.text"
        v-if="element.isOpen"
        class="qwui-application"
        :class="{disabled:element.routerName=='my_relavent'|| minNum == 2}">
          <i v-if='element.routerName !=="my_relavent" && minNum !==2 ' class="del_btn" @click="isOpen(element,true,index)">-</i>
          <i class="iconfont_new" :class="element.icon"></i>
          <i class="font-i">{{element.text}}</i>
      </div>
    </div>
    <div class="qwui-menu-head">
      <p>
        <span>隐藏</span>
        <span class="default-font">({{ minNum == 5?'暂无':noMenuText}})</span>
      </p>
    </div>
    <div class="flex">
      <div
        v-for="(element,index) in noOpenMenu"
        :key="element.text"
        class="qwui-application">
          <i class="add_btn" @click="isOpen(element,false,index)">+</i>
          <i class="iconfont_new" :class="element.icon"></i>
          <i class="font-i">{{element.text}}</i>
        </div>
    </div>


  </div>
  <footer>
    <div class="tipMes">发布后将应用到所有人</div>
    <div class="btns_div">
      <span class="btns cancel_btn" @click="cancel">取消</span>
      <span class="btns determine_btn"
      @click="relase">确定发布</span>
    </div>
  </footer>
  </div>

</template>
<script>
import draggable from 'vuedraggable';
import { saveMenu } from '../api/getData'
export default {
  name: 'QWMoveMenu',
  components: {
    draggable
  },
  props:{
    getMenuData:{
      type:Object,
    }
  },
  data (){
    return{
      tags:dataBase.myRelavent.diyMenu, //所有菜单栏
      minNum:0,
      openMenu:[], //已开启菜单列表
      noOpenMenu:[], //隐藏菜单列表
      theLock: true, // 发布锁
      noMenuText: '点击添加到启用',
      sendMes:{},
      openDefault:"learning_tasks;examination;liveplay_list;mall_list;my_relavent",
      nav:[{
        icon: "icon-peixunxuexi_xuexirenwuon",
        tab: "学习任务",
        routerName: "learning_tasks",
        index: 0,
        isOpen:true,
        },
        {
        icon: "icon-peixunxuexi_kaoshioff",
        tab: "考试",
        routerName: "examination",
        index: 1,
        isOpen:true,
        },
        {
        icon: "icon-peixunxuexi_zhibooff",
        tab: "直播",
        routerName: "liveplay_list",
        index: 2,
        isOpen:true,
        },
        {
        icon: "icon-peixunxuexi_faxianoff",
        tab: "发现",
        routerName: "mall_list",
        index: 3,
        isOpen:true,
        },
        {
        icon: "icon-peixunxuexi_wodeoff",
        tab: "我的",
        routerName: "my_relavent",
        index: 4,
        isOpen:true,
        }],
    }
  },
  mounted (){
    this._getInit();
  },
  methods: {
    isOpen (element,flag,index){ // 启动菜单
      if(flag){
      if(this.minNum>2){
        element.isOpen = false;
        this.noOpenMenu.push(element)
        this.openMenu = this.openMenu.filter(function(value){
          return value != element;
        })
        this.minNum--;
      }
    }else{ //隐藏菜单
        element.isOpen = true;
        this.openMenu.push(element)
        //交换数组位置--保持“我的”菜单位置在最后
        let x = this.openMenu.length-1, y = this.openMenu.length;
        this.openMenu.splice(x - 1, 1, ...this.openMenu.splice(y - 1, 1, this.openMenu[x - 1]))
        this.noOpenMenu = this.noOpenMenu.filter(function(value){
          return value != element;
        })
        this.minNum++;
    }
    },
    relase (){  // 确认发布
        let _this = this;
      let sendMenu = '';
      let lengthMenu = this.openMenu.length - 1;
      let entryListLength = dataBase.myRelavent.entryList.length;
      const nowLearn = {class: 'recentStudy', text: '最近学习', path: 'myStudy', router: true,routerName: "learning_tasks",};
      if(this.theLock){
        this.theLock = false;
        let hasExamination = false; //是否有考试菜单
        this.openMenu.forEach(function(ele,index){
          ele.routerName == 'examination'? hasExamination = true:'';
          if(lengthMenu == index){
            sendMenu += ele.routerName;
          }else{
            sendMenu += ele.routerName + ';'
          }

        })
      return new Promise((resolve, reject) => {
        saveMenu({menu:sendMenu}, data => {
            let newNav = [];
            let flag = dataBase.myRelavent.entryList[0].routerName?true:false;
            //入口菜单，若底部菜单栏只剩下“我的”和“考试”，则“我的-最近学习”入口不可见。
            if(this.openMenu.length === 2 && hasExamination){
              if(flag){
                dataBase.myRelavent.entryList.splice(0,1)
              }
            }else{
              if(!flag){
                dataBase.myRelavent.entryList.unshift(nowLearn)
              }
            }
            //展示底部菜单栏
            _this.nav.forEach(function(ele){
              let openArray = sendMenu.split(';');
              let index =  openArray.indexOf(ele.routerName);
              index<0 ?'':newNav[index] = ele;
              index<0 ? '':newNav[index].index = index;
            })
            dataBase.home.footerListData.nav = newNav;
            this.theLock = true;
            this.$router.back();
          resolve();
        });

          });


      }

    },
    cancel () { //取消
      this.$router.back();
    },
    restore (){ //恢复默认菜单
       this._getInit(this.openDefault);
    },
    _getInit(openDefault){
    var _this = this;
    _this.openMenu = [];
    _this.noOpenMenu = [];
    let openArray = openDefault?openDefault.split(';'):_this.getMenuData.menu.split(';'); //已开启菜单
    let openArrayLength = openArray.length;
    let tempOpenMenu = []; // 开启项目的副本，用于计算
    _this.minNum = openArrayLength;
    dataBase.myRelavent.diyMenu.forEach(element => {   //渲染已开启的菜单
      let flag = false;
      openArray.forEach(function(value, index){
        if(element.routerName == value){
         flag = true;
        }
      });
      if(flag){
        element.isOpen = true;
        tempOpenMenu.push(Object.assign({
          index: openArray.findIndex((val) => {
            return val == element.routerName;
          })
       }, element));
      }else{
        element.isOpen = false;
        _this.noOpenMenu.push(element);
      }
    });

    // 为开启的项排序
    let openMenu = this.openMenu;
    tempOpenMenu.sort((val, nextVal) => { // 副本数组排序
      return val.index - nextVal.index;
    });
    tempOpenMenu.forEach((val) => { // 删除排序为副本添加的属性，避免干扰其他代码
      delete val.index;
    });
    // 为开启数组赋值
    openMenu.push.apply(openMenu, tempOpenMenu);
  } 
  }
}
</script>
<style lang="scss" scoped>
.qwui-menu{
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;

  font-family:PingFangSC-Regular;
  font-weight: normal;
  font-size: 16px;
  color: #091636;
  .qwui-menu-head{
    position: relative;
    width: 100%;
    height: 62px;
    line-height: 62px;
  }
  .default-font{
    font-size: 13px;
    color:#B2B9C8;
  }
  .btn_color{
    color: #5485EF;
    cursor:pointer;
  }
  .right{
    float: right;
  }
  .flex {
    display: -webkit-flex; /* Safari */
      display: flex;
    flex-wrap: wrap;
    justify-content: left;
    :nth-child(3){
    margin-right: 0 !important;
    }
  }
  .qwui-application{
      position: relative;
      display: inline-block;
      width: 30%;
      height: 88px;
      line-height: 130px;
      // margin-bottom:16px;
      margin: 0 5% 16px 0;
      text-align: center;
      border-radius: 4px;
      background: #fff;
      box-shadow:0px 2px 8px 0px rgba(76,78,81,0.05);
      .font-i{
      font-size: 14px;
      color:#7A7D80;

    }
  }
  .disabled{
    background: #E3E3E7;
    pointer-events: none;
  }
  .iconfont_new{
    position: absolute;
    left: 50%;
    margin-left: -15px;
    top: 19px;
    display: inline-block;
    width: 30px;
    height: 30px;
  }
  .del_btn{
    position: absolute;
    height: 2px;
    top: -58px;
      right: 5px;
    color: #FFC364;
    font-size: 20px;
  }
  .add_btn{
    position: absolute;
    width: 5px;
    height: 2px;
    top: -56px;
    right: 13px;
    color: #5585F0;
    font-size: 20px;
  }
  .img_a-profile_exam{
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAA8CAYAAADWibxkAAADe0lEQVRoQ+1bTUwTQRT+3raAqAQREzQxePOCR6ANcgClFAwtRLEnE6PRCx6MZw/ixZMmmhAxGg6aeOnJtgJtIalGhC1ojPHkxRtyIUEk4b/7zFZagbTuLpSlsLPHnTdv3nzzZme+t+8RMjyBYbmCElTDUMqJQJlk8uWdBNsqA1M4Ko15qqvnjdq1YXIDMfnk6jIeA+gAYDOqbJfl54moZ7pg/t61xsZFvbakAegfjp9OJPg9EVUwc16v+v8mR6DR8pJEU11d3YIeEJIT9fv9tuIjlV8YOAPOb5fPNCki4o2LRr1et6NLNwCBwfhlktif6kDAIoN6SeJvqmY9inZNhqmQiJoAdK4DYXWF7ZWXWqqntOxKekAoEu9j8PU0ADbpiqep9rVW53xqD0bjL8B8I2WTwnS1o8XxSsvGJADBiBwF4EoJHytRDurdQ1oDmNUejEy0AomB9HhEd73Njgda4//1gKgcY0ZDStjrdu65j2BocKyBJYr928bU7XE77gsANiEQGBkpWfpZtuTzVS2rTZbygFB0/DZz4hFAc5KNvG1Njg/WAiAS/8Xg0jWnCHjdzg5LARCMyOkjnQjvPM3ORgGAlU4B4QFiC4hvgPgIpm+K4hTIwTEYDn86scArRVr3bT3tdnuBsjDzY9Ln8yX0yG+W0cMFcnYKxGKxA3PLxcMAzm7F2Kx9CJMFdtv51nM1343qNRWA4JDcDgVvjBqpJU8ENfzyxOt23tGS3VUPCIbHq0DK11wHTlUAAOryNDue5TUAqnFvh+JuReGLIBQaNTaTPDEpIEx8Hq193t1NilGdpm4Bo8aZIS8A0BERytkpYMaKGh1DeIDwAO2gqNgCgg4LOizosKDDawiIqPB2AiLJfILSUy8Z6AQ4J/GAbBcfAs0yc7e3xalmrmR9TL0IhaLyBWb0G72tbUM+wYdWy9rr6+ey6TAXgPBoLZNNBsxJpSFgZmG25Hjqh2YmEEwFQDUgEB67SUSdlCM6nG1lmTFLkv2hx1U9kjdbYBuuvGNdTfeAHZvJFhULAAQbFGxQM0dI0GFBhwUdFnRY0GEr0+GQ1dPkUomSBPoNye5V+YWl0uSSJM7KqbIZf8qqL0W6fETuY8C6BROWL5nZb0VTkiQ9bXPV3tITWth3ZXMgfFw8rLh8RsrmUkjt+cJJ5p7posWtFU6udxcrlc7+AXysLnmVaDqwAAAAAElFTkSuQmCC) no-repeat left top;
    background-size:100% 100%;
  }
  .img_a-profile_found{
    background: url(data:image/png;base64,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) no-repeat left top;
    background-size: 100% 100%;
  }
  .img_a-profile_live{
    background: url(data:image/png;base64,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) no-repeat left top;
    background-size: 100% 100%;
    width: 35px;
    height: 25px;
    margin: 2.5px 0 0 -17.5px !important;
  }
  .img_a-profile_mine{
    background: url(data:image/png;base64,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) no-repeat left top;
    background-size: 100% 100%;
  }
  .img_a-profile_task{
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAA8CAYAAADWibxkAAADnElEQVRoQ+2bT0wTQRTGv7dFLRgDiSZ4EG4aDmrigdhWI5BAKwotHqwaPWE8eOOm8aLRAx65GQ8Yg5iY9SIQ0CIJemlLhBgjFz2Z4IVEEv8FFNl9ZloWSlNoS6dLlk6Pu7Pb+X7z5s2bt/MIGX4DY/FqMqieYe4lAmVq45RrzGCCNscufhdq9sym93uNuJHx+IGlRfQA3AHA5RSROfbTAGHA5MWujkDDjPXMCoDhsYlDhmG+JaJqZiY4e+AzMiECM/Msm0ZjqPXkJ9EoAUDXdVd5Vc17Bh0GW8o5R7BOaZYcawEB4OmF7zPHwuGwkbg68DJ6njTSkzwSBP4w8IA0+iiQOUVipn4SEbHJRwi4zoDb0sjE4ZDf9zwBYCgS72Vw5woAF660N3ufOll4et+HxmKX2UD/6iDTo/aA52oCwGAkNgqgxbq5bw9X+Hy+he0EIBqNln/7RfOWRgCvgwGvP2kBo7FxZjRaN4MBr6OXvvUGbjAS4xULILxp93ubFABlAWoKKB+gnKBaBdQyqOIAFQipSFCFws7YC4jcRUVV7S3DNE+4SHvcFvA8y3XT5vi9gBDvrqp9AuAiElkrLBkmDp5r9X7JBYKjAayIZ75kpetEhotQdrQtUD+9rQFkFC/Ug3uDfu+1XMQv5z2ctx1eTzzAfVMtns47ROa2BSBTvOMsQIjfVVnTT8LhLSeqlzO6eY+8ZSFSnWDy6xF0gOvA1B087enJ1RSztUum6Wv7mVmaeOkWMDgauw/GjaQYYo1wu83vuZdNXLb7xRIvHcBQJH6Twd0pX5AKhlBM8dIB6NFoufu39grMp2RA0HV2lVdNSDf7VIuT6gPEiyORD7v/0sJIoRDsEC/dAiyyhUKwS3zRABRiCUK8uzIuPsFdkLXUbeRkpU+B1D/L1xLsFl9UC8h3OmyFeFsA5DIdtkq8bQA2gsDguwTU2TXn0/1BUX1A+p+t5xMgzixJiu2zRZVbCiCzJYjDJmuOqmx6Y5OveFunQLbVodBd3WbEbxmAVUuYHwajQRzZAXPflD+/ZMZmRRc1FM6nUw8nJ3fsn/sX1oCf7QHvUD7PymprqxOU1WmZ71EA1BkhdUjKeWlx5QMkElBOUDlB5QSVE1Rnha2aiNTD0uq4fKkXTJRkyYzJ4VDrcslMKRVNgcDEPL3wI6VoSgRb279sjiGSMaJszuXSGs42H/8sdJdW4SToRdlOdJ1p8ny1IuyMtUGlVDr7H03clXm56VHUAAAAAElFTkSuQmCC) no-repeat left top;
    background-size: 100% 100%;
  }

}
  footer{
    position: absolute;
    width: 100%;
    box-sizing:border-box;
    -moz-box-sizing:border-box; /* Firefox */
      -webkit-box-sizing:border-box; /* Safari */
    height: 86px;
    bottom: 0;
    .tipMes{
      height: 36px;
      line-height: 36px;
      padding-left: 15px;
      text-align: left;
      font-size: 14px;
      color: #F8A421;
      background:rgba(255,247,224,1);
    }
    .btns_div{
      display: flex;
      display: -webkit-flex; /* Safari */
      justify-content: space-between;
      padding: 0 15px;
      height: 50px;
      background: #fff;
      color:#A2A4A7;
      font-size: 16px;
      text-align: center;
      .btns{
        display: inline-block;
        margin-top: 5px;
        width: 45%;
        height: 40px;
        line-height: 40px;
        background: #F4F6F8;
        border-radius:4px;
      }
      .determine_btn{
        background: #5585F0;
        color: #fff;
      }


    }
  }
</style>

