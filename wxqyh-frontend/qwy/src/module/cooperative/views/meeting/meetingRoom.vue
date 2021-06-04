<template>
  <div>
    <!--返回按钮-->
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <!--左侧边栏-->
    <left-side-bar :renderConfig="renderConfig"
      @listenToChild="chooseRegion"
      @listenAddPop="openRegionPop"></left-side-bar>
    <!--新建编辑区域弹窗-->
    <pop-base :popData="popData"
      @listenClose="closeRegionPop"
      @listenBtnFunc="updateRegion">
      <div class="qwui-form_content">
        <span class="itemTitle"><span class="redStar">*</span>区域名称：</span>
        <qwui-input v-model="regionName"
          :maxLength="20"
          :isWarning="isWarning"
          :warningTips="'区域名称不能为空'"
          :disabled="isDisabled"
          @input="changeInput"></qwui-input>
        <p class="itemDesc">只有一个区域时，应用端不显示区域信息<a class="qwui-vip_tip"
            :href="dataBase.vipHref"
            target="_blank">尊享版功能</a></p>
      </div>
    </pop-base>
    <!--会议室列表-->
    <div class="qwui-data_content">
      <h2 class="mainTitle">
        <span class="ruleNameStyle">{{ currRegionName }}</span>
        <a class="editRuleStyle"
          @click="openRegionPop(currRegionId,currRegionName)">编辑</a>
        <p class="addBtn">
          <qwui-button type="primary"
            @click="addOrEditMeetRoom()">新增会议室</qwui-button>
        </p>
      </h2>
      <div>
        <data-table class="qwui-table_wrap"
          :headData="headData"
          :dataList="dataList">
          <div v-for="(item,key) in dataList"
            :key="key"
            :slot="'roomName' + key"
            v-if="item.isAudit === 1">
            <span class="qwui-audit_room">{{ item.roomName }}</span>
            <span class="meetAudit">审</span>
          </div>
        </data-table>
        <page :pageData="pageData"
          @change="change"></page>
      </div>
    </div>
    <!--新建编辑会议室弹窗-->
    <add-or-edit v-if="showAddEditPop"
      :roomId="roomId"
      :regionList="renderConfig.renderList"
      :regionId="currRegionId"
      @listenToClosePop="closeAddEditPop"></add-or-edit>
  </div>
</template>

<script>
import qwuiGoBack from '@/components/base/qwuiGoBack'
import leftSideBar from '@/components/list/LeftSideBar'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import PopBase from '@/components/Add/popUps/PopBase'
import dataTable from '@/components/Table/dataTable.vue'
import page from '@/components/list/page.vue'
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
import addOrEdit from './meetingRoomAddOrEdit'
import { isVipGold } from '@/assets/js/vip-manager'

import {
  searchAllRegions,
  searchRegionRoom,
  addOrEditRegion,
  deleteRegion,
  updateMeetRoomStatus,
  deleteMeetingRoom
} from '../../api/meeting/getData'

const devicesObj = {
  ismultime: '多媒体',
  isprojector: '投影仪',
  isShakearound: 'ibeacon',
  isDigitalSignage: '数字标牌',
  isWhiteBoard: 'CVTouch白板'
}

