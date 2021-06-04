<template>
  <div class="reim-detail_container" v-if="isShowReimdetail">
    <!-- 详情标题 -->
    <div class="reim-detail">
      <div class="reim-detail_title">
        <span class="reim-detail_title_name">{{detail.title}}</span>
        <apply-status :applystatus="filterStatus"></apply-status>
      </div>
      <div class="reim-detail_date">
        <span class="reim-detail_date_time">{{detail.createTime | formatDate}}</span>
        <span class="reim-detail_date_name" @click.stop="atThisPersonUtil(detailData)">{{detail.personName}}</span>
      </div>
      <span class="reim-detail_reim_No">{{detail.reimType}} | 报销单编号：{{detail.reimNo}}</span>
    </div>

    <!-- 详情列表内容 -->
    <div class="reim-detail_content_list" v-for="(item,index) in detailList" :key="item.id">
      <!-- 详情内容 -->
      <div class="reim-detail_content"
           :class="textColor(item) ? 'reim-detail_warn' : 'reim-detail_normal'"
           v-show="!item.isShow"
           @click="item.isShow=true">
        <div class="reim-detail_content_top">
          <span class="reim-detail_content_no" :class="textColor(item) ? 'reim-text_warn' : 'reim-text_normal'">{{index+1 | getIndex}}</span>
          <div class="reim-detail_content_time">
            <span class="reim-detail_content_starttime">{{item.time}} 至</span>
            <span class="reim-detail_content_endtime">{{item.endTimes}}</span>
          </div>
        </div>
        <div class="reim-detail_content_center">
          <span class="reim-detail_content_name">{{item.subjFullName}}</span>
          <span class="reim-detail_content_price">￥{{item.money}}</span>
        </div>
        <div class="reim-detail_content_budget">{{getMoney(item)}}</div>
        <div class="reim-detail_content_budget">{{getBudget(item)}}</div>
      </div>
      <!-- 详情明细列表-->
      <div class="reim-detail_list" v-show="item.isShow">
        <div class="reim-detail_list_head border-bottom-1px"
             :class="textColor(item) ? 'reim-detail_warn' : 'reim-detail_normal'"
             @click="item.isShow=false">
          <span class="reim-detail_list_no" :class="textColor(item) ? 'reim-text_warn' : 'reim-text_normal'">{{index+1 | getIndex}}</span>
          <img class="reim-detail_list_arrow" src="~assets/images/icon_down_gray.png">
        </div>
        <div class="reim-detail_list_content border-bottom-1px">
          <span class="reim-detail_list_cost">成本中心</span>
          <span class="reim-detail_list_name">{{item.projName}}</span>
        </div>
        <div class="reim-detail_list_content border-bottom-1px" v-if="item.deptName">
          <span class="reim-detail_list_cost">所属部门</span>
          <span class="reim-detail_list_name">{{item.deptName}}</span>
        </div>
        <div class="reim-detail_list_content border-bottom-1px">
          <span class="reim-detail_list_cost">报销科目</span>
          <span class="reim-detail_list_name" :class="{'reim-detail_list_subject' : subName(item) }">{{item.subjFullName}}</span>
          <span class="reim-reim_remark"
                v-if="subName(item)"
                @click="showRemark(item)">
          </span>
        </div>
        <div class="reim-detail_list_content border-bottom-1px" v-if="item.cityName">
          <span class="reim-detail_list_cost">产生城市</span>
          <span class="reim-detail_list_name">{{item.cityName}}</span>
        </div>
        <div class="reim-detail_list_content border-bottom-1px">
          <span class="reim-detail_list_cost">产生日期</span>
          <span class="reim-detail_list_name">{{item.time}}至{{item.endTimes}}</span>
        </div>
        <div class="reim-detail_amount_budget  border-bottom-1px">
          <span class="reim-detail_list_cost">金额（元）</span>
          <span class="reim-detail_list_name">{{item.money}}</span>
          <div class="reim-detail_list_budget">{{getMoney(item)}}</div>
          <div class="reim-detail_list_budget">{{getBudget(item)}}</div>
        </div>
        <div class="reim-detail_list_content border-bottom-1px" v-if="item.invoice">
          <span class="reim-detail_list_cost">发票张数</span>
          <span class="reim-detail_list_name">{{item.invoice}}</span>
        </div>
        <div class="reim-detail_list_content" v-if="item.remark">
          <span class="reim-detail_list_cost">备注</span>
        </div>
        <div class="reim-detail_list_content reim-detail_list_remark border-bottom-1px" v-if="item.remark">
          <span class="reim-detail_cost">{{item.remark}}</span>
        </div>
        <div class="reim-detail_list_images" v-if="showImg(item)">
          <div class="reim-detail_list_cost">图片</div>
        </div>
        <div class="reim-detail_list_content reim-detail_imgList border-bottom-1px" v-if="showImg(item)">
          <span class="reim-detail_list_img"
                v-for="list in item.imgList"
                :key="list.id">
            <img
              class="reim-detail_list_preview"
              :src="dataDetailMsg(list.picPath)"
              @click="previewImg(list.picPath,item.imgList)"
            >
          </span>
        </div>

        <!-- 用车单 -->
        <div class="reim-detail_list_images" v-if="item.carAskId">
          <div class="reim-detail_list_cost">用车单</div>
        </div>
        <div class="reim-detail_list_content reim-detail_pad_bot border-bottom-1px" v-if="item.carAskId">
          <qw-relation-card
            :relationData="carInvoice(item)"
            @chooseRelation="getVehDetail(item.carAskId)">
          </qw-relation-card>
        </div>

        <!-- 出差单 -->
        <div class="reim-detail_list_images" v-if="item.askId">
          <div class="reim-detail_list_cost">请假出差单</div>
        </div>
        <div class="reim-detail_list_content reim-detail_pad_bot border-bottom-1px" v-if="item.askId">
          <qw-relation-card
            :relationData="askInvoice(item)"
            @chooseRelation="updateAskDetail({isShow: true, data: item})">
          </qw-relation-card>
        </div>

        <!-- 电子发票 -->
        <div class="reim-detail_list_images" v-if="item.fapiaoInfo.length">
          <div class="reim-detail_list_cost">电子发票</div>
        </div>
        <div class="reim-detail_list_content border-bottom-1px reim-detail_pad_bot" v-if="item.fapiaoInfo.length">
          <qw-relation-card
            title="电子发票"
            v-for="(fapiao, faIndex ) in item.fapiaoInfo"
            :key="fapiao.card_id"
            :relationData="showWxCardInfo(fapiao)"
            @chooseRelation="$emit('showWxCardDetail', index)"
          ></qw-relation-card>
        </div>

        <!--自定义字段-->
        <div v-for="field in item.reimCustomFieldDataList">
          <div v-if="field.value">
            <!--多行-->
            <div class="reim-detail_list_desc border-bottom-1px" v-if="filterTextContent(field)">
              <div class="reim-detail_list_desclabel">{{field.customName}}</div>
              <span class="reim-detail_list_name">{{field.value}}</span>
            </div>
            <!--其他-->
            <div class="reim-detail_list_content  border-bottom-1px" v-else>
              <span class="reim-detail_list_cost">{{field.customName}}</span>
              <span class="reim-detail_list_name clearfix">
                <span  class="reim-detail_list_textcontent">{{field.value}}</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- 明细区域 -->
    <div class="reim-detail_region border-bottom-1px">
      <div class="reim-detail_region_title border-bottom-1px">明细费用</div>
      <div class="reim-detail_region_total">
        <span class="reim-detail_total_name">明细总计</span>
        <span class="reim-detail_total_price">￥{{detail.totalMoney}}</span>
      </div>
      <div class="reim-detail_region_bot">
        <span class="reim-detail_region_num">{{region}}明细</span>
        <span class="reim-detail_region_firm" v-if="totalAskNum != 0">{{totalAskTitle()}}</span>
        <span class="reim-detail_region_firm" v-if="totalVehNum != 0">{{totalVehTitle()}}</span>
        <span class="reim-detail_region_invoice" v-if="totalWxCard !=0">{{totalWxCard}}电子发票</span>
      </div>
    </div>

    <div v-if="detail.loanId">
      <div class="total_field border-bottom-1px">
        <div class="total_field_label">核销金额</div>
        <div class="total_field_content">{{detail.verificationMoney}}</div>
      </div>
      <div class="total_field border-bottom-1px">
        <div class="total_field_label">应付金额</div>
        <div class="total_field_content">{{detail.payableMoney || '0.00'}}</div>
      </div>
    </div>

    <!-- 结算方式 -->
    <div class="total_field border-bottom-1px" v-if="detail.settleStr">
      <div class="total_field_label">结算方式</div>
      <div class="total_field_content">{{detail.settleStr}}</div>
    </div>

    <div class="total_field" v-if="detail.actualMoney !== ''">
      <div class="total_field_label">实付金额</div>
      <div class="total_field_content">{{detail.actualMoney}}</div>
    </div>

    <!--全局字段--备注-->
    <div class="reim-global_remarks" v-if="detail.globalRemark">
      <div class="reim-remarks_label">备注</div>
      <div class="reim-remarks_content">{{detail.globalRemark}}</div>
    </div>

    <!-- 银行汇款信息 -->
    <div class="reim-detail_bank" v-if="bankInfo">
      <div class="reim-detail_bank_info border-bottom-1px" @click="showDetailBankContent">
        <span class="reim-detail_bank_name">银行汇款信息</span>
        <span class="reim-detail_bank_arrow" :class="{'reim-detail_arrowImg':isShowBankContent}">
          <img class="reim-detail_bank_img" src="~assets/images/icon_down_gray.png">
        </span>
      </div>
      <div class="reim-detail_bank_content" v-if="isShowBankContent">
        <div class="reim-detail_bank_row border-bottom-1px" v-if="detail.receiptFullName">
          <span class="reim-detail_bank_title">收款单位名称</span>
          <span class="reim-detail_bank_data">{{detail.receiptFullName}}</span>
        </div>
        <div class="reim-detail_bank_row border-bottom-1px" v-if="detail.bankAccount">
          <span class="reim-detail_bank_title">银行账户</span>
          <span class="reim-detail_bank_data">{{detail.bankAccount}}</span>
        </div>
        <div class="reim-detail_bank_row" v-if="detail.depositBank">
          <span class="reim-detail_bank_title">开户银行</span>
          <span class="reim-detail_bank_data">{{detail.depositBank}}</span>
        </div>
      </div>
    </div>

    <!-- 附件 -->
    <div class="reim-detail_attachment" v-if="showAttach">
      <div class="reim-detail_attachment_info" @click="showAttachment">
        <span class="reim-detail_attachment_name">附件</span>
        <span class="reim-detail_attachment_arrow" :class="{ 'reim-detail_arrowImg':isShowAttachment }">
          <img class="reim-detail_attachment_img" src="~assets/images/icon_down_gray.png">
        </span>
      </div>
      <div class="reim-detail_attachment_content" v-if="isShowAttachment">
        <add-file-list v-if="mediaList && mediaList.length"
                       agent="reimbursement"
                       customClass="file_list_len"
                       :filesList="mediaList"
                       :deleteFile="false"
                       :downLoad="true">
        </add-file-list>
      </div>
    </div>

    <!-- 请假详情 -->
    <qw-ask-detail v-if="isShowAskDetail"></qw-ask-detail>

    <!-- 车单详情 -->
    <qw-veh-detail v-if="isShowVehDetail"></qw-veh-detail>

    <!-- 电子发票 -->
    <qw-invoice-detail v-if="isShowWxCardDetail"></qw-invoice-detail>

    <!--底部返回按钮-->
    <flow-button class="reim-back_btn" :buttondata="buttonConfig"></flow-button>
  </div>
