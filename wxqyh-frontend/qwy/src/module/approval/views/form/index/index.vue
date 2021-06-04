<template>
    <div id='index'>
        <formHeader v-if="!showNoData" ref="header"></formHeader>
        <router-view v-if="!showNoData"></router-view>
        <!-- 表单缺省图 -->
        <div class="noFormData" v-if="showNoData">
            <img class="mt60" src="@/assets/images/nav_form.png">
            <div class="mt50">
                <div class="form-button mt15" @click="createdForm">+ 新建表单</div>
                <div class="form-button mt15 ml20" @click="showNewGroup" >+ 新建分组</div>
                <div class="form-button mt15 ml20" @click="fromTemplate">+ 从模版中心创建</div>
            </div>
        </div>
        <!-- 非VIP提示 -->
        <div class="notGoldVip" v-if="showVipTips">
            <div class="img">
                <a class="vipLink" :href="vipLink" target="blank"></a>
            </div>
        </div>
        <!-- 表单数据小于5条时提示 -->
        <div class="formTips" v-if="showFormTips">
            <div class="noMoreTips" v-show="setting.totalRows > 5" @click="noMoreTips">× 不再显示</div>
        </div>
        <div class="guide-tip" v-if="showGuide">
            <div class="view-box fr">
                <div class="view-icon listView-on-icon" ></div>
                <div class="view-icon tileView-icon" ></div>
            </div>
            <div class="view-guide">
                <div class="guide-image fl"></div>
                <div class="guide-text fl">
                    <span class="guide-title">分组管理已经升级为分组视图</span><br>
                    <span>点击这里可以切换为分组视图。分组视图使用平铺展示分组，让表单管理更便捷有序。</span>
                    <span class="guide-btn" @click="removeTips">我知道了</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import formHeader from './formHeader'
import listView from './listView'
import tileView from './tileView'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { resetFrameHeight } from '@/assets/js/common.js'
import { getViewMode, getViewModeTips, setViewModeTips, isWhiteCorpId } from '@/module/approval/api/form/index'

