<template>
    <div class="app-list">
        <div class="option arrow"
            v-for="(app, index) in appList"
            :key="index"
            @click="select(index)">
            <i  class="select-icon checkbox"
                :class="{ 'active': app.selected }"></i>
            <i  class="app-icon"
                :class="[app.picPath ? 'bd-b-' + JSON.parse(app.picPath).icon : 'bd-b-chucha']"
                :style="[app.picPath ? {color: JSON.parse(app.picPath).color} : { color: '#5f9ff3'}]"></i>
            <div class="name" v-html="app.typeName"></div>
            <span class="detail-num" @click.stop="showTag(app, index)">{{app.resultCount}}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'appList',
    props: {
        appList: Array,
        checkedList: Object
    },
    data() {
        return {}
    },
    methods: {
        select(index) {
            let app = this.appList[index]
            app.selected = !app.selected
            this.$set(this.appList, index, app)
            if(app.selected) {
                this.$set(this.checkedList.appList, app.typeId, app.typeName)
            } else {
                this.$delete(this.checkedList.appList, app.typeId)
            }
        },
        showTag(app, index) {
            this.$emit('showTag', { app, index })
        }
    }
}
</script>

<style lang='scss' scoped>
@import './list.scss';
</style>
