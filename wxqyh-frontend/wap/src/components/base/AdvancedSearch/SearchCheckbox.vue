<template>
    <div class="checkbox">
        <label class="label" 
            v-if="field.label">
            {{ field.label }}
            <div class="showMore" v-if="showMoreBtn" @click="showMore" ref="showMore"></div>
        </label>
        <ul class="contain">
            <li v-for="(option, index) in field.value"
                :key="option.text"
                v-show="index < 6 || showMoreOption">
                <div class="item" 
                    :class="isActive(option.text)" 
                    @click="checked(option.text, option.value)">
                    <div class="text"
                        ref="text">{{ option.text }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'checkboxField',
        props: ['field', 'searchValue', 'setting'],
        data() {
            return {
                key: this.field.key,
                checkModel: {},
                showMoreOption: false
            }
        },
        computed: {
            showMoreBtn() {
                return this.field.value.length > 6
            }
        },
        created() {
            this.init();
        },
        mounted() {
            this.setFontSize();
        },
        methods: {
            // 根据缓存进行初始化
            init() {
                if(!this.searchValue[this.key]) {
                    return
                }
                let searchValue = this.searchValue[this.key].split(','),
                    fieldValue = this.field.value;

                for(let i = 0; i < searchValue.length; i++) {
                    for(let j = 0; j < fieldValue.length; j++) {
                        if(searchValue[i] == fieldValue[j].value) {
                            this.$set(this.checkModel, fieldValue[j].text, true);
                        }
                    }
                }
            },
            // 选中
            checked(text, value) {
                let _this = this,
                    valueArr = this.searchValue[this.key];

                if(!valueArr) {
                    valueArr  = [];
                } else {
                    if(valueArr.length == 1) {
                        valueArr = valueArr.split('')
                    } else {
                        valueArr = valueArr.split(',')
                    }
                }
                this.$set(this.checkModel, text, !this.checkModel[text])
                if(this.checkModel[text]) {
                    valueArr.push(value)
                } else {
                    valueArr.forEach((item, index) => {
                        if(value == item) {
                            valueArr.splice(index, 1)
                        }
                    })
                }
                this.searchValue[this.key] = valueArr + '';
            },
            // 是否被选中
            isActive(text) {
                return this.checkModel[text] ? 'active' : ''
            },
            // 重置
            reset() {
                this.checkModel = {}
            },
            showMore() {
                this.showMoreOption = !this.showMoreOption;
                if(this.showMoreOption) {
                   this.$refs.showMore.style.transform = 'rotate(180deg)'; 
                } else {
                    this.$refs.showMore.style.transform = 'rotate(0deg)'
                }
                this.setFontSize();
            },
            setFontSize() {
                let parentWidth = (document.body.clientWidth - 30) / 3 * 0.9
                this.$refs.text.forEach((item, index) => {
                    let textWidth = item.innerHTML.length * 13;
                    if(textWidth > parentWidth) {
                        item.style.fontSize = '12px';
                        item.style.lineHeight = 'initial';
                    }
                })
            }
        },
        watch: {
            searchValue: {
                handler(val) {
                    if(!val[this.key]) {
                        this.reset()
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
.checkbox .label {
    display: block;
    padding: 10px 0;
    color: #1B233A;
    font-size: 13px;
}
.checkbox .contain {
    display: flex;
    flex-wrap: wrap;
}
.checkbox .contain li {
    display: flex;
    flex: 0 0 33.333%;
}
.checkbox .contain li:nth-child(3n - 1) {
    justify-content: center;
}
.checkbox .contain li:nth-child(3n) {
    justify-content: flex-end;
}
.checkbox .item {
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
.checkbox .item .text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    overflow: hidden;
    text-align: center;
}
.checkbox .item.active {
    position: relative;
    color: #2F7DCD;
    background-color: #F0F4FF;
    border: 1px solid #2F7DCD;
}
.checkbox .item.active:before {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 16px;
    height: 16px;
    background: url(../../../assets/images/icon-checked.png) no-repeat;
    background-size: 16px 16px;
}
.ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    overflow:hidden;
}
.showMore {
    position: relative;
    float: right;
    top: 6px;
    right: 6px;
    width: 14px;
    height: 10px;
    background: url(../../../assets/images/icon_down_gray.png) no-repeat;
    background-size: cover;
    transition: all .2s ease;
    cursor: pointer;
}
</style>
