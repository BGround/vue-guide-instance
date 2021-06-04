<template>
  <div>
    <pop-base class="qwui-pop_base"
      :popData="popData"
      @listenClose="closePop"
      @listenBtnFunc="updateMeetingRoom">
      <div class="qwui-item_box">
        <div class="qwui-input_item">
          <span class="itemTitle"><span class="star">*</span>会议室名称：</span>
          <qwui-input v-model="roomName"
            :maxLength="30"
            :isWarning="nameWarning"
            :warningTips="'会议室名称不能为空'"
            @input="changeName"></qwui-input>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">列表序号：</span>
          <qwui-input inputType="sort"
            v-model="sortNum"></qwui-input>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">可见范围：</span>
          <div class="itemPick">
            <pick-exam class="pickExam"
              :useDepts="visibleDept"
              :useUsers="visibleUser"
              :useTab="visibleUseTab"
              :useRadio="range"
              @changeRadio="changeRange"
              @chooseDone="chooseVisible"></pick-exam>
          </div>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">会议审批：</span>
          <qwui-checkbox v-model="isAudit"
            :disabled="!isVip">启用</qwui-checkbox>
          <a class="qwui-vip_tip"
            :href="dataBase.vipHref"
            target="_blank">尊享版功能</a>
        </div>
        <div class="qwui-input_item"
          v-if="isAudit">
          <span class="itemTitle"><span class="star">*</span>审批人：</span>
          <div class="itemPick">
            <pick-exam class="pickExam"
              :isShowRadios="false"
              :useTags="auditTagIds"
              :useUsers="auditUserIds"
              :useTab="auditUseTab"
              @chooseDone="chooseAudit"></pick-exam>
          </div>
        </div>
      </div>
      <div class="qwui-item_box">
        <div class="qwui-input_item">
          <span class="itemTitle"><span class="star">*</span>区域：</span>
          <qwui-select class="selectStyle"
            :dataList="regionData"
            :selectVal="selectRegion"
            @selectItem="chooseRegion"></qwui-select>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">会议室地址：</span>
          <qwui-input v-model="address"
            :maxLength="30"></qwui-input>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">可容纳人数：</span>
          <qwui-input v-model="galleryful"
            inputType="sort"></qwui-input>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">设备：</span>
          <span class="checkItem"
            v-for="(item,key) in deviceConfig"
            :key="key">
            <qwui-checkbox v-model="item.isCheck">{{ item.text }}</qwui-checkbox>
            <span class="tipIcon"
              v-if="item.hasTip">
              <span class="tipDesc"
                v-if="key == 'isWhiteBoard'">会议平板电视一体机，支持无线投影、白板书写、远程会议、触控等多种功能。
                <a href="http://wbg.do1.com.cn/uploads/%E4%BC%81%E5%BE%AE%C2%B7CVTOUCH%E4%BA%91%E4%BC%9A%E8%AE%AE%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.pdf"
                  target="_blank">了解更多</a>
              </span>
              <span class="tipDesc"
                v-if="key == 'isDigitalSignage'">
                电子数字标牌，大屏幕显示会议室状态。
                <a href="http://wbg.do1.com.cn/xueyuan/wp-content/uploads/2018/07/meeting-solution.pdf"
                  target="_blank">了解更多</a>
              </span>
            </span>
          </span>
        </div>
        <div v-if="deviceConfig.isWhiteBoard.isCheck"
          class="qwui-input_item">
          <span class="itemTitle"><span class="star">*</span>设备号：</span>
          <qwui-input v-model="deviceConfig.isWhiteBoard.number"
            :maxLength="200"
            :isWarning="whiteBoardWarning"
            :warningTips="'请输入CVTouch设备号'"
            @input="changeBoardNum"></qwui-input>
          <span class="tipIcon">
            <span class="tipDesc">多个设备号用英文“;”分隔</span>
          </span>
        </div>
        <div v-if="deviceConfig.isDigitalSignage.isCheck"
          class="qwui-input_item">
          <span class="itemTitle"><span class="star">*</span>标牌设备号：</span>
          <qwui-input v-model="deviceConfig.isDigitalSignage.number"
            :isWarning="digitalSignageWarning"
            :warningTips="'请输入数字标牌设备号'"
            :maxLength="200"
            @input="changeSignageNum"></qwui-input>
          <span class="tipIcon">
            <span class="tipDesc">多个设备号用英文“;”分隔</span>
          </span>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">其他设备：</span>
          <qwui-input v-model="otherDevices"
            :maxLength="1000"></qwui-input>
        </div>
      </div>
      <div>
        <div class="qwui-input_item">
          <span class="itemTitle">默认会服人员：</span>
          <div class="itemPick">
            <pick-exam class="pickExam"
              :isShowRadios="false"
              :useUsers="givenUserIds"
              :useTab="givenUseTab"
              @chooseDone="chooseGiven"></pick-exam>
          </div>
        </div>
        <div class="qwui-input_item">
          <span class="itemTitle">备注：</span>
          <qwui-input v-model="remark"
            class="areaStyle"
            inputType="textarea"></qwui-input>
        </div>
      </div>
    </pop-base>
  </div>
