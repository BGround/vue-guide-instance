<template>
    <div id="showField">
        <div class="field">
            <div class="choice-field-item checkbox-field-item"
                @click="checkedAll">
                <i :class="{ active: checkAll}"></i>全选
            </div>
            <div class="choice-field-item checkbox-field-item"
                v-for="(field, index) in customField"
                :key="field.itemKey"
                @click="setField(index, field.itemKey)">
                <i :class="{ active: checkedModel[index].checked}"></i>
                <span v-html="renderText(field.parentName, field.itemName)"></span>
            </div>
        </div>
        <div class="footer">
            <span class="close"
                @click="close">取消</span>
            <span class="reset"
                @click="reset">重置</span>
            <span class="search"
                @click="search">确定</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'showField',
    props: {
        showField: String,
        customField: Array
    },
    data() {
        return {
            checkedModel: [],
            fieldSetting: {}
        }
    },
    computed: {
        // true: 全部选中 false：未全部选中
        checkAll: {
            get() {
                return this.checkedCount == this.customField.length;
            },
            set(val) {
                this.checkedModel.forEach(item => {
                    item.checked = val;
                });
            }
        },
        // 选中的数量
        checkedCount() {
            let i = 0,
                showField = ['',''],
                _this = this;
            this.checkedModel.forEach(item => {
                if(item.checked) {
                    i++;
                }
            })
            return i;
        }
    },
    methods: {
        // 初始化字段
        initField() {
            let field = {};
            if(this.showField){
                for(let i = 0; i < this.customField.length; i++) {
                    field[this.customField[i].itemKey] = false;
                }
                let showField = this.showField.split("|");
                showField.shift();
                showField.pop();
                for(let i = 0; i < showField.length; i++) {
                    field[showField[i]] = true;
                }
            } else {
                for(let i = 0; i < this.customField.length; i++) {
                    field[this.customField[i].itemKey] = true;
                }
            }
            this.fieldSetting = field;
        },
        // 初始化checkedModel
        initCheckedModel() {
            this.customField.forEach((item, index) => {
                this.checkedModel.push({
                    key: item.itemKey,
                    checked: this.fieldSetting[item.itemKey] ? true : false
                });
            });
        },
        // 渲染字段名称
        renderText(parentName, itemName) {
            let str = '';
            if(parentName) {
                str += parentName + ' > '
            }
            str += itemName;
            return str
        },
        // 显示字段
        setField(index, key) {
            this.checkedModel[index].checked = !this.checkedModel[index].checked;
            this.fieldSetting[key] = this.checkedModel[index].checked;
        },
        // 关闭
        close() {
            this.reset();
            this.$emit("close");
        },
        // 重置
        reset() {
            this.initField();
            this.checkedModel.forEach(item => {
                item.checked = this.fieldSetting[item.key] ? true : false;
            })
        },
        // 全选
        checkedAll() {
            this.checkAll = !this.checkAll;
            for(let key in this.fieldSetting) {
                this.fieldSetting[key] = this.checkAll;
            }
        },
        // 确定
        search() {
            let showField = ["", ""];
            for(var key in this.fieldSetting) {
                if(this.fieldSetting[key] == true) {
                    showField.splice(1, 0, key)
                }
            }
            if(showField.length == 2) {
                return _.alert('提示', '至少需要选中一个字段')
            }
            showField = showField.join('|');
            this.$emit('search', showField);
            this.$emit("close");
        }
    },
    created() {
        this.initField();
        this.initCheckedModel();
    }
}
</script>

<style lang="scss" scoped>
$baseUrl: '~assets/images/';

@mixin background($url) {
    background: url($baseUrl + $url) no-repeat;
    background-size: 100%;
}
#showField {
    position: fixed;
    display: flex;
    top: 0;
    z-index: 12;
    height: 100%;
    width: 100%;
    flex-direction: column;
    background-color: #fff;
    @media screen and (min-width: 1024px) {
        width: 740px;
        margin: auto;
    }
    .field {
        display: flex;
        flex: auto;
        flex-direction: column;
        padding-left: 15px;
        overflow: auto;
        .choice-field-item {
            position: relative;
            padding: 14px 14px 14px 25px;
            border-radius: 4px;
            font-size: 15px;
            box-shadow: 0px -1px 0px 0px rgba(247,248,250,1);
            cursor: pointer;
            i {
                position: absolute;
                display: inline-block;
                top: 50%;
                left: 0;
                width: 16px;
                height: 16px;
                @include background('icon_form_single-unselected.png');
                transform: translateY(-50%);
            }
        }
        .checkbox-field-item.choice-field-item {
            i {
                position: absolute;
                top: 50%;
                @include background('icon_form_check-unselected.png');
                transform: translateY(-50%);
            }
            i.active {
                @include background('icon_form_check-checked.png');
            }
        }
    }
    .footer {
        display: flex;
        z-index: 10;
        width: 100%;
        box-sizing: border-box;
        background-color: #fff;
        min-height: 50px;
        line-height: 50px;
        font-size: 14px;
        @media screen and (min-width: 1024px) {
            width: 740px;
        }
        .close {
            flex: 1;
            background-color: #F6F7FB;
            color: #7A7D80;
            text-align: center;
            border-right: 1px solid rgba(204,204,204,0.5);
            cursor: pointer;
        }
        .reset {
            flex: 1;
            background-color: #F6F7FB;
            color: #5586F0;
            text-align: center;
            border-right: 1px solid rgba(204,204,204,0.5);
            cursor: pointer;
        }
        .checkedAll {
            flex: 1;
            background-color: #F6F7FB;
            color: #2F7DCD;
            text-align: center;
            cursor: pointer;
        }
        .search {
            flex: 2;
            background-color: #5485EF;
            color: #fff;
            text-align: center;
            cursor: pointer;
        }
    }
}
::-webkit-scrollbar {
    width: 0;
}
</style>
