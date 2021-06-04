export default {
  methods: {
    reloadApp(){
      this.$toast('参数错误')
      const id = window.setTimeout(() => {
        window.clearTimeout(id);
        window.location.href = window.location.pathname;
      }, 1500);
    }
  },
}