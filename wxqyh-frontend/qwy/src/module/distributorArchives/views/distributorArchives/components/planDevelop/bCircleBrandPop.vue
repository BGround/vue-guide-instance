<template>
  <div class="businessBrandWrap">
    <!-- 商圈信息-各品牌网络规划 -->
    <div class="mask"></div>
    <div class="popInfo">
      <div class="titWrap mb10">
        <h4>各品牌网络规划</h4>
      </div>
      <table>
        <tr>
          <th>品牌</th>
          <th>{{yearTit}}</th>
          <th>{{yearTit-1}}</th>
          <th>{{yearTit-2}}</th>
          <th>{{yearTit-3}}</th>
          <th>{{yearTit-4}}</th>
        </tr>
        <tr v-for="(item,index) in dataSource"
          :key="index">
          <td>{{item.brandName}}</td>
          <td>{{item.old}}</td>
          <td>{{item.old_first_quarter?item.old_first_quarter:0}}</td>
          <td>{{item.old_second_quarter?item.old_second_quarter:0}}</td>
          <td>{{item.old_third_quarter?item.old_third_quarter:0}}</td>
          <td>{{item.old_fourth_quarter?item.old_fourth_quarter:0}}</td>
        </tr>
        <tr v-if="dataSource && dataSource.length===0"><td colspan="6">暂无数据</td></tr>
      </table>

      <!--    关闭 -->
      <div class="closeBtn">
        <qwuiButton type="danger"
          @click="closePop">关闭</qwuiButton>
      </div>
    </div>
  </div>
</template>

<script>
import page from '@/components/list/page'
import { ajaxGetTradingAreaAll } from '../../../../api/getData'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
export default {
  data() {
    return {
      pageSetting: { page: 1, pageSize: 10, maxPage: 5, totalRows: 10 },
      dataSource: [],
      yearTit: '',
      form: {
        year: '',
        province:'',
        city:''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.form.province = this.$route.query.province
      this.form.city = this.$route.query.city
      this.getCurrentYear()
      setTimeout(() => {
        this.getAllInfo()
      }, 100)
    },
    getCurrentYear() {
      let today = new Date()
      let year = today.getFullYear()
      this.form.year = year
      this.yearTit = parseInt(year)
    },
    // 获取表信息
    getAllInfo() {
      ajaxGetTradingAreaAll(this.form, data => {
        this.dataSource = data
      })
    },
    // 关闭
    closePop() {
      this.$emit('closeBrandMoreFun', '')
    },
    // 分页
    pageChange() {}
  },
  components: {
    page,
    qwuiButton
  }
}
</script>
