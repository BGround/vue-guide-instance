<template>
  <div>
<!--    <ul class="preSaleAfterSaleWrap">-->
<!--      <li>-->
<!--        <dl class="pitem">-->
<!--          <dt>配备率</dt>-->
<!--&lt;!&ndash;          <dd class="pborder">应配备人数：{{personRate.allocation}}</dd>&ndash;&gt;-->
<!--          <dd>实际人数：{{personRate.realPeople}}</dd>-->
<!--        </dl>-->
<!--        <div class="pitem">-->
<!--          <dashboard :columns="chart.rateData"></dashboard>-->
<!--          <div class="markChart"><i class="square"></i>实际人数</div>-->
<!--        </div>-->
<!--      </li>-->
<!--      <li>-->
<!--        <dl class="pitem">-->
<!--          <dt>认证率</dt>-->
<!--          <dd class="pborder">应配备人数：80</dd>-->
<!--          <dd>实际人数：76</dd>-->
<!--        </dl>-->
<!--        <div class="pitem">-->
<!--          <dashboard :chartId="chart.authChartId"-->
<!--            :columns="chart.rzRateData"></dashboard>-->
<!--          <div class="markChart"><i class="square"></i>认证人数</div>-->
<!--        </div>-->
<!--      </li>-->
<!--      <li>-->
<!--        <dl class="pitem">-->
<!--          <dt>流失率</dt>-->
<!--          <dd class="pborder">应配备人数：{{personRate.allocation}}</dd>-->
<!--          <dd>流失人数：{{personRate.realPeople}}</dd>-->
<!--        </dl>-->
<!--        <div class="pitem">-->
<!--          <dashboard :chartId="chart.lossRate"-->
<!--            :columns="chart.loseRateData"></dashboard>-->
<!--          <div class="markChart"><i class="square"></i>在职人数</div>-->
<!--        </div>-->
<!--      </li>-->
<!--    </ul>-->

<!--    <div class="subTit">-->
<!--      <p>· 关键岗位</p>-->
<!--    </div>-->
<!--    <table>-->
<!--      <tr>-->
<!--        <th>岗位</th>-->
<!--        <th>应配备人数</th>-->
<!--        <th>实际人数</th>-->
<!--        <th>配备率</th>-->
<!--        <th>认证人数</th>-->
<!--      </tr>-->
<!--      <tr v-for="(item,index) in keyData"-->
<!--        :key="index">-->
<!--        <td>{{item.post}}</td>-->
<!--        <td>{{item.allocation}}</td>-->
<!--        <td>{{item.realPeople}}</td>-->
<!--        <td>{{item.approRate}}%</td>-->
<!--        <td>{{item.approPeople}}</td>-->
<!--      </tr>-->
<!--      <tr v-if="keyData && keyData.length===0">-->
<!--        <td colspan="5">暂无数据</td>-->
<!--      </tr>-->
<!--    </table>-->

<!--    <div class="subTit">-->
<!--      <p>· 业务岗位</p>-->
<!--    </div>-->
<!--    <table>-->
<!--      <tr>-->
<!--        <th>岗位</th>-->
<!--        <th>应配备人数</th>-->
<!--        <th>实际人数</th>-->
<!--        <th>配备率</th>-->
<!--        <th>认证人数</th>-->
<!--      </tr>-->
<!--      <tr v-for="(item,index) in businessData"-->
<!--        :key="index">-->
<!--        <td>{{item.post}}</td>-->
<!--        <td>{{item.allocation}}</td>-->
<!--        <td>{{item.realPeople}}</td>-->
<!--        <td>{{item.approRate}}%</td>-->
<!--        <td>{{item.approPeople}}</td>-->
<!--      </tr>-->
<!--      <tr v-if="businessData && businessData.length===0">-->
<!--        <td colspan="5">暂无数据</td>-->
<!--      </tr>-->
<!--    </table>-->

<!--    <div class="subTit">-->
<!--      <p>· 认证岗位</p>-->
<!--    </div>-->
<!--    <table>-->
<!--      <tr>-->
<!--        <th>岗位</th>-->
<!--        <th>应配备人数</th>-->
<!--        <th>实际人数</th>-->
<!--        <th>配备率</th>-->
<!--        <th>认证人数</th>-->
<!--      </tr>-->
<!--      <tr v-for="(item,index) in authData"-->
<!--        :key="index">-->
<!--        <td>{{item.post}}</td>-->
<!--        <td>{{item.allocation}}</td>-->
<!--        <td>{{item.realPeople}}</td>-->
<!--        <td>{{item.approRate}}%</td>-->
<!--        <td>{{item.approPeople}}</td>-->
<!--      </tr>-->
<!--      <tr v-if="authData && authData.length===0">-->
<!--        <td colspan="5">暂无数据</td>-->
<!--      </tr>-->
<!--    </table>-->

