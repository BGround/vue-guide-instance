<template>
  <div class="qwui-resumeDetail">
    <div class="header">
      <span class="header_font">简历详情</span>
    </div>
    <div class="article">
      <i class="goback" @click="goBack"></i>
      <div class="info_person">
        <div class="info_base">
          <div class="headrow"><span class="name">{{ resumeDataVO.personName?resumeDataVO.personName:"暂无姓名" }}</span>
          <label class="remarkTip">备注：<input type="text" class="remark" @blur="saveRemark" v-model="remark" placeholder="对该简历的备注（修改后不可为空）"></label>
          </div>
          <div class="condition"><i class="icon_person"></i><span>{{ resumeDataVO.topEdu }} / {{ resumeDataVO.workYear }}经验 / {{ resumeDataVO.age }}岁 / {{ resumeDataVO.gender }} / {{ resumeDataVO.addressNow }}</span></div>
          <div class="relation">
            <i class="icon_phone"></i><span>{{ resumeDataVO.mobile }}</span><i></i>
            <i class="icon_email"></i><span>{{ resumeDataVO.email }}</span></div>
        </div>
      </div>
      <div class="split"></div>
      <div class="info_basic">
        <div class="info_title">
          <span class="orange_split"></span>
          <span class="title">基本信息</span>
        </div>
        <div class="info_detail">
          <div class="detail_left">
            <div class="detail_row"><span class="detail_key">最近工作</span>:<span class="detail_value">{{ resumeDataVO.workHistory[0].workTime }}</span></div>
            <div class="detail_row"><span class="detail_key">职位</span>:<span class="detail_value">{{ resumeDataVO.workHistory[0].position }}</span></div>
            <div class="detail_row"><span class="detail_key">公司</span>:<span class="detail_value">{{ resumeDataVO.workHistory[0].companyName }}</span></div>
            <div class="detail_row"><span class="detail_key">性别</span>:<span class="detail_value">{{ resumeDataVO.gender }}</span></div>
          </div>
          <div class="detail_right">
            <div class="detail_row"><span class="detail_key">最高学历</span>:<span class="detail_value">{{ resumeDataVO.topEdu }}</span></div>
            <div class="detail_row"><span class="detail_key">专业</span>:<span class="detail_value">{{ resumeDataVO.eduMajor }}</span></div>
            <div class="detail_row"><span class="detail_key">学校</span>:<span class="detail_value">{{ resumeDataVO.eduHistory[0].college }}</span></div>
            <div class="detail_row"><span class="detail_key">学历/学位</span>:<span class="detail_value">{{ resumeDataVO.topEdu }}</span></div>
          </div>
        </div>
      </div>
      <div class="split" v-if="resumeDataVO.yearSalary"></div>
      <div class="income" v-if="resumeDataVO.yearSalary">
        <div class="info_title">
          <span class="orange_split"></span>
          <span class="title">目前年收入</span>
        </div>
        <div class="myincome">{{ resumeDataVO.yearSalary}}<span>(包含基本工资、补贴、奖金、股权收益等)</span></div>
      </div>
      <div class="split"></div>
      <div class="intension">
        <div class="info_title">
          <span class="orange_split"></span>
          <span class="title">求职意向</span>
        </div>
        <div class="detail">
          <div class="detail_row"><span class="detail_key">关键字</span>:<span class="detail_value">{{  resumeDataVO.objectivePosition }}</span></div>
          <div class="detail_row"><span class="detail_key">期望薪资</span>:<span class="detail_value">{{ resumeDataVO.objectiveSalary }}</span></div>
          <div class="detail_row"><span class="detail_key">地点</span>:<span class="detail_value">{{  resumeDataVO.objectiveWorkPlace }}</span></div>
          <div class="detail_row"><span class="detail_key">职能/职位</span>:<span class="detail_value">{{  resumeDataVO.objectivePosition }}</span></div>
          <div class="detail_row"><span class="detail_key">到岗时间</span>:<span class="detail_value">{{ resumeDataVO.toWorkTime }}</span></div>
          <div class="detail_row"><span class="detail_key">工作类型</span>:<span class="detail_value">{{ resumeDataVO.workType }}</span></div>
          <div class="detail_row"><span class="detail_key">自我评价</span>:<span class="detail_value">{{ resumeDataVO.selfApprise }}</span></div>
        </div>
      </div>
      <div class="split" v-if="resumeDataVO.workHistory"></div>
      <div class="work_experience" v-if="resumeDataVO.workHistory">
        <div class="info_title">
          <span class="orange_split"></span>
          <span class="title">工作经验</span>
        </div>
        <div class="detail_experience" v-for="(item,index) in resumeDataVO.workHistory" :key="index">
          <span class="work_time">{{ item.workPeriod }}</span><span class="company_name">{{ item.companyName }}</span>
          <div  class="company_info">
          <span>{{ item.companyDescription }}</span>
          <span class="department">{{ item.department }}</span>
          </div>
          <div class="description">工作描述:</div>
          <div class="work_description">
            {{ item.description }}
          </div>
        </div>
      </div>
      <div class="split" v-if="resumeDataVO.projectExperience"></div>
      <div class="project_experience" v-if="resumeDataVO.projectExperience">
        <div class="info_title">
          <span class="orange_split"></span>
          <span class="title">项目经验</span>
        </div>
        <div class="detail_experience" v-for="(item,index) in resumeDataVO.projectExperience" :key="index">
          <span class="work_time">{{ item.period }}</span><span>{{ item.name }}</span>
          <div><span class="company_info">所属公司：</span><span class="company_name">{{ item.company }}</span></div>
          <div class="description">项目描述:</div>
          <div class="work_description">
            {{ item.description }}
          </div>
          <div class="description">职责描述:</div>
          <div class="work_description">
            {{ item.responsibility }}
          </div>
        </div>
      </div>
      <div class="split" v-if="resumeDataVO.eduHistory"></div>
      <div class="education_experience" v-if="resumeDataVO.eduHistory">
        <div class="info_title">
          <span class="orange_split"></span>
          <span class="title">教育经历</span>
        </div>
        <div class="detail_education" v-for="(item,index) in resumeDataVO.eduHistory" :key="index">
          <span class="education_time">{{ item.period }}</span><span class="school">{{ item.college }}</span>
           <span class="degree">{{ item.degree }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {getResumeDetail,updateRemark} from '../../api/getData.js';
export default {
    name: 'resumeDetail',
    data(){
      return{
        id:"",
        // 简历详情数据
        resumeDataVO:{
          "eduHistory": [{}], //当值为空时，使页面不报错
          "workHistory": [{}], //当值为空时，使页面不报错
        },
        remark:"", //简历备注
        oldRemark:"",
      }
    },
    created(){
      this._initDetail();
    },
    methods:{
      _initDetail(){
        // 取简历id
        this.id=this.$route.query.id;
        let self=this;
        // 获取简历详情
        getResumeDetail({'resumeId':self.id},data=>{
          self.resumeDataVO=data.resumeData;
          // 简历备注
          self.remark=data.resumeData.recruitRemark;
          self.oldRemark=self.remark;
          // 字典进行查换
          self.resumeDataVO.topEdu=dataBase.topEduBgList[self.resumeDataVO.topEdu];
        })
      },
      saveRemark(){
        let self=this;
        // 备注无修改，退出
        if(this.oldRemark==this.remark) return;
        updateRemark({resumeId:self.id,recruitRemark:self.remark},result=>{
          // 提示成功
          dataBase.top_alert('修改备注成功',true, 1000);
          this.oldRemark=self.remark;
        })
      },
      goBack(){
        window.history.back(-1);
      }
    },

}
</script>

<style lang="scss" scoped>
  .qwui-resumeDetail{
    font-family:MicrosoftYaHei;
  }

  .info_title{
    height:26px;
    font-size:20px;
    color:rgba(51,51,51,1);
    line-height:26px;

    .orange_split{
      display: inline-block;
      width: 4px;
      height: 20px;
      background-color: #C31725;
      vertical-align: middle;
      margin-right: 12px;
    }
  }

  .header{
    height: 56px;
    width: 100%;
    line-height: 56px;
    text-align: center;
    color:rgba(247,139,0,1);
    border-bottom:1px solid rgb(229, 226, 226);
  }

  .header_font{
    display: inline-block;
    height: 56px;
    width: 106px;
    border-bottom:3px solid #C31725;
    font-size:16px;
  }

  .article{
    .goback{
      height: 19px;
      width: 21px;
      display: inline-block;
      background: url(~assets/images/back_icon.png) no-repeat;
      background-size: cover;
      margin:21px 0 46px 0;
      cursor: pointer;
    }

    .info_person{
      display: flex;
      position: relative;
      margin-left: 72px;
      .info_base{

        .headrow{
          line-height: 32px;
          height: 32px;
          vertical-align: middle;
        }

        .name{
          width:72px;
          height:31px;
          font-size:24px;
          color:rgba(51,51,51,1);
          line-height:31px;
        }

        .name:after{
          width: 15px;
          height: 18px;
          display: inline-block;
          content: "";
          border-right-style: solid;
          border-right-color: #999;
          border-right-width: 1px;
        }

        .remarkTip{
           width:448px;
          height:30px;
          font-size:18px;
          color:rgba(51,51,51,1);
          line-height:30px;
          padding-left: 6px;
          margin-left: 15px;
        }

        .remark{
          width:448px;
          height:30px;
          font-size:18px;
          color:rgba(51,51,51,1);
          line-height:30px;
          border: none;
          background-color: #fbfbfb;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .remark:hover{
          border :1px solid #999;
          cursor:text;
          overflow: hidden;
        }

        .condition{
          margin-top: 21px;
          height:19px;
          font-size:14px;
          color:rgba(102,102,102,1);
          line-height:19px;
        }

        .relation{
          margin-top: 20px;
          height:19px;
          font-size:14px;
          color:rgba(102,102,102,1);
          line-height:19px;

          span{
            display: inline-block;
            height: 19px;
          }
        }
      }
    }

    .split{
      border-bottom: 1px dashed rgb(229, 226, 226);
      margin:25px 0;
    }
  }

  .info_basic,.income{
    margin-left: 72px;
  }

  .info_detail{
    display: flex;
    color:#666;
    font-size:14px;
    margin-top: 16px;
  }

    .detail_row{
     line-height: 35px;
      display: flex;
      max-width: 868px;
    }

    .detail_key{
      text-align: justify;
      min-width: 65px;
      text-justify:distribute-all-lines;
      text-align-last:justify;
      margin-right: 10px;
    }

    .detail_value{
      margin-left: 10px;

      span{
        margin-right: 20px;
      }
    }

    .detail_left{
      width: 390px;
      height: 140px;
      margin-right: 37px;
    }

  .myincome{
    color: #333;
    height:35px;
    font-size:16px;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:35px;
    margin-top: 16px;

    span{
      color: #999;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .intension{
    color:#666;
    margin-left: 72px;
    font-size: 14px;
  }

  .work_experience,.project_experience,.education_experience{
    margin-left: 72px;
    color:#333333;
    line-height: 35px;
    font-size: 14px;
    margin-bottom: 25px;
  }

  .detail_experience,.detail{
    margin-top: 16px;
  }

  .company_name{
    font-weight: bold;
  }

  .company_info,.description{
    color:#666;

    span{
      margin-right: 20px;
    }
  }

  .work_time{
    margin-right: 20px;
  }

  .detail_education{
    span{
      margin-right: 20px;
    }

    .school{
      font-weight: bold;
    }
  }

  i{
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 10px;
  }

  .icon_person{
    background: url(~assets/images/resume_person.png) no-repeat center;
    background-size: contain;
  }

  .icon_phone{
    background: url(~assets/images/resunme_phone.png) no-repeat center;
    background-size: contain;
  }

  .icon_email{
    background: url(~assets/images/resume_mail.png) no-repeat center;
    background-size: contain;
  }
</style>
