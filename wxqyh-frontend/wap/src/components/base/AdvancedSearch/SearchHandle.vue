<template>
    <div class="handleClick arrow" @click="handleClick">
        <label class="label ellipsis">{{field.label}}</label>
        <span class="item ellipsis">
            <span v-if="!field.isShowPlaceholder" class="default">请选择</span>
            <div v-else class="text ellipsis">{{field.selectValue}}</div>
        </span>
    </div>
</template>

<script>

export default {
    name: 'handleClickField',
    props: ['field', 'searchValue', 'setting'],
    data () {
        return {
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            if(!this.searchValue[this.key]) {
                return
            }
            this.value = this.searchValue[this.key].value;
        },
        reset() {
            this.value = [];
        },
        handleClick() {
            if(this.field.callBack) {
                this.field.callBack();
            }
        }
    },
    watch: {
        searchValue: {
            handler(val) {
                 if(!val[this.key]) {
                    this.reset();
                }
                if(val[this.key]) {
                    this.init();
                }
            },
            deep: true
        }
    }
}
</script>
<style>
.handleClick {
    position: relative;
    display: flex;
    border: 1px solid #E4E5E9;
    padding: 0 25px 0 10px;
}
.handleClick .label {
    flex: 4;
    line-height: 34px;
    color: #1B233A;
    overflow: hidden;
}
.handleClick .item {
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
}
.default {
    color: #bbb;
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
.handleClick .text {
  display: block
}
</style>

