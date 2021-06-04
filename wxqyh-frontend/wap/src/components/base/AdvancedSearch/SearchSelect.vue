<template>
    <div class="select arrow">
        <label class="label ellipsis">{{field.label}}</label>
        <select class="item ellipsis" v-model="selected"
            :class="{'default': isDefault}">
            <option v-for="option in field.value"
                    :value="option.value"
                    :key="option.value">{{option.text}}</option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'selectField',
    props: ['field', 'searchValue', 'setting'],
    data() {
        return {
            label: this.field.label,
            key: this.field.key,
            selected: ''
        }
    },
    computed: {
        isDefault() {
            if(this.selected == this.field.value[0].value) {
                if(this.field.value[0].text == '请选择') {
                    return true
                }
            }
            return false
        }
    },
    created () {
        this.selected = this.searchValue[this.key] || this.field.value[0].value
    },
    methods: {
        reset() {
            this.selected = this.field.value[0].value;
        }
    },
    watch: {
        searchValue: {
            handler(val) {
                if(!val[this.key]) {
                    this.reset();
                }
            },
            deep: true
        },
        selected(val) {
            this.searchValue[this.key] = val;
        }
    }
}
</script>

<style scoped>
.select {
    position: relative;
    display: flex;
    border: 1px solid #E4E5E9;
}
.select select {
    width: 100%;
    padding: 0 25px 0 5px;
    border: none;
    line-height: 36px;
}
.select .label {
    max-width: 30%;
    line-height: 34px;
    color: #1B233A;
    overflow: hidden;
    padding-left: 10px;
}
.select .item {
    flex: 6;
    height: 34px;
    padding-left: 8px;
    box-sizing: border-box;
    line-height: 34px;
    border-radius: 2px;
    font-size: 13px;
    color: #666666;
    background-color: #fff;
    text-align: right;
    direction: rtl;
}
.select .item.default {
    color: #bbb;
}
.select .item option {
    color: #666666;
}
.arrow::after {
    content: "";
    position: absolute;
    color: #999999;
    right: 5px;
    top: 50%;
    width: 14px;
    height: 14px;
    transform: translateY(-50%);
    background: url(../../../assets/images/icon_down.png) no-repeat;
    background-size: contain;
}
.ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    overflow:hidden;
}
</style>

