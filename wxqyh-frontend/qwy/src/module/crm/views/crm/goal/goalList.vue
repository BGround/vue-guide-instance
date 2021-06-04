<template>
    <div class="mt20">
        <div class="top_bar">
            <div class="lef_bar">
                <div class="btn orangeBtn" v-perm="'goalEdit'" @click="addGoal">新增</div>
                <!-- <span class="borderLine"></span>
                <div class="btn">导出</div> -->
                <span class="borderLine" v-if="showDel" v-perm="'goalDel'"></span>
                <div class="btn" v-if="showDel" v-perm="'goalDel'" @click="delGoal">删除</div>
            </div>
            <div class="right_bar">
                <select class="commonSelect mr10" v-model="goalType" @change="loadData">
                    <option value="">所有目标类型</option>
                    <option value="0">商机赢单金额</option>
                    <option value="1">合同签约金额</option>
                </select>
                <select class="commonSelect mr10" v-model="teamId" @change="loadData">
                    <option value="">所有销售团队</option>
                    <option :value="item.id" v-for="(item, idx) in teamList" :key="idx">{{item.teamName}}</option>
                </select>
                <search-input inputTips="目标名称" @searchData="searchData" @inputChange="inputChange"></search-input>
            </div>
        </div>
        <div class="mt20" v-perm="'goalDetail'">
            <data-table :headData="headData" :dataList="dataList"></data-table>
            <page :pageData="pageSetting" @change="pageChage"></page>
        </div>
    </div>
