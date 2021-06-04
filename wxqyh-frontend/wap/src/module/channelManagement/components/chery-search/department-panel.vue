<template>
  <div class="department-panel">
    <div class="department-panel__header">
      <span>请选择</span>
      <i class="qw-icon-close"
         @click="handleClickCloseBtn"></i>
    </div>
    <div class="department-panel__content">
      <qw-cascader-panel ref="cascade-panel"
                         :value="value"
                         :options="departmentCascadePanelOptions"
                         :props="departmentCascadePanelProps"
                         @change="handleDepartmentChange" />
    </div>
    <div class="department-panel__footer">
      <qw-button-group>
        <qw-button @click="handleReset">
          重置
        </qw-button>
        <qw-button type="primary"
                   @click="handleConfirm">
          确定
        </qw-button>
      </qw-button-group>
    </div>
  </div>
</template>

<script>
    import {searchDepatmentList} from "@/module/channelManagement/api/getData";

    export default {
        name: "department-panel",
        components: {},
        data() {
            return {
                selectedDepartmentValue: [],
                departmentCascadePanelOptions: [],
                // departmentId: '',
                // departmentName: '',
                departmentCascadePanelProps: {
                    checkStrictly: true,
                    multiple: false,
                    lazy: true,
                    lazyLoad(node, resolve) {
                        const { level, value } = node
                        searchDepatmentList({ id: value }).then(data => {
                            const nodes = data.departmentList.map(item => {
                                return {
                                    value: item.id,
                                    label: item.name,
                                    leaf: level >= 2
                                }
                            })
                            resolve(nodes)
                        })
                    }
                },
            }
        },
        model:{
            prop: 'value',
            event: 'change'
        },
        props: {
            value:{
                type: Array,
                required: true,
            }
        },
        methods: {
            handleDepartmentChange(val, text) {
                const departmentId = val && val.length ? val[val.length - 1] : ''
                const departmentName = text && text.length ? text[text.length - 1] : '全国'
                this.departmentId = departmentId
                this.departmentName = departmentName
                this.selectedDepartmentValue = val;
            },

            handleConfirm() {
                this.$emit('change', this.selectedDepartmentValue);
                this.$emit('confirm', {
                    departmentName: this.departmentName,
                    selectedDepartmentValue: this.value,
                    departmentId: this.departmentId,
                })
            },

            handleReset() {
                this.$emit('change', []);
                this.$refs['cascade-panel'].handleClear();
                this.departmentName = '全国'
                this.departmentId = ''
                this.$emit('reset', {
                    departmentName: this.departmentName,
                    selectedDepartmentValue: this.value,
                })
            },

            handleCloseDepartmentPanel() {
                this.$emit('close')

            },

            handleClickCloseBtn(){
                this.$emit('close')
            }
        },
        created() {

        }
    }
</script>

<style scoped lang="scss">
  .department-panel{
    .department-panel__header {
      height: 20px;
      padding: 10px 15px;
      font-size: 16px;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 8px solid #f5f5f5;
    }

    /deep/ {
      .qw-popup__content {
        width: 100%;
      }
    }

    .department-panel__container {
      width: 100%;
      height: 100%;
      background: #ffffff;
      position: relative;
    }

    .department-panel__content{
      position: absolute;
      left: 0;
      right: 0;
      top: 48px;
      bottom: 60px;
      overflow-y: auto;
    }

    .department-panel__footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 15px;
        padding-right: 15px;
        @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
          border-bottom: 34px solid #ffffff;
        }
        @media screen and (min-width: 1024px){
          width: 740px;
          margin: auto;
        }
        &::before {
           content: '';
           position: absolute;
           height: 1px;
           top: 0;
           left: 0;
           right: 0;
           background: rgba(230, 230, 230, 1);
           display: block;
           transform: scaleY(0.5);
           z-index: 10;
        }
    }
  }
</style>
