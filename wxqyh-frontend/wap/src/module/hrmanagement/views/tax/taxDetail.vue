<template>
  <div class="wrap qwui-tax-page">
    <!-- tab栏 -->
    <nav-tabs
      :tabs="tabs"
      position="top"
      :activeIndex="indexControl"
      @listenNavTabs="listenNavTabsBack">
      <div slot="height" style="height:50px;"></div>
    </nav-tabs> 
    <div class="qw_tabs_content">
      <div v-if="showItem == 0">
        <div class="qw_tax_rule">
          个人所得税= (税前工资-各项社会保险费-起征金额-个税抵扣金额) *适用税率-速算扣除数
        </div>
        <div class="qw_tax_rule_info">
          <div class="tax_rule_title">
            <h5><span>以下金额仅为示例</span></h5>
            <p>个税专项扣减的实际金额，根据国家最终发布的标准执行。</p>
          </div>
          <ul class="qw_rule_ul">
            <li class="qw_rule_li">
              <h5>子女教育抵扣</h5>
              <div class="qw_rule_info">月扣减额=1000元*受教育子女数</div>
            </li>
            <li class="qw_rule_li">
              <h5>继续教育扣减</h5>
              <div class="qw_rule_info">月扣减额=400元 (学历继续教育)</div>
              <div class="qw_rule_info">月扣减额=350元 (职业资格继续教育)</div>
            </li>
            <li class="qw_rule_li">
              <h5>重大病医疗扣减</h5>
              <div class="qw_rule_info qw_rule_info_bold">年扣减额=自费医疗支出-15000</div>
              <div class="qw_rule_info qw_rule_info_bold">*年扣减额度上限60000元</div>
            </li>
            <li class="qw_rule_li">
              <h5>住房贷款扣减</h5>
              <div class="qw_rule_info">月扣减额=1000元（首套房还贷期间）</div>
            </li>
            <li class="qw_rule_li">
              <h5>住房租金抵扣</h5>
              <div class="qw_rule_info">月扣减额=1200/1000/800元</div>
              <div class="qw_rule_info">*不同规模的尝试扣减金额不同</div>
            </li>
            <li class="qw_rule_li">
              <h5>赡养老人抵扣</h5>
              <div class="qw_rule_info">月扣减额=2000元</div>
              <div class="qw_rule_info">*多人赡养共同分摊，多位老人金额不加倍</div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="showItem == 1">
        <div class="qw_tax_total">
          <i class="total_tips">总金额</i>
          当前申报<span><i>¥</i>{{ totalMoney }}</span>
        </div>
        <div class="qwui-work_gutter"></div>
        <div class="qwui-lean_entry_list">
          <div
            v-for="(item, index) in list"
            :key='index'
            class="lean_entry_list_item qwui-flexbox pad15"
            @click="getFocus">
            <i :class="['qw_tax_item_icon','qw_tax_item_icon_' + item.key]"></i>
            <div class="qwui-flexItem qwui-font_light">
              <div class="qwui-flexItem">{{ item.text }}</div>
              <p :class="'apply_status_'+item.status">{{ item.status | filterStatus }}</p>
            </div>
            <i class="qwui-icon_arrow_fr icon_gray pr25"></i>
          </div>
        </div>
      </div>
      <div v-if="showItem == 2">
        <div class="qw_rule_box">
          <p class="qw_rule_year"><span>2019</span></p>
          <h5>个税专项附加扣除·申报</h5>
          <div class="qw_rule_tips">2019年1月1日个税专项附加扣除正式实施后，<br>在这里可以<span>查询</span>每月实际抵扣情况</div>
          <a href="javascript:;" :class="['focus_btn',{'focus_btn_active':isFocus}]" @click="getFocus">{{ isFocus?'已关注':'关注' }}</a>
        </div>
        <ul class="qw_tax_question">
          <li><i></i>问题一：员工申请个税专项附加扣除时，企业有义务给员工办理吗？</li>
          <li><i></i>问题二：成功申请个税专项附加扣除后，多长时间内有效？</li>
          <li><i></i>问题三：成功申请个税专项附加扣除后，能节约多少个人所得税？</li>
        </ul>
        <div class="qw_code_box">
          <div class="qw_code">
            <img :src="codeImgSrc" alt="" @click="previewImg(codeImgSrc)">
          </div>
          <div class="qw_code_text">
            <div class="qwui-flexItem">点击识别二维码或者扫码添加客服</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 弹出框 -->
    <dialog-group :show="dialog.dialogShow"
                  @cancel="cancelDialog"
                  @confirm="confirmDialog"
                  :cancelText="dialog.cancelText"
                  :confirmText="dialog.confirmText">
      <slot>
        <div class="tips">
          <p v-if="isFocus">已关注，功能上线后会收到<br>消息通知</p>
          <p v-else>功能即将上线，是否关注？</p>
        </div>
      </slot>
    </dialog-group>

    <!--预览图片组件-->
    <previewImages></previewImages>
  </div>
