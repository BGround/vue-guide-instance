<template>
    <div class="group-setting">
        <div class="header clearfix">
            <div class="fl backTo"  @click="backTo"></div>
            <breadcrumb-nav class="nav fl"
                :navArray="currGroup"
                @navigateTo="navigateTo"></breadcrumb-nav>
        </div>
        <div class="form-control group-name">
            <label for="name">* 分组名称</label>
            <span class="content">
                <input class="name"
                    type="text"
                    id="name"
                    v-model="groupName"
                    maxlength="30">
                <div class="num-count">{{groupName.length}}/30</div>
            </span>
        </div>
        <div class="form-control group-icon">
            <label for="icon">图标</label>
            <div class="currIcon iconfont"
                :class="baseClass + currIcon"
                :style="{'color': currColor}"
                @click.stop="iconBoxShow = !iconBoxShow"></div>
            <div class="icon-box" v-show="iconBoxShow" @click.stop="">
                <h2 class="title">选择图标</h2>
                <ul class="content clearfix">
                    <ul class="color-option clearfix">
                        <li class="color floatItem"
                        v-for="color in colorSet"
                        :key="color"
                        :class="{'ok-icon': currColor == color}"
                        :style="{'background-color': color}"
                        @click.stop="currColor = color"></li>
                    </ul>
                    <ul class="icon-option clearfix">
                        <li class="icon iconfont floatItem"
                        v-for="icon in iconSet"
                        :key="icon"
                        :class="baseClass + icon"
                        :style="iconStyle(icon)"
                        @click.stop="currIcon = icon"></li>
                    </ul>
                </ul>
            </div>
        </div>
        <div class="form-control group-order">
            <label for="order">排序</label>
            <span class="content">
                <input class="order" id="order" maxlength="8" type="text" v-model="sortNum" >
                <div class="button">
                    <i class="plus-btn" @click="sortNum++">
                        <i class="arrow-icon"></i>
                    </i>
                    <i class="minus-btn" @click="sortNum--">
                        <i class="arrow-icon"></i>
                    </i>
                </div>
            </span>

        </div>
        <div class="form-control group-status">
            <label for="status">状态</label>
            <input class="status" id="status" type="checkbox" v-model="status">启用
        </div>
        <div class="footer">
            <div class="confirm-button" @click="save">保存</div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import breadcrumbNav from '@/components/list/breadcrumbNav'
import { updateFormType, findFormType } from '@/module/approval/api/form/index'
let COLORSET = ['#5F9FF3', '#FDAD22', '#54C7C5', '#FF6885', '#9FD457', '#A68AE6'], // 图标颜色数组
    ICONSET = [ 'bianji', 'duihua', 'shijian', 'kaoqin', 'yongche', 'chucha',      // 图标类型数组
                'fasong', 'yonghu', 'gongsi', 'baobiao', 'xiuxian', 'gouwu',
                'jiaoyu', 'shu', 'wenjuan', 'dayin', 'tupian', 'renwu',
                'tongji', 'shuju', 'mokuai', 'kuaisu', 'shoucang', 'biaoqian'];

export default {
    name: 'groupSetting',
    components: {
        breadcrumbNav
    },
    data() {
        return {
            colorSet: COLORSET,
            iconSet: ICONSET,
            group: {},
            groupName: '',
            currColor: '',
            currIcon: '',
            iconBoxShow: false,
            sortNum: '' || 0,
            status: '',
            baseClass: 'bd-b-' // 字体图标基础类名前缀
        }
    },
    computed: {
        ...mapGetters('form/index', [
            'currGroup'
        ]),
        currentGroup() {
            return this.currGroup[this.currGroup.length - 1];
        }
    },
    created() {
        let _this = this;
        findFormType(this.$route.query.id).then(res => {
            if(res.code != "0") {
                return _top.alert("信息提示层", res.desc)
            }
            let group = res.data.formtypePO;
            this.group = res.data.formtypePO;
            this.groupName = group.typeName;
            this.currColor = group.picPath.color || '#5F9FF3';
            this.currIcon = group.picPath.icon || 'chucha';
            this.sortNum = group.sortNum;
            this.status = group.status == '1' ? true : false;
        })
        document.addEventListener('click', this.overAllProtigation)
    },
    methods: {
        ...mapActions('form/index', [
            'SetGroupData',
            'SetSearchValue',
            'SetSetting',
            'GetFormData',
            'SetCurrGroup'
        ]),
        overAllProtigation() {
            if(this.iconBoxShow != undefined) {
                this.iconBoxShow = false;
            }
        },
        iconStyle(icon) {
            let style = {
                'color': this.currColor
            };
            if(icon == this.currIcon) {
                style['border-color'] = this.currColor;
            }
            return style
        },
        navigateTo({name, id}) {
            this.$router.push('tileView')
            this.SetGroupData([]);
            this.SetSearchValue({ 'searchValue.typeId':  id});
            if(name == '全部分组') {
                this.SetSetting({
                    page: 1,
                    pageSize: 40
                })
                this.GetFormData({needLoading: true});
            } else {
                this.SetSetting({ page: 1, pageSize: 5});
            }
        },
        backTo() {
            this.$router.push('tileView')
            this.SetGroupData([]);
            this.currGroup.pop();
            this.SetSearchValue({ 'searchValue.typeId': this.currGroup[this.currGroup.length - 1].id});
            this.SetSetting({ page: 1, pageSize: 5});
        },
        save() {
            let _this = this,
                group = this.currGroup,
                picPath = {
                    color: this.currColor,
                    icon: this.currIcon
                }
            group.pop();
            updateFormType({
                'tbFormTypePO.id': this.group.id,
                'tbFormTypePO.typeName': this.groupName,
                'tbFormTypePO.sortNum': this.sortNum,
                'tbFormTypePO.status': this.status ? 1 : 0,
                'tbFormTypePO.picPath': JSON.stringify(picPath)
            }).then((res) => {
                if(res.code != "0") {
                    return _top.alert("信息提示层", res.desc)
                }
                this.SetCurrGroup(group);
                _this.navigateTo({name: _this.currentGroup.name, id: _this.currentGroup.id});
            })
        }
    },
    watch: {
        sortNum(newVal, oldVal) {
            if(newVal == '') {
                return
            }
            if(!(/^\d+(\.{0,1}\d+){0,1}$/.test(newVal))) {
                this.sortNum = oldVal;
            }
            if(newVal.length > 8) {

            }
        }
    },
    beforeDestroy () {
        document.removeEventListener('click', this.overAllProtigation);
    }
}
</script>

