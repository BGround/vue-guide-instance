<template>
  <div class="informationController">
    <div class="add_container">
      <div class="add_item"
           @click="handleAdd">
        <p>+添加资讯</p>
        <p>点击此处添加资讯信息</p>
      </div>
    </div>
    <div class="infoList">
      <div class="infoItem"
           v-for="(item, index) in option.detail"
           :key="index">
        <div class="operation_item">
          <i class="iconfont public-web-tubiaozhizuomoban isShow"
             v-if="item.display == 1"
             @click="hide(index)"></i>
          <i class="iconfont public-web-tubiaozhizuomoban1 is_none"
             v-else
             @click="show(index)"></i>
        </div>
        <div class="img_item">
          <img :src="item.picPath || defaultImg"
               alt="item.picTitle">
        </div>
        <div class="text_item">
          <h1>{{item.title}}</h1>
          <p>{{item.releaseTime}}</p>
          <div class="operation">
            <span class="delete"
                  @click="deleteInfo(index)">删除</span>
            <span class="edit"
                  @click="editInfo(index)">编辑</span>
          </div>
        </div>
      </div>
    </div>
    <infomation-dialog v-model="showInfoDialog"
                       @newInfo="pushInfo"
                       :which="selectWhich"></infomation-dialog>
  </div>
</template>

<script>
import InfomationDialog from './informationDialog'
export default {
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      showInfoDialog: false,
      selectWhich: null,
      selectIndex: 0
    }
  },
  components: {
    InfomationDialog
  },
  filters: {},
  methods: {
    deleteInfo(index) {
      this.option.detail.splice(index, 1)
    },
    editInfo(index) {
      this.selectWhich = this.option.detail[index]
      this.selectIndex = index
      this.showInfoDialog = true
    },
    handleAdd() {
      this.selectWhich = null
      this.showInfoDialog = true
    },
    closeDialog() {
      this.showInfoDialog = false
    },
    pushInfo(res) {
      this.closeDialog()
      //非编辑添加
      if (!this.selectWhich) {
        this.option.detail.push(res)
        return
      }
      //编辑替换
      // this.option.detail.splice(this.selectIndex,1,res);
      this.option.detail[this.selectIndex].picPath = res.picPath
      this.option.detail[this.selectIndex].title = res.title
      this.option.detail[this.selectIndex].content = res.content
      this.option.detail[this.selectIndex].releaseTime = res.releaseTime
    },
    // 隐藏某项
    hide(index) {
      this.option.detail[index].display = '0'
    },

    show(index) {
      this.option.detail[index].display = '1'
    }
  }
}
</script>

<style lang="scss" scoped>
.informationController {
  .add_container {
    padding: 18px 24px;
    border-bottom: 1px solid #f0f0f0;
    .add_item {
      padding: 16px 0;
      border: 1px dashed #d5d5d5;
      p {
        text-align: center;
        font-family: MicrosoftYaHei;
        font-size: 10px;
        color: #999;
        line-height: 1.5em;
        &:first-child {
          color: #f87b00;
          font-size: 14px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .infoList {
    padding: 0px 24px 16px;
    .infoItem {
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      padding: 10px 12px;
      .operation_item {
        margin-right: 10px;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 16px;
        }
        .isShow {
          color: #f87b00;
        }
        .is_none {
          color: #ddd;
        }
      }
      .img_item {
        overflow: hidden;
        border-radius: 4px;
        font-size: 0;
        margin-right: 12px;
        img {
          width: 100px;
          height: 72px;
        }
      }
      .text_item {
        position: relative;
        height: fit-content;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        h1 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          width: 188px;
          font-size: 14px;
          line-height: 22px;
          color: #333;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          word-break: break-all;
        }
        p {
          font-size: 12px;
          color: #999;
          margin-top: 18px;
        }
        .operation {
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: 12px;
          .edit {
            margin-left: 10px;
            color: #f87b00;
            cursor: pointer;
          }
          .delete {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>

