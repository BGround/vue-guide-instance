<template>
  <div class="list">
    <div class="container">
      <category  :categoryData="categoryData" :pagedata="list"></category>
      <div v-if="list.isHideCategory" class="c999 mt10">共有<span class="orange fz16">{{list.totalRows}}</span>门包含"{{list.param.subjectName}}"的课程</div>
      <order :pagedata="list"></order>
      <ul class="courseList pt30 clearfix" v-show="list.pageData.length!=0">
        <course-card :coursedata="item" v-for="item in list.pageData" :key="item.id"></course-card>
      </ul>
      <page :pageData="pageData" v-show="list.pageData.length!=0" @change="changeData"></page>
      <no-data v-if="list.pageData.length==0"></no-data>

    </div>
    <inner-footer></inner-footer>
  </div> 
</template>

<script>
import courseCard from './courseCard'
import page from '@/components/list/page'
import category from '@/components/list/category'
import order from '@/components/list/order'
import noData from '@/components/list/noData'
import axios from 'axios'
import footer from '@/components/base/footer'
export default {
    name: 'app',
    components:{'course-card':courseCard,page:page,category,order,"inner-footer":footer,'no-data':noData},
    data(){
      return {
        list:dataBase.listdata,
        categoryData:dataBase.categoryData,
        pageData: {
          page: dataBase.listdata.param.page,
          pageSize: dataBase.listdata.param.pageSize,
          maxPage: dataBase.listdata.maxPage,
          totalRows: dataBase.listdata.totalRows
        }
      }
    },
    created() {
      this.getDataList()
      this.list.pageDataInit = this.getDataList
    },
    methods: {
      getDataList(page = dataBase.listdata.param.page) {
        dataBase.loading = true
        let _this = this
        _.ajax({
          url: _.baseURL + '/learnonline/subject/subjectAction!ajaxSubjectPager.action',
          type: 'POST',
          data: dataBase.listdata.param,
          success(res) {
            if(res.code == "0") {
              dataBase.loading = false
              dataBase.listdata.maxPage = res.data.maxPage
              dataBase.listdata.totalRows = res.data.totalRows
              if(!res.data.pageData) {
                res.data.pageData = []
              }
              dataBase.listdata.pageData = res.data.pageData
            } else {
              _.alert("提示",res.desc)
            }
          }
        })
      },
      changeData(page, pageSize) {
        this.list.param.page = page
        this.list.param.pageSize = pageSize
        this.getDataList()
      }
    },
    watch: {
      'list': {
        handler(val) {
          this.pageData.page = val.param.page
          this.pageData.pageSize = val.param.pageSize
          this.pageData.maxPage = val.maxPage
          this.pageData.totalRows = val.totalRows
        },
        deep: true
      },
    }
}

</script>

<style>
  .list{
    padding: 30px 0;
    background: #fff;
  }
</style>