</template>

<script>
import PopBase from '@/components/Add/popUps/PopBase'
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
import qwuiSelect from '@/components/qwuiBase/qwuiSelect/QwSelect'
import pickExam from '@/components/pickPerson/pickExam'
import { isVipGold } from '@/assets/js/vip-manager'
import {
  checkSignageId,
  addMeetingRoom,
  viewMeetRoom,
  editMeetingRooom,
  isNeedAudit
} from '../../api/meeting/getData'

export default {
  props: {
    roomId: {
      type: String,
      default: ''
    },
    regionList: {
      type: Array,
      default() {
        return []
      }
    },
    regionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataBase: dataBase,
      popData: {
        popShow: true,
        popTitle: '新增会议室',
        minHeight: 600,
        width: 700,
        buttonConfig: [
          {
            text: '保存',
            type: 'primary'
          }
        ]
      },
      deviceConfig: {
        ismultime: {
          text: '多媒体',
          isCheck: false
        },
        isprojector: {
          text: '投影仪',
          isCheck: false
        },
        isWhiteBoard: {
          text: 'CVTouch',
          isCheck: false,
          number: '',
          hasTip: true
        },
        isDigitalSignage: {
          text: '数字标牌',
          isCheck: false,
          number: '',
          hasTip: true
        }
      },
      roomStatus: 0,
      roomName: '',
      nameWarning: false,
      sortNum: 0,
      // 可见范围
      range: '所有人',
      visibleDept: [],
      visibleUser: [],
      visibleUseTab: [
        { text: '部门' },
        { text: '标签人员' },
        { text: '特定人员' },
        { text: '批量导入' },
        { text: '高级筛选' }
      ],
      // 审批
      isAudit: false,
      auditTagIds: [],
      auditUserIds: [],
      auditUseTab: [
        { text: '标签' },
        { text: '标签人员' },
        { text: '特定人员' },
        { text: '批量导入' },
        { text: '高级筛选' }
      ],
      auditTagIdsArr: [],
      auditUserIdsArr: [],
      // 区域
      selectRegion: {},
      address: '',
      // 可容纳人数
      galleryful: '',
      whiteBoardWarning: false,
      digitalSignageWarning: false,
      otherDevices: '',
      // 默认会服人员
      givenUserIds: [],
      givenUseTab: [
        { text: '标签人员' },
        { text: '特定人员' },
        { text: '批量导入' },
        { text: '高级筛选' }
      ],
      remark: ''
    }
  },
  created() {
    if (this.roomId) {
      this.popData.popTitle = '编辑会议室'
      viewMeetRoom(
        {
          id: this.roomId
        },
        data => {
          let po = data.meetingRoomPO
          this.roomStatus = po.status
          this.roomName = po.roomName
          this.sortNum = po.sortNum
          this.range = po.ranges == '1' ? '所有人' : '特定对象'
          if (po.ranges == '3') {
            if (data.departList) {
              data.departList.forEach(item => {
                item.nodeName = item.departmentName
              })
              this.visibleDept = data.departList
            }
            this.visibleUser = data.personList || []
          }
          this.isAudit = po.isAudit == '1'
          if (this.isAudit) {
            this.auditTagIds = data.auditPersonVO.auditTagVOList || []
            this.auditUserIds = data.auditPersonVO.auditUserVOList || []
          }
          this.address = po.address
          this.galleryful = po.galleryful
          this.deviceConfig.ismultime.isCheck = po.ismultime == '1'
          this.deviceConfig.isprojector.isCheck = po.isprojector == '1'
          this.deviceConfig.isWhiteBoard.isCheck = po.isWhiteBoard == '1'
          this.deviceConfig.isWhiteBoard.number = data.boardIds || ''
          this.deviceConfig.isDigitalSignage.isCheck =
            po.isDigitalSignage == '1'
          this.deviceConfig.isDigitalSignage.number = data.signIds || ''
          this.otherDevices = po.otherDevices
          this.givenUserIds = data.defaultList || []
          this.remark = po.remark
        }
      )
    }
  },
  computed: {
    regionData() {
      let arr = []
      this.regionList.forEach(item => {
        arr.push({
          idx: item.id,
          val: item.id,
          optionName: item.itemName
        })
        if (item.id == this.regionId) {
          this.selectRegion = {
            idx: item.id,
            val: item.id,
            name: item.itemName
          }
        }
      })
      return arr
    },
    isVip() {
      return isVipGold(interfaceCode.INTERFACE_CODE_MEET)
    }
  },
  methods: {
    closePop() {
      this.$emit('listenToClosePop', false)
    },
    updateMeetingRoom() {
      if (!this.roomName) {
        this.nameWarning = true
        return
      }

      let range = this.range == '所有人' ? 1 : 3
      if (
        range == 3 &&
        this.visibleDept.length == 0 &&
        this.visibleUser.length == 0
      ) {
        _.alert('提示', '请选择可见范围特定对象')
        return
      }

      this.auditTagIds.forEach(item => {
        this.auditTagIdsArr.push(item.tagId || item.id)
      })
      this.auditUserIds.forEach(item => {
        this.auditUserIdsArr.push(item.userId || item.id)
      })

      this.checkAudit(this.auditTagIdsArr, this.auditUserIdsArr)
    },
    addOrEditRequest() {
      let self = this
      let deptIds = []
      let userIds = []
      let givenUserIds = []

      this.visibleDept.forEach(item => {
        deptIds.push(item.nodeId || item.deptId || item.id)
      })
      this.visibleUser.forEach(item => {
        userIds.push(item.userId || item.id)
      })
      this.givenUserIds.forEach(item => {
        givenUserIds.push(item.userId || item.id)
      })

      let params = {
        'meetingRoomPO.regionId': this.selectRegion.idx,
        'meetingRoomPO.id': this.roomId,
        'meetingRoomPO.status': this.roomStatus,
        'meetingRoomPO.roomName': this.roomName,
        'meetingRoomPO.sortNum': this.sortNum,
        a1: 'on',
        deptIds: deptIds.join('|'),
        userIds: userIds.join('|'),
        range: this.range == '所有人' ? 1 : 3,
        'meetingRoomPO.isAudit': this.isAudit ? 1 : 0,
        auditTagIds: this.auditTagIdsArr.join('|'),
        auditUserIds: this.auditUserIdsArr.join('|'),
        'meetingRoomPO.address': this.address,
        'meetingRoomPO.galleryful': this.galleryful,
        boardIds: this.deviceConfig.isWhiteBoard.number,
        signageIds: this.deviceConfig.isDigitalSignage.number,
        'meetingRoomPO.otherDevices': this.otherDevices,
        givenUserIds: givenUserIds.join('|'),
        'meetingRoomPO.remark': this.remark
      }
      for (let key in this.deviceConfig) {
        let device = this.deviceConfig[key]
        params['meetingRoomPO.' + key] = device.isCheck ? 1 : 0
      }

      if (this.roomId) {
        editMeetingRooom(params, () => {
          _.alert('提交结果', '保存成功', function() {
            self.$emit('listenToClosePop', true)
          })
        })
      } else {
        addMeetingRoom(params, () => {
          _.alert('提交结果', '新增成功', function() {
            self.$emit('listenToClosePop', true)
          })
        })
      }
    },
    checkAudit(auditTagIds, auditUserIds) {
      let self = this
      if (this.isAudit) {
        if (auditTagIds.length == 0 && auditUserIds.length == 0) {
          _.alert('提示', '请选择审批人')
          return
        } else {
          isNeedAudit(
            {
              auditTagIds: auditTagIds.join('|'),
              auditUserIds: auditUserIds.join('|'),
              isAudit: 1
            },
            data => {
              if (data.number == '0') {
                _.alert(
                  '提示',
                  '[审批人]添加的标签中没有具体成员，应用端发起会议时无法正常审批，确认保存？',
                  function() {
                    self.checkDeviceIds()
                  },
                  '保存',
                  true
                )
              } else {
                self.checkDeviceIds()
              }
            }
          )
        }
      } else {
        self.checkDeviceIds()
      }
    },
    checkDeviceIds() {
      let self = this
      let isWhiteBoard = this.deviceConfig.isWhiteBoard
      let isDigitalSignage = this.deviceConfig.isDigitalSignage

      if (isWhiteBoard.isCheck && isWhiteBoard.number == '') {
        this.whiteBoardWarning = true
        return false
      }

      if (isDigitalSignage.isCheck && isDigitalSignage.number == '') {
        this.digitalSignageWarning = true
        return false
      }

      // 校验设备号
      if (isWhiteBoard.isCheck || isDigitalSignage.isCheck) {
        checkSignageId(
          {
            roomId: this.roomId,
            whiteBoardIds: isWhiteBoard.number,
            signageIds: isDigitalSignage.number
          },
          result => {
            let sameIds = ''
            if (result.data.signageIds || result.data.boardIds) {
              if (result.data.boardIds) {
                sameIds = result.data.boardIds
                isDigitalSignage.number = result.data.boardIds
              }
              if (result.data.signageIds) {
                sameIds =
                  (sameIds ? sameIds + ';' : '') + result.data.signageIds
                isWhiteBoard.number = result.data.signageIds
              }
              _.alert(
                '提示',
                '设备号' +
                  sameIds +
                  '已被其他会议室绑定，是否解除其绑定，重新进行绑定',
                function() {
                  self.addOrEditRequest()
                },
                '确定',
                true
              )
            } else {
              self.addOrEditRequest()
            }
          }
        )
      } else {
        self.addOrEditRequest()
      }
    },
    changeName() {
      this.nameWarning = this.roomName == ''
    },
    changeRange(val) {
      this.range = val
    },
    chooseVisible(dept, tag, user) {
      this.visibleDept = dept
      this.visibleUser = user
    },
    chooseAudit(dept, tag, user) {
      this.auditTagIds = tag
      this.auditUserIds = user
    },
    chooseRegion(optionName, val) {
      this.selectRegion = {
        idx: val,
        val: val,
        name: optionName
      }
    },
    chooseGiven(dept, tag, user) {
      this.givenUserIds = user
    },
    changeBoardNum() {
      this.whiteBoardWarning = this.deviceConfig.isWhiteBoard.number == ''
    },
    changeSignageNum() {
      this.digitalSignageWarning =
        this.deviceConfig.isDigitalSignage.number == ''
    }
  },
  components: {
    PopBase,
    qwuiInput,
    qwuiCheckbox,
    qwuiSelect,
    pickExam
  }
}
</script>

