<template>
  <qw-modal v-model="visible"
            :title="title"
            :showCancelButton='true'
            class="qw-map"
            @on-cancel="visible=false"
            @on-confirm="onConfirm"
            :z-index="99">
    <div class="map-main">
      <div class="map-search">
        <span>关键字</span>
        <input type="text"
               id="suggestId">

      </div>
      <div class="map-container">
        <div id="mapConter"></div>
      </div>
    </div>
  </qw-modal>
</template>
<script>
import QwModal from "crm/components/qwModal";
import { baiduMapAK, loadJS } from "crm/utils/common";
import qwInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
export default {
  name: "qwMap",
  components: {
    QwModal,
    qwInput
  },
  props: {
    value: { default: false },
    title: {
      default: "位置选择"
    }
  },
  data() {
    return {
      visible: false,
      map: "",
      defaultPoint: [116.404, 39.915],
      // currPoint: "",
      searchVal: "",
      zoom: 12, //缩放
      autoComplete: "",
      location: ""
    };
  },
  watch: {
    value: {
      handler(val) {
        this.visible = val;
      },
      immediate: true
    },
    visible(val) {
      this.$emit("input", val);
      if (val) {
        !window.BMap
          ? loadJS(
              `//api.map.baidu.com/api?v=2.0&ak=${baiduMapAK}&callback=baiduMapInit`
            )
          : !this.map && this.init();
      }
    }
  },
  created() {
    window.baiduMapInit = this.init;
  },
  beforeDestroy() {
    window.baiduMapInit && delete window.baiduMapInit;
    this.autoComplete && this.autoComplete.dispose();
  },
  methods: {
    init() {
      this.map = new BMap.Map("mapConter");

      this.map.enableScrollWheelZoom(true); //启用滚轮放大缩小，默认禁用
      this.map.enableContinuousZoom(true); //启用地图惯性拖拽，默认禁用

      this.autoComplete = new BMap.Autocomplete({
        //建立一个自动完成的对象
        input: "suggestId",
        location: this.map
      });
      let Geocoder = new BMap.Geocoder();
      //菜单确认
      this.autoComplete.addEventListener("onconfirm", e => {
        // console.log(e);
        //鼠标点击下拉列表后的事件
        let address =
          e.item.value.province +
          e.item.value.city +
          e.item.value.district +
          e.item.value.business;

        Geocoder.getPoint(
          address,
          rs => {
            this.addOverlay([rs.lng, rs.lat]);
            this.location = {
              address,
              ...e.item.value,
              ...rs
            };
          },
          e.item.value.city
        );
      });

      this.addOverlay(this.defaultPoint); //标点

      this.getCurrLocation(); //当前位置

      this.addControl();
      //地图点击
      this.map.addEventListener("click", e => {
        this.zoom = e.target.Ba;
        this.addOverlay([e.point.lng, e.point.lat]);

        Geocoder.getLocation(e.point, rs => {
          this.autoComplete.setInputValue(rs.address);

          this.location = {
            address: rs.address,
            ...rs.addressComponents,
            business: rs.business,
            ...e.point,
            zoom: this.zoom
          };
        });
      });
    },
    // 标注
    addOverlay(point) {
      this.map.clearOverlays();
      let _point = new BMap.Point(...point);
      this.map.centerAndZoom(_point, this.zoom);

      this.autoComplete && this.autoComplete.setLocation(this.map);
      let marker = new BMap.Marker(_point); // 创建标注
      this.map.addOverlay(marker); // 将标注添加到地图中
    },
    //添加控件
    addControl() {
      // 添加带有定位的导航控件
      let navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
      });
      this.map.addControl(navigationControl);

      // 添加定位控件
      let geolocationControl = new BMap.GeolocationControl();
      geolocationControl.addEventListener("locationSuccess", function(e) {
        // console.log(e);
        // 定位成功事件
        let address = "";
        address += e.addressComponent.province;
        address += e.addressComponent.city;
        address += e.addressComponent.district;
        address += e.addressComponent.street;
        address += e.addressComponent.streetNumber;
        // alert("当前定位地址为：" + address);
        dataBase.top_alert("当前定位地址为：" + address, true, 2000);
      });
      geolocationControl.addEventListener("locationError", function(e) {
        // 定位失败事件
        // alert(e.message);
        dataBase.top_alert(e.message, false, 2000);
      });
      this.map.addControl(geolocationControl);

      // 右键菜单
      let menu = new BMap.ContextMenu();
      let txtMenuItem = [
        {
          text: "放大",
          callback: () => {
            this.map.zoomIn();
          }
        },
        {
          text: "缩小",
          callback: () => {
            this.map.zoomOut();
          }
        }
      ];
      txtMenuItem.forEach(item => {
        menu.addItem(new BMap.MenuItem(item.text, item.callback, 100));
      });
      this.map.addContextMenu(menu);
    },
    //获取当前位置
    getCurrLocation() {
      // let self = this;
      // let geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function(r) {
      //   if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      //     this.currPoint = [r.point.lng, r.point.lat];
      //     self.addOverlay(this.currPoint);
      //     self.map.panTo(r.point);
      //   }
      // });

      //百度地图api 浏览器定位不准确 通过ip定位 切换城市 取消标点
      let myCity = new BMap.LocalCity();
      myCity.get(result => {
        // console.log(result);
        // this.addOverlay([result.center.lng, result.center.lat]);
        this.map.clearOverlays();
        this.map.setCenter(result.name);
      });
    },
    onConfirm() {
      if (!this.location) {
        dataBase.top_alert("未选择地址", false, 1000);
        return;
      }
      this.visible = false;
      this.$emit("on-confirm", this.location);
    }
  }
};
</script>
<style lang="scss" scoped>
.qw-map {
  .map-main {
    width: 760px;
    height: 420px;
  }
  .map-search {
    display: flex;
    padding: 20px 20px 10px;
    align-items: center;
    span {
      width: 100px;
      margin-right: 25px;
      text-align: right;
    }
    input {
      width: 400px;
      border: 1px solid #bbb;
      padding: 8px;
    }
  }
  .map-container {
    #mapConter {
      border: 1px solid #ddd;
      width: 600px;
      height: 340px;
      margin: 0 15px 0 auto;
    }
  }
}
</style>

<style>
.tangram-suggestion-main {
  z-index: 1000;
}
</style>
