<template>
<div class="index">
    <div class="content">
        <router-view></router-view>
    </div>
    <div class="tabbar">
        <qw-tab-bar v-model="selected" @change="handleTabChage" :data="tabs" :show-slider="false" :scrollable="false">
            <template slot="pane" slot-scope="{pane}">
                <div class="custom-pane">
                    <div class="custom-icon">
                        <i :class="pane.className" class="icon"></i>
                    </div>
                    <p class="custom-text">
                        <span v-text="pane.label"></span>
                    </p>
                </div>
            </template>
        </qw-tab-bar>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            selected: '',
            dealerId: '',
            tabs: [{
                    value: 'development', // 路由名
                    label: '规划',
                    className: 'icon-planning'
                },
                // {
                //   value: 'networkInfo',
                //   label: '入网',
                //   className: 'icon-network'
                // },
                {
                    value: 'building',
                    label: '建设',
                    className: 'icon-build'
                },
                {
                    value: 'operation',
                    label: '运营',
                    className: 'icon-operation'
                },
                {
                    value: 'warning',
                    label: '预警',
                    className: 'icon-warning'
                },
                {
                    value: 'employmentInfo',
                    label: '人员',
                    className: 'icon-network'
                },

                {
                    value: 'basicFile',
                    label: '基础',
                    className: 'icon-basic'
                }
            ],
        }
    },

    methods: {
        handleTabChage(value) {
            const query = this.$route.query;
            value && this.$router.replace({
                name: value,
                query
            });
        },
        initTab() {
            const matchedRouteName = this.$route.matched.map(item => item.name)
            const tab = this.tabs.find(tab => {
                return matchedRouteName.indexOf(tab.value) !== -1
            })
            this.selected = tab.value
        }
    },

    created() {
        this.dealerId = this.$route.query.dealerId || '';
        this.initTab()
    }
}
</script>

<style lang="scss" scoped>
.index {
    height: 100%;
}

.custom-text {
    height: 18px;
    line-height: 18px;
}

.tabbar {
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 2;

    @media screen and (min-width: 1024px) {
        width: 740px;
    }

    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
        border-bottom: 34px solid #ffffff;
    }

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background: rgba(230, 230, 230, 1);
        display: block;
        transform: scaleY(0.5);
        z-index: 10;
    }
}

.content {

    // position: absolute;
    // top: 0;
    // bottom: 50px;
    // left: 0;
    // right: 0;
    // overflow-y: auto;
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
        padding-bottom: 34px;
    }
}

.custom-icon>i {
    display: block;
    width: 22px;
    height: 22px;
    background-size: 100%;
    margin: 0 auto;
    background-position: center;
    background-repeat: no-repeat;
}

/deep/ {
    .qw-tab-bar__pane.is-active {
        color: #c6001f;
    }

    .qw-tab-bar__slider {
        background-color: #c6001f;
    }

    .is-active {
        .icon-planning {
            background-image: url('../../static/images/icon_planning_active.png');
        }

        .icon-network {
            background-image: url('../../static/images/icon_network_active.png');
        }

        .icon-basic {
            background-image: url('../../static/images/icon_basic_active.png');
        }

        .icon-build {
            background-image: url('../../static/images/icon_build_active.png');
        }

        .icon-operation {
            background-image: url('../../static/images/icon_operation_active.png');
        }

        .icon-warning {
            width: 19px;
            height: 22px;
            background-image: url('../../static/images/icon_warning_active.png');
        }
    }

    .icon-planning {
        background-image: url('../../static/images/icon_planning.png');
    }

    .icon-network {
        background-image: url('../../static/images/icon_network.png');
    }

    .icon-basic {
        background-image: url('../../static/images/icon_basic.png');
    }

    .icon-build {
        background-image: url('../../static/images/icon_build.png');
    }

    .icon-operation {
        background-image: url('../../static/images/icon_operation.png');
    }

    .icon-warning {
        width: 19px !important;
        height: 22px !important;
        background-image: url('../../static/images/icon_warning.png');
    }
}
</style>
