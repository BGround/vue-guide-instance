<template>
  <div class="cityHistoryWrap">
    <div class="mask"></div>
    <div class="popInfo">
      <div class="scrollWrap">
        <div class="titWrap mb10">
          <h4>分月市占率</h4>
        </div>
        <div class="searchWrap">
          <vue-datepicker-local v-model="sdate.selectTime"
            inputClass="qwui-datetime"
            popupClass="qwui-popup"
            :local="sdate.timeLocal"
            :showButtons=true
            @confirm="chooseTime"></vue-datepicker-local>
          <qwuiButton type='danger'>查询</qwuiButton>
        </div>
        <table>
          <tr>
            <th>变更时间</th>
            <th>变更内容</th>
            <th>现信息</th>
            <th>变更前信息</th>
          </tr>
          <tr>
            <td>2005年2月15日</td>
            <td>股本变更</td>
            <td>股东1：张三</td>
            <td>股东1：张三 </td>
          </tr>
          <tr>
            <td>2005年2月15日</td>
            <td>股本变更</td>
            <td>张三：投入金额5万</td>
            <td>张三：投入金额5万</td>
          </tr>
        </table>
      </div>
      <div class="closeBtn">
        <qwuiButton type="danger"
          @click="closePop">关闭</qwuiButton>
      </div>
    </div>
  </div>
</template>

<script>
import VueDatepickerLocal from 'vue-datepicker-local'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
export default {
  data() {
    return {
      sdate: {
        selectTime: [],
        timeLocal: {
          dow: 0, // 第一天为周日
          yearSuffix: '年', // format of head
          monthsHead: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split(
            '_'
          ), // months of head
          months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
            ''
          ), // months of panel
          weeks: '日_一_二_三_四_五_六'.split('_'), // weeks
          submitTip: '确定' // default text for submit button
        }
      }
    }
  },
  methods: {
    closePop() {
      this.$emit('closeCityHistory', '')
    },
    // 选择日期
    chooseTime() {}
  },
  components: {
    qwuiButton,
    VueDatepickerLocal
  }
}
</script>
