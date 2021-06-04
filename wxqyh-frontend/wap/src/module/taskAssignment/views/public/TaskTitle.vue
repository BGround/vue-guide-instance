<template>
  <div>
    <div :class="{ 'task-detail-content-height':showBlur && blurRegionShow }">
      <div class="qwui-task_header" ref="task_header">
        <div v-show="templateObj.taskTypeShow" class="qwui-task_type">
          <input class="qwui-task_type_input" type="text" readonly="readonly" :value="templateObj.taskTypeDesc">
        </div>
        <textarea class="qwui-task_title"
                  v-if="isTitleAreaStatus || showArea"
                  ref="task_title"
                  v-model="templateObj.title"
                  :placeholder="$t(templateObj.titlePlaceholder)"
                  maxlength="100"
                  @blur="isTitleAreaStatus = false"
                  @keyup="changeHeight(0)"
                  :readonly="!hasPermission"
                  @change="updateTitle">
        </textarea>
        <span v-else class="qwui-task_title">{{ templateObj.title }}<i v-if="hasPermission" class="task-edit-icon" @click="updateAreaStatus(0)"></i></span>

        <p class="qwui-dialog_textarea_counter" v-show="titleNum > 90 && !isDetailPage">{{ titleNum+'/100' }}</p>
        <textarea class="qwui-task_content"
                  v-if="isContentAreaStatus || showArea"
                  ref="task_content"
                  v-model="templateObj.content"
                  :placeholder="$t(templateObj.contentPlaceholder)"
                  maxlength="2048"
                  @blur="changeHeight(1)"
                  @keyup="updateIsBlur"
                  :readonly="!hasPermission" @change="updateContent"></textarea>
        <span v-else class="qwui-task_content" :class="{ default: !templateObj.content }">{{ templateObj.content || '' }}<i v-if="hasPermission" class="task-edit-icon" @click="updateAreaStatus(1)"></i></span>
        <p class="qwui-dialog_textarea_counter" v-show="contentNum > 1843 && !isDetailPage">{{ contentNum+'/2048' }}</p>
        <!--任务图片展示-->
        <task-image-show
          :imageList="imageList"
          :showStyle="showStyle"
          :editPerm="hasPermission"
          @deleteImage="deleteImage"
        ></task-image-show>
      </div>

    </div>
    <div v-if="blurRegionShow" @click="showBlur=!showBlur">
      <div class="qwui_show-blur" v-show="showBlur"></div>
      <div class="task-detail-content-toggle">
        {{ toggleText }}<span class="toggle-up" :class="{'toggle-down':showBlur}"></span>
      </div>
      <div class="toggle_line"></div>
    </div>
    <!--任务图片上传-->
    <task-image-upload
      v-show="imageShow && hasPermission"
      :agentCode="'task'"
      :showStyle="showStyle"
      :imageList="imageList"
      @updateImageList="updateImageList"
      @listenToShowStyle="updateShowStyle"
      ref="img_upload">
    </task-image-upload>
  </div>
</template>