<style scoped>
.group-setting {
    padding-bottom: 100px;
}
.header {
    position: relative;
    padding: 25px 0 15px 35px;
    line-height: 23px;
    border-bottom: 1px solid #E6E6E6;
    margin-bottom: 25px;
}
.backTo {
    position: absolute;
    top: 58%;
    left: 0;
    width: 25px;
    height: 25px;
    transform: translateY(-50%);
    background: url(../../../../../assets/images/ic_back.png) no-repeat;
    background-size: contain;
    cursor: pointer;
}
.nav {
    padding-left: 5px;
}
.form-control {
    padding: 10px 0 10px 60px;
    line-height: 32px;
}
.form-control label {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 25px;
}
.group-name .content {
    position: relative;
}
.name {
    position: relative;
    box-sizing: border-box;
    width: 340px;
    height: 32px;
    line-height: 32px;
    padding: 5px 35px 5px 10px;
    border: 1px solid #D5D5D5;
}
.num-count {
    position: absolute;
    top: 50%;
    right: 5px;
    font-size: 12px;
    color: #999999;
    transform: translateY(-50%);
}
.group-icon {
    position: relative;
}
.currIcon {
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
    vertical-align: bottom;
    cursor: pointer;
}
.icon-box {
    position: absolute;
    top: 10px;
    left: 230px;
    z-index: 999;
    width: 290px;
    height: 290px;
    padding: 20px;
    border: 1px solid #ddd;
    background-color: #fff;
    box-shadow: #ddd 0 0 5px 2px;
}
.title {
    line-height: 24px;
    margin-bottom: 10px;
}
.floatItem {
    float: left;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    margin: 0 10px 10px 0;
    cursor: pointer;
}
.floatItem:nth-child(6n) {
    margin: 0;
}
.icon {
    text-align: center;
    line-height: 40px;
    font-size: 30px;
    border: 1px solid #E6E6E6;
    border-radius: 2px;
}
.color-option {
    margin-bottom: 10px;
}
.ok-icon {
    background: url(../../../../../assets/images/ic_ok.png) no-repeat center;
}
.group-status .status {
    margin-right: 10px;
    cursor: pointer;
}
.group-order .content {
    display: inline-block;
    position: relative;
}
.group-order .order {
    box-sizing: border-box;
    width: 120px;
    height: 32px;
    line-height: 32px;
    padding: 0 25px 0 10px;
    border: 1px solid #D5D5D5;
}
.group-order .button {
    position: absolute;
    top: 0;
    right: 0;
    width: 22px;
    height: 32px;
    border-left: 1px solid #E6E6E6;
}
.button .plus-btn, .button .minus-btn {
    position: relative;
    display: block;
    width: 22px;
    height: 16px;
    cursor: pointer;
}
.button .plus-btn {
    border-bottom: 1px solid #E6E6E6;
}
.plus-btn .arrow-icon {
    transform: translate(-50%, -50%) rotate(-90deg);
}
.minus-btn .arrow-icon {
    transform: translate(-50%, -50%) rotate(90deg);
}
.arrow-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: url(../../../../../assets/images/ic_arrow.png) no-repeat center;
    transform: translate(-50%, -50%);
}
.footer {
    position: relative;
    text-align: center;
    margin-top: 60px;
    width: 100%;
    height: 100px;
    line-height: 100px;
    border-top: 1px solid #E6E6E6;
}
.confirm-button {
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    width: 60px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    color: #fff;
    background-color: #C31725;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    cursor: pointer;
}
</style>

