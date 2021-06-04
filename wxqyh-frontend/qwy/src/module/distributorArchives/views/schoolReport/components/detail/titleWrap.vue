<template>
  <div>
    <h4>{{title}}</h4>
    <span>{{description}}</span>
  </div>
</template>
<script>
export default {
  props:{
    title:{
      type: String,
      required: true
    },
    description:{
      type: String,
      default: ''
    }
  },
}
</script>
