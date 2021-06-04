<template>
  <div class="component-data-table">
    <div class="component-data-table-container">
      <div class="table-head">
        <div class="table-item" v-for="(item, index) in tableDataTitle" :key="index" :class="item.class">
          <span class="title">{{item.title}}</span>
        </div>
      </div>
      <div class="table-content" v-if="clientGradeIndex.length !== 0">
        <div class="table-content-container" v-for="(item, index) in clientGradeIndex" :key="index" :class="index % 2 !== 0 ? 'is_even' : 'is_odd'">
          <div class="content-container">
            <div class="content-item head-name">
              <span class="item-value">{{item.name}}</span>
            </div>
            <div class="content-item head-weight">
              <span class="item-value">{{item.weight}}</span>
            </div>
            <div class="flex-column">
              <div class="flex-row" v-for="(subItem, subIndex) in item.indexValues" :key="subIndex">
                <span class="head-range subitem-value">
                  <i class="subitem-value_i" v-if="subItem.minVal && subItem.maxVal">{{subItem.minVal}}&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;{{subItem.maxVal}}</i>
                  <i class="subitem-value_i" v-else-if="subItem.minVal && !subItem.maxVal">{{subItem.minVal}} 以上</i>
                  <i class="subitem-value_i" v-else-if="!subItem.minVal && subItem.maxVal">{{subItem.maxVal}} 以下</i>               
                  <i class="subitem-value_i" v-else-if="!subItem.minVal && !subItem.maxVal">{{subItem.name}}</i>               
                </span>
                <span class="subitem-value"><i class="subitem-value_i">{{subItem.gradeVal * 100}}</i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="no-table-content" v-else>
        <noData class="no-data"></noData>
      </div>
    </div>
  </div>
</template>

<script>
import noData from "@/components/list/noData";
export default {
  name: 'componentDataTable',
  props: {
    clientGradeIndex: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    noData
  },
  data() {
    return {
      tableDataTitle: [
        {
          title: '指标名',
          class: 'head-name',
        },{
          title: '权重',
          class: 'head-weight',
        },{
          title: '区间/选项',
          class: 'head-range',
        },{
          title: '评分',
          class: 'head-score',
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.component-data-table {
  width: 100%;
  .component-data-table-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #F0F0F0;
    border-top: none;
    .head-name {
      width: 161px;
    }
    .head-weight {
      width: 215px;
    }
    .head-range {
      width: 384px;
    }
    .head-score {
      flex: 1;
    }
    .table-item {
      height: 50px;
      line-height: 50px;
      padding: 16px 0 ;
      height:18px;
      font-size:13px;
      font-family:MicrosoftYaHei;
      color:rgba(56,56,56,1);
      line-height:17px;
      background: #F7F7FA;
      border-right: 1px solid #F0F0F0;
      border-bottom: 1px solid #F0F0F0;
      border-top: 1px solid #F0F0F0;
      &:last-child {
        border-right: none;
      }
      .title {
        padding-left: 12px;
      }
    }
    .table-head {
      display: flex;
    }
    .table-content {
      color: #808080;
      width: 100%;
      .table-content-container {
        display: flex;
        border-bottom: 1px solid #F0F0F0;
        &:last-child {
          border-bottom: none;
        }
        &.is_even {
          background: #FCFDFD;
        }
        &.is_odd {
          background: #ffffff;
        }
        .content-container {
          flex: 1;
          display: flex;
          .content-item {
            border-right: 1px solid #F0F0F0;
            display: flex;
            align-items: center;
            .item-value {
              padding-left: 12px;
            }
          }
          .flex-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            .flex-row {
              display: flex;
              border-bottom: 1px solid #F0F0F0;
              &:last-child {
                border-bottom: none;
              }
              .subitem-value {
                border-right: 1px solid #F0F0F0;
                // padding: 16px 0;
                // height: 18px;
                font-size: 13px;
                font-family: MicrosoftYaHei;
                line-height: 17px;
                &:last-child {
                  border-right: none;
                  flex: 1;
                }
                .subitem-value_i {
                  display: block;
                  padding: 16px 12px;
                  word-break: break-all;
                }
              }
            }
          }
        }
      }
    }
    .no-table-content {
      &>.no-data {
        min-height: 0 !important;
        padding: 110px !important;
      }
    }
  }
}
</style>
