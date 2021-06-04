<template>
  <div>
    <!--返回按钮-->
    <qwui-go-back :goBackConfig="goBackConfig"></qwui-go-back>
    <div class="qwui-check_item">
      <span class="qwui-item_title">应用端日志统计功能：</span>
      <qwui-checkbox class="qwui-check_custom_box" v-model="isCount" >开启</qwui-checkbox>
      <a class="qwui-vip_tip" :href="vipHref" target="_blank">尊享版功能</a>
    </div>
    <div v-if="isCount" class="qwui-check_item">
      <span class="qwui-item_title">可使用对象：</span>
      <person-count class="qwui-person_count"
                    :personCountShow="personCountShow"
                    :defaultUsers="defaultUsers"
                    :showType="showType"
                    @listenAddPerson="addPerson">
      </person-count>
      <pick-person :show="pickPersonShow"
                   :defaultUsers="defaultUsers"
                   :functionTab="functionTab"
                   @chooseDone="chooseDone"
                   @closeThis="closeThis"></pick-person>
      <p class="qwui-tip_desc">使用对象可在应用端设置统计规则，仅统计使用对象为负责人的日志提交情况</p>
    </div>
    <div class="qwui-save_btn">
      <qwui-button type='primary' @click="updateCountPower">保存</qwui-button>
    </div>
  </div>
</template>

<script>
  import qwuiGoBack from '@/components/base/qwuiGoBack';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
  import pickPerson from '@/components/pickPerson/pickPerson';
  import personCount from '@/components/pickPerson/qwuiPersonCount';
  import { isVipGold } from '@/assets/js/vip-manager';

  import { getCountPowerPersons,saveCountPowerPersons } from '../../api/diary/getData';

  export default {
    data(){
      return {
        goBackConfig:{
          hasLine:false,
          lastPath:'设置',
          currPath:'应用端日志统计设置'
        },
        isCount:false,
        personCountShow:true,
        defaultUsers:[],
        showType:{
          person:true,
        },
        pickPersonShow:false,
        functionTab:[
          {text:'标签人员'},
          {text:'特定人员'},
          {text:'批量导入'},
        ],
      }
    },
    created(){
      getCountPowerPersons((data)=>{
        this.isCount = data.isCount == 1 ? true : false;
        this.defaultUsers = data.powerPersons;
      })
    },
    computed:{
      vipHref(){
        return _.baseURL + '/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav'
      }

    },
    methods:{
      addPerson(){
        this.pickPersonShow = true;
      },
      chooseDone(deptSelected,tagList,specialUsers){
        this.defaultUsers = specialUsers;
        this.pickPersonShow = false;
      },
      closeThis(){
        this.pickPersonShow = false;
      },
      updateCountPower(){
        if(!isVipGold(interfaceCode.INTERFACE_CODE_DIARY)){
          _.alert("提示", "该功能仅限尊享版使用，<a href=\"https://qy.do1.com.cn/qwy/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav\" class='orange' target=\"_blank\">马上升级 ></a>");
          return;
        }
        let powerPersons = [];
        let params = {};
        params['isCount'] = this.isCount ? 1 : 0;
        if (this.isCount){
          this.defaultUsers.forEach((item)=>{
            powerPersons.push(item.userId);
          });
          params['powerPersons'] = powerPersons.join('|');
        }
        saveCountPowerPersons(params,()=>{
          dataBase.top_alert('保存成功',true,3000);
          this.$router.push({
            name:'diarySetting'
          })
        })
      }
    },
    components:{
      qwuiGoBack,
      qwuiButton,
      qwuiCheckbox,
      pickPerson,
      personCount
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-check_item {
    line-height: 52px;

  .qwui-check_custom_box /deep/ {
    .qwui-checkbox-input,.qwui-checkbox-label {
      vertical-align: baseline !important;
    }
  }

  .qwui-item_title {
    width: 140px;
    display: inline-block;
    text-align: right;
    margin-right: 10px;
    color: #666;
  }
  .qwui-person_count {
    padding-left: 45px;
    margin-top: -20px;
  }
  }
  .qwui-vip_tip {
    color: #F78B00;
    cursor: pointer;
  }

  .qwui-tip_desc {
    padding-left: 45px;
    font-size: 12px;
    color: #999;
  }
  .qwui-save_btn {
    padding-top: 20px;
    border-top: 1px solid #e4e4e4;
    text-align: center;
  }
</style>
