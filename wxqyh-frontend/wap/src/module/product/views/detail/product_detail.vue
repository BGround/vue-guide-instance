<template>
    <div class="wrap"
        v-show="showDetail"
        v-qw-water-mark="{ agentCode: 'productinfo',isShow: isShowMark }">
        <!--详情内容-->
        <detail-item class="detail"
                    :detail="detailContent"
                    :isOpen="isOpen"
                    @toReadView="toRead"
                    @toCaseList="toCase"
                    @toPraiseList="toPraise"
                    @toShare="toShare"
                    @goNext="goNext"
                    ref="contentText"></detail-item>

        <!--回复列表-->
        <comment-list
            v-if="(!isOpen || isShareComment) && isComment"
            :hiddenSwitch="true"
            :commentList="commentList"
            :totalRow="commentTotalRows"

            @atThisPersonUtil="atThisPersonUtil"
            @delete="deleteThisComment"></comment-list>
        <!--回复加载更多-->
        <load-more
                v-if="(!isOpen || isShareComment) && isComment"
                class="loadmore_wrap"
               :loading="loading"
               :hasMore="commentHasMore"
               type="commentList"
               @loadMoreClick="loadMore"
               >
            <span>没有更多评论了</span>
        </load-more>

        <!--外部单底部logo-->
        <div class="openfootercontent" v-if="isShowFooter">
            <a class="openfooterlink" href="http://wbg.do1.com.cn/" target="_blank">
                <img src="~assets/images/newsmallLogo.svg"/>道一云|企微，让工作更简单
            </a>
        </div>

        <!--底部评论框-->
        <div class="qwui-action-button comment_input" v-if="!isOpen&&isComment">
            <div class="qwui-input_div">
                <div class="qwui-input">
                    <input type="text"
                    placeholder="评论一句吧"
                    readonly="readonly"
                    ref="commentContent"
                    @focus="showCommnetInput">
                </div>
            </div>
        </div>

        <!--评论弹窗-->
        <chat-input :show.sync="showChatTool"
                    :autofocus.sync="autofocus"
                    :maxLength="300"
                    agent="productinfo"
                    :dataBase="dataBase"
                    @updateContent="sendComment"></chat-input>

        <!--水印-->
        <div class="qwui-watermark" ref="waterMark" v-show="isShowInnerWater"></div>
        <!-- 个人信息 -->
        <user-info></user-info>
        <!--选人组件-->
        <user-select v-if="dataBase.selectConfig.show"
                :selectconfig="dataBase.selectConfig"></user-select>
        <!--预览图片组件-->
        <preview-images></preview-images>

        <!--分享过渡页面-->
        <qw-share class="qwui-share"
            :period="3"
            :url="shareUrl"
            v-if="isShowShare"
        ></qw-share>
    </div>
</template>

<script>
import detailItem from '../../components/detail_content';
import commentList from '@/components/list/comment_list';
import loadMore from '@/components/list/load_more';
import userInfo from '@/components/detail/user_info_card';
import chatInput from '@/components/detail/chatInput';
import userSelect from '@/components/base/user_or_dept_select';
import previewImages from "@/components/base/previewImages";
import qwShare from '../../components/share_wrap';
import EventBus from '@/utils/eventBus';
import {getProDetail,
        delComment,
        addComment,
        getCommentList,
        getNextProduct
        }
    from '../../api/getData.js';
