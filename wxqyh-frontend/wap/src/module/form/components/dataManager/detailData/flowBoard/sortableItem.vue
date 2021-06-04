<template>
    <div class="sort-item">
        <div class="drag-box" v-handle>
            <i class="drag-icon"></i>
        </div>
        {{sortItem[nameKey]}}
        <div class="qwui-user_cell_switch">
            <input type="checkbox" 
                class="qwui-user_cell_input"
                v-model="sortItem[showKey]">
        </div>
    </div>
</template>
<script>
import { ElementMixin , HandleDirective } from 'vue-slicksort'

export default {
    name: 'sortItem',
    mixins: [ElementMixin],
    props: {
        sortItem: Object,
        nameKey: String,
        showKey: String
    },
    directives: { 
        handle: HandleDirective 
    }
}
</script>

<style lang="scss" scoped>
$baseUrl: '~assets/images/';

@mixin background($url) {
    background: url($baseUrl + $url) no-repeat;
    background-size: 100%;
}
.sort-item {
    position: relative;
    padding-right: 20px;        
    font-size: 13px;
    line-height: 48px;
    color: #0A1735;
    font-weight: 600;
    user-select: none;
    background-color: #FFF;
    &:hover {
        background-color: #F7F8FA;
    }
    .drag-box {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 48px;
        vertical-align: bottom;
        cursor: move;
    }
    .drag-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 16px;
        transform: translate(-50%, -50%);
        @include background('icon_drag.png');   
    }
}
.qwui-user_cell_switch{
    position: absolute;
    top: 0;
    right: 20px;
}
.qwui-user_cell_input{
    position: relative;
    width: 40px;
    height: 22px;
    border: 1px solid #dfdfdf;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #dfdfdf;
    cursor: pointer;
    appearance: none;
    transition: background-color 0.1s, border 0.1s;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.qwui-user_cell_input:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 38px;
    height: 20px;
    border-radius: 15px;
    background-color: #FDFDFD;
    transition: -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}
.qwui-user_cell_input:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.qwui-user_cell_input:checked{
    border-color: #5485EF;
    background-color: #5485EF;
}
.qwui-user_cell_input:checked:before{
    -webkit-transform: scale(0);
    transform: scale(0);
}
.qwui-user_cell_input:checked:after{
    -webkit-transform: translateX(18px);
    transform: translateX(18px);
}
</style>
