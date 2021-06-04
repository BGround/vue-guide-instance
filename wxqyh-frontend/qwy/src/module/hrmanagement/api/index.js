import { getData, getDataSecond } from '../utils/getData'

/* -------------------- 左侧标题栏 -------------------- */
let getMenuList = getData('/menu/menuAction!ajaxSearchMenuList.action');

/* -------------------- 新建考核 -------------------- */

//按对象评分的考核模板
let getObjectTemplate = getData('/hrmark/hrMarkAction!findObjectTemplate.action');

//按职位评分的考核模板
let getPostTemplate = getData('/hrmark/hrMarkAction!findTemplateByPost.action');

//按指标组评分的考核模板
let getMarkGroup = getData('/hrmark/hrMarkAction!findGroupByTemplateId.action');

//新建考核的保存接口
let addMarkAjax = getDataSecond('/hrmark/hrMarkAction!addMark.action');

//编辑考核的保存接口
let editMarkAjax = getDataSecond('/hrmark/hrMarkAction!editMark.action');

//获取已建考核的详细信息
let getMarkDetail = getData('/hrmark/hrMarkAction!loadMarkById.action');

export default {
  getMenuList,
  getObjectTemplate,
  getPostTemplate,
  getMarkGroup,
  addMarkAjax,
  editMarkAjax,
  getMarkDetail,
}
