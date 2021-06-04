<template>
  <div class="competing-management">

    <div class="qwui-nav_wrap">
      <qwuiButton @click="handleClickBack" type="button" >&nbsp;返回&nbsp;</qwuiButton>
<!--      <span class="qwui-dotted_line"></span>-->
    </div>

    <div class="qwui-title_wrap">
      <div class="qwui-title" v-if="id">编辑竞品</div>
      <div class="qwui-title" v-else>添加竞品</div>
    </div>


    <div>

      <div class="form">

            <div class="form__item">
              <div class="form__item__label">
                企业名称:
              </div>
              <div class="form__item__value">
                <el-select
                        popper-class="chery"
                        size="small"
                        v-model="brandName"
                        filterable
                        @change="handleChangeCompany"
                        placeholder="请输入企业名称">
                  <el-option
                          v-for="item in companyOptions"
                          :key="item.id"
                          :label="item.company"
                          :value="item.company">
                  </el-option>
                </el-select>
              </div>
            </div>

        <div class="form__item">
          <div class="form__item__label">
            品牌名称:
          </div>
          <div class="form__item__value">
            <el-select
                    popper-class="chery"
                    size="small"
                    v-model="brands"
                    filterable
                    multiple
                    placeholder="请输入企业名称">
              <el-option
                      v-for="item in brandOptions"
                      :key="item.id"
                      :label="item.brand"
                      :value="item.brand">
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="form__item">
          <div class="form__item__label">
            是否显示在成绩单:
          </div>
          <div class="form__item__value">

            <el-select v-model="isDisplay" placeholder="请选择" size="small" popper-class="chery">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>

          </div>
        </div>

        <div class="form__item">
          <div class="form__item__label">
            是否显示品牌:
          </div>
          <div class="form__item__value">

            <el-select v-model="brandsDisplay" placeholder="请选择显示品牌" size="small" popper-class="chery">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>

          </div>
        </div>


        <div class="form__item">
          <div class="form__item__label">
            序号:
          </div>
          <div class="form__item__value">
            <el-input-number size="small" v-model="sequence" controls-position="right" :min="0" :max="1000000"></el-input-number>
          </div>
        </div>


        <div class="form__item">
          <div class="form__item__label">
            竞品图片:
          </div>
          <div class="form__item__value">
            <upload-img class="uploadBtn" :uploadConfig="picOption" @imageObj="moreImgUpload"></upload-img>
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
    import uploadImg from '@/components/Add/uploadImg/QwUploadImg'
    import {ajaxAddBrand, ajaxUpdateBrand , getBrand, getCompany} from "../../api/getData";
    import brandSelect from './components/brandSelect';

    export default {
        name: "competingManagement",
        components: {
            qwuiButton,
            // qwuiRadio,
            qwuiCheckbox,
            QwuiRadioGroup,
            QwuiRadio,
            // QwUploadImg,
            uploadImg,
            brandSelect,
            numberInput
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
                brands: [], // 品牌
                isDisplay: '1', ///状态(0.否,1.是)
                brandsDisplay: '1',
                companyOptions: [],
                brandOptions: []
            }
        },
        props: {},
        methods: {



            handleChangeCompany(company){
              this.brandOptions = [];
              this.brands = [];
              if(company){
                  this.fetchBrands();
              }
            },

            fetchBrands(){
                getBrand({pid: this.brandName}).then((data)=>{
                    this.brandOptions = data && data.enterpriseInfoPOS ? data.enterpriseInfoPOS: [];
                })
            },

            handleConfirm(name){
              this.brandName = name;
            },

            moreImgUpload(e){
                this.brandImg = e.imageURL
            },

            handleClickBack(){
                this.$router.back()
            },


            handleClickRemoveBrandName(){
                this.brandName = '';
            },

            handleSubmit(){
                const params = {
                    'tbEntQrReportCardBrandMgrPO.brandName': this.brandName,
                    'tbEntQrReportCardBrandMgrPO.brandImg': this.brandImg,
                    'tbEntQrReportCardBrandMgrPO.sequence': this.sequence,
                    'tbEntQrReportCardBrandMgrPO.brands': this.brands.join(','),
                    'tbEntQrReportCardBrandMgrPO.isDisplay': this.isDisplay,
                    'tbEntQrReportCardBrandMgrPO.brandsDisplay': this.brandsDisplay,
                }
                if(this.id){
                    const form = Object.assign({}, params, {'tbEntQrReportCardBrandMgrPO.id': this.id});
                    ajaxUpdateBrand(form).then((data)=>{
                        data && this.$router.back()
                    })
                }else{
                    ajaxAddBrand(params).then((data)=>{
                        data && this.$router.back()
                    })
                }

            },

            initCompaniesAndBrands(hasCompany){
                getCompany().then(data=>{
                    this.companyOptions = (data && data.enterpriseInfoPOS) ? data.enterpriseInfoPOS: [];
                    hasCompany && this.fetchBrands();
                })
            },


        },
        watch: {
          $route() {
            // console.log('watch',this.$route.query)
            // this.id = this.$route.query.id || ''
            if (this.$route.name==='addCompeting') {
              this.$router.go(0)
            }
          }
        },
        created() {
          const {brandImg, brandName, id, sequence=0, isDisplay, brands, brandsDisplay} = this.$route.query;
          if(id){
               this.$nextTick(()=>{ // fix 组件created时没有初始化 只在watch时设置
                   if(brandImg){
                       this.picOption.imageObj = {
                           imageURL:brandImg,
                           fileName:'',
                       }
                   }
              })
              this.brandName = brandName;
              this.id = id;
              this.brandImg = brandImg;
              this.sequence = sequence;
              this.brands = brands.split(',');
              this.isDisplay = isDisplay;
              this.brandsDisplay = brandsDisplay
          }
          this.initCompaniesAndBrands(this.brandName)
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
      max-width: 120px;
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
      margin-bottom: 20px;
      .form__item__label{
        flex-basis: 120px;
        text-align: right;
        height: 32px;
        line-height: 32px;
      }
      .form__item__value{
        padding-left: 10px;
      }
    }

    /deep/{
      .el-select .el-input__inner:focus{
        border-color: #C31725;
      }
      .el-input.is-active .el-input__inner, .el-input__inner:focus{
        border-color: #C31725;
      }
      .el-select .el-input.is-focus .el-input__inner{
          border-color: #C31725;
      }
      .el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled), .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled){
        border-color: #C31725;
      }
    }
  }
</style>
<style lang="scss">
  .chery{
    .el-select-dropdown__item.selected{
      color: #C31725;
    }
    &.el-select-dropdown.is-multiple .el-select-dropdown__item.selected{
      color: #C31725;
    }
  }
</style>
