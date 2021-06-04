<template>
    <detail-card ref="detailBlock">
        <template slot="title">
            <div class="detail-header-block">
                <h1 class="detail-title" :title="detailData.competitorName" >{{detailData.competitorName}}</h1>
                <div class="detail-header-btns">
                  <qw-Button type="primary" @click="edit" >编辑</qw-Button>
                    <qw-popover ref="qwPopover" class="btns-down" placement="bottom" :gutter="10" :show-arrow="false">
                      <div slot="content" class="btns-down-menu">
                          <div class="btns-down-item" @click="showBusinessPopup=true">
                            竞争商机
                          </div>
                      </div>
                      <qw-Button >添加 <i class="btns-down-icon"></i></qw-Button>
                    </qw-popover>
                </div>
            </div>
        </template>
        <template>
            <qw-tabs defaultTabName="1" @tabClick="tabClick" >
                <qw-tab-item label="基本信息" name="1" >
                    <basic-information @setTitle="setTitle" :id ="id" ref="basicInfo" ></basic-information>
                </qw-tab-item>
                <qw-tab-item label="竞争商机" name="2"  >
                    <competitor-chance :id ="id" ref="chanceList" ></competitor-chance>
                </qw-tab-item>
            </qw-tabs>
        </template>
        <competitor-add :editData="detailData" @refreshInfo="refreshInfo" ref="editDialog"></competitor-add>
        <competitor-add-business v-model="showBusinessPopup" :id ="id"  @refreshBusiness="refreshBusiness"></competitor-add-business>
    </detail-card>
</template>

<script>
import detailCard from 'crm/components/qw-detatil-card/qw-detatil-card';
import qwButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import qwTabs from 'crm/components/qw-tab/tab/tab';
import qwTabItem from 'crm/components/qw-tab/tabItem/tabItem';
import basicInformation from './detail/basicInformation';
import competitorChance from './detail/competitorChance';
import competitorAdd from './competitorAdd';
import competitorAddBusiness from './competitorAddBusiness';
import QwPopover from "crm/components/qwPopover";
export default {
    components: {
        detailCard, // 详情 样式组件
        qwButton, // 按钮
        qwTabs, // tab 组件
        qwTabItem, // tab选项卡组件
        basicInformation, // 基本信息
        competitorChance, // 竞争商机列表
        competitorAdd, // 编辑
        QwPopover,
        competitorAddBusiness
    },
    data(){
        return{
            detailData: {}, // 竞争对手详情
            id: "",  // 竞争对手ID
            showBusinessPopup:false
        }
    },
    methods: {
        edit(){
            // 打开编辑框
            this.$refs.editDialog.openDialog();
        },
        showDetail(id){
            // 打开详情
            this.id = id;
            this.$refs.detailBlock.open()
        },
        // tab选项卡切换事件
        tabClick(obj){
            switch( obj.index ){
                case 0:
                    this.$refs.basicInfo.init()
                    break;
                case 1:
                    this.$refs.chanceList.init()
                    break;
            }
        },
        // 设置 详情 标题
        setTitle(data){
            this.detailData = data;
        },
        // 刷新详情
        refreshInfo(){
            this.$refs.basicInfo.getDetail();
            this.$emit("refreshInfo");
        },
        //刷新列表
        refreshBusiness(){
            this.$refs.chanceList.reload();
        }
    },
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/baseUI.scss';
.detail-header-block{
    display: flex;
    justify-content: space-between;
    .detail-title{
        @include ellipsis;
        width: 600px;
    }
    .detail-header-btns{
      .btns-down{
        position: relative;
        display: inline-block;
        margin-left: 12px;
       &-icon{
            background: url(~assets/images/ic_down.png) no-repeat;
            background-size: contain;
            display: inline-block;
            width: 11px;
            height: 6px;
            margin-left: 3px;
            vertical-align: middle;
          }
        &-menu{
          font-size: 14px;
          width: 100%;
          width:80px;
          box-shadow:0px 0px 6px 0px rgba(0,0,0,0.1);
          border-radius:2px;
          background-color: #ffffff;
        }
        &-item{
          padding:8px 0px;
          text-align: center;
          width: 100%;
          cursor: pointer;
          &:active{
            background: #f4f5f9;
          }
        }
      }
    }
}
</style>

