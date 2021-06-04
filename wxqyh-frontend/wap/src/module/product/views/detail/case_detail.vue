<template>
    <div class="wrap" v-show="showDetail"
        v-qw-water-mark="{ agentCode: 'productinfo', isShow: !isOpen }">
        <div class="case_content">
            <p class="title">{{title}}</p>
            <p class="link" v-if="caseUrl">案例链接：<span v-html="caseUrl"></span></p>
            <img class="coverImg" v-if="coverImg"
                    :src="coverImg"
                    @click="preview(coverImg)"/>
        </div>
        <!--媒体文件列表-->
        <file-list v-if="mediaList.length > 0"
                :filesList="mediaList"
                :downLoad="true"
                :deleteFile="false">
            <p class="media_text" slot="title">附件({{mediaList.length}})</p>
        </file-list>
        <!--预览图片组件-->
        <preview-images></preview-images>
    </div>
</template>

<script>
import fileList from '@/components/add/upload/addFileList';
import previewImages from "@/components/base/previewImages";
import EventBus from '@/utils/eventBus';
import {getCaseDetail} from '../../api/getData.js';
import qwWaterMark from '@/directive/qwWaterMark'
export default {
    directives: { qwWaterMark },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        },

    },
    data(){
        return{
            showDetail: false,
            loading: false,
            coverImg: '', // 案例图片
            mediaList: [], // 附件列表
            title: '', // 标题
            caseUrl: '',// 案例链接
        }
    },
    computed:{
        id(){
            return this.$route.query.id;
        },
    },
    created(){
        // 获取详情
        this.initDetail();
    },
    methods:{
        // 获取详情
        initDetail(){
            var self = this;
            getCaseDetail(self.isOpen,{
                id: self.id
            },(data)=>{
                var po = data.tbXyhProductCasePO;
                self.title = po.title;
                // 案例链接
                if(po.caseUrl) {
                    self.caseUrl = _.checkURL(po.caseUrl, false);
                }
                // 案例图片
                if(po.caseImg != '') {
                    self.coverImg = _.filterCompressURL(po.caseImg);
                }
                // 附件
                if(data.mediaList) {
                    self.mediaList = data.mediaList;
                }
                self.showDetail = true;
            }, (result)=>{
                 var btn={
                    primaryBtn:{name:'确定', callBack: self.weixinBack},
                    defaultBtn:{name:'', callBack:null},
                };
                 _.alert('提示',result.desc,btn);
            })
        },
        // 图片预览
        preview(src){
            EventBus.$emit('previewImages',src, [{picPath: src}]);
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
        previewImages,
        fileList
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    background: #fff;
    .case_content {
        padding: 10px;
        .title {
            line-height: 24px;
            color: #333;
            font-size: 16px;
            text-align: center;
            font-weight: bold;
        }
        .link {
            color: grey;
            font-size: 12px;
        }
        .coverImg {
            padding: 5px 0;
            max-width: 100%;
            width: 100%;
            vertical-align: middle;
        }
    }
    .qwui-title_file {
        .media_text {
            position: relative;
            padding: 10px;
            font-size: 16px;
            color: #333;
            &::before {
                content: '';
                position: absolute;
                width: 100%;
                left: 0;
                right: 0;
                bottom: 0;
                height: 1px;
                border-bottom: 1px solid #ddd;
            }
        }
        /deep/ .qwui-setting_item {
            padding: 5px 10px;
        }
    }
}
</style>
