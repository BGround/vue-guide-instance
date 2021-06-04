<template>
  <div class="shareholderChangeWrap">
    <div class="mask"></div>
    <div class="popInfo">
      <div class="scrollWrap">
        <div class="titWrap mb10">
          <h4>股东变更信息</h4>
        </div>
        <table>
          <tr>
            <th>变更时间</th>
            <th>变更类型</th>
            <th>变更原因</th>
            <th>变更内容</th>
            <th>现信息</th>
            <th>变更前信息</th>
          </tr>
          <tr v-for="(item,index) in shareholderInfo"
            :key='index'>
            <td>{{item.changeDate}}</td>
            <td>{{item.changeType}}</td>
            <td>{{item.changeReason}}</td>
            <td>{{item.changeInfo}}</td>
            <td>{{item.nowInfo}}</td>
            <td>{{item.beforeInfo}}</td>
          </tr>
          <tr v-if="shareholderInfo && shareholderInfo.length===0"><td colspan="6">暂无数据</td></tr>
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
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
export default {
  data() {
    return {}
  },
  props: ['shareholderInfo'],
  methods: {
    closePop() {
      this.$emit('closeShareholder', '')
    }
  },
  watch: {
    shareholderInfo(val, oldval) {
      this.shareholderInfo = val
    }
  },
  components: {
    qwuiButton
  }
}
</script>
