<template>
  <div class="map-wrap" :class="mapStatus==='showMap'?'map-wrap-watch':''" v-if="mapStatus!=='getLocation'">
    <!--腾讯地图搜索-->
		<div class="tencent-map1" v-show="mapStatus==='mapSearch'" >
			<div class="map-control" >
				<div class="map-search-div" v-show="mapStatus=='mapSearch'">
          <form action="" @submit.prevent="searchKeyword">
            <input ref="place" type="search"  class="map-search-input" @focus="focused=true" @blur="focused=false"
            v-model="address" @input ="showMsgFromSearchBar" :placeholder="focused?'':'搜索关键词'" @keyup.enter="searchKeyword">
          </form>
          <i  @click="searchKeyword" :class="(address||focused)?'icon_search' : 'icon_search_blur'" ></i>
          <i class="dele-all" @click="address=''" v-show="address"></i>
          <span  class="cancel-search" @click="cancel" >取消</span>
				</div>
			</div>
		</div>
    <div class="show-map" v-show="isShow" :class="mapStatus==='showMap'?'map-wrap-watch':''">
      <div id="my-map"></div>
    </div>
    <div class="pois" v-show="isShow && pois && mapStatus=='mapSearch'">
      <li v-for="(poi,index) in pois" :key="index" class="show-address" @click="sendPosition(poi,pois)" >
            <div class="history-item">
              <p class="keyword-info">
                <span class="item_info">{{ poi.name || poi.title}}</span>
              </p>
              <p class="detail-address">{{ poi.address }}</p>
            </div>
            <i class="icon_place" :style="'background:url('+imgUrlList1[index]+');background-size:20px 20px'"></i>
      </li>
    </div>
    <!-- 列表内容区域 -->
    <div class="content-box" v-show="mapStatus==='mapSearch'">
      <ul class="history-list" >
        <li v-show="!isShow" class="show-address" @click="getLocation">
          <div class="history-item">
            <div class="keyword-info" >
              <span class="list_place"></span>
              <span class="item_info">{{ defaultInfo }}</span>
            </div>
          </div>
        </li>
        <div v-if="!address&&!isShow" class="history">
          <li v-for="(historyItem,index) in historyAddress" :key="index" class="show-address" @click="address=historyItem.keyword,showMsgFromSearchBar(address)">
            <div class="history-item">
              <p class="keyword-info">
                <span class="item_info">{{ historyItem.keyword }}</span>
              </p>
              <p class="detail-address">{{ historyItem.address }}</p>
            </div>
            <i class="list_place"></i>
          </li>
        </div>
        <div v-show="!isShow && suggestList" :class="{'sugguest': suggestList && suggestList.length>0}" >
          <li v-for="(item,index) in suggestList" :key="index" class="show-address"  @keyup.enter="searchKeyword" @click="sendPosition(item,suggestList)">
            <div class="history-item">
              <p class="keyword-info">
                <span class="item_info">{{ item.title?item.title:item.address}}</span>
              </p>
              <p class="detail-address">{{ (item.city?item.city.replace("市",'-'):'') + (item.district ? item.district : item.address) }}</p>
            </div>
            <i class="list_place"></i>
          </li>
        </div>
      </ul>
      <div class="empty_list" v-show="historyAddress && historyAddress.length>0 && !address && !isShow" @click="deleHistoryList">
        <i class="dele"></i>
        <span class="dele_msg">{{ deleMsg }}</span>
      </div>
    </div>
    <bottom-button @close="close" v-show="mapStatus==='showMap'"></bottom-button>
    <div class="fix-background"></div>
  </div>
</template>

