<template>
  <div class="storeChangeWrap">
    <div class="mask"></div>
    <div class="popInfo">
      <div class="titWrap">
        <h4>基础信息</h4>
      </div>
      <div class="storeInfo">
        <ul>
          <li class="first">
            <div class="sItem">
              <span class="sLabel">变更类型</span>
              <span class="sValue">-</span>
            </div>
            <div class="sItem">
              <span class="sLabel">变更时间</span>
              <span class="sValue">-</span>
            </div>
            <div class="sItem">
              <span class="sLabel">搬迁时间</span>
              <span class="sValue">2000年3月1日</span>
            </div>
            <div class="sItem">
              <span class="sLabel">开工时间</span>
              <span class="sValue">2000年3月1日</span>
            </div>
            <div class="sItem">
              <span class="sLabel">完工时间</span>
              <span class="sValue">2000年3月1日</span>
            </div>
            <div class="sItem">
              <span class="sLabel">转正时间</span>
              <span class="sValue">2000年3月1日</span>
            </div>
            <div class="sItem">
              <span class="sLabel">建设级别</span>
              <span class="sValue">A</span>
            </div>
            <div class="sItem">
              <span class="sLabel">店面级别</span>
              <span class="sValue">过渡店</span>
            </div>
          </li>
          <li class="second">
            <div class="sItem">
              <span class="sLabel">是否电厂分离</span>
              <span class="sValue">否</span>
            </div>
            <div class="sItem">
              <span class="sLabel">启动协议完工时间</span>
              <span class="sValue">2000年4月15日</span>
            </div>
            <div class="sItem">
              <span class="sLabel">最终协议完工时间</span>
              <span class="sValue">2000年4月15日</span>
            </div>
            <div class="sItem">
              <span class="sLabel">延期次数</span>
              <span class="sValue">1</span>
            </div>
            <div class="sItem">
              <span class="sLabel">考核金额(万元)</span>
              <span class="sValue">1.2</span>
            </div>
            <div class="sItem">
              <span class="sLabel">附件</span>
              <span class="sValue"></span>
            </div>
            <div class="sItem">
              <span class="sLabel">建设阶段细项</span>
              <span class="sValue">建设已完成</span>
            </div>
            <div class="sItem">
              <span class="sLabel">验收日期</span>
              <span class="sValue">2000年4月15日</span>
            </div>
          </li>
        </ul>
        <div class="closeBtn">
          <qwuiButton type="danger"
            @click="closePop">关闭</qwuiButton>
        </div>
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
  methods: {
    closePop() {
      this.$emit('closeStoreChangePop', '')
    }
  },
  components: {
    qwuiButton
  }
}
</script>

