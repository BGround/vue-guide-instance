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
    render() {
        return console.log(this.app.$options.render)
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