</template>
<script>
import { attentionTax, isAttentionTax, getImgFileURL } from "../../api/getData";
import navTabs from "@/components/base/nav_tabs";
import dialogGroup from "@/components/base/dialog/dialog-group";
import previewImages from "@/components/base/previewImages";
import EventBus from '@/utils/eventBus';
export default {
  name: "taxDetail",
  data() {
    return {
      tabs: [
        //tab栏
        { text: "抵扣规则" },
        { text: "抵扣申报" },
        { text: "抵扣记录" }
      ],
      indexControl: 0, //tab默认选中项

      showItem: 0,

      totalMoney: 0,
      list: [
        { text: "子女教育", status: 0, key: "children" },
        { text: "继续教育", status: 0, key: "education" },
        { text: "大病医疗", status: 0, key: "Medical" },
        { text: "住房贷款", status: 0, key: "loans" },
        { text: "住房租金", status: 0, key: "renting" },
        { text: "赡养老人", status: 0, key: "elderly" }
      ],

      /* 弹出框 */
      dialog: {
        dialogShow: false,
        confirmText: '是的',
        cancelText: '否'
      },
      isFocus: false,

      codeImgSrc: ''

    };
  },
  methods: {
    //tabs切换
    listenNavTabsBack(index) {
      this.showItem = index;
    },
    getFocus(){
      this.dialog.dialogShow = true
    },
    /* 关注 */
    confirmDialog(){
      if(!this.isFocus){
        attentionTax({},(res) => {
          this.isFocus = true
          this.dialog.confirmText = ''
          this.dialog.cancelText = '确定'
        })
      }
    },
    /* 弹窗-取消 */
    cancelDialog(){
      this.dialog.dialogShow = false
    },
    /* 判断是否关注 */
    isAttentionTax(){
      isAttentionTax({},(res) => {
        if(res.isAttention){
          this.isFocus = true
          this.dialog.confirmText = ''
          this.dialog.cancelText = '确定'
        }
      })
    },
    /* 获取二维码 */
    getImgFileURL(){
      getImgFileURL({},(res) => {
        this.codeImgSrc = res.url
      })
    },
    //预览图片
    previewImg(previewImageURL){
      EventBus.$emit("previewImages",previewImageURL,[{src:previewImageURL}]);
    },
  },
  created () {
    this.isAttentionTax()
    this.getImgFileURL()
  },
  components: {
    navTabs,
    dialogGroup,
    previewImages
  },
  filters: {
    filterStatus(status){
      let statusArr = [
        { text: "未申报，去申报", value: 0 },
        { text: "审批中", value: 1 },
        { text: "已退审", value: 2 },
        { text: "已申报，可修改", value: 3 },
        { text: "草稿", value: 4 },
      ]
      for (let index = 0; index < statusArr.length; index++) {
        if( statusArr[index].value == status ) {
          return statusArr[index].text
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.qwui-tax-page{
  .qw_tax_rule{
    padding: 14px 14px 22px 14px;
    font-size: 13px;
    color: #A5ABB9;
    background: #F3F5F8;
  }
  .qw_tax_rule_info{
    position: relative;
    top: -8px;
    background: #fff;
    border-radius: 14px 14px 0 0;
    padding: 14px;
    box-shadow: 0 -4px 8px rgba(227, 228, 232, .5);
    .tax_rule_title{
      margin-bottom: 13px;
      h5{
        span{
          position: relative;
          font-size: 15px;
          color: #0A1735;
          z-index: 1;
          &:before{
            content: "";
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(85, 133, 240, .25);
            height: 5px;
            z-index: -1;
          }
        }
      }
      p{
        font-size: 13px;
        color: #85868F;
      }
    }
    .qw_rule_ul{
      .qw_rule_li{
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 15px;
        height: 94px;
        box-sizing: border-box;
        &:nth-of-type(1){
          background: url(~assets/images/bg_a-rz_taxbg1.png) no-repeat;
          background-size: 100% 100%;
        }
        &:nth-of-type(2){
          background: url(~assets/images/bg_a-rz_taxbg2.png) no-repeat;
          background-size: 100% 100%;
        }
        &:nth-of-type(3){
          background: url(~assets/images/bg_a-rz_taxbg3.png) no-repeat;
          background-size: 100% 100%;
        }
        &:nth-of-type(4){
          background: url(~assets/images/bg_a-rz_taxbg4.png) no-repeat;
          background-size: 100% 100%;
        }
        &:nth-of-type(5){
          background: url(~assets/images/bg_a-rz_taxbg5.png) no-repeat;
          background-size: 100% 100%;
        }
        &:nth-of-type(6){
          background: url(~assets/images/bg_a-rz_taxbg6.png) no-repeat;
          background-size: 100% 100%;
        }
        h5{
          color: RGBA(255, 255, 255, .9);
          font-size: 16px;
          line-height: 22px;
          margin-bottom: 4px;
          font-weight: bold;
        }
        .qw_rule_info{
          color: RGBA(255, 255, 255, .5);
          font-size: 13px;
          line-height: 18px;
          margin-bottom: 2px;
          &.qw_rule_info_bold{
            color: RGBA(255, 255, 255, .6);
          }
        }
      }
    }
  }
  .qw_tax_total{
    position: relative;
    font-size: 14px;
    color: #85868F;
    padding: 15px 0;
    text-align: center;
    background: #fff;
    margin-bottom: 8px;
    .total_tips{
      position: absolute;
      top: 8px;
      right: 0;
      width: 58px;
      height: 20px;
      text-align: center;
      font-size: 12px;
      color: #B2B9C8;
      background: #F7F8FA;
      border-radius: 10px 0 0 10px;
    }
    span{
      color: #0A1735;
      font-size: 28px;
      i{
        font-size: 20px;
        margin: 0 6px;
      }
    }
  }
  .qwui-lean_entry_list{
    background: #f2f3f5;
    .lean_entry_list_item{
      height: 69px;
      line-height: inherit;
      background: #fff;
      border-bottom: 1px solid #F7F8FA;
      align-items: center;
      .qw_tax_item_icon{
        width: 50px;
        height: 50px;
        margin-right: 12px;
        &.qw_tax_item_icon_children{
          background: url(~assets/images/icon_taxlist.png) no-repeat 0 0;
          background-size: 50px 300px;
        }
        &.qw_tax_item_icon_education{
          background: url(~assets/images/icon_taxlist.png) no-repeat 0 -50px;
          background-size: 50px 300px;
        }
        &.qw_tax_item_icon_Medical{
          background: url(~assets/images/icon_taxlist.png) no-repeat 0 -100px;
          background-size: 50px 300px;
        }
        &.qw_tax_item_icon_loans{
          background: url(~assets/images/icon_taxlist.png) no-repeat 0 -150px;
          background-size: 50px 300px;
        }
        &.qw_tax_item_icon_renting{
          background: url(~assets/images/icon_taxlist.png) no-repeat 0 -200px;
          background-size: 50px 300px;
        }
        &.qw_tax_item_icon_elderly{
          background: url(~assets/images/icon_taxlist.png) no-repeat 0 -250px;
          background-size: 50px 300px;
        }
      }
      .qwui-flexItem{
        p{
          font-size: 13px;
          &.apply_status_0{
            color: #B2B9C8;
          }
          &.apply_status_1{
            color: red;
          }
          &.apply_status_2{
            color: #252525;
          }
          &.apply_status_3{
            color: #999;
          }
        }
      }
    }
  }
  .qw_rule_box{
    text-align: center;
    padding: 18px;
    height: 210px;
    box-sizing: border-box;
    margin: 12px 14px;
    background: url(~assets/images/tax_rule_bg.png) no-repeat;
    background-size: 100% 100%;
    .qw_rule_year{
      span{
        position: relative;
        font-size: 16px;
        color: #fff;
        &:before,&:after{
          content: "";
          position: absolute;
          bottom: 8px;
          width: 8px;
          height: 1px;
          background: #fff;
        }
        &:before{
          left: -15px;
        }
        &:after{
          right: -15px;
        }
      }
    }
    h5{
      font-size: 28px;
      color: #fff;
      line-height: 40px;
      margin-bottom: 5px;
    }
    .qw_rule_tips{
      font-size: 14px;
      color: RGBA(255, 255, 255, .7);
      line-height: 20px;
      margin-bottom: 18px;
      span{
        font-size: 15px;
        position: relative;
        margin: 0 3px;
        z-index: 1;
        &:before{
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 7px;
          background: RGBA(76, 122, 226, .8);
          z-index: -1;
        }
      }
    }
    .focus_btn{
      display: block;
      font-size: 18px;
      color: #5585F0;
      text-align: center;
      width:210px;
      height:40px;
      line-height: 40px;
      background:linear-gradient(360deg,rgba(221,231,252,1) 0%,rgba(255,255,255,1) 100%);
      border-radius:20px;
      margin: 0 auto;
      &.focus_btn_active{
        background: #A8C0F5;
      }
    }
  }
  .qw_tax_question{
    margin: 10px 14px;
    li{
      position: relative;
      background: #F7F8FA;
      border-radius: 6px;
      padding: 8px 14px 8px 30px;
      font-size: 14px;
      color: #0A1735;
      line-height: 21px;
      margin-bottom: 10px;
      i{
        position: absolute;
        top: 14px;
        left: 14px;
        width:7px;
        height:7px;
        border:2px solid #D1D4DB;
        border-radius: 50%;
      }
    }
  }
  .qw_code_box{
    position: relative;
    display: flex;
    margin: 19px 14px 14px;
    /* z-index: 1;
    &:after{
      content: "";
      position: absolute;
      bottom: -210px;
      right: -150px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      border: 45px solid #f7f8fa;
      z-index: -1;
    } */
    .qw_code{
      margin-left: 17px;
      margin-right: 20px;
      width:80px;
      height:80px;
      background:#fff;
      box-shadow:0px 0px 6px 0px rgba(227,228,232,1);
      border-radius:6px;
      padding: 3px;
      img{
        display: block;
        width: 80px;
        height: 80px;
      }
    }
    .qw_code_text{
      .qwui-flexItem{
        font-size: 15px;
        line-height: 21px;
        margin: 9px 0 12px;
        span{
          position: relative;
          z-index: 1;
          &:before{
            content: "";
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            height:8px;
            background:rgba(255,167,33,.6);
            z-index: -1;
          }
        }
      }
      .qwui_font_category{
        color: #85868F;
      }
    }
  }
}

.tips{
  margin-bottom: 20px;
  p{
    font-size: 16px;
  }
}
@media screen and (max-width: 374px) {
  .qwui-tax-page{
    .qw_rule_box {
      h5{
        font-size: 24px;
      }
      .qw_rule_tips{
        font-size: 12px;
      }
    }
    .qw_code_box{
      .qw_code_text{
        .qwui-flexItem{
          font-size: 13px;
        }
      }
    }
  }
}
</style>
