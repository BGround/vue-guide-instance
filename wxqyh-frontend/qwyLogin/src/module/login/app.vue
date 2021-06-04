<template>
    <div id="app">
        <div>
          <router-view></router-view>
        </div>
        <msg-boxs></msg-boxs>
    </div>
</template>

<script>
import msgBoxs from '@/components/base/msgBoxs';

export default {
    name: 'app',
    components:{
        "msg-boxs": msgBoxs,
    },
    data() {
        return {
            dataBase: dataBase
        }
    }
}
</script>

<style>
    @import '../../../static/css/common.css';
    @import '../../assets/css/style.css';
    /*修改弹窗按钮颜色*/
    ._alert_box .normal_btn {
        color: #FFF;
        background-color: #FF9600;
        border-color: #F87B00;
    }
    ._alert_box .normal_btn:hover {
        background-color: #F77C00;
        border-color: #EC6519;
    }
</style>
