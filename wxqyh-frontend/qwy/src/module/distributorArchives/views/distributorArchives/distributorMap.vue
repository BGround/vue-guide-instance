<template>
  <div class="distributorMapWrap">
    <!-- search start -->
    <div class="searchWrap">
      <div class="sitem">
        <span>区域</span>
        <qwui-select class="selectStyle"
          :dataList="regionData"
          :selectVal="selectRegion"
          @selectItem="chooseRegion"></qwui-select>
        <qwui-select class="selectStyle"
          :dataList="regionData"
          :selectVal="selectRegion"
          @selectItem="chooseRegion"></qwui-select>
        <qwui-select class="selectStyle"
          :dataList="regionData"
          :selectVal="selectRegion"
          @selectItem="chooseRegion"></qwui-select>
      </div>
      <div class="sitem">
        <span>运营状态</span>
        <qwui-select class="selectStyle"
          :dataList="regionData"
          :selectVal="selectRegion"
          @selectItem="chooseRegion"></qwui-select>
      </div>
      <div class="sitem">
        <span>关键字</span>
        <qwui-input v-model="sortNum"
          :inputTips="'ERP号，经销商简称'"></qwui-input>

      </div>
      <div class="sitem">
        <qwuiButton type='danger'>查询</qwuiButton>
        <qwui-button>导出</qwui-button>
      </div>
    </div>
    <!-- search end -->

    <!-- content start  -->
    <div class="mainCon">
      <div class="mapWrap">
        <!-- <div class="allmap"
          id="allmap"></div> -->
        <areaMap></areaMap>
      </div>
    </div>
    <!-- content end  -->
  </div>
</template>

<script>
import qwTab from '@/components/Tab/QwTab'
import page from '@/components/list/page'
import noData from '@/components/list/noData'
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import qwuiSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect'
import qwuiSwitch from '@/components/qwuiBase/qwuiSwitch/qwuiSwitch'
import qwuiBreadcrumb from '@/components/qwuiBase/qwuiBreadcrumb/qwuiBreadcrumb'
import qwuiBreadcrumbItem from '@/components/qwuiBase/qwuiBreadcrumb/qwuiBreadcrumbItem'
import qwuiSteps from '@/components/qwuiBase/qwuiSteps/qwuiSteps'
import qwuiStep from '@/components/qwuiBase/qwuiSteps/qwuiStep'
import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio'
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
import qwuiCheckboxGroup from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckboxGroup'
import qwuiDropdown from '@/components/qwuiBase/QwuiDropdown/QwuiDropdown'
import qwuiDropdownItem from '@/components/qwuiBase/QwuiDropdown/QwuiDropdownItem'
import BMap from 'BMap'
import areaMap from './components/areaMap'

import {ajaxSearchDepatmentList} from '@/module/distributorArchives/api/getData'
export default {
  data() {
    return {
      regionData: [{ idx: '111', val: 'sfdfdf', optionName: '测试' }],
      selectRegion: {},
      sortNum: '',
      tabIndex: 0,
      nodataShow: true,
      pageSetting: { page: 1, pageSize: 10, maxPage: 5, totalRows: 10 },
      map: {
        blist: [],
        districtLoading: 0
      },
      tabList: [
        {
          text: '基础信息',
          perm: 'dynamicinfoList'
        },
        {
          text: '运营数据',
          perm: 'articleDetail'
        },
        {
          text: '人员信息',
          perm: 'dynamicinfoMenu'
        }
      ]
    }
  },
  created(){
    initRegionOptions();
  },
  mounted() {
    this.renderMap()
  },
  methods: {
    renderMap() {
      // var map = new BMap.Map('allmap')
      // var point = new BMap.Point(111.742579, 40.818675)
      // map.centerAndZoom(point, 12)
      // var marker = new BMap.Marker(point) // 创建标注
      // map.addOverlay(marker) // 将标注添加到地图中

      var map = new BMap.Map('allmap', { minZoom: 5, maxZoom: 20 }) // 创建地图实例
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
      }, 100)
    },
    getBoundary() {
      // addDistrict("辽宁省");
      this.addDistrict('河南省')
      // addDistrict("陕西省");
      // addDistrict("江西省");
      // addDistrict("石家庄");
      // addDistrict("青岛");
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
      var map = new BMap.Map('allmap', { minZoom: 5, maxZoom: 20 }) // 创建地图实例
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
    },
    chooseRegion(optionName, val) {
      this.selectRegion = {
        idx: val,
        val: val,
        name: optionName
      }
    },
    selectIndex(val) {
      this.tabIndex = val
    },
    // 分页
    pageChange() {},

    initRegionOptions(){
      // ajaxGetBasicInfoList({},(data)=>{

      // });
    },


  },
  components: {
    qwTab,
    page,
    noData,
    qwuiInput,
    qwuiButton,
    qwuiSelect,
    qwuiSwitch,
    qwuiBreadcrumb,
    qwuiBreadcrumbItem,
    qwuiSteps,
    qwuiStep,
    qwuiRadio,
    qwuiCheckbox,
    qwuiCheckboxGroup,
    qwuiStep,
    qwuiDropdown,
    qwuiDropdownItem,
    areaMap
  }
}
</script>

<style lang="less">
@import url('./css/distributorMap.less');
</style>
