<template>
  <div class="qwui-reimbursement_detail" v-windowscroll="scrollList">
    <!-- 详情标题 -->
    <div class="qwui-detail">
      <div class="qwui-detail_title">
        <span class="qwui-detail_title_name">{{title}}</span>
        <apply-status :applystatus="filterStatus"></apply-status>
      </div>
      <div class="qwui-detail_date">
        <span class="qwui-detail_date_time">{{createTime | formatDate}}</span>
        <span class="qwui-detail_date_name" @click.stop="atThisPersonUtil(detailData)">{{personName}}</span>
      </div>
      <span class="qwui-detail_reim_No">{{reimType}} | {{$t('i18n.reim.editor.reimNumber')}}：{{reimNo}}</span>
    </div>

    <!-- 详情列表内容 -->
    <div class="qwui-detail_content_list" v-for="(item,index) in detailList" :key="item.id">
      <!-- 详情内容 -->
      <div class="qwui-detail_content"
        :class="textColor(item) ? 'qwui-detail_warn' : 'qwui-detail_normal'"
        v-show="!item.isShow"
        @click="item.isShow=true">
        <div class="qwui-detail_content_top">
          <span class="qwui-detail_content_no" :class="textColor(item) ? 'qwui-text_warn' : 'qwui-text_normal'">{{index+1 | getIndex}}</span>
          <div class="qwui-detail_content_time">
            <span class="qwui-detail_content_starttime">{{item.time}} {{$t('i18n.reim.editor.to')}}</span>
            <span class="qwui-detail_content_endtime">{{item.endTimes}}</span>
          </div>
        </div>
        <div class="qwui-detail_content_center">
          <span class="qwui-detail_content_name">{{item.subjFullName}}</span>
          <span class="qwui-detail_content_price">￥{{item.money}}</span>
        </div>
        <div class="qwui-detail_content_budget">{{getMoney(item)}}</div>
        <div class="qwui-detail_content_budget">{{getBudget(item)}}</div>
      </div>
      <!-- 详情明细列表-->
      <div class="qwui-detail_list" v-show="item.isShow">
        <div class="qwui-detail_list_head border-bottom-1px"
          :class="textColor(item) ? 'qwui-detail_warn' : 'qwui-detail_normal'"
          @click="item.isShow=false">
          <span class="qwui-detail_list_no" :class="textColor(item) ? 'qwui-text_warn' : 'qwui-text_normal'">{{index+1 | getIndex}}</span>
          <img class="qwui-detail_list_arrow" src="~assets/images/icon_down_gray.png">
        </div>
        <div class="qwui-detail_list_content border-bottom-1px">
          <span class="qwui-detail_list_cost">{{$t('i18n.reim.reimProject')}}</span>
          <span class="qwui-detail_list_name">{{item.projName}}</span>
        </div>
        <div class="qwui-detail_list_content border-bottom-1px" v-if="item.deptName">
          <span class="qwui-detail_list_cost">{{$t('i18n.reim.dept')}}</span>
          <span class="qwui-detail_list_name">{{item.deptName}}</span>
        </div>
        <div class="qwui-detail_list_content border-bottom-1px">
          <span class="qwui-detail_list_cost">{{$t('i18n.reim.belongSubject')}}</span>
          <span class="qwui-detail_list_name" :class="{'qwui-detail_list_subject' : subName(item) }">{{item.subjFullName}}</span>
          <span class="qwui-reim_remark"
            v-if="subName(item)"
            @click="showRemark(item)">
          </span>
        </div>
        <div class="qwui-detail_list_content border-bottom-1px" v-if="item.cityName">
          <span class="qwui-detail_list_cost">{{$t('i18n.reim.detail.productCity')}}</span>
          <span class="qwui-detail_list_name">{{item.cityName}}</span>
        </div>
        <div class="qwui-detail_list_content border-bottom-1px">
          <span class="qwui-detail_list_cost">{{$t('i18n.reim.detail.productDate')}}</span>
          <span class="qwui-detail_list_name">{{item.time}}至{{item.endTimes}}</span>
        </div>
        <div class="qwui-detail_amount_budget  border-bottom-1px">
          <span class="qwui-detail_list_cost">{{$t('i18n.reim.detail.moneyRmb')}}</span>
          <span class="qwui-detail_list_name">{{item.money}}</span>
          <div class="qwui-detail_list_budget">{{getMoney(item)}}</div>
          <div class="qwui-detail_list_budget">{{getBudget(item)}}</div>
        </div>
        <div class="qwui-detail_list_content border-bottom-1px" v-if="item.invoice">
          <span class="qwui-detail_list_cost">{{$t('i18n.reim.detail.invoiceNum')}}</span>
          <span class="qwui-detail_list_name">{{item.invoice}}</span>
        </div>
        <div class="qwui-detail_list_content" v-if="item.remark">
          <span class="qwui-detail_list_cost">{{$t('i18n.reim.editor.remark')}}</span>
        </div>
        <div class="qwui-detail_list_content qwui-detail_list_remark border-bottom-1px" v-if="item.remark">
          <span class="qwui-detail_cost">{{item.remark}}</span>
        </div>
        <div class="qwui-detail_list_images" v-if="showImg(item)">
          <div class="qwui-detail_list_cost">{{$t('i18n.reim.detail.image')}}</div>
        </div>
        <div class="qwui-detail_list_content qwui-detail_imgList border-bottom-1px" v-if="showImg(item)">
          <span class="qwui-detail_list_img"
            v-for="list in item.imgList"
            :key="list.id">
            <img
              class="qwui-detail_list_preview"
              :src="dataDetailMsg(list.picPath)"
              @click="previewImg(list.picPath,item.imgList)"
            >
          </span>
        </div>

        <!-- 用车单 -->
        <div class="qwui-detail_list_images" v-if="item.carAskId">
          <div class="qwui-detail_list_cost">{{$t('i18n.reim.editor.veh')}}</div>
        </div>
        <div class="qwui-detail_list_content qwui-detail_pad_bot border-bottom-1px" v-if="item.carAskId">
          <qw-relation-card
            :relationData="carInvoice(item)"
            @chooseRelation="getVehDetail(item.carAskId)">
          </qw-relation-card>
        </div>

        <!-- 出差单 -->
        <div class="qwui-detail_list_images" v-if="item.askId">
          <div class="qwui-detail_list_cost">{{$t('i18n.reim.editor.ask')}}</div>
        </div>
        <div class="qwui-detail_list_content qwui-detail_pad_bot border-bottom-1px" v-if="item.askId">
          <qw-relation-card
            :relationData="askInvoice(item)"
            @chooseRelation="updateAskDetail({isShow: true, data: item})">
          </qw-relation-card>
        </div>

        <!-- 电子发票 -->
        <div class="qwui-detail_list_images" v-if="item.fapiaoInfo.length">
          <div class="qwui-detail_list_cost">{{$t('i18n.reim.editor.wxCard')}}</div>
        </div>
        <div class="qwui-detail_list_content border-bottom-1px qwui-detail_pad_bot" v-if="item.fapiaoInfo.length">
          <qw-relation-card
            title="$t('i18n.reim.editor.wxCard')"
            v-for="fapiao in item.fapiaoInfo"
            :key="fapiao.card_id"
            :relationData="showWxCardInfo(fapiao)"
            @chooseRelation="$emit('showWxCardDetail', index)"
          ></qw-relation-card>
        </div>

        <div class="qwui-vatspecial_invoice_wrap" v-if="item.vatSpecialInvoice !== ''">
          <div class="qwui-detail_list_content border-bottom-1px">
            <span class="qwui-detail_list_cost">{{$t('i18n.reim.detail.specialInvoice')}}</span>
            <span class="qwui-detail_list_name">{{item.vatSpecialInvoice == 1 ? '是' : '否' }}</span>
          </div>
          <ul v-if="item.vatSpecialInvoice == 1">
            <li class="qwui-detail_list_content border-bottom-1px">
              <span class="qwui-detail_list_cost">{{$t('i18n.reim.editor.invoiceNumber')}}</span>
              <span class="qwui-detail_list_name">{{item.invoiceNumber}}</span>
            </li>
            <li class="qwui-detail_list_content border-bottom-1px">
              <span class="qwui-detail_list_cost">{{$t('i18n.reim.editor.noTaxesMoney')}}</span>
              <span class="qwui-detail_list_name">{{item.noTaxesMoney}}</span>
            </li>
            <li class="qwui-detail_list_content border-bottom-1px">
              <span class="qwui-detail_list_cost">{{$t('i18n.reim.editor.taxesMoney')}}</span>
              <span class="qwui-detail_list_name">{{item.taxesMoney}}</span>
            </li>
            <li class="qwui-detail_list_content border-bottom-1px">
              <span class="qwui-detail_list_cost">{{$t('i18n.reim.editor.adValorem')}}</span>
              <span class="qwui-detail_list_name">{{item.adValorem}}</span>
            </li>
          </ul>
        </div>

        <!--自定义字段-->
        <div v-for="field in item.reimCustomFieldDataList">
          <div v-if="field.value">
            <!--多行-->
            <div class="qwui-detail_list_desc border-bottom-1px" v-if="filterTextContent(field)">
              <div class="qwui-detail_list_desclabel">{{field.customName}}</div>
              <span class="qwui-detail_list_name">{{field.value}}</span>
            </div>
            <!--其他-->
            <div class="qwui-detail_list_content  border-bottom-1px" v-else>
              <span class="qwui-detail_list_cost">{{field.customName}}</span>
              <span class="qwui-detail_list_name clearfix">
                <span  class="qwui-detail_list_textcontent">{{field.value}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 借款单 -->
    <div class="loan_field" v-if="loanMsg.id">
      <div class="loan_title">关联借款单</div>
      <div class="loan_content">
        <qw-relation-card
          title="关联借款单"
          :relationData="loanMsg"
          @chooseRelation="getLoanDetail(loanMsg.id)"
        ></qw-relation-card>
      </div>
    </div>

    <!-- 明细区域 -->
    <div class="qwui-detail_region border-bottom-1px">
      <div class="qwui-detail_region_title border-bottom-1px">{{$t('i18n.reim.editor.detailExpense')}}</div>
      <div class="qwui-detail_region_total">
        <span class="qwui-detail_total_name">{{$t('i18n.reim.editor.detailTotal')}}</span>
        <span class="qwui-detail_total_price">￥{{totalMoney}}</span>
      </div>
      <div class="qwui-detail_region_bot">
        <span class="qwui-detail_region_num">{{region}}{{$t('i18n.reim.editor.detail')}}</span>
        <span class="qwui-detail_region_firm" v-if="totalAsk != 0">{{totalAskTitle()}}</span>
        <span class="qwui-detail_region_firm" v-if="totalVeh != 0">{{totalVehTitle()}}</span>
        <span class="qwui-detail_region_invoice" v-if="totalWxCard !=0">{{totalWxCard}}{{$t('i18n.reim.editor.wxCard')}}</span>
      </div>
    </div>

    <div v-if="loanMsg.id">
      <div class="total_field border-bottom-1px">
        <div class="total_field_label">核销金额</div>
        <div class="total_field_content">{{verificationMoney}}</div>
      </div>
      <div class="total_field border-bottom-1px">
        <div class="total_field_label">应付金额</div>
        <div class="total_field_content">{{payableMoney || '0.00'}}</div>
      </div>
    </div>

     <!-- 结算方式 -->
    <div class="total_field border-bottom-1px" v-if="settleStr">
      <div class="total_field_label">{{$t('i18n.reim.editor.settle')}}</div>
      <div class="total_field_content">{{settleStr}}</div>
    </div>

     <div class="total_field" v-if="actualMoney !== ''">
      <div class="total_field_label">{{$t('i18n.reim.detail.payAmount')}}</div>
      <div class="total_field_content">{{actualMoney}}</div>
    </div>

    <!--全局字段--备注-->
    <div class="qwui-global_remarks" v-if="globalRemarks">
      <div class="qwui-remarks_label">{{$t('i18n.reim.editor.remark')}}</div>
      <div class="qwui-remarks_content">{{globalRemarks}}</div>
    </div>

    <!-- 银行汇款信息 -->
    <div class="qwui-detail_bank" v-if="bankInfo">
      <div class="qwui-detail_bank_info border-bottom-1px" @click="showDetailBankContent">
        <span class="qwui-detail_bank_name">{{$t('i18n.reim.detail.bankMoneyInfo')}}</span>
        <span class="qwui-detail_bank_arrow" :class="{'qwui-detail_arrowImg':isShowBankContent}">
          <img class="qwui-detail_bank_img" src="~assets/images/icon_down_gray.png">
        </span>
      </div>
      <div class="qwui-detail_bank_content" v-if="isShowBankContent">
        <div class="qwui-detail_bank_row border-bottom-1px" v-if="receiptFullName">
          <span class="qwui-detail_bank_title">{{$t('i18n.reim.detail.payee')}}</span>
          <span class="qwui-detail_bank_data">{{receiptFullName}}</span>
        </div>
        <div class="qwui-detail_bank_row border-bottom-1px" v-if="bankAccount">
          <span class="qwui-detail_bank_title">{{$t('i18n.reim.detail.bankAccount')}}</span>
          <span class="qwui-detail_bank_data">{{bankAccount}}</span>
        </div>
        <div class="qwui-detail_bank_row" v-if="depositBank">
          <span class="qwui-detail_bank_title">{{$t('i18n.reim.detail.bankDeposit')}}</span>
          <span class="qwui-detail_bank_data">{{depositBank}}</span>
        </div>
      </div>
    </div>

    <!-- 附件 -->
    <div class="qwui-detail_attachment" v-if="showAttach">
      <div class="qwui-detail_attachment_info" @click="showAttachment">
        <span class="qwui-detail_attachment_name">{{$t('i18n.reim.detail.attachment')}}</span>
        <span class="qwui-detail_attachment_arrow" :class="{ 'qwui-detail_arrowImg':isShowAttachment }">
          <img class="qwui-detail_attachment_img" src="~assets/images/icon_down_gray.png">
        </span>
      </div>
      <div class="qwui-detail_attachment_content" v-if="isShowAttachment">
        <add-file-list v-if="mediaList && mediaList.length"
                     agent="reimbursement"
                     customClass="file_list_len"
                     :filesList="mediaList"
                     :deleteFile="false"
                     :downLoad="true">
        </add-file-list>
      </div>
    </div>

    <div class="qwui-relative">
      <!--流程明细-->
      <span class="qwui-serial_entrance" v-if="this.isFree!=1" @click="getFlowSerial">
        <i class="qwui-icon_serial"></i>
        {{$t('i18n.reim.detail.circulationDetail')}}
      </span>
      <!--当前处理人-->
      <div
        v-if="FlowAuditList.length">
        <user_selected_group v-for="(item,index) in FlowAuditList"
        :key="index"
        :title="startAuditTitle(item)"
        :isEdit="false">
        <user_selected_item :title="startAuditTitle(item)"
        :List="item.auditUserList"
        :isEdit="false"
        @showPersonList="showPersonList"
        @atThisPersonUtil="atThisPersonUtil"
        slot="user_selected_item">
        </user_selected_item>
        </user_selected_group>
      </div>

      <!--自由流程审批人-->
      <user_selected_group
        v-if="freeAuditList.length"
        :title="$t('i18n.repApprover')"
        :isEdit="false">
        <user_selected_item
        :title="$t('i18n.repApprover')"
        :List="freeAuditList"
        :isEdit="false"
        @showPersonList="showPersonList"
        @atThisPersonUtil="atThisPersonUtil"
        slot="user_selected_item">
        </user_selected_item>
      </user_selected_group>

      <!--下一步处理人-->
      <user_selected_group
        v-if="FlowAuditListShow"
        :title="$t('i18n.nextHandler')"
        :isEdit="false">
        <user_selected_item
        :title="$t('i18n.nextHandler')"
        :List="FlowAuditList[0].nextAuditList"
        :isEdit="false"
        @showPersonList="showPersonList"
        @atThisPersonUtil="atThisPersonUtil"
        slot="user_selected_item">
        </user_selected_item>
      </user_selected_group>

      <!--相关人-->
      <user_selected_group
        v-if="ccPersonList.length"
        :title="$t('i18n.cc')"
        :isEdit="false">
        <user_selected_item
        :title="$t('i18n.cc')"
        :List="ccPersonList"
        :isEdit="false"
        @showPersonList="showPersonList"
        @atThisPersonUtil="atThisPersonUtil"
        slot="user_selected_item">
        </user_selected_item>
      </user_selected_group>
    </div>

    <!--个人信息-->
    <user_info @showChatTool="showChatToolFun"></user_info>

    <!--评论列表-->
    <comment_list
      :appendTitle="$t('i18n.commentOnly')"
      :title="$t('i18n.comment')"
      :commentList="commentList"
      :totalRow="listTotalRows"
      :dealListContent="dealListContent"
      :dealListIcon="dealListIcon"
      :dealListDelete="dealListDelete"
      @onlyComment="onlySeeComment"
      @atThisPersonUtil="atThisPersonUtil"
      @delete="deleteThisComment">
    </comment_list>

    <!--加载更多-->
    <Load_more
      :loading="loading"
      :type="'commentList'"
      :hasMore="hasMore"
      @loadMoreClick="loadMoreList">
        <span v-if="!listTotalRows">{{$t('i18n.reim.detail.noComment')}}</span>
    </Load_more>

    <div v-if="!hasMore && listTotalRows" class="qwui-height_margin"></div>
    <div class="qwui-height_bottom"></div>

    <!--评论输入框组件-->
    <chatInput
      :show.sync="showChatTool"
      :autofocus.sync="autofocus"
      :dataBase="dataBase"
      :agent="agent"
      @updateContent="updateContent"
      @dealccPerson="backUserSelect"
      @closeChat="closeChatMask">
    </chatInput>

    <!--选择节点-->
    <qw_select_node @selectNodeClick="selectNodeClick"></qw_select_node>

    <!--审批请示按钮-->
    <flow-approve-button
      :FlowAudit="FlowAuditList[0]"
      :detail="flowApproveDetail"
      :approveVo="approveVo"
      @showChatTool="showChatToolFun"
      @actionButtonClick="actionButtonClick"
      @approveAction="approveAction"
      :bottomApproveButton="bottomButton"
      :moreApproveButton="moreButton">
        <!-- 自定义折叠的按钮 -->
        <template slot="moreApproveButton">
          <p class="qwui-detail_btn border-bottom-1px" v-if="copyReim" @click="goCopyReim">{{$t('i18n.reim.editor.copy')}}</p>
          <p class="qwui-detail_btn border-bottom-1px" @click="printDetail">{{$t('i18n.reim.detail.printPreview')}}</p>
        </template>
    </flow-approve-button>

    <!--流程明细-->
    <flow_serial v-if="flowSerial.isShowFlowSerial" :flowSerialData="flowSerialData" :isover="flowSerial.isover">
    </flow_serial>

    <!--选择节点处理人 弹窗-->
    <flow-approve-dialog
      :agent="agent"
      v-if="flowApproveDialogShow"
      @showPersonList="showPersonList"
      @saveNodeAuditUserJson="commitTask"
      :action="approveActionStatus"
      :config="dialogConfig"
      :detail="flowApproveDetail"
      >
    </flow-approve-dialog>

    <!--处理人范围选人-->
    <user_selected_ranglist
      :options="FlowAuditUser[appointUserIndex].startAuditList.flowUserList"
      :selectType="FlowAuditUser[appointUserIndex].startAuditList.selectType.type"
      :checkedType="FlowAuditUser[appointUserIndex].startAuditList.selectType.checkedType"
      :config="FlowAuditUser[appointUserIndex].startAuditList.selectType"
      :defaultAllSelect="FlowAuditUser[appointUserIndex].startAuditList.defaultAllSelect"
      :checked="FlowAuditUserIds(appointUserIndex)"
      @FlowAuditUserResult="FlowAuditUserResult"
      v-if="FlowAuditUserBoxShow">
    </user_selected_ranglist>

    <!--公共选人组件-->
    <user_selected_Box
    v-if="selectConfig.show"
      :selectconfig="selectConfig">
      </user_selected_Box>
      <user_selected_Box
      :selectconfig="dataBase.selectConfig"
      v-if="dataBase.selectConfig.show">
    </user_selected_Box>

    <!--人员列表组件-->
    <user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user_show>

    <!-- 请假详情 -->
    <qw-ask-detail v-if="isShowAskDetail"></qw-ask-detail>

    <!-- 车单详情 -->
    <qw-veh-detail v-if="isShowVehDetail"></qw-veh-detail>

    <!-- 电子发票 -->
    <qw-invoice-detail v-if="isShowWxCardDetail"></qw-invoice-detail>

    <!-- 借款单详情 -->
    <qw-loan-detail v-if="isShowLoanDetail"></qw-loan-detail>

    <!--预览图片组件-->
    <previewImages></previewImages>

  </div>
</template>

<script>

  import QwRelationCard from '../../components/reimbursement/RelationCard'; //引入发票的组件
  import previewImages from "@/components/base/previewImages"; //图片预览
  import addFileList from '@/components/add/upload/addFileList'; //附件列表
  //评论
  import {
    commentListMore,
    addCommentList,
    deleteCommentList,
    getReimDetail,
    getCar
  } from '../../api/reimbursementDetail'; //引入详情的请求方法
  import { getVehDetail, getLoanDetail } from '../../api/editor';   //获取用车单详情
  import { isWhiteCorpId } from '../../api/debit'; // 获取借款白名单
  import applyStatus from '@/components/part/apply_status'; //审批状态
  //发票组件
  import QwAskDetail from '../../components/reimbursement/AskDetail';
  import QwVehDetail from '../../components/reimbursement/VehDetail';
  import QwInvoiceDetail from '../../components/reimbursement/InvoiceDetail';
  import QwLoanDetail from '../../components/reimbursement/LoanDetail';
  //流程
  import {
    findBranchFlowNextNodeInfoFun,
    getDetailFlowAuditFun,
    getParallelFlowSerialFun
  } from '@/components/flow/getAuditFlow'
  import {
    isVipSilver
  } from '@/assets/js/vip-portal.js' //判断VIP
  //底部按钮
  import {
    bottomApproveButton,
    moreApproveButton,
    approveDialogConfig
  } from '@/components/flow/config'

  //评论
  import comment_list from '@/components/list/comment_list';
  import Load_more from '@/components/list/load_more';
  import chatInput from '@/components/detail/chatInput';
  import user_info from '@/components/detail/user_info_card';
  import user_selected_Box from '@/components/base/user_or_dept_select'
  import qw_select_node from '@/components/flow/selectNode';
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import FlowApproveButton from '@/components/flow/flowApproveButton'
  import FlowApproveDialog from '@/components/flow/flowApproveDialog'
  import flow_serial from '@/components/flow/flow_serial'; // 流转明细
  import user_show from '@/components/detail/user_show' //人员列表
  import {
    mapState,
    mapGetters,
    mapMutations,
    mapActions
  } from 'vuex';
  import EventBus from '@/utils/eventBus';

  export default {
    name: 'QwReimbursementDetail',
    components: {
      QwRelationCard,
      // 审批状态
      applyStatus,
      //预览图片
      previewImages,
      // 附件
      addFileList,
      // 发票
      QwAskDetail,
      QwVehDetail,
      QwInvoiceDetail,
      QwLoanDetail,
      //评论
      comment_list,
      Load_more,
      //流程
      user_selected_item,
      user_selected_group,
      qw_select_node,
      flow_serial,
      FlowApproveButton,
      FlowApproveDialog,
      user_selected_Box,
      user_selected_ranglist,
      user_info,
      chatInput,
      user_show
    },
    data() {
      return {
        approve: '', //审批人是否可以编辑
        currentId: '',  //固定流程当前节点id
        creator: '',  //创建人
        fapiaoInfo: [],  //电子发票信息
        copyReim: false, //复制
        bottomButton: {//底部按钮
          moreApprove: {
            ...bottomApproveButton.moreApprove,
            show: true,
          }
        },
        // 如果要修改折叠按钮的某一项，请参考下面的方式更改
        moreButton: {
          editApprove: {
            ...moreApproveButton.editApprove,
            show: false,
          },
          flowSerial: {
            ...moreApproveButton.flowSerial,
            show: true,
          }
        },
        // 底部按钮点击后弹窗文案的配置方法
        dialogConfig: {
          ...approveDialogConfig,
          closeApprove: {
              ...approveDialogConfig.closeApprove,
          }
        },
        isShowBankContent: false, //银行列表
        isShowAttachment: false, //附件信息
        reimId: '', //详情id
        userId: '', //用户id
        title: '', //报销单标题
        versionNum: '', //报销单版本号
        approveText: '', // 输入的文字
        reimNo: '', //报销单编号
        createTime: '', //创建时间
        reimType: '', //单据类型名称
        statusDesc: '', //报销单状态
        personName: '', //创建人名称
        detailList: [], //报销明细
        totalMoney: '', //报销单金额
        receiptFullName: '', //收款单位全称
        bankAccount: '', //银行账号
        depositBank: '', //开户银行
        mediaList: '', //附件
        globalRemarks:'',//全局备注
        actualMoney: '', //实付金额
        loanMsg: {},  // 借款信息
        verificationMoney: '', // 核销金额
        payableMoney: '', // 应付金额
        settleStr: '',      //结算方式
        editStatus: '', //是否允许审批人编辑0不允许1允许
        dataBase:dataBase, //流程
        agent: 'reimbursement',
        flowApproveDetail: {}, // 审批按钮需要用到的节点详情数据
        approveActionStatus: '', // 当前点击的按钮
        freeAuditList: [], //自由审批人列表
        flowSerial: { //流程明细
          isFirstRequest: true,
          isShowFlowSerial: false,
          list: [],
          isFreeFlow: '',
          isover: '',
          currentTime: '',// 当前时间
        },
        autofocus: false,
        loading: false,
        hasMore: false,
        lock_roll: false,
        currentPage: 1,
        listTotalRows: 0,
        commentList: [], //评论列表
        commentValue: '', //评论输入框的值
        showChatTool: false, //显示评论输入框
        commentStatus: "1",
        deleteListIndex: "", //需要删除的index
        dealListIcon: function (item) {
          return item.type == 3 ? "qwui-meeting_icon icon_icon7" : ''
        },
        dealListContent: function (item) {
          let status = item.type
          return status != "2" && status != "3" ? true : false;
        },
        dealListDelete: function(item) {    //评论删除按钮的显示
          let status= item.status;
          status = status? status : '';
          const time=item.time;
          if(item.creator == _.userId && item.type != 3 &&
            (time==this.$t('i18n.reim.detail.just') || (time.indexOf(this.$t('i18n.reim.detail.minut'))!=-1 && parseInt(time.split(this.$t('i18n.reim.detail.minut'))[0])<30))){
            return  status=="9"||status==0;
          }else{
            return false;
          }
        },
        showPerson: false, //是否展开所有选中人员列表
        userselectTitle: '',
        userSelectList: [],
        limitPreview: false //限制弹个人信息弹窗
      }
    },
    created() {
      //获取详情的id
      this.reimId = this.$route.query.id;
      //请求详情数据
      this.showReimDetail();
      //重置按钮数据
      this.$store.commit('resetFlowData');
    },
    computed: {
      ...mapGetters([
        "FlowAuditUserIds", // 已选择的处理人id
        "FlowAuditListShow", // 下一步处理人是否显示
        'isMoveapproveStatus', //判断审批状态
        'isShowAskDetail', //发票单
        'isShowVehDetail', //用车单
        'isShowWxCardDetail',
        'isShowLoanDetail', // 借款单
      ]),
      ...mapState({
        detailData: state => state.detail.detailData, // 详情内容数据
        isFree: state => state.flowUserSelected.isFree, //流程类型,默认是自由流程'1'（固定为0，分支为3，全部应用需要统一）
        templateRefId: state => state.flowUserSelected.templateRefId, //模板审批单id
        refId: state => state.flowUserSelected.refId, // 审批单id

        isBranchFlow: state => state.flowUserSelected.isBranchFlow, //接口返回的流程数据
        isBranchNode: state => state.flowUserSelected.isBranchNode, //接口返回的流程数据
        flowId: state => state.flowUserSelected.flowId, // 已选的流程id
        currentNodeId: state => state.flowUserSelected.currentNodeId, // 当前节点id
        nextNodeId: state => state.flowUserSelected.nextNodeId, // 下一节点id
        defaultNextNodeId: state => state.flowUserSelected.defaultNextNodeId, // 下一节点id
        parallelNextNodeIds: state => state.flowUserSelected.parallelNextNodeIds, // 并行子节点id，逗号隔开

        FlowAuditUser: state => state.flowUserSelected.FlowAuditUser, // 处理人信息
        FlowAuditList: state => state.flowUserSelected.FlowAuditList, // 详情节点当前和下一步处理人信息
        selectConfig: state => state.flowUserSelected.selectConfig, // 选人基础配置
        ccPersonList: state => state.flowUserSelected.ccPersonList, // 相关人信息

        flowList: state => state.flowUserSelected.flowList, // 流程列表

        FlowAuditUserBoxShow: state => state.flowUserSelected.FlowAuditUserBoxShow, //流程勾选类型弹窗：指定人员、部门、部门负责人
        flowApproveDialogShow: state => state.flowUserSelected.flowApproveDialogShow, // 选择审批人弹窗
        appointUserIndex: state => state.flowUserSelected.appointUserIndex, // 用户当前选择的处理人（第几个节点）
        appointNodeAndUserVOList: state => state.flowUserSelected.appointNodeAndUserVOList, // 当前节点指定处理人的节点信息
        approveVo: state => state.flowUserSelected.approveVo, // 自由流程信息

        commitTaskParams: state => state.flowUserSelected.commitTaskParams, //提交返回的流程字段
      }),
      // 银行数据
      bankInfo() {
        return this.receiptFullName || this.bankAccount || this.depositBank;
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
      // 电子发票总计
      totalWxCard() {
        return this.fapiaoInfo.length;
      },
      //流程明细
      flowSerialData: function () {
        return this.flowSerial;
      },
      //评论数据
      listComment: function () {
        return this.detailData.listComment;
      },
      //审批状态
      filterStatus() {
        if (this.statusDesc) {
          let statusArr = ['审批中', '已审批', '已结束', '已关闭', '已转账', '已取消', '已退审', '转账失败', '待还款', '已还款'];
          let statusDescArr = [
            {
              classN: 'status_blue',
              status: 'i18n.reim.status.approving',
            },
            {
              classN: 'status_green',
              status: 'i18n.reim.status.approved',
            },
            {
              classN: 'status_gray',
              status: 'i18n.reim.detail.end',
            },
            {
              classN: 'status_gray',
              status: 'i18n.reim.detail.close',
            },
            {
              classN: 'status_gray',
              status: 'i18n.reim.status.transferred',
            },
            {
              classN: 'status_gray',
              status: 'i18n.reim.status.cancel',
            },
            {
              classN: 'status_red',
              status: 'i18n.reim.status.retreat',
            },
            {
              classN: 'status_gray',
              status: 'i18n.reim.status.transferFail',
            },
            {
              classN: 'status_gray',
              status: 'i18n.reim.status.repayment',
            },
            {
              classN: 'status_gray',
              status: 'i18n.reim.status.repaid',
            },
          ]

          let index = statusArr.indexOf(this.statusDesc);
          let className = statusDescArr[index].classN;
          let statusDesc = statusDescArr[index].status;
          return {
            name: statusDesc ? statusDesc : this.statusDesc,
            class: className ? className : 'status_gray',
            active: true
          }
        }
      },
      //明细数量
      region() {
        return this.detailList.length;
      },
      //附件的显示和隐藏
      showAttach() {
        return this.mediaList.length > 0 ? true : false;
      }
    },
    methods: {
      ...mapActions([
        "getApprove", // 自由流程获取转审人员
        "updateFlowUserSelected", // 更新已选处理人
        "getNodeListInfo", //获取节点选择信息
        "updataAuditStatus", // 更新状态(关闭/退审)
        "addCountersignType", //加签操作
      ]),
      ...mapMutations([
        "updateUserSelectConfirm",
        'updateCCPerson', //更新相关人
        'updateUserSelectedState',
        'updateAskDetail', //出差请假单详情
        'updateVehDetail', //用车单详情
        'updateWxCardDetail',
        'updateLoanDetail' // 更新关联借款详情
      ]),
      // 数字颜色
      textColor(item) {
        return item.budgetState=='1' || item.state=='1';
      },
      // 报销科目
      subName(item) {
        return item.subjFullName && item.subjExplain;
      },
      // 科目点击说明
      showRemark(item) {
        _.alert("i18n.reim.detail.subjectRemark",item.subjExplain,"i18n.confirm");
      },
      // 显示发票详情
      showWxCardInfo(fapiao) {
        return {
          title: this.$t('i18n.reim.editor.cardRecpt'),
          name: fapiao.gmfMc,
          price: this.$t('i18n.reim.editor.money')+':'+fapiao.xsfMc,
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
      // 获取借款单详情
      getLoanDetail(loanId) {
        _.showLoading();
        getLoanDetail({ loanId }).then(res => {
          this.updateLoanDetail({isShow: true, data: res.data.data});
          _.hideLoading();
        })
      },
      // 请假出差单标题
      totalAskTitle() {
        let askName = this.$t('i18n.reim.editor.ask') + ','
        if(!this.totalVeh) {
          askName = this.totalAsk + askName.replace(',','');
        } else {
          askName = this.totalAsk + askName;
        }
        return askName;
      },
      // 用车单标题
      totalVehTitle() {
        let vehName = this.$t('i18n.reim.editor.veh') + ','
        if(!this.totalWxCard) {
          vehName = this.totalVeh + vehName.replace(',','');
        } else {
          vehName = this.totalVeh + vehName;
        }
        return vehName;
      },
      // 获取详情
      showReimDetail() {
        var self = this;
        getReimDetail({
          reimId: self.reimId,
          size: "10"
        }).then((res) => {
          _.hideLoading();
          if (res.code == "0") {
            let detail = res.data.detail;
            this.creator = detail.creator;
            let isFree = detail.isFree == "0" || detail.isFree == "3" ? detail.isFree : '1';
            // 审批人是否可以编辑
            this.approve = res.data.approve;
            //是否是用户ID，是则显示复制按钮,否则不显示
            if (detail.creator === _.userId) {
              this.copyReim = true;
            } else {
              this.copyReim = false;
            }
            //编辑按钮的显示条件
            if (res.data.editStatus == "1") {
              this.moreButton.editApprove.show = true;
            }
            // 自由流程不显示流转明细
            if (isFree == "1") {
              this.moreButton.flowSerial.show = false;
            }
            // 报销标题
            self.title = detail.title;
            // 报销单编号
            self.reimNo = detail.reimNo;
            //报销单版本号
            self.versionNum = detail.versionNum;
            // 报销单创建时间
            self.createTime = detail.createTime;
            // 单据类型
            self.reimType = detail.reimType;
            // 报销单状态
            self.statusDesc = detail.statusDesc;
            // 报销提单人
            self.personName = detail.personName;
            // 明细列表
            self.detailList = detail.detailList.map((item) => {
              item.isShow = false;
              return item;
            });
            // 报销金额
            self.totalMoney = detail.totalMoney;
            // 收款单位名称
            self.receiptFullName = detail.receiptFullName;
            // 银行名称
            self.bankAccount = detail.bankAccount;
            // 开户银行
            self.depositBank = detail.depositBank;
            // 编辑状态
            self.editStatus = res.data.editStatus;
            // 附件列表
            self.mediaList = res.data.mediaList;
            // 全局备注
            self.globalRemarks = detail.globalRemark;
            self.actualMoney = detail.actualMoney;
            // 结算方式
            self.settleStr =detail.settleStr;

            self.loanMsg = {
              id: detail.loanId,
              title: this.$t('i18n.reim.loan'),
              name: detail.loanTitle,
              price: `${this.$t('i18n.reim.verificationMoney')}：${detail.verificationMoney}`,
              time: `${this.$t('i18n.reim.repayDate')}：${detail.repayDate}`,
            }

            self.payableMoney = detail.payableMoney;
            self.verificationMoney = detail.verificationMoney;

            // 更新流程类型
            self.updateUserSelectedState({
              type: "isFree",
              data: isFree
            });
            // 更新state 非引用类型的值
            self.updateUserSelectedState({
              type: "refId",
              data: self.reimId
            });
            // 审批按钮需要用到的节点详情数据
            self.flowApproveDetail = Object.assign({}, self.flowApproveDetail, {
              isover: detail.isover,
              status: detail.status,
              creator: detail.creator,
              isFree: detail.isFree,
              approve: res.data.approve
            });
            //判断是否是并行，是就查询并行接口获取节点列表
            if (res.data.detail && res.data.detail.currentNodeId.indexOf(',') != -1) {
              self.$store.commit('updateListName', res.data)
              self.getDetailNodeList(res.data)
            } else {
              //非并行流程
              self.updateUserSelectedState({
                type: "currentNodeId",
                data: res.data.detail ? res.data.detail.currentNodeId : ''
              })
              self.showDetailPage(res.data)
            }
          } else {
            _.alert("i18n.notice", res.desc);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      // 查询并行的节点选择接口
      getDetailNodeList(data) {
        let self = this
        this.getNodeListInfo({
          'refId': self.reimId,
          'callback': function (result) {
            if (result.length > 0) {
              self.updateUserSelectedState({
                type: "currentNodeId",
                data: result[0].nodeId
              })
            } else {
              self.updateUserSelectedState({
                type: "currentNodeId",
                data: data.detail ? data.detail.currentNodeId : ''
              })
            }
            self.showDetailPage(data)
          }
        })
      },
      // 处理人标题
      startAuditTitle(item) {
        this.currentId = item.vo.nodeId;
        if (this.FlowAuditList.length === 1) {
          return this.$t('i18n.reim.detail.currentProcess');
        }
        return item.vo ? item.vo.nodeName + this.$t('i18n.reim.detail.dealPeople') : item.nodeName + this.$t('i18n.reim.detail.dealPeople');
      },
      //预览个人信息
      showPersonList(title, list, type) {
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
        if (type) {
          this.limitPreview = true
        } else {
          this.limitPreview = false
        }
      },
      // 选择节点
      selectNodeClick(item, data) {
        //更新当前节点
        this.updateUserSelectedState({
          type: "currentNodeId",
          data: item.nodeId
        })
        this.showDetailPage(data)
      },
      //详情数据处理
      showDetailPage(data) {
        //更新详情内容的数据
        this.$store.commit('updateDetailData', data.detail)
        //评论列表处理
        this.hasMore = data.hasMore;
        this.showCommentList(data.comments, data.hasMore, data.detail.commentCount);
        //不是自由流程
        if (this.isFree != "1") {
          this.getFlowAuditNodeData()
        } else {
          // 自由流程获取转审人员
          this.getApprove(this.refId);
        }
        //更新明细数据
        this.flowSerial.isover = data.detail.isover;
        this.flowSerial.isFreeFlow = this.isFree;
        //更新自由审批人
        if (this.isMoveapproveStatus || this.isFree === '1') {
          this.freeAuditList.length = 0
          this.freeAuditList.push(...data.detail.toPersons);
        }
        //更新相关人
        this.updateCCPerson(data.detail.ccPersons)
      },
      //查询流程审批节点信息
      getFlowAuditNodeData() {
        let self = this
        // 已关闭、已审批、被退审,不需要请求
        if (this.isMoveapproveStatus) {
          return
        }
        let Param = {
          refId: this.reimId,
          definitionId: 'reim' + this.detailData.orgId.replace(/-/g,''),
          isBranch: this.isFree == '3' ? true : false,
          nodeId: this.currentNodeId,
          status: this.detailData.status
        };
        // 详情页面获取当前处理人、下一节点处理人、节点信息
        getDetailFlowAuditFun(Param, (result) => {
          self.$store.commit('updateSearchFlowListData', result);
          self.$store.commit('updateFlowAuditList', result.nodeInfo);
          this.$store.commit('updateFlowChioseNodeAuditUser');    // 更新由上一个节点已选择的处理人
        })
      },
      // 底部“更多按钮”的点击事件
      actionButtonClick(payload) {
        // 底部按钮点击查看流程明细
        if (payload === 'getFlowSerial') {
          this.getFlowSerial('getFlowSerial');
        }
        //底部按钮点击查看编辑按钮
        if (payload === 'editApprove') {
          if (this.creator != _.userId || this.editStatus == "1") {
            // 审批人编辑
            this.goApproveEditReim();
          } else {
            // 提单人编辑
            this.goEditReim();
          }
        }
      },
      //点击查看流程明细
      getFlowSerial: function () {
        let Param = {
          refId: this.reimId,
          isFree: this.isFree == '0' ? 2 : this.isFree //固定流程转为2
        }
        // 流转明细
        getParallelFlowSerialFun(Param, (result) => {
          if (result.auditSerial.length) {
            this.flowSerial.list = result.auditSerial;
            this.flowSerial.currentTime = result.currentTime;
            this.flowSerial.isShowFlowSerial = true;
            this.flowSerial.isFirstRequest = false;
          }
        })
      },
      // 点击各个审批按钮
      approveAction(payload) {
        this.approveActionStatus = payload;
        // 如果是“关闭”
        if(payload == 'closeApprove') {
          this.dialogConfig.closeApprove.title = this.$t('i18n.reim.detail.closeReimburse');
          this.dialogConfig.closeApprove.reason = this.$t('i18n.reim.detail.closeReimburse');
        }
        // 如果是“审批”
        if (payload === 'approve') {
          if (this.isFree == 3 && this.isBranchNode) {
            this.requestNextBranchNode();
          }
        }
        this.updateUserSelectedState({
          type: "flowApproveDialogShow",
          data: true
        })
      },
      // 分支流程节点
      requestNextBranchNode() {
        let subjIds = [], projIds = [], deptIds = [], standard = '0', budget = '0';
        this.detailList.forEach(detail => {
          if (detail.subjId) {
            subjIds.push(detail.subjId);
          }
          if (detail.projId) {
            projIds.push(detail.projId);
          }
          if (detail.deptId) {
            deptIds.push(detail.deptId);
          }
        });
        this.detailList.some(detail => {
          if (detail.state == '1') {
            standard = '1';
            return true;
          }
        });
        this.detailList.some(detail => {
          if (detail.budgetState == '1') {
            budget = '1';
            return true;
          }
        })
        let params = {
          'searchValue.field_sumMoneys': this.totalMoney,
          'searchValue.field_standard': standard,
          'searchValue.field_budget': budget,
          'searchValue.field_department': deptIds.join(','),
          'searchValue.field_subject': subjIds.join(','),
          'searchValue.field_costCenter': projIds.join(','),
          initRefId: this.reimId ? this.reimId : '',
          templateRefId: 'reim' + this.detailData.orgId.replace(/-/g, ''),
          currentNodeId: (this.isBranchNode && this.defaultNextNodeId) ? this.defaultNextNodeId : this.currentNodeId,
        }
        //最后接口数据回调
        findBranchFlowNextNodeInfoFun(params, (result) => {
          this.$store.commit('updateFlowAuditUserData', result);
          this.updateUserSelectedState({
            type: "flowApproveDialogShow",
            data: true
          })
          //更新下拉选择节点名称
          this.$store.commit('updateChooseNodeName')
        })
      },
      //选择处理人后点击确定回调
      FlowAuditUserResult(payload) {
        this.$store.commit('checkFlowAuditUserType', payload)
        // 如果是多部门，则请求部门负责人
        this.updateFlowUserSelected(payload)
      },
      // 查看个人头像信息
      atThisPersonUtil(user) {
        if (user) {
          EventBus.$emit("atThisPersonUtil", user);
        }
      },
      //插入相关人
      backUserSelect: function (obj) { //@人后把人添加为相关人,当@的人是审批人的话，不加到相关人
        let toPerson = [];
        if(this.flowSerial.isFreeFlow == '1') {
          toPerson = this.freeAuditList;
        }else {
          for(let i=0;i<this.FlowAuditList.length;i++) {
            toPerson = this.FlowAuditList[i].auditUserList;
          }
        }
        let toPersonIdStr = '';
        toPerson.forEach(function(item){
          toPersonIdStr += item.userId;
        });
        //相关人
        let ccpersonIdStr = '';
        this.ccPersonList.forEach(function(item){
          ccpersonIdStr += item.userId;
        });
        for(let i=obj.data.length-1;i>=0;i--){
          // 审批人
          if(toPersonIdStr.indexOf(obj.data[i].userId)>-1){
            obj.data.splice(i,1);
          }
          // 相关人
          if(ccpersonIdStr.indexOf(obj.data[i].userId)>-1){
            obj.data.splice(i,1);
          }
        }
        obj.data.forEach((item) => {
          this.ccPersonList.push(item);
        })
        this.updateCCPerson(this.ccPersonList);
      },
      //关闭评论弹窗，返回输入值
      closeChatMask(val) {
        this.commentValue = val;
      },
      //显示评论弹窗
      showChatToolFun() {
        this.showChatTool = true
        this.autofocus = true
      },
      // 保存提交数据
      commitTask(data) {
        let self = this;
        this.approveText = data.reason // 输入的文字
        //加签按钮
        if(data.addCounterSignPersonStr) {//分支流程，固定流程加签
            this.addCountersignType({
            'id': data.id,
            'type': data.type,
            'addCounterSignPersonStr': data.addCounterSignPersonStr,
            'reason': data.reason,
            'isFree': data.isFree,
            'currentNodeId': this.currentNodeId,
          });
        }else {
          //审批按钮的操作，审批，退审，转审，结束
          this.updataAuditStatus({
            'reimId': this.reimId,
            'reason': this.approveText,
            'status': data.status,
            'nextNodeId': data.nextNodeId,
            'parallelNextNodeIds': this.parallelNextNodeIds,
            'versionNum': this.versionNum,
            'currentNodeId': this.currentNodeId,
            'choiseFlowUser': data.chooseFlowUser,
            'flowDpId': data.flowDpId,
            'flowChioseNodeAuditUserJson': data.flowChioseNodeAuditUserJson,
            'signImg': data.signImg,
            'callback': function () {
              _.tooltips_succeed('i18n.operationSuccess');
              isWhiteCorpId({agentCode:'reimbursement',agentFunction:'loan'}).then((res)=>{
                if (res.code == '0') {
                  let isWhite = res.data.isWhiteCorpId;
                  setTimeout(() => {
                    if (self.approveActionStatus == "closeApprove") {
                      self.$router.replace('/');
                    } else {
                      isWhite ? self.$router.push('/newRelated') : self.$router.push('/approved');
                    }
                  }, 1000);
                }else {
                  _.alert('提示',res.desc);
                }
              }).catch(err => {
                _.alert('提示', err.desc);
              })
            }
          });
        }
      },
      // 滚动更多列表
      scrollList() {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if (!this.lock_roll && this.hasMore) {
            this.lock_roll = true;
            this.currentPage++;
            this.loadMoreList(status);
          }
        }
      },
      //只看评论
      onlySeeComment(type) {
        this.currentPage = 1;
        this.commentList.length = 0;
        this.commentStatus = type ? "2" : "1";
        if (!this.loading) {
          this.loadMoreList();
        }
      },
      // 加载更多列表
      loadMoreList() {
        var data = {
          id: this.reimId,
          size: 10,
          commentStatus: this.commentStatus,
        };
        this.loading = true;
        data.page = this.currentPage;
        commentListMore(data, this.dealCommentList);
      },
      dealCommentList(data) {
        this.loading = false;
        let commentCount = data.tbTaskinfo ? data.tbTaskinfo.commentCount : null
        this.showCommentList(data.comments, data.hasMore, commentCount);
      },
      showCommentList(data, hasMore, commentCount) { // 处理返回的评论
        this.hasMore = hasMore;
        this.lock_roll = false;
        if (data && data.length > 0) {
          this.commentList.push(...data);
          this.listTotalRows = commentCount ? commentCount : Number(this.commentList.length);
        } else {
          this.commentList.length = 0;
          this.listTotalRows = 0;
        }
      },
      // 发送评论
      updateContent(data) {
        if (data) {
          let msg = {
            "reimCommentPO.content": data.content,
            "reimCommentPO.reimId": this.reimId,
            "reimCommentPO.type": data.type,
            "signImg": data.signImg,
            "userId":_.userId
          };
          data.userIds ? msg.userIds = data.userIds : "";
          data.isApprove ? msg.isApprove = data.isApprove : "";

          var self = this;
          addCommentList(msg, function (result) {
            if (result.commentId) {
              self.commentList.splice(0, 0, {
                commentId: result.commentId,
                headPic: _.headPic,
                personName: _.personName,
                creator: _.userId,
                type: data.type,
                content: data.content,
                time: "刚刚",
                commentStatus: data.status,
              });
              self.listTotalRows++;
            }
            if (data.status == "6") {
              window.location.reload();
            }
          });
        }
      },
      // 删除评论
      deleteThisComment(data, index) {
        if (data) {
          this.deleteListIndex = index;
          var self = this;
          deleteCommentList({
            commentId: data.commentId
          }, function (result) {
            self.commentList.splice(self.deleteListIndex, 1);
            self.listTotalRows--;
          });
        }
      },
      //银行信息
      showDetailBankContent() {
        this.isShowBankContent = !this.isShowBankContent;
      },
      //附件
      showAttachment() {
        this.isShowAttachment = !this.isShowAttachment;
      },
      // 金额的超额
      getMoney(obj) { //金额的预算和超额
        let str2 = '';
        if (obj.state == 1) { //1为标准超额
          let limitCycle = '';
          if (obj.limitCycle == 1) {
            limitCycle = this.$t('i18n.reim.daily');
          } else if (obj.limitCycle == 2) {
            limitCycle = this.$t('i18n.reim.weekly');
          } else {
            limitCycle = this.$t('i18n.reim.monthly');
          }
          str2 = this.$t('i18n.reim.theSubject') + limitCycle + this.$t('i18n.reim.limit') + obj.limitMoney + this.$t('i18n.reim.rmb') + '，' + this.$t('i18n.reim.aboveQuota') + obj.surplusMoney + this.$t('i18n.reim.rmb');
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
              str1 = this.$t('i18n.reim.exceed') + startMonth + this.$t('i18n.reim.month') + this.$t('i18n.reim.budget');
            } else {
              str1 = this.$t('i18n.reim.exceed') + startMonth + this.$t('i18n.to') + endMonth + this.$t('i18n.reim.month') + this.$t('i18n.reim.budget');
            }
            str1 += obj.exceedMoney + this.$t('i18n.reim.rmb');
          } else {
            str1 = "";
          }
        }
        return str1;
      },
      //出差单
      askInvoice(reimData) {
        return {
          title: this.$t('i18n.reim.editor.askRecpt'), //标题
          name: reimData.title,
          price: this.$t('i18n.reim.editor.duration')+':' + reimData.sumAskDays + this.$t('i18n.day'),
          time: this.$t('i18n.reim.editor.startTime')+':' + reimData.startTime
        }
      },
      //用车单
      carInvoice(reimData) {
        return {
          title: this.$t('i18n.reim.editor.vehRecpt'),
          name: reimData.carTitle,
          price: this.$t('i18n.reim.editor.expense')+':' + reimData.luqiaoFee,
          time: this.$t('i18n.reim.editor.carTake')+':' + reimData.takeTime
        }
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
      //打印预览
      printDetail() {
        if (isVipSilver(interfaceCode.INTERFACE_CODE_FORM)) {
          let reimId = this.reimId;
          window.location.href = _.baseURL + '/jsp/wap/reimbursement/portalPrint.jsp?reimId=' + reimId;
        } else {
          _.alert('i18n.notice',this.$t('i18n.reim.detail.cvt'), 'i18n.confirm', function () {
            restoreSubmit();
          });
        }
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
      //复制
      goCopyReim() {
        this.$router.push({
          name: 'copy',
          query: {
            reimId: this.$route.query.id
          }
        });
      },
      //审批人编辑
      goApproveEditReim() {
        this.$router.push({
          name: 'approveredit',
          query: {
            reimId: this.$route.query.id,
            reimCreator: this.creator,
          }
        });
      },
      // 提单人编辑
      goEditReim() {
        this.$router.push({
          name: 'edit',
          query: {
            reimId: this.$route.query.id
          }
        });
      },
      //自定义字段多行，判断是否有换行，有则文字靠左显示，无则换行
      filterTextContent(item){
        var regu =/\n\r|\n|\r/g;
        if(item.value) {
          return item.dataType === 'DESC' || regu.test(item.value);
        }
      },
    },
    filters: {
      //如果创建时间是当年则不显示年份,不是则不显示时间
      formatDate(time) {
        return _.getFormatTime(time);
      },
      getIndex(num) { //序号
        return num < 10 ? '0' + num : num;
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import '~../../styles/mixin.scss';
  @import '~../../styles/variable.scss';
  .qwui-reimbursement_detail {
    .qwui-relative {
      position: relative;
    }
    .qwui-height_margin {
      height: 15px;
    }
    .qwui-height_bottom {
      height: 50px;
    }
    .qwui-detail_arrowImg {
      transform: rotate(180deg);
    }
    .qwui-detail_warn {
      border-left: 5px solid $money-status-warn;
    }
    .qwui-detail_normal {
      border-left: 5px solid $money-status-normal;
    }
    .qwui-text_warn {
      color: $money-status-warn;
    }
    .qwui-text_normal {
      color: $money-status-normal;
    }
    .qwui-detail {
      padding: 15px;
      background-color: $color-background;
      .qwui-detail_title {
        line-height: 27px;
        color: #333333;
        font-size: $font-size-large;
        word-break: break-word;
        font-weight: 500;
        margin-bottom: 7px;
        .qwui-detail_title_name {
         vertical-align: middle;
        }
      }
      .qwui-detail_date {
        font-size: $font-size-medium-s;
        margin-bottom: 7px;
        .qwui-detail_date_time {
          display: inline-block;
          color: $color-text-sub;
          margin-right: 10px;
        }
        .qwui-detail_date_name {
          color: $color-text-sub;
        }
      }
      .qwui-detail_reim_No {
        display: inline-block;
        color: $color-text-sub;
        font-size:$font-size-medium-s;
      }
    }
    .qwui-detail_content_list {
      background-color: $color-background;
      .qwui-detail_content {
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
        .qwui-detail_content_no {
          display: inline-block;
          font-size: $font-size-large-s;
        }
        .qwui-detail_content_time {
          float: right;
          color: $color-text-tip;
          font-size: $font-size-small;
        }
        .qwui-detail_content_center {
          clear: both;
          color:#333333;
          position: relative;
          .qwui-detail_content_name {
            font-size: $font-size-medium-x;
            display: inline-block;
            width: 128px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .qwui-detail_content_price {
            float: right;
            font-size: $font-size-medium-x;
            font-weight: bold;
          }
        }
        .qwui-detail_content_budget {
          font-size: $font-size-small;
          text-align: right;
          color: $money-status-warn;
        }
      }
      .qwui-detail_list {
        width: 100%;
        background-color: $color-background;
        margin-top: 10px;
        .qwui-detail_list_head {
          height: 50px;
          line-height: 50px;
          .qwui-detail_list_no {
            display: inline-block;
            width: 16px;
            height: 15px;
            font-size: $font-size-large-s;
            font-weight: Semibold;
            margin-left: 16px;
          }
          .qwui-detail_list_arrow {
            float: right;
            width: 14px;
            height: 8px;
            margin-top: 21px;
            margin-right: 16px;
            transform: rotate(180deg);
          }
        }
        .qwui-detail_list_content {
          margin-left: 16px;
          padding: 18px 16px 18px 0;
          display: flex;
          font-size: $font-size-medium-x;
          .qwui-detail_list_cost {
            display: inline-block;
            text-align: left;
            color: $color-text-sub;
          }
          .qwui-detail_list_name {
            flex: 1;
            padding-left: 30px;
            text-align: right;
            color: $color-text-d;
            word-break: break-all;
            white-space: pre-wrap;
            .qwui-detail_list_textcontent{
              text-align: left;
              float: right;
            }
          }
          .qwui-detail_list_subject {
            padding-right:16px;
          }
          .qwui-reim_remark {
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
          .qwui-detail_list_img {
            display: inline-block;
            margin-right: 13px;
            .qwui-detail_list_preview {
              width:45px;
              height: 45px;
            }
          }
        }
        .qwui-detail_list_remark {
          padding: 0 16px 18px 0;
          word-break: break-all;
          .qwui-detail_cost {
            text-align: left;
            color: $color-text-d;
            white-space: pre-wrap;
          }
        }
        .qwui-detail_list_desc{
          margin-left: 16px;
          padding: 18px 16px 18px 0;
          font-size: $font-size-medium-x;
          .qwui-detail_list_desclabel{
            color: $color-text-sub;
            margin-bottom: 18px;
          }
          .qwui-detail_list_name{
            display: inline-block;
            color: #333;
            white-space: pre-wrap;
            word-break: break-all;
          }
        }
        .qwui-detail_pad_bot {
          padding-top: 0px;
        }
        .qwui-detail_imgList {
          padding-top: 0px;
          flex-wrap: wrap;
        }
        .qwui-detail_amount_budget {
          margin-left: 16px;
          padding: 18px 16px 18px 0;
          font-size: $font-size-medium-x;
          .qwui-detail_list_cost {
            display: inline-block;
            color: $color-text-sub;
          }
          .qwui-detail_list_name {
            display: inline-block;
            float: right;
            color: $color-text-d;
            text-align: right;
          }
          .qwui-detail_list_budget {
            text-align: right;
            font-size: $font-size-small;
            color: $money-status-warn;
          }
        }
        .qwui-detail_list_images {
          height: 50px;
          line-height: 50px;
          margin-left: 16px;
          .qwui-detail_list_cost {
            width: 82px;
            height: 16px;
            color: $color-text-sub;
            font-size: $font-size-medium-x;
            font-family: PingFangSC-Regular;
          }
        }
      }
    }

    .loan_field {
      margin-top: 10px;
      padding: 0 15px 15px;
      background: $color-background;

      .loan_title {
        height: 50px;
        font-size: 16px;
        line-height: 50px;
      }
    }

    .qwui-detail_region {
      background-color: $color-background;
      margin-top: 10px;
      .qwui-detail_region_title {
        font-size: $font-size-medium-x;
        color: #333;
        padding:16px;
        margin-bottom:18px;
      }
      .qwui-detail_region_total {
        padding:0 16px 7px 16px;
        .qwui-detail_total_name {
          display: inline-block;
          color: $color-text-sub;
          font-size: $font-size-medium-s;
        }
        .qwui-detail_total_price {
          float: right;
          color: #333333;
          font-size: $font-size-medium-x;
          font-weight: bold;
        }
      }
      .qwui-detail_region_bot {
        font-size: $font-size-small;
        padding:0 0 14px 16px;
        color: $color-text-tip;
      }
    }
    .qwui-global_remarks{
      margin-top: 10px;
      background-color: $color-background;
      font-size: 16px;
      padding: 15px;
      .qwui-remarks_label{
        color: $color-text-d;
        margin-bottom: 10px
      }
      .qwui-remarks_content{
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
    .qwui-detail_bank {
      width: 100%;
      background-color: $color-background;
      margin-top: 10px;
      .qwui-detail_bank_info {
        height: 50px;
        line-height: 50px;
        .qwui-detail_bank_name {
          width: 90px;
          height: 16px;
          font-size: $font-size-medium-x;
          color: $color-text-d;
          margin-left: 15px;
        }
        .qwui-detail_bank_arrow {
          float: right;
          margin-right: 16px;
          .qwui-detail_bank_img {
            width: 14px;
            height: 8px;
          }
        }
      }
      .qwui-detail_bank_row {
        display: flex;
        font-size: $font-size-medium-x;
        margin-left: 15px;
        padding: 18px 16px 18px 0;
        .qwui-detail_bank_title {
          display: inline-block;
          width: 110px;
          text-align: left;
          color: $color-text-sub;
        }
        .qwui-detail_bank_data {
          flex: 1;
          text-align: right;
          color: $color-text-d;
        }
      }
    }
    .qwui-detail_attachment {
      width: 100%;
      background-color: $color-background;
      margin-top: 10px;
      .qwui-detail_attachment_info {
        height: 50px;
        line-height: 50px;
        .qwui-detail_attachment_name {
          width: 90px;
          height: 16px;
          font-size: 16px;
          color: $color-text-d;
          margin-left: 15px;
        }
        .qwui-detail_attachment_arrow {
          float: right;
          margin-right: 16px;
          .qwui-detail_attachment_img {
            width: 14px;
            height: 8px;
          }
        }
      }
      .qwui-detail_fujian {
        display: flex;
        line-height: 1.4;
        padding: 10px 15px 10px 15px;
        .qwui-detail_fujian_images {
          border-radius: 4px;
        }
        .qwui-detail_fujian_text {
          flex: 1;
          position: relative;
          padding-right: 100px;
          .qwui-detail_fujian_name {
            display: -webkit-box;
            font-size: 15px;
            color: $color-text-d;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .qwui-detail_fujian_size {
            color: #999;
            font-size: $font-size-medium-s;
          }
        }
        .qwui-detail_fujian_down {
          position: absolute;
          width: 24px;
          height: 24px;
          top: 50%;
          right: 0px;
          margin-top: -12px;
        }
      }
    }
    .qwui-detail_btn {
      color: $color-text-d;
      background-color: $color-background;
    }
  }

</style>