import qwWaterMark from '@/directive/qwWaterMark'
export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },
    },
    directives: { qwWaterMark },
    data(){
        return{
            dataBase: dataBase,
            showDetail: false,
            detailContent: {},
            commentList:[],
            commentTotalRows: 0,
            commentHasMore: false,  // 评论hasMore
            loading: false,
            showChatTool:false, //评论输入框组件是否显示
            autofocus:false,
            commentParams: {},
            lock_roll: false,
            isComment: false,
            isShowShare: false, // 显示分享过渡页
            shareUrl:'',      // 外部分享的链接
            isShareComment: false, // 是否显示评论
            isShowFooter: false, // 外部分享显示底部
            isShowMark: false,
            isShowInnerWater: false, // 内部水印
        }
    },
    computed:{
        id(){
            return this.$route.query.id;
        },
        keyword(){
            return this.$route.query.keyword || '';
        },
        pid(){
            return this.$route.query.pid || '';
        },
        type(){
            return this.$route.query.type || 3;
        }
    },
    watch:{
        '$route'(to,from){
            if(to.name == from.name) {
                // 解决水印重复的问题
                let waterMarkDiv = document.getElementById('qwWaterMark');
                if(waterMarkDiv){
                    waterMarkDiv.parentNode.removeChild(waterMarkDiv);
                }
                this.isShowMark = false;
                this.isShowInnerWater = false;
                this.initDetail();
            }
        }
    },
    created(){
        window.addEventListener('scroll',this.scrollList);
        // 获取详情
        this.initDetail();
    },
    beforeDestroy(){   //组件被停用(离开路由)
        window.removeEventListener('scroll',this.scrollList);
    },
    methods:{
        // 获取详情
        initDetail(){
            var self = this;
            let param = {
                id: self.id
            };
            if(self.isOpen) {
                param.size = 10;
                param.currPage = 1;
            }
            getProDetail(
                self.isOpen, param,
            (data)=>{
                console.log(data)
                var po = data.tbXyhProductPO;
                // 内部详情
                if(!self.isOpen) {
                    // 是否已禁用
                    if(po.isEnable == '0') {
                        var btn={
                            primaryBtn:{name:'确定', callBack: self.weixinBack},
                            defaultBtn:{name:'', callBack:null},
                        };
                        _.alert('提示', '该知识百科已禁用', btn)
                        return;
                    }
                }
                // 外部分享是否显示底部(为外部分享且返回true)
                self.isShowFooter = data.isShowFooter && self.isOpen;

                // 设置分享信息
                let imgSrc = po.coverImage ?  _.compressURL + po.coverImage :
                    self.isOpen ? data.logo : '';
                self.shareLink(po.title, imgSrc, po.summary);

                // 修改页面标题
                document.title = po.title;

                // 百科详情
                let localport = _.localport;
                var content = _.clearScript(po.content
                    .replace(/http:\/\/qy\.do1\.com\.cn\:6090\/fileweb/g, localport)
                    .replace(/@fileweb@/g, localport));

                self.detailContent = {
                    title: po.title.replaceAll('\r\n','<br/>').replaceAll(/\s/g, '&nbsp;'),
                    publisher: self.isOpen ? data.orgName : po.publisher,
                    publishTime: data.publishTime,
                    viewCount: self.isOpen ? data.openViewCounts : po.viewCount,
                    content: _.checkURL(content,false, true),
                    demoLink: _.checkURL(po.productUrl, false),
                    praiseList: data.praisePager? data.praisePager.pageData : [], // 点赞列表
                    praiseCurr: data.praisePager? data.praisePager.currentPage : 0, // 当前页
                    praiseTotalRows: data.praisePager? data.praisePager.totalRows : 0, // 总赞数
                    praiseTotalPages: data.praisePager? data.praisePager.totalPages : 0,  //总页数
                    hasPraise: data.hasPraise || false,
                    hasProductCase: data.hasProductCase || false,
                    isOpen: po.isOpen,
                    imgList: data.imagesList,
                    isShowCoverImg: po.isShowCoverIntext,
                    coverImage: po.coverImage,
                    typeName: data.typeName,
                    mediaList: data.mediaList,
                    isPassReview: po.isPassReview,
                    positionList: data.positionList || [],
                    dealerInfoList: data.dealerInfoList || [],
                    passReview: data.passReview || '',
                    publishCount: data.tbXyhProductPO.publishCount || 0
                }

                // 是否设置水印
                if(po.isWatermark == '1'){
                    let markText = self.isOpen && data.orgName ? data.orgName : _.personName;
                    self.addMark(markText);
                    self.isShowInnerWater = true;
                }
                 // 返回非水印以及非外部页面
                self.isShowMark = po.isWatermark != '1' && !self.isOpen;

                // 是否开启问答
                self.isComment = po.isComment == '1';
                // 外部-是否显示评论
                self.isShareComment = po.shareComment == '1';
                // 评论列表- 内部和外部返回字段不一样
                let commentPager = {};
                if(self.isOpen){
                    commentPager = {
                        pageData: data.comments,
                        totalRows: po.commentCount,
                        hasMore: data.hasMore
                    }
                    // 评论列表参数
                    self.commentParams = {
                        size: 10,
                        currPage: 1,
                        id: self.id
                    }
                } else {
                    commentPager = Object.assign({},data.commentPager);
                    commentPager.hasMore = commentPager.currentPage < commentPager.totalPages
                    commentPager.pageData.forEach((item)=>{
                        item.time = item.strCreateTime;
                    });
                     // 评论列表参数
                    self.commentParams = {
                        pageSize: 10,
                        currentPage: 1,
                        productId: self.id
                    }
                }
                self.commentTotalRows = commentPager.totalRows;
                self.commentHasMore = commentPager.hasMore;
                self.commentList = commentPager.pageData;

                // 外部分享地址
                self.shareUrl = _.openURL + '/vp/module/product.html?agentCode=' + _.getUrlParam('agentCode') + '&corp_id='
                    + _.getUrlParam('corp_id') + '#/open/detail?id=' + self.id + '&type=1';

                self.showDetail = true;

                // 重新请求返回顶部
                document.documentElement.scrollTop = 0;
                window.pageYOffset = 0;
                document.body.scrollTop = 0;
            }, (result)=>{
                 var btn={
                    primaryBtn:{name:'确定', callBack: self.weixinBack},
                    defaultBtn:{name:'', callBack:null},
                };
                 _.alert('提示',result.desc,btn);
            })
        },
        //加载更多
        loadMore(){
            if(this.commentHasMore&&!this.loading){
                this.isOpen ? this.commentParams.currPage++ : this.commentParams.currentPage++;
                this.getCommentList();
            }
        },
        // 滚动加载
        scrollList(e){
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
                if(!this.lock_roll && this.commentHasMore){
                    this.loadMore();
                }
            }
        },
        // 上下篇
        goNext(type){
            let self = this;
            let page = self.$route.query.page || 1;
            type == 'pre' ? page-- : page++;
            if(page == 0) {
                 _.alert('提示','已经是第一篇了');
                return;
            }
            getNextProduct({
                id: self.id,
                page: page,
                pid: self.pid,
                type: self.type,
                keyword: self.keyword
            },(data)=>{
                if(data.productId) {
                    let proId = data.productId;
                    this.$router.push({
                        path: '/productDetail',
                        query: {
                            id: proId,
                            page: page,
                            pid: self.pid,
                            keyword: self.keyword,
                            type: self.type
                        }
                    });
                }else {
                    let tips = type == 'pre' ? '第' : '最后';
                    _.alert('提示',`已经是${tips}一篇了`);
                }
            })

        },
        // 点击头像查看个人信息
        atThisPersonUtil(user){
            if(user&&!this.isOpen){
                EventBus.$emit("atThisPersonUtil",user);
            }
        },
        // 删除评论
        deleteThisComment(data,index){
            var self = this;
            delComment({
                commentId: data.commentId
            },(data)=>{
                self.commentList.splice(index,1);
                self.commentTotalRows--;
            })
        },
        //显示输入框组件
        showCommnetInput(){
            this.showChatTool=true;
            this.autofocus=true;
        },
        // 发表评论
        sendComment(comment){
            var self = this;
            addComment({
                'id': self.id,
                'tbXyhProductCommentPO.content': comment.content,
                'userIds': comment.userIds || '',
                'type': comment.type
            },(data)=>{
                let obj = Object.assign({}, data.insertComment);
                obj.time = obj.strCreateTime;
                obj.creator = _.userId;
                self.commentList.splice(0,0, obj);
                self.commentTotalRows++;
            })
        },
        // 获取评论列表
        getCommentList(){
            var self = this;
            self.loading = true;
            self.lock_roll = true;
            getCommentList(self.isOpen,
            self.commentParams,(data)=>{
                let list = []
                if(!self.isOpen) {
                    self.commentTotalRows = data.totalRows;
                    data.commentPager.forEach((item)=>{
                        item.time = item.strCreateTime;
                    })
                }
                list = self.isOpen ? data.comments : data.commentPager;
                self.commentHasMore = self.isOpen ? data.hasMore : data.currPage < data.maxPage;
                self.commentList = self.commentList.concat(list);
                self.loading = false;
                self.lock_roll = false;
            })
        },
        // 已阅跳转
        toRead(){
            if(this.isOpen) return;
            this.$router.push({
                path: '/readList',
                query:{
                    id: this.id
                }
            })
        },
        // 点赞查看全部
        toPraise(){
            this.$router.push({
                path: '/praiseList',
                query:{
                    id: this.id
                }
            })
        },
        // 查看案例
        toCase(){
            this.$router.push({
                path: this.isOpen ? '/open/caseList' : '/caseList',
                query:{
                    productId: this.id
                }
            })
        },
        // 点击分享按钮
        toShare(){
            this.isShowShare = true;
        },
        // 分享信息
        shareLink(title, img, summary){
            _.checkApi.setDataForWeixinValue(
                title,
                img,
                summary,
                window.location.href
            );
        },
        // 添加水印
        addMark (markText) {
            let self = this;
            let canvas = document.createElement('CANVAS'),
                ctx = canvas.getContext("2d");

            canvas.width = 160;
            canvas.height = 100;

            ctx.fillStyle = 'rgba(204, 204, 204, 0.5)';
            ctx.font = '12px Microsoft YaHei lighter';
            ctx.rotate(-15 * Math.PI / 180);
            ctx.fillText(markText, 20, 40);

            let img = canvas.toDataURL();
            this.$nextTick(()=>{
                if(self.$refs.waterMark){
                    self.$refs.waterMark.style.backgroundImage = `url(${img})`;
                }
            });
        },
        weixinBack(){
            var len = window.history.length;
            if(len < 2) {
                WeixinJSBridge.invoke('closeWindow', {});
            } else {
                this.$router.go(-1);
            }
        }
    },
    components:{
        detailItem,
        commentList,
        loadMore,
        userInfo,
        chatInput,
        userSelect,
        previewImages,
        qwShare
    }
}
</script>

