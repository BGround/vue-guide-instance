<template>
    <div class="cheery-switch">
        <div class="cheery-switch__wrap">
            <div :class="value" class="cheery-switch__core"></div>
            <div class="cheery-switch__text no-select">
                <span @click="handleClick('top')" :class="{active: value==='top'}">TOP10</span>
                <span @click="handleClick('bot')" :class="{active: value==='bot'}">BOT10</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            value: this.type,
        }
    },
    props:{
        type: {
            type: String,
            default(){
                return 'top'
            }
        }
    },
    methods:{
        handleClick(type){
            this.value = type
            this.$emit('change', type)
        },
    }
}
</script>

<style lang="scss" scoped>

.cheery-switch{
     .no-select {
        -webkit-touch-callout: none;
        /* iOS Safari */
        -webkit-user-select: none;
        /* Chrome/Safari/Opera */
        -khtml-user-select: none;
        /* Konqueror */
        -moz-user-select: none;
        /* Firefox */
        -ms-user-select: none;
        /* Internet Explorer/Edge */
        user-select: none;
        /* Non-prefixed version, currently
        not supported by any browser */
    }
    .cheery-switch__wrap{
        width:150px;
        height:30px;
        background:rgba(245,248,250,1);
        border:1px solid rgba(230,230,230,1);
        opacity:1;
        border-radius:4px;
        position: relative;
    }
    .cheery-switch__core{
        position: absolute;
        top: 50%;
        margin-top: -11px;
        width:72px;
        height:22px;
        background:rgba(209,3,28,1);
        border-radius:4px;
        transition: all .2s ease;
        &.top{
            left: 4px;
        }
        &.bot{
            left: 74px;
        }
    }
    .cheery-switch__text{
        position: absolute;
        width: 100%;
        height: 100%;
        font-size:14px;
        font-weight:400;
        line-height:30px;
        color:rgba(51,51,51,1);
        display: flex;
        &>span{
            flex-basis: 50%;
            cursor: pointer;
          text-align: center;
        }
        &>.active{
            color:#fff;
        }
    }


}

</style>
