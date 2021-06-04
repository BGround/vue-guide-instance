<template>
  <div  class="driver"
    :style="{height: driverHeight}"
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="false">
    <div class="qwui-nav_box_fixed">
      <search-box
        :searchinput="searchBar"
        placeholder="搜索"
        @listenToSearchBox="showMsgFromSearchBar">
      </search-box>
    </div>
    <div class="driver-list-wrapper">
      <driver-list 
        :driver="driver"
        @showDriverDetail="showDriverDetail"
        @getRadioValue="getRadioValue">
      </driver-list>
    </div>
    <load-more
      :busy="busy"
      :loading="loading"
      :showrecord="showrecord"
      :record-icon="recordIcon"
      :record-title="recordTitle"
      :record-text="recordText"
      @childevent="loadMore"
      :listCount="driver.length">
    </load-more>
    <button-group :fixed="true">
      <qwui-button type="default" text="返回" @buttonClick="close"></qwui-button>
      <qwui-button type="primary" text="确认" @buttonClick="confirm"></qwui-button>
    </button-group>
    <driver-detail v-if="showDetail" :driverId="driverId" @close="showDetail = false" @showMapDetail="showMapDetail"></driver-detail>
  </div>
</template>
<script>
import {ajaxGetUserListForDriver} from '../../api/getData'
import driverList from './driverList'
import { mixinTab } from '../../js/mixin'
import qwuiButton from '@/components/base/button/button'
import buttonGroup from '@/components/base/button/button_group'
import driverDetail from './driverDetail'
export default {
  name: 'driver',
  mixins:[mixinTab],
  components:{
    driverList,
    qwuiButton,
    buttonGroup,
    driverDetail
  },
  props:{
    showDrivers:{
      type: Boolean,
      default: false,
    }
  },
  data(){
    return {
      keyword: '',
      selectedItem: '',
      isSearch: false,
      driver: [],
      hasSelected: false,
      driverHeight: '',
      recordIcon: '',
      showDetail: false
    }
  },
  methods:{
    showMapDetail(address) {
      this.$emit('seeMap',address)
    },
    getRadioValue(item){
      this.selectedItem = item
    },
    showMsgFromSearchBar(keyWord){
      this.busy = true
      this.driver = []
      this.setting.page = 1
      this.setting.keyWord = keyWord
      this.isSearch = false
      this.initList()
    },
    initList(isLoadMore){
      var _this = this,
          setting = JSON.parse(JSON.stringify(this.setting)),
          searchValue = this.isSearch ? this.searchValue : setting
      if(this.isSearch) {
        searchValue = Object.assign(searchValue, setting)
      }
      if(!isLoadMore) {
        _.showLoading()
      }
      ajaxGetUserListForDriver(searchValue,(res)=>{
        _this.setDriverList( res, isLoadMore)
        }
      )
    },
    confirmBtn(){
      if(this.selectedItem) {
          this.$store.commit('updateCarDetail', { driverName: this.selectedItem.personName ,driverMobile: this.selectedItem.mobile,driverId:this.selectedItem.userId})
          this.close()
      } else {
        _.tooltips_succeed('请选择司机', true, '', 1500)
      }
    },
    setDriverList(res,isLoadMore){
      // 设置列表数据
      this.loading = false
      _.hideLoading()
      if(res.code != "0") {
        return _.alert('提示', res.desc)
      }
      this.busy = res.data.maxPage == 0 || this.setting.page == res.data.maxPage
      this.driver = isLoadMore && this.driver.length > 0 ? this.driver.concat(res.data.pageData?res.data.pageData:[]) : res.data.pageData?res.data.pageData:[];
      if(this.driver.length == 0) {
        this.showrecord = true
        this.driverHeight = $(window).height() + 'px'
      } else {
        this.showrecord = false
        this.driverHeight = ''
      }
    },
    confirm() {
      let _this = this
      if(!this.selectedItem.hasUsed){
        this.confirmBtn()
      }else{
        let btnConfig = {
          primaryBtn: {
            name: '确认',
            callBack: function() {
              _this.confirmBtn()
            }
          },
          defaultBtn: {
            name: '取消',
            callBack: null
          }, //主操作按钮
        }
        if(this.selectedItem.hasUsed) {
          _.alert('确定继续分派吗？','司机在用车时间内已被分派',btnConfig);
        }
      }
    },
    showDriverDetail(item) {
      this.showDetail = item.show
      this.driverId = item.driverId
    },
    close() {
      this.$emit('closeDrivers')
    },
  },
  mounted(){
    document.body.style.overflow = "auto"
    this.searchBar.rightSpan.show = false
    this.initList()
  },
  watch: {
    'setting.keyWord': {
      handler(val) {
        this.recordTitle = '找不到相关记录'
        this.recordText = '请联系管理员添加'
        this.recordIcon = 'qwui-no_treat_record'
      },
      deep: true
    },
  },
  destroyed() {
    document.body.style.overflow = "hidden"
  }
}
</script>
<style scoped>
  @media screen and (min-width: 1024px) {
    .driver{width: 740px;}
  }
  .driver{
    margin-bottom: 60px;
    background: #FFFFFF;
    border-top:1px solid #F6F7FB;
  }
  .driver-list-wrapper {
    padding-top: 43px;
  }
  .qwui-nav_box_fixed{
    position: fixed;
    top: 0;
    left: 50%;
    transform: translate(-50%,0);
    z-index: 9;
    width: 100%;
  }
  .driver >>> .qwui-btn_box.active::before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
  }
</style>

