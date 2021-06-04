<template>
  <div class="marquee-bar">
    <span>{{text}}</span>
  </div>
</template>

<script>
    export default {
        name: "marquee",
        components: {},
        data() {
            return {
                text: '',
                timer: null,
            }
        },
        props: {
            content:{
                type: String,
                default(){
                    return '';
                }
            }
        },
        methods: {
            run(){
                if(this.text){
                    //获取到头的第一个字符
                    let start = this.text.substring(0,1);
                    //获取到后面的所有字符
                    let end = this.text.substring(1);
                    //重新拼接得到新的字符串，并赋值给this.message
                    this.text = end + start;
                }
            }
        },
        watch:{
            content(value){
                this.text = `${this.content}  ${this.content}`
            }
        },
        created() {
            this.text = `${this.content}  ${this.content}`;
            this.timer = setInterval(this.run,200)
        },
        destroyed() {
            window.clearTimeout(this.timer);
        },
        mounted() {

        }
    }
</script>

<style scoped lang="scss">
  .marquee-bar{
    span{
      white-space: nowrap;
    }
  }
</style>
