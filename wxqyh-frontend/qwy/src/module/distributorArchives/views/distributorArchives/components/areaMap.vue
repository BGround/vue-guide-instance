<template>
  <div class="areaMapWrap">
    <div class="allmap"
      :id="mapId"></div>
  </div>
</template>

<script>
import BMap from 'BMap'
export default {
  data() {
    return {
      map: {
        selector: '',
        blist: [],
        districtLoading: 0
      }
    }
  },
  props: {
    columns: {
      type: Object,
      default() {
        return {
          // province: '',
          mapPoints: []
        }
      }
    },
    mapId: {
      type: String,
      default() {
        return 'allmap'
      }
    }
  },
  methods: {
    // 标注市
    renderCity() {
      var map = new BMap.Map(this.mapId)
      this.map.selector = map
      let mapPoints = this.columns.mapPoints
      var point = ''
      if (mapPoints.length > 0) {
        let long = 0
        let lat = 0
        let avg = mapPoints.length
        mapPoints.map(item => {
          long += item.longitude
          lat += item.latitude
        })
        point = new BMap.Point(long / avg, lat / avg)
      } else {
        point = new BMap.Point(119, 42)
      }
      // map.centerAndZoom(point, 3)
      map.centerAndZoom(new BMap.Point(point.lng,point.lat), 3);
      // var marker = new BMap.Marker(point)
      // map.addOverlay(marker)
      map.enableScrollWheelZoom(true)
      // 函数 创建多个标注
      let self = this
      mapPoints.map(item => {
        var points = new BMap.Point(item.longitude, item.latitude) //创建坐标点
        var opts = {
          width: 250,
          height: 100,
          title: item.title
        }
        var label = new BMap.Label(item.branch, {
          offset: new BMap.Size(25, 5)
        })
        var infoWindows = new BMap.InfoWindow(item.con, opts)

        // 标注
        // self.markerFun(points, label, infoWindows)
        var markers = new BMap.Marker(points)
        map.addOverlay(markers)
        markers.setLabel(label)
        markers.addEventListener('click', function(event) {
          map.openInfoWindow(infoWindows, points) //参数：窗口、点  根据点击的点出现对应的窗口
        })
      })
    },
    markerFun(points, label, infoWindows) {
      var markers = new BMap.Marker(points)
      this.map.selector.addOverlay(markers)
      markers.setLabel(label)
      markers.addEventListener('click', function(event) {
        this.map.selector.openInfoWindow(infoWindows, points) //参数：窗口、点  根据点击的点出现对应的窗口
      })
    },

    // 标注省
    renderMap() {
      // var map = new BMap.Map('allmap')
      // var point = new BMap.Point(111.742579, 40.818675)
      // map.centerAndZoom(point, 12)
      // var marker = new BMap.Marker(point) // 创建标注
      // map.addOverlay(marker) // 将标注添加到地图中

      var map = new BMap.Map(this.mapId, { minZoom: 5, maxZoom: 20 }) // 创建地图实例
      this.map.selector = map
      //设置个性化样式
      map.setMapStyle({
        styleJson: [
          {
            featureType: 'road',
            elementType: 'all',
            stylers: {
              color: '#ffffff',
              visibility: 'off'
            }
          }
        ]
      })

      map.enableScrollWheelZoom()
      map.enableDragging()
      map.disableDoubleClickZoom()

      setTimeout(() => {
        this.getBoundary()
      }, 1000)
    },
    getBoundary() {
      if (this.columns.province) {
        this.addDistrict(this.columns.province + '省')
      }
    },
    addDistrict(districtName) {
      let self = this
      //使用计数器来控制加载过程
      this.map.districtLoading++
      var bdary = new BMap.Boundary()
      bdary.get(districtName, function(rs) {
        //获取行政区域
        var count = rs.boundaries.length //行政区域的点有多少个
        let temp = []
        for (var i = 0; i < count; i++) {
          temp.push({ points: rs.boundaries[i], name: districtName })
        }
        self.map.blist = temp
        //加载完成区域点后计数器-1
        self.map.districtLoading--
        if (self.map.districtLoading == 0) {
          //全加载完成后画端点
          self.drawBoundary()
        }
      })
    },
    mapClick(evt) {
      alert(evt.target.name)
      this.$router.push({ name: 'archivesMap' })
    },
    drawBoundary() {
      // var map = new BMap.Map('allmap', { minZoom: 5, maxZoom: 20 }) // 创建地图实例
      var map = this.map.selector
      //包含所有区域的点数组
      var pointArray = []
      //循环添加各闭合区域
      for (var i = 0; i < this.map.blist.length; i++) {
        //添加多边形层并显示
        var ply = new BMap.Polygon(this.map.blist[i].points, {
          strokeWeight: 1, //边框宽度
          trokeColor: '#014F99', //边框颜色#7d0000
          // fillColor: " #DDE4F0" ,//填充颜色
          fillColor: ' #7d0000' //填充颜色
        }) //建立多边形覆盖物
        ply.name = this.map.blist[i].name
        ply.addEventListener('click', this.mapClick)
        map.addOverlay(ply)

        //将点增加到视野范围内
        var path = ply.getPath()
        pointArray = pointArray.concat(path)
      }

      //限定显示区域(只显示特定区域，鼠标拖动松开后自动回到显示范围内)，需要引用api库
      // var boundply = new BMap.Polygon(pointArray);
      // BMapLib.AreaRestriction.setBounds(map, boundply.getBounds());
      map.setViewport(pointArray) //调整视野
    }
  },
  watch:{
    columns: {
       handler(newVal, oldVal){
            this.renderCity()
      },
      deep: true
    }
  }
}
</script>
