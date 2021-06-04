<template>
  <!-- 入网信息 -->
  <div class="accessInformationWrap">
    <!-- 入网陈述信息 start -->
    <div class="titWrap">
      <h4>入网陈述信息</h4>
      <!-- <a href="javascript:;">查看更多 ></a> -->
    </div>
    <div class="accessWrap">
      <div class="subTit">
        <p> · 基础信息</p>
        <!-- <a href="javascript:;">查看更多 ></a> -->
      </div>
      <div class="accessinfo">
        <ul>
          <li>
<!--            <div class="aItem">-->
<!--              <span class="aLabel">店面状态：</span>-->
<!--              <span class="aValue">{{tbEntAccessNetworkVo.storeCondition || '-'}}</span>-->
<!--            </div>-->
            <div class="aItem">
              <span class="aLabel">入网公司名称：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.companyName}}</span>
            </div>
            <div class="aItem">
              <span class="aLabel">公司成立时间：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.establishmentTime}}</span>
            </div>
            <div class="aItem">
              <span class="aLabel">展厅地址：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.exhibitionHall}}</span>
            </div>
            <div class="aItem">
              <span class="aLabel">店厂分离距离：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.distance}}公里</span>
            </div>
            <div class="aItem">
              <span class="aLabel">维修资质级别：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.repairLevel}}</span>
            </div>
          </li>
          <li class="secondBox">
            <div class="aItem">
              <span class="aLabel">公司体制：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.companySystem}}</span>
            </div>
            <div class="aItem">
              <span class="aLabel">注册登记机关：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.authority}}</span>
            </div>
            <div class="aItem">
              <span class="aLabel">服务站地址：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.serviceStationAdress}}</span>
            </div>
            <div class="aItem">
              <span class="aLabel">销售服务合作模式：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.cooperation}}</span>
            </div>
<!--            <div class="aItem">-->
<!--              <span class="aLabel">入网陈述附件：</span>-->
<!--              <span class="aValue"><a href="javascript:;">查看</a></span>-->
<!--            </div>-->
            <div class="aItem">
              <span class="aLabel">维修资质公司全称：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.repairName}}</span>
            </div>
          </li>
          <li class="endBox">
            <div class="aItem">
              <span class="aLabel">注册资本：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.capital}}（元）</span>
            </div>
            <div class="aItem">
              <span class="aLabel">店厂是否分离：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.separate | filterSeparate}}</span>
            </div>
            <div class="aItem">
              <span class="aLabel">服务站资质公司全称：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.serviceStationName}}</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="subTit">
        <p> · 经营信息</p>
        <!-- <a href="javascript:;">查看更多 ></a> -->
      </div>
      <div class="manageInfo">
        <ul>
          <li>
            <div class="aItem mb10">
              <span class="aLabel">主营业务：</span>
              <span class="aValue">{{tbEntAccessNetworkVo.business}}</span>
            </div>
            <div class="aItem">
              <span class="aLabel" style="width:140px;">目前经营汽车品牌：</span>
              <span class="aValue">
                <p>一级：{{tbEntAccessNetworkVo.oneBrand}}</p>
                <p>二级：{{tbEntAccessNetworkVo.twoBrand}}</p>
              </span>
            </div>
          </li>
<!--          <li class="second">-->
<!--            <span class="aLabel">小轿车经营权限：</span>-->
<!--            <span class="aValue">{{tbEntAccessNetworkVo.twoBrand}} </span>-->
<!--          </li>-->
        </ul>
      </div>

      <div class="subTit">
        <p> · 法人信息</p>
        <!-- <a href="javascript:;">查看更多 ></a> -->
      </div>
      <div class="corporateInfo">
        <ul>
          <li><i class="firstName">姓名：</i>{{tbEntAccessNetworkVo.legalPerson}}</li>
          <li>性别：{{tbEntAccessNetworkVo.legalSex | filterSex}}</li>
          <li class="phoneItem">手机：{{tbEntAccessNetworkVo.telephone}}</li>
          <li>职位：{{tbEntAccessNetworkVo.legalPost}}</li>
        </ul>
      </div>
    </div>
    <!-- 入网陈述信息 end -->

    <!-- 投资人信息 start  -->
    <div class="investorInfo">
      <div class="titWrap">
        <h4>投资人信息</h4>
        <!-- <a href="javascript:;">查看更多 ></a> -->
      </div>

      <div class="investorBaseInfo">

        <div class="subTit">
          <p> · 基础信息</p>
          <!-- <a href="javascript:;">查看更多 ></a> -->
        </div>

        <table>
          <tr>
            <th>股东(名称)</th>
            <th>投入金额(万元)</th>
            <th>所占比例(%)</th>
            <th>履历</th>
          </tr>
          <tr v-for="(item,index) in investmentPO"
            :key="index">
            <td>{{item.name}}</td>
            <td>{{item.money}}</td>
            <td>{{item.proportion}}%</td>
            <td><a class="red"
                href="javascript:;"
                @click="openPersonDesFun(item)">查看</a></td>
          </tr>
          <tr v-if="investmentPO && investmentPO.length===0">
            <td colspan="4">暂无数据</td>
          </tr>
        </table>

      </div>

    </div>
    <!-- 投资人信息 end  -->

    <!-- 投资人履历弹框 start -->
    <personDesPop v-if="pop.isShowPersonDes"
      @closePersonDes="closePersonDes" :columns="personDes"></personDesPop>
    <!-- 投资人履历弹框 end -->
  </div>
</template>

<script>
import personDesPop from './accessInformation/personDesPop'
import {ajaxGetfindAllNetWork} from '../../../api/getData'
export default {
  data() {
    return {
      pop: {
        isShowPersonDes: false
      },
      personDes:{},
      investmentPO:[],
      tbEntAccessNetworkVo:{}
    }
  },
  props:['dealerId'],
  created(){
      this.init()
  },
  methods: {
    init(){
        this.getfindAllNetWork()
    },
    getfindAllNetWork(){
        let params = {
            id:this.dealerId
        }
        let self = this
        ajaxGetfindAllNetWork(params,data => {
            if(data && data.networkVo){
                self.investmentPO = data.networkVo.investmentPO
                if(data.networkVo.tbEntAccessNetworkVo){
                    self.tbEntAccessNetworkVo = data.networkVo.tbEntAccessNetworkVo
                }
            }
        })
    },
    openPersonDesFun(item) {
      this.personDes = item
      this.pop.isShowPersonDes = true
    },
    // 关闭弹框
    closePersonDes() {
      this.pop.isShowPersonDes = false
    }
  },
  components: {
    personDesPop
  },
  filters:{
      filterSeparate(num){
          let txt = '-'
          switch (num) {
              case 0:
                  txt = '否'
                  break;
              case 1:
                  txt = '是'
                  break;
          }
          return txt
      },
      filterSex(num){
          let txt = '-'
          switch (num) {
              case 0:
                  txt = '男'
                  break;
              case 1:
                  txt = '女'
                  break;
          }
          return txt
      }
  }
}
</script>
