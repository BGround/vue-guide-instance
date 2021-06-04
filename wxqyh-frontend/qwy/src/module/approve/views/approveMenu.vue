<template>
  <div>
      <div class="main_wrap">
          <div class="container">
              <div class="left_side">
                   <ul class="side_menun">
                      <li
                        v-perm="'formMenu'"
                        :class="{active:activeArr[0]}"
                        @click="goDetail('form')"
                        v-if="trustApp['form'] && trustApp['form']['isTrust']">表单流程</li>
                      <li
                        v-perm="'formTemplateSetU'"
                        :class="{active:activeArr[1]}"
                        @click="goDetail('flow_temp')">表单模板中心</li>
                     <div
                       class="line-group"
                       v-perm="'formMenu' || 'formTemplateSetU'"></div>
                     <li
                       v-perm="'askMenu'"
                       :class="{active:activeArr[2]}"
                       @click="goDetail('ask')"
                       v-if="trustApp['ask'] && trustApp['ask']['isTrust']">请假申请</li>
                     <li
                       v-perm="'caraskList'"
                       :class="{active:activeArr[3]}"
                       @click="goDetail('car')"
                      v-if="trustApp['car'] && trustApp['car']['isTrust']">车辆管理</li>
                     <li
                       v-perm="'reimbursementList'"
                       :class="{active:activeArr[4]}"
                       @click="goDetail('reimbursement')"
                        v-if="trustApp['reimbursement'] && trustApp['reimbursement']['isTrust']">移动报销</li>
                     <li
                       v-perm="'moveMenu'"
                       :class="{active:activeArr[5]}"
                       @click="goDetail('moveapprove')"
                        v-if="trustApp['moveapprove'] && trustApp['moveapprove']['isTrust']">移动审批</li>
                     <div
                       class="line-group"
                       v-perm="'askMenu' || 'formTemplateSetU' || 'reimbursementList' || 'moveMenu'"></div>
                     <li
                       v-perm="'flowMenu'"
                       :class="{active:activeArr[6]}"
                       @click="goDetail('fixed_flow')">固定流程管理</li>
                     <li
                       :class="{active:activeArr[7]}"
                       @click="goDetail('branch_flow')">分支流程管理</li>
                     <div
                       class="line-group"
                       v-perm="'editCustomAgent'"></div>
                     <li
                       v-perm="'editCustomAgent'"
                       :class="{active:activeArr[8]}"
                       @click="goDetail('meetingassistant')"
                       v-if="trustApp['meetingassistant'] && trustApp['meetingassistant']['isTrust']">云办公应用设置</li>
                  </ul>
              </div>
              <div class="right_side">
                  <router-view></router-view>
              </div>
          </div>
          <div class="bged pt25">
              <qwFooter></qwFooter>
          </div>
      </div>
  </div>
</template>
<script>
import qwFooter from '@/components/base/footer';
import { mapActions, mapGetters } from 'vuex';
export default {
    data() {
        return {
            baseURL: _.baseURL,
            activeArr: [false,false,false,false,false,false,false,false,false]
        }
    },
    components: {
        qwFooter
    },
    computed: {
         ...mapGetters('header',[
             'trustApp',
             'permission'
         ])
    },
    watch: {
         trustApp:function(newVal,oldVal) {
             this.changeActive(newVal);
         }
    },
    methods: {
        // 跳转页面
        goDetail(agentCode){
            if(agentCode == 'reimbursement'){
              this.activeArr[4] =true;
            }
            let baseURL = this.baseURL;
            if(agentCode){
              window.location.href = `${baseURL}/manager/form_flow/main.jsp?agentCode=${agentCode}`;
            }
        },

        // 改变选择tab状态
        changeActive(data){
          this.activeArr = [false,false,false,false,false,false,false,false,false];
          switch (data) {
            case "form":
              this.activeArr[0] = true;
              break;
            case "ask":
              this.activeArr[2] = true;
              break;
            case "car":
              this.activeArr[3] = true;
              break;
            case "reimbursement":
              this.activeArr[4] = true;
              break;
            case "moveapprove":
              this.activeArr[5] = true;
              break;
          }
         /* if(data['form']['isTrust']){
            this.activeArr[0] = true;
            /!*this.activeArr[1] = true;
            this.activeArr[6] = true;
            this.activeArr[7] = true;*!/
          }
          else if(!data['form']['isTrust'] && data['ask']['isTrust']){
            this.activeArr[2] = true;
          }
          else if(!data['ask']['isTrust'] && data['car']['isTrust']){
            this.activeArr[3] = true;
          }
          else if(!data['car']['isTrust'] && data['reimbursement']['isTrust']){
            this.activeArr[4] = true;
          }
          else if(!data['reimbursement']['isTrust'] && data['moveapprove']['isTrust']){
            this.activeArr[5] = true;
          }*/
        }
    },
    mounted() {
        console.log(this.trustApp);
        // 动态渲染内容高度
        let windowHeight = document.documentElement.clientHeight;
        let mainHeight = windowHeight - 90 - 58;
        document.querySelector(".main_wrap").style.minHeight = `${mainHeight}px`;
        this.changeActive(this.$route.query.model);
    }
}
</script>
<style scoped>
.pt25{
    padding-top: 25px;
}
.main_wrap{
    padding-top: 25px;
    width: 100%;
    background: #ededed;
    box-sizing: border-box;
}
.bged{
    background: #ededed;
}
.container{
    display: flex;
    margin: 0 auto;
    max-width: 1200px;
    min-height: 430px;
    border: 1px solid #d9dadc;
    background: #fbfbfb;
}
.container .left_side{
    padding: 30px 0 40px;
    width: 200px;
    min-height: 679px;
    border-right: 1px solid #d9dadc;
    background: #f6f6f6;
}
.side_menun li{
    height: 32px;
    line-height: 32px;
    color: #676666;
    text-indent: 22px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    box-sizing: border-box;
    cursor: pointer;
     background: url(../../../assets/images/arrow1.png) no-repeat 90% center;
}
.side_menun li:hover{
    color: #676666;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background: #fff;
}
.side_menun .active, .side_menun .active:hover{
    color: #fff;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    background: url(../../../assets/images/arrow2.png) no-repeat 90% center #C31725;
}
.right_side{
    padding: 10px 30px 0;
    width: 80%;
}
  .line-group{
    border-top: 1px solid #ddd;
    margin: 10px 0;
  }
</style>


