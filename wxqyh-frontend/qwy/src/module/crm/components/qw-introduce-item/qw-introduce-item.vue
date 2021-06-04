<template>
    <div class="introduceItem">
        <img class="img_item" :src="imgSrc">
        <div class="text_item">
            <h2>{{title}}</h2>
            <p>{{introduceText}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 图片地址
        imgSrc: {
            type: String,
        },
        // 标题
        title: {
            type: String
        },
        // 介绍文字
        introduceText: {
            type: String
        }
    }
}
</script>

<style src="./qw-introduce-item.scss" lang="scss" scoped></style>