export default {
  data() {
    return {
      dataBase: dataBase,
      regionId: '',
      regionName: '',
      currRegionName: '',
      currRegionId: '',
      isWarning: false,
      isDisabled: false,
      goBackConfig: {
        hasLine: false,
        lastPath: '设置',
        currPath: '会议室设置'
      },
      renderConfig: {
        addOperateName: '新增区域',
        renderList: [], // 区域列表
        currentIndex: 0
      },
      headData: {
        middle: [
          {
            title: '会议室名称',
            key: 'roomName',
            width: 170
          },
          {
            title: '地址',
            key: 'address',
            width: 100
          },
          {
            title: '可容纳人数',
            key: 'galleryful',
            width: 100
          },
          {
            title: '设备',
            key: 'device',
            width: 180
          },
          {
            title: '状态',
            key: 'statusName',
            width: 55
          }
        ],
        right: {
          isShowOperate: true,
          width: 60
        }
      },
      dataList: [],
      pageData: {},
      page: 1,
      pageSize: 10,
      // 新建编辑区域弹窗数据
      popData: {
        popShow: false,
        popTitle: '新增区域',
        minHeight: 100,
        buttonConfig: [
          {
            text: '保存',
            type: 'primary'
          }
        ]
      },
      // 展示新建编辑会议室弹窗
      showAddEditPop: false,
      roomId: ''
    }
  },
  created() {
    this.getAllRegions()
  },
  methods: {
    // 获取所有会议室区域
    getAllRegions() {
      searchAllRegions(data => {
        this.renderConfig.renderList = []
        data.regionVOList.forEach(item => {
          let regionListItem = {
            itemName: item.regionName,
            itemIcon: require('assets/images/company_icon.png'),
            id: item.id,
            operateList: [
              {
                operateName: '编辑',
                operateFunc: () => {
                  this.openRegionPop(item.id, item.regionName)
                }
              },
              {
                operateName: '删除',
                operateFunc: () => {
                  this.deleteRegion(item.id)
                }
              }
            ]
          }
          if (item.isDefault) {
            regionListItem.operateList.splice(1, 1)
          }
          this.renderConfig.renderList.push(regionListItem)
        })
        if (data.regionVOList && data.regionVOList.length > 0) {
          this.currRegionId = data.regionVOList[0].id
          this.currRegionName = data.regionVOList[0].regionName
          this.getMeetingRoom()
        }
      })
    },
    // 获取区域下会议室
    getMeetingRoom() {
      let self = this

      // 获取会议室列表
      searchRegionRoom(
        {
          regionId: this.currRegionId,
          page: this.page || 1,
          pageSize: this.pageSize || 10
        },
        data => {
          this.pageData = {
            page: data.currPage,
            pageSize: this.pageSize,
            maxPage: data.maxPage,
            totalRows: data.totalRows
          }
          if (!data.pageData) {
            this.dataList = []
            return
          }
          data.pageData.forEach(item => {
            item.operationList = [
              {
                text: '编辑',
                operationFunc() {
                  self.addOrEditMeetRoom(item.id)
                }
              },
              {
                text: item.status == '0' ? '禁用' : '启用',
                operationFunc() {
                  self.updateRoomStatus(item.id, item.status)
                }
              },
              {
                text: '删除',
                operationFunc() {
                  self.deleteMeetRoom(item.id, item.roomName)
                }
              }
            ]
            item.statusName = item.status == '0' ? '启用' : '禁用'

            // 设备数组
            let deviceArr = []
            // 获取会议室设备
            for (let key in item) {
              if (key in devicesObj && item[key] == 1) {
                deviceArr.push(devicesObj[key])
              }
            }
            // 获取其他设备
            if (item.otherDevices) {
              deviceArr.push(item.otherDevices)
            }
            item.device = deviceArr.join('、')
          })
          this.dataList = data.pageData
        }
      )
    },
    // 选择区域
    chooseRegion(id, key, item) {
      this.currRegionId = id
      this.currRegionName = item.itemName
      this.renderConfig.currentIndex = key
      this.getMeetingRoom()
    },
    // 新增、编辑区域
    updateRegion() {
      if (this.regionName == '') {
        this.isWarning = true
        return
      }

      addOrEditRegion(
        {
          'roomRegionPO.regionName': this.regionName,
          'roomRegionPO.id': this.regionId
        },
        () => {
          let text = this.regionId ? '保存成功' : '新增成功'
          dataBase.top_alert(text, true, 3000)
          this.renderConfig.currentIndex = 0
          this.getAllRegions()
          this.popData.popShow = false
        }
      )
    },
    // 删除区域
    deleteRegion(id) {
      let self = this
      _.alert(
        '提示',
        '删除数据后将无法恢复，确认要删除吗？',
        function() {
          deleteRegion(
            {
              regionId: id
            },
            () => {
              dataBase.top_alert('删除成功', true, 3000)
              self.getAllRegions()
            }
          )
        },
        '确定',
        true
      )
    },
    // 打开新增编辑区域窗口
    openRegionPop(id, name) {
      this.regionId = id || ''
      this.regionName = name || ''
      this.isDisabled = false
      this.isWarning = false
      //非金卡vip情况下，不能新增区域，可以编辑
      if (id) {
        this.popData.popTitle = '编辑区域'
      } else {
        this.popData.popTitle = '新增区域'
        this.isDisabled = !isVipGold(interfaceCode.INTERFACE_CODE_MEET)
      }
      this.popData.popShow = true
    },
    closeRegionPop() {
      this.popData.popShow = false
    },
    // 新增编辑会议室
    addOrEditMeetRoom(id) {
      this.roomId = id || ''
      this.showAddEditPop = true
    },
    closeAddEditPop(status) {
      this.showAddEditPop = false
      if (status) {
        this.getMeetingRoom()
      }
    },
    // 启用禁用会议室
    updateRoomStatus(id, status) {
      let self = this
      status = status == '0' ? '1' : '0'
      let text = status == '1' ? '禁用' : '启用'

      updateMeetRoomStatus(
        {
          id: id,
          status: status
        },
        () => {
          this.dataList.some(item => {
            if (item.id == id) {
              item.status = status
              item.operationList[1] = {
                text: item.status == '0' ? '禁用' : '启用',
                operationFunc() {
                  self.updateRoomStatus(item.id, item.status)
                }
              }
              item.statusName = item.status == '1' ? '禁用' : '启用'
              return true
            }
          })
          dataBase.top_alert(text + '成功', true, 3000)
        }
      )
    },
    // 删除会议室
    deleteMeetRoom(id, name) {
      let self = this
      _.alert(
        '提示',
        '是否删除[' + name + ']？',
        function() {
          deleteMeetingRoom(
            {
              id: id
            },
            () => {
              dataBase.top_alert('删除成功', true, 3000)
              self.getMeetingRoom()
            }
          )
        },
        '确定',
        true
      )
    },
    changeInput() {
      this.isWarning = this.regionName == ''
    },
    // 页码变化
    change(page, pageSize) {
      this.pageSize = pageSize
      this.page = page
      this.getMeetingRoom()
    }
  },
  components: {
    qwuiGoBack,
    leftSideBar,
    PopBase,
    dataTable,
    page,
    qwuiInput,
    addOrEdit,
    qwuiButton
  }
}
</script>

