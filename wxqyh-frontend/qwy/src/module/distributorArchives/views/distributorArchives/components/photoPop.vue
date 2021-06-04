<template>
  <div class="updateTimePopWrap">
    <div class="mask"></div>
    <div class="popInfo">
      <div class="scrollWrap">
        <div class="titWrap mb10">
          <h4>更新时间：{{updateTime}}</h4>
        </div>

        <div class="hallImgList">
          <ul>
            <li v-for="(item,index) in imgList"
              :key="index">
              <img :src="item.url">
              <p>{{item.title}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="closeBtn">
        <qwuiButton type="danger"
          @click="closePhotoPop">确认</qwuiButton>
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
  props:{
    columns:{
        type: Array
    },
    updateTime:{
      type: String
    }
  },
  computed: {
      imgList() {
          let data = this.columns
          data.map(item => {
              item.url = _.compressURL+item.url
          })
          return data
      }
  },
  methods: {
    closePhotoPop() {
      this.$emit('closePhotoPop', '')
    }
  },
  components: {
    qwuiButton
  }
}
</script>
