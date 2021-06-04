/*@zengjiaying 20180820*/
/*
import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
computed: {
  ...mapState({
    currentIndex: state=>state.formDesign.currentIndex,
    currentType: state=>state.formDesign.currentType,
    currentFieldData: state=>state.formDesign.currentFieldData,
    FieldData: state=>state.formDesign.FieldData,
    FormAjaxData: state=>state.formDesign.FormAjaxData,
  })
},
methods: {
  ...mapMutations([
    "publishCurrentType",
    "publishCurrentField",
    "fieldItemChanged",
    "confirmFieldSetting",
    "changeFormAjaxData",
  ]),
  ...mapActions([
    "moveItemUp"
  ])
}
*/
import {set,unset} from 'lodash'
const DEFAULT = () => {
  return {
  isEditFieldSetting: true,    // 是否编辑字段设置。false: 新增，true: 编辑
  currentIndex: -1,             // 当前选中的 “位置
  currentType: '',              // 当前字段的 “类型
  currentFieldData: null,       // 当前选中的 “字段数据
  FieldData: [],                // 字段数据
  FormAjaxData: {               // 表单设计数据
    id:'',                      // 表单id
    requestSource: 2,           // 应用端请求后台接口
    range: '1',                 // 填单范围。1 所有人，3 特定对象
    deptIds: '',                // 填单范围所选的部门ID
    userIds: '',                // 填单范围所选的人员ID
    status: 1,                  // 是否保存草稿。1 不是，
    formField: [],              // 字段数据
    tbFormDetailsPO:{
      formName: '',             // 表单名称
      content: '',              // 表单描述
      title:'',                 // 表单标题的高级设置
    },
    tbFormControlPO: {
      titleTemplate:'',         // 表单标题的高级设置
      isBuildTitle: 2,          // 表单标题的高级设置
      isUpdaeTitle: 1,          // 1 填单时可以修改标题
      isRelatives: 1,           // 启用相关人
      isDisableRelatives:0,     // 0 提单人可以自由选择负责人
      detailViewLevel:0,        // 明细查看权限。0 不启用
      formPhotoSet: 0,          // 0 允许通过手机相册上传图片
      isCanAt: 1,               // 1 允许@人转发
      canSeeDataReport: 1,      // 在应用端查看表单明细数据报表。1 可以
      submitTime: 0,            // 表单总份数
      actorTime:0,              // 每人可提交的次数
      daySubmitNum:0,           // 每人每天可提交次数
      isFreeFlow: 1,            // 流程类型。1 自由流程，2 固定流程，3 分支流程
      isTask: '',               // 设计单类型。0 普通单，1 任务单， 2 审批单
      typeId: 'other',          // 分组Id
      typeName: '其他',         // 分组名称
      isSendMsg: null           // 发送通知。null 不推送，2 推送
    }
  }
}
}
const state = {
  managerUsers: [],             // 绑定的管理员账号
  formAddPermission: true,      // 创建表单权限
  ...DEFAULT()
}
const mutations = {
  // 是否使用缓存
  setState(state,payload) {
    Object.assign(state,payload,{
      managerUsers:state.managerUsers,
      formAddPermission: state.formAddPermission
    })
  },
  // 取消选择字段
  cancelPublishType(state) {
    // 未添加字段，则无需改变currentFieldData
    if(state.currentIndex==-1) {return}
    state.currentFieldData = Object.assign({}, state.FieldData[state.currentIndex])
    state.currentType = state.currentFieldData._type
    localStorage.setItem('formDesign'+_.userId,JSON.stringify(state))
  },
  // 删除所选字段
  deleteSelectType(state,index) {
    state.FieldData.splice(index, 1)
    state.currentIndex = index-1
    state.currentFieldData = Object.assign({}, state.FieldData[state.currentIndex])
    state.currentType = state.currentFieldData._type
    localStorage.setItem('formDesign'+_.userId,JSON.stringify(state))
  },
  // 点击中间查看字段设置
  publishCurrentField(state, {FieldItem,index} = {}) {
    state.currentIndex=index
    state.currentType=FieldItem._type
    state.currentFieldData = Object.assign({}, FieldItem)
    localStorage.setItem('formDesign'+_.userId,JSON.stringify(state))
  },
  // 修改右边的设置,改变某一项
  fieldItemChanged(state, {schema, model} = {} ) {
    state.FieldData[state.currentIndex][model] = schema
    state.currentFieldData = Object.assign({}, state.FieldData[state.currentIndex])
    localStorage.setItem('formDesign'+_.userId,JSON.stringify(state))
  },
  // 字段设置数据
  selectCurrentType(state,{data,isEdit}) {
    state.currentFieldData = Object.assign({}, data)
    state.isEditFieldSetting = isEdit
    localStorage.setItem('formDesign'+_.userId,JSON.stringify(state))
  },
  // 修改或新增字段设置数据
  confirmFieldSetting(state,payload) {
    // 如果是新增
    if(!state.isEditFieldSetting){
      state.FieldData.push(payload)
      state.currentIndex +=1
    }
    // 如果是编辑
    if(state.isEditFieldSetting) {
      state.FieldData.splice(state.currentIndex, 1, payload)
    }
    localStorage.setItem('formDesign'+_.userId,JSON.stringify(state))
  },
  // 改变表单设计某一项数据。 @key路径，@value值，@setStorage是否缓存
  changeFormAjaxData(state,{key,value,setStorage=true}) {
    set(state.FormAjaxData,key,value)
    if(setStorage) {
      localStorage.setItem('formDesign'+_.userId,JSON.stringify(state))
    }
  },
  // 移除表单设计某一项数据
  removeFormAjaxData(state,{key}) {
    unset(state.FormAjaxData,key)
    localStorage.setItem('formDesign'+_.userId,JSON.stringify(state))
  },
  // 发布
  publishFormDesignData(state) {
    // position 记录排序
    state.FieldData = state.FieldData.map((value, index) => {
      value.position = index+1
      return value
    })
    state.FormAjaxData.formField = JSON.stringify([...state.FieldData])
  },
  // 绑定的管理员账号
  updateManagerUsers(state,payload) {
    state.managerUsers = [...payload]
  },
  // 更新创建表单权限
  updateformAddPermission(state,payload) {
    state.formAddPermission = payload
  }
}

const actions = {
  // 上移或下移
  moveItem({commit,state},{index,replaceIndex}) {
    let currentItem = state.FieldData[index]
    let replaceItem = state.FieldData[replaceIndex]
    if(!currentItem || !replaceItem) {return}
    state.FieldData.splice(index, 1, replaceItem)
    state.FieldData.splice(replaceIndex, 1, currentItem)
    commit('publishCurrentField',{
      FieldItem: currentItem,index:replaceIndex
    })
  },
  isUseCache({commit,state}) {
    const STORAGE = localStorage.getItem('formDesign'+_.userId)
    const STORAGEDATA = JSON.parse(STORAGE)
    if(STORAGE) {
      _.alert('提示','是否需要加载上次编辑内容',{
        primaryBtn:{name:"i18n.confirm", callBack:function () {
            commit('setState',STORAGEDATA)
          }},
        defaultBtn:{name:"i18n.cancel", callBack:function () {
            commit('setState',DEFAULT())
            localStorage.removeItem('formDesign'+_.userId)
          }},
      })
    }else {
      commit('setState',DEFAULT())
    }
  },
}

export default {
  state,
  mutations,
  actions,
}