</template>
<script>
import searchInput from "@/components/list/search/searchInput";
import dataTable from "@/components/list/dataTable";
import page from '@/components/list/page';
import { getTeamList, searchGoal, delGoal } from "@/module/crm/api/goal";
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {
      dataBase,
      teamList: [],  // 销售团队列表
      goalType: '',  //目标类型 0：商机 1：合同
      teamId: '',  // 选中的销售团队id
      searchTitle: '',  // 输入框内容
      page: 1,  // 页码,
      pageSize: 10,  // 数据条数
      pageSetting: {},  // 页码设置
      sortType: 0,  // 排序类型 默认0:时间 1:年目标降序 2:年目标升序 3完成金额降序 4完成金额升序
      ids: '',  // 被选中的id
      showDel: false,  //是否显示删除按钮
      headData: {   //  页表数据头
        left: {
          checkFunc:(checkAll,checkList) => {
            let arr = [];
            let checkNum = 0;
            checkList.map(item => {
                item.isChecked? arr.push(item.id) : checkNum++;

            });
            this.ids = arr.join(',');
            this.showDel = checkNum == checkList.length?  false : true;
          }
        },
        middle: [
          {
            title: "目标名称",
            key: "goalName",
            width: 150,
            skip: {
              skipFunc:(id) => {
                this.$router.push({
                  path: '/crm/goal/detail',
                  query: {
                    id
                  }
                })
              }
            }
          },
          {
            title: "销售团队",
            key: "teamName",
            width: 90
          },
          {
            title: "目标类型",
            key: "goalTypeName",
            width: 80
          },
          {
            title: "团队负责人",
            key: "teamInCharge",
            width: 85
          },
          {
            title: "年目标(万元)",
            key: "goalAmount",
            width: 100,
            textAlign: 'right',
            sort: {
              sortFunc: (idx) => {
                this.headData.middle.map((item, idx) => {
                  if(item.sort){
                    item.sort.sortStyle = 'sort_down';
                  }
                });

                // 根据sortType改变箭头

                if(this.sortType == 2){
                  this.sortType = 1;
                  this.headData.middle[idx].sort.sortStyle = 'sort_down_on';
                }
                else{
                  this.sortType = 2;
                  this.headData.middle[idx].sort.sortStyle = 'sort_up_on';
                }
                this.loadData();

              },
              sortStyle: 'sort_down'
            }
          },
          {
            title: "完成金额(万元)",
            key: "finishedAmount",
            width: 110,
            textAlign: 'right',
            sort: {
              sortFunc: (idx) => {
                this.headData.middle.map((item, idx) => {
                  if(item.sort){
                    item.sort.sortStyle = 'sort_down';
                  }
                });

                // 根据sortType改变箭头

                if(this.sortType == 4){
                  this.sortType = 3;
                  this.headData.middle[idx].sort.sortStyle = 'sort_down_on';
                }
                else{
                  this.sortType = 4;
                  this.headData.middle[idx].sort.sortStyle = 'sort_up_on';
                }
                this.loadData();

              },
              sortStyle: 'sort_down'
            }
          },
          {
            title: "完成度",
            key: "completionRate",
            width: 65
          },
          {
            title: "对应年份",
            key: "goalYear",
            width: 65
          },
          {
            title: "团队人数",
            key: "teamMemberNum",
            width: 65
          }
        ],
        right: {
          isShowOperate: false
        }
      },
      dataList:[]  // 表格数据
    };
  },
  components: {
    searchInput,
    dataTable,
    page
  },
  computed: {
    ...mapGetters('goal',[
      'goalBoxOperate'
    ]),
    ...mapGetters('header',[
      'permission'
    ])
  },
  watch: {
    goalBoxOperate: function(newVal, oldVal){
        if(newVal === 'save'){
          this.page = 1;
          this.loadData();
        }
    }
  },
  methods: {
    ...mapActions('goal',[
        'setshowGoalBox',
        'setGoalBoxTitel',
        'setGoalBoxType',
        'setGoalBoxOperate'
    ]),

    // 搜索框回调函数
    searchData() {
        this.loadData();
    },

    // 搜索框输入内容改变回调函数
    inputChange(title){
      this.searchTitle = title;
    },

    // 新增目标
    addGoal() {
        this.setGoalBoxTitel('新增目标');
        this.setGoalBoxType('add');
        this.setshowGoalBox(true);
        this.setGoalBoxOperate('open');
        document.body.style.overflow = 'hidden';
    },

    // 查询数据
    loadData(){
      let obj = {
        goalName: this.searchTitle,
        goalType: this.goalType,
        teamId: this.teamId,
        sortType: this.sortType,
        page: this.page,
        pageSize: this.pageSize
      }
      let { alert:_alert } = this.dataBase;

      searchGoal(obj)
      .then(res => {
        if(res.code == '0'){
          let list = res.data.pageData;
          let { maxPage, totalRows } = res.data;

          this.dataList = list? res.data.pageData : [];
          this.pageSetting = {
            maxPage,
            totalRows,
            page: this.page,
            pageSize: this.pageSize
          }
          this.showDel = false;
        }
        else{
          _alert('提示',res.desc);
        }
      })
      .catch(err => {
        _alert('提示','网络错误');
      });
    },

    // 页码组件回调函数
    pageChage(page,pageSize){
      this.page = page;
      this.pageSize = pageSize || 10;
      this.loadData();
    },

    // 删除目标
    delGoal(){
      let { alert:_alert, top_alert } = this.dataBase;
      if(!this.ids){
        _alert('提示','请选择要删除的数据');
        return;
      }
      else{
        _alert('提示','确认删除该目标?',
          () => {
              let obj = {
                ids: this.ids
              }
              delGoal(obj)
              .then(res => {
                if(res.code == '0'){
                  top_alert('删除成功',true,1000);
                  this.loadData();
                }
                else{
                  _alert('提示',res.desc);
                }
              })
              .catch(err => {
                  _alert('提示','网络错误');
              });
            },'确定',true
        );
      }
    }
  },
  created() {
    let { alert:_alert } = this.dataBase;
    getTeamList()
    .then(res => {
      if(res.code == '0'){
        this.teamList = res.data.teamList;
        this.loadData();
      }
      else{
        _alert('提示',res.desc);
      }
    })
    .catch(err => {
      _alert('提示','网络错误');
    });
  },
  beforeRouteEnter(to, from, next){
    next(vm => {
      if(!vm.permission['goalDetail']){
          vm.$router.replace('/');
      }
    })
  }
};
</script>
<style scoped>
.mt20 {
  margin-top: 20px;
}
.mr10 {
  margin-right: 10px;
}
.top_bar {
  display: flex;
  justify-content: space-between;
}
.top_bar .btn {
  border: 1px solid #ccc;
}
.top_bar .orangeBtn {
  border: 1px solid #f87b00;
}
.top_bar .orangeBtn:hover {
  background: #fea411;
}
.borderLine {
  margin: 0 8px 0 5px;
  border-right: 1px dashed #cfcfcf;
}
.right_bar {
  display: flex;
}
</style>