<script>
import imgUrl_0 from '@/assets/images/car/icon_a-newtask-list_place20.png'
import imgUrl_1 from '@/assets/images/car/icon_a-newtask-list_place21.png'
import imgUrl_2 from '@/assets/images/car/icon_a-newtask-list_place22.png'
import imgUrl_3 from '@/assets/images/car/icon_a-newtask-list_place23.png'
import imgUrl_4 from '@/assets/images/car/icon_a-newtask-list_place24.png'
import imgUrl_10 from '@/assets/images/car/icon_a-newtask-list_place10.png'
import imgUrl_11 from '@/assets/images/car/icon_a-newtask-list_place11.png'
import imgUrl_12 from '@/assets/images/car/icon_a-newtask-list_place12.png'
import imgUrl_13 from '@/assets/images/car/icon_a-newtask-list_place13.png'
import imgUrl_14 from '@/assets/images/car/icon_a-newtask-list_place14.png'
import { mapState } from 'vuex'
import bottomButton from '../base/bottomButton'
import wx from 'weixin-js-sdk'
export default {
  name : "mapSearch",
  data(){
    return {
      imgUrlList: [imgUrl_0,imgUrl_1,imgUrl_2,imgUrl_3,imgUrl_4],
      imgUrlList1: [imgUrl_10,imgUrl_11,imgUrl_12,imgUrl_13,imgUrl_14],
      pois:[],
      defaultInfo: '我的位置',
      userAuthorization: '',
      firstInto: true,
      myAddress: '',
      deleMsg:'清空搜索列表',
      address:'',
      isEmpty: false,
      isShow: false,
      searchRegion:{},
      historyAddress:[],
      suggestList:[],
      addressData:{},
      searchBefore:true,
      isSearching: false,
      timer: null,// 声明计时器
      markers: [],
      searchService:'',
      focused: false
    }
  },
  props:{
    openMap:{
      type: Boolean,
      default: false
    },
    mapStatus:{
      type: String,
      default: ''
    },
    isBegin:{
      default: undefined
    },
    location:{
      type:Object
    },
    sendAddress:{
      type: String,
      default: ''
    }
  },
  components:{
    bottomButton
  },
  computed:{
    ...mapState({
      clickTarget: state => state.mapStatus.clickTarget,
      detail: state => state.detail.detailData.detail,
      fromPath: state => state.mapStatus.fromPath
    })
  },
  methods: {
    close() {
      this.$emit('close')
    },
    cancel(){
      this.address = ''
      this.suggestList = []
      this.isShow = false
      this.$emit('close')
    },
    //检查历史查询
    checkHistory(){
      if(localStorage.historyAddress){
        this.historyAddress = JSON.parse(localStorage.historyAddress)
      }
    },
    //记录输入
    recordHistory(data){
      if(!this.has()){
        if(data && data[0]){
          let searchItem = {
              keyword : this.address,
              type: 'history',
              detailAddress: data[0].city + data[0].district + data[0].title,
              address :((data[0].city ? data[0].city.replace("市",'-'):'') + (data[0].district ? data[0].district : data[0].address)),
              lat:  data[0].location.lat,
              lng:  data[0].location.lng,
          }
          this.historyAddress.unshift(searchItem)
      }else{
        let searchItem = {
              keyword : this.address,
              type: 'history',
              detailAddress: this.address,
              address : '',
              lat:  '',
              lng:  '',
        }
        this.historyAddress.unshift(searchItem)
      }
    }
      localStorage.setItem('historyAddress' , JSON.stringify(this.historyAddress))
    },
    has() {
      let len = this.historyAddress.length || 0
      if(len>0){
        for(var i = 0;i<len;i++){//判断是否多次重复搜索
          if(this.address === this.historyAddress[i].keyword){
            //调整显示位置
            return true
          }
        }
      }
    },
    //删除历史
    deleHistoryList(){
      this.historyAddress = []
      localStorage.removeItem('historyAddress')
    },
    clearOverlays(overlays) {
      var overlay
      while (overlay = overlays.pop()) {
          overlay.setMap(null)
      }
    },
    //点击我的位置时带入

    searchKeyword(event) {
      this.$refs.place.blur()
      this.focused = false
      if( this.address && this.address.length>0 ){
        event.preventDefault();
        this.isShow = true
        var keyword = this.address
        this.clearOverlays(this.markers)
        this.pois = []
        //根据输入的关键字在范围内检索
        if(this.suggestList && this.suggestList[0]){
          this.initMap(this.suggestList[0].location.lat,this.suggestList[0].location.lng)
          this.recordHistory(this.suggestList)
        }
      }
    },
    //初始化地图 initMap-----start
    initMap(lat,lng){
      var _this = this
      this.isShow = true
      var center = new qq.maps.LatLng(lat, lng)
      var mapHeight = $('.show-map').height()
      $('#my-map').css({'height':mapHeight+ 'px',overflow:'hidden'})
      var map = new qq.maps.Map(document.getElementById('my-map'),{
        disableDefaultUI: true,
        draggable: true,
        center: center,
        zoom: 14,
        scrollwheel: true,
      });
      //将我的位置放入地图size
      if(this.myAddress){
        var size = new qq.maps.Size(20, 20)
        var myPosition = new qq.maps.Marker ({
        position: new qq.maps.LatLng(this.myAddress.lat, this.myAddress.lng),
        map: map,
        // icon: new qq.maps.MarkerImage(_this.imgUrlList[0])
        });
        this.markers.push(myPosition)
      }
      //定义坐标图标
      if(this.mapStatus === 'showMap'){//查看地图图标设置
        if(this.pois && this.pois.length <= 0) {
          var size = new qq.maps.Size(21, 20)
          var centerMarker = new qq.maps.Marker ({
          position: new qq.maps.LatLng(lat, lng),
          map: map,
            icon: new qq.maps.MarkerImage(_this.imgUrlList[0])
          });
          this.markers.push(centerMarker)
        }
      }
      //定义poi周边检索
      var size = new qq.maps.Size(21, 20)
      var scaleSize = new qq.maps.Size(21, 20)
      // var origin = new qq.maps.Point(0,0)
      _this.searchService = new qq.maps.SearchService({
        location: '',
        pageIndex:1,
        pageCapacity: 5,
        complete: function(res){
          var searchMapHeight = $('.show-map').height()
          $('#my-map').css({'height':searchMapHeight+ 'px',overflow: 'hidden'})
          var latlngBounds = new qq.maps.LatLngBounds();
          if(res.detail.pois){
            var pois = res.detail.pois
            _this.pois = pois
            var infoWin = new qq.maps.InfoWindow({
              map: map,
            })
            //自定义标记图标
            for (var i = 0, l = pois.length-1; i < l; i++) {
              var poi = pois[i];
              latlngBounds.extend(poi.latLng);
              (function(n) {
                var marker = new qq.maps.Marker({
                  map: map,
                });
                var markerIcon = new qq.maps.MarkerImage(_this.imgUrlList[i+1],scaleSize,);
                marker.setIcon(markerIcon);
                marker.setPosition(pois[n].latLng);
                marker.setTitle(i + 1);
                _this.markers.push(marker);
              })(i);
            }
            if(_this.suggestList.length>0){
              var region = map.center = new qq.maps.LatLng(_this.suggestList[0].location.lat, _this.suggestList[0].location.lng)
                var marker = new qq.maps.Marker({
                  map: map,
                });
              var markerIcon = new qq.maps.MarkerImage(_this.imgUrlList[0],size);
              marker.setIcon(markerIcon);
              marker.setPosition(map.center);
              _this.markers.push(marker)
              map.panTo(region)
            }
          }
          var isture = _this.suggestList && _this.suggestList[0]
          latlngBounds.extend(map.center)
          map.fitBounds(latlngBounds)
          _.hideLoading()
          var searchMapHeight = $('.show-map').height()
          $('#my-map').css({'height':searchMapHeight+ 'px',overflow: 'hidden'})
          var tencentLogo = $('.csssprite')
          for(var j=0; j<tencentLogo.length;j++){
            if(tencentLogo[j].src === 'https://wecar.myapp.com/myapp/mapwecar/tencent_color_logo.png'){
              tencentLogo[j].parentNode.style.height = '0'
            }
          }
        },
        error: function(){
          //如果有即时搜索记录但是无相关地点，将显示第一个搜索结果
          if(_this.suggestList && _this.suggestList[0]){
          _this.pois.push(_this.suggestList[0])
          var latlngBounds = new qq.maps.LatLngBounds();
            var marker = new qq.maps.Marker({
              map:map,
            })
            if(_this.suggestList.length>=0){
              var region = map.center = new qq.maps.LatLng(_this.suggestList[0].location.lat, _this.suggestList[0].location.lng)
                var marker = new qq.maps.Marker({
                  map: map,
                });
              var markerIcon = new qq.maps.MarkerImage(_this.imgUrlList[0],size);
              marker.setIcon(markerIcon);
              marker.setPosition(map.center);
              _this.markers.push(marker)
              map.panTo(region)
            }
            var isture = _this.suggestList && _this.suggestList[0]
            latlngBounds.extend(map.center)
            map.fitBounds(latlngBounds)
            //去除logo
            var tencentLogo = $('.csssprite')
            for(var j=0; j<tencentLogo.length;j++){
              if(tencentLogo[j].src === 'https://wecar.myapp.com/myapp/mapwecar/tencent_color_logo.png'){
                tencentLogo[j].parentNode.style.height = '0'
              }
            }
            var searchMapHeight = $('.show-map').height()
            $('#my-map').css({'height':searchMapHeight+ 'px',overflow: 'hidden'})
          }else{
            _.alert("提示", '无法搜索到相关地址')
          }
        }
      })
      if(this.isShow && this.mapStatus =='mapSearch'){
        let keyword = this.address
        if(this.suggestList && this.suggestList[0]){
          var region = new qq.maps.LatLng(this.suggestList[0].location.lat,this.suggestList[0].location.lng);
          for(var i = 0;i <= 1;i++){
            setTimeout(function() {
              _this.searchService.searchNearBy(keyword, region, 1000);
            }, 1000);
          }
        }else{
            _this.searchService.search(keyword);
          }
          this.recordHistory(this.suggestList)
      }

  },
  //点击poi和检索结果返回详情页
    sendPosition(item) {
      this.$store.commit('updateFromPath',this.$route.name)
      let address = item.title?( (item.city?item.city:'') + (item.district?item.district:'') + (item.title?item.title:'') ) : item.name
      let lat = item.latLng?item.latLng.lat:item.location.lat
      let lng = item.latLng?item.latLng.lng:item.location.lng
      if(this.clickTarget==0){
        this.$store.commit('updateLocation',{
          beginLocation: address,
          beginLatitude: lat,
          beginLongitude: lng,
        })
        this.$store.commit('updateBasicValue',{
          beginLocation: address,
          beginLatitude: lat,
          beginLongitude: lng,
        })
      }else if(this.clickTarget==1){
        this.$store.commit('updateLocation',{
          destinationLocation: address,
          destinationLatitude: lat,
          destinationLongitude: lng
        })
        this.$store.commit('updateBasicValue',{
          destinationLocation: address,
          destinationLatitude: lat,
          destinationLongitude: lng
        })
      }
      this.$emit('close')
    },
    //initMap-----end
    //关键词搜索
    showMsgFromSearchBar(event) {
      var _this = this
      this.isSearching = true
      this.isShow = false
      if(this.timer){
        clearTimeout(this.timer)
      }
      if(this.address && this.address.length>0){
        var url = 'https://apis.map.qq.com/ws/place/v1/suggestion/'
        this.timer = setTimeout(function(){
          _.jsonp(url,{
            region : '',
            keyword : _this.address,
            key: 'GDYBZ-6QPEF-ZY5JM-NLGQH-ZVLZE-YDBFB',
            output: 'jsonp',
          }
        ).then(function(res){
          _this.suggestList = res.status === 0 && res.data.length >= 10 ? res.data.slice(0 , 10) : res.data
          if(!_this.address) {_this.isSearching = false}
        })
        },1000)
      }else{
        _this.suggestList = []
      }
    },
    getLocation() {//weixin-js-sdk授权获取当前定位位置  (我的位置)
      var _this = this
      this.myAddress = ''
      if (_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()) {
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function (res) {
            if(_this.openMap){
              _.showLoading('正在获取定位,请稍候...')
            }
            _this.userAuthorization = true//授权成功
            localStorage.setItem('userAuthorization','true')
            var latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude  // 经度，浮点数，范围为180 ~ -180。
            var latLng = new qq.maps.LatLng(latitude,longitude)
            qq.maps.convertor.translate(latLng, 1, function(result) {//转换GPS坐标
              _this.getAddress (result[0]).then (res => {
                _this.renderAddress (res);
                _.hideLoading()
                //获取成功返回到详情页
                if(_this.mapStatus == 'mapSearch'){
                  let address = _this.addressData.value
                  let lat = _this.addressData.latitude
                  let lng = _this.addressData.longitude
                  if(_this.clickTarget==0){
                    _this.$store.commit('updateLocation',{
                      beginLocation: address,
                      beginLatitude: lat,
                      beginLongitude: lng,
                    })
                    _this.$store.commit('updateBasicValue',{
                      beginLocation: address,
                      beginLatitude: lat,
                      beginLongitude: lng,
                    })
                  }else if(_this.clickTarget==1){
                    _this.$store.commit('updateLocation',{
                      destinationLocation: address,
                      destinationLatitude: lat,
                      destinationLongitude: lng
                    })
                  _this.$store.commit('updateBasicValue',{
                    destinationLocation: address,
                    destinationLatitude: lat,
                    destinationLongitude: lng
                  })
                  }
                  _.hideLoading()
                  _this.$emit('close')
                }
              })
            })
          },
          cancle: function(res){
            _.hideLoading()
            if(localStorage.userAuthorization!="undefined"){
              localStorage.removeItem('userAuthorization')
            }
            if(_this.openMap){
               _.alert('提示',"用户拒绝地理位置授权")
            }
          },
          fail: function(err){
            _.hideLoading()
            localStorage.setItem('userAuthorization','false')
            if(_this.openMap){
              _.alert('提示',"获取定位失败")
            }
          }
      });
    }
  },
    //根据经纬度获取地址  //根据地址获取经纬度
    getAddress(latLngOrAddress) {
      var _this = this;
      var data = {};
      return new Promise (function(resolve){
        //调用地址解析类
        var geocoder = new qq.maps.Geocoder({
          complete : function(result) {
            // _this.isShow = true
            data.value = _this.formatAddress(result.detail.addressComponents);
            data.latitude = result.detail.location.lat;
            data.longitude = result.detail.location.lng;
            _this.address = data.value;
            _this.searchRegion = new qq.maps.LatLng(data.latitude,data.longitude);
            _this.myAddress = data
            resolve(data);
          },
          error: function(error) {
            resolve('false')
          }
        });
        typeof latLngOrAddress ==='string' ? geocoder.getLocation(latLngOrAddress) : geocoder.getAddress(latLngOrAddress);
      })
    },
    //地址格式化
    formatAddress(data){
      var address =data.city+ data.district;
          address += data.streetNumber?data.streetNumber:data.street;
          return address;
    },
    renderAddress(data,value){
      this.addressData = data?data:{
        value:value,
        latitude:null,
        longitude:null,
      };
    },

  },
  created () {
    this.checkHistory()
  },
  mounted(){
    let _this = this
    document.body.style.overflow = 'hidden'
    //获取存取的授权信息
    this.userAuthorization = localStorage.userAuthorization
    //查看地图
    if(_this.sendAddress && _this.mapStatus=="showMap"){//详情页查看有经纬度的地址
      if( typeof(_this.isBegin) != 'undefined' ){//根据经纬度查看开始/结束地图
        if(_this.isBegin && _this.detail.realBeginLatitude && _this.detail.realBeginLongitude ){
          _this.initMap(_this.detail.realBeginLatitude*1, _this.detail.realBeginLongitude*1,  )
        }else if(!_this.isBegin && _this.detail.realDestinationLatitude && _this.detail.realDestinationLongitude ){
          _this.initMap(  _this.detail.realDestinationLatitude*1 ,_this.detail.realDestinationLongitude*1 )
        }else{
          _this.$emit('close')
          _.alert("提示",'无法查看该地址，请检查地址是否正确')
        }
      }else{//无经纬度解析地址
        _this.address = _this.sendAddress
        _this.showMsgFromSearchBar(_this.address)
        if(_this.address && _this.address.length>0){
          _this.getAddress(_this.address).then (res => {
            if(typeof(res) === 'string'){
              _this.$emit('close')
              _.alert('提示', '无法查看该地址，请检查地址是否正确')
            }else{
              _this.renderAddress (res);
              if(res.value && res.latitude && res.longitude){
                _this.initMap (res.latitude, res.longitude)
              }
            }
          })
        }
      }
    }else if(_this.mapStatus=="mapSearch"){//带入地址搜索
      if(_this.$route.path=='/add'){
        if(_this.clickTarget==0){
          _this.address = _this.location.beginLocation
        }else if(_this.clickTarget==1){
          _this.address= _this.location.destinationLocation
        }
      }else{
        this.address = this.sendAddress
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('updateFromPath','map')
    this.pois = []
    this.suggestList = []
    this.markers = []
    next()
  },
  watch:{
    address:function(val){
      if(val && val.length>0){
        this.showMsgFromSearchBar(val)
      }
    },
    isShow(val){
      if(val===true){
        document.body.style.overflow="hidden"
      }else{
        if(!this.openMap){
          document.body.style.overflow="auto"
        }
      }
    }
  },
  beforeDestroy() {
    document.body.style.overflow = 'auto'
  }
}
</script>

<style scoped>
  @media screen and (min-width: 1024px) {
    .map-wrap, .map-search-div, .fix-background {
      width: 740px;
    }
  }
  * {
    margin: 0;
    padding: 0;
  }
  .map-wrap{
    position: fixed;
    display:-webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient:vertical;
    -webkit-box-direction:normal;
    -moz-box-orient:vertical;
    -moz-box-direction:normal;
    -webkit-flex-direction:column;
    flex-direction: column;
    padding-top:52px;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    z-index:11;
    background: #FFFFFF;
    overflow: auto;
  }
  .map-wrap-watch{
    margin-top: -52px;
    position: fixed;
    padding-top: 0;
    height: 100%;
  }
  .show-map{
    -webkit-box-flex: 1;   /* OLD - iOS 6-, Safari 3.1-6 */
    -moz-box-flex: 1;     /* OLD - Firefox 19- */
    -webkit-flex: 1;      /* Chrome */
    -ms-flex: 1 ;          /* IE 10 */
    flex: 1;              /* NEW, Spec - Opera 12.1, Firefox 20+ */
    position: relative;
    min-height: 250px;
    overflow: auto;
  }
  .show-map #my-map{
    width: 100%;
  }
