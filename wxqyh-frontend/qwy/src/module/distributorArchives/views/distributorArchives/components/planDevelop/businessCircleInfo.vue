<template>
  <div>
    <!-- 商圈信息 -->
    <div class="subTit">
      <p> · 各品牌网络规划</p>
      <a href="javascript:;"
        @click="openBrandMoreFun">查看更多 ></a>
    </div>

    <table v-if="tabTitList && tabTitList.length>0">
      <tr>
        <th>品牌</th>
        <th v-for="(item,index) in tabTitList"
          :key="index">{{item}}</th>
      </tr>
      <tr v-for="(item,index) in brandTabList"
        :key="index">
        <td>{{item.brandName}}</td>
        <td>{{item.old}}</td>
        <td>{{item.current}}</td>
        <td>{{item.current_first_quarter}}<i v-if="item.old_first_quarter < item.current_first_quarter"
            class="up">&#8593;</i><i v-else-if="item.old_first_quarter > item.current_first_quarter"
            class="down">&#8595;</i><i v-else
            class="up">-</i></td>
        <td>{{item.current_second_quarter}}<i v-if="item.old_second_quarter < item.current_second_quarter"
            class="up">&#8593;</i><i v-else-if="item.old_second_quarter > item.current_second_quarter"
            class="down">&#8595;</i><i v-else
            class="up">-</i></td>
        <td>{{item.current_third_quarter}}<i v-if="item.old_third_quarter < item.current_third_quarter"
            class="up">&#8593;</i><i v-else-if="item.old_third_quarter > item.current_third_quarter"
            class="down">&#8595;</i><i v-else
            class="up">-</i></td>
        <td>{{item.current_fourth_quarter}}<i v-if="item.old_fourth_quarter < item.current_fourth_quarter"
            class="up">&#8593;</i><i v-else-if="item.old_fourth_quarter > item.current_fourth_quarter"
            class="down">&#8595;</i><i v-else
            class="up">-</i></td>
      </tr>
      <tr v-if="brandTabList.length===0">
        <td :colspan="tabTitList.length+1">暂无数据</td>
      </tr>
    </table>

    <div class="totalWrap" v-if="brandTabList.length>0">
      <stack-bar-chart :columns="brandTabList" :tabTitList="tabTitList"></stack-bar-chart>
      <div class="circleChart"
        id="circleChart"></div>
    </div>

    <div class="subTit">
      <p> · 商圈地图</p>
      <!--      <a href="javascript:;">查看更多 ></a>-->
    </div>
    <div class="tradMap">
      <div class="tradLeft">
        <div class="tItem first">
          <span class="tLabel">城市</span>
          <div class="tValue">
            <select v-model="city.provinceVal"
              @change="provsChangeFun">
              <option value=""
                selected
                disabled
                style="display: none;">--请选择省--</option>
                <option v-for="(item,index) in city.provinceList"
                      :key="index"
                      :value="item.province">{{item.province}}</option>
            </select>
            <select v-model="city.cityVal"
              placeholder="请选择市"
              @change="cityChangeFun">
              <option value=""
                selected
                disabled
                style="display: none;">--请选择市--</option>
              <option v-for="(item,index) in city.cityList"
                      :key="index"
                      :value="item.city">{{item.city}}</option>
            </select>
          </div>
        </div>
        <div class="tItem">
          <span class="tLabel">商圈介绍</span>
          <div class="tValue">
            <textarea v-model="mapData.infoPO.tradingDesc" readonly></textarea>
          </div>
        </div>
      </div>
      <div class="tradRight">
        <img :src="mapData.infoPO.enclosure?mapData.infoPO.enclosure:defaultUrl" />
      </div>
    </div>
    <table>
      <tr>
        <th width="9%">商圈序号</th>
        <th width="9%">商圈名称</th>
        <th width="9%">商圈地址</th>
        <th width="9%">商圈销量占比</th>
<!--        <th width="9%">一网进驻品牌</th>-->
        <th width="9%">一网进驻品牌数</th>
<!--        <th width="9%">二网进驻品牌</th>-->
        <th width="9%">二网进驻品牌数</th>
<!--        <th width="9%">进驻品牌总数</th>-->
        <th width="9%">奇瑞一网</th>
        <th width="9%">奇瑞城市展厅</th>
      </tr>
      <tr v-for="(item,index) in mapData.detailPOList"
        :key="index">
        <td>{{item.tradingId}}</td>
        <td>{{item.tradingName}}</td>
        <td>{{item.tradingAddress}}</td>
        <td>{{item.sales}}%</td>
        <td>
          <el-popover
            placement="right"
            title="一网进驻品牌:"
            width="300"
            name
            slot="content"
            trigger="click">
            <slot name="content">{{item.oneGarrisonBrand || '-'}}</slot>
            <el-button slot="reference" type="text">{{item.garrisonOneNum || 0}}</el-button>
          </el-popover>
        </td>
        <td>
          <el-popover
            placement="right"
            title="二网进驻品牌:"
            width="300"
            name
            slot="content"
            trigger="click">
            <slot name="content">{{item.twoGarrisonBrand || '-'}}</slot>
            <el-button slot="reference" type="text">{{item.garrisonTwoNum || 0}}</el-button>
          </el-popover>
        </td>
        <td>{{item.oneEnt}}</td>
        <td>{{item.cityShowroom}}</td>
      </tr>
      <tr v-if="mapData.detailPOList && mapData.detailPOList.length===0"><td colspan="8">暂无数据</td></tr>
    </table>

    <!-- 品牌网络规划更多弹框 start -->
    <bCircleBrandPop v-if="isShowBrandMore"
      @closeBrandMoreFun="closeBrandMoreFun"></bCircleBrandPop>
    <!-- 品牌网络规划更多弹框 end -->
  </div>
