<template>
  <div class="read-person">
    <div class="qwui-title_wrap">
      <div class="qwui-title">已读人员情况</div>
    </div>
    <div class="qwui-nav_wrap">
      <div class="wrap__left">
        <qwuiButton type="button" @click="handleClickBack">&nbsp;返回&nbsp;</qwuiButton>
      </div>
      <div class="wrap__right">
        <el-input v-model="keyWord" placeholder="搜索人员"></el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
    </div>
    <div class="read">
      <dataTable :headData="headData" :dataList="tableData"> </dataTable>
    </div>
    <page :pageData="pageParams" @change="handleChangePage"></page>
  </div>
</template>

<script>
    import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
    import page from '@/components/list/page.vue'
    import dataTable from '@/components/Table/dataTable.vue'
    import {searchSalesreportReadPage} from '../../../api/getData.js'

    export default {
        name: "readPerson",
        components: {
            page,
            dataTable,
            qwuiButton,
        },
        data() {
            return {
                tableData:[

                ],

                pageParams: {
                    page: 1,
                    pageSize: 10,
                    maxPage: 1,
                    totalRows: 0
                },

                headData: {
                    // left: {
                    //     id: "id",
                    //     checkFunc: (isSelectedAll, list) => {
                    //         const ids = list.filter(item=>item.isChecked).map(item=>item.id);
                    //         this.ids = ids;
                    //     }
                    // },
                    middle: [
                        {
                            title: '姓名',
                            key: 'personName',
                            textAlign: 'center',
                        },
                        {
                            title: '账号',
                            key: 'wxUserId',
                            textAlign: 'center',
                        },
                        {
                            title: '手机号码',
                            key: 'mobile',
                            textAlign: 'center',
                        },
                        {
                            title: '部门',
                            key: 'deptId',
                            textAlign: 'center',
                        },
                        {
                            title: '阅读时间',
                            key: 'createTime',
                            textAlign: 'center',
                        },
                    ],
                    right: {
                        // isShowOperate: true,
                        // width: 100
                    }
                },

                keyWord: '',
            }
        },
        props: {
          readId: {
            type: String,
            default() {
              return ''
            }
          }
        },
        watch: {
          readId() {
            this.tableData = []
            this.init()
          }
        },
        methods: {
            handleClickBack(){
                this.$emit('clickBack')
            },

            headerCellStyle(){
                return {
                    background: '#f5f5f5'
                }
            },
            cellStyle(){
                return {
                    padding: '6px 0'
                }
            },

            init(){
                const self = this;
                const params = {
                    page: this.pageParams.page,
                    pageSize: this.pageParams.pageSize,
                    'searchValue.keyword': this.keyWord,
                    'searchValue.id': this.readId
                }
                searchSalesreportReadPage(params).then(res=>{
                  console.log(res)
                  if(res) {
                    this.pageParams.totalRows = res.totalRows;
                    this.pageParams.maxPage = res.maxPage;
                    if (res.pageData) {
                      this.tableData = res.pageData || []
                    }
                    this.pageParams.page = res && res.currPage ? res.currPage : 1;
                  }
                })
                // operatingAuthorityApi.ajaxSearchDealerCelebrityModels(params).then((data)=>{
                //     if(data){
                //         this.pageParams.totalRows = data.totalRows;
                //         this.pageParams.maxPage = data.maxPage;
                //         this.tableData = data.pageData.map((item)=>{
                //             return Object.assign({}, item, {
                //                 operationList: [
                //                     {
                //                         text: '删除',
                //                         operationFunc: detail => {
                //                             self.handleClickRemoveBtn(item.id)
                //                         }
                //                     },
                //                     {
                //                         text: '编辑',
                //                         operationFunc: detail => {
                //                             self.handleClickEditBtn(item)
                //                         }
                //                     }
                //                 ]
                //             })
                //         })
                //     }else {
                //         this.tableData = [];
                //     }


                //     this.page = data && data.currPage ? data.currPage : 1;
                // })
            },

            handleChangePage(page, pageSize) {
                this.tableData = [];
                this.init()
            },

            handleSearch(){
                this.tableData = [];
                this.pageParams.page = 1;
                this.init();
            },

        },
        created() {
            // this.init()
        }
    }
</script>

<style scoped lang="scss">
  .read-person{
    border-radius: 3px;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 10px 30px 0;
    width: 969px;
    height: 800px;
    overflow-y: auto;
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
      margin: 20px 0;
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

    // position: relative;
    // border: 1px #ccc solid;
    // background-color: #fff;relative
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

    .read{
      width: 969px;
    }

    .table-header{
      background:  #d5d5d5;
    }

    .dialog__content__search{
      border-bottom: 1px solid #cfcfcf;
      padding-bottom: 15px;
    }

    .read{
      /deep/{
        table{
          td{
            padding: initial;
          }
        }
      }
    }

    .qwui-nav_wrap{
      // padding-top: 14px;
      display: flex;
      justify-items: center;
      justify-content: space-between;
    }

    .wrap__right{
      display: flex;
      flex-shrink: 0;
      width: 280px;
      justify-content: space-between;
      /deep/{

        .datepicker > input {
          margin-top: -3px;
          height: 32px;
        }
        .el-table th.is-leaf{
          background: #e7e8e9;
          color: #000;
        }
        .el-select {
          margin: 0 5px;
          width: 120px;
          .el-input.is-focus{
            .el-input__inner{
              border-color: #ccc;
            }
          }
          .el-input__inner:focus{
            border-color: #ccc;
          }

          .el-input__inner{
            height: 32px;
            line-height: 32px;
          }
          .el-input__icon{
            line-height: 32px;
          }
        }
        .el-input{
          .el-input__inner{
            line-height: 32px;
            height: 32px;
          }
          .el-input__icon{
            line-height: 32px;
          }
          &.is-active .el-input__inner, .el-input__inner:focus{
            border-color: #ccc;
          }
        }
        .el-input--prefix .el-input__inner{
          padding-left: 39px;
        }
        .el-date-editor--month{
          .el-input__inner{
            padding-left: 43px;
          }
        }
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
          width: 130px;
        }

        .el-button{
          line-height: 32px;
          height: 32px;
          padding-top: 0;
          padding-bottom: 0;
        }

        .el-button.el-button--primary {
          color: #fff;
          background-color: #c31725;
          border-color: #c31725;
          margin-left: 6px;
          &:hover{
            background: #F08088;
            border-color: #F08088;
          }
        }
      }
    }




    .dialog__content__search{
      padding: 20px ;
      border-bottom: 1px solid #dcdfe6;
    }

    .dialog__content__options {
      height: 300px;
      overflow: auto;
    }

    .products{

    }

    .products__item{
      padding: 5px 12px 5px 20px;
      box-sizing: border-box;
      overflow: hidden;
      cursor: pointer;
      &.active {
        background-color: #eee;
      }
      label{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .footer{
      text-align: center;
    }
  }
</style>
<style lang="scss">
  .read-person{
    .el-dialog__wrapper{
      /*z-index: 100 !important;*/
    }
  }
  #msgBoxs ._mask{
    z-index: 2500 !important;
  }
  #msgBoxs ._alert_mask{
    z-index: 2500 !important;
  }
</style>
