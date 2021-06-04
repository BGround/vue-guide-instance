<template>
  <div class="addOrEditProduct">
    <div class="header">
      <div class="normal_btn qw-return_btn"
           @click="goBack"></div>
      <span class="c999">首页 &nbsp;/ &nbsp;企业产品</span>&nbsp;/&nbsp;{{title}}
    </div>
    <div class="content">
      <div class="form-item">
        <label class="title">
          <span class="mustInput">*</span>
          产品名称
        </label>
        <div class="form-field">
          <qwui-input inputType="text"
                      inputTips="请输入"
                      warningTips="标题不能为空"
                      :maxLength="50"
                      isMust
                      v-model="productName"></qwui-input>
        </div>
      </div>
      <div class="form-item">
        <label class="title">
          <span class="mustInput">*</span>
          产品封面
        </label>
        <div class="form-field">
          <add-pic :uploadConfig="picOption"
                   @imageObj="dealUpload">
            <div class="uploadTip"
                 slot="upload_tip_text">建议尺寸900px*450px;支持jpg\jpeg\png;文件大小不能超过2M</div>
            <div class="qwui-cut_out_tip" slot="tip">只支持jpg、jpeg、png，大小不超过2M建议尺寸900 x 450</div>
          </add-pic>
          <input type="file"
                 class="fileInput"
                 id="coverImg">
        </div>
      </div>
      <div class="form-item">
        <label class="title">
          价格
        </label>
        <div class="form-field">
          <input class="moneyInput"
                 type="number"
                 v-model="productPrice"
                 @input="changeMoney('productPrice', $event)">元
        </div>
      </div>
      <div class="form-item">
        <label class="title">
          原价
        </label>
        <div class="form-field">
          <input class="moneyInput"
                 type="number"
                 v-model="productPriceLine"
                 @input="changeMoney('productPriceLine', $event)">元
        </div>
      </div>
      <div class="form-item">
        <label class="title">
          排序号
        </label>
        <div class="form-field">
          <input class="moneyInput"
                 type="text"
                 maxlength="8"
                 v-model="productSort">
          <span class="form-sort_tip">设置排序优先级级，小程序展现产品时按序号从大到小排序</span>
        </div>
      </div>
      <div class="form-item">
        <label class="title">
          <span class="mustInput">*</span>
          产品类别
        </label>
        <div class="form-field">
          <select class="moneyInput"
                  v-model="categoryId">
            <option v-for="(item,index) in cate"
                    :key="index"
                    :selected="item.id == categoryId"
                    :value="item.id">{{item.categoryName}}</option>
          </select>
        </div>
      </div>
      <div class="form-item">
        <label class="title">
          <span class="mustInput">*</span>
          产品详情
        </label>
        <div class="form-field">
          <editor :config="editorOption"
                  agentCode="crmmini"
                  ref="editor"></editor>
        </div>
      </div>
      <div class="form-item">
        <label class="title">
          <span class="mustInput">*</span>
          关联销售人员
        </label>
        <div class="form-field">
          <pick-exam :useTab="functionTab"
                     :useRadio='defaultUserRadio'
                     :useDepts="defaultDeptVOList"
                     :useUsers="defaultUserVOList"
                     @changeRadio="changeRadio"
                     @chooseDone="chooseDone">
          </pick-exam>
        </div>
      </div>
    </div>
    <div class="btnContainer">
      <qwui-button class="cancelBtn"
                   @click="goBack">取消</qwui-button>
      <qwui-button type="primary"
                   @click="submit">保存</qwui-button>
    </div>
  </div>

</template>

<script>
import QwuiInput from 'components/qwuiBase/qwuiInput/qwuiInput'
import QwuiButton from 'components/qwuiBase/qwuiButton/qwuiButton'
import AddPic from 'components/Add/uploadImg/QwUploadImg'
import Editor from 'components/base/editor'
import PickExam from 'components/pickPerson/pickExam'
import {
  getProductDetail,
  updateProduct,
  addProduct,
  getProductCategory
} from '@/module/crm/api/assistant/index.js'

