<template>
  <div class="incumbentsPopWrap">
    <div class="mask"></div>
    <div class="personPopInfo">
      <div class="scrollWrap">
        <div class="titWrap mb10">
          <h4>在职人员信息</h4>
        </div>

        <div class="itembasicDes">
          <ul v-if="type==='normal'">
            <li class="first">
              <div class="bLabel">姓名</div>
              <div class="bValue">{{personInfoDeatilData.personName || '-'}}</div>
            </li>
            <li>F
              <div class="bLabel">性别</div>
              <div class="bValue">{{personInfoDeatilData.sexDesc || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">联系电话</div>
              <div class="bValue">{{personInfoDeatilData.mobile || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">邮箱</div>
              <div class="bValue">{{personInfoDeatilData.email || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">微信号</div>
              <div class="bValue">{{personInfoDeatilData.weixinNum || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">身份证号</div>
              <div class="bValue">{{personInfoDeatilData.identity || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">出生日期</div>
              <div class="bValue">{{personInfoDeatilData.birthday || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">婚姻状况</div>
              <div class="bValue">{{personInfoDeatilData.maritalStatus==='1'?personInfoDeatilData.maritalStatus='已婚':personInfoDeatilData.maritalStatus='未婚'}}</div>
            </li>
            <li>
              <div class="bLabel">学历</div>
              <div class="bValue">{{personInfoDeatilData.educationBackground || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">学历证明</div>
              <div class="bValue"><a href="javascript:;">查看</a></div>
            </li>
            <li>
              <div class="bLabel">专业</div>
              <div class="bValue">{{personInfoDeatilData.professional || '-'}}</div>
            </li>
            <!-- <li>
              <div class="bLabel">是否参与奇瑞岗位培训</div>
              <div class="bValue">是</div>
            </li> -->
            <li>
              <div class="bLabel">获得荣誉</div>
              <div class="bValue">
                {{personInfoDeatilData.honor || '-'}}
                <!-- <p>2009年芜湖安奇最佳总经理</p>
                <p>2007年苏州申田最佳销售</p> -->
              </div>
            </li>
            <li>
              <div class="bLabel">岗位</div>
              <div class="bValue">{{personInfoDeatilData.position || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">上岗时间</div>
              <div class="bValue">{{personInfoDeatilData.workTime || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">奇瑞体系入职时间</div>
              <div class="bValue">{{personInfoDeatilData.entryDate || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">培训次数</div>
              <div class="bValue">{{personInfoDeatilData.trainingTimes || '-'}}</div>
            </li>
            <li class="last">
              <div class="bLabel">培训课程</div>
              <div class="bValue">
                <p>{{personInfoDeatilData.myCourse && personInfoDeatilData.myCourse.length>0?personInfoDeatilData.myCourse.join('；'):'-'}}</p>
                <!-- {{personInfoDeatilData.trainingCourse || '-'}} -->
                <!-- <p>2007年第七期T17新产品上市技术总监培训班</p>
                <p>2017年第一期重点十省瑞虎5X区域提升培训</p> -->
              </div>
            </li>
          </ul>
          <ul v-if="type==='change'">
            <li class="first">
              <div class="bLabel">姓名</div>
              <div class="bValue">{{personInfoDeatilData.person_name || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">岗位</div>
              <div class="bValue">{{personInfoDeatilData.position || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">变更类型</div>
              <div class="bValue">{{personInfoDeatilData.type || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">离职原因</div>
              <div class="bValue">{{(personInfoDeatilData.type ==='调岗' || !personInfoDeatilData.reason)?  '-' : personInfoDeatilData.reason}}</div>
            </li>
            <li>
              <div class="bLabel">变更时间</div>
              <div class="bValue">{{personInfoDeatilData.time || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">审批时间</div>
              <div class="bValue">{{personInfoDeatilData.auditTime || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">变更前岗位</div>
              <div class="bValue">{{personInfoDeatilData.beforePost || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">变更后岗位</div>
              <div class="bValue">{{personInfoDeatilData.afterPost || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">变更原因</div>
              <div class="bValue">{{ (personInfoDeatilData.type==='离职' ||!personInfoDeatilData.reason)? '-': personInfoDeatilData.reason}}</div>
            </li>
            <li>
              <div class="bLabel">性别</div>
              <div class="bValue">{{personInfoDeatilData.sex || '-'}}</div>
            </li>
            <!-- <li>
              <div class="bLabel">年龄</div>
              <div class="bValue">{{personInfoDeatilData.sexDesc}}</div>
            </li> -->
            <li>
              <div class="bLabel">联系电话</div>
              <div class="bValue">{{personInfoDeatilData.phone || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">邮箱</div>
              <div class="bValue">{{personInfoDeatilData.EMAIL || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">微信号</div>
              <div class="bValue">{{personInfoDeatilData.weixinNum || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">身份证号</div>
              <div class="bValue">{{personInfoDeatilData.identity || '-'}}</div>
            </li>

            <!-- <li>
              <div class="bLabel">身份证扫描件</div>
              <div class="bValue"><a href="javascript:;">查看</a></div>
            </li> -->
            <li>
              <div class="bLabel">出生日期</div>
              <div class="bValue">{{personInfoDeatilData.birthday || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">婚姻状况</div>
              <div class="bValue">{{personInfoDeatilData.maritalStatus || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">学历</div>
              <div class="bValue">{{personInfoDeatilData.educationBackground || '-'}}</div>
            </li>
            <!-- <li>
              <div class="bLabel">学历证明</div>
              <div class="bValue"><a href="javascript:;">查看</a></div>
            </li> -->
            <li>
              <div class="bLabel">专业</div>
              <div class="bValue">{{personInfoDeatilData.professional || '-'}}</div>
            </li>
             <li>
              <div class="bLabel">是否参与奇瑞岗位培训</div>
              <div class="bValue">{{personInfoDeatilData.isTraining || '-'}}</div>
            </li>
            <!-- <li>
              <div class="bLabel">面试时间</div>
              <div class="bValue">2019年1月1日</div>
            </li>
            <li>
              <div class="bLabel">面试得分（理论）</div>
              <div class="bValue">88</div>
            </li>
            <li>
              <div class="bLabel">面试得分（实操）</div>
              <div class="bValue">85</div>
            </li> -->
            <li>
              <div class="bLabel">获得荣誉</div>
              <div class="bValue">
                {{personInfoDeatilData.honor || '-'}}
              </div>
            </li>

            <li>
              <div class="bLabel">上岗时间</div>
              <div class="bValue">{{personInfoDeatilData.enterTime || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">奇瑞体系入职时间</div>
              <div class="bValue">{{personInfoDeatilData.enterDate || '-'}}</div>
            </li>
            <li>
              <div class="bLabel">培训次数</div>
              <div class="bValue">{{(personInfoDeatilData.trainingTimes === 0 || personInfoDeatilData.trainingTimes )? personInfoDeatilData.trainingTimes :'-'  }}</div>
            </li>
            <li class="last">
              <div class="bLabel">培训课程</div>
              <div class="bValue">
                <p>{{personInfoDeatilData.trainingCourse? personInfoDeatilData.trainingCourse :'-'}}</p>
                <!-- <p>2017年第一期重点十省瑞虎5X区域提升培训</p> -->
              </div>
            </li>
          </ul>
          <!-- <div class="bValue">
            <ul>
              <li>周锐</li>
              <li>男</li>
              <li>137786548765</li>
              <li>zhourui@outlook.com</li>
              <li>zhourui</li>
              <li>439876356278765378</li>
              <li>1990-07-24</li>
              <li>已婚</li>
              <li>大专</li>
              <li><a href="javascript:;">查看</a></li>
              <li>工商管理</li>
              <li>是</li>
              <li>
                <p>2009年芜湖安奇最佳总经理</p>
                <p>2007年苏州申田最佳销售</p>
              </li>
              <li>总经理</li>
              <li>2008年1月</li>
              <li>2008年10月21日</li>
              <li>2</li>
              <li>
                <p>2007年第七期T17新产品上市技术总监培训班</p>
                <p>2017年第一期重点十省瑞虎5X区域提升培训</p>
              </li>
            </ul>
          </div> -->

          <div v-if="type==='change'" class="headWrap"><img :src="personInfoDeatilData.headPic" /></div>
          <div v-else class="headWrap"><img :src="personInfoDeatilData.headPic" /></div>
        </div>
      </div>
      <div class="closeBtn">
        <qwuiButton type="danger"
          @click="closePersonDes">关闭</qwuiButton>
      </div>
    </div>
  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
export default {
  data() {
    return {}
  },
  props: ['type', 'personInfoDeatilData'],
  methods: {
    closePersonDes() {
      this.$emit('closePersonDes', '')
    }
  },
  watch: {
    personInfoDeatilData(val, oldval) {
        console.log(val)
      this.personInfoDeatilData = val
    }
  },
  components: {
    qwuiButton
  }
}
</script>

<style lang="less" scoped>
// .incumbentsPopWrap .personPopWrap .personPopInfo .basicDes .bLabel {
//   width: 160px;
// }
</style>
