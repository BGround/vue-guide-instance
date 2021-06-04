<template>
  <div class="qwui-check_header">
    <ul class="taskList">
      <li v-for="(item, index) in pageData" :key="index" class="taskItem">
        <div class="taskItem_wrapper" v-if="!item.liHide">
          <div class="beforeLiTitle" v-if="isShowBeforeLiTitle && index == 0">
            <span class="text">进行中</span>
            <span class="circle"></span>
            <span class="text">{{ingTask}}</span>
          </div>
          <div class="beforeLiTitle" v-if="isShowBeforeLiTitle && index === ingTaskIndex" @click="handleShowFin">
            <span class="text">已结束</span>
            <span class="circle"></span>
            <span class="text">{{overTask}}</span>
          </div>
          <div class="taskItem" :class="[{ 'doneItem': item.taskStatus == 2}, filterTask(item.priority)]" v-show="!isShowBeforeLiTitle||index<ingTaskIndex||(index>=ingTaskIndex&&isShowFin)">
            <div class="left_area" @click="enterDetail(item, index)">
                            <span class="top_title">
                                <span class="unRead" v-if="!item.read && loadmore.data.schType === 'myWait'"></span>
                                {{item.title}}
                            </span>
              <div class="bottom_detail">
                <div class="stopTime" :class="filterTime(item.taskStop)">
                                    <span class="stopTime_text">
                                        {{item.taskStop | changeTime}} 截止
                                    </span>
                </div>
                <div class="stopState">
                  <div class="stopState_wrapper">
                                        <span class="stopState_text">
                                            {{ item.taskStart | changeTime }} 开始 · {{item.taskStatus | filterState}}
                                        </span>
                  </div>
                </div>
                <div class="infoDetail subTask" v-if="item.allSubtaskCount">
                  <span class="subTask"></span>
                  <span class="infoDetail_text">
                                        {{item.doSubtaskCount}}/{{item.allSubtaskCount}}
                                    </span>
                </div>
                <div class="infoDetail link" v-if="item.filepicCount">
                  <span class="link"></span>
                  <span class="infoDetail_text">{{item.filepicCount}}</span>
                </div>
                <div class="infoDetail comment" v-if="item.onlyCommentCount">
                  <span class="comment"></span>
                  <span class="infoDetail_text">{{item.onlyCommentCount}}</span>
                </div>
              </div>
            </div>
            <div class="right_area" >
              <a href="javascript:;" class="doMore" @click="doMoreThing(item, index)"></a>
              <!-- <img :src="item.headPic" alt="头像" class="headImg" v-if="loadmore.data.schType !== 'myPub'"> -->
              <div class="imgShadow" v-if="loadmore.data.schType !== 'myPub'"></div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  const priorityArr =  ['', '0', '1', '2', '3'];
  const priorityName =  ['normalState', 'normalState', 'doingState', 'warnState', 'dangerState'];
  export default {
    name: 'taskList',
    props: {
      loadmore: {
        type: Object
      },
      ingTask: {
        type: Number
      },
      overTask: {
        type: Number
      },
      currentSchType: {
        type: String
      }
    },
    data() {
      return {
        ingTaskIndex: 0,
        isShowFin: false
      }
    },
    created() {
    },
    // watch:{
    //     'ingTask':{
    //       handler(val){
    //       },
    //     },
    //   deep: true,
    //   immediate: true,
    // },
    methods: {
      doMoreThing(item, itemIndex) {
        this.$emit('listenDoMore', item, itemIndex)
      },
      filterTask(priority) {
        let index = priorityArr.indexOf(priority)
        return priorityName[index]
      },
      filterTime(stopTime) {
        let dateNow = new Date();//当前时间数据
        let isOverTime = ( new Date() > (new Date(stopTime.replace(/-/g,"\/"))) )
        return isOverTime ? 'overTime': 'inProgress'
      },
      enterDetail(item, itemIndex) {
        var self = this
        if (!item.read && this.currentSchType === 'myWait') {
          item.read = true;
          _.ajax({
            url: _.baseURL + '/portal/taskPortalCtl/getMyTaskInfo.do',
            type: 'POST',
            data: {
              taskId: item.taskId
            },
            success: function (result) {
              let arr = Object.keys(result.data.recipientTypeMap);
              if (item.taskStatus == 2 || arr[0] == 1) {
                // 已结束的，仅为相关人。隐藏
                console.log('隐藏')
                self.pageData.splice(itemIndex, 1)
              } else {
                console.log('不隐藏') // 不隐藏
              }
            }
          })
        }
        if (this.loadmore.data.schType === 'myDraf') {
          this.$router.push({
            path: '/add',
            query: {
              taskId: item.taskId,
              isDraft: true
            }
          })
        } else {
          this.$router.push({
            path: '/detail',
            query: {
              taskId: item.taskId,
              subtaskId: item.subtaskId,
            }
          })
        }
      },
      handleShowFin() {
        this.isShowFin = !this.isShowFin
      }
    },
    computed: {
      pageData() {
        if (this.loadmore.padeConfig.pageData) {
          let data = this.loadmore.padeConfig.pageData
          let newArr = []
          let newArryIng = []
          data.map(item => {
            if(item.taskStatus == '2' || item.taskStatus == '3'){
              newArr.push(item)
            }else if(item.taskStatus == '1' || item.taskStatus == '0'){
              newArryIng.push(item)
            }
          })
          this.ingTaskIndex = newArryIng.length
          newArryIng.push(...newArr)
          return newArryIng
          // return this.loadmore.padeConfig.pageData
        }

      },
      isShowBeforeLiTitle() {
        if (this.loadmore.data['searchValue.status'] === 'all' && !this.loadmore.data['searchValue.keyWord']
          && this.loadmore.data.schType !== 'myWait' && this.loadmore.data.schType !== 'myDraf' ) { //  ['myWait', 'myPub', 'myRes', 'myRel', 'myDraf']; // 待处理，我发起，我负责，我相关
          return true
        } else {
          return false
        }
      }
    },
    filters: {
      changeTime(value) {
        if (value) {
          let a = _.getFormatListTime(value)
          let b = a.split('-')
          let dateTime, y, m, d;
          if (b.length == 3) {
            m =  ~~b[1] > 9 ? ~~b[1] : '0' + ~~b[1]
            d =  ~~b[2] > 9 ? ~~b[2] : '0' + ~~b[2]
            dateTime = ~~b[0] + '年' + m + '月' + d + '日'
          } else {
            m =  ~~b[0] > 9 ? ~~b[0] : '0' + ~~b[0]
            d =  ~~b[1] > 9 ? ~~b[1] : '0' + ~~b[1]
            dateTime =  m + '月' + d + '日'
          }
          return dateTime
        } else {
          return ''
        }
      },
      filterState(val) {
        if (val == 2) {
          return '强制关闭'
        } else if (val == 3) {
          return '已完成'
        } else {
          return '已完成'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-check_header {
    .taskList {
      .beforeLiTitle {
        height: 36px;
        line-height: 36px;
        padding-left: 14px;
        margin-bottom: -12px;
        color: #B2B9C8;
        font-size: 12px;
        background: #F4F6F8;
        .circle {
          display: inline-block;
          vertical-align: middle;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #B2B9C8;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
        }
      }
      .taskItem {
        .taskItem_wrapper {
          .taskItem {
            padding: 14px 36px 14px 14px;
            position: relative;
            background: #fff;
            margin: 12px 14px 0;
            border-radius: 5px 3px 3px 5px;
            display: flex;
            align-items: center;
            &:before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              width: 3px;
              height: 100%;
              border-radius: 5px 0 0 5px;
            }
            &.normalState {
              &:before {
                background: #B2B9C8;
              }
            }
            &.doingState {
              &:before {
                background: #38DB6A;
              }
            }
            &.warnState {
              &:before {
                background: #FFC363;
              }
            }
            &.dangerState {
              &:before {
                background: #FF548F;
              }
            }
            .left_area {
              flex: 1;
              display: flex;
              flex-direction: column;
              margin-right: 10px;
              .top_title {
                color: #0A1735;
                font-size: 16px;
                // max-width: 288px;
                overflow: hidden;
                word-break: break-all;
                .unRead {
                  display: inline-block;
                  margin-right: 2px;
                  vertical-align: middle;
                  width: 7px;
                  height: 7px;
                  background: #FE5354;
                  border-radius: 50%;
                }
              }
              .bottom_detail {
                margin-top: 8px;
                .stopTime {
                  padding: 0 5px;
                  border-radius: 2px;
                  height: 16px;
                  line-height: 16px;
                  // width: 69px;
                  display: inline-block;
                  vertical-align: middle;
                  text-align: center;
                  .stopTime_text {
                    font-size: 11px;
                  }
                  &.overTime {
                    color: #fff;
                    background: #FE5354;
                  }
                  &.inProgress {
                    color: #6E9BFF;
                    background: #E8EFFF;
                  }
                }
                .stopState {
                  display: none;
                  vertical-align: middle;
                  .stopState_wrapper {
                    display: table-cell;
                    vertical-align: middle;
                    text-align: center;
                    padding: 0 5px;
                    border-radius: 2px;
                    background: #E3E4E8;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    .stopState_text {
                      font-size: 11px;
                      color: #fff;
                    }
                  }
                }
                .infoDetail {
                  display: inline-block;
                  margin-left: 12px;
                  position: relative;
                  span {
                    display: inline-block;
                    vertical-align: middle;
                  }
                  .infoDetail_text {
                    color: #B2B9C8;
                    font-size: 13px;
                  }
                  .subTask {
                    width: 12px;
                    height: 12px;
                    background: url(../../../../assets/svg/icon_a-list_subtask.svg) no-repeat center center;
                    background-size: 12px;
                  }
                  .link {
                    width: 12px;
                    height: 12px;
                    background: url(../../../../assets/svg/icon_a-list_enclosure.svg) no-repeat center center;
                    background-size: 12px;
                  }
                  .comment {
                    width: 12px;
                    height: 12px;
                    background: url(../../../../assets/svg/icon_a-list_comment.svg) no-repeat center center;
                    background-size: 12px;
                  }
                }
              }
            }
            .right_area {
              position: absolute;
              right: 12px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              height: 80%;
              width: 24px;
              .doMore {
                width: 24px;
                height: 24px;
                background: url(../../../../assets/svg/icon_a-list_more.svg) no-repeat 50% 20%;
                background-size: 18px 5px;
              }
              .headImg {
                width: 24px;
                height: 24px;
                border-radius: 50%;
              }
              .imgShadow {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #999;
                opacity: 0.65;
                position: absolute;
                right: 0;
                bottom: 0;
                display: none;
              }
            }
          }
          .doneItem {
            &.normalState {
              &:before {
                background: #D8DDE9;
              }
            }
            &.doingState {
              &:before {
                background: #BFEECD;
              }
            }
            &.warnState {
              &:before {
                background: #FFE4B8;
              }
            }
            &.dangerState {
              &:before {
                background: #FCD0DF;
              }
            }
            .left_area {
              .top_title {
                color: #B2B9C8;
                // .unRead {
                //     display: none;
                // }
              }
              .bottom_detail {
                .stopTime {
                  display: none;
                  &.overTime, &.inProgress {
                    color: #fff;
                    background: #E3E4E8;
                  }
                }
                .stopState {
                  display: inline-block;
                }
              }
            }
            .right_area {
              .imgShadow {
                display: block;
              }
            }
          }
        }
      }
    }
  }
</style>

