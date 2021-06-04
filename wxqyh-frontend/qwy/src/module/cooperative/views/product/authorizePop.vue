<template>
  <div>
    <pop-base :popData="authorizeConfig.popData" @listenClose="closePop" @listenBtnFunc="listenBtnFunc">
      <div class="authorize_content">
        <div class="person_choose">
          <p class="desc_tip">未授权</p>
          <qwui-input class="search_input"
                      v-model="searchTitle"
                      inputType="search"
                      :inputTips="'输入帐号关键字快速筛选'"
                      @input="search"
                      @search='search'></qwui-input>
          <div class="authorize_person">
            <div class="tab_title">
              <div class="select_item" :class="{ 'under_line':isDirect }" @click="changeSelectItem(true)">直接选择</div>
              <div class="select_item" :class="{ 'under_line':!isDirect }" @click="changeSelectItem(false)">批量导入
                <div class="question_icon">
                  <div class="batch_desc">
                    · 导入内容为管理员的子帐号<br>
                    · 每个账号占一行，每次最多支持100行<br>
                    · 导入失败原因：子帐号不存在或字符错误
                  </div>
                </div>
              </div>
            </div>
            <div class="select_content">
              <div v-if="isDirect" class="select_list">
                <p class="list"
                   v-for="(item,key) in authorizeConfig.unAuthorizeList"
                   :key="key"
                   v-show="!item.hideItem"
                   @click="dataTransfer(key,item,true)">{{ item.personName }}</p>
              </div>
              <textarea v-else
                        class="person_list"
                        :class="{ 'fail':isFail }"
                        v-model="batchData"
                        @focus="changeFail"></textarea>
            </div>
          </div>
        </div>
        <div class="center_content">
          <div v-if="isDirect" class="add_icon"></div>
          <qwui-button v-else class="import_btn" @click="importBatchData">导入 ></qwui-button>
        </div>
        <div class="person_show">
          <div class="item_title">
            <span class="mr10">已授权</span>
            <qwui-checkbox class="flex_item" v-model="authorizeConfig.isAllowEdit">允许修改</qwui-checkbox>
            <qwui-checkbox class="flex_item" :value="true" :disabled="true">允许查看</qwui-checkbox>
          </div>
          <div class="show_content">
            <p class="list"
               v-for="(item,key) in authorizeConfig.authorizeList"
               :key="key"
               @click="dataTransfer(key,item)">{{ item.personName }} <i class="close"></i></p>
          </div>
        </div>
      </div>
    </pop-base>
  </div>
</template>