const EDITOR_OPTION = {
  initialFrameHeight: 350,
  zIndex: 10,
  enableAutoSave: false,
  saveInterval: 1000,
  maximumWords: 60000,
  wordCountMsg: '{#count}/60000',
  wordOverFlowMsg:
    "<span style='color:red;'>您输入的字符已超出6W限制，将无法提交产品详情！</span>",
  autoHeightEnabled: false, //禁止自动改变高度
  toolbars: [
    [
      'fullscreen',
      'source',
      '|',
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'underline',
      'forecolor',
      '|',
      'insertorderedlist',
      'insertunorderedlist',
      'fontsize',
      'justifyleft',
      'justifycenter',
      'justifyright',
      'justifyjustify',
      'insertimage'
    ]
  ]
}
export default {
  data() {
    return {
      picOption: {
        agent: 'crmmini',
        uploadFileId: 'coverImg',
        showType: 'middle',
        imageObj: {
          imageURL: '',
          fileName: ''
        }
      },
      editorOption: EDITOR_OPTION,
      productId: '',
      //属于哪个类别
      categoryId: '',
      //排序数字
      productSort: '0',
      productPrice: '',
      productPriceLine: '',
      productName: '',
      cover: '',
      coverName: '',
      title: '新建产品',
      functionTab: [
        { text: '部门' },
        { text: '标签人员' },
        { text: '特定人员' },
        { text: '批量导入' }
      ],
      defaultDeptVOList: [],
      defaultUserVOList: [],
      visibleRange: '1',
      deptList: [],
      userList: [],
      //全部分类列表
      cate: [],
      dataBase
    }
  },
  computed: {
    defaultUserRadio() {
      let defaultUserRadio = this.visibleRange === '1' ? '所有人' : '特定对象'
      return defaultUserRadio
    }
  },
  components: {
    QwuiInput,
    QwuiButton,
    AddPic,
    Editor,
    PickExam
  },
  created() {
    this.productId = this.$route.query.productId
    this.productSort = this.$route.query.sortId
    this.categoryId = this.$route.query.categoryId

    if(!this.productSort){
      this.productSort = "0";
    }
    this.init()
  },

  methods: {
    dealUpload(data) {
      this.cover = data.imageURL
      this.coverName = data.fileName
    },
    submit() {
      let { top_alert } = this.dataBase
      let productDetail = this.$refs.editor.getUEContent()
      let isOverText = this.$refs.editor.getUEContentIsOver()

      if (!this.productName) {
        top_alert('请输入产品名称', false, 2000)
        return
      }
      if (!this.cover) {
        top_alert('请添加产品封面', false, 2000)
        return
      }

      if (this.productPrice) {
        let money = this.productPrice.split('.')[0]
        if (money.length > 9) {
          top_alert('价格不能大于亿', false, 2000)
          return
        }
      }

      if (this.productPriceLine) {
        let money = this.productPriceLine.split('.')[0]
        if (money.length > 9) {
          top_alert('原价不能大于亿', false, 2000)
          return
        }
      }

      if (this.productPriceLine && !this.productPrice) {
        top_alert('未输入价格不能输入原价', false, 2000)
        return
      }

      if (this.productPriceLine) {
        if (Number(this.productPriceLine) <= Number(this.productPrice)) {
          top_alert('原价必须大于价格', false, 2000)
          return
        }
      }

      if(!this.categoryId){
        top_alert('请输入产品类别', false, 2000)
        return
      }

      if (!productDetail) {
        top_alert('请输入产品详情', false, 2000)
        return
      }

      if (isOverText) {
        top_alert('详情介绍字数超出6万字', false, 2000)
        return
      }

      //如果用户没有填的话
      if(!this.productSort.length){
        this.productSort = "0";
      }
      if (this.productSort.indexOf('.') > -1 || !/^[+]{0,1}(\d+)$/.test(this.productSort)) {
        top_alert('排序号只能输入非负整数', false, 2000)
        return
      }
      
      // 必填关联销售人员
      if (
        this.visibleRange === '3' &&
        !this.deptList.length &&
        !this.userList.length
      ) {
        top_alert('请添加关联销售人员', false, 2000)
        return
      }

      let data = {
        'productPO.productName': this.productName,
        'productPO.cover': this.cover,
        'productPO.coverName': this.coverName,
        productDetail: productDetail,
        'productPO.productPrice': this.productPrice,
        'productPO.productPriceLine': this.productPriceLine,
        'productPO.visibleRange': this.visibleRange,
        userIds: '',
        deptIds: '',
        'productPO.categoryId': this.categoryId
      }
      if (this.visibleRange === '3') {
        let deptIds = this.formateData(this.deptList, 'nodeId', 'deptId')
        let userIds = this.formateData(this.userList, 'userId', 'userId')
        data = Object.assign({}, data, { userIds: userIds, deptIds: deptIds })
      }

      if (this.productId) {
        data = Object.assign({}, data, {
          'productPO.id': this.productId,
          'productPO.sort': this.productSort
        })
        this.edit(data)
      } else {
         data = Object.assign({}, data, {
          'productPO.sort': this.productSort
        })
        this.add(data)
      }
    },

    init() {
      //获取所有产品分类,不包括全部
      getProductCategory().then(res => {
        if (res.code === '0') {
          let temArray = res.data.categoryList.filter((val, index) => {
            return val.id != '-1'
          })
          this.cate = temArray
        }
      })

      let { alert: _alert, top_alert } = this.dataBase
      // 如果没有productId，为编辑页面
      if (this.productId) {
        this.title = '编辑产品'
        let data = {
          productId: this.productId
        }
        getProductDetail(data).then(res => {
          if (res.code === '0') {
            this.productName = res.data.detail.productName
            this.cover = res.data.detail.cover
            this.coverName = res.data.detail.coverName
            this.picOption.imageObj.imageURL = res.data.detail.cover
            this.picOption.imageObj.fileName = res.data.detail.coverName
            this.productPrice = res.data.detail.productPrice
            this.productPriceLine = res.data.detail.productPriceLine
            this.$refs.editor.setUEContent(res.data.detail.productDetail)

            // 关联销售人员
            this.visibleRange = res.data.detail.visibleRange
            this.defaultDeptVOList = res.data.relatedListVO.relatedDeptVOList
            this.defaultUserVOList =
              res.data.relatedListVO.relatedPersonInfoVOList

            this.deptList = this.defaultDeptVOList
            this.userList = this.defaultUserVOList
          } else {
            top_alert(res.desc, false, 2000)
          }
        })
      } else {
        this.cover = ''
        this.coverName = ''
        this.picOption.imageObj.imageURL = ''
        this.picOption.imageObj.fileName = ''
      }
    },

    edit(data) {
      let { alert: _alert, top_alert } = this.dataBase
      updateProduct(data).then(res => {
        if (res.code === '0') {
          top_alert(res.desc, true, 2000)
          this.goBack()
        } else {
          top_alert(res.desc, false, 2000)
        }
      })
    },
    add(data) {
      let { alert: _alert, top_alert } = this.dataBase
      addProduct(data).then(res => {
        if (res.code === '0') {
          top_alert(res.desc, true, 2000)
          this.goBack()
        } else {
          top_alert(res.desc, false, 2000)
        }
      })
    },
    changeMoney(moneyName, e) {
      // 只允许输入数字
      let val = e.target.value.replace(/[^\d.]/g, '')

      // 禁止输入2个以上的小数点
      var reg = new RegExp('\\.(\\d?)\\.+')
      val = val.replace(reg, '.$1')
      this[moneyName] = val

      // 禁止录入小数点后两位以上
      reg = new RegExp('^(\\d+\\.\\d{2}).+')
      val = val.replace(reg, '$1')
      this[moneyName] = val
    },

    changeRadio(val) {
      this.visibleRange = val === '所有人' ? '1' : '3'
    },

    chooseDone(dept, tag, user) {
      this.deptList = dept
      this.userList = user
    },

    formateData(list, idType, defaultIdType) {
      if (list && list.length > 0) {
        let array = []
        list.forEach((value, index) => {
          if (value[idType]) {
            array.push(value[idType])
          } else {
            array.push(value[defaultIdType])
          }
        })
        return array.join('|')
      }
      return ''
    },

    // 返回
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style src='./addOrEditProduct.scss' lang="scss"></style>