.icon_search, .icon_search_blur{
    position: absolute;
    display: block;
    width: 14px;
    height: 14px;
    padding: 11px 0 11px 8px;
    box-sizing: content-box;
    cursor: pointer;
    background: url(~assets/images/car/ic_search.png) right center no-repeat;
    background-size: 14px 14px;
    top: 8px;
  }
  .icon_search{
    left: 1em;
  }
  .dele-all{
    position: absolute;
    display: block;
    width: 14px;
    height: 14px;
    padding-right: 8px;
    box-sizing: content-box;
    cursor: pointer;
    background: url(~assets/images/car/ic_del.png) left no-repeat;
    background-size: 14px 14px;
    top: 19px;
    vertical-align: middle;
    right: 4.5em;
  }
  .icon_search_blur{
    left: 50%;
    margin-left: -6.5em;
  }
  .cancel-search{
    display: inline-block;
    font-size: 14px;
    line-height: 36px;
    color: #7A7C80;
    padding-left:14px;
    cursor: pointer;
  }
  .map-wrap{
    padding-top: 52px;
    background-color: #ffffff;
  }
  .history-list{
    padding-left: 14px;
  }
  .history-item{
    padding-bottom: 10px;
    border-bottom: 1px solid #F6F7FB;
  }
  .show-address{
    padding: 10px 0 0 24px;
    position: relative;
    cursor: pointer;
  }
  .show-address_map{
    height: 64px;
    margin-left: 14px;
    position: relative;
  }
  .keyword-info{
    color: #0A1735;
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 4px;
  }
  .detail-address{
    color: #85888C;
    font-size: 12px;
    line-height: 17px;
  }
  .cancle{
    position: absolute;
    height: 52px;
    line-height: 52px;
    width: 56px;
    top:0;
    right:0;
    color: #F4F6F8;
    font-size: 14px;
  }
  .list_place{
    position: absolute;
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 22px;
    color: #0A1735;
    background: url(~assets/images/car/icon_a-newtask-list_place2.png) no-repeat;
    background-size: 16px 16px;
    margin-right: 3px;
    top: 13px;
    left:0;
  }
  .icon_place{
    position: absolute;
    display: block;
    width: 20px;
    height: 20px;
    line-height: 22px;
    color: #0A1735;
    margin-right: 3px;
    top:13px;
    left:0;
    background-size:20px 20px
  }
  .map-search-div{
    box-sizing: border-box;
    display: flex;
    display:-webkit-box;
    display:-webkit-flex;
    position: fixed;
    padding: 8px 14px;
    height: 52px;
    top:  0;
    right: 0;
    left: 0;
    margin: 0 auto;
    z-index: 9;
    background-color: #ffffff;
  }
  .map-search-blur{
    left:50%;
    transform: translate(-50%,0);
    text-indent: -1em;
  }
  form{
    position: relative;
    flex: 1;
  }
  .map-search-input{
    width: 100%;
    text-indent: 1em;
    left: 36px;
    height: 36px;
    line-height: 14px;
    padding: 11px 21px 11px 14px;
    font-size: 13px;
    color: #0A1735;
    border-radius: 4px;
    background-color: #F4F6F8;
  }
  .cancle-search{
    line-height: 36px;
    color: #7A7C80;
    font-size: 14px;
  }
  ::-webkit-input-placeholder {
    font-size: 14px;
    text-align: center;
  }
  :-moz-placeholder {
    font-size: 14px;
    text-align: center;
  }
  ::-moz-placeholder{
    font-size: 14px;
    text-align: center;
  }
  :-ms-input-placeholder{
    font-size: 14px;
    text-align: center;
  }
  .empty_list{
    padding: 11px;
    height: 22px;
    text-align: center;
    line-height: 22px;
  }
  .dele{
    display: inline-block;
    vertical-align: middle;
    width: 22px;
    height: 22px;
    line-height: 22px;
    background: url(~assets/images/car/dele_history.png) no-repeat center;
    background-size: cover;
  }
  .dele_msg{
    vertical-align: middle;
    font-size: 14px;
    line-height: 20px;
    color: #B2B9C8;
  }
  .csssprite{
    width: 99px;
    height: 99px;
    display: none;
    z-index: -100
  }
  .sugguest li:last-child .history-item{
    border-bottom: 0 none;
  }
  .fix-background{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    background: #FFFFFF;
    z-index: -1;
  }
  .pois{
    height: 320px;
    box-sizing: border-box;
    padding-left: 14px;
  }
  .pois i{
    margin-right: 4px;
  }

  input[type="search"]::-webkit-search-cancel-button{
    display: none;
    -webkit-appearance:none;
  }
@media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
  .cancel-btn{
    padding-bottom: 34px;
  }

}
</style>


