<template>
  <div class="express_desc">
    <div class="express_desc_line"></div>
    <back :goBackConfig="goBackConfig"></back>
    <div class="express_desc_line"></div>
    <label>通用备注信息：</label>
    <div>
    <qwui-input v-model="text"
                inputType="textarea"
                :maxLength=400></qwui-input>
    </div>
    <div class="express_button">
      <qwui-button type='primary' @click="changeDesc">保存</qwui-button>
    </div>
  </div>
</template>
<script>
  import back from '@/components/base/qwuiGoBack.vue'
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
  import {getExpressRemark,saveExpressRemark} from '../../api/newsBulletin/getExpress'
  export default {
    components:{
      back,
      qwuiInput,
      qwuiButton
    },
    data(){
      return{
        text:'',
        searchParams:{ //接口参数
          'tbQyExpressRemarkPO.id': '',
          'tbQyExpressRemarkPO.remark': ''
        },
        goBackConfig:{
          hasLine:false,
          currPath:'备注设置'
        },
      }
    },
    created(){
      getExpressRemark('',(data)=>{
        this.text = data.tbQyExpressRemarkPO.remark
        this.searchParams['tbQyExpressRemarkPO.id'] = data.tbQyExpressRemarkPO.id
      })
    },
    methods:{
      //保存更改
      changeDesc(){
        this.searchParams['tbQyExpressRemarkPO.remark'] = this.text;
        let self = this;
        saveExpressRemark(self.searchParams,(data)=>{
          _.alert('提示','保存成功',function(){
            self.$router.push('/express/setting')
          });
        })
      }
    }
  }
</script>
<style scoped>
  .express_desc{
    padding:20px;
  }
  .express_button{
    width:100%;
    margin-top: 10px;
    padding-top: 20px;
    text-align: center;
    border-top: 1px solid #eee;
  }
  .express_desc_line{
    height:20px;
    width:100%
  }
</style>