<!--    <div class="subTit">-->
<!--      <p>· 1.5网人员</p>-->
<!--    </div>-->
<!--    <table>-->
<!--      <tr>-->
<!--        <th>岗位</th>-->
<!--        <th>应配备人数</th>-->
<!--        <th>实际人数</th>-->
<!--        <th>配备率</th>-->
<!--        <th>认证人数</th>-->
<!--      </tr>-->
<!--      <tr v-for="(item,index) in netData"-->
<!--        :key="index">-->
<!--        <td>{{item.post}}</td>-->
<!--        <td>{{item.allocation}}</td>-->
<!--        <td>{{item.realPeople}}</td>-->
<!--        <td>{{item.approRate}}%</td>-->
<!--        <td>{{item.approPeople}}</td>-->
<!--      </tr>-->
<!--      <tr v-if="netData && netData.length===0">-->
<!--        <td colspan="5">暂无数据</td>-->
<!--      </tr>-->
<!--    </table>-->

<!--    <div class="subTit">-->
<!--      <p>· 在职人员信息</p>-->
<!--    </div>-->
<!--    <table>-->
<!--      <tr>-->
<!--        <th>岗位</th>-->
<!--        <th>姓名</th>-->
<!--        <th>性别</th>-->
<!--        <th>电话</th>-->
<!--        <th>邮箱</th>-->
<!--        <th>婚姻状况</th>-->
<!--        <th>学历</th>-->
<!--      </tr>-->
<!--      <tr v-for="(item,index) in personInfoList"-->
<!--        :key="index">-->
<!--        <td>{{item.position}}</td>-->
<!--        <td><a href="javascript:;"-->
<!--            @click="openPersonDes('normal',item.id)">{{item.personName}}</a></td>-->
<!--        <td>{{item.sex===1?item.sex="男":item.sex="女"}}</td>-->
<!--        <td>{{item.mobile}}</td>-->
<!--        <td>{{item.email}}</td>-->
<!--        <td>{{item.maritalStatus===1?item.maritalStatus="已婚":item.maritalStatus="未婚"}}</td>-->
<!--        <td>{{item.educationBackground}}</td>-->
<!--      </tr>-->
<!--      <tr v-if="personInfoList && personInfoList.length===0"><td colspan="7">暂无数据</td></tr>-->
<!--    </table>-->

<!--    <div class="subTit">-->
<!--      <p>· 人员变更记录</p>-->
<!--    </div>-->
<!--    <table>-->
<!--      <tr>-->
<!--        <th>变更类别</th>-->
<!--        <th>变更时间</th>-->
<!--        <th>审批时间</th>-->
<!--        <th>变更前岗位</th>-->
<!--        <th>变更后岗位</th>-->
<!--        <th>变更原因</th>-->
<!--        <th>姓名</th>-->
<!--        <th>性别</th>-->
<!--        <th>入职时间</th>-->
<!--        <th>认证级别</th>-->
<!--      </tr>-->
<!--      <tr v-for="(item,index) in personChangeData" :key="index">-->
<!--        <td>{{item.type}}</td>-->
<!--        <td>{{item.time}}</td>-->
<!--        <td>{{item.auditTime}}</td>-->
<!--        <td>{{item.beforePost}}</td>-->
<!--        <td>{{item.afterPost}}</td>-->
<!--        <td>{{item.reason}}</td>-->
<!--        <td><a href="javascript:;"-->
<!--            @click="openPersonDes('change',item.id)">{{item.name}}</a></td>-->
<!--        <td>{{item.sex}}</td>-->
<!--        <td>{{item.enterTime}}</td>-->
<!--        <td>{{item.level}}</td>-->
<!--      </tr>-->
<!--      <tr v-if="personChangeData && personChangeData.length===0"><td colspan="10">暂无数据</td></tr>-->
<!--    </table>-->

    <!-- 人员详情弹框 -->
    <incumbentsPop v-if="pop.isPersonDesShow"
      @closePersonDes="closePersonDes"
      :personInfoDeatilData="personInfoDeatilData"
      :type="pop.personType"></incumbentsPop>
  </div>
</template>

<script>
import dashboard from './dashboard'
import incumbentsPop from './incumbentsPop'
import {
  // ajaxPersoninfoAction,
  ajaxGetPersonRate,
  ajaxGetPersonInfoList,ajaxGetPersonChange,
  ajaxGetPersonInfoDetail,ajaxGetPersonChangeInfo
} from '../../../../api/getData'

