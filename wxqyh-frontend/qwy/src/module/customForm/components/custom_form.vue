<template>
  <div class="custom-form">
    <div  class="insertImg" v-show="false">
      <input name="file" type="file" id="pic" accept="image/jpg,image/jpeg,image/png,image/gif" @change="upLoadPic">
      <input name="file" type="file" id="background" accept="image/jpg,image/jpeg,image/png,image/gif" @change="upLoadBg">
    </div>
    <div class="isPrinted-msg" v-show="workOrderId && isPrinted">当前表单明细已打印</div>
    <div class="print-head" v-show="isEdit">
      <div class="form-name">{{printTitle}}</div>
      <div class="custom-btn">
        <span class="help-btn" @click="Help">帮助文档 </span>
        <span class="reset-btn" @click="resetTemplate">重置</span>
        <span class="preview-btn" @click="previewTemplate">预览</span>
        <span class="save-btn" @click="saveTemplate">保存</span>
      </div>
    </div>
    <div :class="{'print-body':isEdit,'hide-print-border':!isEdit}">
      <div class="print-field" v-show="isEdit">
        <div class="field-title">
          <span class="form-field" :class="{'active':currentIndex===0}" @click="currentIndex=0">表单字段</span>
          <span class="system-field" :class="{'active':currentIndex===1}" @click="currentIndex=1">系统字段</span>
        </div>
        <div class="field-tab" v-show="currentIndex === 0">
          <div class="content" :class="{'active':tabIndex===0}" @click="tabIndex=0">内容</div>
          <div class="title" :class="{'active':tabIndex===1}" @click="tabIndex=1">标题</div>
        </div>
        <ul class="field-list" v-show="currentIndex === 0">
          <div v-show="tabIndex===0">
            <li v-for="item in fields" :key="item._id">
              <div v-if="item._type=='ChildField'|| item._type=='FORMREFCustomerField'" class="mb40">
                <div :id="item._id" class="label">{{item.label}}字段</div>
                <div v-for="citem in item.children" :key="citem._id" class="child-field">
                  <span class="child-icon"></span>
                  <div class="field-item child-field-item"  :id="citem._id" draggable="true" @dragstart='drag($event,citem,item)' @dragend="end($event)">[内容] {{citem.label}}</div>
                </div>
              </div>
              <div v-else :id="item._id" class="field-item" draggable="true" @dragstart='drag($event,item)' @dragend="end($event)">[内容] {{item.label}}</div>
            </li>
          </div>
          <div v-show="tabIndex===1">
            <li v-for="item in fields" :key="item._id">
              <div v-if="item._type=='ChildField'|| item._type=='FORMREFCustomerField'" class="mb40">
                <div :id="item._id" class="label">{{item.label}}字段</div>
                <div v-for="citem in item.children" :key="citem._id" class="child-field">
                  <span class="child-icon"></span>
                  <div class="field-item child-field-item"  :id="citem._id" draggable="true" @dragstart='drag($event,citem,item,true)' @dragend="end($event)">[标题] {{citem.label}}</div>
                </div>
              </div>
              <div v-else :id="item._id" class="field-item" draggable="true" @dragstart='drag($event,item,null,true)' @dragend="end($event)">[标题] {{item.label}}</div>
            </li>
          </div>
        </ul>
        <ul class="field-list" v-show="currentIndex === 1" style="overflow-y:inherit;top:44px;">
          <div class="label">基本字段</div>
          <li  v-for="item in sysFields" :key="item._id">
            <div v-if="item._type=='ChildField'">

              <div :id="item._id" class="label">{{item.label}}字段
                <span class="help" @mouseenter="showHideTips(item, true)" @mouseleave="showHideTips(item, false)">?</span>
                <div class="show-tips" :ref="item._id">
                  <p>{{showTipsText[item._id] && showTipsText[item._id][0]}}</p>
                  <p>{{showTipsText[item._id] && showTipsText[item._id][1]}}</p>
                </div>
              </div>
              <div v-for="citem in item.children" :key="citem._id">
                <div class="field-item"  :id="citem._id" draggable="true" @dragstart='drag($event,citem,item)' @dragend="end($event)">[{{preItemText(item)}}] {{citem.label}}</div>
              </div>
            </div>
            <div v-else :id="item._id" class="field-item" draggable="true" @dragstart='drag($event,item)' @dragend="end($event)">[{{preItemText(item)}}] {{item.label}}</div>
          </li>
        </ul>
      </div>
      <div class="print-menu" v-show="isEdit">
        <menu-tool :styleData="styleData"
                   :paperBackground ="paperBackground"
                   :isApprove ="isApprove"
                   @setStyle="_setStyle"
                   @showPop="showPop"
                   @deleteBg="deleteBackground"
                   ref="menu">
        </menu-tool>
      </div>
      <div class="print-table" :class="{'preview':!isEdit,'preview-background': LoadCompletion}" @drop='drop($event)' @dragover='allowDrop($event)' @dragenter='dragenter($event)'>
        <HotTable
          :root="root"
          ref="hotTable"
          :settings="settings">
        </HotTable>
        <div class="print-icon-status" v-show="isApprove.on">
          <img :src="iconStatusSrc">
        </div>
        <div class="preview-mask" v-show="!isEdit"></div>
      </div>
    </div>
    <div class="print-footer" v-show="workOrderId"><span class="print-btn" @click="printForm">{{printBtnText}}</span></div>
  </div>
</template>

