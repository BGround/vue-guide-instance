<template>
  <div class="updateTimePopWrap">
    <div class="mask"></div>
    <div class="popInfo">
      <div class="titWrap mb10">
        <h4>培训照片</h4>
      </div>
      <div class="scrollWrap">
        <div class="hallImgList">
          <ul>
            <li>
              <img :src="imgList(columns)">
            </li>
            <!-- <li v-for="(item,index) in imgList"
              :key="index">
              <img :src="item.url">
              <p>{{item.title}}</p>
            </li> -->
          </ul>
          <!-- <no-data v-if="imgList && imgList.length===0"></no-data> -->
          <no-data v-if="!columns"></no-data>
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
import noData from '@/components/list/noData'
export default {
  data() {
    return {}
  },
  props:{
    columns:{
        type: String
    },
  },
  computed: {
  },
  methods: {
    closePhotoPop() {
      this.$emit('closePhotoPop', '')
    },
    imgList(data) {
        if(!data.includes(_.compressURL)){
            data = _.compressURL + data
          }
        // data.map(item => {
        //   if(!item.url.includes(_.compressURL)){
        //     item.url = _.compressURL+item.url
        //   }
        // })
        console.log(data);
        
        return data
    }
  },
  components: {
    qwuiButton,noData
  }
}
</script>