<script>
  import { liveUpdateTask,editSubTask,deleteTaskPic,delePic,updateTaskPic } from '../../api/getData';
  import taskImageShow from './TaskImageShow';
  import taskImageUpload from './TaskImageUpload';


  export default {
    props:{
      dataDetailMsg:{
        type:Object,
        default(){
          return {};
        }
      },
      imageList:{
        type:Array,
        default(){
          return []
        }
      },
      showStyle:{
        type:[Number,String],
        default:0
      }
    },
    data(){
      return {
        templateObj:this.dataDetailMsg,
        isBlur:true,
        showBlur:true, // 是否显示模糊效果
        isTitleAreaStatus:false,// 标题是否显示文本编辑模式
        isContentAreaStatus:false,// 内容是否显示文本编辑模式
        blurRegionShow:false,// 是否显示模糊区域
        oldImageList:[],
        limitHeight:300,
      }
    },
    watch:{
      dataDetailMsg:{
        handler:function(){
          if (!this.isBlur){
            return;
          }
          if (this.isDetailPage){
            this.$nextTick(()=>{
              if (this.$refs.task_header.offsetHeight > this.limitHeight){
                this.blurRegionShow = true;
              }
            });
          }
          let self = this;
          if (this.templateObj.taskType == 'subTask'){
            self.changeHeight(0);
            self.changeHeight(1);
          }
          this.$nextTick(function(){
            self.changeHeight(0);
            self.changeHeight(1);
          });
        },
        deep:true
      },
      imageList:function () {
        if (this.isDetailPage){
          this.$nextTick(()=>{
            if (this.$refs.task_header.offsetHeight > this.limitHeight){
              this.blurRegionShow = true;
            }
          });
        }
        this.oldImageList = [...this.imageList];
      }
    },
    methods:{
      // 监听输入输入框高度自适应
      changeHeight(status,type){
        if (!this.showArea && !this.isContentAreaStatus){
          return;
        }
        let query = this.$refs.task_title;
        if (status){
          if (!type){
            this.$nextTick(()=>{
              if (this.$refs.task_header.offsetHeight <= this.limitHeight){
                this.blurRegionShow = false;
              }
            });
            this.isContentAreaStatus = false;
          }
          query = this.$refs.task_content;
        }else {
          // 过滤emoji表情
          this.templateObj.title = this.templateObj.title.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
        }
        query.style.height = 'auto';
        query.style.height = query.scrollHeight + 'px';
        this.isBlur = true;
      },
      updateIsBlur(){
        this.templateObj.content = this.templateObj.content.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");

        this.isBlur = false;
      },
      // 实时更新任务标题
      updateTitle(){
        if (this.$store.getters.isDetailPage){// 详情页
          let self = this;
          if (this.templateObj.title == ''){
            _.alert('','标题不能为空')
            return;
          }
          if (this.$store.getters.subTaskPage){// 子任务页面
            if(this.$store.getters.addSubTaskPage){// 子任务新增页面
              return;
            }
            let subtaskJsonStr = JSON.stringify({
              subtaskId:this.$store.getters.subtaskId,
              title:this.templateObj.title,
            });
            // 实时更新子任务标题
            editSubTask({
              subtaskId:this.$store.getters.subtaskId,
              subtaskJsonStr:subtaskJsonStr,
              oldTaskStatus:'1',
              editFlag:0,
            },(result)=>{
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              self.$store.commit('subtaskTitleUpdate',self.templateObj.title);
              _.tooltips_succeed("保存成功", true, "", 3000);
            })
          }else {
            // 实时更新主任务标题
            liveUpdateTask({
              'tbQyTaskPO.taskId':this.$store.getters.taskId,
              'tbQyTaskPO.title':this.templateObj.title,
              'operationFlag':1
            },function (result) {
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              _.tooltips_succeed("保存成功", true, "", 3000);
            })
          }

        }
      },
      updateAreaStatus(status){
        if (status){
          this.isContentAreaStatus = true;
        }else {
          this.isTitleAreaStatus = true;
        }
        this.$nextTick(()=>{
          let el = status ? this.$refs.task_content : this.$refs.task_title;
          el.focus();
          let range = this.getSelectedText(); //创建range
          range.collapseToEnd(); //光标移至最后
          this.changeHeight(status,true);
        });
      },
      updateContentAreaStatus(){
        document.querySelector('.qwui-task_content').focus();
//        this.$refs.task_title.focus();
        this.isContentAreaStatus = !this.isContentAreaStatus;
      },
      // 兼容性处理，获取所选的对象，用于鼠标聚到文本尾部
      getSelectedText() {
        var txt = '';
        if (window.getSelection) {
          txt = window.getSelection();
        } else if (window.document.getSelection) {
          txt = window.document.getSelection();
        } else if (window.document.selection) {
          txt = window.document.selection.createRange().text;
        }
        return txt;
      },
      // 实时更新任务内容
      updateContent(){
        if (this.$store.getters.isDetailPage){
          let self = this;
          if (this.$store.getters.subTaskPage){
            if(this.$store.getters.addSubTaskPage){
              return;
            }
            // 实时更新子任务内容
            let subtaskJsonStr = JSON.stringify({
              subtaskId:this.$store.getters.subtaskId,
              content:this.templateObj.content,
              title: this.templateObj.title
            });
            editSubTask({
              subtaskId:this.$store.getters.subtaskId,
              subtaskJsonStr:subtaskJsonStr,
              oldTaskStatus:'1',
              editFlag:1,
            },(result)=>{
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              _.tooltips_succeed("保存成功", true, "", 3000);
            })
          }else {
            liveUpdateTask({
              'tbQyTaskPO.taskId':this.$store.getters.taskId,
              'tbQyTaskPO.content':this.templateObj.content,
              'operationFlag':2
            },function (result) {
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
              _.tooltips_succeed("保存成功", true, "", 3000);
            })
          }

        }
      },
      updateImageList(imageList){
        let addModuleType = window.sessionStorage.getItem('addModuleType');
        if(addModuleType&&addModuleType=='mainAddModule'){
          this.$store.commit('imageDisplayUpdate',true);
          this.$store.commit('mainAddContentModuleHideUpdate');
          window.sessionStorage.removeItem('addModuleType');
        }else if(addModuleType&&addModuleType=='subAddModule'){
          this.$store.commit('subImageDisplayUpdate',true);
          this.$store.commit('subAddContentModuleHideUpdate');
          window.sessionStorage.removeItem('addModuleType');
        }
        let self = this;
        if (this.$store.getters.isDetailPage){
          let imageUrls = [];
          let newList = [...imageList];
          let picNameList = [];
          // 过滤掉src相同的图片
          if (this.oldImageList.length > 0){
            this.oldImageList.forEach((item)=>{
              item.picPath ? item.src = item.picPath : '';
              imageList.forEach((items,key)=>{
                if (item.src == items.src){
                  newList.splice(key,1,'')
                }
              });
            });
          }

          newList = newList.filter((item) => {
            return item != '';
          });

          newList.forEach((item)=>{
            imageUrls.push(item.src);
            let src = item.src.split('/');
            picNameList.push(src[src.length - 1])
          });

          if (this.$store.getters.subTaskPage){
            if(this.$store.getters.addSubTaskPage){
              self.$emit('updateImageList',imageList);
              return;
            }
            // 新增子任务附件图片
            updateTaskPic({
              taskId:this.$store.getters.taskId,
              subtaskId:this.$store.getters.subtaskId,
              imageUrls:imageUrls.join(','),
              oldTaskStatus:'1',
              editFlag:5,
              fileName:picNameList.join(','),
              contents:'添加了图片['+picNameList.join(',')+']',
              title:this.$store.getters.subtaskTitle
            },(result)=>{
              self.$emit('updateImageList',imageList);
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
            })
          }else {
            // 主任务附件图片
            updateTaskPic({
              'taskId':this.$store.getters.taskId,
              'imageUrls':imageUrls.join(','),
              'fileName':picNameList.join(','),
              'contents':'添加了图片['+picNameList.join(',')+']'
            },function (result) {
              self.$emit('updateImageList',imageList);
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
            })
          }
        }
      },
      deleteImage(item,key){
        let self = this;
        let btn={
          primaryBtn: {
            name: '删除',
            callBack: function(){
              if (!self.isDetailPage || self.isAddSubTaskPage){
                self.imageList.splice(key,1);
                self.$emit('updateImageList',self.imageList);
                return;
              }
              if(item.src){
                // 主任务groupId为主任务id，子任务groupId为子任务id
                let groupId = '';
                if (self.isDetailPage){
                  if (self.isSubtaskPage){
                    if(!self.isAddSubTaskPage){
                      groupId = self.$store.getters.subtaskId;
                    }
                  }else {
                    groupId = self.$store.getters.taskId;
                  }
                }
                delePic({
                  groupId:groupId,
                  mediaId: item.id,
                  agent: ''
                },()=>{
                  let src = item.picPath.split('/');
                  let params = {
                    imageId:item.id,
                    subtaskId:self.$store.getters.subtaskId,
                    fileName:src[src.length - 1],
                    'tbQyTaskPO.taskId':self.$store.getters.taskId,
                    title:self.$store.getters.subtaskTitle
                  };
                  deleteTaskPic(params,(result)=>{
                    // 图片预览列表移除此图片
                    self.imageList.splice(key,1);
                    self.$emit('updateImageList',self.imageList);
                    self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
                  })
                })
              }
            }
          },
          defaultBtn:{
            name:"取消",
            callBack:null
          },
        };
        _.alert('','是否删除',btn);
      },
      updateShowStyle(status){
        let self = this;
        if (!this.isDetailPage || this.isAddSubTaskPage){
          this.$emit('update:showStyle',status);
          return;
        }
        if (this.isDetailPage){// 详情页
          if (this.isSubtaskPage){// 子任务页面
            let subtaskJsonStr = JSON.stringify({
              subtaskId:this.$store.getters.subtaskId,
              showStyle:status,
            });
            // 实时更新子任务标题
            editSubTask({
              subtaskId:this.$store.getters.subtaskId,
              subtaskJsonStr:subtaskJsonStr,
              oldTaskStatus:'1',
            },(result)=>{
              self.$emit('update:showStyle',status);
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
            })
          }else {
            // 实时更新主任务标题
            liveUpdateTask({
              'tbQyTaskPO.taskId':this.$store.getters.taskId,
              'tbQyTaskPO.showStyle':status,
            },function (result) {
              self.$emit('update:showStyle',status);
              self.$store.commit('operationRecordUpdate',result.tbQyTaskCommentList);
            })
          }

        }
      }
    },
    computed:{
      titleNum(){
        return this.templateObj.title.length;
      },
      contentNum(){
        return this.templateObj.content.length;
      },
      hasPermission(){
        this.$store.commit('hasPermissionUpdate');
        return this.$store.getters.hasPermission;
      },
      isDetailPage(){
        return this.$store.getters.isDetailPage;
      },
      isSubtaskPage(){
        return this.$store.getters.subTaskPage;
      },
      isAddSubTaskPage(){
        return this.$store.getters.addSubTaskPage;
      },
      imageDisplay(){
        return this.$store.getters.imageDisplay;
      },
      subImageDisplay(){
        return this.$store.getters.subImageDisplay;
      },
      // 是否显示图片模块
      imageShow(){
        return (this.imageDisplay && !this.isSubtaskPage) || (this.subImageDisplay && this.isSubtaskPage)
      },
      toggleText(){
        return this.showBlur ? '展开显示全部' : '收起';
      },
      // 是否显示文本框
      showArea(){
        return !this.isDetailPage || this.$store.getters.addSubTaskPage;
      },
    },
    components:{
      taskImageShow,
      taskImageUpload
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-task_header {
    margin: 0 15px;
    padding-bottom: 13px;
    position: relative;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &:after {
      content: ' ';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      border-bottom: 1px solid #F7F8FA;
      transform: scaleY(0.5);
      transform-origin: 0 0;
      z-index: 2;
    }

    .task-edit-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-left: 10px;
      vertical-align: middle;
      cursor: pointer;
      background: url("~assets/svg/icon_a-details_edit_permission.svg") no-repeat left scroll;
    }
  }
  .qwui-task_type {
    position: relative;
    height: 48px;
    line-height: 48px;
    font-size: 14px;
    color: #7A7C80;
    text-align: left;
    &:after {
      content: ' ';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
      border-bottom: 1px solid #F7F8FA;
      transform: scaleY(0.5);
      transform-origin: 0 0;
      z-index: 2;
    }

     & .qwui-task_type_input {
         width: 100%;
       }
  }
  .qwui-task_header p {
    text-align: right;
  }
  .qwui-task_title, .qwui-task_content {
    height: auto;
    width: 100%;
    color: #0A1735;
    border: none;
    background: #fff;
    line-height: 25px;
    box-sizing: border-box;
    resize: none;
    white-space: pre-wrap;
    word-wrap:break-word;
  }
  .qwui-task_title {
    min-height: 78px;
    padding: 14px 0;
    font-size: 18px;
    display: block;
  }
  .qwui-task_content {
    min-height: 100px;
    padding: 0;
    font-size: 15px;
    display: block;
  }

  .qwui-task_content.default {
    color:#B2B9C8;
  }

  .qwui_show-blur {
    position: absolute;
    width: 100%;
    height: 69px;
    background: linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,1));
    transform: translateY(-69px);
  }
  .task-detail-content-height {
    height: 300px;
    overflow: hidden;

    & textarea {
        overflow: hidden;
      }
  }
  .task-detail-content-toggle{
    width:100%;
    height: 58px;
    font-size: 14px;
    text-align: center;
    color: #a6a6a6;
    line-height:58px ;
  }
  .task-detail-content-toggle span {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin: 0px 5px;
    background-size: cover;
    vertical-align: text-bottom;
  }
  .task-detail-content-toggle span.toggle-up {
    background:-11px 0  url('~assets/images/icon_form_arrow_toggle.png') no-repeat;
  }
  .task-detail-content-toggle span.toggle-down {
    background:0 0  url('~assets/images/icon_form_arrow_toggle.png') no-repeat;

  }
  .toggle_line {
    width: 100%;
    height: 8px;
    background: #F4F6F8;
  }
</style>
