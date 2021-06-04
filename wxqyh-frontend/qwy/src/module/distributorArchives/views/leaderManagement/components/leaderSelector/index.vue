<template>
  <div class="brand-select">

    <qwuiButton @click="handleClickOpenBtn" type="button" >&nbsp;选择大区负责人&nbsp;</qwuiButton>

    <el-dialog
            :title="id?'编辑':'新增'"
            :visible.sync="isVisibleDialog"
            width="400px">
      <div class="dialog__content">

        <div class="dialog__content__search">
          <el-input v-model="keyword" size="small" @input="handleInputKeyword" placeholder="请输入内容"></el-input>
        </div>

        <div class="dialog__content__options">
          <div v-for="(item) in getFilteredOptions" :key="item.wxUserId" class="products__item" :class="{active: selectedUserId === item.wxUserId}">
            <label>
              <span>{{item.personName}}</span>
              <span> <input type="radio" v-model="selectedUserId" :value="item.wxUserId"></span>
            </label>
          </div>
        </div>

      </div>

      <div slot="footer">
        <div class="footer">
          <qwuiButton @click="handleConfirm" type="button">&nbsp;确定&nbsp;</qwuiButton>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
    import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
    import {searchUserInfoByServiceErp} from "module/distributorArchives/api/getData";
    import debounce from '@/module/distributorArchives/utils/debounce'

    const fetchUsers = debounce(function () {
        this.searchUsers()
    }, 700)

    export default {
        name: "leaderSelector",
        components:{
            qwuiButton
        },
        data() {
            return {
                isVisibleDialog: false,
                keyword: '',
                selectedUserId: '',
                options: []
            }
        },
        model:{
            prop: 'wxUserId',
            event: 'confirmUsers'
        },
        props: {
            erpSerNo: {
                type:String,
                default(){
                    return '';
                }
            },
            id:{
                type:String,
                default(){
                    return '';
                }
            },
            serviceErp:{
                type:String,
                default(){
                    return '';
                }
            },
            wxUserId:{
                type:String,
                default(){
                    return '';
                }
            }
        },
        computed:{
            getFilteredOptions(){
                return this.options;
            },
        },
        methods: {

            handleInputKeyword(){
                fetchUsers.call(this);
            },

            handleClickOpenBtn(){
                this.isVisibleDialog = true;
                this.searchUsers()
            },

            searchUsers(){
                return searchUserInfoByServiceErp({
                    keyWord: this.keyword,
                }).then((data)=>{
                    this.options = data || [];
                    return this.options;
                })
            },

            handleConfirm(){
                this.isVisibleDialog = false;
                const item = this.options.find(item=>item.wxUserId === this.selectedUserId);
                if(item){
                    this.$emit('confirmUsers', this.selectedUserId);
                    this.$emit('confirm', item);
                }
            },

            init(){
                this.searchUsers().then((options)=>{
                    const option = options.find(item=> item.wxUserId === this.wxUserId);
                    if(option){
                        this.selectedUserId = option.wxUserId || '';
                        this.$emit('confirmUsers', option.selectedUserId);
                        this.$emit('confirm', option);
                    }else{
                        this.selectedErpSerNo = '';
                    }
                })
            }

        },
        created() {
            this.init();
        },
        watch:{
            wxUserId: 'init'
        }
    }
</script>

