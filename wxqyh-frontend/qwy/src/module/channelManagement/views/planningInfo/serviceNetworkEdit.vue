<template>
  <div class="service-network-edit">
    <div class="qwui-nav_wrap">
      <button
        @click="handleClickBack"
        type="button"
        class="qwui-button qwui-button-default qwui-button-normal"
      >
        <span>&nbsp;返回&nbsp;</span>
      </button>
    </div>
    <div class="qwui-title_wrap"><div class="qwui-title">编辑</div></div>

    <el-form ref="form" :model="form" label-width="160px" :rules="rules">
      <el-form-item label="年份" prop="serviceYear">
        <el-date-picker
          v-model="form.serviceYear"
          :style="{ width: '300px' }"
          type="year"
          value-format="yyyy"
          placeholder="选择年"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="月度" prop="serviceMonth">
        <el-select
          :style="{ width: '300px' }"
          class="month"
          v-model="form.serviceMonth"
          placeholder="请选"
        >
          <div slot="prefix">
            <i class="el-icon-date"></i>
          </div>
          <el-option
            v-for="item in searchMonthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="行政划分" prop="areaType">
        <el-select
          v-model="form.areaType"
          :style="{ width: '300px' }"
          placeholder="请选择行政区"
          @change="handleChangeAearType"
        >
          <el-option
            v-for="(item, index) in areaTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
            :style="{ width: '300px' }"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="warZoneId" label="战区">
        <el-select
          style="width:300px"
          v-model="form.warZoneId"
          @change="handleChangeWarZone"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in warZoneOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="省份" prop="provinceId">
        <el-select
          v-model="form.provinceId"
          :style="{ width: '300px' }"
          @change="handleChangeProvince"
          placeholder="请选择省份"
        >
          <el-option
            v-for="(item, index) in provinceOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
            :style="{ width: '300px' }"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市" prop="cityId">
        <el-select
          v-model="form.cityId"
          @change="handleChangeCity"
          placeholder="请选择城市"
          :style="{ width: '300px' }"
        >
          <el-option
            v-for="(item, index) in cityOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="区县" prop="areaId">
        <el-select
          v-model="form.areaId"
          :style="{ width: '300px' }"
          placeholder="请选择区县"
        >
          <el-option
            v-for="(item, index) in districtOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="县级距离市区公里数" prop="mileage">
        <el-input 
          :style="{ width: '300px' }" 
          v-model="form.mileage"
          @change="handleChangePlan"
          ></el-input>
      </el-form-item>

      <el-form-item label="3年累计上牌量" prop="numberOfCards">
        <el-input
          :style="{ width: '300px' }"
          v-model="form.numberOfCards"
          @change="handleChangePlan"
        ></el-input>
      </el-form-item>

      <el-form-item label="保有量分级" prop="quantityRating">
        <el-select
           v-model="form.quantityRating"
           :style="{width: '300px'}"
        >
          <el-option
            v-for="(item , index) in protectOptions"
            :key="index"
            :item="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        
      </el-form-item>

      <el-form-item label="距离分级" prop="distanceClassification">
        <el-select
          v-model="form.distanceClassification"
          :style="{width: '300px'}"
        >
          <el-option
            v-for="(item, index) in distanceOptions"
            :key="index"
            :item="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!--  <el-form-item label="网点覆盖情况">
        <a
          class="goLink"
          @click="handleClickPoint"
          v-if="parseInt(form.pointCount) > 0"
          href="JavaScript:;"
          >{{ form.pointCount }}</a
        >
        <span v-else>{{ form.pointCount }}</span>

        <el-input
          @click.native="handleClickPoint"
          :disabled="true"
          :style="{ width: '300px' }"
          v-model="form.pointCount"
        ></el-input> 
      </el-form-item>

      <el-form-item label="地级市覆盖率">
        <el-input
          :disabled="true"
          :style="{ width: '300px' }"
          v-model="form.cityCoverageRate"
        ></el-input>
      </el-form-item>

      <el-form-item label="县级市覆盖率">
        <el-input
          :disabled="true"
          :style="{ width: '300px' }"
          v-model="form.areaCoverageRate"
        ></el-input>
      </el-form-item> -->

      <el-form-item label="规划建议" prop="planningType">
        <el-input
          :disabled="true"
          :style="{ width: '300px' }"
          v-model="form.planningType"
        ></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input :style="{ width: '300px' }" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>

    <div class="qwui-line"></div>

    <div class="tcenter pb20">
      <button
        @click="handleclickSaveBtn"
        type="button"
        class="qwui-button mr10 qwui-button-primary qwui-button-normal"
      >
        <span>&nbsp;保存&nbsp;</span>
      </button>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="isVisibleDialog"
      :show-close="false"
      width="700px"
    >
      <div slot="title" class="dialog-title">
        {{ dialogTitle }}
      </div>
      <div class="network-point">
        <table>
          <tr>
            <th>网络类型</th>
            <th>服务电话</th>
            <th>简称</th>
            <th>规划建议</th>
            <th>状态</th>
          </tr>
          <tr v-for="(item, index) in networkPoints" :key="index">
            <td>{{ item.networkType }}</td>
            <td>{{ item.serviceNo }}</td>
            <td>{{ item.pointName }}</td>
            <td>{{ item.pointType }}</td>
            <td>{{ item.pointStatus }}</td>
          </tr>
        </table>
      </div>

      <span slot="footer" class="dialog-footer">
        <qwuiButton type="primary" @click="handleClickDialogCloseBtn"
          >&nbsp;关闭&nbsp;</qwuiButton
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import {
  getProvince,
  getAreaList,
  getCity,
  addOrUpdateServiceNetworkPlan,
  searchPlanPointList,
  searchDepatmentList,
  getAreaListByProvinceNameAndCityName
} from '@/module/channelManagement/api/getData'
export default {
  components: {
    qwuiButton
  },
  data() {
    return {
      form: {
        id: '',
        serviceYear: '',
        serviceMonth: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        areaName: '',
        areaId: '',
        mileage: '',
        numberOfCards: '',
        planningType: '',
        remark: '',
        pointCount: '',
        warZone: '',
        cityCoverageRate: '',
        areaCoverageRate: '',
        areaType: '',
        quantityRating: '',
        distanceClassification: ''
      },
      warZoneOptions: [],
      provinceOptions: [], //省份
      cityOptions: [], //城市
      districtOptions: [], // 区县
      areaTypeOptions: [
        {
          label: '市区',
          value: '市区'
        },
        {
          label: '县',
          value: '县'
        }
      ], // 行政区选项

      planningTypeOptions: [
        {
          label: '规划一网',
          value: '规划一网'
        },
        {
          label: '规划直营店',
          value: '规划直营店'
        },
        {
          label: '规划二网',
          value: '规划二网'
        },
        {
          label: '规划巡回服务',
          value: '规划巡回服务'
        }
      ],

      protectOptions: [
        {
          label: '≥1200',
          value: '≥1200'
        },
        {
          lable: '600-1200',
          value: '600-1200'
        },
        {
          label: '300-600',
          value: '300-600'
        },
        {
          label: '200-300',
          value: '200-300'
        },
        {
          label: '小于200',
          value: '小于200'
        }
      ],

      distanceOptions: [
        {
          label: '20-30公里',
          value: '20-30公里'
        },
        {
          label: '大于30公里',
          value: '大于30公里'
        },
        {
          label: '小于20公里',
          value: '小于20公里'
        }
      ],
      rules: {
        serviceYear: [
          { required: true, message: '请输入年度', trigger: 'change' }
        ],
        serviceMonth: [
          { required: true, message: '请输入月度', trigger: 'change' }
        ],
        provinceId: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
        areaId: [{ required: true, message: '请选择区县', trigger: 'change' }],
        mileage: [{ required: true, message: '请输公里数', trigger: 'blur' }],
        numberOfCards: [
          { required: true, message: '请输入上牌量', trigger: 'blur' }
        ],
        planningType: [
          { required: true, message: '请输入规划类型', trigger: 'blur' }
        ],
        areaType: [
          { required: true, message: '请输入行政区', trigger: 'change' }
        ],
        warZoneId: [
          { required: true, message: '请选择战区', trigger: 'change' }
        ],
        quantityRating: [
          { required: true, message: '请选择保有量', trigger: 'change'}
        ],
        distanceClassification: [
          { required: true, message: '请选择距离分级',trigger: 'change'}
        ],
      },
      dialogTitle: '网点详情',
      isVisibleDialog: false,
      networkPoints: [],
      searchMonthOptions: [
        {
          label: '01月',
          value: '1'
        },
        {
          label: '02月',
          value: '2'
        },
        {
          label: '03月',
          value: '3'
        },
        {
          label: '04月',
          value: '4'
        },
        {
          label: '05月',
          value: '5'
        },
        {
          label: '06月',
          value: '6'
        },
        {
          label: '07月',
          value: '7'
        },
        {
          label: '08月',
          value: '8'
        },
        {
          label: '10月',
          value: '9'
        },
        {
          label: '10月',
          value: '10'
        },
        {
          label: '11月',
          value: '11'
        },
        {
          label: '12月',
          value: '12'
        }
      ],
      isConfirmBack: false
    }
  },

  beforeRouteLeave(to, from, next) {

    if(!this.isChangedFormData()){
      next();
      return
    }

    if(!Object.keys(this.$route.params).length){
      next();
      return;
    }
    if(this.isConfirmBack){
      next();
      return;
    }

    next()
    // this.$refs['form'].validate(valid => {
    //   if (valid) {
    //     this.update().then(() => {
    //       _.alert('提示', '服务网点规划成功', () => {
    //         next()
    //       })
    //     })
    //   } else {
    //    dataBase.alert('提示', '服务网点规划编辑中, 请确认是否离开该页面?', ()=>{next();}, '确定', true, ()=>{next(false)}, '取消');
    //   // 弹框标题 、 弹框信息 、 确定按钮回调、确定按钮名称、是否需要显示按钮、取消按钮名称、取消按钮回调
    //   }
    // })
  },

  created() {
    const detail = this.$route.params
    if (!Object.keys(detail).length) {
      this.$router.replace({ name: 'serviceNetwork' })
    }

    searchDepatmentList().then(data => {
      if (data && Array.isArray(data.departmentList)) {
        this.warZoneOptions = data.departmentList.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        })
      }
    })

    if (detail.warZoneId) {
      this.fetchProvinceOptions(detail.warZoneId).then(() => {
        this.form.provinceId = detail.provinceId || ''
      })
    }
    if (detail.provinceId) {
      this.fetchCityOptions(detail.provinceId).then(() => {
        this.form.cityId = detail.cityId || ''
      })
    }
    if (detail.provinceName && detail.cityName) {
      this.fetchDistrictOptions(detail.provinceName, detail.cityName).then(
        () => {
          this.form.areaId = detail.areaId || ''
        }
      )
    }
    this.init(detail)
  },
  methods: {
    handleClickDialogCloseBtn() {
      this.isVisibleDialog = false
    },

    isChangedFormData(){
      const changedFileds = Object.keys(this.form).filter((key)=>{
        return this.form[key] !== this.$route.params[key]
      })
      return changedFileds.length > 0
    },

    init(detail) {
      console.log(detail)
      ;(this.form.id = detail.id || ''),
        (this.form.serviceYear = detail.serviceYear || ''),
        (this.form.provinceName = detail.provinceName || ''),
        (this.form.cityName = detail.cityName || ''),
        (this.form.areaName = detail.areaName || ''),
        (this.form.mileage = detail.mileage || ''),
        (this.form.numberOfCards = detail.numberOfCards || ''),
        (this.form.remark = detail.remark || '')
      this.form.warZoneId = detail.warZoneId || ''
      this.form.warZone = detail.warZone || ''
      this.form.planningType = detail.planningType || ''
      this.form.pointCount = detail.pointCount || 0
      this.form.serviceMonth = detail.serviceMonth || ''
      this.form.areaType = detail.areaType || ''
      this.form.areaCoverageRate = detail.areaCoverageRate || ''
      this.form.cityCoverageRate = detail.cityCoverageRate || ''
      this.form.quantityRating = detail.quantityRating || ''
      this.form.distanceClassification = detail.distanceClassification || ''
    },

    handleClickPoint() {
      if (parseInt(this.form.pointCount) > 0) {
        this.networkPoints = []
        // this.dialogTitle = item.
        searchPlanPointList({ planId: this.form.id }).then(data => {
          this.isVisibleDialog = true
          if (data && Array.isArray(data.pointList)) {
            this.networkPoints = data.pointList
          }
        })
      } else {
        _.alert('提示', '暂无服务网点')
      }
    },

    handleClickBack() {
      this.$router.back()
    },

    handleChangeAearType(value) {
      this.form.areaType = value
    },

    handleChangeWarZone(warZoneId) {
      this.provinceOptions = []
      this.cityOptions = []
      this.districtOptions = []
      this.form.provinceId = ''
      this.form.cityId = ''
      this.form.areaId = ''
      warZoneId && this.fetchProvinceOptions(warZoneId)
    },

    fetchProvinceOptions(warZoneId) {
      return searchDepatmentList({ id: warZoneId }).then(data => {
        if (data && Array.isArray(data.departmentList)) {
          this.provinceOptions = data.departmentList.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      })
    },

    handleChangeProvince(provinceId) {
      this.cityOptions = []
      this.districtOptions = []
      this.form.cityId = ''
      this.form.areaId = ''
      provinceId && this.fetchCityOptions(provinceId)
    },

    handleChangeCity(cityId) {
      this.districtOptions = []
      this.form.areaId = ''
      const city = this.cityOptions.find(
        item => item.value === this.form.cityId
      )
      const province = this.provinceOptions.find(
        item => item.value === this.form.provinceId
      )
      if (city && city.label && province && province.label) {
        this.fetchDistrictOptions(province.label, city.label)
      }
    },

    fetchCityOptions(provinceId) {
      return searchDepatmentList({ id: provinceId }).then(data => {
        if (data && Array.isArray(data.departmentList)) {
          this.cityOptions = data.departmentList.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      })
    },

    fetchDistrictOptions(provinceName, cityName) {
      return getAreaListByProvinceNameAndCityName({
        provinceName: provinceName,
        cityName: cityName
      }).then(data => {
        if (data && Array.isArray(data.areaList)) {
          this.districtOptions = data.areaList.map(item => {
            return {
              value: item.id,
              label: item.name
            }
          })
        }
      })
    },

    handleclickSaveBtn() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.update()
        } else {
          _.alert('提示', '请根据提示填写服务网点规划')
          return false
        }
      })
    },

    update() {
      this.assemblyParams()
      return addOrUpdateServiceNetworkPlan(this.form).then(data => {
        if (data) {
          _.alert('提示', '服务网点规划成功', () => {
            this.isConfirmBack = true;
            this.$router.back()
          })
        }
      })
    },

    assemblyParams() {
      const warZone = this.warZoneOptions.find(
        item => item.value === this.form.warZoneId
      )
      const province = this.provinceOptions.find(
        item => item.value === this.form.provinceId
      )
      const city = this.cityOptions.find(
        item => item.value === this.form.cityId
      )
      const distrct = this.districtOptions.find(
        item => item.value === this.form.areaId
      )
      warZone && (this.form.warZone = warZone.label)
      city && (this.form.cityName = city.label)
      province && (this.form.provinceName = province.label)
      distrct && (this.form.areaName = distrct.label)
    },

    handleChangePlan() {

      if(this.form.mileage > 30){
        if(this.form.numberOfCards >= 1200) this.form.planningType = '4S/3S'
        else if(this.form.numberOfCards > 600 && this.form.numberOfCards < 1200) 
          this.form.planningType = '服务直营店'
        else if(this.form.numberOfCards > 300 && this.form.numberOfCards <= 600) 
          this.form.planningType = '服务二网'
        else if(this.form.numberOfCards > 200 && this.form.numberOfCards <= 300) 
          this.form.planningType = '巡回服务'
      }
      else this.form.planningType = '不规划'
    }
  }
}
</script>

