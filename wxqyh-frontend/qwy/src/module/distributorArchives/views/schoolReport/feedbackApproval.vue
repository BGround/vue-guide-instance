<template>
  <div class="feedbackApprovalWrap">
    <el-button size="small" @click="backHandle">返回</el-button></el-button>
    <el-select v-model="status" placeholder="请选择" size="small" @change="selectHandle">
      <el-option
        v-for="item in approvalStatus"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <table class="mt20">
      <tr>
        <th width="8%">ERP号</th>
        <th width="8%">经销商简称</th>
        <th width="18%">申请修改原因</th>
        <th width="8%">原反馈内容</th>
        <th width="11%">申请日期</th>
        <th width="10%">状态</th>
        <th width="10%">审批人</th>
        <th width="11%">审批时间</th>
        <th width="18%">操作</th>
      </tr>
      <tr v-for="(item,index) in searchData.pageData" :key="index">
        <td>{{item.dealerErpNo}}</td>
        <td>{{item.dealerShortName}}</td>
        <td>{{item.applyUpdateReason}}</td>
        <td><a href="javascript:;" @click="overlookHandle(item.projectVOList)" class="overlook" >查看</a></td>
        <td>{{item.applyTime}}</td>
        <td>{{transferStatus(item.status)}}</td>
        <td>{{item.approvalUser || '-'}}</td>
        <td>{{item.approvalTime || '-'}}</td>
        <td>
          <el-button type="text" :disabled="item.times!==0" @click="passHandle(index,1)">审批通过</el-button>
          <el-button type="text" :disabled="item.times!==0" :style="`color: ${item.times!==0? '#c0c4cc': '#cb1632'}`" @click="passHandle(index,-1);">审批不通过</el-button>
        </td>
      </tr>
      <tr v-if="searchData.pageData && searchData.pageData.length===0"><td colspan="7">暂无数据</td></tr>
    </table>
    <el-dialog :visible.sync="dialogFormVisible" center width="35%" height="600px">
      <p class="formTitle">经销商反馈</p>
      <div v-for="(form, index) in formList" :key="index">
        <el-form>
          <el-form-item :label="`项目${formList>1? index+1: ''}`">
            <el-input v-model="form.projectName || '暂无'" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="form.projectLeader || '暂无'" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="完成时间">
            <el-input v-model="form.finishedTime || '暂无'" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="参会人">
            <el-input v-model="form.attendee || '暂无'" autocomplete="off" readonly></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <div class="images">
              <div class="project-image" v-for="(item, index) in getImages(form.projectImage)">
                <img v-if="item" :src="item" alt="">
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="gutter"></div>
      </div>

      <div slot="footer" class="dialog-footer">
        <button type="button" @click="dialogFormVisible = false" class="btn orangeBtn" style="width: 100px;">关 闭</button>
      </div>
    </el-dialog>
    <div class="pageWrap">
      <page :pageData='pageSetting'
        @change='pageChange'></page>
    </div>
  </div>
</template>
<script>
import {searchFeedBackList,updateFeedBackByStatus} from '@/module/distributorArchives/api/getData'
import page from '@/components/list/page'
const IMAGE_PATH_SEPARATOR = '##'; //多张图片，用##分割
//如果times字段是0的话就是还没审批，如果是1的话就已经审批过了
export default {
  data() {
    return {
      id: '',
      dialogFormVisible: false,
      status:'',
      pageSetting: { page: 1, pageSize: 10, maxPage: 0, totalRows: 0 },
      formList: {
        projectName: '',
        projectLeader: '',
        finishedTime: '',
        attendee: '',
      },
      formLabelWidth: '80px',
      approvalStatus: [
        {
          value: '',
          label: '审批状态'
        },{
          value: 0,
          label: '待审批'
        }, {
          value: 1,
          label: '审批通过',
        }, {
          value: -1,
          label: '审批未通过'
        }
      ],
      searchData: {
        currentPage: 1,
        pageData:[],
        totalRows: 0,
        totalPages: 1
      }
    }
  },
  created() {
    this.init()
  },
  methods:{
    init(){
      let params = {
        status:this.status,
        page: this.pageSetting.page,
        pageSize: this.pageSetting.pageSize
      }
      searchFeedBackList(params).then(data => {
        if(data){
          this.searchData = data
          this.pageSetting.maxPage = data.totalPages
          this.pageSetting.totalRows = data.totalRows
        }
      })
    },
    transferStatus(status){ //状态转义
      switch (status) {
        case 0:
          return '待审批'
        case 1:
          return '审批通过'
        case -1:
          return '审批未通过'
        default:
          break;
      }
    },
    passHandle(index, status){ //审批是否通过
      const item = this.searchData.pageData[index];
      let params = {
        id:item.id,
        status
      }
      updateFeedBackByStatus(params,data => {
        this.$message({
          message: '操作成功',
          type: 'success'
        });
      if(status == 1) {
          this.searchData.pageData[index].status = 1
          this.searchData.pageData[index].times = 1;
      }else{
          this.searchData.pageData[index].status = -1
          this.searchData.pageData[index].times = 1;
      }
    })
    },
    overlookHandle(list){ //查看
      this.dialogFormVisible = true;
      this.formList = list || [];
    },
    selectHandle(){ //选择
      this.pageSetting.page = 1
      this.init()
    },
    backHandle(){ //返回
      this.$router.back(-1)
    },
    // 分页
    pageChange() {
        this.init()
    },

    getImages(paths){
        if(paths){
            const urls = paths.split(IMAGE_PATH_SEPARATOR).filter(path=>!!path).map(path=> _.fileDownURL +path)

            return urls
        }
        return []
    }
  },
  components:{
    page,
  }
}
</script>

<style lang="less" scoped>
@import url('./css/index.less');
table {
  th{
    padding: 10px 0;
    background-color: transparent;
  }
  td{
  padding: 0;
}
}
.formTitle{
  font-size: 18px;
  color: rgb(52, 60, 68);
  font-weight: 600;
  position: relative;
  margin-bottom: 20px;
  padding-left: 10px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 4px;
    height: 15px;
    background: #c9112e;
  }
}
.overlook{
  padding: 0 3px;
  &:hover{
    color: #cb1632;
    border-bottom: solid 1px #cb1632;
  }
}
& /deep/ {
  .el-button--mini{
    font-size: 13px;
  }
  .el-dialog__footer{
    padding: 10px 20px 25px;
  }
  .el-dialog--center .el-dialog__body{
    padding: 25px 25px 0;
  }
  .el-dialog__header{
    display: none;
  }
  .el-form-item{
    margin-bottom: 8px;
    .el-form-item__label{
      line-height: 26px;
    }
  }

  .el-dialog__body {
    max-height: 360px;
    overflow-y: auto;
  }

  .gutter{
    height: 20px;
  }

  .project-image{
    margin-right: 10px;
    img{
      width: 60px;
      height: 60px;
      object-fit: cover;
    }
  }
  .images{
    height: auto;
    clear: both;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
