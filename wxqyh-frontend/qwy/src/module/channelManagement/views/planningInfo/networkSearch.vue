<template>
  <div>
    <div class="qwui-top_main_bar">
      <div class="qwui-bar_left">
        <qwuiButton @click="handleBack">&nbsp;返回&nbsp;</qwuiButton>
        <!-- <qwuiButton
          v-perm="'serviceNetWorkExport'"
          type="primary"
          @click="handleClickExportBtn"
          >&nbsp;导出&nbsp;</qwuiButton
        > -->
        <!-- <span class="qwui-dotted_line"></span> -->
        <!-- <qwuiButton  @click="handleClickDistanceBtn"
          >&nbsp;网点距离查询&nbsp;</qwuiButton> -->
      </div>

      <div class="qwui-bar_right">
        <!-- <span class="qwui-dotted_line"></span> -->
        <qwui-input
          inputType="search"
          @search="handleSimpleSearch"
          v-model="searchParams.pointName"
          :inputTips="'服务号、服务站名称'"
        ></qwui-input>
        <a class="qwui-senior_search_btn" @click="showAdvancedScreen"
          >高级搜索</a
        >
      </div>
    </div>

    <!-- @keyup.enter="searchForm" -->
    <searchPonitForm
      @change="handleChangeForm"
      @submit="handleAdvancedSearch"
      @reset="handleResetForm"
      v-show="isShowAdvancedScreen"
    ></searchPonitForm>

    <div class="qwui-map_wrap">
      <div id="container"></div>
      <ul class="toolbar">
        <li
          class="toolbar__item"
          :class="{ 'toolbar__item--active': isEnableRangingTool }"
          @click="handleClickRangingTool"
        >
          <img :src="isEnableRangingTool ? iconRuleActive : iconRule" alt="" />
          <span>测距</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import qwuiSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect'
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'

import dataTable from '@/components/Table/dataTable.vue'
import page from '@/components/list/page.vue'
import qwShareAlert from '@/components/Alert/QwShareAlert.vue'
import searchPonitForm from '@/module/channelManagement/components/planningInfo/searchPonitForm'
import {
  searchPointMapList,
  translate
} from '@/module/channelManagement/api/getData'
import convexHull from 'monotone-convex-hull-2d'
import iconRule from '@/module/channelManagement/assets/imgs/icon_rule.png'
import iconRuleActive from '@/module/channelManagement/assets/imgs/icon_rule_active.png'