export default {
  data() {
    return {
      erpId:'',
      keyData: [],
      businessData: [],
      authData: [],
      netData: [],
      chart: {
        authChartId: 'authChartId',
        lossRate: 'lossRate',
        rateData: [],
        rzRateData: [{ value: 76.5, name: '认证率' }],
        loseRateData: [{ value: 45.6, name: '流失率' }]
      },
      pop: {
        isPersonDesShow: false,
        personType: 'change'
      },
      personRate: {realPeople:0},
      form: {
        personInfoVo: {
          businessType: 1, // 业务类型：售前1，售后2 businessTypeName  businessTypeEnum  business_type
          postType: 1, // 岗位类型：关键岗位1、业务岗位2、认证岗位3、1.5网人员4
          deptId: ''
        }
      },
      personInfoList: [], //在职人员信息列表
      personChangeData:[], // 变更人员信息
      personInfoDeatilData: [] // 在职人员详细信息
    }
  },
  props:['type','dealerId'],
  created() {
    this.init()
  },
  methods: {
    init() {
      this.erpId = this.$route.query.erpId
      setTimeout(() => {
        this.form.personInfoVo.businessType = this.type
        this.form.personInfoVo.deptId = this.dealerId
        // this.getKeyPersonInfo()
        // this.getBusinessPersonInfo()
        // this.getAuthPersonInfo()
        // this.getNetPersonInfo()
        // this.getPersonRate()
        // this.getzzPersonInfo()
        this.getPersonChange()
      }, 200)
    },
    // 打开人员详情弹框
    openPersonDes(type, id) {
      if (type) {
        this.pop.personType = type
      }
      if(type === 'normal'){
        this.getzzPersonInfoDeatil(id)
      } else if(type === ''){
        this.getPersonChangeInfo(id)
      }
      this.pop.isPersonDesShow = true
    },
    // 关闭人员详情弹框
    closePersonDes() {
      this.pop.isPersonDesShow = false
    },
    // 获取变更人员
    getPersonChange(){
        let params = {
            dealerId: this.dealerId,
        }
        ajaxGetPersonChange(params, data => {
            if (data && data.personChangeList) {
                this.personChangeData = data.personChangeList
            }
        })
    },
    // 获取变更人员详情
    getPersonChangeInfo(id){
      let params = {
        userId: id
      }
      ajaxGetPersonChangeInfo(params, data => {
          if (data && data.userInfo) {
              this.personInfoDeatilData = data.userInfo
          }
      })
    },
    // 获取配备率
    getPersonRate() {
      let params = {
        deptId: this.erpId,
        btype: this.type // 售前1，售后2
      }
      ajaxGetPersonRate(params, data => {
        if (data) {
          this.personRate = data
          this.chart.rateData = [{ value: data.rate, name: '配备率' }]
        }
      })
    },
    // 获取关键岗位
    getKeyPersonInfo() {
      let params = JSON.parse(JSON.stringify(this.form))
      params.personInfoVo.postType = 1
      ajaxPersoninfoAction(params, data => {
        this.keyData = data.pageData
      })
    },
    // 获取业务岗位
    getBusinessPersonInfo() {
      let params = JSON.parse(JSON.stringify(this.form))
      params.personInfoVo.postType = 2
      ajaxPersoninfoAction(params, data => {
        this.businessData = data.pageData
      })
    },
    // 认证岗位
    getAuthPersonInfo() {
      let params = JSON.parse(JSON.stringify(this.form))
      params.personInfoVo.postType = 3
      ajaxPersoninfoAction(params, data => {
        this.authData = data.pageData
      })
    },
    // 1.5网人员
    getNetPersonInfo() {
      let params = JSON.parse(JSON.stringify(this.form))
      params.personInfoVo.postType = 4
      ajaxPersoninfoAction(params, data => {
        this.netData = data.pageData
      })
    },
    // 获取在职人员信息
    getzzPersonInfo() {
      let params = {
        erpNo: this.dealerId
      }
      ajaxGetPersonInfoList(params, data => {
        this.personInfoList = data.personInfo
      })
    },
    // 获取在职人员详细信息
    getzzPersonInfoDeatil(id) {
      let params = {
        id: id
      }
      ajaxGetPersonInfoDetail(params, data => {
        this.personInfoDeatilData = data.po
      })
    }
  },
  components: {
    dashboard,
    incumbentsPop
  }
}
</script>
