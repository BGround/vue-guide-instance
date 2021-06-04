<template>
  <div class="wrap">
    <!--上拉刷新-->
    <re-fresh :load-finished="loadFinished"
             ref="refresh"
             @requestData="requestData"></re-fresh>

    <div class="content_wrap"
         v-if="sex"
        @touchstart="start($event)"
        @touchmove="move($event)"
        @touchend="end($event)">
      <!--选择内容-->
      <menu-tab-two v-if="isAdministrator" class="menu_tab" :selectdata="selectdata" @listenTabChange="tabChange"></menu-tab-two>
      <div v-else class="title_wrap">
        <span>{{sex == '1' ? '男卫生间':'女卫生间'}} </span>
      </div>
      <!--列表-->
      <div class="list_wrap" v-if="list.length > 0">
        <div v-for="(floorItem,key) in list" :key="key">
          <p class="list_floor">{{ floorItem.floor }}</p>
          <div class="list_item"
               v-for="(item, index) in floorItem.toiletSeatVOList"
               :key="index">
            <div class="item_info">
              <img class="item_icon" :src="sexIcon"/>
              <span>
                <span class="item_name">{{item.name}}</span>
                <span class="item_address">{{item.zone}}{{item.floor}} {{item.sex == '1' ? '男卫生间':'女卫生间'}}</span>
              </span>
          </div>
          <span class="item_btn" @click="clickBtn(item)" :class="statusClass(item.status)">
            {{statusText(item.status)}}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import reFresh from '../components/refresh';
  import menuTabTwo from '@/components/button/menu_tab_two';
  import {getUserInfo, getAllToiletList,toiletSeatList, updateToiletStatus} from '../api/getData';
  //1:无人使用/2:使用中/3:维修中/4:预约中（界面显示使用中）
  const STATUS = ['预约','使用中','维修中','使用中'];

  const PLACE = [
    {text: '广州总部'}
  ];

  const FLOOR = [
    {text: '一楼'},
    {text: '二楼'}
  ]

  const SEX = [
    {text: '男厕'},
    {text: '女厕'}
  ]

  export default {
    data(){
      return {
        pickData:[PLACE, FLOOR, SEX],        //底部选择数据
        indexList:[0,0,0],   //默认选择
        floor:FLOOR, // 楼层
        list: [], // 厕位列表
        sex: '', // 性别
        isAdministrator:false,
        selectdata:{
          index:0,
          nav:[
            {
              content: '男卫生间',
              data:{ //点击切换传递的数据
                sex: '1',
              },
            },
            {
              content: '女卫生间',
              data:{ //点击切换传递的数据
                sex: '2',
              },
            },
          ]
        },
        //下拉刷新使用参数
        oldClientY:0,
        markDistance:0,
        loadFinished:false,
      }
    },
    components:{
      reFresh,
      menuTabTwo,
    },
    computed:{
      sexIcon(){
        if (this.sex){
          return this.sex == '2' ? require('assets/svg/icon_toilet_female.svg')
            : require('assets/svg/icon_toilet_male.svg');
        }
        return '';
      }
    },
    mounted(){
      this.search();
    },
    methods:{
      // 获取所有厕位
      search(){
        var self = this;
        let params = {};
        if (self.sex){
          params['sex'] = self.sex;
        }
        getAllToiletList({},(data)=>{
          if(data.allToiletSeatInfo){
            self.list = data.allToiletSeatInfo;
            self.sex = data.allToiletSeatInfo[0].toiletSeatVOList[0].sex;
            self.isAdministrator = data.isAdministrator;
            if (self.isAdministrator){
              self.selectdata.index = self.sex - 1;
            }
          } else {
            self.list = [];
          }
          self.loadFinished = false;
        })
      },
      // 根据性别获取厕位
      searchBySex(){
        toiletSeatList({
          sex:this.sex,
        },(data)=>{
          if(data.toiletSeatList){
            this.list = data.toiletSeatList;
          }else {
            this.list = [];
          }
          this.loadFinished = false;
        })
      },
      tabChange(item){
        this.sex = item.data.sex;
        this.searchBySex();
      },
      // 点击按钮 状态:1:无人使用/2:使用中/3:维修中/4:预约中',
      clickBtn(item){
        const tips = ['该厕位正在使用中，请稍后再试','该厕位正在维护中','该厕位正在使用中，请稍后再试'];
        if(item.status == '1') {
          var btn={
              primaryBtn:{name:'预约', callBack:()=>{
                this.booking(item);
              }},
              defaultBtn:{name:"取消", callBack:null},
          };
          _.alert('预约厕位','提前预约该厕位，将为您保留1分钟', btn);
        } else {
          _.alert('提示', tips[parseInt(item.status)-2])
        }
      },
      // 预约
      booking(obj){
        var self = this;
        updateToiletStatus({
          toiletSeatId: obj.id
        },(data)=>{
            // 更新状态
            obj.status = 4;
        })
      },
      // 状态
      statusText(status){
        return STATUS[parseInt(status)-1];
      },
      statusClass(status){
        const staClass = ['not_use','is_use','is_repair','is_use'];
        return staClass[parseInt(status-1)];
      },
      // 下拉刷新
      requestData(){
        this.searchBySex()
      },
      //移动端事件
      start:function (e) {
        e = e || window.event;
        this.oldClientY = e.targetTouches[0].clientY //触碰时手指的位置
      },
      move:function (ev) {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        var self = this;
        var nowPosition = ev.changedTouches[0].clientY;
        var distance = nowPosition-self.oldClientY > 0 ? nowPosition-self.oldClientY:0;
        self.markDistance = distance;
        if(distance > 0 && scrollTop <= 0) { //向下滑动
          distance = distance > 100 ? 100 : distance;
          self.$el.querySelectorAll('.content_wrap')[0].style.paddingTop = distance.toString()+'px';
        }
      },
      end:function () {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(this.markDistance > 0 && scrollTop <= 0) {
          this.loadFinished = true;
          this.requestData();
        }
        this.$el.querySelectorAll('.content_wrap')[0].style.paddingTop = '0';
        this.markDistance = 0;
        this.oldClientY = 0;
      },
    }

  }