<style lang="scss" scoped>
 @media screen and (min-width: 1024px){
    .comment_input,.qwui-watermark{
      width: 740px !important;
      margin: 0 auto;
    }
  }
.wrap {
    margin-bottom: 54px;
}
  .openfootercontent {
    width: 100%;
    height: 16px;
    line-height: 16px;
    padding:10px 0;
    text-align: center;
    .openfooterlink {
        color: #999;
        font-size: 12px;
    }
    img {
        margin-right: 5px;
        width: 15px;
        height: 15px;
        vertical-align:middle;
    }
  }
  .comment_input{
      display: flex;
      position: fixed;
      line-height: 50px;
      width: 100%;
      height: 50px;
      justify-content: space-between;
      bottom: 0;
      background: #fff;
      box-shadow: 0 -1px 10px 0 #e3e4e8;
      z-index: 4;
      .qwui-input_div{
        flex: 1;
        .qwui-input{
          display: flex;
          height: 38px;
          align-items: center;
          flex: 1;
          margin: 6px 15px;
          padding-left: 10px;
          border-radius: 5px;
          font-size: 15px;
          color: #b2b9c8;
          text-align: left;
          background: #f6f6fa;
          cursor: pointer;
          input{
            font-size: 14px;
            background: none;
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
</style>
