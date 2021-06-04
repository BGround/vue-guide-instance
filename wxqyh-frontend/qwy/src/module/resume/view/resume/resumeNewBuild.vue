<template>
  <div class="qwui-resumeNewBuild">
    <div class="header">
      <span class="header_font">简历新增</span>
    </div>
    <div class="article">
      <div class="back"><i class="goback" @click="goBack"></i><span class="back_left">简历管理 / </span><span>新增简历</span></div>
      <div class="enter_way">
        <label for="way">录入方式
          <span class="radio_inner">
            <input type="radio" checked><span class="address">网页地址</span>
          </span>
        </label>
      </div>
      <div class="content">
        <span>简历内容</span>
        <textarea class="placeholder" v-model="url" placeholder="请输入完整网页地址，如果需要输入多个网址，请用英文逗号分隔"></textarea>
      </div>
      <div class="choose">
        <input class="cancel" @click="goBack"  type="button" value="取消">
        <input class="comfirm" @click="saveSearch" type="button" value="保存">
      </div>
    </div>
  </div>
</template>

<script>
import { addNewBuild } from '../../api/getData.js'
export default {
  name: 'resumeNewBuild',
  data(){
    return {
      url:"",
    }
  },
  methods:{
    goBack(){
      window.history.go(-1);
    },
    saveSearch(){
      let self=this;
      // 去除空格
      this.url=this.url.replace(/\s+/g,"");
      // 简历新增
      addNewBuild({resumeUrls:self.url},result=>{
        dataBase.top_alert('新增成功',true,3000);
        self.url="";
      });
    }
  }
}

</script>

<style lang="scss" scoped>

.qwui-resumeNewBuild{
  font-size: 14px;
}
 .header{
    height: 56px;
    width: 100%;
    line-height: 56px;
    text-align: center;
    color:rgba(247,139,0,1);
    border-bottom:1px solid #e5e2e2;
  }

  .header_font{
    display: inline-block;
    height: 56px;
    width: 106px;
    border-bottom:3px solid #C31725;
    font-size:16px;
  }

  .back{
    height: 40px;
    line-height: 40px;
    margin-top:29px;
    color:#666;
    .goback{
      position: relative;
      top: 3px;
      height: 19px;
      width: 21px;
      display: inline-block;
      background: url(~assets/images/back_icon.png) no-repeat;
      background-size: contain;
      margin-right: 16px;
      cursor: pointer;
    }

    .back_left{
      color:#999;
    }
  }

  .enter_way{
    margin: 26px 0 0 100px;
    position: relative;
    .radio_inner{
      margin-left: 20px;

       .address{
         display: inline-block;
         margin-left: 5px;
       }
    }
  }

  .content{
    margin: 26px 0 360px 90px;

    span::before{
      content: "*";
      font-size: 14px;
      color: #ff5a5a;
      margin-right: 4px;
    }

    .inner_content{
      display: inline-block;
      width: 530px;
      height: 146px;
      border:1px solid #999;
      margin-left: 20px;
    }

    span{

      float: left;
    }

    textarea{
      display: inline-block;
      width: 530px;
      height: 146px;
      border:1px solid #BBB;
      margin-left: 20px;
      font-size:14px;
      line-height: 19px;
      resize:none;
      padding: 6px 10px 6px 12px;
    }

  }
  .choose{
    text-align: center;

    .comfirm{
      background:rgba(255,150,0,1);
      border-radius:2px;
      color:white;
    }

    .cancel{
      background:rgba(251,251,251,1);
    }

    input[type="button"]{
      width: 72px;
      height: 32px;
      padding: 6px 22px 7px;
      border-radius:4px;
      border:1px solid #E5E5E5;
    }

  }
</style>
