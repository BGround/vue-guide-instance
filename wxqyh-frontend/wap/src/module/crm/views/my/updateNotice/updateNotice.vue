<template>
    <transition name="slide-fade" >
        <div class="update_page">
            <crm-scroll>
            <div class="update_wrap" v-html="textareaHtml"></div>
            <!-- 垫高块 -->
            <div class="height50"></div>
            </crm-scroll>
        </div>
    </transition>
</template>

<script>
import CrmScroll from '../../../components/CrmScroll/CrmScroll';
import { searchAnnouncement } from '../../../api/my/getData.js';
export default {
    name: 'updateNotice',
    data() {
        return {
            textareaHtml: ''
        }
    },
    components:{
        CrmScroll
    },
    created() {
        this.init()
    },
    methods: {
        init(){
            searchAnnouncement().then(res => {
                if(res.code == '0'){
                    this.textareaHtml = res.data.announcementVO.context
                }else{
                    _.alert(res.desc)
                }
            })
        }
    }
}
</script>

<style lang='scss' scoped>
@import '../../../crmBase.scss';
.update_page{
    height: 100%;
    background: #fff;
    /deep/ ol{
        li{
            margin-left: 40px !important;
            list-style-type: decimal;
            text-align: justify;
            margin-right:20px !important;
        }
    }
    /deep/ ul{
        li{
            margin-left: 40px !important;
            list-style-type: disc;
            text-align: justify;
             margin-right:20px !important;
        }
    }
    .height50{
        height: 50px;
    }
    .update_wrap{
        // height: 100%;
        width: 100%;
        background: #fff;
    }
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(70px);
  opacity: 0;
}
</style>
