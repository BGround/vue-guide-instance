<template>
  <div class="search-wrap">
    <div class="form-wrapper">
      <el-form ref="searchForm" :model="form" label-width="110px">
        <el-row>

          <el-col :span="6">
            <el-form-item prop="warZoneId" label="战区">
              <el-select v-model="form.warZoneId"
                :style="{ width: '100%' }"
                @change="handleChangeWarZone"
                clearable
                placeholder="请选择">
                <el-option v-for="(item, index) in warZoneOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
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
                @change="handleChangeDistrict"
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
        </el-row>

        <el-row>
          <!-- <el-col :span="8">
            <el-form-item prop="pointType" label="规划类型">
              <el-select
                @change="handleChagePointType"
                v-model="form.pointType"
                clearable
                :style="{ width: '100%' }"
                placeholder="规划类型"
              >
                <el-option
                  v-for="item in pointTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="6">
            <el-form-item prop="pointRunStatus" label="服务网点状态">
              <el-select
                @change="handleChagePointRunStatus"
                v-model="form.pointRunStatus"
                clearable
                :style="{ width: '100%' }"
                placeholder="服务网点状态"
              >
                <el-option
                  v-for="item in pointRunStatusOptions"
                  :key="item.value"
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
  getProvince,
  getAreaListByProvinceNameAndCityName,
  getCity,
  searchDepatmentList
} from "@/module/channelManagement/api/getData";
import searchPonitForm from "@/module/channelManagement/components/planningInfo/searchPonitForm";
export default {
  data() {
    return {
       warZoneOptions: [],
      provinceOptions: [],
      cityOptions: [],
      districtOptions: [],
      pointRunStatusOptions: [

                {
          label: "正常",
          value: "正常"
        },
        {
          label: "暂停",
          value: "暂停"
        },
        {
          label: "撤消",
          value: "撤消"
        },
        {
          label: "过渡-开业前过渡",
          value: "过渡-开业前过渡"
        },
      ],
      pointTypeOptions: [
        // {
        //   label: "正常",
        //   value: "正常"
        // },
        // {
        //   label: "暂停",
        //   value: "暂停"
        // },
        // {
        //   label: "撤消",
        //   value: "撤消"
        // },
        // {
        //   label: "过渡-开业前过渡",
        //   value: "过渡-开业前过渡"
        // },
      ],
      form: {
        provinceId: "",
        cityId: "",
        areaId: "",
        pointType: "",
        pointRunStatus: "",
        warZoneId: "",
      }
    };

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
      searchDepatmentList({id:warZoneId}).then(data => {
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
      return searchDepatmentList({ id:provinceId }).then(data => {
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

    handleChangeDistrict(value){
      this.form.areaId = value;
      this.$nextTick(() => {
        const form = this.normalizeForm();
        this.$emit("change",form );
      });
    },

   normalizeForm(){
      const city = this.cityOptions.find(
        item => item.value === this.form.cityId
      )
      const province = this.provinceOptions.find(
        item => item.value === this.form.provinceId
      )
      const form = {
        provinceName: province && province.label ?  province.label : '',
        cityName: city && city.label ?  city.label : ''
      };
      const {provinceId ,cityId, ...fileds } = this.form;
      return Object.assign({}, fileds, form)

    },

    handleChagePointRunStatus() {
      this.$nextTick(() => {
        this.$emit("change", this.normalizeForm());
      });
    },

    handleChagePointType() {
      this.$nextTick(() => {
        this.$emit("change", this.normalizeForm());
      });
    },

    handleReset() {
      this.$refs["searchForm"].resetFields();
      this.$emit("reset", this.normalizeForm());
    },

    handleSunbmit() {
      this.$emit("submit", this.normalizeForm());
    }
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
};
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
