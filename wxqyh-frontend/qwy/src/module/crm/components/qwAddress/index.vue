<!-- 
 <qw-address v-model="address"></qw-address>
 address 格式
 {
   province: {
    name: "天津市",code:""
   },
   city: {
    name: "天津市",code:""
   },
   county: {
    name: "和平区",code:""
   },
   other:""
 }
 初始化默认值时， code、name 填一项即可，优先拿code
 -->

<template>
  <div class="qw-address">
    <div class="address-province">
      <qw-select v-model="selectedProvince"
                 placeholder="省">
        <qw-option v-for="(item, index) in provinces"
                   :key="index"
                   :label="item.value"
                   :value="item.id"></qw-option>
      </qw-select>
    </div>
    <div class="address-other"
         v-if="selectedProvince=='35'">
      <qwui-input inputType="base"
                  v-model="other"
                  inputTips="请输入"></qwui-input>

    </div>
    <template v-else>
      <div class="address-city"
           v-show="selectedProvince">
        <qw-select v-model="selectedCity"
                   placeholder="市">
          <qw-option v-for="(item, index) in citys"
                     :key="index"
                     :label="item.value"
                     :value="item.id"></qw-option>
        </qw-select>
      </div>
      <div class="address-county"
           v-show="selectedCity">
        <qw-select v-model="selectedCounty"
                   placeholder="区">
          <qw-option v-for="(item, index) in countys"
                     :key="index"
                     :label="item.value"
                     :value="item.id"></qw-option>
        </qw-select>
      </div>
    </template>

  </div>
</template>

<script>
import { provinces, citys, countys } from "./data";
import QwuiInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import { qwOption, qwSelect } from "crm/components/qwSelect";
export default {
  name: "qwAddress",
  props: ["value"],
  components: {
    QwuiInput,
    qwOption,
    qwSelect
  },
  data() {
    return {
      provinces: provinces,
      selectedProvince: "",
      selectedCity: "",
      selectedCounty: "",
      other: ""
    };
  },
  computed: {
    citys() {
      let _citys = citys.filter(item => {
        return item.parentId === this.selectedProvince;
      });
      if (
        !_citys.some(item => {
          return item.id === this.selectedCity;
        })
      ) {
        this.selectedCity = "";
      }
      return _citys;
    },
    countys() {
      let _countys = countys.filter(item => {
        return item.parentId === this.selectedCity;
      });
      if (
        !_countys.some(item => {
          return item.id === this.selectedCounty;
        })
      ) {
        this.selectedCounty = "";
      }
      return _countys;
    }
  },
  watch: {
    selectedProvince(val) {
      if (val != "35" && this.other) {
        this.other = "";
      }
      this.change();
    },
    selectedCity() {
      this.change();
    },
    selectedCounty() {
      this.change();
    },
    other() {
      this.change();
    },
    value: {
      handler(val) {
        this.setAddress(val);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getProvince(code = this.selectedProvince) {
      if (!code) {
        return null;
      }
      return (
        this.provinces.find(item => {
          return item.id === code;
        }) || null
      );
    },
    getCity(code = this.selectedCity) {
      if (!code) {
        return null;
      }
      return (
        this.citys.find(item => {
          return item.id === code;
        }) || null
      );
    },
    getCounty(code = this.selectedCounty) {
      if (!code) {
        return null;
      }
      return (
        this.countys.find(item => {
          return item.id === code;
        }) || null
      );
    },
    setAddress(obj) {
      if (obj.province) {
        this.selectedProvince =
          obj.province.id ||
          this.getCodeByName(obj.province.name, "province") ||
          "";
      }
      if (obj.city) {
        this.selectedCity =
          obj.city.id ||
          this.getCodeByName(obj.city.name, "city", this.selectedProvince) ||
          "";
      }
      if (obj.county) {
        this.selectedCounty =
          obj.county.id ||
          this.getCodeByName(obj.county.name, "county", this.selectedCity) ||
          "";
      }
      this.other = obj.other || "";
    },
    change() {
      this.$emit("input", {
        province: this.getProvince(),
        city: this.getCity(),
        county: this.getCounty(),
        other: this.other
      });
    },
    getCodeByName(name, type, parentId) {
      let obj = { provinces, citys, countys };
      if (!["province", "city", "county"].includes(type)) {
        return;
      }
      let data =
        obj[type + "s"].find(item => {
          return parentId
            ? parentId === item.parentId && item.value === name
            : item.value === name;
        }) || {};
      return data.id;
    }
  }
};
</script>
<style lang="scss" scoped>
.qw-address {
  display: flex;
  > div {
    margin: 5px 10px 5px 0;
  }
}
</style>

