<template>
  <div class="qwui-cardList">
    <ul class="qwui-cardList-item flexbox" v-for="item in list" :key="item.id">
      <li class="flex" @click="toDetail(item)">
        <h3 class="ellipsis">{{item.title || didiTitle(item.askType, item.carType, item.personName)}}</h3>
        <p>用车时间 {{item.takeTime}}<span  v-show="item.estimatePriceNum"> {{' | 估算 ￥' + item.estimatePriceNum}}</span></p>
        <p class="ellipsis"><span class="icon-flag icon-start"></span>{{item.beginLocation || '未填写出发地'}}</p>
        <p class="ellipsis"><span class="icon-flag icon-end"></span>{{item.destinationLocation || '未填写目的地'}}</p>
        <span
          class="applyStatus"
          :class="statusClass(item.isover, item.status)">{{showStatus(item.isover, item.status)}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
      name: 'carUseList',
      props: {
        list: {
          type: Array,
          default() {
            return []
          }
        }
      },
      data() {
        return {
          statusClassList: {
            '已关闭': 'gray',
            '退审': 'red',
            '已审批': 'green',
            '审批中': 'blue',
            '已结束': 'gray',
            '已派车': 'orange',
            '草稿': 'gray'
          }
        }
      },
      methods: {
        didiTitle(askType, carType, name) {
          if(askType == '2') {
            return this.didiCarType(carType) + '_' + name
          }
        },
        didiCarType(type) {
          let str = ''
          const typeObj = {
            600: '快车普通型',
            100: '专车舒适型',
            200: '专车行政级',
            400: '专车商务型',
          }
          str =  '企业叫车_' + typeObj[type]
          return str
        },
        //isover  -1:已取消;0:退审;1审批通过;2草稿
        //status	0:草稿;1:审批中;2:审批通过;3:已派车;4:已结束
        //askType  1:公司派车;2:企业叫车
        showStatus(isover, status) { // 用车显示状态(含企业叫车)
          if(isover == '-1' || status== '109' || status == '610') {
            return '已关闭'
          }
          else if(isover == '0' && status == '0'){
            return '退审'
          }
          else if(status == '0' && isover == '2'){
            return '草稿'
          }
          else if(status == '1' && isover == '2'){
            return '审批中'
          }
          else if(status == '2' && isover == '1'){
            return '已审批'
          }
          else if(status == '3' || status == '300' || status == '400' || status == '410'){
            return '已派车'
          }
          else if(status == '4' || status == '700' || status == '311' || status == '600'){
            return '已结束'
          }
          else return ''
        },
        statusClass(isover, status) {
          let classStatus = this.showStatus(isover, status)
          if(classStatus == '') {
            return 'none'
          }
          return this.statusClassList[classStatus]
        },
        toDetail(item) {
          //公司派车
          if(item.askType == '1') {
            let path = '/detail'
            let query = {
              askId: item.askId
            }
            if(item.status == '0' && item.isover == '2') { //判断是否是草稿
              path = '/add'
              query.type = 'edit'
            }
            this.$router.push({path, query})
          }
          //企业叫车
          if(item.askType == '2') {
            //草稿
            if(item.status == '0' && item.isover == '2') {
              window.location.href = `${_.baseURL}/jsp/wap/didi/diditrade.jsp?didiOption=edit&askId=${item.askId}`
            } else { //不是草稿
              window.location.href = `${_.baseURL}/jsp/wap/didi/diditraveldetail.jsp?askId=${item.askId}`
            }
          }
        }
      }
    }
</script>

<style>
</style>