<style lang="scss" scoped>
.service-network-edit {
  position: relative;
  padding: 10px 30px 0;
  width: 969px;

  .goLink {
    color: #C31725;
  }

  .qwui-nav_wrap {
    padding-bottom: 15px;
  }

  .qwui-line {
    position: relative;
    height: 1px;
    background: #eee;
    margin-bottom: 20px;
  }
  .qwui-title_wrap {
    background-color: #f5f5f5;
    border-left: 4px solid #C31725;
    height: 47px;
    line-height: 47px;
    position: relative;
    margin-bottom: 20px;
  }

  .qwui-title_wrap .qwui-title {
    font-weight: 700;
    margin-left: 20px;
    color: #666;
    font-size: 16px;
  }

  .qwui-button.qwui-button-primary:hover {
    background: #F08088;
    border-color: #F08088;
  }

  .qwui-button.qwui-button-primary {
    border-color: #C31725;
    color: #fff;
    background: #c31725;
    
  }

  .qwui-button {
    display: inline-block;
    line-height: 1;
    padding: 8px 15px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #fff;
    color: #333;
  }

  position: relative;
  // border: 1px #ccc solid;
  // background-color: #fff;
  .form-wrapper {
    padding: 20px 20px 0;
  }
  .search-footer {
    margin-top: 10px;
    padding: 5px 20px;
    text-align: right;
    background-color: #f5f5f5;
    .search-btn {
      display: inline-block;
      padding: 0 16px;
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      border-radius: 2px;
      box-sizing: border-box;
      &.search-btn-default {
        color: #333;
        border: 1px #ccc solid;
        margin-right: 16px;
        background-color: #fff;
        &:hover {
          background-color: #f7f7f7;
        }
      }
      &.search-btn-confirm {
        color: #fff;
        border: 1px #C31725 solid;
        background-color: #c31725;
        &:hover {
          background-color: #F08088;
        }
      }
    }
  }
  .line {
    text-align: center;
  }
  /deep/ {
    .el-select {
      width: 120px;
      .el-input.is-focus {
        .el-input__inner {
          border-color: #ccc;
        }
      }
      .el-input__inner:focus {
        border-color: #ccc;
      }

      .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
      .el-input__icon {
        line-height: 40px;
      }
    }
    .el-input {
      .el-input__inner {
        line-height: 32px;
        height: 32px;
      }
      .el-input__icon {
        line-height: 40px;
      }
      &.is-active .el-input__inner,
      .el-input__inner:focus {
        border-color: #ccc;
      }
    }
    .el-input--prefix .el-input__inner {
      padding-left: 39px;
    }
    .el-date-editor--month {
      .el-input__inner {
        padding-left: 43px;
      }
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 130px;
    }
  }
}
/deep/ {
  .el-dialog__body {
    padding: 20px;
  }
  .el-dialog__header {
    padding: 15px;
    background: rgba(242, 242, 242, 1);
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-select.month {
    .el-icon-date {
      line-height: 32px;
      width: 25px;
    }
  }
}
.network-point {
  table {
    width: 100%;
    text-align: center;
    th {
      border: 1px solid rgba(121, 121, 121, 1);
      line-height: 30px;
      width: 20%;
    }
    td {
      border: 1px solid rgba(121, 121, 121, 1);
      line-height: 30px;
      width: 20%;
    }
  }
}
</style>
