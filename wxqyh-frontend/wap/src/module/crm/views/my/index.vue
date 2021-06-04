<template>
    <div class="my-list-content">
        <my-list :listData="listData" @handleClick="handleClick"></my-list>
    </div>
</template>
<script>
import myList from './components/myItemList';
import {isVipSilver,isVipGold} from '@/assets/js/vip-portal';
import {feedbackList , isAdministrator} from '@/module/form/api/list.js'
const GET_SUCCESS = '0' //获取反馈列表
export default {
    name: 'myIndex',
    components: {
        myList
    },
    data () {
        return {
            listData: [
                { leftIconClass: require('@/assets/svg/my_a-icon_current.svg'), name: '当前版本', rightIconClass: 'goldCard'},
                { leftIconClass: require('@/assets/svg/my_a-icon_board.svg'), name: '更新公告', rightIconClass: 'arrow'},
                { leftIconClass: require('@/assets/svg/my_a-icon_help.svg'), name: '在线帮助', rightIconClass: 'arrow'},
                { leftIconClass: require('@/assets/svg/my_a-icon_feedback.svg'), name: '在线反馈', rightIconClass: 'arrow'},
            ],
           isAdministrator: '',
           feedbackBase: `${location.href.slice(0, location.href.indexOf('/vp'))}/vp/module/form.html?agentCode=form&corp_id=${wxqyhConfig.orgConfigInfo.corpId}#/open/add?id=`
        }
    },
    created () {
        // 判断金卡 银卡 团队
        this.init();
        //判断是否是管理员
        this.isAdministrators();
    },
    methods: {
        handleClick(item){
            // 判断金卡 银卡 团队
            let obj = { '当前版本': '', '更新公告': 'updateNotice', '在线帮助': 'customService','在线反馈':'' }[item.name]
            if(obj!=''){
                this.$router.push({name: obj})
            }
            if(item.name ==='在线反馈'){
               this.feedBacklist()
            }
        },
        //获取反馈列表
        feedBacklist(){
              feedbackList().then(res => {
                  let length = 0;
                if(res.code === GET_SUCCESS){
                      this.feedbackBase += res.data.feedBackVersionId;
                      length = res.data.tbFormWorkOrderPOList.length;
                if(length <= 0){
                        //跳转到反馈页
                            let hash = `&field=${wxqyhConfig.orgConfigInfo.corpId}&field1=${wxqyhConfig.userId}&field2=张正宇&field3=${this.isAdministrator === 1 ? '管理员' : '普通员工'}&field4=${_.is_vip ? '付费用户' : '普通用户'}`;
                            window.location.href = this.feedbackBase + hash                    
                    }else{ 
                        //跳转到反馈列表                 
                        let feedbackUrl = `${location.href.slice(0, location.href.indexOf('/vp'))}/vp/module/form.html?corp_id=${wxqyhConfig.orgConfigInfo.corpId}#/feedback-list?app=CRM&charge=`    
                        window.location.href = feedbackUrl+encodeURIComponent('张正宇')
                    }                      
                  }else{
                      return _.alert("提示", res.desc);
                  }
    
              })
        },
        //判断是否是管理员
        isAdministrators(){
          if (_.isAdministrator === undefined) {
            isAdministrator().then(res => {
                if (res.code != 0) return;
                this.isAdministrator = _.isAdministrator = res.data.isManager;
            })
         }
        },
        // 判断金卡 银卡 团队
        init(){
            let _this = this
            wxqyhConfig.ready(function(){ 
             _this.listData.forEach((item) => {
                if(item.name == '当前版本'){   
                    if(isVipSilver('crm')==true){
                        if(isVipGold('crm') == true){
                            item.rightIconClass = 'goldCard'
                        }else{
                            item.rightIconClass = 'sliverCard'
                        }
                    }
                    else{
                        item.rightIconClass = 'teamCard'
                         }           
                     }
                 })
             })
        }  
    }
}
</script>
<style lang='scss' scoped>
</style>