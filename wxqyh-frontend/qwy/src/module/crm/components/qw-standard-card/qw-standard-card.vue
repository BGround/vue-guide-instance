<template>
    <div class="card" @click="dealClick" v-perm="permission">
        <div class="card_container" slot="content">
            <img class="img_item" :src="imgSrc">
            <h2>{{title}}</h2>
            <p>{{text}}</p>
        </div>
        <i  v-if="hasCooperate"
            class="iconfont icon_edit public-web-ic_b-editor"
            :class="{isShow: isShowDialog}"
            @click="handleEdit"
        >
        </i>
        <qw-form-dialog ref = 'formDialog'
                        v-if="hasCooperate"
                        :dataList="formData"
                        @closeDialog = "handleCloseDialog"
                        @submit="handleSubmit"
        ></qw-form-dialog>
    </div>
</template>

<script>
import QwFormDialog from '../qw-form-dialog/qw-form-dialog'
export default {
    name: 'qw-standard-card',
    components: {
        QwFormDialog
    },
    created() {
        this.formData = [...this.editData];
    },
    data() {
        return {
            formData: [],
            isShowDialog: false,
        }
    },
    props: {
        // 图片地址
        imgSrc: {
            type: String,
        },
        // 标题
        title: {
            type: String
        },
        // 文字
        text: {
            type: String
        },
        permission: '',
        // 是否有修改处理
        hasCooperate: {
            type: Boolean,
            default: false
        },
        // 修改的选项
        editData: {
            type: Array,
            default: () => {
                return []
            }
        },
        // rules: {
        //     type: Object,
        //     default: () => {
        //         return {}
        //     }
        // }
    },
    methods: {
        dealClick(event) {
            this.$emit('click', event);
        },
        handleEdit() {
            this.isShowDialog = true;
            this.$refs.formDialog.showDialogMethod();
        },
        handleSubmit(formData) {
            this.$emit('submit', formData);
        },
        handleCloseDialog(){
            this.isShowDialog = false;
        }
    }
}
</script>

<style src="./qw-standard-card.scss" lang="scss" scoped></style>

