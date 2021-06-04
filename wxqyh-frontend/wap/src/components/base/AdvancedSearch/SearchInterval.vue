<template>
    <div class="interval">
        <label class="label" v-if="field.label">{{ field.label }}</label>
        <div class="contain">
            <input
                :ref="field.key[0]"
                class="item"
                :type="inputType"
                :placeholder="fromPlaceholder || '请输入'"
                v-model="searchValue[field.key[0]]"
                @change="from">
            <span class="blank">
                <div class="line"></div>
            </span>
            <input
                :ref="field.key[1]"
                class="item"
                :type="inputType"
                :placeholder="toPlaceholder || '请输入'"
                v-model="searchValue[field.key[1]]"
                @change="to">
        </div>
    </div>
</template>

<script>
    export default {
        name: 'intervalField',
        props: ['field', 'searchValue', 'setting'],
        computed: {
            fromPlaceholder() {
                if(this.field.placeholder) {
                    return this.field.placeholder.from;
                } else {
                    return ''
                }
            },
            toPlaceholder() {
                if(this.field.placeholder) {
                    return this.field.placeholder.to;
                } else {
                    return ''
                }
            },
            inputType() {
                return this.field.inputType || 'text'
            }
        },
        methods: {
            from() {
                if(this.field.callBack) {
                    this.field.callBack.from();
                }
            },
            to() {
                if(this.field.callBack) {
                    this.field.callBack.to();
                }
            }
        },
        watch: {
            searchValue: {
                handler(val) {
                    if(!val[this.field.key[0]]) {
                        this.$refs[this.field.key[0]].value = ''
                    }
                    if(!val[this.field.key[1]]) {
                        this.$refs[this.field.key[1]].value = ''
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
.interval .label {
    display: block;
    padding: 10px 0;
    color: #1B233A;
    font-size: 13px;
}
.interval .contain {
    display: flex;
}
.interval .item {
    flex: 4;
    height: 34px;
    padding: 0 8px;
    box-sizing: border-box;
    border: 1px solid #E4E5E9;
    line-height: 1;
    border-radius: 2px;
    font-size: 13px;
    color: #666666;
    background-color: #fff;
    text-align: center;
    width: 10px;
    outline: none;
    -webkit-appearance: none;
}
.interval .blank {
    position: relative;
    display: inline-block;
    width: 35px;
    line-height: 34px;
    text-align: center;
}
.interval .blank .line {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 19px;
    height: 1px;
    background-color: #E4E5E9;
    transform: translate(-50%, -50%);
}
</style>