export default {
    name: 'index',
    components: {
        formHeader,
        listView,
        tileView
    },
    created() {
        if(window.frameElement) {
            window._top = window.top
            _top.confirm = window.top._confirm;
            _top.alert = window.top._alert;
            _top.top_alert = window.top._top_alert;
        } else {
            window._top = _;
        }
        let _this = this;
        this.SetSetting({totalRows: 1});
        this.listenLeave();
        this.setBefore().then(({isSearch, group}) => {
            let viewMode = '';
            if((group && group.id == 'other') || isSearch) {
                viewMode = '1'
            }
            this.GetFormData({needLoading: true, viewMode: viewMode}).then(res => {
                if(this.showDefaultDiagram(res)) {
                    return
                }
                this.showGroupGuide();
                this.showTips();
                switch(this.viewMode) {
                    case '1': _this.$router.replace('/form/listView');
                            break;
                    case '2': _this.$router.replace('/form/tileView');
                            break;
                }
            })
        });
        let whiteCopidParam = {
          "agentCode": "form",
          "agentFunction": "form_custom_print"
        }
        isWhiteCorpId(whiteCopidParam).then((result) => {
          if (result.code == "0") {
            this.SetIsWhiteCorpid(result.data.isWhiteCorpId);
          }
        })
    },
    data() {
        return {
            vipLink: _.baseURL + '/qiweipublicity/companysrv/vip/vip_index.jsp',
            showGuide: false,
            userName: dataBase.config.userName
        }
    },
    computed: {
        ...mapGetters('form/index', [
            'showVipTips',
            'showNoData',
            'showFormTips',
            'setting',
            'searchValue',
            'currGroup',
            'isSearch',
            'viewMode',
            'showResult'
        ])
    },
    updated() {
        if(window.frameElement) {
            window.frameElement.height = window.document.body.scrollHeight
        }
    },
    methods: {
        ...mapActions('form/index', [
            'SetFormTips',
            'GetFormData',
            'SetSetting',
            'SetSearchValue',
            'SetCurrGroup',
            'SetNoData',
            'SetIsSearch',
            'SetShowResult',
            'SetIsWhiteCorpid',
        ]),
        ...mapMutations('form/index', [
            'SET_VIEWMODE'
        ]),
        // 离开页面前进行缓存
        listenLeave() {
            window.onunload = () => {
                sessionStorage.setItem(this.userName + 'viewMode', JSON.stringify(this.viewMode));
                sessionStorage.setItem(this.userName + 'setting', JSON.stringify(this.setting));
                sessionStorage.setItem(this.userName + 'currGroup', JSON.stringify(this.currGroup));
                sessionStorage.setItem(this.userName + 'searchValue', JSON.stringify(this.searchValue));
                sessionStorage.setItem(this.userName + 'isSearch', JSON.stringify(this.isSearch));
                sessionStorage.setItem(this.userName + 'showResult', JSON.stringify(this.showResult));
            }
        },
        // 将页面设置回之前的状态
        setBefore() {
            return new Promise((resolve, reject) => {
                let viewMode = JSON.parse(sessionStorage.getItem(this.userName + 'viewMode')),
                    setting = JSON.parse(sessionStorage.getItem(this.userName + 'setting')),
                    currGroup = JSON.parse(sessionStorage.getItem(this.userName + 'currGroup')),
                    searchValue = JSON.parse(sessionStorage.getItem(this.userName + 'searchValue')),
                    isSearch = JSON.parse(sessionStorage.getItem(this.userName + 'isSearch')),
                    showResult = JSON.parse(sessionStorage.getItem(this.userName + 'showResult'));
                if(currGroup && currGroup[currGroup.length - 1].name == '分组设置') {
                    return resolve();
                }
                getViewMode().then(res => {
                    if(res.code != '0') {
                        reject();
                        return _top.alert('信息提示层', res.desc);
                    }
                    if(setting && res.data.viewMode == viewMode) {
                        if(viewMode == '2') {
                            setting.page = 1;
                        }
                        this.SET_VIEWMODE(viewMode);
                        this.SetSetting(setting);
                        this.SetCurrGroup(currGroup);
                        this.SetSearchValue(searchValue);
                        this.SetIsSearch(isSearch);
                        this.SetShowResult(showResult);
                    }
                    resolve({isSearch: isSearch, group: currGroup && currGroup[currGroup.length - 1]});
                })
            })
        },
        // 创建表单
        createdForm() {
            let url = _.baseURL + '/manager/form/add_form.jsp';
            if(_top.$('#popframe').length == 0) {
                _top.$('body').append('<iframe id="popframe" src=' + url + ' style="width:100%;height:100%;position: fixed;top: 0;left: 0;z-index:1000" frameborder="0" scrolling="no" allowtransparency="true"></iframe>');
            } else {
                _top.$('#popframe').show();
                _top.$('#popframe')[0].contentWindow.loadframe();
            }
        },
        // 从模板创建
        fromTemplate() {
            _top.$('.sideMenu-nav [type="form_temp"] a').click();
        },
        // 新建分组
        showNewGroup() {
            let url = _.baseURL + '/manager/form/formtype_addAndEdit.jsp?pageType=add';
            _top.$(_top.document).find("html").css({"overflow-y": "hidden"});
            _top.$(_top.document).find(".ovarlay2").show();
            //可解决弹框抖动
            _top.$(_top.document).find("body").append('<iframe id="formGroupPop" class="" width="600px" height="430px" src="' + url + '" frameborder="0" scrolling="no" ' +
                'style="position:fixed;left:50%;top:-500px;margin-left: -300px;z-index: 1000;display: none">');
            _top.$(_top.document).find("#formGroupPop").fadeIn(200).animate({
                top: "50%",
                marginTop: "-250px",
                height: "430px"
            }, 500);
        },
        // 是否显示缺省图
        showDefaultDiagram(res) {
            if(!sessionStorage.getItem(this.userName + 'setting') && !res.data.pageData.length && res.data.totalRows == 0) {
                this.SetNoData(true);
                return true
            } else {
                return false
            }
        },
        // 是否显示视图模式引导
        showGroupGuide() {
            getViewModeTips().then( res => {
                if(res.code != '0') {
                    return _top.alert('信息提示层', res.desc);
                }
                if(res.data.value == '0') {
                    this.showGuide = false;
                } else {
                    this.showGuide = true;
                }
            });
        },
        // 视图模式引导隐藏
        removeTips() {
            setViewModeTips('0').then(res => {
                if(res.code != '0') {
                    return _top.alert('信息提示层', res.desc);
                }
                this.showGuide = false;
            })
        },
        // 是否显示 '表单数据小于5条时的提示'
        showTips() {
            if(dataBase.config.org_config && dataBase.config.org_config['FORM_isShowFormGuide'] != 1) {
                this.SetFormTips(true);
            }
        },
        // 不再需要 '表单数据小于5条时的提示'
        noMoreTips() {
            this.SetFormTips(false)
            _top.setOrgConfig("FORM_isShowFormGuide",1);
        },
    },
    watch: {
        $route(val) {
            let path = val.path;
            if(path == '/form') {
                window.onunload = () => {
                    sessionStorage.removeItem(this.userName + 'viewMode');
                    sessionStorage.removeItem(this.userName + 'setting');
                    sessionStorage.removeItem(this.userName + 'currGroup');
                    sessionStorage.removeItem(this.userName + 'searchValue');
                    sessionStorage.removeItem(this.userName + 'isSearch');
                    sessionStorage.removeItem(this.userName + 'showResult');
                }
                this.$router.go(0)
            }
        }
    }
}
</script>