</script>

<style lang="scss" scoped>
.title_wrap {
  position: fixed;
  top: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  color: #0A1735;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  background: #fff;
  cursor: pointer;
  z-index: 1;
  &::after{
      content: '';
      position: absolute;
      left:0;
      bottom:0;
      width:100%;
      border: 1px solid #F7F8FA;
    }
  .icon_down {
    width: 16px;
    height: 16px;
  }
}
.list_wrap {
  margin-top: 50px;

  .list_floor {
    padding-left: 14px;
    line-height: 36px;
    font-size: 12px;
    color: #B2B9C8;
  }

  .list_item {
    position: relative;
    display: flex;
    margin: 0 14px 10px 14px;
    padding: 20px 10px;
    border-radius: 4px;
    background: #fff;
    justify-content: space-between;
    .item_info{
      display: flex;
      .item_icon {
        margin-right: 10px;
      }
      .item_name {
        font-size: 16px;
        font-weight: bold;
      }
      .item_address {
        display: block;
        font-size: 13px;
        color: #85868F;
      }
    }
    .item_btn {
      display: block;
      width: 72px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      text-align: center;
      border-radius: 4px;
      background: #85868F;
     &.not_use {
       color: #fff;
       background: #5585F0;
     }
     &.is_use {
       border:1px solid rgba(227,228,232,1);
       color: #0A1735;
       background: #F7F8FA;
     }
     &.is_repair{
       color: #0A1735;
       background: #E3E4E8;
     }
    }
  }
}
  .menu_tab {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
  }
  .menu_tab /deep/ {
    .vux-tab-item {
      font-size: 20px;
      font-weight: 600;
      line-height: 46px;
      color: #A2A4A7;

      &.vux-tab-selected {
        color: #0A1735;
      }
    }
    .vux-tab-bar-inner {
      width: 20% !important;
    }

  }
@media screen and (min-width:1024px) {
  .title_wrap, .menu_tab{
    width: 740px !important;
    margin: 0 auto;
  }
}
</style>