<script>
  import popBase from '@/components/Add/popUps/PopBase';
  import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
  import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox';
  import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';


  export default {
    props:{
      authorizeConfig:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data(){
      return {
        isDirect:true, // 是否直接选择
        isFail:false,  // 是否导出失败
        searchTitle:'', // 搜索关键字
        batchData:'', // 批量数据
        totalUserIds:[], // 所有未导出的userName
        totalPersonName:[], // 所有未导出的personName
      }
    },
    methods:{
      closePop(){
        this.$emit('listenClose')
      },
      listenBtnFunc(key){
        this.$emit('listenBtnFunc',key)
      },
      search(){
        this.authorizeConfig.unAuthorizeList.forEach((item)=>{
          item.hideItem = true;
          if (item.personName.indexOf(this.searchTitle) != -1){
            item.hideItem = false;
          }
        })
      },
      changeSelectItem(status){
        this.isDirect = status;
      },
      changeFail(){
        this.isFail = false;
      },
      // 点击将人员切换到另一格子
      dataTransfer(key,item,status){
        if (status){
          this.authorizeConfig.unAuthorizeList.splice(key,1);
          this.totalUserIds.splice(key,1);
          this.totalPersonName.splice(key,1);
          this.authorizeConfig.authorizeList.push(item);
        }else {
          this.authorizeConfig.authorizeList.splice(key,1);
          this.authorizeConfig.unAuthorizeList.push(item);
          this.totalUserIds.push(item.userId);
          this.totalPersonName.push(item.personName);
        }
      },
      // 批量导入人员数据，超过一百自动截取前一百个，导入失败的字体标红
      importBatchData(){
        let failStr = '';
        let textArr = this.batchData.split('\n');
        if (this.batchData == ''){
          return;
        }
        if(textArr.length > 100){
          this.batchData = this.batchData.slice(0,99);
        }
        textArr.forEach((item)=>{
          let index = this.totalUserIds.indexOf(item);
          if (index != -1){
            this.dataTransfer(index,{
              userName:this.totalUserIds[index],
              personName:this.totalPersonName[index]
            },true)
          }else {
            failStr += item + '\r\n';
          }
        });
        this.isFail = true;
        this.batchData = failStr;
      }
    },
    watch:{
      'authorizeConfig.unAuthorizeList':function () {
        this.authorizeConfig.unAuthorizeList.forEach((item)=>{
          this.totalUserIds.push(item.userName);
          this.totalPersonName.push(item.personName);
        })
      },
    },
    components:{
      popBase,
      qwuiInput,
      qwuiCheckbox,
      qwuiButton
    }
  }

</script>

<style lang="scss" scoped>
  .authorize_content {
    display: flex;
    flex-direction: row;

    .person_choose {
      flex: 1;

      .desc_tip {
        padding-bottom: 5px;
        color: #666;
      }

      .search_input /deep/ .qw_searchInput {
        width: 192px;
      }

      .authorize_person {
        margin-top: 5px;
        border: 1px #ddd solid;

        .tab_title {
          display: flex;
          flex-direction: row;
          line-height: 36px;
          border-bottom: 1px #ddd solid;

          .select_item {
            flex:1;
            margin: 0 15px;
            cursor: pointer;
            text-align: center;

            &.under_line {
               border-bottom: 3px solid #C31725;
             }

            .question_icon {
              position: relative;
              display: inline-block;
              height: 16px;
              width: 16px;
              vertical-align: sub;
              background: url("~assets/svg/ic_q_gray.svg") no-repeat left scroll;
              background-size: cover;

              .batch_desc {
                position: absolute;
                display: none;
                background: #fff;
                color: #666;
                font-size: 12px;
                padding: 10px 20px;
                border: 1px solid #d9dadc;
                width: 225px;
                left: -175px;
                top: 27px;
                text-align: left;
                line-height: 20px;
                z-index: 1;
              }

              &:hover {
               .batch_desc{
                 display: inline-block;
               }
               }
            }
          }

        }

        .select_content {
          height: 250px;
          overflow: hidden;

          .select_list,.person_list {
            height: 100%;
            background: #fff;
            overflow: auto;

          .list {
            position: relative;
            line-height: 28px;
            cursor: pointer;
            padding: 0 10px;

          &:hover {
             background: #f0f0f0;
             color: #333;
           }
          }
          }
          .person_list {
            width: 100%;
            padding: 6px 4px;
            box-sizing: border-box;
            resize:none;
            border: none;

            &.fail {
              color: red;
            }
          }
        }
      }
    }

    .center_content {
      width: 80px;

      .add_icon {
        height: 100%;
        background: url("~assets/images/arrow_right.png") no-repeat center;
      }
      .import_btn {
        margin: 190px 2px 0 4px;
      }
    }

    .person_show {
      flex: 1;

      .item_title {
        display: flex;
        flex-direction: row;
        color: #666;

        .flex_item {
          flex:1;
          color: #666;
        }
      }
      .show_content {
        margin-top: 5px;
        height: 326px;
        background-color: white;
        border: 1px solid #ccc;
        overflow-y: auto;

        .list {
          position: relative;
          line-height: 28px;
          cursor: pointer;
          padding: 0 10px;

          .close {
            position: absolute;
            display: none;
            right: 5px;
            top: 5px;
            width: 16px;
            height: 16px;
            background: url("~assets/images/btn_removeLicensing.png") no-repeat;
          }

          &:hover {
             background: #f0f0f0;
             color: #333;

             .close {
               display: inline-block;
             }
           }

        }
      }
    }
  }
</style>
