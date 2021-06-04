<template>
  <div>
    <table class="rewards-table">
      <tr>
        <th class="borderR">序号</th>
        <th class="borderR">项目</th>
        <th class="borderR">责任人</th>
        <th class="borderR">完成时间</th>
        <!-- <th>文件编号</th> -->
        <th class="borderR">参会人</th>
        <th>图片</th>
      </tr>
      <tr v-for="(item,index) in columns" :key="index">
        <td class="borderR">{{index+1}}</td>
        <td class="borderR">{{item.projectName || '-'}}</td>
        <td class="borderR">{{item.projectLeader || '-'}}</td>
        <td class="borderR">{{item.finishedTime || '-'}}</td>
        <td class="borderR">{{item.attendee || '-'}}</td>
        <!-- href=”javascript:;”就是去掉a标签的默认行为 -->
        <td><a href="javascript:;" @click="overlook(item.projectImage)">查看</a></td>
      </tr>
      <tr v-if="columns && columns.length===0"><td colspan="6">暂无数据</td></tr>
    </table>

    <div class="show_send_back_btn" @click="handleClickSendBack">
      {{!isShowSendBackTable?'查看':'隐藏'}}退回记录
      <span class="arrow" :class="{'arrow_hide':isShowSendBackTable}">
        <img src="../../images/icon_arrow_d.png" alt="">
      </span>
    </div>

    <table class="rewards-table" v-show="isShowSendBackTable">
      <tr>
        <th class="borderR" style="width: 70%">退回原因</th>
        <th class="borderR">退回人</th>
        <th class="borderR">退回时间</th>
      </tr>
      <tr v-for="(item,index) in sendBackcolumns" :key="index">
        <td class="borderR" style="padding: 13px 10px 11px 10px">{{item.rtnReason || '-'}}</td>
        <td class="borderR">{{item.rtnPerson || '-'}}</td>
        <td class="borderR">{{item.rtnTime || '-'}}</td>
      </tr>
      <tr v-if="sendBackcolumns && sendBackcolumns.length===0"><td colspan="3">暂无数据</td></tr>
    </table>

    <div class="distrInfo">
      <div class="autograph">
        <span class="nameLabel">反馈人姓名：</span>
        <span class="nameWrap">
          {{getCreateUser}}
        </span>
      </div>
      <div class="autograph">
        <span class="nameLabel">总经理签名：</span>
        <span class="nameWrap">
          <img v-if="getSign1" :src="getSign1" alt="">
        </span>
      </div>
      <div class="autograph">
        <span class="nameLabel">投资人签名（必填）：</span>
        <span class="nameWrap">
          <img v-if="getSign" :src="getSign" alt="">
        </span>
      </div>
    </div>
    <!--    照片弹框 start-->
    <div>
      <multiplePhotoPop v-model="isPhotoShow" :images="images" @closePhotoPop="closePhotoPop"></multiplePhotoPop>
    </div>
  </div>
</template>

<script>
  import multiplePhotoPop from './multiplePhotoPop'
  export default {
    data() {
      return {
        isPhotoShow: false,
        img:'',
        images: [],
        isShowSendBackTable: false,
      }
    },
    props:{
        columns:{
          type: Array,
          default(){
            return []
          }
        },
        sendBackcolumns:{
          type: Array,
          default(){
            return []
          }
        },
        salesreport:{
          type: Object,
          default(){
            return {}
          }
        },
        feedbackUser:{
          type: String,
          default(){
            return '-'
          }
        }
    },
    computed: {
      getTotal(){
        const total = this.columns.reduce((previousValue, currentValue)=>{
          const current = parseFloat(currentValue.rewardsAmount)
          return previousValue + current;
        }, 0)
        return total.toFixed(2)
      },
        getSign(){
            const path = this.columns && this.columns[0] && this.columns[0].investorSign? this.columns[0].investorSign: ''
            return path? _.fileDownURL + path: '';

        },
        getSign1(){
            const path = this.columns && this.columns[0] && this.columns[0].generalManagerSign? this.columns[0].generalManagerSign: ''
            return path? _.fileDownURL + path: '';

        },
        getCreateUser(){
            return this.columns && this.columns[0] && this.columns[0].createUser? this.columns[0].createUser: ''

        }
    },
    components: {
        multiplePhotoPop,
    },
    methods:{
      overlook(img) {
       const images = img.split('##').filter(item=> !!item)
        this.images = images
        this.isPhotoShow = true
      },
      // 关闭图片弹框
      closePhotoPop() {
        this.isPhotoShow = false
      },
      handleClickSendBack() {
        this.isShowSendBackTable = !this.isShowSendBackTable
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rewards-table{
    margin-top: 10px;
    tr{
      border:1px solid #D5D5D5;
      background: #f7f7f7;
    }
    tr:nth-child(odd){
      background: #fff;
    }
  }
  .show_send_back_btn {
    width: 130px;
    cursor: pointer;
    position: relative;
    .arrow {
      margin-left: 8px;
      position: absolute;
      width: 13px;
      img {
        width: 100%;
      }
    }

    .arrow_hide {
      transform: rotate(180deg);
    }
  }
</style>
