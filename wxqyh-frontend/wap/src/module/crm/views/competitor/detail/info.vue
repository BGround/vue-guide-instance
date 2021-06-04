<template>
  <div class="crm-competitor-detail-info">
    <div class="info-container base-info">
      <div class="info-title">
        <i></i>
        <span>基本信息</span>
      </div>
      <div class="info-content">
        <div class="info-content-item">
          <span>规模</span>
          <span>{{scaleOptions[competitorDetail.scale]}}</span>
        </div>
        <div class="info-content-item">
          <span>竞争力</span>
          <span>{{competitorPowerOptions[competitorDetail.competitorPower]}}</span>
        </div>
        <div class="info-content-item">
          <span>优势</span>
          <span>{{competitorDetail.advantage}}</span>
        </div>
        <div class="info-content-item">
          <span>劣势</span>
          <span>{{competitorDetail.disadvatage}}</span>
        </div>
        <div class="info-content-item">
          <span>策略</span>
          <span>{{competitorDetail.strategy}}</span>
        </div>
        <div class="info-content-item">
          <span>联系信息</span>
          <span>{{competitorDetail.contactInfo}}</span>
        </div>
        <div class="info-content-item">
          <span>描述</span>
          <span>{{competitorDetail.description}}</span>
        </div>
      </div>
    </div>
    <div class="info-container other-info">
      <div class="info-title">
        <i></i>
        <span>其他信息</span>
      </div>
      <div class="info-content">
        <div class="info-content-item">
          <span>负责人</span>
          <div class="info-content-item-images">
            <div class="info-content-item-images-left">
              <CrmAvator v-for="(item,index) in competitorDetail.toPersons"
                         :key="item.userId"
                         :avator-src="item.headPic"
                         :avatorStyle="{width:'27px',height:'27px'}"
                         v-if="index<5"
                         @click.native="showUserInfo(item)"></CrmAvator>
            </div>
            <div class="info-content-item-images-right"
                 @click="showAllPersons('toPersons')"
                 v-if="competitorDetail.toPersons&&competitorDetail.toPersons.length>5">
              <i></i>
            </div>
          </div>
        </div>
        <div class="info-content-item">
          <span>相关人</span>
          <div class="info-content-item-images">
            <div class="info-content-item-images-left">
              <CrmAvator v-for="(item,index) in competitorDetail.ccPersons"
                         :key="item.userId"
                         :avator-src="item.headPic"
                         :avatorStyle="{width:'27px',height:'27px'}"
                         v-if="index<5"
                         @click.native="showUserInfo(item)"></CrmAvator>
            </div>
            <div class="info-content-item-images-right"
                 @click="showAllPersons('ccPersons')"
                 v-if="competitorDetail.ccPersons&&competitorDetail.ccPersons.length>5">
              <i></i>
            </div>
          </div>
        </div>
        <div class="info-content-item">
          <span>创建人</span>
          <span>{{competitorDetail.personName}}</span>
        </div>
        <div class="info-content-item">
          <span>创建时间</span>
          <span>{{competitorDetail.createTime | dateFormat("YYYY-MM-DD HH:mm")}}</span>
        </div>
        <div class="info-content-item">
          <span>更新时间</span>
          <span>{{competitorDetail.updateTime | dateFormat("YYYY-MM-DD HH:mm")}}</span>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <!-- 更多负责人相关人 -->
      <popup v-model="allPersons.show"
             height="100%"
             :popup-style={zIndex:8}
             :show-mask="false"
             :is-transparent="true">
        <div class="persons-popup  popop-has-bottombar">
          <div class="persons-popup-header"
               v-if="allPersons.list">
            <p>{{allPersons.title}}</p>
          </div>
          <div class="persons-popup-body">
            <div class="persons-popup-body-item"
                 v-for="(item) in allPersons.list"
                 :key="item.userId">
              <CrmAvator :avator-src="item.headPic"
                         :avatorStyle="{width:'40px',height:'40px'}"
                         @click.native="showUserInfo(item)"
                         container=".persons-popup"></CrmAvator>
              <span>{{item.personName}}</span>
            </div>

          </div>
          <div class="persons-popup-fotter">
            <QwuiButton text="返回"
                        @click.native="allPersons.show=false"></QwuiButton>
          </div>
        </div>
      </popup>
      <!--个人信息-->

      <user_info ref="loadPersonalMsg"></user_info>
    </div>
  </div>