<style scoped lang="scss">

  .brand-select{
    display: inline-block;

    input.btn {
      padding: 4px 20px;
    }
    a.btn {
      padding: 4px 16px;
      line-height: 22px;
    }


    input[type=radio]:checked:before {
      content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY0NEIyOTI4Q0UzODExRTY4QkZGQzE4NTY5RTc4NTdCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY0NEIyOTI5Q0UzODExRTY4QkZGQzE4NTY5RTc4NTdCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjQ0QjI5MjZDRTM4MTFFNjhCRkZDMTg1NjlFNzg1N0IiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjQ0QjI5MjdDRTM4MTFFNjhCRkZDMTg1NjlFNzg1N0IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5gVtERAAABqElEQVR42pxTv0/CYBC94g9wKGWCpSSGRaLOuhuiJG74L2A0Ohgc3V11NET4E3Ay8UeIsyaMamJMMKadmGiZIFF8r/2AWsDBS156vbv3+n3XO63RaEjIloEikAcyKvYB3AAV4DVYPBvwF4BzYNc0zYhhGBKNRr1Et9vNOo6TtW37CK8XwDHQCwrMA9epVGoD5PCJJBaLeUA+YlnWYavVWkJ4myIRVXOWTCYnksOWTqcFtTl1WqHACrD/i+y8i9ztiFQNH/QZU6Zq98ilQBGqM5qm+dn2m0htTaR5hQO6PugzxhyMteSQS4F8PB4fff3pBF1rj5+dMeaUKU6eAplBtz2z7qc3wK4PXcXJUKDX7/flv0aBT/znQJs3p1ebudGNfE6TAvVOpzMqWj/F+RLjZMaYU+a6Lh+3FKhgOL6G10hkRQqPuF1BZE73QZ8x5mCsJQdulZP4DJQxpgccEl8Eg7ZVm95L2+ajTO5gEksYzweV+NPwZUEtf0fJm4nANg6XCSeJ6Lru/SoODRvGO4P8HV4mbcI6r6p1ZssX1aI12TDgEngJFv8IMAA8sJVFhpu/EwAAAABJRU5ErkJggg==);
      display: block;
    }
    input[type=radio]:before {
      content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZDMzg0RTAyQ0UzODExRTY5M0I2RDI3NEQ5QjYwQTJBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZDMzg0RTAzQ0UzODExRTY5M0I2RDI3NEQ5QjYwQTJBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkMzODRFMDBDRTM4MTFFNjkzQjZEMjc0RDlCNjBBMkEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkMzODRFMDFDRTM4MTFFNjkzQjZEMjc0RDlCNjBBMkEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6N09KkAAABN0lEQVR42pxTsWrCUBR9SUuTLWOWZKjgoP6FdFD6Gxbbqfgjdhb1MwQH6Q9klY5SSZaMyVISsOk54aa8BouJFw4mvnMON/edawRBoGrVBybAGLiX/w7AFlgBHzr5Vnu+A+bAi+/7puM4yrKs8iDLsl6SJL0wDF/xugRmwJduQPHGdd0HiOsdKdu2S+DchMk0juOudJibwnn7T1wvcsAdSreKBgNg6nmealrCfaaWBhO43hiG0diAXGqopcGIA2tbohnRoFNNu02JpmOqK6soClXdwgH33NpANEcabBGS1gZpmvJnR4M1wnGSlhq3Tw2jTYM9sIiiqLGBcBfUVkOcIZ47uF4UkwPuu+zD7y7kwCMO5sCfZWK7HBi/GeJvbZnyMlRn1pnRfmJIeM9C/OTAZJ33OvlHgAEAVf54p8JqSf4AAAAASUVORK5CYII=);
      display: block;
    }
    input[type=radio]:checked:disabled:before {
      content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRFNTYzMzIxRDhBMDExRTY4QzY1Rjk1QkZGNDRGMTIzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRFNTYzMzIyRDhBMDExRTY4QzY1Rjk1QkZGNDRGMTIzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REU1NjMzMUZEOEEwMTFFNjhDNjVGOTVCRkY0NEYxMjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REU1NjMzMjBEOEEwMTFFNjhDNjVGOTVCRkY0NEYxMjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz67w470AAABiUlEQVR42pxTwUoCURS9M2mgMIi4cyEktLD+IloY9RmG1Sb8kVpFSPYZgQvpC1xKy6HciwyCA6POdM7rPnlM2qILB9/cc86d6313vPF4LLk4ATrABXCkuRAYAgPgwxUXnPMh8ADc1mo1v1wuS6HwQ6/X69ZyuWzNZrN7PL4APSB2C9D8VqlUzmHOdyTFYlHAET6KdKMoOtYOE181j/vM+aAG2jPt1nRwCnRdcxzHMp/PZbFYmOcgCKRarUqpVNoWQRc3OD6zgw4SB655Op1SIGmaGvDMHDmnE3o6LNDmwGzwzTTlgzlyNtTTZoGmnTbDtr0rXE49TV/+GVmWib2FEPe8JTiwfeFy6vligSGWZEtw2r7/uzHmyLnDRoyofMVybCzBq2o0GmZxPM8zRp6Zs9fIUM+Ak5gAfSTu7C5QSNTr9Z1/BVr+9Om1vfZw1yMl/gxqoH3X70FsgQS4BPEUhmHKxVmtVmbSRJIkZpmU45uv1CPejs+Zq33NJeE9q/CTA9PPeeKKvwUYAL+/tVx93BxCAAAAAElFTkSuQmCC);
      display: block;
    }
    input[type=radio]:disabled:before {
      content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUyQkYwNURERDhBMDExRTY4RjJDQ0I1N0FEOEU2REY3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUyQkYwNURFRDhBMDExRTY4RjJDQ0I1N0FEOEU2REY3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTJCRjA1REJEOEEwMTFFNjhGMkNDQjU3QUQ4RTZERjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTJCRjA1RENEOEEwMTFFNjhGMkNDQjU3QUQ4RTZERjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz472FXeAAABIUlEQVR42pxTTWqDYBR8MdKFLlzoBZple4uSRXIPS9NlLtKuQ9NjBLIIuYDbkGVI9gq6UYi2diY84aMkxa8Dg3zPN+Pn+xkkSSK/8ADG4BS819gBXINLcG8mDwyDO/ANfA3D0PF9X1zXvbyo61rKspQsy75x/ADnYGUaULwKgmAcRZH8BZhInudbveHZ0fh7HzGB2wlyn/S2QoNH8KWPuIPmzqilQYzAUCyhmpgGE8/zbPWimgkNRl21baCakSP/RNu20nXh0DSNtYFqTjRYc0hsUVWXOdrQ4DNN0y9bA9UsabADFwjYiPlYUNsVcV4UxaaPCUcZuVvdh+vLhCFx2Ge2itVmwfjP+MDNZTLB0X7mkLDPbBV4ZMF0nXdm8o8AAwD1OXMBh1w0yAAAAABJRU5ErkJggg==);
      display: block;
    }
    input[type=radio],input[type=checkbox]{
      outline: 0;
      -webkit-appearance: none;
      appearance: none;
      line-height: 1;
    }


    /deep/{
      .el-dialog__footer,
      .el-dialog__header{
        background: #efefef;
        padding: 10px 20px 10px;
      }
      .el-dialog__body{
        background: rgba(239,239,239, 0.4);
        padding: 0px;
        .el-input__inner:focus{
          border: 1px solid #C31725;
        }
      }
      .el-dialog__headerbtn{
        top: 10px;
      }

      .el-radio__inner:after{
        background: #C31725;
        width: 8px;
        height: 8px;
      }
      .el-radio__inner {
        width: 20px;
        height: 20px;
      }
      .el-radio__inner:hover{
        border-color: #C31725;
      }
      .el-radio__input.is-checked{
        .el-radio__inner {
          border-color: #C31725;
          background: #ffffff;
        }
      }
      .el-radio__input.is-checked+.el-radio__label{
        border-color: #C31725;
      }

      .products__item{
        display: flex;
        justify-content: space-between;
      }

      .qwui-upload_item{
        width: 100%;
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
