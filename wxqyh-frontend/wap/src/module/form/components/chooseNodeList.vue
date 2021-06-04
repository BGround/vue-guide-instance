<template>
  <div>
    <div class="selectBox" v-if="!isShowNodeBox">
      <div class="selectBoxContent">
        <p class="chooseNodeListUI-title" v-show="chooseNextNodeShow">选择下一步处理节点</p>
        <div class="selectNodeBox" @click="showNodeBox" v-show="chooseNextNodeShow">
          {{choosedNodeName}}
          <i class="qwui-click_icon_right"></i>
        </div>
        <!--选择处理人-->
        <div v-if="FlowAuditUser.length">
          <user_selected_group
            class="chooseNodeListUI"
            v-if="item && item.startAuditList.show"
            v-for="(item,index) in FlowAuditUser"
            :key="index"
            :title="startAuditTitle(item.nodeName)"
            :personNumber="item.startAuditList.userSelected && item.startAuditList.userSelected.length"
            :mustChoose="true">
            <user_selected_item
              v-if="flowNodeItemKeysShow(index)"
              slot="user_selected_item"
              :isEdit="item.startAuditList.isCanEdit"
              :List="item.startAuditList.userSelected"
							:title="startAuditTitle(item.nodeName)"
							@showPersonList="showPersonList"
							@showUserSelectedBox="FlowAuditUserShowBox(index)"
							@removeSelected="(payload)=>removeFlowAuditUser({delUserIndex:payload.index,index})"
              :isRemove="FlowAuditUser
                        && FlowAuditUser[index]
                        && FlowAuditUser[index].startAuditList.isCanEdit
                        && FlowAuditUser[index].startAuditList.isCanDelete">
            </user_selected_item>
            <div class="qwui-user_cell_title" slot="qwui-user_select_person_open"
              v-show="item.startAuditList.flowNodeItemKeys&&item.startAuditList.allUser.length===0">
              <p class="qwui-user_flowNodeItemKeys">已关联[{{isItemKeys(item.startAuditList.flowNodeItemKeys)}}]字段，请先填写</p>
            </div>
          </user_selected_group>
        </div>
        <!--选择其它处理人-->
        <user_selected_group
          :title="'['+item.nodeName+']处理人'"
          :personNumber="flowChioseNodeAuditUser[index] && flowChioseNodeAuditUser[index].length"
          v-for="(item,index) in appointNodeAndUserVOList"
          :key="item.index"
          class="chooseNodeListUI" :mustChoose="true">
          <user_selected_item
            slot="user_selected_item"
            :List="flowChioseNodeAuditUser[index]"
						:title="'['+item.nodeName+']处理人'"
						@showPersonList="showPersonList"
						@showUserSelectedBox="otherAuditUserShowBox(index)"
						ref="item.nodeId"
            @removeSelected="(payload)=>{removeChioseNodeUser({parentIndex:index,index:payload.index})}">
          </user_selected_item>
        </user_selected_group>
      </div>
      <button_group :fixed="true">
        <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
        <qwui_button type="primary" text="确定" @buttonClick="saveNodeAuditUser"></qwui_button>
      </button_group>
    </div>
    <chooseNextNode v-show="isShowNodeBox"></chooseNextNode>
  </div>
</template>

