<template>
  <div class="competing-management">

    <div class="qwui-nav_wrap">
      <qwuiButton @click="handleClickBack" type="button" >&nbsp;返回&nbsp;</qwuiButton>
<!--      <span class="qwui-dotted_line"></span>-->
    </div>

    <div class="qwui-title_wrap">
      <div class="qwui-title" v-if="id">编辑大区负责人</div>
      <div class="qwui-title" v-else>新增大区负责人</div>
    </div>


    <div>

      <div class="form">

        <div v-if="id" class="form__item">
          <div class="form__item__label">
            服务站简称:
          </div>
          <div class="form__item__value">

            <el-input size="small" v-model="serviceErp" :disabled="true" placeholder="服务站简称"></el-input>

          </div>
        </div>

        <div v-else class="form__item">
          <div class="form__item__label">
            服务商ERP号:
          </div>
          <div class="form__item__value">

            <dealerSelector :id="id" v-model="serviceErp" @confirm="handleConfirmServiceErp"></dealerSelector>
            <div class="result" v-if="serviceErp">
              <div class="result__text" :title="dealerFullName">{{dealerFullName}}</div>
              <i class="result__close" @click="handleClickRemoveServiceErp"></i>
            </div>

          </div>
        </div>

        <div v-if="id" class="form__item">
          <div class="form__item__label">
            服务站简称:
          </div>
          <div class="form__item__value">

            <el-input size="small" v-model="serviceStationName" :disabled="true" placeholder="服务站简称"></el-input>

          </div>
        </div>

        <div class="form__item">
          <div class="form__item__label">
            大区负责人:
          </div>
          <div class="form__item__value" v-if="serviceErp">

            <leaderSelector :id="id" :serviceErp="serviceErp" v-model="wxUserId" @confirm="handleConfirmUser"></leaderSelector>
            <div class="result" v-if="wxUserId">
              <div class="result__text" :title="personName">{{personName}}</div>
              <i class="result__close" @click="handleClickRemoveUser"></i>
            </div>

          </div>
        </div>




      </div>

      <qwuiButton @click="handleSubmit"  type='primary' >&nbsp;提交&nbsp;</qwuiButton>

    </div>







  </div>
</template>

<script>
    import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
    import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
    import QwuiRadio from '@/components/qwuiRadio/radio'; // 公共-单选框组件
    import numberInput from '@/components/base/numberInput'
    import QwuiRadioGroup from '@/components/qwuiRadio/radio_group'; // 公共-单选框群组组件
    // import QwUploadImg from "@/components/Add/uploadImg/QwUploadImg";
    import pickExam from '@/components/pickPerson/pickExam';
    import uploadImg from '@/components/Add/uploadImg/QwUploadImg'
    import {addAndUpdateSearchService,  serviceAdminPortalAction} from "../../api/getData";
    import dealerSelector from './components/dealerSelector';
    import leaderSelector from './components/leaderSelector';


    export default {
        name: "competingManagement",
        components: {
            qwuiButton,
            qwuiCheckbox,
            QwuiRadioGroup,
            QwuiRadio,
            uploadImg,
            leaderSelector,
            numberInput,
            pickExam,
            dealerSelector
        },
        data() {
            return {
                picOption: { //上传图片配置
                    agent: dataBase.agentCode,
                    uploadFileId: 'coverImg',
                    showType: 'middle',
                    isMoreImg: false,//true：多图,false：封面图片
                    imageObj: {},//多图列表
                },
                brandName: '',
                brandImg: '',
                id: '',
                sequence: 0,
                config_numberInput:{
                    data:0,
                    multiple:1,
                    showBtn:false
                },
                useTab:[
                    {text:'标签人员'},
                    {text:'特定人员'},
                    {text:'高级筛选'},
                ],
                useDepts:[],
                useUsers:[],
                useTags:[],
                useRadio: false,
                serviceErp: '',
                wxUserId: '',
                serviceStationName: '',
                personName: '',
                dealerFullName: '',
            }
        },
        props: {},
        methods: {

            handleConfirmServiceErp(item){
              this.dealerFullName = item.dealerFullName;
            },

            handleConfirmUser(item){
                this.wxUserId = item.wxUserId;
                this.personName = item.personName;
            },

            handleClickBack(){
                this.$router.back()
            },


            handleClickRemoveServiceErp(){
                this.serviceErp = '';
                this.wxUserId = '';
            },

            handleClickRemoveUser(item){
                this.wxUserId = '';
            },

            handleSubmit(){
                const params = {
                    serviceErp: this.serviceErp,
                    wxUserId: this.wxUserId,
                }
                if(this.id){
                    Object.assign(params, {id: this.id});
                }
                addAndUpdateSearchService(params).then((data)=>{
                    data && this.$router.back()
                })

            },


            //返回的部门、标签、人员数组（发布对象）
            chooseDone:function (dept=[],tag=[],user=[]) {
                console.log(user.map((item)=>item.id),'xx')
            },

            changeRedRadio(val){
                console.log(val);
            },

            initData(){
                serviceAdminPortalAction({id:this.id}).then((data)=>{
                    this.serviceErp = data && data.serviceErp ? data.serviceErp: '';
                    this.wxUserId = data && data.wxUserId ? data.wxUserId: '';
                    this.serviceStationName = data && data.serviceStationName ? data.serviceStationName: '';
                    this.personName = data && data.personName ? data.personName: '';
                })
            }


        },
        created() {
          const {id} = this.$route.query;
          if(id){
              this.id = id;
              this.initData()
          }else{

          }
        }
    }
