<template>
  <div class="product_container">

    <!-- 产品分类目录 -->
    <div class="category_container" @click="closeCategoryHandle">
      <div class="category_header">
        <span class="category_header_title">产品分类</span>
        <qwui-button type="primary"
                     @click="handleToggleCateAdd">新建分类</qwui-button>

        <!-- 新建分类弹窗 -->
        <div class="category_dialog add_category"
             v-if="addCateVisiable">
          <div :class="{'category_name_error': cateNameError}">
            <div class="category_dialog_title">新建分类</div>
            <div class="category_dialog_input">
              <input class="category_dialog_input_inner"
                     type="text"
                     maxlength="8"
                     v-model.trim="newCateName">
              <span class="category_input_number">{{newCateName.length}}/8</span>
            </div>
            <div class="category_dialog_tips"
                 v-if="cateNameDiable">分类已存在</div>
            <div class="category_dialog_tips"
                 v-else>1-8个字符，由数字、字母、汉字、减号、下划线和点组成</div>
          </div>

          <div class="category_dialog_button">
            <qwui-button type="primary"
                         @click="handleAddCate">确定</qwui-button>
            <qwui-button @click="handleToggleCateAdd">取消</qwui-button>
          </div>
        </div>
      </div>
      <div class="category_wrap">
        <div :class="['category_item', {'active_category': activeCate === item.id}]"
             v-for="(item,index) in cateList"
             :key="item.id"
             @click.stop.prevent="handleSelectCate(item.id,index)"
             :title="item.categoryName">
          <div class="category_item_content">
            <img src="~assets/images/icon_folder.png"
                 width="19"
                 height="17"
                 alt="">
            <span>{{item.categoryName}}</span>
            <span>({{item.productNum}})</span>
          </div>
          <img v-if="item.id !== '-1' && item.id !== '0'"
               class="category_item_control"
               src="~assets/images/icon_more.png"
               @click.stop.prevent="handleShowCateEdit(index)"
               width="16"
               height="16"
               title="操作"
               alt="" />

          <!-- 分类操作按钮 -->
          <div class="category_item_edit"
               @click.stop.prevent
               v-if="showEditIndex === index">
            <div @click="handleRenameCate(item.categoryName,index)">重命名</div>
            <div @click="handleDeleteCate(index)">删除</div>
          </div>

          <!-- 重命名分类窗口 -->
          <div class="category_dialog"
               @click.stop.prevent
               v-if="showRenameIndex === index">
            <div :class="{'category_name_error': cateNameError}">
              <div class="category_dialog_title">编辑分类</div>
              <div class="category_dialog_input">
                <input class="category_dialog_input_inner"
                       type="text"
                       maxlength="8"
                       v-model="newCateName">
                <span class="category_input_number">{{newCateName.length}}/8</span>
              </div>
              <div class="category_dialog_tips"
                   v-if="cateNameDiable">分类已存在</div>
              <div class="category_dialog_tips"
                   v-else>1-8个字符，由数字、字母、汉字、减号、下划线和点组成</div>
            </div>

            <div class="category_dialog_button">
              <qwui-button type="primary"
                           @click="renameProCate(item.id)">确定</qwui-button>
              <qwui-button @click="handleCancleRename">取消</qwui-button>
            </div>
          </div>

          <!-- 删除分类窗口 -->
          <div class="category_dialog category_item_delete"
               @click.stop.prevent
               v-if="showDeleteIndex === index">
            <div class="category_dialog_title">删除分类的同时，会将分类下的产品同步移动到“未分类”栏目，确定删除吗？</div>
            <div class="category_dialog_button">
              <qwui-button type="danger"
                           @click="deleteProCate(item.id)">确定</qwui-button>
              <qwui-button @click="handleCancleDelete">取消</qwui-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 产品列表 -->
    <div class="product_list_container">
      <div class="product_list_header">
        <div>
          <div class="normal_btn qw-return_btn"
               @click="goBack"></div>
          <span class="c999">首页</span>
          <span>/ 企业产品</span>
        </div>
        <qwui-button type="primary"
                     @click="addProduct">创建产品</qwui-button>
      </div>

      <div class="product_filter_container">
        <qwui-order :orderOptions="orderOption"
                    @changeOrder="handleChange"></qwui-order>
        <qwui-input inputType="search"
                    inputTips="输入产品标题搜索"
                    v-model="query['searchValue.productName']"
                    @search="getProductList"></qwui-input>
      </div>

      <div class="product_list_wrap">
        <div v-for="(item, index) in productList"
             :key="index"
             class="product_item">
          <img class="product_item_poster"
               :src="item.cover | coverFilter">
          <div class="product_item_desc">
            <div class="product_item_name">{{item.productName}}</div>
            <div class="product_item_data">
              <div class="item">
                <i class="iconfont public-web-ic_b-preview"></i>
                <span class="item_text">{{item.pageView}}</span>
              </div>
              <div class="item">
                <i class="iconfont public-web-ic_b-share"></i>
                <span class="item_text">{{item.forwardingAmount}}</span>
              </div>
            </div>
            <div class="product_item_price">
              <span class="dollar">￥</span>
              <span v-show="item.productPrice"
                    class="nowMoney">{{item.productPrice | moneyFilter}}</span>
              <span v-show="item.productPriceLine"
                    class="oldMoney">￥{{item.productPriceLine | moneyFilter}}</span>
            </div>

            <div class="product_item_buttons">
              <div class="qwui-icon_wrap">
                <img src="~assets/images/icon_pro_delete.svg"
                     alt=""
                     @click="handleShowDelPro(index)">
                <div class="qwui-icon_tip">删除</div>
              </div>
              <div class="qwui-icon_wrap">
                  <img src="~assets/images/icon_pro_sort.svg"
                       alt=""
                       @click="handleShowSortPro(index)">
                   <div class="qwui-icon_tip">排序</div>
              </div>
              <div class="qwui-icon_wrap">
                  <img src="~assets/images/icon_pro_edit.svg"
                       alt=""
                       @click="handleEditPro(item.id,item.sort,item.categoryId)">
                   <div class="qwui-icon_tip">编辑</div>
              </div>
              <div class="qwui-icon_wrap">
                  <img src="~assets/images/icon_pro_move.svg"
                       alt=""
                       @click="handleShowMovePro(index)">
                   <div class="qwui-icon_tip">移动</div>
              </div>                   
            </div>

            <!-- 删除产品窗口 -->
            <div class="product_dialog delete"
                 v-if="showProDelIndex === index">
              <div class="product_dialog_title">确定删除吗？</div>
              <div class="product_dialog_button">
                <qwui-button type="danger"
                             @click="deleteProduct(item.id)">确定</qwui-button>
                <qwui-button @click="handleCancleDelPro">取消</qwui-button>
              </div>
            </div>

            <!-- 产品排序窗口 -->
            <div class="product_dialog sort"
                 v-if="showProSortIndex === index">
              <div>
                <div class="product_dialog_title">排序号</div>
                <input class="product_dialog_input"
                       type="text"
                       v-model="item.sort"
                       maxlength="8">
                <div class="product_dialog_tips">从大到小排列</div>
              </div>

              <div class="product_dialog_button">
                <qwui-button type="primary"
                             @click="changeProSort(item.id,item.sort)">确定</qwui-button>
                <qwui-button @click="handleCancleSortPro">取消</qwui-button>
              </div>
            </div>

            <!-- 移动产品分类窗口 -->
            <div class="product_dialog move"
                 v-if="showProMoveIndex === index">
              <div>
                <div class="product_dialog_title">移动到</div>
                <div class="category_item_wrap">
                  <div class="category_item"
                       v-for="moveItem in cate"
                       :key="moveItem.categoryName"
                       @click.stop="moveCategory(item.id,moveItem.id)">
                    <img src="~assets/images/icon_folder.png"
                         width="19"
                         height="17"
                         alt="">
                    <span class="category_item_text">{{moveItem.categoryName}}</span>
                    <span>({{moveItem.productNum}})</span>
                  </div>
                </div>
              </div>
              <div class="product_dialog_button">
                <qwui-button type="primary">确定</qwui-button>
                <qwui-button @click="handleCancleMovePro">取消</qwui-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!productList"
           class="noData">
        <div class="img_item"></div>
        <p class="text_item">暂无数据</p>
      </div>
      <page v-show="productList"
            :pageData="pagerOption"
            @change="pageChage"></page>
    </div>
  </div>

