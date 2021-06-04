<template>
  <div class="process-management">

    <template v-if="hasData" >
    <div class="panel">
      <div class="panel__header">
        <div class="panel__title">基本信息</div>
        <div class="panel__status " v-if="mapStatus(processData.currentIndex)">{{mapStatus(processData.currentIndex)}}</div>
      </div>
      <div class="panel__content">
        <p class="panel__text"
          v-if="processData.currentMark">
          {{getDate}}{{processData.currentMark}}；
        </p>
       
      </div>
    </div>
    <template v-if="images.length">
      <div class="gutter"></div>

      <div class="album">
        <h4 class="album__title">
          建设照片
        </h4>
        <div class="album__content">
          <div v-for="(item, index) in images"
            :key="index"
            @click="handleClick(index)"
            class="album__picture">
            <img :src="item" />
          </div>

        </div>

      </div>
    </template>
    </template>

    <noData style="paddingTop: 20vh" :visible="!isLoading && !hasData" />

  </div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import noData from '@/module/channelManagement/components/noData';
import {
  getConstructionProcess,
  getConstructionImg
} from '@/module/channelManagement/api/building'
export default {
  mixins: [reloadApp],
  components: {
    noData
  },
  data() {
    return {
      processData: {},
      images: [],
      isLoading: false,
      currentIndex: ''
    }
  },
  computed: {
    hasData() {
      return this.isNonEmptyObject(this.processData)
    },
    getDate(){
      if(this.processData.currentIndex){
        const date =  this.processData['time'+this.processData.currentIndex];
        return date || '';
      }
    }
  },
  methods: {
    handleClick(index) {
      this.$imagePreview({
        initialIndex: index,
        urls: this.images
      })
    },

    mapStatus(index){
      return ['','设计方案','启动建设','基础施工','内部施工','完工验收','建设完成'][index];
    },

    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },

    fetchConstructionImg(processId) {
      getConstructionImg({ processId }).then(data => {
        if (data && Array.isArray(data.constructionImgPos)) {
          this.images = data.constructionImgPos.map(item => {
            return _.fileDownURL + item.url
          })
        }
      })
    }
  },
  created() {
    const dealerId = this.$route.query.dealerId || ''
    if (!dealerId) {
      return
    }
    this.isLoading = true;
    getConstructionProcess({ dealerId }).then(data => {
      if (data && data.constructionProcessPos) {
        this.processData = data.constructionProcessPos
        this.fetchConstructionImg(data.constructionProcessPos.id)
      }
    }).finally(()=>{
      this.isLoading = false;
    })
  },
  filters: {
    formatTime(time) {
      if (typeof time === 'object' && time !== null) {
        return `${time.year}年${time.month}月${time.day}日`
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.process-management {
  min-height: calc(100vh - 40px - 50px);
  padding-bottom: 50px;
  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .panel {
    padding: 15px;
    background: #ffffff;
  }

  .panel__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .panel__content {
    padding-top: 15px;
  }

  .panel__status {
    padding: 2px 5px;
    background: #c6001f;
    border-radius: 2px;
    color: #ffffff;
  }

  .panel__title {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
  }

  .panel__text {
    font-size: 15px;
    line-height: 20px;
    padding-bottom: 20px;
    color: rgba(51, 51, 51, 1);
  }

  .album{
    background-color: #ffffff;
  }

  .album__title {
    height: 24px;
    font-size: 17px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding: 15px;
  }

  .album__content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 15px;
  }

  .album__picture {
    &>img{
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
    width: calc((100vw - 60px) / 4);
    height: calc((100vw - 60px) / 4);
    @media screen and (min-width: 1024px) {
      width: calc(680px / 4);
      height: calc(680px / 4);
    }
    // background: #eee;
    flex-shrink: 0;
    margin-right: 10px;
    margin-bottom: 10px;
    overflow: hidden;
    &:nth-child(4n + 0) {
      margin-right: 0;
    }
  }
}
</style>