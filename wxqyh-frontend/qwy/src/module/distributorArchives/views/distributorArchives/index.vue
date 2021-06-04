<template>
  <div class="archiveListWrap">
    <!-- search start -->
    <div class="searchWrap">
      <div class="sitem region">
        <span>区域</span>
        <el-select v-model="selectedRegionId"
          @change="handleSelectRegion"
          @clear="handleClearRegion"
          clearable
          popper-class="select-region"
          placeholder="请选择">
          <el-option v-for="(item, index) in regionOptions"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="selectedProvinceId"
          @change="handleSelectProvince"
          @clear="handleClearProvince"
          clearable
          popper-class="select-region"
          placeholder="请选择">
          <el-option v-for="(item, index) in provinceOptions"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="selectedCityId"
          @change="handleSelectCity"
          @clear="handleClearCity"
          clearable
          popper-class="select-region"
          placeholder="请选择">
          <el-option v-for="(item, index) in cityOptions"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="sitem state">
        <span>运营状态</span>
        <el-select v-model="selectedOperationStatus"
          @change="handleChnageOperationStatus"
          clearable
          popper-class="select-region"
          placeholder="请选择">
          <el-option v-for="(item, index) in operationStatusOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="sitem keyword">
        <span>关键字</span>
        <el-input placeholder="ERP号，经销商简称"
          v-model="keyword"
          clearable>
        </el-input>
      </div>
      <div class="sitem">
        <el-button @click="handleClickSearchbtn"
          type="danger">查询</el-button>
        <el-button @click="exportFun">导出</el-button>
      </div>
    </div>
    <!-- search end -->

    <!-- content start  -->
    <div class="mainCon">
      <div class="mapWrap">
        <div class="allmap"
          id="allmap"></div>
      </div>
      <div class="listWrap">
        <div class="titWrap">
          <h3>{{warZoneVal}} 经销商一览</h3>
          <div class="tabWrap">
            <qwTab :tabList="tabList"
              :index="tabIndex"
              @selectIndex="selectIndex"></qwTab>
          </div>
        </div>

        <div class="tableWrap">
          <distrBasicTable v-if="tabIndex===0" :columns="basicList"></distrBasicTable>
          <operation-data-table v-if="tabIndex===1" :columns="operateList"></operation-data-table>
          <user-table v-if="tabIndex===2" :columns="userList"></user-table>
        </div>
        <noData v-show="nodataShow"></noData>
      </div>
    </div>
    <div class="pageWrap">
      <page v-if="tabIndex===0" :pageData='pageSetting' :pageSizeOption="pageSizeOption" @change='handlePageChange'></page>
      <page v-if="tabIndex===1" :pageData='operatePageSetting' :pageSizeOption="operatePageSizeOption" @change='operateHandlePageChange'></page>
      <page v-if="tabIndex===2" :pageData='userPageSetting' :pageSizeOption="userPageSizeOption" @change='userHandlePageChange'></page>
    </div>
    <!-- content end  -->
  </div>
</template>

<script>
import qwTab from '@/components/Tab/QwTab'
import page from '@/components/list/page'
import noData from '@/components/list/noData'
import distrBasicTable from './components/index/distrBasicTable'
import operationDataTable from "./components/index/operationDataTable";
import userTable from "./components/index/userTable";
import BMap from 'BMap'
import { ajaxSearchDepatmentList, ajaxGetBasicInfoList, ajaxGetUserList, ajaxGetOperationsList} from '@/module/distributorArchives/api/getData'

