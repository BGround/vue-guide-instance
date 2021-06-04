<template>
    <div class="detail_wrap">
        <!--头部标题和发布时间信息-->
        <div class="detail_header">
            <h1 class="detail_header_title qwui-tweet_header_title">

              <span v-text="detail.title"></span>
              <i v-show="getPassReview" class="qwui-tweet_header_title_tips qwui-tweet_header_title_tipsInfo">
                {{getPassReview}}
              </i>

            </h1>
            <p class="detail_header_info">
                <span>{{detail.publishTime}}</span>
                <span>{{detail.publisher}}</span>
            </p>
        </div>
        <!--主体内容-->
        <div class="detail_body" ref="detailBody">
            <div class="detail_body_coverimg" v-if="isCover||isPicture">
                <!--封面图-->
                <div v-if="isCover" >
                    <img  :src="dealImg(detail.coverImage)" />
                </div>
                <!--图片列表-->
                <div v-if="isPicture" v-for="(img,index) in detail.imgList" :key="index">
                    <img :src="dealImg(img.path)"/>
                </div>
            </div>
            <!--正文-->
            <div class="detail_body_content" v-html="detail.content"></div>
            <!--演示链接-->
            <div class="detail_body_link" v-if="isLink">
                演示链接：<span v-html="detail.demoLink"></span>
            </div>
        </div>



        <!--底部-->
        <div class="detail_footer">
            <!--类别、已阅-->
            <div class="detail_footer_type">
                <span class="type_label">{{detail.typeName}}</span>
                <span class="type_viewnum" :class="{'num_color': !isOpen}"
                    @click="toReadView">已阅({{detail.viewCount}})</span>
            </div>

          <div v-if="isVisibleApprovalBtn">
            <div class="detail_footer_type mb10">
              动态审核
            </div>
            <flow_button :buttondata="buttonConfig"></flow_button>
          </div>


            <!--媒体文件列表-->
            <file-list v-if="isMedia"
                    agent="productinfo"
                    :filesList="detail.mediaList"
                    :downLoad="true"
                    :deleteFile="false"
                    >
                <p class="media_text" slot="title">附件({{detail.mediaList.length}})</p>
            </file-list>
            <!--案例按钮-->
            <button-btn v-if="detail.hasProductCase"
                        class="detail_footer_case"
                        type="primary"
                        text="点击查看知识百科案例"
                        @buttonClick="toCaseList"></button-btn>


            <!--点赞列表、分享图标-->
            <div class="detail_footer_praise">
                <div class="icon_wrap" v-if="!isOpen">
                    <span class="praise_icon" :class="{'after_praise': detail.hasPraise}" @click="toPraise">
                        <i :class="{'pulse': detail.hasPraise,'animate':isShowAnimate}"></i>
                    </span>
                    <span class="share_icon" v-if="isShare"
                        @click="toShare"><i></i></span>
                </div>
                <div class="praise_list" v-if="detail.praiseTotalRows > 0&&!isOpen">
                    <p class="praise_list_title">
                        <i class="subscibe_icon"></i>
                        <span>{{detail.praiseTotalRows}}赞</span>
                        <span v-if="!isPraiseHeight"
                            class="subscibe_expend" :class="{'down': praiseShowAll}"
                             @click="showAll">
                            {{ praiseShowAll ? '收起' : '展开'}}
                        </span>
                    </p>
                    <div class="praise_list_content" :class="{'down': !praiseShowAll}"
                        ref="praiseWrap">
                        <span class="subscibe_name"
                            v-for="(item,index) in detail.praiseList" :key="index"
                            v-text="item.personName">
                        </span>
                        <label v-if="isPraiseAll"
                            @click="toPraiseList" class="subscribe_btn">查看全部</label>
                    </div>
                </div>
            </div>
        </div>


      <div class="relate">
        <div class="relate__title">涉及岗位(共{{getPublishCount}}人)</div>
        <div class="relate__text" ref="relate-position" :class="{'hidden': isHideOverflowTextPost}">
          {{getPositionList.join('，')}}
          <div class="more" v-if="hasTextEllipsisPost">... <span class="blue" @click="handleClickMorePost">查看全部</span></div>
        </div>
      </div>

      <div class="relate">
        <div class="relate__title">涉及经销商(共{{getDealerInfoList.length}}家)</div>
        <div class="relate__text" ref="relate-dealer" :class="{'hidden': isHideOverflowTextDealer}">
          {{getDealerInfoList.join('，')}}
          <div class="more" v-if="hasTextEllipsisDealer">... <span class="blue" @click="handleClickMoreDealer">查看全部</span></div>
        </div>
      </div>

         <!--上下篇-->
        <div class="detail_footer_page" v-if="!isOpen">
            <div class="page_prev" @click="goNext('pre')">上一篇</div>
            <div class="page_next" @click="goNext('next')">下一篇</div>
        </div>
    </div>
