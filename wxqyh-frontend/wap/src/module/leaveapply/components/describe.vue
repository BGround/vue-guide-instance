<template>
  <div>
    <div class="qwui-detail_header_item" v-for="(item,i) in detail.describes" :key="i">
      <div :class="item.class && item.class!=''? item.class:'qwui-detail_item_title'">
        <i v-if="item.figure" :class="item.figure && item.figure!=''? item.figure:''"></i>{{$t(item.text)}}</div>
      <div class="qwui-detail_item_content">{{$t(item.content)}}</div>
    </div>
    <div>
      <div class="qwui-detail_header_item" v-if="detail.isRevoked == 1">
        <div class="qwui-detail_item_title"><span>原请假单</span></div>
        <div class="qwui-detail_item_content"><a @click="goDetailPage(detail.sourceAskId)">页面链接</a></div>
      </div>
      <div v-if="detail.isRevoked == 0 && detail.alreadyRevoked > 0 && List.revokedIds.length >0">
        <div class="qwui-detail_header_item">
          <div class="qwui-detail_item_title"><span>原请假开始时间</span></div>
          <div class="qwui-detail_item_content">{{detail.sourceStartTime}}</div>
        </div>
        <div class="qwui-detail_header_item">
          <div class="qwui-detail_item_title"><span>原请假结束时间</span></div>
          <div class="qwui-detail_item_content">{{detail.sourceEndTime}}</div>
        </div>
        <div class="qwui-detail_header_item" v-for="(item, index) in List.revokedIds" :key="index">
          <div class="qwui-detail_item_title"><span>销假单{{List.revokedIds.length > 1 ? index+1 : ''}}</span></div>
          <div class="qwui-detail_item_content"><a @click="goDetailPage(item.askId)">页面链接</a></div>
        </div>
      </div>
    </div>
    <div class="mt-20" v-if="isTravel && detail.isRevoked == '0'">
      <div :class="{'mb-20': checkValid(detail.together) || detail.stay == 1 || !!detail.transportation}">
        <div class="qwui-detail_header_item" v-if="checkValid(detail.beginLocation)">
          <div class="qwui-detail_item_title"><span>出发地</span></div>
          <div class="qwui-detail_item_content">
            <a @click="showMap('begin')" v-if="checkValid(detail.beginLatitude) || checkValid(detail.beginLongitude)">{{detail.beginLocation}}</a>
            <span v-else>{{detail.beginLocation}}</span>
          </div>
        </div>
        <div class="qwui-detail_header_item" v-if="checkValid(detail.destinationLocation)">
          <div class="qwui-detail_item_title"><span>目的地</span></div>
          <div class="qwui-detail_item_content">
            <a @click="showMap('destination')" v-if="checkValid(detail.destinationLatitude) || checkValid(detail.destinationLongitude)">{{detail.destinationLocation}}</a>
            <span v-else>{{detail.destinationLocation}}</span>
          </div>
        </div>
      </div>
      <div class="qwui-detail_header_item" v-if="checkValid(detail.together)">
        <div class="qwui-detail_item_title"><span>同行人员</span></div>
        <div class="qwui-detail_item_content">{{this.detail.together}}</div>
      </div>
      <div class="qwui-detail_header_item" v-if="!!detail.transportation">
        <div class="qwui-detail_item_title"><span>交通工具</span></div>
        <div class="qwui-detail_item_content">{{transportationMap[detail.transportation]}}</div>
      </div>
      <div v-if="detail.stay == 1">
        <div class="qwui-detail_header_item" >
          <div class="qwui-detail_item_title"><span>是否住宿</span></div>
          <div class="qwui-detail_item_content">是</div>
        </div>
        <div class="qwui-detail_header_item" v-if="checkValid(detail.checkInTime)">
          <div class="qwui-detail_item_title"><span>入住时间</span></div>
          <div class="qwui-detail_item_content">{{detail.checkInTime.substring(0,10) + '  至  ' + detail.checkOutTime.substring(0,10)}}</div>
        </div>
        <div class="qwui-detail_header_item" v-if="!!detail.stayDays">
          <div class="qwui-detail_item_title"><span>入住天数</span></div>
          <div class="qwui-detail_item_content">{{detail.stayDays}}</div>
        </div>
        <div class="qwui-detail_header_item" v-if="!!detail.stayRooms">
          <div class="qwui-detail_item_title"><span>房间数量</span></div>
          <div class="qwui-detail_item_content">{{detail.stayRooms}}</div>
        </div>
      </div>
    </div>
    <div v-if="detail.isTravel == 2">
      <div class="qwui-detail_header_item" v-if="detail.compensateType==1">
        <div class="qwui-detail_item_title"><span>加班补偿</span></div>
        <div class="qwui-detail_item_content">{{compensateTypeMap[detail.compensateType] || '其它'}}</div>
      </div>
      <div class="qwui-detail_header_item" v-if="detail.compensateType == 1">
        <div class="qwui-detail_item_title"><span>补偿假期</span></div>
        <div class="qwui-detail_item_content">{{holidy}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getTemplateById } from '../api/getData'
  export default {
    name: 'describe',
    props:{
      List: null
    },
    data() {
      return {
        transportationMap: { // 交通工具列表
          1: '汽车',
          2: '火车',
          3: '高铁',
          4: '动车组',
          5: '轻轨',
          6: '飞机',
          7: '轮船'
        },
        compensateTypeMap: {
          0: '不补偿',
          1: '计入调休时长'
        },
        holidy: '',
        minUnit: '',  //加班计算时长方式   // 0 无限制 1 最小单位小时  2 最小单位天数
        detail: this.List.detail
      }
    },
    mounted() {
      if(this.detail) { 
        // 加班
        if(this.detail.isTravel == 2){
          // 计入调休
          getTemplateById(this.detail.askType, (res) => {
            // 关联模板名称
            this.holidy = res.targetTemplate?res.targetTemplate.name:''
            // 加班计算时长方式为天数 
            if(res.template.minUnit==2){
              this.detail.describes[0].content = this.detail.describes[0].content[1]+'天'
              this.detail.describes[2].content = this.detail.describes[2].content.slice(0,10)
              this.detail.describes[3].content = this.detail.describes[3].content.slice(0,10)
            }else{
              // 小时调休
            this.detail.describes[0].content = this.detail.describes[0].content[0]+'小时'
            }
          })
        }
      }
    },
    computed:{
      isTravel() {
        return this.detail.isTravel == 1 ? true : this.detail.isTravel == 0 ? false : this.detail.typeName.indexOf('出差') != -1      // 出差的请假单才显示出差信息
      }
    },
    methods: {
      showMap(val) {
        this.$emit('showMap', val)
      },
      goDetailPage(val) {
        var id = val
        this.$router.push({path: '/detail', query: {askId: val}})
        window.location.reload()
      },
      // 检查值是否有效
      checkValid(val) {
        if (val !== '' && val !== undefined && val !== null) {
          return true
        }
        return false
      },
    }
  }
</script>
<style scoped>
.mt-20 {
  margin-top: 20px;
}
.mb-20 {
  margin-bottom: 20px;
}
.qwui-detail_header_item{
  display: flex;
  padding: 5px 0;
  font-size: 15px;
  line-height: 16px;
}
.qwui-detail_item_title{
  display: inline-block;
  padding-right: 20px;
  color: #666;
  text-align: left;
  overflow: hidden;
}
.qwui-detail_item_content{ flex:1; color: #333;}
</style>