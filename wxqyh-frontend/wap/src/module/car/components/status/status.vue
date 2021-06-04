<template>
  <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="false">
    <div v-if="permitted || isSendCar">
      <div class="qwui-nav_box_fixed">
        <search-box
          :keyWord="keyWord"
          :placeholder="placeholder"
          :searchinput="searchinput"
          @listenToSearchBox="showMsgFromSearchBar"
        ></search-box>
      </div>
      <status-list
        :list="list"
        :isSendCar="isSendCar"
        @selectCar="takeCar"
        @openCarDetail="openCarDetail"
        @close="close">
      </status-list>
      <load-more
        :class="{'load-more':isSendCar}"
        :busy="busy"
        :loading="loading"
        :showrecord="showrecord"
        :record-icon="setting.keyWord&&setting.keyWord.length>0?'qwui-no_treat_record':recordIcon"
        :record-text="setting.keyWord&&setting.keyWord.length>0?(isSendCar?'请联系管理员添加':''):'请通过管理后台创建车辆信息'"
        :record-title="setting.keyWord&&setting.keyWord.length>0?'找不到相关记录':'暂无车辆'"
        @childevent="loadMore"
        :listCount="list.length"></load-more>
    </div>
    <div class="qwui-no-record" v-else>
      <no-record :hasrecord="hasrecord" show="true"></no-record>
    </div>
    <bottom-button v-if="isSendCar" @close="close"></bottom-button>
    <car-detail
    v-if="showCarDetail"
    :carInfo="carInfo"
    :carIdx="carIdx"
    @closeCarDetail="showCarDetail = false"
    @closeStatus="close"
    @seeMapDetail="seeMapDetail"
    @openMapDetail="openMapDetail">
    </car-detail>
    <map-search v-if="openMap" :mapStatus="'showMap'" @close="openMap=false" :sendAddress="sendAddress"
    ></map-search>
  </div>
</template>

<script>
  import statusList from './statusList'
  import noRecord from '../base/no_record'
  import bottomButton from '../base/bottomButton'
  import carDetail from './carDetail'
  import { initState } from '../../api/getData'
  import { mixinTab } from '../../js/mixin'
  import mapSearch from '../mapSearch/mapSearch'
  export default {
    name: 'status',
    mixins:[mixinTab],
    components: {
      statusList,
      noRecord,
      bottomButton,
      carDetail,
      mapSearch
    },
    props:{
      isSendCar:{
        type: Boolean,
        default: false
      },
      unPassList:{
        type: Boolean,
        default: false
      },
    },
    data(){
      return {
        carIdx: '',
        selectedItem: '',
        keyWord:'',
        searchinput:{ //头部搜索框
          show: true,
          keyWord: '',
          rightSpan:{
            show: false,
            callback: null
          },
          moreFunction: {
            show: true,
            option: [
              {
                name: '全部',
                value: 'All',
                placeholder: '搜索'
              },
              {
                name: '未预订',
                value: 'NotReserved'
              },
              {
                name: '已预订',
                value: 'Reserved'
              },
            ]
          },
        },
        placeholder:'搜索',
        list: [],
        recordIcon: 'qwui-no_status_record',
        hasrecord: { //权限配置
          icon: 'qwui-icon_permission',
          title: '暂无权限',
          text: '没有权限查看车辆状态，请联系管理员',
          setTop: true
        },
        permitted: true,
        showCarDetail: false,
        carInfo: {},
        openMap: false,
        sendAddress: ''
      }
    },
    created(){
      document.body.style.overflow = "auto"
      if(this.isSendCar) {
        this.setting = {
          page: 1,
          validPermit: 'no'
        }
      } else {
        this.setting = {
          page: 1,
          needCheckManagerPermite: 'no'
        }
      }
      this.initList()
    },
    methods: {
      initList(isLoadMore) {
        var _this = this,
          setting = JSON.parse(JSON.stringify(this.setting)),
          searchValue = this.isSearch ? this.searchValue : setting

        if(this.isSearch) {
          searchValue = Object.assign(searchValue, setting)
        } else if(!isLoadMore) {
          _.showLoading()
        }
        initState(searchValue).then((res) => {
          res.data.config && res.data.config.permited == "no" ? _this.permitted = false : _this.permitted = true //权限控制
          _this.setStatusList(res, isLoadMore)
        })
      },
      showMsgFromSearchBar(keyWord, value){
        switch (value) {
          case 'All':
            this.setting.carStatus = ''
            break
          case 'Reserved':
            this.setting.carStatus = 1
            break
          case 'NotReserved':
            this.setting.carStatus = 0
            break
        }
        this.busy = true
        this.list = []
        this.setting.page = 1
        this.setting.keyWord = keyWord
        this.isSearch = false
        this.cacheSearchValue = {}
        this.initList()
      },
      setStatusList(res, isLoadMore){
        this.loading = false
        _.hideLoading()
        if(res.code != "0") {
          return _.alert('提示', res.desc)
        }
        this.busy = res.data.maxPage == 0 || this.setting.page == res.data.maxPage
        if(res.data.pageData && res.data.pageData){
          var pageData =  res.data.pageData
          var len = pageData.length
          for(var i=0; i<len; i++){
            pageData[i].progress=this.computedProgress(pageData[i].carAsks)
          }
        }
        this.list = isLoadMore && this.list.length > 0 ? this.list.concat(res.data.pageData?res.data.pageData:[]) : res.data.pageData?res.data.pageData:[];
        this.list.length == 0 ? this.showrecord = true : this.showrecord = false;
      },
      computedProgress(carAsks){
        var length = carAsks.length
        var progress = []
        for(var i=0; i<length; i++){
          var currentTime,sevenDayTime,takeTime,backTime,start,end,left,width,obj={},progressWidth
          progressWidth = document.body.clientWidth - 30
          currentTime = new Date().getTime()
          sevenDayTime = currentTime + 1000*60*60*24*7
          takeTime = new Date(carAsks[i].takeTime).getTime()
          backTime = new Date(carAsks[i].backTime).getTime()
          start = takeTime-currentTime>0 ? takeTime: currentTime;
          end = backTime - sevenDayTime >0 ? sevenDayTime: backTime;
          left = takeTime-currentTime>0?(takeTime-currentTime)/(sevenDayTime-currentTime)*progressWidth + 'px':0 + 'px';
          width = (end-start)/(sevenDayTime-currentTime)*progressWidth + 'px';
          obj.left = left
          obj.width = width
          progress.push(obj)
        }
        return progress;
      },
      close() {
        this.$emit('closeStatus',false)
      },
      takeCar(item) {
        this.$emit('selectCar', item)
        this.selectedItem=item
      },
      openCarDetail(item) {
        this.showCarDetail = true
        this.carInfo = item,
        this.carIdx = item.carIdx
      },
      seeMapDetail(address){
        this.$emit('seeMap',address)
      },
      openMapDetail(address){
        this.openMap = true,
        this.sendAddress = address
      }
    },
    destroyed() {
      if(this.isSendCar) document.body.style.overflow = "hidden"
    }
  }
</script>

<style scoped>
  .qwui-nav_box_fixed {
    position: fixed;
    width: 100%;
    z-index: 9;
  }
  .qwui-statusList{
    padding-top: 44px;
  }
  .qwui-no-record {
    position: fixed;
    z-index: 9;
    width: 100%;
  }
  .load-more {
    margin-bottom: 49px;
  }
@media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
  .cancel-btn{
    padding-bottom: 34px;
  }
}
</style>
