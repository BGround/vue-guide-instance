// 父组件中
<template>
  <div class="section">
    <com-article :articles="articleList" @onEmitIndex="onEmitIndex"></com-article>
    <p>{{currentIndex}}</p>
  </div>
</template>

<script>
import comArticle from './article.vue'
export default {
  name: 'HelloWorld',
  components: { comArticle },
  data () {
    return {
      currentIndex: -1,
      articleList: ['红楼梦', '西游记', '三国演义']
    }
  },
  methods: {
    onEmitIndex (idx) {
      this.currentIndex = idx
    }
  }
}
</script>
