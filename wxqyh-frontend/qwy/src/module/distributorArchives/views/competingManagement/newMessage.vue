<template>
  <div class="competing-management">

    <div class="qwui-nav_wrap">
      <div class="wrap__left">
        <qwuiButton @click="handleClickBack" type="button" >&nbsp;返回&nbsp;</qwuiButton>
      </div>

      <div class="wrap__right">
                <el-input v-model="brandName" placeholder="搜索企业名称、品牌名称"></el-input>
                <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
    </div>

    <div class="qwui-title_wrap">
      <div class="qwui-title">企业信息更新</div>
    </div>

    <div class="competing">
      <dataTable :headData="headData" :dataList="tableData"> </dataTable>
    </div>

    <page :pageData="pageParams" @change="handleChangePage"></page>

  </div>
</template>

<script>
    import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
    import page from '@/components/list/page.vue'
    import dataTable from '@/components/Table/dataTable.vue'
    import {batchUpdate, ajaxPlanEnterprise} from "../../api/getData";

    export default {
        name: "newMessage",
        components: {
            qwuiButton,
            page,
            dataTable,
        },
        data() {
            return {
                tableData:[],
                isRead: false,
                pageParams: {
                    page: 1,
                    pageSize: 10,
                    maxPage: 1,
                    totalRows: ''
                },
                ids: '',
                brandName: '', // 搜索
                isVisibleDialog: false,

                headData: {
                    // left: {
                      // id: "id",
                      // checkFunc: (isSelectedAll, list) => {
                      //   let arr = [];
                      //   list.forEach(function(item) {
                      //     if (item.isChecked) {
                      //       arr.push(item.id);
                      //     }
                      //   });
                      //   this.ids = arr.join(",");
                      //   console.log(this.ids);
                      // }
                    // },

                    middle: [
                        {
                            title: '企业名称',
                            key: 'company',
                            textAlign: 'center',
                        },
                        {
                            title: '品牌',
                            key: 'brand',
                            textAlign: 'center',
                        },
                        {
                            title: '类型',
                            key: 'upStatus',
                            textAlign: 'center',
                        },
                        {
                            title: '更新日期',
                            key: 'updateTime',
                            textAlign: 'center',
                        },
                    ],
                    right: {
                        // isShowOperate: true,
                        // width: 100
                    }
                },
            }
        },
        props: {},
        methods: {

            // //
            // handleClickExportDialog(){
            //     this.isVisibleDialog = true;
            // },

            handleSearch(){
                this.tableData = [];
                this.pageParams.page = 1;
                this.searchBrand();
            },

            // moreImgUpload(e){
            //     console.log(e.imageObj);
            // },

            handleClickBack(){
                this.$router.back()
            },

            // handleClickAddBtn(){
            //     // this.isVisibleDialog= true;
            //     this.$router.push({
            //       name: 'addCompeting'
            //     })
            // },

            // handleClickRemoveBtn(id){
            //     ajaxBatchDelete({ids:[id]}).then((data)=>{
            //         if(data){
            //             // _.alert('提示', '删除成功')
            //             this.searchBrand();
            //         }
            //     })
            // },

            // handleClickEditBtn(item){
            //     this.$router.push({
            //         name: 'addCompeting',
            //         query: {
            //             id: item.id,
            //             brandName: item.brandName || '',
            //             brandImg: item.brandImg || '',
            //             sequence: item.sequence || 0,
            //             brands: item.brands,
            //             isDisplay: String(item.isDisplay),
            //             brandsDisplay: String(item.brandsDisplay),
            //         },
            //     })
            // },

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

            setRead() {
              batchUpdate().then(res=>{
                this.isRead = true
              })
            },

            // handleInputKeyword(keyword){
            //   console.log(keyword)
            // },

            // handleCheckedProductsChange(){

            // },
            formatType(status) {
              const typeMap = {
                '0': '默认',
                '1': '新增',
                '2': '更新',
                '3': '删除'
              }
              return typeMap[status]
            },
            searchBrand(){
                const self = this;
                const params = {
                    page: this.pageParams.page,
                    pageSize: this.pageParams.pageSize,
                    'keyWord': this.brandName,
                }
                ajaxPlanEnterprise(params).then(res=>{
                  if (res) {
                    console.log(res)
                    this.pageParams.totalRows = res.totalRows;
                    this.pageParams.maxPage = res.maxPage;
                    const pageData = res.pageData || []
                    this.tableData = pageData
                    // this.tableData = pageData.map(item=>{
                    //   let type = this.formatType(item.upStatus)
                    //   return {
                    //     ...item,
                    //     type: type
                    //   }
                    // })
                    if (!self.isRead) {
                      this.setRead()
                    }
                  }
                })
                // ajaxSearchBrand(params).then((data)=>{
                //     if(data){
                //         this.pageParams.totalRows = data.totalRows;
                //         this.pageParams.maxPage = data.maxPage;
                //         const pageData = data.pageData || []
                //         this.tableData = pageData.map((item)=>{
                //             return Object.assign({}, item, {
                //                 isDisplayDesc: String(item.isDisplay) === '1'? '是': '否',
                //                 brandsDisplayDesc: String(item.brandsDisplay) === '1'? '是': '否',
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

            // handleCloseDialog(){
            //     this.searchBrand()
            // },

            getImage(path){
                return path? (_.fileDownURL + path) : null;
            },

            handleChangePage(page, pageSize) {
                this.pageParams.page = page
                this.pageParams.pageSize = pageSize
                this.searchBrand()
            },
        },
        // activated() {
        //     this.searchBrand()
        // },
        created() {
          this.searchBrand()
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
      // &:hover {
      //   background: #f7f7f7;
      // }
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
      width: 969px;
    }

    .table-header{
      background:  #d5d5d5;
    }

    .dialog__content__search{
      border-bottom: 1px solid #cfcfcf;
      padding-bottom: 15px;
    }

    .competing{
      /deep/{
        table{
          td{
            padding: initial;
          }
        }
      }
    }

    .qwui-nav_wrap{
      padding-top: 14px;
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


  }
</style>