</script>

<style scoped lang="scss">
  .competing-management{
    position: relative;
    padding: 10px 30px 0;
    width: 969px;
    min-height: 800px;
    background: #ffffff;
    .goLink {
      color: #C31725;
    }

    .qwui-nav_wrap {
      padding-bottom: 15px;
    }

    .qwui-line {
      position: relative;
      height: 1px;
      background: #eee;
      margin-bottom: 20px;
    }
    .qwui-title_wrap {
      background-color: #f5f5f5;
      border-left: 4px solid #C31725;
      height: 47px;
      line-height: 47px;
      position: relative;
      margin-bottom: 20px;
    }

    .qwui-title_wrap .qwui-title {
      font-weight: 700;
      margin-left: 20px;
      color: #666;
      font-size: 16px;
    }

    .qwui-button.qwui-button-primary:hover {
      background: #F08088;
      border-color: #F08088;
    }

    .qwui-button.qwui-button-primary {
      border-color: #C31725;
      color: #fff;
      background: #c31725;

    }

    .qwui-button {
      display: inline-block;
      line-height: 1;
      padding: 8px 15px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #fff;
      color: #333;
    }

    position: relative;
    // border: 1px #ccc solid;
    // background-color: #fff;
    .form-wrapper {
      padding: 20px 20px 0;
    }
    .search-footer {
      margin-top: 10px;
      padding: 5px 20px;
      text-align: right;
      background-color: #f5f5f5;
      .search-btn {
        display: inline-block;
        padding: 0 16px;
        height: 26px;
        line-height: 26px;
        font-size: 14px;
        border-radius: 2px;
        box-sizing: border-box;
        &.search-btn-default {
          color: #333;
          border: 1px #ccc solid;
          margin-right: 16px;
          background-color: #fff;
          &:hover {
            background-color: #f7f7f7;
          }
        }
        &.search-btn-confirm {
          color: #fff;
          border: 1px #C31725 solid;
          background-color: #c31725;
          &:hover {
            background-color: #F08088;
          }
        }
      }
    }
    .line {
      text-align: center;
    }
    .qwui-dotted_line {
      border-right: 1px dashed #cfcfcf;
      margin: 0 8px 0 5px;
    }

    .competing{
      width: 600px;
    }

    .table-header{
      background:  #d5d5d5;
    }

    .dialog__content__search{
      border-bottom: 1px solid #cfcfcf;
      padding-bottom: 15px;
    }



    .result{
      margin-left: 10px;
      position: relative;
      display: inline-block;
      line-height: 1;
      padding: 8px 32px 8px 15px;
      font-size: 14px;
      border-radius: 4px;
      background: #fff;
      max-width: 180px;
      border: 1px solid #F08088;
      color: #C31725;
      &:hover{
        background: #fff9f0;
      }
      .result__text{
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        vertical-align: bottom;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
      }
      .result__close{
        background: url("./images/selected-close.png") no-repeat scroll 0 0;
        cursor: pointer;
        height: 16px;
        position: absolute;
        right: 12px;
        top: 7px;
        width: 16px;
      }
    }


    .form__item{
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      .form__item__label{
        flex-basis: 100px;
        text-align: right;
        height: 32px;
        line-height: 32px;
      }
      .form__item__value{
        padding-left: 10px;
      }
    }



  }
</style>