<style lang="scss" scoped>
.qwui-data_content {
  margin-left: 230px;

  .mainTitle {
    margin-bottom: 20px;
    line-height: 40px;

    .ruleNameStyle {
      font-size: 18px;
    }

    .editRuleStyle {
      margin-left: 12px;
      color: #999;
      cursor: pointer;

      &:hover {
        color: #f78b00;
      }
    }
    .addBtn {
      margin: 20px 0 -20px 0;
    }
  }
}
.qwui-table_wrap {
  padding-top: 15px;
  & /deep/ .table_wrap {
    min-width: 0;
  }
  .meetAudit {
    display: inline-block;
    width: 14px;
    height: 16px;
    margin-left: 7px;
    line-height: 16px;
    border: 1px solid #b7b7b7;
    text-align: center;
    color: #b7b7b7;
  }
}
.qwui-form_content {
  margin-left: 30px;

  .itemTitle {
    margin-right: 10px;
    margin-top: 5px;
    display: inline-block;
    text-align: right;
    vertical-align: top;
  }
  .redStar {
    color: red;
  }
  .itemDesc {
    margin-top: 10px;
    margin-left: 90px;
    font-size: 12px;
    color: #999;
  }
}
.qwui-vip_tip {
  margin-left: 20px;
  vertical-align: bottom;
  color: #f87b00;
  cursor: pointer;
}
.qwui-audit_room {
  display: inline-block;
  max-width: 80%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
}
</style>
