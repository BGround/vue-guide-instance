<template>
    <div class="noData">
        <div class="img">
        </div>
        <div class="text">暂无数据</div>
    </div> 
</template>

<script>
export default {
    name: 'noData'
}
</script>

<style lang="scss" scoped>
.noData {
    margin-top: 85px;
    font-size: 14px;
    color: #A2A5B2;
    font-weight: 400;
    text-align: center;
    .img {
        display: flex;
        width: 160px;
        height: 160px;
        margin: 0 auto;
        justify-content: center;
        align-items: center;
        background-image: url(../../../assets/images/img_commom_emptypage@2x.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 160px;
    }
}
</style>

