/**
    @params listData(必传)：列表数据
    [
        {
            id: xxx,
            firstTitle: xxx,
            secondTitle: xxx,
            isSelect: true  // 是否被选中
        },
        {
            id: xxx,
            firstTitle: xxx,
            secondTitle: xxx,
            isSelect: false
        }
    ]
    @params confirm：确定按钮回调函数
    @params cancel：取消按钮回调函数
    @params loadMore：上拉加载更多回调函数
*/
<template>
    <div class="data_team_select">
        <div class="team_list_wrap">
            <crm-scroll @loadMore="loadMore">
                <ul class="team_list">
                    <li
                        class="team_item"
                        v-for="(item,idx) in listData"
                        :key="idx"
                    >
                        <div class="check_radio_wrap">
                            <input
                                v-model="item.isSelect"
                                type="checkbox"
                                class="icon_check"
                                :id="`check${idx}`"
                                @change="changeSelect(item, $event)">
                        </div>
                        <label :for="`check${idx}`" class="label_wrap">
                            <div class="team_item_wrap">
                                <div class="team_head"></div>
                                <div class="team_msg">
                                    <p class="firse_coloum">{{item.firstTitle}}</p>
                                    <p class="second_coloum">{{item.secondTitle}}</p>
                                </div>
                            </div>
                        </label>
                    </li>
                </ul>
            </crm-scroll>
            <no-record
                :stepTop="true"
                :hasRecord="noRecord"
                v-show="!showRecord">
            </no-record>
        </div>
        <div class="team_select_footer">
            <div class="footer_btn white_btn" @click="cancel">取消</div>
            <div class="select_num">
                <p class="title">已选择</p>
                <p class="num">{{selectNum}}个</p>
            </div>
            <div class="footer_btn blue_btn" @click="confirm">确定</div>
        </div>
    </div>
</template>
<script>
import teamHead from '@/assets/images/dept_ico.jpg';
import CrmScroll from '../CrmScroll/CrmScroll';
import NoRecord from "@/components/base/noRecord";
export default {
    name: 'TeamListSelect',
    props: {
        // 列表数据
        listData: {
            type: Array,
            required: true
        }
    },
    components: {
        CrmScroll,
        NoRecord 
    },
    data () {
        return {
            headUrl: teamHead,  // 团队头像路径
            selectIds: [],  // 选中的id
              noRecord: {
                // 无记录配置
                icon: "qwui-icon_no_Data",
                title: "",
                text: "没有销售团队"
            },
            
        }
    },
 
    computed: {
        selectNum () {
            let num = 0;
            this.listData.map(item => {
                if(item.isSelect){
                    num++;
                }
            });
            return num;
        },
        showRecord(){
            return this.listData.length
        }
    },
    methods: {
        // 改变选择
        changeSelect (item, e) {
            item.isSelect = e.target.checked;
        },

        // 确定按钮
        confirm () {
            let selectArry = [];  // 已选择的数据
            this.selectIds = [];
            this.listData.map(listItem => {
                if(listItem.isSelect){
                    this.selectIds.push(listItem.id);
                    selectArry.push(listItem)
                }
            });

            this.$emit('confirm', this.selectIds, selectArry);
        },

        // 取消按钮
        cancel () {
            this.$emit('cancel');
        },

        // 加载更多
        loadMore () {
            this.$emit('loadMore');
        },

        clearSelected() {
            this.listData.map((item) => {
                item.isSelect = false
            })
        }
    }
}
</script>
<style lang='scss' scoped>
@import './TeamListSelect.scss';
</style>