<script>
  import HotTable from "@handsontable/vue";
  import Handsontable from "handsontable";
  import utils from "../js/utils"
  import {convertCurrency} from "../js/capital"
  import {PrintUtils} from "../js/printUtils"
  import { designPrinttemp ,addPrintTemplet,getPrinttemp,setIsPrinted,resetTemplate} from "../js/api"
  import MenuTool from "../base/menu_tool/menu_tool"
  import FuncBox from '@/components/list/funcBox'
  export default {
    name: "custom_form",
    components: {
      HotTable,
      MenuTool,
      FuncBox
    },
    data() {
      let _this = this
        ,isEdit = true
        ,workOrderId = this.$route.query.workOrderId
        ,previewTemplateId = this.$route.query.previewTemplateId;
      if(workOrderId || previewTemplateId){
        isEdit = false;
      }
      return {
        page:{
          size:'A4',//默认A4
          layout:'portrait',
        },
        sizeMap:{
          A3:{
            'portrait': { height: 1450, width:990},
            'landscape': { height: 990, width:1450},
          },
          A4:{
            'portrait': { height: 980, width:660},
            'landscape': { height: 660, width:980},
          },
        },
        paperBackground: {
          imgUrl:'',
          name:'',
          isPrintBg: true
        },
        root: "custom_table",
        definitionVersionsId:this.$route.query.definitionVersionsId,
        previewTemplateId:this.$route.query.previewTemplateId,
        workOrderId:this.$route.query.workOrderId,
        printTitle: '',
        isEdit: isEdit,
        itemMap:{},
        resultDetail:{},
        choiceMap:{},
        typeMap:{},
        newItemMap:{},
        fields: [],
        sysFields: [], //系统字段
        currentIndex: 0, //字段切换索引
        range: {
          s: "0:0",
          e: "0:0"
        },
        styleData:null,
        settings: {
          data: Handsontable.helper.createEmptySpreadsheetData(100, 24), // 创建100*24的空白表格
          minRows: 100, //最小行列
          minCols: 25,
          colWidths: function (index) {
            return _this.getColWidth(index);
          },

          rowHeights: function (index) {
            return _this.getRowHeight(index)
          },
          renderAllRows: true,
          rowHeaders: isEdit,//true,//
          colHeaders:  isEdit,//true, //自定义列表头or 布尔值
          currentRowClassName: "currentRow", //为选中行添加类名，可以更改样式
          currentColClassName: "currentCol", //为选中列添加类名
          manualColumnResize: true,
          manualRowResize: true,
          mergeCells: true, //合并单元格
          undo: true,
          redo: true,
          customBorders: [],//边框
          contextMenu: this._getContextMenu(),
          cells: function (row, column, prop) {
            let data = _this.dataMap && _this.dataMap[_this._getCellTag(row, column)];
            let flag = 'text';
            //判断如果是字段就不能编辑
            if (data) {
              if(utils.isString(data[0])){
                flag = 'text'
              }else{
                flag = false;
              }
            }
            const cellProperties = {
              editor: flag,
              renderer: function (hotInstance, TD, row, col, prop, value, cellProperties) {
                TD.className = hotInstance.getCellMeta(row, col).className || '';
                var str = '';
                if (!value) {
                  return TD.innerHTML = "";
                }
                var h = _this.getRowHeight(row)
                  , u = _this.hotTable.getPlugin("MergeCells").mergedCellsCollection.get(row, col);
                if (u)
                  for (var c = 1; c < u.rowspan; c++)
                    h += _this.getRowHeight(row + c);
                str += _this._getCellText(value,h);
                TD.innerHTML = '<div class="content"><div class="data"><span>' + str + '</span></div></div>';
                if(_this.workOrderId){
                  var height = TD.querySelector('.data').offsetHeight;
                  if($('img.fieldImg',TD).length == 0){
                    if((u && u.colspan>1)){
                      var width = _this.getColWidth(col);
                      for (var r = 1; r < u.colspan; r++)
                        width += _this.getColWidth(col + r);
                      $(TD.querySelector('.data')).css({width: width});
                      height = TD.querySelector('.data').offsetHeight;
                      if((u && u.rowspan>1)){
                        _this.value.rows[row] = h;
                      }
                      if (height > h){
                        _this.value.rows[row] = height;
                      }
                    }
                    if (height > h  && _this.isMerge) {
                      _this.value.rows[row] = height;
                      $(TD).css('height',height) //根据文字内容div的高度赋值给td
                    }
                  }
                }
              }
            };
            return cellProperties;
          },

          search: true,
          outsideClickDeselects: false,
          afterColumnResize: function (col, size) {

          },
        },
        cellList: [],//单元格数据
        dom: "",
        options: {
          rowHeight: 24,
          colWidth: 100,
          minColWidth: 100,
          minRowHeight: 24,
          minRows: 100,
          minCols: 25,
        },
        value: {
          cols: [],
          rows: [],
        },
        fieldNameMap: {},
        fieldInfo:{},
        dataMap: {},
        childTemplate: {},
        printUtils: null,
        isPrinted: 0,//是否已打印，1是0否
        isApprove: {
          on: true
        },//是否显示印章
        iconStatusSrc: "",//印章路径
        iconStatus: {//审批单、外部单
          "-1": require("assets/images/print_icon_status_closed.png"),//已关闭
          "0": require("assets/images/print_icon_status_retrial.png"),//退审
          "1": require("assets/images/print_icon_status_approved.png"),//已审批
          "2": require("assets/images/print_icon_status_inApproval.png"),//审批中
        },
        iconTaskStatus: {//任务单
          "-1": require("assets/images/print_icon_status_closed.png"),//已关闭
          "2": require("assets/images/print_icon_status_notClosed.png"),//未关闭
        },
        printBtnText: "打印",
        showTipsText: {}, //提示语方案,
        showBoxFlag: false, //弹窗显示标识,
        tabIndex: 0, //内容标题切换索引
        LoadCompletion: false,
        imgData: {
          accept: 'image/jpg,image/jpeg,image/png,image/gif',
        }
      };
    },
    created(){
      this._expandTable();
      var _this = this;
      if(this.workOrderId){
        //预览的时候的数据
        getPrinttemp(this.workOrderId).then(function(result){
          dataBase.loading = false;
          if(result.code == 0){
            _this.fields = result.data.fields;
            _this.sysFields = result.data.sysFields;
            _this.resultDetail = result;
            _this.initFieldMap();
            _this.itemMap = result.data.itemMap;
            _this.itemMap.auditSerial = result.data.auditSerial;
            _this.itemMap.comments = result.data.comments;
            _this.changeItemMap();
            _this.setValue(result.data.formPrintTemplet ? result.data.formPrintTemplet.templetHtml : '');
            _this.isPrinted = result.data.formWorkOrderEXVO && result.data.formWorkOrderEXVO.isPrinted ? 1 : 0;
            _this.printBtnText = _this.isPrinted ? "再次打印" : "打印";
            //显示审批印章
            if (result.data.formPrintTemplet) {
              _this.showPrintIconStatus(result.data.controlPO, result.data.detail);
            }
          }else{
            _.alert('提示',result.desc);
          }

        })
      }else{
        //设置模板时的数据
        designPrinttemp(this.definitionVersionsId).then(function(result){
          dataBase.loading = false;
          if(result.code == 0){
            _this.printTitle = result.data.detailsPO.formName;
            _this.fields = result.data.fields;
            _this.sysFields = result.data.sysFields;
            _this.initFieldMap();
            _this.setValue(result.data.formPrintTemplet ? result.data.formPrintTemplet.templetHtml : '' );
          }else{
            _.alert('提示',result.desc);
          }
        })
      }


    },
    mounted() {
      var _this = this
      this.hotTable = this.$refs.hotTable.hotInstance;
      this.printUtils = new PrintUtils({}, {}, '');
      window.pU = this.printUtils;
      this._addTableHook();
      window.table = this.hotTable;
      window.ins = this;
      //字段名称和id的map
    },
    methods: {
      showPrintIconStatus(controlPO, detail) {
        switch (controlPO.isTask) {
          case "1"://任务单
            this.iconStatusSrc = this.iconTaskStatus[detail.isover];
            break;
          case "2"://审批单
            this.iconStatusSrc = this.iconStatus[detail.isover];
            break;
          case "3"://外部单
            if (detail.creator != "") {
              this.iconStatusSrc = this.iconStatus[detail.isover];
            }
            break;
        }
      },
      //提示语显示隐藏
      showHideTips(item, isShow) {
        if(item._id == 'comments') {
          isShow ? this.$refs.comments[0].style.display = 'block' : this.$refs.comments[0].style.display = 'none'
        } else if(item._id == 'auditSerial') {
          isShow ? this.$refs.auditSerial[0].style.display = 'block' : this.$refs.auditSerial[0].style.display = 'none'
        }
      },
      //字段前缀方案
      preItemText(item) {
        if(item._id == 'comments') {
          this.showTipsText[item._id] = ['· 表单有多条评论，打印时字段信息会自动向下新增。', '· 为保证每条评论信息对应准确，评论回复字段需设置在同一行。']
          return '评论'
        } else if(item._id == 'auditSerial') {
          this.showTipsText[item._id] = ['· 流程存在多个节点，打印时字段信息会自动向下新增。', '· 为保证流程信息对应准确，处理流程字段需设置在同一行。']
          return '流程'
        } else return '系统'
      },
      printForm() {
        window.print();
        var _this = this;
        if (!this.isPrinted) {
          setIsPrinted(this.workOrderId).then(() => {
            _this.isPrinted = 1;
            _this.printBtnText = "再次打印";
          })
        }
      },
      _getContextMenu(){
        var e = this;
        return {
          callback: function(t, n) {
            var countRows = e.hotTable.countRows(),countCols = e.hotTable.countCols();
            switch (t) {
              case "merge":
                e.mergeOrUnMerge();
                break;
              case "row_above":
                e.value.rows.splice(n[0].start.row,0,24);
              case "remove_row":
                var delRows = n[0].end.row - n[0].start.row;
                if(t == "remove_row"){
                  delRows = delRows+1;
                  e.value.rows.splice(n[0].start.row,delRows);
                }
                //修改行高
                for (var c = n[0].start.row; c < countRows; c++){
                  e.hotTable.getPlugin("ManualRowResize").setManualSize(c, e.value.rows[c]);
                }
                //修改样式meta的数据
                e._refreshDataMap();
                break;
              case "col_left":
              case "remove_col":
                e._refreshDataMap();
                break;
              case "empty":
//                e.clearCellData()
            }
          },
          items: {
            row_above: {
              name: "插入行",
            },
            col_left: {
              name: "插入列"
            },
            remove_row: {
              name: "删除行"
            },
            remove_col: {
              name: "删除列"
            },
            cut: {
              name: "清除内容",
            },
            mergeCells: {
              name: '合并/取消合并',
            },
          }
        }
      },
      changeItemMap(){
        var _this = this;
        var detail = this.resultDetail.data.detail;
        var comments = this.resultDetail.data.comments //评论列表
        var content = [] //评论内容
        var personName = [] //评论名字
        var time = []  //评论时间
        var auditSerial = this.resultDetail.data.auditSerial //节点信息
        var isFreeFlow = this.resultDetail.data.controlPO.isFreeFlow // 流程信息
        if(comments) {
          utils.forEach(comments, function(key, value) {
            content.push(value.content)
            personName.push(value.personName)
            time.push(value.time)
          })
        }
        if(auditSerial) {
          var nodeTypeMap = {};
          if (isFreeFlow == '1'){
            nodeTypeMap = {
                '0': '退审',
                '1': '提交',
                '4': '重新提交',
                '5': '转审',
                '6': '同意并结束',
                '7': '关闭',
                '8': '同意',
                '12': '干预节点',
                '13': '干预负责人',
                '14': '干预结束流程'
              }
          }else{
            nodeTypeMap = {
              '': '提单',
              '1': '审批',
              '2': '知会',
              '3': '承办'
            }
          }
          auditSerial.forEach(function(item) {
            utils.forEach(item, function(key, value) {
              var oldValue = _this.newItemMap['auditSerial_'+key] || [];
              if(key == 'nodeType'){
                value = nodeTypeMap[value]||'';
              }
              oldValue.push(value);
              _this.newItemMap['auditSerial_'+key] = oldValue;
            })
          })
        }
        var sys = {
          personName: detail.personName,
          instanceTitle: this.resultDetail.data.detail.instanceTitle,
          departmentName: detail.deptFullName,
          createaTime: detail.createaTime,
          'comments_content': content,
          'comments_personName': personName,
          'comments_time': time
        };
        Object.assign(this.newItemMap,sys);
        utils.forEach(this.itemMap, function( key ,value){
          var newValue = value;
          var type = _this.typeMap[key];
          if(type == 'ChildField' || type == 'FORMREFCustomerField'){
            if(value && value.length>0){
              value.forEach(function(item){
                var childTemplate = JSON.parse(JSON.stringify(_this.childTemplate[key]||{}));
                Object.assign(childTemplate,item);
                utils.forEach(childTemplate,function(ckey,childValue){
                  if(_this.fieldInfo[ckey] && ['NumberField','StatisticsField','EquationField'].indexOf(_this.fieldInfo[ckey]._type)!=-1 && _this.fieldInfo[ckey].validations.indexOf('iscapital')!=-1){
                    childValue = childValue +'<br>大写金额：'+ convertCurrency(childValue)
                  }
                  var oldValue = _this.newItemMap[key+'_'+ckey] || [];
                  oldValue.push(childValue);
                  _this.newItemMap[key+'_'+ckey] = oldValue;

                })
              })
            }
            return;
          }
          if(_this.fieldInfo[key] && ['NumberField','StatisticsField','EquationField'].indexOf(_this.fieldInfo[key]._type)!=-1 && _this.fieldInfo[key].validations.indexOf('iscapital')!=-1){
            newValue = newValue +'<br>大写金额：'+ convertCurrency(newValue)
          }
          _this.newItemMap[key] = newValue;
        });
      },
      //删除背景图
      deleteBackground(){
        $("#background").val('');
        this.paperBackground.name = "";
        this.paperBackground.imgUrl = "";
        this.setBackground();
      },
      //预览模版
      previewTemplate(){
        var _this = this;
        var data = {
          definitionVersionsId: this.definitionVersionsId,
          templetHtml: JSON.stringify(this.getValue())
        }
        addPrintTemplet(data).then(function(result){
          if(result.code == 0) {
            window.open(_.baseURL+'/vm/module/customForm.html#/?previewTemplateId='+1+'&&definitionVersionsId=' + _this.definitionVersionsId);
          } else {
            _.alert('提示','网络错误');
          }
        });
      },
      //帮助
      Help(){
        window.open('https://wbg.do1.com.cn/xueyuan/8351.html')
      },
      //重置模板
      resetTemplate(){
        let _this = this
        _.alert('提示','重置后将清空当前设置，打印时将使用默认模板打印',function() {
          _this.clearTemplate();
        },'确定',true)
      },
      //保存模板
      saveTemplate(){
        var data = {
          definitionVersionsId: this.definitionVersionsId,
          templetHtml: JSON.stringify(this.getValue())
        }
        addPrintTemplet(data).then(function(result){
          if(result.code == 0) {
            _.alert('提交结果', '保存成功')
          } else {
            _.alert('提示',result.desc);
          }
        });
      },
      //清空模板
      clearTemplate(){
        var _this = this;
        resetTemplate({definitionVersionsId:_this.definitionVersionsId}).then(function(result){
          if(result.code == 0) {
            _this._resetStyle();
            _this.setValue();
            _.alert('提交结果', '重置成功')
          }else {
            _.alert('提示','网络错误');
          }
        });
      },
      initFieldMap(){
        this.LoadCompletion = true;
        var _this = this;
        this.fields.forEach(function (item) {
          _this.fieldInfo[item._id] = item;
          _this.typeMap[item._id] = item._type;
          if(item._type=='ChildField' || item._type == 'FORMREFCustomerField'){
            if(item._type == 'FORMREFCustomerField'){
              item.children = item.ref_cfg.show_fields_array.concat(item.children)
            }
            var template = {};
            item.children.forEach(function(citem){
              template[citem._id] = '';
              _this.typeMap[citem._id] = citem._type;
              _this.fieldInfo[citem._id] = citem;
              _this.fieldNameMap[item._id+'_'+citem._id] = '${' + item.label+'_' +citem.label+ '}';
            })
            _this.childTemplate[item._id] = template;
          }else{
            _this.fieldNameMap[item._id] = '${' + item.label + '}';
          }
          if(_this.workOrderId){
            //打印的时候要的数据处理
            if(['CheckBox','RadioButton','DropDown'].indexOf(item._type)!=-1){
              item.choices.forEach(function(item){
                _this.choiceMap[item._id] = item.value;
              });
            }
            if(item._type == 'ImageCheckBox'){
              _this.resultDetail.data.itemMap[item._id] = item.notes;
            }
          }
        })
        this.typeMap['auditSerial'] = this.typeMap['comments'] = 'ChildField';//= this.typeMap['comments']
        this.sysFields.forEach(function(item){
          if(item._type=='ChildField'){
            item.children.forEach(function(citem){
              _this.fieldNameMap[item._id+'_'+citem._id] = '${' + item.label+'_' +citem.label+ '}';
            })
          }else{
            _this.fieldNameMap[item._id] = '${' + item.label + '}';
          }
          if(_this.workOrderId){
            //打印的时候要的数据处理
            if(['CheckBox','RadioButton','DropDown'].indexOf(item._type)!=-1){
              item.choices.forEach(function(item){
                _this.choiceMap[item._id] = item.value;
              });
            }
          }
        })
      },
      showPop() {
        this.showBoxFlag = true
      },
      _getMergedCells: function () {
        return this.hotTable.getPlugin("MergeCells").mergedCellsCollection
      },
      _addTableHook() {
        var _this = this,t = this.options;
        var n = Handsontable.plugins.UndoRedo;
        //记录当前鼠标在的cells的位置
        this.hotTable.addHook("afterOnCellMouseOver", function (t, n, o) {
          _this.currentCell = n
        });
        //当table选中的时候执行
        this.hotTable.addHook("afterSelectionEnd", function(n, o, i, r) {
          _this.selectRange = [n, o, i, r];
          var a = _this.hotTable.getCellMeta(n, o);
          _this.setMenuStyles(_this.printUtils.getStyleByClassName(a.className),_this._isCellMerge(n, o, i, r));
        });
        this.hotTable.addHook("beforeChange", function (t, n) {
          utils.forEach(t, function (t, n) {
            var o = _this._getCellTag(n[0], n[1]);
            utils.isEmpty(n[3]) ? _this.dataMap[o] = void 0 : _this.dataMap[o] = [n[3]]
          })
        });
        this.hotTable.addHook("afterChange", function (n) {
//          utils.forEach(n, function(n, o) {
//            o[3] && o[3].fields && (_this.fieldMap[o[3].fields[0]] = [o[0], o[1]]);
////              t.onAfterChange.apply(_this,[])
//          })
        });
        this.hotTable.addHook("beforeCellStyle", function(t, o, i) {
          var r = new n.CellStyleAction(t,o,i);
          _this.hotTable.undoRedo.done(r)
        });
//        this.hotTable.addHook("beforeCellMerge", function(o, i, r) {
//          var a = new n.CellMergeAction(o,i,r);
//          _this.hotTable.undoRedo.done(a),
//            FX.Utils.applyFunc(e, t.onAfterMerge, [e._isCellMerge(i.from.row, i.from.col, i.to.row, i.to.col), i], !1)
//        });
        this.hotTable.addHook("beforeCellBorder", function(t, o, i) {
          var r = new n.CellBorderAction(t,o,i);
          _this.hotTable.undoRedo.done(r)
        });
        this.hotTable.addHook("afterColumnResize", function(o, i) {
          var r = new n.ColWidthAction({
            col: o,
            size: _this.value.cols[o] || t.colWidth,
            newSize: i
          });
          _this.value.cols[o] = i;
          _this.hotTable.undoRedo.done(r);
          _this.hotTable.render();
          _this.setPage();
        });
        this.hotTable.addHook("afterRowResize", function(o, i) {
          i = Math.max(i, t.minRowHeight);
          var r = new n.RowHeightAction({
            row: o,
            size: _this.value.rows[o] || t.rowHeight,
            newSize: i
          });
          _this.value.rows[o] = i;
          _this.hotTable.undoRedo.done(r);
          _this.hotTable.render();
          _this.setPage();
        });
      },
      setPage(){
        this.setMenuStyles({page:this.page});
        var o = $(".ht_master", this.$refs.hotTable.$el).find(".wtHider");
        var r = 0,a = 0;//r是当前行的和，是定位用的；a是当前的能打印的行
        for (var s = 0; s < this.hotTable.countRows(); s++) {
          var l = this.getRowHeight(s);
          if ((r += l) > this.pageSize.height) {
            r -= l;
            break
          }
          a = s;
        }
        var u = this.hotTable.countCols()
          , c = 0
          , h = 0;//c是当前列的和，是定位用的；h是当前能打印的列
        for (var d = 0; d < u; d++) {
          var f = this.getColWidth(d);
          if ((c += f) > this.pageSize.width) {
            c -= f;
            break
          }
          h = d;
        }
        if(!this.previewTemplateId){
          $(".paper-horizontal", o).remove();
          $('<div class="paper-horizontal"/>').appendTo(o).css({
            top: r + 26,
            left: 30
          });
          $(".paper-vertical", o).remove();
          $('<div class="paper-vertical"/>').appendTo(o).css({
            left: c + 50,
            top: 30
          });
        }
        this.setBackground()
      },
      setBackground(){
        let o = $(".ht_master", this.$refs.hotTable.$el).find(".wtHider");
        $(".paper-background", o).remove();
        if(this.workOrderId || this.previewTemplateId){
          let height = $(".ht_master", this.$refs.hotTable.$el).find(".wtHider").height()
            ,width = $(".ht_master", this.$refs.hotTable.$el).find(".wtHider").width();
          $('<div class="paper-background"/>').appendTo(o).css({
            top: 0,
            left: 0,
            height: height,
            width: width,
            "position": "absolute",
            "overflow": "hidden",
          }).append('<img src="'+ this.paperBackground.imgUrl +'">');
          if(this.paperBackground.isPrintBg == false){
            $(".ht_master").find(".paper-background").hide();
          }
        }else {
          $('<div class="paper-background"/>').appendTo(o).css({
            top: 26,
            left: 50,
            height: this.pageSize.height,
            width: this.pageSize.width,
            "position": "absolute",
            "overflow": "hidden",
            "z-index": -1
          }).append('<img src="'+ this.paperBackground.imgUrl +'">');
        }
      },
      clearCurrentCell: function () {
        this.currentCell = null
      },
      setMenuStyles: function(e,flag) {//flag是合并和取消合并的数据flag
        this.styleData = e;
        e.page = this.page;
        this.$nextTick( function(){
          this.$refs.menu.renderMemu();
          this.$refs.menu.setMerge(flag);
        })

      },
      //设置表格的行和高
      getColWidth(e) {
        var t = this.options, n = this.value && this.value.cols;
        //如果列是在cols中，就取保存的值和最小值的最大值；没有就取最小值100
        return  n[e] || t.colWidth
      },
      getRowHeight(e) {
        var t = this.options, n = this.value && this.value.rows;
        return  n[e] || t.rowHeight
      },
      //重新设置索引的宽高
      resetSize() {
        //设置指定行索引的新高度。
        for (var c = 0, h = this.hotTable.countRows(); c < h; c++)
          this.hotTable.getPlugin("ManualRowResize").setManualSize(c, this.getRowHeight(c));
        for (var d = 0, f = this.hotTable.countCols(); d < f; d++)
          this.hotTable.getPlugin("ManualColumnResize").setManualSize(d, this.getColWidth(d));
      },
      _refreshDataMap: function() {
        var e = this
          , t = this.options
          , n = this.hotTable.getData(0, 0, this.hotTable.countRows(), this.hotTable.countCols());
        utils.forEach(n, function(n, o) {
          utils.forEach(o, function(o, i) {
            var r = e._getCellTag(n, o);
            utils.isEmpty(i) ? e.dataMap[r] && (
              e.dataMap[r] = void 0) : e.dataMap[r] = [i]
          })
        })
        this.setPage();
        this.hotTable.render();
      },
      //改变样式
      _setStyle(data) {
        if(data.type == 'page'){
          this.page.size = data.value;
          this.pageSize = this.sizeMap[this.page.size][this.page.layout];
          this.setPage();
        }
        if(data.type == 'layout'){
          this.page.layout = data.value;
          this.pageSize = this.sizeMap[this.page.size][this.page.layout];
          this.setPage();
        }
        if(data.type == 'insertBg'){
          this.insertBg()
        }
        var selectedCells = this._getSelectedRange();
        if(selectedCells){
          switch (data.type){
            case "fontStyle":
              this._setCellStyle(data,selectedCells);
              break;
            case "align":
              this._setCellAlign(data,selectedCells);
              break;
            case "border":
              this.setCellBorder(data,selectedCells);
              break;
            case "undoRedo":
              this.undoRedo(data.action);
              break;
            case "merge":
              this.mergeOrUnMerge();
              break;
            case "insertImg":
              this.insertPic();
              break;
          }
        }
      },
      clearCellData: function() {
        this.hotTable.emptySelectedCells();
        this._refreshDataMap();
      },
      mergeOrUnMerge(t){

        var n = this;
        if (t || (t = this._getSelectedRange()),
          t && !t.isSingle()) {
          var o = []
            , i = this._getCellMergeInfo(t.from.row, t.from.col);
          if (this._isCellMerge(t.from.row, t.from.col, t.to.row, t.to.col))
            return o.push(i),
              this._unMergeSelection(t),
              this.hotTable.runHooks("beforeCellMerge", o, t),
              void this.hotTable.render();
          for (var r = [], a = (t = this._formatRange(t)).from.row; a <= t.to.row; a++)//r是有值的表格的位置信息
            for (var s = t.from.col; s <= t.to.col; s++){
               this.hotTable.getDataAtCell(a, s) && r.push({//e(this.hotTable.getCell(a, s)).is(":visible") &&
                row: a,
                col: s
              });
            }
          //r是有值的表格的位置信息
          this.merge(t, r)
          if(r.length <= 1){

          }

        }
      },
      merge: function(e, t) {
        var n = this
          , o = {}
          , i = null;
        utils.forEach(t, function(e, t) {
          var r = n._getCellTag(t.row, t.col);
          o[r] = n.dataMap[r] && n.dataMap[r][0],
          i || (i = o[r])
        });
        var r = this.unMerge(e);
        if (this._mergeSelection(e),
            n.hotTable.selectCell(e.from.row, e.from.col, e.to.row, e.to.col),
            n.clearCellData(),
            n.hotTable.undoRedo.doneActions.pop(),
            i) {
          n.hotTable.setDataAtCell(e.from.row, e.from.col, i),
            n.hotTable.undoRedo.doneActions.pop();
          var a = n._getCellTag(e.from.row, e.from.col);
          o[a] || (o[a] = void 0)
        }
        this.hotTable.runHooks("beforeCellMerge", r, e, o),
          this.hotTable.render()
      },
      unMerge: function(e) {
        var t = this
          , n = [];
        return utils.forEach(this._getMergedCells().mergedCells, function(t, o) {
          o.row < e.from.row || o.col < e.from.col || o.row > e.to.row || o.col > e.to.col || n.push(o)
        }),
          utils.forEach(n, function(e, n) {
            t._getMergedCells().remove(n.row, n.col)
          }),
          n
      },
      //插入图片
      insertPic: function(){
        document.getElementById('pic').click();
      },
      insertBg: function(){
        document.getElementById('background').click();
      },
      upLoadPic(e){
        let _this= this;
        let file = e.target.files[0];
        let reader =new FileReader();
        reader.readAsDataURL(file);
        if(this.imgData.accept.indexOf(file.type) == -1){
          _.alert('您上传的不是图片文件，请上传图片文件')
        }else {
          reader.onloadend=function(){
            dataBase.loading = true
            var base64 = reader.result;
            _.ajax({
              url: _.baseURL + "/imageupload/imageUploadAction!doUploadMgrImageBase64.action",
              type: 'post',
              data: {
                imgFileBase: base64,
              },
              success: function (result) {
                dataBase.loading = false;
                if(result.code === "0"){
                  var data = {
                    text: result.data.imgurl,
                    type: "img"
                  }
                  var selectedCells = _this._getSelectedRange().from;
                  _this.hotTable.setDataAtCell(selectedCells.row, selectedCells.col, data)
                } else {
                  _.alert(result.desc);
                }
              },
              error:function(){
                dataBase.loading = false;
                _.alert('网络错误')
              }
            })
          }
        }
      },
      upLoadBg(e){
        let _this= this;
        let file = e.target.files[0];
        let reader =new FileReader();
        reader.readAsDataURL(file);
        if(this.imgData.accept.indexOf(file.type) == -1){
          _.alert('您上传的不是图片文件，请上传图片文件')
        }else {
          reader.onloadend=function(){
            dataBase.loading = true
            var base64 = reader.result;
            _.ajax({
              url: _.baseURL + "/imageupload/imageUploadAction!doUploadMgrImageBase64.action",
              type: 'post',
              data: {
                imgFileBase: base64,
              },
              success: function (result) {
                dataBase.loading = false;
                if(result.code === "0"){
                  _this.paperBackground.imgUrl = _.compressURL + result.data.imgurl;
                  _this.paperBackground.name = file.name;
                  _this.setBackground();
                } else {
                  _.alert(result.desc);
                }
              },
              error:function(){
                dataBase.loading = false;
                _.alert('网络错误')
              }
            })
          }
        }
      },
      setCellBorder: function(e, t) {
        if (t || (t = this._getSelectedRange()),
            t) {
          t = this._formatRange(t);
          var n = this._getCellBorders(t);
          this.hotTable.runHooks("beforeCellBorder", n, t, e);
          switch (e.action) {
            case "borderLine":
              this._dealBorder(t, e.value);
              break;
            case "borderWeight":
              this._dealBorderWeight(t, e.value)
          }
        }
      },
      _dealBorderWeight: function(e, t) {
        if (t > 0)
          for (var n = "border-width-" + t, o = e.from.row; o <= e.to.row; o++)
            for (var i = e.from.col; i <= e.to.col; i++) {
              var r = this.hotTable.getCellMeta(o, i).className;
              r = r ? [r = r.replace(/border-width-[0-4]{1}/, "").replace("  ", " "), n].join(" ") : n,
                this.hotTable.setCellMeta(o, i, "className", r)
            }
        else
          this._removeAllBorders(e);
        this.hotTable.render()
      },
      //判断选中的范围是否为合并
      _isCellMerge: function(e, t, n, o) {
        var i = this._getCellMergeInfo(e, t);
        return i && e + i.rowspan - 1 === n && t + i.colspan - 1 === o
      },
      _mergeSelection: function(e) {
        this.hotTable.getPlugin("MergeCells").mergeSelection(e)
      },
      _unMergeSelection: function(e) {
        this.hotTable.getPlugin("MergeCells").unmergeSelection(e)
      },
      _getCellMergeInfo: function(e, t) {
        return this._getMergedCells().get(e, t)
      },
      _dealBorder: function(e, t) {
        switch (this._isCellMerge(e.from.row, e.from.col, e.to.row, e.to.col) && (e = {
          from: e.from,
          to: e.from
        }),
          t) {
          case "none":
            this._removeAllBorders(e);
            break;
          case "top":
            for (var n = e.from.col; n <= e.to.col; n++)
              this._setBorder(e.from.row, n, t);
            break;
          case "right":
            for (var o = e.from.row; o <= e.to.row; o++) {
              var i = e.to.col;
              this._isCellColMerge(o, e.from.col, e.to.col) && (i = e.from.col),
                this._setBorder(o, i, t)
            }
            break;
          case "bottom":
            for (var r = e.from.col; r <= e.to.col; r++) {
              var a = e.to.row;
              this._isCellRowMerge(e.from.row, r, e.to.row) && (a = e.from.row),
                this._setBorder(a, r, t)
            }
            break;
          case "left":
            for (var s = e.from.row; s <= e.to.row; s++)
              this._setBorder(s, e.from.col, t);
            break;
          case "all":
            this._setAllBorder(e);
            break;
          case "outer":
            this._setOuterBorder(e)
        }
        this.hotTable.render()
      },
      _getCellBorders: function(e) {
        for (var t = {}, n = e.from.row; n <= e.to.row; n++)
          for (var o = e.from.col; o <= e.to.col; o++)
            t[this._getCellTag(n, o)] = this.hotTable.getCellMeta(n, o).className;
        return t
      },
      _dealBorderState: function(e, t) {
        for (var n = e.from.row; n <= e.to.row; n++)
          for (var o = e.from.col; o <= e.to.col; o++) {
            var i = t[this._getCellTag(n, o)];
            this.hotTable.setCellMeta(n, o, "className", i)
          }
        this.hotTable.render()
      },
      _setOuterBorder: function(e) {
        for (var t = e.from.row; t <= e.to.row; t++)
          for (var n = e.from.col; n <= e.to.col; n++) {
            var o = [];
            if (t === e.from.row && o.push("border-top"),
              (t === e.to.row || this._isCellRowMerge(t, n, e.to.row)) && o.push("border-bottom"),
              n === e.from.col && o.push("border-left"),
              (n === e.to.col || this._isCellColMerge(t, n, e.to.col)) && o.push("border-right"),
                !utils.isObjectEmpty(o)) {
              var i = this.hotTable.getCellMeta(t, n).className;
              i ? (utils.forEach(o, function(e, t) {
                new RegExp(t).test(i) || (i += " " + t)
              }),
                i = i.replace("  ", " ")) : i = o.join(" "),
                this.hotTable.setCellMeta(t, n, "className", i)
            }
          }
        this.hotTable.render()
      },
      _setAllBorder: function(e) {
        var t = [];
        utils.forEach(["top", "right", "bottom", "left"], function(e, n) {
          t.push(["border", n].join("-"))
        });
        for (var n = e.from.row; n <= e.to.row; n++)
          for (var o = e.from.col; o <= e.to.col; o++) {
            var i = this.hotTable.getCellMeta(n, o).className;
            i ? (utils.forEach(t, function(e, t) {
              new RegExp(t).test(i) || (i += " " + t)
            }),
              i = i.replace("  ", " ")) : i = t.join(" "),
              this.hotTable.setCellMeta(n, o, "className", i)
          }
      },
      _removeAllBorders: function(e) {
        for (var t = e.from.col; t <= e.to.col; t++)
          for (var n = e.from.row; n <= e.to.row; n++) {
            var o = this.hotTable.getCellMeta(n, t).className;
            o && (o = o.replace("border-left", "").replace("border-right").replace("border-top", "").replace("border-bottom", "").replace("  ", " ")),
              this.hotTable.setCellMeta(n, t, "className", o)
          }
      },
      _setBorder: function(e, t, n) {
        var o = "border-" + n
          , i = this.hotTable.getCellMeta(e, t).className;
        i && !new RegExp("border-" + n).test(i) ? i += " " + o : i = o,
          this.hotTable.setCellMeta(e, t, "className", i)
      },
      _setCellStyle: function(e,t) {
        var n = this._getCellClasses(t);
        this.hotTable.runHooks("beforeCellStyle", n, t, e);
          switch (e.action) {
            case "fontSize":
              this._dealFontSize(t, e.value);
              break;
            case "fontFamily":
              this._dealFontFamily(t, e.value);
              break;
            case "fontColor":
              this._dealFontColr(t, e.value);
              break;
            default:
              this._dealFontStyle(t, e.action);
        }
      },
      //改变位置数据
      _setCellAlign: function(e) {
        var t = this._getSelectedRange();
        if (t) {
          var n = this._prepareAlignStyle(e.action);
          this._dealAlignment(t, n.type, n.alignment)
        }
      },
      _dealAlignment: function(e, t, n) {
        var o = this._getCellClasses(e);
        if (this.hotTable.runHooks("beforeCellAlignment", o, [e], t, n),
          e.from.row == e.to.row && e.from.col == e.to.col)
          this._applyAlignClassName(e.from.row, e.from.col, t, n);
        else
          for (var i = (e = this._formatRange(e)).from.row; i <= e.to.row; i++)
            for (var r = e.from.col; r <= e.to.col; r++)
              this._applyAlignClassName(i, r, t, n);
        this.hotTable.render()
      },
      _applyAlignClassName: function(e, t, n, o) {
        var i = this.hotTable.getCellMeta(e, t)
          , r = o;
        i.className && (r = "vertical" === n ? this._prepareVerticalAlignClass(i.className, o) : this._prepareHorizontalAlignClass(i.className, o)),
          i.className = r
      },
      _prepareVerticalAlignClass: function(e, t) {
        return -1 != e.indexOf(t) ? e : (e = e.replace("htTop", "").replace("htMiddle", "").replace("htBottom", "").replace("  ", " "),
          e += " " + t)
      },
      _prepareHorizontalAlignClass: function(e, t) {
        return -1 != e.indexOf(t) ? e : (e = e.replace("htLeft", "").replace("htCenter", "").replace("htRight", "").replace("htJustify", "").replace("  ", " "),
          e += " " + t)
      },
      _prepareAlignStyle: function(e) {
        switch (e) {
          case "top":
            return {
              type: "vertical",
              alignment: "htTop"
            };
          case "bottom":
            return {
              type: "vertical",
              alignment: "htBottom"
            };
          case "middle":
            return {
              type: "vertical",
              alignment: "htMiddle"
            };
          case "left":
            return {
              type: "horizontal",
              alignment: "htLeft"
            };
          case "right":
            return {
              type: "horizontal",
              alignment: "htRight"
            };
          case "center":
            return {
              type: "horizontal",
              alignment: "htCenter"
            }
        }
      },
      undoRedo: function(e) {
        switch (e) {
          case "undo":
            this.hotTable.undo();
            break;
          case "redo":
            this.hotTable.redo()
        }
      },
      /**
       *
       方法说明
       @method drag,dragenter,drop H5原生拖拽事件
       *
       @param {event} event 事件
       */
      drag(event, prop,parent,isTitle) {
        this.clearCurrentCell();
        this.dom = {field:prop,parent:parent,isTitle:isTitle};
        event.dataTransfer.setData("infoName"," ");//兼容火狐浏览器
      },
      dragenter(event) {
          if (this.hotTable.getCoords(event.target) != null) {
            let r = this.hotTable.getCoords(event.target).row,
              c = this.hotTable.getCoords(event.target).col;
            this.hotTable.selectCell(r, c);
            this.currentCell = {row: r, col: c};
          }
      },
      drop(event) {
        var prop = this.dom;
        if (this.currentCell && prop) {
          if(prop.isTitle){
            this.hotTable.setDataAtCell(this.currentCell.row, this.currentCell.col, prop.field.label);
            return;
          }
          var data = {
            text: prop.field._id,
            fields: [prop.field._id]
          };
          if(prop.parent){
            data = {
              text: prop.parent._id+'_'+prop.field._id,
              fields: [prop.parent._id+'_'+prop.field._id],
              index: 0
            }
          }
          this.hotTable.setDataAtCell(this.currentCell.row, this.currentCell.col, data)
        }
      },
      end(event) {
        event.target.style.borderColor = "#E5E5E5"
        event.target.style.backgroundColor = "#F7F7F7"
      },
      allowDrop(event) {
        event.preventDefault();
      },
      _getCellTag: function (e, t) {
        return [e, t].join(":")
      },
      _splitCellTag: function (e) {
        var t = e.split(":")
          , n = parseInt(t[0])
          , o = parseInt(t[1]);
        return utils.isNumber(n) && utils.isNumber(o) ? [n, o] : []
      },
      //根据value处理，据保存的数据内容，不同类型做不同的处理,渲染表格的值
      _getCellText: function (t,h) {
        var o = "";
        if ("string" == typeof t)
          o += t;
        else if (t.text){
          //预览的时候的处理
          if(this.workOrderId){
            try{
              var value = this.newItemMap[t.text]
                ,type = this.typeMap[t.text];
              if(utils.isArray(value)){
                if(this.typeMap[t.text.split('_')[1]] == 'ImageField'){//子表单图片字段
                  value = this._getImgStr(this.newItemMap[t.text][t.index],h);
                }
                if(type == 'ImageField'){//表单图片字段
                  value = this._getImgStr(this.newItemMap[t.text],h);
                }
                if(type != 'ImageField' && this.typeMap[t.text.split('_')[1]] != 'ImageField'){
                  value = this.newItemMap[t.text][t.index];
                  if(value && (value.includes('jpeg')||value.includes('jpg')||value.includes('png'))){//评论内容为图片
                    var pat=/\/upload\/img(.*).?(gif|png|jpg|jpeg)$/;
                    var r=pat.exec(value);
                    value = value.replace(r[0],'<div style="height:' + (h-11) + 'px; display:inline-block"><img style=" height: 100%" src="'+_.compressURL+r[0]+'"/></div>')
                  }
                  if(type == 'AccessoryField'){value = this.newItemMap[t.text]};
                }
                if(type == 'CheckBox'){
                  value = this.newItemMap[t.text].join(',')
                }
              }
              o +=  value || '';
              if(type == 'GeoField'){
                o = this.newItemMap[t.text].value;
              }
            }catch(e){

            }
            //模板时的处理
          }else{
            o += this.fieldNameMap[t.text] || '';
          }
          if(t.type && t.type == 'img'){
            o = '<img class="fieldImg" src="' + _.compressURL + t.text + '" style="height:' + (h-11) + 'px">'
          }
        }
        return o
      },
      _getImgStr: function(imgList,h){
        var imgStr = '';
        for(let i = 0;i<imgList.length;i++){
          imgStr += '<img class="fieldImg" src="' + _.compressURL + imgList[i] + '" style="height:' + (h-11) + 'px">';
        }
        return imgStr;
      },
      _isCellRowMerge: function(e, t, n) {
        var o = this._getCellMergeInfo(e, t);
        return o && e + o.rowspan - 1 === n && t === o.col
      },
      _isCellColMerge: function(e, t, n) {
        var o = this._getCellMergeInfo(e, t);
        return o && t + o.colspan - 1 === n && e === o.row
      },
      _getSelectedRange: function() {
        var e = this.hotTable.getSelectedRange();
        return e && e[0]
      },
      _getCellClasses: function(e) {
        for (var t = {}, n = e.from.row; n <= e.to.row; n++)
          for (var o = e.from.col; o <= e.to.col; o++)
            t[n] || (t[n] = []),
              t[n][o] = this.hotTable.getCellMeta(n, o).className;
        return t
      },
      _dealFontSize: function(e, t) {
        if (e.from.row == e.to.row && e.from.col == e.to.col)
          this._dealFontSizeClass(e.from.row, e.from.col, t);
        else
          for (var n = (e = this._formatRange(e)).from.row; n <= e.to.row; n++)
            for (var o = e.from.col; o <= e.to.col; o++)
              this._dealFontSizeClass(n, o, t);
        this.hotTable.render()
      },
      _dealFontFamily: function(e,t){
        if (e.from.row == e.to.row && e.from.col == e.to.col)
          this._dealFontFamilyClass(e.from.row, e.from.col, t);
        else
          for (var n = (e = this._formatRange(e)).from.row; n <= e.to.row; n++)
            for (var o = e.from.col; o <= e.to.col; o++)
              this._dealFontFamilyClass(n, o, t);
        this.hotTable.render()
      },
      _dealFontColr:function(e,t){
        if (e.from.row == e.to.row && e.from.col == e.to.col)
          this._dealFontColorClass(e.from.row, e.from.col, t);
        else
          for (var n = (e = this._formatRange(e)).from.row; n <= e.to.row; n++)
            for (var o = e.from.col; o <= e.to.col; o++)
              this._dealFontColorClass(n, o, t);
        this.hotTable.render()
      },
      _dealFontSizeClass: function(e, t, n) {
        var o = this.hotTable.getCellMeta(e, t)
          , i = "font-size-" + n;
        o.className && (o.className = o.className.replace(/font-size-[0-9]{1,2}/, "").replace("  ", " "),
          i = o.className + " " + i),
          o.className = i
      },
      _dealFontFamilyClass: function(e, t, n){
        var o = this.hotTable.getCellMeta(e, t)
          , i = "font-family-" + n.key;
        o.className && (o.className = o.className.replace(/font-family-[a-zA-Z]+/, "").replace("  ", " "),
          i = o.className + " " + i),
          o.className = i
      },
      _dealFontColorClass: function(e,t,n){
        var o = this.hotTable.getCellMeta(e, t)
          , i = n.name;
        o.className && (o.className = o.className.replace(/font-color-[0-9A-Z]{6}/, "").replace("  ", " "),
          i = o.className + " " + i),
          o.className = i
      },
      _applyStyleClassName: function(e, t, n, o, i) {
        var r = this.hotTable.getCellMeta(e, t);
        r.className = this._prepareStyleClass(r.className, n, o, i)
      },
      _prepareStyleClass: function(e, t, n, o) {
        return e ? n && -1 !== e.indexOf(t) || !n && !o ? e = e.replace("" + t, "").replace("  ", " ") : (n || !n && o && -1 === e.indexOf(t)) && (e += " " + t) : (n || o) && (e = t),
          e
      },
      _dealFontStyle: function(e, t) {
        if (e.from.row == e.to.row && e.from.col == e.to.col)
          this._applyStyleClassName(e.from.row, e.from.col, t, !0);
        else {
          var n = this.hotTable.getCellMeta(e.from.row, e.from.col)
            , o = !0;
          n.className && (o = -1 === n.className.indexOf(t));
          for (var i = (e = this._formatRange(e)).from.row; i <= e.to.row; i++)
            for (var r = e.from.col; r <= e.to.col; r++)
              this._applyStyleClassName(i, r, t, !1, o)
        }
        this.hotTable.render()
      },
      _formatRange: function(e) {//选中的数据的格式化，返回选中的表格的开始和结束表格位置
        if (!utils.isObjectEmpty(e) && e.from && e.to) {
          var t = {
            row: e.from.row,
            col: e.from.col
          }
            , n = {
            row: e.to.row,
            col: e.to.col
          };
          e.from.row = t.row <= n.row ? t.row : n.row,
            e.to.row = t.row <= n.row ? n.row : t.row,
            e.from.col = t.col <= n.col ? t.col : n.col,
            e.to.col = t.col <= n.col ? n.col : t.col
        }
        return e
      },
      //范围的限制的代码
      _setCellData: function (e, t, n) {//e行，t列，n表格的内容
        if (n) {
          var o = this._splitCellTag(this.value.range.e);
          if (!this.data) {
            this.data = [];
            for (var i = 0; i <= o[0]; i++){
              this.data[i] = [];
              this.data[i].length = o[1];
            }
          }
          //如果列大于最大的列数，不设置数据
          if( t > o[1])return;
//          不是图片就直接赋值
          this.data[e][t] = n
        }
      },
      _createBordersByStyle: function (e, t, n) {//e行，列，n是style{border-left-width:0，border-right-width:0，border-style:"solid"，border-top-width:0，border-width:1}
        if (n) {
          var o = n["border-style"];
          if (o && "none" !== o) {
            var i = []
              , r = n["border-width"];
            return r && i.push("border-width-" + r),
              utils.forEach(["top", "right", "bottom", "left"], function (e, t) {
                var o = ["border", t, "width"].join("-");
                (n[o] || 0 !== n[o] && r) && i.push(["border", t].join("-"))
              }),
              i.join(" ")
          }
        }
      },
      getValue() {
        this.printUtils.initStyles();
        var countRows = this.hotTable.countRows(), countCols = this.hotTable.countCols(), cells = {}, a = {};
        var s = {}
          , l = 0
          , u = 0
          , c = {}, r = {};
        c['default'] = !0;
        for (var h = 0; h < countRows; h++)
          for (var d = 0; d < countCols; d++) {
            var f = this.hotTable.getCellMeta(h, d);
            if (f) {
              var p = this._getCellTag(f.row, f.col);
              if (!a[p]) {
                var g = this.dataMap[p]
                  , v = this.printUtils.getStyleNameByCell(f)
                  , m = !1;
                utils.forEach(g, function (e, t) {
                  if (t && t.fields)
                    return m = !0,
                      !1
                });
                var y = !1;
                utils.forEach(g, function (e, t) {
                  if (t)
                    return y = !0,
                      !1
                }),
                y && (g = this.printUtils.formatData(g));
                var w = this.printUtils.hasBorder(v);
                if (y || w) {
                  c[v] = !0;
                  var b = f.row
                    , C = f.col;
                  if (r[p]) {
                    var _ = t._splitCellTag(r[p]);
                    b = _[0],
                      C = _[1]
                  }
                  b > l && (l = b),
                  C > u && (u = C),
                    cells[p] = {
                      content: g,
                      style: v,
                      hasField: m
                    }
                }
              }
            }
          }
        for (var rows = [], k = 0; k <= countRows; k++) {
          var M = this.hotTable.getRowHeight(k) || this.options.rowHeight;
          rows.push(M)
        }
        for (var cols = [], N = 0; N <= countCols; N++) {
          var A = this.hotTable.getColWidth(N) || this.options.colWidth;
          cols.push(A)
        }
        var merge = this.hotTable.getPlugin("MergeCells").mergedCellsCollection.mergedCells;
        var styles = this.printUtils.getStyles();
        var data = {
          cols: cols,
          rows: rows,
          cells: cells,
          merge: merge,
          range: {
            s: '0:0',
            e: this._getCellTag(l, u)//有数据保存的cell的最大的行和列
          },
          paperBackground: {
            imgUrl: this.paperBackground.imgUrl,
            isPrintBg: this.paperBackground.isPrintBg,
            name:  this.paperBackground.name
          },
          isApprove: this.isApprove,
          styles: styles,
          page:this.page
        }
        return data;
      },
      setValue(e) {
        try{
          if(typeof e == 'string'){
            e = JSON.parse(e)
          }
        }catch(ex){
          e = {};
        }
        var t = this
          , n = this.options;
        this.data = null;
        utils.isObjectEmpty(e) && (e = this._getDefaultValue()),
          this.value = e,
          this.imageMap = e.images || {},
          this.dataMap = {},
          this.styleMap = {},
          this.page.size = e.page && e.page.size||'A4';
          this.page.layout = e.page && e.page.layout || 'portrait',
          this.pageSize = this.sizeMap[this.page.size][this.page.layout],
          this.fieldMap = {},
          this.borderState = {},
          this.isApprove = e.isApprove || this._getDefaultValue().isApprove;
          this.paperBackground = e.paperBackground || this._getDefaultValue().paperBackground;
          this.printUtils = new PrintUtils(e.styles, this.imageMap, e.dpi);
        var newCells = JSON.parse(JSON.stringify(this.value.cells));
        if(this.workOrderId || this.previewTemplateId){
          var maxCols = 0;
          var sumCols = 0;
          var _this = this;
          utils.forEach(e.cols,function(i,item){
            sumCols += item;
            if(sumCols>_this.pageSize.width){
              maxCols = i;
              return false;
            }
          });
          var maxRows = 0;
          var sumRows = 0;
          utils.forEach(e.cols,function(i,item){
            sumRows += item;
            if(sumRows>_this.pageSize.height){
              maxRows = i;
              return false;
            }
          });
         //修改字表的数据
          var obj = this._addChildRow(newCells);
          newCells = obj.cells;

          var o = this._splitCellTag(this.value.range.e);
          this.value.range.e = this._getCellTag(parseInt(obj.addCount)+o[0], maxCols);
        }
        //o是单元格cells的数据数组,主要渲染的是样式的数据
        var o = [];
        utils.forEach(newCells, function (n, i) {
          var r = t._splitCellTag(n);
          if (!utils.isObjectEmpty(r)) {
            //a是第几行，s是第几列
            var a = r[0]
              , s = r[1];
            t.dataMap[n] = i.content;//将返回具体的表格的数据保存到this对象的dataMap
            t.styleMap[n] = t.printUtils.style2ClassName(i.style);//将表格对应的样式信息数据
            t.borderState[n] = t._createBordersByStyle(a, s, e.styles[i.style]);
            i.content && t._setCellData(a, s, i.content[0]);//i.content[0]表格的内容,设置this.data的数据
            var l = [];
            //如果当前的cell有styleMap和borderState的数据拼接两个数据
            t.styleMap[n] && l.push(t.styleMap[n]),
            t.borderState[n] && l.push(t.borderState[n]);
            var u = "";
            utils.isObjectEmpty(l) || (u = l.join(" ")),
            utils.isEmpty(u) || o.push({
              row: a,
              col: s,
              prop: {
                className: u
              }
            })
          }
        });
        var i = n.minRows//配置的最小行数
        var s = {
          data: this.data
        };
        //如果是预览的页面
        if(this.workOrderId || this.previewTemplateId){
//          //根据页面大小设置显示的列数
          $('.print-table.preview').css('width',this.pageSize.width+120);
          $('.print-table .wtHider').css('margin','auto')
          s.minCols = maxCols;
          s.minRows = 30;
        }
//        i > n.minRows && (s.minRows = i);
//        s.minRows = 100;
//        s.minCols = 25;
//        var l = this._splitCellTag(this.value.range.e);
//        l[1] + 1 > n.minCols && (s.minCols = l[1] + 1),
//        l[0] + 1 > i && (s.minRows = l[0] + 1),
        this.hotTable.updateSettings(s);
        var u = this._getMergedCells();
        utils.forEach(this.value.merge, function (e, t) {
          u.add(t)
        });
        this.isMerge = true;
        //设置指定行索引的新高度。
        for (var c = 0, h = this.hotTable.countRows(); c < h; c++)
          this.hotTable.getPlugin("ManualRowResize").setManualSize(c, this.getRowHeight(c));
        for (var d = 0, f = this.hotTable.countCols(); d < f; d++)
          this.hotTable.getPlugin("ManualColumnResize").setManualSize(d, this.getColWidth(d));
        //循环设置单元格数据[{"row":2,"col":1,"prop":{"className":"bold"}},{"row":3,"col":3,"prop":{"className":"bold"}},{"row":6,"col":4,"prop":{"className":"underline"}},{"row":10,"col":2,"prop":{"className":"ff-SimHei"}},{"row":10,"col":3,"prop":{"className":"italic"}}]
        utils.forEach(o, function (e, n) {
          t.hotTable.setCellMetaObject(n.row, n.col, n.prop)
        });
        this.hotTable.render();//重新渲染属性
        !this.workOrderId && this.setPage();//不是预览的页面就设置页面page
        this.setBackground();
      },
      _resetStyle(){
        for(var i = 0;i<100;i++){
          for(var j = 0;j<25;j++){
            this.hotTable.setCellMetaObject(i, j, {className:''})
          }
        }
      },
      _addChildRow(newCells){
          //修改cells的数据
          var _this = this;
          var rowDataMap = {};
          var childFieldRowLength = {};//表示在那一列插入多少行
          utils.forEach(newCells, function (key, val) {
            var row = parseInt(key.split(':')[0]);
            var col = parseInt(key.split(':')[1]);
            //如果是子表单的字段显示cells
            if(val.hasField){
              var key =  val.content[0].text.split('_')[0];//判断是否是子表数据
              if(['ChildField','FORMREFCustomerField'].indexOf(_this.typeMap[key]) != -1){
                childFieldRowLength[row] = _this.itemMap[key] && _this.itemMap[key].length;
              }
            }
            if(!rowDataMap[row]){
              rowDataMap[row] = [];
            }
            rowDataMap[row].push({col:col,data:val})
          });
        var newRowDataMap = JSON.parse(JSON.stringify(rowDataMap));
        //循环插入数据开始
        var addCount = 0;
        for(var key in childFieldRowLength){
          var coord = {};
          var length = childFieldRowLength[key];
          key = parseInt(key) + addCount;
          if(length > 1){
            //如果字表的数据大于1，进行插入操作
            utils.forEach(newRowDataMap,function(row,list){
              //list是原来的数据
              if(row == key){
                for(var i = 1;i<length;i++){
                  var newList = JSON.parse(JSON.stringify(list))
                  coord[parseInt(row) + i] = newList;
                  utils.forEach(newList,function(key,prop){
                    if(prop.data.content && prop.data.hasField){
                      prop.data.content[0].index = i;
                    }
                  })
                }
              }
              if(row > key){
                coord[parseInt(row)+(length-1)] = list;
                delete newRowDataMap[row]
              }
            })
            //重新组合cells的数据
            Object.assign(newRowDataMap,coord);
            var newMerge = [];
            utils.forEach(this.value.merge,function(ckey,value){
              //如果子表的值的单元格是合并的
              if(value.row == key){
                for(var i = 1;i < length;i++){
                  var newValue = JSON.parse(JSON.stringify(value));
                  newValue.row = newValue.row + i;
                  newMerge.push(newValue)
                }
              }
              if(value.row > key){
                value.row = value.row + length-1;
              }
            });
            this.value.merge.push.apply(this.value.merge,newMerge);
            //修改rows的数据
            for(var i = 1;i<length;i++){
              this.value.rows.splice(key,0,this.value.rows[key])
            }
            addCount += (length-1);
          }
        }

          //循环插入数据结束




        var cells = {};
        utils.forEach(newRowDataMap,function(key,val){
          utils.forEach(val,function(i,content){
            cells[key+ ':' + content.col] = content.data;
          })

        })
        return { cells: cells, addCount: addCount};

      },
      _getDefaultValue: function () {
        return {
          rows: [],
          cols: [],
          merge: {},
          images: {},
          cells: {},
          styles: {},
          background: {},
          page: {
            size: "A4",
            layout: "portrait"
          },
          paperBackground: {
            imgUrl: "",
            name: '',
            isPrintBg: true
          },
          isApprove: {
            on: true
          },
        }
      },
      _expandTable: function() {
        var e = this
          , t = Handsontable.plugins.UndoRedo;
        t.CellStyleAction = function(e, t, n) {
          this.stateBefore = e,
            this.range = t,
            this.style = n
        }
          ,
          t.CellStyleAction.prototype.undo = function(e, t) {
            for (var n = this.range.from.row; n <= this.range.to.row; n++)
              for (var o = this.range.from.col; o <= this.range.to.col; o++)
                e.setCellMeta(n, o, "className", this.stateBefore[n][o]);
            e.addHookOnce("afterRender", t),
              e.render()
          }
          ,
          t.CellStyleAction.prototype.redo = function(t, n) {
            t.selectCell(this.range.from.row, this.range.from.col, this.range.to.row, this.range.to.col),
              e._setCellStyle(this.style, this.range),
              t.addHookOnce("afterRender", n),
              t.render()
          }
          ,
          t.CellMergeAction = function(e, t, n) {
            this.stateBefore = e,
              this.dataBefore = n,
              this.range = t
          }
          ,
          t.CellMergeAction.prototype.undo = function(t, n) {
            e.unMerge(this.range),
              utils.forEach(this.stateBefore, function(e, n) {
                t.getPlugin("MergeCells").mergedCellsCollection.add(n)
              }),
              utils.forEach(this.dataBefore, function(n, o) {
                var i = e._splitCellTag(n);
                t.setDataAtCell(i[0], i[1], o),
                  t.undoRedo.doneActions.pop()
              }),
              t.addHookOnce("afterRender", n),
              t.render()
          }
          ,
          t.CellMergeAction.prototype.redo = function(t, n) {
            e.mergeOrUnMerge(this.range),
              t.addHookOnce("afterRender", n),
              t.render()
          }
          ,
          t.CellBorderAction = function(e, t, n) {
            this.stateBefore = e,
              this.range = t,
              this.data = n
          }
          ,
          t.CellBorderAction.prototype.undo = function(t, n) {
            e._dealBorderState(this.range, this.stateBefore),
              t.addHookOnce("afterRender", n),
              t.render()
          }
          ,
          t.CellBorderAction.prototype.redo = function(t, n) {
            e.setCellBorder(this.data, this.range),
              t.addHookOnce("afterRender", n),
              t.render()
          }
          ,
          t.RowHeightAction = function(e) {
            this.stateBefore = e
          }
          ,
          t.RowHeightAction.prototype.undo = function(t, n) {
            t.getPlugin("ManualRowResize").setManualSize(this.stateBefore.row, this.stateBefore.size),
              e.value.rows[this.stateBefore.row] = this.stateBefore.size,
              t.addHookOnce("afterRender", n),
              t.render()
          }
          ,
          t.RowHeightAction.prototype.redo = function(t, n) {
            t.getPlugin("ManualRowResize").setManualSize(this.stateBefore.row, this.stateBefore.newSize),
              e.value.rows[this.stateBefore.row] = this.stateBefore.newSize,
              t.addHookOnce("afterRender", n),
              t.render()
          }
          ,
          t.ColWidthAction = function(e) {
            this.stateBefore = e
          }
          ,
          t.ColWidthAction.prototype.undo = function(t, n) {
            t.getPlugin("ManualColumnResize").setManualSize(this.stateBefore.col, this.stateBefore.size),
              e.value.cols[this.stateBefore.col] = this.stateBefore.size,
              t.addHookOnce("afterRender", n),
              t.render()
          }
          ,
          t.ColWidthAction.prototype.redo = function(t, n) {
            t.getPlugin("ManualColumnResize").setManualSize(this.stateBefore.col, this.stateBefore.newSize),
              e.value.cols[this.stateBefore.col] = this.stateBefore.newSize,
              t.addHookOnce("afterRender", n),
              t.render()
          }
      },
    },

  };
