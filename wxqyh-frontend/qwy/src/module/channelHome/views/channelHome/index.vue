<template>
  <div class="channelhWrap">
    <!-- 搜索 start -->
    <div class="searchWrap">
      <div class="searchInfo">
        <el-input
          placeholder="输入城市，ERP号，经销商简称"
          prefix-icon="el-icon-search"
          @keyup.enter.native="goArchiveBagFun"
          v-model="sForm.keyWord">
        </el-input>
      </div>
    </div>
    <div class="searchList">
      <ul>
        <li>
          <div class="sItemLabel">运营状态：</div>
          <div class="sItemCon">
            <label v-for="(item,index) in statusList" :key="index"><input type="radio" @click="statusFun(item.value)"
                v-model="sForm.status"
                name="status"
                :value="item.value"> {{item.name}}</label>
          </div>
        </li>
        <li>
          <div class="sItemLabel">战&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;区：</div>
          <div class="sItemCon">
            <label v-for="(item,index) in departmentList" :key="index" @change="deptChangeFun(item.id)"><input type="radio" @click="warZoneFun(item.id)"
                v-model="selectVal"
                name="department"
                :value="item.id">
              {{item.name}}</label>
          </div>
        </li>
        <li>
          <div class="sItemLabel">省&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：</div>
          <div class="sItemCon cityCon">
            <label v-for="(item,index) in provinceList" :key="index" @change="provinChangeFun(item.id)"><input type="radio" @click="provinceFun(item.id)"
                v-model="provinceVal"
                name="province"
                :value="item.id"> {{item.name}}</label>
          </div>
        </li>
        <li>
          <div class="sItemLabel">城&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;市：</div>
          <div class="sItemCon cityCon">
            <label v-for="(item,index) in cityList" :key="index" @change="cityChangeFun(item.id)"><input type="radio" @click="cityFun(item.id)"
                v-model="cityVal"
                name="city"
                :value="item.id"> {{item.name}}</label>
          </div>
        </li>
      </ul>
    </div>
    <div class="btnWrap">
      <qwuiButton type='danger'
        @click="goArchiveBagFun">查询经销商档案</qwuiButton>
    </div>
    <!-- 搜索 end -->
  </div>
</template>

<script>
import {ajaxSearchDepatmentList} from '../../api/getData'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
export default {
  data() {
    return { baseURL:_.baseURL,searchTitle: '', selectVal: '', departmentList:[],provinceList:[],provinceVal:'',cityList:[],cityVal:'',
      form:{
        id:''
      },
      statusList:[{name:'正常运营',value:'1'},{name:'经营异常',value:'2'},{name:'退网经销商',value:'3'}],
      statusVal:[],
      sForm:{
          status:'' , // 状态：1、正常运营2、经营异常3、退网经销商；默认空，全部（参数：数字）
          departmentId:'', // 战区/省份/市区的ID，全国为空（参数：ID）
          keyWord: ''
      }
    }
  },
    created(){
      this.getDepatmentList()
    },
  methods: {
      // 状态取消选择
      statusFun(val){
          if(val === this.sForm.status) {
              this.sForm.status = ''
          }
      },
      // 战区取消选择
      warZoneFun(val){
          if(val === this.selectVal) {
              this.selectVal = ''
              this.provinceVal = ''
              this.cityVal = ''
          }
      },
      // 省份取消选择
      provinceFun(val){
        if(val === this.provinceVal){
            this.provinceVal = ''
            this.cityVal = ''
        }
      },
      // 城市取消选择
      cityFun(val){
          if(val === this.cityVal){
              this.cityVal = ''
          }
      },
      // 获取战区
      getDepatmentList(){
          ajaxSearchDepatmentList(this.form, data => {
              if(data && data.departmentList) {
                  this.departmentList = data.departmentList
              }
          })
      },
      // 战区变化获取省份
      deptChangeFun(id){
          if(id){
            this.sForm.departmentId = id
            let params = {id:id}
            ajaxSearchDepatmentList(params, data => {
                if(data && data.departmentList) {
                  this.provinceList = data.departmentList
                  this.provinceVal = ''
                  this.cityList = []
                  this.cityVal = ''
                }
            })
          } else {
            this.provinceList = []
            this.provinceVal = ''
            if(this.selectVal){
                this.sForm.departmentId = this.selectVal
            } else {
                this.sForm.departmentId = ''
            }
          }
      },
      // 省份变化获取城市
      provinChangeFun(id){
          if(id){
          this.sForm.departmentId = id
          let params = {id:id}
          ajaxSearchDepatmentList(params, data => {
              if(data && data.departmentList) {
                  this.cityList = data.departmentList
              }
          })
          } else {
              this.cityList = []
              this.cityVal = ''
              if(this.selectVal){
                  this.sForm.departmentId = this.selectVal
              } else {
                  this.sForm.departmentId = ''
              }
          }
      },
      // 城市变化
      cityChangeFun(id){
          if(id){
              this.sForm.departmentId = id
          } else {
              if(this.provinceVal){
                  this.sForm.departmentId = this.provinceVal
              } else if(this.selectVal){
                  this.sForm.departmentId = this.selectVal
              } else{
                  this.sForm.departmentId = ''
              }
          }
      },
      // 跳转到档案袋
      goArchiveBagFun() {
          const regionId = this.selectVal || '';
          const provinceId = this.provinceVal ||'';
          const cityId = this.cityVal ||'';
          window.location.href = this.baseURL +  `/vm/module/distributorArchives.html#/archivesList/index?status=${this.sForm.status}&regionId=${regionId}&provinceId=${provinceId}&cityId=${cityId}&keyWord=${this.sForm.keyWord}`
          // window.location.href = `/vm/module/distributorArchives.html#/archivesList/index?status=${this.sForm.status}&regionId=${regionId}&provinceId=${provinceId}&cityId=${cityId}&keyWord=${this.sForm.keyWord}`
      }
  },
  components: {
    qwuiButton
  }
}
</script>

<style lang="less">
@import url('./css/index.less');
</style>