// import './Distance.js'
// import { mapActions, mapGetters } from 'vuex'
const colors = [
  '#3fb1e3',
  '#6be6c1',
  '#626c91',
  '#a0a7e6',
  '#c4ebad',
  '#96dee8',
  '#3fb1e3',
  '#6be6c1',
  '#626c91',
  '#a0a7e6',
  '#c4ebad',
  '#96dee8'
  // [242, 179, 201, 0.5]
]
export default {
  name: 'networkSearch',
  data() {
    return {
      iconRule,
      iconRuleActive,
      searchTitle: '',
      pageSize: 10,
      pageData: {},
      exportStartTime: '',
      exportEndTime: '',
      isShowAdvancedScreen: true,
      dataList: [],
      searchParams: {
        pointName: '',
        pointType: '',
        pointRunStatus: '',
        areaId: '',
        provinceName: '',
        cityName: '',
      },
      searchData: [],
      page: 1,
      totalRows: 0,
      exportParams: {},
      isUseAdvancedScreen: false,
      map: null,
      info: null,
      latLngs: [],
      markers: [],
      polygon: null,
      circles: [],
      pointMapList: [],
      isEnableRangingTool: false,
      rule: null
    }
  },
  mounted() {
    this.initMap()
    // setTimeout(this.clear, 3000)
  },
  methods: {
    handleClickRangingTool() {
      this.isEnableRangingTool = !this.isEnableRangingTool
      if (this.isEnableRangingTool) {
        this.rangingTool.turnOn()
        // this.circles.forEach(circle => circle.hide())
        // this.markers.forEach(marker => marker.setClickable(false))
        // this.polygon && this.polygon.hide()
      } else {
        this.rangingTool.turnOff(true)
        // this.circles.forEach(circle => circle.show())
        // this.markers.forEach(marker => marker.setClickable(true))
        // this.polygon && this.polygon.show()
      }
    },

    initMap() {
      this.map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 4, //初始化地图层级
        center: [116.397428, 39.90923] //初始化地图中心点
      })
      this.rangingTool = new AMap.RangingTool(this.map)
    },

    draw(list) {
      if (!list.length) {
        return Promise.reject(new Error('没有搜索到网点'))
      }
      const latLngs = this.createlatLngs(list)

      return this.convertToAMapLatlnt(latLngs).then(latLngs => {
        this.latLngs = latLngs
        this.addMarkers()
        this.addCircles()
        this.drawPolygon()
      })
    },

    createlatLngs(latLngs) {
      return latLngs.map(item => new AMap.LngLat(item.lng, item.lat))
    },

    addMarkers() {
      this.markers = this.latLngs.map(
        item =>
          new AMap.Marker({
            position: item, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            // title: "北京",
            clickable: true
          })
      )
      this.map.add(this.markers)
      this.attachedEventToMarkers(this.markers)
      // this.detachEventFromMarkers(this.markers);
    },

    attachedEventToMarkers(markers) {
      markers.forEach((marker, index) => {
        marker.on(
          'click',
          () => {
            const { serviceNo, networkType, pointAddress, pointName, pointStatus } = this.pointMapList[
              index
            ]
            const html = `<div style="white-space:nowrap;margin:10px;">
            <p>服务号：${serviceNo || '-'}</p>
              <p>简称：${pointName || '-'}</p>
              <p>性质：${networkType || '-'}</p>
              <p>地址：${pointAddress || '-'}</p>
              <p>经营状态：${pointStatus || '-'}</p>
            </div>`
            var infoWindow = new AMap.InfoWindow({
              content: html //传入 dom 对象，或者 html 字符串
            })
            infoWindow.open(this.map, this.latLngs[index])
          },
          this
        )
      })
    },

    //关闭信息窗体
    closeInfoWindow() {
      this.map.clearInfoWindow()
    },

    detachEventFromMarkers(markers) {},

    addCircles() {
      this.circles = this.latLngs.map((item, index) => {
        const radius =
          parseFloat(this.pointMapList[index].pointCoverageArea) || 0
          console.log(radius)
        const randomValue = Math.round(Math.random() * 10)
        const color = colors[randomValue]
        const circle = new AMap.Circle({
          center: item, // 圆心位置
          radius: radius, // 圆半径
          fillColor: color, // 圆形填充颜色
          strokeColor: color, // 描边颜色
          fillOpacity: 0.3,
          bubble: true,
          strokeWeight: 0 // 描边宽度
        })
        this.map.add(circle)
        return circle
      })
    },

    drawPolygon() {
      if (this.latLngs.length < 3) {
        return
      }
      const path = this.calculatePath(this.latLngs)
      const polygon = new AMap.Polygon({
        path: path,
        fillColor: '#009cf9', // 多边形填充颜色
        borderWeight: 1, // 线条宽度，默认为 1
        fillOpacity: 0.3,
        bubble: true,
        strokeColor: '#009cf9' // 线条颜色
      })
      this.map.add(polygon)
      this.polygon = polygon
    },

    /**
     * 计算路径
     */
    calculatePath(latLngs) {
      if (latLngs.length === 3) {
        return latLngs
      }
      if (latLngs.length > 3) {
        // 生成凸包路径
        const points = latLngs.map(item => [item.lat, item.lng])
        const indexResult = convexHull(points)
        return indexResult.map(value => latLngs[value])
      }
    },

    clear() {
      this.map.clearMap() // 清除地图覆盖物
      this.latLngs = []
      this.circles = [];
      this.markers = [];
      this.polygon = null;
    },

    // 百度转到高德
    convertToAMapLatlnt(latLngs) {
      return new Promise((resolve, reject) => {
        AMap.convertFrom(latLngs, 'gps', function(status, result) {
          if (result.info === 'ok') {
            resolve(result.locations)
          } else {
            resolve(new Error('坐标转换错误'))
          }
        })
      })
    },

    handleBack() {
      this.$router.back()
    },

    handleClickExportBtn() {},

    /**
     * 网点距离查询
     */
    handleClickDistanceBtn() {},

    handleSimpleSearch(value) {
      // this.isShowAdvancedScreen = false;
      this.updateParams()
      this.fetchPointList()
    },

    handleResetForm(form) {
      this.searchParams = Object.assign({}, this.searchParams, form)
      // this.fetchPointList();
    },

    handleAdvancedSearch(form) {
      this.searchParams = Object.assign({}, this.searchParams, form)
      
      this.fetchPointList()
    },

    handleChangeForm(form) {
      console.log(this.searchParams, form, 'xxx23x')
      this.searchParams = Object.assign({}, this.searchParams, form)
    },

    updateParams() {
      if (this.isShowAdvancedScreen) {
        return
      }
      this.searchParams = Object.assign({}, this.searchParams, {
        areaId: '',
        provinceName: '',
        cityName: '',
        pointType: '',
        pointRunStatus: ''
      })
    },

    fetchPointList() {
      if (!this.searchParams.provinceName || !this.searchParams.cityName) {
        _.alert('提示', '请选择省份和城市')
        return
      }
      console.log(this.searchParams.areaId)

      searchPointMapList(this.searchParams).then(data => {
        if (data && Array.isArray(data.pointMapList)) {
          this.pointMapList = data.pointMapList
          const locations = data.pointMapList.map(item => {
            return {
              lat: parseFloat(item.pointLatitude), // 后端数据经纬返了
              lng: parseFloat(item.pointLongitude)
            }
          }).filter((item)=>item.lat && item.lng)
          if( data.pointMapList && !locations.length){
            _.alert('提示','网点地理位置数据无效')
            return;
          }
          this.clear()
          this.draw(locations)
            .then(()=>{
              this.map.setFitView()
            })
            .catch(error => {
              _.alert('提示',error.message)
              this.map.setZoomAndCenter(4, [116.397428, 39.90923]); // 复位
            })
        }
      })
    },


    skipFunc(item) {
      this.$router.push({
        name: 'newsBulletinRead',
        params: {
          id: item.dynamicInfoId,
          title: item.title
        }
      })
    },

    change(page, pageSize) {
      this.pageSize = pageSize
      this.page = page
      this.updateParams()
      this.searchDynamicPager()
    },
    search(value) {
      this.page = 1
      this.isUseAdvancedScreen = false
      this.updateParams()
      this.searchDynamicPager()
    },
    searchResult(data) {
      this.isUseAdvancedScreen = true
      this.searchData = data
      this.page = 1
      this.updateParams()
      this.searchDynamicPager()
    },
    updateParams() {},
    searchDynamicPager() {
      let self = this
      searchDynamicPager(this.searchParams, data => {
        this.pageData = {
          page: data.currPage,
          pageSize: this.pageSize,
          maxPage: data.maxPage,
          totalRows: data.totalRows
        }
        this.totalRows = data.totalRows
        this.dataList = data.pageData || []
      })
    },

    showAdvancedScreen() {
      this.isShowAdvancedScreen = !this.isShowAdvancedScreen
    }
  },

  components: {
    qwuiButton,
    qwuiInput,
    qwuiSelect,
    searchPonitForm
  }
}
</script>

