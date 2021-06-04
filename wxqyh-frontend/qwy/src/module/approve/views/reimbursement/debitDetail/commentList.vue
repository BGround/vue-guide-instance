<template>
  <div class="comment_list">
     回复：{{num}}
  </div>
</template>
<script>
  export default {
    data() {
      return{
        num:2,
      }
    },
    props: {
      commentList: {
        type: Array,
        required: true
      },
    },
    components: {

    },
    created(){

    },
   /* mounted(){
      this.detailList=this.repayObj.detailVOS;
    },*/
    methods: {

    }
  }
</script>
<style scoped>

</style>