<style scoped>
    .authorizedToOthers {
        background: url(../../../../../assets/images/ic_authorizedToOthers.png) no-repeat;
    }
    .authorizedByOthers {
        background: url(../../../../../assets/images/ic_authorizedByOthers.png) no-repeat;
    }
    .notGoldVip {
        width: 100%;
        height: 100%;
        z-index: 10000;
    }
    .notGoldVip .img {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 942px;
        height: 798px;
        transform: translate(-50%, -50%);
        background: #fbfbfb url(../../../../../assets/images/form_statistics_pop.png) no-repeat;
    }
    .notGoldVip .vipLink{
        position: absolute;
        top: 480px;
        left: 370px;
        width: 200px;
        height: 46px;
    }
    .noFormData {
        text-align: center;
    }
    .form-button {
        display: inline-block;
        padding: 13px 30px;
        font-size: 17px;
        border:1px solid #C31725;
        border-radius: 25px;
        color: #C31725;
    }
    .form-button:hover {
        background-color: #C31725;
        color: #fff;
        cursor: pointer;
    }
    .formTips {
        position: relative;
        left: 50%;
        height: 340px;
        width: 940px;
        background: url(../../../../../assets/images/formTips.jpg) no-repeat;
        transform: translateX(-50%);
    }
    .noMoreTips {
        position: absolute;
        top: 25px;
        right: 25px;
        color: #999;
        font-size: 14px;
        cursor: pointer;
    }
    /* 分组引导 */
    .guide-tip {
        position: absolute;
        top: 0;
        left: 0;
        height: 1200px;
        width: 100%;
        background-color: rgba(255,255,255,.5);
        z-index: 10;
    }
    .view-guide {
        box-sizing: border-box;
        position: absolute;
        top: 116px;
        right: 0;
        z-index: 1;
        width: 520px;
        height: 210px;
        padding: 32px 24px 32px 32px;
        border-radius: 4px;
        border: 1px solid #E6E6E6;
        box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.15);
        background-color: white;
    }
    .view-guide::before {
        background: white;
        border: 1px solid #E6E6E6;
        border-right: none;
        border-bottom: none;
        content: "";
        width: 20px;
        height: 20px;
        right: 22px;
        position: absolute;
        top: -11px;
        transform: rotate(45deg);
        box-shadow: -3px -3px 12px 0px rgba(0, 0, 0, 0.08);
    }
    .view-box {
        position: relative;
        line-height: 32px;
        padding: 3px 0;
        border: 1px solid #ccc;
        top: 72px;
    }
    .view-icon {
        float: left;
        width: 14px;
        height: 14px;
        margin: 0 10px;
        cursor: pointer;
    }
    .guide-image {
        width: 130px;
        height: 144px;
        margin-right: 35px;
        background: url(../../../../../assets/images/pic_b-guide.svg) no-repeat;
    }
    .guide-text {
        width: 295px;
        color: #666666;
        font-size: 14px;
        line-height: 20px;
    }
    .guide-title {
        display: inline-block;
        margin-bottom: 8px;
        line-height: 36px;
        color: #333;
        font-weight: bold;
        font-size: 15px;
        font-family: MicrosoftYaHei-Bold;
    }
    .guide-btn {
        position: absolute;
        bottom: 35px;
        right: 28px;
        color: #F87B00;
        cursor: pointer;
    }
    .listView-on-icon {
        background: url(../../../../../assets/images/ic-list-on.png) no-repeat center;
    }
    .tileView-icon {
        background: url(../../../../../assets/images/ic-grid.png) no-repeat center;
    }
</style>
