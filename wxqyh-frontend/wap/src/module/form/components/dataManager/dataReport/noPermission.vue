<template>
    <div class="noPermission">
        <div class="img">
            <img class="img" src="~assets/images/noPermission.png" >
        </div>
        <div class="text">暂无权限</div>
    </div> 
</template>

<script>
export default {
    name: 'noPermission'
}
</script>

<style lang="scss" scoped>
.noPermission {
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
        img {
            width: 156px;
            height: 118px;
        }
    }
}
</style>