</template>

<script>
const ORDER_OPTION = [
  {
    name: '默认排序',
    type: 'sort'
  },
  {
    name: '创建时间',
    type: 'time'
  },
  {
    name: '浏览量',
    type: 'searchCount'
  },
  {
    name: '转发量',
    type: 'forwardCount'
  }
]
// 时间降序
const TIME_DESC = '0'
// 时间升序
const TIME_ASC = '1'
// 浏览量降序
const SEARCH_DESC = '2'
// 浏览量升序
const SEARCH_ASC = '3'
// 转发量降序
const FORWARD_DESC = '4'
// 转发量升序
const FORWARD_ASC = '5'
// 产品排序号降序（默认）
const PRODUCT_DESC = '6'

import {
  searchProductList,
  deleteProduct,
  getProductCategory,
  createProductCategory,
  renameProductCategory,
  deleteProductCategory,
  changeProductSort,
  moveProductCategory
} from '@/module/crm/api/assistant/index.js'

import QwuiInput from 'components/qwuiBase/qwuiInput/qwuiInput'
import QwuiButton from 'components/qwuiBase/qwuiButton/qwuiButton'
import QwuiOrder from 'crm/components/qw-order/qw-order'
import QwTip from 'crm/components/qw-tip/qw-tip'
import Page from '@/components/list/page'