</template>
<script>
  import FlowButton from '@/components/button/flow_button'; //底部返回按钮
  import applyStatus from '@/components/part/apply_status'; //审批状态
  import QwRelationCard from '../../../components/reimbursement/RelationCard'; //引入发票的组件
  import addFileList from '@/components/add/upload/addFileList'; //附件列表
  //发票组件
  import QwAskDetail from '../../../components/reimbursement/AskDetail';
  import QwVehDetail from '../../../components/reimbursement/VehDetail';
  import QwInvoiceDetail from '../../../components/reimbursement/InvoiceDetail';

  import { getVehDetail } from '../../../api/editor';   //获取用车单详情
  import { getSimpleReimDetail } from '../../../api/debit';   //获取关联的报销单详情
  import EventBus from '@/utils/eventBus';

  import {
    mapState,
    mapGetters,
    mapMutations
  } from 'vuex';
  export default {
    name: 'reimDetail',
    components: {
      FlowButton,
      applyStatus,
      QwRelationCard,
      addFileList,
      // 发票
      QwAskDetail,
      QwVehDetail,
      QwInvoiceDetail
    },
    props:{
      isShowReimdetail:{
        type: Boolean,
        default: false
      },
      reimId:{
        type: String,
        default: ''
      }
    },
    filters: {
      //如果创建时间是当年则不显示年份,不是则不显示时间
      formatDate(time) {
        return _.getFormatTime(time);
      },
      getIndex(num) { //序号
        return num < 10 ? '0' + num : num;
      }
    },
    data() {
      return {
        detail:{
          //头部信息
          title: '', //报销单标题
          reimNo: '', //报销单编号
          createTime: '', //创建时间
          reimType: '', //单据类型名称
          personName: '', //创建人名称
          statusDesc: '', //报销单状态

          //报销单明细详情
          totalMoney: '', //报销单金额
          receiptFullName: '', //收款单位全称
          bankAccount: '', //银行账号
          depositBank: '', //开户银行
          globalRemark:'', //全局备注

          verificationMoney: '', // 核销金额
          payableMoney: '', // 应付金额
          settleStr: '',      //结算方式
          actualMoney: '', //实付金额
          loanId:''       //关联借款单id
        },
        detailList: [], //报销明细
        fapiaoInfo: [],  //电子发票信息
        isShowBankContent:false, //银行列表
        isShowAttachment: false, //附件信息
        mediaList: [], //附件

        region:0,//明细数量
        totalWxCard:0,//电子发票总计
        bankInfo:false,//银行数据
        showAttach:false,//附件的显示和隐藏
        totalAskNum:0,//请假单总计
        totalVehNum:0,//用车单总计
        filterStatus:{},//审批状态




        wxCardDetail: null,

        //操作按钮
        buttonConfig:{
          primaryList:[],
          defaultList:[
            { type: 'default', name:'i18n.returnBack', callBack: this.hideReimDetail},
          ],
          //按钮是否置底部 active :底部、"":相对定位
          class: 'active'
        },
      }
    },
    created() {
      EventBus.$on('openReimDetail', (reimId) => {
        this.getSimpleReimDetail(reimId);
      })
    },
    computed: {
      ...mapGetters([
        'isShowAskDetail', //发票单
        'isShowVehDetail', //用车单
//        'isShowLoanDetail' //借款单
        'isShowWxCardDetail',
      ]),
      ...mapState({
        detailData: state => state.detail.detailData, // 详情内容数据
      }),
    },
    methods: {
      ...mapMutations([
        'showAskDetail', //出差请假单详情
        'showVehDetail', //用车单详情
      ]),
      ...mapMutations([
        'updateAskDetail', //出差请假单详情
        'updateVehDetail', //用车单详情
        'updateWxCardDetail',
//        'updateLoanDetail' // 更新关联借款详情
      ]),
      getSimpleReimDetail(reimId){
        getSimpleReimDetail({reimId:reimId}).then(res=>{
          var self = this;
          if(res.code == 0){
            self.detail = Object.assign(self.detail,res.data.detail);
            self.detailList = res.data.detail.detailList.map((item) => {
              item.isShow = false;
              return item;
            });
            // 附件列表
            self.mediaList = res.data.mediaList || [];

            self.region = self.detailList.length;//明细数量
            self.totalWxCard = self.fapiaoInfo.length;//电子发票总计
            if(self.detail.receiptFullName || self.detail.bankAccount || self.detail.depositBank){
              self.bankInfo = true;//银行数据
            }
            self.showAttach= self.mediaList.length > 0 ? true : false;//附件的显示和隐藏
            self.totalAskNum = self.totalAsk();//请假单总计
            self.totalVehNum = self.totalVeh();//用车单总计

            this.getFilterStatus();
          }else {
            _.alert("i18n.notice",res.desc);
          }
        })
      },
      // 请假单总计
      totalAsk() {
        let count = 0;
        for(let i=0;i<this.detailList.length;i++) {
          if(this.detailList[i].askId != '') {
            count += 1;
          }
        }
        return count;
      },
      // 用车单总计
      totalVeh() {
        let count = 0;
        for(let i=0;i<this.detailList.length;i++) {
          if(this.detailList[i].carAskId != '') {
            count += 1;
          }
        }
        return count;
      },
      //审批状态
      getFilterStatus() {
        let classN = '';
        switch (this.detail.statusDesc) {
          case "审批中":
            classN = "status_blue";
            break;
          case "已审批":
            classN = "status_green";
            break;
          case "已结束":
            classN = "status_gray";
            break;
          case "已关闭":
            classN = "status_gray";
            break;
          case "已转账":
            classN = "status_gray";
            break;
          case "已取消":
            classN = "status_gray";
            break;
          case "已退审":
            classN = "status_red";
            break;
          default:
            classN = "status_gray";
        }
        this.filterStatus =  {
          name: this.detail.statusDesc ? this.detail.statusDesc : '',
          class: classN,
          active: true
        }
      },
      // 报销科目
      subName(item) {
        return item.subjFullName && item.subjExplain;
      },
      // 科目点击说明
      showRemark(item) {
        _.alert("科目备注",item.subjExplain,"确定");
      },
      // 数字颜色
      textColor(item) {
        return item.budgetState=='1' || item.state=='1';
      },
      // 查看个人头像信息
      atThisPersonUtil(user) {
        if (user) {
          EventBus.$emit("atThisPersonUtil", user);
        }
      },
      //银行信息
      showDetailBankContent() {
        this.isShowBankContent = !this.isShowBankContent;
      },
      // 金额的超额
      getMoney(obj) { //金额的预算和超额
        let str2 = '';
        if (obj.state == 1) { //1为标准超额
          let limitCycle = '';
          if (obj.limitCycle == 1) {
            limitCycle = '每日';
          } else if (obj.limitCycle == 2) {
            limitCycle = '每周';
          } else {
            limitCycle = '每月';
          }
          str2 = '该科目' + limitCycle + '限额' + obj.limitMoney + '元,超额' + obj.surplusMoney + '元';
        }
        return str2;
      },
      // 金额的预算
      getBudget(obj) {
        let str1 = '';
        if (obj.code == 1) { //code有无设置预算  0无 1有
          if (obj.budgetState == 1) { //budgetState预算是否超额 0未超额 1超额
            let startMonth = new Date(obj.time).getMonth() + 1;
            let endMonth = new Date(obj.endTimes).getMonth() + 1;
            if (startMonth == endMonth) {
              str1 = `超过${startMonth}月预算`;
            } else {
              str1 = `超过${startMonth}至${endMonth}月预算`;
            }
            str1 += `${obj.exceedMoney}元`;
          } else {
            str1 = "";
          }
        }
        return str1;
      },
      //图片列表
      showImg(reim) {
        return reim.imgList.length > 0 ? true : false;
      },
      //预览附件
      openPreviewFile(item) {
        _.wxqyh_previewFile(item.id, item.url, item.fileName, item.fileExt);
      },
      //下载附件
      downloadFileClick(item) {
        _.wxqyh_downloadFile(item.id, item.url, item.fileName);
      },
      // 图片
      dataDetailMsg(src) {
        return _.compressURL + src;
      },
      //预览图片
      previewImg(src,list){
        let previewImageURL = _.compressURL + src;
        EventBus.$emit("previewImages",previewImageURL.replace('/compress',''),list);
      },
      //用车单
      carInvoice(reimData) {
        return {
          title: "用车单",
          name: reimData.carTitle,
          price: "费用:" + reimData.luqiaoFee,
          time: "用车时间:" + reimData.takeTime
        }
      },
      //出差单
      askInvoice(reimData) {
        return {
          title: "请假单", //标题
          name: reimData.title,
          price: "时长:" + reimData.sumAskDays + "天",
          time: "开始时间:" + reimData.startTime
        }
      },
      // 显示发票详情
      showWxCardInfo(fapiao) {
        return {
          title: '电子发票',
          name: fapiao.gmfMc,
          price: `金额：${fapiao.xsfMc}`,
          time: fapiao.kprq,
        }
      },
      // 电子发票详情
      showWxCardDetail(fapiao) {
        this.updateWxCardDetail({isShow: true, data: fapiao});
      },
      // 用车单详情
      getVehDetail(askId) {
        _.showLoading();
        getVehDetail({ askId, size: 10 }).then((res) => {
          this.updateVehDetail({ isShow: true, data:res.data.detail });
          _.hideLoading();
        });
      },
      //自定义字段多行，判断是否有换行，有则文字靠左显示，无则换行
      filterTextContent(item){
        var regu =/\n\r|\n|\r/g;
        if(item.value) {
          return item.dataType === 'DESC' || regu.test(item.value);
        }
      },
      // 请假出差单标题
      totalAskTitle() {
        let askName = "请假出差单,"
        if(!this.totalVehNum) {
          askName = this.totalAskNum + askName.replace(',','');
        } else {
          askName = this.totalAskNum + askName;
        }
        return askName;
      },
      // 用车单标题
      totalVehTitle() {
        let vehName = "用车单,";
        if(!this.totalWxCard) {
          vehName = this.totalVehNum + vehName.replace(',','');
        } else {
          vehName = this.totalVehNum + vehName;
        }
        return vehName;
      },
      //附件
      showAttachment() {
        this.isShowAttachment = !this.isShowAttachment;
      },
      hideReimDetail(){
        this.$emit('update:isShowReimdetail',false);
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '~../../../styles/mixin.scss';
  @import '~../../../styles/variable.scss';
  .reim-detail_container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 15;
    padding-bottom: 80px;
    font-size: 15px;
    background-color: #F7F7F7;
    overflow-y: auto;

    .reim-relative {
      position: relative;
    }
    .reim-height_margin {
      height: 15px;
    }
    .reim-height_bottom {
      height: 50px;
    }
    .reim-detail_arrowImg {
      transform: rotate(180deg);
    }
    .reim-detail_warn {
      border-left: 5px solid $money-status-warn;
    }
    .reim-detail_normal {
      border-left: 5px solid $money-status-normal;
    }
    .reim-text_warn {
      color: $money-status-warn;
    }
    .reim-text_normal {
      color: $money-status-normal;
    }
    .reim-detail {
      padding: 15px;
      background-color: $color-background;
    .reim-detail_title {
      line-height: 27px;
      color: #333333;
      font-size: $font-size-large;
      word-break: break-word;
      font-weight: 500;
      margin-bottom: 7px;
    .reim-detail_title_name {
      vertical-align: middle;
    }
    }
    .reim-detail_date {
      font-size: $font-size-medium-s;
      margin-bottom: 7px;
    .reim-detail_date_time {
      display: inline-block;
      color: $color-text-sub;
      margin-right: 10px;
    }
    .reim-detail_date_name {
      color: $color-text-sub;
    }
    }
    .reim-detail_reim_No {
      display: inline-block;
      color: $color-text-sub;
      font-size:$font-size-medium-s;
    }
    }
    .reim-detail_content_list {
      background-color: $color-background;
    .reim-detail_content {
      padding: 18px 40px 18px 18px;
      clear: both;
      margin-top: 10px;
      position: relative;
    &::after {
       content: '';
       position: absolute;
       top: 50%;
       right: 16px;
       margin-top: -4px;
       width: 8px;
       height: 8px;
       border-top: 1px solid $icon-border-color;
       border-right: 1px solid $icon-border-color;
       transform: rotate(45deg);
     }
    .reim-detail_content_no {
      display: inline-block;
      font-size: $font-size-large-s;
    }
    .reim-detail_content_time {
      float: right;
      color: $color-text-tip;
      font-size: $font-size-small;
    }
    .reim-detail_content_center {
      clear: both;
      color:#333333;
      position: relative;
    .reim-detail_content_name {
      font-size: $font-size-medium-x;
      display: inline-block;
      width: 128px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .reim-detail_content_price {
      float: right;
      font-size: $font-size-medium-x;
      font-weight: bold;
    }
    }
    .reim-detail_content_budget {
      font-size: $font-size-small;
      text-align: right;
      color: $money-status-warn;
    }
    }
    .reim-detail_list {
      width: 100%;
      background-color: $color-background;
      margin-top: 10px;
    .reim-detail_list_head {
      height: 50px;
      line-height: 50px;
    .reim-detail_list_no {
      display: inline-block;
      width: 16px;
      height: 15px;
      font-size: $font-size-large-s;
      font-weight: Semibold;
      margin-left: 16px;
    }
    .reim-detail_list_arrow {
      float: right;
      width: 14px;
      height: 8px;
      margin-top: 21px;
      margin-right: 16px;
      transform: rotate(180deg);
    }
    }
    .reim-detail_list_content {
      margin-left: 16px;
      padding: 18px 16px 18px 0;
      display: flex;
      font-size: $font-size-medium-x;
    .reim-detail_list_cost {
      width: 100px;
      display: inline-block;
      text-align: left;
      color: $color-text-sub;
    }
    .reim-detail_list_name {
      flex: 1;
      padding-left: 30px;
      text-align: right;
      color: $color-text-d;
      word-break: break-all;
      white-space: pre-wrap;
    .reim-detail_list_textcontent{
      text-align: left;
      float: right;
    }
    }
    .reim-detail_list_subject {
      padding-right:16px;
    }
    .reim-reim_remark {
      position: relative;
      font-size: $font-size-small;
      color: #586C94;
    &::before {
       content: '';
       position: absolute;
       top: 50%;
       right: 0px;
       transform: translateY(-50%);
       width: 13px;
       height: 13px;
       background: url('~assets/images/icon_help.png') no-repeat center center;
       background-size: 13px 13px;
     }
    }
    .reim-detail_list_img {
      display: inline-block;
      margin-right: 13px;
    .reim-detail_list_preview {
      width:45px;
      height: 45px;
    }
    }
    }
    .reim-detail_list_remark {
      padding: 0 16px 18px 0;
      word-break: break-all;
    .reim-detail_cost {
      text-align: left;
      color: $color-text-d;
      white-space: pre-wrap;
    }
    }
    .reim-detail_list_desc{
      margin-left: 16px;
      padding: 18px 16px 18px 0;
      font-size: $font-size-medium-x;
    .reim-detail_list_desclabel{
      color: $color-text-sub;
      margin-bottom: 18px;
    }
    .reim-detail_list_name{
      display: inline-block;
      color: #333;
      white-space: pre-wrap;
      word-break: break-all;
    }
    }
    .reim-detail_pad_bot {
      padding-top: 0px;
    }
    .reim-detail_imgList {
      padding-top: 0px;
      flex-wrap: wrap;
    }
    .reim-detail_amount_budget {
      margin-left: 16px;
      padding: 18px 16px 18px 0;
      font-size: $font-size-medium-x;
    .reim-detail_list_cost {
      display: inline-block;
      color: $color-text-sub;
    }
    .reim-detail_list_name {
      display: inline-block;
      float: right;
      color: $color-text-d;
      text-align: right;
    }
    .reim-detail_list_budget {
      text-align: right;
      font-size: $font-size-small;
      color: $money-status-warn;
    }
    }
    .reim-detail_list_images {
      height: 50px;
      line-height: 50px;
      margin-left: 16px;
    .reim-detail_list_cost {
      width: 82px;
      height: 16px;
      color: $color-text-sub;
      font-size: $font-size-medium-x;
      font-family: PingFangSC-Regular;
    }
    }
    }
    }
    .reim-detail_region {
      background-color: $color-background;
      margin-top: 10px;
    .reim-detail_region_title {
      font-size: $font-size-medium-x;
      color: #333;
      padding:16px;
      margin-bottom:18px;
    }
    .reim-detail_region_total {
      padding:0 16px 7px 16px;
    .reim-detail_total_name {
      display: inline-block;
      color: $color-text-sub;
      font-size: $font-size-medium-s;
    }
    .reim-detail_total_price {
      float: right;
      color: #333333;
      font-size: $font-size-medium-x;
      font-weight: bold;
    }
    }
    .reim-detail_region_bot {
      font-size: $font-size-small;
      padding:0 0 14px 16px;
      color: $color-text-tip;
    }
    }
    .reim-global_remarks{
      margin-top: 10px;
      background-color: $color-background;
      font-size: 16px;
      padding: 15px;
    .reim-remarks_label{
      color: $color-text-d;
      margin-bottom: 10px
    }
    .reim-remarks_content{
      word-break: break-all;
      white-space: pre-wrap;
    }
    }

    .total_field {
      display: flex;
      height: 50px;
      line-height: 50px;
      padding: 0 16px;
      font-size: 16px;
      background: #fff;
    .total_field_label {
      color: #666;
    }
    .total_field_content {
      flex: 1;
      text-align: right;
      color: #333;
    }
    }

    .reim-detail_bank {
      width: 100%;
      background-color: $color-background;
      margin-top: 10px;
    .reim-detail_bank_info {
      height: 50px;
      line-height: 50px;
    .reim-detail_bank_name {
      width: 90px;
      height: 16px;
      font-size: $font-size-medium-x;
      color: $color-text-d;
      margin-left: 15px;
    }
    .reim-detail_bank_arrow {
      float: right;
      margin-right: 16px;
    .reim-detail_bank_img {
      width: 14px;
      height: 8px;
    }
    }
    }
    .reim-detail_bank_row {
      display: flex;
      font-size: $font-size-medium-x;
      margin-left: 15px;
      padding: 18px 16px 18px 0;
    .reim-detail_bank_title {
      display: inline-block;
      width: 96px;
      text-align: left;
      color: $color-text-sub;
    }
    .reim-detail_bank_data {
      flex: 1;
      text-align: right;
      color: $color-text-d;
    }
    }
    }
    .reim-detail_attachment {
      width: 100%;
      background-color: $color-background;
      margin-top: 10px;
      .reim-detail_attachment_info {
        height: 50px;
        line-height: 50px;
        .reim-detail_attachment_name {
          width: 90px;
          height: 16px;
          font-size: 16px;
          color: $color-text-d;
          margin-left: 15px;
        }
        .reim-detail_attachment_arrow {
          float: right;
          margin-right: 16px;
          .reim-detail_attachment_img {
            width: 14px;
            height: 8px;
          }
        }
      }
      .reim-detail_fujian {
        display: flex;
        line-height: 1.4;
        padding: 10px 15px 10px 15px;
      .reim-detail_fujian_images {
        border-radius: 4px;
      }
      .reim-detail_fujian_text {
        flex: 1;
        position: relative;
        padding-right: 100px;
      .reim-detail_fujian_name {
        display: -webkit-box;
        font-size: 15px;
        color: $color-text-d;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .reim-detail_fujian_size {
        color: #999;
        font-size: $font-size-medium-s;
      }
    }
      .reim-detail_fujian_down {
        position: absolute;
        width: 24px;
        height: 24px;
        top: 50%;
        right: 0px;
        margin-top: -12px;
      }
    }
    }
    .reim-detail_btn {
      color: $color-text-d;
      background-color: $color-background;
    }


  }
</style>