<style lang="scss" scoped>
#container {
  min-width: 600px;
  min-height: 767px;
}
@mixin tip-style {
  display: inline-block;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  margin-right: 5px;
  padding: 2px 5px;
  background: #32cd32;
}
@mixin pt15 {
  padding-top: 15px;
}
@mixin pt20 {
  padding-top: 20px;
}
.qwui-dotted_line {
  border-right: 1px dashed #cfcfcf;
  margin: 0 8px 0 5px;
}

.qwui-top_main_bar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  @include pt20;
  .qwui-bar_left {
    flex: 1;
  }
  .qwui-bar_right {
    .qwui-senior_search_btn {
      cursor: pointer;
      float: right;
      font-size: 12px;
      height: 35px;
      line-height: 16px;
      margin: 0 5px;
      padding: 0 3px;
      text-align: center;
      width: 30px;
      color: #C31725;
      user-select: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.qwui-map_wrap {
  @include pt15;
  .qwui-content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .qwui-set_top {
      @include tip-style;
    }
    .qwui-secret {
      @include tip-style;
      background: #ff574d;
    }
    .goLink {
      color: #C31725;
      text-decoration: underline;
    }
  }
  position: relative;
  .toolbar {
    right: 20px;
    top: 35px;
    position: absolute;
    background: #fff;
    z-index: 112;
    border-radius: 3px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    font-size: 20px;

    img {
      width: 24px;
      height: 24px;
      margin-right: 6px;
    }
  }
  .toolbar__item {
    height: 45px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #565656;
    padding: 0 12px;
    &:hover {
      opacity: 0.6;
    }
  }
  .toolbar__item--active {
    color: #009cf9;
  }

  // .custom-input-card {
  //   width: 22rem;
  // }

  // .custom-input-card .btn {
  //   margin-right: 1rem;
  // }

  // .custom-input-card .btn:last-child {
  //   margin-right: 0;
  // }

  .content-window-card {
    position: relative;
    box-shadow: none;
    bottom: 0;
    left: 0;
    width: auto;
    padding: 0;
    p {
      height: 2rem;
    }
  }

  .custom-info {
    border: solid 1px silver;
  }

  div.info-top {
    position: relative;
    background: none repeat scroll 0 0 #f9f9f9;
    border-bottom: 1px solid #ccc;
    border-radius: 5px 5px 0 0;
  }

  div.info-top div {
    display: inline-block;
    color: #333333;
    font-size: 14px;
    font-weight: bold;
    line-height: 31px;
    padding: 0 10px;
  }

  div.info-top img {
    position: absolute;
    top: 10px;
    right: 10px;
    transition-duration: 0.25s;
  }

  div.info-top img:hover {
    box-shadow: 0px 0px 5px #000;
  }

  div.info-middle {
    font-size: 12px;
    padding: 10px 6px;
    line-height: 20px;
  }

  div.info-bottom {
    height: 0px;
    width: 100%;
    clear: both;
    text-align: center;
  }

  div.info-bottom img {
    position: relative;
    z-index: 104;
  }
}
</style>
