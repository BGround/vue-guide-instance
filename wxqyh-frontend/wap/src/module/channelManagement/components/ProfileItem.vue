<template>
<div class="profile-item" @click="handleClick">
    <div class="profile-item__avatar">
        <img :src="getAvatar" v-img-fallback alt="">
    </div>
    <div class="profile-item__info">
        <p class="profile-item__name">
            <span>{{getName}}</span>
        </p>
        <p class="profile-item__address">
            <span>{{getAddress || '-'}}</span>
        </p>
    </div>
    <div class="profile-item__status">
        <!-- <span v-if="this.isShowNature && this.data.nature !== ''" :style="{color:'#5294ff',background:'transparent',border:'1px solid #5294ff'}">{{getNature}}</span>
        <span v-else-if="!this.isShowNature" v-show="getStatus">{{getStatus}}</span> -->
        <div v-show="getStatus" class="item_status" :class="statusClass">{{getStatus}}</div>
        <div v-show="getNature" class="item_nature">{{getNature}}</div>
    </div>
</div>
</template>

<script>
import defaultAvatar from '@/module/channelManagement/static/images/logo.jpg'
import marqueeBar from "@/module/channelManagement/components/marqueeBar/index";

export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
        isShowNature: {
            type: Boolean,
            default: false,
        }
    },
    components: {
        marqueeBar
    },
    data() {
        return {}
    },
    computed: {
        getAvatar() {
            return this.data.avatar || defaultAvatar;
        },
        getName() {
            return this.data.name || '';
        },
        getAddress() {
            return this.data.address || '';
        },
        getStatus() {
            const statusMap = window.dataBase.operatingStateMap;
            return statusMap[this.data.status];
        },
        statusClass() {
            const statusClassMap = window.dataBase.operatingStateClassMap;
            return 'item_status_'+statusClassMap[this.data.status];
        },
        getNature() {
            return this.data.nature || '';
        }
    },
    methods: {
        handleClick() {
            this.$emit('click', this.data);
        },
        calculateSpeed(words) {
            console.log(words.length / 3)
            return words.length / 3
        }
    },
}
</script>

<style lang="scss" scoped>
.profile-item {
    padding: 15px 15px 15px 19px;
    background: #ffffff;
    display: flex;
    align-items: center;

    .profile-item__avatar {
        width: 60px;
        height: 60px;
        flex-shrink: 0;
        padding-right: 10px;

        &>img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .profile-item__status {
        flex-shrink: 0;
        padding-left: 10px;
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        align-items: center;

        .item_status {
            display: inline-block;
            padding: 0 3px;
            min-width: 32px;

            &_normal {
                background-color: rgba(0,181,99,1);
                color: rgba(255,255,255,1);
                border: 1px solid rgba(0,181,99,1);
            }
            &_warning {
                background-color: rgba(255,188,0,1);
                color: rgba(255,255,255,1);
                border: 1px solid rgba(255,188,0,1);
            }
            &_nostatus {
                background-color: transparent;
                color: rgba(153, 153, 153, 1);
                border: 1px solid rgba(153, 153, 153, 1);
            }
            &_danger {
                background-color: rgba(198,0,31,1);
                color: rgba(255,255,255,1);
                border: 1px solid rgba(198,0,31,1);
            }
        }

        .item_nature {
            width: 42px;
            margin-top: 8px;
            color: rgba(153, 153, 153, 1);
            background: transparent;
        }

        &>div {
            height: 20px;
            border-radius: 2px;
            text-align: center;
            display: block;
            font-size: 12px;
            line-height: 20px;
        }
    }

    .profile-item__info {
        width: calc(100% - 120px);
    }

    .profile-item__address {
        overflow: auto;
        height: 20px;
        font-size: 13px;
        font-weight: 400;
        line-height: 20px;
        color: rgba(153, 153, 153, 1);
        margin-top: 7px;

        &>span {
            white-space: nowrap;
        }

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .profile-item__name {
        height: 24px;
        font-size: 13px;
        line-height: 24px;
        color: rgba(51, 51, 51, 1);
        overflow: auto;

        &>span {
            white-space: nowrap;
        }

        &::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>