</script>
<style src="../../../../static/css/handsontable.full.css"></style>
<style>
  body {
    font-size: 14px;
    color: #383838;
  }
  .mb40{
    margin-bottom: 40px;
  }
  .preview{
    position: relative;
    width:796px;
    margin: 70px auto;
    padding: 40px 60px;
    box-sizing: border-box;
  }
  .preview.preview-background{
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
    background-color: #fff;
  }
  .field-title .active {
    border-bottom: 3px solid #C31725;
  }
  /* 改变插件z-index */
  .ht_clone_top, .ht_clone_left, .ht_clone_top_left_corner, .ht_clone_bottom_left_corner {
    z-index: 99;
  }
  .preview-mask {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 21;
  }
  .preview .handsontable tr, .preview .handsontable th, .preview .handsontable td {
    border: 0;
  }
  .preview .handsontable tr:first-child th, .preview .handsontable tr:first-child td {
    border-top: 0;
  }
  @media print {
    body {
      background-color: #fff;
    }
    .preview.preview-background {
      margin: 0 auto;
      padding: 0;
      box-shadow: none;
    }

    .isPrinted-msg {
      display: none;
    }

    .print-footer {
      display: none;
    }

    .print-icon-status {
      top: 0!important;
      right: 0!important;
    }
  }
  .print-head {
    position: relative;
    height: 72px;
    line-height: 72px;
    padding-left: 16px;
    box-sizing: border-box;
    border-bottom: 1px solid #e0e0e0;
  }

  .print-head .form-name {
    display: inline-block;
    max-width: 375px;
    line-height: 24px;
    font-size: 18px;
    padding-bottom: 4px;
    margin-top: 21px;
    border-bottom: 1px dashed #ccc;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .print-head .form-name input {
    width: 150px;
    height: 30px;
    font-size: 18px;
    border: 0;
  }

  .print-head .custom-btn {
    position: absolute;
    right: 32px;
    top: 0;
  }
  .print-head .custom-btn .help-btn {
    color: #F87B00;
    height: 19px;
    line-height: 19px;
    margin-right: 24px;
    cursor: pointer
  }
  .print-head .custom-btn .help-btn::before {
    content: '?';
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: #fff;
    font-size: 12px;
    margin-right: 8px;
    border-radius: 50%;
    background: #F87B00;
    text-align: center;
  }
  .print-head .custom-btn .reset-btn {
    height: 32px;
    line-height: 32px;
    padding: 7px 22px;
    border-radius: 2px;
    background-color: #fbfbfb;
    color: #666666;
    cursor: pointer;
    border: 1px solid #CBCBCB;
  }
  .print-head .custom-btn .preview-btn {
    height: 32px;
    line-height: 32px;
    padding: 7px 22px;
    margin-left: 20px;
    border-radius: 2px;
    background-color: #fbfbfb;
    color: #666666;
    cursor: pointer;
    border: 1px solid #CBCBCB;
  }
  .print-head .custom-btn .save-btn {
    height: 32px;
    line-height: 32px;
    padding: 7px 22px;
    margin-left: 20px;
    border-radius: 2px;
    background-color: #C31725;
    color: #fff;
    cursor: pointer;
  }

  .print-body {
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .print-body .print-field {
    position: relative;
    width: 200px;
    height: 100%;
    background: #fff;
  }

  .print-body .print-field .field-title {
    display: flex;
    box-sizing: border-box;
    height: 44px;
    line-height: 44px;
    color: #383838;
    border-right: 1px solid #E5E5E5;
    border-bottom: 1px solid #E5E5E5;
    text-align: center;
  }

  .print-body .print-field .field-title span {
    flex: 1;
    display: inline-block;
    cursor: pointer;
  }

  .print-body .print-field .field-list {
    position: absolute;
    top: 92px;
    bottom: 0;
    width: 200px;
    padding: 20px 16px;
    overflow-y: auto;
    box-sizing: border-box;
    background: #fff;
  }
  .print-field .field-tab {
    display: flex;
    margin: 16px;
    border:1px solid #E5E5E5;
    color: #808080;
    background: #F7F7F7;
    border-radius:4px;
  }
  .print-field .field-tab div {
    flex: 1;
    height: 28px;
    line-height: 28px;
    text-align: center;
    font-weight: 400;
    cursor: pointer;
  }
  .print-field .field-tab div.active {
    color: #fff;
    background: #C31725;
    border:1px solid #F87B00;
  }
  .print-body .print-field .field-list .child-field {
    position: relative;
  }
  .print-body .print-field .field-list .child-icon {
    position: absolute;
    top: 10px;
    width: 6px;
    height: 6px;
    border-left: 2px solid #FFBA75;
    border-bottom: 2px solid #FFBA75;
  }
  .print-body .print-field .field-list .child-field-item {
    margin-left: 16px;
  }
  .field-list .label {
    position: relative;
    color: #808080;
    margin: 32px 0 16px;
  }
  .field-list > .label {
    margin-top: 0;
  }
  .field-list .label .help {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: #fff;
    font-size: 12px;
    margin-left: 8px;
    border-radius: 50%;
    background: #F87B00;
    text-align: center;
    user-select: none;
  }
  .print-body .print-field .field-list .field-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 28px;
    line-height: 26px;
    border: 1px dashed #E5E5E5;
    border-radius: 2px;
    font-size: 12px;
    background-color: #F7F7F7;
    padding-left: 8px;
    margin-bottom: 12px;
    box-sizing: border-box;
    cursor: move;
  }
  .print-body .print-field .field-list .field-item:hover,
  .print-body .print-field .field-list .field-item:active {
    border: 1px dashed rgba(248,123,0,0.5) !important;
    background: rgba(248,123,0,0.1) !important;
  }
  .field-list .show-tips {
    position: absolute;
    top: -4px;
    left: 125px;
    display: none;
    border-radius: 2px;
    font-size: 12px;
    line-height: 18px;
    padding: 12px 10px;
    color: #383838;
    -webkit-box-shadow: 1px 2px 5px 2px rgba(51,51,51,.15);
    box-shadow: 1px 2px 5px 2px rgba(51,51,51,.15);
    background: #fff;
    white-space: nowrap;
    z-index: 9999;
  }
  .field-list .show-tips::after {
    position: absolute;
    top: 10px;
    left: -10px;
    content: "";
    border-top: 5px solid transparent;
    border-right: 5px solid #fff;
    border-bottom: 5px solid transparent;
    border-left: 5px solid transparent;
  }
  .print-body .print-menu {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 200px;
  }

  .print-body .print-table {
    position: absolute;
    top: 44px;
    right: 0;
    left: 200px;
    bottom: 0;
    overflow: auto;
  }
  .print-table td>.content>.data {
    display: table;
    width: 100%;
    height: 100%;
  }
  .print-table td span {
    padding: 4px;
    display: table-cell;
    vertical-align: middle;
    word-break: break-all;
  }
  .print-table td img{
    display: inline-block;
    margin-left: 2px;
    padding: 0;
  }
  .handsontable td:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: -1px;
    border: 1px #000;
    z-index: 2;
  }

  .handsontable th {
    vertical-align: middle;
  }
  .handsontable tr {
    background: 0 0;
  }
  /*样式格式*/
  .handsontable .font-family-SimSun{
     font-family: "SimSun";
   }
  .handsontable .font-family-SimHei{
    font-family: "SimHei";
  }
  .handsontable .font-family-KaiTi{
    font-family: "KaiTi";
  }
  .handsontable .font-family-MicrosoftYahei{
    font-family: "Microsoft YaHei";
  }
  .handsontable .font-size-9 {
    font-size: 12px
  }

  .handsontable .font-size-10 {
    font-size: 14px
  }

  .handsontable .font-size-11 {
    font-size: 15px
  }

  .handsontable .font-size-12 {
    font-size: 16px
  }

  .handsontable .font-size-14 {
    font-size: 18px
  }

  .handsontable .font-size-18 {
    font-size: 24px
  }

  .handsontable .font-size-24 {
    font-size: 32px
  }

  .handsontable .font-size-30 {
    font-size: 40px
  }

  .handsontable .font-size-36 {
    font-size: 48px
  }
  .handsontable .font-color-B02418 {
    color: #B02418;
  }
  .handsontable .font-color-EA3324 {
    color: #EA3324;
  }
  .handsontable .font-color-F5C243 {
    color: #F5C243;
  }
  .handsontable .font-color-FFFF54 {
    color: #FFFF54;
  }
  .handsontable .font-color-9ECE63 {
    color: #9ECE63;
  }
  .handsontable .font-color-4EAC5A {
    color: #4EAC5A;
  }
  .handsontable .font-color-4EADEA {
    color: #4EADEA;
  }
  .handsontable .font-color-306EBA {
    color: #306EBA;
  }
  .handsontable .font-color-081F5C {
    color: #081F5C;
  }
  .handsontable .font-color-683499 {
    color: #683499;
  }
  .handsontable .font-color-FFFFFF {
    color: #FFFFFF;
  }
  .handsontable .font-color-000000 {
    color: #000000;
  }
  .handsontable .font-color-E7E6E6 {
    color: #E7E6E6;
  }
  .handsontable .font-color-475368 {
    color: #475368;
  }
  .handsontable .font-color-4E71BE {
    color: #4E71BE;
  }
  .handsontable .font-color-DE8343 {
    color: #DE8343;
  }
  .handsontable .font-color-A5A5A5 {
    color: #A5A5A5;
  }
  .handsontable .font-color-F5C243 {
    color: #F5C243;
  }
  .handsontable .font-color-6A99D0 {
    color: #6A99D0;
  }
  .handsontable .font-color-7DAB54 {
    color: #7DAB54;
  }
  .handsontable .font-color-F4F5F8 {
    color: #F4F5F8;
  }
  .handsontable .font-color-848484 {
    color: #848484;
  }
  .handsontable .font-color-D0CECE {
    color: #D0CECE;
  }
  .handsontable .font-color-D7DCE3 {
    color: #D7DCE3;
  }
  .handsontable .font-color-DBE2F1 {
    color: #DBE2F1;
  }
  .handsontable .font-color-F6E6D7 {
    color: #F6E6D7;
  }
  .handsontable .font-color-EDEDED {
    color: #EDEDED;
  }
  .handsontable .font-color-FDF2D0 {
    color: #FDF2D0;
  }
  .handsontable .font-color-E0EBF5 {
    color: #E0EBF5;
  }
  .handsontable .font-color-E4EFDB {
    color: #E4EFDB;
  }
  .handsontable .font-color-D8D8D8 {
    color: #D8D8D8;
  }
  .handsontable .font-color-595959 {
    color: #595959;
  }
  .handsontable .font-color-AEABAB {
    color: #AEABAB;
  }
  .handsontable .font-color-AFB8C8 {
    color: #AFB8C8;
  }
  .handsontable .font-color-B7C5E4 {
    color: #B7C5E4;
  }
  .handsontable .font-color-F0CDB0 {
    color: #F0CDB0;
  }
  .handsontable .font-color-DBDBDB {
    color: #DBDBDB;
  }
  .handsontable .font-color-FAE6A2 {
    color: #FAE6A2;
  }
  .handsontable .font-color-C2D6EC {
    color: #C2D6EC;
  }
  .handsontable .font-color-CADFB7 {
    color: #CADFB7;
  }
  .handsontable .font-color-BFBFBF {
    color: #BFBFBF;
  }
  .handsontable .font-color-3F3F3F {
    color: #3F3F3F;
  }
  .handsontable .font-color-747070 {
    color: #747070;
  }
  .handsontable .font-color-8795AE {
    color: #8795AE;
  }
  .handsontable .font-color-8795AE {
    color: #8795AE;
  }
  .handsontable .font-color-EAB48A {
    color: #EAB48A;
  }
  .handsontable .font-color-C9C9C9 {
    color: #C9C9C9;
  }
  .handsontable .font-color-F9DA76 {
    color: #F9DA76;
  }
  .handsontable .font-color-A4C1E2 {
    color: #A4C1E2;
  }
  .handsontable .font-color-B0CF94 {
    color: #B0CF94;
  }
  .handsontable .font-color-A5A5A5 {
    color: #A5A5A5;
  }
  .handsontable .font-color-262626 {
    color: #262626;
  }
  .handsontable .font-color-3A3838 {
    color: #3A3838;
  }
  .handsontable .font-color-353F4D {
    color: #353F4D;
  }
  .handsontable .font-color-385391 {
    color: #385391;
  }
  .handsontable .font-color-B86129 {
    color: #B86129;
  }
  .handsontable .font-color-7B7B7B {
    color: #7B7B7B;
  }
  .handsontable .font-color-B89230 {
    color: #B89230;
  }
  .handsontable .font-color-4273B0 {
    color: #4273B0;
  }
  .handsontable .font-color-5D803F {
    color: #5D803F;
  }
  .handsontable .font-color-7E7E7E {
    color: #7E7E7E;
  }
  .handsontable .font-color-0C0C0C {
    color: #0C0C0C;
  }
  .handsontable .font-color-171616 {
    color: #171616;
  }
  .handsontable .font-color-242A34 {
    color: #242A34;
  }
  .handsontable .font-color-243761 {
    color: #243761;
  }
  .handsontable .font-color-7A411A {
    color: #7A411A;
  }
  .handsontable .font-color-525252 {
    color: #525252;
  }
  .handsontable .font-color-79611D {
    color: #79611D;
  }
  .handsontable .font-color-2C4D75 {
    color: #2C4D75;
  }
  .handsontable .font-color-3E552A {
    color: #3E552A;
  }
  .handsontable .border-left:after {
    border-left-style: solid
  }

  .handsontable .border-right:after {
    border-right-style: solid;
  }

  .handsontable .border-bottom:after {
    border-bottom-style: solid
  }

  .handsontable .border-none {
    border: 0;
  }

  .handsontable .border-top:after {
    border-top-style: solid
  }
  .handsontable .border-width-1:after {
    margin: -1px;
    border-width: 1px;
  }
  .handsontable .border-width-2:after {
    margin: -1.5px;
    border-width: 2px;
  }
  .handsontable .border-width-3:after {
     margin: -2px;
     border-width: 3px;
   }
  .handsontable .border-width-4:after {
    margin: -2.5px;
    border-width: 4px;
  }
  .handsontable .underline, .print-table .underline span{
    text-decoration: underline
  }
  .handsontable .italic {
    font-style: italic;
  }

  .handsontable .bold {
    font-weight: 700;
  }
  .handsontable .htTop {
    vertical-align: top
  }
  .handsontable .htMiddle {
    vertical-align: middle
  }

  .handsontable .htBottom {
    vertical-align: bottom
  }
  .print-table .htTop span {
    vertical-align: top
  }
  .print-table .htMiddle span {
    vertical-align: middle
  }
  .print-table .htBottom span {
    vertical-align: bottom
  }
  .print-table td>.content {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  .print-table td{
    overflow: visible;
    font-size: 12px;
    line-height: 1.2;
    background: 0 0;
    position: relative;
  }
   .hide-print-border .handsontable th, .hide-print-border .handsontable td{
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
  }
  /**,:after,:before {*/
    /*-webkit-box-sizing: border-box;*/
    /*-moz-box-sizing: border-box;*/
    /*box-sizing: border-box*/
  /*}*/
  /*已打印提示*/
  .isPrinted-msg {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    line-height: 40px;
    color: #469018;
    font-size: 14px;
    text-align: center;
    background-color: #D1EBC6;
  }
  /*审批印章*/
  .print-icon-status {
    position: absolute;
    top: 40px;
    right: 60px;
  }
  /*底部打印按钮*/
  .print-footer{
    position: fixed;
    bottom: 0;
    z-index: 100;
    width: 100%;
    padding: 19px 0;
    text-align: center;
    background-color: #fff;
    box-shadow:0px 1px 0px 0px rgba(228,228,228,0.5);
  }
  .print-btn{
    display: inline-block;
    padding: 0 20px;
    font-size: 14px;
    line-height: 30px;
    border-radius: 4px;
    color: #fff;
    background-color: #C31725;
    border: 1px solid #E2750A;
    cursor: pointer;
  }
  .print-table .paper-horizontal {
    height: 0;
    right: 0;
    position: absolute;
    border-top: dashed 1px #ffa500;
  }
  .print-table .paper-vertical {
    width: 0;
    bottom: 0;
    position: absolute;
    border-left: dashed 1px #ffa500;
  }
  .wtBorder.current, .wtBorder.area{
    background-color: #ffa500 !important;
  }
  .handsontableInput {
    box-shadow: 0 0 0 2px #ffa500 inset !important;
    -webkit-box-shadow: 0 0 0 2px #ffa500 inset !important;
  }
  .custom-form .box-wrapper {
    position: fixed;
    z-index: 9999;
  }
  .custom-form .box-wrapper .set {
    padding: 50px 0 50px 138px;
  }
  .custom-form .box-wrapper .set input {
    margin: 0 8px 0 32px;
  }
  .qwui-overdue_overlayer{
    z-index: 100 !important;
  }
</style>

