<template>
    <ul class="contract_money_list">
        <li v-for="(data,index) in dataList " :key="index" @click="linkTo(data)">
            <div class="box_title">
                <span class="type_tip" :class="data.stepType=='0' ? 'yellow' :(data.stepType =='1' ? 'blue' : 'green')">{{data.stepType == '0'? '计划':(data.stepType == '1' ? '实际':'开票')}}</span>
                <span class="contract_title">{{data.title}}</span>
            </div>
            <ul class="box_content">
                <li v-for="(item,i) in data.detailVOList" :key="i">
                    <div>
                      <i class="circle_icon" :class="data.stepType=='0' ? 'circle_icon_yellow' :(data.stepType=='1' ? 'circle_icon_blue' : 'circle_icon_green')"></i>
                      <i class="line_icon" :class="data.stepType=='0' ? 'line_icon_yellow' :(data.stepType=='1' ? 'line_icon_blue' : 'line_icon_green')" v-if="i>0"></i>
                    </div>
                    <div>
                        <span>第{{item.step}}期</span>
                        <span>￥{{item.money}}</span>
                        <span>{{item.receiveDate}}</span>
                    </div>
                    
                </li>
            </ul>
        </li>
    </ul>
</template>
<script>
export default {
  props:{
    dataList:{
      type:Array,
      default:function(){
        return []
      },
    },
  },
  methods:{
    linkTo(data){
      this.$router.push({path:"/ContractContent",query:{id:data.id,isFromContractList:false, agentCode: this.$route.query.agentCode || 'crm'}});
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../crmBase.scss";
.contract_money_list {
  width: 100%;
  .yellow{
    background: rgba(255, 195, 99, 0.1);
    border-color: #ffc363;
    color: #ffc363;
  }
  .blue{
    background: rgba(79, 134, 255, 0.1);
    border-color: #5585F0;
    color: #5585F0;
  }
  .green{
    background: rgba(40, 218, 152, 0.1);
    border-color: #28DA98;
    color: #28DA98;
  }
  & > li {
    background: #fff;
    border-radius: rem(6);
    margin-bottom: rem(8);
    padding: 0 rem(15) rem(12) rem(15);
    box-sizing: border-box;
    .box_title {
      width: 100%;
      height: rem(50);
      line-height: rem(50);
      display:flex;
      .type_tip {
        display: inline-block;
        width: rem(44);
        height: 22px;
        line-height:22px;
        text-align: center;
        border-radius: rem(4);
        border: 1px solid ;
        margin-top:rem(14);
      }
      .contract_title {
        font-size: rem(16);
        color: #36404a;
        margin-left: rem(12);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
        width:rem(290);
      }
    }
    .box_content {
      width: 100%;
      li {
        display: flex;
        justify-content: flex-start;
        line-height: rem(36);
        height:rem(36);
        div:first-of-type {
            flex: 1;
            position: relative;
          .circle_icon {
            display: inline-block;
            width: rem(14);
            height: rem(14);
            position: relative;
            border-radius: 50%;
            vertical-align: middle;
          }
          .circle_icon_yellow{
            background: rgba(255, 195, 99, 0.1);
          }
          .circle_icon_yellow::after{
            background: rgba(255, 195, 99, 0.5);
          }
          .circle_icon_blue{
            background: rgba(79, 134, 255, 0.1);
          }
          .circle_icon_blue::after{
            background: rgba(79, 134, 255, 0.5);
          }
          .circle_icon_green{
            background: rgba(40, 218, 152, 0.1);
          }
          .circle_icon_green::after{
            background: rgba(40, 218, 152, 0.5);
          }
          .circle_icon::after {
            content: "";
            display: inline-block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: rem(8);
            height: rem(8);
            border-radius: 50%;
          }
          .line_icon{
            display: inline-block;
            position: absolute;
            bottom:rem(27);
            left:rem(6);
            width:0;
            height:rem(12);
            border:1px dashed;
          }
          .line_icon_yellow{
            border-color:rgba(255, 195, 99, 0.3)
          }
          .line_icon_blue{
            border-color:rgba(79, 134, 255, 0.3);
          }
          .line_icon_green{
            border-color:rgba(40, 218, 152, 0.3);
          }
        }

        div:last-of-type {
          flex: 15;
          display: flex;
          justify-content: space-between;
          span {
            font-size: rem(15);
            color:#7A7C80;
          }
        }
      }
    }
  }
}
</style>