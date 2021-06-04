<template>
  <div>
    <table>
        <tr>
          <th>岗位</th>
          <th>姓名</th>
          <th>性别</th>
          <th>电话</th>
          <th>邮箱</th>
          <th>婚姻状况</th>
          <th>学历</th>
        </tr>
        <tr v-for="(item,index) in columns"
            :key="index">
          <td>{{item.position || '-'}}</td>
          <td><a href="javascript:;"
                 @click="openPersonDes('normal',item.id)">{{item.personName || '-'}}</a></td>
          <td>{{item.sexDesc || '-'}}</td>
          <td>{{item.mobile || '-'}}</td>
          <td>{{item.email || '-'}}</td>
          <td>{{item.maritalStatus===1?item.maritalStatus="已婚":item.maritalStatus="未婚"}}</td>
          <td>{{item.educationBackground || '-'}}</td>
        </tr>
        <tr v-if="columns && columns.length===0"><td colspan="7">暂无数据</td></tr>
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
        ajaxGetPersonInfoDetail
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
                    id: id
                }
                ajaxGetPersonInfoDetail(params, data => {
                    if(data && data.po) {
                        this.personInfoDeatilData = data.po
                    }
                })
            }
        },
        components: {
            incumbentsPop
        }
    }
</script>
