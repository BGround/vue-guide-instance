<template>
    <div class="radio">
        <label class="label" 
            v-if="field.label">
            {{ field.label }}
        </label>
        <ul class="contain">
            <li v-for="(item, index) in field.value"
                :key="item.text" >
                <div class="item"
                    @click="checked(item, index)"
                    :class="{active: index == currIndex}">
                    <div class="text"
                        ref="text">{{ item.text }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'radioField',
        props: ['field', 'searchValue', 'setting'],
        data() {
            return {
                key: this.field.key,
                currIndex: -1
            }
        },
        created() {
            this.init();
        },
        mounted() {
            let parentWidth = (document.body.clientWidth - 30) / 3 * 0.9
            this.$refs.text.forEach((item, index) => {
                let textWidth = item.innerHTML.length * 13;
                if(textWidth > parentWidth) {
                    item.style.fontSize = '12px';
                    item.style.lineHeight = 'initial';
                }
            })
        },
        methods: {
            init() { // 根据缓存初始化
                let index = this.field.noDefault ? -1 : 0, //noDefault: 是否不需要默认选中 true为不需要默认选中 false为需要默认选中 默认需要默认选中
                    searchValue = this.searchValue,
                    field = this.field;
                field.value.forEach((item, indx) => {
                    if(item.value == searchValue[field.key]) {
                        index = indx;
                    }
                })
                this.currIndex = index;
            },
            checked(item, index) {
                this.currIndex = index;
                this.$set(this.searchValue, this.field.key, item.value)
                this.$emit('checkedRadio',this.currIndex,this.field.key, item.value)
                if(this.field.value[index].callBack) {
                    this.field.value[index].callBack();
                }
            },
            reset() {
                this.currIndex = this.field.noDefault ? -1 : 0;
            },
            showOrHideRelativeLabel(newVal, oldVal) {
                let hideLabel = [], // 需要隐藏的label
                    showLabel = [], // 需要显示的label
                    field = this.field,
                    searchValue = this.searchValue,
                    setting = this.setting

                if(field.value[oldVal] && field.value[oldVal].relativeLabel) {
                    hideLabel = field.value[oldVal].relativeLabel;
                }
                if(field.value[newVal] && field.value[newVal].relativeLabel) {
                    showLabel = field.value[newVal].relativeLabel;
                }
                setting.forEach((item, index) => {
                    index ++; // index从1开始，而不是从0开始
                    hideLabel.forEach(indx => {
                        if(index == indx) {
                            if(Array.isArray(item.key)) {
                                item.key.forEach((itm) => {
                                     Reflect.deleteProperty(searchValue, itm)
                                })
                            } else {
                                Reflect.deleteProperty(searchValue, item.key)
                            }
                            item.show = false;
                        }
                    })

                    showLabel.forEach(indx => {
                        if(index == indx) {
                            item.show = true;
                        }
                    })
                });
            }
        },
        watch: {
            searchValue: {
                handler(val) {
                    if(!val[this.key]) {
                        this.reset()
                    }
                    if(this.currIndex != -1) {
                        if(val[this.key] != this.field.value[this.currIndex].value) {
                            this.init();
                        }
                    }
                },
                deep: true
            },
            currIndex(newVal, oldVal) {
                if(newVal == -1) {
                    return
                }
                this.showOrHideRelativeLabel(newVal, oldVal);
            }
        }
    }
</script>
<style scoped>
.radio .label {
    display: block;
    padding: 10px 0;
    color: #1B233A;
    font-size: 13px;
}
.radio .contain {
    display: flex;
    flex-wrap: wrap;
}
.radio .contain li {
    display: flex;
    flex: 0 0 33.333%;
}
.radio .contain li:nth-child(3n - 1) {
    justify-content: center;
}
.radio .contain li:nth-child(3n) {
    justify-content: flex-end;
}
.radio .item {
    box-sizing: border-box;
    display: flex;
    width: 90%;
    height: 36px;
    color: #999999;
    font-size: 13px;
    border: 1px solid #E4E5E9;
    border-radius: 2px;
    padding: 0 5px;
    cursor: pointer;
    margin-bottom: 10px;
    justify-content: center;
    align-items: center;
}
.radio .item .text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    overflow: hidden;
    text-align: center;
}
.radio .item.active {
    color: #2F7DCD;
    background-color: #F0F4FF;
    border: 1px solid #2F7DCD;
}
</style>




