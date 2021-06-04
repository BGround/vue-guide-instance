<template>
  <div>
    <table>
      <tr>
        <th width="10%">变更类别</th>
        <th width="10%">变更时间</th>
        <th width="10%">审批时间</th>
        <th width="10%">变更前岗位</th>
        <th width="10%">变更后岗位</th>
        <th width="12%">变更原因</th>
        <th width="10%">姓名</th>
        <th width="8%">性别</th>
        <th width="10%">入职时间</th>
        <th width="10%">认证级别</th>
      </tr>
      <tr v-for="(item,index) in columns" :key="index">
        <td>{{item.type || '-'}}</td>
        <td>{{item.time || '-'}}</td>
        <td>{{item.auditTime || '-'}}</td>
        <td>{{item.beforePost || '-'}}</td>
        <td>{{item.afterPost || '-'}}</td>
        <td>{{item.reason || '-'}}</td>
        <td><a href="javascript:;"
               @click="openPersonDes('change',item.id)">{{item.name || '-'}}</a></td>
        <td>{{item.sex || '-'}}</td>
        <td>{{item.enterTime || '-'}}</td>
        <td>{{item.level || '-'}}</td>
      </tr>
      <tr v-if="columns && columns.length===0"><td colspan="10">暂无数据</td></tr>
    </table>
    <!-- 人员详情弹框 -->
    <incumbentsPop v-if="pop.isPersonDesShow"
                   @closePersonDes="closePersonDes"
                   :personInfoDeatilData="personInfoDeatilData"
                   :type="pop.personType"></incumbentsPop>
  </div>
</template>

<script>
    import incumbentsPop from './incumbentsPop'
    import {
        ajaxGetPersonInfoDetail,
        ajaxGetPersonChangeById
    } from '../../../../api/getData'
    export default {
        data(){
            return {
                pop: {
                    isPersonDesShow: false,
                    personType: 'change'
                },
                personInfoDeatilData: [] // 在职人员详细信息
            }
        },
        props:{
            columns:{
                type: Array
            }
        },
        methods:{
            // 打开人员详情弹框
            openPersonDes(type, id) {
                if (type) {
                    this.pop.personType = type
                    this.getzzPersonInfoDeatil(id)
                    this.pop.isPersonDesShow = true
                }
            },
            // 关闭人员详情弹框
            closePersonDes() {
                this.pop.isPersonDesShow = false
            },
            // 获取在职人员详细信息
            getzzPersonInfoDeatil(id) {
                let params = {
                    id: id,
                }

                ajaxGetPersonChangeById(params, (data)=>{
                    if(data && data.personChangeUserVo) {
                        this.personInfoDeatilData = data.personChangeUserVo
                    }
                });
                // ajaxGetPersonInfoDetail(params, data => {
                //     if(data && data.po) {
                //         this.personInfoDeatilData = data.po
                //     }
                // })
            }
        },
        components: {
            incumbentsPop
        }
    }
</script>
