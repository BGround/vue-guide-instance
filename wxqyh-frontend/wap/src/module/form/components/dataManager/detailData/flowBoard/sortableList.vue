<template>
    <div class="sort-list" :useDragHandle="true">
        <div class="title">{{title}}</div>
        <sortable-list 
            lockAxis="y" 
            v-model="sortList" 
            :useDragHandle="true" 
            helperClass="sortting">
            <sortable-item 
                v-for="(sortItem, index) in sortList"
                :index="index"
                :key="index"
                :sortItem="sortItem"
                :nameKey="nameKey"
                :showKey="showKey"></sortable-item>
        </sortable-list>
        <div class="footer">
            <div class="cancel" @click="cancel">取消</div>
            <div class="confirm" @click="confirm">确定</div>
        </div>
        
    </div>
</template>

<script>
import { ContainerMixin } from 'vue-slicksort'
import SortableItem from './sortableItem'

const SortableList = {
    mixins: [ContainerMixin],
    template: `
        <ul class="list">
        <slot />
        </ul>
    `
};
export default {
    components: {
        SortableList,
        SortableItem
    },
    name: 'sortList',
    props: {
        title: String,
        list: Array,
        nameKey: String,
        showKey: String
    },
    data() {
        return {
            sortList: JSON.parse(JSON.stringify(this.list))
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        confirm() {
            this.$emit('confirm', this.sortList)
        }
    }
}
</script>

<style lang="scss" scoped>
$baseUrl: '~assets/images/';

@mixin background($url) {
    background: url($baseUrl + $url) no-repeat;
    background-size: 100%;
}
.sort-list {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    width: 375px;
    height: 100%;
    line-height: 48px;
    background-color: #FFF;
    .title {
        padding: 0 20px 0 16px;    
        font-size: 12px;
        color: #85868F;
    }
    .list {
        overflow: hidden;
        overflow-y: auto;
        margin-bottom: 50px;
        background-color: #F7F8FA; 
    }
    .footer {
        position: absolute;
        bottom: 0;
        display: flex;
        width: 100%;
        line-height: 50px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        .cancel {
            flex: 50%;
            color: #7A7D80;
            background-color: #F6F7FB;
        }
        .confirm {
            flex: 50%;
            color: #FFF;
            background-color: #5485EF;
        }
    }
}
::-webkit-scrollbar {
    width: 6px;
    border-radius: 4px;
}
::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #E3E4E8;
}
</style>