</template>

<script>
import fileList from './cherryAddFileList';
import {qwui_button} from '@/components/base/button';
import {setPraise} from '../api/getData.js';
import EventBus from '@/utils/eventBus';
import flow_button from '@/components/button/flow_button';
import * as approvalApi from "@/module/product/api/approvalApi";

export default {
    props:{
        detail:{
            type:Object
        },
        isOpen: {
            type: Boolean,
            default: false
        },
    },
    data(){
        return{
            isFirst: true,
            isShowAnimate: false,
            praiseObj:{},
            praiseShowAll: false,
            isPraiseHeight: false,
            previewImageUrl: [], // 图片预览列表

            buttonConfig:{
                primaryList:[
                    {type:"primary",name:'通过',callBack: this.handleClickPass}
                ],
                defaultList:[
                    {type:"default",name:'不通过', callBack: this.handleClickNotPass}
                ],
                style:{class:""}//按钮是否置底部 active :底部、"":相对定位
            },

            hasTextEllipsisPost: false,
            hasTextEllipsisDealer: false,
            isHideOverflowTextDealer: true,
            isHideOverflowTextPost: true,
        }
    },
    computed:{
        id(){
            return this.$route.query.id;
        },
        isCover(){  // 是否显示封面
            return this.detail.isShowCoverImg == '1' && this.detail.coverImage != '';
        },
        isLink() {  // 是否显示演示链接
            return this.detail.demoLink !== '';
        },
        isMedia(){   //附件列表
            return this.detail.mediaList && this.detail.mediaList.length > 0;
        },
        isShare(){   // 显示分享按钮
            return this.detail.isOpen == '1' && _.isWeChatApp();
        },
        isPicture(){  // 显示图片列表
            return this.detail.imgList && this.detail.imgList.length > 0;
        },
        isPraiseAll(){  // 点赞列表显示查看全部
            return this.detail.praiseCurr < this.detail.praiseTotalPages;
        },
        isHideExpend(){  // 是否隐藏展开
            return this.detail.praiseCurr == this.detail.praiseTotalPages;
        },
        isVisibleApprovalBtn(){
           return String(this.detail.isPassReview) === '1'
        },
        getPositionList(){
            return this.detail.positionList || []
        },
        getDealerInfoList(){
            return this.detail.dealerInfoList || []
        },
        getPassReview(){
            return this.detail.passReview;
        },
        getPublishCount(){
            return this.detail.publishCount;
        }
    },
    updated(){
        this.$nextTick(()=>{
            if(this.$refs.praiseWrap&&this.isFirst){
                this.isPraiseHeight = this.$refs.praiseWrap.scrollHeight <= this.$refs.praiseWrap.clientHeight;
                this.isFirst = false;
            }
            // 图片预览事件
            this.imgsClickFunc();
            // 视频兼容
            this.videoPlayback();
        })
    },
    watch:{
        'detail.hasPraise'(value){
            this.isShowAnimate = value;
        },
        detail(){
            this.$nextTick(this.setTextEllipsis)
        }
    },
    methods:{
        // 已阅
        toReadView(){
            this.$emit('toReadView');
        },
        // 案例列表
        toCaseList(){
            this.$emit('toCaseList');
        },
        // 上下篇
        goNext(type){
            this.$emit('goNext', type);
        },
        // 点赞
        toPraise(){
            var self = this;
            setPraise({
                id: self.id
            },(data)=>{
                // 点赞信息重新赋值
                self.detail.hasPraise = data.hasPraise;
                self.detail.praiseCurr = data.praisePager? data.praisePager.currentPage : 0;
                self.detail.praiseList =  data.praisePager? data.praisePager.pageData : []; // 点赞列表
                self.detail.praiseTotalRows = data.praisePager? data.praisePager.totalRows : 0; // 总赞数
                self.detail.praiseTotalPages = data.praisePager? data.praisePager.totalPages : 0;  //总页数
            })
        },
        // 分享
        toShare(){
            this.$emit('toShare');
        },
        // 点赞列表
        toPraiseList(){
            this.$emit('toPraiseList');
        },
        // 展开、收起
        showAll(){
            this.praiseShowAll = !this.praiseShowAll;
        },
        dealImg(path){
            return _.filterCompressURL(path);
        },
        // 图片点击预览
        imgsClickFunc(){
            var imgs = this.$refs.detailBody.getElementsByTagName('img');
            this.previewImageUrl.length = 0;
            for(let i =0; i<imgs.length; i++){
                // 处理图片前有缩进的问题
                if(imgs[i].parentNode.style.textIndent){
                    imgs[i].parentNode.style.textIndent = 0;
                }
                // 父节点为a标签不做任何处理
                let nodeName = imgs[i].parentNode.nodeName.toLowerCase();
                // 过滤图标
                let imgsrc = imgs[i].src.toLowerCase();
                let isImg = imgsrc.includes(".jpg")||imgsrc.includes(".png")||imgsrc.includes(".jpeg");
                if(nodeName !='a'&& isImg){
                    this.previewImageUrl.push({picPath: _.filterCompressURL(imgs[i].src)});
                    imgs[i].addEventListener('click',this.addPreviewEvent);
                }
            }
        },
        addPreviewEvent(event){
            let src = _.filterCompressURL(event.target.currentSrc);
            EventBus.$emit('previewImages',src, this.previewImageUrl);
        },
        // 视频兼容
        videoPlayback(){
            var self = this;
            var video_obj = self.$refs.detailBody.querySelectorAll("iframe,embed");
            if(video_obj!=0){
                [].forEach.call(video_obj,(item,index) => {
                var video_src = item.src;
                var video_width = item.width;
                if(video_src!=""&&video_src!=null&&video_src!=undefined){
                    if(video_src.indexOf(_.wxqyh_scheme)==-1){ // 视频地址为http格式
                        item.src = '';
                        var div = document.createElement('div');
                        var attr = document.createAttribute('class');
                        attr.value = 'video_div';
                        div.setAttributeNode(attr);
                        self.insertAfter(div,item);
                        div.appendChild(item);
                        var divPlay = document.createElement('div');
                        var attrPlay = document.createAttribute('class');
                        attrPlay.value = 'video_div_c';
                        divPlay.setAttributeNode(attrPlay);
                        div.appendChild(divPlay);
                        item.width = '100%';
                        if(self.$refs.detailBody.clientWidth > 608){
                            item.width = divPlay.style.width = '608px';
                            item.height = divPlay.style.height = '88px';
                        }else {
                            item.height = divPlay.style.height = ((window.innerWidth-20)*88/608) + 'px';
                        }
                        divPlay.onclick = function(){
                            window.top.location.href = _.baseHttpURL + '/open/ueditor/play.jsp?link=' + video_src;
                        }
                    }
                }
                });
            }
        },
        insertAfter( newElement, targetElement ){ // newElement是要追加的元素 targetElement 是指定元素的位置
            var parent = targetElement.parentNode; // 找到指定元素的父节点
            if( parent.lastChild == targetElement ){ // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
                parent.appendChild( newElement, targetElement );
            }else{
                parent.insertBefore( newElement, targetElement.nextSibling );
            };
        },

        handleClickPass(){
            _.alert('确定通过审批？', '审批通过后，用户将会看到该内容', {
                defaultBtn: {
                    name: '取消',
                    callBack: null
                },
                primaryBtn: {
                    name: '确定',
                    callBack: () => {
                      this.pass(this.id)
                    }
                }
            });
        },

        handleClickNotPass(){
            _.alert('确定不通过审批？', '审批不通过后，用户将无法看到该内容', {
                defaultBtn: {
                    name: '取消',
                    callBack: null
                },
                primaryBtn: {
                    name: '确定',
                    callBack: () => {
                      this.notPass(this.id)
                    }
                }
            });

        },

        notPass(id){
            approvalApi.notPass({productIds: id}).then((data)=>{
                if(data){
                    _.alert('提示', '审核成功');
                    window.setTimeout(()=>{
                        this.$router.back();
                    },1500)
                }
            })
        },

        pass(id){
            approvalApi.pass({productIds: id}).then((data)=>{
                if(data){
                    _.alert('提示', '审核成功');
                    window.setTimeout(()=>{
                        this.$router.back();
                    },1500)
                }
            })
        },

        setTextEllipsis(){
            const relatePosition = this.$refs['relate-position']
            const relateDealer = this.$refs['relate-dealer']
            this.hasTextEllipsisPost = relatePosition.scrollHeight > relatePosition.clientHeight;
            this.hasTextEllipsisDealer = relateDealer.scrollHeight > relateDealer.clientHeight

        },
        handleClickMorePost(){
            this.isHideOverflowTextPost = false;
            this.hasTextEllipsisPost = false;
        },

        handleClickMoreDealer(){
            this.isHideOverflowTextDealer = false;
            this.hasTextEllipsisDealer = false;
        },
    },
    components:{
        fileList,
        'buttonBtn':qwui_button,
        flow_button,
    }

}
</script>

