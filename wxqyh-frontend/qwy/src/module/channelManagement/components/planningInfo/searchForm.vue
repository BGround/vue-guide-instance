<template>
  <div class="search-wrap">
    <div class="form-wrapper">
      <el-form ref="searchForm" :model="form" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item prop="warZoneId" label="战区">
              <el-select
                :style="{ width: '100%' }"
                v-model="form.warZoneId"
                @change="handleChangeWarZone"
                clearable
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
          </el-col>

          <el-col :span="6">
            <el-form-item prop="provinceId" label="省份">
              <el-select
                v-model="form.provinceId"
                clearable
                :style="{ width: '100%' }"
                @change="handleChangeProvince"
                placeholder="请选择省份"
              >
                <el-option
                  v-for="(item, index) in provinceOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item prop="cityId" label="城市">
              <el-select
                v-model="form.cityId"
                clearable
                @change="handleChangeCity"
                :style="{ width: '100%' }"
                placeholder="请选择城市"
              >
                <el-option
                  v-for="item in cityOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="areaId" label="区县">
              <el-select
                v-model="form.areaId"
                clearable
                :style="{ width: '100%' }"
                placeholder="请选择区县"
              >
                <el-option
                  v-for="item in districtOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6"></el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="网点数">
              <el-col :span="11">
                <el-form-item prop="pointCountOfMin">
                  <el-input v-model="form.pointCountOfMin"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="pointCountOfMax">
                  <el-input v-model="form.pointCountOfMax"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="6">
            <el-form-item label="保有量">
              <el-col :span="11">
                <el-form-item prop="quantityOfMin">
                  <el-input v-model="form.quantityOfMin"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="quantityOfMax">
                  <el-input v-model="form.quantityOfMax"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col> -->

          <el-col :span="6">
            <el-form-item label="公里数">
              <el-col :span="11">
                <el-form-item prop="mileageOfMin">
                  <el-input v-model="form.mileageOfMin"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="mileageOfMax">
                  <el-input v-model="form.mileageOfMax"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="上牌量">
              <el-col :span="11">
                <el-form-item prop="numberOfCardsOfMin">
                  <el-input v-model="form.numberOfCardsOfMin"></el-input>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="numberOfCardsOfMax">
                  <el-input v-model="form.numberOfCardsOfMax"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item prop="quantityRating" label="保有量">
              <el-select
                :style="{ width: '100%' }"
                v-model="form.quantityRating"
                @change="handleChangeQuantity"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in quantityOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item prop="distanceClassification" label="距离分级">
              <el-select
                :style="{ width: '100%' }"
                v-model="form.distanceClassification"
                @change="handleChangeDistance"
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in distanceOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="search-footer">
      <input
        class="search-btn search-btn-default"
        type="button"
        value="清空"
        @click="handleReset"
      />
      <input
        class="search-btn search-btn-confirm"
        type="button"
        value="查询"
        @click="handleSunbmit"
      />
    </div>
  </div>
</template>

<script>
import {
  searchDepatmentList,
  getProvince,
  getAreaListByProvinceNameAndCityName,
  getCity
} from '@/module/channelManagement/api/getData'
export default {
  data() {
    return {
      warZoneOptions: [],
      provinceOptions: [],
      cityOptions: [],
      districtOptions: [],
      quantityOptions: [
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
      form: {
        warZoneId: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        pointCountOfMin: '',
        pointCountOfMax: '',
        mileageOfMin: '', // 公里
        mileageOfMax: '',
        numberOfCardsOfMin: '',
        numberOfCardsOfMax: '',
        distanceClassification: '',
        quantityRating: '',
      }
    }
  },
  methods: {
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
      searchDepatmentList({ id: warZoneId }).then(data => {
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
      if (cityId) {
        this.fetchDistrictOptions()
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

    fetchDistrictOptions() {
      const city = this.cityOptions.find(
        item => item.value === this.form.cityId
      )
      const province = this.provinceOptions.find(
        item => item.value === this.form.provinceId
      )
      if (city && city.label && province && province.label) {
        // 请求区域
      }
      getAreaListByProvinceNameAndCityName({ provinceName: province.label, cityName: city.label }).then(data => {
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

    handleReset() {
      this.$refs['searchForm'].resetFields()
      this.$emit('reset', Object.assign({}, this.form))
    },

    handleSunbmit() {
      this.$emit('submit', Object.assign({}, this.form))
    },

    handleChangeQuantity(){

    },

    handleChangeDistance(){

    },
  },
  created() {
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
  }
}
</script>

<style lang="scss" scoped>
.search-wrap {
  position: relative;
  border: 1px #ccc solid;
  background-color: #fff;
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
        border: 1px #f87b00 solid;
        background-color: #C31725;
        &:hover {
          background-color: #ffa500;
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
      .el-select__caret {
        .el-input__icon {
          .el-icon-circle-close {
            line-height: 42px;
          }
        }
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
</style>
