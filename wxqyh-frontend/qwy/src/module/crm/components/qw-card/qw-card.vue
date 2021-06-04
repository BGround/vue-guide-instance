<template>
    <div class="card" @click="clickCard">
        <slot name="content"></slot>
    </div>
</template>

<script>
export default {
    name: 'qw-card',
    methods: {
        clickCard(event) {
            this.$emit('click', event);
        }
    }
}
</script>

<style src="./qw-card.scss" lang="scss" scoped></style>

