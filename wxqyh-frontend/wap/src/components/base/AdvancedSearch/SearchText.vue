<template>
    <div class="text">
        <label class="label ellipsis" :for="field.key">{{field.label}}</label>
        <input class="item"
            :ref="field.key"
            :id="field.key"
            :type="inputType"
            :placeholder="field.placeholder || '请选择'"
            v-model="searchValue[field.key]"
            @change="change">
    </div>
</template>

<script>
export default {
    name: 'textField',
    props: ['field', 'searchValue', 'setting'],
    computed: {
        inputType() {
            return this.field.inputType || 'text'
        }
    },
    methods: {
        change() {
            if(this.field.callBack) {
                this.field.callBack();
            }
        }
    },
    watch: {
        searchValue: {
            handler(val) {
                if(!val[this.field.key]) {
                    this.$refs[this.field.key].value = '';
                }
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.text {
    display: flex;
    border: 1px solid #E4E5E9;
    padding: 0 10px;
}
.text .label {
    max-width: 30%;
    line-height: 34px;
    color: #1B233A;
    overflow: hidden;
}
.text .item {
    flex: 6;
    height: 34px;
    padding-left: 30px;
    box-sizing: border-box;
    outline: none;
    border: none;
    line-height: 1;
    border-radius: 2px;
    font-size: 13px;
    color: #666666;
    background-color: #fff;
    text-align: right;
}
.ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    overflow:hidden;
}
</style>