export default {
  name: 'qw-product-list',
  components: {
    QwuiInput,
    QwuiButton,
    QwuiOrder,
    QwTip,
    Page
  },
  created() {
    this.getProductList()
    this.getProductCategory()
  },
  data() {
    return {
      dataBase,
      // 产品列表查询参数
      query: {
        page: 1,
        pageSize: 10,
        'searchValue.productName': '',
        'searchValue.sortType': '6',
        'searchValue.categoryId': '-1'
      },
      // 产品列表
      productList: [],
      // 产品分类列表
      cateList: [],
      // 默认选择的产品类别ID(-1代表全部，0代表未分类)
      activeCate: '-1',
      // 新建分类窗口的可见性
      addCateVisiable: false,
      // 新建分类的名字
      newCateName: '',
      // 产品分类名称报错提示
      cateNameError: false,
      // 产品分类名称已存在提示
      cateNameDiable: false,
      // 移动的分类列表
      cate: [],
      showEditIndex: -1,
      showRenameIndex: -1,
      showDeleteIndex: -1,
      showProDelIndex: -1,
      showProSortIndex: -1,
      showProMoveIndex: -1,
      // 排序筛选组件配置
      orderOption: ORDER_OPTION,
      // 排序编号
      sortType: PRODUCT_DESC,
      // 分页组件配置
      pagerOption: {
        maxPage: 2,
        totalRows: 4,
        page: 1,
        pageSize: 10
      }
    }
  },
  filters: {
    // 产品图片封面增加前缀
    coverFilter(cover) {
      return _.compressURL + cover
    },
    // 格式化产品价格
    moneyFilter(money) {
      if (money) {
        if (money > 9999.99) {
          let dealMoney = String(money / 10000)
          let integerMoney = dealMoney.split('.')[0]
          let decimalMoney = dealMoney.split('.')[1]
          if (decimalMoney) {
            decimalMoney = decimalMoney.slice(0, 2)
            return `${integerMoney}.${decimalMoney}万`
          }
          return `${integerMoney}万`
        } else {
          return money
        }
      }
      return ''
    }
  },
  watch: {
    sortType() {
      this.getProductList()
    }
  },
  methods: {
    // 获取产品列表
    getProductList() {
      this.query['searchValue.categoryId'] = this.activeCate;
      this.query['searchValue.sortType'] = this.sortType;
      searchProductList(this.query).then(res => {
        if (res.code === '0') {
          this.productList = res.data.pageData
          // 渲染分页组件
          this.pagerOption.maxPage = res.data.maxPage
          this.pagerOption.totalRows = res.data.totalRows
          this.pagerOption.page = res.data.currPage
        } else {
          this.dataBase.top_alert(res.desc, false, 2000)
        }
      })
    },
    // 分页器改变分页
    pageChage(page, pageSize) {
      this.query.page = page
      this.query.pageSize = pageSize
      this.getProductList()
    },
    // 获取产品类别列表
    getProductCategory() {
      getProductCategory().then(res => {
        if (res.code === '0') {
          this.cateList = res.data.categoryList
        } else {
          this.dataBase.top_alert(res.desc, false, 2000)
        }
      })
    },
    // 选择分类
    handleSelectCate(id, index) {
      this.showEditIndex = this.showEditIndex === index ? index : -1
      this.showDeleteIndex = this.showDeleteIndex === index ? index : -1
      this.showRenameIndex = this.showRenameIndex === index ? index : -1
      this.activeCate = id

      //清空上一个分类的移动操作窗口数据
      this.cate = [];
      //关闭上一个分类打开的操作窗口
      this.showProMoveIndex = -1;
      this.showProSortIndex = -1;
      this.showProDelIndex = -1;

      this.query['searchValue.productName'] = '';
      this.getProductList()
    },
    // 切换显示新建分类弹窗
    handleToggleCateAdd() {
      this.cateNameError = false
      this.cateNameDiable = false
      this.newCateName = ''
      this.addCateVisiable = !this.addCateVisiable

      //关闭产品的操作窗口
      this.showProMoveIndex = -1;
      this.showProSortIndex = -1;
      this.showProDelIndex = -1;

      //关闭产品分类的弹窗
      this.showEditIndex =  -1;
      this.showRenameIndex = -1;
      this.showDeleteIndex = -1;
    },
    // 新增分类
    handleAddCate() {
      const reg = /^[\u4E00-\u9FA5A-Za-z0-9-_.]{1,8}$/
      this.cateNameError = !reg.test(this.newCateName)
      if (this.cateNameError) return
      const data = { categoryName: this.newCateName }
      createProductCategory(data).then(res => {
        if (res.code === '0') {
          this.getProductCategory()
          this.addCateVisiable = false
        } else {
          this.cateNameError = true
          this.cateNameDiable = true
        }
      })
    },
    // 显示重命名分类弹窗
    handleRenameCate(name, index) {
      this.cateNameError = false
      this.cateNameDiable = false
      this.showEditIndex = -1
      this.showRenameIndex = index
      this.newCateName = name
    },
    // 取消重命名分类
    handleCancleRename() {
      this.showRenameIndex = -1
      this.newCateName = ''
    },

    // 重命名分类
    renameProCate(id) {
      const reg = /^[\u4E00-\u9FA5A-Za-z0-9-_.]{1,8}$/
      this.cateNameError = !reg.test(this.newCateName)
      if (this.cateNameError) return
      const data = {
        categoryId: id,
        categoryName: this.newCateName
      }
      renameProductCategory(data).then(res => {
        if (res.code === '0') {
          this.getProductCategory()
          this.handleCancleRename()
        } else {
          this.cateNameError = true
          this.cateNameDiable = true
        }
      })
    },
    // 删除分类
    deleteProCate(categoryId) {
      const data = { categoryId }
      deleteProductCategory(data).then(res => {
        if (res.code === '0') {
          this.showDeleteIndex = -1
          this.getProductCategory()
          if (this.activeCate === categoryId) {
            this.activeCate = '-1'
            this.getProductList()
          }
        } else {
          this.dataBase.top_alert(res.desc, false, 2000)
        }
      })
    },
    // 更改产品排序号
    changeProSort(productId, sortNum) {
      if (sortNum.indexOf('.') > -1 || !/^[+]{0,1}(\d+)$/.test(sortNum)) {
        dataBase.top_alert('排序号只能输入非负整数', false, 2000);
        return
      }

      const data = { productId, sortNum }
      changeProductSort(data).then(res => {
        if (res.code === '0') {
          this.showProSortIndex = -1
          this.getProductList()
        } else {
          this.dataBase.top_alert(res.desc, false, 2000)
        }
      })
    },
    handleChange(option) {
      // 点击搜索条件排行时,清空所有操作弹窗
      this.showProDelIndex = -1;
      this.showProSortIndex = -1;
      this.showProMoveIndex = -1;

      if (option.type === 'time') {
        this.sortType = option['descOrAsc'] === 'asc' ? TIME_ASC : TIME_DESC
      } else if (option.type === 'searchCount') {
        this.sortType = option['descOrAsc'] === 'asc' ? SEARCH_ASC : SEARCH_DESC
      } else if (option.type === 'forwardCount') {
        this.sortType =
          option['descOrAsc'] === 'asc' ? FORWARD_ASC : FORWARD_DESC
      } else if(option.type === 'sort'){
        this.sortType = PRODUCT_DESC;
      }
    },
    // 删除产品
    deleteProduct(productId) {
      const data = { productId }
      deleteProduct(data).then(res => {
        this.showProDelIndex = -1
        if (res.code === '0') {
          this.getProductList()
          this.getProductCategory();
          this.dataBase.top_alert(res.desc, true, 2000)
        } else {
          this.dataBase.top_alert(res.desc, false, 2000)
        }
      })
    },
    moveCategory(id,categoryId){
      this.moveProductCategory(id,categoryId);
    },
    // 移动产品的分类
    moveProductCategory(id,categoryId){
      const data = { productId: id,newCategoryId:categoryId}
      moveProductCategory(data).then(res => {
        if (res.code === '0') {
          this.showProMoveIndex = -1;
          this.getProductCategory();
          this.getProductList();
        }
      })
    },
    // 点击产品分类显示分类操作按钮
    handleShowCateEdit(index) {
      //关闭所有产品操作的窗口
      this.showProMoveIndex = -1;
      this.showProSortIndex = -1;
      this.showProDelIndex = -1;

      this.showRenameIndex = -1
      this.showDeleteIndex = -1
      if (index === 0 || index === 1) return
      this.showEditIndex = this.showEditIndex === index ? -1 : index
    },
    // 显示删除分类弹窗
    handleDeleteCate(index) {
      this.showEditIndex = -1
      this.showDeleteIndex = index
    },
    // 取消删除分类
    handleCancleDelete() {
      this.showDeleteIndex = -1
    },
    // 显示删除产品弹窗
    handleShowDelPro(index) {
      //关闭非此窗口的其他操作窗口
      this.showProMoveIndex = -1;
      this.showProSortIndex = -1;

      //关闭产品分类的弹窗
      this.showEditIndex =  -1;
      this.showRenameIndex = -1;
      this.showDeleteIndex = -1;
      //新建分类窗口
      this.addCateVisiable = false;

      this.showProDelIndex = this.showProDelIndex === index ? -1 : index
    },
    // 取消删除产品
    handleCancleDelPro() {
      this.showProDelIndex = -1
    },
    // 显示排序产品弹窗
    handleShowSortPro(index) {
      //关闭非此窗口的其他操作窗口
      this.showProDelIndex = -1;
      this.showProMoveIndex = -1;

      //关闭产品分类的弹窗
      this.showEditIndex =  -1;
      this.showRenameIndex = -1;
      this.showDeleteIndex = -1;
      //新建分类窗口
      this.addCateVisiable = false;

      this.showProSortIndex = this.showProSortIndex === index ? -1 : index
    },
    // 取消排序产品
    handleCancleSortPro() {
      this.showProSortIndex = -1
    },
    //关闭移动分类的小窗口
    handleCancleMovePro(){
      this.showProMoveIndex = -1;
    },
    // 跳转到编辑产品页面
    handleEditPro(productId,sortId,categoryId) {
      this.$router.push({
        name: 'addOrEditProduct',
        query: {
          productId: productId,
          sortId: sortId,
          categoryId: categoryId
        }
      })
    },
    // 显示移动产品窗口
    handleShowMovePro(index) {
      //关闭非此窗口的其他操作窗口
      this.showProDelIndex = -1;
      this.showProSortIndex = -1;

      //关闭产品分类的弹窗
      this.showEditIndex =  -1;
      this.showRenameIndex = -1;
      this.showDeleteIndex = -1;
      //新建分类窗口
      this.addCateVisiable = false;

      this.showProMoveIndex = this.showProMoveIndex === index ? -1 : index
        
        let temArray = this.cateList.filter((val, index) => {
          return val.id != '-1' && val.id != this.activeCate;
        })
        this.cate = temArray
        
      
    },
    addProduct(index) {
      this.$router.push({ name: 'addOrEditProduct' })
    },
    //点击产品分类的空白区域关闭分类的操作窗口
    closeCategoryHandle(event){
      if(event.target.className === 'category_container'){
        //关闭产品分类的弹窗
        this.showEditIndex =  -1;
        this.showRenameIndex = -1;
        this.showDeleteIndex = -1;
      }
    },
    // 返回
    goBack() {
      this.$router.back(-1)
    }
  }
}
</script>

<style src='./productList.scss' lang="scss" scoped></style>
