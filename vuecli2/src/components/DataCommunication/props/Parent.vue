<template>
  <div>
      <com-article :articles="articleList"></com-article>
  </div>
</template>

<script>
import comArticle from './Child.vue'
export default {
  name: 'HelloWorld',
  components: {comArticle},
  data () {
    return {
      articleList: ['a', 'b', 'c']
    }
  }
}
</script>

<style>

</style>