export default {
  data() {
    return {
      departmentId:'',
      regionOptions: [],
      provinceOptions: [],
      cityOptions: [],
      operationStatusOptions: [
        {
          label: '正常经营',
          value: '1'
        },
        {
          label: '异常经营',
          value: '2'
        },
        {
          label: '退网经销商',
          value: '3'
        }
      ],
      selectedRegionId: '',
      selectedCityId: '',
      selectedProvinceId: '',
      selectedOperationStatus: '',
      keyword: '',
      tabIndex: 0,
      nodataShow: false,
      pageSetting: { page: 1, pageSize: 7, maxPage: 5, totalRows: 10 }, // 基础信息分页
      userPageSetting: { page: 1, pageSize: 7, maxPage: 5, totalRows: 10 }, // 人员信息分页
      operatePageSetting: { page: 1, pageSize: 7, maxPage: 5, totalRows: 10 }, // 运营信息分页
      pageSizeOption:[7,10, 20, 50, 100],
      operatePageSizeOption:[7,10, 20, 50, 100],
      userPageSizeOption:[7,10, 20, 50, 100],
      pop: {
        isPersonDesShow: false,
        isUpdateTimeShow: false
      },
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
      ],
      basicList: [], // 基础信息
      userList:[], // 人员信息
      operateList:[], // 运营信息
      sForm: {
        page: 1,
        pageSize: 7,
        searchValue: {
          status: '', // 状态：1、正常运营2、经营异常3、退网经销商；默认空，全部（参数：数字）
          departmentId: '', // 战区/省份/市区的ID，全国为空（参数：ID）
          keyWord: ''
        }
      },
      map: null, // 地图实例
      warZoneVal:'' // 战区名字
    }
  },
  computed: {
    regionId(){
      return this.selectedCityId || this.selectedProvinceId || this.selectedRegionId || '';
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.initMap();
    this.drawRegion(['北京']);
    this.setRegionSelectValue();
    this.getBasicInfoList();
    this.getOperationsList()
    this.getUserList()
  },
  methods: {
    init() {
      this.selectedOperationStatus = this.$route.query.status ||''
      this.keyword = this.$route.query.keyWord ||''
    },
    // 获取运营信息
    getOperationsList(){
        let params = {
            'page': this.operatePageSetting.page,
            'pageSize': this.operatePageSetting.pageSize,
            'searchValue.keyWord': this.keyword,
            'searchValue.status': this.selectedOperationStatus,
            'searchValue.departmentId': this.regionId
        }

        let self = this
        ajaxGetOperationsList(params,data => {
            if(data.pageData) {
              data.pageData.map(item => {
                  if(parseInt(item.curStarRating)>10) {
                      item.curStarRating=10
                  }
                  item.curStarRating = parseInt(item.curStarRating)
              })
            }
            self.operateList = data.pageData || []
            // self.operatePageSetting.page = data.currPage;
            self.operatePageSetting.maxPage = data.maxPage;
            self.operatePageSetting.totalRows = data.totalRows;
        })
    },
    // 导出
    exportFun(){
      _.alert('提示','该功能待完善')
    },
    // 获取人员信息
    getUserList(){
      let params = {
          'page': this.userPageSetting.page,
          'pageSize': this.userPageSetting.pageSize,
          'searchValue.keyWord': this.keyword,
          'searchValue.status': this.selectedOperationStatus,
          'searchValue.departmentId': this.regionId
      }
      let self = this
      ajaxGetUserList(params,data => {
            self.userList = data.pageData || []
            // self.userPageSetting.page = data.currPage;
            self.userPageSetting.maxPage = data.maxPage;
            self.userPageSetting.totalRows = data.totalRows;
      })
    },

    setRegionSelectValue(){
      const {regionId, provinceId, cityId} = this.$route.query;
      this.selectedRegionId = regionId ||'';
      this.selectedProvinceId = provinceId ||'';
      this.selectedCityId = cityId ||'';
      this.getRegionOptions();
      let getProvinceOptionsPromise;
      let getCityOptionsPromise;
      const hasProvinceId = !!this.selectedProvinceId;
      const hasCityId = !!this.selectedCityId;
      const hasRegionId = !!this.selectedRegionId;

      // 获取战区名字
      setTimeout(()=>{
          this.getWarzoneName(this.selectedRegionId)
      },500)

      if(hasProvinceId){
        getProvinceOptionsPromise = this.getProvinceOptions();
      }
      if(this.selectedCityId) {
         getCityOptionsPromise = this.getCityOptions();
      }
      if(hasCityId){ // 绘制城市
        getCityOptionsPromise.then(()=>{
          const districtName = this.findDistrictNameById(this.cityOptions, this.selectedCityId);
          this.drawRegion([districtName])
        })

      }else if(hasProvinceId){ // 绘制省份
        getProvinceOptionsPromise.then(()=>{
          const districtName = this.findDistrictNameById(this.provinceOptions, this.selectedProvinceId);
          this.drawRegion([districtName]);
        })
      } else if(regionId){ // 绘制省份
      this.getProvinceOptions();
        this.getProvinceOptions().then(()=>{
          const provinces = this.provinceOptions.map(item=>item.name);
          this.drawRegion(provinces);
        })
      }else{
        this.map.clearOverlays();
      }
    },

    /**
     * 查找城市名
     */
    findDistrictNameById(options, id){
      const option = options.find(item=>item.id===id);
      return option && option.name || '';
    },

    // 获取基础信息列表
    getBasicInfoList() {
      const params = {
        'page': this.pageSetting.page,
        'pageSize': this.pageSetting.pageSize,
        'searchValue.keyWord': this.keyword,
        'searchValue.status': this.selectedOperationStatus,
        'searchValue.departmentId': this.regionId,
      }
      ajaxGetBasicInfoList(params, data => {
        this.basicList = data.pageData || [];
        this.pageSetting.page = data.currPage;
        this.pageSetting.maxPage = data.maxPage;
        this.pageSetting.totalRows = data.totalRows;
      })
    },

    /**
     * 查询
     */
    handleClickSearchbtn() {
      this.pageSetting.page = 1
      this.pageSetting.pageSize = 7
      this.getWarzoneName(this.selectedRegionId)

      this.getBasicInfoList();

      this.operatePageSetting.page = 1
      this.operatePageSetting.pageSize = 7
      this.getOperationsList()

      this.userPageSetting.page = 1
      this.userPageSetting.pageSize = 7
      this.getUserList()
      // if(this.tabIndex===0){
      //     this.getBasicInfoList();
      // }else if(this.tabIndex===1){
      //     this.getOperationsList()
      // }else if(this.tabIndex===2){
      //     this.getUserList()
      // }
    },
    // tab切换
    selectIndex(val) {
        this.tabIndex = val
        // if(this.tabIndex===0){
        //     this.getBasicInfoList();
        // }else if(this.tabIndex===1){
        //     this.getOperationsList()
        // }else if(this.tabIndex===2){
        //     this.getUserList()
        // }
    },

    /**
     * 请求战区
     */
    getRegionOptions() {
      return ajaxSearchDepatmentList().then((data)=>{
        if(data){
          this.regionOptions = data.departmentList || []
        }
      })
    },

    getProvinceOptions() {
      return ajaxSearchDepatmentList({ id: this.selectedRegionId }).then((data)=>{
        if(data){
          this.provinceOptions = data.departmentList || []
        }
      })
    },
    getCityOptions() {
      return ajaxSearchDepatmentList({ id: this.selectedProvinceId }).then((data)=>{
        if(data){
          this.cityOptions = data.departmentList || []
        }
      })
    },

    /**
     * 选项转换数据格式
     */
    normalizeRegionOPtions(list = []) {
      return list.map((item, index) => {
        return { idx: index, val: item.id, optionName: item.name }
      })
    },
    // 地图渲染
    initMap() {
      // var map = new BMap.Map('allmap')
      // var point = new BMap.Point(111.742579, 40.818675)
      // map.centerAndZoom(point, 12)
      // var marker = new BMap.Marker(point) // 创建标注
      // map.addOverlay(marker) // 将标注添加到地图中
      this.map = new BMap.Map('allmap', { minZoom: 5, maxZoom: 20 }) // 创建地图实例
      //设置个性化样式
      this.map.setMapStyle({
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

      this.map.enableScrollWheelZoom()
      this.map.enableDragging()
      this.map.disableDoubleClickZoom()
    },


    async drawRegion(districts){
      let pointArray = [];
      this.map.clearOverlays();
      const bdary = new BMap.Boundary();
      for(let name of districts){
        const boundaries =  await this.getBoundariesByDistrictName(bdary, name);
        if(boundaries.length){
            for (let i = 0; i < boundaries.length; i++) {
              var ply = new BMap.Polygon(boundaries[i],{
                  strokeWeight: 1, //边框宽度
                  trokeColor: '#014F99', //边框颜色#7d0000
                  fillColor: ' #7d0000' //填充颜色
                }); //建立多边形覆盖物
              this.map.addOverlay(ply);  //添加覆盖物
              pointArray = pointArray.concat(ply.getPath());
              this.map.setViewport(pointArray);
            }
        }
      };
    },

    /**
     * 获取城市边界
     */
    getBoundariesByDistrictName(bdary, name){
        return new Promise((resolve, reject)=>{
          bdary.get(name, (rs)=>{
            resolve(rs.boundaries);
          })
        })
    },

    getBoundary() {
      // addDistrict("辽宁省");
      this.addDistrict('中国')
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
    handleChnageOperationStatus(value) {
      this.selectedOperationStatus = value
    },
    //  获取战区名字
    getWarzoneName(val){
      if(val){
          // 获取战区名字
          this.regionOptions.map(item => {
              if(item.id === val) {
                  this.warZoneVal = item.name
              }
          })
      } else [
          this.warZoneVal=''
      ]
    },

    /**
     * 处理选择战区
     */
    handleSelectRegion(val) {
      this.provinceOptions = []
      this.cityOptions = []
      this.selectedProvinceId = ''
      this.selectedCityId = ''
      if(val){
        this.getProvinceOptions().then(()=>{
          const provinces = this.provinceOptions.map(item=>item.name);
          this.drawRegion(provinces);
        })
      }
    },

    handleSelectProvince(val) {
      this.cityOptions = []
      this.selectedCityId = ''
      if(val){
        this.getCityOptions()
        const provinceName = this.findDistrictNameById(this.provinceOptions,val);
        this.drawRegion([provinceName]);
      }
    },

    handleSelectCity(val) {
      const cityName = this.findDistrictNameById(this.cityOptions,val);
      this.drawRegion([cityName]);
    },

    handleClearRegion(){
      this.map.clearOverlays();
    },

    handleClearProvince(){
      if(this.provinceOptions.length){
        const provinces = this.provinceOptions.map(item=>item.name);
        this.drawRegion(provinces);
      }
    },

    handleClearCity(){
      if(this.selectedProvinceId){
        const provinceName = this.findDistrictNameById(this.provinceOptions,val);
        this.drawRegion([provinceName]);
      }
    },
    // 基础信息分页
    handlePageChange(page, pageSize) {
      this.pageSetting.pgae = page;
      this.pageSetting.pageSize = pageSize;
      this.getBasicInfoList();
    },
    // 人员信息分页
    userHandlePageChange(page, pageSize) {
        this.userPageSetting.pgae = page;
        this.userPageSetting.pageSize = pageSize;
        this.getUserList();
    },
    // 运营信息分页
    operateHandlePageChange(page, pageSize) {
        this.operatePageSetting.pgae = page;
        this.operatePageSetting.pageSize = pageSize;
        this.getOperationsList();
    },
  },
  components: {
    distrBasicTable,
    qwTab,
    page,
    noData,operationDataTable,userTable
  }
}
</script>

<style lang="less">
@import url('./css/index.less');
</style>