<style scoped lang="scss">
  /deep/ {
    .qwui-btn_tab{
      padding: 0;
    }
  }
  .mb10.detail_footer_type{
    padding-bottom: 10px;
  }


  .relate{
    margin-bottom: 16px;
    padding-left: 15px;
    padding-right: 15px;
    position: relative;
    .more{
      background: #fff;
      position: absolute;
      box-shadow: -4px 0 4px 0 #fff;
      bottom: 0;
      right: 15px;
      .blue{
        color: #5585F0;
      }
    }
  }
  .relate__text{
    text-align: justify;
    line-height: 18px;
    &.hidden{
      height: 36px;
      overflow: hidden;
    }

  }

  .relate__title{
    font-size: 14px;
  }

  .qwui-tweet_header_title{
    color:#333;font-size:20px;font-weight:400
  }
  .qwui-tweet_header_title .qwui-tweet_header_title_tips{
    display:inline-block;margin-left:5px;padding:0 3px;color:#1aad19;font-size:12px;border-radius:3px;
    border:1px solid #1aad19
  }
  .qwui-tweet_header_title .qwui-tweet_header_title_tips.qwui-tweet_header_title_tipsInfo{
    color:#1aad19;border:1px solid #1aad19
  }
  .qwui-tweet_header_title .qwui-tweet_header_title_tips.qwui-tweet_header_title_tipsWarnin{
       color:#d64949;border:1px solid #d64949
  }
</style>

<style lang="scss" src="../scss/detail_content.scss" scoped>
</style>
