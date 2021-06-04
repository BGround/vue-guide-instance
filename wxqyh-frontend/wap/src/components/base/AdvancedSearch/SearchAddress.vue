<template>
    <div class="address arrow" @click="showAddressTab">
        <label class="label ellipsis">{{field.label}}</label>
        <div class="item ellipsis">
            <x-address
                title=''
                @on-hide="hide"
                v-model="value"
                :list="addressData"
                placeholder="请选择地址"
                :show.sync="showAddress"></x-address>
        </div>
    </div>
</template>

<script>
import { XAddress, ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'

export default {
    name: 'addressField',
    props: ['field', 'searchValue', 'setting'],
    components: {
        XAddress,
    },
    data () {
        return {
            title: '默认为空',
            value: [],
            addressData: ChinaAddressV4Data,
            showAddress: false
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
        doShowAddress () {
            this.showAddress = true
            setTimeout(() => {
                this.showAddress = false
            }, 2000)
        },
        getName (value) {
            return value2name(value, ChinaAddressV4Data)
        },
        hide() {
            // this.searchValue[this.field.key] = this.value;
            let searchValue = {
                text: this.getName(this.value),
                value: this.value
            }
            this.searchValue[this.field.key] = searchValue;
        },
        showAddressTab() {
            this.showAddress = true;
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
<style>
.address {
    position: relative;
    display: flex;
    border: 1px solid #E4E5E9;
    padding: 0 25px 0 10px;
}
.address .label {
    flex: 4;
    line-height: 34px;
    color: #1B233A;
    overflow: hidden;
}
.address .item {
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
.address .vux-popup-picker-placeholder {
  color: #bbb;
}
</style>

