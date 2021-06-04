<template>
    <div class="form option" @click="select">
        <i class="select-icon checkbox"
            :class="{ 'active': form.selected }"></i>
        <i class="icon-font" :class="iconType[form.isTask]"></i>
        <div class="name" v-html="form.formName"></div>
        <span class="detail-num">{{form.resultCount}}</span>
    </div>
</template>

<script>
import { getFormTemplate } from "../../../api/list"

export default {
    name: 'formList',
    props: {
        form: Object,
        index: Number
    },
    data() {
        return {
            iconType: {
                '0': 'bd-putongdan',
                '1': 'bd-renwudan',
                '2': 'bd-shenpidan',
                '3': 'bd-waibudan'
            }
        }
    },
    methods: {
        select() {
            this.$emit('select', this.index)
        }
    }
}
</script>


<style lang='scss' scoped>
@import './list.scss';
</style>