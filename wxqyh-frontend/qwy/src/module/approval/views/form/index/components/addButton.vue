<template>
    <div class="add-btn"
        @mouseover="forbidden && (tipsShow = true)"
        @mouseout="forbidden && (tipsShow = false)">
        <div class="btn orange-btn fl form-btn"
            :class="{'forbidden': forbidden}"
            v-perm="'formAdd'"
            @click="!forbidden && showPopFrame('/manager/form/add_form.jsp')">+新增表单</div>
        <div class="btn orange-btn fl drop-down-btn"
            :class="{'forbidden': forbidden}"
            v-perm="'formAdd'"
            @mouseover="!forbidden && (addOption = true)"
            @mouseout="!forbidden && (addOption = false)">
            <div class="white-arrow" :class="{'forbidden': forbidden}"></div>
            <div class="add-option" v-show="addOption">
                <div class="option" @click="fromTemplate">
                    <i class="form-icon from-template"></i>从模版创建</div>
                <div class="option" @click="showPopFrame('/manager/form/add_form_excel.jsp')">
                    <i class="form-icon from-excel"></i>从Excel创建</div>
                <div class="option" v-if="!isUnGroup" @click="showNewGroup">+{{this.currGroup.length == 2 ? '新建标签' : '新建分组'}}</div>
            </div>
        </div>
        <div class="tips" v-show="tipsShow">请启用分组再执行此操作</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'addButton',
    props: {
        forbidden: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            addOption: false,
            tipsShow: false,
            userName: dataBase.config.userName,
            managerType: dataBase.config.managerType,
        }
    },
    computed: {
        ...mapGetters('form/index', [
            'currGroup'
        ]),
        currentGroup() {
            return this.currGroup[this.currGroup.length - 1];
        },
        isUnGroup() {
            return this.currentGroup.id == 'other'
        }
    },
    methods: {
        showPopFrame(url) {// 全局弹窗
            let typeId = this.currentGroup.id,
                parentName = this.currentGroup.name;
            url = _.baseURL + url + '?typeId=' + typeId + '&parentName=' + parentName;
            if(_top.$('#popframe').length == 0) {
                _top.$('body').append('<iframe id="popframe" src=' + url + ' style="width:100%;height:100%;position: fixed;top: 0;left: 0;z-index:1000" frameborder="0" scrolling="no" allowtransparency="true"></iframe>');
            } else {
                _top.$('#popframe').show();
                _top.$('#popframe')[0].contentWindow.loadframe();
            }
        },
        fromTemplate() {// 从模板中新建
            _top.$('.sideMenu-nav [type="form_temp"] a').click();
        },
        showNewGroup() { // 新建分组
            let parentId = this.currentGroup.id,
                parentName = this.currentGroup.name,
                url = _.baseURL + '/manager/form/formtype_addAndEdit.jsp?pageType=add&parentId=' +  parentId + "&parentName=" + parentName,
                creator = this.currentGroup.data && this.currentGroup.data.creator;
            if(this.currGroup.length == 2) {
              if(this.managerType != 0 && this.userName != creator) {
                return _top.top_alert("超管和创建者才可以新建标签", false);
              }
            }
            _top.$(_top.document).find("html").css({"overflow-y": "hidden"});
            _top.$(_top.document).find(".ovarlay2").show();
            //可解决弹框抖动
            _top.$(_top.document).find("body").append('<iframe id="formGroupPop" class="" width="600px" height="430px" src="' + url + '" frameborder="0" scrolling="no" ' +
                'style="position:fixed;left:50%;top:-500px;margin-left: -300px;z-index: 1000;display: none">');
            _top.$(_top.document).find("#formGroupPop").css({
                display: 'block',
                top: "50%",
                marginTop: "-250px",
                height: "430px"
            });
        }
    }
}
</script>

<style scoped>
.add-btn {
    position: relative;
}
.btn {
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 2px;
    margin-right: 10px;
}
.orange-btn {
    color: #fff;
    background: #C31725;
    border: 1px solid rgb(248, 123, 0);
}
.form-btn {
    border-radius: 2px 0 0 2px;
    margin-right: 0;
}
.form-btn:hover {
    background-color: #F08088;
}
.form-btn.forbidden:hover {
    background-color: #eee;
}
.forbidden {
    color: #999999;
    background-color: #eee;
    border: 1px solid #ccc;
}
.drop-down-btn {
    position: relative;
    display: inline-block;
    min-width: 0px;
    width: 12px;
    height: 30px;
    border-radius: 0 2px 2px 0;
    border-left: none;
}
.drop-down-btn.forbidden {
    border-left: none;
}
.white-arrow {
    position: absolute;
    top: 13px;
    right: 12px;
    width: 0;
    height: 0;
    border-width: 5px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
}
.white-arrow.forbidden {
    border-color: #999999 transparent transparent transparent;
}
.add-option {
    position: absolute;
    top: 31px;
    left: -90px;
    z-index: 100;
    width: 122px;
    color: #333;
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: rgb(204, 204, 204) 0px 0px 10px;
    text-align: left;
}
.add-option .option {
    position: relative;
    padding-left: 25px;
    line-height: 36px;
    border-top: 1px solid #EBEBEB;
}
.add-option .option:hover {
    background-color: #F5F5F5;
}
.add-option .option:first-child {
    border: none;
}
.form-icon {
    position: absolute;
    top: 8px;
    left: 5px;
    width: 18px;
    height: 18px;
    background-size: contain;
}
.from-template {
    background: url(../../../../../../assets/images/ic_from_template.png) no-repeat;
}
.from-excel {
    background: url(../../../../../../assets/images/ic_from_excel.png) no-repeat;
}
.tips {
    position: absolute;
    top: -36px;
    left: -23px;
    width: 148px;
    line-height: 28px;
    color: #fff;
    font-size: 12px;
    background-color: #666666;
    border-radius:2px;
    text-align: center;
}
.tips::before {
    position: absolute;
    background: #666;
    border: 1px solid #666;
    content: "";
    width: 8px;
    height: 8px;
    right: 14px;
    top: 23px;
    transform: rotate(45deg);
}
</style>