<style lang="scss" scoped>
.qwui-pop_base /deep/ .contentItem {
  padding-left: 50px;
}
.qwui-item_box {
  padding-bottom: 10px;
  margin-bottom: 30px;
  border-bottom: 1px dashed #ddd;
}
.qwui-input_item {
  margin-bottom: 10px;

  .itemTitle {
    margin-bottom: 5px;
    padding-top: 5px;
    width: 130px;
    display: inline-block;
    vertical-align: top;
    text-align: right;
  }
  .areaStyle /deep/ .qw_textarea {
    width: 340px;
  }
  .star {
    margin-right: 5px;
    color: red;
  }
  .itemPick {
    display: inline-block;

    .pickExam /deep/ .qwui-click_choose {
      max-width: 320px;
    }
  }
  .selectStyle {
    width: 340px;
    display: inline-block;
  }
  .checkItem {
    display: inline-block;
    margin-right: 5px;
  }
  .tipIcon {
    margin: 7px 0 0 5px;
    display: inline-block;
    position: relative;
    width: 16px;
    height: 16px;
    vertical-align: top;
    background: url('~assets/svg/ic_q.svg') no-repeat;

    &:hover {
      cursor: pointer;

      .tipDesc {
        display: inline-block;
      }
    }

    .tipDesc {
      display: none;
      position: absolute;
      left: -250px;
      top: 25px;
      padding: 10px;
      max-width: 278px;
      min-width: 278px;
      min-height: 20px;
      height: auto;
      background: white;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
      color: #666;
      z-index: 20;

      &:before {
        position: absolute;
        left: 250px;
        top: -15px;
        content: '';
        font-size: 20px;
        border-color: transparent transparent #fff;
        border-style: dashed dashed solid;
        border-width: 8px;
      }
      a {
        color: #f87b00;
      }
    }
  }
}
.qwui-vip_tip {
  vertical-align: -webkit-baseline-middle;
  margin-left: 10px;
  color: #f87b00;
  cursor: pointer;
}
</style>