</template>

<script>
import bCircleBrandPop from './bCircleBrandPop'
import stackBarChart from "./stackBarChart";
import {
  ajaxGetTradingArea,
  ajaxGetTradingAreaTable,
  ajaxGetTradingInfo,ajaxGetProvince,ajaxGetCity
} from '../../../../api/getData'
import { Provinces, Citys } from '../unit/province'
export default {
  data() {
    return {
      defaultUrl:require('@/assets/images/default/default.png'),
      isShowBrandMore: false,
      curprovince:'',
      curcity:'',
      city: {
        provinceVal: '',
        cityVal: '',
        // provinceList: Provinces,
        provinceList:[],
        cityList: []
      },
      tabTitList: [],
      brandTabList: [],
      mapData: { infoPO: { tradingDesc: '',enclosure:'' }, detailPOList: [] },
      form: {
        year: '2019'
      },
      mapForm: {
        province: '北京',
        city: '北京'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let province = this.$route.query.province || '北京'
      let city = this.$route.query.city || '北京'
      this.city.provinceVal = province
      this.curprovince = province
      this.curcity = city
      if(this.city.provinceVal){
          this.getCity(this.city.provinceVal)
          this.city.cityVal = city
      }
      this.city.cityVal = city
      this.mapForm.province = province
      this.mapForm.city = city
      this.getProvince()
      this.getCurrentYear()
      this.getTradingArea()
      this.getTradingAreaTable()
      this.getTradingMapInfo()
    },
    // 获取省份
    getProvince(){
        let params = {
            pid:''
        }
        ajaxGetProvince(params,data => {
            if(data && data.provinceData){
              this.city.provinceList = data.provinceData
            }
        })
    },
    // 获取城市
    getCity(id){
      let params ={
          pid:id
      }
      ajaxGetCity(params,data =>{
        if(data && data.cityList){
          this.city.cityList = data.cityList
        }
      })
    },
    getCurrentYear() {
      let today = new Date()
      let year = today.getFullYear()
      this.form.year = year
    },
    // 查看更多
    openBrandMoreFun() {
      this.isShowBrandMore = true
    },
    // 关闭
    closeBrandMoreFun() {
      this.isShowBrandMore = false
    },
    // 获取商圈信息
    getTradingArea() {
        let params = this.form
        params.province = this.curprovince
        params.city = this.curcity
        ajaxGetTradingArea(params, data => {
          this.brandTabList = data
        })
    },
    // 获取商圈表头
    getTradingAreaTable() {
      ajaxGetTradingAreaTable(this.form, data => {
        let temp = []
        temp.push(
          data[0].year,
          data[5].year,
          data[6].year.replace(':', 'Q'),
          data[7].year.replace(':', 'Q'),
          data[8].year.replace(':', 'Q'),
          data[9].year.replace(':', 'Q')
        )
        this.tabTitList = temp
      })
    },
    // 获取商圈地图信息
    getTradingMapInfo() {
      this.mapForm.province = this.city.provinceVal
      this.mapForm.city = this.city.cityVal
      let self = this
      ajaxGetTradingInfo(this.mapForm, data => {
          if(data && data.infoPO){
            let temp = data
            if(data.infoPO.enclosure) {
                temp.infoPO.enclosure =  _.compressURL+data.infoPO.enclosure
            }

            self.mapData = temp
          } else {
              self.mapData = { infoPO: { tradingDesc: '',enclosure:'' }, detailPOList: [] }
          }
      })
    },
    // 省变化
    provsChangeFun() {
      // 清空原数据
      this.mapForm.city = ''
      this.city.cityVal = ''
      this.city.cityList = []
      this.getCity(this.city.provinceVal)
    },
    // 市变化
    cityChangeFun() {
      this.mapForm.city = this.city.cityVal
      this.getTradingMapInfo()
    },
  },
  components: {
    bCircleBrandPop,stackBarChart
  },
  filters: {
      filterSum(one,two){
          let [txt1,txt2] = [0,0]
          if(one) {
            txt1 = one
          }
          if(two) {
              txt2 = two
          }
          return txt1 + txt2
      }
  }
}
</script>