</template>

<script>
import { getCompetitorDetail } from "crm/api/competitor";
import CrmAvator from "crm/components/CrmAvator";
import { Popup, dateFormat, TransferDom } from "vux";
import QwuiButton from "@/components/base/button/button";
import user_info from "@/components/detail/user_info_card"; //个人信息
export default {
  name: "crmCompetitorDetailInfo",
  components: { CrmAvator, Popup, QwuiButton, user_info },
  filters: { dateFormat },
  props: ["competitorDetail"],
  directives: { TransferDom },
  data() {
    return {
      scaleOptions: [
        "",
        "0-20人",
        "20-50人",
        "50-100人",
        "100-200人",
        "200-500人",
        "500-1000人",
        "1000人以上"
      ],
      competitorPowerOptions: [
        "",
        "弱竞争力",
        "一般竞争力",
        "潜在竞争力",
        "强竞争力"
      ],
      allPersons: {
        show: false
      }
    };
  },
  created() {},
  methods: {
    showUserInfo(item) {
      this.$refs.loadPersonalMsg.showUserMessage(item, true);
    },
    showAllPersons(val) {
      if (val === "toPersons") {
        this.allPersons = {
          list: this.competitorDetail.toPersons,
          title: `负责人（${this.competitorDetail.toPersons.length}）`,
          show: true
        };
      } else {
        this.allPersons = {
          list: this.competitorDetail.ccPersons,
          title: `相关（${this.competitorDetail.ccPersons.length}）`,
          show: true
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../style/variable.scss";

.crm-competitor-detail-info {
  height: 100%;
  overflow-y: auto;
  .info-container {
    margin-top: 12px;
    padding: 10px 15px;
    .info-title {
      display: flex;
      align-items: center;
      padding: 8px 0;
      i {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 6px;
        background-size: contain;
        background-repeat: no-repeat;
      }
      span {
        font-size: 16px;
        color: #0a1735;
      }
    }
    &.base-info {
      .info-title i {
        background-image: url("~assets/images/crm/icon-info-base.png");
      }
    }
    &.other-info {
      .info-title i {
        background-image: url("~assets/images/crm/icon-info-other.png");
      }
    }
    .info-content {
      background: #f7f8f9;
      border-radius: 6px;
      padding: 16px 22px;
      &-item {
        display: flex;
        font-size: 14px;
        color: #0a1735;
        span:first-child {
          color: #7a7c80;
          display: inline-block;
          width: 35%;
        }
        span:nth-child(2) {
          flex: 1;
          word-break: break-all;
          white-space: pre-wrap;
        }
        &:not(:last-child) {
          margin-bottom: 12px;
        }
        &-images {
          display: flex;
          overflow-y: auto;
          align-items: center;
          flex: 1;
          justify-content: space-between;
          &-left {
            display: flex;
            flex: 1;
            overflow-x: hidden;
            .crm-avator {
              margin-right: 5px;
            }
          }
          &-right {
            padding: 2px;
            display: flex;
            align-items: center;
            i {
              display: inline-block;
              background: url("~assets/images/crm/icon_go.png") no-repeat;
              background-size: contain;
              width: 13px;
              height: 13px;
            }
          }
        }
      }
    }
  }
}
.persons-popup {
  width: 100%;
  height: 100%;
  max-width: $pageMaxWidth;
  margin: auto;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  &-header {
    padding: 10px 15px;
    border-bottom: 1px solid #f5f5f5;
    color: #999;
  }
  &-body {
    flex: 1;
    padding: 10px 15px;
    // display: flex;
    // flex-wrap: wrap;
    overflow-y: auto;
    // align-items: flex-start;
    &-item {
      display: inline-block;
      margin: 0 5px 10px 0;
      text-align: center;
      .crm-avator {
        margin: auto;
      }
      span {
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 1;
        word-break: break-all;
        display: -webkit-box;
        width: 4em;
        -webkit-box-orient: vertical;
      }
    }
  }
  &-fotter {
    padding: 10px 15px;
  }
}
</style>


