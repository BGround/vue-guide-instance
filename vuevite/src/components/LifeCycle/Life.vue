<template>
  <h1>{{a.b}}</h1>
</template>

<script>
export default {
    data() {
        return {
            a: {}
        }
    },
    created() {
         this.a.b = 1
    },

    mounted() {
        this.a.b = 2
    }
}
</script>

<style>

</style>