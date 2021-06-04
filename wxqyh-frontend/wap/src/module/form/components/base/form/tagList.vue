<template>
    <div class="tag-list option">
        <div class="tag"
            v-for="(tag, index) in tagList"
            :key="tag.id">
            <div class="tag-item" @click="showChild(index)">
                <i class="select-icon checkbox"
                    :class="{ 'active': tag.selected }"
                    @click.stop="selectTag(index)"></i>
                {{tag.typeName}}
                <i class="drag-icon"
                    :class="{'active': tag.show}"></i>
            </div>
            <div class="form-list" v-show="tag.show">
                <form-list
                    v-for="(form, indx) in tag.formList"
                    :key="form.formId"
                    :form="form"
                    :index="indx"
                    @select="selectTagForm(index, indx)">
                </form-list>
            </div>
        </div>
        <form-list
            v-for="(form, indx) in formList"
            :key="form.formId"
            :form="form"
            :index="indx"
            @select="selectForm">
        </form-list>
    </div>
</template>

<script>
import { getFormTemplate } from "../../../api/list"
import FormList from './formList'

export default {
    name: 'tagList',
    components: {
        FormList
    },
    props: {
        checkedList: Object,
        tagList: Array,
        formList: Array
    },
    methods: {
        showChild(index) {
            this.$set(this.tagList[index], 'show', !this.tagList[index].show)
        },
        selectTag(index) {
            let tag = JSON.parse(JSON.stringify(this.tagList[index]))
            tag.selected = !tag.selected
            this.$set(this.tagList, index, tag)
            if(tag.selected) {
                this.$set(this.checkedList.tagList, tag.id, tag.typeName)
            } else {
                this.$delete(this.checkedList.tagList, tag.id)
            }
        },
        selectTagForm(tagIndex, index) {
            let form = JSON.parse(JSON.stringify(this.tagList[tagIndex].formList[index]))
            form.selected = !form.selected
            this.$set(this.tagList[tagIndex].formList, index, form)
            if(form.selected) {
                this.$set(this.checkedList.formList, form.formId, form.formName)
            } else {
                this.$delete(this.checkedList.formList, form.formId)
            }
        },
        selectForm(index) {
            let form = JSON.parse(JSON.stringify(this.formList[index]))
            form.selected = !form.selected
            this.$set(this.formList, index, form)
            if(form.selected) {
                this.$set(this.checkedList.formList, form.formId, form.formName)
            } else {
                this.$delete(this.checkedList.formList, form.formId)
            }
        },
    },
}
</script>


<style lang='scss' scoped>
@import './list.scss';
</style>