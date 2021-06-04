<template>
  <div class="investors-detail">

    <div class="panel">
      <div class="panel__title">基本信息</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">姓名</div>
            <div class="field__value">{{detail.name||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">性别</div>
            <div class="field__value">{{detail.sex||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">手机号</div>
            <div class="field__value">{{detail.telephone||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">邮箱</div>
            <div class="field__value">{{detail.email||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">出生日期</div>
            <div class="field__value">{{detail.birthday||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">学历</div>
            <div class="field__value">{{detail.education||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">国籍</div>
            <div class="field__value">{{detail.nationality||'-'}}</div>
          </div>

           <div class="field__item">
            <div class="field__label">籍贯</div>
            <div class="field__value">{{detail.nativePlace||'-'}}</div>
          </div>

           <div class="field__item">
            <div class="field__label">公司电话</div>
            <div class="field__value">{{detail.mobile||'-'}}</div>
          </div>

           <!-- <div class="field__item">
            <div class="field__label">常驻城市</div>
            <div class="field__value">{{detail.city ||'-'}}</div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="gutter"></div>

    <div class="panel">
      <div class="panel__title">股本信息</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">投入金额（万元）</div>
            <div class="field__value">{{detail.money||'-'}}</div>
          </div>

           <div class="field__item">
            <div class="field__label">占比（%）</div>
            <div class="field__value">{{detail.proportion||'-'}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="gutter"></div>

    <div class="panel">
      <div class="panel__title">工作简历</div>
      <div class="panel__section" v-if="detail.workHistory">
        <div class="panel__subtitle">
          {{detail.workHistory}}
        </div>
        <div class="field" v-show="detail.workHistory">
           <div class="field__item">
            <div class="field__label">{{detail.bearPost||'-'}}</div>
            <div class="field__value">{{detail.beginYear||'-'}}</div>
          </div>
        </div>
      </div>
      <div class="panel__section" v-else>
        <div class="no-data">暂无信息</div>
      </div>
    </div>

    <div class="gutter"></div>


    <div class="panel">
      <div class="panel__title">社会职务</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item"  v-if="detail.sociologyPost">
            <div class="field__label">{{detail.sociologyPost||'-'}}</div>
            <div class="field__value">{{detail.servingYear||'-'}}</div>
          </div>
          <div class="no-data" :style="{paddingBottom: '15px'}" v-else>
            暂无信息
          </div>
        </div>
      </div>
    </div>
    <div class="gutter"></div>

  </div>
</template>

<script>
import {findByInvestment} from "@/module/channelManagement/api/networkInfo/index"
import reloadApp from '@/module/channelManagement/mixins/reloadApp';
import {mapGetters} from 'vuex';
export default {
  mixins: [reloadApp],
  data(){
    return {
      detail:{}
    }
  },
  computed: {
    ...mapGetters('investorDetail', ['getInvestorDetail'])
  },
  created(){
   this.detail = this.getInvestorDetail;
  }
}
</script>

<style lang="scss" scoped>
  .investors-detail{
    background: #ffffff;
    padding-bottom: 50px;
    .gutter{
      height:8px;
      background:rgba(245,245,245,1);
    }

    .panel{
      padding: 15px;
    }
    .panel__title{
      height:24px;
      font-size:17px;
      font-weight:600;
      line-height:24px;
      color:rgba(0,0,0,1);
    }

    .panel__subtitle{
      height:22px;
      font-size:16px;
      line-height:22px;
      color:rgba(51,51,51,1);
      padding-bottom: 13px;
      font-weight:bold;
    }
    .panel__content{
      padding-top: 15px;
    }
    .panel__section{
      position: relative;
      padding-bottom: 15px;
      padding-top: 15px;
    }
    .panel__section:last-child::after{
      display: none;
    }
    .panel__section::after{
      content: '';
      display: block;
      background: rgba(219,219,219,1);
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 0;
      transform: scaleY(0.5);
    }

    .field__item{
      display: flex;
      justify-content: space-between;
    }

    .field__label{
      font-size:15px;
      font-weight:400;
      line-height:34px;
      color:rgba(153,153,153,1);
      white-space: nowrap;
      margin-right: 10px;
    }
    .field__value{
      font-size:15px;
      font-family:PingFang SC;
      font-weight:400;
      line-height:34px;
      color:rgba(51,51,51,1);
    }

    .field__item--lang{
      white-space: normal;
      &> .field__value{
        line-height:24px;
      }
    }
    .no-data{
      text-align: center;
      font-size: 13px;
      color: #ccc;
    }
  }
</style>