<script>
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import chooseNextNode from '../components/chooseNextNode'
  import {qwui_button, button_group} from '@/components/base/button'
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'
  import audit_flow_api from '@/components/flow/api/getData'
  import {scroll_height} from '../js/validation'
  export default {
    components: {
      button_group,
      qwui_button,
      user_selected_item,
      user_selected_group,
      user_selected_ranglist,
      chooseNextNode
    },
    name: "choose-node-list",
    props: {
    },
    data() {
      return {
        dataBase,
        parallelNextNodeIds:''
      }
    },
    computed: {
      ...mapState({
        appointNodeAndUserVOList: state => state.userSelected.appointNodeAndUserVOList,
        flowChioseNodeAuditUser: state => state.userSelected.flowChioseNodeAuditUser,
        nextNodeList: state => state.userSelected.nextNodeList,
        FlowAuditUser: state => state.userSelected.FlowAuditUser,    // 处理人信息
        choosedNodeName: state => state.userSelected.choosedNodeName,
        isShowNodeBox: state => state.userSelected.isShowNodeBox, // 显示选择下一节点弹窗
      }),
      // 节点选择弹窗显示。新增/审批
      chooseNextNodeShow() {
        return this.nextNodeList.length>0 // 修复最后一个节点没有处理人显示空白
      },
    },
    methods: {
      ...mapMutations([
        "removeFlowAuditUser",   // 删除处理人
        "removeChioseNodeUser",
        "saveNodeAuditUserJson",
        "updateUserSelectedData",//更新vuex状态数据
      ]),
      ...mapActions([
        "updateFlowUserSelected",     // 更新已选处理人
        "updateAppointNodeVOList",    // 更新节点列表
        "updateNextNodeList",         // 更新下个节点列表
      ]),
      // 人员控件关联下一步处理人组件显示
      flowNodeItemKeysShow(index) {
        if (this.FlowAuditUser.length != 0 && this.FlowAuditUser[index].startAuditList.flowNodeItemKeys) {
          if (this.FlowAuditUser[index].startAuditList.allUser.length === 0) {
            return false
          } else {
            return true
          }
        } else if (this.FlowAuditUser[index].startAuditList) {
          return true;
        } else {
          return false;
        }
      },
			showPersonList (title,list){                                           //显示人员预览弹窗
				this.$emit("showPersonList",title,list,true);
			},
      startAuditTitle:function(nodeName) {
        return nodeName ? '['+nodeName+']处理人' : '处理人'
      },
			// 查询人员控件字段
			isItemKeys(keys){
				var str = '';
				if(keys){
					this.$store.state.formBase.schema.forEach((item) => {
						if(keys.indexOf(item._id) >= 0){
							str += item.label + '，';
						}
					})
				}
				return str.substring(0,str.length-1);
			},
      FlowAuditUserShowBox(index){
        this.$store.commit('updateUserSelectedData',{type:'appointUserIndex',data:index})

        // 如果是指定范围选人
        if(this.FlowAuditUser[index].startAuditList.assignRange) {
          this.$store.commit('updateUserSelectedData',{type:"FlowAuditUserBoxShow", data: true})
        }
      },
      cancelSelected(){
        this.$store.commit("updateUserSelectedData",{type:"nextNodeListShow",data:false})
      },

      // 选择其它节点处理人
      otherAuditUserShowBox(index) {
        let self = this
        let users = this.dataBase.selectConfig.selectList.users
        this.dataBase.selectConfig.signIndex="users"
        this.dataBase.selectConfig.show=true
        users.userSelected.length=0
        if(this.flowChioseNodeAuditUser.length && this.flowChioseNodeAuditUser[index]) {
          users.userSelected.push(...this.flowChioseNodeAuditUser[index])
        }
        users.callBack.confirm=function (type, obj) {
          users.userSelected.length=0
          users.userSelected.push(...obj.user.data);
          self.$store.commit('updateChooiseNodeAuditUser',{
            index: index,
            data: obj.user.data
          })
        }
      },
      isRelevanceFlowNodeItemKeys() {
        // 如果关联了人员控件，且人员控件没有选人，则跳到人员控件字段
        if (this.FlowAuditUser.length) {
          var arr = this.FlowAuditUser;
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].startAuditList.flowNodeItemKeys && arr[j].startAuditList.allUser.length === 0) {
              let incharges = arr[j].startAuditList.userSelected;
              if (!incharges.length) {
                var schema = this.$store.state.formBase.schema, labels = [];
                for (let i = 0; i < schema.length; i++) {
                  if (arr[j].startAuditList.flowNodeItemKeys.indexOf(schema[i]._id) != -1) {
                    labels.push(schema[i].label);
                    schema[i].help = `请填写${schema[i].label}`
                  }
                }
                var ids = arr[j].startAuditList.flowNodeItemKeys.split('|');
                _.tooltips_succeed(`已关联${labels}字段，请先填写`, true, "");
                scroll_height(ids[0]);
                this.updateUserSelectedData({type: "nextNodeListShow", data: false})
                return false
              }
            }else {
              return true;
            }
          }
        }
        return true;
      },
      saveNodeAuditUser() {
        if(!this.isRelevanceFlowNodeItemKeys()) return;
        if (!audit_flow_api.isCheckAuditUser({FlowAuditUser: this.FlowAuditUser})) return
        if (this.appointNodeAndUserVOList.length) {
          if (!audit_flow_api.isCheckAppointNodeAndUser({flowChioseNodeAuditUser: this.flowChioseNodeAuditUser})) return
        }
        this.saveNodeAuditUserJson();
        this.$emit('saveNodeAuditUserJson');
      },
      showNodeBox() {
        this.$store.commit("updateUserSelectedData", {type: 'isShowNodeBox', data: true});
      },
    }
  }
</script>

<style>
  @media screen and (min-width: 1024px) {
    .selectBox{
      width: 740px;
      margin: auto;
    }
  }
  .selectBox {
    position: fixed;
    z-index: 3;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #F7F7F7;
  }
  .selectBoxContent{
    position: absolute;
    top: 0;
    bottom: 60px;
    width: 100%;
    overflow-y: auto;
  }
  .selectBoxContent::-webkit-scrollbar {
    width: 0;
  }
  .chooseNodeListUI .qwui-user_cell_title{
    color: #333;
    font-size: 16px;
  }
  .chooseNodeListUI .qwui-user_select_item{
    background-color: transparent;
  }
  .chooseNodeListUI .qwui-user_select_title:after, .qwui-user_select_charge:after {
    border: 0;
  }
  .chooseNodeListUI .qwui-user_select_list{
    padding: 0px;
  }
  .chooseNodeListUI .qwui-user_select_add {
    margin-bottom: 15px;
  }
  .qwui-user_select_charge_view.chooseNodeListUI{
    background-color: transparent;
  }
  .chooseNodeListUI-title {
    font-size: 16px;
    padding: 15px 15px 10px;
    color: #333;
  }
  .qwui-click_icon_right {
    display: block;
    position: absolute;
    top: 50%;
    right: 15px;
    width: 9px;
    height: 15px;
    background:0 0 url("../../../assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
    transform: translate(0,-50%);
  }
  .selectNodeBox {
    position: relative;
    margin: 0 15px 15px;
    padding: 10px 25px 10px 10px;
    color: #333;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background-color: #fff;
    box-sizing: border-box;
  }
  .selectNodeBox:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    transform: scale(0.5);
    transform-origin: left top;
  }

</style>
