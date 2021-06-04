<template>
  <div>

    <label>
      <input type="checkbox" v-model="checked" @change="handleChange" class="icon_check">
    </label>
  </div>
</template>

<script>

  export default {
    name: "cherryCheckbox",
    model:{
      event: 'change',
      prop: 'value',
    },
    props: {
      value: {
          type: Boolean,
          default(){
              return false;
          }
      },
    },
    data() {
      return {
        checked: this.value,
      }
    },
    watch:{
        value(value){
            this.checked = value;
        }
    },
    methods: {
        handleChange(){
          this.$emit('change', this.checked);
        }
    },
  }
</script>

<style scoped>
</style>
